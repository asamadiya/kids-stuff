import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
const root = process.env.REPO;
const html = readFileSync('/tmp/selshot/focus.html', 'utf8')
  .replaceAll('src="/games/', `src="file://${root}/public/games/`);
const b = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'] });
const p = await b.newPage({ viewport: { width: 1090, height: 1200 }, deviceScaleFactor: 1.4 });
await p.setContent(html);
await p.waitForTimeout(900);
await p.screenshot({ path: '/tmp/selshot/focus.png', fullPage: true });
await b.close();
console.log('rendered');
