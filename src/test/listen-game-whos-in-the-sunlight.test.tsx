import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import whosInTheSunlight, { type Answer, type Round } from '../science/games/whos-in-the-sunlight';
import { gameLines } from '../audio/gameLines';
import type { BoardProps, Level } from '../play/types';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud for Who's in the Sunlight? (an investigation, so no `hints`):
 * `board()` lists exactly the words the board shows at each stage, in screen
 * order — the word under each answer picture, then the Help caption at 'hint'
 * and the why at 'worked' — and every other worded label the board draws is a
 * picture tag the prompt, the gold ring and `why` already carry.
 */

const game = whosInTheSunlight;
const { Board } = game;
const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 40;
const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;
type Stage = BoardProps<Round, Answer>['stage'];

const SKY_WORDS = ['Day', 'Night'] as const;
const MOON_WORDS = ['Dark', 'Crescent', 'Half', 'More than half', 'Full'] as const;

/** Every answer each level's choices can hold, and nothing yet. */
const ANSWERS: Record<Level, readonly Answer[]> = {
  1: [null, 'day', 'night'],
  2: [null, 'day', 'night'],
  3: [null, 'new', 'crescent', 'half', 'gibbous', 'full'],
};

/**
 * Worded tags the board draws that `board()` leaves out on purpose: the frame's
 * two footers, the sun/Earth/Moon names and the "From Earth" window title, the
 * pins and their Day/Night, the halves, the level 2 time tag, spin note and
 * turn meter, "Your guess" over the guess, and the shape named in the worked
 * window (the same word as its choice, which the list already reads).
 */
const UNVOICED = new Set([
  'Looking down on the North Pole',
  'Model · not to scale',
  'Sun',
  'Earth',
  'Moon',
  'From Earth',
  'California',
  'India',
  'Day',
  'Night',
  'Day half',
  'Night half',
  'Now',
  'Spins this way',
  '1 turn = 24 h',
  'Your guess',
  ...[6, 12, 18, 24].flatMap((h) => [`${h} hours`, `After ${h} hours`]),
  ...MOON_WORDS,
]);

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const hasLetter = (s: string) => /[A-Za-z]/.test(s);
/** The board's text without the guess card: "?" before a guess, "Your guess" (level 3: only after one). Neither is read. */
const words = (s: string) => norm(s.replace(/Your guess|\?/g, ' '));

const ROUNDS = LEVELS.flatMap((level) => Array.from({ length: INDEXES }, (_, i) => ({ level, i, round: game.generate(level, i) })));

function draw(round: Round, level: Level, stage: Stage, answer: Answer = game.emptyAnswer(round)) {
  return render(<Board round={round} level={level} answer={answer} setAnswer={() => {}} stage={stage} />);
}

afterEach(cleanup);

describe('whos-in-the-sunlight board()', () => {
  it('is an investigation with board() and no hints()', () => {
    expect(game.kind).toBe('investigate');
    expect(game.board).toBeTypeOf('function');
    expect('hints' in game).toBe(false);
  });

  it.each(ROUNDS)('L$level #$i: every line is on the board, in screen order', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage);
      const text = norm(draw(round, level, stage).container.textContent ?? '');
      let from = 0;
      for (const line of lines) {
        const at = text.indexOf(norm(line), from);
        expect(at, `${stage}: "${line}" in "${text}"`).toBeGreaterThanOrEqual(0);
        from = at + norm(line).length;
      }
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: every worded label is listed or deliberately left out', ({ level, round }) => {
    for (const stage of STAGES) {
      const lines = game.board!(round, level, stage).map(norm);
      const { container } = draw(round, level, stage);
      // The choice words, one per button, open the list.
      const choices = [...container.querySelectorAll('button')].map((b) => norm(b.textContent ?? ''));
      expect(choices).toEqual(round.kind === 'moon' ? [...MOON_WORDS] : [...SKY_WORDS]);
      expect(choices).toEqual(lines.slice(0, choices.length));
      // The caption under the choices is the rest of the list.
      const captions = [...container.querySelectorAll('.board-caption')].map((e) => norm(e.textContent ?? ''));
      expect(captions).toEqual(lines.slice(choices.length));
      // Anything else worded is a picture tag.
      const other = [...container.querySelectorAll('svg text')].map((e) => norm(e.textContent ?? '')).filter(hasLetter);
      for (const l of other) expect(UNVOICED.has(l), `${stage}: "${l}" is neither listed nor a known tag`).toBe(true);
      cleanup();
    }
  });

  it.each(ROUNDS)('L$level #$i: the board shows the same words whatever he guessed', ({ level, round }) => {
    for (const stage of STAGES) {
      const base = words(draw(round, level, stage).container.textContent ?? '');
      cleanup();
      for (const a of ANSWERS[level]) {
        expect(words(draw(round, level, stage, a).container.textContent ?? ''), `${stage} / ${a}`).toBe(base);
        cleanup();
      }
    }
  });

  it('reads the choices at every stage, plus the Help caption at hint and the why at worked', () => {
    for (const { level, round } of ROUNDS) {
      const choices = game.board!(round, level, 'answering');
      expect(choices).toEqual(round.kind === 'moon' ? [...MOON_WORDS] : [...SKY_WORDS]);
      expect(game.board!(round, level, 'solved')).toEqual(choices);
      const hint = game.board!(round, level, 'hint');
      expect(hint.slice(0, choices.length)).toEqual(choices);
      expect(hint).toHaveLength(choices.length + 1);
      expect(hint[hint.length - 1]).not.toBe(game.why(round));
      const worked = game.board!(round, level, 'worked');
      expect(worked).toEqual([...choices, game.why(round)]);
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

  it('lists every line through gameLines', () => {
    const all = new Set(gameLines(game));
    const boardLines = new Set(ROUNDS.flatMap(({ level, round }) => STAGES.flatMap((s) => game.board!(round, level, s))));
    for (const l of boardLines) expect(all.has(l), l).toBe(true);
    for (const l of all) {
      expect(l.trim().length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    console.log(`whos-in-the-sunlight: gameLines ${all.size}, board lines ${boardLines.size}, hint sentences 0`);
    console.log([...boardLines].join('\n'));
  });
});
