import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { PlayHub, PLAY_EXERCISE_IDS } from '../components/PlayHub';

const mount = (hash: string) => {
  window.history.replaceState(null, '', hash);
  render(<App />);
};

/** Exercise cards are links now, so a card can be opened cold from its URL. */
const cards = () => screen.getAllByRole('link', { name: /^Play / });

beforeEach(() => {
  window.history.replaceState(null, '', '#/play');
});
afterEach(cleanup);

describe('Rikki Play hub', () => {
  it('shows a gallery of at least a dozen exercises', () => {
    mount('#/play');
    expect(
      screen.getByRole('heading', { level: 1, name: /practice/i }),
    ).toBeInTheDocument();
    expect(cards().length).toBeGreaterThanOrEqual(12);
    expect(cards().length).toBe(PLAY_EXERCISE_IDS.length);
    expect(screen.getByRole('link', { name: /Play What Happens Next/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Play Counting to Ten/i })).toBeInTheDocument();
  });

  it('puts number work first, letters second and people last', () => {
    // Fails if the old feelings-first order returns and pushes the maths — the
    // stated need — below the fold.
    mount('#/play');
    const sections = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(sections).toEqual([
      'Number & Quantity',
      'Letters, Shapes & Patterns',
      'People & What Happens Next',
    ]);
  });

  it('opens an exercise at its own address and returns to the gallery', async () => {
    // Driven through a number drill rather than a social exercise so this gate
    // measures routing only, and does not go red when an exercise's own
    // internals are being reworked.
    const user = userEvent.setup();
    mount('#/play');

    await user.click(screen.getByRole('link', { name: /Play Counting to Ten/i }));
    expect(window.location.hash).toBe('#/play/count-with-rikki');
    expect(screen.getByRole('heading', { name: /count with rikki/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /all exercises/i }));
    expect(window.location.hash).toBe('#/play');
    expect(screen.getByRole('link', { name: /Play What Happens Next/i })).toBeInTheDocument();
  });

  it('renders one exercise alone when the hub is handed its id', () => {
    render(<PlayHub activeId="count-with-rikki" />);
    expect(screen.getByRole('heading', { name: /count with rikki/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('link', { name: /^Play / })).toEqual([]);
  });

  it('lets a child answer the counting exercise with no-fail feedback', async () => {
    const user = userEvent.setup();
    mount('#/play/count-with-rikki');
    expect(screen.getByRole('heading', { name: /count with rikki/i })).toBeInTheDocument();

    const numberOptions = screen
      .getAllByRole('button')
      .filter((b) => /^\d+$/.test((b.textContent || '').trim()));
    expect(numberOptions.length).toBeGreaterThan(0);

    await user.click(numberOptions[0]);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
