import { describe, it, expect } from 'vitest';
import { STORIES, getStory } from '../stories';
import {
  validateStories,
  STORY_RULES,
  CALM_WORDS,
  FORBIDDEN_WORDS,
} from '../stories/validate';
import type { Story, StoryPage } from '../types';

const wordCount = (text: string): number =>
  text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

const readAloudWords = (story: Story): number =>
  story.pages.reduce((total, page) => total + wordCount(page.text), 0);

const cuePageCount = (story: Story): number =>
  story.pages.filter((page) => (page.cue ?? '').trim().length > 0).length;

const normalize = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, ' ').trim();

describe('story library content', () => {
  it('publishes at least the minimum number of stories', () => {
    expect(STORIES.length).toBeGreaterThanOrEqual(STORY_RULES.minStoryCount);
  });

  it('uses unique slugs', () => {
    const slugs = STORIES.map((story) => story.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('ships the first historical batch alongside the fiction shelf', () => {
    const historical = STORIES.filter((story) => story.collection === 'historical');
    const fiction = STORIES.filter((story) => story.collection === 'fiction');
    expect(historical.length).toBeGreaterThanOrEqual(11);
    expect(fiction.length).toBeGreaterThanOrEqual(9);
  });

  it('passes full validation with no errors', () => {
    expect(validateStories(STORIES)).toEqual([]);
  });

  it('getStory finds a story by slug and returns undefined otherwise', () => {
    const first = STORIES[0];
    expect(getStory(first.slug)).toBe(first);
    expect(getStory('no-such-story')).toBeUndefined();
  });

  for (const story of STORIES) {
    describe(`story: ${story.slug}`, () => {
      it('has 6-8 picture-book pages', () => {
        expect(story.pages.length).toBeGreaterThanOrEqual(STORY_RULES.minPages);
        expect(story.pages.length).toBeLessThanOrEqual(STORY_RULES.maxPages);
      });

      it('has 500-850 read-aloud words', () => {
        const words = readAloudWords(story);
        expect(words).toBeGreaterThanOrEqual(STORY_RULES.minWords);
        expect(words).toBeLessThanOrEqual(STORY_RULES.maxWords);
      });

      it('invites participation on at least two pages', () => {
        expect(cuePageCount(story)).toBeGreaterThanOrEqual(STORY_RULES.minCuePages);
      });

      it('gives every page non-empty image alt text', () => {
        for (const page of story.pages) {
          expect(page.alt.trim().length).toBeGreaterThan(0);
        }
      });

      it('gives every page complete scene metadata', () => {
        const ids = story.pages.map((page) => page.scene.id);
        expect(new Set(ids).size).toBe(ids.length);
        for (const page of story.pages) {
          expect(page.scene.id.trim().length).toBeGreaterThan(0);
          expect(page.scene.focus.trim().length).toBeGreaterThan(0);
          expect(page.scene.composition.trim().length).toBeGreaterThan(0);
          expect(page.scene.palette.trim().length).toBeGreaterThan(0);
        }
      });

      it('carries one concrete learning takeaway and a grown-up fact', () => {
        expect(story.learningTakeaway.trim().length).toBeGreaterThan(0);
        expect(story.grownUpFact.trim().length).toBeGreaterThan(0);
        expect(story.heartTakeaway.trim().length).toBeGreaterThan(0);
      });

      it('repeats its memorable phrase on at least two pages', () => {
        const phrase = normalize(story.repeatedPhrase);
        const hits = story.pages.filter((page) =>
          normalize(page.text).includes(phrase),
        ).length;
        expect(hits).toBeGreaterThanOrEqual(STORY_RULES.minPhraseRepeats);
      });

      it('ends on a calm final page', () => {
        const finalText = normalize(story.pages[story.pages.length - 1].text);
        expect(CALM_WORDS.some((word) => finalText.includes(word))).toBe(true);
      });

      it('keeps every read-aloud sentence short', () => {
        for (const page of story.pages) {
          const sentences = page.text
            .split(/[.!?]+/)
            .map((sentence) => sentence.trim())
            .filter((sentence) => sentence.length > 0);
          for (const sentence of sentences) {
            expect(sentence.split(/\s+/).length).toBeLessThanOrEqual(
              STORY_RULES.maxSentenceWords,
            );
          }
        }
      });

      it('avoids frightening vocabulary', () => {
        for (const page of story.pages) {
          const lower = normalize(page.text);
          for (const word of FORBIDDEN_WORDS) {
            expect(new RegExp(`\\b${word}\\b`).test(lower)).toBe(false);
          }
        }
      });
    });
  }
});

describe('validateStories', () => {
  it('returns an empty array for the published library', () => {
    expect(validateStories(STORIES)).toEqual([]);
  });

  it('flags a library below the minimum story count', () => {
    const errors = validateStories(STORIES.slice(0, 5));
    expect(errors).toContain('Library must contain at least 9 stories (found 5).');
  });

  it('flags duplicate slugs', () => {
    const duplicated = STORIES.map((story, index) =>
      index === 1 ? { ...story, slug: STORIES[0].slug } : story,
    );
    expect(validateStories(duplicated)).toContain(
      "Duplicate slug: 'the-tallest-sunflower'.",
    );
  });

  it('flags a story with too few pages', () => {
    const broken = STORIES.map((story, index) =>
      index === 0 ? { ...story, pages: story.pages.slice(0, 3) } : story,
    );
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: needs 6-8 pages (found 3).',
    );
  });

  it('flags a story outside the 300-850 word range', () => {
    const tiny: StoryPage = { ...STORIES[0].pages[0], text: 'Too short.' };
    const broken = STORIES.map((story, index) =>
      index === 0 ? { ...story, pages: [tiny] } : story,
    );
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: read-aloud words out of range (found 2, need 300-850).',
    );
  });

  it('flags fewer than two participation cues', () => {
    const broken = STORIES.map((story, index) =>
      index === 0
        ? { ...story, pages: story.pages.map((page) => ({ ...page, cue: undefined })) }
        : story,
    );
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: needs a participation cue on at least 2 pages (found 0).',
    );
  });

  it('flags empty image alt text', () => {
    const broken = STORIES.map((story, index) =>
      index === 0
        ? {
            ...story,
            pages: story.pages.map((page, pageIndex) =>
              pageIndex === 0 ? { ...page, alt: '' } : page,
            ),
          }
        : story,
    );
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower page 1: empty image alt text.',
    );
  });

  it('flags a missing learning takeaway', () => {
    const broken = STORIES.map((story, index) =>
      index === 0 ? { ...story, learningTakeaway: '   ' } : story,
    );
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: missing learning takeaway.',
    );
  });

  it('flags a final page that is not calm', () => {
    const broken = STORIES.map((story, index) => {
      if (index !== 0) return story;
      const pages = story.pages.map((page, pageIndex) =>
        pageIndex === story.pages.length - 1
          ? { ...page, text: 'Then the loud drum went BANG and everyone leaped and cheered.' }
          : page,
      );
      return { ...story, pages };
    });
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: final page does not end calmly.',
    );
  });
});

