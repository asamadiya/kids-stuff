import { describe, it, expect } from 'vitest';
import {
  BEFORE_YOU_DECIDE_META, CASES, CHIPS, GLYPHS, QUESTION_KINDS, SHEET,
  askedFacts, caseAt, caseById, casesDecided, chipFor, closingLine, factFor,
  plateLines, readout, sheetHeight, sheetRows, totalAsked, unaskedFacts, unaskedKinds, unaskedLine,
} from '../sel/before-you-decide';
import type { Decided, QuestionKind } from '../sel/before-you-decide';

const everyString = (): string[] => {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(CASES);
  walk(CHIPS);
  return out;
};

const record = (caseId: string, asked: QuestionKind[], choiceIndex = 0): Decided => {
  const subject = caseById(caseId);
  if (!subject) throw new Error(`no case ${caseId}`);
  const choice = subject.choices[choiceIndex];
  return {
    caseId, caseTitle: subject.title, asked,
    choiceId: choice.id, choiceLabel: choice.label, glyph: choice.glyph,
  };
};

describe('before you decide — the rack', () => {
  it('names itself for the bench head', () => {
    expect(BEFORE_YOU_DECIDE_META.id).toBe('before-you-decide');
    expect(BEFORE_YOU_DECIDE_META.title).toBe('Before You Decide');
    expect(BEFORE_YOU_DECIDE_META.eyebrow.split(' ').length).toBeLessThanOrEqual(3);
    expect(BEFORE_YOU_DECIDE_META.note.length).toBeGreaterThan(20);
  });

  it('ships a complete set of cases with distinct ids', () => {
    expect(CASES.length).toBeGreaterThanOrEqual(4);
    expect(CASES.length).toBeLessThanOrEqual(6);
    expect(new Set(CASES.map((c) => c.id)).size).toBe(CASES.length);
    for (const c of CASES) expect(c.id).toMatch(/^[a-z][a-z-]*$/);
  });

  it('gives every case exactly one fact per question on the rack', () => {
    for (const c of CASES) {
      expect(c.facts).toHaveLength(QUESTION_KINDS.length);
      expect([...c.facts].map((f) => f.kind).sort()).toEqual([...QUESTION_KINDS].sort());
      for (const kind of QUESTION_KINDS) expect(factFor(c, kind).kind).toBe(kind);
    }
  });

  it('gives every case a chip glyph and a panel for every question', () => {
    for (const kind of [...QUESTION_KINDS, 'unasked' as const]) {
      expect(chipFor(kind).path.length).toBeGreaterThan(10);
      expect(chipFor(kind).label.length).toBeGreaterThan(4);
    }
    expect(CHIPS).toHaveLength(QUESTION_KINDS.length + 1);
  });
});

describe('ambiguity is the material', () => {
  it('makes at least one fact reverse the reading and at least one leave it open, in every case', () => {
    for (const c of CASES) {
      expect(c.facts.some((f) => f.effect === 'reverses')).toBe(true);
      expect(c.facts.some((f) => f.effect === 'unresolved')).toBe(true);
    }
  });

  it('leaves at least one case in three unsettled after all three facts', () => {
    const open = CASES.filter((c) => !c.settles);
    expect(open.length).toBeGreaterThanOrEqual(Math.floor(CASES.length / 3));
  });

  it('says plainly, on an unsettled case, that it cannot be known', () => {
    for (const c of CASES) {
      const closing = closingLine(c);
      if (c.settles) expect(closing).toBe(c.closing);
      else expect(closing).toMatch(/do not know|cannot tell|will not find out/i);
    }
  });

  it('never reveals a culprit as a separate hidden truth', () => {
    const allowed = new Set([
      'id', 'title', 'setupPanelId', 'setupAlt', 'setup', 'facts', 'choices', 'settles', 'closing',
    ]);
    for (const c of CASES) for (const key of Object.keys(c)) expect(allowed.has(key)).toBe(true);
  });
});

describe('nothing about the decision is scored', () => {
  it('carries no field on a choice that could hold a right answer', () => {
    const allowed = new Set(['id', 'glyph', 'label', 'outcome']);
    for (const c of CASES) {
      for (const choice of c.choices) {
        for (const key of Object.keys(choice)) expect(allowed.has(key)).toBe(true);
        expect(key_looks_like_a_verdict(Object.keys(choice))).toBe(false);
      }
    }
  });

  it('offers two or three roads out of every case, each drawn with a known mark', () => {
    const ids = new Set<string>();
    for (const c of CASES) {
      expect(c.choices.length).toBeGreaterThanOrEqual(2);
      expect(c.choices.length).toBeLessThanOrEqual(3);
      for (const choice of c.choices) {
        expect(ids.has(choice.id)).toBe(false);
        ids.add(choice.id);
        expect(GLYPHS[choice.glyph]).toBeTruthy();
        expect(choice.outcome.length).toBeGreaterThan(40);
      }
    }
  });

  it('states outcomes as world-state in the past tense, not as a verdict', () => {
    for (const c of CASES) {
      for (const choice of c.choices) {
        expect(choice.outcome).toMatch(/^You (said|asked|told|went|kept|started|picked|put|stood)/);
      }
    }
  });

  it('lets a road that looks helpful fail outright', () => {
    const asking = CASES.flatMap((c) => c.choices).filter((c) => c.glyph === 'ask');
    expect(asking.some((c) => /kept walking|moved away|another table/.test(c.outcome))).toBe(true);
  });

  it('uses no praise and no moral gloss anywhere in the content', () => {
    for (const line of everyString()) {
      expect(line).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
      expect(line).not.toMatch(/\b(kind|unkind|nice|mean|rude|polite|bad|good|better|best|proud|fault|blame|should have)\b/i);
    }
  });
});

