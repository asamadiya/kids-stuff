#!/usr/bin/env python3
"""Generate the four press pages of the olive story as ONE image, then slice it.

Three drafts failed because the press was a different machine on every page.
The image endpoint is text-to-image only — `images/edits` returns
api_not_supported — so each page was an independent draw and no amount of
prompt text held the geometry. Two reviewers measured the drift: thread counts
of 7, 9, 10 and 11 against a stated eight, four different screw heads, and a
grandfather who gained and lost a beard between pages.

Within one image the model is consistent, because it draws the machine once.
So the four pages where the press is the subject are four panels of a single
2x2 sheet, cut apart here. The panels come out about 510x384, which is a true
4:3 and matches the reader's image box; upscaled it is soft on a desktop and
indistinguishable on the phone and tablet the story is actually read on.

    python3 scripts/build-olive-sheet.py          # generate and slice
    python3 scripts/build-olive-sheet.py --slice  # re-slice the sheet on disk
"""
import os
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SLUG = 'the-screw-that-squeezed-the-olives'
GEN = Path.home() / 'my_stuff/kids-stuff/generated' / SLUG
SHEET = GEN / '_sheet-press.png'

# Panels map to story pages 3, 4, 5, 6 — the pages where the press is the subject.
PANEL_PAGES = {'A': 3, 'B': 4, 'C': 5, 'D': 6}

SCENE = (
    "A four-panel storyboard sheet for a children's picture book, arranged as a 2x2 grid of four "
    "equal rectangular panels separated by a thin cream gutter. Warm semi-realistic painterly "
    "children's storybook illustration, soft natural light, muted earth palette of olive green, "
    "honey wood, terracotta and warm stone grey on warm off-white paper. Real proportions, no "
    "cartoon exaggeration, no glossy or plastic look, no sparkles, no text, no letters, no "
    "numbers. "
    "THE SAME ROMAN OLIVE PRESS FILLS ALL FOUR PANELS AND IS DRAWN IDENTICALLY IN EACH: one "
    "upright pale honey wooden screw with eight broad flat spiral turns, standing between two "
    "square dark-timber uprights joined by one heavy lintel across the top; one straight wooden "
    "bar through the screw head just under the lintel, projecting equally on both sides; a round "
    "flat wooden pressing plate below the screw; a stack of flat round woven baskets of grey-green "
    "olive paste under the plate; a stone floor with a shallow channel running to a clay jar sunk "
    "into the floor. "
    "EXACTLY TWO PEOPLE, THE SAME TWO IN ALL FOUR PANELS AND NOWHERE DUPLICATED: a girl of about "
    "six with light skin and loose wavy brown hair tied back, in a plain undyed linen tunic, bare "
    "feet; and her grandfather, a lean old man with short white hair and a full short white beard, "
    "in a brown knee-length tunic. Exactly one girl and exactly one old man per panel. "
    "Indoors, one windowless stone-walled press room with a timber roof. "
    "THE FOUR PANELS SHOW FOUR DIFFERENT MOMENTS AND MUST NOT LOOK ALIKE. The press is identical in "
    "all four, but the PRESSING PLATE DESCENDS AS THE STORY GOES ON — this is the whole point of "
    "the book and must be visible: in the top-left panel the plate rests high with a clear gap "
    "above the paste baskets; in the top-right panel the gap is the same; in the bottom-left panel "
    "the gap is the same; and in the BOTTOM-RIGHT panel the plate has come DOWN and is pressing "
    "hard onto the baskets, squashing them flatter and wider with paste bulging at their edges and "
    "NO GAP left at all. "
    "NOTHING FLOATS IN MID-AIR. There is no hoop, no ring, no loose circle around the press. The "
    "bar is ONE straight timber that passes THROUGH the square hole in the screw head; both of its "
    "ends are free, and it touches nothing else — it never rests on the plate. "
    "TOP LEFT panel, WIDE SHOT from across the room: the girl stands at the foot of the press with "
    "BOTH HANDS CLOSED AROUND THE BAR, gripping it, her arms raised but her hands definitely ON it, "
    "not reaching towards empty air. "
    "TOP RIGHT panel, MEDIUM SHOT from the side: the girl is bent forward at the waist with both "
    "feet braced wide apart and her heels lifted, shoving the bar with her shoulder; the bar and "
    "the screw have not moved; the grandfather stands watching a few steps away. "
    "BOTTOM LEFT panel, CLOSE-UP at the foot of the screw: THE GIRL IS KNEELING ON THE STONE FLOOR "
    "beside the press, not on the plate, and SHE is the one touching the screw — her index finger "
    "is extended and pressed against the spiral thread, following it. Her arm is a normal child's "
    "arm at a natural length, bent at the elbow, close to her body — NOT stretched or elongated. "
    "THE GRANDFATHER IS NOT "
    "TOUCHING THE SCREW AT ALL: he kneels beside her with both hands resting on his own knees, "
    "watching her finger. Her hand is clearly drawn with one finger out. "
    "BOTTOM RIGHT panel, EYE LEVEL from the side: the girl grips the far end of the bar with both "
    "hands and is mid-stride, walking it round; the bar has swung to a clearly different angle from "
    "the other panels and still passes through the screw head; the plate is pressed hard down onto "
    "the flattened baskets; the grandfather stands well clear with his hands at his sides."
)


