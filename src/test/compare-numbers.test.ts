import { describe, expect, it } from 'vitest';
import {
  COMPARE_NUMBERS_META,
  COMPARE_ROUNDS,
  EQUAL,
  getCompareAnswer,
  getCompareFeedback,
  getCompareHint,
  getCompareLabel,
  getCompareOptions,
} from '../games/compare-numbers';

describe('compare-numbers pure module', () => {
  it('exposes well-formed meta', () => {
    expect(COMPARE_NUMBERS_META.id).toBe('compare-numbers');
    expect(COMPARE_NUMBERS_META.title.length).toBeGreaterThan(0);
  });

  it('has at least 12 rounds', () => {
    expect(COMPARE_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round option list has a stable length of 3 and includes the answer', () => {
    for (const round of COMPARE_ROUNDS) {
      const opts = getCompareOptions(round);
      expect(opts).toHaveLength(3);
      const answer = getCompareAnswer(round);
      expect(opts).toContain(answer);
    }
  });

  it('computes the correct answer for every round (verified independently)', () => {
    for (const round of COMPARE_ROUNDS) {
      const expected = round.a === round.b ? EQUAL : Math.max(round.a, round.b);
      expect(getCompareAnswer(round)).toBe(expected);
    }
  });

  it('options always contain both numbers', () => {
    for (const round of COMPARE_ROUNDS) {
      const opts = getCompareOptions(round);
      expect(opts).toContain(round.a);
      expect(opts).toContain(round.b);
    }
  });

  it('label helper returns a non-empty string for numbers and EQUAL', () => {
    expect(getCompareLabel(42).length).toBeGreaterThan(0);
    expect(getCompareLabel(EQUAL).length).toBeGreaterThan(0);
  });

  it('hint helper returns a non-empty string', () => {
    expect(getCompareHint().length).toBeGreaterThan(0);
  });

  it('feedback is non-empty and warm for every option of every round', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    for (const round of COMPARE_ROUNDS) {
      for (const opt of getCompareOptions(round)) {
        const fb = getCompareFeedback(round, opt);
        expect(fb.length).toBeGreaterThan(0);
        expect(fb).not.toMatch(banned);
      }
    }
  });

  it('includes at least one equal round and it resolves to EQUAL', () => {
    const equalRounds = COMPARE_ROUNDS.filter((r) => r.a === r.b);
    expect(equalRounds.length).toBeGreaterThan(0);
    for (const r of equalRounds) {
      expect(getCompareAnswer(r)).toBe(EQUAL);
    }
  });
});
