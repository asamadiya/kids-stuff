import { Fragment, type CSSProperties, type ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Stepper } from '../../play/parts';

/**
 * When Do We Leave? — maths game 16 (advisor catalogue: "Clock hands show
 * different units").
 *
 * Concept: the two hands of an analogue clock measure different things. The
 * short hand says WHICH hour we are in; the long hand says HOW FAR through that
 * hour we are. Advisor content boundary: whole hours first, then half hours;
 * elapsed time comes later.
 *
 * The clock is geared like a real one. Its time is one number (minutes after
 * 12:00), so the short hand is always where a real short hand would be: on the
 * 4 at 4 o'clock, half way from 4 to 5 at half past 4. He never places the
 * short hand by eye; he watches it creep when he moves the long hand.
 *
 * Levels:
 *  1. O'clock. He sets the clock from words ("4 o'clock"), or reads a fixed
 *     clock into hour and minutes. 6 o'clock (hands in one straight line) and
 *     3 o'clock are where reading the long hand as the hour shows up.
 *  2. Half past. The short hand now sits between two numbers. 12:30 is the
 *     trap: the short hand is nearer 1, and the hour is still 12.
 *  3. Later than now. A fixed "Now" clock (o'clock, half past, quarter past,
 *     quarter to, across 12); he sets the leaving clock half an hour, one hour
 *     or two hours on. One hour: the long hand goes once round and ends where
 *     it started, the short hand moves one number. Half an hour: the long hand
 *     goes half round and crosses 12, the short hand only half way to the next
 *     number. Mixing the three is what stops "copy the long hand, move the
 *     short hand one" from solving every round. Minutes step in 15s here.
 *
 * The goal is on the board, not only in the prompt, so a child who cannot read
 * yet still knows it. Every round draws the place, and beside it the clock to
 * aim at: a fixed clock in a dashed card, under a door-with-an-arrow icon (we
 * leave), with a plain rim. Setting, that card is the leaving time and his own
 * gold-rimmed clock is to be made to match it. Reading, the card is the clock
 * he reads. Later than now, the leaving time is what he works out, so the card
 * is the Now clock (a house icon: we are still at home) and his own clock
 * carries the door icon. Only his clock has the gold rim and the steppers.
 *
 * Control: the Stepper only. Two steppers, one per hand: the hour stepper moves
 * the clock 60 minutes, the minute stepper 30 (levels 1-2) or 15 (level 3).
 * Both wrap round the face like real hands, so 12 + 1 is 1.
 *
 * Amounts are drawn, not only numbered. Under the minute stepper, a small face
 * cut into one wedge per press shades the minutes it shows. Under the hour
 * stepper, always: a whole shaded face (one turn of the long hand) beside one
 * orange twelfth (the short hand moving on one number). On level 3 the gap
 * sits on the arrow as long-hand turns — half a face, one face, two faces —
 * with the words small underneath; on a hint, his own clock's distance from
 * Now appears beneath it in the same faces.
 *
 * Hint: what his answer does. Set: his clock gets an orange slice for the hour
 * it is in and a blue sweep for the minutes gone, and the leaving clock gets
 * the same marks, so the two compare slice for slice. Read: the same marks on the
 * fixed clock, with his reading drawn as dashed hands over it. Later: the Now
 * hands are drawn dashed on his clock, and both times appear in numbers.
 * The fixed clocks' screen-reader labels give hand positions, never the time,
 * so the label does not read the clock for him. The one exception is the
 * leaving clock when he sets: there the time is the question, already in the
 * prompt, and the hand positions would be the answer.
 * Worked: the target hands, the marks, and the time in numbers and words.
 *
 * Every answer starts at 12:00 and no target is 12:00, so the empty answer is
 * never right.
 */

export type Task = 'set' | 'read' | 'later';
export type Place = 'park' | 'temple' | 'library' | 'market' | 'airport';
/** How long after Now we leave, in minutes ('later' rounds). */
export type Gap = 30 | 60 | 120;

export interface Round {
  /** Set the hands from words, read fixed hands into numbers, or set a time after Now. */
  readonly task: Task;
  /** Where the family is going: drawn on the board, named in the prompt. */
  readonly place: Place;
  /** The time the answer must show, in minutes after 12:00 (0..719). */
  readonly target: number;
  /** 'later' only: the time on the fixed Now clock. */
  readonly now: number | null;
  /** 'later' only: minutes from Now to leaving. */
  readonly gap: Gap | null;
  /** Minutes one press of the minute stepper moves the long hand. */
  readonly step: 15 | 30;
}

/** His clock, in minutes after 12:00 (0..719). */
export type Answer = number;

const DAY = 720;
export const norm = (t: number) => ((t % DAY) + DAY) % DAY;
const at = (h: number, m = 0) => norm((h % 12) * 60 + m);

/** The hour the short hand is in, 1..12. */
export const hourOf = (t: number) => Math.floor(norm(t) / 60) || 12;
export const minuteOf = (t: number) => norm(t) % 60;
const after = (h: number) => (h === 12 ? 1 : h + 1);
export const digital = (t: number) => `${hourOf(t)}:${String(minuteOf(t)).padStart(2, '0')}`;

