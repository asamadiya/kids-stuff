import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Start Higher, Roll Farther? — physics concept 4 (advisor): height stores
 * gravitational energy.
 *
 * The same toy car is let go — never pushed — from a marked height on a plank
 * ramp propped on a stack of six wooden blocks, and rolls out along a tiled
 * floor. Lifting the car higher stores more energy; the ramp only turns that
 * height into speed. Misconceptions it challenges: "the ramp makes the
 * energy", "a longer ramp sends it farther", "a steeper ramp sends it
 * farther".
 *
 * Shape: predict → Try → before/after side by side → why. The prediction is a
 * tap-to-choose; it is compared, never marked wrong. Static SVG states only.
 *
 * Model (labelled "Model result" on the outcome): on this floor each block of
 * starting height is worth two tiles of roll, measured from the foot of the
 * ramp. Real cars lose a little at the bump at the bottom and on a long ramp;
 * the grown-up note says so.
 *
 * Levels:
 *  1. The same ramp twice, the car let go from two heights.
 *  2. A long gentle ramp against a short steep one. Only the starting height
 *     decides; equal heights roll the same.
 *  3. One ramp, and a grey flag on the tile where the car stopped last time,
 *     labelled with that start's height. Forwards: from a new height, which
 *     tile? Backwards: how many blocks high to stop on a gold flag? Both need
 *     the rate read off last time's run (two tiles for every block), not just
 *     "higher is farther".
 *
 * Representation (advisor: "too much reading"): every answer button is a
 * picture of its outcome with the word small underneath: two floors with the
 * cars stopped far and near (or level), a run of floor tiles with the car on
 * the last one, a stack of blocks with the car on top. A height is always
 * counted blocks and a roll always counted tiles. On level 3 last time's run
 * stays on the board: a thin grey column of its blocks beside the stack, and
 * under the floor one small grey block under each pair of tiles it rolled, so
 * "one block of height is worth two tiles" is shown, not said. Tapping a guess
 * draws it on the board at once in teal: a frame round the chosen lane(s), a
 * hoop on the chosen tile, or the car lifted to the chosen height.
 */

/** One ramp: `span` px along the floor, the car let go `h` blocks up. */
export interface Lane {
  readonly span: number;
  readonly h: number;
}

export type Round =
  | { readonly kind: 'pair'; readonly a: Lane; readonly b: Lane }
  | {
      readonly kind: 'scale';
      /**
       * 'tile': the car is on the ramp; which tile will it stop on?
       * 'height': a gold flag marks a tile; how many blocks high must it start?
       */
      readonly ask: 'tile' | 'height';
      readonly lane: Lane;
      /** Starting height of the earlier run, drawn in grey with its stopping tile flagged. */
      readonly before: number;
      readonly options: readonly number[];
    };

type Pick = 'a' | 'b' | 'same';
export type Answer = Pick | number | null;

/** The model: each block of starting height gives two tiles of roll on this floor. */
const TILES_PER_BLOCK = 2;
const tiles = (h: number) => h * TILES_PER_BLOCK;
/** Tiles drawn on the floor; the highest start (5 blocks) reaches the last one. */
const FLOOR_TILES = 10;
/** Blocks in the stack the ramp rests on; a start can be no higher. */
const STACK = 6;
const blocks = (n: number) => `${n} block${n === 1 ? '' : 's'}`;
const twos = (n: number) => Array.from({ length: n }, () => '2').join(' + ');

const MID = 100;
const STEEP = 55;
const GENTLE = 150;
const mid = (h: number): Lane => ({ span: MID, h });
const steep = (h: number): Lane => ({ span: STEEP, h });
const gentle = (h: number): Lane => ({ span: GENTLE, h });

/** Level 1: [A's height, B's height] on the same ramp. */
const PAIRS_1: ReadonlyArray<readonly [number, number]> = [
  [1, 4],
  [5, 2],
  [2, 3],
  [4, 1],
  [3, 3],
  [2, 5],
];

/** Level 2: the long gentle ramp tempts one way, the steep one the other. */
const PAIRS_2: ReadonlyArray<readonly [Lane, Lane]> = [
  [gentle(3), steep(4)],
  [steep(3), gentle(3)],
  [gentle(5), steep(2)],
  [gentle(2), steep(4)],
  [steep(5), gentle(4)],
  [gentle(4), steep(4)],
];

