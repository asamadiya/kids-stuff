/**
 * The Field Log: what he found outside, where, how many, and what it was doing.
 *
 * Sibling to the Quadrat, and deliberately its opposite. The Quadrat fixes one
 * square of ground and returns to it; the Log roams. What makes it worth coming
 * back to is not the list — it is the three things that only exist once there
 * is more than one visit:
 *
 *   1. A running tally. Every find ever made, counted across sessions.
 *   2. A subject followed. One tree, one pot of seeds, measured and staged on
 *      each visit, so growth per day and the move up the phenology ladder are
 *      arithmetic he can do rather than an impression he has.
 *   3. A stick in the ground. The shadow is shortest at local solar noon, and
 *      the sun's height above the horizon is the arctangent of the stick over
 *      the shadow. From that one angle and the date, the latitude falls out.
 *      Eratosthenes measured the Earth this way in about 240 BC with nothing
 *      else. It works in a back garden.
 *
 * Nothing here is asserted that can be computed. Local noon is found by taking
 * the smallest shadow in the readings, not by assuming it is the middle one;
 * the sun's altitude comes out of the two measured lengths; the latitude comes
 * out of the altitude and the day of the year. Every one of those has a test
 * fed with an independently-known astronomical fact.
 *
 * Pure module. No React, no DOM, no randomness.
 */
import type { Kept } from './drawer';
import { PALETTE, fingerprint, formatDate, isoDate, type GlyphSpec } from './quadrat';

export const FIELD_LOG_META = {
  id: 'field-log',
  title: 'The Field Log',
  eyebrow: 'Field work',
  note: 'Write down what you found outside, follow one thing week by week, and measure the sun with a stick.',
} as const;

export { PALETTE, formatDate, isoDate };

/* ------------------------------------------------------------------ where */

export type HabitatKey = 'ground' | 'tree' | 'wall' | 'water' | 'air' | 'litter';

export const HABITAT_KEYS: readonly HabitatKey[] = ['ground', 'tree', 'wall', 'water', 'air', 'litter'];

/** Line art on a 24x24 box, stroked not filled, as everywhere else in the guide. */
export const HABITATS: Readonly<Record<HabitatKey, GlyphSpec>> = {
  ground: { label: 'On the ground', paths: ['M2.4 17.6h19.2', 'M5.6 17.6c1.6-2.4 3.2-3.6 5.2-3.6s3.6 1.2 5.2 3.6'] },
  tree: { label: 'On a tree', paths: ['M12 22v-8.4', 'M6.8 9.6a5.2 5.2 0 1 1 10.4 0a5.2 5.2 0 1 1-10.4 0Z', 'M12 15.6l3.2-3.2M12 17.2l-2.8-2.8'] },
  wall: { label: 'On a wall', paths: ['M2.8 7.2h18.4M2.8 12h18.4M2.8 16.8h18.4', 'M8 7.2v4.8M16 7.2v4.8M12 12v4.8'] },
  water: { label: 'In water', paths: ['M2.8 9.6c2-2 4-2 6 0s4 2 6 0s4-2 6 0', 'M2.8 15.2c2-2 4-2 6 0s4 2 6 0s4-2 6 0'] },
  air: { label: 'In the air', paths: ['M3.2 8h9.6a2.6 2.6 0 1 0-2.6-2.6', 'M3.2 13.2h13a2.6 2.6 0 1 1-2.6 2.6', 'M3.2 18.4h7.2'] },
  litter: { label: 'Under a stone or a leaf', paths: ['M4 15.6c1.6-4.4 5.2-6.4 8.8-5.6s5.6 3.6 6.4 7.2Z', 'M4 18.4h16'] },
};

/* ------------------------------------------------------------------ doing */

export type DoingKey = 'still' | 'moving' | 'feeding' | 'carrying' | 'digging' | 'flying' | 'calling' | 'hiding';

export const DOING_KEYS: readonly DoingKey[] = [
  'still', 'moving', 'feeding', 'carrying', 'digging', 'flying', 'calling', 'hiding',
];

export const DOING: Readonly<Record<DoingKey, string>> = {
  still: 'Sitting still',
  moving: 'Walking or crawling',
  feeding: 'Feeding',
  carrying: 'Carrying something',
  digging: 'Digging',
  flying: 'Flying',
  calling: 'Calling or singing',
  hiding: 'Hiding',
};

/* ------------------------------------------------------- the phenology ladder */

export type Stage = 'bare' | 'bud' | 'leaf' | 'flower' | 'fruit' | 'seed';

