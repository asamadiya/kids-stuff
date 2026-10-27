import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { BeforeYouDecide } from '../components/sel/BeforeYouDecide';
import { CASES, QUESTION_KINDS, chipFor, listenLines } from '../sel/before-you-decide';
import type { QuestionKind } from '../sel/before-you-decide';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The rendered exercise: every read button, in every state the walk reaches,
 * plays only lines `listenLines()` lists (so the build has made them), and
 * every line it plays is on screen as the child sees it. Tapping a question, a
 * choice or the turn-over plays nothing.
 */

class FakeAudio {
  static made: FakeAudio[] = [];
  static played: string[] = [];
  src = '';
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    FakeAudio.made.push(this);
  }
  play() {
    FakeAudio.played.push(this.src);
    return Promise.resolve();
  }
  pause() {}
  removeAttribute(name: string) {
    if (name === 'src') this.src = '';
  }
  load() {}
}

const LINES = listenLines();
const STEM = new Map(LINES.map((l, i) => [`s${i}`, l]));
const M: Manifest = { mom: { en: Object.fromEntries(LINES.map((l, i) => [textKey(l), `s${i}`])) } };
const tick = () => act(() => new Promise<void>((r) => setTimeout(r, 0)));

beforeEach(() => {
  FakeAudio.made = [];
  FakeAudio.played = [];
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

/** What the child can see: the bench without the print-only plate and without accessible names. */
const visible = (): string => {
  const copy = bench().cloneNode(true) as HTMLElement;
  copy.querySelectorAll('.plate-print').forEach((n) => n.remove());
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) out.push(n.textContent ?? '');
    n.childNodes.forEach(walk);
  };
  walk(copy);
  return out.join('\n');
};

/** Press one read button and let its whole sequence play; the lines it played. */
const press = async (btn: HTMLElement): Promise<string[]> => {
  const from = FakeAudio.played.length;
  fireEvent.click(btn);
  await tick();
  for (let guard = 0; getPlaying() && guard < 20; guard += 1) {
    FakeAudio.made[FakeAudio.made.length - 1].onended?.();
    await tick();
  }
  expect(getPlaying()).toBeNull();
  return FakeAudio.played.slice(from).map((src) => {
    const stem = /\/(s\d+)\.mp3$/.exec(src)?.[1];
    const line = stem ? STEM.get(stem) : undefined;
    if (!line) throw new Error(`played something not in listenLines(): ${src}`);
    return line;
  });
};

/** Press every read button on screen; each must play, and play only what is shown. */
const pressAll = async (): Promise<number> => {
  const shown = visible();
  const buttons = [...bench().querySelectorAll<HTMLElement>('.readaloud__btn')];
  expect(buttons.length).toBeGreaterThan(0);
  for (const btn of buttons) {
    const lines = await press(btn);
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) expect(shown).toContain(line);
  }
  expect(bench().querySelector('.readaloud__problem')).toBeNull();
  return buttons.length;
};

const silently = (act_: () => void) => {
  const before = FakeAudio.made.length;
  act_();
  expect(FakeAudio.made.length).toBe(before);
};

const tray = (label: RegExp) => screen.getByText(label).closest('.bench__tray') as HTMLElement;

describe('BeforeYouDecide read-aloud', () => {
  it('renders read buttons and no say()', () => {
    render(<BeforeYouDecide />);
    expect(bench().querySelectorAll('.readaloud').length).toBeGreaterThan(0);
    expect(readFileSync('src/components/sel/BeforeYouDecide.tsx', 'utf8')).not.toMatch(/\bsay\(/);
  });

  it('in every case, asked or not, decided and turned over, every button reads only what is on screen', async () => {
    render(<BeforeYouDecide />);
    const rotations: QuestionKind[][] = QUESTION_KINDS.map((_, i) => [...QUESTION_KINDS.slice(i), ...QUESTION_KINDS.slice(0, i)]);
    for (const [ci, c] of CASES.entries()) {
      // Ask nothing, decide, turn all three over: every fact shows with "You did not ask".
      fireEvent.click(within(tray(/The other cases\./)).getByRole('button', { name: c.title }));
      await pressAll();
      silently(() => fireEvent.click(screen.getByRole('button', { name: c.choices[0].label })));
      await pressAll();
      silently(() => fireEvent.click(screen.getByRole('button', { name: 'Turn over what you did not ask' })));
      // title, setup, three facts, outcome, closing, question rack, choice tray
      expect(await pressAll()).toBe(1 + 1 + 3 + 1 + 1 + 2);

      // Ask all three in some order, then decide another way, then turn over (nothing left to turn).
      fireEvent.click(within(tray(/The other cases\./)).getByRole('button', { name: c.title }));
      for (const kind of rotations[ci % rotations.length]) {
        silently(() => fireEvent.click(screen.getByRole('button', { name: chipFor(kind).label })));
        await pressAll();
      }
      silently(() => fireEvent.click(screen.getByRole('button', { name: c.choices[c.choices.length - 1].label })));
      silently(() => fireEvent.click(screen.getByRole('button', { name: 'Turn over what you did not ask' })));
      await pressAll();
    }
  });

  it('stops reading when anything else in the exercise is pressed', async () => {
    render(<BeforeYouDecide />);
    const read = bench().querySelector<HTMLElement>('.readaloud__btn')!;
    fireEvent.click(read);
    await tick();
    expect(getPlaying()).not.toBeNull();
    const chip = screen.getByRole('button', { name: chipFor('eye').label });
    fireEvent.pointerDown(chip);
    expect(getPlaying()).toBeNull();
  });
});
