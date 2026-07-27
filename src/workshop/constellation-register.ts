/**
 * The Constellation Register.
 *
 * Every historical account in the guide is one star. Where a star sits is not
 * decoration: the bearing and the ring are read off the account's own
 * metadata — its year, its era band, its longitude, its subject. The child
 * joins stars into figures of his own, and then changes how the sky is
 * arranged. The figures keep their stars but lose their shape. That is the
 * whole lesson: the objects are fixed, the arrangement is a choice.
 *
 * Pure: no React, no DOM, no randomness, no clock. Two calls with the same
 * arguments return the same numbers, so a saved figure redraws exactly and
 * every claim in a caption can be checked.
 */
import { STORIES } from '../stories';
import { STORY_META } from '../data/storyMeta';
import { CATEGORY_LABEL, CATEGORY_ORDER, ERA_BANDS, REGION_COLOR } from '../data/meta';
import { ALL_INGREDIENTS } from '../loom/ingredients';
import type { Thing } from '../loom/ingredients';
import type { StoryDomain } from '../types';

export const CONSTELLATION_REGISTER_META = {
  id: 'constellation-register',
  title: 'The Constellation Register',
  eyebrow: 'Compose',
  note: 'Join stars into figures of your own, then change how the sky is arranged and watch the same figures bend.',
} as const;

/* ------------------------------------------------------------------ stars -- */

/** Accounts older than this are deep time; their dates are in millions. */
export const DEEP_TIME_BEFORE = -100000;
/** The dated window every non-deep-time account falls inside. */
export const YEAR_MIN = -20000;
export const YEAR_MAX = 1831;

/** One account, with everything the sky needs read off its own record. */
export interface Star {
  readonly slug: string;
  readonly title: string;
  readonly domain: StoryDomain;
  /** The subject label a grown-up reads out, e.g. "Measurement". */
  readonly subject: string;
  readonly year: number;
  readonly yearLabel: string;
  readonly place: string;
  readonly region: string;
  readonly era: string;
  /** Index into ERA_BANDS. 0 is the Mesozoic, and sits innermost. */
  readonly eraIndex: number;
  readonly lat: number;
  readonly lng: number;
  readonly pages: number;
  /** REGION_COLOR for the account's region. */
  readonly color: string;
}

const FALLBACK_COLOR = '#3c566f';
const bands: readonly string[] = ERA_BANDS;

/** Every historical account that carries metadata, in library order. */
export const STARS: readonly Star[] = STORIES.flatMap((story) => {
  if (story.collection !== 'historical') return [];
  const meta = STORY_META[story.slug];
  if (!meta) return [];
  const eraIndex = bands.indexOf(meta.era);
  return [{
    slug: story.slug,
    title: story.title,
    domain: story.domain,
    subject: CATEGORY_LABEL[story.domain],
    year: meta.year,
    yearLabel: meta.yearLabel,
    place: meta.place,
    region: meta.region,
    era: meta.era,
    eraIndex: eraIndex < 0 ? 0 : eraIndex,
    lat: meta.lat,
    lng: meta.lng,
    pages: story.pages.length,
    color: REGION_COLOR[meta.region] ?? FALLBACK_COLOR,
  }];
});

const BY_SLUG = new Map<string, Star>(STARS.map((s) => [s.slug, s]));

export function starBySlug(slug: string): Star | undefined {
  return BY_SLUG.get(slug);
}

/** Resolve a saved figure's slugs back to stars, dropping any that have gone. */
export function starsFor(slugs: readonly string[]): Star[] {
  return slugs.flatMap((slug) => {
    const star = BY_SLUG.get(slug);
    return star ? [star] : [];
  });
}

const PAGE_MIN = STARS.reduce((m, s) => Math.min(m, s.pages), Number.POSITIVE_INFINITY);
const PAGE_MAX = STARS.reduce((m, s) => Math.max(m, s.pages), Number.NEGATIVE_INFINITY);

/** A star's drawn radius. Longer accounts are brighter — nothing else. */
export function starSize(pages: number): number {
  const span = PAGE_MAX - PAGE_MIN;
  const t = span > 0 ? (pages - PAGE_MIN) / span : 0.5;
  return 3 + Math.max(0, Math.min(1, t)) * 2.4;
}

/* ---------------------------------------------------------- arrangements -- */

export type Arrangement = 'time' | 'place' | 'subject';

export interface ArrangementSpec {
  readonly id: Arrangement;
  readonly label: string;
  /** Plain sentence a grown-up can read out. */
  readonly note: string;
}

