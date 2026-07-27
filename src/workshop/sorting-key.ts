/**
 * The Sorting Key — a dichotomous key the child writes himself.
 *
 * A tray of picture cards is split in two, and each half is split again, until
 * every card stands alone. At every fork the child chooses BOTH the partition
 * and the mark that names it; this module never proposes either. What is fixed
 * is only the binary recursion and the couplet notation, so the finished key is
 * the recursive product of free choices. The same tray admits an astronomical
 * number of valid keys, which is why a key cannot be graded — only run, and so
 * falsified.
 *
 * Pure: no React, no DOM, no randomness. Every selection is deterministic.
 */
import { STORIES } from '../stories';
import { STORY_META } from '../data/storyMeta';
import { CATEGORY_LABEL, REGION_COLOR } from '../data/meta';
import { INGREDIENTS } from '../loom/ingredients';
import type { StoryDomain } from '../types';

export const SORTINGKEY_META = {
  id: 'sorting-key',
  title: 'The Sorting Key',
  eyebrow: 'Splitting in two',
  note: 'Split a tray of cards into two piles, mark what tells the piles apart, and split again until every card stands alone.',
} as const;

/* ------------------------------------------------------------------ marks -- */

/** The drawn contrast marks. Every one of these is drawn, never read. */
export const GLYPH_IDS = [
  'round', 'pointed', 'large', 'small', 'dark', 'pale', 'many', 'few',
  'water', 'land', 'sky', 'ground', 'person', 'thing', 'old', 'new',
  'legs', 'noLegs', 'living', 'notLiving', 'calm', 'stirred', 'toward', 'away',
  'loud', 'quiet', 'markA', 'markB',
] as const;

export type GlyphId = (typeof GLYPH_IDS)[number];

/** One side of a fork: a drawn mark and the plain word a grown-up reads out. */
export interface Contrast {
  readonly word: string;
  readonly glyph: GlyphId;
}

/** What tells the two piles apart. The child picks it; the tool never does. */
export interface Mark {
  readonly a: Contrast;
  readonly b: Contrast;
}

const mark = (aWord: string, aGlyph: GlyphId, bWord: string, bGlyph: GlyphId): Mark => ({
  a: { word: aWord, glyph: aGlyph },
  b: { word: bWord, glyph: bGlyph },
});

/** Always available, so a split he can see but cannot name is never blocked. */
export const PLAIN_MARK: Mark = mark('like this', 'markA', 'like that', 'markB');

const SHAPE_MARKS: readonly Mark[] = [
  mark('round', 'round', 'pointed', 'pointed'),
  mark('big', 'large', 'small', 'small'),
  mark('dark', 'dark', 'pale', 'pale'),
  mark('many', 'many', 'few', 'few'),
];

const WORLD_MARKS: readonly Mark[] = [
  mark('water', 'water', 'land', 'land'),
  mark('sky', 'sky', 'ground', 'ground'),
  mark('people', 'person', 'things', 'thing'),
  mark('long ago', 'old', 'later on', 'new'),
];

const FEELING_MARKS: readonly Mark[] = [
  mark('calm', 'calm', 'stirred up', 'stirred'),
  mark('turning toward', 'toward', 'turning away', 'away'),
  mark('quiet', 'quiet', 'loud', 'loud'),
];

const CREATURE_MARKS: readonly Mark[] = [
  mark('legs', 'legs', 'no legs', 'noLegs'),
  mark('living', 'living', 'not living', 'notLiving'),
  mark('water', 'water', 'land', 'land'),
];

/* ------------------------------------------------------------------- tree -- */

export type Side = 'a' | 'b';
export type Path = readonly Side[];

/**
 * A group holds cards that have not been told apart yet; a fork holds the mark
 * that tells its two sides apart. A group of one card is a leaf of the key.
 */
export type KeyNode =
  | { readonly kind: 'group'; readonly cards: readonly string[] }
  | { readonly kind: 'fork'; readonly mark: Mark; readonly a: KeyNode; readonly b: KeyNode };

export const group = (cards: readonly string[]): KeyNode => ({ kind: 'group', cards: [...cards] });

