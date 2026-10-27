import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { textKey } from '../audio/readAloud';
import {
  CHOICES, LISTEN, ONE_SWING_TWO_KIDS_META, PLANS, SCENARIOS, TRAY_PICK, TRAY_SETTLED,
  choiceLabel, choose, isSettled, listenLines, reachablePaths, replyOf, saidLine, storyLine, storyLines,
  trayLine, trayRefused,
} from '../sel/one-swing-two-kids';
import type { ChoiceId, Scenario } from '../sel/one-swing-two-kids';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Every line a read button in One Swing, Two Kids can ask for must be one the
 * clip builder makes, or the button says "No recording of this yet."
 */

/** The paths a child can walk, found independently of `reachablePaths`: any order, each plan once, until one goes ahead. */
const walk = (s: Scenario): (readonly ChoiceId[])[] => {
  const out: (readonly ChoiceId[])[] = [];
  const go = (tried: readonly ChoiceId[]): void => {
    out.push(tried);
    if (isSettled(s, tried)) return;
    for (const c of CHOICES) if (!tried.includes(c)) go([...tried, c]);
  };
  go([]);
  return out;
};

/** What each button on screen reads in this state, mirroring the component's render. */
const buttonsIn = (s: Scenario, tried: readonly ChoiceId[]): (readonly string[])[] => [
  LISTEN.head(),
  LISTEN.setup(s),
  LISTEN.plans(s, tried),
  ...tried.map((c) => LISTEN.story(s, c)),
];

describe('one-swing-two-kids: listenLines', () => {
  const lines = listenLines();

  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    expect(lines.every((l) => textKey(l).length > 0)).toBe(true);
    expect(new Set(lines.map(textKey)).size).toBe(lines.length);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('walks the same paths the bench can reach', () => {
    for (const s of SCENARIOS) expect(reachablePaths(s), s.id).toEqual(walk(s));
    // The walk is the bench's own rule: `choose` refuses exactly what the walk skips.
    for (const s of SCENARIOS) {
      for (const tried of walk(s)) {
        for (const c of CHOICES) {
          const next = choose(s, tried, c);
          if (isSettled(s, tried) || tried.includes(c)) expect(next).toBe(tried);
          else expect(next).toEqual([...tried, c]);
        }
      }
    }
  });

  it('covers every line every button reads in every reachable state, and holds nothing unreachable', () => {
    const have = new Set(lines.map(textKey));
    const asked = SCENARIOS.flatMap((s) => walk(s).flatMap((tried) => buttonsIn(s, tried))).flat();
    expect(asked.filter((t) => !have.has(textKey(t)))).toEqual([]);
    const reached = new Set(asked.map(textKey));
    expect(lines.filter((l) => !reached.has(textKey(l)))).toEqual([]);
  });

  it('is the audit’s list less the two refusal lines no child can ever see', () => {
    // The audit's Tier A for this exercise (sel-audit-enumerate.ts), verbatim.
    const audit = new Set([
      ONE_SWING_TWO_KIDS_META.title, ONE_SWING_TWO_KIDS_META.note,
      'What will you say? Pick a plan.', 'That is what happened.',
      ...SCENARIOS.flatMap((s) => [
        s.where, s.about, `${s.other} did not go along with it. Pick another plan, or ask a grown-up.`,
        ...CHOICES.flatMap((c) => [choiceLabel(s, c), saidLine(s, c), s.replies[c].says]),
      ]),
    ]);
    expect(audit.size).toBe(74);
    expect(lines.filter((l) => !audit.has(l))).toEqual([]);
    // Tomas and Ravi go along with every plan, so their refusal line is never on screen.
    const takeEverything = SCENARIOS.filter((s) => PLANS.every((p) => replyOf(s, p).settled));
    expect(takeEverything.map((s) => s.id)).toEqual(['console', 'snack']);
    expect([...audit].filter((l) => !lines.includes(l)).sort()).toEqual(takeEverything.map(trayRefused).sort());
    expect(lines).toHaveLength(72);
  });

  it('reads the visible words: the tray line as shown, each story line as its two sentences', () => {
    expect(TRAY_PICK).toBe('What will you say? Pick a plan.');
    expect(TRAY_SETTLED).toBe('That is what happened.');
    for (const s of SCENARIOS) {
      expect(LISTEN.setup(s)).toEqual([s.where, s.about]);
      for (const tried of walk(s)) {
        const plans = LISTEN.plans(s, tried);
        expect(plans[0]).toBe(trayLine(s, tried));
        expect(plans.slice(1)).toEqual(CHOICES.map((c) => choiceLabel(s, c)));
        // The words shown under the pictures are exactly the atoms, joined by one space.
        expect(storyLines(s, tried)).toEqual(tried.map((c) => LISTEN.story(s, c).join(' ')));
        for (const c of tried) expect(LISTEN.story(s, c).join(' ')).toBe(storyLine(s, c));
      }
      expect(trayLine(s, [])).toBe(TRAY_PICK);
      expect(trayLine(s, ['grown-up'])).toBe(TRAY_SETTLED);
    }
  });

  it('never reads the grown-up’s guide', () => {
    const guides = SCENARIOS.flatMap((s) => (s.guide === null ? [] : [textKey(s.guide)]));
    expect(guides.length).toBeGreaterThan(0);
    expect(lines.map(textKey).filter((l) => guides.includes(l))).toEqual([]);
  });

  it('has no say( left in the component', () => {
    const src = readFileSync('src/components/sel/OneSwingTwoKids.tsx', 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
  });
});
