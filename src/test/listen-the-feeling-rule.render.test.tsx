import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { TheFeelingRule } from '../components/sel/TheFeelingRule';
import {
  AMBIGUITY_NOTE, EVENT_DECK, FEELING_RULES, SIZE_HINT, THE_FEELING_RULE_META, listenLines,
} from '../sel/the-feeling-rule';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every screen the walk reaches pressed. A button that asks for a
 * line the build does not make shows "No recording of this yet."; a button
 * that reads anything but the words beside it fails the visible-text check.
 */

const SOURCE = 'src/components/sel/TheFeelingRule.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `tfr${i}`]));
const textOf = new Map(lines.map((l, i) => [`tfr${i}`, l]));
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
const text = (e: Element | null | undefined): string => e?.textContent ?? '';
const tray = () => bench().querySelector('.bench__tray') as HTMLElement;
const trayLabels = () => [...tray().querySelectorAll('.bench__tray-label')].map(text);
const slider = () => screen.getByRole('slider');
const familyButtons = () => FEELING_RULES.map((r) => within(tray()).getByRole('button', { name: r.label }));

/** The words on screen that the button inside `host` must read, in screen order. */
const visibleFor = (btn: HTMLButtonElement): string[] => {
  const host = btn.closest('.readaloud') as HTMLElement;
  const box = host.parentElement as HTMLElement;
  if (box.closest('.bench__head')) return [text(box.querySelector('.bench__title'))];
  if (box.classList.contains('bench__stage')) {
    // The family as the drawing heads it, the size hint, then the face captions.
    const svgText = [...box.querySelectorAll('svg text')].map(text);
    const pressed = familyButtons().find((b) => b.getAttribute('aria-pressed') === 'true');
    expect(svgText[0]).toBe(text(pressed).toUpperCase());
    return [text(pressed), svgText[1], ...[...box.querySelectorAll('.bench__figure-caption')].map(text)];
  }
  if (box === tray()) {
    const before = (sel: string): Element => {
      let e = host.previousElementSibling;
      while (e && !e.matches(sel)) e = e.previousElementSibling;
      return e as Element;
    };
    const label = text(before('.bench__tray-label'));
    if (label === trayLabels()[0]) return [label, ...familyButtons().map(text)];
    if (label === trayLabels()[1]) return [label, text(slider())];
    return [label, text(before('button').querySelector('.bench__figure-caption'))];
  }
  // A paragraph and its button: the paragraph, sentence by sentence as the button reads it.
  return [text(box.querySelector('p'))];
};

/** Press every read button on screen; each must play exactly the words beside it. */
const pressAll = async () => {
  const buttons = readButtons();
  expect(buttons.length).toBeGreaterThan(0);
  for (const btn of buttons) {
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(btn);
      await tick();
      await tick();
      await tick();
    });
    expect(screen.queryByText('No recording of this yet.')).toBeNull();
    const want = visibleFor(btn);
    if (want.length === 1) expect(FakeAudio.played.join(' ')).toBe(want[0]);
    else expect(FakeAudio.played).toEqual(want);
    expect(getPlaying()).toBeNull();
  }
};

const click = async (el: HTMLElement) => {
  await act(async () => {
    fireEvent.pointerDown(el);
    fireEvent.click(el);
  });
};

describe('TheFeelingRule: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
  });

  it('renders read buttons for the title, the rule, the families, the marker, the card and the note, and nothing starts on its own', async () => {
    render(<TheFeelingRule />);
    await act(tick);
    expect(document.querySelectorAll('.readaloud').length).toBe(6);
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
    // No read button sits inside another button.
    for (const b of readButtons()) expect(b.parentElement?.closest('button')).toBeNull();
  });

  it('every button on every screen the walk reaches plays exactly the words beside it', async () => {
    render(<TheFeelingRule />);
    await pressAll();
    for (const [ri, rule] of FEELING_RULES.entries()) {
      await click(familyButtons()[ri]);
      await pressAll();
      // Walk the marker along the rule, reading it at each stop.
      for (let i = 1; i < rule.stops.length; i += 1) {
        await act(async () => {
          fireEvent.keyDown(slider(), { key: 'ArrowRight' });
        });
        expect(text(slider())).toBe(rule.stops[i].label);
        await pressAll();
      }
      // Put every card on, stepping the marker back each time, then read everything.
      for (let k = 0; k < EVENT_DECK.length; k += 1) {
        await click(screen.getByRole('button', { name: /^Put it here at / }));
        await pressAll();
        await act(async () => {
          fireEvent.keyDown(slider(), { key: k % 2 ? 'End' : 'ArrowLeft' });
        });
      }
      await click(screen.getByRole('button', { name: 'A different one' }));
      await pressAll();
      // Take one off, keep, clear, then load the kept rule back.
      const off = screen.getAllByRole('button', { name: /off the rule$/ })[0];
      await click(off);
      await pressAll();
      await click(screen.getByRole('button', { name: 'Keep this rule' }));
      await click(screen.getByRole('button', { name: 'Take everything off' }));
      await pressAll();
      const kept = bench().querySelector('.bench__shelf .bench__kept .bench-btn') as HTMLElement;
      await click(kept);
      await pressAll();
    }
  });

  it('reads the title only, never the grown-up note', async () => {
    render(<TheFeelingRule />);
    await act(async () => {
      fireEvent.click(readButtons()[0]);
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([THE_FEELING_RULE_META.title]);
    expect(FakeAudio.played.join(' ')).not.toContain(THE_FEELING_RULE_META.note);
  });

  it('reads the rule under the faces: the family, the size hint, then each stop small to big', async () => {
    render(<TheFeelingRule />);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /Read these out/ })[0]);
      await tick();
      await tick();
    });
    const rule = FEELING_RULES[0];
    expect(FakeAudio.played).toEqual([rule.label, SIZE_HINT, ...rule.stops.map((s) => s.label)]);
  });

  it('the note goes once the first event is on, and the comparison appears without restating both pins', async () => {
    render(<TheFeelingRule />);
    expect(screen.getByText(AMBIGUITY_NOTE)).toBeInTheDocument();
    await click(screen.getByRole('button', { name: /^Put it here at / }));
    expect(screen.queryByText(AMBIGUITY_NOTE)).toBeNull();
    await act(async () => {
      fireEvent.keyDown(slider(), { key: 'End' });
    });
    await click(screen.getByRole('button', { name: /^Put it here at / }));
    expect(bench().textContent).toMatch(/is two stops bigger for you\./);
    expect(bench().querySelector('.bench__actions')?.previousElementSibling?.textContent).not.toMatch(/You put/);
  });

  it('dropping a pin, dragging, or changing family speaks nothing', async () => {
    render(<TheFeelingRule />);
    await click(screen.getByRole('button', { name: /^Put it here at / }));
    await act(async () => {
      fireEvent.keyDown(slider(), { key: 'ArrowRight' });
    });
    await click(familyButtons()[1]);
    await click(slider());
    await act(tick);
    expect(FakeAudio.played).toEqual([]);
    expect(getPlaying()).toBeNull();
  });

  it('stops reading when the child presses anything else in the exercise', async () => {
    FakeAudio.hold = true;
    render(<TheFeelingRule />);
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /Read these out/ })[0]);
      await tick();
    });
    expect(getPlaying()?.id).toBe('sel/the-feeling-rule/rule');
    await click(familyButtons()[2]);
    expect(getPlaying()).toBeNull();
  });
});
