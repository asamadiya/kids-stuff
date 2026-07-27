import { describe, it, expect } from 'vitest';
import {
  HAGGLES, MAX_OFFERS, ONE_SWING_TWO_KIDS_META, PORTRAITS, SCENARIOS, TAKES_ANYTHING,
  addPlayed, amount, clampShare, clockRanOut, coverageText, endingText, offerLine, plateLines,
  reactTo, scenarioById, settle, splitText, spokenSplit,
} from '../sel/one-swing-two-kids';
import type { EndingKind, Outcome, Reaction, Scenario } from '../sel/one-swing-two-kids';

const byId = (id: string): Scenario => {
  const s = scenarioById(id);
  if (!s) throw new Error(`no scenario ${id}`);
  return s;
};

const splits = (s: Scenario): number[] => Array.from({ length: s.total + 1 }, (_, i) => i);

/** Every reaction the exercise can produce, over every split and every round. */
const everyReaction = (s: Scenario): Reaction[] => {
  const out: Reaction[] = [];
  for (const a of splits(s)) {
    for (const b of splits(s)) {
      for (const c of splits(s)) {
        for (const history of [[a], [a, b], [a, b, c]]) {
          const r = reactTo(s, history);
          if (r) out.push(r);
        }
      }
    }
  }
  return out;
};

const everyOutcome = (s: Scenario): Outcome[] => {
  const endings: EndingKind[] = ['accepted', 'took', 'left', 'ranOut'];
  const out: Outcome[] = [];
  for (const a of splits(s)) {
    for (const b of splits(s)) {
      for (const ending of endings) {
        out.push(settle(s, [a], ending));
        out.push(settle(s, [a, b], ending));
      }
    }
  }
  return out;
};

describe('the shape of the thing', () => {
  it('names itself the way every bench does', () => {
    expect(ONE_SWING_TWO_KIDS_META.id).toBe('one-swing-two-kids');
    expect(ONE_SWING_TWO_KIDS_META.title).toBe('One Swing, Two Kids');
    expect(ONE_SWING_TWO_KIDS_META.eyebrow.split(' ').length).toBeLessThanOrEqual(3);
    expect(ONE_SWING_TWO_KIDS_META.note.length).toBeGreaterThan(20);
  });

  it('ships a complete set of situations, each with a setup and an outcome plate', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(4);
    expect(SCENARIOS.length).toBeLessThanOrEqual(6);
    const ids = SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const pictures = SCENARIOS.flatMap((s) => [s.setup, s.outcome]);
    expect(new Set(pictures).size).toBe(pictures.length);
    for (const p of pictures) expect(p.startsWith('one-swing-two-kids-')).toBe(true);
    for (const s of SCENARIOS) {
      expect(s.setupAlt.length).toBeGreaterThan(20);
      expect(s.outcomeAlt.length).toBeGreaterThan(20);
      expect(s.short.length).toBeGreaterThan(3);
      expect(s.total).toBeGreaterThan(2);
      expect(Number.isInteger(s.total)).toBe(true);
    }
  });

  it('borrows only faces that are already painted', () => {
    for (const s of SCENARIOS) {
      const faces = [s.faces.waiting, s.faces.accepted, s.faces.plenty, s.faces.none,
        s.faces.ranOut, s.faces.left, ...s.faces.counter];
      for (const f of faces) expect(PORTRAITS).toContain(f);
      expect(s.faces.counter.length).toBeGreaterThan(0);
    }
    expect(PORTRAITS).toHaveLength(28);
  });

  it('carries no field that could hold a preferred split', () => {
    const forbidden = ['best', 'correct', 'ideal', 'answer', 'target', 'score', 'points', 'stars', 'expected'];
    for (const s of SCENARIOS) {
      for (const key of Object.keys(s)) expect(forbidden).not.toContain(key);
      for (const key of Object.keys(s.after)) expect(forbidden).not.toContain(key);
      for (const key of Object.keys(s.reactions)) expect(forbidden).not.toContain(key);
    }
  });

  it('lets every whole split be offered, both ends included', () => {
    for (const s of SCENARIOS) {
      for (const mine of splits(s)) {
        expect(clampShare(s, mine)).toBe(mine);
        const r = reactTo(s, [s.total - mine]);
        expect(r).not.toBeNull();
      }
      expect(clampShare(s, -4)).toBe(0);
      expect(clampShare(s, s.total + 9)).toBe(s.total);
      expect(clampShare(s, Number.NaN)).toBe(0);
    }
  });

  it('keeps the content invariants that say what each person can do', () => {
    for (const s of SCENARIOS) {
      expect(s.reactions.counters !== null).toBe(HAGGLES.includes(s.rule));
      expect(s.reactions.nodsNone !== null).toBe(TAKES_ANYTHING.includes(s.rule));
      expect(s.reactions.leaves !== null).toBe(s.rule === 'walks-away');
      expect(s.after.left !== null).toBe(s.rule === 'walks-away');
      expect(s.walkBelow !== null).toBe(s.rule === 'walks-away');
      expect(s.guide !== null).toBe(s.rule === 'cannot-counter');
    }
  });
});

