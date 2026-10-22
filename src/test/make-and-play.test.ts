import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { ACTIVITIES, MAKE_AREAS } from '../make/activities';
import { IDEAS, PLAY_GROUPS } from '../together';
import { MATHS_GAMES } from '../maths/registry';
import { SCIENCE_GAMES } from '../science/registry';
import { REQUIRED_NOTE_FIELDS } from '../notes/types';
import { BOOKS } from '../books/registry';
import { MAKE_FIGURES } from '../make/figures';

/**
 * Make & Do and Play with Dad & Mom, as data: the parent asked for "more,
 * do research" and "50 different ways ... indoor / outdoor with simple things
 * that they have at home". The advisor's q7 rulings set the shape: every
 * activity and idea is sourced, carries a full grown-ups note with easier and
 * harder versions, and never uses what the rulings excluded.
 *
 * scripts/check-content.mjs runs the same rules on one file while it is being
 * written; this runs them on the whole collection.
 */

const PAIRS = new Set([...MATHS_GAMES, ...SCIENCE_GAMES].map((g) => g.id).concat(BOOKS.map((b) => b.slug)));
const EXCLUDED: ReadonlyArray<readonly [RegExp, string]> = [
  [/\b(meat|chicken|mutton|prawn|shrimp|beef|pork|bacon|lamb|keema|tuna|salmon|gelatin)\b/i, 'non-vegetarian food'],
  [/\btickl/i, 'tickling'],
  [/\b(throw|toss)(ing)? him\b/i, 'throwing the child'],
  [/\b(swing|swinging|spin|spinning) (him|the child) (round )?by (the )?(wrists?|arms?|ankles?|legs?|hands?)/i, 'swinging by limbs'],
  [/\bbutton batter/i, 'button battery'],
  [/\bRikki\b/, 'the reader as a character'],
];