export function spoken(t: number): string {
  const h = hourOf(t);
  switch (minuteOf(t)) {
    case 0:
      return `${h} o'clock`;
    case 15:
      return `quarter past ${h}`;
    case 30:
      return `half past ${h}`;
    case 45:
      return `quarter to ${after(h)}`;
    default:
      return digital(t);
  }
}

/** The numeral the long hand points at. */
const longOn = (t: number) => (minuteOf(t) === 0 ? 12 : minuteOf(t) / 5);
/** Where the short hand sits: on a numeral, or between two. */
const shortAt = (t: number) => (minuteOf(t) === 0 ? `on ${hourOf(t)}` : `between ${hourOf(t)} and ${after(hourOf(t))}`);
const SHARE: Record<number, string> = {
  15: 'a quarter of the way round',
  30: 'half way round',
  45: 'three quarters of the way round',
};

const PLACE_NAME: Record<Place, string> = {
  park: 'Park',
  temple: 'Temple',
  library: 'Library',
  market: 'Market',
  airport: 'Airport',
};

/** How the prompt and the board name each gap. */
const GAP_WORDS: Record<Gap, string> = { 30: 'half an hour', 60: 'one hour', 120: 'two hours' };

/** [task, place, time, gap] per level, walked by index. On level 3 the time is Now. */
type Row = readonly [Task, Place, number, Gap?];
const TABLE: Record<Level, readonly Row[]> = {
  1: [
    ['set', 'park', at(4)],
    ['read', 'temple', at(6)],
    ['set', 'library', at(9)],
    ['read', 'market', at(3)],
    ['read', 'airport', at(11)],
    ['set', 'temple', at(5)],
    ['read', 'park', at(8)],
  ],
  2: [
    ['set', 'market', at(4, 30)],
    ['read', 'park', at(7, 30)],
    ['read', 'library', at(2)],
    ['set', 'temple', at(10, 30)],
    ['read', 'airport', at(12, 30)],
    ['read', 'market', at(5, 30)],
    ['set', 'library', at(8, 30)],
  ],
  // Every set of five holds all three gaps. 4:30 + half an hour lands on an
  // o'clock; 9:45 + half an hour and 11:30 + two hours carry the short hand
  // past a number (and past 12), where copying Now's long hand stops working.
  3: [
    ['later', 'park', at(3), 60],
    ['later', 'temple', at(4, 30), 30],
    ['later', 'library', at(7, 15), 60],
    ['later', 'market', at(11, 30), 120],
    ['later', 'airport', at(9, 45), 30],
    ['later', 'park', at(12, 45), 60],
    ['later', 'temple', at(6, 30), 120],
  ],
};

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = ((index % 7) + 7) % 7;
  const [task, place, time, gap = 60] = TABLE[level][k];
  if (task === 'later') return { task, place, target: norm(time + gap), now: time, gap, step: 15 };
  return { task, place, target: time, now: null, gap: null, step: 30 };
}

function prompt(round: Round): string {
  const where = `the ${PLACE_NAME[round.place].toLowerCase()}`;
  if (round.task === 'set') return `We leave for ${where} at ${spoken(round.target)}. Set the clock.`;
  if (round.task === 'read') return `When do we leave for ${where}? Read the clock.`;
  return `We leave for ${where} in ${GAP_WORDS[round.gap ?? 60]}. Set the clock.`;
}

/** Turn the long hand by `presses` steps. The clock is geared: the short hand follows. */
export const turnLong = (t: number, presses: number, step: number) => norm(t + presses * step);
/** Read mode: the minutes he reports wrap inside the hour he reports, without carrying. */
export const readMinutes = (t: number, presses: number, step: number) =>
  norm(t - minuteOf(t) + ((((minuteOf(t) + presses * step) % 60) + 60) % 60));
/** Either stepper's hour button: one hour on or back. */
export const turnHour = (t: number, presses: number) => norm(t + presses * 60);

/** "1 hour", "45 minutes", "2 hours 15 minutes". */
function span(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hs = h === 0 ? '' : `${h} ${h === 1 ? 'hour' : 'hours'}`;
  const ms = m === 0 ? '' : `${m} minutes`;
  return [hs, ms].filter(Boolean).join(' ') || 'no time';
}

/** Where his clock sits against Now, on a 12-hour face: the nearer way round. */
export function againstNow(now: number, t: number): string {
  const d = norm(t - now);
  if (d === 0) return 'the same time as Now';
  return d <= 360 ? `${span(d)} after Now` : `${span(DAY - d)} before Now`;
}

/** Each hand of a time, as a fact: "the short hand on 4, the long hand on 12". */
const hands = (t: number) => `the short hand ${shortAt(t)}, the long hand on ${longOn(t)}`;

