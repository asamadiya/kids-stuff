import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { GameShell } from '../play/GameShell';
import type { PlayRecord, ProblemResult } from '../play/progress';
import { loadRecord, recordProblem } from '../play/progress';
import type { BoardProps, InvestigateGame, Level, SolveGame } from '../play/types';
import type { GrownUpNote } from '../notes/types';

/**
 * The shell's three promises from the final review, as tests:
 *
 * - It never puts a prediction in his mouth. Try it waits for one, and Help in
 *   an investigation ends on the evidence with no comparison line.
 * - Levels rise on understanding only. A right answer reached after Help does
 *   not count toward a step up, and investigations never move the level.
 * - Every control carries a drawn symbol as well as its word.
 *
 * The stub investigation is the worst case the review found: `matches` says
 * yes to everything, including the empty answer, so any comparison the shell
 * made without a prediction would read "Just as you said."
 */

const NOTE: GrownUpNote = {
  what: 'A stub game used only by the shell tests, never shown to a child.',
  expect: 'Nothing; it exists so the tests control every answer exactly.',
  practising: 'Nothing; it exercises the shell, not the child.',
  ask: 'Nothing; no grown-up ever sees this note outside a test run.',
  next: 'Nothing; there is no follow-up off the screen for a stub.',
  honest: 'This proves the shell keeps its rules, not that any real game is good.',
};

type Round = { readonly n: number };
type Guess = 'rolls' | 'stops' | null;

function GuessBoard({ answer, setAnswer, stage }: BoardProps<Round, Guess>) {
  const locked = stage === 'solved';
  return (
    <div className="board">
      <p>{answer === null ? 'No guess yet.' : `Your guess: it ${answer}.`}</p>
      <button type="button" aria-pressed={answer === 'rolls'} onClick={() => !locked && setAnswer('rolls')}>
        It rolls
      </button>
      <button type="button" aria-pressed={answer === 'stops'} onClick={() => !locked && setAnswer('stops')}>
        It stops
      </button>
    </div>
  );
}

const agreeable: InvestigateGame<Round, Guess> = {
  kind: 'investigate',
  id: 'test-agreeable',
  title: 'Agreeable Stub',
  hook: 'Agrees with anything.',
  group: 'motion',
  levels: ['One', 'Two', 'Three'],
  generate: (level: Level, index: number) => ({ n: level * 10 + index }),
  prompt: () => 'Will the car roll or stop?',
  emptyAnswer: () => null,
  Board: GuessBoard,
  Outcome: () => <p>The car rolled to 9.</p>,
  matches: () => true,
  why: () => 'Nothing pushes it after the hand lets go, yet it keeps rolling until the floor stops it.',
  note: NOTE,
};

function NumberBoard({ round, answer, setAnswer }: BoardProps<Round, number | null>) {
  return (
    <div className="board">
      <p>{answer === null ? 'Empty.' : `Answer ${answer}.`}</p>
      <button type="button" onClick={() => setAnswer(round.n)}>
        Choose right
      </button>
      <button type="button" onClick={() => setAnswer(round.n + 1)}>
        Choose wrong
      </button>
    </div>
  );
}

const sums: SolveGame<Round, number | null> = {
  kind: 'solve',
  id: 'test-sums',
  title: 'Sums Stub',
  hook: 'Right or not.',
  group: 'number',
  levels: ['One', 'Two', 'Three'],
  generate: (level: Level, index: number) => ({ n: level * 10 + index }),
  prompt: (r) => `Choose ${r.n}.`,
  emptyAnswer: () => null,
  Board: NumberBoard,
  check: (r, a) => (a === r.n ? { ok: true } : { ok: false, hint: `Look for ${r.n}.` }),
  explain: (r) => `${r.n} is the number asked for.`,
  note: NOTE,
};

const button = (name: string) => screen.getByRole('button', { name });
const click = (name: string) => fireEvent.click(button(name));
const whatHappened = () => screen.queryByText('What happened');

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('an investigation never claims a prediction he did not make', () => {
  it('mutes Try it until there is a prediction, but keeps it focusable', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    const tryIt = button('Try it');
    expect(tryIt).toHaveAttribute('aria-disabled', 'true');
    expect(tryIt).not.toBeDisabled();
    expect(tryIt).toHaveStyle({ opacity: '0.45' });
    tryIt.focus();
    expect(document.activeElement).toBe(tryIt);

    fireEvent.click(tryIt);
    expect(whatHappened()).toBeNull();
    expect(screen.queryByText(/Just as you said/)).toBeNull();
    expect(screen.getByText('First choose what you think will happen.')).toBeInTheDocument();
  });

  it('enables Try it once he predicts, and only then compares', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    click('It stops');
    expect(screen.queryByText('First choose what you think will happen.')).toBeNull();
    expect(button('Try it')).not.toHaveAttribute('aria-disabled');
    click('Try it');
    expect(whatHappened()).toBeInTheDocument();
    expect(screen.getByText(/Just as you said/)).toBeInTheDocument();
  });

  it('mutes Try it again on the next round', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    click('It rolls');
    click('Try it');
    click('Next');
    expect(button('Try it')).toHaveAttribute('aria-disabled', 'true');
  });

  it('ends Help on the evidence and the why, with no comparison', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    click('Help');
    expect(whatHappened()).toBeNull();
    click('Help');
    expect(whatHappened()).toBeInTheDocument();
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('The car rolled to 9.')).toBeInTheDocument();
    expect(screen.getByText(/Here is what happens\./)).toBeInTheDocument();
    expect(screen.getByText(/keeps rolling until the floor stops it/)).toBeInTheDocument();
    expect(screen.queryByText(/Just as you said/)).toBeNull();
    expect(screen.queryByText(/Not what you said/)).toBeNull();
    expect(button('Next')).toBeInTheDocument();
  });

  it('makes no comparison after Help even when he had predicted', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    click('It rolls');
    click('Help');
    click('Help');
    expect(whatHappened()).toBeInTheDocument();
    expect(screen.getByText(/Here is what happens\./)).toBeInTheDocument();
    expect(screen.queryByText(/Just as you said/)).toBeNull();
  });

  it('never moves the level, however many investigations he finishes', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    for (let set = 0; set < 3; set += 1) {
      for (let i = 0; i < 3; i += 1) {
        click('It rolls');
        click('Try it');
        click('Next');
      }
      expect(screen.getByText('Done for now.')).toBeInTheDocument();
      expect(screen.queryByText(/level higher/)).toBeNull();
      click('Another set');
    }
    expect(loadRecord(agreeable.id).level).toBe(1);
  });
});

