import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Tray } from '../../play/parts';

/**
 * Can You Pay Exactly? — coin values differ from coin counts.
 *
 * Concept (advisor, maths 17; money starts with US coins, the ones this Bay
 * Area family spends; rupees come later in a separate setting): three coins
 * can be 3¢ or 75¢. The misconceptions
 * it attacks are counting coins instead of their values, and reading value
 * from size — the dime is the SMALLEST coin and worth more than the bigger
 * nickel and penny. Every coin is drawn at its true relative diameter
 * (penny 19.05 mm, nickel 21.21 mm, dime 17.91 mm, quarter 24.26 mm) in its
 * real metal colour, and the dime and quarter carry their reeded edges. The
 * face shows the value in cents (a real dime says ONE DIME), so the value
 * is never in doubt and the size never stands in for it. Under every coin,
 * in the tray and on the counter, its worth is drawn as that many cent dots
 * grouped in tens (two rows of five): a nickel is five dots, a dime a full
 * ten, so the value can be counted, not only read.
 *
 * Levels:
 *  1. Pennies, nickels and dimes, prices to 19¢. Some shelves take only
 *     some coins (no pennies today), and some rounds fix the number of
 *     coins ("10¢ with exactly 1 coin" — the small dime, not the big nickel).
 *  2. The quarter arrives; prices 25¢-55¢. Half the rounds fix the number of
 *     coins (30¢ with exactly 3 coins), so the count and the value must both
 *     be held at once.
 *  3. The fewest coins for a price (41¢ in 4 coins), alternating with change
 *     from a dollar, counted up from the price to 100¢.
 *
 * Control: tap-to-add/remove only. Tapping a coin in the tray puts one on
 * the counter; tapping a coin on the counter takes it back. The price is
 * always on the board as cent dots in tens under the counter (on change
 * rounds, the dollar's 100 cents with the price filled in and the change as
 * empty rings). No totals are shown while he answers. On 'hint' each coin
 * gets its running total and his coins' cents appear under the price's, cent
 * under cent, so too few or too many can be counted; on fewest rounds the
 * swap the hint names is drawn as coins = coin. On 'worked' the counter holds
 * the solution. On "exactly N coins" rounds the counter shows N empty coin
 * spots, all one size, so the count is on the board and not only in the
 * prompt. Every state is a fixed drawing.
 */

export type Coin = 1 | 5 | 10 | 25;
export type Mode = 'pay' | 'count' | 'fewest' | 'change';
export type Item = 'banana' | 'mango' | 'carrot' | 'egg' | 'pencil' | 'eraser' | 'dinosaur' | 'notebook';

export interface Round {
  readonly mode: Mode;
  readonly item: Item;
  /** What the item costs, in cents. Always under 100. */
  readonly price: number;
  /** The coins the shop takes this round, largest first: the tray shows only these. */
  readonly coins: readonly Coin[];
  /** count rounds: exactly this many coins. Otherwise 0. */
  readonly exactly: number;
  /** change rounds: who handed over the dollar. At a shop the children say Mom and Dad. */
  readonly payer: 'Dad' | 'Mom';
}

/** The coins he has put on the counter, in the order he put them there. */
export type Answer = readonly Coin[];

const ALL_COINS: readonly Coin[] = [25, 10, 5, 1];
const SMALL: readonly Coin[] = [10, 5, 1];
const NAME: Record<Coin, readonly [string, string]> = {
  1: ['penny', 'pennies'],
  5: ['nickel', 'nickels'],
  10: ['dime', 'dimes'],
  25: ['quarter', 'quarters'],
};
/** The most coins the counter holds; the tray greys out past it. */
const MAX_COINS = 20;
const DOLLAR = 100;

const pay = (item: Item, price: number, coins: readonly Coin[] = SMALL): Round => ({
  mode: 'pay', item, price, coins, exactly: 0, payer: 'Dad',
});
const count = (item: Item, price: number, exactly: number, coins: readonly Coin[]): Round => ({
  mode: 'count', item, price, coins, exactly, payer: 'Dad',
});
const fewest = (item: Item, price: number): Round => ({
  mode: 'fewest', item, price, coins: ALL_COINS, exactly: 0, payer: 'Dad',
});
const change = (item: Item, price: number, payer: Round['payer']): Round => ({
  mode: 'change', item, price, coins: ALL_COINS, exactly: 0, payer,
});

/**
 * Deterministic variety without Math.random: a table per level walked by
 * index. Level 1 puts the "exactly 1 coin" dime round fourth, after he has
 * seen the dime is small. Level 2 alternates free payment with fixed counts.
 * Level 3 alternates the fewest coins with change from a dollar.
 */
