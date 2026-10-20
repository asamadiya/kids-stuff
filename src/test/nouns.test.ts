import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The family is ovo-lacto-vegetarian. This guards FOOD, not animals: a
 * crocodile in a tale or a chicken in a farmyard is fine; a chicken on a
 * plate is not. So it scans the places food is named — book text and art,
 * game boards, activities — for meat or fish used as food.
 */

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const FILES = ['src/books', 'src/maths', 'src/science', 'src/make', 'src/learn']
  .flatMap(walk)
  .filter((f) => /\.tsx?$/.test(f) && !f.includes('/_'));

const MEAT_FOOD = /\b(chicken (curry|nuggets?|biryani|tikka|soup|sandwich)|mutton|lamb (curry|chop)|beef|pork|bacon|ham sandwich|sausages?|salami|pepperoni|fish (curry|fry|fingers|and chips)|prawns?|shrimp|tuna|crab curry|meatballs?|burgers?|hot ?dogs?|kebabs?)\b/i;

describe('food is vegetarian everywhere', () => {
  it('checks a meaningful number of files', () => {
    expect(FILES.length).toBeGreaterThan(20);
  });

  it.each(FILES.map((f) => [f] as const))('%s serves no meat or fish', (file) => {
    expect(readFileSync(file, 'utf8')).not.toMatch(MEAT_FOOD);
  });
});
