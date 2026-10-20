#!/usr/bin/env python3
"""MAI-Image-2.6 client for kids-stuff: generate, and edit-from-reference.

Lives outside /tmp on purpose. The last pipeline lived in /tmp/artpipe and was
wiped between sessions along with its key, which cost a morning.

Why edit-from-reference matters: three rounds of the olive story failed on one
thing — independent text-to-image calls cannot hold a character or a machine
constant. MAI-Image-2.6 exposes `/mai/v1/images/edits`, which takes an image
and keeps its people while changing the scene. Measured on the smoke test: the
same boy and girl carried from a courtyard to a night rooftop, faces, clothes
and hair intact. So every book has a CHARACTER SHEET (one generated plate), and
each page is an edit of that sheet, not a fresh draw.

    maigen.py gen  --prompt-file p.txt --out a.png [--model kids-mai-26]
    maigen.py edit --ref sheet.png --prompt-file p.txt --out a.png
    maigen.py batch jobs.jsonl --workers 6
        each line: {"out": ".../page-3.png", "prompt": "...", "ref": optional path}
        skips any `out` that already exists; safe to re-run after a crash.

Env: ~/.config/kids-art/env.sh (KIDS_ART_ENDPOINT, AZURE_API_KEY, KIDS_ART_MODEL).
"""
from __future__ import annotations

import argparse
import base64
import concurrent.futures as cf
import json
import os
import random
import sys
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

ENDPOINT = os.environ.get('KIDS_ART_ENDPOINT', 'https://chgu-4562-resource.services.ai.azure.com')
W, H = 1152, 896


def _key() -> str:
    k = os.environ.get('AZURE_API_KEY')
    if not k:
        k = (Path.home() / '.config/kids-art/key').read_text().strip()
    return k


def _multipart(fields: dict[str, str], files: dict[str, Path]) -> tuple[bytes, str]:
    boundary = uuid.uuid4().hex
    out = bytearray()
    for name, value in fields.items():
        out += f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode()
    for name, path in files.items():
        out += (f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; '
                f'filename="{path.name}"\r\nContent-Type: image/png\r\n\r\n').encode()
        out += path.read_bytes() + b'\r\n'
    out += f'--{boundary}--\r\n'.encode()
    return bytes(out), f'multipart/form-data; boundary={boundary}'


def _call(prompt: str, model: str, ref: Path | None, timeout: int = 240) -> bytes:
    if ref is None:
        url = f'{ENDPOINT}/mai/v1/images/generations'
        body = json.dumps({'model': model, 'prompt': prompt, 'width': W, 'height': H}).encode()
        ctype = 'application/json'
    else:
        url = f'{ENDPOINT}/mai/v1/images/edits'
        body, ctype = _multipart({'model': model, 'prompt': prompt, 'width': str(W), 'height': str(H)},
                                 {'image': ref})
    req = urllib.request.Request(url, data=body, method='POST',
                                 headers={'api-key': _key(), 'Content-Type': ctype})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = json.loads(r.read())
    return base64.b64decode(data['data'][0]['b64_json'])


def render(prompt: str, out: Path, model: str, ref: Path | None = None, attempts: int = 7) -> str:
    """Write one image. Returns 'ok' | 'skip' | 'blocked:<msg>' | 'fail:<msg>'."""
    if out.exists() and out.stat().st_size > 10_000:
        return 'skip'
    out.parent.mkdir(parents=True, exist_ok=True)
    last = ''
    for i in range(attempts):
        try:
            png = _call(prompt, model, ref)
            tmp = out.with_suffix('.part')
            tmp.write_bytes(png)
            tmp.replace(out)  # never leave a half-written PNG where `skip` would trust it
            return 'ok'
        except urllib.error.HTTPError as e:
            text = e.read().decode(errors='replace')[:400]
            last = f'{e.code} {text}'
            if e.code == 400 and any(s in text.lower() for s in ('content', 'safety', 'block', 'policy')):
                return f'blocked:{text}'
            if e.code in (429, 500, 502, 503, 504):
                time.sleep(min(90, 6 * 2 ** i) + random.random() * 4)
                continue
            return f'fail:{last}'
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            last = repr(e)
            time.sleep(min(60, 5 * 2 ** i))
    return f'fail:{last}'


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    for name in ('gen', 'edit'):
        p = sub.add_parser(name)
        p.add_argument('--prompt-file', required=True)
        p.add_argument('--out', required=True)
        p.add_argument('--model', default=os.environ.get('KIDS_ART_MODEL', 'kids-mai-26'))
        if name == 'edit':
            p.add_argument('--ref', required=True)
    b = sub.add_parser('batch')
    b.add_argument('jobs')
    b.add_argument('--workers', type=int, default=6)
    b.add_argument('--model', default=os.environ.get('KIDS_ART_MODEL', 'kids-mai-26'))
    a = ap.parse_args()

    if a.cmd in ('gen', 'edit'):
        res = render(Path(a.prompt_file).read_text(), Path(a.out), a.model,
                     Path(a.ref) if a.cmd == 'edit' else None)
        print(res)
        return 0 if res in ('ok', 'skip') else 1

    jobs = [json.loads(line) for line in Path(a.jobs).read_text().splitlines() if line.strip()]
    log = Path(a.jobs).with_suffix('.log')
    counts: dict[str, int] = {}

    def run(job: dict) -> tuple[str, str]:
        ref = Path(job['ref']) if job.get('ref') else None
        if ref is not None and not ref.exists():
            return job['out'], 'fail:missing reference ' + str(ref)
        return job['out'], render(job['prompt'], Path(job['out']), job.get('model', a.model), ref)

    with cf.ThreadPoolExecutor(a.workers) as ex, log.open('a') as fh:
        for out, res in ex.map(run, jobs):
            kind = res.split(':', 1)[0]
            counts[kind] = counts.get(kind, 0) + 1
            fh.write(f'{time.strftime("%H:%M:%S")} {kind:8s} {out} {res[len(kind)+1:][:300]}\n')
            fh.flush()
    print(json.dumps(counts))
    return 0 if counts.get('fail', 0) == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
