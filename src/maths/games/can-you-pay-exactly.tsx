import type { CSSProperties } from 'react';
import type { BoardProps, Level, SolveGame, Verdict } from '../../play/types';
import { Piece, Tray } from '../../play/parts';

/**
 * Can You Pay Exactly? — coin values differ from coin counts.
 *
 * Concept (advisor, maths 17; money starts with US coins, rupees come later
 * in a separate setting): three coins can be 3¢ or 75¢. The misconceptions
 * it attacks are counting coins instead of their values, and reading value
 * from size — the dime is the SMALLEST coin and worth more than the bigger
 * nickel and penny. Every coin is drawn at its true relative diameter
 * (penny 19.05 mm, nickel 21.21 mm, dime 17.91 mm, quarter 24.26 mm) in its
 * real metal colour, and the dime and quarter carry their reeded edges. The
 * face shows the value in cents (a real dime says ONE DIME), so the value
 * is never in doubt and the size never stands in for it.
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
 * the counter; tapping a coin on the counter takes it back. No totals are
 * shown while he answers. On 'hint' each coin gets its running total and two
 * value bars appear at one scale (price, and his coins as segments as long
 * as their values). On 'worked' the counter holds the solution. On "exactly N
 * coins" rounds the counter shows N empty coin spots, all one size, so the
 * count is on the board and not only in the prompt. Every state is a fixed
 * drawing.
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
  /** change rounds: who handed over the dollar. */
  readonly payer: 'Papa' | 'Mummy';
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
  mode: 'pay', item, price, coins, exactly: 0, payer: 'Papa',
});
const count = (item: Item, price: number, exactly: number, coins: readonly Coin[]): Round => ({
  mode: 'count', item, price, coins, exactly, payer: 'Papa',
});
const fewest = (item: Item, price: number): Round => ({
  mode: 'fewest', item, price, coins: ALL_COINS, exactly: 0, payer: 'Papa',
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
    fewest('mango', 41), change('pencil', 65, 'Papa'), fewest('notebook', 68), change('banana', 30, 'Mummy'),
    fewest('dinosaur', 90), change('eraser', 45, 'Papa'), fewest('carrot', 29), change('notebook', 85, 'Mummy'),
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

/**
 * A swap that makes the same value with fewer coins. US coins are canonical:
 * if none of these applies, the coins are already the fewest for their total.
 */
function trade(answer: Answer): string | null {
  const t = tally(answer);
  if (t[1] >= 5) return '5 pennies make 5¢, the same as 1 nickel.';
  if (t[5] >= 2) return '2 nickels make 10¢, the same as 1 dime.';
  if (t[10] >= 2 && t[5] >= 1) return '2 dimes and a nickel make 25¢, the same as 1 quarter.';
  if (t[10] >= 3) return '3 dimes make 30¢, the same as a quarter and a nickel.';
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
    return { ok: false, hint: `${cents(total)} in ${coinsWord(n)}. ${trade(answer) ?? ''}`.trim() };
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

/** One coin, face up, at its true relative size. */
function CoinFace({ c }: { readonly c: Coin }) {
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
    </svg>
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

const BAR_X = 150;
const BAR_W = 700;

/**
 * Two bars at one scale: what must be paid (the price, or the dollar with the
 * price inside it) and the coins on the counter, each coin as long as its
 * value. The dashed line marks where the coins must end.
 */
function ValueBars({ round, coins }: { readonly round: Round; readonly coins: Answer }) {
  const isChange = round.mode === 'change';
  const start = isChange ? round.price : 0;
  const goal = isChange ? DOLLAR : round.price;
  const total = sum(coins);
  const reach = start + total;
  const px = BAR_W / Math.max(goal, reach, 1);
  const x = (c: number) => BAR_X + c * px;
  let run = start;
  const segs = coins.map((c) => {
    const from = run;
    run += c;
    return { c, from };
  });
  const label = isChange
    ? `Top: a dollar, 100 cents, with the ${round.price} cent price inside it. Bottom: the price and then your coins, reaching ${reach} cents.`
    : `Top: the price, ${round.price} cents. Bottom: your ${coinsWord(coins.length)}, ${total} cents.`;
  return (
    <svg className="board-svg" viewBox="0 0 960 190" role="img" aria-label={label}>
      <text x="20" y="58" fontSize="22" fontWeight="700" fill={INK}>{isChange ? 'a dollar' : 'price'}</text>
      {isChange ? (
        <>
          <rect x={x(0)} y="30" width={round.price * px} height="40" fill="#f1d9a6" stroke={INK} strokeWidth="2.5" />
          <text x={x(round.price / 2)} y="58" textAnchor="middle" fontSize="20" fontWeight="700" fill={INK}>{`${round.price}¢`}</text>
          <rect x={x(round.price)} y="30" width={(DOLLAR - round.price) * px} height="40" fill="#ffffff" stroke={INK} strokeWidth="2.5" strokeDasharray="8 6" />
          <text x={x((round.price + DOLLAR) / 2)} y="58" textAnchor="middle" fontSize="20" fill={INK}>change</text>
        </>
      ) : (
        <rect x={x(0)} y="30" width={round.price * px} height="40" fill="#f1d9a6" stroke={INK} strokeWidth="2.5" />
      )}
      <text x={x(goal) + 8} y="58" fontSize="22" fontWeight="700" fill={INK}>{`${goal}¢`}</text>

      <text x="20" y="128" fontSize="22" fontWeight="700" fill={INK}>coins</text>
      {isChange ? <rect x={x(0)} y="100" width={round.price * px} height="40" fill="#f1d9a6" opacity="0.6" stroke={INK} strokeWidth="1.5" /> : null}
      {segs.map(({ c, from }, i) => (
        <g key={i}>
          <rect x={x(from)} y="100" width={c * px} height="40" fill={FILL[c]} stroke={INK} strokeWidth="2" />
          {c * px >= 34 ? (
            <text x={x(from + c / 2)} y="127" textAnchor="middle" fontSize="18" fontWeight="700" fill={INK}>{c}</text>
          ) : null}
        </g>
      ))}
      <text x={x(reach) + 8} y="128" fontSize="22" fontWeight="700" fill={INK}>{`${reach}¢`}</text>
      <line x1={x(goal)} y1="18" x2={x(goal)} y2="152" stroke={INK} strokeWidth="3" strokeDasharray="6 5" />
      <text x={BAR_X} y="178" fontSize="20" fill={INK}>{`${coinsWord(coins.length)}, ${total}¢`}</text>
    </svg>
  );
}

const mat: CSSProperties = {
  display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'center', gap: 'var(--s3)',
  minHeight: 112, padding: 'var(--s3)',
  background: '#e9c48f', border: '4px solid #8a5a2b', borderRadius: 'var(--radius-sm)',
};
const stack: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const runStyle: CSSProperties = { fontWeight: 700, fontSize: 'var(--t-md)', color: 'var(--maths-deep)' };
const emptyStyle: CSSProperties = { fontFamily: 'var(--font-read)', color: 'var(--ink-soft)', fontSize: 'var(--t-sm)', alignSelf: 'center' };
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

  return (
    <div className="board">
      <Counter round={round} />
      <div style={mat} role="group" aria-label={matLabel}>
        {onCounter.map((c, i) => (
          <div key={i} style={stack}>
            <Piece
              tone={worked ? 'worked' : 'placed'}
              onTap={locked ? undefined : () => setAnswer(answer.filter((_, j) => j !== i))}
              ariaLabel={locked ? `A ${NAME[c][0]}, ${c} cents` : `Take back the ${NAME[c][0]}, ${c} cents`}
            >
              <CoinFace c={c} />
            </Piece>
            {showTotals ? <span style={runStyle}>{cents(runs[i])}</span> : null}
          </div>
        ))}
        {Array.from({ length: spots }, (_, i) => <Spot key={`spot${i}`} />)}
        {onCounter.length === 0 ? <span style={emptyStyle}>tap a coin</span> : null}
      </div>
      {showTotals ? (
        <p className="board-caption">
          {isChange
            ? `Counting up from ${cents(round.price)}: ${coinsWord(onCounter.length)} of change reach ${cents(runs.length ? runs[runs.length - 1] : start)}.`
            : `${coinsWord(onCounter.length)}, worth ${cents(sum(onCounter))}. The number under each coin is the total so far.`}
        </p>
      ) : null}
      {showTotals ? <ValueBars round={round} coins={onCounter} /> : null}
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
            label={NAME[c][0]}
            tone={locked || full ? 'ghost' : 'source'}
            onTap={locked || full ? undefined : () => setAnswer([...answer, c])}
            ariaLabel={`Put a ${NAME[c][0]}, ${c} cents, on the counter`}
          >
            <CoinFace c={c} />
          </Piece>
        ))}
      </Tray>
      {full && !locked ? <p className="board-caption">{`The counter holds ${MAX_COINS} coins. It is full.`}</p> : null}
      {!worked && round.coins.length < (level === 1 ? SMALL : ALL_COINS).length ? (
        <p className="board-caption">{`The shop takes only these coins today: ${round.coins.map((c) => NAME[c][1]).join(', ')}.`}</p>
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
    what: "A shop counter with one item and its price tag. He taps US coins in the tray to put them on the counter until they make the price, and taps a coin on the counter to take it back. At level 3 he either pays with the fewest coins or gives the change from a dollar.",
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
