/**
 * Body Check: the instrument he opens when something is already loud.
 *
 * Nothing here can be answered wrongly, because everything here is a reading
 * off his own body. He marks where the feeling sits, notes what is true around
 * him, runs one remedy that he has to actually do — slow breaths, one still
 * card per half-breath, or a slow count, one still dot per number said out
 * loud — and then takes the reading again. Two figures, side by side.
 *
 * Nothing on the screen moves by itself. Every change to the drawing is a tap
 * he made when the breath or the number was done; no clock decides anything.
 *
 * The remedy is allowed to fail, and the guide says so plainly. There is no
 * score, no praise and no correct set of marks; every readout is a count.
 *
 * Pure module. No React, no DOM, no randomness, no clock.
 */
import type { Kept } from '../lib/drawer';

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

export type BreathPhase = 'in' | 'out';

export interface BreathCard {
  readonly phase: BreathPhase;
  /** The card's heading. */
  readonly title: string;
  /** How to do it. The grown-up's count sets the pace, so the screen never has to. */
  readonly how: string;
  /** The button he taps once the half-breath is done. */
  readonly done: string;
}

/** Four counts in, six out: the long out-breath is the half that slows him down. */
export const BREATH_CARDS: Readonly<Record<BreathPhase, BreathCard>> = {
  in: {
    phase: 'in',
    title: 'Breathe in',
    how: 'Slowly, through your nose, while your grown-up counts to four.',
    done: 'I breathed in',
  },
  out: {
    phase: 'out',
    title: 'Breathe out',
    how: 'Slowly, through your mouth, while your grown-up counts to six.',
    done: 'I breathed out',
  },
};

export interface BreathAt {
  /** Which card is showing. */
  readonly phase: BreathPhase;
  /** Whole breaths finished so far, in and then out. */
  readonly whole: number;
}

/**
 * Which card stands after `taps` deliberate taps: in, out, in, out. Taps are
 * the only input, so nothing can turn a card while he is still breathing.
 */
export function breathAt(taps: number): BreathAt {
  const t = Number.isFinite(taps) ? Math.max(0, Math.floor(taps)) : 0;
  return { phase: t % 2 === 0 ? 'in' : 'out', whole: Math.floor(t / 2) };
}

/** How far he can choose to count. Each number is one dot and one slow count. */
export const COUNT_LENGTHS: readonly number[] = [10, 20, 30];

/** Dots per row on the counting card: a full row is one ten. */
export const DOTS_PER_ROW = 10;

/** One more number counted, never past the end he chose. */
export function countOne(counted: number, to: number): number {
  const c = Number.isFinite(counted) ? Math.max(0, Math.floor(counted)) : 0;
  return Math.min(Math.max(0, to), c + 1);
}

export type WaitThingId = 'lie' | 'water' | 'hold' | 'window' | 'near';

export interface WaitThing {
  readonly id: WaitThingId;
  readonly label: string;
  /** How it is said back afterwards: "You counted to 20, lying down." */
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

/**
 * A wait timed by the clock, the way readings were kept before the counted
 * wait replaced the filling band. Still read, so a reading kept then says what
 * it said; never written.
 */
export interface TimedWait {
  readonly kind: 'wait';
  readonly seconds: number;
  readonly thing: WaitThingId;
  readonly elapsed: number;
  readonly finished: boolean;
}

export type RemedyRun =
  | { readonly kind: 'breath'; readonly whole: number }
  | {
      readonly kind: 'count';
      /** How far he chose to count. */
      readonly to: number;
      readonly thing: WaitThingId;
      /** How far he got. Stopping early is allowed and said back as it was. */
      readonly counted: number;
    }
  | TimedWait
  | { readonly kind: 'none' };

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
    if (run.whole === 0) return 'You did not finish a whole breath.';
    return run.whole === 1
      ? 'You took one slow breath, in and out.'
      : `You took ${countWord(run.whole)} slow breaths, in and out.`;
  }
  const doing = waitThingById(run.thing).doing;
  if (run.kind === 'count') {
    return run.counted >= run.to
      ? `You counted to ${run.to}, ${doing}.`
      : `You stopped at ${run.counted} of ${run.to}, ${doing}.`;
  }
  return run.finished
    ? `You waited ${run.seconds} seconds, ${doing}.`
    : `You stopped the wait at ${Math.max(0, Math.floor(run.elapsed / 1000))} seconds of ${run.seconds}, ${doing}.`;
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

/* ------------------------------------------------------------------- listen */