function check(round: Round, answer: Answer): Verdict {
  const t = norm(answer);
  if (t === round.target) return { ok: true };
  if (round.task === 'set') return { ok: false, hint: `Your clock says ${spoken(t)}: ${hands(t)}.` };
  if (round.task === 'read') return { ok: false, hint: `The dashed hands show ${digital(t)}: ${hands(t)}.` };
  const now = round.now ?? 0;
  const gap = norm(t - now);
  const near = gap <= 180 || gap >= DAY - 180;
  return { ok: false, hint: `Now says ${digital(now)}. Your clock says ${digital(t)}${near ? `: ${againstNow(now, t)}` : ''}.` };
}

function explain(round: Round): string {
  const t = round.target;
  const h = hourOf(t);
  if (round.task === 'later') {
    const now = round.now ?? 0;
    const gap = round.gap ?? 60;
    const lead = `${GAP_WORDS[gap].replace(/^./, (c) => c.toUpperCase())} after ${spoken(now)} is ${spoken(t)}.`;
    if (gap === 30) return `${lead} The long hand went half way round, from ${longOn(now)} to ${longOn(t)}: 30 minutes.`;
    if (gap === 120) return `${lead} The long hand went round twice, back to ${longOn(t)}; the short hand moved on two numbers.`;
    return `${lead} The long hand went once round, back to ${longOn(t)}; the short hand moved on one number.`;
  }
  if (minuteOf(t) === 0) {
    return `${h} o'clock: the short hand is on ${h}, the hour. The long hand is on 12: the hour has just begun.`;
  }
  return `Half past ${h}: the short hand is half way from ${h} to ${after(h)}. The long hand is on 6, half way round: 30 minutes.`;
}

/* ------------------------------------------------------------ drawing --- */

const INK = '#24170F';
const SOFT = '#5A4636';
const FACE = '#FFFDF7';
/** His clock's rim. Fixed clocks get a plain one, so only the clock he turns is gold. */
const RIM = '#C9962B';
const FIXED_RIM = '#D8CCB6';
/** The short hand: hours. Dark enough to be text on the board tint as well. */
const SHORT = '#B83A0B';
/** The long hand: minutes. */
const LONG = '#1C4FA0';
/** Evidence marks: the hour the short hand is in (orange), the minutes swept (blue). */
const SLICE = '#F07A13';
const SWEEP = '#2F86EB';

const font = { fontFamily: 'var(--font-display)', fontWeight: 700 } as const;

const r2 = (n: number) => Math.round(n * 100) / 100;

/** The point `r` from (cx, cy) at `deg` degrees clockwise from 12. */
function polar(cx: number, cy: number, r: number, deg: number): readonly [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r2(cx + r * Math.sin(a)), r2(cy - r * Math.cos(a))];
}

/** A pie slice from `a0` to `a1` degrees, clockwise from 12. */
function sector(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
}

/** The long hand turns with the minutes alone; the short hand with the whole time (half a degree a minute). */
const longDeg = (t: number) => minuteOf(t) * 6;
const shortDeg = (t: number) => norm(t) / 2;

function Hands({ cx, cy, r, t, dashed }: { cx: number; cy: number; r: number; t: number; dashed: boolean }) {
  const [sx, sy] = polar(cx, cy, r * 0.5, shortDeg(t));
  const [lx, ly] = polar(cx, cy, r * 0.8, longDeg(t));
  const dash = dashed ? `${r2(r * 0.07)} ${r2(r * 0.06)}` : undefined;
  const cap = dashed ? ('butt' as const) : ('round' as const);
  return (
    <g opacity={dashed ? 0.8 : 1}>
      <line x1={cx} y1={cy} x2={lx} y2={ly} stroke={LONG} strokeWidth={r2(r * 0.045)} strokeLinecap={cap} strokeDasharray={dash} />
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={SHORT} strokeWidth={r2(r * 0.085)} strokeLinecap={cap} strokeDasharray={dash} />
    </g>
  );
}

interface ClockProps {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  /** The time the solid hands show. */
  readonly t: number;
  /** Shade the hour the short hand is in, and the minutes the long hand has swept. */
  readonly marks?: boolean;
  /** A second time, drawn as dashed hands. */
  readonly ghost?: number | null;
  /** Dashed hands over the solid ones (his reading) or under them (where Now was). */
  readonly ghostOnTop?: boolean;
  /** A clock to look at, not to set: plain rim. */
  readonly fixed?: boolean;
}

