import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Slot, Tray } from '../../play/parts';

/**
 * Can You Make a Bigger Number? — whole numbers have no biggest.
 *
 * Concept (advisor catalogue, maths 20; content boundary: "Show infinity
 * through the possibility of adding one again, never as a final number to
 * reach"). Thatha, Amma's father, visiting from Chennai, names "the biggest
 * number". The child beats it with one of two moves, and the board shows the
 * move working, then working again:
 *
 *  - one:   make the number one more. The number line carries a +1 hop to the
 *           next mark, and after the answer two more hops: the next number
 *           has a next number too. The line ends in an arrow, not a wall.
 *  - digit: beat it using only 1 and 0 cards. No number made of 1s and 0s
 *           with Thatha's count of places is big enough (111 < 555, 11 = 11),
 *           so the only way is one more place. A place chart lines both
 *           numbers up and shows the extra place.
 *
 * The misconceptions it challenges: that a number like 99 or 999 is the end
 * (or that its next number is written 910, 9910); that big digits beat more
 * places; that a 0 in front makes a number bigger.
 *
 * Levels:
 *  1. Up to 20: one more of 9, 14, 19; beat 9 or 6 with 1s and 0s.
 *  2. Up to 1000: one more of 29, 99, 409, 999; beat 99, 555, 11.
 *  3. A hundred hundreds: one more of 4999, 9999 and of 10000 itself; beat
 *     1111, 5000, 9999 — the answer reaches 10000, a hundred hundreds.
 *     1111 is the point of the level: it is already the biggest four-place
 *     number of 1s and 0s, so the only way past it is a fifth place.
 *
 * Control: tap-to-add/remove only. Tapping a card in the tray puts it on the
 * end of his number; tapping a card in his number takes it off. The cards
 * take the place colours (ones green, tens blue, hundreds red, then the cycle
 * repeats, as Montessori materials do), so adding a card visibly moves every
 * card before it up one place.
 *
 * Every number is also drawn as blocks, so no amount is a bare numeral: each
 * digit in the place chart stands over that many blocks of its place (small
 * cube, rod of ten, flat of a hundred, then cube, long block, slab, ten times
 * bigger each step). Under the chart a fixed key shows each swap the round
 * needs: ten loose cubes beside the same ten joined into a rod, ten rods
 * beside the flat they make, and so on. Each card shows its digit over that
 * many dots in a ten-frame. The chart shows his number from the first tap.
 */

export type Move = 'one' | 'digit';

export interface Round {
  /** Thatha's "biggest number". */
  readonly start: number;
  /** one: build start + 1 exactly. digit: beat start with only 1 and 0 cards. */
  readonly move: Move;
}

/** The digit cards he has put down, left to right. */
export type Answer = readonly number[];

/** One more card than the longest answer (10001) needs; keeps the chart legible. */
const MAX_CARDS = 6;

const ALL_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const ONE_ZERO = [1, 0] as const;

/** Place names from the right. The chart never needs more than seven columns. */
const PLACE_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];

const A_HUNDRED_HUNDREDS = 10000;

const placesIn = (n: number) => String(n).length;
const placesWord = (n: number) => (n === 1 ? '1 place' : `${n} places`);
const written = (a: Answer) => a.join('');
/** The value the cards stand for, or null if there are none. A 0 in front adds nothing. */
const valueOf = (a: Answer): number | null => (a.length === 0 ? null : Number(written(a)));
const leadingZero = (a: Answer) => a.length > 1 && a[0] === 0;

/** How many 9s the number ends in: 409 → 1, 999 → 3, 410 → 0. */
export function trailingNines(n: number): number {
  let k = 0;
  for (let m = n; m % 10 === 9; m = Math.floor(m / 10)) k += 1;
  return k;
}

/** The answer the worked stage draws: start + 1, or a 1 with one 0 per place of Thatha's number. */
export function workedDigits(round: Round): number[] {
  const n = round.move === 'one' ? round.start + 1 : 10 ** placesIn(round.start);
  return String(n).split('').map(Number);
}

const one = (start: number): Round => ({ start, move: 'one' });
const digit = (start: number): Round => ({ start, move: 'digit' });

/**
 * Deterministic variety without Math.random: a table per level walked by
 * index. Every digit round's start is out of reach of 1s and 0s at its own
 * length (9 > 1, 555 > 111, 11 = 11, 1111 = 1111, 5000 > 1111), so the
 * extra place is forced rather than optional. Level 3 beats 1111, not 999:
 * 999 → 1000 is level 2's 555 → 1000 again, not a harder demand.
 */
