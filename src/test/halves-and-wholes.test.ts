import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  HALVES_AND_WHOLES_META,
  HALVES_PALETTE,
  HALVES_ROUNDS,
  SHAPE_GEOMETRY,
  addFractions,
  cut,
  describeParts,
  fr,
  fractionName,
  fractionValue,
  getHalvesFeedback,
  getHalvesOptions,
  getHalvesRound,
  hasEqualParts,
  isCorrect,
  makeRound,
  partsTotal,
  sameFraction,
  shadedFraction,
  shape,
  shapeRegions,
  uneven,
  type Fraction,
  type FractionShape,
  type HalvesRound,
  type ShapeForm,
} from '../games/halves-and-wholes';
import HalvesAndWholesGame from '../components/HalvesAndWholesGame';

afterEach(cleanup);

/**
 * The scorer that shipped: a rule about how the shape was CUT, not about how
 * much of it is shaded. Kept here — and nowhere in the product — so the tests
 * can show what it gets wrong.
 */
function legacyIsOneHalf(s: ShapeForm): boolean {
  return s.parts.length === 2 && hasEqualParts(s) && s.shaded === 1;
}

/**
 * Measure the area a path string actually encloses, from the string that goes
 * into the DOM. Straight segments by the shoelace formula; each arc adds the
 * circular segment between its chord and its curve. This is a second, geometric
 * reading of the picture — nothing here consults the `share` it was drawn from.
 */
function pathArea(d: string): number {
  const t = d.trim().split(/[\s,]+/);
  let i = 0;
  const num = (): number => {
    const v = Number(t[i]);
    i += 1;
    if (Number.isNaN(v)) throw new Error(`expected a number at token ${i - 1} of "${d}"`);
    return v;
  };
  const verts: [number, number][] = [];
  let cur: [number, number] = [0, 0];
  let start: [number, number] = [0, 0];
  let arcs = 0;
  while (i < t.length) {
    const cmd = t[i];
    i += 1;
    if (cmd === 'M' || cmd === 'L') {
      cur = [num(), num()];
      if (cmd === 'M') start = cur;
      verts.push(cur);
    } else if (cmd === 'A') {
      const r = num();
      num(); // ry
      num(); // x-axis rotation
      const large = num();
      const sweep = num();
      const to: [number, number] = [num(), num()];
      const chord = Math.hypot(to[0] - cur[0], to[1] - cur[1]);
      const small = 2 * Math.asin(Math.min(1, chord / (2 * r)));
      const theta = large ? 2 * Math.PI - small : small;
      arcs += (sweep ? 1 : -1) * 0.5 * r * r * (theta - Math.sin(theta));
      cur = to;
      verts.push(cur);
    } else if (cmd === 'Z' || cmd === 'z') {
      cur = start;
    } else {
      throw new Error(`unsupported path command ${cmd} in "${d}"`);
    }
  }
  let s = 0;
  for (let k = 0; k < verts.length; k += 1) {
    const [x0, y0] = verts[k];
    const [x1, y1] = verts[(k + 1) % verts.length];
    s += x0 * y1 - x1 * y0;
  }
  return Math.abs(0.5 * s + arcs);
}

const wholeArea = (kind: 'circle' | 'rect'): number =>
  kind === 'rect'
    ? SHAPE_GEOMETRY.rect.w * SHAPE_GEOMETRY.rect.h
    : Math.PI * SHAPE_GEOMETRY.circle.r ** 2;

const allOptions = HALVES_ROUNDS.flatMap((r) => r.options.map((o) => ({ round: r, o })));

