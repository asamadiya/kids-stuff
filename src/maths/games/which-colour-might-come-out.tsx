import type { CSSProperties, ReactNode } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Choice } from '../../play/parts';

/**
 * Which Colour Might Come Out? — maths game 12 (advisor catalogue).
 *
 * Concept: likely outcomes are not guaranteed. A cloth bag (a potli) of red
 * and blue marbles, drawn with everything inside showing and well mixed. One
 * marble comes out without looking, and is always put back.
 *
 * Levels:
 *  1. Which colour is more likely: red, blue, or the same chance? Bags of 8,
 *     starting from the advisor's 6 red and 2 blue; one bag is 4 and 4.
 *  2. Name the chance of one colour: impossible, unlikely, likely, certain.
 *     The breaks: "likely" said as "certain", and a colour that is not in the
 *     bag at all (green) still treated as possible.
 *  3. Ten draws, each put back. Which tally is most likely? Bags of 10 and of
 *     5 (ten draws is two fives). Mixed in: a run of one colour, then "which
 *     is likelier next?" — the bag has not changed, so nothing is "due".
 *
 * Control: tap-to-choose only. Every answer button is a picture (the bag
 * with the guessed marble coming out; a bag of four for a chance word; a
 * ten-frame for a tally), its word small underneath, and the tapped picture
 * appears on the board at once: in the dashed spot, on the chance line, or in
 * the ten-frame.
 */

export type Colour = 'red' | 'blue' | 'green';

export interface Bag {
  readonly red: number;
  readonly blue: number;
}

export type Round =
  /** Level 1: which colour is more likely? */
  | { readonly kind: 'compare'; readonly bag: Bag }
  /** Level 2: how likely is this colour? */
  | { readonly kind: 'word'; readonly bag: Bag; readonly ask: Colour }
  /** Level 3: `run` marbles of one colour came out, each put back. Which next? */
  | { readonly kind: 'streak'; readonly bag: Bag; readonly drawn: 'red' | 'blue'; readonly run: number }
  /** Level 3: which tally of ten draws is most likely? Options are red counts out of 10. */
  | { readonly kind: 'tally'; readonly bag: Bag; readonly options: readonly number[] };

/** The id of the tapped choice, or nothing yet. */
export type Answer = string | null;

export type ChanceWord = 'impossible' | 'unlikely' | 'likely' | 'certain';
/** In the order of the chance line, from cannot happen to must happen. */
export const WORDS: readonly ChanceWord[] = ['impossible', 'unlikely', 'likely', 'certain'];

/** How many of four marbles each chance word is drawn as: none, one, most, all. */
const OF_FOUR: Record<ChanceWord, number> = { impossible: 0, unlikely: 1, likely: 3, certain: 4 };

const bag = (red: number, blue: number): Bag => ({ red, blue });
const size = (b: Bag) => b.red + b.blue;
const countOf = (b: Bag, c: Colour) => (c === 'red' ? b.red : c === 'blue' ? b.blue : 0);

const L1: readonly Bag[] = [bag(6, 2), bag(2, 6), bag(5, 3), bag(4, 4), bag(7, 1), bag(3, 5), bag(1, 7)];

const L2: ReadonlyArray<readonly [Bag, Colour]> = [
  [bag(6, 2), 'blue'], // unlikely
  [bag(6, 2), 'red'], // likely
  [bag(0, 8), 'blue'], // certain
  [bag(6, 2), 'green'], // impossible
  [bag(1, 7), 'red'], // unlikely
  [bag(8, 0), 'blue'], // impossible
  [bag(7, 1), 'red'], // likely
  [bag(8, 0), 'red'], // certain
];

/*
 * Level 3 tallies. Each set of options holds the right tally and the usual
 * slips: every draw the likelier colour ("likely means always"), five and
 * five ("it's chance, so half"), the colours swapped, or — for a bag of 5 —
 * the bag's own red count copied as a tally of ten. Two of the first five
 * rounds are bags of 5, so scaling to ten is asked twice, not once.
 */
