import type { ComponentType, CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame } from '../../play/types';
import { Piece, Tray } from '../../play/parts';

/**
 * Ten Loose, One Bundle — place value and unitising.
 *
 * Concept (advisor, maths 4): ten ones are ONE ten. The misconception it
 * attacks is "a group counts only as one object" and "the 1 in 14 means one".
 * The mat has a column per place, laid out left to right in the order the
 * numeral is written (flats | bundles | loose), so the picture and the digits
 * line up once the hint or worked answer colours them.
 *
 * Three kinds of round, mixed at every level:
 *  - build:  an empty mat and a number. He builds it with a bundle for every
 *            ten (and at level 3 a flat for every hundred).
 *  - tie:    the mat starts with too many loose sticks (or bundles). He swaps
 *            ten of them for one bigger piece; the amount must not change.
 *  - untie:  "and back again". The mat starts with the usual pieces; he must
 *            show the same number with fewer bundles (or flats) — 34 as 2
 *            bundles and 14 loose — which is the regrouping subtraction needs.
 *
 * Levels: 1 is 11-19, 2 is 20-99, 3 is up to 999 with flats of a hundred
 * (ten bundles tied flat).
 *
 * Control: tap-to-add/remove only. Tapping a tray piece puts one on the mat;
 * tapping a mat piece takes it off. Swapping is exactly that: ten taps off,
 * one tap on. No running total is shown until after Check.
 */

type Place = 'hundreds' | 'tens' | 'ones';

/** What is on the mat, by place. */
export interface Mat {
  readonly hundreds: number;
  readonly tens: number;
  readonly ones: number;
}

export interface Round {
  readonly kind: 'build' | 'tie' | 'untie';
  /** The number the finished mat must make. */
  readonly target: number;
  /** The mat as the round opens: empty for build, a pile for tie and untie. */
  readonly start: Mat;
  /** Untie rounds only: the flats and bundles the answer must use. */
  readonly want?: { readonly hundreds: number; readonly tens: number };
  /** Level 3: flats of a hundred are on the tray and the mat. */
  readonly flats: boolean;
}

/** The mat he has made. */
export type Answer = Mat;

const PLACES: readonly Place[] = ['hundreds', 'tens', 'ones'];
const UNIT: Record<Place, number> = { hundreds: 100, tens: 10, ones: 1 };

const mat = (hundreds: number, tens: number, ones: number): Mat => ({ hundreds, tens, ones });
const EMPTY = mat(0, 0, 0);
export const value = (m: Mat) => m.hundreds * 100 + m.tens * 10 + m.ones;
/** The usual way to write n: no place holds ten or more. */
export const canonical = (n: number): Mat => mat(Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10);

const build = (n: number, flats = false): Round => ({ kind: 'build', target: n, start: EMPTY, flats });
const tie = (start: Mat, flats = false): Round => ({ kind: 'tie', target: value(start), start, flats });
const untie = (n: number, hundreds: number, tens: number, flats = false): Round => ({
  kind: 'untie',
  target: n,
  start: canonical(n),
  want: { hundreds, tens },
  flats,
});

/**
 * Deterministic variety without Math.random: a table per level walked by
 * index. Every level mixes the three kinds; level 2 sets 34 beside 43 and
 * 70 (no loose), level 3 sets 306 (no bundles), 304 as 2 flats, 9 bundles and
 * 14 loose (untying across the empty tens place, the regrouping 304 - 6
 * needs) and 204 (a swap that cascades: ten loose make a tenth bundle, which
 * makes a flat). Indexes 0-4 at level 3 hold only two plain builds.
 */
const TABLE: Record<Level, readonly Round[]> = {
  1: [
    build(14), tie(mat(0, 0, 13)), build(17), untie(15, 0, 0),
    tie(mat(0, 0, 18)), build(11), tie(mat(0, 0, 16)), build(19),
  ],
  2: [
    build(43), tie(mat(0, 3, 16)), build(70), untie(34, 0, 2),
    build(58), tie(mat(0, 5, 12)), untie(81, 0, 7), build(96),
  ],
  3: [
    build(243, true), tie(mat(1, 12, 5), true), untie(152, 0, 15, true), build(306, true),
    untie(304, 2, 9, true), tie(mat(1, 9, 14), true), untie(318, 2, 11, true), build(815, true),
  ],
};

