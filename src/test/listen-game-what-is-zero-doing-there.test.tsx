import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { split, type Answer, type Round } from '../maths/games/what-is-zero-doing-there';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for What Is Zero Doing There?
 *  - board(): level 3's "This is N." over the built neighbour and the "no tens"
 *    label on each of its empty places; on 'worked' and 'solved', the "no ones"
 *    label under each arrow to a 0 on the mat.
 *  - hints(): "The mat is empty." and every "105 has 0 tens; the mat has 1 ten."
 *    over the whole answer domain (0..9 blocks a place). "The blocks make N."
 *    (N up to 999) is the number sentence the board draws at 'hint': skipped.
 * Left to the picture: the column names, the digits, the tray label "Blocks",
 * and "The blocks on the mat make N:" (the mat's number, written under it).
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const MAX = 9;
type Stage = BoardProps<Round, Answer>['stage'];

/** The number sentence of a hint, the one sentence hints() leaves out. */
const SKIPPED_HINT = /^The blocks make [1-9]\d{0,2}\.$/;
/** Worded text the board shows that board() leaves to the picture. */
const SKIPPED_BOARD = /^(hundreds|tens|ones|Blocks|The blocks on the mat make \d{1,3}:)$/;

const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);

/** Every mat the tray can build: 0..MAX blocks on each place the round has, none on the others. */
function domain(round: Round): Answer[] {
  const r = (on: boolean) => (on ? Array.from({ length: MAX + 1 }, (_, k) => k) : [0]);
  return r(round.places === 3).flatMap((h) => r(true).flatMap((t) => r(true).map((o) => ({ h, t, o }))));
}

/** The answers one round of taps reaches from `from`. */
function taps(round: Round, level: Level, from: Answer): Answer[] {
  const next: Answer[] = [];
  const { container } = draw(round, level, 'answering', from, (a) => next.push(a));
  container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
  cleanup();
  return next;
}

/** Visible worded text, leaf by leaf, in document order. */
function words(container: HTMLElement): string[] {
  return [...container.querySelectorAll('*')]
    .filter((n) => [...n.childNodes].some((c) => c.nodeType === Node.TEXT_NODE && norm(c.textContent)))
    .map((n) => norm(n.textContent))
    .filter((t) => /[A-Za-z]/.test(t));
}

afterEach(cleanup);

describe('what-is-zero-doing-there read-aloud', () => {
  it('board() lists only words the board renders at that stage, in screen order', () => {
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
        cleanup();
      }
    }
  });

  it('board() is every worded label the board shows, beyond the skipped ones, wherever that is answer-free', () => {
    for (const { level, i, round } of DISTINCT) {
      // 'answering' with nothing placed; 'worked' draws the target whatever he built;
      // 'solved' is reached only with the target built (one way per number: 0..9 a place).
      const cases: [Stage, Answer][] = [
        ['answering', game.emptyAnswer(round)],
        ['worked', game.emptyAnswer(round)],
        ['worked', { h: 9, t: 9, o: 9 }],
        ['solved', split(round.target)],
      ];
      for (const [stage, answer] of cases) {
        const { container } = draw(round, level, stage, answer);
        expect(words(container).filter((t) => !SKIPPED_BOARD.test(t)), `L${level} #${i} ${stage}`).toEqual(game.board!(round, level, stage));
        cleanup();
      }
    }
  });

  it('the tray builds exactly 0..9 blocks a place: the hint domain is the board domain', () => {
    for (const { level, i, round } of DISTINCT) {
      const has = (p: keyof Answer) => p !== 'h' || round.places === 3;
      const corners: Answer[] = [game.emptyAnswer(round), { h: has('h') ? MAX : 0, t: MAX, o: MAX }, { h: has('h') ? 4 : 0, t: 0, o: MAX }];
      for (const from of corners) {
        const want = (['h', 't', 'o'] as const).filter(has).flatMap((p) => [
          ...(from[p] < MAX ? [{ ...from, [p]: from[p] + 1 }] : []),
          ...Array.from({ length: from[p] }, () => ({ ...from, [p]: from[p] - 1 })),
        ]);
        const got = taps(round, level, from);
        const key = (a: Answer) => `${a.h}${a.t}${a.o}`;
        expect(got.map(key).sort(), `L${level} #${i} from ${key(from)}`).toEqual(want.map(key).sort());
      }
    }
    // One whole walk, to tie the corner rule to the domain.
    const { level, round } = ROUNDS[0];
    const seen = new Map([[JSON.stringify(game.emptyAnswer(round)), game.emptyAnswer(round)]]);
    const queue = [...seen.values()];
    while (queue.length) {
      for (const a of taps(round, level, queue.shift()!)) {
        if (!seen.has(JSON.stringify(a))) {
          seen.set(JSON.stringify(a), a);
          queue.push(a);
        }
      }
    }
    expect(new Set(seen.keys())).toEqual(new Set(domain(round).map((a) => JSON.stringify(a))));
  });

  it('hints() holds every hint sentence check() gives over the whole domain, but the number sentence', () => {
    for (const { level, i, round } of DISTINCT) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      const used = new Set<string>();
      for (const a of domain(round)) {
        const v = game.check(round, a);
        if (v.ok) continue;
        for (const s of sentences(v.hint!)) {
          if (listed.has(s)) used.add(s);
          else expect(s, `L${level} #${i} ${JSON.stringify(a)}`).toMatch(SKIPPED_HINT);
        }
      }
      // Tight: no clip for a sentence the board can never produce.
      expect([...listed].filter((s) => !used.has(s)), `L${level} #${i}`).toEqual([]);
      // Every listed entry is one sentence, as the shell splits it.
      for (const h of game.hints!(round)) expect(sentences(h)).toEqual([h]);
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
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    const lines = new Set(gameLines(game));
    for (const l of [...boardLines, ...hintSentences]) expect(lines.has(l), l).toBe(true);
    console.log(`what-is-zero-doing-there: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    for (const level of LEVELS) {
      const r = game.generate(level, level === 3 ? 2 : 1);
      console.log(`L${level} ${r.target}:`, STAGES.map((s) => `${s}=${JSON.stringify(game.board!(r, level, s))}`).join(' '));
    }
    // Seven neighbours' "This is N." and the three "no hundreds" / "no tens" / "no ones" labels.
    expect(boardLines.size).toBe(10);
    // "The mat is empty.", then 9 wrong counts a place: 7 two-place targets, 13 three-place (301 is at levels 2 and 3).
    expect(hintSentences.size).toBe(1 + 7 * 18 + 13 * 27);
  });
});
