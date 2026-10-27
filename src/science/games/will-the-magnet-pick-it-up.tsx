import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, InvestigateGame, Level } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Will the Magnet Pick It Up?
 *
 * Concept (advisor catalogue, science 8): magnets attract selectively; poles
 * interact. A magnet pulls iron and steel. It does not pull every metal
 * (aluminium foil, a copper coin, a brass diya, a drink can), and it does not
 * pull wood, plastic or rubber. The misconception it breaks: "a magnet pulls
 * anything metal" and its cousin "shiny things stick".
 *
 * Shape: predict → Try → before/after side by side → why. The prediction is a
 * tap-to-choose between two outcomes; it is compared, never marked wrong. Each
 * choice is a picture of its outcome (this round's thing hanging from the
 * magnet or resting on the table; two magnets touching or slid apart), with
 * the words small underneath. Tapping one draws that guess on the board in
 * dashed gold at once. All drawing is static SVG with fixed states, and the
 * outcome is drawn in the same frame and scale as the setup.
 *
 * Levels:
 *  1. Metal, wood, plastic: one thing at a time under a horseshoe magnet held
 *     by a grown-up. Iron and steel things lift; wood, plastic, rubber stay.
 *     This builds the "metal sticks" belief on purpose.
 *  2. Not every metal: aluminium, copper and brass break that belief; small
 *     steel things still lift. The label names the metal, because a child
 *     cannot see what a thing is made of — the rule is the challenge.
 *  3. Two magnets meet: one bar magnet taped down, a second free on the table.
 *     Same ends facing push apart; different ends pull together. A numbered
 *     row of marks shows the gap before and after. In most rounds a paper
 *     sleeve hides the free magnet's facing end, so he must work it out from
 *     the end he can see: every magnet has a north end and a south end. That
 *     is the stretch — applying the pole rule to a setup he cannot just read.
 *
 * "Steel" on the board always means ordinary (carbon) steel: clips, pins,
 * bottle caps, nuts. Stainless steel is deliberately absent — many kitchen
 * steel vessels are not pulled by a magnet although they are mostly iron —
 * so the board never says "steel is mostly iron, therefore it sticks". The
 * grown-up note sends that surprise, and the rupee coins, to the real kitchen.
 */

type Thing = 'nail' | 'wood' | 'comb' | 'clip' | 'eraser' | 'pin' | 'foil' | 'cap' | 'coin' | 'nut' | 'diya' | 'can';
type Material = 'iron' | 'steel' | 'wood' | 'plastic' | 'rubber' | 'aluminium' | 'copper' | 'brass';
type Pole = 'N' | 'S';
type Result = 'pulls' | 'none' | 'pushes';

export type Round =
  | { readonly setup: 'pick'; readonly thing: Thing; readonly result: 'pulls' | 'none' }
  | {
      readonly setup: 'poles';
      readonly left: Pole;
      /** The free magnet's facing end — the true pole, even when paper hides it. */
      readonly right: Pole;
      /** A paper sleeve covers the free magnet's facing end; only its far end shows. */
      readonly hidden: boolean;
      readonly gap: number;
      readonly result: 'pulls' | 'pushes';
    };

export type Answer = Result | null;

const MATERIAL: Record<Thing, Material> = {
  nail: 'iron',
  wood: 'wood',
  comb: 'plastic',
  clip: 'steel',
  eraser: 'rubber',
  pin: 'steel',
  foil: 'aluminium',
  cap: 'steel',
  coin: 'copper',
  nut: 'steel',
  diya: 'brass',
  can: 'aluminium',
};

/** As the prompt says it. */
const NAME: Record<Thing, string> = {
  nail: 'an iron nail',
  wood: 'a wooden block',
  comb: 'a plastic comb',
  clip: 'a steel paper clip',
  eraser: 'a rubber eraser',
  pin: 'a steel safety pin',
  foil: 'a ball of aluminium foil',
  cap: 'a steel bottle cap',
  coin: 'a copper coin',
  nut: 'a steel nut',
  diya: 'a brass diya',
  can: 'an aluminium drink can',
};

/** As the label under the table says it. */
const LABEL: Record<Thing, string> = {
  nail: 'iron nail',
  wood: 'wooden block',
  comb: 'plastic comb',
  clip: 'steel paper clip',
  eraser: 'rubber eraser',
  pin: 'steel safety pin',
  foil: 'aluminium foil',
  cap: 'steel bottle cap',
  coin: 'copper coin',
  nut: 'steel nut',
  diya: 'brass diya',
  can: 'aluminium can',
};

const pulled = (t: Thing) => MATERIAL[t] === 'iron' || MATERIAL[t] === 'steel';

