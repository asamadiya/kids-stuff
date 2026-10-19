import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Below the Ground Floor — negative numbers extend below zero.
 *
 * Concept (advisor catalogue, maths 19): the integers as positions on a
 * vertical number line. A nine-floor museum, floor 5 at the top down to −3 in
 * the basement, with the ground floor labelled 0 (advisor content boundary:
 * "Label the building's ground floor 0 explicitly"). Arjun stands in the lift.
 * The fossil store is somewhere underground.
 *
 * The misconceptions it challenges: counting the floor you start on as "one";
 * reading "2 floors below" as floor 2; and, crossing the ground floor,
 * skipping 0 because zero feels like "nothing" rather than a place.
 *
 * Levels:
 *  1. Above the ground. Up and down between 0 and 5. Two of the seven trips
 *     land ON the ground floor, so 0 is a floor you stop at before it is one
 *     you pass; only two start at 0, so "tap the number you heard" fails.
 *  2. Below the ground. Down from 0 into the basement, down within it, and
 *     UP within it (−3 up 2 is −1, a "smaller-looking" number).
 *  3. Across zero. Every trip passes the ground floor, and three of the seven
 *     run backwards: the lift is drawn where it STOPPED and he finds where it
 *     started (went down 5 to −2, so it left floor 3) — undoing a move, not
 *     counting one.
 *
 * Control: tap-to-choose only. Every floor of the building is a Choice; he
 * taps the floor the question asks for.
 */

export interface Round {
  /** The floor the trip starts from. */
  readonly start: number;
  /** Floors to travel: +3 is up three, −2 is down two. Never 0. */
  readonly move: number;
  /** The destination is the fossil room; the prompt names the fossils, not a trip. */
  readonly fossils: boolean;
  /**
   * 'end': the lift waits at the start and he finds where it stops.
   * 'start': the lift is drawn where it stopped and he finds where it set off.
   */
  readonly find: 'end' | 'start';
}

/** The floor he has tapped, or nothing yet. */
export type Answer = number | null;

export const TOP = 5;
export const BOTTOM = -3;
/** Top to bottom, the order the building is drawn in. */
const FLOORS: readonly number[] = Array.from({ length: TOP - BOTTOM + 1 }, (_, i) => TOP - i);

/** A real minus sign, so −2 never reads as a dash. */
export const fmt = (n: number) => (n < 0 ? `−${-n}` : String(n));
const spoken = (n: number) => (n < 0 ? `minus ${-n}` : String(n));
const floors = (n: number) => (n === 1 ? 'floor' : 'floors');
const way = (d: number) => (d > 0 ? 'up' : 'down');

export const target = (r: Round) => r.start + r.move;

/** The floors passed through, in order, not counting the start: (−2, 1) → [−1, 0, 1]. */
export function path(from: number, to: number): number[] {
  const out: number[] = [];
  const step = to > from ? 1 : -1;
  for (let f = from; f !== to; ) {
    f += step;
    out.push(f);
  }
  return out;
}

type Row = readonly [start: number, move: number, tag?: 'fossils' | 'back'];

/**
 * Every floor named — start, stop, answer — lies between −3 and 5. Level 1
 * starts at 0 only twice in seven and lands on 0 twice, so neither "tap the
 * number in the question" nor "0 is not a floor" survives it. Level 3 crosses
 * zero every time; 'back' rows ask where the trip began.
 */
const TABLE: Record<Level, readonly Row[]> = {
  1: [[0, 3], [2, 2], [4, -3], [1, 4], [3, -3], [0, 5], [5, -5]],
  2: [[0, -2, 'fossils'], [0, -1], [-1, -2], [0, -3, 'fossils'], [-3, 2], [-2, -1, 'fossils'], [-3, 1]],
  3: [[-2, 3], [2, -4, 'fossils'], [3, -5, 'back'], [-3, 5], [-1, 3, 'back'], [4, -6], [-3, 7, 'back']],
};

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = ((index % 7) + 7) % 7;
  const [start, move, tag] = TABLE[level][k];
  return { start, move, fossils: tag === 'fossils', find: tag === 'back' ? 'start' : 'end' };
}

/** Where the lift is drawn while he answers: at the start, or where a 'back' trip stopped. */
export const liftAt = (r: Round) => (r.find === 'end' ? r.start : target(r));
/** The floor he must tap. */
export const solution = (r: Round) => (r.find === 'end' ? target(r) : r.start);

function prompt(r: Round): string {
  const n = Math.abs(r.move);
  if (r.find === 'start') return `The lift went ${way(r.move)} ${n} to floor ${fmt(target(r))}. Where did it start?`;
  if (r.fossils) {
    return r.start === 0
      ? `The fossils are ${n} ${floors(n)} below the ground floor. Which floor?`
      : `From floor ${fmt(r.start)}, the fossils are ${n} ${floors(n)} down. Which floor?`;
  }
  return `The lift is on floor ${fmt(r.start)}. Go ${way(r.move)} ${n}. Which floor?`;
}