describe('nothing about him is scored, and nothing is moralised', () => {
  const PRAISE = /\b(great|well done|good job|good|nice|nicely|kind|kindly|fair|unfair|correct|incorrect|wrong|right|naughty|bad|mean|selfish|greedy|should|better|best|proud of you|shame)\b/i;

  const allText = (): string[] => {
    const text: string[] = [ONE_SWING_TWO_KIDS_META.note, ONE_SWING_TWO_KIDS_META.title, ONE_SWING_TWO_KIDS_META.eyebrow];
    for (const s of SCENARIOS) {
      text.push(s.stop, s.thing, s.short, s.setupAlt, s.outcomeAlt, s.other);
      if (s.guide) text.push(s.guide);
      text.push(...Object.values(s.reactions).filter((v): v is string => typeof v === 'string'));
      text.push(...Object.values(s.after).filter((v): v is string => typeof v === 'string'));
      text.push(...everyReaction(s).map((r) => r.line));
      text.push(...everyOutcome(s).flatMap((o) => [...o.lines, endingText(s, o), ...plateLines(s, o)]));
      for (const mine of splits(s)) {
        text.push(offerLine(s, mine), splitText(s, mine), spokenSplit(s, mine));
      }
    }
    text.push(coverageText([]), coverageText(['swing', 'swing', 'tablet']));
    return text;
  };

  it('never praises, blames or grades anything he chose', () => {
    for (const line of allText()) expect(line).not.toMatch(PRAISE);
  });

  it('reads back coverage, never a ratio of hits to misses', () => {
    expect(coverageText([])).toBe(`You have played 0 of the ${SCENARIOS.length} situations.`);
    expect(coverageText(['swing', 'swing'])).toContain('1 of the');
    expect(coverageText(['swing', 'tablet', 'not-a-situation'])).toContain('2 of the');
    expect(addPlayed(['swing'], 'swing')).toEqual(['swing']);
    expect(addPlayed(['swing'], 'tablet')).toEqual(['swing', 'tablet']);
  });

  it('reads the ending as two numbers and a count of offers', () => {
    const s = byId('swing');
    const o = settle(s, [4], 'accepted');
    expect(endingText(s, o)).toBe('You made 1 offer. You ended at 6 and 4.');
    expect(endingText(s, settle(s, [3, 4], 'accepted'))).toBe('You made 2 offers. You ended at 6 and 4.');
  });
});

describe('the same play always settles the same way', () => {
  it('answers identically however many times it is asked', () => {
    for (const s of SCENARIOS) {
      for (const history of [[0], [1], [s.total], [2, 3], [2, 3, 4]]) {
        expect(reactTo(s, history)).toEqual(reactTo(s, history));
        expect(settle(s, history, 'accepted')).toEqual(settle(s, history, 'accepted'));
      }
    }
  });

  it('has nothing to say before the first offer', () => {
    for (const s of SCENARIOS) expect(reactTo(s, [])).toBeNull();
  });

  it('always divides the whole thing and nothing more', () => {
    for (const s of SCENARIOS) {
      for (const o of everyOutcome(s)) {
        expect(o.mine + o.theirs).toBeLessThanOrEqual(s.total);
        expect(o.mine).toBeGreaterThanOrEqual(0);
        expect(o.theirs).toBeGreaterThanOrEqual(0);
        if (o.kind === 'settled') expect(o.mine + o.theirs).toBe(s.total);
      }
    }
  });
});