const WHY: Record<Thing, string> = {
  nail: 'The nail is made of iron. A magnet pulls iron, so the nail leaves the table and sticks to the magnet.',
  wood: 'Wood has no iron in it. The magnet does not pull it at all, so the block stays on the table.',
  comb: 'Plastic has no iron in it. The magnet does not pull it, so the comb stays exactly where it was.',
  clip: 'The paper clip is ordinary steel wire. A magnet pulls iron and ordinary steel, so it pulls the clip up and holds it.',
  eraser: 'Rubber has no iron in it. The eraser stays on the table, however close the magnet comes.',
  pin: 'The safety pin is ordinary steel. A magnet pulls iron and ordinary steel, so it lifts the pin and holds it.',
  foil: 'Foil is shiny metal, but it is aluminium, not iron. A magnet does not pull aluminium, so the foil stays down.',
  cap: 'Under its paint the bottle cap is thin ordinary steel. The magnet pulls ordinary steel, so it lifts the cap off the table.',
  coin: 'The coin is metal, but it is copper. A magnet does not pull copper, so the coin stays on the table.',
  nut: 'The nut is a chunky lump of ordinary steel. A magnet pulls steel like this, and its pull is strong enough to lift a small nut.',
  diya: 'The diya shines like gold, but it is brass, made of copper and zinc. A magnet pulls neither, so it stays.',
  can: 'This drink can is aluminium. It is metal, but not iron or steel, so the magnet does not pull it up.',
};

/** What the board says once the full answer is shown (Help twice). */
const RULE: Record<Material, string> = {
  iron: 'A magnet pulls iron. It picks the nail up.',
  steel: 'A magnet pulls iron and ordinary steel. It picks this up.',
  wood: 'Wood is not iron or steel. The magnet leaves it.',
  plastic: 'Plastic is not iron or steel. The magnet leaves it.',
  rubber: 'Rubber is not iron or steel. The magnet leaves it.',
  aluminium: 'Aluminium is a metal, but not iron or steel. The magnet leaves it.',
  copper: 'Copper is a metal, but not iron or steel. The magnet leaves it.',
  brass: 'Brass is a metal, but not iron or steel. The magnet leaves it.',
};

const FULL: Record<Pole, string> = { N: 'north', S: 'south' };
const other = (p: Pole): Pole => (p === 'N' ? 'S' : 'N');
const cap1 = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------------- rounds -- */

const L1: readonly Thing[] = ['nail', 'comb', 'wood', 'clip', 'eraser', 'pin'];
const L2: readonly Thing[] = ['coin', 'nut', 'foil', 'cap', 'diya', 'can'];
/**
 * Level 3: the taped magnet's facing end, the free magnet's facing end, the
 * starting gap in marks, and whether paper hides the free magnet's facing end.
 * Each set of three investigations opens with a round he can read, then two he
 * must work out. Under paper, the visible far end is always the opposite of
 * the hidden one, so comparing the two letters nearest the gap always gives
 * the wrong answer: the round only yields to "the hidden end is the opposite
 * of the end I can see". Pull and push are not alternated, so the order of
 * answers cannot be learned instead of the rule.
 */
const L3: ReadonlyArray<readonly [Pole, Pole, number, boolean]> = [
  ['N', 'S', 3, false],
  ['S', 'S', 2, true],
  ['N', 'N', 2, true],
  ['S', 'N', 3, false],
  ['N', 'S', 2, true],
  ['S', 'S', 3, true],
];
/**
 * Where a pushed magnet stops, in marks: PUSH_K / starting gap. The model is
 * one pole pushing on another with a force that falls off as 1 / distance²,
 * against a steady rub from the table. Energy in equals energy rubbed away
 * gives a stop at K / gap (gap 2 → 6, gap 3 → 4): the closer the start, the
 * harder the push and the farther it slides. A fixed "gap + n" would teach
 * the reverse.
 */
const PUSH_K = 12;

export function generate(level: Level, index: number): Round {
  const k = ((index % 6) + 6) % 6;
  if (level === 3) {
    const [left, right, gap, hidden] = L3[k];
    return { setup: 'poles', left, right, hidden, gap, result: left === right ? 'pushes' : 'pulls' };
  }
  const thing = (level === 1 ? L1 : L2)[k];
  return { setup: 'pick', thing, result: pulled(thing) ? 'pulls' : 'none' };
}

function prompt(round: Round): string {
  if (round.setup === 'pick') return `Will the magnet pick up ${NAME[round.thing]}?`;
  return round.hidden
    ? `${cap1(FULL[round.left])} end faces the end under the paper. Pull or push?`
    : `${cap1(FULL[round.left])} end faces ${FULL[round.right]} end. Pull or push?`;
}

/** Where the free magnet's near end ends up, in marks from the taped magnet. */
const endMark = (round: Extract<Round, { setup: 'poles' }>) => (round.result === 'pulls' ? 0 : PUSH_K / round.gap);

function why(round: Round): string {
  if (round.setup === 'pick') return WHY[round.thing];
  const from = round.gap;
  const to = endMark(round);
  const left = FULL[round.left];
  const right = FULL[round.right];
  const found = round.hidden ? `The free magnet's far end is ${FULL[other(round.right)]}, so the end under the paper is ${right}. ` : '';
  return round.result === 'pushes'
    ? `${found}${cap1(left)} faces ${right}. Same ends push each other away, so the free magnet slid from mark ${from} to mark ${to}.`
    : `${found}${cap1(left)} faces ${right}. Different ends pull each other together, so the free magnet slid from mark ${from} to mark 0.`;
}

/* ------------------------------------------------------------ drawing -- */

