import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Slot, Tray } from '../../play/parts';

/**
 * What Comes Next? — pattern structure and early algebra.
 *
 * Concept (advisor, maths 9): a pattern is a unit that repeats. Find the unit
 * (mango, banana, banana), use it to fill any position, then see the SAME
 * structure in different things (circle, square, square = leaf, stone, stone).
 * The misconceptions it attacks: "a pattern is any decoration", "patterns only
 * alternate ABAB", and "matching colours is the whole task" — circles, squares
 * and triangles are all drawn in one colour, so the shape is the only cue.
 *
 * Levels:
 *  1. AB, ABB and AAB rows. Finish the row, or fill a gap. Every row he
 *     finishes stops part-way through a unit, so restarting the unit at the
 *     first empty space fails.
 *  2. ABC units, gaps in more than one unit, a decoy in the tray, and translation: the
 *     top row is the model, the bottom row must have the same structure in new
 *     things. Any relabelling that keeps the structure is accepted.
 *  3. Two stretches, alternating. Far spaces: the first two units are drawn and
 *     he fills space 14, 15 or 19, too far to see, so he counts in units
 *     (3, 6, 9, 12) and places the thing by its place in the unit. Growing (and
 *     shrinking) patterns: steps change by 2 or 3; he builds the next, a
 *     missing, or the FIRST step. The rule is the change per step.
 *
 * Control: tap-to-build only. Tap a thing in the tray to pick it up (it stays
 * in the hand until he taps it again or picks another), then tap a space to
 * put one there. Tapping a filled space with nothing different in hand takes
 * it off.
 */

export type Thing =
  | 'mango'
  | 'banana'
  | 'roti'
  | 'idli'
  | 'egg'
  | 'carrot'
  | 'peas'
  | 'circle'
  | 'square'
  | 'triangle'
  | 'leaf'
  | 'stone';

/** A row that repeats `unit`; he fills the `open` positions (0-based). */
export interface RepeatRound {
  readonly kind: 'repeat';
  readonly unit: readonly Thing[];
  /** Spaces in the row, always a whole number of units. */
  readonly length: number;
  readonly open: readonly number[];
  readonly tray: readonly Thing[];
}

/** A model row in one set of things; he builds the same structure in another. */
export interface TranslateRound {
  readonly kind: 'translate';
  /** The model row's unit. */
  readonly unit: readonly Thing[];
  /** Spaces in the model row. */
  readonly length: number;
  /** The same unit in new things: the drawn worked answer. Any relabelling that keeps the structure is right. */
  readonly into: readonly Thing[];
  /** Spaces in his row. */
  readonly bottom: number;
  readonly tray: readonly Thing[];
}

/** Steps whose counts change by the same amount; he builds step `open`. */
export interface GrowRound {
  readonly kind: 'grow';
  readonly steps: readonly number[];
  readonly open: number;
  readonly thing: Thing;
}

/** The first `drawn` spaces of a repeating row, then one far space, `target` (0-based), for him to fill. */
export interface FarRound {
  readonly kind: 'far';
  readonly unit: readonly Thing[];
  /** Spaces drawn from the start, a whole number of units. */
  readonly drawn: number;
  readonly target: number;
  readonly tray: readonly Thing[];
}

export type Round = RepeatRound | TranslateRound | GrowRound | FarRound;

export interface Answer {
  /** What sits in each open space, by position. */
  readonly placed: Readonly<Record<number, Thing>>;
  /** The thing in his hand, picked from the tray. */
  readonly picked: Thing | null;
}

/** Spaces in the step he builds at level 3: more than any answer needs. */
const CELLS = 10;

const distinct = (xs: readonly Thing[]): Thing[] => [...new Set(xs)];

const rep = (unit: Thing[], length: number, open: number[], tray: Thing[] = distinct(unit)): RepeatRound => ({
  kind: 'repeat',
  unit,
  length,
  open,
  tray,
});

const tr = (unit: Thing[], into: Thing[], tray: Thing[] = distinct(into)): TranslateRound => ({
  kind: 'translate',
  unit,
  length: unit.length * 3,
  into,
  bottom: unit.length * 2,
  tray,
});

const grow = (steps: number[], open: number, thing: Thing): GrowRound => ({ kind: 'grow', steps, open, thing });

const far = (unit: Thing[], drawn: number, target: number): FarRound => ({ kind: 'far', unit, drawn, target, tray: distinct(unit) });

const LEVEL_1: readonly Round[] = [
  rep(['mango', 'banana'], 8, [5, 6, 7]),
  rep(['circle', 'square', 'square'], 9, [7, 8]),
  rep(['roti', 'idli'], 8, [4]),
  rep(['egg', 'egg', 'carrot'], 9, [7, 8]),
  rep(['leaf', 'stone', 'stone'], 9, [4]),
  rep(['circle', 'triangle'], 8, [2, 5]),
  rep(['mango', 'mango', 'roti'], 9, [2, 5]),
];

