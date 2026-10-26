import { describe, expect, it, vi } from 'vitest';
import { textKey } from '../audio/readAloud';
import {
  BODYCHECK_META,
  BREATH_CARDS,
  CHECKS,
  COUNT_CHOOSE,
  COUNT_LENGTHS,
  COUNT_SAY,
  FIGURE_ASK,
  LISTEN,
  REGIONS,
  REMEDY_NAME,
  TRAY_LABEL,
  WAIT_THINGS,
  breathAt,
  countCue,
  countOne,
  describeChecks,
  describeMarks,
  listenLines,
  subsetsOf,
  type FigureAsk,
} from '../sel/body-check';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Every clip a Body Check read button can ask for must be one the build makes.
 * The walk below drives the same state the component holds (phase, marks,
 * checks, breath taps, count length, thing and count) through `LISTEN`, the
 * only way the component builds a button's words, and the reachable outputs
 * must be exactly `listenLines()`: nothing a button asks for is missing, and
 * nothing is baked that no button can ask for.
 */

const lines = listenLines();

/** Every `texts` any read button can carry, walked state by state. */
function reachable(): Set<string> {
  const out = new Set<string>();
  const add = (texts: readonly string[]) => texts.forEach((t) => out.add(t));
  add(LISTEN.head());
  for (const which of Object.keys(FIGURE_ASK) as FigureAsk[]) add(LISTEN.ask(which));
  add(LISTEN.places());
  add(LISTEN.checks());
  add(LISTEN.remedy());
  // The breath card turns on taps only; two cards, whatever the count.
  for (let taps = 0; taps < 40; taps += 1) add(LISTEN.breath(breathAt(taps).phase));
  // The count card: with or without a thing chosen, from the first dot to the last, at every length.
  for (const to of COUNT_LENGTHS) {
    for (const chosen of [false, true]) {
      let counted = 0;
      for (let i = 0; i <= to + 2; i += 1) {
        add(LISTEN.count(countCue(chosen, counted, to)));
        counted = countOne(counted, to);
      }
    }
  }
  add(LISTEN.countTo());
  add(LISTEN.wait());
  // The reading so far: any marks with any checks.
  for (const marks of subsetsOf(REGIONS.map((r) => r.id))) {
    for (const checks of subsetsOf(CHECKS.map((c) => c.id))) add(LISTEN.reading(marks, checks));
  }
  return out;
}

describe('Body Check: the lines the read buttons can play', () => {
  it('has no empty line, no two lines with one clip name, and none longer than 300 characters', () => {
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) {
      expect(l.trim(), JSON.stringify(l)).not.toBe('');
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    const keys = lines.map(textKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('holds every line any button can ask for in any reachable state, and nothing else', () => {
    const r = reachable();
    expect([...r].filter((t) => !lines.includes(t))).toEqual([]);
    expect(lines.filter((t) => !r.has(t))).toEqual([]);
  });

  it('splits the reading into its two halves, each baked whole: 64 for the marks, 32 for the checks', () => {
    const marks = new Set(subsetsOf(REGIONS.map((r) => r.id)).map(describeMarks));
    const checks = new Set(subsetsOf(CHECKS.map((c) => c.id)).map(describeChecks));
    expect(marks.size).toBe(2 ** REGIONS.length);
    expect(checks.size).toBe(2 ** CHECKS.length);
    for (const l of [...marks, ...checks]) expect(lines).toContain(l);
  });

  it('reads each tray as its label and then every choice in it, in screen order', () => {
    expect(LISTEN.places()).toEqual([TRAY_LABEL.places, ...REGIONS.map((r) => r.signal)]);
    expect(LISTEN.checks()).toEqual([TRAY_LABEL.checks, ...CHECKS.map((c) => c.label)]);
    expect(LISTEN.remedy()).toEqual([TRAY_LABEL.remedy, REMEDY_NAME.breath, REMEDY_NAME.count]);
    expect(LISTEN.countTo()).toEqual([TRAY_LABEL.countTo, '10', '20', '30']);
    expect(LISTEN.wait()).toEqual([TRAY_LABEL.wait, ...WAIT_THINGS.map((w) => w.label)]);
    expect(LISTEN.head()).toEqual([BODYCHECK_META.title, BODYCHECK_META.note]);
    expect(LISTEN.breath('out')).toEqual([BREATH_CARDS.out.title, BREATH_CARDS.out.how]);
  });

  it('says the count cue the card shows: choose a thing, say the next number, or the count is done', () => {
    expect(countCue(false, 0, 20).line).toBe(COUNT_CHOOSE);
    expect(countCue(true, 3, 20).line).toBe(COUNT_SAY);
    expect(countCue(true, 20, 20).line).toBe('You counted to 20.');
  });

  it('never echoes a number he is counting, nor a breath tally', () => {
    for (let n = 1; n <= 30; n += 1) expect(lines).not.toContain(`I said ${n}`);
    expect(lines.some((l) => /slow breaths?$/.test(l))).toBe(false);
  });
});
