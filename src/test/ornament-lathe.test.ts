import { describe, it, expect } from 'vitest';
import {
  DEFAULTS, MAX_REPEAT, ORNAMENT_LATHE_META, SYMMETRIES,
  catalogueLine, deepest, draw, parse, stamp, strokeCount, toPath,
} from '../workshop/ornament-lathe';
import type { Token } from '../workshop/ornament-lathe';

const f: Token = { kind: 'op', op: 'forward' };
const l: Token = { kind: 'op', op: 'left' };
const rep = (times: number): Token => ({ kind: 'repeat', times });
const end: Token = { kind: 'end' };

describe('the cards parse into a program', () => {
  it('reads a flat run of instructions', () => {
    expect(parse([f, l, f])).toEqual([
      { kind: 'op', op: 'forward' }, { kind: 'op', op: 'left' }, { kind: 'op', op: 'forward' },
    ]);
  });
  it('puts a repeat around the cards inside it', () => {
    const tree = parse([rep(3), f, l, end]);
    expect(tree).toHaveLength(1);
    expect(tree[0]).toMatchObject({ kind: 'loop', times: 3 });
  });
  it('allows a repeat inside a repeat — this is where the depth comes from', () => {
    const tree = parse([rep(2), f, rep(3), l, end, end]);
    expect(deepest(tree)).toBe(2);
  });
  it('forgives an unclosed repeat and ignores a stray end', () => {
    expect(() => parse([rep(2), f])).not.toThrow();
    expect(deepest(parse([rep(2), f]))).toBe(1);
    expect(parse([end, f])).toEqual([]);
  });
  it('clamps a repeat count to something a page can draw', () => {
    const tree = parse([rep(999), f, end]);
    expect(tree[0]).toMatchObject({ times: MAX_REPEAT });
  });
});

describe('counting strokes, brackets expanded', () => {
  it('multiplies the body by the repeat count', () => {
    // repeat 3 [ draw, turn, draw ]  ->  3 x 2 strokes
    expect(strokeCount(parse([rep(3), f, l, f, end]))).toBe(6);
  });
  it('multiplies through a nest', () => {
    // repeat 2 [ draw, repeat 3 [ draw ] ]  ->  2 x (1 + 3) = 8
    expect(strokeCount(parse([rep(2), f, rep(3), f, end, end]))).toBe(8);
  });
  it('counts only the drawing cards', () => {
    expect(strokeCount(parse([l, l, l]))).toBe(0);
  });
});

describe('drawing the path', () => {
  it('draws one segment per drawing card', () => {
    expect(draw(parse([f, l, f]))).toHaveLength(2);
  });
  it('is deterministic', () => {
    expect(draw(parse([rep(4), f, l, end]))).toEqual(draw(parse([rep(4), f, l, end])));
  });
  it('lifts the pen without losing the position', () => {
    const withLift = draw(parse([f, { kind: 'op', op: 'lift' }, f, { kind: 'op', op: 'drop' }, f]));
    expect(withLift).toHaveLength(2);
    // the lifted move still advanced the turtle (it starts pointing up, so the
    // gap shows in y), leaving a deliberate space between the two strokes
    expect(withLift[1].y1).not.toBeCloseTo(withLift[0].y2, 5);
  });
  it('turns by the angle it is given, so a different turn draws a different figure', () => {
    const a = draw(parse([f, l, f]), { ...DEFAULTS, turn: 90 });
    const b = draw(parse([f, l, f]), { ...DEFAULTS, turn: 45 });
    expect(a).not.toEqual(b);
  });
  it('never runs away, however deep the nest', () => {
    const deep = parse([rep(12), rep(12), rep(12), rep(12), f, end, end, end, end]);
    const segs = draw(deep);
    expect(segs.length).toBeLessThanOrEqual(6000);
  });
});

describe('the stamp multiplies the path', () => {
  const path = draw(parse([f, l, f]));
  it('lays down one copy per fold', () => {
    for (const s of SYMMETRIES) {
      expect(stamp(path, s.id).length, s.id).toBe(path.length * s.copies);
    }
  });
  it('a rosette is not the same as a single path', () => {
    expect(stamp(path, 'r6')).not.toEqual(stamp(path, 'none'));
  });
  it('mirroring reflects across the upright', () => {
    const m = stamp(path, 'mirror');
    expect(m[path.length].x1).toBeCloseTo(-path[0].x1, 5);
  });
});

describe('the ornament describes its own grammar', () => {
  it('states the fold, the strokes and the turn', () => {
    const line = catalogueLine(parse([rep(6), f, l, end]), 'r6');
    expect(line).toMatch(/six-fold/);
    expect(line).toMatch(/6 strokes/); // one drawing card per turn of the repeat
    expect(line).toMatch(/turn 45°/);
  });
  it('mentions how deep the repeats go, when they nest', () => {
    expect(catalogueLine(parse([rep(2), rep(2), f, end, end]), 'none')).toMatch(/2 deep/);
  });
  it('never praises', () => {
    expect(catalogueLine(parse([f]), 'r4')).not.toMatch(/great|lovely|beautiful|well done/i);
  });
});

describe('fitting to the plate', () => {
  it('produces an SVG path inside the box', () => {
    const d = toPath(draw(parse([rep(8), f, l, end])), 500);
    expect(d.startsWith('M ')).toBe(true);
    const nums = d.match(/-?\d+\.\d+/g)!.map(Number);
    expect(Math.min(...nums)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...nums)).toBeLessThanOrEqual(500);
  });
  it('gives an empty path for an empty program rather than throwing', () => {
    expect(toPath([], 500)).toBe('');
    expect(ORNAMENT_LATHE_META.id).toBe('ornament-lathe');
  });
});