const L3: readonly Round[] = [
  { kind: 'tally', bag: bag(8, 2), options: [2, 5, 8, 10] },
  { kind: 'streak', bag: bag(6, 2), drawn: 'red', run: 4 },
  // 2 of 5 red: 4 red in ten (P 0.25) beats 5 and 5 (P 0.20), the tempting "half".
  { kind: 'tally', bag: bag(2, 3), options: [2, 4, 5, 6] },
  { kind: 'streak', bag: bag(4, 4), drawn: 'red', run: 3 },
  { kind: 'tally', bag: bag(4, 1), options: [4, 5, 8, 10] },
  { kind: 'tally', bag: bag(3, 7), options: [0, 3, 5, 7] },
  { kind: 'streak', bag: bag(6, 2), drawn: 'blue', run: 2 },
];

const at = <T,>(xs: readonly T[], index: number): T => xs[((index % xs.length) + xs.length) % xs.length];

/** Deterministic variety without Math.random: a small table walked by index. */
export function generate(level: Level, index: number): Round {
  if (level === 1) return { kind: 'compare', bag: at(L1, index) };
  if (level === 2) {
    const [b, ask] = at(L2, index);
    return { kind: 'word', bag: b, ask };
  }
  return at(L3, index);
}

const NUMBER_WORD = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

function prompt(round: Round): string {
  switch (round.kind) {
    case 'compare':
      return 'One marble, without looking. Which colour is more likely?';
    case 'word':
      return `Take one without looking. How likely is ${round.ask}?`;
    case 'streak':
      return `${NUMBER_WORD[round.run]} ${round.drawn}s came out, each put back. Which is likelier next?`;
    case 'tally':
      return 'Ten draws, each put back. Which tally is most likely?';
  }
}

/** The chance word for one colour from this bag. Bags at level 2 are never half and half. */
export function chanceWord(b: Bag, c: Colour): ChanceWord {
  const n = countOf(b, c);
  if (n === 0) return 'impossible';
  if (n === size(b)) return 'certain';
  return n * 2 > size(b) ? 'likely' : 'unlikely';
}

/** Red, blue, or the same chance: whichever the bag holds more of. */
const likelier = (b: Bag): 'red' | 'blue' | 'same' => (b.red === b.blue ? 'same' : b.red > b.blue ? 'red' : 'blue');

/** Reds expected in ten draws, put back each time. Every level-3 bag makes this whole. */
const expectedRed = (b: Bag) => (10 * b.red) / size(b);

export const tallyId = (red: number) => `t${red}`;