// ---------------------------------------------------------------------------
// Task 2 review-fix regression guards (written RED-first for the fix wave).
// ---------------------------------------------------------------------------

const storyText = (story: Story): string =>
  story.pages.map((page) => page.text).join(' ');

/** The declared cast for each story; used to catch cross-story name leaks. */
const PROTAGONISTS: Record<string, readonly string[]> = {
  'the-tallest-sunflower': ['Milo', 'Rosa'],
  'pips-pattern-parade': ['Pip', 'Ada'],
  'the-echo-in-the-canyon': ['Theo', 'Juno'],
  'nadias-kite-and-the-wind': ['Nadia'],
  'the-little-bean-seed': ['Sam', 'Nana'],
  'chasing-my-shadow': ['Leo'],
  'following-the-north-star': ['Mira', 'Ben'],
  'the-ramp-to-the-treehouse': ['Kwame', 'Ana'],
  'the-sneaky-golden-crown': ['Delia'],
};

describe('character-name consistency', () => {
  it('names every declared protagonist somewhere in its own story', () => {
    for (const story of STORIES) {
      const cast = PROTAGONISTS[story.slug] ?? [];
      const text = storyText(story);
      for (const name of cast) {
        expect(new RegExp(`\\b${name}\\b`).test(text)).toBe(true);
      }
    }
  });

  it('never leaks a protagonist name from another story (e.g. Ada into Ana\'s story)', () => {
    // Scoped to the original nine authored stories whose casts are declared
    // above; the wider library legitimately reuses common given names.
    const everyName = new Set(Object.values(PROTAGONISTS).flat());
    for (const slug of Object.keys(PROTAGONISTS)) {
      const story = getStory(slug)!;
      const own = new Set(PROTAGONISTS[slug] ?? []);
      const text = storyText(story);
      for (const name of everyName) {
        if (own.has(name)) continue;
        const leaked = new RegExp(`\\b${name}\\b`).test(text);
        expect({ slug: story.slug, name, leaked }).toEqual({
          slug: story.slug,
          name,
          leaked: false,
        });
      }
    }
  });

  it('keeps Ada in her own story and Ana in the ramp story', () => {
    expect(/\bAda\b/.test(storyText(getStory('pips-pattern-parade')!))).toBe(true);
    const ramp = storyText(getStory('the-ramp-to-the-treehouse')!);
    expect(/\bAna\b/.test(ramp)).toBe(true);
    expect(/\bAda\b/.test(ramp)).toBe(false);
  });
});

describe('the-ramp-to-the-treehouse teaches a real pulley', () => {
  const rampText = (): string =>
    storyText(getStory('the-ramp-to-the-treehouse')!).toLowerCase();

  it('shows a wheel-and-axle pulley, not a bare rope thrown over a branch', () => {
    expect(rampText()).toMatch(/\bwheel\b/);
    expect(rampText()).not.toMatch(/rope over a branch/);
  });

  it('teaches that a fixed pulley changes the direction you pull', () => {
    expect(rampText()).toMatch(/pull down/);
  });

  it('teaches that the pulley does not make the load lighter', () => {
    expect(rampText()).toMatch(/not make the basket lighter|just as heavy|not lighter/);
  });
});

