import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the Moonlit Storybook title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /moonlit storybook/i })).toBeInTheDocument();
  });

  it('renders the main library landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('main landmark has accessible name "Story library"', () => {
    render(<App />);
    expect(screen.getByRole('main', { name: /story library/i })).toBeInTheDocument();
  });
});
