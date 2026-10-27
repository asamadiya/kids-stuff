import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { value, type Answer, type Mat, type Round } from '../maths/games/ten-loose-one-bundle';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Ten Loose, One Bundle: `board()` names exactly the words the
 * board renders at each stage, in screen order, and `hints()` lists every hint
 * sentence `check()` can give on a mat the board can hold, except the one
 * sentence that restates his mat in numbers ("2 bundles and 3 loose sticks
 * make 23, not 14."), which ranges over every mat and is left to the board.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];
const INDEXES = 40;
/** The tray greys a piece out at this many in its place (MAX_PER_PLACE in the game). */
const CAP = 30;
const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const board = game.board!;
const hints = game.hints!;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The distinct rounds: the tables cycle at 8, and the hint walk below is 31^3 mats a round at level 3. */
const distinct = [...new Map(rounds.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);

/** Every mat the board can hold: each place 0..CAP, and no flats below level 3 (no flats column). */
function* mats(round: Round): Generator<Mat> {
  for (let hundreds = 0; hundreds <= (round.flats ? CAP : 0); hundreds++)
    for (let tens = 0; tens <= CAP; tens++) for (let ones = 0; ones <= CAP; ones++) yield { hundreds, tens, ones };
}
const inDomain = (round: Round, m: Mat) =>
  [m.hundreds, m.tens, m.ones].every((x) => Number.isInteger(x) && x >= 0 && x <= CAP) && (round.flats || m.hundreds === 0);

const PIECE = String.raw`\d+ (?:flats?|bundles?|loose sticks?)`;
const PIECES = `${PIECE}(?:(?:, | and )${PIECE})*`;
/** The one hint sentence not voiced: his mat, named and added up, on a mat that makes the wrong amount. */
const skipped = (round: Round, m: Mat) =>
  new RegExp(round.kind === 'tie' ? `^${PIECES} makes? ${value(m)}\\.$` : `^${PIECES} makes? ${value(m)}, not ${round.target}\\.$`);

afterEach(cleanup);

describe('ten-loose-one-bundle board()', () => {
  it('lists only words the board renders, exactly and in screen order, at every stage', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const { container } = draw(round, level, stage);
        const text = norm(container.textContent);
        let from = 0;
        for (const line of board(round, level, stage)) {
          const at = text.indexOf(line, from);
          expect(at, `L${level} #${i} ${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
          from = at + line.length;
        }
        cleanup();
      }
    }
  });

  it('lists every caption, goal, tray label and swap caption the board shows', () => {
    for (const { level, i, round } of rounds) {
      for (const stage of STAGES) {
        const lines = board(round, level, stage);
        const { container } = draw(round, level, stage);
        const shown = [...container.querySelectorAll('.board-caption, figcaption, .tray__label, [role="img"] > span')]
          .map((e) => norm(e.textContent))
          .filter((t) => /[A-Za-z]/.test(t))
          // Left out on purpose: an empty column's "none yet" goes as soon as he places a piece,
          // and the tray's instruction is not read once the tray is greyed out.
          .filter((t) => t !== 'none yet' && !(t === 'Tap to put on the mat' && (stage === 'worked' || stage === 'solved')));
        // The worked caption is one paragraph read as its sentences: each caption is a run of listed lines.
        const joined = lines.flatMap((_, a) => lines.slice(a).map((__, b) => lines.slice(a, a + b + 1).join(' ')));
        for (const t of shown) expect(joined, `L${level} #${i} ${stage}: "${t}"`).toContain(t);
        cleanup();
      }
    }
  });

  it('reads the worked caption at worked only, and the tray instruction only while the tray takes taps', () => {
    for (const { level, round } of rounds) {
      const answering = board(round, level, 'answering');
      expect(board(round, level, 'hint')).toEqual(answering);
      expect(answering).toContain('Tap to put on the mat');
      expect(board(round, level, 'solved')).toEqual(answering.filter((l) => l !== 'Tap to put on the mat'));
      const worked = board(round, level, 'worked');
      expect(worked).not.toContain('Tap to put on the mat');
      expect(worked.filter((l) => !answering.includes(l)).length).toBeGreaterThanOrEqual(1);
      expect(worked.some((l) => / makes? .*\d+\.$/.test(l) && l.endsWith(`${round.target}.`))).toBe(true);
    }
  });
});

describe('ten-loose-one-bundle hints()', () => {
  it('the board holds exactly the mats the hint walk covers: taps add or take one, and stop at 30', () => {
    for (const { level, round } of distinct) {
      expect(inDomain(round, game.emptyAnswer(round))).toBe(true);
      const full: Mat = { hundreds: round.flats ? CAP : 0, tens: CAP, ones: CAP };
      for (const from of [game.emptyAnswer(round), { hundreds: 0, tens: 0, ones: 0 }, full]) {
        const set: Answer[] = [];
        const { container } = draw(round, level, 'answering', from, (a) => set.push(a));
        container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
        cleanup();
        for (const a of set) {
          expect(inDomain(round, a), JSON.stringify(a)).toBe(true);
          const moved = (['hundreds', 'tens', 'ones'] as const).map((k) => a[k] - from[k]).filter((d) => d !== 0);
          expect(moved.length === 1 && Math.abs(moved[0]) === 1, `${JSON.stringify(from)} -> ${JSON.stringify(a)}`).toBe(true);
        }
      }
      // At the cap the tray offers nothing more; only the mat's own pieces still take a tap (off).
      const set: Answer[] = [];
      const { container } = draw(round, level, 'answering', full, (a) => set.push(a));
      container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
      cleanup();
      for (const a of set) expect(value(a)).toBeLessThan(value(full));
    }
  });

  it('every hint sentence for every mat the board can hold is listed, or is the mat-in-numbers sentence', () => {
    for (const { level, i, round } of distinct) {
      const listed = new Set(hints(round).flatMap(sentences));
      const given = new Set<string>();
      let skips = 0;
      for (const m of mats(round)) {
        const v = game.check(round, m);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${JSON.stringify(m)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) {
          given.add(s);
          if (listed.has(s)) continue;
          expect(value(m), `L${level} #${i} ${JSON.stringify(m)}: "${s}"`).not.toBe(round.target);
          expect(s, `L${level} #${i} ${JSON.stringify(m)}`).toMatch(skipped(round, m));
          skips++;
        }
      }
      expect(skips).toBeGreaterThan(0);
      // Nothing listed that check() never gives.
      for (const s of listed) expect(given.has(s), `L${level} #${i}: listed "${s}" never given`).toBe(true);
    }
  });
});

describe('ten-loose-one-bundle read-aloud lines', () => {
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
    const hintSentences = new Set(rounds.flatMap(({ round }) => hints(round).flatMap(sentences)));
    for (const s of [...boardLines, ...hintSentences]) expect(lines.has(s), s).toBe(true);
    console.log(`ten-loose-one-bundle: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    for (const level of LEVELS)
      for (const stage of STAGES) {
        const r = game.generate(level, level === 3 ? 4 : 3);
        console.log(`L${level} ${r.kind} ${r.target} ${stage}: ${JSON.stringify(board(r, level, stage))}`);
      }
  });
});
