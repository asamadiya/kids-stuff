import { describe, it, expect } from 'vitest';
import {
  LETTER_LAND_META,
  LETTER_ROUNDS,
  OPTION_COUNT,
  getLetterOptions,
  getLetterFeedback,
  wordTitle,
} from '../games/letter-land';

describe('letter-land data', () => {
  it('has a non-empty round list', () => {
    expect(LETTER_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least ~14 rounds', () => {
    expect(LETTER_ROUNDS.length).toBeGreaterThanOrEqual(14);
  });

  it('exposes a well-formed meta constant', () => {
    expect(LETTER_LAND_META.id).toBe('letter-land');
    expect(LETTER_LAND_META.title.length).toBeGreaterThan(0);
    expect(LETTER_LAND_META.tagline.length).toBeGreaterThan(0);
  });

  it('gives each round an emoji and a single uppercase starting letter', () => {
    for (const r of LETTER_ROUNDS) {
      expect(r.emoji.length).toBeGreaterThan(0);
      expect(r.letter).toMatch(/^[A-Z]$/);
      expect(r.word.length).toBeGreaterThan(0);
      expect(r.word[0].toUpperCase()).toBe(r.letter);
    }
  });
});

describe('getLetterOptions', () => {
  it('always includes the correct answer', () => {
    for (let i = 0; i < LETTER_ROUNDS.length; i++) {
      const round = LETTER_ROUNDS[i];
      const opts = getLetterOptions(i);
      expect(opts).toContain(round.letter);
    }
  });

  it('returns a stable option length', () => {
    for (let i = 0; i < LETTER_ROUNDS.length; i++) {
      expect(getLetterOptions(i).length).toBe(OPTION_COUNT);
    }
  });

  it('has no duplicate letters within a round', () => {
    for (let i = 0; i < LETTER_ROUNDS.length; i++) {
      const opts = getLetterOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    }
  });

  it('is deterministic across calls', () => {
    for (let i = 0; i < LETTER_ROUNDS.length; i++) {
      expect(getLetterOptions(i)).toEqual(getLetterOptions(i));
    }
  });
});

describe('getLetterFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    for (const r of LETTER_ROUNDS) {
      const msg = getLetterFeedback(r, r.letter);
      expect(msg.length).toBeGreaterThan(0);
      expect(msg).toContain(r.letter);
    }
  });

  it('returns a warm non-empty string for a wrong choice', () => {
    for (let i = 0; i < LETTER_ROUNDS.length; i++) {
      const r = LETTER_ROUNDS[i];
      const wrong = r.distractors[0];
      const msg = getLetterFeedback(r, wrong);
      expect(msg.length).toBeGreaterThan(0);
      expect(/wrong|incorrect| no |fail|lose/i.test(msg)).toBe(false);
    }
  });
});

describe('wordTitle', () => {
  it('title-cases a word', () => {
    expect(wordTitle('apple')).toBe('Apple');
    expect(wordTitle('bee')).toBe('Bee');
  });

  it('returns a non-empty string', () => {
    expect(wordTitle('sun').length).toBeGreaterThan(0);
  });
});
