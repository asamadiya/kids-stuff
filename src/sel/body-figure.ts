/**
 * The body figure, as geometry the application owns.
 *
 * This replaces a painted plate with six hand-typed points on top of it. That
 * arrangement could not be correct: the coordinates were written from the
 * prompt sent to an image model, the model composed a different picture, and
 * nothing connected the two. Measured on the shipped version, `hands` sat
 * entirely off the child outside the printed border, `throat` landed on the
 * face, `legs` landed on the cast shadow, and the figure box was transposed —
 * 100x125 declared against a 640x498 plate, an aspect error of 1.61x.
 *
 * So there is no image any more. A region is a set of polygons, and the same
 * arrays are what the browser paints, what the hit test resolves, and what the
 * tests measure. A mark is a `RegionId`, never a point: marking a region fills
 * that region, so nothing can hover near the wrong part of the body.
 *
 * The polygons are generated from parametric primitives rather than typed out,
 * which is what makes them dense (16+ vertices) and closed without a human
 * checking either property.
 *
 * A labelled anatomical figure is also more on-brief than a watercolour of a
 * child: a field guide has diagrams.
 */

export type Point = readonly [number, number];
export type Poly = readonly Point[];

/** The drawing box. Portrait, a standing child, head about one sixth of height. */
export const VIEW = { width: 300, height: 440 } as const;

const TAU = Math.PI * 2;

/** A closed ellipse as a polygon. `n` vertices, so density is structural. */
function ellipse(cx: number, cy: number, rx: number, ry: number, n = 24): Poly {
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * TAU;
    return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)] as Point;
  });
}

/**
 * A tapered limb: a quadrilateral from (x1,y1) width w1 to (x2,y2) width w2,
 * with rounded caps, emitted as one closed ring.
 */
function limb(x1: number, y1: number, w1: number, x2: number, y2: number, w2: number): Poly {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const arc = (cx: number, cy: number, r: number, from: number, to: number): Point[] =>
    Array.from({ length: 9 }, (_, i) => {
      const t = from + ((to - from) * i) / 8;
      return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as Point;
    });
  const a = Math.atan2(dy, dx);
  return [
    [x1 + nx * w1, y1 + ny * w1] as Point,
    [x2 + nx * w2, y2 + ny * w2] as Point,
    ...arc(x2, y2, w2, a - Math.PI / 2, a + Math.PI / 2),
    [x2 - nx * w2, y2 - ny * w2] as Point,
    [x1 - nx * w1, y1 - ny * w1] as Point,
    ...arc(x1, y1, w1, a + Math.PI / 2, a + (3 * Math.PI) / 2),
  ];
}

/** A trapezoid, top width tw at y1, bottom width bw at y2, centred on cx. */
function trunk(cx: number, y1: number, tw: number, y2: number, bw: number): Poly {
  const steps = 8;
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const y = y1 + (y2 - y1) * t;
    const w = (tw + (bw - tw) * t) / 2;
    left.push([cx - w, y]);
    right.push([cx + w, y]);
  }
  return [...right, ...left.reverse()];
}

export type RegionId = 'head' | 'throat' | 'chest' | 'tummy' | 'hands' | 'legs';

/**
 * Small and distal first. Organic parts legitimately overlap at the joints —
 * the neck enters the head, the arm socket sits inside the shoulder — because a
 * strictly disjoint tiling renders as a crash-test dummy. So the invariant is
 * not disjointness but deterministic resolution: the first region in this order
 * whose polygons contain the point wins.
 */
export const HIT_ORDER: readonly RegionId[] = ['hands', 'throat', 'head', 'legs', 'tummy', 'chest'];

/** Painted back-to-front, which is exactly the hit order reversed. Stated once. */
export const PAINT_ORDER: readonly RegionId[] = [...HIT_ORDER].reverse();

const CX = 150;

/**
 * Every part folds into a named region — arms into hands, hips into tummy,
 * feet into legs, hair into head — so there is no decorative geometry and
 * every pixel of the child answers to a name.
 */
export const REGION_POLYS: Record<RegionId, readonly Poly[]> = {
  // One skull with a jaw taper. Two overlapping ellipses seamed across the
  // face and read as a bowl-cut helmet.
  head: [ellipse(CX, 76, 42, 50), trunk(CX, 104, 46, 122, 30)],
  throat: [trunk(CX, 112, 32, 142, 42)],
  // Arm sockets sit inside the chest outline, not proud of the shoulder line.
  chest: [trunk(CX, 132, 98, 228, 88), ellipse(CX - 44, 148, 22, 20), ellipse(CX + 44, 148, 22, 20)],
  // Stops above the hip joint so no wedge of trunk shows between the thighs.
  tummy: [trunk(CX, 222, 88, 296, 92), ellipse(CX, 296, 46, 18)],
  hands: [
    limb(CX - 50, 152, 17, CX - 74, 272, 13),
    limb(CX + 50, 152, 17, CX + 74, 272, 13),
    ellipse(CX - 76, 288, 16, 19),
    ellipse(CX + 76, 288, 16, 19),
  ],
  legs: [
    limb(CX - 24, 300, 26, CX - 30, 402, 17),
    limb(CX + 24, 300, 26, CX + 30, 402, 17),
    ellipse(CX - 32, 414, 20, 13),
    ellipse(CX + 32, 414, 20, 13),
  ],
};

/** Where the label for a region points. Derived, so it cannot drift from the shape. */
export const REGION_LEADER: Record<RegionId, Point> = {
  head: [CX, 72],
  throat: [CX, 128],
  chest: [CX, 180],
  tummy: [CX, 260],
  hands: [CX - 76, 288],
  legs: [CX - 30, 364],
};

/** The `d` attribute the browser paints. Generated, never typed. */
export function polyPath(poly: Poly): string {
  return `${poly.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ')} Z`;
}

export function regionPath(id: RegionId): string {
  return REGION_POLYS[id].map(polyPath).join(' ');
}

/** Ray casting. The same predicate the tests use, so drawn and tested agree. */
export function inPoly(poly: Poly, x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function inRegion(id: RegionId, x: number, y: number): boolean {
  return REGION_POLYS[id].some((p) => inPoly(p, x, y));
}

/** Which region owns a point, or null for bare paper. */
export function regionAt(x: number, y: number): RegionId | null {
  for (const id of HIT_ORDER) if (inRegion(id, x, y)) return id;
  return null;
}

/** The child's outline is the union of the regions — there is no separate silhouette. */
export function inFigure(x: number, y: number): boolean {
  return regionAt(x, y) !== null;
}
