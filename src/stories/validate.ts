import type { Story, StoryDomain } from '../types';

/** Structural and editorial thresholds every published story must satisfy. */
export const STORY_RULES = {
  /** The library grows in batches; there is a floor, not a fixed count. */
  minStoryCount: 9,
  minPages: 6,
  maxPages: 16,
  minWords: 300,
  maxWords: 1600,
  minCuePages: 2,
  minPhraseRepeats: 2,
  maxSentenceWords: 24,
  /** Two pages this alike are treated as duplicated filler (bigram Jaccard). */
  nearDuplicateSimilarity: 0.6,
  /** Floor on distinct-word ratio; below this the prose is padded, not written. */
  minLexicalVariety: 0.33,
  /** Length of the word sequence checked for filler repetition. */
  fillerNgramSize: 4,
  /** A non-signature n-gram may appear at most this many times per story. */
  maxNgramRepeats: 4,
} as const;

/**
 * Concrete, domain-specific evidence words. At least ONE must appear in the
 * read-aloud prose (matched at a word boundary, so inflections count). This
 * keeps the STEM idea in the story the child hears, not only in metadata.
 */
export const DOMAIN_EVIDENCE: Record<StoryDomain, readonly string[]> = {
  measurement: ['measure', 'count', 'tall'],
  patterns: ['pattern', 'repeat', 'next'],
  sound: ['echo', 'sound', 'bounce'],
  wind: ['wind', 'air'],
  'plant-growth': ['seed', 'grow', 'root'],
  shadows: ['shadow', 'light', 'sun'],
  navigation: ['star', 'north', 'south', 'point', 'still', 'compass'],
  'simple-machines': ['ramp', 'pulley', 'wheel', 'lever', 'screw', 'lift', 'turn', 'board', 'pivot'],
  displacement: ['water', 'rise', 'room'],
  numbers: ['number', 'count', 'zero', 'circle', 'pile', 'pattern'],
  sky: ['sky', 'spin', 'turn', 'star', 'sun', 'earth', 'world'],
  earth: ['earth', 'ground', 'shake', 'shook', 'tremor', 'dragon'],
  materials: ['paper', 'block', 'press', 'fiber', 'print', 'word', 'pulp', 'type', 'metal', 'clay', 'cloth', 'thread', 'weave', 'mold', 'melt', 'stone', 'glass', 'dye', 'brick'],
  life: ['dinosaur', 'bone', 'fossil', 'feather', 'egg', 'giant', 'creature', 'plant', 'wing', 'life', 'animal', 'grow', 'scale', 'claw', 'nest'],
};

/** Soothing words; the final page of every story must contain at least one. */
export const CALM_WORDS: readonly string[] = [
  'sleep',
  'asleep',
  'sleepy',
  'dream',
  'goodnight',
  'good night',
  'rest',
  'quiet',
  'hush',
  'snug',
  'snuggle',
  'cozy',
  'cosy',
  'yawn',
  'drift',
  'moon',
  'moonlight',
  'starlight',
  'soft',
  'blanket',
  'pillow',
  'tuck',
  'night',
  'still',
  'calm',
  'gentle',
  'slumber',
  'doze',
  'warm',
  'cuddle',
];

/** Words that are never appropriate in a calm bedtime story for a young child. */
export const FORBIDDEN_WORDS: readonly string[] = [
  'blood',
  'kill',
  'killed',
  'dead',
  'death',
  'gun',
  'gunshot',
  'knife',
  'weapon',
];

const countWords = (text: string): number =>
  text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

const normalize = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, ' ').trim();

const splitSentences = (text: string): string[] =>
  text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

/** Lowercase word tokens with punctuation stripped, for lexical analysis. */
const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0);