const LEVEL_2: readonly Round[] = [
  rep(['mango', 'banana', 'roti'], 9, [5, 6, 7, 8]),
  tr(['circle', 'square', 'square'], ['leaf', 'stone', 'stone']),
  rep(['egg', 'carrot', 'peas'], 9, [4, 8]),
  tr(['egg', 'egg', 'carrot'], ['circle', 'circle', 'square'], ['circle', 'square', 'triangle']),
  rep(['roti', 'idli', 'idli'], 9, [5, 6, 7, 8], ['roti', 'idli', 'banana']),
  tr(['circle', 'square', 'triangle'], ['mango', 'banana', 'roti']),
  rep(['banana', 'mango', 'mango'], 9, [1, 5, 6]),
];

/**
 * Far spaces are chosen so that neither "the next thing after the drawn part"
 * nor "the thing the unit has most of" is right: only counting in units is.
 */
const LEVEL_3: readonly Round[] = [
  far(['mango', 'mango', 'banana'], 6, 14),
  grow([1, 3, 5, 7], 3, 'idli'),
  far(['egg', 'carrot', 'peas'], 6, 13),
  grow([3, 5, 7, 9], 0, 'roti'),
  far(['circle', 'circle', 'square', 'triangle'], 8, 18),
  grow([9, 7, 5, 3], 3, 'carrot'),
  grow([1, 4, 7, 10], 2, 'peas'),
];

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const table = level === 1 ? LEVEL_1 : level === 2 ? LEVEL_2 : LEVEL_3;
  return table[index % table.length];
}

// ------------------------------------------------------------------ the maths --

const NAME: Record<Thing, string> = {
  mango: 'mango',
  banana: 'banana',
  roti: 'roti',
  idli: 'idli',
  egg: 'egg',
  carrot: 'carrot',
  peas: 'pea pod',
  circle: 'circle',
  square: 'square',
  triangle: 'triangle',
  leaf: 'leaf',
  stone: 'stone',
};

const list = (xs: readonly Thing[]) => xs.map((t) => NAME[t]).join(', ');

const an = (t: Thing) => `${/^[aeiou]/.test(NAME[t]) ? 'an' : 'a'} ${NAME[t]}`;

/** The thing at position i of a row that repeats `unit`. */
const at = (unit: readonly Thing[], i: number): Thing => unit[i % unit.length];

const row = (unit: readonly Thing[], length: number): Thing[] => Array.from({ length }, (_, i) => at(unit, i));

/** A B B for mango, banana, banana: each thing named by the order it first appears. Empty is '_'. */
export function letters(things: readonly (Thing | undefined)[]): string[] {
  const seen: Thing[] = [];
  return things.map((t) => {
    if (!t) return '_';
    if (!seen.includes(t)) seen.push(t);
    return 'ABCD'[seen.indexOf(t)];
  });
}

const spaced = (ls: readonly string[]) => ls.join(' ');

/** His row in a translate round, by position; undefined where empty. */
const yours = (round: TranslateRound, answer: Answer): (Thing | undefined)[] =>
  Array.from({ length: round.bottom }, (_, i) => answer.placed[i]);

/** The change from one step to the next. */
const stepChange = (round: GrowRound) => round.steps[1] - round.steps[0];

/** The nearest given space one or more whole units away from space i: it must hold the same thing. */
function twin(round: RepeatRound, i: number): number {
  const n = round.unit.length;
  for (let j = i - n; j >= 0; j -= n) if (!round.open.includes(j)) return j;
  for (let j = i + n; j < round.length; j += n) if (!round.open.includes(j)) return j;
  return i % n;
}

/** A tail of open spaces means "finish the row"; anything else is a gap. */
const isTail = (round: RepeatRound) => round.open.every((p, j) => p === round.length - round.open.length + j);

function prompt(round: Round): string {
  if (round.kind === 'repeat') {
    if (isTail(round)) return 'Find the part that repeats, then finish the row.';
    return round.open.length === 1 ? 'Find the part that repeats, then fill the gap.' : 'Find the part that repeats, then fill the gaps.';
  }
  if (round.kind === 'translate') return 'Make the bottom row the same pattern, in new things.';
  if (round.kind === 'far') return `What goes in space ${round.target + 1}? Count the part that repeats.`;
  return `Build step ${round.open + 1}. What changes from step to step?`;
}

const spaces = (k: number) => (k === 1 ? '1 space is empty.' : `${k} spaces are empty.`);

/** Where the far space sits in its unit, counting from 1. */
const placeInUnit = (round: FarRound) => (round.target % round.unit.length) + 1;

