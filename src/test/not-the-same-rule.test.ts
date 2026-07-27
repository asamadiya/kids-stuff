import { describe, it, expect } from 'vitest';
import {
  CHIPS, COLUMNS, KEY_STANDS, NOT_THE_SAME_RULE_META, RULE_CARDS, SLOTS,
  cardById, cardsIn, chipById, chipsFor, columnById, coverage, describeKey,
  divergenceLine, divergences, pickChip, picksComplete, picksSet, place, plateLines,
  rackCards, rackEmpty, reverseLine, ruleSentence, sortedCount, unplace, wrapLines,
} from '../sel/not-the-same-rule';
import type { Placements } from '../sel/not-the-same-rule';

/** Words this exercise must never say about anything he does. */
const PRAISE = /great|well done|good job|correct|wrong|naughty|clever|proud|bad boy|silly/i;
/** Words that would take his placement back off him. */
const RETRACTION = /\bactually\b|\bbut\b|\bhowever\b|\binstead you should\b/i;

const everything = (): string =>
  [
    NOT_THE_SAME_RULE_META.title, NOT_THE_SAME_RULE_META.eyebrow, NOT_THE_SAME_RULE_META.note,
    KEY_STANDS,
    ...COLUMNS.flatMap((c) => [c.label, c.inline, c.note]),
    ...RULE_CARDS.flatMap((c) => [c.front, c.short, c.alt, c.reverse]),
    ...SLOTS.flatMap((s) => [s.label, s.ask]),
    ...CHIPS.flatMap((c) => [c.label, c.phrase]),
  ].join(' \n ');

const sortAll = (chooser: (i: number) => 'everyone' | 'reasoned'): Placements =>
  RULE_CARDS.reduce<Placements>((p, c, i) => place(p, c.id, chooser(i)), {});

describe('the deck', () => {
  it('ships a complete, coherent set of cards', () => {
    expect(RULE_CARDS.length).toBeGreaterThanOrEqual(4);
    expect(RULE_CARDS.length).toBeLessThanOrEqual(6);
    expect(new Set(RULE_CARDS.map((c) => c.id)).size).toBe(RULE_CARDS.length);
  });

  it('gives every card every panel it needs: a picture, a front and a reverse', () => {
    for (const c of RULE_CARDS) {
      expect(c.id, 'image id is namespaced and kebab-case').toMatch(/^not-the-same-rule-[a-z0-9-]+$/);
      expect(c.front.length, c.id).toBeGreaterThan(8);
      expect(c.short.length, c.id).toBeGreaterThan(2);
      expect(c.alt.length, `${c.id} needs real alt text`).toBeGreaterThan(40);
      expect(c.reverse.length, `${c.id} needs a reason on the back`).toBeGreaterThan(40);
      expect(COLUMNS.map((col) => col.id)).toContain(c.grownUpColumn);
    }
  });

  it('carries no field that could encode a correct answer', () => {
    for (const c of RULE_CARDS) {
      for (const key of Object.keys(c)) {
        expect(key, `${c.id}.${key}`).not.toMatch(/correct|answer|score|points|solution|expected/i);
      }
      expect(Object.keys(c).sort()).toEqual(
        ['alt', 'arguable', 'concedes', 'front', 'grownUpColumn', 'id', 'reverse', 'short'],
      );
    }
  });

  it('keeps both columns genuinely in play, so the sort is not a rubber stamp', () => {
    const grownUp = new Set(RULE_CARDS.map((c) => c.grownUpColumn));
    expect(grownUp.size).toBe(2);
  });
});

