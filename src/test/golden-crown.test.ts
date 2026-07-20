import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { STORIES, getStory } from '../stories';
import { STORY_RULES } from '../stories/validate';
import { STORY_DOMAINS } from '../types';

/**
 * The Sneaky Golden Crown — canonical story #1, added as the ninth published
 * story. These tests pin the exact product requirements for the release:
 * count, slug/title, the new `displacement` domain, the child-safe concept,
 * the legend framing, a source-backed grown-up fact, and the committed
 * evidence file. Written RED-first: they fail until the story is authored.
 */

const SLUG = 'the-sneaky-golden-crown';
const EVIDENCE_PATH = resolve(
  process.cwd(),
  'content/evidence/the-sneaky-golden-crown.json',
);

const crown = () => {
  const story = getStory(SLUG);
  if (!story) throw new Error(`story "${SLUG}" is not published yet`);
  return story;
};

const storyText = (): string => crown().pages.map((page) => page.text).join(' ');

describe('The Sneaky Golden Crown — library membership', () => {
  it('publishes nine stories in total', () => {
    expect(STORIES).toHaveLength(9);
    expect(STORY_RULES.storyCount).toBe(9);
  });

  it('registers a ninth learning domain: displacement', () => {
    expect(STORY_DOMAINS).toContain('displacement');
    expect(STORY_DOMAINS).toHaveLength(9);
  });

  it('exposes the crown story by its exact slug', () => {
    expect(getStory(SLUG)).toBeDefined();
  });

  it('preserves all eight existing story slugs', () => {
    const slugs = new Set(STORIES.map((s) => s.slug));
    for (const existing of [
      'the-tallest-sunflower',
      'pips-pattern-parade',
      'the-echo-in-the-canyon',
      'nadias-kite-and-the-wind',
      'the-little-bean-seed',
      'chasing-my-shadow',
      'following-the-north-star',
      'the-ramp-to-the-treehouse',
    ]) {
      expect(slugs.has(existing)).toBe(true);
    }
  });
});

describe('The Sneaky Golden Crown — identity and shape', () => {
  it('has the exact title and slug', () => {
    expect(crown().slug).toBe(SLUG);
    expect(crown().title).toBe('The Sneaky Golden Crown');
  });

  it('is in the displacement domain', () => {
    expect(crown().domain).toBe('displacement');
  });

  it('is told across seven picture-book pages', () => {
    expect(crown().pages).toHaveLength(7);
  });

  it('reads roughly 500-600 words (inside the 500-850 validator band)', () => {
    const words = crown()
      .pages.reduce((total, page) => total + page.text.trim().split(/\s+/).length, 0);
    expect(words).toBeGreaterThanOrEqual(500);
    expect(words).toBeLessThanOrEqual(600);
  });

  it('ends calm, on the exact final word "Goodnight."', () => {
    const last = crown().pages[crown().pages.length - 1].text.trim();
    expect(last.split(/\s+/).slice(-1)[0]).toBe('Goodnight.');
  });

  it('repeats one warm phrase three to five times', () => {
    const phrase = crown().repeatedPhrase.toLowerCase();
    const hits = crown().pages.filter((page) =>
      page.text.toLowerCase().includes(phrase),
    ).length;
    expect(hits).toBeGreaterThanOrEqual(3);
    expect(hits).toBeLessThanOrEqual(5);
  });

  it('names its own fictional helper, Delia', () => {
    expect(/\bDelia\b/.test(storyText())).toBe(true);
  });
});

