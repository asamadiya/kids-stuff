// Take Away — subtraction within 10 with objects.
// Pure typed logic module. No React.
//
// The objects come from the vetted NOUNS table rather than being typed inline.
// A round here once carried U+1F38E JAPANESE DOLLS while calling them "eggs",
// and because that glyph draws two figures, nine "eggs" rendered as eighteen.
import { NOUNS, counted, type Noun } from './nouns';

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
  /** The object being counted: glyph and both word forms, from NOUNS. */
  item: Noun;
}

/** The answer is always total - takeAway. */
export function difference(round: TakeAwayRound): number {
  return round.total - round.takeAway;
}

export const TAKE_AWAY_ROUNDS: readonly TakeAwayRound[] = [
  { total: 5, takeAway: 2, item: NOUNS.seed },
  { total: 4, takeAway: 1, item: NOUNS.shell },
  { total: 6, takeAway: 3, item: NOUNS.stone },
  { total: 3, takeAway: 2, item: NOUNS.feather },
  { total: 7, takeAway: 4, item: NOUNS.brick },
  { total: 8, takeAway: 5, item: NOUNS.chestnut },
  { total: 5, takeAway: 5, item: NOUNS.spoon },
  { total: 9, takeAway: 3, item: NOUNS.egg },
  { total: 6, takeAway: 2, item: NOUNS.key },
  { total: 10, takeAway: 6, item: NOUNS.leaf },
  { total: 4, takeAway: 0, item: NOUNS.carrot },
  { total: 7, takeAway: 2, item: NOUNS.bolt },
  { total: 8, takeAway: 3, item: NOUNS.sock },
  { total: 9, takeAway: 4, item: NOUNS.candle },
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
  const { total, takeAway, item } = round;
  if (selected === answer) {
    return `Correct. ${total} take away ${takeAway} leaves ${counted(answer, item)}. You counted the ones still there!`;
  }
  return `Not quite. Start with ${counted(total, item)}, cross out ${takeAway}, and count what stays — that leaves ${answer}. ${total} − ${takeAway} = ${answer}.`;
}

/** Short label helper (kept simple; always non-empty). */
export function labelTakeAway(value: number): string {
  return String(value);
}
