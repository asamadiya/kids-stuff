import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import keepItBalanced, { type Answer, type Round } from '../science/games/keep-it-balanced';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Keep It Balanced (an investigation, so no `hints`): `board()`
 * lists exactly the words the board shows at each stage, in screen order, and
 * every other worded label the board draws is a name the picture and the
 * choice words already carry.
 */

const game = keepItBalanced;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

/** Every answer the board's choices can hold, lever and tower alike, and nothing yet. */
const ANSWERS: readonly Answer[] = [null, 'left', 'level', 'right', 'green', 'neither', 'orange'];

/**
 * Worded labels the board draws that `board()` leaves out on purpose: the floor
 * names (the choice words say them), the outcome's "model picture" tag, and
 * the before/after pane titles of the worked layout.
 */
const UNVOICED = new Set(['Left', 'Right', 'Green', 'Orange', 'model picture', 'Before', 'What happens']);

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

afterEach(cleanup);

describe('keep-it-balanced board()', () => {
  it('is an investigation with board() and no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect(game.board).toBeTypeOf('function');
    expect('hints' in game).toBe(false);
  });

  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      const { container } = draw(round, level, stage);
      const text = norm(container.textContent ?? '');
      let from = 0;
      for (const line of lines) {
        const at = text.indexOf(norm(line), from);
        expect(at, `${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: every worded label is listed or deliberately left out', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage).map(norm);
      const { container } = draw(round, level, stage);
      // The choice words, one per button, open the list.
      const words = [...container.querySelectorAll('button')].map((b) => norm(b.textContent ?? ''));
      expect(words).toEqual(lines.slice(0, words.length));
      // The caption under the choices is the rest of the list, sentence by sentence.
      const caption = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      expect(caption.join(' ')).toBe(lines.slice(words.length).join(' '));
      // Anything else worded is a name the picture carries.
      const other = [...container.querySelectorAll('svg text, figcaption')].map((e) => norm(e.textContent ?? '')).filter(hasLetter);
      for (const l of other) expect(UNVOICED.has(l), `${stage}: "${l}" is neither listed nor a known name`).toBe(true);
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: the board shows the same words whatever he guessed', ({ level, round }) => {
    for (const stage of STAGES) {
      const base = norm(draw(round, level, stage).container.textContent ?? '');
      cleanup();
      for (const a of ANSWERS) {
        expect(norm(draw(round, level, stage, a).container.textContent ?? ''), `${stage} / ${a}`).toBe(base);
        cleanup();
      }
    }
  });

  it('reads the choices at every stage, plus the hint caption at hint and the why at worked', () => {
    for (const { level, round } of ROUNDS) {
      const choices = game.board!(round, level, 'answering');
      expect(choices).toHaveLength(3);
      expect(game.board!(round, level, 'solved')).toEqual(choices);
      expect(game.board!(round, level, 'hint').slice(0, 3)).toEqual(choices);
      expect(game.board!(round, level, 'hint').length).toBeGreaterThan(3);
      expect(game.board!(round, level, 'worked')).toEqual([...choices, game.why(round)]);
    }
  });

  it('never lists an empty line or one over 300 characters', () => {
    for (const { level, round } of ROUNDS)
      for (const stage of STAGES)
        for (const line of game.board!(round, level, stage)) {
          expect(line.trim().length).toBeGreaterThan(0);
          expect(line.length).toBeLessThanOrEqual(300);
        }
  });

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    for (const l of boardLines) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    console.log(`keep-it-balanced: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0`);
    console.log([...boardLines].join('\n'));
  });
});
