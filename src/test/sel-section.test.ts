import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Rikki played the old version of this section and said "why is this asking
 * for feeling again and again". He was right: 123 of its 160 rounds asked him
 * to name a feeling, and every one was scored. These guards keep the
 * replacement from drifting back.
 */
const dir = 'src/sel';
/** Comments state the guarantees ("never a score"), so the guards read code only. */
const stripComments = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');

const modules = readdirSync(dir).filter((f) => f.endsWith('.ts'))
  .map((f) => ({ file: f, text: stripComments(readFileSync(join(dir, f), 'utf8')) }));

const components = readdirSync('src/components/sel').filter((f) => f.endsWith('.tsx'))
  .map((f) => ({ file: f, text: stripComments(readFileSync(join('src/components/sel', f), 'utf8')) }));

describe('the section is wide, not one question twelve times', () => {
  it('has twelve exercises', () => {
    expect(modules).toHaveLength(12);
    expect(components).toHaveLength(12);
  });

  it('gives every exercise a meta record the bench can list', () => {
    for (const m of modules) {
      expect(m.text, m.file).toMatch(/export const \w*_META\s*=\s*\{/);
      expect(m.text, m.file).toMatch(/id:\s*'[a-z0-9-]+'/);
    }
  });

  it('asks the child to name a feeling in at most one exercise', () => {
    const naming = modules.filter((m) =>
      /how (does|do|might) .{0,24}feel|what feeling|name the feeling/i.test(m.text));
    expect(naming.map((m) => m.file)).toHaveLength(0);
  });
});

describe('nothing about him is marked', () => {
  it('holds no field that could encode a right answer', () => {
    // `points` is excluded: it is the SVG polyline attribute, not a tally.
    const forbidden = /\b(answerId|isCorrect|correctId|correctAnswer)\b|\b(score|streak)\s*[:=][^=]/;
    const hits = [...modules, ...components]
      .filter((m) => forbidden.test(m.text)).map((m) => m.file);
    expect(hits).toEqual([]);
  });

  it('never grades the child in copy', () => {
    const graded = /\b(correct|incorrect|wrong|well done|good job|great job|nice try|try again)\b/i;
    const hits = modules.filter((m) => graded.test(m.text)).map((m) => m.file);
    expect(hits).toEqual([]);
  });

  it('never moralises about what he chose', () => {
    // The consequence is drawn and stated; the copy does not add a verdict.
    const preachy = /\b(you should have|the kind thing to do|the right thing to do|naughty|bad choice)\b/i;
    const hits = modules.filter((m) => preachy.test(m.text)).map((m) => m.file);
    expect(hits).toEqual([]);
  });

  it('awards nothing — no stars, badges or points anywhere', () => {
    const hits = [...modules, ...components]
      .filter((m) => /[★☆]|badge|trophy/i.test(m.text)).map((m) => m.file);
    expect(hits).toEqual([]);
  });
});

describe('it is built on the bench, not on the quiz shell', () => {
  it('uses the bench markup rather than the exercise-quiz markup', () => {
    for (const c of components) {
      expect(c.text, c.file).toMatch(/className="bench"/);
      expect(c.text, c.file).not.toMatch(/className="mini-game"/);
      expect(c.text, c.file).not.toMatch(/mini-option/);
    }
  });

  it('speaks its prompts aloud, because he does not read fluently', () => {
    const mute = components.filter((c) => !/\bsay\(/.test(c.text)).map((c) => c.file);
    expect(mute).toEqual([]);
  });

  it('leaves the old quiz shell deleted', () => {
    const games = readdirSync('src/games');
    expect(games).not.toContain('comic.ts');
    expect(readdirSync('src/components')).not.toContain('ComicSelGame.tsx');
  });
});