/**
 * The rungs, in the order they are usually seen. Usually, not always: a plum
 * flowers before it leafs, so a move down the ladder is a real observation and
 * is reported as one rather than treated as a mistake.
 */
export const STAGES: readonly Stage[] = ['bare', 'bud', 'leaf', 'flower', 'fruit', 'seed'];

export const STAGE_LABEL: Readonly<Record<Stage, string>> = {
  bare: 'Bare',
  bud: 'In bud',
  leaf: 'In leaf',
  flower: 'In flower',
  fruit: 'In fruit',
  seed: 'In seed',
};

export const stageIndex = (stage: Stage): number => STAGES.indexOf(stage);

/** How many rungs from one stage to another. Negative is a move back down. */
export const stageMove = (from: Stage, to: Stage): number => stageIndex(to) - stageIndex(from);

/* ------------------------------------------------------------------ the book */

export interface ShadowReading {
  /** Minutes after midnight on the local clock. */
  readonly minutes: number;
  /** The shadow's length in millimetres. */
  readonly shadowMm: number;
}

export type LogKind = 'find' | 'watch' | 'shadow';

/**
 * One entry. A single shape with a `kind` rather than a union, because the
 * drawer stores a flat list and a union of shapes cannot survive `Omit`.
 */
export interface FieldRecord extends Kept {
  readonly kind: LogKind;
  /** Local day. His day, not UTC's. */
  readonly date: string;
  /** What he found, in his own words. '' on the other two kinds. */
  readonly what: string;
  readonly habitat: HabitatKey | null;
  readonly count: number;
  readonly doing: DoingKey | null;
  /** The name of the thing he keeps returning to. '' when this is not a watch. */
  readonly subject: string;
  readonly stage: Stage | null;
  /** Measured height in millimetres. 0 when nothing was measured. */
  readonly heightMm: number;
  /** The gnomon's height in millimetres. 0 on the other two kinds. */
  readonly stickMm: number;
  readonly readings: readonly ShadowReading[];
}

const BLANK = {
  what: '',
  habitat: null,
  count: 0,
  doing: null,
  subject: '',
  stage: null,
  heightMm: 0,
  stickMm: 0,
  readings: [] as readonly ShadowReading[],
};

export function composeFind(input: {
  date: string;
  what: string;
  habitat: HabitatKey;
  count: number;
  doing: DoingKey | null;
}): Omit<FieldRecord, 'id' | 'made'> {
  return {
    ...BLANK,
    kind: 'find',
    date: input.date,
    what: input.what.trim(),
    habitat: input.habitat,
    count: Math.max(1, Math.round(input.count)),
    doing: input.doing,
  };
}

export function composeWatch(input: {
  date: string;
  subject: string;
  stage: Stage;
  heightMm: number;
}): Omit<FieldRecord, 'id' | 'made'> {
  return {
    ...BLANK,
    kind: 'watch',
    date: input.date,
    subject: input.subject.trim(),
    stage: input.stage,
    heightMm: Math.max(0, Math.round(input.heightMm)),
  };
}

export function composeShadow(input: {
  date: string;
  stickMm: number;
  readings: readonly ShadowReading[];
}): Omit<FieldRecord, 'id' | 'made'> {
  return {
    ...BLANK,
    kind: 'shadow',
    date: input.date,
    stickMm: Math.max(1, Math.round(input.stickMm)),
    readings: input.readings
      .filter((r) => Number.isFinite(r.minutes) && Number.isFinite(r.shadowMm) && r.shadowMm >= 0)
      .slice()
      .sort((a, b) => a.minutes - b.minutes),
  };
}

export const isFind = (r: FieldRecord): boolean => r.kind === 'find';
export const isWatch = (r: FieldRecord): boolean => r.kind === 'watch';
export const isShadow = (r: FieldRecord): boolean => r.kind === 'shadow';

const byDate = (a: FieldRecord, b: FieldRecord): number =>
  a.date < b.date ? -1 : a.date > b.date ? 1 : a.made < b.made ? -1 : a.made > b.made ? 1 : 0;

export const inOrder = (records: readonly FieldRecord[], kind: LogKind): readonly FieldRecord[] =>
  records.filter((r) => r.kind === kind).slice().sort(byDate);

/** Every day he went out, once each, oldest first. */
export function visitDates(records: readonly FieldRecord[]): readonly string[] {
  return [...new Set(records.map((r) => r.date))].sort();
}

/** The names he has used before, so coming back is one tap rather than typing. */
export function namesSeen(records: readonly FieldRecord[]): readonly string[] {
  return [...new Set(inOrder(records, 'find').map((r) => r.what).filter((w) => w))].sort();
}

