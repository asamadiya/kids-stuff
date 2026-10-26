import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import game, { solution, type Answer, type Round } from '../maths/games/can-you-pay-exactly';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Can You Pay Exactly?: `board()` is the worked caption only,
 * exactly as drawn; `hints()` covers every hint sentence that does not restate
 * the child's own coins, and the ones it skips are only those restatements.
 */
const LEVELS: readonly Level[] = [1, 2, 3];
const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: 40 }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
/** The sentences about his own coins, which the board draws and the shell may skip. */
const RESTATES = /^(Your \d+ coins? makes? \d+¢\.|\d+¢ and your \d+¢ make \d+¢\.|\d+¢ in \d+ coins?\.)$/;

/** Coin multisets up to `max` coins from the round's coins, by count per coin. */
function answers(round: Round, max: number): Answer[] {
  const out: Answer[] = [];
  const coins = round.coins;
  const walk = (k: number, acc: number[]) => {
    if (k === coins.length) {
      out.push(acc as unknown as Answer);
      return;
    }
    for (let n = 0; acc.length + n <= max; n += 1) walk(k + 1, [...acc, ...Array(n).fill(coins[k])]);
  };
  walk(0, []);
  return out;
}

afterEach(cleanup);

describe('can-you-pay-exactly read-aloud', () => {
  it.each(ROUNDS)('L$level #$i: the worked caption is drawn exactly', ({ level, round }) => {
    for (const stage of ['answering', 'hint', 'worked', 'solved'] as const) {
      const { container } = render(<game.Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
      const text = norm(container.textContent ?? '');
      for (const line of game.board!(round, level, stage)) expect(text, `${stage}: ${line}`).toContain(norm(line));
      cleanup();
    }
    expect(game.board!(round, level, 'answering')).toEqual([]);
    expect(game.board!(round, level, 'worked')).toHaveLength(1);
  });

  it.each(ROUNDS.filter((r) => r.i < 8))('L$level #$i: every hint sentence is listed or restates his coins', ({ round }) => {
    const listed = new Set(game.hints!(round));
    const max = round.mode === 'count' ? Math.max(round.exactly + 2, 8) : 8;
    for (const a of answers(round, max)) {
      const v = game.check(round, a);
      if (v.ok || !v.hint) continue;
      for (const s of sentences(v.hint)) {
        if (!listed.has(s)) expect(s, `unlisted for ${JSON.stringify(a)}`).toMatch(RESTATES);
      }
    }
    expect(game.check(round, solution(round)).ok).toBe(true);
  });

  it('gives the clip builder only short, non-empty lines', () => {
    const lines = gameLines(game);
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.every((l) => l.length > 0 && l.length <= 300)).toBe(true);
  });
});