describe('The Sneaky Golden Crown — child-safe concept', () => {
  it('teaches the concept in child words: water rises when something takes up room', () => {
    const text = storyText().toLowerCase();
    expect(text).toMatch(/takes up room/);
    expect(text).toMatch(/water/);
    expect(text).toMatch(/\brise/);
  });

  it('teaches through equal weight and marked waterlines, not formulas', () => {
    const text = storyText().toLowerCase();
    expect(text).toMatch(/weigh the same|equal weight|same weight|weighed just the same/);
    expect(text).toMatch(/mark(ed)? .*line|line/);
  });

  it('never teaches density, buoyancy, or cubic-centimeter formulas in the child prose', () => {
    const text = storyText().toLowerCase();
    expect(text).not.toMatch(/density/);
    expect(text).not.toMatch(/buoyan/);
    expect(text).not.toMatch(/displacement/);
    expect(text).not.toMatch(/g\/cm|cubic/);
    expect(text).not.toMatch(/vitruvius|archimedes/);
  });

  it('frames the crown episode as a legend, not a certain event', () => {
    const text = storyText().toLowerCase();
    expect(text).toMatch(/legend|people told a story|maybe it happened/);
  });

  it('models patient observation and honesty as the heart skill that solves the plot', () => {
    const heart = crown().heartTakeaway.toLowerCase();
    expect(heart).toMatch(/patien|clos|watch|notice/);
    expect(heart).toMatch(/honest|truth/);
    const text = storyText().toLowerCase();
    expect(text).toMatch(/patient|patiently|closely|watched/);
    expect(text).toMatch(/truth|honest/);
  });
});

describe('The Sneaky Golden Crown — grown-up fact is source-backed', () => {
  it('distinguishes the later Vitruvius account and gives gold/silver densities', () => {
    const fact = crown().grownUpFact;
    expect(fact.toLowerCase()).toMatch(/vitruvius/);
    expect(fact.toLowerCase()).toMatch(/legend|not a (recorded|documented)/);
    expect(fact).toMatch(/19\.3/);
    expect(fact).toMatch(/10\.5/);
    expect(fact.toLowerCase()).toMatch(/gold/);
    expect(fact.toLowerCase()).toMatch(/silver/);
  });
});

describe('The Sneaky Golden Crown — committed evidence file', () => {
  const load = (): unknown => {
    if (!existsSync(EVIDENCE_PATH)) {
      throw new Error(`missing evidence file: ${EVIDENCE_PATH}`);
    }
    return JSON.parse(readFileSync(EVIDENCE_PATH, 'utf8'));
  };

  it('exists at content/evidence/the-sneaky-golden-crown.json', () => {
    expect(existsSync(EVIDENCE_PATH)).toBe(true);
  });

  it('is valid JSON keyed to the story slug', () => {
    const data = load() as { slug?: string };
    expect(data.slug).toBe(SLUG);
  });

  it('records the concrete numbers and the Vitruvius/Archimedes distinction', () => {
    const raw = JSON.stringify(load());
    expect(raw).toMatch(/19\.3/);
    expect(raw).toMatch(/10\.5/);
    expect(raw.toLowerCase()).toMatch(/vitruvius/);
    expect(raw.toLowerCase()).toMatch(/archimedes/);
    expect(raw.toLowerCase()).toMatch(/displacement|legend/);
  });

  it('cites at least three authoritative sources, each with a title and an http(s) URL', () => {
    const data = load() as { sources?: Array<{ title?: string; url?: string }> };
    expect(Array.isArray(data.sources)).toBe(true);
    expect(data.sources!.length).toBeGreaterThanOrEqual(3);
    for (const source of data.sources!) {
      expect((source.title ?? '').trim().length).toBeGreaterThan(0);
      expect(source.url ?? '').toMatch(/^https?:\/\//);
    }
  });

  it('holds no long copied excerpts (every string stays concise)', () => {
    const strings: string[] = [];
    const walk = (value: unknown): void => {
      if (typeof value === 'string') strings.push(value);
      else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') Object.values(value).forEach(walk);
    };
    walk(load());
    expect(strings.length).toBeGreaterThan(0);
    for (const text of strings) {
      expect(
        text.length,
        `evidence string is too long (${text.length} chars): ${text.slice(0, 60)}…`,
      ).toBeLessThanOrEqual(300);
    }
  });
});
