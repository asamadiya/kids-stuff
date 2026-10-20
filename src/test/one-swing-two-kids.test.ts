import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  CHOICES, GROWN_UP_LABEL, ONE_SWING_TWO_KIDS_META, PLANS, SCENARIOS,
  addPlayed, choiceLabel, choose, coverageText, framesOf, isSettled, pathText, pictureOf,
  plateLines, replyOf, saidLine, scenarioById, storyLines,
} from '../sel/one-swing-two-kids';
import type { ChoiceId, Scenario } from '../sel/one-swing-two-kids';

const byId = (id: string): Scenario => {
  const s = scenarioById(id);
  if (!s) throw new Error(`no scenario ${id}`);
  return s;
};

/** Every path a child can walk: plans in any order until one goes ahead. */
const everyPath = (s: Scenario): (readonly ChoiceId[])[] => {
  const out: (readonly ChoiceId[])[] = [];
  const walk = (tried: readonly ChoiceId[]): void => {
    out.push(tried);
    if (isSettled(s, tried)) return;
    for (const c of CHOICES) {
      const next = choose(s, tried, c);
      if (next !== tried) walk(next);
    }
  };
  walk([]);
  return out;
};

const stripComments = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');

describe('the shape of the thing', () => {
  it('keeps the id and title every route is built on', () => {
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
      expect(s.where.length).toBeGreaterThan(20);
    }
  });

  it('carries no field that could hold a preferred plan', () => {
    const forbidden = ['best', 'correct', 'ideal', 'answer', 'target', 'score', 'points', 'stars', 'expected', 'right'];
    for (const s of SCENARIOS) {
      for (const key of Object.keys(s)) expect(forbidden).not.toContain(key);
      for (const r of Object.values(s.replies)) {
        expect(Object.keys(r).sort()).toEqual(['picture', 'says', 'settled']);
      }
    }
  });
});