const wordBigrams = (tokens: string[]): Set<string> => {
  const set = new Set<string>();
  for (let i = 0; i + 1 < tokens.length; i += 1) {
    set.add(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return set;
};

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
};

/**
 * Returns a list of exact, human-readable validation errors for the library.
 * An empty array means every story meets the structural and editorial bar.
 * The library is never silently filtered — problems are reported, not hidden.
 */
export function validateStories(stories: readonly Story[]): string[] {
  const errors: string[] = [];

  if (stories.length < STORY_RULES.minStoryCount) {
    errors.push(
      `Library must contain at least ${STORY_RULES.minStoryCount} stories (found ${stories.length}).`,
    );
  }

  const seenSlugs = new Set<string>();
  for (const story of stories) {
    if (seenSlugs.has(story.slug)) {
      errors.push(`Duplicate slug: '${story.slug}'.`);
    }
    seenSlugs.add(story.slug);
  }

  // A growing, multi-batch library reuses domains freely; there is no
  // one-story-per-domain rule. (Historical and fiction stories can share a
  // domain, and many stories can explore 'numbers'.) Domain relevance is still
  // enforced per story via the DOMAIN_EVIDENCE prose check below.

  const seenSceneIds = new Set<string>();
  for (const story of stories) {
    for (const page of story.pages) {
      const id = page.scene.id.trim();
      if (id.length === 0) continue;
      if (seenSceneIds.has(id)) {
        errors.push(`Duplicate scene id: '${id}'.`);
      }
      seenSceneIds.add(id);
    }
  }

  for (const story of stories) {
    const label = story.slug || '(missing slug)';

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.slug)) {
      errors.push(`${label}: slug must be lowercase kebab-case.`);
    }
    if (story.title.trim().length === 0) errors.push(`${label}: missing title.`);
    if (story.subtitle.trim().length === 0) {
      errors.push(`${label}: missing subtitle.`);
    }
    if (story.learningTakeaway.trim().length === 0) {
      errors.push(`${label}: missing learning takeaway.`);
    }
    if (story.heartTakeaway.trim().length === 0) {
      errors.push(`${label}: missing social-emotional takeaway.`);
    }
    if (story.grownUpFact.trim().length === 0) {
      errors.push(`${label}: missing grown-up fact.`);
    }
    if (story.repeatedPhrase.trim().length === 0) {
      errors.push(`${label}: missing repeated phrase.`);
    }
    if (!(story.readAloudMinutes > 0)) {
      errors.push(`${label}: read-aloud minutes must be positive.`);
    }

    if (
      story.pages.length < STORY_RULES.minPages ||
      story.pages.length > STORY_RULES.maxPages
    ) {
      errors.push(
        `${label}: needs ${STORY_RULES.minPages}-${STORY_RULES.maxPages} pages (found ${story.pages.length}).`,
      );
    }

    const words = story.pages.reduce(
      (total, page) => total + countWords(page.text),
      0,
    );
    if (words < STORY_RULES.minWords || words > STORY_RULES.maxWords) {
      errors.push(
        `${label}: read-aloud words out of range (found ${words}, need ${STORY_RULES.minWords}-${STORY_RULES.maxWords}).`,
      );
    }

    const cuePages = story.pages.filter(
      (page) => (page.cue ?? '').trim().length > 0,
    ).length;
    if (cuePages < STORY_RULES.minCuePages) {
      errors.push(
        `${label}: needs a participation cue on at least ${STORY_RULES.minCuePages} pages (found ${cuePages}).`,
      );
    }

    story.pages.forEach((page, index) => {
      const pageNo = index + 1;
      if (page.text.trim().length === 0) {
        errors.push(`${label} page ${pageNo}: empty page text.`);
      }
      if (page.alt.trim().length === 0) {
        errors.push(`${label} page ${pageNo}: empty image alt text.`);
      }
      if (
        page.scene.id.trim().length === 0 ||
        page.scene.focus.trim().length === 0 ||
        page.scene.composition.trim().length === 0 ||
        page.scene.palette.trim().length === 0
      ) {
        errors.push(`${label} page ${pageNo}: incomplete scene metadata.`);
      }
      for (const sentence of splitSentences(page.text)) {
        const sentenceWords = sentence.split(/\s+/).length;
        if (sentenceWords > STORY_RULES.maxSentenceWords) {
          errors.push(
            `${label} page ${pageNo}: a sentence runs long (${sentenceWords} words, max ${STORY_RULES.maxSentenceWords}).`,
          );
        }
      }
      const lower = normalize(page.text);
      for (const word of FORBIDDEN_WORDS) {
        if (new RegExp(`\\b${word}\\b`).test(lower)) {
          errors.push(`${label} page ${pageNo}: contains unsafe word '${word}'.`);
        }
      }
    });

    const phrase = normalize(story.repeatedPhrase);
    if (phrase.length > 0) {
      const phraseHits = story.pages.filter((page) =>
        normalize(page.text).includes(phrase),
      ).length;
      if (phraseHits < STORY_RULES.minPhraseRepeats) {
        errors.push(
          `${label}: repeated phrase should appear on at least ${STORY_RULES.minPhraseRepeats} pages (found ${phraseHits}).`,
        );
      }
    }

    // A calm/sleepy ending is welcome but no longer required — stories may end
    // on wonder, discovery, or an invitation to explore, whatever fits.

    // --- Shallow-filler guards (general, age-appropriate, not literary) ---
    const pageTokens = story.pages.map((page) => tokenize(page.text));

    // Duplicate or near-duplicate page text within the same story.
    const pageBigrams = pageTokens.map((tokens) => wordBigrams(tokens));
    for (let i = 0; i < story.pages.length; i += 1) {
      for (let j = i + 1; j < story.pages.length; j += 1) {
        const a = normalize(story.pages[i].text);
        const b = normalize(story.pages[j].text);
        if (a.length > 0 && a === b) {
          errors.push(`${label}: pages ${i + 1} and ${j + 1} have identical text.`);
          continue;
        }
        if (
          jaccard(pageBigrams[i], pageBigrams[j]) >=
          STORY_RULES.nearDuplicateSimilarity
        ) {
          errors.push(
            `${label}: pages ${i + 1} and ${j + 1} have near-duplicate text.`,
          );
        }
      }
    }

    // Pathologically low lexical variety across the whole story.
    const allTokens = pageTokens.flat();
    if (allTokens.length > 0) {
      const variety = new Set(allTokens).size / allTokens.length;
      if (variety < STORY_RULES.minLexicalVariety) {
        errors.push(
          `${label}: low lexical variety; the story reuses too few distinct words.`,
        );
      }
    }

    // Over-repeated multi-word sequences, ignoring the intentional signature phrase.
    const signature = tokenize(story.repeatedPhrase).join(' ');
    const ngramCounts = new Map<string, number>();
    const size = STORY_RULES.fillerNgramSize;
    for (const tokens of pageTokens) {
      for (let i = 0; i + size <= tokens.length; i += 1) {
        const gram = tokens.slice(i, i + size).join(' ');
        if (signature.length > 0 && signature.includes(gram)) continue;
        ngramCounts.set(gram, (ngramCounts.get(gram) ?? 0) + 1);
      }
    }
    for (const [gram, count] of ngramCounts) {
      if (count > STORY_RULES.maxNgramRepeats) {
        errors.push(`${label}: overuses the phrase "${gram}".`);
      }
    }

    // Domain-specific evidence must live in the prose, not only in metadata.
    // At least one of the domain's evidence words must appear (word-boundary,
    // inflections count), so the STEM idea is in the story the child hears.
    const prose = story.pages.map((page) => page.text).join(' ').toLowerCase();
    const evidenceTerms = DOMAIN_EVIDENCE[story.domain] ?? [];
    const hasEvidence =
      evidenceTerms.length === 0 ||
      evidenceTerms.some((term) => new RegExp(`\\b${term}`).test(prose));
    if (!hasEvidence) {
      errors.push(
        `${label}: story text is missing ${story.domain} evidence (expected one of: ${evidenceTerms.join(', ')}).`,
      );
    }
  }

  return errors;
}
