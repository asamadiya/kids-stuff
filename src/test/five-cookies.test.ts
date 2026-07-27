import { describe, expect, it } from 'vitest';
import {
  FIVE_COOKIES_META, SCENARIOS,
  adjust, allAllocations, claimLines, compareLines, describeSpread, emptyShares,
  everyoneMet, isComplete, metCount, outcomeFor, outcomes, people, placed,
  plateLines, plateTitle, remaining, scenarioById, servedLines, splitLine, word,
} from '../sel/five-cookies';
import type { Scenario } from '../sel/five-cookies';

const FACES = [
  'angry', 'annoyed', 'bored', 'calm', 'confident', 'confused', 'curious', 'delighted',
  'disappointed', 'embarrassed', 'excited', 'frustrated', 'grateful', 'happy', 'hopeful',
  'jealous', 'lonely', 'loved', 'nervous', 'overwhelmed', 'proud', 'sad', 'scared', 'shy',
  'silly', 'surprised', 'tired', 'worried',
];

/** Praise, blame, and any word that would rank one way of splitting over another. */
const FORBIDDEN = /great|well done|good job|correct|wrong|naughty|fair|unfair|should have|selfish|greedy|kind of you|nice job|best way|right way|bad|winner|score|point/i;

const everyString = (s: Scenario): string[] => [
  s.setting, s.alt, s.unit, s.unitPlural,
  ...s.claimants.flatMap((c) => [c.claim, c.name, ...Object.values(c.reaction)]),
];

describe('five-cookies: shape', () => {
  it('declares the meta the section wires up', () => {
    expect(FIVE_COOKIES_META.id).toBe('five-cookies');
    expect(FIVE_COOKIES_META.title).toBe('Five Cookies');
    expect(FIVE_COOKIES_META.eyebrow.split(/\s+/).length).toBeLessThanOrEqual(3);
    expect(FIVE_COOKIES_META.note.length).toBeGreaterThan(20);
  });

  it('ships four to six boards with unique ids and unique art', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(4);
    expect(SCENARIOS.length).toBeLessThanOrEqual(6);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
    const plates = SCENARIOS.map((s) => s.plate);
    expect(new Set(plates).size).toBe(plates.length);
    for (const p of plates) expect(p).toMatch(/^five-cookies-[a-z0-9-]+-p\d$/);
  });

  it('gives every board three or four claimants, each with a different kind of claim', () => {
    for (const s of SCENARIOS) {
      expect(s.claimants.length).toBeGreaterThanOrEqual(3);
      expect(s.claimants.length).toBeLessThanOrEqual(4);
      expect(new Set(s.claimants.map((c) => c.id)).size).toBe(s.claimants.length);
      expect(new Set(s.claimants.map((c) => c.kind)).size).toBe(s.claimants.length);
      expect(s.units).toBeGreaterThan(0);
      expect(s.alt.length).toBeGreaterThan(30);
    }
  });

  it('gives every claimant a waiting portrait and one for each outcome, all from the drawn faces', () => {
    for (const s of SCENARIOS) {
      for (const c of s.claimants) {
        for (const key of ['waiting', 'met', 'short', 'none'] as const) {
          expect(FACES).toContain(c.portrait[key]);
        }
        for (const key of ['met', 'short', 'none'] as const) {
          expect(c.reaction[key].length).toBeGreaterThan(10);
        }
      }
    }
  });

  it('carries no field that could hold a correct answer', () => {
    const banned = ['correct', 'answer', 'best', 'right', 'score', 'points', 'stars', 'ideal', 'solution', 'expected'];
    const walk = (value: unknown): void => {
      if (Array.isArray(value)) { value.forEach(walk); return; }
      if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          expect(banned).not.toContain(k.toLowerCase());
          walk(v);
        }
      }
    };
    walk(SCENARIOS);
  });

  it('exactly one claimant across the whole set is Rikki himself', () => {
    const you = SCENARIOS.flatMap((s) => s.claimants).filter((c) => c.isYou);
    expect(you.length).toBe(1);
    expect(you[0].name).toBe('You');
  });
});

