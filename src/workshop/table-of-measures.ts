/**
 * The Table of Measures.
 *
 * The generative rule is that the UNITS are his, not ours. He nominates a
 * pictorial unit — his foot, a spoon, the cat — and thereafter measures the
 * real world by laying that thing end over end and tapping once per lay. The
 * tally is the measurement. Once, and only once, he lays the unit against a
 * printed centimetre ruler and taps out its length, and from that single fact
 * every reading he has ever taken becomes convertible into every unit he
 * owns. So the table is f(units x things x lays): a new unit does not add a
 * column of blanks, it re-expresses the whole history, and the standard foot
 * and centimetre sit at the right-hand edge in grey — present, comparable,
 * and given no more authority than the cat.
 *
 * Pure module. No React, no DOM, no randomness, no clock except where a date
 * is handed in.
 */
import type { Kept } from './drawer';

export const TABLE_OF_MEASURES_META = {
  id: 'table-of-measures',
  title: 'The Table of Measures',
  eyebrow: 'Compose',
  note: 'Invent your own units, measure the house with them, and read every measurement in every unit you own.',
} as const;

/* ------------------------------------------------------------------ palette */

export const PALETTE = {
  paper: '#f4f0e6',
  raised: '#fbf9f4',
  sunken: '#eae4d5',
  ink: '#22211b',
  faint: '#6b6757',
  rule: '#ddd6c4',
  terracotta: '#9e4b27',
  ochre: '#8a6416',
  teal: '#2a5957',
  olive: '#55632f',
  slate: '#3c566f',
} as const;

/* ---------------------------------------------------------------- constants */

/** One foot, exactly, by definition of the inch. */
export const CM_PER_FOOT = 30.48;
/** CSS assumes 96 pixels to the inch, which is what makes a printed ruler true. */
export const CM_TO_PX = 96 / 2.54;
/** A strip this long clears the margins of both A4 and Letter. */
export const SHEET_CM = 17;
/** A unit longer than four metres is a slip of the finger, not a measurement. */
export const MAX_NOTCHES = 400;
/** Two hundred lays of anything is a long afternoon. */
export const MAX_LAYS = 200;

const DRAFT_ID = 'draft';
const DRAFT_MADE = '9999-12-31T00:00:00.000Z';

/* -------------------------------------------------------------------- units */

export type UnitGlyphKey =
  | 'foot'
  | 'spoon'
  | 'shoe'
  | 'hand'
  | 'book'
  | 'brick'
  | 'step'
  | 'string'
  | 'cat';

export interface UnitSpec {
  readonly key: UnitGlyphKey;
  /** 'foot' — used after the number one. */
  readonly one: string;
  /** 'feet' — used as the column head and after every other number. */
  readonly many: string;
  /** 'my foot' — spoken, and printed on the ruler. */
  readonly label: string;
  readonly paths: readonly string[];
}

