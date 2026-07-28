import { placeOptions } from './options';

/**
 * Halves and Wholes — what fraction of a shape is shaded, measured as area.
 *
 * The first version scored a shape by how it had been *cut*:
 * `parts === 2 && equal && shaded === 1`. The renderer, meanwhile, filled the
 * first `shaded` of `parts` equal cells, so the shaded *area* was always
 * `shaded / parts`. The two never had to agree, and they did not: a rectangle
 * in four equal cells with two filled is exactly the left half of the
 * rectangle, and the game scored it zero. One round marked a correct answer
 * wrong for that reason.
 *
 * So the shape is no longer described by "how many parts" plus a boolean. A
 * shape is a list of part *shares* — exact rationals that must sum to one — and
 * both the painted geometry and the score are derived from that one list:
 *
 *   shapeRegions(shape)  →  each region's path is generated FROM its share
 *   shadedFraction(shape) →  the exact sum of the shaded shares
 *
 * A region's painted area is its share by construction (a rectangle slab of
 * width `share * W`, or a circular sector of angle `share * 2π`), so the score
 * measures the picture. `src/test/halves-and-wholes.test.ts` re-measures the
 * emitted path strings geometrically and checks them against the shares, so the
 * two cannot drift apart unnoticed.
 *
 * `makeRound` refuses to build a round in which more than one option matches
 * the target, and derives `answerId` rather than accepting one, so a round with
 * two right answers — or with an answer key pointing at the wrong shape — is
 * not representable.
 */

export const HALVES_AND_WHOLES_META = {
  id: 'halves-and-wholes',
  title: 'Halves and Wholes',
  icon: '½',
  color: 'berry',
  tagline: 'One half is half the area, however many pieces the shape is cut into.',
} as const;

export type ShapeKind = 'circle' | 'rect';

/** An exact rational. Always stored reduced, so equality is structural. */
export interface Fraction {
  readonly num: number;
  readonly den: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/** Build a reduced fraction. Denominator must be positive. */
export function fr(num: number, den: number): Fraction {
  if (!Number.isInteger(num) || !Number.isInteger(den)) {
    throw new Error(`fraction needs integers, got ${num}/${den}`);
  }
  if (den <= 0) throw new Error(`fraction needs a positive denominator, got ${den}`);
  if (num === 0) return { num: 0, den: 1 };
  const g = gcd(num, den) || 1;
  return { num: num / g, den: den / g };
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  return fr(a.num * b.den + b.num * a.den, a.den * b.den);
}

export function sameFraction(a: Fraction, b: Fraction): boolean {
  return a.num === b.num && a.den === b.den;
}

export function fractionValue(f: Fraction): number {
  return f.num / f.den;
}

/** A shape before it is placed in a round: the pieces it is cut into, and how many are shaded. */
export interface ShapeForm {
  readonly kind: ShapeKind;
  /** Each piece's share of the whole, in drawing order. Must sum to exactly 1. */
  readonly parts: readonly Fraction[];
  /** The first `shaded` pieces are filled. */
  readonly shaded: number;
}

/** A shape as shown in a round. The id is assigned by `makeRound`, never typed by hand. */
export interface FractionShape extends ShapeForm {
  readonly id: string;
}

/** `n` pieces of the same size. */
export function cut(n: number): Fraction[] {
  if (!Number.isInteger(n) || n < 1) throw new Error(`cut needs a positive whole number, got ${n}`);
  return Array.from({ length: n }, () => fr(1, n));
}

/** Two pieces in the ratio a : b — a shape divided, but not fairly. */
export function uneven(a: number, b: number): Fraction[] {
  if (a <= 0 || b <= 0) throw new Error(`uneven needs two positive parts, got ${a}:${b}`);
  return [fr(a, a + b), fr(b, a + b)];
}

/** The total of every part. Exactly 1 for any shape that is allowed into a round. */
export function partsTotal(s: ShapeForm): Fraction {
  return s.parts.reduce((sum, p) => addFractions(sum, p), fr(0, 1));
}

/** The exact fraction of the shape's area that is shaded. This is the score. */
export function shadedFraction(s: ShapeForm): Fraction {
  return s.parts.slice(0, s.shaded).reduce((sum, p) => addFractions(sum, p), fr(0, 1));
}

/** True when every piece is the same size. Derived — never stored alongside the parts. */
export function hasEqualParts(s: ShapeForm): boolean {
  return s.parts.every((p) => sameFraction(p, s.parts[0]));
}

export function shape(kind: ShapeKind, parts: readonly Fraction[], shaded: number): ShapeForm {
  return { kind, parts, shaded };
}

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
];

