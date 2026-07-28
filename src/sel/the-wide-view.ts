/**
 * The Wide View.
 *
 * A room holds more than one true story, and which one you get depends on
 * where you happened to be looking. In a room where fourteen things happen at
 * once you can hold about four; which four you take decides what you think
 * happened; and the budget is invisible to the spender. That is what a wide
 * shot is for, and it sits upstream of Borrowed Eyes rather than repeating it:
 * Borrowed Eyes is about viewpoint — what was visible from where she stood.
 * This is about sampling — what you took from where you already were.
 *
 * WHAT THIS FILE IS NOT ALLOWED TO DO
 * -----------------------------------
 * It holds no observation. Every person, box, pose and facing comes from
 * `the-wide-view.data.ts`, which is generated from the plates by
 * `scripts/derive-wide-view.mjs` and sealed against them. Everything here is a
 * function of those numbers: the sentence a person is read, where their crop is
 * cut, which of them are near the middle, and the one interpretive line at the
 * end. Nothing here can disagree with the picture, because nothing here knows
 * anything the picture did not supply.
 *
 * The previous version had a coverage counter — "You have looked at 5 of the 8
 * people here" — directly under a note saying "look at whoever you like, for as
 * long as you like", and a button reading "Mark: this one needs something".
 * Both are gone. The counter was a score in a disguise, and nobody in the room
 * needs anything: a child at the edge is at the edge, which is a fact about
 * geometry.
 */

import { placeOptions } from '../games/options';
import { ROOMS, SEAL, TOTAL_PEOPLE } from './the-wide-view.data';
import type { Facing, Person, Pose, Room } from './the-wide-view.data';

export { ROOMS, SEAL, TOTAL_PEOPLE };
export type { Facing, Person, Pose, Room };

export const THE_WIDE_VIEW_META = {
  id: 'the-wide-view',
  title: 'The Wide View',
  eyebrow: 'Look around',
  note: 'Look at one room for as long as you like. Then say who stayed with you.',
} as const;

/** The three beats, in order. There is no timer and nothing to find. */
export type Beat = 'glance' | 'recall' | 'return';

/**
 * The order the crops are dealt in.
 *
 * There is no answer here — every card is a person who was really in the room —
 * so the placement carries nothing to leak. It still goes through
 * `placeOptions` rather than reading in census order, because census order is
 * left-to-right and top-to-bottom, and a child who works along the strip would
 * be walked around the room in the order the plate is painted. The seed is the
 * room id alone, so the strip is the same on every reload.
 */
export function recallOrder(room: Room): Person[] {
  if (room.people.length < 2) return [...room.people];
  const [first, ...rest] = room.people;
  return placeOptions<Person>({
    gameId: `the-wide-view:${room.id}`,
    roundIndex: 0,
    answer: first,
    distractors: rest,
    count: room.people.length,
  });
}

/* ----------------------------------------------------------- the sentence -- */

/**
 * Every clause is a lookup on a closed enum. A generated sentence cannot say
 * anything the census did not record, which is the only reason it can be
 * trusted to describe the plate.
 */
const POSE_CLAUSE: Record<Pose, string> = {
  stand: 'is standing',
  'sit-floor': 'is sitting on the floor',
  'sit-seat': 'is sitting on a seat',
  kneel: 'is kneeling',
  crouch: 'is crouching down',
  climb: 'is climbing',
  lie: 'is lying back',
  // Not a hedge. The lower body is behind furniture, so standing and sitting
  // are both consistent with the picture, and the exercise says so.
  'part-hidden': 'is half out of sight',
};

const FACING_CLAUSE: Record<Facing, string> = {
  left: 'facing left',
  right: 'facing right',
  towards: 'facing this way',
  away: 'facing away',
};

export function centreOf(p: Person): readonly [number, number] {
  return [(p.box[0] + p.box[2]) / 2, (p.box[1] + p.box[3]) / 2];
}

export function areaOf(p: Person): number {
  return (p.box[2] - p.box[0]) * (p.box[3] - p.box[1]);
}

/** Front/back and left/middle/right, read straight off the box centre. */
export function placeClause(p: Person): string {
  const [cx, cy] = centreOf(p);
  const depth = cy < 0.5 ? 'at the back' : 'at the front';
  const side = cx < 1 / 3 ? 'on the left' : cx > 2 / 3 ? 'on the right' : 'in the middle';
  return `${depth} ${side}`;
}

