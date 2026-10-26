import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import game, { isOpen, target, type Answer, type Round } from '../maths/games/what-did-our-class-choose';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for What Did Our Class Choose?: `board()` lists exactly the words
 * the board's caption shows at each stage, and `hints()` lists every hint
 * sentence `check` can give for any answer the add and take-off pieces can
 * produce (each open row 0..cells pictures, drawn rows untouched).
 */

const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle; the exhaustive answer walk runs once per distinct round. */
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

/** Every answer the board can hold: each open row at 0..cells, every drawn row at 0. */
function* answers(round: Round): Generator<Answer> {
  const open = round.fruits.map((_, i) => isOpen(round, i));
  const cur = round.fruits.map(() => 0);
  function* walk(i: number): Generator<Answer> {
    if (i === cur.length) {
      yield [...cur];
      return;
    }
    for (let n = 0; n <= (open[i] ? round.cells : 0); n += 1) {
      cur[i] = n;
      yield* walk(i + 1);
    }
    cur[i] = 0;
  }
  yield* walk(0);
}

afterEach(cleanup);

describe('what-did-our-class-choose board()', () => {
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

  it.each(ROUNDS)('L$level #$i: the caption under the chart is exactly the listed line', ({ level, round }) => {
    for (const stage of STAGES) {
      const { container } = draw(round, level, stage);
      const captions = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      expect(captions, stage).toEqual(game.board!(round, level, stage).map(norm));
      cleanup();
    }
  });

  it('reads the worked caption at worked and nothing at the other stages', () => {
    for (const { level, round } of ROUNDS) {
      expect(game.board!(round, level, 'worked')).toEqual([game.explain(round)]);
      for (const stage of ['answering', 'hint', 'solved'] as const) expect(game.board!(round, level, stage)).toEqual([]);
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

describe('what-did-our-class-choose hints()', () => {
  it.each(ROUNDS)('L$level #$i: the pieces keep every open row within 0..cells', ({ level, round }) => {
    const opens = round.fruits.filter((_, i) => isOpen(round, i)).length;
    // Empty: only the add pieces are buttons. Full: only the take-off pieces.
    for (const n of [0, round.cells]) {
      const full = round.fruits.map((_, i) => (isOpen(round, i) ? n : 0));
      const { container } = draw(round, level, 'answering', full);
      const labels = [...container.querySelectorAll('button')].map((b) => b.getAttribute('aria-label') ?? '');
      expect(labels).toHaveLength(opens);
      expect(labels.every((l) => l.startsWith(n === 0 ? 'Add a picture' : 'Take a picture off'))).toBe(true);
      cleanup();
    }
  });

  it.each(DISTINCT)('L$level #$i: every hint sentence for every answer the board can hold is listed', ({ round }) => {
    const listed = new Set(game.hints!(round).flatMap(sentences));
    const want = target(round);
    let walked = 0;
    for (const a of answers(round)) {
      walked += 1;
      const v = game.check(round, a);
      const right = a.every((n, i) => !isOpen(round, i) || n === want[i]);
      expect(v.ok, `answer ${a}`).toBe(right);
      if (v.ok) continue;
      expect(v.hint, `answer ${a}`).toBeTruthy();
      for (const s of sentences(v.hint!)) expect(listed.has(s), `answer ${a}: "${s}"`).toBe(true);
    }
    expect(walked).toBeGreaterThan(round.cells);
  });

  it('lists only hints check can give, none empty or over 300 characters', () => {
    for (const { round } of DISTINCT) {
      const given = new Set<string>();
      for (const a of answers(round)) {
        const v = game.check(round, a);
        if (!v.ok && v.hint) given.add(v.hint);
      }
      for (const h of game.hints!(round)) {
        expect(given.has(h), h).toBe(true);
        expect(h.trim().length).toBeGreaterThan(0);
        expect(h.length).toBeLessThanOrEqual(300);
      }
    }
  });

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    for (const l of [...boardLines, ...hintSentences]) expect(all.has(l), l).toBe(true);
    for (const l of all) expect(l.length, l).toBeLessThanOrEqual(300);
    console.log(`what-did-our-class-choose: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
  });
});
