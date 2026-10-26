import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece } from '../../play/parts';

/**
 * Make the Other Half — line symmetry on a square grid.
 *
 * Concept (advisor, maths game 15): reflection creates matching opposite
 * halves. Half of a butterfly, kite, diya, rangoli or temple is drawn on one
 * side of a dashed mirror line; he fills squares on the other side until the
 * picture is whole. The misconception it targets: sliding the half across
 * (a copy) instead of flipping it, so a square that touches the outer edge
 * lands next to the line. A reflection keeps every square in the same row and
 * the same distance from the line, on the opposite side.
 *
 * Levels:
 *  1. A 4 by 4 grid, the line runs down the middle, the left half is drawn.
 *  2. A 6 by 6 grid; the drawn half alternates between left and right.
 *  3. The line runs across (a temple, palace or banyan tree and its
 *     reflection in still water), or two lines cross and one quarter of a
 *     rangoli is drawn: he fills the other three quarters.
 *
 * Control: tap-to-add/remove only. Tapping an empty square on the open side
 * fills it; tapping a filled one clears it. The drawn half cannot be changed,
 * and it is drawn flat (thin pale edge, square corners, no shadow) so it reads
 * as the picture; the open squares keep the ink-bordered button look with a
 * deep press shadow, and a tap shows its tile there at once.
 * Evidence: on 'hint' the board marks every column (or row) with one dot per
 * square of distance from the line, so partners carry the same dots, and rings
 * the first pair of squares that did not match when the
 * hint stage opened. The ring is frozen there so it cannot walk him through
 * the answer square by square. After a Check miss it is the pair the hint
 * sentence names. Help can open the hint stage before any Check, and the board
 * gets no signal when a later Check misses, so the ring may then mark an older
 * pair: the sentence therefore locates its own pair by row (or column) and
 * distance, and never claims to be "the ringed pair". On 'worked' the board
 * draws the whole picture. Fixed drawings only — nothing moves.
 */

/** Which mirror lines the grid has: 'v' runs down, 'h' runs across. */
export type Lines = 'v' | 'h' | 'both';
/** Where the drawn part sits. */
export type From = 'left' | 'right' | 'top' | 'top-left';

export interface Round {
  /** What the finished picture is, for the prompt. */
  readonly name: string;
  readonly rows: number;
  readonly cols: number;
  readonly lines: Lines;
  readonly from: From;
  /** Filled squares in the drawn part, as row * cols + col, ascending. */
  readonly given: readonly number[];
  /** The colour of the filled squares. */
  readonly hue: string;
}

/** The squares he has filled on the open side, ascending. */
export type Answer = readonly number[];

type Stage = BoardProps<Round, Answer>['stage'];

/** Rangoli powder colours: warm, saturated, and each distinct from the white grid. */
const HUE = {
  marigold: '#e0700a',
  kumkum: '#c8372d',
  turmeric: '#c98f00',
  leaf: '#2e8b3e',
  indigo: '#3b3fa8',
  magenta: '#b5179e',
  peacock: '#0b7a8a',
} as const;

interface Picture {
  readonly name: string;
  /** The whole picture, '#' filled, '.' empty. Only the drawn part is used; the rest is mirrored. */
  readonly art: readonly string[];
  readonly hue: string;
}

const rev = (s: string) => [...s].reverse().join('');
/** A picture with a line across: the top rows, then the same rows upside down. */
const water = (top: readonly string[]) => [...top, ...[...top].reverse()];
/** A picture with both lines: one quarter, flipped right and then down. */
const quarters = (q: readonly string[]) => {
  const upper = q.map((s) => s + rev(s));
  return [...upper, ...[...upper].reverse()];
};

const SMALL: readonly Picture[] = [
  { name: 'butterfly', art: ['#..#', '####', '.##.', '#..#'], hue: HUE.marigold },
  { name: 'kite', art: ['.##.', '####', '.##.', '.##.'], hue: HUE.kumkum },
  { name: 'diya', art: ['.##.', '#..#', '####', '.##.'], hue: HUE.turmeric },
  { name: 'rangoli', art: ['#..#', '.##.', '.##.', '#..#'], hue: HUE.magenta },
  { name: 'lotus', art: ['#..#', '#..#', '####', '.##.'], hue: HUE.peacock },
  { name: 'temple gate', art: ['.##.', '####', '#..#', '#..#'], hue: HUE.indigo },
];

