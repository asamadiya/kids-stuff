import type { ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Who's in the Sunlight? — daylight, the Earth's spin, and the Moon's phases.
 *
 * Concept (advisor, science 9): the Earth spins once in about 24 hours and the
 * half facing the sun has day. India and California sit on nearly opposite
 * sides of the Earth, so when it is night in California it is day in India.
 * Ordinary Moon phases are changing views of the Moon's sunlit half — never
 * the Earth's shadow. Misconceptions it targets: "the sun goes behind the
 * hills / goes to sleep", "it is night everywhere at once", and "the Earth's
 * shadow makes the crescent".
 *
 * Shape: predict (tap-to-choose) → Try → the outcome in the same frame and
 * scale as the setup → why. Every picture is a labelled model seen from above
 * the North Pole, at an equinox, not to scale. No motion: fixed states only.
 *
 * Levels (separate scenarios, same control — the advisor's boundary between
 * the Earth's rotation and the Moon's phases):
 *  1. Facing the sun. A plain globe, the sun on the left or the right, pins for
 *     California and India. Day or night at one pin? The outcome shades the
 *     half turned away from the sun.
 *  2. The Earth spins. Day and night halves are drawn; the Earth turns for 6,
 *     12, 18 or 24 hours, shown as a share of one turn on a gold disc. Day or
 *     night at the pin then? The pins move round; the lit half stays facing
 *     the sun.
 *  3. The Moon's lit half. The Moon at one of eight places on its orbit, its
 *     sunlit half drawn. Which shape do we see from Earth?
 *
 * Geography: the pins sit at Jaipur (26.9° N, 75.8° E) and central California
 * (about 37° N, 120° W): 196° of longitude apart, about 13 hours by the sun.
 * Clocks differ by 12½ or 13½ hours (time zones, daylight saving); the model
 * uses sun time, and the grown-up note says so. Every round keeps both pins at
 * least 1½ hours of sun time from sunrise or sunset, so no answer sits on the
 * line between day and night.
 */

type Place = 'california' | 'india';
type Side = 'left' | 'right';
type Turn = 6 | 12 | 18 | 24;
type Phase = 'new' | 'crescent' | 'half' | 'gibbous' | 'full';

export type Round =
  /** Level 1: the sun on one side; `cal` is California's sun-hour (0–24). */
  | { readonly kind: 'face'; readonly sun: Side; readonly ask: Place; readonly cal: number }
  /** Level 2: the sun on the left; the Earth then spins for `hours`. */
  | { readonly kind: 'spin'; readonly ask: Place; readonly cal: number; readonly hours: Turn }
  /** Level 3: the Moon's place on its orbit, degrees anticlockwise from the right; the sun is on the left. */
  | { readonly kind: 'moon'; readonly at: number };

export type Answer = 'day' | 'night' | Phase | null;

const NAME: Record<Place, string> = { california: 'California', india: 'India' };
const OTHER: Record<Place, Place> = { california: 'india', india: 'california' };
/** Hours India is ahead of California by the sun: 196° of longitude at 15° an hour. */
const INDIA_AHEAD = 196 / 15;
/** Distance from the pole, as a share of the equator's radius, seen from above: cos(latitude). */
const LAT_R: Record<Place, number> = { california: 0.8, india: 0.89 };
const PIN: Record<Place, string> = { california: '#ff8a3d', india: '#ff5fa2' };

const TURN: Record<Turn, string> = {
  6: 'a quarter of a turn',
  12: 'half a turn',
  18: 'three quarters of a turn',
  24: 'one whole turn',
};

const PHASES: readonly Phase[] = ['new', 'crescent', 'half', 'gibbous', 'full'];
const PHASE_LABEL: Record<Phase, string> = {
  new: 'Dark',
  crescent: 'Crescent',
  half: 'Half',
  gibbous: 'More than half',
  full: 'Full',
};
const PHASE_NAME: Record<Phase, string> = {
  new: 'dark new moon',
  crescent: 'crescent',
  half: 'half moon',
  gibbous: 'moon more than half lit',
  full: 'full moon',
};
/** Sun–Earth–Moon angle that draws each choice: 0 is new, 180 is full. */
const PHASE_E: Record<Phase, number> = { new: 0, crescent: 50, half: 90, gibbous: 130, full: 180 };

const mod = (n: number, m: number) => ((n % m) + m) % m;
const hourAt = (place: Place, cal: number) => mod(place === 'california' ? cal : cal + INDIA_AHEAD, 24);
/** Equinox model: the sun is up from 6 to 18 sun time everywhere. */
const isDay = (place: Place, cal: number) => {
  const h = hourAt(place, cal);
  return h > 6 && h < 18;
};

/** Angle between the sun and the Moon as seen from Earth: 0 new, 90 half, 180 full. */
const elongation = (at: number) => Math.abs(mod(at, 360) - 180);
/** Below the Earth in the picture is the waxing side: lit on the right, seen from California or India. */
const litSide = (at: number): Side => (mod(at, 360) > 180 ? 'right' : 'left');

function phaseOf(at: number): Phase {
  const e = elongation(at);
  if (e < 10) return 'new';
  if (e < 70) return 'crescent';
  if (e < 110) return 'half';
  if (e < 170) return 'gibbous';
  return 'full';
}

/* ---------------------------------------------------------------- rounds -- */

const FACE: ReadonlyArray<readonly [Side, Place, number]> = [
  ['left', 'india', 12],
  ['right', 'california', 13.5],
  ['left', 'california', 23],
  ['right', 'india', 1],
  ['left', 'india', 21],
  ['right', 'california', 2.5],
];

const SPIN: ReadonlyArray<readonly [Place, number, Turn]> = [
  ['california', 12, 12],
  ['india', 21, 6],
  ['california', 22, 24],
  ['india', 9, 12],
  ['california', 2, 6],
  ['india', 14, 18],
];

/** All eight places on the orbit, ordered so any five consecutive rounds show at least four shapes. */
const MOON: readonly number[] = [270, 0, 225, 180, 90, 315, 135, 45];

export function generate(level: Level, index: number): Round {
  if (level === 1) {
    const [sun, ask, cal] = FACE[index % FACE.length];
    return { kind: 'face', sun, ask, cal };
  }
  if (level === 2) {
    const [ask, cal, hours] = SPIN[index % SPIN.length];
    return { kind: 'spin', ask, cal, hours };
  }
  return { kind: 'moon', at: MOON[index % MOON.length] };
}

function truth(round: Round): Exclude<Answer, null> {
  switch (round.kind) {
    case 'face':
      return isDay(round.ask, round.cal) ? 'day' : 'night';
    case 'spin':
      return isDay(round.ask, round.cal + round.hours) ? 'day' : 'night';
    case 'moon':
      return phaseOf(round.at);
  }
}

function prompt(round: Round): string {
  switch (round.kind) {
    case 'face':
      return `Is it day or night in ${NAME[round.ask]}?`;
    case 'spin':
      return `The Earth spins for ${round.hours} hours. Day or night in ${NAME[round.ask]}?`;
    case 'moon':
      return 'The Moon is here. From Earth, what shape do we see?';
  }
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#24170f';
const SOFT = '#5a4636';
const OCEAN = '#3f8fd2';
const NIGHT = '#1d2a4a';
const SUN = '#f2a900';
const RAY = '#d98a00';
const LIT = '#f6e7a6';
const DARK = '#4a4f66';
const GOLD = '#e08a00';
const FONT = 'Fredoka, system-ui, sans-serif';

const rad = (deg: number) => (deg * Math.PI) / 180;
const f = (n: number) => n.toFixed(1);
/** The point at `deg` (anticlockwise from the right, as in maths) and radius r about (cx, cy), in SVG coordinates. */
function polar(cx: number, cy: number, r: number, deg: number): readonly [number, number] {
  return [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
}
/** Points along a circle from `from` to `to` degrees, anticlockwise. */
function arcPoints(cx: number, cy: number, r: number, from: number, to: number): string {
  const n = Math.max(2, Math.ceil((to - from) / 4));
  return Array.from({ length: n + 1 }, (_, i) => polar(cx, cy, r, from + ((to - from) * i) / n).map(f).join(',')).join(' ');
}
/** An arrowhead with its tip at (x, y), pointing along (dx, dy). */
function head(x: number, y: number, dx: number, dy: number, size = 10): string {
  const len = Math.hypot(dx, dy);
  const [ux, uy] = [dx / len, dy / len];
  const [bx, by] = [x - ux * size, y - uy * size];
  const w = size * 0.6;
  return `${f(x)},${f(y)} ${f(bx - uy * w)},${f(by + ux * w)} ${f(bx + uy * w)},${f(by - ux * w)}`;
}
/** An arrowhead at the end of an anticlockwise arc that finishes at `deg`. */
function arcHead(cx: number, cy: number, r: number, deg: number, size = 10): string {
  const [x, y] = polar(cx, cy, r, deg);
  return head(x, y, -Math.sin(rad(deg)), -Math.cos(rad(deg)), size);
}

function Frame({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <svg className="board-svg" viewBox="0 0 400 260" role="img" aria-label={label}>
      <rect x="0" y="0" width="400" height="260" fill="#fbf4e4" />
      {children}
      <text x="8" y="252" fontFamily={FONT} fontSize="11" fill={SOFT}>
        Looking down on the North Pole
      </text>
      <text x="394" y="252" fontFamily={FONT} fontSize="11" fill={SOFT} textAnchor="end">
        Model · not to scale
      </text>
    </svg>
  );
}

/** Text that reads on the lit ocean and on the night side alike. */
function Label({ x, y, children, size = 13, anchor = 'middle', fill = '#ffffff' }: {
  readonly x: number;
  readonly y: number;
  readonly children: ReactNode;
  readonly size?: number;
  readonly anchor?: 'start' | 'middle' | 'end';
  readonly fill?: string;
}) {
  return (
    <text
      x={f(x)}
      y={f(y)}
      textAnchor={anchor}
      dominantBaseline="middle"
      fontFamily={FONT}
      fontWeight="600"
      fontSize={size}
      fill={fill}
      stroke={fill === '#ffffff' ? INK : 'none'}
      strokeWidth="3"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

function SunDisc({ x, y }: { readonly x: number; readonly y: number }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const [x1, y1] = polar(x, y, 26, i * 45 + 22.5);
        const [x2, y2] = polar(x, y, 35, i * 45 + 22.5);
        return <line key={i} x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke={RAY} strokeWidth="4" strokeLinecap="round" />;
      })}
      <circle cx={x} cy={y} r="20" fill={SUN} stroke={INK} strokeWidth="3" />
      <Label x={x} y={y + 52} fill={INK}>
        Sun
      </Label>
    </g>
  );
}

/* ---- levels 1 and 2: the Earth from above the North Pole ---- */

interface Globe {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly sun: Side;
}

const globeFor = (sun: Side): Globe => ({ cx: sun === 'left' ? 215 : 185, cy: 132, r: 92, sun });
const sunX = (g: Globe) => (g.sun === 'left' ? 40 : 360);
/** Where a place's pin sits when it is `cal` o'clock by the sun in California: noon faces the sun, later hours lie anticlockwise. */
const pinDeg = (g: Globe, place: Place, cal: number) => (g.sun === 'left' ? 180 : 0) + (hourAt(place, cal) - 12) * 15;

function Earth({ g, night = 1 }: { readonly g: Globe; readonly night?: number }) {
  const { cx, cy, r, sun } = g;
  const sweep = sun === 'left' ? 1 : 0;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={OCEAN} />
      {night > 0 ? <path d={`M${cx} ${cy - r} A${r} ${r} 0 0 ${sweep} ${cx} ${cy + r} Z`} fill={NIGHT} opacity={0.82 * night} /> : null}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Pin({ g, place, deg, state, ghost }: {
  readonly g: Globe;
  readonly place: Place;
  readonly deg: number;
  readonly state?: 'day' | 'night';
  readonly ghost?: boolean;
}) {
  const [x, y] = polar(g.cx, g.cy, g.r * LAT_R[place], deg);
  if (ghost) {
    return <circle cx={f(x)} cy={f(y)} r="9" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="4 3" />;
  }
  // The name sits inward from the pin, pulled in by its own half-width so the text never covers the pin.
  const pinR = g.r * LAT_R[place];
  const half = place === 'california' ? 36 : 18;
  const lr = pinR - 13 - half * Math.abs(Math.cos(rad(deg))) - (state ? 18 : 9) * Math.abs(Math.sin(rad(deg)));
  const [lx, ly] = polar(g.cx, g.cy, lr, deg);
  return (
    <g>
      <circle cx={f(x)} cy={f(y)} r="9" fill={PIN[place]} stroke={INK} strokeWidth="3" />
      <Label x={lx} y={state ? ly - 8 : ly}>{NAME[place]}</Label>
      {state ? <Label x={lx} y={ly + 9} size={12}>{state === 'day' ? 'Day' : 'Night'}</Label> : null}
    </g>
  );
}

function Ray({ x1, x2, y }: { readonly x1: number; readonly x2: number; readonly y: number }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - Math.sign(x2 - x1) * 8} y2={y} stroke={RAY} strokeWidth="4" strokeLinecap="round" />
      <polygon points={head(x2, y, x2 - x1, 0, 12)} fill={RAY} />
    </g>
  );
}

