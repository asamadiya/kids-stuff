import { AnimatePresence, motion } from 'framer-motion';
import { StoryTile } from '../StoryTile';
import type { Story } from '../../types';

export interface StoryGroup {
  readonly key: string;
  readonly label: string;
  readonly blurb?: string;
  readonly accent?: string;
  readonly items: readonly Story[];
}

export interface GroupedViewProps {
  readonly groups: readonly StoryGroup[];
  readonly onOpen: (slug: string) => void;
  readonly completedSlugs: ReadonlySet<string>;
  /** Optional caption under each tile (e.g. year or place). */
  readonly caption?: (story: Story) => string | undefined;
}

/** A stack of labelled groups; tiles animate as filters change (framer `layout`). */
export function GroupedView({ groups, onOpen, completedSlugs, caption }: GroupedViewProps) {
  return (
    <div className="grouped">
      {groups.map((g) => (
        <motion.section
          layout
          key={g.key}
          className="grouped__section"
          style={g.accent ? ({ ['--accent' as string]: g.accent }) : undefined}
        >
          <div className="grouped__head">
            <h2 className="grouped__title">
              {g.accent ? <span className="grouped__dot" aria-hidden="true" /> : null}
              {g.label}
            </h2>
            <span className="grouped__count">{g.items.length}</span>
          </div>
          {g.blurb ? <p className="grouped__blurb">{g.blurb}</p> : null}
          <motion.ul layout className="tilegrid" role="list">
            <AnimatePresence mode="popLayout">
              {g.items.map((story) => (
                <li key={story.slug} className="tilegrid__item">
                  <StoryTile
                    story={story}
                    onOpen={onOpen}
                    completed={completedSlugs.has(story.slug)}
                    caption={caption?.(story)}
                    accent={g.accent}
                  />
                </li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.section>
      ))}
    </div>
  );
}

export default GroupedView;
