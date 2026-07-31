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

import numpy as np
from PIL import Image

SLUG = 'the-screw-that-squeezed-the-olives'
GEN = Path.home() / 'my_stuff/kids-stuff/generated' / SLUG
SHEET = GEN / '_book-sheet.png'

# Row-major over the 3x3 grid: the nine painted pages. Pages 3, 7, 9 and 11 are
# not here — they carry hand-authored diagrams (the mill from above, the
# threaded beam, the two pushes on the bar, the oil leaving through the weave),
# because a painting can show none of those. The cover is copied from one of
# these cells afterwards, so it cannot be a different machine.
CELL_TARGET = ['page-1', 'page-2', 'page-4', 'page-5', 'page-6',
               'page-8', 'page-10', 'page-12', 'page-13']

LOOK = (
    "A nine-panel storyboard sheet for a children's picture book, a 3x3 grid of nine equal "
    "rectangular panels separated by a thin cream gutter, every panel the same size. Warm "
    "semi-realistic painterly children's storybook illustration with visible watercolour texture "
    "and modelled faces, soft natural light, muted earth palette of olive green, honey wood, "
    "terracotta and warm stone grey on warm off-white paper. Real proportions, no cartoon "
    "exaggeration, no glossy or plastic look, no sparkles, no text, no letters, no numbers. "
)

# One machine, described once. Two things are load-bearing here and were not in
# the previous sheet. The screw passes THROUGH the top beam, because the page-6
# diagram shows exactly that and the painting must be the same machine. And the
# load is a stack of FLAT mats — the last sheet drew "four deep round bowls side
# by side" while the text said stacked, so the sheet had made the wrong drawing
# consistent rather than making the right one.
PRESS = (
    "THE SAME ROMAN OLIVE PRESS APPEARS IN EVERY PANEL THAT SHOWS IT AND IS DRAWN IDENTICALLY: one "
    "upright pale honey wooden screw with a broad square spiral thread; it passes THROUGH A ROUND "
    "HOLE IN THE MIDDLE OF ONE HEAVY HORIZONTAL TIMBER BEAM that is carried at both ends by two "
    "square timber uprights, so the screw stands vertically through the beam with part of its "
    "length above the beam and the rest below it; one straight wooden bar passing THROUGH a square "
    "hole in the screw head above the beam and projecting on both sides; a round flat wooden "
    "pressing plate hanging below the screw. THE LOAD IS A STACK: four or five FLAT round woven "
    "mats of grey-green olive paste piled one directly on top of another in a single column "
    "centred under the plate, like a stack of plates — never bowls, never side by side. A stone "
    "floor with a shallow channel running to a clay jar sunk into the floor. "
)

MILL = (
    "THE CRUSHING MILL, in the panel that shows it: a wide round stone basin at floor level; a "
    "stout wooden POST standing upright in the very CENTRE of that basin; a horizontal wooden ARM "
    "joined to the post and reaching outward from it; and on the far end of that arm, a great round "
    "stone wheel standing UP ON ITS EDGE, resting in the basin on the olives. The post, the arm and "
    "the wheel are all clearly visible and clearly joined to one another. The wheel rolls round the "
    "basin on its edge like a wheel, it does not lie flat and it does not float. "
)

CAST = (
    "THIS BOOK CONTAINS EXACTLY TWO CHARACTERS IN TOTAL AND NO OTHERS ANYWHERE. Every single panel "
    "contains AT MOST ONE CHILD and AT MOST ONE ADULT. There is never a second child in a panel: no "
    "twin, no sister, no friend, no other children at the millstone or anywhere else. There is never "
    "a second adult, no crowd, no bystanders. Count the people in each panel before drawing it: the "
    "answer is one or two, never three. A girl of about six with "
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
    "2: THE CRUSHING MILL, and the only panel that shows it. THE GRANDFATHER IS ALONE AT THE MILL "
    "and is the only person touching it: he leans forward on the far end of the wooden arm, walking "
    "it round, and the stone wheel rolls on its edge over the olives in the basin. THE GIRL STANDS "
    "APART on the far side of the basin with her hands at her sides, just watching it go round. "
    "There are EXACTLY TWO PEOPLE in this panel, one old man and one girl, and nobody else. The "
    "upright post at the centre of the basin, and the arm joining that post to the wheel, must both "
    "be plainly visible. "
    "3: the girl lifting one flat woven mat of grey-green paste onto the top of the stack under "
    "the press; the mats are OPEN LOOSE BASKETWORK with visible gaps in the weave; the pressing "
    "plate hangs clearly ABOVE the stack with a wide open gap between them, nothing touching. THE "
    "STACK IS TALL HERE — five thick mats, as high as the girl\'s knee. "
    "4: the girl trying to squash the paste with her bare hands, and failing. BOTH HER PALMS ARE "
    "FLAT ON THE TOP MAT OF GREY-GREEN PASTE at the top of the stack, which is at about her waist "
    "height. She is bent forward over it with her arms straight, her shoulders directly above her "
    "hands, pressing her whole body weight straight DOWNWARD into the paste, with one bare foot "
    "slipping backwards on the stone floor. The wooden pressing plate hangs in the air ABOVE her "
    "hands and she is not touching it. SHE IS NOT TOUCHING THE BAR either. The stack is not squashed "
    "at all. THE GRANDFATHER IS NOT HELPING — he stands well back with his arms folded, watching. "
    "5: CLOSE-UP at the screw — the girl kneels on the stone floor right beside the screw with "
    "her index finger PRESSED ON the spiral thread, following it; the grandfather kneels beside "
    "her with both hands on his own knees, not touching the screw. "
    "6: THE GRANDFATHER IS TEACHING HER WHERE TO HOLD. Both of them stand at the bar. His two hands "
    "are placed over her two hands on the bar, and he is sliding her hands OUTWARD along it, away "
    "from the screw, towards the very FAR END of the bar. Both of them are looking at her hands. "
    "7: the girl ALONE, gripping the far end of the bar mid-stride, walking it round; the bar has "
    "swung to a different angle; LESS OF THE SCREW NOW SHOWS ABOVE THE BEAM than in the other "
    "panels because it has wound down through it; the plate has come DOWN and is pressing hard onto "
    "the stack. THIS IS THE ONE PANEL WHERE THE STACK IS SHORT: the mats are crushed to HALF THE "
    "HEIGHT of the tall stack in panel 3, squashed into thin flat discs, spread wider than before, "
    "with grey-green paste bulging out at their rims and no gap left under the plate. "
    "8: CLOSE and LOW — green-gold oil seeping from the seam between two flattened mats near the "
    "floor, one fat drop falling into the stone channel, the girl crouched watching it. "
    "9: night, a small clay lamp burning with a yellow flame on a low table, the girl sitting "
    "looking down at her own open hands, the grandfather across from her."
)

