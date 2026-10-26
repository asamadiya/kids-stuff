import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../science/games/a-trex-beside-a-bus';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for A T. rex Beside a Bus: `board()` names exactly the words the
 * board renders, in screen order, at every stage; it covers every word under
 * a choice and every caption; and no entry is empty or over-long. An
 * investigation has no `check()`, so there is no `hints()`: the hint is the
 * board's own caption at 'hint', which `board()` reads.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const board = game.board!;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

/** Every answer the board offers: nothing yet, or one of its choices. */
const offered = (round: Round): readonly Answer[] =>
  round.mode === 'count' ? [null, ...round.options] : [null, ...round.lanes.map((l) => l.id), ...(round.mode === 'longer' ? ['same' as const] : [])];

/**
 * Where a line sits on screen. Inside the frame picture, top to bottom by the
 * text's y; then the rest of the board in document order. A caption of two
 * sentences is one element, so a sentence's place within it breaks the tie.
 */
type Key = readonly [number, number, number];
const START: Key = [-1, -1, -1];
const cmp = (a: Key, b: Key) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** The first place on screen after `after` that shows `line` exactly, whole or as one sentence of a caption. */
function place(container: HTMLElement, line: string, after: Key = START): Key | null {
  const leaves = [...container.querySelectorAll('*')].filter((el) => el.children.length === 0);
  const at: Key[] = [];
  for (const [j, el] of leaves.entries()) {
    const text = norm(el.textContent);
    const s = text === line ? 0 : sentences(text).indexOf(line);
    if (s >= 0) at.push(el.closest('svg.board-svg') ? [0, Number(el.getAttribute('y')), s] : [1, j, s]);
  }
  return at.filter((k) => cmp(k, after) > 0).sort(cmp)[0] ?? null;
}

function renderBoard(round: Round, level: Level, stage: (typeof STAGES)[number], answer: Answer = game.emptyAnswer(round)) {
  return render(<game.Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />).container;
}

afterEach(cleanup);

describe('a-trex-beside-a-bus read-aloud', () => {
  it('board() lines are rendered by the board, exactly and in screen order, at every stage', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const container = renderBoard(round, level, stage);
        let last = START;
        for (const line of board(round, level, stage)) {
          const at = place(container, line, last);
          expect(at, `L${level} #${i} ${stage}: "${line}" missing or out of order`).not.toBeNull();
          last = at!;
        }
        cleanup();
      }
    }
  });

  it('board() reads every word under a choice and every caption the board shows', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const container = renderBoard(round, level, stage);
        const lines = board(round, level, stage);
        const words = [...container.querySelectorAll('.choices *, .board-caption')]
          .filter((el) => el.children.length === 0)
          .map((el) => norm(el.textContent))
          .filter((t) => /[A-Za-z]/.test(t));
        for (const w of words) expect(sentences(w).every((s) => lines.includes(s)), `L${level} #${i} ${stage}: "${w}"`).toBe(true);
        cleanup();
      }
    }
  });

  it('board() is what the board shows whatever he has chosen', () => {
    for (const { level, i, round } of rounds.filter(({ i }) => i < 6)) {
      for (const stage of STAGES) {
        for (const answer of offered(round)) {
          const container = renderBoard(round, level, stage, answer);
          for (const line of board(round, level, stage)) expect(place(container, line), `L${level} #${i} ${stage} ${String(answer)}: "${line}"`).not.toBeNull();
          cleanup();
        }
      }
    }
  });

  it('board() reads a caption only at hint and worked', () => {
    for (const { level, round } of rounds) {
      const answering = board(round, level, 'answering');
      expect(board(round, level, 'solved')).toEqual(answering);
      expect(board(round, level, 'hint').length).toBeGreaterThan(answering.length);
      expect(board(round, level, 'worked').length).toBeGreaterThan(answering.length);
    }
  });

  it('is an investigation, so it lists no hints', () => {
    expect(game.kind).toBe('investigate');
    expect('hints' in game).toBe(false);
  });

  it('has no empty or over-long entry, and gameLines covers every board line', () => {
    const lines = gameLines(game);
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((stage) => board(round, level, stage))));
    for (const s of [...boardLines, ...lines]) {
      expect(s.trim().length, JSON.stringify(s)).toBeGreaterThan(0);
      expect(s.length, s).toBeLessThanOrEqual(300);
    }
    const listed = new Set(lines);
    for (const s of boardLines) expect(listed.has(s), s).toBe(true);
    console.log(`a-trex-beside-a-bus: gameLines ${listed.size}, board lines ${boardLines.size}, hint sentences 0`);
  });
});
