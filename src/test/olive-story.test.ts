import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { theScrewThatSqueezedTheOlives as story } from '../stories/the-screw-that-squeezed-the-olives';

/**
 * This story was rejected three times by the person it was made for: once for
 * prose a five-year-old could not follow over pictures showing other scenes,
 * once because "every page has a different perspective of the screw", and once
 * because it "still doesn't tell me how the screw moves and how the olive
 * paste gets squeezed".
 *
 * The first fix was written into a scratch prompt file rather than into the
 * story, so nothing held it — reviewers counting threads afterwards found four
 * different screws, a grandfather with and without a beard, and a girl who
 * became a different child on page 11. These assertions put each lock where it
 * cannot fall out silently.
 */

/** The pages that carry a painting. 6 and 8 carry hand-authored diagrams. */
const PAINTED = [1, 2, 3, 4, 5, 7, 9, 10];

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
   * constant across renders. Consistency here is a human judgement, and the
   * only honest mechanism is to make a person look and record that they did.
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
    for (const page of PAINTED) {
      const file = `public/art/the-screw-that-squeezed-the-olives/page-${page}.png`;
      const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
      if (approved[`page-${page}`] !== hash) drift.push(`page-${page}`);
    }
    // A redrawn page invalidates the look that approved it.
    expect(drift).toEqual([]);
  });

  it('approves the painted pages and no others', () => {
    const approved = JSON.parse(readFileSync(APPROVAL, 'utf8')) as Record<string, string>;
    const pages = Object.keys(approved).filter((k) => k.startsWith('page-')).sort();
    // A stale approval for a page that is now a diagram would keep a deleted
    // image "signed off" and hide the fact that nobody looked at its
    // replacement.
    expect(pages).toEqual(PAINTED.map((p) => `page-${p}`).sort());
  });
});

describe('the story says how the machine works, because that is what it is for', () => {
  const pages = story.pages.map((p) => p.text);

  it('explains why turning it makes it go down, not merely that it does', () => {
    // The rejection: "much better but still doesn't tell me how the screw
    // moves". The story had "round and down" four times and no cause. The
    // cause is a fixed nut: the ridge must follow a groove that runs round
    // and down, because the beam it is cut into cannot move.
    const nut = pages[5]; // page 6
    expect(nut).toMatch(/groove/);
    expect(nut).toMatch(/ridge/);
    expect(nut).toMatch(/beam/);
    expect(nut).toMatch(/cannot move|is fixed/);
    // and it must be anchored to something the child has already turned
    expect(nut).toMatch(/lid/);
  });

  it('explains how the paste actually gives up its oil', () => {
    // The other half: "and how the olive paste gets squeezed". Squashing is
    // not an explanation; the weave is. The basket is a filter — the oil fits
    // through the gaps and the pulp does not.
    const squeeze = pages[7]; // page 8
    expect(squeeze).toMatch(/woven|weave/);
    expect(squeeze).toMatch(/gaps/);
    expect(squeeze).toMatch(/oil/);
    // the pulp staying behind is the half that makes it a filter, not a leak
    expect(squeeze).toMatch(/mush|pulp|stayed/);
  });

  it('sets the weave up before it has to pay off', () => {
    // Page 8 can only land if the child already knows the baskets are open.
    expect(pages[2]).toMatch(/woven loose/);
  });

  it('puts a diagram on each of those two pages, not a painting', () => {
    expect(story.pages[5].figureId).toBe('olive-screw-and-nut');
    expect(story.pages[7].figureId).toBe('olive-the-squeeze');
    const painted = story.pages.flatMap((p, i) => (p.figureId ? [] : [i + 1]));
    expect(painted).toEqual(PAINTED);
  });

  it('names the trade that makes a child strong enough', () => {
    const walk = pages[6]; // page 7
    expect(walk).toMatch(/long way/);
    expect(walk).toMatch(/thumb/); // a distance a five-year-old can picture
  });
});

describe('the words are for a five-year-old, read aloud', () => {
  const pages = story.pages.map((p) => p.text);
  const words = (t: string) => t.split(/\s+/).filter(Boolean).length;

  it('runs about forty-five words a page, between caption and essay', () => {
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
    expect(contracted.length).toBeGreaterThanOrEqual(3);
  });

  it('never says the screw goes up, on the page that explains it goes down', () => {
    // The hinge page once read "a path up a hill" while its own cue said
    // "going downwards", on the one page carrying the physics.
    const hinge = pages[4]; // page 5: she finds the ridge
    expect(hinge).not.toMatch(/up a hill/);
    expect(hinge).toMatch(/round and round/);
    expect(hinge).toMatch(/straight down/);
  });

  it('lets the child reach the idea, rather than being told it', () => {
    // A reviewer measured this against The Most Magnificent Thing and Rosie
    // Revere: "the girl does not really puzzle, test, adjust or discover;
    // Grandfather explains, she obeys, it works." The insight sentence and the
    // decision that follows from it are hers.
    expect(pages[4]).toMatch(/she said/); // page 5: she finds it
    expect(pages[6]).toMatch(/she said/); // page 7: she acts on it
    expect(pages[6]).not.toMatch(/he said\. “Walk it\.”/);
  });

  it('keeps every sentence sayable', () => {
    for (const [i, text] of pages.entries()) {
      for (const sentence of text.split(/(?<=[.!?”])\s+/)) {
        expect(words(sentence), `page ${i + 1}: ${sentence}`).toBeLessThan(22);
      }
    }
  });
});