describe('the words', () => {
  it('never praises, blames or grades', () => {
    const text = everything();
    expect(text).not.toMatch(PRAISE);
  });

  it('never takes a card back off him on the reverse', () => {
    for (const c of RULE_CARDS) expect(c.reverse, c.id).not.toMatch(RETRACTION);
    expect(reverseLine(RULE_CARDS[0], 'everyone')).not.toMatch(RETRACTION);
    expect(KEY_STANDS).not.toMatch(RETRACTION);
  });

  it('leaves the arguable cards arguable instead of settling them', () => {
    const arguable = RULE_CARDS.filter((c) => c.arguable);
    expect(arguable.length).toBeGreaterThanOrEqual(2);
    for (const c of arguable) {
      expect(c.reverse, `${c.id} must say the other way exists`).toMatch(/some (houses|families)/i);
      expect(c.reverse, c.id).toMatch(/the other way|one timer for both/i);
    }
  });

  it('concedes his grievance before it explains it', () => {
    const conceding = RULE_CARDS.filter((c) => c.concedes);
    expect(conceding.length).toBeGreaterThanOrEqual(3);
    for (const c of conceding) {
      expect(c.reverse.startsWith('You are right'), `${c.id} must concede first`).toBe(true);
    }
  });

  it('concedes the asymmetry that runs in his favour too, not only the ones against him', () => {
    const hisWay = RULE_CARDS.find((c) => c.id === 'not-the-same-rule-tablet-longer');
    expect(hisWay?.concedes).toBe(true);
    expect(hisWay?.reverse).toMatch(/runs your way/i);
  });
});

describe('sorting', () => {
  it('moves a card out of the rack and into the column he chose', () => {
    const p = place({}, RULE_CARDS[0].id, 'everyone');
    expect(cardsIn(p, 'everyone').map((c) => c.id)).toEqual([RULE_CARDS[0].id]);
    expect(rackCards(p).map((c) => c.id)).not.toContain(RULE_CARDS[0].id);
    expect(sortedCount(p)).toBe(1);
  });

  it('lets a card be moved to the other column, and back to the rack', () => {
    const p = place(place({}, RULE_CARDS[0].id, 'everyone'), RULE_CARDS[0].id, 'reasoned');
    expect(cardsIn(p, 'everyone')).toHaveLength(0);
    expect(cardsIn(p, 'reasoned')).toHaveLength(1);
    expect(rackCards(unplace(p, RULE_CARDS[0].id))).toHaveLength(RULE_CARDS.length);
  });

  it('ignores a card that is not in the deck', () => {
    expect(place({}, 'no-such-card', 'everyone')).toEqual({});
    expect(cardById('no-such-card')).toBeUndefined();
  });

  it('is empty only when every card has been placed', () => {
    expect(rackEmpty({})).toBe(false);
    expect(rackEmpty(sortAll(() => 'everyone'))).toBe(true);
  });

  it('keeps deck order in both columns, so the key reads the same every time', () => {
    const p = sortAll((i) => (i % 2 === 0 ? 'everyone' : 'reasoned'));
    expect(cardsIn(p, 'everyone').map((c) => c.id))
      .toEqual(RULE_CARDS.filter((_, i) => i % 2 === 0).map((c) => c.id));
  });
});

describe('the two keys side by side', () => {
  it('counts divergence between two people, never errors in one of them', () => {
    expect(divergences({})).toBe(0);
    const agreeing = RULE_CARDS.reduce<Placements>((p, c) => place(p, c.id, c.grownUpColumn), {});
    expect(divergences(agreeing)).toBe(0);
    const opposite = RULE_CARDS.reduce<Placements>(
      (p, c) => place(p, c.id, c.grownUpColumn === 'everyone' ? 'reasoned' : 'everyone'), {});
    expect(divergences(opposite)).toBe(RULE_CARDS.length);
  });

  it('says the divergence as a fact about two people', () => {
    const agreeing = RULE_CARDS.reduce<Placements>((p, c) => place(p, c.id, c.grownUpColumn), {});
    expect(divergenceLine(agreeing)).toBe('You put every card in the same column the grown-up did.');
    const one = place({}, RULE_CARDS[0].id,
      RULE_CARDS[0].grownUpColumn === 'everyone' ? 'reasoned' : 'everyone');
    expect(divergenceLine(one)).toMatch(/^One of these you put in a different column/);
    for (const chooser of [() => 'everyone' as const, () => 'reasoned' as const]) {
      const line = divergenceLine(sortAll(chooser));
      expect(line).not.toMatch(PRAISE);
      expect(line).not.toMatch(/mistake|missed|should/i);
    }
  });

  it('restates his column, gives the reason, and lets his column stand', () => {
    const card = RULE_CARDS[1];
    const line = reverseLine(card, 'everyone');
    expect(line).toContain(card.front);
    expect(line).toContain(columnById('everyone').inline);
    expect(line).toContain(card.reverse);
    expect(line.endsWith('Your column stands.')).toBe(true);
    expect(line).not.toMatch(PRAISE);
  });
});

