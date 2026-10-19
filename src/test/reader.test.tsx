import { StrictMode, type ComponentProps } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Reader } from '../components/Reader';
import { LearningCenter } from '../learn/LearningCenter';
import { getStory } from '../stories';

const SLUG = 'the-tallest-sunflower';
const story = getStory(SLUG)!;
const PAGE_COUNT = story.pages.length; // 7 story pages; index 7 == completion

const resetUrl = () => {
  window.location.hash = '';
};

/** Deep-link straight into the reader at a 1-based page number. */

beforeEach(resetUrl);
afterEach(() => {
  cleanup();
  resetUrl();
});









describe('Reader component contract (for Task 5)', () => {
  const renderReader = (
    page: number,
    extra: Partial<ComponentProps<typeof Reader>> = {},
  ) => {
    const onNavigate = vi.fn();
    const onExit = vi.fn();
    const onComplete = vi.fn();
    const view = render(
      <Reader
        story={story}
        page={page}
        onNavigate={onNavigate}
        onExit={onExit}
        onComplete={onComplete}
        {...extra}
      />,
    );
    return { onNavigate, onExit, onComplete, ...view };
  };

  afterEach(cleanup);

  it('requests the next page index from the Next control', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderReader(0);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it('requests the previous page index from the Previous control', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderReader(2);
    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it('requests page 0 on restart', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderReader(3);
    await user.click(screen.getByRole('button', { name: /restart|start over/i }));
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('exits from the library control', async () => {
    const user = userEvent.setup();
    const { onExit } = renderReader(1);
    await user.click(screen.getByRole('button', { name: /library/i }));
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('disables the boundary controls at each end', () => {
    const first = renderReader(0);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /finish|next/i })).toBeEnabled();
    cleanup();
    renderReader(PAGE_COUNT);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
    void first;
  });

  it('disables Start over at the first page and enables it later', () => {
    renderReader(0);
    expect(screen.getByRole('button', { name: /start over/i })).toBeDisabled();
    cleanup();
    renderReader(2);
    expect(screen.getByRole('button', { name: /start over/i })).toBeEnabled();
    cleanup();
    renderReader(PAGE_COUNT);
    expect(screen.getByRole('button', { name: /start over/i })).toBeEnabled();
  });

  it('fires onComplete once when the completion view is reached', () => {
    const notDone = renderReader(0);
    expect(notDone.onComplete).not.toHaveBeenCalled();
    cleanup();
    const done = renderReader(PAGE_COUNT);
    expect(done.onComplete).toHaveBeenCalledWith(SLUG);
  });
});



describe.each([
  ['mobile', 375],
  ['desktop', 1280],
])('Reader at %s width (%ipx)', (_label, width) => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
    resetUrl();
  });
  afterEach(() => {
    cleanup();
    resetUrl();
  });

  it('opens and advances a story', async () => {
    // Through the Learning Center's archive route, which replaced the old App.
    const user = userEvent.setup();
    window.history.replaceState(null, '', '#/read/the-altar-built-by-rope/1');
    render(<LearningCenter />);
    expect(screen.getByText(/Page 1 of 10/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Page 2 of 10/i)).toBeInTheDocument();
  });
});
