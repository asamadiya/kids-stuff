import { describe, it, expect } from 'vitest';
import {
  ODD_EVEN_ROUNDS,
  ODD_EVEN_META,
  ODD_EVEN_OPTIONS,
  getOddEvenOptions,
  getOddEvenFeedback,
  parityLabel,
  parityOf,
  pairInfo,
  type Parity,
} from '../games/odd-even';

describe('odd-even pure module', () => {
  it('has a non-empty rounds array with >= 12 rounds', () => {
    expect(ODD_EVEN_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('exports well-formed META', () => {
    expect(ODD_EVEN_META.id).toBe('odd-even');
    expect(ODD_EVEN_META.title.length).toBeGreaterThan(0);
    expect(ODD_EVEN_META.tagline.length).toBeGreaterThan(0);
  });

  it('every round number is within 1-20', () => {
    for (const r of ODD_EVEN_ROUNDS) {
      expect(r.n).toBeGreaterThanOrEqual(1);
      expect(r.n).toBeLessThanOrEqual(20);
    }
  });

  it('every round answer is actually correct math (computed independently)', () => {
    for (const r of ODD_EVEN_ROUNDS) {
      const truth: Parity = r.n % 2 === 0 ? 'even' : 'odd';
      expect(r.answer).toBe(truth);
      expect(parityOf(r.n)).toBe(truth);
    }
  });

  it('pairInfo reconstructs n and leftover matches parity', () => {
    for (const r of ODD_EVEN_ROUNDS) {
      const { pairs, leftover } = pairInfo(r.n);
      expect(pairs * 2 + leftover).toBe(r.n);
      expect(leftover === 0 ? 'even' : 'odd').toBe(r.answer);
    }
  });

  it('options have stable length and always include the correct answer', () => {
    ODD_EVEN_ROUNDS.forEach((r, i) => {
      const opts = getOddEvenOptions(i);
      expect(opts.length).toBe(ODD_EVEN_OPTIONS.length);
      expect(opts.length).toBe(2);
      expect(opts).toContain(r.answer);
    });
  });

  it('parityLabel returns a non-empty string for both parities', () => {
    expect(parityLabel('odd').length).toBeGreaterThan(0);
    expect(parityLabel('even').length).toBeGreaterThan(0);
  });

  it('feedback is non-empty for every choice and stays positive', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    for (const r of ODD_EVEN_ROUNDS) {
      for (const sel of ODD_EVEN_OPTIONS) {
        const fb = getOddEvenFeedback(r, sel);
        expect(fb.length).toBeGreaterThan(0);
        expect(fb).not.toMatch(banned);
      }
    }
  });
});
