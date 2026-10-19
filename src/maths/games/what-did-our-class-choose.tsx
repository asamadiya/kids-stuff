import { Fragment } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece } from '../../play/parts';

/**
 * What Did Our Class Choose? — pictographs show counts by category.
 *
 * Concept (advisor, maths 18): a picture chart is a count you can see. Each
 * fruit gets a row, every picture sits in the same-sized cell from the same
 * starting edge, so the longest row is the most-chosen fruit without
 * counting, and "how many more" is the run of pictures one row has past
 * another. The misconceptions it attacks: that a clue such as "2 more than
 * mango" means "2", and — at level 3 — that a picture is always one of
 * something.
 *
 * Levels:
 *  1. Tally to pictures: three fruits, tally marks to 7 (one five-gate), each
 *     picture is one vote. Reading the gate is the slip that shows here:
 *     skipping its slanted stroke (4), or calling the gate five and counting
 *     the slash again (6). One round reads instead: "Banana got
 *     2 more votes than mango".
 *  2. More and fewer: four fruits. Build rounds alternate with read rounds — a
 *     finished class chart with one row empty and a clue: "2 more votes than
 *     mango", "3 fewer than the most-chosen fruit", "3 more than the
 *     least-chosen". The clue's number is a difference, not the answer.
 *  3. Each picture is 2 votes: the same two jobs with a key of 2. Every tally
 *     is even, so a row is the tally halved; "4 more votes" is two more
 *     pictures. A row holds only 8 pictures, so one picture per vote cannot
 *     fit a 10-, 12- or 14-vote tally — the reason a key exists.
 *
 * Control: tap-to-add/remove only. At the end of each open row sit two
 * pieces: tap the fruit to add one picture to that row, or the minus to take
 * the last one off. Nothing is counted for him until Check or Help: then the
 * vote counts appear beside every tally and at the end of every row, at level
 * 3 each picture carries its "2", and a gold dashed line runs down the chart
 * where the row the clue is measured from ends. The worked answer draws the
 * missing pictures and shades the difference. Every state is a fixed drawing.
 */

export type Fruit = 'mango' | 'banana' | 'guava' | 'grapes' | 'apple';

/** What the missing row is measured against. */
export type Ref = { readonly to: 'fruit'; readonly index: number } | { readonly to: 'most' | 'fewest' };

export interface Clue {
  readonly ref: Ref;
  /** Votes more (positive) or fewer (negative) than the reference row. */
  readonly by: number;
}

interface RoundBase {
  /** Children each picture stands for. */
  readonly key: 1 | 2;
  readonly fruits: readonly Fruit[];
  /** Votes (children) per fruit: what the finished chart must show. */
  readonly votes: readonly number[];
  /** Picture spaces in each row of the chart: room for the likely overshoot to show. */
  readonly cells: number;
}

/** Turn the tally into a chart: every row is his. */
export interface BuildRound extends RoundBase {
  readonly mode: 'build';
}

/** The chart is drawn except one row, which a clue pins down. */
export interface ReadRound extends RoundBase {
  readonly mode: 'read';
  readonly open: number;
  readonly clue: Clue;
}

export type Round = BuildRound | ReadRound;

/** Pictures he has put in each row, in chart order. */
export type Answer = readonly number[];

const NAME: Record<Fruit, string> = {
  mango: 'Mango',
  banana: 'Banana',
  guava: 'Guava',
  grapes: 'Grapes',
  apple: 'Apple',
};
const lower = (f: Fruit) => NAME[f].toLowerCase();

/** The row a read round's clue is measured from. */
export function refIndex(round: ReadRound): number {
  const { ref } = round.clue;
  if (ref.to === 'fruit') return ref.index;
  let best = -1;
  round.votes.forEach((v, i) => {
    if (i === round.open) return;
    if (best < 0) best = i;
    else if (ref.to === 'most' ? v > round.votes[best] : v < round.votes[best]) best = i;
  });
  return best;
}

const build = (key: 1 | 2, cells: number, pairs: ReadonlyArray<readonly [Fruit, number]>): BuildRound => ({
  mode: 'build',
  key,
  cells,
  fruits: pairs.map((p) => p[0]),
  votes: pairs.map((p) => p[1]),
});

