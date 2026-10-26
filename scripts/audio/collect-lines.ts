/**
 * Every line a read-aloud button can ask for, as JSON on stdout, for
 * scripts/audio/make-clips.py. It calls the same functions the screens call
 * (src/audio/lines.ts and the game shell's lines), so the build makes exactly
 * what the buttons play. Run under vite-node so import.meta.glob resolves:
 *
 *   npx vite-node scripts/audio/collect-lines.ts > lines.json
 *
 * Output: { "en": [...], "te": [...], "ta": [...] }, each a sorted list of
 * distinct normalised lines.
 */
import { BOOKS } from '../../src/books/registry';
import { ACTIVITIES } from '../../src/make/activities';
import { IDEAS } from '../../src/together';
import { MATHS_GAMES } from '../../src/maths/registry';
import { SCIENCE_GAMES } from '../../src/science/registry';
import { LANG_BOOKS, MOMENTS, RHYMES, WORDS } from '../../src/languages';
import { activityLead, activityStep, ideaLead, ideaStep, pageReading } from '../../src/audio/lines';
import { gameLines, SHELL_LINES } from '../../src/audio/gameLines';
import { textKey } from '../../src/audio/readAloud';
import { listenLines as whatHappensNext } from '../../src/sel/what-happens-next';
import { listenLines as theWideView } from '../../src/sel/the-wide-view';
import { listenLines as borrowedEyes } from '../../src/sel/borrowed-eyes';
import { listenLines as meantAndLanded } from '../../src/sel/meant-and-landed';
import { listenLines as beforeYouDecide } from '../../src/sel/before-you-decide';
import { listenLines as holdTheLine } from '../../src/sel/hold-the-line';
import { listenLines as oneSwingTwoKids } from '../../src/sel/one-swing-two-kids';
import { listenLines as fiveCookies } from '../../src/sel/five-cookies';
import { listenLines as notTheSameRule } from '../../src/sel/not-the-same-rule';
import { listenLines as bodyCheck } from '../../src/sel/body-check';
import { listenLines as putItBackTogether } from '../../src/sel/put-it-back-together';
import { listenLines as theFeelingRule } from '../../src/sel/the-feeling-rule';

const en = new Set<string>();
const te = new Set<string>();
const ta = new Set<string>();
const add = (set: Set<string>, xs: readonly string[]) => xs.forEach((x) => set.add(textKey(x)));

for (const b of BOOKS) b.pages.forEach((_, i) => add(en, pageReading(b, i)));
for (const a of ACTIVITIES) {
  add(en, activityLead(a));
  a.steps.forEach((_, i) => add(en, activityStep(a, i)));
}
for (const x of IDEAS) {
  add(en, ideaLead(x));
  x.steps.forEach((_, i) => add(en, ideaStep(x, i)));
}
for (const g of [...MATHS_GAMES, ...SCIENCE_GAMES]) add(en, gameLines(g));
add(en, SHELL_LINES);
// The twelve "Try a situation" exercises: each module lists every line its read buttons can play.
for (const lines of [whatHappensNext, theWideView, borrowedEyes, meantAndLanded, beforeYouDecide, holdTheLine, oneSwingTwoKids, fiveCookies, notTheSameRule, bodyCheck, putItBackTogether, theFeelingRule]) add(en, lines());

// Telugu & Tamil: every line that has a speaker button (computer fallback).
const pairs = [...MOMENTS.flatMap((m) => [...m.grownUp, ...m.child]), ...WORDS];
for (const p of pairs) {
  add(te, [p.te.script]);
  add(ta, [p.ta.script]);
}
for (const r of RHYMES) add(r.lang === 'te' ? te : ta, [r.title.script, ...r.lines.map((l) => l.script)]);
for (const b of LANG_BOOKS) {
  add(te, b.pages.map((p) => p.te.script));
  add(ta, b.pages.map((p) => p.ta.script));
}

const sorted = (s: Set<string>) => [...s].filter(Boolean).sort();
process.stdout.write(JSON.stringify({ en: sorted(en), te: sorted(te), ta: sorted(ta) }));
