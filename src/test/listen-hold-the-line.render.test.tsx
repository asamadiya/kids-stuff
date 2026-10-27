import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { HoldTheLine } from '../components/sel/HoldTheLine';
import {
  HOLDTHELINE_META, PICK_FIRST, SCENARIOS, SLOTS,
  allPicks, chipById, chipsFor, lineOf, listenLines, outcomeOf, promptText, wordsFor,
} from '../sel/hold-the-line';
import type { Outcome, Pick, Scenario } from '../sel/hold-the-line';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every screen of three whole lines pressed. A button that asks for a
 * line the build does not make shows "No recording of this yet."; a button that
 * reads anything other than the words on screen beside it fails the
 * visible-text check.
 */

const SOURCE = 'src/components/sel/HoldTheLine.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `htl${i}`]));
const textOf = new Map(lines.map((l, i) => [`htl${i}`, l]));
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

/** The words on screen that a read button sits beside, in screen order, one per clip. */
const visibleBeside = (btn: HTMLButtonElement): string[] => {
  const head = btn.closest('.bench__head');
  if (head) return text(head.querySelectorAll('.bench__title'));
  const figure = btn.closest('.bench__figure');
  if (figure) {
    // Before the line: where, and the setup under it. After: where, and the reply set in the frame and on the cards.
    const reply = bench().querySelector('.hold-cards__reply');
    return [...text(figure.querySelectorAll('.bench__figure-caption')), ...(reply ? [reply.textContent ?? ''] : [])];
  }
  const tray = btn.closest('.bench__tray');
  if (tray) {
    const label = (tray.querySelector('.bench__tray-label')?.textContent ?? '').split(' — ');
    return [...label, ...text(tray.querySelectorAll('.bench-part'))];
  }
  const before = btn.closest('.readaloud')?.previousElementSibling;
  if (before?.classList.contains('bench-btn--primary')) {
    const said = /^(.*:) “(.*)”$/.exec(before.textContent ?? '');
    return said ? [said[1], said[2]] : [before.textContent ?? ''];
  }
  // "Say the line back to me": the three parts, as the cards show them.
  expect(btn.textContent).toBe('Say the line back to me');
  return text(bench().querySelectorAll('.hold-card__words'));
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
    expect(want.every((w) => w.length > 0)).toBe(true);
    expect(FakeAudio.played).toEqual(want);
  }
};

const press = async (el: Element) => {
  await act(async () => {
    fireEvent.pointerDown(el);
    fireEvent.click(el);
  });
};
const tap = (name: string) => press(screen.getByRole('button', { name }));

/** Place one chip per part, pressing every read button after each. */
const build = async (s: Scenario, pick: Pick, buttons: number) => {
  for (const slot of SLOTS) {
    const id = pick[slot];
    if (!id) continue;
    await tap(wordsFor(s, id));
    await pressAll(buttons + (slot === 'next' ? 1 : 0));
  }
};

/** Say the line part by part on the primary button; after the third part the other person answers. */
const sayIt = async (s: Scenario, pick: Pick, outcome: Outcome) => {
  for (const slot of SLOTS) {
    const id = pick[slot] as NonNullable<Pick[typeof slot]>;
    const primary = screen.getByRole('button', { name: promptText(s, id) });
    expect(primary).toHaveClass('bench-btn--primary');
    await pressAll(7);
    await press(primary);
  }
  expect(outcomeOf(s, pick)).toBe(outcome);
  expect(screen.getByText(s[outcome === 'stops' ? 'stops' : outcome === 'goes-on' ? 'goesOn' : 'left'].says, {
    selector: '.hold-cards__reply',
  })).toBeInTheDocument();
  await pressAll(3);
};

const pickWith = (s: Scenario, o: Outcome): Pick => {
  const p = allPicks(s).find((x) => outcomeOf(s, x) === o);
  expect(p, `${s.id} ${o}`).toBeDefined();
  return p as Pick;
};

