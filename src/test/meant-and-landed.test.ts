import { describe, expect, it } from 'vitest';
import {
  LANDINGS,
  MEANT_AND_LANDED_META,
  MOMENTS,
  SIDE_KEYS,
  THIRD_CLAUSE,
  THOUGHTS,
  TOTAL_SIDES,
  assemble,
  coverage,
  coverageReadout,
  landedClause,
  landingById,
  meantClause,
  momentById,
  pickOf,
  plateLines,
  sentenceText,
  sideId,
  sideOf,
  thoughtById,
  type Pick,
  type Side,
} from '../sel/meant-and-landed';

const PRAISE = /great|well done|good job|correct|wrong|naughty|nice work|excellent|bad choice/i;
const SCORING_KEYS = /^(answer|correct|expected|right|score|points|stars|streak|match|pairs?|fits?|best)$/i;

const allSides = (): Side[] => MOMENTS.flatMap((m) => SIDE_KEYS.map((k) => sideOf(m, k)));

const walk = (value: unknown, visit: (key: string, v: unknown) => void): void => {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      visit(k, v);
      walk(v, visit);
    }
  }
};

describe('meant-and-landed: the paper', () => {
  it('names itself for the shelf', () => {
    expect(MEANT_AND_LANDED_META.id).toBe('meant-and-landed');
    expect(MEANT_AND_LANDED_META.title).toBe('Meant and Landed');
    expect(MEANT_AND_LANDED_META.eyebrow.split(' ').length).toBeLessThanOrEqual(3);
    expect(MEANT_AND_LANDED_META.note.length).toBeGreaterThan(20);
  });

  it('ships a complete set of moments, each with both directions', () => {
    expect(MOMENTS.length).toBeGreaterThanOrEqual(4);
    expect(MOMENTS.length).toBeLessThanOrEqual(6);
    expect(new Set(MOMENTS.map((m) => m.id)).size).toBe(MOMENTS.length);
    for (const moment of MOMENTS) {
      expect(moment.picture).toMatch(/^(scenes|sel|faces)\/[a-z0-9-]+$/);
      expect(moment.alt.length).toBeGreaterThan(40);
      expect(moment.caption.length).toBeGreaterThan(20);
      for (const key of SIDE_KEYS) {
        const side = sideOf(moment, key);
        expect(side.key).toBe(key);
        expect(side.ask.length).toBeGreaterThan(20);
        expect(side.flip.length).toBeGreaterThan(4);
        expect(side.actor.subject).not.toBe(side.receiver.subject);
        // exactly one of the two is him
        expect([side.actor.isYou, side.receiver.isYou].filter(Boolean).length).toBe(1);
      }
    }
  });

  it('turns each moment around: the actor and receiver swap and nothing else', () => {
    for (const moment of MOMENTS) {
      const front = sideOf(moment, 'front');
      const turned = sideOf(moment, 'turned');
      expect(front.receiver.isYou).toBe(true);
      expect(turned.actor.isYou).toBe(true);
      expect(turned.receiver.subject).toBe(front.actor.subject);
      expect(front.receiver.subject).toBe(turned.actor.subject);
    }
  });

  it('finds a moment by id and nothing by a made-up one', () => {
    expect(momentById(MOMENTS[0].id)?.title).toBe(MOMENTS[0].title);
    expect(momentById('not-a-moment')).toBeNull();
  });
});

describe('meant-and-landed: the two rails are independent', () => {
  it('has six thought chips, each with its own mark', () => {
    expect(THOUGHTS).toHaveLength(6);
    expect(new Set(THOUGHTS.map((t) => t.id)).size).toBe(6);
    expect(new Set(THOUGHTS.map((t) => t.glyph)).size).toBe(6);
  });

  it('has the full set of painted portraits', () => {
    expect(LANDINGS).toHaveLength(28);
    expect(new Set(LANDINGS.map((l) => l.id)).size).toBe(28);
    for (const landing of LANDINGS) {
      expect(landing.picture).toBe(`faces/${landing.word}`);
      expect(landing.alt).toContain(landing.word);
    }
  });

  it('carries no field that could hold a right answer', () => {
    for (const bundle of [MOMENTS, THOUGHTS, LANDINGS]) {
      walk(bundle, (key) => {
        expect(key).not.toMatch(SCORING_KEYS);
      });
    }
  });

  it('never mentions a portrait from the thought rail, or the reverse', () => {
    const thoughtText = JSON.stringify(THOUGHTS).toLowerCase();
    const momentText = JSON.stringify(MOMENTS).toLowerCase();
    for (const landing of LANDINGS) {
      const word = new RegExp(`\\b${landing.word}\\b`);
      expect(thoughtText).not.toMatch(word);
      expect(momentText).not.toMatch(word);
    }
    const landingText = JSON.stringify(LANDINGS).toLowerCase();
    for (const thought of THOUGHTS) {
      expect(landingText).not.toContain(thought.id);
    }
  });

  it('says nothing praising or moralising anywhere in the content', () => {
    for (const bundle of [MOMENTS, THOUGHTS, LANDINGS, MEANT_AND_LANDED_META]) {
      expect(JSON.stringify(bundle)).not.toMatch(PRAISE);
    }
  });

  it('looks up a chip or a portrait, and nothing when nothing is set', () => {
    expect(thoughtById('joke')?.glyph).toBe('joke');
    expect(thoughtById(null)).toBeNull();
    expect(landingById('proud')?.word).toBe('proud');
    expect(landingById(null)).toBeNull();
  });
});

