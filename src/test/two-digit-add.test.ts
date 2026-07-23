import { describe, it, expect } from 'vitest';
import {
  TWO_DIGIT_ADD_META,
  TWO_DIGIT_ADD_ROUNDS,
  getAddOptions,
  getAddPrompt,
  getAddHint,
  getAddFeedback,
} from '../games/two-digit-add';

describe('two-digit-add logic module', () => {
  it('has non-empty rounds and >= 12 of them', () => {
    expect(TWO_DIGIT_ADD_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('exposes well-formed META', () => {
    expect(TWO_DIGIT_ADD_META.id).toBe('two-digit-add');
    expect(TWO_DIGIT_ADD_META.title.length).toBeGreaterThan(0);
    expect(TWO_DIGIT_ADD_META.tagline.length).toBeGreaterThan(0);
  });

  it('every round: answer is real math and both addends are two-digit', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect(r.answer).toBe(r.a + r.b);
      expect(r.a).toBeGreaterThanOrEqual(10);
      expect(r.a).toBeLessThan(100);
      expect(r.b).toBeGreaterThanOrEqual(10);
      expect(r.b).toBeLessThan(100);
    }
  });

  it('every round is no-regroup: each column sum < 10', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect((r.a % 10) + (r.b % 10)).toBeLessThan(10);
      expect(Math.floor(r.a / 10) + Math.floor(r.b / 10)).toBeLessThan(10);
    }
  });

  it('every round: options include the correct answer', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect(r.options).toContain(r.answer);
    }
  });

  it('option lists have a stable length (3) across all rounds', () => {
    const lengths = new Set(TWO_DIGIT_ADD_ROUNDS.map((r) => r.options.length));
    expect(lengths.size).toBe(1);
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect(r.options.length).toBeGreaterThanOrEqual(3);
      expect(r.options.length).toBeLessThanOrEqual(4);
    }
  });

  it('every round: options are unique', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect(new Set(r.options).size).toBe(r.options.length);
    }
  });

  it('getAddOptions is modulo-safe and includes the answer', () => {
    for (let i = 0; i < TWO_DIGIT_ADD_ROUNDS.length * 2 + 3; i++) {
      const r = TWO_DIGIT_ADD_ROUNDS[i % TWO_DIGIT_ADD_ROUNDS.length];
      expect(getAddOptions(i)).toContain(r.answer);
    }
  });

  it('prompt and hint helpers return non-empty strings', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect(getAddPrompt(r).length).toBeGreaterThan(0);
      expect(getAddHint(r).length).toBeGreaterThan(0);
    }
  });

  it('feedback is non-empty for every option and stays warm', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      for (const o of r.options) {
        const fb = getAddFeedback(r, o);
        expect(fb.length).toBeGreaterThan(0);
        expect(fb).not.toMatch(banned);
      }
    }
  });

  it('correct-answer feedback affirms the sum', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS) {
      expect(getAddFeedback(r, r.answer)).toContain(String(r.answer));
    }
  });
});
