import type { ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Which One Lands First? — gravity pulls; air changes falling.
 *
 * Concept (advisor, physics 3): gravity and air resistance are different
 * influences. Two compact things of very different weight, let go together
 * from a low height, land together. The same paper flat and crumpled weighs
 * the same and does not land together: air, not weight, makes the difference.
 * The misconception it fixes: "heavier things always fall faster".
 *
 * Shape: predict (tap-to-choose: this one first / together / that one first)
 * → Try → the instant the first one touches the floor, drawn in the same frame
 * and scale as the setup, faint outlines where both started → why.
 *
 * Nothing on the board needs reading. Each guess button is a picture of its
 * outcome (the floor, with whichever lands first already down on it), its
 * words small underneath. Tapping one marks on the scene, in gold, the floor
 * spot the child says is reached first, so the guess is visible where the drop
 * happens and sits beside the result after Try. Under the scene both things sit
 * on a pan balance that tips to the heavier side or hangs level, so heavier,
 * lighter and "the same weight" are seen, not read; the grams stay as small
 * labels for the grown-up.
 *
 * Levels (one idea per round, never two):
 *  1. Same-sized balls, heavy against light, from 50 or 100 cm. Together.
 *  2. The same paper flat against crumpled. Same grams; the crumpled one lands
 *     while the flat one is still well off the floor.
 *  3. Sort new setups by cause: a full and an empty bottle, a block and a toy
 *     dinosaur, a two-page paper ball and a one-page one (together); a hanky
 *     open and scrunched; twice a light crumpled thing against a heavier flat
 *     one, where the LIGHTER one lands first; and once a flat card sheet
 *     against a flat page of the same size, where the HEAVIER one does, so
 *     "weight never matters" cannot replace "heavy always wins".
 *
 * The outcome is a drawn model of a real drop and says so. Where one lags, its
 * height is an estimate for the instant the compact one lands from 1 m (about
 * half a second), from v_t = sqrt(2mg / (rho * Cd * A)) with Cd ~1.2 for a
 * level sheet: a 5 g A4 page settles near 1 m/s (~60 cm still to go), a 6 g
 * tabloid newspaper page ~0.8 m/s (~65 cm), a 3 g napkin ~0.6 m/s (~75 cm), a
 * 8 g cotton hanky ~1.1 m/s (~60 cm); a 19 g A4 card sheet (300 gsm) settles
 * near 2 m/s and lands from 1 m in ~0.64 s, when the 5 g page still has ~40 cm
 * to go. Real sheets flutter and slide sideways;
 * the drawing keeps them level. "Together" pairs land within about 1 cm and 4
 * thousandths of a second of each other (ping-pong against golf ball is the
 * widest; most are under 3 mm), too close to see or hear apart; the
 * ping-pong, bottle, dinosaur and paper-ball pairs drop from 50 cm to keep
 * the gap that small. Heights are drawn to the ruler's scale
 * (2.6 px per cm); the things are drawn larger, at 4.5 px per cm, so a golf
 * ball can be seen, and all at that one scale, so their sizes compare truly.
 * No food is dropped.
 */

type Thing =
  | 'cricket'
  | 'tennis'
  | 'golf'
  | 'ping-pong'
  | 'clay'
  | 'wood-ball'
  | 'page-flat'
  | 'page-crumpled'
  | 'news-flat'
  | 'news-crumpled'
  | 'two-page-ball'
  | 'napkin-flat'
  | 'napkin-crumpled'
  | 'bottle-full'
  | 'bottle-empty'
  | 'block'
  | 'dino'
  | 'hanky-open'
  | 'hanky-ball'
  | 'card-flat';

type Lands = 'left' | 'together' | 'right';

export interface Round {
  readonly left: Thing;
  readonly right: Thing;
  /** Drop height in centimetres, measured to the bottom of each thing. */
  readonly height: 50 | 100;
  readonly lands: Lands;
  /** Height in cm of the slower one at the instant the first one lands. */
  readonly behind?: number;
  /** The evidence shown under the before/after pair. */
  readonly why: string;
}

export type Answer = Lands | null;

/** Child-facing name, weight in grams, and size across in centimetres. */
const INFO: Record<Thing, { readonly name: string; readonly grams: number; readonly across: number }> = {
  cricket: { name: 'cricket ball', grams: 160, across: 7 },
  tennis: { name: 'tennis ball', grams: 58, across: 7 },
  golf: { name: 'golf ball', grams: 46, across: 4 },
  'ping-pong': { name: 'ping-pong ball', grams: 3, across: 4 },
  clay: { name: 'clay ball', grams: 200, across: 6 },
  'wood-ball': { name: 'wooden ball', grams: 75, across: 6 },
  'page-flat': { name: 'flat page', grams: 5, across: 21 },
  'page-crumpled': { name: 'crumpled page', grams: 5, across: 6 },
  'news-flat': { name: 'flat newspaper', grams: 6, across: 28 },
  'news-crumpled': { name: 'crumpled newspaper', grams: 6, across: 7 },
  'two-page-ball': { name: 'two-page ball', grams: 10, across: 8 },
  'napkin-flat': { name: 'flat napkin', grams: 3, across: 33 },
  'napkin-crumpled': { name: 'crumpled napkin', grams: 3, across: 5 },
  'bottle-full': { name: 'full bottle', grams: 265, across: 5.5 },
  'bottle-empty': { name: 'empty bottle', grams: 15, across: 5.5 },
  block: { name: 'wooden block', grams: 120, across: 6 },
  dino: { name: 'toy dinosaur', grams: 40, across: 10 },
  'hanky-open': { name: 'open hanky', grams: 8, across: 30 },
  'hanky-ball': { name: 'scrunched hanky', grams: 8, across: 5 },
  'card-flat': { name: 'flat card sheet', grams: 19, across: 21 },
};

const name = (t: Thing) => INFO[t].name;
const grams = (t: Thing) => INFO[t].grams;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const across = (t: Thing) => INFO[t].across;
const heavier = (a: Thing, b: Thing): readonly [Thing, Thing] => (grams(a) >= grams(b) ? [a, b] : [b, a]);

/** Two compact balls of very different weight: they land together. */
function balls(left: Thing, right: Thing, height: 50 | 100): Round {
  const [h, l] = heavier(left, right);
  return {
    left,
    right,
    height,
    lands: 'together',
    why: `The ${name(h)} weighs ${grams(h)} g and the ${name(l)} only ${grams(l)} g, yet they landed together. Gravity speeds up heavy and light things alike. From this low height, small round things barely feel the air.`,
  };
}

/** The same paper, flat against crumpled: the crumpled one lands first. */
function paper(left: Thing, right: Thing, behind: number, pair: string): Round {
  return {
    left,
    right,
    height: 100,
    lands: left.endsWith('-flat') ? 'right' : 'left',
    behind,
    why: `${pair}, ${grams(left)} g each. Flat, one must push a wide patch of air out of its way, so it drifts down. Crumpled, the other slips through. Only the shape was different.`,
  };
}

const L1: readonly Round[] = [
  balls('cricket', 'tennis', 100),
  balls('ping-pong', 'golf', 50),
  balls('clay', 'wood-ball', 100),
  balls('tennis', 'cricket', 50),
  balls('golf', 'ping-pong', 50),
  balls('wood-ball', 'clay', 50),
];

const L2: readonly Round[] = [
  paper('page-flat', 'page-crumpled', 60, 'Two identical sheets of paper'),
  paper('news-crumpled', 'news-flat', 65, 'Two identical newspaper pages'),
  paper('napkin-flat', 'napkin-crumpled', 75, 'Two identical paper napkins'),
  paper('page-crumpled', 'page-flat', 60, 'Two identical sheets of paper'),
  paper('news-flat', 'news-crumpled', 65, 'Two identical newspaper pages'),
  paper('napkin-crumpled', 'napkin-flat', 75, 'Two identical paper napkins'),
];

/**
 * New setups to sort by cause. Twice the LIGHTER one lands first (shape beats
 * weight); once the HEAVIER one does (same flat shape, so the air holds back
 * the light one more). Sides vary so no position is a pattern.
 */
const L3: readonly Round[] = [
  {
    left: 'bottle-full',
    right: 'bottle-empty',
    height: 50,
    lands: 'together',
    why: 'The full bottle weighs 265 g, the empty one 15 g. Same shape, same size, and they landed together. Weight did not decide, and from this low the air barely slows either.',
  },
  {
    left: 'page-crumpled',
    right: 'hanky-open',
    height: 100,
    lands: 'left',
    behind: 60,
    why: 'The crumpled page weighs 5 g, the open hanky 8 g, and the lighter one landed first. Spread 30 cm wide, the hanky had a big patch of air to push aside.',
  },
  {
    left: 'page-flat',
    right: 'card-flat',
    height: 100,
    lands: 'right',
    behind: 40,
    why: 'Same size, both flat: the card sheet weighs 19 g, the page 5 g. The air pushes back on both, but that push slows the light page far more. When air matters, weight matters too.',
  },
  {
    left: 'dino',
    right: 'block',
    height: 50,
    lands: 'together',
    why: 'The wooden block weighs 120 g, three times as much as the 40 g toy dinosaur, and they landed together. Both are small and solid, so the air hardly holds either back.',
  },
  {
    left: 'page-flat',
    right: 'napkin-crumpled',
    height: 100,
    lands: 'right',
    behind: 60,
    why: 'The flat page weighs 5 g, the crumpled napkin only 3 g, and the lighter one landed first. Spread 21 cm wide, the page had far more air to push aside. Shape, not weight, decided this one.',
  },
  {
    left: 'hanky-open',
    right: 'hanky-ball',
    height: 100,
    lands: 'right',
    behind: 60,
    why: 'Two identical hankies, 8 g each. Spread 30 cm wide, one presses on a lot of air and floats down. Scrunched to 5 cm, the other drops straight.',
  },
  {
    left: 'two-page-ball',
    right: 'page-crumpled',
    height: 50,
    lands: 'together',
    why: 'Two pages crumpled into one ball weigh 10 g; one crumpled page weighs 5 g. Twice the weight, and they landed together. Crumpled small, neither has much air to push aside.',
  },
];

export function generate(level: Level, index: number): Round {
  const set = level === 1 ? L1 : level === 2 ? L2 : L3;
  return set[((index % set.length) + set.length) % set.length];
}

function prompt(round: Round): string {
  return `Dropped together: ${name(round.left)} and ${name(round.right)}. Which lands first?`;
}

/** The Help sentence: a fact about what the board now shows (grams and widths), never the answer. */
function hintFact(round: Round): string {
  const [a, b] = [round.left, round.right];
  if (grams(a) === grams(b)) return `Same weight, ${grams(a)} g each. The ${name(a)} is ${across(a)} cm wide; the ${name(b)} is ${across(b)} cm.`;
  if (across(a) === across(b)) return `Same width, ${across(a)} cm each. The ${name(a)} is ${grams(a)} g; the ${name(b)} is ${grams(b)} g.`;
  return `The ${name(a)} is ${grams(a)} g and ${across(a)} cm wide; the ${name(b)} is ${grams(b)} g and ${across(b)} cm wide.`;
}


/* --------------------------------------------------------------- drawing -- */

/**
 * One frame for setup and outcome: same ruler, same floor, same scale, so the
 * before and after panes compare directly. Heights use the ruler's scale;
 * things use their own larger scale, the same for every thing.
 */
const PX_H = 2.6;
const PX_S = 4.5;
const FLOOR = 350;
const VB_W = 440;
const VB_H = 410;
const X = { left: 180, right: 350 } as const;
type Side = keyof typeof X;
const SIDES: readonly Side[] = ['left', 'right'];
const yAt = (cm: number) => FLOOR - cm * PX_H;
const INK = '#24170f';
const SOFT = '#5a4636';
const GOLD = '#f2a900';
const BRASS = '#b8862b';

const FLAT: readonly Thing[] = ['page-flat', 'news-flat', 'napkin-flat', 'hanky-open', 'card-flat'];
const CRUMPLED: readonly Thing[] = ['page-crumpled', 'news-crumpled', 'two-page-ball', 'napkin-crumpled', 'hanky-ball'];

/** Paper and cloth colours: fill and the line drawn on it. */
const STUFF: Partial<Record<Thing, readonly [string, string]>> = {
  'page-flat': ['#fffdf6', '#6f9fd8'],
  'page-crumpled': ['#fffdf6', '#6f9fd8'],
  'two-page-ball': ['#fffdf6', '#6f9fd8'],
  'news-flat': ['#e9e2d0', '#6b6357'],
  'news-crumpled': ['#e9e2d0', '#6b6357'],
  'napkin-flat': ['#f6d26b', '#c2901a'],
  'napkin-crumpled': ['#f6d26b', '#c2901a'],
  'hanky-open': ['#dbe7f7', '#2f4f9e'],
  'hanky-ball': ['#dbe7f7', '#2f4f9e'],
  'card-flat': ['#f4a259', '#a8541a'],
};

/** A crumpled ball: an uneven ten-point outline with two creases. Origin at its bottom. */
function Crumple({ r, fill, line }: { readonly r: number; readonly fill: string; readonly line: string }) {
  const k = [1, 0.72, 0.95, 0.8, 1, 0.68, 0.92, 0.84, 0.98, 0.7, 0.96, 0.78, 1, 0.74];
  const pts = k
    .map((f, i) => {
      const a = (i / k.length) * Math.PI * 2;
      return `${(Math.cos(a) * r * f).toFixed(1)},${(-r + Math.sin(a) * r * f).toFixed(1)}`;
    })
    .join(' ');
  return (
    <g>
      <polygon points={pts} fill={fill} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M${-r * 0.5} ${-r * 1.55} l${r * 0.4} ${r * 0.5} l${r * 0.1} ${r * 0.6}`} fill="none" stroke={line} strokeWidth="2" />
      <path d={`M${r * 0.55} ${-r * 0.7} l${-r * 0.45} ${r * 0.15}`} fill="none" stroke={line} strokeWidth="2" />
    </g>
  );
}

/** A flat sheet held level, seen a little from above. Origin at its bottom middle. */
function Sheet({ w, fill, line, cloth }: { readonly w: number; readonly fill: string; readonly line: string; readonly cloth: boolean }) {
  const h = 10;
  const s = 8;
  const a = -w / 2;
  const b = w / 2;
  return (
    <g>
      <polygon points={`${a},0 ${b - s},0 ${b},${-h} ${a + s},${-h}`} fill={fill} stroke={cloth ? line : INK} strokeWidth={cloth ? 3 : 2.5} strokeLinejoin="round" />
      <line x1={a + 9} y1={-3.5} x2={b - s - 3} y2={-3.5} stroke={line} strokeWidth="1.5" />
      <line x1={a + s + 3} y1={-6.5} x2={b - 9} y2={-6.5} stroke={line} strokeWidth="1.5" />
    </g>
  );
}

/** A ball seen from the side, origin at its bottom. Each has its own markings. */
function Ball({ t }: { readonly t: Thing }) {
  const r = (across(t) * PX_S) / 2;
  const cy = -r;
  switch (t) {
    case 'cricket':
      return (
        <g>
          <circle cx="0" cy={cy} r={r} fill="#b3261e" stroke={INK} strokeWidth="2.5" />
          <path d={`M${-r * 0.25} ${cy - r * 0.95} q${r * 0.5} ${r * 0.95} 0 ${r * 1.9}`} fill="none" stroke="#f3e3c3" strokeWidth="2" strokeDasharray="2 2" />
          <path d={`M${r * 0.05} ${cy - r * 0.97} q${r * 0.5} ${r * 0.97} 0 ${r * 1.94}`} fill="none" stroke="#f3e3c3" strokeWidth="2" strokeDasharray="2 2" />
        </g>
      );
    case 'tennis':
      return (
        <g>
          <circle cx="0" cy={cy} r={r} fill="#c9e04a" stroke={INK} strokeWidth="2.5" />
          <path d={`M${-r * 0.7} ${cy - r * 0.7} q${r * 0.6} ${r * 0.7} 0 ${r * 1.4}`} fill="none" stroke="#fffdf6" strokeWidth="2.5" />
          <path d={`M${r * 0.7} ${cy - r * 0.7} q${-r * 0.6} ${r * 0.7} 0 ${r * 1.4}`} fill="none" stroke="#fffdf6" strokeWidth="2.5" />
        </g>
      );
    case 'golf':
      return (
        <g>
          <circle cx="0" cy={cy} r={r} fill="#fbfbf5" stroke={INK} strokeWidth="2.5" />
          {[
            [-0.4, -0.3],
            [0.1, -0.45],
            [0.45, -0.05],
            [-0.15, 0.15],
            [0.25, 0.4],
            [-0.5, 0.3],
          ].map(([dx, dy]) => (
            <circle key={`${dx}${dy}`} cx={dx * r} cy={cy + dy * r} r={r * 0.11} fill="#c9c6bb" />
          ))}
        </g>
      );
    case 'ping-pong':
      return (
        <g>
          <circle cx="0" cy={cy} r={r} fill="#ff8a1f" stroke={INK} strokeWidth="2.5" />
          <ellipse cx={-r * 0.35} cy={cy - r * 0.35} rx={r * 0.28} ry={r * 0.18} fill="#ffd2a6" />
        </g>
      );
    case 'clay':
      return (
        <g>
          <circle cx="0" cy={cy} r={r} fill="#c86b4a" stroke={INK} strokeWidth="2.5" />
          <ellipse cx={r * 0.25} cy={cy - r * 0.2} rx={r * 0.32} ry={r * 0.22} fill="none" stroke="#8f4027" strokeWidth="1.8" />
        </g>
      );
    default:
      return (
        <g>
          <circle cx="0" cy={cy} r={r} fill="#d8a24e" stroke={INK} strokeWidth="2.5" />
          <path d={`M${-r * 0.75} ${cy - r * 0.2} q${r * 0.75} ${-r * 0.5} ${r * 1.5} 0`} fill="none" stroke="#9b6a32" strokeWidth="1.8" />
          <path d={`M${-r * 0.6} ${cy + r * 0.3} q${r * 0.6} ${-r * 0.4} ${r * 1.2} 0`} fill="none" stroke="#9b6a32" strokeWidth="1.8" />
        </g>
      );
  }
}

/** A small capped bottle, 5.5 cm across and 16 cm tall; the full one holds water to the shoulder. */
function Bottle({ full }: { readonly full: boolean }) {
  const w = 5.5 * PX_S;
  const h = 16 * PX_S;
  const neck = w * 0.42;
  const body = `M${-w / 2} 0 v${-h * 0.7} q0 ${-h * 0.12} ${(w - neck) / 2} ${-h * 0.16} v${-h * 0.06} h${neck} v${h * 0.06} q${(w - neck) / 2} ${h * 0.04} ${(w - neck) / 2} ${h * 0.16} v${h * 0.7} z`;
  return (
    <g>
      <path d={body} fill={full ? '#eaf4fb' : '#f6fbff'} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {full ? <rect x={-w / 2 + 2.5} y={-h * 0.68} width={w - 5} height={h * 0.68 - 2.5} fill="#5fa3d6" /> : null}
      <rect x={-neck / 2 - 2} y={-h - 2} width={neck + 4} height={h * 0.08} rx="2" fill="#1f6fb2" stroke={INK} strokeWidth="2" />
      {full ? null : <line x1={-w / 2 + 4} y1={-h * 0.5} x2={w / 2 - 4} y2={-h * 0.5} stroke="#9cc3e0" strokeWidth="1.5" />}
    </g>
  );
}

/** A wooden block, 6 cm, seen a little from above. */
function Block() {
  const s = 6 * PX_S;
  const d = 6;
  return (
    <g>
      <polygon points={`${-s / 2},${-s} ${-s / 2 + d},${-s - d} ${s / 2 + d},${-s - d} ${s / 2},${-s}`} fill="#efc06a" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <polygon points={`${s / 2},0 ${s / 2 + d},${-d} ${s / 2 + d},${-s - d} ${s / 2},${-s}`} fill="#b97f2a" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x={-s / 2} y={-s} width={s} height={s} fill="#e0a43a" stroke={INK} strokeWidth="2.5" />
      <path d={`M${-s / 2 + 4} ${-s * 0.7} q${s * 0.4} ${-4} ${s - 8} 0 M${-s / 2 + 4} ${-s * 0.35} q${s * 0.4} 4 ${s - 8} 0`} fill="none" stroke="#a8721f" strokeWidth="1.5" />
    </g>
  );
}

/** A plastic toy dinosaur (a stegosaurus), 10 cm long, 7 cm tall. */
function Dino() {
  const u = PX_S;
  return (
    <g>
      {[-2.6, -1, 0.6, 2.1].map((x) => (
        <polygon key={x} points={`${(x - 0.8) * u},${-4.6 * u} ${x * u},${-7 * u} ${(x + 0.8) * u},${-4.6 * u}`} fill="#e07a2e" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      ))}
      <path
        d={`M${-5 * u} ${-2.6 * u} q${1.5 * u} ${-0.4 * u} ${2.2 * u} ${-1.6 * u} q${2.8 * u} ${-2.4 * u} ${5.6 * u} ${-0.2 * u} q${1 * u} ${0.6 * u} ${2.2 * u} ${0.4 * u} q${0.6 * u} ${0.6 * u} 0 ${1.2 * u} q${-1.4 * u} ${0.2 * u} ${-2.4 * u} ${0.4 * u} v${2.6 * u} h${-1.4 * u} v${-2.2 * u} h${-2.2 * u} v${2.2 * u} h${-1.4 * u} v${-2.4 * u} q${-1.6 * u} ${0.2 * u} ${-2.6 * u} ${-0.6 * u} z`}
        fill="#3f8f4a"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx={3.9 * u} cy={-3.6 * u} r="1.8" fill={INK} />
    </g>
  );
}

/** Any thing, drawn with its bottom at (x, y). */
function ThingShape({ t, x, y, ghost }: { readonly t: Thing; readonly x: number; readonly y: number; readonly ghost?: boolean }) {
  const stuff = STUFF[t];
  let body: ReactNode;
  if (FLAT.includes(t) && stuff) body = <Sheet w={across(t) * PX_S} fill={stuff[0]} line={stuff[1]} cloth={t === 'hanky-open'} />;
  else if (CRUMPLED.includes(t) && stuff) body = <Crumple r={(across(t) * PX_S) / 2} fill={stuff[0]} line={stuff[1]} />;
  else if (t === 'bottle-full' || t === 'bottle-empty') body = <Bottle full={t === 'bottle-full'} />;
  else if (t === 'block') body = <Block />;
  else if (t === 'dino') body = <Dino />;
  else body = <Ball t={t} />;
  return (
    <g transform={`translate(${x} ${y})`} opacity={ghost ? 0.28 : 1} strokeDasharray={ghost ? '5 4' : undefined}>
      {body}
    </g>
  );
}

const LETGO: Record<Round['height'], string> = { 50: '50 cm', 100: '1 m' };
const MID = (X.left + X.right) / 2;

/**
 * The child's guess, drawn on the setup: a gold arrow down to a gold spot on
 * the floor under each thing the guess says lands first (both, for Together).
 * The same gold spot marks "landed first" on the guess buttons.
 */
function GuessMarks({ round, guess }: { readonly round: Round; readonly guess: Lands }) {
  const start = yAt(round.height);
  return (
    <g>
      {SIDES.filter((s) => guess === 'together' || guess === s).map((s) => {
        const x = X[s];
        return (
          <g key={s}>
            <ellipse cx={x} cy={FLOOR} rx={Math.max(extent(round[s])[0] / 2, 16) + 8} ry="7" fill={GOLD} stroke={INK} strokeWidth="2" />
            <line x1={x} y1={start + 10} x2={x} y2={FLOOR - 22} stroke={GOLD} strokeWidth="5" strokeDasharray="10 7" strokeLinecap="round" />
            <polygon points={`${x - 11},${FLOOR - 24} ${x + 11},${FLOOR - 24} ${x},${FLOOR - 9}`} fill={GOLD} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
}

const GUESS_WORDS = (round: Round, guess: Lands) =>
  guess === 'together' ? 'Your guess: they land together.' : `Your guess: the ${name(round[guess])} lands first.`;

/**
 * The scene, before or after. Same viewBox, ruler, floor and columns in both,
 * so the two panes line up when the shell sets them side by side. Before,
 * the child's guess (if any) is drawn on it in gold.
 */
function Scene({
  round,
  after,
  sizes,
  guess,
}: {
  readonly round: Round;
  readonly after: boolean;
  readonly sizes?: boolean;
  readonly guess?: Answer;
}) {
  const start = yAt(round.height);
  const shownGuess = !after && guess ? guess : null;
  const lagging = (s: Side) => after && round.lands !== 'together' && round.lands !== s;
  const at = (s: Side) => (!after ? start : lagging(s) ? yAt(round.behind ?? 0) : FLOOR);
  const slow = SIDES.find(lagging);
  const head = !after
    ? `Both let go together from ${LETGO[round.height]}.`
    : round.lands === 'together'
      ? 'Model: both reach the floor together.'
      : 'Model: the instant the first one lands.';
  const label = after
    ? round.lands === 'together'
      ? `The ${name(round.left)} and the ${name(round.right)} land together.`
      : `The ${name(round[round.lands])} has landed; the ${name(round[slow ?? 'left'])} is still ${round.behind} cm up.`
    : `A ${name(round.left)} and a ${name(round.right)}, held side by side ${LETGO[round.height]} above the floor.${shownGuess ? ` ${GUESS_WORDS(round, shownGuess)}` : ''}`;
  return (
    <svg className="board-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={label}>
      <rect x="0" y="0" width={VB_W} height={FLOOR} fill="#fff8ec" />
      <rect x="0" y={FLOOR} width={VB_W} height={VB_H - FLOOR} fill="#ead2a8" />
      <line x1="0" y1={FLOOR} x2={VB_W} y2={FLOOR} stroke={INK} strokeWidth="3" />
      <text x={VB_W / 2 + 20} y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill={after ? '#0b6b53' : INK}>
        {head}
      </text>

      {/* the ruler: 0 to 100 cm, a tick every 10 */}
      <rect x="44" y={yAt(100) - 6} width="18" height={100 * PX_H + 6} fill="#f2c46d" stroke={INK} strokeWidth="2" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1="44" y1={yAt(i * 10)} x2={i % 5 === 0 ? 62 : 53} y2={yAt(i * 10)} stroke={INK} strokeWidth={i % 5 === 0 ? 2.5 : 1.5} />
      ))}
      {[0, 50, 100].map((cm) => (
        <text key={cm} x="38" y={cm === 0 ? FLOOR - 3 : yAt(cm) + 5} textAnchor="end" fontSize="14" fontWeight="700" fill={SOFT}>
          {cm}
        </text>
      ))}
      <text x="53" y={yAt(100) - 14} textAnchor="middle" fontSize="13" fontWeight="700" fill={SOFT}>
        cm
      </text>

      {/* where both were let go */}
      <polygon points={`64,${start} 76,${start - 7} 76,${start + 7}`} fill="#f2a900" stroke={INK} strokeWidth="1.5" />
      <line x1="78" y1={start} x2={VB_W - 8} y2={start} stroke={SOFT} strokeWidth="1.5" strokeDasharray="6 6" />

      {slow && round.behind ? (
        <g>
          <line x1={X[slow] + (slow === 'left' ? 1 : -1) * ((across(round[slow]) * PX_S) / 2 + 4)} y1={yAt(round.behind)} x2={MID} y2={yAt(round.behind)} stroke="#0b6b53" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1={MID} y1={yAt(round.behind) + 4} x2={MID} y2={FLOOR - 4} stroke="#0b6b53" strokeWidth="2.5" />
          <polyline points={`${MID - 6},${yAt(round.behind) + 12} ${MID},${yAt(round.behind) + 3} ${MID + 6},${yAt(round.behind) + 12}`} fill="none" stroke="#0b6b53" strokeWidth="2.5" />
          <polyline points={`${MID - 6},${FLOOR - 12} ${MID},${FLOOR - 3} ${MID + 6},${FLOOR - 12}`} fill="none" stroke="#0b6b53" strokeWidth="2.5" />
          <rect x={MID - 44} y={(yAt(round.behind) + FLOOR) / 2 - 22} width="88" height="42" rx="6" fill="#fff8ec" stroke="#0b6b53" strokeWidth="2" />
          <text x={MID} y={(yAt(round.behind) + FLOOR) / 2 - 4} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0b6b53">
            {round.behind} cm
          </text>
          <text x={MID} y={(yAt(round.behind) + FLOOR) / 2 + 14} textAnchor="middle" fontSize="13" fill="#0b6b53">
            still to fall
          </text>
        </g>
      ) : null}

      {shownGuess ? <GuessMarks round={round} guess={shownGuess} /> : null}

      {after ? SIDES.map((s) => <ThingShape key={`g${s}`} t={round[s]} x={X[s]} y={start} ghost />) : null}
      {SIDES.map((s) => (
        <ThingShape key={s} t={round[s]} x={X[s]} y={at(s)} />
      ))}

      {/* With sizes on (Help, and after): each thing's width as a bar in the floor right under its column. */}
      {sizes
        ? SIDES.map((s) => {
            const half = (across(round[s]) * PX_S) / 2;
            const y = FLOOR + 7;
            return (
              <g key={`w${s}`} stroke={SOFT} strokeWidth="2.5" strokeLinecap="round">
                <line x1={X[s] - half} y1={y} x2={X[s] + half} y2={y} />
                <line x1={X[s] - half} y1={y - 3} x2={X[s] - half} y2={y + 3} />
                <line x1={X[s] + half} y1={y - 3} x2={X[s] + half} y2={y + 3} />
              </g>
            );
          })
        : null}

      {SIDES.map((s) => (
        <g key={`n${s}`}>
          <text x={X[s]} y={FLOOR + 24} textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
            {name(round[s])}
          </text>
          {sizes ? (
            <text x={X[s]} y={FLOOR + 46} textAnchor="middle" fontSize="14" fill={SOFT}>
              {`${across(round[s])} cm wide`}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

/** Drawn width and height of a thing in board pixels, for fitting it into a guess-button picture. */
function extent(t: Thing): readonly [number, number] {
  const w = across(t) * PX_S;
  if (FLAT.includes(t)) return [w, 12];
  if (t === 'bottle-full' || t === 'bottle-empty') return [w, 16 * PX_S + 3];
  if (t === 'block') return [w + 6, w + 6];
  if (t === 'dino') return [w + 6, 7 * PX_S];
  return [w, w];
}

/**
 * The picture on each guess button, so the three guesses can be told apart
 * without reading: the floor, with the one that lands first down on it on a
 * gold spot (the same gold the scene uses for the guess) and the other still
 * up with a dashed line for the way it has left to fall, or both down for
 * Together. Same left/right order as the board.
 */
function GuessPicture({ round, value }: { readonly round: Round; readonly value: Lands }) {
  const floor = 64;
  const up = 30;
  const col = { left: 28, right: 78 } as const;
  return (
    <svg width="104" height="72" viewBox="0 0 106 72" aria-hidden="true" focusable="false" style={{ width: 104, height: 72 }}>
      <line x1="2" y1={floor} x2="104" y2={floor} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {SIDES.map((s) => {
        const [w, h] = extent(round[s]);
        const k = Math.min(1, 44 / w, 28 / h);
        // A wide sheet shrunk to fit would be a hairline; keep it thick enough to see.
        const ky = FLAT.includes(round[s]) ? Math.max(k, 0.7) : k;
        const down = value === 'together' || value === s;
        const y = down ? floor : up;
        return (
          <g key={s}>
            {down ? (
              <ellipse cx={col[s]} cy={floor} rx={Math.min(24, (w * k) / 2 + 5)} ry="4" fill={GOLD} stroke={INK} strokeWidth="1.5" />
            ) : (
              <line x1={col[s]} y1={up + 4} x2={col[s]} y2={floor - 3} stroke={SOFT} strokeWidth="2" strokeDasharray="3 3" />
            )}
            <g transform={`translate(${col[s]} ${y}) scale(${k.toFixed(3)} ${ky.toFixed(3)})`}>
              <ThingShape t={round[s]} x={0} y={0} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Weight, drawn rather than written: both things sit on the plates of a pan
 * balance whose beam tips down on the heavier side, or stays level when they
 * weigh the same. Grams sit small under each plate, for the grown-up.
 */
function Balance({ round }: { readonly round: Round }) {
  const [gl, gr] = [grams(round.left), grams(round.right)];
  const tilt = gl === gr ? 0 : gl > gr ? 1 : -1; // 1: left side down
  const px = 150;
  const py = 96;
  const arm = 100;
  const rad = (11 * Math.PI) / 180;
  const end = (s: Side) => {
    const sign = s === 'left' ? -1 : 1;
    // Left down means a larger y on the left and a smaller one on the right.
    return { x: px + sign * arm * Math.cos(rad * Math.abs(tilt)), y: py + (s === 'left' ? 1 : -1) * tilt * arm * Math.sin(rad) };
  };
  const heavy = tilt === 0 ? null : tilt > 0 ? round.left : round.right;
  const label =
    heavy === null
      ? `On the balance the ${name(round.left)} and the ${name(round.right)} weigh the same: the beam is level.`
      : `On the balance the ${name(heavy)} is heavier: its side tips down.`;
  return (
    <svg viewBox="0 0 300 150" role="img" aria-label={label} style={{ display: 'block', width: '100%', maxWidth: 320, height: 'auto', margin: '0 auto' }}>
      <rect x="110" y="124" width="80" height="10" rx="4" fill={BRASS} stroke={INK} strokeWidth="2.5" />
      <rect x={px - 7} y={py} width="14" height="28" fill={BRASS} stroke={INK} strokeWidth="2.5" />
      <line x1={end('left').x} y1={end('left').y} x2={end('right').x} y2={end('right').y} stroke="#8a5a14" strokeWidth="8" strokeLinecap="round" />
      <circle cx={px} cy={py} r="8" fill={GOLD} stroke={INK} strokeWidth="2.5" />
      {SIDES.map((s) => {
        const { x, y } = end(s);
        const plate = y - 12;
        const t = round[s];
        const [w, h] = extent(t);
        const k = Math.min(1, 80 / w, 40 / h);
        const ky = FLAT.includes(t) ? Math.max(k, 0.7) : k;
        return (
          <g key={s}>
            <line x1={x} y1={y} x2={x} y2={plate} stroke={INK} strokeWidth="4" />
            <path d={`M${x - 46} ${plate} h92 l-8 6 h-76 z`} fill="#f6dfa8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            <g transform={`translate(${x} ${plate}) scale(${k.toFixed(3)} ${ky.toFixed(3)})`}>
              <ThingShape t={t} x={0} y={0} />
            </g>
            <text x={x} y={y + 22} textAnchor="middle" fontSize="14" fontWeight="600" fill={SOFT}>
              {`${grams(t)} g`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const options: readonly [Lands, string][] = [
    ['left', `${cap(name(round.left))} first`],
    ['together', 'Together'],
    ['right', `${cap(name(round.right))} first`],
  ];
  return (
    <div className="board board--drop">
      {stage === 'worked' ? (
        <div className="evidence">
          <figure className="evidence__pane">
            <figcaption>Let go</figcaption>
            <Scene round={round} after={false} sizes guess={answer} />
          </figure>
          <figure className="evidence__pane evidence__pane--after">
            <figcaption>What happens</figcaption>
            <Scene round={round} after sizes />
          </figure>
        </div>
      ) : (
        <Scene round={round} after={false} sizes={stage !== 'answering'} guess={answer} />
      )}
      <Balance round={round} />
      <div className="choices" role="group" aria-label="Your guess">
        {options.map(([value, text]) => (
          <Choice key={value} selected={answer === value} onTap={() => setAnswer(value)} disabled={locked} ariaLabel={text}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <GuessPicture round={round} value={value} />
              <span style={{ fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 }}>{text}</span>
            </span>
          </Choice>
        ))}
      </div>
      {stage === 'hint' ? <p className="board-caption">{hintFact(round)}</p> : null}
      {stage === 'worked' ? <p className="board-caption">{round.why}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <Scene round={round} after sizes />;
}

export const whichOneLandsFirst: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'which-one-lands-first',
  title: 'Which One Lands First?',
  hook: 'Heavy, light, flat, crumpled.',
  group: 'motion',
  levels: ['Heavy and light', 'Flat or crumpled', 'New things to drop'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => prediction === round.lands,
  why: (round) => round.why,
  cover: 'art/games/which-one-lands-first.png',
  note: {
    what: 'Two things are held side by side at the same height, with their weights in grams shown. He taps which one he thinks lands first, or Together, then presses Try to see a drawn model of the instant the first one reaches the floor, beside the starting picture.',
    expect: 'Nearly every five-year-old says the heavier one lands first, and many adults do too. Level 1 (a 160 g cricket ball against a 58 g tennis ball) breaks that. Then expect a new rule, "light things are slow", which level 2 (the same paper flat and crumpled) and the two level 3 rounds where the lighter one wins are built to break. Then the overcorrection, "weight never matters": the level 3 flat card sheet against a flat page of the same size, where the heavier one wins, breaks that.',
    practising: 'Gravity speeds up heavy and light things alike; air pushing back on a wide, light thing is what slows it. Separating two causes, weight and shape, by changing only one at a time.',
    ask: "After the flat and the crumpled paper: 'They weigh exactly the same. So what made one of them slow?'",
    next: 'Do it for real, standing on the floor: two A4 sheets, one crumpled into a ball, let go together from his shoulder height; then two same-size bottles with caps on, one full of water and one empty. He drops, you watch where they touch the floor, then swap.',
    honest: 'Getting these right does not show he understands gravity; it shows he has stopped trusting weight alone. "They land together" holds only where the air barely matters: dropped from a tall building, a tennis ball falls well behind a cricket ball. Real paper also flutters sideways, which this drawing leaves out.',
    easier: 'Stay on level 1 and do each pair at home with two balls you own before looking at the screen.',
    harder: 'Ask him to predict which shape of the same sheet falls slowest: flat, folded in half, or rolled into a tube. Then test all three.',
    safety: 'Drop from standing height only, never from stairs or furniture, and nothing breakable. Keep the two-year-old out from under the drop and away from small balls.',
  },
};

export default whichOneLandsFirst;