export function generate(level: Level, index: number): Round {
  const t = TABLE[level];
  // A fresh object per call: the shell resets the answer when the round's
  // identity changes, so two calls must never hand back the same reference.
  return { ...t[index % t.length] };
}

/** The mat the round asks for. */
export function solution(round: Round): Mat {
  if (round.kind !== 'untie' || !round.want) return canonical(round.target);
  const { hundreds, tens } = round.want;
  return mat(hundreds, tens, round.target - hundreds * 100 - tens * 10);
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function list(parts: readonly string[]): string {
  if (parts.length <= 1) return parts.join('');
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** The mat in the board's own words: "1 bundle and 14 loose sticks". */
function sticks(m: Mat): string {
  const p: string[] = [];
  if (m.hundreds) p.push(plural(m.hundreds, 'flat', 'flats'));
  if (m.tens) p.push(plural(m.tens, 'bundle', 'bundles'));
  if (m.ones) p.push(plural(m.ones, 'loose stick', 'loose sticks'));
  return list(p);
}

/** The values the pieces stand for, added: "100 + 140 + 3". Zero places dropped. */
function worth(m: Mat): string {
  const p = PLACES.filter((k) => m[k] > 0).map((k) => String(m[k] * UNIT[k]));
  return p.length ? p.join(' + ') : '0';
}

/** "1 flat makes", "1 bundle and 3 loose make". */
const makes = (m: Mat) => (m.hundreds + m.tens + m.ones === 1 ? 'makes' : 'make');

const same = (a: Mat, b: Mat) => a.hundreds === b.hundreds && a.tens === b.tens && a.ones === b.ones;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** What an untie round asks for: "2 bundles", "no flats and 15 bundles". */
function askFor(round: Round): string {
  const w = solution(round);
  const tens = w.tens ? plural(w.tens, 'bundle', 'bundles') : 'no bundles';
  if (!round.flats) return tens;
  return `${w.hundreds ? plural(w.hundreds, 'flat', 'flats') : 'no flats'} and ${tens}`;
}

/** Tie rounds: the swaps that turn the starting pile into the usual mat. */
function tyings(start: Mat): string[] {
  const k1 = Math.floor(start.ones / 10);
  const k2 = Math.floor((start.tens + k1) / 10);
  const out: string[] = [];
  if (k1) out.push(`${k1 * 10} loose sticks tied into ${plural(k1, 'bundle', 'bundles')}`);
  if (k2) out.push(`${k2 * 10} bundles tied into ${plural(k2, 'flat', 'flats')}`);
  return out;
}

/** Untie rounds: what was untied to reach the asked-for mat. */
function untyings(round: Round): string[] {
  const c = canonical(round.target);
  const w = solution(round);
  const flats = c.hundreds - w.hundreds;
  const bundles = c.tens + flats * 10 - w.tens;
  const out: string[] = [];
  if (flats) out.push(`${plural(flats, 'flat', 'flats')} untied into ${flats * 10} bundles`);
  if (bundles) out.push(`${plural(bundles, 'bundle', 'bundles')} untied into ${bundles * 10} loose sticks`);
  return out;
}

function prompt(round: Round): string {
  const n = round.target;
  if (round.kind === 'build') {
    return round.flats ? `Make ${n}. Flats for hundreds, bundles for tens.` : `Make ${n}. A bundle for every ten.`;
  }
  if (round.kind === 'tie') {
    return round.flats ? 'Swap every ten for the next bigger piece.' : 'Swap every ten loose sticks for one bundle.';
  }
  return `Show ${n} with ${askFor(round)}.`;
}

/** A tie round's hint opens with the amount it started from: the one sentence of it that names no piece of his. */
const began = (n: number) => `The mat began with ${n}.`;

function check(round: Round, answer: Answer) {
  const want = solution(round);
  if (same(answer, want)) return { ok: true };
  const v = value(answer);
  const n = round.target;
  if (v === 0) {
    return { ok: false, hint: round.kind === 'build' ? 'The mat is empty, so it shows 0.' : `The mat is empty now. It began with ${n}.` };
  }
  const shown = cap(sticks(answer));
  if (v !== n) {
    return {
      ok: false,
      hint: round.kind === 'tie' ? `${began(n)} ${shown} ${makes(answer)} ${v}.` : `${shown} ${makes(answer)} ${v}, not ${n}.`,
    };
  }
  if (round.kind === 'untie') {
    return { ok: false, hint: `${shown} ${makes(answer)} ${n}. The task asks for ${askFor(round)}.` };
  }
  // The amount is right and the round wants the usual mat, so some place
  // still holds ten or more: that is the bundle (or flat) still untied.
  return {
    ok: false,
    hint: answer.ones >= 10
      ? `That makes ${n}. ${answer.ones === 10 ? 'Those' : 'Ten of the'} ${answer.ones} loose sticks can be one bundle.`
      : `That makes ${n}. ${answer.tens === 10 ? 'Those' : 'Ten of the'} ${answer.tens} bundles can be one flat.`,
  };
}

/** At this many in one place the tray piece greys out: room for 243 as 24 bundles. */
const MAX_PER_PLACE = 30;

/**
 * Every mat the board can hold that makes `n`: no place above MAX_PER_PLACE
 * (the tray stops there, and every starting pile is under it), and no flats
 * below level 3, where the mat has no flats column.
 */
function matsMaking(round: Round, n: number): Mat[] {
  const out: Mat[] = [];
  for (let h = 0; h <= (round.flats ? MAX_PER_PLACE : 0); h++) {
    for (let t = 0; t <= MAX_PER_PLACE; t++) {
      const o = n - h * 100 - t * 10;
      if (o >= 0 && o <= MAX_PER_PLACE) out.push(mat(h, t, o));
    }
  }
  return out;
}

/**
 * Read-aloud: every hint sentence check() can give on this round. The empty
 * mat's hint, and every hint for a mat that makes the target (the usual-mat
 * rounds' "That makes 14. Ten of the 14 loose sticks can be one bundle." and
 * the untie rounds' "3 bundles and 4 loose sticks make 34. The task asks for
 * 2 bundles."), are listed whole: the board holds finitely many such mats.
 * A mat that makes some other amount gets "<its pieces> make <v>, not <n>."
 * (or, on a tie round, "The mat began with <n>. <its pieces> make <v>."): its
 * pieces and v range over every mat he can build, so only the tie round's
 * fixed first sentence is listed; the board's count under each column carries
 * the rest.
 */
function hints(round: Round): readonly string[] {
  const out = new Set<string>();
  for (const m of [EMPTY, ...matsMaking(round, round.target)]) {
    const v = check(round, m);
    if (!v.ok && v.hint) out.add(v.hint);
  }
  if (round.kind === 'tie') out.add(began(round.target));
  return [...out];
}

function explain(round: Round): string {
  const n = round.target;
  const c = canonical(n);
  if (round.kind === 'build') {
    // Name the tens digit: "the 1 in 14 means one ten" is the misconception.
    const s = String(n);
    const d = String(c.tens);
    const which = s.indexOf(d) === s.lastIndexOf(d) ? d : s.length === 3 ? `middle ${d}` : `first ${d}`;
    const sum = worth(c).includes('+') ? `: ${worth(c)}` : '';
    const tens = c.tens ? plural(c.tens, 'ten', 'tens') : 'no tens';
    return `${n} is ${sticks(c)}${sum}. The ${which} in ${n} means ${tens}.`;
  }
  if (round.kind === 'tie') {
    return `${cap(tyings(round.start).join('; '))}. ${n} is ${worth(c)}: nothing added, nothing lost.`;
  }
  const w = solution(round);
  return `${n} is ${sticks(c)}, or ${sticks(w)}: ${worth(c)} = ${worth(w)}.`;
}

/* ------------------------------------------------------------- pictures -- */

/**
 * Each piece's drawing, 44 units tall and `w` wide, in currentColor. The tray,
 * the mat and the pictures (the swap strip, the hint, the untie goal) all draw
 * from here, so a bundle in the picture is the bundle he taps.
 */
const SHAPE: Record<Place, { readonly w: number; readonly el: JSX.Element }> = {
  // One loose stick.
  ones: { w: 44, el: <rect x="18" y="3" width="8" height="38" rx="4" fill="currentColor" /> },
  // Ten sticks tied with a band: count them, and it is still ten.
  tens: {
    w: 60,
    el: (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={1 + i * 6} y="3" width="4" height="38" rx="2" fill="currentColor" />
        ))}
        <rect x="0.75" y="18" width="58.5" height="8" rx="2" fill="#f2a900" stroke="#24170f" strokeWidth="1.5" />
      </>
    ),
  },
  // Ten bundles laid side by side and tied flat: a hundred sticks.
  hundreds: {
    w: 96,
    el: (
      <>
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <rect x={3 + i * 9.1} y="3" width="7.6" height="38" rx="1.5" fill="currentColor" />
            <rect x={3 + i * 9.1} y="19.5" width="7.6" height="5" fill="#f2a900" />
          </g>
        ))}
        <rect x="1" y="8" width="94" height="4" rx="2" fill="#24170f" />
        <rect x="1" y="32" width="94" height="4" rx="2" fill="#24170f" />
      </>
    ),
  },
};

