import { STORIES } from '../stories';
import { STORY_META } from './storyMeta';

/**
 * Facts about the collection, computed from the collection itself so the
 * masthead can never drift from what is actually on the shelves.
 * Deep-time entries (the Mesozoic accounts) are counted separately because
 * their dates are in millions of years and would swamp the historical range.
 */
const DEEP_TIME_BEFORE = -100000;

const historical = STORIES.filter((s) => s.collection === 'historical');
const metas = historical.map((s) => STORY_META[s.slug]).filter(Boolean);
const datedYears = metas.map((m) => m.year).filter((y) => y > DEEP_TIME_BEFORE);

export const COLLECTION = {
  stories: STORIES.length,
  accounts: historical.length,
  invented: STORIES.length - historical.length,
  earliestYear: Math.min(...datedYears),
  latestYear: Math.max(...datedYears),
  places: new Set(metas.map((m) => m.place)).size,
  regions: new Set(metas.map((m) => m.region)).size,
  deepTime: metas.length - datedYears.length,
  subjects: new Set(STORIES.map((s) => s.domain)).size,
} as const;

/** "20,000 BCE" / "1831 CE" — plain, with a thousands separator. */
export function era(year: number): string {
  const n = Math.abs(year).toLocaleString('en-US');
  return year < 0 ? `${n} BCE` : `${n} CE`;
}
