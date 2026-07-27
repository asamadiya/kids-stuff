import { describe, it, expect } from 'vitest';
import {
  GROUP_ROUNDS,
  GROUP_OPTION_COUNT,
  getGroupOptions,
  getGroupFeedback,
  groupAnswer,
  groupOptionLabel,
  HOW_MANY_GROUPS_META,
} from '../games/how-many-groups';

describe('how-many-groups logic', () => {
  it('has a non-empty rounds array with >= 12 rounds', () => {
    expect(GROUP_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('exposes coherent meta', () => {
    expect(HOW_MANY_GROUPS_META.id).toBe('how-many-groups');
    expect(HOW_MANY_GROUPS_META.title.length).toBeGreaterThan(0);
    expect(HOW_MANY_GROUPS_META.icon.length).toBeGreaterThan(0);
    expect(HOW_MANY_GROUPS_META.tagline.length).toBeGreaterThan(0);
  });

  it('every round divides exactly (no remainder) and answer is correct math', () => {
    for (const round of GROUP_ROUNDS) {
      expect(round.total % round.per).toBe(0);
      expect(groupAnswer(round)).toBe(round.total / round.per);
      // grouping identity: per * groups === total
      expect(round.per * groupAnswer(round)).toBe(round.total);
      expect(groupAnswer(round)).toBeGreaterThan(0);
    }
  });

  it('options always include the correct answer', () => {
    GROUP_ROUNDS.forEach((round, i) => {
      const opts = getGroupOptions(i);
      expect(opts).toContain(groupAnswer(round));
    });
  });

  it('option lists have a stable length', () => {
    GROUP_ROUNDS.forEach((_, i) => {
      expect(getGroupOptions(i)).toHaveLength(GROUP_OPTION_COUNT);
    });
  });

  it('options are positive, distinct integers', () => {
    GROUP_ROUNDS.forEach((_, i) => {
      const opts = getGroupOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
      for (const o of opts) {
        expect(Number.isInteger(o)).toBe(true);
        expect(o).toBeGreaterThan(0);
      }
    });
  });

  it('getGroupOptions is deterministic and wraps by modulo', () => {
    GROUP_ROUNDS.forEach((_, i) => {
      expect(getGroupOptions(i)).toEqual(getGroupOptions(i));
      expect(getGroupOptions(i)).toEqual(getGroupOptions(i + GROUP_ROUNDS.length));
    });
  });

  it('feedback returns a non-empty string for correct and incorrect picks', () => {
    GROUP_ROUNDS.forEach((round, i) => {
      const answer = groupAnswer(round);
      const opts = getGroupOptions(i);
      const wrong = opts.find((o) => o !== answer) ?? answer + 1;
      expect(getGroupFeedback(round, answer).length).toBeGreaterThan(0);
      expect(getGroupFeedback(round, wrong).length).toBeGreaterThan(0);
    });
  });

  it('feedback never uses discouraging words', () => {
    const banned = /\b(wrong|incorrect|no|lose|fail)\b/i;
    GROUP_ROUNDS.forEach((round, i) => {
      for (const o of getGroupOptions(i)) {
        expect(banned.test(getGroupFeedback(round, o))).toBe(false);
      }
    });
  });

  it('option label returns a non-empty string', () => {
    expect(groupOptionLabel(6).length).toBeGreaterThan(0);
    expect(groupOptionLabel(1)).toBe('1');
  });
});
