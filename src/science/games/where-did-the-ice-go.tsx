import type { ReactElement } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Where Did the Ice Go? — states of water, then insulation.
 *
 * Concept (advisor, physics 10 and the water-state guardrail): water is ice
 * below 0 °C and liquid above it; a puddle does not vanish, it goes into the
 * air as water vapour, which is invisible — the white "steam" is tiny drops
 * of liquid water. Separately (level 3, never mixed into the same round): a
 * towel makes no heat, it slows heat moving, so wrapped ice melts SLOWER and a
 * wrapped roti stays warm.
 *
 * Shape: predict → Try → before/after side by side → why. Every round is one
 * place (counter, freezer, fridge, courtyard, sill, stove) drawn with a room
 * thermometer whose 0° line is marked, and a time tag ("Start" / "1 hour
 * later"), so the after picture carries its own evidence. Static SVG only.
 *
 * Levels:
 *  1. Warm or cold: one bowl or cup on the counter, in the freezer or in the
 *     fridge. The fridge (4 °C) breaks "cold freezes things".
 *  2. Water into air: a puddle, an open plate and a wet dupatta dry; a
 *     closed jar does not; an idli-steamer lid and an icy steel tumbler
 *     collect drops. The steamer's white cloud is named as tiny drops.
 *  3. Wrap it up: two equal bowls of ice, one wrapped. Then a control in the
 *     freezer (neither melts — a towel makes no heat), a hot roti in cloth
 *     (the same slowing, run outwards), thin against thick, and Dadi's shawl.
 */

type Place = 'counter' | 'freezer' | 'fridge' | 'courtyard' | 'sill' | 'stove';
type State = 'ice' | 'water' | 'dry';
type Side = 'left' | 'right' | 'same';
type Vessel = 'bowl' | 'cup' | 'jar' | 'plate' | 'puddle' | 'steamer' | 'tumbler' | 'line';
type Wrap = 'none' | 'towel' | 'thick' | 'shawl' | 'hanky' | 'cloth';
/** x, y, width, height of the gold frame drawn round the evidence on Help. */
type Ring = readonly [number, number, number, number];

type StateScene =
  | 'counter-ice'
  | 'freezer-water'
  | 'counter-water'
  | 'freezer-ice'
  | 'fridge-ice'
  | 'fridge-water'
  | 'puddle'
  | 'closed-jar'
  | 'idli-lid'
  | 'open-plate'
  | 'cold-tumbler'
  | 'washing';

type WrapScene = 'towel' | 'shawl' | 'freezer-towel' | 'roti' | 'thin-thick';

export type Round =
  | { readonly kind: 'state'; readonly scene: StateScene; readonly result: State }
  | { readonly kind: 'wrap'; readonly scene: WrapScene; readonly result: Side };

export type Answer = State | Side | null;

interface Common {
  readonly place: Place;
  /** Room temperature on the wall thermometer, or null where none is drawn. */
  readonly temp: number | null;
  /** The time tag on the after picture. */
  readonly after: string;
  readonly prompt: string;
  /** Screen-reader line for the setup and for the result. */
  readonly name: string;
  readonly end: string;
  /** Help, first press: what to look at. Second press: the rule that decides it. */
  readonly look: string;
  readonly rule: string;
  readonly why: string;
  readonly ring: Ring;
}

interface StateSpec extends Common {
  readonly vessel: Vessel;
  readonly start: State;
  readonly result: State;
}

const THERMO_RING: Ring = [334, 4, 76, 272];
const MELT_RULE = 'Warmer than the 0 line, ice melts into water. Colder than the 0 line, water freezes into ice.';
const AIR_RULE = 'Water can go into the air as water vapour, which you cannot see. Cooled, vapour turns back into drops.';
const WRAP_RULE = 'A wrapping makes no heat. It slows heat moving through it: into cold ice, or out of hot rotis.';

const STATE: Record<StateScene, StateSpec> = {
  'counter-ice': {
    place: 'counter', temp: 25, vessel: 'bowl', start: 'ice', result: 'water', after: '2 hours later',
    prompt: 'Ice in a bowl on the kitchen counter. After two hours?',
    name: 'Four ice cubes in a glass bowl on the kitchen counter. The thermometer reads 25 degrees.',
    end: 'Two hours later the bowl holds only water.',
    look: 'The thermometer says 25 degrees. Its red line is above the 0 line.',
    rule: MELT_RULE,
    why: 'The kitchen is 25 degrees, warmer than the 0 degree line. Warmth flows from the room into the ice, and it melts into water. Nothing went away: all the water is still in the bowl.',
    ring: THERMO_RING,
  },
  'freezer-water': {
    place: 'freezer', temp: -18, vessel: 'cup', start: 'water', result: 'ice', after: 'Next morning',
    prompt: 'Water in a clear cup in the freezer overnight. Next morning?',
    name: 'A clear plastic cup of water on the freezer shelf. The thermometer reads 18 below zero.',
    end: 'Next morning the cup is full of ice, bulging up at the top.',
    look: 'The thermometer says 18 below zero. Its red line stops under the 0 line.',
    rule: MELT_RULE,
    why: 'The freezer is 18 degrees below zero, far colder than the 0 line. The water loses its warmth to the cold air and freezes solid. See the ice bulge up: water grows a little when it freezes.',
    ring: THERMO_RING,
  },
  'counter-water': {
    place: 'counter', temp: 25, vessel: 'cup', start: 'water', result: 'water', after: '1 hour later',
    prompt: 'Water in a clear cup on the kitchen counter. After one hour?',
    name: 'A clear plastic cup of water on the kitchen counter. The thermometer reads 25 degrees.',
    end: 'One hour later it is still a cup of water.',
    look: 'The thermometer says 25 degrees, far above the 0 line.',
    rule: MELT_RULE,
    why: 'The room is 25 degrees, far above the 0 line, so the water cannot freeze. A tiny bit slips into the air, too little to see in one hour. It stays water.',
    ring: THERMO_RING,
  },
  'freezer-ice': {
    place: 'freezer', temp: -18, vessel: 'bowl', start: 'ice', result: 'ice', after: '2 hours later',
    prompt: 'Ice in a bowl in the freezer. After two hours?',
    name: 'Four ice cubes in a glass bowl on the freezer shelf. The thermometer reads 18 below zero.',
    end: 'Two hours later the four cubes are still ice.',
    look: 'The thermometer says 18 below zero, under the 0 line.',
    rule: MELT_RULE,
    why: 'The freezer is 18 degrees below zero, under the 0 line. Nothing around the ice is warm enough to melt it, so it stays ice, as hard as when it went in.',
    ring: THERMO_RING,
  },
  'fridge-ice': {
    place: 'fridge', temp: 4, vessel: 'bowl', start: 'ice', result: 'water', after: 'A day later',
    prompt: 'Ice in the fridge, not the freezer. A day later?',
    name: 'Four ice cubes in a glass bowl on a fridge shelf. The thermometer reads 4 degrees.',
    end: 'A day later the bowl holds only cold water.',
    look: 'The thermometer says 4 degrees. That is just above the 0 line.',
    rule: MELT_RULE,
    why: 'A fridge feels cold, but it is 4 degrees, just above the 0 line. That is warm enough to melt ice, only slowly. Only the freezer, below zero, keeps ice frozen.',
    ring: THERMO_RING,
  },
  'fridge-water': {
    place: 'fridge', temp: 4, vessel: 'cup', start: 'water', result: 'water', after: 'Next morning',
    prompt: 'Water in the fridge, not the freezer. Next morning?',
    name: 'A clear plastic cup of water on a fridge shelf. The thermometer reads 4 degrees.',
    end: 'Next morning it is cold water, not ice.',
    look: 'The thermometer says 4 degrees. That is just above the 0 line.',
    rule: MELT_RULE,
    why: 'The fridge is 4 degrees: cold water, but still above the 0 line. Water freezes only below zero, so it stays water. That is why ice trays go in the freezer.',
    ring: THERMO_RING,
  },
  'open-plate': {
    place: 'sill', temp: 30, vessel: 'plate', start: 'water', result: 'dry', after: 'Next day',
    prompt: 'Spilt water on a plate by a sunny window. Next day?',
    name: 'A little spilt water on a steel plate on a sunny window sill. The thermometer reads 30 degrees.',
    end: 'Next day the plate is dry. A dashed line shows where the water was.',
    look: 'Nothing covers the plate. The water lies open to the warm air.',
    rule: AIR_RULE,
    why: 'Nobody wiped it up. With nothing covering it, the water went into the warm air as water vapour, a little at a time, until none was left. Vapour is invisible, so you never saw it go.',
    ring: [72, 188, 186, 46],
  },
  'closed-jar': {
    place: 'sill', temp: 30, vessel: 'jar', start: 'water', result: 'water', after: 'A week later',
    prompt: 'Water in a closed jar on a sunny sill. After a week?',
    name: 'A glass jar, half full of water, with its lid screwed on, on a sunny window sill. The thermometer reads 30 degrees.',
    end: 'A week later the water is still there, with drops of water under the lid.',
    look: 'The lid is screwed on tight. Nothing can get out of the jar.',
    rule: AIR_RULE,
    why: 'Some water turned into vapour, but the lid kept it in. As the jar cooled each evening, vapour turned back into the drops you see. No water left the jar.',
    ring: [113, 96, 104, 44],
  },
  'idli-lid': {
    place: 'stove', temp: null, vessel: 'steamer', start: 'dry', result: 'water', after: 'Lid lifted',
    prompt: 'Mummy lifts the hot idli steamer lid. Is its underside wet?',
    name: 'Idlis cooking in a closed steel steamer on the stove, with water boiling underneath.',
    end: 'Under the lifted lid hang drops of water, and a white cloud rises from the pot.',
    look: 'Blue flames heat the pot from below. The lid on top stays cooler.',
    rule: AIR_RULE,
    why: 'Boiling water turns into water vapour, which is invisible. On the cooler lid the vapour turns back into drops of water. The white cloud you see is not vapour: it is tiny drops, made the same way.',
    ring: [80, 98, 170, 132],
  },
  puddle: {
    place: 'courtyard', temp: 32, vessel: 'puddle', start: 'water', result: 'dry', after: '3 hours later',
    prompt: 'A puddle on the sunny courtyard tiles. After three hours?',
    name: 'A puddle of water on the stone tiles of a sunny courtyard. The thermometer reads 32 degrees.',
    end: 'Three hours later the tiles are dry. A dashed line shows where the puddle was.',
    look: 'The thermometer says 32 degrees, and the puddle lies open to the sunny air.',
    rule: AIR_RULE,
    why: 'The water did not vanish. Warmed by the sun, it went up into the air as water vapour, which you cannot see. Water going into the air like this is called evaporation.',
    ring: THERMO_RING,
  },
  'cold-tumbler': {
    place: 'counter', temp: 30, vessel: 'tumbler', start: 'dry', result: 'water', after: '10 minutes later',
    prompt: 'Ice water in a steel tumbler. Will its outside get wet?',
    name: 'A steel tumbler of water and ice cubes on the kitchen counter, dry on the outside. The thermometer reads 30 degrees.',
    end: 'Ten minutes later the outside is covered in drops, with a ring of water under it.',
    look: 'Steel is solid metal, with no holes. The ice makes the steel very cold.',
    rule: AIR_RULE,
    why: 'Steel does not leak. The kitchen air carries invisible water vapour. Where that air touched the icy steel, it cooled, and the vapour turned back into drops on the outside.',
    ring: [119, 112, 92, 120],
  },
  washing: {
    place: 'courtyard', temp: 32, vessel: 'line', start: 'water', result: 'dry', after: 'By evening',
    prompt: "Mummy's wet dupatta on the line in the sun. By evening?",
    name: 'A wet, dripping dupatta hung on a washing line in a sunny courtyard. The thermometer reads 32 degrees.',
    end: 'By evening the dupatta is dry and paler than when wet, with no drips.',
    look: 'Sun, 32 degrees, and the cloth hangs spread wide open to the air.',
    rule: AIR_RULE,
    why: 'The water in the cloth went into the warm air as invisible water vapour. Spread out on a line, every part of the cloth touches the air, so it dries fast.',
    ring: [80, 56, 174, 172],
  },
};

interface WrapSpec extends Common {
  readonly vessel: 'bowl' | 'roti';
  readonly left: Wrap;
  readonly right: Wrap;
  readonly leftLabel: string;
  readonly rightLabel: string;
  readonly result: Side;
  /** Ice cubes in each bowl, or degrees for the rotis: at the start, and after. */
  readonly startAmount: number;
  readonly leftAfter: number;
  readonly rightAfter: number;
}

const WRAP: Record<WrapScene, WrapSpec> = {
  towel: {
    place: 'counter', temp: 25, vessel: 'bowl', left: 'none', right: 'towel', after: '2 hours later',
    leftLabel: 'Bare bowl', rightLabel: 'Towel bowl', result: 'right',
    startAmount: 4, leftAfter: 0, rightAfter: 3,
    prompt: 'One bowl of ice wrapped in a towel. Which keeps more ice?',
    name: 'Two glass bowls, each with four ice cubes, on a 25 degree kitchen counter. The right one is wrapped in a thick towel.',
    end: 'Two hours later the bare bowl holds only water. The towel bowl still has three smaller cubes.',
    look: 'Same kitchen, same ice, same bowls. The only difference is the towel.',
    rule: WRAP_RULE,
    why: 'The towel made no heat. It slowed the warmth of the room getting into the ice, so the wrapped ice melted more slowly: three cubes left, against none in the bare bowl.',
    ring: [170, 114, 158, 124],
  },
  'freezer-towel': {
    place: 'freezer', temp: -18, vessel: 'bowl', left: 'towel', right: 'none', after: '2 hours later',
    leftLabel: 'Towel bowl', rightLabel: 'Bare bowl', result: 'same',
    startAmount: 4, leftAfter: 4, rightAfter: 4,
    prompt: 'Both bowls in the freezer, one wrapped. Which keeps more ice?',
    name: 'Two glass bowls of four ice cubes on the freezer shelf at 18 below zero. The left one is wrapped in a thick towel.',
    end: 'Two hours later both bowls still hold four hard cubes of ice.',
    look: 'The thermometer says 18 below zero. Both bowls sit in that cold.',
    rule: WRAP_RULE,
    why: 'In the freezer nothing around the ice is warm, so there is no warmth for the towel to slow down. Both stay frozen. If a towel made heat, the wrapped ice would have melted.',
    ring: THERMO_RING,
  },
  roti: {
    place: 'counter', temp: 25, vessel: 'roti', left: 'cloth', right: 'none', after: '20 minutes later',
    leftLabel: 'Wrapped rotis', rightLabel: 'Bare rotis', result: 'left',
    startAmount: 70, leftAfter: 55, rightAfter: 35,
    prompt: 'Two stacks of hot rotis, one wrapped in cloth. Which stays warmer?',
    name: 'Two stacks of rotis, both just off the tava at 70 degrees, on plates on a 25 degree counter. The left stack is folded inside a cotton cloth.',
    end: 'Twenty minutes later the wrapped stack is still warm, at 55 degrees. The bare stack has cooled to 35.',
    look: 'Both stacks start equally hot, in the same kitchen. Only one is wrapped.',
    rule: WRAP_RULE,
    why: 'The cloth made no heat. It slowed the rotis\' warmth getting out into the room. A wrapping slows heat moving both ways: into cold ice, and out of hot rotis.',
    ring: [14, 86, 312, 148],
  },
  'thin-thick': {
    place: 'counter', temp: 25, vessel: 'bowl', left: 'hanky', right: 'thick', after: '2 hours later',
    leftLabel: 'Thin hanky', rightLabel: 'Thick towel', result: 'right',
    startAmount: 4, leftAfter: 1, rightAfter: 3,
    prompt: 'A thin hanky or a thick towel. Which keeps more ice?',
    name: 'Two glass bowls of four ice cubes on a 25 degree counter. The left one is under a thin cotton hanky, the right one under a thick folded towel.',
    end: 'Two hours later the hanky bowl has one small cube left. The thick towel bowl has three.',
    look: 'One wrapping is a single thin layer. The other is thick and folded.',
    rule: WRAP_RULE,
    why: 'Both wrappings slow the warmth getting in, but the thick towel holds far more still air than one thin layer of cotton. Thicker wrapping slowed it more: three cubes left, against one.',
    ring: [16, 114, 312, 124],
  },
  shawl: {
    place: 'courtyard', temp: 32, vessel: 'bowl', left: 'shawl', right: 'none', after: '2 hours later',
    leftLabel: 'Shawl bowl', rightLabel: 'Bare bowl', result: 'left',
    startAmount: 4, leftAfter: 2, rightAfter: 0,
    prompt: "One bowl of ice in Dadi's woollen shawl. Which keeps more?",
    name: "Two glass bowls of four ice cubes in the shade of a 32 degree courtyard in Jaipur. The left one is wrapped in Dadi's winter shawl.",
    end: 'Two hours later the shawl bowl still has two cubes. The bare one holds only water.',
    look: 'Dadi wears this shawl to keep warm. It is only wool, with no heater inside.',
    rule: WRAP_RULE,
    why: "Dadi's shawl feels warm because it holds her own body's heat in. It makes no heat itself. Round the bowl it slowed the courtyard's heat getting in, so the ice lasted longer.",
    ring: [16, 114, 152, 124],
  },
};

const ORDER: Record<Level, readonly (StateScene | WrapScene)[]> = {
  1: ['counter-ice', 'freezer-water', 'fridge-ice', 'counter-water', 'freezer-ice', 'fridge-water'],
  2: ['open-plate', 'closed-jar', 'idli-lid', 'puddle', 'cold-tumbler', 'washing'],
  3: ['towel', 'freezer-towel', 'roti', 'thin-thick', 'shawl'],
};

export function generate(level: Level, index: number): Round {
  const order = ORDER[level];
  const scene = order[((index % order.length) + order.length) % order.length];
  return level === 3
    ? { kind: 'wrap', scene: scene as WrapScene, result: WRAP[scene as WrapScene].result }
    : { kind: 'state', scene: scene as StateScene, result: STATE[scene as StateScene].result };
}

const spec = (round: Round): StateSpec | WrapSpec => (round.kind === 'state' ? STATE[round.scene] : WRAP[round.scene]);

/** The choices for a round, in a fixed order: [value, label]. */
function options(round: Round): ReadonlyArray<readonly [Exclude<Answer, null>, string]> {
  if (round.kind === 'wrap') {
    const s = WRAP[round.scene];
    return [['left', s.leftLabel], ['right', s.rightLabel], ['same', 'Both the same']];
  }
  switch (round.scene) {
    case 'open-plate':
      return [['water', 'Still water'], ['dry', 'A dry plate']];
    case 'closed-jar':
      return [['water', 'Still water'], ['dry', 'Dried up']];
    case 'idli-lid':
      return [['water', 'Wet with drops'], ['dry', 'Dry']];
    case 'puddle':
      return [['water', 'Still a puddle'], ['dry', 'Dry tiles']];
    case 'cold-tumbler':
      return [['water', 'Wet with drops'], ['dry', 'Stays dry']];
    case 'washing':
      return [['water', 'Still wet'], ['dry', 'Dry']];
    default:
      return [['ice', 'Ice'], ['water', 'Water']];
  }
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#24170f';
const SOFT = '#5a4636';
const STEEL = '#c9ced6';
const STEEL_D = '#8e96a3';
const WATER = '#8fc3e8';
const WATER_D = '#3e7fb2';
const ICE = '#eef8ff';
const ICE_EDGE = '#5f97c2';
const GOLD = '#f2a900';
const MERCURY = '#d1342f';

/** Everything stands on this line; the pair sits at PAIR, a single thing at ONE. */
const FLOOR = 222;
const ONE = 165;
const PAIR = [88, 246] as const;

function Backdrop({ place, shade }: { readonly place: Place; readonly shade?: boolean }) {
  const tiles = (fill: string, line: string, top: number, bottom: number, step: number) => (
    <g>
      <rect x="0" y={top} width="420" height={bottom - top} fill={fill} />
      {Array.from({ length: Math.ceil((bottom - top) / step) }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={top + i * step} x2="420" y2={top + i * step} stroke={line} strokeWidth="1.5" />
      ))}
      {Array.from({ length: Math.ceil(420 / step) }, (_, i) => (
        <line key={`v${i}`} x1={i * step} y1={top} x2={i * step} y2={bottom} stroke={line} strokeWidth="1.5" />
      ))}
    </g>
  );
  const counter = (
    <g>
      <rect x="0" y={FLOOR} width="420" height="12" fill="#a66e33" />
      <rect x="0" y={FLOOR + 12} width="420" height={280 - FLOOR - 12} fill="#e2b277" />
      <line x1="0" y1={FLOOR} x2="420" y2={FLOOR} stroke={INK} strokeWidth="3" />
    </g>
  );
  switch (place) {
    case 'counter':
      return (
        <g>
          {tiles('#f7ecd6', '#e6d4b2', 0, FLOOR, 30)}
          {counter}
        </g>
      );
    case 'stove':
      return (
        <g>
          {tiles('#f7ecd6', '#e6d4b2', 0, FLOOR, 30)}
          {counter}
          <rect x="62" y="206" width="206" height="20" rx="5" fill="#4b4f56" stroke={INK} strokeWidth="3" />
          {[-44, -22, 0, 22, 44].map((d) => (
            <path key={d} d={`M${ONE + d - 6} 206 L${ONE + d} 190 L${ONE + d + 6} 206 Z`} fill="#3c7be0" stroke="#1d4fa8" strokeWidth="1.5" />
          ))}
        </g>
      );
    case 'freezer':
      return (
        <g>
          <rect x="0" y="0" width="420" height="280" fill="#d4e8f6" />
          <rect x="0" y="0" width="420" height="14" fill="#bcd8ee" />
          {[40, 90, 150, 230, 280].map((x, i) => (
            <circle key={x} cx={x} cy={[30, 64, 22, 48, 74][i]} r="5" fill="#ffffff" opacity="0.9" />
          ))}
          <rect x="0" y={FLOOR} width="420" height="8" fill="#9fb4c6" stroke={INK} strokeWidth="2" />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={i * 30} y1={FLOOR + 8} x2={i * 30 + 10} y2="280" stroke="#a8c2d8" strokeWidth="2" />
          ))}
        </g>
      );
    case 'fridge':
      return (
        <g>
          <rect x="0" y="0" width="420" height="280" fill="#f3f6f4" />
          <rect x="140" y="6" width="50" height="10" rx="5" fill="#fff6c8" stroke="#d8c98a" strokeWidth="2" />
          <rect x="0" y={FLOOR} width="420" height="10" fill="#cfe7e4" stroke={INK} strokeWidth="2" />
          <rect x="0" y={FLOOR + 10} width="420" height={280 - FLOOR - 10} fill="#e8eeec" />
        </g>
      );
    case 'courtyard':
      return (
        <g>
          <rect x="0" y="0" width="420" height={FLOOR} fill="#eab792" />
          <path d="M70 222 V120 Q70 70 120 70 H210 Q260 70 260 120 V222" fill="#d79a72" stroke="#b9764d" strokeWidth="3" />
          {shade ? null : <circle cx="292" cy="36" r="20" fill="#ffd34d" stroke="#e59a00" strokeWidth="3" />}
          {tiles('#d8a27a', '#bf8460', FLOOR, 280, 29)}
          <line x1="0" y1={FLOOR} x2="420" y2={FLOOR} stroke={INK} strokeWidth="3" />
          {shade ? (
            <g>
              <rect x="0" y="0" width="420" height="280" fill="#3b2412" opacity="0.14" />
              <rect x="0" y="0" width="420" height="22" fill="#8a4b26" stroke={INK} strokeWidth="3" />
              {Array.from({ length: 11 }, (_, i) => (
                <rect key={i} x={i * 40 + 8} y="22" width="22" height="8" fill="#8a4b26" stroke={INK} strokeWidth="2" />
              ))}
            </g>
          ) : null}
        </g>
      );
    case 'sill':
      return (
        <g>
          <rect x="0" y="0" width="420" height="280" fill="#f3e2c4" />
          <rect x="34" y="14" width="270" height={FLOOR - 18} fill="#bfe3f5" stroke="#8a5a2b" strokeWidth="8" />
          <line x1="169" y1="14" x2="169" y2={FLOOR - 4} stroke="#8a5a2b" strokeWidth="6" />
          <circle cx="250" cy="58" r="22" fill="#ffd34d" stroke="#e59a00" strokeWidth="3" />
          <rect x="16" y={FLOOR} width="306" height="16" fill="#c8913f" stroke={INK} strokeWidth="3" />
        </g>
      );
  }
}

