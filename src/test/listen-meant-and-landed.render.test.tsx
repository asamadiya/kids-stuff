import { createElement, type ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { getPlaying, resetForTests, textKey } from '../audio/readAloud';
import type { ReadAloud as RealReadAloud } from '../audio/ReadAloud';
import { MeantAndLanded } from '../components/sel/MeantAndLanded';
import { LANDINGS, MOMENTS, THOUGHTS, listenLines, sideOf, type SideKey } from '../sel/meant-and-landed';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * The bench as the child meets it: every read button it mounts, in every state
 * reachable by the moment arrows, the flip and the two rails, asks only for
 * lines the clip builder is given, and reads what is on the screen beside it.
 */

type Props = ComponentProps<typeof RealReadAloud>;
const seen = vi.hoisted(() => ({ props: [] as Props[] }));

vi.mock('../audio/ReadAloud', async (importOriginal) => {
  const real = await importOriginal<typeof import('../audio/ReadAloud')>();
  return {
    ReadAloud: (p: Props) => {
      seen.props.push(p);
      return createElement(real.ReadAloud, p);
    },
  };
});

const known = new Set(listenLines().map(textKey));

beforeEach(() => {
  window.localStorage.clear();
  resetForTests({});
  seen.props = [];
});
afterEach(() => cleanup());

/** A bench button by its words (role queries are too slow for a 400-state walk). */
const button = (words: string, selector = '.bench button'): HTMLElement => {
  const hit = [...document.querySelectorAll<HTMLElement>(selector)].find((el) => el.textContent === words);
  if (!hit) throw new Error(`no button "${words}"`);
  return hit;
};
const press = (words: string): void => {
  fireEvent.click(button(words));
};
/** A rail chip: the thought label or the portrait word. */
const chip = (label: string): HTMLElement => button(label, '.bench-part');

describe('meant-and-landed: the read buttons on the bench', () => {
  it('renders read buttons, none nested in another button, none started by itself', () => {
    render(<MeantAndLanded />);
    const buttons = document.querySelectorAll('.readaloud');
    // title, the ask, and the two trays; the join plate has none until both rails are set
    expect(buttons.length).toBe(4);
    for (const b of buttons) expect(b.closest('button')).toBeNull();
    expect(screen.getAllByRole('button', { name: /read it to me/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /read these out/i })).toHaveLength(2);
    expect(getPlaying()).toBeNull();
  });

  it('reads the tray labels and the ask exactly as the screen shows them', () => {
    render(<MeantAndLanded />);
    const side = sideOf(MOMENTS[0], 'front');
    const labels = [...document.querySelectorAll('.bench__tray-label')].map((p) => p.textContent);
    const last = new Map(seen.props.map((p) => [p.id, p.texts]));
    expect(last.get('sel/meant-and-landed/meant-tray')?.[0]).toBe(labels[0]);
    expect(last.get('sel/meant-and-landed/landed-tray')?.[0]).toBe(labels[1]);
    expect(last.get('sel/meant-and-landed/situation')).toEqual([MOMENTS[0].caption, side.ask]);
    expect(screen.getByText(side.ask)).toBeTruthy();
    expect(screen.getByText(MOMENTS[0].caption)).toBeTruthy();
  });

  it('shows the join button only when both rails are set, reading the three clauses the plate draws', () => {
    render(<MeantAndLanded />);
    const joinNow = () => new Map(seen.props.map((p) => [p.id, p.texts])).get('sel/meant-and-landed/join');
    expect(document.querySelectorAll('.readaloud')).toHaveLength(4);
    fireEvent.click(chip(THOUGHTS[1].label));
    expect(document.querySelectorAll('.readaloud')).toHaveLength(4);
    fireEvent.click(chip(LANDINGS[5].word));
    expect(document.querySelectorAll('.readaloud')).toHaveLength(5);
    const drawn = [...document.querySelectorAll('svg[role="img"] text')].map((t) => t.textContent).slice(-3);
    expect(joinNow()).toEqual(drawn);
    expect(getPlaying()).toBeNull();
    press('clear this side');
    expect(document.querySelectorAll('.readaloud')).toHaveLength(4);
  });

  it('asks only for lines the clip builder has, in every moment, side and rail', () => {
    render(<MeantAndLanded />);
    const asked = new Set<string>();
    let states = 0;
    /**
     * What each mounted read button would play now: the props of its last render
     * since the previous state. Distinct ids must equal the buttons on screen, so
     * two buttons sharing an id would fail here.
     */
    const take = (): void => {
      const now = new Map(seen.props.map((p) => [p.id, p.texts]));
      expect(now.size).toBe(document.querySelectorAll('.readaloud').length);
      for (const texts of now.values()) {
        expect(texts.length).toBeGreaterThan(0);
        for (const t of texts) asked.add(t);
      }
      seen.props = [];
      states += 1;
    };
    for (let m = 0; m < MOMENTS.length; m += 1) {
      for (const key of ['front', 'turned'] as SideKey[]) {
        if (key === 'turned') press(sideOf(MOMENTS[m], 'front').flip);
        take();
        // every chip against one portrait, then every portrait against one chip
        for (const t of THOUGHTS) {
          fireEvent.click(chip(t.label));
          if (t === THOUGHTS[0]) fireEvent.click(chip(LANDINGS[0].word));
          take();
        }
        for (const l of LANDINGS.slice(1)) {
          fireEvent.click(chip(l.word));
          take();
        }
      }
      press('the next moment');
    }
    expect(states).toBe(MOMENTS.length * 2 * (1 + THOUGHTS.length + LANDINGS.length - 1));
    expect(getPlaying()).toBeNull();
    const unknown = [...asked].filter((t) => !known.has(textKey(t)));
    expect(unknown).toEqual([]);
    // and the other way: nothing handed to the clip builder is out of every button's reach
    const reached = new Set([...asked].map(textKey));
    expect([...known].filter((k) => !reached.has(k))).toEqual([]);
  });
});
