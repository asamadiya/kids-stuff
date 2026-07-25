// Share It Fairly — division as fair sharing (exact division only).
// Pure typed logic module. No React.

export const SHARE_FAIRLY_META = {
  id: 'share-fairly',
  title: 'Sharing Equally',
  icon: '➗',
  color: 'coral',
  tagline: 'Twelve biscuits across four plates. Division as fair sharing.',
} as const;

export interface ShareRound {
  /** Total number of things to share. */
  total: number;
  /** Number of groups (plates) to share across. */
  plates: number;
  /** Emoji for the thing being shared. */
  item: string;
  /** Plural noun for the thing being shared. */
  itemName: string;
  /** Emoji used to draw each plate/group. */
  plate: string;
  /** Singular noun for the group (e.g. "plate", "basket"). */
  plateName: string;
}

/** total must be exactly divisible by plates for every round. */
export const SHARE_ROUNDS: readonly ShareRound[] = [
  { total: 12, plates: 4, item: '🍪', itemName: 'cookies', plate: '🍽️', plateName: 'plate' },
  { total: 6, plates: 2, item: '🍎', itemName: 'apples', plate: '🧺', plateName: 'basket' },
  { total: 10, plates: 5, item: '🍌', itemName: 'bananas', plate: '🐒', plateName: 'monkey' },
  { total: 8, plates: 2, item: '🍕', itemName: 'pizza slices', plate: '🍽️', plateName: 'plate' },
  { total: 9, plates: 3, item: '🎈', itemName: 'balloons', plate: '🧒', plateName: 'kid' },
  { total: 15, plates: 3, item: '🍓', itemName: 'strawberries', plate: '🥣', plateName: 'bowl' },
  { total: 12, plates: 3, item: '🐟', itemName: 'fish', plate: '🐱', plateName: 'cat' },
  { total: 16, plates: 4, item: '🧁', itemName: 'cupcakes', plate: '🎂', plateName: 'party table' },
  { total: 14, plates: 2, item: '🦴', itemName: 'bones', plate: '🐶', plateName: 'dog' },
  { total: 20, plates: 5, item: '⭐', itemName: 'stickers', plate: '📓', plateName: 'notebook' },
  { total: 18, plates: 3, item: '🍇', itemName: 'grapes', plate: '🐦', plateName: 'bird' },
  { total: 21, plates: 3, item: '🥕', itemName: 'carrots', plate: '🐰', plateName: 'bunny' },
  { total: 24, plates: 4, item: '🍬', itemName: 'candies', plate: '👜', plateName: 'bag' },
  { total: 12, plates: 6, item: '🥚', itemName: 'eggs', plate: '🍳', plateName: 'pan' },
];

/** The exact fair-share quotient for a round. */
export function shareAnswer(round: ShareRound): number {
  return round.total / round.plates;
}

const OPTION_COUNT = 4;

/**
 * Deterministic option list of length OPTION_COUNT, always including the
 * correct quotient. Distractors are near the answer but never equal to it,
 * and never below 1. Order is deterministic (varies per index) so buttons
 * feel shuffled without randomness.
 */
export function getShareOptions(index: number): number[] {
  const round = SHARE_ROUNDS[index % SHARE_ROUNDS.length];
  const answer = shareAnswer(round);

  const distractors: number[] = [];
  // Candidate wrong answers, in priority order, filtered to be valid & unique.
  const candidates = [answer + 1, answer - 1, answer + 2, answer + 3, answer - 2];
  for (const c of candidates) {
    if (c >= 1 && c !== answer && !distractors.includes(c)) {
      distractors.push(c);
    }
    if (distractors.length === OPTION_COUNT - 1) break;
  }

  const pool = [answer, ...distractors];
  // Deterministic rotation so the answer isn't always first.
  const shift = index % pool.length;
  return [...pool.slice(shift), ...pool.slice(0, shift)];
}

/** Warm, no-fail feedback for any selection. */
export function getShareFeedback(round: ShareRound, selected: number): string {
  const answer = shareAnswer(round);
  const each = `${answer} ${round.itemName} on each ${round.plateName}`;
  if (selected === answer) {
    return `Yes! ${round.total} shared into ${round.plates} equal groups is ${answer} each — every ${round.plateName} gets the same. That's dividing!`;
  }
  return `Nice try! When you share ${round.total} ${round.itemName} fairly across ${round.plates} ${round.plateName}s, it's ${each}. ${round.plates} groups of ${answer} makes ${round.plates} × ${answer} = ${round.total}.`;
}

/** Short hint shown before answering. */
export function getShareHint(round: ShareRound): string {
  return `Give one ${round.itemName.replace(/s$/, '')} to each ${round.plateName}, then go around again until they're gone. Equal piles!`;
}
