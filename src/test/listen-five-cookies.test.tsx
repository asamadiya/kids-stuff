import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import FiveCookies from '../components/sel/FiveCookies';
import {
  FIVE_COOKIES_META, LISTEN, SCENARIOS, SERVED_LINE,
  adjust, allAllocations, emptyShares, isComplete, outcomes, remaining, splitLine, wayIndex, word,
  listenLines,
} from '../sel/five-cookies';
import type { Scenario, Shares } from '../sel/five-cookies';
import { getPlaying, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Five Cookies read-aloud (advisor a9; .redesign/v4/research/sel-audit.md §8).
 * Every button reads only what is on screen, only when pressed, and only lines
 * the clip builder was handed by `listenLines()`.
 */

const LINES = listenLines();
const KEYS = new Set(LINES.map(textKey));

/* ------------------------------------------------------- the state walk -- */

interface State {
  readonly shares: Shares;
  readonly served: boolean;
  readonly first: Shares | null;
  readonly second: Shares | null;
}

/** The component's transitions, as its handlers make them. */
function nextStates(s: Scenario, st: State): State[] {
  const out: State[] = [];
  if (!st.served) {
    for (let i = 0; i < s.claimants.length; i += 1) {
      for (const d of [1, -1]) out.push({ ...st, shares: adjust(s, st.shares, i, d) });
    }
    if (isComplete(s, st.shares)) {
      out.push(st.first === null
        ? { ...st, served: true, first: st.shares }
        : { ...st, served: true, second: st.shares });
    }
  } else if (st.second === null) {
    out.push({ ...st, shares: emptyShares(s), served: false });
  }
  out.push({ shares: emptyShares(s), served: false, first: null, second: null });
  return out;
}

const stateKey = (st: State): string =>
  `${st.shares.join(',')}|${st.served}|${st.first?.join(',') ?? '-'}|${st.second?.join(',') ?? '-'}`;

/** Every state reachable from opening the board. */
function reachable(s: Scenario): State[] {
  const start: State = { shares: emptyShares(s), served: false, first: null, second: null };
  const seen = new Map([[stateKey(start), start]]);
  const queue = [start];
  while (queue.length) {
    for (const n of nextStates(s, queue.shift()!)) {
      const k = stateKey(n);
      if (!seen.has(k)) {
        seen.set(k, n);
        queue.push(n);
      }
    }
  }
  return [...seen.values()];
}

/** What every read button on screen reads in this state, as the component builds it. */
function buttonTexts(s: Scenario, st: State): (readonly string[])[] {
  const way = wayIndex(st.first, st.second, st.served);
  const left = remaining(s, st.shares);
  const texts = [
    LISTEN.head(),
    LISTEN.setting(s),
    LISTEN.caption(s, st.shares, way, st.served),
    LISTEN.tray(s, left, st.served),
    ...s.claimants.map((c) => LISTEN.claim(c)),
  ];
  if (st.served) {
    const o = outcomes(s, st.shares);
    texts.push(...s.claimants.map((c, i) => LISTEN.reaction(c, o[i])));
  }
  return texts;
}

describe('five-cookies listenLines', () => {
  it('has no empty line, no duplicate after textKey, and nothing over 300 characters', () => {
    expect(LINES.length).toBeGreaterThan(0);
    expect(LINES.filter((l) => textKey(l) === '')).toEqual([]);
    expect(KEYS.size).toBe(LINES.length);
    expect(LINES.filter((l) => l.length > 300)).toEqual([]);
  });

  it('holds every line any button reads in any reachable state', () => {
    let states = 0;
    for (const s of SCENARIOS) {
      for (const st of reachable(s)) {
        states += 1;
        for (const texts of buttonTexts(s, st)) {
          expect(texts.length).toBeGreaterThan(0);
          for (const t of texts) expect(KEYS.has(textKey(t)), `${s.id}: ${t}`).toBe(true);
        }
      }
    }
    expect(states).toBeGreaterThan(1000);
  });

  it('holds nothing a button can never read', () => {
    const asked = new Set<string>();
    for (const s of SCENARIOS) {
      for (const st of reachable(s)) for (const texts of buttonTexts(s, st)) for (const t of texts) asked.add(textKey(t));
    }
    expect(LINES.filter((l) => !asked.has(textKey(l)))).toEqual([]);
  });

  it('matches the audit enumeration, less the reactions no split can reach', () => {
    const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
    const audit = new Set<string>([
      FIVE_COOKIES_META.title, FIVE_COOKIES_META.note, 'First way.', 'Second way.', SERVED_LINE,
      ...SCENARIOS.flatMap((s) => [
        s.setting,
        `Drag a ${s.unit} onto a plate, or use plus and minus.`,
        ...s.claimants.flatMap((c) => [c.claim, ...Object.values(c.reaction)]),
        ...allAllocations(s.units, s.claimants.length).map(splitLine),
        ...Array.from({ length: s.units + 1 }, (_, n) =>
          `${n === 0 ? 'No' : cap(word(n))} ${n === 1 ? s.unit : s.unitPlural} still to hand out.`),
        ...Array.from({ length: s.units + 1 }, (_, n) => `${cap(word(n))} left.`),
      ]),
    ]);
    expect(audit.size).toBe(177);
    // A claim that asks for one is met by one and missed only by none, so its
    // "short" reaction is authored but no split shows it on screen.
    const never = SCENARIOS.flatMap((s) =>
      s.claimants.filter((c) => c.kind !== 'work' && c.asks === 1).map((c) => c.reaction.short));
    expect(never).toHaveLength(5);
    expect(LINES.filter((l) => !audit.has(l))).toEqual([]);
    expect([...audit].filter((l) => !LINES.includes(l)).sort()).toEqual([...new Set(never)].sort());
  });

  it('starts the caption with a capital and never says "none cookies"', () => {
    for (const l of LINES) {
      expect(l, l).toMatch(/^[A-Z“"]/);
      expect(l, l).not.toMatch(/\bnone (cookie|turn|seat|dinosaur)s?\b/i);
    }
  });

  it('names the way on the table: first until the board is laid again', () => {
    const a = [2, 2, 1];
    expect(wayIndex(null, null, false)).toBe(0);
    expect(wayIndex(a, null, true)).toBe(0);
    expect(wayIndex(a, null, false)).toBe(1);
    expect(wayIndex(a, [1, 2, 2], true)).toBe(1);
  });
});

/* ------------------------------------------------------- the component -- */

class FakeAudio {
  static made: FakeAudio[] = [];
  src = '';
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    FakeAudio.made.push(this);
  }
  play() {
    return Promise.resolve();
  }
  pause() {}
  removeAttribute() {}
  load() {}
}
const tick = () => new Promise((r) => setTimeout(r, 0));
const M: Manifest = { mom: { en: Object.fromEntries(LINES.map((l, i) => [textKey(l), `fc${i}`])) } };

beforeEach(() => {
  FakeAudio.made = [];
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

const press = (el: Element) => {
  fireEvent.pointerDown(el);
  fireEvent.click(el);
};

describe('FiveCookies read buttons', () => {
  it('has no say() left in its source', () => {
    const src = readFileSync('src/components/sel/FiveCookies.tsx', 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
  });

  it('renders read buttons, and the setting it reads is on screen', () => {
    const { container } = render(<FiveCookies />);
    expect(container.querySelectorAll('.readaloud button').length).toBeGreaterThan(0);
    const s = SCENARIOS[0];
    expect(screen.getByText(s.setting)).toBeTruthy();
    for (const c of s.claimants) expect(screen.getByText(c.claim)).toBeTruthy();
    expect(screen.getByRole('button', { name: /read it to me/i })).toBeTruthy();
  });

  it('shows exactly the atoms its buttons read through a whole run, and never speaks unasked', async () => {
    const s = SCENARIOS[0];
    const { container } = render(<FiveCookies />);
    const text = (t: string) => expect(container.textContent).toContain(t);
    text('First way. Five cookies still to hand out.');
    text('Drag a cookie onto a plate, or use plus and minus. Five left.');

    const plus = screen.getByRole('button', { name: `Give one more cookie to ${s.claimants[0].name}` });
    for (let i = 0; i < s.units; i += 1) press(plus);
    text('First way. No cookies still to hand out.');
    text('Drag a cookie onto a plate, or use plus and minus. None left.');

    press(screen.getByRole('button', { name: 'Serve it' }));
    text('First way. Five, none, none.');
    text(SERVED_LINE);
    const o = outcomes(s, [5, 0, 0]);
    s.claimants.forEach((c, i) => text(c.reaction[o[i]]));

    press(screen.getByRole('button', { name: 'Try it another way' }));
    text('Second way. Five cookies still to hand out.');

    await act(tick);
    expect(FakeAudio.made).toHaveLength(0);
    expect(getPlaying()).toBeNull();
  });

  it('plays only on a press, and any other press in the exercise stops it', async () => {
    const s = SCENARIOS[0];
    render(<FiveCookies />);
    const claims = screen.getByText('What each person says').parentElement!;
    const first = within(claims).getByRole('button', { name: new RegExp(`Read ${s.claimants[0].name}'s reason`) });
    await act(async () => {
      fireEvent.click(first);
      await tick();
    });
    expect(getPlaying()?.id).toBe(`sel/five-cookies/claim/${s.claimants[0].id}`);
    expect(FakeAudio.made.length).toBe(1);

    await act(async () => {
      press(screen.getByRole('button', { name: `Give one more cookie to ${s.claimants[1].name}` }));
      await tick();
    });
    expect(getPlaying()).toBeNull();
  });
});
