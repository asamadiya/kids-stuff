import { describe, it, expect } from 'vitest';
import { KIND_FRIEND_META, KIND_FRIEND_SCENARIOS } from '../games/kind-friend';

describe('kind-friend', () => {
  it('has scenarios', () => expect(KIND_FRIEND_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(KIND_FRIEND_META.id).toBe('kind-friend'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of KIND_FRIEND_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
