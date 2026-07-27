import { describe, it, expect } from 'vitest';
import {
  RHYME_ROUNDS,
  RHYME_TIME_META,
  getRhymeOptions,
  getRhymePrompt,
  getRhymeFeedback,
  rhymeLabel,
} from '../games/rhyme-time';

describe('rhyme-time data', () => {
  it('has a non-empty rounds array', () => {
    expect(RHYME_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least 10 rounds', () => {
    expect(RHYME_ROUNDS.length).toBeGreaterThanOrEqual(10);
  });

  it('has a well-formed meta constant', () => {
    expect(RHYME_TIME_META.id).toBe('rhyme-time');
    expect(RHYME_TIME_META.title.length).toBeGreaterThan(0);
    expect(RHYME_TIME_META.tagline.length).toBeGreaterThan(0);
  });

  it('has unique round ids', () => {
    const ids = RHYME_ROUNDS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getRhymeOptions', () => {
  it('includes the correct rhyme for every round', () => {
    RHYME_ROUNDS.forEach((round, i) => {
      const options = getRhymeOptions(i);
      expect(options).toContain(round.rhyme);
    });
  });

  it('returns a stable option length of 3', () => {
    RHYME_ROUNDS.forEach((_, i) => {
      expect(getRhymeOptions(i)).toHaveLength(3);
    });
  });

  it('returns no duplicate options', () => {
    RHYME_ROUNDS.forEach((_, i) => {
      const options = getRhymeOptions(i);
      expect(new Set(options).size).toBe(options.length);
    });
  });

  it('is deterministic', () => {
    expect(getRhymeOptions(0)).toEqual(getRhymeOptions(0));
  });
});

describe('rhymeLabel', () => {
  it('capitalizes the first letter', () => {
    expect(rhymeLabel('cat')).toBe('Cat');
  });
});

describe('getRhymePrompt', () => {
  it('returns a non-empty string mentioning the target', () => {
    RHYME_ROUNDS.forEach((round) => {
      const prompt = getRhymePrompt(round);
      expect(prompt.length).toBeGreaterThan(0);
      expect(prompt).toContain(round.target.toUpperCase());
    });
  });
});

describe('getRhymeFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    RHYME_ROUNDS.forEach((round) => {
      const feedback = getRhymeFeedback(round, round.rhyme);
      expect(feedback.length).toBeGreaterThan(0);
    });
  });

  it('returns a non-empty string for any distractor choice', () => {
    RHYME_ROUNDS.forEach((round) => {
      round.distractors.forEach((d) => {
        const feedback = getRhymeFeedback(round, d);
        expect(feedback.length).toBeGreaterThan(0);
      });
    });
  });

  it('never uses discouraging words', () => {
    const banned = ['wrong', 'no', 'incorrect', 'lose', 'fail'];
    RHYME_ROUNDS.forEach((round) => {
      const all = [round.rhyme, ...round.distractors];
      all.forEach((choice) => {
        const feedback = getRhymeFeedback(round, choice).toLowerCase();
        banned.forEach((word) => {
          expect(new RegExp(`\\b${word}\\b`).test(feedback)).toBe(false);
        });
      });
    });
  });
});
