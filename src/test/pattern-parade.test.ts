import { describe, it, expect } from 'vitest';
import {
  PATTERN_PARADE_META,
  PATTERN_ROUNDS,
  getPatternOptions,
  getPatternFeedback,
  patternTypeLabel,
} from '../games/pattern-parade';

describe('pattern-parade data', () => {
  it('has a non-empty round list', () => {
    expect(PATTERN_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least ~12 rounds', () => {
    expect(PATTERN_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('exposes meta with the expected id', () => {
    expect(PATTERN_PARADE_META.id).toBe('pattern-parade');
    expect(PATTERN_PARADE_META.title.length).toBeGreaterThan(0);
  });

  it('every round has a non-empty visible sequence', () => {
    for (const round of PATTERN_ROUNDS) {
      expect(round.sequence.length).toBeGreaterThan(0);
    }
  });
});

describe('getPatternOptions', () => {
  it('always includes the correct answer', () => {
    PATTERN_ROUNDS.forEach((round, i) => {
      const opts = getPatternOptions(i);
      expect(opts).toContain(round.answer);
    });
  });

  it('returns a stable length for every round', () => {
    PATTERN_ROUNDS.forEach((_, i) => {
      expect(getPatternOptions(i)).toHaveLength(3);
    });
  });

  it('returns unique options (no duplicates)', () => {
    PATTERN_ROUNDS.forEach((_, i) => {
      const opts = getPatternOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    });
  });

  it('is deterministic across calls', () => {
    PATTERN_ROUNDS.forEach((_, i) => {
      expect(getPatternOptions(i)).toEqual(getPatternOptions(i));
    });
  });
});

describe('getPatternFeedback', () => {
  it('returns a non-empty string for the correct choice', () => {
    for (const round of PATTERN_ROUNDS) {
      const msg = getPatternFeedback(round, round.answer);
      expect(msg.length).toBeGreaterThan(0);
    }
  });

  it('returns a non-empty string for any distractor choice', () => {
    for (const round of PATTERN_ROUNDS) {
      for (const d of round.distractors) {
        const msg = getPatternFeedback(round, d);
        expect(msg.length).toBeGreaterThan(0);
      }
    }
  });

  it('never uses discouraging words', () => {
    const banned = ['wrong', 'no ', 'incorrect', 'lose', 'fail'];
    for (const round of PATTERN_ROUNDS) {
      for (const sel of [round.answer, ...round.distractors]) {
        const msg = getPatternFeedback(round, sel).toLowerCase();
        for (const bad of banned) {
          expect(msg.includes(bad)).toBe(false);
        }
      }
    }
  });
});

describe('patternTypeLabel', () => {
  it('returns a non-empty hyphenated label', () => {
    expect(patternTypeLabel('AB')).toBe('A-B');
    expect(patternTypeLabel('AABB').length).toBeGreaterThan(0);
  });
});
