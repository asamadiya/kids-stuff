import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { BOOKS } from '../books/registry';
import { ACTIVITIES } from '../make/activities';
import { IDEAS } from '../together';
import { MATHS_GAMES } from '../maths/registry';
import { SCIENCE_GAMES } from '../science/registry';
import { LANG_BOOKS, MOMENTS, RHYMES, WORDS } from '../languages';
import { activityLead, activityStep, ideaLead, ideaStep, pageReading } from '../audio/lines';
import { gameLines, SHELL_LINES } from '../audio/gameLines';
import { textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';

/**
 * Every read-aloud button asks for a line the build made. The manifest is
 * checked when it exists (after scripts/audio/make-clips.py has run); a line
 * with no clip would make its button say "No recording of this yet".
 */
const MANIFEST = 'public/audio/manifest.json';
const manifest: Manifest | null = existsSync(MANIFEST) ? (JSON.parse(readFileSync(MANIFEST, 'utf8')) as Manifest) : null;

const english: string[] = [
  ...BOOKS.flatMap((b) => b.pages.flatMap((_, i) => pageReading(b, i))),
  ...ACTIVITIES.flatMap((a) => [...activityLead(a), ...a.steps.flatMap((_, i) => activityStep(a, i))]),
  ...IDEAS.flatMap((x) => [...ideaLead(x), ...x.steps.flatMap((_, i) => ideaStep(x, i))]),
  ...[...MATHS_GAMES, ...SCIENCE_GAMES].flatMap(gameLines),
  ...SHELL_LINES,
];
const family = {
  te: [
    ...[...MOMENTS.flatMap((m) => [...m.grownUp, ...m.child]), ...WORDS].map((p) => p.te.script),
    ...RHYMES.filter((r) => r.lang === 'te').flatMap((r) => [r.title.script, ...r.lines.map((l) => l.script)]),
    ...LANG_BOOKS.flatMap((b) => b.pages.map((p) => p.te.script)),
  ],
  ta: [
    ...[...MOMENTS.flatMap((m) => [...m.grownUp, ...m.child]), ...WORDS].map((p) => p.ta.script),
    ...RHYMES.filter((r) => r.lang === 'ta').flatMap((r) => [r.title.script, ...r.lines.map((l) => l.script)]),
    ...LANG_BOOKS.flatMap((b) => b.pages.map((p) => p.ta.script)),
  ],
};

describe('read-aloud lines', () => {
  it('reads book page 1 with its title and later pages without', () => {
    const b = BOOKS[0];
    expect(pageReading(b, 0)[0]).toBe(b.title);
    expect(pageReading(b, 1)).not.toContain(b.title);
  });

  it('never reads the grown-up notes, safety lines or sources', () => {
    const adult = new Set(
      [...BOOKS.map((b) => b.note), ...ACTIVITIES.map((a) => a.note), ...IDEAS.map((x) => x.note)].flatMap((n) => Object.values(n).map((v) => textKey(String(v)))),
    );
    const leaked = english.map(textKey).filter((l) => adult.has(l));
    expect(leaked).toEqual([]);
  });

  it('keeps every line short enough for one clip', () => {
    const long = english.filter((l) => l.length > 600);
    expect(long).toEqual([]);
  });
});

describe.runIf(manifest)('the clip manifest', () => {
  it.each(['mom', 'dad'] as const)('%s voice has a clip for every English line', (who) => {
    const have = manifest![who]?.en ?? {};
    const missing = [...new Set(english.map(textKey))].filter((l) => !have[l]);
    expect(missing.slice(0, 10)).toEqual([]);
  });

  it.each([
    ['mom', 'te'],
    ['mom', 'ta'],
    ['dad', 'te'],
    ['dad', 'ta'],
  ] as const)('%s voice has a %s clip for every Telugu or Tamil line', (who, lang) => {
    const have = manifest![who]?.[lang] ?? {};
    const missing = [...new Set(family[lang].map(textKey))].filter((l) => !have[l]);
    expect(missing).toEqual([]);
  });
});
