import { describe, it, expect } from 'vitest';
import { MAKING_FRIENDS_META, MAKING_FRIENDS_SCENARIOS } from '../games/making-friends';

describe('making-friends', () => {
  it('has scenarios', () => expect(MAKING_FRIENDS_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(MAKING_FRIENDS_META.id).toBe('making-friends'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of MAKING_FRIENDS_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
