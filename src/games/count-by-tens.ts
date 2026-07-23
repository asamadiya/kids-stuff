export const COUNT_BY_TENS_META = {
  id: 'count-by-tens',
  title: 'Count by Tens',
  icon: '🔢',
  color: 'leaf',
  tagline: 'Jump by tens like a pro — 10, 20, 30, what comes next?',
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
function makeRound(start: number, visible: number, distractors: readonly number[]): CountByTensRound {
  const sequence: number[] = [];
  for (let i = 0; i < visible; i += 1) {
    sequence.push(start + i * 10);
  }
  const answer = start + visible * 10;
  // Options: answer + two distractors, sorted ascending for a stable layout.
  const options = [answer, ...distractors].sort((a, b) => a - b);
  return { sequence, answer, options };
}

export const COUNT_BY_TENS_ROUNDS: readonly CountByTensRound[] = [
  makeRound(10, 3, [30, 50]),   // 10,20,30 -> 40
  makeRound(0, 3, [20, 40]),    // 0,10,20 -> 30
  makeRound(20, 3, [30, 60]),   // 20,30,40 -> 50
  makeRound(23, 3, [43, 63]),   // 23,33,43 -> 53
  makeRound(50, 3, [70, 90]),   // 50,60,70 -> 80
  makeRound(7, 3, [27, 47]),    // 7,17,27 -> 37
  makeRound(40, 4, [70, 90]),   // 40,50,60,70 -> 80
  makeRound(15, 3, [35, 55]),   // 15,25,35 -> 45
  makeRound(60, 3, [80, 100]),  // 60,70,80 -> 90
  makeRound(31, 3, [51, 71]),   // 31,41,51 -> 61
  makeRound(80, 3, [100, 120]), // 80,90,100 -> 110
  makeRound(4, 4, [34, 54]),    // 4,14,24,34 -> 44
  makeRound(90, 3, [110, 130]), // 90,100,110 -> 120
  makeRound(12, 3, [32, 52]),   // 12,22,32 -> 42
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
    return `Yes! ${last} + 10 = ${round.answer}. Every jump adds one more ten.`;
  }
  return `Nice try! We add 10 each time, so ${last} + 10 = ${round.answer}. The ones digit stays the same — only the tens grow.`;
}
