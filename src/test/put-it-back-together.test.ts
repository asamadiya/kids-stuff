import { describe, it, expect } from 'vitest';
import {
  EMPTY_SLOTS, PANEL_ROLES, PUT_IT_BACK_TOGETHER_META, ROLE_WORD, SCENARIOS, TOTAL_ENDINGS,
  alternativeFrames, coverageOf, endingKey, isAccepted, isFull, lastLineOf, lift, looseRoles,
  narrate, orderOf, panelOf, place, placeAt, plateLines, plateTitle, runOf, scenarioById,
  scatterOf, shift,
} from '../sel/put-it-back-together';
import type { PanelRole, Scenario } from '../sel/put-it-back-together';

/** Every order of the five panels: 120 of them. */
function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [[...items]];
  const out: T[][] = [];
  items.forEach((item, i) => {
    for (const rest of permutations([...items.slice(0, i), ...items.slice(i + 1)])) out.push([item, ...rest]);
  });
  return out;
}
const ORDERS: PanelRole[][] = permutations(PANEL_ROLES);

const acceptedOrders = (s: Scenario) => ORDERS.filter((o) => isAccepted(s, o));
const turnedAwayOrders = (s: Scenario) => ORDERS.filter((o) => !isAccepted(s, o));

const framesOf = (s: Scenario) => [s.opening, ...s.panels, ...s.accepted, ...s.turnedAway];
const textOf = (s: Scenario) =>
  [s.title, s.where, ...framesOf(s).flatMap((f) => [f.line, f.alt])].join(' ');

describe('the panels of a repair', () => {
  it('there are exactly five moves, and none of them is a magic word', () => {
    expect(PANEL_ROLES).toEqual(['stop', 'notice', 'own', 'offer', 'check']);
    expect(ORDERS).toHaveLength(120);
    for (const role of PANEL_ROLES) expect(ROLE_WORD[role]).toBeTruthy();
    expect(Object.values(ROLE_WORD).join(' ')).not.toMatch(/sorry/i);
  });

  it('every scenario carries one panel per move, and its own drawing for each', () => {
    for (const s of SCENARIOS) {
      expect(s.panels, s.id).toHaveLength(PANEL_ROLES.length);
      expect(s.panels.map((p) => p.role).sort()).toEqual([...PANEL_ROLES].sort());
      for (const role of PANEL_ROLES) expect(panelOf(s, role).role).toBe(role);
    }
  });

  it('has an establishing frame and both endings drawn, never one of them written only', () => {
    for (const s of SCENARIOS) {
      expect(s.opening.kind, s.id).toBe('opening');
      expect(s.accepted.length, s.id).toBeGreaterThanOrEqual(1);
      expect(s.turnedAway.length, s.id).toBeGreaterThanOrEqual(1);
      for (const f of framesOf(s)) {
        expect(f.image, `${s.id} image`).toMatch(/^put-it-back-together-[a-z0-9-]+$/);
        expect(f.alt.length, `${s.id} alt`).toBeGreaterThan(20);
      }
    }
  });

  it('names every drawing exactly once across the whole exercise', () => {
    const images = SCENARIOS.flatMap((s) => framesOf(s).map((f) => f.image));
    expect(new Set(images).size).toBe(images.length);
  });

  it('gives at least one turned-away ending a second frame, the next day', () => {
    expect(SCENARIOS.filter((s) => s.turnedAway.length === 2).length).toBeGreaterThanOrEqual(2);
  });
});

