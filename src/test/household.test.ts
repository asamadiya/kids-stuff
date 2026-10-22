import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { BOOKS } from '../books/registry';

/**
 * The family is a Bay Area Telugu–Tamil household (the parent, 2026-10-22:
 * "Remember this is a Telugu household ... What's 'Dada'? Use 'Dad' and
 * 'Nanna' and 'Amma' and 'Mom' interchangeably"). The first redesign drew a
 * Hindi-speaking family in Jaipur; this keeps it from coming back, in words or
 * in the picture prompts the art is made from.
 */

const OLD = /\b(Mummy|Papa|Dadi|Dada|Nani|Jaipur|Rajasthan|Rajasthani)\b/;

const filesUnder = (dir: string, ext: RegExp): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? filesUnder(join(dir, d.name), ext) : ext.test(d.name) && !d.name.startsWith('_') ? [join(dir, d.name)] : [],
  );

const CONTENT = [
  ...filesUnder('src/books/data', /\.ts$/),
  ...filesUnder('src/make', /\.ts$/),
  ...filesUnder('src/together', /\.tsx?$/),
  ...filesUnder('src/sel', /\.ts$/),
  ...filesUnder('src/maths/games', /\.tsx$/),
  ...filesUnder('src/science/games', /\.tsx$/),
  ...filesUnder('src/learn', /\.tsx?$/).filter((f) => !f.includes('archive-notes')),
];

describe('the household', () => {
  it.each(CONTENT.map((f) => [f] as const))('%s has no trace of the old Hindi/Jaipur family', (f) => {
    const hits = readFileSync(f, 'utf8')
      .split('\n')
      .map((line, i) => [i + 1, line] as const)
      .filter(([, line]) => OLD.test(line));
    expect(hits.map(([n, l]) => `${n}: ${l.trim().slice(0, 100)}`)).toEqual([]);
  });

  it('casts every family book from the new sheets', () => {
    for (const b of BOOKS) if (b.cast) expect(['family', 'telugu-grandparents', 'tamil-grandparents', 'friends'], b.slug).toContain(b.cast);
  });

  it('has Mia call her brother "anna" somewhere in the family books, and nobody call her "Mia akka" or similar', () => {
    const family = BOOKS.filter((b) => b.cast === 'family' || b.cast?.endsWith('grandparents'));
    const text = family.flatMap((b) => b.pages.map((p) => p.text)).join(' ');
    expect(text).toMatch(/\banna\b/);
    expect(text).not.toMatch(/\bMia (akka|chelli|thangachi)\b/);
  });
});
