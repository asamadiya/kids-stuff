import { StrictMode } from 'react';
import {
  render,
  screen,
  cleanup,
  act,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { getStory } from '../stories';
import { useBookProgress, PROGRESS_STORAGE_KEY } from '../hooks/useBookProgress';

const SLUG = 'the-tallest-sunflower';
const OTHER_SLUG = 'pips-pattern-parade';
const story = getStory(SLUG)!;
const PAGE_COUNT = story.pages.length; // 7 story pages; index 7 == completion

const resetUrl = () => {
  window.location.hash = '';
};

const readStored = (): { bookmarks: Record<string, number>; completed: string[] } =>
  JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}');

beforeEach(() => {
  window.localStorage.clear();
  resetUrl();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
  resetUrl();
});

/* -------------------------------------------------------------------------- */
/* useBookProgress — guarded, versioned persistence                            */
/* -------------------------------------------------------------------------- */

describe('useBookProgress persistence', () => {
  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.bookmarks.size).toBe(0);
    expect(result.current.completedSlugs.size).toBe(0);
    expect(result.current.getBookmark(SLUG)).toBeUndefined();
  });

  it('saves and reads a bookmark under the versioned key', () => {
    const { result } = renderHook(() => useBookProgress());
    act(() => result.current.saveBookmark(SLUG, 3));
    expect(result.current.getBookmark(SLUG)).toBe(3);
    expect(result.current.bookmarks.get(SLUG)).toBe(3);
    expect(readStored().bookmarks[SLUG]).toBe(3);
  });

  it('clears a bookmark', () => {
    const { result } = renderHook(() => useBookProgress());
    act(() => result.current.saveBookmark(SLUG, 2));
    act(() => result.current.clearBookmark(SLUG));
    expect(result.current.getBookmark(SLUG)).toBeUndefined();
    expect(readStored().bookmarks[SLUG]).toBeUndefined();
  });

  it('records completion deterministically and idempotently', () => {
    const { result } = renderHook(() => useBookProgress());
    act(() => result.current.markComplete(SLUG));
    act(() => result.current.markComplete(SLUG));
    expect([...result.current.completedSlugs]).toEqual([SLUG]);
    expect(readStored().completed).toEqual([SLUG]);
  });

  it('hydrates previously stored progress on mount', () => {
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 4 }, completed: [OTHER_SLUG] }),
    );
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.getBookmark(SLUG)).toBe(4);
    expect(result.current.completedSlugs.has(OTHER_SLUG)).toBe(true);
  });

  it('ignores unreadable/corrupt stored JSON and starts fresh', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, '{not valid json');
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.bookmarks.size).toBe(0);
    expect(result.current.completedSlugs.size).toBe(0);
    expect(warn).toHaveBeenCalled();
  });
});

