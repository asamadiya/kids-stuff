import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { NotTheSameRule } from '../components/sel/NotTheSameRule';
import {
  COLUMNS, NOT_THE_SAME_RULE_META, RACK_DONE, RACK_OPEN, RULE_CARDS, SLOTS, WHERE_PROMPT,
  chipsFor, listenLines, ruleParts, ruleSentence,
} from '../sel/not-the-same-rule';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered walk: a manifest holding exactly `listenLines()`, and every read
 * button on every screen pressed. A button that asks for a line the build does
 * not make shows "No recording of this yet."; a button that reads words not
 * shown in its own block fails the visible-text check.
 */

const SOURCE = 'src/components/sel/NotTheSameRule.tsx';

const lines = listenLines();
const stemOf = new Map(lines.map((l, i) => [textKey(l), `nsr${i}`]));
const textOf = new Map(lines.map((l, i) => [`nsr${i}`, l]));
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
const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

/** The words a child can see in the button's own block, read buttons removed. */
const visibleBeside = (btn: HTMLButtonElement): string => {
  const block = btn.closest('.bench__tray, .bench__shelf, .bench__head') as HTMLElement;
  const copy = block.cloneNode(true) as HTMLElement;
  copy.querySelectorAll('.readaloud').forEach((e) => e.remove());
  return flat(copy.textContent ?? '');
};

/** Press every read button on screen; each must play shown words, in screen order, with no gap in the clips. */
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
    expect(FakeAudio.played.length).toBeGreaterThan(0);
    const shown = visibleBeside(btn);
    let at = 0;
    for (const atom of FakeAudio.played) {
      const i = shown.indexOf(flat(atom), at);
      expect(i, `"${atom}" is not shown, in order, beside its button`).toBeGreaterThanOrEqual(0);
      at = i + flat(atom).length;
    }
  }
};

const rackButtons = () =>
  [...bench().querySelectorAll<HTMLButtonElement>('.bench__tray .bench__figure > button.bench-part')];

describe('NotTheSameRule: read-aloud', () => {
  it('has no say( left, and wires the stop-on-press hook on the bench', () => {
    const src = readFileSync(SOURCE, 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
    expect(src).toMatch(/useStopOnInteraction\(benchRef\)/);
    expect(src).toMatch(/<section ref=\{benchRef\} className="bench"/);
  });

  it('renders read buttons and shows the rule on each card in the rack; nothing starts on its own', async () => {
    render(<NotTheSameRule />);
    await act(tick);
    // head, rack label, six cards, builder heading, five slot rows
    expect(document.querySelectorAll('.readaloud').length).toBe(1 + 1 + RULE_CARDS.length + 1 + SLOTS.length);
    for (const card of RULE_CARDS) expect(screen.getByText(card.front)).toBeInTheDocument();
    expect(screen.getByText(RACK_OPEN)).toBeInTheDocument();
    expect(getPlaying()).toBeNull();
    expect(FakeAudio.played).toEqual([]);
  });

  it('never reads the grown-up note', async () => {
    render(<NotTheSameRule />);
    await act(async () => {
      fireEvent.click(bench().querySelector('.bench__head .readaloud__btn') as HTMLButtonElement);
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual([NOT_THE_SAME_RULE_META.title]);
    expect(FakeAudio.played).not.toContain(NOT_THE_SAME_RULE_META.note);
  });

  it('every button on every screen plays only the words shown beside it', async () => {
    render(<NotTheSameRule />);
    await pressAll();

    // Hold a card: the "Where does this one go?" tray opens. Picking it up says nothing.
    FakeAudio.played = [];
    await act(async () => { fireEvent.click(rackButtons()[0]); });
    expect(FakeAudio.played).toEqual([]);
    expect(screen.getByText(WHERE_PROMPT)).toBeInTheDocument();
    await pressAll();

    // Sort the whole deck through the tray, alternating columns.
    for (let i = 0; i < RULE_CARDS.length; i++) {
      await act(async () => { fireEvent.click(rackButtons()[0]); });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: COLUMNS[i % 2].label }));
      });
    }
    expect(screen.getByText(RACK_DONE)).toBeInTheDocument();
    expect(screen.getByText('Two keys, side by side')).toBeInTheDocument();
    await pressAll();

    // Turn each card over in turn. Turning says nothing; its back can be read.
    for (const card of RULE_CARDS) {
      const turn = [...bench().querySelectorAll<HTMLButtonElement>('button[aria-expanded]')]
        .find((b) => b.textContent?.includes(card.short)) as HTMLButtonElement;
      FakeAudio.played = [];
      await act(async () => { fireEvent.click(turn); });
      expect(FakeAudio.played).toEqual([]);
      expect(screen.getByText('The back of the card')).toBeInTheDocument();
      await pressAll();
    }

    // Build a rule. Taking a chip says nothing; the finished rule can be read.
    for (const slot of SLOTS) {
      FakeAudio.played = [];
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: chipsFor(slot.id)[2].label }));
      });
      expect(FakeAudio.played).toEqual([]);
    }
    await pressAll();
    const picks = Object.fromEntries(SLOTS.map((s) => [s.id, chipsFor(s.id)[2].id]));
    const sentence = ruleSentence(picks) as string;
    const shown = screen.getByText(sentence, { selector: '.bench__note' });
    FakeAudio.played = [];
    await act(async () => {
      fireEvent.click(shown.parentElement?.querySelector('.readaloud__btn') as HTMLButtonElement);
      await tick();
      await tick();
    });
    expect(FakeAudio.played).toEqual(ruleParts(picks));
    expect(FakeAudio.played.join(' ')).toBe(sentence);
  });

  it('stops reading when the child presses anything else in the exercise', async () => {
    FakeAudio.hold = true;
    render(<NotTheSameRule />);
    const card = RULE_CARDS[0];
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /^Read this card/ })[0]);
      await tick();
    });
    expect(getPlaying()?.id).toBe(`sel/not-the-same-rule/card/${card.id}`);
    expect(FakeAudio.played).toEqual([card.front]);
    await act(async () => {
      const chip = screen.getByRole('button', { name: chipsFor('place')[0].label });
      fireEvent.pointerDown(chip);
      fireEvent.click(chip);
    });
    expect(getPlaying()).toBeNull();
  });
});
