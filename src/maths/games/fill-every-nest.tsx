import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece } from '../../play/parts';

/**
 * Fill Every Nest — equal groups: multiplication and division.
 *
 * Concept (advisor, maths 7): a group of equal groups. The same structure is
 * met three ways, and the misconception it attacks is that multiplying,
 * sharing and grouping are three unrelated tricks:
 *  - make:  3 nests, 4 eggs in each. How the eggs stand is 3 × 4.
 *  - share: 12 eggs into 3 nests, the same in each (division as sharing:
 *           the number of groups is known, the size is not).
 *  - group: 12 eggs, 4 to a nest, as many nests as that fills (division as
 *           grouping: the size is known, the number of groups is not). More
 *           nests are on the board than he needs, so "how many nests" is his
 *           decision, not the board's.
 *
 * Levels:
 *  1. Make and share, 2-4 nests, totals to 12. Dealing one at a time works.
 *  2. Grouping arrives; totals to 20. Some make rounds open with eggs already
 *     in the nests, so each nest needs a different number to reach the same
 *     size — "the same in each" stops meaning "the same number of taps".
 *  3. An egg tray: rows instead of nests, so the finished answer is an array
 *     and its columns are equal groups too. Totals to 30; three rounds leave a
 *     remainder in the basket, and every make round starts with brown eggs
 *     (4 × 7, 5 × 6). Every row has 8 cups, so the tray never shows how many
 *     eggs a row should get.
 *
 * Control: tap-to-add/remove only. Each nest has its own "put an egg in"
 * piece (in the tray, the next empty cup of a row, marked +, so the egg lands
 * where he tapped); tapping an egg he placed takes it back out. Brown eggs
 * already in a nest are fixed. In share and group rounds the eggs come out of
 * a basket, so the basket runs out.
 *
 * Nothing he needs is only in the words. When the question gives the eggs
 * per nest (make, group), a pattern nest drawn with that many eggs sits above
 * the nests, eggs in the same two columns as a real nest (in the tray, a
 * pattern row whose eggs stand over the tray's own columns), so "is this nest
 * right?" is a side-by-side match, not a number to remember. No numbers are
 * shown while he answers; counts appear on 'hint', and the full solution
 * with its equation on 'worked'. Once a tray is finished, the same array is
 * drawn twice, boxed as rows and boxed as columns, so "4 rows of 6 is 6
 * columns of 4" is on the board, not only in a sentence. Every state is a
 * fixed drawing.
 */

export type Kind = 'make' | 'share' | 'group';
export type Layout = 'nests' | 'rows';

export interface Round {
  readonly kind: Kind;
  /** Nests (levels 1-2) or the rows of an egg tray (level 3). */
  readonly layout: Layout;
  /** How many nests or rows are on the board. */
  readonly nests: number;
  /** make and group: the eggs every filled nest must hold. share: 0. */
  readonly each: number;
  /** share and group: eggs in the basket at the start. make: 0 (no basket). */
  readonly eggs: number;
  /** Eggs already sitting in each nest when the round opens (make only). */
  readonly start: readonly number[];
}

/** How many eggs he has put into each nest (not counting the ones already there). */
export type Answer = readonly number[];

const zeros = (n: number) => Array.from({ length: n }, () => 0);
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

const make = (nests: number, each: number, start: readonly number[] = zeros(nests), layout: Layout = 'nests'): Round => ({
  kind: 'make', layout, nests, each, eggs: 0, start,
});
const share = (eggs: number, nests: number, layout: Layout = 'nests'): Round => ({
  kind: 'share', layout, nests, each: 0, eggs, start: zeros(nests),
});
/** `nests` is how many are on the board — always more than the eggs fill. */
const group = (eggs: number, each: number, nests: number, layout: Layout = 'nests'): Round => ({
  kind: 'group', layout, nests, each, eggs, start: zeros(nests),
});

