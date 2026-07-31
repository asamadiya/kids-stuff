#!/usr/bin/env python3
"""Emit small WebP derivatives for every image the site requires.

The site was serving 1152x896 PNG masters, ~1.5 MB each, as list thumbnails
that render at 177-261 px. Measured on the live site, the home page pulled
40.7 MB across 36 requests, of which 39.44 MB was images; a full scroll of all
215 tiles pulled roughly 300 MB. Lazy loading was already correct and was not
the problem — the file size was.

Two derivatives per story:

  cover-560.webp   560 wide, q82. The grid is capped at --page-max: 1180px in
                   tokens.css, so a tile never exceeds ~250 CSS px; 560 covers
                   it at DPR 2. public/games/covers already ships at 560x436.
  page-N.webp      native 1152, q82, NO downscale. The reader renders at
                   1088x816 on desktop and asks for ~1560 device px on a DPR-2
                   tablet, so the master's dimensions are right; only the
                   format was wrong.

Masters are never overwritten: derivatives take new filenames. Sources resolve
generated/ -> public/art/ -> the gh-pages worktree, because 1223 of the required
masters exist only in untracked generated/.
"""
from __future__ import annotations

import json
import os
import re
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [
    ROOT.parent.parent / "generated",
    ROOT / "public" / "art",
    ROOT.parent / "bedtime-pages" / "art",
]
OUT = ROOT / "public" / "art"
COVER_W = 560
QUALITY = 82


def required() -> list[tuple[str, str]]:
    """(slug, name) for every image the stories reference.

    A page carrying a `figureId` renders a hand-authored diagram instead of a
    painting, so it has no master and must not be encoded — otherwise a stale
    derivative from an earlier draft survives every rebuild and ships as a page
    nothing points at. Split on the page boundary so this list and the one in
    src/test/art-derivatives.test.ts cannot disagree.
    """
    out: list[tuple[str, str]] = []
    for f in sorted((ROOT / "src" / "stories").glob("*.ts")):
        text = f.read_text()
        slug_m = re.search(r"slug:\s*'([a-z0-9-]+)'", text)
        if not slug_m:
            continue
        slug = slug_m.group(1)
        out.append((slug, "cover"))
        for i, chunk in enumerate(re.split(r"\btext:\s*'", text)[1:]):
            if not re.search(r"\bfigureId:\s*'", chunk):
                out.append((slug, f"page-{i + 1}"))
    return out


def find_source(slug: str, name: str) -> Path | None:
    for base in SOURCES:
        p = base / slug / f"{name}.png"
        if p.exists():
            return p
    return None


def encode(job: tuple[str, str]) -> dict:
    slug, name = job
    src = find_source(slug, name)
    if src is None:
        return {"slug": slug, "name": name, "ok": False, "why": "no source"}
    dest_dir = OUT / slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    if name == "cover":
        dest = dest_dir / f"cover-{COVER_W}.webp"
        w = COVER_W
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    else:
        dest = dest_dir / f"{name}.webp"
    im.save(dest, "WEBP", quality=QUALITY, method=6)
    return {
        "slug": slug, "name": name, "ok": True,
        "src_kb": src.stat().st_size // 1024,
        "out_kb": dest.stat().st_size // 1024,
        "w": im.width, "h": im.height,
    }


def main() -> int:
    jobs = required()
    print(f"{len(jobs)} images required by src/stories")
    with ProcessPoolExecutor() as pool:
        results = list(pool.map(encode, jobs, chunksize=8))
    ok = [r for r in results if r["ok"]]
    bad = [r for r in results if not r["ok"]]
    src_mb = sum(r["src_kb"] for r in ok) / 1024
    out_mb = sum(r["out_kb"] for r in ok) / 1024
    print(f"encoded {len(ok)}, missing {len(bad)}")
    print(f"{src_mb:.0f} MB -> {out_mb:.0f} MB  ({src_mb / max(out_mb, 0.01):.1f}x)")
    for r in bad[:10]:
        print("  MISSING", r["slug"], r["name"])
    (ROOT / "public" / "art" / "derivatives.json").write_text(
        json.dumps({"count": len(ok), "missing": [f"{r['slug']}/{r['name']}" for r in bad]}, indent=1)
    )
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
