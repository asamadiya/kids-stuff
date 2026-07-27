import { describe, expect, it } from 'vitest';
import {
  BORROWED_EYES_META, CHIPS, CHIP_IDS, MOMENTS,
  allSlots, bothSentences, chipAt, chipById, chipClause, chipWord, coverageLine, coveredCount,
  earlierChip, momentById, momentComplete, nextNotch, notchAngle, plateChips, plateLines,
  readingFor, sentenceFor, slotKey, wrapWords,
} from '../sel/borrowed-eyes';
import type { ChipId, Placed } from '../sel/borrowed-eyes';

/** Every string carried by the content, so prose can be checked in bulk. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

function keysDeep(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(keysDeep);
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => [k, ...keysDeep(v)]);
  }
  return [];
}

const CONTENT = { meta: BORROWED_EYES_META, moments: MOMENTS, chips: CHIPS };

describe('borrowed eyes — the plate', () => {
  it('names itself', () => {
    expect(BORROWED_EYES_META.id).toBe('borrowed-eyes');
    expect(BORROWED_EYES_META.title).toBe('Borrowed Eyes');
    expect(BORROWED_EYES_META.eyebrow.trim().length).toBeGreaterThan(0);
    expect(BORROWED_EYES_META.note.trim().length).toBeGreaterThan(0);
  });

  it('ships four to six moments, each with the child’s own position first', () => {
    expect(MOMENTS.length).toBeGreaterThanOrEqual(4);
    expect(MOMENTS.length).toBeLessThanOrEqual(6);
    for (const m of MOMENTS) {
      expect(m.views.length).toBeGreaterThanOrEqual(2);
      expect(m.views[0].id).toBe('yours');
      expect(new Set(m.views.map((v) => v.id)).size).toBe(m.views.length);
    }
    expect(new Set(MOMENTS.map((m) => m.id)).size).toBe(MOMENTS.length);
  });

  it('gives every position a picture, a description and an eye height', () => {
    const ids: string[] = [];
    for (const m of MOMENTS) {
      for (const v of m.views) {
        expect(v.imageId).toMatch(/^borrowed-eyes-[a-z0-9-]+$/);
        ids.push(v.imageId);
        for (const field of [v.whose, v.from, v.said, v.sees, v.eyeLine, v.alt]) {
          expect(field.trim().length).toBeGreaterThan(0);
        }
        // the alt text describes the picture, not the exercise
        expect(v.alt.length).toBeGreaterThan(40);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('draws the two positions as different pictures of the same second', () => {
    for (const m of MOMENTS) {
      const said = m.views.map((v) => v.said);
      expect(new Set(said).size).toBe(said.length);
      const sees = m.views.map((v) => v.sees);
      expect(new Set(sees).size).toBe(sees.length);
      const eyes = m.views.map((v) => v.eyeLine);
      expect(new Set(eyes).size).toBe(eyes.length);
    }
  });
});

describe('borrowed eyes — nothing is scored', () => {
  it('carries no field that could hold a correct answer', () => {
    for (const key of keysDeep(MOMENTS).concat(keysDeep(CHIPS))) {
      expect(key).not.toMatch(/answer|correct|expected|truth|score|points|weight|grade|best/i);
    }
  });

  it('never stores a chip id as content, so no chip can be the real reason', () => {
    const chipIds: readonly string[] = CHIP_IDS;
    for (const s of strings(MOMENTS)) expect(chipIds).not.toContain(s);
  });

  it('gives each chip exactly a drawing, a word and a clause', () => {
    expect(CHIPS.length).toBe(6);
    expect(new Set(CHIPS.map((c) => c.id)).size).toBe(6);
    expect([...CHIP_IDS].sort()).toEqual(CHIPS.map((c) => c.id).sort());
    for (const c of CHIPS) expect(Object.keys(c).sort()).toEqual(['clause', 'id', 'word']);
  });

  it('says nothing praising or moralising anywhere in the content', () => {
    for (const s of strings(CONTENT)) {
      expect(s).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
      expect(s).not.toMatch(/\b(kind|unkind|mean|nice|rude|selfish|should|better|best|bad|right)\b/i);
    }
  });

  it('reads out coverage, never a ratio of right to wrong', () => {
    expect(allSlots()).toHaveLength(MOMENTS.reduce((n, m) => n + m.views.length, 0));
    expect(coverageLine({})).toBe(`you have stood in 0 of the ${allSlots().length} positions`);
    const one: Placed = { [slotKey(MOMENTS[0].id, 'yours')]: 'join' };
    expect(coverageLine(one)).toContain(`1 of the ${allSlots().length}`);
    expect(coverageLine(one)).not.toMatch(/right|wrong|correct|score/i);
  });

  it('counts only positions that exist', () => {
    const placed: Placed = { 'not-a-moment/not-a-view': 'help', [slotKey('tower', 'mia')]: 'join' };
    expect(coveredCount(placed)).toBe(1);
  });
});

describe('borrowed eyes — ambiguity is left standing', () => {
  it('draws several moments so that neither position settles them', () => {
    const open = MOMENTS.filter((m) => m.unresolved);
    expect(open.length).toBeGreaterThanOrEqual(2);
    expect(open.length).toBeLessThan(MOMENTS.length);
  });

  it('lets both chips contradict each other and the picture', () => {
    const m = momentById('tower');
    const placed: Placed = {
      [slotKey('tower', 'yours')]: 'own',
      [slotKey('tower', 'mia')]: 'join',
    };
    expect(momentComplete(m, placed)).toBe(true);
    expect(chipAt(placed, 'tower', 'yours')).toBe('own');
    expect(chipAt(placed, 'tower', 'mia')).toBe('join');
    // contradiction is stored as given; nothing reconciles or flags it
    const lines = plateLines(m, placed);
    expect(lines).toHaveLength(4);
    for (const l of lines) expect(l).not.toMatch(/but|however|really|actually/i);
  });

  it('every chip may be placed on every position', () => {
    for (const m of MOMENTS) {
      for (const v of m.views) {
        for (const c of CHIPS) {
          const line = readingFor(m, v, c);
          expect(line.startsWith(v.from)).toBe(true);
          expect(line.endsWith('.')).toBe(true);
        }
      }
    }
  });
});

describe('borrowed eyes — the two readings', () => {
  it('states both sentences, in the order the moment carries them', () => {
    const m = momentById('tower');
    expect(bothSentences(m)).toEqual([
      'From where you stood, her hand came down on the roof.',
      'From where Mia stood, she was putting a piece on.',
    ]);
  });

  it('joins the two sentences with no conjunction that judges', () => {
    for (const m of MOMENTS) {
      const both = bothSentences(m).join(' ');
      expect(both).not.toMatch(/\b(but|although|though|even so|instead)\b/i);
      expect(bothSentences(m)).toEqual(m.views.map(sentenceFor));
    }
  });

  it('bends the chip to the person it is placed on', () => {
    const own = chipById('own');
    expect(chipClause(own, momentById('tower').other)).toBe('she wanted it for herself');
    expect(chipClause(own, momentById('story').other)).toBe('he wanted it for himself');
    expect(chipWord(own, momentById('queue').other)).toBe('wanted it for himself');
  });

  it('leaves no placeholder unresolved in anything read aloud', () => {
    for (const m of MOMENTS) {
      for (const c of CHIPS) {
        expect(chipWord(c, m.other)).not.toContain('{');
        expect(chipClause(c, m.other)).not.toContain('{');
        for (const v of m.views) expect(readingFor(m, v, c)).not.toContain('{');
      }
    }
  });

  it('is deterministic: the same placement makes the same plate every time', () => {
    const m = momentById('crayon');
    const placed: Placed = {
      [slotKey('crayon', 'yours')]: 'copy',
      [slotKey('crayon', 'mia')]: 'join',
    };
    expect(plateLines(m, placed)).toEqual(plateLines(m, placed));
    expect(plateLines(m, placed).slice(0, 2)).toEqual(bothSentences(m));
    expect(plateChips(m, placed)).toEqual([
      { viewId: 'yours', chip: 'copy' },
      { viewId: 'mia', chip: 'join' },
    ]);
  });

  it('keeps a half-placed moment half-placed', () => {
    const m = momentById('circle');
    const placed: Placed = { [slotKey('circle', 'yours')]: 'unseen' };
    expect(momentComplete(m, placed)).toBe(false);
    expect(plateLines(m, placed)).toHaveLength(3);
    expect(plateChips(m, placed)).toHaveLength(1);
  });
});

describe('borrowed eyes — a second run', () => {
  it('sets the earlier chip beside the new one, with nothing said about it', () => {
    const before = plateChips(momentById('tower'), {
      [slotKey('tower', 'yours')]: 'own',
      [slotKey('tower', 'mia')]: 'help',
    });
    expect(earlierChip(before, 'yours')).toBe('own');
    expect(earlierChip(before, 'mia')).toBe('help');
    expect(earlierChip(before, 'nobody')).toBeNull();
    expect(earlierChip([], 'yours')).toBeNull();
  });

  it('knows every chip it is handed back', () => {
    for (const id of CHIP_IDS) expect(chipById(id).id).toBe(id);
    expect(() => chipById('nope' as ChipId)).toThrow();
    expect(() => momentById('nope')).toThrow();
  });
});

describe('borrowed eyes — the dial and the plate', () => {
  it('wraps round the notches', () => {
    expect(nextNotch(0, 2)).toBe(1);
    expect(nextNotch(1, 2)).toBe(0);
    expect(nextNotch(2, 3)).toBe(0);
    expect(nextNotch(0, 0)).toBe(0);
  });

  it('spreads the notches symmetrically about the middle', () => {
    expect(notchAngle(0, 1)).toBe(0);
    expect(notchAngle(0, 2)).toBe(-notchAngle(1, 2));
    expect(notchAngle(1, 3)).toBe(0);
    expect(notchAngle(0, 3)).toBeLessThan(notchAngle(2, 3));
  });

  it('wraps sentences without losing or reordering a word', () => {
    const text = bothSentences(momentById('queue'))[1];
    const lines = wrapWords(text, 30);
    for (const l of lines) expect(l.length).toBeLessThanOrEqual(30);
    expect(lines.join(' ')).toBe(text);
    expect(wrapWords('', 20)).toEqual([]);
    expect(wrapWords('extraordinarily-long-single-word', 8)).toEqual(['extraordinarily-long-single-word']);
  });
});
