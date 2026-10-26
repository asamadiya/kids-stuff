import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import willThisClayBoatFloat, { type Answer, type Round } from '../science/games/will-this-clay-boat-float';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Will This Clay Boat Float? (an investigation, so no `hints`):
 * `board()` lists exactly the words the board shows at each stage, in screen
 * order — the word under each guess picture, then Help's caption at 'hint'
 * and 'worked', sentence by sentence. The only other text the board draws is
 * the "5" tag on level 3's dashed line, a number the picture carries.
 */

const game = willThisClayBoatFloat;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

/** Every answer the two guess buttons can hold, and nothing yet. */
const ANSWERS: readonly Answer[] = [null, 'floats', 'sinks'];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
/**
 * An element's words without the SVG text in it. The only SVG text is the "5"
 * on the boat's dashed line, drawn again in each guess picture and in the
 * faint copy a guess leaves: a number the picture carries, never read.
 */
function words(el: Element): string {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll('svg text').forEach((t) => t.remove());
  return norm(copy.textContent ?? '');
}

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

afterEach(cleanup);

describe('will-this-clay-boat-float board()', () => {
  it('is an investigation with board() and no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect(game.board).toBeTypeOf('function');
    expect('hints' in game).toBe(false);
  });

  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      const text = words(draw(round, level, stage).container);
      let from = 0;
      for (const line of lines) {
        const at = text.indexOf(norm(line), from);
        expect(at, `${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: every worded text on the board is listed', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage).map(norm);
      const { container } = draw(round, level, stage);
      // The choice words, one per button, open the list.
      const choices = [...container.querySelectorAll('button')].map(words);
      expect(choices).toEqual(['Floats', 'Sinks']);
      expect(lines.slice(0, 2)).toEqual(choices);
      // The caption is the rest of the list, its sentences joined.
      const captions = [...container.querySelectorAll('.board-caption')].map(words);
      expect(captions).toEqual(lines.length > 2 ? [lines.slice(2).join(' ')] : []);
      // Nothing else worded: the only SVG text is the dashed line's number, on
      // the boat over the tub and on each guess picture's boat.
      const bare = (s: string) => s.replace(/\s+/g, '');
      expect(bare(words(container)), stage).toBe(bare(lines.join('')));
      const svgText = [...container.querySelectorAll('svg text')].map((e) => norm(e.textContent ?? ''));
      expect(svgText).toEqual(round.thing === 'loaded-boat' ? ['5', '5', '5'] : []);
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: the board shows the same words whatever he guessed', ({ level, round }) => {
    for (const stage of STAGES) {
      const base = words(draw(round, level, stage).container);
      cleanup();
      for (const a of ANSWERS) {
        const { container } = draw(round, level, stage, a);
        expect(words(container), `${stage} / ${a}`).toBe(base);
        for (const t of container.querySelectorAll('svg text')) expect(norm(t.textContent ?? ''), `${stage} / ${a}`).toBe('5');
        cleanup();
      }
    }
  });

  it('reads the two choices at every stage, plus the shape or dashed-line caption at hint and worked', () => {
    for (const { level, round } of ROUNDS) {
      expect(game.board!(round, level, 'answering')).toEqual(['Floats', 'Sinks']);
      expect(game.board!(round, level, 'solved')).toEqual(['Floats', 'Sinks']);
      const caption =
        round.thing === 'loaded-boat'
          ? ['The dashed line: where the water comes with 5 marbles in.', 'Every marble takes the boat deeper.', 'Past the line, the rim goes under.']
          : ['Look at its shape.', 'Is it tight and small for its weight, or wide and full of air?'];
      expect(game.board!(round, level, 'hint')).toEqual(['Floats', 'Sinks', ...caption]);
      expect(game.board!(round, level, 'worked')).toEqual(['Floats', 'Sinks', ...caption]);
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
    console.log(`will-this-clay-boat-float: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0`);
    console.log([...boardLines].join('\n'));
  });
});