/** A wall clock with all sixty minute ticks and the twelve hour numerals. */
function Clock({ cx, cy, r, t, marks = false, ghost = null, ghostOnTop = false, fixed = false }: ClockProps) {
  const h = hourOf(t) % 12;
  const m = minuteOf(t);
  const ghostHands = ghost === null ? null : <Hands cx={cx} cy={cy} r={r} t={ghost} dashed />;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 9} fill={fixed ? FIXED_RIM : RIM} stroke={INK} strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r} fill={FACE} stroke={INK} strokeWidth="3" />
      {marks && m > 0 ? <path d={sector(cx, cy, r * 0.95, 0, m * 6)} fill={SWEEP} opacity="0.26" /> : null}
      {marks ? <path d={sector(cx, cy, r * 0.66, h * 30, h * 30 + 30)} fill={SLICE} opacity="0.42" /> : null}
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0;
        const [x1, y1] = polar(cx, cy, r * (big ? 0.86 : 0.91), i * 6);
        const [x2, y2] = polar(cx, cy, r * 0.96, i * 6);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={big ? INK : SOFT} strokeWidth={big ? 3.5 : 1.5} />;
      })}
      {ghostOnTop ? null : ghostHands}
      <Hands cx={cx} cy={cy} r={r} t={t} dashed={false} />
      {ghostOnTop ? ghostHands : null}
      {/* Numerals over the hands, haloed in the face colour, so the long hand never hides the number it points at. */}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const size = r2(r * 0.17);
        const [x, y] = polar(cx, cy, r * 0.73, n * 30);
        return (
          <text key={n} x={x} y={r2(y + size * 0.36)} textAnchor="middle" fontSize={size} fill={INK} stroke={FACE}
            strokeWidth={r2(r * 0.045)} paintOrder="stroke" strokeLinejoin="round" style={font}>
            {n}
          </text>
        );
      })}
      <circle cx={cx} cy={cy} r={r2(r * 0.065)} fill={INK} />
      <circle cx={cx} cy={cy} r={r2(r * 0.025)} fill={RIM} />
    </g>
  );
}

/** "Short hand between 7 and 8: the hour is 7." — the two facts the worked frame writes out. */
function shortLine(t: number): string {
  const h = hourOf(t);
  return minuteOf(t) === 0 ? `Short hand on ${h}: the hour is ${h}.` : `Short hand past ${h}, not yet ${after(h)}: the hour is ${h}.`;
}
function longLine(t: number): string {
  const m = minuteOf(t);
  return m === 0 ? 'Long hand on 12: 0 minutes past.' : `Long hand ${SHARE[m]}: ${m} minutes past.`;
}

/* ------------------------------------------------- words on the board --- */

type Stage = BoardProps<Round, Answer>['stage'];

/**
 * The caption under the board on a hint, one sentence per entry. Level 3
 * writes his own clock's time into it: `his` is that time, or null to leave
 * that sentence out (read-aloud may not depend on his answer, and the hint
 * line over the board says the same time).
 */
function hintCaption(round: Round, his: number | null): readonly string[] {
  if (round.task !== 'later') return ['Orange: the hour the short hand is in.', 'Blue: the minutes the long hand has swept.'];
  return [
    `Now ${digital(round.now ?? 0)}.`,
    ...(his === null ? [] : [`Your clock ${digital(his)}.`]),
    'Dashed hands: where Now is.',
    'Orange: the hour.',
    'Blue: the minutes.',
  ];
}

/** The worked caption, one sentence per entry: the jump from Now (level 3), the time in numbers and words, then each hand. */
function workedCaption(round: Round): readonly string[] {
  const t = round.target;
  return [
    ...(round.task === 'later' ? [`Now ${digital(round.now ?? 0)}, ${GAP_WORDS[round.gap ?? 60]} later ${digital(t)}.`] : []),
    `${digital(t)} is ${spoken(t)}.`,
    shortLine(t),
    longLine(t),
  ];
}

/**
 * Read-aloud: the board's words a non-reader needs, in screen order. Only its
 * two captions: the hint caption at 'hint' (less his own clock's time) and the
 * worked caption at 'worked'. The place sign, the Now / We-leave tags, the gap
 * words under the arrow and the stepper labels name what the picture and the
 * prompt already give; the numerals and his reading are numbers.
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  if (stage === 'hint') return hintCaption(round, null);
  if (stage === 'worked') return workedCaption(round);
  return [];
}

/**
 * Every time his clock can show. Both steppers always take a press and wrap
 * round the face, one in hours and one in `step` minutes, and every answer
 * starts at 12:00: so every multiple of `step` round the face, and no other.
 */
const reachable = (round: Round): readonly Answer[] => Array.from({ length: DAY / round.step }, (_, i) => i * round.step);

/** Read-aloud: every hint check() gives on this round, over every time his clock can show. */
function hints(round: Round): readonly string[] {
  return [...new Set(reachable(round).flatMap((t) => check(round, t).hint ?? []))];
}

/** A caption as the board writes it: one line, its sentences a space apart, each in its own span. */
function Caption({ lines }: { readonly lines: readonly string[] }) {
  return (
    <p className="board-caption">
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i ? ' ' : null}
          <span>{line}</span>
        </Fragment>
      ))}
    </p>
  );
}

interface PieProps {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  /** Equal wedges the face is cut into, from 12. */
  readonly parts: number;
  /** How many wedges, from 12 clockwise, are shaded. */
  readonly filled: number;
  /** Shade colour: SWEEP for the long hand's minutes, SLICE for the short hand's hours. */
  readonly fill?: string;
  /** Which hand points at the end of the shaded wedges. */
  readonly hand: 'long' | 'short';
}

/**
 * A turn of one hand as countable pieces: a small face cut into equal wedges,
 * the first `filled` shaded, the hand pointing where the shading ends — the
 * same marks the big clock gets on a hint. Cut into 60/step wedges, one wedge
 * is one press of the minute stepper and a whole face is one hour.
 */
