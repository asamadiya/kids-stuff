import { describe, it, expect } from 'vitest';
import {
  SHAPE_ROUNDS,
  SHAPES,
  getShapeOptions,
  getShapeFeedback,
  shapeLabel,
} from '../games/shape-hunt';

describe('shape-hunt data', () => {
  it('has a non-empty rounds array', () => {
    expect(SHAPE_ROUNDS.length).toBeGreaterThan(0);
  });

  it('has at least 10 rounds', () => {
    expect(SHAPE_ROUNDS.length).toBeGreaterThanOrEqual(10);
  });

  it('every round shape is a valid shape', () => {
    for (const round of SHAPE_ROUNDS) {
      expect(SHAPES).toContain(round.shape);
    }
  });
});

describe('getShapeOptions', () => {
  it('always includes the correct answer', () => {
    SHAPE_ROUNDS.forEach((round, i) => {
      expect(getShapeOptions(i)).toContain(round.shape);
    });
  });

  it('returns a stable option length', () => {
    const lengths = SHAPE_ROUNDS.map((_, i) => getShapeOptions(i).length);
    for (const len of lengths) {
      expect(len).toBe(lengths[0]);
    }
  });

  it('has no duplicate options', () => {
    SHAPE_ROUNDS.forEach((_, i) => {
      const opts = getShapeOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    });
  });
});

describe('shapeLabel', () => {
  it('returns a non-empty capitalized string', () => {
    for (const shape of SHAPES) {
      const label = shapeLabel(shape);
      expect(label.length).toBeGreaterThan(0);
      expect(label[0]).toBe(label[0].toUpperCase());
    }
  });
});

describe('getShapeFeedback', () => {
  it('returns a non-empty string for a correct choice', () => {
    const round = SHAPE_ROUNDS[0];
    expect(getShapeFeedback(round, round.shape).length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for any other choice', () => {
    const round = SHAPE_ROUNDS[0];
    const other = SHAPES.find((s) => s !== round.shape)!;
    expect(getShapeFeedback(round, other).length).toBeGreaterThan(0);
  });

  it('never uses discouraging words', () => {
    const banned = ['wrong', 'no', 'incorrect', 'lose', 'fail'];
    SHAPE_ROUNDS.forEach((round) => {
      for (const shape of SHAPES) {
        const text = getShapeFeedback(round, shape).toLowerCase();
        for (const word of banned) {
          expect(new RegExp(`\\b${word}\\b`).test(text)).toBe(false);
        }
      }
    });
  });
});
