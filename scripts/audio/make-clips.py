#!/usr/bin/env python3
"""Make the read-aloud clips: one MP3 per (reader, language, line).

    npx vite-node scripts/audio/collect-lines.ts > /tmp/lines.json
    python3 scripts/audio/make-clips.py /tmp/lines.json [--workers 6] [--only mom|dad] [--dry-run]

Reads the voice presets in scripts/audio/voices.json (which Azure voice, rate
and lexicon each reader uses per language) and writes:

    public/audio/<reader>/<stem>.mp3      stem = sha256(preset + ssml)[:16]
    public/audio/manifest.json            {reader: {lang: {line: stem}}}

A clip is named by a hash of everything that shapes its sound, so editing a
line, a voice, a rate or a lexicon entry makes a new name; an existing file is
never regenerated, and files no manifest refers to are deleted at the end.

Each clip is checked before it is kept: its spoken length must be plausible for
its words (HD voices occasionally run on into made-up speech on short inputs),
or it is synthesised again, up to five times, and reported if it never fits.
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import time
import unicodedata
import urllib.error
import urllib.request
import wave
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'audio'
VOICES = Path(__file__).with_name('voices.json')
LOCALE = {'en': 'en-IN', 'te': 'te-IN', 'ta': 'ta-IN'}


def key() -> str:
    k = os.environ.get('AZURE_SPEECH_KEY')
    return k or (Path.home() / '.config/kids-art/key').read_text().strip()


def ffmpeg() -> str:
    try:
        import imageio_ffmpeg  # type: ignore
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return 'ffmpeg'


def text_key(text: str) -> str:
    """Must match textKey() in src/audio/readAloud.ts."""
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', text)).strip()


def apply_lexicon(text: str, lexicon: dict[str, dict]) -> str:
    """Escape the line for SSML and replace each lexicon word with its markup.

    Longest words first, whole words only, case-sensitive (names are capitalised).
    """
    out = escape(text)
    for word in sorted(lexicon, key=len, reverse=True):
        rule = lexicon[word]
        method, value = rule['method'], rule.get('value', '')
        if method == 'plain':
            continue
        if method == 'sub':
            rep = f'<sub alias="{escape(value)}">{escape(word)}</sub>'
        elif method == 'lang':
            rep = f"<lang xml:lang='{rule['locale']}'>{escape(value)}</lang>"
        elif method == 'phoneme':
            rep = f'<phoneme alphabet="ipa" ph="{escape(value)}">{escape(word)}</phoneme>'
        else:
            raise ValueError(f'unknown lexicon method {method} for {word}')
        out = re.sub(rf'(?<![\w<]){re.escape(escape(word))}(?![\w>])', lambda _m, r=rep: r, out)
    return out


def ssml(preset: dict, lang: str, text: str) -> str:
    loc = LOCALE[lang]
    body = apply_lexicon(text, preset.get('lexicon', {}))
    if not preset['voice'].startswith(loc):
        body = f"<lang xml:lang='{loc}'>{body}</lang>"
    if preset.get('rate'):
        body = f"<prosody rate='{preset['rate']}'>{body}</prosody>"
    return (f"<speak version='1.0' xml:lang='{loc}' xmlns='http://www.w3.org/2001/10/synthesis' "
            f"xmlns:mstts='https://www.w3.org/2001/mstts'><voice name='{preset['voice']}'>{body}</voice></speak>")


def stem_for(preset: dict, doc: str) -> str:
    # The voice, rate and the exact SSML decide the sound; the lexicon is inside the SSML.
    sig = json.dumps({'voice': preset['voice'], 'format': preset.get('format', 'mp3-48k')}, sort_keys=True) + '\n' + doc
    return hashlib.sha256(sig.encode()).hexdigest()[:16]


_lock = threading.Lock()


def synth(doc: str, attempts: int = 8) -> bytes:
    req = urllib.request.Request(
        'https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1', data=doc.encode(), method='POST',
        headers={'Ocp-Apim-Subscription-Key': key(), 'Content-Type': 'application/ssml+xml',
                 'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm', 'User-Agent': 'kids-stuff-audio'})
    last = ''
    for i in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            last = f'{e.code} {e.read()[:200]!r}'
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(min(60, 2 * 2 ** i))
                continue
            raise RuntimeError(last) from e
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            last = repr(e)
            time.sleep(min(60, 2 * 2 ** i))
    raise RuntimeError(last)


def speech_seconds(wav_bytes: bytes) -> float:
    """Seconds between the first and last sample above a quiet threshold."""
    import array
    with tempfile.NamedTemporaryFile(suffix='.wav') as f:
        f.write(wav_bytes)
        f.flush()
        with wave.open(f.name) as w:
            rate = w.getframerate()
            pcm = array.array('h', w.readframes(w.getnframes()))
    win = rate // 50
    loud = [i for i in range(0, len(pcm), win) if max((abs(x) for x in pcm[i:i + win]), default=0) > 900]
    return (loud[-1] - loud[0] + win) / rate if loud else 0.0


def plausible(text: str, lang: str, seconds: float) -> bool:
    """A loose band: made-up run-on speech is several times too long; a cut clip is far too short."""
    if lang == 'en':
        units = max(1, len(text.split()))
        lo, hi = units / 6.0, 1.6 + units / 1.4  # 360 wpm .. ~85 wpm plus a pause allowance
    else:
        units = max(1, len(re.sub(r'\W', '', text)))  # letters, for scripts without English word spacing
        lo, hi = units / 30.0, 1.8 + units / 3.0
    return lo <= seconds <= hi


def encode(wav_bytes: bytes, dest: Path) -> None:
    tmp = dest.with_suffix('.part')
    p = subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'wav', '-i', 'pipe:0',
                        '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2:LRA=11',
                        '-ar', '24000', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '48k', '-f', 'mp3', str(tmp)],
                       input=wav_bytes, capture_output=True)
    if p.returncode:
        raise RuntimeError(p.stderr.decode()[:300])
    tmp.replace(dest)


def make_one(reader: str, lang: str, text: str, preset: dict, dry: bool) -> tuple[str, str, str, str]:
    doc = ssml(preset, lang, text)
    stem = stem_for(preset, doc)
    dest = OUT / reader / f'{stem}.mp3'
    if dest.exists() and dest.stat().st_size > 500:
        return reader, lang, text, stem
    if dry:
        return reader, lang, text, stem
    for attempt in range(5):
        wav_bytes = synth(doc)
        secs = speech_seconds(wav_bytes)
        if plausible(text, lang, secs):
            encode(wav_bytes, dest)
            return reader, lang, text, stem
        with _lock:
            print(f'  implausible {secs:.1f}s ({reader}/{lang}, try {attempt + 1}): {text[:70]}', file=sys.stderr)
    raise RuntimeError(f'never plausible: {reader}/{lang}: {text[:80]}')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('lines')
    ap.add_argument('--workers', type=int, default=6)
    ap.add_argument('--only', choices=('mom', 'dad'))
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--keep-orphans', action='store_true')
    a = ap.parse_args()

    lines: dict[str, list[str]] = json.loads(Path(a.lines).read_text())
    presets: dict[str, dict[str, dict]] = json.loads(VOICES.read_text())['readers']
    jobs = []
    for reader, langs in presets.items():
        if a.only and reader != a.only:
            continue
        (OUT / reader).mkdir(parents=True, exist_ok=True)
        for lang, preset in langs.items():
            for text in lines.get(lang, []):
                jobs.append((reader, lang, text_key(text), preset))

    manifest_path = OUT / 'manifest.json'
    manifest: dict = json.loads(manifest_path.read_text()) if manifest_path.exists() and a.only else {}
    for reader in presets:
        if not a.only or reader == a.only:
            manifest[reader] = {}
    failed, done, t0 = [], 0, time.time()
    with cf.ThreadPoolExecutor(a.workers) as ex:
        futs = {ex.submit(make_one, r, l, t, p, a.dry_run): (r, l, t) for r, l, t, p in jobs}
        for f in cf.as_completed(futs):
            r, l, t = futs[f]
            try:
                _, _, _, stem = f.result()
                manifest.setdefault(r, {}).setdefault(l, {})[t] = stem
            except Exception as e:  # noqa: BLE001 - report every failure, keep going
                failed.append((r, l, t, str(e)[:200]))
            done += 1
            if done % 200 == 0:
                print(f'{done}/{len(jobs)} in {time.time() - t0:.0f}s, {len(failed)} failed', file=sys.stderr)

    if not a.dry_run:
        tmp = manifest_path.with_suffix('.part')
        tmp.write_text(json.dumps(manifest, ensure_ascii=False, sort_keys=True, separators=(',', ':')))
        tmp.replace(manifest_path)
        if not a.keep_orphans and not a.only and not failed:
            live = {f'{r}/{s}.mp3' for r, langs in manifest.items() for m in langs.values() for s in m.values()}
            for f in OUT.glob('*/*.mp3'):
                if f'{f.parent.name}/{f.name}' not in live:
                    f.unlink()
    total = sum(f.stat().st_size for f in OUT.glob('*/*.mp3'))
    print(json.dumps({'jobs': len(jobs), 'failed': len(failed), 'files': len(list(OUT.glob('*/*.mp3'))), 'mb': round(total / 1e6, 1)}))
    for r, l, t, e in failed[:20]:
        print(f'FAILED {r}/{l}: {t[:80]} :: {e}', file=sys.stderr)
    return 1 if failed else 0


if __name__ == '__main__':
    raise SystemExit(main())
