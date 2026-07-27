import { describe, it, expect } from 'vitest';
import {
  AMBIGUITY_NOTE, EVENT_DECK, FEELING_RULES, MAX_PINS, THE_FEELING_RULE_META,
  addPin, cardAt, cardById, clampPos, coverageLine, dealOrder, differenceLine, faceStrength,
  facePath, keptSummary, markerWord, nearestStop, pinLines, plateLines, posFromFraction,
  removePin, ruleById, ruleSummary, scenePath, stopAt, stopX, stopsWord,
} from '../sel/the-feeling-rule';
import type { Pin } from '../sel/the-feeling-rule';
import { EMOTIONS } from '../games/emotions';

const PRAISE = /great|well done|good job|correct|incorrect|wrong|naughty|bad choice|nice work|perfect|excellent|should have|better|kind of you/i;
const SCORING = /score|streak|points|stars?\b|right answer|out of \d+ correct/i;

/** Every string this module can produce, so the prose rules can be checked at once. */
const allProse = (): string[] => {
  const out: string[] = [
    THE_FEELING_RULE_META.title,
    THE_FEELING_RULE_META.eyebrow,
    THE_FEELING_RULE_META.note,
    AMBIGUITY_NOTE,
    coverageLine(2, 3),
    stopsWord(2),
  ];
  for (const rule of FEELING_RULES) {
    out.push(rule.label, ...rule.stops.map((s) => s.label));
    const pins: Pin[] = EVENT_DECK.slice(0, 3).map((c, i) => ({
      eventId: c.id,
      stop: i % rule.stops.length,
    }));
    out.push(
      ...pinLines(rule, pins),
      differenceLine(rule, pins),
      ...plateLines(rule, pins),
      ruleSummary(rule, pins),
      ruleSummary(rule, []),
      keptSummary(rule, pins),
      markerWord(rule, 0),
    );
  }
  for (const c of EVENT_DECK) out.push(c.id, c.label, c.alt);
  return out.filter(Boolean);
};

describe('the feeling rule — shape of the content', () => {
  it('ships a coherent set of rules, each a real ladder of three or four stops', () => {
    expect(FEELING_RULES.length).toBeGreaterThanOrEqual(4);
    expect(FEELING_RULES.length).toBeLessThanOrEqual(6);
    for (const rule of FEELING_RULES) {
      expect(rule.stops.length).toBeGreaterThanOrEqual(3);
      expect(rule.stops.length).toBeLessThanOrEqual(4);
    }
  });

  it('orders every rule small to big and never goes backwards', () => {
    for (const rule of FEELING_RULES) {
      const sizes = rule.stops.map((s) => s.intensity);
      expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
      expect(sizes[sizes.length - 1]).toBeGreaterThan(sizes[0]);
    }
  });

  it('reuses painted portraits that already exist, one per stop, never twice', () => {
    const seen = new Set<string>();
    for (const rule of FEELING_RULES) {
      for (const s of rule.stops) {
        expect(EMOTIONS).toContain(s.key);
        expect(facePath(s)).toBe(`games/faces/${s.key}.png`);
        expect(seen.has(s.key)).toBe(false);
        seen.add(s.key);
      }
    }
  });

  it('deals events as pictures from the existing painted scenes', () => {
    expect(EVENT_DECK.length).toBeGreaterThanOrEqual(4);
    for (const c of EVENT_DECK) {
      expect(scenePath(c)).toBe(`games/scenes/${c.id}.png`);
      expect(c.alt.length).toBeGreaterThan(20);
      expect(c.label.length).toBeGreaterThan(0);
    }
    expect(new Set(EVENT_DECK.map((c) => c.id)).size).toBe(EVENT_DECK.length);
  });
});