const BIG: readonly Picture[] = [
  { name: 'lotus', art: ['..##..', '.#..#.', '#.##.#', '######', '.####.', '..##..'], hue: HUE.magenta },
  { name: 'butterfly', art: ['#....#', '##..##', '######', '.####.', '##..##', '#....#'], hue: HUE.marigold },
  { name: 'rangoli', art: ['#.##.#', '.####.', '##..##', '##..##', '.####.', '#.##.#'], hue: HUE.kumkum },
  { name: 'temple gate', art: ['..##..', '.####.', '.#..#.', '######', '#.##.#', '######'], hue: HUE.indigo },
  { name: 'kite', art: ['..##..', '.####.', '######', '.####.', '..##..', '..##..'], hue: HUE.leaf },
  { name: 'diya', art: ['..##..', '..##..', '......', '######', '.####.', '..##..'], hue: HUE.turmeric },
];

/**
 * Level 3 alternates: a rangoli with two lines, then a scene over still water.
 * The water scenes are not top-bottom symmetric, so sliding the top half down
 * (a copy) and flipping it (a reflection) give different pictures.
 */
const ACROSS: readonly (Picture & { readonly lines: Lines })[] = [
  { name: 'rangoli', art: quarters(['#..', '.#.', '..#']), hue: HUE.magenta, lines: 'both' },
  { name: 'temple', art: water(['..#..', '.###.', '#####']), hue: HUE.marigold, lines: 'h' },
  { name: 'rangoli', art: quarters(['##.', '#..', '..#']), hue: HUE.kumkum, lines: 'both' },
  { name: 'palace', art: water(['#.#.#', '#####', '##.##']), hue: HUE.indigo, lines: 'h' },
  { name: 'rangoli', art: quarters(['.#.', '#.#', '.##']), hue: HUE.peacock, lines: 'both' },
  { name: 'banyan tree', art: water(['.###.', '#####', '..#..']), hue: HUE.leaf, lines: 'h' },
];

/** Is square (r, c) in the drawn part? */
export function inGiven(round: Pick<Round, 'rows' | 'cols' | 'from'>, r: number, c: number): boolean {
  const left = c < round.cols / 2;
  const top = r < round.rows / 2;
  switch (round.from) {
    case 'left':
      return left;
    case 'right':
      return !left;
    case 'top':
      return top;
    case 'top-left':
      return top && left;
  }
}

function make(pic: Picture, lines: Lines, from: From): Round {
  const rows = pic.art.length;
  const cols = pic.art[0].length;
  const given: number[] = [];
  pic.art.forEach((line, r) =>
    [...line].forEach((ch, c) => {
      if (ch === '#' && inGiven({ rows, cols, from }, r, c)) given.push(r * cols + c);
    }),
  );
  return { name: pic.name, rows, cols, lines, from, given, hue: pic.hue };
}

/** Deterministic variety without Math.random: one table per level, walked by index. */
export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) return make(SMALL[k], 'v', 'left');
  if (level === 2) return make(BIG[k], 'v', k % 2 === 0 ? 'left' : 'right');
  const pic = ACROSS[k];
  return make(pic, pic.lines, pic.lines === 'both' ? 'top-left' : 'top');
}

const hasV = (round: Round) => round.lines !== 'h';
const hasH = (round: Round) => round.lines !== 'v';

/** The squares this picture needs on the open side: every one whose fold lands on a drawn square. */
export function required(round: Round): number[] {
  const { rows, cols } = round;
  const given = new Set(round.given);
  const out: number[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (inGiven(round, r, c)) continue;
      const rr = hasH(round) ? [r, rows - 1 - r] : [r];
      const cc = hasV(round) ? [c, cols - 1 - c] : [c];
      const src = rr.flatMap((a) => cc.map((b) => [a, b] as const)).find(([a, b]) => inGiven(round, a, b));
      if (src && given.has(src[0] * cols + src[1])) out.push(r * cols + c);
    }
  }
  return out;
}

/**
 * The partner of an open square across ONE line. With both lines, a square in
 * the top half pairs across the down line (with the drawn quarter); a square in
 * the bottom half pairs across the other line (with the square above it).
 */
function partner(round: Round, r: number, c: number): { readonly r: number; readonly c: number; readonly across: 'v' | 'h' } {
  const { rows, cols, lines } = round;
  if (lines === 'v' || (lines === 'both' && r < rows / 2)) return { r, c: cols - 1 - c, across: 'v' };
  return { r: rows - 1 - r, c, across: 'h' };
}

