import type { ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * One Push. Then What?
 *
 * Concept (advisor, physics 1 and 2, kept as separate levels): a pushed toy
 * car keeps rolling after the hand lets go — nothing has to keep pushing it —
 * and the surface under the wheels decides how quickly it is slowed. The
 * misconceptions it targets: "a moving thing needs something pushing it all
 * the time" and "the car stops because it used up the push; the floor has no
 * part in it".
 *
 * Shape: predict → Try → before/after side by side → why. One control:
 * tap-to-choose. The setup shows the car at the instant the hand lets go, with
 * a numbered strip from the release point; the outcome is the same frame with
 * the car where it stopped. Fixed SVG states only, no motion.
 *
 * Levels (one changed variable each):
 *  1. Let go — one floor (wood), the push changes: gentle, medium, strong.
 *     The car always rolls on past 0; a stronger push reaches farther.
 *  2. Change the floor — the same strong push every time, the floor changes:
 *     wood, kitchen tiles, carpet, towel.
 *  3. Where the floor changes — the same push on two lanes side by side;
 *     which car goes farther? Most lanes change floor partway (wood, then a
 *     towel), so he must reason about WHERE the drag acts: a towel the car
 *     reaches early stops it sooner than one it reaches late, a towel met late
 *     can beat carpet all the way, and a towel beyond where the car would stop
 *     anyway changes nothing (that round comes out equal).
 *
 * The model (constant friction, work–energy): the push gives the car REACH
 * marks of rolling on wood; each mark rolled on a floor costs DRAG of that.
 * On one floor, stop = REACH ÷ DRAG. Distances are marked "Model result".
 */

type Surface = 'wood' | 'tile' | 'carpet' | 'towel';
type Push = 'gentle' | 'medium' | 'strong';
type Zone = 'zero' | 'near' | 'middle' | 'far';
type Side = 'top' | 'bottom' | 'same';

/** Level 3: from this mark on, the lane is this floor instead. */
export interface Patch {
  readonly from: number;
  readonly surface: Surface;
}

export interface Lane {
  readonly surface: Surface;
  readonly patch?: Patch;
  /** Where the front of the car stops, in marks from the release point. */
  readonly stop: number;
}

export interface Round {
  readonly test: 'let-go' | 'floor' | 'pair';
  readonly push: Push;
  /** One lane, or two (top, bottom) on level 3. */
  readonly lanes: readonly Lane[];
}

export type Answer = Zone | Side | null;

/** How far each push carries the car on wood, in marks. */
const REACH: Record<Push, number> = { gentle: 2, medium: 5, strong: 9 };
/** How hard each floor drags on the wheels, relative to wood: one mark rolled on it costs this many marks of wood-rolling. */
const DRAG: Record<Surface, number> = { wood: 1, tile: 1, carpet: 2.25, towel: 4.5 };

/** Where the front of the car stops, to the nearest mark: REACH is spent at DRAG per mark rolled. */
function stopOn(push: Push, surface: Surface, patch?: Patch): number {
  const left = REACH[push];
  const before = patch ? patch.from * DRAG[surface] : Infinity;
  if (!patch || left <= before) return Math.round(left / DRAG[surface]);
  return Math.round(patch.from + (left - before) / DRAG[patch.surface]);
}

const lane = (push: Push, surface: Surface, patch?: Patch): Lane =>
  patch ? { surface, patch, stop: stopOn(push, surface, patch) } : { surface, stop: stopOn(push, surface) };

type LaneSpec = readonly [Surface, Patch?];
/**
 * Level 3, strong push unless noted (true model stops in brackets; unequal
 * pairs differ by more than a mark, so rounding never flips the comparison):
 *  0. towel from 3 (4.3) vs towel from 6 (6.7): a towel reached early stops it sooner.
 *  1. towel from 6 (6.7) vs carpet all the way (4): a towel met late beats carpet from the start.
 *  2. medium: towel from 7 vs wood (both 5): the car never reaches that towel.
 *  3. carpet from 5 (6.8) vs wood (9).
 *  4. carpet from 4 (6.2) vs towel from 4 (5.1): same place, the towel drags harder.
 *  5. tiles then carpet from 2 (5.1) vs carpet all the way (4).
 */
const PAIRS: ReadonlyArray<readonly [Push, LaneSpec, LaneSpec]> = [
  ['strong', ['wood', { from: 3, surface: 'towel' }], ['wood', { from: 6, surface: 'towel' }]],
  ['strong', ['wood', { from: 6, surface: 'towel' }], ['carpet']],
  ['medium', ['wood', { from: 7, surface: 'towel' }], ['wood']],
  ['strong', ['wood', { from: 5, surface: 'carpet' }], ['wood']],
  ['strong', ['wood', { from: 4, surface: 'carpet' }], ['wood', { from: 4, surface: 'towel' }]],
  ['strong', ['tile', { from: 2, surface: 'carpet' }], ['carpet']],
];

/** Short name, used on labels and in sentences after "the". */
const NAME: Record<Surface, string> = { wood: 'wood', tile: 'tiles', carpet: 'carpet', towel: 'towel' };
/** Full name for the level-2 prompt. */
const PLACE: Record<Surface, string> = {
  wood: 'the wood floor',
  tile: 'the kitchen tiles',
  carpet: 'the carpet',
  towel: 'a towel',
};
const LABEL: Record<Surface, string> = { wood: 'Wood', tile: 'Tiles', carpet: 'Carpet', towel: 'Towel' };

/** "Wood, then towel from 3" or "Carpet": what a lane is made of, as drawn. */
const laneText = (ln: Lane): string =>
  ln.patch ? `${LABEL[ln.surface]}, then ${NAME[ln.patch.surface]} from ${ln.patch.from}` : LABEL[ln.surface];

const ZONES: ReadonlyArray<readonly [Zone, string, number, number]> = [
  ['zero', 'Stops at 0', 0, 0],
  ['near', 'Near: 1–3', 1, 3],
  ['middle', 'Middle: 4–6', 4, 6],
  ['far', 'Far: 7–10', 7, 10],
];

export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) {
    const push = (['medium', 'strong', 'gentle', 'strong', 'medium', 'gentle'] as const)[k];
    return { test: 'let-go', push, lanes: [lane(push, 'wood')] };
  }
  if (level === 2) {
    const surface = (['carpet', 'wood', 'towel', 'tile', 'carpet', 'towel'] as const)[k];
    return { test: 'floor', push: 'strong', lanes: [lane('strong', surface)] };
  }
  const [push, top, bottom] = PAIRS[k];
  return { test: 'pair', push, lanes: [lane(push, ...top), lane(push, ...bottom)] };
}