describe('the feeling rule — nothing can be right or wrong', () => {
  it('carries no field on a stop or a card that could hold an expected answer', () => {
    const forbidden = /correct|answer|expected|target|solution|score|points|right|best/i;
    for (const rule of FEELING_RULES) {
      for (const s of rule.stops) {
        expect(Object.keys(s).sort()).toEqual(['intensity', 'key', 'label']);
      }
    }
    for (const c of EVENT_DECK) {
      expect(Object.keys(c).sort()).toEqual(['alt', 'id', 'label']);
      for (const k of Object.keys(c)) expect(k).not.toMatch(forbidden);
    }
  });

  it('never praises, moralises or scores in any string it can produce', () => {
    for (const line of allProse()) {
      expect(line, line).not.toMatch(PRAISE);
      expect(line, line).not.toMatch(SCORING);
    }
  });

  it('says once, plainly, that the same event sits at different stops for different people', () => {
    expect(AMBIGUITY_NOTE).toMatch(/different stops/i);
    expect(AMBIGUITY_NOTE).toMatch(/yours/i);
    expect(AMBIGUITY_NOTE).not.toMatch(PRAISE);
  });

  it('reads out coverage, never a ratio of right to wrong', () => {
    const line = coverageLine(2, 3);
    expect(line).toContain(`2 of the ${FEELING_RULES.length} rules`);
    expect(line).toContain('3 events');
    expect(coverageLine(0, 1)).toContain('1 event on this one');
  });
});

describe('the feeling rule — the marker', () => {
  const anger = ruleById('anger');

  it('stays on the rule, whatever it is given', () => {
    expect(clampPos(anger, -4)).toBe(0);
    expect(clampPos(anger, 99)).toBe(anger.stops.length - 1);
    expect(clampPos(anger, Number.NaN)).toBe(0);
    expect(clampPos(anger, 1.5)).toBe(1.5);
  });

  it('names the stop it is nearest to, and only that', () => {
    expect(nearestStop(anger, 0.49)).toBe(0);
    expect(nearestStop(anger, 0.51)).toBe(1);
    expect(markerWord(anger, 0)).toBe('Annoyed');
    expect(markerWord(anger, 2)).toBe('Angry');
    expect(stopAt(anger, 99).key).toBe('angry');
    expect(stopAt(anger, -3).key).toBe('annoyed');
  });

  it('cross-fades the portraits: full under the finger, faint a stop away', () => {
    expect(faceStrength(1, 1)).toBe(1);
    expect(faceStrength(1, 0)).toBeCloseTo(0.16, 5);
    expect(faceStrength(1, 2.4)).toBeCloseTo(0.16, 5);
    expect(faceStrength(0, 0.5)).toBeCloseTo(faceStrength(1, 0.5), 5);
    expect(faceStrength(0, 0.25)).toBeGreaterThan(faceStrength(1, 0.25));
  });

  it('maps a fraction along the drawing back onto the rule, and back again', () => {
    expect(posFromFraction(anger, 0)).toBe(0);
    expect(posFromFraction(anger, 1)).toBe(2);
    expect(posFromFraction(anger, -2)).toBe(0);
    expect(stopX(0, 3, 74, 686)).toBe(74);
    expect(stopX(2, 3, 74, 686)).toBe(686);
    expect(stopX(1, 3, 74, 686)).toBe(380);
    expect(stopX(0, 1, 74, 686)).toBe(74);
  });
});

describe('the feeling rule — the deck is deterministic', () => {
  it('deals the same cards in the same order for a rule, every time', () => {
    for (const rule of FEELING_RULES) {
      expect(dealOrder(rule.id).map((c) => c.id)).toEqual(dealOrder(rule.id).map((c) => c.id));
      expect(dealOrder(rule.id)).toHaveLength(EVENT_DECK.length);
      expect(new Set(dealOrder(rule.id).map((c) => c.id)).size).toBe(EVENT_DECK.length);
    }
  });

  it('walks the whole deck before it repeats, and wraps on either side', () => {
    const seen = EVENT_DECK.map((_, i) => cardAt('fear', i).id);
    expect(new Set(seen).size).toBe(EVENT_DECK.length);
    expect(cardAt('fear', EVENT_DECK.length).id).toBe(cardAt('fear', 0).id);
    expect(cardAt('fear', -1).id).toBe(cardAt('fear', EVENT_DECK.length - 1).id);
  });

  it('falls back rather than throwing on an id it does not know', () => {
    expect(ruleById('no-such-rule')).toBe(FEELING_RULES[0]);
    expect(cardById('no-such-card')).toBe(EVENT_DECK[0]);
    expect(dealOrder('no-such-rule')).toHaveLength(EVENT_DECK.length);
  });
});

