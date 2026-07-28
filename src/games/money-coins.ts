import { placeOptions } from './options';

/**
 * Coin Counter — how much money is on the table.
 *
 * The first version asked `10c + 10c + 10c + 10c + 1c + 1c = how many cents?`
 * and drew every coin at the same size with its value stamped on the face, in a
 * row marked `aria-hidden`. The question contained its own answer, the coins
 * were decoration, and the one thing worth learning — that a dime is ten and a
 * nickel is five, and that you tell them apart by looking — never came up.
 *
 * So the prompt no longer names any value. The coins carry the legends real US
 * coins carry (which are words, not numerals: a dime says ONE DIME) at their
 * real relative diameters, and each rendered coin exposes `data-kind`, so the
 * total on the table can be recomputed from the picture — which is what
 * `src/test/money-coins.test.ts` does.
 */

export const MONEY_COINS_META = {
  id: 'money-coins',
  title: 'Money',
  icon: '🪙',
  color: 'aqua',
  tagline: 'Dimes, nickels and pennies, added up in cents.',
} as const;

export type CoinKind = 'dime' | 'nickel' | 'penny';

/** Display order: biggest value first, which is also how you count a handful. */
export const COIN_KINDS: readonly CoinKind[] = ['dime', 'nickel', 'penny'];

export const COIN_VALUE: Record<CoinKind, number> = {
  dime: 10,
  nickel: 5,
  penny: 1,
};

export const COIN_LABEL: Record<CoinKind, string> = {
  dime: 'Dime',
  nickel: 'Nickel',
  penny: 'Penny',
};

/** Written out, never derived: "penny" pluralises to "pennies", not "pennys". */
export const COIN_PLURAL: Record<CoinKind, string> = {
  dime: 'Dimes',
  nickel: 'Nickels',
  penny: 'Pennies',
};

/**
 * What is actually written on the coin. No US circulating coin prints its value
 * as a numeral — the dime says ONE DIME, the nickel FIVE CENTS, the cent ONE
 * CENT — so a face with "10c" on it was never a picture of a dime.
 */
export const COIN_LEGEND: Record<CoinKind, string> = {
  dime: 'ONE DIME',
  nickel: 'FIVE CENTS',
  penny: 'ONE CENT',
};

/** Diameter in millimetres, US Mint specification. A dime is the smallest of the three. */
export const COIN_MM: Record<CoinKind, number> = {
  dime: 17.91,
  nickel: 21.21,
  penny: 19.05,
};

/** Edge finish — the other way to tell a dime from a penny without looking. */
export const COIN_EDGE: Record<CoinKind, string> = {
  dime: 'reeded',
  nickel: 'smooth',
  penny: 'smooth',
};

/**
 * Ink sampled from `src/styles/tokens.css`. Cupronickel coins in sunken paper,
 * the cent in terracotta; the test checks these still match the tokens.
 */
export const MONEY_PALETTE = {
  silver: '#eae4d5', // --paper-sunken
  silverLine: '#4b4739', // --ink-soft
  copper: '#9e4b27', // --terracotta
  copperLine: '#22211b', // --ink
  copperInk: '#f4f0e6', // --paper
} as const;

export interface CoinFace {
  readonly fill: string;
  readonly line: string;
  readonly ink: string;
}

/** Dimes and nickels are the same alloy and the same colour; size and legend tell them apart. */
export const COIN_FACE: Record<CoinKind, CoinFace> = {
  dime: { fill: MONEY_PALETTE.silver, line: MONEY_PALETTE.silverLine, ink: MONEY_PALETTE.silverLine },
  nickel: { fill: MONEY_PALETTE.silver, line: MONEY_PALETTE.silverLine, ink: MONEY_PALETTE.silverLine },
  penny: { fill: MONEY_PALETTE.copper, line: MONEY_PALETTE.copperLine, ink: MONEY_PALETTE.copperInk },
};

/** Pixels per millimetre. One scale for every coin, so the sizes stay in proportion. */
export const COIN_PX_PER_MM = 3.2;

/** The question. It names no coin and no number: the coins on the table are the question. */
export const MONEY_PROMPT = 'How much is this?';

export interface CoinCount {
  kind: CoinKind;
  count: number;
}

export interface MoneyRound {
  /** Coins present in the round, in display order (dimes, then nickels, then pennies). */
  coins: CoinCount[];
}

/** The coins on the table, one entry per coin, in the order they are laid out. */
export function coinsOf(round: MoneyRound): CoinKind[] {
  const out: CoinKind[] = [];
  for (const c of round.coins) {
    for (let i = 0; i < c.count; i += 1) out.push(c.kind);
  }
  return out;
}

