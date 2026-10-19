import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Spread Them Out — conservation of number.
 *
 * Concept (advisor, maths 1 / game 2): rearranging objects preserves their
 * number. Blue dinosaur tokens and orange ones (blue/orange rather than
 * green/orange, so the pair survives red-green colour blindness). The
 * misconception it challenges: "a longer row has more; moving them changes
 * how many".
 *
 * Levels 1 and 3 are the classic conservation task as a static before/after
 * pair. A "Before" strip shows both groups lined up in pairs; underneath,
 * "now", the same dinosaurs have been moved. A child who trusts that moving
 * adds none answers from the Before strip without recounting.
 *  1. Rows. One row stands exactly where it stood Before; the other is
 *     spread out or pushed together. Two rounds start unequal, and in one of
 *     them the MOVED row is the one with more, so neither "the same" nor
 *     "not the one that moved" is a free answer.
 *  2. No Before strip: two rows, one extra dinosaur hidden in the tighter
 *     one, mixed with equal rounds and one round where the longer row really
 *     has more. He has to pair or count, not judge by length.
 *  3. Both groups moved, into a ring and a heap of 9 to 12 (too many to
 *     count at a glance, and a ring has no first dinosaur). In some rounds
 *     one dinosaur was also taken away, leaving an empty dashed spot. He has
 *     to tell a change that cannot alter the number (moving) from one that
 *     does (taking away) and combine it with the Before pairs.
 *
 * Control: tap-to-choose only (More blue / The same / More orange).
 * Evidence, from 'hint' on: the Before strip writes each row's count; two
 * rows now get one line from each blue dinosaur to one orange (lines never
 * cross, and no line runs under a dinosaur it does not join); an empty spot
 * turns gold. On 'worked' every dinosaur is numbered in counting order,
 * unpartnered ones are ringed in gold, and each group's total is written.
 * A ring or heap gets no lines: a straight line out of a ring passes under
 * its neighbours and makes an unpartnered dinosaur look partnered.
 * All states are fixed SVG drawings — nothing moves.
 */

export type Colour = 'blue' | 'orange';
export type Shape = 'row' | 'circle' | 'pile';
/**
 * Row spacing: tight (pushed together), wide (spread to fill the board), or
 * even (exactly where it stood in the Before strip). Rings and heaps: tight.
 */
export type Spacing = 'tight' | 'wide' | 'even';

export interface Group {
  /** Dinosaurs there now. */
  readonly count: number;
  readonly shape: Shape;
  readonly spacing: Spacing;
  /** Taken away since the Before strip; each leaves an empty dashed spot. */
  readonly gone: number;
}

export interface Round {
  readonly blue: Group;
  readonly orange: Group;
  /**
   * Draw the Before strip: both groups lined up in pairs, before anything
   * moved or was taken. Rows are only ever compared with rows, and rings
   * and heaps with each other.
   */
  readonly before: boolean;
}

export type Answer = Colour | 'same' | null;

const row = (count: number, spacing: Spacing): Group => ({ count, shape: 'row', spacing, gone: 0 });
const ring = (count: number, gone = 0): Group => ({ count, shape: 'circle', spacing: 'tight', gone });
const heap = (count: number, gone = 0): Group => ({ count, shape: 'pile', spacing: 'tight', gone });
const moved = (blue: Group, orange: Group): Round => ({ blue, orange, before: true });
const cold = (blue: Group, orange: Group): Round => ({ blue, orange, before: false });

