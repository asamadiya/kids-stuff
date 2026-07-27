/**
 * The Dividing String: a monochord, so a fraction can be heard.
 *
 * One string is stretched between two nails. A movable bridge divides it, and
 * the part between the nut and the bridge is what sounds. The whole tool rests
 * on one fact of the world: pitch is the reciprocal of length. Stop the string
 * at 1/2 and it shakes twice as fast; stop it at 2/3 and it shakes three times
 * for every two of the open string. The simple fractions are exactly the
 * places where the two notes share a common partial and stop beating.
 *
 * The generative rule is that the child chooses the divisions. Nothing here
 * snaps him onto a ratio — he must be able to stand between them and hear it
 * be wrong, because the wrongness is the evidence that the right places are
 * real and not decoration. What he pins becomes a peg rack, and the peg rack
 * IS a scale: a tuning no other child has, expressed as whole-number fractions
 * of one length, which is precisely the form a plank, two nails and a length
 * of line can be built from.
 *
 * Pure module. No React, no DOM, no audio, no randomness.
 */

export const DIVIDING_STRING_META = {
  id: 'dividing-string',
  title: 'The Dividing String',
  eyebrow: 'Compose',
  note: 'Slide the bridge along one string: at the simple fractions the two notes stop wobbling and lock together.',
} as const;

/* ---------------------------------------------------------------- fractions */

export interface Fraction {
  readonly num: number;
  readonly den: number;
}

/** Euclid. Returns 1 rather than 0 so it is always safe to divide by. */
export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

/** 4/8 and 1/2 are the same division of the same string, so only one is kept. */
export function reduce(num: number, den: number): Fraction {
  const n = Math.trunc(num);
  const d = Math.trunc(den);
  if (d === 0) return { num: 0, den: 1 };
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  return { num: (n * sign) / g, den: (d * sign) / g };
}

export const fractionValue = (f: Fraction): number => f.num / f.den;
export const fractionText = (f: Fraction): string => `${f.num}/${f.den}`;

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
] as const;

const PARTS = [
  '', 'whole', 'half', 'third', 'quarter', 'fifth', 'sixth',
  'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth',
] as const;

/** He cannot read the numerals yet, so every fraction can also be spoken. */
export function spokenFraction(f: Fraction): string {
  if (f.den === 1) return f.num === 1 ? 'the whole string' : `${ONES[f.num] ?? f.num} strings`;
  const part: string = PARTS[f.den] ?? `${f.den}th`;
  const n: string = ONES[f.num] ?? String(f.num);
  return f.num === 1 ? `one ${part}` : `${n} ${part}s`;
}

/* ------------------------------------------------------------- the geometry */

/**
 * The bridge cannot be pushed right up to the nut: there is always a piece of
 * string left to shake. A quarter is two octaves above the open string, which
 * is as high as a plank of this size will honestly go — and it keeps every
 * frequency finite at the boundary.
 */
export const MIN_LENGTH = 1 / 4;
export const MAX_LENGTH = 1;

/** How close is close enough to call it a simple ratio. About 1.5% of the string. */
export const STOP_TOLERANCE = 0.015;

/** A pinned division is committed to a fraction, so it must be a buildable one. */
export const MAX_DENOMINATOR = 12;

export const MAX_STUDS = 8;
export const MAX_PHRASE = 12;

/** One arrow-key press, and one press with shift held. */
export const FINE_STEP = 0.004;
export const COARSE_STEP = 0.02;

/** The open string. A low, calm note that survives being doubled twice. */
export const BASE_HZ = 196;

/** A plank this long makes most of the simple divisions land on whole millimetres. */
export const PLANK_MM = 600;

export function clampLength(position: number): number {
  if (!Number.isFinite(position)) return MAX_LENGTH;
  return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, position));
}

export const movePosition = (position: number, delta: number): number =>
  clampLength(clampLength(position) + delta);

/**
 * Pitch is the reciprocal of sounding length. Half the string, twice the
 * frequency. The length is clamped first, so neither end of the board can
 * divide by zero or hand back something infinite.
 */
export function frequencyAt(base: number, position: number): number {
  return base / clampLength(position);
}

/* ------------------------------------------------------- the simple divisions */

export interface RatioStop extends Fraction {
  /** Where the bridge stands, as a part of the whole string. */
  readonly position: number;
  /** How many times faster the stopped string shakes than the open one. */
  readonly ratio: number;
  readonly name: string;
}

const NAMED: readonly (readonly [number, number, string])[] = [
  [1, 4, 'two octaves'],
  [1, 3, 'an octave and a fifth'],
  [2, 5, 'an octave and a big third'],
  [1, 2, 'an octave'],
  [3, 5, 'a sixth'],
  [2, 3, 'a fifth'],
  [3, 4, 'a fourth'],
  [4, 5, 'a big third'],
  [5, 6, 'a small third'],
  [1, 1, 'the same note'],
];

