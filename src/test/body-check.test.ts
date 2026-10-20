import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  BODYCHECK_META,
  BREATH_CARDS,
  CHECKS,
  COUNT_LENGTHS,
  DOTS_PER_ROW,
  FIGURE_BOX,
  FIGURE_PLATE,
  FIGURE_STROKES,
  REGIONS,
  WAIT_THINGS,
  breathAt,
  compareLines,
  countOne,
  countWord,
  coverage,
  coverageLine,
  describeChecks,
  describeMarks,
  formatDay,
  inFigureOrder,
  markPhrase,
  plateLines,
  readingLines,
  remedyLine,
  signalList,
  toggleCheck,
  toggleRegion,
  type BodyCheckRecord,
  type RegionId,
} from '../sel/body-check';

/** Anything that would turn a body reading into a graded answer. */
const PRAISE = /great|well done|good job|correct|wrong|naughty|nice work|excellent|proud|perfect|bravo/i;
const SCORING_KEY = /^(correct|answer|right|wrong|score|points|best|stars?|streak|solution|target)$/i;

const record = (over: Partial<BodyCheckRecord> = {}): BodyCheckRecord => ({
  id: 'r',
  made: '2026-07-25T08:30:00.000Z',
  before: [],
  after: [],
  checks: [],
  remedy: { kind: 'none' },
  ...over,
});

function everyKey(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const v of value) everyKey(v, out);
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      out.push(k);
      everyKey(v, out);
    }
  }
  return out;
}

function everyString(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const v of value) everyString(v, out);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) everyString(v, out);
  return out;
}

describe('the plate and its places', () => {
  it('has the six places the figure is divided into, each named and each with a painted inset', () => {
    expect(REGIONS).toHaveLength(6);
    expect(REGIONS.map((r) => r.id)).toEqual(['head', 'throat', 'chest', 'tummy', 'hands', 'legs']);
    for (const r of REGIONS) {
      expect(r.place.length).toBeGreaterThan(0);
      expect(r.signal.length).toBeGreaterThan(0);
      expect(r.alt.length).toBeGreaterThan(12);
      expect(r.inset.startsWith('body-check-')).toBe(true);
    }
  });

  it('names every image uniquely so no two exercises can collide in games/sel', () => {
    const ids = [FIGURE_PLATE, ...REGIONS.map((r) => r.inset)];
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^body-check-[a-z0-9-]+$/.test(id))).toBe(true);
  });

  it('puts every spot inside the plate, so a mark can never land off the figure', () => {
    for (const r of REGIONS) {
      expect(r.spot.x).toBeGreaterThanOrEqual(0);
      expect(r.spot.x).toBeLessThanOrEqual(100);
      expect(r.spot.y).toBeGreaterThanOrEqual(0);
      expect(r.spot.y).toBeLessThanOrEqual(100);
      if (r.mirror) expect(r.spot.x).toBeLessThan(50);
    }
  });

  it('draws the ink figure in the same aspect as the painted plate, so one set of spots serves both', () => {
    expect(FIGURE_BOX.width / FIGURE_BOX.height).toBeCloseTo(800 / 1000, 5);
    expect(FIGURE_STROKES.length).toBeGreaterThan(8);
    expect(FIGURE_STROKES.every((d) => /^M/.test(d))).toBe(true);
  });
});

describe('nothing here can be answered', () => {
  it('carries no field that could hold a right answer', () => {
    const keys = everyKey([REGIONS, CHECKS, WAIT_THINGS, BREATH_CARDS, BODYCHECK_META]);
    expect(keys.filter((k) => SCORING_KEY.test(k))).toEqual([]);
  });

  it('never praises, never scolds, in any string the child can meet', () => {
    const strings = [
      ...everyString([REGIONS, CHECKS, WAIT_THINGS, BREATH_CARDS, BODYCHECK_META]),
      describeMarks([]),
      describeMarks(['head', 'tummy']),
      describeChecks([]),
      describeChecks(['food', 'noise']),
      ...compareLines([], []),
      ...compareLines(['head'], ['head']),
      ...compareLines(['head', 'tummy', 'hands'], ['tummy']),
      ...compareLines(['head'], ['head', 'legs']),
      remedyLine({ kind: 'none' }),
      remedyLine({ kind: 'breath', whole: 0 }),
      remedyLine({ kind: 'breath', whole: 3 }),
      remedyLine({ kind: 'count', to: 20, thing: 'lie', counted: 20 }),
      remedyLine({ kind: 'count', to: 30, thing: 'near', counted: 12 }),
      remedyLine({ kind: 'wait', seconds: 60, thing: 'lie', elapsed: 60000, finished: true }),
      coverageLine(coverage([])),
      coverageLine(coverage([record({ before: ['head'] })])),
    ];
    for (const s of strings) expect(s).not.toMatch(PRAISE);
  });

  it('states an empty body as a fact rather than as a failure to answer', () => {
    expect(describeMarks([])).toBe('Nothing is loud in your body right now.');
    expect(describeChecks([])).toBe('You marked none of the five.');
    expect(compareLines([], [])).toEqual(['No marks before. No marks after.']);
  });
});

