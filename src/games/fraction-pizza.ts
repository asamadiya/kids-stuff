/**
 * Fractions as pieces taken off a plate.
 *
 * Two defects and a register problem produced this rewrite.
 *
 * 1. The picture contradicted the question. `leftRound` set `shaded = denom-1`
 *    and asked "Three slices got eaten. How much is left?", but the renderer
 *    drew an intact, fully-topped pie and its aria-label said "4 equal slices
 *    with 3 shaded". There was no absent state anywhere in the component: not
 *    one wedge, in any round, was ever drawn as gone.
 * 2. The exercise was not about fractions. Every round had a single-piece
 *    answer — machine-checked, `answer === '1/' + denom` in 14 of 14 rounds —
 *    and `getFractionOptions` ignored its argument and returned the same
 *    ['1/2','1/3','1/4'] every time. The winning strategy was: count the
 *    slices, press one-over-that. No fraction was ever read.
 * 3. It was a pizza with pepperoni, which is both meat and the western-candy
 *    register this guide exists to avoid.
 *
 * So: a round is `{denom, eaten}`, the pieces that are gone are drawn ABSENT
 * against a bare plate, `eaten` ranges over `1 .. denom-1`, and the question
 * asks for either the part that is gone or the part that is left. 2/3, 3/4 and
 * 2/4 are real answers. The food is a chapati, an apple or a wheel of cheese —
 * ovo-lacto-vegetarian, and better fraction objects than a pizza anyway,
 * because you cut them yourself and the cut is the whole point.
 *
 * The module id stays `fraction-pizza` because it is the key other modules
 * index this exercise by; nothing the child reads says pizza.
 *
 * Every surface — prompt, plate label, hint, feedback, spoken line, wedge
 * geometry and the absent flags — is returned by a function here that takes the
 * round record and nothing else.
 */
import { placeOptions } from './options';

export const FRACTIONPIZZA_META = {
  id: 'fraction-pizza',
  title: 'Fractions: Parts of One Whole',
  icon: '◔',
  color: 'sun',
  tagline: 'Halves, thirds and quarters. Count the pieces, then count the ones that are gone.',
} as const;

/* -------------------------------------------------------------- fractions -- */

export type Denom = 2 | 3 | 4;

export type FractionValue = '1/2' | '1/3' | '2/3' | '1/4' | '2/4' | '3/4';

export interface FractionInfo {
  readonly value: FractionValue;
  readonly num: number;
  readonly denom: Denom;
  /** Spoken name, e.g. "three quarters". */
  readonly word: string;
  /** The numeric amount. Used to keep two labels of equal value out of one round. */
  readonly amount: number;
}

/** Piece names, both forms written out. Nothing here appends or strips an "s". */
const PIECE_WORD: Record<Denom, { readonly one: string; readonly many: string }> = {
  2: { one: 'half', many: 'halves' },
  3: { one: 'third', many: 'thirds' },
  4: { one: 'quarter', many: 'quarters' },
};

const COUNT_WORD: readonly string[] = ['zero', 'one', 'two', 'three', 'four'];

function describe(num: number, denom: Denom): string {
  const piece = PIECE_WORD[denom];
  return `${COUNT_WORD[num]} ${num === 1 ? piece.one : piece.many}`;
}

function info(num: number, denom: Denom): FractionInfo {
  return {
    value: `${num}/${denom}` as FractionValue,
    num,
    denom,
    word: describe(num, denom),
    amount: num / denom,
  };
}

/**
 * Every proper fraction this exercise can name. Generated, not typed out, so a
 * label and its word and its value cannot disagree.
 */
export const FRACTIONS: readonly FractionInfo[] = ([2, 3, 4] as const).flatMap((denom) =>
  Array.from({ length: denom - 1 }, (_, i) => info(i + 1, denom)),
);

export function fractionInfo(value: FractionValue): FractionInfo {
  const found = FRACTIONS.find((f) => f.value === value);
  // `value` is always one of the six generated literals, so this is total.
  return found ?? FRACTIONS[0];
}

/* ------------------------------------------------------------------- food -- */

export type FoodId = 'chapati' | 'apple' | 'cheese';

export interface Food {
  readonly id: FoodId;
  /** How the prompt names it, article included: "A chapati", "An apple". */
  readonly named: string;
  /** How the plate label names it, capitalised: "Chapati". */
  readonly titled: string;
  /** Both plural forms written out. */
  readonly piece: string;
  readonly pieces: string;
  /** Fill of a piece that is still there, and the colour of its edge. */
  readonly fill: string;
  readonly rim: string;
}

