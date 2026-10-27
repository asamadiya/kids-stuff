import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Slot, Tray } from '../../play/parts';

/**
 * Make a Ten — bonds to ten and bridging through ten.
 *
 * Concept (advisor, maths "put together, take apart"): to add 8 + 5, split the
 * 5 so that part of it completes the ten: 8 + 5 = 8 + 2 + 3 = 10 + 3. The
 * misconception it attacks is "the second number stays one lump" — a child
 * who counts on from 8, or who keeps the 5 as its own group, never sees 13
 * as one ten and three.
 *
 * The board is two ten-frames side by side. The first number is already in
 * the first frame (solid counters, filled from the top-left in the usual
 * order). The second number waits in the pile as loose counters (ringed).
 * He moves them into cells; the finished board reads 10 + 3 directly.
 *
 * Levels:
 *  1. Bonds to ten: the two numbers make exactly 10 (7 + 3, 6 + 4 ...). The
 *     second frame is there and empty, which is where a pile tends to go.
 *  2. Make ten first, to 20: 8 + 5, 9 + 6, 6 + 8 ... The pile is bigger than
 *     the gap, so it must be split between the frames.
 *  3. Two stretches, mixed. (a) Past any ten: the first number is two-digit,
 *     its tens drawn as rods beside the frame; filling the frame makes the
 *     NEXT ten. 38 + 5 = 40 + 3, and 96 + 7 = 100 + 3. (b) One place up: each
 *     cell holds a ten-rod and a full frame is 100. 70 + 40 = 100 + 10.
 *     Ten-rod rounds alone would be level 2's taps with bigger labels; the
 *     two-digit rounds are the real stretch for a 7-year-old.
 *
 * Control: tap-to-build only. Tap a loose counter to pick it up (it stays in
 * the hand while the pile lasts), then tap an empty cell to put one there.
 * Tapping a placed counter puts it back in the pile. Nothing is counted for
 * him until after Check.
 */

export interface Round {
  /** Counters (or ten-rods) already in the first frame: the first number's last digit. */
  readonly a: number;
  /** Loose counters (or ten-rods) in the pile: the second number. */
  readonly b: number;
  /** 1: each cell holds a one. 10: each cell holds a ten-rod. */
  readonly unit: 1 | 10;
  /** Full tens of the first number, drawn as rods beside the frames (unit 1 only). */
  readonly tens: number;
}

export interface Answer {
  /** Cells holding a counter he moved: 0-9 the first frame, 10-19 the second. */
  readonly cells: readonly number[];
  /** A counter from the pile is in his hand. */
  readonly picked: boolean;
}

type Stage = BoardProps<Round, Answer>['stage'];

/** Cells in one ten-frame. */
const CELLS = 10;

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  const k = index % 7;
  if (level === 1) {
    const [a, b] = [[7, 3], [6, 4], [8, 2], [5, 5], [9, 1], [4, 6], [3, 7]][k];
    return { a, b, unit: 1, tens: 0 };
  }
  if (level === 2) {
    const [a, b] = [[8, 5], [9, 6], [7, 5], [6, 8], [9, 4], [8, 7], [7, 7]][k];
    return { a, b, unit: 1, tens: 0 };
  }
  // [tens, a, b, unit]: past the next ten (38 + 5, 47 + 8, 96 + 7 crosses 100,
  // 59 + 8) alternating with ten-rods (70 + 40, 80 + 50, and 60 + 40 exactly 100).
  const [tens, a, b, unit] = (
    [[3, 8, 5, 1], [0, 7, 4, 10], [4, 7, 8, 1], [9, 6, 7, 1], [0, 8, 5, 10], [5, 9, 8, 1], [0, 6, 4, 10]] as const
  )[k];
  return { a, b, unit, tens };
}

/** The part of the second number that completes the first frame, and the rest. */
const split = (round: Round) => {
  const fill = Math.min(CELLS - round.a, round.b);
  return { fill, rest: round.b - fill };
};

/** The first number, the second, and what the board makes once the first frame is full. */
const values = (round: Round) => {
  const base = round.tens * 10;
  return { A: base + round.a * round.unit, B: round.b * round.unit, W: base + CELLS * round.unit };
};

