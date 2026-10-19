import { useId, type CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Slot, Tray } from '../../play/parts';

/**
 * Turn It. Does It Fit? — rotation keeps a shape the same shape, and shapes
 * compose into other shapes.
 *
 * Concept (advisor, maths 10): "Rotate the same triangle, match it to its
 * outline, and combine two suitable triangles into a rectangle." The
 * misconception it attacks: "a triangle stops being a triangle when turned
 * sideways; a shape's identity depends on its familiar orientation."
 *
 * The board is one outline on a dot grid and a tray of flat pieces drawn at
 * the SAME scale (48 px to a grid step, in both places). Every vertex sits on
 * the grid and every edge runs along a grid line or a cell diagonal, so every
 * shape is exactly a set of quarter-cells (a cell cut along both diagonals).
 * Fitting is therefore exact: the pieces fit when their quarters cover the
 * outline's quarters once each, with nothing outside. Any correct tiling is
 * accepted, not only the one the worked answer draws.
 *
 * Levels:
 *  1. Turn one shape: one outline, one piece that starts one to three
 *     quarter turns away. Triangle, L, T, pentagon, staircase, trapezoid, parallelogram.
 *  2. Two make one: two pieces fill an outline. Two equal triangles make a
 *     square first; the same pair then makes a wide triangle, a parallelogram
 *     and a tall triangle, so composition AND orientation both vary.
 *  3. Three or four pieces, tangram-style, no lines drawn inside the outline:
 *     mixed sizes (two half-size triangles stand in for one big one), and four
 *     equal triangles that make a triangle twice the size, or a tilted square
 *     only when all four point different ways. Every round needs at least one
 *     piece turned: no round can be filled straight from the tray.
 *
 * Control: tap-to-build. Tap a piece to pick it up; tap the picked piece again
 * to turn it a quarter turn clockwise (the picked piece carries a clockwise
 * arrow, so the board shows this without the caption); tap the outline to put it in. He
 * chooses the piece and the turn; the board chooses the place (the place it
 * fits, if the turn is one that can fit). A piece turned the wrong way still
 * goes in, where it covers most of the outline, so it visibly sticks out.
 * Tapping a placed piece (shown faint in the tray) lifts it out into his hand.
 * Nothing moves on its own: every state is a still picture.
 *
 * Shown, not said: where two small triangles stand in for a bigger one, the
 * board draws that bigger triangle = the two small ones joined, all round long.
 * The hint's colours have a picture key; the worked answer draws each piece as
 * it started, one clockwise arrow per quarter turn, and as it goes in.
 */

type Pt = readonly [number, number];
type Poly = readonly Pt[];

/** Piece colours: warm and saturated, none of them the gold or red the hint draws with. */
const HUE = {
  orange: '#E8590C',
  blue: '#1C6DD0',
  green: '#27813B',
  pink: '#B5179E',
} as const;
type Colour = keyof typeof HUE;

export interface PieceDef {
  /** What the prompt and hint call it: 'triangle', or 'orange triangle' when there are several. */
  readonly name: string;
  readonly noun: string;
  readonly colour: Colour;
  /** The piece as it is cut, before any turning. */
  readonly shape: Poly;
  /** Clockwise quarter turns it shows in the tray at first. */
  readonly start: number;
}

export interface Placement {
  /** Clockwise quarter turns from as cut. */
  readonly turn: number;
  /** Top-left corner of the turned piece's box, in outline grid steps. */
  readonly at: Pt;
}

export interface Round {
  /** What the outline is: 'square', 'wide triangle'. */
  readonly name: string;
  /** Grid points; the outline's box starts at 0,0. */
  readonly outline: Poly;
  readonly pieces: readonly PieceDef[];
  /** One way to fill it, found by search, so it is right by construction. */
  readonly solution: readonly Placement[];
  /** The mathematics, said once it fits. */
  readonly why: string;
  /**
   * When two small triangles stand in for one bigger one. The board then
   * draws, all round long, the bigger triangle beside the two small ones
   * joined into the same shape: the equivalence shown, not said.
   */
  readonly halves?: Halves;
}

export interface Halves {
  /** The bigger triangle, as cut. */
  readonly whole: Poly;
  /** Its colour when it is one of the round's pieces; null when only the outline has it. */
  readonly colour: Colour | null;
  /** The two small pieces, by index. */
  readonly parts: readonly [number, number];
  /** Where the two small pieces lie over the whole, found by search. */
  readonly fill: readonly Placement[];
}

export interface Answer {
  /** Each piece's clockwise quarter turns from as cut. */
  readonly turns: readonly number[];
  /** Each piece's top-left corner in the outline, or null while it is in the tray. */
  readonly at: readonly (Pt | null)[];
  /** The piece in his hand. */
  readonly holding: number | null;
}

/* ------------------------------------------------------------ geometry --- */

const mod4 = (n: number) => ((n % 4) + 4) % 4;

