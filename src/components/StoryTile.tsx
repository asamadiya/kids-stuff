import { motion } from 'framer-motion';
import { StoryImage } from './StoryImage';
import type { Story } from '../types';

export interface StoryTileProps {
  readonly story: Story;
  readonly onOpen: (slug: string) => void;
  readonly completed?: boolean;
  /** Small caption under the title (year / place / topic depending on the view). */
  readonly caption?: string;
  /** Accent color (region hue) for a thin top border, used in map/place views. */
  readonly accent?: string;
  /** Compact tiles for dense views (timeline/map popovers). */
  readonly dense?: boolean;
}

/**
 * One story as an animated cover tile. `layout` lets framer-motion smoothly
 * move it when the surrounding view filters or regroups; the whole tile is one
 * button so a tap anywhere opens the story.
 */
export function StoryTile({
  story,
  onOpen,
  completed = false,
  caption,
  accent,
  dense = false,
}: StoryTileProps) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 520, damping: 42, mass: 0.6 }}
      className={`tile${dense ? ' tile--dense' : ''}`}
      data-completed={completed ? 'true' : 'false'}
      onClick={() => onOpen(story.slug)}
      aria-label={`Read ${story.title}`}
      style={accent ? ({ ['--accent' as string]: accent }) : undefined}
    >
      <span className="tile__cover">
        <StoryImage story={story} page="cover" alt={story.coverAlt ?? story.pages[0].alt} />
        {completed ? (
          <span className="tile__check" aria-hidden="true">
            &#10003;
          </span>
        ) : null}
      </span>
      <span className="tile__body">
        <span className="tile__title">{story.title}</span>
        {caption ? <span className="tile__caption">{caption}</span> : null}
      </span>
    </motion.button>
  );
}

export default StoryTile;