export const UNIT_SPECS: readonly UnitSpec[] = [
  {
    key: 'foot',
    one: 'foot',
    many: 'feet',
    label: 'my foot',
    paths: [
      'M9 22c-2.5 0-3.5-2.1-3.5-4.4 0-2.1.8-3 .8-4.9 0-2.3-.5-3.2-.5-4.9C5.8 5.5 7.1 4 9 4s3.2 1.5 3.2 3.8c0 1.7-.6 2.6-.6 4.9 0 1.9.9 2.8.9 4.9C12.5 19.9 11.5 22 9 22z',
      'M15 6.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z',
      'M16.6 10.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z',
      'M16.4 14.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z',
    ],
  },
  {
    key: 'spoon',
    one: 'spoon',
    many: 'spoons',
    label: 'a spoon',
    paths: ['M12 3.2c2.3 0 3.8 2 3.8 4.4S14.3 12 12 12s-3.8-1.9-3.8-4.4S9.7 3.2 12 3.2z', 'M12 12v8.8'],
  },
  {
    key: 'shoe',
    one: 'shoe',
    many: 'shoes',
    label: 'a shoe',
    paths: ['M3.5 12.8h3.8l3.6 2.6h4.4c2.9 0 5.2 1.3 5.2 3.2v1.2H3.5z', 'M7.6 12.8l1.4 2.6'],
  },
  {
    key: 'hand',
    one: 'hand',
    many: 'hands',
    label: 'my hand',
    paths: [
      'M7 12.6h10v4.4c0 2.6-2.2 4.6-5 4.6s-5-2-5-4.6z',
      'M8.6 12.6V7.2',
      'M11 12.6V5.4',
      'M13.4 12.6V5.8',
      'M15.8 12.6V7.6',
      'M17 14l2.4-2.2',
    ],
  },
  {
    key: 'book',
    one: 'book',
    many: 'books',
    label: 'a book',
    paths: [
      'M12 6.4C10 4.9 7.2 4.2 4 4.2v13.2c3.2 0 6 .7 8 2.2 2-1.5 4.8-2.2 8-2.2V4.2c-3.2 0-6 .7-8 2.2z',
      'M12 6.4v13.2',
    ],
  },
  {
    key: 'brick',
    one: 'brick',
    many: 'bricks',
    label: 'a Lego brick',
    paths: [
      'M4.6 9.6h14.8v8.8H4.6z',
      'M8 9.6V7.8a1.6 1.6 0 0 1 3.2 0v1.8',
      'M12.8 9.6V7.8a1.6 1.6 0 0 1 3.2 0v1.8',
    ],
  },
  {
    key: 'step',
    one: 'step',
    many: 'steps',
    label: 'my step',
    paths: [
      'M12 3.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8z',
      'M12 7.4v5.4',
      'M12 12.8L8 19.6',
      'M12 12.8l4 6.8',
      'M12 9.2L8.6 11',
      'M12 9.2l3.6 1.6',
      'M7.2 21.4h9.6',
    ],
  },
  {
    key: 'string',
    one: 'string',
    many: 'strings',
    label: 'a piece of string',
    paths: [
      'M2.8 15.8c2.2-5.2 5-3 6.4-.4 1.4 2.6 4.2 4.4 6-.4 1-2.6 3.4-3.4 6-1.6',
      'M2.8 13.6v4',
      'M21.2 11.6v4',
    ],
  },
  {
    key: 'cat',
    one: 'cat',
    many: 'cats',
    label: 'the cat',
    paths: [
      'M8.4 21.2v-7.4a3.6 3.6 0 0 1 7.2 0v7.4',
      'M9.4 10.6L8.6 6.6l3.2 1.8',
      'M14.6 10.6l.8-4-3.2 1.8',
      'M15.6 21.2c3.4 0 4.6-2.2 4.6-4.6',
    ],
  },
];

export function unitSpec(glyph: string): UnitSpec {
  return UNIT_SPECS.find((s) => s.key === glyph) ?? UNIT_SPECS[0];
}

/* ------------------------------------------------------------------- things */

export type ThingKey =
  | 'table'
  | 'sofa'
  | 'hall'
  | 'bed'
  | 'door'
  | 'rug'
  | 'cot'
  | 'window'
  | 'stairs'
  | 'bath'
  | 'bookcase'
  | 'car'
  | 'tree';

export interface ThingSpec {
  readonly key: ThingKey;
  readonly label: string;
  readonly paths: readonly string[];
}

/** Always on the bench: the things a five-year-old walks past every day. */
export const THINGS: readonly ThingSpec[] = [
  { key: 'table', label: 'the table', paths: ['M2.8 7.8h18.4v2H2.8z', 'M6.2 9.8v8.6', 'M17.8 9.8v8.6'] },
  {
    key: 'sofa',
    label: 'the sofa',
    paths: [
      'M4 12.2a2.2 2.2 0 0 1 4.4 0v2.6h7.2v-2.6a2.2 2.2 0 0 1 4.4 0v6.2H4z',
      'M6.2 18.4v2',
      'M17.8 18.4v2',
    ],
  },
  {
    key: 'hall',
    label: 'the hall',
    paths: ['M3 3.4v17.2', 'M21 3.4v17.2', 'M3 20.6l5.4-4.2h7.2l5.4 4.2', 'M8.4 16.4V8.6h7.2v7.8', 'M3 3.4l5.4 5.2', 'M21 3.4l-5.4 5.2'],
  },
  {
    key: 'bed',
    label: 'the bed',
    paths: [
      'M3 18.6v-6.8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.8',
      'M3 15h18',
      'M6 12.6h4.2v2.4H6z',
      'M3 18.6v2',
      'M21 18.6v2',
    ],
  },
  { key: 'door', label: 'the door', paths: ['M6.2 3.2h11.6v17.6H6.2z', 'M8.4 5.6h7.2v6H8.4z', 'M15 14.4h1.4'] },
  {
    key: 'rug',
    label: 'the rug',
    paths: ['M2.8 15l9.2-5.2 9.2 5.2-9.2 5.2z', 'M4.4 15.9l-1.4 1.8', 'M19.6 15.9l1.4 1.8', 'M12 12.2l4 2.8-4 2.8-4-2.8z'],
  },
  {
    key: 'cot',
    label: 'the cot',
    paths: ['M4 20.4V7.6', 'M20 20.4V7.6', 'M4 12.4h16', 'M4 7.6h16', 'M8 7.6v4.8', 'M12 7.6v4.8', 'M16 7.6v4.8'],
  },
];

