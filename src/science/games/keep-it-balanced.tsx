import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Keep It Balanced — levers (levels 1-2) and towers (level 3).
 *
 * Concept (advisor, physics 5 and 6): on a beam, where a block sits matters as
 * much as how many blocks there are — one block two steps out balances two
 * blocks one step out. A stack stands while the middle of the blocks above sits
 * over the block beneath; height alone does not decide, and a block that still
 * touches its support can fall. The misconceptions it targets: "the side with
 * more weight always goes down" and "tall towers fall, touching means held".
 *
 * Lever and tower are separate scenarios with the same control (advisor's
 * scenario boundary), never mixed in one round.
 *
 * Shape: the setup is a beam held level on two supports, with identical blocks
 * on numbered steps out from the pivot. He taps Left down / Stays level / Right
 * down. Try removes the supports and draws the beam settled, in the same frame
 * and scale, with each side's total written out. Level 3 shows two towers and
 * asks which one falls. All drawing is static SVG with fixed states.
 *
 * Nothing he must read to play: each answer is a picture of that outcome (the
 * beam settled left, level or right; both towers with the named one's top
 * block tipping off), its words a small label under it. Tapping one draws the
 * guess on the board at once, dashed blue: the beam where he says it settles,
 * the top block he says tips off, or both towers boxed for "neither". A side's
 * turning total is a row of gold dots, one per step for every block, under a
 * small block for each group, mirrored out from the middle so the two rows are
 * compared by length; "1 + 3 = 4" stays only as a small label under the row.
 * One block on step 2 over two dots beside two blocks over one dot each is
 * "one balances two" shown, not stated.
 *
 * Levels:
 *  1. One thing changes at a time: more blocks at the same step, or one block
 *     each side at different steps.
 *  2. Weight against distance: one block twice as far balances two; sometimes
 *     the far block wins, sometimes more blocks do.
 *  3. Two towers from the same kind of block: which one falls, if either?
 */

/** How many identical blocks sit on steps 1, 2, 3 and 4 out from the pivot. */
type Steps = readonly [number, number, number, number];

interface LeverRound {
  readonly kind: 'lever';
  readonly left: Steps;
  readonly right: Steps;
  readonly why: string;
}

/**
 * Block centres, bottom block first, in twelfths of a block's width, measured
 * from the bottom block's centre. A block's half-width is therefore 6.
 */
interface TowerRound {
  readonly kind: 'towers';
  readonly green: readonly number[];
  readonly orange: readonly number[];
  readonly why: string;
}

export type Round = LeverRound | TowerRound;

type Tip = 'left' | 'level' | 'right';
type Fall = 'green' | 'orange' | 'neither';
export type Answer = Tip | Fall | null;

const lever = (left: Steps, right: Steps, why: string): LeverRound => ({ kind: 'lever', left, right, why });
const towers = (green: readonly number[], orange: readonly number[], why: string): TowerRound => ({
  kind: 'towers',
  green,
  orange,
  why,
});

/** Level 1: weight alone, or distance alone. */
const ONE_CHANGE: readonly LeverRound[] = [
  lever([0, 1, 0, 0], [0, 2, 0, 0], 'Both sides have blocks 2 steps from the middle. The right side has two blocks there, twice the weight, so the right side goes down.'),
  lever([0, 0, 1, 0], [1, 0, 0, 0], 'One block each side, so the same weight. The left block sits 3 steps out, the right one only 1. Farther out turns the beam more: left goes down.'),
  lever([0, 1, 0, 0], [0, 1, 0, 0], 'One block each side, both 2 steps from the middle. Same weight at the same distance turns the beam the same, so it stays level.'),
  lever([3, 0, 0, 0], [1, 0, 0, 0], 'All the blocks sit 1 step from the middle. Three blocks weigh more than one at the same distance, so the left side goes down.'),
  lever([1, 0, 0, 0], [0, 0, 0, 1], 'One block each side. The right block sits 4 steps out, the left only 1 step. Farther from the middle turns the beam more, so right goes down.'),
  lever([2, 0, 0, 0], [0, 0, 2, 0], 'Two blocks on each side. The left pair sits 1 step out, the right pair 3 steps out. The farther pair turns the beam more: right goes down.'),
];