describe('every counterparty runs a different, undisclosed rule', () => {
  it('gives no two of them the same rule', () => {
    const rules = SCENARIOS.map((s) => s.rule);
    expect(new Set(rules).size).toBe(rules.length);
  });

  it('lets no even-or-meaner split be accepted by everyone', () => {
    for (const share of [0, 0.25, 0.5]) {
      const accepted = SCENARIOS.filter((s) => {
        const theirs = Math.round(s.total * share);
        return reactTo(s, [theirs])?.kind === 'accepted';
      });
      expect(accepted.length).toBeLessThan(SCENARIOS.length);
    }
  });

  it('makes a generous split easy to buy and its consequences uneven', () => {
    for (const share of [0.75, 1]) {
      const accepted = SCENARIOS.filter((s) => {
        const theirs = Math.round(s.total * share);
        return reactTo(s, [theirs])?.kind === 'accepted';
      });
      expect(accepted).toHaveLength(SCENARIOS.length);
      const asked = SCENARIOS.filter((s) => settle(s, [Math.round(s.total * share)], 'accepted').asked);
      expect(asked.length).toBeGreaterThan(0);
      expect(asked.length).toBeLessThan(SCENARIOS.length);
    }
    for (const s of SCENARIOS) expect(settle(s, [s.total], 'accepted').mine).toBe(0);
  });

  it('gives each haggler a split they take and a split they will not', () => {
    for (const s of SCENARIOS.filter((c) => HAGGLES.includes(c.rule))) {
      const kinds = splits(s).map((theirs) => reactTo(s, [theirs])?.kind);
      expect(kinds).toContain('accepted');
      expect(kinds.some((k) => k === 'counter' || k === 'left')).toBe(true);
    }
  });

  it('moves the one who splits the difference, and does not move the one who holds out', () => {
    const sam = byId('swing');
    const first = reactTo(sam, [2]);
    expect(first?.kind).toBe('counter');
    expect(first?.ask).toBe(3);
    expect(reactTo(sam, [2, 3])?.kind).toBe('accepted');
    expect(reactTo(sam, [4])?.kind).toBe('accepted');
    expect(reactTo(sam, [0])?.ask).toBe(2);
    expect(reactTo(sam, [0, 0])?.ask).toBe(1);

    const tomas = byId('console');
    expect(reactTo(tomas, [2])?.ask).toBe(8);
    expect(reactTo(tomas, [2, 5])?.ask).toBe(8);
    expect(reactTo(tomas, [2, 5, 7])?.ask).toBe(8);
    expect(reactTo(tomas, [8])?.kind).toBe('accepted');
  });

  it('takes anything at all from the boy who takes anything, including nothing', () => {
    const ravi = byId('snack');
    for (const theirs of splits(ravi)) expect(reactTo(ravi, [theirs])?.kind).toBe('accepted');
    expect(everyReaction(ravi).every((r) => r.ask === null)).toBe(true);
  });

  it('walks away below a line, and that costs the whole negotiation', () => {
    const nadia = byId('window');
    expect(nadia.walkBelow).toBe(3);
    expect(reactTo(nadia, [2])?.kind).toBe('left');
    expect(reactTo(nadia, [0])?.kind).toBe('left');
    expect(reactTo(nadia, [3])?.kind).toBe('counter');
    expect(reactTo(nadia, [4])?.kind).toBe('accepted');
    const gone = settle(nadia, [2], 'left');
    expect(gone.kind).toBe('left');
    expect(gone.theirs).toBe(0);
    expect(gone.asked).toBe(false);
  });
});

describe('some roads cost something, and one generous road fails outright', () => {
  it('hands over everything and gets nothing back', () => {
    const ravi = byId('snack');
    const o = settle(ravi, [ravi.total], 'accepted');
    expect(o.kind).toBe('settled');
    expect(o.mine).toBe(0);
    expect(o.theirs).toBe(ravi.total);
    expect(o.asked).toBe(false);
    expect(o.lines.join(' ')).toContain('sandpit');
  });

  it('never lets that boy ask about tomorrow, however the crackers went', () => {
    const ravi = byId('snack');
    expect(ravi.after.tomorrowYes).toBeNull();
    for (const theirs of splits(ravi)) expect(settle(ravi, [theirs], 'accepted').asked).toBe(false);
  });

  it('lets a hard split still end with a question about tomorrow', () => {
    const sam = byId('swing');
    const o = settle(sam, [5], 'accepted');
    expect(o.mine).toBe(5);
    expect(o.asked).toBe(true);
    expect(settle(sam, [4, 4], 'accepted').asked).toBe(true);
  });

  it('lets the girl who walks away only ask when there was no haggling', () => {
    const nadia = byId('window');
    expect(settle(nadia, [4], 'accepted').asked).toBe(true);
    expect(settle(nadia, [3, 4], 'accepted').asked).toBe(false);
  });

  it('gives the whole thing and the silence to whoever is left behind', () => {
    const nadia = byId('window');
    const gone = settle(nadia, [1], 'left');
    expect(gone.mine).toBe(nadia.total);
    expect(gone.lines.join(' ')).toContain('middle seat');
  });
});

