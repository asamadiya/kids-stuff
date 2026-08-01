#!/usr/bin/env python3
"""Bring the olive book into the library's luminance range.

On the shelf this story's tile read as duller than the ones around it, and my
first diagnosis — "cooler and greyer" — was wrong. Measured against its eight
alphabetical neighbours' covers:

    warmth (R-B)   65.5  vs  63.4    -> the same
    saturation     0.480 vs  0.440   -> slightly MORE, not less
    luma           123.7 vs 144.4    -> 21 points, 14%, DARKER

So the hue is right and the book is simply dark. A dark tile among bright ones
reads as grey, which is what I saw and misnamed.

The correction is therefore a midtone lift, not a colour shift: out =
(in/255) ** GAMMA, applied equally to all three channels. Gamma pins 0 and 255,
so nothing clips at either end and the hue ratios survive; only the middle
moves. A flat multiply would have blown out the lamp flame and the oil
highlights.

ONE gamma for the whole book, derived from the daylight pages only. Page 13 is
a night scene and is *supposed* to be darker than the rest; normalising each
page to its own target would have flattened the book's only change of light.

Idempotent: it always re-derives from the untouched sliced panels (`_r10-*`,
`_r11-*`), never from its own output, so running it twice cannot double-grade.

    python3 scripts/grade-olive.py            # measure and report only
    python3 scripts/grade-olive.py --apply    # write the graded pages
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SLUG = 'the-screw-that-squeezed-the-olives'
GEN = Path.home() / 'my_stuff/kids-stuff/generated' / SLUG
ART = Path('public/art') / SLUG

# Page 1 came from a second roll of the same prompt; the chosen sheet drew two
# grandfathers and no girl there.
SOURCE = {1: 11, 2: 10, 4: 10, 5: 10, 6: 10, 8: 10, 10: 10, 12: 10, 13: 10}
NIGHT = 13          # excluded from the measurement, included in the grade
TARGET_LUMA = 142.0  # the eight neighbouring covers average 144.4

LUMA = np.array([0.299, 0.587, 0.114])


def source_path(page: int) -> Path:
    return GEN / f'_r{SOURCE[page]}-page-{page}.png'


def mean_luma(a: np.ndarray) -> float:
    return float((a.reshape(-1, 3) @ LUMA).mean())


def solve_gamma() -> tuple[float, float]:
    """The one exponent that puts the daylight pages at TARGET_LUMA."""
    day = [np.asarray(Image.open(source_path(p)).convert('RGB'), float)
           for p in SOURCE if p != NIGHT]
    before = float(np.mean([mean_luma(a) for a in day]))
    # mean(x**g) is monotonic in g; bisect rather than pretend the mean of a
    # power equals the power of the mean.
    lo, hi = 0.50, 1.00
    norm = [a / 255.0 for a in day]
    for _ in range(40):
        mid = (lo + hi) / 2
        got = float(np.mean([mean_luma(n ** mid) for n in norm])) * 255
        if got < TARGET_LUMA:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2, before


def grade(a: np.ndarray, gamma: float) -> np.ndarray:
    return np.clip((a / 255.0) ** gamma * 255.0, 0, 255).astype('uint8')


def main() -> int:
    gamma, before = solve_gamma()
    print(f'daylight pages: luma {before:.1f} -> target {TARGET_LUMA:.1f}   gamma {gamma:.3f}')

    apply = '--apply' in sys.argv
    for page in sorted(SOURCE):
        src = np.asarray(Image.open(source_path(page)).convert('RGB'), float)
        out = grade(src, gamma)
        tag = ' (night, left relatively dark)' if page == NIGHT else ''
        print(f'  page-{page:<2} {mean_luma(src):6.1f} -> {mean_luma(out.astype(float)):6.1f}{tag}')
        if apply:
            im = Image.fromarray(out)
            im.save(GEN / f'page-{page}.png')
            im.save(ART / f'page-{page}.png')
            if page == 4:  # the cover is cut from page 4
                im.save(GEN / 'cover.png')
                im.save(ART / 'cover.png')
    if not apply:
        print('\nnothing written. re-run with --apply')
    return 0


if __name__ == '__main__':
    sys.exit(main())
