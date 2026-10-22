#!/usr/bin/env node
/**
 * Lint one Make & Do or Play Together content file in isolation, so several
 * authors can work in one tree without each other's half-written files
 * failing their checks.
 *
 *   node scripts/check-content.mjs src/make/more/air.ts
 *   node scripts/check-content.mjs src/together/ideas/rough.ts
 *
 * Prints one line per problem and exits 1 if there are any. The same rules run
 * over the whole collection in src/test/make-and-play.test.ts.
 */
import { build } from 'esbuild';
import { readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: check-content.mjs <file> [--urls <list>]'); process.exit(2); }
// --urls: a file of URLs that research actually fetched. Every source cited must be on it,
// so a plausible-looking but invented link cannot get in.
const ui = process.argv.indexOf('--urls');
const KNOWN = ui > 0 ? new Set(readFileSync(process.argv[ui + 1], 'utf8').split(/\s+/).filter(Boolean)) : null;
const out = join(tmpdir(), `check-${process.pid}-${basename(file)}.mjs`);
await build({ entryPoints: [resolve(file)], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const mod = await import(pathToFileURL(out).href);

const ids = (dir, re) => readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => re.exec(readFileSync(join(dir, f), 'utf8'))?.[1]).filter(Boolean);
const GAMES = new Set([...ids('src/maths/games', /\bid:\s*'([a-z0-9-]+)'/), ...ids('src/science/games', /\bid:\s*'([a-z0-9-]+)'/),
  ...readdirSync('src/books/data').filter((f) => f.endsWith('.ts') && !f.startsWith('_')).map((f) => f.replace(/\.ts$/, ''))]);
const FIRST = [...readFileSync('src/make/activities.ts', 'utf8').matchAll(/^\s{4}id: '([a-z0-9-]+)'/gm)].map((m) => m[1]);

const problems = [];
const bad = (id, msg) => problems.push(`${id}: ${msg}`);
const REQUIRED = ['what', 'expect', 'practising', 'ask', 'next', 'honest'];
const words = (s) => s.trim().split(/\s+/).length;

// Things the standing rules and the advisor's q7 rulings forbid outright.
const BANNED = [
  [/\b(meat|chicken|fish(?!ing line)|mutton|prawn|shrimp|beef|pork|bacon|ham|lamb|keema|tuna|salmon|gelatin)\b/i, 'non-vegetarian food (lacto-ovo vegetarian household)'],
  [/\bballoons?\b(?![^.]*\b(never|no|not|instead|swap|choking)\b)/i, 'balloon without a "not/instead" (choking hazard to age 8)'],
  [/\b(candle|lighter|matchstick|flame|stove-top|boiling)\b(?![^.]*\b(no|never|not|grown-up|adult)\b)/i, 'flame or boiling heat without adult-only wording'],
  [/\bbutton batter/i, 'button battery'],
  [/\bneodymium|rare-earth\b/i, 'powerful magnet'],
  [/\btickl/i, 'tickling (excluded: laughter can be involuntary)'],
  [/\b(swing|swinging|spin|spinning) (him|the child) (round )?by (the )?(wrists?|arms?|ankles?|legs?|hands?)/i, 'swinging by limbs (excluded)'],
  [/\b(throw|toss)(ing)? him\b/i, 'throwing the child (excluded)'],
  [/\b(pin|pins|pinning|hold) (him|her) down\b|\bpinned\b/i, 'pinning or holding down (excluded)'],
  [/\b(push-?ups|sit-?ups|laps) as (a )?(punishment|forfeit)|\bforfeit\b|\bloser (has to|must)\b/i, 'punishment or humiliation (excluded)'],
  [/\bRikki\b/, 'the reader is not a character: say Arjun in pictures, "he" in notes'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'emoji'],
  [/\b(amazing|awesome|magic(al)?|super fun|so much fun)\b/i, 'hype word'],
];

const scan = (id, label, text) => {
  for (const [re, why] of BANNED) if (re.test(text)) bad(id, `${label}: ${why} — "${text.match(re)[0]}"`);
};

const noteCheck = (id, note, { needEasierHarder, needSafety }) => {
  for (const k of REQUIRED) if (!note?.[k] || note[k].length < 25) bad(id, `note.${k} missing or under 25 characters`);
  if (needEasierHarder) for (const k of ['easier', 'harder']) if (!note?.[k]) bad(id, `note.${k} required`);
  if (needSafety && !note?.safety) bad(id, 'note.safety required');
  for (const [k, v] of Object.entries(note ?? {})) scan(id, `note.${k}`, String(v));
};

const sourceCheck = (id, sources) => {
  if (!Array.isArray(sources) || sources.length === 0) return bad(id, 'at least one source required');
  for (const s of sources) {
    if (!/^https?:\/\/\S+$/.test(s.url ?? '')) bad(id, `source url invalid: ${s.url}`);
    else if (KNOWN && !KNOWN.has(s.url)) bad(id, `source url not in the research corpus (use one research fetched): ${s.url}`);
    if (!s.label || s.label.length < 8) bad(id, 'source label too short');
  }
};

if (mod.MORE) {
  const area = basename(file, '.ts');
  const seen = new Set();
  for (const a of mod.MORE) {
    const id = a.id ?? '(no id)';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) bad(id, 'id must be kebab-case');
    if (seen.has(id) || FIRST.includes(id)) bad(id, 'duplicate id');
    seen.add(id);
    if (a.area !== area) bad(id, `area must be '${area}' (the file name)`);
    if (!a.title || a.title.length > 60) bad(id, 'title missing or over 60 characters');
    if (!a.hook || a.hook.length > 70) bad(id, 'hook missing or over 70 characters');
    const PLACES = ['kitchen', 'garden', 'outdoors', 'table'];
    if (!PLACES.includes(a.where)) bad(id, 'where invalid');
    for (const p of a.places ?? []) if (!PLACES.includes(p) || p === a.where) bad(id, `places: ${p} invalid or repeats where`);
    if (!(a.minutes >= 5 && a.minutes <= 60)) bad(id, 'minutes must be 5-60');
    if (a.span && a.span.length > 28) bad(id, 'span over 28 characters');
    if (!(a.need?.length >= 2 && a.need.length <= 10)) bad(id, 'need: 2-10 items');
    if (!(a.steps?.length >= 4 && a.steps.length <= 6)) bad(id, 'steps: 4-6');
    a.steps?.forEach((s, i) => {
      if (!s.text || words(s.text) > 22) bad(id, `step ${i + 1} text missing or over 22 words`);
      if (!s.art || s.art.length < 120) bad(id, `step ${i + 1} art under 120 characters`);
      if (s.art && !/\bArjun\b/.test(s.art) && !/\b(close-up|close up)\b/i.test(s.art)) bad(id, `step ${i + 1} art must show Arjun (or say close-up)`);
      scan(id, `step ${i + 1}`, `${s.text} ${s.art}`);
    });
    if (!a.notice || !a.ask) bad(id, 'notice and ask required');
    if (a.pairsWith && !GAMES.has(a.pairsWith)) bad(id, `pairsWith '${a.pairsWith}' is not a game id`);
    if (!a.trial || a.trial.length < 40) bad(id, 'trial (what the grown-up tries alone first) required');
    sourceCheck(id, a.sources);
    scan(id, 'card', `${a.title} ${a.hook} ${a.need?.join(' ')} ${a.notice} ${a.ask} ${a.trial}`);
    noteCheck(id, a.note, { needEasierHarder: true, needSafety: true });
  }
  console.log(`${mod.MORE.length} activities in ${file}`);
} else if (mod.IDEAS) {
  const group = basename(file, '.ts');
  const CAST = ['Arjun', 'Mia', 'Mummy', 'Papa', 'Dadi', 'Dada'];
  const seen = new Set();
  for (const x of mod.IDEAS) {
    const id = x.id ?? '(no id)';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) bad(id, 'id must be kebab-case');
    if (seen.has(id)) bad(id, 'duplicate id');
    seen.add(id);
    if (x.group !== group) bad(id, `group must be '${group}' (the file name)`);
    if (!x.title || x.title.length > 48) bad(id, 'title missing or over 48 characters');
    if (!x.hook || x.hook.length > 70) bad(id, 'hook missing or over 70 characters');
    if (!['indoors', 'outdoors', 'either'].includes(x.where)) bad(id, 'where invalid');
    if (!['quiet', 'active'].includes(x.energy)) bad(id, 'energy invalid');
    if (typeof x.contact !== 'boolean') bad(id, 'contact must be true or false');
    if (![5, 15, 30].includes(x.minutes)) bad(id, 'minutes must be 5, 15 or 30');
    if (!x.setup || !x.players) bad(id, 'setup and players required');
    if (!Array.isArray(x.need)) bad(id, 'need must be an array (empty if nothing)');
    if (!(x.steps?.length >= 3 && x.steps.length <= 5)) bad(id, 'steps: 3-5');
    x.steps?.forEach((s, i) => { if (words(s) > 30) bad(id, `step ${i + 1} over 30 words`); scan(id, `step ${i + 1}`, s); });
    if (!x.hisWay) bad(id, 'hisWay required');
    if (!['joins', 'alongside', 'apart'].includes(x.mia?.way) || !x.mia?.text) bad(id, 'mia.way and mia.text required');
    if (!x.picture || x.picture.length < 120) bad(id, 'picture under 120 characters');
    if (!(x.cast?.includes('Arjun') && x.cast.some((c) => ['Mummy', 'Papa', 'Dadi', 'Dada'].includes(c)))) bad(id, 'cast must include Arjun and a grown-up');
    for (const c of x.cast ?? []) {
      if (!CAST.includes(c)) bad(id, `unknown cast ${c}`);
      if (!new RegExp(`\\b${c}\\b`).test(x.picture ?? '')) bad(id, `cast ${c} not named in picture`);
    }
    for (const c of CAST) if (new RegExp(`\\b${c}\\b`).test(x.picture ?? '') && !x.cast?.includes(c)) bad(id, `picture names ${c} but cast does not`);
    if (x.cast?.some((c) => c === 'Dadi' || c === 'Dada') && x.cast.some((c) => c === 'Mummy' || c === 'Papa')) bad(id, 'a picture has grandparents OR parents, not both (one reference sheet per picture)');
    if (x.mia?.way === 'joins' && !x.cast?.includes('Mia')) bad(id, 'Mia joins: put her in the cast and the picture');
    sourceCheck(id, x.sources);
    scan(id, 'card', `${x.title} ${x.hook} ${x.need?.join(' ')} ${x.hisWay} ${x.mia?.text} ${x.picture} ${x.exception ?? ''} ${x.tradition ?? ''}`);
    if (x.contact && !/\b(stop|freeze)\b/i.test(`${x.steps?.join(' ')} ${x.note?.safety ?? ''}`)) bad(id, 'contact play needs the stop word in the steps or safety');
    if (/\bblindfold/i.test(JSON.stringify(x)) && x.energy === 'active') bad(id, 'blindfold in an active game (excluded: collisions)');
    noteCheck(id, x.note, { needEasierHarder: true, needSafety: x.contact || x.energy === 'active' || x.where !== 'indoors' });
  }
  console.log(`${mod.IDEAS.length} ideas in ${file}`);
} else {
  console.error('file exports neither MORE nor IDEAS');
  process.exit(2);
}
for (const p of problems) console.log(`PROBLEM ${p}`);
console.log(problems.length ? `${problems.length} problems` : 'clean');
process.exit(problems.length ? 1 : 0);