/**
 * The open row's vote is derived from the clue, never typed, so the clue
 * and the chart cannot disagree. Pass 0 for it in `pairs`.
 */
const read = (
  key: 1 | 2,
  cells: number,
  pairs: ReadonlyArray<readonly [Fruit, number]>,
  open: number,
  ref: Ref,
  by: number,
): ReadRound => {
  const base: ReadRound = { mode: 'read', key, cells, fruits: pairs.map((p) => p[0]), votes: pairs.map((p) => p[1]), open, clue: { ref, by } };
  const from = base.votes[refIndex(base)];
  return { ...base, votes: base.votes.map((v, i) => (i === open ? from + by : v)) };
};

const col = (index: number): Ref => ({ to: 'fruit', index });
const MOST: Ref = { to: 'most' };
const FEWEST: Ref = { to: 'fewest' };

/**
 * Deterministic variety without Math.random: a table per level walked by
 * index. Every chart has one clear most and one clear fewest, so "most" and
 * "least" always name one fruit. Level 2 and 3 alternate building and
 * reading; a read round's open row is filled in from its clue by `read`.
 */
const TABLE: Record<Level, readonly Round[]> = {
  1: [
    build(1, 8, [['mango', 4], ['banana', 2], ['guava', 5]]),
    build(1, 8, [['banana', 6], ['apple', 3], ['mango', 1]]),
    build(1, 8, [['guava', 3], ['grapes', 7], ['mango', 5]]),
    read(1, 8, [['apple', 5], ['mango', 2], ['banana', 0]], 2, col(1), 2),
    build(1, 8, [['grapes', 2], ['guava', 4], ['apple', 7]]),
    build(1, 8, [['mango', 7], ['grapes', 4], ['banana', 3]]),
    build(1, 8, [['banana', 5], ['guava', 1], ['apple', 6]]),
  ],
  2: [
    read(1, 10, [['mango', 4], ['banana', 7], ['guava', 0], ['grapes', 3]], 2, col(0), 2),
    build(1, 10, [['banana', 8], ['apple', 5], ['guava', 3], ['mango', 6]]),
    read(1, 10, [['grapes', 9], ['mango', 5], ['apple', 4], ['banana', 0]], 3, MOST, -3),
    build(1, 10, [['guava', 7], ['grapes', 2], ['mango', 9], ['apple', 4]]),
    read(1, 10, [['apple', 6], ['banana', 2], ['mango', 4], ['guava', 0]], 3, FEWEST, 3),
    read(1, 10, [['mango', 3], ['guava', 8], ['grapes', 0], ['banana', 6]], 2, col(1), -4),
    build(1, 10, [['apple', 9], ['mango', 6], ['banana', 4], ['grapes', 7]]),
  ],
  3: [
    build(2, 8, [['mango', 8], ['banana', 4], ['guava', 10], ['apple', 6]]),
    read(2, 8, [['mango', 6], ['banana', 12], ['guava', 0], ['grapes', 4]], 2, col(0), 4),
    build(2, 8, [['grapes', 12], ['mango', 6], ['banana', 8], ['apple', 2]]),
    read(2, 8, [['apple', 14], ['guava', 10], ['mango', 0], ['banana', 6]], 2, MOST, -6),
    build(2, 8, [['banana', 6], ['guava', 14], ['mango', 4], ['grapes', 10]]),
    read(2, 8, [['mango', 4], ['grapes', 12], ['apple', 8], ['guava', 0]], 3, FEWEST, 6),
    read(2, 8, [['banana', 12], ['apple', 4], ['mango', 0], ['guava', 10]], 2, col(3), -4),
  ],
};

export function generate(level: Level, index: number): Round {
  const t = TABLE[level];
  // A fresh object per call: the shell resets the answer when the round's
  // identity changes, so two calls must never hand back the same reference.
  return { ...t[index % t.length] };
}

/** Pictures each row of the finished chart holds. */
export const target = (round: Round): readonly number[] => round.votes.map((v) => v / round.key);

/** The rows he builds: all of them from a tally, the one with the clue otherwise. */
export const isOpen = (round: Round, i: number): boolean => round.mode === 'build' || round.open === i;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const pics = (n: number) => plural(n, 'picture', 'pictures');
const votesOf = (n: number) => plural(n, 'vote', 'votes');

