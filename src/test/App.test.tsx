import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import App from '../App';

const mount = (hash: string) => {
  window.history.replaceState(null, '', hash);
  render(<App />);
};

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '#/');
});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('App', () => {
  it('renders the field guide masthead', () => {
    mount('#/');
    expect(
      screen.getByRole('heading', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
  });

  it('renders the main library landmark with an accessible name', () => {
    mount('#/');
    expect(
      screen.getByRole('main', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
  });

  it('navigates to Practice at #/play and back to the contents', async () => {
    const user = userEvent.setup();
    mount('#/');

    // The ways in are anchors now, not click handlers: the href is the route.
    await user.click(document.querySelector('a[href="#/play"]') as HTMLElement);
    expect(window.location.hash).toBe('#/play');
    expect(screen.getByRole('main', { name: /practice/i })).toBeInTheDocument();

    await user.click(document.querySelector('a[href="#/"]') as HTMLElement);
    expect(window.location.hash).toBe('#/');
    expect(
      screen.getByRole('main', { name: /rikki.s field guide/i }),
    ).toBeInTheDocument();
  });

  it('moves focus to the new screen heading on a route change', async () => {
    // Fails if focus is left on <body> after a screen swap, which is what the
    // audit measured: every route change was silent and the next Tab restarted
    // from the top of the document.
    const user = userEvent.setup();
    mount('#/');
    await user.click(document.querySelector('a[href="#/make"]') as HTMLElement);
    const heading = screen.getByRole('heading', { level: 1, name: /workshop/i });
    expect(document.activeElement).toBe(heading);
  });

  it('does not move focus on first paint', () => {
    mount('#/');
    expect(document.activeElement).toBe(document.body);
  });

  it('keeps the active route when the skip link is used', async () => {
    const user = userEvent.setup();
    mount('#/play');
    await user.click(screen.getByRole('link', { name: /skip to main content/i }));
    expect(window.location.hash).toBe('#/play');
    expect(document.activeElement).toBe(document.getElementById('main-content'));
  });

  it('opens the workshop and one tool straight from their addresses', () => {
    mount('#/make');
    expect(screen.getByRole('main', { name: /workshop/i })).toBeInTheDocument();
    cleanup();
    mount('#/make/quadrat');
    expect(document.querySelector('a[href="#/make"]')).not.toBeNull();
  });
});
