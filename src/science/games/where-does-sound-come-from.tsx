import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Where Does Sound Come From? — a ruler held flat at a table edge.
 *
 * Concept (advisor, physics 8): sound comes from something swinging back and
 * forth. Pitch is how FAST it swings: less ruler sticking out swings faster
 * and gives a higher note. Loudness is how WIDE it swings: a harder pluck
 * (pushing the tip further down before letting go) makes a wider swing and a
 * louder sound, at the same note. The misconceptions it fixes: "louder means
 * higher", and "sound has nothing to do with something moving".
 *
 * Shape: two tries with the same ruler on the kitchen table at home, Nanna's
 * hand holding it flat, stacked in one frame (Ruler 1 above, Ruler 2 below).
 * The child taps which one makes the higher note, the lower note, the louder
 * sound, or any sound at all. The outcome draws the SAME frame with each
 * ruler's swing width (dashed ghosts at both ends of the swing), the tip's
 * swings over one short moment, and note/loudness labels.
 * All drawing is static; nothing moves.
 *
 * The swing trace is drawn to the physics of a ruler held at one end: swings
 * per moment go as 1 / (overhang)^2, so 8 cm out swings four times as often
 * as 16 cm out. Swing width is how far the tip was pushed down, so a hard
 * pluck is wider and the number of swings does not change.
 *
 * Levels:
 *  1. Long or short: the same gentle pluck, two overhangs. Plus "which one
 *     makes a sound?" — one ruler let go, one held down.
 *  2. Hard or gentle: the same overhang, two plucks. Higher? (the same note)
 *     Louder? (the hard pluck).
 *  3. Note or loudness: both change at once, and the question is only about
 *     the note. Sometimes the long ruler is plucked hard (wide swing, still
 *     the lower note), sometimes the short one (wide swing, higher note), so
 *     neither "harder is higher" nor "wider is lower" survives a set; one
 *     pair is close (10 vs 13 cm). Loudness is never compared across two
 *     different lengths — that is not a fair test — so level 3 says "wider",
 *     not "louder". Outcomes are labelled as a drawn model (ruling 5).
 */

type Pluck = 'gentle' | 'hard';
type Ask = 'sound' | 'higher' | 'lower' | 'louder' | 'softer';
type Pick = 'a' | 'b' | 'same';

interface Setup {
  /** How far the ruler sticks out past the table edge, in cm. */
  readonly out: number;
  /** How far the tip is pushed down before it is let go. */
  readonly pluck: Pluck;
  /** The finger keeps holding the tip down, so the ruler cannot swing. */
  readonly held?: boolean;
}

export interface Round {
  readonly a: Setup;
  readonly b: Setup;
  readonly ask: Ask;
  readonly truth: Pick;
  /** Levels 2 and 3 offer "Same note" / "Just as loud" as a third choice. */
  readonly allowSame: boolean;
}

export type Answer = Pick | null;

const g = (out: number, held?: boolean): Setup => (held ? { out, pluck: 'gentle', held } : { out, pluck: 'gentle' });
const h = (out: number): Setup => ({ out, pluck: 'hard' });

function truthOf(a: Setup, b: Setup, ask: Ask): Pick {
  switch (ask) {
    case 'sound':
      return a.held ? 'b' : 'a';
    case 'higher':
      return a.out === b.out ? 'same' : a.out < b.out ? 'a' : 'b';
    case 'lower':
      return a.out === b.out ? 'same' : a.out > b.out ? 'a' : 'b';
    case 'louder':
      return a.pluck === b.pluck ? 'same' : a.pluck === 'hard' ? 'a' : 'b';
    case 'softer':
      return a.pluck === b.pluck ? 'same' : a.pluck === 'gentle' ? 'a' : 'b';
  }
}

// Overhangs stay between 6 and 18 cm of a 30 cm ruler, so plenty stays under
// the grown-up's hand. Levels 1 and 2 pairs differ by at least half again;
// level 3 adds a close pair (10 vs 13 cm, still 1.7 times the swings) where
// the hard pluck makes the longer ruler look like the one doing more.
//
// Level 3 is ordered so that any three in a row (a set is three) contain a
// round where the wide swing is the LOWER note and one where it is the HIGHER
// note. That breaks both wrong rules, "harder is higher" and "wider is lower";
// only "shorter is higher" survives every round.
const SETS: Record<Level, ReadonlyArray<readonly [Setup, Setup, Ask]>> = {
  1: [
    [g(16), g(8), 'higher'],
    [g(8), g(14), 'lower'],
    [g(12), g(12, true), 'sound'],
    [g(6), g(14), 'higher'],
    [g(18), g(9), 'lower'],
    [g(10, true), g(10), 'sound'],
  ],
  2: [
    [h(12), g(12), 'higher'],
    [g(10), h(10), 'louder'],
    [h(14), g(14), 'lower'],
    [h(8), g(8), 'louder'],
    [h(16), g(16), 'softer'],
    [g(10), h(10), 'higher'],
  ],
  3: [
    [h(16), g(8), 'higher'],
    [g(14), h(6), 'lower'],
    [g(12), h(12), 'higher'],
    [g(10), h(13), 'higher'],
    [g(15), h(7), 'lower'],
    [g(7), h(16), 'lower'],
  ],
};

