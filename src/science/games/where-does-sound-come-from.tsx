import type { ReactNode } from 'react';
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
 * Shape: two tries with the same ruler, stacked in one frame (Ruler 1 above,
 * Ruler 2 below). The child taps which one makes the higher note, the lower
 * note, the louder sound, or any sound at all. The outcome draws the SAME
 * frame with each ruler's swing width (dashed ghosts at both ends of the
 * swing), the tip's swings over one short moment, and note/loudness labels.
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
const SLEEVE = '#b4532a'; // Papa's rust shirt
const WOOD = '#b7773f';
const WOOD_DEEP = '#8a5528';
const TEAL = 'var(--science, #0d8063)';
const TEAL_DEEP = 'var(--science-deep, #075c46)';
const GOLD = 'var(--gold, #f2a900)';

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

/** The table, and a grown-up's hand pressing the ruler flat just behind the edge. */
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

/** A measuring bracket under the part that sticks out past the table. */
function Bracket({ s, focus }: { readonly s: Setup; readonly focus: boolean }) {
  const x2 = tipX(s);
  const col = focus ? GOLD : INK;
  const w = focus ? 5 : 2.5;
  return (
    <g>
      <line x1={EDGE} y1="106" x2={x2} y2="106" stroke={col} strokeWidth={w} />
      <line x1={EDGE} y1="100" x2={EDGE} y2="112" stroke={col} strokeWidth={w} />
      <line x1={x2} y1="100" x2={x2} y2="112" stroke={col} strokeWidth={w} />
      <text x={(EDGE + x2) / 2} y="129" textAnchor="middle" fontSize="16" fontWeight="700" fill={INK}>
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

function RowLabel({ n }: { readonly n: 1 | 2 }) {
  return (
    <text x="12" y="24" fontSize="18" fontWeight="700" fill={INK}>
      Ruler {n}
    </text>
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
      {children}
      <line x1="8" y1={ROW} x2={W - 8} y2={ROW} stroke="var(--rule, #ead9bf)" strokeWidth="3" />
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

function SetupFrame({ round, focus }: { readonly round: Round; readonly focus: Focus }) {
  return (
    <Frame label={setupLabel(round)}>
      <SetupRow s={round.a} n={1} focus={focus} />
      <SetupRow s={round.b} n={2} focus={focus} />
    </Frame>
  );
}

function OutcomeFrame({ round, focus }: { readonly round: Round; readonly focus: Focus }) {
  return (
    <Frame label={outcomeLabel(round)} footer={MODEL_FOOTER}>
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

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const help = stage === 'hint' || stage === 'worked';
  const focus: Focus = help ? focusOf(round.ask) : null;
  const same = round.allowSame ? SAME[round.ask] : null;
  const opts: ReadonlyArray<readonly [Pick, string]> = same
    ? [['a', 'Ruler 1'], ['b', 'Ruler 2'], ['same', same]]
    : [['a', 'Ruler 1'], ['b', 'Ruler 2']];
  return (
    <div className="board board--sound">
      {stage === 'worked' ? <OutcomeFrame round={round} focus={focus} /> : <SetupFrame round={round} focus={focus} />}
      <div className="choices" role="group" aria-label="Your guess">
        {opts.map(([v, text]) => (
          <Choice
            key={v}
            selected={answer === v}
            onTap={() => setAnswer(v)}
            disabled={locked}
          >
            {text}
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
    what: 'Two pictures of the same ruler held flat at a table edge, its tip pushed down by a finger. He taps which one makes the higher note, the lower note, the louder sound or any sound, then presses Try to see each ruler swing.',
    expect:
      'Level 1 usually goes well: short sounds high, long sounds low. Level 2 is where it breaks: many five-year-olds say the harder pluck makes the higher note, because at home "turn it up" means louder. On level 3 expect him to pick the wider swing as higher, even when it is the longer ruler.',
    practising:
      'Sound comes from something vibrating. Pitch (high or low) depends on how fast it swings; loudness depends on how wide it swings. These are two separate things, and changing one variable at a time is how you tell them apart.',
    ask: "After Try on a level 2 round where both stick out the same: 'This one swings wider. Does that make it higher, louder, or both?'",
    next:
      'Hold a 30 cm ruler flat on the table with most of it on top, and let him pluck the free end. Try 15 cm out, then 7 cm out, then the same length plucked gently and hard. Let him rest a finger on the table to feel it buzz.',
    honest:
      'A still picture cannot make a sound; the swings in the strip are a drawn model, not a recording, and the real ruler is the lesson. Part of what you hear is the ruler slapping the table edge, at the same rate it swings, so the rule still holds. Getting every round right shows he can apply "shorter is higher, wider is louder" to a picture; it does not show he can hear the difference.',
    easier: 'Stay on level 1, and after each round make that exact length sing on a real ruler before the next one.',
    harder:
      'Ask him to find, on a real ruler, the overhang that matches a note you hum, then explain why plucking harder did not change it.',
    safety:
      'A grown-up holds the ruler down firmly. Use a flexible plastic ruler, not a thin metal one with sharp edges, and keep faces back from the free end.',
  },
};

export default whereDoesSoundComeFrom;
