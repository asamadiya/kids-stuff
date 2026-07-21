import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Library } from '../components/Library';
import { STORIES, getStory } from '../stories';

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

const cardFor = (title: string): HTMLElement => {
  const heading = screen.getByRole('heading', { name: title });
  const card = heading.closest('article');
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
    expect(
      screen.getByRole('main', { name: /story library/i }),
    ).toBeInTheDocument();
  });

  it('labels the chosen story as Tonight\u2019s pick', () => {
    renderLibrary({ tonightPickSlug: PICK });
    const pick = getStory(PICK)!;
    const card = cardFor(pick.title);
    expect(within(card).getByText(/tonight.?s pick/i)).toBeInTheDocument();
  });

  it('renders exactly one cover card per story', () => {
    renderLibrary();
    expect(screen.getAllByRole('article')).toHaveLength(STORIES.length);
    for (const story of STORIES) {
      expect(
        screen.getByRole('heading', { name: story.title }),
      ).toBeInTheDocument();
    }
  });

  it('shows read time, learning domain, and heart-skill context on a card', () => {
    renderLibrary();
    const pick = getStory(PICK)!;
    const card = cardFor(pick.title);
    expect(within(card).getByText(/6 min/i)).toBeInTheDocument();
    expect(within(card).getByText('Measuring')).toBeInTheDocument();
    expect(within(card).getByText(pick.heartTakeaway)).toBeInTheDocument();
  });

  it('uses each story\u2019s first-page alt text for its cover image', () => {
    renderLibrary();
    const pick = getStory(PICK)!;
    const card = cardFor(pick.title);
    expect(
      within(card).getByRole('img', { name: pick.pages[0].alt }),
    ).toBeInTheDocument();
  });

  it('loads each prerendered cinematic cover from the configured Pages base path', () => {
    renderLibrary();
    for (const story of STORIES) {
      const cover = within(cardFor(story.title)).getByRole('img', {
        name: story.pages[0].alt,
      });
      expect(cover.tagName).toBe('IMG');
      expect(cover).toHaveAttribute(
        'src',
        `/kids-stuff/covers/${story.slug}.svg`,
      );
    }
  });

  it('ships a prerendered cinematic cover asset for every published story', () => {
    for (const story of STORIES) {
      expect(
        existsSync(
          resolve(process.cwd(), 'public', 'covers', `${story.slug}.svg`),
        ),
        `missing cinematic cover for ${story.slug}`,
      ).toBe(true);
    }
  });

  it('opens a story from its labelled read control, not from the card body', async () => {
    const user = userEvent.setup();
    const { onOpenStory } = renderLibrary();
    const pick = getStory(PICK)!;
    const card = cardFor(pick.title);

    // Non-interactive copy must never be a hidden navigation trap.
    await user.click(within(card).getByText(pick.subtitle));
    expect(onOpenStory).not.toHaveBeenCalled();

    const open = within(card).getByRole('button');
    expect(open).toHaveAccessibleName(new RegExp(pick.title, 'i'));
    await user.click(open);
    expect(onOpenStory).toHaveBeenCalledWith(PICK);
    expect(onOpenStory).toHaveBeenCalledTimes(1);
  });

  it('marks completed stories with a completion hook and a read-again control', () => {
    renderLibrary({ completedSlugs: new Set([PICK]) });
    const pick = getStory(PICK)!;
    const card = cardFor(pick.title);
    expect(card).toHaveAttribute('data-completed', 'true');
    expect(within(card).getByText(/you.?ve read this/i)).toBeInTheDocument();
    expect(within(card).getByRole('button')).toHaveAccessibleName(/again/i);
  });

  it('leaves unread stories without the completion hook', () => {
    renderLibrary({ completedSlugs: new Set([PICK]) });
    const other = STORIES.find((s) => s.slug !== PICK)!;
    const card = cardFor(other.title);
    expect(card).toHaveAttribute('data-completed', 'false');
    expect(within(card).getByRole('button')).not.toHaveAccessibleName(/again/i);
  });
});

describe('Library reflects the nine-story shelf', () => {
  it('leads with a "Nine gentle stories" invitation', () => {
    renderLibrary();
    expect(screen.getByText(/nine gentle stories/i)).toBeInTheDocument();
  });

  it('shows the Golden Crown cover with its water-rising domain label', () => {
    const crown = getStory('the-sneaky-golden-crown');
    expect(crown, 'the crown story must be published').toBeDefined();
    renderLibrary();
    const card = cardFor(crown!.title);
    expect(within(card).getByText(/water rising/i)).toBeInTheDocument();
    expect(within(card).getByText(crown!.heartTakeaway)).toBeInTheDocument();
  });
});

describe('Library motion contract', () => {
  it('marks every story card motion-off by default (no hover animation)', () => {
    render(
      <Library stories={STORIES} onOpenStory={() => {}} tonightPickSlug={PICK} />,
    );
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(STORIES.length);
    for (const card of cards) {
      expect(card).toHaveAttribute('data-motion', 'off');
    }
  });

  it('flips story cards to motion-on when motion is enabled', () => {
    render(
      <Library
        stories={STORIES}
        onOpenStory={() => {}}
        tonightPickSlug={PICK}
        motionEnabled
      />,
    );
    for (const card of screen.getAllByRole('article')) {
      expect(card).toHaveAttribute('data-motion', 'on');
    }
  });
});

describe.each([
  ['mobile', 375],
  ['desktop', 1280],
])('Library at %s width (%ipx)', (_label, width) => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    });
    window.dispatchEvent(new Event('resize'));
  });
  afterEach(cleanup);

  it('renders the hero and every cover card', () => {
    render(
      <Library stories={STORIES} onOpenStory={() => {}} tonightPickSlug={PICK} />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: /moonlit storybook/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(STORIES.length);
  });
});
