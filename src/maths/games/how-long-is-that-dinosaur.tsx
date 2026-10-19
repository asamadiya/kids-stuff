import { useState } from 'react';
import type { ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * How Long Is That Dinosaur? — maths game 9 (advisor catalogue), strand `measure`.
 *
 * Concept (advisor, maths 7): a length is a count of equal units laid end to
 * end, with no gaps, starting where the object starts. On a marked strip that
 * means counting the SPACES from the start mark, not the marks. The three
 * misconceptions, one per level: gaps do not matter; the number at the nose
 * is the length wherever the tail sits (or the first mark counts as one); and
 * more blocks always means longer, whatever size the blocks are.
 *
 * The toy dinosaurs are drawn at true scale to the blocks under them, with
 * dashed drop lines at the tail tip and the nose. Two of the four are real
 * Indian dinosaurs: Rajasaurus (Gujarat) and Barapasaurus (Godavari valley).
 *
 * Levels:
 *  1. Count the blocks. Wooden blocks lie under the dinosaur. Most lines are
 *     end to end; in some one block is missing, leaving a block-wide gap inside
 *     the line or at the tail, and the gap must be counted as a block.
 *  2. Read the strip. A strip marked 0 to 10, one block to a space. Sometimes
 *     the tail is at 0; sometimes at 1, 2 or 3, so the number at the nose is
 *     not the length. Counting marks instead of spaces gives one too many.
 *  3. Big and small blocks. Two dinosaurs, one measured in big blocks and one
 *     in small (a big block is 2 or 3 small). The rows start at different
 *     places, no two ends line up and neither row lies inside the other, so
 *     the eye cannot settle it from one end. More blocks is longer in some
 *     rounds and shorter in others; two rounds are equal.
 *
 * Control: tap-to-choose only. One Choice per length (levels 1-2), or one per
 * dinosaur plus "Same length" (level 3).
 * Hint: the length he CHECKED drawn as a dashed row of blocks from the tail,
 * so he sees it stop short of the nose or run past it; the tail and nose
 * lines drawn bold in blue (level 1); a ghost block in the gap; the tail and
 * nose marks ringed on the strip; each big block split into its small blocks.
 * Worked: every block numbered from the tail; at level 3 both rows moved to
 * one start line and counted in small blocks.
 */

export type Species = 'stegosaurus' | 'triceratops' | 'rajasaurus' | 'barapasaurus';
export type Unit = 'big' | 'small';

export interface BlocksRound {
  readonly kind: 'blocks';
  readonly species: Species;
  /** The dinosaur's length in blocks. */
  readonly length: number;
  /** The place in the line with no block (0 = at the tail), or none. */
  readonly gap: number | null;
  /** The lengths offered, ascending. */
  readonly options: readonly number[];
}

export interface StripRound {
  readonly kind: 'strip';
  readonly species: Species;
  /** The mark under the tail tip. */
  readonly from: number;
  /** The mark under the nose. */
  readonly to: number;
  /** The lengths offered, ascending. */
  readonly options: readonly number[];
}

export interface Measured {
  readonly species: Species;
  /** How many blocks lie under it. */
  readonly count: number;
  readonly unit: Unit;
  /** How far right of the start line the row begins, in small blocks (until the worked answer lines them up). */
  readonly shift: number;
}

export interface CompareRound {
  readonly kind: 'compare';
  /** Small blocks in one big block. */
  readonly ratio: 2 | 3;
  readonly top: Measured;
  readonly bottom: Measured;
}

export type Round = BlocksRound | StripRound | CompareRound;
export type Side = 'top' | 'bottom' | 'same';
/** A length in blocks (levels 1-2), a dinosaur or "same" (level 3), or nothing yet. */
export type Answer = number | Side | null;

/** The strip is marked 0 to STRIP_END. */
const STRIP_END = 10;

// Every options list holds the misconception's answer: at level 1 the count
// of laid blocks on a gap round; at level 2 the count of marks and, when the
// tail is off 0, the number at the nose. The right answer moves between
// positions so it is never "always the second button".
const L1_ROUNDS: ReadonlyArray<readonly [Species, number, number | null, readonly number[]]> = [
  ['stegosaurus', 5, null, [3, 4, 5, 6]],
  ['triceratops', 4, null, [4, 5, 6, 7]],
  ['rajasaurus', 6, 3, [4, 5, 6, 7]],
  ['barapasaurus', 7, null, [6, 7, 8, 9]],
  ['triceratops', 5, 1, [3, 4, 5, 6]],
  ['stegosaurus', 8, null, [5, 6, 7, 8]],
  ['barapasaurus', 6, 0, [5, 6, 7, 8]],
];

const L2_ROUNDS: ReadonlyArray<readonly [Species, number, number, readonly number[]]> = [
  ['stegosaurus', 0, 6, [4, 5, 6, 7]],
  ['triceratops', 1, 6, [5, 6, 7, 8]],
  ['rajasaurus', 0, 7, [6, 7, 8, 9]],
  ['barapasaurus', 2, 8, [5, 6, 7, 8]],
  ['stegosaurus', 1, 5, [2, 3, 4, 5]],
  ['triceratops', 0, 4, [3, 4, 5, 6]],
  ['rajasaurus', 3, 7, [4, 5, 6, 7]],
];

type Row = readonly [Species, number, Unit, number];

// Top length vs bottom length, in small blocks: 8-6, 7-6, 6-6, 8-9, 4-7, 6-6, 7-8.
// Spans [tail, nose] in small blocks from the start line: no round lines up
// two tails or two noses, and no row lies inside the other, so no round can
// be settled by eye at one end. Each shortcut is right in at most three of
// the seven: more blocks (rounds 1, 4), the farther-right nose (0, 3), the
// big-block dinosaur (0, 3, 6). Rounds 2 and 5 are equal, which defeats all three.
const L3_ROUNDS: ReadonlyArray<readonly [2 | 3, Row, Row]> = [
  [2, ['rajasaurus', 4, 'big', 1], ['triceratops', 6, 'small', 0]],
  [2, ['stegosaurus', 7, 'small', 0], ['barapasaurus', 3, 'big', 2]],
  [2, ['triceratops', 3, 'big', 2], ['stegosaurus', 6, 'small', 0]],
  [3, ['barapasaurus', 8, 'small', 0], ['rajasaurus', 3, 'big', 1]],
  [2, ['stegosaurus', 2, 'big', 4], ['rajasaurus', 7, 'small', 0]],
  [3, ['rajasaurus', 2, 'big', 0], ['barapasaurus', 6, 'small', 3]],
  [2, ['triceratops', 7, 'small', 2], ['stegosaurus', 4, 'big', 0]],
];

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = index % 7;
  if (level === 1) {
    const [species, length, gap, options] = L1_ROUNDS[k];
    return { kind: 'blocks', species, length, gap, options };
  }
  if (level === 2) {
    const [species, from, to, options] = L2_ROUNDS[k];
    return { kind: 'strip', species, from, to, options };
  }
  const [ratio, top, bottom] = L3_ROUNDS[k];
  const row = ([species, count, unit, shift]: Row): Measured => ({ species, count, unit, shift });
  return { kind: 'compare', ratio, top: row(top), bottom: row(bottom) };
}

