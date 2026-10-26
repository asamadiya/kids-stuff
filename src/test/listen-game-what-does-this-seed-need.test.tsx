import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import seedGame, { type Answer, type Round } from '../science/games/what-does-this-seed-need';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for What Does This Seed Need?: `board()` lists exactly the words
 * the board shows at each stage, in screen order (the day caption under the
 * Before picture, the answer words, the hint or why caption), and never
 * depends on the prediction. An investigation has no `check`, so no `hints`:
 * its hint is the board caption, which `board()` lists at stage 'hint'.
 */

const game = seedGame;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];
const ANSWERS: readonly Answer[] = [null, 'sprouts', 'stays', 'green', 'pale', 'stops', 'left', 'right', 'both', 'neither', 'same'];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const DISTINCT = [...new Map(ROUNDS.map((r) => [`${r.level}:${JSON.stringify(r.round)}`, r])).values()];

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

/** Every line, in order, as a run of the board's text content. */
function inOrder(text: string, lines: readonly string[], what: string) {
  let from = 0;
  for (const line of lines) {
    const at = text.indexOf(norm(line), from);
    expect(at, `${what}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
    from = at + norm(line).length;
  }
}

afterEach(cleanup);

describe('what-does-this-seed-need board()', () => {
  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      expect(lines.length).toBeGreaterThan(0);
      const { container } = draw(round, level, stage);
      inOrder(norm(container.textContent ?? ''), lines, stage);
      cleanup();
    }
  });

  it.each(DISTINCT)('L$level #$i: every answer word, caption and setup line on the board is listed', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = new Set(game.board!(round, level, stage).map(norm));
      const { container } = draw(round, level, stage);
      const words = [...container.querySelectorAll('.choices button')].map((b) => norm(b.textContent ?? ''));
      expect(words.length).toBeGreaterThan(1);
      const captions = [...container.querySelectorAll('.board-caption')].map((p) => norm(p.textContent ?? ''));
      expect(captions.length).toBe(stage === 'hint' || stage === 'worked' ? 1 : 0);
      // The Before picture's last text is its day caption: the setup in words.
      const before = container.querySelector('svg.board-svg');
      const setup = norm([...before!.querySelectorAll(':scope > text')].pop()?.textContent ?? '');
      expect(setup).toMatch(/^Day \d: /);
      for (const l of [setup, ...words, ...captions]) expect(lines.has(l), `${stage}: "${l}" not in board()`).toBe(true);
      cleanup();
    }
  });

  it('never depends on the prediction: the same lines on the board whatever is tapped', () => {
    for (const { level, round } of DISTINCT)
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        for (const a of ANSWERS) {
          const { container } = draw(round, level, stage, a);
          inOrder(norm(container.textContent ?? ''), lines, `${stage} answer ${a}`);
          cleanup();
        }
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

  it('is an investigation with no hints(): the hint is the board caption', () => {
    expect(game.kind).toBe('investigate');
    expect('hints' in game).toBe(false);
  });

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintCaptions = new Set(
      ROUNDS.flatMap(({ level, round }) => game.board!(round, level, 'hint').filter((l) => !game.board!(round, level, 'answering').includes(l))),
    );
    for (const l of boardLines) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    console.log(`what-does-this-seed-need: gameLines ${all.size}, board lines ${boardLines.size}, hint captions ${hintCaptions.size}`);
    for (const stage of STAGES) {
      const seen = new Set<string>();
      for (const { level, round } of DISTINCT) seen.add(`L${level}: ${game.board!(round, level, stage).join(' | ')}`);
      console.log(`[${stage}]\n${[...seen].join('\n')}`);
    }
  });
});
