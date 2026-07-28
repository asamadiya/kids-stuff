import { useMemo } from 'react';
import { ViewSwitcher } from './ViewSwitcher';
import type { ViewKind } from './ViewSwitcher';
import { FilterBar } from './FilterBar';
import { GroupedView } from './views/GroupedView';
import type { StoryGroup } from './views/GroupedView';
import { TimelineView } from './views/TimelineView';
import { MapView } from './views/MapView';
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  REGIONS,
  REGION_COLOR,
  getMeta,
} from '../data/meta';
import type { CollectionRoute, Route } from '../App';
import type { Story, StoryDomain } from '../types';
import '../styles/library.css';
import '../styles/home.css';

/** The way out was a button before it was a link; library.css never suppressed
 *  the anchor underline that would otherwise strike through it. */
const NO_UNDERLINE = { textDecoration: 'none' } as const;

export interface LibraryProps {
  readonly stories: readonly Story[];
  /** Which arrangement, and which facet of it, read off the hash. */
  readonly route: CollectionRoute;
  readonly onOpenStory: (slug: string) => void;
  readonly onNavigate: (route: Route) => void;
  readonly completedSlugs?: ReadonlySet<string>;
}

/**
 * The arrangement each collection route shows. Derived, not stored: there is no
 * `view` state here to fall out of step with the address bar, and no way to be
 * looking at the map while the URL says timeline.
 */
const VIEW_OF: Record<CollectionRoute['kind'], ViewKind> = {
  shelf: 'shelf',
  timeline: 'timeline',
  map: 'map',
  topics: 'topic',
  topic: 'topic',
  places: 'place',
  place: 'place',
};

/**
 * The route a tab lands on. Choosing a tab clears the facet below it. Written
 * as literals rather than by importing the route constants, so this module
 * needs nothing from `App` at run time and the two cannot deadlock on load.
 */
function routeOfView(view: ViewKind): Route {
  switch (view) {
    case 'shelf':
      return { kind: 'shelf' };
    case 'timeline':
      return { kind: 'timeline' };
    case 'map':
      return { kind: 'map' };
    case 'topic':
      return { kind: 'topics' };
    case 'place':
      return { kind: 'places' };
    default: {
      const exhaustive: never = view;
      throw new Error(`Unhandled view ${String(exhaustive)}`);
    }
  }
}

const EMPTY_TOPICS: ReadonlySet<StoryDomain> = new Set();
const EMPTY_REGIONS: ReadonlySet<string> = new Set();

/**
 * What this screen is, in the heading. Focus lands on the heading after every
 * route change, so it has to say which of the seven collection routes is on
 * show — a heading that reads the same on all of them tells a listener nothing
 * about where the last press took them. A chosen facet names itself.
 */
function headingOf(route: CollectionRoute): string {
  switch (route.kind) {
    case 'shelf':
      return 'The shelf';
    case 'timeline':
      return 'By date';
    case 'map':
      return 'On the map';
    case 'topics':
      return 'By subject';
    case 'topic':
      return CATEGORY_LABEL[route.domain];
    case 'places':
      return 'By place';
    case 'place':
      return route.region;
    default: {
      const exhaustive: never = route;
      throw new Error(`Unhandled route ${String(exhaustive)}`);
    }
  }
}

const LEDE_OF: Record<ViewKind, string> = {
  shelf: 'Real accounts first, then the invented ones.',
  timeline: 'Oldest first, banded by era.',
  map: 'Each account pinned where it happened.',
  topic: 'Grouped by what the account is about.',
  place: 'Grouped by region of the world.',
};

