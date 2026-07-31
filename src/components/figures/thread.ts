/**
 * Geometry for drawing a square-threaded screw in cutaway.
 *
 * Roman press screws were cut in wood with a broad square thread, not the V
 * thread of a modern machine screw, so a tooth in section is a rectangle. The
 * point of the whole figure is the INTERLOCK — the beam's cut face is not a
 * straight line, it is a groove that receives the teeth. Drawing that edge by
 * hand invites exactly the kind of silent geometry error this project keeps
 * finding in generated art, so it is computed.
 */

/** Tooth centres down a shaft. `phase` offsets one flank to suggest the helix. */
export function toothCentres(
  yTop: number,
  yBottom: number,
  pitch: number,
  phase = 0,
): number[] {
  const out: number[] = [];
  for (let y = yTop + phase; y <= yBottom; y += pitch) out.push(y);
  return out;
}

/**
 * The beam's cut edge where the screw passes through it.
 *
 * Between teeth the beam stands proud at `xCore`, touching the shaft; at each
 * tooth it recedes to `xRoot` to make room. Returns points top-to-bottom.
 */
export function interlockEdge(
  xCore: number,
  xRoot: number,
  yTop: number,
  yBottom: number,
  centres: readonly number[],
  halfTooth: number,
): Array<[number, number]> {
  const crossings: number[] = [];
  for (const c of centres) {
    if (c + halfTooth > yTop && c - halfTooth < yBottom) {
      crossings.push(c - halfTooth, c + halfTooth);
    }
  }
  const inside = (y: number) =>
    centres.some((c) => y >= c - halfTooth && y <= c + halfTooth);

  const points: Array<[number, number]> = [];
  let x = inside(yTop) ? xRoot : xCore;
  points.push([x, yTop]);
  for (const y of crossings) {
    if (y <= yTop || y >= yBottom) continue;
    points.push([x, y]);
    x = x === xCore ? xRoot : xCore;
    points.push([x, y]);
  }
  points.push([x, yBottom]);
  return points;
}

/** `d` for a closed shape: a vertical back edge at `xBack`, then the given edge. */
export function edgeToPath(
  xBack: number,
  edge: ReadonlyArray<readonly [number, number]>,
): string {
  const [, yTop] = edge[0];
  const [, yBottom] = edge[edge.length - 1];
  const run = edge.map(([x, y]) => `L${x},${y}`).join('');
  return `M${xBack},${yTop}${run}L${xBack},${yBottom}Z`;
}

/** The book's palette, so a diagram page does not look like a different book. */
export const INK = {
  paper: '#f7f1e4',
  line: '#4a3f31',
  wood: '#d7ab68',
  woodDark: '#a97c40',
  woodShade: '#c1904d',
  stone: '#bdb5a5',
  stoneDark: '#8d8676',
  paste: '#9aa36c',
  pasteDark: '#7c8452',
  oil: '#d3a51f',
  oilDark: '#a97f10',
  mark: '#b0522c',
} as const;
