import { describe, it, expect } from 'vitest';
import {
  ALL_THINGS,
  CM_PER_FOOT,
  CM_TO_PX,
  EXTRA_THINGS,
  MAX_LAYS,
  SHEET_CM,
  STANDARD_COLUMNS,
  THINGS,
  TABLE_OF_MEASURES_META,
  UNIT_SPECS,
  buildTable,
  bumpCount,
  composeReading,
  composeUnit,
  convert,
  countLabel,
  express,
  fmt,
  isCalibrated,
  isoDay,
  lengthInCm,
  ownsGlyph,
  plateLines,
  recalibrated,
  round1,
  rulerSummary,
  rulerTicks,
  rulerWidthPx,
  tableSummary,
  thingSpec,
  unitCm,
  unitLine,
  unitSpec,
  unitsInOrder,
  type Reading,
  type Unit,
} from '../workshop/table-of-measures';

/* Small builders so each case reads as arithmetic, not as plumbing. */
const unit = (id: string, glyph: Unit['glyph'], cm: number | null, made = '2026-01-01'): Unit => ({
  id,
  made,
  glyph,
  cm,
});

const reading = (id: string, thing: Reading['thing'], unitId: string, lays: number, made = '2026-02-01'): Reading => ({
  id,
  made,
  thing,
  unitId,
  lays,
});

/** A spoon he has laid on the paper ruler and counted twelve notches for. */
const SPOON = unit('u-spoon', 'spoon', 12, '2026-01-01');
/** His own foot, thirty centimetres, invented after the spoon. */
const HIS_FOOT = unit('u-foot', 'foot', 30, '2026-01-02');

const columnIds = (units: readonly Unit[], readings: readonly Reading[] = []): string[] =>
  buildTable(units, readings).columns.map((c) => c.id);

const cellsFor = (
  units: readonly Unit[],
  readings: readonly Reading[],
  thing: Reading['thing'],
): (number | null)[] => {
  const row = buildTable(units, readings).rows.find((r) => r.thing === thing);
  return row ? row.cells.map((c) => c.value) : [];
};

describe('the shape of the tool', () => {
  it('names itself once, for the hub and for the bench head', () => {
    expect(TABLE_OF_MEASURES_META.id).toBe('table-of-measures');
    expect(TABLE_OF_MEASURES_META.title).toBe('The Table of Measures');
    expect(TABLE_OF_MEASURES_META.eyebrow).toBe('Compose');
    expect(TABLE_OF_MEASURES_META.note.length).toBeGreaterThan(20);
  });

  it('offers nine pictorial units, each with a singular and a plural', () => {
    expect(UNIT_SPECS).toHaveLength(9);
    for (const spec of UNIT_SPECS) {
      expect(spec.one.length).toBeGreaterThan(0);
      expect(spec.many.length).toBeGreaterThan(0);
      expect(spec.paths.length).toBeGreaterThan(0);
    }
    expect(new Set(UNIT_SPECS.map((s) => s.key)).size).toBe(9);
  });

  it('offers the fixed things plus a few he can bring on, with no duplicate keys', () => {
    expect(THINGS.length).toBeGreaterThanOrEqual(7);
    expect(EXTRA_THINGS.length).toBeGreaterThanOrEqual(3);
    expect(ALL_THINGS).toHaveLength(THINGS.length + EXTRA_THINGS.length);
    expect(new Set(ALL_THINGS.map((t) => t.key)).size).toBe(ALL_THINGS.length);
  });

  it('falls back rather than returning nothing when a stored key has rotted', () => {
    expect(unitSpec('not-a-unit').key).toBe(UNIT_SPECS[0].key);
    expect(thingSpec('not-a-thing').key).toBe(ALL_THINGS[0].key);
  });
});

