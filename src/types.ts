export const STORY_DOMAINS = [
  'measurement',
  'patterns',
  'sound',
  'wind',
  'plant-growth',
  'shadows',
  'navigation',
  'simple-machines',
] as const;

export type StoryDomain = (typeof STORY_DOMAINS)[number];

export interface StoryScene {
  /** Unique composition id across the whole library; scene modules map on this. */
  readonly id: string;
  /** What the eye lands on first — the focal subject or action of the page. */
  readonly focus: string;
  /** Foreground / midground / background guidance for a distinct composition. */
  readonly composition: string;
  /** Dusk-leaning palette guidance so the bedtime mood stays warm yet varied. */
  readonly palette: string;
}

export interface StoryPage {
  /** Plain semantic read-aloud text with no markup or embedded cues. */
  readonly text: string;
  /** Optional grown-up-and-child participation cue for this page. */
  readonly cue?: string;
  /** Illustration composition metadata for later scene implementers. */
  readonly scene: StoryScene;
  /** Non-empty accessible description of the illustrated scene. */
  readonly alt: string;
}

export interface Story {
  /** Lowercase kebab-case identifier, unique across the library. */
  readonly slug: string;
  readonly title: string;
  /** Short hook shown on the story card. */
  readonly subtitle: string;
  readonly domain: StoryDomain;
  /** The warm phrase repeated through the story. */
  readonly repeatedPhrase: string;
  /** Estimated read-aloud time in minutes. */
  readonly readAloudMinutes: number;
  /** One concrete STEM/observation idea the child learns through action. */
  readonly learningTakeaway: string;
  /** One social-emotional skill the story quietly models. */
  readonly heartTakeaway: string;
  /** A true, supportable note for the grown-up reader. */
  readonly grownUpFact: string;
  readonly pages: readonly StoryPage[];
}