/**
 * Level 3: [question, earlier height, new height] on the middle ramp, forwards
 * and backwards in turn. The earlier height is never 1 on a forwards question,
 * so the rate (tiles per block) has to be worked out from last time's run, and
 * never 5, so its flag stays clear of the right edge.
 */
const SCALE_3: ReadonlyArray<readonly ['tile' | 'height', number, number]> = [
  ['tile', 3, 5],
  ['height', 2, 5],
  ['tile', 2, 4],
  ['height', 1, 4],
  ['tile', 4, 2],
  ['height', 4, 2],
];

export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) {
    const [ha, hb] = PAIRS_1[k];
    return { kind: 'pair', a: mid(ha), b: mid(hb) };
  }
  if (level === 2) {
    const [a, b] = PAIRS_2[k];
    return { kind: 'pair', a, b };
  }
  const [ask, before, h] = SCALE_3[k];
  // Beside the model's answer, the tempting rules in order. Forwards: "height
  // does not matter" (last time's tiles), "one more block, one more tile", an
  // overshoot, "as many tiles as blocks". Backwards: "the tile number is the
  // height", "the same height as last time", then a block either side.
  // Every option is a tile on the floor or a block in the stack.
  const right = ask === 'tile' ? tiles(h) : h;
  const max = ask === 'tile' ? FLOOR_TILES : STACK;
  const lures =
    ask === 'tile'
      ? [tiles(before), tiles(before) + (h - before), right + (h > before ? 2 : -2), h]
      : [tiles(h), before, h + 1, h - 1];
  const wrong = lures.filter((n) => n >= 1 && n <= max && n !== right);
  const options = [right, ...new Set(wrong)].slice(0, 4).sort((x, y) => x - y);
  return { kind: 'scale', ask, lane: mid(h), before, options };
}

function winner(a: Lane, b: Lane): Pick {
  return a.h > b.h ? 'a' : a.h < b.h ? 'b' : 'same';
}

const sameRamp = (a: Lane, b: Lane) => a.span === b.span;

function prompt(round: Round): string {
  if (round.kind === 'scale') {
    const { before, lane, ask } = round;
    return ask === 'tile'
      ? `From ${blocks(before)} it rolled ${tiles(before)} tiles. Now from ${blocks(lane.h)}?`
      : 'How many blocks high to stop on the gold flag?';
  }
  return sameRamp(round.a, round.b)
    ? 'Same car, same ramp, let go. Which rolls farther?'
    : 'One long ramp, one short. Let go. Which rolls farther?';
}

function rightAnswer(round: Round): Pick | number {
  if (round.kind === 'scale') return round.ask === 'tile' ? tiles(round.lane.h) : round.lane.h;
  return winner(round.a, round.b);
}

function why(round: Round): string {
  if (round.kind === 'scale') {
    const { before, lane, ask } = round;
    const { h } = lane;
    const last = `From ${blocks(before)} it rolled ${tiles(before)} tiles: 2 tiles for each block of height.`;
    if (ask === 'height') {
      return `${last} ${tiles(h)} tiles is ${twos(h)}, so let it go ${blocks(h)} high. More height, more stored energy.`;
    }
    const sum = h === 1 ? 'just 2 tiles' : `${twos(h)} = ${tiles(h)} tiles`;
    return `${last} From ${blocks(h)}: ${sum}. ${h > before ? 'Higher stores more energy.' : 'Lower stores less energy.'}`;
  }
  const { a, b } = round;
  const w = winner(a, b);
  if (w === 'same') {
    return sameRamp(a, b)
      ? `Both cars start ${blocks(a.h)} high on the same ramp. Same height, same stored energy, so both stop on tile ${tiles(a.h)}.`
      : `Both cars start ${blocks(a.h)} high, so both stop on tile ${tiles(a.h)}. The long ramp is only a gentler way down. The starting height decides.`;
  }
  const hi = w === 'a' ? a : b;
  const lo = w === 'a' ? b : a;
  const [H, L] = w === 'a' ? ['A', 'B'] : ['B', 'A'];
  const trap = sameRamp(a, b)
    ? ''
    : hi.span < lo.span
      ? ` ${L}'s ramp is longer, but a ramp adds no energy.`
      : ` ${L}'s ramp is steeper, but steepness adds no energy.`;
  return `${H} starts ${blocks(hi.h)} high, ${L} only ${blocks(lo.h)}.${trap} Lifting a car higher stores more energy, so ${H} rolls to tile ${tiles(hi.h)} and ${L} to tile ${tiles(lo.h)}.`;
}

