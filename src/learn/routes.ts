import type { ShelfId } from '../books/types';

/**
 * The route table for Rikki's Learning Center.
 *
 * Every destination is a function of the hash, as before: a hub that kept the
 * open game in component state would be a second source of truth the Back
 * button could not see. This replaces the old field-guide routes; the old
 * hashes are parsed and redirected (see `legacy`) so a bookmark never lands
 * on a blank page.
 */

export type Route =
  | { readonly kind: 'home' }
  | { readonly kind: 'stories' }
  | { readonly kind: 'shelf'; readonly shelf: ShelfId }
  | { readonly kind: 'book'; readonly slug: string; readonly page: number }
  | { readonly kind: 'library' }
  | { readonly kind: 'subject'; readonly subject: string }
  | { readonly kind: 'read'; readonly slug: string; readonly page: number }
  | { readonly kind: 'situation'; readonly id: string }
  | { readonly kind: 'maths' }
  | { readonly kind: 'mathsGame'; readonly id: string }
  | { readonly kind: 'science' }
  | { readonly kind: 'scienceGame'; readonly id: string }
  | { readonly kind: 'make' }
  | { readonly kind: 'activity'; readonly id: string }
  | { readonly kind: 'together' }
  | { readonly kind: 'idea'; readonly id: string }
  | { readonly kind: 'all' }
  | { readonly kind: 'langs' }
  | { readonly kind: 'langMoment'; readonly id: string }
  | { readonly kind: 'langRhyme'; readonly id: string }
  | { readonly kind: 'langBook'; readonly id: string; readonly page: number }
  | { readonly kind: 'langWords' }
  | { readonly kind: 'langGuide' }
  | { readonly kind: 'langRecord' };

export type RouteKind = Route['kind'];

/** Which part of the centre a route belongs to; `null` for home and the Everything index. */
export type Quadrant = 'stories' | 'maths' | 'science' | 'make' | 'together' | 'langs';

export const QUADRANT: Record<RouteKind, Quadrant | null> = {
  home: null,
  stories: 'stories',
  shelf: 'stories',
  book: 'stories',
  library: 'stories',
  subject: 'stories',
  read: 'stories',
  situation: 'stories',
  maths: 'maths',
  mathsGame: 'maths',
  science: 'science',
  scienceGame: 'science',
  make: 'make',
  activity: 'make',
  together: 'together',
  idea: 'together',
  all: null,
  langs: 'langs',
  langMoment: 'langs',
  langRhyme: 'langs',
  langBook: 'langs',
  langWords: 'langs',
  langGuide: 'langs',
  langRecord: 'langs',
};

/** Distance from home. Descending pushes a history entry; anything else replaces. */
export const DEPTH: Record<RouteKind, number> = {
  home: 0,
  stories: 1,
  maths: 1,
  science: 1,
  make: 1,
  together: 1,
  all: 1,
  langs: 1,
  shelf: 2,
  library: 2,
  mathsGame: 2,
  scienceGame: 2,
  activity: 2,
  idea: 2,
  langMoment: 2,
  langRhyme: 2,
  langBook: 2,
  langWords: 2,
  langGuide: 2,
  langRecord: 2,
  subject: 3,
  book: 3,
  situation: 3,
  read: 4,
};