/** The question under the figure he marks: the first reading, then the second. */
export const FIGURE_ASK = {
  first: 'Where is it right now?',
  again: 'Where is it now?',
} as const;
export type FigureAsk = keyof typeof FIGURE_ASK;

/** The label over each tray, as shown. */
export const TRAY_LABEL = {
  places: 'Or tap the picture that matches. As many as are true.',
  checks: 'What is true right now? Any of them, or none.',
  remedy: 'Do one of these. Each card or dot changes only when you tap it.',
  countTo: 'Count to?',
  wait: 'What will you do while you count?',
} as const;

/** The two remedy buttons. */
export const REMEDY_NAME = { breath: 'Slow breaths', count: 'A slow count' } as const;

export const COUNT_CHOOSE = 'Choose what you will do while you count, below.';
export const COUNT_SAY = 'Say the next number out loud with your grown-up, slowly. Then tap.';

/** The line under the counting card: pick a thing to do, say the next number, or the count is done. */
export interface CountCue {
  readonly kind: 'choose' | 'say' | 'done';
  readonly line: string;
}

export function countCue(chosen: boolean, counted: number, to: number): CountCue {
  if (!chosen) return { kind: 'choose', line: COUNT_CHOOSE };
  if (counted >= to) return { kind: 'done', line: `You counted to ${to}.` };
  return { kind: 'say', line: COUNT_SAY };
}

/**
 * What each read-aloud button reads: the visible words beside it, one atom per
 * label or sentence, in screen order. Nothing is spoken unless the child
 * presses that button (advisor a9). The component reads only through these and
 * `listenLines` enumerates them, so no button can ask for a clip the build did
 * not make.
 */
export const LISTEN = {
  /** L1: the title and the note. */
  head: (): readonly string[] => [BODYCHECK_META.title, BODYCHECK_META.note],
  /** L2: the question under the figure he is marking. */
  ask: (which: FigureAsk): readonly string[] => [FIGURE_ASK[which]],
  /** L3: the picture tray, label then each signal under its picture. */
  places: (): readonly string[] => [TRAY_LABEL.places, ...REGIONS.map((r) => r.signal)],
  /** L4: the check tray. */
  checks: (): readonly string[] => [TRAY_LABEL.checks, ...CHECKS.map((c) => c.label)],
  /** L5: the remedy tray. */
  remedy: (): readonly string[] => [TRAY_LABEL.remedy, REMEDY_NAME.breath, REMEDY_NAME.count],
  /** L6: the breath card that is up. The breath count under it is a counter and is not read. */
  breath: (phase: BreathPhase): readonly string[] => [BREATH_CARDS[phase].title, BREATH_CARDS[phase].how],
  /** L7: the line under the counting card. */
  count: (cue: CountCue): readonly string[] => [cue.line],
  /** L8: the "Count to?" tray. */
  countTo: (): readonly string[] => [TRAY_LABEL.countTo, ...COUNT_LENGTHS.map(String)],
  /** L9: the tray of things to do while counting. */
  wait: (): readonly string[] => [TRAY_LABEL.wait, ...WAIT_THINGS.map((w) => w.label)],
  /** L10: the reading so far. */
  reading: (marks: readonly RegionId[], checks: readonly CheckId[]): readonly string[] =>
    readingLines(marks, checks),
} as const;

/** Every subset of `xs`, each in the order of `xs`. */
export function subsetsOf<T>(xs: readonly T[]): T[][] {
  return xs.reduce<T[][]>((all, x) => [...all, ...all.map((s) => [...s, x])], [[]]);
}

/** Every line a read-aloud button in this exercise can play, for the clip builder. */
export function listenLines(): string[] {
  const all = [
    ...LISTEN.head(),
    ...LISTEN.ask('first'),
    ...LISTEN.ask('again'),
    ...LISTEN.places(),
    ...LISTEN.checks(),
    ...LISTEN.remedy(),
    ...LISTEN.breath('in'),
    ...LISTEN.breath('out'),
    ...COUNT_LENGTHS.flatMap((to) => [
      ...LISTEN.count(countCue(false, 0, to)),
      ...LISTEN.count(countCue(true, 0, to)),
      ...LISTEN.count(countCue(true, to, to)),
    ]),
    ...LISTEN.countTo(),
    ...LISTEN.wait(),
    // The two halves of the reading vary independently, so each is enumerated on its own.
    ...subsetsOf(REGIONS.map((r) => r.id)).map((s) => LISTEN.reading(s, [])[0]),
    ...subsetsOf(CHECKS.map((c) => c.id)).map((s) => LISTEN.reading([], s)[1]),
  ];
  return [...new Set(all)];
}