const TABLE: Record<Level, readonly Round[]> = {
  1: [one(14), one(9), digit(9), one(19), one(17), digit(6), one(10)],
  2: [one(29), one(99), digit(99), one(409), digit(555), one(999), digit(11)],
  3: [one(9999), one(4999), digit(1111), one(A_HUNDRED_HUNDREDS), digit(9999), one(1909), digit(5000)],
};

export function generate(level: Level, index: number): Round {
  return TABLE[level][((index % 7) + 7) % 7];
}

/** Thatha's number, the question the game is about, then the move. Twelve words at most. */
function prompt(round: Round): string {
  const { start } = round;
  // The task in the title's own words. "Beat it" left him to work out that beat means bigger.
  if (round.move === 'digit') return `Thatha's number: ${start}. Make a bigger one with only 1s and 0s.`;
  if (start === A_HUNDRED_HUNDREDS) return `Thatha's number: ${start}, a hundred hundreds. Build one more than it.`;
  return `Thatha's number: ${start}. Is it the biggest? Build one more than it.`;
}

/**
 * What one more does to a number ending in 9s, as two sentences: each full
 * place turns to 0. None when the number does not end in 9.
 */
function rolloverSentences(start: number): string[] {
  const k = trailingNines(start);
  if (k === 0) return [];
  const full = PLACE_NAMES.slice(0, k);
  const names = k === 1 ? full[0] : `${full.slice(0, -1).join(', ')} and ${full[k - 1]}`;
  const digits = k === 1 ? `The ${names} digit is 9` : `The ${names} digits are all 9`;
  const them = k === 1 ? 'it' : 'them';
  const then = k === placesIn(start) ? `starts the ${PLACE_NAMES[k]} place` : `adds 1 to the ${PLACE_NAMES[k]}`;
  return [`${digits}.`, `One more turns ${them} to 0 and ${then}.`];
}

/** The roll-over sentences as the hint's tail: empty, or each sentence after a space. */
export function rollover(start: number): string {
  return rolloverSentences(start).map((s) => ` ${s}`).join('');
}

const NO_CARDS = 'No cards yet.';

/**
 * The one-more hint's sentences that name only Thatha's number. The sentence
 * naming his number ("Your cards say 15.") is the one left out of `hints`: the
 * line draws his pin, and his number can be any of a million.
 */
function oneLines(start: number) {
  return {
    next: `One more than ${start} is the next mark on the line.`,
    same: "That is Thatha's number.",
    before: `That comes before Thatha's ${start}.`,
    past: `That is past the next mark after ${start}.`,
  };
}

/**
 * One more: a fact about the line, which on 'hint' carries the +1 hop and his pin.
 * A 0 in front is named as adding nothing, never as the miss: 015 is 15.
 */
function hintOne(round: Round, answer: Answer): string {
  const { start } = round;
  const v = valueOf(answer);
  const t = oneLines(start);
  const roll = rollover(start);
  if (v === null) return `${NO_CARDS} ${t.next}${roll}`;
  const say = leadingZero(answer) ? `Your cards say ${written(answer)}, which is ${v}: a 0 in front adds nothing.` : `Your cards say ${v}.`;
  return `${say} ${v === start ? t.same : v < start ? t.before : t.past}${roll}`;
}

/** Make a bigger one, sentence by sentence: a fact about places, which on 'hint' the chart writes beside each row. */
function hintDigitSentences(round: Round, answer: Answer): string[] {
  const { start } = round;
  const q = placesIn(start);
  const v = valueOf(answer);
  if (v === null) return [NO_CARDS, `Thatha's ${start} has ${placesWord(q)}.`];
  const front = leadingZero(answer) ? [`A 0 in front adds no place: ${written(answer)} is ${v}.`] : [];
  if (v === start) return [...front, `Your ${v} is the same as Thatha's ${start}.`];
  const p = placesIn(v);
  if (p < q) return [...front, `Your ${v} has ${placesWord(p)}.`, `Thatha's ${start} has ${placesWord(q)}.`];
  return [...front, `Your ${v} and Thatha's ${start} both have ${placesWord(q)}.`, `${start} is bigger.`];
}

const hintDigit = (round: Round, answer: Answer) => hintDigitSentences(round, answer).join(' ');

/**
 * Judged by value, so every correct form passes: any 1-and-0 number past
 * Thatha's, in any order of its cards, and a number with a 0 in front (0111 is
 * 111, which is past 99). Rejecting 0111 against 99 while the hint said "it
 * is 111" would have contradicted itself.
 */
function check(round: Round, answer: Answer): Verdict {
  const v = valueOf(answer);
  if (round.move === 'one') {
    if (v === round.start + 1) return { ok: true };
    return { ok: false, hint: hintOne(round, answer) };
  }
  if (v !== null && v > round.start) return { ok: true };
  return { ok: false, hint: hintDigit(round, answer) };
}