export function generate(level: Level, index: number): Round {
  const [a, b, ask] = SETS[level][((index % 6) + 6) % 6];
  return { a, b, ask, truth: truthOf(a, b, ask), allowSame: level > 1 };
}

const PROMPT: Record<Ask, string> = {
  sound: 'Which ruler makes a sound?',
  higher: 'Which ruler makes the higher note?',
  lower: 'Which ruler makes the lower note?',
  louder: 'Which ruler makes the louder sound?',
  softer: 'Which ruler makes the softer sound?',
};

function prompt(round: Round): string {
  return PROMPT[round.ask];
}

/* --------------------------------------------------------------- drawing -- */

/** One frame, two rows: Ruler 1 above, Ruler 2 below. Setup and outcome share it. */
const W = 400;
const ROW = 192;
const EDGE = 200; // table edge, x
const PX = 9; // px per cm
const Y = 64; // ruler centre line within a row
const RULER_CM = 30;
const TRACE_Y = 172;
const INK = '#24170f';
const PLASTIC = '#a9d6ee'; // a plain pale-blue plastic ruler
const SKIN = '#a5683f';
const SLEEVE = '#b4532a'; // Nanna's rust shirt
const WOOD = '#b7773f';
const WOOD_DEEP = '#8a5528';
const TEAL = 'var(--science, #0d8063)';
const TEAL_DEEP = 'var(--science-deep, #075c46)';
const GOLD = 'var(--gold, #f2a900)';
const GOLD_TINT = 'var(--gold-tint, #fff1c9)';
const PAPER = 'var(--paper, #fff8ec)';
const INK_SOFT = 'var(--ink-soft, #5a4636)';
/** Centimetre blocks under the overhang alternate colour every five, so 16 reads as 5, 5, 5 and 1. */
const CM_FIVE = ['#5fa3cf', '#ffffff'] as const;

/** How far the tip is pushed down (setup) — and so how far it swings each way (outcome). */
const DEPTH: Record<Pluck, number> = { gentle: 10, hard: 22 };
/** Trace height on the "tip in one short moment" strip. */
const TRACE_AMP: Record<Pluck, number> = { gentle: 6, hard: 14 };

/** Swings drawn in the strip: a ruler held at one end swings as 1 / length². */
const swings = (out: number) => 486 / (out * out);

const tipX = (s: Setup) => EDGE + s.out * PX;

/** The ruler: flat on the table, bent past the edge so its tip sits `d` px below rest (negative is up). */
function rulerPath(s: Setup, d: number): string {
  const L = s.out * PX;
  const pts = [`M${Math.max(-10, EDGE - (RULER_CM - s.out) * PX)} ${Y}`, `L${EDGE} ${Y}`];
  for (let i = 1; i <= 16; i += 1) {
    const u = i / 16;
    pts.push(`L${(EDGE + L * u).toFixed(1)} ${(Y + (d * u * u * (3 - u)) / 2).toFixed(1)}`);
  }
  return pts.join(' ');
}

function Ruler({ s, d, ghost }: { readonly s: Setup; readonly d: number; readonly ghost?: boolean }) {
  const path = rulerPath(s, d);
  return ghost ? (
    <g opacity="0.6">
      <path d={path} fill="none" stroke={INK} strokeWidth="9" strokeDasharray="6 5" />
      <path d={path} fill="none" stroke={PLASTIC} strokeWidth="5" />
    </g>
  ) : (
    <g>
      <path d={path} fill="none" stroke={INK} strokeWidth="9" />
      <path d={path} fill="none" stroke={PLASTIC} strokeWidth="5" />
    </g>
  );
}