export function subjectsWatched(records: readonly FieldRecord[]): readonly string[] {
  return [...new Set(inOrder(records, 'watch').map((r) => r.subject).filter((s) => s))].sort();
}

/* ----------------------------------------------------------- the running tally */

export interface TallyRow {
  readonly what: string;
  /** How many separate times it was written down. */
  readonly times: number;
  /** Every one ever counted, added up across every visit. */
  readonly total: number;
  readonly first: string;
  readonly last: string;
  readonly habitats: readonly HabitatKey[];
  /** The most he saw at once. */
  readonly most: number;
}

/** The whole book added up. This is the thing that only grows by going back out. */
export function tally(records: readonly FieldRecord[]): readonly TallyRow[] {
  const rows = new Map<string, TallyRow>();
  for (const r of inOrder(records, 'find')) {
    if (!r.what) continue;
    const held = rows.get(r.what);
    const habitats = held ? [...held.habitats] : [];
    if (r.habitat && !habitats.includes(r.habitat)) habitats.push(r.habitat);
    rows.set(r.what, {
      what: r.what,
      times: (held?.times ?? 0) + 1,
      total: (held?.total ?? 0) + r.count,
      first: held ? held.first : r.date,
      last: r.date,
      habitats,
      most: Math.max(held?.most ?? 0, r.count),
    });
  }
  return [...rows.values()].sort(
    (a, b) => b.total - a.total || (a.what < b.what ? -1 : a.what > b.what ? 1 : 0),
  );
}

/* ------------------------------------------------------- one thing over weeks */

export const MS_PER_DAY = 86_400_000;

export function dayNumber(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return Number.NaN;
  return Math.round(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

export function daysBetween(from: string, to: string): number {
  const a = dayNumber(from);
  const b = dayNumber(to);
  return Number.isNaN(a) || Number.isNaN(b) ? 0 : b - a;
}

export interface StageMove {
  readonly from: Stage;
  readonly to: Stage;
  readonly date: string;
  readonly rungs: number;
  readonly days: number;
}

export interface WatchSeries {
  readonly subject: string;
  readonly points: readonly { readonly date: string; readonly stage: Stage; readonly heightMm: number }[];
  readonly days: number;
  readonly grewMm: number;
  /** Growth per day, worked out from the two measurements and the two dates. */
  readonly mmPerDay: number;
  readonly moves: readonly StageMove[];
}

export function watchSeries(records: readonly FieldRecord[], subject: string): WatchSeries {
  const points = inOrder(records, 'watch')
    .filter((r) => r.subject === subject && r.stage !== null)
    .map((r) => ({ date: r.date, stage: r.stage as Stage, heightMm: r.heightMm }));
  const moves: StageMove[] = [];
  for (let i = 1; i < points.length; i += 1) {
    const rungs = stageMove(points[i - 1].stage, points[i].stage);
    if (rungs !== 0) {
      moves.push({
        from: points[i - 1].stage,
        to: points[i].stage,
        date: points[i].date,
        rungs,
        days: daysBetween(points[i - 1].date, points[i].date),
      });
    }
  }
  const days = points.length > 1 ? daysBetween(points[0].date, points[points.length - 1].date) : 0;
  const grewMm = points.length > 1 ? points[points.length - 1].heightMm - points[0].heightMm : 0;
  return {
    subject,
    points,
    days,
    grewMm,
    mmPerDay: days > 0 ? Math.round((grewMm / days) * 100) / 100 : 0,
    moves,
  };
}

/* --------------------------------------------------- a stick and its shadow */

const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

/** Day of the year, 1 on 1 January. */
export function dayOfYear(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return Number.NaN;
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 1)) / MS_PER_DAY) + 1;
}

/**
 * How far the sun is above the horizon, from two measured lengths and nothing
 * else. The stick, its shadow and the sunbeam make a right-angled triangle, so
 * the angle is the arctangent of the stick over the shadow. A stick whose
 * shadow is exactly its own length is standing under a sun 45 degrees up.
 */
export function sunAltitudeDeg(stickMm: number, shadowMm: number): number {
  if (!(stickMm > 0)) return 0;
  if (shadowMm <= 0) return 90;
  return Math.atan2(stickMm, shadowMm) * DEG;
}

/** Shadow over stick. He can work this one out on paper and check the angle. */
export function shadowRatio(stickMm: number, shadowMm: number): number {
  return stickMm > 0 ? Math.round((shadowMm / stickMm) * 100) / 100 : 0;
}

/**
 * Local solar noon is whenever the shadow is shortest — which is found by
 * looking, not by assuming it is the middle reading or that it lands on twelve
 * o'clock. It usually does not: clock noon and sun noon differ by the width of
 * the time zone, by daylight saving, and by the equation of time.
 */
