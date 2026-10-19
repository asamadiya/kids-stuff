import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * How Many Do You See? — maths game 1 (advisor catalogue).
 *
 * Concept: recognising small quantities without counting (subitizing), then
 * seeing a larger amount as two known parts. Every card is built from exactly
 * two parts so the board can colour them apart: a die-4 is 2 on top and 2
 * below, an 8 on a ten-frame is a full five and 3 more, a 16 on two
 * ten-frames is 7 and 9 — or, moving three dots across, 10 and 6.
 *
 * Screens are untimed (charter 1), so the card never disappears. The pull
 * towards seeing rather than counting comes from the arrangements themselves
 * and from the hint, which colours the parts instead of numbering the dots.
 *
 * Levels:
 *  1. Up to five: dice patterns, a row, two scattered clusters (3 to 5).
 *  2. Five and more: 6 to 10, always a five and some more — a ten-frame,
 *     a pair of dice, or two rows. The five is not always first.
 *  3. Two ten-frames, 13 to 19. Every first frame but one (the last card) is
 *     short of ten, and six of the seven cards scatter some empty boxes
 *     instead of leaving them at the end, so a frame is read by its gaps
 *     (8 is "two empty"). 7 and 9 is three empty and one empty: move three
 *     across, ten and six. That is the make-ten bridge, not a teen number
 *     read off a full frame.
 *
 * Control: tap-to-choose only. Four numbers under the card.
 */

export type Layout = 'dice' | 'line' | 'scatter' | 'dice-pair' | 'frame' | 'rows' | 'frames';

export interface Round {
  readonly layout: Layout;
  /** The two parts the card is drawn from, in drawing order. */
  readonly parts: readonly [number, number];
  readonly total: number;
  /** Four consecutive numbers, one of them the total. */
  readonly choices: readonly number[];
  /**
   * Ten-frames only: the empty cells of each frame (0-9, top row left to
   * right first). Not always the last cells, so a frame is read by its gaps.
   */
  readonly holes?: Holes;
}

type Holes = readonly [readonly number[], readonly number[]];

/** The number he has tapped, or nothing yet. */
export type Answer = number | null;

/** [layout, first part, second part, smallest of the four choices, scattered holes]. */
type Row = readonly [Layout, number, number, number, Holes?];

/** The empty cells of a frame filled in the usual order: n dots, then gaps. */
const trailing = (n: number) => Array.from({ length: 10 - n }, (_, i) => n + i);

/*
 * The four choices are chosen, not computed: each set holds the number a
 * child reaches by the usual slip at that level — one off on a die, or
 * (level 3) a nearly-full frame read as a full ten. 9 and 4 is offered 14;
 * 7 and 9 is offered both 17 and 19, one for each frame misread as full.
 */
const TABLE: Record<Level, readonly Row[]> = {
  1: [
    ['dice', 2, 2, 3],
    ['scatter', 3, 2, 2],
    ['line', 2, 1, 1],
    ['dice', 4, 1, 3],
    ['scatter', 2, 2, 1],
    ['dice', 2, 1, 3],
    ['line', 3, 2, 4],
  ],
  2: [
    ['frame', 5, 3, 6],
    ['dice-pair', 2, 5, 7],
    ['rows', 5, 4, 6],
    ['frame', 5, 1, 5],
    ['dice-pair', 5, 5, 7],
    ['rows', 3, 5, 7],
    ['frame', 5, 4, 7],
  ],
  3: [
    ['frames', 9, 4, 11],
    ['frames', 8, 6, 13, [[2, 7], trailing(6)]],
    ['frames', 7, 9, 16, [[1, 4, 8], [6]]],
    ['frames', 9, 8, 15, [[3], trailing(8)]],
    ['frames', 8, 8, 15, [[0, 9], [4, 5]]],
    ['frames', 6, 9, 13, [[1, 3, 5, 9], [5]]],
    ['frames', 10, 9, 17, [[], [2]]],
  ],
};

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = ((index % 7) + 7) % 7;
  const [layout, a, b, first, holes] = TABLE[level][k];
  const base = { layout, parts: [a, b] as const, total: a + b, choices: [first, first + 1, first + 2, first + 3] };
  return layout === 'frames' ? { ...base, holes: holes ?? [trailing(a), trailing(b)] } : base;
}

