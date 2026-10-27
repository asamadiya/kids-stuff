import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { placeFor, type Answer, type Round } from '../maths/games/turn-it-does-it-fit';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Turn It. Does It Fit? The board's words a non-reader needs
 * are the worked caption, one sentence a piece. The tap instruction under the
 * tray names the piece in his hand, so it depends on his answer and `board`
 * cannot list it. The hint is finite: each of its kinds names a set of the
 * round's pieces. `hints` lists them, and the walk below reaches every answer
 * the board can produce to check that nothing is missed.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const distinct = [...new Map(rounds.map((r) => [`${r.level}:${JSON.stringify(r.round)}`, r])).values()];

function renderBoard(round: Round, level: Level, answer: Answer, stage: (typeof STAGES)[number], setAnswer: (a: Answer) => void = () => {}) {
  return render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);
}

/**
 * What `check` reads of an answer: each placed piece's turn and place. A
 * piece in the tray or in his hand is null; its turn and the hand do not
 * change the verdict, and he can give a tray piece any turn before he puts it in.
 */
type Placed = readonly (readonly [number, readonly [number, number]] | null)[];

const asAnswer = (round: Round, c: Placed, holding: number | null = null, turn?: number): Answer => ({
  turns: c.map((e, i) => (e ? e[0] : i === holding && turn !== undefined ? turn : round.pieces[i].start % 4)),
  at: c.map((e) => (e ? e[1] : null)),
  holding,
});

/** Every set of placed pieces the board can reach from the empty outline, with the board's own `placeFor`. */
function reachable(round: Round): Placed[] {
  const start: Placed = round.pieces.map(() => null);
  const seen = new Map<string, Placed>([[JSON.stringify(start), start]]);
  const todo: Placed[] = [start];
  while (todo.length) {
    const c = todo.pop()!;
    const next: Placed[] = [];
    c.forEach((e, i) => {
      if (e) next.push(c.map((x, j) => (j === i ? null : x)));
      else
        for (let t = 0; t < 4; t += 1) {
          const at = placeFor(round, asAnswer(round, c, i, t), i);
          next.push(c.map((x, j) => (j === i ? ([t, at] as const) : x)));
        }
    });
    for (const n of next) {
      const k = JSON.stringify(n);
      if (!seen.has(k)) {
        seen.set(k, n);
        todo.push(n);
      }
    }
  }
  return [...seen.values()];
}

afterEach(cleanup);

describe('turn-it-does-it-fit read-aloud', () => {
  it('board() lists exactly the worked caption the board shows, and nothing at the other stages', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const { container } = renderBoard(round, level, game.emptyAnswer(round), stage);
        const text = norm(container.textContent ?? '');
        for (const line of lines) expect(text, `L${level} #${i} ${stage}`).toContain(norm(line));
        const caption = [...container.querySelectorAll('.board-caption')].map((p) => norm(p.textContent ?? ''));
        if (stage === 'worked') {
          expect(lines.length, `L${level} #${i}`).toBe(round.pieces.length);
          expect(caption, `L${level} #${i}`).toEqual([norm(lines.join(' '))]);
        } else {
          expect(lines, `L${level} #${i} ${stage}`).toEqual([]);
        }
        cleanup();
      }
    }
  });

  it('the walk moves pieces the way the board does', () => {
    for (const { level, i, round } of distinct) {
      let answer = game.emptyAnswer(round);
      const tap = (pick: (c: HTMLElement) => Element) => {
        const { container } = renderBoard(round, level, answer, 'answering', (a) => (answer = a));
        fireEvent.click(pick(container));
        cleanup();
      };
      tap((c) => c.querySelectorAll('.tray button')[0]);
      tap((c) => c.querySelectorAll('.tray button')[0]);
      const expected = placeFor(round, answer, 0);
      tap((c) => c.querySelector('button.slot')!);
      expect(answer, `L${level} #${i}`).toEqual(asAnswer(round, [[(round.pieces[0].start + 1) % 4, expected], ...round.pieces.slice(1).map(() => null)]));
    }
  });

  it('hints() lists every hint sentence check() gives for every answer the board can reach', () => {
    let answers = 0;
    let unused = 0;
    for (const { level, i, round } of distinct) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      const given = new Set<string>();
      for (const c of reachable(round)) {
        const v = game.check(round, asAnswer(round, c));
        answers += 1;
        if (!v.ok) given.add(v.hint!);
      }
      for (const s of [...given].flatMap(sentences)) expect(listed, `L${level} #${i}: ${s}`).toContain(s);
      // Listed but never said: only "sticks out" lines. hints() lists every set of pieces that some
      // turn and place leave outside; placeFor prefers a place that fits, so a few such sets
      // (the square in both pentagons, all four trapezoid pieces at once) never happen.
      for (const h of game.hints!(round).filter((x) => !given.has(x))) {
        expect(h, `L${level} #${i}`).toMatch(/ out \(red\)\. The gold part is empty\.$/);
        unused += 1;
      }
    }
    console.log(`turn-it-does-it-fit walk: ${answers} answers; ${unused} listed hints never given`);
    expect(answers).toBeGreaterThan(10000);
    expect(unused).toBeLessThanOrEqual(7);
  }, 300000);

  it('gives the clip builder no empty or over-long line', () => {
    const lines = gameLines(game);
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(rounds.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    console.log(`turn-it-does-it-fit gameLines: ${lines.length} lines; board ${boardLines.size}; hint sentences ${hintSentences.size}`);
    for (const line of [...lines, ...boardLines, ...hintSentences, ...rounds.flatMap(({ round }) => game.hints!(round))]) {
      expect(line.trim()).not.toBe('');
      expect(line.length, line).toBeLessThanOrEqual(300);
    }
    for (const s of [...boardLines, ...hintSentences]) expect(lines).toContain(s);
  });
});