/** A stable key for a path, so paths can index a plain record. */
export const pathKey = (path: Path): string => (path.length === 0 ? 'root' : path.join(''));

/** Every card id held below a node, in key order. */
export function cardsIn(node: KeyNode): string[] {
  return node.kind === 'group' ? [...node.cards] : [...cardsIn(node.a), ...cardsIn(node.b)];
}

/** The node at a path, or null when the path runs off the tree. */
export function nodeAt(root: KeyNode, path: Path): KeyNode | null {
  let node: KeyNode = root;
  for (const side of path) {
    if (node.kind !== 'fork') return null;
    node = side === 'a' ? node.a : node.b;
  }
  return node;
}

function replaceAt(node: KeyNode, path: Path, next: KeyNode): KeyNode | null {
  if (path.length === 0) return next;
  if (node.kind !== 'fork') return null;
  const head = path[0];
  const rest = path.slice(1);
  const child = replaceAt(head === 'a' ? node.a : node.b, rest, next);
  if (!child) return null;
  return head === 'a' ? { ...node, a: child } : { ...node, b: child };
}

/**
 * Split the group at `path` into two marked sides. Returns a new tree, or null
 * when the split is not a partition of that group: both sides must be
 * non-empty, must not overlap, and must together be exactly the group's cards.
 */
export function splitAt(
  root: KeyNode,
  path: Path,
  forkMark: Mark,
  aCards: readonly string[],
  bCards: readonly string[],
): KeyNode | null {
  const target = nodeAt(root, path);
  if (!target || target.kind !== 'group') return null;
  if (aCards.length === 0 || bCards.length === 0) return null;
  const held = [...target.cards].sort();
  const given = [...aCards, ...bCards].sort();
  if (given.length !== held.length) return null;
  if (new Set(given).size !== given.length) return null;
  if (held.some((id, i) => id !== given[i])) return null;
  const fork: KeyNode = { kind: 'fork', mark: forkMark, a: group(aCards), b: group(bCards) };
  return replaceAt(root, path, fork);
}

/** Paths of every pile that still holds more than one card, in key order. */
export function openGroups(root: KeyNode): Path[] {
  const out: Path[] = [];
  const go = (node: KeyNode, path: Side[]): void => {
    if (node.kind === 'group') {
      if (node.cards.length > 1) out.push([...path]);
      return;
    }
    go(node.a, [...path, 'a']);
    go(node.b, [...path, 'b']);
  };
  go(root, []);
  return out;
}

/** Fork paths numbered 1, 2, 3 … in key order — the couplet numbers. */
export function forkNumbers(root: KeyNode): Record<string, number> {
  const out: Record<string, number> = {};
  let n = 0;
  const go = (node: KeyNode, path: Side[]): void => {
    if (node.kind !== 'fork') return;
    n += 1;
    out[pathKey(path)] = n;
    go(node.a, [...path, 'a']);
    go(node.b, [...path, 'b']);
  };
  go(root, []);
  return out;
}

/** Card id → leaf number, for the cards that already stand alone. */
export function leafNumbers(root: KeyNode): Record<string, number> {
  const out: Record<string, number> = {};
  let n = 0;
  const go = (node: KeyNode): void => {
    if (node.kind === 'group') {
      if (node.cards.length === 1) {
        n += 1;
        out[node.cards[0]] = n;
      }
      return;
    }
    go(node.a);
    go(node.b);
  };
  go(root);
  return out;
}

/* --------------------------------------------------------------- couplets -- */

export type Destination =
  | { readonly kind: 'fork'; readonly number: number }
  | { readonly kind: 'leaf'; readonly cardId: string; readonly number: number }
  | { readonly kind: 'pile'; readonly count: number };

export interface Lead {
  readonly side: Side;
  readonly contrast: Contrast;
  readonly to: Destination;
}

export interface Couplet {
  readonly number: number;
  readonly path: Path;
  readonly leads: readonly [Lead, Lead];
}

