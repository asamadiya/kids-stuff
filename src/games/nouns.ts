/**
 * The counting objects, as vetted records.
 *
 * Two separate defects produced this file. The first was a factual one: a round
 * in Take Away carried the glyph U+1F38E JAPANESE DOLLS while its noun read
 * "eggs", and because that glyph draws *two* figures a child counting the
 * picture counted eighteen where the sum said nine. The second was mechanical:
 * plurals were produced by string surgery — `` `${plateName}s` `` and
 * `itemName.replace(/s$/, '')` — which shipped "Give one strawberrie to each
 * bowl", "one candie" and "3 bunnys" into the rendered prompts.
 *
 * So a noun is now a record. `singular` and `plural` are both written out; no
 * code anywhere may append or strip an "s". `unicode` pins the glyph's Unicode
 * name, which is asserted in the tests: if the glyph is ever swapped, the pin
 * fails, which is precisely the check that would have caught the dolls.
 *
 * The register is deliberate. The previous item banks counted cookies, candies,
 * cupcakes, donuts, balloons, lollipops and pizza — the western-candy register
 * the guide exists to avoid. These are the things a field guide counts: seeds,
 * shells, bricks, spoons, keys, stones.
 */
export interface Noun {
  readonly singular: string;
  readonly plural: string;
  readonly glyph: string;
  /** The glyph's Unicode name, pinned so a swapped glyph fails the test. */
  readonly unicode: string;
}

const n = (singular: string, plural: string, glyph: string, unicode: string): Noun => ({
  singular,
  plural,
  glyph,
  unicode,
});

export const NOUNS = {
  seed: n('seed', 'seeds', '🌱', 'SEEDLING'),
  shell: n('shell', 'shells', '🐚', 'SPIRAL SHELL'),
  stone: n('stone', 'stones', '🪨', 'ROCK'),
  brick: n('brick', 'bricks', '🧱', 'BRICK'),
  spoon: n('spoon', 'spoons', '🥄', 'SPOON'),
  key: n('key', 'keys', '🔑', 'KEY'),
  leaf: n('leaf', 'leaves', '🍃', 'LEAF FLUTTERING IN WIND'),
  feather: n('feather', 'feathers', '🪶', 'FEATHER'),
  chestnut: n('chestnut', 'chestnuts', '🌰', 'CHESTNUT'),
  bolt: n('bolt', 'bolts', '🔩', 'NUT AND BOLT'),
  egg: n('egg', 'eggs', '🥚', 'EGG'),
  carrot: n('carrot', 'carrots', '🥕', 'CARROT'),
  sock: n('sock', 'socks', '🧦', 'SOCKS'),
  candle: n('candle', 'candles', '🕯️', 'CANDLE'),
  ruler: n('ruler', 'rulers', '📏', 'STRAIGHT RULER'),
  log: n('log', 'logs', '🪵', 'WOOD'),
} as const satisfies Record<string, Noun>;

export type NounId = keyof typeof NOUNS;

/** The containers things are shared onto. Same rules: both forms written out. */
export const VESSELS = {
  bowl: n('bowl', 'bowls', '🥣', 'BOWL WITH SPOON'),
  basket: n('basket', 'baskets', '🧺', 'BASKET'),
  bucket: n('bucket', 'buckets', '🪣', 'BUCKET'),
  jar: n('jar', 'jars', '🫙', 'JAR'),
  box: n('box', 'boxes', '📦', 'PACKAGE'),
  shelf: n('shelf', 'shelves', '🗄️', 'FILE CABINET'),
} as const satisfies Record<string, Noun>;

export type VesselId = keyof typeof VESSELS;

/** Count and noun agreeing, without string surgery at the call site. */
export function counted(count: number, noun: Noun): string {
  return `${count} ${count === 1 ? noun.singular : noun.plural}`;
}
