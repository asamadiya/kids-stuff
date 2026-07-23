import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Library } from '../components/Library';
import { STORIES } from '../stories';

const renderLib = () => {
  const onOpenStory = vi.fn();
  render(
    <Library stories={STORIES} onOpenStory={onOpenStory} completedSlugs={new Set<string>()} />,
  );
  return { onOpenStory };
};

/** Story tiles are buttons whose accessible name is "Read <title>". */
const tiles = () => screen.getAllByRole('button', { name: /^Read / });

afterEach(cleanup);

describe('Library home', () => {
  it('shows the hero title and the Story library landmark', () => {
    renderLib();
    expect(screen.getByRole('heading', { level: 1, name: /moonlit storybook/i })).toBeInTheDocument();
    expect(screen.getByRole('main', { name: /story library/i })).toBeInTheDocument();
  });

  it('offers all five ways to explore', () => {
    renderLib();
    for (const name of [/shelf/i, /timeline/i, /map/i, /by topic/i, /by place/i]) {
      expect(screen.getByRole('tab', { name })).toBeInTheDocument();
    }
  });

  it('defaults to the shelf with both collections and every story', () => {
    renderLib();
    expect(screen.getByRole('heading', { name: /real people who wondered/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /make-believe friends/i })).toBeInTheDocument();
    expect(tiles()).toHaveLength(STORIES.length);
  });

  it('filters the set when a topic chip is toggled', async () => {
    const user = userEvent.setup();
    renderLib();
    const before = tiles().length;
    await user.click(screen.getByRole('button', { name: 'Numbers' }));
    const after = tiles().length;
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(before);
    expect(after).toBe(STORIES.filter((s) => s.domain === 'numbers').length);
  });

  it('switches to the timeline view and shows era bands', async () => {
    const user = userEvent.setup();
    renderLib();
    await user.click(screen.getByRole('tab', { name: /timeline/i }));
    expect(await screen.findByRole('heading', { name: /Ancient \(1000 BCE/i })).toBeInTheDocument();
  });

  it('groups by topic when the by-topic view is chosen', async () => {
    const user = userEvent.setup();
    renderLib();
    await user.click(screen.getByRole('tab', { name: /by topic/i }));
    expect(await screen.findByRole('heading', { name: 'Numbers' })).toBeInTheDocument();
  });

  it('opens a story from its tile', async () => {
    const user = userEvent.setup();
    const { onOpenStory } = renderLib();
    await user.click(tiles()[0]);
    expect(onOpenStory).toHaveBeenCalledTimes(1);
  });
});
