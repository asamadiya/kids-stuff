import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round, workedLine } from '../maths/games/whats-under-the-cup';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for What's Under the Cup?: `board()` names exactly the words the
 * board renders, in screen order, and `hints()` lists every hint `check()` can
 * give for an answer the Stepper can actually hold.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const board = game.board!;
const hints = game.hints!;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

const walked = new Map<string, Answer[]>();

/** Every answer the Stepper reaches by pressing "one more" from the empty answer until it stops. */
function reachable(round: Round, level: Level): Answer[] {
  const key = `${level}:${JSON.stringify(round)}`;
  const hit = walked.get(key);
  if (hit) return hit;
  const answers = walk(round, level);
  walked.set(key, answers);
  return answers;
}

function walk(round: Round, level: Level): Answer[] {
  const seen: Answer[] = [game.emptyAnswer(round)];
  for (;;) {
    const taps: Answer[] = [];
    const { getByRole } = render(
      <game.Board round={round} level={level} answer={seen[seen.length - 1]} setAnswer={(a) => taps.push(a)} stage="answering" />,
    );
    const more = getByRole('button', { name: 'Mangoes under the cup: one more' }) as HTMLButtonElement;
    const less = getByRole('button', { name: 'Mangoes under the cup: one less' }) as HTMLButtonElement;
    const disabled = more.disabled;
    if (!less.disabled) fireEvent.click(less);
    if (!disabled) fireEvent.click(more);
    cleanup();
    if (seen.length > 1) expect(taps[0], 'one less steps back').toBe(seen[seen.length - 2]);
    if (disabled) return seen;
    seen.push(taps[taps.length - 1]);
  }
}

afterEach(cleanup);

describe('whats-under-the-cup read-aloud', () => {
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
        cleanup();
      }
    }
  });

  it('board() reads the worked caption at the worked stage only', () => {
    for (const { level, round } of rounds) {
      expect(board(round, level, 'answering')).toEqual([]);
      expect(board(round, level, 'hint')).toEqual([]);
      expect(board(round, level, 'solved')).toEqual([]);
      expect(board(round, level, 'worked')).toEqual([workedLine(round)]);
    }
  });

  it('hints() holds every hint check() gives for an answer the Stepper can hold, and nothing else', () => {
    for (const { level, i, round } of rounds) {
      const listed = hints(round);
      const listedSentences = new Set(listed.flatMap(sentences));
      const answers = reachable(round, level);
      expect(answers, `L${level} #${i}`).toEqual(Array.from({ length: round.whole + 1 }, (_, a) => a));
      const given = new Set<string>();
      for (const answer of answers) {
        const v = game.check(round, answer);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${answer}`).toBeTruthy();
        given.add(v.hint!);
        const parts = sentences(v.hint!);
        expect(parts, v.hint).toHaveLength(2);
        for (const s of parts) expect(listedSentences.has(s), `L${level} #${i} ${answer}: "${s}"`).toBe(true);
      }
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
    const hintList = new Set(rounds.flatMap(({ round }) => hints(round)));
    const hintSentences = new Set([...hintList].flatMap(sentences));
    for (const s of [...boardLines, ...hintSentences]) expect(lines.has(s), s).toBe(true);
    expect(hintList.size).toBe(251);
    console.log(
      `whats-under-the-cup: gameLines ${lines.size}, board lines ${boardLines.size}, hints ${hintList.size}, hint sentences ${hintSentences.size}`,
    );
  });
});
