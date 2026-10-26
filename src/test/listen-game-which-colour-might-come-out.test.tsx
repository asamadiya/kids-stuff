import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import whichColour, { WORDS, type Answer, type Round } from '../maths/games/which-colour-might-come-out';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Which Colour Might Come Out?: `board()` lists exactly the
 * words the board shows at each stage, in screen order, and `hints()` lists
 * the one hint sentence set `check` gives for any answer the buttons produce.
 */

const game = whichColour;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);
/** The chance line's tick words: the answer buttons under it say the same words, so board() reads those instead. */
const TICKS = new Set<string>(WORDS);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle well inside 40: one of each distinct round, for the slow walks. */
const DISTINCT = [...new Map(ROUNDS.map((r) => [`${r.level}:${JSON.stringify(r.round)}`, r])).values()];

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

describe('which-colour-might-come-out board()', () => {
  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      expect(lines.length).toBeGreaterThan(0);
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
      const words = [...container.querySelectorAll('button')].map((b) => b.querySelector(':scope > span > span:last-child')?.textContent ?? '');
      expect(words.length).toBeGreaterThan(0);
      for (const w of words) expect(hasLetter(w), `${stage}: a choice with no word`).toBe(true);
      const labels = [...words, ...[...container.querySelectorAll('.board-caption, .board-svg text')].map((e) => e.textContent ?? '')]
        .map(norm)
        .filter(hasLetter)
        .filter((l) => !(round.kind === 'word' && TICKS.has(l)));
      for (const l of labels) expect(lines.has(l), `${stage}: "${l}" not in board()`).toBe(true);
      cleanup();
    }
  });

  it('never depends on the answer: the same lines whatever is tapped', () => {
    for (const { level, round } of DISTINCT)
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage).map(norm);
        for (const a of tapped(round, level)) {
          const { container } = render(<Board round={round} level={level} answer={a} setAnswer={() => {}} stage={stage} />);
          const text = norm(container.textContent ?? '');
          for (const l of lines) expect(text.includes(l), `${stage} answer ${a}: "${l}"`).toBe(true);
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
});

describe('which-colour-might-come-out hints()', () => {
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
    console.log(`which-colour-might-come-out: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    console.log([...boardLines].join('\n'));
  });
});
