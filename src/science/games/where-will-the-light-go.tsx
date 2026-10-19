import type { ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Where Will the Light Go? — blocking makes shadows; mirrors reflect.
 *
 * Concept (advisor, physics 9 and catalogue 7): light travels in straight
 * lines from the torch. A shadow is the part of the wall the cutout blocks,
 * so the SAME dinosaur near the torch blocks a wide part of the spreading
 * light (big shadow) and far from it a narrow part (small shadow). The
 * misconceptions it fixes: "a bigger shadow means the dinosaur grew" and "a
 * shadow's size is fixed by the object's size alone". Separately (never in
 * the same round), a flat mirror sends light off at the same slant it
 * arrives.
 *
 * Shape: predict (tap-to-choose) → Try → the result drawn in the same frame
 * and scale as the setup → why. The prediction is compared, never marked.
 * All drawing is static SVG, and the outcome is labelled as a drawn model.
 *
 * Levels:
 *  1. One 10 cm dinosaur moves to a new mark between a fixed torch and a
 *     fixed wall 120 cm away. Bigger, same size or smaller shadow?
 *  2. A big (20 cm) dinosaur and a small (10 cm) one stand at different
 *     marks: the small one near the torch can out-shadow the big one far
 *     away, and twice the size at twice the distance gives the same shadow.
 *  3. Mirrors on a squared grid: the beam's slant is counted in squares
 *     (2 across for 1 down); which of three things does the bounce reach?
 *
 * The geometry is exact for a point-like torch: shadow height =
 * dinosaur height × 120 cm ÷ distance from the torch. The wall is drawn
 * turned towards the viewer so the shadow's shape can be seen.
 */

type Size = 'small' | 'big';
type Change = 'bigger' | 'same' | 'smaller';
type Target = 'mango' | 'ball' | 'dino';
/** A grid point: [column, row], row 0 at the top, the mirror on row 6. */
type Point = readonly [number, number];

/** A dinosaur cutout on a stick, `at` cm from the torch. */
interface Stand {
  readonly size: Size;
  readonly at: number;
}

interface ShadowRound {
  readonly kind: 'shadow';
  readonly from: Stand;
  readonly to: Stand;
}

interface MirrorRound {
  readonly kind: 'mirror';
  readonly torch: Point;
  /** One step of the beam: [across, down]. */
  readonly dir: Point;
  readonly targets: Readonly<Record<Target, Point>>;
  readonly reaches: Target;
}

export type Round = ShadowRound | MirrorRound;
export type Answer = Change | Target | null;

const WALL_CM = 120;
const HEIGHT_CM: Record<Size, number> = { small: 10, big: 20 };
const shadowCm = (s: Stand): number => Math.round((HEIGHT_CM[s.size] * WALL_CM) / s.at);

function change(r: ShadowRound): Change {
  const a = shadowCm(r.from);
  const b = shadowCm(r.to);
  return b > a ? 'bigger' : b < a ? 'smaller' : 'same';
}

const ROWS = 6;
const COLS = 12;

function hitPoint(r: MirrorRound): Point {
  const steps = (ROWS - r.torch[1]) / r.dir[1];
  return [r.torch[0] + steps * r.dir[0], ROWS];
}

/* ---------------------------------------------------------------- rounds -- */

const small = (at: number): Stand => ({ size: 'small', at });
const big = (at: number): Stand => ({ size: 'big', at });

/** Level 1: the same small dinosaur, from one mark to another. */
const MOVES: ReadonlyArray<readonly [number, number]> = [
  [60, 20],
  [30, 80],
  [40, 30],
  [20, 60],
  [100, 40],
  [50, 100],
];

/** Level 2: one dinosaur, then the other size at a new mark. */
const SWAPS: ReadonlyArray<readonly [Stand, Stand]> = [
  [small(20), big(80)],
  [small(30), big(60)],
  [big(100), small(20)],
  [big(100), small(60)],
  [small(60), big(80)],
  [big(80), small(40)],
];