export const ARRANGEMENTS: readonly ArrangementSpec[] = [
  { id: 'time', label: 'By time', note: 'Each ring is an era. Round the circle is the year.' },
  { id: 'place', label: 'By place', note: 'Round the circle is east and west. The middle is the far north.' },
  { id: 'subject', label: 'By subject', note: 'Each subject is a spoke. The oldest account sits nearest the middle.' },
];

/** Era band names with the dates dropped, for ring labels. */
export const ERA_SHORT: readonly string[] = bands.map((b) => b.replace(/\s*\(.*\)\s*$/, ''));

/* ------------------------------------------------------------- the plate -- */

export const SKY = {
  width: 820,
  height: 620,
  cx: 410,
  cy: 300,
  maxR: 268,
} as const;

/** Ring radius for an era band. Mesozoic innermost, Modern at the rim. */
const RING0 = 30;
const RING_GAP = 37;
export function ringRadius(eraIndex: number): number {
  return RING0 + eraIndex * RING_GAP;
}

/** Innermost radius of a subject spoke. */
const SPOKE_R0 = 66;

/** How near a tap must land. Generous, because the targets are small. */
export const SNAP_RADIUS = 26;
/** No two stars are drawn closer than this. */
const MIN_SEP = 21;

export interface Placed {
  readonly slug: string;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly color: string;
}

const TAU = Math.PI * 2;
/** The golden angle, used only to break exact ties in a fixed way. */
const GOLDEN = 2.39996322972865332;

/** A small, stable, dependency-free hash in [0, 1). Same text, same number. */
function hash01(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h / 0x100000000;
}

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

interface Point { x: number; y: number }

/** Turn (0..1, clockwise from the top) and radius, before any nudging. */
interface Polar { turn: number; r: number }

function polarTime(stars: readonly Star[]): Map<string, Polar> {
  const out = new Map<string, Polar>();
  const byBand = new Map<number, Star[]>();
  for (const s of stars) {
    const list = byBand.get(s.eraIndex);
    if (list) list.push(s);
    else byBand.set(s.eraIndex, [s]);
  }
  for (const [eraIndex, group] of byBand) {
    const deep = group.every((s) => s.year <= DEEP_TIME_BEFORE);
    // Deep time has no place on a scale that runs to 1831, so those accounts
    // ring the very centre in a fixed rosette instead of pretending a bearing.
    const ordered = [...group].sort(
      (a, b) => (a.year - b.year) || a.slug.localeCompare(b.slug),
    );
    ordered.forEach((s, k) => {
      // Each ring carries one era, so the bearing is the account's place in
      // that era's own order. Mapping it onto the whole 20,000-year span
      // instead would squeeze a thousand-year band into a thin wedge and pile
      // every star into one arc of the plate.
      const turn = k / Math.max(1, ordered.length);
      // Neighbours in a crowded band are staggered across three sub-rings so
      // a run of accounts from the same year cannot stack on one another.
      const stagger = ((k % 3) - 1) * 11;
      out.set(s.slug, { turn, r: ringRadius(eraIndex) + (deep ? 0 : stagger) });
    });
  }
  return out;
}

function polarPlace(stars: readonly Star[]): Map<string, Polar> {
  const out = new Map<string, Polar>();
  for (const s of stars) {
    // An azimuthal sky: the far north at the middle, the far south at the rim,
    // longitude carried round the circle.
    out.set(s.slug, {
      turn: clamp01((s.lng + 180) / 360),
      r: 18 + clamp01((90 - s.lat) / 180) * (SKY.maxR - 18),
    });
  }
  return out;
}

function polarSubject(stars: readonly Star[]): Map<string, Polar> {
  const out = new Map<string, Polar>();
  const present = CATEGORY_ORDER.filter((d) => stars.some((s) => s.domain === d));
  const wedge = 1 / Math.max(1, present.length);
  present.forEach((domain, si) => {
    const group = stars
      .filter((s) => s.domain === domain)
      .sort((a, b) => (a.year - b.year) || a.slug.localeCompare(b.slug));
    const cols = group.length <= 6 ? 1 : group.length <= 14 ? 2 : 3;
    const rows = Math.max(1, Math.ceil(group.length / cols));
    group.forEach((s, k) => {
      const col = k % cols;
      const row = Math.floor(k / cols);
      const t = rows > 1 ? row / (rows - 1) : 0.5;
      out.set(s.slug, {
        turn: (si + 0.5) * wedge + ((col - (cols - 1) / 2) / cols) * wedge * 0.78,
        r: SPOKE_R0 + t * (SKY.maxR - SPOKE_R0),
      });
    });
  });
  return out;
}