const TABLE: Record<Level, readonly Round[]> = {
  1: [
    pay('banana', 7, [5, 1]), pay('egg', 12), pay('carrot', 15, [10, 5]), count('pencil', 10, 1, SMALL),
    pay('eraser', 18), pay('mango', 14, [5, 1]), count('banana', 6, 2, SMALL), pay('notebook', 19),
  ],
  2: [
    pay('mango', 30, ALL_COINS), count('pencil', 30, 3, [25, 10, 5]), pay('notebook', 42, ALL_COINS), count('eraser', 25, 3, [25, 10, 5]),
    pay('dinosaur', 55, [25, 10, 5]), count('banana', 26, 2, ALL_COINS), pay('carrot', 37, ALL_COINS), count('egg', 40, 3, [25, 10, 5]),
  ],
  3: [
    fewest('mango', 41), change('pencil', 65, 'Dad'), fewest('notebook', 68), change('banana', 30, 'Mom'),
    fewest('dinosaur', 90), change('eraser', 45, 'Dad'), fewest('carrot', 29), change('notebook', 85, 'Mom'),
  ],
};

export function generate(level: Level, index: number): Round {
  const t = TABLE[level];
  // A fresh object per call: the shell resets the answer when the round's
  // identity changes, so two calls must never hand back the same reference.
  return { ...t[index % t.length] };
}

const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/** What the coins on the counter must add up to: the price, or the change from a dollar. */
export const target = (round: Round) => (round.mode === 'change' ? DOLLAR - round.price : round.price);

/**
 * `k` coins from `coins` (largest first) that make `total`, or null. Coins are
 * taken in non-increasing order, so each multiset is tried once.
 */
function find(total: number, k: number, coins: readonly Coin[], from = 0): Coin[] | null {
  if (k === 0) return total === 0 ? [] : null;
  for (let i = from; i < coins.length; i += 1) {
    const c = coins[i];
    if (c > total || c * k < total) continue;
    const rest = find(total - c, k - 1, coins, i);
    if (rest) return [c, ...rest];
  }
  return null;
}

/** The fewest coins from `coins` that make `total`. Every table round has one. */
export function fewestCoins(total: number, coins: readonly Coin[]): Coin[] {
  for (let k = 1; k <= total; k += 1) {
    const hit = find(total, k, coins);
    if (hit) return hit;
  }
  return [];
}

/** The worked answer: what the counter should hold. Change is counted up, smallest coin first. */
export function solution(round: Round): Answer {
  if (round.mode === 'count') return find(round.price, round.exactly, round.coins) ?? [];
  const best = fewestCoins(target(round), round.coins);
  return round.mode === 'change' ? [...best].reverse() : best;
}

const ARTICLE: Record<Item, string> = {
  banana: 'A', mango: 'A', carrot: 'A', egg: 'An', pencil: 'A', eraser: 'An', dinosaur: 'A', notebook: 'A',
};
const LABEL: Record<Item, string> = {
  banana: 'banana', mango: 'mango', carrot: 'carrot', egg: 'egg', pencil: 'pencil', eraser: 'eraser', dinosaur: 'toy dinosaur', notebook: 'notebook',
};

const coinWord = (c: Coin, n: number) => `${n} ${NAME[c][n === 1 ? 0 : 1]}`;
const coinsWord = (n: number) => (n === 1 ? '1 coin' : `${n} coins`);
const cents = (n: number) => `${n}¢`;
const expr = (xs: readonly number[]) => xs.map(cents).join(' + ');

function prompt(round: Round): string {
  const thing = LABEL[round.item];
  switch (round.mode) {
    case 'pay':
      return `Pay exactly ${cents(round.price)} for the ${thing}.`;
    case 'count':
      return `Pay ${cents(round.price)} for the ${thing} with exactly ${coinsWord(round.exactly)}.`;
    case 'fewest':
      return `Pay ${cents(round.price)} for the ${thing} with the fewest coins.`;
    case 'change':
      return `${ARTICLE[round.item]} ${thing} costs ${cents(round.price)}. ${round.payer} pays a dollar. Give the change.`;
  }
}

const tally = (answer: Answer) => {
  const t: Record<Coin, number> = { 1: 0, 5: 0, 10: 0, 25: 0 };
  for (const c of answer) t[c] += 1;
  return t;
};

/** "1 quarter, 1 dime, 2 pennies": the coins named by kind, largest first. */
const tallyWords = (answer: Answer) => {
  const t = tally(answer);
  return ALL_COINS.filter((c) => t[c] > 0).map((c) => coinWord(c, t[c])).join(', ');
};

/** Coins that can be swapped for fewer coins of the same worth, and the sentence that names it. */
interface Trade {
  readonly from: readonly Coin[];
  readonly to: readonly Coin[];
  readonly text: string;
}