/* --------------------------------------------------------------- drawing -- */

// One scale for setup, hint, worked and outcome: every ramp foot sits at FOOT,
// so the floor tiles of two lanes line up and their stops compare directly.
const FOOT = 185;
const TW = 21;
const BH = 16;
const RISE = BH * STACK;
const BW = 28;
const INK = '#24170f';
const INK_SOFT = '#5a4636';
const GOLD = '#f2a900';
const WOOD = '#c8913f';
const PLANK = '#9b6a32';
const GREY = '#8a7a6a';
const EARLIER = '#d6cfc4';
/** The car of last time's run, parked grey on the tile it stopped on. */
const EARLIER_CAR = '#b3a796';
/** Both lanes carry the same toy car: colour must not look like a variable. */
const CAR = '#d9480f';
/** The child's own guess, drawn on the board the moment it is tapped. */
const GUESS = '#0d8063';
const GUESS_TINT = '#dcf3ea';
const GOLD_DEEP = '#b07a00';
const TILE_ODD = '#c8643c';
const TILE_EVEN = '#e09a6a';
const SLOT_EDGE = '#c9bba8';

type Show = 'setup' | 'hint' | 'worked' | 'outcome';

/** Where the car's wheels touch the plank when it starts `h` blocks up. */
const startOf = (lane: Lane, floorY: number) => {
  const f = lane.h / STACK;
  return { x: FOOT - lane.span * f, y: floorY - RISE * f };
};
const tilt = (span: number) => (Math.atan2(RISE, span) * 180) / Math.PI;
/** The middle of floor tile `n`, and of the tile the car stops on from `h` blocks. */
const tileX = (n: number) => FOOT + (n - 0.5) * TW;
const stopX = (h: number) => tileX(tiles(h));

/**
 * A toy car whose wheels touch (x, y); `lift` raises it off the plank's centre
 * line onto its surface. A ghost (dashed) car is where it was let go, or where
 * the worked answer says it will stop.
 */