/** Squares from the line, counting the square that touches it as 1. */
const away = (i: number, n: number) => (i < n / 2 ? n / 2 - i : i - n / 2 + 1);

export interface Mismatch {
  readonly cell: number;
  readonly other: number;
  readonly sentence: string;
}

/**
 * The first open square, in reading order, that does not match its partner.
 * Reading order matters with two lines: every top-half square is checked
 * before any bottom-half one, so a bottom square's partner above is already right.
 */
export function firstMismatch(round: Round, answer: Answer): Mismatch | null {
  const { rows, cols } = round;
  const filled = new Set([...round.given, ...answer]);
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (inGiven(round, r, c)) continue;
      const p = partner(round, r, c);
      const here = filled.has(r * cols + c);
      const there = filled.has(p.r * cols + p.c);
      if (here === there) continue;
      const v = p.across === 'v';
      const d = v ? away(c, cols) : away(r, rows);
      const line = round.lines !== 'both' ? 'the line' : v ? 'the down line' : 'the line across';
      const at = `${d} ${d === 1 ? 'square' : 'squares'} from ${line}`;
      const hereSide = v ? (c < cols / 2 ? 'left' : 'right') : r < rows / 2 ? 'top' : 'bottom';
      const thereSide = v ? (c < cols / 2 ? 'right' : 'left') : r < rows / 2 ? 'bottom' : 'top';
      const [full, empty] = here ? [hereSide, thereSide] : [thereSide, hereSide];
      const place = v ? `Row ${r + 1} from the top` : `Column ${c + 1} from the left`;
      return { cell: r * cols + c, other: p.r * cols + p.c, sentence: `${place}, ${at}: ${full} filled, ${empty} empty.` };
    }
  }
  return null;
}

function prompt(round: Round): string {
  if (round.lines === 'both') return 'Fill three quarters so the rangoli matches across both lines.';
  if (round.lines === 'h') return `Fill below the line: the ${round.name} reflected in still water.`;
  return `Finish the ${round.name}: fill its other half on the ${round.from === 'left' ? 'right' : 'left'}.`;
}

function check(round: Round, answer: Answer): Verdict {
  const miss = firstMismatch(round, answer);
  return miss ? { ok: false, hint: miss.sentence } : { ok: true };
}

function explain(round: Round): string {
  const n = round.given.length;
  if (round.lines === 'both') {
    return `Flip the quarter across the down line, then flip the top half down across the other line. The rangoli has ${4 * n} squares, ${n} in each quarter.`;
  }
  if (round.lines === 'h') {
    return `Each square above has a partner in the same column, the same distance below the line. The ${round.name} has ${2 * n} squares, ${n} above and ${n} below.`;
  }
  return `Each square has a partner in the same row, the same distance from the line on the other side. The ${round.name} has ${2 * n} squares, ${n} each side.`;
}

/** How many filled squares sit in each part of the grid: the evidence the hint points at. */
function tally(round: Round, filled: ReadonlySet<number>): string {
  const { rows, cols } = round;
  const n = (r0: number, r1: number, c0: number, c1: number) => {
    let k = 0;
    for (let r = r0; r < r1; r += 1) for (let c = c0; c < c1; c += 1) if (filled.has(r * cols + c)) k += 1;
    return k;
  };
  const hr = rows / 2;
  const hc = cols / 2;
  if (round.lines === 'v') return `Left half ${n(0, rows, 0, hc)} squares, right half ${n(0, rows, hc, cols)}.`;
  if (round.lines === 'h') return `Above the line ${n(0, hr, 0, cols)} squares, below it ${n(hr, rows, 0, cols)}.`;
  return `Top left ${n(0, hr, 0, hc)}, top right ${n(0, hr, hc, cols)}, bottom left ${n(hr, rows, 0, hc)}, bottom right ${n(hr, rows, hc, cols)}.`;
}

/** The line over the grid at every stage, sentence by sentence: which part is drawn, and how to tap. */
function setup(round: Round): string[] {
  return [
    round.lines === 'both' ? 'The top-left quarter is drawn.' : `The ${round.from} half is drawn.`,
    'Tap a square to fill it; tap again to clear it.',
  ];
}

/** What the dots drawn from 'hint' on count: one sentence per mirror line, opening the line under the grid. */
function dots(round: Round): string[] {
  return [
    ...(hasV(round) ? ['The dots count squares from the down line.'] : []),
    ...(hasH(round) ? ['The dots count squares from the line across.'] : []),
  ];
}