describe('nothing here encodes a correct order', () => {
  it('no scenario carries an answer, a solution or a score of any kind', () => {
    for (const s of SCENARIOS) {
      const keys = Object.keys(s);
      for (const forbidden of ['correct', 'answer', 'solution', 'right', 'best', 'score', 'points', 'stars']) {
        expect(keys, s.id).not.toContain(forbidden);
      }
      // the only order-shaped field is the faded alternative, and it is one of many
      expect(keys.filter((k) => Array.isArray((s as unknown as Record<string, unknown>)[k]))).toEqual(
        ['panels', 'accepted', 'turnedAway', 'alternative'],
      );
    }
  });

  it('half of the hundred and twenty orders end with the other person back in it', () => {
    for (const s of SCENARIOS) {
      expect(acceptedOrders(s).length, s.id).toBe(60);
      expect(turnedAwayOrders(s).length, s.id).toBe(60);
    }
  });

  it('leaves three of the five panels free to sit in any slot at all', () => {
    for (const s of SCENARIOS) {
      const hinged: PanelRole[] = [s.hinge.before, s.hinge.after];
      const free = PANEL_ROLES.filter((r) => !hinged.includes(r));
      expect(free, s.id).toHaveLength(3);
      for (const role of free) {
        const places = new Set(acceptedOrders(s).map((o) => o.indexOf(role)));
        expect(places, `${s.id}/${role}`).toEqual(new Set([0, 1, 2, 3, 4]));
      }
      // even the hinged pair moves: neither is pinned to one slot
      for (const role of hinged) {
        expect(new Set(acceptedOrders(s).map((o) => o.indexOf(role))).size, `${s.id}/${role}`).toBeGreaterThan(1);
      }
    }
  });

  it('shows an alternative that is merely one road among sixty', () => {
    for (const s of SCENARIOS) {
      expect([...s.alternative].sort(), s.id).toEqual([...PANEL_ROLES].sort());
      expect(isAccepted(s, s.alternative), s.id).toBe(true);
      expect(acceptedOrders(s).length, s.id).toBeGreaterThan(1);
      expect(alternativeFrames(s).map((f) => f.kind)).toEqual(['panel', 'panel', 'panel', 'panel', 'panel']);
    }
  });

  it('lets a road that looks helpful fail outright: fixing it first is not enough', () => {
    for (const s of SCENARIOS) {
      const fixFirst = turnedAwayOrders(s).filter((o) => o[0] === 'offer');
      expect(fixFirst.length, s.id).toBeGreaterThan(0);
    }
  });
});

describe('running the strip he built', () => {
  it('plays his panels in his order, then the ending his order arrived at', () => {
    for (const s of SCENARIOS) {
      for (const order of [ORDERS[0], ORDERS[37], ORDERS[119], [...s.alternative]]) {
        const frames = runOf(s, order);
        expect(frames.slice(0, 5).map((f) => f.line)).toEqual(order.map((r) => panelOf(s, r).line));
        expect(frames.slice(5)).toEqual(isAccepted(s, order) ? s.accepted : s.turnedAway);
      }
    }
  });

  it('runs the same way every time, so an experiment can be repeated', () => {
    for (const s of SCENARIOS) {
      for (const order of ORDERS) {
        expect(runOf(s, order)).toEqual(runOf(s, order));
        expect(isAccepted(s, order)).toBe(isAccepted(s, order));
      }
      expect(scatterOf(s.id, 'own')).toEqual(scatterOf(s.id, 'own'));
    }
    expect(scatterOf('tower', 'own')).not.toEqual(scatterOf('tower', 'check'));
  });

  it('flips the ending when the hinged pair is swapped, and only then', () => {
    for (const s of SCENARIOS) {
      const good = acceptedOrders(s)[0];
      const i = good.indexOf(s.hinge.before);
      const j = good.indexOf(s.hinge.after);
      const swapped = good.map((r, k) => (k === i ? good[j] : k === j ? good[i] : r));
      expect(isAccepted(s, swapped), s.id).toBe(false);
    }
  });

  it('narrates his order and nothing else', () => {
    const s = SCENARIOS[0];
    const order: PanelRole[] = ['check', 'offer', 'own', 'notice', 'stop'];
    const said = narrate(s, order);
    expect(said).toBe(runOf(s, order).map((f) => f.line).join(' '));
    expect(said).toContain(panelOf(s, 'check').line);
    expect(said).toBe(`${order.map((r) => panelOf(s, r).line).join(' ')} ${s.turnedAway.map((f) => f.line).join(' ')}`);
  });

  it('refuses to call an unfinished strip anything at all', () => {
    const s = SCENARIOS[0];
    expect(isAccepted(s, ['stop', 'notice'])).toBe(false);
    expect(orderOf(EMPTY_SLOTS)).toBeNull();
    expect(orderOf(['stop', 'notice', 'own', 'offer', null])).toBeNull();
  });
});