/** The table, and Nanna's hand pressing the ruler flat just behind the edge, his rust shirt sleeve rolled up. */
function TableAndHand() {
  const e = EDGE;
  return (
    <g>
      <rect x="4" y={Y + 5} width={e - 4} height="12" fill={WOOD} stroke={INK} strokeWidth="3" />
      <rect x="4" y={Y + 17} width={e - 4} height="16" fill={WOOD_DEEP} stroke={INK} strokeWidth="3" />
      {/* forearm, coming down from above, in a rolled rust sleeve */}
      <line x1={e - 62} y1={Y - 18} x2={e - 74} y2={Y - 38} stroke={INK} strokeWidth="22" strokeLinecap="round" />
      <line x1={e - 62} y1={Y - 18} x2={e - 74} y2={Y - 38} stroke={SKIN} strokeWidth="16" strokeLinecap="round" />
      <line x1={e - 72} y1={Y - 36} x2={e - 78} y2={Y - 47} stroke={INK} strokeWidth="28" />
      <line x1={e - 72} y1={Y - 36} x2={e - 78} y2={Y - 47} stroke={SLEEVE} strokeWidth="22" />
      {/* the hand, seen from the side: palm and straight fingers flat on the ruler */}
      <path
        d={`M${e - 70} ${Y - 5} H${e - 10} q6 0 6 -5 q0 -5 -6 -5 H${e - 42} q-8 -13 -20 -14 q-8 0 -12 6 q-6 8 0 18 z`}
        fill={SKIN}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${e - 34} ${Y - 10} h20`} stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

/** A pointing hand: fist above, one finger on the ruler's tip. */
function Finger({ x, y }: { readonly x: number; readonly y: number }) {
  return (
    <g>
      <rect x={x - 7} y={y - 44} width="14" height="42" rx="7" fill={SKIN} stroke={INK} strokeWidth="3" />
      <rect x={x - 17} y={y - 68} width="34" height="28" rx="9" fill={SKIN} stroke={INK} strokeWidth="3" />
      <path d={`M${x - 8} ${y - 58} v10 M${x + 1} ${y - 58} v10 M${x + 10} ${y - 58} v10`} stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <ellipse cx={x - 17} cy={y - 50} rx="6" ry="9" fill={SKIN} stroke={INK} strokeWidth="3" />
      <path d={`M${x - 4} ${y - 10} h8`} stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** Beside the finger: an up arrow (the finger lets go) or a down arrow with a bar (it keeps holding). */
function LetGoArrow({ s }: { readonly s: Setup }) {
  const x = tipX(s) - 40;
  const top = Y - 44;
  const bot = Y - 10;
  return s.held ? (
    <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
      <line x1={x} y1={top} x2={x} y2={bot} />
      <path d={`M${x - 8} ${bot - 9} L${x} ${bot} L${x + 8} ${bot - 9}`} />
      <line x1={x - 10} y1={bot + 4} x2={x + 10} y2={bot + 4} />
    </g>
  ) : (
    <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
      <line x1={x} y1={top} x2={x} y2={bot} />
      <path d={`M${x - 8} ${top + 9} L${x} ${top} L${x + 8} ${top + 9}`} />
    </g>
  );
}

/**
 * Under the part that sticks out past the table: one block per centimetre, so
 * the length is a row of things to count, lined up under the ruler it measures.
 * Both rows start at the same table edge, so the two rows compare by eye too.
 */
function Bracket({ s, focus }: { readonly s: Setup; readonly focus: boolean }) {
  const x2 = tipX(s);
  return (
    <g>
      {Array.from({ length: s.out }, (_, i) => (
        <rect
          key={i}
          x={EDGE + i * PX + 0.75}
          y="100"
          width={PX - 1.5}
          height="12"
          rx="1.5"
          fill={CM_FIVE[Math.floor(i / 5) % 2]}
          stroke={INK}
          strokeWidth="1"
        />
      ))}
      {focus ? <rect x={EDGE - 3} y="97" width={x2 - EDGE + 6} height="18" rx="4" fill="none" stroke={GOLD} strokeWidth="4" /> : null}
      <text x={(EDGE + x2) / 2} y="131" textAnchor="middle" fontSize="16" fontWeight="700" fill={INK}>
        {s.out} cm
      </text>
    </g>
  );
}

/** How far the tip was pushed below where it rests. */
function DepthMark({ s, focus }: { readonly s: Setup; readonly focus: boolean }) {
  const x = tipX(s) + 18;
  const d = DEPTH[s.pluck];
  const col = focus ? GOLD : 'var(--ink-soft, #5a4636)';
  const w = focus ? 5 : 3;
  return (
    <g>
      <line x1={EDGE} y1={Y} x2={x + 6} y2={Y} stroke={INK} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
      <line x1={x} y1={Y} x2={x} y2={Y + d} stroke={col} strokeWidth={w} />
      <line x1={x - 6} y1={Y + d} x2={x + 6} y2={Y + d} stroke={col} strokeWidth={w} />
    </g>
  );
}

/** Swing width at the tip, from the highest to the lowest point of the swing. */
function SwingMark({ s, focus }: { readonly s: Setup; readonly focus: boolean }) {
  const x = tipX(s) + 18;
  const d = DEPTH[s.pluck];
  const col = focus ? GOLD : 'var(--ink-soft, #5a4636)';
  const w = focus ? 5 : 3;
  return (
    <g>
      <line x1={x} y1={Y - d} x2={x} y2={Y + d} stroke={col} strokeWidth={w} />
      <line x1={x - 6} y1={Y - d} x2={x + 6} y2={Y - d} stroke={col} strokeWidth={w} />
      <line x1={x - 6} y1={Y + d} x2={x + 6} y2={Y + d} stroke={col} strokeWidth={w} />
    </g>
  );
}

/** The tip's height over one short moment, drawn left to right: a still picture of fast or slow swings. */
function Trace({ s }: { readonly s: Setup }) {
  const amp = s.held ? 0 : TRACE_AMP[s.pluck];
  const n = s.held ? 0 : swings(s.out);
  const x0 = 20;
  const span = 360;
  const pts: string[] = [];
  // Starts at the bottom: the tip was pushed down, then let go.
  for (let i = 0; i <= 240; i += 1) {
    const u = i / 240;
    pts.push(`${(x0 + span * u).toFixed(1)},${(TRACE_Y + amp * Math.cos(2 * Math.PI * n * u)).toFixed(1)}`);
  }
  return (
    <g>
      <rect x="12" y={TRACE_Y - 18} width="376" height="36" rx="8" fill="var(--science-tint, #dcf3ea)" />
      <line x1={x0} y1={TRACE_Y} x2={x0 + span} y2={TRACE_Y} stroke={INK} strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
      <polyline points={pts.join(' ')} fill="none" stroke={TEAL} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

const PLUCK_WORDS = (s: Setup): string =>
  s.held ? 'Pushed down and held there.' : s.pluck === 'hard' ? 'Pushed down far, then let go.' : 'Pushed down a little, then let go.';

/** The headline over each outcome row: the note, and the loudness only where it is a fair comparison. */
function noteLabel(s: Setup, o: Setup): string {
  if (s.held) return 'no sound';
  if (o.held) return 'a sound';
  if (s.out !== o.out) return s.out < o.out ? 'higher note' : 'lower note';
  if (s.pluck === o.pluck) return 'same note';
  return s.pluck === 'hard' ? 'same note, louder' : 'same note, softer';
}

/** What the trace strip shows: how fast, and (if the plucks differ) how wide. */
function swingLabel(s: Setup, o: Setup): string {
  if (s.held) return 'cannot swing';
  if (o.held) return 'swings back and forth';
  const speed = s.out === o.out ? 'same speed' : s.out < o.out ? 'faster swings' : 'slower swings';
  if (s.pluck === o.pluck) return speed;
  return `${speed}, ${s.pluck === 'hard' ? 'wider' : 'narrower'}`;
}

type Focus = 'length' | 'push' | 'finger' | null;

function focusOf(ask: Ask): Exclude<Focus, null> {
  return ask === 'sound' ? 'finger' : ask === 'higher' || ask === 'lower' ? 'length' : 'push';
}

/** A big numeral badge, the same one drawn on the answer button for that ruler. */
function Badge({ n, x, y, r }: { readonly n: 1 | 2; readonly x: number; readonly y: number; readonly r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={PAPER} stroke={INK} strokeWidth={r > 10 ? 3 : 2} />
      <text x={x} y={y + r * 0.42} textAnchor="middle" fontSize={r * 1.25} fontWeight="700" fill={INK}>
        {n}
      </text>
    </g>
  );
}

function RowLabel({ n }: { readonly n: 1 | 2 }) {
  return (
    <g>
      <text x="12" y="28" fontSize="15" fontWeight="600" fill={INK_SOFT}>
        Ruler
      </text>
      <Badge n={n} x={74} y={22} r={15} />
    </g>
  );
}

/**
 * What the child's tap changes on the board: the row of the ruler picked gets
 * a gold ground and border, the same gold as the pressed button. "Same" rings
 * both rows and puts an equals sign between them.
 */
function PickMark({ pick }: { readonly pick: Pick | null }) {
  if (pick === null) return null;
  const ring = (row: 0 | 1, dashed: boolean) => (
    <rect
      key={row}
      x="5"
      y={row * ROW + 5}
      width={W - 10}
      height={ROW - 10}
      rx="14"
      fill={GOLD_TINT}
      stroke={GOLD}
      strokeWidth="6"
      strokeDasharray={dashed ? '14 8' : undefined}
    />
  );
  if (pick !== 'same') return ring(pick === 'a' ? 0 : 1, false);
  return (
    <g>
      {ring(0, true)}
      {ring(1, true)}
    </g>
  );
}

function EqualsMark({ pick }: { readonly pick: Pick | null }) {
  if (pick !== 'same') return null;
  return (
    <g>
      <circle cx={W - 26} cy={ROW} r="14" fill={GOLD} stroke={INK} strokeWidth="3" />
      <path d={`M${W - 34} ${ROW - 4} h16 M${W - 34} ${ROW + 4} h16`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
}

/** Before: the tip pushed down by a finger, ready to be let go (or held). */
function SetupRow({ s, n, focus }: { readonly s: Setup; readonly n: 1 | 2; readonly focus: Focus }) {
  const d = DEPTH[s.pluck];
  return (
    <g transform={`translate(0 ${(n - 1) * ROW})`}>
      <RowLabel n={n} />
      <TableAndHand />
      <Ruler s={s} d={d} />
      <Finger x={tipX(s)} y={Y + d} />
      <LetGoArrow s={s} />
      <DepthMark s={s} focus={focus === 'push'} />
      <Bracket s={s} focus={focus === 'length'} />
      {focus === 'finger' ? (
        <circle cx={tipX(s)} cy={Y + d - 30} r="36" fill="none" stroke={GOLD} strokeWidth="5" />
      ) : null}
      <text x="200" y={TRACE_Y + 6} textAnchor="middle" fontSize="16" fill={INK}>
        {PLUCK_WORDS(s)}
      </text>
    </g>
  );
}

/** After: the same frame, with the ruler's swing (both ends dashed) and its tip traced over a moment. */
function OutcomeRow({ s, o, n, focus }: { readonly s: Setup; readonly o: Setup; readonly n: 1 | 2; readonly focus: Focus }) {
  const d = DEPTH[s.pluck];
  return (
    <g transform={`translate(0 ${(n - 1) * ROW})`}>
      <RowLabel n={n} />
      {/* Under the table, left of the bracket: never under the finger, the tip or the swing. */}
      <text x="10" y="130" fontSize="17" fontWeight="700" fill={TEAL_DEEP}>
        {noteLabel(s, o)}
      </text>
      <TableAndHand />
      {s.held ? (
        <>
          <Ruler s={s} d={d} />
          <Finger x={tipX(s)} y={Y + d} />
        </>
      ) : (
        <>
          <Ruler s={s} d={-d} ghost />
          <Ruler s={s} d={d} ghost />
          <Ruler s={s} d={0} />
          <SwingMark s={s} focus={focus === 'push'} />
        </>
      )}
      <Bracket s={s} focus={focus === 'length'} />
      <text x="14" y={TRACE_Y - 24} fontSize="13" fill="var(--ink-soft, #5a4636)">
        Tip, in one short moment
      </text>
      <text x="386" y={TRACE_Y - 24} textAnchor="end" fontSize="13" fontWeight="700" fill={INK}>
        {swingLabel(s, o)}
      </text>
      <Trace s={s} />
    </g>
  );
}

/** Both frames share one viewBox; the footer band is blank before, and names the model after (ruling 5). */
function Frame({ label, footer, children }: { readonly label: string; readonly footer?: string; readonly children: ReactNode }) {
  return (
    <svg
      className="board-svg"
      viewBox={`0 0 ${W} ${ROW * 2 + 24}`}
      role="img"
      aria-label={footer ? `${label} ${footer}` : label}
      style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)' }}
    >
      <line x1="8" y1={ROW} x2={W - 8} y2={ROW} stroke="var(--rule, #ead9bf)" strokeWidth="3" />
      {children}
      {footer ? (
        <text x={W / 2} y={ROW * 2 + 16} textAnchor="middle" fontSize="13" fill="var(--ink-soft, #5a4636)">
          {footer}
        </text>
      ) : null}
    </svg>
  );
}

const MODEL_FOOTER = 'Drawn model, not a recording. Pluck a real ruler to hear it.';

const two = (r: Round): readonly [Setup, Setup] => [r.a, r.b];
const nameOf = (r: Round, s: Setup): 1 | 2 => (s === r.a ? 1 : 2);

function setupLabel(r: Round): string {
  return two(r)
    .map((s, i) => `Ruler ${i + 1} sticks out ${s.out} cm. ${PLUCK_WORDS(s)}`)
    .join(' ');
}

function outcomeLabel(r: Round): string {
  const [a, b] = two(r);
  return `Ruler 1: ${swingLabel(a, b)}, ${noteLabel(a, b)}. Ruler 2: ${swingLabel(b, a)}, ${noteLabel(b, a)}.`;
}

function SetupFrame({ round, focus, pick }: { readonly round: Round; readonly focus: Focus; readonly pick: Pick | null }) {
  return (
    <Frame label={setupLabel(round)}>
      <PickMark pick={pick} />
      <SetupRow s={round.a} n={1} focus={focus} />
      <SetupRow s={round.b} n={2} focus={focus} />
      <EqualsMark pick={pick} />
    </Frame>
  );
}

function OutcomeFrame({ round, focus, pick = null }: { readonly round: Round; readonly focus: Focus; readonly pick?: Pick | null }) {
  return (
    <Frame label={outcomeLabel(round)} footer={MODEL_FOOTER}>
      <PickMark pick={pick} />
      <OutcomeRow s={round.a} o={round.b} n={1} focus={focus} />
      <OutcomeRow s={round.b} o={round.a} n={2} focus={focus} />
    </Frame>
  );
}

/** A fact about the board, pointing at the one thing that decides the answer. */
function hintLine(r: Round): string {
  const [a, b] = two(r);
  switch (focusOf(r.ask)) {
    case 'finger':
      return `Ruler ${a.held ? 2 : 1} is let go. Ruler ${a.held ? 1 : 2} is held down.`;
    case 'length':
      return a.out === b.out
        ? `Both rulers stick out ${a.out} cm past the table.`
        : `Ruler 1 sticks out ${a.out} cm. Ruler 2 sticks out ${b.out} cm.`;
    case 'push': {
      const hard = a.pluck === 'hard' ? 1 : 2;
      return `Both stick out ${a.out} cm. Ruler ${hard} is pushed down further.`;
    }
  }
}

function why(r: Round): string {
  const [a, b] = two(r);
  if (r.ask === 'sound') {
    const free = a.held ? 2 : 1;
    return `Ruler ${free} is let go, so it vibrates: it swings back and forth, fast. That shakes the air, and the shaking reaches your ear as sound. Ruler ${3 - free} is held still: no swing, no sound.`;
  }
  if (a.out === b.out) {
    const hard = a.pluck === 'hard' ? 1 : 2;
    return `Both stick out ${a.out} cm, so both swing just as fast: the same note. Ruler ${hard} was pushed down further, so it swings wider. A wider swing is louder, not higher.`;
  }
  const short = a.out < b.out ? a : b;
  const long = short === a ? b : a;
  const base = `Ruler ${nameOf(r, short)} sticks out ${short.out} cm and Ruler ${nameOf(r, long)} sticks out ${long.out} cm. The shorter part swings faster: a higher note. The longer part swings slower: a lower note.`;
  if (a.pluck === b.pluck) return base;
  const hard = a.pluck === 'hard' ? a : b;
  return hard === short
    ? `${base} Ruler ${nameOf(r, hard)} is higher because it is shorter, not because it was pushed further.`
    : `${base} Pushing Ruler ${nameOf(r, hard)} further made its swing wider, not its note higher.`;
}

const SAME: Record<Ask, string | null> = {
  sound: null,
  higher: 'Same note',
  lower: 'Same note',
  louder: 'Just as loud',
  softer: 'Just as loud',
};

/* ------------------------------------------------------ answer buttons -- */

/** Thumbnail scale: the button ruler is the board ruler at under half size, same edge, same overhang. */
const T_PX = 4;
const T_EDGE = 34;
const T_Y = 30;
const T_DEPTH: Record<Pluck, number> = { gentle: 5, hard: 11 };

function thumbPath(s: Setup): string {
  const L = s.out * T_PX;
  const d = T_DEPTH[s.pluck];
  const pts = [`M2 ${T_Y}`, `L${T_EDGE} ${T_Y}`];
  for (let i = 1; i <= 10; i += 1) {
    const u = i / 10;
    pts.push(`L${(T_EDGE + L * u).toFixed(1)} ${(T_Y + (d * u * u * (3 - u)) / 2).toFixed(1)}`);
  }
  return pts.join(' ');
}

/**
 * One ruler as the board draws it, small: the table edge, the overhang to
 * scale, the tip pushed down as far as on the board, and the up arrow (let go)
 * or the barred down arrow (held). The badge matches the row's badge.
 */
function RulerThumb({ s, n }: { readonly s: Setup; readonly n: 1 | 2 }) {
  const tx = T_EDGE + s.out * T_PX;
  const ty = T_Y + T_DEPTH[s.pluck];
  const ax = tx - 14;
  return (
    <svg viewBox="0 0 112 64" width="112" height="64" aria-hidden="true" focusable="false">
      <rect x="2" y={T_Y + 3} width={T_EDGE - 2} height="7" fill={WOOD} stroke={INK} strokeWidth="1.5" />
      <rect x="2" y={T_Y + 10} width={T_EDGE - 2} height="9" fill={WOOD_DEEP} stroke={INK} strokeWidth="1.5" />
      <path d={thumbPath(s)} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d={thumbPath(s)} fill="none" stroke={PLASTIC} strokeWidth="3" strokeLinecap="round" />
      <circle cx={tx} cy={ty - 4} r="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
      {s.held ? (
        <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d={`M${ax} 6 V${T_Y - 6} M${ax - 4} ${T_Y - 11} L${ax} ${T_Y - 6} L${ax + 4} ${T_Y - 11} M${ax - 6} ${T_Y - 3} h12`} />
        </g>
      ) : (
        <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d={`M${ax} 6 V${T_Y - 6} M${ax - 4} 11 L${ax} 6 L${ax + 4} 11`} />
        </g>
      )}
      <Badge n={n} x={14} y={14} r={11} />
      {Array.from({ length: s.out }, (_, i) => (
        <rect
          key={i}
          x={T_EDGE + i * T_PX + 0.4}
          y="54"
          width={T_PX - 0.8}
          height="6"
          fill={CM_FIVE[Math.floor(i / 5) % 2]}
          stroke={INK}
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

/**
 * "The same", drawn as the outcome it predicts, one row per ruler with an
 * equals sign between the badges. Same note: the two tips trace the same
 * swings, just as fast (the board's "tip in one short moment" strip). Just as
 * loud: the two rulers swing just as wide (the board's swing and width bar).
 */
function SameThumb({ ask }: { readonly ask: Ask }) {
  const note = ask === 'higher' || ask === 'lower';
  if (note) {
    const wave = (y: number) => {
      const pts: string[] = [];
      for (let i = 0; i <= 64; i += 1) {
        const u = i / 64;
        pts.push(`${(30 + 78 * u).toFixed(1)},${(y + 7 * Math.cos(2 * Math.PI * 4 * u)).toFixed(1)}`);
      }
      return <polyline points={pts.join(' ')} fill="none" stroke={TEAL} strokeWidth="3" strokeLinejoin="round" />;
    };
    return (
      <svg viewBox="0 0 112 64" width="112" height="64" aria-hidden="true" focusable="false">
        <rect x="26" y="4" width="84" height="24" rx="5" fill="var(--science-tint, #dcf3ea)" />
        <rect x="26" y="36" width="84" height="24" rx="5" fill="var(--science-tint, #dcf3ea)" />
        {wave(16)}
        {wave(48)}
        <Badge n={1} x={12} y={14} r={10} />
        <Badge n={2} x={12} y={50} r={10} />
        <path d="M6 29 h12 M6 35 h12" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  /** One row: the board's swing, small — the ruler at rest, both ends of its swing dashed, and the width bar. */
  const row = (c: number) => {
    const bend = (d: number) => {
      const pts = [`M24 ${c}`, `L32 ${c}`];
      for (let i = 1; i <= 8; i += 1) {
        const u = i / 8;
        pts.push(`L${(32 + 56 * u).toFixed(1)} ${(c + (d * u * u * (3 - u)) / 2).toFixed(1)}`);
      }
      return pts.join(' ');
    };
    return (
      <g>
        <rect x="24" y={c + 3} width="8" height="9" fill={WOOD} stroke={INK} strokeWidth="1.5" />
        <path d={bend(-10)} fill="none" stroke={INK} strokeWidth="3.5" strokeDasharray="4 3" opacity="0.6" />
        <path d={bend(10)} fill="none" stroke={INK} strokeWidth="3.5" strokeDasharray="4 3" opacity="0.6" />
        <path d={bend(0)} fill="none" stroke={INK} strokeWidth="5" />
        <path d={bend(0)} fill="none" stroke={PLASTIC} strokeWidth="2.5" />
        <g stroke={INK_SOFT} strokeWidth="3" strokeLinecap="round">
          <line x1="100" y1={c - 10} x2="100" y2={c + 10} />
          <line x1="95" y1={c - 10} x2="105" y2={c - 10} />
          <line x1="95" y1={c + 10} x2="105" y2={c + 10} />
        </g>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 112 64" width="112" height="64" aria-hidden="true" focusable="false">
      {row(16)}
      {row(48)}
      <Badge n={1} x={12} y={14} r={10} />
      <Badge n={2} x={12} y={50} r={10} />
      <path d="M6 29 h12 M6 35 h12" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const FACE: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s1)' };
const WORD: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 };

/** An answer button's face: the picture first, the word small underneath. */
function Face({ pic, word }: { readonly pic: ReactNode; readonly word: string }) {
  return (
    <span style={FACE}>
      {pic}
      <span style={WORD}>{word}</span>
    </span>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const help = stage === 'hint' || stage === 'worked';
  const focus: Focus = help ? focusOf(round.ask) : null;
  const same = round.allowSame ? SAME[round.ask] : null;
  const opts: ReadonlyArray<readonly [Pick, string, ReactNode]> = [
    ['a', 'Ruler 1', <RulerThumb key="a" s={round.a} n={1} />],
    ['b', 'Ruler 2', <RulerThumb key="b" s={round.b} n={2} />],
    ...(same ? [['same', same, <SameThumb key="same" ask={round.ask} />] as const] : []),
  ];
  return (
    <div className="board board--sound">
      {stage === 'worked' ? (
        <OutcomeFrame round={round} focus={focus} pick={answer} />
      ) : (
        <SetupFrame round={round} focus={focus} pick={answer} />
      )}
      <div className="choices" role="group" aria-label="Your guess">
        {opts.map(([v, text, pic]) => (
          <Choice
            key={v}
            selected={answer === v}
            onTap={() => setAnswer(v)}
            disabled={locked}
            ariaLabel={text}
          >
            <Face pic={pic} word={text} />
          </Choice>
        ))}
      </div>
      {stage === 'hint' ? <p className="board-caption">{hintLine(round)}</p> : null}
      {stage === 'worked' ? <p className="board-caption">{why(round)}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <OutcomeFrame round={round} focus={null} />;
}

export const whereDoesSoundComeFrom: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'where-does-sound-come-from',
  title: 'Where Does Sound Come From?',
  hook: 'Same ruler. A different note.',
  group: 'light',
  levels: ['Long or short', 'Hard or gentle', 'Note or loudness'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => prediction === round.truth,
  why,
  cover: 'art/games/where-does-sound-come-from.png',
  note: {
    what: 'Two pictures of the same ruler held flat at a table edge by Nanna\'s hand (the rust sleeve), its tip pushed down by a finger. He taps which one makes the higher note, the lower note, the louder sound or any sound, then presses Try to see each ruler swing.',
    expect:
      'Level 1 usually goes well: short sounds high, long sounds low. Level 2 is where it breaks: many five-year-olds say the harder pluck makes the higher note, because at home "turn it up" means louder. On level 3 expect him to pick the wider swing as higher, even when it is the longer ruler.',
    practising:
      'Sound comes from something vibrating. Pitch (high or low) depends on how fast it swings; loudness depends on how wide it swings. These are two separate things, and changing one variable at a time is how you tell them apart.',
    ask: "After Try on a level 2 round where both stick out the same: 'This one swings wider. Does that make it higher, louder, or both?'",
    next:
      'At the kitchen table, Nanna or Amma holds a 30 cm ruler flat with most of it on top, and he plucks the free end. Try 15 cm out, then 7 cm out, then the same length plucked gently and hard. Let him rest a finger on the table to feel it buzz; Nanna can say "Vinu!" (Listen!) before each pluck.',
    honest:
      'A still picture cannot make a sound; the swings in the strip are a drawn model, not a recording, and the real ruler is the lesson. Part of what you hear is the ruler slapping the table edge, at the same rate it swings, so the rule still holds. Getting every round right shows he can apply "shorter is higher, wider is louder" to a picture; it does not show he can hear the difference.',
    easier: 'Stay on level 1, and after each round make that exact length sing on a real ruler before the next one.',
    harder:
      'Ask him to find, on a real ruler, the overhang that matches a note you hum, then explain why plucking harder did not change it.',
    safety:
      'A grown-up holds the ruler down firmly. Use a flexible plastic ruler, not a thin metal one with sharp edges, and keep faces back from the free end, Mia\'s most of all: at two she will lean in close to look.',
  },
};

export default whereDoesSoundComeFrom;