function word(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

const UNIT_NAMES: Record<number, string> = {
  2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth',
  6: 'sixth', 8: 'eighth', 10: 'tenth', 12: 'twelfth',
};
const UNIT_PLURALS: Record<number, string> = { 2: 'halves' };

/** The name of a fraction: 1/2 is "one half", 3/4 is "three quarters", 1/1 is "the whole shape". */
export function fractionName(f: Fraction): string {
  if (f.num === 0) return 'nothing shaded';
  if (f.num === f.den) return 'the whole shape';
  const unit = UNIT_NAMES[f.den];
  if (!unit) return `${f.num} of ${f.den}`;
  if (f.num === 1) return `one ${unit}`;
  return `${word(f.num)} ${UNIT_PLURALS[f.den] ?? `${unit}s`}`;
}

/**
 * What the shape looks like, in the same terms a child reading the picture has
 * to work with: how many pieces, whether they match, how many are filled.
 *
 * Deliberately not the fraction's name. The button's accessible name used to be
 * `Shape 2: one half`, so in all thirteen rounds exactly one button announced
 * the answer and read-aloud spoke it. A listener should get the same raw
 * evidence a viewer gets, and do the same arithmetic on it.
 */
export function describeParts(s: ShapeForm): string {
  const n = s.parts.length;
  if (n === 1) return s.shaded === 1 ? 'one whole piece, shaded' : 'one whole piece, not shaded';
  const pieces = hasEqualParts(s)
    ? `${word(n)} equal pieces`
    : `${word(n)} pieces of different sizes`;
  if (s.shaded === 0) return `${pieces}, none shaded`;
  if (s.shaded === n) return `${pieces}, all shaded`;
  return `${pieces}, ${word(s.shaded)} shaded`;
}

function sentence(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * The drawing surface. Both shapes are centred in the same square box so a row
 * of options lines up whatever the mix of circles and rectangles.
 */
export const SHAPE_GEOMETRY = {
  box: 88,
  rect: { x: 6, y: 16, w: 76, h: 56 },
  circle: { cx: 44, cy: 44, r: 34 },
} as const;

/**
 * Ink sampled from `src/styles/tokens.css` — terracotta on raised paper, in
 * ink-soft line. The test asserts these still equal the tokens, so the shapes
 * cannot quietly drift out of the palette.
 */
export const HALVES_PALETTE = {
  shade: '#9e4b27', // --terracotta
  blank: '#fbf9f4', // --paper-raised
  line: '#4b4739', // --ink-soft
} as const;

/** One painted piece of a shape: the path drawn, and the share of the whole it covers. */
export interface Region {
  readonly key: string;
  /** SVG path data. Its geometric area is `share` of the shape's area, by construction. */
  readonly d: string;
  readonly share: Fraction;
  readonly shaded: boolean;
}

/** Three decimals is finer than a device pixel at this size and keeps the path readable. */
function fmt(n: number): string {
  return String(Math.round(n * 1000) / 1000);
}

function rectRegion(from: number, to: number): string {
  const { x, y, w, h } = SHAPE_GEOMETRY.rect;
  const x0 = x + w * from;
  const x1 = x + w * to;
  const y1 = y + h;
  return `M ${fmt(x0)} ${fmt(y)} L ${fmt(x1)} ${fmt(y)} L ${fmt(x1)} ${fmt(y1)} L ${fmt(x0)} ${fmt(y1)} Z`;
}

function wedgeRegion(from: number, to: number): string {
  const { cx, cy, r } = SHAPE_GEOMETRY.circle;
  // A whole circle has no chord to draw to, so it is two half-turn arcs.
  if (to - from >= 1) {
    return `M ${fmt(cx - r)} ${fmt(cy)} A ${r} ${r} 0 0 1 ${fmt(cx + r)} ${fmt(cy)} `
      + `A ${r} ${r} 0 0 1 ${fmt(cx - r)} ${fmt(cy)} Z`;
  }
  const a0 = -Math.PI / 2 + 2 * Math.PI * from;
  const a1 = -Math.PI / 2 + 2 * Math.PI * to;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${fmt(cx)} ${fmt(cy)} L ${fmt(x0)} ${fmt(y0)} `
    + `A ${r} ${r} 0 ${large} 1 ${fmt(x1)} ${fmt(y1)} Z`;
}

/**
 * The pieces to paint, in drawing order. Geometry and score come out of the
 * same `share` value: a slab is `share` of the width, a sector is `share` of the
 * turn, so painted area and scored area are the same number.
 */
export function shapeRegions(s: ShapeForm): readonly Region[] {
  const out: Region[] = [];
  let before = fr(0, 1);
  for (let i = 0; i < s.parts.length; i += 1) {
    const share = s.parts[i];
    const after = addFractions(before, share);
    const from = fractionValue(before);
    const to = fractionValue(after);
    out.push({
      key: `p${i}`,
      d: s.kind === 'rect' ? rectRegion(from, to) : wedgeRegion(from, to),
      share,
      shaded: i < s.shaded,
    });
    before = after;
  }
  return out;
}

export interface HalvesRound {
  readonly id: number;
  /** Derived from the target, so the question and the scoring cannot disagree. */
  readonly prompt: string;
  readonly target: Fraction;
  readonly options: readonly FractionShape[];
  /** Derived: the one option whose shaded area equals the target. */
  readonly answerId: string;
}

function promptFor(target: Fraction): string {
  if (target.num === target.den) return 'Which shape is shaded all the way?';
  return `Which shape has ${fractionName(target)} shaded?`;
}

function checkForm(form: ShapeForm, where: string): void {
  if (form.parts.length < 1) throw new Error(`${where}: a shape needs at least one piece`);
  if (!Number.isInteger(form.shaded) || form.shaded < 0 || form.shaded > form.parts.length) {
    throw new Error(`${where}: shaded must be 0..${form.parts.length}, got ${form.shaded}`);
  }
  const total = partsTotal(form);
  if (total.num !== total.den) {
    throw new Error(`${where}: pieces must add up to the whole, got ${total.num}/${total.den}`);
  }
}

/**
 * Build a round, or refuse to.
 *
 * Two options that both match the target would make one of them unmarkable, and
 * that is exactly what shipped: three rounds carried a second figure that was
 * half by area. The check runs at module load, so such a round cannot reach the
 * child — the import throws instead.
 */
export function makeRound(spec: {
  readonly id: number;
  readonly target: Fraction;
  readonly answer: ShapeForm;
  readonly distractors: readonly ShapeForm[];
}): HalvesRound {
  const { id, target, answer, distractors } = spec;
  const where = `round ${id}`;
  checkForm(answer, `${where} answer`);
  distractors.forEach((d, i) => checkForm(d, `${where} distractor ${i}`));

  if (!sameFraction(shadedFraction(answer), target)) {
    const got = shadedFraction(answer);
    throw new Error(`${where}: answer shades ${got.num}/${got.den}, target is ${target.num}/${target.den}`);
  }
  const rivals = distractors.filter((d) => sameFraction(shadedFraction(d), target));
  if (rivals.length > 0) {
    throw new Error(`${where}: ${rivals.length} distractor(s) also shade ${target.num}/${target.den}`);
  }
  if (distractors.length < 2 || distractors.length > 3) {
    throw new Error(`${where}: needs 2 or 3 distractors, got ${distractors.length}`);
  }

  const placed = placeOptions({
    gameId: HALVES_AND_WHOLES_META.id,
    roundIndex: id,
    answer,
    distractors,
    count: distractors.length + 1,
  });
  const options = placed.map((form, i) => ({ ...form, id: `r${id}-${i}` }));
  const answerAt = placed.indexOf(answer);
  return { id, prompt: promptFor(target), target, options, answerId: options[answerAt].id };
}

const circleOf = (parts: Fraction[], shaded: number): ShapeForm => shape('circle', parts, shaded);
const rectOf = (parts: Fraction[], shaded: number): ShapeForm => shape('rect', parts, shaded);

/**
 * Fourteen rounds. Several answers are deliberately *not* "cut in two, one
 * shaded" — two of four, three of six, four of eight — because those are one
 * half too, and the old scorer marked every one of them zero. Several rounds
 * whose target is not a half carry a two-equal-pieces-one-shaded distractor,
 * which the old scorer would have marked correct.
 */
export const HALVES_ROUNDS: readonly HalvesRound[] = [
  makeRound({ id: 0, target: fr(1, 2), answer: circleOf(cut(2), 1),
    distractors: [circleOf(cut(3), 1), circleOf(cut(4), 1)] }),
  makeRound({ id: 1, target: fr(1, 2), answer: rectOf(cut(4), 2),
    distractors: [rectOf(uneven(3, 7), 1), rectOf(cut(4), 1)] }),
  makeRound({ id: 2, target: fr(1, 2), answer: circleOf(cut(2), 1),
    distractors: [circleOf(cut(4), 1), rectOf(cut(3), 1)] }),
  makeRound({ id: 3, target: fr(1, 2), answer: rectOf(cut(6), 3),
    distractors: [rectOf(uneven(3, 7), 1), rectOf(cut(4), 1)] }),
  makeRound({ id: 4, target: fr(1, 4), answer: circleOf(cut(4), 1),
    distractors: [circleOf(cut(2), 1), circleOf(cut(3), 1), circleOf(cut(8), 3)] }),
  makeRound({ id: 5, target: fr(1, 2), answer: rectOf(cut(2), 1),
    distractors: [rectOf(cut(2), 2), rectOf(cut(2), 0), rectOf(uneven(3, 7), 1)] }),
  makeRound({ id: 6, target: fr(3, 4), answer: rectOf(cut(4), 3),
    distractors: [rectOf(cut(4), 2), rectOf(cut(4), 1)] }),
  makeRound({ id: 7, target: fr(1, 2), answer: circleOf(cut(6), 3),
    distractors: [circleOf(cut(6), 2), circleOf(cut(6), 1), circleOf(cut(6), 4)] }),
  makeRound({ id: 8, target: fr(1, 1), answer: circleOf(cut(1), 1),
    distractors: [circleOf(cut(2), 1), circleOf(cut(4), 3)] }),
  makeRound({ id: 9, target: fr(1, 3), answer: rectOf(cut(3), 1),
    distractors: [rectOf(cut(4), 1), rectOf(cut(2), 1)] }),
  makeRound({ id: 10, target: fr(1, 2), answer: circleOf(cut(2), 1),
    distractors: [circleOf(uneven(3, 7), 1), circleOf(cut(2), 0)] }),
  makeRound({ id: 11, target: fr(1, 2), answer: rectOf(cut(4), 2),
    distractors: [rectOf(cut(4), 1), rectOf(cut(4), 3), rectOf(cut(4), 4)] }),
  makeRound({ id: 12, target: fr(1, 4), answer: rectOf(cut(8), 2),
    distractors: [rectOf(cut(8), 4), rectOf(cut(8), 1), rectOf(cut(4), 2)] }),
  makeRound({ id: 13, target: fr(1, 2), answer: circleOf(cut(8), 4),
    distractors: [circleOf(cut(8), 2), circleOf(cut(3), 1), circleOf(uneven(3, 7), 1)] }),
];

export function getHalvesRound(index: number): HalvesRound {
  return HALVES_ROUNDS[index % HALVES_ROUNDS.length];
}

export function getHalvesOptions(index: number): readonly FractionShape[] {
  return getHalvesRound(index).options;
}

/**
 * The scorer. A pick is right when the area it shades is the target area —
 * measured from the same part list the picture is painted from.
 */
export function isCorrect(round: HalvesRound, optionId: string): boolean {
  const picked = round.options.find((o) => o.id === optionId);
  return picked !== undefined && sameFraction(shadedFraction(picked), round.target);
}

/** Names what was picked and what was asked for. States the result; does not grade the child. */
export function getHalvesFeedback(round: HalvesRound, selectedId: string): string {
  const picked = round.options.find((o) => o.id === selectedId);
  const answer = round.options.find((o) => o.id === round.answerId);
  if (!picked || !answer) return `${sentence(fractionName(round.target))} is the target.`;
  if (isCorrect(round, selectedId)) {
    return `Correct. ${sentence(describeParts(picked))}: that is ${fractionName(round.target)}.`;
  }
  return `${sentence(describeParts(picked))}: that is ${fractionName(shadedFraction(picked))}. `
    + `The one with ${describeParts(answer)} is ${fractionName(round.target)}.`;
}