/**
 * Colours are sampled from `src/styles/tokens.css` — ochre #8a6416 and
 * terracotta #9e4b27 for edges, warm neutrals for the flesh. Nothing here is
 * saturated; the plate is `--paper-sunken` and the missing pieces show it.
 */
export const FOODS: readonly Food[] = [
  {
    id: 'chapati',
    named: 'A chapati',
    titled: 'Chapati',
    piece: 'piece',
    pieces: 'pieces',
    fill: '#ddc79c',
    rim: '#8a6416',
  },
  {
    id: 'apple',
    named: 'An apple',
    titled: 'Apple',
    piece: 'wedge',
    pieces: 'wedges',
    // Cut apple flesh is nearly the colour of the plate, so it is lifted well
    // clear of --paper-sunken: a piece that is there has to read as there.
    fill: '#f9f3e6',
    rim: '#9e4b27',
  },
  {
    id: 'cheese',
    named: 'A wheel of cheese',
    titled: 'Wheel of cheese',
    piece: 'piece',
    pieces: 'pieces',
    fill: '#e8d49b',
    rim: '#b08d3a',
  },
] as const;

export function foodOf(id: FoodId): Food {
  return FOODS.find((f) => f.id === id) ?? FOODS[0];
}

/* ----------------------------------------------------------------- rounds -- */

/** Which part of the plate the question is about. */
export type RoundKind = 'gone' | 'left';

export interface PlateRound {
  readonly id: number;
  readonly food: FoodId;
  /** Equal pieces the whole was cut into. */
  readonly denom: Denom;
  /** Pieces that are gone. Always `1 .. denom - 1`, so the plate is never full or empty. */
  readonly eaten: number;
  readonly kind: RoundKind;
}

/** The part that is gone, as a fraction. */
export function goneFraction(round: PlateRound): FractionInfo {
  return info(round.eaten, round.denom);
}

/** The part still on the plate, as a fraction. */
export function leftFraction(round: PlateRound): FractionInfo {
  return info(round.denom - round.eaten, round.denom);
}

/** The answer to the question this round actually asks. */
export function roundAnswer(round: PlateRound): FractionInfo {
  return round.kind === 'gone' ? goneFraction(round) : leftFraction(round);
}

/** "3 pieces are gone" / "1 wedge is gone" — both forms written out. */
function goneClause(round: PlateRound): string {
  const food = foodOf(round.food);
  return round.eaten === 1
    ? `1 ${food.piece} is gone`
    : `${round.eaten} ${food.pieces} are gone`;
}

/**
 * The question. Both numbers of the record appear as digits, in order, so a
 * test can read them straight back out of the rendered text.
 */
export function roundPrompt(round: PlateRound): string {
  const food = foodOf(round.food);
  return `${food.named} was cut into ${round.denom} equal ${food.pieces}. ${goneClause(round)}. What fraction is ${round.kind}?`;
}

/** The accessible name of the plate. Same two numbers, same order. */
export function roundLabel(round: PlateRound): string {
  const food = foodOf(round.food);
  return `${food.titled} on a plate, cut into ${round.denom} equal ${food.pieces}, ${round.eaten} gone`;
}

export function roundHint(): string {
  return 'Count all the pieces, then count the ones that are gone.';
}

/** Read aloud. The prompt is already plain words and digits. */
export function roundSpoken(round: PlateRound): string {
  return roundPrompt(round);
}

/**
 * The six distinct plates. `eaten` runs the full open range for each cut, which
 * is what makes 2/3, 2/4 and 3/4 reachable at all.
 */
const PLATES: readonly { readonly denom: Denom; readonly eaten: number }[] = ([2, 3, 4] as const)
  .flatMap((denom) => Array.from({ length: denom - 1 }, (_, i) => ({ denom, eaten: i + 1 })));

/**
 * Every plate against every food, walked so that consecutive rounds differ in
 * how the whole was cut, and so that each plate is asked about both ways.
 * 6 plates x 3 foods = 18 rounds, each pairing used exactly once.
 */
function everyRound(): readonly PlateRound[] {
  return Array.from({ length: PLATES.length * FOODS.length }, (_, i) => {
    const plate = i % PLATES.length;
    const food = (i + Math.floor(i / PLATES.length)) % FOODS.length;
    return {
      id: i + 1,
      food: FOODS[food].id,
      denom: PLATES[plate].denom,
      eaten: PLATES[plate].eaten,
      kind: ((plate + food) % 2 === 0 ? 'gone' : 'left') as RoundKind,
    };
  });
}

export const FRACTION_ROUNDS: readonly PlateRound[] = everyRound();