const NAME: Record<Species, string> = {
  stegosaurus: 'Stegosaurus',
  triceratops: 'Triceratops',
  rajasaurus: 'Rajasaurus',
  barapasaurus: 'Barapasaurus',
};

/** A row's length in small blocks. */
const smallLength = (m: Measured, ratio: number) => (m.unit === 'big' ? m.count * ratio : m.count);

/** The big-block row and the small-block row of a comparison. */
const split = (r: CompareRound) => (r.top.unit === 'big' ? { big: r.top, small: r.bottom } : { big: r.bottom, small: r.top });

export function solution(round: Round): number | Side {
  if (round.kind === 'blocks') return round.length;
  if (round.kind === 'strip') return round.to - round.from;
  const a = smallLength(round.top, round.ratio);
  const b = smallLength(round.bottom, round.ratio);
  return a === b ? 'same' : a > b ? 'top' : 'bottom';
}

const blocks = (n: number) => `${n} ${n === 1 ? 'block' : 'blocks'}`;

/** The true length in blocks, for the two one-dinosaur levels. */
const lengthOf = (round: BlocksRound | StripRound) => (round.kind === 'blocks' ? round.length : round.to - round.from);

function prompt(round: Round): string {
  if (round.kind === 'blocks') return `How many blocks long is the ${NAME[round.species]}?`;
  if (round.kind === 'strip') return `Read the strip. How many blocks long is the ${NAME[round.species]}?`;
  return 'Which dinosaur is longer? Or are they the same length?';
}

/** What n blocks laid from the tail do: the same row the board draws on the hint. */
const reach = (n: number, len: number) => `${blocks(n)} from the tail ${n < len ? 'stop short of' : 'run past'} the nose.`;

/** A fact about the board, never a verdict. Pinned to what the hint draws. */
function hintFor(round: Round, answer: Answer): string {
  if (round.kind === 'compare') {
    const lead = answer === null ? 'No dinosaur chosen yet. ' : '';
    // Every level-3 row pair starts at different places, so this always holds.
    return `${lead}One big block is as long as ${round.ratio} small blocks. The two rows start in different places.`;
  }
  const len = lengthOf(round);
  if (round.kind === 'blocks') {
    if (typeof answer !== 'number') {
      // Never the count of laid blocks: on a round with no gap that is the answer.
      return round.gap === null
        ? `No length chosen yet. The blocks run from the tail line to the nose line.`
        : `No length chosen yet. One space in the row has no block.`;
    }
    return `${reach(answer, len)}${round.gap === null ? '' : ' One space in the row has no block.'}`;
  }
  if (typeof answer !== 'number') {
    // Never the nose number on its own: with the tail at 0 that is the answer.
    return round.from > 0
      ? `No length chosen yet. The tail is at ${round.from}, not 0.`
      : 'No length chosen yet. Each block fills one space between two marks.';
  }
  const extra =
    round.from > 0 ? ` The tail is at ${round.from}, not 0.` : answer === len + 1 ? ' Each block fills one space between two marks.' : '';
  return `${reach(answer, len)}${extra}`;
}

