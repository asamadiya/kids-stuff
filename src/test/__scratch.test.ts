import { it } from 'vitest';
import { STARS, project, SKY, haversineKm, figureFacts, figureCaption, starsFor, NAME_ICONS } from '../workshop/constellation-register';

it('scratch', () => {
  for (const mode of ['time', 'place', 'subject'] as const) {
    const t0 = Date.now();
    const p = project(mode);
    const ms = Date.now() - t0;
    let minD = Infinity; let out = 0;
    for (let i = 0; i < p.length; i++) {
      const d = Math.hypot(p[i].x - SKY.cx, p[i].y - SKY.cy);
      if (d > SKY.maxR + 0.01) out++;
      for (let j = i + 1; j < p.length; j++) {
        minD = Math.min(minD, Math.hypot(p[i].x - p[j].x, p[i].y - p[j].y));
      }
    }
    process.stdout.write(`${mode}: n=${p.length} ms=${ms} minSep=${minD.toFixed(2)} outsideDisc=${out}\n`);
    const xs = p.map(q => q.x), ys = p.map(q => q.y);
    process.stdout.write(`  x ${Math.min(...xs).toFixed(0)}..${Math.max(...xs).toFixed(0)}  y ${Math.min(...ys).toFixed(0)}..${Math.max(...ys).toFixed(0)}\n`);
  }
  process.stdout.write(`stars=${STARS.length} icons=${NAME_ICONS.length}\n`);
  const two = starsFor(['archimedes-counting-the-sand', 'the-great-bronze-buddha']);
  process.stdout.write(JSON.stringify(figureFacts(two)) + '\n');
  process.stdout.write(figureCaption(two).join(' | ') + '\n');
  process.stdout.write('km ' + haversineKm({lat:37.07,lng:15.29},{lat:34.69,lng:135.84}) + '\n');
  const deep = STARS.filter(s => s.year <= -100000).map(s => s.slug + ':' + s.year + ':' + s.pages);
  process.stdout.write(deep.join('\n') + '\n');
  const c = figureCaption(starsFor([deep[0].split(':')[0], 'archimedes-counting-the-sand']));
  process.stdout.write('deep caption: ' + c.join(' | ') + '\n');
  process.stdout.write('icons: ' + NAME_ICONS.map(i => i.emoji + i.label).join(', ') + '\n');
  // pages range
  process.stdout.write('sizes ' + JSON.stringify([...new Set(project('time').map(q=>q.size))].sort()) + '\n');
});
