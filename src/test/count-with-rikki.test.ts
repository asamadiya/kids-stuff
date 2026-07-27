import { describe, it, expect } from 'vitest';
import {
  COUNT_ROUNDS,
  COUNT_WITH_RIKKI_META,
  countLabel,
  getCountFeedback,
  getCountOptions,
} from '../games/count-with-rikki';

describe('count-with-rikki data', () => {
  it('has a non-empty rounds array', () => {
    expect(COUNT_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has valid counts between 1 and 10', () => {
    for (const round of COUNT_ROUNDS) {
      expect(round.count).toBeGreaterThanOrEqual(1);
      expect(round.count).toBeLessThanOrEqual(10);
    }
  });

  it('exposes meta with the expected id', () => {
    expect(COUNT_WITH_RIKKI_META.id).toBe('count-with-rikki');
  });
});

describe('getCountOptions', () => {
  it('always includes the correct answer', () => {
    COUNT_ROUNDS.forEach((round, i) => {
      expect(getCountOptions(i)).toContain(round.count);
    });
  });

  it('returns a stable option length', () => {
    const lengths = COUNT_ROUNDS.map((_, i) => getCountOptions(i).length);
    expect(new Set(lengths).size).toBe(1);
    expect(lengths[0]).toBe(4);
  });

  it('returns unique options within 1..10', () => {
    COUNT_ROUNDS.forEach((_, i) => {
      const opts = getCountOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
      for (const o of opts) {
        expect(o).toBeGreaterThanOrEqual(1);
        expect(o).toBeLessThanOrEqual(10);
      }
    });
  });
});

describe('label and feedback helpers', () => {
  it('countLabel returns a non-empty string', () => {
    for (let n = 1; n <= 10; n += 1) {
      expect(countLabel(n).length).toBeGreaterThan(0);
    }
  });

  it('getCountFeedback returns a non-empty string for correct and incorrect picks', () => {
    for (const round of COUNT_ROUNDS) {
      const correct = getCountFeedback(round, round.count);
      const miss = getCountFeedback(round, round.count === 1 ? 2 : 1);
      expect(correct.length).toBeGreaterThan(0);
      expect(miss.length).toBeGreaterThan(0);
    }
  });
});