/** Every answer a tray of `cards` can make: no cards up to MAX_CARDS, any card in any place. */
function answersFrom(cards: readonly number[]): Answer[] {
  const out: Answer[] = [];
  let layer: Answer[] = [[]];
  for (let n = 0; n <= MAX_CARDS; n += 1) {
    out.push(...layer);
    layer = layer.flatMap((a) => cards.map((d) => [...a, d]));
  }
  return out;
}

/**
 * Every hint sentence a Check can show this round. Place-move rounds: all of
 * them, from every row of 1s and 0s the tray can make (127 rows). One-more
 * rounds: the sentences that name only Thatha's number. The sentence that
 * names his ("Your cards say 15.") has a million forms, and on 'hint' the line
 * already draws his pin.
 */
function hints(round: Round): string[] {
  if (round.move === 'one') {
    const t = oneLines(round.start);
    return [NO_CARDS, t.next, t.same, t.before, t.past, ...rolloverSentences(round.start)];
  }
  const out = new Set<string>();
  for (const a of answersFrom(ONE_ZERO)) if (!check(round, a).ok) for (const s of hintDigitSentences(round, a)) out.add(s);
  return [...out];
}

function explain(round: Round): string {
  const { start } = round;
  if (round.move === 'one') {
    const n = start + 1;
    const grew = placesIn(n) > placesIn(start) ? `, which needs one more place` : '';
    return `${start} + 1 = ${n}${grew}. And ${n} + 1 = ${n + 1}: adding one always works again, so no number is the biggest.`;
  }
  const q = placesIn(start);
  const w = workedDigits(round).join('');
  return `With 1s and 0s, ${placesWord(q)} ${q === 1 ? 'makes' : 'make'} at most ${'1'.repeat(q)}. One more place makes ${w}, past ${start}. Another place makes ${w}0, bigger again: there is no biggest number.`;
}

// ------------------------------------------------------------------ drawing --

type Stage = BoardProps<Round, Answer>['stage'];

/** Place colours by position from the right, cycling as Montessori materials do. */
const HUES = ['ones', 'tens', 'hundreds'] as const;
const TINT = ['#e1f2e4', '#e2eefc', '#fbe4e0'];
/** Text on the tint and on white, at least 4.5:1. */
const DEEP = ['#1a5c2a', '#0f4790', '#8f2219'];
const INK = '#24170f';
const INK_SOFT = '#5a4636';
const GOLD = '#f2a900';
const DISPLAY = { fontFamily: 'var(--font-display)', fontWeight: 700 } as const;
/** Block fills by place, cycling like the cards. */
const FILL = ['var(--ones)', 'var(--tens)', 'var(--hundreds)'];
/** One block of each place, for the key's spoken labels. */
const UNIT_NAMES = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand', 'million'];
const fillOf = (p: number) => FILL[p % 3];
/** The nine lines that split a length into ten equal parts. */
const tenths = (len: number) => Array.from({ length: 9 }, (_, k) => ((k + 1) * len) / 10);

/** A polygon in a place colour, lit (+) or shaded (−) by an overlay, then outlined. */
function Face({ points, fill, shade = 0, sw = 1 }: { readonly points: string; readonly fill: string; readonly shade?: number; readonly sw?: number }) {
  return (
    <>
      <polygon points={points} fill={fill} />
      {shade !== 0 ? <polygon points={points} fill={shade > 0 ? '#ffffff' : '#000000'} fillOpacity={Math.abs(shade)} /> : null}
      <polygon points={points} fill="none" stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
    </>
  );
}

/**
 * A box in cabinet projection: front w × h, d deep. `split` draws the nine
 * lines where ten smaller blocks meet on the front face.
 */
function Box({ x, y, w, h, d, fill, sw = 1, split }: {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly d: number;
  readonly fill: string;
  readonly sw?: number;
  readonly split?: 'h' | 'v';
}) {
  const top = `${x},${y} ${x + w},${y} ${x + w + d},${y - d} ${x + d},${y - d}`;
  const side = `${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y + h - d} ${x + w},${y + h}`;
  const front = `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`;
  return (
    <g>
      <Face points={top} fill={fill} shade={0.4} sw={sw} />
      <Face points={side} fill={fill} shade={-0.25} sw={sw} />
      <Face points={front} fill={fill} sw={sw} />
      {split === 'h' ? tenths(h).map((t) => <line key={t} x1={x} x2={x + w} y1={y + t} y2={y + t} stroke={INK} strokeWidth={sw * 0.6} />) : null}
      {split === 'v' ? tenths(w).map((t) => <line key={t} x1={x + t} x2={x + t} y1={y} y2={y + h} stroke={INK} strokeWidth={sw * 0.6} />) : null}
    </g>
  );
}

