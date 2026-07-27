import { placeOptions } from './options';
export const COUNT_BY_TENS_META = {
  id: 'count-by-tens',
  title: 'Count by Tens',
  icon: '🔢',
  color: 'leaf',
  tagline: 'Ten, twenty, thirty — counting in tens, and what follows.',
} as const;

export interface CountByTensRound {
  /** The visible sequence shown before the blank, e.g. [10, 20, 30]. */
  sequence: readonly number[];
  /** The correct number that fills the blank (sequence's last + 10). */
  answer: number;
  /** 3 answer options, always including `answer`, in a stable display order. */
  options: readonly number[];
}

/**
 * Build a skip-by-10 round starting at `start` with `visible` shown terms.
 * The blank is always the next multiple-of-10 step after the last shown term.
 */
/**
 * Distractors are derived, not typed. The hand-written lists offered a number
 * that was already printed in the visible sequence in 14 of 14 rounds — "10,
 * 20, 30, ?" offered 30, 40, 50 — so one option was dead on sight and the
 * round collapsed to a one-of-two in a fixed slot.
 *
 * These two are real errors instead: carrying on by tens one step too far, and
 * carrying on by ones from the last number shown.
 */
function makeRound(start: number, visible: number, index: number): CountByTensRound {
  const sequence: number[] = [];
  for (let i = 0; i < visible; i += 1) {
    sequence.push(start + i * 10);
  }
  const answer = start + visible * 10;
  const last = sequence[sequence.length - 1];
  const distractors = [answer + 10, last + 1, answer - 1].filter((d) => !sequence.includes(d));
  const options = placeOptions({
    gameId: 'count-by-tens', roundIndex: index, answer, distractors, count: 3,
  });
  return { sequence, answer, options };
}

export const COUNT_BY_TENS_ROUNDS: readonly CountByTensRound[] = [
  makeRound(10, 3, 0),   // 10,20,30 -> 40
  makeRound(0, 3, 1),    // 0,10,20 -> 30
  makeRound(20, 3, 2),   // 20,30,40 -> 50
  makeRound(23, 3, 3),   // 23,33,43 -> 53
  makeRound(50, 3, 4),   // 50,60,70 -> 80
  makeRound(7, 3, 5),    // 7,17,27 -> 37
  makeRound(40, 4, 6),   // 40,50,60,70 -> 80
  makeRound(15, 3, 7),   // 15,25,35 -> 45
  makeRound(60, 3, 8),  // 60,70,80 -> 90
  makeRound(31, 3, 9),   // 31,41,51 -> 61
  makeRound(80, 3, 10), // 80,90,100 -> 110
  makeRound(4, 4, 11),    // 4,14,24,34 -> 44
  makeRound(90, 3, 12), // 90,100,110 -> 120
  makeRound(12, 3, 13),   // 12,22,32 -> 42
];

/** Deterministic options for round `i` (always includes the answer). */
export function getCountByTensOptions(i: number): readonly number[] {
  const round = COUNT_BY_TENS_ROUNDS[i % COUNT_BY_TENS_ROUNDS.length];
  return round.options;
}

/** Warm, never-negative feedback for any selection. */
export function getCountByTensFeedback(round: CountByTensRound, selected: number): string {
  const last = round.sequence[round.sequence.length - 1];
  if (selected === round.answer) {
    return `Correct. ${last} + 10 = ${round.answer}. Every jump adds one more ten.`;
  }
  return `Not quite. We add 10 each time, so ${last} + 10 = ${round.answer}. The ones digit stays the same — only the tens grow.`;
}
