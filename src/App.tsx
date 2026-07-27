import { useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Library } from './components/Library';
import { PlayHub } from './components/PlayHub';
import { Reader } from './components/Reader';
import { WorkshopHub } from './components/WorkshopHub';
import { useBookProgress } from './hooks/useBookProgress';
import { STORIES, getStory } from './stories';
import './styles/tokens.css';
import './styles/app.css';
import './styles/workshop.css';
import './styles/sel.css';
import './styles/print.css';

/**
 * The whole app is either browsing the library or reading one story at a page.
 * `page` is a 0-based index; `page === story.pages.length` is the completion
 * view. State lives in the URL hash so browser back/forward and deep links all
 * work without a router dependency.
 */
type Route =
  | { kind: 'library' }
  | { kind: 'make' }
  | { kind: 'play' }
  | { kind: 'reader'; slug: string; page: number };

const READ_SEGMENT = 'read';

function toHash(route: Route): string {
  if (route.kind === 'library') return '#/';
  if (route.kind === 'make') return '#/make';
  if (route.kind === 'play') return '#/play';
  // 1-based page number reads naturally in a shared/deep link.
  return `#/${READ_SEGMENT}/${encodeURIComponent(route.slug)}/${route.page + 1}`;
}

function parseHash(rawHash: string): Route {
  const clean = rawHash
    .replace(/^#/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  if (clean === '') return { kind: 'library' };
  if (clean === 'make') return { kind: 'make' };
  if (clean === 'play') return { kind: 'play' };

  const parts = clean.split('/');
  if (parts[0] === READ_SEGMENT && parts[1]) {
    let slug: string;
    try {
      slug = decodeURIComponent(parts[1]);
    } catch {
      // A malformed percent-encoded slug (e.g. "%E0%A4%A") must never throw;
      // canonicalize to the library instead of crashing the app.
      return { kind: 'library' };
    }
    const parsed = Number.parseInt(parts[2] ?? '1', 10);
    const page = Number.isFinite(parsed) && parsed > 0 ? parsed - 1 : 0;
    return { kind: 'reader', slug, page };
  }
  return { kind: 'library' };
}

function App() {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  );

  // Bookmarks + completed slugs live in guarded, versioned localStorage.
  const { completedSlugs, getBookmark, saveBookmark, clearBookmark, markComplete } =
    useBookProgress();

  // A single polite live region; the reader writes page/completion changes here.
  const [liveMessage, setLiveMessage] = useState('');
  const announce = useCallback((message: string) => setLiveMessage(message), []);

  // The skip link stays a real anchor, but activating it must not mutate the
  // hash to "#main-content" — that would drop the active #/read/... route and
  // bounce a reader back to the library. Prevent the default hash navigation and
  // move focus into the current `<main id="main-content">` ourselves so the
  // route is preserved and keyboard focus lands on the content.
  const focusMainContent = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }, []);

  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const openStory = useCallback(
    (slug: string) => {
      // Resume only at a real, in-range story page. A bookmark of 0, the
      // completion index, an out-of-range/huge value, a negative, or a
      // non-integer is ignored — and any stored value we refuse to honour is
      // cleared so it can never (for example) open straight into completion and
      // trigger completion persistence on a story the reader has not finished.
      const story = getStory(slug);
      const pageCount = story ? story.pages.length : 0;
      const bookmark = getBookmark(slug);
      const resumable =
        typeof bookmark === 'number' &&
        Number.isInteger(bookmark) &&
        bookmark > 0 &&
        bookmark < pageCount;
      if (bookmark !== undefined && !resumable) clearBookmark(slug);
      const resumePage = resumable ? bookmark : 0;
      const next: Route = { kind: 'reader', slug, page: resumePage };
      window.history.pushState(null, '', toHash(next));
      setRoute(next);
    },
    [getBookmark, clearBookmark],
  );

  const exitToLibrary = useCallback(() => {
    const next: Route = { kind: 'library' };
    window.history.pushState(null, '', toHash(next));
    setRoute(next);
  }, []);

  const openMake = useCallback(() => {
    const next: Route = { kind: 'make' };
    window.history.pushState(null, '', toHash(next));
    setRoute(next);
  }, []);

  const openPlay = useCallback(() => {
    const next: Route = { kind: 'play' };
    window.history.pushState(null, '', toHash(next));
    setRoute(next);
  }, []);

  // Page turns replace history so Back always returns to the library, not a
  // page-by-page rewind.
  const setPage = useCallback(
    (slug: string, page: number) => {
      const next: Route = { kind: 'reader', slug, page };
      window.history.replaceState(null, '', toHash(next));
      setRoute(next);
      // Bookmark genuine story pages; drop the bookmark at the very start or
      // once the completion view is reached.
      const story = getStory(slug);
      const pageCount = story ? story.pages.length : 0;
      if (page > 0 && page < pageCount) saveBookmark(slug, page);
      else clearBookmark(slug);
    },
    [saveBookmark, clearBookmark],
  );

  const handleComplete = useCallback(
    (slug: string) => {
      markComplete(slug);
      // A finished story reopens fresh, so its resume bookmark is cleared.
      clearBookmark(slug);
    },
    [markComplete, clearBookmark],
  );

  // Unknown slugs fall through to the library rather than showing an error.
  const readerStory = route.kind === 'reader' ? getStory(route.slug) : undefined;

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={focusMainContent}>
        Skip to main content
      </a>

      {route.kind === 'reader' && readerStory ? (
        <Reader
          story={readerStory}
          page={Math.min(
            Math.max(0, Math.trunc(route.page)),
            readerStory.pages.length,
          )}
          onNavigate={(nextPage) => setPage(readerStory.slug, nextPage)}
          onExit={exitToLibrary}
          onComplete={handleComplete}
          announce={announce}
        />
      ) : route.kind === 'make' ? (
        <WorkshopHub onExit={exitToLibrary} />
      ) : route.kind === 'play' ? (
        <PlayHub onExit={exitToLibrary} />
      ) : (
        <Library
          stories={STORIES}
          onOpenStory={openStory}
          onMakeStory={openMake}
          onPlay={openPlay}
          completedSlugs={completedSlugs}
        />
      )}

      <div
        className="visually-hidden"
        aria-live="polite"
        aria-atomic="true"
      >
        {liveMessage}
      </div>
    </>
  );
}

export default App;
