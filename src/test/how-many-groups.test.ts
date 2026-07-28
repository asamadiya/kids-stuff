import { createElement } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import {
  GROUP_OPTION_COUNT,
  GROUP_ROUNDS,
  HOW_MANY_GROUPS_META,
  getGroupFeedback,
  getGroupOptions,
  groupAnswer,
  groupDistractors,
  groupLeftoverLine,
  groupOptionLabel,
  groupPrompt,
  groupRemainder,
} from '../games/how-many-groups';
import { NOUNS, VESSELS } from '../games/nouns';
import { HowManyGroupsGame } from '../components/HowManyGroupsGame';

afterEach(cleanup);

const game = () => createElement(HowManyGroupsGame);

/**
 * Three defects, three gates.
 *
 *  1. The stimulus arrived pre-grouped, so the division was solved before the
 *     question was read. GATE: nothing is grouped until the child groups it.
 *  2. The grouping was a `marginLeft` on a wrapping row, so at twenty items the
 *     visible clusters stopped matching `per`. GATE: a group is an element
 *     holding exactly `per` items, counted in the DOM.
 *  3. Every one of fourteen rounds divided exactly. GATE: rounds with a
 *     remainder exist, are scored as the number of FULL vessels, and leave the
 *     remainder visible in the heap.
 */

describe('the rounds', () => {
  it('count only vetted objects, so no glyph can disagree with its noun', () => {
    const nouns = Object.values(NOUNS);
    const vessels = Object.values(VESSELS);
    for (const round of GROUP_ROUNDS) {
      expect(nouns).toContain(round.item);
      expect(vessels).toContain(round.vessel);
    }
  });

  it('exposes coherent meta', () => {
    expect(HOW_MANY_GROUPS_META.id).toBe('how-many-groups');
    expect(HOW_MANY_GROUPS_META.title.length).toBeGreaterThan(0);
    expect(HOW_MANY_GROUPS_META.tagline.length).toBeGreaterThan(0);
  });

  it('GATE: some rounds leave a remainder (every shipped round divided exactly)', () => {
    const withRemainder = GROUP_ROUNDS.filter((r) => groupRemainder(r) > 0);
    expect(withRemainder.length).toBeGreaterThanOrEqual(4);
    // And the exact ones are still there, so the child meets both cases.
    expect(GROUP_ROUNDS.filter((r) => groupRemainder(r) === 0).length).toBeGreaterThanOrEqual(4);
  });

  it('scores the number of FULL vessels, and the parts add back up to the total', () => {
    for (const round of GROUP_ROUNDS) {
      const answer = groupAnswer(round);
      const left = groupRemainder(round);
      expect(answer).toBeGreaterThan(0);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThan(round.per);
      expect(answer * round.per + left).toBe(round.total);
    }
  });

  it('builds the prompt from the record, with both word forms agreeing', () => {
    for (const round of GROUP_ROUNDS) {
      const text = groupPrompt(round);
      expect(text).toContain(String(round.total));
      expect(text).toContain(String(round.per));
      expect(text).toContain(round.vessel.plural);
      // The wording must not change when there is a remainder, or it is a tell.
      expect(text.endsWith(`How many full ${round.vessel.plural}?`)).toBe(true);
    }
  });
});

