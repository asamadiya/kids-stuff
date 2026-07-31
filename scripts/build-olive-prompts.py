#!/usr/bin/env python3
"""Build the art prompts for the olive story from the locked source constants.

The lock lives in src/stories/the-screw-that-squeezed-the-olives.ts as PRESS,
CAST and TOWER. Building the prompts here rather than typing them into a
scratch file is the whole point: the last attempt kept the machine description
in a throwaway TSV, so nothing held it and reviewers counting threads afterwards
found four different screws across twelve pages.
"""
import re
import sys

SEP = chr(31)
SRC = 'src/stories/the-screw-that-squeezed-the-olives.ts'

STYLE = (
    "A warm, semi-realistic painterly children's storybook illustration in soft natural light, "
    "muted earth palette (olive green, honey wood, terracotta, warm stone grey) on warm off-white "
    "paper. Ancient Roman farm, first century. Real proportions, no cartoon exaggeration, no "
    "glossy or plastic look, no sparkles, no text, no letters, no numbers. The illustration "
    "bleeds to the edge: no border, no frame, no mount, no white margin. "
)


def constant(src: str, name: str) -> str:
    """Join a multi-line `const NAME = 'a' + 'b';` back into one string.

    The terminator is a quote-then-semicolon at end of line, not the first
    semicolon: these strings contain semicolons of their own ("down its
    length; it stands between two uprights"), and scanning to the first one
    silently truncated the lock to a quarter of its length.
    """
    start = src.index(f'const {name} =')
    lines = src[start:].split('\n')
    body = []
    for line in lines:
        body.append(line)
        if line.rstrip().endswith("';"):
            break
    text = '\n'.join(body)
    return ''.join(
        part.replace("\\'", "'")
        for part in re.findall(r"'((?:[^'\\]|\\.)*)'", text)
    )


def main() -> int:
    want = {int(a) for a in sys.argv[1:]} or set(range(1, 13))
    src = open(SRC, encoding='utf-8').read()
    press, cast, tower = (constant(src, n) for n in ('PRESS', 'CAST', 'TOWER'))

    comps = re.findall(
        r"composition:\s*\n\s*(PRESS \+ CAST(?: \+ TOWER)?) \+\n\s*'((?:[^'\\]|\\.)*)',", src)
    focus = re.findall(r"focus: '((?:[^'\\]|\\.)*)'", src)
    assert len(comps) == 12 and len(focus) == 12, (len(comps), len(focus))

    rows = []
    for i, ((which, tail), foc) in enumerate(zip(comps, focus), 1):
        if i not in want:
            continue
        lock = press + cast + (tower if 'TOWER' in which else '')
        body = (tail + '. Focus on ' + foc + '.').replace("\\'", "'")
        rows.append(f'the-screw-that-squeezed-the-olives{SEP}page-{i}{SEP}{STYLE}{lock}{body}')

    out = '/tmp/artpipe/olive-build.tsv'
    open(out, 'w', encoding='utf-8').write('\n'.join(rows) + '\n')
    print(f'{len(rows)} prompts -> {out}')
    print(f'lock lengths: PRESS {len(press)} CAST {len(cast)} TOWER {len(tower)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
