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
  'Age of dinosaurs (deep time)',
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
  'simple-machines': 'Machines & motion',
  materials: 'Making things',
  navigation: 'Maps & finding the way',
  sky: 'Sky & stars',
  earth: 'Our Earth',
  displacement: 'Water & floating',
  shadows: 'Light & shadows',
  sound: 'Sound & music',
  wind: 'Weather & wind',
  'plant-growth': 'Plants & growing',
  life: 'Living things',
};

export interface SubjectDetail {
  readonly icon: string;
  readonly prompt: string;
  readonly color: string;
}

/** Playful presentation details for the home-page subject explorer. */
export const SUBJECT_DETAILS: Record<StoryDomain, SubjectDetail> = {
  numbers: { icon: '123', prompt: 'Count, calculate, and spot clever ideas.', color: '#f06f6b' },
  measurement: { icon: '↔', prompt: 'Compare size, distance, time, and weight.', color: '#ee9d38' },
  patterns: { icon: '◇', prompt: 'Find shapes and rhythms that repeat.', color: '#9b72cf' },
  'simple-machines': { icon: '⚙', prompt: 'See how simple tools help us move things.', color: '#4ca6a8' },
  materials: { icon: '✂', prompt: 'Build, shape, join, and invent.', color: '#e36f9f' },
  navigation: { icon: '⌖', prompt: 'Use maps, stars, and clues to find the way.', color: '#3f8dc9' },
  sky: { icon: '★', prompt: 'Look up at planets, stars, light, and space.', color: '#5d70c9' },
  earth: { icon: '◎', prompt: 'Explore rocks, rivers, weather, and our planet.', color: '#49a56f' },
  displacement: { icon: '≈', prompt: 'Experiment with water, floating, and sinking.', color: '#2f9fc2' },
  shadows: { icon: '◐', prompt: 'Play with light, darkness, and reflection.', color: '#8668b4' },
  sound: { icon: '♪', prompt: 'Listen for vibration, rhythm, and music.', color: '#db6f82' },
  wind: { icon: '≋', prompt: 'Watch air move clouds, sails, and seeds.', color: '#5597b7' },
  'plant-growth': { icon: '♧', prompt: 'Discover how plants and gardens grow.', color: '#69a844' },
  life: { icon: '🦕', prompt: 'Meet dinosaurs, animals, and living things from long ago.', color: '#5bb98c' }
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
  'life',
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
  // Years in the millions (deep negative) are prehistoric / dinosaur time.
  if (year < -100000) return ERA_BANDS[0];
  if (year < -1000) return ERA_BANDS[1];
  if (year < 1) return ERA_BANDS[2];
  if (year < 500) return ERA_BANDS[3];
  if (year < 1400) return ERA_BANDS[4];
  if (year < 1700) return ERA_BANDS[5];
  return ERA_BANDS[6];
}
