import { useState } from 'react';

/**
 * Coming Back to a long listing lands where you left it (advisor q7 ruling 5).
 *
 * The scroll offset of every listing screen is kept per address in
 * sessionStorage, written as you scroll and read when the screen is shown
 * again — by the browser's Back or by the in-page Back link, which are the same
 * address. Card pictures reserve their space (fixed aspect ratio), so
 * restoring before the images arrive does not drift. Books and games are not
 * listings and always open at the top.
 */
const KEY = (hash: string) => `rlc/scroll/${hash}`;

export function savedScroll(hash: string): number {
  try {
    const y = Number(window.sessionStorage.getItem(KEY(hash)) ?? 0);
    return Number.isFinite(y) ? y : 0;
  } catch {
    return 0;
  }
}

export function saveScroll(hash: string, y: number): void {
  try {
    window.sessionStorage.setItem(KEY(hash), String(Math.round(y)));
  } catch {
    /* private mode: nothing kept, Back starts at the top */
  }
}

/** Per-screen UI state (search text, filters) that Back should also bring back. */
export function useStored<T>(key: string, initial: T): [T, (v: T) => void] {
  const read = (): T => {
    try {
      const raw = window.sessionStorage.getItem(`rlc/state/${key}`);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  };
  const [v, setV] = useState<T>(read);
  const set = (next: T) => {
    setV(next);
    try {
      window.sessionStorage.setItem(`rlc/state/${key}`, JSON.stringify(next));
    } catch {
      /* not kept */
    }
  };
  return [v, set];
}