/** One sentence about where the tapped floor sits relative to the lift. A fact, never a verdict. */
export function hintLine(r: Round, answer: Answer): string {
  const lift = liftAt(r);
  if (r.find === 'start') {
    const came = `The lift came ${way(r.move)} to floor ${fmt(lift)}.`;
    if (answer === null) return `${came} So it started ${r.move > 0 ? 'lower down' : 'higher up'}.`;
    if (answer === lift) return `${came} It started on a different floor.`;
    const k = Math.abs(answer - lift);
    return `${came} Floor ${fmt(answer)} is ${k} ${floors(k)} ${answer > lift ? 'above' : 'below'} it.`;
  }
  if (answer === null) {
    // On a one-floor trip "one floor down is floor −1" would be the answer itself.
    if (Math.abs(r.move) === 1) return `Nothing is tapped yet. The lift is on floor ${fmt(lift)}.`;
    const next = lift + Math.sign(r.move);
    return `The lift is on floor ${fmt(lift)}. One floor ${way(r.move)} is floor ${fmt(next)}.`;
  }
  if (answer === lift) return `The lift is already on floor ${fmt(lift)}. It has not moved.`;
  const k = Math.abs(answer - lift);
  return `Floor ${fmt(answer)} is ${k} ${floors(k)} ${way(answer - lift)} from floor ${fmt(lift)}.`;
}

function check(r: Round, answer: Answer): Verdict {
  if (answer === solution(r)) return { ok: true };
  return { ok: false, hint: hintLine(r, answer) };
}

/** The trip as a number sentence: −2 + 3 = 1, 2 − 4 = −2. */
export const sentence = (r: Round) =>
  `${fmt(r.start)} ${r.move > 0 ? '+' : '−'} ${Math.abs(r.move)} = ${fmt(target(r))}`;

function explain(r: Round): string {
  const e = target(r);
  const n = Math.abs(r.move);
  if (r.find === 'start') {
    const back = path(e, r.start).map(fmt).join(', ');
    return `From floor ${fmt(e)}, count back ${way(-r.move)} ${n}: ${back}. It started on floor ${fmt(r.start)}, and ${sentence(r)}.`;
  }
  const steps = path(r.start, e).map(fmt).join(', ');
  if (r.fossils && r.start === 0) {
    return `Count down from the ground floor: ${steps}. The fossil room is floor ${fmt(e)}, ${n} below 0.`;
  }
  const crosses = r.start !== 0 && e !== 0 && Math.sign(r.start) !== Math.sign(e);
  if (crosses) return `Count ${way(r.move)} from floor ${fmt(r.start)}: ${steps}. Zero is a floor too, so ${sentence(r)}.`;
  return `Count ${way(r.move)} from floor ${fmt(r.start)}: ${steps}. That is ${n} ${floors(n)}, so ${sentence(r)}.`;
}

/* ------------------------------------------------------------- drawing -- */

/** Every floor slice shares one viewBox, so the plates, rooms and shaft line up row to row. */
const VW = 720;
const VH = 48;
const SHAFT_X = 606;
const CAR_X = 650;
const MARK_X = 628;

const WALL = { above: '#f6dfb0', ground: '#f2c879', below: '#c99d6e' } as const;
const STONE = '#a3774b';
const WINDOW = '#8fc1e3';
const SHAFT = '#5e6f80';
const CAR = '#e0a73a';
const BONE = '#f7eed8';

const stack: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, padding: 8 };
const sky: CSSProperties = { ...stack, background: '#d6ecf7', borderRadius: '14px 14px 0 0', borderBottom: '12px solid #4c8a2e' };
const soil: CSSProperties = { ...stack, background: '#7a4b2a', borderRadius: '0 0 14px 14px', paddingBottom: 14 };
const sliceStyle: CSSProperties = { width: '100%', height: 'auto', display: 'block' };

/** Arjun in the lift car. Solid when he is on this floor, a dashed outline where he set off. */
function Car({ ghost }: { ghost?: boolean }) {
  if (ghost) {
    return <rect x={CAR_X} y={5} width={40} height={38} rx={4} fill="none" stroke="#24170f" strokeWidth={2.5} strokeDasharray="5 4" />;
  }
  return (
    <g>
      <rect x={CAR_X} y={5} width={40} height={38} rx={4} fill={CAR} stroke="#24170f" strokeWidth={2.5} />
      <circle cx={CAR_X + 20} cy={16} r={6} fill="#8d5a3b" />
      <path d={`M${CAR_X + 14} 15 a6 6 0 0 1 12 0 q-6 -3 -12 0z`} fill="#1b1410" />
      <rect x={CAR_X + 13} y={22} width={14} height={12} rx={3} fill="#2f6b3a" />
      <circle cx={CAR_X + 20} cy={27} r={2} fill="#f08a24" />
      <rect x={CAR_X + 14} y={34} width={12} height={8} rx={2} fill="#24365e" />
    </g>
  );
}