/** The key set as proper numbered couplets: 1a … go to 2 / 1b … the ladle. */
export function couplets(root: KeyNode): Couplet[] {
  const forks = forkNumbers(root);
  const leaves = leafNumbers(root);
  const out: Couplet[] = [];
  const destination = (node: KeyNode, path: Side[]): Destination => {
    if (node.kind === 'fork') return { kind: 'fork', number: forks[pathKey(path)] };
    if (node.cards.length === 1) {
      const cardId = node.cards[0];
      return { kind: 'leaf', cardId, number: leaves[cardId] };
    }
    return { kind: 'pile', count: node.cards.length };
  };
  const go = (node: KeyNode, path: Side[]): void => {
    if (node.kind !== 'fork') return;
    out.push({
      number: forks[pathKey(path)],
      path: [...path],
      leads: [
        { side: 'a', contrast: node.mark.a, to: destination(node.a, [...path, 'a']) },
        { side: 'b', contrast: node.mark.b, to: destination(node.b, [...path, 'b']) },
      ],
    });
    go(node.a, [...path, 'a']);
    go(node.b, [...path, 'b']);
  };
  go(root, []);
  return out;
}

/* --------------------------------------------------------------- measures -- */

export const cardCount = (root: KeyNode): number => cardsIn(root).length;

export function forkCount(root: KeyNode): number {
  return root.kind === 'group' ? 0 : 1 + forkCount(root.a) + forkCount(root.b);
}

/** How many questions the longest run through the key asks. */
export function longestRun(root: KeyNode): number {
  return root.kind === 'group' ? 0 : 1 + Math.max(longestRun(root.a), longestRun(root.b));
}

/** Questions asked per card, averaged. Efficiency, stated as an observation. */
export function averageRun(root: KeyNode): number {
  const total = cardCount(root);
  if (total === 0) return 0;
  const sum = (node: KeyNode, depth: number): number =>
    node.kind === 'group'
      ? node.cards.length * depth
      : sum(node.a, depth + 1) + sum(node.b, depth + 1);
  return sum(root, 0) / total;
}

/** Where a card sits in the key, or null when it is not in this tray. */
export function pathOfCard(root: KeyNode, cardId: string): Path | null {
  const go = (node: KeyNode, path: Side[]): Side[] | null => {
    if (node.kind === 'group') return node.cards.includes(cardId) ? path : null;
    return go(node.a, [...path, 'a']) ?? go(node.b, [...path, 'b']);
  };
  return go(root, []);
}

export interface Failure {
  /** The fork that failed to separate the two cards. */
  readonly path: Path;
  /** Its couplet number, for the flag beside the couplet. */
  readonly number: number;
}

/**
 * Run the key, land somewhere, and be told which card it really was: this finds
 * the first fork where the walk and the card part company. That fork is the one
 * that failed to separate them. Nothing here is scored; it only points.
 * Returns null when the walk did land on the card.
 */
export function diagnose(root: KeyNode, walked: Path, actualCardId: string): Failure | null {
  const truth = pathOfCard(root, actualCardId);
  if (!truth) return null;
  const forks = forkNumbers(root);
  const shared = Math.min(walked.length, truth.length);
  for (let i = 0; i < shared; i += 1) {
    if (walked[i] !== truth[i]) {
      const at = truth.slice(0, i);
      return { path: at, number: forks[pathKey(at)] };
    }
  }
  if (walked.length < truth.length) {
    const at = walked.slice(0);
    const number = forks[pathKey(at)];
    return number === undefined ? null : { path: at, number };
  }
  return null;
}

/** A plain sentence describing the key as it stands. Read aloud and used as the drawing's label. */
export function describeKey(root: KeyNode, sourceTitle: string): string {
  const cards = cardCount(root);
  const forks = forkCount(root);
  if (forks === 0) return `${cards} cards from ${sourceTitle}, all still in one pile.`;
  const open = openGroups(root).length;
  const tail = open === 0
    ? 'Every card stands alone.'
    : open === 1
      ? 'One pile still holds cards that have not been told apart.'
      : `${open} piles still hold cards that have not been told apart.`;
  return `A key for ${cards} cards from ${sourceTitle}. ${forks} ${forks === 1 ? 'question' : 'questions'}. `
    + `The longest run asks ${longestRun(root)}. ${tail}`;
}

/* ----------------------------------------------------------------- layout -- */

