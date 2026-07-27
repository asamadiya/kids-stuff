export const RHYME_TIME_META = {
  id: 'rhyme-time',
  title: 'Rhymes',
  icon: '🎵',
  color: 'grape',
  tagline: 'Words that end with the same sound.',
} as const;

export interface RhymeRound {
  readonly id: string;
  readonly target: string;
  readonly emoji: string;
  readonly rhyme: string;
  readonly distractors: readonly [string, string];
}

export const RHYME_ROUNDS: readonly RhymeRound[] = [
  { id: 'cat-hat', target: 'cat', emoji: '🐱', rhyme: 'hat', distractors: ['dog', 'sun'] },
  { id: 'dog-frog', target: 'dog', emoji: '🐶', rhyme: 'frog', distractors: ['cake', 'bird'] },
  { id: 'bee-tree', target: 'bee', emoji: '🐝', rhyme: 'tree', distractors: ['moon', 'car'] },
  { id: 'star-car', target: 'star', emoji: '⭐', rhyme: 'car', distractors: ['fish', 'ball'] },
  { id: 'sun-bun', target: 'sun', emoji: '☀️', rhyme: 'bun', distractors: ['boat', 'leaf'] },
  { id: 'ball-wall', target: 'ball', emoji: '⚽', rhyme: 'wall', distractors: ['duck', 'shoe'] },
  { id: 'fish-dish', target: 'fish', emoji: '🐟', rhyme: 'dish', distractors: ['rock', 'hand'] },
  { id: 'moon-spoon', target: 'moon', emoji: '🌙', rhyme: 'spoon', distractors: ['tree', 'kite'] },
  { id: 'bear-chair', target: 'bear', emoji: '🐻', rhyme: 'chair', distractors: ['milk', 'frog'] },
  { id: 'mouse-house', target: 'mouse', emoji: '🐭', rhyme: 'house', distractors: ['apple', 'snow'] },
  { id: 'snake-cake', target: 'snake', emoji: '🐍', rhyme: 'cake', distractors: ['door', 'star'] },
  { id: 'goat-boat', target: 'goat', emoji: '🐐', rhyme: 'boat', distractors: ['ring', 'leaf'] },
];

export function rhymeLabel(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getRhymeOptions(index: number): readonly string[] {
  const round = RHYME_ROUNDS[index % RHYME_ROUNDS.length];
  const options = [round.rhyme, round.distractors[0], round.distractors[1]];
  // Deterministic rotation so the correct answer is not always in the same slot.
  const shift = index % options.length;
  const rotated: string[] = [];
  for (let i = 0; i < options.length; i++) {
    rotated.push(options[(i + shift) % options.length]);
  }
  return rotated;
}

export function getRhymePrompt(round: RhymeRound): string {
  return `Which word rhymes with ${round.target.toUpperCase()}?`;
}

export function getRhymeFeedback(round: RhymeRound, selected: string): string {
  const target = rhymeLabel(round.target);
  const rhyme = rhymeLabel(round.rhyme);
  if (selected === round.rhyme) {
    return `Correct. ${target} and ${rhyme} rhyme — they end with the same sound.`;
  }
  return `${rhymeLabel(selected)} is a fun word! ${target} rhymes with ${rhyme} — they end with the same sound.`;
}
