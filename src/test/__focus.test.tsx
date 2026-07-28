import { it } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { writeFileSync } from 'node:fs';
import { GESTURES, STRIPS, actionWordOf, roadOf } from '../sel/what-happens-next';
import { MOMENTS } from '../sel/borrowed-eyes';
import { WhatHappensNext } from '../components/sel/WhatHappensNext';
import { BorrowedEyes } from '../components/sel/BorrowedEyes';

/** Pull one node's outerHTML out of a rendered component. */
const pick = (root: HTMLElement, sel: string, n = 0): string =>
  (root.querySelectorAll(sel)[n] as HTMLElement | undefined)?.outerHTML ?? `<p>missing ${sel} ${n}</p>`;

it('writes a focused contact sheet', () => {
  const cells: string[] = [];

  // every gesture, by walking to the strip that uses it
  for (const g of GESTURES) {
    let found: { strip: (typeof STRIPS)[number]; roadId: 'a' | 'b' } | null = null;
    for (const s of STRIPS) for (const r of s.roads) if (r.gesture === g && !found) found = { strip: s, roadId: r.id };
    if (!found) { cells.push(`<div class=cell><p>no road for ${g}</p></div>`); continue; }
    const view = render(<WhatHappensNext />);
    const idx = STRIPS.findIndex((s) => s.id === found!.strip.id);
    const thumbs = view.container.querySelectorAll('.bench__tray .bench-part');
    fireEvent.click(thumbs[idx] as HTMLElement);
    const roadIdx = found.roadId === 'a' ? 0 : 1;
    const svg = pick(view.container, '.bench__row .bench__figure svg', roadIdx);
    cells.push(
      `<div class=cell><p class=t>${g}</p>${svg}`
      + `<p class=w>${actionWordOf(found.strip, roadOf(found.strip, found.roadId))}</p></div>`,
    );
    view.unmount();
  }

  const plans: string[] = [];
  for (let i = 0; i < MOMENTS.length; i += 1) {
    const m = MOMENTS[i];
    for (let n = 0; n < m.views.length; n += 1) {
      const view = render(<BorrowedEyes />);
      const list = view.container.querySelectorAll('.bench__tray .bench-part--wide');
      fireEvent.click(list[i] as HTMLElement);
      const notches = view.container.querySelectorAll('.bench__stage .bench__row .bench-part');
      fireEvent.click(notches[n] as HTMLElement);
      const svg = pick(view.container, '.bench__row svg[role="img"]', 0);
      const cap = (view.container.querySelectorAll('.bench__row figcaption')[1] as HTMLElement)?.textContent ?? '';
      plans.push(`<div class=cell><p class=t>${m.id} — ${m.views[n].id}</p>${svg}<p class=w>${cap}</p></div>`);
      view.unmount();
    }
  }

  writeFileSync(
    '/tmp/selshot/focus.html',
    `<!doctype html><meta charset="utf-8"><style>
      body{background:#f4f0e6;margin:0;padding:20px;font-family:Inter,system-ui,sans-serif;color:#22211b}
      h2{font-size:13px;letter-spacing:2px;color:#6b6757;margin:26px 0 10px;font-weight:600}
      .grid{display:flex;flex-wrap:wrap;gap:14px}
      .cell{width:330px}
      .cell svg{display:block;width:330px;height:auto;border:1px solid #ddd6c4;background:#f4f0e6}
      .t{font-size:11px;letter-spacing:1.4px;color:#6b6757;margin:0 0 4px;text-transform:uppercase}
      .w{font-size:12px;margin:6px 0 0;line-height:1.35}
     </style><body>
     <h2>WHAT HAPPENS NEXT — the drawn action, one per gesture</h2>
     <div class=grid>${cells.join('')}</div>
     <h2>BORROWED EYES — the room plan, per position</h2>
     <div class=grid>${plans.join('')}</div>`,
  );
});
