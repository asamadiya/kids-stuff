export const TIMES_TABLES_META = {
  id: 'times-tables',
  title: 'Multiplication: 2s, 5s, 10s',
  icon: '✖',
  color: 'sun',
  tagline: 'The twos, fives and tens, shown as rows and columns of dots.',
} as const;

export interface TimesRound {
  /** left factor (rows in the dot array) */
  a: number;
  /** right factor (columns in the dot array) */
  b: number;
}

/** The one true answer for a round. */
export function timesProduct(round: TimesRound): number {
  return round.a * round.b;
}

/** Human-friendly question string, e.g. "5 × 3 = ?" */
export function timesQuestion(round: TimesRound): string {
  return `${round.a} × ${round.b} = ?`;
}

/** A gentle skip-counting hint keyed off the times-table family. */
export function timesHint(round: TimesRound): string {
  const step = round.a;
  return `Count by ${step}s, ${round.b} time${round.b === 1 ? '' : 's'}. Tap the total!`;
}

/**
 * ~15 rounds spread across the 2×, 5× and 10× families.
 * Left factor is always the "table" (2, 5, or 10) so the visual grid and
 * skip-count hint stay tidy.
 */
export const TIMES_ROUNDS: readonly TimesRound[] = [
  // 2 times table
  { a: 2, b: 1 },
  { a: 2, b: 3 },
  { a: 2, b: 5 },
  { a: 2, b: 7 },
  { a: 2, b: 9 },
  // 5 times table
  { a: 5, b: 2 },
  { a: 5, b: 3 },
  { a: 5, b: 4 },
  { a: 5, b: 6 },
  { a: 5, b: 8 },
  // 10 times table
  { a: 10, b: 1 },
  { a: 10, b: 3 },
  { a: 10, b: 5 },
  { a: 10, b: 7 },
  { a: 10, b: 10 },
] as const;

/** Fixed number of options every round so the layout never jumps. */
export const TIMES_OPTION_COUNT = 4;

/**
 * Deterministic option list for a round: always exactly TIMES_OPTION_COUNT
 * unique numbers, always including the correct product. Distractors are
 * "near misses" from the same skip-count family so choices feel plausible.
 */
export function getTimesOptions(index: number): number[] {
  const round = TIMES_ROUNDS[index % TIMES_ROUNDS.length];
  const answer = timesProduct(round);
  const step = round.a;

  const opts: number[] = [answer];
  // Candidate distractors: one step above/below, and ± a single unit.
  const candidates = [
    answer + step,
    answer - step,
    answer + 1,
    answer - 1,
    answer + step * 2,
  ];

  for (const c of candidates) {
    if (opts.length >= TIMES_OPTION_COUNT) break;
    if (c > 0 && !opts.includes(c)) opts.push(c);
  }

  // Safety net: pad with ascending positive fillers if the family was too
  // small to supply enough unique distractors (keeps length stable).
  let filler = answer + 2;
  while (opts.length < TIMES_OPTION_COUNT) {
    if (filler > 0 && !opts.includes(filler)) opts.push(filler);
    filler += 1;
  }

  // Deterministic ordering: sort ascending so the position of the answer is
  // stable/reproducible for tests but not always first.
  return opts.slice(0, TIMES_OPTION_COUNT).sort((x, y) => x - y);
}

/** Warm, no-fail feedback. Never says wrong/incorrect/no. */
export function getTimesFeedback(round: TimesRound, selected: number): string {
  const answer = timesProduct(round);
  if (selected === answer) {
    return `Correct. ${round.a} × ${round.b} = ${answer}. That's ${round.b} group${round.b === 1 ? '' : 's'} of ${round.a}.`;
  }
  return `Not quite. ${round.a} × ${round.b} = ${answer} — count by ${round.a}s ${round.b} time${round.b === 1 ? '' : 's'}: you land on ${answer}.`;
}
