/**
 * Food science: what food is actually made of, and what each part does once it
 * is inside you.
 *
 * This is a bench, not a wellness lesson. Nothing here is scored, nothing is
 * ranked, and no food is called good or bad. The instrument states quantities
 * and mechanisms and stops. What he does with that is his business.
 *
 * The house is ovo-lacto-vegetarian: eggs and dairy yes, meat and fish never.
 * Every record below is a plant, an egg, or milk in one of its forms.
 *
 * Three things are computed rather than asserted, because a claim a person has
 * to keep in step with a table is a claim that goes wrong:
 *
 *   1. Complementary protein. Each protein food carries the essential amino
 *      acids it is SHORT of. Whether a plate is short of anything is the
 *      intersection of those lists — so "beans and rice together" is a result,
 *      not a sentence someone typed. Two pulses on one plate stay short of
 *      methionine, and the instrument says so, because the intersection says so.
 *   2. The readout. Every number is summed from the food table. Nothing is
 *      written twice.
 *   3. The egg plate. The drawing, the hit test and the leader lines all come
 *      out of one set of parameters, so a label cannot point at the wrong part
 *      of the egg. That failure has shipped here before.
 *
 * Pure module: no React, no DOM, no randomness.
 */
import { counted, type Noun } from './nouns';

export const FOOD_SCIENCE_META = {
  id: 'food-science',
  title: 'What Food Is Made Of',
  icon: '',
  color: 'leaf',
  eyebrow: 'Food science',
  tagline: 'Take an egg apart, set milk into curd, and build a plate that reads back what it supplies.',
  note: 'Take an egg apart, set milk into curd, and build a plate that reads back what it supplies.',
} as const;

/* --------------------------------------------------------------- nutrients */

export type NutrientKey = 'protein' | 'fibre' | 'fat' | 'calcium' | 'iron' | 'vitaminC';

export interface Nutrient {
  readonly key: NutrientKey;
  readonly name: string;
  /** What it does in the body. A mechanism, not advice. */
  readonly does: string;
  readonly unit: 'g' | 'mg';
  /** Colour identifies the row on the plate; it never decorates. */
  readonly color: string;
}

export const NUTRIENT_KEYS: readonly NutrientKey[] = [
  'protein', 'fibre', 'fat', 'calcium', 'iron', 'vitaminC',
];

export const NUTRIENTS: Readonly<Record<NutrientKey, Nutrient>> = {
  protein: {
    key: 'protein',
    name: 'Protein',
    does: 'Taken apart into building blocks, then built back up into muscle, skin, hair and the parts of blood.',
    unit: 'g',
    color: '#9e4b27',
  },
  fibre: {
    key: 'fibre',
    name: 'Fibre',
    does: 'The part the body cannot digest. It passes through whole, gives the gut something to push against, and feeds the bacteria living in the large intestine.',
    unit: 'g',
    color: '#55632f',
  },
  fat: {
    key: 'fat',
    name: 'Fat',
    does: 'Builds the brain, which is about three-fifths fat once the water is out; keeps heat in; stores energy; and carries vitamins A, D, E and K, which dissolve in fat and in nothing else.',
    unit: 'g',
    color: '#8a6416',
  },
  calcium: {
    key: 'calcium',
    name: 'Calcium',
    does: 'The mineral bones and teeth are built from. Muscles also need it to contract, including the heart.',
    unit: 'mg',
    color: '#3c566f',
  },
  iron: {
    key: 'iron',
    name: 'Iron',
    does: 'Sits at the centre of haemoglobin, the molecule in red blood cells that picks up oxygen in the lungs and lets go of it everywhere else.',
    unit: 'mg',
    color: '#2a5957',
  },
  vitaminC: {
    key: 'vitaminC',
    name: 'Vitamin C',
    does: 'Needed to make collagen, the rope the body ties itself together with. It also changes the iron in plants into a form the gut can take up.',
    unit: 'mg',
    color: '#6b6757',
  },
};

/* ------------------------------------------------------- the building blocks */

/**
 * The three essential amino acids that decide whether a vegetarian plate is
 * short of anything. There are nine essential ones in all; these three are the
 * ones a pulse or a grain actually runs low on, so they are the ones that
 * matter when the plate is put together.
 */
export type AminoKey = 'lysine' | 'methionine' | 'tryptophan';

export interface Amino {
  readonly key: AminoKey;
  readonly name: string;
  readonly note: string;
}

export const AMINO_KEYS: readonly AminoKey[] = ['lysine', 'methionine', 'tryptophan'];

export const AMINOS: Readonly<Record<AminoKey, Amino>> = {
  lysine: {
    key: 'lysine',
    name: 'lysine',
    note: 'Grains are short of it. Pulses carry plenty.',
  },
  methionine: {
    key: 'methionine',
    name: 'methionine',
    note: 'Pulses are short of it. Grains, eggs and dairy carry plenty.',
  },
  tryptophan: {
    key: 'tryptophan',
    name: 'tryptophan',
    note: 'Maize is short of it. Beans and dairy carry plenty.',
  },
};

