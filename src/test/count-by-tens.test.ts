import { describe, it, expect } from 'vitest';
import {
  COUNT_BY_TENS_META,
  COUNT_BY_TENS_ROUNDS,
  getCountByTensOptions,
  getCountByTensFeedback,
} from '../games/count-by-tens';

describe('count-by-tens meta', () => {
  it('has the expected id and color', () => {
    expect(COUNT_BY_TENS_META.id).toBe('count-by-tens');
    expect(COUNT_BY_TENS_META.color).toBe('leaf');
  });
});

describe('count-by-tens rounds', () => {
  it('has at least 12 rounds', () => {
    expect(COUNT_BY_TENS_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round has a non-empty sequence', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      expect(round.sequence.length).toBeGreaterThan(0);
    }
  });

  it('every option list has a stable length of 3', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      expect(round.options.length).toBe(3);
    }
  });

  it('every round includes the correct answer among its options', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      expect(round.options).toContain(round.answer);
    }
  });

  it('the answer is genuinely the next skip-by-10 term (computed here)', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      const last = round.sequence[round.sequence.length - 1];
      expect(round.answer).toBe(last + 10);
    }
  });

  it('each sequence itself increments by exactly 10', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      for (let i = 1; i < round.sequence.length; i += 1) {
        expect(round.sequence[i]).toBe(round.sequence[i - 1] + 10);
      }
    }
  });

  it('answer preserves the ones digit of the sequence', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      const last = round.sequence[round.sequence.length - 1];
      expect(round.answer % 10).toBe(last % 10);
    }
  });

  it('options are unique within each round', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      expect(new Set(round.options).size).toBe(round.options.length);
    }
  });
});

describe('getCountByTensOptions', () => {
  it('returns options containing the answer and wraps by modulo', () => {
    for (let i = 0; i < COUNT_BY_TENS_ROUNDS.length * 2; i += 1) {
      const round = COUNT_BY_TENS_ROUNDS[i % COUNT_BY_TENS_ROUNDS.length];
      const opts = getCountByTensOptions(i);
      expect(opts).toContain(round.answer);
      expect(opts.length).toBe(3);
    }
  });
});

describe('getCountByTensFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      const msg = getCountByTensFeedback(round, round.answer);
      expect(msg.length).toBeGreaterThan(0);
    }
  });

  it('returns a non-empty, non-negative string for a wrong choice', () => {
    for (const round of COUNT_BY_TENS_ROUNDS) {
      const wrong = round.options.find((o) => o !== round.answer);
      expect(wrong).toBeDefined();
      const msg = getCountByTensFeedback(round, wrong as number);
      expect(msg.length).toBeGreaterThan(0);
      expect(msg.toLowerCase()).not.toMatch(/wrong|incorrect|\bno\b|lose|fail/);
    }
  });
});
