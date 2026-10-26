import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { BOTTOM, TOP } from '../maths/games/below-the-ground-floor';
import type { Answer, Round } from '../maths/games/below-the-ground-floor';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Below the Ground Floor: every word a read button can ask for
 * is listable in advance, and is exactly what the board shows.
 *  - board(): the worked caption on 'worked' and 'solved' (number sentence,
 *    then "It started on floor N." / "The fossil room is floor N."); nothing
 *    before that, because the floors and the trip card are numbers.
 *  - hints(): every hint check() gives, over every answer the board can
 *    produce (nothing, or one of the nine floors).
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
/** Words drawn inside the SVG that board() leaves out on purpose: the roof sign and the 0 plate's label. */
const UNVOICED = new Set(['MUSEUM', 'Ground floor']);
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const distinct = [...new Map(rounds.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: (typeof STAGES)[number], answer: Answer = game.emptyAnswer(round)) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);

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

describe('below-the-ground-floor read-aloud', () => {
  it('board() lists exactly the words the board renders at that stage, in screen order', () => {
    for (const { level, i, round } of rounds) {
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
        // The caption is there exactly when board() has lines, and they are all of it.
        const caption = container.querySelector('.board-caption');
        expect(Boolean(caption), `L${level} #${i} ${stage}`).toBe(stage === 'worked' || stage === 'solved');
        expect(norm(caption?.textContent), `L${level} #${i} ${stage}`).toBe(lines.join(' '));
        cleanup();
      }
    }
  });

  it('board() leaves out only numbers and the two drawn labels', () => {
    for (const { level, i, round } of distinct) {
      for (const stage of STAGES) {
        const { container } = draw(round, level, stage);
        // Outside the drawings, the only words are the caption board() lists.
        const words = container.cloneNode(true) as HTMLElement;
        words.querySelectorAll('svg').forEach((s) => s.remove());
        expect(norm(words.textContent), `L${level} #${i} ${stage}`).toBe(game.board!(round, level, stage).join(' '));
        // Inside them: floor and trip numbers, the "?" plate, the step marks, and the two labels.
        for (const t of container.querySelectorAll('svg text')) {
          const s = norm(t.textContent);
          expect(/^(−?\d+|\?)$/.test(s) || UNVOICED.has(s), `L${level} #${i} ${stage}: "${s}"`).toBe(true);
        }
        cleanup();
      }
    }
  });

  it('hints() is exactly the hint sentences check() gives over every answer the board can produce', () => {
    const floors = TOP - BOTTOM + 1;
    for (const { level, i, round } of distinct) {
      const listed = game.hints!(round);
      const answers = reachable(round, level);
      expect(answers.length, `L${level} #${i}`).toBe(floors + 1);
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
    console.log(`below-the-ground-floor: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    expect(boardLines.size).toBe(26);
  });
});