/* ------------------------------------------------------------- the food table */

export type FoodGroup = 'pulse' | 'grain' | 'dairy' | 'egg' | 'nut' | 'vegetable' | 'fruit' | 'fat';

/** The groups the building-block check reads. Fruit and vegetables sit it out. */
export const PROTEIN_GROUPS: readonly FoodGroup[] = ['pulse', 'grain', 'dairy', 'egg', 'nut'];

/**
 * A food is a `Noun` — both word forms written out, the glyph's Unicode name
 * pinned — plus a measured serving and what that serving supplies. The pin is
 * what catches a swapped glyph: a two-figure glyph once drew eighteen dolls for
 * nine eggs elsewhere in this guide.
 */
export interface Food extends Noun {
  readonly id: string;
  readonly group: FoodGroup;
  /** The serving the numbers below are measured on. */
  readonly serving: string;
  readonly per: Readonly<Record<NutrientKey, number>>;
  /**
   * Essential amino acids this food runs short of; `null` when it is not one of
   * the foods the building-block check reads.
   */
  readonly limiting: readonly AminoKey[] | null;
  /** One fact about the food itself. Not a recommendation. */
  readonly fact: string;
}

const food = (
  id: string,
  singular: string,
  plural: string,
  glyph: string,
  unicode: string,
  group: FoodGroup,
  serving: string,
  per: Record<NutrientKey, number>,
  limiting: readonly AminoKey[] | null,
  fact: string,
): Food => ({ id, singular, plural, glyph, unicode, group, serving, per, limiting, fact });

const nut = (
  protein: number, fibre: number, fat: number, calcium: number, iron: number, vitaminC: number,
): Record<NutrientKey, number> => ({ protein, fibre, fat, calcium, iron, vitaminC });

/**
 * Amounts are rounded from published food-composition tables and are stated as
 * approximate everywhere they are shown. They are here so he can add them up,
 * not so anyone can hit a target.
 */