function check(round: Round, answer: Answer): Verdict {
  if (round.kind === 'far') {
    const here = answer.placed[round.target];
    if (here === at(round.unit, round.target)) return { ok: true };
    const s = round.target + 1;
    const lead = here ? `Space ${s} holds ${an(here)}.` : `Space ${s} is empty.`;
    return { ok: false, hint: `${lead} The row repeats every ${round.unit.length}; space ${s} is thing ${placeInUnit(round)} of its box.` };
  }
  if (round.kind === 'repeat') {
    const n = round.unit.length;
    const empty = round.open.filter((i) => !answer.placed[i]).length;
    const wrong = round.open.find((i) => answer.placed[i] && answer.placed[i] !== at(round.unit, i));
    if (empty === 0 && wrong === undefined) return { ok: true };
    const top = `The row repeats every ${n} things.`;
    if (wrong === undefined) return { ok: false, hint: `${top} ${spaces(empty)}` };
    const j = twin(round, wrong);
    const away = `${Math.abs(wrong - j)} spaces ${j < wrong ? 'back' : 'on'}`;
    return {
      ok: false,
      hint: `${top} Space ${wrong + 1} holds ${an(answer.placed[wrong])}; ${away}, space ${j + 1} holds ${an(at(round.unit, j))}.`,
    };
  }
  if (round.kind === 'translate') {
    const mine = yours(round, answer);
    const want = letters(row(round.unit, round.bottom));
    const got = letters(mine);
    const empty = mine.filter((t) => !t).length;
    if (empty === 0 && spaced(got) === spaced(want)) return { ok: true };
    if (empty > 0) return { ok: false, hint: `The top row repeats ${list(round.unit)}. In your row, ${spaces(empty).toLowerCase()}` };
    return { ok: false, hint: `The top row goes ${spaced(want)}. Your row goes ${spaced(got)}.` };
  }
  const count = Object.keys(answer.placed).length;
  const need = round.steps[round.open];
  if (count === need) return { ok: true };
  const known = round.steps
    .map((n, s) => (s === round.open ? '' : `step ${s + 1} has ${n}`))
    .filter(Boolean)
    .join(', ');
  return { ok: false, hint: `${known.charAt(0).toUpperCase()}${known.slice(1)}. Your step ${round.open + 1} has ${count}.` };
}

function explain(round: Round): string {
  if (round.kind === 'repeat') {
    return `The unit is ${list(round.unit)}: ${spaced(letters(round.unit))}. It repeats, so each space takes the thing at its place in the unit.`;
  }
  if (round.kind === 'translate') {
    const l = spaced(letters(round.unit));
    return `The top row, ${list(round.unit)}, goes ${l}. Your row goes ${l} too: different things, the same pattern.`;
  }
  if (round.kind === 'far') {
    const n = round.unit.length;
    const ends = Array.from({ length: Math.floor(round.target / n) }, (_, u) => (u + 1) * n);
    return `The unit is ${list(round.unit)}. Units end at ${ends.join(', ')}, so space ${round.target + 1} is thing ${placeInUnit(round)} of the next unit: ${NAME[at(round.unit, round.target)]}.`;
  }
  const d = stepChange(round);
  const n = Math.abs(d);
  return `Each step has ${n} ${d > 0 ? 'more' : 'fewer'} than the one before: ${round.steps.join(', ')}. The rule is the change: ${d > 0 ? 'add' : 'take away'} ${n} each step.`;
}

// ------------------------------------------------------------------ drawing --

const INK = '#24170f';
/** Circles, squares and triangles share one colour: the shape is the only cue. */
const SHAPE = '#7b3fb8';
const DEEP = '#0f4790';
const GOLD = '#d98e00';
const sw = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const };

