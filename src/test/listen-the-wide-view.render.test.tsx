import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { TheWideView } from '../components/sel/TheWideView';
import {
  CLOSING_LINE,
  KEEP_HINT,
  KEPT_LABEL,
  RECALL_PROMPT,
  REST_LABEL,
  ROOMS,
  THE_WIDE_VIEW_META,
  accountOf,
  complementOf,
  listenLines,
  recallOrder,
  sentenceFor,
  shapeOf,
} from '../sel/the-wide-view';
import type { Room } from '../sel/the-wide-view';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every beat of every room pressed. A button that asks for a line the
 * build does not make shows "No recording of this yet."; a button that reads
 * anything but the words beside it fails the visible-text check.
 */

const SOURCE = 'src/components/sel/TheWideView.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `twv${i}`]));
const textOf = new Map(lines.map((l, i) => [`twv${i}`, l]));
const M: Manifest = { mom: { en: Object.fromEntries(stemOf) } };

/** Ends each clip as soon as it starts (or never, when `hold` is set), and records what played. */
class FakeAudio {
  static played: string[] = [];
  static hold = false;
  src = '';
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play() {
    const stem = /\/([^/]+)\.mp3$/.exec(this.src)?.[1] ?? '';
    FakeAudio.played.push(textOf.get(stem) ?? `?${this.src}`);
    if (!FakeAudio.hold) queueMicrotask(() => this.onended?.());
    return Promise.resolve();
  }
  pause() {}
  removeAttribute() {}
  load() {}
}

const tick = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  FakeAudio.played = [];
  FakeAudio.hold = false;
  window.localStorage.clear();
  setReader('mom');
  resetForTests(M);
  vi.stubGlobal('Audio', FakeAudio);
});
afterEach(() => {
  cleanup();
  stop();
  vi.unstubAllGlobals();
});

const bench = () => document.querySelector('section.bench') as HTMLElement;
const readButtons = () => [...bench().querySelectorAll<HTMLButtonElement>('.readaloud__btn')];

/**
 * The visible words a read button sits beside, in screen order: the head block,
 * a tray (its label and list), the crop card it sits under, or the one line in
 * its own row.
 */
const textBeside = (btn: HTMLButtonElement): string[] => {
  const holder = btn.closest('.readaloud')?.parentElement as HTMLElement;
  if (holder.matches('.bench__head > div')) {
    return [...holder.querySelectorAll('.bench__title, .bench__note')].map((e) => e.textContent ?? '');
  }
  if (holder.matches('.bench__tray')) {
    return [...holder.querySelectorAll('.bench__tray-label, .bench__kept-meta')].map((e) => e.textContent ?? '');
  }
  const card = holder.querySelector('button[aria-pressed]:not(.readaloud__btn)');
  if (card) return [card.getAttribute('aria-label') ?? ''];
  return [...holder.querySelectorAll('p')].map((e) => e.textContent ?? '');
};

/** Press every read button on screen; each must play exactly the words beside it, and find every clip. */
const pressAll = async () => {
  const buttons = readButtons();
  expect(buttons.length).toBeGreaterThan(0);
  for (const btn of buttons) {
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(btn);
      for (let i = 0; i < 4; i++) await tick();
    });
    expect(screen.queryByText('No recording of this yet.')).toBeNull();
    const beside = textBeside(btn);
    expect(beside.length).toBeGreaterThan(0);
    expect(FakeAudio.played).toEqual(beside);
  }
};

const click = async (el: HTMLElement) => {
  await act(async () => {
    fireEvent.pointerDown(el);
    fireEvent.click(el);
  });
};

const toRoom = async (room: Room) => {
  const trays = bench().querySelectorAll<HTMLElement>('.bench__tray');
  const tray = trays[trays.length - 1];
  await click(within(tray).getByRole('button', { name: room.place }));
};