function basePolar(mode: Arrangement, stars: readonly Star[]): Map<string, Polar> {
  if (mode === 'place') return polarPlace(stars);
  if (mode === 'subject') return polarSubject(stars);
  return polarTime(stars);
}

/** Accounts that land on exactly the same spot open into a small rosette. */
function spreadCoincident(pts: Point[]): void {
  const seen = new Map<string, number>();
  for (const p of pts) {
    const key = `${Math.round(p.x * 4)}:${Math.round(p.y * 4)}`;
    const k = seen.get(key) ?? 0;
    seen.set(key, k + 1);
    if (k === 0) continue;
    const ring = Math.floor((k - 1) / 6);
    const slot = (k - 1) % 6;
    const rr = 10 + ring * 9;
    p.x += Math.cos(slot * (TAU / 6)) * rr;
    p.y += Math.sin(slot * (TAU / 6)) * rr;
  }
}

/** Push overlapping stars apart, then keep the whole sky inside its disc. */
function relax(pts: Point[], passes: number): void {
  const { cx, cy, maxR } = SKY;
  for (let pass = 0; pass < passes; pass += 1) {
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const a = pts[i];
        const b = pts[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d >= MIN_SEP) continue;
        if (d < 1e-6) {
          dx = Math.cos(i * GOLDEN);
          dy = Math.sin(i * GOLDEN);
          d = 1;
        }
        const push = (MIN_SEP - d) / (2 * d);
        a.x -= dx * push;
        a.y -= dy * push;
        b.x += dx * push;
        b.y += dy * push;
      }
    }
    for (const p of pts) {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const d = Math.hypot(dx, dy);
      if (d > maxR) {
        p.x = cx + (dx / d) * maxR;
        p.y = cy + (dy / d) * maxR;
      }
    }
  }
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * The whole sky under one arrangement. Deterministic: the nudges are hashed
 * off the slug and the relaxation runs in a fixed order, so the same mode
 * always draws the same plate.
 */
/** Laying out 195 stars costs real work, so each arrangement is laid out once. */
const laid = new Map<Arrangement, Placed[]>();

export function project(mode: Arrangement, stars: readonly Star[] = STARS): Placed[] {
  if (stars === STARS) {
    const already = laid.get(mode);
    if (already) return already;
  }
  const polar = basePolar(mode, stars);
  const pts: Point[] = stars.map((s) => {
    const p = polar.get(s.slug) ?? { turn: 0, r: 0 };
    const angle = p.turn * TAU - Math.PI / 2;
    return {
      x: SKY.cx + Math.cos(angle) * p.r + (hash01(s.slug) - 0.5) * 7,
      y: SKY.cy + Math.sin(angle) * p.r + (hash01(`${s.slug}~`) - 0.5) * 7,
    };
  });
  spreadCoincident(pts);
  // 195 stars on one plate collide badly; relax until no two are nearer than
  // a fingertip, or the small targets simply cannot be tapped.
  relax(pts, 120);
  const out = stars.map((s, i) => ({
    slug: s.slug,
    x: round2(pts[i].x),
    y: round2(pts[i].y),
    size: round2(starSize(s.pages)),
    color: s.color,
  }));
  if (stars === STARS) laid.set(mode, out);
  return out;
}

export function placedIndex(placed: readonly Placed[]): Map<string, Placed> {
  return new Map(placed.map((p) => [p.slug, p]));
}

/** The star under a tap, or null when the tap landed on empty sky. */
export function nearest(
  placed: readonly Placed[],
  x: number,
  y: number,
  snap: number = SNAP_RADIUS,
): Placed | null {
  let best: Placed | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const p of placed) {
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best !== null && bestD <= snap ? best : null;
}

/* ------------------------------------------------------------- the facts -- */

export interface LatLng {
  readonly lat: number;
  readonly lng: number;
}

const RADIUS_KM = 6371;
const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** Great-circle distance in kilometres, on a sphere. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const p1 = toRad(a.lat);
  const p2 = toRad(b.lat);
  const dp = toRad(b.lat - a.lat);
  const dl = toRad(b.lng - a.lng);
  const h =
    Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface FigureFacts {
  readonly stars: number;
  /** Newest year minus oldest year, exactly. */
  readonly yearSpan: number;
  /** Great-circle distance between the two most distant stars, rounded. */
  readonly kilometres: number;
  /** The older end of that pair. */
  readonly from: string;
  /** The newer end of that pair. */
  readonly to: string;
  readonly subjects: readonly string[];
  readonly eras: readonly string[];
  readonly regions: readonly string[];
}

