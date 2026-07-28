import { placeOptions } from './options';

/**
 * Shapes — naming plane figures.
 *
 * The defect this module is built around: `getShapeOptions(9)` offered
 * [square, rectangle, oval] over a `<rect width="72" height="72">`. A square is
 * a rectangle, so a child who pressed "Rectangle" was scored wrong for being
 * right. Nothing prevented it, because the name and the drawing had no
 * relationship: the name was a string in a round record, the drawing was
 * hand-typed SVG in the component, and a person was expected to keep the two
 * consistent.
 *
 * So the figure is now the only fact. A figure is geometry — a list of points,
 * or an ellipse's two radii. Everything else is computed from it: which names
 * are true of it (`trueNames`), which single name is the most exact
 * (`mostExactName`), which names may be offered as wrong answers (only names
 * that are false for it), and what the component draws. A round that offers two
 * names both true of one figure is not something anyone has to remember not to
 * write. It cannot be expressed.
 *
 * The taxonomy is the real one: square is a rectangle is a quadrilateral,
 * square is a rhombus is a quadrilateral, circle is an ellipse. The old
 * "diamond" polygon has four equal sides and two unequal diagonals, so it is a
 * rhombus, and rhombus is what it is called here.
 */

export const SHAPE_HUNT_META = {
  id: 'shape-hunt',
  title: 'Shapes',
  icon: '▲●■',
  color: 'sky',
  tagline: 'Circle, rhombus, trapezoid, hexagon — naming figures by their sides and corners.',
} as const;

/** Every name the exercise knows. Ordered loosely from curves to many sides. */
export const SHAPE_NAMES = [
  'circle',
  'ellipse',
  'triangle',
  'quadrilateral',
  'trapezoid',
  'rectangle',
  'rhombus',
  'square',
  'pentagon',
  'hexagon',
] as const;

export type ShapeName = (typeof SHAPE_NAMES)[number];

export type Point = readonly [number, number];

/** A figure in a 0–100 square. This is the single record everything derives from. */
export type Figure =
  | { readonly kind: 'polygon'; readonly points: readonly Point[] }
  | {
      readonly kind: 'ellipse';
      readonly cx: number;
      readonly cy: number;
      readonly rx: number;
      readonly ry: number;
    };

/**
 * Tolerance, in the figure's own units. Coordinates are rounded to three
 * decimals when a figure is generated, so the record and the drawn SVG hold
 * literally the same numbers; that rounding moves a side length by at most
 * about 0.002, well inside this.
 */
const EPS = 0.01;

const round3 = (v: number): number => Math.round(v * 1000) / 1000;

/**
 * A regular n-gon. Generated rather than typed out, so "the sides are equal" is
 * a property of the construction and not of someone's arithmetic.
 */
export function regularPolygon(
  sides: number,
  cx: number,
  cy: number,
  r: number,
  rotationDeg: number,
): Figure {
  const points: Point[] = [];
  for (let i = 0; i < sides; i += 1) {
    const a = ((rotationDeg + (360 / sides) * i) * Math.PI) / 180;
    points.push([round3(cx + r * Math.cos(a)), round3(cy + r * Math.sin(a))]);
  }
  return { kind: 'polygon', points };
}

const polygon = (points: readonly Point[]): Figure => ({ kind: 'polygon', points });
const oval = (rx: number, ry: number): Figure => ({ kind: 'ellipse', cx: 50, cy: 50, rx, ry });

function edges(points: readonly Point[]): Point[] {
  return points.map((p, i) => {
    const q = points[(i + 1) % points.length];
    return [q[0] - p[0], q[1] - p[1]] as Point;
  });
}

const length = (v: Point): number => Math.hypot(v[0], v[1]);
const dot = (a: Point, b: Point): number => a[0] * b[0] + a[1] * b[1];
const cross = (a: Point, b: Point): number => a[0] * b[1] - a[1] * b[0];

const isParallel = (a: Point, b: Point): boolean =>
  Math.abs(cross(a, b)) <= EPS * length(a) * length(b);

const isSquareCorner = (a: Point, b: Point): boolean =>
  Math.abs(dot(a, b)) <= EPS * length(a) * length(b);

function equalSides(points: readonly Point[]): boolean {
  const ls = edges(points).map(length);
  return ls.every((l) => Math.abs(l - ls[0]) <= EPS);
}

function squareCorners(points: readonly Point[]): boolean {
  const e = edges(points);
  return e.every((v, i) => isSquareCorner(v, e[(i + 1) % e.length]));
}

function parallelPairs(points: readonly Point[]): number {
  const e = edges(points);
  let n = 0;
  for (let i = 0; i < e.length; i += 1) {
    for (let j = i + 1; j < e.length; j += 1) if (isParallel(e[i], e[j])) n += 1;
  }
  return n;
}

