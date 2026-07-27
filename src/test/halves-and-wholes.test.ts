import { describe, it, expect } from 'vitest';
import {
  HALVES_AND_WHOLES_META,
  HALVES_ROUNDS,
  fractionLabel,
  getHalvesFeedback,
  getHalvesOptions,
  isOneHalf,
  type FractionShape,
} from '../games/halves-and-wholes';

// Recompute "is this shape one half?" independently of the module helper so the
// test is a real check, not a tautology: half === two equal parts, one shaded.
function computedIsHalf(s: FractionShape): boolean {
  return s.parts === 2 && s.equal === true && s.shaded === 1;
}

describe('halves-and-wholes meta', () => {
  it('has the expected shared-contract shape', () => {
    expect(HALVES_AND_WHOLES_META.id).toBe('halves-and-wholes');
    expect(HALVES_AND_WHOLES_META.title.length).toBeGreaterThan(0);
    expect(HALVES_AND_WHOLES_META.icon.length).toBeGreaterThan(0);
    expect(HALVES_AND_WHOLES_META.color).toBe('berry');
    expect(HALVES_AND_WHOLES_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('halves-and-wholes rounds', () => {
  it('has at least 12 rounds', () => {
    expect(HALVES_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('every round has 3-4 options', () => {
    for (const round of HALVES_ROUNDS) {
      expect(round.options.length).toBeGreaterThanOrEqual(3);
      expect(round.options.length).toBeLessThanOrEqual(4);
    }
  });

  it('every round options include the correct answer id', () => {
    for (const round of HALVES_ROUNDS) {
      const ids = round.options.map((o) => o.id);
      expect(ids).toContain(round.answerId);
    }
  });

  it('the answer of every round is actually one half (computed independently)', () => {
    for (const round of HALVES_ROUNDS) {
      const answer = round.options.find((o) => o.id === round.answerId);
      expect(answer).toBeDefined();
      expect(computedIsHalf(answer as FractionShape)).toBe(true);
      // module helper must agree with the independent computation
      expect(isOneHalf(answer as FractionShape)).toBe(true);
    }
  });

  it('exactly one option per round is one half', () => {
    for (const round of HALVES_ROUNDS) {
      const halves = round.options.filter((o) => computedIsHalf(o));
      expect(halves.length).toBe(1);
      expect(halves[0].id).toBe(round.answerId);
    }
  });

  it('every option has a stable, valid structure', () => {
    for (const round of HALVES_ROUNDS) {
      for (const o of round.options) {
        expect(o.parts).toBeGreaterThanOrEqual(1);
        expect(o.shaded).toBeGreaterThanOrEqual(0);
        expect(o.shaded).toBeLessThanOrEqual(o.parts);
        expect(['circle', 'rect']).toContain(o.kind);
      }
    }
  });

  it('every round prompt is a non-empty string', () => {
    for (const round of HALVES_ROUNDS) {
      expect(round.prompt.length).toBeGreaterThan(0);
    }
  });
});

describe('getHalvesOptions', () => {
  it('returns the same options as the round and wraps with modulo', () => {
    for (let i = 0; i < HALVES_ROUNDS.length; i += 1) {
      expect(getHalvesOptions(i)).toBe(HALVES_ROUNDS[i].options);
    }
    expect(getHalvesOptions(HALVES_ROUNDS.length)).toBe(HALVES_ROUNDS[0].options);
    expect(getHalvesOptions(HALVES_ROUNDS.length + 3)).toBe(HALVES_ROUNDS[3].options);
  });

  it('every accessor result includes the answer', () => {
    for (let i = 0; i < HALVES_ROUNDS.length; i += 1) {
      const ids = getHalvesOptions(i).map((o) => o.id);
      expect(ids).toContain(HALVES_ROUNDS[i].answerId);
    }
  });
});

describe('fractionLabel', () => {
  it('names common equal-part fractions', () => {
    expect(fractionLabel({ id: 'x', kind: 'circle', parts: 2, equal: true, shaded: 1 })).toBe('one half');
    expect(fractionLabel({ id: 'x', kind: 'circle', parts: 3, equal: true, shaded: 1 })).toBe('one third');
    expect(fractionLabel({ id: 'x', kind: 'rect', parts: 4, equal: true, shaded: 1 })).toBe('one quarter');
    expect(fractionLabel({ id: 'x', kind: 'rect', parts: 1, equal: true, shaded: 1 })).toBe('a whole');
    expect(fractionLabel({ id: 'x', kind: 'rect', parts: 2, equal: false, shaded: 1 })).toBe('unequal parts');
  });

  it('always returns a non-empty string for every option', () => {
    for (const round of HALVES_ROUNDS) {
      for (const o of round.options) {
        expect(fractionLabel(o).length).toBeGreaterThan(0);
      }
    }
  });
});

describe('getHalvesFeedback', () => {
  it('returns a non-empty, positive string for every option in every round', () => {
    const banned = ['wrong', 'incorrect', 'lose', 'fail'];
    for (const round of HALVES_ROUNDS) {
      for (const o of round.options) {
        const fb = getHalvesFeedback(round, o.id).toLowerCase();
        expect(fb.length).toBeGreaterThan(0);
        for (const bad of banned) {
          expect(fb).not.toContain(bad);
        }
        // never a standalone negative "no"
        expect(/\bno\b/.test(fb)).toBe(false);
      }
    }
  });

  it('affirms the correct pick and always explains what one half means', () => {
    for (const round of HALVES_ROUNDS) {
      const fb = getHalvesFeedback(round, round.answerId);
      expect(fb.toLowerCase()).toContain('correct');
      expect(fb).toContain('2 equal parts');
    }
  });
});