describe('options', () => {
  it('include the answer exactly once, positive and distinct', () => {
    GROUP_ROUNDS.forEach((round, i) => {
      const opts = getGroupOptions(i);
      expect(opts).toHaveLength(GROUP_OPTION_COUNT);
      expect(new Set(opts).size).toBe(opts.length);
      expect(opts.filter((o) => o === groupAnswer(round))).toHaveLength(1);
      for (const o of opts) {
        expect(Number.isInteger(o)).toBe(true);
        expect(o).toBeGreaterThan(0);
      }
    });
  });

  it('never offer the total, which with more than one to a vessel can never be the answer', () => {
    GROUP_ROUNDS.forEach((round, i) => {
      expect(round.per).toBeGreaterThan(1);
      expect(getGroupOptions(i), `round ${i}`).not.toContain(round.total);
    });
  });

  it('do offer the group size on rounds where it is wrong, so seeing it is not a tell', () => {
    // 11 feathers, 3 to a jar, is 3 jars. If `per` only ever appeared as the
    // right answer, a child could win by picking the number from the sentence.
    const offeredAndWrong = GROUP_ROUNDS.filter(
      (round, i) => getGroupOptions(i).includes(round.per) && groupAnswer(round) !== round.per,
    );
    expect(offeredAndWrong.length).toBeGreaterThan(0);
  });

  it('offer the off-by-one a child makes by counting the leftovers as a full group', () => {
    for (const round of GROUP_ROUNDS.filter((r) => groupRemainder(r) > 0)) {
      expect(groupDistractors(round)).toContain(Math.ceil(round.total / round.per));
    }
  });

  it('are deterministic and wrap by modulo', () => {
    GROUP_ROUNDS.forEach((_, i) => {
      expect(getGroupOptions(i)).toEqual(getGroupOptions(i));
      expect(getGroupOptions(i)).toEqual(getGroupOptions(i + GROUP_ROUNDS.length));
    });
  });
});

describe('GATE: the stimulus does not pre-solve the division', () => {
  it('draws no groups at all until the child makes one', () => {
    render(game());
    expect(screen.queryAllByTestId('group')).toHaveLength(0);
    // Every item is in one undivided heap.
    const heap = screen.getByTestId('heap');
    expect(within(heap).getAllByTestId('item')).toHaveLength(GROUP_ROUNDS[0].total);
    expect(screen.getAllByTestId('item')).toHaveLength(GROUP_ROUNDS[0].total);
  });

  it('separates nothing with a margin, which is how the old clusters lied when the row wrapped', () => {
    render(game());
    for (const item of screen.getAllByTestId('item')) {
      const style = (item as HTMLElement).style;
      expect(style.marginLeft).toBe('');
      expect(style.marginRight).toBe('');
    }
  });

  it('prints no number in the stage, so nothing there can be read off instead of counted', () => {
    render(game());
    expect(screen.getByTestId('tray').textContent ?? '').not.toMatch(/[0-9]/);
  });
});

