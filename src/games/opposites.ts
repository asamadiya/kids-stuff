export const OPPOSITES_META = {
  id: 'opposites',
  title: 'Opposites',
  icon: '↔',
  color: 'coral',
  tagline: 'Big and small, hot and cold — pairs that sit at either end.',
} as const;

export interface OppositeRound {
  readonly id: string;
  readonly word: string;
  readonly emoji: string;
  readonly opposite: string;
  readonly distractors: readonly [string, string];
}

export const OPPOSITE_ROUNDS: readonly OppositeRound[] = [
  { id: 'big', word: 'BIG', emoji: '🐘', opposite: 'small', distractors: ['tall', 'round'] },
  { id: 'hot', word: 'HOT', emoji: '☀️', opposite: 'cold', distractors: ['wet', 'soft'] },
  { id: 'up', word: 'UP', emoji: '⬆️', opposite: 'down', distractors: ['over', 'near'] },
  { id: 'day', word: 'DAY', emoji: '🌞', opposite: 'night', distractors: ['week', 'sky'] },
  { id: 'fast', word: 'FAST', emoji: '🐇', opposite: 'slow', distractors: ['loud', 'far'] },
  { id: 'happy', word: 'HAPPY', emoji: '😄', opposite: 'sad', distractors: ['sleepy', 'silly'] },
  { id: 'open', word: 'OPEN', emoji: '🚪', opposite: 'shut', distractors: ['clean', 'new'] },
  { id: 'wet', word: 'WET', emoji: '💧', opposite: 'dry', distractors: ['cool', 'blue'] },
  { id: 'loud', word: 'LOUD', emoji: '📣', opposite: 'quiet', distractors: ['bright', 'long'] },
  { id: 'full', word: 'FULL', emoji: '🥛', opposite: 'empty', distractors: ['heavy', 'cold'] },
  { id: 'in', word: 'IN', emoji: '📥', opposite: 'out', distractors: ['under', 'beside'] },
  { id: 'high', word: 'HIGH', emoji: '🎈', opposite: 'low', distractors: ['wide', 'far'] },
] as const;

export function oppositeLabel(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

export function getOppositeOptions(index: number): readonly string[] {
  const round = OPPOSITE_ROUNDS[index % OPPOSITE_ROUNDS.length];
  const pool = [round.opposite, round.distractors[0], round.distractors[1]];
  // Deterministic rotation so the correct answer isn't always first,
  // while always including the correct answer.
  const shift = index % pool.length;
  return [...pool.slice(shift), ...pool.slice(0, shift)];
}

export function getOppositeFeedback(round: OppositeRound, selected: string): string {
  const wordLower = round.word.toLowerCase();
  if (selected === round.opposite) {
    return `Yes! The opposite of ${wordLower} is ${round.opposite}. What a perfect pair!`;
  }
  return `Nice thinking! ${oppositeLabel(selected)} is a fun word. The opposite of ${wordLower} is ${round.opposite} — ${wordLower} and ${round.opposite} go together!`;
}
