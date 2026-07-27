import { describe, it, expect } from 'vitest';
import { SHARING_TURNS_META, SHARING_TURNS_SCENARIOS } from '../games/sharing-turns';

describe('sharing-turns', () => {
  it('has scenarios', () => expect(SHARING_TURNS_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(SHARING_TURNS_META.id).toBe('sharing-turns'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of SHARING_TURNS_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
