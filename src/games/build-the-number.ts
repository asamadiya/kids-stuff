// Build the Number — expanded form & place value (pure typed logic).
// No React here. Deterministic rounds + pure helpers, mirrors the feelings.ts golden shape.

export const BUILD_THE_NUMBER_META = {
  id: 'build-the-number',
  title: 'Build the Number',
  icon: '🧱',
  color: 'sun',
  tagline: 'Forty and seven make forty-seven. Numbers taken apart and rebuilt.',
} as const;

/** A single part of the number, e.g. 3 hundreds, 4 tens, 7 ones. */
export interface NumberPart {
  /** Place value of one unit in this part: 1, 10, 100, or 1000. */
  readonly unit: 100 | 1000 | 1 | 10;
  /** How many of that unit (0-9). */
  readonly count: number;
}

/** How the round is phrased to the player. */
export type BuildStyle = 'words' | 'sum';

export interface BuildRound {
  readonly id: string;
  /** The correct number the player should build. */
  readonly answer: number;
  /** The place-value breakdown that makes up the answer. */
  readonly parts: readonly NumberPart[];
  /** Which phrasing to show in the prompt. */
  readonly style: BuildStyle;
  /** Wrong-but-plausible distractors (each distinct, none equal to answer). */
  readonly distractors: readonly [number, number, number];
}

/** Number of options shown every round (answer + 3 distractors). */
export const OPTION_COUNT = 4;

/** Names for the unit of each part, used in prompts and stage. */
export function unitName(unit: NumberPart['unit'], count: number): string {
  const plural = count === 1 ? '' : 's';
  switch (unit) {
    case 1:
      return `one${plural}`;
    case 10:
      return `ten${plural}`;
    case 100:
      return `hundred${plural}`;
    case 1000:
      return `thousand${plural}`;
  }
}

/** The value a single part contributes (count * unit). */
export function partValue(part: NumberPart): number {
  return part.count * part.unit;
}

/** Sum of all parts — must equal round.answer for well-formed rounds. */
export function partsTotal(parts: readonly NumberPart[]): number {
  return parts.reduce((sum, p) => sum + partValue(p), 0);
}

/**
 * Human phrase for the parts, e.g. "4 tens and 3 ones".
 * Parts are read in the given order (highest place first by convention).
 */
export function partsInWords(parts: readonly NumberPart[]): string {
  const pieces = parts.map((p) => `${p.count} ${unitName(p.unit, p.count)}`);
  if (pieces.length === 1) return pieces[0];
  if (pieces.length === 2) return `${pieces[0]} and ${pieces[1]}`;
  return `${pieces.slice(0, -1).join(', ')}, and ${pieces[pieces.length - 1]}`;
}

/** Expanded-sum phrase for the parts, e.g. "40 + 7". */
export function partsAsSum(parts: readonly NumberPart[]): string {
  return parts.map((p) => String(partValue(p))).join(' + ');
}

/** The question sentence for a round. */
export function getBuildPrompt(round: BuildRound): string {
  if (round.style === 'sum') {
    return `${partsAsSum(round.parts)} = ?`;
  }
  return `Which number is ${partsInWords(round.parts)}?`;
}

/** Short hint shown before the player answers. */
export function getBuildHint(round: BuildRound): string {
  if (round.style === 'sum') {
    return 'Add up the parts — each block tells you its value.';
  }
  return 'Each place tells you a digit. Build it up piece by piece!';
}

/**
 * Deterministic option list for round i: answer + its 3 distractors,
 * ordered by the answer's ones digit so it is stable but not always first.
 * Always includes the correct answer.
 */
export function getBuildOptions(round: BuildRound): number[] {
  const all = [round.answer, ...round.distractors];
  const pivot = round.answer % OPTION_COUNT;
  const rotated = [...all.slice(pivot), ...all.slice(0, pivot)];
  return rotated;
}

