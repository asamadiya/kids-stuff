import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Known, Route } from './routes';
import { isDescent, parentOf, parseHash, toHash } from './routes';
import { BOOKS, getBook, getShelf } from '../books/registry';
import { BookReader } from '../books/BookReader';
import { SHELVES } from '../books/registry';
import { ARCHIVE, SUBJECTS, archiveStory, subjectOfStory } from './library';
import { SITUATIONS, getSituation } from './situations';
import { MATHS_GAMES, mathsGame } from '../maths/registry';
import { SCIENCE_GAMES, scienceGame } from '../science/registry';
import { ACTIVITIES } from '../make/activities';
import { GameShell } from '../play/GameShell';
import { Home, LibraryPage, MakeHub, MathsHub, ScienceHub, ShelfPage, Stories, SubjectPage, markRead } from './screens';
import { ActivityPage } from './ActivityPage';
import { Page } from './Page';
import { Reader } from '../components/Reader';
import { LIBRARY_NOTE } from './library';

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
  };
}

const shelfOf = (slug: string) => getBook(slug)?.shelf;

export function LearningCenter() {
  const known = useMemo(knownRoutes, []);
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash, known));
  const routeRef = useRef(route);
  routeRef.current = route;

  const go = useCallback((next: Route) => {
    const from = routeRef.current;
    const hash = toHash(next);
    if (toHash(from) === hash) return;
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

  // A new screen starts at the top, with focus on its heading.
  const screen = route.kind === 'book' || route.kind === 'read' ? `${route.kind}:${route.slug}` : toHash(route);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    const h = document.querySelector<HTMLElement>('#main-content h1');
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  }, [screen]);

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>
        Skip to main content
      </a>
      {render(route, go)}
    </>
  );
}

function render(route: Route, go: (r: Route) => void) {
  switch (route.kind) {
    case 'home':
      return <Home />;
    case 'stories':
      return <Stories page={route.page} />;
    case 'shelf':
      return getShelf(route.shelf) ? <ShelfPage shelf={route.shelf} /> : <Stories page={1} />;
    case 'book': {
      const book = getBook(route.slug)!;
      const back = parentOf(route, shelfOf, subjectOfStory)!;
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
      const back = parentOf(route, shelfOf, subjectOfStory)!;
      return (
        <div className="archive-reader">
          <Reader
            story={story}
            page={route.page}
            onNavigate={(p) => go({ kind: 'read', slug: story.slug, page: Math.max(0, Math.min(p, story.pages.length)) })}
            onExit={() => {
              window.location.hash = back.href;
            }}
            onComplete={(slug) => markRead(`read/${slug}`)}
            note={LIBRARY_NOTE}
          />
        </div>
      );
    }
    case 'situation': {
      const s = getSituation(route.id)!;
      markRead(`sel/${s.id}`);
      return (
        <Page title={s.title} back={{ href: '#/stories/family', label: 'Family & Friends' }} note={s.note} band="stories" expect={s.note.expect}>
          <div className="situation">
            <s.Component />
          </div>
        </Page>
      );
    }
    case 'maths':
      return <MathsHub />;
    case 'mathsGame':
      return <GameShell key={route.id} game={mathsGame(route.id)!} backHref="#/maths" backLabel="Maths" />;
    case 'science':
      return <ScienceHub />;
    case 'scienceGame':
      return <GameShell key={route.id} game={scienceGame(route.id)!} backHref="#/science" backLabel="Science" />;
    case 'make':
      return <MakeHub />;
    case 'activity':
      return <ActivityPage id={route.id} />;
  }
}

export default LearningCenter;
