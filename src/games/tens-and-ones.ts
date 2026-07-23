// Pure typed logic for the "Tens and Ones" place-value mini-game.
// No React here — just data rounds and deterministic pure helpers.

export const TENS_AND_ONES_META = {
  id: 'tens-and-ones',
  title: 'Tens and Ones',
  icon: '\u{1F51F}',
  color: 'sky',
  tagline: 'Stack up tens and ones to build big two-digit numbers!',
} as const;

export interface TensOnesRound {
  /** number of ten-rods */
  tens: number;
  /** number of loose ones */
  ones: number;
}

/** The correct total for a round: tens*10 + ones. */
export function roundTotal(round: TensOnesRound): number {
  return round.tens * 10 + round.ones;
}

// 14 hand-picked rounds, all totals in 11..99, varied across the range.
export const TENS_ONES_ROUNDS: readonly TensOnesRound[] = [
  { tens: 3, ones: 4 }, // 34
  { tens: 1, ones: 7 }, // 17
  { tens: 5, ones: 2 }, // 52
  { tens: 2, ones: 6 }, // 26
  { tens: 4, ones: 0 }, // 40
  { tens: 6, ones: 3 }, // 63
  { tens: 7, ones: 5 }, // 75
  { tens: 2, ones: 9 }, // 29
  { tens: 8, ones: 1 }, // 81
  { tens: 5, ones: 8 }, // 58
  { tens: 9, ones: 9 }, // 99
  { tens: 1, ones: 1 }, // 11
  { tens: 4, ones: 7 }, // 47
  { tens: 6, ones: 6 }, // 66
] as const;

export const TENS_ONES_OPTION_COUNT = 4;

/**
 * Deterministic option list for a round. Always length TENS_ONES_OPTION_COUNT,
 * always includes the correct answer, values in 10..99, no duplicates.
 * Distractors are chosen from place-value confusions kids actually make:
 * swapped digits, off-by-ten, off-by-one.
 */
export function getTensOnesOptions(index: number): number[] {
  const round = TENS_ONES_ROUNDS[index % TENS_ONES_ROUNDS.length];
  const answer = roundTotal(round);

  const clamp = (n: number): number => Math.max(10, Math.min(99, n));

  // Candidate distractors ordered by how instructive they are.
  const swapped = clamp(round.ones * 10 + round.tens); // classic place-value swap
  const candidates: number[] = [
    swapped,
    clamp(answer + 10),
    clamp(answer - 10),
    clamp(answer + 1),
    clamp(answer - 1),
    clamp(answer + 20),
  ];

  const opts: number[] = [answer];
  for (const c of candidates) {
    if (opts.length >= TENS_ONES_OPTION_COUNT) break;
    if (!opts.includes(c)) opts.push(c);
  }

  // Safety net: fill any remaining slots with unused nearby values.
  let filler = 10;
  while (opts.length < TENS_ONES_OPTION_COUNT) {
    if (!opts.includes(filler)) opts.push(filler);
    filler += 1;
  }

  // Deterministic shuffle keyed by index so the answer isn't always first.
  const rotation = index % TENS_ONES_OPTION_COUNT;
  return opts.slice(rotation).concat(opts.slice(0, rotation));
}

/** Warm feedback for any choice. Never negative; explains the place value. */
export function getTensOnesFeedback(round: TensOnesRound, selected: number): string {
  const answer = roundTotal(round);
  const tensWord = round.tens === 1 ? '1 ten' : `${round.tens} tens`;
  const onesWord = round.ones === 1 ? '1 one' : `${round.ones} ones`;
  const explain = `${tensWord} and ${onesWord} make ${answer}.`;

  if (selected === answer) {
    return `Yes! ${explain}`;
  }
  return `Nice thinking! ${explain} Each ten is worth 10, so ${round.tens}×10 is ${round.tens * 10}, plus ${round.ones} more.`;
}

/** Short reusable prompt string. */
export function getTensOnesPrompt(): string {
  return 'How many blocks in all?';
}