/** The shape after `n` clockwise quarter turns (on screen, y down), moved so its box starts at 0,0. */
export function turned(shape: Poly, n: number): Poly {
  let p: Pt[] = shape.map(([x, y]) => [x, y] as Pt);
  for (let i = 0; i < mod4(n); i += 1) p = p.map(([x, y]) => [-y, x] as Pt);
  const mx = Math.min(...p.map((v) => v[0]));
  const my = Math.min(...p.map((v) => v[1]));
  return p.map(([x, y]) => [x - mx + 0, y - my + 0] as Pt);
}

function box(poly: Poly): { readonly w: number; readonly h: number } {
  return { w: Math.max(...poly.map((v) => v[0])), h: Math.max(...poly.map((v) => v[1])) };
}

/** A unit cell cut along both diagonals: quarter 0 top, 1 right, 2 bottom, 3 left. These are their centres. */
const CENTRE: readonly Pt[] = [[0.5, 1 / 6], [5 / 6, 0.5], [0.5, 5 / 6], [1 / 6, 0.5]];

/** Even-odd ray test. Quarter centres never lie on a grid line or a diagonal, so there is no edge case. */
function inside(poly: Poly, [px, py]: Pt): boolean {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** One quarter-cell: cell column, cell row, which quarter. */
type Quarter = readonly [number, number, number];

const key = ([x, y, q]: Quarter, dx = 0, dy = 0) => `${x + dx},${y + dy},${q}`;

/** The quarter-cells a shape (box at 0,0) covers, row by row. */
function quarters(poly: Poly): Quarter[] {
  const { w, h } = box(poly);
  const out: Quarter[] = [];
  for (let cy = 0; cy < h; cy += 1) {
    for (let cx = 0; cx < w; cx += 1) {
      CENTRE.forEach(([ox, oy], q) => {
        if (inside(poly, [cx + ox, cy + oy])) out.push([cx, cy, q]);
      });
    }
  }
  return out;
}

/** A shape turned, its box, and its quarters — cached, since the board asks often. */
interface Pose {
  readonly poly: Poly;
  readonly w: number;
  readonly h: number;
  readonly quarters: readonly Quarter[];
  /** The quarters as one string: two turns that look alike have the same sign. */
  readonly sign: string;
}
const POSES = new WeakMap<Poly, Pose[]>();
function pose(shape: Poly, turn: number): Pose {
  let all = POSES.get(shape);
  if (!all) {
    all = [0, 1, 2, 3].map((n) => {
      const poly = turned(shape, n);
      const qs = quarters(poly);
      return { poly, ...box(poly), quarters: qs, sign: qs.map((q) => key(q)).join('|') };
    });
    POSES.set(shape, all);
  }
  return all[mod4(turn)];
}

/** The keys a piece covers when its box's top-left corner is at `at`. */
const covers = (shape: Poly, turn: number, at: Pt) => pose(shape, turn).quarters.map((q) => key(q, at[0], at[1]));

/** The turns worth trying for a piece, fewest first from its start; a square has only one. */
function orientations(p: PieceDef): number[] {
  const seen = new Set<string>();
  const out: number[] = [];
  for (let k = 0; k < 4; k += 1) {
    const t = mod4(p.start + k);
    const s = pose(p.shape, t).sign;
    if (!seen.has(s)) {
      seen.add(s);
      out.push(t);
    }
  }
  return out;
}

/** The fewest clockwise quarter turns from the start that look like `turn`. */
function turnsNeeded(p: PieceDef, turn: number): number {
  const target = pose(p.shape, turn).sign;
  for (let k = 0; k < 4; k += 1) if (pose(p.shape, p.start + k).sign === target) return k;
  return 0;
}

/**
 * Exact cover by search: place the listed pieces, in order, so that together
 * they cover `free` once each and nothing else. Returns their placements, or
 * null. Three pieces, four turns, a handful of places: it is instant.
 */
function cover(free: ReadonlySet<string>, pieces: readonly PieceDef[], todo: readonly number[], W: number, H: number): Placement[] | null {
  if (todo.length === 0) return free.size === 0 ? [] : null;
  const [i, ...rest] = todo;
  for (const turn of orientations(pieces[i])) {
    const { w, h } = pose(pieces[i].shape, turn);
    for (let dy = 0; dy <= H - h; dy += 1) {
      for (let dx = 0; dx <= W - w; dx += 1) {
        const ks = covers(pieces[i].shape, turn, [dx, dy]);
        if (!ks.every((k) => free.has(k))) continue;
        const next = new Set(free);
        ks.forEach((k) => next.delete(k));
        const after = cover(next, pieces, rest, W, H);
        if (after) return [{ turn, at: [dx, dy] }, ...after];
      }
    }
  }
  return null;
}

/* -------------------------------------------------------------- pieces --- */

/** Half of a 2-by-2 square: square corner bottom-left, two sides of 2. */
const BIG: Poly = [[0, 0], [2, 2], [0, 2]];
/** Half of BIG: its long side of 2 on top, square corner pointing down. */
const MID: Poly = [[0, 0], [2, 0], [1, 1]];
/** Half of MID: half of one grid square. */
const SMALL: Poly = [[0, 0], [1, 1], [0, 1]];
const SQUARE: Poly = [[0, 0], [2, 0], [2, 2], [0, 2]];
const ELL: Poly = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [0, 2]];
const TEE: Poly = [[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 1], [0, 1]];
const PENTAGON: Poly = [[1, 0], [2, 1], [2, 3], [0, 3], [0, 1]];
const STAIRS: Poly = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [0, 3]];
const TRAPEZOID: Poly = [[0, 0], [1, 0], [3, 2], [0, 2]];
const PARALLELOGRAM: Poly = [[1, 0], [3, 0], [2, 1], [0, 1]];