/**
 * The answer last CHECKED on each round. check() is the only moment that
 * says which answer was submitted: Help opens the hint stage with nothing
 * checked, and a Check pressed after Help leaves the stage at 'hint', so the
 * board cannot tell from `stage` alone. The hint row is drawn for this answer,
 * so it always matches the hint sentence, and it stays put while he taps
 * other lengths: if it followed his taps he could tap until the row met the
 * nose, a lookup rather than a measurement.
 */
const checked = new WeakMap<Round, Answer>();

function check(round: Round, answer: Answer): Verdict {
  checked.set(round, answer);
  if (answer !== null && answer === solution(round)) return { ok: true };
  return { ok: false, hint: hintFor(round, answer) };
}

function explain(round: Round): string {
  if (round.kind === 'blocks') {
    if (round.gap === null) {
      return `${round.length} equal blocks fit end to end, tail to nose, with no gaps. The ${NAME[round.species]} is ${blocks(round.length)} long.`;
    }
    return `${blocks(round.length - 1)} and a gap one block wide: fill the gap, and ${round.length} blocks reach from tail to nose.`;
  }
  if (round.kind === 'strip') {
    const len = round.to - round.from;
    if (round.from === 0) return `The tail is at 0 and the nose at ${round.to}: ${len} spaces, so ${blocks(len)}. Count spaces, not marks.`;
    return `The tail is at ${round.from} and the nose at ${round.to}. ${round.to} − ${round.from} = ${len}: ${len} spaces, ${blocks(len)}.`;
  }
  const { big, small } = split(round);
  const b = big.count * round.ratio;
  const head = `${NAME[big.species]}: ${big.count} big blocks, which is ${b} small. ${NAME[small.species]}: ${small.count} small blocks.`;
  if (b === small.count) return `${head} Both are ${b} small blocks long.`;
  const longer = b > small.count ? big : small;
  return `${head} ${Math.max(b, small.count)} is more than ${Math.min(b, small.count)}, so the ${NAME[longer.species]} is longer.`;
}

/** One line under the board on the worked answer. */
function workedLine(round: Round): string {
  if (round.kind === 'blocks') {
    return round.gap === null
      ? `${blocks(round.length)} from tail to nose.`
      : `The gap holds one more block: ${round.length - 1} + 1 = ${round.length}.`;
  }
  if (round.kind === 'strip') {
    return `Count the spaces from the tail at ${round.from} to the nose at ${round.to}: ${round.to - round.from}.`;
  }
  const { big, small } = split(round);
  return `Lined up at the start: ${NAME[big.species]} ${big.count * round.ratio} small blocks, ${NAME[small.species]} ${small.count}.`;
}

function caption(round: Round): string {
  if (round.kind === 'blocks') return 'Every block is the same size.';
  if (round.kind === 'strip') return 'Each space on the strip is one block long.';
  return 'Two kinds of block: big and small.';
}

/* ------------------------------------------------------------- drawing -- */

const INK = '#24170f';
const INK_SOFT = '#5a4636';
const HINT = '#1c6dd0';
const WORKED = '#27813b';
const WORKED_TINT = '#e1f2e4';
const WOOD = '#ecc77f';
const WOOD_GRAIN = '#c9974a';
const TEAK = '#b86b34';
const TEAK_GRAIN = '#8a4a1f';
const STRIP = '#fff4d6';
const FONT = 'Fredoka, sans-serif';

/**
 * Each dinosaur is drawn in a 100-wide box, tail tip at x = 0 and nose at
 * x = 100, feet on y = 40; plates and frills reach up to y = -6. The board
 * stretches the box so 0..100 spans exactly the dinosaur's length in blocks:
 * nothing of the animal pokes past either end, so the drop lines at x = 0 and
 * x = 100 are the measurement.
 */
const BOX_TOP = -6;
const BOX_H = 40 - BOX_TOP;

interface Look {
  /** y of the tail tip and of the nose, in the box. */
  readonly tail: number;
  readonly nose: number;
  readonly eye: readonly [number, number];
  readonly fill: string;
  readonly dark: string;
  readonly accent: string;
  /** Far-side legs, drawn first in the dark shade. */
  readonly far: string;
  readonly body: string;
  /** Drawn behind the body in the accent colour (stegosaurus plates). */
  readonly behind?: string;
  /** Drawn over the body: [path, colour role]. */
  readonly over?: ReadonlyArray<readonly [string, 'fill' | 'dark' | 'accent' | 'horn']>;
}

/** Stegosaurus plates: [x, back y, height]. */
const PLATES: ReadonlyArray<readonly [number, number, number]> = [
  [20, 14.8, 5], [27, 12.2, 7], [34, 9.9, 8.5], [41, 8.5, 9.5], [48, 8.2, 9.5], [55, 9.4, 8.5], [61, 11.6, 7], [67, 14.5, 5],
];
const plate = ([c, y, h]: readonly [number, number, number]) =>
  `M${c - 3.2} ${y + 2.5} L${c - 2.2} ${y - h * 0.55} L${c} ${y - h} L${c + 2.2} ${y - h * 0.55} L${c + 3.2} ${y + 2.5} Z`;