function prompt(round: Round): string {
  if (round.test === 'let-go') return `A ${round.push} push. The hand lets go. Where does the car stop?`;
  if (round.test === 'floor') return `A strong push on ${PLACE[round.lanes[0].surface]}. Where does the car stop?`;
  return 'Same push. Look where the floors change. Which car goes farther?';
}

function zoneOf(stop: number): Zone {
  return ZONES.find(([, , lo, hi]) => stop >= lo && stop <= hi)![0];
}

function farther(round: Round): Side {
  const [a, b] = round.lanes;
  return a.stop === b.stop ? 'same' : a.stop > b.stop ? 'top' : 'bottom';
}

function matches(round: Round, prediction: Answer): boolean {
  return round.test === 'pair' ? prediction === farther(round) : prediction === zoneOf(round.lanes[0].stop);
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#24170f';
/** x of mark 0 (where the hand lets go) and the width of one mark. */
const X0 = 100;
const U = 27;
const CAR = 56;
const xAt = (marks: number) => X0 + marks * U;

/** Chevrons beside the push label: how hard the hand pushed before letting go. */
const CHEVRONS: Record<Push, number> = { gentle: 1, medium: 2, strong: 3 };
const PUSH_LABEL: Record<Push, string> = { gentle: 'Gentle push', medium: 'Medium push', strong: 'Strong push' };

/** One stretch of floor: its top edge at y, 22 high, from x0 to x1. */
function Floor({ surface, y, x0 = 30, x1 = 390 }: { readonly surface: Surface; readonly y: number; readonly x0?: number; readonly x1?: number }) {
  const h = 22;
  const w = x1 - x0;
  const parts: ReactNode[] = [];
  switch (surface) {
    case 'wood':
      parts.push(<rect key="b" x={x0} y={y} width={w} height={h} fill="#c8913f" />);
      parts.push(<line key="m" x1={x0} y1={y + h / 2} x2={x1} y2={y + h / 2} stroke="#8a5a24" strokeWidth="1.5" />);
      for (let x = x0 + 40, i = 0; x < x1 - 4; x += 35, i += 1) {
        const top = i % 2 === 0;
        parts.push(<line key={`j${x}`} x1={x} y1={top ? y : y + h / 2} x2={x} y2={top ? y + h / 2 : y + h} stroke="#8a5a24" strokeWidth="1.5" />);
      }
      break;
    case 'tile':
      parts.push(<rect key="b" x={x0} y={y} width={w} height={h} fill="#efe6d2" />);
      for (let x = x0 + 30; x < x1; x += 30) parts.push(<line key={`g${x}`} x1={x} y1={y} x2={x} y2={y + h} stroke="#b9ab90" strokeWidth="2" />);
      break;
    case 'carpet':
      parts.push(<rect key="b" x={x0} y={y} width={w} height={h} fill="#9e2f2a" />);
      for (let x = x0 + 3; x < x1 - 4; x += 6) {
        parts.push(<line key={`t${x}`} x1={x} y1={y + 2} x2={x + 1} y2={y + 8} stroke="#d0645b" strokeWidth="2" strokeLinecap="round" />);
        parts.push(<line key={`u${x}`} x1={x + 3} y1={y + 11} x2={x + 4} y2={y + 17} stroke="#7a221e" strokeWidth="2" strokeLinecap="round" />);
      }
      break;
    case 'towel':
      parts.push(<rect key="b" x={x0} y={y} width={w} height={h} fill="#2f8f9d" />);
      parts.push(<rect key="s1" x={x0} y={y + 9} width={w} height="4" fill="#f2c14e" />);
      for (let x = x0 + 6; x < x1 - 3; x += 9) parts.push(<circle key={`l${x}`} cx={x} cy={y + 4} r="3.2" fill="none" stroke="#a7dbe2" strokeWidth="1.8" />);
      for (let x = x0 + 10; x < x1 - 3; x += 9) parts.push(<circle key={`m${x}`} cx={x} cy={y + 17} r="3.2" fill="none" stroke="#1f6c77" strokeWidth="1.8" />);
      break;
  }
  return (
    <g>
      {parts}
      <rect x={x0} y={y} width={w} height={h} fill="none" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** A lane's floor: one surface, or two with the change drawn at the patch's mark. */
function LaneFloor({ ln, y }: { readonly ln: Lane; readonly y: number }) {
  if (!ln.patch) return <Floor surface={ln.surface} y={y} />;
  const cut = xAt(ln.patch.from);
  return (
    <g>
      <Floor surface={ln.surface} y={y} x1={cut} />
      <Floor surface={ln.patch.surface} y={y} x0={cut} />
      <line x1={cut} y1={y - 6} x2={cut} y2={y + 22} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The ruler under the floor (its top at y): marks 0..10, mark 0 (where the hand lets go) drawn longer. */
function Ruler({ y, circle }: { readonly y: number; readonly circle?: number }) {
  return (
    <g fontSize="14" fontWeight="700" textAnchor="middle" fill={INK}>
      {Array.from({ length: 11 }, (_, m) => (
        <g key={m}>
          <line x1={xAt(m)} y1={y} x2={xAt(m)} y2={y + (m === 0 ? 12 : 8)} stroke={INK} strokeWidth={m === 0 ? 3 : 2} />
          {circle === m ? <circle cx={xAt(m)} cy={y + 20} r="11" fill="#f2a900" stroke={INK} strokeWidth="2" /> : null}
          <text x={xAt(m)} y={y + 25}>{m}</text>
        </g>
      ))}
    </g>
  );
}

/** A toy car whose front bumper is at x and whose wheels sit on the floor at y. */
function Car({ front, y, ghost }: { readonly front: number; readonly y: number; readonly ghost?: boolean }) {
  const b = front - CAR;
  if (ghost) {
    return (
      <g fill="none" stroke="#8a7a68" strokeWidth="2" strokeDasharray="5 4">
        <rect x={b} y={y - 28} width={CAR} height="18" rx="6" />
        <path d={`M${b + 12} ${y - 28} l8 -12 h20 l8 12`} />
        <circle cx={b + 13} cy={y - 8} r="8" />
        <circle cx={b + 43} cy={y - 8} r="8" />
      </g>
    );
  }
  return (
    <g stroke={INK} strokeWidth="2.5">
      <path d={`M${b + 12} ${y - 28} l8 -12 h20 l8 12 z`} fill="#bfe0f2" />
      <rect x={b} y={y - 28} width={CAR} height="18" rx="6" fill="#c8341f" />
      <circle cx={b + 13} cy={y - 8} r="8" fill="#3a2a20" />
      <circle cx={b + 43} cy={y - 8} r="8" fill="#3a2a20" />
      <circle cx={b + 13} cy={y - 8} r="3" fill="#c9ced6" strokeWidth="1.5" />
      <circle cx={b + 43} cy={y - 8} r="3" fill="#c9ced6" strokeWidth="1.5" />
    </g>
  );
}

/** An open hand, fingers pointing right, fingertips at x = 38, just off the car. */
function Hand({ y }: { readonly y: number }) {
  return (
    <g stroke={INK} strokeWidth="2.5" fill="#b97a4e">
      <rect x="2" y={y - 30} width="12" height="22" rx="3" fill="#e8d9c2" />
      <path d={`M14 ${y - 32} h16 q8 0 8 6 v2 q0 4 -6 4 h-4 v4 q0 6 -6 6 h-8 z`} />
      <line x1="20" y1={y - 26} x2="34" y2={y - 26} strokeWidth="1.5" />
    </g>
  );
}

/** "Strong push" with one to three chevrons before it, top left. */
function PushLabel({ push, pair }: { readonly push: Push; readonly pair: boolean }) {
  const n = CHEVRONS[push];
  return (
    <g>
      {Array.from({ length: 3 }, (_, i) => (
        <path
          key={i}
          d={`M${32 + i * 12} 14 l8 7 l-8 7`}
          fill="none"
          stroke={i < n ? INK : '#d8cbb5'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      <text x="74" y="27" fontSize="15" fontWeight="700" fill={INK}>
        {pair ? `Same ${push} push on both` : PUSH_LABEL[push]}
      </text>
    </g>
  );
}

/** The predicted zone, shaded behind the ruler numbers so the tap shows on the strip. */
function ZoneBand({ zone, y }: { readonly zone: Zone; readonly y: number }) {
  const [, , lo, hi] = ZONES.find(([z]) => z === zone)!;
  return <rect x={xAt(lo - 0.5)} y={y + 2} width={(hi - lo + 1) * U} height="30" rx="8" fill="#fff1c9" stroke="#f2a900" strokeWidth="2.5" />;
}

interface LaneViewProps {
  readonly ln: Lane;
  /** y of the wheel line, which is the top of the floor strip. */
  readonly y: number;
  readonly after: boolean;
  readonly title?: string;
  readonly zone?: Zone;
  readonly chosen?: boolean;
  /** Worked-answer evidence: reference flags on the strip (e.g. where this push reached on wood). */
  readonly flags?: readonly Flag[];
}

export interface Flag {
  readonly at: number;
  readonly label: string;
}

function LaneView({ ln, y, after, title, zone, chosen, flags = [] }: LaneViewProps) {
  return (
    <g>
      {chosen ? <rect x="22" y={y - 76} width="374" height="134" rx="10" fill="#fff1c9" stroke="#f2a900" strokeWidth="4" /> : null}
      <LaneFloor ln={ln} y={y} />
      {zone ? <ZoneBand zone={zone} y={y + 22} /> : null}
      <Ruler y={y + 22} circle={after ? ln.stop : undefined} />
      {title ? (
        <text x="30" y={y - 58} fontSize="15" fontWeight="700" fill={INK}>
          {title}
        </text>
      ) : null}
      {flags.map((f) => (
        <g key={f.at}>
          <line x1={xAt(f.at)} y1={y - 36} x2={xAt(f.at)} y2={y} stroke="#5a4636" strokeWidth="2.5" strokeDasharray="4 3" />
          <path d={`M${xAt(f.at)} ${y - 36} h16 l-5 6 l5 6 h-16 z`} fill="#f2a900" stroke={INK} strokeWidth="2" />
          <text x={xAt(f.at)} y={y - 41} fontSize="13" fontWeight="700" textAnchor="middle" fill={INK}>
            {f.label}
          </text>
        </g>
      ))}
      <Hand y={y} />
      {after ? <Car front={X0} y={y} ghost /> : null}
      <Car front={after ? xAt(ln.stop) : X0} y={y} />
    </g>
  );
}

/* ------------------------------------------------------------ the frame -- */

/** Single lane: wheel line y. Two lanes: top and bottom wheel lines. */
const SOLO_Y = 112;
const PAIR_Y = [114, 250] as const;

interface FrameProps {
  readonly round: Round;
  readonly after: boolean;
  /** Before only: the child's prediction, drawn on the strip. */
  readonly answer?: Answer;
  /** Before only, worked stage: reference flags per lane. */
  readonly flags?: readonly (readonly Flag[])[];
}

function ariaFor(round: Round, after: boolean): string {
  if (round.test === 'pair') {
    const [a, b] = round.lanes;
    return after
      ? `Model result: the top car stopped at ${a.stop}, the bottom car at ${b.stop}`
      : `Two toy cars at 0, the same ${round.push} push. Top lane: ${laneText(a)}. Bottom lane: ${laneText(b)}`;
  }
  const ln = round.lanes[0];
  return after
    ? `Model result: after a ${round.push} push on ${NAME[ln.surface]}, the car stopped at ${ln.stop}`
    : `A toy car on ${NAME[ln.surface]} at 0, the moment the hand lets go after a ${round.push} push`;
}

/** The one picture used for both Before and What happened: same viewBox, same scale. */
function Frame({ round, after, answer = null, flags }: FrameProps) {
  const pair = round.test === 'pair';
  const h = pair ? 336 : 200;
  let foot: string;
  if (!after) foot = 'The hand lets go. The front of the car is at 0.';
  else if (pair) foot = `Model result: top car ${round.lanes[0].stop}, bottom car ${round.lanes[1].stop}.`;
  else foot = `Model result: stops at ${round.lanes[0].stop}.`;
  return (
    <svg className="board-svg" viewBox={`0 0 400 ${h}`} role="img" aria-label={ariaFor(round, after)}>
      <PushLabel push={round.push} pair={pair} />
      {pair ? (
        round.lanes.map((ln, i) => (
          <LaneView
            key={i}
            ln={ln}
            y={PAIR_Y[i]}
            after={after}
            title={`${i === 0 ? 'Top' : 'Bottom'}: ${laneText(ln)}`}
            chosen={!after && (answer === 'same' || answer === (i === 0 ? 'top' : 'bottom'))}
            flags={flags?.[i]}
          />
        ))
      ) : (
        <>
          <text x="390" y="27" fontSize="15" fontWeight="700" textAnchor="end" fill={INK}>
            Floor: {NAME[round.lanes[0].surface]}
          </text>
          <LaneView
            ln={round.lanes[0]}
            y={SOLO_Y}
            after={after}
            zone={!after && answer && ZONES.some(([z]) => z === answer) ? (answer as Zone) : undefined}
            flags={flags?.[0]}
          />
        </>
      )}
      <text x="200" y={h - 12} fontSize="15" fontWeight={after ? 700 : 400} textAnchor="middle" fill={after ? '#075c46' : '#5a4636'}>
        {foot}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------ the board -- */

const PUSHES: readonly Push[] = ['gentle', 'medium', 'strong'];
const SURFACES: readonly Surface[] = ['wood', 'tile', 'carpet', 'towel'];

/** One flag per distinct stop, floors that stop at the same mark sharing a label. */
function floorFlags(push: Push): Flag[] {
  const by = new Map<number, Surface[]>();
  for (const s of SURFACES) by.set(stopOn(push, s), [...(by.get(stopOn(push, s)) ?? []), s]);
  return [...by].map(([at, ss]) => ({ at, label: ss.map((s) => NAME[s]).join(', ') }));
}

/** Does the car get as far as the lane's second floor? */
const reaches = (push: Push, ln: Lane): boolean => !!ln.patch && REACH[push] > ln.patch.from * DRAG[ln.surface];

/** The worked answer for one lane of level 3, read off the drawing. */
function laneStory(push: Push, ln: Lane, which: string): string {
  if (!ln.patch) return `${which} car, on ${NAME[ln.surface]} all the way, stops at ${ln.stop}.`;
  return reaches(push, ln)
    ? `${which} car meets the ${NAME[ln.patch.surface]} at ${ln.patch.from} and stops at ${ln.stop}.`
    : `${which} car stops at ${ln.stop}, before the ${NAME[ln.patch.surface]} at ${ln.patch.from}.`;
}

/** The extra evidence drawn on the strip: a reference on 'hint', the whole model on 'worked'. */
function evidence(round: Round, stage: BoardProps<Round, Answer>['stage']): { flags?: Flag[][]; caption?: string } {
  if (stage !== 'hint' && stage !== 'worked') return {};
  const ln = round.lanes[0];
  if (round.test === 'let-go') {
    if (stage === 'hint') {
      const ref: Push = round.push === 'gentle' ? 'strong' : 'gentle';
      return {
        flags: [[{ at: REACH[ref], label: ref }]],
        caption: `The hand stops pushing at 0. A ${ref} push on wood reaches ${REACH[ref]}.`,
      };
    }
    return {
      flags: [PUSHES.map((p) => ({ at: REACH[p], label: p }))],
      caption: `On wood: gentle reaches 2, medium 5, strong 9. This ${round.push} push stops at ${ln.stop}.`,
    };
  }
  if (round.test === 'floor') {
    if (stage === 'hint') {
      // The reference floor stops the car somewhere else, so the hint never is the answer.
      const ref: Surface = DRAG[ln.surface] === DRAG.wood ? 'towel' : 'wood';
      const at = stopOn('strong', ref);
      return {
        flags: [[{ at, label: `on ${NAME[ref]}` }]],
        caption: `On ${THE[ref]} this push reaches ${at}. Under this car: ${TEXTURE[ln.surface]}.`,
      };
    }
    return {
      flags: [floorFlags('strong')],
      caption: `Same strong push: wood and tiles 9, carpet 4, towel 2. Here, on ${NAME[ln.surface]}, it stops at ${ln.stop}.`,
    };
  }
  const [a, b] = round.lanes;
  if (stage === 'hint') {
    const reach = REACH[round.push];
    return {
      flags: [[{ at: reach, label: 'on wood' }], [{ at: reach, label: 'on wood' }]],
      caption: `On wood alone this ${round.push} push reaches ${reach}. Top: ${laneText(a)}. Bottom: ${laneText(b)}.`,
    };
  }
  const end = a.stop === b.stop ? `Both stop at ${a.stop}.` : `The ${a.stop > b.stop ? 'top' : 'bottom'} car goes farther.`;
  return {
    flags: round.lanes.map((l) => [{ at: l.stop, label: 'stops here' }]),
    caption: `${laneStory(round.push, a, 'Top')} ${laneStory(round.push, b, 'Bottom')} ${end}`,
  };
}

/** What the floor is like under the wheels: a fact the child can see in the drawing. */
const TEXTURE: Record<Surface, string> = {
  wood: 'smooth, hard wood',
  tile: 'smooth, hard tiles',
  carpet: 'soft carpet fibres',
  towel: 'a soft towel full of loops',
};

const PAIR_CHOICES: ReadonlyArray<readonly [Side, string]> = [
  ['top', 'Top car'],
  ['bottom', 'Bottom car'],
  ['same', 'Both the same'],
];

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved';
  const { flags, caption } = evidence(round, stage);
  const options: ReadonlyArray<readonly [Zone | Side, string]> =
    round.test === 'pair' ? PAIR_CHOICES : ZONES.map(([z, label]) => [z, label] as const);
  return (
    <div className="board board--push">
      <Frame round={round} after={false} answer={answer} flags={flags} />
      <div className="choices" role="group" aria-label={round.test === 'pair' ? 'Which car goes farther?' : 'Where will the car stop?'}>
        {options.map(([value, label]) => (
          <Choice key={value} selected={answer === value} onTap={() => setAnswer(value)} disabled={locked}>
            {label}
          </Choice>
        ))}
      </div>
      {caption ? <p className="board-caption">{caption}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <Frame round={round} after />;
}

/* ------------------------------------------------------------------ why -- */

/** "the wood", "the tiles": the floor as the object of a sentence. */
const THE: Record<Surface, string> = { wood: 'the wood', tile: 'the tiles', carpet: 'the carpet', towel: 'the towel' };

const FLOOR_WHY: Record<Surface, string> = {
  wood: 'Smooth, hard wood drags on the wheels only a little, so the car keeps rolling on its own a long way, to 9, before it stops.',
  tile: 'Tiles are smooth and hard, like the wood, so they drag on the wheels about as little. The same push carries the car to 9 here too.',
  carpet: 'Carpet fibres squash and rub under the wheels. That drag slows the car sooner, so the same push that reaches 9 on wood stops at 4.',
  towel: 'The soft towel loops squash under the wheels and hold them back. That strong drag stops the car at 2. The push was the same as on wood; only the floor changed.',
};

/** Level 3, one lane: what it rolled on and where it stopped. */
function laneWhy(push: Push, ln: Lane, which: string): string {
  if (!ln.patch) {
    const drag = DRAG[ln.surface] > DRAG.wood ? ', dragging from the start,' : '';
    return `The ${which} car is on ${THE[ln.surface]} the whole way${drag} and stops at ${ln.stop}.`;
  }
  const p = THE[ln.patch.surface];
  return reaches(push, ln)
    ? `The ${which} car meets ${p} at ${ln.patch.from}; more drag there, so it stops at ${ln.stop}.`
    : `The ${which} car stops at ${ln.stop}, before ${p} at ${ln.patch.from}, so ${p} never slows it.`;
}

function why(round: Round): string {
  const [a, b] = round.lanes;
  if (round.test === 'let-go') {
    return `After 0 nothing pushes the car forward, yet it keeps rolling on its own. The wood drags a little on the wheels, so it slows and stops at ${a.stop}. A harder push starts it faster, so it rolls farther.`;
  }
  if (round.test === 'floor') return FLOOR_WHY[a.surface];
  return `Same push, so both leave 0 equally fast. ${laneWhy(round.push, a, 'top')} ${laneWhy(round.push, b, 'bottom')}`;
}

/* ----------------------------------------------------------------- game -- */

export const onePushThenWhat: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'one-push-then-what',
  title: 'One Push. Then What?',
  hook: 'Same push. Different floor.',
  group: 'motion',
  levels: ['Let go', 'Change the floor', 'Where floors change'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches,
  why,
  cover: 'art/games/one-push-then-what.png',
  note: {
    what: 'A toy car sits at 0 on a numbered strip at the moment the hand lets go. He taps where he thinks it will stop (on level 3, which of two cars goes farther when the floor changes partway along), then presses Try to see where it stopped, beside the starting picture.',
    expect: 'Some children pick "Stops at 0" on level 1: they expect the car to stop when the hand stops. Others say it stops because "the push ran out" and expect the same distance on every floor, so the carpet and towel on level 2 are the surprise. On level 3 most will call the lane with a towel in it the loser, wherever the towel sits; that breaks when the towel comes late, or lies beyond where the car would have stopped anyway.',
    practising: 'Two separate ideas, one per level: motion carries on after the push ends (nothing has to keep pushing), and the floor drags on the wheels and decides how soon a rolling car stops. Level 3 adds where the drag acts: a rough patch matters only once the car is on it. Also: reading a distance off a numbered strip.',
    ask: "When the towel car stops at 2 on level 2: 'The push was the same as on the wood. So what stopped it sooner?' On level 3, when both cars stop at 5: 'There is a towel in the top lane. Why did it not matter?'",
    next: 'Tape a start line where a low cardboard ramp meets the floor, so every roll gets the same push. Roll the same toy car onto wood or tiles, then with a bath towel laid flat a few steps out, then with the towel right at the ramp. Mark each stop with a sticky note.',
    honest: 'The distances come from one simple model (each floor costs a fixed amount of the push per mark), not measurements, and a screen cannot let him feel the push. Matching predictions show he can read the pattern; they do not show he understands friction, or that he would keep the push the same in a real test.',
    easier: 'Stay on level 1, and after each one roll a real car on the floor with a gentle push and a strong one.',
    harder: 'On level 3, before pressing Try, ask him to point to the mark where each car first touches a rougher floor, then to say a stopping mark for each car, not just which goes farther, and check it against the strip.',
    safety: 'Use a large toy car with no small detachable parts, keep any ramp low, and keep the two-year-old clear of tape and sticky notes.',
  },
};

export default onePushThenWhat;