/** The studs on the board, in order along the string from short to long. */
export const SIMPLE_RATIOS: readonly RatioStop[] = NAMED.map(([num, den, name]) => ({
  num,
  den,
  name,
  position: num / den,
  ratio: den / num,
}));

export function intervalName(f: Fraction): string | null {
  const hit = SIMPLE_RATIOS.find((s) => s.num === f.num && s.den === f.den);
  return hit ? hit.name : null;
}

/**
 * The simple ratio he is standing on, or nothing at all. Deliberately does not
 * move the bridge: being between two ratios is a legal, audible place to be.
 */
export function nearestRatio(position: number, tolerance = STOP_TOLERANCE): RatioStop | null {
  let found: RatioStop | null = null;
  let best = Number.POSITIVE_INFINITY;
  for (const stop of SIMPLE_RATIOS) {
    const gap = Math.abs(position - stop.position);
    if (gap <= tolerance && gap < best) {
      best = gap;
      found = stop;
    }
  }
  return found;
}

/** The simple ratio he is hunting, whether or not he has found it. */
export function closestRatio(position: number): RatioStop {
  return SIMPLE_RATIOS.reduce((a, b) =>
    Math.abs(position - b.position) < Math.abs(position - a.position) ? b : a);
}

/**
 * The plainest fraction that describes where the bridge actually stands. Small
 * denominators are preferred, so a near miss reads as "about 5/9" rather than
 * as a wall of digits.
 */
export function bestFraction(position: number, maxDen = MAX_DENOMINATOR): Fraction {
  const x = clampLength(position);
  let best: Fraction = { num: 1, den: 1 };
  let bestErr = Number.POSITIVE_INFINITY;
  for (let den = 1; den <= maxDen; den += 1) {
    const num = Math.min(den, Math.max(1, Math.round(x * den)));
    const err = Math.abs(x - num / den);
    if (err < bestErr - 1e-9) {
      bestErr = err;
      best = reduce(num, den);
    }
  }
  return best;
}

/**
 * The wobble, in wobbles a second. For a target division num/den the stopped
 * string's num-th partial and the open string's den-th partial should be the
 * same note; how far apart they really are is what the ear hears as beating.
 * Zero exactly on the ratio, and it grows as he wanders off it.
 */
export function beatsPerSecond(base: number, position: number, target: Fraction): number {
  return Math.abs(target.num * frequencyAt(base, position) - target.den * base);
}

/**
 * The two notes added together over a few turns of the open string. On a
 * simple ratio the shape closes and repeats; off it, it never comes round.
 * This is the wobble made visible, for a room with the sound turned off.
 */
export function combinedWave(ratio: number, samples = 220, cycles = 6): readonly number[] {
  const n = Math.max(2, Math.trunc(samples));
  const turns = Math.max(1, cycles);
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) {
    const t = (turns * i) / (n - 1);
    out.push((Math.sin(2 * Math.PI * t) + Math.sin(2 * Math.PI * ratio * t)) / 2);
  }
  return out;
}

/** How many turns of the open string before the combined shape comes round. */
export const repeatAfter = (f: Fraction): number => f.num;

/* ------------------------------------------------------------- the peg rack */

export interface Stud extends Fraction {
  readonly key: string;
  readonly position: number;
  readonly ratio: number;
  /** The interval's name, when the fraction happens to be one of the simple ones. */
  readonly name: string | null;
}

export const studKey = (f: Fraction): string => `${f.num}/${f.den}`;

/**
 * Pinning is the moment a wandering bridge becomes a number. Standing on a
 * simple ratio pins that ratio exactly; standing between them pins the
 * plainest fraction that describes the place, because a stud that cannot be
 * written as a fraction cannot be cut into a plank.
 */
export function makeStud(position: number, maxDen = MAX_DENOMINATOR): Stud {
  const exact = nearestRatio(position);
  const f: Fraction = exact ? { num: exact.num, den: exact.den } : bestFraction(position, maxDen);
  return {
    ...f,
    key: studKey(f),
    position: fractionValue(f),
    ratio: f.den / f.num,
    name: intervalName(f),
  };
}

/** Longest first, so the rack runs low to high the way a hand does. */
export function pinStud(studs: readonly Stud[], stud: Stud): readonly Stud[] {
  if (studs.length >= MAX_STUDS) return studs;
  if (studs.some((s) => s.key === stud.key)) return studs;
  return [...studs, stud].sort((a, b) => b.position - a.position);
}

export function unpinStud(studs: readonly Stud[], key: string): readonly Stud[] {
  return studs.filter((s) => s.key !== key);
}

