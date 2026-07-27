import { describe, it, expect } from 'vitest';
import { BRAVE_FEELINGS_META, BRAVE_FEELINGS_SCENARIOS } from '../games/brave-feelings';

describe('brave-feelings', () => {
  it('has scenarios', () => expect(BRAVE_FEELINGS_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(BRAVE_FEELINGS_META.id).toBe('brave-feelings'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of BRAVE_FEELINGS_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