describe('the rule he builds', () => {
  it('offers every slot at least two chips to choose between', () => {
    for (const s of SLOTS) expect(chipsFor(s.id).length, s.id).toBeGreaterThanOrEqual(2);
    expect(new Set(CHIPS.map((c) => c.id)).size).toBe(CHIPS.length);
    expect(CHIPS.every((c) => SLOTS.some((s) => s.id === c.slot))).toBe(true);
  });

  it('holds one chip per slot, and lets a chip be taken back off', () => {
    const one = pickChip({}, 'place-tablet');
    expect(one.place).toBe('place-tablet');
    expect(pickChip(one, 'place-door').place).toBe('place-door');
    expect(pickChip(one, 'place-tablet').place).toBeUndefined();
    expect(pickChip({}, 'no-such-chip')).toEqual({});
    expect(chipById('no-such-chip')).toBeUndefined();
  });

  it('writes no sentence until every part is chosen', () => {
    let picks = {};
    for (const s of SLOTS) {
      expect(ruleSentence(picks)).toBeNull();
      picks = pickChip(picks, chipsFor(s.id)[0].id);
    }
    expect(picksComplete(picks)).toBe(true);
    expect(picksSet(picks)).toBe(SLOTS.length);
    expect(ruleSentence(picks)).toBe(
      'At the block corner, everyone must ask me first, at any time. If not: we put it back the way it was.',
    );
  });

  it('writes the same sentence every time from the same chips', () => {
    const picks = SLOTS.reduce<ReturnType<typeof pickChip>>(
      (p, s) => pickChip(p, chipsFor(s.id)[1].id), {});
    expect(ruleSentence(picks)).toBe(ruleSentence(picks));
    expect(ruleSentence(picks)).toMatch(/^At the tablet, /);
    expect(ruleSentence(picks)).not.toMatch(PRAISE);
  });

  it('lets him write an asymmetric rule of his own, the way the grown-ups did', () => {
    expect(CHIPS.some((c) => /except Mia/i.test(c.label))).toBe(true);
  });
});

describe('what the readouts measure', () => {
  it('states coverage, never a ratio of right to wrong', () => {
    expect(coverage({}, 0)).toBe(`0 of ${RULE_CARDS.length} cards sorted · 0 rules written`);
    expect(coverage(place({}, RULE_CARDS[0].id, 'everyone'), 1))
      .toBe(`1 of ${RULE_CARDS.length} cards sorted · 1 rule written`);
    expect(coverage(sortAll(() => 'reasoned'), 3)).not.toMatch(PRAISE);
  });

  it('prints facts about what is on the plate', () => {
    const p = sortAll((i) => (i < 2 ? 'everyone' : 'reasoned'));
    const lines = plateLines(p, null);
    expect(lines[0]).toContain(`2 cards in the same-for-everyone column, ${RULE_CARDS.length - 2}`);
    expect(lines[1]).toBe('No rule written yet.');
    expect(plateLines(p, 'At the tablet, everyone must ask me first, at any time. If not: it stops for the day.')[1])
      .toMatch(/^At the tablet/);
    for (const l of lines) expect(l).not.toMatch(PRAISE);
  });

  it('describes the key for someone who cannot see it', () => {
    expect(describeKey({}, null)).toContain('nothing yet');
    const d = describeKey(place({}, RULE_CARDS[0].id, 'everyone'), 'At my bedroom door, everyone must ask me first, at any time. If not: we put it back the way it was.');
    expect(d).toContain(RULE_CARDS[0].short);
    expect(d).toContain('His own rule:');
  });
});

describe('wrapping the printed rule', () => {
  it('breaks at words, keeps every word, and is deterministic', () => {
    const text = 'At the block corner, everyone except Mia takes a turn and passes it on, after the timer goes.';
    const lines = wrapLines(text, 30);
    expect(lines.join(' ')).toBe(text);
    for (const l of lines) expect(l.length).toBeLessThanOrEqual(30);
    expect(wrapLines(text, 30)).toEqual(lines);
    expect(wrapLines('', 20)).toEqual([]);
    expect(wrapLines('supercalifragilistic', 5)).toEqual(['supercalifragilistic']);
  });
});
