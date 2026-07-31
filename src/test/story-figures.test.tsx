import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { STORY_FIGURES, storyFigure } from '../components/figures';
import { StoryFigure } from '../components/StoryFigure';
import { STORIES } from '../stories';

/**
 * Diagram pages.
 *
 * What a test in jsdom CAN check: that every id a story names exists, that
 * every figure it registers is actually reached by a story, and that each one
 * is a labelled image rather than an unannounced blob of SVG.
 *
 * What it CANNOT check is whether the drawing is correct or even legible —
 * jsdom has no layout, so `getBBox()` returns zeros and a label lying across
 * the screw thread measures identical to one in clear space. That check lives
 * in `scripts/verify-figures.mjs`, which opens the figures in a real browser,
 * and it is only half the job either: the browser found the first draft's five
 * clipped labels, and a person found the sixth one touching a tooth.
 */
afterEach(cleanup);

const pagesWithFigures = STORIES.flatMap((story) =>
  story.pages.flatMap((page, i) =>
    page.figureId ? [{ slug: story.slug, page: i + 1, figureId: page.figureId }] : [],
  ),
);

describe('story figures', () => {
  it('resolves every figure a story asks for', () => {
    const missing = pagesWithFigures
      .filter((p) => !storyFigure(p.figureId))
      .map((p) => `${p.slug} page ${p.page} -> ${p.figureId}`);
    expect(missing).toEqual([]);
  });

  it('has no registered figure that no story reaches', () => {
    const used = new Set(pagesWithFigures.map((p) => p.figureId));
    expect([...STORY_FIGURES.keys()].filter((id) => !used.has(id))).toEqual([]);
  });

  it('is reached by the story that needed it', () => {
    // The two pages the parent said were missing: how the screw moves, and how
    // the paste gets squeezed.
    expect(pagesWithFigures.map((p) => p.figureId)).toEqual(
      expect.arrayContaining(['olive-screw-and-nut', 'olive-the-squeeze']),
    );
  });

  it('gives a blind reader the same explanation a sighted one gets', () => {
    for (const [id, spec] of STORY_FIGURES) {
      const { container } = render(spec.render());
      const svg = container.querySelector('svg');
      expect(svg, id).not.toBeNull();
      expect(svg?.getAttribute('role'), id).toBe('img');
      // A diagram whose alternative text is "diagram" explains nothing. These
      // describe the mechanism in prose, because that IS the page's content.
      expect((svg?.getAttribute('aria-label') ?? '').length, id).toBeGreaterThan(160);
      cleanup();
    }
  });

  it('carries a caption a grown-up can read out', () => {
    for (const [id, spec] of STORY_FIGURES) {
      expect(spec.caption.length, id).toBeGreaterThan(40);
    }
  });

  it('renders the figure instead of the painting on a figure page', () => {
    const { container } = render(<StoryFigure figureId="olive-screw-and-nut" />);
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });

  it('costs a picture, not the story, when an id is unknown', () => {
    const { container } = render(<StoryFigure figureId="no-such-figure" />);
    expect(container.innerHTML).toBe('');
  });
});
