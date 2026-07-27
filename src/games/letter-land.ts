export const LETTER_LAND_META = {
  id: 'letter-land',
  title: 'First Letters',
  icon: 'Aa',
  color: 'leaf',
  tagline: 'The sound a word starts with, and the letter that writes it.',
} as const;

export type Letter =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N'
  | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U'
  | 'V' | 'W' | 'X' | 'Y' | 'Z';

export interface LetterRound {
  readonly id: string;
  /** The everyday word, lowercase, matching the emoji. */
  readonly word: string;
  /** Big emoji shown on the stage. */
  readonly emoji: string;
  /** The correct starting letter (uppercase). */
  readonly letter: Letter;
  /** A couple of wrong-but-friendly distractor letters. */
  readonly distractors: readonly Letter[];
}

export const LETTER_ROUNDS: readonly LetterRound[] = [
  { id: 'apple', word: 'apple', emoji: '🍎', letter: 'A', distractors: ['P', 'L'] },
  { id: 'bee', word: 'bee', emoji: '🐝', letter: 'B', distractors: ['D', 'E', 'P'] },
  { id: 'cat', word: 'cat', emoji: '🐱', letter: 'C', distractors: ['A', 'T'] },
  { id: 'dog', word: 'dog', emoji: '🐶', letter: 'D', distractors: ['B', 'O', 'G'] },
  { id: 'egg', word: 'egg', emoji: '🥚', letter: 'E', distractors: ['G', 'F'] },
  { id: 'fish', word: 'fish', emoji: '🐟', letter: 'F', distractors: ['S', 'H', 'E'] },
  { id: 'grapes', word: 'grapes', emoji: '🍇', letter: 'G', distractors: ['C', 'P'] },
  { id: 'hat', word: 'hat', emoji: '🐒', letter: 'H', distractors: ['A', 'T', 'N'] },
  { id: 'igloo', word: 'igloo', emoji: '🏠', letter: 'I', distractors: ['L', 'O'] },
  { id: 'kite', word: 'kite', emoji: '🪁', letter: 'K', distractors: ['T', 'I', 'C'] },
  { id: 'leaf', word: 'leaf', emoji: '🍁', letter: 'L', distractors: ['F', 'E'] },
  { id: 'moon', word: 'moon', emoji: '🌙', letter: 'M', distractors: ['N', 'O', 'W'] },
  { id: 'owl', word: 'owl', emoji: '🦉', letter: 'O', distractors: ['A', 'W'] },
  { id: 'pig', word: 'pig', emoji: '🐷', letter: 'P', distractors: ['B', 'G', 'D'] },
  { id: 'rain', word: 'rain', emoji: '🌧️', letter: 'R', distractors: ['N', 'A' ] },
  { id: 'sun', word: 'sun', emoji: '☀️', letter: 'S', distractors: ['C', 'U', 'N'] },
  { id: 'tree', word: 'tree', emoji: '🌳', letter: 'T', distractors: ['E', 'R'] },
  { id: 'umbrella', word: 'umbrella', emoji: '☂️', letter: 'U', distractors: ['O', 'A', 'M'] },
] as const;

export const OPTION_COUNT = 3;

/** Title-case a word for warm feedback, e.g. "apple" -> "Apple". */
export function wordTitle(word: string): string {
  if (word.length === 0) return word;
  return word[0].toUpperCase() + word.slice(1);
}

/**
 * Deterministic option list for a round: always exactly OPTION_COUNT letters,
 * always including the correct answer, filled from the round's distractors.
 * The correct answer's slot is rotated by the round index so it is not always
 * in the same position.
 */
export function getLetterOptions(index: number): readonly Letter[] {
  const round = LETTER_ROUNDS[index % LETTER_ROUNDS.length];
  const distractors = round.distractors.slice(0, OPTION_COUNT - 1);
  const slot = index % OPTION_COUNT;
  const opts: Letter[] = [];
  let d = 0;
  for (let i = 0; i < OPTION_COUNT; i++) {
    if (i === slot) {
      opts.push(round.letter);
    } else {
      opts.push(distractors[d]);
      d++;
    }
  }
  return opts;
}

/** Warm feedback for ANY choice. Correct or not, we affirm and teach. */
export function getLetterFeedback(round: LetterRound, selected: Letter): string {
  const title = wordTitle(round.word);
  const L = round.letter;
  const teach = `${title} starts with ${L}. ${L} ${L.toLowerCase()} ${round.word}!`;
  if (selected === L) {
    return `Correct. ${teach}`;
  }
  return `Nice try with ${selected}! Look here: ${teach}`;
}