/* ---------------------------------------------------------------- options -- */

export const FRACTION_OPTION_COUNT = 4;

/**
 * Distractors as named mistakes.
 *
 * Every candidate is filtered so that no two options in a round have the same
 * numeric value. That is not tidiness: 2/4 and 1/2 are the same amount, so an
 * unfiltered list could offer two correct answers and mark one of them wrong —
 * the defect that halves-and-wholes shipped. Filtering by `amount` makes that
 * state unrepresentable rather than merely unlikely.
 */
function misconceptions(round: PlateRound): readonly FractionInfo[] {
  const answer = roundAnswer(round);
  const other = round.kind === 'gone' ? leftFraction(round) : goneFraction(round);
  const candidates: FractionInfo[] = [
    // Answered the other half of the question: named what is left, not what is gone.
    other,
    // Miscounted the pieces that are gone by one, either way.
    ...(answer.num + 1 < answer.denom ? [info(answer.num + 1, answer.denom)] : []),
    ...(answer.num - 1 >= 1 ? [info(answer.num - 1, answer.denom)] : []),
    // The old reflex: one piece over the number of pieces, whatever the question.
    info(1, round.denom),
    // Right numerator, wrong cut.
    ...FRACTIONS.filter((f) => f.num === answer.num && f.denom !== answer.denom),
    // Backstop: the rest of the fractions, in canonical order.
    ...FRACTIONS,
  ];

  const out: FractionInfo[] = [];
  for (const c of candidates) {
    if (out.length >= FRACTION_OPTION_COUNT - 1) break;
    if (c.amount === answer.amount) continue;
    if (out.some((o) => o.amount === c.amount)) continue;
    out.push(c);
  }
  return out;
}

/**
 * Exactly FRACTION_OPTION_COUNT labels, containing the answer once, no two of
 * the same value, placed by identity only.
 */
export function getFractionOptions(index: number): readonly FractionValue[] {
  const roundIndex =
    ((index % FRACTION_ROUNDS.length) + FRACTION_ROUNDS.length) % FRACTION_ROUNDS.length;
  const round = FRACTION_ROUNDS[roundIndex];
  return placeOptions({
    gameId: FRACTIONPIZZA_META.id,
    roundIndex,
    answer: roundAnswer(round).value,
    distractors: misconceptions(round).map((f) => f.value),
    count: FRACTION_OPTION_COUNT,
  });
}

/* --------------------------------------------------------------- geometry -- */

export const PLATE = { cx: 60, cy: 60, food: 46, plate: 54, size: 120 } as const;

export interface Wedge {
  readonly index: number;
  /** The wedge outline, as an SVG path. */
  readonly d: string;
  /** True when this piece has been taken and the bare plate shows through. */
  readonly absent: boolean;
}

/**
 * The pieces, generated from the round.
 *
 * `absent` travels with the path that describes it, so a renderer cannot draw
 * one set of wedges and flag a different set as gone. The first `eaten` pieces
 * clockwise from the top are the ones taken.
 */
export function plateWedges(round: PlateRound): readonly Wedge[] {
  const { cx, cy, food: r } = PLATE;
  return Array.from({ length: round.denom }, (_, i) => {
    const a0 = (i / round.denom) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / round.denom) * Math.PI * 2 - Math.PI / 2;
    const x0 = (cx + r * Math.cos(a0)).toFixed(2);
    const y0 = (cy + r * Math.sin(a0)).toFixed(2);
    const x1 = (cx + r * Math.cos(a1)).toFixed(2);
    const y1 = (cy + r * Math.sin(a1)).toFixed(2);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return {
      index: i,
      d: `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`,
      absent: i < round.eaten,
    };
  });
}

/* --------------------------------------------------------------- feedback -- */

/**
 * States both parts every time, because the pair is the lesson: three quarters
 * gone is one quarter left, and a child who answered the other half of the
 * question can see exactly which half he answered.
 */
export function getFractionFeedback(round: PlateRound, selected: FractionValue): string {
  const food = foodOf(round.food);
  const gone = goneFraction(round);
  const left = leftFraction(round);
  const answer = roundAnswer(round);
  const verb = round.eaten === 1 ? 'is' : 'are';
  const reading = `${round.eaten} of ${round.denom} ${food.pieces} ${verb} gone: ${gone.word} gone, ${left.word} left.`;
  if (fractionInfo(selected).amount === answer.amount) {
    return `Correct. ${reading}`;
  }
  return `${reading} The fraction ${round.kind} is ${answer.word}, ${answer.value}.`;
}
