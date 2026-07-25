// Number Line Jumps — pure typed logic module (no React).
// Add/subtract on a 0..20 number line. Each round: start at a point, jump
// forward (+) or back (-), where do you land?

export const NUMBER_LINE_JUMP_META = {
  id: 'number-line-jump',
  title: 'The Number Line',
  icon: '📏',
  color: 'leaf',
  tagline: 'Start at five, move three. Addition as distance travelled.',
} as const;

export const NUMBER_LINE_MIN = 0;
export const NUMBER_LINE_MAX = 20;

export type Direction = 'forward' | 'back';

export interface JumpRound {
  /** where the marker starts */
  readonly start: number;
  /** how many units to hop */
  readonly jump: number;
  /** forward = add, back = subtract */
  readonly dir: Direction;
}

/** The landing spot = correct answer. Pure. */
export function landOn(round: JumpRound): number {
  return round.dir === 'forward' ? round.start + round.jump : round.start - round.jump;
}

/** Human question text for a round. */
export function jumpPrompt(round: JumpRound): string {
  const word = round.dir === 'forward' ? 'forward' : 'back';
  const hop = round.jump === 1 ? '1 hop' : `${round.jump} hops`;
  return `Start at ${round.start}, jump ${hop} ${word}. Where do you land?`;
}

/** Encouraging hint shown before answering. */
export function jumpHint(round: JumpRound): string {
  return round.dir === 'forward'
    ? `Count up from ${round.start}, one hop at a time. Adding makes numbers bigger!`
    : `Count down from ${round.start}, one hop at a time. Subtracting makes numbers smaller!`;
}

// 14 varied rounds — mix of forward/back, all landing inside 0..20.
export const JUMP_ROUNDS: readonly JumpRound[] = [
  { start: 5, jump: 3, dir: 'forward' },   // 8
  { start: 9, jump: 4, dir: 'back' },      // 5
  { start: 2, jump: 6, dir: 'forward' },   // 8
  { start: 12, jump: 5, dir: 'back' },     // 7
  { start: 7, jump: 7, dir: 'forward' },   // 14
  { start: 10, jump: 10, dir: 'back' },    // 0
  { start: 4, jump: 2, dir: 'forward' },   // 6
  { start: 15, jump: 6, dir: 'back' },     // 9
  { start: 8, jump: 9, dir: 'forward' },   // 17
  { start: 11, jump: 3, dir: 'back' },     // 8
  { start: 6, jump: 8, dir: 'forward' },   // 14
  { start: 18, jump: 7, dir: 'back' },     // 11
  { start: 13, jump: 7, dir: 'forward' },  // 20
  { start: 16, jump: 9, dir: 'back' },     // 7
];

const OPTION_COUNT = 4;

/**
 * Deterministic option list for a round, always length OPTION_COUNT and always
 * containing the correct landing spot. Distractors are near-misses within the
 * 0..20 line (off-by-a-few / wrong direction feel), all unique and clamped.
 */
export function getJumpOptions(index: number): number[] {
  const round = JUMP_ROUNDS[index % JUMP_ROUNDS.length];
  const answer = landOn(round);

  const opts: number[] = [answer];

  // Candidate near-miss offsets (kid mistakes: miscount, wrong direction).
  const candidates = [
    answer + 1,
    answer - 1,
    // wrong direction: adds instead of subtracts (or vice-versa)
    round.dir === 'forward' ? round.start - round.jump : round.start + round.jump,
    answer + 2,
    answer - 2,
    round.start, // forgot to jump
  ];

  for (const c of candidates) {
    if (opts.length >= OPTION_COUNT) break;
    if (c < NUMBER_LINE_MIN || c > NUMBER_LINE_MAX) continue;
    if (opts.includes(c)) continue;
    opts.push(c);
  }

  // Guarantee full length even at the line's edges by walking outward.
  let fill = NUMBER_LINE_MIN;
  while (opts.length < OPTION_COUNT && fill <= NUMBER_LINE_MAX) {
    if (!opts.includes(fill)) opts.push(fill);
    fill += 1;
  }

  // Deterministic shuffle by the round's fingerprint so the answer isn't
  // always in the same slot but the order is stable per index.
  const seed = round.start * 31 + round.jump * 7 + (round.dir === 'forward' ? 3 : 1);
  const sorted = [...opts].sort((a, b) => a - b);
  const rotate = seed % sorted.length;
  return [...sorted.slice(rotate), ...sorted.slice(0, rotate)];
}

/** Warm, no-fail feedback for any selection. */
export function getJumpFeedback(round: JumpRound, selected: number): string {
  const answer = landOn(round);
  const verb = round.dir === 'forward' ? 'up' : 'down';
  if (selected === answer) {
    return `Yes! Starting at ${round.start} and hopping ${round.jump} ${verb} lands you right on ${answer}. Super jumping!`;
  }
  return `Nice try! Let's count together: from ${round.start}, hop ${round.jump} ${verb} and you land on ${answer}. Every hop moves you one spot — you're getting it!`;
}

/** Label used on option buttons. */
export function jumpOptionLabel(value: number): string {
  return String(value);
}
