import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect } from 'vitest';
import { createElement } from 'react';
import {
  TIMES_TABLES_META,
  TIMES_ROUNDS,
  TIMES_OPTION_COUNT,
  TIMES_TABLE_FAMILIES,
  dotArray,
  getTimesOptions,
  getTimesFeedback,
  timesArrayLabel,
  timesProduct,
  timesQuestion,
  timesHint,
  timesSpoken,
  type TimesRound,
} from '../games/times-tables';
import { TimesTablesGame } from '../components/TimesTablesGame';

afterEach(cleanup);

/* ------------------------------------------------------------------ parsers -- */

/**
 * Every parser below reads numbers out of a string that a child can actually
 * see or hear, and every assertion compares them to the ROUND RECORD. None
 * compares one generated string to another: that is a tautology once both come
 * from one record, and it would pass on the broken build too.
 */
function pair(text: string, re: RegExp): [number, number] {
  const m = re.exec(text);
  if (!m) throw new Error(`no match for ${re} in: ${JSON.stringify(text)}`);
  return [Number(m[1]), Number(m[2])];
}

const QUESTION = /^(\d+) × (\d+) = \?$/;
const ARRAY_LABEL = /^(\d+) rows of (\d+) dots$/;
const SKIP_COUNT = /count by (\d+)s, (\d+) times?\./i;
const GROUPS_OF = /That is (\d+) groups of (\d+):/;

/** Rows of the rendered array, read off the circles' y positions. */
function renderedRows(svg: Element): number[] {
  const byRow = new Map<string, number>();
  svg.querySelectorAll('circle').forEach((c) => {
    const cy = c.getAttribute('cy') ?? '';
    byRow.set(cy, (byRow.get(cy) ?? 0) + 1);
  });
  return [...byRow.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([, n]) => n);
}

/* --------------------------------------------------------------------- meta -- */

describe('times-tables meta', () => {
  it('has the expected identity', () => {
    expect(TIMES_TABLES_META.id).toBe('times-tables');
    expect(TIMES_TABLES_META.title.length).toBeGreaterThan(0);
    expect(TIMES_TABLES_META.color).toBe('sun');
  });
});

/* ------------------------------------------------------------------ ceiling -- */

describe('the tables covered', () => {
  it('includes 3s and 4s, not just the tables you can skip-count on your fingers', () => {
    expect([...TIMES_TABLE_FAMILIES].sort((a, b) => a - b)).toEqual([2, 3, 4, 5, 10]);
    const drawn = new Set(TIMES_ROUNDS.map((r) => r.per));
    for (const family of [2, 3, 4, 5, 10]) expect(drawn.has(family)).toBe(true);
  });

  it('has enough rounds and never asks for a single group', () => {
    expect(TIMES_ROUNDS.length).toBeGreaterThanOrEqual(20);
    // Copy says "N groups of M" and "N times"; one group would read "1 groups".
    for (const r of TIMES_ROUNDS) expect(r.groups).toBeGreaterThanOrEqual(2);
  });

  it('interleaves the tables so consecutive rounds come from different ladders', () => {
    for (let i = 1; i < TIMES_ROUNDS.length; i += 1) {
      expect(TIMES_ROUNDS[i].per).not.toBe(TIMES_ROUNDS[i - 1].per);
    }
  });
});

/* ------------------------------------------------------------- the one gate -- */

