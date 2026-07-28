// Pure typed logic for the "Adding Fun" mini-game.
// Single-digit addition with objects. No React in this module.

export const ADD_WITH_THINGS_META = {
  id: 'add-with-things',
  title: 'Addition',
  icon: '➕',
  color: 'coral',
  tagline: 'Two groups pushed together, and how many that makes.',
} as const;

export interface AddRound {
  /** Count in the first group. */
  readonly left: number;
  /** Count in the second group. */
  readonly right: number;
  /** Emoji used to draw both groups. */
  readonly emoji: string;
  /** Friendly plural name for the objects, e.g. "apples". */
  readonly name: string;
}

/** The correct sum for a round. */
export function sumOf(round: AddRound): number {
  return round.left + round.right;
}

/** 14 varied rounds. Every sum is <= 12 and every count is single-digit. */
export const ADD_ROUNDS: readonly AddRound[] = [
  { left: 3, right: 2, emoji: '🍎', name: 'apples' },
  { left: 4, right: 3, emoji: '🍌', name: 'bananas' },
  { left: 2, right: 2, emoji: '🌱', name: 'seedlings' },
  { left: 5, right: 4, emoji: '🍓', name: 'strawberries' },
  { left: 1, right: 6, emoji: '🐝', name: 'bees' },
  { left: 6, right: 6, emoji: '🔵', name: 'blue dots' },
  { left: 3, right: 4, emoji: '🍊', name: 'oranges' },
  { left: 2, right: 5, emoji: '🥚', name: 'eggs' },
  { left: 4, right: 4, emoji: '🐚', name: 'shells' },
  { left: 7, right: 2, emoji: '🌻', name: 'sunflowers' },
  { left: 5, right: 3, emoji: '🌰', name: 'chestnuts' },
  { left: 6, right: 4, emoji: '🚗', name: 'cars' },
  { left: 3, right: 6, emoji: '🐢', name: 'turtles' },
  { left: 8, right: 4, emoji: '🧀', name: 'cheese slices' },
];

/** Stable number of options every round. */
export const OPTION_COUNT = 4 as const;

/**
 * Deterministic option list for round `i`. Always includes the correct sum,
 * always OPTION_COUNT long, always sorted ascending, no duplicates, no
 * negatives. Distractors are near the answer so choices stay believable.
 */
export function getAddOptions(i: number): number[] {
  const round = ADD_ROUNDS[i % ADD_ROUNDS.length];
  const answer = sumOf(round);

  // Deterministic candidate deltas seeded from the round index so lists vary
  // but are reproducible.
  const deltaOrder = [-1, 1, -2, 2, 3, -3, 4];
  const rotate = i % deltaOrder.length;

  const opts = new Set<number>([answer]);
  for (let k = 0; opts.size < OPTION_COUNT && k < deltaOrder.length * 2; k++) {
    const delta = deltaOrder[(k + rotate) % deltaOrder.length];
    const candidate = answer + delta;
    if (candidate >= 0) opts.add(candidate);
  }
  // Fallback padding in the unlikely event we still need more (answer near 0).
  let pad = answer + 5;
  while (opts.size < OPTION_COUNT) {
    opts.add(pad);
    pad++;
  }

  return [...opts].sort((a, b) => a - b);
}

/** Warm, never-negative feedback for any selection. */
export function getAddFeedback(round: AddRound, selected: number): string {
  const answer = sumOf(round);
  const { left, right, name } = round;
  if (selected === answer) {
    return `Correct. ${left} ${name} and ${right} more make ${answer} altogether.`;
  }
  return `Not quite. Count them all: ${left} plus ${right} is ${answer} ${name} in total.`;
}

/** Hint shown before answering. */
export function getAddHint(round: AddRound): string {
  return `Count the first group, then keep counting the ${round.name} in the second group.`;
}