describe('conversion, worked by hand', () => {
  it('3 spoons at 12cm is 36cm', () => {
    // 3 lays x 12 cm = 36 cm
    expect(lengthInCm(3, SPOON)).toBe(36);
  });

  it('36cm is 1.2 of a 30cm foot', () => {
    // 36 / 30 = 1.2
    expect(express(36, 30)).toBe(1.2);
    expect(convert(3, SPOON, HIS_FOOT)).toBe(1.2);
  });

  it('36cm is 1.2 standard feet, because 36 / 30.48 = 1.1811 and the table shows one decimal', () => {
    expect(CM_PER_FOOT).toBe(30.48);
    expect(36 / CM_PER_FOOT).toBeCloseTo(1.1811, 4);
    expect(express(36, CM_PER_FOOT)).toBe(1.2);
  });

  it('round-trips: spoons to feet and back again lands on the same length', () => {
    const feet = convert(3, SPOON, HIS_FOOT); // 1.2 feet
    expect(feet).toBe(1.2);
    // 1.2 feet x 30 cm = 36 cm, and 36 / 12 = 3 spoons again
    expect(lengthInCm(feet ?? 0, HIS_FOOT)).toBe(36);
    expect(express(lengthInCm(feet ?? 0, HIS_FOOT), 12)).toBe(3);
  });

  it('round-trips through the standard column too', () => {
    // 5 lays of a 17cm foot = 85cm; 85 / 30.48 = 2.789 ft; 2.8 ft is 85.3cm back
    const cm = lengthInCm(5, unit('u', 'foot', 17));
    expect(cm).toBe(85);
    const ft = express(cm, CM_PER_FOOT);
    expect(ft).toBe(2.8);
    expect(round1((ft ?? 0) * CM_PER_FOOT)).toBe(85.3);
  });

  it('rounds to one decimal and never further', () => {
    expect(round1(1.24)).toBe(1.2);
    expect(round1(1.25)).toBe(1.3);
    expect(round1(0)).toBe(0);
    expect(fmt(1.2)).toBe('1.2');
    expect(fmt(3)).toBe('3.0');
    expect(fmt(null)).toBe('—');
  });
});

describe('a unit with no length yet', () => {
  const raw = unit('u-cat', 'cat', null);

  it('is not calibrated, and says so in words rather than in a number', () => {
    expect(isCalibrated(raw)).toBe(false);
    expect(unitCm(raw)).toBeNull();
    expect(unitLine(raw)).toContain('no length');
    expect(unitLine(SPOON)).toContain('12');
  });

  it('yields null rather than NaN or Infinity, whichever way it is asked', () => {
    expect(lengthInCm(4, raw)).toBeNull();
    expect(convert(4, raw, SPOON)).toBeNull();
    expect(convert(4, SPOON, raw)).toBeNull();
    expect(express(null, 12)).toBeNull();
    expect(express(36, null)).toBeNull();
    expect(express(36, 0)).toBeNull();
    expect(express(36, -12)).toBeNull();
    expect(express(Number.NaN, 12)).toBeNull();
    expect(express(36, Number.POSITIVE_INFINITY)).toBeNull();
    expect(unitCm(unit('u', 'cat', Number.NaN))).toBeNull();
    expect(unitCm(unit('u', 'cat', Number.POSITIVE_INFINITY))).toBeNull();
    expect(unitCm(unit('u', 'cat', 0))).toBeNull();
    expect(unitCm(null)).toBeNull();
  });

  it('still records a true reading in its own column, and blanks the rest', () => {
    const readings = [reading('r1', 'sofa', 'u-cat', 4)];
    const table = buildTable([raw], readings);
    const row = table.rows[0];
    expect(row.cm).toBeNull();
    // the cat column is exact — four cats is four cats
    expect(row.cells[0]).toEqual({ value: 4, measured: true });
    // centimetres and feet cannot be known, so they are blank, not zero
    expect(row.cells[1].value).toBeNull();
    expect(row.cells[2].value).toBeNull();
    for (const cell of row.cells) {
      if (cell.value !== null) expect(Number.isFinite(cell.value)).toBe(true);
    }
  });

  it('gains every cell the moment it is given a length', () => {
    const readings = [reading('r1', 'sofa', 'u-cat', 4)];
    const measured = recalibrated(raw, 46);
    expect(measured.id).toBe(raw.id);
    expect(measured.made).toBe(raw.made);
    const row = buildTable([measured], readings).rows[0];
    // 4 cats x 46 cm = 184 cm; 184 / 30.48 = 6.04 ft
    expect(row.cm).toBe(184);
    expect(row.cells[0].value).toBe(4);
    expect(row.cells[1].value).toBe(184);
    expect(row.cells[2].value).toBe(6);
  });

  it('drops a nonsense calibration back to no length at all', () => {
    expect(recalibrated(SPOON, 0).cm).toBeNull();
    expect(recalibrated(SPOON, -3).cm).toBeNull();
    expect(recalibrated(SPOON, null).cm).toBeNull();
    expect(recalibrated(SPOON, 12.7).cm).toBe(12);
  });
});

