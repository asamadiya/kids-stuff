import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Known, Route } from './routes';
import { DEPTH, isDescent, parentOf, parseHash, toHash } from './routes';
import { BOOKS, getBook, getShelf } from '../books/registry';
import { BookReader } from '../books/BookReader';
import { SHELVES } from '../books/registry';
import { ARCHIVE, SUBJECTS, archiveStory, subjectOfStory } from './library';
import { SITUATIONS, getSituation } from './situations';
import { MATHS_GAMES, mathsGame } from '../maths/registry';
import { SCIENCE_GAMES, scienceGame } from '../science/registry';
import { ACTIVITIES } from '../make/activities';
import { IDEAS } from '../together';
import { GameShell } from '../play/GameShell';
import { Home, LibraryPage, MakeHub, MathsHub, ScienceHub, ShelfPage, Stories, SubjectPage, markRead } from './screens';
import { ActivityPage } from './ActivityPage';
import { Everything } from './Everything';
import { IdeaPage, TogetherHub } from '../together/screens';
import { Page } from './Page';
import { savedScroll, saveScroll } from './scroll';
import { itemKey, originOf, recordOrigin } from './origin';
import { Reader } from '../components/Reader';
import { LIBRARY_NOTE, archiveEntry, archiveLabel } from './library';

/**
 * Rikki's Learning Center: the whole app is a function of the hash.
 *
 * Kept from the old App: every destination is a route, links are real
 * anchors, and one delegated click handler decides push versus replace, so
 * Back always leaves the way you came in and a page turn never adds a history
 * entry. Unknown or stale hashes canonicalise to the nearest real ancestor
 * and the address bar is rewritten to match what is on screen.
 */

export function knownRoutes(): Known {
  return {
    shelves: new Set(SHELVES.map((s) => s.id)),
    books: new Map(BOOKS.map((b) => [b.slug, b.pages.length])),
    subjects: new Set(SUBJECTS.map((s) => s.id)),
    archive: new Map(ARCHIVE.map((s) => [s.slug, s.pages.length])),
    situations: new Set(SITUATIONS.map((s) => s.id)),
    maths: new Set(MATHS_GAMES.map((g) => g.id)),
    science: new Set(SCIENCE_GAMES.map((g) => g.id)),
    activities: new Set(ACTIVITIES.map((a) => a.id)),
    ideas: new Set(IDEAS.map((x) => x.id)),
  };
}

const shelfOf = (slug: string) => getBook(slug)?.shelf;

/** Screens that are lists of things to open: these remember their scroll position. */
const LISTINGS: ReadonlySet<Route['kind']> = new Set(['home', 'stories', 'shelf', 'library', 'subject', 'maths', 'science', 'make', 'together', 'all']);

