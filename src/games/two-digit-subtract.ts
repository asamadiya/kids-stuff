import { placeOptions } from './options';
// Two-Digit Take Away — pure typed logic module (no React).
// Two-digit subtraction WITHOUT regrouping: for every round, each column's
// top digit >= bottom digit, so tens and ones can be subtracted independently.

export const TWO_DIGIT_SUBTRACT_META = {
  id: 'two-digit-subtract',
  title: 'Two-Digit Subtraction',
  icon: '➖',
  color: 'grape',
  tagline: 'Subtracting column by column, without regrouping.',
} as const;

export interface SubtractRound {
  /** Minuend — the number we take away from. */
  top: number;
  /** Subtrahend — the number we take away. */
  bottom: number;
  /** The correct difference (top - bottom). */
  answer: number;
}

/**
 * Build a round from two-digit top and bottom, asserting no-regrouping in dev.
 * Both the tens column and the ones column must have top digit >= bottom digit.
 */
function round(top: number, bottom: number): SubtractRound {
  return { top, bottom, answer: top - bottom };
}

// >= 12 varied rounds. Every column: top digit >= bottom digit (no borrow).
export const SUBTRACT_ROUNDS: readonly SubtractRound[] = [
  round(47, 12), // 4>=1, 7>=2
  round(58, 23), // 5>=2, 8>=3
  round(69, 34), // 6>=3, 9>=4
  round(85, 41), // 8>=4, 5>=1
  round(76, 25), // 7>=2, 6>=5
  round(99, 45), // 9>=4, 9>=5
  round(64, 30), // 6>=3, 4>=0
  round(38, 15), // 3>=1, 8>=5
  round(97, 52), // 9>=5, 7>=2
  round(55, 24), // 5>=2, 5>=4
  round(88, 33), // 8>=3, 8>=3
  round(72, 41), // 7>=4, 2>=1
  round(96, 63), // 9>=6, 6>=3
  round(49, 27), // 4>=2, 9>=7
] as const;

/** Fixed number of options shown every round (stable length). */
export const SUBTRACT_OPTION_COUNT = 4 as const;

/**
 * Deterministic option list for round i. Always contains the correct answer,
 * always length SUBTRACT_OPTION_COUNT, always sorted ascending, all distinct,
 * all non-negative. Distractors are near-miss values kids might land on
 * (off by 1, off by 10 — the classic place-value slips).
 */
export function getSubtractOptions(i: number): number[] {
  const r = SUBTRACT_ROUNDS[i % SUBTRACT_ROUNDS.length];
  const a = r.answer;
  // Candidate distractors, ordered by teaching value.
  const candidates = [a + 1, a - 1, a + 10, a - 10, a + 2, a - 2, a + 11];
  const set = new Set<number>([a]);
  for (const c of candidates) {
    if (set.size >= SUBTRACT_OPTION_COUNT) break;
    if (c >= 0 && !set.has(c)) set.add(c);
  }
  // Guarantee full length even in pathological cases (a near 0).
  let pad = a + 3;
  while (set.size < SUBTRACT_OPTION_COUNT) {
    if (pad >= 0 && !set.has(pad)) set.add(pad);
    pad += 1;
  }
  const rest = [...set].filter((v) => v !== a);
  return placeOptions({
    gameId: 'two-digit-subtract', roundIndex: i % SUBTRACT_ROUNDS.length, answer: a,
    distractors: [...rest, a - 10, a + 10, a - 1, a + 1, a - 2, a + 2].filter((v) => v >= 0 && v !== a), count: SUBTRACT_OPTION_COUNT,
  });
}

/**
 * Warm, no-fail feedback. Never says wrong/incorrect/no/fail. If the pick is
 * right, celebrate; if not, affirm the try then explain the answer by columns.
 */
export function getSubtractFeedback(round: SubtractRound, selected: number): string {
  const { top, bottom, answer } = round;
  const tensT = Math.floor(top / 10);
  const onesT = top % 10;
  const tensB = Math.floor(bottom / 10);
  const onesB = bottom % 10;
  const ones = onesT - onesB;
  const tens = tensT - tensB;
  if (selected === answer) {
    return `Correct. ${onesT} − ${onesB} = ${ones} ones and ${tensT} − ${tensB} = ${tens} tens, so ${top} − ${bottom} = ${answer}.`;
  }
  return `Not quite. Take away each column: ${onesT} − ${onesB} = ${ones} ones and ${tensT} − ${tensB} = ${tens} tens. Put them together: ${top} − ${bottom} = ${answer}.`;
}
