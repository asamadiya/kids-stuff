import { placeOptions } from './options';
// Coin Counter — pure typed logic module (no React).
// Practical money math: count dimes (10c), nickels (5c), pennies (1c).
// Totals kept <= 50c. Deterministic options always include the correct answer.

export const MONEY_COINS_META = {
  id: 'money-coins',
  title: 'Money',
  icon: '🪙',
  color: 'aqua',
  tagline: 'Dimes, nickels and pennies, added up in cents.',
} as const;

export type CoinKind = 'dime' | 'nickel' | 'penny';

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

export interface CoinCount {
  kind: CoinKind;
  count: number;
}

export interface MoneyRound {
  /** Coins present in the round, in display order (dimes, then nickels, then pennies). */
  coins: CoinCount[];
}

/** Sum a round's coins to its total in cents. */
export function roundTotal(round: MoneyRound): number {
  return round.coins.reduce((sum, c) => sum + COIN_VALUE[c.kind] * c.count, 0);
}

/** Build the "10c + 5c + 1c" style expression string for the prompt. */
export function roundExpression(round: MoneyRound): string {
  const parts: string[] = [];
  for (const c of round.coins) {
    const cents = COIN_VALUE[c.kind];
    for (let i = 0; i < c.count; i += 1) parts.push(`${cents}c`);
  }
  return parts.join(' + ');
}

/** Total number of coins in a round (for aria / summaries). */
export function roundCoinCount(round: MoneyRound): number {
  return round.coins.reduce((sum, c) => sum + c.count, 0);
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
 * plausible near-miss distractors, and returns exactly MONEY_OPTION_COUNT
 * sorted ascending. Totals are all <= 50c so options stay in range.
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
    distractors: rest, count: MONEY_OPTION_COUNT,
  });
}

/** Format a cents value as a friendly label, e.g. 16 -> "16c". */
export function centsLabel(cents: number): string {
  return `${cents}c`;
}

/** A short breakdown like "1 dime + 1 nickel + 1 penny" for feedback. */
export function roundBreakdown(round: MoneyRound): string {
  const parts = round.coins.map((c) => {
    const name = COIN_LABEL[c.kind].toLowerCase();
    const plural = c.count === 1 ? name : COIN_PLURAL[c.kind].toLowerCase();
    return `${c.count} ${plural}`;
  });
  return parts.join(' + ');
}

/** Warm feedback for ANY choice — never says wrong/no/fail. */
export function getMoneyFeedback(index: number, selected: number): string {
  const round = MONEY_ROUNDS[index % MONEY_ROUNDS.length];
  const answer = roundTotal(round);
  const breakdown = roundBreakdown(round);
  if (selected === answer) {
    return `Correct. ${breakdown} adds up to ${answer}c.`;
  }
  return `Not quite. Count them up: ${breakdown} makes ${answer}c. Dimes are 10, nickels 5, pennies 1 — add them all!`;
}
