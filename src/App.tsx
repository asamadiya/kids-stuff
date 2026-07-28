import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { Library } from './components/Library';
import { LearningCenterWelcome } from './components/LearningCenterWelcome';
import { PlayHub, PLAY_EXERCISE_IDS } from './components/PlayHub';
import { Reader } from './components/Reader';
import { WorkshopHub, WORKSHOP_TOOL_IDS } from './components/WorkshopHub';
import { useBookProgress } from './hooks/useBookProgress';
import { REGIONS } from './data/meta';
import { STORY_DOMAINS } from './types';
import type { StoryDomain } from './types';
import { STORIES, getStory } from './stories';
import './styles/tokens.css';
import './styles/app.css';
import './styles/workshop.css';
import './styles/sel.css';
import './styles/print.css';

/* -------------------------------------------------------------------------- */
/* The route table                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Every destination in the guide is a route, and every route is a function of
 * the hash. No screen keeps a destination in component state: a hub that
 * remembered which exercise was open would be a second, invisible source of
 * truth, and the browser's Back button would not know about it.
 */
export type Route =
  | { readonly kind: 'index' }
  | { readonly kind: 'shelf' }
  | { readonly kind: 'timeline' }
  | { readonly kind: 'map' }
  | { readonly kind: 'topics' }
  | { readonly kind: 'places' }
  | { readonly kind: 'play' }
  | { readonly kind: 'make' }
  | { readonly kind: 'topic'; readonly domain: StoryDomain }
  | { readonly kind: 'place'; readonly region: string }
  | { readonly kind: 'exercise'; readonly id: string }
  | { readonly kind: 'tool'; readonly id: string }
  | { readonly kind: 'reader'; readonly slug: string; readonly page: number };

export type RouteKind = Route['kind'];

/** The routes that carry no parameters, and so can be named by kind alone. */
export const PLAIN_ROUTES = {
  index: { kind: 'index' },
  shelf: { kind: 'shelf' },
  timeline: { kind: 'timeline' },
  map: { kind: 'map' },
  topics: { kind: 'topics' },
  places: { kind: 'places' },
  play: { kind: 'play' },
  make: { kind: 'make' },
} as const satisfies Record<string, Route>;

export type PlainRouteKind = keyof typeof PLAIN_ROUTES;

/** Which arm of the guide a route belongs to: reading, practising or making. */
export type Branch = 'read' | 'play' | 'make';

interface RouteShape {
  /** Distance from the index. Descending increases it; siblings share it. */
  readonly depth: number;
  /** `null` only for the index, which is common ancestor to all three arms. */
  readonly branch: Branch | null;
  /**
   * The one ancestor an unknown segment canonicalises to, and the rung the
   * generated Back-walk expects. Every value here is parameterless by
   * construction — the type will not accept a route that needs arguments.
   */
  readonly parent: PlainRouteKind | null;
}

/**
 * One row per route shape. This `Record` is the single place a human judgement
 * about the hierarchy lives: adding a member to `Route` without a row here is a
 * compile error, so the table can never fall behind the union.
 */
export const ROUTE_SHAPES: Record<RouteKind, RouteShape> = {
  index: { depth: 0, branch: null, parent: null },
  shelf: { depth: 1, branch: 'read', parent: 'index' },
  timeline: { depth: 1, branch: 'read', parent: 'index' },
  map: { depth: 1, branch: 'read', parent: 'index' },
  topics: { depth: 1, branch: 'read', parent: 'index' },
  places: { depth: 1, branch: 'read', parent: 'index' },
  play: { depth: 1, branch: 'play', parent: 'index' },
  make: { depth: 1, branch: 'make', parent: 'index' },
  topic: { depth: 2, branch: 'read', parent: 'topics' },
  place: { depth: 2, branch: 'read', parent: 'places' },
  exercise: { depth: 2, branch: 'play', parent: 'play' },
  tool: { depth: 2, branch: 'make', parent: 'make' },
  // A story is reached from whichever arrangement was open, so it sits below
  // every one of them; `shelf` is only its canonical rung.
  reader: { depth: 3, branch: 'read', parent: 'shelf' },
};

