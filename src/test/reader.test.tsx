import { StrictMode, type ComponentProps } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { Reader } from '../components/Reader';
import { getStory } from '../stories';

const SLUG = 'the-tallest-sunflower';
const story = getStory(SLUG)!;
const PAGE_COUNT = story.pages.length; // 7 story pages; index 7 == completion

const resetUrl = () => {
  window.location.hash = '';
};

/** Deep-link straight into the reader at a 1-based page number. */
const openApp = (page1Based: number) => {
  window.location.hash = `#/read/${SLUG}/${page1Based}`;
  render(<App />);
};

beforeEach(resetUrl);
afterEach(() => {
  cleanup();
  resetUrl();
});

describe('Reader flow (through the app)', () => {
  it('opens a story at its first page with picture and text', () => {
    openApp(1);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByText(/You grew all night/i)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: story.pages[0].alt }),
    ).toBeInTheDocument();
  });

  it('keeps the read-aloud text outside the illustration', () => {
    openApp(1);
    const paragraph = screen.getByText(/You grew all night/i);
    expect(paragraph.closest('svg')).toBeNull();
  });

  it('shows a participation cue when the page has one', () => {
    openApp(2);
    expect(screen.getByText(story.pages[1].cue!)).toBeInTheDocument();
  });

  it('advances to the next page with the Next control', async () => {
    const user = userEvent.setup();
    openApp(1);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Milo pressed his two flat hands/i),
    ).toBeInTheDocument();
  });

  it('returns to the previous page with the Previous control', async () => {
    const user = userEvent.setup();
    openApp(2);
    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
  });

  it('disables Previous on the first page', () => {
    openApp(1);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('turns pages with the ArrowRight and ArrowLeft keys', () => {
    openApp(1);
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
  });

  it('restarts back to the first page from a later page', async () => {
    const user = userEvent.setup();
    openApp(4);
    expect(screen.getByText(/Page 4 of 7/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /restart|start over/i }));
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
  });

  it('returns to the library from the reader', async () => {
    const user = userEvent.setup();
    openApp(2);
    expect(
      screen.queryByRole('heading', { name: /rikki.s field guide/i }),
    ).toBeNull();
    await user.click(screen.getByRole('button', { name: /library/i }));
    expect(
      screen.getByRole('heading', { level: 1, name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Page 2 of 7/i)).toBeNull();
  });

  it('labels the final page control as Finish and reveals the completion view', async () => {
    const user = userEvent.setup();
    openApp(PAGE_COUNT); // last story page (index 6)
    const finish = screen.getByRole('button', { name: /finish/i });
    await user.click(finish);
    expect(screen.getByRole('region', { name: /you finished/i })).toBeInTheDocument();
    expect(screen.getByText(story.learningTakeaway)).toBeInTheDocument();
    expect(screen.getByText(story.grownUpFact)).toBeInTheDocument();
    expect(screen.getByText(/what else could we measure/i)).toBeInTheDocument();
  });

  it('treats the completion view as a disabled Next boundary', () => {
    openApp(PAGE_COUNT + 1); // completion index 7
    expect(screen.getByRole('region', { name: /you finished/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('can step back from completion to the last story page', async () => {
    const user = userEvent.setup();
    openApp(PAGE_COUNT + 1);
    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(screen.getByText(/Page 7 of 7/i)).toBeInTheDocument();
  });

  it('restarts the story from the completion view', async () => {
    const user = userEvent.setup();
    openApp(PAGE_COUNT + 1);
    await user.click(screen.getByRole('button', { name: /restart|start over/i }));
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
  });

  it('sends unknown story slugs back to the library', () => {
    window.location.hash = '#/read/not-a-real-story/1';
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Page 1 of 7/i)).toBeNull();
  });

  it('clamps an out-of-range page onto the completion view', () => {
    openApp(999);
    expect(screen.getByRole('region', { name: /you finished/i })).toBeInTheDocument();
  });
});

describe('Reader keyboard navigation guards', () => {
  it('does not turn the page while text is selected (non-collapsed selection)', () => {
    openApp(2);
    const selection = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue({
        isCollapsed: false,
        rangeCount: 1,
        toString: () => 'a selected phrase',
      } as unknown as Selection);
    try {
      fireEvent.keyDown(document.body, { key: 'ArrowRight' });
      expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    } finally {
      selection.mockRestore();
    }
  });

  it('does not turn the page when the key target is contenteditable', () => {
    openApp(2);
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    document.body.appendChild(editable);
    try {
      fireEvent.keyDown(editable, { key: 'ArrowRight' });
      expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    } finally {
      editable.remove();
    }
  });

  it('does not turn the page when the key target has role="textbox"', () => {
    openApp(2);
    const textbox = document.createElement('div');
    textbox.setAttribute('role', 'textbox');
    document.body.appendChild(textbox);
    try {
      fireEvent.keyDown(textbox, { key: 'ArrowRight' });
      expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    } finally {
      textbox.remove();
    }
  });

  it('does not turn the page when the key target is a form input', () => {
    openApp(2);
    const input = document.createElement('input');
    document.body.appendChild(input);
    try {
      fireEvent.keyDown(input, { key: 'ArrowRight' });
      expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    } finally {
      input.remove();
    }
  });

  it('does not turn the page when a modifier or Shift is held', () => {
    openApp(2);
    fireEvent.keyDown(document.body, { key: 'ArrowRight', shiftKey: true });
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    fireEvent.keyDown(document.body, { key: 'ArrowRight', metaKey: true });
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
  });
});

describe('App hash routing resilience', () => {
  it('falls back to the library for a malformed percent-encoded hash', () => {
    window.location.hash = '#/read/%E0%A4%A/1';
    expect(() => render(<App />)).not.toThrow();
    expect(
      screen.getByRole('heading', { level: 1, name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Page 1 of 7/i)).toBeNull();
  });
});

describe('Reader Start over boundary (through the app)', () => {
  it('disables Start over on the first page', () => {
    openApp(1);
    expect(screen.getByRole('button', { name: /start over/i })).toBeDisabled();
  });

  it('enables Start over on a later page', () => {
    openApp(3);
    expect(screen.getByRole('button', { name: /start over/i })).toBeEnabled();
  });

  it('enables Start over on the completion view', () => {
    openApp(PAGE_COUNT + 1);
    expect(screen.getByRole('button', { name: /start over/i })).toBeEnabled();
  });
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

describe('Reader completion signalling (onComplete)', () => {
  const baseProps = (
    page: number,
    extra: Partial<ComponentProps<typeof Reader>> = {},
  ): ComponentProps<typeof Reader> => ({
    story,
    page,
    onNavigate: vi.fn(),
    onExit: vi.fn(),
    ...extra,
  });

  afterEach(cleanup);

  it('fires onComplete exactly once on entry and never again on rerender', () => {
    const onComplete = vi.fn();
    const { rerender } = render(
      <Reader {...baseProps(PAGE_COUNT, { onComplete, announce: () => {} })} />,
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(SLUG);

    // Rerendering at the same completion view must not re-signal completion.
    rerender(
      <Reader {...baseProps(PAGE_COUNT, { onComplete, announce: () => {} })} />,
    );
    rerender(
      <Reader {...baseProps(PAGE_COUNT, { onComplete, announce: () => {} })} />,
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not depend on the announce callback identity to gate completion', () => {
    const onComplete = vi.fn();
    const { rerender } = render(
      <Reader {...baseProps(PAGE_COUNT, { onComplete, announce: vi.fn() })} />,
    );
    // A brand-new announce identity each render must not re-fire onComplete.
    for (let i = 0; i < 3; i += 1) {
      rerender(
        <Reader {...baseProps(PAGE_COUNT, { onComplete, announce: vi.fn() })} />,
      );
    }
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('fires onComplete once under StrictMode double-invocation', () => {
    const onComplete = vi.fn();
    render(
      <StrictMode>
        <Reader {...baseProps(PAGE_COUNT, { onComplete })} />
      </StrictMode>,
    );
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('signals once per transition into completion', () => {
    const onComplete = vi.fn();
    const { rerender } = render(
      <Reader {...baseProps(PAGE_COUNT - 1, { onComplete })} />,
    );
    expect(onComplete).not.toHaveBeenCalled();

    rerender(<Reader {...baseProps(PAGE_COUNT, { onComplete })} />);
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Stepping back and re-entering completion is a new transition.
    rerender(<Reader {...baseProps(PAGE_COUNT - 1, { onComplete })} />);
    rerender(<Reader {...baseProps(PAGE_COUNT, { onComplete })} />);
    expect(onComplete).toHaveBeenCalledTimes(2);
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
    const user = userEvent.setup();
    openApp(1);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
  });
});
