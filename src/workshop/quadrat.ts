/**
 * The Quadrat: one square of ground, marked once and returned to.
 *
 * The generative rule here is unusual, and it is the point of the tool. What
 * varies is not the data but the SCHEMA: the child invents the categories, so
 * the columns of his log book are his own and no two children's books are even
 * comparable. What is fixed is the sheet format, the date, and the tally
 * notation. A sheet is f(categories x counts x date x weather x site plan);
 * the change plate is f(the whole accumulated series), which by definition
 * only he holds.
 *
 * When he decides that "bug" must become "ant" and "roly-poly" he has met the
 * central problem of classification, so a split is recorded as a lineage
 * rather than a rewrite: the parent series continues after the seam as the sum
 * of its children, and the seam itself stays visible as data.
 *
 * Pure module. No React, no DOM, no randomness.
 */
import type { Kept } from './drawer';

export const QUADRAT_META = {
  id: 'quadrat',
  title: 'The Quadrat',
  eyebrow: 'Ground survey',
  note: 'Mark one square of ground, then count what is inside it every time you come back.',
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

/** The five colours a category may be keyed by. Colour identifies, never decorates. */
export const CATEGORY_COLORS: readonly { readonly hex: string; readonly name: string }[] = [
  { hex: PALETTE.terracotta, name: 'red-brown' },
  { hex: PALETTE.ochre, name: 'yellow-brown' },
  { hex: PALETTE.teal, name: 'blue-green' },
  { hex: PALETTE.olive, name: 'green' },
  { hex: PALETTE.slate, name: 'blue-grey' },
];

export function colorName(hex: string): string {
  return CATEGORY_COLORS.find((c) => c.hex === hex)?.name ?? 'ink';
}

/* -------------------------------------------------------------- the drawing */

export type StampKind = 'tree' | 'fence' | 'step' | 'pot' | 'path';
export type WeatherKey = 'sun' | 'cloud' | 'rain' | 'wind' | 'snow' | 'dusk';
export type ShapeKey = 'circle' | 'square' | 'triangle' | 'leaf' | 'ring' | 'bar';

/** Line art on a 24x24 box, stroked not filled, so it survives serialisation. */
export interface GlyphSpec {
  readonly label: string;
  readonly paths: readonly string[];
}

export const WEATHER_KEYS: readonly WeatherKey[] = ['sun', 'cloud', 'rain', 'wind', 'snow', 'dusk'];

export const WEATHER: Readonly<Record<WeatherKey, GlyphSpec>> = {
  sun: {
    label: 'Sun',
    paths: [
      'M12 7.2a4.8 4.8 0 1 1 0 9.6a4.8 4.8 0 1 1 0-9.6Z',
      'M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2M4.7 4.7l2.3 2.3M17 17l2.3 2.3M19.3 4.7L17 7M7 17l-2.3 2.3',
    ],
  },
  cloud: {
    label: 'Cloud',
    paths: ['M6.4 17.6h11.2a3.8 3.8 0 0 0 0-7.6a5.6 5.6 0 0 0-10.6-1.6a3.6 3.6 0 0 0-.6 9.2Z'],
  },
  rain: {
    label: 'Rain',
    paths: [
      'M6.4 14.4h11.2a3.6 3.6 0 0 0 0-7.2a5.4 5.4 0 0 0-10.2-1.5a3.5 3.5 0 0 0-1 8.7Z',
      'M8 17.2l-1.2 3.6M12 17.2l-1.2 3.6M16 17.2l-1.2 3.6',
    ],
  },
  wind: {
    label: 'Wind',
    paths: ['M2.4 8.4h10a2.8 2.8 0 1 0-2.8-2.8', 'M2.4 13.2h12.8a2.8 2.8 0 1 1-2.8 2.8', 'M2.4 18h7.2'],
  },
  snow: {
    label: 'Snow',
    paths: [
      'M12 2.4v19.2M3.7 7.2l16.6 9.6M20.3 7.2L3.7 16.8',
      'M12 6.4l-2 -2M12 6.4l2 -2M12 17.6l-2 2M12 17.6l2 2',
    ],
  },
  dusk: {
    label: 'Evening',
    paths: [
      'M18.4 15.6A7.6 7.6 0 0 1 9.2 5.8a7.8 7.8 0 1 0 9.2 9.8Z',
      'M6.2 4.2l.8 1.8l1.8.8l-1.8.8l-.8 1.8l-.8-1.8l-1.8-.8l1.8-.8Z',
    ],
  },
};

export const STAMP_KEYS: readonly StampKind[] = ['tree', 'fence', 'step', 'pot', 'path'];

export const STAMPS: Readonly<Record<StampKind, GlyphSpec>> = {
  tree: { label: 'Tree', paths: ['M12 22v-7.6', 'M6.4 9.2a5.6 5.6 0 1 1 11.2 0a5.6 5.6 0 1 1-11.2 0Z'] },
  fence: { label: 'Fence', paths: ['M3.2 9.2h17.6M3.2 15.2h17.6', 'M7 4.4v16M12 4.4v16M17 4.4v16'] },
  step: { label: 'Step', paths: ['M2.8 20.4h6.4v-5.2h6v-5.2h6V5.6'] },
  pot: { label: 'Pot', paths: ['M7 11.2h10l-1.4 9.6H8.4Z', 'M5.2 8.4h13.6v2.8H5.2Z', 'M12 8.4V4.4'] },
  path: { label: 'Path', paths: ['M3.6 21.2c4.4-3.2 2.4-7.6 5.6-10s4-5.6 5.2-8.4', 'M10.4 21.2c4.4-3.2 2.4-7.2 5.6-9.6s3.2-5.6 4-9.6'] },
};

export const SHAPE_KEYS: readonly ShapeKey[] = ['circle', 'square', 'triangle', 'leaf', 'ring', 'bar'];

const round = (v: number): string => String(Math.round(v * 100) / 100);

/**
 * A closed path for a category's shape token, centred on (cx, cy) with radius r.
 * 'ring' returns two subpaths and must be filled with fill-rule="evenodd".
 */
export function shapePath(shape: ShapeKey, cx: number, cy: number, r: number): string {
  const x0 = round(cx - r);
  const x1 = round(cx + r);
  const y0 = round(cy - r);
  const y1 = round(cy + r);
  switch (shape) {
    case 'square':
      return `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;
    case 'triangle':
      return `M${round(cx)} ${y0}L${x1} ${y1}H${x0}Z`;
    case 'leaf':
      return (
        `M${round(cx)} ${y0}C${x1} ${round(cy - r * 0.4)} ${x1} ${round(cy + r * 0.4)} ${round(cx)} ${y1}` +
        `C${x0} ${round(cy + r * 0.4)} ${x0} ${round(cy - r * 0.4)} ${round(cx)} ${y0}Z`
      );
    case 'bar':
      return `M${x0} ${round(cy - r * 0.45)}H${x1}V${round(cy + r * 0.45)}H${x0}Z`;
    case 'ring': {
      const ri = r * 0.52;
      return (
        `M${x0} ${round(cy)}a${round(r)} ${round(r)} 0 1 0 ${round(r * 2)} 0a${round(r)} ${round(r)} 0 1 0 ${round(-r * 2)} 0Z` +
        `M${round(cx - ri)} ${round(cy)}a${round(ri)} ${round(ri)} 0 1 1 ${round(ri * 2)} 0a${round(ri)} ${round(ri)} 0 1 1 ${round(-ri * 2)} 0Z`
      );
    }
    case 'circle':
    default:
      return `M${x0} ${round(cy)}a${round(r)} ${round(r)} 0 1 0 ${round(r * 2)} 0a${round(r)} ${round(r)} 0 1 0 ${round(-r * 2)} 0Z`;
  }
}

/* ------------------------------------------------------------- the site plan */

export const PLAN_COLS = 6;
export const PLAN_ROWS = 4;
export const PLAN_CELLS = PLAN_COLS * PLAN_ROWS;

export const cellCol = (cell: number): number => cell % PLAN_COLS;
export const cellRow = (cell: number): number => Math.floor(cell / PLAN_COLS);

export interface SitePlan {
  /** Cell index (as a string key, for JSON) to the thing drawn there. */
  readonly stamps: Readonly<Record<string, StampKind>>;
  /** Up to four cell indices, in the order he tapped them. */
  readonly corners: readonly number[];
  readonly lat: number;
  readonly lng: number;
  /** False until a grown-up has fixed the square to a place on the earth. */
  readonly placed: boolean;
}

export const EMPTY_PLAN: SitePlan = { stamps: {}, corners: [], lat: 0, lng: 0, placed: false };

const inGrid = (cell: number): boolean => Number.isInteger(cell) && cell >= 0 && cell < PLAN_CELLS;

/** Stamp a cell. Stamping the same thing again rubs it out. */
export function stampCell(plan: SitePlan, cell: number, kind: StampKind): SitePlan {
  if (!inGrid(cell)) return plan;
  const stamps: Record<string, StampKind> = { ...plan.stamps };
  if (stamps[String(cell)] === kind) delete stamps[String(cell)];
  else stamps[String(cell)] = kind;
  return { ...plan, stamps };
}

export function clearCell(plan: SitePlan, cell: number): SitePlan {
  if (!inGrid(cell)) return plan;
  const stamps: Record<string, StampKind> = { ...plan.stamps };
  delete stamps[String(cell)];
  return { ...plan, stamps, corners: plan.corners.filter((c) => c !== cell) };
}

/** Tap a corner. Four is the whole square; a fifth tap starts the square again. */
export function markCorner(plan: SitePlan, cell: number): SitePlan {
  if (!inGrid(cell)) return plan;
  if (plan.corners.includes(cell)) return { ...plan, corners: plan.corners.filter((c) => c !== cell) };
  if (plan.corners.length >= 4) return { ...plan, corners: [cell] };
  return { ...plan, corners: [...plan.corners, cell] };
}

export const planIsSquared = (plan: SitePlan): boolean => plan.corners.length === 4;

export function setPlace(plan: SitePlan, lat: number, lng: number): SitePlan {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return plan;
  return { ...plan, lat, lng, placed: true };
}

/* ------------------------------------------------------------- his categories */

export interface Category {
  readonly key: string;
  /** A drawn thing he chose, or '' when the category is a colour and a shape. */
  readonly mark: string;
  readonly shape: ShapeKey | null;
  readonly color: string;
  /** Comes free from the palette, or from a grown-up. Never required. */
  readonly name: string;
}

/** A small, stable, dependency-free hash. Identical input, identical output. */
export function fingerprint(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0').slice(-7);
}

export function makeCategory(input: {
  mark?: string;
  shape?: ShapeKey | null;
  color: string;
  name?: string;
}): Category {
  const mark = input.mark ?? '';
  const shape = input.shape ?? null;
  return {
    // The name is part of what makes a kind distinct: a child will happily
    // keep one mark and split it into 'black ant' and 'red ant'. Leaving the
    // name out of the fingerprint silently merged those two into one kind.
    key: `k${fingerprint(`${mark}|${shape ?? '-'}|${input.color}|${(input.name ?? '').trim().toLowerCase()}`)}`,
    mark,
    shape,
    color: input.color,
    name: input.name ?? '',
  };
}

export function categoryLabel(cat: Category): string {
  if (cat.name) return cat.name;
  if (cat.shape) return `${colorName(cat.color)} ${cat.shape}`;
  return cat.mark || 'a kind';
}

export function addCategory(cats: readonly Category[], cat: Category): readonly Category[] {
  return cats.some((c) => c.key === cat.key) ? cats : [...cats, cat];
}

export function dropCategory(cats: readonly Category[], key: string): readonly Category[] {
  return cats.filter((c) => c.key !== key);
}

/* -------------------------------------------------------------- the log book */

export interface Lineage {
  readonly parent: string;
  readonly children: readonly string[];
  /** The date from which the parent is read as the sum of its children. */
  readonly fromDate: string;
}

export interface QuadratRecord extends Kept {
  readonly kind: 'site' | 'sheet';
  readonly plan: SitePlan;
  readonly categories: readonly Category[];
  readonly lineages: readonly Lineage[];
  /** ISO day for a sheet; '' on the site record. */
  readonly date: string;
  readonly weather: WeatherKey | null;
  readonly counts: Readonly<Record<string, number>>;
}

export type LogSheet = QuadratRecord & { readonly kind: 'sheet'; readonly weather: WeatherKey };
export type SiteRecord = QuadratRecord & { readonly kind: 'site' };

export const isSheet = (r: QuadratRecord): r is LogSheet => r.kind === 'sheet' && r.weather !== null;
export const isSite = (r: QuadratRecord): r is SiteRecord => r.kind === 'site';

export function composeSheet(input: {
  date: string;
  weather: WeatherKey;
  plan: SitePlan;
  categories: readonly Category[];
  counts: Readonly<Record<string, number>>;
  lineages?: readonly Lineage[];
}): Omit<LogSheet, 'id' | 'made'> {
  return {
    kind: 'sheet',
    date: input.date,
    weather: input.weather,
    plan: input.plan,
    categories: input.categories,
    counts: input.counts,
    lineages: input.lineages ?? [],
  };
}

export function composeSite(input: {
  plan: SitePlan;
  categories: readonly Category[];
  lineages: readonly Lineage[];
}): Omit<SiteRecord, 'id' | 'made'> {
  return {
    kind: 'site',
    plan: input.plan,
    categories: input.categories,
    lineages: input.lineages,
    date: '',
    weather: null,
    counts: {},
  };
}

export function sheetsInOrder(records: readonly QuadratRecord[]): readonly LogSheet[] {
  return records
    .filter(isSheet)
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.made < b.made ? -1 : a.made > b.made ? 1 : 0));
}

export function latestSite(records: readonly QuadratRecord[]): SiteRecord | null {
  const sites = records.filter(isSite);
  return sites.length ? sites[sites.length - 1] : null;
}

/* ------------------------------------------------------------------ counting */

export function bump(counts: Readonly<Record<string, number>>, key: string, by = 1): Record<string, number> {
  const next = { ...counts };
  next[key] = Math.max(0, (next[key] ?? 0) + by);
  return next;
}

export function totalMarks(counts: Readonly<Record<string, number>>): number {
  return Object.values(counts).reduce((sum, n) => sum + Math.max(0, n), 0);
}

/** One group of the five-bar gate: four uprights and the fifth laid across them. */
export interface GateGroup {
  readonly bars: number;
  readonly slash: boolean;
}

export function gate(count: number): readonly GateGroup[] {
  const n = Math.max(0, Math.floor(count));
  const groups: GateGroup[] = [];
  for (let left = n; left > 0; left -= 5) {
    groups.push(left >= 5 ? { bars: 4, slash: true } : { bars: left, slash: false });
  }
  return groups;
}

/** The inverse of `gate`, so the notation can be read back off the paper. */
export function gateTotal(groups: readonly GateGroup[]): number {
  return groups.reduce((sum, g) => sum + g.bars + (g.slash ? 1 : 0), 0);
}

/* ----------------------------------------------------------------- abundance */

export interface Rank {
  readonly key: string;
  readonly count: number;
  /** Of every mark on the sheet, the part that is this kind. 0 when nothing was counted. */
  readonly share: number;
  /** Competition ranking: equal counts share a rank, and the next rank skips. */
  readonly rank: number;
}

export function abundance(
  counts: Readonly<Record<string, number>>,
  keys: readonly string[],
): readonly Rank[] {
  const rows = keys.map((key) => ({ key, count: Math.max(0, counts[key] ?? 0) }));
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const sorted = rows
    .slice()
    .sort((a, b) => b.count - a.count || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  let rank = 0;
  let previous = Number.NaN;
  let seen = 0;
  return sorted.map((row) => {
    seen += 1;
    if (row.count !== previous) {
      rank = seen;
      previous = row.count;
    }
    return { key: row.key, count: row.count, share: total ? row.count / total : 0, rank };
  });
}

/* ------------------------------------------------------- the series over time */

export interface SeriesPoint {
  readonly date: string;
  readonly count: number;
  /** Whether the kind existed in his schema on that sheet. */
  readonly present: boolean;
}

export interface ResolvedSeries {
  readonly key: string;
  readonly points: readonly SeriesPoint[];
  /** The date the kind was split, if it ever was. */
  readonly seam: string | null;
  readonly children: readonly string[];
  readonly peak: number;
  /** Last count less first count, across the whole run. */
  readonly change: number;
}

function resolveAt(
  sheet: LogSheet,
  key: string,
  lineages: readonly Lineage[],
  seen: ReadonlySet<string>,
): { count: number; present: boolean } {
  const own = {
    count: Math.max(0, sheet.counts[key] ?? 0),
    present: sheet.categories.some((c) => c.key === key),
  };
  const lineage = lineages.find((l) => l.parent === key);
  if (!lineage || seen.has(key) || sheet.date < lineage.fromDate) return own;
  const deeper = new Set(seen);
  deeper.add(key);
  let count = 0;
  let present = false;
  for (const child of lineage.children) {
    const child_ = resolveAt(sheet, child, lineages, deeper);
    count += child_.count;
    present = present || child_.present;
  }
  return { count, present };
}

/**
 * A kind's whole run. After a split, the parent is read as the sum of its
 * children, so the line carries on across the seam instead of stopping dead —
 * and the seam is reported rather than hidden.
 */
export function resolvedSeries(
  sheets: readonly LogSheet[],
  key: string,
  lineages: readonly Lineage[],
): ResolvedSeries {
  const points = sheets.map((sheet) => {
    const at = resolveAt(sheet, key, lineages, new Set<string>());
    return { date: sheet.date, count: at.count, present: at.present };
  });
  const lineage = lineages.find((l) => l.parent === key) ?? null;
  const first = points.length ? points[0].count : 0;
  const last = points.length ? points[points.length - 1].count : 0;
  return {
    key,
    points,
    seam: lineage ? lineage.fromDate : null,
    children: lineage ? lineage.children : [],
    peak: points.reduce((m, p) => Math.max(m, p.count), 0),
    change: last - first,
  };
}

/**
 * Split one kind into several. The parent leaves the schema but stays in the
 * book: this is a revision of the classification, not an erasure of it.
 */
export function applySplit(
  categories: readonly Category[],
  lineages: readonly Lineage[],
  parentKey: string,
  children: readonly Category[],
  fromDate: string,
): { readonly categories: readonly Category[]; readonly lineages: readonly Lineage[] } {
  const parent = categories.find((c) => c.key === parentKey);
  const kids = children.filter((c) => c.key !== parentKey);
  const unique = kids.filter((c, i) => kids.findIndex((o) => o.key === c.key) === i);
  if (!parent || unique.length < 2 || !fromDate) return { categories, lineages };
  const next = unique.reduce<readonly Category[]>(addCategory, dropCategory(categories, parentKey));
  return {
    categories: next,
    lineages: [...lineages, { parent: parentKey, children: unique.map((c) => c.key), fromDate }],
  };
}

/** Everything the book has ever known a kind to look like, so old seams can be drawn. */
export function catalogue(
  sheets: readonly LogSheet[],
  current: readonly Category[],
): ReadonlyMap<string, Category> {
  const map = new Map<string, Category>();
  for (const sheet of sheets) for (const cat of sheet.categories) map.set(cat.key, cat);
  for (const cat of current) map.set(cat.key, cat);
  return map;
}

/** Which runs the change plate draws: what he counts now, plus every seam. */
export function seriesKeys(
  current: readonly Category[],
  lineages: readonly Lineage[],
): readonly string[] {
  const keys: string[] = current.map((c) => c.key);
  for (const lineage of lineages) if (!keys.includes(lineage.parent)) keys.push(lineage.parent);
  return keys;
}

/** What he counted last time, laid out ready, so returning is one tap. */
export function carryForward(
  site: SiteRecord | null,
  sheets: readonly LogSheet[],
): readonly Category[] {
  if (site && site.categories.length) return site.categories;
  const last = sheets.length ? sheets[sheets.length - 1] : null;
  return last ? last.categories : [];
}

/* -------------------------------------------------------------- identity & date */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Local day, because the child's day is the one that counts. */
export function isoDate(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  const month = MONTHS[Number(m) - 1];
  if (!y || !month || !d) return iso;
  return `${Number(d)} ${month} ${y}`;
}

export function planSignature(plan: SitePlan): string {
  const stamps = Object.keys(plan.stamps)
    .map(Number)
    .sort((a, b) => a - b)
    .map((i) => `${i}${plan.stamps[String(i)]}`)
    .join(',');
  return fingerprint(`${stamps}#${plan.corners.join('-')}`);
}

/** The sheet's serial, derived from everything on it. Same sheet, same serial. */
export function sheetSignature(
  sheet: Pick<LogSheet, 'date' | 'weather' | 'plan' | 'categories' | 'counts'>,
): string {
  const cells = sheet.categories
    .map((c) => c.key)
    .sort()
    .map((k) => `${k}:${Math.max(0, sheet.counts[k] ?? 0)}`)
    .join(',');
  return `Q-${fingerprint(`${sheet.date}|${sheet.weather}|${planSignature(sheet.plan)}|${cells}`).toUpperCase().slice(-5)}`;
}

/* ------------------------------------------------------------ map & timeline */

/** One live band at the end of the guide's eras, where his own sheets land. */
export const LIVE_ERA_BAND = 'Living record (now)';

export interface SheetPin {
  readonly id: string;
  readonly label: string;
  readonly lat: number;
  readonly lng: number;
  readonly year: number;
  readonly yearLabel: string;
  readonly era: string;
  readonly color: string;
}

export function pinFor(sheet: LogSheet): SheetPin | null {
  if (!sheet.plan.placed) return null;
  const year = Number(sheet.date.slice(0, 4));
  return {
    id: sheet.id,
    label: `${sheetSignature(sheet)} · ${formatDate(sheet.date)}`,
    lat: sheet.plan.lat,
    lng: sheet.plan.lng,
    year,
    yearLabel: `${year} CE`,
    era: LIVE_ERA_BAND,
    color: PALETTE.teal,
  };
}

export function pinsFrom(records: readonly QuadratRecord[]): readonly SheetPin[] {
  return sheetsInOrder(records)
    .map(pinFor)
    .filter((p): p is SheetPin => p !== null);
}

/* ----------------------------------------------------------------- in words */

export function planSummary(plan: SitePlan): string {
  const drawn = Object.keys(plan.stamps).length;
  const things = drawn === 1 ? '1 thing drawn' : `${drawn} things drawn`;
  const square = planIsSquared(plan)
    ? 'the square is marked at all four corners'
    : `${plan.corners.length} of 4 corners marked`;
  return `Site plan: ${things}, ${square}${plan.placed ? ', and the place is fixed' : ''}.`;
}

export function sheetSummary(
  sheet: Pick<LogSheet, 'date' | 'weather' | 'categories' | 'counts' | 'plan'>,
): string {
  const kinds = sheet.categories.length;
  const total = totalMarks(sheet.counts);
  const ranked = abundance(sheet.counts, sheet.categories.map((c) => c.key));
  const top = ranked.length && ranked[0].count > 0
    ? sheet.categories.find((c) => c.key === ranked[0].key)
    : undefined;
  const most = top ? ` Most of all: ${categoryLabel(top)}, ${ranked[0].count}.` : '';
  return (
    `Field sheet ${sheetSignature(sheet)}. ${formatDate(sheet.date)}. ${WEATHER[sheet.weather].label}. ` +
    `${kinds} ${kinds === 1 ? 'kind' : 'kinds'} counted, ${total} ${total === 1 ? 'mark' : 'marks'} in all.${most}`
  );
}

export function changeSummary(
  sheets: readonly LogSheet[],
  lineages: readonly Lineage[],
): string {
  if (!sheets.length) return 'No sheets yet.';
  const first = sheets[0].date;
  const last = sheets[sheets.length - 1].date;
  const peak = sheets.reduce((m, s) => Math.max(m, ...Object.values(s.counts).concat(0)), 0);
  const splits = lineages.length
    ? ` ${lineages.length} ${lineages.length === 1 ? 'kind was' : 'kinds were'} split into finer kinds.`
    : '';
  return (
    `${sheets.length} ${sheets.length === 1 ? 'visit' : 'visits'}, ${formatDate(first)} to ${formatDate(last)}. ` +
    `The highest count on any one sheet is ${peak}.${splits}`
  );
}
