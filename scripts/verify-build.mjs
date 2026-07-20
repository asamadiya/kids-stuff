/**
 * Build verifier: asserts dist/index.html asset references resolve under /kids-stuff/
 * and that all referenced files exist in the dist folder.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyMetadata } from './verify-metadata.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');
const indexPath = join(distDir, 'index.html');
const robotsPath = join(distDir, 'robots.txt');

const BASE = '/kids-stuff/';
const CANONICAL_ORIGIN = 'https://asamadiya.github.io';
const CANONICAL_BASE = `${CANONICAL_ORIGIN}${BASE}`;
const EXPECTED_ROBOTS_TXT = 'User-agent: *\nDisallow: /\n';

let errors = 0;

function fail(msg) {
  console.error(`  FAIL: ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`  PASS: ${msg}`);
}

// Ensure dist/index.html exists
if (!existsSync(indexPath)) {
  console.error('FAIL: dist/index.html does not exist — run npm run build first');
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf-8');
console.log('Verifying dist/index.html asset paths and metadata…\n');

// --- Root-relative paths (src/href that begin with '/') must start with BASE ---
// These are the JS bundles, CSS, favicon, etc. produced by Vite.
const rootRelativePattern = /(?:src|href)="(\/[^"]*(?:\.js|\.css|\.svg|\.png|\.ico|\.webmanifest)[^"]*)"/g;
const rootRefs = [];
let m;
while ((m = rootRelativePattern.exec(html)) !== null) {
  rootRefs.push(m[1]);
}

if (rootRefs.length === 0) {
  fail('No root-relative asset references found in dist/index.html');
} else {
  pass(`Found ${rootRefs.length} root-relative asset reference(s)`);
}

for (const ref of rootRefs) {
  if (!ref.startsWith(BASE)) {
    fail(`"${ref}" does not start with "${BASE}"`);
  } else {
    const relPath = ref.slice(BASE.length);
    const filePath = join(distDir, relPath);
    if (!existsSync(filePath)) {
      fail(`"${ref}" → dist/${relPath} does not exist`);
    } else {
      pass(`"${ref}" → dist/${relPath} ✓`);
    }
  }
}

// --- Absolute URLs in content attributes (og:image, twitter:image) ---
// These must use the canonical origin + BASE and the file must exist in dist.
const absContentPattern = /content="(https?:\/\/[^"]*(?:\.svg|\.png|\.jpg|\.webp)[^"]*)"/g;
while ((m = absContentPattern.exec(html)) !== null) {
  const url = m[1];
  if (!url.startsWith(CANONICAL_BASE)) {
    fail(`Social image "${url}" does not start with "${CANONICAL_BASE}"`);
  } else {
    const relPath = url.slice(CANONICAL_BASE.length);
    const filePath = join(distDir, relPath);
    if (!existsSync(filePath)) {
      fail(`"${url}" → dist/${relPath} does not exist`);
    } else {
      pass(`"${url}" → dist/${relPath} ✓`);
    }
  }
}

// --- Metadata: exact-value checks via pure verifyMetadata() ---
const metaFailures = verifyMetadata(html);
if (metaFailures.length === 0) {
  pass('All metadata present with correct exact values');
} else {
  for (const f of metaFailures) fail(f);
}

// --- Crawler policy: public site, but block crawling and indexing ---
if (!existsSync(robotsPath)) {
  fail('dist/robots.txt does not exist');
} else {
  const robotsTxt = readFileSync(robotsPath, 'utf-8');
  if (robotsTxt !== EXPECTED_ROBOTS_TXT) {
    fail(
      `dist/robots.txt content: expected ${JSON.stringify(EXPECTED_ROBOTS_TXT)}, got ${JSON.stringify(robotsTxt)}`
    );
  } else {
    pass('dist/robots.txt contains the exact crawler block');
  }
}

// Final result
console.log('');
if (errors > 0) {
  console.error(`${errors} assertion(s) failed — build verification RED`);
  process.exit(1);
} else {
  console.log('All assertions passed — build verification GREEN');
}