/**
 * Add up a handful of coins. The component lays out `coinsOf(round)` and the
 * test reads the kinds back off the rendered coins and calls this, so the total
 * being scored is the total that is on the screen.
 */
export function totalOf(kinds: readonly CoinKind[]): number {
  return kinds.reduce((sum, kind) => sum + COIN_VALUE[kind], 0);
}

/** Sum a round's coins to its total in cents. */
export function roundTotal(round: MoneyRound): number {
  return totalOf(coinsOf(round));
}

/** Total number of coins in a round. */
export function roundCoinCount(round: MoneyRound): number {
  return coinsOf(round).length;
}

const d = (count: number): CoinCount => ({ kind: 'dime', count });
const n = (count: number): CoinCount => ({ kind: 'nickel', count });
const p = (count: number): CoinCount => ({ kind: 'penny', count });

const mk = (...coins: CoinCount[]): MoneyRound => ({
  coins: coins.filter((c) => c.count > 0),
});

// 14 varied rounds, every total <= 50c.
export const MONEY_ROUNDS: MoneyRound[] = [
  mk(d(1), n(1), p(1)),        // 16
  mk(d(2), p(3)),              // 23
  mk(n(2), p(2)),              // 12
  mk(d(1), n(2)),              // 20
  mk(d(3)),                    // 30
  mk(n(3), p(4)),              // 19
  mk(d(2), n(1), p(1)),        // 26
  mk(p(7)),                    // 7
  mk(d(4), n(1)),              // 45
  mk(d(1), n(1), p(4)),        // 19
  mk(n(4)),                    // 20
  mk(d(3), n(1), p(3)),        // 38
  mk(d(2), n(2)),              // 30
  mk(d(4), p(2)),              // 42
];

/** Stable option-list length for every round. */
export const MONEY_OPTION_COUNT = 4;

/**
 * Deterministic option builder. Always includes the correct total, pads with
 * plausible near-miss distractors, and returns exactly MONEY_OPTION_COUNT.
 * Totals are all <= 50c so options stay in range.
 */
export function getMoneyOptions(index: number): number[] {
  const round = MONEY_ROUNDS[index % MONEY_ROUNDS.length];
  const answer = roundTotal(round);

  // Deterministic candidate deltas seeded by the answer — common counting slips.
  const deltas = [answer % 2 === 0 ? -5 : -4, 5, -1, 4, 10, -10, 1];
  const opts = new Set<number>([answer]);

  for (const delta of deltas) {
    if (opts.size >= MONEY_OPTION_COUNT) break;
    const candidate = answer + delta;
    if (candidate > 0 && candidate <= 60 && candidate !== answer) {
      opts.add(candidate);
    }
  }

  // Guarantee fill if distractors collided out of range.
  let bump = 1;
  while (opts.size < MONEY_OPTION_COUNT) {
    const candidate = answer + bump;
    if (candidate > 0 && candidate <= 60) opts.add(candidate);
    bump += 1;
  }

  const rest = Array.from(opts).filter((v) => v !== answer);
  return placeOptions({
    gameId: 'money-coins', roundIndex: index % MONEY_ROUNDS.length, answer,
    distractors: [...rest, answer - 5, answer + 5, answer - 1, answer + 1, answer - 10, answer + 10]
      .filter((v) => v > 0 && v <= 99 && v !== answer), count: MONEY_OPTION_COUNT,
  });
}

/** Format a cents value with the cent sign, e.g. 16 -> "16¢". */
export function centsLabel(cents: number): string {
  return `${cents}¢`;
}

/** The sum written out: "1 dime (10¢) + 1 nickel (5¢) + 1 penny (1¢)". */
export function roundBreakdown(round: MoneyRound): string {
  return round.coins
    .map((c) => {
      const name = c.count === 1 ? COIN_LABEL[c.kind] : COIN_PLURAL[c.kind];
      return `${c.count} ${name.toLowerCase()} (${centsLabel(COIN_VALUE[c.kind])})`;
    })
    .join(' + ');
}

/** States the sum. Does not grade the child, and does not withhold the working. */
export function getMoneyFeedback(index: number, selected: number): string {
  const round = MONEY_ROUNDS[index % MONEY_ROUNDS.length];
  const answer = roundTotal(round);
  const sum = `${roundBreakdown(round)} = ${centsLabel(answer)}`;
  if (selected === answer) return `Correct. ${sum}.`;
  return `That is ${centsLabel(selected)}. On the table: ${sum}.`;
}