const LOOK: Record<Species, Look> = {
  stegosaurus: {
    tail: 21,
    nose: 24,
    eye: [92, 22.4],
    fill: '#7a9a3a',
    dark: '#4f6a1f',
    accent: '#d0662e',
    far: 'M27 27 L27 40 L33.5 40 L33.5 28 Z M60 29 L60 40 L66 40 L66 29.5 Z',
    behind: `${PLATES.map(plate).join(' ')} M3 20.6 L0.5 14 L5.6 19.9 Z M7.6 19.7 L5 12.5 L10.2 19 Z`,
    body: 'M0 21 C8 20 18 15 30 11 C40 7 52 7 62 12 C70 16 78 20 86 21 C92 20 98 21 100 24 C99 27 94 28 88 27 C82 27 76 27 72 28 L72 40 L65 40 L65 30.5 C58 31.5 48 31.5 41 30 L41 40 L33 40 L33 29 C26 27 14 25 0 21 Z',
  },
  triceratops: {
    tail: 24,
    nose: 28.5,
    eye: [87, 22.8],
    fill: '#d49a3a',
    dark: '#9c6a1c',
    accent: '#b83f2f',
    far: 'M28 28 L28 40 L35 40 L35 29 Z M59 30 L59 40 L66 40 L66 31 Z',
    body: 'M0 24 C10 22 20 16 32 13 C44 10 56 11 66 15 C70 17 72 19 74 21 L74 30 L72 30 L72 40 L65 40 L65 32 C57 33 48 33 42 32 L42 40 L34 40 L34 30 C26 28 14 27 0 24 Z',
    over: [
      ['M66 26 C60 18 62 6 72 3 C78 2 82 8 80 16 C79 21 74 25 70 27 Z', 'accent'],
      ['M70 19 C78 17 88 18 94 22 C97 24 99.5 26.5 100 28.5 C97 30.5 92 32 85 32 C79 32 73 30 70 27 Z', 'fill'],
      ['M81 20 L98 9 L84 22 Z M93 23 L96.5 17 L97 24.5 Z', 'horn'],
    ],
  },
  rajasaurus: {
    tail: 20,
    nose: 20,
    eye: [89.5, 15.8],
    fill: '#3f8f86',
    dark: '#25615a',
    accent: '#e0a420',
    far: 'M30 21 C34 17 42 18 44 23 C45 27 43 31 41 33 L40 38 L46 38 L46 40 L34 40 L35 34 C31 31 28 25 30 21 Z M63 26.5 L66 31 L67.5 30.4 L65 26 Z',
    body: 'M0 20 C12 18 24 15 36 14 C46 13 56 14 64 16 C70 17 74 16 78 14 C84 11 92 12 96 14.5 C98.5 16 100 18 100 20 C98 22.5 93 24.5 87 25 C82 25 78 24 75 24.5 C70 25.5 66 27.5 61 28.5 C55 29.5 49 29 45 28 C36 26 20 22 0 20 Z',
    over: [
      ['M36 21 C40 17 48 18 50 23 C51 27 49 31 47 33 L46 38 L52 38 L52 40 L40 40 L41 34 C37 31 34 25 36 21 Z', 'fill'],
      ['M67 26 L70 30.5 L71.5 30 L69 25.5 Z', 'fill'],
      ['M84 12.2 L86.5 8.4 L89 12.3 Z', 'accent'],
    ],
  },
  barapasaurus: {
    tail: 30,
    nose: 6.5,
    eye: [95.5, 4.2],
    fill: '#8e4f7e',
    dark: '#5e2f53',
    accent: '#8e4f7e',
    far: 'M29 27 L29 40 L36 40 L36 28 Z M56 28 L56 40 L63 40 L63 29 Z',
    body: 'M0 30 C10 28 22 20 34 16 C44 12 56 12 64 15 C72 12 80 6 88 3 C92 1.5 96 1.5 98.5 3 C100 4 100 5.5 100 6.5 C98 8 94 8.2 91 7.5 C85 10 77 17 71 22 C69.5 24 69 26 69 27.5 L69 40 L62 40 L62 30.5 C55 31.5 47 31.5 42 30.5 L42 40 L35 40 L35 28.5 C26 28 12 31.5 0 30 Z',
  },
};

const HORN = '#f4ecd8';

/** The dinosaur's paths in box coordinates. Strokes stay `stroke` screen pixels whatever the scale. */
function DinoPaths({ species, stroke }: { readonly species: Species; readonly stroke: number }) {
  const look = LOOK[species];
  const line = { stroke: INK, strokeWidth: stroke, strokeLinejoin: 'round' as const, vectorEffect: 'non-scaling-stroke' as const };
  const colour = { fill: look.fill, dark: look.dark, accent: look.accent, horn: HORN };
  return (
    <g>
      <path d={look.far} fill={look.dark} {...line} />
      {look.behind ? <path d={look.behind} fill={look.accent} {...line} /> : null}
      <path d={look.body} fill={look.fill} {...line} />
      {look.over?.map(([d, role]) => <path key={d} d={d} fill={colour[role]} {...line} />)}
    </g>
  );
}

