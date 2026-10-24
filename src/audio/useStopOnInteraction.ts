import { useEffect } from 'react';
import type { RefObject } from 'react';
import { stop } from './readAloud';

/**
 * Inside an exercise, any press that is not on a read-aloud button stops the
 * reading: the screen is about to change under it, and a clip must never
 * describe a state that is no longer shown (advisor a9: "stop stale clips
 * after state changes"). One rule covers every chip tap, drag, step and reset.
 */
export function useStopOnInteraction(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.('.readaloud')) return;
      stop();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Shift') return;
      onDown(e);
    };
    el.addEventListener('pointerdown', onDown, true);
    el.addEventListener('keydown', onKey, true);
    return () => {
      el.removeEventListener('pointerdown', onDown, true);
      el.removeEventListener('keydown', onKey, true);
    };
  }, [ref]);
}