function Pie({ cx, cy, r, parts, filled, fill = SWEEP, hand }: PieProps) {
  const each = 360 / parts;
  const long = hand === 'long';
  const [hx, hy] = polar(cx, cy, r * (long ? 0.86 : 0.6), filled * each);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={FACE} />
      {Array.from({ length: filled }, (_, i) => (
        <path key={i} d={sector(cx, cy, r, i * each, (i + 1) * each)} fill={fill} fillOpacity="0.55" />
      ))}
      {Array.from({ length: parts }, (_, i) => {
        const [x, y] = polar(cx, cy, r, i * each);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={INK} strokeWidth={r2(Math.max(1, r * 0.05))} />;
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth={r2(Math.max(2, r * 0.08))} />
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={long ? LONG : SHORT} strokeWidth={r2(r * (long ? 0.12 : 0.2))} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r2(r * 0.12)} fill={INK} />
    </g>
  );
}

/** `mins` of long-hand travel as a row of pies: one whole pie per hour, then the part hour. */
function PieRow({ cx, cy, r, mins, step }: { cx: number; cy: number; r: number; mins: number; step: number }) {
  const parts = 60 / step;
  const wedges = Math.round(mins / step);
  const count = Math.max(1, Math.ceil(wedges / parts));
  const pitch = r * 2.5;
  const x0 = cx - ((count - 1) * pitch) / 2;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <Pie key={i} cx={r2(x0 + i * pitch)} cy={cy} r={r} parts={parts} filled={Math.min(parts, wedges - i * parts)} hand="long" />
      ))}
    </g>
  );
}

/**
 * Under the hour stepper, always on the board: one whole turn of the long hand
 * (a full blue face) is the short hand moving on one number (one orange slice
 * of twelve). The gearing behind every clock he sets or reads, drawn rather
 * than said.
 */
function HourKey({ step }: { step: number }) {
  return (
    <svg width="120" height="52" viewBox="0 0 120 52" role="img" aria-label="One whole turn of the long hand is one number for the short hand">
      <Pie cx={25} cy={26} r={22} parts={60 / step} filled={60 / step} hand="long" />
      <line x1="53" y1="21" x2="67" y2="21" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="53" y1="31" x2="67" y2="31" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <Pie cx={95} cy={26} r={22} parts={12} filled={1} fill={SLICE} hand="short" />
    </svg>
  );
}

/** Under the minute stepper, live: the minutes on the stepper as shaded wedges, one wedge a press. */
function MinuteKey({ minutes, step }: { minutes: number; step: number }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <Pie cx={32} cy={32} r={29} parts={60 / step} filled={minutes / step} hand="long" />
    </svg>
  );
}

/** The gap as long-hand turns, for the screen-reader label (the pies say it to the eye). */
const GAP_TURNS: Record<Gap, string> = { 30: 'half a turn', 60: 'one whole turn', 120: 'two whole turns' };

/** Thick ground line shared by every destination picture. */
function Ground({ fill }: { fill: string }) {
  return <rect x="0" y="196" width="260" height="24" rx="6" fill={fill} stroke={INK} strokeWidth="3" />;
}