/**
 * A swap that makes the same value with fewer coins. US coins are canonical:
 * if none of these applies, the coins are already the fewest for their total.
 * The board draws the swap (coins = coin, each with its cents) on the hint.
 */
function trade(answer: Answer): Trade | null {
  const t = tally(answer);
  if (t[1] >= 5) return { from: [1, 1, 1, 1, 1], to: [5], text: '5 pennies make 5¢, the same as 1 nickel.' };
  if (t[5] >= 2) return { from: [5, 5], to: [10], text: '2 nickels make 10¢, the same as 1 dime.' };
  if (t[10] >= 2 && t[5] >= 1) return { from: [10, 10, 5], to: [25], text: '2 dimes and a nickel make 25¢, the same as 1 quarter.' };
  if (t[10] >= 3) return { from: [10, 10, 10], to: [25, 5], text: '3 dimes make 30¢, the same as a quarter and a nickel.' };
  return null;
}

function check(round: Round, answer: Answer): Verdict {
  const total = sum(answer);
  const n = answer.length;
  const thing = LABEL[round.item];
  const costs = `The ${thing} costs ${cents(round.price)}.`;

  if (round.mode === 'change') {
    const want = target(round);
    if (total === want) return { ok: true };
    if (n === 0) return { ok: false, hint: `The counter is empty. The change takes ${cents(round.price)} up to 100¢.` };
    return { ok: false, hint: `${cents(round.price)} and your ${cents(total)} make ${cents(round.price + total)}. A dollar is 100¢.` };
  }

  if (n === 0) return { ok: false, hint: `The counter is empty. ${costs}` };
  const make = `Your ${coinsWord(n)} ${n === 1 ? 'makes' : 'make'} ${cents(total)}.`;
  if (total !== round.price) return { ok: false, hint: `${make} ${costs}` };

  if (round.mode === 'count' && n !== round.exactly) {
    return { ok: false, hint: `${make} That is the price, in ${coinsWord(n)}, not ${round.exactly}.` };
  }
  if (round.mode === 'fewest' && n > fewestCoins(round.price, round.coins).length) {
    return { ok: false, hint: `${cents(total)} in ${coinsWord(n)}. ${trade(answer)?.text ?? ''}`.trim() };
  }
  return { ok: true };
}

function explain(round: Round): string {
  const s = solution(round);
  const k = coinsWord(s.length);
  const sumLine = `${expr(s)} = ${cents(target(round))}`;
  switch (round.mode) {
    case 'pay':
      return `One way: ${sumLine}. ${k}, ${round.price} cents: add what each coin is worth, not how many.`;
    case 'count':
      return `${sumLine}: exactly ${k}. Each coin counts for what it is worth, not for 1.`;
    case 'fewest':
      return `${sumLine}: ${k}, the fewest. Take the biggest coin that fits, again and again.`;
    case 'change':
      return `Count up: ${cents(round.price)} + ${expr(s)} = 100¢. The change is ${cents(target(round))}.`;
  }
}

/* --------------------------------------------------------------- drawing -- */

const INK = '#24170f';
const DIAMETER_MM: Record<Coin, number> = { 1: 19.05, 5: 21.21, 10: 17.91, 25: 24.26 };
/** The quarter is 56 px across; every other coin keeps its true size beside it. */
const PX_PER_MM = 56 / 24.26;
const FILL: Record<Coin, string> = { 1: '#b8733a', 5: '#a7abb1', 10: '#d3d7dc', 25: '#c3c8ce' };
const RIM: Record<Coin, string> = { 1: '#8a4f22', 5: '#7d8187', 10: '#8e949b', 25: '#858b92' };

/** One coin, face up, at its true relative size. `crossed`: the shop does not take it today. */
function CoinFace({ c, crossed }: { readonly c: Coin; readonly crossed?: boolean }) {
  const d = Math.round(DIAMETER_MM[c] * PX_PER_MM);
  const reeded = c === 10 || c === 25;
  return (
    <svg viewBox="0 0 100 100" style={{ width: d, height: d }} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill={FILL[c]} stroke={INK} strokeWidth="3" />
      {reeded ? <circle cx="50" cy="50" r="43" fill="none" stroke={RIM[c]} strokeWidth="6" strokeDasharray="2 2.5" /> : null}
      <circle cx="50" cy="50" r="37" fill="none" stroke={RIM[c]} strokeWidth="2.5" />
      <text x="50" y="62" textAnchor="middle" fontSize={c === 25 ? 32 : 36} fontWeight="700" fill={INK}>
        {`${c}¢`}
      </text>
      {crossed ? <path d="M16 16 L84 84 M84 16 L16 84" stroke="#b3261e" strokeWidth="10" strokeLinecap="round" /> : null}
    </svg>
  );
}

