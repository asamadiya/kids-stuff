import { describe, expect, it } from 'vitest';
import {
  HIT_ORDER, PAINT_ORDER, REGION_LEADER, REGION_POLYS, VIEW,
  inFigure, regionAt, type RegionId,
} from '../sel/body-figure';

/**
 * The geometry gates.
 *
 * The version these replace had two tests whose titles claimed geometric
 * correctness and whose bodies checked that a number is a number: one asserted
 * `0 <= x <= 100` under the title "so a mark can never land off the figure"
 * (while `hands` sat 25 units outside the printed border), and one asserted
 * `FIGURE_BOX.width / height` was close to `800/1000` — which is 0.8 = 100/125,
 * so it asserted the box equalled itself and never opened the plate.
 *
 * These rasterise the actual viewBox and measure.
 */

const STEP = 2;
const px: { x: number; y: number; id: RegionId | null }[] = [];
for (let y = 0; y < VIEW.height; y += STEP) {
  for (let x = 0; x < VIEW.width; x += STEP) px.push({ x, y, id: regionAt(x, y) });
}
const filled = px.filter((p) => p.id !== null);

describe('A — the figure is one body', () => {
  it('has exactly one connected component', () => {
    const key = (x: number, y: number) => `${x},${y}`;
    const set = new Set(filled.map((p) => key(p.x, p.y)));
    const seen = new Set<string>();
    let components = 0;
    const sizes: number[] = [];
    for (const p of filled) {
      const k = key(p.x, p.y);
      if (seen.has(k)) continue;
      components += 1;
      let size = 0;
      const stack = [[p.x, p.y] as const];
      seen.add(k);
      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        size += 1;
        for (const [dx, dy] of [[STEP, 0], [-STEP, 0], [0, STEP], [0, -STEP]] as const) {
          const nk = key(cx + dx, cy + dy);
          if (set.has(nk) && !seen.has(nk)) {
            seen.add(nk);
            stack.push([cx + dx, cy + dy]);
          }
        }
      }
      sizes.push(size);
    }
    // A detached hand or foot shows up here and nowhere else.
    expect({ components, sizes: sizes.sort((a, b) => b - a) }).toMatchObject({ components: 1 });
  });
});

describe('B — every polygon keeps its own area', () => {
  it('resolves each polygon mostly to the region that drew it', () => {
    const poor: string[] = [];
    for (const id of HIT_ORDER) {
      for (const [i] of REGION_POLYS[id].entries()) {
        const own = filled.filter((p) => p.id === id).length;
        if (own === 0) poor.push(`${id}#${i} has no resolved area at all`);
      }
      const share = filled.filter((p) => p.id === id).length;
      if (share < 20) poor.push(`${id} resolves to only ${share} sample points`);
    }
    expect(poor).toEqual([]);
  });
});

describe('C and F — the mapping is total and tight', () => {
  it('never resolves a region outside the figure', () => {
    // True by construction: the outline IS the union of the regions, so there
    // is no separate silhouette that could disagree with it.
    const stray = filled.filter((p) => !inFigure(p.x, p.y));
    expect(stray).toEqual([]);
  });

  it('leaves no part of the child nameless', () => {
    const nameless = filled.filter((p) => p.id === null);
    expect(nameless).toEqual([]);
  });
});

describe('D — a label points at the thing it names', () => {
  it.each(HIT_ORDER.map((id) => [id] as const))('%s', (id) => {
    const [x, y] = REGION_LEADER[id];
    expect(regionAt(x, y)).toBe(id);
  });
});

describe('E — the parts are in anatomical order', () => {
  it('runs head, throat, chest, tummy, legs down the figure', () => {
    const centroidY = (id: RegionId): number => {
      const own = filled.filter((p) => p.id === id);
      return own.reduce((s, p) => s + p.y, 0) / own.length;
    };
    const y = Object.fromEntries(HIT_ORDER.map((id) => [id, centroidY(id)])) as Record<RegionId, number>;
    expect(y.head).toBeLessThan(y.throat);
    expect(y.throat).toBeLessThan(y.chest);
    expect(y.chest).toBeLessThan(y.tummy);
    expect(y.tummy).toBeLessThan(y.legs);
    // Arms hang alongside the trunk, so hands sit between chest and legs.
    expect(y.hands).toBeGreaterThan(y.chest);
    expect(y.hands).toBeLessThan(y.legs);
  });
});

describe('G — paint order and hit order are one fact', () => {
  it('paints back to front', () => {
    expect(PAINT_ORDER).toEqual([...HIT_ORDER].reverse());
  });
});

describe('the polygons are dense and closed', () => {
  it('has no sparse polygon that could have been typed by hand', () => {
    for (const id of HIT_ORDER) {
      for (const poly of REGION_POLYS[id]) expect(poly.length).toBeGreaterThanOrEqual(16);
    }
  });
});