describe('the readout measures, it does not rate', () => {
  it('counts questions spent, never right against wrong', () => {
    expect(readout({ asked: 1, decided: true, cases: 2 }))
      .toBe('You asked 1 of 3 before you decided. 2 of 5 cases decided.');
    expect(readout({ asked: 0, decided: false, cases: 0 }))
      .toBe('You have asked 0 of 3. 0 of 5 cases decided.');
    for (const decided of [true, false]) {
      const line = readout({ asked: 3, decided, cases: 5 });
      expect(line).not.toMatch(/correct|right|wrong|score|star|%/i);
    }
  });

  it('counts a case once however often it is replayed', () => {
    const rows = [record('tower', ['eye']), record('tower', ['eye', 'clock', 'hand']), record('snack', [])];
    expect(casesDecided(rows)).toBe(2);
    expect(totalAsked(rows)).toBe(4);
  });
});

describe('the questions left on the rack', () => {
  it('turns up exactly the complement, in rack order', () => {
    const subject = CASES[0];
    expect(unaskedKinds([])).toEqual(QUESTION_KINDS);
    expect(unaskedKinds(['clock'])).toEqual(['eye', 'hand']);
    expect(unaskedKinds(['hand', 'eye', 'clock'])).toEqual([]);
    expect(unaskedFacts(subject, ['clock']).map((f) => f.kind)).toEqual(['eye', 'hand']);
    expect(askedFacts(subject, ['hand', 'eye']).map((f) => f.kind)).toEqual(['hand', 'eye']);
  });

  it('states an unasked question flatly, with no reproach', () => {
    for (const kind of QUESTION_KINDS) {
      expect(unaskedLine(kind)).toMatch(/^You did not ask/);
      expect(unaskedLine(kind)).not.toMatch(/should|if only|missed|forgot/i);
    }
  });
});

describe('determinism', () => {
  it('keeps the case order fixed and wraps round', () => {
    expect(caseAt(0).id).toBe(CASES[0].id);
    expect(caseAt(CASES.length).id).toBe(CASES[0].id);
    expect(caseAt(-1).id).toBe(CASES[CASES.length - 1].id);
    expect(CASES.map((c) => c.id)).toEqual(['tower', 'snack', 'mia', 'hello', 'broken']);
  });

  it('returns the same helper output for the same input twice', () => {
    const rows = [record('tower', ['eye', 'clock']), record('hello', [])];
    expect(plateLines(rows)).toEqual(plateLines(rows));
    expect(sheetRows(rows)).toEqual(sheetRows(rows));
    expect(readout({ asked: 2, decided: true, cases: 2 })).toBe(readout({ asked: 2, decided: true, cases: 2 }));
  });
});

describe('the plate and the record sheet', () => {
  it('captions the plate with counts and with what was done', () => {
    expect(plateLines([])).toEqual(['No cases decided yet.']);
    const rows = [record('tower', ['eye', 'clock']), record('snack', [])];
    const lines = plateLines(rows);
    expect(lines[0]).toBe('The tower down: asked 2 of 3. You say he knocked it down.');
    expect(lines[lines.length - 1]).toBe('2 decisions. 2 questions asked of 6 on the rack.');
    for (const line of lines) expect(line).not.toMatch(/correct|score|star|great/i);
  });

  it('lays a row out for each decision, with a filled mark per question spent', () => {
    const rows = sheetRows([record('tower', ['eye', 'hand']), record('mia', [])]);
    expect(rows).toHaveLength(2);
    expect(rows[0].marks).toEqual([true, false, true]);
    expect(rows[1].marks).toEqual([false, false, false]);
    expect(rows[1].y - rows[0].y).toBe(SHEET.rowHeight);
    expect(sheetHeight([])).toBe(SHEET.top + SHEET.rowHeight + SHEET.foot);
    expect(sheetHeight(rows.map(() => record('tower', [])))).toBeGreaterThan(sheetHeight([]));
  });
});

describe('the pictures', () => {
  it('asks for a distinct panel per moment, all under this exercise', () => {
    const ids = CASES.flatMap((c) => [c.setupPanelId, ...c.facts.map((f) => f.panelId)]);
    expect(ids).toHaveLength(CASES.length * 4);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^before-you-decide-[a-z-]+$/);
  });

  it('describes every picture for a listener', () => {
    for (const c of CASES) {
      expect(c.setupAlt.length).toBeGreaterThan(40);
      for (const f of c.facts) {
        expect(f.alt.length).toBeGreaterThan(40);
        expect(f.question).toMatch(/\?$/);
        expect(f.fact.length).toBeGreaterThan(20);
      }
    }
  });
});

function key_looks_like_a_verdict(keys: readonly string[]): boolean {
  return keys.some((k) => /correct|right|wrong|best|score|answer|points/i.test(k));
}