/** Where to drive the nail, on a plank of the given length. */
export const plankMark = (stud: Fraction, plank = PLANK_MM): number =>
  Math.round(plank * fractionValue(stud));

/* --------------------------------------------------------------- the phrase */

export function addNote(phrase: readonly string[], key: string): readonly string[] {
  return phrase.length >= MAX_PHRASE ? phrase : [...phrase, key];
}

export function dropLastNote(phrase: readonly string[]): readonly string[] {
  return phrase.slice(0, phrase.length - 1);
}

/** Notes whose stud has been pulled off the rack are not playable, so they go. */
export function prunePhrase(phrase: readonly string[], studs: readonly Stud[]): readonly string[] {
  return phrase.filter((key) => studs.some((s) => s.key === key));
}

export function phraseStops(phrase: readonly string[], studs: readonly Stud[]): readonly Stud[] {
  return phrase
    .map((key) => studs.find((s) => s.key === key))
    .filter((s): s is Stud => s !== undefined);
}

/* ----------------------------------------------------------------- in words */

/** For a length of a/b, the stopped string shakes b times to the open string's a. */
export const shakeText = (f: Fraction): string =>
  `${f.den} shakes to the open string's ${f.num}`;

export function describeStud(stud: Stud): string {
  return `${fractionText(stud)} of the string, ${stud.name ?? 'between the simple places'}, ${shakeText(stud)}`;
}

/** The readout, and the words the tool speaks as the bridge settles. */
export function describePosition(position: number, base = BASE_HZ): string {
  const hz = Math.round(frequencyAt(base, position));
  const locked = nearestRatio(position);
  if (locked) {
    return (
      `The bridge stands at ${fractionText(locked)} of the string — ${spokenFraction(locked)}, ` +
      `${locked.name}, ${hz} shakes a second. The two notes lock and the wobble stops.`
    );
  }
  const about = bestFraction(position);
  const target = closestRatio(position);
  const beats = Math.round(beatsPerSecond(base, position, target));
  return (
    `The bridge stands at about ${fractionText(about)} of the string — ${spokenFraction(about)}, ` +
    `${hz} shakes a second. It is between the simple places, so the two notes wobble ` +
    `about ${beats} ${beats === 1 ? 'time' : 'times'} a second.`
  );
}

/** Short enough for a chip, so it can sit beside the bridge control. */
export function readingText(position: number): string {
  const locked = nearestRatio(position);
  if (locked) return `${fractionText(locked)} · ${locked.name}`;
  return `about ${fractionText(bestFraction(position))}`;
}

export function phraseInWords(phrase: readonly string[], studs: readonly Stud[]): string {
  const notes = phraseStops(phrase, studs);
  if (!notes.length) return 'No phrase written yet.';
  return `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}: ${notes.map(fractionText).join(' ')}`;
}

/* ------------------------------------------------------------------ the card */

export interface StringCard {
  readonly studs: readonly Stud[];
  readonly phrase: readonly string[];
  readonly base: number;
}

/**
 * What he keeps. Five lines, and a grown-up with a plank, two nails and a
 * length of fishing line has everything needed to build the instrument he
 * tuned: where each nail goes, what each stud is called, and what he played.
 */
export function cardLines(card: StringCard): readonly string[] {
  const { studs, phrase, base } = card;
  const notes = phraseStops(phrase, studs);
  const lines: string[] = [];

  lines.push(
    studs.length
      ? `${studs.length} ${studs.length === 1 ? 'stud' : 'studs'}: ${studs.map(fractionText).join('  ')}`
      : 'No studs pinned yet.',
  );
  if (studs.length) {
    lines.push(
      `On a ${PLANK_MM} mm plank, nails at ${studs.map((s) => `${plankMark(s)}`).join(', ')} mm from the nut`,
    );
    lines.push(`Named: ${studs.map((s) => s.name ?? fractionText(s)).join(', ')}`);
  }
  lines.push(notes.length ? `Phrase: ${notes.map(fractionText).join(' ')}` : 'No phrase written yet.');
  lines.push(`Open string ${Math.round(base)} shakes a second; every stud is a fraction of it.`);
  return lines;
}

/** One sentence for the plate and for anyone reading the drawing aloud. */
export function cardSummary(card: StringCard): string {
  const { studs, phrase } = card;
  if (!studs.length) return 'A bare string, not yet divided.';
  const notes = phraseStops(phrase, studs);
  const named = studs.filter((s) => s.name !== null).length;
  return (
    `A string divided ${studs.length} ${studs.length === 1 ? 'way' : 'ways'}, ` +
    `${named} of them at simple ratios` +
    (notes.length ? `, and a phrase of ${notes.length} ${notes.length === 1 ? 'note' : 'notes'}.` : '.')
  );
}
