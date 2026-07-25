// Pure typed logic for the "Halves and Wholes" fraction game.
// No React. Deterministic helpers that always include the correct answer.

export const HALVES_AND_WHOLES_META = {
  id: 'halves-and-wholes',
  title: 'Halves and Wholes',
  icon: '½',
  color: 'berry',
  tagline: 'A half means two equal parts, and one of them shaded.',
} as const;

// A shape drawn as an inline SVG. `parts` = how many pieces the whole is cut
// into. `equal` = whether those pieces are the same size. `shaded` = how many
// pieces are colored in. A shape shows "one half" iff parts===2 && equal &&
// shaded===1.
export type ShapeKind = 'circle' | 'rect';

export interface FractionShape {
  readonly id: string;
  readonly kind: ShapeKind;
  readonly parts: number;
  readonly equal: boolean;
  readonly shaded: number;
}

export interface HalvesRound {
  readonly id: number;
  readonly prompt: string;
  readonly options: readonly FractionShape[];
  readonly answerId: string;
}

// True only when the shape depicts exactly one half.
export function isOneHalf(shape: FractionShape): boolean {
  return shape.parts === 2 && shape.equal && shape.shaded === 1;
}

// The fraction a shape represents, as a short human label, when it is made of
// equal parts. Unequal shapes have no simple fraction name.
export function fractionLabel(shape: FractionShape): string {
  if (!shape.equal) return 'unequal parts';
  if (shape.parts === 1) return shape.shaded === 1 ? 'a whole' : 'nothing shaded';
  if (shape.shaded === 0) return 'nothing shaded';
  const names: Record<number, string> = { 2: 'half', 3: 'third', 4: 'quarter' };
  const unit = names[shape.parts] ?? `part of ${shape.parts}`;
  if (shape.shaded === 1) return `one ${unit}`;
  return `${shape.shaded} of ${shape.parts}`;
}