/**
 * Deterministic variety without Math.random: a table per level walked by
 * index. Kinds alternate so no two neighbours ask the same question. Level 2
 * shares 15 into 3 nests, then two rounds later groups 15 into nests of 3:
 * the same eggs, the other question. Level 3 shares 23 into 4 rows and 14 into
 * 3 rows and groups 22 into rows of 5, where a remainder is part of the answer:
 * dealing every egg round and round gives 6, 6, 6, 5, so he must stop on purpose.
 * Its make rounds open with brown eggs, so no level-3 round is pure tapping.
 */
const TABLE: Record<Level, readonly Round[]> = {
  1: [
    make(3, 2), share(6, 2), make(2, 5), share(9, 3),
    make(4, 3), share(8, 4), make(3, 4), share(10, 2),
  ],
  2: [
    group(12, 4, 5), share(15, 3), make(4, 5, [2, 5, 3, 0]), group(15, 3, 6),
    share(20, 4), make(3, 6, [4, 1, 6]), group(20, 5, 6), share(18, 3),
  ],
  3: [
    make(4, 7, [3, 0, 7, 5], 'rows'), share(23, 4, 'rows'), group(24, 6, 6, 'rows'), share(14, 3, 'rows'),
    make(5, 6, [6, 2, 6, 4, 0], 'rows'), group(22, 5, 6, 'rows'), share(24, 4, 'rows'), group(30, 6, 6, 'rows'),
  ],
};

export function generate(level: Level, index: number): Round {
  const t = TABLE[level];
  // A fresh object per call: the shell resets the answer when the round's
  // identity changes, so two calls must never hand back the same reference.
  return { ...t[index % t.length] };
}

/** Eggs per filled nest, how many nests are filled, and what stays in the basket. */
export function shape(round: Round): { readonly size: number; readonly filled: number; readonly left: number } {
  if (round.kind === 'make') return { size: round.each, filled: round.nests, left: 0 };
  if (round.kind === 'share') {
    const size = Math.floor(round.eggs / round.nests);
    return { size, filled: round.nests, left: round.eggs - size * round.nests };
  }
  const filled = Math.floor(round.eggs / round.each);
  return { size: round.each, filled, left: round.eggs - filled * round.each };
}

/** The eggs he must ADD to each nest: the worked answer. */
export function solution(round: Round): Answer {
  const { size, filled } = shape(round);
  return round.start.map((s, i) => (i < filled ? size - s : 0));
}

const noun = (round: Round) => (round.layout === 'rows' ? 'row' : 'nest');
const totalsOf = (round: Round, answer: Answer) => round.start.map((s, i) => s + (answer[i] ?? 0));
const basketLeft = (round: Round, answer: Answer) => round.eggs - sum(answer);

function prompt(round: Round): string {
  const n = noun(round);
  if (round.kind === 'make') {
    return sum(round.start) > 0
      ? `Make every ${n} hold ${round.each} eggs.`
      : `Put ${round.each} eggs in each of the ${round.nests} ${n}s.`;
  }
  if (round.kind === 'share') {
    return round.layout === 'rows'
      ? `Share ${round.eggs} eggs equally into ${round.nests} rows. Leave as few as possible.`
      : `Share all ${round.eggs} eggs into the ${round.nests} nests, the same in each.`;
  }
  return `${round.eggs} eggs, ${round.each} in each ${n}. How many ${n}s can you fill?`;
}

const list = (xs: readonly (number | string)[]) =>
  xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

function basketFact(left: number): string {
  if (left === 0) return 'The basket is empty.';
  return left === 1 ? '1 egg is still in the basket.' : `${left} eggs are still in the basket.`;
}

