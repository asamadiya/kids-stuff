#!/usr/bin/env python3
"""Generate the WHOLE book as one image, then slice it into eight pages and a cover.

This is the fourth approach and the one that works. The history:

- Twelve pages generated independently gave four different screw geometries, a
  grandfather who gained and lost a beard, and a girl who changed on one page.
  The image endpoint is text-to-image only (`images/edits` -> api_not_supported)
  so nothing could hold the machine constant across separate calls.
- A 2x2 sheet fixed the machine for the four pages it covered — reviewers
  measured 9 thread turns on all four and frame spans within 1% — but the book
  then "changed illustrator at page 3", because the four sliced panels sat at
  510x384 flat line art beside four solo pages at 1152x896 dense watercolour.

Putting every page on ONE sheet removes the seam by removing the solo pages.
Nine cells in a 3x3 grid: eight story pages and the cover. Each lands at about
384x298, a true 4:3 that matches the reader's image box; upscaled to the reader
width it is slightly soft on a desktop and indistinguishable on the tablet and
phone the story is actually read on.

    python3 scripts/build-olive-book.py           # generate and slice
    python3 scripts/build-olive-book.py --slice   # re-slice the sheet on disk
"""
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image

SLUG = 'the-screw-that-squeezed-the-olives'
GEN = Path.home() / 'my_stuff/kids-stuff/generated' / SLUG
SHEET = GEN / '_book-sheet.png'

# Row-major over the 3x3 grid: eight pages, then the cover in the last cell.
CELL_TARGET = ['page-1', 'page-2', 'page-3', 'page-4', 'page-5',
               'page-6', 'page-7', 'page-8', 'cover']

LOOK = (
    "A nine-panel storyboard sheet for a children's picture book, a 3x3 grid of nine equal "
    "rectangular panels separated by a thin cream gutter, every panel the same size. Warm "
    "semi-realistic painterly children's storybook illustration with visible watercolour texture "
    "and modelled faces, soft natural light, muted earth palette of olive green, honey wood, "
    "terracotta and warm stone grey on warm off-white paper. Real proportions, no cartoon "
    "exaggeration, no glossy or plastic look, no sparkles, no text, no letters, no numbers. "
)

# One machine, described once. Reviewers measured the previous sheet's load as
# "four deep round bowls side by side" while the text says "stacked" five times —
# the sheet had made the wrong drawing consistent instead of correct.
PRESS = (
    "THE SAME ROMAN OLIVE PRESS APPEARS IN EVERY PANEL THAT SHOWS IT AND IS DRAWN IDENTICALLY: one "
    "upright pale honey wooden screw with a broad spiral thread, standing between two square "
    "timber uprights joined by one heavy lintel across the top; one straight wooden bar passing "
    "THROUGH a square hole in the screw head and projecting on both sides; a round flat wooden "
    "pressing plate hanging below the screw. THE LOAD IS A STACK: four or five FLAT round woven "
    "mats of grey-green olive paste piled one directly on top of another in a single column "
    "centred under the plate, like a stack of plates — never bowls, never side by side. A stone "
    "floor with a shallow channel running to a clay jar sunk into the floor. "
)

CAST = (
    "EXACTLY TWO PEOPLE EXIST IN THIS WHOLE BOOK AND EACH APPEARS AT MOST ONCE PER PANEL. There is "
    "never a second girl and never a second old man in the same panel — no twins, no crowd, no "
    "bystanders, no other children, no other adults. A girl of about six with "
    "light skin and loose wavy brown hair tied back in a low ponytail, in a plain undyed knee-"
    "length linen tunic with a cord belt, bare feet; and her grandfather, a lean old man with "
    "short white hair and a full short white beard, in a brown knee-length tunic and sandals. "
    "One stone-walled press room with a timber roof throughout. "
)

PANELS = (
    "The nine panels, read left to right, top row first. Each is a different moment and they must "
    "not look alike; vary the camera distance. "
    "1: the girl kneels beside two wide baskets heaped with hard green olives on the floor, the "
    "grandfather setting down a third basket. "
    "2: a great round millstone standing on its edge in a circular stone basin, the girl and the "
    "grandfather both leaning on its wooden handle, crushing olives to grey paste. "
    "3: WIDE — the girl stands at the press with both hands closed around the bar, arms raised, "
    "the stack of flat mats under the plate. "
    "4: MEDIUM — the girl bent forward, heels lifted, shoving the bar hard; the screw has not "
    "moved; the grandfather watches a few steps away. "
    "5: CLOSE-UP at the screw — the girl kneels on the stone floor right beside the screw with "
    "her index finger PRESSED ON the spiral thread, following it; the grandfather kneels beside "
    "her with both hands on his own knees, not touching the screw; the bar is still in place above. "
    "6: the girl grips the far end of the bar mid-stride, walking it round; the bar has swung to a "
    "different angle; the plate has come DOWN and the stack of mats is squashed flatter and wider "
    "with paste bulging at the edges. "
    "7: CLOSE and LOW — green-gold oil seeping from the seam between two flattened mats near the "
    "floor, one fat drop falling into the stone channel, the girl crouched watching it. "
    "8: night, a small clay lamp burning with a yellow flame on a low table, the girl sitting "
    "looking down at her own open hands, the grandfather across from her. "
    "9: the girl standing small at the foot of the whole press, looking up at the screw."
)

SCENE = LOOK + PRESS + CAST + PANELS


def generate() -> bool:
    GEN.mkdir(parents=True, exist_ok=True)
    tsv = Path('/tmp/artpipe/olive-book.tsv')
    assert '\n' not in SCENE, 'a newline would split the row into separate prompts'
    tsv.write_text(f'{SLUG}{chr(31)}_book-sheet{chr(31)}{SCENE}\n', encoding='utf-8')
    for model in ('moonlit-mai-pro', 'moonlit-mai-2', 'moonlit-mai-2e', 'moonlit-mai-image'):
        subprocess.run(['bash', '/tmp/artpipe/tsvgen.sh', str(tsv), '0', '1'],
                       env={**os.environ, 'MODEL': model}, capture_output=True, text=True)
        if SHEET.exists():
            print(f'sheet generated by {model}')
            return True
    print('no deployment produced the sheet')
    return False


def slice_sheet() -> int:
    if not SHEET.exists():
        print(f'no sheet at {SHEET}')
        return 1
    im = Image.open(SHEET).convert('RGB')
    w, h = im.size
    inset = 0.030  # past the cream gutter
    for i, name in enumerate(CELL_TARGET):
        col, row = i % 3, i // 3
        x0 = (col / 3 + inset) * w
        x1 = ((col + 1) / 3 - inset) * w
        y0 = (row / 3 + inset) * h
        y1 = ((row + 1) / 3 - inset) * h
        panel = im.crop((int(x0), int(y0), int(x1), int(y1)))
        panel.save(GEN / f'{name}.png')
        print(f'  cell {i + 1} -> {name}.png  {panel.size[0]}x{panel.size[1]}')
    return 0


def main() -> int:
    if '--slice' not in sys.argv and not generate():
        return 1
    return slice_sheet()


if __name__ == '__main__':
    sys.exit(main())
