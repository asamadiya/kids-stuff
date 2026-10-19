import type { ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * What Does This Seed Need?
 *
 * Concept (advisor, science 12): a seed starts to grow (germinates) with
 * water, air and warmth, living on food stored inside it — it does not need
 * light to sprout. A sprout then needs light to turn green and grow sturdy;
 * in the dark it grows tall, thin and pale. The misconceptions it targets:
 * "a seed needs sunshine to sprout" and "the plant that grows taller is the
 * healthier one".
 *
 * Shape: predict → Try → before/after side by side → why. One control:
 * tap-to-choose. Every glass is drawn with the same three-cell strip under
 * it (water, light, warmth), so the one thing that differs is always on
 * screen. Fixed SVG states only, no motion. The bean is a moong bean on
 * cotton wool in a clear glass, as sprouted in many Indian kitchens.
 *
 * Levels (one changed thing at a time):
 *  1. Wet or dry — one glass, Day 0 → Day 2: wet or dry cotton, on the
 *     windowsill or in a dark cupboard. Does it sprout? (Dark is fine.)
 *  2. Light or dark — one new sprout, Day 2 → Day 7: windowsill, cupboard,
 *     or under a box on the windowsill. Short and green, or tall and pale?
 *  3. Two glasses, one change — side by side, identical except for one
 *     thing: water, light, or cold (fridge against cupboard, both dark).
 *     Which sprouts, which grows taller, which turns green?
 *
 * Outcomes are drawn as what usually happens, and labelled so; heights are
 * typical, not measured.
 */

type Place = 'window' | 'cupboard' | 'box' | 'fridge';
type Look = 'dry-bean' | 'wet-bean' | 'sprout' | 'green' | 'pale' | 'greening';
type Factor = 'water' | 'light' | 'warmth';

export interface State {
  readonly look: Look;
  /** Height of the shoot above the cotton, in centimetres. */
  readonly cm: number;
}

export interface Glass {
  readonly place: Place;
  readonly wet: boolean;
  readonly before: State;
  readonly after: State;
  /** Level 3: grew in the cupboard, moved to the windowsill on the first day shown. */
  readonly moved?: boolean;
}

export interface Round {
  readonly test: 'start' | 'grow' | 'pair';
  readonly ask: 'sprout' | 'look' | 'taller' | 'green';
  /** The day of the setup picture and of the outcome picture. */
  readonly days: readonly [number, number];
  /** One glass, or two (left, right) on level 3. */
  readonly glasses: readonly Glass[];
}

export type Answer = 'sprouts' | 'stays' | 'green' | 'pale' | 'stops' | 'left' | 'right' | 'both' | 'neither' | 'same' | null;
type Pick = Exclude<Answer, null>;

const LIGHT = (p: Place): boolean => p === 'window';
const WARM = (p: Place): boolean => p !== 'fridge';

/** Day 0 → 2: a dry bean set on cotton. It starts only with water and warmth. */
function started(place: Place, wet: boolean): Glass {
  const sprouts = wet && WARM(place);
  return {
    place,
    wet,
    before: { look: 'dry-bean', cm: 0 },
    after: sprouts ? { look: 'sprout', cm: 0 } : { look: wet ? 'wet-bean' : 'dry-bean', cm: 0 },
  };
}

/** Day 2 → 7: a new sprout, kept wet. Light decides how it grows. */
function grown(place: Place): Glass {
  return {
    place,
    wet: true,
    before: { look: 'sprout', cm: 0 },
    after: LIGHT(place) ? { look: 'green', cm: 6 } : { look: 'pale', cm: 11 },
  };
}

/** Day 5 → 8: a pale sprout grown in the dark, then moved to the window or left there. */
function darkGrown(place: Place): Glass {
  const lit = LIGHT(place);
  return {
    place,
    wet: true,
    moved: lit,
    before: { look: 'pale', cm: 9 },
    after: lit ? { look: 'greening', cm: 10 } : { look: 'pale', cm: 12 },
  };
}

export function generate(level: Level, index: number): Round {
  const k = index % 6;
  if (level === 1) {
    const order: ReadonlyArray<readonly [Place, boolean]> = [
      ['window', true],
      ['cupboard', false],
      ['cupboard', true],
      ['window', false],
      ['cupboard', true],
      ['window', true],
    ];
    const [place, wet] = order[k];
    return { test: 'start', ask: 'sprout', days: [0, 2], glasses: [started(place, wet)] };
  }
  if (level === 2) {
    const place = (['window', 'cupboard', 'box', 'cupboard', 'window', 'box'] as const)[k];
    return { test: 'grow', ask: 'look', days: [2, 7], glasses: [grown(place)] };
  }
  switch (k) {
    case 0:
      return { test: 'pair', ask: 'sprout', days: [0, 2], glasses: [started('window', true), started('window', false)] };
    case 1:
      return { test: 'pair', ask: 'taller', days: [2, 7], glasses: [grown('window'), grown('cupboard')] };
    case 2:
      return { test: 'pair', ask: 'sprout', days: [0, 2], glasses: [started('cupboard', true), started('window', true)] };
    case 3:
      return { test: 'pair', ask: 'sprout', days: [0, 2], glasses: [started('cupboard', true), started('fridge', true)] };
    case 4:
      return { test: 'pair', ask: 'green', days: [5, 8], glasses: [darkGrown('cupboard'), darkGrown('window')] };
    default:
      return { test: 'pair', ask: 'sprout', days: [0, 2], glasses: [started('window', false), started('cupboard', false)] };
  }
}

const PLACE_IN: Record<Place, string> = {
  window: 'on the windowsill',
  cupboard: 'in a dark cupboard',
  box: 'under a box on the windowsill',
  fridge: 'in the fridge',
};

function prompt(round: Round): string {
  const g = round.glasses[0];
  if (round.test === 'start') return `A bean on ${g.wet ? 'wet' : 'dry'} cotton, ${PLACE_IN[g.place]}. Will it sprout?`;
  if (round.test === 'grow') return `A sprout, ${PLACE_IN[g.place]}. How will it grow?`;
  if (round.ask === 'taller') return 'Two sprouts, one change. Which will grow taller?';
  if (round.ask === 'green') return 'Two pale sprouts, one moved. Which will turn green?';
  return 'Two beans, one change. Which will sprout?';
}

const sprouted = (s: State): boolean => s.look !== 'dry-bean' && s.look !== 'wet-bean';
const isGreen = (s: State): boolean => s.look === 'green' || s.look === 'greening';

/** What really happens, in the terms of the choices. */
function truthOf(round: Round): Pick {
  const [a, b] = round.glasses;
  if (round.test === 'start') return sprouted(a.after) ? 'sprouts' : 'stays';
  if (round.test === 'grow') return isGreen(a.after) ? 'green' : 'pale';
  if (round.ask === 'taller') return a.after.cm === b.after.cm ? 'same' : a.after.cm > b.after.cm ? 'left' : 'right';
  const p = round.ask === 'sprout' ? sprouted : isGreen;
  if (p(a.after)) return p(b.after) ? 'both' : 'left';
  return p(b.after) ? 'right' : 'neither';
}

function matches(round: Round, prediction: Answer): boolean {
  return prediction === truthOf(round);
}

/** The factors that differ between the two glasses of a pair: by design, exactly one. */
function differing(round: Round): Factor[] {
  const [a, b] = round.glasses;
  if (!b) return [];
  const out: Factor[] = [];
  if (a.wet !== b.wet) out.push('water');
  if (LIGHT(a.place) !== LIGHT(b.place)) out.push('light');
  if (WARM(a.place) !== WARM(b.place)) out.push('warmth');
  return out;
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#24170f';
const W = 400;
const H = 352;
/** y of the top of the cotton, where the shoot starts, and pixels per centimetre. */
const COT = 232;
const PX = 13;
const yAt = (cm: number) => COT - cm * PX;
const STRIP_Y = 272;
const TOP = 52;
const BOT = 266;

/** One panel: its edges, the glass centre and the ruler line. */
interface Geom {
  readonly x0: number;
  readonly x1: number;
  readonly gx: number;
  readonly rx: number;
}
const SOLO: Geom = { x0: 50, x1: 350, gx: 178, rx: 250 };
const PAIR: readonly [Geom, Geom] = [
  { x0: 12, x1: 194, gx: 82, rx: 142 },
  { x0: 206, x1: 388, gx: 276, rx: 336 },
];

const PLACE_LABEL: Record<Place, string> = {
  window: 'Windowsill',
  cupboard: 'Dark cupboard',
  box: 'Box on the windowsill',
  fridge: 'Fridge, door shut',
};

/** The place behind one glass: windowsill, dark cupboard, box on the sill, or fridge. */
function Scene({ place, at, chosen }: { readonly place: Place; readonly at: Geom; readonly chosen?: boolean }) {
  const { x0, x1, gx } = at;
  const top = TOP;
  const bot = BOT;
  const w = x1 - x0;
  const parts: ReactNode[] = [];
  if (place === 'window' || place === 'box') {
    parts.push(<rect key="sky" x={x0} y={top} width={w} height={bot - top} fill="#cfe8f5" />);
    const sx = x0 + 28;
    const sy = top + 28;
    parts.push(<circle key="sun" cx={sx} cy={sy} r="13" fill="#f2b705" stroke={INK} strokeWidth="2" />);
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      parts.push(
        <line
          key={`r${i}`}
          x1={sx + Math.cos(a) * 17}
          y1={sy + Math.sin(a) * 17}
          x2={sx + Math.cos(a) * 23}
          y2={sy + Math.sin(a) * 23}
          stroke="#d08a00"
          strokeWidth="2.5"
          strokeLinecap="round"
        />,
      );
    }
    parts.push(<rect key="frame" x={x0 + 4} y={top + 4} width={w - 8} height={bot - top - 20} fill="none" stroke="#b07a3a" strokeWidth="8" />);
    parts.push(<rect key="sill" x={x0} y={bot - 12} width={w} height="12" fill="#d9b98a" stroke={INK} strokeWidth="2" />);
    if (place === 'box') {
      const bx = gx - 50;
      const bw = at.rx + 18 - bx;
      parts.push(<rect key="box" x={bx} y={top + 12} width={bw} height={bot - top - 24} fill="#2e231b" stroke="#b98a52" strokeWidth="8" />);
      parts.push(<line key="box-top" x1={bx - 6} y1={top + 9} x2={bx + bw + 6} y2={top + 9} stroke="#8a6232" strokeWidth="5" strokeLinecap="round" />);
    }
  } else if (place === 'cupboard') {
    parts.push(<rect key="dark" x={x0} y={top} width={w} height={bot - top} fill="#3b2a20" />);
    parts.push(<rect key="door" x={x1 - 10} y={top} width="10" height={bot - top} fill="#6b4a30" />);
    parts.push(<rect key="shelf" x={x0} y={bot - 12} width={w} height="12" fill="#6b4a30" stroke={INK} strokeWidth="2" />);
  } else {
    parts.push(<rect key="cold" x={x0} y={top} width={w} height={bot - top} fill="#1d3442" />);
    for (let x = x0 + 14; x < x1 - 8; x += 26) {
      parts.push(<path key={`f${x}`} d={`M${x} ${top + 14} l6 6 m0 -6 l-6 6 m3 -8 v10`} stroke="#9fd3e6" strokeWidth="1.8" />);
    }
    parts.push(<rect key="shelf" x={x0} y={bot - 12} width={w} height="12" fill="#9fb8c4" stroke={INK} strokeWidth="2" />);
  }
  return (
    <g>
      {parts}
      <rect x={x0} y={top} width={w} height={bot - top} fill="none" stroke={chosen ? '#f2a900' : INK} strokeWidth={chosen ? 6 : 2.5} />
    </g>
  );
}


/** A clear plastic cup of cotton wool, wet or dry, sitting on the ledge at y 254. */
function Cup({ gx, wet }: { readonly gx: number; readonly wet: boolean }) {
  return (
    <g>
      <path
        d={`M${gx - 27} 250 V${COT + 2} q2 -7 9 -5 q5 -6 12 -2 q6 -6 13 -1 q7 -5 12 1 q6 -1 8 5 V250 z`}
        fill={wet ? '#d3e7f3' : '#fbfaf3'}
        stroke="#9aa6ad"
        strokeWidth="1.5"
      />
      {wet ? <rect x={gx - 26} y="243" width="52" height="10" fill="#5fa3d6" opacity="0.75" /> : null}
      <path d={`M${gx - 31} 184 L${gx - 27} 254 H${gx + 27} L${gx + 31} 184`} fill="rgba(214,236,247,0.22)" stroke="#5f8396" strokeWidth="3" strokeLinejoin="round" />
      <line x1={gx - 24} y1="192" x2={gx - 22} y2="246" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

/** A moong bean, drawn a little larger than life so it can be seen: dry, or swollen with water. */
function Bean({ x, y, wet, tilt = 0 }: { readonly x: number; readonly y: number; readonly wet: boolean; readonly tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={wet ? 9 : 7} ry={wet ? 6 : 4.5} fill={wet ? '#86a63e' : '#5c7a26'} stroke={INK} strokeWidth="1.5" />
      <line x1={x - 2.5} y1={y - (wet ? 4 : 3)} x2={x + 2.5} y2={y - (wet ? 4 : 3)} stroke="#f4f0dc" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

/** A stroke with a dark edge, so a cream root or a pale stem reads on white cotton and on a dark cupboard alike. */
function Edged({ d, color, width }: { readonly d: string; readonly color: string; readonly width: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={width + 2.4} />
      <path d={d} stroke={color} strokeWidth={width} />
    </g>
  );
}

/** Cream roots spreading down across the cotton. */
function Roots({ gx, n }: { readonly gx: number; readonly n: number }) {
  const paths = [
    `M${gx + 6} ${COT - 3} q9 3 7 16`,
    `M${gx} ${COT + 1} q-10 4 -13 13`,
    `M${gx} ${COT + 1} q-2 8 1 15`,
    `M${gx + 2} ${COT + 4} q8 2 11 9`,
  ];
  return (
    <g>
      {paths.slice(0, n).map((d) => (
        <Edged key={d} d={d} color="#f4ecd0" width={2.2} />
      ))}
    </g>
  );
}

/** One leaf from (x, y), pointing left (dir -1) or right (dir 1). */
function Leaf({ x, y, dir, size, fill }: { readonly x: number; readonly y: number; readonly dir: 1 | -1; readonly size: number; readonly fill: string }) {
  const s = size * dir;
  return (
    <path
      d={`M${x} ${y} q${s * 0.45} ${-size * 0.6} ${s} ${-size * 0.25} q${-s * 0.4} ${size * 0.55} ${-s} ${size * 0.25} z`}
      fill={fill}
      stroke={INK}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  );
}

/**
 * The bean or plant at one moment, on the cotton in the cup centred on gx.
 * Moong germinates above the soil: the root comes out first (day 2), then the
 * stem lifts the two seed leaves. In light they open and true leaves follow;
 * in the dark the stem races up, hooked over, with the seed leaves shut and yellow.
 */
function Plant({ gx, state }: { readonly gx: number; readonly state: State }) {
  const top = yAt(state.cm);
  switch (state.look) {
    case 'dry-bean':
      return <Bean x={gx} y={COT - 4} wet={false} />;
    case 'wet-bean':
      return <Bean x={gx} y={COT - 5} wet />;
    case 'sprout':
      return (
        <g>
          <Bean x={gx} y={COT - 5} wet tilt={-15} />
          <Roots gx={gx} n={1} />
        </g>
      );
    case 'green':
      return (
        <g>
          <Roots gx={gx} n={4} />
          <Edged d={`M${gx} ${COT} Q${gx - 3} ${(COT + top) / 2} ${gx} ${top}`} color="#3f8f2e" width={4} />
          <ellipse cx={gx - 8} cy={yAt(state.cm * 0.55)} rx="7" ry="4" fill="#9fb83e" stroke={INK} strokeWidth="1.3" />
          <ellipse cx={gx + 8} cy={yAt(state.cm * 0.55)} rx="7" ry="4" fill="#9fb83e" stroke={INK} strokeWidth="1.3" />
          <Leaf x={gx} y={top} dir={-1} size={26} fill="#3f9a32" />
          <Leaf x={gx} y={top} dir={1} size={26} fill="#3f9a32" />
        </g>
      );
    case 'pale':
      return (
        <g>
          <Roots gx={gx} n={3} />
          <Edged
            d={`M${gx} ${COT} C${gx - 4} ${(COT + top) / 2} ${gx + 3} ${top + 20} ${gx + 2} ${top + 6} A6 6 0 0 0 ${gx - 10} ${top + 6} v4`}
            color="#efe6c4"
            width={3}
          />
          <ellipse cx={gx - 10} cy={top + 16} rx="4.5" ry="6.5" fill="#f1dc7a" stroke={INK} strokeWidth="1.3" />
        </g>
      );
    case 'greening':
      return (
        <g>
          <Roots gx={gx} n={3} />
          <Edged d={`M${gx} ${COT} C${gx - 4} ${(COT + top) / 2} ${gx + 3} ${top + 20} ${gx} ${top}`} color="#c6d68a" width={3} />
          <Leaf x={gx} y={top} dir={-1} size={17} fill="#86c04a" />
          <Leaf x={gx} y={top} dir={1} size={17} fill="#86c04a" />
        </g>
      );
  }
}

/** A centimetre scale beside the cup, 0 at the top of the cotton; `mark` points at the shoot's height. */
function Ruler({ x, mark }: { readonly x: number; readonly mark?: number }) {
  return (
    <g fontSize="11" fontWeight="700" fill={INK} textAnchor="end">
      <rect x={x - 22} y={yAt(12) - 20} width="30" height={12 * PX + 28} rx="3" fill="#fff8e6" stroke={INK} strokeWidth="1.5" />
      <text x={x - 7} y={yAt(12) - 8} textAnchor="middle">cm</text>
      {Array.from({ length: 13 }, (_, c) => (
        <g key={c}>
          <line x1={x - 2} y1={yAt(c)} x2={x + (c % 2 === 0 ? 7 : 4)} y2={yAt(c)} stroke={INK} strokeWidth={c % 2 === 0 ? 2 : 1.2} />
          {c % 2 === 0 ? <text x={x - 5} y={yAt(c) + 4}>{c}</text> : null}
        </g>
      ))}
      {mark ? (
        <g>
          <line x1={x - 30} y1={yAt(mark)} x2={x + 7} y2={yAt(mark)} stroke="#c8341f" strokeWidth="2" strokeDasharray="3 2" />
          <path d={`M${x + 8} ${yAt(mark)} l10 -6 v12 z`} fill="#f2a900" stroke={INK} strokeWidth="1.5" />
        </g>
      ) : null}
    </g>
  );
}

/* ------------------------------------------------- water, light, warmth -- */

const FACTORS: readonly Factor[] = ['water', 'light', 'warmth'];

const has = (g: Glass, f: Factor): boolean => (f === 'water' ? g.wet : f === 'light' ? LIGHT(g.place) : WARM(g.place));
const WORD: Record<Factor, readonly [string, string]> = {
  water: ['wet', 'dry'],
  light: ['light', 'dark'],
  warmth: ['warm', 'cold'],
};

function Icon({ f, on, cx, cy }: { readonly f: Factor; readonly on: boolean; readonly cx: number; readonly cy: number }) {
  if (f === 'water') {
    const d = `M${cx} ${cy - 12} C${cx + 9} ${cy - 1} ${cx + 8} ${cy + 9} ${cx} ${cy + 9} C${cx - 8} ${cy + 9} ${cx - 9} ${cy - 1} ${cx} ${cy - 12} z`;
    return on ? (
      <path d={d} fill="#3e8fd0" stroke={INK} strokeWidth="1.8" />
    ) : (
      <g>
        <path d={d} fill="none" stroke="#8a7a68" strokeWidth="1.8" strokeDasharray="3 2" />
        <line x1={cx - 10} y1={cy + 8} x2={cx + 10} y2={cy - 10} stroke="#8a7a68" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }
  if (f === 'light') {
    return on ? (
      <g stroke="#d08a00" strokeWidth="2.2" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <line key={i} x1={cx + Math.cos(a) * 9} y1={cy + Math.sin(a) * 9} x2={cx + Math.cos(a) * 13} y2={cy + Math.sin(a) * 13} />;
        })}
        <circle cx={cx} cy={cy} r="7" fill="#f2b705" stroke={INK} strokeWidth="1.8" />
      </g>
    ) : (
      <circle cx={cx} cy={cy} r="10" fill="#3b2a20" stroke={INK} strokeWidth="1.8" />
    );
  }
  const col = on ? '#c8341f' : '#3e7fb2';
  return (
    <g stroke={INK} strokeWidth="1.6">
      <rect x={cx - 3.5} y={cy - 13} width="7" height="18" rx="3.5" fill="#ffffff" />
      <rect x={cx - 1.5} y={on ? cy - 9 : cy - 1} width="3" height={on ? 14 : 6} fill={col} stroke="none" />
      <circle cx={cx} cy={cy + 7} r="5.5" fill={col} />
    </g>
  );
}

/** The three conditions under one cup. `hot` cells are ringed in gold. */
function Strip({ g, at, hot }: { readonly g: Glass; readonly at: Geom; readonly hot: readonly Factor[] }) {
  const cw = (at.x1 - at.x0) / 3;
  return (
    <g>
      {FACTORS.map((f, i) => {
        const x = at.x0 + i * cw;
        const on = has(g, f);
        const lit = hot.includes(f);
        return (
          <g key={f}>
            <rect
              x={x + 2}
              y={STRIP_Y}
              width={cw - 4}
              height="50"
              rx="6"
              fill={lit ? '#fff1c9' : '#fbf6ea'}
              stroke={lit ? '#f2a900' : '#b9ab90'}
              strokeWidth={lit ? 4 : 1.5}
            />
            <Icon f={f} on={on} cx={x + cw / 2} cy={STRIP_Y + 18} />
            <text x={x + cw / 2} y={STRIP_Y + 44} fontSize="13" fontWeight="700" textAnchor="middle" fill={INK}>
              {WORD[f][on ? 0 : 1]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/* ------------------------------------------------------------ the frame -- */

const LOOK_WORD: Record<Look, string> = {
  'dry-bean': 'a dry bean',
  'wet-bean': 'a swollen bean, no sprout',
  sprout: 'a new sprout',
  green: 'green leaves',
  pale: 'tall and pale',
  greening: 'turning green',
};

const PLACE_SHORT: Record<Place, string> = { window: 'Windowsill', cupboard: 'Cupboard', box: 'Under a box', fridge: 'Fridge' };

function labelFor(g: Glass, pair: boolean): string {
  if (g.moved) return 'Moved to window';
  return pair ? PLACE_SHORT[g.place] : PLACE_LABEL[g.place];
}

function sayGlass(g: Glass, after: boolean): string {
  const s = after ? g.after : g.before;
  const tall = s.cm > 0 ? `, ${s.cm} cm tall` : '';
  return `${g.wet ? 'wet' : 'dry'} cotton, ${PLACE_IN[g.place]}: ${LOOK_WORD[s.look]}${tall}`;
}

function ariaFor(round: Round, after: boolean): string {
  const day = round.days[after ? 1 : 0];
  const lead = after ? `What usually happens, day ${day}` : `Day ${day}`;
  if (round.glasses.length === 1) return `${lead}: a cup of ${sayGlass(round.glasses[0], after)}`;
  const [a, b] = round.glasses;
  return `${lead}. Left cup, ${sayGlass(a, after)}. Right cup, ${sayGlass(b, after)}.`;
}

/** The footer line: the setup in words before, the result in words after. */
function footFor(round: Round, after: boolean): string {
  const day = round.days[after ? 1 : 0];
  if (!after) {
    if (round.test === 'start') return `Day ${day}: a hard bean, just set on the cotton.`;
    if (round.test === 'grow') return `Day ${day}: a sprout. A root, no stem yet.`;
    if (round.ask === 'sprout') return `Day ${day}: two hard beans, just set on the cotton.`;
    return round.ask === 'taller' ? `Day ${day}: two sprouts, the same size.` : `Day ${day}: both grew pale in the dark.`;
  }
  const [a, b] = round.glasses;
  if (round.test === 'start') return `Usually, by day ${day}: ${sprouted(a.after) ? 'sprouted' : 'no sprout'}.`;
  if (round.test === 'grow') return `Usually, by day ${day}: ${LOOK_WORD[a.after.look]}, ${a.after.cm} cm.`;
  if (round.ask === 'taller') return `Usually, by day ${day}: left ${a.after.cm} cm, right ${b.after.cm} cm.`;
  const t = truthOf(round);
  const verb = round.ask === 'sprout' ? 'sprouted' : 'turned green';
  const who = t === 'both' ? 'both' : t === 'neither' ? 'neither' : `the ${t} one`;
  return `Usually, by day ${day}: ${who} ${verb}.`;
}

interface FrameProps {
  readonly round: Round;
  readonly after: boolean;
  /** Before only: the child's prediction, ringed on the picture. */
  readonly answer?: Answer;
  /** Strip cells to ring in gold: the evidence a hint points at. */
  readonly hot?: readonly Factor[];
}

/** The one picture used for both Before and What happened: same viewBox, same scale. */
function Frame({ round, after, answer = null, hot = [] }: FrameProps) {
  const pair = round.glasses.length === 2;
  const geoms: readonly Geom[] = pair ? PAIR : [SOLO];
  const chosen = (i: number) =>
    !after && (answer === 'both' || answer === 'same' || answer === (i === 0 ? 'left' : 'right'));
  return (
    <svg className="board-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaFor(round, after)}>
      <text x="12" y="24" fontSize="18" fontWeight="700" fill={after ? '#075c46' : INK}>
        Day {round.days[after ? 1 : 0]}
      </text>
      {pair ? null : (
        <text x={W - 12} y="24" fontSize="15" fontWeight="700" textAnchor="end" fill={INK}>
          {labelFor(round.glasses[0], false)}
        </text>
      )}
      {round.glasses.map((g, i) => {
        const at = geoms[i];
        const s = after ? g.after : g.before;
        return (
          <g key={i}>
            {pair ? (
              <text x={(at.x0 + at.x1) / 2} y="44" fontSize="13" fontWeight="700" textAnchor="middle" fill={INK}>
                {i === 0 ? 'Left' : 'Right'}: {labelFor(g, true)}
              </text>
            ) : null}
            <Scene place={g.place} at={at} chosen={chosen(i)} />
            <Ruler x={at.rx} mark={s.cm > 0 ? s.cm : undefined} />
            <Cup gx={at.gx} wet={g.wet} />
            <Plant gx={at.gx} state={s} />
            <Strip g={g} at={at} hot={hot} />
          </g>
        );
      })}
      <text x={W / 2} y={H - 10} fontSize="14" fontWeight={after ? 700 : 400} textAnchor="middle" fill={after ? '#075c46' : '#5a4636'}>
        {footFor(round, after)}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ why -- */

const FACTOR_WORD: Record<Factor, string> = { water: 'the water', light: 'the light', warmth: 'the warmth' };

function why(round: Round): string {
  const [a, b] = round.glasses;
  if (round.test === 'start') {
    if (!a.wet) {
      return a.place === 'window'
        ? 'The bean had light and warmth but no water, so it stayed hard and asleep. Water is what wakes a moong bean; it needs no light to start.'
        : 'No water, so the bean stayed hard and asleep, just as dry moong keeps for months in a jar in the kitchen.';
    }
    return a.place === 'window'
      ? 'Water soaked in and woke the bean. With water, air and warmth it sprouted, living on food stored inside the bean itself.'
      : 'It sprouted in the dark. A moong bean starts with water, air and warmth, and lives first on food stored inside it, so it needs no light yet.';
  }
  if (round.test === 'grow') {
    if (a.place === 'window') {
      return 'In light the leaves make chlorophyll, the green that catches light to make food. The stem stays short and strong: 6 cm by day 7.';
    }
    const where = a.place === 'box' ? 'Under the box it is dark, even on the windowsill, so it' : 'In the dark it';
    return `${where} grows fast and thin, as a sprout does under the soil: 11 cm by day 7. With no light it cannot make green: pale stem, seed leaves shut and yellow.`;
  }
  const f = differing(round)[0];
  if (round.ask === 'taller') {
    return `Only the light differed. The dark sprout grew taller, ${b.after.cm} cm against ${a.after.cm}, but pale and weak. Taller is not healthier: only the short green one can make its own food.`;
  }
  if (round.ask === 'green') {
    return 'Only the light differed. Moved into light, the pale sprout began making green within a day or two. The one left in the dark stayed pale.';
  }
  const t = truthOf(round);
  if (t === 'both') return 'Only the light differed, and both sprouted. A moong bean starts on food stored inside it, so it needs no light to sprout. Light matters later, for growing green.';
  if (t === 'neither') return 'Only the light differed, and neither sprouted: both were dry. Without water a bean stays hard and asleep, in light or in dark.';
  if (f === 'warmth') return 'Both cups were wet and dark; only the warmth differed. The bean in the cold fridge did not sprout. A moong bean needs warmth as well as water to start.';
  return `Only ${FACTOR_WORD[f]} differed. The wet bean sprouted; the dry one, with the same light and warmth, did not. Water is what wakes a moong bean.`;
}

/* ------------------------------------------------------------ the board -- */

/** Small pictures for the choices, so the options read without words. */
function ChoiceIcon({ look }: { readonly look: Look | 'stop' }) {
  const state: State =
    look === 'stop' ? { look: 'sprout', cm: 0 } : look === 'green' ? { look: 'green', cm: 3 } : look === 'pale' ? { look: 'pale', cm: 6 } : { look, cm: 0 };
  const top = yAt(state.cm) - 18;
  return (
    <svg width="44" height="44" viewBox={`${178 - 34} ${top} 68 ${COT + 20 - top}`} aria-hidden="true">
      <rect x={178 - 30} y={COT - 2} width="60" height="14" rx="4" fill="#fbfaf3" stroke="#9aa6ad" strokeWidth="1.5" />
      <Plant gx={178} state={state} />
    </svg>
  );
}

type Option = readonly [Pick, string, ReactNode?];

/**
 * Two small cups for the Left / Right / Both / Neither / Same choices, so a
 * child who cannot read "Neither" still sees what each button means: the cups
 * that do the thing asked about are drawn doing it.
 */
function PairIcon({ ask, pick }: { readonly ask: Round['ask']; readonly pick: Pick }) {
  const xs = [178, 228] as const;
  const base = (x: number) => <rect x={x - 22} y={COT - 2} width="44" height="14" rx="4" fill="#fbfaf3" stroke="#9aa6ad" strokeWidth="1.5" />;
  if (ask === 'taller') {
    const cm = pick === 'left' ? [6, 3] : pick === 'right' ? [3, 6] : [4.5, 4.5];
    const top = yAt(6) - 8;
    return (
      <svg width="72" height="44" viewBox={`${xs[0] - 28} ${top} 106 ${COT + 20 - top}`} aria-hidden="true">
        {xs.map((x, i) => (
          <g key={x}>
            {base(x)}
            <Edged d={`M${x} ${COT} V${yAt(cm[i])}`} color="#f4ecd0" width={8} />
          </g>
        ))}
      </svg>
    );
  }
  const yes = [pick === 'left' || pick === 'both', pick === 'right' || pick === 'both'];
  const state = (on: boolean): State =>
    ask === 'sprout' ? (on ? { look: 'sprout', cm: 0 } : { look: 'dry-bean', cm: 0 }) : on ? { look: 'greening', cm: 3 } : { look: 'pale', cm: 4 };
  const top = yAt(ask === 'sprout' ? 0 : 4) - 18;
  return (
    <svg width="72" height="44" viewBox={`${xs[0] - 28} ${top} 106 ${COT + 20 - top}`} aria-hidden="true">
      {xs.map((x, i) => (
        <g key={x}>
          {base(x)}
          <Plant gx={x} state={state(yes[i])} />
        </g>
      ))}
    </svg>
  );
}

function optionsFor(round: Round): readonly Option[] {
  if (round.test === 'start') {
    return [
      ['sprouts', 'It sprouts', <ChoiceIcon key="i" look="sprout" />],
      ['stays', 'No sprout', <ChoiceIcon key="i" look="dry-bean" />],
    ];
  }
  if (round.test === 'grow') {
    return [
      ['green', 'Green leaves', <ChoiceIcon key="i" look="green" />],
      ['pale', 'Tall and pale', <ChoiceIcon key="i" look="pale" />],
      ['stops', 'Stops growing', <ChoiceIcon key="i" look="stop" />],
    ];
  }
  const picks: readonly (readonly [Pick, string])[] =
    round.ask === 'taller'
      ? [['left', 'Left'], ['right', 'Right'], ['same', 'Same height']]
      : [['left', 'Left'], ['right', 'Right'], ['both', 'Both'], ['neither', 'Neither']];
  return picks.map(([value, label]) => [value, label, <PairIcon key="i" ask={round.ask} pick={value} />] as const);
}

/** On 'hint': the strip cells to ring and one sentence of fact about them. */
function hintFor(round: Round): { readonly hot: readonly Factor[]; readonly caption: string } {
  const g = round.glasses[0];
  if (round.test === 'start') {
    if (!g.wet) return { hot: ['water'], caption: 'The cotton is dry: this bean gets no water.' };
    return LIGHT(g.place)
      ? { hot: ['water', 'warmth'], caption: 'The cotton is wet, and the windowsill is warm.' }
      : { hot: ['water', 'warmth'], caption: 'The cotton is wet and the cupboard is warm. Only light is missing.' };
  }
  if (round.test === 'grow') {
    return { hot: ['light'], caption: LIGHT(g.place) ? 'Light reaches this sprout.' : 'No light reaches this sprout. It still has water and warmth.' };
  }
  const d = differing(round);
  return { hot: d, caption: `The two cups differ in one thing only: ${d.map((f) => FACTOR_WORD[f]).join(', ')}.` };
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const hint = stage === 'hint' || stage === 'worked' ? hintFor(round) : null;
  const ask =
    round.test === 'start' ? 'Will it sprout?' : round.test === 'grow' ? 'How will it grow?' : round.ask === 'taller' ? 'Which grows taller?' : round.ask === 'green' ? 'Which turns green?' : 'Which sprouts?';
  return (
    <div className="board board--seed">
      {stage === 'worked' ? (
        <div className="evidence">
          <figure className="evidence__pane">
            <figcaption>Before</figcaption>
            <Frame round={round} after={false} answer={answer} hot={hint?.hot} />
          </figure>
          <figure className="evidence__pane evidence__pane--after">
            <figcaption>What usually happens</figcaption>
            <Frame round={round} after />
          </figure>
        </div>
      ) : (
        <Frame round={round} after={false} answer={answer} hot={hint?.hot} />
      )}
      <div className="choices" role="group" aria-label={ask}>
        {optionsFor(round).map(([value, label, icon]) => (
          <Choice key={value} selected={answer === value} onTap={() => setAnswer(value)} disabled={locked}>
            {icon}
            {label}
          </Choice>
        ))}
      </div>
      {stage === 'hint' && hint ? <p className="board-caption">{hint.caption}</p> : null}
      {stage === 'worked' ? <p className="board-caption">{why(round)}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <Frame round={round} after />;
}

/* ----------------------------------------------------------------- game -- */

export const whatDoesThisSeedNeed: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'what-does-this-seed-need',
  title: 'What Does This Seed Need?',
  hook: 'Wet or dry? Light or dark?',
  group: 'world',
  levels: ['Wet or dry', 'Light or dark', 'Two cups, one change'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches,
  why,
  cover: 'art/games/what-does-this-seed-need.png',
  note: {
    what: 'A moong bean sits on cotton wool in a clear cup, on a windowsill, in a dark cupboard, under a box or in the fridge. A strip under each cup shows wet or dry, light or dark, warm or cold. He predicts, then presses Try to see the cup days later, beside the first picture.',
    expect: 'Many five-year-olds say a seed needs sunshine to sprout, so the wet bean in the dark cupboard sprouting is the surprise of level 1. On level 2 many pick the tall pale sprout as the "best" one because it is biggest; on level 3 the taller-is-healthier idea is put to the test directly.',
    practising: 'Two separate ideas, one per level: germination needs water, air and warmth (the bean lives on its own stored food, so light is not needed yet), and a seedling needs light to turn green and grow sturdy. Also: a fair test changes only one thing, which the strip makes visible.',
    ask: "When the cupboard sprout comes out tall and pale: 'It is the tallest. Is it the healthiest? What is it missing?'",
    next: 'Use dry, unsoaked moong in three katoris: wet cotton on the windowsill, wet cotton in a dark cupboard, dry cotton on the windowsill. Keep the wet ones damp. Look on day 2 for roots; on day 7 measure the two wet ones with a ruler and compare their colour. Do not soak them first: a bean soaked overnight already has its water, so the dry cup would no longer test water.',
    honest: 'These are typical results drawn from a simple model, not measurements, and a screen cannot show the days of waiting. Air is named in the explanations but never tested. Getting them right shows he can read the pattern; it does not show he understands photosynthesis or that he would keep everything else the same in a real test. Moong needs no light to sprout; a few seeds, such as lettuce, do.',
    easier: 'Stay on level 1 and start the real wet and dry beans the same day, checking them each morning before school.',
    harder: "On level 3, before pressing Try, ask him to point at the one cell on the strip that differs and say why the other two must stay the same.",
    safety: 'Whole dry beans are a choking hazard for the two-year-old: keep the dish out of her reach. Use a steel katori or plastic cup, not glass, and do not eat sprouts grown on cotton.',
  },
};

export default whatDoesThisSeedNeed;