/** Sunlight arriving from the sun's side, aimed at the Earth. */
function Sunlight({ g }: { readonly g: Globe }) {
  const [x1, x2] = g.sun === 'left' ? [82, 116] : [318, 284];
  return (
    <g>
      <SunDisc x={sunX(g)} y={g.cy} />
      {[-42, 0, 42].map((dy) => (
        <Ray key={dy} x1={x1} x2={x2} y={g.cy + dy} />
      ))}
    </g>
  );
}

function HalfLabels({ g }: { readonly g: Globe }) {
  const near = g.sun === 'left' ? g.cx - g.r / 2 : g.cx + g.r / 2;
  const far = g.sun === 'left' ? g.cx + g.r / 2 : g.cx - g.r / 2;
  return (
    <g>
      <Label x={near} y={g.cy - g.r - 18} fill={INK}>
        Day half
      </Label>
      <Label x={far} y={g.cy - g.r - 18} fill={INK}>
        Night half
      </Label>
    </g>
  );
}

function ArcArrow({ cx, cy, r, from, to, color, width }: {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly from: number;
  readonly to: number;
  readonly color: string;
  readonly width: number;
}) {
  return (
    <g>
      <polyline points={arcPoints(cx, cy, r, from, to - 3)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={arcHead(cx, cy, r, to, 13)} fill={color} />
    </g>
  );
}

/**
 * How far `hours` turns the Earth, drawn as a share of one whole turn: a disc
 * of four 6-hour quarters with the turned part gold, starting at the top and
 * running the way the Earth spins. Without it, "6 hours" is a number with
 * nothing on the board to tell a child how far that carries the pin.
 */
function TurnMeter({ hours }: { readonly hours: Turn }) {
  const [cx, cy, r] = [360, 50, 20];
  const deg = hours * 15;
  const [x0, y0] = polar(cx, cy, r, 90);
  const [x1, y1] = polar(cx, cy, r, 90 + deg);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#fff6dc" />
      {deg >= 360 ? (
        <circle cx={cx} cy={cy} r={r} fill={GOLD} />
      ) : (
        <path d={`M${cx} ${cy} L${f(x0)} ${f(y0)} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 0 ${f(x1)} ${f(y1)} Z`} fill={GOLD} />
      )}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={INK} strokeWidth="1.5" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={INK} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth="2.5" />
      <text x={cx} y={cy + r + 16} fontFamily={FONT} fontWeight="700" fontSize="13" fill={INK} textAnchor="middle">
        {hours} hours
      </text>
      <text x={cx} y={cy + r + 30} fontFamily={FONT} fontSize="10.5" fill={SOFT} textAnchor="middle">
        1 turn = 24 h
      </text>
    </g>
  );
}