const art = (k: Place) =>
  function Art() {
    const { w, el } = SHAPE[k];
    return (
      <svg viewBox={`0 0 ${w} 44`} style={{ width: w, height: 44 }} aria-hidden="true">
        {el}
      </svg>
    );
  };
const StickArt = art('ones');
const BundleArt = art('tens');
const FlatArt = art('hundreds');

/** On every tray piece: tapping it adds one of these to the mat. */
function PlusArt() {
  return (
    <svg viewBox="0 0 20 20" style={{ width: 20, height: 20 }} aria-hidden="true">
      <rect x="7.5" y="1" width="5" height="18" rx="2" fill="currentColor" />
      <rect x="1" y="7.5" width="18" height="5" rx="2" fill="currentColor" />
    </svg>
  );
}

/**
 * A piece as a flat picture: its place-coloured tile with no border and no
 * press shadow, so a picture never looks like a button. 52 units tall.
 */
const tileW = (k: Place) => SHAPE[k].w + 8;
function tile(k: Place, x: number, key?: number) {
  return (
    <g key={key} transform={`translate(${x} 0)`}>
      <rect width={tileW(k)} height="52" rx="8" style={{ fill: HUE[k] }} />
      <g transform="translate(4 4)" style={{ color: 'var(--paper)' }}>
        {SHAPE[k].el}
      </g>
    </g>
  );
}

