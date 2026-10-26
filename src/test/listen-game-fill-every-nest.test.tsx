import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { shape, solution, type Answer, type Round } from '../maths/games/fill-every-nest';
import { gameLines, sentences } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Fill Every Nest.
 *  - board(): the pattern label ("every nest like this", make and group), the
 *    brown-eggs caption, the tray's "Tap +" line, the finished tray's two
 *    labels on 'solved', and on 'worked' the equation and its caption.
 *  - hints(): every hint sentence check() gives over every answer the board can
 *    make, except the two combinatorial count lists ("The nests hold 1, 0 and 4
 *    eggs, not all the same.", "The rows with eggs hold 3 and 5."): the board
 *    draws each nest's count under it on the hint stage.
 * Left to the picture: the basket's "empty" and "6 in the basket", and the
 * count tags.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
type Stage = BoardProps<Round, Answer>['stage'];

/** The board's per-nest cap: NEST_MAX in a nest, ROW_MAX in a tray row. */
const capOf = (round: Round) => (round.layout === 'rows' ? 8 : 10);
/** The two count-list sentences the audit classes combinatorial: left to the board's count tags. */
const SKIPPED = [
  /^The (nests|rows) hold \d+(, \d+)* and \d+ eggs, not all the same\.$/,
  /^The (nests|rows) with eggs hold \d+((, \d+)* and \d+)?\.$/,
];
const skipped = (s: string) => SKIPPED.some((r) => r.test(s));

const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle every 8; each distinct round once is enough for the walks. */
const DISTINCT = [...new Map(ROUNDS.map((r) => [JSON.stringify(r.round), r])).values()];

const draw = (round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round), setAnswer: (a: Answer) => void = () => {}) =>
  render(<game.Board round={round} level={level} answer={answer} setAnswer={setAnswer} stage={stage} />);

/** Can the board hold this answer: each nest within its cap, and no more eggs than the basket had. */
const allowed = (round: Round, a: Answer) =>
  a.every((x, i) => x >= 0 && round.start[i] + x <= capOf(round)) && (round.kind === 'make' || sum(a) <= round.eggs);

/** Every answer the board can hold, by depth-first walk over the nests. */
function domain(round: Round, visit: (a: Answer) => void): void {
  const a = Array.from({ length: round.nests }, () => 0);
  const basket = round.kind === 'make' ? Infinity : round.eggs;
  const walk = (i: number, used: number) => {
    if (i === round.nests) {
      visit(a);
      return;
    }
    for (let x = 0; round.start[i] + x <= capOf(round) && used + x <= basket; x += 1) {
      a[i] = x;
      walk(i + 1, used + x);
    }
    a[i] = 0;
  };
  walk(0, 0);
}

/** How many evenly spaced answers of the walk `probes` takes, besides the fixed ones. */
const SAMPLES = 10;

/** A spread of answers to probe the board with: empty, solved, every nest full, and evenly spaced ones from the walk. */
function probes(round: Round): Answer[] {
  const out: Answer[] = [game.emptyAnswer(round), solution(round)];
  const full = round.start.map((s) => capOf(round) - s);
  if (allowed(round, full)) out.push(full);
  let total = 0;
  domain(round, () => {
    total += 1;
  });
  const stride = Math.max(1, Math.floor(total / SAMPLES));
  let k = 0;
  domain(round, (a) => {
    if (k++ % stride === 0) out.push([...a]);
  });
  return out;
}

afterEach(cleanup);

