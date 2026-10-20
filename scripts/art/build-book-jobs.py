#!/usr/bin/env python3
"""Turn a book's page specs into MAI-Image-2.6 jobs, using the cast sheets.

The recipe is measured, not guessed (2026-10-19, see .redesign/proto):

1. Every recurring character comes from ONE reference sheet in public/art/cast/.
   Each page is an EDIT of that sheet, so faces, hair and clothes hold across
   the book. Independent text-to-image calls gave a different child on every
   page — the failure that sank the olive story three times.
2. The prompt leads with the ACTION. Without that, the edit copies the sheet's
   stiff front-facing standing poses into every scene. With "ACTION FIRST ...
   do NOT copy the standing poses ... take ONLY the identities", the same
   characters ran, fell, reached and cried.
3. The words live in a reserved empty zone of the picture, named in the prompt
   ("the TOP THIRD is open sky, kept clear for words"). The app lays the text
   over that zone; the model is never asked to letter a sentence, because a
   misspelt word inside a painting cannot be fixed with a text edit.

Books that do not use the family (traditional tales, history, science) have no
`cast` and are generated text-to-image from the story's own character line, so
a tale's monkey and crocodile stay consistent by being described identically
on every page.

    build-book-jobs.py --out jobs.jsonl [slug ...]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

HOUSE = ('Rich gouache picture-book illustration, saturated warm colour, visible brush texture, '
         'expressive faces, confident ink outlines, natural proportions, detailed real-world setting, '
         'no text, no letters, no numbers, no signature.')

SHEET_CAST = {
    'family': ['Arjun', 'Mia', 'Mummy', 'Papa'],
    'grandparents': ['Dadi', 'Dada', 'Arjun', 'Mia'],
    'friends': ['Arjun', 'Zoe', 'Ben'],
}

CAST_SHEETS = {
    'family': 'public/art/cast/family.png',
    'grandparents': 'public/art/cast/grandparents.png',
    'friends': 'public/art/cast/friends.png',
}

# Repeated verbatim so an edit has words AND pixels pointing at the same person.
LOOKS = {
    'Arjun': 'the five-year-old boy Arjun (short tousled black hair, warm brown skin, dark green T-shirt with a small orange dinosaur, navy shorts, white sneakers)',
    'Mia': 'his two-year-old sister Mia (black hair in a small top tuft with a red clip, round cheeks, coral flowered cotton frock, bare feet)',
    'Mummy': 'their mother (long black hair in a plait, teal cotton kurta over blue jeans, small gold earrings)',
    'Papa': 'their father (short black hair, neat short beard, black-rimmed glasses, rust-coloured shirt, khaki trousers)',
    'Dadi': 'their grandmother Dadi (silver hair in a low bun, round gold-rimmed glasses, deep indigo cotton saree with a thin orange border, glass bangles)',
    'Dada': 'their grandfather Dada (white hair, thick white moustache, cream kurta-pyjama, grey Nehru waistcoat, wooden walking stick)',
    'Zoe': 'their friend Zoe (black bob with a straight fringe, yellow raincoat over a striped top, red rain boots)',
    'Ben': 'their friend Ben (sandy curly hair, freckles, blue denim overalls over a grey T-shirt)',
}

ZONES = {
    'top': 'The TOP QUARTER of the picture is calm, open, uncluttered background (sky, plain wall or soft ground colour) with nothing important in it, kept clear for words.',
    'bottom': 'The BOTTOM QUARTER of the picture is calm, open, uncluttered ground or floor with nothing important in it, kept clear for words.',
    'left': 'The LEFT QUARTER of the picture is a calm, plain, uncluttered area with nothing important in it, kept clear for words.',
    'right': 'The RIGHT QUARTER of the picture is a calm, plain, uncluttered area with nothing important in it, kept clear for words.',
    'none': '',
}


def page_prompt(book: dict, page: dict) -> tuple[str, str | None]:
    who = [n for n in page.get('characters', []) if n in LOOKS]
    absent = [n for n in SHEET_CAST.get(book.get('cast') or '', []) if n not in who]
    zone = ZONES[page.get('zone', 'top')]
    scene = f"{page['art']} Setting: {book.get('setting', '')}".strip()
    cast = book.get('cast')
    if cast:
        people = '; '.join(LOOKS[n] for n in who) if who else 'none of the people'
        prompt = (f'ACTION FIRST: {scene} '
                  f'New camera angle and natural mid-action poses — do NOT copy the standing poses of the reference image. '
                  f'Take ONLY the identities from the reference image: {people}; keep their faces, hair and clothes exactly. '
                  + (f"Not in this picture: {', '.join(absent)}. " if absent else '')
                  + f'{zone} {HOUSE}')
        return prompt, CAST_SHEETS[cast]
    # The character line describes EVERY recurring character, so that each looks
    # the same on every page. Listing them all in every prompt also invites the
    # model to draw them all: the monkey-and-crocodile pilot put the wife on
    # pages where only her husband swims. So the line is framed as a reference,
    # and the prompt says the picture holds only who the page's art names.
    chars = book.get('characterLine', '')
    ref = (f'How the characters look when they appear (a reference, NOT a list of who is in this picture): {chars} '
           f'Draw ONLY the characters this picture describes, each exactly once; anyone else from that reference is absent.') if chars else ''
    prompt = f'ACTION FIRST: {scene} {ref} {zone} {HOUSE}'
    return ' '.join(prompt.split()), None


def load(slug: str) -> dict:
    """Compile one book's TypeScript module and return its data as JSON."""
    src = Path('src/books/data') / f'{slug}.ts'
    out = Path('.check-books') / f'{slug}.mjs'
    out.parent.mkdir(exist_ok=True)
    subprocess.run(['npx', 'esbuild', str(src), '--format=esm', f'--outfile={out}', '--log-level=error'], check=True)
    js = f"import {{ book }} from '{out.resolve().as_uri()}'; process.stdout.write(JSON.stringify(book));"
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', js], check=True, capture_output=True, text=True).stdout)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('slugs', nargs='*')
    ap.add_argument('--out', required=True)
    ap.add_argument('--art-root', default='public/art/books')
    a = ap.parse_args()
    slugs = a.slugs or sorted(p.stem for p in Path('src/books/data').glob('*.ts') if not p.stem.startswith('_'))
    jobs = []
    for slug in slugs:
        book = load(slug)
        slug = book['slug']
        first = book['pages'][0]
        # A cover fills a card edge to edge, so drop the page's reserved-zone
        # sentences ("The top third ... is a plain cream wall") — kept, they paint
        # a blank band across the top of every shelf card.
        art = ' '.join(s for s in re.split(r'(?<=[.!?])\s+', first['art'])
                       if not re.search(r'\b(third|half|quarter)\b.*\b(picture|frame|image)\b|kept clear|empty and calm|calm and empty', s, re.I))
        cover = {**first, 'zone': 'none', 'art': f"A cover picture for the book '{book['title']}', filling the whole frame: " + art}
        p, ref = page_prompt(book, cover)
        jobs.append({'out': f'{a.art_root}/{slug}/cover.png', 'prompt': p, **({'ref': ref} if ref else {})})
        for i, page in enumerate(book['pages'], 1):
            if page.get('figureId') or page.get('noArt'):
                continue
            p, ref = page_prompt(book, page)
            jobs.append({'out': f'{a.art_root}/{slug}/page-{i}.png', 'prompt': p, **({'ref': ref} if ref else {})})
    Path(a.out).write_text(''.join(json.dumps(j) + '\n' for j in jobs))
    print(f'{len(jobs)} jobs -> {a.out}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
