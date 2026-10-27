import { describe, expect, it, vi } from 'vitest';
import { textKey } from '../audio/readAloud';
import {
  LISTEN,
  ROAD_IDS,
  ROAD_NOT_TAKEN,
  STRIPS,
  WHATHAPPENSNEXT_META,
  actionWordOf,
  listenLines,
  otherRoad,
  roadOf,
} from '../sel/what-happens-next';
import type { RoadId, Strip } from '../sel/what-happens-next';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Every line a read button in What Happens Next can ask for must be one the
 * clip builder makes, or the button says "No recording of this yet."
 */

/** One screen state: the strip, the road walked (or none), and whether "Later that day" is open. */
interface State {
  readonly strip: Strip;
  readonly chosen: RoadId | null;
  readonly extended: boolean;
}

const states = (): State[] =>
  STRIPS.flatMap((strip) => [
    { strip, chosen: null, extended: false },
    ...ROAD_IDS.flatMap((chosen) => [
      { strip, chosen, extended: false },
      { strip, chosen, extended: true },
    ]),
  ]);

/** What each button on screen reads in this state, mirroring the component's render. */
const buttonsIn = ({ strip, chosen, extended }: State): (readonly string[])[] => {
  const out: (readonly string[])[] = [LISTEN.head(), LISTEN.setup(strip)];
  for (const road of strip.roads) out.push(LISTEN.road(strip, road, chosen !== null && chosen !== road.id));
  if (chosen) {
    const walked = roadOf(strip, chosen);
    out.push(LISTEN.after(walked));
    if (extended) out.push(LISTEN.later(walked));
  }
  return out;
};

describe('what-happens-next: listenLines', () => {
  const lines = listenLines();

  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    expect(lines.every((l) => textKey(l).length > 0)).toBe(true);
    expect(new Set(lines.map(textKey)).size).toBe(lines.length);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('is the 38 atoms the audit counts: title, note, 5 setups, 10 actions, the road not taken, 10 after, 10 later', () => {
    const expected = new Set([
      WHATHAPPENSNEXT_META.title,
      WHATHAPPENSNEXT_META.note,
      ROAD_NOT_TAKEN,
      ...STRIPS.map((s) => s.setupWord),
      ...STRIPS.flatMap((s) => s.roads.flatMap((r) => [actionWordOf(s, r), r.afterWord, r.laterWord])),
    ]);
    expect(lines).toHaveLength(38);
    expect(new Set(lines)).toEqual(expected);
  });

  it('covers every line every button reads in every reachable state', () => {
    const have = new Set(lines.map(textKey));
    const asked = states().flatMap(buttonsIn).flat();
    expect(asked.filter((t) => !have.has(textKey(t)))).toEqual([]);
    // And nothing in the list is unreachable: the clip builder makes no orphan.
    const reached = new Set(asked.map(textKey));
    expect(lines.filter((l) => !reached.has(textKey(l)))).toEqual([]);
  });

  it('reads the second caption only on the faded road', () => {
    for (const s of STRIPS) {
      for (const r of s.roads) {
        expect(LISTEN.road(s, r, false)).toEqual([actionWordOf(s, r)]);
        expect(LISTEN.road(s, r, true)).toEqual([actionWordOf(s, r), ROAD_NOT_TAKEN]);
      }
      // Walking one road fades exactly the other.
      for (const id of ROAD_IDS) {
        const faded = s.roads.filter((r) => r.id !== id).map((r) => r.id);
        expect(faded).toEqual([otherRoad(id)]);
      }
    }
  });
});
