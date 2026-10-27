import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  EMPTY_SLOTS, LISTEN, PANEL_ROLES, SCENARIOS, listenLines, panelOf, runOf,
} from '../sel/put-it-back-together';
import type { PanelRole, Slots } from '../sel/put-it-back-together';
import { play, stop, textKey } from '../audio/readAloud';
import { PutItBackTogether } from '../components/sel/PutItBackTogether';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Put It Back Together reads aloud only when a read button is pressed, reads
 * only words on the screen, and asks only for lines the clip builder makes
 * (sel-audit.md, PutItBackTogether L1-L6; advisor a9 point 5).
 */
vi.mock('../audio/readAloud', async (importOriginal) => {
  const real = await importOriginal<typeof import('../audio/readAloud')>();
  return { ...real, play: vi.fn(async () => 'played' as const), stop: vi.fn(real.stop) };
});

const LINES = listenLines();
const KNOWN = new Set(LINES.map(textKey));

/** Every arrangement of the five slots the bench can reach: each role at most once, any slot empty. */
function slotStates(): Slots[] {
  const out: Slots[] = [];
  const walk = (i: number, acc: (PanelRole | null)[]) => {
    if (i === EMPTY_SLOTS.length) {
      out.push([...acc]);
      return;
    }
    for (const r of [null, ...PANEL_ROLES]) {
      if (r !== null && acc.includes(r)) continue;
      walk(i + 1, [...acc, r]);
    }
  };
  walk(0, []);
  return out;
}

function orders(items: readonly PanelRole[]): PanelRole[][] {
  if (items.length <= 1) return [[...items]];
  return items.flatMap((x, i) => orders([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [x, ...rest]));
}

/** What every button can read in every reachable state, built the way the component builds it. */
function walked(): string[] {
  const out: string[] = [...LISTEN.title()];
  const slots = slotStates();
  for (const s of SCENARIOS) {
    out.push(...LISTEN.opening(s), ...LISTEN.alternative(s));
    for (const r of PANEL_ROLES) out.push(...LISTEN.panel(s, r));
    for (const state of slots) {
      out.push(...LISTEN.tray(state));
      for (const r of state) if (r) out.push(...LISTEN.panel(s, r));
    }
    for (const order of orders(PANEL_ROLES)) for (const f of runOf(s, order)) out.push(...LISTEN.frame(f));
  }
  return out;
}

describe('the lines the clip builder makes for Put It Back Together', () => {
  it('has no empty line, no line twice, and none too long for one clip', () => {
    expect(LINES.filter((l) => textKey(l) === '')).toEqual([]);
    expect(KNOWN.size).toBe(LINES.length);
    expect(LINES.filter((l) => l.length > 300)).toEqual([]);
  });

  it('covers every line any button can ask for, in every state the bench can reach', () => {
    const asked = walked();
    expect(slotStates()).toHaveLength(1546);
    expect([...new Set(asked.filter((t) => !KNOWN.has(textKey(t))))]).toEqual([]);
  });

  it('makes no line that no button asks for', () => {
    const asked = new Set(walked().map(textKey));
    expect(LINES.filter((l) => !asked.has(textKey(l)))).toEqual([]);
  });

  it('reads each panel by its own line and the tray by the words it shows', () => {
    const s = SCENARIOS[0];
    expect(LISTEN.panel(s, 'own')).toEqual([panelOf(s, 'own').line]);
    expect(LISTEN.tray(EMPTY_SLOTS)[0]).toMatch(/^Five panels are loose/);
    expect(LISTEN.tray([...PANEL_ROLES])[0]).toMatch(/^All five are in/);
    expect(LISTEN.alternative(s)).toHaveLength(6);
  });
});

describe('the read buttons on the bench', () => {
  beforeEach(() => {
    vi.mocked(play).mockClear();
    vi.mocked(stop).mockClear();
  });
  afterEach(cleanup);

  /** The words a child can see: not the print block, not the plate drawing, not aria labels. */
  const visible = (root: HTMLElement): string => {
    const copy = root.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('.plate-print, svg').forEach((n) => n.remove());
    return textKey(copy.textContent ?? '');
  };

  /** Press every read button on the screen; each must read known lines that are on the screen now. */
  const pressAll = (root: HTMLElement): string[] => {
    vi.mocked(play).mockClear();
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('.readaloud__btn')];
    for (const b of buttons) fireEvent.click(b);
    const calls = vi.mocked(play).mock.calls;
    expect(calls).toHaveLength(buttons.length);
    const ids = calls.map(([id]) => id);
    expect(new Set(ids).size, 'ids unique on the screen').toBe(ids.length);
    const seen = visible(root);
    for (const [id, texts] of calls) {
      expect(texts.length, id).toBeGreaterThan(0);
      for (const t of texts) {
        expect(KNOWN.has(textKey(t)), `${id}: ${t}`).toBe(true);
        expect(seen, `${id} reads what is not on the screen: ${t}`).toContain(textKey(t));
      }
    }
    vi.mocked(play).mockClear();
    return ids;
  };

  it('reads only by a press, and only words that are on the screen, from building to the end of a run', () => {
    const { container } = render(<PutItBackTogether />);
    const bench = container.querySelector<HTMLElement>('section.bench')!;
    const s = SCENARIOS[0];
    expect(play).not.toHaveBeenCalled();
    expect(bench.querySelectorAll('.readaloud').length).toBeGreaterThan(0);
    expect(bench.querySelectorAll('button .readaloud')).toHaveLength(0);

    const ids = new Set(pressAll(bench));
    // Laying panels down is silent; each one then has its line under it.
    for (const role of PANEL_ROLES) {
      fireEvent.click(screen.getByRole('button', { name: panelOf(s, role).line }));
      expect(play).not.toHaveBeenCalled();
      pressAll(bench).forEach((id) => ids.add(id));
    }
    fireEvent.click(screen.getByRole('button', { name: /Run it/ }));
    expect(play).not.toHaveBeenCalled();
    for (;;) {
      pressAll(bench).forEach((id) => ids.add(id));
      const next = screen.queryByRole('button', { name: /Next panel|That is the end/ });
      if (!next) break;
      fireEvent.click(next);
      expect(play).not.toHaveBeenCalled();
    }
    pressAll(bench).forEach((id) => ids.add(id));
    expect([...ids].sort()).toEqual([
      'sel/put-it-back-together/alternative',
      'sel/put-it-back-together/frame',
      ...PANEL_ROLES.map((r) => `sel/put-it-back-together/loose/${r}`),
      'sel/put-it-back-together/opening',
      ...[0, 1, 2, 3, 4].map((i) => `sel/put-it-back-together/slot/${i}`),
      'sel/put-it-back-together/title',
      'sel/put-it-back-together/tray',
    ].sort());
  });

  it('stops reading when anything else on the bench is pressed', () => {
    const { container } = render(<PutItBackTogether />);
    const loose = screen.getByRole('button', { name: panelOf(SCENARIOS[0], 'stop').line });
    fireEvent.pointerDown(container.querySelector('.readaloud__btn')!);
    expect(stop).not.toHaveBeenCalled();
    fireEvent.pointerDown(loose);
    expect(stop).toHaveBeenCalled();
  });

  it('carries no say() call', () => {
    const src = readFileSync('src/components/sel/PutItBackTogether.tsx', 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
  });
});
