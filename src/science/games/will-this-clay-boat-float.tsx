import { useId } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Will This Clay Boat Float? — the reference science game.
 *
 * Every other science game copies this file's shape. Read it first.
 *
 * Concept (advisor, physics 7): heavy things do not always sink. The SAME lump
 * of clay sinks as a ball and floats as a wide boat, because the boat pushes
 * aside more water. The misconception it fixes: "heavy things sink" and "clay
 * is a sinking material".
 *
 * Shape: predict → Try → before/after side by side → why. The prediction is
 * a tap-to-choose between two pictures: the same thing resting on the water
 * (Floats) and lying on the bottom (Sinks), each word small underneath. It is
 * compared, never marked wrong. Tapping a guess draws it on the tub at once —
 * a gold outline where the thing would end up, and a dashed arrow down to it —
 * so the guess sits in the Before pane beside what really happened. The clay
 * boat is drawn beside the ball it was pressed from, so "the same clay" is seen,
 * not read. All drawing is static SVG with fixed states.
 *
 * Levels:
 *  1. One object at a time from a familiar set: a clay ball, a clay boat, a
 *     stone, a wooden block, a steel spoon, a steel bowl.
 *  2. Pairs that break the weight rule: a big log vs a small pebble; a clay
 *     ball vs the same clay as a boat.
 *  3. Load the boat: the clay boat carrying 1 to 9 marbles. Each marble takes
 *     it deeper. It floats while the water it pushes aside, before the rim
 *     goes under, can weigh as much as the boat and its load. How many marbles
 *     that is belongs to THIS boat, not to boats: it is drawn as a dashed line
 *     on its side, where the water comes with five marbles in. A sixth takes
 *     the water over the rim. The grown-ups note says so too.
 *
 * The boat is drawn cut in half, so the inside shows: air while it floats,
 * water once it has gone under. The part of its side under the waterline is
 * tinted, so "lower in the water" is something he can see grow round to round.
 */

type Thing = 'clay-ball' | 'clay-boat' | 'stone' | 'wood' | 'spoon' | 'steel-bowl' | 'log' | 'pebble' | 'loaded-boat';

export interface Round {
  readonly thing: Thing;
  readonly floats: boolean;
  /** Level 3 only: marbles in the boat. */
  readonly marbles?: number;
}

export type Answer = 'floats' | 'sinks' | null;

const NAME: Record<Thing, string> = {
  'clay-ball': 'a ball of clay',
  'clay-boat': 'the same clay, made into a boat',
  stone: 'a stone',
  wood: 'a wooden block',
  spoon: 'a steel spoon',
  'steel-bowl': 'a steel bowl',
  log: 'a big log',
  pebble: 'a small pebble',
  'loaded-boat': 'the clay boat with marbles in it',
};

const WHY: Record<Thing, string> = {
  'clay-ball': 'A tight ball of clay pushes aside only a little water, less than its own weight, so it sinks.',
  'clay-boat': 'Spread wide, the same clay pushes aside much more water. That water pushes back up hard enough to hold it.',
  stone: 'A stone pushes aside less water than it weighs, so it sinks.',
  wood: 'Wood is light for its size, so it floats. It settles until the water it pushes aside weighs as much as the block.',
  spoon: 'The steel spoon is thin and heavy for its size, so it sinks.',
  'steel-bowl': 'The bowl is the same steel as the spoon, but its shape holds air and pushes aside lots of water — it floats.',
  log: 'The log is far heavier than the pebble, and it still floats. Weight alone does not decide.',
  pebble: 'The pebble is tiny and light, and it still sinks. It is heavy for its size.',
  'loaded-boat': '',
};

/*
 * The clay boat as a model, in drawing units, so the picture IS the rule. Its
 * walls are straight, so each marble takes it the same step deeper. It floats
 * while the water it must push aside to hold its load comes no higher than its
 * rim; past that, water pours over the rim and it sinks.
 */
/** Height of its walls. */
const HULL = 58;
/** How deep it sits with nothing in it. */
const EMPTY = 6;
/** How much deeper each marble takes it. */
const PER_MARBLE = 9;
/** How deep it must sit to hold `n` marbles. More than HULL: the water comes over the rim. */
const draft = (n: number) => EMPTY + n * PER_MARBLE;
/** The most marbles THIS boat carries with its rim still above the water (5). Its dashed line marks that depth. */
const CAPACITY = Math.floor((HULL - EMPTY) / PER_MARBLE);

