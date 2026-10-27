import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { BorrowedEyes } from '../components/sel/BorrowedEyes';
import {
  CHIP_IDS, LISTEN, MOMENTS, chipTrayHead, listenLines, slotKey,
} from '../sel/borrowed-eyes';
import type { Placed } from '../sel/borrowed-eyes';
import { getPlaying, resetForTests, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Borrowed Eyes reads aloud only when a speaker button is pressed (advisor a9),
 * and every button reads only lines `listenLines()` hands the clip builder.
 */

const LINES = listenLines();
const KEYS = new Set(LINES.map(textKey));

/** Every placement a moment can be in: each position empty or holding any chip. */
function placements(momentId: string, viewIds: readonly string[]): Placed[] {
  return viewIds.reduce<Placed[]>(
    (acc, v) => acc.flatMap((p) => [p, ...CHIP_IDS.map((c) => ({ ...p, [slotKey(momentId, v)]: c }))]),
    [{}],
  );
}

/** What every button can read, in every reachable state, walked like sel-audit-enumerate.ts. */
function everyReading(): (readonly string[])[] {
  const out: (readonly string[])[] = [LISTEN.head()];
  for (const m of MOMENTS) {
    for (const v of m.views) out.push(LISTEN.room(m, v), LISTEN.position(m, v), LISTEN.tray(m, v));
    for (const p of placements(m.id, m.views.map((v) => v.id))) out.push(LISTEN.readings(m, p));
  }
  return out;
}

describe('borrowed eyes — the lines the clip builder gets', () => {
  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    expect(LINES.length).toBeGreaterThan(0);
    for (const l of LINES) {
      expect(textKey(l).length, l).toBeGreaterThan(0);
      expect(l.length, l).toBeLessThanOrEqual(300);
    }
    expect(KEYS.size).toBe(LINES.length);
  });

  it('covers every line any button can read in any state', () => {
    const asked = everyReading();
    // 1 head + 5 moments x 2 positions x 3 buttons + 5 x 7 x 7 placements
    expect(asked).toHaveLength(1 + 5 * 2 * 3 + 5 * 49);
    for (const parts of asked) {
      expect(parts.length).toBeGreaterThan(0);
      for (const p of parts) expect(KEYS.has(textKey(p)), p).toBe(true);
    }
    // and holds nothing a button never reads
    const read = new Set(asked.flat().map(textKey));
    expect([...KEYS].filter((k) => !read.has(k))).toEqual([]);
  });

  it('counts 108 lines, as the audit enumerated them', () => {
    expect(LINES).toHaveLength(108);
  });

  it('keeps a name capitalised in the chip tray label and lowers only "Your"', () => {
    const heads = MOMENTS.flatMap((m) => m.views.map(chipTrayHead));
    expect(heads).toContain('A chip for this position — your eyes.');
    expect(heads).toContain('A chip for this position — Mia’s eyes.');
    expect(heads).toContain('A chip for this position — Nanna’s eyes.');
    for (const h of heads) expect(h).not.toMatch(/— (mia|nanna|nell|sam)’s/);
  });

  it('reads the shelf as shown: each sentence, then its chip reading once placed', () => {
    const m = MOMENTS.find((x) => x.id === 'tower');
    if (!m) throw new Error('no tower');
    expect(LISTEN.readings(m, {})).toEqual([
      'From where you stood, her hand came down on the roof.',
      'From where Mia knelt, she was putting a piece on.',
    ]);
    expect(LISTEN.readings(m, { [slotKey('tower', 'mia')]: 'join' })).toEqual([
      'From where you stood, her hand came down on the roof.',
      'From where Mia knelt, she was putting a piece on.',
      'From where Mia knelt, she wanted to join in.',
    ]);
  });
});

class FakeAudio {
  src = '';
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play() {
    return Promise.resolve();
  }
  pause() {}
  removeAttribute(name: string) {
    if (name === 'src') this.src = '';
  }
  load() {}
}

/** A manifest with a clip for exactly the lines `listenLines()` lists. */
const MANIFEST: Manifest = {
  mom: { en: Object.fromEntries(LINES.map((l, i) => [textKey(l), `be${i}`])) },
};

const tick = () => act(() => new Promise((r) => setTimeout(r, 0)));

beforeEach(() => {
  window.localStorage.clear();
  resetForTests(MANIFEST);
  vi.stubGlobal('Audio', FakeAudio);
});
afterEach(() => {
  cleanup();
  stop();
  vi.unstubAllGlobals();
});

/** Press every read button on screen; none may report a missing recording. */
async function pressEveryReadButton(): Promise<number> {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.readaloud__btn');
  for (const b of buttons) {
    fireEvent.click(b);
    await tick();
    expect(screen.queryByText('No recording of this yet.'), b.title).toBeNull();
    act(() => stop());
  }
  return buttons.length;
}

describe('borrowed eyes — the screen', () => {
  it('has read buttons and no say() left in the component', () => {
    render(<BorrowedEyes />);
    expect(document.querySelectorAll('.readaloud').length).toBeGreaterThan(0);
    const src = readFileSync('src/components/sel/BorrowedEyes.tsx', 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
  });

  it('never nests a read button inside another button', () => {
    render(<BorrowedEyes />);
    for (const b of document.querySelectorAll('.readaloud__btn')) {
      expect(b.parentElement?.closest('button')).toBeNull();
    }
  });

  it('renders the tray label with a name capitalised', () => {
    render(<BorrowedEyes />);
    fireEvent.click(screen.getByRole('button', { name: /^Mia’s eyes/ }));
    expect(screen.getByText(/A chip for this position — Mia’s eyes\./)).toBeInTheDocument();
  });

  it('finds a recording for every button in every moment, position and placement it is pressed in', async () => {
    render(<BorrowedEyes />);
    const tray = () => screen.getByText('Another moment').parentElement as HTMLElement;
    for (const m of MOMENTS) {
      fireEvent.click(within(tray()).getByRole('button', { name: new RegExp(`^${m.title}`) }));
      // head, room, one per position, tray, readings
      expect(await pressEveryReadButton()).toBe(1 + 1 + m.views.length + 1 + 1);
      for (const v of m.views) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${v.whose}`) }));
        fireEvent.click(screen.getAllByRole('button', { name: /wanted to join/ })[0]);
        await pressEveryReadButton();
      }
    }
  });

  it('stops reading when anything else in the exercise is pressed', async () => {
    render(<BorrowedEyes />);
    const read = document.querySelector<HTMLButtonElement>('.readaloud__btn');
    if (!read) throw new Error('no read button');
    fireEvent.click(read);
    await tick();
    expect(getPlaying()).not.toBeNull();
    act(() => {
      fireEvent.pointerDown(screen.getByRole('button', { name: 'Turn the dial' }));
    });
    expect(getPlaying()).toBeNull();
  });
});
