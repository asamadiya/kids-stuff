import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#/');
  });

  it("renders Rikki's Learn & Play Center title", () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /rikki's learn & play center/i }),
    ).toBeInTheDocument();
  });

  it('renders the main library landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('main landmark has an accessible learning center name', () => {
    render(<App />);
    expect(
      screen.getByRole('main', { name: /rikki's learn & play center/i }),
    ).toBeInTheDocument();
  });

  it('navigates to the Play hub at #/play and back to the learning center', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /play games with rikki/i }));
    expect(window.location.hash).toBe('#/play');
    expect(screen.getByRole('main', { name: /rikki's play zone/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /back to the learning center/i }));
    expect(window.location.hash).toBe('#/');
    expect(
      screen.getByRole('main', { name: /rikki's learn & play center/i }),
    ).toBeInTheDocument();
  });
});