/**
 * Level 3. Each wrong target sits where a common wrong idea sends the beam:
 * straight up off the mirror, or off at a steeper or flatter slant than it
 * arrived. None sits on the true path, so the beam reaches exactly one.
 */
const MIRRORS: readonly MirrorRound[] = [
  { kind: 'mirror', torch: [1, 2], dir: [1, 1], targets: { mango: [9, 2], ball: [5, 2], dino: [11, 3] }, reaches: 'mango' },
  { kind: 'mirror', torch: [0, 3], dir: [2, 1], targets: { mango: [10, 2], ball: [12, 3], dino: [6, 2] }, reaches: 'ball' },
  { kind: 'mirror', torch: [2, 0], dir: [1, 2], targets: { mango: [9, 2], ball: [5, 2], dino: [7, 2] }, reaches: 'dino' },
  { kind: 'mirror', torch: [11, 1], dir: [-1, 1], targets: { mango: [6, 2], ball: [3, 3], dino: [2, 4] }, reaches: 'ball' },
  { kind: 'mirror', torch: [0, 4], dir: [2, 1], targets: { mango: [10, 3], ball: [4, 2], dino: [8, 2] }, reaches: 'mango' },
  { kind: 'mirror', torch: [12, 0], dir: [-1, 2], targets: { mango: [5, 2], ball: [9, 2], dino: [7, 2] }, reaches: 'dino' },
];

export function generate(level: Level, index: number): Round {
  const k = ((index % 6) + 6) % 6;
  if (level === 1) {
    const [a, b] = MOVES[k];
    return { kind: 'shadow', from: small(a), to: small(b) };
  }
  if (level === 2) {
    const [from, to] = SWAPS[k];
    return { kind: 'shadow', from, to };
  }
  return MIRRORS[k];
}

function prompt(round: Round): string {
  if (round.kind === 'mirror') return 'The light bounces off the mirror. Which one does it reach?';
  if (round.from.size === round.to.size) {
    return round.to.at < round.from.at
      ? 'The dinosaur moves nearer the torch. What happens to its shadow?'
      : 'The dinosaur moves farther from the torch. What happens to its shadow?';
  }
  return `Swap: ${round.to.size} dinosaur on the dashed mark. What happens to the shadow?`;
}

const TARGET_NAME: Record<Target, string> = { mango: 'mango', ball: 'ball', dino: 'dinosaur' };

const squares = (n: number) => `${n} square${n === 1 ? '' : 's'}`;

function why(round: Round): string {
  if (round.kind === 'mirror') {
    const dx = Math.abs(round.dir[0]);
    const dy = round.dir[1];
    return `The light leaves the mirror at the same slant it arrived: ${squares(dx)} across for every ${dy} down, then ${dx} across for every ${dy} up. That straight path reaches the ${TARGET_NAME[round.reaches]}.`;
  }
  const a = shadowCm(round.from);
  const b = shadowCm(round.to);
  if (round.from.size === round.to.size) {
    const nearer = round.to.at < round.from.at;
    return `${nearer ? 'Nearer' : 'Farther from'} the torch, the dinosaur blocks a ${nearer ? 'wider' : 'narrower'} part of the spreading light. At the ${round.from.at} cm mark its shadow was ${a} cm tall; at the ${round.to.at} cm mark it is ${b} cm. The dinosaur did not change.`;
  }
  const taller = round.to.size === 'big';
  const close =
    a === b
      ? `${taller ? 'Twice as tall at twice the distance' : 'Half as tall at half the distance'}: the same shadow.`
      : 'Size and distance from the torch both decide.';
  return `The ${round.to.size} dinosaur is ${taller ? 'twice' : 'half'} as tall as the ${round.from.size} one and stands at the ${round.to.at} cm mark, not ${round.from.at}. Its shadow is ${b} cm tall; the ${round.from.size} one's was ${a} cm. ${close}`;
}

/* --------------------------------------------------- drawing: shadows -- */

