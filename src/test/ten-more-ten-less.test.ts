import { describe, it, expect } from 'vitest';
import {
  TEN_ROUNDS,
  TEN_MORE_TEN_LESS_META,
  getTenOptions,
  getTenFeedback,
  tenAnswer,
  tenPrompt,
  tenHint,
} from '../games/ten-more-ten-less';

describe('ten-more-ten-less pure module', () => {
  it('has metadata with the expected id', () => {
    expect(TEN_MORE_TEN_LESS_META.id).toBe('ten-more-ten-less');
  });

  it('has a non-empty rounds array', () => {
    expect(TEN_ROUNDS.length).toBeGreaterThan(0);
    expect(TEN_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('computes correct +10 / -10 math for every round', () => {
    for (const round of TEN_ROUNDS) {
      const expected = round.direction === 'more' ? round.start + 10 : round.start - 10;
      expect(tenAnswer(round)).toBe(expected);
    }
  });

  it('keeps every answer a valid two-digit number', () => {
    for (const round of TEN_ROUNDS) {
      const a = tenAnswer(round);
      expect(a).toBeGreaterThanOrEqual(10);
      expect(a).toBeLessThanOrEqual(99);
    }
  });

  it('options always include the correct answer', () => {
    for (let i = 0; i < TEN_ROUNDS.length; i += 1) {
      const round = TEN_ROUNDS[i];
      const opts = getTenOptions(i);
      expect(opts).toContain(tenAnswer(round));
    }
  });

  it('options have a stable length of 4 with no duplicates', () => {
    for (let i = 0; i < TEN_ROUNDS.length + 5; i += 1) {
      const opts = getTenOptions(i);
      expect(opts).toHaveLength(4);
      expect(new Set(opts).size).toBe(4);
    }
  });

  it('getTenOptions is deterministic', () => {
    for (let i = 0; i < TEN_ROUNDS.length; i += 1) {
      expect(getTenOptions(i)).toEqual(getTenOptions(i));
    }
  });

  it('prompt helper returns a non-empty string mentioning the number', () => {
    for (const round of TEN_ROUNDS) {
      const p = tenPrompt(round);
      expect(p.length).toBeGreaterThan(0);
      expect(p).toContain(String(round.start));
    }
  });

  it('hint helper returns a non-empty string', () => {
    for (const round of TEN_ROUNDS) {
      expect(tenHint(round).length).toBeGreaterThan(0);
    }
  });

  it('feedback is non-empty, never negative, and states the answer for any choice', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    for (const round of TEN_ROUNDS) {
      const answer = tenAnswer(round);
      for (const sel of [answer, answer + 10, round.start]) {
        const fb = getTenFeedback(round, sel);
        expect(fb.length).toBeGreaterThan(0);
        expect(fb).not.toMatch(banned);
        expect(fb).toContain(String(answer));
      }
    }
  });
});
