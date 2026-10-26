import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../science/games/start-higher-roll-farther';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Start Higher, Roll Farther?: `board()` lists exactly the
 * words the board shows at each stage, in screen order — the word under each
 * answer picture, then the hint or worked caption. An investigation has no
 * `check`, so there is no `hints()`.
 */

const { Board } = game;
const board = game.board!;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const DISTINCT = [...new Map(ROUNDS.map((r) => [`${r.level}:${JSON.stringify(r.round)}`, r])).values()];

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);
}

/** Every answer the board's choices produce. */
function tapped(round: Round, level: Level): Answer[] {
  const seen: Answer[] = [];
  const { container } = draw(round, level, 'answering', game.emptyAnswer(round), (a) => seen.push(a));
  container.querySelectorAll('button.choice').forEach((b) => fireEvent.click(b));
  cleanup();
  return seen;
}

afterEach(cleanup);

describe('start-higher-roll-farther board()', () => {
  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = board(round, level, stage);
      expect(lines.length).toBeGreaterThan(0);
      const { container } = draw(round, level, stage);
      const text = norm(container.textContent);
      let from = 0;
      for (const line of lines) {
        const at = text.indexOf(norm(line), from);
        expect(at, `${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: every choice word and caption on the board is a listed line', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = new Set(board(round, level, stage).map(norm));
      const { container } = draw(round, level, stage);
      const choices = [...container.querySelectorAll('button.choice')];
      expect(choices.length).toBeGreaterThan(0);
      // The word under each picture; the pair pictures also draw the lane letters A and B.
      const words = choices.map((b) => norm(b.querySelector(':scope > span > span:last-child')?.textContent ?? ''));
      for (const w of words) expect(hasLetter(w), `${stage}: a choice with no word`).toBe(true);
      const captions = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent));
      for (const l of [...words, ...captions]) expect(lines.has(l), `${stage}: "${l}" not in board()`).toBe(true);
      // The scene's own SVG text is lane letters, tile and block numbers and "?": drawn, not read.
      for (const t of container.querySelectorAll('.board-svg text')) expect(norm(t.textContent)).toMatch(/^(?:[AB]|\d+|\?)$/);
      cleanup();
    }
  });

  it('never depends on the answer: the same lines whatever is tapped', () => {
    for (const { level, round } of DISTINCT) {
      const answers = tapped(round, level);
      expect(answers.length).toBe(round.kind === 'scale' ? round.options.length : 3);
      for (const stage of STAGES) {
        const lines = board(round, level, stage).map(norm);
        for (const a of answers) {
          const { container } = draw(round, level, stage, a);
          const text = norm(container.textContent);
          for (const l of lines) expect(text.includes(l), `${stage} answer ${a}: "${l}"`).toBe(true);
          cleanup();
        }
      }
    }
  });

  it('never lists an empty line or one over 300 characters', () => {
    for (const { level, round } of ROUNDS)
      for (const stage of STAGES)
        for (const line of board(round, level, stage)) {
          expect(line.trim().length).toBeGreaterThan(0);
          expect(line.length).toBeLessThanOrEqual(300);
        }
  });

  it('is an investigation: no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect('hints' in game).toBe(false);
  });

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => board(round, level, s))));
    for (const l of boardLines) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    const perStage = Object.fromEntries(STAGES.map((s) => [s, new Set(ROUNDS.flatMap(({ level, round }) => board(round, level, s))).size]));
    console.log(`start-higher-roll-farther: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0, per stage ${JSON.stringify(perStage)}`);
    console.log([...boardLines].join('\n'));
  });
});
