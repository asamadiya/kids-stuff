import { describe, it, expect } from 'vitest';
import {
  CATEGORY_COLORS,
  EMPTY_PLAN,
  LIVE_ERA_BAND,
  PALETTE,
  QUADRAT_META,
  SHAPE_KEYS,
  STAMP_KEYS,
  WEATHER_KEYS,
  abundance,
  applySplit,
  bump,
  carryForward,
  catalogue,
  categoryLabel,
  changeSummary,
  clearCell,
  composeSheet,
  composeSite,
  formatDate,
  gate,
  gateTotal,
  isoDate,
  latestSite,
  makeCategory,
  markCorner,
  pinFor,
  pinsFrom,
  planIsSquared,
  resolvedSeries,
  seriesKeys,
  setPlace,
  shapePath,
  sheetSignature,
  sheetSummary,
  sheetsInOrder,
  stampCell,
  totalMarks,
  type Category,
  type LogSheet,
  type QuadratRecord,
  type WeatherKey,
} from '../workshop/quadrat';

const kind = (mark: string, name: string, color: string = PALETTE.terracotta): Category =>
  makeCategory({ mark, name, color });

const sheetOn = (
  date: string,
  cats: readonly Category[],
  counts: Record<string, number>,
  weather: WeatherKey = 'sun',
): LogSheet => ({
  ...composeSheet({ date, weather, plan: EMPTY_PLAN, categories: cats, counts }),
  id: `s-${date}`,
  made: `${date}T09:00:00.000Z`,
});

describe('meta and palette', () => {
  it('is well formed', () => {
    expect(QUADRAT_META.id).toBe('quadrat');
    expect(QUADRAT_META.title).toBe('The Quadrat');
    expect(QUADRAT_META.eyebrow.split(' ').length).toBeLessThanOrEqual(3);
    expect(QUADRAT_META.note.endsWith('.')).toBe(true);
  });

  it('offers six weathers, five stamps, six shapes and five identifying colours', () => {
    expect(WEATHER_KEYS).toHaveLength(6);
    expect(STAMP_KEYS).toHaveLength(5);
    expect(SHAPE_KEYS).toHaveLength(6);
    expect(CATEGORY_COLORS).toHaveLength(5);
    expect(new Set(CATEGORY_COLORS.map((c) => c.hex)).size).toBe(5);
  });
});

describe('the five-bar gate is the notation, so it must read back exactly', () => {
  it('draws nothing for nothing', () => {
    expect(gate(0)).toEqual([]);
    expect(gate(-4)).toEqual([]);
  });

  it('closes a gate at five: four uprights and the fifth laid across', () => {
    // 5 = one closed gate. 4 uprights + 1 slash = 5.
    expect(gate(5)).toEqual([{ bars: 4, slash: true }]);
  });

  it('draws seven as one closed gate and two loose uprights', () => {
    // 7 = 5 + 2.
    expect(gate(7)).toEqual([
      { bars: 4, slash: true },
      { bars: 2, slash: false },
    ]);
  });

  it('draws twelve as two closed gates and two loose uprights', () => {
    // 12 = 5 + 5 + 2.
    expect(gate(12)).toEqual([
      { bars: 4, slash: true },
      { bars: 4, slash: true },
      { bars: 2, slash: false },
    ]);
  });

  it('reads back off the paper for every count up to forty', () => {
    for (let n = 0; n <= 40; n += 1) expect(gateTotal(gate(n))).toBe(n);
  });
});