/**
 * Every name that is TRUE of this figure, computed from its geometry.
 *
 * A trapezoid here has exactly one pair of parallel sides — the exclusive
 * definition — so a rectangle and a rhombus, which have two pairs, are not
 * trapezoids and the three names stay disjoint.
 */
export function trueNames(figure: Figure): ShapeName[] {
  if (figure.kind === 'ellipse') {
    return Math.abs(figure.rx - figure.ry) <= EPS ? ['ellipse', 'circle'] : ['ellipse'];
  }
  const { points } = figure;
  const n = points.length;
  if (n === 3) return ['triangle'];
  if (n === 5) return ['pentagon'];
  if (n === 6) return ['hexagon'];
  if (n !== 4) throw new Error(`shape-hunt knows no name for a figure with ${n} sides`);

  const names: ShapeName[] = ['quadrilateral'];
  const equal = equalSides(points);
  const right = squareCorners(points);
  if (parallelPairs(points) === 1) names.push('trapezoid');
  if (right) names.push('rectangle');
  if (equal) names.push('rhombus');
  if (right && equal) names.push('square');
  return names;
}

/**
 * How much a name commits to. The prompt asks for the most exact name, which is
 * the one true name with the highest number here. Every committed figure is
 * checked to have exactly one name at its maximum.
 */
const SPECIFICITY: Record<ShapeName, number> = {
  ellipse: 0,
  circle: 1,
  triangle: 0,
  quadrilateral: 0,
  trapezoid: 1,
  rectangle: 1,
  rhombus: 1,
  square: 2,
  pentagon: 0,
  hexagon: 0,
};

/** Exported so the tests can assert that one name, and only one, sits at the top. */
export function nameRank(name: ShapeName): number {
  return SPECIFICITY[name];
}

export function mostExactName(figure: Figure): ShapeName {
  const names = trueNames(figure);
  return names.reduce((best, name) => (SPECIFICITY[name] > SPECIFICITY[best] ? name : best));
}

/** How many straight sides a name commits to; 0 for the curves. */
const SIDES: Record<ShapeName, number> = {
  circle: 0,
  ellipse: 0,
  triangle: 3,
  quadrilateral: 4,
  trapezoid: 4,
  rectangle: 4,
  rhombus: 4,
  square: 4,
  pentagon: 5,
  hexagon: 6,
};

export const FIGURES = {
  circle: oval(36, 36),
  ellipse: oval(44, 28),
  triangle: regularPolygon(3, 50, 54, 44, -90),
  square: regularPolygon(4, 50, 50, 45, 45),
  rectangle: polygon([
    [10, 30],
    [90, 30],
    [90, 70],
    [10, 70],
  ]),
  // Four equal sides, diagonals 88 and 68 — clearly not a square.
  rhombus: polygon([
    [50, 6],
    [84, 50],
    [50, 94],
    [16, 50],
  ]),
  // One parallel pair (the two horizontals); the legs are mirror images.
  trapezoid: polygon([
    [20, 74],
    [80, 74],
    [66, 28],
    [34, 28],
  ]),
  // Nothing more is true of it: no equal sides, no square corners, no parallels.
  quadrilateral: polygon([
    [18, 22],
    [84, 16],
    [66, 84],
    [30, 70],
  ]),
  pentagon: regularPolygon(5, 50, 52, 42, -90),
  hexagon: regularPolygon(6, 50, 50, 42, -90),
} satisfies Record<string, Figure>;

export type FigureId = keyof typeof FIGURES;

export interface ShapeRound {
  readonly id: string;
  readonly figure: FigureId;
  /** One plain fact about the figure. Not a story about it. */
  readonly example: string;
}

