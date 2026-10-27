import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import whereDidTheIceGo, { type Answer, type Round } from '../science/games/where-did-the-ice-go';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Where Did the Ice Go? (an investigation, so no `hints`):
 * `board()` lists exactly the words the board shows at each stage, in screen
 * order — the word under each answer picture, then the Help caption at 'hint'
 * and the rule and why at 'worked' — and every other worded label the board
 * draws is a picture tag the prompt and `why` already say.
 */

const game = whereDidTheIceGo;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

/** Every answer each level's choices can hold, and nothing yet. */
const ANSWERS: Record<Level, readonly Answer[]> = {
  1: [null, 'ice', 'water'],
  2: [null, 'water', 'dry'],
  3: [null, 'left', 'right', 'same'],
};

/**
 * Worded tags the board draws that `board()` leaves out on purpose: the setup's
 * "Start" tag, the after picture's time tags and "a drawn model", the steamer's
 * "tiny drops" pointer, and the worked layout's pane titles.
 */
const UNVOICED = new Set([
  'Start',
  'What happens',
  'a drawn model',
  'tiny drops',
  '1 hour later',
  '2 hours later',
  '3 hours later',
  '10 minutes later',
  '20 minutes later',
  'Next morning',
  'Next day',
  'A day later',
  'A week later',
  'Lid lifted',
  'By evening',
]);

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);
/** The board's text without the empty guess slot's "?": the one thing an answer changes, and it is not a word. */
const words = (s: string) => norm(s.replace(/\?/g, ''));

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

afterEach(cleanup);

describe('where-did-the-ice-go board()', () => {
  it('is an investigation with board() and no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect(game.board).toBeTypeOf('function');
    expect('hints' in game).toBe(false);
  });

  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      const text = norm(draw(round, level, stage).container.textContent ?? '');
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
      const choices = [...container.querySelectorAll('button')].map((b) => norm(b.textContent ?? ''));
      expect(choices.length).toBeGreaterThanOrEqual(2);
      expect(choices).toEqual(lines.slice(0, choices.length));
      // The captions under the choices are the rest of the list, one paragraph per entry.
      const captions = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      expect(captions).toEqual(lines.slice(choices.length));
      // Anything else worded is a picture tag.
      const other = [...container.querySelectorAll('svg text, figcaption')].map((e) => norm(e.textContent ?? '')).filter(hasLetter);
      for (const l of other) expect(UNVOICED.has(l), `${stage}: "${l}" is neither listed nor a known tag`).toBe(true);
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: the board shows the same words whatever he guessed', ({ level, round }) => {
    for (const stage of STAGES) {
      const base = words(draw(round, level, stage).container.textContent ?? '');
      cleanup();
      for (const a of ANSWERS[level]) {
        expect(words(draw(round, level, stage, a).container.textContent ?? ''), `${stage} / ${a}`).toBe(base);
        cleanup();
      }
    }
  });

  it('reads the choices at every stage, plus the Help caption at hint and the rule and why at worked', () => {
    for (const { level, round } of ROUNDS) {
      const choices = game.board!(round, level, 'answering');
      expect(choices).toHaveLength(round.kind === 'wrap' ? 3 : 2);
      expect(game.board!(round, level, 'solved')).toEqual(choices);
      const hint = game.board!(round, level, 'hint');
      expect(hint.slice(0, choices.length)).toEqual(choices);
      expect(hint).toHaveLength(choices.length + 1);
      const worked = game.board!(round, level, 'worked');
      expect(worked.slice(0, choices.length)).toEqual(choices);
      expect(worked).toHaveLength(choices.length + 2);
      expect(worked[worked.length - 1]).toBe(game.why(round));
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
    console.log(`where-did-the-ice-go: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0`);
    console.log([...boardLines].join('\n'));
  });
});