const stateAt = (place: Place, cal: number) => (isDay(place, cal) ? 'day' : 'night');
type Help = 'hint' | 'worked' | null;

/** Level 1: a plain globe before; the half turned away from the sun shaded after. */
function FaceScene({ round, after, help }: { readonly round: Extract<Round, { kind: 'face' }>; readonly after: boolean; readonly help: Help }) {
  const g = globeFor(round.sun);
  const places: readonly Place[] = ['california', 'india'];
  const label = after
    ? `The half of the Earth facing the sun is lit. California: ${stateAt('california', round.cal)}. India: ${stateAt('india', round.cal)}.`
    : `Model: the sun on the ${round.sun}, the Earth seen from above, with pins for California and India.`;
  return (
    <Frame label={label}>
      <Sunlight g={g} />
      <Earth g={g} night={after ? 1 : 0} />
      {help === 'hint' ? (
        <line x1={g.cx} y1={g.cy - g.r - 10} x2={g.cx} y2={g.cy + g.r + 10} stroke={GOLD} strokeWidth="4" strokeDasharray="9 6" />
      ) : null}
      {after ? <HalfLabels g={g} /> : null}
      {places.map((p) => {
        const deg = pinDeg(g, p, round.cal);
        const [x, y] = polar(g.cx, g.cy, g.r * LAT_R[p], deg);
        return (
          <g key={p}>
            {p === round.ask ? <circle cx={f(x)} cy={f(y)} r="16" fill="none" stroke={GOLD} strokeWidth="4" /> : null}
            <Pin g={g} place={p} deg={deg} state={after ? stateAt(p, round.cal) : undefined} />
          </g>
        );
      })}
    </Frame>
  );
}