export function shortestShadow(readings: readonly ShadowReading[]): ShadowReading | null {
  let shortest: ShadowReading | null = null;
  for (const r of readings) {
    const shorter = !shortest
      || r.shadowMm < shortest.shadowMm
      || (r.shadowMm === shortest.shadowMm && r.minutes < shortest.minutes);
    if (shorter) shortest = r;
  }
  return shortest;
}

/**
 * The sun's declination: how far north or south of the equator it stands over,
 * on a given day. Runs from about +23.44 degrees at the June solstice to about
 * -23.44 at the December one, and passes zero at the two equinoxes. This is the
 * standard approximation and is good to a fifth of a degree.
 */
export function declinationDeg(iso: string): number {
  const n = dayOfYear(iso);
  if (Number.isNaN(n)) return 0;
  const a = 0.98565 * (n + 10);
  const b = 0.98565 * (n - 2);
  const inner = (a + 1.914 * Math.sin(b * RAD)) * RAD;
  return Math.asin(Math.sin(-23.44 * RAD) * Math.cos(inner)) * DEG;
}

/**
 * Where on the Earth the stick is standing. At local noon the sun's height is
 * 90 degrees less the distance from your latitude to the latitude it is
 * standing over, so the latitude falls straight out of the one angle and the
 * date. North of the tropics, which is where this is being used.
 */
export function latitudeFromNoon(noonAltitudeDeg: number, iso: string): number {
  return 90 - noonAltitudeDeg + declinationDeg(iso);
}

/** Which way the noon shadow points: away from the sun. */
export function noonShadowDirection(latitudeDeg: number, declination: number): 'north' | 'south' {
  return latitudeDeg >= declination ? 'north' : 'south';
}

export interface ShadowReadout {
  readonly stickMm: number;
  readonly readings: readonly ShadowReading[];
  readonly noon: ShadowReading | null;
  readonly noonAltitude: number;
  readonly declination: number;
  readonly latitude: number;
  readonly points: 'north' | 'south';
  /** Longest shadow of the day, for the contrast. */
  readonly longest: ShadowReading | null;
}

export function shadowReadout(record: FieldRecord): ShadowReadout {
  const noon = shortestShadow(record.readings);
  const longest = record.readings.reduce<ShadowReading | null>(
    (m, r) => (!m || r.shadowMm > m.shadowMm ? r : m),
    null,
  );
  const noonAltitude = noon ? sunAltitudeDeg(record.stickMm, noon.shadowMm) : 0;
  const declination = declinationDeg(record.date);
  const latitude = noon ? latitudeFromNoon(noonAltitude, record.date) : 0;
  return {
    stickMm: record.stickMm,
    readings: record.readings,
    noon,
    noonAltitude: Math.round(noonAltitude * 10) / 10,
    declination: Math.round(declination * 10) / 10,
    latitude: Math.round(latitude * 10) / 10,
    points: noonShadowDirection(latitude, declination),
    longest,
  };
}

/* -------------------------------------------------------- identity and words */

export function clockLabel(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
}

/** The entry's serial, derived from everything on it. Same entry, same serial. */
export function logSignature(record: Pick<FieldRecord, 'kind' | 'date' | 'what' | 'subject' | 'count' | 'stage' | 'heightMm' | 'stickMm' | 'readings'>): string {
  const shadows = record.readings.map((r) => `${r.minutes}:${r.shadowMm}`).join(',');
  const body = `${record.kind}|${record.date}|${record.what}|${record.subject}|${record.count}|${record.stage ?? '-'}|${record.heightMm}|${record.stickMm}|${shadows}`;
  return `F-${fingerprint(body).toUpperCase().slice(-5)}`;
}

const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

/**
 * The name of a find is his, typed by him, so nothing here knows its plural and
 * nothing here may guess one. Guessing is how "3 bunnys" and "one candie"
 * reached the rendered prompts elsewhere in this guide. The count goes after
 * the name, as it does in a real field notebook, and the word is left alone.
 */
export function findSummary(record: FieldRecord): string {
  const where = record.habitat ? HABITATS[record.habitat].label.toLowerCase() : 'somewhere outside';
  const doing = record.doing ? `, ${DOING[record.doing].toLowerCase()}` : '';
  const name = record.what || 'unnamed';
  return `${name}: ${record.count}, ${where}${doing}. ${formatDate(record.date)}.`;
}

