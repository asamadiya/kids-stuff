import type { GrownUpNote } from '../notes/types';
import type { Story, StoryDomain } from '../types';
import { STORIES } from '../stories';

/**
 * The Big Library: the 195 real-history read-alouds, organised by subject.
 *
 * Advisor ruling (RULINGS-3): keep them, label them "Longer read-aloud", and
 * organise the archive by subject before showing titles — the old shelf put
 * all 215 behind two rows of fifteen topic chips and thirteen place chips,
 * which is chip soup to a five-year-old and to his father.
 *
 * The 20 invented-cast "fiction" stories are not shown: the new picture books
 * replace them, and they broke the standing rule of real history over fable.
 */

export interface Subject {
  readonly id: string;
  readonly title: string;
  readonly line: string;
  readonly domains: readonly StoryDomain[];
}

export const SUBJECTS: readonly Subject[] = [
  { id: 'numbers', title: 'Numbers & Patterns', line: 'Zero, counting boards, number puzzles and patterns from around the world.', domains: ['numbers', 'patterns'] },
  { id: 'measure', title: 'Measuring', line: 'Rulers, scales, calendars and clocks — how people made things exact.', domains: ['measurement'] },
  { id: 'machines', title: 'Machines & Making', line: 'Levers, screws and pulleys; paper, printing, cloth and glass.', domains: ['simple-machines', 'materials'] },
  { id: 'sky', title: 'Sky, Earth & Finding the Way', line: 'Stars, the spinning Earth, earthquakes, compasses and navigators.', domains: ['sky', 'earth', 'navigation'] },
  { id: 'water', title: 'Water, Air & Sound', line: 'Floating, wind, echoes and the people who measured them.', domains: ['displacement', 'wind', 'sound'] },
  { id: 'life', title: 'Light & Life', line: 'Shadows and sunlight, seeds, and the deep time of dinosaurs.', domains: ['shadows', 'plant-growth', 'life'] },
];

const DOMAIN_TO_SUBJECT = new Map<StoryDomain, string>(
  SUBJECTS.flatMap((s) => s.domains.map((d) => [d, s.id] as const)),
);

export const ARCHIVE: readonly Story[] = STORIES.filter((s) => s.collection === 'historical');

export function archiveStory(slug: string): Story | undefined {
  return ARCHIVE.find((s) => s.slug === slug);
}

export function subjectOfStory(slug: string): string | undefined {
  const s = archiveStory(slug);
  return s ? DOMAIN_TO_SUBJECT.get(s.domain) : undefined;
}

export function storiesIn(subject: string): readonly Story[] {
  const sub = SUBJECTS.find((s) => s.id === subject);
  if (!sub) return [];
  return ARCHIVE.filter((s) => sub.domains.includes(s.domain)).sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * People & Discoveries links to these curated archive read-alouds beside the
 * three new picture books: Indian thinkers first, then a few landmark ideas
 * from elsewhere. Chosen by hand, not by a filter, so the list is a choice.
 */
export const CURATED_ARCHIVE: readonly string[] = [
  'aryabhata-circle-number',
  'aryabhata-spinning-earth',
  'aryabhata-number-ladder',
  'brahmagupta-nothing',
  'the-bees-and-the-lotus-riddle',
  'the-doubling-grains-on-the-board',
  'the-breath-you-can-count',
  'archimedes-water-screw',
  'archimedes-place-to-stand',
  'cai-lun-paper',
  'bi-sheng-blocks',
  'zhang-heng-earth-dragon',
  'the-south-pointing-spoon',
  'the-astronomer-who-timed-the-shadow',
  'the-screw-that-squeezed-the-olives',
  'the-balancing-puzzle',
];

export const LIBRARY_NOTE: GrownUpNote = {
  what: 'The original collection: 195 true stories about people who worked something out — who measured, counted, built or navigated — from every part of the world.',
  expect: 'These are longer than the picture books, 6 to 16 pages with more words a page. Most five-year-olds need them read aloud and will listen best to one or two a night.',
  practising: 'Listening to longer explanations; the idea that real people found things out by watching, measuring and testing.',
  ask: '"What problem was this person trying to solve?"',
  next: 'Pick one idea from a story and try it: measure with your feet, sort beans by tens, mark a shadow every hour.',
  honest: 'These were written for an older listener than the new picture books, and the pictures were made separately from the words, so a few do not match the page closely.',
};