describe('fill-every-nest board()', () => {
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

  it('never changes with his answer', () => {
    for (const { level, round } of DISTINCT)
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage);
        for (const a of probes(round)) {
          const { container } = draw(round, level, stage, a);
          const text = norm(container.textContent);
          for (const line of lines) expect(text.includes(norm(line)), `${stage} ${JSON.stringify(a)}: "${line}"`).toBe(true);
          cleanup();
        }
      }
  });

  it('leaves out only the basket tags, count tags and, on worked, the tray labels the caption repeats', () => {
    for (const { level, i, round } of DISTINCT) {
      for (const stage of STAGES) {
        const lines = game.board!(round, level, stage).map(norm);
        const { container } = draw(round, level, stage);
        const worded = [...container.querySelectorAll('p, span, text')]
          .filter((e) => e.children.length === 0)
          .map((e) => norm(e.textContent))
          .filter(hasLetter);
        for (const t of worded) {
          const ok =
            lines.includes(t) ||
            t === 'empty' ||
            /^\d+ in the basket$/.test(t) ||
            (stage === 'worked' && lines.some((l) => l !== t && l.includes(t)));
          expect(ok, `L${level} #${i} ${stage}: "${t}" not in ${JSON.stringify(lines)}`).toBe(true);
        }
        cleanup();
      }
    }
  });

  it('reads the worked caption and equation on worked, and nothing for a share round before then', () => {
    for (const { level, round } of DISTINCT) {
      const worked = game.board!(round, level, 'worked');
      const { size, filled } = shape(round);
      expect(worked[worked.length - 1]).toBe(round.layout === 'rows' ? `${filled} rows of ${size}. Read down: ${size} columns of ${filled}.` : `${filled} nests of ${size} eggs.`);
      expect(worked[worked.length - 2]).toMatch(/^\d+ [×÷] \d+( \+ \d+)? = \d+$/);
      if (round.kind === 'share' && round.layout === 'nests') expect(game.board!(round, level, 'answering')).toEqual([]);
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

describe('fill-every-nest hints()', () => {
  it('walks exactly the answers the board can make', () => {
    for (const { level, i, round } of DISTINCT) {
      for (const from of probes(round)) {
        const next: Answer[] = [];
        const { container } = draw(round, level, 'answering', from, (a) => next.push(a));
        container.querySelectorAll('button').forEach((b) => fireEvent.click(b));
        cleanup();
        // Every tap lands inside the domain, and every one-egg step inside the domain is a tap.
        for (const a of next) expect(allowed(round, a), `L${level} #${i} ${JSON.stringify(from)} -> ${JSON.stringify(a)}`).toBe(true);
        const steps = from.flatMap((x, k) => [-1, 1].map((d) => from.map((y, j) => (j === k ? x + d : y)))).filter((a) => allowed(round, a));
        const tapped = new Set(next.map((a) => JSON.stringify(a)));
        for (const a of steps) expect(tapped.has(JSON.stringify(a)), `L${level} #${i} ${JSON.stringify(from)} -> ${JSON.stringify(a)}`).toBe(true);
      }
    }
  });

  it('lists every hint sentence the board can produce, bar the skipped count lists, and nothing else', () => {
    for (const { level, i, round } of DISTINCT) {
      const listed = new Set(game.hints!(round).flatMap(sentences));
      const given = new Set<string>();
      let answers = 0;
      domain(round, (a) => {
        answers += 1;
        const v = game.check(round, a);
        if (v.ok) return;
        expect(v.hint, `L${level} #${i} ${JSON.stringify(a)}`).toBeTruthy();
        for (const s of sentences(v.hint!)) {
          given.add(s);
          if (!listed.has(s)) expect(skipped(s), `L${level} #${i} ${JSON.stringify(a)}: "${s}"`).toBe(true);
        }
      });
      expect(answers).toBeGreaterThan(0);
      expect([...listed].filter((s) => !given.has(s)), `L${level} #${i}: listed but never given`).toEqual([]);
    }
  });

  it('never lists an empty hint or one over 300 characters', () => {
    for (const { round } of ROUNDS)
      for (const h of game.hints!(round)) {
        expect(h.trim().length).toBeGreaterThan(0);
        expect(h.length).toBeLessThanOrEqual(300);
      }
  });

  it('feeds gameLines (counts printed)', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    const hintSentences = new Set(ROUNDS.flatMap(({ round }) => game.hints!(round).flatMap(sentences)));
    for (const l of [...boardLines, ...hintSentences]) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    console.log(`fill-every-nest: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
    console.log([...boardLines].join('\n'));
  });
});
