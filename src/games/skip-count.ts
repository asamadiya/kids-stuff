// Pure typed logic for the Skip Counting mini-game.
// Count by 2s and 5s: given a running sequence, pick the next number.
// No React here — just data + deterministic pure helpers.

export const SKIP_COUNT_META = {
  id: 'skip-count',
  title: 'Skip Counting',
  icon: '⏭',
  color: 'grape',
  tagline: 'Counting in twos and fives, and the pattern each one leaves.',
} as const;

export interface SkipCountRound {
  /** Step size — 2 or 5. */
  readonly step: 2 | 5;
  /** The visible part of the sequence, e.g. [2, 4, 6]. */
  readonly shown: readonly number[];
  /** The next number after `shown` (the correct answer). */
  readonly answer: number;
  /** 3 wrong-but-plausible distractors. */
  readonly distractors: readonly [number, number, number];
}

/**
 * Build one round: a sequence starting at `start`, stepping by `step`,
 * showing `count` terms; the answer is the term after those.
 */
function makeRound(
  step: 2 | 5,
  start: number,
  count: number,
  distractors: readonly [number, number, number],
): SkipCountRound {
  const shown: number[] = [];
  for (let i = 0; i < count; i += 1) {
    shown.push(start + i * step);
  }
  const answer = start + count * step;
  return { step, shown, answer, distractors };
}

// 12 hand-picked rounds, mixing 2s and 5s, growing in size.
// Distractors are near-misses (off-by-one, wrong step, repeated term).
export const SKIP_COUNT_ROUNDS: readonly SkipCountRound[] = [
  makeRound(2, 2, 3, [7, 10, 5]), //  2,4,6 -> 8
  makeRound(5, 5, 3, [25, 18, 30]), //  5,10,15 -> 20
  makeRound(2, 2, 4, [11, 9, 12]), //  2,4,6,8 -> 10
  makeRound(5, 10, 3, [20, 26, 30]), // 10,15,20 -> 25
  makeRound(2, 4, 4, [13, 11, 14]), //  4,6,8,10 -> 12
  makeRound(5, 5, 4, [30, 24, 20]), //  5,10,15,20 -> 25
  makeRound(2, 0, 4, [7, 9, 6]), //  0,2,4,6 -> 8
  makeRound(5, 15, 3, [35, 25, 40]), // 15,20,25 -> 30
  makeRound(2, 6, 4, [15, 13, 16]), //  6,8,10,12 -> 14
  makeRound(5, 20, 3, [40, 30, 36]), // 20,25,30 -> 35
  makeRound(2, 10, 4, [19, 17, 20]), // 10,12,14,16 -> 18
  makeRound(5, 25, 4, [50, 40, 44]), // 25,30,35,40 -> 45
];

/**
 * Deterministic option list for round `i`: the correct answer plus its
 * distractors, sorted ascending so placement is stable and predictable.
 * Always includes the correct answer.
 */
export function getSkipCountOptions(i: number): number[] {
  const round = SKIP_COUNT_ROUNDS[i % SKIP_COUNT_ROUNDS.length];
  return [round.answer, ...round.distractors].sort((a, b) => a - b);
}

/** The '2,4,6,?' style string shown on the stage. */
export function getSkipCountSequenceLabel(round: SkipCountRound): string {
  return `${round.shown.join(', ')}, ?`;
}

/** Warm, no-fail feedback for any choice. */
export function getSkipCountFeedback(round: SkipCountRound, selected: number): string {
  const correct = selected === round.answer;
  const last = round.shown[round.shown.length - 1];
  if (correct) {
    return `Correct. ${last} + ${round.step} = ${round.answer}. You are counting by ${round.step}s like a pro!`;
  }
  return `Not quite. When we skip count by ${round.step}s we add ${round.step} each jump, so ${last} + ${round.step} = ${round.answer} comes next.`;
}
