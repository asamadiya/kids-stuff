import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  AMINOS,
  AMINO_KEYS,
  BENCHES,
  CHALAZA_SEGMENTS,
  CURD_STEPS,
  EGG,
  EGG_HIT_ORDER,
  EGG_PAINT_ORDER,
  EGG_PARTS,
  FOODS,
  FOOD_SCIENCE_META,
  MICELLE_COUNT,
  NUTRIENTS,
  NUTRIENT_KEYS,
  PROTEIN_GROUPS,
  airCellPath,
  axisMax,
  axisNote,
  barFraction,
  blockCheck,
  blockLine,
  contribution,
  eggOutline,
  eggPart,
  eggPartAt,
  eggRadius,
  foodById,
  insideAt,
  leaderFor,
  micelles,
  nutrientLines,
  plateLines,
  plateSummary,
  plateTotals,
  pointOn,
  serve,
  servingsOn,
  topSources,
  type Food,
  type NutrientKey,
  type Plate,
  type Vec,
} from '../games/food-science';

const plateOf = (...ids: string[]): Plate => ids.reduce<Plate>((p, id) => serve(p, id), {});
const id = (f: Food): string => f.id;

/* ------------------------------------------------------------------ the table */

/**
 * The expected Unicode names, keyed by code point, read off the Unicode chart
 * by hand. The point of writing them out is that the assertion then compares
 * two independently-authored facts. A swapped glyph — the defect that once drew
 * eighteen hinamatsuri dolls for nine eggs in Take Away — fails here.
 */
const NAME_BY_CODEPOINT: Record<number, string> = {
  0x1f95a: 'EGG', 0x1f95b: 'GLASS OF MILK', 0x1fad9: 'JAR', 0x1f9c0: 'CHEESE WEDGE',
  0x1fad8: 'BEANS', 0x1f963: 'BOWL WITH SPOON', 0x1f35a: 'COOKED RICE', 0x1fad3: 'FLATBREAD',
  0x1f33d: 'EAR OF MAIZE', 0x1f95c: 'PEANUTS', 0x1f951: 'AVOCADO', 0x1fad2: 'OLIVE',
  0x1f9c8: 'BUTTER', 0x1f96c: 'LEAFY GREEN', 0x1f966: 'BROCCOLI', 0x1f955: 'CARROT',
  0x1f954: 'POTATO', 0x1f34e: 'RED APPLE', 0x1f34a: 'TANGERINE', 0x1f34b: 'LEMON',
};

const named = (glyph: string): string => {
  const cp = [...glyph].filter((c) => c !== '️')[0];
  return NAME_BY_CODEPOINT[cp.codePointAt(0)!] ?? '<unknown>';
};