def generate() -> bool:
    """One call, one sheet. Retries across deployments the way the pipeline does."""
    GEN.mkdir(parents=True, exist_ok=True)
    tsv = Path('/tmp/artpipe/olive-sheet.tsv')
    assert '\n' not in SCENE, 'a newline would split the row into separate prompts'
    tsv.write_text(f'{SLUG}{chr(31)}_sheet-press{chr(31)}{SCENE}\n', encoding='utf-8')
    for model in ('moonlit-mai-2', 'moonlit-mai-2e', 'moonlit-mai-pro', 'moonlit-mai-image'):
        subprocess.run(
            ['bash', '/tmp/artpipe/tsvgen.sh', str(tsv), '0', '1'],
            env={**os.environ, 'MODEL': model}, capture_output=True, text=True)
        if SHEET.exists():
            print(f'sheet generated by {model}')
            return True
    print('no deployment produced the sheet')
    return False


def slice_sheet() -> int:
    """Cut the 2x2 grid, trimming the gutter so no panel carries a neighbour's edge."""
    if not SHEET.exists():
        print(f'no sheet at {SHEET}')
        return 1
    im = Image.open(SHEET).convert('RGB')
    w, h = im.size
    # Inset past the cream gutter and the sheet's outer margin.
    boxes = {
        'A': (0.045, 0.050, 0.487, 0.478),
        'B': (0.513, 0.050, 0.955, 0.478),
        'C': (0.045, 0.522, 0.487, 0.950),
        'D': (0.513, 0.522, 0.955, 0.950),
    }
    panels = {}
    for key, page in PANEL_PAGES.items():
        x0, y0, x1, y1 = boxes[key]
        panels[page] = im.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))

    # One sheet is one draw, so all four panels share whatever cast the model
    # gave it — here a cooler, greener light than the individually generated
    # pages. Grading them onto the solo pages' mean keeps the book one book.
    solo = [p for p in range(1, 9) if p not in PANEL_PAGES.values()]
    have = [GEN / f'page-{p}.png' for p in solo]
    if all(f.exists() for f in have):
        target = np.mean([np.asarray(Image.open(f).convert('RGB'), float).reshape(-1, 3).mean(0)
                          for f in have], axis=0)
        source = np.mean([np.asarray(p.convert('RGB'), float).reshape(-1, 3).mean(0)
                          for p in panels.values()], axis=0)
        # Cap the correction: an unusually light or dark sheet would otherwise
        # be dragged so far that the whole book goes flat and sepia.
        gain = np.clip(target / source, 0.93, 1.07)
        print(f'  grading panels by {gain.round(3)} to match the solo pages')
        for page, panel in panels.items():
            a = np.asarray(panel, float) * gain
            panels[page] = Image.fromarray(np.clip(a, 0, 255).astype('uint8'))

    for page, panel in panels.items():
        panel.save(GEN / f'page-{page}.png')
        print(f'  page-{page}.png  {panel.size[0]}x{panel.size[1]}')

    # The cover is cut from the same sheet, so it cannot be a different machine
    # or a different child — which is exactly what it was when generated alone.
    cover = panels[3].copy()
    cover.save(GEN / 'cover.png')
    print(f'  cover.png    {cover.size[0]}x{cover.size[1]}  (cut from panel A)')
    return 0


def main() -> int:
    if '--slice' not in sys.argv and not generate():
        return 1
    return slice_sheet()


if __name__ == '__main__':
    sys.exit(main())