/** Level 2: weight against distance. */
const ONE_BALANCES_TWO: readonly LeverRound[] = [
  lever([0, 1, 0, 0], [2, 0, 0, 0], 'One block 2 steps out turns the beam by 2. Two blocks 1 step out turn it by 1 + 1 = 2. Equal turns, so it stays level: one block balances two.'),
  lever([0, 0, 1, 0], [2, 0, 0, 0], 'One block 3 steps out turns the beam by 3. Two blocks 1 step out turn it by only 1 + 1 = 2. The single block wins: left goes down.'),
  lever([0, 0, 1, 0], [0, 2, 0, 0], 'One block 3 steps out turns the beam by 3. Two blocks 2 steps out turn it by 2 + 2 = 4. The right side goes down. Far does not always win.'),
  lever([3, 0, 0, 0], [0, 1, 0, 0], 'Three blocks 1 step out turn the beam by 1 + 1 + 1 = 3. One block 2 steps out turns it by 2. This time more blocks win: left goes down.'),
  lever([1, 0, 1, 0], [0, 2, 0, 0], 'Left turns the beam by 1 + 3 = 4. Right turns it by 2 + 2 = 4. The blocks sit in different places, but the totals match, so it stays level.'),
  lever([0, 0, 0, 1], [0, 2, 0, 0], 'One block 4 steps out turns the beam by 4. Two blocks 2 steps out turn it by 2 + 2 = 4. Twice as far balances twice the blocks: it stays level.'),
];

/**
 * Level 3. Offsets are in twelfths of a block's width. The green tower only
 * ever leans left and the orange only right, so a falling block never lands on
 * the other tower.
 */
const TOWERS: readonly TowerRound[] = [
  towers([0, 0, 0, 0, 0], [0, 0, 8], 'The tall green tower is straight, so its balance point sits over its base. The orange top block hangs more than half off the block below, so it falls.'),
  towers([0, -8], [0, 2, 4, 6], 'The green top block still touches, but more than half of it hangs over the edge, so it falls. The orange tower leans, yet each balance point stays over the block below.'),
  towers([0, -2, -6], [0, 0, 0, 0], 'Both stand. The green tower leans, but the balance point of the blocks above stays over the block underneath at every step. Leaning is not falling.'),
  towers([0, 0, 0, 0, 0, 0], [0, 5, 10], 'Six straight green blocks stand: tall is not the problem. The orange top block sits safely on the middle one, but the balance point of those two is past the base edge. Those two fall.'),
  towers([0, -6, -10], [0, 2, -2, 0], 'The top green block sits safely on the middle one, but the balance point of those two is past the edge of the base, so both fall. The orange zigzag stands.'),
  towers([0, 0, -2, -6], [0, 0, 0, 10], 'The green tower leans a little at each step and stands. The orange top block has slid so far that its balance point is past the edge below. It falls.'),
];

/* ---------------------------------------------------------------- physics -- */

/** A side's turning total: each block turns the beam by its step number. */
const pull = (s: Steps): number => s.reduce((sum, n, i) => sum + n * (i + 1), 0);

function tip(round: LeverRound): Tip {
  const l = pull(round.left);
  const r = pull(round.right);
  return l > r ? 'left' : r > l ? 'right' : 'level';
}

const HALF = 6;
const mean = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

interface Decider {
  /** The blocks from this index up rest on block `at - 1`. */
  readonly at: number;
  /** Where the balance point of those blocks is, in twelfths. */
  readonly centre: number;
  /** The patch where block `at` touches block `at - 1`, in twelfths. */
  readonly lo: number;
  readonly hi: number;
  readonly falls: boolean;
}

/**
 * The joint that decides a tower: the lowest one whose load has its balance
 * point outside the patch where it rests on the block beneath, or, if none,
 * the closest call. The bottom block stands on the floor, so the whole tower
 * stands exactly when every joint holds.
 */
function decide(xs: readonly number[]): Decider {
  let best: Decider | null = null;
  let bestMargin = Infinity;
  for (let k = 1; k < xs.length; k += 1) {
    const centre = mean(xs.slice(k));
    const lo = Math.max(xs[k], xs[k - 1]) - HALF;
    const hi = Math.min(xs[k], xs[k - 1]) + HALF;
    const margin = Math.min(centre - lo, hi - centre);
    if (margin < 0) return { at: k, centre, lo, hi, falls: true };
    if (margin < bestMargin) {
      best = { at: k, centre, lo, hi, falls: false };
      bestMargin = margin;
    }
  }
  return best ?? { at: 1, centre: 0, lo: -HALF, hi: HALF, falls: false };
}