/** Deterministic variety without Math.random: one table per level, walked by index. */
const TABLE: Record<Level, readonly Round[]> = {
  // At most 8 a row, so the Before strip fits at full size and the row that
  // did not move is drawn at exactly the same spots in both pictures.
  1: [
    moved(row(6, 'even'), row(6, 'wide')),
    moved(row(7, 'tight'), row(6, 'even')),
    moved(row(5, 'tight'), row(5, 'even')),
    moved(row(5, 'wide'), row(6, 'even')),
    moved(row(8, 'wide'), row(7, 'even')),
    moved(row(7, 'even'), row(7, 'tight')),
  ],
  2: [
    cold(row(7, 'tight'), row(6, 'wide')),
    cold(row(8, 'wide'), row(8, 'tight')),
    cold(row(6, 'wide'), row(7, 'tight')),
    cold(row(9, 'wide'), row(8, 'tight')),
    cold(row(7, 'wide'), row(8, 'tight')),
    cold(row(9, 'tight'), row(9, 'wide')),
  ],
  // A ring looks bigger than a heap of the same number. Three times the ring
  // has fewer, once it has more, twice they are equal. Round 5 (index 4)
  // needs both facts: orange had one more Before, lost one, and now they match.
  3: [
    moved(ring(10), heap(10)),
    moved(heap(12), ring(11, 1)),
    moved(ring(9), heap(10)),
    moved(ring(11, 1), heap(12)),
    moved(ring(11), heap(11, 1)),
    moved(ring(12), heap(10, 1)),
  ],
};

export function generate(level: Level, index: number): Round {
  const table = TABLE[level];
  return table[index % table.length];
}

export function correct(round: Round): Exclude<Answer, null> {
  const { blue, orange } = round;
  return blue.count === orange.count ? 'same' : blue.count > orange.count ? 'blue' : 'orange';
}

/** How many stood in the Before strip. */
const total = (g: Group): number => g.count + g.gone;
const rowsOnly = (round: Round): boolean => round.blue.shape === 'row';
/** A row drawn 'even' is where it stood Before; anything else has moved. */
const hasMoved = (g: Group): boolean => !(g.shape === 'row' && g.spacing === 'even');
const COLOURS = ['blue', 'orange'] as const;
const NUMBER_WORD = ['no', 'one', 'two', 'three', 'four', 'five'];
const other = (c: Colour): Colour => (c === 'blue' ? 'orange' : 'blue');
/** The colour that lost a dinosaur since Before (the table takes at most one). */
const takenFrom = (round: Round): Colour | undefined => COLOURS.find((c) => round[c].gone > 0);

function prompt(round: Round): string {
  if (!round.before) return 'Which row has more dinosaurs, or are they the same?';
  if (rowsOnly(round)) {
    return `Only the ${hasMoved(round.blue) ? 'blue' : 'orange'} row moved. Which has more now, or the same?`;
  }
  if (takenFrom(round)) return 'Both moved. One taken away. Which has more now, or the same?';
  return 'Both groups moved. Which has more now, or the same?';
}

/* ------------------------------------------------------------- geometry -- */

interface Pt {
  readonly x: number;
  readonly y: number;
}

/** A place in a group: a dinosaur, or the empty spot one was taken from. */
interface Spot extends Pt {
  readonly empty: boolean;
}

