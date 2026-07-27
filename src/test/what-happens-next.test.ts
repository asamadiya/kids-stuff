import { describe, it, expect } from 'vitest';
import {
  ROAD_IDS,
  STRIPS,
  WHATHAPPENSNEXT_META,
  allPanels,
  bothWalked,
  coverageLine,
  nextStripId,
  otherRoad,
  panelsOf,
  plateFilename,
  plateLines,
  roadKey,
  roadOf,
  roadsWalkedIn,
  stripById,
  stripLine,
  totalRoads,
  walkedCount,
} from '../sel/what-happens-next';
import type { Strip } from '../sel/what-happens-next';

/** Words that would praise, judge, or grade. None may appear in any copy. */
const MORALISING = /\b(great|well done|good job|good|correct|incorrect|wrong|right way|naughty|kind|kindly|unkind|nice|nicer|better|best|should|shouldn't|proud|shame|selfish|mean|bad|oops|try again|not quite)\b/i;

/** Fields that would encode a preferred branch. None may exist at any depth. */
const VERDICT_KEYS = ['answer', 'answerid', 'correct', 'right', 'best', 'good', 'score', 'points', 'stars', 'win', 'prefer', 'preferred', 'weight', 'value'];

const allCopy = (): string[] =>
  STRIPS.flatMap((s) => [
    s.setupWord,
    s.place,
    ...s.roads.flatMap((r) => [r.afterWord, r.laterWord]),
    ...panelsOf(s).map((p) => p.alt),
  ]);

const keysDeep = (value: unknown, out: string[] = []): string[] => {
  if (Array.isArray(value)) {
    for (const v of value) keysDeep(v, out);
  } else if (value !== null && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out.push(k);
      keysDeep(v, out);
    }
  }
  return out;
};

const everyRoadKey = (): string[] => STRIPS.flatMap((s) => s.roads.map((r) => roadKey(s.id, r.id)));

describe('what-happens-next: meta', () => {
  it('declares the id the files and images are named for', () => {
    expect(WHATHAPPENSNEXT_META.id).toBe('what-happens-next');
    expect(WHATHAPPENSNEXT_META.title).toBe('What Happens Next');
    expect(WHATHAPPENSNEXT_META.eyebrow.split(/\s+/).length).toBeLessThanOrEqual(3);
    expect(WHATHAPPENSNEXT_META.note.length).toBeGreaterThan(20);
  });
});

describe('what-happens-next: the strip shape is closed', () => {
  it('ships a complete set of strips', () => {
    expect(STRIPS.length).toBeGreaterThanOrEqual(4);
    expect(new Set(STRIPS.map((s) => s.id)).size).toBe(STRIPS.length);
  });

  it('gives every strip exactly two roads, drawn a, then b', () => {
    for (const s of STRIPS) {
      expect(s.roads).toHaveLength(2);
      expect(s.roads.map((r) => r.id)).toEqual([...ROAD_IDS]);
    }
  });

  it('gives every strip exactly seven panels: p0, and three per road', () => {
    for (const s of STRIPS) {
      expect(panelsOf(s)).toHaveLength(7);
      for (const r of s.roads) {
        expect(Object.keys(r).sort()).toEqual(['action', 'after', 'afterWord', 'id', 'later', 'laterWord']);
      }
      expect(Object.keys(s).sort()).toEqual(['id', 'place', 'roads', 'setup', 'setupWord']);
    }
  });

  it('has no field anywhere that could name a correct branch', () => {
    const keys = keysDeep(STRIPS).map((k) => k.toLowerCase());
    for (const forbidden of VERDICT_KEYS) expect(keys).not.toContain(forbidden);
  });
});