describe('GATE: a group is an element holding exactly `per` items', () => {
  it('grows one real group per fill, each with exactly `per` items in it', async () => {
    const user = userEvent.setup();
    render(game());
    const round = GROUP_ROUNDS[0];
    const answer = groupAnswer(round);

    for (let made = 1; made <= answer; made += 1) {
      await user.click(screen.getByTestId('fill'));
      const groups = screen.getAllByTestId('group');
      expect(groups).toHaveLength(made);
      for (const g of groups) {
        expect(within(g as HTMLElement).getAllByTestId('item')).toHaveLength(round.per);
      }
      const left = round.total - made * round.per;
      const heaps = screen.queryAllByTestId('heap');
      if (left === 0) expect(heaps).toHaveLength(0);
      else expect(within(heaps[0] as HTMLElement).getAllByTestId('item')).toHaveLength(left);
      // Nothing is created or destroyed by grouping.
      expect(screen.getAllByTestId('item')).toHaveLength(round.total);
    }

    expect((screen.getByTestId('fill') as HTMLButtonElement).disabled).toBe(true);
  });

  it('holds for every round once the answer is given: groups === total div per, heap === remainder', async () => {
    const user = userEvent.setup();
    render(game());

    for (let i = 0; i < GROUP_ROUNDS.length; i += 1) {
      const round = GROUP_ROUNDS[i];
      expect(screen.queryAllByTestId('group'), `round ${i} starts grouped`).toHaveLength(0);

      await user.click(screen.getAllByTestId('option')[0]);

      const groups = screen.getAllByTestId('group');
      expect(groups, `round ${i}`).toHaveLength(groupAnswer(round));
      for (const g of groups) {
        expect(within(g as HTMLElement).getAllByTestId('item'), `round ${i}`).toHaveLength(round.per);
      }
      const left = groupRemainder(round);
      const heaps = screen.queryAllByTestId('heap');
      if (left === 0) {
        expect(heaps, `round ${i}`).toHaveLength(0);
        expect(screen.queryByTestId('leftover-caption')).toBeNull();
      } else {
        expect(within(heaps[0] as HTMLElement).getAllByTestId('item'), `round ${i}`).toHaveLength(left);
        expect(screen.getByTestId('leftover-caption').textContent).toBe('left over');
      }

      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  });

  it('puts everything back in the heap when the child tips it out', async () => {
    const user = userEvent.setup();
    render(game());
    await user.click(screen.getByTestId('fill'));
    expect(screen.getAllByTestId('group')).toHaveLength(1);
    await user.click(screen.getByTestId('tip-out'));
    expect(screen.queryAllByTestId('group')).toHaveLength(0);
    expect(screen.getAllByTestId('item')).toHaveLength(GROUP_ROUNDS[0].total);
  });
});

describe('the stage describes itself for a listener', () => {
  it('says what is in the vessels and what is still loose', async () => {
    const user = userEvent.setup();
    render(game());
    const round = GROUP_ROUNDS[0];
    expect(screen.getByTestId('tray').getAttribute('aria-label')).toBe(
      `A heap of ${round.total} ${round.item.plural}, not yet sorted.`,
    );
    await user.click(screen.getByTestId('fill'));
    const label = screen.getByTestId('tray').getAttribute('aria-label') ?? '';
    expect(label).toContain(`1 ${round.vessel.singular} filled`);
    expect(label).toContain(`${round.total - round.per} ${round.item.plural} still in the heap`);
  });
});

describe('what the child is told', () => {
  it('states the working and the leftovers for any choice', () => {
    GROUP_ROUNDS.forEach((round, i) => {
      const answer = groupAnswer(round);
      for (const o of getGroupOptions(i)) {
        const text = getGroupFeedback(round, o);
        expect(text).toContain(String(answer));
        expect(text).toContain(groupLeftoverLine(round));
      }
    });
  });

  it('names the remainder rather than pretending it is not there', () => {
    for (const round of GROUP_ROUNDS.filter((r) => groupRemainder(r) > 0)) {
      const line = groupLeftoverLine(round);
      expect(line).toContain(String(groupRemainder(round)));
      expect(line).toContain('left over');
    }
    for (const round of GROUP_ROUNDS.filter((r) => groupRemainder(r) === 0)) {
      expect(groupLeftoverLine(round)).toBe('Nothing is left over.');
    }
  });

  it('agrees count with word form, never by appending an s', () => {
    for (const round of GROUP_ROUNDS) {
      const text = getGroupFeedback(round, groupAnswer(round));
      if (groupAnswer(round) === 1) expect(text).toContain(`1 ${round.vessel.singular}`);
      else expect(text).toContain(`${groupAnswer(round)} ${round.vessel.plural}`);
    }
    // The table's irregular forms are the ones string surgery got wrong.
    expect(VESSELS.shelf.plural).toBe('shelves');
    expect(NOUNS.leaf.plural).toBe('leaves');
  });

  it('keeps the register: no praise, no exclamation marks', () => {
    const praise = /\b(great|good job|well done|awesome|amazing|super|yay|clever|brilliant)\b/i;
    GROUP_ROUNDS.forEach((round, i) => {
      for (const o of getGroupOptions(i)) {
        const text = getGroupFeedback(round, o);
        expect(praise.test(text), text).toBe(false);
        expect(text).not.toContain('!');
      }
    });
  });

  it('labels an option with its own number', () => {
    expect(groupOptionLabel(6)).toBe('6');
    expect(groupOptionLabel(1)).toBe('1');
  });
});