/** A long-necked skeleton, bone on stone: the fossil room, shown once the trip is solved or worked. */
function Fossil() {
  return (
    <g stroke="#24170f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M250 30 q30 -16 70 -8 q40 6 70 -6 q20 -10 32 -20" fill="none" stroke={BONE} strokeWidth={6} />
      <path d="M250 30 q30 -16 70 -8 q40 6 70 -6 q20 -10 32 -20" fill="none" />
      <ellipse cx={428} cy={7} rx={8} ry={5} fill={BONE} />
      {[300, 314, 328, 342, 356].map((x) => (
        <line key={x} x1={x} y1={22 + (x > 330 ? 2 : 0)} x2={x} y2={33} stroke="#24170f" strokeWidth={3} />
      ))}
      <path d="M306 28 l-4 16 M322 28 l4 16 M362 26 l-4 18 M378 24 l4 20" fill="none" strokeWidth={4} />
      <path d="M306 28 l-4 16 M322 28 l4 16 M362 26 l-4 18 M378 24 l4 20" fill="none" stroke={BONE} strokeWidth={2} />
    </g>
  );
}

interface FloorDraw {
  readonly floor: number;
  readonly car: 'here' | 'left' | null;
  /** The step number along the counted trip, 1 for the first floor reached. */
  readonly step: number | null;
  readonly chosen: boolean;
  readonly arrived: boolean;
  readonly fossils: boolean;
}

