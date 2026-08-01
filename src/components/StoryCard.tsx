import { StoryImage } from './StoryImage';
import type { Story } from '../types';
import { CATEGORY_LABEL } from '../data/meta';

export interface StoryCardProps {
  readonly story: Story;
  /** Called with the story slug when the reader should open this story. */
  readonly onOpen: (slug: string) => void;
  /** Elevated "Tonight's pick" presentation (a small ribbon, not a size change). */
  readonly featured?: boolean;
  /** Reflects completion via a `data-completed` attribute and a check mark. */
  readonly completed?: boolean;
}

/**
 * A single compact library tile. The whole card is one button so a tap or click
 * anywhere on the cover or text opens the story — the most forgiving target for
 * a small child. No motion, no separate CTA.
 */
export function StoryCard({
  story,
  onOpen,
  featured = false,
  completed = false,
}: StoryCardProps) {
  const readLabel = completed ? `Read ${story.title} again` : `Read ${story.title}`;

  return (
    <article
      className={`story-card${featured ? ' story-card--featured' : ''}`}
      data-completed={completed ? 'true' : 'false'}
      data-domain={story.domain}
    >
      <button type="button" className="story-card__open" onClick={() => onOpen(story.slug)} aria-label={readLabel}>
        <span className="story-card__cover">
          <StoryImage story={story} page="cover" alt={story.coverAlt ?? story.pages[0].alt} />
          {featured ? <span className="story-card__ribbon">Tonight&rsquo;s pick</span> : null}
          {completed ? (
            <span className="story-card__check" aria-hidden="true">
              &#10003;
            </span>
          ) : null}
        </span>
        <span className="story-card__body">
          <span className="story-card__domain">{CATEGORY_LABEL[story.domain]}</span>
          <span className="story-card__title">{story.title}</span>
          <span className="story-card__subtitle">{story.subtitle}</span>
        </span>
      </button>
    </article>
  );
}

export default StoryCard;