function check(round: Round, answer: Answer): Verdict {
  const t = totalsOf(round, answer);
  const left = basketLeft(round, answer);
  const n = noun(round);
  const { size, filled } = shape(round);

  if (round.kind === 'group') {
    const full = t.filter((x) => x === size).length;
    if (t.every((x) => x === 0 || x === size) && full === filled) return { ok: true };
    const used = t.filter((x) => x > 0);
    if (used.length === 0) return { ok: false, hint: `Every ${n} is empty. ${basketFact(left)}` };
    if (used.every((x) => x === size)) {
      return { ok: false, hint: `${full} ${n}${full === 1 ? '' : 's'} of ${size}: that is ${full * size}. ${basketFact(left)}` };
    }
    return { ok: false, hint: `The ${n}s with eggs hold ${list(used)}. ${basketFact(left)}` };
  }

  if (t.every((x) => x === size)) return { ok: true };
  const same = t.every((x) => x === t[0]);
  const tail = round.kind === 'share' ? ` ${basketFact(left)}` : '';
  if (same && t[0] === 0) return { ok: false, hint: `Every ${n} is empty.${tail}` };
  if (same) return { ok: false, hint: `${round.nests} ${n}s of ${t[0]}: that is ${round.nests * t[0]}.${tail}` };
  return { ok: false, hint: `The ${n}s hold ${list(t)} eggs, not all the same.${tail}` };
}

/**
 * The mathematics in symbols, as the worked board and the explanation state it.
 * A remainder is written as groups × size + left = eggs, never "14 ÷ 3 = 4, 2
 * left over": that form makes 14 ÷ 3 and 22 ÷ 5 "both equal 4 r 2", which
 * breaks "=" as same value — the idea Make Both Sides Match teaches.
 */
function equation(round: Round): string {
  const { size, filled, left } = shape(round);
  if (round.kind === 'make') return `${round.nests} × ${size} = ${round.nests * size}`;
  if (left) return `${filled} × ${size} + ${left} = ${round.eggs}`;
  return round.kind === 'share' ? `${round.eggs} ÷ ${round.nests} = ${size}` : `${round.eggs} ÷ ${size} = ${filled}`;
}

function explain(round: Round): string {
  const n = noun(round);
  const { size, filled, left } = shape(round);
  const down = round.layout === 'rows' ? ` Read down: ${size} columns of ${filled}.` : '';
  if (round.kind === 'make') {
    const added = solution(round);
    const head = sum(round.start) > 0 ? `New eggs: ${list(added)}. ` : '';
    return `${head}${round.nests} ${n}s of ${size}: ${equation(round)}.${down}`;
  }
  const lead = round.kind === 'share'
    ? `${round.eggs} eggs into ${round.nests} ${n}s: ${size} in each`
    : `${round.eggs} eggs, ${size} to a ${n}: ${filled} ${n}s`;
  if (left) return `${lead}, ${left} left over. ${filled} × ${size} + ${left} = ${round.eggs}.${down}`;
  return `${lead}. ${equation(round)}, because ${filled} × ${size} = ${round.eggs}.${down}`;
}

/* --------------------------------------------------------------- drawing -- */

/** Most eggs one nest (or one tray row) takes, so a nest never outgrows the board. */
const NEST_MAX = 10;
const ROW_MAX = 8;
const INK = '#24170f';
const WHITE_EGG = '#fbf3e4';
const BROWN_EGG = '#c98a4e';
const EGG_PATH = 'M20 3C31 3 37 19 37 30C37 40 29 46 20 46C11 46 3 40 3 30C3 19 9 3 20 3Z';