describe('HoldTheLine: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
  });

  it('renders read buttons, none inside another button or the drawn frame, and nothing starts on its own', async () => {
    render(<HoldTheLine />);
    await act(tick);
    const wraps = [...document.querySelectorAll('.readaloud')];
    expect(wraps.length).toBeGreaterThan(0);
    for (const w of wraps) {
      expect(w.parentElement?.closest('button, svg, [role="button"]')).toBeNull();
    }
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
  });

  it('shows the setup it reads, and every chip in words, not only to a screen reader', () => {
    render(<HoldTheLine />);
    const s = SCENARIOS[0];
    expect(screen.getByText(s.setup.says, { selector: '.bench__figure-caption' })).toBeVisible();
    for (const slot of SLOTS) {
      for (const c of chipsFor(s, slot)) {
        const btn = screen.getByRole('button', { name: wordsFor(s, c.id) });
        expect(btn.textContent).toBe(wordsFor(s, c.id));
        expect(btn).not.toHaveAttribute('aria-label');
      }
    }
  });

  it('every button on every screen of three lines plays exactly the words beside it', async () => {
    render(<HoldTheLine />);
    const s = SCENARIOS[0];

    // Nothing picked: head, picture, three trays, the prompt.
    await pressAll(6);
    expect(screen.getByRole('button', { name: PICK_FIRST })).toHaveAttribute('aria-disabled', 'true');

    // A line that does not move them. The line button appears once the frame is full.
    const weak = pickWith(s, 'goes-on');
    await build(s, weak, 6);
    expect(screen.getByRole('group', { name: `The frame holds: ${lineOf(s, weak)}` })).toBeInTheDocument();
    await sayIt(s, weak, 'goes-on');

    // Change the last part: the trays come back, the third with the doorway note.
    await tap('Change the last part and say it again');
    await pressAll(6);
    const exit = chipsFor(s, 'next').find((c) => chipById(c.id)?.next === 'exit');
    expect(exit).toBeDefined();
    const leave: Pick = { ...weak, next: exit?.id ?? null };
    await build(s, { name: null, ask: null, next: leave.next }, 6);
    await sayIt(s, leave, 'left');

    // Somewhere else, a line that stops them.
    const t = SCENARIOS[1];
    await press(screen.getByRole('img', { name: t.where }).closest('button') as HTMLButtonElement);
    expect(screen.getByText(t.setup.says, { selector: '.bench__figure-caption' })).toBeVisible();
    await pressAll(6);
    const strong = pickWith(t, 'stops');
    await build(t, strong, 6);
    await sayIt(t, strong, 'stops');
  });

  it('reads the title from the head button, and never the note to the grown-up', async () => {
    render(<HoldTheLine />);
    const head = document.querySelector('.bench__head .readaloud__btn') as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(head);
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([HOLDTHELINE_META.title]);
  });

  it('places chips and says the line without a sound from the reader', async () => {
    render(<HoldTheLine />);
    const s = SCENARIOS[0];
    const p = pickWith(s, 'stops');
    for (const slot of SLOTS) await tap(wordsFor(s, p[slot] as NonNullable<Pick[typeof slot]>));
    for (const slot of SLOTS) {
      await press(screen.getByRole('button', { name: promptText(s, p[slot]) }));
    }
    await act(tick);
    expect(FakeAudio.played).toEqual([]);
    expect(getPlaying()).toBeNull();
  });

  it('stops reading when the child presses anything else in the exercise', async () => {
    FakeAudio.hold = true;
    render(<HoldTheLine />);
    const s = SCENARIOS[0];
    const tray = screen.getAllByRole('button', { name: /^Read these out/ })[0];
    await act(async () => {
      fireEvent.click(tray);
      await tick();
    });
    expect(getPlaying()?.id).toBe('sel/hold-the-line/tray/name');
    await tap(wordsFor(s, chipsFor(s, 'name')[0].id));
    expect(getPlaying()).toBeNull();
  });
});