/** The id of the right choice. */
export function answerOf(round: Round): string {
  switch (round.kind) {
    case 'compare':
    case 'streak':
      return likelier(round.bag);
    case 'word':
      return chanceWord(round.bag, round.ask);
    case 'tally':
      return tallyId(expectedRed(round.bag));
  }
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** One sentence about what the board now shows. A fact, never a verdict. */
export function hintLine(round: Round): string {
  const b = round.bag;
  switch (round.kind) {
    case 'compare':
      return b.red === b.blue ? `${b.red} red and ${b.blue} blue: the same number of each.` : `${b.red} red and ${b.blue} blue in the bag.`;
    case 'word': {
      const n = countOf(b, round.ask);
      if (n === 0) return `No marble in the bag is ${round.ask}.`;
      if (n === size(b)) return `All ${n} marbles in the bag are ${round.ask}.`;
      return `${n} of the ${size(b)} marbles ${n === 1 ? 'is' : 'are'} ${round.ask}.`;
    }
    case 'streak':
      return `Each marble went back. The bag still holds ${b.red} red, ${b.blue} blue.`;
    case 'tally':
      return size(b) === 10
        ? `${b.red} of the 10 marbles are red.`
        : `${b.red} of the ${size(b)} marbles are red. Ten is two lots of ${size(b)}.`;
  }
}

function check(round: Round, answer: Answer): Verdict {
  if (answer !== null && answer === answerOf(round)) return { ok: true };
  return { ok: false, hint: hintLine(round) };
}

function explain(round: Round): string {
  const b = round.bag;
  switch (round.kind) {
    case 'compare': {
      const w = likelier(b);
      if (w === 'same') return `${b.red} red, ${b.blue} blue. Each colour has the same chance.`;
      const other = w === 'red' ? 'Blue' : 'Red';
      return `${b.red} red, ${b.blue} blue. More ${w} marbles, so ${w} is more likely. ${other} can still come out.`;
    }
    case 'word':
      return wordExplain(b, round.ask);
    case 'streak': {
      const w = likelier(b);
      const still = w === 'same' ? 'Each colour still has the same chance' : `${cap(w)} is still likelier`;
      return `The bag is unchanged: ${b.red} red, ${b.blue} blue. ${still}. No colour is ever due.`;
    }
    case 'tally': {
      const e = expectedRed(b);
      const scale = size(b) === 10 ? '' : ' and ten is two fives,';
      return `${b.red} of ${size(b)} are red,${scale} so ${e} red, ${10 - e} blue is the likeliest tally. ${e - 1} or ${e + 1} red would not be surprising.`;
    }
  }
}

function wordExplain(b: Bag, c: Colour): string {
  const n = countOf(b, c);
  switch (chanceWord(b, c)) {
    case 'impossible':
      return `There are no ${c} marbles in the bag, so ${c} is impossible.`;
    case 'certain':
      return `Every marble is ${c}, so ${c} is certain.`;
    case 'likely':
      return `${n} of ${size(b)} are ${c}: more than half, so ${c} is likely. Likely is not certain.`;
    case 'unlikely':
      return `Only ${n} of ${size(b)} ${n === 1 ? 'is' : 'are'} ${c}: fewer than half, so ${c} is unlikely. Unlikely is not impossible.`;
  }
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#2b1d14';
const SOFT = '#5a4636';
const PAPER = '#fff8ec';
const HUE: Record<Colour, string> = { red: '#d23a2a', blue: '#2556b8', green: '#2f8a3e' };
/** Turmeric cotton, a maroon drawstring with a gold thread. */
const CLOTH = '#f0cf86';
const CLOTH_EDGE = '#8a5a24';
const TIE = '#6e2a1f';
const GOLD = '#f2a900';
/** The selected Choice's gold, lighter: where the child's pick shows on the board. */
const GOLD_TINT = '#fff1c9';

/** Ten spots inside the bag body, in SVG units. */
const POS: ReadonlyArray<readonly [number, number]> = [
  [120, 128], [175, 120], [228, 130],
  [93, 172], [147, 168], [202, 173], [252, 168],
  [118, 216], [172, 220], [226, 214],
];
/** Which spots a bag of n uses: centred, and symmetric. */
const SLOTS: Record<number, readonly number[]> = {
  5: [1, 4, 5, 7, 9],
  8: [0, 1, 2, 4, 5, 7, 8, 9],
  10: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};
/** Where the fewer colour goes first, so any count of it looks mixed in. */
const MINOR: Record<number, readonly number[]> = {
  5: [5, 7, 1, 4, 9],
  8: [5, 7, 1, 9, 0, 8, 4, 2],
  10: [4, 9, 2, 7, 5, 0, 8, 3, 6, 1],
};

interface Spot {
  readonly x: number;
  readonly y: number;
  readonly c: Colour;
}

/** The marbles in the bag, well mixed: the same picture for the same bag. */
export function inBag(b: Bag): readonly Spot[] {
  const n = size(b);
  const fewer: 'red' | 'blue' = b.red < b.blue ? 'red' : 'blue';
  const more: 'red' | 'blue' = fewer === 'red' ? 'blue' : 'red';
  const minority = new Set(MINOR[n].slice(0, countOf(b, fewer)));
  return SLOTS[n].map((i) => ({ x: POS[i][0], y: POS[i][1], c: minority.has(i) ? fewer : more }));
}

function Marble({ x, y, r, c, sw = 2.5 }: { readonly x: number; readonly y: number; readonly r: number; readonly c: Colour; readonly sw?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={HUE[c]} stroke={INK} strokeWidth={sw} />
      <circle cx={x - r * 0.36} cy={y - r * 0.36} r={r * 0.27} fill="#ffffff" opacity="0.6" />
    </g>
  );
}

/** The cloth bag alone, in the board's coordinates. `k` thickens the lines for a small copy. */
function PotliShape({ k = 1 }: { readonly k?: number }) {
  return (
    <g>
      <path d="M118 80 C 34 104, 26 252, 172 258 C 318 252, 310 104, 226 80 Z" fill={CLOTH} stroke={CLOTH_EDGE} strokeWidth={4 * k} />
      <path d="M120 74 L 102 38 L 134 58 L 152 30 L 172 54 L 192 30 L 210 58 L 242 38 L 224 74 Z" fill={CLOTH} stroke={CLOTH_EDGE} strokeWidth={4 * k} strokeLinejoin="round" />
      <rect x="112" y="66" width="120" height="16" rx="8" fill={TIE} stroke={INK} strokeWidth={2.5 * k} />
      <line x1="120" y1="74" x2="224" y2="74" stroke={GOLD} strokeWidth={2 * k} strokeDasharray={`${5 * k} ${6 * k}`} />
    </g>
  );
}

/** A turmeric cotton potli, drawn open at the front so every marble shows. */
function Potli({ b }: { readonly b: Bag }) {
  return (
    <g>
      <PotliShape />
      {inBag(b).map((s, i) => (
        <Marble key={i} x={s.x} y={s.y} r={19} c={s.c} />
      ))}
    </g>
  );
}

const ROW_Y = [186, 216, 246] as const;

/**
 * The same marbles counted into rows by colour: the hint's evidence. With
 * `pair`, each red is boxed with a blue, and the unpaired extras are named in
 * the gap they leave in the shorter row: the worked comparison.
 */
function SortedRows({ b, extra, pair }: { readonly b: Bag; readonly extra?: Colour; readonly pair?: boolean }) {
  const colours: readonly Colour[] = extra === 'green' ? ['red', 'blue', 'green'] : ['red', 'blue'];
  const lo = Math.min(b.red, b.blue);
  const more = likelier(b);
  return (
    <g>
      {pair
        ? Array.from({ length: lo }, (_, i) => (
            <rect key={`p${i}`} x={395 + 26 * i} y={ROW_Y[0] - 14} width="26" height={ROW_Y[1] - ROW_Y[0] + 28} rx="13" fill="none" stroke={GOLD} strokeWidth="3" />
          ))
        : null}
      {pair && more !== 'same' ? (
        <text x={404 + 26 * lo} y={more === 'red' ? ROW_Y[1] : ROW_Y[0]} dominantBaseline="central" fontSize="15" fontWeight="700" fill={HUE[more]}>
          {`${Math.abs(b.red - b.blue)} more ${more}`}
        </text>
      ) : null}
      <text x="352" y="160" fontSize="16" fill={SOFT}>
        In the bag, counted:
      </text>
      {colours.map((c, row) => {
        const n = countOf(b, c);
        const y = ROW_Y[row];
        return (
          <g key={c}>
            <text x="378" y={y} textAnchor="middle" dominantBaseline="central" fontSize="24" fontWeight="700" fill={HUE[c]}>
              {n}
            </text>
            {n === 0 ? (
              <rect x="396" y={y - 12} width="70" height="24" rx="12" fill="none" stroke={HUE[c]} strokeWidth="2" strokeDasharray="5 5" />
            ) : (
              Array.from({ length: n }, (_, i) => <Marble key={i} x={408 + 26 * i} y={y} r={11} c={c} />)
            )}
          </g>
        );
      })}
    </g>
  );
}

/** A level 1 or streak answer: the colour that might come out, or both at the same chance. */
type Pick = 'red' | 'blue' | 'same';

const asPick = (id: string | null): Pick | null => (id === 'red' || id === 'blue' || id === 'same' ? id : null);

/** One marble, or a red and a blue with "=" between them, centred on (x, y). */
function PickMarbles({ x, y, r, pick, sw = 2.5 }: { readonly x: number; readonly y: number; readonly r: number; readonly pick: Pick; readonly sw?: number }) {
  if (pick !== 'same') return <Marble x={x} y={y} r={r} c={pick} sw={sw} />;
  const d = r * 1.6;
  return (
    <g>
      <Marble x={x - d} y={y} r={r} c="red" sw={sw} />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={r * 1.5} fontWeight="700" fill={INK}>
        =
      </text>
      <Marble x={x + d} y={y} r={r} c="blue" sw={sw} />
    </g>
  );
}

/** A dashed place on the board where the tapped answer appears, gold like the selected button. */
function PickSpot({ x, y, w, h, filled }: { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly filled: boolean }) {
  return (
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx="12"
      fill={filled ? GOLD_TINT : '#ffffff'}
      stroke={filled ? INK : SOFT}
      strokeWidth="3"
      strokeDasharray="7 6"
    />
  );
}

/** A curved arrow: the path, then its head. */
function Arrow({ d, tip }: { readonly d: string; readonly tip: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d={tip} fill={INK} />
    </g>
  );
}

/** Level 1: one marble will come out, unseen. The outcome is never drawn; the child's guess sits beside it. */
function OneDraw({ pick }: { readonly pick: Pick | null }) {
  return (
    <g>
      <Arrow d="M262 60 Q 360 22 444 70" tip="M450 74 l-18 -2 l9 -13 z" />
      <circle cx="486" cy="86" r="32" fill={PAPER} stroke={INK} strokeWidth="3" strokeDasharray="7 6" />
      <text x="486" y="88" textAnchor="middle" dominantBaseline="central" fontSize="34" fontWeight="700" fill={INK}>
        ?
      </text>
      <text x="486" y="138" textAnchor="middle" fontSize="16" fill={SOFT}>
        one comes out, unseen
      </text>
      <PickSpot x={580} y={86} w={88} h={60} filled={pick !== null} />
      {pick ? <PickMarbles x={580} y={86} r={pick === 'same' ? 11 : 18} pick={pick} /> : null}
    </g>
  );
}

const TICK_X = [384, 456, 528, 594] as const;

/** The marble beside the asked colour in a four-marble picture: the bag's other colour, or red and blue in turn for green. */
const otherOf = (c: Colour, j: number): 'red' | 'blue' => (c === 'red' ? 'blue' : c === 'blue' ? 'red' : j % 2 === 0 ? 'red' : 'blue');

/** A chance word as four marbles in a row, centred on (x, y): the asked colour first, then the others. */
function FourOf({ x, y, r, gap, word, c, sw }: { readonly x: number; readonly y: number; readonly r: number; readonly gap: number; readonly word: ChanceWord; readonly c: Colour; readonly sw: number }) {
  const n = OF_FOUR[word];
  return (
    <g>
      {Array.from({ length: 4 }, (_, j) => (
        <Marble key={j} x={x - 1.5 * gap + gap * j} y={y} r={r} c={j < n ? c : otherOf(c, j)} sw={sw} />
      ))}
    </g>
  );
}

/** Level 2: the asked colour, and the chance line from cannot to must, each mark drawn as four marbles. */
function ChanceLine({ ask, mark }: { readonly ask: Colour; readonly mark: ChanceWord | null }) {
  return (
    <g>
      <Marble x={372} y={26} r={14} c={ask} />
      <text x="396" y="32" fontSize="18" fontWeight="700" fill={HUE[ask]}>
        {ask}: how likely?
      </text>
      <line x1={TICK_X[0]} y1="86" x2={TICK_X[3]} y2="86" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {WORDS.map((w, i) => {
        const on = mark === w;
        return (
          <g key={w}>
            {on ? <rect x={TICK_X[i] - 30} y="50" width="60" height="58" rx="10" fill={GOLD_TINT} stroke={INK} strokeWidth="2.5" /> : null}
            <FourOf x={TICK_X[i]} y={64} r={5} gap={12} word={w} c={ask} sw={1.5} />
            {on ? <circle cx={TICK_X[i]} cy="86" r="11" fill={GOLD} stroke={INK} strokeWidth="3" /> : null}
            <line x1={TICK_X[i]} y1="78" x2={TICK_X[i]} y2="94" stroke={INK} strokeWidth="3" />
            <text x={TICK_X[i]} y="122" textAnchor="middle" fontSize="13" fontWeight={on ? 700 : 400} fill={on ? INK : SOFT}>
              {w}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Level 3: the run that already came out, each marble put back, and the child's guess for the next one. */
function Run({ drawn, run, pick }: { readonly drawn: 'red' | 'blue'; readonly run: number; readonly pick: Pick | null }) {
  const nx = 404 + 44 * run;
  return (
    <g>
      {Array.from({ length: run }, (_, i) => (
        <g key={i}>
          <text x={392 + 44 * i} y="40" textAnchor="middle" fontSize="14" fill={SOFT}>
            {i + 1}
          </text>
          <Marble x={392 + 44 * i} y={70} r={16} c={drawn} />
        </g>
      ))}
      <text x={nx} y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
        {run + 1}
      </text>
      <PickSpot x={nx} y={70} w={64} h={44} filled={pick !== null} />
      {pick ? (
        <PickMarbles x={nx} y={70} r={pick === 'same' ? 8 : 16} pick={pick} sw={2} />
      ) : (
        <text x={nx} y={72} textAnchor="middle" dominantBaseline="central" fontSize="26" fontWeight="700" fill={SOFT}>
          ?
        </text>
      )}
      <Arrow d="M372 56 Q 320 18 262 54" tip="M256 58 l8 -16 l9 13 z" />
      <text x="372" y="116" fontSize="16" fill={SOFT}>
        each put back in the bag
      </text>
    </g>
  );
}

const CELL = 30;
const FRAME_X = 360;
const FRAME_Y = 46;

/** Reds in one row of a ten-frame: each row is five draws, the reds shared as evenly as they go. */
const redsInRow = (red: number, row: 0 | 1) => (row === 0 ? Math.ceil(red / 2) : Math.floor(red / 2));

/**
 * Level 3: ten draws as a ten-frame, two rows of five, the same picture as the
 * answer buttons. It fills with the tally the child taps, and in the worked
 * answer with the likeliest tally: a sorted count, not an order of draws.
 */
function TallyFrame({ b, show, red, worked }: { readonly b: Bag; readonly show: boolean; readonly red: number | null; readonly worked: boolean }) {
  const half = size(b) === 5;
  return (
    <g>
      <text x={FRAME_X} y="34" fontSize="16" fill={SOFT}>
        10 draws, each put back
      </text>
      {([0, 1] as const).map((row) =>
        Array.from({ length: 5 }, (_, i) => (
          <g key={`${row}-${i}`}>
            <rect x={FRAME_X + CELL * i} y={FRAME_Y + CELL * row} width={CELL} height={CELL} fill={red === null ? '#ffffff' : GOLD_TINT} stroke={INK} strokeWidth="2" />
            {red === null ? null : (
              <Marble x={FRAME_X + CELL * i + CELL / 2} y={FRAME_Y + CELL * row + CELL / 2} r={10.5} c={i < redsInRow(red, row) ? 'red' : 'blue'} sw={2} />
            )}
          </g>
        )),
      )}
      <rect x={FRAME_X} y={FRAME_Y} width={CELL * 5} height={CELL * 2} fill="none" stroke={INK} strokeWidth="3" />
      {half && show ? (
        <g>
          <line x1={FRAME_X - 6} y1={FRAME_Y + CELL} x2={FRAME_X + CELL * 5 + 6} y2={FRAME_Y + CELL} stroke={INK} strokeWidth="5" />
          <text x={FRAME_X + CELL * 5 + 12} y={FRAME_Y + CELL / 2} dominantBaseline="central" fontSize="14" fill={SOFT}>
            first 5
          </text>
          <text x={FRAME_X + CELL * 5 + 12} y={FRAME_Y + CELL * 1.5} dominantBaseline="central" fontSize="14" fill={SOFT}>
            next 5
          </text>
        </g>
      ) : null}
      {worked && red !== null ? (
        <text x={FRAME_X + CELL * 2.5} y={FRAME_Y + CELL * 2 + 24} textAnchor="middle" fontSize="18" fontWeight="700" fill={INK}>
          {`about ${red} red, ${10 - red} blue`}
        </text>
      ) : null}
    </g>
  );
}

/** The small secondary word under a Choice's picture. */
const WORD: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.1 };

/** A picture with its word underneath, for the inside of a Choice. */
function Pictured({ word, children }: { readonly word: string; readonly children: ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.25em' }}>
      {children}
      <span style={WORD}>{word}</span>
    </span>
  );
}

/** The bag, small, with the guessed marble (or a red and a blue at the same chance) coming out of its mouth. */
function ComesOut({ pick }: { readonly pick: Pick }) {
  return (
    <svg width="96" height="84" viewBox="0 0 96 84" aria-hidden="true">
      <g transform="translate(20 28) scale(0.2373) translate(-54 -26)">
        <PotliShape k={2.1} />
      </g>
      <PickMarbles x={48} y={14} r={pick === 'same' ? 10 : 13} pick={pick} sw={2} />
    </svg>
  );
}

/** A chance word drawn as a small bag holding four marbles: none, one, most or all of the asked colour. */
function BagOfFour({ word, c }: { readonly word: ChanceWord; readonly c: Colour }) {
  return (
    <svg width="100" height="100" viewBox="54 26 236 236" aria-hidden="true">
      <PotliShape k={1.3} />
      <FourOf x={172} y={176} r={22} gap={48} word={word} c={c} sw={4.5} />
    </svg>
  );
}

const MINI = 18;

/** A tally of ten drawn as ten marbles in a two-by-five frame, like the frame on the board. */
function TenFrame({ red }: { readonly red: number }) {
  const w = MINI * 5;
  return (
    <svg width={w + 4} height={MINI * 2 + 4} viewBox={`-2 -2 ${w + 4} ${MINI * 2 + 4}`} aria-hidden="true">
      {([0, 1] as const).map((row) =>
        Array.from({ length: 5 }, (_, i) => (
          <g key={`${row}-${i}`}>
            <rect x={MINI * i} y={MINI * row} width={MINI} height={MINI} fill="#ffffff" stroke={INK} strokeWidth="1" />
            <Marble x={MINI * i + MINI / 2} y={MINI * row + MINI / 2} r={6.6} c={i < redsInRow(red, row) ? 'red' : 'blue'} sw={1.3} />
          </g>
        )),
      )}
      <rect x="0" y="0" width={w} height={MINI * 2} fill="none" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

interface Option {
  readonly id: string;
  readonly label: string;
  readonly body: ReactNode;
}

function options(round: Round): readonly Option[] {
  switch (round.kind) {
    case 'compare':
    case 'streak':
      return [
        { id: 'red', label: 'Red', body: <Pictured word="Red"><ComesOut pick="red" /></Pictured> },
        { id: 'blue', label: 'Blue', body: <Pictured word="Blue"><ComesOut pick="blue" /></Pictured> },
        { id: 'same', label: 'Same chance', body: <Pictured word="Same chance"><ComesOut pick="same" /></Pictured> },
      ];
    case 'word':
      return WORDS.map((w) => ({ id: w, label: cap(w), body: <Pictured word={cap(w)}><BagOfFour word={w} c={round.ask} /></Pictured> }));
    case 'tally':
      return round.options.map((r) => ({
        id: tallyId(r),
        label: `${r} red and ${10 - r} blue`,
        body: (
          <Pictured word={`${r} red, ${10 - r} blue`}>
            <TenFrame red={r} />
          </Pictured>
        ),
      }));
  }
}

function boardLabel(round: Round): string {
  const b = round.bag;
  const contents = `A cloth bag holding ${b.red} red and ${b.blue} blue marbles, mixed.`;
  switch (round.kind) {
    case 'compare':
      return `${contents} One will come out unseen.`;
    case 'word':
      return `${contents} The question is about ${round.ask}.`;
    case 'streak':
      return `${contents} ${round.run} ${round.drawn} marbles came out, each put back.`;
    case 'tally':
      return `${contents} Ten draws, each put back.`;
  }
}

const asWord = (id: string | null): ChanceWord | null => (WORDS as readonly (string | null)[]).includes(id) ? (id as ChanceWord) : null;
const asTally = (id: string | null): number | null => (id !== null && /^t\d+$/.test(id) ? Number(id.slice(1)) : null);

function Board({ round, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const evidence = stage !== 'answering';
  const worked = stage === 'worked';
  const locked = stage === 'solved' || worked;
  const right = answerOf(round);
  /** What the board draws as the answer: the child's tap, or the right one once worked. */
  const shown = worked ? right : answer;
  return (
    <div className="board board--chance">
      <svg className="board-svg" viewBox="0 0 640 270" role="img" aria-label={boardLabel(round)}>
        <rect x="3" y="3" width="634" height="264" rx="18" fill={PAPER} stroke={INK} strokeWidth="3" />
        <Potli b={round.bag} />
        {round.kind === 'compare' ? <OneDraw pick={asPick(shown)} /> : null}
        {round.kind === 'word' ? <ChanceLine ask={round.ask} mark={asWord(shown)} /> : null}
        {round.kind === 'streak' ? <Run drawn={round.drawn} run={round.run} pick={asPick(shown)} /> : null}
        {round.kind === 'tally' ? <TallyFrame b={round.bag} show={evidence} red={asTally(shown)} worked={worked} /> : null}
        {evidence ? (
          <SortedRows
            b={round.bag}
            extra={round.kind === 'word' ? round.ask : undefined}
            pair={worked && (round.kind === 'compare' || round.kind === 'streak')}
          />
        ) : null}
      </svg>
      <div className="choices" role="group" aria-label="Your answer">
        {options(round).map((o) => (
          <Choice
            key={o.id}
            selected={worked ? o.id === right : answer === o.id}
            onTap={() => setAnswer(o.id)}
            disabled={locked}
            mark={worked && o.id === right ? 'right' : null}
            ariaLabel={o.label}
          >
            {o.body}
          </Choice>
        ))}
      </div>
      {worked ? <p className="board-caption">{explain(round)}</p> : null}
    </div>
  );
}

export const whichColourMightComeOut: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'which-colour-might-come-out',
  title: 'Which Colour Might Come Out?',
  hook: 'Red or blue, without looking.',
  group: 'rules',
  levels: ['Which is likelier?', 'Certain to impossible', 'Ten draws'],
  generate,
  prompt,
  emptyAnswer: () => null,
  Board,
  check,
  explain,
  cover: 'art/games/which-colour-might-come-out.png',
  note: {
    what: 'A cloth bag of red and blue marbles, every marble drawn so he can count them. One marble comes out without looking and always goes back. He taps an answer: the likelier colour, a chance word, or a tally of ten draws.',
    expect: "At level 1 he will pick the colour there is more of and be right, yet many five-year-olds then say blue cannot come out: 'more likely' heard as 'will'. Level 2 breaks on likely versus certain. Level 3 breaks three ways: choosing 10 red from 10 draws, copying a bag of five's count as the tally of ten, and calling blue 'due' after four reds.",
    practising: 'Early probability: comparing chances by comparing counts in the bag; the words impossible, unlikely, likely and certain; scaling a bag of five up to ten draws; and that a marble put back leaves the bag unchanged, so no colour is ever due.',
    ask: "On a 6 red, 2 blue bag, after he taps red: 'Could blue come out? If we drew eight times, putting each back, about how many blues?' (About 2, and 1 or 3 is ordinary.)",
    next: 'Put 6 red and 2 blue large blocks of the same shape and size in a cloth bag, so touch cannot tell them apart. Draw without looking, tally on paper, put it back, shake. Do twenty draws together, then compare the tally with what he predicted.',
    honest: 'Tapping "likely" does not show he expects to be surprised sometimes; the screen never draws a marble. Only real draws teach that, and a real tally of ten will often miss the likeliest tally by one or two.',
    easier: 'Use 7 red and 1 blue in a real bag, and draw until a blue comes out before asking him to name blue unlikely.',
    harder: 'Ask for twenty draws from 6 red and 2 blue (about 15 red), or ask what to add to the bag so red and blue have the same chance.',
    safety: 'Marbles and bottle caps are a choking hazard for his two-year-old sister: use large blocks for the real bag, and keep any small tokens out of her reach.',
  },
};

export default whichColourMightComeOut;
