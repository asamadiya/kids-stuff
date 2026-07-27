import { describe, it, expect } from 'vitest';
import {
  FRACTIONPIZZA_META,
  FRACTIONS,
  FRACTION_ROUNDS,
  fractionInfo,
  getFractionOptions,
  getFractionFeedback,
  type FractionValue,
} from '../games/fraction-pizza';

// Map a fraction label to its numeric value for real-math checks.
const NUMERIC: Record<FractionValue, number> = {
  '1/2': 1 / 2,
  '1/3': 1 / 3,
  '1/4': 1 / 4,
};

describe('fraction-pizza meta', () => {
  it('has the required META shape', () => {
    expect(FRACTIONPIZZA_META.id).toBe('fraction-pizza');
    expect(FRACTIONPIZZA_META.title).toBe('Fractions: Equal Parts');
    expect(FRACTIONPIZZA_META.color).toBe('sun');
    expect(FRACTIONPIZZA_META.icon.length).toBeGreaterThan(0);
    expect(FRACTIONPIZZA_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('fraction-pizza rounds', () => {
  it('has at least 12 rounds', () => {
    expect(FRACTION_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round has a stable 3-option list containing the correct answer', () => {
    FRACTION_ROUNDS.forEach((round, i) => {
      const opts = getFractionOptions(i);
      expect(opts.length).toBe(3);
      expect(opts).toContain(round.answer);
    });
  });

  it('option list length is stable across every index including looping', () => {
    for (let i = 0; i < FRACTION_ROUNDS.length * 2 + 1; i += 1) {
      expect(getFractionOptions(i).length).toBe(3);
    }
  });

  it('every round answer is real, correct fraction math', () => {
    FRACTION_ROUNDS.forEach((round) => {
      const info = fractionInfo(round.answer);
      // Answer label must equal 1 / denom of the pizza.
      expect(NUMERIC[round.answer]).toBeCloseTo(1 / info.denom, 10);
      // denom on the round equals the denom implied by the answer.
      expect(round.denom).toBe(info.denom);

      if (round.kind === 'shaded') {
        // Shaded part is exactly one slice => shaded/denom === answer.
        expect(round.shaded).toBe(1);
        expect(round.shaded / round.denom).toBeCloseTo(NUMERIC[round.answer], 10);
      } else {
        // Leftover is one slice => (denom - shaded) === 1 and left === answer.
        const left = round.denom - round.shaded;
        expect(left).toBe(1);
        expect(left / round.denom).toBeCloseTo(NUMERIC[round.answer], 10);
      }
    });
  });
});

describe('fraction-pizza helpers', () => {
  it('fractionInfo returns matching info for every fraction', () => {
    FRACTIONS.forEach((f) => {
      const info = fractionInfo(f.value);
      expect(info.value).toBe(f.value);
      expect(info.denom).toBe(f.denom);
      expect(info.word.length).toBeGreaterThan(0);
    });
  });

  it('getFractionFeedback returns a non-empty warm string for any choice', () => {
    FRACTION_ROUNDS.forEach((round) => {
      (['1/2', '1/3', '1/4'] as FractionValue[]).forEach((sel) => {
        const fb = getFractionFeedback(round, sel);
        expect(fb.length).toBeGreaterThan(0);
        // Never uses discouraging words.
        expect(fb.toLowerCase()).not.toMatch(/wrong|incorrect|\bno\b|lose|fail/);
      });
    });
  });

  it('feedback names the correct answer even when the pick is wrong', () => {
    const round = FRACTION_ROUNDS[0];
    const wrong: FractionValue = round.answer === '1/2' ? '1/3' : '1/2';
    expect(getFractionFeedback(round, wrong)).toContain(round.answer);
  });
});
