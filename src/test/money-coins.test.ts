import { describe, it, expect } from 'vitest';
import {
  MONEY_COINS_META,
  MONEY_ROUNDS,
  MONEY_OPTION_COUNT,
  COIN_VALUE,
  getMoneyOptions,
  getMoneyFeedback,
  roundTotal,
  roundExpression,
  roundBreakdown,
  centsLabel,
} from '../games/money-coins';

describe('money-coins meta', () => {
  it('has expected identity', () => {
    expect(MONEY_COINS_META.id).toBe('money-coins');
    expect(MONEY_COINS_META.title).toBe('Coin Counter');
    expect(MONEY_COINS_META.color).toBe('aqua');
    expect(MONEY_COINS_META.icon.length).toBeGreaterThan(0);
    expect(MONEY_COINS_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('money-coins rounds', () => {
  it('has at least 12 rounds', () => {
    expect(MONEY_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps every total between 1c and 50c', () => {
    for (const round of MONEY_ROUNDS) {
      const total = roundTotal(round);
      expect(total).toBeGreaterThan(0);
      expect(total).toBeLessThanOrEqual(50);
    }
  });

  it('computes totals correctly from coin values', () => {
    for (const round of MONEY_ROUNDS) {
      let expected = 0;
      for (const c of round.coins) {
        expect(c.count).toBeGreaterThan(0);
        expected += COIN_VALUE[c.kind] * c.count;
      }
      expect(roundTotal(round)).toBe(expected);
    }
  });

  it('expression string sums to the total', () => {
    for (const round of MONEY_ROUNDS) {
      const expr = roundExpression(round);
      const sum = expr
        .split(' + ')
        .map((part) => Number(part.replace('c', '')))
        .reduce((a, b) => a + b, 0);
      expect(sum).toBe(roundTotal(round));
    }
  });
});

describe('money-coins options', () => {
  it('returns a stable-length list including the correct answer for every round', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const opts = getMoneyOptions(i);
      expect(opts.length).toBe(MONEY_OPTION_COUNT);
      expect(opts).toContain(roundTotal(MONEY_ROUNDS[i]));
    }
  });

  it('has no duplicate options', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const opts = getMoneyOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    }
  });

  it('is deterministic across calls', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      expect(getMoneyOptions(i)).toEqual(getMoneyOptions(i));
    }
  });

  it('wraps by modulo index', () => {
    const len = MONEY_ROUNDS.length;
    expect(getMoneyOptions(len)).toEqual(getMoneyOptions(0));
    expect(getMoneyOptions(len + 3)).toEqual(getMoneyOptions(3));
  });
});

describe('money-coins feedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const answer = roundTotal(MONEY_ROUNDS[i]);
      const fb = getMoneyFeedback(i, answer);
      expect(fb.length).toBeGreaterThan(0);
      expect(fb).toContain(`${answer}c`);
    }
  });

  it('returns a warm non-empty string for a missed choice with no failure words', () => {
    const banned = /(wrong|incorrect|\bno\b|lose|fail)/i;
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const answer = roundTotal(MONEY_ROUNDS[i]);
      const fb = getMoneyFeedback(i, answer + 1);
      expect(fb.length).toBeGreaterThan(0);
      expect(banned.test(fb)).toBe(false);
    }
  });
});

describe('money-coins helpers', () => {
  it('centsLabel formats values', () => {
    expect(centsLabel(16)).toBe('16c');
    expect(centsLabel(50)).toBe('50c');
  });

  it('roundBreakdown returns a non-empty string per round', () => {
    for (const round of MONEY_ROUNDS) {
      expect(roundBreakdown(round).length).toBeGreaterThan(0);
    }
  });
});