describe('useBookProgress storage failures never break reading', () => {
  it('falls back to in-memory state and warns when reads throw', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const getItem = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage blocked');
      });
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.completedSlugs.size).toBe(0);
    expect(warn).toHaveBeenCalled();
    getItem.mockRestore();
    act(() => result.current.markComplete(SLUG));
    expect(result.current.completedSlugs.has(SLUG)).toBe(true);
  });

  it('keeps updating in memory and warns only once when writes throw', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    const { result } = renderHook(() => useBookProgress());
    act(() => result.current.saveBookmark(SLUG, 1));
    act(() => result.current.saveBookmark(SLUG, 2));
    act(() => result.current.markComplete(SLUG));
    expect(result.current.getBookmark(SLUG)).toBe(2);
    expect(result.current.completedSlugs.has(SLUG)).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

/* -------------------------------------------------------------------------- */
/* useBookProgress — storage diagnostics warn instead of failing silently      */
/* -------------------------------------------------------------------------- */

describe('useBookProgress storage diagnostics', () => {
  it('warns when the localStorage getter itself throws (access blocked)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const getter = vi
      .spyOn(window, 'localStorage', 'get')
      .mockImplementation(() => {
        throw new Error('access denied');
      });
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.bookmarks.size).toBe(0);
    expect(result.current.completedSlugs.size).toBe(0);
    expect(warn).toHaveBeenCalled();
    getter.mockRestore();
  });

  it('warns on a non-empty payload with the wrong shape and starts fresh', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify([1, 2, 3]));
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.bookmarks.size).toBe(0);
    expect(result.current.completedSlugs.size).toBe(0);
    expect(warn).toHaveBeenCalled();
  });

  it('warns when a sub-field has the wrong shape and starts fresh', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: 'nope', completed: 5 }),
    );
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.bookmarks.size).toBe(0);
    expect(result.current.completedSlugs.size).toBe(0);
    expect(warn).toHaveBeenCalled();
  });

  it('warns when invalid entries are dropped but keeps the valid ones', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        bookmarks: { [SLUG]: 2, bad: 'x', neg: -4, frac: 1.5 },
        completed: [OTHER_SLUG, 7, { nope: true }],
      }),
    );
    const { result } = renderHook(() => useBookProgress());
    expect(result.current.getBookmark(SLUG)).toBe(2);
    expect(result.current.getBookmark('bad')).toBeUndefined();
    expect(result.current.getBookmark('neg')).toBeUndefined();
    expect(result.current.getBookmark('frac')).toBeUndefined();
    expect([...result.current.completedSlugs]).toEqual([OTHER_SLUG]);
    expect(warn).toHaveBeenCalled();
  });

  it('does not warn for a valid, clean payload', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 2 }, completed: [OTHER_SLUG] }),
    );
    renderHook(() => useBookProgress());
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns only once for corrupt JSON even under StrictMode double-mount', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, '{not valid json');
    renderHook(() => useBookProgress(), { wrapper: StrictMode });
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

/* -------------------------------------------------------------------------- */
/* App integration — resume, completion, and completed styling                 */
/* -------------------------------------------------------------------------- */

const cardFor = (title: string): HTMLElement => {
  const button = screen.getByRole('button', {
    name: new RegExp(`^Read ${title}( again)?$`, 'i'),
  });
  const card = button.closest('article');
  if (!card) throw new Error(`no <article> wraps the card titled "${title}"`);
  return card as HTMLElement;
};

describe('App resumes from bookmarks and records completion', () => {
  it('resumes a story at its saved page when opened from the library', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 2 }, completed: [] }),
    );
    render(<App />);
    await user.click(
      screen.getByRole('button', { name: new RegExp(`read ${story.title}`, 'i') }),
    );
    expect(screen.getByText(/Page 3 of 7/i)).toBeInTheDocument();
  });

  it('saves a bookmark as the reader advances through the story', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/1`;
    render(<App />);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    expect(readStored().bookmarks[SLUG]).toBe(1);
  });

  it('marks a story completed and clears its bookmark after finishing', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 5 }, completed: [] }),
    );
    window.location.hash = `#/read/${SLUG}/${PAGE_COUNT}`;
    render(<App />);
    await user.click(screen.getByRole('button', { name: /finish/i }));
    expect(screen.getByRole('heading', { name: /the end/i })).toBeInTheDocument();
    const stored = readStored();
    expect(stored.completed).toContain(SLUG);
    expect(stored.bookmarks[SLUG]).toBeUndefined();
  });

  it('shows a finished story as completed back in the library', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/${PAGE_COUNT}`;
    render(<App />);
    await user.click(screen.getByRole('button', { name: /finish/i }));
    await user.click(screen.getByRole('button', { name: /back to library|library/i }));
    expect(cardFor(story.title)).toHaveAttribute('data-completed', 'true');
  });

  it('does not break when localStorage is unavailable', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('no storage');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('no storage');
    });
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/${PAGE_COUNT}`;
    expect(() => render(<App />)).not.toThrow();
    await user.click(screen.getByRole('button', { name: /finish/i }));
    expect(screen.getByRole('heading', { name: /the end/i })).toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
  });
});

/* -------------------------------------------------------------------------- */
/* App ignores nonsensical bookmarks when opening a known story                */
/* -------------------------------------------------------------------------- */

describe('App ignores nonsensical bookmarks when opening a story', () => {
  const openFromLibrary = (user: ReturnType<typeof userEvent.setup>) =>
    user.click(
      screen.getByRole('button', { name: new RegExp(`read ${story.title}`, 'i') }),
    );

  it('ignores and clears a bookmark at the completion index — never opens completion', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: PAGE_COUNT }, completed: [] }),
    );
    render(<App />);
    await openFromLibrary(user);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /the end/i })).toBeNull();
    // Completion persistence must never fire for an invalid resume.
    expect(readStored().completed).not.toContain(SLUG);
    expect(readStored().bookmarks[SLUG]).toBeUndefined();
  });

  it('ignores and clears an out-of-range huge bookmark', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 999 }, completed: [] }),
    );
    render(<App />);
    await openFromLibrary(user);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /the end/i })).toBeNull();
    expect(readStored().completed).not.toContain(SLUG);
    expect(readStored().bookmarks[SLUG]).toBeUndefined();
  });

  it('ignores and clears a page-0 bookmark', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 0 }, completed: [] }),
    );
    render(<App />);
    await openFromLibrary(user);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    expect(readStored().bookmarks[SLUG]).toBeUndefined();
  });

  it('ignores a non-integer bookmark and resumes from the start', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 3.5 }, completed: [] }),
    );
    render(<App />);
    await openFromLibrary(user);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /the end/i })).toBeNull();
  });

  it('still resumes a valid in-range bookmark unchanged', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({ bookmarks: { [SLUG]: 3 }, completed: [] }),
    );
    render(<App />);
    await openFromLibrary(user);
    expect(screen.getByText(/Page 4 of 7/i)).toBeInTheDocument();
  });
});