SCENE = LOOK + PRESS + MILL + CAST + PANELS


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


def gutters(profile, brightness, size: int) -> list[tuple[int, int]]:
    """Runs of pale, low-variance rows (or columns): the sheet's gutters.

    A fixed 3% inset was not enough — the model does not draw the grid on exact
    thirds. On the shipped sheet the three rows measured 331, 273 and 228 tall,
    so slicing at thirds put a band of the panel above along the top of every
    page in the middle row. An edge-variance check missed it because what leaks
    in is picture, not gutter: it is textured.

    The thresholds are loose on purpose. The gutter is watercolour paper, not a
    flat fill; std < 12 found nothing at all on a sheet whose gutters measure
    around 25.
    """
    hit = [i for i in range(size) if profile[i] < 30 and brightness[i] > 195]
    runs: list[tuple[int, int]] = []
    for i in hit:
        if runs and i == runs[-1][1] + 1:
            runs[-1] = (runs[-1][0], i)
        else:
            runs.append((i, i))
    return [r for r in runs if r[1] - r[0] >= 3]


def bands(runs: list[tuple[int, int]], size: int) -> list[tuple[int, int]]:
    """The three picture bands lying between the gutter runs."""
    edges = [(-1, -1)] + runs + [(size, size)]
    out: list[tuple[int, int]] = []
    for a, b in zip(edges, edges[1:]):
        lo, hi = a[1] + 1, b[0] - 1
        if hi - lo > size // 8:
            out.append((lo, hi))
    return out


def to_four_three(box: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    """Centre-crop a detected cell to the 4:3 the reader's image box expects.

    The detected cells are not all the same shape, so without this the pages
    arrive at aspect ratios from 1.07 to 1.62 and `object-fit: cover` decides
    what to throw away. Doing it here means what ships is what was looked at.
    """
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    if w / h > 4 / 3:
        keep = round(h * 4 / 3)
        x0 += (w - keep) // 2
        x1 = x0 + keep
    else:
        keep = round(w * 3 / 4)
        y0 += (h - keep) // 2
        y1 = y0 + keep
    return x0, y0, x1, y1


def slice_sheet() -> int:
    if not SHEET.exists():
        print(f'no sheet at {SHEET}')
        return 1
    im = Image.open(SHEET).convert('RGB')
    a = np.asarray(im, dtype=float)
    h, w, _ = a.shape

    rows = bands(gutters(a.std(axis=(1, 2)), a.mean(axis=(1, 2)), h), h)
    cols = bands(gutters(a.std(axis=(0, 2)), a.mean(axis=(0, 2)), w), w)
    if len(rows) != 3 or len(cols) != 3:
        print(f'expected a 3x3 grid, found {len(cols)} columns and {len(rows)} rows')
        return 1
    print(f'  rows {rows}')
    print(f'  cols {cols}')

    pad = 3  # stay off the gutter's soft edge
    for i, name in enumerate(CELL_TARGET):
        x0, x1 = cols[i % 3]
        y0, y1 = rows[i // 3]
        panel = im.crop(to_four_three((x0 + pad, y0 + pad, x1 - pad, y1 - pad)))
        panel.save(GEN / f'{name}.png')
        print(f'  cell {i + 1} -> {name}.png  {panel.size[0]}x{panel.size[1]}')
    return 0


def main() -> int:
    if '--slice' not in sys.argv and not generate():
        return 1
    return slice_sheet()


if __name__ == '__main__':
    sys.exit(main())
