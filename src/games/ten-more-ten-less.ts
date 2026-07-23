// Pure typed logic for the "Ten More, Ten Less" mini-game.
// Add or subtract 10 mentally from a two-digit number.
// No React here — just data + deterministic pure helpers.

export const TEN_MORE_TEN_LESS_META = {
  id: 'ten-more-ten-less',
  title: 'Ten More, Ten Less',
  icon: '🔟',
  color: 'plum',
  tagline: 'Jump by ten in your head — watch the tens digit hop up and down!',
} as const;

export type TenDirection = 'more' | 'less';

export interface TenRound {
  /** The starting two-digit number shown big on the stage. */
  readonly start: number;
  /** Whether we add 10 (more) or subtract 10 (less). */
  readonly direction: TenDirection;
}

/** Compute the correct answer for a round: +10 or -10. */
export function tenAnswer(round: TenRound): number {
  return round.direction === 'more' ? round.start + 10 : round.start - 10;
}

/** The question prompt, e.g. "What is 10 more than 34?". */
export function tenPrompt(round: TenRound): string {
  return `What is 10 ${round.direction} than ${round.start}?`;
}

/** A gentle hint that nudges toward the tens-digit strategy. */
export function tenHint(round: TenRound): string {
  return round.direction === 'more'
    ? 'Add 1 to the tens digit — the ones digit stays the same!'
    : 'Take 1 from the tens digit — the ones digit stays the same!';
}

// 14 varied rounds: a mix of 10-more and 10-less, spread across two-digit numbers,
// all with answers that remain two-digit (10..99) so the visuals stay clean.
export const TEN_ROUNDS: readonly TenRound[] = [
  { start: 34, direction: 'more' }, // 44
  { start: 58, direction: 'less' }, // 48
  { start: 27, direction: 'more' }, // 37
  { start: 71, direction: 'less' }, // 61
  { start: 45, direction: 'more' }, // 55
  { start: 63, direction: 'less' }, // 53
  { start: 19, direction: 'more' }, // 29
  { start: 80, direction: 'less' }, // 70
  { start: 52, direction: 'more' }, // 62
  { start: 96, direction: 'less' }, // 86
  { start: 40, direction: 'more' }, // 50
  { start: 33, direction: 'less' }, // 23
  { start: 68, direction: 'more' }, // 78
  { start: 25, direction: 'less' }, // 15
];

/**
 * Deterministic option list for round `i`, always length 4 and always
 * containing the correct answer. Distractors are near-miss values (off by
 * one ten, or the wrong-direction result) so the choice is meaningful.
 */
export function getTenOptions(i: number): number[] {
  const round = TEN_ROUNDS[i % TEN_ROUNDS.length];
  const answer = tenAnswer(round);

  // Candidate distractors, ordered by how tempting/instructive they are.
  const candidates: number[] = [
    round.direction === 'more' ? round.start - 10 : round.start + 10, // wrong direction
    round.start, // "forgot to move"
    answer + 10, // overshoot
    answer - 10, // undershoot
    round.start + 1, // added ones instead of tens
    round.start - 1,
  ];

  const opts: number[] = [answer];
  for (const c of candidates) {
    if (opts.length >= 4) break;
    if (c >= 0 && c <= 99 && !opts.includes(c)) opts.push(c);
  }
  // Extremely unlikely fallback to guarantee length 4.
  let filler = 10;
  while (opts.length < 4) {
    if (!opts.includes(filler)) opts.push(filler);
    filler += 1;
  }

  // Deterministic ordering keyed to the round so it looks shuffled but is stable.
  return opts.slice(0, 4).sort((a, b) => ((a + i) % 7) - ((b + i) % 7));
}

/**
 * Warm, no-fail feedback for any selection. Never says wrong/incorrect.
 * Explains WHY briefly using the tens-digit strategy.
 */
export function getTenFeedback(round: TenRound, selected: number): string {
  const answer = tenAnswer(round);
  const move = round.direction === 'more' ? 'up' : 'down';
  if (selected === answer) {
    return `Yes! ${round.start} jumps ${move} by ten to ${answer}. The tens digit moved and the ones digit stayed put.`;
  }
  return `Nice try! 10 ${round.direction} than ${round.start} is ${answer}. Just move the tens digit ${move} by one and keep the ones digit — that's ${answer}.`;
}
