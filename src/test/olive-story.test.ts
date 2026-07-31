import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { theScrewThatSqueezedTheOlives as story } from '../stories/the-screw-that-squeezed-the-olives';

/**
 * This story was rejected twice by the person it was made for: once for prose
 * a five-year-old could not follow over pictures showing other scenes, once
 * because "every page has a different perspective of the screw".
 *
 * The second fix was written into a scratch prompt file rather than into the
 * story, so nothing held it — reviewers counting threads afterwards found four
 * different screws, a grandfather with and without a beard, and a girl who
 * became a different child on page 11. These assertions put the lock where it
 * cannot fall out silently.
 */

describe('the art is reviewed by a person, because no test here can see it', () => {
  /**
   * What used to be here asserted `toMatch(/EXACTLY EIGHT broad flat spiral
   * turns/)` — a regex over the prompt string, under a title claiming the press
   * was one machine. It was green while the delivered images ranged from seven
   * turns to eleven, with four different screw heads and four different
   * pressing plates. A passing test that cannot fail on the defect it names is
   * worse than no test: it manufactures confidence.
   *
   * The endpoint is text-to-image only (`images/generations`; `images/edits`
   * returns api_not_supported), so nothing in the pipeline can hold geometry
   * constant across twelve renders. Consistency here is a human judgement, and
   * the only honest mechanism is to make a person look and record that they
   * did — which is what the wide-view gate does elsewhere in this repo.
   */
  const APPROVAL = 'artifacts/olive-art-approved.json';

  it('has an approval on file for exactly the images that are on disk', () => {
    if (!existsSync(APPROVAL)) {
      throw new Error(
        'No approval on file. Run `npm run verify:olive`, LOOK at the contact sheet, ' +
        'then record the approval. Do not add a string assertion here instead.',
      );
    }
    const approved = JSON.parse(readFileSync(APPROVAL, 'utf8')) as Record<string, string>;
    const drift: string[] = [];
    for (let page = 1; page <= 8; page += 1) {
      const file = `public/art/the-screw-that-squeezed-the-olives/page-${page}.png`;
      const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
      if (approved[`page-${page}`] !== hash) drift.push(`page-${page}`);
    }
    // A redrawn page invalidates the look that approved it.
    expect(drift).toEqual([]);
  });
});

describe('the words are for a five-year-old, read aloud', () => {
  const pages = story.pages.map((p) => p.text);
  const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

  it('runs about forty words a page, between caption and essay', () => {
    const counts = pages.map(words);
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    // Draft 1 was 72 (rejected as overly complex); draft 2 was 28 (rejected as
    // sparse, "doesn't tell a story").
    expect(mean).toBeGreaterThan(35);
    expect(mean).toBeLessThan(55);
  });

  it('speaks in contractions, because a grandfather is not a Latin primer', () => {
    const spoken = pages.join(' ').match(/“[^”]*”/g) ?? [];
    const contracted = spoken.filter((q) => /’(s|t|re|ll|ve|m)\b/.test(q));
    // Eight pages carry six spoken lines; three of them can contract and do.
    expect(contracted.length).toBeGreaterThanOrEqual(3);
  });

  it('never says the screw goes up, on the page that explains it goes down', () => {
    // The hinge page once read "a path up a hill" while its own cue said
    // "going downwards", on the one page carrying the physics.
    const hinge = pages[4]; // page 5: she finds the line on the screw
    expect(hinge).not.toMatch(/up a hill/);
    // The idea, in her words: round instead of straight down.
    expect(hinge).toMatch(/round and round/);
    expect(hinge).toMatch(/straight down/);
  });

  it('lets the child reach the idea, rather than being told it', () => {
    // A reviewer measured this against The Most Magnificent Thing and Rosie
    // Revere: "the girl does not really puzzle, test, adjust or discover;
    // Grandfather explains, she obeys, it works." The insight sentence and the
    // decision that follows from it are hers now.
    const hinge = pages[4]; // page 5: she finds it
    const turn = pages[5];  // page 6: she acts on it
    expect(hinge).toMatch(/she said/);
    expect(turn).toMatch(/she said/);
    // and the grandfather no longer delivers the instruction
    expect(turn).not.toMatch(/he said\. “Walk it\.”/);
  });

  it('keeps every sentence sayable', () => {
    for (const [i, text] of pages.entries()) {
      for (const sentence of text.split(/(?<=[.!?”])\s+/)) {
        expect(words(sentence), `page ${i + 1}: ${sentence}`).toBeLessThan(22);
      }
    }
  });
});
