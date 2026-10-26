import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { BodyCheck } from '../components/sel/BodyCheck';
import {
  BODYCHECK_META,
  BREATH_CARDS,
  CHECKS,
  REGIONS,
  REMEDY_NAME,
  WAIT_THINGS,
  listenLines,
} from '../sel/body-check';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every screen of one whole reading pressed. A button that asks for a
 * line the build does not make shows "No recording of this yet."; a button
 * that reads anything other than the words on screen beside it fails the
 * visible-text check.
 */

const SOURCE = 'src/components/sel/BodyCheck.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `bc${i}`]));
const textOf = new Map(lines.map((l, i) => [`bc${i}`, l]));
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
const text = (els: Iterable<Element>) => [...els].map((e) => e.textContent ?? '');

/** The words on screen that a read button sits beside, in screen order. */
const visibleBeside = (btn: HTMLButtonElement): string[] => {
  const row = btn.closest('.bench__figure .bench__row');
  if (row) return text(row.querySelectorAll('p'));
  const tray = btn.closest('.bench__tray');
  if (tray) return text(tray.querySelectorAll('.bench__tray-label, .bench-part'));
  const shelf = btn.closest('.bench__shelf');
  if (shelf) return text(shelf.querySelectorAll('li'));
  const figure = btn.closest('.bench__figure');
  if (figure) return text(figure.querySelectorAll('.bench__title, .bench__note'));
  return text((btn.closest('.bench__head > div') as HTMLElement).querySelectorAll('.bench__title, .bench__note'));
};

/** Press every read button on screen; each must play exactly the words beside it. */
const pressAll = async (expected: number) => {
  const buttons = readButtons();
  expect(buttons).toHaveLength(expected);
  for (const btn of buttons) {
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(btn);
      await tick();
      await tick();
    });
    expect(screen.queryByText('No recording of this yet.')).toBeNull();
    const want = visibleBeside(btn);
    expect(want.length).toBeGreaterThan(0);
    expect(FakeAudio.played).toEqual(want);
  }
};

const tap = async (name: string | RegExp) => {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name }));
  });
};

describe('BodyCheck: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
  });

  it('renders read buttons and nothing starts on its own', async () => {
    render(<BodyCheck />);
    await act(tick);
    expect(document.querySelectorAll('.readaloud').length).toBeGreaterThan(0);
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
  });

  it('shows every answer choice in words, not only to a screen reader', () => {
    render(<BodyCheck />);
    for (const r of REGIONS) expect(screen.getByText(r.signal)).toBeVisible();
  });

  it('every button on every screen of a whole reading plays exactly the words beside it', async () => {
    render(<BodyCheck />);
    // Before: head, the question under the figure, the picture tray.
    await pressAll(3);
    await tap(REGIONS[0].signal);
    await tap(REGIONS[3].signal);
    await pressAll(3);

    // Checks: head, the question, the check tray, the reading so far.
    await tap('Next');
    for (const c of CHECKS) expect(screen.getByText(c.label)).toBeVisible();
    await pressAll(4);
    await tap(CHECKS[0].label);
    await tap(CHECKS[2].label);
    await pressAll(4);

    // Remedy: head, the remedy tray, the reading.
    await tap('Next');
    await pressAll(3);
    // Breaths: the card is read as it stands, in and then out.
    await tap(REMEDY_NAME.breath);
    await pressAll(4);
    await tap(BREATH_CARDS.in.done);
    expect(screen.getByRole('heading', { name: BREATH_CARDS.out.title })).toBeVisible();
    await pressAll(4);

    // A slow count: the cue under the card, the length tray, the things tray.
    await tap(REMEDY_NAME.count);
    await pressAll(6);
    await tap('Count to 10');
    await tap(WAIT_THINGS[1].label);
    expect(screen.getByText(WAIT_THINGS[1].label, { selector: 'span' })).toBeVisible();
    await pressAll(6);
    // The next dot and the big button both take the tap; press the button.
    for (let n = 1; n <= 10; n += 1) {
      const btn = screen.getAllByRole('button', { name: `I said ${n}` }).find((e) => e.tagName === 'BUTTON');
      await act(async () => {
        fireEvent.click(btn as HTMLButtonElement);
      });
    }
    expect(screen.getByText('You counted to 10.')).toBeVisible();
    await pressAll(6);

    // After: the second question beside the first figure, the reading.
    await tap('Check again');
    await pressAll(3);
    await tap(/^Tummy\. /);
    await pressAll(3);

    // Done: the kept plate is a record and is not read; the head still is.
    await tap('Keep this reading');
    await pressAll(1);
  });

  it('reads the title and the note from the head button', async () => {
    render(<BodyCheck />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Read it to me/ }));
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([BODYCHECK_META.title, BODYCHECK_META.note]);
  });

  it('stops reading when the child presses anything else in the exercise', async () => {
    FakeAudio.hold = true;
    render(<BodyCheck />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Read these out/ }));
      await tick();
    });
    expect(getPlaying()?.id).toBe('sel/body-check/places');
    await act(async () => {
      const place = screen.getByRole('button', { name: REGIONS[2].signal });
      fireEvent.pointerDown(place);
      fireEvent.click(place);
    });
    expect(getPlaying()).toBeNull();
  });
});
