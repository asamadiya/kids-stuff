#!/usr/bin/env python3
"""A contact sheet for one book: every page's picture with its words and zone.

The art is accountable to the text (advisor ruling): this is how a person
checks it — page image, the words that will sit on it, and the zone outlined
where the words go — in one image.

    python3 scripts/art/book-sheet.py <slug> [<out.png>]
"""
from __future__ import annotations

import json
import subprocess
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ZONE_BOX = {'top': (0.04, 0.03, 0.96, 0.36), 'bottom': (0.04, 0.64, 0.96, 0.97),
            'left': (0.03, 0.04, 0.39, 0.96), 'right': (0.61, 0.04, 0.97, 0.96)}


def load(slug: str) -> dict:
    out = Path('.check-books') / f'{slug}.mjs'
    out.parent.mkdir(exist_ok=True)
    subprocess.run(['npx', 'esbuild', f'src/books/data/{slug}.ts', '--format=esm', f'--outfile={out}', '--log-level=error'], check=True)
    js = f"import {{ book }} from '{out.resolve().as_uri()}'; process.stdout.write(JSON.stringify(book));"
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', js], check=True, capture_output=True, text=True).stdout)


def main() -> int:
    slug = sys.argv[1]
    dest = Path(sys.argv[2]) if len(sys.argv) > 2 else Path.home() / f'my_stuff/kids-stuff/.redesign/sheets/{slug}.png'
    dest.parent.mkdir(parents=True, exist_ok=True)
    book = load(slug)
    art = Path('public/art/books') / slug
    w, cols = 420, 4
    h = round(w * 896 / 1152)
    cap = 120
    try:
        font = ImageFont.truetype(str(Path.home() / '.local/share/fonts/DejaVuSans.ttf'), 12)
    except OSError:
        font = ImageFont.load_default()
    cells = [('cover', 'cover', None)] + [(f'p{i + 1}', f'page-{i + 1}', p) for i, p in enumerate(book['pages'])]
    rows = (len(cells) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * (w + 8), rows * (h + cap + 8)), (34, 30, 26))
    d = ImageDraw.Draw(sheet)
    for k, (label, name, page) in enumerate(cells):
        x, y = (k % cols) * (w + 8), (k // cols) * (h + cap + 8)
        f = art / f'{name}.png'
        if f.exists():
            im = Image.open(f).convert('RGB').resize((w, h))
            sheet.paste(im, (x, y))
        else:
            d.rectangle((x, y, x + w, y + h), outline=(200, 60, 60), width=3)
            d.text((x + 10, y + 10), 'MISSING', fill=(255, 90, 90), font=font)
        if page:
            bx = ZONE_BOX[page['zone']]
            d.rectangle((x + bx[0] * w, y + bx[1] * h, x + bx[2] * w, y + bx[3] * h), outline=(255, 200, 0), width=2)
            text = ('[BIG] ' if page.get('big') else '') + page['text'].replace('\n', ' ')
            for i, line in enumerate(textwrap.wrap(text, 70)[:8]):
                d.text((x + 4, y + h + 4 + i * 14), line, fill=(240, 232, 214), font=font)
        d.text((x + 6, y + 4), label, fill=(255, 220, 120), font=font)
    sheet.save(dest)
    print(dest)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
