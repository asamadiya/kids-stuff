import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import willTheMagnetPickItUp, { type Answer, type Round } from '../science/games/will-the-magnet-pick-it-up';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Will the Magnet Pick It Up? (an investigation, so no
 * `hints`): `board()` reads only words the board draws at that stage, in
 * screen order — the label on the table, the two choice words, then the Help
 * caption or the worked rule.
 */
const game = willTheMagnetPickItUp;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: 40 }, (_, i) => ({ level, i, round: game.generate(level, i) })));

afterEach(cleanup);

describe('will-the-magnet-pick-it-up board()', () => {
  it('is an investigation with board() and no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect(game.board).toBeTypeOf('function');
    expect('hints' in game).toBe(false);
  });

  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES as readonly Stage[]) {
      const { container } = render(<Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
      const text = norm(container.textContent ?? '');
      let from = 0;
      for (const line of game.board!(round, level, stage)) {
        const at = text.indexOf(norm(line), from);
        expect(at, `${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it('reads the material label in pick rounds and the caption only at hint and worked', () => {
    const pick = ROUNDS.find((r) => r.round.setup === 'pick')!;
    expect(game.board!(pick.round, pick.level, 'answering')).toHaveLength(3);
    expect(game.board!(pick.round, pick.level, 'hint')).toHaveLength(4);
    const poles = ROUNDS.find((r) => r.round.setup === 'poles')!;
    expect(game.board!(poles.round, poles.level, 'answering')).toEqual(['Pull together', 'Push apart']);
  });

  it('gives the clip builder only short, non-empty lines', () => {
    const lines = gameLines(game);
    expect(lines.every((l) => l.length > 0 && l.length <= 300)).toBe(true);
  });
});
