#!/usr/bin/env node
/**
 * Check every book file on its own: does it parse, does it pass the reading
 * rules. The vitest suite imports all books through one registry, so a single
 * half-written file fails every book at once; this names the one that is
 * broken and still reports on the rest.
 *
 *     node scripts/check-books.mjs            # all
 *     node scripts/check-books.mjs <slug>...  # some
 */
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const dir = 'src/books/data';
const want = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
  .filter((f) => want.length === 0 || want.includes(f.replace(/\.ts$/, '')));

const words = (s) => s.split(/\s+/).filter(Boolean).length;
const sentences = (s) => s.replace(/\n+/g, ' ').split(/(?<=[.!?”])\s+(?=[“"A-Z])/).map((x) => x.trim()).filter(Boolean);

let bad = 0;
for (const f of files) {
  const out = `.check-books/${f.replace(/\.ts$/, '.mjs')}`;
  try {
    execFileSync('npx', ['esbuild', `${dir}/${f}`, '--format=esm', `--outfile=${out}`, '--log-level=error'], { stdio: 'pipe' });
  } catch (e) {
    console.log(`PARSE  ${f}: ${String(e.stderr).split('\n').find((l) => l.includes('ERROR')) ?? 'error'}`);
    bad += 1;
    continue;
  }
  const { book } = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
  const problems = [];
  if (book.pages.length < 10 || book.pages.length > 12) problems.push(`${book.pages.length} pages`);
  const prose = book.pages.filter((p) => !p.big).map((p) => words(p.text));
  const mean = prose.reduce((a, b) => a + b, 0) / prose.length;
  if (mean < 15 || mean > 38) problems.push(`mean ${mean.toFixed(1)} words/page`);
  book.pages.forEach((p, i) => {
    const n = words(p.text);
    if (p.big ? n > 8 : n > 50 || n < 8) problems.push(`p${i + 1} ${n} words`);
    for (const s of sentences(p.text)) if (words(s) > 16) problems.push(`p${i + 1} sentence of ${words(s)}`);
  });
  if (book.refrain) {
    const norm = (s) => s.toLowerCase().replace(/[“”"’'.,!?]/g, '');
    const hits = book.pages.filter((p) => norm(p.text).includes(norm(book.refrain))).length;
    if (hits < 2) problems.push(`refrain on ${hits} page(s)`);
  }
  const status = problems.length ? 'FIX  ' : 'ok   ';
  if (problems.length) bad += 1;
  console.log(`${status} ${book.slug.padEnd(36)} ${book.pages.length}p  mean ${mean.toFixed(1)}  ${problems.join('; ')}`);
}
console.log(`${files.length - bad}/${files.length} clean`);
process.exit(bad ? 1 : 0);