describe('the table', () => {
  const readings = [reading('r1', 'table', 'u-spoon', 3, '2026-02-01')];

  it('puts his own units first and the standard ones last', () => {
    expect(columnIds([HIS_FOOT, SPOON])).toEqual(['u-spoon', 'u-foot', 'std-cm', 'std-ft']);
    const table = buildTable([SPOON], []);
    expect(table.columns.filter((c) => c.standard).map((c) => c.head)).toEqual(['cm', 'ft']);
    expect(STANDARD_COLUMNS.map((c) => c.cm)).toEqual([1, CM_PER_FOOT]);
  });

  it('keeps column order by invention, not by name', () => {
    const late = unit('u-late', 'brick', 3, '2026-03-01');
    const early = unit('u-early', 'book', 20, '2026-01-01');
    expect(unitsInOrder([late, early]).map((u) => u.id)).toEqual(['u-early', 'u-late']);
    expect(columnIds([late, early])[0]).toBe('u-early');
  });

  it('expresses one reading in every unit he owns', () => {
    // 3 spoons x 12cm = 36cm; 36/30 = 1.2 of his foot; 36/30.48 = 1.2 standard feet
    expect(cellsFor([SPOON, HIS_FOOT], readings, 'table')).toEqual([3, 1.2, 36, 1.2]);
  });

  it('re-expresses every past reading when a new unit is invented', () => {
    const before = buildTable([SPOON], readings);
    expect(before.columns).toHaveLength(3);
    expect(cellsFor([SPOON], readings, 'table')).toEqual([3, 36, 1.2]);

    // he invents a hand and finds it is 15cm: the old reading gains a column
    const hand = unit('u-hand', 'hand', 15, '2026-04-01');
    const after = buildTable([SPOON, hand], readings);
    expect(after.columns.map((c) => c.id)).toEqual(['u-spoon', 'u-hand', 'std-cm', 'std-ft']);
    // 36 / 15 = 2.4 hands, worked out from a measurement taken long before
    expect(after.rows[0].cells.map((c) => c.value)).toEqual([3, 2.4, 36, 1.2]);
    // and it is marked as worked out, not as measured
    expect(after.rows[0].cells[1].measured).toBe(false);
    expect(after.rows[0].cells[0].measured).toBe(true);
  });

  it('marks the cell he actually laid out, and leaves the rest as inference', () => {
    const table = buildTable([SPOON, HIS_FOOT], readings);
    expect(table.rows[0].cells.map((c) => c.measured)).toEqual([true, false, false, false]);
    expect(table.rows[0].measuredIn).toBe('3 spoons');
  });

  it('lets the latest reading fix the length when he measures a thing twice', () => {
    const twice = [
      reading('r1', 'bed', 'u-spoon', 10, '2026-02-01'),
      reading('r2', 'bed', 'u-foot', 5, '2026-03-01'),
    ];
    const row = buildTable([SPOON, HIS_FOOT], twice).rows[0];
    // the later reading, 5 of his 30cm feet, fixes the bed at 150cm
    expect(row.cm).toBe(150);
    // both tallies he actually took stay exactly as he took them
    expect(row.cells[0].value).toBe(10);
    expect(row.cells[1].value).toBe(5);
    expect(row.cells[2].value).toBe(150);
  });

  it('orders rows by when each thing was first measured', () => {
    const many = [
      reading('r1', 'door', 'u-spoon', 6, '2026-02-03'),
      reading('r2', 'rug', 'u-spoon', 9, '2026-02-01'),
      reading('r3', 'door', 'u-foot', 2, '2026-02-09'),
    ];
    expect(buildTable([SPOON, HIS_FOOT], many).rows.map((r) => r.thing)).toEqual(['rug', 'door']);
  });

  it('is empty, not broken, before he has measured anything', () => {
    const table = buildTable([], []);
    expect(table.rows).toEqual([]);
    expect(table.columns.map((c) => c.id)).toEqual(['std-cm', 'std-ft']);
    expect(tableSummary(table)).toContain('empty');
    expect(plateLines(table, [])).toHaveLength(1);
  });

  it('says its own state in words for the drawing label', () => {
    const said = tableSummary(buildTable([SPOON, HIS_FOOT], readings));
    expect(said).toContain('1 thing');
    expect(said).toContain('2 units');
    expect(said).toContain('3 spoons');
    expect(plateLines(buildTable([SPOON], readings), [SPOON])).toEqual([
      '1 thing measured',
      'a spoon, 12 centimetres',
    ]);
  });
});

