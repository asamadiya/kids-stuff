export const MEMORY_PAIRS_META = {
  id: 'memory-pairs',
  title: 'Memory Match',
  icon: '🃏',
  color: 'plum',
  tagline: 'Cards face down. Remember where each one is.',
} as const;

/** Emoji pools — one pool per round. Each pool must hold exactly 4 emojis
 *  so the deck ends up with 8 cards (4 pairs). All age-3-6 friendly. */
export const MEMORY_POOLS: readonly (readonly [string, string, string, string])[] = [
  ['🐶', '🐱', '🐰', '🐸'],
  ['🍎', '🍌', '🍇', '🍓'],
  ['⭐', '🌙', '☀️', '☁️'],
  ['🐝', '🦋', '🐞', '🐌'],
  ['🚗', '🚌', '🚂', '✈️'],
  ['🌻', '🌷', '🌼', '🌹'],
  ['🐠', '🐙', '🐢', '🦀'],
  ['🍓', '🥕', '🌽', '🍅'],
  ['🎨', '✏️', '📚', '✂️'],
  ['🐷', '🐑', '🐄', '🐔'],
  ['🎈', '🎁', '🎂', '🎉'],
  ['🔵', '🟡', '🔴', '🟢'],
] as const;

export interface MemoryCard {
  readonly id: number;
  readonly pairId: number;
  readonly emoji: string;
}

/** Deterministic (seed-free of randomness) layout: for a given round we take the
 *  round's 4-emoji pool, duplicate each into a pair, then interleave the two
 *  halves so identical emojis are not adjacent. Always yields 8 cards / 4 pairs.
 *  A fixed interleave keeps it testable while still feeling shuffled to a child. */
export function buildDeck(round: number): readonly MemoryCard[] {
  const pool = MEMORY_POOLS[round % MEMORY_POOLS.length];
  const first: MemoryCard[] = pool.map((emoji, pairId) => ({ id: pairId, pairId, emoji }));
  const second: MemoryCard[] = pool.map((emoji, pairId) => ({ id: pairId + pool.length, pairId, emoji }));
  // Fixed positional weave: a0 b1 a1 b0 a2 b3 a3 b2 — pure, no adjacency of a pair.
  const order: readonly number[] = [0, 1, 1, 0, 2, 3, 3, 2];
  const deck: MemoryCard[] = [];
  for (let i = 0; i < order.length; i++) {
    const source = i % 2 === 0 ? first : second;
    deck.push(source[order[i]]);
  }
  return deck;
}

export const PAIRS_PER_ROUND = 4;
export const CARDS_PER_ROUND = PAIRS_PER_ROUND * 2;

/** Warm, never-negative feedback for a flip result. */
export function matchFeedback(matched: boolean): string {
  return matched
    ? 'Yay, a match! You remembered where it was.'
    : 'Not quite. Take a peek and remember these two for later.';
}

/** Message shown once every pair is found. */
export function winFeedback(): string {
  return 'You found them all! Your memory is amazing!';
}

/** Gentle hint before the board is solved. */
export function memoryHint(found: number): string {
  const left = PAIRS_PER_ROUND - found;
  if (left <= 0) return 'All pairs found — great job!';
  if (left === 1) return 'Just one pair left — you can do it!';
  return `Tap a card to flip it. ${left} pairs to find.`;
}