export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) {
    const order: Thing[] = ['clay-ball', 'wood', 'spoon', 'clay-boat', 'stone', 'steel-bowl'];
    const t = order[k];
    return { thing: t, floats: t === 'wood' || t === 'clay-boat' || t === 'steel-bowl' };
  }
  if (level === 2) {
    const order: Thing[] = ['log', 'pebble', 'clay-ball', 'clay-boat', 'steel-bowl', 'spoon'];
    const t = order[k];
    return { thing: t, floats: t === 'log' || t === 'clay-boat' || t === 'steel-bowl' };
  }
  const marbles = [2, 9, 5, 1, 7, 4][k];
  return { thing: 'loaded-boat', marbles, floats: marbles <= CAPACITY };
}

const marblesWord = (n: number) => `${n} ${n === 1 ? 'marble' : 'marbles'}`;

/** What the screen-reader labels call this round's thing, with the load counted. */
const nameOf = (round: Round) =>
  round.thing === 'loaded-boat' ? `the clay boat with ${marblesWord(round.marbles ?? 0)} in it` : NAME[round.thing];

function prompt(round: Round): string {
  return round.thing === 'loaded-boat'
    ? `${marblesWord(round.marbles ?? 0)} in the clay boat. Float or sink?`
    : `Will ${NAME[round.thing]} float or sink?`;
}

/* --------------------------------------------------------------- drawing -- */

const WATER_Y = 150;

function Tub({ children, label }: { readonly children: React.ReactNode; readonly label: string }) {
  return (
    <svg className="board-svg" viewBox="0 0 400 260" role="img" aria-label={label}>
      <rect x="40" y="70" width="320" height="170" rx="16" fill="#f5f0e6" stroke="#24170f" strokeWidth="4" />
      <rect x="44" y={WATER_Y} width="312" height="86" rx="12" fill="#8fc3e8" />
      <line x1="44" y1={WATER_Y} x2="356" y2={WATER_Y} stroke="#3e7fb2" strokeWidth="3" />
      {children}
    </svg>
  );
}

type At = 'above' | 'top' | 'bottom';

const INK = '#24170f';
const GOLD = '#f2a900';
const CLAY = '#c86b4a';
const WATER = '#8fc3e8';
const WATER_LINE = '#3e7fb2';
/** Inside the boat while it floats: air, lighter than the tub wall behind it. */
const AIR = '#fffdf7';

/** Where the boat's base sits. Floating, it sits as deep as its load needs; a guess of "floats" for a load it cannot hold is drawn at its deepest. */
function boatBottom(at: At, marbles: number): number {
  if (at === 'above') return 66;
  if (at === 'bottom') return 234;
  return WATER_Y + draft(Math.min(marbles, CAPACITY));
}

/** Where to centre the guess ring and the Same-clay arrow on a thing at a height. */
function centreY(thing: Thing, at: At, marbles: number): number {
  if (thing === 'clay-boat' || thing === 'loaded-boat') return boatBottom(at, marbles) - HULL / 2;
  return at === 'above' ? 40 : at === 'top' ? WATER_Y - 14 : 214;
}

/**
 * The clay boat, cut in half so the inside shows, its base at `bottom`. The
 * part of its side under the waterline is tinted. Inside is air while it
 * floats and water once it has sunk, with arrows over the rim where the water
 * came in. `loadLine`: the dashed line where the water comes with CAPACITY
 * marbles in, tagged with that number.
 */
