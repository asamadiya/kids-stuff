import { describe, it, expect } from 'vitest';
import {
  COMPARE_ROUNDS,
  getCompareFeedback,
  getCompareOptions,
  moreSide,
  sideCount,
  sideLabel,
} from '../games/which-has-more';

describe('which-has-more data', () => {
  it('has a non-empty round list', () => {
    expect(COMPARE_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least 12 rounds', () => {
    expect(COMPARE_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps counts in 1..8 and never equal, differing by 1-3', () => {
    for (const r of COMPARE_ROUNDS) {
      expect(r.left).toBeGreaterThanOrEqual(1);
      expect(r.left).toBeLessThanOrEqual(8);
      expect(r.right).toBeGreaterThanOrEqual(1);
      expect(r.right).toBeLessThanOrEqual(8);
      expect(r.left).not.toBe(r.right);
      const diff = Math.abs(r.left - r.right);
      expect(diff).toBeGreaterThanOrEqual(1);
      expect(diff).toBeLessThanOrEqual(3);
    }
  });

  it('has unique round ids', () => {
    const ids = new Set(COMPARE_ROUNDS.map((r) => r.id));
    expect(ids.size).toBe(COMPARE_ROUNDS.length);
  });
});

describe('which-has-more options', () => {
  it('always offers both sides', () => {
    const opts = getCompareOptions();
    expect(opts).toContain('left');
    expect(opts).toContain('right');
  });

  it('has a stable option length of 2', () => {
    expect(getCompareOptions().length).toBe(2);
  });

  it('includes the correct answer among the options for every round', () => {
    for (const r of COMPARE_ROUNDS) {
      expect(getCompareOptions()).toContain(moreSide(r));
    }
  });
});

describe('which-has-more helpers', () => {
  it('moreSide points to the larger group', () => {
    for (const r of COMPARE_ROUNDS) {
      const winner = moreSide(r);
      expect(sideCount(r, winner)).toBeGreaterThan(
        sideCount(r, winner === 'left' ? 'right' : 'left'),
      );
    }
  });

  it('sideLabel returns a non-empty string', () => {
    expect(sideLabel('left').length).toBeGreaterThan(0);
    expect(sideLabel('right').length).toBeGreaterThan(0);
  });

  it('feedback is warm and non-empty for any choice', () => {
    for (const r of COMPARE_ROUNDS) {
      for (const sel of getCompareOptions()) {
        const msg = getCompareFeedback(r, sel);
        expect(msg.length).toBeGreaterThan(0);
        expect(msg.toLowerCase()).not.toMatch(/wrong|incorrect|\bno\b|lose|fail/);
      }
    }
  });

  it('names both counts in feedback', () => {
    const r = COMPARE_ROUNDS[0];
    const msg = getCompareFeedback(r, moreSide(r));
    expect(msg).toContain(String(Math.max(r.left, r.right)));
    expect(msg).toContain(String(Math.min(r.left, r.right)));
  });
});
