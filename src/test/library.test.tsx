import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Library } from '../components/Library';
import { PLAIN_ROUTES } from '../App';
import type { CollectionRoute, Route } from '../App';
import { STORIES } from '../stories';
import { REGIONS } from '../data/meta';

const renderLib = (route: CollectionRoute) => {
  const onOpenStory = vi.fn();
  const onNavigate = vi.fn<(route: Route) => void>();
  render(
    <Library
      stories={STORIES}
      route={route}
      onOpenStory={onOpenStory}
      onNavigate={onNavigate}
      completedSlugs={new Set<string>()}
    />,
  );
  return { onOpenStory, onNavigate };
};

/** Story tiles are buttons whose accessible name is "Read <title>". */
const tiles = () =>
  screen
    .getAllByRole('button')
    .filter((button) => button.getAttribute('aria-label')?.startsWith('Read '));

const REGION_WITH_STORIES = REGIONS[0];

afterEach(cleanup);

/* -------------------------------------------------------------------------- */
/* The collection is the collection, and nothing else                          */
/* -------------------------------------------------------------------------- */

describe('the collection screen', () => {
  it('renders no index content — the ways in live at #/, not here', () => {
    // Fails if the index is folded back into the collection, which is what made
    // #/ eighteen viewports tall and its primary CTA a scroll.
    renderLib(PLAIN_ROUTES.shelf);
    expect(screen.queryByRole('heading', { name: /rikki.s field guide/i })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'By subject' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Workshop' })).toBeNull();
    expect(screen.queryByText(/from the notebook/i)).toBeNull();
  });

  it('names the arrangement it is showing, in the landmark and the heading', () => {
    // Focus lands on the h1 after every route change, so a heading that reads
    // the same on all seven collection routes would make the change silent.
    // Fails if the heading goes back to a constant.
    const headings = new Set<string>();
    for (const route of [
      PLAIN_ROUTES.shelf,
      PLAIN_ROUTES.timeline,
      PLAIN_ROUTES.topics,
      PLAIN_ROUTES.places,
      { kind: 'topic', domain: 'numbers' } as const,
    ]) {
      renderLib(route);
      expect(screen.getByRole('main', { name: /the collection/i })).toBeInTheDocument();
      headings.add(screen.getByRole('heading', { level: 1 }).textContent ?? '');
      cleanup();
    }
    expect(headings.size).toBe(5);
    expect(headings).toContain('By date');
    expect(headings).toContain('Number');
  });

  it('offers all five ways to arrange it', () => {
    renderLib(PLAIN_ROUTES.shelf);
    for (const name of [/shelf/i, /timeline/i, /map/i, /by topic/i, /by place/i]) {
      expect(screen.getByRole('tab', { name })).toBeInTheDocument();
    }
  });

  it('shows both collections and every story on the shelf', () => {
    renderLib(PLAIN_ROUTES.shelf);
    expect(
      screen.getByRole('heading', { name: /real people who wondered/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /make-believe friends/i })).toBeInTheDocument();
    expect(tiles()).toHaveLength(STORIES.length);
  });

  it('shows era bands on the timeline', () => {
    renderLib(PLAIN_ROUTES.timeline);
    expect(screen.getByRole('heading', { name: /Ancient \(1000 BCE/i })).toBeInTheDocument();
  });

  it('opens a story from its tile', async () => {
    const user = userEvent.setup();
    const { onOpenStory } = renderLib(PLAIN_ROUTES.shelf);
    await user.click(tiles()[0]);
    expect(onOpenStory).toHaveBeenCalledTimes(1);
  });

  it('has a way back to the contents', () => {
    renderLib(PLAIN_ROUTES.shelf);
    expect(document.querySelector('a[href="#/"]')).not.toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/* The arrangement and the facet are read off the route, never stored          */
/* -------------------------------------------------------------------------- */

describe('the arrangement comes from the route', () => {
  it('selects the tab the route names', () => {
    renderLib(PLAIN_ROUTES.timeline);
    expect(screen.getByRole('tab', { name: /timeline/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    cleanup();
    renderLib({ kind: 'topic', domain: 'numbers' });
    expect(screen.getByRole('tab', { name: /by topic/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('navigates rather than setting state when an arrangement is chosen', async () => {
    // Fails if the switcher goes back to `setView`: the URL would stop naming
    // the arrangement and Back would not undo the switch.
    const user = userEvent.setup();
    const { onNavigate } = renderLib(PLAIN_ROUTES.shelf);
    await user.click(screen.getByRole('tab', { name: /timeline/i }));
    expect(onNavigate).toHaveBeenCalledWith(PLAIN_ROUTES.timeline);
  });

  it('filters to exactly the subject the route names', () => {
    renderLib({ kind: 'topic', domain: 'numbers' });
    expect(tiles()).toHaveLength(STORIES.filter((s) => s.domain === 'numbers').length);
    expect(screen.getByRole('button', { name: 'Number' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('navigates into a subject when its chip is chosen, and out again when it is chosen twice', async () => {
    const user = userEvent.setup();
    const first = renderLib(PLAIN_ROUTES.topics);
    await user.click(screen.getByRole('button', { name: 'Number' }));
    expect(first.onNavigate).toHaveBeenCalledWith({ kind: 'topic', domain: 'numbers' });

    cleanup();
    const second = renderLib({ kind: 'topic', domain: 'numbers' });
    await user.click(screen.getByRole('button', { name: 'Number' }));
    expect(second.onNavigate).toHaveBeenCalledWith(PLAIN_ROUTES.topics);
  });

  it('navigates into a region when its chip is chosen', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderLib(PLAIN_ROUTES.places);
    await user.click(screen.getByRole('button', { name: REGION_WITH_STORIES }));
    expect(onNavigate).toHaveBeenCalledWith({
      kind: 'place',
      region: REGION_WITH_STORIES,
    });
  });

  it('clears back to the bare arrangement', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderLib({ kind: 'topic', domain: 'numbers' });
    await user.click(screen.getByRole('button', { name: /clear filters/i }));
    expect(onNavigate).toHaveBeenCalledWith(PLAIN_ROUTES.topics);
  });
});
