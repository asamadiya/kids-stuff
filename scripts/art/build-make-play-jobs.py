#!/usr/bin/env python3
"""MAI-Image-2.6 jobs for Make & Do steps and Play Together pictures.

Every picture is an EDIT of one cast reference sheet, so Arjun, Mia and the
grown-ups look the same in every step and every game (the recipe measured on
2026-10-19 in build-book-jobs.py): the prompt leads with the action, says not
to copy the sheet's standing poses, takes only the identities, and names who
is NOT in the picture. A picture with Dadi or Dada uses the grandparents
sheet; one with Mummy or Papa uses the family sheet.

    build-make-play-jobs.py --out jobs.jsonl [--only make|play] [id ...]
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

import importlib.util
spec = importlib.util.spec_from_file_location('bbj', Path(__file__).with_name('build-book-jobs.py'))
bbj = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bbj)
LOOKS, CAST_SHEETS = bbj.LOOKS, bbj.CAST_SHEETS

STYLE = ('Rich gouache picture-book illustration, saturated warm colour, visible brush texture, expressive faces, '
         'confident ink outlines, natural proportions, detailed real setting, no text, no letters, no numbers, no signature.')

ADULTS = ('Mummy', 'Papa', 'Dadi', 'Dada')


def named(text: str) -> list[str]:
    return [n for n in ('Arjun', 'Mia', 'Mummy', 'Papa', 'Dadi', 'Dada') if re.search(rf'\b{n}\b', text)]


def sheet_for(people: list[str]) -> str:
    return 'grandparents' if any(p in ('Dadi', 'Dada') for p in people) else 'family'


def prompt(action: str, people: list[str], *, how_to: bool) -> tuple[str, str]:
    sheet = sheet_for(people)
    who = '; '.join(LOOKS[n] for n in people)
    absent = [n for n in bbj.SHEET_CAST[sheet] if n not in people]
    p = (f'ACTION FIRST: {action} '
         'New camera angle and natural mid-action poses — do NOT copy the standing poses of the reference image. '
         f'Take ONLY the identities from the reference image: {who}; keep their faces, hair and clothes exactly. '
         + (f"Not in this picture: {', '.join(absent)}. Draw each person exactly once. " if absent else 'Draw each person exactly once. ')
         + ('Show the hands and the materials clearly so a child can copy the step. ' if how_to else
            'Show the one moment of play clearly: what each person is doing and with what. ')
         + 'Fill the whole frame with the scene. ' + STYLE)
    return ' '.join(p.split()), CAST_SHEETS[sheet]


def load(kind: str) -> list[dict]:
    entry = 'src/make/activities.ts' if kind == 'make' else 'src/together/index.ts'
    name = 'ACTIVITIES' if kind == 'make' else 'IDEAS'
    js = f"import {{ {name} }} from './{entry}'; process.stdout.write(JSON.stringify({name}));"
    Path('.check-books').mkdir(exist_ok=True)
    tmp = Path('.check-books') / f'load-{kind}.ts'
    tmp.write_text(js.replace("'./src/", "'../src/"))
    out = subprocess.run(['npx', 'vite-node', str(tmp)], check=True, capture_output=True, text=True).stdout
    return json.loads(out[out.index('['):])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('ids', nargs='*')
    ap.add_argument('--out', required=True)
    ap.add_argument('--only', choices=('make', 'play'))
    ap.add_argument('--stamp', action='store_true', help='record the prompt digest of every existing picture')
    a = ap.parse_args()
    jobs = []
    if a.only in (None, 'make'):
        for act in load('make'):
            if a.ids and act['id'] not in a.ids:
                continue
            # The first twelve activities predate this script; their pictures are in git.
            if not act.get('sources'):
                continue
            for i, step in enumerate(act['steps'], 1):
                people = named(step['art']) or ['Arjun']
                p, ref = prompt(step['art'], people, how_to=True)
                jobs.append({'out': f"public/art/make/{act['id']}/step-{i}.png", 'prompt': p, 'ref': ref})
    if a.only in (None, 'play'):
        for x in load('play'):
            if a.ids and x['id'] not in a.ids:
                continue
            p, ref = prompt(x['picture'], list(x['cast']), how_to=False)
            jobs.append({'out': f"public/art/together/{x['id']}.png", 'prompt': p, 'ref': ref})
    # A picture is current only if it was made from the prompt the data now
    # gives. The stamp records each picture's prompt digest, written by
    # `--stamp` after a batch; a changed step or picture text makes its job
    # again, and the stale PNG is moved aside so `maigen batch` will not skip it.
    stamp_path = Path('public/art/make-play-stamp.json')
    stamp = json.loads(stamp_path.read_text()) if stamp_path.exists() else {}
    digest = lambda j: hashlib.sha256((j['prompt'] + j['ref']).encode()).hexdigest()[:16]
    if a.stamp:
        for j in jobs:
            if Path(j['out']).exists():
                stamp.setdefault(j['out'], digest(j))
        stamp_path.write_text(json.dumps(dict(sorted(stamp.items())), indent=0) + '\n')
        print(f'stamped {len(stamp)}')
        return 0
    todo = []
    for j in jobs:
        out = Path(j['out'])
        have = out.exists() and out.stat().st_size > 10_000
        if have and stamp.get(j['out']) not in (None, digest(j)):
            out.rename(out.with_name(out.stem + '.stale.png'))
            stamp.pop(j['out'], None)
            have = False
        if not have:
            todo.append(j)
    stamp_path.write_text(json.dumps(dict(sorted(stamp.items())), indent=0) + '\n')
    Path(a.out).write_text(''.join(json.dumps(j) + '\n' for j in todo))
    print(f'{len(jobs)} pictures, {len(todo)} to make -> {a.out}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
