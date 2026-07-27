import { describe, it, expect } from 'vitest';
import {
  GROUPS_OF_META,
  GROUPS_ROUNDS,
  getGroupsOptions,
  getGroupsFeedback,
  getGroupsHint,
  productOf,
  questionOf,
} from '../games/groups-of';

describe('groups-of meta', () => {
  it('has expected identity', () => {
    expect(GROUPS_OF_META.id).toBe('groups-of');
    expect(GROUPS_OF_META.title.length).toBeGreaterThan(0);
    expect(GROUPS_OF_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('groups-of rounds', () => {
  it('is non-empty and has at least 12 rounds', () => {
    expect(GROUPS_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps every product <= 30 with positive factors', () => {
    for (const r of GROUPS_ROUNDS) {
      expect(r.groups).toBeGreaterThan(0);
      expect(r.per).toBeGreaterThan(0);
      expect(productOf(r)).toBeLessThanOrEqual(30);
      // product equals real multiplication of the two factors
      expect(productOf(r)).toBe(r.groups * r.per);
    }
  });

  it('questions and hints are non-empty strings', () => {
    for (const r of GROUPS_ROUNDS) {
      expect(questionOf(r).length).toBeGreaterThan(0);
      expect(getGroupsHint(r).length).toBeGreaterThan(0);
    }
  });
});

describe('groups-of options', () => {
  it('every round: options include the correct product', () => {
    GROUPS_ROUNDS.forEach((r, i) => {
      const opts = getGroupsOptions(i);
      expect(opts).toContain(productOf(r));
    });
  });

  it('option lists have a stable length of 4 with distinct positive values', () => {
    GROUPS_ROUNDS.forEach((_, i) => {
      const opts = getGroupsOptions(i);
      expect(opts).toHaveLength(4);
      expect(new Set(opts).size).toBe(4);
      for (const o of opts) expect(o).toBeGreaterThan(0);
    });
  });

  it('is deterministic and modulo-safe', () => {
    const a = getGroupsOptions(0);
    const b = getGroupsOptions(GROUPS_ROUNDS.length);
    expect(a).toEqual(b);
  });
});

describe('groups-of feedback', () => {
  it('returns a non-empty string for correct and missed choices', () => {
    GROUPS_ROUNDS.forEach((r, i) => {
      const answer = productOf(r);
      const other = getGroupsOptions(i).find((o) => o !== answer)!;
      expect(getGroupsFeedback(r, answer).length).toBeGreaterThan(0);
      expect(getGroupsFeedback(r, other).length).toBeGreaterThan(0);
    });
  });

  it('never uses discouraging words', () => {
    const banned = /(wrong|incorrect|\bno\b|lose|fail)/i;
    GROUPS_ROUNDS.forEach((r, i) => {
      for (const o of getGroupsOptions(i)) {
        expect(getGroupsFeedback(r, o)).not.toMatch(banned);
      }
    });
  });
});
