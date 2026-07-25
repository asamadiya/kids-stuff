// Fraction Pizza — pure typed logic module (no React).
// Fractions 1/2, 1/3, 1/4 shown as an inline-SVG pizza with some slices shaded.
// Rounds ask either "which pizza shows X" (shaded == answer) or
// "how much is left" (unshaded == answer). Options are fraction labels.

export const FRACTIONPIZZA_META = {
  id: 'fraction-pizza',
  title: 'Fractions: Equal Parts',
  icon: '🍕',
  color: 'sun',
  tagline: 'Halves, thirds and quarters — equal parts of one whole.',
} as const;

// The three fractions this game teaches. denom = number of equal slices.
export type FractionValue = '1/2' | '1/3' | '1/4';

export interface FractionInfo {
  readonly value: FractionValue;
  readonly denom: 2 | 3 | 4; // equal slices in the whole pizza
  readonly word: string; // spoken name, e.g. "one quarter"
}

export const FRACTIONS: readonly FractionInfo[] = [
  { value: '1/2', denom: 2, word: 'one half' },
  { value: '1/3', denom: 3, word: 'one third' },
  { value: '1/4', denom: 4, word: 'one quarter' },
] as const;

export function fractionInfo(value: FractionValue): FractionInfo {
  const found = FRACTIONS.find((f) => f.value === value);
  // value is always one of the three literals, so this is guaranteed.
  return found ?? FRACTIONS[0];
}

// A round draws a pizza cut into `denom` equal slices with `shaded` of them
// filled. The player names either the shaded amount or the leftover amount.
export type RoundKind = 'shaded' | 'left';

export interface PizzaRound {
  readonly id: number;
  readonly denom: 2 | 3 | 4; // total equal slices
  readonly shaded: number; // how many slices are filled (topping)
  readonly kind: RoundKind; // ask about the shaded part or the leftover part
  readonly answer: FractionValue; // the correct single-slice fraction label
  readonly prompt: string;
}

// Every round below is a single-slice fraction so the answer is exactly one of
// 1/2, 1/3, 1/4 — either the shaded slice (shaded=1) or the one leftover slice.
function shadedRound(id: number, value: FractionValue, prompt: string): PizzaRound {
  const info = fractionInfo(value);
  return { id, denom: info.denom, shaded: 1, kind: 'shaded', answer: value, prompt };
}

// "How much is left?" — pizza has `denom` slices, all but one eaten (shaded =
// eaten), so exactly one plain slice remains => leftover is 1/denom.
function leftRound(id: number, value: FractionValue, prompt: string): PizzaRound {
  const info = fractionInfo(value);
  return { id, denom: info.denom, shaded: info.denom - 1, kind: 'left', answer: value, prompt };
}

export const FRACTION_ROUNDS: readonly PizzaRound[] = [
  shadedRound(1, '1/4', 'Which fraction shows the topping slice?'),
  shadedRound(2, '1/2', 'How much of this pizza has topping?'),
  shadedRound(3, '1/3', 'How much of this pizza is shaded?'),
  leftRound(4, '1/4', 'Three slices got eaten. How much pizza is left?'),
  shadedRound(5, '1/2', 'Which fraction names the shaded half?'),
  leftRound(6, '1/2', 'One half is eaten. How much pizza is left?'),
  shadedRound(7, '1/4', 'Which pizza shows one quarter shaded?'),
  leftRound(8, '1/3', 'Two thirds got eaten. How much pizza is left?'),
  shadedRound(9, '1/3', 'How much of the pizza has topping now?'),
  shadedRound(10, '1/2', 'Half the pizza has cheese. Which fraction is that?'),
  leftRound(11, '1/4', 'The party ate three slices. How much is left?'),
  shadedRound(12, '1/4', 'One slice has pepperoni. How much of the pizza is that?'),
  shadedRound(13, '1/3', 'Which fraction shows one third shaded?'),
  leftRound(14, '1/2', 'You shared half with a friend. How much do you have left?'),
] as const;

// Deterministic 3-option list that always contains the answer, in a stable
// order (the three fractions, in canonical order). Length is always 3.
export function getFractionOptions(index: number): readonly FractionValue[] {
  // Guard against out-of-range callers; rounds loop with modulo elsewhere.
  const round = FRACTION_ROUNDS[((index % FRACTION_ROUNDS.length) + FRACTION_ROUNDS.length) % FRACTION_ROUNDS.length];
  const all: readonly FractionValue[] = ['1/2', '1/3', '1/4'];
  // Answer is inherently in `all`; return canonical order for stable UI.
  void round;
  return all;
}

export function getFractionFeedback(round: PizzaRound, selected: FractionValue): string {
  const info = fractionInfo(round.answer);
  const correct = selected === round.answer;
  const why =
    round.denom === 2
      ? 'the pizza is cut into 2 equal slices, so one slice is one half'
      : round.denom === 3
        ? 'the pizza is cut into 3 equal slices, so one slice is one third'
        : 'the pizza is cut into 4 equal slices, so one slice is one quarter';
  if (correct) {
    return `Yum! That is ${info.word} (${round.answer}) — ${why}. Great slicing!`;
  }
  const selInfo = fractionInfo(selected);
  return `Nice try picking ${selInfo.word}! The tasty answer is ${info.word} (${round.answer}) — ${why}.`;
}