describe('three drawn plans and a grown-up, every time', () => {
  it('offers the same three plans in every place, and the grown-up last', () => {
    expect(PLANS).toEqual(['you-first', 'them-first', 'turns']);
    expect(CHOICES).toEqual([...PLANS, 'grown-up']);
    for (const s of SCENARIOS) {
      expect(Object.keys(s.replies).sort()).toEqual([...CHOICES].sort());
    }
  });

  it('names each plan in a few words that match its drawing', () => {
    const sam = byId('swing');
    expect(choiceLabel(sam, 'you-first')).toBe('You first, then Sam');
    expect(choiceLabel(sam, 'them-first')).toBe('Sam first, then you');
    expect(choiceLabel(sam, 'turns')).toBe('Take turns: 10 pushes each');
    expect(choiceLabel(sam, 'grown-up')).toBe(GROWN_UP_LABEL);
    for (const s of SCENARIOS) {
      expect(framesOf(s, 'you-first').frames).toEqual(['you', 'them']);
      expect(framesOf(s, 'them-first').frames).toEqual(['them', 'you']);
      expect(choiceLabel(s, 'you-first').startsWith('You first')).toBe(true);
      expect(choiceLabel(s, 'them-first').startsWith(s.other)).toBe(true);
      for (const p of PLANS) expect(choiceLabel(s, p).length).toBeLessThanOrEqual(32);
    }
  });

  it('draws only the take-turns plan going round, with one mark per unit of a turn', () => {
    for (const s of SCENARIOS) {
      expect(framesOf(s, 'you-first').loops).toBe(false);
      expect(framesOf(s, 'them-first').loops).toBe(false);
      expect(framesOf(s, 'turns').loops).toBe(true);
      expect(framesOf(s, 'turns').ticks).toBe(s.turnTicks);
      expect(s.turnTicks).toBeGreaterThanOrEqual(1);
      expect(s.turnTicks).toBeLessThanOrEqual(10);
    }
    expect(framesOf(byId('swing'), 'turns').ticks).toBe(10);
  });

  it('always lets the grown-up end it, in every place, whatever was tried first', () => {
    for (const s of SCENARIOS) {
      expect(replyOf(s, 'grown-up').settled).toBe(true);
      for (const path of everyPath(s)) {
        if (isSettled(s, path)) continue;
        const asked = choose(s, path, 'grown-up');
        expect(asked).toEqual([...path, 'grown-up']);
        expect(isSettled(s, asked)).toBe(true);
      }
    }
  });

  it('describes the other child in words, never with a painted face', () => {
    for (const s of SCENARIOS) {
      expect(s.about).toContain(s.other);
      expect(s.about.length).toBeGreaterThan(20);
    }
    for (const f of ['src/sel/one-swing-two-kids.ts', 'src/components/sel/OneSwingTwoKids.tsx']) {
      expect(stripComments(readFileSync(f, 'utf8')), f).not.toMatch(/faces\//);
    }
  });
});

describe('no clock, no count of tries, nothing hidden', () => {
  /**
   * FAILS IF REVERTED: the old version held a ten-minute band, three offers and
   * a clock that could take every minute away. None of that may come back.
   */
  it('has no deadline, offer count, slider or undisclosed rule', () => {
    for (const f of ['src/sel/one-swing-two-kids.ts', 'src/components/sel/OneSwingTwoKids.tsx']) {
      const code = stripComments(readFileSync(f, 'utf8'));
      expect(code, f).not.toMatch(/MAX_OFFERS|ranOut|clockRanOut|role="slider"|CounterRule|walkBelow|minutes to divide/);
      expect(code, f).not.toMatch(/requestAnimationFrame|setInterval|setTimeout|transition|@keyframes/);
    }
  });

  it('answers every choice with a plain sentence about what happened', () => {
    for (const s of SCENARIOS) {
      for (const c of CHOICES) {
        const r = replyOf(s, c);
        expect(r.says.length).toBeGreaterThan(20);
        expect(r.says).toMatch(/[.”]$/);
      }
    }
  });

  it('gives the same answer to the same plan, so trying it twice changes nothing', () => {
    for (const s of SCENARIOS) {
      for (const c of CHOICES) {
        const once = choose(s, [], c);
        expect(choose(s, once, c)).toBe(once);
        expect(replyOf(s, c)).toBe(replyOf(s, c));
      }
    }
  });

  it('ends after a plan goes ahead, and takes nothing more after that', () => {
    for (const s of SCENARIOS) {
      for (const path of everyPath(s)) {
        expect(path.length).toBeLessThanOrEqual(CHOICES.length);
        expect(new Set(path).size).toBe(path.length);
        path.slice(0, -1).forEach((c) => expect(replyOf(s, c).settled).toBe(false));
        if (isSettled(s, path)) for (const c of CHOICES) expect(choose(s, path, c)).toBe(path);
      }
    }
    expect(isSettled(byId('swing'), [])).toBe(false);
  });

  it('shows the painted ending only where it fits what was said', () => {
    for (const s of SCENARIOS) {
      for (const c of CHOICES) {
        const p = pictureOf(s, c);
        const r = replyOf(s, c);
        if (r.picture === null) expect(p).toBeNull();
        else expect(p).toEqual({ src: s.outcome, alt: s.outcomeAlt });
        // a refusal never jumps to the ending
        if (!r.settled) expect(p).toBeNull();
      }
      expect(CHOICES.some((c) => pictureOf(s, c) !== null), s.id).toBe(true);
    }
  });
});

describe('different people meet the same plan differently', () => {
  it('has at least one plan refused somewhere, and at least one taken everywhere but by Mia', () => {
    const refusedSomewhere = PLANS.filter((p) => SCENARIOS.some((s) => !replyOf(s, p).settled));
    expect(refusedSomewhere.length).toBeGreaterThan(0);
    for (const s of SCENARIOS.filter((x) => !x.little)) {
      expect(PLANS.some((p) => replyOf(s, p).settled), s.id).toBe(true);
    }
  });

  it('lets no plan go ahead with every friend except the one that hands it over first', () => {
    const friends = SCENARIOS.filter((s) => !s.little);
    expect(friends.length).toBeGreaterThanOrEqual(3);
    expect(friends.some((s) => !replyOf(s, 'you-first').settled)).toBe(true);
    expect(friends.some((s) => !replyOf(s, 'turns').settled)).toBe(true);
    // Handing it over first is always taken, which is exactly why it is not a lever:
    expect(friends.every((s) => replyOf(s, 'them-first').settled)).toBe(true);
  });

  it('lets a plan that goes ahead still cost something', () => {
    expect(replyOf(byId('snack'), 'you-first').settled).toBe(true);
    expect(replyOf(byId('snack'), 'you-first').says).toContain('on his own');
    expect(replyOf(byId('console'), 'them-first').says).toContain('take you home');
    expect(replyOf(byId('swing'), 'them-first').says).toContain('short go');
  });
});

describe('the two-year-old is not a negotiation', () => {
  const mia = byId('tablet');

  it('says so in one sentence rather than pretending otherwise', () => {
    expect(mia.little).toBe(true);
    expect(mia.guide).toMatch(/two/i);
    expect(SCENARIOS.filter((s) => s.guide !== null)).toEqual([mia]);
    expect(SCENARIOS.filter((s) => s.little)).toEqual([mia]);
  });

  it('takes none of the three plans, so only the grown-up ends it', () => {
    for (const p of PLANS) expect(replyOf(mia, p).settled).toBe(false);
    expect(choose(mia, ['you-first', 'them-first', 'turns'], 'grown-up')).toHaveLength(4);
    expect(isSettled(mia, ['you-first', 'grown-up'])).toBe(true);
  });
});

describe('nothing about him is scored, and nothing is moralised', () => {
  const PRAISE = /\b(great|well done|good job|good|nice|nicely|kind|kindly|fair|unfair|correct|incorrect|wrong|right|naughty|bad|mean|selfish|greedy|should|better|best|proud of you|shame)\b/i;

  const allText = (): string[] => {
    const text: string[] = [ONE_SWING_TWO_KIDS_META.note, ONE_SWING_TWO_KIDS_META.title, ONE_SWING_TWO_KIDS_META.eyebrow];
    for (const s of SCENARIOS) {
      text.push(s.where, s.about, s.short, s.setupAlt, s.outcomeAlt, s.other, s.turn, s.grownUp);
      if (s.guide) text.push(s.guide);
      for (const c of CHOICES) text.push(choiceLabel(s, c), saidLine(s, c), replyOf(s, c).says);
      for (const path of everyPath(s)) text.push(...plateLines(s, path), pathText(s, path));
    }
    text.push(coverageText([]), coverageText(['swing', 'swing', 'tablet']));
    return text;
  };

  it('never praises, blames or grades anything he chose', () => {
    for (const line of allText()) expect(line, line).not.toMatch(PRAISE);
  });

  it('reads back coverage, never a ratio of hits to misses', () => {
    expect(coverageText([])).toBe(`You have played 0 of the ${SCENARIOS.length} situations.`);
    expect(coverageText(['swing', 'swing'])).toContain('1 of the');
    expect(coverageText(['swing', 'tablet', 'not-a-situation'])).toContain('2 of the');
    expect(addPlayed(['swing'], 'swing')).toEqual(['swing']);
    expect(addPlayed(['swing'], 'tablet')).toEqual(['swing', 'tablet']);
  });
});

describe('the words the room hears', () => {
  it('reads back what he said, then what the other child did', () => {
    const sam = byId('swing');
    expect(saidLine(sam, 'turns')).toBe('You said, “Take turns: 10 pushes each.”');
    expect(saidLine(sam, 'grown-up')).toBe('You asked Papa to help.');
    expect(storyLines(sam, ['you-first', 'turns'])).toEqual([
      `You said, “You first, then Sam.” ${replyOf(sam, 'you-first').says}`,
      `You said, “Take turns: 10 pushes each.” ${replyOf(sam, 'turns').says}`,
    ]);
  });

  it('puts the situation and then the path on the plate, in order', () => {
    const sam = byId('swing');
    const lines = plateLines(sam, ['you-first', 'grown-up']);
    expect(lines[0]).toBe(sam.where);
    expect(lines).toHaveLength(3);
    expect(lines[2]).toContain('You asked Papa to help.');
    expect(pathText(sam, ['you-first', 'grown-up'])).toBe('You first, then Sam · Ask a grown-up to help');
  });
});
