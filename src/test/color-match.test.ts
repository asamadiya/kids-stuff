import { describe, it, expect } from 'vitest';
import {
  COLOR_MATCH_META,
  COLOR_ROUNDS,
  colorLabel,
  getColorFeedback,
  getColorOptions,
} from '../games/color-match';

describe('color-match data', () => {
  it('has a non-empty rounds array', () => {
    expect(COLOR_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least 10 rounds of varied content', () => {
    expect(COLOR_ROUNDS.length).toBeGreaterThanOrEqual(10);
  });

  it('every round has a real hex color', () => {
    for (const round of COLOR_ROUNDS) {
      expect(round.hex).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('exposes correct meta', () => {
    expect(COLOR_MATCH_META.id).toBe('color-match');
    expect(COLOR_MATCH_META.title.length).toBeGreaterThan(0);
  });
});

describe('getColorOptions', () => {
  it('includes the correct answer for every round', () => {
    COLOR_ROUNDS.forEach((round, i) => {
      const opts = getColorOptions(i);
      expect(opts).toContain(round.color);
    });
  });

  it('returns a stable length', () => {
    const lengths = COLOR_ROUNDS.map((_, i) => getColorOptions(i).length);
    expect(new Set(lengths).size).toBe(1);
    expect(lengths[0]).toBe(4);
  });

  it('has no duplicate options', () => {
    COLOR_ROUNDS.forEach((_, i) => {
      const opts = getColorOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    });
  });
});

describe('label and feedback helpers', () => {
  it('colorLabel returns a non-empty capitalized string', () => {
    expect(colorLabel('red')).toBe('Red');
    expect(colorLabel('purple').length).toBeGreaterThan(0);
  });

  it('getColorFeedback returns a non-empty string for the correct choice', () => {
    const round = COLOR_ROUNDS[0];
    const fb = getColorFeedback(round, round.color);
    expect(fb.length).toBeGreaterThan(0);
  });

  it('getColorFeedback returns a warm non-empty string for a missed choice', () => {
    const round = COLOR_ROUNDS[0];
    const other = COLOR_ROUNDS.find((r) => r.color !== round.color)!.color;
    const fb = getColorFeedback(round, other);
    expect(fb.length).toBeGreaterThan(0);
    expect(fb.toLowerCase()).not.toContain('wrong');
    expect(fb.toLowerCase()).not.toContain('incorrect');
  });
});