/**
 * A dinosaur on the board: tail tip at (x, ground + ...), `width` px long.
 * Height follows the length up to `maxH`, then stops growing, so a long
 * dinosaur is a little flatter rather than taller than the board.
 */
function Dino({ species, x, width, ground, maxH }: { readonly species: Species; readonly x: number; readonly width: number; readonly ground: number; readonly maxH: number }) {
  const sx = width / 100;
  const sy = Math.min(sx, maxH / BOX_H);
  const [ex, ey] = LOOK[species].eye;
  return (
    <g>
      <g transform={`translate(${x} ${ground}) scale(${sx} ${sy}) translate(0 -40)`}>
        <DinoPaths species={species} stroke={3} />
      </g>
      <circle cx={x + ex * sx} cy={ground + (ey - 40) * sy} r={Math.max(3.5, sy * 1.1)} fill={INK} />
    </g>
  );
}

/** Screen y of the tail tip and the nose, for the drop lines. */
function ends(species: Species, width: number, ground: number, maxH: number) {
  const sx = width / 100;
  const sy = Math.min(sx, maxH / BOX_H);
  const look = LOOK[species];
  return { tailY: ground + (look.tail - 40) * sy, noseY: ground + (look.nose - 40) * sy };
}

/** A small, undistorted dinosaur for a Choice button. */
function MiniDino({ species }: { readonly species: Species }) {
  return (
    <svg viewBox={`-3 ${BOX_TOP - 2} 106 ${BOX_H + 4}`} width="88" height="42" aria-hidden="true">
      <DinoPaths species={species} stroke={1.6} />
      <circle cx={LOOK[species].eye[0]} cy={LOOK[species].eye[1]} r="1.6" fill={INK} />
    </svg>
  );
}

/** "Same length" drawn: a big-block bar and a small-block bar ending on the same two lines. */
function SameIcon() {
  return (
    <svg viewBox="0 0 72 40" width="62" height="34" aria-hidden="true">
      <rect x="6" y="6" width="60" height="12" rx="3" fill={TEAK} stroke={INK} strokeWidth="2" />
      <rect x="6" y="22" width="60" height="12" rx="3" fill={WOOD} stroke={INK} strokeWidth="2" />
      <line x1="6" x2="6" y1="1" y2="39" stroke={INK_SOFT} strokeWidth="2.5" strokeDasharray="4 3" />
      <line x1="66" x2="66" y1="1" y2="39" stroke={INK_SOFT} strokeWidth="2.5" strokeDasharray="4 3" />
    </svg>
  );
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const X0 = 60;
const TABLE = '#f3e6cc';
const WORKED_DEEP = '#1a5c2a';

type BlockLook = 'wood' | 'teak' | 'try' | 'ghost' | 'worked';

/** One block, its left end at x. Laid blocks share edges, so a row has no seams to read as gaps. */
function Block({ x, y, w, h, look, plain }: { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly look: BlockLook; readonly plain?: boolean }) {
  const solid = look === 'wood' || look === 'teak';
  if (!solid) {
    const stroke = look === 'worked' ? WORKED : HINT;
    const fill = look === 'worked' ? WORKED_TINT : 'rgba(255,255,255,0.75)';
    return <rect x={x + 3} y={y + 1} width={w - 6} height={h - 2} rx="5" fill={fill} stroke={stroke} strokeWidth="3.5" strokeDasharray="8 5" />;
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={look === 'teak' ? TEAK : WOOD} stroke={INK} strokeWidth="3" />
      {plain ? null : (
        <path d={`M${x + w * 0.16} ${y + h * 0.36} q${w * 0.34} ${-h * 0.2} ${w * 0.68} 0`} fill="none" stroke={look === 'teak' ? TEAK_GRAIN : WOOD_GRAIN} strokeWidth="2" strokeLinecap="round" />
      )}
    </g>
  );
}

function Num({ x, y, n, colour, size = 24 }: { readonly x: number; readonly y: number; readonly n: number | string; readonly colour: string; readonly size?: number }) {
  return (
    <text x={x} y={y + size * 0.36} textAnchor="middle" fontSize={size} fontWeight="700" fill={colour} fontFamily={FONT}>
      {n}
    </text>
  );
}

function Drop({ x, y1, y2, colour = INK_SOFT, width = 2.5 }: { readonly x: number; readonly y1: number; readonly y2: number; readonly colour?: string; readonly width?: number }) {
  return <line x1={x} x2={x} y1={y1} y2={y2} stroke={colour} strokeWidth={width} strokeDasharray="6 6" />;
}

function Picture({ w, h, label, children }: { readonly w: number; readonly h: number; readonly label: string; readonly children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
      style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 'min(54vh, 420px)', background: '#fffdf7', border: '2px solid var(--rule)', borderRadius: 14 }}
    >
      {children}
    </svg>
  );
}