/**
 * One person, in one sentence, assembled from `(adult, pose, box, facing)`.
 *
 * `who` is only ever "A grown-up" or "A child". The design note offered a third
 * bucket, "a small one", chosen partly from box area — but in these plates area
 * is a depth proxy, so that bucket would have called a distant nine-year-old a
 * baby. A pixel census cannot see age beyond adult and child, so it says
 * neither more nor less. No names, for the same reason.
 */
export function sentenceFor(p: Person): string {
  const who = p.adult ? 'A grown-up' : 'A child';
  return `${who} ${POSE_CLAUSE[p.pose]} ${placeClause(p)}, ${FACING_CLAUSE[p.facing]}.`;
}

/** One line per person, in census order. Used for both accounts in the return. */
export function accountOf(room: Room, ids: readonly string[]): string[] {
  return room.people.filter((p) => ids.includes(p.id)).map(sentenceFor);
}

/** The people he did not keep. Order preserved, so the two accounts line up. */
export function complementOf(room: Room, kept: readonly string[]): string[] {
  return room.people.filter((p) => !kept.includes(p.id)).map((p) => p.id);
}

/* --------------------------------------------------------------- the crop -- */

/**
 * Where to cut the person out of the plate.
 *
 * This is the structural move. The application does not draw a marker over the
 * painting any more; it cuts a rectangle out of it. Position stops being a
 * claim the interface makes and becomes a rectangle the pipeline cut, so a
 * wrong box renders as a visible picture of a bookshelf rather than as a
 * transparent dot sitting on one.
 *
 * The frame is the box itself — no padding — because a pad is a second number
 * that would soften exactly the error this is here to expose. The plate is
 * scaled so the crop fits inside `maxW` x `maxH` at its own aspect, and never
 * upscaled past `MAX_ZOOM`, so a thin figure stays a thin card instead of
 * becoming a wall of pixels.
 */