/** One cent, drawn: the unit every coin and every price is counted in. */
const CENT = 'var(--ones)';
const DOT = 9;
const DOT_GAP = 5;

/**
 * A coin's worth as that many cent dots, in tens of two rows of five, two
 * tens to a line: a penny is one dot, a nickel a row of five, a dime a full
 * ten, a quarter two tens and five. Each ten has its own outline.
 */
function CentDots({ n }: { readonly n: number }) {
  const step = 5 * DOT + DOT_GAP;
  const frames = Array.from({ length: Math.ceil(n / 10) }, (_, f) => {
    const inFrame = Math.min(10, n - f * 10);
    return {
      x: (f % 2) * step,
      y: Math.floor(f / 2) * (2 * DOT + DOT_GAP),
      w: Math.min(5, inFrame) * DOT,
      h: (inFrame > 5 ? 2 : 1) * DOT,
    };
  });
  const width = Math.max(...frames.map((f) => f.x + f.w)) + 2;
  const height = Math.max(...frames.map((f) => f.y + f.h)) + 2;
  return (
    <svg viewBox={`-1 -1 ${width} ${height}`} style={{ width, height }} aria-hidden="true">
      {frames.map((f, i) => (
        <rect key={`f${i}`} x={f.x} y={f.y} width={f.w} height={f.h} rx="3" fill="#fffaf0" stroke="#b9a27e" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, k) => {
        const f = frames[Math.floor(k / 10)];
        const w = k % 10;
        return <circle key={k} cx={f.x + (w % 5) * DOT + DOT / 2} cy={f.y + Math.floor(w / 5) * DOT + DOT / 2} r={DOT / 2 - 1.2} fill={CENT} stroke={INK} strokeWidth="0.8" />;
      })}
    </svg>
  );
}

const coinCol: CSSProperties = { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const nameStyle: CSSProperties = { fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink-soft)' };

/** A coin with its worth counted out underneath, and optionally its name, small, below that. */
function CoinWithCents({ c, name, crossed }: { readonly c: Coin; readonly name?: boolean; readonly crossed?: boolean }) {
  return (
    <span style={coinCol}>
      <CoinFace c={c} crossed={crossed} />
      <CentDots n={c} />
      {name ? <span style={nameStyle}>{NAME[c][0]}</span> : null}
    </span>
  );
}

/** The thing on the counter, drawn in a 120 × 120 box. */
function ItemArt({ item }: { readonly item: Item }) {
  const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const };
  switch (item) {
    case 'banana':
      return (
        <g>
          <path d="M20 30 C22 80 62 106 106 92 C110 88 108 83 101 84 C68 88 42 70 34 30 Z" fill="#f4c430" {...line} />
          <path d="M20 30 L15 18 L26 16 L34 30" fill="#6b4a1e" {...line} />
        </g>
      );
    case 'mango':
      return (
        <g>
          <path d="M60 24 C92 24 108 54 100 82 C92 106 54 112 34 94 C14 76 22 24 60 24Z" fill="#f2a02b" {...line} />
          <ellipse cx="48" cy="60" rx="17" ry="22" fill="#e5652a" opacity="0.5" />
          <path d="M60 24 L62 10" stroke="#6b4a1e" strokeWidth="5" />
          <path d="M62 12 C76 2 92 6 98 14 C84 21 72 21 62 12Z" fill="#3c8d2f" {...line} />
        </g>
      );
    case 'carrot':
      return (
        <g>
          <path d="M62 40 C66 22 78 12 90 10 M66 44 C80 34 96 32 108 36 M60 38 C58 22 62 12 70 6" stroke="#3c8d2f" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M44 40 C60 30 82 44 76 60 L26 108 C20 113 12 106 17 100 Z" fill="#ee7d1a" {...line} />
          <path d="M40 66 L50 70 M32 82 L42 86" stroke="#b9560b" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'egg':
      return <path d="M60 16C84 16 98 52 98 76C98 100 80 112 60 112C40 112 22 100 22 76C22 52 36 16 60 16Z" fill="#fbf3e4" {...line} />;
    case 'pencil':
      return (
        <g transform="rotate(-20 60 60)">
          <rect x="10" y="50" width="80" height="22" fill="#f2b705" {...line} />
          <rect x="0" y="50" width="12" height="22" fill="#e98aa0" {...line} />
          <path d="M90 50 L116 61 L90 72 Z" fill="#f1d6a6" {...line} />
          <path d="M107 57 L116 61 L107 65Z" fill={INK} />
        </g>
      );
    case 'eraser':
      return (
        <g>
          <rect x="14" y="46" width="92" height="42" rx="8" fill="#f39ab0" {...line} />
          <rect x="52" y="46" width="32" height="42" fill="#2f6fd0" {...line} />
        </g>
      );
    case 'dinosaur':
      return (
        <g>
          <path d="M8 94 C30 92 34 72 50 64 C60 42 78 24 96 22 C108 22 112 32 104 36 C92 38 84 48 82 64 C96 68 104 82 108 98 L96 98 L92 86 L86 98 L74 98 L72 86 L48 86 L46 98 L34 98 L34 86 C24 92 16 96 8 94Z" fill="#3c9a5f" {...line} />
          <circle cx="100" cy="28" r="2.5" fill={INK} />
        </g>
      );
    case 'notebook':
      return (
        <g>
          <rect x="28" y="14" width="72" height="98" rx="4" fill="#2e6fd8" {...line} />
          <rect x="44" y="34" width="44" height="20" fill="#fffaf0" stroke={INK} strokeWidth="2" />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx="28" cy={24 + i * 13} r="4.5" fill="none" stroke={INK} strokeWidth="2.5" />
          ))}
        </g>
      );
  }
}

