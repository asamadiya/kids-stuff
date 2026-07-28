/**
 * Multiplication as an array of dots.
 *
 * The defect this file was rewritten to remove: three text surfaces owned the
 * same fact and nothing arbitrated between them. The round was `{a, b}`; the
 * drawing loop laid out `a` rows of `b` dots; the SVG's aria-label said "5 rows
 * of 3 dots"; the hint said "Count by 5s, 3 times" and the feedback said
 * "That's 3 groups of 5". A sighted child scanned rows of three while being
 * told to count by fives, and a voice user heard the two descriptions back to
 * back with no picture to arbitrate. Fourteen of fifteen rounds were
 * non-square, so the disagreement was visible in nearly all of them.
 *
 * A 5x3 array does legitimately depict both readings — that is commutativity,
 * not an error of fact. The error was that the semantics were never pinned.
 *
 * They are pinned here, once:
 *
 *     a round is `groups` groups, each holding `per` things.
 *     ONE ROW OF THE DRAWING IS ONE GROUP.
 *
 * Therefore rows = `groups`, dots along a row = `per`, and you skip-count by
 * `per`, `groups` times. Every string the child can read or hear — question,
 * array label, hint, feedback, spoken line — and the dot geometry itself come
 * from functions in this file that take the round record and nothing else.
 * There is no second author left to fall out of step with.
 */
import { placeOptions } from './options';

export const TIMES_TABLES_META = {
  id: 'times-tables',
  title: 'Multiplication: 2s, 3s, 4s, 5s, 10s',
  icon: '✖',
  color: 'sun',
  tagline: 'Rows of dots. One row is one group; count by the row.',
} as const;

/**
 * The whole round. `groups` rows are drawn, each holding `per` dots.
 *
 * The old field names `a` and `b` carried no semantics, which is how the three
 * surfaces came to disagree: nothing in `{a: 5, b: 3}` says which one is the
 * row. These names cannot be read two ways.
 */
export interface TimesRound {
  /** How many groups there are. Drawn as rows. */
  readonly groups: number;
  /** How many things are in each group. Drawn as the dots along one row. */
  readonly per: number;
}

/** The one true answer for a round. */
export function timesProduct(round: TimesRound): number {
  return round.groups * round.per;
}

/** Written as it is drawn and as it is counted: groups first, then group size. */
export function timesQuestion(round: TimesRound): string {
  return `${round.groups} × ${round.per} = ?`;
}

/** The accessible name of the dot array. Rows are groups; this says so. */
export function timesArrayLabel(round: TimesRound): string {
  return `${round.groups} rows of ${round.per} dots`;
}

/** Plural for a bare count of repetitions, written out. No string surgery at call sites. */
function times(n: number): string {
  return n === 1 ? '1 time' : `${n} times`;
}

/** You step by the size of a group, once per group. */
export function timesHint(round: TimesRound): string {
  return `Count by ${round.per}s, ${times(round.groups)}.`;
}

/** What the synthesiser reads. "×" is not reliably spoken, so it is spelled out. */
export function timesSpoken(round: TimesRound): string {
  return `${round.groups} times ${round.per}. Count by ${round.per}s, ${times(round.groups)}.`;
}

/* --------------------------------------------------------------- geometry -- */

export interface Dot {
  readonly row: number;
  readonly col: number;
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
}

export interface DotArray {
  readonly width: number;
  readonly height: number;
  readonly rows: number;
  readonly cols: number;
  readonly label: string;
  readonly dots: readonly Dot[];
}

/**
 * One cell per dot, the same size in every round. A unit is a unit: scaling the
 * array to fill the stage would make a dot in a 2x3 round three times the area
 * of a dot in a 9x10 one, and the whole model rests on them being one thing
 * each. The array grows instead, and the component lets it shrink to fit.
 */
const CELL = 26;
const PAD = 8;

/**
 * The picture, generated from the round.
 *
 * The label ships inside the same object as the circles, so a component cannot
 * render one round's dots under another round's accessible name: it gets both
 * from one call or neither.
 */
