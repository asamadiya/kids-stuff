import type { ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * A T. rex Beside a Bus — compare sizes using one shared scale.
 *
 * Concept (advisor, science 11): lengths can be compared only on one scale and
 * from one start line. Every picture here is drawn to the same scale inside a
 * round, but the things start in different places, so the end that sticks out
 * further is often the SHORTER one. Try lines them up from one start on a
 * metre ruler, in the same frame, beside the unchanged setup.
 *
 * The misconception it challenges: "the one that reaches further is longer"
 * (conservation of length), and "a T. rex is the size of a bus" as a fixed
 * fact. The lengths are named examples — this T. rex, this bus — never a claim
 * about every specimen or vehicle (advisor guardrail).
 *
 * Levels:
 *  1. Two things: which is longer, or the same length?
 *  2. Three things, staggered: which is longest? Mostly close lengths, and the
 *     one that reaches furthest right is usually not the longest.
 *  3. Measure with a unit: how many cars (4 m), young T. rexes (6 m), T. rexes
 *     (12 m) or children (1 m), end to end, match this T. rex or whale? Five
 *     of six units are longer than 1 m, so the ruler's last number is not the
 *     answer: it takes skip-counting in 4s, 6s or 12s. The wrong choices are
 *     the usual slips: metres for units, marks for spaces, joins for units.
 *
 * Static SVG only: fixed setup and fixed outcome, no motion.
 */

type ThingId = 'child' | 'car' | 'short-bus' | 'bus' | 'young-trex' | 'trex' | 'whale';

interface Thing {
  /** On the choice button and over the picture. */
  readonly label: string;
  /** Inside a sentence, after "the" or "this". */
  readonly noun: string;
  readonly plural: string;
  /** The length being compared, in metres. */
  readonly metres: number;
  /** Drawing height in metres: a child lying down, an animal standing, a vehicle. */
  readonly tall: number;
}

/*
 * Chosen examples, not facts about every animal or vehicle (advisor
 * guardrail): a full-size US school bus, a T. rex like the big museum
 * skeletons (about 12 m), a young T. rex, a 24 m adult blue whale.
 */
const THINGS: Record<ThingId, Thing> = {
  child: { label: 'Child', noun: 'child', plural: 'children', metres: 1, tall: 0.32 },
  car: { label: 'Car', noun: 'car', plural: 'cars', metres: 4, tall: 1.5 },
  'short-bus': { label: 'Short school bus', noun: 'short school bus', plural: 'short school buses', metres: 7, tall: 2.8 },
  bus: { label: 'School bus', noun: 'school bus', plural: 'school buses', metres: 12, tall: 3.2 },
  'young-trex': { label: 'Young T. rex', noun: 'young T. rex', plural: 'young T. rexes', metres: 6, tall: 1.9 },
  trex: { label: 'T. rex', noun: 'T. rex', plural: 'T. rexes', metres: 12, tall: 3.8 },
  whale: { label: 'Blue whale', noun: 'blue whale', plural: 'blue whales', metres: 24, tall: 4.2 },
};

/** One thing in its own lane; `start` is where it begins in the setup, in metres. */
interface Lane {
  readonly id: ThingId;
  readonly start: number;
}

export type Round =
  | { readonly mode: 'longer'; readonly lanes: readonly Lane[]; readonly answer: ThingId | 'same' }
  | { readonly mode: 'longest'; readonly lanes: readonly Lane[]; readonly answer: ThingId }
  | {
      readonly mode: 'count';
      readonly big: ThingId;
      readonly unit: ThingId;
      readonly answer: number;
      readonly options: readonly number[];
    };

export type Answer = ThingId | 'same' | number | null;

const lane = (id: ThingId, start: number): Lane => ({ id, start });
const len = (l: Lane) => THINGS[l.id].metres;
const end = (l: Lane) => l.start + len(l);

/*
 * Every setup is staggered. Mostly the shorter (or the equal) thing reaches
 * further right, which is where a five-year-old looks first; a few times the
 * far end does belong to the longer one, so "pick the one that sticks out
 * less" fails as well. Only lining up the starts answers every round.
 */
const LONGER: readonly (readonly Lane[])[] = [
  [lane('trex', 0), lane('bus', 5)],
  [lane('bus', 0), lane('car', 9)],
  [lane('child', 0), lane('car', 2)],
  [lane('whale', 0), lane('trex', 14)],
  [lane('short-bus', 0), lane('trex', 4)],
  [lane('young-trex', 0), lane('car', 3)],
];

/*
 * Half the rounds pit 7 m against 6 m or 6 m against 4 m; a T. rex beside a
 * car and a child needs no ruler. In five rounds of six something shorter
 * reaches furthest right, and the longest starts at 0 in only two, so neither
 * "furthest right" nor "touching the left edge" answers them. Never the T. rex
 * and the young T. rex together: their choice pictures differ only in colour.
 */
const LONGEST: readonly (readonly Lane[])[] = [
  [lane('car', 5), lane('short-bus', 1), lane('young-trex', 4)],
  [lane('young-trex', 0), lane('car', 3), lane('child', 7)],
  [lane('trex', 15), lane('whale', 0), lane('bus', 17)],
  [lane('short-bus', 8), lane('trex', 3), lane('car', 12)],
  [lane('young-trex', 1), lane('car', 0), lane('short-bus', 2)],
  [lane('bus', 4), lane('short-bus', 0), lane('young-trex', 11)],
];

/*
 * Each wrong choice is a real measuring slip: the big thing's metres (12 for
 * the T. rex in cars), the ruler marks at the units' ends (one more than the
 * units), the joins between units (one fewer), or one unit's own metres (4 for
 * a car). The right answer sits first, middle or last, never in one place.
 */
const COUNT: ReadonlyArray<{ readonly big: ThingId; readonly unit: ThingId; readonly options: readonly number[] }> = [
  { big: 'trex', unit: 'car', options: [3, 4, 12] },
  { big: 'whale', unit: 'young-trex', options: [3, 4, 24] },
  { big: 'trex', unit: 'child', options: [11, 12, 13] },
  { big: 'whale', unit: 'car', options: [4, 5, 6] },
  { big: 'trex', unit: 'young-trex', options: [2, 3, 12] },
  { big: 'whale', unit: 'trex', options: [1, 2, 24] },
];

const longest = (lanes: readonly Lane[]): Lane => lanes.reduce((a, b) => (len(b) > len(a) ? b : a));

export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) {
    const lanes = LONGER[k];
    const [a, b] = lanes;
    return { mode: 'longer', lanes, answer: len(a) === len(b) ? 'same' : longest(lanes).id };
  }
  if (level === 2) {
    const lanes = LONGEST[k];
    return { mode: 'longest', lanes, answer: longest(lanes).id };
  }
  const { big, unit, options } = COUNT[k];
  return { mode: 'count', big, unit, options, answer: THINGS[big].metres / THINGS[unit].metres };
}