function prompt(round: Round): string {
  if (round.layout === 'frames') return 'A full frame is ten. How many dots altogether?';
  if (round.parts[0] === 5 || round.parts[1] === 5) return 'Find the five first. How many dots altogether?';
  return 'How many dots? See the groups, not each dot.';
}

/** Dots that must move from the second frame to fill the first. */
const gap = (round: Round) => (round.layout === 'frames' ? 10 - round.parts[0] : 0);

/**
 * The frames whose empty boxes the hint names and shades: the first whenever
 * it is short, because those boxes are what must be filled to make ten; the
 * second when it is nearly full, because 8 is quicker seen as "two empty".
 */
const namesGaps = (frame: 0 | 1, n: number) => n < 10 && (frame === 0 || n >= 7);

/** One sentence naming the two parts the board now colours. A fact, never a verdict. */
export function partsLine(round: Round): string {
  const [a, b] = round.parts;
  switch (round.layout) {
    case 'dice':
      return a + b === 4 ? `${a} on top, ${b} below.` : `${a} in the corners, ${b} in the middle.`;
    case 'line':
      return `The row splits into ${a} and ${b}.`;
    case 'scatter':
      return `One group of ${a}, one group of ${b}.`;
    case 'dice-pair':
      return `Left die ${a}, right die ${b}.`;
    case 'frame':
      return `Top row ${a}, a full five. Bottom row ${b}.`;
    case 'rows':
      return `Top row ${a}, bottom row ${b}.`;
    case 'frames': {
      const read = (frame: 0 | 1, n: number) => (n === 10 ? '10, full' : namesGaps(frame, n) ? `${n}, ${10 - n} empty` : String(n));
      return `First frame ${read(0, a)}. Second frame ${read(1, b)}.`;
    }
  }
}

function check(round: Round, answer: Answer): Verdict {
  if (answer === round.total) return { ok: true };
  return { ok: false, hint: partsLine(round) };
}

function explain(round: Round): string {
  const [a, b] = round.parts;
  if (round.layout === 'frames') {
    const m = gap(round);
    if (m === 0) return `A full frame is 10. 10 and ${b} make ${round.total}.`;
    return `${a} and ${b} make ${round.total}. Move ${m} across to fill the first frame: 10 and ${b - m}.`;
  }
  if (a === 5 || b === 5) return `${a} and ${b} make ${round.total}: a five you know, and ${a === 5 ? b : a} more.`;
  return `${a} and ${b} make ${round.total}. The two groups show it without counting each dot.`;
}

/* --------------------------------------------------------------- drawing -- */

interface Dot {
  readonly x: number;
  readonly y: number;
  readonly part: 0 | 1;
}

interface Box {
  readonly x: number;
  readonly y: number;
  readonly size: number;
}

interface Card {
  readonly dots: readonly Dot[];
  readonly r: number;
  /** Die faces, drawn as rounded squares. */
  readonly dice: readonly Box[];
  /** Ten-frames: top-left corner and cell size; five cells by two. */
  readonly frames: readonly Box[];
}

const INK = '#2b1d14';
/**
 * Part one saffron, part two plum. Not blue: blue is the tens colour across the
 * site, and on level 3 the second part is the ONES of a teen number.
 */
const PART = ['#d0561b', '#7a2e8c'] as const;
const PAPER = '#fff8ec';
/** The empty boxes of a frame, shaded on the hint. */
const EMPTY = '#f4c95d';

/** Die pips on a -1..1 grid. */
const PIPS: Record<number, ReadonlyArray<readonly [number, number]>> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

/** Loose clusters for the scattered card, irregular on purpose. */
const CLUSTER: Record<number, ReadonlyArray<readonly [number, number]>> = {
  1: [[0, 0]],
  2: [[-33, -27], [36, 24]],
  3: [[-42, 27], [0, -39], [45, 21]],
};

