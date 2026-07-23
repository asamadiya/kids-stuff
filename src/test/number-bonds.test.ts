import { describe, it, expect } from 'vitest';
import {
  NUMBER_BONDS_META,
  BOND_ROUNDS,
  bondAnswer,
  getBondOptions,
  getBondPrompt,
  getBondHint,
  getBondFeedback,
} from '../games/number-bonds';

describe('number-bonds meta', () => {
  it('has the expected identity', () => {
    expect(NUMBER_BONDS_META.id).toBe('number-bonds');
    expect(NUMBER_BONDS_META.title).toBe('Make Ten');
    expect(NUMBER_BONDS_META.icon.length).toBeGreaterThan(0);
    expect(NUMBER_BONDS_META.color).toBe('aqua');
    expect(NUMBER_BONDS_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('BOND_ROUNDS', () => {
  it('is non-empty and has at least 12 rounds', () => {
    expect(BOND_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round is valid math: 0 <= part <= whole and whole is 10 or 20', () => {
    for (const round of BOND_ROUNDS) {
      expect([10, 20]).toContain(round.whole);
      expect(round.part).toBeGreaterThanOrEqual(0);
      expect(round.part).toBeLessThanOrEqual(round.whole);
    }
  });

  it('bondAnswer is the true complement (part + answer === whole)', () => {
    for (const round of BOND_ROUNDS) {
      expect(round.part + bondAnswer(round)).toBe(round.whole);
    }
  });
});

describe('getBondOptions', () => {
  it('has a stable length of 4 for every round', () => {
    for (let i = 0; i < BOND_ROUNDS.length; i += 1) {
      expect(getBondOptions(i)).toHaveLength(4);
    }
  });

  it('includes the correct answer for every round', () => {
    for (let i = 0; i < BOND_ROUNDS.length; i += 1) {
      const answer = bondAnswer(BOND_ROUNDS[i]);
      expect(getBondOptions(i)).toContain(answer);
    }
  });

  it('returns distinct, non-negative, in-range options', () => {
    for (let i = 0; i < BOND_ROUNDS.length; i += 1) {
      const round = BOND_ROUNDS[i];
      const opts = getBondOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
      for (const o of opts) {
        expect(o).toBeGreaterThanOrEqual(0);
        expect(o).toBeLessThanOrEqual(round.whole);
      }
    }
  });

  it('is deterministic across calls', () => {
    for (let i = 0; i < BOND_ROUNDS.length; i += 1) {
      expect(getBondOptions(i)).toEqual(getBondOptions(i));
    }
  });

  it('wraps by modulo so the game can loop (same options, any order)', () => {
    expect([...getBondOptions(BOND_ROUNDS.length)].sort()).toEqual(
      [...getBondOptions(0)].sort(),
    );
  });
});

describe('text helpers', () => {
  it('getBondPrompt returns a non-empty string naming both numbers', () => {
    for (const round of BOND_ROUNDS) {
      const prompt = getBondPrompt(round);
      expect(prompt.length).toBeGreaterThan(0);
      expect(prompt).toContain(String(round.part));
      expect(prompt).toContain(String(round.whole));
    }
  });

  it('getBondHint returns a non-empty string', () => {
    for (const round of BOND_ROUNDS) {
      expect(getBondHint(round).length).toBeGreaterThan(0);
    }
  });

  it('getBondFeedback returns a warm, non-empty string for correct and missed picks', () => {
    for (const round of BOND_ROUNDS) {
      const answer = bondAnswer(round);
      const correct = getBondFeedback(round, answer);
      const missed = getBondFeedback(round, (answer + 1) % (round.whole + 1));
      expect(correct.length).toBeGreaterThan(0);
      expect(missed.length).toBeGreaterThan(0);
      for (const msg of [correct, missed]) {
        expect(msg.toLowerCase()).not.toMatch(/wrong|incorrect|\bno\b|fail|lose/);
      }
    }
  });
});