describe('the two-year-old is not a negotiation', () => {
  const mia = byId('tablet');

  it('says so in one sentence rather than pretending otherwise', () => {
    expect(mia.guide).toMatch(/cannot make an offer back/i);
    expect(SCENARIOS.filter((s) => s.guide !== null)).toHaveLength(1);
  });

  it('never counters, whatever he slides', () => {
    for (const theirs of splits(mia)) {
      const r = reactTo(mia, [theirs]);
      expect(r?.kind).toBe('accepted');
      expect(r?.ask).toBeNull();
    }
    expect(mia.after.tomorrowYes).toBeNull();
  });

  it('draws taking it all and giving it all honestly, and neither is marked', () => {
    const took = settle(mia, [0], 'accepted');
    expect(took.mine).toBe(mia.total);
    expect(took.face).toBe('sad');
    expect(took.lines.join(' ')).toContain('Mia did not get the tablet.');

    const gave = settle(mia, [mia.total], 'accepted');
    expect(gave.mine).toBe(0);
    expect(gave.asked).toBe(false);
    expect(gave.lines.join(' ')).toContain('You did not watch anything.');
  });
});

describe('the clock, which is nobody in the room', () => {
  it('allows three offers and then takes the decision away', () => {
    expect(MAX_OFFERS).toBe(3);
    const tomas = byId('console');
    expect(clockRanOut([2], reactTo(tomas, [2]))).toBe(false);
    expect(clockRanOut([2, 3], reactTo(tomas, [2, 3]))).toBe(false);
    expect(clockRanOut([2, 3, 4], reactTo(tomas, [2, 3, 4]))).toBe(true);
    const out = settle(tomas, [2, 3, 4], 'ranOut');
    expect(out.kind).toBe('ranOut');
    expect(out.mine).toBe(0);
    expect(out.theirs).toBe(0);
    expect(out.offers).toBe(3);
    expect(out.asked).toBe(false);
    expect(out.lines[0]).toContain('The console stayed off.');
  });

  it('does not run out when the last offer was taken', () => {
    const sam = byId('swing');
    expect(clockRanOut([4, 4, 4], reactTo(sam, [4, 4, 4]))).toBe(false);
  });

  it('settles at their counter when he takes it', () => {
    const sam = byId('swing');
    const counter = reactTo(sam, [2]);
    expect(counter?.ask).toBe(3);
    const o = settle(sam, [2], 'took');
    expect(o.theirs).toBe(3);
    expect(o.mine).toBe(7);
    expect(o.offers).toBe(1);
  });
});

describe('the words the room hears', () => {
  it('states the offer as two numbers in the second person', () => {
    const sam = byId('swing');
    expect(offerLine(sam, 8)).toBe('You offered 8 minutes for you and 2 for Sam.');
    expect(offerLine(sam, 9)).toContain('9 minutes for you and 1 for Sam');
    expect(amount(sam, 1)).toBe('1 minute');
    expect(amount(byId('snack'), 3)).toBe('3 pieces');
    expect(splitText(sam, 6)).toBe('6 for you · 4 for Sam');
    expect(spokenSplit(sam, 6)).toBe('6 minutes for you, 4 for Sam');
  });

  it('states the counter as what they want and what it leaves', () => {
    const line = reactTo(byId('swing'), [2])?.line ?? '';
    expect(line).toContain('shook his head');
    expect(line).toContain('3 minutes');
    expect(line).toContain('7 for you');
  });

  it('puts the numbers and the aftermath on the plate, in that order', () => {
    const sam = byId('swing');
    const lines = plateLines(sam, settle(sam, [4], 'accepted'));
    expect(lines[0]).toBe('the swing, 10 minutes to divide.');
    expect(lines[1]).toBe('You 6. Sam 4.');
    expect(lines[2]).toContain('You made 1 offer.');
    expect(lines.length).toBeGreaterThan(4);
  });
});
