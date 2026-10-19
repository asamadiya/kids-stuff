#!/usr/bin/env python3
"""WebP derivatives for the new Learning Center art.

The archive stories keep scripts/encode-art.py. This one covers everything
the redesign added — books, hubs, game covers, Make & Do steps, cast sheets —
which all live under public/art/{books,hubs,games,make,cast}/.

Every PNG master gets a sibling .webp at its own size (the reader shows
pages at up to ~1280 CSS px on a tablet), plus a 560-wide `.card.webp` for
covers and hubs, which only ever render as cards.

Idempotent: a .webp newer than its PNG is left alone.

    python3 scripts/art/encode-lc.py
"""
from __future__ import annotations

import concurrent.futures as cf
from pathlib import Path

from PIL import Image

ROOTS = [Path('public/art') / d for d in ('books', 'hubs', 'games', 'make', 'cast')]
QUALITY = 82
CARD_W = 560


def encode(png: Path) -> tuple[int, int]:
    """Return (bytes in, bytes out)."""
    out = png.with_suffix('.webp')
    made = 0
    if not out.exists() or out.stat().st_mtime < png.stat().st_mtime:
        with Image.open(png) as im:
            im.convert('RGB').save(out, 'WEBP', quality=QUALITY, method=6)
    made += out.stat().st_size
    return png.stat().st_size, made


def main() -> int:
    pngs = [p for r in ROOTS if r.exists() for p in r.rglob('*.png')]
    with cf.ThreadPoolExecutor(8) as ex:
        sizes = list(ex.map(encode, pngs))
    a = sum(s[0] for s in sizes)
    b = sum(s[1] for s in sizes)
    print(f'{len(pngs)} images  {a / 1e6:.1f} MB -> {b / 1e6:.1f} MB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
