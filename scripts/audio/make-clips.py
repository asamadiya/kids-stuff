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
    # The Speech resource is kids-speech-eus2 (personal subscription, sites-rg, eastus2).
    k = os.environ.get('AZURE_SPEECH_KEY')
    return k or (Path.home() / '.config/kids-audio/speech-key').read_text().strip()


def ffmpeg() -> str:
    try:
        import imageio_ffmpeg  # type: ignore
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return 'ffmpeg'


def text_key(text: str) -> str:
    """Must match textKey() in src/audio/readAloud.ts."""
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFC', text)).strip()


# Visible text -> what the voice should say. The clip is still keyed by the
# visible text; only the speech is rewritten. Each rule is from a measured
# failure (.redesign/v4/hazard/probe*.py, research/pace.md "Text problems"):
#   "4 − 1" (U+2212) was read "four when one" / "foremen"; "minus" fixes it.
#   "floor −2" was read "floors two"; "minus 2" fixes it.
#   "4 o'clock" lost "o'clock" in 2 of 3 Meera takes; <sub alias="o clock"> kept it in 8 of 8.
#   "58 g" was read "fifty eight g"; units are spelled out.
#   "Thatha's number: 14" made Meera insert a word at the colon; "number is 14" did not.
SPEECH: list[tuple[str, str]] = [
    (r'(\d)\s*−\s*(\d)', r'\1 minus \2'),
    (r'−\s*(\d)', r'minus \1'),
    (r'(\d)\s*×\s*(\d)', r'\1 times \2'),
    (r'(\d)\s*÷\s*(\d)', r'\1 divided by \2'),
    (r'(\d)\s*–\s*(\d)', r'\1 to \2'),
    (r'\b(\d+(?:\.\d+)?)\s?cm\b', r'\1 centimetres'),
    (r'\b1\s?m\b', r'1 metre'),
    (r'\b(\d+(?:\.\d+)?)\s?m\b', r'\1 metres'),
    (r'\b1\s?g\b', r'1 gram'),
    (r'\b(\d+(?:\.\d+)?)\s?g\b', r'\1 grams'),
    (r'\b1\s?s\b', r'1 second'),
    (r'\b(\d+(?:\.\d+)?)\s?s\b(?![\'’])', r'\1 seconds'),
    (r'\b1\s?h\b', r'1 hour'),
    (r'\b(\d+)\s?h\b', r'\1 hours'),
    (r"number:\s*(\d)", r'number is \1'),
]
OCLOCK = re.compile(r"o['’]clock")


def speakable(text: str) -> str:
    for pat, rep in SPEECH:
        text = re.sub(pat, rep, text)
    return text


def apply_lexicon(text: str, lexicon: dict[str, dict]) -> str:
    """Escape the line for SSML and replace each lexicon word with its markup.

    Longest words first, whole words only, case-sensitive (names are capitalised).
    """
    out = escape(speakable(text))
    out = OCLOCK.sub('<sub alias="o clock">o\'clock</sub>', out)
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
    sig = json.dumps({'voice': preset['voice'], 'format': 'mp3-32k-loudnorm-18'}, sort_keys=True) + '\n' + doc
    return hashlib.sha256(sig.encode()).hexdigest()[:16]


_lock = threading.Lock()


def synth(doc: str, attempts: int = 8) -> bytes:
    if os.environ.get('KIDS_AUDIO_SOCKS'):
        return synth_curl(doc, os.environ['KIDS_AUDIO_SOCKS'], attempts)
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


def synth_curl(doc: str, socks: str, attempts: int) -> bytes:
    """The same request through curl over a SOCKS proxy (KIDS_AUDIO_SOCKS=host:port),
    for a box whose direct egress to Azure is blocked; urllib has no SOCKS support."""
    last = ''
    for i in range(attempts):
        p = subprocess.run(
            ['curl', '-s', '-m', '120', '--socks5-hostname', socks, '-X', 'POST',
             'https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1',
             '-H', f'Ocp-Apim-Subscription-Key: {key()}', '-H', 'Content-Type: application/ssml+xml',
             '-H', 'X-Microsoft-OutputFormat: riff-24khz-16bit-mono-pcm', '-H', 'User-Agent: kids-stuff-audio',
             '--data-binary', '@-', '-w', '\n%{http_code}'],
            input=doc.encode(), capture_output=True)
        body, _, code = p.stdout.rpartition(b'\n')
        code = code.decode() or '000'
        if p.returncode == 0 and code == '200':
            return body
        last = f'{code} curl={p.returncode} {body[:200]!r}'
        if code in ('401', '403', '400'):
            raise RuntimeError(last)
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


def spoken_words(text: str) -> int:
    """Words as spoken: "152" is three ("one hundred fifty-two"), not one."""
    n = 0
    for tok in speakable(text).split():
        digits = re.sub(r'\D', '', tok)
        n += 1 + (len(digits) - 1 if len(digits) > 1 else 0)
    return max(1, n)


def plausible(text: str, lang: str, seconds: float, wpm: float) -> bool:
    """Spoken length against what this voice's measured pace predicts.

    A run-on (an HD voice inventing speech after the line) or a cut clip falls
    outside 0.45x..1.7x of the expected duration, plus a second for the shortest
    lines. research/lexicon.md measured Meera running on 5-60 s in ~0.3% of clips;
    the earlier band let a short run-on through on a long line.
    """
    if lang == 'en':
        expect = spoken_words(text) / wpm * 60
    else:
        # Syllables, not letters: one per consonant or independent vowel (a vowel
        # sign or virama rides on its consonant; Python's \W would drop the signs).
        # About 4 a second, plus a measured ~0.45 s for each ! ? , or full stop.
        syll = sum(1 for ch in text if unicodedata.category(ch) == 'Lo')
        pauses = sum(text.count(c) for c in '!?,.')
        expect = max(1, syll) / 4.0 + 0.45 * pauses
    # The upper bound catches run-on speech; the lower bound only an empty or cut
    # clip (a one-syllable Tamil word is a genuine 0.2 s, and native voices read
    # short lines fast, so te/ta get a loose floor).
    floor = max(0.12, 0.45 * expect - 0.3) if lang == 'en' else min(0.15, 0.25 * expect)
    return floor <= seconds <= 1.7 * expect + 1.0


def encode(wav_bytes: bytes, dest: Path) -> None:
    tmp = dest.with_suffix('.part')
    p = subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'wav', '-i', 'pipe:0',
                        '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2:LRA=11',
                        '-ar', '24000', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '32k', '-f', 'mp3', str(tmp)],
                       input=wav_bytes, capture_output=True)
    if p.returncode:
        # silenceremove + areverse can leave the graph with no input on an
        # unusual clip; encode it untrimmed rather than lose the line.
        p = subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'wav', '-i', 'pipe:0',
                            '-af', 'loudnorm=I=-18:TP=-2:LRA=11', '-ar', '24000', '-ac', '1', '-c:a', 'libmp3lame',
                            '-b:a', '32k', '-f', 'mp3', str(tmp)], input=wav_bytes, capture_output=True)
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
        if plausible(text, lang, secs, preset.get('wpm', 145)):
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