export function Library({
  stories,
  route,
  onOpenStory,
  onNavigate,
  completedSlugs,
}: LibraryProps) {
  const done = completedSlugs ?? new Set<string>();
  const view = VIEW_OF[route.kind];
  // Memoised on the route, so the 217-story filter below re-runs when the
  // address changes rather than on every render.
  const topics = useMemo(
    () => (route.kind === 'topic' ? new Set([route.domain]) : EMPTY_TOPICS),
    [route],
  );
  const regions = useMemo(
    () => (route.kind === 'place' ? new Set([route.region]) : EMPTY_REGIONS),
    [route],
  );

  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    for (const s of stories) {
      const m = getMeta(s.slug);
      if (m) set.add(m.region);
    }
    return set;
  }, [stories]);

  // Spatial/temporal views only include stories that have geo/date metadata.
  const needsMeta =
    route.kind === 'timeline' ||
    route.kind === 'map' ||
    route.kind === 'places' ||
    route.kind === 'place';

  const filtered = useMemo(() => {
    return stories.filter((s) => {
      if (topics.size && !topics.has(s.domain)) return false;
      const m = getMeta(s.slug);
      if (regions.size && (!m || !regions.has(m.region))) return false;
      if (needsMeta && !m) return false;
      return true;
    });
  }, [stories, topics, regions, needsMeta]);

  const shelfGroups: StoryGroup[] = useMemo(() => {
    const hist = filtered.filter((s) => s.collection === 'historical');
    const fic = filtered.filter((s) => s.collection === 'fiction');
    const out: StoryGroup[] = [];
    if (hist.length)
      out.push({
        key: 'historical',
        label: 'Real people who wondered',
        blurb:
          'Real inventors and thinkers from long ago, and the wonderful things they figured out.',
        items: hist,
      });
    if (fic.length)
      out.push({
        key: 'fiction',
        label: 'Make-believe friends',
        blurb: 'Gentle invented characters who love to explore the very same ideas.',
        items: fic,
      });
    return out;
  }, [filtered]);

  const topicGroups: StoryGroup[] = useMemo(
    () =>
      CATEGORY_ORDER.map((d) => ({
        key: d,
        label: CATEGORY_LABEL[d],
        items: filtered.filter((s) => s.domain === d),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  const placeGroups: StoryGroup[] = useMemo(
    () =>
      REGIONS.map((r) => ({
        key: r,
        label: r,
        accent: REGION_COLOR[r],
        items: filtered.filter((s) => getMeta(s.slug)?.region === r),
      })).filter((g) => g.items.length > 0),
    [filtered],
  );

  const placeCaption = (s: Story) => getMeta(s.slug)?.yearLabel;
  const topicCaption = (s: Story) => getMeta(s.slug)?.place;

  // A facet is a rung below its arrangement: choosing one descends, choosing it
  // again comes back up. `onNavigate` decides push versus replace centrally, so
  // neither decision lives here.
  const toggleTopic = (domain: StoryDomain) =>
    onNavigate(
      route.kind === 'topic' && route.domain === domain
        ? { kind: 'topics' }
        : { kind: 'topic', domain },
    );

  const toggleRegion = (region: string) =>
    onNavigate(
      route.kind === 'place' && route.region === region
        ? { kind: 'places' }
        : { kind: 'place', region },
    );

  const clearFacet = () => onNavigate(routeOfView(view));

  return (
    <main
      id="main-content"
      className="library"
      aria-label="The collection"
      tabIndex={-1}
    >
      <section className="library-explorer" aria-labelledby="library-explorer-title">
        <header className="library-explorer__head">
          <a className="play-hub__back" style={NO_UNDERLINE} href="#/">
            <span aria-hidden="true">&larr;</span> Contents
          </a>
          <p className="library-explorer__eyebrow">
            The collection &mdash; {stories.length} accounts, five ways
          </p>
          <h1 id="library-explorer-title" className="library-explorer__title">
            {headingOf(route)}
          </h1>
          <p className="library-explorer__lede">{LEDE_OF[view]}</p>
        </header>

        <div className="home__controls">
          <ViewSwitcher value={view} onChange={(v) => onNavigate(routeOfView(v))} />
          <FilterBar
            topics={topics}
            regions={regions}
            onToggleTopic={toggleTopic}
            onToggleRegion={toggleRegion}
            onClear={clearFacet}
            availableRegions={availableRegions}
            showRegions={view !== 'map'}
          />
        </div>

        <p className="home__resultcount" role="status">
          {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} ready to
          explore
        </p>

        <div className="home__view">
          {view === 'shelf' ? (
            <GroupedView groups={shelfGroups} onOpen={onOpenStory} completedSlugs={done} />
          ) : null}
          {view === 'topic' ? (
            <GroupedView
              groups={topicGroups}
              onOpen={onOpenStory}
              completedSlugs={done}
              caption={topicCaption}
            />
          ) : null}
          {view === 'place' ? (
            <GroupedView
              groups={placeGroups}
              onOpen={onOpenStory}
              completedSlugs={done}
              caption={placeCaption}
            />
          ) : null}
          {view === 'timeline' ? (
            <TimelineView stories={filtered} onOpen={onOpenStory} completedSlugs={done} />
          ) : null}
          {view === 'map' ? <MapView stories={filtered} onOpen={onOpenStory} /> : null}
        </div>

        {filtered.length === 0 ? (
          <p className="home__empty">
            No stories match that filter yet — clear it to see the rest.
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default Library;