export interface LaidNode {
  readonly path: Path;
  /** Horizontal slot, in terminal-widths from the left edge. */
  readonly x: number;
  readonly depth: number;
  readonly kind: 'fork' | 'leaf' | 'pile';
  readonly cardIds: readonly string[];
  readonly mark?: Mark;
}

export interface Layout {
  readonly nodes: readonly LaidNode[];
  /** Number of terminal slots across. */
  readonly spread: number;
  readonly depth: number;
}

/** Deterministic geometry for the branching tree: terminals get equal slots. */
export function layoutTree(root: KeyNode): Layout {
  const nodes: LaidNode[] = [];
  let slot = 0;
  const place = (node: KeyNode, path: Side[], depth: number): number => {
    if (node.kind === 'group') {
      const x = slot + 0.5;
      slot += 1;
      nodes.push({
        path: [...path],
        x,
        depth,
        kind: node.cards.length === 1 ? 'leaf' : 'pile',
        cardIds: [...node.cards],
      });
      return x;
    }
    const xa = place(node.a, [...path, 'a'], depth + 1);
    const xb = place(node.b, [...path, 'b'], depth + 1);
    const x = (xa + xb) / 2;
    nodes.push({ path: [...path], x, depth, kind: 'fork', cardIds: cardsIn(node), mark: node.mark });
    return x;
  };
  place(root, [], 0);
  return { nodes, spread: Math.max(slot, 1), depth: longestRun(root) };
}

/* ---------------------------------------------------------------- sources -- */

export interface Card {
  readonly id: string;
  readonly label: string;
  /** Path under the site base; only ever shown in the page, never in the plate. */
  readonly art?: string;
  readonly emoji?: string;
  readonly tint?: string;
}

export type SourceId = 'accounts' | 'regions' | 'subjects' | 'plates' | 'faces' | 'things';

export interface SourceStamp {
  readonly id: SourceId;
  readonly title: string;
  readonly note: string;
}

export const SOURCE_STAMPS: readonly SourceStamp[] = [
  { id: 'accounts', title: 'The accounts', note: 'Covers from the stories, oldest to newest.' },
  { id: 'regions', title: 'The regions', note: 'One card for each part of the world.' },
  { id: 'subjects', title: 'The subjects', note: 'One card for each subject in the guide.' },
  { id: 'plates', title: 'The picture plates', note: 'Covers from the exercises.' },
  { id: 'faces', title: 'The faces', note: 'The portraits of feelings.' },
  { id: 'things', title: 'The things', note: 'Small drawn things from the loom.' },
];

export const TRAY_SIZES = [6, 8, 10, 12] as const;

/** Take `n` items spread evenly across a list. Deterministic, endpoints kept. */
export function pickSpread<T>(items: readonly T[], n: number): T[] {
  if (n <= 0 || items.length === 0) return [];
  if (n >= items.length) return [...items];
  if (n === 1) return [items[0]];
  const out: T[] = [];
  for (let i = 0; i < n; i += 1) out.push(items[Math.round((i * (items.length - 1)) / (n - 1))]);
  return out;
}

interface Specimen {
  readonly slug: string;
  readonly title: string;
  readonly domain: StoryDomain;
  readonly region: string;
  readonly year: number;
}

const SPECIMENS: readonly Specimen[] = STORIES
  .filter((s) => s.collection === 'historical' && Boolean(STORY_META[s.slug]))
  .map((s) => ({
    slug: s.slug,
    title: s.title,
    domain: s.domain,
    region: STORY_META[s.slug].region,
    year: STORY_META[s.slug].year,
  }))
  .sort((p, q) => p.year - q.year || p.slug.localeCompare(q.slug));

const PLATE_SLUGS = [
  'add-with-things', 'big-feelings', 'brave-feelings', 'build-the-number', 'calm-down',
  'color-match', 'compare-numbers', 'count-by-tens', 'count-with-rikki', 'doubles',
  'everyone-included', 'fraction-pizza', 'groups-of', 'halves-and-wholes', 'helping-hands',
  'how-many-groups', 'kind-friend', 'letter-land', 'making-friends', 'memory-pairs',
  'money-coins', 'name-the-feeling', 'number-bonds', 'number-line-jump', 'number-order',
  'odd-even', 'odd-one-out', 'opposites', 'pattern-parade', 'rhyme-time', 'saying-sorry',
  'scenes', 'shape-hunt', 'share-fairly', 'sharing-turns', 'skip-count', 'take-away',
  'telling-truth', 'ten-more-ten-less', 'tens-and-ones', 'times-tables', 'two-digit-add',
  'two-digit-subtract', 'whats-missing', 'which-has-more', 'win-or-lose',
] as const;