function assertNever(value: never): never {
  throw new Error(`Unhandled route ${JSON.stringify(value)}`);
}

/** Region names carry spaces and ampersands; the URL carries a slug of them. */
export function regionSlug(region: string): string {
  return region
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const READ_SEGMENT = 'read';

export function toHash(route: Route): string {
  switch (route.kind) {
    case 'index':
      return '#/';
    case 'shelf':
      return '#/shelf';
    case 'timeline':
      return '#/timeline';
    case 'map':
      return '#/map';
    case 'topics':
      return '#/topic';
    case 'places':
      return '#/place';
    case 'play':
      return '#/play';
    case 'make':
      return '#/make';
    case 'topic':
      return `#/topic/${route.domain}`;
    case 'place':
      return `#/place/${regionSlug(route.region)}`;
    case 'exercise':
      return `#/play/${route.id}`;
    case 'tool':
      return `#/make/${route.id}`;
    // 1-based page numbers read naturally in a shared link.
    case 'reader':
      return `#/${READ_SEGMENT}/${route.slug}/${route.page + 1}`;
    default:
      return assertNever(route);
  }
}

/** The ancestors of a route, from the index down to (not including) itself. */
export function canonicalTrail(route: Route): Route[] {
  const trail: Route[] = [];
  let step = ROUTE_SHAPES[route.kind].parent;
  while (step) {
    trail.unshift(PLAIN_ROUTES[step]);
    step = ROUTE_SHAPES[step].parent;
  }
  return trail;
}

/**
 * Push on descent, replace on lateral — the whole rule, in one predicate.
 * Going deeper within the same arm of the guide (or out of the index, which
 * belongs to no arm) is a descent and earns a history entry. Everything else —
 * switching arrangement, changing a filter, turning a page, backing out —
 * replaces, so one Back always leaves by the way you came in.
 */
export function isDescent(from: Route, to: Route): boolean {
  const here = ROUTE_SHAPES[from.kind];
  const there = ROUTE_SHAPES[to.kind];
  if (there.depth <= here.depth) return false;
  return here.branch === null || here.branch === there.branch;
}

/** Screens, for focus purposes: turning a page does not change the screen. */
function screenKey(route: Route): string {
  return route.kind === 'reader' ? `reader:${route.slug}` : toHash(route);
}

function decodeSegment(raw: string): string | null {
  try {
    return decodeURIComponent(raw);
  } catch {
    // A malformed percent-encoding must canonicalise, never throw.
    return null;
  }
}

const DOMAINS: ReadonlySet<string> = new Set(STORY_DOMAINS);
const REGION_BY_SLUG: ReadonlyMap<string, string> = new Map(
  REGIONS.map((region) => [regionSlug(region), region]),
);

/**
 * Parse a hash into the deepest route it actually names. An unrecognised
 * segment does not reset the reader to the index: it canonicalises to the
 * nearest valid ancestor, so a stale link into a retired exercise lands on the
 * practice hub rather than the front door. Segments past a leaf are dropped —
 * and because `App` rewrites the address bar to `toHash(route)`, the URL can
 * never claim a destination the app is not showing.
 */
export function parseHash(rawHash: string): Route {
  const clean = rawHash.replace(/^#/, '').replace(/^\/+/, '').replace(/\/+$/, '');
  if (clean === '') return PLAIN_ROUTES.index;

  const parts = clean.split('/').map(decodeSegment);
  const [head, first, second] = parts;

  switch (head) {
    case 'shelf':
      return PLAIN_ROUTES.shelf;
    case 'timeline':
      return PLAIN_ROUTES.timeline;
    case 'map':
      return PLAIN_ROUTES.map;
    case 'topic':
      if (first && DOMAINS.has(first)) {
        return { kind: 'topic', domain: first as StoryDomain };
      }
      return PLAIN_ROUTES.topics;
    case 'place': {
      const region = first ? REGION_BY_SLUG.get(first) : undefined;
      return region ? { kind: 'place', region } : PLAIN_ROUTES.places;
    }
    case 'play':
      if (first && PLAY_EXERCISE_IDS.includes(first)) {
        return { kind: 'exercise', id: first };
      }
      return PLAIN_ROUTES.play;
    case 'make':
      if (first && WORKSHOP_TOOL_IDS.includes(first)) {
        return { kind: 'tool', id: first };
      }
      return PLAIN_ROUTES.make;
    case READ_SEGMENT: {
      const story = first ? getStory(first) : undefined;
      if (!story) return PLAIN_ROUTES.shelf;
      const parsed = Number.parseInt(second ?? '1', 10);
      const requested = Number.isFinite(parsed) ? parsed - 1 : 0;
      // `pages.length` is the completion view, and is a legal destination.
      const page = Math.min(Math.max(0, requested), story.pages.length);
      return { kind: 'reader', slug: story.slug, page };
    }
    default:
      return PLAIN_ROUTES.index;
  }
}

/** The routes the collection renders; everything the `Library` can be asked for. */
export type CollectionRoute = Extract<
  Route,
  { kind: 'shelf' | 'timeline' | 'map' | 'topics' | 'topic' | 'places' | 'place' }
>;

const COLLECTION_KINDS: ReadonlySet<RouteKind> = new Set<RouteKind>([
  'shelf',
  'timeline',
  'map',
  'topics',
  'topic',
  'places',
  'place',
]);

function isCollectionRoute(route: Route): route is CollectionRoute {
  return COLLECTION_KINDS.has(route.kind);
}

/* -------------------------------------------------------------------------- */
/* The app                                                                    */
/* -------------------------------------------------------------------------- */

function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  // Bookmarks + completed slugs live in guarded, versioned localStorage.
  const {
    bookmarks,
    completedSlugs,
    getBookmark,
    saveBookmark,
    clearBookmark,
    markComplete,
  } = useBookProgress();

  // A single polite live region; the reader writes page/completion changes here.
  const [liveMessage, setLiveMessage] = useState('');
  const announce = useCallback((message: string) => setLiveMessage(message), []);

  // The current route, readable synchronously. `go` consults and advances it in
  // the same tick so two calls in one event can never both push.
  const routeRef = useRef(route);
  routeRef.current = route;

  // The arrangement a story was opened from, so leaving the reader returns to
  // it rather than to the canonical shelf.
  const cameFrom = useRef<CollectionRoute>(PLAIN_ROUTES.shelf);
  if (isCollectionRoute(route)) cameFrom.current = route;

  const go = useCallback((next: Route) => {
    const from = routeRef.current;
    const hash = toHash(next);
    if (toHash(from) === hash) return;
    if (isDescent(from, next)) window.history.pushState(null, '', hash);
    else window.history.replaceState(null, '', hash);
    routeRef.current = next;
    // Clear the announcement here rather than in an effect: a screen that
    // announces on arrival runs its own effect after this, and would otherwise
    // be silenced by it. Left alone, the region keeps describing the page the
    // reader just left.
    setLiveMessage('');
    setRoute(next);
  }, []);

  // The skip link stays a real anchor, but activating it must not mutate the
  // hash to "#main-content" — that would drop the active route. Prevent the
  // default and move focus into the current `<main id="main-content">`.
  const focusMainContent = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = parseHash(window.location.hash);
      routeRef.current = next;
      setLiveMessage('');
      setRoute(next);
    };
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  /**
   * One delegated handler decides push versus replace for every in-app link in
   * the guide, including links inside screens this file knows nothing about. A
   * link declares only where it goes; nothing has to remember how to get there.
   */
  useEffect(() => {
    const onClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#/')) return;
      const anchorTarget = anchor.getAttribute('target');
      if (anchorTarget && anchorTarget !== '_self') return;
      event.preventDefault();
      go(parseHash(href));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [go]);

  // The address bar always names what is on screen. A hash that canonicalised
  // (an unknown exercise, a page past the end, a stray segment) is rewritten in
  // place, so a deep link can never leave the URL lying about the destination.
  useEffect(() => {
    const canonical = toHash(route);
    if (window.location.hash !== canonical) {
      window.history.replaceState(null, '', canonical);
    }
  }, [route]);

  // Arriving on a screen moves focus to its heading, so the next Tab and the
  // next screen-reader utterance both start from the new page rather than from
  // the top of the document. Page turns keep the same screen and are left to
  // the reader's own focus handling.
  const screen = screenKey(route);
  const isFirstScreen = useRef(true);
  useEffect(() => {
    if (isFirstScreen.current) {
      isFirstScreen.current = false;
      return;
    }
    const main = document.getElementById('main-content');
    const heading: HTMLElement | null = main?.querySelector('h1') ?? main;
    if (!heading) return;
    heading.setAttribute('tabindex', '-1');
    heading.focus();
  }, [screen]);

  const openStory = useCallback(
    (slug: string) => {
      // Resume only at a real, in-range story page. A bookmark of 0, the
      // completion index, an out-of-range/huge value, a negative, or a
      // non-integer is ignored — and any stored value we refuse to honour is
      // cleared so it can never open straight into completion and trigger
      // completion persistence on a story the reader has not finished.
      const story = getStory(slug);
      const pageCount = story ? story.pages.length : 0;
      const bookmark = getBookmark(slug);
      const resumable =
        typeof bookmark === 'number' &&
        Number.isInteger(bookmark) &&
        bookmark > 0 &&
        bookmark < pageCount;
      if (bookmark !== undefined && !resumable) clearBookmark(slug);
      go({ kind: 'reader', slug, page: resumable ? bookmark : 0 });
    },
    [getBookmark, clearBookmark, go],
  );

  // Page turns are lateral, so `go` replaces: Back leaves the story, it does
  // not rewind it page by page.
  const setPage = useCallback(
    (slug: string, page: number) => {
      go({ kind: 'reader', slug, page });
      // Bookmark genuine story pages; drop the bookmark at the very start or
      // once the completion view is reached.
      const story = getStory(slug);
      const pageCount = story ? story.pages.length : 0;
      if (page > 0 && page < pageCount) saveBookmark(slug, page);
      else clearBookmark(slug);
    },
    [saveBookmark, clearBookmark, go],
  );

  const handleComplete = useCallback(
    (slug: string) => {
      markComplete(slug);
      // A finished story reopens fresh, so its resume bookmark is cleared.
      clearBookmark(slug);
    },
    [markComplete, clearBookmark],
  );

  const readerStory = route.kind === 'reader' ? getStory(route.slug) : undefined;

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={focusMainContent}>
        Skip to main content
      </a>

      {route.kind === 'reader' && readerStory ? (
        <Reader
          story={readerStory}
          page={Math.min(Math.max(0, Math.trunc(route.page)), readerStory.pages.length)}
          onNavigate={(nextPage) => setPage(readerStory.slug, nextPage)}
          onExit={() => go(cameFrom.current)}
          onComplete={handleComplete}
          announce={announce}
        />
      ) : route.kind === 'make' || route.kind === 'tool' ? (
        <WorkshopHub
          activeId={route.kind === 'tool' ? route.id : null}
          onLoomExit={() => go(PLAIN_ROUTES.make)}
        />
      ) : route.kind === 'play' || route.kind === 'exercise' ? (
        <PlayHub activeId={route.kind === 'exercise' ? route.id : null} />
      ) : isCollectionRoute(route) ? (
        <Library
          stories={STORIES}
          route={route}
          onOpenStory={openStory}
          onNavigate={go}
          completedSlugs={completedSlugs}
        />
      ) : (
        <LearningCenterWelcome bookmarks={bookmarks} />
      )}

      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
    </>
  );
}

export default App;