const OUTLINE = {
  wide: [[0, 2], [2, 0], [4, 2]] as Poly,
  tall: [[0, 0], [2, 2], [0, 4]] as Poly,
  parallelogram: [[0, 2], [2, 0], [4, 0], [2, 2]] as Poly,
  diamond: [[1, 0], [2, 1], [1, 2], [0, 1]] as Poly,
  rectangle: [[0, 0], [2, 0], [2, 3], [0, 3]] as Poly,
  house: [[2, 0], [4, 2], [3, 2], [3, 4], [1, 4], [1, 2], [0, 2]] as Poly,
  boat: [[0, 0], [6, 0], [4, 2], [2, 2]] as Poly,
  trapezoid: [[0, 0], [2, 0], [4, 2], [0, 2]] as Poly,
  /** Twice the size of BIG each way: square corner bottom-left, two sides of 4. */
  bigTriangle: [[0, 0], [4, 4], [0, 4]] as Poly,
  /** A square of side four diagonals, standing on its corner. */
  bigDiamond: [[2, 0], [4, 2], [2, 4], [0, 2]] as Poly,
};

const piece = (colour: Colour, noun: string, shape: Poly, start: number): PieceDef => ({
  name: `${colour} ${noun}`,
  noun,
  colour,
  shape,
  start,
});

/* -------------------------------------------------------------- rounds --- */

/** Level 1: one piece; the outline is the same piece turned. [shape, noun, colour, outline turn, start turn, why] */
const ONE: ReadonlyArray<readonly [Poly, string, Colour, number, number, string]> = [
  [BIG, 'triangle', 'orange', 1, 0, 'Turned, it is the same triangle: the same three sides, the same three corners, the same size.'],
  [ELL, 'L-shape', 'blue', 2, 0, 'The L-shape points another way, but it is the same three squares joined the same way.'],
  [TEE, 'T-shape', 'green', 3, 0, 'The T-shape lies on its side, but it is still four squares joined the same way.'],
  [PENTAGON, 'pentagon', 'pink', 1, 0, 'On its side it is still a pentagon: five sides and five corners. Only its direction changed.'],
  [STAIRS, 'staircase', 'orange', 2, 0, 'After a half turn the staircase still has three steps of the same size. Turning never changes a length.'],
  [TRAPEZOID, 'trapezoid', 'blue', 3, 1, 'The same trapezoid, turned: its two parallel sides stay parallel, and every side keeps its length.'],
  [PARALLELOGRAM, 'parallelogram', 'green', 1, 0, 'Standing up, it is the same parallelogram. Its opposite sides are still parallel and equal.'],
];

/** Levels 2 and 3: [outline name, outline, pieces, why]. */
type Many = readonly [string, Poly, readonly PieceDef[], string];

const TWO: readonly Many[] = [
  ['square', SQUARE, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', BIG, 0)],
    "Two equal triangles make a square. Their long sides meet along the square's diagonal."],
  ['wide triangle', OUTLINE.wide, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', BIG, 1)],
    'Two triangles side by side make one wide triangle. Their square corners meet in the middle of its base.'],
  ['parallelogram', OUTLINE.parallelogram, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', BIG, 0)],
    'The same two triangles, joined along a short side, make a parallelogram instead of a square.'],
  ['tilted square', OUTLINE.diamond, [piece('pink', 'triangle', MID, 0), piece('green', 'triangle', MID, 0)],
    'Two triangles make a square standing on its corner. It is still a square: four equal sides, four square corners.'],
  ['pentagon', PENTAGON, [piece('green', 'square', SQUARE, 0), piece('orange', 'triangle', MID, 0)],
    "A square and a triangle make a pentagon. The triangle's long side sits along the top of the square."],
  ['rectangle', OUTLINE.rectangle, [piece('blue', 'L-shape', ELL, 0), piece('pink', 'L-shape', ELL, 0)],
    'Two L-shapes, each a half turn from the other, lock together into a rectangle of six squares.'],
  ['tall triangle', OUTLINE.tall, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', BIG, 2)],
    'Two triangles make a tall triangle. It is the wide triangle given a quarter turn, and just as big.'],
];