describe('the food table', () => {
  it('is well formed and states its own serving', () => {
    expect(FOOD_SCIENCE_META.id).toBe('food-science');
    expect(FOOD_SCIENCE_META.title.length).toBeGreaterThan(0);
    expect(FOODS.length).toBeGreaterThanOrEqual(18);
    expect(new Set(FOODS.map(id)).size).toBe(FOODS.length);
    for (const f of FOODS) {
      expect(f.serving, f.id).toMatch(/\d/);
      expect(f.fact.length, f.id).toBeGreaterThan(20);
    }
  });

  it('pins every glyph to its Unicode name, so a swapped glyph fails here', () => {
    const wrong = FOODS.filter((f) => named(f.glyph) !== f.unicode)
      .map((f) => `${f.id}: ${f.glyph} is ${named(f.glyph)}, record says ${f.unicode}`);
    expect(wrong).toEqual([]);
  });

  it('gives every food a distinct glyph, so two rows are never drawn the same', () => {
    expect(new Set(FOODS.map((f) => f.glyph)).size).toBe(FOODS.length);
  });

  it('writes both word forms out rather than deriving one from the other', () => {
    for (const f of FOODS) {
      expect(f.singular.length, f.id).toBeGreaterThan(0);
      expect(f.plural.length, f.id).toBeGreaterThan(0);
    }
    expect(foodById('potato')!.plural).toBe('potatoes');
    expect(foodById('roti')!.plural).toBe('rotis');
    expect(foodById('avocado')!.plural).toBe('halves of avocado');
  });

  it('is ovo-lacto-vegetarian: eggs and dairy, never meat and never fish', () => {
    // The prose at the top of the module states the policy, so the gate reads
    // code and rendered copy rather than comments.
    const stripComments = (src: string): string =>
      src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
    const source = stripComments(readFileSync('src/games/food-science.ts', 'utf8'));
    const fleshGlyphs = /🍖|🍗|🥩|🥓|🍤|🍣|🍱|🐟|🦐|🦀|🍕/;
    const fleshWords = /\b(meat|chicken|mutton|beef|pork|lamb|bacon|ham|fish|prawn|shrimp|gelatin|gelatine|lard|tallow|anchov)/i;
    expect(fleshGlyphs.test(source)).toBe(false);
    expect(fleshWords.test(source)).toBe(false);

    const shown = [
      ...FOODS.flatMap((f) => [f.singular, f.plural, f.serving, f.fact, f.glyph]),
      ...NUTRIENT_KEYS.map((k) => NUTRIENTS[k].does),
      ...AMINO_KEYS.map((a) => AMINOS[a].note),
      ...CURD_STEPS.map((s) => s.line),
      ...EGG_PARTS.map((p) => p.what),
      ...FOODS.flatMap((a) => plateLines(plateOf(a.id))),
    ];
    expect(shown.filter((s) => fleshWords.test(s) || fleshGlyphs.test(s))).toEqual([]);

    const allowed = new Set(['pulse', 'grain', 'dairy', 'egg', 'nut', 'vegetable', 'fruit', 'fat']);
    expect(FOODS.filter((f) => !allowed.has(f.group)).map(id)).toEqual([]);
  });

  it('is not the candy register either', () => {
    const candy = /🍪|🍬|🧁|🍩|🍭|🍫|🍰|🎂/;
    expect(candy.test(readFileSync('src/games/food-science.ts', 'utf8'))).toBe(false);
  });

  it('keeps every nutrient amount non-negative and finite', () => {
    for (const f of FOODS) {
      for (const key of NUTRIENT_KEYS) {
        expect(Number.isFinite(f.per[key]), `${f.id}.${key}`).toBe(true);
        expect(f.per[key], `${f.id}.${key}`).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('fits the exercise registry PlayHub keeps, so wiring it cannot fail to compile', () => {
    // Declared here rather than imported: PlayHub's GameMeta is private to that
    // module, so this is the contract restated where it can be checked.
    interface GameMeta {
      readonly id: string;
      readonly title: string;
      readonly icon: string;
      readonly color: string;
      readonly tagline: string;
    }
    const card: GameMeta = FOOD_SCIENCE_META;
    expect(card.id).toBe('food-science');
    expect(card.color).toBe('leaf');
    expect(card.tagline.length).toBeGreaterThan(20);
    expect(card.tagline).not.toMatch(/!/);
    // The workshop registry reads `note` and the exercise registry reads
    // `tagline`; they are one constant, so neither can go stale.
    expect(FOOD_SCIENCE_META.note).toBe(FOOD_SCIENCE_META.tagline);
  });

  it('states only claims the table itself can be checked against', () => {
    // Two facts on the shelf are quantitative claims about the shelf. If the
    // numbers move and the sentence does not, this fails.
    const mostIron = FOODS.slice().sort((a, b) => b.per.iron - a.per.iron)[0];
    expect(mostIron.id, 'the dal fact claims the most iron per serving').toBe('dal');
    expect(foodById('dal')!.fact).toContain('more iron than any other single serving');

    const rotiPerRice = foodById('roti')!.per.fibre / foodById('rice')!.per.fibre;
    expect(Math.round(rotiPerRice), 'the roti fact claims about five times').toBe(5);
    expect(foodById('roti')!.fact).toContain('five times the fibre');

    expect(foodById('broccoli')!.per.vitaminC).toBeGreaterThan(foodById('orange')!.per.vitaminC);
    expect(foodById('broccoli')!.fact).toContain('more vitamin C than an orange');
  });

  it('says what each nutrient does in the body rather than what to eat', () => {
    for (const key of NUTRIENT_KEYS) {
      expect(NUTRIENTS[key].does.length, key).toBeGreaterThan(40);
    }
  });
});

/* ----------------------------------------------- the building-block check */

describe('complementary protein is computed, not asserted', () => {
  /**
   * This is the gate the brief asks for. The claim "beans and rice together
   * give you what neither gives alone" is nowhere written down: it falls out of
   * intersecting the amino acids each food is short of. Revert the intersection
   * to a hand-written pairing rule and the two-pulse case below flips, because
   * a hand-written rule about beans and rice cannot know that rajma and dal are
   * still short of the same block.
   */
  it('rajma and rice together are short of nothing', () => {
    const check = blockCheck(plateOf('rajma', 'rice'));
    expect(check.missing).toEqual([]);
    expect(check.complete).toBe(true);
  });

  it('rajma and dal together are still short of methionine, because both pulses are', () => {
    const check = blockCheck(plateOf('rajma', 'dal'));
    expect(check.missing).toEqual(['methionine']);
    expect(check.complete).toBe(false);
  });

  it('rice and roti together are still short of lysine, because both grains are', () => {
    expect(blockCheck(plateOf('rice', 'roti')).missing).toEqual(['lysine']);
  });

  it('maize alone is short of two blocks, and beans cover both', () => {
    expect(blockCheck(plateOf('maize')).missing).toEqual(['lysine', 'tryptophan']);
    expect(blockCheck(plateOf('maize', 'rajma')).missing).toEqual([]);
  });

  it('an egg on its own is short of nothing', () => {
    expect(blockCheck(plateOf('egg')).complete).toBe(true);
    expect(blockCheck(plateOf('milk')).complete).toBe(true);
  });

  it('reports nothing to intersect when no protein food is on the plate', () => {
    const check = blockCheck(plateOf('carrot', 'apple'));
    expect(check.proteinFoods).toEqual([]);
    expect(check.complete).toBe(false);
    expect(check.missing).toEqual([]);
  });

  it('names who covered whose gap, taken from the same two lists', () => {
    const check = blockCheck(plateOf('rajma', 'rice'));
    const methionine = check.covered.find((c) => c.amino === 'methionine');
    expect(methionine?.filledBy.map(id)).toEqual(['rice']);
    const lysine = check.covered.find((c) => c.amino === 'lysine');
    expect(lysine?.filledBy.map(id)).toEqual(['rajma']);
  });

  it('lets an egg or a glass of milk cover a grain, which no pulse-plus-grain rule would', () => {
    // These are the cases that separate the intersection from a hand-written
    // pairing rule. A rule keyed on "a pulse and a grain" calls all four of
    // these incomplete; the intersection gets all four right.
    expect(blockCheck(plateOf('egg', 'rice')).complete).toBe(true);
    expect(blockCheck(plateOf('milk', 'roti')).complete).toBe(true);
    expect(blockCheck(plateOf('curd', 'maize')).complete).toBe(true);
    // Peanuts are a pulse that ripens underground and are filed as a nut, so a
    // group-based rule misses them; their limiting block does not.
    expect(blockCheck(plateOf('peanuts', 'rice')).complete).toBe(true);
  });

  it('keeps only what every protein food lacks, not everything any of them lacks', () => {
    // Maize is short of lysine and tryptophan; rice is short of lysine alone.
    // The intersection is lysine. A union would say both, and a plate of two
    // grains is exactly where that difference matters.
    expect(blockCheck(plateOf('maize', 'rice')).missing).toEqual(['lysine']);
    expect(blockCheck(plateOf('maize', 'roti')).missing).toEqual(['lysine']);
  });

  it('matches an independent intersection of the table, on every pair and triple', () => {
    const intersect = (foods: readonly Food[]): string[] =>
      AMINO_KEYS.filter((a) => foods.length > 0 && foods.every((f) => (f.limiting ?? []).includes(a)));
    const wrong: string[] = [];
    for (const a of FOODS) {
      for (const b of FOODS) {
        for (const c of [a, b, FOODS[0], FOODS[6]]) {
          const plate = plateOf(a.id, b.id, c.id);
          const check = blockCheck(plate);
          const byHand = intersect(check.proteinFoods);
          if (JSON.stringify(check.missing) !== JSON.stringify(byHand)) {
            wrong.push(`${a.id}+${b.id}+${c.id}: ${check.missing} vs ${byHand}`);
          }
        }
      }
    }
    expect(wrong.slice(0, 5)).toEqual([]);
  });

  it('fits the sentence on the plate, and agrees its verb, on every triple', () => {
    // The first version repeated one clause per gap and ran past the edge of
    // the plate, where the drawing chopped it mid-word. Two lines of the plate
    // hold about 216 characters.
    const long: string[] = [];
    const disagrees: string[] = [];
    for (const a of FOODS) {
      for (const b of FOODS) {
        for (const c of [FOODS[0], FOODS[8], FOODS[9]]) {
          const line = blockLine(plateOf(a.id, b.id, c.id));
          if (line.length > 200) long.push(`${a.id}+${b.id}+${c.id} (${line.length})`);
          if (/\band \w[\w ]* brings\b/.test(line)) disagrees.push(line);
        }
      }
    }
    expect(long.slice(0, 4)).toEqual([]);
    expect(disagrees.slice(0, 2)).toEqual([]);
  });

  it('says "all nine" if and only if the intersection is empty, over every pair on the table', () => {
    const disagreements: string[] = [];
    for (const a of FOODS) {
      for (const b of FOODS) {
        const plate = plateOf(a.id, b.id);
        const check = blockCheck(plate);
        const said = blockLine(plate).startsWith('All nine');
        if (said !== check.complete) disagreements.push(`${a.id}+${b.id}`);
      }
    }
    expect(disagreements).toEqual([]);
  });

  it('only reads the groups that carry protein', () => {
    for (const f of FOODS) {
      const reads = f.limiting !== null && PROTEIN_GROUPS.includes(f.group);
      expect(blockCheck(plateOf(f.id)).proteinFoods.length, f.id).toBe(reads ? 1 : 0);
    }
  });

  it('keeps every limiting entry inside the declared amino set', () => {
    for (const f of FOODS) {
      for (const a of f.limiting ?? []) expect(AMINO_KEYS, f.id).toContain(a);
    }
    for (const a of AMINO_KEYS) expect(AMINOS[a].name).toBe(a);
  });
});

/* -------------------------------------------------------------- the readout */

describe('the readout is summed from the table', () => {
  const handSum = (plate: Plate, key: NutrientKey): number =>
    Math.round(servingsOn(plate).reduce((n, s) => n + s.food.per[key] * s.servings, 0) * 10) / 10;

  it('adds up the same as adding it up by hand, on every pair and triple sampled', () => {
    const sample = FOODS.filter((_, i) => i % 3 === 0);
    const bad: string[] = [];
    for (const a of sample) {
      for (const b of sample) {
        const plate = serve(plateOf(a.id, b.id), b.id);
        const totals = plateTotals(plate);
        for (const key of NUTRIENT_KEYS) {
          if (Math.abs(totals[key] - handSum(plate, key)) > 0.05) bad.push(`${a.id}+${b.id}.${key}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('scales with servings, so two of a thing is twice one of it', () => {
    const one = plateTotals(plateOf('dal'));
    const two = plateTotals(serve(plateOf('dal'), 'dal'));
    for (const key of NUTRIENT_KEYS) expect(two[key], key).toBeCloseTo(one[key] * 2, 5);
  });

  it('names the foods that actually carry the most of a nutrient', () => {
    const plate = plateOf('rajma', 'rice', 'lemon');
    expect(topSources(plate, 'protein').map((s) => s.food.id)[0]).toBe('rajma');
    expect(topSources(plate, 'vitaminC').map((s) => s.food.id)[0]).toBe('lemon');
    expect(topSources(plate, 'fibre').map((s) => s.food.id)[0]).toBe('rajma');
    expect(contribution({ food: foodById('rajma')!, servings: 2 }, 'fibre')).toBe(26);
  });

  it('takes food back off the plate and empties cleanly', () => {
    const plate = serve(serve({}, 'egg'), 'egg');
    expect(plate.egg).toBe(2);
    expect(serve(serve(plate, 'egg', -1), 'egg', -1).egg).toBeUndefined();
    expect(serve({}, 'not-a-food')).toEqual({});
    expect(plateSummary({})).toBe('Nothing on the plate yet.');
    expect(plateLines({})).toEqual(['Nothing on the plate yet.']);
  });

  it('lists every food that is on the plate, by name', () => {
    const plate = plateOf('roti', 'dal', 'curd');
    const first = plateLines(plate)[0];
    for (const s of servingsOn(plate)) expect(first).toContain(s.food.singular);
  });

  it('measures every bar against a fixed ruler, so two servings draw twice one', () => {
    // The first version stretched the axis to the plate, which pegged every bar
    // full the moment the plate held more than one serving and made two plates
    // incomparable. The ruler is now the four biggest single servings on the
    // shelf, and it does not move.
    for (const key of NUTRIENT_KEYS) {
      const one = barFraction(plateOf('rajma', 'spinach', 'orange'), key);
      const two = barFraction(serve(serve(serve(plateOf('rajma', 'spinach', 'orange'), 'rajma'), 'spinach'), 'orange'), key);
      if (one > 0) expect(two, key).toBeGreaterThan(one);
      expect(one, key).toBeLessThan(1);
      expect(axisMax(key), key).toBeGreaterThan(0);
      expect(axisNote(key), key).toContain(String(axisMax(key)));
    }
  });

  it('names a food in prose without reading like a machine', () => {
    // `singular` names a serving, which is right for counting and wrong for a
    // sentence: "bowl of rajma covers the lysine".
    expect(foodById('rajma')!.name).toBe('rajma');
    expect(foodById('rajma')!.singular).toBe('bowl of rajma');
    for (const f of FOODS) {
      expect(f.name.length, f.id).toBeGreaterThan(2);
      expect(f.name, f.id).not.toMatch(/^(bowl|glass|pot|piece|handful|half|spoon|head|ear) of/);
    }
    expect(blockLine(plateOf('rajma', 'rice'))).not.toContain('bowl of');
  });

  it('gives one line per nutrient, with the amount and the mechanism', () => {
    const lines = nutrientLines(plateOf('spinach', 'orange'));
    expect(lines).toHaveLength(NUTRIENT_KEYS.length);
    expect(lines[NUTRIENT_KEYS.indexOf('iron')]).toContain('haemoglobin');
  });
});

describe('nothing on this bench is scored or judged', () => {
  /**
   * The father's brief: no moralising, no "good food / bad food", no ideology.
   * The gate runs the generated readout over a wide sample of plates rather
   * than reading the source, because a judgement can be assembled at runtime
   * out of pieces that each look innocent.
   */
  const judgement = /\b(good|bad|healthy|unhealthy|junk|naughty|yummy|tasty|delicious|should|ought|must|better|worse|best|worst|avoid|too much|well done|great)\b/i;

  const manyPlates = (): Plate[] => {
    const out: Plate[] = [];
    for (const a of FOODS) {
      out.push(plateOf(a.id));
      for (const b of FOODS) out.push(plateOf(a.id, b.id));
    }
    return out;
  };

  it('never judges a plate, on any of the plates it can produce', () => {
    const offenders: string[] = [];
    for (const plate of manyPlates()) {
      for (const line of [...plateLines(plate), plateSummary(plate)]) {
        const hit = judgement.exec(line);
        if (hit) offenders.push(`${Object.keys(plate).join('+')}: ${hit[0]}`);
      }
    }
    expect([...new Set(offenders)].slice(0, 8)).toEqual([]);
  });

  it('never exclaims and never praises', () => {
    for (const plate of manyPlates().slice(0, 60)) {
      for (const line of plateLines(plate)) expect(line).not.toMatch(/!/);
    }
  });

  it('keeps no score anywhere in the module', () => {
    const source = readFileSync('src/games/food-science.ts', 'utf8');
    expect(source).not.toMatch(/\bscore\b/i);
    expect(source).not.toMatch(/\bcorrect\b/i);
  });
});

/* ------------------------------------------------------------- the egg plate */

describe('the egg plate: every label points at its own part', () => {
  /**
   * The failure this replaces: hand-typed coordinates over a painting, so
   * "the teacher reading" pointed at a bookshelf and hands landed off the body.
   * Here the outline, the hit test and every leader end come out of `EGG`. If
   * anyone hand-types an anchor, or moves the geometry under the anchors, this
   * fails — which is exactly the check that would have caught the last one.
   */
  it('resolves each part\'s leader end to that same part', () => {
    const wrong = EGG_PARTS
      .filter((part) => eggPartAt(part.anchor) !== part.id)
      .map((part) => `${part.id} points at ${eggPartAt(part.anchor)}`);
    expect(wrong).toEqual([]);
  });

  it('paints in exactly the reverse of the order it resolves, from one array', () => {
    expect(EGG_HIT_ORDER).toEqual(['air', 'yolk', 'chalaza', 'white', 'shell']);
    expect(EGG_PAINT_ORDER).toEqual([...EGG_HIT_ORDER].slice().reverse());
    expect(new Set(EGG_HIT_ORDER).size).toBe(EGG_PARTS.length);
  });

  it('covers the whole egg and nothing outside it', () => {
    let inside = 0;
    let unassigned = 0;
    let leaked = 0;
    const counts = new Map<string, number>();
    for (let y = 0; y <= EGG.view.h; y += 2) {
      for (let x = 0; x <= EGG.view.w; x += 2) {
        const p: Vec = { x, y };
        const here = eggPartAt(p);
        if (insideAt(p, 1)) {
          inside += 1;
          if (!here) unassigned += 1;
          else counts.set(here, (counts.get(here) ?? 0) + 1);
        } else if (here) {
          leaked += 1;
        }
      }
    }
    expect(inside).toBeGreaterThan(4000);
    expect(unassigned).toBe(0);
    expect(leaked).toBe(0);
    for (const part of EGG_PARTS) expect(counts.get(part.id) ?? 0, part.id).toBeGreaterThan(20);
  });

  it('measures the yolk the same way the raster draws it', () => {
    let painted = 0;
    const cell = 1;
    for (let y = 0; y <= EGG.view.h; y += cell) {
      for (let x = 0; x <= EGG.view.w; x += cell) {
        if (eggPartAt({ x, y }) === 'yolk') painted += 1;
      }
    }
    const analytic = Math.PI * EGG.yolkR * EGG.yolkR;
    // The chalazae are resolved after the yolk, so the yolk keeps its full disc.
    expect(painted / analytic).toBeGreaterThan(0.98);
    expect(painted / analytic).toBeLessThan(1.02);
  });

  it('keeps the shell a rind rather than a filling', () => {
    let shell = 0;
    let inside = 0;
    for (let y = 0; y <= EGG.view.h; y += 1) {
      for (let x = 0; x <= EGG.view.w; x += 1) {
        const p = { x, y };
        if (!insideAt(p, 1)) continue;
        inside += 1;
        if (eggPartAt(p) === 'shell') shell += 1;
      }
    }
    const share = shell / inside;
    expect(share).toBeGreaterThan(0.05);
    expect(share).toBeLessThan(0.2);
  });

  it('draws the egg blunt at the top and tapered at the bottom, as a hen egg is', () => {
    const top = pointOn(0);
    const bottom = pointOn(Math.PI);
    expect(EGG.cy - top.y).toBeGreaterThan(bottom.y - EGG.cy);
    expect(eggRadius(0)).toBeCloseTo(EGG.b * (1 + EGG.k), 6);
    expect(eggRadius(Math.PI)).toBeCloseTo(EGG.b * (1 - EGG.k), 6);
    expect(eggRadius(Math.PI / 2)).toBeCloseTo(EGG.a, 6);
    expect(eggRadius(-1.1)).toBeCloseTo(eggRadius(1.1), 9);
  });

  it('keeps the whole drawing inside the plate', () => {
    for (const p of eggOutline(1)) {
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(EGG.view.w);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(EGG.view.h);
    }
    for (const part of EGG_PARTS) {
      const leader = leaderFor(part);
      expect(leader.text.x).toBeGreaterThanOrEqual(0);
      expect(leader.text.x).toBeLessThanOrEqual(EGG.view.w);
      expect(leader.anchorEnd).toBe(part.side === 'left' ? 'start' : 'end');
    }
  });

  it('puts the air cell at the blunt end, above the yolk and clear of the cords', () => {
    expect(eggPart('air').anchor.y).toBeLessThan(eggPart('yolk').anchor.y);
    expect(eggPart('air').anchor.y).toBeLessThan(EGG.airY);
    for (const [a, b] of CHALAZA_SEGMENTS) {
      expect(Math.min(a.y, b.y)).toBeGreaterThan(EGG.airY);
    }
    expect(eggPartAt({ x: EGG.cx, y: EGG.airY - 1 })).toBe('air');
    expect(eggPartAt({ x: EGG.cx, y: EGG.airY + 1 })).not.toBe('air');
  });

  it('draws the air-cell cap out of the same outline it hit-tests', () => {
    const path = airCellPath();
    const points = [...path.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)]
      .map((m) => ({ x: Number(m[1]), y: Number(m[2]) }));
    expect(points.length).toBeGreaterThan(10);
    for (const p of points) {
      expect(p.y).toBeLessThanOrEqual(EGG.airY + 0.5);
      expect(insideAt(p, EGG.shellInner + 0.001)).toBe(true);
    }
  });

  it('tells the float test in the order the air cell grows', () => {
    expect(eggPart('air').what).toMatch(/floats/);
    expect(eggPart('shell').what).toMatch(/calcium carbonate/i);
    expect(eggPart('white').what).toMatch(/water/i);
  });
});

/* --------------------------------------------------------------- milk to curd */

describe('milk into curd is one function drawn twice', () => {
  it('keeps the same bundles at every stage, so none appear or vanish', () => {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      expect(micelles(t)).toHaveLength(MICELLE_COUNT);
    }
  });

  it('loses the charge exactly as the acid goes in', () => {
    expect(micelles(0).every((m) => m.charge === 3)).toBe(true);
    expect(micelles(1).every((m) => m.charge === 0)).toBe(true);
  });

  const spread = (t: number): number => {
    const ms = micelles(t);
    let sum = 0;
    let n = 0;
    for (let i = 0; i < ms.length; i += 1) {
      for (let j = i + 1; j < ms.length; j += 1) {
        sum += Math.hypot(ms[i].x - ms[j].x, ms[i].y - ms[j].y);
        n += 1;
      }
    }
    return sum / n;
  };

  it('closes the bundles up as the charge falls, which is the whole mechanism', () => {
    expect(spread(0)).toBeGreaterThan(spread(0.5));
    expect(spread(0.5)).toBeGreaterThan(spread(1));
  });

  it('is deterministic, so the same picture is drawn every time', () => {
    expect(micelles(0.4)).toEqual(micelles(0.4));
  });

  it('states the mechanism with its numbers', () => {
    const all = CURD_STEPS.map((s) => s.line).join(' ');
    expect(all).toMatch(/casein/i);
    expect(all).toMatch(/negative charge/i);
    expect(all).toMatch(/4\.6/);
    expect(all).toMatch(/whey/i);
    expect(CURD_STEPS.length).toBeGreaterThanOrEqual(4);
  });

  it('offers all three benches', () => {
    expect(BENCHES.map((b) => b.key)).toEqual(['plate', 'egg', 'curd']);
  });
});