/** Level 2: day and night halves fixed toward the sun; the pins carried round by the spin. */
function SpinScene({ round, after, help }: { readonly round: Extract<Round, { kind: 'spin' }>; readonly after: boolean; readonly help: Help }) {
  const g = globeFor('left');
  const cal = after ? round.cal + round.hours : round.cal;
  const start = pinDeg(g, round.ask, round.cal);
  const end = start + round.hours * 15;
  const places: readonly Place[] = ['california', 'india'];
  const label = after
    ? `After ${round.hours} hours. California: ${stateAt('california', cal)}. India: ${stateAt('india', cal)}.`
    : `Now. California: ${stateAt('california', cal)}. India: ${stateAt('india', cal)}. The Earth spins anticlockwise, seen from above.`;
  return (
    <Frame label={label}>
      <Sunlight g={g} />
      <Earth g={g} />
      <HalfLabels g={g} />
      <TurnMeter hours={round.hours} />
      <text x="8" y="230" fontFamily={FONT} fontWeight="700" fontSize="16" fill={INK}>
        {after ? `After ${round.hours} hours` : 'Now'}
      </text>
      <ArcArrow cx={g.cx} cy={g.cy} r={g.r + 16} from={300} to={342} color={SOFT} width={3} />
      <text x="394" y="234" fontFamily={FONT} fontSize="12" fill={SOFT} textAnchor="end">
        Spins this way
      </text>
      {after || help ? <ArcArrow cx={g.cx} cy={g.cy} r={g.r + 7} from={start} to={end} color={GOLD} width={4} /> : null}
      {after ? <Pin g={g} place={round.ask} deg={start} ghost /> : null}
      {places.map((p) => {
        const deg = pinDeg(g, p, cal);
        const [x, y] = polar(g.cx, g.cy, g.r * LAT_R[p], deg);
        return (
          <g key={p}>
            {p === round.ask ? <circle cx={f(x)} cy={f(y)} r="16" fill="none" stroke={GOLD} strokeWidth="4" /> : null}
            <Pin g={g} place={p} deg={deg} state={stateAt(p, cal)} />
          </g>
        );
      })}
    </Frame>
  );
}