const THREE: readonly Many[] = [
  ['square', SQUARE, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', MID, 0), piece('green', 'triangle', MID, 0)],
    'One big triangle and two half-size triangles make a square. The two small ones together match the big one.'],
  ['big triangle', OUTLINE.bigTriangle, [piece('orange', 'triangle', BIG, 1), piece('blue', 'triangle', BIG, 2), piece('green', 'triangle', BIG, 3), piece('pink', 'triangle', BIG, 1)],
    'Four equal triangles make one triangle with sides twice as long. Twice as long each way takes four pieces, not two.'],
  ['house', OUTLINE.house, [piece('green', 'square', SQUARE, 0), piece('orange', 'triangle', BIG, 1), piece('blue', 'triangle', MID, 1), piece('pink', 'triangle', MID, 3)],
    'A square makes the walls. One big and two small triangles make the roof: the small pair fills the space of one big one.'],
  ['wide triangle', OUTLINE.wide, [piece('orange', 'triangle', BIG, 1), piece('blue', 'triangle', MID, 0), piece('pink', 'triangle', MID, 0)],
    'A big triangle and two small ones make one wide triangle. The two small ones fill the space of one big one.'],
  ['tilted square', OUTLINE.bigDiamond, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', BIG, 0), piece('green', 'triangle', BIG, 0), piece('pink', 'triangle', BIG, 0)],
    'Four equal triangles make a square on its corner. Their square corners meet in the middle, each pointing a different way.'],
  ['trapezoid', OUTLINE.trapezoid, [piece('orange', 'triangle', BIG, 2), piece('blue', 'triangle', BIG, 1), piece('green', 'triangle', MID, 0), piece('pink', 'triangle', MID, 2)],
    'Two big and two small triangles make a trapezoid. Two small triangles fill the space of one big one.'],
  ['parallelogram', OUTLINE.parallelogram, [piece('orange', 'triangle', BIG, 0), piece('blue', 'triangle', MID, 0), piece('green', 'triangle', MID, 0)],
    'A big triangle and two small ones make a parallelogram. Its opposite sides are parallel and equal.'],
  ['boat', OUTLINE.boat, [piece('orange', 'triangle', BIG, 0), piece('green', 'square', SQUARE, 0), piece('blue', 'triangle', BIG, 0)],
    'A square between two triangles makes the boat. Its outline is a trapezoid: the top and bottom are parallel.'],
  ['pentagon', PENTAGON, [piece('green', 'square', SQUARE, 0), piece('orange', 'triangle', SMALL, 0), piece('blue', 'triangle', SMALL, 0)],
    "Two small triangles make the pentagon's roof. Together they are one triangle sitting on the square."],
];

const outlineKeys = (round: Round) => new Set(pose(round.outline, 0).quarters.map((q) => key(q)));

function build(name: string, outline: Poly, pieces: readonly PieceDef[], why: string): Round {
  const o = turned(outline, 0);
  const { w, h } = box(o);
  const free = new Set(quarters(o).map((q) => key(q)));
  const solution = cover(free, pieces, pieces.map((_, i) => i), w, h);
  if (!solution) throw new Error(`turn-it-does-it-fit: the pieces cannot fill the ${name}`);
  const halves = halvesOf(pieces);
  return { name, outline: o, pieces, solution, why, ...(halves ? { halves } : {}) };
}

/**
 * Two half-size triangles in a round stand in for the next size up: two MID
 * for one BIG, two SMALL for one MID. The whole is a piece of the round when
 * there is one, so the picture points at a triangle he can see in the tray.
 */
function halvesOf(pieces: readonly PieceDef[]): Halves | undefined {
  for (const [half, whole] of [[MID, BIG], [SMALL, MID]] as const) {
    const parts = pieces.flatMap((p, i) => (p.shape === half ? [i] : []));
    // Only when sizes are mixed: two equal triangles alone are not standing in for anything.
    if (parts.length < 2 || parts.length === pieces.length) continue;
    const pair: readonly [number, number] = [parts[0], parts[1]];
    const own = pieces.find((p) => p.shape === whole);
    const { w, h } = box(whole);
    const fill = cover(new Set(quarters(whole).map((q) => key(q))), pieces, pair, w, h);
    if (!fill) throw new Error('turn-it-does-it-fit: two small triangles do not fill a bigger one');
    return { whole, colour: own ? own.colour : null, parts: pair, fill };
  }
  return undefined;
}

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const at = (n: number) => ((index % n) + n) % n;
  if (level === 1) {
    const [shape, noun, colour, goal, start, why] = ONE[at(ONE.length)];
    return build(noun, turned(shape, goal), [{ name: noun, noun, colour, shape, start }], why);
  }
  const table = level === 2 ? TWO : THREE;
  const [name, outline, pieces, why] = table[at(table.length)];
  return build(name, outline, pieces, why);
}