export const SHAPE_ROUNDS: readonly ShapeRound[] = [
  { id: 'circle-distance', figure: 'circle', example: 'Every point on a circle is the same distance from the centre.' },
  { id: 'square-corners', figure: 'square', example: 'A square has four equal sides and four square corners.' },
  { id: 'triangle-rigid', figure: 'triangle', example: 'A triangle cannot be pushed out of shape. That is why bridges are full of them.' },
  { id: 'rectangle-door', figure: 'rectangle', example: 'A rectangle has four square corners, and its sides come in two lengths.' },
  { id: 'rhombus-push', figure: 'rhombus', example: 'Push a square over sideways and it becomes a rhombus: the sides stay equal, the corners stop being square.' },
  { id: 'hexagon-tile', figure: 'hexagon', example: 'Six sides. Bees build hexagons because hexagons fit together with no gaps.' },
  { id: 'ellipse-orbit', figure: 'ellipse', example: 'An ellipse is a stretched circle. Earth travels round the Sun on one.' },
  { id: 'trapezoid-pair', figure: 'trapezoid', example: 'A trapezoid has exactly one pair of parallel sides. The other two lean.' },
  { id: 'pentagon-five', figure: 'pentagon', example: 'Five sides. Penta is the Greek word for five.' },
  { id: 'quadrilateral-plain', figure: 'quadrilateral', example: 'Four sides, and nothing else is true of it: no equal sides, no square corners, no parallel pair.' },
  { id: 'square-chessboard', figure: 'square', example: 'A chessboard is 64 squares. Each one is as tall as it is wide.' },
  { id: 'circle-wheel', figure: 'circle', example: 'A wheel is a circle. The rim stays the same distance from the axle, so the ride stays level.' },
  { id: 'rectangle-brick', figure: 'rectangle', example: 'A brick face is a rectangle: two lengths, four square corners.' },
  { id: 'triangle-half-turn', figure: 'triangle', example: 'The three corners of any triangle add up to a half turn.' },
  { id: 'rhombus-squashed', figure: 'rhombus', example: 'A rhombus is a squashed square. Equal sides, unequal diagonals.' },
  { id: 'hexagon-nut', figure: 'hexagon', example: 'A bolt head is a hexagon so a spanner can grip it six ways round.' },
];

export const SHAPE_OPTION_COUNT = 3;

export function shapeLabel(name: ShapeName): string {
  return name[0].toUpperCase() + name.slice(1);
}

/** The figure a round draws. One lookup, used by the renderer and by the scorer. */
export function roundFigure(round: ShapeRound): Figure {
  return FIGURES[round.figure];
}

/** The scored answer: the most exact name true of the drawn figure. */
export function shapeAnswer(round: ShapeRound): ShapeName {
  return mostExactName(roundFigure(round));
}

const rotate = <T,>(xs: readonly T[], k: number): T[] =>
  xs.length === 0 ? [] : xs.map((_, i) => xs[(i + k) % xs.length]);

/**
 * Wrong answers, drawn only from names that are FALSE for the drawn figure.
 *
 * Names with the same side count come first, because those are the ones worth
 * telling apart — a rhombus against a square and a rectangle is a real
 * question; a rhombus against a circle is not.
 */
export function shapeDistractors(round: ShapeRound, index: number): ShapeName[] {
  const figure = roundFigure(round);
  const truths = new Set<ShapeName>(trueNames(figure));
  const answer = mostExactName(figure);
  const pool = SHAPE_NAMES.filter((name) => !truths.has(name));
  const near = pool.filter((name) => SIDES[name] === SIDES[answer]);
  const far = pool.filter((name) => SIDES[name] !== SIDES[answer]);
  return [...rotate(near, index), ...rotate(far, index)];
}

export function getShapeOptions(index: number): readonly ShapeName[] {
  const i = ((index % SHAPE_ROUNDS.length) + SHAPE_ROUNDS.length) % SHAPE_ROUNDS.length;
  const round = SHAPE_ROUNDS[i];
  return placeOptions({
    gameId: SHAPE_HUNT_META.id,
    roundIndex: i,
    answer: shapeAnswer(round),
    distractors: shapeDistractors(round, i),
    count: SHAPE_OPTION_COUNT,
  });
}

/** "a quadrilateral, a rectangle and a rhombus" */
function listNames(names: readonly ShapeName[]): string {
  const each = names.map((name) => `a ${name}`);
  if (each.length === 1) return each[0];
  return `${each.slice(0, -1).join(', ')} and ${each[each.length - 1]}`;
}

/**
 * What a child is told after choosing. The wider names come from `trueNames`,
 * so the taxonomy lesson — a square really is a rectangle — is read off the
 * same geometry that scored the answer.
 */
export function getShapeFeedback(round: ShapeRound, selected: ShapeName): string {
  const figure = roundFigure(round);
  const answer = mostExactName(figure);
  const wider = trueNames(figure).filter((name) => name !== answer);
  const alsoTrue = wider.length
    ? ` It is also ${listNames(wider)}, but ${answer} is the most exact name for it.`
    : '';
  if (selected === answer) {
    return `Correct. This is a ${answer}. ${round.example}${alsoTrue}`;
  }
  return `This one is a ${answer}, not a ${selected}. ${round.example}${alsoTrue}`;
}

/** What the figure is, said without naming it — for a listener, not a reader. */
export function figureDescription(figure: Figure): string {
  if (figure.kind === 'ellipse') return 'a closed curve with no corners';
  return `a figure with ${figure.points.length} straight sides`;
}

/** The `points` attribute for an SVG polygon, from the same record that names it. */
export function svgPoints(points: readonly Point[]): string {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}