/** A room thermometer, -20 to 40 degrees, with the 0 line drawn heavy. */
function Thermometer({ t }: { readonly t: number }) {
  const y = (v: number) => 170 - v * 3;
  const reading = t < 0 ? `−${-t}°` : `${t}°`;
  return (
    <g aria-hidden="true">
      <rect x="338" y="8" width="68" height="264" rx="12" fill="#fffdf8" stroke={SOFT} strokeWidth="2" />
      <text x="372" y="31" textAnchor="middle" fontSize="20" fontWeight="700" fill={INK}>
        {reading}
      </text>
      <rect x="380" y="44" width="14" height="200" rx="7" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <rect x="383.5" y={y(t)} width="7" height={246 - y(t)} fill={MERCURY} />
      <circle cx="387" cy="250" r="12" fill={MERCURY} stroke={INK} strokeWidth="2.5" />
      {[40, 20, -20].map((v) => (
        <g key={v}>
          <line x1="372" y1={y(v)} x2="380" y2={y(v)} stroke={INK} strokeWidth="2" />
          <text x="368" y={y(v) + 5} textAnchor="end" fontSize="13" fill={SOFT}>
            {v < 0 ? `−${-v}` : v}
          </text>
        </g>
      ))}
      <line x1="346" y1={y(0)} x2="400" y2={y(0)} stroke={INK} strokeWidth="3.5" />
      <text x="356" y={y(0) - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
        0
      </text>
    </g>
  );
}


/** Where the model is a drawing, not a recording, the after tag says so. */
function TimeTag({ text, model }: { readonly text: string; readonly model?: boolean }) {
  const w = Math.max(text.length * 8.6, model ? 92 : 0) + 22;
  return (
    <g>
      <rect x="10" y="10" width={w} height={model ? 46 : 28} rx="14" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
      <text x={10 + w / 2} y="29" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
        {text}
      </text>
      {model ? (
        <text x={10 + w / 2} y="47" textAnchor="middle" fontSize="12" fill={SOFT}>
          a drawn model
        </text>
      ) : null}
    </g>
  );
}

/* ----------------------------------------------------------- the things -- */

function Cube({ x, y, s, worn }: { readonly x: number; readonly y: number; readonly s: number; readonly worn?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={worn ? s * 0.34 : s * 0.14} fill={ICE} stroke={ICE_EDGE} strokeWidth="2.5" />
      <line x1={x + s * 0.25} y1={y + s * 0.28} x2={x + s * 0.55} y2={y + s * 0.28} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** Inner half-width of the glass bowl at height y. */
const bowlHalf = (y: number) => 32 + ((FLOOR - y) * 22) / 56;

/**
 * A clear glass bowl seen from the side, so the ice and the water in it are
 * both visible. Ice floats with about a tenth above the water, as it does; in
 * shallow water it sits on the bottom.
 */
function GlassBowl({ cx, cubes, depth, worn }: { readonly cx: number; readonly cubes: number; readonly depth: number; readonly worn?: boolean }) {
  const s = worn ? 18 : 24;
  const yw = FLOOR - 3 - depth;
  const rest = FLOOR - 3 - s;
  let at: Array<readonly [number, number]>;
  if (depth > 0) {
    const top = Math.min(yw - 0.12 * s, rest);
    const total = cubes * s + (cubes - 1) * 3;
    at = Array.from({ length: cubes }, (_, i) => [cx - total / 2 + i * (s + 3), top] as const);
  } else if (cubes === 1) {
    at = [[cx - s / 2, rest]];
  } else {
    const heap: Array<readonly [number, number]> = [
      [cx - s - 2, rest],
      [cx + 2, rest],
      [cx - s - 6, rest - s],
      [cx + 6, rest - s],
    ];
    at = heap.slice(0, cubes);
  }
  const hw = bowlHalf(yw) - 3;
  return (
    <g>
      <path d={`M${cx - 54} 166 L${cx - 32} ${FLOOR} H${cx + 32} L${cx + 54} 166 Z`} fill="#e3f1f8" opacity="0.6" />
      {depth > 0 ? (
        <g>
          <path d={`M${cx - hw} ${yw} H${cx + hw} L${cx + 30} ${FLOOR - 3} H${cx - 30} Z`} fill={WATER} />
          <line x1={cx - hw} y1={yw} x2={cx + hw} y2={yw} stroke={WATER_D} strokeWidth="2.5" />
        </g>
      ) : null}
      {at.map(([x, y], i) => (
        <Cube key={i} x={x} y={y} s={s} worn={worn} />
      ))}
      <path d={`M${cx - 54} 166 L${cx - 32} ${FLOOR} H${cx + 32} L${cx + 54} 166`} fill="none" stroke="#4f7286" strokeWidth="3.5" strokeLinejoin="round" />
      <line x1={cx - 58} y1="166" x2={cx + 58} y2="166" stroke="#4f7286" strokeWidth="4" strokeLinecap="round" />
      <line x1={cx + 40} y1="176" x2={cx + 30} y2="206" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
    </g>
  );
}

const cupHalf = (y: number) => 24 + ((FLOOR - y) * 8) / (FLOOR - 140);

/** A clear plastic cup. Frozen, the water bulges up: ice takes more room than the water it came from. */
function Cup({ state }: { readonly state: State }) {
  const x = ONE;
  const yw = 164;
  const yi = 158;
  return (
    <g>
      <path d={`M${x - 32} 140 L${x - 24} ${FLOOR} H${x + 24} L${x + 32} 140 Z`} fill="#eef6fb" opacity="0.7" />
      {state === 'ice' ? (
        <g>
          <path
            d={`M${x - cupHalf(yi) + 2} ${yi} Q${x} ${yi - 16} ${x + cupHalf(yi) - 2} ${yi} L${x + 22} ${FLOOR - 2} H${x - 22} Z`}
            fill={ICE}
            stroke={ICE_EDGE}
            strokeWidth="2.5"
          />
          <ellipse cx={x} cy="190" rx="8" ry="20" fill="#ffffff" opacity="0.95" />
          <circle cx={x - 12} cy="176" r="2.5" fill="#ffffff" />
          <circle cx={x + 11} cy="204" r="2" fill="#ffffff" />
        </g>
      ) : (
        <g>
          <path d={`M${x - cupHalf(yw) + 2} ${yw} H${x + cupHalf(yw) - 2} L${x + 22} ${FLOOR - 2} H${x - 22} Z`} fill={WATER} />
          <line x1={x - cupHalf(yw) + 2} y1={yw} x2={x + cupHalf(yw) - 2} y2={yw} stroke={WATER_D} strokeWidth="2.5" />
        </g>
      )}
      <path d={`M${x - 32} 140 L${x - 24} ${FLOOR} H${x + 24} L${x + 32} 140`} fill="none" stroke="#4f7286" strokeWidth="3.5" strokeLinejoin="round" />
      <line x1={x + 22} y1="150" x2={x + 17} y2="200" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Drop({ x, y, r = 4 }: { readonly x: number; readonly y: number; readonly r?: number }) {
  return <path d={`M${x} ${y - r * 1.7} Q${x + r} ${y - r * 0.2} ${x} ${y + r} Q${x - r} ${y - r * 0.2} ${x} ${y - r * 1.7} Z`} fill={WATER} stroke={WATER_D} strokeWidth="1.5" />;
}

/** A screw-top glass jar. Closed, the water level stays; the vapour meets the lid and makes drops. */
function Jar({ drops }: { readonly drops: boolean }) {
  const x = ONE;
  return (
    <g>
      <rect x={x - 40} y="118" width="80" height={FLOOR - 118} rx="12" fill="#eef6fb" />
      <path d={`M${x - 37} 172 H${x + 37} V${FLOOR - 10} Q${x + 37} ${FLOOR - 3} ${x + 30} ${FLOOR - 3} H${x - 30} Q${x - 37} ${FLOOR - 3} ${x - 37} ${FLOOR - 10} Z`} fill={WATER} />
      <line x1={x - 37} y1="172" x2={x + 37} y2="172" stroke={WATER_D} strokeWidth="2.5" />
      {drops ? [-28, -16, -4, 8, 20, 30].map((d, i) => <Drop key={d} x={x + d} y={128 + (i % 2) * 5} r={3.2} />) : null}
      {drops ? [[-33, 146], [32, 152], [-30, 160]].map(([d, y]) => <Drop key={y} x={x + d} y={y} r={2.6} />) : null}
      <rect x={x - 40} y="118" width="80" height={FLOOR - 118} rx="12" fill="none" stroke="#4f7286" strokeWidth="3.5" />
      <rect x={x - 44} y="104" width="88" height="16" rx="4" fill="#c0392b" stroke={INK} strokeWidth="3" />
      {[-30, -15, 0, 15, 30].map((d) => (
        <line key={d} x1={x + d} y1="106" x2={x + d} y2="118" stroke="#8e2a1f" strokeWidth="2" />
      ))}
    </g>
  );
}

/** A steel thali on the sill. Wet: a spill of water. Dry: a dashed line where the spill was. */
function Plate({ wet }: { readonly wet: boolean }) {
  const x = ONE;
  return (
    <g>
      <ellipse cx={x} cy={FLOOR - 7} rx="84" ry="15" fill={STEEL} stroke={INK} strokeWidth="3" />
      <ellipse cx={x} cy={FLOOR - 8} rx="66" ry="10" fill="#dde1e7" stroke={STEEL_D} strokeWidth="2" />
      {wet ? (
        <path d={`M${x - 46} ${FLOOR - 9} q10 -7 30 -5 q22 -5 38 1 q18 2 20 6 q-12 6 -40 5 q-34 2 -48 -7 z`} fill={WATER} stroke={WATER_D} strokeWidth="2" />
      ) : (
        <path d={`M${x - 46} ${FLOOR - 9} q10 -7 30 -5 q22 -5 38 1 q18 2 20 6 q-12 6 -40 5 q-34 2 -48 -7 z`} fill="none" stroke={SOFT} strokeWidth="2" strokeDasharray="5 4" />
      )}
    </g>
  );
}

/** A puddle on the courtyard tiles. Dry: a dashed line where it was. */
function Puddle({ wet }: { readonly wet: boolean }) {
  const x = ONE;
  const d = `M${x - 96} 250 q8 -18 48 -16 q30 -12 66 -2 q44 0 42 18 q-6 16 -54 14 q-30 8 -64 0 q-42 4 -38 -14 z`;
  return wet ? <path d={d} fill={WATER} stroke={WATER_D} strokeWidth="2.5" /> : <path d={d} fill="none" stroke="#5a3a22" strokeWidth="2.5" strokeDasharray="7 5" />;
}

/**
 * The idli steamer on the burner. Closed: only the outside shows. Opened: the
 * lid is held up, drops hang under it, and a white cloud of tiny drops sits
 * above the pot — drawn as drops, not as a vapour, because vapour cannot be seen.
 */
function Steamer({ open }: { readonly open: boolean }) {
  const x = ONE;
  return (
    <g transform="translate(0 -10)">
      <rect x={x - 62} y="140" width="124" height="64" rx="8" fill={STEEL} stroke={INK} strokeWidth="3" />
      <rect x={x - 76} y="150" width="16" height="10" rx="4" fill="#3a3a3a" />
      <rect x={x + 60} y="150" width="16" height="10" rx="4" fill="#3a3a3a" />
      <line x1={x - 50} y1="160" x2={x - 50} y2="196" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {open ? (
        <g>
          {[-40, -14, 12, 38].map((d) => (
            <ellipse key={d} cx={x + d} cy="140" rx="12" ry="5" fill="#fbf7ec" stroke="#c9bfa6" strokeWidth="1.5" />
          ))}
          {[
            [-34, 118], [-18, 110], [0, 116], [18, 108], [34, 116], [-6, 104], [12, 102], [-26, 104], [28, 104],
          ].map(([d, y], i) => (
            <circle key={i} cx={x + d} cy={y} r={i % 3 === 0 ? 2.6 : 2} fill="#9fb6c7" opacity="0.9" />
          ))}
          <path d={`M${x - 40} 122 q-16 -14 4 -24 q4 -18 26 -12 q14 -14 30 0 q22 -4 20 16 q14 12 -6 22 z`} fill="#ffffff" opacity="0.75" stroke="#cfd8df" strokeWidth="1.5" />
          <line x1="96" y1="100" x2={x - 54} y2="108" stroke={SOFT} strokeWidth="1.5" />
          <text x="12" y="105" fontSize="14" fontWeight="700" fill={SOFT}>
            tiny drops
          </text>
        </g>
      ) : null}
      <g transform={`translate(0 ${open ? -60 : 0})`}>
        <path d={`M${x - 66} 142 Q${x} 112 ${x + 66} 142 Z`} fill={STEEL} stroke={INK} strokeWidth="3" />
        <rect x={x - 10} y="114" width="20" height="10" rx="4" fill="#3a3a3a" stroke={INK} strokeWidth="2" />
        {open ? [-50, -34, -18, -2, 14, 30, 46].map((d, i) => <Drop key={d} x={x + d} y={146 + (i % 2) * 4} r={3.4} />) : null}
      </g>
      {open ? (
        <g>
          <line x1="440" y1="12" x2={x + 22} y2="56" stroke="#1f8a8a" strokeWidth="22" strokeLinecap="round" />
          <line x1="440" y1="12" x2={x + 22} y2="56" stroke={INK} strokeWidth="2" opacity="0.35" />
          <ellipse cx={x + 8} cy="58" rx="14" ry="11" fill="#9a5f36" stroke={INK} strokeWidth="2.5" />
        </g>
      ) : null}
    </g>
  );
}

/** A steel tumbler of ice water: the cube tops show above the water at the rim. */
function Tumbler({ wet }: { readonly wet: boolean }) {
  const x = ONE;
  return (
    <g>
      {wet ? <ellipse cx={x} cy={FLOOR - 1} rx="46" ry="6" fill={WATER} stroke={WATER_D} strokeWidth="2" /> : null}
      <path d={`M${x - 36} 124 L${x - 28} ${FLOOR - 2} H${x + 28} L${x + 36} 124 Z`} fill={STEEL} stroke={INK} strokeWidth="3" />
      <line x1={x - 22} y1="136" x2={x - 18} y2="208" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <ellipse cx={x} cy="124" rx="36" ry="7" fill={WATER} stroke={INK} strokeWidth="3" />
      <rect x={x - 22} y="117" width="16" height="11" rx="3" fill={ICE} stroke={ICE_EDGE} strokeWidth="2" />
      <rect x={x + 2} y="116" width="16" height="12" rx="3" fill={ICE} stroke={ICE_EDGE} strokeWidth="2" />
      {wet
        ? [
            [-26, 146], [-8, 140], [12, 150], [26, 138], [-20, 172], [2, 166], [22, 178], [-14, 196], [8, 190], [24, 204], [-24, 212],
          ].map(([d, y], i) => <Drop key={i} x={x + d} y={y} r={3.6} />)
        : null}
    </g>
  );
}

/** Mummy's dupatta on the washing line. Wet: dark, heavy, dripping. Dry: paler and light. */
function Dupatta({ wet }: { readonly wet: boolean }) {
  const fill = wet ? '#8d1078' : '#e46fcb';
  return (
    <g>
      <rect x="84" y="62" width="8" height={FLOOR - 62} fill="#7a5230" stroke={INK} strokeWidth="2" />
      <rect x="240" y="62" width="8" height={FLOOR - 62} fill="#7a5230" stroke={INK} strokeWidth="2" />
      <path d="M88 70 Q166 82 244 70" fill="none" stroke={INK} strokeWidth="2.5" />
      <path d={`M110 76 Q166 86 222 76 L${wet ? 226 : 230} ${wet ? 194 : 176} Q166 ${wet ? 204 : 182} ${wet ? 106 : 102} ${wet ? 194 : 176} Z`} fill={fill} stroke={INK} strokeWidth="3" />
      <path d={`M${wet ? 108 : 104} ${wet ? 184 : 166} Q166 ${wet ? 194 : 172} ${wet ? 224 : 228} ${wet ? 184 : 166}`} fill="none" stroke={GOLD} strokeWidth="5" />
      {[122, 166, 210].map((x) => (
        <rect key={x} x={x - 3} y="72" width="6" height="12" rx="2" fill="#f0d27a" stroke={INK} strokeWidth="1.5" />
      ))}
      {wet ? (
        <g>
          {[118, 150, 182, 214].map((x, i) => (
            <Drop key={x} x={x} y={206 + (i % 2) * 6} r={3.4} />
          ))}
          <ellipse cx="166" cy="248" rx="58" ry="8" fill={WATER} stroke={WATER_D} strokeWidth="2" opacity="0.9" />
        </g>
      ) : null}
    </g>
  );
}

/* ------------------------------------------------------------- the pairs -- */

const CLOTH: Record<Exclude<Wrap, 'none'>, { readonly fill: string; readonly band: string; readonly t: number }> = {
  towel: { fill: '#d9632b', band: '#f6c08f', t: 10 },
  thick: { fill: '#d9632b', band: '#f6c08f', t: 14 },
  hanky: { fill: '#f7f4ee', band: '#9db9dc', t: 3 },
  shawl: { fill: '#7b1e3a', band: GOLD, t: 9 },
  cloth: { fill: '#f4f1e8', band: '#3b6fb6', t: 5 },
};

/** A bowl wrapped all round and over the top: the ice is hidden, so a tag says what is inside. */
function WrappedBowl({ cx, wrap }: { readonly cx: number; readonly wrap: Exclude<Wrap, 'none'> }) {
  const { fill, band, t } = CLOTH[wrap];
  const top = 150 - t * 2;
  const side = (y: number) => 34 + t + ((FLOOR - y) * 22) / 56;
  return (
    <g>
      <path
        d={`M${cx - 34 - t} ${FLOOR} L${cx - 56 - t} 166 Q${cx - 50} ${top} ${cx} ${top} Q${cx + 50} ${top} ${cx + 56 + t} 166 L${cx + 34 + t} ${FLOOR} Z`}
        fill={fill}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[184, 204].map((y) => (
        <line key={y} x1={cx - side(y) + 3} y1={y} x2={cx + side(y) - 3} y2={y} stroke={band} strokeWidth={wrap === 'hanky' ? 2 : 4} />
      ))}
      {t >= 10 ? <path d={`M${cx - 50 - t} 176 Q${cx} ${168 - t} ${cx + 50 + t} 176`} fill="none" stroke={INK} strokeWidth="2" opacity="0.5" /> : null}
      <ellipse cx={cx} cy={top + 2} rx="12" ry="7" fill={fill} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** Unwrapped to look: the same cloth lies folded flat, and the bowl stands on it. */
function OpenedCloth({ cx, wrap }: { readonly cx: number; readonly wrap: Exclude<Wrap, 'none'> }) {
  const { fill, band, t } = CLOTH[wrap];
  const h = Math.max(4, Math.round(t * 0.7));
  return (
    <g>
      <rect x={cx - 72} y={FLOOR - h} width="144" height={h} rx="2" fill={fill} stroke={INK} strokeWidth="2.5" />
      <line x1={cx - 70} y1={FLOOR - h / 2} x2={cx + 70} y2={FLOOR - h / 2} stroke={band} strokeWidth="2" />
    </g>
  );
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function CountTag({ cx, text }: { readonly cx: number; readonly text: string }) {
  return (
    <g>
      <rect x={cx - 72} y="244" width="144" height="28" rx="8" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <text x={cx} y="263" textAnchor="middle" fontSize="15" fontWeight="700" fill={INK}>
        {text}
      </text>
    </g>
  );
}

/** A stack of five rotis on a steel plate. */
function Rotis({ cx }: { readonly cx: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={FLOOR - 5} rx="62" ry="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <ellipse cx={cx} cy={FLOOR - 12 - i * 6} rx="48" ry="10" fill="#e9c27a" stroke="#8a5a2b" strokeWidth="2" />
        </g>
      ))}
      {[[-20, -2], [8, 3], [24, -4], [-6, -6]].map(([dx, dy], i) => (
        <circle key={i} cx={cx + dx} cy={FLOOR - 36 + dy} r="3" fill="#a8672c" opacity="0.8" />
      ))}
    </g>
  );
}

/** The cotton cloth folded over the stack: a dome with a check pattern and a tucked corner. */
function RotiCloth({ cx }: { readonly cx: number }) {
  const { fill, band } = CLOTH.cloth;
  return (
    <g>
      <path d={`M${cx - 58} ${FLOOR - 6} Q${cx - 60} 150 ${cx} 148 Q${cx + 60} 150 ${cx + 58} ${FLOOR - 6} Z`} fill={fill} stroke={INK} strokeWidth="3" />
      {[-30, -10, 10, 30].map((d) => (
        <line key={d} x1={cx + d} y1={156 + Math.abs(d) * 0.3} x2={cx + d} y2={FLOOR - 8} stroke={band} strokeWidth="2" opacity="0.7" />
      ))}
      {[176, 196].map((y) => (
        <line key={y} x1={cx - 54} y1={y} x2={cx + 54} y2={y} stroke={band} strokeWidth="2" opacity="0.7" />
      ))}
      <ellipse cx={cx} cy="150" rx="12" ry="6" fill={fill} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** A food-thermometer reading pushed into a roti stack. */
function Probe({ cx, deg }: { readonly cx: number; readonly deg: number }) {
  const hot = deg >= 45;
  return (
    <g>
      <line x1={cx} y1="128" x2={cx} y2={FLOOR - 26} stroke="#6b6f76" strokeWidth="4" strokeLinecap="round" />
      <rect x={cx - 34} y="96" width="68" height="34" rx="10" fill="#ffffff" stroke={hot ? MERCURY : ICE_EDGE} strokeWidth="3" />
      <text x={cx} y="120" textAnchor="middle" fontSize="20" fontWeight="700" fill={INK}>
        {`${deg}°`}
      </text>
    </g>
  );
}

function PairSide({ s, side, phase }: { readonly s: WrapSpec; readonly side: 'left' | 'right'; readonly phase: 'before' | 'after' }) {
  const cx = PAIR[side === 'left' ? 0 : 1];
  const wrap = side === 'left' ? s.left : s.right;
  const n = phase === 'before' ? s.startAmount : side === 'left' ? s.leftAfter : s.rightAfter;
  if (s.vessel === 'roti') {
    return (
      <g>
        <Rotis cx={cx} />
        {wrap !== 'none' ? <RotiCloth cx={cx} /> : null}
        <Probe cx={cx} deg={n} />
      </g>
    );
  }
  const before = phase === 'before';
  const lift = !before && wrap !== 'none' ? Math.max(4, Math.round(CLOTH[wrap].t * 0.7)) : 0;
  const depth = before || n === s.startAmount ? 0 : 8 + (s.startAmount - n) * 6;
  return (
    <g>
      {before && wrap !== 'none' ? (
        <WrappedBowl cx={cx} wrap={wrap} />
      ) : (
        <g>
          {wrap !== 'none' ? <OpenedCloth cx={cx} wrap={wrap} /> : null}
          <g transform={`translate(0 ${-lift})`}>
            <GlassBowl cx={cx} cubes={n} depth={depth} worn={!before && n < s.startAmount} />
          </g>
        </g>
      )}
      <CountTag
        cx={cx}
        text={before ? (wrap !== 'none' ? '4 cubes inside' : '4 cubes') : n === 0 ? 'No ice left' : plural(n, 'cube left', 'cubes left')}
      />
    </g>
  );
}

/* ------------------------------------------------------------ the scene -- */

/** One thing in one place, before or after. The state drawn is the spec's start or its result. */
function Single({ s, phase }: { readonly s: StateSpec; readonly phase: 'before' | 'after' }) {
  const state = phase === 'before' ? s.start : s.result;
  const wet = state === 'water';
  switch (s.vessel) {
    case 'bowl':
      return state === 'ice' ? <GlassBowl cx={ONE} cubes={4} depth={0} /> : <GlassBowl cx={ONE} cubes={0} depth={32} />;
    case 'cup':
      return <Cup state={state} />;
    case 'jar':
      return <Jar drops={phase === 'after'} />;
    case 'plate':
      return <Plate wet={wet} />;
    case 'puddle':
      return <Puddle wet={wet} />;
    case 'steamer':
      return <Steamer open={phase === 'after'} />;
    case 'tumbler':
      return <Tumbler wet={wet} />;
    case 'line':
      return <Dupatta wet={wet} />;
  }
}

/**
 * The whole frame, before or after. Both use this one function with the same
 * viewBox, place and thermometer, so the pair compares at the same scale.
 */
function Scene({ round, phase, help }: { readonly round: Round; readonly phase: 'before' | 'after'; readonly help?: boolean }) {
  const s = spec(round);
  const label = phase === 'before' ? s.name : `${s.after}. ${s.end}`;
  const [rx, ry, rw, rh] = s.ring;
  return (
    <svg className="board-svg" viewBox="0 0 420 280" role="img" aria-label={label}>
      <Backdrop place={s.place} shade={round.kind === 'wrap' && round.scene === 'shawl'} />
      {s.temp === null ? null : <Thermometer t={s.temp} />}
      {round.kind === 'state' ? (
        <Single s={STATE[round.scene]} phase={phase} />
      ) : (
        <g>
          <PairSide s={WRAP[round.scene]} side="left" phase={phase} />
          <PairSide s={WRAP[round.scene]} side="right" phase={phase} />
        </g>
      )}
      {help ? <rect x={rx} y={ry} width={rw} height={rh} rx="14" fill="none" stroke={GOLD} strokeWidth="5" strokeDasharray="12 7" /> : null}
      <TimeTag text={phase === 'before' ? 'Start' : s.after} model={phase === 'after'} />
    </svg>
  );
}

/**
 * A picture on every choice, so a child who cannot read the label can still
 * choose: a cube is ice, a blue drop is water there, a dashed drop is no water
 * left, a small wrapped or bare bowl (or roti stack) is that side, = is "both
 * the same". The choices sit left, right, same, in the order of the board.
 */
function ChoiceIcon({ round, value }: { readonly round: Round; readonly value: Exclude<Answer, null> }) {
  const drop = 'M20 5 Q31 20 29 26 Q27 35 20 35 Q13 35 11 26 Q9 20 20 5 Z';
  let body: ReactElement;
  if (value === 'ice') {
    body = (
      <g>
        <rect x="8" y="8" width="24" height="24" rx="4" fill={ICE} stroke={ICE_EDGE} strokeWidth="2.5" />
        <line x1="13" y1="14" x2="21" y2="14" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  } else if (value === 'water') {
    body = <path d={drop} fill={WATER} stroke={WATER_D} strokeWidth="2.5" />;
  } else if (value === 'dry') {
    body = <path d={drop} fill="none" stroke={SOFT} strokeWidth="2.5" strokeDasharray="4 3" />;
  } else if (value === 'same') {
    body = (
      <g fill={INK}>
        <rect x="8" y="12" width="24" height="5" rx="2" />
        <rect x="8" y="23" width="24" height="5" rx="2" />
      </g>
    );
  } else {
    const s = round.kind === 'wrap' ? WRAP[round.scene] : null;
    const wrap = s ? (value === 'left' ? s.left : s.right) : 'none';
    if (s?.vessel === 'roti') {
      body =
        wrap === 'none' ? (
          <g fill="#e9c27a" stroke="#8a5a2b" strokeWidth="2">
            {[30, 24, 18].map((y) => (
              <ellipse key={y} cx="20" cy={y} rx="15" ry="5" />
            ))}
          </g>
        ) : (
          <path d="M4 34 Q4 10 20 10 Q36 10 36 34 Z" fill={CLOTH[wrap].fill} stroke={INK} strokeWidth="2.5" />
        );
    } else {
      body =
        wrap === 'none' ? (
          <g>
            <path d="M8 22 H32 L29 33 H11 Z" fill={WATER} opacity="0.8" />
            <path d="M5 13 L11 33 H29 L35 13" fill="none" stroke="#4f7286" strokeWidth="2.5" strokeLinejoin="round" />
          </g>
        ) : (
          <path d="M11 34 L4 16 Q6 6 20 6 Q34 6 36 16 L29 34 Z" fill={CLOTH[wrap].fill} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        );
    }
  }
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      {body}
    </svg>
  );
}

/**
 * Help once ('hint'): a gold frame round the evidence and one fact about it.
 * Help twice ('worked'): the shell offers only Next, so the board itself shows
 * the whole answer — the outcome beside the unchanged setup, same frame and
 * scale, with the rule and the evidence under it.
 */
function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const s = spec(round);
  const worked = stage === 'worked';
  const locked = stage === 'solved' || worked;
  const help = stage === 'hint' || worked;
  return (
    <div className="board board--ice">
      {worked ? (
        <div className="evidence">
          <figure className="evidence__pane">
            <figcaption>Start</figcaption>
            <Scene round={round} phase="before" help />
          </figure>
          <figure className="evidence__pane evidence__pane--after">
            <figcaption>What happens</figcaption>
            <Scene round={round} phase="after" />
          </figure>
        </div>
      ) : (
        <Scene round={round} phase="before" help={help} />
      )}
      <div className="choices" role="group" aria-label="Your guess">
        {options(round).map(([value, label]) => (
          <Choice
            key={value}
            selected={answer === value}
            onTap={() => setAnswer(value)}
            disabled={locked}
            mark={worked && value === round.result ? 'right' : null}
          >
            <ChoiceIcon round={round} value={value} />
            {label}
          </Choice>
        ))}
      </div>
      {stage === 'hint' ? <p className="board-caption">{s.look}</p> : null}
      {worked ? <p className="board-caption">{s.rule}</p> : null}
      {worked ? <p className="board-caption">{s.why}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return <Scene round={round} phase="after" />;
}

export const whereDidTheIceGo: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'where-did-the-ice-go',
  title: 'Where Did the Ice Go?',
  hook: 'Ice, water, and invisible vapour.',
  group: 'world',
  levels: ['Warm or cold', 'Water into air', 'Wrap it up'],
  generate,
  prompt: (round) => spec(round).prompt,
  emptyAnswer: () => null,
  Board,
  Outcome,
  matches: (round, prediction) => prediction === round.result,
  why: (round) => spec(round).why,
  cover: 'art/games/where-did-the-ice-go.png',
  note: {
    what: 'Levels 1 and 2 show one thing in one place (ice on the counter, water in the freezer, a puddle in the sun) with a thermometer on the wall; level 3 shows two bowls of ice or two stacks of rotis, one wrapped. He taps what he thinks it will be later, then presses Try to see the later picture beside the first. The thermometer is in Celsius, so freezing is the heavy 0 line.',
    expect: 'Level 1 is quick until the fridge: most children say the fridge freezes water, because it is cold. On level 2 expect "the puddle went into the ground" and "the steam is the water going up". On level 3 most five-year-olds pick the bare bowl, because a towel is what you use to get warm; the freezer round, where neither bowl melts, is the one that settles it.',
    practising: 'Water changes state at a temperature, not at "cold": it freezes below 0 °C and melts above it. Water vapour is invisible, and the white cloud over a pot is tiny liquid drops. A wrapping makes no heat; it slows heat moving, in either direction.',
    ask: "On the freezer round of level 3, after Try: 'Neither bowl melted. If the towel made heat, what would the wrapped bowl look like now?'",
    next: 'Do the towel test for real: two equal ice cubes in two matching small bowls on the counter, one wrapped in a thick towel. Check both every 20 minutes and compare. Then put a cold steel tumbler of ice water on the table and watch the outside fill with drops.',
    honest: 'The after pictures are drawn models, not recordings: the cube counts and roti temperatures are typical, not measured. Getting these right shows he can predict from the 0 line and the wrapping; it does not show he understands heat as energy, or why vapour cannot be seen.',
    easier: 'Stay on level 1 and run each one in your own kitchen: an ice cube on a saucer on the counter, one in the fridge, one in the freezer, checked together after an hour.',
    harder: 'Ask him to choose a wrapping to keep a tiffin warm until lunch and to say what he would compare it against to test it fairly: same rotis, same box, only the wrapping changed.',
    safety: 'Steam and boiling water scald: the idli steamer is opened by an adult, with the child standing back. Ice cubes are a choking risk for the two-year-old; give her a large frozen block in a bowl instead.',
  },
};

export default whereDidTheIceGo;