/* ----------------------------------------------------- placing and checking */

/** Where each piece lands, as quarter keys, and what that does to the outline. */
interface Coverage {
  /** Outline quarters nothing covers yet. */
  readonly gap: readonly string[];
  /** Piece quarters outside the outline. */
  readonly outside: readonly string[];
  /** Quarters two pieces both cover. */
  readonly overlap: readonly string[];
  /** Per piece: does any of it lie outside the outline? */
  readonly sticksOut: readonly boolean[];
  /** Pairs of pieces that overlap. */
  readonly clashes: ReadonlyArray<readonly [number, number]>;
}

function coverage(round: Round, turns: readonly number[], at: readonly (Pt | null)[]): Coverage {
  const outline = outlineKeys(round);
  const owner = new Map<string, number>();
  const outside: string[] = [];
  const overlap: string[] = [];
  const sticksOut = round.pieces.map(() => false);
  const clashes: Array<readonly [number, number]> = [];
  round.pieces.forEach((p, i) => {
    const where = at[i];
    if (!where) return;
    for (const k of covers(p.shape, turns[i], where)) {
      if (!outline.has(k)) {
        outside.push(k);
        sticksOut[i] = true;
      }
      const j = owner.get(k);
      if (j === undefined) owner.set(k, i);
      else {
        overlap.push(k);
        if (!clashes.some(([a, b]) => a === j && b === i)) clashes.push([j, i]);
      }
    }
  });
  const gap = [...outline].filter((k) => !owner.has(k));
  return { gap, outside, overlap, sticksOut, clashes };
}

/**
 * Where the board puts piece `i`, at its current turn, when he taps the
 * outline. If the turn can fit, the place it fits — preferring a place that
 * still lets the other tray pieces fill the rest. If not, the place it covers
 * most of the empty outline, so the part that sticks out is plain to see.
 */
export function placeFor(round: Round, answer: Answer, i: number): Pt {
  const { w: W, h: H } = box(round.outline);
  const p = round.pieces[i];
  const turn = answer.turns[i];
  const { w, h } = pose(p.shape, turn);
  const taken = new Set<string>();
  round.pieces.forEach((q, j) => {
    const where = answer.at[j];
    if (j !== i && where) covers(q.shape, answer.turns[j], where).forEach((k) => taken.add(k));
  });
  const free = new Set([...outlineKeys(round)].filter((k) => !taken.has(k)));
  const others = round.pieces.map((_, j) => j).filter((j) => j !== i && !answer.at[j]);

  let fitting: Pt | null = null;
  let best: { at: Pt; hit: number; miss: number } | null = null;
  for (let dy = Math.min(0, H - h); dy <= Math.max(0, H - h); dy += 1) {
    for (let dx = Math.min(0, W - w); dx <= Math.max(0, W - w); dx += 1) {
      const ks = covers(p.shape, turn, [dx, dy]);
      const hit = ks.filter((k) => free.has(k)).length;
      if (hit === ks.length) {
        const rest = new Set(free);
        ks.forEach((k) => rest.delete(k));
        if (cover(rest, round.pieces, others, W, H)) return [dx, dy];
        fitting ??= [dx, dy];
      }
      const miss = ks.length - hit;
      if (!best || hit > best.hit || (hit === best.hit && miss < best.miss)) best = { at: [dx, dy], hit, miss };
    }
  }
  return fitting ?? best?.at ?? [0, 0];
}

const listNames = (names: readonly string[]) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const COUNT: Record<number, string> = { 2: 'two', 3: 'three', 4: 'four' };

function prompt(round: Round): string {
  if (round.pieces.length === 1) return `Turn the ${round.pieces[0].noun} until it fits the outline.`;
  return `Turn and fit ${COUNT[round.pieces.length]} pieces into the ${round.name}.`;
}

/**
 * Any exact fill is right, not only the drawn one. A miss names what the board
 * now marks: a piece still in the tray, two pieces on top of each other, or a
 * piece sticking out (red) with the empty part of the outline (gold).
 */
function check(round: Round, answer: Answer): Verdict {
  const c = coverage(round, answer.turns, answer.at);
  const waiting = round.pieces.filter((_, i) => !answer.at[i]).map((p) => p.name);
  if (waiting.length === round.pieces.length) {
    return { ok: false, hint: waiting.length === 1 ? `The outline is empty. The ${waiting[0]} is still in the tray.` : `The outline is empty. ${waiting.length} pieces are in the tray.` };
  }
  if (waiting.length === 0 && c.gap.length === 0 && c.outside.length === 0 && c.overlap.length === 0) return { ok: true };
  // A piece on the board that is wrong matters more than one not yet tried.
  if (c.clashes.length > 0) {
    const [a, b] = c.clashes[0];
    return { ok: false, hint: `The ${round.pieces[a].name} and the ${round.pieces[b].name} overlap. The gold part is empty.` };
  }
  const out = round.pieces.filter((_, i) => c.sticksOut[i]).map((p) => p.name);
  if (out.length > 0) {
    return { ok: false, hint: `${cap(`the ${listNames(out)}`)} ${out.length === 1 ? 'sticks' : 'stick'} out (red). The gold part is empty.` };
  }
  if (waiting.length > 0) {
    return { ok: false, hint: `The ${listNames(waiting)} ${waiting.length === 1 ? 'is' : 'are'} still in the tray. The gold part is empty.` };
  }
  return { ok: false, hint: 'The gold part of the outline is empty.' };
}

