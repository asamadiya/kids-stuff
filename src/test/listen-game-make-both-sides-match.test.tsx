import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../maths/games/make-both-sides-match';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Make Both Sides Match. The board's only words are the tray
 * label and number tags, so the game has no `board`. Its one hint sentence is
 * the two pan totals, unbounded because the open pan takes any number of
 * weights, so `hints()` lists nothing and the sentence is left to the board,
 * which draws the same two totals under the pans.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
/** The number sentence the audit says to skip: the whole hint, two pan totals. */
const SKIPPED = /^Left pan (\d+), right pan (\d+)\.$/;
/** The walk's bound on what he has put on the open pan (the audit measured to 40). */
const MAX_PLACED = 40;
/** At this bound and below, also render the hint stage and read the drawn totals. */
const MAX_RENDERED = 10;

const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const distinct = rounds.filter((r) => r.i < 7);

function renderBoard(round: Round, level: Level, answer: Answer, stage: (typeof STAGES)[number], setAnswer: (a: Answer) => void = () => {}) {
  return render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);
}

/** The weights the tray offers, found by tapping each tray button once. */
function trayWeights(round: Round, level: Level): number[] {
  const taps: Answer[] = [];
  const { container } = renderBoard(round, level, game.emptyAnswer(round), 'answering', (a) => taps.push(a));
  for (const b of container.querySelectorAll('.tray button')) fireEvent.click(b);
  cleanup();
  return taps.map((a) => {
    expect(a).toHaveLength(1);
    return a[0];
  });
}

/** Every load of the open pan the tray can make, as a sorted multiset, up to `max` in total. */
function loads(weights: readonly number[], max: number): number[][] {
  const out: number[][] = [];
  const walk = (from: number, acc: number[]) => {
    out.push(acc);
    for (let k = from; k < weights.length; k++) if (sum(acc) + weights[k] <= max) walk(k, [...acc, weights[k]]);
  };
  walk(0, []);
  return out;
}

afterEach(cleanup);

describe('make-both-sides-match read-aloud', () => {
  it('has no board lines because the board shows only the tray label and number tags', () => {
    expect(game.board).toBeUndefined();
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const { container } = renderBoard(round, level, game.emptyAnswer(round), stage);
        const words = (container.textContent ?? '').match(/[A-Za-z]+/g) ?? [];
        expect(words, `L${level} #${i} ${stage}`).toEqual(['Weights']);
        cleanup();
      }
    }
  });

  it('every hint check() gives is the skipped number sentence, and the board draws its two totals', () => {
    let checked = 0;
    for (const { level, i, round } of distinct) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      const weights = trayWeights(round, level);
      expect(weights, `L${level} #${i}`).toEqual([1, 2, 5]);
      for (const load of loads(weights, MAX_PLACED)) {
        const v = game.check(round, load);
        if (v.ok) continue;
        for (const s of sentences(v.hint!)) {
          if (listed.has(s)) continue;
          expect(s, `L${level} #${i} [${load}]`).toMatch(SKIPPED);
        }
        if (sum(load) <= MAX_RENDERED) {
          const [, l, r] = SKIPPED.exec(v.hint!)!;
          const { container } = renderBoard(round, level, load, 'hint');
          const totals = [...container.querySelectorAll('.balance-pan__total')].map((p) => p.textContent);
          expect(totals, `L${level} #${i} [${load}]`).toEqual([l, r]);
          cleanup();
        }
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(1000);
  });

  it('lists no hint sentence: the hint has no fixed part', () => {
    for (const { round } of rounds) expect(game.hints!(round)).toEqual([]);
  });

  it('gives the clip builder no empty or over-long line', () => {
    const lines = gameLines(game);
    const boardLines = new Set(rounds.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board?.(round, level, s) ?? [])));
    const hintSentences = new Set(rounds.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    console.log(`make-both-sides-match gameLines: ${lines.length} lines; board ${boardLines.size}; hint sentences ${hintSentences.size}`);
    for (const line of [...lines, ...boardLines, ...hintSentences]) {
      expect(line.trim()).not.toBe('');
      expect(line.length, line).toBeLessThanOrEqual(300);
    }
    // The empty-pan hint of each distinct round still gets a clip, from gameLines' own probe.
    for (const { round } of distinct) {
      for (const s of sentences(game.check(round, game.emptyAnswer(round)).hint!)) expect(lines).toContain(s);
    }
  });
});
