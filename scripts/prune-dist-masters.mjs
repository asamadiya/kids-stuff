/**
 * Vite copies all of public/ into dist/, which would ship 2.2 GB of PNG
 * masters alongside the 304 MB of WebP derivatives the site actually requests.
 * The masters stay in the repo (they are the source the encoder reads); they
 * simply must not be deployed.
 */
import { readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist/art';
let removed = 0;
let bytes = 0;

const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.png')) {
      bytes += statSync(p).size;
      rmSync(p);
      removed += 1;
    }
  }
};

walk(root);
console.log(`pruned ${removed} masters from dist/art (${(bytes / 1024 ** 3).toFixed(2)} GB)`);