function explain(round: Round): string {
  return round.why;
}

/* --------------------------------------------------------------- board --- */

/** Pixels to one grid step, the same in the outline and in the tray. */
const S = 48;
const INK = 'var(--ink)';
const RED = '#C8372D';

const ptsAt = (poly: Poly, k: number, at: Pt = [0, 0]) => poly.map(([x, y]) => `${(x + at[0]) * k},${(y + at[1]) * k}`).join(' ');
const pts = (poly: Poly, at: Pt = [0, 0]) => ptsAt(poly, S, at);

/** One quarter-cell as a triangle, from its "x,y,q" key. */
function quarterPoly(k: string): Poly {
  const [x, y, q] = k.split(',').map(Number);
  const c: Pt = [x + 0.5, y + 0.5];
  const corner: Pt[] = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
  return [corner[q], corner[(q + 1) % 4], c];
}

/** How far a piece can stick out past the outline's box, so the frame never changes size mid-round. */
function margin(round: Round): number {
  const { w: W, h: H } = box(round.outline);
  let m = 0;
  for (const p of round.pieces) {
    for (let t = 0; t < 4; t += 1) {
      const { w, h } = pose(p.shape, t);
      m = Math.max(m, w - W, h - H);
    }
  }
  return m + 0.5;
}

const turnWords = (n: number) => (n === 0 ? 'no turn' : n === 1 ? '1 quarter turn' : n === 2 ? '2 quarter turns (a half turn)' : '3 quarter turns');

const frameStyle: CSSProperties = { display: 'block', background: 'var(--raised)', borderRadius: 'var(--radius-sm)' };

/** A tray piece, drawn at the board's scale (or `k` px a step) and at its current turn. */
function Shape({ p, turn, k = S }: { readonly p: PieceDef; readonly turn: number; readonly k?: number }) {
  const { poly, w, h } = pose(p.shape, turn);
  return (
    <svg viewBox={`-4 -4 ${w * k + 8} ${h * k + 8}`} style={{ width: w * k + 8, height: h * k + 8 }} aria-hidden="true">
      <polygon points={ptsAt(poly, k)} fill={HUE[p.colour]} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Drawn beside the piece in his hand, so the board itself says what a second
 * tap does: a quarter turn, clockwise. A still picture, not a motion.
 */
function TurnArrow({ size = 44 }: { readonly size?: number }) {
  return (
    <svg viewBox="0 0 44 44" style={{ width: size, height: size }} aria-hidden="true">
      <path d="M22 8 A14 14 0 1 1 8 22" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <polygon points="8,11 1.5,23 14.5,23" fill={INK} />
    </svg>
  );
}

/**
 * The worked answer's turns as things to count: one clockwise arrow (the same
 * arrow his second tap shows) for each quarter turn from where the piece
 * started. No arrows: it goes in as it is.
 */
function Turns({ n }: { readonly n: number }) {
  if (n === 0) return null;
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: n }, (_, k) => (
        <TurnArrow key={k} size={28} />
      ))}
    </span>
  );
}

/** Grid step of the picture below: smaller than the board's, so it reads as a picture and not a piece. */
const K = 36;

/**
 * When two small triangles stand in for a bigger one, the board shows it all
 * round long: the bigger triangle, an equals sign, and the two small ones
 * joined into exactly that shape. A still picture, not a control.
 */
