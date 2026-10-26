import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../science/games/which-one-lands-first';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Which One Lands First? (an investigation, so no `hints`):
 * `board()` lists exactly the words the board shows at each stage, in screen
 * order — the setup line, the word under each guess picture, then the Help
 * caption or the why — and every other worded label the board draws is a name,
 * a measurement or a pane title the picture and the listed lines already carry.
 */

const { Board } = game;
const board = game.board!;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const ANSWERS: readonly Answer[] = [null, 'left', 'together', 'right'];

const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

/** The prompt names both things ("Dropped together: X and Y."); the column labels repeat those names. */
const thingNames = (round: Round) => game.prompt(round).replace(/^Dropped together: (.+)\. Which lands first\?$/, '$1').split(' and ');

/**
 * Worded labels drawn on the board that `board()` leaves out on purpose: the
 * thing names under each column, the ruler's "cm", widths, grams, the
 * "60 cm / still to fall" tag, and the worked panes' titles.
 */
function unvoiced(round: Round, label: string): boolean {
  return (
    thingNames(round).includes(label) ||
    /^(?:cm|\d+ cm|\d+(?:\.\d+)? cm wide|\d+ g|still to fall)$/.test(label) ||
    label === 'Let go' ||
    label === 'What happens'
  );
}

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);
}

afterEach(cleanup);

describe('which-one-lands-first board()', () => {
  it('is an investigation with board() and no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect(board).toBeTypeOf('function');
    expect('hints' in game).toBe(false);
  });

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

  it.each(ROUNDS)('L$level #$i: every worded label is listed or deliberately left out', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = board(round, level, stage).map(norm);
      const listed = new Set(lines);
      const { container } = draw(round, level, stage);
      // The words under the three guess pictures, in button order.
      const words = [...container.querySelectorAll('button.choice')].map((b) => norm(b.textContent));
      expect(words).toHaveLength(3);
      for (const w of words) expect(listed.has(w), `${stage}: choice "${w}" not in board()`).toBe(true);
      // The caption under the choices is the tail of the list, sentence by sentence.
      const caption = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent)).join(' ');
      const tail = lines.slice(lines.indexOf(words[2]) + 1);
      expect(caption).toBe(tail.join(' '));
      // The Help caption is listed one sentence per entry, so the shared "Same width, 7 cm each." is one clip.
      if (stage === 'hint') expect(sentences(caption)).toEqual(tail);
      // The scene's top line(s) open the list.
      const heads = [...container.querySelectorAll('.board-svg > text')].map((t) => norm(t.textContent)).filter((t) => t.endsWith('.'));
      expect(heads).toEqual(lines.slice(0, heads.length));
      // Anything else worded is a name, a measurement or a pane title.
      const other = [...container.querySelectorAll('svg text, figcaption')].map((e) => norm(e.textContent)).filter((t) => hasLetter(t) && !listed.has(t));
      for (const l of other) expect(unvoiced(round, l), `${stage}: "${l}" is neither listed nor a known label`).toBe(true);
      cleanup();
    }
  });

  it('never depends on the answer: the board shows the same words whatever he guessed', () => {
    for (const { level, round } of DISTINCT) {
      const seen: Answer[] = [];
      const { container } = draw(round, level, 'answering', game.emptyAnswer(round), (a) => seen.push(a));
      container.querySelectorAll('button.choice').forEach((b) => fireEvent.click(b));
      cleanup();
      expect(seen).toEqual(['left', 'together', 'right']);
      for (const stage of STAGES) {
        const base = norm(draw(round, level, stage).container.textContent);
        cleanup();
        for (const a of ANSWERS) {
          expect(norm(draw(round, level, stage, a).container.textContent), `${stage} / ${a}`).toBe(base);
          cleanup();
        }
      }
    }
  });

  it('reads the setup and choices at every stage, plus the Help caption at hint and the why at worked', () => {
    for (const { level, round } of ROUNDS) {
      const base = board(round, level, 'answering');
      expect(base).toHaveLength(4);
      expect(base[0]).toMatch(/^Both let go together from (?:50 cm|1 m)\.$/);
      expect(base[2]).toBe('Together');
      expect(board(round, level, 'solved')).toEqual(base);
      const hint = board(round, level, 'hint');
      expect(hint.slice(0, 4)).toEqual(base);
      expect(hint.length).toBeGreaterThan(4);
      expect(board(round, level, 'worked')).toEqual([
        base[0],
        round.lands === 'together' ? 'Model: both reach the floor together.' : 'Model: the instant the first one lands.',
        ...base.slice(1),
        game.why(round),
      ]);
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

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => board(round, level, s))));
    for (const l of boardLines) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    const perStage = Object.fromEntries(STAGES.map((s) => [s, new Set(ROUNDS.flatMap(({ level, round }) => board(round, level, s))).size]));
    console.log(`which-one-lands-first: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0, per stage ${JSON.stringify(perStage)}`);
    console.log([...boardLines].join('\n'));
  });
});
