import { render, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, it, expect } from 'vitest';
import { Scene } from '../illustrations/Scene';
import { STORIES } from '../stories';
import type { Story, StoryPage } from '../types';

afterEach(cleanup);

interface PageCase {
  readonly story: Story;
  readonly page: StoryPage;
  readonly index: number;
}

const allPages: PageCase[] = STORIES.flatMap((story) =>
  story.pages.map((page, index) => ({ story, page, index })),
);

/**
 * Strip instance-specific ids and internal references so two renders can be
 * compared purely on their drawn composition (geometry, palette, motifs).
 */
const artFingerprint = (svg: SVGSVGElement): string => {
  const art = svg.querySelector('[data-scene-art]');
  const markup = art ? art.innerHTML : '';
  return markup
    .replace(/\sid="[^"]*"/g, '')
    .replace(/url\(#[^)]*\)/g, 'url(#)')
    .replace(/(?:xlink:)?href="#[^"]*"/g, 'href="#"')
    .replace(/\s+/g, ' ')
    .trim();
};

const renderScene = (story: Story, page: StoryPage, motionEnabled = false) => {
  const { container } = render(
    <Scene story={story} page={page} motionEnabled={motionEnabled} />,
  );
  const svg = container.querySelector('svg');
  if (!svg) throw new Error('Scene did not render an <svg> root');
  return { container, svg: svg as unknown as SVGSVGElement };
};

describe('Scene illustration contract', () => {
  it('covers all nine stories and every one of the 63 pages', () => {
    expect(STORIES).toHaveLength(9);
    expect(allPages).toHaveLength(63);
  });

  describe.each(allPages)('$story.slug — page $index', ({ story, page }) => {
    it('renders an <svg> with role="img"', () => {
      const { svg } = renderScene(story, page);
      expect(svg.getAttribute('role')).toBe('img');
    });

    it('gives the image an accessible name taken from the page alt text', () => {
      const { container } = render(
        <Scene story={story} page={page} motionEnabled={false} />,
      );
      const img = container.querySelector('[role="img"]');
      expect(img).not.toBeNull();
      const labelId = img!.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      const label = container.querySelector(`#${CSS.escape(labelId!)}`);
      expect(label?.textContent).toBe(page.alt);
    });

    it('exposes the scene id so the reader can key on it', () => {
      const { svg } = renderScene(story, page);
      expect(svg.getAttribute('data-scene-id')).toBe(page.scene.id);
    });

    it('emits no undefined or NaN in its static markup', () => {
      const { container } = renderScene(story, page);
      expect(container.innerHTML).not.toMatch(/undefined/);
      expect(container.innerHTML).not.toMatch(/NaN/);
    });

    it('bakes no readable text glyphs into the artwork', () => {
      const { svg } = renderScene(story, page);
      const art = svg.querySelector('[data-scene-art]');
      expect(art).not.toBeNull();
      expect(art!.querySelector('text')).toBeNull();
      expect(art!.querySelector('tspan')).toBeNull();
      expect(art!.querySelector('foreignObject')).toBeNull();
    });

    it('only references gradient/filter ids that it actually defines', () => {
      const { svg } = renderScene(story, page);
      const defined = new Set(
        Array.from(svg.querySelectorAll('[id]')).map((el) => el.id),
      );
      const refs = [...svg.innerHTML.matchAll(/url\(#([^)]+)\)/g)].map(
        (match) => match[1],
      );
      for (const ref of refs) {
        expect(defined.has(ref)).toBe(true);
      }
    });

    it('draws a complete illustration even with motion disabled', () => {
      const { svg } = renderScene(story, page, false);
      const shapes = svg.querySelectorAll(
        'path, circle, ellipse, rect, polygon, polyline, line',
      );
      expect(shapes.length).toBeGreaterThan(14);
    });

    it('serializes to well-formed, parseable SVG XML', () => {
      const markup = renderToStaticMarkup(
        <Scene story={story} page={page} motionEnabled={false} />,
      );
      const doc = new DOMParser().parseFromString(
        markup,
        'application/xml',
      );
      expect(doc.querySelector('parsererror')).toBeNull();
      const root = doc.documentElement;
      expect(root.tagName.toLowerCase()).toBe('svg');
      expect(root.getAttribute('role')).toBe('img');
      // Guard against empty path data or dangling references slipping through.
      for (const path of Array.from(doc.querySelectorAll('path'))) {
        expect((path.getAttribute('d') ?? '').trim().length).toBeGreaterThan(0);
      }
    });

    it('keeps every id unique inside a single render', () => {
      const { svg } = renderScene(story, page);
      const ids = Array.from(svg.querySelectorAll('[id]')).map((el) => el.id);
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('keeps ids unique across two Scenes rendered at once', () => {
    const { story, page } = allPages[0];
    const { container } = render(
      <>
        <Scene story={story} page={page} motionEnabled={false} />
        <Scene story={story} page={page} motionEnabled />
      </>,
    );
    const ids = Array.from(container.querySelectorAll('[id]')).map((el) => el.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('renders a visually distinct composition for all 63 pages', () => {
    const seen = new Map<string, string>();
    for (const { story, page } of allPages) {
      const { svg } = renderScene(story, page);
      const fingerprint = artFingerprint(svg);
      expect(fingerprint.length).toBeGreaterThan(0);
      const previous = seen.get(fingerprint);
      expect(
        previous,
        `duplicate composition: ${story.slug}/${page.scene.id} matches ${previous}`,
      ).toBeUndefined();
      seen.set(fingerprint, `${story.slug}/${page.scene.id}`);
      cleanup();
    }
    expect(seen.size).toBe(63);
  });

  it('treats motionEnabled as a stable hook without changing the artwork', () => {
    const { story, page } = allPages[0];
    const still = renderScene(story, page, false);
    const stillMotion = still.svg.getAttribute('data-motion');
    const stillArt = artFingerprint(still.svg);
    cleanup();
    const moving = renderScene(story, page, true);
    expect(stillMotion).toBe('off');
    expect(moving.svg.getAttribute('data-motion')).toBe('on');
    expect(artFingerprint(moving.svg)).toBe(stillArt);
  });
});