/**
 * One block of place p in an 18-unit tile. Each is ten of the one before,
 * joined the way the key joins them: a cube; a rod (ten cubes in a row); a
 * flat (ten rods, one above another); a big cube (ten flats, front to back);
 * a long block (ten big cubes in a row); a slab (ten long blocks, one above
 * another); a giant cube (ten slabs, front to back).
 */
function Block({ p }: { readonly p: number }) {
  const fill = fillOf(p);
  if (p === 0) return <rect x="5" y="5" width="8" height="8" fill={fill} stroke={INK} strokeWidth="1" />;
  if (p === 1) {
    return (
      <g>
        <rect x="0.5" y="6.5" width="17" height="5" fill={fill} stroke={INK} strokeWidth="1" />
        {tenths(17).map((t) => <line key={t} x1={0.5 + t} x2={0.5 + t} y1="6.5" y2="11.5" stroke={INK} strokeWidth="0.5" />)}
      </g>
    );
  }
  if (p === 2) {
    return (
      <g>
        <rect x="0.5" y="0.5" width="17" height="17" fill={fill} stroke={INK} strokeWidth="1" />
        {tenths(17).map((t) => <line key={t} x1="0.5" x2="17.5" y1={0.5 + t} y2={0.5 + t} stroke={INK} strokeWidth="0.5" />)}
      </g>
    );
  }
  if (p === 3) return <Box x={0.5} y={5} w={12.5} h={12.5} d={4.5} fill={fill} />;
  if (p === 4) return <Box x={0.5} y={9} w={14} h={5} d={3} fill={fill} split="v" />;
  if (p === 5) return <Box x={0.5} y={3} w={14.5} h={14.5} d={2.5} fill={fill} split="h" />;
  return <Box x={0.5} y={5} w={12.5} h={12.5} d={4.5} fill={fill} sw={2} />;
}

/** Each block's drawn extent in its tile, [x0, y0, x1, y1], for the places a swap starts from (10001 needs four). */
const EXTENT: readonly (readonly [number, number, number, number])[] = [
  [5, 5, 13, 13],
  [0.5, 6.5, 17.5, 11.5],
  [0.5, 0.5, 17.5, 17.5],
  [0.5, 0.5, 17.5, 17.5],
];

/**
 * How ten blocks of place p sit when joined: the step from one to the next,
 * and whether to draw the last one first (a stack drawn back to front, so the
 * front block covers the ones behind it).
 */
const JOIN: readonly { readonly dx: number; readonly dy: number; readonly backFirst: boolean }[] = [
  { dx: 8, dy: 0, backFirst: false },
  { dx: 0, dy: 5, backFirst: false },
  { dx: 1.6, dy: -1.6, backFirst: true },
  { dx: 12.5, dy: 0, backFirst: false },
];

const TILE = 18;
const LOOSE_W = 10 * (TILE + 2) + 8;

/**
 * One swap, drawn: ten loose blocks of place p (five and five), the same ten
 * joined and tied with a gold band, and the one block of the next place that
 * the chart uses for them.
 */
function Swap({ p }: { readonly p: number }) {
  const [x0, y0, x1, y1] = EXTENT[p];
  const { dx, dy, backFirst } = JOIN[p];
  const tied = [x0 + Math.min(0, 9 * dx), y0 + Math.min(0, 9 * dy), x1 + Math.max(0, 9 * dx), y1 + Math.max(0, 9 * dy)];
  const tiedW = tied[2] - tied[0];
  const tiedH = tied[3] - tied[1];
  const H = Math.max(TILE, tiedH) + 12;
  const mid = H / 2;
  const tileY = mid - TILE / 2;
  const tx = LOOSE_W + 34 - tied[0];
  const ty = mid - tiedH / 2 - tied[1];
  const eq2 = LOOSE_W + 34 + tiedW + 16;
  const W = eq2 + 34 + TILE + 2;
  const order = Array.from({ length: 10 }, (_, i) => (backFirst ? 9 - i : i));
  const eq = (x: number) => (
    <text x={x} y={mid + 7} textAnchor="middle" fontSize="20" fill={INK} style={DISPLAY}>
      =
    </text>
  );
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * ZOOM}
      height={H * ZOOM}
      style={{ width: W * ZOOM, height: 'auto', maxWidth: '100%' }}
      role="img"
      aria-label={`Ten ${UNIT_NAMES[p]}s, the same ten ${UNIT_NAMES[p]}s joined, make one ${UNIT_NAMES[p + 1]}.`}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i} transform={`translate(${i * (TILE + 2) + (i >= 5 ? 8 : 0)} ${tileY})`}>
          <Block p={p} />
        </g>
      ))}
      {eq(LOOSE_W + 14)}
      <g transform={`translate(${tx} ${ty})`}>
        {order.map((i) => (
          <g key={i} transform={`translate(${i * dx} ${i * dy})`}>
            <Block p={p} />
          </g>
        ))}
        <rect x={tied[0] - 3} y={tied[1] - 3} width={tiedW + 6} height={tiedH + 6} rx="4" fill="none" stroke={GOLD} strokeWidth="3" />
      </g>
      {eq(eq2 + 14)}
      <g transform={`translate(${eq2 + 32} ${tileY})`}>
        <Block p={p + 1} />
      </g>
    </svg>
  );
}

