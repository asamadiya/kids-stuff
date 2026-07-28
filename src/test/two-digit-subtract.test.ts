import { describe, it, expect } from 'vitest';
import {
  TWO_DIGIT_SUBTRACT_META,
  SUBTRACT_ROUNDS,
  SUBTRACT_OPTION_COUNT,
  getSubtractOptions,
  getSubtractFeedback,
} from '../games/two-digit-subtract';

describe('two-digit-subtract logic', () => {
  it('has non-empty rounds and at least 12 of them', () => {
    expect(SUBTRACT_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('meta is well formed', () => {
    expect(TWO_DIGIT_SUBTRACT_META.id).toBe('two-digit-subtract');
    expect(TWO_DIGIT_SUBTRACT_META.title.length).toBeGreaterThan(0);
    expect(TWO_DIGIT_SUBTRACT_META.icon.length).toBeGreaterThan(0);
    expect(TWO_DIGIT_SUBTRACT_META.color).toBe('grape');
    expect(TWO_DIGIT_SUBTRACT_META.tagline.length).toBeGreaterThan(0);
  });

  it('includes rounds that borrow, which is the step that makes the algorithm mean something', () => {
    // Every round used to require top digit >= bottom digit in both columns, so
    // the child never once had to take a ten apart.
    const borrowing = SUBTRACT_ROUNDS.filter((r) => r.borrows);
    expect(borrowing.length).toBeGreaterThanOrEqual(6);
    for (const r of borrowing) expect(r.top % 10).toBeLessThan(r.bottom % 10);
    for (const r of SUBTRACT_ROUNDS) {
      expect(r.answer).toBe(r.top - r.bottom);
      expect(r.answer).toBeGreaterThanOrEqual(0);
      expect(r.top).toBeLessThanOrEqual(99);
    }
  });

  it('options always include the correct answer and have a stable length', () => {
    for (let i = 0; i < SUBTRACT_ROUNDS.length; i++) {
      const opts = getSubtractOptions(i);
      const answer = SUBTRACT_ROUNDS[i].answer;
      expect(opts).toHaveLength(SUBTRACT_OPTION_COUNT);
      expect(opts).toContain(answer);
      // All distinct.
      expect(new Set(opts).size).toBe(opts.length);
      // All non-negative.
      for (const o of opts) expect(o).toBeGreaterThanOrEqual(0);
    }
  });

  it('getSubtractOptions is deterministic and loops with modulo', () => {
    for (let i = 0; i < SUBTRACT_ROUNDS.length; i++) {
      expect(getSubtractOptions(i)).toEqual(getSubtractOptions(i));
      expect(getSubtractOptions(i)).toEqual(getSubtractOptions(i + SUBTRACT_ROUNDS.length));
    }
  });

  it('feedback returns a non-empty warm string for correct and missed picks', () => {
    const forbidden = /\b(wrong|incorrect|fail|lose)\b|\bno\b/i;
    for (let i = 0; i < SUBTRACT_ROUNDS.length; i++) {
      const r = SUBTRACT_ROUNDS[i];
      const opts = getSubtractOptions(i);
      const miss = opts.find((o) => o !== r.answer) ?? r.answer;
      const correctMsg = getSubtractFeedback(r, r.answer);
      const missMsg = getSubtractFeedback(r, miss);
      expect(correctMsg.length).toBeGreaterThan(0);
      expect(missMsg.length).toBeGreaterThan(0);
      expect(correctMsg).not.toMatch(forbidden);
      expect(missMsg).not.toMatch(forbidden);
      // Feedback states the true answer.
      expect(missMsg).toContain(String(r.answer));
    }
  });
});
