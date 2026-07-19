import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Reading progress — bookmarks and completed stories — persisted to
 * `localStorage` under a single versioned key.
 *
 * Storage is treated as best-effort: every read and write is guarded, and any
 * failure (private mode, disabled storage, quota, a corrupt payload) falls back
 * to in-memory state with a single concise `console.warn`. Reading a story must
 * never break just because storage is unavailable.
 *
 * - `getBookmark(slug)` / `saveBookmark` / `clearBookmark` — the 0-based page a
 *   reader left off on, so the library can resume where it is intuitive.
 * - `markComplete(slug)` — deterministic and idempotent; a slug is recorded at
 *   most once.
 */
export const PROGRESS_STORAGE_KEY = 'moonlit-storybook/progress/v1';

export interface BookProgress {
  readonly bookmarks: ReadonlyMap<string, number>;
  readonly completedSlugs: ReadonlySet<string>;
  readonly getBookmark: (slug: string) => number | undefined;
  readonly saveBookmark: (slug: string, page: number) => void;
  readonly clearBookmark: (slug: string) => void;
  readonly markComplete: (slug: string) => void;
}

interface ProgressState {
  readonly bookmarks: Readonly<Record<string, number>>;
  readonly completed: readonly string[];
}

const EMPTY: ProgressState = { bookmarks: {}, completed: [] };

/** Access `window.localStorage` without letting an opaque-origin/security */
/* getter throw. Returns `null` when storage is unavailable. */
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

interface InitResult {
  readonly state: ProgressState;
  readonly warnings: readonly string[];
}

/**
 * Validate an unknown parsed payload into a clean {@link ProgressState} and
 * report concise diagnostics for anything ignored, so a corrupt or stale store
 * surfaces a warning instead of failing silently. Structurally-broken payloads
 * and individual invalid entries (non-integer, negative, wrong-typed) are
 * dropped rather than coerced; the in-range check against a specific story is
 * the caller's responsibility.
 */
function normalize(data: unknown): InitResult {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      state: EMPTY,
      warnings: [
        '[useBookProgress] Saved progress had an unexpected shape; starting fresh.',
      ],
    };
  }

  const record = data as Record<string, unknown>;
  let dropped = 0;

  const bookmarks: Record<string, number> = {};
  const rawBookmarks = record.bookmarks;
  if (rawBookmarks !== undefined) {
    if (
      typeof rawBookmarks === 'object' &&
      rawBookmarks !== null &&
      !Array.isArray(rawBookmarks)
    ) {
      for (const [slug, page] of Object.entries(
        rawBookmarks as Record<string, unknown>,
      )) {
        // A bookmark is a 0-based page index: a non-negative integer only.
        if (typeof page === 'number' && Number.isInteger(page) && page >= 0) {
          bookmarks[slug] = page;
        } else {
          dropped += 1;
        }
      }
    } else {
      dropped += 1;
    }
  }

  const completed: string[] = [];
  const rawCompleted = record.completed;
  if (rawCompleted !== undefined) {
    if (Array.isArray(rawCompleted)) {
      for (const slug of rawCompleted) {
        if (typeof slug === 'string') {
          if (!completed.includes(slug)) completed.push(slug);
        } else {
          dropped += 1;
        }
      }
    } else {
      dropped += 1;
    }
  }

  const warnings =
    dropped > 0
      ? [
          `[useBookProgress] Ignored ${dropped} invalid saved ${
            dropped === 1 ? 'entry' : 'entries'
          }; kept the rest.`,
        ]
      : [];
  return { state: { bookmarks, completed }, warnings };
}

/**
 * Read and validate the persisted payload. Each fallible step is wrapped in its
 * own narrow try/catch so unrelated errors are never swallowed, and every
 * failure becomes a diagnostic (emitted once from the hook) rather than a
 * silent fallback.
 */
