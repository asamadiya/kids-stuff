import { useEffect, useId, useRef, useState } from 'react';
import type { GrownUpNote } from '../notes/types';
import { NOTE_FIELDS } from '../notes/types';

/**
 * "For grown-ups": the same button, top-right, on every screen.
 *
 * Advisor ruling: open freely — no arithmetic gate — specific to the current
 * item, with an obvious close that returns to the unchanged activity. A
 * native <dialog> does the focus trap and Escape for us, and closing it
 * cannot disturb whatever the child was in the middle of.
 */
export interface GrownUpsProps {
  readonly note: GrownUpNote;
  /** The item's name, shown at the top of the panel. */
  readonly title: string;
}

export function GrownUps({ note, title }: GrownUpsProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const headingId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      // jsdom has no showModal; fall back to the attribute so tests can read it.
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', '');
    }
    if (!open && d.open) {
      if (typeof d.close === 'function') d.close();
      else d.removeAttribute('open');
    }
  }, [open]);

  return (
    <>
      <button type="button" className="grownups-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="For grown-ups">
        <span className="grownups-btn__icon" aria-hidden="true">i</span>
        <span className="grownups-btn__label">For grown-ups</span>
      </button>
      <dialog
        ref={ref}
        className="grownups"
        aria-labelledby={headingId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // A tap on the dimmed backdrop (the dialog element itself) closes it.
          if (e.target === ref.current) setOpen(false);
        }}
      >
        <div className="grownups__panel">
          <header className="grownups__head">
            <p className="grownups__eyebrow">For grown-ups</p>
            <h2 id={headingId} className="grownups__title">{title}</h2>
            <button type="button" className="grownups__close" onClick={() => setOpen(false)}>
              Close <span aria-hidden="true">×</span>
            </button>
          </header>
          <dl className="grownups__fields">
            {NOTE_FIELDS.filter(([k]) => note[k]).map(([k, label]) => (
              <div key={k} className={`grownups__field grownups__field--${k}`}>
                <dt>{label}</dt>
                <dd>{note[k]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </dialog>
    </>
  );
}

export default GrownUps;
