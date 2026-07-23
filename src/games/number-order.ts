export const NUMBER_ORDER_META = {
  id: 'number-order',
  title: 'What Comes Next?',
  icon: '🔢',
  color: 'sky',
  tagline: 'Count along and find the number that comes next!',
} as const;

export type SeqKind = 'up1' | 'up2' | 'down1';

export interface NumberRound {
  readonly id: string;
  readonly kind: SeqKind;
  /** The numbers shown before the missing spot, in order. */
  readonly shown: readonly number[];
  /** The correct next number. */
  readonly answer: number;
}

export const NUMBER_ROUNDS: readonly NumberRound[] = [
  { id: 'up-123', kind: 'up1', shown: [1, 2, 3], answer: 4 },
  { id: 'up-234', kind: 'up1', shown: [2, 3, 4], answer: 5 },
  { id: 'up-456', kind: 'up1', shown: [4, 5, 6], answer: 7 },
  { id: 'up-678', kind: 'up1', shown: [6, 7, 8], answer: 9 },
  { id: 'up-789', kind: 'up1', shown: [7, 8, 9], answer: 10 },
  { id: 'up2-246', kind: 'up2', shown: [2, 4, 6], answer: 8 },
  { id: 'up2-468', kind: 'up2', shown: [4, 6, 8], answer: 10 },
  { id: 'up2-135', kind: 'up2', shown: [1, 3, 5], answer: 7 },
  { id: 'up2-024', kind: 'up2', shown: [0, 2, 4], answer: 6 },
  { id: 'down-543', kind: 'down1', shown: [5, 4, 3], answer: 2 },
  { id: 'down-321', kind: 'down1', shown: [3, 2, 1], answer: 0 },
  { id: 'down-987', kind: 'down1', shown: [9, 8, 7], answer: 6 },
];

/** Human-friendly label for a number option. */
export function numberLabel(n: number): string {
  return String(n);
}

/** Short description of the counting pattern, used in hints and feedback. */
export function kindLabel(kind: SeqKind): string {
  switch (kind) {
    case 'up1':
      return 'counting up by 1';
    case 'up2':
      return 'counting up by 2';
    case 'down1':
      return 'counting down by 1';
  }
}

/** A gentle hint shown before the child answers. */
export function getNumberHint(round: NumberRound): string {
  switch (round.kind) {
    case 'up1':
      return 'The numbers are going up one at a time. What is one more?';
    case 'up2':
      return 'These numbers skip! They jump up by two each time.';
    case 'down1':
      return 'These numbers are going down one at a time. What is one less?';
  }
}

/**
 * Deterministic option list: always the correct answer plus two distractors,
 * sorted so the layout is stable. Length is always 3.
 */
export function getNumberOptions(i: number): readonly number[] {
  const round = NUMBER_ROUNDS[i % NUMBER_ROUNDS.length];
  const step = round.kind === 'up2' ? 2 : 1;
  const answer = round.answer;

  // Build near-miss distractors, then clamp to >= 0 and de-dupe.
  const candidates = [answer - step, answer + step, answer + 1, answer - 1];
  const opts: number[] = [answer];
  for (const c of candidates) {
    if (opts.length >= 3) break;
    if (c < 0) continue;
    if (!opts.includes(c)) opts.push(c);
  }
  // Guarantee 3 options even in edge cases (e.g. answer near 0).
  let filler = answer + 2;
  while (opts.length < 3) {
    if (!opts.includes(filler)) opts.push(filler);
    filler += 1;
  }
  return opts.slice(0, 3).sort((a, b) => a - b);
}

/** Warm feedback for ANY choice; affirms the pick, then reveals the answer positively. */
export function getNumberFeedback(round: NumberRound, selected: number): string {
  const correct = selected === round.answer;
  const pattern = kindLabel(round.kind);
  if (correct) {
    return `Yes! ${round.answer} comes next. You are great at ${pattern}!`;
  }
  return `Nice counting! You picked ${selected}. When we are ${pattern}, the next number is ${round.answer}.`;
}