const INK = '#24170f';
const INK_SOFT = '#5a4636';
const GOLD = '#f2a900';
const GOLD_TINT = '#fdebb3';
const NORTH = '#c8102e';
const SOUTH = '#1c6dd0';
const IRON = '#6f747c';
const STEEL = '#8a9099';
const WIRE = '#5b6168';
const TIP = '#c4cad2';
const TABLE = '#8a5a2b';
const DISPLAY = { fontFamily: 'var(--font-display)' } as const;

const POLE_FILL: Record<Pole, string> = { N: NORTH, S: SOUTH };

function Frame({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <svg className="board-svg" viewBox="0 0 400 260" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Arrow({ x1, y1, x2, y2, color = GOLD, dashed }: { readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly color?: string; readonly dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = (d: number, s: number) => `${x2 - d * Math.cos(a) + s * Math.sin(a)},${y2 - d * Math.sin(a) - s * Math.cos(a)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 10 * Math.cos(a)} y2={y2 - 10 * Math.sin(a)} stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={dashed ? '8 7' : undefined} />
      <polygon points={`${x2},${y2} ${head(16, 9)} ${head(16, -9)}`} fill={color} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}

/* -- level 1 and 2: one thing, one horseshoe magnet -- */

const TABLE_Y = 200;
const TIP_Y = 118;
/** The thing hangs from the north tip when it is picked up. */
const STUCK_X = 165;

/** Height of each drawing; every thing is drawn with its top at y = 0, centred on x = 0. */
const H: Record<Thing, number> = { nail: 16, wood: 34, comb: 22, clip: 14, eraser: 18, pin: 14, foil: 30, cap: 13, coin: 13, nut: 22, diya: 26, can: 60 };
/** Widest reach of each drawing either side of x = 0, so a ring can hug it. */
const W: Record<Thing, number> = { nail: 42, wood: 34, comb: 37, clip: 25, eraser: 26, pin: 33, foil: 18, cap: 17, coin: 18, nut: 21, diya: 36, can: 19 };

function ThingShape({ thing }: { readonly thing: Thing }) {
  switch (thing) {
    case 'nail':
      return (
        <g stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <rect x="-30" y="4" width="60" height="8" fill={IRON} />
          <polygon points="30,4 42,8 30,12" fill={IRON} />
          <rect x="-37" y="0" width="7" height="16" rx="2" fill={IRON} />
        </g>
      );
    case 'wood':
      return (
        <g>
          <rect x="-34" y="0" width="68" height="34" rx="3" fill="#e2b06a" stroke={INK} strokeWidth="3" />
          <path d="M-26 11 q13 -5 26 0 t26 0 M-26 23 q13 -5 26 0 t26 0" fill="none" stroke="#a8743a" strokeWidth="2" />
        </g>
      );
    case 'comb':
      return (
        <g fill="#e0457b" stroke={INK} strokeWidth="1.5">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={-34 + i * 6} y="7" width="3.5" height="15" rx="1" />
          ))}
          <rect x="-37" y="0" width="74" height="9" rx="3" strokeWidth="2" />
        </g>
      );
    case 'clip':
      return (
        <g fill="none" stroke={WIRE} strokeWidth="3">
          <rect x="-25" y="0" width="50" height="14" rx="7" />
          <rect x="-17" y="4" width="34" height="6" rx="3" strokeWidth="2.5" />
        </g>
      );
    case 'eraser':
      return <rect x="-26" y="0" width="52" height="18" rx="5" fill="#f4a3a8" stroke={INK} strokeWidth="2.5" />;
    case 'pin':
      return (
        <g>
          <g fill="none" stroke={WIRE} strokeWidth="2.5" strokeLinecap="round">
            <path d="M-26 3 H22 M-26 11 H22" />
            <circle cx="-29" cy="7" r="4" />
          </g>
          <rect x="18" y="0" width="14" height="14" rx="3" fill={STEEL} stroke={INK} strokeWidth="2" />
        </g>
      );
    case 'foil':
      return (
        <g strokeLinejoin="round">
          <path d="M-16 4 L-4 0 L10 3 L18 12 L16 24 L4 30 L-10 28 L-18 18 Z" fill="#dfe3e8" stroke={INK} strokeWidth="2.5" />
          <path d="M-8 6 L2 14 L12 10 M2 14 L-2 24 M-14 16 L-2 18" fill="none" stroke="#9aa3ad" strokeWidth="1.5" />
        </g>
      );
    case 'cap':
      return (
        <g fill="#2f8f4e" stroke={INK} strokeWidth="2" strokeLinejoin="round">
          <path d="M-17 6 V12 L-13 9 L-9 12 L-5 9 L-1 12 L3 9 L7 12 L11 9 L15 12 L17 9 V6 Z" />
          <rect x="-17" y="0" width="34" height="6" rx="2" />
        </g>
      );
    case 'coin':
      return (
        <g stroke={INK} strokeWidth="2">
          <path d="M-18 5 V8 A18 5 0 0 0 18 8 V5" fill="#9a5a2c" />
          <ellipse cx="0" cy="5" rx="18" ry="5" fill="#c8823f" />
        </g>
      );
    case 'nut':
      return (
        <g stroke={INK}>
          <rect x="-21" y="0" width="42" height="22" rx="2" fill={STEEL} strokeWidth="2.5" />
          <path d="M-7 0 V22 M7 0 V22" strokeWidth="1.5" />
        </g>
      );
    case 'diya':
      return (
        <g stroke={INK} strokeLinejoin="round">
          <path d="M-30 4 H24 L36 0 L30 8 Q22 26 -2 26 Q-26 26 -30 4 Z" fill="#d4a017" strokeWidth="2.5" />
          <ellipse cx="-3" cy="4" rx="27" ry="4" fill="#a87b0c" strokeWidth="1.5" />
        </g>
      );
    case 'can':
      return (
        <g>
          <rect x="-19" y="0" width="38" height="60" rx="5" fill="#d3d8de" />
          <rect x="-19" y="18" width="38" height="22" fill="#e07a1f" />
          <line x1="-13" y1="5" x2="13" y2="5" stroke="#9aa3ad" strokeWidth="2" />
          <rect x="-19" y="0" width="38" height="60" rx="5" fill="none" stroke={INK} strokeWidth="2.5" />
        </g>
      );
  }
}

function Horseshoe() {
  return (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <rect x="194" y="0" width="12" height="12" fill={INK_SOFT} strokeWidth="2" />
      <path d={`M150 ${TIP_Y} V62 A50 50 0 0 1 200 12 V42 A20 20 0 0 0 180 62 V${TIP_Y} Z`} fill={NORTH} />
      <path d={`M200 12 A50 50 0 0 1 250 62 V${TIP_Y} H220 V62 A20 20 0 0 0 200 42 Z`} fill={SOUTH} />
      <rect x="150" y={TIP_Y - 16} width="30" height="16" fill={TIP} />
      <rect x="220" y={TIP_Y - 16} width="30" height="16" fill={TIP} />
      <text x="165" y="86" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="700" fill="#fff" stroke="none" style={DISPLAY}>N</text>
      <text x="235" y="86" textAnchor="middle" dominantBaseline="central" fontSize="20" fontWeight="700" fill="#fff" stroke="none" style={DISPLAY}>S</text>
    </g>
  );
}

function Table({ thing, mark }: { readonly thing: Thing; readonly mark: boolean }) {
  const text = LABEL[thing];
  const w = text.length * 11 + 28;
  return (
    <g>
      <rect x="60" y={TABLE_Y} width="280" height="14" rx="3" fill={TABLE} stroke={INK} strokeWidth="2.5" />
      <rect x="82" y={TABLE_Y + 14} width="12" height="14" fill={TABLE} stroke={INK} strokeWidth="2" />
      <rect x="306" y={TABLE_Y + 14} width="12" height="14" fill={TABLE} stroke={INK} strokeWidth="2" />
      {mark ? <rect x={200 - w / 2} y="232" width={w} height="26" rx="13" fill={GOLD_TINT} stroke={GOLD} strokeWidth="3" /> : null}
      <text x="200" y="245" textAnchor="middle" dominantBaseline="central" fontSize="19" fontWeight="600" fill={INK} style={DISPLAY}>
        {text}
      </text>
    </g>
  );
}

/** A thing at (cx, top). `ghost` draws where it used to be, faint and dashed. */
function Placed({ thing, cx, top, ghost }: { readonly thing: Thing; readonly cx: number; readonly top: number; readonly ghost?: boolean }) {
  if (ghost) {
    return (
      <g opacity="0.3">
        <rect x={cx - 42} y={top - 4} width="84" height={H[thing] + 8} rx="8" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="6 5" />
        <g transform={`translate(${cx} ${top})`}>
          <ThingShape thing={thing} />
        </g>
      </g>
    );
  }
  return (
    <g transform={`translate(${cx} ${top})`}>
      <ThingShape thing={thing} />
    </g>
  );
}

const restTop = (t: Thing) => TABLE_Y - H[t];

const GUESS_DASH = '7 6';

/**
 * The child's guess, drawn on the board the moment a choice is tapped: dashed
 * gold, so it reads as "what you said", not as what happened. Picks it up puts
 * a faint copy of the thing on the magnet's north tip inside a dashed ring;
 * Stays down rings the thing where it rests.
 */
function PickGuess({ thing, guess }: { readonly thing: Thing; readonly guess: Result }) {
  const w = W[thing];
  if (guess !== 'pulls') {
    return <rect x={200 - w - 8} y={restTop(thing) - 8} width={2 * w + 16} height={H[thing] + 12} rx="10" fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray={GUESS_DASH} />;
  }
  return (
    <g>
      <g opacity="0.45">
        <Placed thing={thing} cx={STUCK_X} top={TIP_Y} />
      </g>
      <rect x={STUCK_X - w - 6} y={TIP_Y - 4} width={2 * w + 12} height={H[thing] + 10} rx="8" fill="none" stroke={GOLD} strokeWidth="4" strokeDasharray={GUESS_DASH} />
    </g>
  );
}

function PickBefore({ thing, stage, guess }: { readonly thing: Thing; readonly stage: BoardProps<Round, Answer>['stage']; readonly guess: Answer }) {
  const worked = stage === 'worked';
  const lifts = pulled(thing);
  return (
    <Frame label={`A horseshoe magnet held above ${NAME[thing]} on a table${guess && !worked ? `; your guess: ${guess === 'pulls' ? 'it picks it up' : 'it stays down'}` : ''}`}>
      <Horseshoe />
      <Table thing={thing} mark={stage === 'hint' || worked} />
      <Placed thing={thing} cx={200} top={restTop(thing)} ghost={worked && lifts} />
      {guess && !worked ? <PickGuess thing={thing} guess={guess} /> : null}
      {worked && !lifts ? (
        <g>
          <rect x={156} y={restTop(thing) - 8} width="88" height={H[thing] + 10} rx="10" fill="none" stroke={GOLD} strokeWidth="5" />
          <text x="104" y={TABLE_Y - 14} textAnchor="middle" fontSize="15" fontWeight="700" fill={INK} style={DISPLAY}>
            stays down
          </text>
        </g>
      ) : null}
      {worked && lifts ? (
        <>
          <Placed thing={thing} cx={STUCK_X} top={TIP_Y} />
          <Arrow x1={246} y1={restTop(thing) - 4} x2={206} y2={TIP_Y + H[thing] + 6} dashed />
        </>
      ) : null}
      <Arrow x1={296} y1={96} x2={296} y2={150} color={INK_SOFT} dashed />
      <Arrow x1={296} y1={96} x2={296} y2={42} color={INK_SOFT} dashed />
      <text x="310" y="90" fontSize="15" fontWeight="600" fill={INK_SOFT} style={DISPLAY}>
        <tspan x="310">down to</tspan>
        <tspan x="310" dy="18">touch it,</tspan>
        <tspan x="310" dy="18">then up</tspan>
      </text>
    </Frame>
  );
}

function PickAfter({ thing }: { readonly thing: Thing }) {
  const lifts = pulled(thing);
  return (
    <Frame label={lifts ? `${cap1(NAME[thing])} is stuck to the magnet` : `${cap1(NAME[thing])} stays on the table under the magnet`}>
      <Horseshoe />
      <Table thing={thing} mark={false} />
      {lifts ? (
        <>
          <Placed thing={thing} cx={200} top={restTop(thing)} ghost />
          <Placed thing={thing} cx={STUCK_X} top={TIP_Y} />
          <Arrow x1={246} y1={restTop(thing) - 4} x2={206} y2={TIP_Y + H[thing] + 6} />
        </>
      ) : (
        <Placed thing={thing} cx={200} top={restTop(thing)} />
      )}
      <ModelTag result={lifts ? 'picked up' : 'stayed down'} />
    </Frame>
  );
}

/** Simulated outcomes are labelled as a model, not a recording (advisor, ruling 5). */
function ModelTag({ result }: { readonly result: string }) {
  return (
    <text x="392" y="20" textAnchor="end" fontSize="14" fontWeight="600" fill={INK_SOFT} style={DISPLAY}>
      <tspan x="392">Model result:</tspan>
      <tspan x="392" dy="17">{result}</tspan>
    </text>
  );
}

/* -- level 3: two bar magnets on a marked track -- */

type PolesRound = Extract<Round, { setup: 'poles' }>;

const BAR_W = 100;
const BAR_H = 40;
const BAR_Y = 104;
/** The taped magnet's facing (right) end; mark 0 sits here. */
const ZERO_X = 116;
const MARK = 24;
const MARKS = 6;
const TRACK_Y = 166;
const markX = (m: number) => ZERO_X + m * MARK;

/** A bar magnet from x to x + BAR_W. `near` is the pole of the end that faces the other magnet; `ring` circles one end. */
function Bar({ x, near, faces, ring }: { readonly x: number; readonly near: Pole; readonly faces: 'left' | 'right'; readonly ring?: 'near' | 'far' }) {
  const far = other(near);
  const [lp, rp] = faces === 'right' ? [far, near] : [near, far];
  const half = BAR_W / 2;
  const nearX = faces === 'right' ? x + half : x;
  const ringX = ring === 'far' ? (faces === 'right' ? x : x + half) : nearX;
  return (
    <g>
      <g stroke={INK} strokeWidth="3">
        <rect x={x} y={BAR_Y} width={half} height={BAR_H} fill={POLE_FILL[lp]} />
        <rect x={x + half} y={BAR_Y} width={half} height={BAR_H} fill={POLE_FILL[rp]} />
      </g>
      <text x={x + half / 2} y={BAR_Y + BAR_H / 2} textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="700" fill="#fff" style={DISPLAY}>
        {lp}
      </text>
      <text x={x + half * 1.5} y={BAR_Y + BAR_H / 2} textAnchor="middle" dominantBaseline="central" fontSize="22" fontWeight="700" fill="#fff" style={DISPLAY}>
        {rp}
      </text>
      {ring ? <rect x={ringX - 4} y={BAR_Y - 6} width={half + 8} height={BAR_H + 12} rx="8" fill="none" stroke={GOLD} strokeWidth="5" /> : null}
    </g>
  );
}

/** The numbered track. `from` is circled where the free magnet starts; `to` is filled where it ends. */
function Track({ from, to }: { readonly from?: number; readonly to?: number }) {
  return (
    <g>
      <line x1="8" y1={TRACK_Y} x2="392" y2={TRACK_Y} stroke={INK} strokeWidth="3" />
      {Array.from({ length: MARKS + 1 }, (_, m) => (
        <g key={m}>
          <line x1={markX(m)} y1={TRACK_Y} x2={markX(m)} y2={TRACK_Y + 12} stroke={INK} strokeWidth="2.5" />
          {m === to ? <circle cx={markX(m)} cy={TRACK_Y + 28} r="13" fill={GOLD} stroke={INK} strokeWidth="2" /> : null}
          {m === from && m !== to ? <circle cx={markX(m)} cy={TRACK_Y + 28} r="13" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="4 4" /> : null}
          <text x={markX(m)} y={TRACK_Y + 28} textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="700" fill={INK} style={DISPLAY}>
            {m}
          </text>
        </g>
      ))}
      <text x="8" y={TRACK_Y + 62} fontSize="14" fill={INK_SOFT} style={DISPLAY}>
        Marks: the gap between the two magnets.
      </text>
    </g>
  );
}

function TapedBar({ round, ring }: { readonly round: PolesRound; readonly ring: boolean }) {
  return (
    <g>
      <Bar x={ZERO_X - BAR_W} near={round.left} faces="right" ring={ring ? 'near' : undefined} />
      <g fill="#e9dcc0" stroke={INK} strokeWidth="1.5" opacity="0.92">
        <rect x={ZERO_X - BAR_W - 10} y={BAR_Y - 10} width="16" height={BAR_H + 20} rx="2" />
        <rect x={ZERO_X - BAR_W / 2 - 8} y={BAR_Y - 10} width="16" height={BAR_H + 20} rx="2" />
      </g>
      <text x={ZERO_X - BAR_W / 2} y={BAR_Y - 22} textAnchor="middle" fontSize="15" fontWeight="600" fill={INK_SOFT} style={DISPLAY}>
        taped down
      </text>
    </g>
  );
}

/**
 * The free magnet with its near end at mark `at`. `paper` covers the near end
 * ('on'), or shows where the paper was once it is lifted to reveal the end.
 */
function FreeBar({
  round,
  at,
  ring,
  tag,
  paper,
}: {
  readonly round: PolesRound;
  readonly at: number;
  readonly ring?: 'near' | 'far';
  readonly tag?: boolean;
  readonly paper?: 'on' | 'lifted';
}) {
  const x = markX(at);
  const half = BAR_W / 2;
  // With paper on, the ring is drawn over the paper so its edge is not hidden.
  const ringOver = paper === 'on' && ring;
  return (
    <g>
      <Bar x={x} near={round.right} faces="left" ring={ringOver ? undefined : ring} />
      {paper === 'on' ? (
        <g>
          <rect x={x - 5} y={BAR_Y - 8} width={half + 10} height={BAR_H + 16} rx="3" fill="#f7f1e3" stroke={INK} strokeWidth="2.5" />
          <text x={x + half / 2} y={BAR_Y + BAR_H / 2} textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="700" fill={INK_SOFT} style={DISPLAY}>
            ?
          </text>
        </g>
      ) : null}
      {paper === 'lifted' ? (
        <rect x={x - 5} y={BAR_Y - 8} width={half + 10} height={BAR_H + 16} rx="3" fill="none" stroke={INK_SOFT} strokeWidth="2" strokeDasharray="5 4" />
      ) : null}
      {ringOver ? (
        <rect x={(ring === 'far' ? x + half : x) - 4} y={BAR_Y - 6} width={half + 8} height={BAR_H + 12} rx="8" fill="none" stroke={GOLD} strokeWidth="5" />
      ) : null}
      {tag ? (
        <text x={x + half} y={BAR_Y - 22} textAnchor="middle" fontSize="15" fontWeight="600" fill={INK_SOFT} style={DISPLAY}>
          free to slide
        </text>
      ) : null}
    </g>
  );
}

/** The free magnet's move, drawn above the bars from its start to its end. */
function Move({ round, dashed }: { readonly round: PolesRound; readonly dashed?: boolean }) {
  const from = markX(round.gap);
  const to = markX(endMark(round));
  return <Arrow x1={from} y1={72} x2={to} y2={72} dashed={dashed} />;
}

/**
 * The child's guess on the track, the moment a choice is tapped: a dashed gold
 * arrow above the free magnet, in to the taped magnet for Pull together, out
 * along the track for Push apart. Direction only; how far is the model's.
 */
function PolesGuess({ round, guess }: { readonly round: PolesRound; readonly guess: Result }) {
  const mid = markX(round.gap) + BAR_W / 2;
  return guess === 'pulls' ? <Arrow x1={mid} y1={56} x2={ZERO_X + 6} y2={56} dashed /> : <Arrow x1={mid} y1={56} x2={mid + 64} y2={56} dashed />;
}

function PolesBefore({ round, stage, guess }: { readonly round: PolesRound; readonly stage: BoardProps<Round, Answer>['stage']; readonly guess: Answer }) {
  const worked = stage === 'worked';
  const hint = stage === 'hint';
  const at = worked ? endMark(round) : round.gap;
  const paper = round.hidden && !worked ? 'on' : undefined;
  // The hint rings the ends that decide it: when paper hides the facing end,
  // that is the far end he can still see.
  const freeRing = worked || (hint && !round.hidden) ? 'near' : hint ? 'far' : undefined;
  const facing = round.hidden && !worked ? 'the paper-covered end' : `the ${FULL[round.right]} end`;
  const said = guess && !worked ? `; your guess: ${guess === 'pulls' ? 'pull together' : 'push apart'}` : '';
  return (
    <Frame label={`A taped magnet's ${FULL[round.left]} end faces ${facing} of a free magnet, ${round.gap} marks away${said}`}>
      <Track from={worked ? round.gap : undefined} to={worked ? at : undefined} />
      <TapedBar round={round} ring={hint || worked} />
      <FreeBar round={round} at={at} ring={freeRing} tag={!worked} paper={paper} />
      {worked ? <Move round={round} dashed /> : null}
      {guess && !worked ? <PolesGuess round={round} guess={guess} /> : null}
    </Frame>
  );
}

function PolesAfter({ round }: { readonly round: PolesRound }) {
  const to = endMark(round);
  const moved = round.result === 'pulls' ? 'pulled in to touch the taped magnet' : `pushed away to mark ${to}`;
  const shown = round.hidden ? `; the paper is lifted to show its ${FULL[round.right]} end` : '';
  return (
    <Frame label={`The free magnet ${moved}${shown}`}>
      <Track from={round.gap} to={to} />
      <TapedBar round={round} ring={false} />
      <FreeBar round={round} at={to} paper={round.hidden ? 'lifted' : undefined} />
      <Move round={round} />
      <ModelTag result={round.result === 'pulls' ? 'pulled to mark 0' : `pushed to mark ${to}`} />
    </Frame>
  );
}

/**
 * Each choice is a picture of its outcome, so the two buttons differ without
 * reading. Levels 1-2 crop the board's own scene to the magnet and table and
 * draw this round's thing in it: hanging from the north tip, or resting on the
 * table. Level 3 draws two plain bar magnets on the track, touching or slid
 * apart, with the arrow of the move. The bars carry no pole colours, so the
 * picture never gives away the end hidden under the paper.
 */
function PickPicture({ thing, value }: { readonly thing: Thing; readonly value: Result }) {
  const lifts = value === 'pulls';
  return (
    <svg width="78" height="120" viewBox="116 0 140 216" aria-hidden="true" focusable="false">
      <Horseshoe />
      <rect x="118" y={TABLE_Y} width="136" height="14" rx="3" fill={TABLE} stroke={INK} strokeWidth="3" />
      <Placed thing={thing} cx={lifts ? STUCK_X : 200} top={lifts ? TIP_Y : restTop(thing)} />
    </svg>
  );
}

function PlainBar({ x }: { readonly x: number }) {
  return (
    <g stroke={INK} strokeWidth="2.5">
      <rect x={x} y="28" width="22" height="20" fill="#cfc6b8" />
      <rect x={x + 22} y="28" width="22" height="20" fill="#e8e1d5" />
    </g>
  );
}

/** A solid ink arrow along y = 12 from x1 to x2, thick enough to read at button size. */
function BoldArrow({ x1, x2 }: { readonly x1: number; readonly x2: number }) {
  const d = Math.sign(x2 - x1);
  return (
    <g fill={INK} stroke={INK} strokeLinejoin="round">
      <line x1={x1} y1="12" x2={x2 - d * 10} y2="12" strokeWidth="5" strokeLinecap="round" />
      <polygon points={`${x2},12 ${x2 - d * 14},3 ${x2 - d * 14},21`} strokeWidth="1.5" />
    </g>
  );
}

function PolesPicture({ value }: { readonly value: Result }) {
  const together = value === 'pulls';
  const freeX = together ? 52 : 88;
  return (
    <svg width="112" height="72" viewBox="0 0 136 88" aria-hidden="true" focusable="false">
      <line x1="2" y1="62" x2="134" y2="62" stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: 6 }, (_, m) => (
        <line key={m} x1={52 + m * 16} y1="62" x2={52 + m * 16} y2="70" stroke={INK} strokeWidth="2" />
      ))}
      <PlainBar x={8} />
      <rect x="12" y="22" width="9" height="32" rx="1.5" fill="#e9dcc0" stroke={INK} strokeWidth="1.5" />
      <PlainBar x={freeX} />
      {together ? <BoldArrow x1={112} x2={60} /> : <BoldArrow x1={62} x2={130} />}
    </svg>
  );
}

