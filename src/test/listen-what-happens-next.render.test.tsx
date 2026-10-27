import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { WhatHappensNext } from '../components/sel/WhatHappensNext';
import { ROAD_NOT_TAKEN, STRIPS, WHATHAPPENSNEXT_META, actionWordOf, listenLines } from '../sel/what-happens-next';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every reachable screen pressed. A button that asks for a line the
 * build does not make shows "No recording of this yet."; a button that reads
 * something other than the captions beside it fails the visible-text check.
 */

const SOURCE = 'src/components/sel/WhatHappensNext.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `whn${i}`]));
const textOf = new Map(lines.map((l, i) => [`whn${i}`, l]));
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

/** The captions in the read button's own figure (or the head block), in screen order. */
const captionsBeside = (btn: HTMLButtonElement): string[] => {
  const box = btn.closest('.bench__figure, .bench__head > div') as HTMLElement;
  return [...box.querySelectorAll('.bench__title, .bench__note, .bench__figure-caption')].map((e) => e.textContent ?? '');
};

/** Press every read button on screen; each must play exactly the captions beside it. */
const pressAll = async () => {
  const buttons = readButtons();
  expect(buttons.length).toBeGreaterThan(0);
  for (const btn of buttons) {
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(btn);
      await tick();
      await tick();
    });
    expect(screen.queryByText('No recording of this yet.')).toBeNull();
    expect(FakeAudio.played).toEqual(captionsBeside(btn));
  }
};

describe('WhatHappensNext: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
  });

  it('renders read buttons for the head, the setup and both roads, and nothing starts on its own', async () => {
    render(<WhatHappensNext />);
    await act(tick);
    expect(document.querySelectorAll('.readaloud').length).toBe(4);
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
  });

  it('every button on every reachable screen plays exactly its visible captions', async () => {
    render(<WhatHappensNext />);
    const tray = () => document.querySelector('.bench__tray') as HTMLElement;
    for (const [i, s] of STRIPS.entries()) {
      await act(async () => {
        fireEvent.click(within(tray()).getAllByRole('button')[i]);
      });
      await pressAll();
      FakeAudio.played = [];
      for (const road of s.roads) {
        // Walk this road, then open "Later that day".
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: actionWordOf(s, road) }));
        });
        expect(screen.getAllByText(ROAD_NOT_TAKEN)).toHaveLength(1);
        await pressAll();
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Later that day' }));
        });
        expect(readButtons()).toHaveLength(6);
        await pressAll();
      }
    }
  });

  it('reads the title and note from the head button', async () => {
    render(<WhatHappensNext />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Read it to me/ }));
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([WHATHAPPENSNEXT_META.title, WHATHAPPENSNEXT_META.note]);
  });

  it('stops reading when the child presses anything else in the exercise', async () => {
    FakeAudio.hold = true;
    render(<WhatHappensNext />);
    const s = STRIPS[0];
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Read what is happening/ }));
      await tick();
    });
    expect(getPlaying()?.id).toBe('sel/what-happens-next/setup');
    expect(FakeAudio.played).toEqual([s.setupWord]);
    await act(async () => {
      const road = screen.getByRole('button', { name: actionWordOf(s, s.roads[0]) });
      fireEvent.pointerDown(road);
      fireEvent.click(road);
    });
    expect(getPlaying()).toBeNull();
  });
});
