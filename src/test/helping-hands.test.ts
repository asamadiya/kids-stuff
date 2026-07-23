import { describe, it, expect } from 'vitest';
import { HELPING_HANDS_META, HELPING_HANDS_SCENARIOS } from '../games/helping-hands';

describe('helping-hands', () => {
  it('has scenarios', () => expect(HELPING_HANDS_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(HELPING_HANDS_META.id).toBe('helping-hands'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of HELPING_HANDS_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