describe('zero lays, one lay', () => {
  it('reads a thing measured at zero lays as zero everywhere, never as blank', () => {
    const row = buildTable([SPOON], [reading('r0', 'rug', 'u-spoon', 0)]).rows[0];
    expect(row.cm).toBe(0);
    expect(row.cells.map((c) => c.value)).toEqual([0, 0, 0]);
    expect(fmt(row.cells[0].value)).toBe('0.0');
    expect(row.measuredIn).toBe('0 spoons');
  });

  it('reads one lay as exactly the length of the unit, and says it in the singular', () => {
    const row = buildTable([SPOON], [reading('r1', 'door', 'u-spoon', 1)]).rows[0];
    // 1 spoon = 12cm = 12/30.48 = 0.3937 ft, shown as 0.4
    expect(row.cm).toBe(12);
    expect(row.cells.map((c) => c.value)).toEqual([1, 12, 0.4]);
    expect(row.measuredIn).toBe('1 spoon');
    expect(countLabel(1, SPOON)).toBe('1 spoon');
    expect(countLabel(2, SPOON)).toBe('2 spoons');
    expect(countLabel(1, HIS_FOOT)).toBe('1 foot');
    expect(countLabel(3, HIS_FOOT)).toBe('3 feet');
    expect(countLabel(1, null)).toBe('1 lay');
  });
});

describe('a measurement in progress', () => {
  it('appears in the table as he taps, marked as the live row', () => {
    const table = buildTable([SPOON], [], { thing: 'hall', unitId: 'u-spoon', lays: 7 });
    expect(table.rows).toHaveLength(1);
    expect(table.rows[0].live).toBe(true);
    // 7 spoons x 12 = 84cm
    expect(table.rows[0].cells.map((c) => c.value)).toEqual([7, 84, 2.8]);
  });

  it('is ignored while the tally still stands at nothing', () => {
    expect(buildTable([SPOON], [], { thing: 'hall', unitId: 'u-spoon', lays: 0 }).rows).toEqual([]);
  });

  it('overrides the kept reading for the same thing while it is being retaken', () => {
    const kept = [reading('r1', 'hall', 'u-spoon', 4)];
    const table = buildTable([SPOON], kept, { thing: 'hall', unitId: 'u-spoon', lays: 9 });
    expect(table.rows).toHaveLength(1);
    expect(table.rows[0].cells[0].value).toBe(9);
    expect(table.rows[0].cm).toBe(108);
  });
});