describe('what-happens-next: the drawings', () => {
  it('names every image uniquely and under this exercise', () => {
    const panels = allPanels();
    expect(panels).toHaveLength(STRIPS.length * 7);
    const ids = panels.map((p) => p.image);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id.startsWith('what-happens-next-')).toBe(true);
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('gives every panel real alt text, not a label', () => {
    for (const p of allPanels()) {
      expect(p.alt.length).toBeGreaterThan(24);
      expect(p.alt.trim().endsWith('.')).toBe(true);
    }
  });

  it('draws both roads with the same number of panels, so nothing leaks a key', () => {
    for (const s of STRIPS) {
      const [a, b] = s.roads;
      expect([a.action, a.after, a.later]).toHaveLength(3);
      expect([b.action, b.after, b.later]).toHaveLength(3);
      // neither road's description is starved of detail relative to the other
      const len = (r: Strip['roads'][number]) => r.action.alt.length + r.after.alt.length + r.later.alt.length;
      const ratio = len(a) / len(b);
      expect(ratio).toBeGreaterThan(0.6);
      expect(ratio).toBeLessThan(1.7);
    }
  });
});

describe('what-happens-next: the copy carries no verdict', () => {
  it('never praises, judges, or moralises', () => {
    for (const line of allCopy()) expect(line).not.toMatch(MORALISING);
  });

  it('states what happened in the second person, past tense, as a statement', () => {
    for (const s of STRIPS) {
      for (const r of s.roads) {
        expect(r.afterWord.startsWith('You ')).toBe(true);
        for (const word of [r.afterWord, r.laterWord]) {
          expect(word.trim().endsWith('.')).toBe(true);
          expect(word).not.toMatch(/[!?]/);
        }
      }
    }
  });

  it('names no feeling in the setup, so the strip is never a feelings quiz', () => {
    const FEELING = /\b(happy|sad|angry|cross|scared|afraid|worried|upset|excited|jealous|lonely|frustrated|feel|feels|feeling|felt)\b/i;
    for (const s of STRIPS) expect(s.setupWord).not.toMatch(FEELING);
  });
});

describe('what-happens-next: ambiguity is the material', () => {
  it('makes every road cost something somewhere along it', () => {
    const LOSS = /\b(not|nothing|nobody|no one|never|still|gone|away|left|asleep|broken|cried|off)\b/i;
    for (const s of STRIPS) {
      for (const r of s.roads) {
        expect(`${r.afterWord} ${r.laterWord}`).toMatch(LOSS);
      }
    }
  });

  it('lets the later beat contradict the immediate outcome, so no road is a clean win', () => {
    for (const s of STRIPS) {
      for (const r of s.roads) {
        expect(r.laterWord).not.toBe(r.afterWord);
        expect(r.laterWord.length).toBeGreaterThan(20);
      }
    }
  });

  it('has at least two strips where the road that gives something up fails outright', () => {
    const failing = ['dinosaur-mia', 'promised-mia'];
    for (const id of failing) {
      const s = stripById(id);
      expect(s).toBeDefined();
      const road = roadOf(s as Strip, 'b');
      expect(`${road.afterWord} ${road.laterWord}`).toMatch(/\b(off|gone|not|tipped)\b/i);
    }
  });
});

describe('what-happens-next: coverage, never score', () => {
  it('counts roads, not answers', () => {
    expect(totalRoads()).toBe(STRIPS.length * 2);
    expect(walkedCount([])).toBe(0);
    expect(coverageLine([])).toBe(`You have walked 0 of the ${totalRoads()} roads.`);
    expect(coverageLine(everyRoadKey())).toBe(`You have walked ${totalRoads()} of the ${totalRoads()} roads.`);
  });

  it('ignores duplicates and unknown keys instead of inflating a tally', () => {
    const k = roadKey(STRIPS[0].id, 'a');
    expect(walkedCount([k, k, k])).toBe(1);
    expect(walkedCount(['no-such-strip:a', 'garbage'])).toBe(0);
  });

  it('never phrases the readout as a ratio of right to wrong', () => {
    const readouts = [coverageLine([]), coverageLine(everyRoadKey()), ...STRIPS.map((s) => stripLine([], s))];
    for (const line of readouts) {
      expect(line).not.toMatch(MORALISING);
      expect(line).not.toMatch(/\b(score|star|streak|point|out of \d+ correct)\b/i);
      expect(line).toMatch(/\b(walked|opened)\b/);
    }
  });

  it('counts roads walked within one strip', () => {
    const s = STRIPS[0];
    expect(roadsWalkedIn([], s)).toBe(0);
    expect(roadsWalkedIn([roadKey(s.id, 'a')], s)).toBe(1);
    expect(bothWalked([roadKey(s.id, 'a')], s)).toBe(false);
    expect(bothWalked([roadKey(s.id, 'a'), roadKey(s.id, 'b')], s)).toBe(true);
    // another strip's roads never count towards this one
    expect(roadsWalkedIn([roadKey(STRIPS[1].id, 'a')], s)).toBe(0);
  });
});

describe('what-happens-next: helpers are deterministic', () => {
  it('cycles through every strip and returns to the start', () => {
    let id = STRIPS[0].id;
    const seen: string[] = [];
    for (let i = 0; i < STRIPS.length; i += 1) {
      id = nextStripId(id);
      seen.push(id);
    }
    expect(new Set(seen).size).toBe(STRIPS.length);
    expect(id).toBe(STRIPS[0].id);
    expect(nextStripId(STRIPS[0].id)).toBe(nextStripId(STRIPS[0].id));
  });

  it('flips between the two roads', () => {
    expect(otherRoad('a')).toBe('b');
    expect(otherRoad('b')).toBe('a');
    for (const s of STRIPS) {
      expect(roadOf(s, 'a').id).toBe('a');
      expect(roadOf(s, 'b').id).toBe('b');
    }
  });

  it('finds strips by id and gives up quietly on an unknown one', () => {
    expect(stripById(STRIPS[2].id)?.id).toBe(STRIPS[2].id);
    expect(stripById('nope')).toBeUndefined();
  });

  it('writes a two-road plate that carries the setup and both roads', () => {
    for (const s of STRIPS) {
      const lines = plateLines(s);
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe(s.setupWord);
      expect(lines[1]).toContain(s.roads[0].afterWord);
      expect(lines[1]).toContain(s.roads[0].laterWord);
      expect(lines[2]).toContain(s.roads[1].afterWord);
      expect(lines[2]).toContain(s.roads[1].laterWord);
      for (const line of lines) expect(line).not.toMatch(MORALISING);
      expect(plateFilename(s)).toBe(`what-happens-next-${s.id}.png`);
    }
  });
});
