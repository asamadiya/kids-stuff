import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import whereWillTheLightGo, { type Answer, type Round } from '../science/games/where-will-the-light-go';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Where Will the Light Go? (an investigation, so no `hints`):
 * `board()` lists exactly the words the board shows at each stage, in screen
 * order, and every other worded label the board draws is a name or a
 * measurement the picture carries.
 */

const game = whereWillTheLightGo;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

/** Every answer the board's choices can hold, shadow and mirror alike, and nothing yet. */
const ANSWERS: readonly Answer[] = [null, 'bigger', 'same', 'smaller', 'mango', 'ball', 'dino'];

/**
 * Worded SVG labels that `board()` leaves out on purpose: the "wall" and
 * "flat mirror" names, the scale's "cm", and the heights the bands and blocks
 * draw (a cutout's "10 cm", "shadow 20 cm", the worked "new shadow: 60 cm").
 */
const UNVOICED = /^(?:wall|flat mirror|cm|\d+ cm|shadow \d+ cm|new shadow: \d+ cm)$/;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

afterEach(cleanup);

describe('where-will-the-light-go board()', () => {
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
      // The setup line under the picture opens the list (shadow rounds only), sentence by sentence.
      const svgWords = [...container.querySelectorAll('svg text')].map((e) => norm(e.textContent ?? '')).filter(hasLetter);
      const footer = svgWords.filter((l) => !UNVOICED.test(l));
      const head = round.kind === 'shadow' ? 2 : 0;
      expect(footer).toEqual(head ? [lines.slice(0, head).join(' ')] : []);
      // Then the word under each choice picture.
      const words = [...container.querySelectorAll('button')].map((b) => norm(b.textContent ?? ''));
      expect(words).toHaveLength(3);
      expect(lines.slice(head, head + words.length)).toEqual(words);
      // The caption under the choices is the rest of the list, sentence by sentence.
      const caption = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      expect(caption.join(' ')).toBe(lines.slice(head + words.length).join(' '));
      if (stage === 'answering' || stage === 'solved') expect(caption).toEqual([]);
      else expect(caption).toHaveLength(1);
      // Outside the pictures, the board's only words are the choice words and the caption.
      const prose = container.cloneNode(true) as HTMLElement;
      for (const svg of prose.querySelectorAll('svg')) svg.remove();
      expect(prose.textContent).toBe([...words, ...caption].join(''));
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

  it('reads the setup and choices at every stage, plus the caption at hint and worked', () => {
    for (const { level, round } of ROUNDS) {
      const plain = game.board!(round, level, 'answering');
      expect(game.board!(round, level, 'solved')).toEqual(plain);
      expect(plain).toHaveLength(round.kind === 'shadow' ? 5 : 3);
      expect(plain.slice(-3)).toEqual(round.kind === 'shadow' ? ['Bigger', 'Same size', 'Smaller'] : ['Mango', 'Ball', 'Dinosaur']);
      const hint = game.board!(round, level, 'hint');
      const worked = game.board!(round, level, 'worked');
      expect(hint.slice(0, plain.length)).toEqual(plain);
      expect(worked.slice(0, plain.length)).toEqual(plain);
      expect(hint).toHaveLength(plain.length + 1);
      expect(worked).toHaveLength(plain.length + (round.kind === 'shadow' ? 2 : 1));
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
    console.log(`where-will-the-light-go: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0`);
    console.log([...boardLines].join('\n'));
  });
});