/* ---- level 3: the Moon's orbit from above, and the view from Earth ---- */

/**
 * The Moon as seen from Earth: a dark disc with its lit part. `e` is the
 * sun–Earth–Moon angle (0 new, 180 full); `side` is the lit limb. The edge
 * between light and dark is an ellipse of half-width r·|cos e|.
 */
function MoonFace({ cx, cy, r, e, side }: {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly e: number;
  readonly side: Side;
}) {
  const rx = Math.abs(r * Math.cos(rad(e)));
  const right = side === 'right';
  const limb = right ? 1 : 0;
  // The terminator bulges toward the lit limb for a crescent, away from it past half.
  const term = (e < 90) === right ? 0 : 1;
  const lit =
    e <= 1
      ? null
      : e >= 179
        ? <circle cx={cx} cy={cy} r={r} fill={LIT} />
        : <path d={`M${cx} ${cy - r} A${r} ${r} 0 0 ${limb} ${cx} ${cy + r} A${f(rx)} ${r} 0 0 ${term} ${cx} ${cy - r} Z`} fill={LIT} />;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={DARK} />
      {lit}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={INK} strokeWidth="3" />
    </g>
  );
}

const SKY = { cx: 192, cy: 128, orbit: 78, earth: 22, moon: 13 } as const;
const INSET = { x: 294, y: 40, w: 102, h: 130 } as const;

