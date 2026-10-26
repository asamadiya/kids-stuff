import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../maths/games/can-you-make-a-bigger-number';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read the board and the hint read-aloud for Can You Make a Bigger Number?
 *
 * - Every line `board()` lists is on the rendered board, word for word, in
 *   screen order, at every level, round and stage.
 * - Every hint sentence a Check can show is listed by `hints()`, except the
 *   one-more sentence that names his own number ("Your cards say 15."): a
 *   million forms, left to the number line, which draws his pin.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const MAX_CARDS = 6;
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();

const rounds = (): Array<{ level: Level; index: number; round: Round }> =>
  LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, index) => ({ level, index, round: game.generate(level, index) })));

const distinctRounds = () => [...new Map(rounds().map((r) => [JSON.stringify(r.round), r.round])).values()];

/** Every row of cards the tray can make, up to the board's MAX_CARDS. */
function answersFrom(cards: readonly number[], max: number): Answer[] {
  const out: Answer[] = [];
  let layer: Answer[] = [[]];
  for (let n = 0; n <= max; n += 1) {
    out.push(...layer);
    layer = layer.flatMap((a) => cards.map((d) => [...a, d]));
  }
  return out;
}

const digitsOf = (n: number) => String(n).split('').map(Number);

/**
 * One-more rounds: every row of up to three cards (0-9), plus his number near
 * Thatha's (start-3 .. start+3) with and without a 0 in front, plus the
 * longest rows the tray allows.
 */
function oneMoreWalk(round: Round): Answer[] {
  const near = Array.from({ length: 7 }, (_, k) => round.start - 3 + k).filter((n) => n >= 0);
  return [
    ...answersFrom([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 3),
    ...near.flatMap((n) => [digitsOf(n), [0, ...digitsOf(n)], [0, 0, ...digitsOf(n)]]).filter((a) => a.length <= MAX_CARDS),
    [9, 9, 9, 9, 9, 9],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1],
  ];
}

/** The one sentence left out of `hints` on one-more rounds: his own number, from the cards. */
const HIS_NUMBER = /^Your cards say (\d{1,6}\.|0\d{0,5}, which is \d{1,6}: a 0 in front adds nothing\.)$/;

afterEach(cleanup);

describe('can-you-make-a-bigger-number: Read the board', () => {
  it('lists only words the board shows, in screen order, at every level, round and stage', () => {
    const seen = new Set<string>();
    for (const { level, index, round } of rounds()) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const key = `${level}|${JSON.stringify(round)}|${stage}|${JSON.stringify(lines)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const { container } = render(<game.Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
        const texts = [...container.querySelectorAll('*')].map((el) => norm(el.textContent));
        let at = -1;
        for (const line of lines) {
          const next = texts.findIndex((t, i) => i > at && t === norm(line));
          expect(next, `L${level} #${index} ${stage}: "${line}" after element ${at}`).toBeGreaterThan(at);
          at = next;
        }
        cleanup();
      }
    }
  });

  it('reads the row names, the caption over the cards and the tray label', () => {
    const one: Round = { start: 99, move: 'one' };
    const digit: Round = { start: 555, move: 'digit' };
    expect(game.board!(one, 2, 'answering')).toEqual(["Thatha's", 'Yours', 'Your number', 'Digit cards']);
    expect(game.board!(one, 2, 'hint')).toEqual(["Thatha's", 'Yours', 'Your number', 'Digit cards']);
    expect(game.board!(one, 2, 'worked')).toEqual(["Thatha's", 'One more', 'The answer', 'Digit cards']);
    expect(game.board!(one, 2, 'solved')).toEqual(["Thatha's", 'One more', 'Your number', 'Digit cards']);
    expect(game.board!(digit, 2, 'answering')).toEqual(["Thatha's", 'Yours', 'Your number', 'Only 1s and 0s']);
    expect(game.board!(digit, 2, 'hint')).toEqual(["Thatha's", 'All 1s', 'Yours', 'Your number', 'Only 1s and 0s']);
    expect(game.board!(digit, 2, 'worked')).toEqual(["Thatha's", 'One more place', 'Again', 'The answer', 'Only 1s and 0s']);
    expect(game.board!(digit, 2, 'solved')).toEqual(["Thatha's", 'Yours', 'Again', 'Your number', 'Only 1s and 0s']);
  });
});