export const FOODS: readonly Food[] = [
  food('egg', 'egg', 'eggs', '🥚', 'EGG', 'egg', 'one, 50 g',
    nut(6.3, 0, 5, 25, 0.9, 0), [],
    'Carries all nine essential building blocks, which is why it is the yardstick other protein foods are measured against.'),
  food('milk', 'glass of milk', 'glasses of milk', '🥛', 'GLASS OF MILK', 'dairy', 'one cup, 240 ml',
    nut(8, 0, 8, 300, 0, 0), [],
    'About seven-eighths water. The rest is protein, fat, sugar (lactose) and minerals.'),
  food('curd', 'pot of curd', 'pots of curd', '🫙', 'JAR', 'dairy', 'one cup, 245 g',
    nut(9, 0, 8, 300, 0.1, 1), [],
    'Milk that has been set by acid. The bacteria that make the acid are still alive in it.'),
  food('cheese', 'piece of cheese', 'pieces of cheese', '🧀', 'CHEESE WEDGE', 'dairy', '30 g of paneer or hard cheese',
    nut(7, 0, 9, 200, 0.1, 0), [],
    'Curd with most of the whey pressed out, so everything left is concentrated about tenfold.'),
  food('rajma', 'bowl of rajma', 'bowls of rajma', '🫘', 'BEANS', 'pulse', 'one cup cooked, 175 g',
    nut(15, 13, 0.5, 60, 4, 2), ['methionine'],
    'Kidney beans. The skin holds most of the fibre, so they are cooked with the skin on.'),
  food('dal', 'bowl of dal', 'bowls of dal', '🥣', 'BOWL WITH SPOON', 'pulse', 'one cup cooked, 200 g',
    nut(18, 16, 0.8, 38, 6.6, 3), ['methionine'],
    'Lentils. They carry more iron for their weight than almost anything else on this table.'),
  food('rice', 'bowl of rice', 'bowls of rice', '🍚', 'COOKED RICE', 'grain', 'one cup cooked, 160 g',
    nut(4, 0.6, 0.4, 16, 0.2, 0), ['lysine'],
    'White rice has had the bran polished off, and the bran is where the fibre was.'),
  food('roti', 'roti', 'rotis', '🫓', 'FLATBREAD', 'grain', 'one, 40 g of whole wheat',
    nut(4, 3, 1, 10, 1.2, 0), ['lysine'],
    'Whole wheat keeps its bran, so one roti carries about five times the fibre of a cup of white rice.'),
  food('maize', 'ear of maize', 'ears of maize', '🌽', 'EAR OF MAIZE', 'grain', 'one ear, 90 g',
    nut(3, 2, 1.5, 2, 0.5, 7), ['lysine', 'tryptophan'],
    'Short of two blocks rather than one, which is why maize has been eaten with beans for four thousand years in Mexico.'),
  food('peanuts', 'handful of peanuts', 'handfuls of peanuts', '🥜', 'PEANUTS', 'nut', '30 g',
    nut(7.5, 2.5, 14, 26, 1.3, 0), ['methionine'],
    'Not a nut at all. Peanuts are a pulse that ripens underground, and they run short of the same block beans do.'),
  food('avocado', 'half an avocado', 'halves of avocado', '🥑', 'AVOCADO', 'fat', 'half, 100 g',
    nut(2, 7, 15, 12, 0.6, 10), null,
    'One of the few fruits built mostly of fat instead of sugar.'),
  food('oliveoil', 'spoon of olive oil', 'spoons of olive oil', '🫒', 'OLIVE', 'fat', 'one tablespoon, 14 g',
    nut(0, 0, 14, 0, 0.1, 0), null,
    'Pressed straight out of the fruit, so it is fat and almost nothing else.'),
  food('ghee', 'spoon of ghee', 'spoons of ghee', '🧈', 'BUTTER', 'fat', 'one teaspoon, 5 g',
    nut(0, 0, 5, 1, 0, 0), null,
    'Butter boiled until the water steams off and the milk solids are strained out, which is why it keeps without a fridge.'),
  food('spinach', 'bowl of spinach', 'bowls of spinach', '🥬', 'LEAFY GREEN', 'vegetable', 'one cup cooked, 180 g',
    nut(5, 4, 0.5, 245, 6.4, 18), null,
    'Full of iron and calcium, though the oxalic acid in the leaf locks some of both away from the gut.'),
  food('broccoli', 'head of broccoli', 'heads of broccoli', '🥦', 'BROCCOLI', 'vegetable', 'one cup cooked, 155 g',
    nut(4, 5, 0.6, 62, 1, 100), null,
    'A cup carries more vitamin C than an orange does.'),
  food('carrot', 'carrot', 'carrots', '🥕', 'CARROT', 'vegetable', 'one, 60 g',
    nut(0.6, 1.7, 0.1, 20, 0.2, 4), null,
    'The orange is beta-carotene, which the body cuts in half to make vitamin A. It only crosses into the body with fat.'),
  food('potato', 'potato', 'potatoes', '🥔', 'POTATO', 'vegetable', 'one medium, 170 g, skin on',
    nut(4.3, 4, 0.2, 26, 1.9, 20), null,
    'Most of the fibre is in the skin. Peel it and about half the fibre goes in the bin.'),
  food('apple', 'apple', 'apples', '🍎', 'RED APPLE', 'fruit', 'one medium, 180 g',
    nut(0.5, 4.4, 0.3, 11, 0.2, 8), null,
    'The fibre is pectin, the same stuff that makes jam set.'),
  food('orange', 'orange', 'oranges', '🍊', 'TANGERINE', 'fruit', 'one medium, 130 g',
    nut(1.2, 3, 0.2, 52, 0.1, 70), null,
    'Sailors worked out four hundred years ago that citrus stopped scurvy, two centuries before anyone knew vitamin C existed.'),
  food('lemon', 'lemon', 'lemons', '🍋', 'LEMON', 'fruit', 'the juice of one, 45 ml',
    nut(0.1, 0.1, 0, 3, 0, 19), null,
    'Sour because of citric acid, which is strong enough to set a pan of milk into curd.'),
];

export const foodById = (id: string): Food | null => FOODS.find((f) => f.id === id) ?? null;

/** The food table, in the order the shelves are drawn. */
export const FOOD_GROUPS: readonly { readonly key: FoodGroup; readonly title: string }[] = [
  { key: 'pulse', title: 'Pulses' },
  { key: 'grain', title: 'Grains' },
  { key: 'egg', title: 'Eggs' },
  { key: 'dairy', title: 'Milk and what is made from it' },
  { key: 'nut', title: 'Nuts' },
  { key: 'fat', title: 'Fats' },
  { key: 'vegetable', title: 'Vegetables' },
  { key: 'fruit', title: 'Fruit' },
];

export const foodsInGroup = (group: FoodGroup): readonly Food[] => FOODS.filter((f) => f.group === group);

/* ---------------------------------------------------------------- the plate */

/** A plate is a list of food ids with how many servings of each. */
export type Plate = Readonly<Record<string, number>>;

export const EMPTY_PLATE: Plate = {};

/** Put one more serving on, or take the last one off when `by` is negative. */
export function serve(plate: Plate, id: string, by = 1): Plate {
  if (!foodById(id)) return plate;
  const next: Record<string, number> = { ...plate };
  const now = Math.max(0, (next[id] ?? 0) + by);
  if (now === 0) delete next[id];
  else next[id] = Math.min(9, now);
  return next;
}

export function clearPlate(): Plate {
  return EMPTY_PLATE;
}

export interface Serving {
  readonly food: Food;
  readonly servings: number;
}