function prompt(round: Round): string {
  if (round.mode === 'longer') {
    // "Or the same?" is asked aloud: the first round's answer is Same length.
    const [a, b] = round.lanes;
    return `Which is longer: ${THINGS[a.id].noun} or ${THINGS[b.id].noun}? Or the same?`;
  }
  if (round.mode === 'longest') return 'Which of these three is the longest?';
  return `How many ${THINGS[round.unit].plural} long is the ${THINGS[round.big].noun}?`;
}

/* --------------------------------------------------------------- drawing -- */

/*
 * Each thing is drawn in its own metre space, y up, then placed with one
 * transform: translate to its start on the ground line, scale by the round's
 * pixels-per-metre. So its drawn length IS its length on the shared ruler.
 */

const INK = '#24170f';
const RULE = '#e8d9c2';
const SOFT = '#5a4636';

/** Darker partners for the dashed measuring lines, readable on white. */
const MARK: Record<ThingId, string> = {
  child: '#0b6b53',
  car: '#9a2620',
  'short-bus': '#9a6c00',
  bus: '#9a6c00',
  'young-trex': '#557a26',
  trex: '#355f27',
  whale: '#3b6383',
};

const COLOUR: Record<ThingId, string> = {
  child: '#0f8a6b',
  car: '#b8322a',
  'short-bus': '#f2b705',
  bus: '#f2b705',
  'young-trex': '#8fb35a',
  trex: '#4f7f3b',
  whale: '#5f87a6',
};

const NS = { vectorEffect: 'non-scaling-stroke' } as const;