/** Centre of cell i (0..9) of a ten-frame: top row first, left to right. */
const cell = (f: Box, i: number) => ({
  x: f.x + f.size * (i % 5) + f.size / 2,
  y: f.y + f.size * Math.floor(i / 5) + f.size / 2,
});

const MID = 110;

/**
 * x of dot i in the row card. The two parts sit a visible gap apart: the
 * prompt says "see the groups", so the groups must be there to see before
 * any hint colours them.
 */
const lineX = (round: Round, i: number) => {
  const [a, b] = round.parts;
  const step = 84;
  const split = 60;
  const width = (a + b - 1) * step + split;
  return 320 - width / 2 + i * step + (i >= a ? split : 0);
};

function layout(round: Round): Card {
  const [a, b] = round.parts;
  const none: Box[] = [];
  switch (round.layout) {
    case 'dice': {
      const t = a + b;
      const u = 55;
      // An odd face splits corners / middle; a four splits top / bottom.
      const dots = PIPS[t].map(([px, py]): Dot => ({
        x: 320 + px * u,
        y: MID + py * u,
        part: t % 2 === 1 ? (px === 0 && py === 0 ? 1 : 0) : py < 0 ? 0 : 1,
      }));
      return { dots, r: 21, dice: [{ x: 220, y: MID - 100, size: 200 }], frames: none };
    }
    case 'dice-pair': {
      const u = 48;
      const face = (n: number, cx: number, part: 0 | 1) =>
        PIPS[n].map(([px, py]): Dot => ({ x: cx + px * u, y: MID + py * u, part }));
      return {
        dots: [...face(a, 215, 0), ...face(b, 425, 1)],
        r: 18,
        dice: [
          { x: 127, y: MID - 98, size: 176 },
          { x: 337, y: MID - 98, size: 176 },
        ],
        frames: none,
      };
    }
    case 'line': {
      const dots = Array.from({ length: a + b }, (_, i): Dot => ({ x: lineX(round, i), y: MID, part: i < a ? 0 : 1 }));
      return { dots, r: 28, dice: none, frames: none };
    }
    case 'scatter': {
      const group = (n: number, cx: number, flip: number, part: 0 | 1) =>
        CLUSTER[n].map(([dx, dy]): Dot => ({ x: cx + dx * flip, y: MID + dy, part }));
      return { dots: [...group(a, 200, 1, 0), ...group(b, 440, -1, 1)], r: 24, dice: none, frames: none };
    }
    case 'rows': {
      const row = (n: number, y: number, part: 0 | 1) =>
        Array.from({ length: n }, (_, i): Dot => ({ x: 152 + 84 * i, y, part }));
      return { dots: [...row(a, MID - 44, 0), ...row(b, MID + 44, 1)], r: 28, dice: none, frames: none };
    }
    case 'frame': {
      const f: Box = { x: 110, y: MID - 84, size: 84 };
      const dots = Array.from({ length: a + b }, (_, i): Dot => ({ ...cell(f, i), part: i < a ? 0 : 1 }));
      return { dots, r: 28, dice: none, frames: [f] };
    }
    case 'frames': {
      const f1: Box = { x: 22, y: 52, size: 58 };
      const f2: Box = { x: 328, y: 52, size: 58 };
      const [h1, h2] = round.holes ?? [trailing(a), trailing(b)];
      // Dots fill every cell that is not a hole, in reading order, so the
      // second frame's dots are the last b entries and its last dots are the
      // ones the worked answer moves across.
      const filled = (f: Box, holes: readonly number[], part: 0 | 1) =>
        Array.from({ length: 10 }, (_, c) => c)
          .filter((c) => !holes.includes(c))
          .map((c): Dot => ({ ...cell(f, c), part }));
      return { dots: [...filled(f1, h1, 0), ...filled(f2, h2, 1)], r: 20, dice: none, frames: [f1, f2] };
    }
  }
}