/** One egg, upright. Brown for the eggs already in a nest, white for the ones he adds. */
function Egg({ brown = false, size = 44 }: { readonly brown?: boolean; readonly size?: number }) {
  return (
    <svg viewBox="0 0 40 48" width={size} height={size} aria-hidden="true">
      <path d={EGG_PATH} fill={brown ? BROWN_EGG : WHITE_EGG} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="14" cy="19" rx="3.5" ry="7" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

/** The basket the eggs come out of, drawn with every egg still in it (rows of ten). */
function Basket({ left, showCount }: { readonly left: number; readonly showCount: boolean }) {
  const perRow = 10;
  const rows = Math.max(1, Math.ceil(left / perRow));
  const top = 28;
  const bottom = top + rows * 44 + 20;
  const h = bottom + (showCount ? 40 : 6);
  const eggs = Array.from({ length: left }, (_, i) => ({ x: 52 + (i % perRow) * 36, y: top + 8 + Math.floor(i / perRow) * 44 }));
  const label = left === 0 ? 'The basket is empty.' : `The basket holds ${left} egg${left === 1 ? '' : 's'}.`;
  return (
    <svg className="board-svg" viewBox={`0 0 460 ${h}`} role="img" aria-label={label} style={{ maxWidth: 460, alignSelf: 'center' }}>
      <path d={`M24 ${top} H436 L414 ${bottom} H46 Z`} fill="#d9a44a" stroke={INK} strokeWidth="3" />
      {Array.from({ length: rows * 2 }, (_, i) => (
        <line key={`w${i}`} x1="50" x2="410" y1={top + 22 + i * 22} y2={top + 22 + i * 22} stroke="#a8742a" strokeWidth="3" />
      ))}
      <rect x="16" y={top - 12} width="428" height="16" rx="8" fill="#b97f2e" stroke={INK} strokeWidth="3" />
      {eggs.map((e, i) => (
        <g key={i} transform={`translate(${e.x - 16} ${e.y}) scale(0.8)`}>
          <path d={EGG_PATH} fill={WHITE_EGG} stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      {left === 0 ? (
        <text x="230" y={top + 40} textAnchor="middle" fontSize="22" fontWeight="700" fill={INK}>empty</text>
      ) : null}
      {showCount ? (
        <text x="230" y={h - 10} textAnchor="middle" fontSize="26" fontWeight="700" fill={INK}>
          {`${left} in the basket`}
        </text>
      ) : null}
    </svg>
  );
}

const nestCard: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s2)',
  width: 236, padding: 'var(--s3) var(--s3) var(--s4)',
  background: '#e8c58f', border: '4px solid #8a5a2b', borderRadius: '18px 18px 90px 90px / 18px 18px 46px 46px',
  boxShadow: 'inset 0 -10px 0 #b98545',
};
const eggArea: CSSProperties = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--s2)', minHeight: 72, width: '100%' };
const count: CSSProperties = { fontWeight: 700, fontSize: 'var(--t-lg)', color: 'var(--maths-deep)', margin: 0 };
const trayStyle: CSSProperties = {
  display: 'grid', gap: 'var(--s2)', padding: 'var(--s3)', overflowX: 'auto',
  background: '#cfc6b6', border: '4px solid #8c8270', borderRadius: 'var(--radius-sm)',
};
const cup: CSSProperties = { width: 44, height: 44, borderRadius: '50%', background: '#bdb2a0', boxShadow: 'inset 0 4px 8px rgba(36,23,15,0.25)' };
/**
 * The box a Piece takes up (tap size, padding, border) with none of its button
 * look. Drawn eggs and plain cups sit in these, so a pattern egg or an empty
 * cup stands in exactly the column a placed egg would.
 */
const cell: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
  minWidth: 'var(--tap)', minHeight: 'var(--tap)', padding: 'var(--s2)', border: 'var(--line) solid transparent',
};
const patternCard: CSSProperties = { ...nestCard, background: '#f6ead6', border: '4px dashed #8a5a2b', boxShadow: 'none' };
const patternTray: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 'var(--s2)', padding: 'var(--s3)', overflowX: 'auto',
  background: '#efe9de', border: '4px dashed #8c8270', borderRadius: 'var(--radius-sm)',
};
const patternLabel: CSSProperties = { margin: 0, fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)' };

/** What each nest shows: eggs that were already there, eggs he added, and whether he may change it. */
interface NestView {
  readonly i: number;
  readonly given: number;
  readonly added: number;
  readonly canAdd: boolean;
  readonly canRemove: boolean;
  readonly worked: boolean;
  readonly showCount: boolean;
  readonly add: () => void;
  readonly remove: () => void;
}

