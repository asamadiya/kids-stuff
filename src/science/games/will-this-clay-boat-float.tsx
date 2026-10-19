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
 * a tap-to-choose between Floats and Sinks; it is compared, never marked
 * wrong. All drawing is static SVG with fixed states.
 *
 * Levels:
 *  1. One object at a time from a familiar set: a clay ball, a clay boat, a
 *     stone, a wooden block, a steel spoon, a steel bowl.
 *  2. Pairs that break the weight rule: a big log vs a small pebble; a clay
 *     ball vs the same clay as a boat.
 *  3. Load the boat: a clay boat carrying 2, 5 or 9 marbles. Too many and it
 *     sinks — the boat floats only while it can push aside its own weight.
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
  wood: 'Wood is light for its size. It pushes aside water that weighs more than it does, so it floats.',
  spoon: 'The steel spoon is thin and heavy for its size, so it sinks.',
  'steel-bowl': 'The bowl is the same steel as the spoon, but its shape holds air and pushes aside lots of water — it floats.',
  log: 'The log is far heavier than the pebble, and it still floats. Weight alone does not decide.',
  pebble: 'The pebble is tiny and light, and it still sinks. It is heavy for its size.',
  'loaded-boat': '',
};

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
  return { thing: 'loaded-boat', marbles, floats: marbles <= 5 };
}

function prompt(round: Round): string {
  return round.thing === 'loaded-boat'
    ? `${round.marbles} marbles in the clay boat. Float or sink?`
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

/** Draw the thing at a height: 'above' (held over the tub), 'top' (floating), 'bottom' (sunk). */
function ThingShape({ thing, at, marbles = 0 }: { readonly thing: Thing; readonly at: 'above' | 'top' | 'bottom'; readonly marbles?: number }) {
  const y = at === 'above' ? 40 : at === 'top' ? WATER_Y - 14 : 214;
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
    case 'loaded-boat': {
      const ms = Array.from({ length: marbles }, (_, i) => (
        <circle key={i} cx={x - 30 + (i % 5) * 15} cy={y - 16 - Math.floor(i / 5) * 12} r="6" fill="#3e7fb2" stroke="#24170f" strokeWidth="2" />
      ));
      return (
        <g>
          <path d={`M${x - 52} ${y - 12} h104 l-14 26 h-76 z`} fill="#c86b4a" stroke="#24170f" strokeWidth="3" />
          {ms}
        </g>
      );
    }
  }
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved';
  return (
    <div className="board board--float">
      <Tub label={`${NAME[round.thing]}, held above a tub of water`}>
        <ThingShape thing={round.thing} at="above" marbles={round.marbles} />
      </Tub>
      <div className="choices" role="group" aria-label="Your guess">
        <Choice selected={answer === 'floats'} onTap={() => setAnswer('floats')} disabled={locked}>
          Floats
        </Choice>
        <Choice selected={answer === 'sinks'} onTap={() => setAnswer('sinks')} disabled={locked}>
          Sinks
        </Choice>
      </div>
      {stage === 'hint' || stage === 'worked' ? (
        <p className="board-caption">Look at its shape. Is it tight and small for its weight, or wide and full of air?</p>
      ) : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return (
    <Tub label={`${NAME[round.thing]} ${round.floats ? 'floats' : 'sinks to the bottom'}`}>
      <ThingShape thing={round.thing} at={round.floats ? 'top' : 'bottom'} marbles={round.marbles} />
    </Tub>
  );
}

function why(round: Round): string {
  if (round.thing === 'loaded-boat') {
    return round.floats
      ? `With ${round.marbles} marbles the boat still pushes aside enough water to hold itself and its load. It floats lower.`
      : `${round.marbles} marbles is too heavy. The boat cannot push aside enough water to hold it all, so it sinks.`;
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
    what: 'He sees one object held over a tub of water, taps Floats or Sinks, then presses Try to see it land, beside the picture he started from.',
    expect: 'Most five-year-olds say heavy things sink and light things float. The log and the pebble (level 2) and the clay ball against the clay boat are built to break that rule. Expect surprise, and expect him to want to try it for real.',
    practising: 'Floating depends on how much water an object pushes aside, not on weight alone. Making a prediction before looking, and changing your mind when the evidence says so.',
    ask: "When the clay boat floats: 'It is the same clay as the ball that sank. What changed?'",
    next: 'Do it in the sink: one ball of play-dough or plasticine, then flatten it into a wide boat with walls. Count how many coins it holds before it sinks.',
    honest: "A screen can only show what happens, not make him feel the water push back. The real tub of water is the lesson; this is the warm-up. 'Pushes aside water' is a first idea, not a full explanation of buoyancy.",
    easier: 'Stay on level 1 and do each one in a real bowl of water as you go.',
    harder: 'On level 3, ask him to predict the exact number of marbles at which the boat sinks.',
    safety: 'Water play needs an adult there the whole time; keep the two-year-old away from marbles.',
  },
};

export default willThisClayBoatFloat;
