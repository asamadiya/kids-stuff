import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { weaveStory, MIN_THINGS } from '../loom/weave';
import { toThing } from '../loom/ingredients';
import type { Thing } from '../loom/ingredients';
import { StoryLoom } from '../components/StoryLoom';

const THINGS: Thing[] = [
  { label: 'mouse', emoji: '🐭', kind: 'animal' },
  { label: 'spoon', emoji: '🥄', kind: 'object' },
  { label: 'moon', emoji: '🌙', kind: 'nature' },
  { label: 'castle', emoji: '🏰', kind: 'place' },
];

const text = (t: Thing[], v = 0) => {
  const s = weaveStory(t, v);
  return `${s.title}\n${s.paragraphs.join('\n')}`;
};

afterEach(cleanup);

describe('weaveStory', () => {
  it('includes every thing in the tale', () => {
    const body = text(THINGS);
    for (const t of THINGS) expect(body).toContain(t.label);
  });

  it('ends calm, on Goodnight', () => {
    const s = weaveStory(THINGS);
    expect(s.paragraphs[s.paragraphs.length - 1]).toMatch(/Goodnight\.$/);
  });

  it('is deterministic for the same things and variant', () => {
    expect(text(THINGS, 2)).toBe(text(THINGS, 2));
  });

  it('tells it a different way across variants', () => {
    const variants = new Set([0, 1, 2, 3, 4].map((v) => text(THINGS, v)));
    expect(variants.size).toBeGreaterThan(1);
  });

  it('works with the minimum number of things', () => {
    const three = THINGS.slice(0, MIN_THINGS);
    const body = text(three);
    for (const t of three) expect(body).toContain(t.label);
  });
});

describe('toThing', () => {
  it('guesses kinds from keywords', () => {
    expect(toThing('dog').kind).toBe('animal');
    expect(toThing('castle').kind).toBe('place');
    expect(toThing('moon').kind).toBe('nature');
    expect(toThing('cookie').kind).toBe('food');
    expect(toThing('sparkly rock').kind).toBe('object');
  });
});

describe('StoryLoom', () => {
  it('enables weaving once three things are picked, then tells a tale', async () => {
    const user = userEvent.setup();
    render(<StoryLoom onExit={vi.fn()} />);

    const weave = screen.getByRole('button', { name: /weave the story/i });
    expect(weave).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /mouse/i }));
    await user.click(screen.getByRole('button', { name: /spoon/i }));
    await user.click(screen.getByRole('button', { name: /moon/i }));

    expect(weave).toBeEnabled();
    await user.click(weave);

    // the woven story shows and mentions the chosen things
    expect(await screen.findByRole('button', { name: /tell it another way/i })).toBeInTheDocument();
    expect(document.body.textContent).toMatch(/mouse/);
    expect(document.body.textContent).toMatch(/Goodnight/);
  });
});