/** The woven rim under a nest's eggs: a few crossed twigs, fixed. */
function Twigs() {
  return (
    <svg viewBox="0 0 220 26" width="200" height="24" aria-hidden="true">
      <path d="M6 8 Q110 30 214 8" fill="none" stroke="#8a5a2b" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 18 Q110 0 206 18" fill="none" stroke="#6e4520" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 4 L70 22 M90 2 L120 24 M150 4 L186 22 M60 22 L96 4 M130 22 L170 4" stroke="#a7743d" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Nest({ v }: { readonly v: NestView }) {
  const name = `nest ${v.i + 1}`;
  return (
    <div style={nestCard} role="group" aria-label={`Nest ${v.i + 1}`}>
      <div style={eggArea}>
        {Array.from({ length: v.given }, (_, k) => (
          <Piece key={`g${k}`} tone="fixed" ariaLabel={`An egg already in ${name}`}>
            <Egg brown />
          </Piece>
        ))}
        {Array.from({ length: v.added }, (_, k) => (
          <Piece
            key={`a${k}`}
            tone={v.worked ? 'worked' : 'placed'}
            onTap={v.canRemove ? v.remove : undefined}
            ariaLabel={v.canRemove ? `Take an egg out of ${name}` : `An egg in ${name}`}
          >
            <Egg />
          </Piece>
        ))}
      </div>
      <Twigs />
      {v.showCount ? <p style={count}>{v.given + v.added}</p> : null}
      <Piece label="+" tone={v.canAdd ? 'source' : 'ghost'} onTap={v.canAdd ? v.add : undefined} ariaLabel={`Put an egg in ${name}`}>
        <Egg />
      </Piece>
    </div>
  );
}

const rowLine: CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--s2)' };
const rowCount: CSSProperties = { ...count, minWidth: '2.5ch', textAlign: 'center' };

/**
 * The size of one group, drawn: a nest with exactly `each` eggs, dashed and
 * pale so it reads as a picture and not a nest to fill, with no button. Its
 * eggs wrap in the same two columns as a real nest's, so a finished nest and
 * the pattern look alike egg for egg.
 */
function PatternNest({ each, showCount }: { readonly each: number; readonly showCount: boolean }) {
  return (
    <div style={patternCard} role="img" aria-label={`Every nest holds ${each} eggs, like this`}>
      <div style={eggArea}>
        {Array.from({ length: each }, (_, k) => (
          <span key={k} style={cell}>
            <Egg />
          </span>
        ))}
      </div>
      <Twigs />
      {showCount ? <p style={count}>{each}</p> : null}
      <p style={patternLabel}>every nest like this</p>
    </div>
  );
}

/** The size of one row, drawn over the tray: `each` eggs standing in the tray's own columns. */
function PatternRow({ each, showCount }: { readonly each: number; readonly showCount: boolean }) {
  return (
    <div style={patternTray} role="img" aria-label={`Every row holds ${each} eggs, like this`}>
      {Array.from({ length: each }, (_, k) => (
        <span key={k} style={cell}>
          <Egg />
        </span>
      ))}
      {showCount ? <span style={rowCount}>{each}</span> : null}
      <span style={patternLabel}>every row like this</span>
    </div>
  );
}

