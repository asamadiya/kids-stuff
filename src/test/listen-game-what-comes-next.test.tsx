import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round, type Thing } from '../maths/games/what-comes-next';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for What Comes Next?
 *  - board(): while he can tap, "It repeats every N." under a repeating row at
 *    'hint', then the tray's "Pick one, then tap a space"; once locked, a
 *    growing pattern's rule line ("1, 3, 5, 7: +2 each step.").
 *  - hints(): every hint check() gives, over every answer the board can hold.
 * Left to the picture: A B C letters, space and step numbers, counts, +2 tags,
 * "Step 1".."Step 4", the translate rows' "The pattern" / "Your row", and the
 * tray's instruction once the board is locked and takes no taps.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
type Stage = BoardProps<Round, Answer>['stage'];

const PICK = 'Pick one, then tap a space';
/** Worded board text board() leaves out: row labels the prompt already names. */
const SKIPPED = ['The pattern', 'Your row'];
/** Text left to the picture: a unit letter (A..D) or a step label. */
const LEFT_TO_PICTURE = /^(?:[A-D]|Step \d+)$/;

const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const locked = (stage: Stage) => stage === 'worked' || stage === 'solved';

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle every 7; each distinct round needs walking once. */
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);

/** Every answer one tap of each button reaches from `from`. */
function taps(round: Round, level: Level, from: Answer): Answer[] {
  const next: Answer[] = [];
  const { container } = draw(round, level, 'answering', from, (a) => next.push(a));
  container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
  cleanup();
  return next;
}

/** check() on a growing step reads only how many; elsewhere, what sits where. */
const key = (round: Round, a: Answer) =>
  round.kind === 'grow'
    ? `${Object.keys(a.placed).length}|${a.picked}`
    : `${JSON.stringify(Object.entries(a.placed).sort(([x], [y]) => Number(x) - Number(y)))}|${a.picked}`;

/** Every answer the taps reach from the empty board. */
function reachable(round: Round, level: Level): Answer[] {
  const start = game.emptyAnswer(round);
  const seen = new Map<string, Answer>([[key(round, start), start]]);
  const queue = [start];
  while (queue.length) {
    for (const a of taps(round, level, queue.shift()!)) {
      const k = key(round, a);
      if (!seen.has(k)) {
        seen.set(k, a);
        queue.push(a);
      }
    }
  }
  return [...seen.values()];
}

/** The open spaces, read off the board: the slots that take the thing in hand. */
function openOnBoard(round: Round, level: Level): number[] {
  const thing: Thing = round.kind === 'grow' ? round.thing : round.tray[0];
  const { container } = draw(round, level, 'answering', { placed: {}, picked: thing });
  const n = [...container.querySelectorAll('button[aria-label$="here"]')].length;
  cleanup();
  return Array.from({ length: n }, (_, j) => j);
}

/** The board's answer domain: each open space empty or holding one thing from the tray (a growing step: 0..slots things). */
function domain(round: Round, level: Level): Answer['placed'][] {
  const slots = openOnBoard(round, level).length;
  if (round.kind === 'grow') return Array.from({ length: slots + 1 }, (_, k) => Object.fromEntries(Array.from({ length: k }, (_, i) => [i, round.thing])));
  const spaces = round.kind === 'repeat' ? round.open : round.kind === 'far' ? [round.target] : Array.from({ length: round.bottom }, (_, i) => i);
  expect(spaces.length).toBe(slots);
  let out: Answer['placed'][] = [{}];
  for (const i of spaces) out = out.flatMap((p) => [p, ...round.tray.map((t) => ({ ...p, [i]: t }))]);
  return out;
}

afterEach(cleanup);

