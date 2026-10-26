import { describe, expect, it, vi } from 'vitest';
import { textKey } from '../audio/readAloud';
import {
  BUILDER_HEAD, CHIPS, COLUMNS, KEY_STANDS, LISTEN, NOT_THE_SAME_RULE_META, RACK_DONE, RACK_OPEN,
  REASON_SAYS, RULE_CARDS, SLOTS, STANDS, WHERE_PROMPT,
  chipsFor, divergenceLine, listenLines, reverseLine, ruleSentence,
} from '../sel/not-the-same-rule';
import type { ColumnId, Picks, Placements, SlotId } from '../sel/not-the-same-rule';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The clip builder bakes `listenLines()`; every read button asks for atoms
 * from `LISTEN.*`. This walks every reachable state the way
 * .redesign/v4/research/sel-audit-enumerate.ts does and checks that no button
 * can ask for a line the build did not make.
 */

const lines = listenLines();
const have = new Set(lines.map(textKey));

/** Each card in the rack, or in one of the two columns: 3^6 states. */
const everyPlacement = (): Placements[] =>
  RULE_CARDS.reduce<Placements[]>(
    (acc, card) => acc.flatMap((p) => [p, ...COLUMNS.map((c) => ({ ...p, [card.id]: c.id }))]),
    [{}],
  );

/** Each slot empty or holding one of its chips: 4^5 states, finished or not. */
const everyPicks = (): Picks[] =>
  SLOTS.reduce<Picks[]>(
    (acc, slot) => acc.flatMap((p) => [p, ...chipsFor(slot.id).map((c) => ({ ...p, [slot.id]: c.id }))]),
    [{}],
  );

const rackFull = (p: Placements) => RULE_CARDS.every((c) => c.id in p);

describe('listenLines', () => {
  it('has no empty line, no duplicate after normalising, and none too long for one clip', () => {
    expect(lines.filter((l) => l.trim() === '')).toEqual([]);
    expect(have.size).toBe(lines.length);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('is exactly the 145 atoms the audit enumerates for this exercise', () => {
    // The audit's reference set, written out the way sel-audit-enumerate.ts builds it.
    const ref = new Set<string>([
      NOT_THE_SAME_RULE_META.title,
      REASON_SAYS, STANDS, KEY_STANDS,
      ...COLUMNS.map((c) => c.label),
      ...SLOTS.map((s) => s.ask),
      ...CHIPS.map((c) => c.label),
      RACK_OPEN, RACK_DONE, WHERE_PROMPT, BUILDER_HEAD,
      ...RULE_CARDS.flatMap((x) => [
        x.front, x.reverse,
        ...COLUMNS.map((col) => `You put "${x.front}" in the ${col.inline} column.`),
      ]),
    ]);
    for (const p of everyPlacement().filter(rackFull)) ref.add(divergenceLine(p));
    for (const p of everyPicks()) {
      const s = ruleSentence(p);
      if (!s) continue;
      const i = s.indexOf(' If not: ');
      ref.add(s.slice(0, i));
      ref.add(s.slice(i + 1));
    }
    expect(ref.size).toBe(145);
    expect([...lines].sort()).toEqual([...ref].sort());
  });

  it('names his column once, with no doubled article', () => {
    expect(lines.filter((l) => /\bthe the\b/i.test(l))).toEqual([]);
    expect(LISTEN.back(RULE_CARDS[0], 'everyone')[0])
      .toBe(`You put "${RULE_CARDS[0].front}" in the same for everyone column.`);
  });

  it('never voices the grown-up note', () => {
    expect(have.has(textKey(NOT_THE_SAME_RULE_META.note))).toBe(false);
  });
});

describe('every button, in every reachable state, asks only for lines the build makes', () => {
  const asked = new Set<string>();
  const ask = (texts: readonly string[]) => texts.forEach((t) => asked.add(t));

  it('walks the whole state space through LISTEN', () => {
    ask(LISTEN.head());
    ask(LISTEN.where());
    ask(LISTEN.builder());
    for (const card of RULE_CARDS) ask(LISTEN.card(card));
    for (const slot of SLOTS) ask(LISTEN.slot(slot));
    for (const p of everyPlacement()) {
      ask(LISTEN.rack(p));
      for (const card of RULE_CARDS) {
        const col = p[card.id];
        if (col) ask(LISTEN.back(card, col));
      }
      if (rackFull(p)) ask(LISTEN.notice(p));
    }
    for (const p of everyPicks()) ask(LISTEN.rule(p));

    const missing = [...asked].filter((t) => !have.has(textKey(t)));
    expect(missing).toEqual([]);
    // And nothing baked is unreachable.
    expect(asked.size).toBe(lines.length);
  });

  it('reads the back of a card as the same words it shows, split into sentences', () => {
    for (const card of RULE_CARDS) {
      for (const col of COLUMNS.map((c) => c.id as ColumnId)) {
        const parts = LISTEN.back(card, col);
        expect(parts.join(' ')).toBe(reverseLine(card, col));
        expect(parts).toHaveLength(4);
      }
    }
  });

  it('reads a finished rule as the same words it shows, and nothing for an unfinished one', () => {
    for (const p of everyPicks()) {
      const s = ruleSentence(p);
      expect(LISTEN.rule(p).join(' ') || null).toBe(s);
    }
  });

  it('reads each slot row as its question, then its chips in order', () => {
    for (const slot of SLOTS) {
      expect(LISTEN.slot(slot)).toEqual([slot.ask, ...chipsFor(slot.id as SlotId).map((c) => c.label)]);
    }
  });
});