/** The five destinations, each drawn in a 260 x 220 box. Static pictures; nothing moves. */
function PlacePicture({ place }: { place: Place }): ReactNode {
  switch (place) {
    case 'park':
      return (
        <g>
          <Ground fill="#7DBB52" />
          <rect x="52" y="104" width="22" height="94" fill="#7A4A21" stroke={INK} strokeWidth="3" />
          <circle cx="63" cy="78" r="56" fill="#2E8B3A" stroke={INK} strokeWidth="3" />
          <circle cx="40" cy="62" r="22" fill="#3FA34D" />
          <path d="M140 196 L172 70 L204 196 M236 196 L204 70" fill="none" stroke="#A23B1A" strokeWidth="9" strokeLinejoin="round" />
          <line x1="164" y1="70" x2="214" y2="70" stroke="#A23B1A" strokeWidth="10" strokeLinecap="round" />
          <line x1="180" y1="72" x2="180" y2="150" stroke={SOFT} strokeWidth="3" />
          <line x1="204" y1="72" x2="204" y2="150" stroke={SOFT} strokeWidth="3" />
          <rect x="172" y="148" width="40" height="10" rx="3" fill="#F2A900" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'temple':
      return (
        <g>
          <Ground fill="#E7C47E" />
          <rect x="40" y="172" width="180" height="26" fill="#F3E3C3" stroke={INK} strokeWidth="3" />
          <rect x="62" y="110" width="136" height="64" fill="#FBEFD9" stroke={INK} strokeWidth="3" />
          <path d="M80 112 C84 66 104 34 130 20 C156 34 176 66 180 112 Z" fill="#F6D7A6" stroke={INK} strokeWidth="3" />
          <path d="M96 112 C100 76 114 52 130 40 M164 112 C160 76 146 52 130 40" fill="none" stroke="#C9962B" strokeWidth="2.5" />
          <circle cx="130" cy="18" r="7" fill="#C9962B" stroke={INK} strokeWidth="2.5" />
          <line x1="130" y1="12" x2="130" y2="-14" stroke={INK} strokeWidth="3" />
          <path d="M130 -14 L160 -6 L130 2 Z" fill="#F07A13" stroke={INK} strokeWidth="2" />
          <path d="M112 174 V138 A18 18 0 0 1 148 138 V174 Z" fill="#7A4A21" stroke={INK} strokeWidth="3" />
          <path d="M70 120 h120" stroke="#D9480F" strokeWidth="4" strokeDasharray="8 6" />
        </g>
      );
    case 'library':
      return (
        <g>
          <Ground fill="#BFB7A8" />
          <path d="M20 70 L130 18 L240 70 Z" fill="#E9E1D2" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <rect x="28" y="70" width="204" height="14" fill="#D8CCB6" stroke={INK} strokeWidth="3" />
          {[48, 92, 150, 194].map((x) => (
            <rect key={x} x={x} y="84" width="18" height="96" fill="#F5F0E6" stroke={INK} strokeWidth="2.5" />
          ))}
          <rect x="112" y="118" width="36" height="62" fill="#1C4FA0" stroke={INK} strokeWidth="3" />
          <rect x="20" y="180" width="220" height="16" fill="#D8CCB6" stroke={INK} strokeWidth="3" />
          {['#D9480F', '#0F8A6B', '#F2A900', '#B5179E'].map((c, i) => (
            <rect key={c} x={112 + i * 10} y="40" width="8" height="24" fill={c} stroke={INK} strokeWidth="1.5" />
          ))}
        </g>
      );
    case 'market':
      return (
        <g>
          <Ground fill="#D4A85A" />
          <line x1="34" y1="44" x2="34" y2="198" stroke="#7A4A21" strokeWidth="8" />
          <line x1="226" y1="44" x2="226" y2="198" stroke="#7A4A21" strokeWidth="8" />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${20 + i * 37} 40 h37 v34 q-18.5 14 -37 0 z`} fill={i % 2 ? '#FFF1C9' : '#D9480F'} stroke={INK} strokeWidth="2.5" />
          ))}
          <rect x="24" y="132" width="212" height="22" fill="#A0652B" stroke={INK} strokeWidth="3" />
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse key={i} cx={52 + i * 22} cy={120} rx="12" ry="14" fill="#F5A623" stroke={INK} strokeWidth="2.5" />
          ))}
          <path d="M168 128 C170 106 188 96 214 100 C196 106 184 116 182 128 Z" fill="#F2D02E" stroke={INK} strokeWidth="2.5" />
          <path d="M178 128 C182 110 198 102 222 108 C204 112 194 120 192 128 Z" fill="#F2D02E" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'airport':
      return (
        <g>
          <Ground fill="#9AA0A6" />
          <rect x="30" y="70" width="34" height="128" fill="#E3E6EA" stroke={INK} strokeWidth="3" />
          <path d="M14 70 L80 70 L72 36 L22 36 Z" fill="#7FB7E8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="28" width="58" height="10" fill="#5A6470" stroke={INK} strokeWidth="2.5" />
          <path d="M102 168 L238 158 C250 157 252 170 240 172 L104 182 C96 182 94 170 102 168 Z" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
          <path d="M150 166 L176 128 L192 128 L180 164 Z" fill="#1C6DD0" stroke={INK} strokeWidth="2.5" />
          <path d="M112 168 L104 140 L118 140 L128 167 Z" fill="#1C6DD0" stroke={INK} strokeWidth="2.5" />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={196 + i * 10} cy={164} r="2.5" fill={SOFT} />
          ))}
          <line x1="40" y1="208" x2="250" y2="208" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="18 12" />
        </g>
      );
  }
}

/** The destination with its sign, scaled into a box at (x, y). */
function Destination({ place, x, y, s }: { place: Place; x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <PlacePicture place={place} />
      <rect x="40" y="232" width="180" height="46" rx="10" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <text x="130" y="265" textAnchor="middle" fontSize="28" fill={INK} style={font}>
        {PLACE_NAME[place]}
      </text>
    </g>
  );
}

/** Which time a clock stands for: the time we go out of the door, or Now, still at home. */
type Moment = 'leave' | 'now';

const MOMENT_WORD: Record<Moment, string> = { leave: 'We leave', now: 'Now' };
/** The word's drawn width at 26px, so icon and word centre as one row. */
const MOMENT_W: Record<Moment, number> = { leave: 106, now: 50 };

/** A door with an arrow coming out of it (we leave), or a house (Now, at home), in a 44 x 44 box. */
function MomentIcon({ moment }: { moment: Moment }) {
  if (moment === 'leave') {
    return (
      <g>
        <rect x="2" y="2" width="26" height="40" rx="2" fill="#7A4A21" stroke={INK} strokeWidth="3" />
        <circle cx="22" cy="23" r="2.5" fill={RIM} />
        <line x1="12" y1="22" x2="36" y2="22" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M33 13 L44 22 L33 31 Z" fill={INK} />
      </g>
    );
  }
  return (
    <g>
      <path d="M2 20 L22 3 L42 20 V42 H2 Z" fill="#FBEFD9" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="16" y="26" width="12" height="16" fill="#7A4A21" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** Icon and word as one row centred on (cx, cy). */
function MomentTag({ cx, cy, moment }: { cx: number; cy: number; moment: Moment }) {
  const x0 = r2(cx - (44 + 10 + MOMENT_W[moment]) / 2);
  return (
    <g>
      <g transform={`translate(${x0} ${cy - 22})`}>
        <MomentIcon moment={moment} />
      </g>
      <text x={x0 + 54} y={cy + 9} fontSize="26" fill={SOFT} style={font}>
        {MOMENT_WORD[moment]}
      </text>
    </g>
  );
}

/**
 * A clock to look at, never to set: a dashed card with its tag on top. Dashed
 * and plain-rimmed, it reads as a picture, not as the gold clock the steppers
 * turn.
 */
function FixedClock({ x, y, w, h, moment, clock }: { x: number; y: number; w: number; h: number; moment: Moment; clock: Omit<ClockProps, 'fixed'> }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="18" fill="#F7F2E8" stroke={SOFT} strokeWidth="3" strokeDasharray="12 8" />
      <MomentTag cx={x + w / 2} cy={y + 36} moment={moment} />
      <Clock {...clock} fixed />
    </g>
  );
}

/* ------------------------------------------------------------- board ---- */

const W = 960;
const H = 380;

const keyStyle = (colour: string): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--s2)',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  color: colour,
});

const subStyle: CSSProperties = { fontFamily: 'var(--font-read)', fontWeight: 400, fontSize: 'var(--t-sm)', color: SOFT };

/** A hand drawn small beside its stepper, so the button and the hand it turns read as one thing. */
function HandIcon({ colour, long }: { colour: string; long: boolean }) {
  return (
    <svg width="72" height="28" viewBox="0 0 72 28" aria-hidden="true">
      <circle cx="10" cy="14" r="6" fill={INK} />
      <line x1="10" y1="14" x2={long ? 66 : 44} y2="14" stroke={colour} strokeWidth={long ? 5 : 9} strokeLinecap="round" />
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const worked = stage === 'worked';
  const evidence = stage !== 'answering';
  /** What the steppers and his clock show: on 'worked', the solution. */
  const shown = worked ? round.target : norm(answer);
  const now = round.now ?? 0;

  const setHour = (dir: number) => setAnswer(turnHour(norm(answer), dir));
  const setMinute = (dir: number) =>
    setAnswer(round.task === 'read' ? readMinutes(norm(answer), dir, round.step) : turnLong(norm(answer), dir, round.step));

  let picture: ReactNode;
  let label: string;
  if (round.task === 'later') {
    const gap = round.gap ?? 60;
    // The gap is drawn as long-hand turns on the arrow: half a face, one whole
    // face, two whole faces, cut into one wedge per minute-stepper press. The
    // words stay underneath, small; "half an hour" is too wide for one line.
    const gapLines = gap === 30 ? ['half', 'an hour'] : [gap === 60 ? '1 hour' : '2 hours'];
    // On a hint, his own clock's travel from Now in the same pies, under the
    // arrow, so the two amounts sit side by side. Only forward and only up to
    // three hours: further than that is not a near miss worth counting.
    const his = norm(norm(answer) - now);
    const hisPies = stage === 'hint' && his <= 180;
    // Hand positions, not the time: the label must not read the Now clock for him.
    label = `Now clock, at home: ${hands(now)}. On the arrow, ${GAP_TURNS[gap]} of the long hand. Your We-leave clock says ${spoken(shown)}.`;
    picture = (
      <>
        <Destination place={round.place} x={12} y={70} s={0.8} />
        <FixedClock x={256} y={8} w={248} h={335} moment="now" clock={{ cx: 380, cy: 205, r: 105, t: now }} />
        <PieRow cx={570} cy={112} r={22} mins={gap} step={round.step} />
        {gapLines.map((line, i) => (
          <text key={line} x="570" y={160 + i * 20} textAnchor="middle" fontSize="18" fill={SOFT} style={font}>
            {line}
          </text>
        ))}
        <line x1="522" y1="205" x2="608" y2="205" stroke={SOFT} strokeWidth="5" />
        <path d="M606 193 L624 205 L606 217 Z" fill={SOFT} />
        {hisPies ? (
          <>
            <PieRow cx={570} cy={268} r={16} mins={his} step={round.step} />
            <text x="570" y="306" textAnchor="middle" fontSize="18" fill={SOFT} style={font}>your clock</text>
          </>
        ) : null}
        <MomentTag cx={790} cy={44} moment="leave" />
        <Clock cx={790} cy={215} r={130} t={shown} marks={evidence} ghost={evidence ? now : null} />
      </>
    );
  } else if (round.task === 'read') {
    const his = norm(answer);
    label = `We-leave clock: ${hands(round.target)}.${stage === 'hint' ? ` Dashed hands show your ${digital(his)}.` : ''}`;
    picture = (
      <>
        <Destination place={round.place} x={60} y={64} s={0.95} />
        <FixedClock
          x={430}
          y={8}
          w={380}
          h={357}
          moment="leave"
          clock={{ cx: 620, cy: 212, r: 130, t: round.target, marks: evidence, ghost: stage === 'hint' ? his : null, ghostOnTop: true }}
        />
      </>
    );
  } else {
    // The leaving time drawn, not only said: a smaller fixed clock beside the
    // place, so a child who cannot read the prompt still sees what to make.
    // The prompt already says this time in words, so the label may too; it
    // gives the time, not the hand positions, which would be the answer.
    label = `We-leave clock: ${spoken(round.target)}. Your clock says ${spoken(shown)}.`;
    picture = (
      <>
        <Destination place={round.place} x={12} y={70} s={0.8} />
        <FixedClock x={250} y={8} w={250} h={322} moment="leave" clock={{ cx: 375, cy: 200, r: 105, t: round.target, marks: evidence }} />
        <Clock cx={725} cy={200} r={150} t={shown} marks={evidence} />
      </>
    );
  }

  const reading = round.task === 'read';
  // Both steppers count in the hand's own unit: hours, and minutes past the
  // hour. Setting, the clock is geared, so 30 minutes more at 4:30 makes 5:00
  // and the hour stepper moves too. Reading, they are two separate numbers.
  const hourLabel = reading ? 'Hour' : 'Short hand: hour';
  const minuteLabel = reading ? 'Minutes' : 'Long hand: minutes';
  const minuteValue = minuteOf(shown);

  return (
    <div className="board">
      <svg className="board-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {picture}
      </svg>
      <div className="board-row" style={{ gap: 'var(--s6)' }}>
        <div style={keyStyle(SHORT)}>
          <HandIcon colour={SHORT} long={false} />
          <span>{hourLabel}</span>
          <Stepper
            value={hourOf(shown)}
            min={0}
            max={13}
            label={`${hourLabel}, 1 hour a press`}
            disabled={locked}
            onChange={(n) => setHour(n > hourOf(shown) ? 1 : -1)}
          />
          <span style={subStyle}>1 hour a press</span>
          <HourKey step={round.step} />
        </div>
        {reading ? (
          <p className="board-caption" style={{ fontSize: 'var(--t-xl)', fontWeight: 700, color: INK }} aria-label={`Your reading: ${digital(shown)}`}>
            {digital(shown)}
          </p>
        ) : null}
        <div style={keyStyle(LONG)}>
          <HandIcon colour={LONG} long />
          <span>{minuteLabel}</span>
          <Stepper
            value={minuteValue}
            min={-1}
            max={61}
            label={`${minuteLabel}, ${round.step} minutes a press`}
            disabled={locked}
            onChange={(n) => setMinute(n > minuteValue ? 1 : -1)}
          />
          <span style={subStyle}>{round.step} minutes a press</span>
          <MinuteKey minutes={minuteValue} step={round.step} />
        </div>
      </div>
      {stage === 'hint' ? <Caption lines={hintCaption(round, norm(answer))} /> : null}
      {worked ? <Caption lines={workedCaption(round)} /> : null}
    </div>
  );
}

export const whenDoWeLeave: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'when-do-we-leave',
  title: 'When Do We Leave?',
  hook: 'Two hands, two different jobs.',
  group: 'measure',
  levels: ["O'clock", 'Half past', 'Later than now'],
  generate,
  prompt,
  emptyAnswer: () => 0,
  Board,
  board,
  check,
  hints,
  explain,
  cover: 'art/games/when-do-we-leave.png',
  note: {
    what: 'A wall clock and a place the family is going. He sets the clock with two steppers, one for each hand, or reads a fixed clock into an hour and minutes. On level 3 he sets the leaving clock half an hour, one hour or two hours after a fixed Now clock.',
    expect: "Setting a half-past clock, he will likely get the hour and leave the long hand on 12. Reading, he may swap the hands: 6 o'clock entered as 12:30, because the short hand sits where a long hand points at half past. At half past, the short hand sits between two numbers and he may give the later one: 12:30 read as 1:30 is the classic. On level 3 he will move the short hand one number whatever the gap, so half an hour after 4:30 comes out as 5:30, not 5:00.",
    practising: 'That the two hands measure different units: the short hand names the hour we are in, the long hand shows how far round that hour has gone. Then half an hour as half a turn of the long hand, one hour as one full turn, and two hours as two.',
    ask: "When the half-past clock first appears, point at the short hand: 'It is past 7 but not yet 8. Which hour are we in?'",
    next: "Before the next real outing, show him the kitchen clock and say when you leave. Let him watch it at o'clock and at half past, and tell you when it is time to put shoes on.",
    honest: 'Setting these clocks does not mean he can tell the time from any clock, at any minute, or work out how long something takes. It covers whole hours, half hours, and jumps of half an hour, one hour and two hours from quarter-hour times, on a clear face with every minute marked.',
    easier: 'Stay on level 1. Before he presses anything, have him put a finger on the short hand and say the number it points at; on the reading clocks, that number is the hour.',
    harder: "On level 3, cover the We-leave clock with your hand and ask where the long hand will point before he presses anything; then ask the same for three hours later.",
  },
};

export default whenDoWeLeave;
