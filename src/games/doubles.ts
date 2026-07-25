// Pure typed logic for the "Double It" mini-game.
// Doubles facts 1..10. No React in this module.

export const DOUBLES_META = {
  id: 'doubles',
  title: 'Doubling',
  icon: '✌',
  color: 'grape',
  tagline: 'Double six. Two equal groups, counted once.',
} as const;

export interface DoubleRound {
  /** The number being doubled (1..10). */
  readonly n: number;
  /** The correct answer, n + n. */
  readonly answer: number;
}

/** Build a double round for n. answer is always exactly n + n. */
function makeRound(n: number): DoubleRound {
  return { n, answer: n + n };
}

// 12 rounds: doubles 1..10, plus two extra higher-value repeats for practice.
export const DOUBLE_ROUNDS: readonly DoubleRound[] = [
  makeRound(1),
  makeRound(2),
  makeRound(3),
  makeRound(4),
  makeRound(5),
  makeRound(6),
  makeRound(7),
  makeRound(8),
  makeRound(9),
  makeRound(10),
  makeRound(7),
  makeRound(9),
];

const OPTION_COUNT = 4;

/**
 * Deterministic option list for round i. Always length OPTION_COUNT and always
 * contains the correct answer. Distractors are near-miss doubling mistakes
 * (n+1 doubled, one group only, off-by-two) clamped to positive, distinct ints.
 */
export function getDoubleOptions(i: number): number[] {
  const round = DOUBLE_ROUNDS[i % DOUBLE_ROUNDS.length];
  const { n, answer } = round;

  // Candidate distractors: common childhood slips, deterministic order.
  const candidates = [
    answer + 2, // counted one extra pair
    answer - 2, // counted one short
    n + (n + 1), // doubled the wrong neighbor
    answer + 1, // off by one
    n, // forgot to double (just one group)
    answer + n, // tripled instead
  ];

  const opts: number[] = [answer];
  for (const c of candidates) {
    if (opts.length >= OPTION_COUNT) break;
    if (c > 0 && !opts.includes(c)) opts.push(c);
  }
  // Safety fill (only reachable for tiny n where candidates collide).
  let pad = answer + 3;
  while (opts.length < OPTION_COUNT) {
    if (!opts.includes(pad)) opts.push(pad);
    pad += 1;
  }

  // Deterministic shuffle keyed by i so the answer isn't always first.
  const rotation = (i * 7 + n) % opts.length;
  return opts.slice(rotation).concat(opts.slice(0, rotation));
}

/** The question text for a round. */
export function getDoublePrompt(round: DoubleRound): string {
  return `Double ${round.n} = ?`;
}

/** Warm, no-fail feedback for any selection. Always non-empty. */
export function getDoubleFeedback(round: DoubleRound, selected: number): string {
  const { n, answer } = round;
  if (selected === answer) {
    return `Yes! ${n} and ${n} together make ${answer}. Doubling means two equal groups.`;
  }
  return `Nice try! Double means ${n} + ${n}, and that lands on ${answer}. Two equal groups of ${n} join up to make ${answer}.`;
}
