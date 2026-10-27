import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { OneSwingTwoKids } from '../components/sel/OneSwingTwoKids';
import {
  CHOICES, ONE_SWING_TWO_KIDS_META, SCENARIOS, choiceLabel, listenLines, reachablePaths, storyLine, trayLine,
} from '../sel/one-swing-two-kids';
import type { ChoiceId, Scenario } from '../sel/one-swing-two-kids';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every reachable screen pressed. A button that asks for a line the
 * build does not make shows "No recording of this yet."; a button that reads
 * something other than the words beside it fails the visible-text check.
 */

const SOURCE = 'src/components/sel/OneSwingTwoKids.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `oswtk${i}`]));
const textOf = new Map(lines.map((l, i) => [`oswtk${i}`, l]));
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
const textsOf = (root: ParentNode, sel: string): string[] =>
  [...root.querySelectorAll(sel)].map((e) => e.textContent ?? '');

/** The words on screen that a read button stands beside, in screen order. */
const visibleBeside = (btn: HTMLButtonElement, s: Scenario): string[] => {
  const head = btn.closest('.bench__head > div');
  if (head) return textsOf(head, '.bench__title, .bench__note');
  const tray = btn.closest('.bench__tray');
  if (tray) return [...textsOf(tray, '.bench__tray-label'), ...textsOf(tray, 'button.bench-part > span')];
  const stage = btn.closest('.bench__stage');
  if (stage) {
    // The caption beside it, then who the other child is, shown under the stage.
    const about = screen.getByText(s.about);
    expect(about.closest('.bench__stage')).toBeNull();
    return [...textsOf(btn.closest('.bench__row > div') as HTMLElement, 'figcaption'), about.textContent ?? ''];
  }
  const row = btn.closest('.bench__row') as HTMLElement;
  return textsOf(row, '.bench__note');
};

/** Press every read button on screen; each must play exactly the words beside it, and find every clip. */
const pressAll = async (s: Scenario) => {
  const buttons = readButtons();
  for (const btn of buttons) {
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(btn);
      await tick();
      await tick();
    });
    expect(screen.queryByText('No recording of this yet.')).toBeNull();
    const shown = visibleBeside(btn, s);
    const isStory = btn.closest('.bench__row') !== null && !btn.closest('.bench__stage');
    // A story line is two sentences in one paragraph; it is read as those two atoms.
    expect(isStory ? [FakeAudio.played.join(' ')] : FakeAudio.played).toEqual(shown);
  }
  return buttons.length;
};

const choiceButton = (s: Scenario, c: ChoiceId) => screen.getByRole('button', { name: choiceLabel(s, c) });

describe('OneSwingTwoKids: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
  });

  it('renders read buttons for the head, the situation and the plans, and nothing starts on its own', async () => {
    render(<OneSwingTwoKids />);
    await act(tick);
    expect(document.querySelectorAll('.readaloud').length).toBe(3);
    expect(screen.getByRole('button', { name: /Read it to me/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Read these out/ })).toBeTruthy();
    await act(async () => {
      fireEvent.click(choiceButton(SCENARIOS[0], CHOICES[0]));
      await tick();
    });
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
  });

  it('every button on every reachable screen plays exactly the words beside it', async () => {
    render(<OneSwingTwoKids />);
    let pressed = 0;
    for (const s of SCENARIOS) {
      for (const path of reachablePaths(s)) {
        // Start the situation fresh, then walk the path.
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: s.short }));
        });
        for (const c of path) {
          await act(async () => {
            fireEvent.click(choiceButton(s, c));
          });
        }
        expect(screen.getByText(trayLine(s, path))).toBeTruthy();
        expect(textsOf(bench(), ':scope > .bench__row > .bench__note')).toEqual(path.map((c) => storyLine(s, c)));
        expect(readButtons()).toHaveLength(3 + path.length);
        pressed += await pressAll(s);
      }
    }
    expect(pressed).toBeGreaterThan(SCENARIOS.length * 3);
  }, 60_000);

  it('reads the title and note from the head button', async () => {
    render(<OneSwingTwoKids />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Read it to me/ }));
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([ONE_SWING_TWO_KIDS_META.title, ONE_SWING_TWO_KIDS_META.note]);
  });

  it('never reads the grown-up’s guide, though it is on screen', async () => {
    const mia = SCENARIOS.find((s) => s.guide !== null) as Scenario;
    render(<OneSwingTwoKids />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: mia.short }));
    });
    expect(screen.getByText(mia.guide as string)).toBeTruthy();
    const heard: string[] = [];
    for (const btn of readButtons()) {
      FakeAudio.played = [];
      await act(async () => {
        fireEvent.click(btn);
        await tick();
        await tick();
      });
      heard.push(...FakeAudio.played);
    }
    expect(heard.length).toBeGreaterThan(0);
    expect(heard).not.toContain(mia.guide);
  });

  it('stops reading when the child presses anything else in the exercise', async () => {
    FakeAudio.hold = true;
    render(<OneSwingTwoKids />);
    const s = SCENARIOS[0];
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Read these out/ }));
      await tick();
    });
    expect(getPlaying()?.id).toBe(`sel/one-swing-two-kids/${s.id}/plans`);
    expect(FakeAudio.played).toEqual([trayLine(s, [])]);
    await act(async () => {
      const plan = choiceButton(s, 'you-first');
      fireEvent.pointerDown(plan);
      fireEvent.click(plan);
    });
    expect(getPlaying()).toBeNull();
  });
});