interface Box {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

const W = 1000;
const R = 30;
/** Outer margin, and the gap between boxes. */
const M = 8;
const PAD = 18;
const ROW_BAND = 132;
/** Each row's name sits left of this line, the dinosaurs right of it. */
const LABEL_COL = 160;
const ROW_CX = (LABEL_COL + W - M) / 2;
/** Furthest apart the two end dinosaurs of a wide row can be, centre to centre. */
const SPAN = W - M - LABEL_COL - 2 * R - 24;
const TIGHT_GAP = 2 * R + 4;
/**
 * The Before strip's spacing, and an 'even' row's. A row that did not move
 * starts at the same x with the same gap, so it stands exactly where it stood.
 */
const EVEN_GAP = 2 * R + 22;
const EVEN_X0 = LABEL_COL + R + 16;
const MAX_WIDE_GAP = 150;
const RING_GAP = 2 * R + 8;
const PILE_STEP = 2 * R + 6;
const PILE_ROW = (PILE_STEP * Math.sqrt(3)) / 2;
const JIGGLE = [2, -2, 0, -1, 2, 1, -2] as const;
/** The Before strip: two rows of full-size tokens, with room between them for the pair lines. */
const BEFORE_PAD = 12;
const BEFORE_LINK = 24;
const BEFORE_H = 2 * BEFORE_PAD + 4 * R + BEFORE_LINK;
/** A ring or heap sits right of its box's middle by this much, clear of the name in the corner. */
const SIDE_SHIFT = 30;

const FILL: Record<Colour, string> = { blue: '#1c6dd0', orange: '#cf5f0a' };
const TINT: Record<Colour, string> = { blue: '#e2eefc', orange: '#fde9d4' };
const DEEP: Record<Colour, string> = { blue: '#0f4790', orange: '#8f3f05' };
const INK = '#24170f';
const PAPER = '#fff8ec';
const SHEET = '#f3ead9';
const GOLD = '#f2a900';

/**
 * Spots for a pile: a hex packing PILE_STEP apart, filled from the middle
 * outward and bottom first, so a bigger pile is a heap rather than a ring.
 * Each spot is nudged by at most 2 px so it does not read as a grid;
 * neighbours stay at least 2R apart, so every token is whole and countable.
 */
const PILE_SPOTS: readonly Pt[] = (() => {
  const base: Pt[] = [];
  for (let r = -2; r <= 2; r += 1) {
    for (let q = -2; q <= 2; q += 1) {
      if (Math.abs(q + r) <= 2) base.push({ x: PILE_STEP * (q + r / 2), y: PILE_ROW * r });
    }
  }
  const d = (p: Pt) => Math.round(Math.hypot(p.x, p.y));
  base.sort((a, b) => d(a) - d(b) || b.y - a.y || a.x - b.x);
  return base.map((p, n) => ({ x: p.x + JIGGLE[n % 7], y: p.y + JIGGLE[(n + 3) % 7] }));
})();

function bounds(pts: readonly Pt[]) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

/**
 * Every spot of a group (dinosaurs and empty spots), as offsets from the
 * group's centre, in the order he would count them. Rows are centred on
 * ROW_CX except 'even' ones, which start at EVEN_X0 like the Before strip.
 */
function shapePoints(g: Group): Spot[] {
  const n = total(g);
  const idx = Array.from({ length: n }, (_, i) => i);
  if (g.shape === 'circle') {
    // Clockwise from the top: a circle has no end, so the count needs a start.
    const r = Math.max(2.6 * R, (n * RING_GAP) / (2 * Math.PI));
    const gone = new Set(Array.from({ length: g.gone }, (_, j) => Math.round((n * (j + 1)) / (g.gone + 2))));
    return idx.map((i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return { x: r * Math.cos(a), y: r * Math.sin(a), empty: gone.has(i) };
    });
  }
  if (g.shape === 'pile') {
    // A heap is counted line by line, top to bottom, left to right. Lines are
    // PILE_ROW apart and the nudge is 2 px, so rounding never splits a line.
    // The spots filled last are on the heap's edge: those are the ones taken.
    const spots = PILE_SPOTS.slice(0, n);
    const b = bounds(spots);
    const pts = spots.map((p, k) => ({ x: p.x - (b.x0 + b.x1) / 2, y: p.y - (b.y0 + b.y1) / 2, empty: k >= g.count }));
    const line = (p: Pt) => Math.round((p.y - b.y0 + (b.y0 + b.y1) / 2) / PILE_ROW);
    return pts.sort((a, c) => line(a) - line(c) || a.x - c.x);
  }
  if (g.spacing === 'even') return idx.map((i) => ({ x: EVEN_X0 - ROW_CX + i * EVEN_GAP, y: 0, empty: false }));
  const gap = g.spacing === 'tight' ? TIGHT_GAP : Math.min(MAX_WIDE_GAP, SPAN / (n - 1));
  return idx.map((i) => ({ x: (i - (n - 1) / 2) * gap, y: 0, empty: false }));
}

/** Height of the group, tokens included. */
function tall(g: Group): number {
  const b = bounds(shapePoints(g));
  return b.y1 - b.y0 + 2 * R;
}

/** How spread out a group looks: mean distance of its dinosaurs from their middle. */
function spread(g: Group): number {
  const pts = shapePoints(g).filter((p) => !p.empty);
  const mx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const my = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  return pts.reduce((s, p) => s + Math.hypot(p.x - mx, p.y - my), 0) / pts.length;
}

/**
 * The Before strip on top when there is one. Below it, "now": two rows are
 * stacked, blue on top, each centred on ROW_CX (an 'even' row starts at
 * EVEN_X0). A ring and a heap sit side by side instead: stacked, the board
 * grows past its height cap and every token shrinks.
 */
interface Layout {
  readonly h: number;
  readonly side: boolean;
  readonly before: Box | null;
  /** Centre-to-centre gap of the Before strip: an 'even' row's, unless 12 must fit. */
  readonly beforeGap: number;
  readonly box: Record<Colour, Box>;
  readonly at: Record<Colour, Pt>;
}

function layout(round: Round): Layout {
  const { blue, orange } = round;
  const before = round.before ? { x: M, y: M, w: W - 2 * M, h: BEFORE_H } : null;
  const most = Math.max(total(blue), total(orange));
  const beforeGap = Math.min(EVEN_GAP, (W - M - 16 - R - EVEN_X0) / (most - 1));
  const top = before ? 2 * M + BEFORE_H : M;
  if (!rowsOnly(round)) {
    const w = (W - 3 * M) / 2;
    const h = Math.max(tall(blue), tall(orange)) + 2 * PAD;
    return {
      h: top + h + M,
      side: true,
      before,
      beforeGap,
      box: { blue: { x: M, y: top, w, h }, orange: { x: 2 * M + w, y: top, w, h } },
      at: { blue: { x: M + w / 2 + SIDE_SHIFT, y: top + h / 2 }, orange: { x: 2 * M + 1.5 * w + SIDE_SHIFT, y: top + h / 2 } },
    };
  }
  const yo = top + ROW_BAND + M;
  return {
    h: yo + ROW_BAND + M,
    side: false,
    before,
    beforeGap,
    box: { blue: { x: M, y: top, w: W - 2 * M, h: ROW_BAND }, orange: { x: M, y: yo, w: W - 2 * M, h: ROW_BAND } },
    at: { blue: { x: ROW_CX, y: top + ROW_BAND / 2 }, orange: { x: ROW_CX, y: yo + ROW_BAND / 2 } },
  };
}

/** Every spot of a group now, on the board, in counting order. */
function place(round: Round, lay: Layout, colour: Colour): Spot[] {
  const c = lay.at[colour];
  return shapePoints(round[colour]).map((p) => ({ ...p, x: c.x + p.x, y: c.y + p.y }));
}

/** The Before strip: blue k above orange k, so the k-th of each are partners. */
function beforePoints(round: Round, lay: Layout): Record<Colour, Pt[]> {
  const b = lay.before as Box;
  const y = { blue: b.y + BEFORE_PAD + R, orange: b.y + b.h - BEFORE_PAD - R };
  const line = (c: Colour) => Array.from({ length: total(round[c]) }, (_, k) => ({ x: EVEN_X0 + k * lay.beforeGap, y: y[c] }));
  return { blue: line('blue'), orange: line('orange') };
}

/** A matching line this far from every token it does not join is clearly not touching one. */
const CLEAR = R + 12;

/** Distance from p to the segment ab. */
function clearance(p: Pt, a: Pt, b: Pt): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
}

