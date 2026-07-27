import { describe, it, expect } from 'vitest';
import { TELLING_TRUTH_META, TELLING_TRUTH_SCENARIOS } from '../games/telling-truth';

describe('telling-truth', () => {
  it('has scenarios', () => expect(TELLING_TRUTH_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(TELLING_TRUTH_META.id).toBe('telling-truth'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of TELLING_TRUTH_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