const CHOICE_FACE: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const CHOICE_WORDS: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 };

/* ------------------------------------------------------- board, outcome -- */

const CHOICES: Record<Round['setup'], ReadonlyArray<readonly [Result, string]>> = {
  pick: [
    ['pulls', 'Picks it up'],
    ['none', 'Stays down'],
  ],
  poles: [
    ['pulls', 'Pull together'],
    ['pushes', 'Push apart'],
  ],
};

function caption(round: Round, stage: BoardProps<Round, Answer>['stage']): string | null {
  if (stage !== 'hint' && stage !== 'worked') return null;
  if (round.setup === 'pick') {
    return stage === 'hint' ? `Read the gold label: it is ${MATERIAL[round.thing]}.` : RULE[MATERIAL[round.thing]];
  }
  const left = FULL[round.left];
  const right = FULL[round.right];
  const rule = round.left === round.right ? 'same ends push apart' : 'different ends pull together';
  if (stage === 'hint') {
    return round.hidden
      ? `The free magnet's far end is ${FULL[other(round.right)]}. Its two ends are always different.`
      : `Look at the ringed ends: ${left} and ${right}.`;
  }
  return round.hidden
    ? `Under the paper is ${right}. ${cap1(left)} faces ${right}: ${rule}.`
    : `${cap1(left)} faces ${right}: ${rule}.`;
}