/** The swaps this round's numbers use, ones up, permanently on the board. */
function SwapKey({ swaps }: { readonly swaps: number }) {
  if (swaps <= 0) return null;
  return (
    <div
      role="group"
      aria-label="Ten of a block make one of the next block"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 8, background: '#ffffff', borderRadius: 14, border: '2px solid #ead9bf', overflowX: 'auto' }}
    >
      {Array.from({ length: swaps }, (_, p) => (
        <Swap key={p} p={p} />
      ))}
    </div>
  );
}

/** n dots in a ten-frame (five and five): how many a digit card counts. */
function Dots({ n }: { readonly n: number }) {
  return (
    <svg viewBox="0 0 52 22" width={52} height={22} style={{ width: 52, height: 22 }} aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => {
        const cx = 6 + (i % 5) * 10;
        const cy = 6 + Math.floor(i / 5) * 10;
        return i < n ? (
          <circle key={i} cx={cx} cy={cy} r="4" fill="currentColor" />
        ) : (
          <circle key={i} cx={cx} cy={cy} r="3.2" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
        );
      })}
    </svg>
  );
}

/** A digit card's face: the digit, and under it that many dots. */
function CardFace({ d }: { readonly d: number }) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 30, lineHeight: 1, ...DISPLAY }}>{d}</span>
      <Dots n={d} />
    </span>
  );
}

const PILE = 60;
/** Drawn size of a pile and the key: 1.4 × their viewBox, so a ones cube is 11 px. */
const ZOOM = 1.4;
const PILE_PX = PILE * ZOOM;

