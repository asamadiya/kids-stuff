import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import game, { type Answer, type Round } from '../maths/games/how-many-do-you-see';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for How Many Do You See?: the board's words and every hint
 * sentence must be listable in advance, or the read buttons ask for a line
 * with no clip.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const satisfies readonly BoardProps<Round, Answer>['stage'][];
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

afterEach(cleanup);

describe('how-many-do-you-see read-aloud', () => {
  it('board() is exactly the words the board shows, at every level, index and stage', () => {
    const { Board, board } = game;
    expect(board).toBeDefined();
    for (const { level, round } of rounds) {
      for (const stage of STAGES) {
        const lines = board!(round, level, stage);
        const { container } = render(
          <Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />,
        );
        const texts = [...container.querySelectorAll('*')].map((el) => norm(el.textContent));
        for (const line of lines) expect(texts, `${level}/${stage}: ${line}`).toContain(norm(line));
        // And the converse: every caption the board draws is listed.
        const captions = [...container.querySelectorAll('.board-caption')].map((el) => norm(el.textContent));
        expect(captions).toEqual(lines.map(norm));
        cleanup();
      }
    }
  });

  it('reads the worked number sentence at worked, and nothing at the other stages', () => {
    const frames = game.generate(3, 2);
    expect(game.board!(frames, 3, 'worked')).toEqual(['7 + 9 = 10 + 6 = 16']);
    expect(game.board!(game.generate(1, 0), 1, 'worked')).toEqual(['2 + 2 = 4']);
    for (const stage of ['answering', 'hint', 'solved'] as const) expect(game.board!(frames, 3, stage)).toEqual([]);
  });

  it('hints(round) covers every hint sentence check() returns for every answer the board can produce', () => {
    for (const { round } of rounds) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      // The board's answers: nothing tapped yet, or one of the four choices.
      const answers: Answer[] = [game.emptyAnswer(round), ...round.choices];
      for (const answer of answers) {
        const v = game.check(round, answer);
        if (v.ok) continue;
        for (const s of sentences(v.hint!)) expect(listed, `${round.layout} ${round.parts} -> ${answer}: ${s}`).toContain(s);
      }
    }
  });

  it('no line is empty or over 300 characters', () => {
    for (const { level, round } of rounds) {
      const lines = [...STAGES.flatMap((st) => game.board!(round, level, st)), ...game.hints!(round).flatMap(sentences)];
      for (const line of lines) {
        expect(line.trim().length).toBeGreaterThan(0);
        expect(line.length).toBeLessThanOrEqual(300);
      }
    }
  });

  it('gameLines lists every board line and hint sentence', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((st) => game.board!(round, level, st))));
    const hintSentences = new Set(rounds.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    for (const x of [...boardLines, ...hintSentences]) expect(all).toContain(x);
    console.log(`how-many-do-you-see: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
  });
});