/** The shop counter: the item, its price tag, and on change rounds the dollar that was handed over. */
function Counter({ round }: { readonly round: Round }) {
  const thing = LABEL[round.item];
  const isChange = round.mode === 'change';
  const label = isChange
    ? `${ARTICLE[round.item]} ${thing} with a tag that says ${round.price} cents, and ${round.payer}'s dollar bill, 100 cents.`
    : `${ARTICLE[round.item]} ${thing} with a tag that says ${round.price} cents.`;
  const ix = isChange ? 380 : 330;
  return (
    <svg className="board-svg" viewBox="0 0 960 230" role="img" aria-label={label}>
      <rect x="0" y="170" width="960" height="60" fill="#c98b4a" stroke={INK} strokeWidth="3" />
      <rect x="0" y="170" width="960" height="14" fill="#a8692e" />
      <g transform={`translate(${ix} 50)`}>
        <ItemArt item={round.item} />
      </g>
      <line x1={ix + 120} y1="76" x2={ix + 168} y2="64" stroke={INK} strokeWidth="2.5" />
      <g transform={`translate(${ix + 168} 30)`}>
        <path d="M0 34 L22 0 H150 V68 H22 Z" fill="#fff6dc" stroke={INK} strokeWidth="3" />
        <circle cx="22" cy="34" r="6" fill="#c98b4a" stroke={INK} strokeWidth="2.5" />
        <text x="88" y="48" textAnchor="middle" fontSize="40" fontWeight="700" fill={INK}>{`${round.price}¢`}</text>
      </g>
      {isChange ? (
        <g transform="translate(40 70)">
          <rect x="0" y="0" width="250" height="100" rx="6" fill="#cfe3c4" stroke="#2f5b2a" strokeWidth="4" />
          <rect x="10" y="10" width="230" height="80" rx="4" fill="none" stroke="#2f5b2a" strokeWidth="2" />
          <ellipse cx="125" cy="50" rx="30" ry="36" fill="#e8f1e1" stroke="#2f5b2a" strokeWidth="2.5" />
          <text x="34" y="40" textAnchor="middle" fontSize="26" fontWeight="700" fill="#2f5b2a">1</text>
          <text x="216" y="84" textAnchor="middle" fontSize="26" fontWeight="700" fill="#2f5b2a">1</text>
          <text x="125" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="#2f5b2a">$1</text>
          <text x="125" y="-12" textAnchor="middle" fontSize="24" fontWeight="700" fill={INK}>{`${round.payer}'s dollar: 100¢`}</text>
        </g>
      ) : null}
    </svg>
  );
}

/** Cent lines: one dot per cent, fifty to a line, a small gap after each five and a wider one after each ten. */
const CD = 14;
const PER_LINE = 50;
const LINE_X = 120;
const ROW = 24;
const PRICE_CENT = 'var(--gold)';
/** Neighbouring coins alternate shade, so each coin's cents stay one clump. */
const COIN_CENT = ['var(--ones)', '#9ad3a5'] as const;

const dotX = (k: number) => {
  const j = k % PER_LINE;
  return LINE_X + j * CD + Math.floor(j / 5) * 4 + Math.floor(j / 10) * 8 + CD / 2;
};