/** What is on the plate, in table order, so the same plate always reads the same. */
export function servingsOn(plate: Plate): readonly Serving[] {
  return FOODS.filter((f) => (plate[f.id] ?? 0) > 0).map((f) => ({ food: f, servings: plate[f.id] }));
}

export const plateSize = (plate: Plate): number =>
  servingsOn(plate).reduce((n, s) => n + s.servings, 0);

/** Every number on the readout is summed from the table. Nothing is written twice. */
export function plateTotals(plate: Plate): Readonly<Record<NutrientKey, number>> {
  const totals: Record<NutrientKey, number> = {
    protein: 0, fibre: 0, fat: 0, calcium: 0, iron: 0, vitaminC: 0,
  };
  for (const { food: f, servings } of servingsOn(plate)) {
    for (const key of NUTRIENT_KEYS) totals[key] += f.per[key] * servings;
  }
  for (const key of NUTRIENT_KEYS) totals[key] = Math.round(totals[key] * 10) / 10;
  return totals;
}

/** Which foods on the plate carry most of one nutrient. Derived, never listed. */
export function topSources(plate: Plate, key: NutrientKey, howMany = 3): readonly Serving[] {
  return servingsOn(plate)
    .filter((s) => s.food.per[key] * s.servings > 0)
    .slice()
    .sort((a, b) =>
      b.food.per[key] * b.servings - a.food.per[key] * a.servings ||
      (a.food.id < b.food.id ? -1 : a.food.id > b.food.id ? 1 : 0))
    .slice(0, howMany);
}

/** How much of one nutrient a serving of a food contributes to this plate. */
export const contribution = (s: Serving, key: NutrientKey): number =>
  Math.round(s.food.per[key] * s.servings * 10) / 10;

/* ------------------------------------------- the building-block check */

export interface BlockGap {
  readonly amino: AminoKey;
  /** Foods already on the plate that could fill it, if any are. */
  readonly filledBy: readonly Food[];
}

export interface BlockCheck {
  /** The foods on the plate the check reads. */
  readonly proteinFoods: readonly Food[];
  /** Blocks every protein food on the plate is short of. Empty means nothing is missing. */
  readonly missing: readonly AminoKey[];
  /** Which food covered which other food's gap. Derived from the same lists. */
  readonly covered: readonly BlockGap[];
  readonly complete: boolean;
}

/**
 * A plate is short of a building block only when EVERY protein food on it is
 * short of that block. That is an intersection, so the famous pairings fall out
 * of the table instead of being typed into it: rajma is short of methionine and
 * rice is short of lysine, so together they are short of nothing. Two pulses
 * are both short of methionine, so together they are still short of methionine
 * — and this says so, which a hand-written rule about "beans and rice" would
 * not.
 */
export function blockCheck(plate: Plate): BlockCheck {
  const proteinFoods = servingsOn(plate)
    .map((s) => s.food)
    .filter((f) => f.limiting !== null && PROTEIN_GROUPS.includes(f.group));
  if (proteinFoods.length === 0) {
    return { proteinFoods, missing: [], covered: [], complete: false };
  }
  const missing = AMINO_KEYS.filter((a) => proteinFoods.every((f) => (f.limiting ?? []).includes(a)));
  const covered: BlockGap[] = [];
  for (const amino of AMINO_KEYS) {
    if (missing.includes(amino)) continue;
    const shortOf = proteinFoods.filter((f) => (f.limiting ?? []).includes(amino));
    if (shortOf.length === 0) continue;
    covered.push({
      amino,
      filledBy: proteinFoods.filter((f) => !(f.limiting ?? []).includes(amino)),
    });
  }
  return { proteinFoods, missing, covered, complete: missing.length === 0 };
}

/** The foods elsewhere on the table that would fill a gap this plate still has. */
export function fillersFor(amino: AminoKey): readonly Food[] {
  return FOODS.filter((f) => f.limiting !== null && !f.limiting.includes(amino));
}

/* ------------------------------------------------------- what works together */

export interface Pairing {
  readonly id: string;
  /** Reads the totals, so it fires on the plate as built rather than on a named recipe. */
  readonly when: (totals: Readonly<Record<NutrientKey, number>>) => boolean;
  readonly line: string;
}

export const PAIRINGS: readonly Pairing[] = [
  {
    id: 'iron-and-c',
    when: (t) => t.iron >= 1 && t.vitaminC >= 10,
    line: 'Iron and vitamin C are on the same plate. The vitamin C turns the iron in the plants into the form the gut can take up, and it only works when the two are eaten together.',
  },
  {
    id: 'fat-and-carotene',
    when: (t) => t.fat >= 3 && t.vitaminC >= 3,
    line: 'There is fat here. Vitamins A, D, E and K dissolve in fat and in nothing else, so on a plate with no fat at all they stay in the gut and pass through.',
  },
  {
    id: 'calcium-load',
    when: (t) => t.calcium >= 300,
    line: 'Three hundred milligrams of calcium is roughly what a cup of milk carries. Bone is rebuilt continuously, and this is the material it is rebuilt from.',
  },
  {
    id: 'fibre-load',
    when: (t) => t.fibre >= 10,
    line: 'Ten grams of fibre and none of it will be digested. It arrives in the large intestine intact and is eaten there by bacteria instead.',
  },
];

