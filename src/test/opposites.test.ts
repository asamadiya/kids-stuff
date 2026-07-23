import { describe, it, expect } from 'vitest';
import {
  OPPOSITE_ROUNDS,
  OPPOSITES_META,
  getOppositeOptions,
  getOppositeFeedback,
  oppositeLabel,
} from '../games/opposites';

describe('opposites data', () => {
  it('has a non-empty rounds array', () => {
    expect(OPPOSITE_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has valid meta', () => {
    expect(OPPOSITES_META.id).toBe('opposites');
    expect(OPPOSITES_META.title.length).toBeGreaterThan(0);
  });
});

describe('getOppositeOptions', () => {
  it('includes the correct answer for every round', () => {
    OPPOSITE_ROUNDS.forEach((round, i) => {
      const opts = getOppositeOptions(i);
      expect(opts).toContain(round.opposite);
    });
  });

  it('returns a stable option length', () => {
    const len = getOppositeOptions(0).length;
    OPPOSITE_ROUNDS.forEach((_, i) => {
      expect(getOppositeOptions(i).length).toBe(len);
    });
    expect(len).toBeGreaterThanOrEqual(3);
    expect(len).toBeLessThanOrEqual(4);
  });

  it('has no duplicate options within a round', () => {
    OPPOSITE_ROUNDS.forEach((_, i) => {
      const opts = getOppositeOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    });
  });
});

describe('getOppositeFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    const round = OPPOSITE_ROUNDS[0];
    expect(getOppositeFeedback(round, round.opposite).length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for a wrong choice', () => {
    const round = OPPOSITE_ROUNDS[0];
    const other = round.distractors[0];
    const msg = getOppositeFeedback(round, other);
    expect(msg.length).toBeGreaterThan(0);
  });

  it('never uses discouraging words', () => {
    const banned = ['wrong', 'no', 'incorrect', 'lose', 'fail'];
    OPPOSITE_ROUNDS.forEach((round) => {
      [round.opposite, ...round.distractors].forEach((sel) => {
        const msg = getOppositeFeedback(round, sel).toLowerCase();
        banned.forEach((b) => {
          expect(new RegExp(`\\b${b}\\b`).test(msg)).toBe(false);
        });
      });
    });
  });
});

describe('oppositeLabel', () => {
  it('capitalizes the first letter', () => {
    expect(oppositeLabel('small')).toBe('Small');
  });
});
