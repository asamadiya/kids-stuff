export const WHICH_HAS_MORE_META = {
  id: 'which-has-more',
  title: 'Which Has More?',
  icon: '⚖',
  color: 'leaf',
  tagline: 'Peek at two groups and pick the side with more!',
} as const;

export type Side = 'left' | 'right';

export interface CompareRound {
  readonly id: string;
  readonly emoji: string;
  readonly left: number;
  readonly right: number;
}

// Every round: counts are 1..8 and differ by 1-3, never equal.
export const COMPARE_ROUNDS: readonly CompareRound[] = [
  { id: 'apples', emoji: '🍎', left: 3, right: 5 },
  { id: 'ducks', emoji: '🦆', left: 6, right: 4 },
  { id: 'stars', emoji: '⭐', left: 2, right: 4 },
  { id: 'balloons', emoji: '🎈', left: 7, right: 5 },
  { id: 'fish', emoji: '🐟', left: 4, right: 1 },
  { id: 'flowers', emoji: '🌼', left: 3, right: 6 },
  { id: 'cookies', emoji: '🍪', left: 8, right: 6 },
  { id: 'cats', emoji: '🐱', left: 2, right: 5 },
  { id: 'hearts', emoji: '❤️', left: 5, right: 8 },
  { id: 'frogs', emoji: '🐸', left: 6, right: 3 },
  { id: 'suns', emoji: '☀️', left: 1, right: 3 },
  { id: 'turtles', emoji: '🐢', left: 7, right: 8 },
] as const;

export function sideLabel(side: Side): string {
  return side === 'left' ? 'Left' : 'Right';
}

export function moreSide(round: CompareRound): Side {
  return round.left > round.right ? 'left' : 'right';
}

export function sideCount(round: CompareRound, side: Side): number {
  return side === 'left' ? round.left : round.right;
}

// Two options, always both sides, correct answer always present.
export function getCompareOptions(): readonly Side[] {
  return ['left', 'right'] as const;
}

export function getCompareFeedback(round: CompareRound, selected: Side): string {
  const answer = moreSide(round);
  const moreCount = sideCount(round, answer);
  const lessCount = sideCount(round, answer === 'left' ? 'right' : 'left');
  const moreName = sideLabel(answer);
  if (selected === answer) {
    return `Yes! ${moreName} has ${moreCount}, and ${moreCount} is more than ${lessCount}. Nice counting!`;
  }
  return `Good looking! You picked a side with ${sideCount(round, selected)}. ${moreName} has more — ${moreCount} is more than ${lessCount}.`;
}
