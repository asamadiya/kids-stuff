/**
 * Body Check: the instrument he opens when something is already loud.
 *
 * Nothing here can be answered wrongly, because everything here is a reading
 * off his own body. He marks where the feeling sits, notes what is true around
 * him, runs one remedy that has to be genuinely executed — a breath disc that
 * only advances while his finger is down, or a wait band that only fills in
 * real time — and then takes the reading again. Two figures, side by side.
 *
 * The remedy is allowed to fail, and the guide says so plainly. There is no
 * score, no praise and no correct set of marks; every readout is a count.
 *
 * Pure module. No React, no DOM, no randomness, no clock of its own.
 */
import type { Kept } from '../workshop/drawer';

export const BODYCHECK_META = {
  id: 'body-check',
  title: 'Body Check',
  eyebrow: 'Instrument reading',
  note: 'Mark where the feeling sits in your body, run one thing, then read your body again.',
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

/* ------------------------------------------------------- the figure and its places */

/** A point on the plate, in percent of its width and of its height. */
export interface Spot {
  readonly x: number;
  readonly y: number;
}

export type RegionId = 'head' | 'throat' | 'chest' | 'tummy' | 'hands' | 'legs';

export interface Region {
  readonly id: RegionId;
  /** What the place is called, for the tap target. */
  readonly place: string;
  /** What is happening there, stated flatly. */
  readonly signal: string;
  /** The small painted inset, at games/sel/<inset>.png */
  readonly inset: string;
  readonly alt: string;
  readonly spot: Spot;
  /** True where the place comes in pairs, so a second mark is drawn mirrored. */
  readonly mirror: boolean;
}

export const REGIONS: readonly Region[] = [
  {
    id: 'head',
    place: 'Head',
    signal: 'Hot in the face',
    inset: 'body-check-signal-face',
    alt: 'A close view of a child’s cheeks and ears flushed warm.',
    spot: { x: 50, y: 12 },
    mirror: false,
  },
  {
    id: 'throat',
    place: 'Throat',
    signal: 'Tight in the throat',
    inset: 'body-check-signal-throat',
    alt: 'A close view of a child’s throat, chin drawn down, swallowing.',
    spot: { x: 50, y: 21 },
    mirror: false,
  },
  {
    id: 'chest',
    place: 'Chest',
    signal: 'Fast in the chest',
    inset: 'body-check-signal-chest',
    alt: 'A close view of a child’s chest with a hand laid flat over the heart.',
    spot: { x: 50, y: 35 },
    mirror: false,
  },
  {
    id: 'tummy',
    place: 'Tummy',
    signal: 'Tight in the tummy',
    inset: 'body-check-signal-tummy',
    alt: 'A close view of a child’s middle with both hands pressed against it.',
    spot: { x: 50, y: 50 },
    mirror: false,
  },
  {
    id: 'hands',
    place: 'Hands',
    signal: 'Buzzing in the hands',
    inset: 'body-check-signal-hands',
    alt: 'A close view of two small hands, fingers half curled and spread apart.',
    spot: { x: 20, y: 62 },
    mirror: true,
  },
  {
    id: 'legs',
    place: 'Legs',
    signal: 'Heavy in the legs',
    inset: 'body-check-signal-legs',
    alt: 'A close view of a child’s legs and feet planted flat and still on floorboards.',
    spot: { x: 40, y: 84 },
    mirror: true,
  },
];

/** The painted plate the marks are placed on, at games/sel/<FIGURE_PLATE>.png */
export const FIGURE_PLATE = 'body-check-figure';
export const FIGURE_PLATE_ALT =
  'A field-guide plate of a child standing straight, seen from the front, arms at the sides and the face left blank.';

/**
 * The same figure as ink strokes, for the plate he can save. Drawn in a box
 * 100 wide and 125 tall, which is the aspect of the painted plate, so one set
 * of spots serves both.
 */
export const FIGURE_STROKES: readonly string[] = [
  'M59 14a9 9 0 1 1-18 0a9 9 0 1 1 18 0',
  'M50 23v6',
  'M32 32h36',
  'M34 32L36 72',
  'M66 32L64 72',
  'M36 72h28',
  'M32 33L22 60L20 74',
  'M68 33L78 60L80 74',
  'M23 78a3 3 0 1 1-6 0a3 3 0 1 1 6 0',
  'M83 78a3 3 0 1 1-6 0a3 3 0 1 1 6 0',
  'M42 72L40 104L39 118',
  'M58 72L60 104L61 118',
  'M34 120h11',
  'M56 120h11',
];

export const FIGURE_BOX = { width: 100, height: 125 } as const;

/* --------------------------------------------------------------- the checks */

export type CheckId = 'food' | 'sleep' | 'noise' | 'movement' | 'person';

export interface Check {
  readonly id: CheckId;
  /** The tap target's name. */
  readonly label: string;
  /** How it is said back in the reading. */
  readonly word: string;
  /** Hairline glyph paths, drawn in a 24 by 24 box. */
  readonly glyph: readonly string[];
}

export const CHECKS: readonly Check[] = [
  {
    id: 'food',
    label: 'You have not eaten in a while',
    word: 'hungry',
    glyph: ['M3 12h18a9 9 0 0 1-18 0z', 'M9 8c0-2 2-2 2-4', 'M15 8c0-2 2-2 2-4'],
  },
  {
    id: 'sleep',
    label: 'You went to bed late',
    word: 'tired',
    glyph: ['M18 14A8 8 0 0 1 10 6a8 8 0 1 0 8 8z'],
  },
  {
    id: 'noise',
    label: 'It is loud in here',
    word: 'too loud',
    glyph: ['M5 10v4', 'M9 6v12', 'M13 8v8', 'M17 4v16', 'M21 9v6'],
  },
  {
    id: 'movement',
    label: 'You have been sitting still a long time',
    word: 'still for too long',
    glyph: ['M5 12a7 7 0 1 1 3 5.9', 'M5 7v5h5'],
  },
  {
    id: 'person',
    label: 'Someone is standing too close',
    word: 'someone is too close',
    glyph: ['M12 4a3 3 0 1 1 0 6a3 3 0 1 1 0-6', 'M4 20c0-4 3.6-6 8-6s8 2 8 6'],
  },
];

/* --------------------------------------------------------------- the remedy */

export const BREATH_IN_MS = 4000;
export const BREATH_OUT_MS = 6000;
export const BREATH_CYCLE_MS = BREATH_IN_MS + BREATH_OUT_MS;

export interface BreathAt {
  readonly phase: 'in' | 'out';
  /** How far through the current half, from 0 to 1. */
  readonly through: number;
  /** How open the disc is, from 0 shut to 1 wide. */
  readonly open: number;
  /** Whole breaths finished so far. */
  readonly whole: number;
}

/**
 * Where the disc stands after `heldMs` of finger-down time. Held time is the
 * only input: let go and it stops, press again and it carries on from there.
 */
export function breathAt(heldMs: number): BreathAt {
  const t = Number.isFinite(heldMs) ? Math.max(0, heldMs) : 0;
  const whole = Math.floor(t / BREATH_CYCLE_MS);
  const within = t - whole * BREATH_CYCLE_MS;
  const drawingIn = within < BREATH_IN_MS;
  const through = drawingIn ? within / BREATH_IN_MS : (within - BREATH_IN_MS) / BREATH_OUT_MS;
  const eased = (1 - Math.cos(Math.PI * through)) / 2;
  return { phase: drawingIn ? 'in' : 'out', through, open: drawingIn ? eased : 1 - eased, whole };
}

export const WAIT_LENGTHS: readonly number[] = [30, 60, 90];

export type WaitThingId = 'lie' | 'water' | 'hold' | 'window' | 'near';

export interface WaitThing {
  readonly id: WaitThingId;
  readonly label: string;
  /** How it is said back afterwards: "You waited 60 seconds, lying down." */
  readonly doing: string;
  readonly glyph: readonly string[];
}

export const WAIT_THINGS: readonly WaitThing[] = [
  {
    id: 'lie',
    label: 'Lie down',
    doing: 'lying down',
    glyph: ['M2 18h20', 'M7 13a2 2 0 1 1 0 4a2 2 0 1 1 0-4', 'M10 18c0-3 3-4 6-4h4'],
  },
  {
    id: 'water',
    label: 'Drink water',
    doing: 'drinking water',
    glyph: ['M6 6h12l-1.6 13H7.6z', 'M6.9 11h10.2'],
  },
  {
    id: 'hold',
    label: 'Hold something soft',
    doing: 'holding something soft',
    glyph: ['M12 5a4 4 0 1 1 0 8a4 4 0 1 1 0-8', 'M4 15c2.5 4 13.5 4 16 0'],
  },
  {
    id: 'window',
    label: 'Look out of the window',
    doing: 'looking out of the window',
    glyph: ['M5 4h14v16H5z', 'M12 4v16', 'M5 12h14'],
  },
  {
    id: 'near',
    label: 'Sit near someone',
    doing: 'sitting near someone',
    glyph: [
      'M8 7a2 2 0 1 1 0 4a2 2 0 1 1 0-4',
      'M16 7a2 2 0 1 1 0 4a2 2 0 1 1 0-4',
      'M3 20c0-3 2.2-5 5-5s5 2 5 5',
      'M11 20c0-3 2.2-5 5-5s5 2 5 5',
    ],
  },
];

export type RemedyRun =
  | { readonly kind: 'breath'; readonly whole: number; readonly heldMs: number }
  | {
      readonly kind: 'wait';
      readonly seconds: number;
      readonly thing: WaitThingId;
      readonly elapsed: number;
      readonly finished: boolean;
    }
  | { readonly kind: 'none' };

/** How full the wait band is, from 0 to 1. Real time only; never hurried. */
export function waitFraction(elapsedMs: number, seconds: number): number {
  if (!Number.isFinite(elapsedMs) || !Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(1, Math.max(0, elapsedMs / (seconds * 1000)));
}

export const wholeSeconds = (ms: number): number => (Number.isFinite(ms) ? Math.max(0, Math.floor(ms / 1000)) : 0);

/* ---------------------------------------------------------------- the record */

export interface BodyCheckRecord extends Kept {
  readonly before: readonly RegionId[];
  readonly after: readonly RegionId[];
  readonly checks: readonly CheckId[];
  readonly remedy: RemedyRun;
}

/* ------------------------------------------------------------------ lookups */

export const regionById = (id: RegionId): Region =>
  REGIONS.find((r) => r.id === id) ?? REGIONS[0];
export const checkById = (id: CheckId): Check => CHECKS.find((c) => c.id === id) ?? CHECKS[0];
export const waitThingById = (id: WaitThingId): WaitThing =>
  WAIT_THINGS.find((w) => w.id === id) ?? WAIT_THINGS[0];

/** Marks, always in the order of the figure from the head down. */
export function inFigureOrder(ids: readonly RegionId[]): RegionId[] {
  const seen = new Set(ids);
  return REGIONS.filter((r) => seen.has(r.id)).map((r) => r.id);
}

export function toggleRegion(ids: readonly RegionId[], id: RegionId): RegionId[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : inFigureOrder([...ids, id]);
}

export function toggleCheck(ids: readonly CheckId[], id: CheckId): CheckId[] {
  if (ids.includes(id)) return ids.filter((x) => x !== id);
  const seen = new Set([...ids, id]);
  return CHECKS.filter((c) => seen.has(c.id)).map((c) => c.id);
}

/* -------------------------------------------------------------- the wording */

const COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six'] as const;

export function countWord(n: number): string {
  return COUNT_WORDS[n] ?? String(n);
}

/** "no marks", "one mark", "three marks". */
export function markPhrase(n: number): string {
  return `${countWord(n)} ${n === 1 ? 'mark' : 'marks'}`;
}

const lowerFirst = (s: string): string => (s ? s[0].toLowerCase() + s.slice(1) : s);
const upperFirst = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** "hot in the face, tight in the tummy" */
export function signalList(ids: readonly RegionId[]): string {
  return inFigureOrder(ids).map((id) => lowerFirst(regionById(id).signal)).join(', ');
}

export function describeMarks(ids: readonly RegionId[]): string {
  if (ids.length === 0) return 'Nothing is loud in your body right now.';
  return `${upperFirst(signalList(ids))}.`;
}

export function describeChecks(ids: readonly CheckId[]): string {
  if (ids.length === 0) return 'You marked none of the five.';
  const words = CHECKS.filter((c) => ids.includes(c.id)).map((c) => c.word);
  const list =
    words.length === 1 ? words[0] : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
  return `You said ${list}.`;
}

/** The reading, as it stands before anything is run. */
export function readingLines(marks: readonly RegionId[], checks: readonly CheckId[]): string[] {
  return [describeMarks(marks), describeChecks(checks)];
}

export function remedyLine(run: RemedyRun): string {
  if (run.kind === 'none') return 'You did not run anything.';
  if (run.kind === 'breath') {
    return run.whole === 1
      ? 'You held the disc for one whole breath.'
      : `You held the disc for ${countWord(run.whole)} whole breaths.`;
  }
  const doing = waitThingById(run.thing).doing;
  return run.finished
    ? `You waited ${run.seconds} seconds, ${doing}.`
    : `You stopped the wait at ${wholeSeconds(run.elapsed)} seconds of ${run.seconds}, ${doing}.`;
}

const sameSet = (a: readonly RegionId[], b: readonly RegionId[]): boolean =>
  a.length === b.length && a.every((id) => b.includes(id));

/**
 * The two readings put next to each other. Counts only. When the second
 * reading matches the first, the guide says the remedy did not shift it
 * instead of insisting that it did.
 */
export function compareLines(before: readonly RegionId[], after: readonly RegionId[]): string[] {
  if (before.length === 0 && after.length === 0) return ['No marks before. No marks after.'];
  if (sameSet(before, after)) {
    return [`Still ${signalList(after)}.`, 'Some of them take longer than a breath.'];
  }
  const lines = [`Before: ${markPhrase(before.length)}. After: ${countWord(after.length)}.`];
  const stayed = inFigureOrder(after.filter((id) => before.includes(id)));
  const arrived = inFigureOrder(after.filter((id) => !before.includes(id)));
  if (stayed.length > 0) lines.push(`Still ${signalList(stayed)}.`);
  if (arrived.length > 0) lines.push(`New: ${signalList(arrived)}.`);
  return lines;
}

/** Everything the plate says, in order. */
export function plateLines(record: BodyCheckRecord): string[] {
  return [
    ...readingLines(record.before, record.checks),
    remedyLine(record.remedy),
    ...compareLines(record.before, record.after),
  ];
}

/* ----------------------------------------------------------------- coverage */

export interface Coverage {
  readonly times: number;
  readonly places: number;
  readonly total: number;
}

/** How much of himself he has walked over, across every reading he has kept. */
export function coverage(records: readonly BodyCheckRecord[]): Coverage {
  const seen = new Set<RegionId>();
  for (const r of records) {
    for (const id of r.before) seen.add(id);
    for (const id of r.after) seen.add(id);
  }
  return { times: records.length, places: seen.size, total: REGIONS.length };
}

export function coverageLine(c: Coverage): string {
  const times = c.times === 1 ? 'once' : `${c.times} times`;
  const opened = c.times === 0 ? 'You have not opened this yet' : `You have opened this ${times}`;
  // No denominator. "2 of the 6 places marked" turns noticing where something
  // sits in your body into a collection to complete, and there is no reason a
  // child should mark all six.
  if (c.places === 0) return opened;
  const part = c.places === 1 ? 'one place' : `${countWord(c.places)} places`;
  return `${opened}. You have named ${part}.`;
}

/* --------------------------------------------------------------------- date */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** "25 July 2026", read straight off the stamp so no timezone can move it. */
export function formatDay(made: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(made);
  if (!m) return '';
  const month = MONTHS[Number(m[2]) - 1] ?? '';
  return `${Number(m[3])} ${month} ${m[1]}`;
}