describe('a level rises on his own first tries only', () => {
  const play = (helpFirst: boolean) => {
    render(<GameShell game={sums} backHref="#/maths" backLabel="Maths" />);
    for (let i = 0; i < 5; i += 1) {
      if (helpFirst) click('Help');
      click('Choose right');
      click('Check');
      click('Next');
    }
  };

  it('steps up after five right first Checks with no Help', () => {
    play(false);
    expect(screen.getByText(/the next set starts a level higher/)).toBeInTheDocument();
    expect(loadRecord(sums.id).level).toBe(2);
  });

  it('does not step up when every right answer came after Help', () => {
    play(true);
    expect(screen.getByText('Done for now.')).toBeInTheDocument();
    expect(screen.queryByText(/level higher/)).toBeNull();
    expect(loadRecord(sums.id).level).toBe(1);
  });
});

describe('recordProblem', () => {
  const at = (level: Level, over: Partial<PlayRecord> = {}): PlayRecord => ({ level, recent: [], missStreak: 0, finishedSets: 0, ...over });
  const solve = (rightFirst: boolean, helped = false, missedTwice = false): ProblemResult => ({ kind: 'solve', rightFirst, helped, missedTwice });
  const run = (start: PlayRecord, results: readonly ProblemResult[]) =>
    results.reduce<{ record: PlayRecord; moves: ('up' | 'down' | null)[] }>(
      (acc, r) => {
        const { record, moved } = recordProblem(acc.record, r);
        return { record, moves: [...acc.moves, moved] };
      },
      { record: start, moves: [] },
    );

  it('steps up after four of the last five unhelped first tries', () => {
    const { record, moves } = run(at(1), [solve(true), solve(false), solve(true), solve(true), solve(true)]);
    expect(moves).toEqual([null, null, null, null, 'up']);
    expect(record.level).toBe(2);
  });

  it('does not count a right answer after Help toward a step up', () => {
    const { record, moves } = run(at(1), Array.from({ length: 5 }, () => solve(true, true)));
    expect(moves).toEqual([null, null, null, null, null]);
    expect(record.level).toBe(1);
    expect(record.recent).toEqual([false, false, false, false, false]);
  });

  it('holds the level when two of five were helped', () => {
    const { record } = run(at(1), [solve(true), solve(true, true), solve(true), solve(true, true), solve(true)]);
    expect(record.level).toBe(1);
  });

  it('treats a helped right answer as no miss', () => {
    const { record, moved } = recordProblem(at(2, { missStreak: 1 }), solve(true, true));
    expect(moved).toBeNull();
    expect(record.level).toBe(2);
    expect(record.missStreak).toBe(0);
  });

  it('still steps down after two misses in a row', () => {
    expect(recordProblem(at(2), solve(false, false, true)).moved).toBe('down');
    const { record, moves } = run(at(3), [solve(false), solve(false)]);
    expect(moves).toEqual([null, 'down']);
    expect(record.level).toBe(2);
  });

  it('never moves the level for an investigation', () => {
    for (const level of [1, 2, 3] as const) {
      const start = at(level, { recent: [true, true, true, true], missStreak: 1 });
      const { record, moves } = run(start, Array.from({ length: 6 }, (): ProblemResult => ({ kind: 'investigate' })));
      expect(moves.every((m) => m === null)).toBe(true);
      expect(record).toEqual(start);
    }
  });
});

describe('every control carries a symbol as well as its word', () => {
  const icon = (b: HTMLElement) => b.querySelector('svg[aria-hidden="true"]');

  it('draws one before Help, Skip and Check, and with Next', () => {
    render(<GameShell game={sums} backHref="#/maths" backLabel="Maths" />);
    for (const name of ['Help', 'Skip', 'Check']) {
      const b = button(name);
      const svg = icon(b);
      expect(svg, name).not.toBeNull();
      expect(svg?.getAttribute('width')).toBe('20');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      expect(b.firstElementChild, name).toBe(svg);
    }
    click('Choose right');
    click('Check');
    expect(icon(button('Next'))).not.toBeNull();
  });

  it('draws one before Try it', () => {
    render(<GameShell game={agreeable} backHref="#/science" backLabel="Science" />);
    const b = button('Try it');
    expect(b.firstElementChild).toBe(icon(b));
  });
});
