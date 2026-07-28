import { describe, it, expect } from 'vitest';
import {
  ACTION_FIELD,
  DRAWINGS,
  GESTURES,
  PALM,
  PLACES,
  ROAD_IDS,
  STRIPS,
  THINGS,
  WHATHAPPENSNEXT_META,
  actionWordOf,
  allPanels,
  arrowOf,
  bothWalked,
  coverageLine,
  nextStripId,
  otherRoad,
  panelsOf,
  placeSays,
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
import type { ArrowLine, Strip } from '../sel/what-happens-next';

/** Words that would praise, judge, or grade. None may appear in any copy. */
const MORALISING = /\b(great|well done|good job|good|correct|incorrect|wrong|right way|naughty|kind|kindly|unkind|nice|nicer|better|best|should|shouldn't|proud|shame|selfish|mean|bad|oops|try again|not quite)\b/i;

/** Fields that would encode a preferred branch. None may exist at any depth. */
const VERDICT_KEYS = ['answer', 'answerid', 'correct', 'right', 'best', 'good', 'score', 'points', 'stars', 'win', 'prefer', 'preferred', 'weight', 'value'];

const allCopy = (): string[] =>
  STRIPS.flatMap((s) => [
    s.setupWord,
    placeSays(s.place),
    ...s.roads.flatMap((r) => [actionWordOf(s, r), r.afterWord, r.laterWord]),
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

  it('gives every strip exactly five plates: p0, and two per road, with the action drawn', () => {
    for (const s of STRIPS) {
      expect(panelsOf(s)).toHaveLength(5);
      for (const r of s.roads) {
        expect(Object.keys(r).sort()).toEqual([
          'after', 'afterWord', 'gesture', 'id', 'later', 'laterWord', 'thing',
        ]);
      }
      expect(Object.keys(s).sort()).toEqual(['id', 'other', 'place', 'roads', 'setup', 'setupWord']);
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
    expect(panels).toHaveLength(STRIPS.length * 5);
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
      expect([a.after, a.later]).toHaveLength(2);
      expect([b.after, b.later]).toHaveLength(2);
      // neither road's description is starved of detail relative to the other
      const len = (r: Strip['roads'][number]) => r.after.alt.length + r.later.alt.length;
      const ratio = len(a) / len(b);
      expect(ratio).toBeGreaterThan(0.6);
      expect(ratio).toBeLessThan(1.7);
    }
  });
});

describe('what-happens-next: the action is drawn, not painted', () => {
  /**
   * FAILS IF REVERTED: put an `action` panel or an `actionWord` string back on a
   * road and this fails. Those two fields are how `last-truck-p1b` came to be
   * captioned "You hold the truck out to him" over a painting of the other boy
   * handing it to you, and how `p1a` delivered a verdict with a face.
   */
  it('gives a road no field that could hold an action picture or a hand-typed action sentence', () => {
    const PICTUREISH = /^(action|image|img|panel|plate|picture|photo|art|src)/i;
    for (const s of STRIPS) {
      for (const r of s.roads) {
        for (const key of Object.keys(r)) {
          expect(PICTUREISH.test(key), `${s.id}/${r.id}.${key}`).toBe(false);
        }
        expect('actionWord' in r).toBe(false);
        expect(GESTURES).toContain(r.gesture);
        expect(Object.keys(THINGS)).toContain(r.thing);
      }
    }
  });

  /**
   * FAILS IF REVERTED: derive `actionWord` from `road.id` again and this fails.
   * `road.id` is only 'a' | 'b' and means something different in every strip —
   * `dinosaur-mia` road a is a lift with no transfer in it at all — so a
   * generator keyed on it draws a handover wherever a second road exists.
   */
  it('derives the action sentence from the gesture and the thing, never from the road id', () => {
    const said = new Map<string, string>();
    for (const s of STRIPS) {
      for (const r of s.roads) {
        const word = actionWordOf(s, r);
        expect(word.startsWith('You ')).toBe(true);
        expect(word.trim().endsWith('.')).toBe(true);
        if (r.gesture !== 'still') expect(word).toContain(THINGS[r.thing].the);
        // the same (gesture, thing, them) always makes the same sentence
        const key = `${r.gesture}|${r.thing}|${s.other.them}`;
        const before = said.get(key);
        if (before !== undefined) expect(word).toBe(before);
        said.set(key, word);
      }
    }
    // the two roads of a strip share an id set, so a sentence keyed on the id
    // could not tell these apart; keyed on the gesture, it does
    const dino = stripById('dinosaur-mia') as Strip;
    expect(roadOf(dino, 'a').gesture).toBe('raise');
    expect(actionWordOf(dino, roadOf(dino, 'a'))).toBe('You lift the dinosaur up out of reach.');
    const truck = stripById('last-truck') as Strip;
    expect(roadOf(truck, 'b').gesture).toBe('give');
    expect(actionWordOf(truck, roadOf(truck, 'b'))).toBe('You hold the truck out to him.');
    expect(actionWordOf(dino, roadOf(dino, 'b'))).toBe('You hold the dinosaur out to her.');
  });

  /**
   * FAILS IF REVERTED: this is `p1b`'s inversion made impossible. Only `give`
   * has a second pair of hands, and its arrow ends at those hands, so a handover
   * cannot be drawn running the other way or drawn at all where none happened.
   */
  it('draws a second pair of hands only for a handover, with the arrow always ending at them', () => {
    for (const g of GESTURES) {
      const d = DRAWINGS[g];
      if (g === 'give') {
        expect(d.theirs).toHaveLength(1);
        expect(d.arrow).toBe('to-them');
        const line = arrowOf(d);
        expect(line).not.toBeNull();
        expect((line as ArrowLine).x1).toBeLessThan((line as ArrowLine).x2);
        expect((line as ArrowLine).x2).toBeLessThan(d.theirs[0].x);
        expect((line as ArrowLine).x1).toBeGreaterThan(d.yours[0].x);
      } else {
        expect(d.theirs, g).toHaveLength(0);
        expect(d.arrow, g).not.toBe('to-them');
        expect(arrowOf(d), g).not.toBe(undefined);
      }
      expect(d.yours.length, g).toBeGreaterThanOrEqual(1);
      for (const h of [...d.yours, ...d.theirs]) {
        expect(h.x).toBeGreaterThan(0);
        expect(h.x).toBeLessThan(ACTION_FIELD.width);
        expect(h.y).toBeGreaterThan(0);
        expect(h.y).toBeLessThan(ACTION_FIELD.height);
      }
      expect(d.thing.x).toBeGreaterThan(0);
      expect(d.thing.x).toBeLessThan(ACTION_FIELD.width);
      expect(d.thing.y).toBeGreaterThan(0);
      expect(d.thing.y).toBeLessThan(ACTION_FIELD.height);
    }
  });

  /**
   * The golden record. A change to a gesture's drawing has to be made here as
   * well, which is the point: the renderer cannot be quietly re-tuned.
   */
  it('holds the drawn geometry of every gesture as a record that must be re-approved', () => {
    const shape = Object.fromEntries(
      GESTURES.map((g) => {
        const d = DRAWINGS[g];
        const a = arrowOf(d);
        return [g, [
          `thing ${d.thing.x},${d.thing.y}`,
          `yours ${d.yours.map((h) => `${h.x},${h.y}@${h.turn}`).join(' ')}`,
          `theirs ${d.theirs.map((h) => `${h.x},${h.y}@${h.turn}`).join(' ')}`,
          `arrow ${a ? `${a.x1},${a.y1}->${a.x2},${a.y2}` : 'none'}`,
        ].join(' | ')];
      }),
    );
    expect(shape).toEqual({
      hold: 'thing 100,88 | yours 74,98@40 126,98@-40 | theirs  | arrow none',
      give: 'thing 100,82 | yours 46,90@90 | theirs 154,90@-90 | arrow 126,82->128,90',
      raise: 'thing 100,36 | yours 78,66@15 122,66@-15 | theirs  | arrow 100,80->100,62',
      point: 'thing 144,92 | yours 50,92@90 | theirs  | arrow 76,92->118,92',
      still: 'thing 100,124 | yours 76,84@180 124,84@180 | theirs  | arrow none',
      move: 'thing 84,90 | yours 46,90@90 | theirs  | arrow 110,90->154,90',
      release: 'thing 100,120 | yours 72,54@180 128,54@180 | theirs  | arrow 100,94->144,64',
      go: 'thing 70,118 | yours 56,88@165 88,88@195 | theirs  | arrow 70,92->114,62',
      work: 'thing 100,92 | yours 70,84@55 130,84@-55 | theirs  | arrow none',
    });
  });

  it('draws every thing with real strokes and names it for the sentence', () => {
    for (const [id, thing] of Object.entries(THINGS)) {
      expect(thing.the.startsWith('the ') || thing.the.startsWith('your '), id).toBe(true);
      expect(thing.glyph.length, id).toBeGreaterThan(1);
      for (const d of thing.glyph) expect(d, id).toMatch(/^M/);
    }
    expect(PALM).toMatch(/^M/);
  });
});

describe('what-happens-next: every plate is in the strip’s place', () => {
  /**
   * FAILS IF REVERTED: declare a plate in another setting and the compiler stops
   * it — `NoInfer` pins each `Panel.at` to the strip's `place`. This is the
   * runtime half. `last-truck-p3b` is a gravel yard with adults standing about
   * against a classroom strip; it could not be declared honestly and was
   * dropped, and its beat moved onto the old p1b plate, which is indoors.
   */
  it('has every panel declare the strip’s place, and never uses the outdoor plate', () => {
    for (const s of STRIPS) {
      expect(Object.keys(PLACES)).toContain(s.place);
      for (const p of panelsOf(s)) expect(p.at, `${s.id}/${p.image}`).toBe(s.place);
      expect(placeSays(s.place).length).toBeGreaterThan(4);
    }
    const used = new Set(allPanels().map((p) => p.image));
    expect(used.has('what-happens-next-last-truck-p3b')).toBe(false);
    expect(used.has('what-happens-next-last-truck-p1a')).toBe(false);
    expect(used.has('what-happens-next-last-truck-p1b')).toBe(true);
  });

  /**
   * FAILS IF REVERTED: swap-left in Hold the Line changed Leo's shirt colour
   * between plates and the alt asserted it. A garment colour is a claim one
   * plate makes about another, and these plates do not hold it.
   */
  it('never names the colour of anybody’s clothes in an alt', () => {
    const COLOUR = /\b(red|blue|green|olive|grey|gray|yellow|orange|purple|pink|brown|black|white|rust|teal|tan|cream|beige|navy|mustard|ochre|terracotta|maroon|khaki)\b/i;
    for (const p of allPanels()) expect(COLOUR.test(p.alt), p.image).toBe(false);
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
