#!/usr/bin/env node
/**
 * Render the story diagrams and measure them.
 *
 * A figure is code, so it can be wrong in ways that typecheck and test green:
 * the first draft of these two put five labels outside the viewBox — where the
 * browser simply clips them — and ran a sixth straight through the screw
 * shaft. Neither is visible to vitest, and neither is visible to a person
 * reading the source.
 *
 * So: server-render the figures, open them in a real browser, ask the browser
 * where every `<text>` actually landed, and write a PNG for a person to look
 * at. `getBBox()` is layout truth; estimating text widths from character
 * counts is not.
 *
 *     node scripts/verify-figures.mjs            # measure and shoot
 *     node scripts/verify-figures.mjs --open     # also print the PNG path
 *
 * Chromium lives outside the repo on this box (see the headless-render notes),
 * so the script skips with a clear message rather than failing when it is
 * absent. It is a tool for the author, not a CI gate — the CI gate is
 * src/test/story-figures.test.ts, which checks what static analysis can.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const CHROME = '/tmp/chs/chrome-headless-shell-linux64/chrome-headless-shell';
const PPTR = '/tmp/pptr/node_modules/puppeteer-core';
const OUT = 'artifacts';
const WORK = '.figure-render';

const FIGURES = [
  ['olive-the-stone', 'OliveTheStone', 'page 3'],
  ['olive-screw-and-nut', 'OliveScrewAndNut', 'page 7'],
  ['olive-the-long-bar', 'OliveTheLongBar', 'page 9'],
  ['olive-the-squeeze', 'OliveTheSqueeze', 'page 11'],
];

mkdirSync(OUT, { recursive: true });
mkdirSync(WORK, { recursive: true });

const entry = `${WORK}/ssr.tsx`;
writeFileSync(entry, `
import { renderToStaticMarkup } from 'react-dom/server';
${FIGURES.map(([, comp]) => `import { ${comp} } from '../src/components/figures/${comp}';`).join('\n')}
const css = \`
  body { margin:0; background:#e8e2d4; font-family: Inter, system-ui, sans-serif; }
  .wrap { width: 1000px; margin: 0 auto; padding: 24px; }
  .story-figure { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
  .story-figure__svg { display:block; width:100%; min-width:34rem; aspect-ratio:4/3;
    border:1px solid #c8bfa9; border-radius:10px; background:#f7f1e4; }
  .story-figure__svg text { font-family: Inter, system-ui, sans-serif; }
  .story-figure__lead { font-size:23px; font-weight:600; }
  .story-figure__note { font-size:19px; }
  h2 { font-size:15px; color:#6b6757; margin:0 0 6px; font-weight:600; }
\`;
const body = [
${FIGURES.map(([id, comp, page]) => `  '<h2>${page} &mdash; ${id}</h2><div class="story-figure">' + renderToStaticMarkup(<${comp} />) + '</div>'`).join(',\n')}
].join('');
process.stdout.write('<!doctype html><meta charset="utf-8"><style>' + css + '</style><div class="wrap">' + body + '</div>');
`);

execFileSync('npx', ['esbuild', entry, '--bundle', '--platform=node', '--format=cjs',
  '--jsx=automatic', `--outfile=${WORK}/ssr.cjs`, '--log-level=error'], { stdio: 'inherit' });
const html = execFileSync('node', [`${WORK}/ssr.cjs`], { encoding: 'utf8', maxBuffer: 1 << 24 });
writeFileSync(`${WORK}/figures.html`, html);

if (!existsSync(CHROME) || !existsSync(PPTR)) {
  console.log(`no headless chromium at ${CHROME}; wrote ${WORK}/figures.html only`);
  process.exit(0);
}

const require = createRequire(import.meta.url);
const puppeteer = require(PPTR);
const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
         '--disable-gpu', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1048, height: 1200, deviceScaleFactor: 2 });
await page.goto(`file://${process.cwd()}/${WORK}/figures.html`, { waitUntil: 'networkidle0' });
await page.setViewport({
  width: 1048,
  height: await page.evaluate(() => document.body.scrollHeight),
  deviceScaleFactor: 2,
});

const report = await page.evaluate(() => {
  const PAPER = '#f7f1e4';
  const overlaps = (a, b) =>
    a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
  const out = [];
  for (const svg of document.querySelectorAll('svg')) {
    const vb = svg.viewBox.baseVal;
    const texts = [...svg.querySelectorAll('text')].map((t) => ({ t, b: t.getBBox() }));

    // Painted shapes. Leader lines and arrows are stroke-only (fill="none"),
    // so they are excluded — a label is allowed to sit beside its own leader.
    const solids = [...svg.querySelectorAll('rect, circle, path')]
      .filter((el) => {
        const fill = (el.getAttribute('fill') || '').toLowerCase();
        return fill && fill !== 'none' && fill !== PAPER;
      })
      .map((el) => ({ el, b: el.getBBox() }));

    for (const { t, b } of texts) {
      if (b.x < 0 || b.y < 0 || b.x + b.width > vb.width || b.y + b.height > vb.height) {
        out.push({ kind: 'outside the viewBox', text: t.textContent.trim() });
      }
      // The defect a text-only check cannot see: a label lying across the
      // drawing. "cannot move." reached the screw thread and measured clean.
      const hit = solids.find((s) => overlaps(b, s.b));
      if (hit) {
        out.push({
          kind: `label lies across a ${hit.el.tagName} (fill ${hit.el.getAttribute('fill')})`,
          text: t.textContent.trim(),
        });
      }
    }
    for (let i = 0; i < texts.length; i += 1) {
      for (let j = i + 1; j < texts.length; j += 1) {
        if (overlaps(texts[i].b, texts[j].b)) {
          out.push({ kind: 'labels overlap', text: `${texts[i].t.textContent.trim()} / ${texts[j].t.textContent.trim()}` });
        }
      }
    }
  }
  return out;
});

const shot = `${OUT}/story-figures.png`;
await page.screenshot({ path: shot, fullPage: true });
await browser.close();

for (const r of report) console.log(`  ${r.kind}: ${r.text}`);
console.log(report.length === 0 ? 'measured clean' : `${report.length} placement problem(s)`);
console.log(`wrote ${shot} — LOOK at it. Measurement cannot tell you whether the drawing explains anything.`);
process.exit(report.length === 0 ? 0 : 1);
