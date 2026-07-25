// Pure typed logic module for the "Which Is Bigger?" comparison game.
// No React. Deterministic helpers that always include the correct answer.

export const COMPARE_NUMBERS_META = {
  id: 'compare-numbers',
  title: 'Comparing Numbers',
  icon: '⚖',
  color: 'sky',
  tagline: 'Thirty-four or forty-three: read the tens first.',
} as const;

// A round compares two numbers. The answer is the value that is bigger,
// or the sentinel EQUAL when the two numbers are the same.
export const EQUAL = 'equal' as const;
export type CompareChoice = number | typeof EQUAL;

export interface CompareRound {
  readonly a: number;
  readonly b: number;
}

export const COMPARE_ROUNDS: readonly CompareRound[] = [
  { a: 34, b: 43 },
  { a: 71, b: 17 },
  { a: 58, b: 85 },
  { a: 26, b: 62 },
  { a: 90, b: 9 },
  { a: 40, b: 40 },
  { a: 23, b: 32 },
  { a: 67, b: 76 },
  { a: 100, b: 99 },
  { a: 45, b: 54 },
  { a: 88, b: 88 },
  { a: 13, b: 31 },
  { a: 72, b: 27 },
  { a: 60, b: 6 },
] as const;

// The mathematically correct answer for a round.
export function getCompareAnswer(round: CompareRound): CompareChoice {
  if (round.a === round.b) return EQUAL;
  return round.a > round.b ? round.a : round.b;
}

// Deterministic option list for a round. Always contains both numbers.
// When the numbers are equal we also offer the EQUAL choice (the answer);
// otherwise EQUAL is offered as a plausible-but-not-correct third option so
// the list has a stable length of 3 and always includes the answer.
export function getCompareOptions(round: CompareRound): readonly CompareChoice[] {
  // Smaller value first, larger second, EQUAL last — stable, deterministic order.
  const low = Math.min(round.a, round.b);
  const high = Math.max(round.a, round.b);
  return [low, high, EQUAL];
}

// The tens digit of a non-negative integer (100 -> 10 tens groups, still valid).
function tensCount(n: number): number {
  return Math.floor(n / 10);
}

function onesCount(n: number): number {
  return n % 10;
}

// Label shown on an option button.
export function getCompareLabel(choice: CompareChoice): string {
  return choice === EQUAL ? 'They are equal' : String(choice);
}

// The hint shown before answering.
export function getCompareHint(): string {
  return 'Tip: compare the tens first. More tens means a bigger number!';
}

// Warm feedback for ANY selection. Explains tens-first reasoning, positively.
export function getCompareFeedback(round: CompareRound, selected: CompareChoice): string {
  const answer = getCompareAnswer(round);
  const correct = selected === answer;

  if (answer === EQUAL) {
    const t = tensCount(round.a);
    const o = onesCount(round.a);
    const same = `Both have ${t} ten${t === 1 ? '' : 's'} and ${o} one${o === 1 ? '' : 's'}, so ${round.a} = ${round.b} — they are equal!`;
    return correct ? `Yes! ${same}` : `Good thinking! ${same}`;
  }

  const big = answer;
  const small = round.a === big ? round.b : round.a;
  const bigT = tensCount(big);
  const smallT = tensCount(small);

  const why =
    bigT === smallT
      ? `Both have ${bigT} ten${bigT === 1 ? '' : 's'}, so we check the ones: ${onesCount(big)} beats ${onesCount(small)}. That makes ${big} bigger than ${small}.`
      : `${big} has ${bigT} ten${bigT === 1 ? '' : 's'} and ${small} has only ${smallT} ten${smallT === 1 ? '' : 's'}, so ${big} is bigger.`;

  return correct ? `That's it! ${why}` : `Nice try! ${big} is the bigger one. ${why}`;
}
