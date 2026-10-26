import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { textKey } from '../audio/readAloud';
import {
  DOORWAY_NOTE, EMPTY_PICK, HOLDTHELINE_META, LISTEN, PICK_FIRST, SAY_IT, SCENARIOS, SLOTS, SLOT_LABELS,
  allSaid, chipsFor, isComplete, lineOf, listenLines, outcomeOf, promptText, sayPart, shownPanel, wordsFor,
} from '../sel/hold-the-line';
import type { ChipId, Outcome, Pick, Scenario, SlotKind } from '../sel/hold-the-line';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Every line a read button in Hold the Line can ask for must be one the clip
 * builder makes, or the button says "No recording of this yet."
 */

/** The bench's state, as the component holds it. `runs` only matters as zero or not, so it is capped at 2. */
interface State {
  readonly pick: Pick;
  readonly phase: 'build' | 'said';
  readonly said: number;
  readonly runs: number;
}

const withSlot = (pick: Pick, slot: SlotKind, id: ChipId | null): Pick => ({ ...pick, [slot]: id });
const sayingIdOf = (st: State): ChipId | null =>
  (isComplete(st.pick) && st.phase === 'build' && !allSaid(st.said) ? st.pick[SLOTS[st.said]] : null);
const outcomeIn = (s: Scenario, st: State): Outcome | null => (st.phase === 'said' ? outcomeOf(s, st.pick) : null);

/** The component's transitions, replayed from its handlers: place, say the next part, change the last part. */
const moves = (s: Scenario, st: State): State[] => {
  const out: State[] = [];
  if (st.phase === 'build') {
    for (const slot of SLOTS) {
      for (const c of chipsFor(s, slot)) {
        out.push({ ...st, pick: withSlot(st.pick, slot, st.pick[slot] === c.id ? null : c.id), said: 0 });
      }
    }
    if (sayingIdOf(st)) {
      const said = sayPart(st.said);
      out.push(allSaid(said) ? { ...st, said, phase: 'said', runs: Math.min(2, st.runs + 1) } : { ...st, said });
    }
  } else if (outcomeIn(s, st) === 'goes-on') {
    out.push({ ...st, pick: withSlot(st.pick, 'next', null), phase: 'build', said: 0 });
  }
  return out;
};

/** Every state the bench can reach in one place, from a fresh start. */
const reachable = (s: Scenario): State[] => {
  const key = (st: State) => JSON.stringify(st);
  const start: State = { pick: EMPTY_PICK, phase: 'build', said: 0, runs: 0 };
  const seen = new Map([[key(start), start]]);
  const queue = [start];
  while (queue.length) {
    for (const n of moves(s, queue.shift() as State)) {
      if (!seen.has(key(n))) { seen.set(key(n), n); queue.push(n); }
    }
  }
  return [...seen.values()];
};

/** What each read button on screen reads in this state, mirroring the component's render. */
const buttonsIn = (s: Scenario, st: State): (readonly string[])[] => [
  LISTEN.title(),
  LISTEN.picture(s, outcomeIn(s, st)),
  ...(st.phase === 'build' ? SLOTS.map((slot) => LISTEN.tray(s, slot, st.runs)) : []),
  ...(st.phase === 'build' ? [LISTEN.prompt(s, sayingIdOf(st))] : []),
  ...(isComplete(st.pick) ? [LISTEN.line(s, st.pick)] : []),
];

describe('hold-the-line: listenLines', () => {
  const lines = listenLines();

  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    expect(lines.every((l) => textKey(l).length > 0)).toBe(true);
    expect(new Set(lines.map(textKey)).size).toBe(lines.length);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('covers every line every button reads in every reachable state, and holds nothing unreachable', () => {
    const have = new Set(lines.map(textKey));
    const asked = SCENARIOS.flatMap((s) => reachable(s).flatMap((st) => buttonsIn(s, st))).flat();
    expect(asked.filter((t) => !have.has(textKey(t)))).toEqual([]);
    const reached = new Set(asked.map(textKey));
    expect(lines.filter((l) => !reached.has(textKey(l)))).toEqual([]);
  });

  it('reaches every outcome, and the doorway note, in every place', () => {
    for (const s of SCENARIOS) {
      const states = reachable(s);
      const outcomes = new Set(states.map((st) => outcomeIn(s, st)));
      expect([...outcomes].sort(), s.id).toEqual([null, 'goes-on', 'left', 'stops'].sort());
      expect(states.some((st) => st.phase === 'build' && st.runs > 0), s.id).toBe(true);
    }
  });

  it('is exactly the audit’s 74 atoms', () => {
    // The audit's list for this exercise (sel-audit-enumerate.ts), verbatim.
    const audit = new Set([
      HOLDTHELINE_META.title, ...Object.values(SLOT_LABELS),
      'the doorway chip is on the rack now', 'Pick one picture for each part first', 'Say it out loud, then tap:',
      ...SCENARIOS.flatMap((s) => [
        s.where, s.setup.says, s.stops.says, s.goesOn.says, s.left.says,
        ...SLOTS.flatMap((slot) => chipsFor(s, slot).map((c) => wordsFor(s, c.id))),
      ]),
    ]);
    expect(audit.size).toBe(74);
    expect(new Set(lines)).toEqual(audit);
  });

  it('reads the visible words: labels, chips and line as shown, the prompt as its two parts', () => {
    expect(DOORWAY_NOTE).toBe('the doorway chip is on the rack now');
    expect(PICK_FIRST).toBe('Pick one picture for each part first');
    expect(SAY_IT).toBe('Say it out loud, then tap:');
    for (const s of SCENARIOS) {
      for (const st of reachable(s)) {
        const o = outcomeIn(s, st);
        expect(LISTEN.picture(s, o)).toEqual([s.where, shownPanel(s, o).says]);
        if (isComplete(st.pick)) expect(LISTEN.line(s, st.pick).join(' ')).toBe(lineOf(s, st.pick));
        if (st.phase !== 'build') continue;
        // The primary button shows the prompt; its read button says the same words, quotes aside.
        const id = sayingIdOf(st);
        expect(id !== null, `${s.id} ${JSON.stringify(st)}`).toBe(isComplete(st.pick));
        const read = LISTEN.prompt(s, id);
        expect(promptText(s, id)).toBe(read.length === 1 ? read[0] : `${read[0]} “${read[1]}”`);
      }
      for (const slot of SLOTS) {
        const words = chipsFor(s, slot).map((c) => wordsFor(s, c.id));
        expect(LISTEN.tray(s, slot, 0)).toEqual([SLOT_LABELS[slot], ...words]);
        expect(LISTEN.tray(s, slot, 1)).toEqual([SLOT_LABELS[slot], ...(slot === 'next' ? [DOORWAY_NOTE] : []), ...words]);
      }
    }
  });

  it('never reads the grown-up’s note or the places count', () => {
    expect(lines.map(textKey)).not.toContain(textKey(HOLDTHELINE_META.note));
    expect(lines.some((l) => /places/.test(l))).toBe(false);
  });

  it('has no say( left in the component', () => {
    const src = readFileSync('src/components/sel/HoldTheLine.tsx', 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
  });
});