function fall(round: TowerRound): Fall {
  if (decide(round.green).falls) return 'green';
  if (decide(round.orange).falls) return 'orange';
  return 'neither';
}

const outcome = (round: Round): Tip | Fall => (round.kind === 'lever' ? tip(round) : fall(round));

export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) return ONE_CHANGE[k];
  if (level === 2) return ONE_BALANCES_TWO[k];
  return TOWERS[k];
}

function prompt(round: Round): string {
  return round.kind === 'lever'
    ? 'Take away both props. Which way will the beam go?'
    : 'Hands off both towers. Which one falls, if either?';
}

/* ---------------------------------------------------------- lever drawing -- */

const INK = '#24170f';
const CX = 200;
/** The pivot's top, where the beam's underside rests. */
const PY = 190;
const FLOOR = 230;
const STEP = 36;
const BEAM_HALF = 175;
const BEAM_T = 22;
const BLOCK = 26;
/** The tilt at which a beam end meets the floor. */
const TILT = (Math.asin((FLOOR - PY) / BEAM_HALF) * 180) / Math.PI;
const ANGLE: Record<Tip, number> = { left: -TILT, level: 0, right: TILT };

/** "1 + 1 = 2", or just "2" for a single block. */
function sumText(s: Steps): string {
  const terms = s.flatMap((n, i) => Array.from({ length: n }, () => String(i + 1)));
  return terms.length === 1 ? terms[0] : `${terms.join(' + ')} = ${pull(s)}`;
}

function sideText(s: Steps): string {
  const parts = s.flatMap((n, i) => (n ? [`${n} ${n === 1 ? 'block' : 'blocks'} on step ${i + 1}`] : []));
  return parts.join(' and ');
}

/** The one frame every picture in this game is drawn in, before and after alike. */
function Frame({
  label,
  names,
  model,
  children,
}: {
  readonly label: string;
  /** Words written on the floor band, at an x position. */
  readonly names: ReadonlyArray<readonly [number, string]>;
  readonly model?: boolean;
  readonly children: ReactNode;
}) {
  return (
    <svg className="board-svg" viewBox="0 0 400 260" role="img" aria-label={label}>
      <rect x="0" y={FLOOR} width="400" height="30" fill="#e8d6b4" />
      <line x1="0" y1={FLOOR} x2="400" y2={FLOOR} stroke={INK} strokeWidth="3" />
      {names.map(([x, text]) => (
        <text key={text} x={x} y="252" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
          {text}
        </text>
      ))}
      {model ? (
        <text x="392" y="14" textAnchor="end" fontSize="12" fill="#5a4636">
          model picture
        </text>
      ) : null}
      {children}
    </svg>
  );
}

const LEVER_NAMES: ReadonlyArray<readonly [number, string]> = [
  [40, 'Left'],
  [360, 'Right'],
];

function Stacks({ steps, side }: { readonly steps: Steps; readonly side: -1 | 1 }) {
  return (
    <>
      {steps.flatMap((n, i) =>
        Array.from({ length: n }, (_, j) => (
          <rect
            key={`${i}-${j}`}
            x={CX + side * (i + 1) * STEP - BLOCK / 2}
            y={PY - BEAM_T - (j + 1) * BLOCK}
            width={BLOCK}
            height={BLOCK}
            rx="3"
            fill="#d9622b"
            stroke={INK}
            strokeWidth="2.5"
          />
        )),
      )}
    </>
  );
}

