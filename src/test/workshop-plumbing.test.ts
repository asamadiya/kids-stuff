import { describe, it, expect, beforeEach } from 'vitest';
import { drawer } from '../workshop/drawer';
import { step } from '../workshop/tone';

interface Thing { readonly id: string; readonly made: string; readonly name: string }

describe('the workshop drawer', () => {
  beforeEach(() => window.localStorage.clear());

  it('mints an id and a date so a tool never has to', () => {
    const d = drawer<Thing>('test-rack');
    const kept = d.add({ name: 'a mill' });
    expect(kept.id).toBeTruthy();
    expect(Number.isNaN(Date.parse(kept.made))).toBe(false);
    expect(d.list()).toHaveLength(1);
  });

  it('keeps things across separate handles to the same rack', () => {
    drawer<Thing>('rack-a').add({ name: 'first' });
    expect(drawer<Thing>('rack-a').list().map((t) => t.name)).toEqual(['first']);
  });

  it('separates racks, and separates versions of a rack', () => {
    drawer<Thing>('rack-b', 1).add({ name: 'v1' });
    expect(drawer<Thing>('rack-c', 1).list()).toEqual([]);
    expect(drawer<Thing>('rack-b', 2).list()).toEqual([]);
  });

  it('removes and clears', () => {
    const d = drawer<Thing>('rack-d');
    const a = d.add({ name: 'a' });
    d.add({ name: 'b' });
    d.remove(a.id);
    expect(d.list().map((t) => t.name)).toEqual(['b']);
    d.clear();
    expect(d.list()).toEqual([]);
  });

  it('survives corrupt storage rather than throwing at the child', () => {
    window.localStorage.setItem('ks.workshop.rack-e.v1', 'not json at all');
    expect(drawer<Thing>('rack-e').list()).toEqual([]);
  });
});

describe('tone', () => {
  it('gives equal-tempered frequencies (A4 = 440, octave doubles)', () => {
    expect(step(0)).toBeCloseTo(440, 5);
    expect(step(12)).toBeCloseTo(880, 5);
    expect(step(-12)).toBeCloseTo(220, 5);
  });
});