/** Label shown on an option button. */
export function buildLabel(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Warm feedback for any selection. Never says wrong/incorrect/no.
 * If missed, affirms the try then explains the place-value "why" positively.
 */
export function getBuildFeedback(round: BuildRound, selected: number): string {
  const built = buildLabel(round.answer);
  const words = partsInWords(round.parts);
  const sum = partsAsSum(round.parts);
  if (selected === round.answer) {
    return `Correct. ${sum} builds ${built}. The digits sit in their places: ${words}.`;
  }
  return `Not quite. ${words} is ${sum}, which builds ${built}. Every place adds its own digit.`;
}

/**
 * The rounds. 14 rounds, mix of tens+ones, hundreds, and a few thousands,
 * alternating "words" and "sum" phrasing. Distractors are place-value
 * confusions (swapped digits, off-by-one place, dropped zero) so the game
 * actually teaches. Every parts list sums exactly to its answer.
 */
export const BUILD_THE_NUMBER_ROUNDS: readonly BuildRound[] = [
  {
    id: 'r1',
    answer: 43,
    style: 'words',
    parts: [
      { unit: 10, count: 4 },
      { unit: 1, count: 3 },
    ],
    distractors: [34, 40, 47],
  },
  {
    id: 'r2',
    answer: 47,
    style: 'sum',
    parts: [
      { unit: 10, count: 4 },
      { unit: 1, count: 7 },
    ],
    distractors: [74, 11, 407],
  },
  {
    id: 'r3',
    answer: 25,
    style: 'words',
    parts: [
      { unit: 10, count: 2 },
      { unit: 1, count: 5 },
    ],
    distractors: [52, 20, 205],
  },
  {
    id: 'r4',
    answer: 60,
    style: 'sum',
    parts: [
      { unit: 10, count: 6 },
      { unit: 1, count: 0 },
    ],
    distractors: [6, 16, 66],
  },
  {
    id: 'r5',
    answer: 38,
    style: 'words',
    parts: [
      { unit: 10, count: 3 },
      { unit: 1, count: 8 },
    ],
    distractors: [83, 30, 308],
  },
  {
    id: 'r6',
    answer: 91,
    style: 'sum',
    parts: [
      { unit: 10, count: 9 },
      { unit: 1, count: 1 },
    ],
    distractors: [19, 90, 901],
  },
  {
    id: 'r7',
    answer: 234,
    style: 'words',
    parts: [
      { unit: 100, count: 2 },
      { unit: 10, count: 3 },
      { unit: 1, count: 4 },
    ],
    distractors: [243, 204, 324],
  },
  {
    id: 'r8',
    answer: 507,
    style: 'sum',
    parts: [
      { unit: 100, count: 5 },
      { unit: 10, count: 0 },
      { unit: 1, count: 7 },
    ],
    distractors: [57, 570, 750],
  },
  {
    id: 'r9',
    answer: 160,
    style: 'words',
    parts: [
      { unit: 100, count: 1 },
      { unit: 10, count: 6 },
      { unit: 1, count: 0 },
    ],
    distractors: [16, 106, 610],
  },
  {
    id: 'r10',
    answer: 428,
    style: 'sum',
    parts: [
      { unit: 100, count: 4 },
      { unit: 10, count: 2 },
      { unit: 1, count: 8 },
    ],
    distractors: [824, 482, 248],
  },
  {
    id: 'r11',
    answer: 305,
    style: 'words',
    parts: [
      { unit: 100, count: 3 },
      { unit: 10, count: 0 },
      { unit: 1, count: 5 },
    ],
    distractors: [350, 35, 530],
  },
  {
    id: 'r12',
    answer: 719,
    style: 'sum',
    parts: [
      { unit: 100, count: 7 },
      { unit: 10, count: 1 },
      { unit: 1, count: 9 },
    ],
    distractors: [791, 917, 179],
  },
  {
    id: 'r13',
    answer: 1250,
    style: 'words',
    parts: [
      { unit: 1000, count: 1 },
      { unit: 100, count: 2 },
      { unit: 10, count: 5 },
      { unit: 1, count: 0 },
    ],
    distractors: [1205, 1520, 2150],
  },
  {
    id: 'r14',
    answer: 3406,
    style: 'sum',
    parts: [
      { unit: 1000, count: 3 },
      { unit: 100, count: 4 },
      { unit: 10, count: 0 },
      { unit: 1, count: 6 },
    ],
    distractors: [3460, 3064, 4306],
  },
] as const;
