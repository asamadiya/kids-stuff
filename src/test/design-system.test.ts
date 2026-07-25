import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The brief for this product is explicit: no "western candy" styling, no
 * pigeonholing, no baby-talk, no non-academic register. Those are easy to
 * regress by accident, so they are asserted here rather than left to taste.
 */
const styleDir = 'src/styles';
const css = readdirSync(styleDir)
  .filter((f) => f.endsWith('.css'))
  .map((f) => ({ file: f, text: readFileSync(join(styleDir, f), 'utf8') }));

const componentFiles = readdirSync('src/components')
  .filter((f) => f.endsWith('.tsx'))
  .map((f) => ({ file: f, text: readFileSync(join('src/components', f), 'utf8') }));

const gameFiles = readdirSync('src/games')
  .filter((f) => f.endsWith('.ts'))
  .map((f) => ({ file: f, text: readFileSync(join('src/games', f), 'utf8') }));

const relLum = (hex: string): number => {
  const h = hex.replace('#', '');
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = ch.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};
const contrast = (a: string, b: string): number => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

describe('visual language: a field guide, not a sweet shop', () => {
  it('uses no decorative gradients', () => {
    const offenders = css
      .filter(({ text }) => /linear-gradient|radial-gradient/.test(text))
      .map(({ file }) => file);
    expect(offenders).toEqual([]);
  });

  it('does not round everything into pills', () => {
    // 999px is reserved for genuinely circular pips; keep that rare.
    const pills = css.reduce((n, { text }) => n + (text.match(/999px/g) ?? []).length, 0);
    expect(pills).toBeLessThanOrEqual(2);
  });

  it('sets a real reading serif, not a rounded display face', () => {
    const tokens = css.find((c) => c.file === 'tokens.css')!.text;
    expect(tokens).toMatch(/--font-serif:\s*'Literata'/);
    expect(tokens).not.toMatch(/Rounded/i);
    expect(tokens).not.toMatch(/Trebuchet/i);
  });


  it('never paints text in a colour that vanishes on the page', () => {
    const tokens = css.find((c) => c.file === 'tokens.css')!.text;
    const raw = new Map<string, string>();
    for (const m of tokens.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) raw.set(m[1], m[2]);
    const alias = new Map<string, string>();
    for (const m of tokens.matchAll(/--([\w-]+):\s*var\(--([\w-]+)\)/g)) alias.set(m[1], m[2]);
    const resolve = (name: string, depth = 0): string | undefined =>
      raw.get(name) ?? (depth < 8 && alias.has(name) ? resolve(alias.get(name)!, depth + 1) : undefined);

    const paper = resolve('paper')!;
    const failures: string[] = [];
    for (const { file, text } of css) {
      for (const m of text.matchAll(/(?<![-\w])color:\s*var\(--([\w-]+)\)/g)) {
        const value = resolve(m[1]);
        if (value && contrast(value, paper) < 4.5) {
          failures.push(`${file}: color:var(--${m[1]}) = ${contrast(value, paper).toFixed(2)}:1`);
        }
      }
    }
    expect([...new Set(failures)]).toEqual([]);
  });

  it('keeps every ink colour legible on paper (WCAG AA)', () => {
    const tokens = css.find((c) => c.file === 'tokens.css')!.text;
    const val = (name: string) =>
      tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))![1];
    const paper = val('paper');
    for (const ink of ['ink', 'ink-soft', 'ink-faint', 'terracotta', 'ochre', 'teal', 'olive', 'slate']) {
      expect(contrast(val(ink), paper), `${ink} on paper`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('register: the child is addressed as a capable person', () => {
  const banned = [
    'Nobody ever loses', 'learning buddy', 'Play Zone', 'did-you-know corner',
    'Yay!', 'Woohoo', 'Great job', 'Awesome!', 'sweetie',
  ];
  it('contains no baby-talk in the interface', () => {
    const hits: string[] = [];
    for (const { file, text } of [...componentFiles, ...gameFiles]) {
      for (const phrase of banned) {
        if (text.includes(phrase)) hits.push(`${file}: ${phrase}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('awards no star stickers', () => {
    const hits = [...componentFiles, ...gameFiles]
      .filter(({ text }) => /[★☆]/.test(text))
      .map(({ file }) => file);
    expect(hits).toEqual([]);
  });

  it('states the result instead of praising the child', () => {
    const praise = /\b(Great|Perfect|Awesome|Well done|Sharp) (job|work|counting|thinking|effort|try|slicing)/;
    const hits = gameFiles.filter(({ text }) => praise.test(text)).map(({ file }) => file);
    expect(hits).toEqual([]);
  });

  it('does not sort the child by developmental stage', () => {
    // "First Learning" implied a floor on what he is offered.
    const hits = [...componentFiles].filter(({ text }) => text.includes('First Learning'));
    expect(hits.map((h) => h.file)).toEqual([]);
  });
});

describe('exercise mechanics are honest', () => {
  it('never credits the tally for a wrong answer', () => {
    const unguarded = componentFiles
      .filter(({ text }) => /\n\s*setScore\(\(s\) => s \+ 1\);/.test(text))
      .filter(({ text }) => !/if \([^)]+\) setScore|if \(isMatch\)/.test(text))
      .map(({ file }) => file);
    expect(unguarded).toEqual([]);
  });

  it('leaves answered options reachable by keyboard and screen reader', () => {
    const hardDisabled = componentFiles
      .filter(({ text }) => /\sdisabled=\{answered\}/.test(text))
      .map(({ file }) => file);
    expect(hardDisabled).toEqual([]);
  });
});
