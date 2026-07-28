export const COUNT_WITH_RIKKI_META = {
  id: 'count-with-rikki',
  title: 'Counting to Ten',
  icon: '123',
  color: 'sun',
  tagline: 'Counting from one to ten, one object at a time.',
} as const;

export interface CountRound {
  readonly id: string;
  readonly emoji: string;
  readonly count: number;
  readonly name: string;
}

export const COUNT_ROUNDS: readonly CountRound[] = [
  { id: 'one-apple', emoji: '🍎', count: 1, name: 'apple' },
  { id: 'two-turtles', emoji: '🐢', count: 2, name: 'turtles' },
  { id: 'three-stars', emoji: '🌱', count: 3, name: 'seedlings' },
  { id: 'four-ducks', emoji: '🦆', count: 4, name: 'ducks' },
  { id: 'five-flowers', emoji: '🌸', count: 5, name: 'flowers' },
  { id: 'six-frogs', emoji: '🐸', count: 6, name: 'frogs' },
  { id: 'seven-strawberries', emoji: '🍓', count: 7, name: 'strawberries' },
  { id: 'eight-fish', emoji: '🥚', count: 8, name: 'eggs' },
  { id: 'nine-bees', emoji: '🐝', count: 9, name: 'bees' },
  { id: 'ten-balloons', emoji: '🐚', count: 10, name: 'shells' },
  { id: 'three-cats', emoji: '🐱', count: 3, name: 'cats' },
  { id: 'five-suns', emoji: '☀️', count: 5, name: 'suns' },
] as const;

const OPTION_COUNT = 4;

export function countLabel(n: number): string {
  return String(n);
}

export function getCountOptions(index: number): readonly number[] {
  const round = COUNT_ROUNDS[index % COUNT_ROUNDS.length];
  const answer = round.count;
  const options: number[] = [answer];
  // Deterministic distractors: walk outward from the answer, staying in 1..10.
  let step = 1;
  while (options.length < OPTION_COUNT) {
    const lower = answer - step;
    const higher = answer + step;
    if (higher <= 10 && !options.includes(higher)) options.push(higher);
    if (options.length < OPTION_COUNT && lower >= 1 && !options.includes(lower)) {
      options.push(lower);
    }
    step += 1;
    if (step > 10) break;
  }
  // Deterministic ordering so the answer is not always in the same slot.
  return [...options].sort((a, b) => ((a + index) % OPTION_COUNT) - ((b + index) % OPTION_COUNT));
}

export function getCountFeedback(round: CountRound, selected: number): string {
  if (selected === round.count) {
    return `Correct. There are ${round.count} ${round.name}.`;
  }
  return `Nice try picking ${selected}! Let's count together — there are ${round.count} ${round.name}.`;
}
