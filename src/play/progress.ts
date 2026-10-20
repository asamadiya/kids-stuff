import type { Level } from './types';

/**
 * Where a child is in each game, kept per device.
 *
 * The advisor's adaptation rule, and nothing more, for solve games only: step
 * up after four of the last five problems were right at the FIRST Check with
 * no Help pressed before it; step down after two misses in a row. A right
 * answer reached with Help is not his own first try, so it never counts toward
 * a step up — but it is not a miss either.
 *
 * Investigations never change the level on their own. A prediction is not a
 * test of what he knows: counting every finished investigation as a success
 * let five of them raise the level whatever he understood. There the level
 * moves only by his hand or a parent's.
 *
 * The child can always move a level by hand. Nothing here is shown to him as
 * a score — the record exists to choose the next problem, and to put a small
 * "Played before" tick on the card.
 */

const KEY = (id: string) => `rlc/play/${id}`;

export interface PlayRecord {
  readonly level: Level;
  /** Solve problems only: right at the first Check without Help, newest last, at most five. */
  readonly recent: readonly boolean[];
  /** Misses in a row, counting every submission. */
  readonly missStreak: number;
  readonly finishedSets: number;
}

const FRESH: PlayRecord = { level: 1, recent: [], missStreak: 0, finishedSets: 0 };

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadRecord(id: string): PlayRecord {
  const raw = storage()?.getItem(KEY(id));
  if (!raw) return FRESH;
  try {
    const r = JSON.parse(raw) as Partial<PlayRecord>;
    const level = r.level === 2 || r.level === 3 ? r.level : 1;
    return {
      level,
      recent: Array.isArray(r.recent) ? r.recent.filter((x) => typeof x === 'boolean').slice(-5) : [],
      missStreak: typeof r.missStreak === 'number' && r.missStreak >= 0 ? r.missStreak : 0,
      finishedSets: typeof r.finishedSets === 'number' && r.finishedSets >= 0 ? r.finishedSets : 0,
    };
  } catch {
    return FRESH;
  }
}

export function saveRecord(id: string, record: PlayRecord): void {
  try {
    storage()?.setItem(KEY(id), JSON.stringify(record));
  } catch {
    // A full or blocked store costs the memory of the level, nothing else.
  }
}

const up = (l: Level): Level => (l === 3 ? 3 : ((l + 1) as Level));
const down = (l: Level): Level => (l === 1 ? 1 : ((l - 1) as Level));

/**
 * How one problem went, as the shell saw it. An investigation carries nothing:
 * it is recorded as played and cannot move the level.
 */
export type ProblemResult =
  | { readonly kind: 'investigate' }
  | {
      readonly kind: 'solve';
      /** The FIRST Check on this problem was right. */
      readonly rightFirst: boolean;
      /** Help was pressed at any point on this problem. */
      readonly helped: boolean;
      /** He missed two Checks in a row on it. */
      readonly missedTwice: boolean;
    };

/**
 * Record one problem. Returns the record and whether the level changed, so the
 * shell can say so.
 */
export function recordProblem(
  record: PlayRecord,
  result: ProblemResult,
): { record: PlayRecord; moved: 'up' | 'down' | null } {
  if (result.kind === 'investigate') return { record, moved: null };

  // Only his own first try counts toward a step up: right at the first Check,
  // with no Help before it. Help can only come before a right first Check,
  // since a right Check ends the problem.
  const firstTry = result.rightFirst && !result.helped;
  const recent = [...record.recent, firstTry].slice(-5);
  // A right first Check is not a miss, helped or not, so it ends a run of misses.
  const missStreak = result.missedTwice ? record.missStreak + 2 : result.rightFirst ? 0 : record.missStreak + 1;

  if (missStreak >= 2 && record.level > 1) {
    return { record: { ...record, level: down(record.level), recent: [], missStreak: 0 }, moved: 'down' };
  }
  const rightOfFive = recent.filter(Boolean).length;
  if (recent.length === 5 && rightOfFive >= 4 && record.level < 3) {
    return { record: { ...record, level: up(record.level), recent: [], missStreak: 0 }, moved: 'up' };
  }
  return { record: { ...record, recent, missStreak: missStreak >= 2 ? 0 : missStreak }, moved: null };
}

export function setLevel(record: PlayRecord, level: Level): PlayRecord {
  return { ...record, level, recent: [], missStreak: 0 };
}

export function finishSet(record: PlayRecord): PlayRecord {
  return { ...record, finishedSets: record.finishedSets + 1 };
}

export function playedBefore(id: string): boolean {
  return loadRecord(id).finishedSets > 0;
}
