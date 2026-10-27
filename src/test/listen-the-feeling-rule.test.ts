import { describe, expect, it, vi } from 'vitest';
import { textKey } from '../audio/readAloud';
import {
  AMBIGUITY_NOTE, EVENT_DECK, EVENT_LABEL, FAMILY_LABEL, FEELING_RULES, LISTEN, MARKER_LABEL, SIZE_HINT,
  THE_FEELING_RULE_META,
  addPin, cardAt, compareLine, differenceLine, listenLines, nearestStop, pinLines, removePin, ruleById,
} from '../sel/the-feeling-rule';
import type { Pin } from '../sel/the-feeling-rule';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Every line a read button in The Feeling Rule can ask for must be one the
 * clip builder makes, or the button says "No recording of this yet."
 */

/** One screen state, as the component holds it. */
interface State {
  readonly ruleId: string;
  readonly pos: number;
  readonly cursor: number;
  readonly pins: readonly Pin[];
  readonly told: boolean;
}

const START: State = { ruleId: FEELING_RULES[0].id, pos: 0, cursor: 0, pins: [], told: false };

/** What each button on screen reads in this state, mirroring the component's render. */
const buttonsIn = (s: State): (readonly string[])[] => {
  const rule = ruleById(s.ruleId);
  const out: (readonly string[])[] = [
    LISTEN.title(),
    LISTEN.rule(rule),
    LISTEN.families(),
    LISTEN.marker(rule, s.pos),
    LISTEN.event(cardAt(s.ruleId, s.cursor)),
  ];
  if (!s.told) out.push(LISTEN.note());
  if (s.pins.length) out.push(LISTEN.reading(rule, s.pins));
  if (LISTEN.difference(s.pins).length) out.push(LISTEN.difference(s.pins));
  return out;
};

/** The component's handlers, as pure transitions. */
type Action =
  | { readonly kind: 'rule'; readonly id: string }
  | { readonly kind: 'move'; readonly to: number }
  | { readonly kind: 'drop' }
  | { readonly kind: 'deal' }
  | { readonly kind: 'off'; readonly eventId: string }
  | { readonly kind: 'clear' }
  | { readonly kind: 'load'; readonly ruleId: string; readonly pins: readonly Pin[] };

const act = (s: State, a: Action): State => {
  const rule = ruleById(s.ruleId);
  switch (a.kind) {
    case 'rule': return { ruleId: a.id, pos: 0, cursor: 0, pins: [], told: s.told };
    case 'move': return { ...s, pos: Math.min(rule.stops.length - 1, Math.max(0, a.to)) };
    case 'drop': return {
      ...s,
      pins: addPin(s.pins, { eventId: cardAt(s.ruleId, s.cursor).id, stop: nearestStop(rule, s.pos) }),
      cursor: s.cursor + 1,
      told: true,
    };
    case 'deal': return { ...s, cursor: s.cursor + 1 };
    case 'off': return { ...s, pins: removePin(s.pins, a.eventId) };
    case 'clear': return { ...s, pins: [] };
    case 'load': return {
      ruleId: a.ruleId,
      pins: a.pins,
      pos: a.pins.length ? a.pins[a.pins.length - 1].stop : 0,
      cursor: 0,
      told: true,
    };
  }
};

/** A small deterministic generator, so the walk is the same every run. */
const lcg = (seed: number) => () => {
  seed = (seed * 1103515245 + 12345) % 2 ** 31;
  return seed / 2 ** 31;
};

