import type { ReactNode } from 'react';
import { useStored } from './scroll';

/**
 * Secondary filters behind one labelled button (final review finding 5): on a
 * phone the full bank of chips pushed every picture below the first screen.
 * The button names how many filters are on, and the choice to show them is
 * kept with the screen, so Back returns to the same state.
 */
export function FilterPanel({ id, active, children }: { readonly id: string; readonly active: number; readonly children: ReactNode }) {
  const [open, setOpen] = useStored<boolean>(`${id}/filters-open`, false);
  return (
    <div className="filterpanel">
      <button type="button" className={`filterpanel__toggle${active ? ' is-on' : ''}`} aria-expanded={open} aria-controls={`${id}-filters`} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M3 5h18l-7 8v6l-4-2v-4z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        </svg>
        Filters{active ? ` · ${active} on` : ''}
      </button>
      <div id={`${id}-filters`} className="filterpanel__body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