describe('abundance ranks the sheet without inventing anything', () => {
  it('is hand-workable: 6, 3 and 1 of ten marks are 0.6, 0.3 and 0.1', () => {
    const ranked = abundance({ a: 6, b: 3, c: 1 }, ['a', 'b', 'c']);
    expect(ranked.map((r) => r.key)).toEqual(['a', 'b', 'c']);
    expect(ranked.map((r) => r.count)).toEqual([6, 3, 1]);
    expect(ranked[0].share).toBeCloseTo(0.6, 10);
    expect(ranked[1].share).toBeCloseTo(0.3, 10);
    expect(ranked[2].share).toBeCloseTo(0.1, 10);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it('gives equal counts equal rank and then skips, as a ranking should', () => {
    const ranked = abundance({ a: 4, b: 4, c: 2 }, ['a', 'b', 'c']);
    expect(ranked.map((r) => r.rank)).toEqual([1, 1, 3]);
  });

  it('keeps kinds he counted none of, and never divides by zero', () => {
    const ranked = abundance({}, ['a', 'b']);
    expect(ranked).toHaveLength(2);
    expect(ranked.every((r) => r.count === 0 && r.share === 0)).toBe(true);
  });

  it('breaks ties by key so the same sheet always ranks the same way', () => {
    const first = abundance({ z: 3, a: 3 }, ['z', 'a']);
    const second = abundance({ z: 3, a: 3 }, ['a', 'z']);
    expect(first.map((r) => r.key)).toEqual(second.map((r) => r.key));
    expect(first.map((r) => r.key)).toEqual(['a', 'z']);
  });
});

describe('the schema is his invention, so identity comes from what he chose', () => {
  it('mints the same key for the same choice and a different key for a different one', () => {
    expect(makeCategory({ mark: '🐝', color: PALETTE.ochre }).key).toBe(
      makeCategory({ mark: '🐝', color: PALETTE.ochre }).key,
    );
    expect(makeCategory({ mark: '🐝', color: PALETTE.ochre }).key).not.toBe(
      makeCategory({ mark: '🐝', color: PALETTE.teal }).key,
    );
    expect(makeCategory({ shape: 'circle', color: PALETTE.teal }).key).not.toBe(
      makeCategory({ shape: 'square', color: PALETTE.teal }).key,
    );
  });

  it('names a colour-and-shape kind without anyone typing', () => {
    expect(categoryLabel(makeCategory({ shape: 'leaf', color: PALETTE.olive }))).toBe('green leaf');
    expect(categoryLabel(kind('🐝', 'bee'))).toBe('bee');
  });
});

describe('a sheet is f(categories x counts x date x weather x plan)', () => {
  const bee = kind('🐝', 'bee');
  const ant = kind('🐜', 'ant');

  it('is identical for identical input', () => {
    const a = sheetOn('2026-05-03', [bee, ant], { [bee.key]: 4, [ant.key]: 9 });
    const b = sheetOn('2026-05-03', [bee, ant], { [bee.key]: 4, [ant.key]: 9 });
    expect(sheetSignature(a)).toBe(sheetSignature(b));
  });

  it('differs when one count differs', () => {
    const a = sheetOn('2026-05-03', [bee, ant], { [bee.key]: 4, [ant.key]: 9 });
    const b = sheetOn('2026-05-03', [bee, ant], { [bee.key]: 5, [ant.key]: 9 });
    expect(sheetSignature(a)).not.toBe(sheetSignature(b));
  });

  it('differs when the day differs, the weather differs, or the ground differs', () => {
    const base = sheetOn('2026-05-03', [bee], { [bee.key]: 4 });
    expect(sheetSignature(sheetOn('2026-05-04', [bee], { [bee.key]: 4 }))).not.toBe(sheetSignature(base));
    expect(sheetSignature(sheetOn('2026-05-03', [bee], { [bee.key]: 4 }, 'rain'))).not.toBe(sheetSignature(base));
    const stamped = { ...base, plan: stampCell(EMPTY_PLAN, 7, 'tree') };
    expect(sheetSignature(stamped)).not.toBe(sheetSignature(base));
  });

  it('differs when the schema differs even though the numbers match', () => {
    // Two children counting "four and nine" of different kinds do not hold the same sheet.
    const mine = sheetOn('2026-05-03', [bee, ant], { [bee.key]: 4, [ant.key]: 9 });
    const worm = kind('🐛', 'worm');
    const yours = sheetOn('2026-05-03', [bee, worm], { [bee.key]: 4, [worm.key]: 9 });
    expect(sheetSignature(mine)).not.toBe(sheetSignature(yours));
  });

  it('counts every mark on the sheet and states it in words without praise', () => {
    const s = sheetOn('2026-05-03', [bee, ant], { [bee.key]: 4, [ant.key]: 9 });
    expect(totalMarks(s.counts)).toBe(13);
    const words = sheetSummary(s);
    expect(words).toContain('13 marks in all');
    expect(words).toContain('2 kinds counted');
    expect(words).toContain('ant');
    expect(words).not.toMatch(/great|well done|yay|amazing/i);
  });
});

describe('splitting a kind is a revision, not a rewrite', () => {
  const bug = kind('🐛', 'bug');
  const ant = kind('🐜', 'ant');
  const roly = kind('🐞', 'roly-poly');

  const book = (): { sheets: readonly LogSheet[]; lineages: ReturnType<typeof applySplit>['lineages'] } => {
    const split = applySplit([bug], [], bug.key, [ant, roly], '2026-06-01');
    return {
      sheets: [
        sheetOn('2026-05-01', [bug], { [bug.key]: 4 }),
        sheetOn('2026-05-15', [bug], { [bug.key]: 7 }),
        sheetOn('2026-06-02', [ant, roly], { [ant.key]: 3, [roly.key]: 5 }),
      ],
      lineages: split.lineages,
    };
  };

  it('retires the parent from the schema and adds the children', () => {
    const { categories, lineages } = applySplit([bug], [], bug.key, [ant, roly], '2026-06-01');
    expect(categories.map((c) => c.key)).toEqual([ant.key, roly.key]);
    expect(lineages).toEqual([{ parent: bug.key, children: [ant.key, roly.key], fromDate: '2026-06-01' }]);
  });

  it('carries the parent series across the seam as the sum of its children', () => {
    // 4, then 7, then (3 ants + 5 roly-polies) = 8.
    const { sheets, lineages } = book();
    const run = resolvedSeries(sheets, bug.key, lineages);
    expect(run.points.map((p) => p.count)).toEqual([4, 7, 8]);
    expect(run.seam).toBe('2026-06-01');
    expect(run.children).toEqual([ant.key, roly.key]);
    expect(run.peak).toBe(8);
    expect(run.change).toBe(4); // 8 - 4
  });

  it('marks the parent absent from his schema after the seam, so the seam stays visible', () => {
    const { sheets, lineages } = book();
    const run = resolvedSeries(sheets, bug.key, lineages);
    expect(run.points.map((p) => p.present)).toEqual([true, true, true]);
    const child = resolvedSeries(sheets, ant.key, lineages);
    expect(child.points.map((p) => p.count)).toEqual([0, 0, 3]);
    expect(child.points.map((p) => p.present)).toEqual([false, false, true]);
    expect(child.seam).toBeNull();
  });

  it('follows a split of a split, so the taxonomy can keep getting finer', () => {
    // bug -> (ant, roly); then ant -> (black ant, red ant) with 2 + 6 = 8.
    const black = kind('🐜', 'black ant', PALETTE.slate);
    const red = kind('🐜', 'red ant', PALETTE.terracotta);
    const one = applySplit([bug], [], bug.key, [ant, roly], '2026-06-01');
    const two = applySplit(one.categories, one.lineages, ant.key, [black, red], '2026-07-01');
    const sheets = [
      sheetOn('2026-05-01', [bug], { [bug.key]: 4 }),
      sheetOn('2026-06-02', [ant, roly], { [ant.key]: 3, [roly.key]: 5 }),
      sheetOn('2026-07-04', [black, red, roly], { [black.key]: 2, [red.key]: 6, [roly.key]: 1 }),
    ];
    expect(resolvedSeries(sheets, ant.key, two.lineages).points.map((p) => p.count)).toEqual([0, 3, 8]);
    // The grandparent is still readable: 4, then 3 + 5 = 8, then (2 + 6) + 1 = 9.
    expect(resolvedSeries(sheets, bug.key, two.lineages).points.map((p) => p.count)).toEqual([4, 8, 9]);
  });

  it('refuses a split that is not a split, and leaves the book untouched', () => {
    const one = applySplit([bug], [], bug.key, [ant], '2026-06-01');
    expect(one.categories).toHaveLength(1);
    expect(one.lineages).toHaveLength(0);
    const missing = applySplit([ant], [], bug.key, [ant, roly], '2026-06-01');
    expect(missing.lineages).toHaveLength(0);
    const undated = applySplit([bug], [], bug.key, [ant, roly], '');
    expect(undated.lineages).toHaveLength(0);
  });

  it('draws a panel for what he counts now and for every seam behind it', () => {
    const { sheets, lineages } = book();
    const keys = seriesKeys([ant, roly], lineages);
    expect(keys).toEqual([ant.key, roly.key, bug.key]);
    const known = catalogue(sheets, [ant, roly]);
    expect(known.get(bug.key)?.name).toBe('bug');
  });
});

describe('the series only exists because he came back', () => {
  const bee = kind('🐝', 'bee');

  it('orders the run by date however the sheets were kept', () => {
    const records: QuadratRecord[] = [
      sheetOn('2026-07-01', [bee], { [bee.key]: 2 }),
      sheetOn('2026-05-01', [bee], { [bee.key]: 9 }),
      { ...composeSite({ plan: EMPTY_PLAN, categories: [bee], lineages: [] }), id: 'site-1', made: '2026-04-01T00:00:00.000Z' },
    ];
    expect(sheetsInOrder(records).map((s) => s.date)).toEqual(['2026-05-01', '2026-07-01']);
    expect(latestSite(records)?.id).toBe('site-1');
  });

  it('has no series at all before the first visit', () => {
    expect(resolvedSeries([], bee.key, []).points).toEqual([]);
    expect(resolvedSeries([], bee.key, []).change).toBe(0);
    expect(changeSummary([], [])).toBe('No sheets yet.');
  });

  it('lays out last time&apos;s kinds so returning is one tap', () => {
    const site = { ...composeSite({ plan: EMPTY_PLAN, categories: [bee], lineages: [] }), id: 'site-1', made: '2026-04-01T00:00:00.000Z' };
    expect(carryForward(site, []).map((c) => c.name)).toEqual(['bee']);
    expect(carryForward(null, [sheetOn('2026-05-01', [bee], {})]).map((c) => c.name)).toEqual(['bee']);
    expect(carryForward(null, [])).toEqual([]);
  });

  it('states the run in plain words', () => {
    const sheets = [
      sheetOn('2026-05-01', [bee], { [bee.key]: 4 }),
      sheetOn('2026-07-14', [bee], { [bee.key]: 11 }),
    ];
    expect(changeSummary(sheets, [])).toBe(
      '2 visits, 1 May 2026 to 14 July 2026. The highest count on any one sheet is 11.',
    );
  });
});

describe('counting cannot go wrong', () => {
  it('adds one and never falls below nothing', () => {
    expect(bump({}, 'a')).toEqual({ a: 1 });
    expect(bump({ a: 1 }, 'a', -1)).toEqual({ a: 0 });
    expect(bump({ a: 0 }, 'a', -1)).toEqual({ a: 0 });
  });

  it('totals only what is really there', () => {
    expect(totalMarks({ a: 3, b: 0, c: 7 })).toBe(10);
    expect(totalMarks({})).toBe(0);
  });
});

describe('the site plan', () => {
  it('stamps, un-stamps and rubs out', () => {
    const one = stampCell(EMPTY_PLAN, 3, 'tree');
    expect(one.stamps['3']).toBe('tree');
    expect(stampCell(one, 3, 'tree').stamps['3']).toBeUndefined();
    expect(stampCell(one, 3, 'pot').stamps['3']).toBe('pot');
    expect(clearCell(one, 3).stamps['3']).toBeUndefined();
    expect(stampCell(EMPTY_PLAN, 99, 'tree')).toBe(EMPTY_PLAN);
  });

  it('takes four corners, and a fifth tap starts the square again', () => {
    const four = [0, 5, 23, 18].reduce(markCorner, EMPTY_PLAN);
    expect(four.corners).toEqual([0, 5, 23, 18]);
    expect(planIsSquared(four)).toBe(true);
    expect(markCorner(four, 12).corners).toEqual([12]);
    expect(markCorner(four, 5).corners).toEqual([0, 23, 18]);
    expect(planIsSquared(EMPTY_PLAN)).toBe(false);
  });

  it('drops a corner when its square is rubbed out', () => {
    const marked = markCorner(stampCell(EMPTY_PLAN, 4, 'pot'), 4);
    expect(clearCell(marked, 4).corners).toEqual([]);
  });

  it('is only pinned to the earth once a real place is fixed', () => {
    expect(EMPTY_PLAN.placed).toBe(false);
    const placed = setPlace(EMPTY_PLAN, 37.386, -122.084);
    expect(placed.placed).toBe(true);
    expect(placed.lat).toBeCloseTo(37.386, 6);
    expect(setPlace(EMPTY_PLAN, Number.NaN, 0).placed).toBe(false);
  });
});

describe('his sheets file alongside everybody else&apos;s', () => {
  const bee = kind('🐝', 'bee');

  it('drops a pin at his own coordinates in the live era band', () => {
    const placed = setPlace(EMPTY_PLAN, 37.386, -122.084);
    const sheet: LogSheet = {
      ...composeSheet({ date: '2026-07-14', weather: 'sun', plan: placed, categories: [bee], counts: { [bee.key]: 3 } }),
      id: 's1',
      made: '2026-07-14T09:00:00.000Z',
    };
    const pin = pinFor(sheet);
    expect(pin?.lat).toBeCloseTo(37.386, 6);
    expect(pin?.lng).toBeCloseTo(-122.084, 6);
    expect(pin?.year).toBe(2026);
    expect(pin?.yearLabel).toBe('2026 CE');
    expect(pin?.era).toBe(LIVE_ERA_BAND);
  });

  it('drops no pin when nobody fixed the place, rather than pinning to nowhere', () => {
    expect(pinFor(sheetOn('2026-07-14', [bee], { [bee.key]: 1 }))).toBeNull();
    expect(pinsFrom([sheetOn('2026-07-14', [bee], { [bee.key]: 1 })])).toEqual([]);
  });
});

describe('drawn geometry is deterministic, because plates must not wobble', () => {
  it('gives an exact, hand-checkable square', () => {
    expect(shapePath('square', 10, 10, 4)).toBe('M6 6H14V14H6Z');
  });

  it('gives the same path twice and a different path per shape', () => {
    for (const shape of SHAPE_KEYS) {
      expect(shapePath(shape, 12, 12, 8)).toBe(shapePath(shape, 12, 12, 8));
    }
    expect(new Set(SHAPE_KEYS.map((s) => shapePath(s, 12, 12, 8))).size).toBe(SHAPE_KEYS.length);
  });

  it('holds no external references, so an exported plate survives on its own', () => {
    for (const shape of SHAPE_KEYS) {
      expect(shapePath(shape, 12, 12, 8)).not.toMatch(/url\(|http/);
    }
  });
});

describe('dates', () => {
  it('uses the child&apos;s own day, not a timezone&apos;s', () => {
    expect(isoDate(new Date(2026, 6, 4, 23, 30))).toBe('2026-07-04');
    expect(isoDate(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01');
  });

  it('reads a date aloud the way a grown-up would say it', () => {
    expect(formatDate('2026-07-14')).toBe('14 July 2026');
    expect(formatDate('2026-01-01')).toBe('1 January 2026');
    expect(formatDate('nonsense')).toBe('nonsense');
  });
});
