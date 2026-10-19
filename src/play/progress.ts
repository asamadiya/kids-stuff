import type { Level } from './types';

/**
 * Where a child is in each game, kept per device.
 *
 * The advisor's adaptation rule, and nothing more: step up after four of the
 * last five FIRST attempts were right; step down after two misses in a row.
 * The child can always move a level by hand. Nothing here is shown to him as
 * a score — the record exists to choose the next problem, and to put a small
 * "Played before" tick on the card.
 */

const KEY = (id: string) => `rlc/play/${id}`;

export interface PlayRecord {
  readonly level: Level;
  /** First-attempt results, newest last, at most five. */
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
 * Record one problem. `firstTry` is whether the FIRST submission was right;
 * `missedTwice` is whether he missed two submissions in a row on it.
 * Returns the record and whether the level changed, so the shell can say so.
 */
export function recordProblem(
  record: PlayRecord,
  firstTry: boolean,
  missedTwice: boolean,
): { record: PlayRecord; moved: 'up' | 'down' | null } {
  const recent = [...record.recent, firstTry].slice(-5);
  const missStreak = missedTwice ? record.missStreak + 2 : firstTry ? 0 : record.missStreak + 1;

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
