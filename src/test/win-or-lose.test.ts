import { describe, it, expect } from 'vitest';
import { WIN_OR_LOSE_META, WIN_OR_LOSE_SCENARIOS } from '../games/win-or-lose';

describe('win-or-lose', () => {
  it('has scenarios', () => expect(WIN_OR_LOSE_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(WIN_OR_LOSE_META.id).toBe('win-or-lose'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of WIN_OR_LOSE_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