function Boat({ bottom, marbles, loadLine }: { readonly bottom: number; readonly marbles: number; readonly loadLine: boolean }) {
  const clip = `hull${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const x = 200;
  const rim = bottom - HULL;
  const floor = bottom - 7;
  const sunk = rim > WATER_Y;
  const hull =
    `M${x - 56} ${rim} V${bottom - 8} Q${x - 56} ${bottom} ${x - 48} ${bottom} H${x + 48} Q${x + 56} ${bottom} ${x + 56} ${bottom - 8} V${rim} ` +
    `H${x + 49} V${floor - 4} Q${x + 49} ${floor} ${x + 45} ${floor} H${x - 45} Q${x - 49} ${floor} ${x - 49} ${floor - 4} V${rim} Z`;
  const fill = bottom - draft(CAPACITY);
  // Marbles lie on the floor, five to a row, the next row in the dips of the one below.
  const ms = Array.from({ length: marbles }, (_, i) => {
    const row = Math.floor(i / 5);
    const inRow = Math.min(5, marbles - row * 5);
    return (
      <circle key={i} cx={x + (i % 5 - (inRow - 1) / 2) * 14} cy={floor - 7 - row * 12} r="6.5" fill={WATER_LINE} stroke={INK} strokeWidth="2" />
    );
  });
  return (
    <g>
      <rect x={x - 50} y={rim} width="100" height={floor - rim} fill={sunk ? WATER : AIR} />
      {ms}
      <path d={hull} fill={CLAY} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {bottom > WATER_Y ? (
        <>
          <clipPath id={clip}>
            <path d={hull} />
          </clipPath>
          <rect x={x - 60} y={Math.max(rim - 4, WATER_Y)} width="120" height={bottom + 4 - Math.max(rim - 4, WATER_Y)} fill="#1c4fa0" opacity="0.35" clipPath={`url(#${clip})`} />
        </>
      ) : null}
      {bottom > WATER_Y && !sunk ? (
        <>
          <line x1={x - 58} y1={WATER_Y} x2={x - 48} y2={WATER_Y} stroke={WATER_LINE} strokeWidth="3" />
          <line x1={x + 48} y1={WATER_Y} x2={x + 58} y2={WATER_Y} stroke={WATER_LINE} strokeWidth="3" />
        </>
      ) : null}
      {sunk ? (
        <g fill="none" stroke="#1c4fa0" strokeWidth="3" strokeLinecap="round">
          <path d={`M${x - 72} ${rim - 14} Q${x - 54} ${rim - 22} ${x - 42} ${rim + 8}`} />
          <path d={`M${x - 48} ${rim + 8} L${x - 42} ${rim + 8} L${x - 42} ${rim + 2}`} />
          <path d={`M${x + 72} ${rim - 14} Q${x + 54} ${rim - 22} ${x + 42} ${rim + 8}`} />
          <path d={`M${x + 48} ${rim + 8} L${x + 42} ${rim + 8} L${x + 42} ${rim + 2}`} />
        </g>
      ) : null}
      {loadLine ? (
        <g>
          <line x1={x - 66} y1={fill} x2={x + 66} y2={fill} stroke={INK} strokeWidth="2.5" strokeDasharray="7 5" />
          <circle cx={x + 78} cy={fill} r="6.5" fill={WATER_LINE} stroke={INK} strokeWidth="2" />
          <text x={x + 90} y={fill + 6} fontSize="17" fontWeight="700" fill={INK} style={{ fontFamily: 'var(--font-display)' }}>
            {CAPACITY}
          </text>
        </g>
      ) : null}
    </g>
  );
}

/** Draw the thing at a height: 'above' (held over the tub), 'top' (floating), 'bottom' (sunk). */
function ThingShape({ thing, at, marbles = 0 }: { readonly thing: Thing; readonly at: At; readonly marbles?: number }) {
  const y = centreY(thing, at, marbles);
  const x = 200;
  switch (thing) {
    case 'clay-ball':
      return <circle cx={x} cy={y} r="20" fill="#c86b4a" stroke="#24170f" strokeWidth="3" />;
    case 'pebble':
      return <ellipse cx={x} cy={y + 4} rx="11" ry="8" fill="#8a8a8a" stroke="#24170f" strokeWidth="3" />;
    case 'stone':
      return <ellipse cx={x} cy={y} rx="26" ry="18" fill="#8a8a8a" stroke="#24170f" strokeWidth="3" />;
    case 'wood':
      return <rect x={x - 34} y={y - 16} width="68" height="32" rx="4" fill="#c8913f" stroke="#24170f" strokeWidth="3" />;
    case 'log':
      return (
        <g>
          <rect x={x - 90} y={y - 18} width="180" height="36" rx="18" fill="#9b6a32" stroke="#24170f" strokeWidth="3" />
          <ellipse cx={x + 90} cy={y} rx="12" ry="18" fill="#d8a866" stroke="#24170f" strokeWidth="3" />
        </g>
      );
    case 'spoon':
      return (
        <g>
          <rect x={x - 46} y={y - 4} width="60" height="8" rx="4" fill="#c9ced6" stroke="#24170f" strokeWidth="2.5" />
          <ellipse cx={x + 26} cy={y} rx="16" ry="11" fill="#c9ced6" stroke="#24170f" strokeWidth="2.5" />
        </g>
      );
    case 'steel-bowl':
      return <path d={`M${x - 46} ${y - 12} h92 q-8 34 -46 34 q-38 0 -46 -34 z`} fill="#c9ced6" stroke="#24170f" strokeWidth="3" />;
    case 'clay-boat':
    case 'loaded-boat':
      return <Boat bottom={boatBottom(at, marbles)} marbles={marbles} loadLine={thing === 'loaded-boat'} />;
  }
}