describe('one record, one reading', () => {
  /**
   * THE GATE. This fails if the fix is reverted.
   *
   * The old round was `{a, b}`: the loop drew `a` rows of `b`, the aria-label
   * agreed with the loop, and the hint and the feedback described the
   * transpose — "5 rows of 3 dots" over "Count by 5s, 3 times". Reverting any
   * one surface to the other factor moves one of the parsed pairs away from the
   * record and this test goes red on the first non-square round, which is 23 of
   * 23.
   */
  it('renders every round with prompt, array label, dot geometry, hint and feedback all agreeing with the round record (fails if any surface is rebuilt from the other factor)', async () => {
    const user = userEvent.setup({ delay: null });
    render(createElement(TimesTablesGame));

    for (let i = 0; i < TIMES_ROUNDS.length; i += 1) {
      const round: TimesRound = TIMES_ROUNDS[i];
      const product = timesProduct(round);
      const where = `round ${i} (${round.groups} groups of ${round.per})`;

      const prompt = screen.getByText(QUESTION).textContent ?? '';
      expect(pair(prompt, QUESTION), `prompt, ${where}`).toEqual([round.groups, round.per]);

      const svg = screen.getByTestId('times-array');
      const label = svg.getAttribute('aria-label') ?? '';
      expect(pair(label, ARRAY_LABEL), `array label, ${where}`).toEqual([round.groups, round.per]);

      // The picture itself, counted: one row per group, `per` dots along it.
      const rows = renderedRows(svg);
      expect(rows.length, `row count, ${where}`).toBe(round.groups);
      expect(rows, `dots per row, ${where}`).toEqual(Array(round.groups).fill(round.per));

      const hint = screen.getByText(SKIP_COUNT).textContent ?? '';
      // You step by the size of a group, once per group.
      expect(pair(hint, SKIP_COUNT), `hint, ${where}`).toEqual([round.per, round.groups]);

      await user.click(screen.getByRole('button', { name: String(product) }));

      const feedback = screen.getByRole('status').textContent ?? '';
      expect(pair(feedback, GROUPS_OF), `feedback grouping, ${where}`).toEqual([
        round.groups,
        round.per,
      ]);
      expect(pair(feedback, SKIP_COUNT), `feedback skip-count, ${where}`).toEqual([
        round.per,
        round.groups,
      ]);

      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  }, 30_000);

  it('parses the same two numbers out of the spoken line, which a non-reader hears instead of the prompt', () => {
    for (const round of TIMES_ROUNDS) {
      const spoken = timesSpoken(round);
      const [g, p] = pair(spoken, /^(\d+) times (\d+)\./);
      expect([g, p]).toEqual([round.groups, round.per]);
      expect(pair(spoken, SKIP_COUNT)).toEqual([round.per, round.groups]);
    }
  });

  it('never lets the skip-count step and the row count swap places (the exact 2026-07 defect)', () => {
    // "5 rows of 3 dots" with "Count by 5s, 3 times" was the shipped state.
    // In a non-square round the step must be the row LENGTH, not the row COUNT.
    const nonSquare = TIMES_ROUNDS.filter((r) => r.groups !== r.per);
    expect(nonSquare.length).toBeGreaterThan(0);
    for (const round of nonSquare) {
      const [step, reps] = pair(timesHint(round), SKIP_COUNT);
      const [rows, perRow] = pair(timesArrayLabel(round), ARRAY_LABEL);
      expect(step).toBe(perRow);
      expect(reps).toBe(rows);
      expect(step).not.toBe(rows);
    }
  });

  it('generates the dot geometry and its accessible name from one call', () => {
    for (const round of TIMES_ROUNDS) {
      const array = dotArray(round);
      expect(array.label).toBe(timesArrayLabel(round));
      expect(array.rows).toBe(round.groups);
      expect(array.cols).toBe(round.per);
      expect(array.dots).toHaveLength(timesProduct(round));
      const rows = new Set(array.dots.map((d) => d.cy));
      const cols = new Set(array.dots.map((d) => d.cx));
      expect(rows.size).toBe(round.groups);
      expect(cols.size).toBe(round.per);
      expect(array.height).toBeGreaterThan(array.dots[0].r * 2 * round.groups);
      expect(array.width).toBeGreaterThan(array.dots[0].r * 2 * round.per);
    }
  });
});

/* ------------------------------------------------------------------ numbers -- */

describe('times-tables arithmetic and options', () => {
  it('computes every product by independent repeated addition', () => {
    for (const round of TIMES_ROUNDS) {
      let expected = 0;
      for (let k = 0; k < round.groups; k += 1) expected += round.per;
      expect(timesProduct(round)).toBe(expected);
    }
  });

  it('gives a stable, unique, positive option list containing the product', () => {
    TIMES_ROUNDS.forEach((round, i) => {
      const opts = getTimesOptions(i);
      expect(opts).toHaveLength(TIMES_OPTION_COUNT);
      expect(new Set(opts).size).toBe(opts.length);
      expect(opts).toContain(timesProduct(round));
      for (const o of opts) expect(o).toBeGreaterThan(0);
    });
  });

  it('does not park the answer in one slot', () => {
    const slots = TIMES_ROUNDS.map((round, i) => getTimesOptions(i).indexOf(timesProduct(round)));
    expect(slots.every((s) => s >= 0)).toBe(true);
    expect(new Set(slots).size).toBe(TIMES_OPTION_COUNT);
  });

  it('wraps deterministically with modulo indexing', () => {
    expect(getTimesOptions(TIMES_ROUNDS.length)).toEqual(getTimesOptions(0));
    expect(getTimesOptions(-1)).toEqual(getTimesOptions(TIMES_ROUNDS.length - 1));
  });

  it('offers the group-count slip as a distractor, which is the mistake worth seeing', () => {
    TIMES_ROUNDS.forEach((round, i) => {
      const opts = getTimesOptions(i);
      const oneGroupOff = [(round.groups + 1) * round.per, (round.groups - 1) * round.per];
      expect(opts.some((o) => oneGroupOff.includes(o))).toBe(true);
    });
  });
});

/* -------------------------------------------------------------------- copy -- */

describe('times-tables copy', () => {
  const PRAISE = /great|good job|well done|awesome|yay|nice try|super|amazing|tap the total/i;

  it('states the fact and does not praise, either way', () => {
    TIMES_ROUNDS.forEach((round, i) => {
      const product = timesProduct(round);
      const missed = getTimesOptions(i).find((o) => o !== product)!;
      for (const line of [
        timesQuestion(round),
        timesHint(round),
        getTimesFeedback(round, product),
        getTimesFeedback(round, missed),
      ]) {
        expect(line.length).toBeGreaterThan(0);
        expect(line).not.toMatch(PRAISE);
        expect(line).not.toContain('!');
      }
    });
  });

  it('names the product whichever button was pressed', () => {
    TIMES_ROUNDS.forEach((round, i) => {
      const product = timesProduct(round);
      const missed = getTimesOptions(i).find((o) => o !== product)!;
      expect(getTimesFeedback(round, product)).toContain(String(product));
      expect(getTimesFeedback(round, missed)).toContain(String(product));
    });
  });
});