export function toHash(route: Route): string {
  switch (route.kind) {
    case 'home':
      return '#/';
    case 'stories':
      return '#/stories';
    case 'shelf':
      return `#/stories/${route.shelf}`;
    case 'book':
      return `#/book/${route.slug}/${route.page + 1}`;
    case 'library':
      return '#/library';
    case 'subject':
      return `#/library/${route.subject}`;
    case 'read':
      return `#/read/${route.slug}/${route.page + 1}`;
    case 'situation':
      return `#/situation/${route.id}`;
    case 'maths':
      return '#/maths';
    case 'mathsGame':
      return `#/maths/${route.id}`;
    case 'science':
      return '#/science';
    case 'scienceGame':
      return `#/science/${route.id}`;
    case 'make':
      return '#/make';
    case 'activity':
      return `#/make/${route.id}`;
    case 'together':
      return '#/together';
    case 'idea':
      return `#/together/${route.id}`;
    case 'all':
      return '#/all';
    case 'langs':
      return '#/langs';
    case 'langMoment':
      return `#/langs/say/${route.id}`;
    case 'langRhyme':
      return `#/langs/rhyme/${route.id}`;
    case 'langBook':
      return `#/langs/book/${route.id}/${route.page + 1}`;
    case 'langWords':
      return '#/langs/words';
    case 'langGuide':
      return '#/langs/guide';
    case 'langRecord':
      return '#/langs/record';
  }
}

/**
 * Push on descent within one part of the centre, or out of home or the
 * Everything index (both open onto every part); replace otherwise.
 */
export function isDescent(from: Route, to: Route): boolean {
  if (DEPTH[to.kind] <= DEPTH[from.kind]) return false;
  const a = QUADRANT[from.kind];
  return a === null || a === QUADRANT[to.kind];
}

export interface Known {
  readonly shelves: ReadonlySet<string>;
  readonly books: ReadonlyMap<string, number>; // slug -> page count
  readonly subjects: ReadonlySet<string>;
  readonly archive: ReadonlyMap<string, number>; // slug -> page count
  readonly situations: ReadonlySet<string>;
  readonly maths: ReadonlySet<string>;
  readonly science: ReadonlySet<string>;
  readonly activities: ReadonlySet<string>;
  readonly ideas: ReadonlySet<string>;
  readonly moments: ReadonlySet<string>;
  readonly rhymes: ReadonlySet<string>;
  readonly langBooks: ReadonlyMap<string, number>; // id -> page count
}

function decode(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return undefined;
  }
}

function pageOf(raw: string | undefined, count: number): number {
  const n = Number.parseInt(raw ?? '1', 10);
  const zero = Number.isFinite(n) ? n - 1 : 0;
  // `count` is the end screen and is a legal destination.
  return Math.min(Math.max(0, zero), count);
}

/** Items whose id changed when the family was recast; an old link still opens them. */
const RENAMED_BOOKS: Readonly<Record<string, string>> = { 'i-want-papa-too': 'i-want-nanna-too' };
const RENAMED_GAMES: Readonly<Record<string, string>> = { 'share-the-roti': 'share-the-dosa' };
const RENAMED_IDEAS: Readonly<Record<string, string>> = { 'packing-for-jaipur': 'packing-for-chennai' };

/**
 * Parse a hash into the deepest route it really names. An unknown segment
 * falls back to the nearest real ancestor, never to a blank page.
 */
