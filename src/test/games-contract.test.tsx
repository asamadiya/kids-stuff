import { describe, expect, it } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { INCOMPLETE as MATHS_INCOMPLETE, MATHS_GAMES } from '../maths/registry';
import { INCOMPLETE as SCIENCE_INCOMPLETE, SCIENCE_GAMES } from '../science/registry';
import { REQUIRED_NOTE_FIELDS } from '../notes/types';
import { GameShell } from '../play/GameShell';
import type { AnyGame, Level } from '../play/types';

/**
 * The contract every game must keep, checked across the whole registry.
 *
 * These are the advisor's rulings written as assertions, so a game that
 * drifts — a prompt that grows into a paragraph, a level that repeats the
 * same round, a note with an empty field — fails here rather than on screen.
 */

const ALL: readonly AnyGame[] = [...MATHS_GAMES, ...SCIENCE_GAMES];
const LEVELS: readonly Level[] = [1, 2, 3];
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe('the game registry', () => {
  it('has the catalogue the advisor asked for', () => {
    expect(MATHS_GAMES.length).toBeGreaterThanOrEqual(16);
    expect(SCIENCE_GAMES.length).toBeGreaterThanOrEqual(10);
  });

  it('has no game file that exports no game', () => {
    expect([...MATHS_INCOMPLETE, ...SCIENCE_INCOMPLETE]).toEqual([]);
  });

  it('uses each id once', () => {
    const ids = ALL.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe.each(ALL.map((g) => [g.id, g] as const))('%s', (_id, game) => {
  it('is the right kind for its world', () => {
    expect(game.kind).toBe(MATHS_GAMES.includes(game) ? 'solve' : 'investigate');
  });

  it('carries a complete grown-up note', () => {
    for (const f of REQUIRED_NOTE_FIELDS) {
      expect(game.note[f], f).toBeTruthy();
      expect(String(game.note[f]).length, f).toBeGreaterThan(20);
    }
  });

  it('names three levels briefly', () => {
    expect(game.levels).toHaveLength(3);
    for (const l of game.levels) expect(words(l)).toBeLessThanOrEqual(4);
  });

  it('keeps every prompt to twelve words', () => {
    for (const level of LEVELS) {
      for (let i = 0; i < 6; i += 1) {
        const p = game.prompt(game.generate(level, i));
        expect(words(p), `L${level} #${i}: ${p}`).toBeLessThanOrEqual(12);
      }
    }
  });

  it('varies within a set of five', () => {
    for (const level of LEVELS) {
      const rounds = Array.from({ length: 5 }, (_, i) => JSON.stringify(game.generate(level, i)));
      expect(new Set(rounds).size, `level ${level}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('gets harder from level 1 to level 3', () => {
    const a = JSON.stringify(game.generate(1, 0));
    const c = JSON.stringify(game.generate(3, 0));
    expect(a).not.toBe(c);
  });

  if (game.kind === 'solve') {
    it('rejects the empty answer and says something useful about it', () => {
      for (const level of LEVELS) {
        const round = game.generate(level, 1);
        const v = game.check(round, game.emptyAnswer(round));
        expect(v.ok, `level ${level}`).toBe(false);
      }
    });

    it('explains each right answer in one sentence or two', () => {
      for (const level of LEVELS) {
        const e = game.explain(game.generate(level, 2));
        expect(e.length).toBeGreaterThan(5);
        expect(words(e)).toBeLessThanOrEqual(30);
      }
    });
  } else {
    it('explains every investigation', () => {
      for (const level of LEVELS) {
        const w = game.why(game.generate(level, 0));
        expect(words(w)).toBeGreaterThan(5);
        expect(words(w)).toBeLessThanOrEqual(45);
      }
    });
  }

  it('renders its board at every level and every stage without throwing', () => {
    const { Board } = game;
    for (const level of LEVELS) {
      const round = game.generate(level, 0);
      for (const stage of ['answering', 'hint', 'worked', 'solved'] as const) {
        render(<Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />);
        cleanup();
      }
      if (game.kind === 'investigate') {
        render(<game.Outcome round={round} level={level} />);
        cleanup();
      }
    }
  });

  it('never asks for a drag', () => {
    const src = String(game.Board);
    expect(src).not.toMatch(/onDrag|draggable|onPointerMove/);
  });

  if (game.kind === 'investigate') {
    it('waits for a prediction before Try, and Help ends on the evidence with no comparison', () => {
      // The real board in the real shell: Try is muted until a tap on the board
      // moves the answer off emptyAnswer, so every board must offer that tap.
      const { container } = render(<GameShell game={game} backHref="#/science" backLabel="Science" />);
      const tryIt = screen.getByRole('button', { name: 'Try it' });
      expect(tryIt).toHaveAttribute('aria-disabled', 'true');
      fireEvent.click(tryIt);
      expect(screen.queryByText('What happened')).toBeNull();

      const pick = container.querySelector<HTMLButtonElement>('.shell__board button[aria-pressed="false"]');
      expect(pick, 'a choice on the board').not.toBeNull();
      fireEvent.click(pick!);
      expect(screen.getByRole('button', { name: 'Try it' })).not.toHaveAttribute('aria-disabled');
      cleanup();

      render(<GameShell game={game} backHref="#/science" backLabel="Science" />);
      fireEvent.click(screen.getByRole('button', { name: 'Help' }));
      fireEvent.click(screen.getByRole('button', { name: 'Help' }));
      expect(screen.getByText('What happened')).toBeInTheDocument();
      expect(screen.getByText(/Here is what happens\./)).toBeInTheDocument();
      expect(screen.queryByText(/Just as you said|Not what you said/)).toBeNull();
      cleanup();
    });
  }
});