describe('halves-and-wholes meta', () => {
  it('has the expected shared-contract shape', () => {
    expect(HALVES_AND_WHOLES_META.id).toBe('halves-and-wholes');
    expect(HALVES_AND_WHOLES_META.title.length).toBeGreaterThan(0);
    expect(HALVES_AND_WHOLES_META.icon.length).toBeGreaterThan(0);
    expect(HALVES_AND_WHOLES_META.color).toBe('berry');
    expect(HALVES_AND_WHOLES_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('exact fractions', () => {
  it('reduces and compares structurally', () => {
    expect(fr(2, 4)).toEqual({ num: 1, den: 2 });
    expect(fr(6, 8)).toEqual({ num: 3, den: 4 });
    expect(fr(0, 5)).toEqual({ num: 0, den: 1 });
    expect(sameFraction(fr(2, 4), fr(1, 2))).toBe(true);
    expect(sameFraction(fr(1, 3), fr(1, 2))).toBe(false);
  });

  it('adds without floating-point drift', () => {
    const third = fr(1, 3);
    expect(addFractions(addFractions(third, third), third)).toEqual({ num: 1, den: 1 });
    expect(addFractions(fr(1, 8), fr(1, 8))).toEqual({ num: 1, den: 4 });
  });

  it('rejects impossible fractions', () => {
    expect(() => fr(1, 0)).toThrow();
    expect(() => fr(1.5, 2)).toThrow();
  });
});

describe('a shape is scored by the area it shades', () => {
  it('sums the shaded parts exactly', () => {
    expect(shadedFraction(shape('rect', cut(4), 2))).toEqual({ num: 1, den: 2 });
    expect(shadedFraction(shape('circle', cut(6), 3))).toEqual({ num: 1, den: 2 });
    expect(shadedFraction(shape('circle', cut(8), 4))).toEqual({ num: 1, den: 2 });
    expect(shadedFraction(shape('rect', cut(3), 1))).toEqual({ num: 1, den: 3 });
    expect(shadedFraction(shape('rect', uneven(3, 7), 1))).toEqual({ num: 3, den: 10 });
    expect(shadedFraction(shape('rect', cut(2), 0))).toEqual({ num: 0, den: 1 });
    expect(shadedFraction(shape('rect', cut(1), 1))).toEqual({ num: 1, den: 1 });
  });

  it('derives equal-ness from the parts instead of storing it', () => {
    expect(hasEqualParts(shape('rect', cut(4), 1))).toBe(true);
    expect(hasEqualParts(shape('rect', uneven(3, 7), 1))).toBe(false);
  });

  it('keeps every option a whole shape', () => {
    for (const { o } of allOptions) {
      expect(partsTotal(o)).toEqual({ num: 1, den: 1 });
      expect(o.shaded).toBeGreaterThanOrEqual(0);
      expect(o.shaded).toBeLessThanOrEqual(o.parts.length);
    }
  });
});

describe('the picture and the score are the same object', () => {
  it("every region's painted area equals the share it was generated from", () => {
    for (const { o } of allOptions) {
      const regions = shapeRegions(o);
      const areas = regions.map((r) => pathArea(r.d));
      const total = areas.reduce((a, b) => a + b, 0);
      // The pieces tile the whole shape, with nothing spare and nothing missing.
      // Coordinates are emitted to three decimals, so agree to a part in 10,000.
      expect(Math.abs(total - wholeArea(o.kind)) / wholeArea(o.kind)).toBeLessThan(1e-4);
      regions.forEach((r, i) => {
        expect(areas[i] / total).toBeCloseTo(fractionValue(r.share), 4);
      });
    }
  });

  it('scores the fraction the child can measure off the drawing', () => {
    for (const { o } of allOptions) {
      const regions = shapeRegions(o);
      const areas = regions.map((r) => pathArea(r.d));
      const total = areas.reduce((a, b) => a + b, 0);
      const shadedArea = regions.reduce((sum, r, i) => sum + (r.shaded ? areas[i] : 0), 0);
      expect(shadedArea / total).toBeCloseTo(fractionValue(shadedFraction(o)), 4);
    }
  });

  it('marks exactly the first `shaded` pieces', () => {
    for (const { o } of allOptions) {
      const flags = shapeRegions(o).map((r) => r.shaded);
      expect(flags.filter(Boolean)).toHaveLength(o.shaded);
      expect(flags.slice(0, o.shaded).every(Boolean)).toBe(true);
      expect(flags.slice(o.shaded).some(Boolean)).toBe(false);
    }
  });

  it('draws in the palette from tokens.css, not a colour typed by hand', () => {
    const tokens = readFileSync('src/styles/tokens.css', 'utf8');
    const token = (name: string): string =>
      tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))![1];
    expect(HALVES_PALETTE.shade).toBe(token('terracotta'));
    expect(HALVES_PALETTE.blank).toBe(token('paper-raised'));
    expect(HALVES_PALETTE.line).toBe(token('ink-soft'));
  });
});

type Scorer = (round: HalvesRound, o: FractionShape) => boolean;

/** What the game marks now: the shaded area equals the area asked for. */
const byArea: Scorer = (round, o) => sameFraction(shadedFraction(o), round.target);

/** What the game marked before: cut in two, one piece filled. */
const byCut: Scorer = (_round, o) => legacyIsOneHalf(o);

const marked = (round: HalvesRound, score: Scorer): string[] =>
  round.options.filter((o) => score(round, o)).map((o) => o.id);

describe('every round has exactly one right answer under the scorer', () => {
  it('marks one option per round, and it is the answer', () => {
    for (const round of HALVES_ROUNDS) {
      expect(marked(round, byArea), `round ${round.id}`).toEqual([round.answerId]);
      expect(isCorrect(round, round.answerId)).toBe(true);
    }
  });

  it('fails when the scorer is reverted to isOneHalf: that rule marks no option at all in most rounds', () => {
    const same = HALVES_ROUNDS.filter((r) => marked(r, byCut).length === 1);
    // The assertion above, re-run with the old predicate, does not hold.
    expect(same.length).toBeLessThan(HALVES_ROUNDS.length);
    const blind = HALVES_ROUNDS.filter((r) => marked(r, byCut).length === 0).map((r) => r.id);
    expect(blind.length).toBeGreaterThanOrEqual(7);
    // Those rounds have real answers; the old rule simply cannot see them.
    for (const id of blind) {
      const round = HALVES_ROUNDS[id];
      expect(marked(round, byArea)).toEqual([round.answerId]);
    }
  });

  it('fails when the scorer is reverted to isOneHalf: that rule credits the wrong shape elsewhere', () => {
    const misled = HALVES_ROUNDS.filter(
      (r) => r.options.some((o) => byCut(r, o) && o.id !== r.answerId),
    ).map((r) => r.id);
    expect(misled.length).toBeGreaterThanOrEqual(3);
    for (const id of misled) expect(marked(HALVES_ROUNDS[id], byCut)).not.toContain(HALVES_ROUNDS[id].answerId);
  });

  it('disagrees with the old rule on most rounds, so a revert cannot pass quietly', () => {
    const disagree = HALVES_ROUNDS.filter(
      (r) => marked(r, byArea).join() !== marked(r, byCut).join(),
    );
    expect(disagree.length).toBeGreaterThanOrEqual(8);
  });

  it('answers by area that the old rule scored zero: two of four, three of six, four of eight', () => {
    const shapes = HALVES_ROUNDS.map((r) => r.options.find((o) => o.id === r.answerId)!)
      .filter((a) => sameFraction(shadedFraction(a), fr(1, 2)) && !legacyIsOneHalf(a));
    expect(shapes.length).toBeGreaterThanOrEqual(4);
    for (const a of shapes) expect(fractionValue(shadedFraction(a))).toBe(0.5);
  });
});

describe('the generator refuses a round it cannot mark', () => {
  const half = fr(1, 2);

  it('refuses two options that both match the target', () => {
    expect(() => makeRound({
      id: 99, target: half, answer: shape('rect', cut(2), 1),
      distractors: [shape('rect', cut(4), 2), shape('rect', cut(4), 1)],
    })).toThrow(/also shade/);
  });

  it('refuses an answer that does not match the target', () => {
    expect(() => makeRound({
      id: 99, target: half, answer: shape('rect', cut(3), 1),
      distractors: [shape('rect', cut(4), 1), shape('rect', cut(4), 3)],
    })).toThrow(/target/);
  });

  it('refuses pieces that do not add up to the whole shape', () => {
    expect(() => makeRound({
      id: 99, target: half, answer: { kind: 'rect', parts: [fr(1, 2), fr(1, 3)], shaded: 1 },
      distractors: [shape('rect', cut(4), 1), shape('rect', cut(4), 3)],
    })).toThrow(/add up to the whole/);
  });

  it('refuses a round with too few options', () => {
    expect(() => makeRound({
      id: 99, target: half, answer: shape('rect', cut(2), 1),
      distractors: [shape('rect', cut(4), 1)],
    })).toThrow(/distractors/);
  });

  it('derives the answer id from the placement instead of taking one on trust', () => {
    const round = makeRound({
      id: 7, target: half, answer: shape('circle', cut(4), 2),
      distractors: [shape('circle', cut(4), 1), shape('circle', cut(4), 3)],
    });
    const answer = round.options.find((o) => o.id === round.answerId)!;
    expect(shadedFraction(answer)).toEqual({ num: 1, den: 2 });
    expect(round.prompt).toBe('Which shape has one half shaded?');
  });
});

describe('where the answer sits', () => {
  it('does not park the answer in one slot', () => {
    const slots = HALVES_ROUNDS.map((r) => r.options.findIndex((o) => o.id === r.answerId));
    expect(slots.every((s) => s >= 0)).toBe(true);
    expect(new Set(slots).size).toBeGreaterThan(2);
    const counts = new Map<number, number>();
    for (const s of slots) counts.set(s, (counts.get(s) ?? 0) + 1);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(Math.ceil(HALVES_ROUNDS.length / 3) + 1);
  });

  it('accessors wrap by modulo and keep the answer', () => {
    for (let i = 0; i < HALVES_ROUNDS.length; i += 1) {
      expect(getHalvesOptions(i)).toBe(HALVES_ROUNDS[i].options);
      expect(getHalvesRound(i)).toBe(HALVES_ROUNDS[i]);
    }
    expect(getHalvesRound(HALVES_ROUNDS.length)).toBe(HALVES_ROUNDS[0]);
    expect(getHalvesOptions(HALVES_ROUNDS.length + 3)).toBe(HALVES_ROUNDS[3].options);
  });
});

describe('naming', () => {
  it('names fractions the way they are read', () => {
    const cases: [Fraction, string][] = [
      [fr(1, 2), 'one half'], [fr(1, 3), 'one third'], [fr(1, 4), 'one quarter'],
      [fr(3, 4), 'three quarters'], [fr(2, 3), 'two thirds'], [fr(3, 10), 'three tenths'],
      [fr(1, 1), 'the whole shape'], [fr(0, 1), 'nothing shaded'],
    ];
    for (const [f, name] of cases) expect(fractionName(f)).toBe(name);
  });

  it('describes a shape without naming its fraction', () => {
    expect(describeParts(shape('rect', cut(4), 2))).toBe('four equal pieces, two shaded');
    expect(describeParts(shape('rect', uneven(3, 7), 1))).toBe('two pieces of different sizes, one shaded');
    expect(describeParts(shape('rect', cut(2), 0))).toBe('two equal pieces, none shaded');
    expect(describeParts(shape('rect', cut(4), 4))).toBe('four equal pieces, all shaded');
    expect(describeParts(shape('circle', cut(1), 1))).toBe('one whole piece, shaded');
  });

  it('gives each option in a round a description of its own', () => {
    for (const round of HALVES_ROUNDS) {
      const said = round.options.map((o) => describeParts(o));
      expect(new Set(said).size, `round ${round.id}`).toBe(said.length);
    }
  });
});

describe('feedback', () => {
  const banned = /(wrong|incorrect|\bno\b|lose|fail|great|good job)/i;

  it('names what was picked and what was asked for, without grading the child', () => {
    for (const round of HALVES_ROUNDS) {
      for (const o of round.options) {
        const fb = getHalvesFeedback(round, o.id);
        expect(fb.length).toBeGreaterThan(0);
        expect(banned.test(fb), `${round.id}/${o.id}: ${fb}`).toBe(false);
        expect(fb).not.toContain('!');
        expect(fb.toLowerCase()).toContain(describeParts(o));
      }
    }
  });

  it('confirms the answer and repeats the target on a miss', () => {
    for (const round of HALVES_ROUNDS) {
      expect(getHalvesFeedback(round, round.answerId)).toContain('Correct.');
      const miss = round.options.find((o) => o.id !== round.answerId)!;
      const fb = getHalvesFeedback(round, miss.id);
      expect(fb).not.toContain('Correct.');
      expect(fb).toContain(fractionName(round.target));
    }
  });
});

/** Every fraction name the game can produce — none of these may reach a button. */
const FRACTION_NAMES = [
  ...new Set(
    allOptions
      .map(({ o }) => fractionName(shadedFraction(o)))
      .concat(HALVES_ROUNDS.map((r) => fractionName(r.target))),
  ),
];

/** The shaded share of a shape as drawn in the DOM, measured off the emitted paths. */
function shadedShareOf(svg: SVGElement): number {
  const paths = Array.from(svg.querySelectorAll('path'));
  const areas = paths.map((p) => pathArea(p.getAttribute('d')!));
  const total = areas.reduce((a, b) => a + b, 0);
  const shaded = paths.reduce(
    (sum, p, i) => sum + (p.getAttribute('data-shaded') === 'true' ? areas[i] : 0),
    0,
  );
  return shaded / total;
}

describe('the game as the child meets it', () => {
  it('paints each piece as one path, filled to match its own record', () => {
    const { container } = render(createElement(HalvesAndWholesGame));
    const round = HALVES_ROUNDS[0];

    expect(container.querySelector('.mini-game__prompt')!.textContent).toBe(round.prompt);
    expect(container.querySelector('.mini-game__emoji')!.textContent).toBe('½');

    const buttons = screen.getAllByRole('button', { name: /^Shape \d+: / });
    expect(buttons).toHaveLength(round.options.length);

    buttons.forEach((button, i) => {
      const paths = Array.from(button.querySelectorAll('path'));
      expect(paths).toHaveLength(round.options[i].parts.length);
      for (const p of paths) {
        const isShaded = p.getAttribute('data-shaded') === 'true';
        expect(p.getAttribute('fill')).toBe(isShaded ? HALVES_PALETTE.shade : HALVES_PALETTE.blank);
        expect(p.getAttribute('stroke')).toBe(HALVES_PALETTE.line);
      }
      expect(shadedShareOf(button.querySelector('svg')!)).toBeCloseTo(
        fractionValue(shadedFraction(round.options[i])), 4,
      );
    });
  });

  it('never lets a button name be the answer, and credits every round the scorer marks '
    + '— both fail if the scorer or the labels are reverted', async () => {
    const user = userEvent.setup();
    const { container } = render(createElement(HalvesAndWholesGame));

    for (let i = 0; i < HALVES_ROUNDS.length; i += 1) {
      const round = HALVES_ROUNDS[i];
      const where = `round ${round.id}`;
      expect(container.querySelector('.mini-game__prompt')!.textContent, where).toBe(round.prompt);

      const buttons = screen.getAllByRole('button', { name: /^Shape \d+: / });
      expect(buttons, where).toHaveLength(round.options.length);
      for (const button of buttons) {
        const name = button.getAttribute('aria-label')!;
        for (const fraction of FRACTION_NAMES) {
          expect(name, `${where}: "${name}" announces "${fraction}"`).not.toContain(fraction);
        }
      }

      const at = round.options.findIndex((o) => o.id === round.answerId);
      const answer = screen.getByRole('button', {
        name: `Shape ${at + 1}: ${describeParts(round.options[at])}`,
      });
      // What the child is looking at really is the target share of the shape.
      expect(shadedShareOf(answer.querySelector('svg')!), where)
        .toBeCloseTo(fractionValue(round.target), 4);

      await user.click(answer);
      expect(answer.className, where).toContain('is-correct');
      expect(container.querySelector('.mini-game__tally-count')!.textContent, where).toBe(String(i + 1));
      await user.click(screen.getByRole('button', { name: 'Next' }));
    }

    expect(container.querySelector('.mini-game__tally-count')!.textContent)
      .toBe(String(HALVES_ROUNDS.length));
  });

  it('keeps answered options reachable and states the result', async () => {
    const user = userEvent.setup();
    render(createElement(HalvesAndWholesGame));
    const round = HALVES_ROUNDS[0];
    const miss = round.options.findIndex((o) => o.id !== round.answerId);

    await user.click(screen.getByRole('button', {
      name: `Shape ${miss + 1}: ${describeParts(round.options[miss])}`,
    }));
    expect(screen.getByRole('status').textContent).toBe(getHalvesFeedback(round, round.options[miss].id));
    for (const b of screen.getAllByRole('button', { name: /^Shape \d+: / })) {
      expect(b).not.toBeDisabled();
      expect(b.getAttribute('aria-disabled')).toBe('true');
    }
  });
});

