import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import {
  EGG, EGG_PAINT_ORDER, EGG_PARTS, CHALAZA_CORDS,
  airCellPath, eggOutline, eggPartAt, leaderFor,
} from '../games/food-science';

it('dumps egg geometry', () => {
  const pts = (path: string) =>
    [...path.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])]);
  const map: (string | null)[][] = [];
  for (let y = 0; y < EGG.view.h; y += 2) {
    const row: (string | null)[] = [];
    for (let x = 0; x < EGG.view.w; x += 2) row.push(eggPartAt({ x, y }));
    map.push(row);
  }
  writeFileSync('/tmp/egg.json', JSON.stringify({
    view: EGG.view,
    paintOrder: EGG_PAINT_ORDER,
    outer: eggOutline(1).map((p) => [p.x, p.y]),
    inner: eggOutline(EGG.shellInner).map((p) => [p.x, p.y]),
    air: pts(airCellPath()),
    yolk: [EGG.cx, EGG.cy, EGG.yolkR],
    cords: CHALAZA_CORDS.map((c) => c.map((p) => [p.x, p.y])),
    chalazaR: EGG.chalazaR,
    parts: EGG_PARTS.map((p) => {
      const l = leaderFor(p);
      return { id: p.id, label: p.label, side: p.side, anchor: [p.anchor.x, p.anchor.y],
        elbow: [l.elbow.x, l.elbow.y], text: [l.text.x, l.text.y], resolves: eggPartAt(p.anchor) };
    }),
    map,
  }));
});