/** Each thing drawn in a 44 by 44 box. */
const DRAW: Record<Thing, ReactNode> = {
  mango: (
    <>
      <path d="M22 9 C33 9 38 19 36 28 C34 36 26 40 19 38 C11 36 7 28 9 20 C11 13 16 9 22 9 Z" fill="#f2a900" {...sw} />
      <ellipse cx="29" cy="23" rx="5" ry="7" fill="#e8742a" opacity="0.55" />
      <path d="M22 9 L23 4" stroke="#6b4a1f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M23 6 C28 1 34 2 37 5 C32 8 27 8 23 6 Z" fill="#3a9d4a" stroke={INK} strokeWidth="1.5" />
    </>
  ),
  banana: (
    <>
      <path d="M9 8 C8 24 18 35 37 32 C35 37 28 40 21 39 C11 37 4 27 5 14 C5 11 6 9 9 8 Z" fill="#f5d33a" {...sw} />
      <path d="M9 8 L8 4" stroke="#5a4a1a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="36.5" cy="33" r="1.8" fill="#5a4a1a" />
    </>
  ),
  roti: (
    <>
      <circle cx="22" cy="22" r="17" fill="#ecc98f" {...sw} />
      <ellipse cx="16" cy="16" rx="3" ry="2" fill="#b9772f" />
      <ellipse cx="27" cy="19" rx="2.5" ry="1.6" fill="#b9772f" />
      <ellipse cx="20" cy="28" rx="3.2" ry="2" fill="#b9772f" />
      <ellipse cx="29" cy="29" rx="2" ry="1.4" fill="#b9772f" />
    </>
  ),
  idli: (
    <>
      <path d="M3 33 H41" stroke="#3a9d4a" strokeWidth="4" strokeLinecap="round" />
      <path d="M5 28 C5 14 39 14 39 28 C39 32 5 32 5 28 Z" fill="#fbf8ee" {...sw} />
      <circle cx="16" cy="22" r="1.2" fill="#c9bf9f" />
      <circle cx="24" cy="20" r="1.2" fill="#c9bf9f" />
      <circle cx="30" cy="24" r="1.2" fill="#c9bf9f" />
    </>
  ),
  egg: (
    <>
      <path d="M22 5 C31 5 36 20 36 27 C36 35 30 40 22 40 C14 40 8 35 8 27 C8 20 13 5 22 5 Z" fill="#e2b07a" {...sw} />
      <ellipse cx="16" cy="18" rx="3" ry="5" fill="#ffffff" opacity="0.5" />
    </>
  ),
  carrot: (
    <>
      <path d="M22 14 L17 3 M22 14 L22 2 M22 14 L27 3" stroke="#3a9d4a" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 14 L31 14 L23 42 Z" fill="#ef7d1a" {...sw} />
      <path d="M17 21 H23 M19 29 H24" stroke="#b5530a" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  peas: (
    <>
      <path d="M4 25 C10 12 34 11 40 20 C34 32 10 35 4 25 Z" fill="#5fae3a" {...sw} />
      <circle cx="14" cy="23.5" r="4" fill="#a6dd6a" stroke="#2f6e1c" strokeWidth="1.5" />
      <circle cx="22" cy="22" r="4" fill="#a6dd6a" stroke="#2f6e1c" strokeWidth="1.5" />
      <circle cx="30" cy="21" r="4" fill="#a6dd6a" stroke="#2f6e1c" strokeWidth="1.5" />
    </>
  ),
  circle: <circle cx="22" cy="22" r="16" fill={SHAPE} {...sw} />,
  square: <rect x="7" y="7" width="30" height="30" rx="2" fill={SHAPE} {...sw} />,
  triangle: <path d="M22 5 L39 37 L5 37 Z" fill={SHAPE} {...sw} />,
  leaf: (
    <>
      <path d="M6 37 C6 18 18 6 38 6 C38 26 26 38 6 37 Z" fill="#3a9d4a" {...sw} />
      <path d="M8 35 L32 12" stroke="#1f6b2c" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  stone: (
    <>
      <path d="M8 28 C6 18 14 11 23 11 C33 11 39 18 37 27 C35 35 27 37 20 37 C13 37 9 34 8 28 Z" fill="#9a948a" {...sw} />
      <circle cx="17" cy="21" r="1.6" fill="#6f6a62" />
      <circle cx="27" cy="27" r="1.3" fill="#6f6a62" />
    </>
  ),
};

function Icon({ thing }: { readonly thing: Thing }) {
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      {DRAW[thing]}
    </svg>
  );
}

const Blank = () => <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" />;

const rowStyle: CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 'var(--s2)', justifyContent: 'center', alignItems: 'flex-start' };
const cellStyle: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const letterStyle: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-md)', color: DEEP, minHeight: '1.3em' };
const unitLine: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-lg)', color: DEEP, textAlign: 'center' };
const rowLabel: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' };

/** One unit's box: boxed in gold once the units are shown, invisible (but the same size) before. */
const unitBox = (on: boolean): CSSProperties => ({
  display: 'flex',
  gap: 'var(--s2)',
  padding: 6,
  borderRadius: 12,
  border: `3px ${on ? 'dashed' : 'solid'} ${on ? GOLD : 'transparent'}`,
  background: on ? '#fff8e6' : 'transparent',
});

interface Cell {
  readonly key: number;
  readonly view: ReactNode;
  readonly letter: string;
  /** The space's number, counting from 1: the hints and the level 3 prompt name spaces by it. */
  readonly num: number;
}

const numStyle: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', minHeight: '1.2em' };

/**
 * A row of spaces; boxed into units and lettered A B B ... when `shown`.
 * Numbered under each space when `numbered`: only where a hint or prompt names spaces.
 */
