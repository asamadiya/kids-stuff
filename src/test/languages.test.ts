import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { LANG_BOOKS, MOMENTS, RHYMES, WORDS } from '../languages';
import type { Said } from '../languages';
import { GUIDE } from '../languages/guide';
import { REQUIRED_NOTE_FIELDS } from '../notes/types';

/**
 * Telugu & Tamil: the parent asked for content to help two children growing
 * up in the Bay Area keep Nanna's Telugu and Amma's Tamil. The advisor's q8
 * ruling E set the shape. These are the invariants that keep it honest: each
 * language in its own script, never the other's, a romanisation and a meaning
 * for the grown-up, and no recorded voice that the app pretends to have.
 */

const TE = /[ఀ-౿]/;
const TA = /[஀-௿]/;
const LATIN = /[A-Za-z]/;

const inScript = (s: Said, lang: 'te' | 'ta') => {
  const own = lang === 'te' ? TE : TA;
  const other = lang === 'te' ? TA : TE;
  return own.test(s.script) && !other.test(s.script) && !LATIN.test(s.script) && LATIN.test(s.roman) && s.means.length > 1;
};

describe('Telugu & Tamil', () => {
  it('has the advisor’s launch mix: about a dozen moments, songs in each language, two books, about two dozen words, and the guide', () => {
    expect(MOMENTS.length).toBeGreaterThanOrEqual(10);
    expect(RHYMES.filter((r) => r.lang === 'te').length).toBeGreaterThanOrEqual(3);
    expect(RHYMES.filter((r) => r.lang === 'ta').length).toBeGreaterThanOrEqual(3);
    expect(LANG_BOOKS.length).toBeGreaterThanOrEqual(2);
    expect(WORDS.length).toBeGreaterThanOrEqual(20);
    expect(GUIDE.sections.length).toBeGreaterThanOrEqual(6);
  });

  it('keeps ids unique, so recordings never collide', () => {
    const ids = [
      ...MOMENTS.flatMap((m) => [m.id, ...m.grownUp.map((_, i) => `${m.id}.g${i}`), ...m.child.map((_, i) => `${m.id}.c${i}`)]),
      ...RHYMES.flatMap((r) => [r.id, `${r.id}.title`, ...r.lines.map((_, i) => `${r.id}.l${i}`)]),
      ...LANG_BOOKS.flatMap((b) => [b.id, ...b.pages.map((_, i) => `${b.id}.p${i}`)]),
      ...WORDS.map((w) => w.id),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(MOMENTS.map((m) => [m.id, m] as const))('moment %s is in the right script in both languages', (_id, m) => {
    for (const p of [...m.grownUp, ...m.child]) {
      expect(inScript(p.te, 'te'), `te: ${p.te.script}`).toBe(true);
      expect(inScript(p.ta, 'ta'), `ta: ${p.ta.script}`).toBe(true);
    }
    for (const k of REQUIRED_NOTE_FIELDS) expect(m.note[k]?.length ?? 0, k).toBeGreaterThan(20);
    expect(m.child.length, 'something he can say back').toBeGreaterThan(0);
  });

  it.each(RHYMES.map((r) => [r.id, r] as const))('rhyme %s is in its own script, with its origin stated', (_id, r) => {
    expect(inScript(r.title, r.lang)).toBe(true);
    for (const l of r.lines) expect(inScript(l, r.lang), l.script).toBe(true);
    expect(r.origin.length).toBeGreaterThan(30);
  });

  it.each(LANG_BOOKS.map((b) => [b.id, b] as const))('book %s has a Telugu and a Tamil version of every page', (_id, b) => {
    for (const p of b.pages) {
      expect(inScript(p.te, 'te'), p.te.script).toBe(true);
      expect(inScript(p.ta, 'ta'), p.ta.script).toBe(true);
    }
  });

  it.each(WORDS.map((w) => [w.id, w] as const))('word %s is in both scripts', (_id, w) => {
    expect(inScript(w.te, 'te')).toBe(true);
    expect(inScript(w.ta, 'ta')).toBe(true);
  });

  it('has a picture for every moment, rhyme, book page and word', () => {
    const missing = [
      ...MOMENTS.map((m) => `public/art/langs/${m.id}.webp`),
      ...RHYMES.map((r) => `public/art/langs/${r.id}.webp`),
      ...LANG_BOOKS.flatMap((b) => b.pages.map((_, i) => `public/art/langs/${b.id}/page-${i + 1}.webp`)),
      ...WORDS.map((w) => `public/art/langs/words/${w.id}.webp`),
    ].filter((f) => !existsSync(f));
    expect(missing).toEqual([]);
  });
});
