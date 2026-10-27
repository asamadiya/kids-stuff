import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../maths/games/how-long-is-that-dinosaur';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for How Long Is That Dinosaur?: `board()` names exactly the words
 * the board renders, in screen order, and `hints()` lists every hint `check()`
 * can give for an answer the board can actually hold.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const board = game.board!;
const hints = game.hints!;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

/** Every answer reachable by tapping the board's choices, starting from the empty answer, two taps deep. */
function reachable(round: Round, level: Level): Answer[] {
  const seen = new Map<string, Answer>([[JSON.stringify(game.emptyAnswer(round)), game.emptyAnswer(round)]]);
  let frontier: Answer[] = [game.emptyAnswer(round)];
  for (let depth = 0; depth < 2; depth++) {
    const next: Answer[] = [];
    for (const answer of frontier) {
      const taps: Answer[] = [];
      const { container } = render(<game.Board round={round} level={level} answer={answer} setAnswer={(a) => taps.push(a)} stage="answering" />);
      for (const b of container.querySelectorAll('button.choice')) fireEvent.click(b);
      cleanup();
      for (const a of taps) {
        const k = JSON.stringify(a);
        if (!seen.has(k)) {
          seen.set(k, a);
          next.push(a);
        }
      }
    }
    frontier = next;
  }
  return [...seen.values()];
}

afterEach(cleanup);

describe('how-long-is-that-dinosaur read-aloud', () => {
  it('board() lines are rendered by the board, exactly and in screen order, at every stage', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const lines = board(round, level, stage);
        const { container } = render(<game.Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
        const els = [...container.querySelectorAll('*')];
        let at = -1;
        for (const line of lines) {
          const found = els.findIndex((el, j) => j > at && norm(el.textContent) === line);
          expect(found, `L${level} #${i} ${stage}: "${line}"`).toBeGreaterThan(at);
          at = found;
        }
        cleanup();
      }
    }
  });

  it('board() reads the worked line only at the worked stage', () => {
    for (const { level, round } of rounds) {
      const answering = board(round, level, 'answering');
      expect(board(round, level, 'hint')).toEqual(answering);
      expect(board(round, level, 'solved')).toEqual(answering);
      expect(board(round, level, 'worked')).toHaveLength(answering.length + 1);
    }
  });

  it('hints() holds every hint check() gives for an answer the board can hold', () => {
    for (const { level, i, round } of rounds) {
      const listed = hints(round);
      const listedSentences = new Set(listed.flatMap(sentences));
      const answers = reachable(round, level);
      expect(answers.length, `L${level} #${i}`).toBe(level === 3 ? 4 : 5);
      const given = new Set<string>();
      for (const answer of answers) {
        const v = game.check(round, answer);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${String(answer)}`).toBeTruthy();
        given.add(v.hint!);
        for (const s of sentences(v.hint!)) expect(listedSentences.has(s), `L${level} #${i} ${String(answer)}: "${s}"`).toBe(true);
      }
      // Nothing listed that check() never gives.
      expect([...given].sort()).toEqual([...listed].sort());
    }
  });

  it('has no empty or over-long entry', () => {
    const all = [
      ...rounds.flatMap(({ level, round }) => STAGES.flatMap((stage) => board(round, level, stage))),
      ...rounds.flatMap(({ round }) => hints(round).flatMap((h) => [h, ...sentences(h)])),
      ...gameLines(game),
    ];
    for (const s of all) {
      expect(s.trim().length, JSON.stringify(s)).toBeGreaterThan(0);
      expect(s.length, s).toBeLessThanOrEqual(300);
    }
  });

  it('gameLines covers every board line and hint sentence', () => {
    const lines = new Set(gameLines(game));
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((stage) => board(round, level, stage))));
    const hintSentences = new Set(rounds.flatMap(({ round }) => hints(round).flatMap(sentences)));
    for (const s of [...boardLines, ...hintSentences]) expect(lines.has(s), s).toBe(true);
    console.log(`how-long-is-that-dinosaur: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
  });
});
