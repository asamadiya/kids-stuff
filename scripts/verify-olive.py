#!/usr/bin/env python3
"""Contact sheet for the olive story, and the approval that follows looking at it.

There is no automated check for "is this the same press on every page". The
image endpoint is text-to-image only, so geometry cannot be held constant by
the pipeline, and a string assertion over the prompt — which is what used to
guard this — is green while the renders disagree.

    python3 scripts/verify-olive.py            # build the sheet, then LOOK at it
    python3 scripts/verify-olive.py --approve  # record that you looked
"""
import hashlib
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ART = Path('public/art/the-screw-that-squeezed-the-olives')
OUT = Path('artifacts')
SRC = Path('src/stories/the-screw-that-squeezed-the-olives.ts')

# Pages 3-6 are cut from one sheet; 1, 2, 7 and 8 are rendered individually.
PAGES = 8


def hashes() -> dict:
    return {
        f'page-{i}': hashlib.sha256((ART / f'page-{i}.png').read_bytes()).hexdigest()
        for i in range(1, PAGES + 1)
    }


def main() -> int:
    OUT.mkdir(exist_ok=True)
    if '--approve' in sys.argv:
        (OUT / 'olive-art-approved.json').write_text(json.dumps(hashes(), indent=1))
        print('approved', len(hashes()), 'pages')
        return 0

    text = SRC.read_text(encoding='utf-8')
    pages = [t.replace('\\n\\n', ' ') for t in re.findall(r"text: '((?:[^'\\]|\\.)*)'", text)]
    ims = [Image.open(ART / f'page-{i}.png').convert('RGB') for i in range(1, PAGES + 1)]
    w = 430
    h = round(ims[0].height * w / ims[0].width)
    cols, cap = 3, 112
    sheet = Image.new('RGB', (cols * w, ((len(ims) + cols - 1) // cols) * (h + cap)), (244, 240, 230))
    dr = ImageDraw.Draw(sheet)
    for i, im in enumerate(ims):
        x, y = (i % cols) * w, (i // cols) * (h + cap)
        sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y))
        dr.text((x + 6, y + h + 4), f'PAGE {i + 1}', fill=(150, 40, 40))
        line, row = '', 0
        for word in pages[i].split():
            if len(line) + len(word) + 1 > 60:
                dr.text((x + 6, y + h + 18 + row * 14), line, fill=(20, 20, 20))
                line, row = word, row + 1
            else:
                line = (line + ' ' + word).strip()
            if row >= 6:
                break
        dr.text((x + 6, y + h + 18 + row * 14), line, fill=(20, 20, 20))
    sheet.save(OUT / 'olive-contact-sheet.png')
    print('artifacts/olive-contact-sheet.png')
    print('LOOK at it. Count the screw threads. Check the grandfather has the same face.')
    print('Then: python3 scripts/verify-olive.py --approve')
    return 0


if __name__ == '__main__':
    sys.exit(main())
