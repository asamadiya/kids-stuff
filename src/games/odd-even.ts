// Pure typed logic for the "Odd or Even" mini-game. No React here.

export type Parity = 'odd' | 'even';

export interface OddEvenRound {
  /** The number the child inspects, 1-20. */
  readonly n: number;
  /** The correct parity, precomputed for readability (validated in tests). */
  readonly answer: Parity;
  /** Playful object emoji used to render the pairing visual. */
  readonly emoji: string;
  /** Plural noun for the objects, used in prompts/feedback. */
  readonly noun: string;
}

export const ODD_EVEN_META = {
  id: 'odd-even',
  title: 'Odd or Even',
  icon: '⚋',
  color: 'coral',
  tagline: 'Pair things up — if everyone has a buddy it’s even, if one is left over it’s odd!',
} as const;

/** True odd/even from the number itself — the single source of truth. */
export const parityOf = (n: number): Parity => (n % 2 === 0 ? 'even' : 'odd');

/** ~14 hand-picked rounds across 1-20 with playful, varied objects. */
export const ODD_EVEN_ROUNDS: readonly OddEvenRound[] = [
  { n: 4, answer: 'even', emoji: '🍎', noun: 'apples' },
  { n: 7, answer: 'odd', emoji: '🐝', noun: 'bees' },
  { n: 2, answer: 'even', emoji: '🧦', noun: 'socks' },
  { n: 9, answer: 'odd', emoji: '⭐', noun: 'stars' },
  { n: 6, answer: 'even', emoji: '🐢', noun: 'turtles' },
  { n: 1, answer: 'odd', emoji: '🎈', noun: 'balloon' },
  { n: 10, answer: 'even', emoji: '🍪', noun: 'cookies' },
  { n: 5, answer: 'odd', emoji: '🐟', noun: 'fish' },
  { n: 8, answer: 'even', emoji: '🦆', noun: 'ducks' },
  { n: 13, answer: 'odd', emoji: '🍓', noun: 'berries' },
  { n: 12, answer: 'even', emoji: '🥚', noun: 'eggs' },
  { n: 15, answer: 'odd', emoji: '🌱', noun: 'sprouts' },
  { n: 16, answer: 'even', emoji: '🔵', noun: 'buttons' },
  { n: 20, answer: 'even', emoji: '🥝', noun: 'kiwis' },
  { n: 19, answer: 'odd', emoji: '🐞', noun: 'ladybugs' },
  { n: 11, answer: 'odd', emoji: '🍌', noun: 'bananas' },
] as const;

/** Options are always the same two, stable length 2, always include the answer. */
export const ODD_EVEN_OPTIONS: readonly Parity[] = ['odd', 'even'];

export const getOddEvenOptions = (_i: number): readonly Parity[] => ODD_EVEN_OPTIONS;

/** Button label: capitalized parity word. */
export const parityLabel = (p: Parity): string => (p === 'odd' ? 'Odd' : 'Even');

/** How many complete pairs and how many are left over. */
export const pairInfo = (n: number): { pairs: number; leftover: number } => ({
  pairs: Math.floor(n / 2),
  leftover: n % 2,
});

/** Warm feedback for ANY choice — affirms, then explains via pairing. Never negative. */
export const getOddEvenFeedback = (round: OddEvenRound, selected: Parity): string => {
  const { pairs } = pairInfo(round.n);
  const correct = selected === round.answer;
  const pairWord = pairs === 1 ? 'pair' : 'pairs';
  if (round.answer === 'even') {
    const why = `Line up the ${round.n} ${round.noun} two-by-two and you get ${pairs} full ${pairWord} with nobody left over — that’s EVEN.`;
    return correct
      ? `Yes! ${round.n} is even. ${why}`
      : `Nice try! ${round.n} is actually even. ${why}`;
  }
  const why = `Pair up the ${round.n} ${round.noun} two-by-two and you make ${pairs} ${pairWord} with exactly 1 left over — one leftover means ODD.`;
  return correct
    ? `Yes! ${round.n} is odd. ${why}`
    : `Good thinking! ${round.n} is actually odd. ${why}`;
};
