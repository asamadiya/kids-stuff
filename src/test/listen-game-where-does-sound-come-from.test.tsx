import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import whereDoesSoundComeFrom, { type Answer, type Round } from '../science/games/where-does-sound-come-from';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Where Does Sound Come From? (an investigation, so no
 * `hints`): `board()` lists exactly the words the board shows at each stage,
 * in screen order, and every other worded label the board draws is a number
 * tag or an outcome label that `why` says in full.
 */

const game = whereDoesSoundComeFrom;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

/** Every answer the choices can hold, and nothing yet. */
const ANSWERS: readonly Answer[] = [null, 'a', 'b', 'same'];

const PLUCKS = new Set(['Pushed down a little, then let go.', 'Pushed down far, then let go.', 'Pushed down and held there.']);

/**
 * Worded SVG labels `board()` leaves out on purpose: the row tag (read with
 * its badge as "Ruler 1"), the centimetre tags (the blocks draw them, the hint
 * says them), and at 'worked' the outcome frame's short labels and footer.
 */
const CM = /^\d+ cm$/;
const OUTCOME = /^(no sound|a sound|higher note|lower note|same note(, louder|, softer)?|cannot swing|swings back and forth|(same speed|faster swings|slower swings)(, wider|, narrower)?|Tip, in one short moment|Drawn model, not a recording\. Pluck a real ruler to hear it\.)$/;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

afterEach(cleanup);

describe('where-does-sound-come-from board()', () => {
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
        expect(at, `${stage}: "${line}" after ${from} in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: every worded label is listed or deliberately left out', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage).map(norm);
      const { container } = draw(round, level, stage);
      const words = [...container.querySelectorAll('.choices button')].map((b) => norm(b.lastElementChild?.lastElementChild?.textContent ?? ''));
      const caption = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      const svg = [...container.querySelectorAll('svg.board-svg text')].map((e) => norm(e.textContent ?? '')).filter(hasLetter);
      if (stage === 'worked') {
        // The outcome frame: the answer words, then the worked caption.
        expect(lines).toEqual([...words, ...caption]);
        for (const l of svg) expect(l === 'Ruler' || CM.test(l) || OUTCOME.test(l), `${stage}: "${l}"`).toBe(true);
      } else {
        // The setup frame: each row's name (its tag, then its badge) and pluck sentence,
        // the answer words, then the hint caption.
        const all = [...container.querySelectorAll('svg.board-svg text')].map((e) => norm(e.textContent ?? ''));
        const rows = all.flatMap((l, k) => (l === 'Ruler' ? [`${l} ${all[k + 1]}`] : PLUCKS.has(l) ? [l] : []));
        expect(rows).toHaveLength(4);
        expect(lines.slice(0, 4)).toEqual(rows);
        expect(lines.slice(4, 4 + words.length)).toEqual(words);
        expect(lines.slice(4 + words.length).join(' ')).toBe(caption.join(' '));
        expect(caption.length).toBe(stage === 'hint' ? 1 : 0);
        for (const l of svg) expect(l === 'Ruler' || CM.test(l) || PLUCKS.has(l), `${stage}: "${l}"`).toBe(true);
      }
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

  it('reads the answer words at every stage, the hint caption sentence by sentence, and the why at worked', () => {
    for (const { level, round } of ROUNDS) {
      const answering = game.board!(round, level, 'answering');
      const words = answering.slice(4);
      expect(words).toEqual(level === 1 ? ['Ruler 1', 'Ruler 2'] : ['Ruler 1', 'Ruler 2', round.ask === 'louder' || round.ask === 'softer' ? 'Just as loud' : 'Same note']);
      expect(game.board!(round, level, 'solved')).toEqual(answering);
      const hint = game.board!(round, level, 'hint');
      expect(hint.slice(0, answering.length)).toEqual(answering);
      const caption = hint.slice(answering.length);
      expect(caption.length).toBeGreaterThan(0);
      // One sentence per entry, so each is its own clip.
      for (const s of caption) expect(sentences(s)).toEqual([s]);
      expect(game.board!(round, level, 'worked')).toEqual([...words, game.why(round)]);
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
    const captions = new Set(
      ROUNDS.flatMap(({ level, round }) => game.board!(round, level, 'hint').slice(game.board!(round, level, 'answering').length)),
    );
    console.log(`where-does-sound-come-from: gameLines ${all.size}, board lines ${boardLines.size}, hint-caption sentences ${captions.size}, hints() sentences 0`);
    console.log([...boardLines].join('\n'));
  });
});