type Stage = BoardProps<Round, Answer>['stage'];

interface SceneProps<R> {
  readonly round: R;
  readonly stage: Stage;
  /** The answer the hint is pinned to. */
  readonly tried: Answer;
}

/** A dashed row of `n` blocks from x, numbered: the length he chose, laid out from the tail. */
function TryRow({ x, y, u, h, n }: { readonly x: number; readonly y: number; readonly u: number; readonly h: number; readonly n: number }) {
  return (
    <g>
      {range(n).map((i) => (
        <Block key={i} x={x + i * u} y={y} w={u} h={h} look="try" />
      ))}
      {range(n).map((i) => (
        <Num key={`n${i}`} x={x + (i + 0.5) * u} y={y + h / 2} n={i + 1} colour={HINT} size={20} />
      ))}
    </g>
  );
}

// Level 1: blocks under the dinosaur.
const U1 = 64;
const MAXH1 = 180;
const G1 = 200;
const BY1 = 214;
const BH1 = 40;
const RY1 = 276;
const RH1 = 34;
const W1 = 720;
const H1 = 322;

function BlocksScene({ round, stage, tried }: SceneProps<BlocksRound>) {
  const show = stage === 'worked' || stage === 'solved';
  const hint = stage === 'hint';
  const width = round.length * U1;
  const { tailY, noseY } = ends(round.species, width, G1, MAXH1);
  const bx = (i: number) => X0 + i * U1;
  const laid = range(round.length).filter((i) => i !== round.gap);
  const n = hint && typeof tried === 'number' ? tried : 0;
  const bottom = n > 0 ? RY1 + RH1 : BY1 + BH1;
  const label = [
    `A ${NAME[round.species]} with ${blocks(laid.length)} in a row under it${round.gap === null ? '' : ', and one space with no block'}.`,
    n > 0 ? `A dashed row of ${blocks(n)} starts at the tail.` : '',
    show ? `The blocks are numbered 1 to ${round.length}, tail to nose.` : '',
  ].filter(Boolean).join(' ');
  return (
    <Picture w={W1} h={H1} label={label}>
      <rect x="0" y={G1 - 8} width={W1} height={BY1 + BH1 + 12 - (G1 - 8)} fill={TABLE} />
      <Dino species={round.species} x={X0} width={width} ground={G1} maxH={MAXH1} />
      {laid.map((i) => (
        <Block key={i} x={bx(i)} y={BY1} w={U1} h={BH1} look="wood" plain={show} />
      ))}
      {round.gap !== null && (hint || show) ? <Block x={bx(round.gap)} y={BY1} w={U1} h={BH1} look={show ? 'worked' : 'ghost'} /> : null}
      {show ? range(round.length).map((i) => <Num key={i} x={bx(i) + U1 / 2} y={BY1 + BH1 / 2} n={i + 1} colour={WORKED_DEEP} />) : null}
      {n > 0 ? <TryRow x={X0} y={RY1} u={U1} h={RH1} n={n} /> : null}
      <Drop x={X0} y1={tailY} y2={bottom} colour={hint ? HINT : INK_SOFT} width={hint ? 4 : 2.5} />
      <Drop x={X0 + width} y1={noseY} y2={bottom} colour={hint ? HINT : INK_SOFT} width={hint ? 4 : 2.5} />
    </Picture>
  );
}

// Level 2: a strip marked 0 to 10 under the dinosaur.
const U2 = 60;
const MAXH2 = 168;
const G2 = 190;
const SY = 198;
const SH = 58;
const RY2 = 270;
const RH2 = 34;
const W2 = X0 * 2 + STRIP_END * U2;
const H2 = 316;

function StripScene({ round, stage, tried }: SceneProps<StripRound>) {
  const show = stage === 'worked' || stage === 'solved';
  const hint = stage === 'hint';
  const len = round.to - round.from;
  const mx = (m: number) => X0 + m * U2;
  const width = len * U2;
  const { tailY, noseY } = ends(round.species, width, G2, MAXH2);
  const n = hint && typeof tried === 'number' ? tried : 0;
  const rowEnd = n > 0 || show ? RY2 + RH2 : SY + 20;
  const label = [
    `A ${NAME[round.species]} above a strip marked 0 to ${STRIP_END}. Its tail is over ${round.from} and its nose over ${round.to}.`,
    n > 0 ? `A dashed row of ${blocks(n)} starts at the tail.` : '',
    show ? `The ${len} spaces from ${round.from} to ${round.to} are numbered 1 to ${len}.` : '',
  ].filter(Boolean).join(' ');
  return (
    <Picture w={W2} h={H2} label={label}>
      <Dino species={round.species} x={mx(round.from)} width={width} ground={G2} maxH={MAXH2} />
      <rect x={mx(0) - 24} y={SY} width={STRIP_END * U2 + 48} height={SH} rx="6" fill={STRIP} stroke={INK} strokeWidth="3" />
      {show ? <rect x={mx(round.from)} y={SY + 2} width={width} height={22} fill={WORKED_TINT} /> : null}
      {range(STRIP_END + 1).map((m) => (
        <g key={m}>
          <line x1={mx(m)} x2={mx(m)} y1={SY} y2={SY + 24} stroke={INK} strokeWidth="3" />
          <Num x={mx(m)} y={SY + 40} n={m} colour={INK} size={22} />
        </g>
      ))}
      {hint
        ? [round.from, round.to].map((m) => <circle key={m} cx={mx(m)} cy={SY + 40} r="16" fill="none" stroke={HINT} strokeWidth="3.5" />)
        : null}
      {n > 0 ? <TryRow x={mx(round.from)} y={RY2} u={U2} h={RH2} n={n} /> : null}
      {show
        ? range(len).map((i) => (
            <g key={i}>
              <Block x={mx(round.from + i)} y={RY2} w={U2} h={RH2} look="worked" />
              <Num x={mx(round.from + i + 0.5)} y={RY2 + RH2 / 2} n={i + 1} colour={WORKED_DEEP} size={20} />
            </g>
          ))
        : null}
      <Drop x={mx(round.from)} y1={tailY} y2={rowEnd} />
      <Drop x={mx(round.to)} y1={noseY} y2={rowEnd} />
    </Picture>
  );
}

