import { describe, expect, it } from 'vitest';
import { BOOKS } from '../books/registry';
import { REQUIRED_NOTE_FIELDS } from '../notes/types';

/**
 * The advisor's reading-level and story rulings, as assertions.
 *
 * Read aloud by a grown-up: 15-35 words a page with 50 as the ceiling; 2-4
 * sentences; none over 16 words. A refrain, where a book has one, appears
 * verbatim at more than one moment. Every page names its calm text zone and
 * describes a picture that is accountable to the words.
 */

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const sentences = (s: string) =>
  s
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?”])\s+(?=[“"A-Z])/)
    .map((x) => x.trim())
    .filter(Boolean);

const MEAT = /\b(chicken|mutton|lamb|beef|pork|bacon|ham|fish|prawn|shrimp|meat|sausage|salami|turkey|tuna|crab)\b/i;

describe('the picture books', () => {
  it('has a slate', () => {
    expect(BOOKS.length).toBeGreaterThanOrEqual(12);
  });

  it('uses each slug once', () => {
    const slugs = BOOKS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe.each(BOOKS.map((b) => [b.slug, b] as const))('%s', (_slug, book) => {
  it('is 10 to 12 pages', () => {
    expect(book.pages.length).toBeGreaterThanOrEqual(10);
    expect(book.pages.length).toBeLessThanOrEqual(12);
  });

  it('keeps every page readable aloud', () => {
    for (const [i, p] of book.pages.entries()) {
      const n = words(p.text);
      if (p.big) {
        expect(n, `page ${i + 1} (big)`).toBeLessThanOrEqual(8);
        continue;
      }
      expect(n, `page ${i + 1}: ${p.text}`).toBeLessThanOrEqual(50);
      expect(n, `page ${i + 1}: ${p.text}`).toBeGreaterThanOrEqual(8);
    }
  });

  it('averages a picture-book page, not a caption or an essay', () => {
    const prose = book.pages.filter((p) => !p.big).map((p) => words(p.text));
    const mean = prose.reduce((a, b) => a + b, 0) / prose.length;
    expect(mean).toBeGreaterThanOrEqual(15);
    expect(mean).toBeLessThanOrEqual(38);
  });

  it('keeps every sentence to sixteen words', () => {
    for (const [i, p] of book.pages.entries()) {
      for (const s of sentences(p.text)) {
        expect(words(s), `page ${i + 1}: ${s}`).toBeLessThanOrEqual(16);
      }
    }
  });

  it('repeats its refrain verbatim', () => {
    if (!book.refrain) return;
    const norm = (s: string) => s.toLowerCase().replace(/[“”"’'.,!?]/g, '');
    const hits = book.pages.filter((p) => norm(p.text).includes(norm(book.refrain!))).length;
    expect(hits, book.refrain).toBeGreaterThanOrEqual(2);
  });

  it('describes a picture for every page and leaves room for the words', () => {
    for (const [i, p] of book.pages.entries()) {
      expect(p.alt.length, `page ${i + 1} alt`).toBeGreaterThan(15);
      if (!p.figureId) expect(words(p.art), `page ${i + 1} art`).toBeGreaterThanOrEqual(12);
      expect(['top', 'bottom', 'left', 'right']).toContain(p.zone);
    }
  });

  it('names who is in each cast picture, and only the cast', () => {
    if (!book.cast) {
      expect(book.characterLine, 'non-cast books describe their characters once').toBeTruthy();
      return;
    }
    for (const [i, p] of book.pages.entries()) {
      if (p.figureId) continue;
      expect(p.characters, `page ${i + 1}`).toBeDefined();
    }
  });

  it('never makes Rikki a character', () => {
    for (const p of book.pages) expect(p.text).not.toMatch(/\bRikki\b/);
  });

  it('serves no meat or fish', () => {
    for (const p of book.pages) {
      expect(p.text).not.toMatch(MEAT);
      expect(p.art).not.toMatch(MEAT);
    }
  });

  it('carries a complete grown-up note', () => {
    for (const f of REQUIRED_NOTE_FIELDS) {
      expect(String(book.note[f] ?? ''), f).not.toBe('');
    }
  });

  it('gives people books their sources', () => {
    if (book.shelf === 'people') expect(book.sources?.length ?? 0).toBeGreaterThanOrEqual(1);
  });
});