/** Every state reachable in a long seeded walk over the handlers, plus every pin and every ordered pair of pins. */
const reachable = (): State[] => {
  const out: State[] = [START];
  const rnd = lcg(7);
  const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rnd() * xs.length)];
  const kept: { ruleId: string; pins: readonly Pin[] }[] = [];
  let s = START;
  for (let n = 0; n < 20000; n += 1) {
    const rule = ruleById(s.ruleId);
    const r = rnd();
    let a: Action;
    if (r < 0.05) a = { kind: 'rule', id: pick(FEELING_RULES).id };
    else if (r < 0.4) a = { kind: 'move', to: Math.floor(rnd() * rule.stops.length) + (rnd() < 0.3 ? rnd() - 0.5 : 0) };
    else if (r < 0.7) a = { kind: 'drop' };
    else if (r < 0.8) a = { kind: 'deal' };
    else if (r < 0.88 && s.pins.length) a = { kind: 'off', eventId: pick(s.pins).eventId };
    else if (r < 0.92) a = { kind: 'clear' };
    else if (r < 0.96 && s.pins.length) {
      kept.push({ ruleId: s.ruleId, pins: s.pins });
      continue;
    } else if (kept.length) a = { kind: 'load', ...pick(kept) };
    else continue;
    s = act(s, a);
    out.push(s);
  }
  for (const rule of FEELING_RULES) {
    for (const a of EVENT_DECK) {
      rule.stops.forEach((_, i) => {
        const one = addPin([], { eventId: a.id, stop: i });
        out.push({ ruleId: rule.id, pos: i, cursor: 0, pins: one, told: true });
        for (const b of EVENT_DECK) {
          rule.stops.forEach((__, j) => {
            out.push({ ruleId: rule.id, pos: j, cursor: 1, pins: addPin(one, { eventId: b.id, stop: j }), told: true });
          });
        }
      });
    }
    for (let cursor = 0; cursor < EVENT_DECK.length; cursor += 1) {
      out.push({ ...START, ruleId: rule.id, cursor });
    }
  }
  return out;
};

describe('the feeling rule: listenLines', () => {
  const lines = listenLines();

  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    expect(lines.every((l) => textKey(l).length > 0)).toBe(true);
    expect(new Set(lines.map(textKey)).size).toBe(lines.length);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('is the audit\'s atoms: title, tray and size labels, 4 families, 14 stops, 6 cards, 84 readings, 19 comparisons, the note in two sentences', () => {
    const stops = FEELING_RULES.flatMap((r) => r.stops.map((s) => s.label));
    const readings = FEELING_RULES.flatMap((r) =>
      EVENT_DECK.flatMap((c) => r.stops.map((_, i) => pinLines(r, [{ eventId: c.id, stop: i }])[0])));
    expect(stops).toHaveLength(14);
    expect(new Set(readings).size).toBe(84);
    const comparisons = lines.filter((l) => /bigger for you\.$|same stop for you\.$/.test(l));
    expect(comparisons).toHaveLength(1 + EVENT_DECK.length * 3);
    const expected = new Set([
      THE_FEELING_RULE_META.title,
      FAMILY_LABEL, SIZE_HINT, MARKER_LABEL, EVENT_LABEL,
      ...LISTEN.note(),
      ...FEELING_RULES.map((r) => r.label),
      ...stops,
      ...EVENT_DECK.map((c) => c.label),
      ...readings,
      ...comparisons,
    ]);
    expect(new Set(lines)).toEqual(expected);
    // 'Sad' is both a family and a stop.
    expect(lines).toHaveLength(133);
  });

  it('reads the note as its own two sentences, which together are the note shown', () => {
    expect(LISTEN.note()).toHaveLength(2);
    expect(LISTEN.note().join(' ')).toBe(AMBIGUITY_NOTE);
  });

  it('shows and reads only the comparison: the reading above already names both pins', () => {
    for (const rule of FEELING_RULES) {
      const pins = [{ eventId: EVENT_DECK[0].id, stop: 0 }, { eventId: EVENT_DECK[1].id, stop: rule.stops.length - 1 }];
      const line = compareLine(pins);
      expect(line).not.toMatch(/You put/);
      expect(differenceLine(rule, pins).endsWith(` ${line}`)).toBe(true);
    }
    expect(LISTEN.difference([])).toEqual([]);
    expect(LISTEN.difference([{ eventId: EVENT_DECK[0].id, stop: 1 }])).toEqual([]);
  });

  it('covers every line every button reads in every reachable state, and nothing else', () => {
    const have = new Set(lines.map(textKey));
    const seen = new Set<string>();
    const missing = new Set<string>();
    for (const s of reachable()) {
      for (const texts of buttonsIn(s)) {
        expect(texts.length).toBeGreaterThan(0);
        for (const t of texts) {
          seen.add(textKey(t));
          if (!have.has(textKey(t))) missing.add(t);
        }
      }
    }
    expect([...missing]).toEqual([]);
    expect(seen).toEqual(have);
  });

  it('reads the marker word under a half-way marker as the nearest stop, the same word the slider shows', () => {
    for (const rule of FEELING_RULES) {
      for (let v = 0; v <= rule.stops.length - 1; v += 0.25) {
        expect(LISTEN.marker(rule, v)[1]).toBe(rule.stops[nearestStop(rule, v)].label);
      }
    }
  });
});