export function dotArray(round: TimesRound): DotArray {
  const dots: Dot[] = [];
  for (let row = 0; row < round.groups; row += 1) {
    for (let col = 0; col < round.per; col += 1) {
      dots.push({
        row,
        col,
        cx: PAD + col * CELL + CELL / 2,
        cy: PAD + row * CELL + CELL / 2,
        r: CELL / 2 - 3,
      });
    }
  }
  return {
    width: PAD * 2 + round.per * CELL,
    height: PAD * 2 + round.groups * CELL,
    rows: round.groups,
    cols: round.per,
    label: timesArrayLabel(round),
    dots,
  };
}

/* ----------------------------------------------------------------- rounds -- */

/**
 * The tables, as ladders.
 *
 * The old set was 2s, 5s and 10s — precisely the three you can reach by
 * skip-counting on your fingers, which is to say the three that do not need a
 * table. 3s and 4s are the ones worth drilling, so they are here, and the
 * ladders are interleaved rather than blocked: consecutive rounds come from
 * different tables, which is harder and is the point.
 */
const LADDERS: readonly { readonly per: number; readonly groups: readonly number[] }[] = [
  { per: 2, groups: [3, 6, 8, 9] },
  { per: 3, groups: [2, 4, 6, 7, 9] },
  { per: 4, groups: [2, 3, 5, 7, 8] },
  { per: 5, groups: [2, 4, 6, 7, 9] },
  { per: 10, groups: [3, 5, 6, 8] },
] as const;

/** The five tables covered, in order. Exported so tests read this, not a literal. */
export const TIMES_TABLE_FAMILIES: readonly number[] = LADDERS.map((l) => l.per);

function interleaved(): readonly TimesRound[] {
  const out: TimesRound[] = [];
  const deepest = Math.max(...LADDERS.map((l) => l.groups.length));
  for (let rung = 0; rung < deepest; rung += 1) {
    for (const ladder of LADDERS) {
      if (rung < ladder.groups.length) out.push({ groups: ladder.groups[rung], per: ladder.per });
    }
  }
  return out;
}

export const TIMES_ROUNDS: readonly TimesRound[] = interleaved();

/** Fixed number of options every round so the layout never jumps. */
export const TIMES_OPTION_COUNT = 4;

/* ---------------------------------------------------------------- options -- */

/**
 * Distractors as named mistakes, in order of how much each one teaches.
 *
 * They are never sorted. Sorting a set built as `answer ± k` pins the answer to
 * the middle slot forever, which is how this exercise came to put the correct
 * button at index 1 in 15 of 15 rounds. Placement is delegated to
 * `placeOptions`, which keys on identity only.
 */
function misconceptions(round: TimesRound): readonly number[] {
  const product = timesProduct(round);
  return [
    // Counted one group too many, or stopped one group short.
    (round.groups + 1) * round.per,
    (round.groups - 1) * round.per,
    // Added the two numbers instead of multiplying them.
    round.groups + round.per,
    // Lost or gained a single dot while scanning the array.
    product + 1,
    product - 1,
  ];
}

/**
 * Deterministic option list: always exactly TIMES_OPTION_COUNT unique positive
 * numbers, always including the product, in an order that carries no
 * information about which is which.
 */
export function getTimesOptions(index: number): number[] {
  const roundIndex = ((index % TIMES_ROUNDS.length) + TIMES_ROUNDS.length) % TIMES_ROUNDS.length;
  const round = TIMES_ROUNDS[roundIndex];
  const answer = timesProduct(round);

  const distractors: number[] = [];
  for (const c of misconceptions(round)) {
    if (c > 0 && c !== answer && !distractors.includes(c)) distractors.push(c);
  }

  return placeOptions({
    gameId: TIMES_TABLES_META.id,
    roundIndex,
    answer,
    distractors,
    count: TIMES_OPTION_COUNT,
  });
}

/* --------------------------------------------------------------- feedback -- */

/**
 * Flat and specific either way, and carrying the same two numbers in the same
 * order as the picture: `groups` groups of `per`, counted by `per`.
 */
export function getTimesFeedback(round: TimesRound, selected: number): string {
  const product = timesProduct(round);
  const reading = `That is ${round.groups} groups of ${round.per}: count by ${round.per}s, ${times(round.groups)}.`;
  if (selected === product) {
    return `Correct. ${round.groups} × ${round.per} = ${product}. ${reading}`;
  }
  return `${round.groups} × ${round.per} = ${product}, not ${selected}. ${reading}`;
}