function MoonScene({ round, after, help }: { readonly round: Extract<Round, { kind: 'moon' }>; readonly after: boolean; readonly help: Help }) {
  const { cx, cy, orbit, earth, moon } = SKY;
  const [mx, my] = polar(cx, cy, orbit, round.at);
  const phase = phaseOf(round.at);
  const e = elongation(round.at);
  const toEarth = round.at + 180;
  const [sx, sy] = polar(mx, my, moon + 2, toEarth);
  const [ex, ey] = polar(cx, cy, earth + 2, round.at);
  // Outside the path above and below; under the Moon at the sides, where the inset and the sun's rays are.
  const [lx, ly] = Math.abs(Math.cos(rad(round.at))) > 0.7 ? [mx, my + moon + 13] : polar(cx, cy, orbit + 28, round.at);
  // The Earth's name on the side away from the Moon, clear of the line of sight.
  const [tx, ty] = polar(cx, cy, earth + 18, round.at + 180);
  const ix = INSET.x + INSET.w / 2;
  const iy = INSET.y + 64;
  const label = after
    ? `The Moon's sunlit half faces the sun. From Earth we see a ${PHASE_NAME[phase]}.`
    : "Model: the sun on the left, the Earth in the middle, the Moon on its path. The Moon's half facing the sun is lit.";
  return (
    <Frame label={label}>
      <SunDisc x={36} y={cy} />
      {[-36, 0, 36].map((dy) => (
        <Ray key={dy} x1={74} x2={96} y={cy + dy} />
      ))}
      <circle cx={cx} cy={cy} r={orbit} fill="none" stroke={SOFT} strokeWidth="2" strokeDasharray="5 6" />
      <ArcArrow cx={cx} cy={cy} r={orbit} from={300} to={330} color={SOFT} width={3} />
      {/* The Earth: day on the sun's side, as at level 1. */}
      <circle cx={cx} cy={cy} r={earth} fill={OCEAN} />
      <path d={`M${cx} ${cy - earth} A${earth} ${earth} 0 0 1 ${cx} ${cy + earth} Z`} fill={NIGHT} opacity="0.82" />
      <circle cx={cx} cy={cy} r={earth} fill="none" stroke={INK} strokeWidth="3" />
      <Label x={tx} y={ty} fill={INK} size={12}>
        Earth
      </Label>
      {/* The Moon on its path: always lit on the half facing the sun. */}
      <circle cx={f(mx)} cy={f(my)} r={moon} fill={DARK} />
      <path d={`M${f(mx)} ${f(my - moon)} A${moon} ${moon} 0 0 0 ${f(mx)} ${f(my + moon)} Z`} fill={LIT} />
      <circle cx={f(mx)} cy={f(my)} r={moon} fill="none" stroke={INK} strokeWidth="3" />
      <Label x={lx} y={ly} fill={INK} size={12}>
        Moon
      </Label>
      {help || after ? (
        <g>
          <line x1={f(ex)} y1={f(ey)} x2={f(sx)} y2={f(sy)} stroke={GOLD} strokeWidth="3" strokeDasharray="6 5" />
          <polyline points={arcPoints(mx, my, moon + 5, toEarth - 90, toEarth + 90)} fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}
      <rect x={INSET.x} y={INSET.y} width={INSET.w} height={INSET.h} rx="10" fill="#141b33" stroke={INK} strokeWidth="3" />
      <Label x={ix} y={INSET.y + 16} size={12}>
        From Earth
      </Label>
      {after ? (
        <g>
          <MoonFace cx={ix} cy={iy} r={28} e={e} side={litSide(round.at)} />
          <Label x={ix} y={INSET.y + INSET.h - 18} size={11}>
            {PHASE_LABEL[phase]}
          </Label>
        </g>
      ) : (
        <Label x={ix} y={iy} size={30}>
          ?
        </Label>
      )}
    </Frame>
  );
}

/** A small drawing for each prediction button. */
function Icon({ answer, side }: { readonly answer: Exclude<Answer, null>; readonly side: Side }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      {answer === 'day' ? (
        <g>
          {Array.from({ length: 8 }, (_, i) => {
            const [x1, y1] = polar(20, 20, 12, i * 45);
            const [x2, y2] = polar(20, 20, 18, i * 45);
            return <line key={i} x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke={RAY} strokeWidth="3" strokeLinecap="round" />;
          })}
          <circle cx="20" cy="20" r="9" fill={SUN} stroke={INK} strokeWidth="2" />
        </g>
      ) : answer === 'night' ? (
        <g>
          <rect x="2" y="2" width="36" height="36" rx="8" fill={NIGHT} />
          {[
            [11, 12],
            [27, 9],
            [20, 22],
            [9, 30],
            [30, 29],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#ffffff" />
          ))}
        </g>
      ) : (
        <MoonFace cx={20} cy={20} r={16} e={PHASE_E[answer]} side={side} />
      )}
    </svg>
  );
}

