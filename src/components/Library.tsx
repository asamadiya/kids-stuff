import { useMemo } from 'react';
import { StoryCard } from './StoryCard';
import type { Story, StoryCollection } from '../types';
import '../styles/library.css';

/** Long-term goal for the counted, historical collection. */
const HISTORICAL_GOAL = 200;

interface SectionDef {
  readonly key: StoryCollection;
  readonly anchor: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly blurb: string;
}

/** Historical leads (it is the counted collection); fiction follows. */
const SECTIONS: readonly SectionDef[] = [
  {
    key: 'historical',
    anchor: 'true-tales',
    eyebrow: 'True tales',
    title: 'Real people who wondered',
    blurb: 'Real inventors and thinkers from long ago, and the wonderful things they figured out.',
  },
  {
    key: 'fiction',
    anchor: 'storyland',
    eyebrow: 'Storyland',
    title: 'Make-believe friends',
    blurb: 'Gentle invented characters who love to explore the very same ideas.',
  },
];

export interface LibraryProps {
  readonly stories: readonly Story[];
  /** Open a story in the reader by slug. */
  readonly onOpenStory: (slug: string) => void;
  /** Slug of the story to elevate as "Tonight's pick". */
  readonly tonightPickSlug?: string;
  /** Slugs the reader has finished. Drives the completed check. */
  readonly completedSlugs?: ReadonlySet<string>;
}

export function Library({
  stories,
  onOpenStory,
  tonightPickSlug,
  completedSlugs,
}: LibraryProps) {
  const done = completedSlugs ?? new Set<string>();
  const byCollection = useMemo(() => {
    const map = new Map<StoryCollection, Story[]>();
    for (const story of stories) {
      const list = map.get(story.collection) ?? [];
      list.push(story);
      map.set(story.collection, list);
    }
    return map;
  }, [stories]);

  const sections = SECTIONS.map((def) => ({
    def,
    items: byCollection.get(def.key) ?? [],
  })).filter((section) => section.items.length > 0);

  const historicalCount = byCollection.get('historical')?.length ?? 0;

  return (
    <main id="main-content" className="library" aria-label="Story library" tabIndex={-1}>
      <header className="library__hero">
        <p className="library__eyebrow">A calm bedtime library</p>
        <h1 className="library__title">Moonlit Storybook</h1>
        <p className="library__lede">
          Gentle stories for winding down. Choose one, dim the lights, and read it together.
        </p>
        {sections.length > 1 ? (
          <nav className="library__jump" aria-label="Jump to a shelf">
            {sections.map(({ def, items }) => (
              <a key={def.key} className="library__jump-link" href={`#${def.anchor}`}>
                {def.eyebrow}
                <span className="library__jump-count">{items.length}</span>
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      {sections.map(({ def, items }) => (
        <section
          key={def.key}
          id={def.anchor}
          className="library__section"
          aria-labelledby={`${def.anchor}-heading`}
        >
          <div className="library__section-head">
            <h2 id={`${def.anchor}-heading`} className="library__section-title">
              {def.title}
            </h2>
            <p className="library__section-count">
              {def.key === 'historical'
                ? `${historicalCount} of ${HISTORICAL_GOAL} true tales`
                : `${items.length} stories`}
            </p>
          </div>
          <p className="library__section-blurb">{def.blurb}</p>

          <ol className="library__grid" role="list">
            {items.map((story) => (
              <li key={story.slug} className="library__grid-item">
                <StoryCard
                  story={story}
                  onOpen={onOpenStory}
                  featured={story.slug === tonightPickSlug}
                  completed={done.has(story.slug)}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}

export default Library;
