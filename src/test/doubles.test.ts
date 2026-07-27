import { describe, it, expect } from 'vitest';
import {
  DOUBLES_META,
  DOUBLE_ROUNDS,
  getDoubleOptions,
  getDoublePrompt,
  getDoubleFeedback,
} from '../games/doubles';

describe('doubles logic module', () => {
  it('has non-empty rounds', () => {
    expect(DOUBLE_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round answer is real doubling math', () => {
    for (const round of DOUBLE_ROUNDS) {
      expect(round.answer).toBe(round.n + round.n);
      expect(round.answer).toBe(round.n * 2);
      expect(round.n).toBeGreaterThanOrEqual(1);
      expect(round.n).toBeLessThanOrEqual(10);
    }
  });

  it('options always include the correct answer with stable length', () => {
    for (let i = 0; i < DOUBLE_ROUNDS.length; i += 1) {
      const round = DOUBLE_ROUNDS[i];
      const opts = getDoubleOptions(i);
      expect(opts).toHaveLength(4);
      expect(opts).toContain(round.answer);
    }
  });

  it('options are distinct positive integers', () => {
    for (let i = 0; i < DOUBLE_ROUNDS.length; i += 1) {
      const opts = getDoubleOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
      for (const o of opts) {
        expect(o).toBeGreaterThan(0);
        expect(Number.isInteger(o)).toBe(true);
      }
    }
  });

  it('option generation is deterministic', () => {
    for (let i = 0; i < DOUBLE_ROUNDS.length; i += 1) {
      expect(getDoubleOptions(i)).toEqual(getDoubleOptions(i));
    }
  });

  it('options wrap with modulo beyond round count', () => {
    const wrapped = getDoubleOptions(DOUBLE_ROUNDS.length);
    expect(wrapped).toEqual(getDoubleOptions(0));
  });

  it('prompt helper returns a non-empty string naming the number', () => {
    for (const round of DOUBLE_ROUNDS) {
      const p = getDoublePrompt(round);
      expect(p.length).toBeGreaterThan(0);
      expect(p).toContain(String(round.n));
    }
  });

  it('feedback is warm and non-empty for correct and missed choices', () => {
    for (const round of DOUBLE_ROUNDS) {
      const good = getDoubleFeedback(round, round.answer);
      const miss = getDoubleFeedback(round, round.answer + 2);
      expect(good.length).toBeGreaterThan(0);
      expect(miss.length).toBeGreaterThan(0);
      const forbidden = /wrong|incorrect|\bno\b|lose|fail/i;
      expect(forbidden.test(good)).toBe(false);
      expect(forbidden.test(miss)).toBe(false);
    }
  });

  it('meta is well formed', () => {
    expect(DOUBLES_META.id).toBe('doubles');
    expect(DOUBLES_META.title.length).toBeGreaterThan(0);
    expect(DOUBLES_META.tagline.length).toBeGreaterThan(0);
    expect(DOUBLES_META.color).toBe('grape');
  });
});