/** Every way to pick k of the indices 0..n-1. */
function choose(n: number, k: number): number[][] {
  if (k === 0) return [[]];
  if (n < k) return [];
  return [...choose(n - 1, k - 1).map((c) => [...c, n - 1]), ...choose(n - 1, k)];
}

interface Matching {
  /** [blue, orange] token centres joined by one line. */
  readonly pairs: ReadonlyArray<readonly [Pt, Pt]>;
  /** Counting-order indices of the dinosaurs left without a partner. */
  readonly spare: Record<Colour, ReadonlySet<number>>;
}

/**
 * One-to-one matching between two rows as they stand now. Both rows are
 * paired left to right, so no two lines cross. Which dinosaurs of the bigger
 * row stay unpartnered is chosen so that no line runs under a dinosaur it
 * does not join: left at the end of a bunched row, the spare would have its
 * neighbour's line pass right under it and look partnered.
 */
function rowMatching(round: Round, lay: Layout): Matching {
  const blue = place(round, lay, 'blue');
  const orange = place(round, lay, 'orange');
  const big: Colour = blue.length > orange.length ? 'blue' : 'orange';
  const many = big === 'blue' ? blue : orange;
  const few = big === 'blue' ? orange : blue;
  const all = [...blue, ...orange];
  const tail = Array.from({ length: many.length - few.length }, (_, k) => few.length + k);
  const key = (spare: number[]) => {
    const lines = many.filter((_, i) => !spare.includes(i)).map((p, k) => [p, few[k]] as const);
    // Any line further than CLEAR from every other token reads as clean; past
    // that, prefer the spare the Before strip shows (its overhang, the tail).
    const gap = Math.min(...lines.flatMap(([a, b]) => all.filter((t) => t !== a && t !== b).map((t) => clearance(t, a, b))));
    const length = lines.reduce((s, [a, b]) => s + Math.hypot(a.x - b.x, a.y - b.y), 0);
    return [Math.round(Math.min(gap, CLEAR)), spare.join() === tail.join() ? 1 : 0, -length] as const;
  };
  const better = (a: readonly number[], b: readonly number[]) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  let best = { key: key(tail), spare: tail };
  for (const spare of choose(many.length, many.length - few.length)) {
    const k = key(spare);
    if (better(k, best.key) > 0) best = { key: k, spare };
  }
  const kept = many.filter((_, i) => !best.spare.includes(i));
  const none: ReadonlySet<number> = new Set();
  return {
    pairs: kept.map((p, k) => (big === 'blue' ? ([p, few[k]] as const) : ([few[k], p] as const))),
    spare: { blue: big === 'blue' ? new Set(best.spare) : none, orange: big === 'orange' ? new Set(best.spare) : none },
  };
}