function Row({
  cells,
  unit,
  shown,
  label,
  numbered = false,
}: {
  readonly cells: readonly Cell[];
  readonly unit: number;
  readonly shown: boolean;
  readonly label: string;
  readonly numbered?: boolean;
}) {
  const groups: Cell[][] = shown
    ? Array.from({ length: Math.ceil(cells.length / unit) }, (_, g) => cells.slice(g * unit, g * unit + unit))
    : [[...cells]];
  return (
    <div style={rowStyle} role="group" aria-label={label}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ ...unitBox(shown), flexWrap: shown ? 'nowrap' : 'wrap', justifyContent: 'center' }}>
          {g.map((c) => (
            <div key={c.key} style={cellStyle}>
              {c.view}
              {shown ? <span style={letterStyle}>{c.letter}</span> : null}
              {numbered ? <span style={numStyle}>{c.num}</span> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const stripCell: CSSProperties = { width: 36, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-md)', lineHeight: '36px' };

/** The space numbers 1 to `upto`, boxed into units, with `mark` ringed: where the far space falls in its unit. */
function NumberStrip({ upto, unit, mark }: { readonly upto: number; readonly unit: number; readonly mark: number }) {
  const nums = Array.from({ length: upto }, (_, i) => i + 1);
  const groups = Array.from({ length: Math.ceil(upto / unit) }, (_, g) => nums.slice(g * unit, g * unit + unit));
  return (
    <div style={rowStyle} role="img" aria-label={`Spaces 1 to ${upto} in boxes of ${unit}; space ${mark} is number ${((mark - 1) % unit) + 1} in its box.`}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ ...unitBox(true), gap: 2 }}>
          {g.map((k) => (
            <span key={k} style={k === mark ? { ...stripCell, borderRadius: 18, background: GOLD, color: '#fff' } : stripCell}>
              {k}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const GOLD_TINT = '#ffe7a3';

/** One thing singled out: new in this step, or the place the far space takes in its unit. Gold, like the +2 and the ringed number. */
const markStyle: CSSProperties = { display: 'inline-flex', borderRadius: 10, background: GOLD_TINT, boxShadow: `0 0 0 3px ${GOLD}` };

/** A thing, ringed in gold when it is the one meant. */
const ringed = (thing: Thing, marked: boolean) =>
  marked ? (
    <span style={markStyle}>
      <Icon thing={thing} />
    </span>
  ) : (
    <Icon thing={thing} />
  );

/** The worked answer, drawn: the right thing in a dashed ring, so it reads as shown, not placed. */
const Worked = ({ thing, fresh = false }: { readonly thing: Thing; readonly fresh?: boolean }) => (
  <span style={{ display: 'inline-flex', borderRadius: 10, outline: `3px dashed ${DEEP}`, outlineOffset: 2, background: fresh ? GOLD_TINT : undefined }}>
    <Icon thing={thing} />
  </span>
);

/**
 * A thing the step before had and this step does not: left in place, faded, in a dotted gold outline,
 * so "−2" is two things he can count where the steps are compared. Not a slot: nothing goes here.
 */
const Gone = ({ thing, label }: { readonly thing: Thing; readonly label: string }) => (
  <span
    role="img"
    aria-label={label}
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--s2)', borderRadius: 'var(--radius-sm)', border: `3px dotted ${GOLD}` }}
  >
    <span style={{ display: 'inline-flex', opacity: 0.3 }}>
      <Icon thing={thing} />
    </span>
  </span>
);

/**
 * The unit drawn as its things and lettered A B B: the answer shown, not only said.
 * `from` numbers the places with their space numbers (the box a far space sits in); `ring` marks one place.
 */
function UnitPicture({ unit, from, ring, label }: { readonly unit: readonly Thing[]; readonly from?: number; readonly ring?: number; readonly label: string }) {
  const ls = letters(unit);
  return (
    <div role="img" aria-label={label} style={{ ...unitBox(true), alignSelf: 'center' }}>
      {unit.map((t, i) => (
        <div key={i} style={cellStyle}>
          {ringed(t, i === ring)}
          <span style={letterStyle}>{ls[i]}</span>
          {from === undefined ? null : (
            <span style={i === ring ? { ...stripCell, borderRadius: 18, background: GOLD, color: '#fff' } : stripCell}>{from + i + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
}

const stepLabel: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-sm)', minWidth: '4.5em', paddingTop: 'var(--s4)' };
const countTag: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--t-lg)', color: DEEP, minWidth: '3.5em', paddingTop: 'var(--s3)' };
const changeTag: CSSProperties = { color: GOLD, marginLeft: 6, fontSize: 'var(--t-md)' };

const signed = (d: number) => (d > 0 ? `+${d}` : `−${-d}`);

// ------------------------------------------------------- words on the board --

type Stage = BoardProps<Round, Answer>['stage'];

/** Once checked, or shown worked, the board takes no taps and draws the answer. */
const locks = (stage: Stage) => stage === 'worked' || stage === 'solved';

/** The tray's instruction, over the things he picks from. */
const PICK = 'Pick one, then tap a space';

/** The line under a repeating row at 'hint': how long the unit is. */
const repeatsEvery = (round: RepeatRound) => `It repeats every ${round.unit.length}.`;

/** The line under the steps once locked: the counts, and the change that is the rule. */
const growLine = (round: GrowRound) => `${round.steps.join(', ')}: ${signed(stepChange(round))} each step.`;

/**
 * Read-aloud: the board's words in screen order. While he can tap, the line
 * under a repeating row at 'hint', then the tray's instruction; once locked,
 * a growing pattern's rule line (the other kinds draw their worked answer as
 * things, letters and numbers only). Left to the picture: the A B B letters,
 * space and step numbers, counts and +2 tags, "Step 1" to "Step 4", and the
 * translate round's "The pattern" / "Your row" (the prompt names the bottom row).
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  if (locks(stage)) return round.kind === 'grow' ? [growLine(round)] : [];
  return [...(stage === 'hint' && round.kind === 'repeat' ? [repeatsEvery(round)] : []), PICK];
}

/** The spaces he can fill, by position. */
function openSpaces(round: RepeatRound | TranslateRound | FarRound): readonly number[] {
  if (round.kind === 'repeat') return round.open;
  if (round.kind === 'far') return [round.target];
  return Array.from({ length: round.bottom }, (_, i) => i);
}

/** Every way the open spaces can be left: each empty, or holding one thing from the tray. */
const fillings = (spaces: readonly number[], tray: readonly Thing[]): Answer['placed'][] =>
  spaces.reduce<Answer['placed'][]>((acc, i) => acc.flatMap((p) => [p, ...tray.map((t) => ({ ...p, [i]: t }))]), [{}]);

/**
 * Read-aloud: every hint `check` gives for this round, over every answer the
 * board can hold. A tap only puts the thing in hand into an open space or
 * takes it off, so that is every filling of the open spaces from the tray; a
 * growing step is 0 to CELLS of its one thing, and `check` reads only how many.
 */
function hints(round: Round): readonly string[] {
  const placements =
    round.kind === 'grow'
      ? Array.from({ length: CELLS + 1 }, (_, k) => Object.fromEntries(Array.from({ length: k }, (_, i) => [i, round.thing])))
      : fillings(openSpaces(round), round.tray);
  const out = new Set<string>();
  for (const placed of placements) {
    const { hint } = check(round, { placed, picked: null });
    if (hint) out.add(hint);
  }
  return [...out];
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = locks(stage);
  const worked = stage === 'worked';
  const shown = stage !== 'answering';
  const holding = locked ? null : answer.picked;

  /** Tap an open space: put down what is in hand, swap it for something different, or take it off. */
  const tapSpace = (i: number) => {
    const here = answer.placed[i];
    const placed = { ...answer.placed };
    if (holding && holding !== here) placed[i] = holding;
    else delete placed[i];
    setAnswer({ placed, picked: answer.picked });
  };

  /** One open space, as a slot. `fresh` rings what it holds in gold: new in this step. */
  const space = (i: number, where: string, solution: Thing | null, fresh = false): ReactNode => {
    if (worked && solution) {
      return (
        <Slot key={i} ariaLabel={`${where}: ${NAME[solution]}${fresh ? ', new this step' : ''}`} filled>
          <Worked thing={solution} fresh={fresh} />
        </Slot>
      );
    }
    // On the worked board only the solution is drawn; spaces past it stay empty.
    const here = worked ? undefined : answer.placed[i];
    const swap = !!holding && holding !== here;
    const label = here
      ? `${where}: ${NAME[here]}${locked ? (fresh ? ', new this step' : '') : swap ? `, put the ${NAME[holding]} here instead` : ', take it off'}`
      : `${where}: empty${holding ? `, put the ${NAME[holding]} here` : ''}`;
    const tappable = !locked && (!!here || !!holding);
    return (
      <Slot key={i} ariaLabel={label} filled={!!here} ready={swap} onTap={tappable ? () => tapSpace(i) : undefined}>
        {here ? ringed(here, fresh) : <Blank />}
      </Slot>
    );
  };

  const given = (i: number, thing: Thing, where: string, fresh = false) => (
    <Slot key={i} ariaLabel={`${where}: ${NAME[thing]}${fresh ? ', new this step' : ''}`} filled>
      {ringed(thing, fresh)}
    </Slot>
  );

  const tray = (things: readonly Thing[]) => (
    <Tray label={PICK}>
      {things.map((t) => (
        <Piece
          key={t}
          tone={holding === t ? 'picked' : 'source'}
          onTap={locked ? undefined : () => setAnswer({ placed: answer.placed, picked: answer.picked === t ? null : t })}
          ariaLabel={holding === t ? `Put the ${NAME[t]} down` : `Pick up ${an(t)}`}
        >
          <Icon thing={t} />
        </Piece>
      ))}
    </Tray>
  );

  if (round.kind === 'repeat') {
    const truth = row(round.unit, round.length);
    const ls = letters(truth);
    const cells: Cell[] = truth.map((t, i) => {
      const where = `Space ${i + 1}`;
      const open = round.open.includes(i);
      return {
        key: i,
        view: open ? space(i, where, t) : given(i, t, where),
        letter: open && !locked ? '?' : ls[i],
        num: i + 1,
      };
    });
    return (
      <div className="board">
        <Row cells={cells} unit={round.unit.length} shown={shown} label="The row" numbered={shown} />
        {locked ? (
          <UnitPicture unit={round.unit} label={`The unit: ${list(round.unit)}, ${spaced(letters(round.unit))}`} />
        ) : shown ? (
          <p style={unitLine}>{repeatsEvery(round)}</p>
        ) : null}
        {tray(round.tray)}
      </div>
    );
  }

  if (round.kind === 'far') {
    const n = round.unit.length;
    const drawn = row(round.unit, round.drawn);
    const ls = letters(drawn);
    const cells: Cell[] = drawn.map((t, i) => ({ key: i, view: given(i, t, `Space ${i + 1}`), letter: ls[i], num: i + 1 }));
    const s = round.target + 1;
    const solution = at(round.unit, round.target);
    return (
      <div className="board">
        <div style={{ ...rowStyle, alignItems: 'center' }}>
          <Row cells={cells} unit={n} shown={shown} label={`Spaces 1 to ${round.drawn}`} numbered />
          <span aria-hidden="true" style={{ ...unitLine, color: 'var(--ink-soft)', letterSpacing: '0.2em' }}>
            . . .
          </span>
          <div style={cellStyle}>
            {space(round.target, `Space ${s}`, solution)}
            {shown ? <span style={letterStyle}>{locked ? letters(round.unit)[round.target % n] : '?'}</span> : null}
            <span style={{ ...numStyle, color: DEEP, fontWeight: 700 }}>{s}</span>
          </div>
        </div>
        {shown ? <NumberStrip upto={s} unit={n} mark={s} /> : null}
        {locked ? (
          <UnitPicture
            unit={round.unit}
            from={round.target - (round.target % n)}
            ring={round.target % n}
            label={`The box space ${s} is in: ${list(round.unit)}. Space ${s} is thing ${placeInUnit(round)}, ${an(solution)}.`}
          />
        ) : null}
        {tray(round.tray)}
      </div>
    );
  }

  if (round.kind === 'translate') {
    const model = row(round.unit, round.length);
    const modelLetters = letters(model);
    const answerRow = worked ? row(round.into, round.bottom) : yours(round, answer);
    const mineLetters = letters(answerRow);
    /** His row's first unit, side by side with the pattern's: the same letters in new things. */
    const theirUnit = answerRow.slice(0, round.unit.length).filter((t): t is Thing => !!t);
    const top: Cell[] = model.map((t, i) => ({ key: i, view: given(i, t, `Top row, space ${i + 1}`), letter: modelLetters[i], num: i + 1 }));
    const bottom: Cell[] = Array.from({ length: round.bottom }, (_, i) => ({
      key: i,
      view: space(i, `Your row, space ${i + 1}`, at(round.into, i)),
      letter: answerRow[i] ? mineLetters[i] : '?',
      num: i + 1,
    }));
    return (
      <div className="board">
        <p style={rowLabel}>The pattern</p>
        <Row cells={top} unit={round.unit.length} shown={shown} label="The pattern" />
        <p style={rowLabel}>Your row</p>
        <Row cells={bottom} unit={round.unit.length} shown={shown} label="Your row" />
        {locked ? (
          <div style={{ ...rowStyle, alignItems: 'center' }} role="group" aria-label={`Both rows: ${spaced(letters(round.unit))}, again and again.`}>
            <UnitPicture unit={round.unit} label={`The pattern's unit: ${list(round.unit)}, ${spaced(letters(round.unit))}`} />
            {theirUnit.length === round.unit.length ? (
              <>
                <span aria-hidden="true" style={unitLine}>
                  =
                </span>
                <UnitPicture unit={theirUnit} label={`Your row's unit: ${list(theirUnit)}, ${spaced(letters(theirUnit))}`} />
              </>
            ) : null}
          </div>
        ) : null}
        {tray(round.tray)}
      </div>
    );
  }

  const d = stepChange(round);
  const need = round.steps[round.open];
  const built = Object.keys(answer.placed).length;
  return (
    <div className="board">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)' }}>
        {round.steps.map((n, s) => {
          const open = s === round.open;
          const where = `Step ${s + 1}`;
          // The change is drawn on a step only when it and the step before it are known.
          const prevKnown = s > 0 && (s - 1 !== round.open || locked);
          const showChange = shown && prevKnown && (!open || locked);
          // The change as things: the d new ones ringed in gold, or the d gone ones left as faded outlines.
          const fresh = (i: number, total: number) => showChange && d > 0 && i >= total - d;
          const gone = showChange && d < 0
            ? Array.from({ length: -d }, (_, k) => <Gone key={`gone-${k}`} thing={round.thing} label={`${where}: one fewer ${NAME[round.thing]} than step ${s}`} />)
            : [];
          // Once checked, the step he built is drawn as its `need` things, so the new or gone ones sit at its end.
          const cells = open
            ? locked
              ? Array.from({ length: need }, (_, i) =>
                  worked ? space(i, `${where}, ${i + 1} of ${need}`, round.thing, fresh(i, need)) : given(i, round.thing, `${where}, ${i + 1} of ${need}`, fresh(i, need)),
                )
              : Array.from({ length: CELLS }, (_, i) => space(i, `${where}, space ${i + 1}`, null))
            : Array.from({ length: n }, (_, i) => given(i, round.thing, `${where}, ${i + 1} of ${n}`, fresh(i, n)));
          const count = open ? (worked ? need : built) : n;
          return (
            <div key={s} style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'flex-start' }}>
              <span style={stepLabel}>{where}</span>
              <div style={{ ...rowStyle, justifyContent: 'flex-start', flex: 1 }} role="group" aria-label={open && !locked ? `${where}: yours to build` : `${where}: ${count}`}>
                {cells}
                {gone}
              </div>
              <span style={countTag}>
                {shown ? count : ''}
                {showChange ? <span style={changeTag}>{signed(d)}</span> : null}
              </span>
            </div>
          );
        })}
      </div>
      {locked ? <p style={unitLine}>{growLine(round)}</p> : null}
      {tray([round.thing])}
    </div>
  );
}

export const whatComesNext: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'what-comes-next',
  title: 'What Comes Next?',
  hook: 'Find the part that repeats.',
  group: 'rules',
  levels: ['Repeat the unit', 'Gaps and new things', 'Far spaces, growing steps'],
  generate,
  prompt,
  emptyAnswer: () => ({ placed: {}, picked: null }),
  Board,
  board,
  check,
  hints,
  explain,
  cover: 'art/games/what-comes-next.png',
  note: {
    what: 'A row of mangoes, rotis, eggs or plain shapes that repeats a unit, with some spaces empty. He picks a thing from the tray and taps a space to put it there. Level 2 adds ABC units and copying a pattern into new things. Level 3 asks what goes in a far space (14, 15 or 19) and has him build a step of a growing pattern.',
    expect: 'He will first look at the last thing in the row and alternate from it, which works for mango, banana and breaks on circle, square, square. Every row he has to finish stops part-way through a unit, so restarting the unit at the first empty space fails too. On a far space he will usually pick the thing after the last one drawn; on a growing pattern he will add one more each step, whatever the change is.',
    practising: 'Finding the repeating unit (AB, AAB, ABB, ABC, AABC) and using it to work out any position, including one he cannot see, by counting in units; seeing that leaf, stone, stone and circle, square, square are the same structure; and the rule of a growing pattern as a constant change per step: 1, 3, 5, 7 is "add 2".',
    ask: 'On the level 3 round that asks for space 15 (mango, mango, banana), before he taps: "The part that repeats is 3 long. Count in threes up to 15. What is in space 15?"',
    next: 'Lay out spoons and forks as spoon, fork, fork on the table and stop after two units. Ask what the 14th one will be before he lays the rest, then let him lay them out and check. Then make the same pattern with steel katoris and glasses.',
    honest: 'Filling these rows does not show he can name the unit or find a far position without the drawn boxes; the hint draws the unit boxes and a numbered strip, so a far space solved after the hint is counting along, not counting in units. A first-try far space is the real evidence. At level 3 he may count idlis rather than see the rule.',
    easier: 'Stay on level 1, and before each round ask him to tap out the unit with his finger and say it aloud: "mango, banana; mango, banana".',
    harder: 'At level 2, after a translate round, ask him to say both rows as letters (A B B) and invent a new row in sounds: clap, stamp, stamp. At level 3, ask how many step 10 would have, and what is in space 30 of a mango, mango, banana row.',
  },
};

export default whatComesNext;
