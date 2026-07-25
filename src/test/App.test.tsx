import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#/');
  });

  it("renders the field guide masthead", () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
  });

  it('renders the main library landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('main landmark has an accessible name', () => {
    render(<App />);
    expect(
      screen.getByRole('main', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
  });

  it('navigates to Practice at #/play and back to the contents', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /open practice/i }));
    expect(window.location.hash).toBe('#/play');
    expect(screen.getByRole('main', { name: /practice/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /contents/i }));
    expect(window.location.hash).toBe('#/');
    expect(
      screen.getByRole('main', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
  });
});
