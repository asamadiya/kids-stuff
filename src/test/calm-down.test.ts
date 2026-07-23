import { describe, it, expect } from 'vitest';
import { CALM_DOWN_META, CALM_DOWN_SCENARIOS } from '../games/calm-down';

describe('calm-down', () => {
  it('has scenarios', () => expect(CALM_DOWN_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(CALM_DOWN_META.id).toBe('calm-down'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of CALM_DOWN_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