/** The beam with its numbered steps and blocks, turned by `angle` degrees about the pivot. */
function Beam({ round, angle, marks }: { readonly round: LeverRound; readonly angle: number; readonly marks: boolean }) {
  return (
    <g transform={angle ? `rotate(${angle} ${CX} ${PY})` : undefined}>
      <rect x={CX - BEAM_HALF} y={PY - BEAM_T} width={BEAM_HALF * 2} height={BEAM_T} rx="4" fill="#8a5a14" stroke={INK} strokeWidth="3" />
      {[1, 2, 3, 4].flatMap((step) =>
        ([-1, 1] as const).map((side) => {
          const x = CX + side * step * STEP;
          return (
            <g key={`${side}-${step}`}>
              {marks ? <circle cx={x} cy={PY - BEAM_T / 2} r="10" fill="#f2a900" stroke={INK} strokeWidth="2" /> : null}
              <text x={x} y={PY - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill={marks ? INK : '#fff8ec'}>
                {step}
              </text>
            </g>
          );
        }),
      )}
      <Stacks steps={round.left} side={-1} />
      <Stacks steps={round.right} side={1} />
    </g>
  );
}

function Pivot() {
  return <polygon points={`${CX},${PY} ${CX - 22},${FLOOR} ${CX + 22},${FLOOR}`} fill="#f2a900" stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
}

function PropPosts() {
  return (
    <>
      {[-1, 1].map((side) => (
        <rect
          key={side}
          x={CX + side * (BEAM_HALF - 9) - 7}
          y={PY}
          width="14"
          height={FLOOR - PY}
          fill="#c8913f"
          stroke={INK}
          strokeWidth="2.5"
        />
      ))}
    </>
  );
}

const GOLD = '#f2a900';
const BLOCK_FILL = '#d9622b';
/** Where a guess is drawn on the board: blue, a colour nothing else here uses. */
const GUESS = '#1c6dd0';
/** Centre-to-centre spacing of the turn dots. Uniform, so row length is the total. */
const PITCH = 20;
const DOT_Y = 50;

/** One entry per block, its step number, from the middle out. */
const blockSteps = (s: Steps): number[] => s.flatMap((n, i) => Array.from({ length: n }, () => i + 1));

/**
 * One side's turning total as objects: a gold dot per step for every block,
 * each block's dots under a bracket with a small block over it, running out
 * from the middle. The dots are evenly spaced, so the longer row turns more.
 */
function PullRow({ steps, side }: { readonly steps: Steps; readonly side: -1 | 1 }) {
  const at = (i: number) => CX + side * (24 + i * PITCH);
  const groups = blockSteps(steps).reduce<{ first: number; n: number }[]>(
    (acc, n) => [...acc, { first: acc.length ? acc[acc.length - 1].first + acc[acc.length - 1].n : 0, n }],
    [],
  );
  return (
    <g>
      {groups.map(({ first, n }) => {
        const a = at(first);
        const b = at(first + n - 1);
        const mid = (a + b) / 2;
        return (
          <g key={first}>
            <rect x={mid - 6} y="20" width="12" height="12" rx="2" fill={BLOCK_FILL} stroke={INK} strokeWidth="2" />
            <path d={`M${a - side * 8} 41 V36 H${b + side * 8} V41`} fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            {Array.from({ length: n }, (_, i) => (
              <circle key={i} cx={at(first + i)} cy={DOT_Y} r="7" fill={GOLD} stroke={INK} strokeWidth="2" />
            ))}
          </g>
        );
      })}
      <text x={CX + side * 16} y="74" textAnchor={side < 0 ? 'end' : 'start'} fontSize="13" fontWeight="600" fill="#5a4636">
        {sumText(steps)}
      </text>
    </g>
  );
}

function Pulls({ round }: { readonly round: LeverRound }) {
  return (
    <>
      <line x1={CX} y1="18" x2={CX} y2="62" stroke={INK} strokeWidth="2" strokeDasharray="4 4" />
      <PullRow steps={round.left} side={-1} />
      <PullRow steps={round.right} side={1} />
    </>
  );
}

/** His guess, drawn in the frame: a dashed blue beam where he says it settles. */
function BeamGuess({ t }: { readonly t: Tip }) {
  return (
    <rect
      x={CX - BEAM_HALF - 5}
      y={PY - BEAM_T - 5}
      width={BEAM_HALF * 2 + 10}
      height={BEAM_T + 10}
      rx="7"
      fill="none"
      stroke={GUESS}
      strokeWidth="4"
      strokeDasharray="12 7"
      transform={ANGLE[t] ? `rotate(${ANGLE[t]} ${CX} ${PY})` : undefined}
    />
  );
}

const isTip = (a: Answer): a is Tip => a === 'left' || a === 'level' || a === 'right';
const isFall = (a: Answer): a is Fall => a === 'green' || a === 'orange' || a === 'neither';

const TIP_WORDS: Record<Tip, string> = {
  left: 'the left side goes down',
  level: 'the beam stays level',
  right: 'the right side goes down',
};

function LeverSetup({
  round,
  stage,
  guess,
}: {
  readonly round: LeverRound;
  readonly stage: BoardProps<Round, Answer>['stage'];
  readonly guess: Answer;
}) {
  const help = stage === 'hint' || stage === 'worked';
  const g = isTip(guess) ? guess : null;
  return (
    <Frame
      label={`A beam held level on two props. Left: ${sideText(round.left)}. Right: ${sideText(round.right)}.${g ? ` Your guess, dashed: ${TIP_WORDS[g]}.` : ''}`}
      names={LEVER_NAMES}
    >
      {stage === 'worked' ? <Pulls round={round} /> : null}
      <PropPosts />
      <Pivot />
      <Beam round={round} angle={0} marks={help} />
      {g ? <BeamGuess t={g} /> : null}
    </Frame>
  );
}

function LeverOutcome({ round }: { readonly round: LeverRound }) {
  const t = tip(round);
  return (
    <Frame
      label={`Props taken away: ${TIP_WORDS[t]}. Left total ${pull(round.left)}, right total ${pull(round.right)}.`}
      names={LEVER_NAMES}
      model
    >
      <Pulls round={round} />
      <Pivot />
      <Beam round={round} angle={ANGLE[t]} marks />
    </Frame>
  );
}

/* ---------------------------------------------------------- tower drawing -- */

/** Block size in px; one offset unit is a twelfth of a block's width. */
const BW = 40;
const BH = 26;
const UNIT = BW / 12;

interface TowerSpec {
  readonly name: 'Green' | 'Orange';
  readonly fill: string;
  readonly base: number;
  /** Which way its blocks land if it falls. */
  readonly out: -1 | 1;
}

const GREEN: TowerSpec = { name: 'Green', fill: '#3a8f3e', base: 145, out: -1 };
const ORANGE: TowerSpec = { name: 'Orange', fill: '#e07a1f', base: 255, out: 1 };

const TOWER_NAMES: ReadonlyArray<readonly [number, string]> = [
  [GREEN.base, GREEN.name],
  [ORANGE.base, ORANGE.name],
];

const blockX = (t: TowerSpec, x: number) => t.base + x * UNIT - BW / 2;
const blockY = (i: number) => FLOOR - (i + 1) * BH;

function Block({ x, y, fill, ghost }: { readonly x: number; readonly y: number; readonly fill: string; readonly ghost?: boolean }) {
  return ghost ? (
    <rect x={x} y={y} width={BW} height={BH} rx="3" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="5 4" />
  ) : (
    <rect x={x} y={y} width={BW} height={BH} rx="3" fill={fill} stroke={INK} strokeWidth="2.5" />
  );
}

/**
 * The evidence for one tower: a dot at the balance point of the blocks above
 * its deciding joint, a dashed line straight down from it, and a gold bar where
 * those blocks rest on the block beneath. With `verdict`, a ring where the line
 * meets the bar means it holds; a red cross means it misses and they fall.
 */
function BalanceLine({ t, xs, verdict }: { readonly t: TowerSpec; readonly xs: readonly number[]; readonly verdict: boolean }) {
  const d = decide(xs);
  const load = xs.length - d.at;
  const x = t.base + d.centre * UNIT;
  const y = FLOOR - d.at * BH - (load * BH) / 2;
  const joint = FLOOR - d.at * BH;
  return (
    <g>
      <line x1={t.base + d.lo * UNIT} y1={joint} x2={t.base + d.hi * UNIT} y2={joint} stroke="#f2a900" strokeWidth="5" strokeLinecap="round" />
      <line x1={x} y1={y} x2={x} y2={joint + 14} stroke={INK} strokeWidth="2.5" strokeDasharray="5 4" />
      <circle cx={x} cy={y} r="6" fill="#fff8ec" stroke={INK} strokeWidth="3" />
      {!verdict ? null : d.falls ? (
        <path d={`M${x - 6} ${joint + 8} l12 12 m0 -12 l-12 12`} stroke="#c8372d" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <circle cx={x} cy={joint} r="5" fill="none" stroke={INK} strokeWidth="2.5" />
      )}
    </g>
  );
}

type Evidence = 'none' | 'dot' | 'full';

function Tower({ t, xs, after, evidence }: { readonly t: TowerSpec; readonly xs: readonly number[]; readonly after: boolean; readonly evidence: Evidence }) {
  const d = decide(xs);
  const fallen = after && d.falls ? xs.length - d.at : 0;
  // Fallen blocks lie on the floor just past the farthest the tower reached,
  // so they never sit under the dashed outlines of where they were.
  const reach = t.out > 0 ? Math.max(...xs) : Math.min(...xs);
  const start = t.base + reach * UNIT + t.out * (BW / 2 + 4);
  const lying = (j: number) => (t.out > 0 ? start + j * (BW + 2) : start - BW - j * (BW + 2));
  return (
    <g>
      {xs.map((x, i) => (
        <Block key={i} x={blockX(t, x)} y={blockY(i)} fill={t.fill} ghost={fallen > 0 && i >= d.at} />
      ))}
      {Array.from({ length: fallen }, (_, j) => (
        <Block key={`f${j}`} x={lying(j)} y={FLOOR - BH} fill={t.fill} />
      ))}
      {evidence === 'none' ? null : <BalanceLine t={t} xs={xs} verdict={evidence === 'full'} />}
    </g>
  );
}

const FALL_WORDS: Record<Fall, string> = {
  green: 'the green tower falls, the orange stands',
  orange: 'the orange tower falls, the green stands',
  neither: 'both towers stand',
};

function towerText(xs: readonly number[]): string {
  const straight = xs.every((x) => x === xs[0]);
  return `${xs.length} blocks${straight ? ', straight' : ', not straight'}`;
}

/**
 * His guess on the towers, dashed blue: the named tower's top block drawn
 * tipping off its outer edge, or, for "neither", a box round each tower.
 */
function TowerGuess({ f, round }: { readonly f: Fall; readonly round: TowerRound }) {
  const dash = { fill: 'none', stroke: GUESS, strokeWidth: 4, strokeDasharray: '10 6' } as const;
  if (f === 'neither') {
    return (
      <g>
        {([
          [GREEN, round.green],
          [ORANGE, round.orange],
        ] as const).map(([t, xs]) => {
          const x0 = blockX(t, Math.min(...xs)) - 6;
          const x1 = blockX(t, Math.max(...xs)) + BW + 6;
          const y0 = blockY(xs.length - 1) - 6;
          return <rect key={t.name} x={x0} y={y0} width={x1 - x0} height={FLOOR - y0} rx="6" {...dash} />;
        })}
      </g>
    );
  }
  const t = f === 'green' ? GREEN : ORANGE;
  const xs = f === 'green' ? round.green : round.orange;
  const top = xs.length - 1;
  const x = blockX(t, xs[top]);
  const y = blockY(top);
  const cx = t.out > 0 ? x + BW : x;
  return <rect x={x} y={y} width={BW} height={BH} rx="3" {...dash} transform={`rotate(${t.out * 35} ${cx} ${y + BH})`} />;
}

function TowerSetup({
  round,
  stage,
  guess,
}: {
  readonly round: TowerRound;
  readonly stage: BoardProps<Round, Answer>['stage'];
  readonly guess: Answer;
}) {
  const evidence: Evidence = stage === 'worked' ? 'full' : stage === 'hint' ? 'dot' : 'none';
  const g = isFall(guess) ? guess : null;
  return (
    <Frame
      label={`Two towers. Green: ${towerText(round.green)}. Orange: ${towerText(round.orange)}.${g ? ` Your guess, dashed: ${FALL_WORDS[g]}.` : ''}`}
      names={TOWER_NAMES}
    >
      <Tower t={GREEN} xs={round.green} after={false} evidence={evidence} />
      <Tower t={ORANGE} xs={round.orange} after={false} evidence={evidence} />
      {g ? <TowerGuess f={g} round={round} /> : null}
    </Frame>
  );
}

function TowerOutcome({ round }: { readonly round: TowerRound }) {
  return (
    <Frame label={`Hands off: ${FALL_WORDS[fall(round)]}.`} names={TOWER_NAMES} model>
      <Tower t={GREEN} xs={round.green} after evidence="full" />
      <Tower t={ORANGE} xs={round.orange} after evidence="full" />
    </Frame>
  );
}

/* ------------------------------------------------------------------ board -- */

/** Choice icon geometry: a beam on a pivot over a floor, 96 x 60. */
const ICON_FLOOR = 54;
const ICON_PIVOT = 36;
const ICON_HALF = 42;
const ICON_TILT = (Math.asin((ICON_FLOOR - ICON_PIVOT) / ICON_HALF) * 180) / Math.PI;
const ICON_ANGLE: Record<Tip, number> = { left: -ICON_TILT, level: 0, right: ICON_TILT };
const ICON: CSSProperties = { width: 96, height: 60 };

/**
 * The lever outcome as a picture: the same beam with one block at each end,
 * settled the way that choice says — left end on the floor, level, or right
 * end on the floor. No props, as after Try.
 */
function TipIcon({ t }: { readonly t: Tip }) {
  return (
    <svg width="96" height="60" viewBox="0 0 96 60" aria-hidden="true" style={ICON}>
      <line x1="2" y1={ICON_FLOOR} x2="94" y2={ICON_FLOOR} stroke={INK} strokeWidth="2.5" />
      <polygon points={`48,${ICON_PIVOT} 40,${ICON_FLOOR} 56,${ICON_FLOOR}`} fill={GOLD} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <g transform={ICON_ANGLE[t] ? `rotate(${ICON_ANGLE[t]} 48 ${ICON_PIVOT})` : undefined}>
        <rect x={48 - ICON_HALF} y={ICON_PIVOT - 7} width={ICON_HALF * 2} height="7" rx="2" fill="#8a5a14" stroke={INK} strokeWidth="2" />
        <rect x={48 - ICON_HALF + 4} y={ICON_PIVOT - 19} width="12" height="12" rx="2" fill={BLOCK_FILL} stroke={INK} strokeWidth="2" />
        <rect x={48 + ICON_HALF - 16} y={ICON_PIVOT - 19} width="12" height="12" rx="2" fill={BLOCK_FILL} stroke={INK} strokeWidth="2" />
      </g>
    </svg>
  );
}

/**
 * The tower outcome as a picture: both towers on a floor, the named one's top
 * block tipping off its outer edge, or both standing for "neither".
 */
function FallIcon({ f }: { readonly f: Fall }) {
  const tower = (t: TowerSpec, x: number) => {
    const tips = f === (t === GREEN ? 'green' : 'orange');
    const corner = t.out > 0 ? x + 22 : x;
    return [0, 1, 2].map((i) => (
      <rect
        key={`${t.name}${i}`}
        x={x}
        y={ICON_FLOOR - (i + 1) * 13}
        width="22"
        height="13"
        rx="2"
        fill={t.fill}
        stroke={INK}
        strokeWidth="2"
        transform={tips && i === 2 ? `rotate(${t.out * 40} ${corner} ${ICON_FLOOR - 26})` : undefined}
      />
    ));
  };
  return (
    <svg width="96" height="60" viewBox="0 0 96 60" aria-hidden="true" style={ICON}>
      <line x1="2" y1={ICON_FLOOR} x2="94" y2={ICON_FLOOR} stroke={INK} strokeWidth="2.5" />
      {tower(GREEN, 22)}
      {tower(ORANGE, 52)}
    </svg>
  );
}

const CHOICE_BODY: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const CHOICE_WORDS: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 };

