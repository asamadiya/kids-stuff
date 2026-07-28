import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { NOUNS, VESSELS, counted, type Noun } from '../games/nouns';
import { TAKE_AWAY_ROUNDS } from '../games/take-away';
import { SHARE_ROUNDS } from '../games/share-fairly';

/**
 * Two defects are guarded here.
 *
 * A round in Take Away carried U+1F38E JAPANESE DOLLS while calling the objects
 * "eggs" — a two-figure glyph, so nine eggs drew eighteen dolls. Pinning each
 * glyph's Unicode name in the record catches exactly that: swap the glyph and
 * the pin fails. (Asserting instead that the Unicode name *contains* the noun
 * would be useless — it false-alarms on LEAF FLUTTERING IN WIND, SPIRAL SHELL,
 * NUT AND BOLT and ROCK, and an 83%-false-positive gate gets muted.)
 *
 * Plurals were produced by string surgery, which shipped "Give one strawberrie
 * to each bowl" and "3 bunnys". The mechanism is banned rather than the
 * symptoms, so a newly added noun cannot reintroduce it.
 */

const named = (glyph: string): string => {
  // Strip a trailing variation selector before naming the base code point.
  const cp = [...glyph].filter((c) => c !== '️')[0];
  return unicodeName(cp);
};

/** Node exposes no Unicode name table, so derive it from the committed pins. */
function unicodeName(cp: string): string {
  return NAME_BY_CODEPOINT[cp.codePointAt(0)!] ?? '<unknown>';
}

/**
 * The expected names, keyed by code point. Written out rather than looked up so
 * that the assertion compares two independently-authored facts: the glyph in
 * the record, and the name a human read off the Unicode chart.
 */
const NAME_BY_CODEPOINT: Record<number, string> = {
  0x1f331: 'SEEDLING', 0x1f41a: 'SPIRAL SHELL', 0x1faa8: 'ROCK', 0x1f9f1: 'BRICK',
  0x1f944: 'SPOON', 0x1f511: 'KEY', 0x1f343: 'LEAF FLUTTERING IN WIND',
  0x1fab6: 'FEATHER', 0x1f330: 'CHESTNUT', 0x1f529: 'NUT AND BOLT', 0x1f95a: 'EGG',
  0x1f955: 'CARROT', 0x1f9e6: 'SOCKS', 0x1f56f: 'CANDLE', 0x1f4cf: 'STRAIGHT RULER',
  0x1fab5: 'WOOD', 0x1f963: 'BOWL WITH SPOON', 0x1f9fa: 'BASKET', 0x1faa3: 'BUCKET',
  0x1fad9: 'JAR', 0x1f4e6: 'PACKAGE', 0x1f5c4: 'FILE CABINET',
};

const ALL: Noun[] = [...Object.values(NOUNS), ...Object.values(VESSELS)];

describe('the noun table', () => {
  it('pins every glyph to its Unicode name', () => {
    const wrong = ALL.filter((x) => named(x.glyph) !== x.unicode)
      .map((x) => `${x.singular}: ${x.glyph} is ${named(x.glyph)}, record says ${x.unicode}`);
    expect(wrong).toEqual([]);
  });

  it('writes both word forms out, never deriving one from the other', () => {
    const derived = ALL.filter((x) => x.plural === `${x.singular}s` && x.singular.endsWith('s'));
    expect(derived).toEqual([]);
    expect(NOUNS.leaf.plural).toBe('leaves');
    expect(VESSELS.shelf.plural).toBe('shelves');
    expect(VESSELS.box.plural).toBe('boxes');
  });

  it('agrees count with form', () => {
    expect(counted(1, NOUNS.leaf)).toBe('1 leaf');
    expect(counted(3, NOUNS.leaf)).toBe('3 leaves');
    expect(counted(1, VESSELS.box)).toBe('1 box');
  });
});

