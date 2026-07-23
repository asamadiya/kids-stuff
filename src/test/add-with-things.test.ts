import { describe, expect, it } from 'vitest';
import {
  ADD_ROUNDS,
  ADD_WITH_THINGS_META,
  OPTION_COUNT,
  getAddFeedback,
  getAddHint,
  getAddOptions,
  sumOf,
} from '../games/add-with-things';

describe('add-with-things logic', () => {
  it('has a non-empty rounds array', () => {
    expect(ADD_ROUNDS.length).toBeGreaterThan(0);
    expect(ADD_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('exposes stable meta', () => {
    expect(ADD_WITH_THINGS_META.id).toBe('add-with-things');
    expect(ADD_WITH_THINGS_META.title.length).toBeGreaterThan(0);
  });

  it('every round sum is correct single-digit-input addition', () => {
    for (const round of ADD_ROUNDS) {
      expect(round.left).toBeGreaterThanOrEqual(1);
      expect(round.left).toBeLessThanOrEqual(9);
      expect(round.right).toBeGreaterThanOrEqual(1);
      expect(round.right).toBeLessThanOrEqual(9);
      // Compute the answer independently in the test.
      expect(sumOf(round)).toBe(round.left + round.right);
      expect(sumOf(round)).toBeLessThanOrEqual(12);
    }
  });

  it('options always include the correct answer', () => {
    for (let i = 0; i < ADD_ROUNDS.length; i++) {
      const round = ADD_ROUNDS[i];
      const opts = getAddOptions(i);
      expect(opts).toContain(round.left + round.right);
    }
  });

  it('option lists have a stable length and no duplicates or negatives', () => {
    for (let i = 0; i < ADD_ROUNDS.length * 3; i++) {
      const opts = getAddOptions(i);
      expect(opts.length).toBe(OPTION_COUNT);
      expect(new Set(opts).size).toBe(OPTION_COUNT);
      for (const o of opts) expect(o).toBeGreaterThanOrEqual(0);
    }
  });

  it('options are deterministic per index', () => {
    for (let i = 0; i < ADD_ROUNDS.length; i++) {
      expect(getAddOptions(i)).toEqual(getAddOptions(i));
    }
  });

  it('feedback helper returns a non-empty string for any choice', () => {
    for (let i = 0; i < ADD_ROUNDS.length; i++) {
      const round = ADD_ROUNDS[i];
      const answer = sumOf(round);
      expect(getAddFeedback(round, answer).length).toBeGreaterThan(0);
      expect(getAddFeedback(round, answer + 1).length).toBeGreaterThan(0);
    }
  });

  it('hint helper returns a non-empty string', () => {
    for (const round of ADD_ROUNDS) {
      expect(getAddHint(round).length).toBeGreaterThan(0);
    }
  });
});
