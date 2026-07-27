/**
 * Where the right answer sits.
 *
 * Seven exercises put the correct button at the *same index in 100% of rounds*
 * — 99 rounds between them. Six got there the same way: build distractors as
 * `answer ± k`, then `.sort((a, b) => a - b)`. Sorting a symmetric set around
 * the answer pins the answer to the middle forever; a comment in one of them
 * claimed the sort made the answer "not always first", when in fact it made it
 * always second. The seventh, Two-Digit Addition, had hand-typed ascending
 * option arrays and no sort at all — so deleting sorts alone would not have
 * fixed it.
 *
 * A child does not need to do arithmetic to win a game whose answer is always
 * in slot 1. He needs to notice slot 1.
 *
 * The placement here is a seeded permutation keyed on `(gameId, roundIndex)`
 * only. It deliberately does **not** depend on the answer's value: any ordering
 * derived from the values leaks the answer's rank, which is the original bug in
 * a new costume. The permutation is deterministic, so rounds are stable across
 * reloads and snapshots.
 */

/** FNV-1a, 32-bit. Small, dependency-free, and well-spread for short keys. */
function hash(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 — a small deterministic PRNG seeded from the hash. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PlaceOptions<T> {
  readonly gameId: string;
  readonly roundIndex: number;
  readonly answer: T;
  /** Candidates in order of teaching value; the first `count - 1` usable ones are taken. */
  readonly distractors: readonly T[];
  /** Total options to show, including the answer. */
  readonly count: number;
}

/**
 * The answer plus its distractors, in an order that carries no information
 * about which is which.
 *
 * The answer's slot walks the positions with a stride coprime to the option
 * count, offset per game. That makes the distribution balanced *by
 * construction* — over any run of `count` consecutive rounds each slot is used
 * exactly once — rather than merely balanced on average, which a free shuffle
 * is not at fourteen rounds. Both the stride and the offset come from the game
 * id alone, so no property of the answer can influence where it lands.
 */
export function placeOptions<T>({ gameId, roundIndex, answer, distractors, count }: PlaceOptions<T>): T[] {
  const rest: T[] = [];
  for (const d of distractors) {
    if (rest.length >= count - 1) break;
    if (d !== answer && !rest.includes(d)) rest.push(d);
  }

  const size = rest.length + 1;
  const h = hash(gameId);
  // Strides coprime to `size` cycle through every slot before repeating.
  const strides: number[] = [];
  for (let s = 1; s < Math.max(2, size); s += 1) if (gcd(s, size) === 1) strides.push(s);
  const stride = strides.length ? strides[h % strides.length] : 1;
  const slot = (((h % size) + roundIndex * stride) % size + size) % size;

  // The distractors are then shuffled among the remaining positions, so their
  // order is not a stable tell either.
  const next = rng(hash(`${gameId}#${roundIndex}`));
  for (let i = rest.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  const out: T[] = [];
  let k = 0;
  for (let i = 0; i < size; i += 1) out.push(i === slot ? answer : rest[k++]);
  return out;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Where the answer landed. Exported so tests can measure slot distribution. */
export function answerSlot<T>(options: readonly T[], answer: T): number {
  return options.indexOf(answer);
}
