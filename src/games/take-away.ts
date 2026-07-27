// Take Away — subtraction within 10 with objects.
// Pure typed logic module. No React.

export const TAKE_AWAY_META = {
  id: 'take-away',
  title: 'Subtraction',
  icon: '➖',
  color: 'berry',
  tagline: 'Five, with two taken away. What is left, and why.',
} as const;

export interface TakeAwayRound {
  /** How many objects we start with. */
  total: number;
  /** How many get crossed out / taken away. */
  takeAway: number;
  /** The emoji used to draw the objects. */
  emoji: string;
  /** Friendly noun (plural) for the objects. */
  noun: string;
}

/** The answer is always total - takeAway. */
export function difference(round: TakeAwayRound): number {
  return round.total - round.takeAway;
}

export const TAKE_AWAY_ROUNDS: readonly TakeAwayRound[] = [
  { total: 5, takeAway: 2, emoji: '🍪', noun: 'cookies' },
  { total: 4, takeAway: 1, emoji: '🍎', noun: 'apples' },
  { total: 6, takeAway: 3, emoji: '🎈', noun: 'balloons' },
  { total: 3, takeAway: 2, emoji: '🐟', noun: 'fish' },
  { total: 7, takeAway: 4, emoji: '⭐', noun: 'stars' },
  { total: 8, takeAway: 5, emoji: '🍓', noun: 'strawberries' },
  { total: 5, takeAway: 5, emoji: '🍩', noun: 'donuts' },
  { total: 9, takeAway: 3, emoji: '🎎', noun: 'eggs' },
  { total: 6, takeAway: 2, emoji: '🐢', noun: 'turtles' },
  { total: 10, takeAway: 6, emoji: '🍇', noun: 'grapes' },
  { total: 4, takeAway: 0, emoji: '🦋', noun: 'butterflies' },
  { total: 7, takeAway: 2, emoji: '🍌', noun: 'bananas' },
  { total: 8, takeAway: 3, emoji: '🔵', noun: 'buttons' },
  { total: 9, takeAway: 4, emoji: '🌼', noun: 'flowers' },
] as const;

/**
 * Deterministic option builder. Always includes the correct answer, plus
 * near-miss distractors. Stable length of 4, sorted ascending for a calm layout.
 */
export function getTakeAwayOptions(index: number): number[] {
  const round = TAKE_AWAY_ROUNDS[index % TAKE_AWAY_ROUNDS.length];
  const answer = difference(round);
  const opts = new Set<number>([answer]);

  // Near-miss candidates: off-by-one and off-by-two on either side, clamped to 0..total.
  const candidates = [
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    round.total, // "forgot to take any away" trap
    round.takeAway, // "answered the taken-away count" trap
  ];

  for (const c of candidates) {
    if (opts.size >= 4) break;
    if (c >= 0 && c <= round.total && !opts.has(c)) opts.add(c);
  }

  // Backfill if still short (e.g. very small totals) with any valid unused value.
  for (let v = 0; opts.size < 4 && v <= round.total; v++) {
    if (!opts.has(v)) opts.add(v);
  }
  // Absolute backstop so length is always stable at 4 even when total < 3.
  for (let v = 0; opts.size < 4; v++) {
    opts.add(answer + v + 3);
  }

  return Array.from(opts).slice(0, 4).sort((a, b) => a - b);
}

/** Warm feedback for ANY choice. Never says wrong/incorrect/no. */
export function getTakeAwayFeedback(round: TakeAwayRound, selected: number): string {
  const answer = difference(round);
  const { total, takeAway, noun } = round;
  if (selected === answer) {
    return `Correct. ${total} take away ${takeAway} leaves ${answer} ${noun}. You counted the ones still there!`;
  }
  return `Not quite. Start with ${total} ${noun}, cross out ${takeAway}, and count what stays — that leaves ${answer}. ${total} − ${takeAway} = ${answer}.`;
}

/** Short label helper (kept simple; always non-empty). */
export function labelTakeAway(value: number): string {
  return String(value);
}