/** Pairs in the Before strip are its columns; the overhang has no partner. */
function beforeMatching(round: Round, lay: Layout): Matching {
  const pts = beforePoints(round, lay);
  const n = Math.min(pts.blue.length, pts.orange.length);
  const tail = (c: Colour) => new Set(Array.from({ length: pts[c].length - n }, (_, k) => n + k));
  return { pairs: pts.blue.slice(0, n).map((b, k) => [b, pts.orange[k]] as const), spare: { blue: tail('blue'), orange: tail('orange') } };
}

/* ------------------------------------------------------------- the rules -- */

const SHAPE_WORD: Record<Shape, string> = { row: 'row', circle: 'circle', pile: 'pile' };
const cap = (c: Colour): string => (c === 'blue' ? 'Blue' : 'Orange');

/** The group that looks bigger because its dinosaurs sit further apart, if either does. */
function looser(round: Round): Colour | null {
  const sb = spread(round.blue);
  const so = spread(round.orange);
  return Math.abs(sb - so) < 4 ? null : sb > so ? 'blue' : 'orange';
}

/** What happened between the Before strip and now, as the board shows it. */
function since(round: Round): string {
  const t = takenFrom(round);
  if (t) return `Then they moved, and one ${t} was taken away.`;
  if (rowsOnly(round)) return `Then only the ${hasMoved(round.blue) ? 'blue' : 'orange'} row moved.`;
  return 'Then they only moved.';
}

function check(round: Round, answer: Answer): Verdict {
  if (answer === correct(round)) return { ok: true };
  const facts: string[] = [];
  // A wrong colour is usually the group that LOOKS bigger: name that fact first.
  const big = looser(round);
  if (big && answer === big) facts.push(`The ${big} ${SHAPE_WORD[round[big].shape]} takes more room.`);
  if (round.before) facts.push(`Before: ${total(round.blue)} blue, ${total(round.orange)} orange.`, since(round));
  if (rowsOnly(round)) {
    const n = Math.min(round.blue.count, round.orange.count);
    facts.push(`${round.before ? 'Now ' : ''}${n} lines each join one blue to one orange.`);
  }
  return { ok: false, hint: facts.join(' ') };
}