describe('what-comes-next board()', () => {
  it('lists, in screen order, words the board renders at that stage', () => {
    for (const { level, i, round } of ROUNDS) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        const { container } = draw(round, level, stage);
        const text = norm(container.textContent);
        let from = 0;
        for (const line of lines) {
          const at = text.indexOf(norm(line), from);
          expect(at, `L${level} #${i} ${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
          from = at + norm(line).length;
        }
        cleanup();
      }
    }
  });

  it('leaves out only letters, numbers, "Step N", the row labels and (once locked) the tray instruction', () => {
    for (const { level, i, round } of DISTINCT) {
      for (const stage of STAGES) {
        const listed = new Set([...game.board!(round, level, stage), ...SKIPPED, ...(locked(stage) ? [PICK] : [])].map(norm));
        const { container } = draw(round, level, stage);
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        const worded: string[] = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const t = norm(n.textContent);
          if (/[A-Za-z]/.test(t) && !listed.has(t) && !LEFT_TO_PICTURE.test(t)) worded.push(t);
        }
        expect(worded, `L${level} #${i} ${stage}`).toEqual([]);
        cleanup();
      }
    }
  });

  it('reads the rule line on a locked growing board, and the instruction only while he can tap', () => {
    for (const { level, round } of ROUNDS) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        expect(lines.includes(PICK)).toBe(!locked(stage));
        if (locked(stage)) expect(lines.length).toBe(round.kind === 'grow' ? 1 : 0);
        if (stage === 'hint') expect(lines.length).toBe(round.kind === 'repeat' ? 2 : 1);
      }
    }
  });

  it('never lists an empty line or one over 300 characters', () => {
    for (const { level, round } of ROUNDS)
      for (const stage of STAGES)
        for (const line of game.board!(round, level, stage)) {
          expect(line.trim().length).toBeGreaterThan(0);
          expect(line.length).toBeLessThanOrEqual(300);
        }
  });
});

describe('what-comes-next hints()', () => {
  it('the taps reach exactly the answer domain (repeat, far and growing rounds, walked in full)', () => {
    for (const { level, i, round } of DISTINCT.filter((r) => r.round.kind !== 'translate')) {
      const placed = new Set(reachable(round, level).map((a) => key(round, { placed: a.placed, picked: null })));
      const want = new Set(domain(round, level).map((p) => key(round, { placed: p, picked: null })));
      expect(placed, `L${level} #${i}`).toEqual(want);
    }
  });

  it('a translate board puts any tray thing in any of its spaces, swaps it, and takes it off', () => {
    for (const { level, i, round } of DISTINCT.filter((r) => r.round.kind === 'translate')) {
      if (round.kind !== 'translate') continue;
      expect(openOnBoard(round, level).length).toBe(round.bottom);
      const full = Object.fromEntries(Array.from({ length: round.bottom }, (_, s) => [s, round.tray[0]]));
      const fromEmpty = round.tray.flatMap((t) => taps(round, level, { placed: {}, picked: t }));
      const fromFull = [null, round.tray[1]].flatMap((t) => taps(round, level, { placed: full, picked: t }));
      for (let s = 0; s < round.bottom; s++) {
        for (const t of round.tray) expect(fromEmpty.some((a) => a.placed[s] === t && Object.keys(a.placed).length === 1), `L${level} #${i} ${s} ${t}`).toBe(true);
        expect(fromFull.some((a) => a.placed[s] === round.tray[1]), `L${level} #${i} swap ${s}`).toBe(true);
        expect(fromFull.some((a) => !(s in a.placed) && Object.keys(a.placed).length === round.bottom - 1), `L${level} #${i} off ${s}`).toBe(true);
      }
    }
  });

  it('lists exactly the hint sentences the answer domain gives', () => {
    for (const { level, i, round } of DISTINCT) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      const given = new Set<string>();
      for (const placed of domain(round, level)) {
        const v = game.check(round, { placed, picked: null });
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${JSON.stringify(placed)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) {
          expect(listed.has(s), `L${level} #${i} ${JSON.stringify(placed)}: "${s}"`).toBe(true);
          given.add(s);
        }
      }
      expect([...listed].filter((s) => !given.has(s)), `L${level} #${i}: listed but never given`).toEqual([]);
    }
  });

  it('a picked thing never changes the hint', () => {
    for (const { round } of DISTINCT) {
      const things: Thing[] = round.kind === 'grow' ? [round.thing] : [...round.tray];
      for (const t of things) expect(game.check(round, { placed: {}, picked: t })).toEqual(game.check(round, game.emptyAnswer(round)));
    }
  });

  it('never lists an empty hint or one over 300 characters', () => {
    for (const { round } of ROUNDS)
      for (const h of game.hints!(round)) {
        expect(h.trim().length).toBeGreaterThan(0);
        expect(h.length).toBeLessThanOrEqual(300);
      }
  });
});

describe('what-comes-next gameLines', () => {
  it('lists every board line and hint sentence', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    for (const l of [...boardLines, ...hintSentences]) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    console.log(`what-comes-next: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    console.log([...boardLines].join('\n'));
  });
});
