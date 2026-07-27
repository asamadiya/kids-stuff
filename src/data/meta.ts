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
  'Mesozoic (deep time)',
  'Prehistory (before 1000 BCE)',
  'Ancient (1000 BCE–1 CE)',
  'Classical (1–500 CE)',
  'Medieval (500–1400 CE)',
  'Early modern (1400–1700 CE)',
  'Modern (after 1700 CE)',
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

/** Region key colour, atlas convention: quiet ground, pins carry the colour. */
export const REGION_COLOR: Record<string, string> = {
  Mediterranean: '#A05A22',
  Europe: '#6B4C7A',
  'West & Central Asia': '#8C3A2E',
  'South Asia': '#7A5C18',
  'East Asia': '#8A4038',
  'Southeast Asia': '#3D6B5E',
  Africa: '#7A4A1E',
  'North America': '#3C566F',
  Mesoamerica: '#55632F',
  'Andes & South America': '#7A3F55',
  'Oceania & Pacific': '#2A5957',
  Arctic: '#5A6B7A',
};

/** Warm, child-facing labels for each learning domain (the "topics"). */
export const CATEGORY_LABEL: Record<StoryDomain, string> = {
  numbers: 'Number',
  measurement: 'Measurement',
  patterns: 'Pattern',
  'simple-machines': 'Simple Machines',
  materials: 'Materials & Making',
  navigation: 'Navigation',
  sky: 'Astronomy',
  earth: 'Earth & Geology',
  displacement: 'Buoyancy & Displacement',
  shadows: 'Light & Shadow',
  sound: 'Sound',
  wind: 'Wind & Weather',
  'plant-growth': 'Botany',
  life: 'Life & Fossils',
};

export interface SubjectDetail {
  readonly icon: string;
  readonly prompt: string;
  readonly color: string;
}

/** Presentation details for the subject index. Colour identifies, it does not decorate. */
export const SUBJECT_DETAILS: Record<StoryDomain, SubjectDetail> = {
  numbers: { icon: '123', prompt: 'Count, calculate, and spot clever ideas.', color: '#8C3A2E' },
  measurement: { icon: '↔', prompt: 'Compare size, distance, time, and weight.', color: '#8A5A20' },
  patterns: { icon: '◇', prompt: 'Find shapes and rhythms that repeat.', color: '#5A4B7A' },
  'simple-machines': { icon: '⚙', prompt: 'See how simple tools help us move things.', color: '#3C566F' },
  materials: { icon: '✂', prompt: 'Build, shape, join, and invent.', color: '#7A4A1E' },
  navigation: { icon: '⌖', prompt: 'Use maps, stars, and clues to find the way.', color: '#2E4A6B' },
  sky: { icon: '★', prompt: 'Look up at planets, stars, light, and space.', color: '#3F4E77' },
  earth: { icon: '◎', prompt: 'Explore rocks, rivers, weather, and our planet.', color: '#55632F' },
  displacement: { icon: '≈', prompt: 'Experiment with water, floating, and sinking.', color: '#2A5957' },
  shadows: { icon: '◐', prompt: 'Play with light, darkness, and reflection.', color: '#5F5A6E' },
  sound: { icon: '♪', prompt: 'Listen for vibration, rhythm, and music.', color: '#8A3F52' },
  wind: { icon: '≋', prompt: 'Watch air move clouds, sails, and seeds.', color: '#4A6470' },
  'plant-growth': { icon: '♧', prompt: 'Discover how plants and gardens grow.', color: '#4F6B33' },
  life: { icon: '🦕', prompt: 'Meet dinosaurs, animals, and living things from long ago.', color: '#3D6B5E' }
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