function explain(round: Round): string {
  const { blue, orange } = round;
  const counts = `${blue.count} blue, ${orange.count} orange.`;
  const t = takenFrom(round);
  if (t) return `${counts} ${cap(t)} had ${total(round[t])} before; taking one away left ${round[t].count}. Moving changed nothing.`;
  const right = correct(round);
  if (right === 'same') return `${counts} Moving dinosaurs apart or together changes the shape, not how many.`;
  const loser = other(right);
  const d = Math.abs(blue.count - orange.count);
  if (looser(round) === loser) {
    return `${counts} The ${loser} ${SHAPE_WORD[round[loser].shape]} takes more room but has fewer. More room adds no dinosaurs.`;
  }
  return `${counts} The ${right} ${SHAPE_WORD[round[right].shape]} has ${NUMBER_WORD[d]} more. Here the look and the count agree.`;
}

/** The full answer in one line, written under the worked board. */
function workedFact(round: Round): string {
  const { blue, orange } = round;
  const now = `${blue.count} blue, ${orange.count} orange`;
  const d = Math.abs(blue.count - orange.count);
  const verdict =
    d === 0 ? 'the same' : `${NUMBER_WORD[d]} more ${blue.count > orange.count ? 'blue' : 'orange'}`;
  if (round.before) return `Before: ${total(blue)} blue, ${total(orange)} orange. ${since(round)} Now ${now}: ${verdict}.`;
  if (d === 0) return `${now}: every blue dinosaur has one orange partner.`;
  const c: Colour = blue.count > orange.count ? 'blue' : 'orange';
  return `${now}: ${NUMBER_WORD[d]} ${c} dinosaur${d > 1 ? 's have' : ' has'} no partner.`;
}

/* -------------------------------------------------------------- drawing -- */

/** A long-necked dinosaur facing right, about 36 wide, centred on (0, 0). */
const DINO =
  'M-18 3 Q-11 -2 -5 -4 Q3 -8 7 -3 L10 -11 Q11 -15 15 -14 Q18 -13 16 -10 L12 -9 L10 -1 ' +
  'Q10 4 7 5 L7 12 L3.5 12 L3.5 6.5 L-4.5 6.5 L-4.5 12 L-8 12 L-8 5.5 Q-12 5.5 -18 3 Z';

function Token({ at, colour, n, faded }: { readonly at: Pt; readonly colour: Colour; readonly n?: number; readonly faded?: boolean }) {
  return (
    <g transform={`translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`} opacity={faded ? 0.3 : undefined}>
      <circle r={R} fill={FILL[colour]} stroke={INK} strokeWidth="3" />
      {n === undefined ? (
        <path d={DINO} transform="scale(1.3)" fill={PAPER} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
      ) : (
        <text y="11" textAnchor="middle" fontSize="31" fontWeight="700" fill={PAPER} fontFamily="var(--font-display)">
          {n}
        </text>
      )}
    </g>
  );
}

/** Where a dinosaur stood before it was taken away: a dashed ring, gold once the hint points at it. */
function EmptySpot({ at, colour, lit }: { readonly at: Pt; readonly colour: Colour; readonly lit: boolean }) {
  return (
    <circle cx={at.x} cy={at.y} r={R - 3} fill="none" stroke={lit ? GOLD : DEEP[colour]} strokeWidth={lit ? 6 : 3} strokeDasharray="9 7" />
  );
}

/** The point on a token's rim facing its partner: where the matching line is tied. */
function rim(from: Pt, to: Pt): Pt {
  const d = Math.hypot(to.x - from.x, to.y - from.y);
  return { x: from.x + ((to.x - from.x) * (R - 2)) / d, y: from.y + ((to.y - from.y) * (R - 2)) / d };
}

/** Partner lines, tied with a knot on each rim, so an unpartnered dinosaur is the one with no knot. */
function Links({ pairs, under }: { readonly pairs: Matching['pairs']; readonly under: boolean }) {
  return under ? (
    <g stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.7">
      {pairs.map(([b, o], k) => (
        <line key={k} x1={b.x} y1={b.y} x2={o.x} y2={o.y} />
      ))}
    </g>
  ) : (
    <g fill={INK}>
      {pairs.flatMap(([b, o], k) => [rim(b, o), rim(o, b)].map((p, e) => <circle key={`${k}-${e}`} cx={p.x} cy={p.y} r="6" />))}
    </g>
  );
}

