import { describe, it, expect } from 'vitest';
import { SAYING_SORRY_META, SAYING_SORRY_SCENARIOS } from '../games/saying-sorry';

describe('saying-sorry', () => {
  it('has scenarios', () => expect(SAYING_SORRY_SCENARIOS.length).toBeGreaterThan(0));
  it('meta id matches', () => expect(SAYING_SORRY_META.id).toBe('saying-sorry'));
  it('each scenario has the answer among 3+ options and warm feedback', () => {
    for (const s of SAYING_SORRY_SCENARIOS) {
      expect(s.options.some((o) => o.id === s.answerId)).toBe(true);
      expect(s.options.length).toBeGreaterThanOrEqual(3);
      expect(s.feedbackCorrect.length).toBeGreaterThan(0);
    }
  });
});
