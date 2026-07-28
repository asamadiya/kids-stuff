import { placeOptions } from './options';
// Two-Digit Adding — pure typed logic module (no React).
// Two-digit addition, INCLUDING regrouping. The first version refused to
// carry — `buildRound` threw at build time if a column summed to ten or more —
// which capped the hardest sum on the site at 45+33 for a child whose stated
// need is multi-digit arithmetic. Carrying is the step that makes column
// addition mean anything; without it the exercise is two independent
// single-digit sums printed side by side.
//
// so tens add to tens and ones add to ones with no carrying.

export const TWO_DIGIT_ADD_META = {
  id: 'two-digit-add',
  title: 'Two-Digit Addition',
  icon: '➕',
  color: 'sky',
  tagline: 'Adding tens to tens and ones to ones, in columns.',
} as const;

export interface TwoDigitAddRound {
  /** True when the ones column passes ten, so a ten has to move across. */
  carries: boolean;
  /** First addend, e.g. 23. */
  readonly a: number;
  /** Second addend, e.g. 14. */
  readonly b: number;
  /** The correct sum, a + b. */
  readonly answer: number;
  /** 3-4 answer choices; always includes `answer`. */
  readonly options: readonly number[];
}

interface RawRound {
  readonly a: number;
  readonly b: number;
  /** Distractors (wrong-but-plausible). Must NOT equal the true sum. */
  readonly distractors: readonly number[];
}

// Column check: every round keeps ones-col and tens-col sums < 10 (no regroup).
const RAW_ROUNDS: readonly RawRound[] = [
  // Regrouping rounds. The ones column passes ten and the ten moves across.
  { a: 27, b: 15, distractors: [42, 31] },
  { a: 48, b: 36, distractors: [74, 83] },
  { a: 19, b: 26, distractors: [44, 36] },
  { a: 35, b: 47, distractors: [72, 91] },
  { a: 56, b: 28, distractors: [74, 85] },
  { a: 17, b: 38, distractors: [45, 56] },
  { a: 29, b: 43, distractors: [62, 71] },
  { a: 64, b: 27, distractors: [81, 92] },
  { a: 23, b: 14, distractors: [36, 47] },
  { a: 31, b: 42, distractors: [72, 74] },
  { a: 12, b: 15, distractors: [26, 37] },
  { a: 45, b: 33, distractors: [77, 88] },
  { a: 21, b: 26, distractors: [46, 48] },
  { a: 52, b: 34, distractors: [85, 96] },
  { a: 13, b: 21, distractors: [33, 35] },
  { a: 40, b: 27, distractors: [66, 68] },
  { a: 34, b: 25, distractors: [58, 60] },
  { a: 11, b: 18, distractors: [28, 30] },
  { a: 62, b: 25, distractors: [86, 88] },
  { a: 43, b: 16, distractors: [58, 60] },
  { a: 24, b: 53, distractors: [76, 78] },
  { a: 15, b: 24, distractors: [38, 40] },
];

const clampOption = (n: number): number => (n < 0 ? 0 : n);

// Build a round: verify no-regroup, compute the true sum, and assemble
// a deterministic, sorted option list that always contains the answer.
function buildRound(raw: RawRound, index: number): TwoDigitAddRound {
  const onesA = raw.a % 10;
  const onesB = raw.b % 10;
  const tensA = Math.floor(raw.a / 10);
  const tensB = Math.floor(raw.b / 10);
  const carries = onesA + onesB >= 10;
  // Only the hundreds boundary is refused: the display is two digits wide.
  if (raw.a + raw.b > 99) {
    throw new Error(`Round ${raw.a}+${raw.b} passes 99; the column display is two digits.`);
  }
  const answer = raw.a + raw.b;
  const uniq = new Set<number>([answer]);
  for (const d of raw.distractors) {
    uniq.add(clampOption(d));
  }
  uniq.delete(answer);
  const options = placeOptions({
    gameId: 'two-digit-add', roundIndex: index, answer,
    // The no-carry answer (27+15 -> 32) is the misconception this exercise
    // exists to surface, so it is always offered when the round regroups.
    required: carries ? [tensA * 10 + tensB * 10 + ((onesA + onesB) % 10)] : [],
    distractors: [...Array.from(uniq), answer - 10, answer + 10, answer - 1, answer + 1,
                  answer - 2, answer + 2].filter((v) => v > 0 && v !== answer),
    count: 4,
  });
  return { a: raw.a, b: raw.b, answer, carries, options };
}

export const TWO_DIGIT_ADD_ROUNDS: readonly TwoDigitAddRound[] =
  RAW_ROUNDS.map((raw, i) => buildRound(raw, i));

/** Deterministic options for round `i` (modulo-safe). Always includes the answer. */
export function getAddOptions(i: number): readonly number[] {
  const round = TWO_DIGIT_ADD_ROUNDS[i % TWO_DIGIT_ADD_ROUNDS.length];
  return round.options;
}

/** The question prompt for a round. */
export function getAddPrompt(round: TwoDigitAddRound): string {
  return `What is ${round.a} + ${round.b}?`;
}

/** Steady hint shown before answering. */
export function getAddHint(round: TwoDigitAddRound): string {
  const tens = Math.floor(round.a / 10) + Math.floor(round.b / 10);
  const ones = (round.a % 10) + (round.b % 10);
  return `Add the ones: ${round.a % 10} + ${round.b % 10} = ${ones}. Add the tens: ${tens}0.`;
}

/** Warm feedback for ANY choice — affirming, never negative. */
export function getAddFeedback(round: TwoDigitAddRound, selected: number): string {
  const onesSum = (round.a % 10) + (round.b % 10);
  const tensSum = Math.floor(round.a / 10) + Math.floor(round.b / 10);
  const why = `Ones ${round.a % 10}+${round.b % 10}=${onesSum}, tens ${Math.floor(round.a / 10)}+${Math.floor(round.b / 10)}=${tensSum}, so ${tensSum}${onesSum} = ${round.answer}.`;
  if (selected === round.answer) {
    return `Correct. ${round.a} + ${round.b} = ${round.answer}. ${why}`;
  }
  return `Not quite. The answer is ${round.answer}. ${why}`;
}
