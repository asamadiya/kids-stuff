import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { nearest, type Answer, type Round } from '../maths/games/about-how-many';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for About How Many?: `board()` names exactly the words the board
 * renders, in screen order, and `hints()` lists every hint `check()` can give
 * for an answer the board can actually hold (nothing yet, or one of the three
 * amounts).
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const board = game.board!;
const hints = game.hints!;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle every seven rounds: one of each distinct (level, round), for the costly render walks. */
const distinct = [...new Map(rounds.map((r) => [`${r.level}:${JSON.stringify(r.round)}`, r])).values()];

/** Every answer reachable by tapping the board's choices, starting from the empty answer, two taps deep. */
function reachable(round: Round, level: Level): Answer[] {
  const seen = new Map<string, Answer>([[JSON.stringify(game.emptyAnswer(round)), game.emptyAnswer(round)]]);
  let frontier: Answer[] = [game.emptyAnswer(round)];
  for (let depth = 0; depth < 2; depth++) {
    const next: Answer[] = [];
    for (const answer of frontier) {
      const taps: Answer[] = [];
      const { container } = render(<game.Board round={round} level={level} answer={answer} setAnswer={(a) => taps.push(a)} stage="answering" />);
      for (const b of container.querySelectorAll('button.choice')) fireEvent.click(b);
      cleanup();
      for (const a of taps) {
        const k = JSON.stringify(a);
        if (!seen.has(k)) {
          seen.set(k, a);
          next.push(a);
        }
      }
    }
    frontier = next;
  }
  return [...seen.values()];
}

afterEach(cleanup);

describe('about-how-many read-aloud', () => {
  it('board() lines are rendered by the board, exactly and in screen order, at every stage', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const lines = board(round, level, stage);
        const { container } = render(<game.Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
        const els = [...container.querySelectorAll('*')];
        let at = -1;
        for (const line of lines) {
          const found = els.findIndex((el, j) => j > at && norm(el.textContent) === line);
          expect(found, `L${level} #${i} ${stage}: "${line}"`).toBeGreaterThan(at);
          at = found;
        }
        // The three button words and the caption, as rendered, are exactly the ones board() reads.
        const buttons = [...container.querySelectorAll('button.choice')].map((b) => norm(b.textContent));
        const caption = [...container.querySelectorAll('.board-caption')].map((p) => norm(p.textContent));
        const card = stage === 'worked' || stage === 'solved' ? [`about ${nearest(round)}`] : [];
        expect(lines, `L${level} #${i} ${stage}`).toEqual([...card, ...buttons, ...caption]);
        cleanup();
      }
    }
  });

  it('board() never depends on his answer: the same words show whatever he tapped', () => {
    expect(distinct).toHaveLength(21);
    for (const { level, i, round } of distinct) {
      for (const stage of STAGES) {
        const lines = board(round, level, stage);
        for (const answer of [null, ...round.choices]) {
          const { container } = render(<game.Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
          const text = [...container.querySelectorAll('*')].map((el) => norm(el.textContent));
          for (const line of lines) expect(text, `L${level} #${i} ${stage} ${String(answer)}: "${line}"`).toContain(line);
          cleanup();
        }
      }
    }
  });

  it('board() reads the card only once it shows the closest amount, and the caption only at the hint', () => {
    for (const { level, round } of rounds) {
      const choices = round.choices.map((n) => `about ${n}`);
      expect(board(round, level, 'answering')).toEqual(choices);
      expect(board(round, level, 'hint')).toEqual([...choices, expect.stringMatching(/^Each gold band (of one thin half )?holds as many as the jar of 10\.$/)]);
      expect(board(round, level, 'worked')).toEqual([`about ${nearest(round)}`, ...choices]);
      expect(board(round, level, 'solved')).toEqual(board(round, level, 'worked'));
    }
  });

  it('hints() holds every hint check() gives for an answer the board can hold', () => {
    for (const { level, i, round } of distinct) {
      const listed = hints(round);
      const listedSentences = new Set(listed.flatMap(sentences));
      const answers = reachable(round, level);
      expect(answers.length, `L${level} #${i}`).toBe(4);
      const given = new Set<string>();
      for (const answer of answers) {
        const v = game.check(round, answer);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${String(answer)}`).toBeTruthy();
        given.add(v.hint!);
        for (const s of sentences(v.hint!)) expect(listedSentences.has(s), `L${level} #${i} ${String(answer)}: "${s}"`).toBe(true);
      }
      // Nothing listed that check() never gives.
      expect([...given].sort()).toEqual([...listed].sort());
    }
  });

  it('has no empty or over-long entry', () => {
    const all = [
      ...rounds.flatMap(({ level, round }) => STAGES.flatMap((stage) => board(round, level, stage))),
      ...rounds.flatMap(({ round }) => hints(round).flatMap((h) => [h, ...sentences(h)])),
      ...gameLines(game),
    ];
    for (const s of all) {
      expect(s.trim().length, JSON.stringify(s)).toBeGreaterThan(0);
      expect(s.length, s).toBeLessThanOrEqual(300);
    }
  });

  it('gameLines covers every board line and hint sentence', () => {
    const lines = new Set(gameLines(game));
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((stage) => board(round, level, stage))));
    const wholeHints = new Set(rounds.flatMap(({ round }) => hints(round)));
    const hintSentences = new Set([...wholeHints].flatMap(sentences));
    for (const s of [...boardLines, ...hintSentences]) expect(lines.has(s), s).toBe(true);
    // The audit's enumeration (games-strings.json): 14 board strings, 24 whole hints.
    expect(boardLines.size).toBe(14);
    expect(wholeHints.size).toBe(24);
    console.log(`about-how-many: gameLines ${lines.size}, board lines ${boardLines.size}, hints ${wholeHints.size}, hint sentences ${hintSentences.size}`);
  });
});