/**
 * Read-aloud: every hint `check` can give for this round. The hint names the
 * first open square, in reading order, that differs from its partner. Every
 * open square before it matches, which fixes its partner: a drawn square, or
 * (with two lines) a top-right square that must already be right because the
 * whole top half is checked first. So each open square gives exactly one
 * sentence, the one for the finished picture with that square alone flipped.
 */
function hints(round: Round): readonly string[] {
  const solution = required(round);
  const out = new Set<string>();
  for (let i = 0; i < round.rows * round.cols; i += 1) {
    if (inGiven(round, Math.floor(i / round.cols), i % round.cols)) continue;
    const flipped = solution.includes(i) ? solution.filter((x) => x !== i) : [...solution, i].sort((a, b) => a - b);
    const miss = firstMismatch(round, flipped);
    if (miss) out.add(miss.sentence);
  }
  return [...out];
}

/**
 * Read-aloud: the board's words in screen order. The setup line at every
 * stage; from 'hint' on, what the dots count; on 'worked' and 'solved', the
 * tally of the finished picture. On 'hint' the tally counts his own squares,
 * so it depends on his answer and is left to the screen (the hint sentence
 * names the pair to look at). A solved board always holds the finished
 * picture, since `check` accepts only the required squares, so its tally is
 * the worked one. The pips and cells carry their numbers in aria-labels only.
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  if (stage === 'answering') return setup(round);
  const lines = [...setup(round), ...dots(round)];
  return stage === 'hint' ? lines : [...lines, tally(round, new Set([...round.given, ...required(round)]))];
}

/** One filled square: a block of rangoli colour with a paper-white diamond, the same either way up. */
function Tile({ hue }: { readonly hue: string }) {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <rect x="1" y="1" width="42" height="42" rx="5" fill={hue} />
      <path d="M22 8 L36 22 L22 36 L8 22 Z" fill="#fff8ec" />
      <circle cx="22" cy="22" r="5" fill={hue} />
    </svg>
  );
}

const LINE = '14px';
const LABEL = '36px';

const gridWrap: CSSProperties = { overflowX: 'auto', display: 'flex', justifyContent: 'center', padding: 'var(--s2)' };
const pipStyle: CSSProperties = { display: 'grid', placeItems: 'center' };
const ringStyle: CSSProperties = { outline: '5px solid var(--ink)', outlineOffset: '3px', borderRadius: 'var(--radius-sm)' };
const cellWrap: CSSProperties = { display: 'grid' };
/**
 * The prompt says "reflected in still water", so below a line across the open
 * squares are drawn as water: the Piece's own background token is re-pointed
 * to a pale river blue for those cells only. Filled tiles still cover it.
 */
const waterStyle = { '--raised': '#cde6f2' } as CSSProperties;

const Blank = () => <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" />;

/**
 * The drawn half is part of the picture, not a control: flat paper squares
 * with a thin pale edge and square corners, the same size as the buttons
 * but with none of their thick ink border, rounding or press shadow.
 */
const drawnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'var(--tap)',
  minHeight: 'var(--tap)',
  padding: 'var(--s2)',
  border: 'var(--line) solid var(--rule)',
  borderRadius: '4px',
  background: 'var(--paper-2)',
};
/**
 * The squares he can tap get a deep press shadow under their ink border, so
 * the open side reads as a field of keys beside a flat drawing. Re-points the
 * Piece's own shadow token for those cells only.
 */
const keyStyle = { '--shadow-press': '0 4px 0 var(--ink-soft)' } as CSSProperties;

/**
 * Distance from the line drawn as that many dots, laid along the line's
 * normal: a column two squares from the down line gets two dots, and so does
 * its partner on the other side, so the matching pair is seen, not read.
 */
function Pips({ n, along }: { readonly n: number; readonly along: 'row' | 'column' }) {
  const len = n * 12;
  const across = along === 'row';
  return (
    <svg
      viewBox={across ? `0 0 ${len} 12` : `0 0 12 ${len}`}
      width={across ? len : 12}
      height={across ? 12 : len}
      aria-hidden="true"
    >
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={across ? i * 12 + 6 : 6} cy={across ? 6 : i * 12 + 6} r={4.5} fill="var(--ink)" />
      ))}
    </svg>
  );
}