export function parseHash(rawHash: string, known: Known): Route {
  // A query (the old `?p=2` second page of shelves) is ignored: every listing is one page now.
  const [pathPart] = rawHash.replace(/^#/, '').split('?');
  const clean = pathPart.replace(/^\/+/, '').replace(/\/+$/, '');
  if (clean === '') return { kind: 'home' };
  const [head, a, b, c] = clean.split('/').map(decode);

  switch (head) {
    case 'stories': {
      if (a && known.shelves.has(a)) return { kind: 'shelf', shelf: a as ShelfId };
      return { kind: 'stories' };
    }
    case 'book': {
      const slug = a ? (RENAMED_BOOKS[a] ?? a) : a;
      const count = slug ? known.books.get(slug) : undefined;
      if (slug && count !== undefined) return { kind: 'book', slug, page: pageOf(b, count) };
      return { kind: 'stories' };
    }
    case 'library':
      if (a && known.subjects.has(a)) return { kind: 'subject', subject: a };
      return { kind: 'library' };
    case 'read': {
      const count = a ? known.archive.get(a) : undefined;
      if (a && count !== undefined) return { kind: 'read', slug: a, page: pageOf(b, count) };
      return { kind: 'library' };
    }
    case 'situation':
      if (a && known.situations.has(a)) return { kind: 'situation', id: a };
      return { kind: 'shelf', shelf: 'family' };
    case 'maths': {
      const id = a ? (RENAMED_GAMES[a] ?? a) : a;
      if (id && known.maths.has(id)) return { kind: 'mathsGame', id };
      return { kind: 'maths' };
    }
    case 'science':
      if (a && known.science.has(a)) return { kind: 'scienceGame', id: a };
      return { kind: 'science' };
    case 'make':
      if (a && known.activities.has(a)) return { kind: 'activity', id: a };
      return { kind: 'make' };
    case 'together': {
      const id = a ? (RENAMED_IDEAS[a] ?? a) : a;
      if (id && known.ideas.has(id)) return { kind: 'idea', id };
      return { kind: 'together' };
    }
    case 'all':
      return { kind: 'all' };
    case 'langs':
      if (a === 'say' && b && known.moments.has(b)) return { kind: 'langMoment', id: b };
      if (a === 'rhyme' && b && known.rhymes.has(b)) return { kind: 'langRhyme', id: b };
      if (a === 'book' && b && known.langBooks.has(b)) {
        return { kind: 'langBook', id: b, page: pageOf(c, known.langBooks.get(b)!) };
      }
      if (a === 'words') return { kind: 'langWords' };
      if (a === 'guide') return { kind: 'langGuide' };
      if (a === 'record') return { kind: 'langRecord' };
      return { kind: 'langs' };
    default:
      return legacy(head, a, known);
  }
}

/**
 * The old field-guide addresses. A shared link or a bookmark into the old site
 * lands somewhere sensible: a social exercise opens as a situation, the drill
 * games and instruments land on their new hub, the archive views land on the
 * library.
 */
function legacy(head: string | undefined, a: string | undefined, known: Known): Route {
  switch (head) {
    case 'shelf':
    case 'timeline':
    case 'map':
    case 'topic':
    case 'place':
      return { kind: 'library' };
    case 'play':
      if (a && known.situations.has(a)) return { kind: 'situation', id: a };
      return { kind: 'maths' };
    default:
      return { kind: 'home' };
  }
}

/** The shelf a book belongs to, for the back link; the reader asks the registry. */
export type ShelfOf = (slug: string) => ShelfId | undefined;

/** Where "back" goes from a route, as a hash and a label. */
export function parentOf(route: Route, shelfOf: ShelfOf, subjectOf: (slug: string) => string | undefined): { href: string; label: string } | null {
  switch (route.kind) {
    case 'home':
      return null;
    case 'stories':
    case 'maths':
    case 'science':
    case 'make':
    case 'together':
    case 'all':
    case 'langs':
      return { href: '#/', label: 'Home' };
    case 'shelf':
    case 'library':
      return { href: '#/stories', label: 'Stories' };
    case 'book': {
      const s = shelfOf(route.slug);
      return s ? { href: `#/stories/${s}`, label: 'Back to the shelf' } : { href: '#/stories', label: 'Stories' };
    }
    case 'subject':
      return { href: '#/library', label: 'The Big Library' };
    case 'read': {
      const s = subjectOf(route.slug);
      return s ? { href: `#/library/${s}`, label: 'Back to the library' } : { href: '#/library', label: 'The Big Library' };
    }
    case 'situation':
      return { href: '#/stories/family', label: 'Family & Friends' };
    case 'mathsGame':
      return { href: '#/maths', label: 'Maths' };
    case 'scienceGame':
      return { href: '#/science', label: 'Science' };
    case 'activity':
      return { href: '#/make', label: 'Make & Do' };
    case 'idea':
      return { href: '#/together', label: 'Play Together' };
    case 'langMoment':
    case 'langRhyme':
    case 'langBook':
    case 'langWords':
    case 'langGuide':
    case 'langRecord':
      return { href: '#/langs', label: 'Telugu & Tamil' };
  }
}
