import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Explicit, non-persistent motion control that always honours the reader's
 * device preference.
 *
 * - `motionEnabled` is the single source of truth for whether anything animates.
 *   It starts **off on every fresh load** and is never persisted, so a calm,
 *   still page is what everyone sees first.
 * - `motionAllowed` is `false` whenever the OS/browser requests reduced motion.
 *   While disallowed, motion can never be switched on (not even programmatically)
 *   and any motion already running is forced off.
 * - `toggleMotion` flips motion on/off; it is a deliberate no-op while motion is
 *   not allowed.
 *
 * Runtime changes to the media query are handled: turning on "reduce motion" in
 * system settings mid-session immediately stops motion and locks the control.
 */
export interface MotionPreference {
  readonly motionEnabled: boolean;
  readonly motionAllowed: boolean;
  readonly toggleMotion: () => void;
}

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Read the current reduced-motion preference, tolerating environments (SSR,
 * older jsdom) that do not implement `matchMedia`.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(REDUCE_QUERY).matches;
}

export function useMotionPreference(): MotionPreference {
  const [reduced, setReduced] = useState<boolean>(prefersReducedMotion);
  // Motion is intentionally session-only and starts off; it is never persisted.
  const [switchedOn, setSwitchedOn] = useState<boolean>(false);

  // Mirror `reduced` so the toggle callback can stay referentially stable while
  // still reading the latest value.
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const query = window.matchMedia(REDUCE_QUERY);
    const sync = () => setReduced(query.matches);
    // Catch any change between first render and this effect subscribing.
    sync();
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', sync);
      return () => query.removeEventListener('change', sync);
    }
    // Safari < 14 and older engines only expose the deprecated listener API.
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  // A reduced-motion preference always wins: force the switch off and keep it
  // off for as long as the preference is active.
  useEffect(() => {
    if (reduced) setSwitchedOn(false);
  }, [reduced]);

  const toggleMotion = useCallback(() => {
    if (reducedRef.current) return;
    setSwitchedOn((previous) => !previous);
  }, []);

  const motionAllowed = !reduced;
  const motionEnabled = motionAllowed && switchedOn;

  return { motionEnabled, motionAllowed, toggleMotion };
}

export default useMotionPreference;