/** The next empty cup of a row, as the button: a cup with a plus in it. */
function AddCup() {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="#bdb2a0" stroke="#8c8270" strokeWidth="2" />
      <path d="M22 11V33M11 22H33" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * One row of the egg tray: ROW_MAX cups, eggs packed from the left so the
 * columns line up. Only the next empty cup is a button; the cups after it are
 * part of the drawing, so the one thing to tap is the one place an egg lands.
 */
function TrayRow({ v }: { readonly v: NestView }) {
  const name = `row ${v.i + 1}`;
  const empty = Math.max(0, ROW_MAX - v.given - v.added);
  const plain = v.canAdd ? empty - 1 : empty;
  return (
    <div style={rowLine} role="group" aria-label={`Row ${v.i + 1}`}>
      {Array.from({ length: v.given }, (_, k) => (
        <Piece key={`g${k}`} tone="fixed" ariaLabel={`An egg already in ${name}`}>
          <Egg brown />
        </Piece>
      ))}
      {Array.from({ length: v.added }, (_, k) => (
        <Piece
          key={`a${k}`}
          tone={v.worked ? 'worked' : 'placed'}
          onTap={v.canRemove ? v.remove : undefined}
          ariaLabel={v.canRemove ? `Take an egg out of ${name}` : `An egg in ${name}`}
        >
          <Egg />
        </Piece>
      ))}
      {v.canAdd ? (
        <Piece tone="source" onTap={v.add} ariaLabel={`Put an egg in ${name}`}>
          <AddCup />
        </Piece>
      ) : null}
      {Array.from({ length: plain }, (_, k) => (
        <span key={`e${k}`} style={cell} aria-hidden="true">
          <span style={cup} />
        </span>
      ))}
      {v.showCount ? <span style={rowCount}>{v.given + v.added}</span> : null}
    </div>
  );
}

const equationStyle: CSSProperties = {
  margin: 0, textAlign: 'center', fontWeight: 700, fontSize: 'var(--t-xl)', color: 'var(--maths-deep)',
};

/**
 * The finished array drawn twice, side by side: once with each row ringed,
 * once with each column ringed. The same eggs in the same places, so "4 rows
 * of 6 is 6 columns of 4" is something he can see, not a sentence.
 */
function RowsAndColumns({ rows, cols }: { readonly rows: number; readonly cols: number }) {
  const step = 26;
  const pad = 14;
  const w = cols * step + pad * 2;
  const h = rows * step + pad * 2;
  const gap = 56;
  const width = w * 2 + gap;
  const height = h + 30;
  const at = (r: number, c: number) => ({ x: pad + c * step + step / 2, y: pad + r * step + step / 2 });
  const eggs = (dx: number) =>
    Array.from({ length: rows * cols }, (_, k) => {
      const p = at(Math.floor(k / cols), k % cols);
      return <ellipse key={k} cx={dx + p.x} cy={p.y} rx="7" ry="9" fill={WHITE_EGG} stroke={INK} strokeWidth="2" />;
    });
  const ring = { fill: 'none', strokeWidth: 3 } as const;
  return (
    <svg
      className="board-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${rows} rows of ${cols} eggs are the same eggs as ${cols} columns of ${rows}`}
      style={{ maxWidth: 480, alignSelf: 'center' }}
    >
      <rect x="2" y="2" width={w - 4} height={h - 4} rx="12" fill="#efe9de" stroke="#8c8270" strokeWidth="2" />
      {Array.from({ length: rows }, (_, r) => (
        <rect key={`r${r}`} x={pad + 2} y={pad + r * step + 2} width={cols * step - 4} height={step - 4} rx="11" style={{ ...ring, stroke: 'var(--maths)' }} />
      ))}
      {eggs(0)}
      <text x={w + gap / 2} y={h / 2 + 12} textAnchor="middle" fontSize="36" fontWeight="700" fill={INK}>=</text>
      <rect x={w + gap + 2} y="2" width={w - 4} height={h - 4} rx="12" fill="#efe9de" stroke="#8c8270" strokeWidth="2" />
      {Array.from({ length: cols }, (_, c) => (
        <rect key={`c${c}`} x={w + gap + pad + c * step + 2} y={pad + 2} width={step - 4} height={rows * step - 4} rx="11" style={{ ...ring, stroke: 'var(--ones)' }} />
      ))}
      {eggs(w + gap)}
      <text x={w / 2} y={height - 6} textAnchor="middle" fontSize="16" fontWeight="600" fill={INK}>{`${rows} rows of ${cols}`}</text>
      <text x={w + gap + w / 2} y={height - 6} textAnchor="middle" fontSize="16" fontWeight="600" fill={INK}>{`${cols} columns of ${rows}`}</text>
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const worked = stage === 'worked';
  const showCount = stage !== 'answering';
  // The worked answer is drawn IN the nests: the eggs each one needed.
  const added = worked ? solution(round) : round.start.map((_, i) => answer[i] ?? 0);
  const left = round.eggs - sum(added);
  const hasBasket = round.kind !== 'make';
  const cap = round.layout === 'rows' ? ROW_MAX : NEST_MAX;

  const views: NestView[] = round.start.map((given, i) => ({
    i,
    given,
    added: added[i],
    canAdd: !locked && given + added[i] < cap && (!hasBasket || left > 0),
    canRemove: !locked && added[i] > 0,
    worked,
    showCount,
    add: () => setAnswer(added.map((x, j) => (j === i ? x + 1 : x))),
    remove: () => setAnswer(added.map((x, j) => (j === i ? x - 1 : x))),
  }));

  const given = sum(round.start) > 0;
  const n = noun(round);
  const { size, filled } = shape(round);
  // The question's group size, drawn, whenever the question gives it.
  const pattern = round.kind !== 'share';
  const finishedTray = round.layout === 'rows' && (worked || stage === 'solved');

  return (
    <div className="board">
      {hasBasket ? <Basket left={left} showCount={showCount} /> : null}
      {pattern && round.layout === 'nests' ? (
        <div className="board-row">
          <PatternNest each={round.each} showCount={showCount} />
        </div>
      ) : null}
      {pattern && round.layout === 'rows' ? <PatternRow each={round.each} showCount={showCount} /> : null}
      {round.layout === 'nests' ? (
        <div className="board-row">
          {views.map((v) => (
            <Nest key={v.i} v={v} />
          ))}
        </div>
      ) : (
        <div style={trayStyle} role="group" aria-label="Egg tray">
          {views.map((v) => (
            <TrayRow key={v.i} v={v} />
          ))}
        </div>
      )}
      {given && !worked ? <p className="board-caption">Brown eggs were already there. They stay.</p> : null}
      {round.layout === 'rows' && !locked ? <p className="board-caption">Tap + to put an egg in that row.</p> : null}
      {finishedTray && filled > 0 ? <RowsAndColumns rows={filled} cols={size} /> : null}
      {worked ? (
        <>
          <p style={equationStyle}>{equation(round)}</p>
          <p className="board-caption">
            {round.layout === 'rows'
              ? `${filled} ${n}s of ${size}. Read down: ${size} columns of ${filled}.`
              : `${filled} ${n}s of ${size} eggs.`}
          </p>
        </>
      ) : null}
    </div>
  );
}

export const fillEveryNest: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'fill-every-nest',
  title: 'Fill Every Nest',
  hook: 'Same number of eggs, every nest.',
  group: 'groups',
  levels: ['Fill and share', 'Share or group', 'The egg tray'],
  generate,
  prompt,
  emptyAnswer: (round) => zeros(round.nests),
  Board,
  check,
  explain,
  cover: 'art/games/fill-every-nest.png',
  note: {
    what: "Nests (at level 3, the rows of an egg tray) and, in most rounds, a basket of eggs. He taps the egg under a nest, or an empty cup in a tray row, to put one in, and taps an egg to take it out. Some rounds give the nests and the eggs per nest; some give the eggs and the nests; some give the eggs and the size of each nest.",
    expect: "At level 1 he will deal one egg per nest round and round, which works, or fill one nest by guessing and run short in the last. Level 2 is where it usually breaks: 'put 3 in each nest, how many nests?' gets eggs spread over every nest on the board, because sharing and grouping look the same to him until he notices which number the question gave. At level 3 he will deal all 23 eggs into 4 rows and get 6, 6, 6 and 5; leaving 3 in the basket on purpose is the new step.",
    practising: "Equal groups as one structure seen three ways: multiplication (3 nests of 4 is 3 × 4), division as sharing (12 eggs into 3 nests, how many in each) and division as grouping (12 eggs, 4 per nest, how many nests). At level 3, the array: 4 rows of 6 is also 6 columns of 4, and a remainder is what is too few to give every row one more (sharing) or to fill one more row (grouping), written 4 × 5 + 3 = 23 rather than as a division.",
    ask: "When the counts appear after a Check, point at one nest: 'How many nests, and how many in each? Can you say the whole amount without counting every egg?'",
    next: "Use a real 6-egg carton or a muffin tin and 12 dried beans. Ask him to share the beans into 3 cups, then into 4 cups, then ask how many cups of 2 he can fill. Say the matching multiplication aloud each time.",
    honest: "Filling the nests correctly does not show he can read 12 ÷ 3 or 3 × 4 on paper, or that he knows a multiplication fact without counting. Write one of the equations from the screen and ask him to make it with beans.",
    easier: "Stay on level 1 and give him real beans beside the screen, so he can deal into cups before he taps.",
    harder: "Before he taps anything, ask him to say how many will go in each nest, or how many nests he will fill, and then check it on the board.",
  },
};

export default fillEveryNest;