/**
 * Read-aloud: the board's words a non-reader needs, in screen order — the
 * thing's label on the table (the material is the clue), the two choice
 * words, then the Help caption or the worked rule. Pole letters and track
 * marks are left to the picture.
 */
function board(round: Round, _level: Level, stage: BoardProps<Round, Answer>['stage']): string[] {
  const line = caption(round, stage);
  return [
    ...(round.setup === 'pick' ? [LABEL[round.thing]] : []),
    ...CHOICES[round.setup].map(([, text]) => text),
    ...(line ? [line] : []),
  ];
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const line = caption(round, stage);
  return (
    <div className="board board--magnet">
      {round.setup === 'pick' ? <PickBefore thing={round.thing} stage={stage} guess={answer} /> : <PolesBefore round={round} stage={stage} guess={answer} />}
      <div className="choices" role="group" aria-label="Your guess">
        {CHOICES[round.setup].map(([value, text]) => (
          <Choice key={value} selected={answer === value} onTap={() => setAnswer(value)} disabled={locked} ariaLabel={text}>
            <span style={CHOICE_FACE}>
              {round.setup === 'pick' ? <PickPicture thing={round.thing} value={value} /> : <PolesPicture value={value} />}
              <span style={CHOICE_WORDS}>{text}</span>
            </span>
          </Choice>
        ))}
      </div>
      {line ? <p className="board-caption">{line}</p> : null}
    </div>
  );
}