/** Where the worked answer writes each part's number, in SVG units. */
function labelSpots(round: Round): readonly [{ x: number; y: number }, { x: number; y: number }] {
  switch (round.layout) {
    case 'dice':
      return round.parts[0] + round.parts[1] === 4
        ? [{ x: 175, y: MID - 55 }, { x: 175, y: MID + 55 }]
        : [{ x: 175, y: MID }, { x: 465, y: MID }];
    case 'dice-pair':
      return [{ x: 215, y: 214 }, { x: 425, y: 214 }];
    case 'line': {
      const [a, b] = round.parts;
      return [
        { x: (lineX(round, 0) + lineX(round, a - 1)) / 2, y: 175 },
        { x: (lineX(round, a) + lineX(round, a + b - 1)) / 2, y: 175 },
      ];
    }
    case 'scatter':
      return [{ x: 200, y: 200 }, { x: 440, y: 200 }];
    case 'rows':
      return [{ x: 90, y: MID - 44 }, { x: 90, y: MID + 44 }];
    case 'frame':
      return [{ x: 70, y: MID - 42 }, { x: 70, y: MID + 42 }];
    case 'frames':
      return [{ x: 167, y: 204 }, { x: 473, y: 204 }];
  }
}

function cardName(round: Round): string {
  switch (round.layout) {
    case 'dice':
      return 'A die face of dots';
    case 'dice-pair':
      return 'Two die faces of dots';
    case 'line':
      return 'A row of dots';
    case 'scatter':
      return 'Dots scattered on a card';
    case 'rows':
      return 'Two rows of dots';
    case 'frame':
      return 'Dots in a ten-frame';
    case 'frames':
      return 'Dots in two ten-frames';
  }
}

function DotCard({ round, stage }: { readonly round: Round; readonly stage: BoardProps<Round, Answer>['stage'] }) {
  const card = layout(round);
  const parted = stage !== 'answering';
  const worked = stage === 'worked';
  const [a, b] = round.parts;
  const m = gap(round);
  const [f1, f2] = card.frames;
  const [h1, h2]: Holes = round.holes ?? [[], []];
  // The hint shades the empty boxes it names. The worked card shades only the
  // first frame's, because those are the boxes the moved dots fill.
  const shaded = (frame: 0 | 1, c: number) =>
    parted && (frame === 0 ? namesGaps(0, a) && h1.includes(c) : !worked && namesGaps(1, b) && h2.includes(c));
  // In the worked frames, the last m dots of the second frame move into the first frame's empty boxes.
  const moving = worked && m > 0 ? new Set(Array.from({ length: m }, (_, i) => a + b - 1 - i)) : new Set<number>();
  const spots = labelSpots(round);
  const label = worked
    ? `${cardName(round)}: ${a} and ${b}, ${round.total} altogether.`
    : parted
      ? `${cardName(round)}, in two colours.`
      : `${cardName(round)}.`;

  return (
    <svg className="board-svg" viewBox="0 0 640 240" role="img" aria-label={label}>
      <rect x="4" y="4" width="632" height="232" rx="18" fill={PAPER} stroke={INK} strokeWidth="3" />
      {card.dice.map((d, i) => (
        <rect key={`d${i}`} x={d.x} y={d.y} width={d.size} height={d.size} rx="26" fill="#ffffff" stroke={INK} strokeWidth="5" />
      ))}
      {card.frames.map((f, i) => (
        <g key={`f${i}`}>
          {Array.from({ length: 10 }, (_, c) => (
            <rect
              key={c}
              x={f.x + f.size * (c % 5)}
              y={f.y + f.size * Math.floor(c / 5)}
              width={f.size}
              height={f.size}
              fill={shaded(i === 0 ? 0 : 1, c) ? EMPTY : '#ffffff'}
              stroke={INK}
              strokeWidth="3"
            />
          ))}
          <rect x={f.x} y={f.y} width={f.size * 5} height={f.size * 2} fill="none" stroke={INK} strokeWidth="6" />
        </g>
      ))}
      {card.dots.map((d, i) =>
        moving.has(i) ? (
          <circle key={i} cx={d.x} cy={d.y} r={card.r} fill="none" stroke={PART[1]} strokeWidth="3" strokeDasharray="6 5" />
        ) : (
          <circle key={i} cx={d.x} cy={d.y} r={card.r} fill={parted ? PART[d.part] : INK} />
        ),
      )}
      {worked && f1 && f2 && m > 0 ? (
        <g>
          {h1.map((hole) => {
            const c = cell(f1, hole);
            return <circle key={`mv${hole}`} cx={c.x} cy={c.y} r={card.r} fill={PART[1]} stroke={INK} strokeWidth="3" strokeDasharray="6 4" />;
          })}
          <path d={`M${f2.x + 30} 40 Q ${(f1.x + f1.size * 5 + f2.x) / 2} 6 ${f1.x + f1.size * 5 - 30} 40`} fill="none" stroke={INK} strokeWidth="4" />
          <path d={`M${f1.x + f1.size * 5 - 30} 40 l17 -6 l-9 -10 z`} fill={INK} />
        </g>
      ) : null}
      {worked
        ? round.layout === 'frames'
          ? [m > 0 ? '10' : String(a), String(b - m)].map((t, i) => (
              <text key={`l${i}`} x={spots[i].x} y={spots[i].y} textAnchor="middle" dominantBaseline="middle" fontSize="34" fontWeight="700" fill={INK}>
                {t}
              </text>
            ))
          : [a, b].map((n, i) => (
              <text key={`l${i}`} x={spots[i].x} y={spots[i].y} textAnchor="middle" dominantBaseline="middle" fontSize="38" fontWeight="700" fill={PART[i]}>
                {n}
              </text>
            ))
        : null}
    </svg>
  );
}

