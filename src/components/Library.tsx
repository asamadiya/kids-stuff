import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LearningCenterWelcome } from './LearningCenterWelcome';
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
import type { Story, StoryDomain } from '../types';
import '../styles/library.css';
import '../styles/home.css';


export interface LibraryProps {
  readonly stories: readonly Story[];
  readonly onOpenStory: (slug: string) => void;
  readonly onMakeStory?: () => void;
  readonly onPlay?: () => void;
  readonly completedSlugs?: ReadonlySet<string>;
}

export function Library({
  stories,
  onOpenStory,
  onMakeStory,
  onPlay,
  completedSlugs,
}: LibraryProps) {
  const done = completedSlugs ?? new Set<string>();
  const [view, setView] = useState<ViewKind>('shelf');
  const [topics, setTopics] = useState<ReadonlySet<StoryDomain>>(new Set());
  const [regions, setRegions] = useState<ReadonlySet<string>>(new Set());

  const historicalCount = useMemo(
    () => stories.filter((s) => s.collection === 'historical').length,
    [stories],
  );
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    for (const s of stories) {
      const m = getMeta(s.slug);
      if (m) set.add(m.region);
    }
    return set;
  }, [stories]);

  function toggle<T>(set: ReadonlySet<T>, v: T): Set<T> {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  }

  // Spatial/temporal views only include stories that have geo/date metadata.
  const needsMeta = view === 'timeline' || view === 'map' || view === 'place';

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

  const scrollToExplorer = () => {
    const explorer = document.getElementById('story-explorer');
    if (typeof explorer?.scrollIntoView === 'function') {
      explorer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const exploreSubject = (domain: StoryDomain) => {
    setTopics(new Set([domain]));
    setRegions(new Set());
    setView('topic');
    scrollToExplorer();
  };

  return (
    <main
      id="main-content"
      className="library"
      aria-label="Rikki's Field Guide"
      tabIndex={-1}
    >
      <LearningCenterWelcome
        historicalCount={historicalCount}
        onOpenLibrary={scrollToExplorer}
        onPlay={onPlay}
        onMakeStory={onMakeStory}
        onExploreSubject={exploreSubject}
      />

      <section
        id="story-explorer"
        className="library-explorer"
        aria-labelledby="library-explorer-title"
      >
        <header className="library-explorer__head">
          <p className="library-explorer__eyebrow">The collection</p>
          <h2 id="library-explorer-title" className="library-explorer__title">
            Five ways into the collection
          </h2>
          <p className="library-explorer__lede">
            Open the shelf, travel through time, visit the map, or follow a
            favorite subject.
          </p>
        </header>

        <div className="home__controls">
          <ViewSwitcher value={view} onChange={setView} />
          <FilterBar
            topics={topics}
            regions={regions}
            onToggleTopic={(t) => setTopics((s) => toggle(s, t))}
            onToggleRegion={(r) => setRegions((s) => toggle(s, r))}
            onClear={() => {
              setTopics(new Set());
              setRegions(new Set());
            }}
            availableRegions={availableRegions}
            showRegions={view !== 'map'}
          />
        </div>

        <p className="home__resultcount" role="status">
          {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} ready to
          explore
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="home__view"
          >
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
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 ? (
          <p className="home__empty">
            No stories match those filters yet — try clearing a few.
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default Library;
