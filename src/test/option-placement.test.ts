import { describe, expect, it } from 'vitest';
import { placeOptions } from '../games/options';
import { getTimesOptions, TIMES_ROUNDS, timesProduct } from '../games/times-tables';
import { getCountByTensOptions, COUNT_BY_TENS_ROUNDS } from '../games/count-by-tens';
import { getGroupsOptions, GROUPS_ROUNDS, productOf } from '../games/groups-of';
import { getGroupOptions, GROUP_ROUNDS, groupAnswer } from '../games/how-many-groups';
import { getMoneyOptions, MONEY_ROUNDS, roundTotal } from '../games/money-coins';
import { getSubtractOptions, SUBTRACT_ROUNDS } from '../games/two-digit-subtract';
import { getAddOptions, TWO_DIGIT_ADD_ROUNDS } from '../games/two-digit-add';

/**
 * Seven exercises put the correct button at the same index in every single
 * round — 99 rounds between them. Six built distractors as `answer ± k` and
 * then sorted, which pins a symmetric set forever; the seventh used hand-typed
 * ascending arrays and no sort at all, so removing sorts alone would not have
 * fixed it. A child can win any of them by learning a slot.
 */

interface Registered {
  readonly id: string;
  readonly rounds: number;
  readonly options: (i: number) => readonly number[];
  readonly answer: (i: number) => number;
}

const GAMES: readonly Registered[] = [
  { id: 'times-tables', rounds: TIMES_ROUNDS.length, options: getTimesOptions,
    answer: (i) => timesProduct(TIMES_ROUNDS[i]) },
  { id: 'count-by-tens', rounds: COUNT_BY_TENS_ROUNDS.length, options: getCountByTensOptions,
    answer: (i) => COUNT_BY_TENS_ROUNDS[i].answer },
  { id: 'groups-of', rounds: GROUPS_ROUNDS.length, options: getGroupsOptions,
    answer: (i) => productOf(GROUPS_ROUNDS[i]) },
  { id: 'how-many-groups', rounds: GROUP_ROUNDS.length, options: getGroupOptions,
    answer: (i) => groupAnswer(GROUP_ROUNDS[i]) },
  { id: 'money-coins', rounds: MONEY_ROUNDS.length, options: getMoneyOptions,
    answer: (i) => roundTotal(MONEY_ROUNDS[i]) },
  { id: 'two-digit-subtract', rounds: SUBTRACT_ROUNDS.length, options: getSubtractOptions,
    answer: (i) => SUBTRACT_ROUNDS[i].answer },
  { id: 'two-digit-add', rounds: TWO_DIGIT_ADD_ROUNDS.length, options: getAddOptions,
    answer: (i) => TWO_DIGIT_ADD_ROUNDS[i].answer },
];

const slots = (g: Registered): number[] =>
  Array.from({ length: g.rounds }, (_, i) => g.options(i).indexOf(g.answer(i)));

describe('where the answer sits', () => {
  it.each(GAMES.map((g) => [g.id, g] as const))('%s does not favour one slot', (_id, g) => {
    const s = slots(g);
    expect(s.every((x) => x >= 0)).toBe(true);
    const k = g.options(0).length;
    const counts = new Map<number, number>();
    for (const x of s) counts.set(x, (counts.get(x) ?? 0) + 1);
    const worst = Math.max(...counts.values());
    // Even placement would be rounds/k; allow slack for a small round count.
    expect(worst).toBeLessThanOrEqual(Math.ceil(g.rounds / k) + 1);
  });

  it('every round still contains its answer exactly once', () => {
    for (const g of GAMES) {
      for (let i = 0; i < g.rounds; i += 1) {
        const o = g.options(i);
        expect(o.filter((x) => x === g.answer(i))).toHaveLength(1);
      }
    }
  });
});

describe('placement carries no information about the answer', () => {
  /**
   * The property that actually matters. A frequency test alone can be passed by
   * an ordering that still depends on the values — swap the answer for another
   * number and a value-derived order moves it. This asserts the slot is a
   * function of identity only.
   */
  it('keeps the slot when the answer value changes', () => {
    for (const gameId of ['times-tables', 'money-coins', 'two-digit-add']) {
      for (let round = 0; round < 14; round += 1) {
        const a = placeOptions({ gameId, roundIndex: round, answer: 100, distractors: [1, 2, 3], count: 4 });
        const b = placeOptions({ gameId, roundIndex: round, answer: 999, distractors: [1, 2, 3], count: 4 });
        expect(a.indexOf(100)).toBe(b.indexOf(999));
      }
    }
  });

  it('is stable across calls, so rounds do not reshuffle under the child', () => {
    const once = placeOptions({ gameId: 'x', roundIndex: 3, answer: 7, distractors: [1, 2, 3], count: 4 });
    const twice = placeOptions({ gameId: 'x', roundIndex: 3, answer: 7, distractors: [1, 2, 3], count: 4 });
    expect(once).toEqual(twice);
  });

  it('differs between rounds of the same game', () => {
    const seen = new Set(
      Array.from({ length: 12 }, (_, i) =>
        placeOptions({ gameId: 'x', roundIndex: i, answer: 7, distractors: [1, 2, 3], count: 4 }).indexOf(7)),
    );
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('no dead options', () => {
  it('never offers a number already printed in the counting sequence', () => {
    // "10, 20, 30, ?" offered 30, 40, 50 in 14 of 14 rounds — one option was
    // visibly already used, collapsing the round to a one-of-two.
    for (let i = 0; i < COUNT_BY_TENS_ROUNDS.length; i += 1) {
      const r = COUNT_BY_TENS_ROUNDS[i];
      const dead = getCountByTensOptions(i).filter((o) => r.sequence.includes(o));
      expect(dead).toEqual([]);
    }
  });
});