/** One flat tile on its own, `h` px tall. */
function Mini({ k, h = 28 }: { readonly k: Place; readonly h?: number }) {
  const w = tileW(k);
  return (
    <svg viewBox={`0 0 ${w} 52`} style={{ width: (w * h) / 52, height: h, flex: 'none' }} aria-hidden="true">
      {tile(k, 0)}
    </svg>
  );
}

/** Ten tiles in two fives, the way the mat lays them out. Returns the drawing and its width. */
function tenTiles(k: Place, x0: number): readonly [JSX.Element[], number] {
  const step = tileW(k) + 6;
  const at = (i: number) => x0 + i * step + (i >= 5 ? 14 : 0);
  return [Array.from({ length: 10 }, (_, i) => tile(k, at(i), i)), at(9) + tileW(k) - x0];
}

/** An equals sign drawn, not typed: two bars, 30 wide, in a 52-high row. */
function equals(x: number) {
  return (
    <g fill="#24170f">
      <rect x={x} y="16" width="30" height="7" rx="3" />
      <rect x={x} y="29" width="30" height="7" rx="3" />
    </g>
  );
}

/** One place up and one place down. */
const UP: Partial<Record<Place, Place>> = { ones: 'tens', tens: 'hundreds' };
const DOWN: Partial<Record<Place, Place>> = { hundreds: 'tens', tens: 'ones' };
const NAMES: Record<Place, readonly [string, string]> = {
  ones: ['loose stick', 'loose sticks'],
  tens: ['bundle', 'bundles'],
  hundreds: ['flat', 'flats'],
};

/** Under a swap picture: "10 loose sticks = 1 bundle". */
const swapLine = (from: Place) => `10 ${NAMES[from][1]} = 1 ${NAMES[UP[from] as Place][0]}`;