// Level 3: two dinosaurs, two kinds of block.
const U3 = 52;
const MAXH3 = 150;
const ROW = 216;
const G3 = 172;
const BH3 = 34;
const W3 = 680;
const H3 = 2 * ROW + 8;

function CompareRow({ m, ratio, top, stage }: { readonly m: Measured; readonly ratio: number; readonly top: number; readonly stage: Stage }) {
  const show = stage === 'worked' || stage === 'solved';
  const size = m.unit === 'big' ? ratio : 1;
  const x = X0 + (show ? 0 : m.shift) * U3;
  const width = smallLength(m, ratio) * U3;
  const ground = top + G3;
  const by = ground + 6;
  const { tailY, noseY } = ends(m.species, width, ground, MAXH3);
  const split = m.unit === 'big' && stage !== 'answering';
  const total = smallLength(m, ratio);
  return (
    <g>
      <Dino species={m.species} x={x} width={width} ground={ground} maxH={MAXH3} />
      {range(m.count).map((i) => (
        <Block key={i} x={x + i * size * U3} y={by} w={size * U3} h={BH3} look={m.unit === 'big' ? 'teak' : 'wood'} plain={show} />
      ))}
      {split
        ? range(total)
            .filter((j) => j % size !== 0)
            .map((j) => <line key={j} x1={x + j * U3} x2={x + j * U3} y1={by + 4} y2={by + BH3 - 4} stroke={show ? '#fff4d6' : HINT} strokeWidth="3" strokeDasharray="5 4" />)
        : null}
      {show ? range(total).map((j) => <Num key={`n${j}`} x={x + (j + 0.5) * U3} y={by + BH3 / 2} n={j + 1} colour={m.unit === 'big' ? '#ffffff' : WORKED_DEEP} size={18} />) : null}
      <Drop x={x} y1={tailY} y2={by + BH3 + 6} />
      <Drop x={x + width} y1={noseY} y2={by + BH3 + 6} />
    </g>
  );
}

function CompareScene({ round, stage }: SceneProps<CompareRound>) {
  const show = stage === 'worked' || stage === 'solved';
  const say = (m: Measured) => `${m.count} ${m.unit} ${m.count === 1 ? 'block' : 'blocks'}`;
  const label = [
    `Top: a ${NAME[round.top.species]} on ${say(round.top)}. Bottom: a ${NAME[round.bottom.species]} on ${say(round.bottom)}.`,
    `One big block is as long as ${round.ratio} small blocks.`,
    show ? 'Both rows start at the same line and are counted in small blocks.' : '',
  ].filter(Boolean).join(' ');
  return (
    <Picture w={W3} h={H3} label={label}>
      <rect x="0" y={ROW - 2} width={W3} height="4" fill={TABLE} />
      {show ? <line x1={X0} x2={X0} y1="12" y2={H3 - 12} stroke={WORKED} strokeWidth="5" /> : null}
      <CompareRow m={round.top} ratio={round.ratio} top={0} stage={stage} />
      <CompareRow m={round.bottom} ratio={round.ratio} top={ROW} stage={stage} />
      {[round.top, round.bottom].map((m, i) => (
        <text key={i} x={W3 - 14} y={i * ROW + 30} textAnchor="end" fontSize="22" fontWeight="600" fill={INK_SOFT} fontFamily={FONT}>
          {NAME[m.species]}
        </text>
      ))}
    </Picture>
  );
}