/** Half the drawn width of each thing, so the guess ring fits round it. */
const HALF: Record<Thing, number> = {
  'clay-ball': 20,
  pebble: 11,
  stone: 26,
  wood: 34,
  log: 102,
  spoon: 46,
  'steel-bowl': 46,
  'clay-boat': 56,
  'loaded-boat': 56,
};

type Guess = Exclude<Answer, null>;

const GUESSES: readonly (readonly [Guess, string])[] = [
  ['floats', 'Floats'],
  ['sinks', 'Sinks'],
];

/** A guess button's picture: this round's thing resting on the water, or lying on the bottom. */
function GuessPicture({ round, value }: { readonly round: Round; readonly value: Guess }) {
  return (
    <svg viewBox="76 84 248 164" width="124" height="82" aria-hidden="true">
      <rect x="84" y="100" width="232" height="140" rx="12" fill="#f5f0e6" stroke={INK} strokeWidth="4" />
      <rect x="88" y={WATER_Y} width="224" height="86" rx="10" fill={WATER} />
      <line x1="88" y1={WATER_Y} x2="312" y2={WATER_Y} stroke={WATER_LINE} strokeWidth="3" />
      <ThingShape thing={round.thing} at={value === 'floats' ? 'top' : 'bottom'} marbles={round.marbles} />
    </svg>
  );
}

/** The child's guess, drawn on the tub the moment it is tapped: a faint copy where it would end up, ringed in gold, with an arrow down to it. */
function GuessMark({ round, value }: { readonly round: Round; readonly value: Guess }) {
  const at = value === 'floats' ? 'top' : 'bottom';
  const boat = round.thing === 'clay-boat' || round.thing === 'loaded-boat';
  const cy = centreY(round.thing, at, round.marbles ?? 0) - (boat ? 0 : 6);
  const ry = boat ? HULL / 2 + 10 : 28;
  // The tub's floor is at 240; a ring round something lying on it must not poke through.
  const ringRy = Math.min(ry, 236 - cy);
  const tip = cy - ringRy - 2;
  // A boat at the surface rings high in the tub; start the shaft far enough
  // above the head that it still reads as an arrow, not a lone triangle.
  const tail = Math.min(68, tip - 40);
  return (
    <g aria-hidden="true">
      <g opacity="0.4">
        <ThingShape thing={round.thing} at={at} marbles={round.marbles} />
      </g>
      <ellipse cx="200" cy={cy} rx={Math.max(HALF[round.thing] + 12, 30)} ry={ringRy} fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray="10 7" />
      <line x1="200" y1={tail} x2="200" y2={tip - 10} stroke={GOLD} strokeWidth="5" strokeDasharray="8 6" />
      <path d={`M188 ${tip - 12} L212 ${tip - 12} L200 ${tip} z`} fill={GOLD} stroke={INK} strokeWidth="2" />
    </g>
  );
}

/**
 * For the clay boat: the ball it was pressed from, with an arrow to the boat
 * wherever the boat is drawn — "the same clay" shown, not said.
 */