/** The swap pictures under the tray, in screen order: loose to bundle, and at level 3 bundle to flat. */
const swapsOf = (round: Round): readonly Place[] => (round.flats ? ['ones', 'tens'] : ['ones']);

/**
 * Permanently on the board: ten separate pieces, equals, the same ten tied
 * into one bigger piece. The fact the game teaches, shown rather than said.
 */
function Swap({ from }: { readonly from: Place }) {
  const to = UP[from] as Place;
  const [ten, w] = tenTiles(from, 0);
  const W = w + 16 + 30 + 16 + tileW(to);
  const say = swapLine(from);
  return (
    <figure style={KEY_ITEM}>
      <svg viewBox={`0 0 ${W} 52`} style={{ width: W * 0.7, height: 'auto', aspectRatio: `${W} / 52`, maxWidth: '100%' }} role="img" aria-label={say}>
        {ten}
        {equals(w + 16)}
        {tile(to, w + 62)}
      </svg>
      <figcaption style={SMALL}>{say}</figcaption>
    </figure>
  );
}

/** The hint ring's tag, under the ringed pieces: "= one bigger piece" or "= ten smaller" (two rows of five), drawn. */
function RingTag({ place, size, text }: { readonly place: Place; readonly size: number; readonly text: string }) {
  const into = (size === 10 ? UP[place] : DOWN[place]) as Place;
  const step = tileW(into) + 6;
  const n = size === 10 ? 1 : 10;
  const rows = n === 1 ? 1 : 2;
  const W = 46 + Math.min(n, 5) * step - 6;
  const H = rows * 58 - 6;
  return (
    <span style={RING_TAG}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W * 0.42, height: 'auto', aspectRatio: `${W} / ${H}`, maxWidth: '100%' }} aria-hidden="true">
        <g transform={`translate(0 ${(H - 52) / 2})`}>{equals(4)}</g>
        {Array.from({ length: n }, (_, i) => (
          <g key={i} transform={`translate(0 ${Math.floor(i / 5) * 58})`}>
            {tile(into, 46 + (i % 5) * step)}
          </g>
        ))}
      </svg>
      <span style={SMALL}>{text}</span>
    </span>
  );
}

/** An untie column's goal, as its words read: "use 2 bundles", "use no flats". */
const goalLine = (place: Place, n: number) => `use ${n ? plural(n, NAMES[place][0], NAMES[place][1]) : `no ${NAMES[place][1]}`}`;

/**
 * Untie rounds: how many of this piece the answer must use, as that many
 * outlined pieces at the top of the column, so the count he is matching sits
 * beside the pieces he is changing. None wanted is one outline, struck out.
 */
function Goal({ place, n }: { readonly place: Place; readonly n: number }) {
  const w = tileW(place);
  const ghost = (i: number, struck = false) => (
    <svg key={i} viewBox={`0 0 ${w} 52`} style={{ width: (w * 26) / 52, height: 26 }} aria-hidden="true">
      <rect x="2" y="2" width={w - 4} height="48" rx="7" strokeWidth="4" strokeDasharray="7 5" style={{ fill: 'var(--raised)', stroke: HUE[place] }} />
      <g transform="translate(4 4)" style={{ color: HUE[place] }} opacity="0.4">
        {SHAPE[place].el}
      </g>
      {struck ? <line x1="4" y1="48" x2={w - 4} y2="4" stroke="#24170f" strokeWidth="6" strokeLinecap="round" /> : null}
    </svg>
  );
  const say = goalLine(place, n);
  return (
    <div style={GOAL} role="img" aria-label={cap(say)}>
      {n ? fives(n, (i) => ghost(i)) : ghost(0, true)}
      <span style={SMALL}>{say}</span>
    </div>
  );
}

const COLUMN: Record<Place, { readonly name: string; readonly one: string; readonly art: ComponentType }> = {
  hundreds: { name: 'Flats', one: 'flat', art: FlatArt },
  tens: { name: 'Bundles', one: 'bundle', art: BundleArt },
  ones: { name: 'Loose sticks', one: 'loose stick', art: StickArt },
};

/* --------------------------------------------------------------- styles -- */

