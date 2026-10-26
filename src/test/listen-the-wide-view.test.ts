import { describe, expect, it, vi } from 'vitest';
import { textKey } from '../audio/readAloud';
import {
  CLOSING_LINE,
  KEEP_HINT,
  KEPT_LABEL,
  LISTEN,
  NO_SHAPE,
  RECALL_PROMPT,
  REST_LABEL,
  ROOMS,
  SHAPE_LINES,
  THE_WIDE_VIEW_META,
  accountOf,
  canReturn,
  complementOf,
  listenLines,
  sentenceFor,
  shapeOf,
} from '../sel/the-wide-view';
import type { Room } from '../sel/the-wide-view';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Every line a read button in The Wide View can ask for must be one the clip
 * builder makes, or the button says "No recording of this yet." The walk below
 * is the reachable state space, exhaustively: every room, and in the recall and
 * return beats every subset of its people the child could have kept (tap order
 * does not reach the text, because both accounts read in census order).
 */

/** Every subset of a room's people, as id lists, including nobody and everybody. */
function* subsets(room: Room): Generator<string[]> {
  const ids = room.people.map((p) => p.id);
  for (let m = 0; m < 1 << ids.length; m++) yield ids.filter((_, i) => m & (1 << i));
}

/** What each read button on screen reads, mirroring the component's render, for every reachable screen. */
function* buttonTexts(): Generator<readonly string[]> {
  for (const room of ROOMS) {
    // Glance: the head only.
    yield LISTEN.head();
    for (const kept of subsets(room)) {
      // Recall: head, prompt, one under every crop, and the hint while the return is shut.
      yield LISTEN.prompt();
      for (const p of room.people) yield LISTEN.person(p);
      if (!canReturn(room, kept)) {
        yield LISTEN.hint();
        continue;
      }
      // Return: only opens on some-but-not-all.
      yield LISTEN.shape(shapeOf(room, kept));
      yield LISTEN.mine(room, kept);
      yield LISTEN.theirs(room, kept);
      yield LISTEN.closing();
    }
  }
}

describe('the-wide-view: listenLines', () => {
  const lines = listenLines();

  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    expect(lines.every((l) => textKey(l).length > 0)).toBe(true);
    expect(new Set(lines.map(textKey)).size).toBe(lines.length);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('is the 68 atoms the audit counts: title, note, prompt, hint, 52 sentences, 9 shape lines, 2 tray labels, the closing line', () => {
    const sentences = new Set(ROOMS.flatMap((r) => r.people.map(sentenceFor)));
    expect(sentences.size).toBe(52);
    expect(SHAPE_LINES).toHaveLength(9);
    const expected = new Set([
      THE_WIDE_VIEW_META.title,
      THE_WIDE_VIEW_META.note,
      RECALL_PROMPT,
      KEEP_HINT,
      ...sentences,
      ...SHAPE_LINES,
      KEPT_LABEL,
      REST_LABEL,
      CLOSING_LINE,
    ]);
    expect(lines).toHaveLength(68);
    expect(new Set(lines)).toEqual(expected);
  });

  it('covers every line every button reads in every reachable state, and holds no line no button reads', () => {
    const asked = new Set<string>();
    for (const texts of buttonTexts()) for (const t of texts) asked.add(t);
    const have = new Set(lines.map(textKey));
    expect([...asked].filter((t) => !have.has(textKey(t)))).toEqual([]);
    const reached = new Set([...asked].map(textKey));
    expect(lines.filter((l) => !reached.has(textKey(l)))).toEqual([]);
  });

  it('reaches all nine shape lines, the refusal included', () => {
    const seen = new Set<string>();
    for (const room of ROOMS) for (const kept of subsets(room)) if (canReturn(room, kept)) seen.add(shapeOf(room, kept).line);
    expect(seen).toEqual(new Set(SHAPE_LINES));
    expect(seen.has(NO_SHAPE)).toBe(true);
  });

  it('reads each tray as its label and then exactly the list under it', () => {
    for (const room of ROOMS) {
      const kept = room.people.filter((_, i) => i % 3 === 0).map((p) => p.id);
      expect(LISTEN.mine(room, kept)).toEqual([KEPT_LABEL, ...accountOf(room, kept)]);
      expect(LISTEN.theirs(room, kept)).toEqual([REST_LABEL, ...accountOf(room, complementOf(room, kept))]);
    }
  });

  it('reads one sentence per atom, so no button plays a joined or truncated line', () => {
    for (const texts of [LISTEN.head(), LISTEN.prompt(), LISTEN.hint(), LISTEN.closing()]) {
      for (const t of texts) expect(lines).toContain(t);
    }
    // The old step speech said only the first half of the prompt on screen.
    expect(LISTEN.prompt()).toEqual(['Which of these stayed with you? Every one of them was in the room.']);
  });
});
