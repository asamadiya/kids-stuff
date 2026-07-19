import type { Ref } from 'react';

export interface ReaderControlsProps {
  /** 1-based page currently shown (ignored when `atCompletion`). */
  readonly currentPage: number;
  /** Total number of story pages (excludes the completion view). */
  readonly pageCount: number;
  /** True when the completion view is showing rather than a story page. */
  readonly atCompletion: boolean;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  /** Whether "Start over" is available (false on the first page). */
  readonly canRestart: boolean;
  /** Accessible name for the next control; defaults to "Next page". */
  readonly nextLabel?: string;
  /** Motion hook, mirrored to `data-motion` so hover transitions can be gated. */
  readonly motionEnabled?: boolean;
  /**
   * Ref to the primary "Next"/"Finish" button so the reader can move focus there
   * when a just-used control (Previous/Start over) disables at a boundary,
   * keeping keyboard focus from ever falling back to the document body.
   */
  readonly nextRef?: Ref<HTMLButtonElement>;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onRestart: () => void;
  /** Leave the reader and return to the library. */
  readonly onLibrary: () => void;
}

export function ReaderControls({
  currentPage,
  pageCount,
  atCompletion,
  canGoPrevious,
  canGoNext,
  canRestart,
  nextLabel = 'Next page',
  motionEnabled = false,
  nextRef,
  onPrevious,
  onNext,
  onRestart,
  onLibrary,
}: ReaderControlsProps) {
  return (
    <nav
      className="reader-controls"
      aria-label="Reading controls"
      data-motion={motionEnabled ? 'on' : 'off'}
    >
      <p
        className="reader-controls__progress"
        data-completion={atCompletion ? 'true' : 'false'}
      >
        {atCompletion
          ? 'The story is finished'
          : `Page ${currentPage} of ${pageCount}`}
      </p>

      <div className="reader-controls__turn">
        <button
          type="button"
          className="reader-controls__btn reader-controls__btn--turn"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="Previous page"
        >
          <span aria-hidden="true" className="reader-controls__glyph">
            &#8592;
          </span>
          <span className="reader-controls__btn-text">Previous</span>
        </button>

        <button
          type="button"
          className="reader-controls__btn reader-controls__btn--turn reader-controls__btn--next"
          ref={nextRef}
          onClick={onNext}
          disabled={!canGoNext}
          aria-label={nextLabel}
        >
          <span className="reader-controls__btn-text">{nextLabel}</span>
          <span aria-hidden="true" className="reader-controls__glyph">
            &#8594;
          </span>
        </button>
      </div>

      <div className="reader-controls__meta">
        <button
          type="button"
          className="reader-controls__btn reader-controls__btn--ghost"
          onClick={onLibrary}
        >
          <span aria-hidden="true" className="reader-controls__glyph">
            &#8249;
          </span>
          Back to library
        </button>

        <button
          type="button"
          className="reader-controls__btn reader-controls__btn--ghost"
          onClick={onRestart}
          disabled={!canRestart}
        >
          <span aria-hidden="true" className="reader-controls__glyph">
            &#8635;
          </span>
          Start over
        </button>
      </div>
    </nav>
  );
}

export default ReaderControls;
