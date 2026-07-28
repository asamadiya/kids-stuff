import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, it, expect } from 'vitest';
import { createElement } from 'react';
import {
  FRACTIONPIZZA_META,
  FRACTIONS,
  FRACTION_OPTION_COUNT,
  FRACTION_ROUNDS,
  FOODS,
  foodOf,
  fractionInfo,
  getFractionOptions,
  getFractionFeedback,
  goneFraction,
  leftFraction,
  plateWedges,
  roundAnswer,
  roundLabel,
  roundPrompt,
  roundSpoken,
  type PlateRound,
} from '../games/fraction-pizza';
import { FractionPizzaGame } from '../components/FractionPizzaGame';

afterEach(cleanup);

/* ------------------------------------------------------------------ parsers -- */

/**
 * These read the two numbers of the record — how many equal pieces, how many
 * are gone — back out of strings the child can see or hear, and compare them to
 * the RECORD. Comparing the prompt to the aria-label would prove nothing once
 * both are generated from one place; it has to be the record on the other side.
 */
function pair(text: string, re: RegExp): [number, number] {
  const m = re.exec(text);
  if (!m) throw new Error(`no match for ${re} in: ${JSON.stringify(text)}`);
  return [Number(m[1]), Number(m[2])];
}

const PROMPT = /cut into (\d+) equal \w+\. (\d+) \w+ (?:is|are) gone\./;
const ASKS = /What fraction is (gone|left)\?/;
const LABEL = /cut into (\d+) equal \w+, (\d+) gone$/;
const FEEDBACK = /(\d+) of (\d+) \w+ (?:is|are) gone:/;

/* --------------------------------------------------------------------- meta -- */

describe('fraction-pizza meta', () => {
  it('keeps the module id other files index it by', () => {
    expect(FRACTIONPIZZA_META.id).toBe('fraction-pizza');
    expect(FRACTIONPIZZA_META.color).toBe('sun');
    expect(FRACTIONPIZZA_META.icon.length).toBeGreaterThan(0);
    expect(FRACTIONPIZZA_META.tagline.length).toBeGreaterThan(0);
  });

  it('shows the child no pizza, no pepperoni and no candy register', () => {
    const surfaces = [
      FRACTIONPIZZA_META.title,
      FRACTIONPIZZA_META.icon,
      FRACTIONPIZZA_META.tagline,
      ...FOODS.flatMap((f) => [f.named, f.titled, f.piece, f.pieces]),
      ...FRACTION_ROUNDS.map(roundPrompt),
      ...FRACTION_ROUNDS.map(roundLabel),
      ...FRACTION_ROUNDS.map((r) => getFractionFeedback(r, roundAnswer(r).value)),
    ];
    for (const s of surfaces) {
      expect(s).not.toMatch(/pizza|pepperoni|meat|fish|bacon|ham|candy|cookie|cupcake|yum|tasty/i);
    }
  });
});

/* ------------------------------------------------------------- the one gate -- */

