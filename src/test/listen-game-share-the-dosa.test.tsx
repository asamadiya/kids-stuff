import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import shareTheDosa, { type Answer, type Round } from '../maths/games/share-the-dosa';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Share the Dosa: `board()` lists exactly the words the board
 * shows at each stage, and `hints()` lists every hint sentence `check` can
 * give for any answer the board's buttons can produce.
 */

const game = shareTheDosa;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, setAnswer: (a: Answer) => void = () => {}) {
  return render(<Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={setAnswer} stage={stage} />);
}

/** Every answer the board's buttons produce, found by tapping each one. */
function tapped(round: Round, level: Level): Answer[] {
  const seen: Answer[] = [];
  const { container } = draw(round, level, 'answering', (a) => seen.push(a));
  container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
  cleanup();
  return seen;
}

afterEach(cleanup);

describe('share-the-dosa board()', () => {
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

  it.each(ROUNDS)('L$level #$i: every worded label on the board is a listed line', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = new Set(game.board!(round, level, stage).map(norm));
      const { container } = draw(round, level, stage);
      const labels = [
        ...[...container.querySelectorAll('button')].map((b) => b.textContent ?? ''),
        ...[...container.querySelectorAll('.board-caption, svg text')].map((e) => e.textContent ?? ''),
      ]
        .map(norm)
        .filter(hasLetter);
      for (const l of labels) expect(lines.has(l), `${stage}: "${l}" not in board()`).toBe(true);
      cleanup();
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
});

describe('share-the-dosa hints()', () => {
  it.each(ROUNDS)('L$level #$i: every hint sentence for every tappable answer is listed', ({ level, round }) => {
    const answers = tapped(round, level);
    expect(answers.length).toBeGreaterThan(0);
    const listed = new Set(game.hints!(round).flatMap(sentences));
    for (const a of [game.emptyAnswer(round), ...answers]) {
      const v = game.check(round, a);
      if (v.ok) continue;
      expect(v.hint, `answer ${a}`).toBeTruthy();
      for (const s of sentences(v.hint!)) expect(listed.has(s), `answer ${a}: "${s}"`).toBe(true);
    }
  });

  it('never lists an empty hint or one over 300 characters', () => {
    for (const { round } of ROUNDS)
      for (const h of game.hints!(round)) {
        expect(h.trim().length).toBeGreaterThan(0);
        expect(h.length).toBeLessThanOrEqual(300);
      }
  });

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    for (const l of [...boardLines, ...hintSentences]) expect(all.has(l), l).toBe(true);
    for (const l of all) expect(l.length, l).toBeLessThanOrEqual(300);
    console.log(`share-the-dosa: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    console.log([...boardLines].join('\n'));
  });
});