/** Grid tracks: an optional label track, the cells, and a narrow track for each mirror line. */
function layout(round: Round) {
  const { rows, cols } = round;
  const v = hasV(round);
  const h = hasH(round);
  const hc = cols / 2;
  const hr = rows / 2;
  const colTrack = (c: number) => 1 + (h ? 1 : 0) + c + (v && c >= hc ? 1 : 0);
  const rowTrack = (r: number) => 1 + (v ? 1 : 0) + r + (h && r >= hr ? 1 : 0);
  const tracks = (n: number, split: boolean, label: boolean) => {
    const out: string[] = label ? [LABEL] : [];
    for (let i = 0; i < n; i += 1) {
      if (split && i === n / 2) out.push(LINE);
      out.push('auto');
    }
    return out.join(' ');
  };
  return {
    v,
    h,
    colTrack,
    rowTrack,
    columns: tracks(cols, v, h),
    rowsTemplate: tracks(rows, h, v),
  };
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const { rows, cols } = round;
  const locked = stage === 'solved' || stage === 'worked';
  const worked = stage === 'worked';
  const evidence = stage !== 'answering';

  // The ring marks the first unmatched pair as it stood when the hint stage
  // opened; it does not jump to the next pair while he edits, so it cannot walk
  // him through the answer. Once he makes that pair match, the ring goes, so a
  // ring always sits on a pair that differs. Adjusted during render, the same
  // way the shell resets an answer, so it never draws a stale frame.
  const [frozen, setFrozen] = useState<{ readonly round: Round; readonly miss: Mismatch | null } | null>(null);
  if (stage === 'hint' && (!frozen || frozen.round !== round)) setFrozen({ round, miss: firstMismatch(round, answer) });
  if (stage !== 'hint' && frozen) setFrozen(null);

  const solution = new Set(required(round));
  const mine = new Set(answer);
  const given = new Set(round.given);
  const filledNow = new Set([...round.given, ...answer]);
  const held = stage === 'hint' && frozen ? frozen.miss : null;
  const ring = held && filledNow.has(held.cell) !== filledNow.has(held.other) ? held : null;
  const pond = round.lines === 'h';
  const shown = new Set([...round.given, ...(worked ? solution : mine)]);
  const { v, h, colTrack, rowTrack, columns, rowsTemplate } = layout(round);

  const toggle = (i: number) =>
    setAnswer(mine.has(i) ? answer.filter((x) => x !== i) : [...answer, i].sort((a, b) => a - b));

  const cell = (r: number, c: number): ReactNode => {
    const i = r * cols + c;
    const where = `Row ${r + 1}, column ${c + 1}`;
    const ringed = ring !== null && (ring.cell === i || ring.other === i);
    let piece: ReactNode;
    const drawn = inGiven(round, r, c);
    if (drawn) {
      const on = given.has(i);
      piece = (
        <span style={drawnStyle} role="img" aria-label={`${where}: drawn, ${on ? 'filled' : 'empty'}`}>
          {on ? <Tile hue={round.hue} /> : <Blank />}
        </span>
      );
    } else if (worked) {
      const on = solution.has(i);
      piece = (
        <Piece tone={on ? 'worked' : 'placed'} ariaLabel={`${where}: ${on ? 'filled in the finished picture' : 'empty in the finished picture'}`}>
          {on ? <Tile hue={round.hue} /> : <Blank />}
        </Piece>
      );
    } else {
      const on = mine.has(i);
      piece = (
        <Piece
          tone="placed"
          onTap={locked ? undefined : () => toggle(i)}
          ariaLabel={`${where}: ${on ? 'filled' : 'empty'}${locked ? '' : on ? ', tap to clear' : ', tap to fill'}`}
        >
          {on ? <Tile hue={round.hue} /> : <Blank />}
        </Piece>
      );
    }
    const below = pond && !drawn;
    const tappable = !drawn && !locked;
    return (
      <div
        key={i}
        style={{
          ...cellWrap,
          ...(below ? waterStyle : null),
          ...(tappable ? keyStyle : null),
          gridRow: rowTrack(r),
          gridColumn: colTrack(c),
          ...(ringed ? ringStyle : null),
        }}
      >
        {piece}
      </div>
    );
  };

  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) cells.push(cell(r, c));

  // The mirror lines: thick dashes in their own narrow track, so no square sits under them.
  const lastRow = rowTrack(rows - 1) + 1;
  const lastCol = colTrack(cols - 1) + 1;
  const mirrors: ReactNode[] = [];
  if (v) {
    mirrors.push(
      <div
        key="v"
        aria-hidden="true"
        style={{ gridColumn: colTrack(cols / 2) - 1, gridRow: `${rowTrack(0)} / ${lastRow}`, justifySelf: 'center', width: 0, borderLeft: '6px dashed var(--ink)' }}
      />,
    );
  }
  if (h) {
    mirrors.push(
      <div
        key="h"
        aria-hidden="true"
        style={{ gridRow: rowTrack(rows / 2) - 1, gridColumn: `${colTrack(0)} / ${lastCol}`, alignSelf: 'center', height: 0, borderTop: '6px dashed var(--ink)' }}
      />,
    );
  }

  // On 'hint' and 'worked': every column (or row) marked with one dot per
  // square between it and the line, so partners carry the same row of dots.
  const labels: ReactNode[] = [];
  if (evidence && v) {
    for (let c = 0; c < cols; c += 1) {
      const d = away(c, cols);
      labels.push(
        <span key={`c${c}`} role="img" aria-label={`${d} from the down line`} style={{ ...pipStyle, gridRow: 1, gridColumn: colTrack(c) }}>
          <Pips n={d} along="row" />
        </span>,
      );
    }
  }
  if (evidence && h) {
    for (let r = 0; r < rows; r += 1) {
      const d = away(r, rows);
      labels.push(
        <span key={`r${r}`} role="img" aria-label={`${d} from the line across`} style={{ ...pipStyle, gridColumn: 1, gridRow: rowTrack(r) }}>
          <Pips n={d} along="column" />
        </span>,
      );
    }
  }

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: columns,
    gridTemplateRows: rowsTemplate,
    gap: 'var(--s1)',
    padding: 'var(--s3)',
    background: 'var(--raised)',
    border: '2px solid var(--rule)',
    borderRadius: 'var(--radius-sm)',
  };

  const lineWord = round.lines === 'both' ? 'two dashed lines are mirrors' : 'dashed line is a mirror';
  const label = `${round.name}, ${rows} rows by ${cols} columns. The ${lineWord}.`;

  return (
    <div className="board">
      <p className="board-caption">{setup(round).join(' ')}</p>
      <div style={gridWrap}>
        <div style={gridStyle} role="group" aria-label={label}>
          {labels}
          {mirrors}
          {cells}
        </div>
      </div>
      {evidence ? <p className="board-caption">{[...dots(round), tally(round, shown)].join(' ')}</p> : null}
    </div>
  );
}