/** A few more he can bring onto the bench when he wants them. */
export const EXTRA_THINGS: readonly ThingSpec[] = [
  { key: 'window', label: 'the window', paths: ['M4 4h16v16H4z', 'M12 4v16', 'M4 12h16'] },
  { key: 'stairs', label: 'the stairs', paths: ['M3 20.6v-3.4h4.6v-3.4h4.6v-3.4h4.6V7h3.6', 'M3 20.6h17.4'] },
  {
    key: 'bath',
    label: 'the bath',
    paths: [
      'M3 11.4h18v3.2a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 14.6z',
      'M6.6 11.4V7.2a2 2 0 0 1 2-2h1.6',
      'M6.6 19.4v1.8',
      'M17.4 19.4v1.8',
    ],
  },
  { key: 'bookcase', label: 'the bookcase', paths: ['M4.2 3.4h15.6v17.2H4.2z', 'M4.2 9.2h15.6', 'M4.2 15h15.6'] },
  {
    key: 'car',
    label: 'the car',
    paths: [
      'M3.2 15.4l2.2-5.2h13.2l2.2 5.2v3.2H3.2z',
      'M5.4 18.6a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
      'M14.6 18.6a2 2 0 1 0 4 0 2 2 0 1 0-4 0',
      'M8.4 10.2v5.2',
      'M15.6 10.2v5.2',
    ],
  },
  {
    key: 'tree',
    label: 'the tree',
    paths: ['M12 20.8v-6.6', 'M12 14.6a5.2 5.2 0 1 1 0-10.4 5.2 5.2 0 0 1 0 10.4z', 'M12 17.4l-2.8-2.6', 'M12 16l2.8-2.6'],
  },
];

export const ALL_THINGS: readonly ThingSpec[] = [...THINGS, ...EXTRA_THINGS];

export function thingSpec(key: string): ThingSpec {
  return ALL_THINGS.find((t) => t.key === key) ?? ALL_THINGS[0];
}

/* ------------------------------------------------------------- kept records */

/** A unit he owns. `cm` is null until he has laid it on the paper ruler. */
export interface Unit extends Kept {
  readonly glyph: UnitGlyphKey;
  readonly cm: number | null;
}

/** One measurement: he laid `unitId` down `lays` times along `thing`. */
export interface Reading extends Kept {
  readonly thing: ThingKey;
  readonly unitId: string;
  readonly lays: number;
}

export function composeUnit(glyph: UnitGlyphKey, cm: number | null = null): Omit<Unit, 'id' | 'made'> {
  return { glyph, cm };
}

export function composeReading(input: {
  readonly thing: ThingKey;
  readonly unitId: string;
  readonly lays: number;
}): Omit<Reading, 'id' | 'made'> {
  return { thing: input.thing, unitId: input.unitId, lays: Math.max(0, Math.trunc(input.lays)) };
}

/** Re-calibrating keeps the unit's identity, so every past reading survives. */
export function recalibrated(unit: Unit, cm: number | null): Unit {
  return { ...unit, cm: cm !== null && cm > 0 ? Math.trunc(cm) : null };
}

const byMade = <T extends Kept>(items: readonly T[]): readonly T[] =>
  [...items].sort((a, b) => (a.made === b.made ? a.id.localeCompare(b.id) : a.made.localeCompare(b.made)));

/** Column order is the order he invented them in, and never changes. */
export function unitsInOrder(units: readonly Unit[]): readonly Unit[] {
  return byMade(units);
}

export function readingsInOrder(readings: readonly Reading[]): readonly Reading[] {
  return byMade(readings);
}

export function ownsGlyph(units: readonly Unit[], glyph: UnitGlyphKey): boolean {
  return units.some((u) => u.glyph === glyph);
}

/* ---------------------------------------------------------------- the maths */

export const round1 = (n: number): number => Math.round(n * 10) / 10;

/** The one guard that keeps every later division honest. */
export function unitCm(unit: { readonly cm: number | null } | null | undefined): number | null {
  const cm = unit ? unit.cm : null;
  return typeof cm === 'number' && Number.isFinite(cm) && cm > 0 ? cm : null;
}

export function isCalibrated(unit: { readonly cm: number | null } | null | undefined): boolean {
  return unitCm(unit) !== null;
}