describe('the counting objects', () => {
  it('are not the candy register', () => {
    const banned = /cookie|candy|candies|cupcake|donut|doughnut|balloon|lollipop|pizza|pancake|bacon|sweet/i;
    const bad = ALL.filter((x) => banned.test(x.singular) || banned.test(x.unicode));
    expect(bad.map((x) => x.singular)).toEqual([]);
  });

  it('are used by the rounds that count them', () => {
    for (const r of TAKE_AWAY_ROUNDS) expect(ALL).toContain(r.item);
    for (const r of SHARE_ROUNDS) {
      expect(ALL).toContain(r.item);
      expect(ALL).toContain(r.vessel);
    }
  });
});

describe('no string surgery anywhere', () => {
  const files: { file: string; text: string }[] = [];
  // Comments describe the banned pattern, so the gate reads code only.
  const stripComments = (src: string): string =>
    src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  for (const dir of ['src/games', 'src/components']) {
    for (const f of readdirSync(dir)) {
      if (/\.(ts|tsx)$/.test(f)) {
        files.push({ file: join(dir, f), text: stripComments(readFileSync(join(dir, f), 'utf8')) });
      }
    }
  }

  it('never strips a trailing s to make a singular', () => {
    const hits = files.filter((f) => /replace\(\s*\/s\$\//.test(f.text)).map((f) => f.file);
    expect(hits).toEqual([]);
  });

  it('never appends an s to an interpolated noun to make a plural', () => {
    // `${thing}s` — the mechanism that produced "bunnys" and "party tables".
    const hits = files
      .filter((f) => /\$\{[^}]*[Nn]ame\}s\b|\$\{[^}]*noun[^}]*\}s\b/.test(f.text))
      .map((f) => f.file);
    expect(hits).toEqual([]);
  });
});

describe('the whole practice section is ovo-lacto-vegetarian', () => {
  /**
   * The family are ovo-lacto-vegetarian: eggs and dairy yes, meat and fish
   * never. This guards food, not animals — a chicken in "which one is not a
   * bird?" and a fish in "which one is not something we wear?" are zoology and
   * stay. What may not appear is meat or fish presented as something to eat,
   * or as an object to count on a plate.
   */
  const foodGlyphs = /🍖|🍗|🥩|🥓|🍤|🍣|🍱|🐟(?=[^']*(?:eat|meal|plate|dish|food))/;
  // parent-notes-*.ts is prose for the adult about the exercises; it names the
  // candy register in order to say it was removed.
  const files = readdirSync('src/games')
    .filter((f) => f.endsWith('.ts') && !f.startsWith('parent-notes'))
    .map((f) => ({ file: f, text: readFileSync(join('src/games', f), 'utf8') }));

  it('serves no meat or fish', () => {
    const hits = files.filter((f) => foodGlyphs.test(f.text)).map((f) => f.file);
    expect(hits).toEqual([]);
  });

  it('counts no candy, in glyph or in word', () => {
    // Both halves matter: swapping the glyph while the prompt still reads
    // "6 cookies" produces exactly the picture-versus-text mismatch this whole
    // pass exists to remove. Comments are stripped so prose describing the ban
    // does not trip it.
    const strip = (src: string): string =>
      src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
    const candyGlyph = /🍪|🍬|🧁|🍩|🍭|🍰|🎂|🍫/;
    const candyWord = /\b(cookies?|donuts?|doughnuts?|candies|candy|cupcakes?|lollipops?|pizzas?|sweets)\b/i;
    // Identifier positions are excluded: `id: 'fraction-pizza'` is a routing
    // slug and a storage key, not something a child reads.
    const childFacing = (src: string): string =>
      strip(src).replace(/\bid:\s*'[^']*'/g, '');
    const hits = files
      .map((f) => ({ ...f, text: childFacing(f.text) }))
      .filter((f) => candyGlyph.test(f.text) || candyWord.test(f.text))
      .map((f) => f.file);
    expect(hits).toEqual([]);
  });
});