const distinct = (values: readonly string[]): string[] => [...new Set(values)];

/** Everything a caption is allowed to claim, all of it measured. */
export function figureFacts(stars: readonly Star[]): FigureFacts {
  const years = stars.map((s) => s.year);
  const yearSpan = years.length === 0 ? 0 : Math.max(...years) - Math.min(...years);

  let widest = 0;
  let ends: readonly [Star, Star] | null = null;
  for (let i = 0; i < stars.length; i += 1) {
    for (let j = i + 1; j < stars.length; j += 1) {
      const km = haversineKm(stars[i], stars[j]);
      if (km > widest) {
        widest = km;
        ends = [stars[i], stars[j]];
      }
    }
  }
  // Read the pair oldest-first, so the line always runs forwards in time.
  const pair = ends
    ? [...ends].sort((a, b) => (a.year - b.year) || a.slug.localeCompare(b.slug))
    : stars.slice(0, 1);

  return {
    stars: stars.length,
    yearSpan,
    kilometres: Math.round(widest),
    from: pair[0]?.place ?? '',
    to: pair[1]?.place ?? pair[0]?.place ?? '',
    subjects: distinct(stars.map((s) => s.subject)),
    eras: distinct(stars.map((s) => s.era)),
    regions: distinct(stars.map((s) => s.region)),
  };
}

const WORDS: readonly string[] = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
  'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
];

/** Thousands separators without leaning on a locale. */
export function group(n: number): string {
  const sign = n < 0 ? '-' : '';
  const digits = String(Math.abs(Math.trunc(n)));
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** A count at the head of a sentence: a word while it is small, else a numeral. */
export function countWord(n: number): string {
  return n >= 0 && n < WORDS.length ? WORDS[n] : group(n);
}

/**
 * The caption. Flat, declarative, measured. It says what the figure is; it
 * never says whether the figure is good, because there is no such fact.
 */
export function figureCaption(stars: readonly Star[]): string[] {
  if (stars.length === 0) return ['Nothing joined.'];
  if (stars.length === 1) {
    const only = stars[0];
    return ['One star.', `${only.yearLabel}.`, `${only.place}.`, `${only.subject}.`];
  }

  const f = figureFacts(stars);
  const lines = [`${countWord(f.stars)} stars.`];

  if (f.yearSpan === 0) lines.push('Same year.');
  else if (f.yearSpan === 1) lines.push('One year wide.');
  else lines.push(`${group(f.yearSpan)} years wide.`);

  if (f.kilometres === 0) {
    lines.push('Same place.');
  } else {
    lines.push(`${f.from} to ${f.to}.`);
    lines.push(
      f.kilometres === 1
        ? 'One kilometre apart.'
        : `${group(f.kilometres)} kilometres apart.`,
    );
  }

  lines.push(`${countWord(f.subjects.length)} ${f.subjects.length === 1 ? 'subject' : 'subjects'}.`);
  lines.push(`${countWord(f.eras.length)} ${f.eras.length === 1 ? 'era' : 'eras'}.`);
  return lines;
}

/* -------------------------------------------------------------- the room -- */

/** A spread of the loom's palette, so a figure is named by tapping one icon. */
export const NAME_ICONS: readonly Thing[] = (() => {
  const wanted = 24;
  const of = ALL_INGREDIENTS.length;
  if (of <= wanted) return ALL_INGREDIENTS;
  return Array.from({ length: wanted }, (_, k) =>
    ALL_INGREDIENTS[Math.round((k * (of - 1)) / (wanted - 1))]);
})();

/**
 * Where a story lives. The guide routes readers at `#/read/<slug>/<page>`,
 * one-based, so a figure opens its accounts at their first page.
 */
export function storyRoute(slug: string): string {
  return `#/read/${encodeURIComponent(slug)}/1`;
}

/** A stateful sentence for the plate's label. */
export function describeSky(input: {
  readonly mode: Arrangement;
  readonly total: number;
  readonly joined: number;
  readonly figures: number;
  readonly sighted?: string;
}): string {
  const spec = ARRANGEMENTS.find((a) => a.id === input.mode);
  const parts = [
    `A register of ${input.total} stars, arranged ${spec ? spec.label.toLowerCase() : input.mode}.`,
    input.joined === 0
      ? 'No stars joined yet.'
      : `${countWord(input.joined)} ${input.joined === 1 ? 'star' : 'stars'} joined.`,
    input.figures === 1 ? 'One figure saved.' : `${countWord(input.figures)} figures saved.`,
  ];
  if (input.sighted) parts.push(`The sight is on ${input.sighted}.`);
  return parts.join(' ');
}