export function pairingsFor(plate: Plate): readonly Pairing[] {
  const totals = plateTotals(plate);
  return PAIRINGS.filter((p) => p.when(totals));
}

/* -------------------------------------------------------------- the readout */

const amount = (value: number, key: NutrientKey): string =>
  `${Number.isInteger(value) ? value : value.toFixed(1)} ${NUTRIENTS[key].unit}`;

/** A list read out in words, without appending letters to anything. */
export function listWords(items: readonly string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** One line per nutrient: the amount, what it does, and what on this plate carries it. */
export function nutrientLines(plate: Plate): readonly string[] {
  const totals = plateTotals(plate);
  return NUTRIENT_KEYS.map((key) => {
    const sources = topSources(plate, key).map((s) => `${s.food.singular}, ${amount(contribution(s, key), key)}`);
    const from = sources.length ? ` From ${listWords(sources)}.` : '';
    return `${NUTRIENTS[key].name}, about ${amount(totals[key], key)}. ${NUTRIENTS[key].does}${from}`;
  });
}

/** The building-block sentence, derived from `blockCheck` and from nothing else. */
export function blockLine(plate: Plate): string {
  const check = blockCheck(plate);
  if (check.proteinFoods.length === 0) {
    return 'No pulse, grain, egg, nut or dairy here, so there is nothing on the plate carrying the nine building blocks protein is made of.';
  }
  if (check.complete) {
    const covers = check.covered.map(
      (gap) => `${listWords(gap.filledBy.map((f) => f.singular))} covers the ${AMINOS[gap.amino].name} that the rest is short of`,
    );
    const how = covers.length ? ` ${listWords(covers)}.` : '';
    return `All nine building blocks are here.${how}`;
  }
  const short = listWords(check.missing.map((a) => AMINOS[a].name));
  const fillers = listWords(
    check.missing
      .flatMap((a) => fillersFor(a).slice(0, 2))
      .filter((f, i, all) => all.findIndex((o) => o.id === f.id) === i)
      .map((f) => f.singular),
  );
  return `Everything protein-carrying on this plate is short of the same block: ${short}. ${fillers} would bring it.`;
}

/** The whole readout. States quantities and mechanisms; ranks nothing. */
export function plateLines(plate: Plate): readonly string[] {
  const on = servingsOn(plate);
  if (on.length === 0) return ['Nothing on the plate yet.'];
  const what = listWords(on.map((s) => counted(s.servings, s.food)));
  return [
    `On the plate: ${what}.`,
    ...nutrientLines(plate),
    blockLine(plate),
    ...pairingsFor(plate).map((p) => p.line),
  ];
}

/** One line for the caption block on the printed plate. */
export function plateSummary(plate: Plate): string {
  const totals = plateTotals(plate);
  const size = plateSize(plate);
  if (size === 0) return 'Nothing on the plate yet.';
  const parts = NUTRIENT_KEYS.map((k) => `${NUTRIENTS[k].name.toLowerCase()} ${amount(totals[k], k)}`);
  return `${size === 1 ? '1 serving' : `${size} servings`}: ${parts.join(', ')}.`;
}

/* ------------------------------------------------------------- the egg plate */

export interface Vec {
  readonly x: number;
  readonly y: number;
}

/**
 * One set of parameters. The outline, every part's hit test, every leader line
 * and the paint order are all read off these numbers, so no two of them can
 * drift apart. The last release in this repo shipped hand-typed label positions
 * over a drawing they did not belong to; that is unrepresentable here.
 *
 * The shell is drawn about six times thicker than a real one, which is stated
 * on the plate rather than quietly fudged.
 */
export const EGG = {
  view: { w: 760, h: 460 },
  cx: 300,
  cy: 236,
  /** Half-width, and half-height before the taper. */
  a: 118,
  b: 158,
  /** How much blunter the top is than the bottom. A hen egg is markedly asymmetric. */
  k: 0.2,
  /** The inner surface of the shell, as a fraction of the outline. */
  shellInner: 0.94,
  /** The air cell fills the inner egg above this line. */
  airY: 118,
  yolkR: 62,
  chalazaR: 7,
  /** How far up and down the cords reach, as a fraction of b. */
  chalazaReach: 0.66,
  labelLeftX: 34,
  labelRightX: 726,
} as const;

/**
 * The egg's radius at an angle measured from straight up, so 0 is the blunt end
 * and pi is the point. An ellipse stretched by a cosine taper: even in the
 * angle, closed form, and the only description of the outline that exists.
 */
export function eggRadius(phi: number): number {
  const s = Math.sin(phi);
  const c = Math.cos(phi);
  const ellipse = (EGG.a * EGG.b) / Math.sqrt(EGG.b * EGG.b * s * s + EGG.a * EGG.a * c * c);
  return ellipse * (1 + EGG.k * c);
}

export const angleAt = (p: Vec): number => Math.atan2(p.x - EGG.cx, EGG.cy - p.y);
export const distanceFromCentre = (p: Vec): number => Math.hypot(p.x - EGG.cx, p.y - EGG.cy);

/** A point on the outline scaled by `scale`; `scale = 1` is the shell's outside. */
export function pointOn(phi: number, scale = 1): Vec {
  const r = eggRadius(phi) * scale;
  return { x: EGG.cx + r * Math.sin(phi), y: EGG.cy - r * Math.cos(phi) };
}

/** Inside the outline scaled by `scale`. The same radius function that paints it. */
export const insideAt = (p: Vec, scale = 1): boolean =>
  distanceFromCentre(p) <= eggRadius(angleAt(p)) * scale;

const svgPath = (points: readonly Vec[], close = true): string => {
  const at = (v: Vec): string => `${Math.round(v.x * 100) / 100} ${Math.round(v.y * 100) / 100}`;
  const [head, ...rest] = points;
  return `M${at(head)}${rest.map((p) => `L${at(p)}`).join('')}${close ? 'Z' : ''}`;
};

export const OUTLINE_STEPS = 180;

export function eggOutline(scale = 1, steps = OUTLINE_STEPS): readonly Vec[] {
  return Array.from({ length: steps }, (_, i) => pointOn((i * 2 * Math.PI) / steps, scale));
}

export const eggOutlinePath = (scale = 1): string => svgPath(eggOutline(scale));

/** Shell as an annulus: outside then inside, filled with fill-rule evenodd. */
export const shellPath = (): string => `${eggOutlinePath(1)}${eggOutlinePath(EGG.shellInner)}`;

/** The angle at which the inner outline crosses a horizontal line, by bisection. */
function angleAtHeight(y: number, scale: number): number {
  let low = 0;
  let high = Math.PI;
  for (let i = 0; i < 60; i += 1) {
    const mid = (low + high) / 2;
    if (pointOn(mid, scale).y < y) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

/** The air cell: the cap of the inner egg above `EGG.airY`, closed with its chord. */
export function airCellPath(): string {
  const edge = angleAtHeight(EGG.airY, EGG.shellInner);
  const steps = 48;
  const arc = Array.from({ length: steps + 1 }, (_, i) =>
    pointOn(-edge + (i * 2 * edge) / steps, EGG.shellInner));
  return svgPath(arc);
}

const distanceToSegment = (p: Vec, a: Vec, b: Vec): number => {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len2 = vx * vx + vy * vy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
};

/**
 * The two cords. They leave opposite sides of the yolk and wind away toward
 * opposite ends, which is what they do in an egg and what makes them read as
 * two twisted ropes rather than one rod through the middle. Each is a short
 * polyline; the drawing strokes it round-capped at width 2 * chalazaR, and the
 * hit test is the capsule around the same segments, so the ink and the claim
 * are the same object.
 */
function cord(dir: 1 | -1): readonly Vec[] {
  const side = -dir; // the upper cord leans left, the lower one right
  const lean = 0.55; // radians from vertical where it leaves the yolk
  return [
    { x: EGG.cx + side * EGG.yolkR * Math.sin(lean), y: EGG.cy + dir * EGG.yolkR * Math.cos(lean) },
    { x: EGG.cx + side * 9, y: EGG.cy + dir * 0.46 * EGG.b },
    { x: EGG.cx + side * 22, y: EGG.cy + dir * 0.57 * EGG.b },
    { x: EGG.cx + side * 10, y: EGG.cy + dir * EGG.chalazaReach * EGG.b },
  ];
}

export const CHALAZA_CORDS: readonly (readonly Vec[])[] = [cord(-1), cord(1)];

export const CHALAZA_SEGMENTS: readonly (readonly [Vec, Vec])[] = CHALAZA_CORDS.flatMap((c) =>
  c.slice(1).map((p, i) => [c[i], p] as const));

export type EggPartId = 'air' | 'yolk' | 'chalaza' | 'white' | 'shell';

export interface EggPart {
  readonly id: EggPartId;
  readonly label: string;
  /** What the part is and what it is for. Fact, not advice. */
  readonly what: string;
  readonly color: string;
  readonly side: 'left' | 'right';
  /** Claims a point. Resolution is first-match down `EGG_PARTS`. */
  readonly hit: (p: Vec) => boolean;
  /** Where this part's leader line ends. Computed from the geometry above. */
  readonly anchor: Vec;
}

const innerTopY = pointOn(0, EGG.shellInner).y;
const innerSideR = eggRadius(Math.PI / 2) * EGG.shellInner;

/**
 * Hit order, top to bottom. Paint order is this list reversed, so the thing
 * that wins a contested point is also the thing drawn on top of it — one array,
 * two uses, no way to disagree.
 */
export const EGG_PARTS: readonly EggPart[] = [
  {
    id: 'air',
    label: 'Air cell',
    what: 'A pocket of air at the blunt end. It grows as water evaporates out through the shell, so an old egg floats and a fresh one sinks.',
    color: '#eae4d5',
    side: 'left',
    hit: (p) => insideAt(p, EGG.shellInner) && p.y <= EGG.airY,
    anchor: { x: EGG.cx, y: (innerTopY + EGG.airY) / 2 },
  },
  {
    id: 'yolk',
    label: 'Yolk',
    what: 'The chick’s food store: fat, vitamins A and D, and the yellow pigment it is named for. About a third of it is fat.',
    color: '#8a6416',
    side: 'left',
    hit: (p) => Math.hypot(p.x - EGG.cx, p.y - EGG.cy) <= EGG.yolkR,
    anchor: { x: EGG.cx - EGG.yolkR * 0.55, y: EGG.cy },
  },
  {
    id: 'chalaza',
    label: 'Chalazae',
    what: 'Two twisted cords of protein anchoring the yolk in the middle. The fresher the egg, the more clearly you can see them.',
    color: '#6b6757',
    side: 'left',
    hit: (p) =>
      insideAt(p, EGG.shellInner) &&
      CHALAZA_SEGMENTS.some(([a, b]) => distanceToSegment(p, a, b) <= EGG.chalazaR),
    anchor: {
      x: (CHALAZA_SEGMENTS[1][0].x + CHALAZA_SEGMENTS[1][1].x) / 2,
      y: (CHALAZA_SEGMENTS[1][0].y + CHALAZA_SEGMENTS[1][1].y) / 2,
    },
  },
  {
    id: 'white',
    label: 'White',
    what: 'Nearly nine-tenths water; the rest is protein. Heat makes those proteins unfold and lock together, which is why it turns solid and opaque and never turns back.',
    color: '#fbf9f4',
    side: 'right',
    hit: (p) => insideAt(p, EGG.shellInner),
    anchor: { x: EGG.cx + (EGG.yolkR + innerSideR) / 2, y: EGG.cy },
  },
  {
    id: 'shell',
    label: 'Shell',
    what: 'Calcium carbonate, the same mineral as chalk and limestone, with about seven thousand pores through it so the chick can breathe.',
    color: '#ddd6c4',
    side: 'right',
    hit: (p) => insideAt(p, 1),
    anchor: pointOn(2.5, (1 + EGG.shellInner) / 2),
  },
];

export const EGG_HIT_ORDER: readonly EggPartId[] = EGG_PARTS.map((p) => p.id);
export const EGG_PAINT_ORDER: readonly EggPartId[] = [...EGG_PARTS].reverse().map((p) => p.id);

/** Which part owns a point. First match down `EGG_PARTS`; null outside the egg. */
export function eggPartAt(p: Vec): EggPartId | null {
  for (const part of EGG_PARTS) if (part.hit(p)) return part.id;
  return null;
}

export function eggPart(id: EggPartId): EggPart {
  const found = EGG_PARTS.find((p) => p.id === id);
  if (!found) throw new Error(`no egg part ${id}`);
  return found;
}

/** Where a part's label sits, and the elbow its leader turns at. Derived from the anchor. */
export function leaderFor(part: EggPart): { readonly text: Vec; readonly elbow: Vec; readonly anchorEnd: 'start' | 'end' } {
  const outX = part.side === 'left' ? EGG.labelLeftX : EGG.labelRightX;
  const elbowX = part.side === 'left' ? EGG.labelLeftX + 26 : EGG.labelRightX - 26;
  return {
    text: { x: outX, y: part.anchor.y - 8 },
    elbow: { x: elbowX, y: part.anchor.y },
    anchorEnd: part.side === 'left' ? 'start' : 'end',
  };
}

export const EGG_FLOAT_TEST: readonly string[] = [
  'Put the egg in a glass of water.',
  'It lies flat on the bottom: the air cell is still small, so the egg is only a few days old.',
  'It stands on its point: the air cell has grown enough to lift the blunt end.',
  'It floats: enough water has left through the pores that the air cell can carry the whole egg.',
  'The test measures the air cell, and the air cell measures the time.',
];

/* ------------------------------------------------------- why milk sets into curd */

export interface Micelle {
  readonly x: number;
  readonly y: number;
  /** How many charges still hold this bundle away from its neighbours. */
  readonly charge: number;
}

export const CURD_VIEW = { w: 760, h: 460 } as const;

const LATTICE_COLS = 6;
const LATTICE_ROWS = 4;

/**
 * The same function draws milk and curd. `set` runs 0 (milk) to 1 (curd): the
 * bundles keep their charge and their spacing at 0, and lose both at 1. Two
 * states from one description, so they cannot disagree about how many bundles
 * there are or where they went.
 */
export function micelles(set: number): readonly Micelle[] {
  const t = Math.max(0, Math.min(1, set));
  const x0 = 96;
  const y0 = 132;
  const dx = (CURD_VIEW.w - 2 * x0) / (LATTICE_COLS - 1);
  const dy = 196 / (LATTICE_ROWS - 1);
  const clumps = [
    { x: x0 + dx * 1.1, y: y0 + dy * 1.1 },
    { x: x0 + dx * 3.0, y: y0 + dy * 0.8 },
    { x: x0 + dx * 4.0, y: y0 + dy * 2.1 },
  ];
  const out: Micelle[] = [];
  for (let r = 0; r < LATTICE_ROWS; r += 1) {
    for (let c = 0; c < LATTICE_COLS; c += 1) {
      const i = r * LATTICE_COLS + c;
      const home = { x: x0 + c * dx, y: y0 + r * dy };
      const clump = clumps[i % clumps.length];
      const spread = 16 * (((i * 7) % 5) - 2) / 2;
      out.push({
        x: home.x + (clump.x + spread - home.x) * t,
        y: home.y + (clump.y + spread - home.y) * t,
        charge: Math.round(3 * (1 - t)),
      });
    }
  }
  return out;
}

export const MICELLE_COUNT = LATTICE_COLS * LATTICE_ROWS;

export const CURD_STEPS: readonly { readonly title: string; readonly line: string }[] = [
  {
    title: 'Milk',
    line: 'The protein in milk is casein, carried in bundles about a ten-thousandth of a millimetre across. There are so many that they scatter every colour of light equally, which is why milk looks white.',
  },
  {
    title: 'Why it stays liquid',
    line: 'Each bundle is wrapped in a hairy layer that carries a negative charge. Like charges push apart, so the bundles never touch and the milk pours.',
  },
  {
    title: 'Acid',
    line: 'Lemon juice, vinegar, or the lactic acid that bacteria make out of milk sugar cancels the charge. At about pH 4.6 there is nothing left pushing the bundles apart.',
  },
  {
    title: 'Curd',
    line: 'The bundles stick to each other into a mesh, trapping the fat and most of the water. That mesh is the curd. The thin liquid squeezed out of it is whey.',
  },
  {
    title: 'Dahi at home',
    line: 'Heat the milk to about 85 °C first, which unfolds the whey proteins and makes the set firmer, then cool it to about 45 °C and stir in a spoon of the last batch. Its bacteria do the acid-making over the next few hours.',
  },
];

export const CURD_STATES: readonly { readonly set: number; readonly title: string; readonly line: string }[] = [
  { set: 0, title: 'Milk', line: 'Bundles apart, three charges each, nothing touching.' },
  { set: 0.5, title: 'Acid going in', line: 'Charges falling. The bundles drift close enough to feel each other.' },
  { set: 1, title: 'Curd', line: 'No charge left. The bundles are stuck into one mesh, holding the fat and the water.' },
];

/* --------------------------------------------------------------- the benches */

export type Bench = 'plate' | 'egg' | 'curd';

export const BENCHES: readonly { readonly key: Bench; readonly title: string; readonly note: string }[] = [
  { key: 'plate', title: 'Build a plate', note: 'Put food on the plate. The instrument reads back what it supplies.' },
  { key: 'egg', title: 'Inside an egg', note: 'Five parts, and what each one is for.' },
  { key: 'curd', title: 'Milk into curd', note: 'Why a pan of milk turns solid when acid goes in.' },
];

/* ------------------------------------------------------------------ the axis */

/**
 * The bars have to be measured against something, and that something must not
 * be a target — a "recommended amount" would turn the instrument into a scold.
 * So the axis is the largest single serving of that nutrient anywhere on the
 * shelf, stretched if the plate happens to carry more. It is a ruler, not a
 * goal, and the plate says which ruler it used.
 */
export function maxPerServing(key: NutrientKey): number {
  return FOODS.reduce((m, f) => Math.max(m, f.per[key]), 0);
}

export function axisMax(plate: Plate, key: NutrientKey): number {
  return Math.max(maxPerServing(key), plateTotals(plate)[key]);
}

/** The bar's length as a fraction of the row, 0 to 1. */
export function barFraction(plate: Plate, key: NutrientKey): number {
  const axis = axisMax(plate, key);
  return axis <= 0 ? 0 : Math.min(1, plateTotals(plate)[key] / axis);
}

export function axisNote(plate: Plate, key: NutrientKey): string {
  return `bar measured against ${Math.round(axisMax(plate, key) * 10) / 10} ${NUTRIENTS[key].unit}, the largest single serving on the shelf`;
}
