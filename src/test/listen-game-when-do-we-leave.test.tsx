import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import game, { type Answer, type Round } from '../maths/games/when-do-we-leave';
import { gameLines, sentences } from '../audio/gameLines';
import type { Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for When Do We Leave?: `board()` names exactly the caption
 * sentences the board renders, in screen order, and `hints()` lists every hint
 * `check()` can give for a time the two steppers can actually reach.
 */

const LEVELS: readonly Level[] = [1, 2, 3];
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
const INDEXES = 40;
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();
const board = game.board!;
const hints = game.hints!;

const rounds = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));
/** The tables cycle every 7: one entry per distinct round, for the walks that render many answers. */
const distinct = [...new Map(rounds.map((r) => [JSON.stringify(r.round), r])).values()];

/** The one caption sentence the board writes from his answer: level 3's "Your clock 11:45." */
const HIS_CLOCK = /^Your clock (?:[1-9]|1[0-2]):[0-5]\d\.$/;

/** Every time reachable by pressing the steppers from the empty answer: a full walk, the face is finite. */
const walks = new Map<string, Answer[]>();
function reachable(round: Round, level: Level): Answer[] {
  const key = JSON.stringify(round);
  const known = walks.get(key);
  if (known) return known;
  const seen = new Set<Answer>([game.emptyAnswer(round)]);
  let frontier: Answer[] = [game.emptyAnswer(round)];
  while (frontier.length) {
    const next: Answer[] = [];
    for (const answer of frontier) {
      const taps: Answer[] = [];
      const { container } = render(<game.Board round={round} level={level} answer={answer} setAnswer={(a) => taps.push(a)} stage="answering" />);
      for (const b of container.querySelectorAll<HTMLButtonElement>('.stepper__btn')) if (!b.disabled) fireEvent.click(b);
      cleanup();
      for (const a of taps) {
        if (!seen.has(a)) {
          seen.add(a);
          next.push(a);
        }
      }
    }
    frontier = next;
  }
  const out = [...seen].sort((a, b) => a - b);
  walks.set(key, out);
  return out;
}

afterEach(cleanup);

describe('when-do-we-leave read-aloud', () => {
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

  it('board() reads every caption sentence the board shows, but his own clock time', () => {
    expect(distinct).toHaveLength(21);
    for (const { level, i, round } of distinct) {
      for (const stage of STAGES) {
        const lines = board(round, level, stage);
        for (const answer of [game.emptyAnswer(round), round.target, 705]) {
          const { container } = render(<game.Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
          const shown = [...container.querySelectorAll('p.board-caption')]
            .filter((p) => p.querySelector('span'))
            .flatMap((p) => [...p.querySelectorAll('span')].map((s) => norm(s.textContent)));
          cleanup();
          // Every caption sentence is read, in order, except the one that restates his answer.
          expect(shown.filter((s) => !HIS_CLOCK.test(s)), `L${level} #${i} ${stage} ${answer}`).toEqual([...lines]);
          // ...and that one shows only on a level-3 hint.
          expect(shown.some((s) => HIS_CLOCK.test(s)), `L${level} #${i} ${stage}`).toBe(stage === 'hint' && round.task === 'later');
        }
      }
    }
  });

  it('draws the captions with the same words as before', () => {
    const later = game.generate(3, 0);
    const { container } = render(<game.Board round={later} level={3} answer={705} setAnswer={() => {}} stage="hint" />);
    expect([...container.querySelectorAll('p.board-caption')].map((p) => p.textContent)).toContain(
      'Now 3:00. Your clock 11:45. Dashed hands: where Now is. Orange: the hour. Blue: the minutes.',
    );
    cleanup();
    expect(board(game.generate(3, 3), 3, 'worked').join(' ')).toBe(
      'Now 11:30, two hours later 1:30. 1:30 is half past 1. Short hand past 1, not yet 2: the hour is 1. Long hand half way round: 30 minutes past.',
    );
    expect(board(game.generate(1, 1), 1, 'hint').join(' ')).toBe('Orange: the hour the short hand is in. Blue: the minutes the long hand has swept.');
  });

  it('reads nothing while he answers or once he is right', () => {
    for (const { level, round } of rounds) {
      expect(board(round, level, 'answering')).toEqual([]);
      expect(board(round, level, 'solved')).toEqual([]);
    }
  });

  it('hints() holds every hint check() gives for a time the steppers can reach, and nothing else', () => {
    for (const { level, i, round } of rounds) {
      const listed = hints(round);
      const listedSentences = new Set(listed.flatMap(sentences));
      const answers = reachable(round, level);
      // Every multiple of a press round the face: 24 times on levels 1-2, 48 on level 3.
      expect(answers, `L${level} #${i}`).toEqual(Array.from({ length: 720 / round.step }, (_, k) => k * round.step));
      const given = new Set<string>();
      for (const answer of answers) {
        const v = game.check(round, answer);
        if (v.ok) continue;
        expect(v.hint, `L${level} #${i} ${answer}`).toBeTruthy();
        given.add(v.hint!);
        for (const s of sentences(v.hint!)) expect(listedSentences.has(s), `L${level} #${i} ${answer}: "${s}"`).toBe(true);
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
    const hintSentences = new Set(rounds.flatMap(({ round }) => hints(round).flatMap(sentences)));
    for (const s of [...boardLines, ...hintSentences]) expect(lines.has(s), s).toBe(true);
    console.log(`when-do-we-leave: gameLines ${lines.size}, board lines ${boardLines.size}, hint sentences ${hintSentences.size}`);
  });
});
