import type { StoryDomain } from '../types';
import { STORY_META } from './storyMeta';

/** Per-story historical metadata used by the timeline, map, and grouped views. */
export interface StoryMeta {
  /** Representative year; negative = BCE. */
  readonly year: number;
  /** Short display label, e.g. "c. 250 BCE" or "132 CE". */
  readonly yearLabel: string;
  readonly lat: number;
  readonly lng: number;
  /** Short readable place, e.g. "Syracuse, Sicily". */
  readonly place: string;
  /** Broad region bucket (one of REGIONS). */
  readonly region: string;
  /** Era band (one of ERA_BANDS). */
  readonly era: string;
}

/** Era bands, oldest → newest. Drives the timeline ordering. */
export const ERA_BANDS = [
  'Deep past (before 1000 BCE)',
  'Ancient (1000 BCE–1 CE)',
  'Classical (1–500 CE)',
  'Medieval (500–1400 CE)',
  'Early modern (1400–1700 CE)',
  'Later (after 1700 CE)',
] as const;

/** Region buckets for the map + by-place view. */
export const REGIONS = [
  'Mediterranean',
  'Europe',
  'West & Central Asia',
  'South Asia',
  'East Asia',
  'Southeast Asia',
  'Africa',
  'North America',
  'Mesoamerica',
  'Andes & South America',
  'Oceania & Pacific',
  'Arctic',
] as const;

/** A warm dusk hue per region, shared by map pins and place headings. */
export const REGION_COLOR: Record<string, string> = {
  Mediterranean: '#e9a24c',
  Europe: '#c98bd0',
  'West & Central Asia': '#e07a5f',
  'South Asia': '#f2c14e',
  'East Asia': '#e8695f',
  'Southeast Asia': '#5fbf9f',
  Africa: '#d98a3d',
  'North America': '#6fa8dc',
  Mesoamerica: '#7bc47f',
  'Andes & South America': '#f28cb1',
  'Oceania & Pacific': '#4cc0c9',
  Arctic: '#a9c7e8',
};

/** Warm, child-facing labels for each learning domain (the "topics"). */
export const CATEGORY_LABEL: Record<StoryDomain, string> = {
  numbers: 'Numbers',
  measurement: 'Measuring',
  patterns: 'Patterns',
  'simple-machines': 'Simple machines',
  materials: 'Making things',
  navigation: 'Finding the way',
  sky: 'Sky & stars',
  earth: 'Our Earth',
  displacement: 'Water rising',
  shadows: 'Shadows',
  sound: 'Sound',
  wind: 'Wind',
  'plant-growth': 'Growing things',
};

/** Display order for the by-topic view. */
export const CATEGORY_ORDER: readonly StoryDomain[] = [
  'numbers',
  'measurement',
  'patterns',
  'simple-machines',
  'materials',
  'navigation',
  'sky',
  'earth',
  'displacement',
  'shadows',
  'sound',
  'wind',
  'plant-growth',
];

export function getMeta(slug: string): StoryMeta | undefined {
  return STORY_META[slug];
}

/** Which era band a year falls into. */
export function eraOf(year: number): string {
  if (year < -1000) return ERA_BANDS[0];
  if (year < 1) return ERA_BANDS[1];
  if (year < 500) return ERA_BANDS[2];
  if (year < 1400) return ERA_BANDS[3];
  if (year < 1700) return ERA_BANDS[4];
  return ERA_BANDS[5];
}
