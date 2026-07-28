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

  it('tells you how to play, in ordered steps, for every single item', () => {
    // The complaint that produced this was that the workshop instruments could
    // not be started: The Quadrat renders 36 controls against 82 words. An item
    // with no steps is an item nobody can begin.
    const stepless = Object.entries(PARENT_NOTES)
      .filter(([, n]) => (n.how?.length ?? 0) < 3)
      .map(([id]) => id);
    expect(stepless).toEqual([]);
  });

  it('writes steps a person can actually carry out', () => {
    const vague = /\b(explore|experiment|discover|play around|interact|engage|try things)\b/i;
    for (const [id, n] of Object.entries(PARENT_NOTES)) {
      for (const step of n.how ?? []) {
        expect(step, `${id}: "${step}"`).not.toMatch(vague);
        // A step is one instruction, not a paragraph.
        expect(step.length, `${id}: "${step}"`).toBeLessThan(150);
        expect(step.trim().length).toBeGreaterThan(8);
      }
    }
  });

  it('names the skills precisely, never in the language of a brochure', () => {
    const empty = /\b(critical thinking|creativity|confidence|social skills|life skills|growth mindset|21st century)\b/i;
    for (const [id, n] of Object.entries(PARENT_NOTES)) {
      expect((n.skills?.length ?? 0), id).toBeGreaterThanOrEqual(2);
      for (const skill of n.skills ?? []) expect(skill, id).not.toMatch(empty);
    }
  });

  it('covers the Story Loom, which had no note at all', () => {
    // WorkshopHub returned the Loom early, before the note was ever reached.
    const loom = PARENT_NOTES['story-loom'];
    expect(loom).toBeDefined();
    expect(loom.how?.length ?? 0).toBeGreaterThanOrEqual(3);
  });
});
