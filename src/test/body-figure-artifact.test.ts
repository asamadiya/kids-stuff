import { it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { HIT_ORDER, PAINT_ORDER, REGION_LEADER, REGION_POLYS, VIEW, regionAt } from '../sel/body-figure';

/**
 * Writes the hit map on every run, so the invariant is reviewed by looking at
 * a picture rather than by trusting the intention behind it. `scripts/render-body-figure.py`
 * turns this into a PNG.
 */
it('writes the hit-map artifact', () => {
  const map: (string | null)[][] = [];
  for (let y = 0; y < VIEW.height; y += 1) {
    const row: (string | null)[] = [];
    for (let x = 0; x < VIEW.width; x += 1) row.push(regionAt(x, y));
    map.push(row);
  }
  mkdirSync('artifacts', { recursive: true });
  writeFileSync(
    'artifacts/body-figure.json',
    JSON.stringify({ view: VIEW, hitOrder: HIT_ORDER, paintOrder: PAINT_ORDER, polys: REGION_POLYS, leaders: REGION_LEADER, map }),
  );
});
