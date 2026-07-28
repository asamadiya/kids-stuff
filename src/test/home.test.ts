import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App, { PLAIN_ROUTES, toHash } from '../App';
import { pickResume } from '../components/LearningCenterWelcome';
import { PROGRESS_STORAGE_KEY } from '../hooks/useBookProgress';
import { COLLECTION } from '../data/collection';
import { STORIES, getStory } from '../stories';

const INDEX_SOURCE = readFileSync(
  resolve(process.cwd(), 'src/components/LearningCenterWelcome.tsx'),
  'utf8',
);

const STORY = STORIES.find((s) => s.pages.length > 4)!;

const mountIndex = () => {
  window.history.replaceState(null, '', '#/');
  render(createElement(App));
  return screen.getByRole('main');
};

const seedBookmark = (slug: string, page: number) =>
  window.localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({ bookmarks: { [slug]: page }, completed: [] }),
  );

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/');
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

/* -------------------------------------------------------------------------- */
/* The index is an entrance, not the collection                                */
/* -------------------------------------------------------------------------- */

describe('the index renders no story tiles', () => {
  it('shows zero story tiles — fails the moment the collection creeps back onto #/', () => {
    mountIndex();
    // Two independent readings of the same fact, because the tile could come
    // back either as the component or as some other element with its label.
    expect(document.querySelectorAll('.tile').length).toBe(0);
    const readLabels = [...document.querySelectorAll('[aria-label]')].filter((el) =>
      (el.getAttribute('aria-label') ?? '').startsWith('Read '),
    );
    expect(readLabels).toEqual([]);
    expect(screen.queryByRole('heading', { name: /real people who wondered/i })).toBeNull();
  });

  it('is short enough to be an entrance: one heading level 1 and no result count', () => {
    mountIndex();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('status')).toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/* Every way in is a real link                                                 */
/* -------------------------------------------------------------------------- */

describe('every navigational control on the index is an anchor', () => {
  it('has no buttons at all, so nothing can navigate by scrolling', () => {
    // This is the gate that kills the old `scrollToExplorer` CTA specifically:
    // a scroll handler has no href, pushes no history entry, and would show up
    // here as a button. Reverting to it fails this line.
    const main = mountIndex();
    expect(within(main).queryAllByRole('button')).toEqual([]);
    expect(main.querySelectorAll('button')).toHaveLength(0);
  });

  it('points every anchor at a route in the table', () => {
    const main = mountIndex();
    const anchors = [...main.querySelectorAll('a')];
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href') ?? '').toMatch(/^#\//);
    }
  });

  it('offers the seven ways in, each at its own route', () => {
    const main = mountIndex();
    const wanted = [
      PLAIN_ROUTES.shelf,
      PLAIN_ROUTES.timeline,
      PLAIN_ROUTES.map,
      PLAIN_ROUTES.topics,
      PLAIN_ROUTES.places,
      PLAIN_ROUTES.play,
      PLAIN_ROUTES.make,
    ].map(toHash);
    const hrefs = [...main.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    for (const href of wanted) expect(hrefs).toContain(href);
  });

  it('no longer carries the scroll CTA or the props that drove it', () => {
    expect(INDEX_SOURCE).not.toMatch(/scrollIntoView/);
    expect(INDEX_SOURCE).not.toMatch(/onOpenLibrary/);
    expect(INDEX_SOURCE).not.toMatch(/story-explorer/);
  });

  it('adds a history entry and moves the screen, rather than moving the viewport', async () => {
    // The exact failure of the old CTA: it scrolled, so `history.length` never
    // changed and the back gesture did nothing. jsdom implements no
    // `scrollIntoView`, so one is installed here only to prove nothing calls it.
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: scrollIntoView,
    });

    const user = userEvent.setup();
    const main = mountIndex();
    const before = window.history.length;

    await user.click(main.querySelector('a[href="#/shelf"]') as HTMLElement);

    expect(window.location.hash).toBe('#/shelf');
    expect(window.history.length).toBe(before + 1);
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(screen.getByRole('main', { name: /the collection/i })).toBeInTheDocument();

    delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  });
});

/* -------------------------------------------------------------------------- */
/* The count is a fact, and the resume card is the only piece of state         */
/* -------------------------------------------------------------------------- */

describe('the index states what is in the collection', () => {
  it('reads the count off the collection rather than a typed-in number', () => {
    const main = mountIndex();
    expect(within(main).getByText(String(COLLECTION.accounts))).toBeInTheDocument();
    expect(within(main).getByText(String(COLLECTION.places))).toBeInTheDocument();
    expect(INDEX_SOURCE).toMatch(/COLLECTION\.accounts/);
  });
});

describe('the resume card', () => {
  it('is absent when nothing has been started', () => {
    mountIndex();
    expect(screen.queryByText(/where you stopped/i)).toBeNull();
  });

  it('appears with a link straight to the saved page when a bookmark exists', () => {
    seedBookmark(STORY.slug, 3);
    const main = mountIndex();
    expect(within(main).getByText(/where you stopped/i)).toBeInTheDocument();
    const href = toHash({ kind: 'reader', slug: STORY.slug, page: 3 });
    expect(main.querySelector(`a[href="${href}"]`)).not.toBeNull();
    // 0-based in storage, 1-based to a reader.
    expect(href).toBe(`#/read/${STORY.slug}/4`);
  });
});

describe('pickResume', () => {
  const map = (entries: readonly (readonly [string, number])[]) => new Map(entries);

  it('offers nothing when there is nothing usable', () => {
    expect(pickResume(map([]))).toBeNull();
    expect(pickResume(map([['a-slug-that-does-not-exist', 2]]))).toBeNull();
  });

  it('ignores a bookmark at the very start, past the end, or not a whole number', () => {
    const pages = getStory(STORY.slug)!.pages.length;
    expect(pickResume(map([[STORY.slug, 0]]))).toBeNull();
    expect(pickResume(map([[STORY.slug, pages]]))).toBeNull();
    expect(pickResume(map([[STORY.slug, pages + 9]]))).toBeNull();
    expect(pickResume(map([[STORY.slug, 2.5]]))).toBeNull();
  });

  it('offers the most recently started story, with its real page count', () => {
    const other = STORIES.find((s) => s.slug !== STORY.slug && s.pages.length > 4)!;
    const picked = pickResume(map([[STORY.slug, 2], [other.slug, 3]]));
    expect(picked).toEqual({
      slug: other.slug,
      title: other.title,
      page: 3,
      pageCount: other.pages.length,
    });
  });
});