const whole = (round: Round) => (round.unit === 1 ? 'ten' : 'hundred');

/** "8" for ones; "8 tens" for ten-rods — what a frame or the pile holds, read off the board. */
const say = (n: number, unit: 1 | 10) => (unit === 1 ? String(n) : `${n} ${n === 1 ? 'ten' : 'tens'}`);

function prompt(round: Round): string {
  const { A, B } = values(round);
  if (split(round).rest === 0) return `${A} + ${B}. Make a full ${whole(round)}.`;
  if (round.tens > 0) return `${A} + ${B}. Make the next ten first, then place the rest.`;
  return `${A} + ${B}. Make a ${whole(round)} first, then place the rest.`;
}

/** What the board holds for a given answer. */
function tally(round: Round, answer: Answer) {
  const inFirst = answer.cells.filter((c) => c < CELLS).length;
  return {
    first: round.a + inFirst,
    second: answer.cells.length - inFirst,
    loose: round.b - answer.cells.length,
  };
}

function check(round: Round, answer: Answer): Verdict {
  const { first, second, loose } = tally(round, answer);
  if (first === CELLS && loose === 0) return { ok: true };
  const u = round.unit;
  if (first < CELLS) {
    const gap = CELLS - first;
    const top = `First frame: ${say(first, u)}, with ${gap} empty ${gap === 1 ? 'cell' : 'cells'}.`;
    if (loose > 0) return { ok: false, hint: `${top} ${say(loose, u)} still in the pile.` };
    return { ok: false, hint: `${top} The second frame has ${say(second, u)}.` };
  }
  const full = u === 10 ? '10 tens, which is 100' : round.tens > 0 ? `10, and with the ${round.tens} tens that is ${values(round).W}` : '10';
  return { ok: false, hint: `First frame is full: ${full}. ${say(loose, u)} still in the pile.` };
}

function explain(round: Round): string {
  const { a, b, unit } = round;
  const { A, B, W } = values(round);
  const { fill, rest } = split(round);
  if (rest === 0 && unit === 1) {
    const one = b === 1;
    return `${A} and ${B} make 10: ${A} leaves ${B} empty ${one ? 'cell' : 'cells'} in the frame, and the ${B} ${one ? 'fills it' : 'fill them'}.`;
  }
  if (rest === 0) return `${A} + ${B} = 100: ${a} tens and ${b} tens make ten tens, and ten tens are one hundred.`;
  const F = fill * unit;
  const R = rest * unit;
  const made = round.tens > 0 ? `makes the next ten, ${W}` : `completes the ${whole(round)}`;
  return `${A} + ${B} = ${A} + ${F} + ${R} = ${W} + ${R} = ${W + R}. The ${B} splits into ${F} and ${R}; the ${F} ${made}.`;
}

/** A board with `inFirst` counters from the pile in the first frame's gap and `second` in the second frame. */
const build = (round: Round, inFirst: number, second: number): Answer => ({
  cells: [...Array.from({ length: inFirst }, (_, i) => round.a + i), ...Array.from({ length: second }, (_, i) => CELLS + i)],
  picked: false,
});

/** The finished board: the gap in the first frame filled, the rest from the second frame's first cell. */
export function solution(round: Round): Answer {
  const { fill, rest } = split(round);
  return build(round, fill, rest);
}

/**
 * Read-aloud: every hint `check` can give for this round. `check` reads only
 * how many counters sit in each frame, and the board lets him put any number
 * of the pile's counters into the first frame's gap and any number of the rest
 * into the second frame, so this walks every such pair.
 */
function hints(round: Round): readonly string[] {
  const out = new Set<string>();
  for (let inFirst = 0; inFirst <= Math.min(CELLS - round.a, round.b); inFirst += 1) {
    for (let second = 0; second <= Math.min(CELLS, round.b - inFirst); second += 1) {
      const { hint } = check(round, build(round, inFirst, second));
      if (hint) out.add(hint);
    }
  }
  return [...out];
}

// ------------------------------------------------------------------ drawing --