export function LearningCenter() {
  const known = useMemo(knownRoutes, []);
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash, known));
  const routeRef = useRef(route);
  routeRef.current = route;

  useEffect(() => {
    // The app restores listing positions itself; the browser's own attempt fights it.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  const go = useCallback((next: Route) => {
    const from = routeRef.current;
    const hash = toHash(next);
    if (toHash(from) === hash) return;
    if (LISTINGS.has(from.kind)) recordOrigin(from, next);
    if (isDescent(from, next)) window.history.pushState(null, '', hash);
    else window.history.replaceState(null, '', hash);
    routeRef.current = next;
    setRoute(next);
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = parseHash(window.location.hash, known);
      routeRef.current = next;
      setRoute(next);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [known]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      const href = a?.getAttribute('href');
      if (!a || !href || !href.startsWith('#/')) return;
      if (a.getAttribute('target') && a.getAttribute('target') !== '_self') return;
      e.preventDefault();
      go(parseHash(href, known));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [go, known]);

  // The address bar always names what is on screen.
  useEffect(() => {
    const canonical = toHash(route);
    if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical);
  }, [route]);

  // A new screen starts at the top with focus on its heading — except a
  // listing you are coming back to, which returns to where you left it, with
  // focus on the card you opened (advisor q7 ruling 5).
  const screen = route.kind === 'book' || route.kind === 'read' ? `${route.kind}:${route.slug}` : toHash(route);
  const listing = LISTINGS.has(route.kind);
  const first = useRef(true);
  const cameFrom = useRef<Route | null>(null);
  useLayoutEffect(() => {
    const from = cameFrom.current;
    cameFrom.current = route;
    // Only coming back UP to a listing returns focus to the card you opened;
    // moving sideways between parts starts at the heading.
    const returning = listing && from !== null && DEPTH[from.kind] > DEPTH[route.kind];
    if (first.current) {
      first.current = false;
      if (listing) window.scrollTo(0, savedScroll(screen));
      return;
    }
    window.scrollTo(0, listing ? savedScroll(screen) : 0);
    // Match the card by the item it opens, not its address: a book left on
    // page 3 must find the card that links to page 1.
    const key = returning ? itemKey(from!) : null;
    const back = key ? document.querySelector<HTMLElement>(`#main-content a[data-key="${CSS.escape(key)}"]`) : null;
    const target = back ?? document.querySelector<HTMLElement>('#main-content h1');
    if (target) {
      if (!back) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    // `route` changes with every page turn inside a book; only a new screen matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // Kept on every scroll, not on leaving: by the time a leaving screen's
  // cleanup runs, the next screen has already set the window's scroll.
  useEffect(() => {
    if (!listing) return;
    const keep = () => saveScroll(screen, window.scrollY);
    window.addEventListener('scroll', keep, { passive: true });
    return () => window.removeEventListener('scroll', keep);
  }, [screen, listing]);

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>
        Skip to main content
      </a>
      {render(route, go)}
    </>
  );
}

/** Back for an item: the listing it was opened from, else its parent in the route table. */
function backFor(route: Route): { href: string; label: string } {
  return originOf(route) ?? parentOf(route, shelfOf, subjectOfStory)!;
}

function render(route: Route, go: (r: Route) => void) {
  switch (route.kind) {
    case 'home':
      return <Home />;
    case 'stories':
      return <Stories />;
    case 'shelf':
      return getShelf(route.shelf) ? <ShelfPage shelf={route.shelf} /> : <Stories />;
    case 'book': {
      const book = getBook(route.slug)!;
      const back = backFor(route);
      return (
        <BookReader
          key={book.slug}
          book={book}
          page={route.page}
          onPage={(p) => go({ kind: 'book', slug: book.slug, page: Math.max(0, Math.min(p, book.pages.length)) })}
          backHref={back.href}
          backLabel={back.label}
          onFinished={(slug) => markRead(`book/${slug}`)}
        />
      );
    }
    case 'library':
      return <LibraryPage />;
    case 'subject':
      return <SubjectPage subject={route.subject} />;
    case 'read': {
      const story = archiveStory(route.slug)!;
      const back = backFor(route);
      return (
        <div className="archive-reader">
          <Reader
            story={story}
            page={route.page}
            onNavigate={(p) => go({ kind: 'read', slug: story.slug, page: Math.max(0, Math.min(p, story.pages.length)) })}
            onExit={() => {
              window.location.hash = back.href;
            }}
            exitLabel={back.label.startsWith('Back') ? back.label : `Back to ${back.label}`}
            onComplete={(slug) => markRead(`read/${slug}`)}
            note={archiveEntry(story.slug)?.note ?? LIBRARY_NOTE}
            kindLabel={archiveLabel(story.slug)}
          />
        </div>
      );
    }
    case 'situation': {
      const s = getSituation(route.id)!;
      markRead(`sel/${s.id}`);
      return (
        <Page title={s.title} back={backFor(route)} note={s.note} expect={s.note.expect}>
          <div className="situation">
            <s.Component />
          </div>
        </Page>
      );
    }
    case 'maths':
      return <MathsHub />;
    case 'mathsGame':
      return <GameShell key={route.id} game={mathsGame(route.id)!} backHref={backFor(route).href} backLabel={backFor(route).label} />;
    case 'science':
      return <ScienceHub />;
    case 'scienceGame':
      return <GameShell key={route.id} game={scienceGame(route.id)!} backHref={backFor(route).href} backLabel={backFor(route).label} />;
    case 'make':
      return <MakeHub />;
    case 'activity':
      return <ActivityPage id={route.id} back={backFor(route)} />;
    case 'together':
      return <TogetherHub />;
    case 'idea':
      return <IdeaPage id={route.id} back={backFor(route)} />;
    case 'all':
      return <Everything />;
  }
}

export default LearningCenter;
