import { describe, it, expect } from 'vitest';
import {
  TIMES_TABLES_META,
  TIMES_ROUNDS,
  TIMES_OPTION_COUNT,
  getTimesOptions,
  getTimesFeedback,
  timesProduct,
  timesQuestion,
  timesHint,
} from '../games/times-tables';

describe('times-tables meta', () => {
  it('has the expected identity', () => {
    expect(TIMES_TABLES_META.id).toBe('times-tables');
    expect(TIMES_TABLES_META.title.length).toBeGreaterThan(0);
    expect(TIMES_TABLES_META.color).toBe('sun');
  });
});

describe('times-tables rounds', () => {
  it('has a non-empty rounds array', () => {
    expect(TIMES_ROUNDS.length).toBeGreaterThan(0);
    expect(TIMES_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('only uses the 2, 5, and 10 families', () => {
    for (const round of TIMES_ROUNDS) {
      expect([2, 5, 10]).toContain(round.a);
    }
  });

  it('produces a stable option-list length that includes the correct answer', () => {
    TIMES_ROUNDS.forEach((round, i) => {
      const opts = getTimesOptions(i);
      expect(opts.length).toBe(TIMES_OPTION_COUNT);
      // unique
      expect(new Set(opts).size).toBe(opts.length);
      // includes correct product
      expect(opts).toContain(timesProduct(round));
      // all positive
      for (const o of opts) expect(o).toBeGreaterThan(0);
    });
  });

  it('computes correct math for every round', () => {
    for (const round of TIMES_ROUNDS) {
      // independent recomputation via repeated addition
      let expected = 0;
      for (let k = 0; k < round.b; k += 1) expected += round.a;
      expect(timesProduct(round)).toBe(expected);
    }
  });

  it('wraps deterministically with modulo indexing', () => {
    const first = getTimesOptions(0);
    const wrapped = getTimesOptions(TIMES_ROUNDS.length);
    expect(wrapped).toEqual(first);
  });
});

describe('times-tables helpers return non-empty strings', () => {
  it('question helper', () => {
    for (const round of TIMES_ROUNDS) {
      expect(timesQuestion(round).length).toBeGreaterThan(0);
    }
  });

  it('hint helper', () => {
    for (const round of TIMES_ROUNDS) {
      expect(timesHint(round).length).toBeGreaterThan(0);
    }
  });

  it('feedback helper is warm for correct and incorrect picks', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    TIMES_ROUNDS.forEach((round, i) => {
      const answer = timesProduct(round);
      const correct = getTimesFeedback(round, answer);
      expect(correct.length).toBeGreaterThan(0);
      expect(correct).toMatch(String(answer));
      expect(banned.test(correct)).toBe(false);

      const wrongPick = getTimesOptions(i).find((o) => o !== answer)!;
      const missed = getTimesFeedback(round, wrongPick);
      expect(missed.length).toBeGreaterThan(0);
      // still reveals the right answer, positively
      expect(missed).toMatch(String(answer));
      expect(banned.test(missed)).toBe(false);
    });
  });
});
