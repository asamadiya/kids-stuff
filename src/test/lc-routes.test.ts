import { describe, expect, it } from 'vitest';
import type { Known, Route } from '../learn/routes';
import { DEPTH, QUADRANT, isDescent, parseHash, toHash } from '../learn/routes';

/**
 * The route table, tested as a set of laws rather than a list of cases:
 * every route survives a round trip through its hash, unknown addresses land
 * on a real ancestor, and Back always leaves by the way you came in.
 */

const known: Known = {
  shelves: new Set(['family', 'tales', 'festivals', 'how', 'people']),
  books: new Map([['this-dinosaur-is-mine', 12]]),
  subjects: new Set(['numbers', 'measure']),
  archive: new Map([['aryabhata-circle-number', 13]]),
  situations: new Set(['what-happens-next']),
  maths: new Set(['make-both-sides-match']),
  science: new Set(['will-this-clay-boat-float']),
  activities: new Set(['paper-boat']),
  ideas: new Set(['sock-wrestle']),
};

const EVERY: readonly Route[] = [
  { kind: 'home' },
  { kind: 'stories' },
  { kind: 'shelf', shelf: 'tales' },
  { kind: 'book', slug: 'this-dinosaur-is-mine', page: 0 },
  { kind: 'book', slug: 'this-dinosaur-is-mine', page: 12 },
  { kind: 'library' },
  { kind: 'subject', subject: 'measure' },
  { kind: 'read', slug: 'aryabhata-circle-number', page: 4 },
  { kind: 'situation', id: 'what-happens-next' },
  { kind: 'maths' },
  { kind: 'mathsGame', id: 'make-both-sides-match' },
  { kind: 'science' },
  { kind: 'scienceGame', id: 'will-this-clay-boat-float' },
  { kind: 'make' },
  { kind: 'activity', id: 'paper-boat' },
  { kind: 'together' },
  { kind: 'idea', id: 'sock-wrestle' },
  { kind: 'all' },
];

describe('routes', () => {
  it.each(EVERY.map((r) => [toHash(r), r] as const))('%s round-trips', (hash, route) => {
    expect(parseHash(hash, known)).toEqual(route);
  });

  it('covers every route kind in the round-trip table', () => {
    const kinds = new Set(EVERY.map((r) => r.kind));
    expect([...kinds].sort()).toEqual(Object.keys(DEPTH).sort());
  });

  it.each([
    ['#/maths/no-such-game', { kind: 'maths' }],
    ['#/book/no-such-book/3', { kind: 'stories' }],
    ['#/read/no-such-story', { kind: 'library' }],
    ['#/stories/no-such-shelf', { kind: 'stories' }],
    ['#/situation/nope', { kind: 'shelf', shelf: 'family' }],
    ['#/nonsense', { kind: 'home' }],
    ['#/together/no-such-idea', { kind: 'together' }],
    ['#/all/anything', { kind: 'all' }],
    ['#/book/this-dinosaur-is-mine/999', { kind: 'book', slug: 'this-dinosaur-is-mine', page: 12 }],
    ['#/book/this-dinosaur-is-mine/-4', { kind: 'book', slug: 'this-dinosaur-is-mine', page: 0 }],
    ['#/book/%E0%A4', { kind: 'stories' }],
    ['#/stories?p=2', { kind: 'stories' }],
  ])('%s canonicalises to a real ancestor', (hash, route) => {
    expect(parseHash(hash, known)).toEqual(route);
  });

  it.each([
    ['#/shelf', { kind: 'library' }],
    ['#/timeline', { kind: 'library' }],
    ['#/topic/numbers', { kind: 'library' }],
    ['#/place/south-asia', { kind: 'library' }],
    ['#/play', { kind: 'maths' }],
    ['#/play/tens-and-ones', { kind: 'maths' }],
    ['#/play/what-happens-next', { kind: 'situation', id: 'what-happens-next' }],
  ])('old address %s still lands somewhere sensible', (hash, route) => {
    expect(parseHash(hash, known)).toEqual(route);
  });

  it('pushes history only when going deeper inside one part of the centre', () => {
    const home: Route = { kind: 'home' };
    const maths: Route = { kind: 'maths' };
    const game: Route = { kind: 'mathsGame', id: 'make-both-sides-match' };
    const book: Route = { kind: 'book', slug: 'this-dinosaur-is-mine', page: 0 };
    const page2: Route = { kind: 'book', slug: 'this-dinosaur-is-mine', page: 1 };
    expect(isDescent(home, maths)).toBe(true);
    expect(isDescent(maths, game)).toBe(true);
    expect(isDescent(game, maths)).toBe(false);
    // a page turn never adds a history entry: Back leaves the book
    expect(isDescent(book, page2)).toBe(false);
    // crossing from one part of the centre to another replaces
    expect(isDescent(game, { kind: 'shelf', shelf: 'tales' })).toBe(false);
  });

  it('puts every route in exactly one part, except home and the Everything index', () => {
    for (const r of EVERY) {
      expect(QUADRANT[r.kind] === null).toBe(r.kind === 'home' || r.kind === 'all');
    }
  });

  it('pushes history when opening anything from the Everything index', () => {
    const all: Route = { kind: 'all' };
    expect(isDescent(all, { kind: 'mathsGame', id: 'make-both-sides-match' })).toBe(true);
    expect(isDescent(all, { kind: 'idea', id: 'sock-wrestle' })).toBe(true);
    expect(isDescent({ kind: 'home' }, all)).toBe(true);
  });
});