/** The picture first, its words small underneath. */
function ChoiceBody({ picture, words }: { readonly picture: ReactNode; readonly words: string }) {
  return (
    <span style={CHOICE_BODY}>
      {picture}
      <span style={CHOICE_WORDS}>{words}</span>
    </span>
  );
}

const LEVER_CHOICES: ReadonlyArray<readonly [Tip, string]> = [
  ['left', 'Left goes down'],
  ['level', 'Stays level'],
  ['right', 'Right goes down'],
];

const TOWER_CHOICES: ReadonlyArray<readonly [Fall, string]> = [
  ['green', 'Green falls'],
  ['neither', 'Neither falls'],
  ['orange', 'Orange falls'],
];

/** On 'hint': a fact about this board, pointing at what the hint stage adds. */
function hintLine(round: Round): string {
  return round.kind === 'lever'
    ? `The gold numbers count steps from the middle. Left: ${sideText(round.left)}. Right: ${sideText(round.right)}.`
    : 'Each dot is the balance point of the blocks above the gold bar. The gold bar is where they rest.';
}

function Board({ round, level, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const worked = stage === 'worked';
  const locked = stage === 'solved' || worked;
  const right = outcome(round);
  const setup =
    round.kind === 'lever' ? <LeverSetup round={round} stage={stage} guess={answer} /> : <TowerSetup round={round} stage={stage} guess={answer} />;
  return (
    <div className="board board--balance">
      {worked ? (
        <div className="evidence">
          <figure className="evidence__pane">
            <figcaption>Before</figcaption>
            {setup}
          </figure>
          <figure className="evidence__pane evidence__pane--after">
            <figcaption>What happens</figcaption>
            <Outcome round={round} level={level} />
          </figure>
        </div>
      ) : (
        setup
      )}
      <div className="choices" role="group" aria-label="Your guess">
        {round.kind === 'lever'
          ? LEVER_CHOICES.map(([t, words]) => (
              <Choice
                key={t}
                selected={answer === t}
                onTap={() => setAnswer(t)}
                disabled={locked}
                ariaLabel={words}
                mark={worked && t === right ? 'right' : null}
              >
                <ChoiceBody picture={<TipIcon t={t} />} words={words} />
              </Choice>
            ))
          : TOWER_CHOICES.map(([f, words]) => (
              <Choice
                key={f}
                selected={answer === f}
                onTap={() => setAnswer(f)}
                disabled={locked}
                ariaLabel={words}
                mark={worked && f === right ? 'right' : null}
              >
                <ChoiceBody picture={<FallIcon f={f} />} words={words} />
              </Choice>
            ))}
      </div>
      {stage === 'hint' ? <p className="board-caption">{hintLine(round)}</p> : null}
      {worked ? <p className="board-caption">{round.why}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return round.kind === 'lever' ? <LeverOutcome round={round} /> : <TowerOutcome round={round} />;
}

export const keepItBalanced: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'keep-it-balanced',
  title: 'Keep It Balanced',
  hook: 'Where it sits matters.',
  group: 'balance',
  levels: ['Weight or distance', 'One balances two', 'Which tower falls?'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => prediction === outcome(round),
  why: (round) => round.why,
  cover: 'art/games/keep-it-balanced.png',
  note: {
    what: 'A beam rests on a pivot with identical blocks on numbered steps out from the middle; props hold it level. He predicts which way it goes when the props come away, then sees it settle beside the starting picture. Level 3 swaps the beam for two towers: which one falls?',
    expect: 'Most five-year-olds say the side with more blocks goes down. Level 1 lets each idea work alone; level 2 sets them against each other, and the round where one block on step 2 balances two on step 1 usually produces a long stare. On towers, expect "the tall one falls".',
    practising: 'Turning effect on a lever: weight times distance from the pivot, counted here as adding step numbers. On towers, centre of mass: a stack stands while the balance point of the blocks above stays over what holds them up.',
    ask: "When one block balances two: 'There are more blocks on that side. Why didn't it go down?' Let him point at the step numbers before you say anything.",
    next: 'Balance an empty 30 cm ruler across a round pencil, then use identical coins: one coin 10 cm from the pencil on one side, two stacked 5 cm from it on the other. It rocks before it settles; if it will not settle, nudge the coins a few millimetres, since real rulers and coins are not perfectly even. Then build a block tower and slide the top block out a little at a time until it tips.',
    honest: 'Adding step numbers works only because every block is identical and the empty beam balances; it does not show that weight times distance is the general rule, which needs unequal weights. He can follow the rule here without having felt a real see-saw shift, and a picture of a falling tower is a model, not an observation.',
    easier: 'Stay on level 1, and put real coins on a real ruler for each round before pressing Try.',
    harder: 'On a level 2 round that tips, before Try, ask him to say each side\'s total out loud, then which step one more block must go on to make it level.',
    safety: 'Keep coins and small blocks away from the two-year-old, and keep test towers low and on the floor.',
  },
};

export default keepItBalanced;