/** `lays` of `unit`, in centimetres. Null when the unit has no length yet. */
export function lengthInCm(lays: number, unit: { readonly cm: number | null } | null | undefined): number | null {
  const cm = unitCm(unit);
  if (cm === null || !Number.isFinite(lays)) return null;
  return lays * cm;
}

/** A length in centimetres, said in a unit. Rounded to the one decimal the table shows. */
export function express(cm: number | null, targetCm: number | null): number | null {
  if (cm === null || targetCm === null) return null;
  if (!Number.isFinite(cm) || !Number.isFinite(targetCm) || targetCm <= 0) return null;
  return round1(cm / targetCm);
}

/** Straight from one unit to another: 3 spoons of 12cm is 1.2 feet of 30cm. */
export function convert(
  lays: number,
  from: { readonly cm: number | null } | null | undefined,
  to: { readonly cm: number | null } | null | undefined,
): number | null {
  return express(lengthInCm(lays, from), unitCm(to));
}

/** Nothing measured reads as a dash, so a blank is never mistaken for a zero. */
export function fmt(value: number | null): string {
  return value === null ? '—' : value.toFixed(1);
}

/** Keeps a tally inside its bounds without ever going negative. */
export function bumpCount(count: number, by: number, max: number): number {
  const next = Math.trunc(count) + Math.trunc(by);
  return Math.max(0, Math.min(max, next));
}

export function countLabel(n: number, unit: { readonly glyph: UnitGlyphKey } | null | undefined): string {
  if (!unit) return `${n} ${n === 1 ? 'lay' : 'lays'}`;
  const spec = unitSpec(unit.glyph);
  return `${n} ${n === 1 ? spec.one : spec.many}`;
}

export function unitLine(unit: Unit): string {
  const spec = unitSpec(unit.glyph);
  const cm = unitCm(unit);
  return cm === null ? `${spec.label}, no length set yet` : `${spec.label}, ${cm} centimetres`;
}

/* ------------------------------------------------------------------- table */

export interface Column {
  readonly id: string;
  /** 'spoons', 'cm', 'ft'. */
  readonly head: string;
  readonly glyph: UnitGlyphKey | null;
  readonly cm: number | null;
  readonly standard: boolean;
}

export interface Cell {
  readonly value: number | null;
  /** True when he actually laid this unit along this thing. Everything else is worked out. */
  readonly measured: boolean;
}

export interface Row {
  readonly thing: ThingKey;
  readonly label: string;
  readonly cm: number | null;
  /** '4 spoons' — how the row was last taken. */
  readonly measuredIn: string;
  readonly cells: readonly Cell[];
  /** The row he is tapping out right now. */
  readonly live: boolean;
}

export interface MeasureTable {
  readonly columns: readonly Column[];
  readonly rows: readonly Row[];
}

/** A measurement in progress: not kept yet, but already in the table. */
export interface Draft {
  readonly thing: ThingKey;
  readonly unitId: string;
  readonly lays: number;
}

/** The conventional units, kept to the right and given no special weight. */
export const STANDARD_COLUMNS: readonly Column[] = [
  { id: 'std-cm', head: 'cm', glyph: null, cm: 1, standard: true },
  { id: 'std-ft', head: 'ft', glyph: null, cm: CM_PER_FOOT, standard: true },
];

export function buildTable(
  units: readonly Unit[],
  readings: readonly Reading[],
  draft: Draft | null = null,
): MeasureTable {
  const ordered = unitsInOrder(units);
  const columns: readonly Column[] = [
    ...ordered.map((u) => ({
      id: u.id,
      head: unitSpec(u.glyph).many,
      glyph: u.glyph,
      cm: unitCm(u),
      standard: false,
    })),
    ...STANDARD_COLUMNS,
  ];

  const live: readonly Reading[] =
    draft && draft.lays > 0
      ? [{ id: DRAFT_ID, made: DRAFT_MADE, thing: draft.thing, unitId: draft.unitId, lays: draft.lays }]
      : [];
  const all = byMade([...readings, ...live]);

  const byId = new Map(ordered.map((u) => [u.id, u]));
  const order: ThingKey[] = [];
  for (const r of all) if (!order.includes(r.thing)) order.push(r.thing);

  const rows = order.map((thing) => {
    const mine = all.filter((r) => r.thing === thing);
    // The last reading taken with a unit that has a length is what fixes the row.
    let cm: number | null = null;
    for (const r of mine) {
      const length = lengthInCm(r.lays, byId.get(r.unitId));
      if (length !== null) cm = length;
    }
    const last = mine[mine.length - 1];
    const cells = columns.map((col) => {
      const direct = mine.filter((r) => r.unitId === col.id).pop();
      if (direct) return { value: round1(direct.lays), measured: true };
      return { value: express(cm, col.cm), measured: false };
    });
    return {
      thing,
      label: thingSpec(thing).label,
      cm,
      measuredIn: last ? countLabel(last.lays, byId.get(last.unitId)) : '',
      cells,
      live: last ? last.id === DRAFT_ID : false,
    };
  });

  return { columns, rows };
}