describe('five-cookies: no praise, no moralising', () => {
  it('keeps every authored string clear of praise, blame and ranking words', () => {
    for (const s of SCENARIOS) {
      for (const line of everyString(s)) expect(line).not.toMatch(FORBIDDEN);
    }
    expect(FIVE_COOKIES_META.note).not.toMatch(FORBIDDEN);
    expect(FIVE_COOKIES_META.title + FIVE_COOKIES_META.eyebrow).not.toMatch(FORBIDDEN);
  });

  it('keeps every generated line clear of them too', () => {
    for (const s of SCENARIOS) {
      for (const shares of allAllocations(s.units, s.claimants.length)) {
        for (const line of servedLines(s, shares)) expect(line).not.toMatch(FORBIDDEN);
      }
      const all = allAllocations(s.units, s.claimants.length);
      for (const line of compareLines(s, all[0], all[all.length - 1])) {
        expect(line).not.toMatch(FORBIDDEN);
      }
      for (const line of claimLines(s)) expect(line).not.toMatch(FORBIDDEN);
    }
  });
});

describe('five-cookies: the boards cannot be satisfied', () => {
  it('has no allocation on any board that meets every claim at once', () => {
    for (const s of SCENARIOS) {
      const all = allAllocations(s.units, s.claimants.length);
      expect(all.length).toBeGreaterThan(0);
      for (const shares of all) {
        expect(placed(shares)).toBe(s.units);
        expect(everyoneMet(s, shares)).toBe(false);
      }
    }
  });

  it('nonetheless lets every single claim be met by some allocation on its own board', () => {
    for (const s of SCENARIOS) {
      const all = allAllocations(s.units, s.claimants.length);
      s.claimants.forEach((c, i) => {
        const reachable = all.some((shares) => outcomeFor(s, shares, i) === 'met');
        expect(reachable, `${s.id}/${c.id} can never be met`).toBe(true);
      });
    }
  });

  it('leaves at least one board where an even-handed split still leaves somebody short', () => {
    const boards = SCENARIOS.map((s) => {
      const n = s.claimants.length;
      const base = Math.floor(s.units / n);
      const shares = s.claimants.map((_, i) => base + (i < s.units % n ? 1 : 0));
      return metCount(s, shares) < n;
    });
    expect(boards.every(Boolean)).toBe(true);
  });

  it('leaves at least one board where the claims asked for no more than there is, and it still cannot be done', () => {
    const tight = SCENARIOS.filter(
      (s) => s.claimants.reduce((sum, c) => sum + c.asks, 0) <= s.units,
    );
    expect(tight.length).toBeGreaterThan(0);
    for (const s of tight) {
      expect(s.claimants.some((c) => c.kind === 'work')).toBe(true);
    }
  });
});

describe('five-cookies: outcomes', () => {
  it('gives nobody who got nothing anything but "none"', () => {
    for (const s of SCENARIOS) {
      for (const shares of allAllocations(s.units, s.claimants.length)) {
        shares.forEach((n, i) => {
          if (n === 0) expect(outcomeFor(s, shares, i)).toBe('none');
        });
      }
    }
  });

  it('meets a work claim only by ending up with strictly more than anybody else', () => {
    const s = scenarioById('cookies');
    const worker = s.claimants.findIndex((c) => c.kind === 'work');
    for (const shares of allAllocations(s.units, s.claimants.length)) {
      const others = shares.filter((_, i) => i !== worker);
      const met = outcomeFor(s, shares, worker) === 'met';
      expect(met).toBe(shares[worker] > Math.max(...others));
    }
  });

  it('meets a counted claim exactly at the number it asked for', () => {
    for (const s of SCENARIOS) {
      for (const shares of allAllocations(s.units, s.claimants.length)) {
        s.claimants.forEach((c, i) => {
          if (c.kind === 'work') return;
          expect(outcomeFor(s, shares, i) === 'met').toBe(shares[i] >= c.asks);
        });
      }
    }
  });

  it('is deterministic: the same board and the same split read the same every time', () => {
    const s = scenarioById('console');
    const shares = [1, 1, 1, 0];
    expect(outcomes(s, shares)).toEqual(outcomes(s, shares));
    expect(servedLines(s, shares)).toEqual(servedLines(s, shares));
    expect(servedLines(s, shares).length).toBe(s.claimants.length + 1);
  });
});

describe('five-cookies: laying the units out', () => {
  it('starts empty and counts what is left', () => {
    for (const s of SCENARIOS) {
      const zero = emptyShares(s);
      expect(zero.length).toBe(s.claimants.length);
      expect(placed(zero)).toBe(0);
      expect(remaining(s, zero)).toBe(s.units);
      expect(isComplete(s, zero)).toBe(s.units === 0);
    }
  });

  it('never lets more go out than there is, and never goes below nothing', () => {
    const s = scenarioById('dinosaurs');
    let shares = emptyShares(s);
    for (let i = 0; i < 40; i += 1) shares = adjust(s, shares, i % s.claimants.length, 3);
    expect(placed(shares)).toBe(s.units);
    for (let i = 0; i < 40; i += 1) shares = adjust(s, shares, 0, -3);
    expect(shares[0]).toBe(0);
    expect(shares.every((n) => n >= 0)).toBe(true);
  });

  it('is complete only when every unit is on a plate', () => {
    const s = scenarioById('car-seats');
    expect(isComplete(s, [1, 0, 0])).toBe(false);
    expect(isComplete(s, [1, 1, 0])).toBe(true);
  });
});

