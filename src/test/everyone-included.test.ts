import { describe, it, expect } from 'vitest';
import { EVERYONE_INCLUDED_META, EVERYONE_INCLUDED_SCENARIOS } from '../games/everyone-included';

describe('everyone-included', () => {
  it('has scenarios', () => expect(EVERYONE_INCLUDED_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(EVERYONE_INCLUDED_META.id).toBe('everyone-included'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of EVERYONE_INCLUDED_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