/** Index of the row with the most (or fewest) votes, among all rows. */
function extreme(votes: readonly number[], most: boolean): number {
  return votes.reduce((best, v, i) => ((most ? v > votes[best] : v < votes[best]) ? i : best), 0);
}

function refText(round: ReadRound): string {
  const { ref } = round.clue;
  if (ref.to === 'fruit') return lower(round.fruits[ref.index]);
  return ref.to === 'most' ? 'the most-chosen fruit' : 'the least-chosen fruit';
}

function prompt(round: Round): string {
  if (round.mode === 'build') {
    return round.key === 1
      ? 'Make the picture chart match the tally.'
      : 'Each picture is 2 votes. Make the chart match the tally.';
  }
  const { by } = round.clue;
  const n = Math.abs(by);
  return `${NAME[round.fruits[round.open]]} got ${n} ${by > 0 ? 'more' : 'fewer'} ${n === 1 ? 'vote' : 'votes'} than ${refText(round)}. Build its row.`;
}

function check(round: Round, answer: Answer): Verdict {
  const want = target(round);
  const got = (i: number) => answer[i] ?? 0;
  if (round.mode === 'build') {
    const i = want.findIndex((w, j) => got(j) !== w);
    if (i < 0) return { ok: true };
    const f = NAME[round.fruits[i]];
    const tally = votesOf(round.votes[i]);
    return round.key === 1
      ? { ok: false, hint: `${f}: the tally shows ${tally}, the chart shows ${pics(got(i))}.` }
      : { ok: false, hint: `${f}: the tally shows ${tally}; ${pics(got(i))} of 2 is ${votesOf(got(i) * 2)}.` };
  }
  const { open } = round;
  if (got(open) === want[open]) return { ok: true };
  const r = refIndex(round);
  const v = round.votes[r];
  // "Of the other fruits": his row can overshoot the most or undershoot the
  // fewest (an empty row always does), and the sentence must stay true of
  // the board he is looking at.
  const fact =
    round.clue.ref.to === 'fruit'
      ? `${NAME[round.fruits[r]]} has ${votesOf(v)}.`
      : `Of the other fruits, ${lower(round.fruits[r])} has the ${round.clue.ref.to === 'most' ? 'most' : 'fewest'} votes: ${v}.`;
  const name = lower(round.fruits[open]);
  return round.key === 1
    ? { ok: false, hint: `${fact} The ${name} row shows ${votesOf(got(open))}.` }
    : { ok: false, hint: `${fact} The ${name} row has ${pics(got(open))}: ${votesOf(got(open) * 2)}.` };
}

function explain(round: Round): string {
  if (round.mode === 'build') {
    const hi = extreme(round.votes, true);
    const lo = extreme(round.votes, false);
    const order = `${NAME[round.fruits[hi]]} got the most votes, ${lower(round.fruits[lo])} the fewest.`;
    if (round.key === 2) return `Each picture is 2 votes, so ${round.votes[hi]} votes is ${pics(round.votes[hi] / 2)}. ${order}`;
    const list = round.fruits.map((f, i) => `${lower(f)} ${round.votes[i]}`).join(', ');
    return `${list.charAt(0).toUpperCase()}${list.slice(1)}. ${order}`;
  }
  const r = refIndex(round);
  const v = round.votes[r];
  const { by } = round.clue;
  const t = round.votes[round.open];
  const from =
    round.clue.ref.to === 'fruit'
      ? `${NAME[round.fruits[r]]} has`
      : `The ${round.clue.ref.to === 'most' ? 'most' : 'least'}-chosen fruit, ${lower(round.fruits[r])}, has`;
  const sum = `${v} ${by > 0 ? '+' : '−'} ${Math.abs(by)} = ${t}`;
  const open = NAME[round.fruits[round.open]];
  return round.key === 1
    ? `${from} ${votesOf(v)}, and ${sum}. ${open} has ${votesOf(t)}: ${pics(t)}.`
    : `${from} ${votesOf(v)}, and ${sum}. ${open} has ${votesOf(t)}: ${pics(t / 2)} of 2.`;
}

