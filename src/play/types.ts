import type { ComponentType } from 'react';
import type { GrownUpNote } from '../notes/types';

/**
 * One engine for every maths and science game.
 *
 * The advisor's rulings, which this type makes hard to break:
 *
 * - Three controls only: tap to choose, tap to add/remove, tap-to-build (tap a
 *   piece, then tap where it goes). No required drag, slider or dial. A board
 *   is a React component, so this cannot be enforced by type — it is enforced
 *   by review and by every board using the shared Piece/Slot/Choice parts.
 * - First wrong answer: a hint that changes what is visible. Second: the worked
 *   answer. Then a fresh, similar problem. Help and Skip are always there.
 * - No scores, stars, streaks or reward sounds. Round dots only, not coloured
 *   by right or wrong.
 * - Five problems (maths) or three investigations (science), then "Done for
 *   now". Never auto-start another round.
 * - Maths: harder after four of the last five problems are right at the FIRST
 *   Check with no Help before it; a step easier after two misses in a row.
 *   Science never changes level on its own. The child (or a parent) can always
 *   choose Easier or Harder.
 * - Science is predict → Try → before/after side by side → why. Try waits for a
 *   prediction. A prediction is compared with the evidence; it is never marked
 *   wrong, and no comparison is made for a prediction he did not make.
 */

export type Level = 1 | 2 | 3;

/** What a board reports when the child presses Check. */
export interface Verdict {
  readonly ok: boolean;
  /**
   * After a first miss: one short sentence that points at what the board now
   * shows ("Left pan 11, right pan 9."). A fact about the board, never a
   * verdict on the child.
   */
  readonly hint?: string;
}

/** Everything a board needs to draw and to answer. */
export interface BoardProps<R, A> {
  readonly round: R;
  readonly level: Level;
  /** The child's current answer, owned by the shell so Skip and Help can reset it. */
  readonly answer: A;
  readonly setAnswer: (next: A) => void;
  /**
   * Which stage the round is in. Boards draw extra evidence on 'hint' (the
   * thing the hint sentence points at) and the full solution on 'worked'.
   * An investigation's board is never drawn at 'worked': the shell shows the
   * before/after evidence there instead, with the board at 'solved'.
   */
  readonly stage: 'answering' | 'hint' | 'worked' | 'solved';
}

interface GameCommon<R, A> {
  readonly id: string;
  readonly title: string;
  /** Under the title on the card, six words at most. */
  readonly hook: string;
  /** Strand / topic id used to group cards on the hub. */
  readonly group: string;
  /** Child-facing names of the three levels, two or three words each. */
  readonly levels: readonly [string, string, string];
  /** A deterministic round for (level, index). Index makes a set of five varied. */
  readonly generate: (level: Level, index: number) => R;
  /** The prompt over the board, twelve words at most. May depend on the round. */
  readonly prompt: (round: R) => string;
  /**
   * The answer before he has done anything. Compared by JSON value: in an
   * investigation, Try waits until the answer differs from this.
   */
  readonly emptyAnswer: (round: R) => A;
  readonly Board: ComponentType<BoardProps<R, A>>;
  readonly note: GrownUpNote;
  /** Optional picture for the card, from public/. */
  readonly cover?: string;
}

export interface SolveGame<R, A> extends GameCommon<R, A> {
  readonly kind: 'solve';
  readonly check: (round: R, answer: A) => Verdict;
  /** One sentence restating the mathematics when the answer is right. */
  readonly explain: (round: R) => string;
}

/**
 * Predict, try, compare. The answer is the prediction; `Outcome` is what really
 * happens. Try is muted until there is a prediction. The shell shows the setup
 * and the outcome side by side after Try, with `why` underneath, whatever the
 * child predicted; Help ends on the same evidence, with no comparison.
 * Finishing an investigation never moves the level.
 */
export interface InvestigateGame<R, A> extends GameCommon<R, A> {
  readonly kind: 'investigate';
  /**
   * Was the prediction borne out? Only used to word the comparison line, and
   * only ever called with a prediction he actually made.
   */
  readonly matches: (round: R, prediction: A) => boolean;
  /** The evidence, one or two sentences: what changed, and why. */
  readonly why: (round: R) => string;
  /** Draws the result beside the unchanged setup. */
  readonly Outcome: ComponentType<{ readonly round: R; readonly level: Level }>;
}

export type Game<R = unknown, A = unknown> = SolveGame<R, A> | InvestigateGame<R, A>;

/** Erase the round/answer types so differently-typed games share one registry. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyGame = Game<any, any>;

export const ROUNDS: Record<Game['kind'], number> = { solve: 5, investigate: 3 };
