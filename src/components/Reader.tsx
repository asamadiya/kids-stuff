import { useEffect, useLayoutEffect, useRef } from 'react';
import { StoryImage } from './StoryImage';
import { ReaderControls } from './ReaderControls';
import { StoryComplete } from './StoryComplete';
import type { Story } from '../types';
import '../styles/reader.css';

export interface ReaderProps {
  readonly story: Story;
  /**
   * 0-based page index. `page === story.pages.length` renders the completion
   * view. The parent clamps out-of-range values before passing them in.
   */
  readonly page: number;
  /** Request a page change (parent owns the route/history). */
  readonly onNavigate: (page: number) => void;
  /** Leave the reader and return to the library. */
  readonly onExit: () => void;
  /**
   * Fired when the completion view is reached. Task 5 records completion;
   * defaults to a no-op so the reader works standalone.
   */
  readonly onComplete?: (slug: string) => void;
  /**
   * Optional live-region writer. The reader calls it on page/view changes so
   * Task 5 can add announcements without rewriting navigation. Defaults to a
   * no-op.
   */
  readonly announce?: (message: string) => void;
}

const noop = () => {};

/**
 * True when a keydown target is a text-entry surface, so Arrow keys belong to
 * the field (caret movement) rather than to page turning. Covers native form
 * controls, contenteditable regions (jsdom does not implement
 * `isContentEditable`, so the attribute/ancestor is checked too), and anything
 * exposing an ARIA `textbox` role.
 */
function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  if (target.closest('input, textarea, select, [role="textbox"]')) return true;
  const editable = target.closest('[contenteditable]');
  if (editable) {
    const value = editable.getAttribute('contenteditable');
    if (value === '' || value === 'true' || value === 'plaintext-only') return true;
  }
  return false;
}

/** True when the reader has an active, non-empty text selection (a drag/range). */
function hasActiveTextSelection(): boolean {
  const selection =
    typeof window.getSelection === 'function' ? window.getSelection() : null;
  return (
    !!selection &&
    selection.rangeCount > 0 &&
    !selection.isCollapsed &&
    selection.toString().trim() !== ''
  );
}

export function Reader({
  story,
  page,
  onNavigate,
  onExit,
  onComplete = noop,
  announce = noop,
}: ReaderProps) {
  const pageCount = story.pages.length;
  const current = Math.min(Math.max(0, Math.trunc(page)), pageCount);
  const atCompletion = current === pageCount;
  const isLastStoryPage = current === pageCount - 1;

  const canGoPrevious = current > 0;
  const canGoNext = current < pageCount;
  // Start over is meaningful only once past the first page (and on completion).
  const canRestart = current > 0;
  const nextLabel = isLastStoryPage ? 'Finish story' : 'Next page';

  // Focus plumbing so keyboard focus is never lost across a page change.
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const completionRef = useRef<HTMLDivElement>(null);
  const pendingFocusNext = useRef(false);
  const wasComplete = useRef(atCompletion);

  const goPrevious = () => {
    if (!canGoPrevious) return;
    const target = current - 1;
    onNavigate(target);
    // Previous disables at page 0; keep focus on the still-enabled Next control.
    if (target === 0) pendingFocusNext.current = true;
  };
  const goNext = () => {
    if (canGoNext) onNavigate(current + 1);
  };
  const restart = () => {
    if (!canRestart) return;
    onNavigate(0);
    // Start over disables at page 0; move focus to Next once the DOM commits.
    pendingFocusNext.current = true;
  };

  // Arrow keys turn pages from anywhere, so reading never depends on focus —
  // but they must never hijack text entry or an in-progress text selection.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }
      if (isTextEntryTarget(event.target)) return;
      if (hasActiveTextSelection()) return;

      if (event.key === 'ArrowRight' && current < pageCount) {
        event.preventDefault();
        onNavigate(current + 1);
      } else if (event.key === 'ArrowLeft' && current > 0) {
        event.preventDefault();
        onNavigate(current - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, pageCount, onNavigate]);

  // Completion seam (Task 5 persists it). Fire onComplete exactly once per
  // transition into the completion view: guard with the slug we last signalled
  // so re-renders, a changing `announce` identity, and StrictMode's double
  // effect invocation never double-count. Reset when leaving completion so a
  // later re-read signals again.
  const signalledSlug = useRef<string | null>(null);
  useEffect(() => {
    if (!atCompletion) {
      signalledSlug.current = null;
      return;
    }
    if (signalledSlug.current === story.slug) return;
    signalledSlug.current = story.slug;
    onComplete(story.slug);
  }, [atCompletion, story.slug, onComplete]);

  // Announcement seam (Task 5 live region). Independent of completion so its
  // callback identity can never affect the once-only completion signal.
  useEffect(() => {
    if (atCompletion) {
      announce(`You finished ${story.title}.`);
    } else {
      announce(`Page ${current + 1}. ${story.title}.`);
    }
  }, [atCompletion, current, story.title, announce]);

  // Keep keyboard focus with an available control when a just-used button
  // (Previous / Start over) disables itself at the page-0 boundary. Runs only
  // for explicit button navigation, never for silent Arrow-key reading.
  useLayoutEffect(() => {
    if (pendingFocusNext.current) {
      pendingFocusNext.current = false;
      nextButtonRef.current?.focus();
    }
  }, [current]);

  // Entering the completion view moves focus into it (before paint) so focus is
  // never stranded on the body when the Finish button becomes disabled. Only on
  // the transition in — not when the reader mounts directly at completion.
  useLayoutEffect(() => {
    if (atCompletion && !wasComplete.current) {
      completionRef.current?.focus();
    }
    wasComplete.current = atCompletion;
  }, [atCompletion]);

  return (
    <main
      id="main-content"
      className="reader"
      aria-label={`Reading: ${story.title}`}
      tabIndex={-1}
    >
      <div className="reader__stage">
        {atCompletion ? (
          <div
            key="complete"
            ref={completionRef}
            className="reader__spread reader__spread--complete"
            tabIndex={-1}
          >
            <StoryComplete story={story} />
          </div>
        ) : (
          <article
            key={current}
            className="reader__spread"
            aria-labelledby="reader-story-title"
          >
            <figure className="reader__figure">
              <StoryImage
                story={story}
                page={current}
                alt={story.pages[current].alt}
              />
            </figure>

            <div className="reader__panel">
              <h1 id="reader-story-title" className="reader__title">
                {story.title}
              </h1>
              <p className="reader__text">{story.pages[current].text}</p>
              {story.pages[current].cue ? (
                <p className="reader__cue">
                  <span className="reader__cue-label">Try together</span>
                  <span className="reader__cue-text">
                    {story.pages[current].cue}
                  </span>
                </p>
              ) : null}
            </div>
          </article>
        )}
      </div>

      <ReaderControls
        currentPage={current + 1}
        pageCount={pageCount}
        atCompletion={atCompletion}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        canRestart={canRestart}
        nextLabel={nextLabel}
        nextRef={nextButtonRef}
        onPrevious={goPrevious}
        onNext={goNext}
        onRestart={restart}
        onLibrary={onExit}
      />
    </main>
  );
}

export default Reader;
