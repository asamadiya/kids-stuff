import { describe, it, expect } from 'vitest';
import {
  SKIP_COUNT_META,
  SKIP_COUNT_ROUNDS,
  getSkipCountOptions,
  getSkipCountSequenceLabel,
  getSkipCountFeedback,
} from '../games/skip-count';

describe('skip-count logic module', () => {
  it('has well-formed meta', () => {
    expect(SKIP_COUNT_META.id).toBe('skip-count');
    expect(SKIP_COUNT_META.title.length).toBeGreaterThan(0);
    expect(SKIP_COUNT_META.tagline.length).toBeGreaterThan(0);
  });

  it('has a non-empty rounds array with at least 12 rounds', () => {
    expect(SKIP_COUNT_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round steps by 2 or 5', () => {
    for (const round of SKIP_COUNT_ROUNDS) {
      expect([2, 5]).toContain(round.step);
    }
  });

  it('mixes both 2s and 5s', () => {
    const steps = new Set(SKIP_COUNT_ROUNDS.map((r) => r.step));
    expect(steps.has(2)).toBe(true);
    expect(steps.has(5)).toBe(true);
  });

  it('every round shown-sequence is a valid arithmetic run and answer is correct math', () => {
    for (const round of SKIP_COUNT_ROUNDS) {
      expect(round.shown.length).toBeGreaterThanOrEqual(3);
      // each shown term differs from the previous by exactly `step`
      for (let i = 1; i < round.shown.length; i += 1) {
        expect(round.shown[i] - round.shown[i - 1]).toBe(round.step);
      }
      // the answer is the next term after the shown run
      const last = round.shown[round.shown.length - 1];
      expect(round.answer).toBe(last + round.step);
    }
  });

  it('options always include the correct answer', () => {
    SKIP_COUNT_ROUNDS.forEach((round, i) => {
      const opts = getSkipCountOptions(i);
      expect(opts).toContain(round.answer);
    });
  });

  it('option lists have a stable length of 4 and are sorted', () => {
    for (let i = 0; i < SKIP_COUNT_ROUNDS.length; i += 1) {
      const opts = getSkipCountOptions(i);
      expect(opts).toHaveLength(4);
      const sorted = [...opts].sort((a, b) => a - b);
      expect(opts).toEqual(sorted);
    }
  });

  it('options have no duplicates (answer distinct from distractors)', () => {
    for (let i = 0; i < SKIP_COUNT_ROUNDS.length; i += 1) {
      const opts = getSkipCountOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    }
  });

  it('getSkipCountOptions wraps with modulo', () => {
    const base = getSkipCountOptions(0);
    const wrapped = getSkipCountOptions(SKIP_COUNT_ROUNDS.length);
    expect(wrapped).toEqual(base);
  });

  it('sequence label ends with a question placeholder', () => {
    for (const round of SKIP_COUNT_ROUNDS) {
      const label = getSkipCountSequenceLabel(round);
      expect(label.length).toBeGreaterThan(0);
      expect(label.endsWith(', ?')).toBe(true);
      expect(label.startsWith(String(round.shown[0]))).toBe(true);
    }
  });

  it('feedback is non-empty and warm (never negative) for any choice', () => {
    const banned = ['wrong', 'incorrect', 'fail', 'lose', ' no '];
    for (const round of SKIP_COUNT_ROUNDS) {
      for (const opt of getSkipCountOptions(SKIP_COUNT_ROUNDS.indexOf(round))) {
        const fb = getSkipCountFeedback(round, opt).toLowerCase();
        expect(fb.length).toBeGreaterThan(0);
        for (const bad of banned) {
          expect(fb.includes(bad)).toBe(false);
        }
      }
    }
  });

  it('correct-choice feedback confirms the arithmetic', () => {
    for (const round of SKIP_COUNT_ROUNDS) {
      const fb = getSkipCountFeedback(round, round.answer);
      expect(fb).toContain(String(round.answer));
      expect(fb).toContain(String(round.step));
    }
  });
});
