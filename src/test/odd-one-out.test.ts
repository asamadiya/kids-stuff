import { describe, it, expect } from 'vitest';
import {
  ODD_ROUNDS,
  ODDONEOUT_META,
  getOddOptions,
  getOddFeedback,
  itemLabel,
} from '../games/odd-one-out';

describe('odd-one-out data', () => {
  it('has a non-empty rounds array', () => {
    expect(ODD_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least 10 rounds', () => {
    expect(ODD_ROUNDS.length).toBeGreaterThanOrEqual(10);
  });

  it('exposes a well-formed meta constant', () => {
    expect(ODDONEOUT_META.id).toBe('odd-one-out');
    expect(ODDONEOUT_META.title.length).toBeGreaterThan(0);
    expect(ODDONEOUT_META.tagline.length).toBeGreaterThan(0);
    expect(ODDONEOUT_META.color).toBe('sun');
  });
});

describe('getOddOptions', () => {
  it('includes the odd (correct) answer for every round', () => {
    ODD_ROUNDS.forEach((round, i) => {
      const opts = getOddOptions(round, i);
      expect(opts.some((o) => o.emoji === round.odd.emoji)).toBe(true);
    });
  });

  it('always returns exactly 4 options', () => {
    ODD_ROUNDS.forEach((round, i) => {
      expect(getOddOptions(round, i)).toHaveLength(4);
    });
  });

  it('includes every belonging item plus the odd one', () => {
    ODD_ROUNDS.forEach((round, i) => {
      const opts = getOddOptions(round, i);
      round.belong.forEach((b) => {
        expect(opts.some((o) => o.emoji === b.emoji)).toBe(true);
      });
    });
  });

  it('is deterministic for a given round and index', () => {
    ODD_ROUNDS.forEach((round, i) => {
      const a = getOddOptions(round, i).map((o) => o.emoji).join(',');
      const b = getOddOptions(round, i).map((o) => o.emoji).join(',');
      expect(a).toBe(b);
    });
  });
});

describe('itemLabel', () => {
  it('returns a non-empty capitalized string', () => {
    ODD_ROUNDS.forEach((round) => {
      const label = itemLabel(round.odd);
      expect(label.length).toBeGreaterThan(0);
      expect(label[0]).toBe(label[0].toUpperCase());
    });
  });
});

describe('getOddFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    ODD_ROUNDS.forEach((round) => {
      expect(getOddFeedback(round, round.odd).length).toBeGreaterThan(0);
    });
  });

  it('returns a non-empty string for a belonging (missed) choice', () => {
    ODD_ROUNDS.forEach((round) => {
      expect(getOddFeedback(round, round.belong[0]).length).toBeGreaterThan(0);
    });
  });

  it('never uses discouraging words for any choice', () => {
    const banned = ['wrong', 'no', 'incorrect', 'lose', 'fail'];
    ODD_ROUNDS.forEach((round) => {
      [round.odd, ...round.belong].forEach((sel) => {
        const text = getOddFeedback(round, sel).toLowerCase();
        banned.forEach((word) => {
          expect(new RegExp(`\\b${word}\\b`).test(text)).toBe(false);
        });
      });
    });
  });
});
