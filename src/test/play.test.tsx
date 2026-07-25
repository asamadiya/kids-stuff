import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlayHub } from '../components/PlayHub';

afterEach(cleanup);

describe('Rikki Play hub', () => {
  it('shows a gallery of at least a dozen games', () => {
    render(<PlayHub onExit={vi.fn()} />);
    expect(
      screen.getByRole('heading', { level: 1, name: /practice/i }),
    ).toBeInTheDocument();
    const cards = screen.getAllByRole('button', { name: /^Play / });
    expect(cards.length).toBeGreaterThanOrEqual(12);
    expect(screen.getByRole('button', { name: /Play Name the Feeling/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Counting to Ten/i })).toBeInTheDocument();
  });

  it('opens a game from the gallery and returns to it', async () => {
    const user = userEvent.setup();
    render(<PlayHub onExit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /Play Name the Feeling/i }));
    expect(screen.getByRole('heading', { name: /name the feeling/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /all exercises/i }));
    expect(screen.getByRole('button', { name: /Play Counting to Ten/i })).toBeInTheDocument();
  });

  it('lets a child answer the counting game with no-fail feedback and a star', async () => {
    const user = userEvent.setup();
    render(<PlayHub onExit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /Play Counting to Ten/i }));
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
