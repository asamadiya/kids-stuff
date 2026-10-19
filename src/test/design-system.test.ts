import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { MATHS_GAMES } from '../maths/registry';
import { SCIENCE_GAMES } from '../science/registry';

/**
 * The parent's standing rules for how this looks and talks, as assertions.
 *
 * The Learning Center redesign deliberately moved from a quiet beige field
 * guide to rich colour and rounded type (the parent asked for "visually rich
 * and engaging"), so the old rules against pills and rounded faces are gone.
 * What stays is what he actually ruled out: candy-sweetness, baby-talk, star
 * stickers, praise instead of information, motion, and colour you cannot read.
 */

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const css = walk('src/styles/lc').filter((f) => f.endsWith('.css')).map((f) => ({ file: f, text: readFileSync(f, 'utf8') }));
const ui = ['src/learn', 'src/play', 'src/maths', 'src/science', 'src/books', 'src/make']
  .flatMap(walk)
  .filter((f) => /\.tsx?$/.test(f))
  .map((f) => ({ file: f, text: readFileSync(f, 'utf8') }));

const relLum = (hex: string): number => {
  const h = hex.replace('#', '');
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = ch.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};
const contrast = (a: string, b: string) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const tokens = readFileSync('src/styles/lc/tokens.css', 'utf8');
const token = (name: string) => {
  const m = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(tokens);
  if (!m) throw new Error(`no token --${name}`);
  return m[1];
};

describe('colour you can read', () => {
  it.each([
    ['ink', 'paper'], ['ink-soft', 'paper'],
    ['paper', 'stories'], ['paper', 'maths'], ['paper', 'science'], ['paper', 'make'],
    ['stories-deep', 'stories-tint'], ['maths-deep', 'maths-tint'], ['science-deep', 'science-tint'], ['make-deep', 'make-tint'],
    ['paper', 'ones'], ['paper', 'tens'], ['paper', 'hundreds'], ['ink', 'gold'],
  ])('%s on %s meets WCAG AA', (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});

describe('no motion, no candy', () => {
  it('animates nothing', () => {
    // The standing rule since July: static pictures, no "make it move".
    for (const { file, text } of css) {
      expect(text, file).not.toMatch(/@keyframes|animation\s*:|transition\s*:/);
    }
    for (const { file, text } of ui) expect(text, file).not.toMatch(/framer-motion/);
  });

  it('uses no rainbow or candy gradients', () => {
    for (const { file, text } of css) expect(text, file).not.toMatch(/(linear|radial|conic)-gradient\((?![^)]*transparent)/);
  });
});

describe('the child is addressed as a capable person', () => {
  const strings = ui.map((u) => u.text).join('\n');

  it('contains no baby-talk', () => {
    expect(strings).not.toMatch(/\b(yummy|tummy-?ache|itty|teeny|wee one|kiddo|sweetie|super-?duper|yay+!|woo+hoo)\b/i);
  });

  it('awards no stars, trophies or streaks', () => {
    // Checked against what a child is SHOWN — every prompt, explanation, hint and
    // level name the games can produce — not the source, where the chance game's
    // run-of-draws round is legitimately called kind: 'streak'.
    const shown = [...MATHS_GAMES, ...SCIENCE_GAMES].flatMap((g) => {
      const out: string[] = [g.title, g.hook, ...g.levels];
      for (const level of [1, 2, 3] as const) {
        for (let i = 0; i < 5; i += 1) {
          const r = g.generate(level, i);
          out.push(g.prompt(r));
          if (g.kind === 'solve') {
            out.push(g.explain(r));
            out.push(g.check(r, g.emptyAnswer(r)).hint ?? '');
          } else {
            out.push(g.why(r));
          }
        }
      }
      return out;
    });
    const hits = shown.filter((t) => /⭐|🏆|🥇|\bstreak\b|\bgold star\b|\bpoints?\b to win/i.test(t));
    expect(hits).toEqual([]);
  });

  it('states the result instead of praising the child', () => {
    expect(strings).not.toMatch(/['"`](Great job|Good job|Well done|Awesome|Amazing|Super|Brilliant)[!.]/);
  });
});
