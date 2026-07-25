export const NUMBER_BONDS_META = {
  id: 'number-bonds',
  title: 'Number Bonds to Ten',
  icon: '🔟',
  color: 'aqua',
  tagline: 'Which number joins six to make ten. The ten-frame shows it.',
} as const;

/**
 * A number-bond round: `part` is the amount already shown filled in the frame,
 * and `whole` is the target (10 or 20). The player picks the missing partner
 * so that `part + answer === whole`.
 */
export interface BondRound {
  readonly part: number;
  readonly whole: number;
}

/** The correct missing partner for a round. */
export function bondAnswer(round: BondRound): number {
  return round.whole - round.part;
}

/**
 * 14 hand-picked rounds: the classic bonds to 10 first (in a spread-out order
 * so patterns don't feel rote), then a set of bonds to 20 to stretch an
 * ahead-of-grade learner into two-ten-frame thinking.
 */
export const BOND_ROUNDS: readonly BondRound[] = [
  { part: 6, whole: 10 },
  { part: 4, whole: 10 },
  { part: 7, whole: 10 },
  { part: 3, whole: 10 },
  { part: 8, whole: 10 },
  { part: 2, whole: 10 },
  { part: 9, whole: 10 },
  { part: 1, whole: 10 },
  { part: 5, whole: 10 },
  { part: 0, whole: 10 },
  { part: 14, whole: 20 },
  { part: 12, whole: 20 },
  { part: 15, whole: 20 },
  { part: 17, whole: 20 },
];

const OPTION_COUNT = 4;

/**
 * Deterministic option list for a round. Always includes the correct answer,
 * always returns exactly OPTION_COUNT distinct non-negative options, and is
 * stable for a given index (no Math.random), so tests and re-renders agree.
 */
export function getBondOptions(index: number): number[] {
  const round = BOND_ROUNDS[index % BOND_ROUNDS.length];
  const answer = bondAnswer(round);
  const opts: number[] = [answer];

  // Deterministic spread of distractors around the answer, clamped to [0, whole].
  const spread = [1, -1, 2, -2, 3, -3, 4];
  for (const d of spread) {
    if (opts.length >= OPTION_COUNT) break;
    const cand = answer + d;
    if (cand >= 0 && cand <= round.whole && !opts.includes(cand)) {
      opts.push(cand);
    }
  }
  // Guarantee fill even for tiny wholes (e.g. answer near 0).
  let filler = 0;
  while (opts.length < OPTION_COUNT) {
    if (!opts.includes(filler)) opts.push(filler);
    filler += 1;
  }

  // Deterministic shuffle keyed on index so the answer isn't always first.
  const ordered = opts.slice(0, OPTION_COUNT);
  const rotate = index % OPTION_COUNT;
  return ordered.slice(rotate).concat(ordered.slice(0, rotate));
}

/** The question prompt for a round. */
export function getBondPrompt(round: BondRound): string {
  return `What goes with ${round.part} to make ${round.whole}?`;
}

/** A gentle hint shown before the player answers. */
export function getBondHint(round: BondRound): string {
  return `Count the empty spots in the ten-frame — how many are still open to reach ${round.whole}?`;
}

/**
 * Warm, no-fail feedback. Correct choices get a cheer; a miss is affirmed and
 * then the true bond is shown positively with a tiny "why".
 */
export function getBondFeedback(round: BondRound, selected: number): string {
  const answer = bondAnswer(round);
  if (selected === answer) {
    return `Correct. ${round.part} and ${answer} snap together to make ${round.whole}. That is a number bond you can keep in your head!`;
  }
  return `Not quite. The partner is ${answer}, because ${round.part} + ${answer} = ${round.whole} — the frame is full. Now you know this bond!`;
}
