import type { StoryDomain } from '../types';
import { CATEGORY_LABEL, CATEGORY_ORDER, REGIONS, REGION_COLOR } from '../data/meta';

export interface FilterBarProps {
  readonly topics: ReadonlySet<StoryDomain>;
  readonly regions: ReadonlySet<string>;
  readonly onToggleTopic: (t: StoryDomain) => void;
  readonly onToggleRegion: (r: string) => void;
  readonly onClear: () => void;
  /** Regions that actually have stories in the current collection. */
  readonly availableRegions: ReadonlySet<string>;
  readonly showRegions: boolean;
}

/** Chip rows to filter by topic and region; selections cross-filter every view. */
export function FilterBar({
  topics,
  regions,
  onToggleTopic,
  onToggleRegion,
  onClear,
  availableRegions,
  showRegions,
}: FilterBarProps) {
  const any = topics.size > 0 || regions.size > 0;
  return (
    <div className="filterbar">
      <div className="filterbar__row" role="group" aria-label="Filter by topic">
        <span className="filterbar__legend">Topics</span>
        {CATEGORY_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            className={`chip${topics.has(t) ? ' is-on' : ''}`}
            aria-pressed={topics.has(t)}
            onClick={() => onToggleTopic(t)}
          >
            {CATEGORY_LABEL[t]}
          </button>
        ))}
      </div>

      {showRegions ? (
        <div className="filterbar__row" role="group" aria-label="Filter by place">
          <span className="filterbar__legend">Places</span>
          {REGIONS.filter((r) => availableRegions.has(r)).map((r) => (
            <button
              key={r}
              type="button"
              className={`chip chip--region${regions.has(r) ? ' is-on' : ''}`}
              aria-pressed={regions.has(r)}
              onClick={() => onToggleRegion(r)}
              style={({ ['--accent' as string]: REGION_COLOR[r] })}
            >
              <span className="chip__dot" aria-hidden="true" />
              {r}
            </button>
          ))}
        </div>
      ) : null}

      {any ? (
        <button type="button" className="filterbar__clear" onClick={onClear}>
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

export default FilterBar;
