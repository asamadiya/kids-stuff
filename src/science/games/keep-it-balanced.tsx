import type { ReactNode } from 'react';
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

function Pulls({ round }: { readonly round: LeverRound }) {
  return (
    <>
      <text x="14" y="34" fontSize="18" fontWeight="700" fill={INK}>
        Left: {sumText(round.left)}
      </text>
      <text x="386" y="34" textAnchor="end" fontSize="18" fontWeight="700" fill={INK}>
        Right: {sumText(round.right)}
      </text>
    </>
  );
}

const TIP_WORDS: Record<Tip, string> = {
  left: 'the left side goes down',
  level: 'the beam stays level',
  right: 'the right side goes down',
};

function LeverSetup({ round, stage }: { readonly round: LeverRound; readonly stage: BoardProps<Round, Answer>['stage'] }) {
  const help = stage === 'hint' || stage === 'worked';
  return (
    <Frame
      label={`A beam held level on two props. Left: ${sideText(round.left)}. Right: ${sideText(round.right)}.`}
      names={LEVER_NAMES}
    >
      {stage === 'worked' ? <Pulls round={round} /> : null}
      <PropPosts />
      <Pivot />
      <Beam round={round} angle={0} marks={help} />
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

function TowerSetup({ round, stage }: { readonly round: TowerRound; readonly stage: BoardProps<Round, Answer>['stage'] }) {
  const evidence: Evidence = stage === 'worked' ? 'full' : stage === 'hint' ? 'dot' : 'none';
  return (
    <Frame label={`Two towers. Green: ${towerText(round.green)}. Orange: ${towerText(round.orange)}.`} names={TOWER_NAMES}>
      <Tower t={GREEN} xs={round.green} after={false} evidence={evidence} />
      <Tower t={ORANGE} xs={round.orange} after={false} evidence={evidence} />
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

/** A small drawn beam for each lever choice, so the choice reads without words. */
function TipIcon({ t }: { readonly t: Tip }) {
  return (
    <svg width="56" height="34" viewBox="0 0 56 34" aria-hidden="true">
      <polygon points="28,22 21,32 35,32" fill="#f2a900" stroke={INK} strokeWidth="2" />
      <rect x="4" y="16" width="48" height="6" rx="2" fill="#8a5a14" stroke={INK} strokeWidth="2" transform={`rotate(${ANGLE[t] * 1.4} 28 22)`} />
    </svg>
  );
}

/** A small drawn tower for each tower choice: the named one's top block tipping off, or both standing. */
function FallIcon({ f }: { readonly f: Fall }) {
  const block = (key: string, x: number, y: number, fill: string, transform?: string) => (
    <rect key={key} x={x} y={y} width="18" height="10" rx="1.5" fill={fill} stroke={INK} strokeWidth="2" transform={transform} />
  );
  if (f === 'neither') {
    return (
      <svg width="44" height="42" viewBox="0 0 44 42" aria-hidden="true">
        {[0, 1, 2].flatMap((i) => [block(`g${i}`, 2, 10 + i * 10, GREEN.fill), block(`o${i}`, 24, 10 + i * 10, ORANGE.fill)])}
      </svg>
    );
  }
  const t = f === 'green' ? GREEN : ORANGE;
  const corner = t.out > 0 ? 31 : 13;
  return (
    <svg width="44" height="42" viewBox="0 0 44 42" aria-hidden="true">
      {block('b0', 13, 30, t.fill)}
      {block('b1', 13, 20, t.fill)}
      {block('top', 13, 10, t.fill, `rotate(${t.out * 30} ${corner} 20)`)}
    </svg>
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
  const setup = round.kind === 'lever' ? <LeverSetup round={round} stage={stage} /> : <TowerSetup round={round} stage={stage} />;
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
                <TipIcon t={t} />
                {words}
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
                <FallIcon f={f} />
                {words}
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