function Outcome({ round }: { readonly round: Round; readonly level: Level }) {
  return round.setup === 'pick' ? <PickAfter thing={round.thing} /> : <PolesAfter round={round} />;
}

export const willTheMagnetPickItUp: InvestigateGame<Round, Answer> = {
  kind: 'investigate',
  id: 'will-the-magnet-pick-it-up',
  title: 'Will the Magnet Pick It Up?',
  hook: 'Not every metal sticks.',
  group: 'world',
  levels: ['Metal, wood, plastic', 'Not every metal', 'Two magnets meet'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  board,
  Outcome,
  matches: (round, prediction) => prediction === round.result,
  why,
  cover: 'art/games/will-the-magnet-pick-it-up.png',
  note: {
    what: 'A horseshoe magnet is lowered onto one labelled thing on a table. He taps Picks it up or Stays down, then presses Try it to see the result beside the start. Level 3 sets two bar magnets end to end on a numbered track; in some rounds paper hides one end.',
    expect: 'Level 1 lets him build the rule "metal sticks", because the nail, clip and pin all lift and the wood, comb and eraser do not. Level 2 is built to break that rule: the copper coin, the foil, the brass diya and the drink can are all metal, and none of them lift. Expect him to say "but it is metal" — that is the moment the lesson happens. On level 3 paper rounds, expect him to compare the two letters nearest the gap; under paper those are the wrong two.',
    practising: 'A magnet pulls iron and ordinary steel; it does not pull copper, aluminium or brass, nor wood, plastic or rubber. What a thing is made of decides, not whether it is shiny or metal. Level 3: every magnet has a north end and a south end; same ends push apart, different ends pull together.',
    ask: "When the copper coin stays down: 'It is metal, and it shines. Why did the magnet leave it?' Let him reach for the label before you say the word iron. On a level 3 paper round, before Try it: 'What is under the paper? How do you know?'",
    next: "Take a fridge magnet round the kitchen and make two piles: holds and does not hold. Try a steel katori, the tiffin, a spoon, the foil, an iron tawa or kadhai, and a handful of coins. Many stainless-steel vessels will not hold it, though they look like the clips that do. A US penny stays put. Most Indian one- and two-rupee coins are a stainless steel of the kind a magnet does pull, so they stick: 'stainless' alone does not decide it either. Test each coin rather than telling him the answer.",
    honest: 'The board names the material in every label, so he can succeed by learning a list of words; that is not the same as being able to sort real objects he cannot identify. The screen also cannot show that magnets pull through paper, or let him feel the pull grow as the magnet comes closer. The distances on level 3 come from a simple model, not a measurement. Those need a real magnet.',
    easier: 'Stay on level 1 and hold a real magnet over each real object as it comes up on the screen: a nail, a paper clip, a wooden block, a comb.',
    harder: 'Before each level 2 round, ask him to name what the thing is made of before reading the label, then predict. On level 3, with two real bar magnets, hide one end under a strip of paper yourself and let him work out which end it is before they meet.',
    safety: 'Use a large fridge magnet or bar magnets in a plastic case, never small loose magnets: two swallowed magnets can pinch through the gut and need emergency surgery. Keep magnets, pins, clips, nuts and coins out of the two-year-old\'s reach, and keep magnets away from phones and bank cards.',
  },
};

export default willTheMagnetPickItUp;