const MAT: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--s3)',
  alignItems: 'stretch',
};
/** Loose sticks pile up highest, so their column gets the most room. */
const GROW: Record<Place, CSSProperties> = {
  hundreds: { flex: '1 1 200px' },
  tens: { flex: '1 1 220px' },
  ones: { flex: '1.6 1 300px' },
};
const COL: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--s2)',
  padding: 'var(--s3)',
  minHeight: 180,
  background: 'var(--raised)',
  border: '2px solid var(--rule-strong)',
  borderRadius: 'var(--radius-sm)',
};
const COL_HEAD: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 'var(--s2)',
  fontWeight: 700,
  fontSize: 'var(--t-sm)',
  paddingBottom: 'var(--s2)',
  borderBottom: '4px solid currentColor',
};
const COL_BODY: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--s2)',
  alignContent: 'flex-start',
  flex: 1,
};
/** The ring the hint draws round ten pieces that could be one bigger piece. */
const RING: CSSProperties = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: 'var(--s2)',
  padding: 'var(--s2)',
  border: '4px dashed #f2a900',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--gold-tint)',
};
const RING_TAG: CSSProperties = {
  flexBasis: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 'var(--s1)',
  color: 'var(--ink)',
};
/** Secondary words under or beside a picture: small, never the only carrier. */
const SMALL: CSSProperties = {
  fontFamily: 'var(--font-read)',
  fontSize: 'var(--t-xs)',
  fontWeight: 400,
  color: 'var(--ink-soft)',
};
/** Untie rounds: the outlined pieces the answer must use, at the top of a column. */
const GOAL: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--s1)',
  padding: 'var(--s2)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--paper-2)',
};
/** The permanent swap pictures above the mat. */
const KEY: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 'var(--s3) var(--s6)',
};
const KEY_ITEM: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--s1)',
  maxWidth: '100%',
};
const COUNT: CSSProperties = {
  textAlign: 'center',
  fontSize: 'var(--t-xl)',
  fontWeight: 700,
  lineHeight: 1.1,
};
const COUNT_SUB: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-read)',
  fontSize: 'var(--t-sm)',
  fontWeight: 400,
  color: 'var(--ink-soft)',
};
const TOTAL: CSSProperties = {
  textAlign: 'center',
  fontSize: 'var(--t-xl)',
  fontWeight: 700,
};

/* ---------------------------------------------------------------- board -- */

const HUE: Record<Place, string> = { hundreds: 'var(--hundreds)', tens: 'var(--tens)', ones: 'var(--ones)' };

/** Pieces in fives, so a column of 14 reads as five, five and four. */
function fives(n: number, draw: (i: number) => JSX.Element) {
  const groups: JSX.Element[] = [];
  for (let start = 0; start < n; start += 5) {
    groups.push(
      <span key={start} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 'var(--s1)', marginRight: 'var(--s2)' }}>
        {Array.from({ length: Math.min(5, n - start) }, (_, j) => draw(start + j))}
      </span>,
    );
  }
  return groups;
}

/** The number, each digit in the colour of the place it stands for. */
function Numeral({ n, label }: { readonly n: number; readonly label: string }) {
  const s = String(n);
  // Place by position from the right; a fourth digit (an over-full mat) is ink.
  const hue = (i: number) => {
    const k = ['ones', 'tens', 'hundreds'][s.length - 1 - i] as Place | undefined;
    return k ? HUE[k] : 'var(--ink)';
  };
  return (
    <p style={TOTAL} aria-label={`${label} ${n}`}>
      <span style={{ fontFamily: 'var(--font-read)', fontSize: 'var(--t-md)', fontWeight: 400, marginRight: 'var(--s2)' }}>{label}</span>
      {s.split('').map((d, i) => (
        <span key={i} style={{ color: hue(i) }}>{d}</span>
      ))}
    </p>
  );
}

/**
 * Which pieces the hint rings, and what the ring says. Usual-mat rounds ring
 * ten of a place that holds ten or more; untie rounds ring the one bigger piece
 * that has to come apart.
 */
