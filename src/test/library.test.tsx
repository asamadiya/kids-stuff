import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Library } from '../components/Library';
import { STORIES, getStory } from '../stories';

// A story with a title unique across both collections, so lookups are unambiguous.
const PICK = 'the-tallest-sunflower';

interface Overrides {
  tonightPickSlug?: string;
  completedSlugs?: ReadonlySet<string>;
}

const renderLibrary = (overrides: Overrides = {}) => {
  const onOpenStory = vi.fn();
  render(
    <Library
      stories={STORIES}
      onOpenStory={onOpenStory}
      tonightPickSlug={overrides.tonightPickSlug ?? PICK}
      completedSlugs={overrides.completedSlugs ?? new Set<string>()}
    />,
  );
  return { onOpenStory };
};

/** The card is one button; find it by its "Read <title>" accessible name. */
const cardFor = (title: string): HTMLElement => {
  const button = screen.getByRole('button', { name: new RegExp(`^Read ${title}( again)?$`, 'i') });
  const card = button.closest('article');
  if (!card) throw new Error(`no <article> wraps the card titled "${title}"`);
  return card as HTMLElement;
};

afterEach(cleanup);

describe('Library', () => {
  it('shows the editorial hero title', () => {
    renderLibrary();
    expect(
      screen.getByRole('heading', { level: 1, name: /moonlit storybook/i }),
    ).toBeInTheDocument();
  });

  it('exposes a Story library main landmark', () => {
    renderLibrary();
    expect(screen.getByRole('main', { name: /story library/i })).toBeInTheDocument();
  });

  it('renders exactly one cover card per story', () => {
    renderLibrary();
    expect(screen.getAllByRole('article')).toHaveLength(STORIES.length);
  });

  it('groups stories into a true-tales and a storyland shelf', () => {
    renderLibrary();
    expect(screen.getByRole('heading', { name: /real people who wondered/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /make-believe friends/i })).toBeInTheDocument();
  });

  it('offers quick jump links to each shelf', () => {
    renderLibrary();
    const nav = screen.getByRole('navigation', { name: /jump to a shelf/i });
    expect(within(nav).getByRole('link', { name: /true tales/i })).toHaveAttribute('href', '#true-tales');
    expect(within(nav).getByRole('link', { name: /storyland/i })).toHaveAttribute('href', '#storyland');
  });

  it('labels the chosen story as Tonight’s pick', () => {
    renderLibrary({ tonightPickSlug: PICK });
    const card = cardFor(getStory(PICK)!.title);
    expect(within(card).getByText(/tonight.?s pick/i)).toBeInTheDocument();
  });

  it('shows the learning-domain label on a card', () => {
    renderLibrary();
    const card = cardFor(getStory(PICK)!.title);
    expect(within(card).getByText('Measuring')).toBeInTheDocument();
  });

  it('uses each story’s first-page alt text for its cover image', () => {
    renderLibrary();
    const pick = getStory(PICK)!;
    const card = cardFor(pick.title);
    expect(within(card).getByRole('img', { name: pick.pages[0].alt })).toBeInTheDocument();
  });

  it('opens a story when the whole card is activated', async () => {
    const user = userEvent.setup();
    const { onOpenStory } = renderLibrary();
    const card = cardFor(getStory(PICK)!.title);
    await user.click(within(card).getByRole('button'));
    expect(onOpenStory).toHaveBeenCalledWith(PICK);
    expect(onOpenStory).toHaveBeenCalledTimes(1);
  });

  it('marks completed stories and offers a read-again control', () => {
    renderLibrary({ completedSlugs: new Set([PICK]) });
    const card = cardFor(getStory(PICK)!.title);
    expect(card).toHaveAttribute('data-completed', 'true');
    expect(within(card).getByRole('button')).toHaveAccessibleName(/again/i);
  });

  it('leaves unread stories without the completion hook', () => {
    renderLibrary({ completedSlugs: new Set([PICK]) });
    const card = cardFor('The Sneaky Golden Crown');
    expect(card).toHaveAttribute('data-completed', 'false');
    expect(within(card).getByRole('button')).not.toHaveAccessibleName(/again/i);
  });
});

describe('Library collections', () => {
  it('separates historical (counted) stories from fiction', () => {
    const hist = STORIES.filter((s) => s.collection === 'historical');
    const fic = STORIES.filter((s) => s.collection === 'fiction');
    expect(hist.length).toBeGreaterThanOrEqual(11);
    expect(fic.length).toBeGreaterThanOrEqual(9);
    renderLibrary();
    // the historical shelf advertises progress toward the 200 goal
    expect(screen.getByText(new RegExp(`${hist.length} of 200`, 'i'))).toBeInTheDocument();
  });

  it('shows the Golden Crown cover with its water-rising domain label', () => {
    renderLibrary();
    const card = cardFor('The Sneaky Golden Crown');
    expect(within(card).getByText(/water rising/i)).toBeInTheDocument();
  });
});