function FloorSlice({ floor, car, step, chosen, arrived, fossils }: FloorDraw) {
  const wall = floor > 0 ? WALL.above : floor === 0 ? WALL.ground : WALL.below;
  const plate = chosen ? 'var(--gold)' : arrived ? 'var(--maths-tint)' : '#ffffff';
  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ ...sliceStyle, flex: '1 1 auto' }} aria-hidden="true">
      <rect x={4} y={4} width={84} height={40} rx={8} fill={plate} stroke="#24170f" strokeWidth={2.5} />
      <text x={46} y={35} textAnchor="middle" fontSize={28} fontWeight={700} fill="#24170f">
        {fmt(floor)}
      </text>
      <rect x={98} y={2} width={500} height={44} rx={4} fill={wall} stroke="#24170f" strokeWidth={2} />
      {floor > 0 ? (
        <g fill={WINDOW} stroke="#24170f" strokeWidth={1.5}>
          <rect x={130} y={11} width={44} height={24} rx={3} />
          <rect x={470} y={11} width={44} height={24} rx={3} />
        </g>
      ) : null}
      {floor === 0 ? (
        <g>
          <text x={118} y={32} fontSize={20} fontWeight={700} fill="#24170f">
            Ground floor
          </text>
          <rect x={500} y={10} width={40} height={36} rx={3} fill="#8a4f24" stroke="#24170f" strokeWidth={1.5} />
        </g>
      ) : null}
      {floor < 0 ? (
        <path d="M98 16 h500 M98 31 h500 M180 2 v14 M330 2 v14 M480 2 v14 M250 16 v15 M410 16 v15 M180 31 v15 M330 31 v15 M480 31 v15" stroke={STONE} strokeWidth={1.5} fill="none" />
      ) : null}
      {fossils ? <Fossil /> : null}
      <rect x={SHAFT_X} y={0} width={110} height={VH} fill={SHAFT} />
      {car === 'here' ? <Car /> : car === 'left' ? <Car ghost /> : null}
      {step !== null ? (
        <g>
          <circle cx={MARK_X} cy={24} r={14} fill="var(--gold)" stroke="#24170f" strokeWidth={2} />
          <text x={MARK_X} y={31} textAnchor="middle" fontSize={19} fontWeight={700} fill="#24170f">
            {step}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

/** A flat museum roof over floor 5, inset to match the floor slices inside their Choice buttons. */
function Roof() {
  return (
    <div style={{ padding: '0 calc(var(--s4) + var(--line))' }}>
      <svg viewBox={`0 0 ${VW} 44`} style={sliceStyle} aria-hidden="true">
        <path d="M86 42 L348 4 L610 42 Z" fill="#c8372d" stroke="#24170f" strokeWidth={2.5} strokeLinejoin="round" />
        <text x={348} y={36} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff8ec" letterSpacing={3}>
          MUSEUM
        </text>
      </svg>
    </div>
  );
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const end = target(round);
  const lift = liftAt(round);
  const ans = solution(round);
  const locked = stage === 'worked' || stage === 'solved';
  // Counting always runs from where the lift is drawn. Hint: to the floor he
  // tapped, or one floor if he tapped none (not on a one-floor trip, where that
  // one floor is the answer). Worked and solved: the whole trip — start to
  // stop, or for a 'start' round stop back to start.
  const toward = round.find === 'end' ? Math.sign(round.move) : -Math.sign(round.move);
  const peek = Math.abs(round.move) > 1 ? lift + toward : null;
  const tripTo = locked ? ans : stage === 'hint' ? answer ?? peek : null;
  const steps = tripTo === null || tripTo === lift ? [] : path(lift, tripTo);

  const floor = (f: number) => {
    const car = locked ? (f === end ? 'here' : f === round.start ? 'left' : null) : f === lift ? 'here' : null;
    const at = steps.indexOf(f);
    const chosen = stage !== 'worked' && answer === f;
    return (
      <Choice
        key={f}
        selected={chosen}
        onTap={() => setAnswer(f)}
        disabled={locked}
        mark={locked && f === ans ? 'right' : null}
        ariaLabel={`Floor ${spoken(f)}${f === 0 ? ', the ground floor' : ''}${car === 'here' ? ', the lift is here' : ''}`}
      >
        <FloorSlice
          floor={f}
          car={car}
          step={at < 0 ? null : at + 1}
          chosen={chosen}
          arrived={locked && f === ans}
          fossils={round.fossils && locked && f === end}
        />
      </Choice>
    );
  };

  return (
    <div className="board">
      <div style={{ width: '100%', maxWidth: 560, margin: '0 auto' }} role="group" aria-label="The museum floors, 5 at the top to minus 3 at the bottom">
        <div style={sky}>
          <Roof />
          {FLOORS.filter((f) => f >= 0).map(floor)}
        </div>
        <div style={soil}>{FLOORS.filter((f) => f < 0).map(floor)}</div>
      </div>
      {locked ? (
        <p className="board-caption">
          <strong style={{ fontSize: 'var(--t-lg)', color: 'var(--ink)' }}>{sentence(round)}</strong>
          {round.find === 'start' ? <span>{`  It started on floor ${fmt(round.start)}.`}</span> : null}
          {round.fossils ? <span>{`  The fossil room is floor ${fmt(end)}.`}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

export const belowTheGroundFloor: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'below-the-ground-floor',
  title: 'Below the Ground Floor',
  hook: 'Ride the lift below zero.',
  group: 'numbers',
  levels: ['Above the ground', 'Below the ground', 'Across zero'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/below-the-ground-floor.png',
  note: {
    what: 'A museum drawn as a stack of floors, 5 at the top, the ground floor marked 0, and three basements, −1 to −3, under the grass. Arjun is in the lift; he taps the floor the lift will reach, or the floor where the fossils are stored. On level 3 some trips run backwards: the lift is shown where it stopped and he taps the floor it set off from.',
    expect: "Two slips are common. He counts the floor the lift is already on as 'one', landing one floor short. And he skips 0, or will not stop on it, because zero sounds like nothing rather than a floor; some level 1 trips stop on the ground floor, and the hint numbers every floor passed, 0 included. On level 3's 'where did it start?' trips he will first count on the same way the lift went; the hint repeats which way it came and how far his floor is from where it stopped.",
    practising: 'Negative numbers as positions below zero on a vertical number line; counting on and back across zero; and, on level 3, undoing a move (if up 3 ends on 2, the start is 3 below 2). Also that −3 is lower than −1 even though 3 is bigger than 1.',
    ask: "When the lift is on −2 and the prompt says go up 3, ask before he taps: 'Which floors do you pass on the way up? Is the ground floor one of them?'",
    next: "Stick masking tape up a door frame, mark 5 down to −3 with 0 at a line you call the ground, and walk a toy dinosaur up and down it. Next time you ride a lift, read the buttons: American lifts usually call street level 1 or L and the basements B1, B2; Indian ones usually mark the ground floor G. Ask which button would be 0 here.",
    honest: 'Tapping the right floor shows he can count steps along a labelled ladder with the floors in view. It does not show he can compare −5 with −2 without a picture, or that he understands 2 − 4 written on paper. Ask him which is colder, −5 or −2 degrees, with no building in sight.',
    easier: 'Stay on level 1, or have him put a finger on the lift and move it one floor at a time, saying each floor number aloud, before he taps.',
    harder: "Ask the reverse question with no screen: 'The lift went from 2 down to −2. How many floors did it go?' Then: 'Which is lower, −3 or −1, and by how many floors?'",
  },
};

export default belowTheGroundFloor;
