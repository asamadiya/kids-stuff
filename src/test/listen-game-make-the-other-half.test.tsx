import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { inGiven, required } from '../maths/games/make-the-other-half';
import type { Answer, Round } from '../maths/games/make-the-other-half';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Make the Other Half: every word a read button can ask for is
 * listable in advance, and is exactly what the board shows.
 *  - board(): the setup line (two sentences) at every stage; from 'hint' on,
 *    what the dots count; on 'worked' and 'solved', the finished picture's
 *    tally. The hint-stage tally counts his own squares, so it is not listed.
 *  - hints(): every hint check() gives, over every set of open squares the
 *    board can produce. The hint is one sentence, so nothing is skipped.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = (typeof STAGES)[number];
const INDEXES = 40;
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
/** The hint-stage tally: his own squares counted, the one board sentence left to the screen. */
const TALLY = /^(Left half \d+ squares, right half \d+\.|Above the line \d+ squares, below it \d+\.|Top left \d+, top right \d+, bottom left \d+, bottom right \d+\.)$/;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const distinct = [...new Map(rounds.map((r) => [JSON.stringify(r.round), r])).values()];

/** The squares he can tap: every square outside the drawn part. */
const open = (round: Round) =>
  Array.from({ length: round.rows * round.cols }, (_, i) => i).filter((i) => !inGiven(round, Math.floor(i / round.cols), i % round.cols));

/** A solved board always holds the finished picture: check accepts nothing else. */
const answerAt = (round: Round, stage: Stage): Answer => (stage === 'solved' ? required(round) : game.emptyAnswer(round));

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = answerAt(round, stage)) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);

/** `lines` occur in `text` in this order, each whole. */
function inOrder(text: string, lines: readonly string[]): string | null {
  let at = 0;
  for (const line of lines) {
    const k = text.indexOf(norm(line), at);
    if (k < 0) return line;
    at = k + norm(line).length;
  }
  return null;
}

afterEach(cleanup);

describe('make-the-other-half read-aloud', () => {
  it('board() lists only words the board renders at that stage, in screen order', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        // The brief's render: the empty answer at every stage. On 'solved' the
        // last line is the finished picture's tally, drawn by the only answer
        // check accepts, so that render shows every line but that one.
        const { container } = draw(round, level, stage, game.emptyAnswer(round));
        const shown = stage === 'solved' ? lines.slice(0, -1) : lines;
        expect(inOrder(norm(container.textContent), shown), `L${level} #${i} ${stage}`).toBeNull();
        cleanup();
        const solved = draw(round, level, stage);
        expect(inOrder(norm(solved.container.textContent), lines), `L${level} #${i} ${stage} (as played)`).toBeNull();
        cleanup();
      }
    }
  }, 60_000);

  it('board() is all of the board words, but for the hint-stage tally of his own squares', () => {
    for (const { level, i, round } of distinct) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const { container } = draw(round, level, stage);
        // Every visible word sits in a caption; the grid's words are aria-labels only.
        const captions = [...container.querySelectorAll('.board-caption')].map((p) => norm(p.textContent));
        const words = container.cloneNode(true) as HTMLElement;
        words.querySelectorAll('.board-caption').forEach((p) => p.remove());
        expect(norm(words.textContent), `L${level} #${i} ${stage}`).toBe('');
        const said = captions.join(' ');
        if (stage === 'hint') {
          expect(said.startsWith(lines.join(' ')), `L${level} #${i} ${stage}`).toBe(true);
          expect(said.slice(lines.join(' ').length).trim(), `L${level} #${i} ${stage}`).toMatch(TALLY);
        } else {
          expect(said, `L${level} #${i} ${stage}`).toBe(lines.join(' '));
        }
        cleanup();
      }
    }
  });

  it('check accepts only the finished picture, so the solved tally is fixed', () => {
    for (const { level, i, round } of distinct) {
      const done = required(round);
      expect(game.check(round, done).ok, `L${level} #${i}`).toBe(true);
      for (const x of open(round)) {
        const one = done.includes(x) ? done.filter((y) => y !== x) : [...done, x].sort((a, b) => a - b);
        expect(game.check(round, one).ok, `L${level} #${i} flip ${x}`).toBe(false);
      }
    }
  });

  it('the board can set any set of open squares, one tap per square', () => {
    for (const { level, i, round } of distinct) {
      const set: Answer[] = [];
      const { container } = render(<game.Board round={round} level={level} answer={[]} setAnswer={(a) => set.push(a)} stage="answering" />);
      const buttons = [...container.querySelectorAll('button')];
      buttons.forEach((b) => fireEvent.click(b));
      expect(set, `L${level} #${i}`).toEqual(open(round).map((x) => [x]));
      cleanup();
    }
  });

  it('hints() is exactly the hint sentences check() gives over every answer the board can produce', () => {
    // Exhaustive where the open side is 18 squares or fewer (2^18 answers);
    // with two lines (27 open squares) every top-right subset against three
    // bottoms, and every single and double flip from the finished picture.
    for (const { level, i, round } of distinct) {
      const listed = game.hints!(round);
      const squares = open(round);
      const done = required(round);
      const said = new Set<string>();
      const probe = (a: Answer) => {
        const v = game.check(round, a);
        if (v.ok) {
          // The only answer a solved board can hold, so its tally is board()'s.
          expect(a, `L${level} #${i}`).toEqual(done);
          return;
        }
        expect(v.hint, `L${level} #${i} ${JSON.stringify(a)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) {
          if (!said.has(s)) expect(listed, `L${level} #${i} ${JSON.stringify(a)}: "${s}"`).toContain(s);
          said.add(s);
        }
      };
      if (squares.length <= 18) {
        for (let m = 0; m < 1 << squares.length; m += 1) probe(squares.filter((_, k) => m & (1 << k)));
      } else {
        const top = squares.filter((x) => x < (round.rows / 2) * round.cols);
        const bottom = squares.filter((x) => !top.includes(x));
        for (const low of [[], bottom, bottom.filter((x) => done.includes(x))]) {
          for (let m = 0; m < 1 << top.length; m += 1) probe([...top.filter((_, k) => m & (1 << k)), ...low].sort((a, b) => a - b));
        }
        for (const x of squares) {
          for (const y of squares) {
            const flip = (s: readonly number[], z: number) => (s.includes(z) ? s.filter((w) => w !== z) : [...s, z]);
            probe(flip(x === y ? done : flip(done, x), y).sort((a, b) => a - b));
          }
        }
      }
      expect(new Set(listed), `L${level} #${i}`).toEqual(said);
      // One sentence each, as the shell reads it: nothing to skip.
      for (const h of listed) expect(sentences(h), h).toEqual([h]);
    }
  }, 120_000);

  it('has no empty or overlong line', () => {
    for (const { level, round } of rounds) {
      for (const line of [...STAGES.flatMap((s) => game.board!(round, level, s)), ...game.hints!(round)]) {
        expect(line.trim().length, line).toBeGreaterThan(0);
        expect(line.length, line).toBeLessThanOrEqual(300);
      }
    }
  });

  it('feeds gameLines (counts printed)', () => {
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(rounds.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    const lines = new Set(gameLines(game));
    for (const l of [...boardLines, ...hintSentences]) expect(lines.has(l), l).toBe(true);
    console.log(`make-the-other-half: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    for (const stage of STAGES) {
      const seen = new Set(rounds.flatMap(({ level, round }) => game.board!(round, level, stage)));
      console.log(`  ${stage}: ${[...seen].join(' | ')}`);
    }
  });
});
