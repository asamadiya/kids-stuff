import { describe, expect, it } from 'vitest';
import {
  BUILD_THE_NUMBER_META,
  BUILD_THE_NUMBER_ROUNDS,
  OPTION_COUNT,
  buildLabel,
  getBuildFeedback,
  getBuildHint,
  getBuildOptions,
  getBuildPrompt,
  partsAsSum,
  partsInWords,
  partsTotal,
  partValue,
} from '../games/build-the-number';

describe('build-the-number meta', () => {
  it('has the expected identity', () => {
    expect(BUILD_THE_NUMBER_META.id).toBe('build-the-number');
    expect(BUILD_THE_NUMBER_META.title.length).toBeGreaterThan(0);
    expect(BUILD_THE_NUMBER_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('build-the-number rounds', () => {
  it('has a non-empty rounds array with >= 12 rounds', () => {
    expect(BUILD_THE_NUMBER_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round parts sum exactly to the answer (correct math)', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(partsTotal(round.parts)).toBe(round.answer);
    }
  });

  it('partValue is count * unit for every part', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      for (const part of round.parts) {
        expect(partValue(part)).toBe(part.count * part.unit);
      }
    }
  });

  it('the expanded sum string evaluates to the answer', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      const total = partsAsSum(round.parts)
        .split(' + ')
        .reduce((acc, n) => acc + Number(n), 0);
      expect(total).toBe(round.answer);
    }
  });

  it('distractors are distinct and never equal the answer', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      const set = new Set(round.distractors);
      expect(set.size).toBe(round.distractors.length);
      expect(set.has(round.answer)).toBe(false);
    }
  });

  it('round ids are unique', () => {
    const ids = BUILD_THE_NUMBER_ROUNDS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getBuildOptions', () => {
  it('always includes the correct answer', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(getBuildOptions(round)).toContain(round.answer);
    }
  });

  it('has a stable option length equal to OPTION_COUNT', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(getBuildOptions(round)).toHaveLength(OPTION_COUNT);
    }
  });

  it('is deterministic across calls', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(getBuildOptions(round)).toEqual(getBuildOptions(round));
    }
  });

  it('contains no duplicate options', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      const opts = getBuildOptions(round);
      expect(new Set(opts).size).toBe(opts.length);
    }
  });
});

describe('text helpers return non-empty strings', () => {
  it('getBuildPrompt is non-empty for every round', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(getBuildPrompt(round).length).toBeGreaterThan(0);
    }
  });

  it('sum-style prompt ends with = ? and words-style asks which number', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      const prompt = getBuildPrompt(round);
      if (round.style === 'sum') {
        expect(prompt.endsWith('= ?')).toBe(true);
      } else {
        expect(prompt.startsWith('Which number is')).toBe(true);
      }
    }
  });

  it('getBuildHint is non-empty for every round', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(getBuildHint(round).length).toBeGreaterThan(0);
    }
  });

  it('partsInWords and partsAsSum are non-empty', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      expect(partsInWords(round.parts).length).toBeGreaterThan(0);
      expect(partsAsSum(round.parts).length).toBeGreaterThan(0);
    }
  });

  it('buildLabel returns a non-empty string', () => {
    expect(buildLabel(1250).length).toBeGreaterThan(0);
  });
});

describe('getBuildFeedback', () => {
  it('returns a non-empty warm string for the correct choice', () => {
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      const fb = getBuildFeedback(round, round.answer);
      expect(fb.length).toBeGreaterThan(0);
    }
  });

  it('returns a non-empty warm string for a wrong choice with no negative words', () => {
    const banned = /\b(wrong|incorrect|no|lose|fail)\b/i;
    for (const round of BUILD_THE_NUMBER_ROUNDS) {
      const fb = getBuildFeedback(round, round.distractors[0]);
      expect(fb.length).toBeGreaterThan(0);
      expect(banned.test(fb)).toBe(false);
    }
  });
});