function readInitialState(): InitResult {
  if (typeof window === 'undefined') return { state: EMPTY, warnings: [] };

  let storage: Storage | null;
  try {
    storage = window.localStorage;
  } catch {
    return {
      state: EMPTY,
      warnings: [
        '[useBookProgress] Could not access localStorage; reading in memory only.',
      ],
    };
  }
  if (!storage) return { state: EMPTY, warnings: [] };

  let raw: string | null;
  try {
    raw = storage.getItem(PROGRESS_STORAGE_KEY);
  } catch {
    return {
      state: EMPTY,
      warnings: [
        '[useBookProgress] Could not read saved progress; reading in memory only.',
      ],
    };
  }
  if (!raw) return { state: EMPTY, warnings: [] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      state: EMPTY,
      warnings: [
        '[useBookProgress] Ignoring unreadable saved progress (bad JSON); starting fresh.',
      ],
    };
  }

  return normalize(parsed);
}

const STORAGE_UNAVAILABLE_WARNING =
  '[useBookProgress] localStorage is unavailable; progress will not be saved this session.';
const WRITE_FAILED_WARNING =
  '[useBookProgress] Could not save progress; keeping it in memory only.';

export function useBookProgress(): BookProgress {
  // Read storage exactly once. Under StrictMode this ref survives the double
  // render, so storage is not re-read and diagnostics are computed a single time.
  const initialRef = useRef<InitResult | null>(null);
  if (initialRef.current === null) initialRef.current = readInitialState();

  const [state, setState] = useState<ProgressState>(initialRef.current.state);

  // Emit at most one console.warn per distinct message for the life of this
  // mount. A message-keyed Set means StrictMode's double effect invocation, a
  // remount, or a repeatedly-failing write never duplicates the same warning.
  const warnedRef = useRef<Set<string> | null>(null);
  if (warnedRef.current === null) warnedRef.current = new Set();
  const warn = useCallback((message: string, detail?: unknown) => {
    const warned = warnedRef.current!;
    if (warned.has(message)) return;
    warned.add(message);
    if (detail === undefined) console.warn(message);
    else console.warn(message, detail);
  }, []);

  // Surface any read-time diagnostics once the hook has mounted (deduped).
  useEffect(() => {
    for (const message of initialRef.current!.warnings) warn(message);
  }, [warn]);

  // Skip the initial run so a fresh mount never rewrites identical storage, and
  // report a single warning if the store is unavailable or the write is refused
  // (quota/private mode); reading always continues in memory either way.
  const isFirstPersist = useRef(true);
  useEffect(() => {
    if (isFirstPersist.current) {
      isFirstPersist.current = false;
      return;
    }
    const storage = getStorage();
    if (!storage) {
      warn(STORAGE_UNAVAILABLE_WARNING);
      return;
    }
    try {
      storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      warn(WRITE_FAILED_WARNING, error);
    }
  }, [state, warn]);

  const bookmarks = useMemo(
    () => new Map(Object.entries(state.bookmarks)),
    [state.bookmarks],
  );
  const completedSlugs = useMemo(() => new Set(state.completed), [state.completed]);

  // Read the latest state without adding it as a dependency of `getBookmark`.
  const stateRef = useRef(state);
  stateRef.current = state;

  const getBookmark = useCallback((slug: string): number | undefined => {
    const page = stateRef.current.bookmarks[slug];
    return typeof page === 'number' ? page : undefined;
  }, []);

  const saveBookmark = useCallback((slug: string, page: number) => {
    // Reject non-integers and negatives outright rather than coercing them.
    if (!Number.isInteger(page) || page < 0) return;
    setState((previous) => {
      if (previous.bookmarks[slug] === page) return previous;
      return { ...previous, bookmarks: { ...previous.bookmarks, [slug]: page } };
    });
  }, []);

  const clearBookmark = useCallback((slug: string) => {
    setState((previous) => {
      if (!(slug in previous.bookmarks)) return previous;
      const rest: Record<string, number> = {};
      for (const [key, value] of Object.entries(previous.bookmarks)) {
        if (key !== slug) rest[key] = value;
      }
      return { ...previous, bookmarks: rest };
    });
  }, []);

  const markComplete = useCallback((slug: string) => {
    setState((previous) => {
      if (previous.completed.includes(slug)) return previous;
      return { ...previous, completed: [...previous.completed, slug] };
    });
  }, []);

  return {
    bookmarks,
    completedSlugs,
    getBookmark,
    saveBookmark,
    clearBookmark,
    markComplete,
  };
}

export default useBookProgress;
