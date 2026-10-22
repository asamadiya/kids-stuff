import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { LearningCenter, knownRoutes } from '../learn/LearningCenter';
import { toHash } from '../learn/routes';
import type { Route } from '../learn/routes';
import { BOOKS, SHELVES } from '../books/registry';
import { SUBJECTS, ARCHIVE } from '../learn/library';
import { SITUATIONS } from '../learn/situations';
import { MATHS_GAMES } from '../maths/registry';
import { SCIENCE_GAMES } from '../science/registry';
import { ACTIVITIES } from '../make/activities';
import { IDEAS } from '../together';
import { ENTRIES } from '../learn/catalog';

/**
 * The parent's rule, as a test: every screen "always has notes for parents on
 * what to expect from that". Mount the real app at every kind of address and
 * require a For grown-ups button and a heading, with no crash.
 */

afterEach(() => {
  cleanup();
  window.location.hash = '';
});

function at(route: Route) {
  window.history.replaceState(null, '', toHash(route));
  return render(<LearningCenter />);
}

const ROUTES: Route[] = [
  { kind: 'home' },
  { kind: 'stories' },
  ...SHELVES.map((s): Route => ({ kind: 'shelf', shelf: s.id })),
  ...BOOKS.slice(0, 6).map((b): Route => ({ kind: 'book', slug: b.slug, page: 0 })),
  ...BOOKS.slice(0, 3).map((b): Route => ({ kind: 'book', slug: b.slug, page: b.pages.length })),
  { kind: 'library' },
  ...SUBJECTS.map((s): Route => ({ kind: 'subject', subject: s.id })),
  { kind: 'read', slug: ARCHIVE[0].slug, page: 0 },
  ...SITUATIONS.slice(0, 4).map((s): Route => ({ kind: 'situation', id: s.id })),
  { kind: 'maths' },
  ...MATHS_GAMES.map((g): Route => ({ kind: 'mathsGame', id: g.id })),
  { kind: 'science' },
  ...SCIENCE_GAMES.map((g): Route => ({ kind: 'scienceGame', id: g.id })),
  { kind: 'make' },
  ...ACTIVITIES.map((a): Route => ({ kind: 'activity', id: a.id })),
  { kind: 'together' },
  ...IDEAS.map((x): Route => ({ kind: 'idea', id: x.id })),
  { kind: 'all' },
];

describe('every screen of the Learning Center', () => {
  it.each(ROUTES.map((r) => [toHash(r), r] as const))('%s renders with a grown-ups note', (_hash, route) => {
    at(route);
    expect(screen.getAllByRole('button', { name: /for grown-ups/i }).length).toBeGreaterThanOrEqual(1);
    expect(document.querySelector('h1, h2')).not.toBeNull();
  });

  it('knows every registered item as a route', () => {
    const k = knownRoutes();
    expect(k.books.size).toBe(BOOKS.length);
    expect(k.maths.size).toBe(MATHS_GAMES.length);
    expect(k.science.size).toBe(SCIENCE_GAMES.length);
  });

  it('opens the grown-ups panel with this item’s note and closes it again', () => {
    at({ kind: 'mathsGame', id: MATHS_GAMES[0].id });
    const btn = screen.getAllByRole('button', { name: /for grown-ups/i })[0];
    act(() => btn.click());
    expect(screen.getByText(MATHS_GAMES[0].note.honest)).toBeTruthy();
    const dialog = document.querySelector('dialog[open]') as HTMLElement;
    act(() => (dialog.querySelector('.grownups__close') as HTMLButtonElement).click());
    expect(document.querySelector('dialog[open]')).toBeNull();
  });

  it('home offers five doors and, under them, a link to every item but the library stories', () => {
    at({ kind: 'home' });
    const nav = screen.getByRole('navigation', { name: 'Choose' });
    expect(nav.querySelectorAll('a').length).toBe(5);
    const hrefs = new Set([...document.querySelectorAll('.dir a')].map((a) => a.getAttribute('href')));
    const missing = ENTRIES.filter((e) => e.kind !== 'Longer read-aloud' && !hrefs.has(e.href)).map((e) => e.href);
    expect(missing).toEqual([]);
    for (const s of SUBJECTS) expect(hrefs.has(`#/library/${s.id}`), s.id).toBe(true);
  });

  it('every listing carries the part navigation, and every item a Home link', () => {
    at({ kind: 'make' });
    expect(screen.getByRole('navigation', { name: 'Parts of the Learning Center' })).toBeTruthy();
    cleanup();
    at({ kind: 'mathsGame', id: MATHS_GAMES[0].id });
    expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThanOrEqual(1);
  });

  it('lists the whole centre on the Everything page, the library included', () => {
    at({ kind: 'all' });
    expect(document.querySelectorAll('.index a').length).toBe(ENTRIES.length);
    expect(ENTRIES.filter((e) => e.kind === 'Longer read-aloud').length).toBe(ARCHIVE.length);
  });

  it('shows every activity on the Make & Do hub and every idea on the Play hub, with no paging', () => {
    at({ kind: 'make' });
    expect(document.querySelectorAll('.cards a').length).toBe(ACTIVITIES.length);
    cleanup();
    window.sessionStorage.clear();
    at({ kind: 'together' });
    expect(document.querySelectorAll('.cards a').length).toBe(IDEAS.length);
  });
});