describe('the voice of the guide', () => {
  it('never praises, corrects, scolds or moralises', () => {
    const all = SCENARIOS.map(textOf).join(' ');
    expect(all).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
    expect(all).not.toMatch(/should|must|always remember|be kind|next time|proud|nice job|bad boy/i);
    expect(all).not.toMatch(/!/);
    expect(`${PUT_IT_BACK_TOGETHER_META.note} ${PUT_IT_BACK_TOGETHER_META.eyebrow}`)
      .not.toMatch(/great|well done|good job|correct|wrong|naughty|should/i);
  });

  it('speaks to him in the second person and in the past tense on every panel', () => {
    for (const s of SCENARIOS) {
      expect(s.opening.line.startsWith('You '), s.id).toBe(true);
      for (const p of s.panels) {
        expect(p.line.startsWith('You '), `${s.id}/${p.role}`).toBe(true);
        expect(p.line, `${s.id}/${p.role}`).toMatch(/\.$/);
      }
    }
  });

  it('narrates both endings in the same flat voice: no consolation, no instruction', () => {
    for (const s of SCENARIOS) {
      for (const f of [...s.accepted, ...s.turnedAway]) {
        expect(f.kind).toBe('ending');
        expect(f.line, s.id).not.toMatch(/you (can|could|will|would|are)\b/i);
        expect(f.line, s.id).not.toMatch(/never mind|it is (ok|fine)|try again|do not worry/i);
        expect(f.line, s.id).toMatch(/\.$/);
      }
    }
  });
});

describe('the readout measures, it does not score', () => {
  it('counts endings walked through, out of the endings that exist', () => {
    expect(TOTAL_ENDINGS).toBe(SCENARIOS.length * 2);
    expect(coverageOf([]).line).toBe(`You have seen 0 of the ${TOTAL_ENDINGS} endings.`);
    expect(coverageOf([]).line).not.toMatch(/right|of your|score/i);
  });

  it('counts a road once, however often it is walked, and ignores what it does not know', () => {
    const key = endingKey('tower', true);
    expect(coverageOf([key, key, key]).seen).toBe(1);
    expect(coverageOf([key, endingKey('tower', false)]).seen).toBe(2);
    expect(coverageOf(['made-up:thing']).seen).toBe(0);
  });

  it('treats both endings of a scenario as equally worth having seen', () => {
    expect(coverageOf(SCENARIOS.map((s) => endingKey(s.id, true))).seen).toBe(SCENARIOS.length);
    expect(coverageOf(SCENARIOS.map((s) => endingKey(s.id, false))).seen).toBe(SCENARIOS.length);
  });
});

describe('laying the panels out', () => {
  it('fills the first empty slot and leaves the rest of the pile alone', () => {
    let slots = place(EMPTY_SLOTS, 'own');
    expect(slots[0]).toBe('own');
    expect(looseRoles(slots)).toEqual(['stop', 'notice', 'offer', 'check']);
    slots = place(slots, 'own');
    expect(slots).toEqual(['own', null, null, null, null]);
    expect(isFull(slots)).toBe(false);
  });

  it('drops a panel into a named slot, taking it out of wherever it was', () => {
    const slots = placeAt(place(EMPTY_SLOTS, 'own'), 3, 'own');
    expect(slots).toEqual([null, null, null, 'own', null]);
    expect(placeAt(EMPTY_SLOTS, 9, 'own')).toEqual(EMPTY_SLOTS);
  });

  it('lifts a panel back onto the paper and shuffles one along, for the keyboard', () => {
    const built = PANEL_ROLES.reduce<ReturnType<typeof place>>((s, r) => place(s, r), EMPTY_SLOTS);
    expect(isFull(built)).toBe(true);
    expect(orderOf(built)).toEqual([...PANEL_ROLES]);
    expect(shift(built, 0, 1)).toEqual(['notice', 'stop', 'own', 'offer', 'check']);
    expect(shift(built, 0, -1)).toEqual([...PANEL_ROLES]);
    expect(shift(built, 4, 1)).toEqual([...PANEL_ROLES]);
    expect(looseRoles(lift(built, 2))).toEqual(['own']);
  });
});

describe('what he can take away', () => {
  it('finds a scenario by name and titles its plate after it', () => {
    for (const s of SCENARIOS) {
      expect(scenarioById(s.id)).toBe(s);
      expect(plateTitle(s)).toContain(s.title);
    }
    expect(scenarioById('not-a-scenario')).toBeUndefined();
  });

  it('prints the order he made and the world it left behind, with no verdict', () => {
    const s = SCENARIOS[0];
    const order: PanelRole[] = ['offer', 'check', 'stop', 'notice', 'own'];
    const lines = plateLines(s, order);
    expect(lines[0]).toContain(ROLE_WORD.offer);
    expect(lines[1]).toBe(lastLineOf(s, order));
    expect(lines.join(' ')).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
  });
});