function Scene({ round, after, help }: { readonly round: Round; readonly after: boolean; readonly help: Help }) {
  switch (round.kind) {
    case 'face':
      return <FaceScene round={round} after={after} help={help} />;
    case 'spin':
      return <SpinScene round={round} after={after} help={help} />;
    case 'moon':
      return <MoonScene round={round} after={after} help={help} />;
  }
}

const CHOICE_LABEL: Record<Exclude<Answer, null>, string> = { day: 'Day', night: 'Night', ...PHASE_LABEL };

const HINT: Record<Round['kind'], string> = {
  face: 'The gold line splits the Earth: one half faces the sun.',
  spin: 'The gold arrow shows where the spin carries the pin.',
  moon: 'Gold marks the half of the Moon that faces Earth. Only that half can be seen.',
};

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved';
  const help: Help = stage === 'hint' ? 'hint' : stage === 'worked' ? 'worked' : null;
  const options: readonly Exclude<Answer, null>[] = round.kind === 'moon' ? PHASES : ['day', 'night'];
  const side: Side = round.kind === 'moon' ? litSide(round.at) : 'right';
  // 'worked' is the only place a child who pressed Help twice sees the answer
  // (the shell goes straight to Next), so it draws the result itself, labelled.
  return (
    <div className="board board--sunlight">
      <Scene round={round} after={stage === 'worked'} help={help} />
      <div className="choices" role="group" aria-label="Your guess">
        {options.map((o) => (
          <Choice key={o} selected={answer === o} onTap={() => setAnswer(o)} disabled={locked} ariaLabel={CHOICE_LABEL[o]}>
            <Icon answer={o} side={side} />
            {CHOICE_LABEL[o]}
          </Choice>
        ))}
      </div>
      {help ? <p className="board-caption">{help === 'worked' ? why(round) : HINT[round.kind]}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <Scene round={round} after help={null} />;
}

function why(round: Round): string {
  switch (round.kind) {
    case 'face': {
      const here = stateAt(round.ask, round.cal);
      const there = stateAt(OTHER[round.ask], round.cal);
      const side = here === 'day' ? 'on the half facing the sun' : 'on the half turned away from the sun';
      return `${NAME[round.ask]} is ${side}, so it has ${here}. ${NAME[OTHER[round.ask]]} has ${there}. The sun lights only the half of the Earth that faces it.`;
    }
    case 'spin': {
      const was = stateAt(round.ask, round.cal);
      const now = stateAt(round.ask, round.cal + round.hours);
      const other = stateAt(OTHER[round.ask], round.cal + round.hours);
      const opposite = now === 'day' ? 'night' : 'day';
      const carried =
        round.hours === 24
          ? `${NAME[round.ask]} goes right round and is back in ${now}`
          : was !== now
            ? `${NAME[round.ask]} is carried from ${was} into ${now}`
            : round.hours < 12
              ? `${NAME[round.ask]} moves along the ${now} half and still has ${now}`
              : `${NAME[round.ask]} passes right through the ${opposite} half and is back in ${now}`;
      return `In ${round.hours} hours the Earth makes ${TURN[round.hours]}. ${carried}; ${NAME[OTHER[round.ask]]} now has ${other}. The lit half always faces the sun.`;
    }
    case 'moon':
      return MOON_WHY[phaseOf(round.at)];
  }
}

const MOON_WHY: Record<Phase, string> = {
  new: 'The Moon is between us and the sun. Its lit half faces away from Earth, so we see its dark half. Half the Moon is always lit.',
  crescent: "The Moon is nearly between us and the sun. Its lit half faces mostly away from us, so we see only a thin lit edge. Earth's shadow is not on it.",
  half: "We see the Moon from the side, so half of the face turned to us is lit and half is dark. Earth's shadow is nowhere near it.",
  gibbous: 'The Moon is nearly on the far side of us from the sun. Most of the half facing us is lit, so we see more than half.',
  full: "The Moon is on the far side of us from the sun. The whole half facing us is lit, so we see a full circle. It passes just above or below Earth's shadow.",
};

export const whosInTheSunlight: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'whos-in-the-sunlight',
  title: "Who's in the Sunlight?",
  hook: 'Night here, day in India.',
  group: 'world',
  levels: ['Facing the sun', 'The Earth spins', "The Moon's lit half"],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => prediction === truth(round),
  why,
  cover: 'art/games/whos-in-the-sunlight.png',
  note: {
    what: 'A model of the Earth seen from above the North Pole, the sun on one side, pins for California and India. Level 1: day or night at a pin. Level 2: the Earth first turns 6, 12, 18 or 24 hours (the gold disc shows how much of a turn). Level 3: the Moon on its path; which shape do we see? Try draws the result beside the setup.',
    expect: "Many five-year-olds explain night as the sun going behind the hills or going to sleep, so he may first answer from his own window: day here, so day in India too. On level 2 the likely break is 12 hours: clocks go round in 12, so he may expect the pin back where it started; the gold disc shows only half a turn. On level 3 the Earth's-shadow explanation of the crescent is common, even among adults.",
    practising: 'Day is the half of the Earth facing the sun; the Earth spinning carries each place into and out of that half, once every 24 hours. Moon phases: the Moon always has a sunlit half, and the shape we see depends on how much of that half faces us.',
    ask: "When the pins show night in California and day in India: 'Who do we know in India? What are they doing while you sleep?'",
    next: "In a dark room, shine a torch on an orange with a sticker on it and turn the orange slowly: watch the sticker go from light to dark. Then video-call family in India at his bedtime and ask them to show the sky out of their window. For the Moon: a lamp across the room, a ball held at arm's length, turning yourself round in a circle.",
    honest: "This is a model at the equinox and in sun time, not to scale: real clocks differ by 12½ or 13½ hours, and summer days are longer than nights. Reading a view from above the pole is not yet linking it to the sky outside his window; the torch-and-ball game is that step. Nor does it show he knows why the Earth spins.",
    easier: 'Stay on level 1 and use the torch and orange beside the screen, pressing a finger on the pin as you turn it.',
    harder: 'On level 2, ask what time it is in India when he wakes at 7: Indian clocks are 12½ hours ahead while California is on summer time, 13½ in winter. On level 3, ask in which order the shapes come, night after night.',
    safety: 'Never look at the sun, even for a moment, and never through binoculars. Keep the torch-and-orange game to a torch, not a candle.',
  },
};

export default whosInTheSunlight;