function ringFor(round: Round, m: Mat): { readonly place: Place; readonly size: number; readonly tag: string } | null {
  if (round.kind === 'untie') {
    const w = solution(round);
    if (m.hundreds > w.hundreds) return { place: 'hundreds', size: 1, tag: '1 flat = 10 bundles' };
    if (m.hundreds < w.hundreds && m.tens >= 10) return { place: 'tens', size: 10, tag: '10 bundles = 1 flat' };
    if (m.tens > w.tens) return { place: 'tens', size: 1, tag: '1 bundle = 10 loose' };
    if (m.tens < w.tens && m.ones >= 10) return { place: 'ones', size: 10, tag: '10 loose = 1 bundle' };
    return null;
  }
  if (m.ones >= 10) return { place: 'ones', size: 10, tag: '10 loose = 1 bundle' };
  // Levels 1-2 have no flats on the tray, so ten bundles there are simply too many.
  if (round.flats && m.tens >= 10) return { place: 'tens', size: 10, tag: '10 bundles = 1 flat' };
  return null;
}

/** The mat's columns, left to right: flats only at level 3. */
const placesOf = (round: Round): readonly Place[] => (round.flats ? PLACES : PLACES.slice(1));

/** Untie rounds: how many of this piece the answer must use (the flats and bundles columns only). */
const goalOf = (round: Round, k: Place): number | null => (round.kind === 'untie' && k !== 'ones' ? solution(round)[k] : null);

/** The tray's label: the one instruction on the board. */
const TRAY = 'Tap to put on the mat';

/**
 * The caption under the worked mat, sentence by sentence: the tyings or
 * untyings that got there, then the finished mat and what it adds up to.
 * "1 bundle untied into 10 loose sticks." "2 bundles and 14 loose sticks make 20 + 14 = 34."
 */
function workedLines(round: Round): string[] {
  const w = solution(round);
  const steps = round.kind === 'tie' ? tyings(round.start) : round.kind === 'untie' ? untyings(round) : [];
  const sum = worth(w).includes('+') ? `${worth(w)} = ` : '';
  return [...(steps.length ? [`${cap(steps.join('; '))}.`] : []), `${cap(sticks(w))} ${makes(w)} ${sum}${round.target}.`];
}

/**
 * Read-aloud: the board's words in screen order. The untie goals at the top
 * of the flats and bundles columns ("use no flats", "use 15 bundles"); the
 * worked caption at 'worked'; the tray's instruction while the tray takes
 * taps (not at 'worked' or 'solved', where it is greyed out); the swap
 * pictures' captions under the tray. Left out: the column names and their
 * "10 sticks" tags (each sits beside its piece's picture), the counts and the
 * total after Check, "none yet" and the hint ring's tag ("10 loose = 1 bundle"),
 * which depend on the mat he made.
 */
