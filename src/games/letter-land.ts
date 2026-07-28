import { placeOptions } from './options';

/**
 * First Letters — the sound a word starts with, and the letter that writes it.
 *
 * The shipped question was `Which letter does ${wordTitle(round.word)} start
 * with?`, which rendered as "Which letter does **A**pple start with?" above
 * buttons A / P / L. The answer was the first character of the question. The
 * stimulus was also a raw emoji, and three of them did not match their word at
 * all — "hat" drew a monkey, "igloo" drew a house — while one round was a fish.
 *
 * So the word is now shown with its first letter missing and is spoken aloud;
 * the question is a constant with nothing interpolated into it, so no round
 * data can leak into it; and the starting letter is *derived* from the word
 * rather than typed beside it, which makes "the letter and the word disagree"
 * impossible to express. There are no pictures at all: a masked word and a
 * voice are the two channels this exercise actually needs.
 */

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
  /** The word, lowercase, letters only. The starting letter is read off this. */
  readonly word: string;
  /** One plain fact about the thing. Not a story about it. */
  readonly note: string;
}

/**
 * The question. A constant, not a template: the defect was a word interpolated
 * into this sentence, and a sentence with nothing to interpolate cannot repeat
 * it.
 */
export const LETTER_QUESTION = 'Which letter does this word start with?';

export const LETTER_ROUNDS: readonly LetterRound[] = [
  { word: 'apple', note: 'An apple carries its seeds in the core, in the middle.' },
  { word: 'bridge', note: 'A bridge carries a road over water without touching it.' },
  { word: 'cloud', note: 'A cloud is water drops too small and too light to fall.' },
  { word: 'drum', note: 'A drum sounds because its tight skin shakes the air.' },
  { word: 'egg', note: 'An eggshell is made of the same stuff as chalk.' },
  { word: 'feather', note: 'A feather keeps a bird warm and pushes against the air when it flies.' },
  { word: 'glass', note: 'Glass is sand that has been melted and then cooled.' },
  { word: 'hammer', note: 'A hammer works because its head is heavy and moves fast.' },
  { word: 'ice', note: 'Ice floats because water takes up more room once it freezes.' },
  { word: 'jar', note: 'A jar keeps the air out, so what is inside stays dry.' },
  { word: 'kite', note: 'A kite climbs because the wind pushes on its tilted face.' },
  { word: 'leaf', note: 'A leaf makes food for the plant out of light, air and water.' },
  { word: 'moon', note: 'The Moon makes no light of its own. It shines with light from the Sun.' },
  { word: 'nest', note: 'A nest holds eggs together in one place so they stay warm.' },
  { word: 'owl', note: 'An owl flies quietly because the edges of its feathers are soft.' },
  { word: 'pencil', note: 'A pencil writes with graphite, not with lead.' },
  { word: 'river', note: 'A river always runs downhill, from high ground towards the sea.' },
  { word: 'stone', note: 'A stone is a piece broken off a larger rock.' },
  { word: 'tree', note: 'A tree adds one ring of wood each year, so its rings count its years.' },
  { word: 'umbrella', note: 'An umbrella works because cloth stretched tight sheds water.' },
  { word: 'violin', note: 'A violin sounds because a stretched string shakes the air.' },
  { word: 'wheel', note: 'A wheel turns on an axle, so a load rolls instead of dragging.' },
  { word: 'yarn', note: 'Yarn is short fibres twisted until they grip each other.' },
  { word: 'zip', note: 'A zip closes with two rows of teeth that lock together one at a time.' },
];

export const OPTION_COUNT = 3;

/** A round is named by its word; nothing else can drift out of step with it. */
export function roundId(round: LetterRound): string {
  return round.word;
}

/** The answer, read off the word. Never stored beside it, so it cannot disagree. */
export function letterOf(round: LetterRound): Letter {
  return round.word[0].toUpperCase() as Letter;
}

/**
 * What is shown: the word with its first letter taken away. Derived, so no
 * round can accidentally print the letter it is asking for.
 */
export function maskedTail(round: LetterRound): string {
  return round.word.slice(1);
}

/** Letters that look or sound close enough to be worth confusing. */
const CONFUSABLE: Record<Letter, readonly Letter[]> = {
  A: ['E', 'O'], B: ['D', 'P'], C: ['S', 'G'], D: ['B', 'P'], E: ['F', 'A'],
  F: ['E', 'T'], G: ['C', 'J'], H: ['N', 'K'], I: ['J', 'L'], J: ['I', 'G'],
  K: ['X', 'H'], L: ['I', 'T'], M: ['N', 'W'], N: ['M', 'H'], O: ['Q', 'C'],
  P: ['B', 'R'], Q: ['O', 'P'], R: ['P', 'B'], S: ['C', 'Z'], T: ['F', 'L'],
  U: ['V', 'O'], V: ['U', 'W'], W: ['M', 'V'], X: ['K', 'Y'], Y: ['V', 'X'],
  Z: ['S', 'N'],
};

/**
 * Wrong answers, in order of teaching value: first a letter that really is in
 * the word but not at the front — much the commonest mistake — then letters
 * that are easy to confuse with the right one. Built from the word, so a
 * distractor equal to the answer is not something to remember not to type.
 */
export function letterDistractors(round: LetterRound): Letter[] {
  const answer = letterOf(round);
  const out: Letter[] = [];
  const add = (letter: Letter) => {
    if (letter !== answer && !out.includes(letter)) out.push(letter);
  };
  for (const ch of maskedTail(round)) add(ch.toUpperCase() as Letter);
  for (const near of CONFUSABLE[answer]) add(near);
  return out;
}

export function getLetterOptions(index: number): readonly Letter[] {
  const i = ((index % LETTER_ROUNDS.length) + LETTER_ROUNDS.length) % LETTER_ROUNDS.length;
  const round = LETTER_ROUNDS[i];
  return placeOptions({
    gameId: LETTER_LAND_META.id,
    roundIndex: i,
    answer: letterOf(round),
    distractors: letterDistractors(round),
    count: OPTION_COUNT,
  });
}

/** Title-case a word for the feedback, e.g. "apple" -> "Apple". */
export function wordTitle(word: string): string {
  if (word.length === 0) return word;
  return word[0].toUpperCase() + word.slice(1);
}

/** Said only after a choice is made, when naming the word gives nothing away. */
export function getLetterFeedback(round: LetterRound, selected: Letter): string {
  const answer = letterOf(round);
  const title = wordTitle(round.word);
  if (selected === answer) {
    return `Correct. ${title} starts with ${answer}. ${round.note}`;
  }
  return `${title} starts with ${answer}, not ${selected}. ${round.note}`;
}
