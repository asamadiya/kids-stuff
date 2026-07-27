import { describe, it, expect } from 'vitest';
import {
  WHATS_MISSING_META,
  MISSING_ROUNDS,
  getMissingOptions,
  getMissingFeedback,
  equationParts,
} from '../games/whats-missing';

describe('whats-missing pure module', () => {
  it('has meta with expected id', () => {
    expect(WHATS_MISSING_META.id).toBe('whats-missing');
  });

  it('has a non-empty rounds array', () => {
    expect(MISSING_ROUNDS.length).toBeGreaterThan(0);
    expect(MISSING_ROUNDS.length).toBeGreaterThanOrEqual(14);
  });

  it('every round has exactly one blank slot and correct math', () => {
    for (const r of MISSING_ROUNDS) {
      const nulls = [r.a, r.b, r.total].filter((v) => v === null).length;
      expect(nulls).toBe(1);

      // reconstruct full equation with the answer filled in and verify.
      const a = r.blank === 'a' ? r.answer : (r.a as number);
      const b = r.blank === 'b' ? r.answer : (r.b as number);
      const total = r.blank === 'total' ? r.answer : (r.total as number);
      if (r.op === '+') {
        expect(a + b).toBe(total);
      } else {
        expect(a - b).toBe(total);
      }
      // within 20 and non-negative
      expect(r.answer).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(20);
      expect(b).toBeLessThanOrEqual(20);
      expect(total).toBeLessThanOrEqual(20);
    }
  });

  it('options always include the answer with a stable length', () => {
    const lengths = new Set<number>();
    for (let i = 0; i < MISSING_ROUNDS.length; i++) {
      const round = MISSING_ROUNDS[i];
      const opts = getMissingOptions(i);
      lengths.add(opts.length);
      expect(opts).toContain(round.answer);
      // no duplicate options
      expect(new Set(opts).size).toBe(opts.length);
      // 3-4 options
      expect(opts.length).toBeGreaterThanOrEqual(3);
      expect(opts.length).toBeLessThanOrEqual(4);
    }
    expect(lengths.size).toBe(1);
  });

  it('feedback helper returns a non-empty string for correct and incorrect picks', () => {
    for (let i = 0; i < MISSING_ROUNDS.length; i++) {
      const round = MISSING_ROUNDS[i];
      const correct = getMissingFeedback(round, round.answer);
      const missed = getMissingFeedback(round, round.answer + 1);
      expect(correct.length).toBeGreaterThan(0);
      expect(missed.length).toBeGreaterThan(0);
      // never use discouraging words
      for (const msg of [correct, missed]) {
        expect(msg.toLowerCase()).not.toMatch(/wrong|incorrect|\bno\b|lose|fail/);
      }
    }
  });

  it('equationParts marks exactly one blank cell', () => {
    for (const r of MISSING_ROUNDS) {
      const parts = equationParts(r, '?');
      const cells = [parts.left, parts.right, parts.total];
      expect(cells.filter((c) => c === '?').length).toBe(1);
    }
  });
});