describe('five-cookies: what is said back', () => {
  it('states the split as plain words in board order', () => {
    expect(splitLine([2, 2, 1])).toBe('Two, two, one.');
    expect(splitLine([0, 5, 0])).toBe('None, five, none.');
    expect(word(0)).toBe('none');
    expect(word(7)).toBe('seven');
    expect(people(0)).toBe('nobody');
    expect(people(1)).toBe('one person');
    expect(people(3)).toBe('three people');
  });

  it('says each claim once when the board opens, and ranks none of them', () => {
    for (const s of SCENARIOS) {
      const lines = claimLines(s);
      expect(lines.length).toBe(s.claimants.length + 1);
      expect(lines[0]).toBe(s.setting);
      expect(new Set(lines).size).toBe(lines.length);
    }
  });

  it('describes the spread without saying whether it was a good one', () => {
    expect(describeSpread([2, 2, 2])).toBe('gave everyone the same');
    expect(describeSpread([5, 0, 0])).toBe('gave it all to one person');
    expect(describeSpread([2, 2, 1])).toBe('gave nearly the same to everyone');
    expect(describeSpread([4, 1, 0])).toBe('gave a lot to some and a little to others');
  });

  it('puts two allocations side by side and names who moved', () => {
    const s = scenarioById('cookies');
    const lines = compareLines(s, [2, 2, 1], [3, 1, 1]);
    expect(lines[0]).toContain('First way: Two, two, one.');
    expect(lines[0]).toContain('Second way: Three, one, one.');
    expect(lines.some((l) => l.startsWith('Sam had two and then three.'))).toBe(true);
    expect(lines.some((l) => l.startsWith('Nina had two and then one.'))).toBe(true);
    expect(lines.some((l) => l.includes('Bo'))).toBe(false);
  });

  it('says so plainly when the second way moved nothing', () => {
    const s = scenarioById('cookies');
    const lines = compareLines(s, [2, 2, 1], [2, 2, 1]);
    expect(lines.some((l) => l.includes('Nothing moved'))).toBe(true);
  });

  it('never states a ratio of right answers to wrong ones', () => {
    const s = scenarioById('cookies');
    for (const line of compareLines(s, [2, 2, 1], [3, 1, 1])) {
      expect(line).not.toMatch(/\d\s*\/\s*\d/);
      expect(line).not.toMatch(/out of/i);
    }
  });
});

describe('five-cookies: the kept plate', () => {
  it('captions a plate with both allocations and every claim', () => {
    const s = scenarioById('console');
    const lines = plateLines(s, [1, 1, 1, 0], [0, 2, 1, 0]);
    expect(lines[0]).toBe('Turns: three.');
    expect(lines[1]).toBe('First way: One, one, one, none.');
    expect(lines[2]).toBe('Second way: None, two, one, none.');
    for (const c of s.claimants) expect(lines[3]).toContain(c.name);
    for (const line of lines) expect(line).not.toMatch(FORBIDDEN);
  });

  it('captions a plate with only the first allocation when there is no second', () => {
    const s = scenarioById('console');
    expect(plateLines(s, [1, 1, 1, 0], null).length).toBe(3);
  });

  it('titles a board by what there is on it', () => {
    expect(plateTitle(scenarioById('cookies'))).toBe('Five cookies');
    expect(plateTitle(scenarioById('car-seats'))).toBe('Two seats');
    expect(plateTitle(scenarioById('dinosaurs'))).toBe('Seven dinosaurs');
  });

  it('falls back to the first board for an id it does not know', () => {
    expect(scenarioById('no-such-board')).toBe(SCENARIOS[0]);
  });
});

describe('five-cookies: allAllocations', () => {
  it('enumerates every composition exactly once', () => {
    const all = allAllocations(3, 3);
    expect(all.length).toBe(10);
    expect(new Set(all.map((a) => a.join(','))).size).toBe(10);
    expect(all.every((a) => a.reduce((x, y) => x + y, 0) === 3)).toBe(true);
    expect(allAllocations(0, 3)).toEqual([[0, 0, 0]]);
  });
});
