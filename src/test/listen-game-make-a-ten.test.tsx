import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { solution, type Answer, type Round } from '../maths/games/make-a-ten';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Make a Ten.
 *  - board(): the caption under the full-frame picture at every stage, then the
 *    equation the board draws once it is locked ('worked', 'solved').
 *  - hints(): every hint check() gives, over every board a tap walk reaches.
 * Left to the picture: the count tags under the frames and rods ("3 tens = 30"),
 * the pile label, the "10 ones" / "1 ten" picture labels, and the pile-state
 * captions "The pile is empty." / "All placed.".
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
type Stage = BoardProps<Round, Answer>['stage'];

/** Worded board text the board shows but board() leaves to the picture. */
const SKIPPED = new Set(['Pile', 'All placed.', 'The pile is empty.']);

const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle every 7; the walk only needs each distinct round once. */
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);

/** check() reads counts only; a board is the same board up to which cells hold the counters. */
const shape = (round: Round, a: Answer) => {
  const inFirst = a.cells.filter((c) => c < 10).length;
  return `${inFirst}/${a.cells.length - inFirst}/${a.picked && round.b > a.cells.length}`;
};

/** Every board the taps reach from the empty one: tap every button of every board reached. */
function reachable(round: Round, level: Level): Answer[] {
  const start = game.emptyAnswer(round);
  const seen = new Map<string, Answer>([[shape(round, start), start]]);
  const queue = [start];
  while (queue.length) {
    const from = queue.shift()!;
    const next: Answer[] = [];
    const { container } = draw(round, level, 'answering', from, (a) => next.push(a));
    container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
    cleanup();
    for (const a of next) {
      const k = shape(round, a);
      if (!seen.has(k)) {
        seen.set(k, a);
        queue.push(a);
      }
    }
  }
  return [...seen.values()];
}

afterEach(cleanup);

describe('make-a-ten board()', () => {
  it('lists, in screen order, words the board renders at that stage', () => {
    for (const { level, i, round } of ROUNDS) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const { container } = draw(round, level, stage);
        const text = norm(container.textContent);
        let from = 0;
        for (const line of lines) {
          const at = text.indexOf(norm(line), from);
          expect(at, `L${level} #${i} ${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
          from = at + norm(line).length;
        }
        expect(lines.length, `L${level} #${i} ${stage}`).toBe(stage === 'worked' || stage === 'solved' ? 2 : 1);
        cleanup();
      }
    }
  });

  it('leaves out only the picture labels, number tags and pile states', () => {
    for (const { level, i, round } of DISTINCT) {
      for (const stage of STAGES) {
        const lines = new Set(game.board!(round, level, stage).map(norm));
        // The empty board, and the solved board (where the pile reads "All placed.").
        for (const answer of [game.emptyAnswer(round), solution(round)]) {
          const { container } = draw(round, level, stage, answer);
          const worded = [...container.querySelectorAll('p, .tray__label, .board-caption')]
            .map((e) => norm(e.textContent))
            .filter(hasLetter)
            .filter((t) => !/^Pile: /.test(t));
          for (const t of worded) expect(lines.has(t) || SKIPPED.has(t), `L${level} #${i} ${stage}: "${t}"`).toBe(true);
          cleanup();
        }
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

describe('make-a-ten hints()', () => {
  it('lists exactly the hint sentences the reachable boards give', () => {
    for (const { level, i, round } of DISTINCT) {
      const answers = reachable(round, level);
      // Every count the board allows: 0..gap in the first frame, and the rest of the pile anywhere in the second.
      const gap = Math.min(10 - round.a, round.b);
      const shapes = new Set(answers.map((a) => shape(round, a).split('/').slice(0, 2).join('/')));
      expect(shapes.size, `L${level} #${i}`).toBe(Array.from({ length: gap + 1 }, (_, f) => round.b - f + 1).reduce((x, y) => x + y, 0));

      const listed = new Set(game.hints!(round).flatMap(sentences));
      const given = new Set<string>();
      for (const a of answers) {
        const v = game.check(round, a);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${JSON.stringify(a)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) {
          expect(listed.has(s), `L${level} #${i} ${JSON.stringify(a)}: "${s}"`).toBe(true);
          given.add(s);
        }
      }
      expect([...listed].filter((s) => !given.has(s)), `L${level} #${i}: listed but never given`).toEqual([]);
    }
  });

  it('never lists an empty hint or one over 300 characters', () => {
    for (const { round } of ROUNDS)
      for (const h of game.hints!(round)) {
        expect(h.trim().length).toBeGreaterThan(0);
        expect(h.length).toBeLessThanOrEqual(300);
      }
  });

  it('feeds gameLines (counts printed)', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    for (const l of [...boardLines, ...hintSentences]) expect(all.has(l), l).toBe(true);
    for (const l of all) expect(l.length, l).toBeLessThanOrEqual(300);
    console.log(`make-a-ten: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}, hints ${new Set(ROUNDS.flatMap(({ round }) => game.hints!(round))).size}`);
    console.log([...boardLines].join('\n'));
  });
});