/** The small drawn key at the start of each kind of line: a price tag, a dollar bill, or a coin. */
function LineKey({ kind, y }: { readonly kind: 'tag' | 'dollar' | 'coin'; readonly y: number }) {
  if (kind === 'coin') {
    return <circle cx="70" cy={y} r="11" fill={FILL[10]} stroke={INK} strokeWidth="2.5" />;
  }
  if (kind === 'dollar') {
    return (
      <g>
        <rect x="46" y={y - 11} width="48" height="22" rx="3" fill="#cfe3c4" stroke="#2f5b2a" strokeWidth="2.5" />
        <ellipse cx="70" cy={y} rx="6" ry="8" fill="#e8f1e1" stroke="#2f5b2a" strokeWidth="1.5" />
      </g>
    );
  }
  return (
    <g>
      <path d={`M46 ${y} L56 ${y - 11} H94 V${y + 11} H56 Z`} fill="#fff6dc" stroke={INK} strokeWidth="2.5" />
      <circle cx="56" cy={y} r="3" fill="#c98b4a" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

/**
 * The price as cents you can count, under the counter, always there. On
 * change rounds the top line is the dollar's 100 cents: the price filled in,
 * the change still to give as empty rings. Once totals show (hint, worked,
 * solved) his coins' cents are drawn on the line beneath, cent under cent,
 * and a dashed mark shows where the coins must end.
 */
function CentLines({ round, coins, showCoins }: { readonly round: Round; readonly coins: Answer; readonly showCoins: boolean }) {
  const isChange = round.mode === 'change';
  const start = isChange ? round.price : 0;
  const goal = isChange ? DOLLAR : round.price;
  const reach = start + sum(coins);
  const cells = Math.max(goal, showCoins ? reach : 0);
  const lines = Math.max(1, Math.ceil(cells / PER_LINE));
  const pair = (showCoins ? 2 : 1) * ROW + 18;
  const top = 8 + ROW / 2;
  const yPrice = (k: number) => top + Math.floor(k / PER_LINE) * pair;
  const yCoin = (k: number) => yPrice(k) + ROW;
  const coinCents: { readonly fill: string }[] = [];
  coins.forEach((c, i) => {
    for (let k = 0; k < c; k += 1) coinCents.push({ fill: COIN_CENT[i % 2] });
  });
  const endX = (n: number) => dotX(n - 1) + CD / 2 + 10;
  const label = isChange
    ? `A dollar as 100 cent dots: ${round.price} for the price, ${DOLLAR - round.price} empty for the change.${showCoins ? ` Under them, the price and your change reach ${reach} cents.` : ''}`
    : `The price as ${round.price} cent dots.${showCoins ? ` Under them, your ${coinsWord(coins.length)} as ${reach} cent dots.` : ''}`;
  return (
    <svg className="board-svg" viewBox={`0 0 960 ${top + (lines - 1) * pair + (showCoins ? ROW : 0) + ROW / 2 + 8}`} role="img" aria-label={label}>
      <LineKey kind={isChange ? 'dollar' : 'tag'} y={top} />
      {showCoins ? <LineKey kind="coin" y={top + ROW} /> : null}
      {Array.from({ length: goal }, (_, k) =>
        isChange && k >= round.price ? (
          <circle key={`p${k}`} cx={dotX(k)} cy={yPrice(k)} r={CD / 2 - 1.5} fill="#ffffff" stroke={INK} strokeWidth="1.5" strokeDasharray="3 2" />
        ) : (
          <circle key={`p${k}`} cx={dotX(k)} cy={yPrice(k)} r={CD / 2 - 1.5} fill={PRICE_CENT} stroke={INK} strokeWidth="1.2" />
        ),
      )}
      <text x={endX(goal)} y={yPrice(goal - 1) + 7} fontSize="20" fontWeight="700" fill={INK}>{`${goal}¢`}</text>
      {showCoins ? (
        <g>
          {Array.from({ length: start }, (_, k) => (
            <circle key={`s${k}`} cx={dotX(k)} cy={yCoin(k)} r={CD / 2 - 1.5} fill={PRICE_CENT} opacity="0.45" stroke={INK} strokeWidth="1" />
          ))}
          {coinCents.map(({ fill }, i) => (
            <circle key={`c${i}`} cx={dotX(start + i)} cy={yCoin(start + i)} r={CD / 2 - 1.5} fill={fill} stroke={INK} strokeWidth="1.2" />
          ))}
          {reach > 0 ? (
            <text x={endX(reach)} y={yCoin(reach - 1) + 7} fontSize="20" fontWeight="700" fill="var(--maths-deep)">{`${reach}¢`}</text>
          ) : null}
          <line
            x1={dotX(goal - 1) + CD / 2 + 3}
            y1={yPrice(goal - 1) - ROW / 2}
            x2={dotX(goal - 1) + CD / 2 + 3}
            y2={yCoin(goal - 1) + ROW / 2}
            stroke={INK}
            strokeWidth="2.5"
            strokeDasharray="5 4"
          />
        </g>
      ) : null}
    </svg>
  );
}

const tradeBox: CSSProperties = {
  display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'var(--s3)',
  padding: 'var(--s3)', background: 'var(--raised)', border: '2px solid var(--rule)', borderRadius: 'var(--radius-sm)',
};
const eqSign: CSSProperties = { fontSize: 'var(--t-xxl)', fontWeight: 700, color: 'var(--maths-deep)', padding: '0 var(--s2)' };

/** The swap the hint names, drawn: these coins = that coin, each with its cents counted out. */
function TradeRow({ t }: { readonly t: Trade }) {
  return (
    <div style={tradeBox} role="img" aria-label={t.text}>
      {t.from.map((c, i) => <CoinWithCents key={`a${i}`} c={c} />)}
      <span style={eqSign} aria-hidden="true">=</span>
      {t.to.map((c, i) => <CoinWithCents key={`b${i}`} c={c} />)}
    </div>
  );
}

const mat: CSSProperties = {
  display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: 'var(--s3)',
  minHeight: 112, padding: 'var(--s3)',
  background: '#e9c48f', border: '4px solid #8a5a2b', borderRadius: 'var(--radius-sm)',
};
const stack: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const runStyle: CSSProperties = { fontWeight: 700, fontSize: 'var(--t-md)', color: 'var(--maths-deep)' };
const emptyStyle: CSSProperties = {
  display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 2,
  fontFamily: 'var(--font-read)', color: 'var(--ink-soft)', fontSize: 'var(--t-xs)', alignSelf: 'center',
};
const notTodayRow: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s3)' };

/**
 * The empty counter, drawn: one dashed coin spot with an arrow up from the
 * tray below, so where a tapped coin lands is shown before he taps.
 */
function EmptyCounter() {
  return (
    <span style={emptyStyle}>
      <svg viewBox="0 0 64 96" style={{ width: 48, height: 72 }} aria-hidden="true">
        <circle cx="32" cy="28" r="24" fill="#f6e2c0" stroke="#8a5a2b" strokeWidth="3" strokeDasharray="7 5" />
        <path d="M32 92 V60 M20 72 L32 58 L44 72" fill="none" stroke="var(--maths-deep)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span aria-hidden="true">tap a coin</span>
    </span>
  );
}
/** An empty coin spot on the counter, as big as a tappable piece so the row lines up. */
const spotStyle: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 'var(--tap)', minHeight: 'var(--tap)' };

