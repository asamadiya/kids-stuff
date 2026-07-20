import { StoryCard } from './StoryCard';
import type { Story } from '../types';
import '../styles/library.css';

export interface LibraryProps {
  readonly stories: readonly Story[];
  /** Open a story in the reader by slug. */
  readonly onOpenStory: (slug: string) => void;
  /** Slug of the story to elevate as "Tonight's pick". Defaults to the first. */
  readonly tonightPickSlug?: string;
  /** Slugs the reader has finished. Drives completed styling (Task 5 persists). */
  readonly completedSlugs?: ReadonlySet<string>;
  /** Reserved motion hook, threaded to each cover. No animation in this task. */
  readonly motionEnabled?: boolean;
}

export function Library({
  stories,
  onOpenStory,
  tonightPickSlug,
  completedSlugs,
  motionEnabled = false,
}: LibraryProps) {
  const pickSlug = tonightPickSlug ?? stories[0]?.slug;
  const pick = stories.find((story) => story.slug === pickSlug);
  const rest = stories.filter((story) => story.slug !== pickSlug);
  // Lead with the pick so the shelf reads editorially, top to bottom.
  const ordered = pick ? [pick, ...rest] : [...stories];
  const done = completedSlugs ?? new Set<string>();

  return (
    <main
      id="main-content"
      className="library"
      aria-label="Story library"
      tabIndex={-1}
    >
      <header className="library__hero">
        <p className="library__eyebrow">A calm bedtime library</p>
        <h1 className="library__title">Moonlit Storybook</h1>
        <p className="library__lede">
          Nine gentle stories for winding down. Choose one, dim the lights, and
          read it together.
        </p>
      </header>

      <section className="library__shelf" aria-label="Stories to read">
        <ol className="library__grid" role="list">
          {ordered.map((story) => (
            <li key={story.slug} className="library__grid-item">
              <StoryCard
                story={story}
                onOpen={onOpenStory}
                featured={story.slug === pickSlug}
                completed={done.has(story.slug)}
                motionEnabled={motionEnabled}
              />
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export default Library;