/** Level 3's key: one big block over the small blocks that make it, at the board's scale. */
function Key({ ratio }: { readonly ratio: 2 | 3 }) {
  const w = ratio * U3;
  const tx = w + 30;
  return (
    <svg viewBox={`0 0 ${tx + 200} 100`} role="img" aria-label={`One big block is as long as ${ratio} small blocks.`} style={{ display: 'block', width: '100%', maxWidth: 420, height: 'auto' }}>
      <Block x={6} y={6} w={w} h={BH3} look="teak" />
      {range(ratio).map((i) => (
        <Block key={i} x={6 + i * U3} y={56} w={U3} h={BH3} look="wood" />
      ))}
      <text x={tx} y={30} fontSize="22" fontWeight="600" fill={INK} fontFamily={FONT}>1 big block</text>
      <text x={tx} y={80} fontSize="22" fontWeight="600" fill={INK} fontFamily={FONT}>{`${ratio} small blocks`}</text>
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  // The hint's dashed row is the length he CHECKED. Help opens the hint with
  // nothing checked; then it is the length selected when Help was pressed,
  // pinned so later taps cannot walk the row onto the nose.
  const [pin, setPin] = useState<{ readonly round: Round; readonly answer: Answer } | null>(null);
  if (stage === 'hint' && pin?.round !== round) setPin({ round, answer });
  const atHelp = pin?.round === round ? pin.answer : answer;
  const tried = stage !== 'hint' ? null : checked.has(round) ? (checked.get(round) ?? null) : atHelp;
  const locked = stage === 'worked' || stage === 'solved';
  const sol = solution(round);

  const choice = (v: number | Side, body: ReactNode, aria: string) => (
    <Choice
      key={String(v)}
      selected={!locked && answer === v}
      onTap={() => setAnswer(answer === v ? null : v)}
      ariaLabel={aria}
      mark={locked && v === sol ? 'right' : null}
      disabled={locked}
    >
      {body}
    </Choice>
  );
  const dino = (m: Measured, side: Side) =>
    choice(
      side,
      <>
        <MiniDino species={m.species} />
        <span>{NAME[m.species]}</span>
      </>,
      `The ${NAME[m.species]} is longer`,
    );

  return (
    <div className="board board--measure">
      <p className="board-caption">{caption(round)}</p>
      {round.kind === 'blocks' ? (
        <BlocksScene round={round} stage={stage} tried={tried} />
      ) : round.kind === 'strip' ? (
        <StripScene round={round} stage={stage} tried={tried} />
      ) : (
        <CompareScene round={round} stage={stage} tried={tried} />
      )}
      {round.kind === 'compare' ? (
        <div className="board-row">
          <Key ratio={round.ratio} />
        </div>
      ) : null}
      <div className="choices" role="group" aria-label={round.kind === 'compare' ? 'Which is longer' : 'Length in blocks'}>
        {round.kind === 'compare'
          ? [
              dino(round.top, 'top'),
              dino(round.bottom, 'bottom'),
              choice(
                'same',
                <>
                  <SameIcon />
                  <span>Same length</span>
                </>,
                'They are the same length',
              ),
            ]
          : round.options.map((n) => choice(n, <span>{n}</span>, blocks(n)))}
      </div>
      {stage === 'worked' ? <p className="board-caption">{workedLine(round)}</p> : null}
    </div>
  );
}

export const howLongIsThatDinosaur: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'how-long-is-that-dinosaur',
  title: 'How Long Is That Dinosaur?',
  hook: 'Measure toy dinosaurs in blocks.',
  group: 'measure',
  levels: ['Count the blocks', 'Read the strip', 'Big and small blocks'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/how-long-is-that-dinosaur.png',
  note: {
    what: 'A toy dinosaur lies over a row of equal blocks, then over a strip marked 0 to 10, then two dinosaurs are measured in two sizes of block. He taps the length, or taps the longer dinosaur. Dashed lines drop from the tail tip and the nose.',
    expect:
      'Level 1 he counts blocks, and on a round with a missing block he gives the number of blocks he can see, one short. Level 2 he reads the number under the nose, which is wrong when the tail is not at 0, or counts the marks and gets one too many. Level 3 he picks the dinosaur with more blocks, though a big block is two or three small ones, or the one whose nose reaches farther right, though the two rows start in different places.',
    practising:
      'Length as a count of equal units laid end to end with no gaps; on a ruler, counting the spaces from the starting point, not the marks, so 2 to 8 is 6. At level 3, that a measurement means nothing without its unit: 4 big blocks can be longer than 6 small ones.',
    ask: 'At level 2, when the tail is not at 0, point at the 0 and ask: "Does the dinosaur start here? So where do we start counting?"',
    next: 'Lay a toy dinosaur on the floor and measure it with large building blocks, then with spoons. Ask why the two numbers differ. Then measure it with a ruler, first with its tail at 0 and then with its tail at 2.',
    honest:
      'Choosing the right number here does not show he can measure. The blocks and the strip are already laid down for him; lining up blocks with no gaps and putting the 0 at the end of a real object are the hard part, and only real objects show whether he does them.',
    easier: 'Stay on level 1 and ask him to touch each block on the screen as he counts, including the empty space.',
    harder: 'On level 2, before he taps, ask what the length would be if the tail moved to 0. On level 3, ask how many small blocks each dinosaur is.',
    safety: 'For the floor activity use large blocks; keep small blocks and loose toy parts away from the two-year-old.',
  },
};

export default howLongIsThatDinosaur;