describe('the paper ruler', () => {
  it('marked in centimetres, is an ordinary ruler with a notch at every centimetre', () => {
    const ticks = rulerTicks(1);
    expect(ticks).toHaveLength(SHEET_CM + 1);
    expect(ticks.every((t) => t.kind === 'unit')).toBe(true);
    expect(ticks[0].cm).toBe(0);
    expect(ticks[0].label).toBe('0');
    expect(ticks[ticks.length - 1].cm).toBe(SHEET_CM);
    expect(ticks[ticks.length - 1].label).toBe(String(SHEET_CM));
  });

  it('marked in a small unit, counts whole units', () => {
    // a Lego brick of 3.2cm: 17 / 3.2 = 5 whole bricks on the strip
    const ticks = rulerTicks(3.2);
    expect(ticks).toHaveLength(6);
    expect(ticks.every((t) => t.kind === 'unit')).toBe(true);
    expect(ticks[5].cm).toBeCloseTo(16, 6);
  });

  it('marked in a long unit, subdivides so the strip still carries notches', () => {
    // a 12cm spoon will not fit four times, so the strip is ruled in quarter spoons
    const ticks = rulerTicks(12);
    expect(ticks.length).toBeGreaterThanOrEqual(5);
    expect(ticks[1].units).toBe(0.25);
    expect(ticks[1].kind).toBe('part');
    expect(ticks[2].kind).toBe('half');
    expect(ticks[4].kind).toBe('unit');
    expect(ticks[4].label).toBe('1');
    expect(ticks.filter((t) => t.label !== null).map((t) => t.label)).toEqual(['0', '1']);
  });

  it('never runs off the end of the paper, and always climbs', () => {
    for (const cm of [1, 2.5, 3.2, 12, 17, 30, 46]) {
      const ticks = rulerTicks(cm);
      expect(ticks.length).toBeGreaterThan(0);
      for (const t of ticks) {
        expect(t.cm).toBeLessThanOrEqual(SHEET_CM + 1e-9);
        expect(Number.isFinite(t.cm)).toBe(true);
      }
      for (let i = 1; i < ticks.length; i += 1) expect(ticks[i].cm).toBeGreaterThan(ticks[i - 1].cm);
    }
  });

  it('refuses to rule a strip from a unit that has no length', () => {
    expect(rulerTicks(0)).toEqual([]);
    expect(rulerTicks(-4)).toEqual([]);
    expect(rulerTicks(Number.NaN)).toEqual([]);
    expect(rulerTicks(Number.POSITIVE_INFINITY)).toEqual([]);
    expect(rulerTicks(12, 0)).toEqual([]);
  });

  it('is true-scale on paper: 17cm at 96 pixels to the inch', () => {
    expect(CM_TO_PX).toBeCloseTo(37.7953, 4);
    expect(rulerWidthPx(SHEET_CM)).toBeCloseTo(642.52, 2);
    expect(rulerWidthPx(0)).toBe(0);
  });

  it('describes itself differently before and after the unit is measured', () => {
    expect(rulerSummary(null)).toContain('centimetre ruler');
    expect(rulerSummary(unit('u', 'cat', null))).toContain('centimetre ruler');
    expect(rulerSummary(SPOON)).toContain('spoons');
  });
});

describe('the small pieces the bench leans on', () => {
  it('keeps a tally inside its bounds without ever going below nothing', () => {
    expect(bumpCount(0, 1, MAX_LAYS)).toBe(1);
    expect(bumpCount(0, -1, MAX_LAYS)).toBe(0);
    expect(bumpCount(7, 10, MAX_LAYS)).toBe(17);
    expect(bumpCount(MAX_LAYS, 1, MAX_LAYS)).toBe(MAX_LAYS);
    expect(bumpCount(3.6, 1, MAX_LAYS)).toBe(4);
  });

  it('composes a unit with no length and a reading with a whole number of lays', () => {
    expect(composeUnit('spoon')).toEqual({ glyph: 'spoon', cm: null });
    expect(composeUnit('spoon', 12)).toEqual({ glyph: 'spoon', cm: 12 });
    expect(composeReading({ thing: 'bed', unitId: 'u', lays: 4.8 }).lays).toBe(4);
    expect(composeReading({ thing: 'bed', unitId: 'u', lays: -2 }).lays).toBe(0);
  });

  it('knows which pictures he has already claimed', () => {
    expect(ownsGlyph([SPOON], 'spoon')).toBe(true);
    expect(ownsGlyph([SPOON], 'cat')).toBe(false);
  });

  it('writes a plain date for a filename', () => {
    expect(isoDay(new Date(2026, 6, 4))).toBe('2026-07-04');
    expect(isoDay(new Date(2026, 11, 25))).toBe('2026-12-25');
  });
});
