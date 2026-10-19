#!/usr/bin/env python3
"""Illustrate books as they become final, and keep the art in step with the text.

For each book in src/books/data/ that parses and passes the reading gate, this
builds its MAI-Image-2.6 jobs and runs them. It records, per page, a hash of
everything the picture depends on (the art direction, the zone, who is in it,
the setting and character line). If a later edit to the book changes any of
that for a page, the old picture is moved aside and the page is redrawn —
otherwise a skeptic's fix to the text would leave a picture that no longer
shows its words, which is the exact failure this redesign exists to end.

    python3 scripts/art/illustrate.py [slug ...]   # once
    python3 scripts/art/illustrate.py --watch      # loop until stopped
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path('public/art/books')
STAMP = 'art-stamp.json'
JOBS = Path.home() / 'my_stuff/kids-stuff/.redesign/jobs'


def book_slugs() -> list[str]:
    return sorted(p.stem for p in Path('src/books/data').glob('*.ts') if not p.stem.startswith('_'))


def gate_ok(slug: str) -> bool:
    r = subprocess.run(['node', 'scripts/check-books.mjs', slug], capture_output=True, text=True)
    return r.returncode == 0


def jobs_for(slug: str) -> list[dict]:
    out = JOBS / f'il-{slug}.jsonl'
    subprocess.run(['python3', 'scripts/art/build-book-jobs.py', '--out', str(out), slug], check=True, capture_output=True)
    return [json.loads(l) for l in out.read_text().splitlines() if l.strip()]


def digest(job: dict) -> str:
    return hashlib.sha256((job['prompt'] + '|' + job.get('ref', '')).encode()).hexdigest()[:16]


def illustrate(slug: str) -> str:
    if not gate_ok(slug):
        return 'gate'
    jobs = jobs_for(slug)
    folder = ROOT / slug
    folder.mkdir(parents=True, exist_ok=True)
    stamp_file = folder / STAMP
    stamps = json.loads(stamp_file.read_text()) if stamp_file.exists() else {}
    stale = 0
    for j in jobs:
        name = Path(j['out']).name
        d = digest(j)
        png = Path(j['out'])
        if png.exists() and stamps.get(name) not in (None, d):
            # The page's picture was drawn for different words: keep it aside, redraw.
            png.rename(png.with_suffix(f'.old-{stamps.get(name)}.png'))
            png.with_suffix('.webp').unlink(missing_ok=True)
            stale += 1
        stamps[name] = d
    todo = [j for j in jobs if not Path(j['out']).exists()]
    if todo:
        f = JOBS / f'il-{slug}.todo.jsonl'
        f.write_text(''.join(json.dumps(j) + '\n' for j in todo))
        subprocess.run(['python3', 'scripts/art/maigen.py', 'batch', str(f), '--workers', '6'], check=False)
    stamp_file.write_text(json.dumps(stamps, indent=1, sort_keys=True))
    missing = [j['out'] for j in jobs if not Path(j['out']).exists()]
    return f'drew {len(todo)} (stale {stale}), missing {len(missing)}'


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    watch = '--watch' in sys.argv
    while True:
        for slug in args or book_slugs():
            res = illustrate(slug)
            if res != 'gate' and not res.startswith('drew 0 (stale 0), missing 0'):
                print(f'{time.strftime("%H:%M:%S")} {slug}: {res}', flush=True)
        if not watch:
            return 0
        time.sleep(90)


if __name__ == '__main__':
    raise SystemExit(main())
