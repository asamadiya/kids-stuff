import { AnimatePresence, motion } from 'framer-motion';
import { StoryTile } from '../StoryTile';
import { ERA_BANDS, getMeta } from '../../data/meta';
import type { Story } from '../../types';

export interface TimelineViewProps {
  readonly stories: readonly Story[];
  readonly onOpen: (slug: string) => void;
  readonly completedSlugs: ReadonlySet<string>;
}

/** Vertical timeline: one band per era (oldest first), stories sorted by year. */
export function TimelineView({ stories, onOpen, completedSlugs }: TimelineViewProps) {
  const bands = ERA_BANDS.map((era) => {
    const items = stories
      .filter((s) => getMeta(s.slug)?.era === era)
      .sort((a, b) => (getMeta(a.slug)!.year - getMeta(b.slug)!.year));
    return { era, items };
  }).filter((b) => b.items.length > 0);

  return (
    <div className="timeline">
      {bands.map((band) => (
        <motion.section layout key={band.era} className="timeline__band">
          <div className="timeline__spine" aria-hidden="true">
            <span className="timeline__dot" />
          </div>
          <div className="timeline__content">
            <div className="timeline__head">
              <h2 className="timeline__era">{band.era}</h2>
              <span className="timeline__count">{band.items.length} stories</span>
            </div>
            <motion.ul layout className="tilegrid" role="list">
              <AnimatePresence mode="popLayout">
                {band.items.map((story) => (
                  <li key={story.slug} className="tilegrid__item">
                    <StoryTile
                      story={story}
                      onOpen={onOpen}
                      completed={completedSlugs.has(story.slug)}
                      caption={getMeta(story.slug)?.yearLabel}
                    />
                  </li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        </motion.section>
      ))}
    </div>
  );
}

export default TimelineView;