const FACE_NAMES = [
  'angry', 'annoyed', 'bored', 'calm', 'confident', 'confused', 'curious', 'delighted',
  'disappointed', 'embarrassed', 'excited', 'frustrated', 'grateful', 'happy', 'hopeful',
  'jealous', 'lonely', 'loved', 'nervous', 'overwhelmed', 'proud', 'sad', 'scared', 'shy',
  'silly', 'surprised', 'tired', 'worried',
] as const;

const sentence = (slug: string): string => {
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/** The earliest account for each bucket, so every card carries a picture. */
function earliestBy(pick: (s: Specimen) => string, keys: readonly string[]): Map<string, Specimen> {
  const found = new Map<string, Specimen>();
  for (const s of SPECIMENS) {
    const k = pick(s);
    if (keys.includes(k) && !found.has(k)) found.set(k, s);
  }
  return found;
}

/** The tray a stamp fills: 6 to 12 cards, always the same ones for the same ask. */
export function buildTray(source: SourceId, size: number): Card[] {
  switch (source) {
    case 'accounts':
      return pickSpread(SPECIMENS, size).map((s) => ({
        id: `acct:${s.slug}`,
        label: s.title,
        art: `art/${s.slug}/cover.png`,
      }));
    case 'regions': {
      const keys = Object.keys(REGION_COLOR);
      const found = earliestBy((s) => s.region, keys);
      const usable = keys.filter((k) => found.has(k));
      return pickSpread(usable, size).map((region) => ({
        id: `region:${region}`,
        label: region,
        art: `art/${found.get(region)?.slug ?? ''}/cover.png`,
        tint: REGION_COLOR[region],
      }));
    }
    case 'subjects': {
      const keys = Object.keys(CATEGORY_LABEL);
      const found = earliestBy((s) => s.domain, keys);
      const usable = keys.filter((k) => found.has(k));
      return pickSpread(usable, size).map((domain) => ({
        id: `subject:${domain}`,
        label: CATEGORY_LABEL[domain as StoryDomain],
        art: `art/${found.get(domain)?.slug ?? ''}/cover.png`,
      }));
    }
    case 'plates':
      return pickSpread(PLATE_SLUGS, size).map((slug) => ({
        id: `plate:${slug}`,
        label: sentence(slug),
        art: `games/covers/${slug}.png`,
      }));
    case 'faces':
      return pickSpread(FACE_NAMES, size).map((name) => ({
        id: `face:${name}`,
        label: sentence(name),
        art: `games/faces/${name}.png`,
      }));
    case 'things': {
      const things = INGREDIENTS.flatMap((g) => g.items);
      return pickSpread(things, size).map((t) => ({
        id: `thing:${t.label}`,
        label: sentence(t.label),
        emoji: t.emoji,
      }));
    }
  }
}

/**
 * The rack of contrast marks offered for a tray. It grows with the source,
 * because nine fixed pairs go coarse fast and say nothing about a face. The
 * plain mark is always last, and a grown-up may write words instead.
 */
export function rackFor(source: SourceId): Mark[] {
  switch (source) {
    case 'accounts':
    case 'regions':
    case 'subjects':
      return [...SHAPE_MARKS, ...WORLD_MARKS, PLAIN_MARK];
    case 'plates':
      return [...SHAPE_MARKS, WORLD_MARKS[2], FEELING_MARKS[2], PLAIN_MARK];
    case 'faces':
      return [...FEELING_MARKS, SHAPE_MARKS[1], SHAPE_MARKS[2], PLAIN_MARK];
    case 'things':
      return [...CREATURE_MARKS, ...SHAPE_MARKS, PLAIN_MARK];
  }
}