/**
 * On "exactly N coins" rounds the counter shows N empty coin spots, so the
 * count is on the board and not only in the prompt. All spots are one size:
 * a spot never tells him which coin goes there.
 */
function Spot() {
  return (
    <span style={spotStyle} aria-hidden="true">
      <svg viewBox="0 0 100 100" style={{ width: 52, height: 52 }}>
        <circle cx="50" cy="50" r="46" fill="#f6e2c0" stroke="#8a5a2b" strokeWidth="5" strokeDasharray="12 9" />
      </svg>
    </span>
  );
}
const equationStyle: CSSProperties = {
  margin: 0, textAlign: 'center', fontWeight: 700, fontSize: 'var(--t-xl)', color: 'var(--maths-deep)',
};

function Board({ round, level, answer, setAnswer, stage }: BoardProps<Round, Answer>) {
  const locked = stage === 'solved' || stage === 'worked';
  const worked = stage === 'worked';
  const showTotals = stage !== 'answering';
  // The worked answer is drawn ON the counter: the coins that pay it.
  const onCounter = worked ? solution(round) : answer;
  const full = answer.length >= MAX_COINS;
  const start = round.mode === 'change' ? round.price : 0;
  const runs = onCounter.reduce<number[]>((acc, c) => [...acc, (acc.length ? acc[acc.length - 1] : start) + c], []);
  const isChange = round.mode === 'change';
  const spots = round.mode === 'count' && !worked ? Math.max(0, round.exactly - onCounter.length) : 0;
  const matLabel = isChange
    ? 'The counter: the change you give'
    : round.mode === 'count'
      ? `The counter: spots for exactly ${coinsWord(round.exactly)}`
      : 'The counter: the coins you pay';
  const notToday = (level === 1 ? SMALL : ALL_COINS).filter((c) => !round.coins.includes(c));
  const swap =
    stage === 'hint' && round.mode === 'fewest' && sum(answer) === round.price && answer.length > fewestCoins(round.price, round.coins).length
      ? trade(answer)
      : null;

  return (
    <div className="board">
      <Counter round={round} />
      <CentLines round={round} coins={onCounter} showCoins={showTotals} />
      <div style={mat} role="group" aria-label={matLabel}>
        {onCounter.map((c, i) => (
          <div key={i} style={stack}>
            <Piece
              tone={worked ? 'worked' : 'placed'}
              onTap={locked ? undefined : () => setAnswer(answer.filter((_, j) => j !== i))}
              ariaLabel={locked ? `A ${NAME[c][0]}, ${c} cents` : `Take back the ${NAME[c][0]}, ${c} cents`}
            >
              <CoinWithCents c={c} />
            </Piece>
            {showTotals ? <span style={runStyle}>{cents(runs[i])}</span> : null}
          </div>
        ))}
        {Array.from({ length: spots }, (_, i) => <Spot key={`spot${i}`} />)}
        {onCounter.length === 0 && spots === 0 ? <EmptyCounter /> : null}
      </div>
      {swap ? <TradeRow t={swap} /> : null}
      {showTotals ? (
        <p className="board-caption">
          {isChange
            ? `Counting up from ${cents(round.price)}: ${coinsWord(onCounter.length)} of change reach ${cents(runs.length ? runs[runs.length - 1] : start)}.`
            : `${coinsWord(onCounter.length)}, worth ${cents(sum(onCounter))}. The number under each coin is the total so far.`}
        </p>
      ) : null}
      {worked ? (
        <p style={equationStyle}>
          {isChange
            ? `${cents(round.price)} + ${expr(onCounter)} = 100¢`
            : `${expr(onCounter)} = ${cents(round.price)}`}
        </p>
      ) : null}
      {worked ? <p className="board-caption">{`${tallyWords(onCounter)}: ${coinsWord(onCounter.length)}.`}</p> : null}
      <Tray label="Coins">
        {round.coins.map((c) => (
          <Piece
            key={c}
            tone={locked || full ? 'ghost' : 'source'}
            onTap={locked || full ? undefined : () => setAnswer([...answer, c])}
            ariaLabel={`Put a ${NAME[c][0]}, ${c} cents, on the counter`}
          >
            <CoinWithCents c={c} name />
          </Piece>
        ))}
      </Tray>
      {full && !locked ? <p className="board-caption">{`The counter holds ${MAX_COINS} coins. It is full.`}</p> : null}
      {!worked && notToday.length > 0 ? (
        <div style={notTodayRow} role="img" aria-label={`The shop takes only these coins today: ${round.coins.map((c) => NAME[c][1]).join(', ')}. Not today: ${notToday.map((c) => NAME[c][1]).join(', ')}.`}>
          {notToday.map((c) => <CoinFace key={c} c={c} crossed />)}
          <span className="board-caption" aria-hidden="true">not today</span>
        </div>
      ) : null}
    </div>
  );
}