function board(round: Round, _level: Level, stage: BoardProps<Round, Answer>['stage']): readonly string[] {
  const locked = stage === 'worked' || stage === 'solved';
  const goals = placesOf(round).flatMap((k) => {
    const n = goalOf(round, k);
    return n === null ? [] : [goalLine(k, n)];
  });
  return [
    ...goals,
    ...(stage === 'worked' ? workedLines(round) : []),
    ...(locked ? [] : [TRAY]),
    ...swapsOf(round).map(swapLine),
  ];
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const worked = stage === 'worked';
  const locked = stage === 'solved' || worked;
  const shown = worked ? solution(round) : answer;
  const facts = stage !== 'answering';
  const ring = stage === 'hint' ? ringFor(round, shown) : null;
  const places = placesOf(round);

  const put = (k: Place, d: number) => setAnswer({ ...answer, [k]: Math.max(0, answer[k] + d) });

  const column = (k: Place) => {
    const { name, one, art: Art } = COLUMN[k];
    const n = shown[k];
    const many = name.toLowerCase();
    const piece = (i: number) => (
      <Piece
        key={i}
        tone={worked ? 'worked' : 'placed'}
        hue={k}
        wide={k === 'hundreds'}
        onTap={locked ? undefined : () => put(k, -1)}
        ariaLabel={locked ? `A ${one}` : `Take off a ${one}`}
      >
        <Art />
      </Piece>
    );
    const ringed = ring && ring.place === k ? Math.min(ring.size, n) : 0;
    const goal = goalOf(round, k);
    return (
      <section key={k} style={{ ...COL, ...GROW[k] }} aria-label={`${name}: ${n}`}>
        <h3 style={{ ...COL_HEAD, color: HUE[k] }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)' }}>
            <Mini k={k} />
            {name}
          </span>
          <span style={{ fontFamily: 'var(--font-read)', fontWeight: 400, color: 'var(--ink-soft)' }}>
            {k === 'ones' ? 'one stick' : k === 'tens' ? '10 sticks' : '100 sticks'}
          </span>
        </h3>
        {goal === null ? null : <Goal place={k} n={goal} />}
        <div style={COL_BODY}>
          {ringed && ring ? (
            <span style={RING}>
              {fives(ringed, piece)}
              <RingTag place={k} size={ring.size} text={ring.tag} />
            </span>
          ) : null}
          {fives(n - ringed, (i) => piece(ringed + i))}
          {n === 0 && !facts ? <span className="board-caption">none yet</span> : null}
        </div>
        {facts ? (
          <p style={{ ...COUNT, color: HUE[k] }}>
            {n}
            <span style={COUNT_SUB}>
              {n === 1 ? one : many} = {n * UNIT[k]}
            </span>
          </p>
        ) : null}
      </section>
    );
  };

  return (
    <div className="board board--bundles">
      <div style={MAT} role="group" aria-label="The mat">
        {places.map(column)}
      </div>

      {facts ? <Numeral n={value(shown)} label={worked ? 'The mat shows' : 'The mat makes'} /> : null}
      {worked ? <p className="board-caption">{workedLines(round).join(' ')}</p> : null}

      <Tray label={TRAY}>
        {places.map((k) => {
          const { one, art: Art } = COLUMN[k];
          const full = answer[k] >= MAX_PER_PLACE;
          return (
            <Piece
              key={k}
              tone={locked || full ? 'ghost' : 'source'}
              hue={k}
              wide={k === 'hundreds'}
              onTap={locked || full ? undefined : () => put(k, 1)}
              ariaLabel={`Put a ${one} on the mat`}
            >
              <PlusArt />
              <Art />
            </Piece>
          );
        })}
      </Tray>
      <div style={KEY}>
        {swapsOf(round).map((from) => (
          <Swap key={from} from={from} />
        ))}
      </div>
    </div>
  );
}

export const tenLooseOneBundle: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'ten-loose-one-bundle',
  title: 'Ten Loose, One Bundle',
  hook: 'Tie ten sticks into one bundle.',
  group: 'numbers',
  levels: ['Teens', 'Up to 99', 'Hundreds too'],
  generate,
  prompt,
  emptyAnswer: (round) => round.start,
  Board,
  board,
  check,
  hints,
  explain,
  cover: 'art/games/ten-loose-one-bundle.png',
  note: {
    what: 'A place-value mat with columns for loose sticks, bundles of ten and (at level 3) flats of a hundred. He taps tray pieces onto the mat and taps mat pieces to take them off, to build a number, tie ten loose into a bundle, or untie one.',
    expect: 'Two first builds of 14 are likely: fourteen loose sticks (right amount, no bundle; the hint rings ten of them), or one bundle and thirteen loose, counting the bundle as one stick (the hint says that makes 23). Untie rounds such as "Show 34 with 2 bundles" tend to break next: he takes a bundle off and does not put its ten loose sticks back.',
    practising: 'Unitising: ten ones are counted as one ten, and ten tens as one hundred, without the amount changing. Also that the digit in each place counts bundles, so the 1 in 14 means one ten.',
    ask: 'When the hint rings ten loose sticks, before he taps anything: "If I tie these ten together, do we have more sticks, fewer, or the same?"',
    next: 'Use ice-cream sticks or straws and rubber bands at the kitchen table. Count out 23, tie the tens, then untie one bundle and ask him to count all the sticks again.',
    honest: 'Building 243 on this mat does not mean he can add 38 + 25 or subtract with regrouping. Check that separately with real bundles, and listen for whether he counts a bundle as one or as ten.',
    easier: 'Stay on level 1 and let him count every stick in a bundle aloud before he ties a new one.',
    harder: 'On level 2, before he taps anything, ask for the number 10 more and 10 less than the target, and which column changes.',
  },
};

export default tenLooseOneBundle;
