import { StoryImage } from './StoryImage';
import type { Story, StoryDomain } from '../types';

/** Warm, child-facing labels for each learning domain shown on a cover. */
const DOMAIN_LABEL: Record<StoryDomain, string> = {
  measurement: 'Measuring',
  patterns: 'Patterns',
  sound: 'Sound',
  wind: 'Wind',
  'plant-growth': 'Growing things',
  shadows: 'Shadows',
  navigation: 'Finding the way',
  'simple-machines': 'Simple machines',
  displacement: 'Water rising',
};

export interface StoryCardProps {
  readonly story: Story;
  /** Called with the story slug when the reader should open this story. */
  readonly onOpen: (slug: string) => void;
  /** Elevated "Tonight's pick" presentation. */
  readonly featured?: boolean;
  /**
   * Completion styling hook. Persistence is Task 5's job; this component only
   * reflects the flag it is given via a `data-completed` attribute and copy.
   */
  readonly completed?: boolean;
  /** Reserved motion hook, threaded to the cover <Scene>. No animation here. */
  readonly motionEnabled?: boolean;
}

export function StoryCard({
  story,
  onOpen,
  featured = false,
  completed = false,
  motionEnabled = false,
}: StoryCardProps) {
  const readLabel = completed ? `Read ${story.title} again` : `Read ${story.title}`;

  return (
    <article
      className={`story-card${featured ? ' story-card--featured' : ''}`}
      data-completed={completed ? 'true' : 'false'}
      data-domain={story.domain}
      data-motion={motionEnabled ? 'on' : 'off'}
    >
      <div className="story-card__cover">
        <StoryImage story={story} page="cover" alt={story.pages[0].alt} motionEnabled={motionEnabled} />
        {featured ? (
          <p className="story-card__eyebrow">Tonight&rsquo;s pick</p>
        ) : null}
        {completed ? (
          <p className="story-card__badge">
            <span aria-hidden="true" className="story-card__badge-mark">
              &#10003;
            </span>
            You&rsquo;ve read this
          </p>
        ) : null}
      </div>

      <div className="story-card__body">
        <h2 className="story-card__title">{story.title}</h2>
        <p className="story-card__subtitle">{story.subtitle}</p>

        <ul className="story-card__context">
          <li className="story-card__context-item">
            <span className="story-card__context-label">Read time</span>
            <span className="story-card__context-value">
              {story.readAloudMinutes} min read
            </span>
          </li>
          <li className="story-card__context-item">
            <span className="story-card__context-label">Explore</span>
            <span className="story-card__context-value">
              {DOMAIN_LABEL[story.domain]}
            </span>
          </li>
          <li className="story-card__context-item story-card__context-item--heart">
            <span className="story-card__context-label">Heart skill</span>
            <span className="story-card__context-value">{story.heartTakeaway}</span>
          </li>
        </ul>

        <button
          type="button"
          className="story-card__cta"
          onClick={() => onOpen(story.slug)}
        >
          <span aria-hidden="true" className="story-card__cta-icon">
            &#9656;
          </span>
          {readLabel}
        </button>
      </div>
    </article>
  );
}

export default StoryCard;
