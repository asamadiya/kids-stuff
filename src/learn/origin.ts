import type { Route } from './routes';
import { toHash } from './routes';

/**
 * Where an item was opened from, so its Back returns there (advisor q7
 * ruling 5; final review finding 4). Without this, Back from an activity
 * opened in a filtered Everything list went to Make & Do, and Back from a
 * play idea opened on home went to Play Together.
 *
 * Recorded per item in sessionStorage when the item is opened from a listing,
 * so a reload or a page turn inside a book keeps it. An item reached any
 * other way (a bookmark, a link inside another item) falls back to its
 * parent in the route table.
 */

export interface Origin {
  readonly href: string;
  readonly label: string;
}

const LABEL: Partial<Record<Route['kind'], string>> = {
  home: 'Home',
  all: 'Everything',
  stories: 'Stories',
  shelf: 'Back to the shelf',
  library: 'The Big Library',
  subject: 'Back to the library',
  maths: 'Maths',
  science: 'Science',
  make: 'Make & Do',
  together: 'Play Together',
  langs: 'Telugu & Tamil',
  langWords: 'Words',
};

/** The identity of the item a route shows, independent of the page it is on. */
export function itemKey(r: Route): string | null {
  switch (r.kind) {
    case 'book':
      return `book/${r.slug}`;
    case 'read':
      return `read/${r.slug}`;
    case 'situation':
      return `sel/${r.id}`;
    case 'mathsGame':
      return `maths/${r.id}`;
    case 'scienceGame':
      return `science/${r.id}`;
    case 'activity':
      return `make/${r.id}`;
    case 'idea':
      return `together/${r.id}`;
    case 'langMoment':
      return `langs/say/${r.id}`;
    case 'langRhyme':
      return `langs/rhyme/${r.id}`;
    case 'langBook':
      return `langs/book/${r.id}`;
    default:
      return null;
  }
}

const KEY = (item: string) => `rlc/origin/${item}`;

export function recordOrigin(from: Route, to: Route): void {
  const item = itemKey(to);
  const label = LABEL[from.kind];
  if (!item || !label) return;
  try {
    window.sessionStorage.setItem(KEY(item), JSON.stringify({ href: toHash(from), label }));
  } catch {
    /* private mode: Back uses the parent */
  }
}

export function originOf(r: Route): Origin | null {
  const item = itemKey(r);
  if (!item) return null;
  try {
    const raw = window.sessionStorage.getItem(KEY(item));
    return raw ? (JSON.parse(raw) as Origin) : null;
  } catch {
    return null;
  }
}
