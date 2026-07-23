import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlayHub } from '../components/PlayHub';

afterEach(cleanup);

describe('Rikki Play hub', () => {
  it('offers the live Name the Feeling game and future game cards', () => {
    render(<PlayHub onExit={vi.fn()} />);
    expect(screen.getByRole('heading', { level: 1, name: /rikki's play zone/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /name the feeling/i })).toBeInTheDocument();
    expect(screen.getByText(/count with rikki/i)).toBeInTheDocument();
    expect(screen.getAllByText(/coming soon/i).length).toBeGreaterThanOrEqual(1);
  });

  it('names a feeling with kind feedback, awards a star, and moves to the next round', async () => {
    const user = userEvent.setup();
    render(<PlayHub onExit={vi.fn()} />);

    expect(screen.getByText(/ice cream fell in the sand/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sad' }));

    expect(screen.getByRole('status')).toHaveTextContent(/sad is okay/i);
    expect(screen.getByText(/1 feeling named/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next feeling/i }));
    expect(screen.queryByText(/ice cream fell in the sand/i)).not.toBeInTheDocument();
    expect(screen.getByText(/class clapped for his painting/i)).toBeInTheDocument();
  });
});