function Car({
  x,
  y,
  rot = 0,
  ghost,
  lift = 0,
  tint = CAR,
  guess,
}: {
  readonly x: number;
  readonly y: number;
  readonly rot?: number;
  readonly ghost?: boolean;
  readonly lift?: number;
  /** Grey for last time's run; the car's own colour otherwise. */
  readonly tint?: string;
  /** The car where the child's guess lifted it: a thick teal edge. */
  readonly guess?: boolean;
}) {
  const paint = ghost
    ? { fill: 'none', stroke: tint, strokeWidth: 2, strokeDasharray: '4 3' }
    : { fill: tint, stroke: guess ? GUESS : INK, strokeWidth: guess ? 3 : 2 };
  const wheel = ghost ? { fill: 'none', stroke: tint, strokeWidth: 2 } : { fill: INK };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) translate(0 ${-lift})`}>
      <path d="M-7 -14 l3 -6 h8 l3 6 z" {...paint} />
      <rect x={-13} y={-15} width={26} height={10} rx={3} {...paint} />
      <circle cx={-7} cy={-4} r={4} {...wheel} />
      <circle cx={7} cy={-4} r={4} {...wheel} />
    </g>
  );
}

function Floor({ floorY, mark, guess }: { readonly floorY: number; readonly mark?: number; readonly guess?: number }) {
  return (
    <g>
      <rect x={0} y={floorY} width={400} height={12} fill="#e8d9c2" />
      {Array.from({ length: FLOOR_TILES }, (_, i) => {
        const n = i + 1;
        const bold = n === mark || n === guess;
        return (
          <g key={n}>
            <rect
              x={FOOT + i * TW}
              y={floorY}
              width={TW}
              height={12}
              fill={n === mark ? GOLD : n === guess ? GUESS_TINT : n % 2 ? TILE_ODD : TILE_EVEN}
              stroke={n === guess ? GUESS : INK}
              strokeWidth={n === guess ? 3 : 1}
            />
            <text x={FOOT + (i + 0.5) * TW} y={floorY + 24} fontSize={10} textAnchor="middle" fill={n === guess ? GUESS : bold ? INK : INK_SOFT} fontWeight={bold ? 700 : 400}>
              {n}
            </text>
          </g>
        );
      })}
      <line x1={0} y1={floorY} x2={400} y2={floorY} stroke={INK} strokeWidth={2} />
    </g>
  );
}

/**
 * Six numbered wooden blocks; the ramp rests on the top one. `right` is the
 * stack's right edge. `mark` paints blocks 1..mark gold, so a height is a
 * counted column of blocks. `earlier` is last time's height, kept on the board
 * as a thin grey column of that many blocks beside the stack. `guess` rings
 * blocks 1..guess in teal: the height the child has just tapped.
 */
function Stack({
  right,
  floorY,
  mark,
  earlier,
  guess,
}: {
  readonly right: number;
  readonly floorY: number;
  readonly mark?: number;
  readonly earlier?: number;
  readonly guess?: number;
}) {
  return (
    <g>
      {earlier
        ? Array.from({ length: earlier }, (_, i) => (
            <rect key={`e${i}`} x={right - BW - 16} y={floorY - (i + 1) * BH} width={13} height={BH} fill={EARLIER} stroke={GREY} strokeWidth={1.5} />
          ))
        : null}
      {Array.from({ length: STACK }, (_, i) => {
        const n = i + 1;
        const ringed = guess !== undefined && n <= guess;
        return (
          <g key={n}>
            <rect
              x={right - BW}
              y={floorY - n * BH}
              width={BW}
              height={BH}
              fill={mark !== undefined && n <= mark ? GOLD : WOOD}
              stroke={ringed ? GUESS : INK}
              strokeWidth={ringed ? 3 : 1.5}
            />
            <text x={right - BW / 2} y={floorY - n * BH + 12} fontSize={10} textAnchor="middle" fill={INK}>
              {n}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** The grey flag and grey car on the tile where the car stopped last time (level 3). */
function EarlierFlag({ floorY, before }: { readonly floorY: number; readonly before: number }) {
  const x = stopX(before);
  return (
    <g>
      <line x1={x} y1={floorY} x2={x} y2={floorY - 34} stroke={INK_SOFT} strokeWidth={2} />
      <path d={`M${x} ${floorY - 34} l16 6 l-16 6 z`} fill={EARLIER} stroke={GREY} strokeWidth={1.5} />
      <Car x={x} y={floorY} tint={EARLIER_CAR} />
    </g>
  );
}

/** The gold flag on the tile the car must reach (level 3, how-high questions). Flies left near the edge. */
function GoalFlag({ floorY, tile }: { readonly floorY: number; readonly tile: number }) {
  const x = tileX(tile);
  const dir = x > 360 ? -1 : 1;
  return (
    <g>
      <line x1={x} y1={floorY} x2={x} y2={floorY - 34} stroke={INK} strokeWidth={2} />
      <path d={`M${x} ${floorY - 34} l${16 * dir} 6 l${-16 * dir} 6 z`} fill={GOLD} stroke={INK} strokeWidth={1.5} />
    </g>
  );
}

/**
 * Under the floor: one bracket under each pair of tiles, and under each
 * bracket one small block, so a block of starting height is drawn beside the
 * two tiles of roll it is worth. Row one is last time's run in grey, on the
 * board from the start on level 3. Row two is this run in gold: brackets only
 * on a how-high hint, a block in each once worked.
 */
const PAIR_ROWS = { earlier: 28, now: 50 } as const;

function Pairs({ floorY, count, tone, filled = true }: { readonly floorY: number; readonly count: number; readonly tone: 'earlier' | 'now'; readonly filled?: boolean }) {
  const y = floorY + PAIR_ROWS[tone];
  const stroke = tone === 'earlier' ? GREY : GOLD_DEEP;
  const fill = tone === 'earlier' ? EARLIER : GOLD;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = FOOT + i * 2 * TW;
        return (
          <g key={i}>
            <path d={`M${x + 2} ${y} v5 h${2 * TW - 4} v-5`} fill="none" stroke={stroke} strokeWidth={2} />
            {filled ? <rect x={x + TW - 7} y={y + 8} width={14} height={12} fill={fill} stroke={stroke} strokeWidth={1.5} /> : null}
          </g>
        );
      })}
    </g>
  );
}

/**
 * One lane: stack, plank, floor tiles, car. Drawn identically for the setup
 * and the outcome, so the two panes compare at one scale.
 *  - setup: the car at its starting height (or, when the height is the
 *    question, parked beside the stack with a question mark). On level 3,
 *    last time's run stays on the board: its blocks in grey beside the stack,
 *    its car grey on its tile, and a grey block under each pair of tiles.
 *  - hint: plus the gold blocks and a level line showing that height (unless
 *    the height is the question; then gold brackets over the pairs of tiles
 *    up to the gold flag).
 *  - worked: plus a dashed car on the tile where it will stop, and a gold
 *    block under each pair of tiles it rolls.
 *  - outcome: a dashed car where it was let go, the car on its stopping tile.
 * The child's guess is drawn in teal the moment it is tapped: `chosen` frames
 * the lane, `guessTile` puts a teal car on a tile, `guessHeight` lifts the car
 * to that many blocks.
 */
function LaneScene({
  lane,
  floorY,
  label,
  show,
  before,
  askHeight,
  chosen,
  guessTile,
  guessHeight,
}: {
  readonly lane: Lane;
  readonly floorY: number;
  readonly label?: string;
  readonly show: Show;
  readonly before?: number;
  readonly askHeight?: boolean;
  readonly chosen?: boolean;
  readonly guessTile?: number;
  readonly guessHeight?: number;
}) {
  const start = startOf(lane, floorY);
  const rot = tilt(lane.span);
  const top = { x: FOOT - lane.span, y: floorY - RISE };
  const hidden = !!askHeight && (show === 'setup' || show === 'hint');
  const evidence = show !== 'setup' && !hidden;
  const stopped = show === 'outcome';
  const lifted = hidden && guessHeight !== undefined ? startOf({ span: lane.span, h: guessHeight }, floorY) : null;
  return (
    <g>
      {chosen ? (
        <rect x={4} y={floorY - 113} width={392} height={140} rx={12} fill={GUESS_TINT} stroke={GUESS} strokeWidth={4} />
      ) : null}
      <Floor floorY={floorY} mark={stopped ? tiles(lane.h) : undefined} guess={guessTile} />
      <Stack right={top.x + 2} floorY={floorY} mark={evidence ? lane.h : undefined} earlier={before} guess={hidden ? guessHeight : undefined} />
      <line x1={top.x} y1={top.y} x2={FOOT} y2={floorY} stroke={PLANK} strokeWidth={6} strokeLinecap="round" />
      {evidence ? (
        <line x1={top.x + 2} y1={start.y} x2={start.x} y2={start.y} stroke={GOLD} strokeWidth={2.5} strokeDasharray="5 4" />
      ) : null}
      {lifted ? (
        <line x1={top.x + 2} y1={lifted.y} x2={lifted.x} y2={lifted.y} stroke={GUESS} strokeWidth={2.5} strokeDasharray="5 4" />
      ) : null}
      {before !== undefined ? <Pairs floorY={floorY} count={before} tone="earlier" /> : null}
      {before !== undefined && askHeight && show === 'hint' ? <Pairs floorY={floorY} count={lane.h} tone="now" filled={false} /> : null}
      {before !== undefined && (show === 'worked' || stopped) ? <Pairs floorY={floorY} count={lane.h} tone="now" /> : null}
      {before !== undefined ? <EarlierFlag floorY={floorY} before={before} /> : null}
      {askHeight ? <GoalFlag floorY={floorY} tile={tiles(lane.h)} /> : null}
      {guessTile !== undefined ? <Car x={tileX(guessTile)} y={floorY} tint={GUESS} ghost /> : null}
      {lifted ? (
        <Car x={lifted.x} y={lifted.y} rot={rot} lift={2} guess />
      ) : hidden ? (
        <g>
          <Car x={24} y={floorY} />
          <text x={24} y={floorY - 28} fontSize={18} fontWeight={700} textAnchor="middle" fill={INK}>
            ?
          </text>
        </g>
      ) : (
        <Car x={start.x} y={start.y} rot={rot} lift={2} ghost={stopped} />
      )}
      {show === 'worked' ? <Car x={stopX(lane.h)} y={floorY} ghost /> : null}
      {stopped ? <Car x={stopX(lane.h)} y={floorY} /> : null}
      {label ? (
        <g>
          <circle cx={378} cy={floorY - 78} r={14} fill="#ffffff" stroke={INK} strokeWidth={2.5} />
          <text x={378} y={floorY - 73} fontSize={16} fontWeight={700} textAnchor="middle" fill={INK}>
            {label}
          </text>
        </g>
      ) : null}
    </g>
  );
}

const PAIR_FLOORS = [125, 270] as const;
const SCALE_FLOOR = 140;

function laneLabel(lane: Lane, round: Round, name?: string): string {
  const who = name ? `Car ${name}` : 'The car';
  const ramp = round.kind === 'pair' && !sameRamp(round.a, round.b) ? (lane.span === GENTLE ? ' on the long ramp' : ' on the short steep ramp') : '';
  return `${who}${ramp}, let go ${blocks(lane.h)} high`;
}

/** The whole picture for a round at one stage, with the child's guess (if any) drawn in. */
function Scene({ round, show, answer = null }: { readonly round: Round; readonly show: Show; readonly answer?: Answer }) {
  const model = show === 'outcome';
  if (round.kind === 'scale') {
    const { lane, before, ask } = round;
    const askHeight = ask === 'height';
    const guess = typeof answer === 'number' ? answer : undefined;
    const setup = askHeight
      ? `The car waits beside a stack of six blocks. A gold flag marks tile ${tiles(lane.h)}. A grey car on tile ${tiles(before)} stopped there from ${blocks(before)}.`
      : `${laneLabel(lane, round)}. A grey car on tile ${tiles(before)} stopped there from ${blocks(before)}.`;
    const yours = guess === undefined ? '' : askHeight ? ` Your guess lifts the car ${blocks(guess)} high.` : ` Your guess: tile ${guess}.`;
    const label = model
      ? `Model result: from ${blocks(lane.h)} the car stops on tile ${tiles(lane.h)}. Last time, from ${blocks(before)}, tile ${tiles(before)}.`
      : setup + yours;
    return (
      <svg className="board-svg" viewBox="0 0 400 214" role="img" aria-label={label}>
        {model ? <ModelTag /> : null}
        <LaneScene
          lane={lane}
          floorY={SCALE_FLOOR}
          show={show}
          before={before}
          askHeight={askHeight}
          guessTile={askHeight ? undefined : guess}
          guessHeight={askHeight ? guess : undefined}
        />
      </svg>
    );
  }
  const { a, b } = round;
  const yours = answer === 'a' || answer === 'b' ? ` Your guess: car ${answer.toUpperCase()}.` : answer === 'same' ? ' Your guess: the same tile.' : '';
  const label = model
    ? `Model result: car A stops on tile ${tiles(a.h)}, car B on tile ${tiles(b.h)}.`
    : `${laneLabel(a, round, 'A')}. ${laneLabel(b, round, 'B')}.${yours}`;
  return (
    <svg className="board-svg" viewBox="0 0 400 300" role="img" aria-label={label}>
      {model ? <ModelTag /> : null}
      <LaneScene lane={a} floorY={PAIR_FLOORS[0]} label="A" show={show} chosen={answer === 'a' || answer === 'same'} />
      <LaneScene lane={b} floorY={PAIR_FLOORS[1]} label="B" show={show} chosen={answer === 'b' || answer === 'same'} />
    </svg>
  );
}

function ModelTag() {
  return (
    <text x={394} y={13} fontSize={11} fontStyle="italic" textAnchor="end" fill={INK_SOFT}>
      Model result
    </text>
  );
}

/* ----------------------------------------------------------------- board -- */

const PICKS = ['a', 'b', 'same'] as const;
const PICK_LABEL: Record<Pick, string> = { a: 'Car A', b: 'Car B', same: 'Same tile' };
/** The word under a level-3 answer picture: a tile on the floor, or a height in blocks. */
const optionWord = (ask: 'tile' | 'height', n: number) => (ask === 'tile' ? `Tile ${n}` : blocks(n));

/*
 * The answer buttons are pictures of the outcome, drawn with the board's own
 * car, tiles and blocks; the word is a small label underneath.
 */
const PIC: CSSProperties = { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const WORD: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1 };

function Pictured({ word, children }: { readonly word: string; readonly children: ReactNode }) {
  return (
    <span style={PIC}>
      {children}
      <span style={WORD}>{word}</span>
    </span>
  );
}

/** Mini floor: a plank foot and ten tiles from x 50, 14 wide, so tile n is the board's tile n. */
const MINI_FOOT = 50;
const MINI_TW = 14;
const miniX = (n: number) => MINI_FOOT + (n - 0.5) * MINI_TW;

/** Two little lanes, A over B, each car stopped where this answer says it will stop. */
function PickPicture({ pick }: { readonly pick: Pick }) {
  const stops: Record<Pick, readonly [number, number]> = { a: [8, 3], b: [3, 8], same: [6, 6] };
  const [ta, tb] = stops[pick];
  const lanes = [
    { name: 'A', y: 46, tile: ta },
    { name: 'B', y: 100, tile: tb },
  ] as const;
  return (
    <svg viewBox="0 0 200 112" style={{ width: 120, height: 67 }} aria-hidden="true">
      {lanes.map(({ name, y, tile }) => (
        <g key={name}>
          <circle cx={13} cy={y - 14} r={11} fill="#ffffff" stroke={INK} strokeWidth={2.5} />
          <text x={13} y={y - 9} fontSize={14} fontWeight={700} textAnchor="middle" fill={INK}>
            {name}
          </text>
          <line x1={30} y1={y - 26} x2={MINI_FOOT} y2={y} stroke={PLANK} strokeWidth={5} strokeLinecap="round" />
          {Array.from({ length: FLOOR_TILES }, (_, i) => (
            <rect key={i} x={MINI_FOOT + i * MINI_TW} y={y} width={MINI_TW} height={8} fill={(i + 1) % 2 ? TILE_ODD : TILE_EVEN} stroke={INK} strokeWidth={1} />
          ))}
          <Car x={miniX(tile)} y={y} />
        </g>
      ))}
      {pick === 'same' ? <line x1={miniX(6)} y1={8} x2={miniX(6)} y2={110} stroke={INK} strokeWidth={2} strokeDasharray="4 4" /> : null}
    </svg>
  );
}

/** The ten-tile floor with the first `n` tiles coloured as on the board and the car on tile n. */
function TilePicture({ n }: { readonly n: number }) {
  return (
    <svg viewBox="0 0 154 40" style={{ width: 136, height: 35 }} aria-hidden="true">
      {Array.from({ length: FLOOR_TILES }, (_, i) => (
        <rect
          key={i}
          x={4 + i * 14}
          y={28}
          width={14}
          height={9}
          fill={i < n ? ((i + 1) % 2 ? TILE_ODD : TILE_EVEN) : 'none'}
          stroke={i < n ? INK : SLOT_EDGE}
          strokeWidth={1}
        />
      ))}
      <Car x={4 + (n - 0.5) * 14} y={28} />
    </svg>
  );
}

/** A stack of `n` wooden blocks with the car on top. One scale for every option, so taller is higher. */
function HeightPicture({ n }: { readonly n: number }) {
  const bh = 12;
  return (
    <svg viewBox="0 0 44 100" style={{ width: 42, height: 96 }} aria-hidden="true">
      <line x1={0} y1={98} x2={44} y2={98} stroke={INK} strokeWidth={2} />
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={8} y={98 - (i + 1) * bh} width={28} height={bh} fill={WOOD} stroke={INK} strokeWidth={1.5} />
      ))}
      <Car x={22} y={98 - n * bh} />
    </svg>
  );
}

function caption(round: Round, show: Show): string | null {
  if (round.kind === 'scale') {
    const { before, ask } = round;
    const { h } = round.lane;
    if (show === 'hint') {
      return ask === 'tile'
        ? `Grey: from ${blocks(before)} it rolled ${tiles(before)} tiles, a pair of tiles for each block.`
        : 'Grey: one block under each pair of tiles. Gold: the pairs up to the gold flag.';
    }
    if (show === 'worked') {
      return ask === 'tile'
        ? `${blocks(h)}, a pair of tiles each: tile ${tiles(h)}. The dashed car shows where.`
        : `Tile ${tiles(h)} is ${h === 1 ? 'one pair' : `${h} pairs`} of tiles, so start ${blocks(h)} high.`;
    }
    return null;
  }
  const { a, b } = round;
  if (show === 'hint') return `Gold blocks: A starts ${blocks(a.h)} high, B starts ${blocks(b.h)} high.`;
  if (show === 'worked') return `A from ${blocks(a.h)}: tile ${tiles(a.h)}. B from ${blocks(b.h)}: tile ${tiles(b.h)}. Dashed cars show where.`;
  return null;
}

type Stage = BoardProps<Round, Answer>['stage'];

/** What the scene draws at a board stage: 'solved' (the Before pane) is the plain setup. */
const showAt = (stage: Stage): Show => (stage === 'hint' ? 'hint' : stage === 'worked' ? 'worked' : 'setup');

/**
 * Read-aloud: the words the board shows at this stage, in screen order — the
 * word under each answer picture, then the hint or worked caption. The setup
 * sentence is the scene's aria-label only, and the lane letters and tile and
 * block numbers are drawn, so they are left out.
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  const words = round.kind === 'scale' ? round.options.map((n) => optionWord(round.ask, n)) : PICKS.map((p) => PICK_LABEL[p]);
  const note = caption(round, showAt(stage));
  return note ? [...words, note] : words;
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved';
  const show = showAt(stage);
  const note = caption(round, show);
  return (
    <div className="board board--ramp">
      <Scene round={round} show={show} answer={answer} />
      <div className="choices" role="group" aria-label="Your guess">
        {round.kind === 'scale'
          ? round.options.map((n) => {
              const text = optionWord(round.ask, n);
              return (
                <Choice key={n} selected={answer === n} onTap={() => setAnswer(n)} disabled={locked} ariaLabel={text}>
                  <Pictured word={text}>{round.ask === 'tile' ? <TilePicture n={n} /> : <HeightPicture n={n} />}</Pictured>
                </Choice>
              );
            })
          : PICKS.map((p) => (
              <Choice key={p} selected={answer === p} onTap={() => setAnswer(p)} disabled={locked} ariaLabel={PICK_LABEL[p]}>
                <Pictured word={PICK_LABEL[p]}>
                  <PickPicture pick={p} />
                </Pictured>
              </Choice>
            ))}
      </div>
      {note ? <p className="board-caption">{note}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <Scene round={round} show="outcome" />;
}

/* ------------------------------------------------------------------ game -- */

export const startHigherRollFarther: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'start-higher-roll-farther',
  title: 'Start Higher, Roll Farther?',
  hook: 'Lift it higher. Let go.',
  group: 'motion',
  levels: ['Two heights', 'Long or steep?', 'Find the rule'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  board,
  Outcome,
  matches: (round, prediction) => prediction === rightAnswer(round),
  why,
  cover: 'art/games/start-higher-roll-farther.png',
  note: {
    what: 'The same toy car is let go, not pushed, from a marked height on a plank ramp propped on six numbered blocks. He taps which car will roll farther across the floor tiles, then presses Try to see where it stops beside the starting picture. On level 3 a grey flag shows last time\'s run, and he predicts either the tile from a new height or the height needed to reach a gold flag.',
    expect: 'Expect him to pick the longer ramp or the steeper one, or to say a car only goes far if you push it hard. Level 2 puts a long gentle ramp against a short steep one to break both rules. On level 3 expect "one more block, one more tile" before he sees each block is worth two, and expect the backwards question (how high for the gold flag?) to stop him longer than the forwards one.',
    practising: 'Height stores energy: lifting the car is the work that later makes it roll; the ramp only turns that height into speed. Also changing one thing at a time, comparing results by counting the same tiles, and on level 3 reading a rate (tiles per block) off one run and using it forwards and backwards.',
    ask: "When two cars on different ramps stop on the same tile (level 2): 'One ramp is much longer. Why did they both stop there?'",
    next: 'Prop a chopping board on a stack of books on a hard floor. Let a toy car go, without pushing, from one book high and then three books high, and mark each stop with a strip of masking tape. Then keep the height and change to a longer board.',
    honest: 'The tile counts are a model and are labelled so. A real car loses a little at the bump at the bottom (more on a steep ramp) and to rubbing along the board (more on a long one), so equal heights land close together, not on one tile, and the roll is only roughly in step with the height. Choosing here shows he can compare heights, not that he understands energy.',
    easier: 'Stay on level 1 and build the same stack with real blocks or books beside the screen, so he lifts the car himself before each Try.',
    harder: 'On level 3, ask him to say the rule before he chooses: how many tiles for each block? Then ask what a start six blocks high would give, and test the rule on a real ramp: does each extra book add about the same distance?',
    safety: 'Keep the ramp low and on the floor, away from stairs. Toy cars with small wheels that come off stay out of the two-year-old’s reach.',
  },
};

export default startHigherRollFarther;