// Each round: exactly one option is one-half; the rest are distractors
// (thirds, quarters, wholes, unequal splits, unshaded).
export const HALVES_ROUNDS: readonly HalvesRound[] = [
  {
    id: 0,
    prompt: 'Which shows one half?',
    answerId: 'r0-a',
    options: [
      { id: 'r0-a', kind: 'circle', parts: 2, equal: true, shaded: 1 },
      { id: 'r0-b', kind: 'circle', parts: 3, equal: true, shaded: 1 },
      { id: 'r0-c', kind: 'circle', parts: 4, equal: true, shaded: 1 },
    ],
  },
  {
    id: 1,
    prompt: 'Which shape has one half shaded?',
    answerId: 'r1-a',
    options: [
      { id: 'r1-a', kind: 'rect', parts: 2, equal: true, shaded: 1 },
      { id: 'r1-b', kind: 'rect', parts: 2, equal: false, shaded: 1 },
      { id: 'r1-c', kind: 'rect', parts: 4, equal: true, shaded: 1 },
    ],
  },
  {
    id: 2,
    prompt: 'Pick the one that is split into two equal parts, one shaded.',
    answerId: 'r2-c',
    options: [
      { id: 'r2-a', kind: 'circle', parts: 4, equal: true, shaded: 1 },
      { id: 'r2-b', kind: 'rect', parts: 3, equal: true, shaded: 1 },
      { id: 'r2-c', kind: 'circle', parts: 2, equal: true, shaded: 1 },
    ],
  },
  {
    id: 3,
    prompt: 'Which shows one half?',
    answerId: 'r3-b',
    options: [
      { id: 'r3-a', kind: 'rect', parts: 2, equal: false, shaded: 1 },
      { id: 'r3-b', kind: 'rect', parts: 2, equal: true, shaded: 1 },
      { id: 'r3-c', kind: 'rect', parts: 4, equal: true, shaded: 2 },
    ],
  },
  {
    id: 4,
    prompt: 'Only one of these is one half. Which?',
    answerId: 'r4-a',
    options: [
      { id: 'r4-a', kind: 'circle', parts: 2, equal: true, shaded: 1 },
      { id: 'r4-b', kind: 'circle', parts: 2, equal: true, shaded: 2 },
      { id: 'r4-c', kind: 'circle', parts: 3, equal: true, shaded: 1 },
      { id: 'r4-d', kind: 'circle', parts: 4, equal: true, shaded: 1 },
    ],
  },
  {
    id: 5,
    prompt: 'Which rectangle shows one half?',
    answerId: 'r5-d',
    options: [
      { id: 'r5-a', kind: 'rect', parts: 3, equal: true, shaded: 1 },
      { id: 'r5-b', kind: 'rect', parts: 2, equal: false, shaded: 1 },
      { id: 'r5-c', kind: 'rect', parts: 4, equal: true, shaded: 1 },
      { id: 'r5-d', kind: 'rect', parts: 2, equal: true, shaded: 1 },
    ],
  },
  {
    id: 6,
    prompt: 'Half means two equal parts. Which one is it?',
    answerId: 'r6-b',
    options: [
      { id: 'r6-a', kind: 'circle', parts: 4, equal: true, shaded: 2 },
      { id: 'r6-b', kind: 'circle', parts: 2, equal: true, shaded: 1 },
      { id: 'r6-c', kind: 'circle', parts: 3, equal: true, shaded: 1 },
    ],
  },
  {
    id: 7,
    prompt: 'Which one is cut fairly in half?',
    answerId: 'r7-c',
    options: [
      { id: 'r7-a', kind: 'rect', parts: 2, equal: false, shaded: 1 },
      { id: 'r7-b', kind: 'rect', parts: 4, equal: true, shaded: 1 },
      { id: 'r7-c', kind: 'rect', parts: 2, equal: true, shaded: 1 },
    ],
  },
  {
    id: 8,
    prompt: 'Which shows one half?',
    answerId: 'r8-a',
    options: [
      { id: 'r8-a', kind: 'circle', parts: 2, equal: true, shaded: 1 },
      { id: 'r8-b', kind: 'circle', parts: 1, equal: true, shaded: 1 },
      { id: 'r8-c', kind: 'circle', parts: 4, equal: true, shaded: 3 },
    ],
  },
  {
    id: 9,
    prompt: 'Find the shape with exactly half colored in.',
    answerId: 'r9-d',
    options: [
      { id: 'r9-a', kind: 'rect', parts: 3, equal: true, shaded: 2 },
      { id: 'r9-b', kind: 'rect', parts: 4, equal: true, shaded: 1 },
      { id: 'r9-c', kind: 'rect', parts: 2, equal: false, shaded: 1 },
      { id: 'r9-d', kind: 'rect', parts: 2, equal: true, shaded: 1 },
    ],
  },
  {
    id: 10,
    prompt: 'Two equal parts, one shaded. Which shape?',
    answerId: 'r10-b',
    options: [
      { id: 'r10-a', kind: 'circle', parts: 3, equal: true, shaded: 1 },
      { id: 'r10-b', kind: 'circle', parts: 2, equal: true, shaded: 1 },
      { id: 'r10-c', kind: 'circle', parts: 2, equal: true, shaded: 0 },
    ],
  },
  {
    id: 11,
    prompt: 'Which shows one half?',
    answerId: 'r11-c',
    options: [
      { id: 'r11-a', kind: 'rect', parts: 4, equal: true, shaded: 2 },
      { id: 'r11-b', kind: 'rect', parts: 2, equal: false, shaded: 1 },
      { id: 'r11-c', kind: 'rect', parts: 2, equal: true, shaded: 1 },
    ],
  },
  {
    id: 12,
    prompt: 'One of these circles is one half. Pick it!',
    answerId: 'r12-a',
    options: [
      { id: 'r12-a', kind: 'circle', parts: 2, equal: true, shaded: 1 },
      { id: 'r12-b', kind: 'circle', parts: 4, equal: true, shaded: 1 },
      { id: 'r12-c', kind: 'circle', parts: 3, equal: true, shaded: 1 },
      { id: 'r12-d', kind: 'circle', parts: 2, equal: false, shaded: 1 },
    ],
  },
];

// Deterministic options accessor (mirrors the golden getFeelingOptions shape).
export function getHalvesOptions(index: number): readonly FractionShape[] {
  const round = HALVES_ROUNDS[index % HALVES_ROUNDS.length];
  return round.options;
}

// Warm, never-negative feedback for whichever shape the child chose.
export function getHalvesFeedback(round: HalvesRound, selectedId: string): string {
  const answer = round.options.find((o) => o.id === round.answerId);
  const picked = round.options.find((o) => o.id === selectedId);
  const base = 'One half means 2 equal parts, one shaded.';
  if (picked && isOneHalf(picked)) {
    return `Yes! ${base} You found it.`;
  }
  if (!picked || !answer) return base;
  if (!picked.equal) {
    return `Nice try! Those parts are not the same size, so it is not a fair half. ${base}`;
  }
  if (picked.parts === 3) {
    return `Good look! That one is split into 3 equal parts, so each piece is a third. ${base}`;
  }
  if (picked.parts === 4) {
    return `Good thinking! That shape has 4 equal parts, so a shaded piece is a quarter. ${base}`;
  }
  if (picked.parts === 1) {
    return `Cozy try! That whole shape is not cut yet, so nothing is a half. ${base}`;
  }
  if (picked.parts === 2 && picked.shaded !== 1) {
    return `Great effort! A half needs just one of the two parts shaded. ${base}`;
  }
  return `Great effort! ${base} The glowing shape is the true half.`;
}
