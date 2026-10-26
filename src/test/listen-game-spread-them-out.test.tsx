import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game from '../maths/games/spread-them-out';
import type { Answer, Round } from '../maths/games/spread-them-out';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Spread Them Out: every word a read button can ask for is
 * listable in advance, and is exactly what the board shows.
 *  - board(): the worked caption (on 'worked'), then the three choices, as rendered.
 *  - hints(): every hint check() gives, over every answer the board can produce.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

/** Every answer a tap on the board can set, found by tapping every button from each answer reached. */
function reachable(round: Round, level: Level): Answer[] {
  const seen = new Map<string, Answer>([[JSON.stringify(game.emptyAnswer(round)), game.emptyAnswer(round)]]);
  const queue = [...seen.values()];
  while (queue.length) {
    const from = queue.shift() as Answer;
    const set: Answer[] = [];
    const { container } = render(<game.Board round={round} level={level} answer={from} setAnswer={(a) => set.push(a)} stage="answering" />);
    container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
    cleanup();
    for (const a of set) {
      const k = JSON.stringify(a);
      if (!seen.has(k)) {
        seen.set(k, a);
        queue.push(a);
      }
    }
  }
  return [...seen.values()];
}

afterEach(cleanup);

describe('spread-them-out read-aloud', () => {
  it('board() lists only words the board renders at that stage, in screen order', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const { container } = render(<game.Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
        const nodes = [...container.querySelectorAll('*')];
        let after: Element | null = null;
        for (const line of lines) {
          const hit = nodes.find((n) => norm(n.textContent) === norm(line) && (!after || after.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING));
          expect(hit, `L${level} #${i} ${stage}: "${line}"`).toBeDefined();
          after = hit!;
        }
        // Stage-dependent: the caption is there exactly when the board writes one.
        const caption = container.querySelector('.board-caption');
        expect(lines.length, `L${level} #${i} ${stage}`).toBe(caption ? 4 : 3);
        if (caption) expect(lines[0]).toBe(norm(caption.textContent));
        cleanup();
      }
    }
  });

  it('board() never depends on the answer: every visible choice word is listed', () => {
    for (const { level, round } of rounds) {
      const { container } = render(<game.Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage="answering" />);
      const words = [...container.querySelectorAll('button')].map((b) => norm(b.textContent));
      expect(words).toEqual(game.board!(round, level, 'answering'));
      cleanup();
    }
  });

  it('hints() holds every hint sentence check() gives for every answer the board can produce', () => {
    for (const { level, i, round } of rounds) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      const answers = reachable(round, level);
      expect(answers.length, `L${level} #${i}`).toBe(4);
      for (const a of answers) {
        const v = game.check(round, a);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${String(a)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) expect(listed.has(s), `L${level} #${i} ${String(a)}: "${s}"`).toBe(true);
      }
    }
  });

  it('has no empty or overlong line', () => {
    for (const { level, round } of rounds) {
      const all = [...STAGES.flatMap((s) => game.board!(round, level, s)), ...game.hints!(round), ...game.hints!(round).flatMap(sentences)];
      for (const line of all) {
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
    console.log(`spread-them-out: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    expect(boardLines.size).toBe(21);
  });
});