/** Place-value colours, the same as --ones/--tens in tokens.css, with a pale ground and a dark ink. */
const HUE = { 1: '#27813b', 10: '#1c6dd0' } as const;
const PALE = { 1: '#e1f2e4', 10: '#e2eefc' } as const;
const DEEP = { 1: '#1a5c2a', 10: '#0f4790' } as const;
const GOLD = '#d98e00';
/** --hundreds from tokens.css, and its dark ink; --ink for strokes. */
const RED = '#c8372d';
const RED_DEEP = '#8f2219';
const INK = '#24170f';
const TICKS = [6, 10, 14, 18, 22, 26, 30, 34, 38];

/**
 * What a cell shows. `given`: the first number, solid. `moved`: a counter he
 * brought from the pile, pale with a heavy ring, so 8 + 2 stays readable
 * inside the full frame. `worked`: the drawn solution, dashed. `gap`: an empty
 * cell of the first frame, ringed in gold on the hint. `target`: a faint copy
 * of the counter in his hand, drawn in every cell it could go to, so picking
 * one up visibly changes the frames.
 */
type Mark = 'given' | 'moved' | 'worked' | 'gap' | 'target';

/** One counter (a disc for a one, a rod of ten for a ten) in a 44-unit box. */
function Counter({ unit, mark }: { readonly unit: 1 | 10; readonly mark: Mark }) {
  const fill = mark === 'given' ? HUE[unit] : mark === 'gap' ? 'none' : PALE[unit];
  const stroke = mark === 'gap' ? GOLD : DEEP[unit];
  const dash = mark === 'worked' || mark === 'gap' ? '5 4' : undefined;
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" opacity={mark === 'target' ? 0.3 : undefined}>
      {unit === 1 ? (
        <circle cx="22" cy="22" r="17" fill={fill} stroke={stroke} strokeWidth="4" strokeDasharray={dash} />
      ) : (
        <g>
          <rect x="14" y="2" width="16" height="40" rx="2" fill={fill} stroke={stroke} strokeWidth="3" strokeDasharray={dash} />
          {mark === 'gap'
            ? null
            : TICKS.map((y) => (
                <line key={y} x1="14" x2="30" y1={y} y2={y} stroke={mark === 'given' ? '#ffffff' : stroke} strokeWidth="1.2" />
              ))}
        </g>
      )}
    </svg>
  );
}

const frameStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, auto)',
  gap: 6,
  padding: 10,
  border: '4px solid #24170f',
  borderRadius: 12,
  background: '#ffffff',
};

/** Ten tick marks splitting a rod of height `h` from `y` into ten equal parts. */
const tenParts = (x: number, y: number, w: number, h: number, stroke: string, width: number) =>
  Array.from({ length: 9 }, (_, k) => (
    <line key={k} x1={x} x2={x + w} y1={y + (h * (k + 1)) / 10} y2={y + (h * (k + 1)) / 10} stroke={stroke} strokeWidth={width} />
  ));

/**
 * The equivalence the whole game rests on, drawn and left on the board:
 * a full frame of ten loose ones beside the same ten tied into one rod (the
 * rod he sees beside the frame at level 3); or, a place up, a full frame of
 * ten rods beside the same ten rods pushed together into one hundred.
 */
