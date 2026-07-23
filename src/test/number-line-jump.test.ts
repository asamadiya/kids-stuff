import { describe, expect, it } from 'vitest';
import {
  JUMP_ROUNDS,
  NUMBER_LINE_JUMP_META,
  NUMBER_LINE_MIN,
  NUMBER_LINE_MAX,
  getJumpFeedback,
  getJumpOptions,
  jumpHint,
  jumpOptionLabel,
  jumpPrompt,
  landOn,
} from '../games/number-line-jump';

describe('number-line-jump meta', () => {
  it('has the expected identity', () => {
    expect(NUMBER_LINE_JUMP_META.id).toBe('number-line-jump');
    expect(NUMBER_LINE_JUMP_META.title.length).toBeGreaterThan(0);
    expect(NUMBER_LINE_JUMP_META.icon.length).toBeGreaterThan(0);
    expect(NUMBER_LINE_JUMP_META.color).toBe('leaf');
    expect(NUMBER_LINE_JUMP_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('rounds', () => {
  it('has at least 12 rounds', () => {
    expect(JUMP_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round stays inside the 0..20 line for start and landing', () => {
    for (const round of JUMP_ROUNDS) {
      expect(round.start).toBeGreaterThanOrEqual(NUMBER_LINE_MIN);
      expect(round.start).toBeLessThanOrEqual(NUMBER_LINE_MAX);
      const land = landOn(round);
      expect(land).toBeGreaterThanOrEqual(NUMBER_LINE_MIN);
      expect(land).toBeLessThanOrEqual(NUMBER_LINE_MAX);
    }
  });

  it('landing math is correct (computed independently)', () => {
    for (const round of JUMP_ROUNDS) {
      const expected = round.dir === 'forward' ? round.start + round.jump : round.start - round.jump;
      expect(landOn(round)).toBe(expected);
    }
  });

  it('includes both forward and back jumps', () => {
    expect(JUMP_ROUNDS.some((r) => r.dir === 'forward')).toBe(true);
    expect(JUMP_ROUNDS.some((r) => r.dir === 'back')).toBe(true);
  });
});

describe('options', () => {
  it('for every round, options include the correct answer', () => {
    JUMP_ROUNDS.forEach((round, i) => {
      const opts = getJumpOptions(i);
      expect(opts).toContain(landOn(round));
    });
  });

  it('option lists have a stable length of 4', () => {
    for (let i = 0; i < JUMP_ROUNDS.length; i += 1) {
      expect(getJumpOptions(i)).toHaveLength(4);
    }
  });

  it('options are unique and within the number line', () => {
    for (let i = 0; i < JUMP_ROUNDS.length; i += 1) {
      const opts = getJumpOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
      for (const o of opts) {
        expect(o).toBeGreaterThanOrEqual(NUMBER_LINE_MIN);
        expect(o).toBeLessThanOrEqual(NUMBER_LINE_MAX);
      }
    }
  });

  it('is deterministic across calls', () => {
    for (let i = 0; i < JUMP_ROUNDS.length; i += 1) {
      expect(getJumpOptions(i)).toEqual(getJumpOptions(i));
    }
  });

  it('wraps with modulo for indices past the end', () => {
    expect(getJumpOptions(JUMP_ROUNDS.length)).toEqual(getJumpOptions(0));
  });
});

describe('text helpers', () => {
  it('prompt is non-empty and mentions the start', () => {
    JUMP_ROUNDS.forEach((round) => {
      const p = jumpPrompt(round);
      expect(p.length).toBeGreaterThan(0);
      expect(p).toContain(String(round.start));
    });
  });

  it('hint is non-empty', () => {
    JUMP_ROUNDS.forEach((round) => {
      expect(jumpHint(round).length).toBeGreaterThan(0);
    });
  });

  it('option label is a non-empty string', () => {
    expect(jumpOptionLabel(0).length).toBeGreaterThan(0);
    expect(jumpOptionLabel(14)).toBe('14');
  });

  it('feedback is warm, non-empty, and never uses failure words', () => {
    const banned = /wrong|incorrect|\bno\b|lose|fail/i;
    JUMP_ROUNDS.forEach((round) => {
      const correct = landOn(round);
      const wrong = correct === NUMBER_LINE_MAX ? correct - 1 : correct + 1;
      for (const sel of [correct, wrong]) {
        const fb = getJumpFeedback(round, sel);
        expect(fb.length).toBeGreaterThan(0);
        expect(banned.test(fb)).toBe(false);
        // the correct landing spot is always surfaced
        expect(fb).toContain(String(correct));
      }
    });
  });
});