function SameClay({ tx, ty }: { readonly tx: number; readonly ty: number }) {
  const bx = 78;
  const by = 40;
  const a = Math.atan2(ty - by, tx - bx);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const pt = (back: number, side: number) => `${tx - back * c - side * s} ${ty - back * s + side * c}`;
  return (
    <g aria-hidden="true">
      <circle cx={bx} cy={by} r="20" fill={CLAY} stroke={INK} strokeWidth="3" />
      <path d={`M${bx + 26 * c} ${by + 26 * s} L${pt(12, 0)}`} stroke={INK} strokeWidth="4" fill="none" />
      <path d={`M${pt(0, 0)} L${pt(14, 8)} L${pt(14, -8)} z`} fill={INK} />
    </g>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved';
  return (
    <div className="board board--float">
      <Tub label={`${nameOf(round)}, held above a tub of water${answer ? `; your guess: it ${answer}` : ''}`}>
        {round.thing === 'clay-boat' ? <SameClay tx={144} ty={centreY('clay-boat', 'above', 0)} /> : null}
        {answer ? <GuessMark round={round} value={answer} /> : null}
        <ThingShape thing={round.thing} at="above" marbles={round.marbles} />
      </Tub>
      <div className="choices" role="group" aria-label="Your guess">
        {GUESSES.map(([value, text]) => (
          <Choice key={value} selected={answer === value} onTap={() => setAnswer(value)} disabled={locked} ariaLabel={text}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <GuessPicture round={round} value={value} />
              <span style={{ fontSize: 'var(--t-xs)', fontWeight: 600 }}>{text}</span>
            </span>
          </Choice>
        ))}
      </div>
      {(stage === 'hint' || stage === 'worked') && round.thing === 'loaded-boat' ? (
        <p className="board-caption">
          The dashed line: where the water comes with {CAPACITY} marbles in. Every marble takes the boat deeper. Past the line, the rim goes under.
        </p>
      ) : null}
      {(stage === 'hint' || stage === 'worked') && round.thing !== 'loaded-boat' ? (
        <p className="board-caption">Look at its shape. Is it tight and small for its weight, or wide and full of air?</p>
      ) : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  const loaded = round.thing === 'loaded-boat';
  const result = round.floats
    ? loaded ? 'floats, lower in the water, its rim above the water' : 'floats'
    : loaded ? 'sinks to the bottom, with water over its rim' : 'sinks to the bottom';
  return (
    <Tub label={`${nameOf(round)} ${result}`}>
      {round.thing === 'clay-boat' ? <SameClay tx={144} ty={centreY('clay-boat', 'top', 0)} /> : null}
      <ThingShape thing={round.thing} at={round.floats ? 'top' : 'bottom'} marbles={round.marbles} />
    </Tub>
  );
}

function why(round: Round): string {
  if (round.thing === 'loaded-boat') {
    const n = marblesWord(round.marbles ?? 0);
    return round.floats
      ? `With ${n} the boat sits lower than when empty, but its rim is still above the water. It settles where the water it pushes aside weighs as much as the boat and its load.`
      : `${n} is more than this boat can carry. To hold them it would have to sit deeper than its rim, so water pours in and it sinks.`;
  }
  return WHY[round.thing];
}

export const willThisClayBoatFloat: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'will-this-clay-boat-float',
  title: 'Will This Clay Boat Float?',
  hook: 'Same clay. Different shape.',
  group: 'balance',
  levels: ['One thing', 'Heavy and light', 'Load the boat'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => (prediction === 'floats') === round.floats,
  why,
  cover: 'art/games/will-this-clay-boat-float.png',
  note: {
    what: "He sees one object held over a tub of water, taps Floats or Sinks, then presses Try to see it land, beside the picture he started from. On level 3 the clay boat carries marbles. The dashed line on its side is this model boat's limit: the water reaches it with five marbles in, and a sixth takes the rim under. Five belongs to this boat; a wider one, or one with taller walls, carries more.",
    expect: 'Most five-year-olds say heavy things sink and light things float. The log and the pebble (level 2) and the clay ball against the clay boat are built to break that rule. Expect surprise, and expect him to want to try it for real.',
    practising: 'Floating depends on how much water an object pushes aside, not on weight alone. Making a prediction before looking, and changing your mind when the evidence says so.',
    ask: "When the clay boat floats: 'It is the same clay as the ball that sank. What changed?'",
    next: 'Do it in the sink: one ball of play-dough or plasticine, then flatten it into a wide boat with walls. Count how many coins it holds before it sinks.',
    honest: "A screen can only show what happens, not make him feel the water push back. The real tub of water is the lesson; this is the warm-up. 'Pushes aside water' is a first idea, not a full explanation of buoyancy.",
    easier: 'Stay on level 1 and do each one in a real bowl of water as you go.',
    harder: 'On level 3, ask how to make a boat that carries more than five: wider, or taller walls? Then try both with the same lump of play-dough in the sink.',
    safety: 'Water play needs an adult there the whole time; keep the two-year-old away from marbles.',
  },
};

export default willThisClayBoatFloat;