describe('can-you-make-a-bigger-number: hint sentences', () => {
  it('lists every sentence of every place-move hint, from every row of 1s and 0s the tray can make, and no other', () => {
    for (const round of distinctRounds().filter((r) => r.move === 'digit')) {
      const listed = game.hints!(round);
      const shown = new Set<string>();
      for (const a of answersFrom([1, 0], MAX_CARDS)) {
        const v = game.check(round, a);
        if (v.ok) continue;
        for (const s of sentences(v.hint!)) {
          expect(listed, `${round.start} ${a.join('')}: "${s}"`).toContain(s);
          shown.add(s);
        }
      }
      expect([...shown].sort(), `${round.start}`).toEqual([...listed].sort());
    }
  });

  it('lists every one-more sentence but his own number, which matches only the narrow form', () => {
    for (const round of distinctRounds().filter((r) => r.move === 'one')) {
      const listed = game.hints!(round);
      const shown = new Set<string>();
      for (const a of oneMoreWalk(round)) {
        const v = game.check(round, a);
        if (v.ok) continue;
        for (const s of sentences(v.hint!)) {
          if (HIS_NUMBER.test(s)) continue;
          expect(listed, `${round.start} ${a.join('')}: "${s}"`).toContain(s);
          shown.add(s);
        }
      }
      expect([...shown].sort(), `${round.start}: every listed sentence is reachable`).toEqual([...listed].sort());
    }
  });

  it('splits the hint where the clips split it: a skipped sentence is never glued to a listed one', () => {
    const round: Round = { start: 99, move: 'one' };
    expect(sentences(game.check(round, [9, 1, 0]).hint!)).toEqual([
      'Your cards say 910.',
      'That is past the next mark after 99.',
      'The ones and tens digits are all 9.',
      'One more turns them to 0 and starts the hundreds place.',
    ]);
    expect(sentences(game.check(round, [0, 9, 9]).hint!)).toEqual([
      'Your cards say 099, which is 99: a 0 in front adds nothing.',
      "That is Thatha's number.",
      'The ones and tens digits are all 9.',
      'One more turns them to 0 and starts the hundreds place.',
    ]);
    expect(sentences(game.check({ start: 555, move: 'digit' }, [0, 1, 1, 1]).hint!)).toEqual([
      'A 0 in front adds no place: 0111 is 111.',
      "Your 111 and Thatha's 555 both have 3 places.",
      '555 is bigger.',
    ]);
  });
});

describe('can-you-make-a-bigger-number: lines', () => {
  it('has no empty line and none over 300 characters', () => {
    const all = new Set<string>();
    for (const { level, round } of rounds()) {
      for (const stage of STAGES) for (const l of game.board!(round, level, stage)) all.add(l);
      for (const h of game.hints!(round)) for (const s of sentences(h)) all.add(s);
    }
    for (const l of all) {
      expect(l.trim(), JSON.stringify(l)).not.toBe('');
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
  });

  it('gives the clip builder every board line and hint sentence', () => {
    const lines = new Set(gameLines(game));
    const board = new Set<string>();
    const hint = new Set<string>();
    for (const { level, round } of rounds()) {
      for (const stage of STAGES) for (const l of game.board!(round, level, stage)) board.add(l);
      for (const h of game.hints!(round)) for (const s of sentences(h)) hint.add(s);
    }
    for (const l of [...board, ...hint]) expect(lines.has(l), l).toBe(true);
    console.log(`can-you-make-a-bigger-number: gameLines ${lines.size}, board lines ${board.size}, hint sentences ${hint.size}`);
  });
});