function SameAs({ round }: { readonly round: Round }) {
  const h = round.halves;
  if (!h) return null;
  const { w, h: ht } = box(h.whole);
  const pad = 4;
  const gap = 44;
  const vw = w * K * 2 + gap;
  const mid = (ht * K) / 2;
  const [a, b] = h.parts.map((i) => round.pieces[i].name);
  const whole = h.colour ? `the ${h.colour} triangle` : 'one bigger triangle';
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${vw + 2 * pad} ${ht * K + 2 * pad}`}
      style={{ display: 'block', width: vw + 2 * pad, height: ht * K + 2 * pad }}
      role="img"
      aria-label={`The ${a} and the ${b}, joined, make the same shape as ${whole}.`}
    >
      <polygon points={ptsAt(h.whole, K)} fill={h.colour ? HUE[h.colour] : 'var(--paper-2)'} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <g stroke={INK} strokeWidth={4} strokeLinecap="round">
        <line x1={w * K + 12} y1={mid - 6} x2={w * K + gap - 12} y2={mid - 6} />
        <line x1={w * K + 12} y1={mid + 6} x2={w * K + gap - 12} y2={mid + 6} />
      </g>
      <g transform={`translate(${w * K + gap} 0)`}>
        {h.parts.map((i, n) => {
          const p = round.pieces[i];
          const f = h.fill[n];
          return (
            <polygon key={i} points={ptsAt(pose(p.shape, f.turn).poly, K, f.at)} fill={HUE[p.colour]} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * The hint marks, explained by picture: a gold patch beside "empty", a red
 * striped patch beside "sticks out". The swatches are the same fills the
 * outline uses, so he matches colour to colour; the words are only labels.
 */
function Key({ hatch }: { readonly hatch: string }) {
  const swatch = (fill: string, word: string) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg viewBox="0 0 40 40" style={{ width: 40, height: 40 }} aria-hidden="true">
        <rect x={2} y={2} width={36} height={36} rx={4} fill={fill} stroke={INK} strokeWidth={2} />
      </svg>
      <span style={{ fontSize: 'var(--t-xs)', color: 'var(--ink-soft)' }}>{word}</span>
    </span>
  );
  return (
    <div className="board-row" role="img" aria-label="Gold: empty. Red stripes: sticking out, or on top of another piece.">
      {swatch('var(--gold)', 'empty')}
      {swatch(`url(#${hatch})`, 'sticks out')}
    </div>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'worked' || stage === 'solved';
  const worked = stage === 'worked';
  const hatch = `hatch${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { w: W, h: H } = box(round.outline);
  const m = margin(round);

  // On 'worked' the solution is drawn in the outline; otherwise his answer.
  const turns = worked ? round.solution.map((s) => s.turn) : answer.turns;
  const at: readonly (Pt | null)[] = worked ? round.solution.map((s) => s.at) : answer.at;
  const c = coverage(round, turns, at);
  const marks = stage === 'hint';
  const holding = locked ? null : answer.holding;

  const tapPiece = (i: number) => {
    if (answer.at[i]) {
      // Lift a placed piece back out, into his hand, at the turn it had.
      setAnswer({ ...answer, at: answer.at.map((a, j) => (j === i ? null : a)), holding: i });
    } else if (answer.holding === i) {
      setAnswer({ ...answer, turns: answer.turns.map((t, j) => (j === i ? mod4(t + 1) : t)) });
    } else {
      setAnswer({ ...answer, holding: i });
    }
  };

  const put = () => {
    if (holding === null) return;
    const where = placeFor(round, answer, holding);
    setAnswer({ ...answer, at: answer.at.map((a, j) => (j === holding ? where : a)), holding: null });
  };

  const vb = `${-m * S} ${-m * S} ${(W + 2 * m) * S} ${(H + 2 * m) * S}`;
  const dots: Pt[] = [];
  for (let y = Math.ceil(-m); y <= Math.floor(H + m); y += 1) for (let x = Math.ceil(-m); x <= Math.floor(W + m); x += 1) dots.push([x, y]);
  const placed = round.pieces.map((p, i) => ({ p, i, where: at[i] })).filter((e): e is { p: PieceDef; i: number; where: Pt } => !!e.where);
  const held = holding === null ? null : round.pieces[holding];

  const label = `The ${round.name} outline${placed.length ? `, holding ${listNames(placed.map((e) => `the ${e.p.name}`))}` : ', empty'}${held ? `. Tap to put the ${held.name} in` : ''}.`;

  return (
    <div className="board">
      <div className="board-row">
        <Slot ariaLabel={label} ready={held !== null} filled={placed.length === round.pieces.length} onTap={held ? put : undefined}>
          <svg viewBox={vb} style={{ ...frameStyle, width: (W + 2 * m) * S, maxWidth: '100%', height: 'auto' }} aria-hidden="true">
            <defs>
              <pattern id={hatch} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width={10} height={10} fill="#FFFFFF" />
                <rect width={5} height={10} fill={RED} />
              </pattern>
            </defs>
            {dots.map(([x, y]) => (
              <circle key={`${x},${y}`} cx={x * S} cy={y * S} r={2.5} fill="var(--rule-strong)" />
            ))}
            <polygon points={pts(round.outline)} fill="var(--paper-2)" />
            {marks ? c.gap.map((k) => <polygon key={`g${k}`} points={pts(quarterPoly(k))} fill="var(--gold)" opacity={0.75} />) : null}
            {placed.map(({ p, i, where }) => (
              <polygon key={`f${i}`} points={pts(pose(p.shape, turns[i]).poly, where)} fill={HUE[p.colour]} fillOpacity={0.82} />
            ))}
            {marks
              ? [...c.outside, ...c.overlap].map((k, n) => <polygon key={`r${n}`} points={pts(quarterPoly(k))} fill={`url(#${hatch})`} />)
              : null}
            {placed.map(({ p, i, where }) => (
              <polygon
                key={`e${i}`}
                points={pts(pose(p.shape, turns[i]).poly, where)}
                fill="none"
                stroke={marks && c.sticksOut[i] ? RED : INK}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeDasharray={worked ? '8 5' : undefined}
              />
            ))}
            <polygon points={pts(round.outline)} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="10 6" strokeLinejoin="round" />
          </svg>
        </Slot>
      </div>
      {marks ? <Key hatch={hatch} /> : null}
      {worked ? (
        <p className="board-caption">
          {round.pieces.map((p, i) => `${cap(p.name)}: ${turnWords(turnsNeeded(p, round.solution[i].turn))}.`).join(' ')}
        </p>
      ) : null}
      <SameAs round={round} />
      <Tray label="Pieces">
        {round.pieces.map((p, i) => {
          const isPlaced = !!answer.at[i];
          const tone = isPlaced ? 'ghost' : holding === i ? 'picked' : 'source';
          const aria = isPlaced
            ? `Lift the ${p.name} out`
            : holding === i
              ? `Turn the ${p.name} a quarter turn`
              : `Pick up the ${p.name}`;
          if (worked) {
            // The worked answer as a picture: as it started, one arrow per quarter turn, as it goes in.
            const goal = round.solution[i].turn;
            const n = turnsNeeded(p, goal);
            return (
              <Piece key={i} tone="worked" ariaLabel={`${cap(p.name)}: ${turnWords(n)}`}>
                {n > 0 ? <Shape p={p} turn={p.start} k={K} /> : null}
                <Turns n={n} />
                <Shape p={p} turn={goal} k={K} />
              </Piece>
            );
          }
          return (
            <Piece key={i} tone={tone} ariaLabel={aria} onTap={locked ? undefined : () => tapPiece(i)}>
              <Shape p={p} turn={answer.turns[i]} />
              {holding === i ? <TurnArrow /> : null}
            </Piece>
          );
        })}
      </Tray>
      {!locked ? (
        <p className="board-caption">
          {held ? `Tap the ${held.name} again to turn it. Tap the outline to put it in.` : 'Tap a piece to pick it up.'}
        </p>
      ) : null}
    </div>
  );
}

