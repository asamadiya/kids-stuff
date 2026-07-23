import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

const HISTORICAL_GOAL = 200;

export interface LibraryProps {
  readonly stories: readonly Story[];
  readonly onOpenStory: (slug: string) => void;
  readonly onMakeStory?: () => void;
  readonly completedSlugs?: ReadonlySet<string>;
}

export function Library({ stories, onOpenStory, onMakeStory, completedSlugs }: LibraryProps) {
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

  return (
    <main id="main-content" className="library" aria-label="Story library" tabIndex={-1}>
      <header className="home__hero">
        <p className="library__eyebrow">A calm bedtime library</p>
        <h1 className="library__title">Moonlit Storybook</h1>
        <p className="library__lede">
          {historicalCount} true tales from across history — and 20 make-believe friends.
          Explore them by time, place, or topic.
        </p>
        <p className="home__progress" aria-hidden="true">
          {historicalCount} of {HISTORICAL_GOAL} true tales
        </p>
        {onMakeStory ? (
          <button type="button" className="home__make" onClick={onMakeStory}>
            ✨ Make me a story
          </button>
        ) : null}
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
        {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
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
        <p className="home__empty">No stories match those filters yet — try clearing a few.</p>
      ) : null}
    </main>
  );
}

export default Library;