/** The number sentence under the worked card: the parts, then the regrouped ten. */
function sentence(round: Round): string {
  const [a, b] = round.parts;
  const m = gap(round);
  return m > 0 ? `${a} + ${b} = 10 + ${b - m} = ${round.total}` : `${a} + ${b} = ${round.total}`;
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  return (
    <div className="board board--dots">
      <DotCard round={round} stage={stage} />
      <div className="choices" role="group" aria-label="How many dots">
        {round.choices.map((n) => (
          <Choice
            key={n}
            selected={stage === 'worked' ? n === round.total : answer === n}
            onTap={() => setAnswer(n)}
            disabled={locked}
            mark={stage === 'worked' && n === round.total ? 'right' : null}
            ariaLabel={`${n} dots`}
          >
            {n}
          </Choice>
        ))}
      </div>
      {stage === 'worked' ? <p className="board-caption">{sentence(round)}</p> : null}
    </div>
  );
}

export const howManyDoYouSee: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'how-many-do-you-see',
  title: 'How Many Do You See?',
  hook: 'See it at a glance.',
  group: 'numbers',
  levels: ['Up to five', 'Five and more', 'Two ten-frames'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/how-many-do-you-see.png',
  note: {
    what: 'A card of dots (one or two die faces, a row, two loose groups, two rows, a ten-frame, or two ten-frames) and four numbers underneath. He taps the number of dots, then Check.',
    expect: "He will probably point and count every dot, even on a die face of four. That is fine at first. It breaks at level 3: a frame with one box empty looks full, so 9 and 8 gets read as 18. Most level-3 frames have their gaps scattered, not at the end, and the hint shades them.",
    practising: 'Subitizing: seeing a small amount at a glance, then seeing a larger amount as two known parts (5 and 3), and at level 3 making a ten: 7 and 9 is 10 and 6. The ten-frame is the bridge to place value.',
    ask: "Right after he taps a number, before Check: 'How do you know it is that many? Which two groups do you see?' If he says he counted, ask him to find the groups next time.",
    next: 'Lay 6 to 9 eggs in an egg tray, or rotis on a plate in two rows. Let him look for two seconds, cover them with a cloth, and ask how many and how he knew.',
    honest: 'The card stays on screen, so he can still count one by one and get every answer right. A correct round does not prove he saw it at a glance. Watch his finger and his eyes, not just the number he taps.',
    easier: 'Stay on level 1 and play with a real die: roll, say the number, then check by counting the pips.',
    harder: 'On level 3, ask him to say both parts before he taps: "Seven and nine. Move three across: ten and six."',
  },
};

export default howManyDoYouSee;