describe('meant-and-landed: the sentence', () => {
  it('assembles every combination there is, in three clauses', () => {
    let built = 0;
    for (const side of allSides()) {
      for (const thought of THOUGHTS) {
        for (const landing of LANDINGS) {
          const clauses = assemble(side, thought, landing);
          expect(clauses).toHaveLength(3);
          expect(clauses[2]).toBe(THIRD_CLAUSE);
          for (const clause of clauses) {
            expect(clause).toMatch(/^[A-Z].*\.$/);
            expect(clause).not.toMatch(/ {2}/);
            expect(clause).not.toMatch(/\{|\}/);
          }
          expect(clauses[0]).toContain(side.actor.subject);
          expect(clauses[1]).toContain(side.receiver.subject);
          expect(clauses[1]).toContain(landing.word);
          built += 1;
        }
      }
    }
    expect(built).toBe(MOMENTS.length * 2 * THOUGHTS.length * LANDINGS.length);
  });

  it('stays grammatical whichever side of the moment he is on', () => {
    for (const side of allSides()) {
      for (const thought of THOUGHTS) {
        const clause = meantClause(side, thought);
        expect(clause).not.toMatch(/\byou was\b/i);
        expect(clause).not.toMatch(/\byou did not knew\b/i);
        expect(clause).not.toMatch(/\b(\w+) \1\b/i);
      }
    }
  });

  it('names the other person in the chip that is about not seeing them', () => {
    const unseen = THOUGHTS.find((t) => t.id === 'unseen');
    expect(unseen).toBeDefined();
    const moment = MOMENTS[0];
    expect(meantClause(sideOf(moment, 'front'), unseen!)).toBe(
      `${moment.sides.front.actor.subject} did not know you were there.`,
    );
    expect(meantClause(sideOf(moment, 'turned'), unseen!)).toBe(
      `You did not know ${moment.sides.turned.receiver.subject} was there.`,
    );
  });

  it('lets the absurd pairing run exactly like the obvious one', () => {
    const side = sideOf(MOMENTS[0], 'front');
    const help = THOUGHTS.find((t) => t.id === 'help')!;
    const joke = THOUGHTS.find((t) => t.id === 'joke')!;
    const furious = LANDINGS.find((l) => l.word === 'angry')!;
    const delighted = LANDINGS.find((l) => l.word === 'delighted')!;
    const odd = assemble(side, help, furious);
    const plain = assemble(side, joke, furious);
    const cheerful = assemble(side, help, delighted);
    for (const built of [odd, plain, cheerful]) {
      expect(built).toHaveLength(3);
      expect(built[2]).toBe(THIRD_CLAUSE);
    }
    expect(sentenceText(odd).split('.').length).toBe(sentenceText(cheerful).split('.').length);
  });

  it('adds nothing after the third clause', () => {
    const built = sentenceText(assemble(sideOf(MOMENTS[1], 'front'), THOUGHTS[0], LANDINGS[0]));
    expect(built.endsWith(THIRD_CLAUSE)).toBe(true);
    expect(built).not.toMatch(/\?/);
    expect(built.split('. ').length).toBe(3);
  });

  it('builds the landing clause from the receiver alone', () => {
    const side = sideOf(MOMENTS[2], 'front');
    expect(landedClause(side, LANDINGS[0])).toBe(`You felt ${LANDINGS[0].word}.`);
  });

  it('is deterministic: the same three inputs give the same three clauses', () => {
    const side = sideOf(MOMENTS[3], 'turned');
    const once = assemble(side, THOUGHTS[4], LANDINGS[9]);
    const twice = assemble(side, THOUGHTS[4], LANDINGS[9]);
    expect(once).toEqual(twice);
  });
});

describe('meant-and-landed: coverage, not score', () => {
  const joined = (moments: number): Record<string, Pick> => {
    const picks: Record<string, Pick> = {};
    let left = moments;
    for (const moment of MOMENTS) {
      for (const key of SIDE_KEYS) {
        if (left <= 0) break;
        picks[sideId(moment.id, key)] = { thought: THOUGHTS[0].id, landing: LANDINGS[0].id };
        left -= 1;
      }
    }
    return picks;
  };

  it('counts sides walked over, out of all the sides there are', () => {
    expect(TOTAL_SIDES).toBe(MOMENTS.length * 2);
    expect(coverage({})).toEqual({ done: 0, total: TOTAL_SIDES });
    expect(coverage(joined(3))).toEqual({ done: 3, total: TOTAL_SIDES });
    expect(coverage(joined(TOTAL_SIDES))).toEqual({ done: TOTAL_SIDES, total: TOTAL_SIDES });
  });

  it('does not count a side with only one rail set', () => {
    const half: Record<string, Pick> = {
      [sideId(MOMENTS[0].id, 'front')]: { thought: THOUGHTS[1].id, landing: null },
      [sideId(MOMENTS[0].id, 'turned')]: { thought: null, landing: LANDINGS[3].id },
    };
    expect(coverage(half).done).toBe(0);
  });

  it('reads out as a measure and never as a tally of right answers', () => {
    const readout = coverageReadout(joined(2));
    expect(readout).toBe(`You have looked at 2 of the ${TOTAL_SIDES} sides.`);
    expect(readout).not.toMatch(PRAISE);
    expect(readout).not.toMatch(/%|score|point/i);
  });

  it('hands back an empty pick for a side never touched', () => {
    expect(pickOf({}, sideId(MOMENTS[0].id, 'front'))).toEqual({ thought: null, landing: null });
  });
});

describe('meant-and-landed: the kept plate', () => {
  it('writes a line for each side that has both rails, and none for the others', () => {
    expect(plateLines('A. B. C.', null)).toEqual(['As it happened: A. B. C.']);
    expect(plateLines(null, 'D. E. F.')).toEqual(['Turned around: D. E. F.']);
    expect(plateLines('A.', 'B.')).toHaveLength(2);
    expect(plateLines(null, null)).toEqual([]);
  });
});