const SH_W = 480;
const SH_H = 348;
const LENS_X = 40;
/** Horizontal and vertical scales differ; straight rays stay straight, so the geometry still holds. */
const PX_CM = 2.3;
const PY_CM = 3.6;
const WALL_X = LENS_X + WALL_CM * PX_CM;
const TABLE_Y = 296;
const BEAM_Y = 276;
/** The cutout faces the torch; seen from the side at a slant, it looks narrower than it is. */
const SQUISH = 0.66;
/** Every shadow is centred on the torch's axis, so they share one centre line on the wall. */
const SHADOW_CX = WALL_X + 78;
const INK = '#24170f';
const INK_SOFT = '#5a4636';
const RAY = '#d9620b';

const DINO_PATH =
  'M0 55 L30 40 L55 30 L62 12 L70 2 L95 4 L100 14 L88 20 L74 22 L70 34 L78 42 L80 48 L70 46 L66 58 L62 70 L66 96 L74 100 L52 100 L50 76 L44 76 L44 96 L50 100 L30 100 L32 72 L20 64 Z';

const standX = (s: Stand) => LENS_X + s.at * PX_CM;
const cutoutPx = (s: Stand) => HEIGHT_CM[s.size] * PY_CM;
const shadowPx = (s: Stand) => shadowCm(s) * PY_CM;

