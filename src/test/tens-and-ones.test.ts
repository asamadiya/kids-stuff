import { describe, it, expect } from 'vitest';
import {
  TENS_AND_ONES_META,
  TENS_ONES_ROUNDS,
  TENS_ONES_OPTION_COUNT,
  getTensOnesOptions,
  getTensOnesFeedback,
  getTensOnesPrompt,
  roundTotal,
} from '../games/tens-and-ones';

describe('tens-and-ones meta', () => {
  it('has expected identity', () => {
    expect(TENS_AND_ONES_META.id).toBe('tens-and-ones');
    expect(TENS_AND_ONES_META.color).toBe('sky');
    expect(TENS_AND_ONES_META.title.length).toBeGreaterThan(0);
  });
});

describe('tens-and-ones rounds', () => {
  it('has a non-empty rounds array', () => {
    expect(TENS_ONES_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least 12 rounds', () => {
    expect(TENS_ONES_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every total is a valid two-digit answer 11..99', () => {
    for (const round of TENS_ONES_ROUNDS) {
      const total = roundTotal(round);
      expect(total).toBeGreaterThanOrEqual(11);
      expect(total).toBeLessThanOrEqual(99);
      // recompute independently to prove correctness
      expect(total).toBe(round.tens * 10 + round.ones);
    }
  });

  it('tens and ones are single-digit and in range', () => {
    for (const round of TENS_ONES_ROUNDS) {
      expect(round.tens).toBeGreaterThanOrEqual(1);
      expect(round.tens).toBeLessThanOrEqual(9);
      expect(round.ones).toBeGreaterThanOrEqual(0);
      expect(round.ones).toBeLessThanOrEqual(9);
    }
  });
});

describe('getTensOnesOptions', () => {
  it('always includes the correct answer', () => {
    TENS_ONES_ROUNDS.forEach((round, i) => {
      const opts = getTensOnesOptions(i);
      expect(opts).toContain(roundTotal(round));
    });
  });

  it('has a stable option length', () => {
    TENS_ONES_ROUNDS.forEach((_, i) => {
      expect(getTensOnesOptions(i)).toHaveLength(TENS_ONES_OPTION_COUNT);
    });
  });

  it('contains no duplicate options', () => {
    TENS_ONES_ROUNDS.forEach((_, i) => {
      const opts = getTensOnesOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    });
  });

  it('keeps all options within 10..99', () => {
    TENS_ONES_ROUNDS.forEach((_, i) => {
      for (const o of getTensOnesOptions(i)) {
        expect(o).toBeGreaterThanOrEqual(10);
        expect(o).toBeLessThanOrEqual(99);
      }
    });
  });

  it('is deterministic across calls', () => {
    TENS_ONES_ROUNDS.forEach((_, i) => {
      expect(getTensOnesOptions(i)).toEqual(getTensOnesOptions(i));
    });
  });

  it('wraps by modulo beyond the rounds length', () => {
    const i = TENS_ONES_ROUNDS.length + 2;
    const wrapped = getTensOnesOptions(i);
    expect(wrapped).toContain(roundTotal(TENS_ONES_ROUNDS[i % TENS_ONES_ROUNDS.length]));
  });
});

describe('getTensOnesFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    TENS_ONES_ROUNDS.forEach((round) => {
      const msg = getTensOnesFeedback(round, roundTotal(round));
      expect(msg.length).toBeGreaterThan(0);
      expect(msg).toContain(String(roundTotal(round)));
    });
  });

  it('returns a warm non-empty string for a wrong choice', () => {
    TENS_ONES_ROUNDS.forEach((round) => {
      const wrong = roundTotal(round) === 99 ? 11 : roundTotal(round) + 1;
      const msg = getTensOnesFeedback(round, wrong);
      expect(msg.length).toBeGreaterThan(0);
      const negative = /wrong|incorrect|\bno\b|lose|fail/i;
      expect(negative.test(msg)).toBe(false);
    });
  });
});

describe('getTensOnesPrompt', () => {
  it('returns a non-empty prompt', () => {
    expect(getTensOnesPrompt().length).toBeGreaterThan(0);
  });
});
