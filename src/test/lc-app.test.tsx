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
  { kind: 'stories', page: 1 },
  { kind: 'stories', page: 2 },
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
    act(() => screen.getByRole('button', { name: /close/i }).click());
  });

  it('home offers exactly the four ways in', () => {
    at({ kind: 'home' });
    const nav = screen.getByRole('navigation', { name: 'Choose' });
    expect(nav.querySelectorAll('a').length).toBe(4);
  });
});