describe('the reading', () => {
  it('reads the marks off the figure from the head down, whatever order they were tapped in', () => {
    expect(inFigureOrder(['legs', 'head', 'tummy'])).toEqual(['head', 'tummy', 'legs']);
    expect(signalList(['tummy', 'head'])).toBe('hot in the face, tight in the tummy');
    expect(describeMarks(['tummy', 'head'])).toBe('Hot in the face, tight in the tummy.');
  });

  it('says the checks back in the words the guide uses', () => {
    expect(describeChecks(['noise', 'food'])).toBe('You said hungry and too loud.');
    expect(describeChecks(['food'])).toBe('You said hungry.');
  });

  it('adds and removes a mark on a second tap, and keeps the order', () => {
    let marks: readonly RegionId[] = [];
    marks = toggleRegion(marks, 'legs');
    marks = toggleRegion(marks, 'head');
    expect(marks).toEqual(['head', 'legs']);
    marks = toggleRegion(marks, 'legs');
    expect(marks).toEqual(['head']);
    expect(toggleCheck(toggleCheck([], 'person'), 'food')).toEqual(['food', 'person']);
    expect(toggleCheck(['food'], 'food')).toEqual([]);
  });

  it('counts in words a five-year-old hears, and gets the singular right', () => {
    expect(countWord(0)).toBe('no');
    expect(markPhrase(1)).toBe('one mark');
    expect(markPhrase(3)).toBe('three marks');
    expect(markPhrase(0)).toBe('no marks');
  });

  it('gives the grown-up both halves of the reading to read aloud', () => {
    expect(readingLines(['head'], ['food'])).toEqual(['Hot in the face.', 'You said hungry.']);
  });
});

describe('the two figures put side by side', () => {
  it('compares by counting, never by judging', () => {
    expect(compareLines(['head', 'tummy', 'hands'], ['tummy'])).toEqual([
      'Before: three marks. After: one.',
      'Still tight in the tummy.',
    ]);
  });

  it('says plainly when the remedy shifted nothing, instead of insisting that it worked', () => {
    const same = compareLines(['head', 'tummy'], ['tummy', 'head']);
    expect(same[0]).toBe('Still hot in the face, tight in the tummy.');
    expect(same[1]).toBe('Some of them take longer than a breath.');
  });

  it('reports marks that arrived as well as marks that went', () => {
    expect(compareLines(['head'], ['head', 'legs'])).toEqual([
      'Before: one mark. After: two.',
      'Still hot in the face.',
      'New: heavy in the legs.',
    ]);
  });

  it('allows the reading to end with more marks than it started with', () => {
    const lines = compareLines([], ['chest', 'hands']);
    expect(lines[0]).toBe('Before: no marks. After: two.');
    expect(lines.join(' ')).not.toMatch(PRAISE);
  });
});