function Dino({ cx, h, fill, dashed }: { readonly cx: number; readonly h: number; readonly fill: string; readonly dashed?: boolean }) {
  const w = h * SQUISH;
  return (
    <path
      d={DINO_PATH}
      transform={`translate(${cx - w / 2} ${BEAM_Y - h}) scale(${w / 100} ${h / 100})`}
      fill={fill}
      stroke={dashed ? INK_SOFT : INK}
      strokeWidth={dashed ? 2 : 2.5}
      strokeDasharray={dashed ? '5 4' : undefined}
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** The cutout on its peg, standing on the table. */
function Cutout({ stand, ghost, label }: { readonly stand: Stand; readonly ghost?: boolean; readonly label?: boolean }) {
  const x = standX(stand);
  const h = cutoutPx(stand);
  return (
    <g>
      <line x1={x} y1={BEAM_Y} x2={x} y2={TABLE_Y - 4} stroke={ghost ? INK_SOFT : '#8a5a14'} strokeWidth={ghost ? 2 : 4} strokeDasharray={ghost ? '5 4' : undefined} />
      <rect x={x - 9} y={TABLE_Y - 5} width="18" height="5" fill={ghost ? 'none' : '#8a5a14'} stroke={ghost ? INK_SOFT : INK} strokeWidth="1.5" strokeDasharray={ghost ? '4 3' : undefined} />
      <Dino cx={x} h={h} fill={ghost ? 'none' : '#3f8f3a'} dashed={ghost} />
      {label ? (
        <text x={x} y={BEAM_Y - h - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} stroke="#fff" strokeWidth="4" paintOrder="stroke">
          {HEIGHT_CM[stand.size]} cm
        </text>
      ) : null}
    </g>
  );
}

/** Orange dark enough to read on the wall (5.5:1); the dashed outline it names is RAY. */
const RAY_TEXT = '#a3440a';

/**
 * The height of each shadow, written above the taller one. Drawn last so no
 * outline crosses it. With a dashed outline as well, the two labels stack,
 * coloured like the shape each names, so near-equal heights never collide.
 */
function ShadowLabels({ solid, dashed, dashedWord }: { readonly solid: Stand; readonly dashed?: Stand; readonly dashedWord?: string }) {
  const lines: Array<readonly [string, string]> = [[INK, `shadow ${shadowCm(solid)} cm`]];
  if (dashed) {
    const line = [RAY_TEXT, `${dashedWord}: ${shadowCm(dashed)} cm`] as const;
    if (shadowCm(dashed) >= shadowCm(solid)) lines.unshift(line);
    else lines.push(line);
  }
  const base = BEAM_Y - Math.max(shadowPx(solid), dashed ? shadowPx(dashed) : 0) - 8;
  return (
    <g>
      {lines.map(([fill, text], i) => (
        <text
          key={text}
          x={SHADOW_CX}
          y={base - (lines.length - 1 - i) * 17}
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill={fill}
          stroke="#fff4cf"
          strokeWidth="4"
          paintOrder="stroke"
        >
          {text}
        </text>
      ))}
    </g>
  );
}

/** The blocked light behind a cutout, and its shadow on the wall. */
function Shadow({ stand, outline }: { readonly stand: Stand; readonly outline?: boolean }) {
  const x = standX(stand);
  const h = cutoutPx(stand);
  const H = shadowPx(stand);
  return (
    <g>
      {outline ? null : (
        <polygon points={`${x},${BEAM_Y - h} ${WALL_X},${BEAM_Y - H} ${WALL_X},${BEAM_Y} ${x},${BEAM_Y}`} fill="rgba(36,23,15,0.16)" />
      )}
      {outline ? null : <line x1={SHADOW_CX} y1={BEAM_Y} x2={SHADOW_CX} y2={TABLE_Y} stroke="#3a2c22" strokeWidth="4" />}
      {outline ? (
        <path
          d={DINO_PATH}
          transform={`translate(${SHADOW_CX - (H * SQUISH) / 2} ${BEAM_Y - H}) scale(${(H * SQUISH) / 100} ${H / 100})`}
          fill="none"
          stroke={RAY}
          strokeWidth="3"
          strokeDasharray="7 5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <Dino cx={SHADOW_CX} h={H} fill="#3a2c22" />
      )}
    </g>
  );
}

/** A straight line of light from the torch, past the top of a cutout, to the wall. */
function Ray({ stand, dashed }: { readonly stand: Stand; readonly dashed?: boolean }) {
  return (
    <line
      x1={LENS_X}
      y1={BEAM_Y}
      x2={WALL_X}
      y2={BEAM_Y - shadowPx(stand)}
      stroke={RAY}
      strokeWidth="3"
      strokeDasharray={dashed ? '8 6' : undefined}
      strokeLinecap="round"
    />
  );
}

/** Torch, table with a centimetre scale, and the lit wall: the fixed frame every shadow round shares. */
function ShadowFrame({ label, footer, children }: { readonly label: string; readonly footer: string; readonly children: ReactNode }) {
  const ticks = Array.from({ length: WALL_CM / 10 + 1 }, (_, i) => i * 10);
  return (
    <svg className="board-svg" viewBox={`0 0 ${SH_W} ${SH_H}`} role="img" aria-label={label}>
      <rect x="0" y="0" width={SH_W} height={TABLE_Y} fill="#3b3550" />
      <polygon points={`${LENS_X},${BEAM_Y - 10} ${WALL_X},14 ${WALL_X},${TABLE_Y} ${LENS_X},${BEAM_Y + 10}`} fill="#ffe7a0" opacity="0.85" />
      <rect x={WALL_X} y="14" width={SH_W - WALL_X - 10} height={TABLE_Y - 14} fill="#fff4cf" stroke={INK} strokeWidth="3" />
      <rect x="0" y={TABLE_Y} width={SH_W} height="26" fill="#d9a35f" stroke={INK} strokeWidth="2" />
      <text x={SH_W / 2} y={SH_H - 8} textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
        {footer}
      </text>
      {ticks.map((cm) => {
        const x = LENS_X + cm * PX_CM;
        return (
          <g key={cm}>
            <line x1={x} y1={TABLE_Y} x2={x} y2={TABLE_Y + 6} stroke={INK} strokeWidth="2" />
            <text x={x} y={TABLE_Y + 18} textAnchor="middle" fontSize="10" fontWeight="600" fill={INK}>
              {cm}
            </text>
          </g>
        );
      })}
      <text x={SH_W - 14} y={TABLE_Y + 18} textAnchor="end" fontSize="11" fontWeight="700" fill={INK}>
        cm
      </text>
      <rect x="10" y={BEAM_Y + 11} width="24" height={TABLE_Y - BEAM_Y - 11} fill="#8a5a14" stroke={INK} strokeWidth="2" />
      <rect x="4" y={BEAM_Y - 11} width="30" height="22" rx="4" fill="#b8322a" stroke={INK} strokeWidth="2.5" />
      <rect x="30" y={BEAM_Y - 14} width={LENS_X - 30} height="28" rx="3" fill="#c9ced6" stroke={INK} strokeWidth="2.5" />
      <line x1={LENS_X} y1={BEAM_Y - 12} x2={LENS_X} y2={BEAM_Y + 12} stroke="#f2a900" strokeWidth="4" />
      <text x={WALL_X + 8} y={TABLE_Y - 6} fontSize="13" fontWeight="700" fill={INK_SOFT}>
        wall
      </text>
      {children}
    </svg>
  );
}

/* --------------------------------------------------- drawing: mirrors -- */

const MI_W = 480;
const MI_H = 300;
const CELL = 34;
const GX = 36;
const GY = 40;
const px = (p: Point): readonly [number, number] => [GX + p[0] * CELL, GY + p[1] * CELL];
const MIRROR_Y = GY + ROWS * CELL;

function TargetIcon({ target, at, lit }: { readonly target: Target; readonly at: readonly [number, number]; readonly lit?: boolean }) {
  const [x, y] = at;
  return (
    <g>
      {lit ? <circle cx={x} cy={y} r="22" fill="#ffe27a" stroke="#f2a900" strokeWidth="4" /> : null}
      {target === 'mango' ? (
        <g>
          <path d={`M${x - 11} ${y + 2} q0 -14 12 -14 q12 0 11 13 q-1 12 -12 12 q-11 0 -11 -11 z`} fill="#f5a31a" stroke={INK} strokeWidth="2.5" />
          <path d={`M${x + 1} ${y - 12} q6 -8 13 -6 q-4 6 -13 6 z`} fill="#3f8f3a" stroke={INK} strokeWidth="1.5" />
        </g>
      ) : target === 'ball' ? (
        <g>
          <circle cx={x} cy={y} r="13" fill="#c8322a" stroke={INK} strokeWidth="2.5" />
          <path d={`M${x - 13} ${y} q13 -7 26 0`} fill="none" stroke="#fff4cf" strokeWidth="2.5" />
        </g>
      ) : (
        <path
          d={DINO_PATH}
          transform={`translate(${x - 14} ${y - 14}) scale(0.28)`}
          fill="#3f8f3a"
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  );
}

/** A torch at a grid point, its lens on the point, pointing along `dir`. */
function GridTorch({ round }: { readonly round: MirrorRound }) {
  const [x, y] = px(round.torch);
  const deg = (Math.atan2(round.dir[1], round.dir[0]) * 180) / Math.PI;
  return (
    <g transform={`translate(${x} ${y}) rotate(${deg})`}>
      <rect x="-34" y="-8" width="24" height="16" rx="3" fill="#b8322a" stroke={INK} strokeWidth="2.5" />
      <rect x="-12" y="-11" width="12" height="22" rx="2" fill="#c9ced6" stroke={INK} strokeWidth="2.5" />
      <line x1="0" y1="-10" x2="0" y2="10" stroke="#f2a900" strokeWidth="4" />
    </g>
  );
}

function Beam({ from, to, dashed }: { readonly from: Point; readonly to: Point; readonly dashed?: boolean }) {
  const [x1, y1] = px(from);
  const [x2, y2] = px(to);
  return (
    <g>
      {dashed ? null : <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffe27a" strokeWidth="11" strokeLinecap="round" opacity="0.8" />}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={RAY} strokeWidth="4" strokeLinecap="round" strokeDasharray={dashed ? '9 7' : undefined} />
    </g>
  );
}

/** Square steps along a beam: `dx` across then `dy` down (or up), once per step. */
function Steps({ from, dir, count, up }: { readonly from: Point; readonly dir: Point; readonly count: number; readonly up?: boolean }) {
  const dy = up ? -dir[1] : dir[1];
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const [ax, ay] = px([from[0] + i * dir[0], from[1] + i * dy]);
        const bx = ax + dir[0] * CELL;
        const by = ay + dy * CELL;
        return <path key={i} d={`M${ax} ${ay} H${bx} V${by}`} fill="none" stroke="#0d8063" strokeWidth="3" strokeDasharray="4 3" />;
      })}
    </g>
  );
}

function MirrorFrame({ round, label, footer, children }: { readonly round: MirrorRound; readonly label: string; readonly footer: string; readonly children?: ReactNode }) {
  return (
    <svg className="board-svg" viewBox={`0 0 ${MI_W} ${MI_H}`} role="img" aria-label={label}>
      <rect x="0" y="0" width={MI_W} height={MI_H} fill="#fbf6ea" />
      {Array.from({ length: COLS + 1 }, (_, c) => (
        <line key={`c${c}`} x1={GX + c * CELL} y1={GY} x2={GX + c * CELL} y2={MIRROR_Y} stroke="#cfd9e6" strokeWidth="1.5" />
      ))}
      {Array.from({ length: ROWS + 1 }, (_, r) => (
        <line key={`r${r}`} x1={GX} y1={GY + r * CELL} x2={GX + COLS * CELL} y2={GY + r * CELL} stroke="#cfd9e6" strokeWidth="1.5" />
      ))}
      <rect x={GX - 6} y={MIRROR_Y} width={COLS * CELL + 12} height="12" fill="#dfe8f2" stroke={INK} strokeWidth="2.5" />
      <rect x={GX - 6} y={MIRROR_Y + 12} width={COLS * CELL + 12} height="10" fill="#8a5a14" stroke={INK} strokeWidth="2" />
      <text x={MI_W / 2} y={MIRROR_Y + 44} textAnchor="middle" fontSize="15" fontWeight="700" fill={INK_SOFT}>
        {footer}
      </text>
      {(Object.keys(round.targets) as Target[]).map((t) => (
        <TargetIcon key={t} target={t} at={px(round.targets[t])} />
      ))}
      <GridTorch round={round} />
      <Beam from={round.torch} to={hitPoint(round)} />
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------- boards -- */

const CHANGES: ReadonlyArray<readonly [Change, string]> = [
  ['bigger', 'Bigger'],
  ['same', 'Same size'],
  ['smaller', 'Smaller'],
];
/** Shadow heights for the choice pictures: the shadow now, then the new one. */
const CHANGE_ICON: Record<Change, readonly [number, number]> = { bigger: [18, 34], same: [26, 26], smaller: [34, 18] };

/** Two shadow shapes on one floor line, so a pre-reader can tell the three choices apart. */
function ChangeIcon({ change: c }: { readonly change: Change }) {
  const [a, b] = CHANGE_ICON[c];
  const shape = (x: number, h: number) => (
    <path
      d={DINO_PATH}
      transform={`translate(${x - (h * SQUISH) / 2} ${36 - h}) scale(${(h * SQUISH) / 100} ${h / 100})`}
      fill="#3a2c22"
    />
  );
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" aria-hidden="true">
      <line x1="2" y1="37" x2="62" y2="37" stroke={INK_SOFT} strokeWidth="2" />
      {shape(15, a)}
      <path d="M27 22 h8 m-4 -4 l4 4 l-4 4" fill="none" stroke={RAY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {shape(49, b)}
    </svg>
  );
}

const TARGETS: readonly Target[] = ['mango', 'ball', 'dino'];
const TARGET_LABEL: Record<Target, string> = { mango: 'Mango', ball: 'Ball', dino: 'Dinosaur' };

type Stage = BoardProps<Round, Answer>['stage'];

interface PartProps<R> {
  readonly round: R;
  readonly answer: Answer;
  readonly setAnswer: (next: Answer) => void;
  readonly stage: Stage;
}

function ShadowBoard({ round, answer, setAnswer, stage }: PartProps<ShadowRound>) {
  const { from, to } = round;
  const help = stage === 'hint' || stage === 'worked';
  const swap = from.size !== to.size;
  return (
    <div className="board board--light">
      <ShadowFrame
        label={`A ${HEIGHT_CM[from.size]} cm dinosaur at the ${from.at} cm mark makes a ${shadowCm(from)} cm shadow on the wall. A dashed ${HEIGHT_CM[to.size]} cm dinosaur stands at the ${to.at} cm mark.`}
        footer={swap ? `Torch and wall stay put. Dashed: the ${to.size} one, instead.` : 'Torch and wall stay put. Dashed: where it moves to.'}
      >
        <Shadow stand={from} />
        <Ray stand={from} />
        <Cutout stand={from} label />
        <Cutout stand={to} ghost label={swap} />
        {stage === 'worked' ? (
          <>
            <Ray stand={to} dashed />
            <Shadow stand={to} outline />
          </>
        ) : help ? (
          <line x1={LENS_X} y1={BEAM_Y} x2={standX(to)} y2={BEAM_Y - cutoutPx(to)} stroke={RAY} strokeWidth="3" strokeDasharray="8 6" strokeLinecap="round" />
        ) : null}
        <ShadowLabels solid={from} dashed={stage === 'worked' ? to : undefined} dashedWord="new shadow" />
      </ShadowFrame>
      <div className="choices" role="group" aria-label="Your guess">
        {CHANGES.map(([c, text]) => (
          <Choice key={c} selected={answer === c} onTap={() => setAnswer(c)} disabled={stage === 'solved'}>
            <ChangeIcon change={c} />
            {text}
          </Choice>
        ))}
      </div>
      {help ? (
        <p className="board-caption">
          {stage === 'hint'
            ? 'Light goes in straight lines: from the torch, past the dashed dinosaur’s head, on to the wall.'
            : `The dashed line meets the wall at the top of the new shadow: ${shadowCm(to)} cm. Before, ${shadowCm(from)} cm.`}
        </p>
      ) : null}
    </div>
  );
}

const stepsTo = (r: MirrorRound, p: Point) => (ROWS - p[1]) / r.dir[1];

function MirrorBoard({ round, answer, setAnswer, stage }: PartProps<MirrorRound>) {
  const help = stage === 'hint' || stage === 'worked';
  const hit = hitPoint(round);
  const end = round.targets[round.reaches];
  const dx = Math.abs(round.dir[0]);
  const dy = round.dir[1];
  return (
    <div className="board board--light">
      <MirrorFrame round={round} label="A torch shines down at a flat mirror. A mango, a ball and a dinosaur sit above it." footer="flat mirror">
        {help ? <Steps from={round.torch} dir={round.dir} count={stepsTo(round, round.torch)} /> : null}
        {stage === 'worked' ? (
          <>
            <Beam from={hit} to={end} dashed />
            <Steps from={hit} dir={round.dir} count={stepsTo(round, end)} up />
          </>
        ) : null}
      </MirrorFrame>
      <div className="choices" role="group" aria-label="Your guess">
        {TARGETS.map((t) => (
          <Choice key={t} selected={answer === t} onTap={() => setAnswer(t)} disabled={stage === 'solved'}>
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
              <TargetIcon target={t} at={[20, 20]} />
            </svg>
            {TARGET_LABEL[t]}
          </Choice>
        ))}
      </div>
      {help ? (
        <p className="board-caption">
          {stage === 'hint'
            ? `On the way down the light goes ${squares(dx)} across for every ${dy} down.`
            : `It leaves at the same slant, ${dx} across for every ${dy} up, and reaches the ${TARGET_NAME[round.reaches]}.`}
        </p>
      ) : null}
    </div>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  return round.kind === 'shadow' ? (
    <ShadowBoard round={round} answer={answer} setAnswer={setAnswer} stage={stage} />
  ) : (
    <MirrorBoard round={round} answer={answer} setAnswer={setAnswer} stage={stage} />
  );
}

/* ------------------------------------------------------------ outcome -- */

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  if (round.kind === 'mirror') {
    const hit = hitPoint(round);
    const end = round.targets[round.reaches];
    return (
      <MirrorFrame
        round={round}
        label={`The light bounces off the mirror at the same slant and reaches the ${TARGET_NAME[round.reaches]}.`}
        footer="Drawn model: the same slant in and out."
      >
        <Steps from={round.torch} dir={round.dir} count={stepsTo(round, round.torch)} />
        <Steps from={hit} dir={round.dir} count={stepsTo(round, end)} up />
        <Beam from={hit} to={end} />
        <TargetIcon target={round.reaches} at={px(end)} lit />
      </MirrorFrame>
    );
  }
  const { from, to } = round;
  return (
    <ShadowFrame
      label={`At the ${to.at} cm mark the ${HEIGHT_CM[to.size]} cm dinosaur makes a ${shadowCm(to)} cm shadow. Dashed: the ${shadowCm(from)} cm shadow from before.`}
      footer="Drawn model: light goes in straight lines."
    >
      <Shadow stand={to} />
      <Ray stand={to} />
      <Cutout stand={from} ghost />
      <Cutout stand={to} label />
      <Shadow stand={from} outline />
      <ShadowLabels solid={to} dashed={from} dashedWord="before" />
    </ShadowFrame>
  );
}

/* --------------------------------------------------------------- game -- */

function matches(round: Round, prediction: Answer): boolean {
  return round.kind === 'shadow' ? prediction === change(round) : prediction === round.reaches;
}

export const whereWillTheLightGo: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'where-will-the-light-go',
  title: 'Where Will the Light Go?',
  hook: 'Same dinosaur. Different shadow.',
  group: 'light',
  levels: ['Move the dinosaur', 'Big or near?', 'Bounce off mirrors'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches,
  why,
  cover: 'art/games/where-will-the-light-go.png',
  note: {
    what: 'A torch and a wall stay fixed while a dinosaur cutout moves along a centimetre scale between them. He predicts whether the shadow grows, shrinks or stays the same, then presses Try to see it beside the start. Level 2 swaps in a dinosaur twice or half the size at a new mark; level 3 is a flat mirror on a squared grid.',
    expect: 'Many children of five expect the shadow to grow as the dinosaur moves towards the wall, or think a bigger dinosaur always makes a bigger shadow. Level 1 shows the opposite: nearer the torch, bigger shadow. Level 2 is built to break the size rule: a small dinosaur near the torch beats a big one far away, and twice the size at twice the distance ties. On mirrors, expect him to guess the beam goes straight up, or to pick the nearest thing.',
    practising: 'Light travels in straight lines, so a shadow is the patch of wall an object blocks, and its size depends on the distance from the light as well as the object. For mirrors: the light leaves at the same slant it arrived, counted in grid squares.',
    ask: "After the first Try on level 1: 'The dinosaur did not change. So what made the shadow change?'",
    next: 'At bedtime, fix a torch on a pile of books facing a wall and move a paper dinosaur cutout towards it and away. Measure the shadow with a ruler at two marks. Later, bounce torchlight off a hand mirror onto the ceiling and tilt it slowly.',
    honest: 'The pictures are drawn models of a small point of light; a real torch has a fuzzy edge to its shadow, which the screen leaves out. Getting the mirror rounds right shows he can count a slant on a grid, not that he understands angles or reflection in general.',
    easier: 'Stay on level 1 and do each move for real with a torch before pressing Try.',
    harder: 'On level 2, ask him to find a spot where the small dinosaur makes the same shadow as the big one, and to say why.',
    safety: 'Never shine the torch or a mirror reflection into anyone’s eyes, and never use sunlight with the mirror. Keep small mirrors away from the two-year-old.',
  },
};

export default whereWillTheLightGo;