export const makeTheOtherHalf: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'make-the-other-half',
  title: 'Make the Other Half',
  hook: 'Flip the half across the line.',
  group: 'shapes',
  levels: ['Line down the middle', 'Bigger grid, either side', 'Water and two lines'],
  generate,
  prompt,
  emptyAnswer: () => [],
  Board,
  board,
  check,
  hints,
  explain,
  cover: 'art/games/make-the-other-half.png',
  note: {
    what: 'A square grid with a dashed mirror line. Half of a butterfly, kite, diya, lotus, temple or rangoli is drawn on one side; he taps squares on the other side to fill them until the picture is whole. Tapping a filled square clears it.',
    expect: 'At level 1 he will usually match each row by eye. At level 2 the common slip is copying instead of flipping: the half is slid across, so a square at the outer edge lands next to the line. After a miss the board marks every column (or, with a line across, every row) with one dot per square of distance from the line, and rings the first pair that differs. At level 3 the line runs across. With two lines, the bottom-right quarter is the likeliest slip: its partner is a square he filled himself, not a drawn one.',
    practising: 'Line symmetry as reflection: every square has a partner in the same row (or column), the same distance from the line, on the opposite side. Measuring distance from the line rather than from the edge of the grid. At level 3, two reflections one after the other.',
    ask: 'At level 2, after he fills three or four squares, point at one and ask: "How many squares from the line is this one? Where is its partner?"',
    next: 'Draw a chalk line on the floor and set out half a rangoli with a few flowers, rice or dal on one side. He completes the other half, then you hold a small mirror on the line so he can check it against the reflection.',
    honest: 'Finishing these grids shows he can reflect squares across a straight line on a grid. It does not show he can find the line of symmetry in a leaf or a letter, or reflect a slanted line or a curve. Ask him where the mirror line goes on the letter A, then on the letter N.',
    easier: 'Stay on level 1 and have him say the distance aloud for each square: "one from the line here, so one from the line there."',
    harder: 'Before he taps anything at level 2, ask how many squares the finished picture will have. At level 3, ask which bottom-right squares he needs if he looks only at the top-right quarter.',
    safety: 'For the floor activity use a steel or acrylic mirror, not glass, and keep dry rice and dal away from his sister, who is young enough to put them in her mouth.',
  },
};

export default makeTheOtherHalf;