/** Tail tip at x 0, snout at x 1; feet at y 0, skull top at y 1. */
const TREX: ReadonlyArray<readonly [number, number]> = [
  [0, 0.6], [0.2, 0.7], [0.4, 0.8], [0.55, 0.82], [0.68, 0.8], [0.74, 0.86], [0.78, 0.98], [0.92, 1],
  [1, 0.93], [1, 0.84], [0.88, 0.8], [0.8, 0.76], [0.74, 0.66], [0.68, 0.58], [0.62, 0.5],
  [0.6, 0.3], [0.57, 0.1], [0.62, 0.02], [0.62, 0], [0.52, 0], [0.5, 0.08], [0.52, 0.3], [0.5, 0.42],
  [0.46, 0.4], [0.44, 0.22], [0.4, 0.07], [0.45, 0.02], [0.45, 0], [0.35, 0], [0.33, 0.08], [0.36, 0.28], [0.34, 0.5],
  [0.18, 0.56],
];

function busBody(L: number, H: number): string {
  const bx = L - (L > 9 ? 1.6 : 1.1);
  return `M0 0.35 L0 ${H - 0.2} Q0 ${H} 0.2 ${H} L${bx - 0.2} ${H} Q${bx} ${H} ${bx} ${H - 0.2} L${bx} 1.75 L${L - 0.25} 1.6 Q${L} 1.55 ${L} 1.3 L${L} 0.35 Z`;
}

const CAR_BODY = 'M0.05 0.25 L0 0.7 Q0.05 0.85 0.4 0.88 L1 0.92 L1.4 1.45 L2.7 1.45 L3.3 0.92 L3.85 0.85 Q4 0.8 4 0.6 L4 0.3 Q3.95 0.25 3.8 0.25 Z';
/*
 * A whale's flukes lie flat, not upright like a fish's tail, so from the side
 * they are seen edge-on: a thin blade behind the tail stock, tip at x 0.
 */
const WHALE_BODY = 'M0 1.92 Q0.8 1.84 1.6 1.72 Q8 0.3 15 0.2 Q21 0.3 23.3 1.3 Q24 1.7 24 2.3 Q24 3 23 3.3 Q19 4 13 3.9 Q6 3.6 1.6 2.28 Q0.8 2.24 0 2.14 Z';

/** The outline that carries the thing's length; a ghost is this alone, pale. */
function silhouette(id: ThingId, ghost: boolean): ReactNode {
  const { metres: L, tall: H } = THINGS[id];
  const paint = ghost
    ? { fill: COLOUR[id], fillOpacity: 0.18, stroke: MARK[id], strokeWidth: 2, strokeDasharray: '4 3', ...NS }
    : // The child lies on a mat; the mat is the outline that carries his length.
      { fill: id === 'child' ? '#f3e3c3' : COLOUR[id], stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const, ...NS };
  switch (id) {
    case 'trex':
    case 'young-trex':
      return <polygon points={TREX.map(([x, y]) => `${x * L},${y * H}`).join(' ')} {...paint} />;
    case 'bus':
    case 'short-bus':
      return <path d={busBody(L, H)} {...paint} />;
    case 'car':
      return <path d={CAR_BODY} {...paint} />;
    case 'whale':
      return <path d={WHALE_BODY} {...paint} />;
    case 'child':
      return <rect x="0" y="0.03" width="1" height="0.26" rx="0.1" {...paint} />;
  }
}

function Wheel({ x, r }: { readonly x: number; readonly r: number }) {
  return (
    <g>
      <circle cx={x} cy={r} r={r} fill="#3a3330" stroke={INK} strokeWidth="2" {...NS} />
      <circle cx={x} cy={r} r={r * 0.4} fill="#c9ced6" />
    </g>
  );
}