describe('nadias-kite-and-the-wind has correct launch geometry', () => {
  const kite = () => getStory('nadias-kite-and-the-wind')!;
  const kiteText = (): string => storyText(kite()).toLowerCase();

  it("puts the flyer's back to the wind", () => {
    expect(kiteText()).toMatch(/back to the wind/);
  });

  it('presents the kite into the wind and releases it downwind', () => {
    expect(kiteText()).toMatch(/downwind/);
    expect(kiteText()).not.toMatch(/turned around to face the wind/);
  });

  it('keeps the lesson that wind is moving air', () => {
    expect(kite().grownUpFact.toLowerCase()).toMatch(/\bair\b/);
    expect(kiteText()).toMatch(
      /you cannot see the wind, but you can see what it moves/,
    );
  });

  it('learningTakeaway states the flyer has wind at their back, not that the flyer faces into the wind', () => {
    const takeaway = kite().learningTakeaway.toLowerCase();
    // Must NOT say the flyer faces into the wind (the old incorrect text)
    expect(takeaway).not.toMatch(/you turn to face into/);
    // Must say the flyer stands with the wind at their back
    expect(takeaway).toMatch(/wind at your back|back to the wind|wind.*at.*back|back.*wind/);
  });
});

describe('grown-up facts stay factual and STEM-focused', () => {
  it('the-tallest-sunflower drops the disputed "foot" origin and teaches standard units', () => {
    const fact = getStory('the-tallest-sunflower')!.grownUpFact.toLowerCase();
    expect(fact).not.toMatch(/really did begin as the length of a grown-up foot/);
    expect(fact).toMatch(/standard|centimeter/);
  });

  it('pips-pattern-parade drops the unverified prehistoric claim', () => {
    const fact = getStory('pips-pattern-parade')!.grownUpFact.toLowerCase();
    expect(fact).not.toMatch(/long before writing|clay pots/);
    expect(fact).toMatch(/count by twos/);
  });

  it('the-ramp-to-the-treehouse states correct pulley physics without a broad historical claim', () => {
    const fact = getStory('the-ramp-to-the-treehouse')!.grownUpFact.toLowerCase();
    expect(fact).not.toMatch(/thousands of years/);
    expect(fact).toMatch(/direction/);
    expect(fact).toMatch(/axle|grooved wheel|wheel that turns|wheel on/);
  });
});

describe('validateStories rejects shallow filler', () => {
  const mutateFirst = (mutate: (story: Story) => Story): readonly Story[] =>
    STORIES.map((story, index) => (index === 0 ? mutate(story) : story));

  it('rejects duplicate page text within a story', () => {
    const broken = mutateFirst((story) => ({
      ...story,
      pages: story.pages.map((page, index) =>
        index === 1 ? { ...page, text: story.pages[0].text } : page,
      ),
    }));
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: pages 1 and 2 have identical text.',
    );
  });

  it('rejects near-duplicate page text within a story', () => {
    const broken = mutateFirst((story) => ({
      ...story,
      pages: story.pages.map((page, index) =>
        index === 1
          ? { ...page, text: `${story.pages[0].text} The night was calm.` }
          : page,
      ),
    }));
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: pages 1 and 2 have near-duplicate text.',
    );
  });

  it('rejects pathologically low lexical variety', () => {
    const broken = mutateFirst((story) => ({
      ...story,
      pages: story.pages.map((page, index) => ({
        ...page,
        text: `${Array(70 + index).fill('sleepy').join(' ')}.`,
      })),
    }));
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: low lexical variety; the story reuses too few distinct words.',
    );
  });

  it('rejects an over-repeated multi-word phrase (n-gram filler)', () => {
    const filler = `${Array(6)
      .fill('The moon was bright')
      .join('. ')}. It watched the sleepy town below with a soft and gentle glow.`;
    const broken = mutateFirst((story) => ({
      ...story,
      pages: story.pages.map((page, index) =>
        index === 0 ? { ...page, text: filler } : page,
      ),
    }));
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: overuses the phrase "the moon was bright".',
    );
  });

  it('requires domain-specific evidence terms in the prose, not only metadata', () => {
    const genericPages = [
      'The kitchen smelled of warm bread and honey.',
      'A gentle rain tapped softly on the window glass.',
      'The old cat curled up beside the glowing lamp.',
      'Outside, the garden slept under a blanket of dew.',
      'A single candle flickered in the quiet hallway.',
      'The kettle sang a low and friendly little song.',
      'At last the house grew hushed and cozy for sleep.',
    ];
    const broken = mutateFirst((story) => ({
      ...story,
      pages: story.pages.map((page, index) => ({
        ...page,
        text: genericPages[index] ?? page.text,
      })),
    }));
    expect(validateStories(broken)).toContain(
      'the-tallest-sunflower: story text is missing measurement evidence (expected one of: measure, count, tall).',
    );
  });
});