export function tallySummary(records: readonly FieldRecord[]): string {
  const rows = tally(records);
  const days = visitDates(records).length;
  if (!rows.length) return 'Nothing written down yet.';
  const counted = rows.reduce((n, r) => n + r.total, 0);
  const top = rows[0];
  return (
    `${plural(days, 'day out', 'days out')}, ${plural(rows.length, 'kind', 'kinds')}, ` +
    `${plural(counted, 'thing counted', 'things counted')} in all. ` +
    `Most of any one kind: ${top.what}, ${top.total} across ${plural(top.times, 'entry', 'entries')}.`
  );
}

export function watchSummary(series: WatchSeries): string {
  if (!series.points.length) return 'Nothing followed yet.';
  const last = series.points[series.points.length - 1];
  if (series.points.length === 1) {
    return `${series.subject}: ${STAGE_LABEL[last.stage].toLowerCase()}, ${last.heightMm} mm, on ${formatDate(last.date)}. Come back and measure it again.`;
  }
  const move = series.moves.length ? series.moves[series.moves.length - 1] : null;
  const moved = move
    ? ` It went from ${STAGE_LABEL[move.from].toLowerCase()} to ${STAGE_LABEL[move.to].toLowerCase()} in ${plural(move.days, 'day', 'days')}.`
    : ' It has not changed rung yet.';
  const grew = series.days > 0
    ? `${series.grewMm} mm in ${plural(series.days, 'day', 'days')}, which is ${series.mmPerDay} mm a day.`
    : `${series.grewMm} mm so far.`;
  return `${series.subject}: ${grew}${moved}`;
}

export function shadowSummary(record: FieldRecord): string {
  const read = shadowReadout(record);
  if (!read.noon) return 'A stick and no readings yet. Measure the shadow every hour.';
  const contrast = read.longest && read.longest !== read.noon
    ? ` The longest was ${read.longest.shadowMm} mm at ${clockLabel(read.longest.minutes)}, ${Math.round((read.longest.shadowMm / Math.max(1, read.noon.shadowMm)) * 10) / 10} times as long.`
    : '';
  return (
    `Stick ${record.stickMm} mm. Shortest shadow ${read.noon.shadowMm} mm at ${clockLabel(read.noon.minutes)}, ` +
    `so that was local noon and the sun was ${read.noonAltitude} degrees up. ` +
    `On ${formatDate(record.date)} the sun stands over ${read.declination} degrees, ` +
    `so the stick puts you at about ${Math.abs(Math.round(read.latitude))} degrees ${read.latitude < 0 ? 'south' : 'north'}. ` +
    `At noon the shadow pointed ${read.points}.${contrast}`
  );
}

export function logSummary(records: readonly FieldRecord[]): string {
  const days = visitDates(records);
  if (!days.length) return 'The log is empty. Go outside and write down the first thing you see.';
  return `${plural(days.length, 'day out', 'days out')}, ${formatDate(days[0])} to ${formatDate(days[days.length - 1])}. ${plural(records.length, 'entry', 'entries')}.`;
}

/* --------------------------------------------------------------- the benches */

export type LogPhase = 'find' | 'watch' | 'shadow';

export const PHASES: readonly { readonly key: LogPhase; readonly title: string; readonly note: string }[] = [
  { key: 'find', title: 'What I found', note: 'The thing, where it was, how many, and what it was doing.' },
  { key: 'watch', title: 'One thing, week by week', note: 'The same tree or the same pot of seeds, measured every time you pass it.' },
  { key: 'shadow', title: 'A stick and its shadow', note: 'Push a stick into the ground and mark the end of its shadow every hour.' },
];

/**
 * Things that are actually findable in a Bay Area garden, offered as one tap
 * because he reads a little but not fluently. He can still type any name he
 * likes; this list only saves him the typing for the common ones.
 */
export const COMMON_FINDS: readonly string[] = [
  'ant', 'spider', 'snail', 'slug', 'roly-poly', 'earthworm', 'bee', 'ladybird',
  'moth', 'butterfly', 'beetle', 'crow', 'hummingbird', 'squirrel', 'lizard',
  'acorn', 'pine cone', 'feather', 'oak leaf', 'moss', 'lichen', 'dandelion',
];

export const SHADOW_METHOD: readonly string[] = [
  'Push a straight stick upright into flat ground and measure how much of it is above the soil.',
  'Every hour, mark where the tip of the shadow falls and measure from the stick to the mark.',
  'The shortest shadow of the day is local noon. The clock will not agree with it, and the clock is the one that is wrong.',
  'At that moment the shadow lies along the north-south line, so you have found true north without a compass.',
  'Stick over shadow gives the angle of the sun. That angle and the date give your latitude.',
];
