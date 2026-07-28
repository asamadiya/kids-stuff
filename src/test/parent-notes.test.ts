import { describe, expect, it } from 'vitest';
import { PARENT_NOTES, parentNote } from '../components/parentNotes';

/**
 * The father opened the site and could not tell what several exercises were
 * for. A note keyed to an id that does not exist is invisible and the compiler
 * cannot see it, so the coverage is asserted here instead.
 */
describe('every exercise explains itself to the adult', () => {
  it('covers a note for each id, with all four fields filled', () => {
    const empty = Object.entries(PARENT_NOTES)
      .filter(([, n]) => !n.what?.trim() || !n.practising?.trim() || !n.ask?.trim() || !n.honest?.trim())
      .map(([id]) => id);
    expect(empty).toEqual([]);
    expect(Object.keys(PARENT_NOTES).length).toBeGreaterThanOrEqual(50);
  });

  it('never praises the exercise it describes', () => {
    // The honest field exists to name the cap. A note that flatters its own
    // exercise is worth nothing to someone deciding how to spend an hour.
    const praise = /\b(great|excellent|wonderful|amazing|perfect|delightful|fun|engaging|exciting)\b/i;
    const flattering = Object.entries(PARENT_NOTES)
      .filter(([, n]) => praise.test(n.honest))
      .map(([id]) => id);
    expect(flattering).toEqual([]);
  });

  it('writes to an adult, without exclamation marks or baby register', () => {
    const baby = /\b(little learner|kiddo|sweetie|yay|woohoo)\b/i;
    for (const [id, n] of Object.entries(PARENT_NOTES)) {
      for (const field of [n.what, n.practising, n.ask, n.honest]) {
        expect(field, id).not.toMatch(/!/);
        expect(field, id).not.toMatch(baby);
      }
    }
  });

  it('returns nothing for an unknown id rather than throwing', () => {
    expect(parentNote('no-such-exercise')).toBeUndefined();
  });
});