function FullFrameIs({ unit }: { readonly unit: 1 | 10 }) {
  const cellW = unit === 1 ? 20 : 22;
  const cellH = unit === 1 ? 25 : 42;
  const fy = unit === 1 ? 20 : 8;
  const grid = (
    <g>
      <rect x="2" y={fy} width={cellW * 5} height={cellH * 2} rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
      {[1, 2, 3, 4].map((c) => (
        <line key={c} x1={2 + cellW * c} x2={2 + cellW * c} y1={fy} y2={fy + cellH * 2} stroke="#c9ad86" strokeWidth="1.5" />
      ))}
      <line x1="2" x2={2 + cellW * 5} y1={fy + cellH} y2={fy + cellH} stroke="#c9ad86" strokeWidth="1.5" />
    </g>
  );
  const equals = (x: number) => (
    <g stroke={INK} strokeWidth="4" strokeLinecap="round">
      <line x1={x} x2={x + 16} y1="39" y2="39" />
      <line x1={x} x2={x + 16} y1="51" y2="51" />
    </g>
  );
  const label = (x: number, y: number, text: string, fill: string) => (
    <text x={x} y={y} textAnchor="middle" fontSize="13" fontWeight="700" fill={fill}>
      {text}
    </text>
  );
  const cells = Array.from({ length: CELLS }, (_, i) => ({ c: i % 5, r: Math.floor(i / 5) }));

  if (unit === 1) {
    return (
      <svg viewBox="0 0 236 108" width="236" height="108" role="img" aria-label="A full frame of ten ones is the same as one ten-rod">
        {grid}
        {cells.map(({ c, r }) => (
          <circle key={`${c}${r}`} cx={2 + cellW * c + cellW / 2} cy={fy + cellH * r + cellH / 2} r="8" fill={HUE[1]} stroke={DEEP[1]} strokeWidth="2" />
        ))}
        {label(52, 90, '10 ones', DEEP[1])}
        {equals(110)}
        {/* The same ten, tied in a column: one disc in each tenth of the rod. */}
        <rect x="138" y="3" width="16" height="92" rx="4" fill={PALE[10]} stroke={HUE[10]} strokeWidth="3" />
        {Array.from({ length: CELLS }, (_, k) => (
          <circle key={k} cx="146" cy={3 + 4.6 + 9.2 * k} r="3.8" fill={HUE[1]} stroke={DEEP[1]} strokeWidth="1" />
        ))}
        {equals(166)}
        <rect x="196" y="3" width="16" height="92" rx="2" fill={HUE[10]} stroke={DEEP[10]} strokeWidth="2" />
        {tenParts(196, 3, 16, 92, '#ffffff', 1.2)}
        {label(204, 106, '1 ten', DEEP[10])}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 236 108" width="236" height="108" role="img" aria-label="A full frame of ten ten-rods is the same as one hundred">
      {grid}
      {cells.map(({ c, r }) => {
        const x = 2 + cellW * c + 7;
        const y = fy + cellH * r + 4;
        return (
          <g key={`${c}${r}`}>
            <rect x={x} y={y} width="8" height="34" rx="1" fill={HUE[10]} stroke={DEEP[10]} strokeWidth="1" />
            {tenParts(x, y, 8, 34, '#ffffff', 0.8)}
          </g>
        );
      })}
      {label(57, 106, '10 tens', DEEP[10])}
      {equals(120)}
      {/* The same ten rods pushed together and tied: one hundred. */}
      {Array.from({ length: CELLS }, (_, k) => (
        <g key={k}>
          <rect x={146 + 8.4 * k} y="4" width="8.4" height="84" fill={HUE[10]} stroke={DEEP[10]} strokeWidth="0.8" />
          {tenParts(146 + 8.4 * k, 4, 8.4, 84, '#ffffff', 0.8)}
        </g>
      ))}
      <rect x="146" y="4" width="84" height="84" fill="none" stroke={RED} strokeWidth="3.5" />
      {label(188, 106, '1 hundred', RED_DEEP)}
    </svg>
  );
}

const frameWrap: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s2)' };

const countStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--t-lg)',
  minHeight: '1.4em',
};

const sumStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--t-xl)',
  textAlign: 'center',
};

/** The board stops taking taps on 'worked' and 'solved', and draws its equation. */
const locks = (stage: Stage) => stage === 'worked' || stage === 'solved';

/** The line under the full-frame picture: what one counter (or rod) is, and what a full frame holds. */
function caption(round: Round): string {
  if (round.unit === 10) return 'Each rod is ten. A full frame holds 10 tens: 100.';
  return round.tens > 0 ? 'Each rod is ten. Each counter is one. A full frame holds 10.' : 'Each counter is one. A full frame holds 10.';
}

