import { describe, it, expect } from 'vitest';
import {
  SHARE_FAIRLY_META,
  SHARE_ROUNDS,
  getShareOptions,
  getShareFeedback,
  getShareHint,
  shareAnswer,
} from '../games/share-fairly';

describe('share-fairly logic module', () => {
  it('exposes stable meta', () => {
    expect(SHARE_FAIRLY_META.id).toBe('share-fairly');
    expect(SHARE_FAIRLY_META.color).toBe('coral');
    expect(SHARE_FAIRLY_META.title.length).toBeGreaterThan(0);
  });

  it('has a non-empty rounds array with >= 12 rounds', () => {
    expect(SHARE_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round divides exactly and the answer is correct math', () => {
    for (const round of SHARE_ROUNDS) {
      expect(round.total % round.plates).toBe(0);
      const a = shareAnswer(round);
      // Recompute independently: plates groups of the quotient must rebuild the total.
      expect(a * round.plates).toBe(round.total);
      expect(a).toBeGreaterThanOrEqual(1);
      expect(Number.isInteger(a)).toBe(true);
    }
  });

  it('option lists have a stable length and include the correct answer', () => {
    const lengths = new Set<number>();
    for (let i = 0; i < SHARE_ROUNDS.length; i++) {
      const round = SHARE_ROUNDS[i];
      const opts = getShareOptions(i);
      lengths.add(opts.length);
      expect(opts).toContain(shareAnswer(round));
      // No duplicate options.
      expect(new Set(opts).size).toBe(opts.length);
      // All options are valid share counts (>= 1 integers).
      for (const o of opts) {
        expect(Number.isInteger(o)).toBe(true);
        expect(o).toBeGreaterThanOrEqual(1);
      }
    }
    expect(lengths.size).toBe(1);
  });

  it('options are deterministic across calls', () => {
    for (let i = 0; i < SHARE_ROUNDS.length; i++) {
      expect(getShareOptions(i)).toEqual(getShareOptions(i));
    }
  });

  it('feedback helper returns a non-empty string for correct and missed picks', () => {
    for (let i = 0; i < SHARE_ROUNDS.length; i++) {
      const round = SHARE_ROUNDS[i];
      const answer = shareAnswer(round);
      const correct = getShareFeedback(round, answer);
      const missed = getShareFeedback(round, answer + 1);
      expect(correct.length).toBeGreaterThan(0);
      expect(missed.length).toBeGreaterThan(0);
      // No discouraging language.
      for (const msg of [correct, missed]) {
        expect(msg.toLowerCase()).not.toMatch(/wrong|incorrect|\bno\b|lose|fail/);
      }
    }
  });

  it('hint helper returns a non-empty string', () => {
    for (const round of SHARE_ROUNDS) {
      expect(getShareHint(round).length).toBeGreaterThan(0);
    }
  });
});