/** Eyes, wheels, windows: drawn over the silhouette, never past its ends. */
function details(id: ThingId): ReactNode {
  const { metres: L, tall: H } = THINGS[id];
  switch (id) {
    case 'trex':
    case 'young-trex':
      return (
        <g>
          <circle cx={0.9 * L} cy={0.92 * H} r={0.012 * L} fill={INK} />
          <path d={`M${L} ${0.86 * H} L${0.86 * L} ${0.83 * H}`} stroke={INK} strokeWidth="2" {...NS} />
          <path d={`M${0.7 * L} ${0.6 * H} L${0.74 * L} ${0.5 * H} L${0.76 * L} ${0.53 * H}`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" {...NS} />
        </g>
      );
    case 'bus':
    case 'short-bus': {
      const bx = L - (L > 9 ? 1.6 : 1.1);
      const n = Math.floor((bx - 0.9) / 1.05);
      return (
        <g>
          <rect x="0" y="1.4" width={bx} height="0.14" fill={INK} />
          {Array.from({ length: n }, (_, i) => (
            <rect key={i} x={0.6 + i * 1.05} y="1.9" width="0.75" height="0.85" rx="0.08" fill="#dfeef7" stroke={INK} strokeWidth="1.5" {...NS} />
          ))}
          <Wheel x={0.25 * L} r={0.5} />
          <Wheel x={L - 0.9} r={0.5} />
        </g>
      );
    }
    case 'car':
      return (
        <g>
          <path d="M1.15 0.97 L1.5 1.36 L2 1.36 L2 0.97 Z M2.1 0.97 L2.1 1.36 L2.62 1.36 L3.08 0.97 Z" fill="#dfeef7" stroke={INK} strokeWidth="1.5" {...NS} />
          <Wheel x={0.85} r={0.33} />
          <Wheel x={3.1} r={0.33} />
        </g>
      );
    case 'whale':
      return (
        <g>
          {/* Small dorsal fin set on the back, two-thirds of the way to the tail, tip swept back. */}
          <path d="M6.7 3.33 L4.8 3.5 L5 3.07 Z" fill="#4a7090" stroke={INK} strokeWidth="1.5" {...NS} />
          <path d="M18.6 0.75 L16.7 0.05 L17.4 0.62 Z" fill="#4a7090" stroke={INK} strokeWidth="1.5" {...NS} />
          <path d="M24 2 Q22 1.5 20 1.4" fill="none" stroke={INK} strokeWidth="2" {...NS} />
          <circle cx="19.7" cy="1.8" r="0.18" fill={INK} />
        </g>
      );
    case 'child':
      // Lying on his back, feet at x 0, head at x 1.
      return (
        <g>
          <rect x="0.04" y="0.05" width="0.32" height="0.07" fill="#8d5a3b" />
          <rect x="0.04" y="0.16" width="0.32" height="0.07" fill="#8d5a3b" />
          <rect x="0" y="0.04" width="0.06" height="0.2" rx="0.02" fill="#f4f1ea" />
          <rect x="0.33" y="0.04" width="0.17" height="0.22" rx="0.03" fill="#2b3a67" />
          <rect x="0.48" y="0.03" width="0.32" height="0.25" rx="0.05" fill={COLOUR.child} />
          <circle cx="0.89" cy="0.16" r="0.11" fill="#1b1410" />
          <circle cx="0.875" cy="0.15" r="0.095" fill="#8d5a3b" />
        </g>
      );
  }
}

/** One thing, `x` px from the left, standing on `ground`, at `s` px per metre. */
function Drawn({ id, x, ground, s, ghost = false }: { readonly id: ThingId; readonly x: number; readonly ground: number; readonly s: number; readonly ghost?: boolean }) {
  return (
    <g transform={`translate(${x} ${ground}) scale(${s} ${-s})`}>
      {silhouette(id, ghost)}
      {ghost ? null : details(id)}
    </g>
  );
}

/** The small picture on a choice button, so a non-reader can choose. */
function Icon({ id }: { readonly id: ThingId }) {
  const { metres: L, tall: H } = THINGS[id];
  const p = L * 0.03;
  return (
    <svg width="76" height="34" viewBox={`${-p} ${-p} ${L + 2 * p} ${H + 2 * p}`} aria-hidden="true">
      <g transform={`translate(0 ${H}) scale(1 -1)`}>
        {silhouette(id, false)}
        {details(id)}
      </g>
    </svg>
  );
}

/** "Same length" as a picture: two bars between the same two dashed lines. */
function SameIcon() {
  return (
    <svg width="76" height="34" viewBox="0 0 76 34" aria-hidden="true">
      <rect x="8" y="5" width="60" height="9" rx="2" fill={COLOUR.bus} stroke={INK} strokeWidth="2" />
      <rect x="8" y="20" width="60" height="9" rx="2" fill={COLOUR.trex} stroke={INK} strokeWidth="2" />
      <line x1="8" y1="1" x2="8" y2="33" stroke={INK} strokeWidth="2" strokeDasharray="3 2" />
      <line x1="68" y1="1" x2="68" y2="33" stroke={INK} strokeWidth="2" strokeDasharray="3 2" />
    </svg>
  );
}

/* ------------------------------------------------------------ the frame -- */

/*
 * One frame per round, shared by the setup and the outcome: the same scale
 * (pixels per metre), the same lanes, the same ruler. Only the positions of
 * the things change between the two pictures.
 */

const W = 400;
const X0 = 24;
const RIGHT = 16;
const LABEL = 16;
const GAP = 10;
const RULER = 46;

interface Frame {
  /** Pixels per metre. */
  readonly s: number;
  /** Metres the ruler covers. */
  readonly span: number;
  /** One thing per lane: the compared things, or [big, unit] when counting. */
  readonly ids: readonly ThingId[];
  readonly tops: readonly number[];
  readonly grounds: readonly number[];
  readonly rulerY: number;
  readonly height: number;
}

function frameOf(round: Round): Frame {
  const ids = round.mode === 'count' ? [round.big, round.unit] : round.lanes.map((l) => l.id);
  const span = round.mode === 'count' ? THINGS[round.big].metres : Math.max(...round.lanes.map(end));
  const s = (W - X0 - RIGHT) / span;
  const tops: number[] = [];
  const grounds: number[] = [];
  let y = 6;
  ids.forEach((id, i) => {
    tops.push(y);
    y += LABEL + THINGS[id].tall * s;
    grounds.push(y);
    // Counting: a row of numerals under the laid-out units.
    y += GAP + (round.mode === 'count' && i === 1 ? 14 : 0);
  });
  return { s, span, ids, tops, grounds, rulerY: y, height: y + RULER };
}

const px = (f: Frame, metres: number) => X0 + metres * f.s;

/** Label the ruler every 1, 2, 5 or 10 m, whichever keeps labels apart. */
function labelStep(f: Frame): number {
  return [1, 2, 5, 10].find((k) => k * f.s >= 30) ?? 10;
}

/** A lane label over a thing; it turns to end at the thing's far end rather than leave the frame. */
function Label({ x, xEnd, y, text, bold }: { readonly x: number; readonly xEnd: number; readonly y: number; readonly text: string; readonly bold?: boolean }) {
  const fits = x + text.length * 6.8 <= W - 4;
  return (
    <text x={fits ? x : Math.min(xEnd, W - 4)} y={y} fontSize="12" fontWeight={bold ? 700 : 600} textAnchor={fits ? 'start' : 'end'} fill={INK} stroke="#fff" strokeWidth="3" paintOrder="stroke">
      {text}
    </text>
  );
}

function FrameSvg({ round, label, note, children }: { readonly round: Round; readonly label: string; readonly note: string; readonly children: ReactNode }) {
  const f = frameOf(round);
  const step = labelStep(f);
  const right = px(f, f.span);
  const whole = Math.floor(f.span);
  const majors = Array.from({ length: Math.floor(whole / step) + 1 }, (_, i) => i * step);
  return (
    <svg className="board-svg" viewBox={`0 0 ${W} ${f.height}`} role="img" aria-label={label}>
      {f.ids.map((id, i) =>
        id === 'whale' ? (
          <rect key={`sea${i}`} x={X0 - 8} y={f.tops[i] + LABEL - 4} width={right - X0 + 16} height={f.grounds[i] - f.tops[i] - LABEL + 6} rx="6" fill="#dceaf4" />
        ) : null,
      )}
      {majors.map((m) => (
        <line key={`grid${m}`} x1={px(f, m)} y1={f.tops[0]} x2={px(f, m)} y2={f.rulerY} stroke="#f1e6d4" strokeWidth="1.5" />
      ))}
      {f.grounds.map((g, i) =>
        f.ids[i] === 'whale' ? null : (
          <line key={`ground${i}`} x1={X0 - 8} y1={g} x2={right + 8} y2={g} stroke={RULE} strokeWidth="3" strokeLinecap="round" />
        ),
      )}
      <g>
        <rect x={X0} y={f.rulerY + 2} width={right - X0} height="10" fill="#fbe7b0" stroke={INK} strokeWidth="1.5" />
        {f.s >= 5
          ? Array.from({ length: whole + 1 }, (_, m) => (
              <line key={`tick${m}`} x1={px(f, m)} y1={f.rulerY + 2} x2={px(f, m)} y2={f.rulerY + (m % step === 0 ? 12 : 7)} stroke={INK} strokeWidth="1.2" />
            ))
          : null}
        {majors.map((m, i) => (
          <text key={`num${m}`} x={px(f, m)} y={f.rulerY + 26} fontSize="11" textAnchor="middle" fill={SOFT}>
            {i === majors.length - 1 ? `${m} m` : m}
          </text>
        ))}
        <text x={W - 4} y={f.height - 5} fontSize="10" fontStyle="italic" textAnchor="end" fill={SOFT}>
          {note}
        </text>
      </g>
      {children}
    </svg>
  );
}

/** A coloured dashed line through a thing's lane and down to the ruler. */
function Mark({ f, i, x }: { readonly f: Frame; readonly i: number; readonly x: number }) {
  return <line x1={x} y1={f.tops[i] + LABEL - 2} x2={x} y2={f.rulerY + 12} stroke={MARK[f.ids[i]]} strokeWidth="2.5" strokeDasharray="5 4" />;
}


const tag = (id: ThingId) => (id === 'child' ? 'Child, lying down' : THINGS[id].label);

/**
 * Compare rounds: every thing in its lane, starting at `starts` (metres); ghosts lined up from 0.
 * Drawn in layers — things, then ghosts, then dashed marks, then labels — so a
 * ghost's far end and its mark are never hidden under the thing they overlap.
 */
function Lanes({ round, starts, measured, marks, ghosts }: {
  readonly round: Round;
  readonly starts: readonly number[];
  readonly measured: boolean;
  readonly marks: boolean;
  readonly ghosts: boolean;
}) {
  if (round.mode === 'count') return null;
  const f = frameOf(round);
  const at = round.lanes.map((l, i) => ({ l, i, x: px(f, starts[i]), xEnd: px(f, starts[i] + len(l)) }));
  return (
    <g>
      {at.map(({ l, i, x }) => <Drawn key={`thing${i}`} id={l.id} x={x} ground={f.grounds[i]} s={f.s} />)}
      {ghosts ? at.map(({ l, i }) => <Drawn key={`ghost${i}`} id={l.id} x={px(f, 0)} ground={f.grounds[i]} s={f.s} ghost />) : null}
      {at.map(({ l, i, x, xEnd }) => (
        <g key={`marks${i}`}>
          {ghosts ? <Mark f={f} i={i} x={px(f, len(l))} /> : null}
          {marks && starts[i] > 0 ? <Mark f={f} i={i} x={x} /> : null}
          {marks ? <Mark f={f} i={i} x={xEnd} /> : null}
        </g>
      ))}
      {at.map(({ l, i, x, xEnd }) => (
        <Label key={`label${i}`} x={x} xEnd={xEnd} y={f.tops[i] + 12} text={measured ? `${tag(l.id)}: ${len(l)} m` : tag(l.id)} bold={measured} />
      ))}
    </g>
  );
}

/** Count rounds: the big thing from 0, and `solid` (+ `ghosts` pale) units end to end beneath it. */
function Units({ round, solid, ghosts, marks }: { readonly round: Round; readonly solid: number; readonly ghosts: number; readonly marks: boolean }) {
  if (round.mode !== 'count') return null;
  const f = frameOf(round);
  const big = THINGS[round.big];
  const u = THINGS[round.unit];
  const total = solid + ghosts;
  const g = f.grounds[1];
  const bigText = solid > 1 ? `${tag(round.big)}: ${big.metres} m` : tag(round.big);
  const unitText = total > 1 ? `${total} ${u.plural}, ${round.unit === 'child' ? 'head to toe' : 'end to end'}` : `One ${u.noun}: ${u.metres} m`;
  return (
    <g>
      {marks ? <Mark f={f} i={0} x={px(f, big.metres)} /> : null}
      {marks ? <Mark f={f} i={1} x={px(f, total * u.metres)} /> : null}
      <Drawn id={round.big} x={px(f, 0)} ground={f.grounds[0]} s={f.s} />
      <Label x={px(f, 0)} xEnd={px(f, big.metres)} y={f.tops[0] + 12} text={bigText} bold={solid > 1} />
      {Array.from({ length: total }, (_, k) => (
        <g key={k}>
          <Drawn id={round.unit} x={px(f, k * u.metres)} ground={g} s={f.s} ghost={k >= solid} />
          {total > 1 ? (
            <text x={px(f, (k + 0.5) * u.metres)} y={g + 13} fontSize="10" fontWeight="700" textAnchor="middle" fill={k >= solid ? SOFT : INK}>
              {k + 1}
            </text>
          ) : null}
        </g>
      ))}
      <Label x={px(f, 0)} xEnd={px(f, total * u.metres)} y={f.tops[1] + 12} text={unitText} bold={total > 1} />
    </g>
  );
}

function altText(round: Round, lined: boolean): string {
  if (round.mode === 'count') {
    const u = THINGS[round.unit];
    return lined
      ? `${round.answer} ${u.plural} laid end to end, as long as the ${THINGS[round.big].noun}, on one ruler in metres`
      : `A ${THINGS[round.big].noun} with one ${u.noun}, ${u.metres} m long, under it, on one ruler in metres`;
  }
  const parts = round.lanes.map((l) => (lined ? `${THINGS[l.id].noun}, ${len(l)} m` : `${THINGS[l.id].noun} starting at ${l.start} m`));
  return `${lined ? 'Lined up from 0 on one ruler: ' : 'Drawn to one scale on a metre ruler: '}${parts.join('; ')}`;
}

/* ------------------------------------------------------------ the board -- */

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved';
  const marks = stage === 'hint' || stage === 'worked';
  const worked = stage === 'worked';
  const pick = (a: Answer) => () => setAnswer(a);

  if (round.mode === 'count') {
    const u = THINGS[round.unit];
    return (
      <div className="board board--scale">
        <FrameSvg round={round} label={altText(round, false)} note="Drawn to one scale.">
          <Units round={round} solid={1} ghosts={worked ? round.answer - 1 : 0} marks={marks} />
        </FrameSvg>
        <div className="choices" role="group" aria-label="Your guess">
          {round.options.map((n) => (
            <Choice key={n} selected={answer === n} onTap={pick(n)} disabled={locked} ariaLabel={`${n} ${u.plural}`}>
              {n}
            </Choice>
          ))}
        </div>
        {marks ? (
          <p className="board-caption">
            {worked
              ? `Pale ${u.plural}, ${round.unit === 'child' ? 'head to toe' : 'end to end'}, from 0 to the end of the ${THINGS[round.big].noun}.`
              : `One ${u.noun} ends at ${u.metres} m. The ${THINGS[round.big].noun} ends at ${THINGS[round.big].metres} m.`}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="board board--scale">
      <FrameSvg round={round} label={altText(round, false)} note="Drawn to one scale.">
        <Lanes round={round} starts={round.lanes.map((l) => l.start)} measured={false} marks={marks && !worked} ghosts={worked} />
      </FrameSvg>
      <div className="choices" role="group" aria-label="Your guess">
        {round.lanes.map((l) => (
          <Choice key={l.id} selected={answer === l.id} onTap={pick(l.id)} disabled={locked} ariaLabel={THINGS[l.id].label}>
            <Icon id={l.id} />
            {THINGS[l.id].label}
          </Choice>
        ))}
        {round.mode === 'longer' ? (
          <Choice selected={answer === 'same'} onTap={pick('same')} disabled={locked} ariaLabel="Same length">
            <SameIcon />
            Same length
          </Choice>
        ) : null}
      </div>
      {marks ? (
        <p className="board-caption">
          {worked
            ? 'Pale outlines: each one moved to start at 0. Compare where they end.'
            : 'Dashed lines: where each one starts and ends on the ruler.'}
        </p>
      ) : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return (
    <FrameSvg round={round} label={altText(round, true)} note="Model: lined up from 0, same scale.">
      {round.mode === 'count' ? (
        <Units round={round} solid={round.answer} ghosts={0} marks />
      ) : (
        <Lanes round={round} starts={round.lanes.map(() => 0)} measured marks ghosts={false} />
      )}
    </FrameSvg>
  );
}

/* ------------------------------------------------------------- the why -- */

const skip = (step: number, n: number) => Array.from({ length: n }, (_, i) => (i + 1) * step).join(', ');

function why(round: Round): string {
  if (round.mode === 'count') {
    const u = THINGS[round.unit];
    const big = THINGS[round.big];
    const row = round.unit === 'child' ? 'head to toe' : 'end to end';
    const each = u.metres === 1 ? `Each ${u.noun} is 1 m, so ${round.answer} make ${big.metres} m.` : `Each ${u.noun} is ${u.metres} m: ${skip(u.metres, round.answer)}.`;
    return `${round.answer} ${u.plural}, ${row}, reach from 0 to ${big.metres} m, the end of the ${big.noun}. ${each}`;
  }
  const byLength = [...round.lanes].sort((a, b) => len(a) - len(b));
  const far = round.lanes.reduce((a, b) => (end(b) > end(a) ? b : a));
  const top = byLength[byLength.length - 1];
  const next = byLength[byLength.length - 2];
  const same = round.answer === 'same';
  const lined = `Lined up from 0: ${byLength.map((l) => `${THINGS[l.id].noun} ${len(l)} m`).join(', ')}.`;
  const verdict = same
    ? ' The same length.'
    : ` The ${THINGS[top.id].noun} is ${round.lanes.length === 2 ? 'longer' : 'longest'}, ${len(top) - len(next)} m more than the ${THINGS[next.id].noun}.`;
  const misled = (same ? end(far) !== Math.min(...round.lanes.map(end)) : far !== top)
    ? ` The ${THINGS[far.id].noun} reached furthest only by starting at ${far.start} m.`
    : '';
  return lined + verdict + misled;
}

export const aTrexBesideABus: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'a-trex-beside-a-bus',
  title: 'A T. rex Beside a Bus',
  hook: 'Same ruler. Same starting line.',
  group: 'world',
  levels: ['Which is longer?', 'Longest of three', 'Measure with a unit'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => prediction === round.answer,
  why,
  cover: 'art/games/a-trex-beside-a-bus.png',
  note: {
    what: 'He sees a child lying down, a car, a school bus, a T. rex or a blue whale drawn to one scale above a metre ruler, but starting at different places. He picks the longer one, or says how many cars, children or T. rexes long the big one is, then presses Try to see them lined up from 0 beside the picture he started from.',
    expect: 'Most five-year-olds pick whichever one reaches furthest right. The setups are staggered so that the shorter one usually sticks out further: the first T. rex and bus are both 12 m, but the bus starts 5 m along. Expect "the bus!", then a long look at the after-picture. At level 3 expect him to read the ruler\'s last number as the answer: 12 for "how many cars long is the T. rex?" That 12 is among the choices on purpose.',
    practising: 'Comparing lengths fairly: the same scale and the same starting line. Measuring as one unit repeated end to end with no gaps, and counting the units, not the marks on the ruler or the metres. With cars, young T. rexes and T. rexes as units, skip-counting in 4s, 6s and 12s.',
    ask: 'Before he presses Try on the T. rex and the bus, point at the two left ends and ask: "Where does each one start?" Then wait.',
    next: 'Lie him on the floor, mark his head and heels with masking tape, and measure the sofa in children, heel to head. Outside, pace out 12 m with chalk (about 15 of your big steps) and stand at each end: that is a T. rex.',
    honest: 'These are chosen examples, not fixed sizes. Real T. rexes, buses and whales vary, and a five-year-old is nearer 1.1 m than 1 m. Getting these right shows he can compare on a ruler drawn for him; it does not show he can measure with a real tape, where lining up the 0 is the hard part.',
    easier: 'Stay on level 1. Before Try, put one finger on each left end and slide both to 0 together. Do it first with a spoon and a pencil on the table, one pushed forward.',
    harder: 'Ask how many children long the blue whale is (24), and how many cars long two T. rexes nose to tail would be (6). Then have him draw a 12-box ruler on paper and draw the T. rex and the bus on it, both starting at 0.',
    safety: 'Keep the masking tape and chalk away from the two-year-old, and pace out the 12 m in a park or yard, away from traffic.',
  },
};

export default aTrexBesideABus;