describe('Make & Do', () => {
  it('has the first twelve and the researched additions, grouped in every area', () => {
    expect(ACTIVITIES.length).toBeGreaterThanOrEqual(36);
    for (const ar of MAKE_AREAS) expect(ACTIVITIES.filter((a) => a.area === ar.id).length, ar.id).toBeGreaterThanOrEqual(3);
  });

  it('links every activity to something on screen, or says why not', () => {
    for (const a of ACTIVITIES) expect(Boolean(a.pairsWith) || Boolean(a.noPair), a.id).toBe(true);
  });

  it('has unique ids', () => {
    expect(new Set(ACTIVITIES.map((a) => a.id)).size).toBe(ACTIVITIES.length);
  });

  it.each(ACTIVITIES.map((a) => [a.id, a] as const))('%s is complete, sourced and safe', (_id, a) => {
    for (const k of REQUIRED_NOTE_FIELDS) expect(a.note[k]?.length ?? 0, k).toBeGreaterThan(20);
    expect(a.note.safety, 'safety').toBeTruthy();
    expect(a.steps.length).toBeGreaterThanOrEqual(4);
    expect(a.steps.length).toBeLessThanOrEqual(6);
    if (a.pairsWith) expect(PAIRS.has(a.pairsWith), a.pairsWith).toBe(true);
    const text = JSON.stringify(a);
    for (const [re, why] of EXCLUDED) expect(re.test(text), why).toBe(false);
    a.steps.forEach((s, i) => {
      if (s.figure) expect(MAKE_FIGURES[s.figure], s.figure).toBeTypeOf('function');
      else expect(existsSync(`public/art/make/${a.id}/step-${i + 1}.webp`), `step-${i + 1}.webp`).toBe(true);
    });
  });

  it('cites a source for every activity added after the first twelve', () => {
    const later = ACTIVITIES.filter((a) => a.trial !== undefined || a.sources !== undefined);
    expect(later.length).toBeGreaterThanOrEqual(24);
    for (const a of later) {
      expect(a.sources?.length ?? 0, a.id).toBeGreaterThan(0);
      for (const s of a.sources ?? []) expect(s.url, a.id).toMatch(/^https?:\/\//);
      expect(a.trial?.length ?? 0, `${a.id} trial`).toBeGreaterThan(30);
    }
  });
});

describe('Play with Dad & Mom', () => {
  it('has exactly fifty ideas, in the advisor’s allocation across groups', () => {
    expect(IDEAS.length).toBe(50);
    for (const g of PLAY_GROUPS) expect(IDEAS.filter((x) => x.group === g.id).length, g.id).toBe(g.count);
  });

  it('has unique ids and both indoor and outdoor play', () => {
    expect(new Set(IDEAS.map((x) => x.id)).size).toBe(50);
    expect(IDEAS.filter((x) => x.where !== 'outdoors').length).toBeGreaterThanOrEqual(15);
    expect(IDEAS.filter((x) => x.where !== 'indoors').length).toBeGreaterThanOrEqual(15);
  });

  it('needs only household things for at least forty of the fifty (advisor ruling 8)', () => {
    expect(IDEAS.filter((x) => !x.exception).length).toBeGreaterThanOrEqual(40);
  });

  it('pictures dads and mums about equally', () => {
    const dad = IDEAS.filter((x) => x.cast.includes('Papa')).length;
    const mum = IDEAS.filter((x) => x.cast.includes('Mummy')).length;
    expect(Math.abs(dad - mum)).toBeLessThanOrEqual(8);
  });

  it('marks every idea that needs another grown-up for Mia as apart, and says so under Who', () => {
    for (const x of IDEAS) {
      const another = /another (grown-up|adult)|second (grown-up|adult)|other (grown-up|adult)/i.test(x.mia.text);
      if (another && x.mia.way !== 'apart') expect.fail(`${x.id}: Mia needs another grown-up but is '${x.mia.way}'`);
      if (x.mia.way === 'apart') expect(x.players, x.id).toMatch(/another grown-up|Mia/i);
    }
  });

  it('keeps no scores or points in any game', () => {
    for (const x of IDEAS) {
      const body = `${x.steps.join(' ')} ${x.hisWay} ${x.note.harder ?? ''} ${x.note.easier ?? ''}`;
      // "the point is" is fine; points scored are not.
      expect(/\b(\d+|score|scores|scoring|keep|earn|win|wins|get|gets|lose|loses)\s+(points?|score)\b|\bkeep(ing)? score\b|\bscore ?sheet\b|\btally of wins\b/i.test(body), x.id).toBe(false);
    }
  });

  it('includes the eight ideas the advisor required', () => {
    const ids = new Set(IDEAS.map((x) => x.id));
    for (const id of ['can-you-move-my-cushion', 'chidiya-udd', 'red-light-green-light-swap', 'you-run-the-shop', 'build-a-den-for-two', 'sock-ball-bowling', 'stapu-together', 'follow-my-explorer-trail']) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  it.each(IDEAS.map((x) => [x.id, x] as const))('%s is complete, sourced and safe', (_id, x) => {
    for (const k of REQUIRED_NOTE_FIELDS) expect(x.note[k]?.length ?? 0, k).toBeGreaterThan(20);
    expect(x.note.easier && x.note.harder, 'easier and harder').toBeTruthy();
    expect(x.steps.length).toBeGreaterThanOrEqual(3);
    expect(x.steps.length).toBeLessThanOrEqual(5);
    expect(x.sources.length).toBeGreaterThan(0);
    expect(x.cast).toContain('Arjun');
    if (x.contact) expect(/\b(stop|freeze)\b/i.test(`${x.steps.join(' ')} ${x.note.safety ?? ''}`), 'stop word').toBe(true);
    const text = JSON.stringify(x);
    for (const [re, why] of EXCLUDED) expect(re.test(text), why).toBe(false);
    expect(existsSync(`public/art/together/${x.id}.webp`), 'picture').toBe(true);
  });
});
