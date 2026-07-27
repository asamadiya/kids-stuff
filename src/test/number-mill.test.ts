import { describe, it, expect } from 'vitest';
import {
  BLOCKS, NUMBER_MILL_META, applyBlock, describeChain, orbit, run, runDomain, trace,
} from '../workshop/number-mill';
import type { Block } from '../workshop/number-mill';

const b = (kind: Block['kind'], param = 0): Block => ({ kind, param });

describe('the blocks do what they say', () => {
  it('adds, takes and times by the counters set on them', () => {
    expect(applyBlock(b('add', 3), 5)).toBe(8);
    expect(applyBlock(b('take', 2), 5)).toBe(3);
    expect(applyBlock(b('times', 3), 5)).toBe(15);
  });
  it('halves only even numbers, and holds odd ones whole', () => {
    expect(applyBlock(b('halve'), 8)).toBe(4);
    expect(applyBlock(b('halve'), 7)).toBe(7);
  });
  it('steps to the next even or odd number, never staying put', () => {
    expect(applyBlock(b('nextEven'), 4)).toBe(6);
    expect(applyBlock(b('nextEven'), 5)).toBe(6);
    expect(applyBlock(b('nextOdd'), 5)).toBe(7);
    expect(applyBlock(b('nextOdd'), 4)).toBe(5);
  });
  it('adds the digits and swaps them', () => {
    expect(applyBlock(b('digitSum'), 47)).toBe(11);
    expect(applyBlock(b('swapDigits'), 47)).toBe(74);
    expect(applyBlock(b('swapDigits'), 7)).toBe(7);
  });
});

describe('a chain is a composed function, so order matters', () => {
  const doubleThenAdd = [b('times', 2), b('add', 1)];
  const addThenDouble = [b('add', 1), b('times', 2)];
  it('gives different answers for the same blocks in a different order', () => {
    expect(run(doubleThenAdd, 5)).toBe(11);
    expect(run(addThenDouble, 5)).toBe(12);
    expect(run(doubleThenAdd, 5)).not.toBe(run(addThenDouble, 5));
  });
  it('records the value at every station', () => {
    expect(trace(doubleThenAdd, 5)).toEqual([5, 10, 11]);
  });
  it('is deterministic — the same mill always mills the same way', () => {
    expect(trace(doubleThenAdd, 7)).toEqual(trace(doubleThenAdd, 7));
  });
  it('an empty mill passes the number straight through', () => {
    expect(run([], 9)).toBe(9);
    expect(trace([], 9)).toEqual([9]);
  });
});

describe('the image over 1..20 is where the rule becomes visible', () => {
  it('doubling lands only on even numbers', () => {
    const out = runDomain([b('times', 2)], 20).map((p) => p.to);
    expect(out.every((n) => n % 2 === 0)).toBe(true);
    expect(out).toContain(40);
  });
  it('different chains stain different squares', () => {
    const a = runDomain([b('times', 3)], 20).map((p) => p.to);
    const c = runDomain([b('add', 5)], 20).map((p) => p.to);
    expect(a).not.toEqual(c);
  });
});

describe('with the return pipe the mill eats its own output', () => {
  it('finds a fixed point and stops', () => {
    // adding the digits of a one-digit number returns it unchanged
    const o = orbit([b('digitSum')], 7);
    expect(o.ending).toBe('fixed');
  });
  it('finds a cycle: swapping digits twice returns the number', () => {
    const o = orbit([b('swapDigits')], 47);
    expect(o.ending).toBe('cycle');
    expect(o.values.slice(0, 3)).toEqual([47, 74, 47]);
  });
  it('gives up rather than running away for ever', () => {
    const o = orbit([b('times', 9)], 20);
    expect(o.ending).toBe('off-the-board');
  });
});

describe('the mill can describe itself', () => {
  it('reads a chain aloud in order', () => {
    expect(describeChain([b('times', 2), b('add', 1)])).toBe('times 2, then add 1');
  });
  it('says something even when empty', () => {
    expect(describeChain([]).length).toBeGreaterThan(0);
  });
  it('has a block spec for every block kind it can apply', () => {
    for (const spec of BLOCKS) expect(typeof applyBlock({ kind: spec.kind, param: 2 }, 6)).toBe('number');
    expect(NUMBER_MILL_META.id).toBe('number-mill');
  });
});
