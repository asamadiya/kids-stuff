#!/usr/bin/env python3
"""Card and thumbnail derivatives for every catalogue entry.

Hubs, the home directory and the Everything index show hundreds of pictures
at once. The masters are 1152x896 PNGs and their full-size WebPs run to
~240 KB each, so a flat hub of 24 book covers was ~6 MB. Every entry gets:

  public/cards/<id>.webp   560 px wide  (hub cards, at most ~290 CSS px)
  public/thumbs/<id>.webp  160 px wide  (directory rows and the index, 64 CSS px)

Ids and masters come from the catalogue itself (catalog-manifest.ts), so a
new book, game, activity or play idea gets its card without a list to edit.
Idempotent: a derivative newer than its master is left alone. Masters that
do not exist yet are reported, not fatal, so this can run mid-authoring.

    python3 scripts/art/cards.py
"""
from __future__ import annotations

import concurrent.futures as cf
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

SIZES = {'cards': (560, 80), 'thumbs': (160, 72)}


def manifest() -> list[dict]:
    out = subprocess.run(['npx', 'vite-node', 'scripts/art/catalog-manifest.ts'], check=True, capture_output=True, text=True).stdout
    return json.loads(out[out.index('['):])


def make(entry: dict) -> str:
    # Fall back from the PNG master to its WebP, then to the archive's 560 cover:
    # eight dinosaur stories' masters live only on the deploy branch (see
    # memory: kids-stuff-masters-are-untracked).
    first = Path('public') / entry['art']
    tries = [first, first.with_suffix('.webp'), first.with_name('cover-560.webp')]
    src = next((t for t in tries if t.exists()), None)
    if src is None:
        return f"missing {first}"
    made = 0
    for d, (w, q) in SIZES.items():
        out = Path('public') / d / f"{entry['id']}.webp"
        if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as im:
            im = im.convert('RGB')
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=q, method=6)
        made += 1
    return f'made {made}' if made else 'ok'


def main() -> int:
    entries = manifest()
    with cf.ThreadPoolExecutor(8) as ex:
        res = list(ex.map(make, entries))
    missing = [r for r in res if r.startswith('missing')]
    made = sum(int(r.split()[1]) for r in res if r.startswith('made'))
    print(f'{len(entries)} entries, {made} derivatives written, {len(missing)} masters missing')
    for m in missing[:40]:
        print(' ', m)
    return 0


if __name__ == '__main__':
    sys.exit(main())
