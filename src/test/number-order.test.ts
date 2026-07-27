import { describe, it, expect } from 'vitest';
import {
  NUMBER_ORDER_META,
  NUMBER_ROUNDS,
  getNumberFeedback,
  getNumberHint,
  getNumberOptions,
  kindLabel,
  numberLabel,
} from '../games/number-order';

describe('number-order data', () => {
  it('has a non-empty round list', () => {
    expect(NUMBER_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least ~12 rounds', () => {
    expect(NUMBER_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('has valid meta', () => {
    expect(NUMBER_ORDER_META.id).toBe('number-order');
    expect(NUMBER_ORDER_META.title.length).toBeGreaterThan(0);
    expect(NUMBER_ORDER_META.tagline.length).toBeGreaterThan(0);
  });

  it('every round answer matches its counting pattern', () => {
    for (const r of NUMBER_ROUNDS) {
      const last = r.shown[r.shown.length - 1];
      const step = r.kind === 'up2' ? 2 : 1;
      const expected = r.kind === 'down1' ? last - step : last + step;
      expect(r.answer).toBe(expected);
    }
  });
});

describe('getNumberOptions', () => {
  it('always includes the correct answer', () => {
    NUMBER_ROUNDS.forEach((r, i) => {
      expect(getNumberOptions(i)).toContain(r.answer);
    });
  });

  it('returns a stable option-list length of 3', () => {
    NUMBER_ROUNDS.forEach((_, i) => {
      expect(getNumberOptions(i)).toHaveLength(3);
    });
  });

  it('has unique, non-negative options', () => {
    NUMBER_ROUNDS.forEach((_, i) => {
      const opts = getNumberOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
      opts.forEach((o) => expect(o).toBeGreaterThanOrEqual(0));
    });
  });

  it('wraps with modulo indices', () => {
    const first = getNumberOptions(0);
    const wrapped = getNumberOptions(NUMBER_ROUNDS.length);
    expect(wrapped).toEqual(first);
  });
});

describe('label + feedback helpers', () => {
  it('numberLabel returns a non-empty string', () => {
    NUMBER_ROUNDS.forEach((r) => {
      expect(numberLabel(r.answer).length).toBeGreaterThan(0);
    });
  });

  it('kindLabel returns a non-empty string for every kind', () => {
    NUMBER_ROUNDS.forEach((r) => {
      expect(kindLabel(r.kind).length).toBeGreaterThan(0);
    });
  });

  it('getNumberHint returns a non-empty string', () => {
    NUMBER_ROUNDS.forEach((r) => {
      expect(getNumberHint(r).length).toBeGreaterThan(0);
    });
  });

  it('getNumberFeedback returns a non-empty string for correct and incorrect picks', () => {
    NUMBER_ROUNDS.forEach((r) => {
      const correct = getNumberFeedback(r, r.answer);
      const wrongPick = r.answer + 1;
      const missed = getNumberFeedback(r, wrongPick);
      expect(correct.length).toBeGreaterThan(0);
      expect(missed.length).toBeGreaterThan(0);
    });
  });

  it('never uses discouraging words in feedback', () => {
    const banned = ['wrong', 'no', 'incorrect', 'lose', 'fail'];
    NUMBER_ROUNDS.forEach((r) => {
      const opts = getNumberOptions(NUMBER_ROUNDS.indexOf(r));
      opts.forEach((o) => {
        const text = getNumberFeedback(r, o).toLowerCase();
        banned.forEach((w) => {
          expect(new RegExp(`\\b${w}\\b`).test(text)).toBe(false);
        });
      });
    });
  });
});