/** The board's equation, drawn on 'worked' and 'solved': 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13. */
function sentence(round: Round): string {
  const u = round.unit;
  const { A, B, W } = values(round);
  const { fill, rest } = split(round);
  if (rest === 0) return `${A} + ${B} = ${W}`;
  return `${A} + ${B} = ${A} + ${fill * u} + ${rest * u} = ${W} + ${rest * u} = ${W + rest * u}`;
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const { unit } = round;
  const locked = locks(stage);
  const worked = stage === 'worked';
  const counted = stage !== 'answering';
  // The worked answer is drawn ON the frames: the gap filled, the rest from the second frame's first cell.
  const shown = worked ? solution(round) : answer;
  const placed = new Set(shown.cells);
  const { first, second, loose } = tally(round, shown);
  const holding = !locked && answer.picked && loose > 0;
  const thing = unit === 1 ? 'counter' : 'ten-rod';

  const place = (cell: number) => {
    const cells = [...answer.cells, cell];
    setAnswer({ cells, picked: round.b - cells.length > 0 });
  };
  const putBack = (cell: number) => setAnswer({ cells: answer.cells.filter((c) => c !== cell), picked: answer.picked });

  const cellView = (cell: number) => {
    const frame = cell < CELLS ? 'First' : 'Second';
    const where = `${frame} frame, cell ${(cell % CELLS) + 1}`;
    if (cell < round.a) {
      return (
        <Slot key={cell} ariaLabel={`${where}: given ${thing}`} filled>
          <Counter unit={unit} mark="given" />
        </Slot>
      );
    }
    if (placed.has(cell)) {
      return (
        <Slot key={cell} ariaLabel={`${where}: take the ${thing} back`} filled onTap={locked ? undefined : () => putBack(cell)}>
          <Counter unit={unit} mark={worked ? 'worked' : 'moved'} />
        </Slot>
      );
    }
    // On the hint the first frame's gaps are ringed in gold; otherwise, while a
    // counter is in his hand, every empty cell shows a faint copy of it.
    const gap = stage === 'hint' && cell < CELLS;
    return (
      <Slot key={cell} ariaLabel={`${where}: empty${holding ? `, put the ${thing} here` : ''}`} ready={holding} onTap={holding ? () => place(cell) : undefined}>
        {gap ? (
          <Counter unit={unit} mark="gap" />
        ) : holding ? (
          <Counter unit={unit} mark="target" />
        ) : (
          <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true" />
        )}
      </Slot>
    );
  };

  const total = (n: number) => (unit === 1 ? String(n) : `${n} tens = ${n * 10}`);

  const frame = (start: number, label: string, n: number) => (
    <div style={frameWrap}>
      <div style={frameStyle} role="group" aria-label={label}>
        {Array.from({ length: CELLS }, (_, i) => cellView(start + i))}
      </div>
      <span style={{ ...countStyle, color: DEEP[unit] }}>{counted ? total(n) : ''}</span>
    </div>
  );

  // Level 3's two-digit first number: its full tens stand beside the first
  // frame as one tall rod each (ten segments), a gap after the fifth so 9 reads as 5 and 4.
  const rodX = (i: number) => 4 + i * 22 + (i >= 5 ? 10 : 0);
  const rods =
    round.tens > 0 ? (
      <div style={frameWrap}>
        <svg
          viewBox={`0 0 ${rodX(round.tens - 1) + 22} 150`}
          width={rodX(round.tens - 1) + 22}
          height="150"
          role="img"
          aria-label={`${round.tens} ten-rods: ${round.tens * 10}`}
        >
          {Array.from({ length: round.tens }, (_, i) => (
            <g key={i}>
              <rect x={rodX(i)} y="4" width="16" height="140" rx="2" fill={HUE[10]} stroke={DEEP[10]} strokeWidth="2" />
              {Array.from({ length: 9 }, (_, j) => (
                <line key={j} x1={rodX(i)} x2={rodX(i) + 16} y1={4 + 14 * (j + 1)} y2={4 + 14 * (j + 1)} stroke="#ffffff" strokeWidth="1.2" />
              ))}
            </g>
          ))}
        </svg>
        <span style={{ ...countStyle, color: DEEP[10] }}>{counted ? `${round.tens} tens = ${round.tens * 10}` : ''}</span>
      </div>
    ) : null;

  return (
    <div className="board">
      <div style={frameWrap}>
        <FullFrameIs unit={unit} />
        <p className="board-caption">{caption(round)}</p>
      </div>
      <div className="board-row" style={{ alignItems: 'flex-start', gap: 'var(--s5)' }}>
        {rods}
        {frame(0, 'First frame', first)}
        {frame(CELLS, 'Second frame', second)}
      </div>
      {locked ? <p style={{ ...sumStyle, color: DEEP[unit] }}>{sentence(round)}</p> : null}
      <Tray label={counted ? `Pile: ${total(loose)}` : 'Pile'}>
        {loose === 0 ? (
          <span className="board-caption">{locked ? 'All placed.' : 'The pile is empty.'}</span>
        ) : (
          Array.from({ length: loose }, (_, i) => (
            <Piece
              key={i}
              tone={holding && i === 0 ? 'picked' : 'source'}
              // Tapping the counter in his hand puts it down; tapping any other pile counter keeps one in hand.
              onTap={locked ? undefined : () => setAnswer({ cells: answer.cells, picked: !(holding && i === 0) })}
              ariaLabel={holding && i === 0 ? `Put the ${thing} down` : `Pick up a ${thing}`}
            >
              <Counter unit={unit} mark="moved" />
            </Piece>
          ))
        )}
      </Tray>
    </div>
  );
}

