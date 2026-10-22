#!/usr/bin/env node
/**
 * Lint one Telugu & Tamil content file (src/languages/moments/*.ts,
 * rhymes/*.ts, books/*.ts, words.ts) in isolation.
 *
 *   node scripts/check-langs.mjs src/languages/moments/morning.ts [--urls list]
 */
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { basename, resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const file = process.argv[2];
const ui = process.argv.indexOf('--urls');
const KNOWN = ui > 0 ? new Set(readFileSync(process.argv[ui + 1], 'utf8').split(/\s+/).filter(Boolean)) : null;
const out = join(tmpdir(), `check-langs-${process.pid}-${basename(file)}.mjs`);
await build({ entryPoints: [resolve(file)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const mod = await import(pathToFileURL(out).href);

const problems = [];
const bad = (id, msg) => problems.push(`${id}: ${msg}`);
const TE = /[ఀ-౿]/;
const TA = /[஀-௿]/;
const LATIN = /[A-Za-z]/;
const CAST = ['Arjun', 'Mia', 'Amma', 'Nanna', 'Nanamma', 'Tatayya', 'Paati', 'Thatha'];
const REQUIRED = ['what', 'expect', 'practising', 'ask', 'next', 'honest'];

const said = (id, where, s, lang) => {
  if (!s || typeof s !== 'object') return bad(id, `${where}: missing`);
  const script = lang === 'te' ? TE : TA;
  const other = lang === 'te' ? TA : TE;
  if (!s.script || !script.test(s.script)) bad(id, `${where}: script must be in ${lang === 'te' ? 'Telugu' : 'Tamil'} letters`);
  if (s.script && other.test(s.script)) bad(id, `${where}: script mixes Telugu and Tamil`);
  if (s.script && LATIN.test(s.script)) bad(id, `${where}: script contains Latin letters`);
  if (!s.roman || !LATIN.test(s.roman) || TE.test(s.roman) || TA.test(s.roman)) bad(id, `${where}: roman must be plain Latin letters`);
  if (!s.means || s.means.length < 2) bad(id, `${where}: means required`);
};
const pair = (id, where, p) => {
  said(id, `${where}.te`, p?.te, 'te');
  said(id, `${where}.ta`, p?.ta, 'ta');
};
const note = (id, n) => {
  for (const k of REQUIRED) if (!n?.[k] || n[k].length < 25) bad(id, `note.${k} missing or short`);
  if (/\b(Mummy|Papa|Dadi|Dada|Jaipur)\b/.test(JSON.stringify(n))) bad(id, 'old household name in note');
};
const picture = (id, pic, cast) => {
  if (!pic || pic.length < 100) bad(id, 'picture under 100 characters');
  for (const c of cast ?? []) {
    if (!CAST.includes(c)) bad(id, `unknown cast ${c}`);
    if (!new RegExp(`\\b${c}\\b`).test(pic ?? '')) bad(id, `cast ${c} not named in picture`);
  }
  for (const c of CAST) if (new RegExp(`\\b${c}\\b`).test(pic ?? '') && !cast?.includes(c)) bad(id, `picture names ${c} but cast does not`);
  if (/\b(Mummy|Papa|Dadi|Dada|Jaipur)\b/.test(pic ?? '')) bad(id, 'old household name in picture');
};
const sources = (id, ss) => {
  if (!Array.isArray(ss) || !ss.length) return bad(id, 'sources required');
  for (const s of ss) {
    if (!/^https?:\/\//.test(s.url ?? '')) bad(id, `bad url ${s.url}`);
    else if (KNOWN && !KNOWN.has(s.url)) bad(id, `url not in research corpus: ${s.url}`);
  }
};

if (mod.MOMENTS) {
  for (const m of mod.MOMENTS) {
    const id = m.id;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) bad(id, 'id kebab-case');
    if (!m.title || m.title.length > 48) bad(id, 'title missing or long');
    if (!(m.grownUp?.length >= 2 && m.grownUp.length <= 5)) bad(id, 'grownUp: 2-5 lines');
    if (!(m.child?.length >= 1 && m.child.length <= 4)) bad(id, 'child: 1-4 lines');
    m.grownUp?.forEach((p, i) => pair(id, `grownUp[${i}]`, p));
    m.child?.forEach((p, i) => pair(id, `child[${i}]`, p));
    picture(id, m.picture, m.cast);
    sources(id, m.sources);
    note(id, m.note);
  }
  console.log(`${mod.MOMENTS.length} moments`);
} else if (mod.RHYMES) {
  for (const r of mod.RHYMES) {
    const id = r.id;
    said(id, 'title', r.title, r.lang);
    if (!(r.lines?.length >= 2 && r.lines.length <= 12)) bad(id, 'lines: 2-12');
    r.lines?.forEach((l, i) => said(id, `lines[${i}]`, l, r.lang));
    if (!r.origin || r.origin.length < 30) bad(id, 'origin: say where it comes from and why it is free to print');
    picture(id, r.picture, r.cast);
    sources(id, r.sources);
    note(id, r.note);
  }
  console.log(`${mod.RHYMES.length} rhymes`);
} else if (mod.BOOK) {
  const b = mod.BOOK;
  pair(b.id, 'title', b.title);
  if (!(b.pages?.length >= 6 && b.pages.length <= 12)) bad(b.id, 'pages: 6-12');
  b.pages?.forEach((pg, i) => {
    said(b.id, `p${i + 1}.te`, pg.te, 'te');
    said(b.id, `p${i + 1}.ta`, pg.ta, 'ta');
    picture(`${b.id} p${i + 1}`, pg.picture, pg.cast);
  });
  note(b.id, b.note);
  console.log(`book ${b.id}: ${b.pages?.length} pages`);
} else if (mod.WORDS) {
  for (const w of mod.WORDS) {
    pair(w.id, 'word', w);
    if (!w.picture || w.picture.length < 30) bad(w.id, 'picture prompt short');
  }
  console.log(`${mod.WORDS.length} words`);
} else {
  console.error('exports none of MOMENTS, RHYMES, BOOK, WORDS');
  process.exit(2);
}
for (const p of problems) console.log(`PROBLEM ${p}`);
console.log(problems.length ? `${problems.length} problems` : 'clean');
process.exit(problems.length ? 1 : 0);