export const canYouPayExactly: SolveGame<Round, Answer> = {
  kind: 'solve',
  id: 'can-you-pay-exactly',
  title: 'Can You Pay Exactly?',
  hook: 'Count the cents, not the coins.',
  group: 'measure',
  levels: ['Pennies, nickels, dimes', 'The quarter arrives', 'Fewest coins and change'],
  generate,
  prompt,
  emptyAnswer: () => [],
  Board,
  check,
  explain,
  cover: 'art/games/can-you-pay-exactly.png',
  note: {
    what: "A shop counter, like the fruit stand at the Saturday farmers market, with one item and its price tag. He taps US coins in the tray to put them on the counter until they make the price, and taps a coin on the counter to take it back. At level 3 he either pays with the fewest coins or gives the change from a dollar.",
    expect: "A common first move is to put down as many coins as the price says: 7 coins for 7¢ works only if all seven are pennies. The second break is size: the dime is the smallest coin, and many children rank it below the nickel. 'Exactly 3 coins' rounds at level 2 are where he must hold the count and the value apart.",
    practising: "Coin values as separate from coin count and coin size: a dime is 10¢ though it is smallest. Adding mixed values (counting on by 25, 10, 5, then 1), making one amount several ways, the fewest-coins (greedy) method, and change as counting up from the price to 100¢.",
    ask: "When the totals appear after a Check, point at the coins: 'How many coins are there? And how many cents? Why are those two numbers different?'",
    next: "Put real pennies, nickels, dimes and quarters on the table and price three things from the fruit bowl. Let him pay you, then you pay him with a dollar bill and he counts the change up out loud.",
    honest: "Paying correctly here does not mean he knows coins by sight: every coin on the screen has its value printed on it as a number, and real US coins give their value only in words (ONE CENT, FIVE CENTS, ONE DIME, QUARTER DOLLAR); the only numerals on them are years. Ask him to sort a handful of real coins by name before you count on this.",
    easier: "Stay on level 1 and give him real pennies and nickels beside the screen, so he can trade 5 pennies for 1 nickel with his hands.",
    harder: "Before he taps anything, ask him how many coins he will need and which ones. At level 3, ask for a second way to pay the same price.",
    safety: "Real coins are a choking hazard for his 2-year-old sister, and the dime is the smallest of them: do the coin shop at a table she cannot reach and count every coin back into the purse afterwards.",
  },
};

export default canYouPayExactly;