const SPACING_SAID: Record<Spacing, string> = { tight: 'pushed together', wide: 'spread wide', even: 'where they stood before' };

function said(colour: Colour, g: Group): string {
  const where = g.shape === 'row' ? `in a row, ${SPACING_SAID[g.spacing]}` : `in a ${g.shape}`;
  return `${g.count} ${colour} dinosaurs ${where}${g.gone ? ', and an empty spot where one was taken away' : ''}`;
}

const TEXT = { fontWeight: 700, fontFamily: 'var(--font-display)' } as const;

/**
 * The board picture.
 *  'answering': the Before strip (if any) with its pairs joined, and the
 *    groups as they are now.
 *  'hint' and 'solved': the Before strip writes each row's count; two rows
 *    now are joined one blue to one orange; an empty spot turns gold.
 *  'worked': all of that, every dinosaur numbered in counting order (empty
 *    spots skipped), unpartnered ones ringed in gold, each total written.
 */
function Picture({ round, stage }: { readonly round: Round; readonly stage: BoardProps<Round, Answer>['stage'] }) {
  const worked = stage === 'worked';
  const shown = stage !== 'answering';
  const lay = layout(round);
  const now = rowsOnly(round) ? rowMatching(round, lay) : null;
  const ring = (at: Pt, key: string) => <circle key={key} cx={at.x} cy={at.y} r={R + 8} fill="none" stroke={GOLD} strokeWidth="6" />;

  const beforeStrip = () => {
    if (!lay.before) return null;
    const b = lay.before;
    const pts = beforePoints(round, lay);
    const m = beforeMatching(round, lay);
    return (
      <g key="before">
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="18" fill={SHEET} stroke={INK} strokeWidth="2" strokeDasharray="10 6" />
        <text x={b.x + 22} y={b.y + b.h / 2 + 10} fontSize="28" fill={INK} {...TEXT}>
          Before
        </text>
        <Links pairs={m.pairs} under />
        {COLOURS.map((c) =>
          pts[c].map((p, i) => (
            <g key={`${c}${i}`}>
              {worked && m.spare[c].has(i) ? ring(p, 's') : null}
              <Token at={p} colour={c} n={worked ? i + 1 : undefined} />
            </g>
          )),
        )}
        <Links pairs={m.pairs} under={false} />
        {shown
          ? COLOURS.map((c) => (
              <text key={`n${c}`} x={EVEN_X0 - R - 12} y={pts[c][0].y + 11} textAnchor="end" fontSize="30" fill={DEEP[c]} {...TEXT}>
                {total(round[c])}
              </text>
            ))
          : null}
      </g>
    );
  };

  const box = (c: Colour) => {
    const b = lay.box[c];
    const name = cap(c);
    // A row's name sits in the label column, left of the row. A ring's or
    // heap's sits in its box's top corner and its total in the bottom one:
    // the group is pushed right by SIDE_SHIFT, so neither touches a token.
    const tx = b.x + (lay.side ? 18 : 22);
    const ty = lay.side ? b.y + 36 : b.y + b.h / 2 + (worked ? -8 : 10);
    return (
      <g key={`box-${c}`}>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="18" fill={TINT[c]} stroke={DEEP[c]} strokeWidth="2" />
        <text x={tx} y={ty} fontSize="30" fill={DEEP[c]} {...TEXT}>
          {name}
        </text>
        {worked ? (
          <text x={tx} y={lay.side ? b.y + b.h - 20 : ty + 40} fontSize="34" fill={DEEP[c]} {...TEXT}>
            {round[c].count}
          </text>
        ) : null}
      </g>
    );
  };

  const tokens = (c: Colour) => {
    const pts = place(round, lay, c);
    let k = 0;
    return (
      <g key={`tokens-${c}`}>
        {pts.map((p, i) => {
          if (p.empty) return <EmptySpot key={i} at={p} colour={c} lit={shown} />;
          k += 1;
          return (
            <g key={i}>
              {worked && now?.spare[c].has(i) ? ring(p, 's') : null}
              <Token at={p} colour={c} n={worked ? k : undefined} />
            </g>
          );
        })}
      </g>
    );
  };

  const label = `${lay.before ? `Before: ${total(round.blue)} blue and ${total(round.orange)} orange, lined up in pairs. Now: ` : ''}${said('blue', round.blue)}. ${said('orange', round.orange)}.`;
  return (
    <svg className="board-svg" viewBox={`0 0 ${W} ${lay.h}`} role="img" aria-label={label}>
      {beforeStrip()}
      {box('blue')}
      {box('orange')}
      {shown && now ? <Links pairs={now.pairs} under /> : null}
      {tokens('blue')}
      {tokens('orange')}
      {shown && now ? <Links pairs={now.pairs} under={false} /> : null}
    </svg>
  );
}

