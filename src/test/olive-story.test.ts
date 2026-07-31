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

/** The pages that carry a painting. 3, 7, 9 and 11 carry diagrams. */
const PAINTED = [1, 2, 4, 5, 6, 8, 10, 12, 13];

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

describe('the story says how each machine works, because that is what it is for', () => {
  const pages = story.pages.map((p) => p.text);

  it('explains how the stone moves, not just that it moved', () => {
    // Draft three had "Grandfather pushed its handle, and the stone rolled" and
    // nothing else. That is a sentence, not a mechanism. Three things carry it:
    // it is too heavy to lift, it is round so it rolls, and a post holds it
    // rolling in a circle while its own weight does the crushing.
    const stone = pages[2]; // page 3
    expect(stone).toMatch(/too heavy to lift/);
    expect(stone).toMatch(/roll/);
    expect(stone).toMatch(/post/);
    expect(stone).toMatch(/circle/);
    expect(stone).toMatch(/own weight/);
  });

  it('makes her fail by pushing DOWN, which is the mistake a child actually makes', () => {
    // The contradiction in draft three: she pushed the bar on page 4 and failed,
    // then pushed the bar on page 7 and succeeded. Pushing a bar sideways IS
    // turning the screw, so the story argued against itself on the one point it
    // was explaining. Her failure has to be the obvious wrong idea — I want it
    // to go down, so I will push it down.
    // It also has to be something a six-year-old could physically attempt. An
    // earlier version had her push down on the screw head — which the same book
    // calls "taller than Grandfather", so she cannot reach it, and the art model
    // was right to refuse to draw it. She pushes on the lid, at her own height.
    const fail = pages[4]; // page 5
    expect(fail).toMatch(/pushed down/);
    expect(fail).toMatch(/both hands/);
    // and the bar must not appear yet, or the contradiction is back
    expect(fail).not.toMatch(/\bbar\b/);
  });

  it('explains why turning it makes it go down, not merely that it does', () => {
    const nut = pages[6]; // page 7
    expect(nut).toMatch(/groove/);
    expect(nut).toMatch(/ridge/);
    expect(nut).toMatch(/beam/);
    expect(nut).toMatch(/cannot move|is bolted/);
    expect(nut).toMatch(/lid/); // anchored to something already turned
  });

  it('explains how SHE turns it, which the thread alone does not', () => {
    // The thread explains why turning descends. It does not explain why a child
    // can turn a screw her bare hands could not. That is the lever, and draft
    // three simply skipped it.
    const lever = pages[8]; // page 9
    expect(lever).toMatch(/where you push/i);
    expect(lever).toMatch(/close in/i);
    expect(lever).toMatch(/end/);
  });

  it('explains how the paste actually gives up its oil', () => {
    const squeeze = pages[10]; // page 11
    expect(squeeze).toMatch(/woven|weave/);
    expect(squeeze).toMatch(/gaps/);
    expect(squeeze).toMatch(/oil/);
    expect(squeeze).toMatch(/mush|pulp|stayed/);
  });

  it('sets the weave up before it has to pay off', () => {
    expect(pages[3]).toMatch(/woven loose/); // page 4
  });

  it('gives the grandfather one lesson and has her say it back', () => {
    // Otherwise he is a prop who explains things. He says the same seven words
    // at the stone and at the screw; she says them on the last page, which is
    // the only line in the book that shows she understood any of it.
    const said = pages.filter((t) => t.includes('let it do the work')
                                  || t.includes('Let it do the work'));
    expect(said.length).toBeGreaterThanOrEqual(3);
    expect(pages[2]).toMatch(/“Let it do the work,” said Grandfather/);
    expect(pages[12]).toMatch(/I let it do the work/);
  });

  it('puts a diagram on each machine page, not a painting', () => {
    expect(story.pages[2].figureId).toBe('olive-the-stone');
    expect(story.pages[6].figureId).toBe('olive-screw-and-nut');
    expect(story.pages[8].figureId).toBe('olive-the-long-bar');
    expect(story.pages[10].figureId).toBe('olive-the-squeeze');
    const painted = story.pages.flatMap((p, i) => (p.figureId ? [] : [i + 1]));
    expect(painted).toEqual(PAINTED);
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
    const hinge = pages[5]; // page 6: she finds the ridge
    expect(hinge).not.toMatch(/up a hill/);
    expect(hinge).toMatch(/round and round/);
    expect(hinge).toMatch(/straight down/);
  });

  it('lets the child reach the idea, rather than being told it', () => {
    // A reviewer measured this against The Most Magnificent Thing and Rosie
    // Revere: "the girl does not really puzzle, test, adjust or discover;
    // Grandfather explains, she obeys, it works." The insight sentence and the
    // decision that follows from it are hers.
    expect(pages[5]).toMatch(/she said/);  // page 6: the insight is hers
    expect(pages[12]).toMatch(/she said/); // page 13: and so is the conclusion
  });

  it('keeps every sentence sayable', () => {
    for (const [i, text] of pages.entries()) {
      for (const sentence of text.split(/(?<=[.!?”])\s+/)) {
        expect(words(sentence), `page ${i + 1}: ${sentence}`).toBeLessThan(22);
      }
    }
  });
});