export const turnItDoesItFit: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'turn-it-does-it-fit',
  title: 'Turn It. Does It Fit?',
  hook: 'Same shape, any way round.',
  group: 'shapes',
  levels: ['Turn one shape', 'Two make one', 'Three or four pieces'],
  generate,
  prompt,
  emptyAnswer: (round) => ({ turns: round.pieces.map((p) => mod4(p.start)), at: round.pieces.map(() => null), holding: null }),
  Board,
  check,
  explain,
  cover: 'art/games/turn-it-does-it-fit.png',
  note: {
    what: 'An outline on a dot grid and one to four flat pieces drawn at the same size. He taps a piece to pick it up, taps it again to give it a quarter turn (a curved arrow appears beside the piece he is holding), and taps the outline; the board puts the piece where it fits, so he chooses the turn, not the place.',
    expect: 'At level 1 most children put the piece in first and look afterwards; the part that sticks out is the cue to turn it. Each tap turns clockwise, so a piece that needs a turn the other way takes three taps; some children stop after one and look puzzled. At level 2 the square is where it breaks: both triangles go in the same way round and overlap. At level 3 two small triangles must stand in for one big one, and the tilted square only closes when all four triangles point different ways; expect him to put two the same way round first.',
    practising: 'Rotation keeps a shape the same: its sides, corners and size do not change when it turns. Composing shapes: two equal right-angled triangles make a square, a bigger triangle or a parallelogram, depending on which sides meet; four of them make a triangle with every side twice as long, because doubling the sides takes four times the pieces.',
    ask: "With a piece in his hand, before he turns it: 'Which corner of the outline does this square corner go into? How many turns will that take?'",
    next: 'Fold a square of cereal-box card corner to corner and cut it into two triangles. Ask him to make a square, then a big triangle, then a parallelogram, saying which sides touch. Then turn one triangle on the table and ask if it is still the same triangle.',
    honest: 'Tapping lets him find the turn by trial; it does not show that he can turn a shape in his head. Watch whether he says the number of turns before tapping. Flipping a piece over (a mirror image) is a different move, and this game never asks for it.',
    easier: 'Stay on level 1. After it fits, ask him to turn it back to how it started and count the taps out loud.',
    harder: 'Before he touches a piece, ask how many quarter turns each one needs. At level 3, cover the tray with your hand and ask which piece goes in which part of the outline.',
    safety: 'A grown-up does the cutting for the card version. Keep the scissors and the small offcuts away from his 2-year-old sister.',
  },
};

export default turnItDoesItFit;