/**
 * Read-aloud: the caption under the full-frame picture, then, once the board
 * is locked, the equation it draws (on 'worked' that equation is the worked
 * answer). Left to the picture: the count tags, the pile's label, the pile's
 * "The pile is empty." / "All placed.", and the picture's "10 ones" / "1 ten".
 */
function board(round: Round, _level: Level, stage: Stage): readonly string[] {
  return locks(stage) ? [caption(round), sentence(round)] : [caption(round)];
}

export const makeATen: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'make-a-ten',
  title: 'Make a Ten',
  hook: 'Fill the ten, then the rest.',
  group: 'together',
  levels: ['Bonds to ten', 'Through ten', 'Through tens and hundreds'],
  generate,
  prompt,
  emptyAnswer: () => ({ cells: [], picked: false }),
  Board,
  check,
  hints,
  explain,
  board,
  cover: 'art/games/make-a-ten.png',
  note: {
    what: 'Two ten-frames. The first number already sits in the first frame (at level 3 its tens stand beside it as rods); the second number waits in a pile. He picks up a counter, taps a cell to place it, and finishes when the first frame is full and the pile is empty.',
    expect: 'At level 1 he will usually fill the gap by eye. At level 2 the pile is bigger than the gap, and a common first move is to start the second frame, leaving empty cells in the first. At level 3 he may count 7 rods and 4 rods as 11, or count every counter one by one past the rods instead of reading 38 as 3 tens and 8.',
    practising: 'Bonds to 10 (7 and 3, 6 and 4), and the make-a-ten strategy: split the second number so part of it completes the ten, so 8 + 5 becomes 10 + 3. At level 3, the same split past any ten (38 + 5 = 40 + 3, 96 + 7 = 100 + 3) and one place up (70 + 40 = 100 + 10).',
    ask: 'Before his first tap at level 2: "How many empty cells in the first frame? So how many from the pile go there?"',
    next: 'Draw two 2-by-5 grids on paper and use dried rajma beans. Put 8 in one grid, hand him 5, and ask him to fill the grid first and say the new sum out loud.',
    honest: 'Filling frames on screen does not show that he uses make-a-ten in his head. Ask 9 + 4 with nothing in front of him and listen: counting on from 9 is a different strategy from "9 and 1 is 10, and 3 more".',
    easier: 'Stay on level 1 and ask him to say the pair before he moves anything: "8 needs 2 to make 10."',
    harder: 'At level 2, cover the board and ask for the sum first; then build it to check. After level 3, ask 68 + 7 with no board and listen for "70, and 5 more".',
    safety: 'Dried rajma beans are a choking hazard for his 2-year-old sister: do the bean grids at a table she cannot reach and count the beans back into the tin.',
  },
};

export default makeATen;
