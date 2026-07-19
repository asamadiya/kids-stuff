import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  render,
  screen,
  cleanup,
  act,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { Scene } from '../illustrations/Scene';
import { STORIES, getStory } from '../stories';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { MotionToggle } from '../components/MotionToggle';

const SLUG = 'the-tallest-sunflower';
const story = getStory(SLUG)!;
const PAGE_COUNT = story.pages.length; // 7 story pages; index 7 == completion

/* -------------------------------------------------------------------------- */
/* A controllable prefers-reduced-motion mock (jsdom has no matchMedia).        */
/* -------------------------------------------------------------------------- */

interface ReducedMotionControl {
  set: (reduced: boolean) => void;
}

function mockReducedMotion(initial: boolean): ReducedMotionControl {
  let reduced = initial;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    get matches() {
      return reduced;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeListener: (listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;
  window.matchMedia = (() => mql) as typeof window.matchMedia;
  return {
    set: (value: boolean) => {
      reduced = value;
      const event = { matches: reduced, media: mql.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

const clearMatchMedia = () => {
  Reflect.deleteProperty(window, 'matchMedia');
};

const resetUrl = () => {
  window.location.hash = '';
};

/* -------------------------------------------------------------------------- */
/* useMotionPreference                                                         */
/* -------------------------------------------------------------------------- */

describe('useMotionPreference', () => {
  afterEach(() => {
    clearMatchMedia();
  });

  it('keeps motion off on load even when motion is allowed', () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useMotionPreference());
    expect(result.current.motionAllowed).toBe(true);
    expect(result.current.motionEnabled).toBe(false);
  });

  it('turns motion on only after the toggle is pressed, and back off again', () => {
    mockReducedMotion(false);
    const { result } = renderHook(() => useMotionPreference());
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(true);
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(false);
  });

  it('forbids motion when the device already prefers reduced motion', () => {
    mockReducedMotion(true);
    const { result } = renderHook(() => useMotionPreference());
    expect(result.current.motionAllowed).toBe(false);
    expect(result.current.motionEnabled).toBe(false);
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(false);
  });

  it('reacts to a runtime reduced-motion change by forcing motion off', () => {
    const control = mockReducedMotion(false);
    const { result } = renderHook(() => useMotionPreference());
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(true);

    act(() => control.set(true));
    expect(result.current.motionAllowed).toBe(false);
    expect(result.current.motionEnabled).toBe(false);

    // The toggle cannot re-enable motion while reduce is active.
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(false);

    // Restoring the setting re-allows motion, but it stays off until pressed.
    act(() => control.set(false));
    expect(result.current.motionAllowed).toBe(true);
    expect(result.current.motionEnabled).toBe(false);
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* useMotionPreference — matchMedia change-listener lifecycle                   */
/* -------------------------------------------------------------------------- */

const REDUCE_MEDIA = '(prefers-reduced-motion: reduce)';

describe('useMotionPreference media-query listener lifecycle', () => {
  afterEach(() => {
    clearMatchMedia();
  });

  it('subscribes with the modern change API and removes it on unmount', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const mql = {
      matches: false,
      media: REDUCE_MEDIA,
      onchange: null,
      addEventListener,
      removeEventListener,
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
    window.matchMedia = (() => mql) as typeof window.matchMedia;

    const { unmount } = renderHook(() => useMotionPreference());
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    const handler = addEventListener.mock.calls[0][1];

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', handler);
  });

  it('falls back to legacy addListener/removeListener and cleans them up on unmount', () => {
    const addListener = vi.fn();
    const removeListener = vi.fn();
    // No addEventListener/removeEventListener: an old Safari-style MediaQueryList.
    const mql = {
      matches: false,
      media: REDUCE_MEDIA,
      onchange: null,
      addListener,
      removeListener,
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
    window.matchMedia = (() => mql) as typeof window.matchMedia;

    const { unmount } = renderHook(() => useMotionPreference());
    expect(addListener).toHaveBeenCalledWith(expect.any(Function));
    const handler = addListener.mock.calls[0][0];

    unmount();
    expect(removeListener).toHaveBeenCalledWith(handler);
  });

  it('reacts to runtime changes through the legacy listener API', () => {
    let reduced = false;
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const mql = {
      get matches() {
        return reduced;
      },
      media: REDUCE_MEDIA,
      onchange: null,
      addListener: (listener: (event: MediaQueryListEvent) => void) =>
        listeners.add(listener),
      removeListener: (listener: (event: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList;
    window.matchMedia = (() => mql) as typeof window.matchMedia;

    const { result } = renderHook(() => useMotionPreference());
    act(() => result.current.toggleMotion());
    expect(result.current.motionEnabled).toBe(true);

    act(() => {
      reduced = true;
      const event = { matches: true, media: mql.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    });
    expect(result.current.motionAllowed).toBe(false);
    expect(result.current.motionEnabled).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/* MotionToggle component                                                      */
/* -------------------------------------------------------------------------- */

describe('MotionToggle', () => {
  afterEach(cleanup);

  it('shows a "Make it move" button that is not pressed while motion is off', () => {
    render(<MotionToggle motionEnabled={false} motionAllowed onToggle={() => {}} />);
    const button = screen.getByRole('button', { name: /make it move/i });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onToggle when the button is pressed', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<MotionToggle motionEnabled={false} motionAllowed onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: /make it move/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('reflects aria-pressed=true and makes stopping obvious when motion is on', () => {
    render(<MotionToggle motionEnabled motionAllowed onToggle={() => {}} />);
    const button = screen.getByRole('button', { name: /stop|still|calm|hold/i });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('cannot enable motion and explains the honored device setting when not allowed', () => {
    render(<MotionToggle motionEnabled={false} motionAllowed={false} onToggle={() => {}} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(
      screen.getByText(/reduce|device|motion setting|honou?r|match/i),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/* App: skip link, live region, announcements, motion gating, focus            */
/* -------------------------------------------------------------------------- */

describe('App accessibility chrome and motion gating', () => {
  beforeEach(() => {
    mockReducedMotion(false);
    resetUrl();
  });
  afterEach(() => {
    cleanup();
    clearMatchMedia();
    resetUrl();
  });

  it('renders a skip link that targets the main content region', () => {
    render(<App />);
    const skip = screen.getByRole('link', { name: /skip/i });
    expect(skip).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('exposes a visually-hidden polite live region', () => {
    const { container } = render(<App />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live).toHaveClass('visually-hidden');
  });

  it('keeps every story card motion-off until "Make it move" is pressed', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const card = container.querySelector('.story-card');
    expect(card).toHaveAttribute('data-motion', 'off');
    await user.click(screen.getByRole('button', { name: /make it move/i }));
    expect(container.querySelector('.story-card')).toHaveAttribute('data-motion', 'on');
  });

  it('gates the reader page-turn motion behind the toggle', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/1`;
    const { container } = render(<App />);
    expect(container.querySelector('.reader')).toHaveAttribute('data-motion', 'off');
    await user.click(screen.getByRole('button', { name: /make it move/i }));
    expect(container.querySelector('.reader')).toHaveAttribute('data-motion', 'on');
  });

  it('announces the reader page position and updates it on a page turn', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/1`;
    const { container } = render(<App />);
    const liveText = () =>
      container.querySelector('[aria-live="polite"]')?.textContent ?? '';
    expect(liveText()).toMatch(/page 1\b/i);
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(liveText()).toMatch(/page 2\b/i);
  });

  it('announces completion when the story is finished', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/${PAGE_COUNT}`;
    const { container } = render(<App />);
    await user.click(screen.getByRole('button', { name: /finish/i }));
    expect(
      container.querySelector('[aria-live="polite"]')?.textContent ?? '',
    ).toMatch(/finished/i);
  });
});

describe('Reader focus is preserved across page changes', () => {
  beforeEach(() => {
    mockReducedMotion(false);
    resetUrl();
  });
  afterEach(() => {
    cleanup();
    clearMatchMedia();
    resetUrl();
  });

  it('moves focus into the completion view when the story finishes', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/${PAGE_COUNT}`;
    const { container } = render(<App />);
    await user.click(screen.getByRole('button', { name: /finish/i }));
    const complete = container.querySelector('.reader__spread--complete');
    expect(complete).not.toBeNull();
    expect(complete!.contains(document.activeElement)).toBe(true);
  });

  it('never strands focus on the body when Previous disables at the first page', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/2`;
    render(<App />);
    const previous = screen.getByRole('button', { name: /previous/i });
    previous.focus();
    await user.click(previous);
    expect(screen.getByText(/Page 1 of 7/i)).toBeInTheDocument();
    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement).toHaveAccessibleName(/next|finish/i);
  });
});

/* -------------------------------------------------------------------------- */
/* Skip link preserves the reading route and moves focus to main content       */
/* -------------------------------------------------------------------------- */

describe('Skip link preserves the reading route and moves focus', () => {
  beforeEach(() => {
    mockReducedMotion(false);
    resetUrl();
  });
  afterEach(() => {
    cleanup();
    clearMatchMedia();
    resetUrl();
  });

  it('keeps native-link semantics: it is a link targeting the main content', () => {
    window.location.hash = `#/read/${SLUG}/2`;
    render(<App />);
    expect(screen.getByRole('link', { name: /skip/i })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('does not mutate the hash to #main-content or fall back to the library while reading', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/2`;
    render(<App />);
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /skip/i }));

    // The reader must stay on the same page: activating the skip link must not
    // replace the #/read/... route with #main-content (which would route home).
    expect(screen.getByText(/Page 2 of 7/i)).toBeInTheDocument();
    expect(window.location.hash).toMatch(/^#\/read\//);
  });

  it('moves keyboard focus into the main content region when activated while reading', async () => {
    const user = userEvent.setup();
    window.location.hash = `#/read/${SLUG}/2`;
    render(<App />);

    await user.click(screen.getByRole('link', { name: /skip/i }));

    const main = document.getElementById('main-content');
    expect(main).not.toBeNull();
    expect(document.activeElement).toBe(main);
  });

  it('moves focus into the library main content when activated in the library', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: /skip/i }));

    const main = document.getElementById('main-content');
    expect(main).not.toBeNull();
    expect(document.activeElement).toBe(main);
    // Still the library — no accidental navigation.
    expect(
      screen.getByRole('heading', { level: 1, name: /moonlit storybook/i }),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/* Ambient scene motion is gated (static CSS contract for illustrations.css)   */
/* -------------------------------------------------------------------------- */

interface CssRule {
  readonly selector: string;
  readonly body: string;
  readonly media: string;
}

function readCss(rel: string): string {
  return readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
}

function topBlocks(css: string): Array<{ prelude: string; body: string }> {
  const blocks: Array<{ prelude: string; body: string }> = [];
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] !== '{') continue;
    const prelude = css.slice(start, i).trim();
    let depth = 1;
    let j = i + 1;
    for (; j < css.length && depth > 0; j += 1) {
      if (css[j] === '{') depth += 1;
      else if (css[j] === '}') depth -= 1;
      if (depth === 0) break;
    }
    blocks.push({ prelude, body: css.slice(i + 1, j) });
    i = j;
    start = j + 1;
  }
  return blocks;
}

function collectRules(css: string, media = ''): CssRule[] {
  const rules: CssRule[] = [];
  for (const { prelude, body } of topBlocks(css)) {
    if (prelude.startsWith('@keyframes')) continue;
    if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
      const nextMedia = prelude.startsWith('@media')
        ? `${media} ${prelude}`.trim()
        : media;
      rules.push(...collectRules(body, nextMedia));
    } else {
      rules.push({ selector: prelude, body, media });
    }
  }
  return rules;
}

const RUNNING_ANIMATION = /\banimation(?:-name)?\s*:\s*([^;}]+)/i;
const RUNNING_TRANSITION =
  /\btransition(?:-property|-duration)?\s*:\s*([^;}]+)/i;

/** A transition value that actually animates (not `none` and not a 0s no-op). */
function isMovingTransition(value: string): boolean {
  return !/^\s*none\b/.test(value) && !/^\s*0s\b/.test(value);
}

describe('ambient scene motion CSS contract', () => {
  it('gates every running scene animation behind data-motion=on + no-preference', () => {
    const rules = collectRules(readCss('../styles/illustrations.css'));
    const running = rules.filter((rule) => {
      const match = rule.body.match(RUNNING_ANIMATION);
      return match !== null && !/^\s*none\b/.test(match[1]);
    });
    expect(running.length).toBeGreaterThan(0);
    for (const rule of running) {
      expect(
        /prefers-reduced-motion\s*:\s*no-preference/.test(rule.media),
        `ungated media for "${rule.selector}"`,
      ).toBe(true);
      expect(
        rule.selector
          .split(',')
          .every((part) => /\.scene\[data-motion=['"]on['"]\]/.test(part)),
        `ungated selector "${rule.selector}"`,
      ).toBe(true);
    }
  });

  it('gates every non-none scene transition behind data-motion=on + no-preference', () => {
    const rules = collectRules(readCss('../styles/illustrations.css'));
    const transitions = rules.filter((rule) => {
      const match = rule.body.match(RUNNING_TRANSITION);
      return match !== null && isMovingTransition(match[1]);
    });
    // Every moving transition must be gated exactly like the animations are, so
    // motion-off + reduced-motion readers never see a transition either.
    for (const rule of transitions) {
      expect(
        /prefers-reduced-motion\s*:\s*no-preference/.test(rule.media),
        `ungated transition media for "${rule.selector}"`,
      ).toBe(true);
      expect(
        rule.selector
          .split(',')
          .every((part) => /\.scene\[data-motion=['"]on['"]\]/.test(part)),
        `ungated transition selector "${rule.selector}"`,
      ).toBe(true);
    }
  });

  it('stops all scene animation under prefers-reduced-motion: reduce', () => {
    const reset = collectRules(readCss('../styles/illustrations.css')).find(
      (rule) =>
        /prefers-reduced-motion\s*:\s*reduce/.test(rule.media) &&
        /animation\s*:\s*none/.test(rule.body),
    );
    expect(reset).toBeDefined();
  });

  it('neutralizes both animation and transition under prefers-reduced-motion: reduce', () => {
    const reset = collectRules(readCss('../styles/illustrations.css')).find(
      (rule) =>
        /prefers-reduced-motion\s*:\s*reduce/.test(rule.media) &&
        /\.scene\[data-motion=['"]on['"]\]/.test(rule.selector),
    );
    expect(reset, 'expected a reduced-motion reset for scene motion').toBeDefined();
    expect(
      /animation\s*:\s*none/.test(reset!.body),
      'reduced-motion reset must stop animation',
    ).toBe(true);
    expect(
      /transition\s*:\s*none/.test(reset!.body),
      'reduced-motion reset must stop transition',
    ).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/* Each story exposes its ambient-motion hook on at least one page             */
/* -------------------------------------------------------------------------- */

const MOTION_HOOK_BY_STORY: Record<string, string> = {
  'the-tallest-sunflower': 'scene-sunflower-head',
  'pips-pattern-parade': 'scene-button',
  'the-echo-in-the-canyon': 'scene-sound',
  'nadias-kite-and-the-wind': 'scene-wind-streaks',
  'the-little-bean-seed': 'scene-vine',
  'chasing-my-shadow': 'scene-flower-bed',
  'following-the-north-star': 'scene-starfield',
  'the-ramp-to-the-treehouse': 'scene-canopy',
};

describe('story-specific ambient-motion hooks exist', () => {
  afterEach(cleanup);

  for (const story of STORIES) {
    it(`${story.slug} renders .${MOTION_HOOK_BY_STORY[story.slug]} on at least one page`, () => {
      const hook = MOTION_HOOK_BY_STORY[story.slug];
      const present = story.pages.some((page) => {
        const { container } = render(
          <Scene story={story} page={page} motionEnabled />,
        );
        const found = container.querySelector(`.${hook}`) !== null;
        cleanup();
        return found;
      });
      expect(present, `${story.slug} should render .${hook} somewhere`).toBe(true);
    });
  }
});

/* -------------------------------------------------------------------------- */
/* Completing the motion spec: firefly drift, water ripple, and kite tug.      */
/*                                                                            */
/* The story motifs that previously had no ambient movement (a firefly that    */
/* only glimmered, still water, an untugged kite) must each expose a           */
/* motion-SAFE hook — an element CSS can animate with a transform/opacity loop  */
/* WITHOUT overwriting the positioning transform that anchors the artwork —    */
/* and illustrations.css must drive each with a slow, gated animation.         */
/* -------------------------------------------------------------------------- */

describe('firefly drift exposes a motion-safe inner hook', () => {
  afterEach(cleanup);
  const pip = getStory('pips-pattern-parade')!;

  it('wraps the firefly body in a .scene-firefly-drift hook that carries no transform of its own', () => {
    let checked = 0;
    for (const page of pip.pages) {
      const { container } = render(<Scene story={pip} page={page} motionEnabled />);
      for (const firefly of Array.from(container.querySelectorAll('.scene-firefly'))) {
        checked += 1;
        // The firefly itself keeps its positioning translate…
        expect(firefly.getAttribute('transform')).toMatch(/translate/);
        // …and the drift hook is a separate inner element with no transform, so
        // the CSS drift never fights that positioning transform.
        const drift = firefly.querySelector('.scene-firefly-drift');
        expect(
          drift,
          `${page.scene.id} firefly should expose an inner .scene-firefly-drift hook`,
        ).not.toBeNull();
        expect(drift!.getAttribute('transform')).toBeNull();
        // The glowing body still lives inside the drift hook (art stays complete).
        expect(drift!.querySelector('circle')).not.toBeNull();
      }
      cleanup();
    }
    expect(checked, 'Pip should render at least one firefly').toBeGreaterThan(0);
  });
});

describe('water ripple exposes a motion-safe hook in every water body', () => {
  afterEach(cleanup);
  const waterStories = ['the-echo-in-the-canyon', 'following-the-north-star'] as const;

  for (const slug of waterStories) {
    const story = getStory(slug)!;
    it(`${slug} exposes a .scene-ripple hook (no conflicting transform/opacity) inside its water`, () => {
      let checked = 0;
      for (const page of story.pages) {
        const { container } = render(<Scene story={story} page={page} motionEnabled />);
        for (const water of Array.from(container.querySelectorAll('.scene-water'))) {
          checked += 1;
          const ripple = water.querySelector('.scene-ripple');
          expect(
            ripple,
            `${slug}/${page.scene.id} water should expose a .scene-ripple hook`,
          ).not.toBeNull();
          // No inline transform/opacity, so a CSS ripple loop is applied cleanly.
          expect(ripple!.getAttribute('transform')).toBeNull();
          expect(ripple!.getAttribute('opacity')).toBeNull();
          // The highlight lines that read as ripples live inside the hook.
          expect(ripple!.querySelector('path')).not.toBeNull();
        }
        cleanup();
      }
      expect(checked, `${slug} should render at least one water body`).toBeGreaterThan(0);
    });
  }
});

describe('kite tug wraps positioned kite art in a motion-safe outer hook', () => {
  afterEach(cleanup);
  const wind = getStory('nadias-kite-and-the-wind')!;

  it('gives every kite an outer .scene-kite-tug wrapper while the inner SVG transform and motifs survive', () => {
    let checked = 0;
    for (const page of wind.pages) {
      const { container } = render(<Scene story={wind} page={page} motionEnabled />);
      for (const kite of Array.from(container.querySelectorAll('.scene-kite'))) {
        checked += 1;
        // Inner kite keeps its positioning transform and its semantic hooks…
        expect(kite.getAttribute('transform')).toMatch(/translate/);
        expect(kite.getAttribute('data-motif')).toBe('kite');
        expect(kite.getAttribute('data-cx')).not.toBeNull();
        expect(kite.getAttribute('data-cy')).not.toBeNull();
        // …inside an outer motion wrapper that carries NO transform (so the CSS
        // tug composes with, and never overwrites, the inner transform) and no
        // motif of its own (the kite motif stays unique).
        const wrapper = kite.closest('.scene-kite-tug');
        expect(wrapper, `${page.scene.id} kite must sit inside a .scene-kite-tug wrapper`).not.toBeNull();
        expect(wrapper).not.toBe(kite);
        expect(wrapper!.getAttribute('transform')).toBeNull();
        expect(wrapper!.getAttribute('data-motif')).toBeNull();
      }
      cleanup();
    }
    expect(checked, 'the wind story should render kites').toBeGreaterThan(0);
  });
});

describe('illustrations.css drives firefly drift, water ripple, and kite tug', () => {
  const readAmbientCss = () => readCss('../styles/illustrations.css');

  const keyframeBody = (name: string): string =>
    topBlocks(readAmbientCss()).find((b) => b.prelude.trim() === `@keyframes ${name}`)?.body ?? '';

  const gatedAnimationRuleFor = (hook: string): CssRule | undefined => {
    const selector = new RegExp(
      `\\.scene\\[data-motion=['"]on['"]\\]\\s+\\.${hook}(?![\\w-])`,
    );
    return collectRules(readAmbientCss()).find(
      (rule) =>
        RUNNING_ANIMATION.test(rule.body) &&
        rule.selector.split(',').some((part) => selector.test(part)),
    );
  };

  const expectSlowGatedAnimation = (hook: string, keyframeContent: RegExp) => {
    const rule = gatedAnimationRuleFor(hook);
    expect(rule, `expected a running animation rule for .${hook}`).toBeDefined();
    // Gated by no-preference AND data-motion=on on every part of the selector.
    expect(
      /prefers-reduced-motion\s*:\s*no-preference/.test(rule!.media),
      `.${hook} animation must live under prefers-reduced-motion: no-preference`,
    ).toBe(true);
    expect(
      rule!.selector
        .split(',')
        .every((part) => /\.scene\[data-motion=['"]on['"]\]/.test(part)),
      `.${hook} animation must be gated by data-motion=on`,
    ).toBe(true);
    // Slow, ambient movement (no snappy sub-second loops).
    const shorthand = (rule!.body.match(RUNNING_ANIMATION)?.[1] ?? '').trim();
    const name = shorthand.split(/\s+/)[0];
    const seconds = Number((shorthand.match(/(\d+(?:\.\d+)?)s/) ?? [])[1]);
    expect(seconds, `.${hook} motion should be slow (>= 4s), got "${shorthand}"`).toBeGreaterThanOrEqual(4);
    // The keyframe actually animates the expected calm property.
    expect(
      keyframeBody(name),
      `.${hook} keyframe "${name}" must animate ${keyframeContent}`,
    ).toMatch(keyframeContent);
  };

  it('drives firefly drift with a slow, gated transform animation', () => {
    expectSlowGatedAnimation('scene-firefly-drift', /transform\s*:/);
  });

  it('drives water ripple with a slow, gated opacity/transform animation', () => {
    expectSlowGatedAnimation('scene-ripple', /transform\s*:|opacity\s*:/);
  });

  it('drives kite tug with a slow, gated transform animation', () => {
    expectSlowGatedAnimation('scene-kite-tug', /transform\s*:/);
  });
});