describe('the remedy is done, one tap at a time, and nothing on the screen moves by itself', () => {
  it('turns the breath card only on a tap: in, out, in, out', () => {
    expect(breathAt(0)).toEqual({ phase: 'in', whole: 0 });
    expect(breathAt(1)).toEqual({ phase: 'out', whole: 0 });
    expect(breathAt(2)).toEqual({ phase: 'in', whole: 1 });
    expect(breathAt(7)).toEqual({ phase: 'out', whole: 3 });
    expect(breathAt(-3)).toEqual({ phase: 'in', whole: 0 });
    expect(breathAt(Number.NaN)).toEqual({ phase: 'in', whole: 0 });
    expect(breathAt(2.9)).toEqual(breathAt(2));
  });

  it('gives each half of the breath its own still card and keeps the out-breath the longer count', () => {
    expect(BREATH_CARDS.in.phase).toBe('in');
    expect(BREATH_CARDS.out.phase).toBe('out');
    expect(BREATH_CARDS.in.how).toMatch(/four/);
    expect(BREATH_CARDS.out.how).toMatch(/six/);
    for (const c of Object.values(BREATH_CARDS)) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.done.length).toBeGreaterThan(0);
    }
  });

  it('fills the count one dot per tap, in order, and never past the number he chose', () => {
    expect(COUNT_LENGTHS).toEqual([10, 20, 30]);
    expect(COUNT_LENGTHS.every((n) => n % DOTS_PER_ROW === 0)).toBe(true);
    expect(countOne(0, 10)).toBe(1);
    expect(countOne(9, 10)).toBe(10);
    expect(countOne(10, 10)).toBe(10);
    expect(countOne(-4, 10)).toBe(1);
    expect(countOne(Number.NaN, 20)).toBe(1);
    let n = 0;
    for (let i = 0; i < 40; i += 1) n = countOne(n, 20);
    expect(n).toBe(20);
  });

  /**
   * FAILS IF REVERTED: the disc used to open and shut on requestAnimationFrame
   * and the wait band filled on a 100ms interval. The parent forbids any motion,
   * so no clock may change the drawing.
   */
  it('runs no clock that could redraw the exercise', () => {
    const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
    for (const f of ['src/components/sel/BodyCheck.tsx', 'src/sel/body-check.ts']) {
      const code = strip(readFileSync(f, 'utf8'));
      expect(code, f).not.toMatch(/requestAnimationFrame|setInterval|setTimeout|performance\.now|Date\.now|transition|@keyframes/);
    }
  });

  it('offers five things to do and says them back in the past, whether or not the count was finished', () => {
    expect(WAIT_THINGS).toHaveLength(5);
    expect(new Set(WAIT_THINGS.map((w) => w.id)).size).toBe(5);
    expect(remedyLine({ kind: 'count', to: 20, thing: 'lie', counted: 20 })).toBe('You counted to 20, lying down.');
    expect(remedyLine({ kind: 'count', to: 30, thing: 'water', counted: 12 })).toBe(
      'You stopped at 12 of 30, drinking water.',
    );
    expect(remedyLine({ kind: 'breath', whole: 1 })).toBe('You took one slow breath, in and out.');
    expect(remedyLine({ kind: 'breath', whole: 4 })).toBe('You took four slow breaths, in and out.');
    expect(remedyLine({ kind: 'breath', whole: 0 })).toBe('You did not finish a whole breath.');
    expect(remedyLine({ kind: 'none' })).toBe('You did not run anything.');
  });

  it('still reads a reading kept before the remedies became taps', () => {
    expect(remedyLine({ kind: 'wait', seconds: 60, thing: 'lie', elapsed: 60000, finished: true })).toBe(
      'You waited 60 seconds, lying down.',
    );
    expect(remedyLine({ kind: 'wait', seconds: 90, thing: 'water', elapsed: 12400, finished: false })).toBe(
      'You stopped the wait at 12 seconds of 90, drinking water.',
    );
    const old = { kind: 'breath', whole: 2, heldMs: 21000 } as const;
    expect(remedyLine(old)).toBe('You took two slow breaths, in and out.');
  });

  it('has five wordless checks, each drawable without a single letter', () => {
    expect(CHECKS).toHaveLength(5);
    expect(CHECKS.map((c) => c.id)).toEqual(['food', 'sleep', 'noise', 'movement', 'person']);
    for (const c of [...CHECKS, ...WAIT_THINGS]) {
      expect(c.glyph.length).toBeGreaterThan(0);
      expect(c.glyph.every((d) => /^M[-\d.]/.test(d))).toBe(true);
    }
  });
});

describe('the readout names, it does not tally', () => {
  it('carries no denominator, so marking is not a set to complete', () => {
    for (const times of [0, 1, 5]) {
      for (const places of [0, 1, 3, REGIONS.length]) {
        const line = coverageLine({ times, places, total: REGIONS.length });
        expect(line).not.toMatch(/\bof the \d+\b/);
        expect(line).not.toMatch(new RegExp(`\\b${REGIONS.length}\\b`));
      }
    }
  });
});

describe('the record he keeps', () => {
  it('measures coverage of himself, never a ratio of right to wrong', () => {
    const records = [
      record({ before: ['head', 'tummy'], after: ['tummy'] }),
      record({ before: ['hands'], after: [] }),
    ];
    expect(coverage(records)).toEqual({ times: 2, places: 3, total: 6 });
    expect(coverageLine(coverage(records))).toBe('You have opened this 2 times. You have named three places.');
    expect(coverageLine(coverage([]))).toBe('You have not opened this yet');
    expect(coverageLine(coverage([records[1]]))).toBe('You have opened this once. You have named one place.');
  });

  it('writes the whole plate out in order, reading then remedy then comparison', () => {
    const r = record({
      before: ['head', 'tummy'],
      after: ['head'],
      checks: ['food', 'noise'],
      remedy: { kind: 'count', to: 30, thing: 'window', counted: 30 },
    });
    expect(plateLines(r)).toEqual([
      'Hot in the face, tight in the tummy.',
      'You said hungry and too loud.',
      'You counted to 30, looking out of the window.',
      'Before: two marks. After: one.',
      'Still hot in the face.',
    ]);
  });

  it('stamps the day off the record itself, so no clock or timezone can move it', () => {
    expect(formatDay('2026-07-25T08:30:00.000Z')).toBe('25 July 2026');
    expect(formatDay('2026-01-02T23:59:00.000Z')).toBe('2 January 2026');
    expect(formatDay('not a date')).toBe('');
  });

  it('accepts a reading with nothing in it at all', () => {
    expect(plateLines(record())).toEqual([
      'Nothing is loud in your body right now.',
      'You marked none of the five.',
      'You did not run anything.',
      'No marks before. No marks after.',
    ]);
  });
});
