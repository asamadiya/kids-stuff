import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../science/games/one-push-then-what';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for One Push. Then What?: `board()` lists, sentence by sentence
 * and in screen order, exactly the words the board shows at each stage (the
 * push, the floor or the two lanes, the line under the strip, the answer
 * words, the hint or worked caption), and every other word on the board is
 * one the brief says to skip: a ruler number or a short flag on the strip.
 * An investigation has no `hints`: its hint is the board's caption.
 */

const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

/** Words on the board that are not read: ruler numbers and the flags on the strip, which the caption says in full. */
const FLOOR = '(?:wood|tiles|carpet|towel)';
const SKIPPED = new RegExp(`^(?:\\d+|gentle|medium|strong|on ${FLOOR}|stops here|${FLOOR}(?:, ${FLOOR})*)$`);

function draw(round: Round, level: Level, stage: Stage) {
  return render(<Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
}

/** Every piece of visible text, one per element that holds it: SVG text, the word under a choice, the caption. */
function pieces(container: HTMLElement): string[] {
  return [...container.querySelectorAll('text, .choice > span > span, p')].map((e) => norm(e.textContent ?? '')).filter(Boolean);
}

afterEach(cleanup);

describe('one-push-then-what board()', () => {
  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      const { container } = draw(round, level, stage);
      const text = norm(container.textContent ?? '');
      let from = 0;
      for (const line of lines) {
        const at = text.indexOf(norm(line), from);
        expect(at, `${stage}: "${line}" after ${from} in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: each line is a whole sentence of one piece of board text, and every other piece is a skipped one', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage).map(norm);
      const { container } = draw(round, level, stage);
      const shown = pieces(container);
      const read = new Set(shown.flatMap((p) => sentences(p)));
      for (const line of lines) expect(read.has(line), `${stage}: "${line}" in ${JSON.stringify(shown)}`).toBe(true);
      const listed = new Set(lines);
      for (const p of shown) {
        const covered = sentences(p).every((s) => listed.has(s));
        expect(covered || SKIPPED.test(p), `${stage}: unread "${p}"`).toBe(true);
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: the answer words are the buttons\' words, in button order', ({ level, round }) => {
    const { container } = draw(round, level, 'answering');
    const words = [...container.querySelectorAll('.choice')].map((b) => norm(b.textContent ?? ''));
    const lines = game.board!(round, level, 'answering');
    expect(lines.slice(-words.length)).toEqual(words);
    expect(words).toHaveLength(round.test === 'pair' ? 3 : 4);
  });

  it.each(ROUNDS)('L$level #$i: the caption is read at hint and worked only, whole and last', ({ level, round }) => {
    for (const stage of STAGES) {
      const { container } = draw(round, level, stage);
      const caption = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      expect(caption, stage).toHaveLength(stage === 'hint' || stage === 'worked' ? 1 : 0);
      const lines = game.board!(round, level, stage);
      if (caption.length) {
        const tail = sentences(caption[0]);
        expect(lines.slice(-tail.length), stage).toEqual(tail);
      }
      cleanup();
    }
  });

  it('reads the same setup at every stage, and adds only the caption', () => {
    for (const { level, round } of ROUNDS) {
      const base = game.board!(round, level, 'answering');
      expect(game.board!(round, level, 'solved')).toEqual(base);
      for (const stage of ['hint', 'worked'] as const) expect(game.board!(round, level, stage).slice(0, base.length)).toEqual(base);
    }
  });

  it('never lists an empty line or one over 300 characters', () => {
    for (const { level, round } of ROUNDS)
      for (const stage of STAGES)
        for (const line of game.board!(round, level, stage)) {
          expect(line.trim().length, line).toBeGreaterThan(0);
          expect(line.length, line).toBeLessThanOrEqual(300);
          expect(line, 'one sentence per entry').toBe(sentences(line)[0]);
        }
  });

  it('is an investigation, so it lists no hints of its own', () => {
    expect(game.kind).toBe('investigate');
    expect('hints' in game).toBe(false);
  });

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    for (const l of boardLines) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    console.log(`one-push-then-what: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0`);
  });
});