/* ------------------------------------------------------------- drawing --- */

/**
 * The chart is a grid of [drawing | pieces] rows. Each drawing is its own SVG
 * with the same viewBox and the same CSS box, so every row is drawn at the
 * same scale from the same left edge: cells line up down the chart by
 * construction, and the gold reference line lands at one x in every row.
 */
const ROW_H = 76;
const HEAD_H = 30;
/** One picture cell; the fruit is a 40-unit box inside it. */
const CELL = 46;
const LABEL_W = 150;
const TALLY_W = 170;
const COUNT_W = 70;
/** Tally strokes: spacing inside a five-gate, and gate to gate. */
const STROKE = 8;
const GATE = 40;

const gridX = (round: Round) => LABEL_W + (round.mode === 'build' ? TALLY_W : 0) + 6;
const rowW = (round: Round) => gridX(round) + round.cells * CELL + COUNT_W;

const INK = '#24170f';
const RULE = '#e8d9c2';
const DEEP = '#0f4790';
const GOLD = '#f2a900';
const GOLD_TINT = '#fff1c9';
const LEAF = '#3f8f3a';
const STALK = '#5b3a1a';

/** Each fruit drawn in a 40 × 40 box. Fruit only: the class voted on fruit. */
const SHAPES: Record<Fruit, ReactElement> = {
  mango: (
    <>
      <path d="M22 9 C33 9 37 20 34 28 C31 36 21 38 13 35 C6 32 4 24 8 17 C11 12 15 9 22 9Z" fill="#f5a623" stroke={INK} strokeWidth="2" />
      <path d="M28 14 C32 18 33 23 31 28" fill="none" stroke="#e2571e" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      <path d="M22 9 C22 7 23 5 25 4" fill="none" stroke={STALK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 7 C28 2 35 2 37 5 C33 9 28 9 24 7Z" fill={LEAF} stroke={INK} strokeWidth="1.3" />
    </>
  ),
  banana: (
    <>
      <path d="M8 9 C7 25 17 34 33 32 C36 31.5 36 28.5 33 28.5 C21 29 13 21 13 9 Z" fill="#f7d23e" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 14 C18 21 23 26 30 27" fill="none" stroke="#d9a800" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 9 L7 4 L12 4 L13 9 Z" fill="#6b4a1f" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
    </>
  ),
  guava: (
    <>
      <circle cx="20" cy="22" r="14" fill="#9ccb4a" stroke={INK} strokeWidth="2" />
      <circle cx="14" cy="19" r="1.5" fill="#5f8f22" />
      <circle cx="25" cy="28" r="1.5" fill="#5f8f22" />
      <circle cx="26" cy="17" r="1.3" fill="#5f8f22" />
      <circle cx="16" cy="29" r="1.2" fill="#5f8f22" />
      <path d="M20 8 C20 6 21 4 22 3" fill="none" stroke={STALK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 6 C25 2 31 2 33 5 C29 8 25 8 21 6Z" fill={LEAF} stroke={INK} strokeWidth="1.3" />
    </>
  ),
  grapes: (
    <>
      <path d="M21 3 L21 10" stroke={STALK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 7 C26 3 32 3 34 6 C30 9 26 9 22 7Z" fill={LEAF} stroke={INK} strokeWidth="1.3" />
      {[
        [14, 13], [21, 12], [28, 13],
        [10, 20], [17, 20], [24, 20], [31, 20],
        [14, 27], [21, 27], [28, 27],
        [18, 34], [25, 34],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.4" fill="#7b3fa0" stroke={INK} strokeWidth="1.3" />
      ))}
    </>
  ),
  apple: (
    <>
      <path d="M20 12 C14 7 5 10 6 21 C7 31 13 37 20 35 C27 37 33 31 34 21 C35 10 26 7 20 12Z" fill="#d7263d" stroke={INK} strokeWidth="2" />
      <path d="M12 17 C11 20 11 23 12 25" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M20 12 C20 8 21 5 23 3" fill="none" stroke={STALK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 8 C25 4 31 4 33 7 C30 10 25 10 22 8Z" fill={LEAF} stroke={INK} strokeWidth="1.3" />
    </>
  ),
};

/** A fruit as a standalone 40 × 40 icon (labels, the key, the add buttons). */
function FruitIcon({ fruit }: { readonly fruit: Fruit }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
      {SHAPES[fruit]}
    </svg>
  );
}

/** A tally: strokes in fives, the fifth slanted across the four. */
function Tally({ x, n }: { readonly x: number; readonly n: number }) {
  const gates = Math.floor(n / 5);
  const y1 = 20;
  const y2 = ROW_H - 20;
  const strokes: ReactElement[] = [];
  for (let g = 0; g < gates; g += 1) {
    const x0 = x + g * GATE;
    for (let k = 0; k < 4; k += 1) strokes.push(<line key={`g${g}${k}`} x1={x0 + k * STROKE} x2={x0 + k * STROKE} y1={y1} y2={y2} />);
    strokes.push(<line key={`g${g}x`} x1={x0 - 6} y1={y2 - 5} x2={x0 + 3 * STROKE + 6} y2={y1 + 5} />);
  }
  for (let k = 0; k < n % 5; k += 1) {
    const xk = x + gates * GATE + k * STROKE;
    strokes.push(<line key={`r${k}`} x1={xk} x2={xk} y1={y1} y2={y2} />);
  }
  return (
    <g stroke={INK} strokeWidth="3.5" strokeLinecap="round">
      {strokes}
    </g>
  );
}

/** One picture in its cell; at level 3, once counted, it carries its "2". */
function Pic({ x, y, fruit, two, faded }: { readonly x: number; readonly y: number; readonly fruit: Fruit; readonly two: boolean; readonly faded: boolean }) {
  return (
    <g opacity={faded ? 0.3 : 1}>
      <svg x={x + 3} y={y + 3} width="40" height="40" viewBox="0 0 40 40">
        {SHAPES[fruit]}
      </svg>
      {two ? (
        <g>
          <circle cx={x + CELL - 9} cy={y + CELL - 9} r="10" fill={DEEP} stroke="#ffffff" strokeWidth="2" />
          <text x={x + CELL - 9} y={y + CELL - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#ffffff">
            2
          </text>
        </g>
      ) : null}
    </g>
  );
}

const svgStyle: CSSProperties = { display: 'block', width: '100%', height: 'auto', fontFamily: 'var(--font-display)' };

const chartStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  columnGap: 'var(--s3)',
  alignItems: 'center',
  padding: 'var(--s2) var(--s3)',
  background: '#ffffff',
  border: '3px solid #24170f',
  borderRadius: 'var(--radius-sm)',
};

const piecesStyle: CSSProperties = { display: 'flex', gap: 'var(--s2)', alignItems: 'center', padding: '4px 0' };

const keyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  gap: 'var(--s2)',
  margin: 0,
  padding: 'var(--s1) var(--s3)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--t-md)',
};