describe('the feeling rule — pins are self-reports', () => {
  const sad = ruleById('sad');
  const a = EVENT_DECK[0].id;
  const b = EVENT_DECK[1].id;

  it('moves an event rather than pinning it twice', () => {
    const once = addPin([], { eventId: a, stop: 0 });
    const again = addPin(once, { eventId: a, stop: 3 });
    expect(again).toHaveLength(1);
    expect(again[0].stop).toBe(3);
  });

  it('holds a bounded number of pins, keeping the most recent', () => {
    let pins: readonly Pin[] = [];
    for (let i = 0; i < MAX_PINS + 3; i += 1) pins = addPin(pins, { eventId: `e${i}`, stop: 0 });
    expect(pins).toHaveLength(MAX_PINS);
    expect(pins[pins.length - 1].eventId).toBe(`e${MAX_PINS + 2}`);
  });

  it('takes a pin off without touching the others', () => {
    const pins = addPin(addPin([], { eventId: a, stop: 1 }), { eventId: b, stop: 2 });
    expect(removePin(pins, a).map((p) => p.eventId)).toEqual([b]);
    expect(removePin(pins, 'never-pinned')).toHaveLength(2);
  });

  it('reads back names only — the event and the word he chose', () => {
    const pins = [{ eventId: a, stop: 0 }, { eventId: b, stop: 2 }];
    const lines = pinLines(sad, pins);
    expect(lines[0]).toBe(`${cardById(a).label[0].toUpperCase()}${cardById(a).label.slice(1)}: bored.`);
    expect(lines[1]).toContain(': sad.');
    for (const l of lines) expect(l).not.toMatch(PRAISE);
  });

  it('states the difference as a measurement in stops, in the second person', () => {
    const line = differenceLine(sad, [{ eventId: a, stop: 0 }, { eventId: b, stop: 2 }]);
    expect(line).toContain('You put');
    expect(line).toContain('two stops bigger for you');
    expect(line).not.toMatch(PRAISE);
  });

  it('names whichever of the two is bigger, without ranking them', () => {
    const down = differenceLine(sad, [{ eventId: a, stop: 3 }, { eventId: b, stop: 1 }]);
    expect(down).toContain(`${cardById(a).label[0].toUpperCase()}${cardById(a).label.slice(1)} is two stops bigger`);
    const same = differenceLine(sad, [{ eventId: a, stop: 2 }, { eventId: b, stop: 2 }]);
    expect(same).toContain('same stop');
    expect(same).not.toMatch(/bigger/);
  });

  it('says nothing at all until there are two events to compare', () => {
    expect(differenceLine(sad, [])).toBe('');
    expect(differenceLine(sad, [{ eventId: a, stop: 1 }])).toBe('');
  });

  it('counts in words a five-year-old hears', () => {
    expect(stopsWord(1)).toBe('one stop');
    expect(stopsWord(-2)).toBe('two stops');
    expect(stopsWord(0)).toBe('no stops');
    expect(stopsWord(9)).toBe('9 stops');
  });
});

describe('the feeling rule — what is kept', () => {
  const joy = ruleById('joy');

  it('writes a plate of the rule and everything on it', () => {
    const pins = [{ eventId: EVENT_DECK[0].id, stop: 0 }, { eventId: EVENT_DECK[2].id, stop: 2 }];
    const lines = plateLines(joy, pins);
    expect(lines[0]).toBe('Joy: happy · excited · delighted');
    expect(lines).toHaveLength(4);
    expect(lines[3]).toContain('bigger for you');
  });

  it('writes an honest plate when nothing is on the rule', () => {
    const lines = plateLines(joy, []);
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('Nothing pinned');
  });

  it('labels a kept rule by its family and how many marks are on it', () => {
    expect(keptSummary(joy, [])).toBe('Joy · 0 marks');
    expect(keptSummary(joy, [{ eventId: EVENT_DECK[0].id, stop: 1 }])).toBe('Joy · 1 mark');
  });

  it('describes the drawing for someone who cannot see it', () => {
    expect(ruleSummary(joy, [])).toContain('Nothing pinned yet');
    expect(ruleSummary(joy, [{ eventId: EVENT_DECK[0].id, stop: 0 }])).toContain('happy');
  });
});