/** n blocks of place p, three to a row: what a digit in that place is worth. A 0 is no blocks. */
function Pile({ n, p }: { readonly n: number; readonly p: number }) {
  return (
    <svg viewBox={`0 0 ${PILE} ${PILE}`} width={PILE_PX} height={PILE_PX} style={{ width: PILE_PX, height: PILE_PX }} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(${(i % 3) * 20 + 1 + (3 - Math.min(3, n - (i - (i % 3)))) * 10} ${Math.floor(i / 3) * 20 + 1})`}>
          <Block p={p} />
        </g>
      ))}
    </svg>
  );
}

/** The place (0 = ones) of the card at index i in a row of `len` cards. */
const placeOf = (i: number, len: number) => len - 1 - i;
const hueOf = (i: number, len: number) => HUES[placeOf(i, len) % 3];

/**
 * One-more rounds: a number line around Thatha's number. The marks after it
 * carry no numbers until the worked answer, so the line shows WHERE one more
 * is without writing it. It ends in an arrow, never a wall.
 */
function NumberLine({ round, answer, stage }: { readonly round: Round; readonly answer: Answer; readonly stage: Stage }) {
  const s = round.start;
  const first = s - 2;
  const marks = [s - 2, s - 1, s, s + 1, s + 2, s + 3];
  const Y = 132;
  const x = (n: number) => 110 + (n - first) * 140;
  const reveal = stage === 'worked' || stage === 'solved';
  const hop = stage !== 'answering';
  const v = stage === 'hint' ? valueOf(answer) : null;
  const inView = v !== null && v >= first && v <= s + 3;
  const hops = reveal ? [s, s + 1, s + 2] : hop ? [s] : [];
  const arc = (from: number, to: number, dashed = false) => {
    const a = x(from);
    const b = to;
    const m = (a + b) / 2;
    return (
      <g key={`hop${from}`}>
        <path d={`M${a + 6} ${Y - 16} Q${m} ${Y - 96} ${b - 6} ${Y - 16}`} fill="none" stroke={GOLD} strokeWidth="5" strokeDasharray={dashed ? '10 8' : undefined} />
        <path d={`M${b - 20} ${Y - 30} L${b - 6} ${Y - 16} L${b - 26} ${Y - 14} Z`} fill={GOLD} stroke={INK} strokeWidth="1.5" />
        <text x={m} y={Y - 66} textAnchor="middle" fontSize="26" fill={INK} style={DISPLAY}>
          +1
        </text>
      </g>
    );
  };
  const label =
    reveal ? `A number line. Thatha's ${s}, then ${s + 1}, ${s + 2}, ${s + 3}, and an arrow: it keeps going.`
    : `A number line with Thatha's ${s} marked. The marks after it are not numbered yet.`;
  return (
    <svg className="board-svg" viewBox="0 0 960 250" role="img" aria-label={label}>
      <line x1="30" y1={Y} x2="900" y2={Y} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d={`M896 ${Y - 18} L934 ${Y} L896 ${Y + 18} Z`} fill={INK} />
      {marks.map((n) => {
        const named = n <= s || reveal;
        const isStart = n === s;
        const next = n === s + 1;
        return (
          <g key={n}>
            {isStart ? <circle cx={x(n)} cy={Y} r="15" fill={GOLD} stroke={INK} strokeWidth="3" /> : null}
            {next && stage === 'hint' ? <circle cx={x(n)} cy={Y} r="20" fill="none" stroke={GOLD} strokeWidth="5" /> : null}
            <line x1={x(n)} y1={Y - 16} x2={x(n)} y2={Y + 16} stroke={INK} strokeWidth="4" />
            {named ? (
              <text x={x(n)} y={Y + 52} textAnchor="middle" fontSize={isStart ? 32 : 28} fill={isStart ? INK : n > s ? DEEP[1] : INK_SOFT} style={DISPLAY}>
                {n}
              </text>
            ) : (
              <rect x={x(n) - 30} y={Y + 26} width="60" height="34" rx="8" fill="none" stroke={INK_SOFT} strokeWidth="2" strokeDasharray="6 5" />
            )}
          </g>
        );
      })}
      {hops.map((n) => arc(n, x(n + 1)))}
      {reveal ? arc(s + 3, 900, true) : null}
      <text x={x(s)} y={Y + 82} textAnchor="middle" fontSize="18" fill={INK_SOFT} style={DISPLAY}>
        {v === s ? "Thatha's and yours" : "Thatha's"}
      </text>
      {v !== null && inView && v !== s ? (
        <g>
          <path d={`M${x(v)} ${Y + 66} l-12 18 h24 z`} fill={DEEP[0]} />
          <text x={x(v)} y={Y + 104} textAnchor="middle" fontSize="20" fill={DEEP[0]} style={DISPLAY}>
            your {v}
          </text>
        </g>
      ) : null}
      {v !== null && !inView ? (
        <text x={v > s ? 930 : 30} y={Y + 100} textAnchor={v > s ? 'end' : 'start'} fontSize="20" fill={DEEP[0]} style={DISPLAY}>
          {v > s ? `your ${v} is further on →` : `← your ${v} is further back`}
        </text>
      ) : null}
    </svg>
  );
}

/** One digit in a place box, in that place's colour. */
function Cell({ d, place, faded, worked, ring }: { readonly d: string; readonly place: number; readonly faded?: boolean; readonly worked?: boolean; readonly ring?: boolean }) {
  const c = place % 3;
  return (
    <span
      style={{
        display: 'grid',
        placeItems: 'center',
        width: 56,
        height: 56,
        borderRadius: 10,
        border: `3px ${worked ? 'dashed' : 'solid'} ${DEEP[c]}`,
        background: faded ? '#ffffff' : TINT[c],
        color: DEEP[c],
        opacity: faded ? 0.45 : 1,
        textDecoration: faded ? 'line-through' : undefined,
        outline: ring ? `4px solid ${GOLD}` : undefined,
        outlineOffset: 2,
        fontSize: 34,
        lineHeight: 1,
        ...DISPLAY,
      }}
    >
      {d}
    </span>
  );
}

interface ChartRow {
  readonly name: string;
  readonly digits: readonly number[];
  readonly worked?: boolean;
  /** Draw the row's leading zeros faded: they are not written. */
  readonly fadeLead?: boolean;
  /** Write "3 places" at the end of the row. */
  readonly count?: boolean;
  /** Ring this many digits on the right: the ones one more changes. */
  readonly ring?: number;
}

/**
 * A place chart. Columns are places, ones on the right, so Thatha's number and
 * his line up digit under digit and an extra place stands out as a box with
 * nothing above it. Under every digit sit that many blocks of its place, so
 * 555 against 111 is five flats against one before it is a numeral.
 */
function PlaceChart({ rows, cols }: { readonly rows: readonly ChartRow[]; readonly cols: number }) {
  const grid = { display: 'grid', gridTemplateColumns: `minmax(5.5em, auto) repeat(${cols}, ${PILE_PX + 4}px) minmax(5em, auto)`, gap: 8, alignItems: 'center', justifyContent: 'center' } as const;
  const places = Array.from({ length: cols }, (_, i) => cols - 1 - i);
  const column = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 } as const;
  return (
    <div role="table" aria-label="Place chart" style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowX: 'auto', padding: 8, background: '#ffffff', borderRadius: 14, border: '2px solid #ead9bf' }}>
      <div role="row" style={grid}>
        <span role="columnheader" />
        {places.map((p) => (
          <span key={p} role="columnheader" style={{ fontSize: 13, lineHeight: 1.1, textAlign: 'center', color: DEEP[p % 3], fontWeight: 600 }}>
            {PLACE_NAMES[p]}
          </span>
        ))}
        <span role="columnheader" />
      </div>
      {rows.map((r) => {
        const lead = r.fadeLead ? r.digits.findIndex((d) => d !== 0) : 0;
        const firstWritten = lead === -1 ? r.digits.length - 1 : lead;
        const shown = r.digits.length - firstWritten;
        return (
          <div key={r.name} role="row" style={grid}>
            <span role="rowheader" style={{ fontSize: 18, color: INK, textAlign: 'right', ...DISPLAY }}>
              {r.name}
            </span>
            {places.map((p) => {
              const i = r.digits.length - 1 - p;
              if (i < 0) {
                return (
                  <span key={p} role="cell" style={column}>
                    <span style={{ width: 56, height: 56, borderRadius: 10, border: '2px dashed #c9ad86' }} />
                    <span style={{ width: PILE_PX, height: PILE_PX }} />
                  </span>
                );
              }
              const d = r.digits[i];
              return (
                <span key={p} role="cell" style={column} aria-label={`${d} ${PLACE_NAMES[p]}`}>
                  <Cell d={String(d)} place={p} worked={r.worked} faded={r.fadeLead && i < firstWritten} ring={p < (r.ring ?? 0)} />
                  <Pile n={d} p={p} />
                </span>
              );
            })}
            <span role="cell" style={{ fontSize: 16, color: INK_SOFT, fontWeight: 600 }}>
              {r.count && r.digits.length > 0 ? placesWord(shown) : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const digitsOf = (n: number) => String(n).split('').map(Number);

/** Rows the place chart shows at each stage. */
function chartRows(round: Round, answer: Answer, stage: Stage): { readonly rows: readonly ChartRow[]; readonly cols: number } {
  const s = digitsOf(round.start);
  const q = s.length;
  const thatha: ChartRow = { name: "Thatha's", digits: s, count: stage !== 'answering' };
  const yours: ChartRow = { name: 'Yours', digits: answer, fadeLead: true, count: stage !== 'answering' };
  const widest = (rows: readonly ChartRow[]) => ({ rows, cols: Math.max(...rows.map((r) => r.digits.length)) });
  // While he builds, the chart is Thatha's blocks over his: every tap shows up as blocks at once.
  if (stage === 'answering') return widest([thatha, yours]);
  if (round.move === 'one') {
    // The hint rings the 9s the sentence names; the answer rings every digit one more changed.
    const k = trailingNines(round.start);
    if (stage === 'hint') return widest([{ ...thatha, ring: k }, yours]);
    const next = digitsOf(round.start + 1);
    const changed = k === 0 ? 1 : k + 1;
    return widest([
      { ...thatha, ring: Math.min(changed, q) },
      { name: 'One more', digits: next, worked: stage === 'worked', count: true, ring: Math.min(changed, next.length) },
    ]);
  }
  if (stage === 'worked') {
    const w = workedDigits(round);
    return widest([thatha, { name: 'One more place', digits: w, worked: true, count: true }, { name: 'Again', digits: [...w, 0], worked: true, count: true }]);
  }
  // "Again" is his number with one more place: built from its value, so a 0 he put in front is not drawn as a place.
  if (stage === 'solved') return widest([thatha, yours, { name: 'Again', digits: digitsOf((valueOf(answer) ?? 0) * 10), worked: true, count: true }]);
  if (stage === 'hint') return widest([thatha, { name: 'All 1s', digits: Array<number>(q).fill(1), count: true }, yours]);
  return widest([thatha, yours]);
}

/** The swaps the key draws: enough to explain every block in the round's answer. */
const swapsFor = (round: Round) => placesIn(round.move === 'one' ? round.start + 1 : 10 ** placesIn(round.start)) - 1;

/** Over the cards: his number, or on 'worked' the answer drawn for him. */
const slotCaption = (stage: Stage) => (stage === 'worked' ? 'The answer' : 'Your number');
const trayLabel = (round: Round) => (round.move === 'one' ? 'Digit cards' : 'Only 1s and 0s');

/**
 * Read the board: the place chart's row names (what each row of blocks is,
 * and on 'hint' and 'worked' the rows that carry the hint and the answer), the
 * caption over the cards, and the tray's label, in screen order. Row names do
 * not depend on his cards, so the empty answer gives them. Left out: place
 * names over the columns, "3 places" counts, the number line's tags (on 'hint'
 * "Thatha's" becomes "Thatha's and yours" and his pin is labelled with his
 * number), and "tap a card", which goes once a card is down.
 */
function board(round: Round, _level: Level, stage: Stage): string[] {
  return [...chartRows(round, [], stage).rows.map((r) => r.name), slotCaption(stage), trayLabel(round)];
}

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'worked' || stage === 'solved';
  const worked = stage === 'worked' ? workedDigits(round) : null;
  const shown = worked ?? answer;
  const full = answer.length >= MAX_CARDS;
  const cards = round.move === 'one' ? ALL_DIGITS : ONE_ZERO;
  const chart = chartRows(round, answer, stage);
  const caption = slotCaption(stage);
  return (
    <div className="board">
      {round.move === 'one' ? <NumberLine round={round} answer={answer} stage={stage} /> : null}
      <PlaceChart rows={chart.rows} cols={chart.cols} />
      <SwapKey swaps={swapsFor(round)} />
      <p className="board-caption">{caption}</p>
      <Slot ariaLabel={`${caption}: ${shown.length ? written(shown) : 'no cards yet'}`} filled={shown.length > 0} wide>
        {shown.map((d, i) => (
          <Piece
            key={`${i}-${d}`}
            hue={hueOf(i, shown.length)}
            tone={worked ? 'worked' : 'placed'}
            onTap={locked ? undefined : () => setAnswer(answer.filter((_, j) => j !== i))}
            ariaLabel={worked ? `${d}, ${PLACE_NAMES[placeOf(i, shown.length)]} place` : `Take off the ${d}`}
          >
            <CardFace d={d} />
          </Piece>
        ))}
        {shown.length === 0 ? <span className="board-caption">tap a card</span> : null}
      </Slot>
      <Tray label={trayLabel(round)}>
        {cards.map((d) => (
          <Piece
            key={d}
            tone={full ? 'ghost' : 'source'}
            onTap={locked || full ? undefined : () => setAnswer([...answer, d])}
            ariaLabel={`Put a ${d} on the end`}
          >
            <CardFace d={d} />
          </Piece>
        ))}
      </Tray>
    </div>
  );
}

export const canYouMakeABiggerNumber: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'can-you-make-a-bigger-number',
  title: 'Can You Make a Bigger Number?',
  hook: "Beat Thatha's biggest number. Again.",
  group: 'numbers',
  levels: ['Up to twenty', 'Up to a thousand', 'A hundred hundreds'],
  generate,
  prompt,
  emptyAnswer: () => [],
  Board,
  board,
  check,
  hints,
  explain,
  cover: 'art/games/can-you-make-a-bigger-number.png',
  note: {
    what: "Thatha, Amma's father, names a 'biggest number', the way a grandfather teases at the table, and the child has to beat it. He taps digit cards to build one more than it, or beats it using only 1 and 0 cards, which forces an extra place. The board then shows the same move working again.",
    expect: "One more than 14 is quick. The roll-over numbers are where it breaks: one more than 99 often comes out as 'ninety-ten' and gets built 910. The hint rings the 9s and says each turns to 0. Against 555 with only 1s and 0s, the first try is usually 111; the all-1s row shows three places are never enough.",
    practising: "The successor idea: every whole number has a next one, so there is no biggest. Also place value at the roll-over (9 to 10, 999 to 1000, 9999 to 10000), and comparing numbers first by how many places they have.",
    ask: "After a round is solved: 'Is there a number so big that nobody can make one more? What would you do to it?' Listen for the move, not a word like 'infinity'. Amma or Thatha can name the move in Tamil: 'Innum onnu' (one more).",
    next: "On scrap paper, let him write the biggest number he can. You write one more beside it, or put a 0 on the end. Swap roles. Then line up dried beans: however long the row, one more bean always fits at the end.",
    honest: "Building one more each time does not show that he understands infinity, or can count past 100 in order. It shows he can make a move that always works. Ask 'is there a biggest number?' on another day, away from the screen, and listen for the reason.",
    easier: "Stay on level 1. Say the number words together before he taps ('fourteen, fifteen') and point to the next mark on the line.",
    harder: "On level 3, before any card goes down, ask how many places the answer will need and why. Then ask what one more than 10001 is, and one more than that.",
    safety: "Dried beans are a choking hazard for his 2-year-old sister: line them up at a table she cannot reach, and count them back into the tin afterwards.",
  },
};

export default canYouMakeABiggerNumber;