describe('TheWideView: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
    expect(src, 'lists keyed by sentence collide on identical people').not.toMatch(/key=\{line\}/);
  });

  it('renders a read button for the head, and nothing starts on its own', async () => {
    render(<TheWideView />);
    await act(tick);
    expect(document.querySelectorAll('.readaloud').length).toBe(1);
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
  });

  it('every button on every beat of every room plays exactly the words beside it', async () => {
    render(<TheWideView />);
    for (const room of ROOMS) {
      await toRoom(room);
      FakeAudio.played = [];
      // Glance.
      expect(readButtons()).toHaveLength(1);
      await pressAll();
      // Recall, nobody kept: head, prompt, one per crop, the hint.
      await click(screen.getByRole('button', { name: 'I have looked' }));
      expect(screen.getByText(RECALL_PROMPT)).toBeInTheDocument();
      expect(screen.getByText(KEEP_HINT)).toBeInTheDocument();
      expect(readButtons()).toHaveLength(3 + room.people.length);
      await pressAll();
      // Keep the first three dealt, then open the return.
      const kept = recallOrder(room).slice(0, 3);
      for (const p of kept) {
        const cards = screen.getAllByRole('button', { name: sentenceFor(p), pressed: false });
        await click(cards[0]);
      }
      expect(screen.queryByText(KEEP_HINT)).toBeNull();
      expect(readButtons()).toHaveLength(2 + room.people.length);
      await click(screen.getByRole('button', { name: 'Show me the room again' }));
      // Return: head, shape, both trays, closing.
      expect(readButtons()).toHaveLength(5);
      await pressAll();
      // And back to the glance, so the room switch starts clean.
      await click(screen.getByRole('button', { name: 'Look at this room again' }));
    }
  });

  it('reads each tray as its label and then its list, in the order the room stands', async () => {
    render(<TheWideView />);
    const room = ROOMS[0];
    await click(screen.getByRole('button', { name: 'I have looked' }));
    const kept = recallOrder(room).slice(0, 4);
    for (const p of [...kept].reverse()) await click(screen.getByRole('button', { name: sentenceFor(p), pressed: false }));
    await click(screen.getByRole('button', { name: 'Show me the room again' }));
    const ids = kept.map((p) => p.id);
    const [mine, theirs] = screen.getAllByRole('button', { name: /Read this one out/ });
    await act(async () => {
      fireEvent.click(mine);
      for (let i = 0; i < 8; i++) await tick();
    });
    expect(FakeAudio.played).toEqual([KEPT_LABEL, ...accountOf(room, ids)]);
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(theirs);
      for (let i = 0; i < 20; i++) await tick();
    });
    expect(FakeAudio.played).toEqual([REST_LABEL, ...accountOf(room, complementOf(room, ids))]);
    expect(screen.getByText(shapeOf(room, ids).line)).toBeInTheDocument();
    expect(screen.getByText(CLOSING_LINE)).toBeInTheDocument();
  });

  it('renders a room with identical sentences without a duplicate React key', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const recess = ROOMS.find((r) => r.id === 'recess') as Room;
    const counts = new Map<string, number>();
    for (const p of recess.people) counts.set(sentenceFor(p), (counts.get(sentenceFor(p)) ?? 0) + 1);
    expect(Math.max(...counts.values()), 'recess holds people who read the same').toBeGreaterThan(1);
    render(<TheWideView />);
    await toRoom(recess);
    await click(screen.getByRole('button', { name: 'I have looked' }));
    // Keep one person, so every twin lands in the second tray together.
    await click(screen.getAllByRole('button', { name: sentenceFor(recess.people[0]), pressed: false })[0]);
    await click(screen.getByRole('button', { name: 'Show me the room again' }));
    const dupes = errors.mock.calls.filter((c) => String(c[0]).includes('same key'));
    errors.mockRestore();
    expect(dupes).toEqual([]);
  });

  it('stops reading when the child presses anything else in the exercise, and picking a card is silent', async () => {
    FakeAudio.hold = true;
    render(<TheWideView />);
    await click(screen.getByRole('button', { name: 'I have looked' }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Read the question/ }));
      await tick();
    });
    expect(getPlaying()?.id).toBe('sel/the-wide-view/prompt');
    expect(FakeAudio.played).toEqual([RECALL_PROMPT]);
    await click(screen.getAllByRole('button', { name: sentenceFor(ROOMS[0].people[0]), pressed: false })[0]);
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([RECALL_PROMPT]);
  });

  it('reads the title and note from the head button', async () => {
    render(<TheWideView />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Read it to me/ }));
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([THE_WIDE_VIEW_META.title, THE_WIDE_VIEW_META.note]);
  });
});