describe('the plate and the question describe one record', () => {
  /**
   * THE GATE. This fails if the fix is reverted.
   *
   * Two independent halves, both measured against the record:
   *
   *   - the number of wedges the renderer marks ABSENT equals `round.eaten`.
   *     On the build this replaced, zero wedges were ever absent in any round —
   *     the component had no absent state at all — so this half goes red 18 of
   *     18 the moment the shaded-wedge renderer comes back.
   *   - `(denom, eaten)` parsed out of the rendered prompt, and again out of
   *     the rendered plate label, each equal the record. Restoring the old
   *     `{denom, shaded}` round, where `shaded = denom - 1` and the prompt was
   *     a hand-written sentence, moves both away from the record.
   */
  it('draws exactly round.eaten wedges absent and prints round.denom and round.eaten in both the prompt and the plate label (fails if the absent state or the derived prompt is reverted)', async () => {
    const user = userEvent.setup({ delay: null });
    render(createElement(FractionPizzaGame));

    for (let i = 0; i < FRACTION_ROUNDS.length; i += 1) {
      const round: PlateRound = FRACTION_ROUNDS[i];
      const answer = roundAnswer(round);
      const where = `round ${i} (${round.eaten} of ${round.denom} gone, asks ${round.kind})`;

      const plate = screen.getByTestId('fraction-plate');
      const absent = plate.querySelectorAll('[data-wedge="absent"]');
      const present = plate.querySelectorAll('[data-wedge="present"]');
      expect(absent.length, `absent wedges, ${where}`).toBe(round.eaten);
      expect(present.length, `present wedges, ${where}`).toBe(round.denom - round.eaten);
      // Absent means absent: no food colour is painted into the gap.
      absent.forEach((w) => expect(w.getAttribute('fill')).toBe('none'));
      present.forEach((w) => expect(w.getAttribute('fill')).toBe(foodOf(round.food).fill));

      const prompt = screen.getByText(PROMPT).textContent ?? '';
      expect(pair(prompt, PROMPT), `prompt, ${where}`).toEqual([round.denom, round.eaten]);
      expect(ASKS.exec(prompt)?.[1], `question asked, ${where}`).toBe(round.kind);

      const label = plate.getAttribute('aria-label') ?? '';
      expect(pair(label, LABEL), `plate label, ${where}`).toEqual([round.denom, round.eaten]);

      await user.click(screen.getByRole('button', { name: new RegExp(`^${answer.value} `) }));

      const feedback = screen.getByRole('status').textContent ?? '';
      expect(pair(feedback, FEEDBACK), `feedback, ${where}`).toEqual([round.eaten, round.denom]);
      expect(feedback.startsWith('Correct.'), `scoring, ${where}`).toBe(true);

      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  }, 30_000);

  it('parses the same two numbers out of the spoken line a non-reader hears', () => {
    for (const round of FRACTION_ROUNDS) {
      expect(pair(roundSpoken(round), PROMPT)).toEqual([round.denom, round.eaten]);
    }
  });

  it('generates the wedge outline and its absent flag together', () => {
    for (const round of FRACTION_ROUNDS) {
      const wedges = plateWedges(round);
      expect(wedges).toHaveLength(round.denom);
      expect(wedges.filter((w) => w.absent)).toHaveLength(round.eaten);
      expect(new Set(wedges.map((w) => w.d)).size).toBe(round.denom);
      for (const w of wedges) expect(w.d).toMatch(/^M 60 60 L [\d.-]+ [\d.-]+ A 46 46 0 [01] 1 /);
    }
  });
});

/* ------------------------------------------------------------------- rounds -- */

describe('fraction-pizza rounds', () => {
  it('never leaves the plate whole or empty', () => {
    expect(FRACTION_ROUNDS.length).toBeGreaterThanOrEqual(12);
    for (const r of FRACTION_ROUNDS) {
      expect(r.eaten).toBeGreaterThanOrEqual(1);
      expect(r.eaten).toBeLessThanOrEqual(r.denom - 1);
    }
  });

  it('computes gone and left as real complements of the same cut', () => {
    for (const round of FRACTION_ROUNDS) {
      const gone = goneFraction(round);
      const left = leftFraction(round);
      expect(gone.amount + left.amount).toBeCloseTo(1, 10);
      expect(gone.num + left.num).toBe(round.denom);
      expect(roundAnswer(round).value).toBe(round.kind === 'gone' ? gone.value : left.value);
    }
  });

  /**
   * The measured defect: `answer === '1/' + denom` in 14 of 14 rounds, so the
   * whole exercise was "count the slices, press one-over-that" and no fraction
   * was ever read. Reverting to single-piece rounds pushes this back to 100%.
   */
  it('is not solvable by pressing one-over-the-number-of-pieces (fails if eaten is pinned to 1 or denom-1 again)', () => {
    const reflex = FRACTION_ROUNDS.filter((r) => roundAnswer(r).value === `1/${r.denom}`);
    expect(reflex.length / FRACTION_ROUNDS.length).toBeLessThan(0.5);

    const answers = new Set(FRACTION_ROUNDS.map((r) => roundAnswer(r).value));
    for (const v of ['2/3', '3/4', '2/4'] as const) expect(answers.has(v)).toBe(true);
    expect(answers.size).toBe(FRACTIONS.length);
  });

  it('shows more than a handful of distinct plates', () => {
    const plates = new Set(FRACTION_ROUNDS.map((r) => `${r.denom}:${r.eaten}`));
    expect(plates.size).toBeGreaterThanOrEqual(6);
    const pictures = new Set(FRACTION_ROUNDS.map((r) => `${r.food}:${r.denom}:${r.eaten}`));
    expect(pictures.size).toBe(FRACTION_ROUNDS.length);
  });

  it('asks both questions about every cut', () => {
    for (const plate of new Set(FRACTION_ROUNDS.map((r) => `${r.denom}:${r.eaten}`))) {
      const kinds = new Set(
        FRACTION_ROUNDS.filter((r) => `${r.denom}:${r.eaten}` === plate).map((r) => r.kind),
      );
      expect([...kinds].sort()).toEqual(['gone', 'left']);
    }
  });
});

/* ------------------------------------------------------------------ options -- */

describe('fraction-pizza options', () => {
  /**
   * `getFractionOptions` used to ignore its argument entirely and return a
   * fixed ['1/2','1/3','1/4'] in all 14 rounds.
   */
  it('depends on the round (fails if the fixed three-button list comes back)', () => {
    const lists = new Set(FRACTION_ROUNDS.map((_, i) => getFractionOptions(i).join(',')));
    expect(lists.size).toBeGreaterThan(1);
    for (let i = 0; i < FRACTION_ROUNDS.length; i += 1) {
      expect(getFractionOptions(i)).toHaveLength(FRACTION_OPTION_COUNT);
    }
  });

  /**
   * 2/4 and 1/2 are the same amount. Offering both, with one marked wrong, is
   * the defect halves-and-wholes shipped; the option builder filters by value
   * so the state cannot be produced.
   */
  it('never offers two labels of the same value, and marks exactly one option correct', () => {
    FRACTION_ROUNDS.forEach((round, i) => {
      const opts = getFractionOptions(i);
      const amounts = opts.map((o) => fractionInfo(o).amount);
      expect(new Set(amounts).size).toBe(opts.length);
      const answer = roundAnswer(round).amount;
      expect(amounts.filter((a) => a === answer)).toHaveLength(1);
      expect(opts).toContain(roundAnswer(round).value);
    });
  });

  it('offers the other half of the same plate whenever it is a different amount', () => {
    FRACTION_ROUNDS.forEach((round, i) => {
      const other = round.kind === 'gone' ? leftFraction(round) : goneFraction(round);
      if (other.amount === roundAnswer(round).amount) return;
      expect(getFractionOptions(i)).toContain(other.value);
    });
  });

  it('does not park the answer in one slot', () => {
    const slots = FRACTION_ROUNDS.map((r, i) => getFractionOptions(i).indexOf(roundAnswer(r).value));
    expect(slots.every((s) => s >= 0)).toBe(true);
    expect(new Set(slots).size).toBe(FRACTION_OPTION_COUNT);
  });

  it('wraps deterministically with modulo indexing', () => {
    expect(getFractionOptions(FRACTION_ROUNDS.length)).toEqual(getFractionOptions(0));
    expect(getFractionOptions(-1)).toEqual(getFractionOptions(FRACTION_ROUNDS.length - 1));
  });
});

/* ------------------------------------------------------------------ helpers -- */

describe('fraction labels', () => {
  it('generates every proper fraction of a half, third and quarter with its word', () => {
    expect(FRACTIONS.map((f) => f.value)).toEqual(['1/2', '1/3', '2/3', '1/4', '2/4', '3/4']);
    for (const f of FRACTIONS) {
      expect(fractionInfo(f.value)).toEqual(f);
      expect(f.amount).toBeCloseTo(f.num / f.denom, 10);
      expect(f.value).toBe(`${f.num}/${f.denom}`);
      expect(f.word.length).toBeGreaterThan(0);
    }
    expect(FRACTIONS.map((f) => f.word)).toEqual([
      'one half',
      'one third',
      'two thirds',
      'one quarter',
      'two quarters',
      'three quarters',
    ]);
  });

  it('agrees the piece noun with the count in every round', () => {
    for (const round of FRACTION_ROUNDS) {
      const food = foodOf(round.food);
      const prompt = roundPrompt(round);
      expect(prompt).toContain(`cut into ${round.denom} equal ${food.pieces}`);
      expect(prompt).toContain(
        round.eaten === 1 ? `1 ${food.piece} is gone` : `${round.eaten} ${food.pieces} are gone`,
      );
    }
  });
});

describe('fraction-pizza copy', () => {
  const PRAISE = /great|good job|well done|awesome|yay|nice try|super|amazing/i;

  it('states the fact and does not praise, either way', () => {
    FRACTION_ROUNDS.forEach((round, i) => {
      const answer = roundAnswer(round).value;
      const missed = getFractionOptions(i).find((o) => o !== answer)!;
      for (const line of [
        roundPrompt(round),
        getFractionFeedback(round, answer),
        getFractionFeedback(round, missed),
      ]) {
        expect(line.length).toBeGreaterThan(0);
        expect(line).not.toMatch(PRAISE);
        expect(line).not.toContain('!');
      }
    });
  });

  it('names the answer whichever button was pressed, and names both parts', () => {
    FRACTION_ROUNDS.forEach((round, i) => {
      const answer = roundAnswer(round);
      const missed = getFractionOptions(i).find((o) => o !== answer.value)!;
      const wrong = getFractionFeedback(round, missed);
      expect(wrong).toContain(answer.word);
      expect(wrong).toContain(answer.value);
      const right = getFractionFeedback(round, answer.value);
      expect(right).toContain(goneFraction(round).word);
      expect(right).toContain(leftFraction(round).word);
    });
  });
});
