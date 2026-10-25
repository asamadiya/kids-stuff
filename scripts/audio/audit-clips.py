#!/usr/bin/env python3
"""Spot-check generated read-aloud clips: transcribe a random sample, score, list the worst.

    python3 scripts/audio/audit-clips.py public/audio/manifest.json [--n 150] [--seed 1]

Each sampled clip is decoded to 16 kHz WAV and sent to Azure speech-to-text in
its own language; the transcript is compared with the line (character error
rate after normalising case, punctuation, spacing and spoken numbers). This is
a screening test, not proof of good pronunciation (advisor a9: listen too).
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import json
import random
import re
import subprocess
import unicodedata
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
KEY = (Path.home() / '.config/kids-art/key').read_text().strip()
LOC = {'en': 'en-IN', 'te': 'te-IN', 'ta': 'ta-IN'}
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = 'twenty thirty forty fifty sixty seventy eighty ninety'.split()


def ffmpeg() -> str:
    import imageio_ffmpeg  # type: ignore
    return imageio_ffmpeg.get_ffmpeg_exe()


def words(n: int) -> str:
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10 - 2] + ('' if n % 10 == 0 else ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + 'hundred' + ('' if n % 100 == 0 else words(n % 100))
    return str(n)


def norm(s: str, lang: str) -> str:
    s = unicodedata.normalize('NFC', s).lower()
    if lang == 'en':
        s = re.sub(r'\d+', lambda m: words(int(m.group())), s)
        s = s.replace('−', 'minus').replace('+', 'plus').replace('=', 'equals').replace('¢', 'cents')
        s = s.replace("o'clock", 'oclock').replace('o’clock', 'oclock')
    return re.sub(r'[\W_]+', '', s)


def cer(a: str, b: str) -> float:
    if not a:
        return 0.0
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i] + [0] * len(b)
        for j, cb in enumerate(b, 1):
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb))
        prev = cur
    return prev[-1] / len(a)


def stt(mp3: Path, lang: str) -> str:
    wav = subprocess.run([ffmpeg(), '-hide_banner', '-loglevel', 'error', '-i', str(mp3), '-af', 'adelay=500|500,apad=pad_dur=0.6',
                          '-ar', '16000', '-ac', '1', '-f', 'wav', 'pipe:1'], capture_output=True, check=True).stdout
    req = urllib.request.Request(
        f'https://eastus2.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={LOC[lang]}&format=simple',
        data=wav, method='POST', headers={'Ocp-Apim-Subscription-Key': KEY, 'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000'})
    return json.loads(urllib.request.urlopen(req, timeout=120).read()).get('DisplayText', '')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('manifest')
    ap.add_argument('--n', type=int, default=150)
    ap.add_argument('--seed', type=int, default=1)
    ap.add_argument('--out', default='')
    a = ap.parse_args()
    m = json.loads(Path(a.manifest).read_text())
    items = [(r, l, t, s) for r, langs in m.items() for l, d in langs.items() for t, s in d.items()]
    random.Random(a.seed).shuffle(items)
    items = items[: a.n]

    def one(it):
        r, l, t, s = it
        heard = stt(ROOT / 'public' / 'audio' / r / f'{s}.mp3', l)
        return {'reader': r, 'lang': l, 'text': t, 'heard': heard, 'cer': round(cer(norm(t, l), norm(heard, l)), 3)}

    with cf.ThreadPoolExecutor(8) as ex:
        rows = list(ex.map(one, items))
    by = {}
    for x in rows:
        by.setdefault((x['reader'], x['lang']), []).append(x['cer'])
    for k, v in sorted(by.items()):
        v.sort()
        print(f'{k[0]}/{k[1]}: n={len(v)} mean={sum(v)/len(v):.3f} median={v[len(v)//2]:.3f} over20%={sum(c > .2 for c in v)}')
    worst = sorted(rows, key=lambda x: -x['cer'])[:15]
    for x in worst:
        print(f"{x['cer']:.2f} {x['reader']}/{x['lang']} | {x['text'][:90]} | heard: {x['heard'][:90]}")
    if a.out:
        Path(a.out).write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
