import { describe, it, expect } from 'vitest';
import {
  TAKE_AWAY_META,
  TAKE_AWAY_ROUNDS,
  difference,
  getTakeAwayOptions,
  getTakeAwayFeedback,
  labelTakeAway,
} from '../games/take-away';

describe('take-away logic module', () => {
  it('has stable meta', () => {
    expect(TAKE_AWAY_META.id).toBe('take-away');
    expect(TAKE_AWAY_META.title.length).toBeGreaterThan(0);
  });

  it('has a non-empty rounds array', () => {
    expect(TAKE_AWAY_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round is valid subtraction within 10', () => {
    for (const r of TAKE_AWAY_ROUNDS) {
      expect(r.total).toBeGreaterThanOrEqual(0);
      expect(r.total).toBeLessThanOrEqual(10);
      expect(r.takeAway).toBeGreaterThanOrEqual(0);
      expect(r.takeAway).toBeLessThanOrEqual(r.total);
      expect(r.emoji.length).toBeGreaterThan(0);
      expect(r.noun.length).toBeGreaterThan(0);
    }
  });

  it('difference computes correct math for every round', () => {
    for (const r of TAKE_AWAY_ROUNDS) {
      expect(difference(r)).toBe(r.total - r.takeAway);
    }
  });

  it('options always include the correct answer and have a stable length', () => {
    for (let i = 0; i < TAKE_AWAY_ROUNDS.length; i++) {
      const round = TAKE_AWAY_ROUNDS[i];
      const answer = difference(round);
      const opts = getTakeAwayOptions(i);
      expect(opts).toHaveLength(4);
      expect(opts).toContain(answer);
      // unique
      expect(new Set(opts).size).toBe(opts.length);
    }
  });

  it('options are deterministic across calls', () => {
    for (let i = 0; i < TAKE_AWAY_ROUNDS.length; i++) {
      expect(getTakeAwayOptions(i)).toEqual(getTakeAwayOptions(i));
    }
  });

  it('index wraps with modulo', () => {
    const n = TAKE_AWAY_ROUNDS.length;
    expect(getTakeAwayOptions(n)).toEqual(getTakeAwayOptions(0));
  });

  it('feedback is non-empty and warm for both correct and missed choices', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    for (const r of TAKE_AWAY_ROUNDS) {
      const answer = difference(r);
      const correct = getTakeAwayFeedback(r, answer);
      expect(correct.length).toBeGreaterThan(0);
      expect(correct).not.toMatch(banned);

      const wrongPick = answer === 0 ? 1 : 0;
      const missed = getTakeAwayFeedback(r, wrongPick);
      expect(missed.length).toBeGreaterThan(0);
      expect(missed).not.toMatch(banned);
    }
  });

  it('label helper returns a non-empty string', () => {
    expect(labelTakeAway(0).length).toBeGreaterThan(0);
    expect(labelTakeAway(7)).toBe('7');
  });
});