const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** The spoken state of the plate, for the drawing's label. */
export function tableSummary(table: MeasureTable): string {
  const mine = table.columns.filter((c) => !c.standard);
  if (!table.rows.length) {
    return 'The table of measures, still empty. Invent a unit, then lay it along something and count.';
  }
  const last = table.rows[table.rows.length - 1];
  const things = `${table.rows.length} ${table.rows.length === 1 ? 'thing' : 'things'}`;
  const units = `${mine.length} ${mine.length === 1 ? 'unit' : 'units'} of your own`;
  return `The table of measures: ${things} down the side, ${units} across the top. ${cap(last.label)} is ${last.measuredIn}.`;
}

/** The caption lines that go on the plate and on the printed sheet. */
export function plateLines(table: MeasureTable, units: readonly Unit[]): readonly string[] {
  const named = unitsInOrder(units).map((u) => unitLine(u));
  const counted = `${table.rows.length} ${table.rows.length === 1 ? 'thing' : 'things'} measured`;
  return named.length ? [counted, ...named] : [counted];
}

/* ------------------------------------------------------------- paper ruler */

export type TickKind = 'unit' | 'half' | 'part';

export interface RulerTick {
  /** Distance from the left-hand end, in centimetres. */
  readonly cm: number;
  /** The same distance counted in his unit: 0, 0.25, 0.5 … */
  readonly units: number;
  readonly kind: TickKind;
  /** Only whole units carry a number. */
  readonly label: string | null;
}

const DIVISIONS: readonly number[] = [1, 0.5, 0.25];
const MIN_INTERVALS = 4;
const MAX_TICKS = 200;

/**
 * Notches for a strip of paper `sheetCm` long, marked in a unit `unitCm` long.
 * The subdivision is chosen so the strip always carries at least a few
 * intervals: a Lego brick gets whole bricks, a stride gets quarters. Called
 * with `unitCm = 1` this is an ordinary centimetre ruler, which is exactly the
 * one he calibrates against.
 */
export function rulerTicks(unitCm: number, sheetCm: number = SHEET_CM): readonly RulerTick[] {
  if (!Number.isFinite(unitCm) || unitCm <= 0) return [];
  if (!Number.isFinite(sheetCm) || sheetCm <= 0) return [];
  const division =
    DIVISIONS.find((d) => Math.floor(sheetCm / (unitCm * d)) >= MIN_INTERVALS) ?? DIVISIONS[DIVISIONS.length - 1];
  const span = unitCm * division;
  const count = Math.min(MAX_TICKS, Math.max(1, Math.floor(sheetCm / span)));
  const ticks: RulerTick[] = [];
  for (let i = 0; i <= count; i += 1) {
    const units = i * division;
    const whole = Number.isInteger(units);
    const half = !whole && Number.isInteger(units * 2);
    ticks.push({
      cm: units * unitCm,
      units,
      kind: whole ? 'unit' : half ? 'half' : 'part',
      label: whole ? String(units) : null,
    });
  }
  return ticks;
}

/** How wide the printed strip is in CSS pixels, which is what makes it true-scale. */
export function rulerWidthPx(sheetCm: number = SHEET_CM): number {
  return Math.max(0, sheetCm) * CM_TO_PX;
}

export function rulerSummary(unit: Unit | null, sheetCm: number = SHEET_CM): string {
  if (!unit || !isCalibrated(unit)) {
    return `A centimetre ruler, ${sheetCm} centimetres long. Print it, then lay your unit along it and count the notches.`;
  }
  const spec = unitSpec(unit.glyph);
  const ticks = rulerTicks(unitCm(unit) ?? 1, sheetCm);
  const wholes = ticks.filter((t) => t.kind === 'unit').length - 1;
  return `A paper ruler marked in ${spec.many}, ${sheetCm} centimetres long, with ${wholes} whole ${
    wholes === 1 ? spec.one : spec.many
  } on it.`;
}

/* --------------------------------------------------------------------- date */

export function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
