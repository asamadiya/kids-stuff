export const WHICH_HAS_MORE_META = {
  id: 'which-has-more',
  title: 'Comparing Amounts',
  icon: '⚖',
  color: 'leaf',
  tagline: 'Two groups, compared. Which holds more, and by how many.',
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
  { id: 'seedlings', emoji: '🌱', left: 2, right: 4 },
  { id: 'shells', emoji: '🐚', left: 7, right: 5 },
  { id: 'eggs', emoji: '🥚', left: 4, right: 1 },
  { id: 'flowers', emoji: '🌼', left: 3, right: 6 },
  { id: 'chestnuts', emoji: '🌰', left: 8, right: 6 },
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
    return `Correct. ${moreName} has ${moreCount}, and ${moreCount} is more than ${lessCount}.`;
  }
  return `Not quite. You picked a side with ${sideCount(round, selected)}. ${moreName} has more — ${moreCount} is more than ${lessCount}.`;
}
