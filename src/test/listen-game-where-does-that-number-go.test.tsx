import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { tickCount, workedLine, type Answer, type Round } from '../maths/games/where-does-that-number-go';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Where Does That Number Go?
 *  - board(): the worked caption under the road ("From the 5 stone: 6, 7.") on
 *    'worked'; nothing at any other stage, because the rest of the board is
 *    stone numbers, "+2" / "−5" jump marks, landing numbers and bare arrows.
 *  - hints(): every hint check() gives over every answer the board can produce
 *    (no spot, or one of the eleven spots), split as the shell reads it.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
type Stage = BoardProps<Round, Answer>['stage'];

const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle every 7; the walk only needs each distinct round once. */
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);

/** Every answer a tap on the board can set, found by tapping every button from each answer reached. */
function reachable(round: Round, level: Level): Answer[] {
  const seen = new Map<string, Answer>([[JSON.stringify(game.emptyAnswer(round)), game.emptyAnswer(round)]]);
  const queue = [...seen.values()];
  while (queue.length) {
    const from = queue.shift() as Answer;
    const set: Answer[] = [];
    const { container } = draw(round, level, 'answering', from, (a) => set.push(a));
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

describe('where-does-that-number-go read-aloud', () => {
  it('board() lists exactly the words the board renders at that stage, in screen order', () => {
    for (const { level, i, round } of ROUNDS) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const { container } = draw(round, level, stage);
        const nodes = [...container.querySelectorAll('*')];
        let after: Element | null = null;
        for (const line of lines) {
          const hit = nodes.find((n) => norm(n.textContent) === norm(line) && (!after || after.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING));
          expect(hit, `L${level} #${i} ${stage}: "${line}"`).toBeDefined();
          after = hit!;
        }
        // The caption is there exactly on 'worked', and it is all board() reads.
        const caption = container.querySelector('.board-caption');
        expect(Boolean(caption), `L${level} #${i} ${stage}`).toBe(stage === 'worked');
        expect(lines, `L${level} #${i} ${stage}`).toEqual(stage === 'worked' ? [workedLine(round)] : []);
        expect(norm(caption?.textContent), `L${level} #${i} ${stage}`).toBe(lines.join(' '));
        cleanup();
      }
    }
  });

  it('board() leaves out only numbers and jump marks', () => {
    for (const { level, i, round } of DISTINCT) {
      for (const stage of STAGES) {
        for (const answer of [game.emptyAnswer(round), ...Array.from({ length: tickCount(round) }, (_, t) => t)]) {
          const { container } = draw(round, level, stage, answer);
          // Outside the drawings, the only words are the caption board() lists.
          const words = container.cloneNode(true) as HTMLElement;
          words.querySelectorAll('svg').forEach((s) => s.remove());
          expect(norm(words.textContent), `L${level} #${i} ${stage} ${String(answer)}`).toBe(game.board!(round, level, stage).join(' '));
          // Inside them: stone and landing numbers, and the "+2" / "−5" jump marks.
          for (const t of container.querySelectorAll('svg text')) {
            const s = norm(t.textContent);
            expect(/^[+−]?\d+$/.test(s), `L${level} #${i} ${stage} ${String(answer)}: "${s}"`).toBe(true);
          }
          cleanup();
        }
      }
    }
  });

  it('hints() is exactly the hint sentences check() gives over every answer the board can produce', () => {
    for (const { level, i, round } of DISTINCT) {
      const listed = game.hints!(round);
      const answers = reachable(round, level);
      expect(answers.length, `L${level} #${i}`).toBe(tickCount(round) + 1);
      const said = new Set<string>();
      for (const a of answers) {
        const v = game.check(round, a);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${String(a)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) {
          expect(listed, `L${level} #${i} ${String(a)}: "${s}"`).toContain(s);
          said.add(s);
        }
      }
      expect(new Set(listed), `L${level} #${i}`).toEqual(said);
      // Already split: each listed entry is one sentence, as the shell reads it.
      for (const h of listed) expect(sentences(h), h).toEqual([h]);
    }
  });

  it('has no empty or overlong line', () => {
    for (const { level, round } of ROUNDS) {
      for (const line of [...STAGES.flatMap((s) => game.board!(round, level, s)), ...game.hints!(round)]) {
        expect(line.trim().length, line).toBeGreaterThan(0);
        expect(line.length, line).toBeLessThanOrEqual(300);
      }
    }
  });

  it('feeds gameLines (counts printed)', () => {
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round)));
    const lines = new Set(gameLines(game));
    for (const l of [...boardLines, ...hintSentences]) expect(lines.has(l), l).toBe(true);
    console.log(`where-does-that-number-go: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    expect(boardLines.size).toBe(20);
    expect(hintSentences.size).toBe(53);
  });
});