/**
 * The key, drawn: one picture = that many tally strokes. A level-3 read
 * prompt never mentions the 2, so a child who cannot read the key's words
 * must still be able to see that one picture stands for two votes. At key 2
 * the key is boxed in gold because it changes every row's value.
 */
function Key({ round }: { readonly round: Round }) {
  const w = 8 + round.key * STROKE;
  return (
    <p
      style={{ ...keyStyle, ...(round.key === 2 ? { background: GOLD_TINT, border: `3px solid ${GOLD}` } : null) }}
      role="img"
      aria-label={`Key: one picture is ${round.key === 1 ? '1 vote' : '2 votes'}.`}
    >
      <span aria-hidden="true">Key:</span>
      <FruitIcon fruit={round.fruits[0]} />
      <span aria-hidden="true">=</span>
      <svg viewBox={`0 0 ${w} 40`} width={w} height="40" aria-hidden="true">
        <g stroke={INK} strokeWidth="3.5" strokeLinecap="round">
          {Array.from({ length: round.key }, (_, k) => (
            <line key={k} x1={8 + k * STROKE} x2={8 + k * STROKE} y1="6" y2="34" />
          ))}
        </g>
      </svg>
      <span aria-hidden="true">{round.key === 1 ? '1 vote' : '2 votes'}</span>
    </p>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const want = target(round);
  const counted = stage !== 'answering';
  const worked = stage === 'worked';
  const locked = stage === 'worked' || stage === 'solved';
  const gx = gridX(round);
  const width = rowW(round);
  const ref = round.mode === 'read' ? refIndex(round) : -1;
  const refX = ref >= 0 && counted ? gx + want[ref] * CELL : null;
  const placed = (i: number) => (isOpen(round, i) ? answer[i] ?? 0 : want[i]);
  const set = (i: number, n: number) => setAnswer(round.fruits.map((_, j) => (j === i ? n : answer[j] ?? 0)));
  const cellY = (ROW_H - CELL) / 2;

  const row = (fruit: Fruit, i: number) => {
    const open = isOpen(round, i);
    const mine = placed(i);
    // Worked: the solution's pictures, plus any extras he put, faded.
    const drawn = worked && open ? Math.max(mine, want[i]) : mine;
    const votes = (worked && open ? want[i] : mine) * round.key;
    // Hint: box a build row whose pictures disagree with its tally. Both
    // numbers are on the board by then, so the box restates them. A read row
    // is never boxed: the box would go out the moment his row came right,
    // and tapping until it vanished would find the answer without the clue.
    const off = stage === 'hint' && round.mode === 'build' && mine !== want[i];
    // Worked read round: shade the difference the clue named.
    const lo = worked && open && ref >= 0 ? Math.min(want[ref], want[i]) : 0;
    const hi = worked && open && ref >= 0 ? Math.max(want[ref], want[i]) : 0;
    return (
      <svg
        viewBox={`0 0 ${width} ${ROW_H}`}
        style={svgStyle}
        role="img"
        aria-label={`${NAME[fruit]}: ${round.mode === 'build' ? `tally of ${round.votes[i]}, ` : ''}${pics(mine)}.`}
      >
        {open ? <rect x={gx} y="2" width={round.cells * CELL} height={ROW_H - 4} fill="#eef5ff" /> : null}
        {Array.from({ length: hi - lo }, (_, k) => (
          <rect key={`d${k}`} x={gx + (lo + k) * CELL} y={cellY - 4} width={CELL} height={CELL + 8} fill={GOLD_TINT} />
        ))}
        {off ? <rect x="3" y="5" width={LABEL_W - 8} height={ROW_H - 10} rx="10" fill="none" stroke={GOLD} strokeWidth="4" /> : null}
        <svg x="8" y={(ROW_H - 40) / 2} width="40" height="40" viewBox="0 0 40 40">
          {SHAPES[fruit]}
        </svg>
        <text x="56" y={ROW_H / 2 + 7} fontSize="21" fontWeight="700" fill={INK}>
          {NAME[fruit]}
        </text>
        {round.mode === 'build' ? <Tally x={LABEL_W + 18} n={round.votes[i]} /> : null}
        {round.mode === 'build' && counted ? (
          <text x={LABEL_W + TALLY_W - 6} y={ROW_H / 2 + 8} textAnchor="end" fontSize="22" fontWeight="700" fill={DEEP}>
            {round.votes[i]}
          </text>
        ) : null}
        {Array.from({ length: round.cells }, (_, c) => (
          <rect
            key={`c${c}`}
            x={gx + c * CELL + 2}
            y={cellY + 2}
            width={CELL - 4}
            height={CELL - 4}
            rx="6"
            fill="none"
            stroke={worked && open && c >= mine && c < want[i] ? DEEP : RULE}
            strokeWidth={worked && open && c >= mine && c < want[i] ? 2.5 : 1.5}
            strokeDasharray="5 4"
          />
        ))}
        {Array.from({ length: Math.min(drawn, round.cells) }, (_, c) => (
          <Pic key={`p${c}`} x={gx + c * CELL} y={cellY} fruit={fruit} two={round.key === 2 && counted} faded={worked && c >= want[i]} />
        ))}
        <line x1={gx - 3} x2={gx - 3} y1="0" y2={ROW_H} stroke={INK} strokeWidth="4" />
        {counted ? (
          <text x={gx + round.cells * CELL + 12} y={ROW_H / 2 + 8} fontSize="24" fontWeight="700" fill={DEEP}>
            {votes}
          </text>
        ) : null}
        {refX !== null ? <line x1={refX} x2={refX} y1="0" y2={ROW_H} stroke={GOLD} strokeWidth="4" strokeDasharray="8 6" /> : null}
      </svg>
    );
  };

  const pieces = (fruit: Fruit, i: number) => {
    if (!isOpen(round, i)) return <span style={piecesStyle} aria-hidden="true" />;
    const mine = answer[i] ?? 0;
    const full = mine >= round.cells;
    return (
      <span style={piecesStyle}>
        <Piece
          tone={full ? 'ghost' : 'source'}
          onTap={locked || full ? undefined : () => set(i, mine + 1)}
          ariaLabel={`Add a picture to ${lower(fruit)}`}
        >
          <FruitIcon fruit={fruit} />
        </Piece>
        <Piece
          label="−"
          tone={mine === 0 ? 'ghost' : 'placed'}
          onTap={locked || mine === 0 ? undefined : () => set(i, mine - 1)}
          ariaLabel={`Take a picture off ${lower(fruit)}`}
        />
      </span>
    );
  };

  return (
    <div className="board">
      <Key round={round} />
      <div style={chartStyle} role="group" aria-label="Our class's favourite fruit">
        <svg viewBox={`0 0 ${width} ${HEAD_H}`} style={svgStyle} aria-hidden="true">
          <text x="8" y="22" fontSize="17" fontWeight="600" fill="#5a4636">
            Fruit
          </text>
          {round.mode === 'build' ? (
            <text x={LABEL_W + 18} y="22" fontSize="17" fontWeight="600" fill="#5a4636">
              Tally
            </text>
          ) : null}
          <text x={gx + 4} y="22" fontSize="17" fontWeight="600" fill="#5a4636">
            Picture chart
          </text>
          {counted ? (
            <text x={gx + round.cells * CELL + 12} y="22" fontSize="17" fontWeight="600" fill="#5a4636">
              Votes
            </text>
          ) : null}
        </svg>
        <span />
        {round.fruits.map((f, i) => (
          <Fragment key={f}>
            {row(f, i)}
            {pieces(f, i)}
          </Fragment>
        ))}
      </div>
      {worked ? <p className="board-caption">{explain(round)}</p> : null}
    </div>
  );
}

export const whatDidOurClassChoose: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'what-did-our-class-choose',
  title: 'What Did Our Class Choose?',
  hook: 'Turn class votes into pictures.',
  group: 'rules',
  levels: ['Tally to pictures', 'More and fewer', 'Each picture is 2'],
  generate,
  prompt,
  emptyAnswer: (round) => round.fruits.map(() => 0),
  Board,
  check,
  explain,
  cover: 'art/games/what-did-our-class-choose.png',
  note: {
    what: "A class voted for its favourite fruit. He turns each tally into a row of fruit pictures by tapping the fruit at the end of its row, and later finds a missing row from a clue such as '2 more votes than mango'.",
    expect: "At level 1 he will count each tally stroke and tap that many times. The slips to watch are at the five-gate: skipping the slanted stroke (4 for 5), or saying 'five' for the gate and then counting the slash again (6). At level 2 the usual first answer to '2 more votes than mango' is 2 pictures — the clue's number taken as the answer. At level 3 he will put one picture per vote until the row runs out of room.",
    practising: "Reading and making a pictograph: one row per category on a shared scale, so length shows quantity; comparing two rows to find how many more or fewer; and, at level 3, a key where one picture stands for 2.",
    ask: "When the chart is finished, before you press Next: 'Which fruit did the most children choose? How do you know without counting?'",
    next: "Ask the family at dinner to choose between roti and rice, and make the chart together with one spoon per vote laid in rows on the table. Then do it again with one spoon standing for 2 people.",
    honest: "Building these charts does not show he can read a bar chart with a numbered scale, or choose a fair question to ask a group. It shows he can match pictures to counts and compare rows that start from the same edge.",
    easier: "Stay on level 1 and have him touch each tally stroke as he taps its fruit, saying the count aloud, before he checks.",
    harder: "On level 3, ask how many children voted altogether, and what the chart would look like if each picture stood for 5.",
  },
};

export default whatDidOurClassChoose;