export interface CropFrame {
  readonly frameW: number;
  readonly frameH: number;
  readonly imgW: number;
  readonly imgH: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

const MAX_ZOOM = 3;

export function cropFrame(p: Person, room: Room, maxW: number, maxH: number): CropFrame {
  const cropW = (p.box[2] - p.box[0]) * room.plateWidth;
  const cropH = (p.box[3] - p.box[1]) * room.plateHeight;
  const zoom = Math.min(maxW / cropW, maxH / cropH, MAX_ZOOM);
  const imgW = Math.round(room.plateWidth * zoom);
  const imgH = Math.round(room.plateHeight * zoom);
  return {
    frameW: Math.round(cropW * zoom),
    frameH: Math.round(cropH * zoom),
    imgW,
    imgH,
    offsetX: -Math.round(p.box[0] * imgW),
    offsetY: -Math.round(p.box[1] * imgH),
  };
}

/** Where to draw a mark over the whole plate, in percentages. Derived from the box. */
export function markRect(p: Person): { left: string; top: string; width: string; height: string } {
  return {
    left: `${p.box[0] * 100}%`,
    top: `${p.box[1] * 100}%`,
    width: `${(p.box[2] - p.box[0]) * 100}%`,
    height: `${(p.box[3] - p.box[1]) * 100}%`,
  };
}

/* --------------------------------------------------- the shape of a sample -- */

/**
 * Four features, all computed from `box` (and the census's one boolean). Each
 * is normalised to [0,1] within its own room so the four are comparable.
 *
 *   region     how far the person is from the middle of the plate
 *   scale      how big they are, which in these plates is how near the front
 *   isolation  how far the nearest other person is
 *   adult      the census flag
 */
export type Feature = 'region' | 'scale' | 'isolation' | 'adult';
export const FEATURES: readonly Feature[] = ['region', 'scale', 'isolation', 'adult'];

const norm = (xs: readonly number[]): number[] => {
  const hi = Math.max(...xs);
  return hi > 0 ? xs.map((v) => v / hi) : xs.map(() => 0);
};

export function featureValues(room: Room, feature: Feature): number[] {
  const people = room.people;
  if (feature === 'adult') return people.map((p) => (p.adult ? 1 : 0));
  if (feature === 'scale') return norm(people.map(areaOf));
  const centres = people.map(centreOf);
  if (feature === 'region') return norm(centres.map(([x, y]) => Math.hypot(x - 0.5, y - 0.5)));
  return norm(
    centres.map(([x, y], i) => {
      let best = Infinity;
      centres.forEach(([ox, oy], j) => {
        if (i !== j) best = Math.min(best, Math.hypot(x - ox, y - oy));
      });
      return Number.isFinite(best) ? best : 0;
    }),
  );
}

export interface Shape {
  readonly feature: Feature | null;
  readonly line: string;
}

/**
 * How far a gap has to be from chance before this is allowed to speak, in
 * standard errors of the difference of means under a random split.
 *
 * Measured, not chosen. `src/test/the-wide-view.test.ts` sweeps 4000 random
 * keep-subsets across all six rooms and, separately, two deliberately shaped
 * samples per room — the four most central people, and every grown-up. 2.5 is
 * the highest threshold that still speaks about all twelve shaped samples, and
 * at it 96.9% of random samples are refused. Lower it and it starts narrating
 * noise; raise it to 2.6 and it goes quiet on a sample that really is centred.
 *
 * A function that must always produce a pattern will manufacture one — that is
 * the invented shoe, one level up — so the refusal is the load-bearing branch.
 */
export const MIN_Z = 2.5;

const mean = (xs: readonly number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

function sd(xs: readonly number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
}

const LINES: Record<Feature, readonly [string, string]> = {
  // [kept scored high, kept scored low]
  region: [
    'The ones you kept were round the edges of the room. The ones you did not keep were nearer the middle.',
    'The ones you kept were near the middle of the room. The ones you did not keep were further out.',
  ],
  scale: [
    'The ones you kept were the big ones near the front. The ones you did not keep were smaller and further back.',
    'The ones you kept were small and further back. The ones you did not keep were nearer the front.',
  ],
  isolation: [
    'The ones you kept had space around them. The ones you did not keep were in among other people.',
    'The ones you kept were in among other people. The ones you did not keep had space around them.',
  ],
  adult: [
    'The ones you kept were mostly grown-ups. The ones you did not keep were mostly children.',
    'The ones you kept were mostly children. The ones you did not keep were mostly grown-ups.',
  ],
};

export const NO_SHAPE = 'The ones you kept were all over the room. No pattern in that one.';

/**
 * One line about the shape of what he kept, or a refusal.
 *
 * Speaks about the single feature whose kept-versus-rest gap is furthest past
 * chance, and only if that gap clears `MIN_Z` standard errors. Otherwise it
 * returns `feature: null` and says so, which is the honest answer and the one
 * the tests care most about.
 */
export function shapeOf(room: Room, kept: readonly string[]): Shape {
  const k = room.people.filter((p) => kept.includes(p.id)).length;
  const n = room.people.length;
  if (k === 0 || k === n) return { feature: null, line: NO_SHAPE };

  let best: { feature: Feature; ratio: number; high: boolean } | null = null;
  for (const feature of FEATURES) {
    const values = featureValues(room, feature);
    const inKept: number[] = [];
    const inRest: number[] = [];
    room.people.forEach((p, i) => (kept.includes(p.id) ? inKept : inRest).push(values[i]));
    const spread = sd(values);
    if (spread === 0) continue;
    const gap = mean(inKept) - mean(inRest);
    const stderr = spread * Math.sqrt(1 / k + 1 / (n - k));
    const ratio = Math.abs(gap) / (MIN_Z * stderr);
    if (ratio > 1 && (!best || ratio > best.ratio)) best = { feature, ratio, high: gap > 0 };
  }
  if (!best) return { feature: null, line: NO_SHAPE };
  return { feature: best.feature, line: LINES[best.feature][best.high ? 0 : 1] };
}

/* --------------------------------------------------------------- the beats -- */

/** The return only opens on a real sample: not nobody, not everybody. */
export function canReturn(room: Room, kept: readonly string[]): boolean {
  const k = room.people.filter((p) => kept.includes(p.id)).length;
  return k > 0 && k < room.people.length;
}

/** Flat, and it does not rank the two accounts. */
export const CLOSING_LINE = 'Both of these happened. You saw the first one.';

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}

/**
 * What he kept, said without a total to compare it against. There is no "5 of
 * 13" anywhere: the count of people in the room is a fact about the picture,
 * not a target, and pairing the two numbers is what turned looking into a
 * score last time.
 */
export function keptLine(kept: readonly string[]): string {
  const n = kept.length;
  if (n === 0) return 'You have not kept anybody yet.';
  return `You kept ${n} ${n === 1 ? 'person' : 'people'}.`;
}
