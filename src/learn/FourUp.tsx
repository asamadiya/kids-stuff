import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Four choices at a time, in a stable 2x2, with a plain "More" underneath.
 *
 * Advisor ruling (RULINGS-2 §6, confirmed on screenshots): a five-year-old
 * chooses well from four pictures and badly from a growing grid. The page a
 * child is on is kept in component state, not the URL — paging a shelf is not
 * a destination, and Back should leave the shelf, not page backwards.
 */
export interface FourUpProps {
  readonly items: readonly ReactNode[];
  readonly label: string;
}

export function FourUp({ items, label }: FourUpProps) {
  const pages = Math.max(1, Math.ceil(items.length / 4));
  const [page, setPage] = useState(0);
  const at = Math.min(page, pages - 1);
  const shown = items.slice(at * 4, at * 4 + 4);
  return (
    <section className="fourup" aria-label={label}>
      <div className="cards cards--four">{shown}</div>
      {pages > 1 ? (
        <nav className="pager" aria-label={`More in ${label}`}>
          <button type="button" className="btn btn--big" disabled={at === 0} onClick={() => setPage(at - 1)} aria-label="Previous four">
            <span aria-hidden="true">←</span>
          </button>
          <span className="pager__dots" aria-hidden="true">
            {Array.from({ length: pages }, (_, i) => (
              <span key={i} className={`dot${i === at ? ' is-now' : i < at ? ' is-done' : ''}`} />
            ))}
          </span>
          <button type="button" className="btn btn--big btn--primary" disabled={at === pages - 1} onClick={() => setPage(at + 1)}>
            More <span aria-hidden="true">→</span>
          </button>
        </nav>
      ) : null}
    </section>
  );
}

export default FourUp;
