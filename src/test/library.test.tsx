import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Library } from '../components/Library';
import { STORIES } from '../stories';

const renderLib = () => {
  const onOpenStory = vi.fn();
  const onMakeStory = vi.fn();
  const onPlay = vi.fn();
  render(
    <Library
      stories={STORIES}
      onOpenStory={onOpenStory}
      onMakeStory={onMakeStory}
      onPlay={onPlay}
      completedSlugs={new Set<string>()}
    />,
  );
  return { onOpenStory, onMakeStory, onPlay };
};

/** Story tiles are buttons whose accessible name is "Read <title>". */
const tiles = () =>
  screen
    .getAllByRole('button')
    .filter((button) => button.getAttribute('aria-label')?.startsWith('Read '));

afterEach(cleanup);

describe('Library home', () => {
  it("states what the collection contains", () => {
    renderLib();
    expect(
      screen.getByRole('heading', { level: 1, name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('main', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /colophon: a red panda/i }),
    ).toBeInTheDocument();
  });

  it('offers the library, practice, workshop and subject sections', () => {
    renderLib();
    expect(screen.getByRole('heading', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Practice' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Workshop' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'By subject' })).toBeInTheDocument();
  });

  it('opens Practice from the Practice section', async () => {
    const user = userEvent.setup();
    const { onPlay } = renderLib();
    await user.click(screen.getByRole('button', { name: /open practice/i }));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('opens the Loom from the Workshop section', async () => {
    const user = userEvent.setup();
    const { onMakeStory } = renderLib();
    await user.click(screen.getByRole('button', { name: /open the workshop/i }));
    expect(onMakeStory).toHaveBeenCalledTimes(1);
  });

  it('moves into the topic view when a subject card is chosen', async () => {
    const user = userEvent.setup();
    renderLib();
    await user.click(screen.getByRole('button', { name: /number . see accounts/i }));
    expect(screen.getByRole('tab', { name: /by topic/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(tiles()).toHaveLength(STORIES.filter((s) => s.domain === 'numbers').length);
  });

  it('rotates through the notebook', async () => {
    const user = userEvent.setup();
    renderLib();
    expect(screen.getByText(/the word mathematics comes from/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /next note/i }));
    expect(screen.queryByText(/the word mathematics comes from/i)).not.toBeInTheDocument();
    expect(screen.getByText(/honeybees use a waggle dance/i)).toBeInTheDocument();
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
    await user.click(screen.getByRole('button', { name: 'Number' }));
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
    expect(await screen.findByRole('heading', { name: 'Number' })).toBeInTheDocument();
  });

  it('opens a story from its tile', async () => {
    const user = userEvent.setup();
    const { onOpenStory } = renderLib();
    await user.click(tiles()[0]);
    expect(onOpenStory).toHaveBeenCalledTimes(1);
  });
});
