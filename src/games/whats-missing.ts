// What's Missing? — missing addend / missing number puzzles within 20.
// Pure typed logic module. No React.

export const WHATS_MISSING_META = {
  id: 'whats-missing',
  title: "What's Missing?",
  icon: '❓',
  color: 'sun',
  tagline: 'Six and what makes ten. Finding the number that is hidden.',
} as const;

// Each round is one equation with exactly one blank (the answer).
// op '+' : a + b = total   (blank is whichever slot is null)
// op '-' : a - b = total   (blank is whichever slot is null)
// Exactly one of a / b / total is null and equals `answer`.
export type MissingSlot = 'a' | 'b' | 'total';

export interface MissingRound {
  op: '+' | '-';
  a: number | null;
  b: number | null;
  total: number | null;
  blank: MissingSlot;
  answer: number;
}

// Helper to build a round and derive answer + blank from the null slot.
function mk(op: '+' | '-', a: number | null, b: number | null, total: number | null): MissingRound {
  let blank: MissingSlot;
  let answer: number;
  if (a === null) {
    blank = 'a';
    answer = op === '+' ? (total as number) - (b as number) : (total as number) + (b as number);
  } else if (b === null) {
    blank = 'b';
    answer = op === '+' ? (total as number) - (a as number) : (a as number) - (total as number);
  } else {
    blank = 'total';
    answer = op === '+' ? a + b : a - b;
  }
  return { op, a, b, total, blank, answer };
}

// >= 14 varied rounds, all within 20, mixing missing addend, missing start,
// missing total, and missing subtrahend.
export const MISSING_ROUNDS: readonly MissingRound[] = [
  mk('+', 6, null, 10),   // 6 + ? = 10  -> 4
  mk('+', null, 3, 8),    // ? + 3 = 8   -> 5
  mk('-', 9, null, 4),    // 9 - ? = 4   -> 5
  mk('+', 7, null, 12),   // 7 + ? = 12  -> 5
  mk('+', null, 5, 11),   // ? + 5 = 11  -> 6
  mk('-', 15, null, 8),   // 15 - ? = 8  -> 7
  mk('+', 8, 4, null),    // 8 + 4 = ?   -> 12
  mk('+', 9, null, 16),   // 9 + ? = 16  -> 7
  mk('-', 13, null, 6),   // 13 - ? = 6  -> 7
  mk('+', null, 8, 14),   // ? + 8 = 14  -> 6
  mk('-', 20, null, 12),  // 20 - ? = 12 -> 8
  mk('+', 3, null, 10),   // 3 + ? = 10  -> 7
  mk('-', 11, 4, null),   // 11 - 4 = ?  -> 7
  mk('+', null, 6, 13),   // ? + 6 = 13  -> 7
  mk('-', 17, null, 9),   // 17 - ? = 9  -> 8
  mk('+', 5, null, 14),   // 5 + ? = 14  -> 9
] as const;

// Render the equation as parts, using a placeholder for the blank slot.
export function equationParts(round: MissingRound, blankText = '?'): {
  left: string;
  op: string;
  right: string;
  total: string;
} {
  const cell = (slot: MissingSlot, value: number | null): string =>
    round.blank === slot ? blankText : String(value);
  return {
    left: cell('a', round.a),
    op: round.op,
    right: cell('b', round.b),
    total: cell('total', round.total),
  };
}

// Deterministic 3-4 options that always include the correct answer, kept within
// a sensible small range and stable in length.
export function getMissingOptions(index: number): number[] {
  const round = MISSING_ROUNDS[index % MISSING_ROUNDS.length];
  const answer = round.answer;
  const opts: number[] = [answer];
  // deterministic offsets seeded by index for variety, avoid negatives
  const offsets = [1, -1, 2, -2, 3, -3];
  for (const off of offsets) {
    if (opts.length >= 4) break;
    const cand = answer + off;
    if (cand >= 0 && cand <= 20 && !opts.includes(cand)) opts.push(cand);
  }
  // guarantee length 4 even for edge answers
  let filler = 0;
  while (opts.length < 4) {
    if (!opts.includes(filler) && filler <= 20) opts.push(filler);
    filler += 1;
  }
  // deterministic shuffle by index so answer isn't always first
  const rotated = [...opts];
  const shift = index % rotated.length;
  return rotated.slice(shift).concat(rotated.slice(0, shift));
}

export function getMissingFeedback(round: MissingRound, selected: number): string {
  const parts = equationParts(round, String(round.answer));
  const full = `${parts.left} ${round.op} ${parts.right} = ${parts.total}`;
  const why =
    round.op === '+'
      ? 'addition and subtraction are partners — you can subtract to find a missing part.'
      : 'you can add or subtract to uncover the missing piece.';
  if (selected === round.answer) {
    return `Yes! ${round.answer} fits perfectly: ${full}. Nice number detective work.`;
  }
  return `Great try! The missing number is ${round.answer}, so ${full}. Remember: ${why}`;
}
