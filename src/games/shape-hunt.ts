export const SHAPE_HUNT_META = {
  id: 'shape-hunt',
  title: 'Shapes',
  icon: '▲●■',
  color: 'sky',
  tagline: 'Circle, square, triangle, hexagon — naming plane shapes.',
} as const;

export const SHAPES = [
  'circle',
  'square',
  'triangle',
  'rectangle',
  'star',
  'heart',
  'oval',
  'diamond',
] as const;

export type Shape = (typeof SHAPES)[number];

export interface ShapeRound {
  readonly id: string;
  readonly shape: Shape;
  readonly example: string;
}

export const SHAPE_ROUNDS: readonly ShapeRound[] = [
  { id: 'circle-sun', shape: 'circle', example: 'A circle is round like the sun.' },
  { id: 'square-window', shape: 'square', example: 'A square has 4 equal sides like a window.' },
  { id: 'triangle-roof', shape: 'triangle', example: 'A triangle has 3 sides like a roof.' },
  { id: 'rectangle-door', shape: 'rectangle', example: 'A rectangle is long like a door.' },
  { id: 'star-sky', shape: 'star', example: 'A star twinkles in the night sky.' },
  { id: 'heart-love', shape: 'heart', example: 'A heart means love and hugs.' },
  { id: 'oval-egg', shape: 'oval', example: 'An oval is stretched round like an egg.' },
  { id: 'diamond-kite', shape: 'diamond', example: 'A diamond points out like a kite.' },
  { id: 'circle-wheel', shape: 'circle', example: 'A circle rolls like a wheel.' },
  { id: 'square-block', shape: 'square', example: 'A square is flat like a building block.' },
  { id: 'triangle-slice', shape: 'triangle', example: 'A triangle looks like the sail on a boat.' },
  { id: 'rectangle-book', shape: 'rectangle', example: 'A rectangle is shaped like a book.' },
  { id: 'star-cookie', shape: 'star', example: 'A star is how we draw the ones in the sky.' },
  { id: 'heart-card', shape: 'heart', example: 'A heart is on a special card.' },
  { id: 'oval-plate', shape: 'oval', example: 'An oval is smooth like a plate.' },
  { id: 'diamond-window', shape: 'diamond', example: 'A diamond tips on its point like a garden window.' },
];

export function shapeLabel(shape: Shape): string {
  return shape[0].toUpperCase() + shape.slice(1);
}

export function getShapeOptions(index: number): readonly Shape[] {
  const round = SHAPE_ROUNDS[index % SHAPE_ROUNDS.length];
  const answer = round.shape;
  const distractors = SHAPES.filter((s) => s !== answer);
  // Deterministic pick of 2 distractors based on the round index.
  const first = distractors[index % distractors.length];
  const second = distractors[(index + 3) % distractors.length];
  const picked = second === first ? distractors[(index + 4) % distractors.length] : second;
  const options = [answer, first, picked];
  // Deterministic rotation so the answer is not always first.
  const rotate = index % options.length;
  return [...options.slice(rotate), ...options.slice(0, rotate)];
}

export function getShapeFeedback(round: ShapeRound, selected: Shape): string {
  if (selected === round.shape) {
    return `Correct. That is a ${round.shape}. ${round.example}`;
  }
  return `Not quite. You picked ${shapeLabel(selected)}. This one is a ${round.shape}. ${round.example}`;
}