const CHOICES: ReadonlyArray<readonly [Exclude<Answer, null>, string]> = [
  ['blue', 'More blue'],
  ['same', 'The same'],
  ['orange', 'More orange'],
];

function Swatch({ answer }: { readonly answer: Exclude<Answer, null> }) {
  const dot = (colour: Colour, cx: number) => <circle cx={cx} cy="14" r="11" fill={FILL[colour]} stroke={INK} strokeWidth="2.5" />;
  return (
    <svg viewBox="0 0 54 28" width="54" height="28" aria-hidden="true">
      {answer === 'same' ? (
        <>
          {dot('blue', 14)}
          {dot('orange', 40)}
        </>
      ) : (
        dot(answer, 27)
      )}
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const right = correct(round);
  return (
    <div className="board board--spread">
      <Picture round={round} stage={stage} />
      {stage === 'worked' ? <p className="board-caption">{workedFact(round)}</p> : null}
      <div className="choices" role="group" aria-label="Which has more?">
        {CHOICES.map(([value, label]) => (
          <Choice
            key={value}
            selected={answer === value}
            onTap={() => setAnswer(value)}
            disabled={locked}
            mark={locked && value === right ? 'right' : null}
          >
            <Swatch answer={value} />
            {label}
          </Choice>
        ))}
      </div>
    </div>
  );
}

export const spreadThemOut: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'spread-them-out',
  title: 'Spread Them Out',
  hook: 'Does moving them add any?',
  group: 'numbers',
  levels: ['One row moved', 'Find the extra', 'Circle and pile'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/spread-them-out.png',
  note: {
    what: 'Blue and orange dinosaur tokens. On levels 1 and 3 a "Before" strip shows them lined up in pairs; below it, the same dinosaurs after someone moved them. He taps More blue, The same, or More orange.',
    expect:
      'On level 1 many five-year-olds pick the row that now looks longer, even though the Before strip shows the pairs right above it: that is the conservation misconception itself. On level 2 there is no Before strip, so he must pair or count, and the longer row often has fewer. On level 3 he is likely to lose his place counting the ring, which has no first dinosaur, or to miss the empty dashed spot.',
    practising:
      'Conservation of number: moving objects apart, together or into a new shape does not change how many, and only adding or taking away does. Also one-to-one matching as a way to compare without counting.',
    ask: 'Just before he taps on a level 1 board, point at the row that moved and ask: "Did anyone add a dinosaur when this row was spread out? So how many are there now?"',
    next: 'Put seven spoons in a row on the table and seven steel katoris opposite them, one bowl per spoon. Spread the spoons to the edge of the table and ask which has more. Then let him push them back together and check by pairing.',
    honest:
      'A right answer may only mean he counted both groups, which is good counting but not yet conservation. Conservation shows when he answers from the Before strip, saying "still seven, it only moved", WITHOUT recounting. The game cannot see which he did; watch his finger.',
    easier: 'Stay on level 1 and ask him to put a finger on each Before pair before he answers. Off screen, use five real objects per row and move only one row.',
    harder:
      'On level 1, cover the lower picture with your hand and ask: "I spread the orange ones out. Did I add any?" before he looks. On level 3, ask him to say the answer from the Before strip and the empty spot alone, then count to check.',
  },
};

export default spreadThemOut;
