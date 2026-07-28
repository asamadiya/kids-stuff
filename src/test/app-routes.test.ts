import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import App, {
  PLAIN_ROUTES,
  ROUTE_SHAPES,
  canonicalTrail,
  isDescent,
  parseHash,
  regionSlug,
  toHash,
} from '../App';
import type { Route, RouteKind } from '../App';
import { PLAY_EXERCISE_IDS } from '../components/PlayHub';
import { WORKSHOP_TOOL_IDS } from '../components/WorkshopHub';
import { CATEGORY_LABEL, CATEGORY_ORDER, REGIONS } from '../data/meta';
import { STORIES, getStory } from '../stories';

/* -------------------------------------------------------------------------- */
/* The route table, enumerated from the data — never hand-listed               */
/* -------------------------------------------------------------------------- */

/**
 * Every route the guide can be at, grouped by shape. Typing this as a
 * `Record<RouteKind, ...>` means a new member of the `Route` union cannot be
 * added without a row here, so the walk below covers new shapes automatically
 * rather than when somebody remembers to extend a list.
 */
const ROUTES_BY_KIND: Record<RouteKind, readonly Route[]> = {
  index: [PLAIN_ROUTES.index],
  shelf: [PLAIN_ROUTES.shelf],
  timeline: [PLAIN_ROUTES.timeline],
  map: [PLAIN_ROUTES.map],
  topics: [PLAIN_ROUTES.topics],
  places: [PLAIN_ROUTES.places],
  play: [PLAIN_ROUTES.play],
  make: [PLAIN_ROUTES.make],
  topic: CATEGORY_ORDER.map((domain) => ({ kind: 'topic', domain }) as const),
  place: REGIONS.map((region) => ({ kind: 'place', region }) as const),
  exercise: PLAY_EXERCISE_IDS.map((id) => ({ kind: 'exercise', id }) as const),
  tool: WORKSHOP_TOOL_IDS.map((id) => ({ kind: 'tool', id }) as const),
  reader: STORIES.map((s) => ({ kind: 'reader', slug: s.slug, page: 0 }) as const),
};

/**
 * Two per shape: the first and one from the middle of the shape's range, so a
 * sibling transition exists inside every shape and the sample spreads across it
 * rather than clustering on whichever two entries happen to sort first. Still
 * generated — a new exercise, tool, subject or story shifts the picks by
 * itself.
 */
const REPS: readonly Route[] = Object.values(ROUTES_BY_KIND).flatMap((routes) => {
  const picks = [routes[0], routes[Math.floor(routes.length / 2)]].filter(
    (route): route is Route => route !== undefined,
  );
  return picks.filter((route, i) => picks.findIndex((r) => toHash(r) === toHash(route)) === i);
});

/** Every rep except the index, which has nothing to walk out of. */
const WALKABLE = REPS.filter((route) => route.kind !== 'index');

/**
 * The control that descends to a route, derived from the route itself. An
 * exhaustive switch: a new route shape without a way in is a compile error, not
 * a silently-skipped case.
 */
function findControl(route: Route): HTMLElement {
  const byHref = (): HTMLElement => {
    const anchor = document.querySelector<HTMLElement>(`a[href="${toHash(route)}"]`);
    if (!anchor) throw new Error(`no anchor for ${toHash(route)}`);
    return anchor;
  };
  switch (route.kind) {
    case 'index':
    case 'shelf':
    case 'timeline':
    case 'map':
    case 'topics':
    case 'places':
    case 'play':
    case 'make':
    case 'exercise':
    case 'tool':
      return byHref();
    case 'topic':
      return screen.getByRole('button', { name: CATEGORY_LABEL[route.domain] });
    case 'place':
      return screen.getByRole('button', { name: route.region });
    case 'reader': {
      const story = getStory(route.slug);
      if (!story) throw new Error(`no story ${route.slug}`);
      return screen.getByRole('button', { name: `Read ${story.title}` });
    }
    default: {
      const exhaustive: never = route;
      throw new Error(`no control for ${JSON.stringify(exhaustive)}`);
    }
  }
}

/** Drive a real traversal and wait for the hash to actually move. */
async function traverse(step: 'back' | 'forward'): Promise<void> {
  const before = window.location.hash;
  await act(async () => {
    if (step === 'back') window.history.back();
    else window.history.forward();
    for (let i = 0; i < 200 && window.location.hash === before; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2));
    }
  });
}

function mountAtIndex() {
  window.history.replaceState(null, '', '#/');
  render(createElement(App));
}

afterEach(cleanup);

/**
 * jsdom implements no SVG geometry, so `d3-zoom` — reached through the map
 * view — reads `svg.width.baseVal` off `undefined`. This is a gap in the test
 * environment, not in the guide; shimming it keeps the map inside the generated
 * walk instead of quietly excluding the one arrangement hardest to reach.
 */
beforeAll(() => {
  const proto = window.SVGSVGElement.prototype;
  for (const [name, value] of [
    ['width', 800],
    ['height', 600],
  ] as const) {
    Object.defineProperty(proto, name, {
      configurable: true,
      get: () => ({ baseVal: { value, unitType: 1 } }),
    });
  }
  Object.defineProperty(proto, 'viewBox', {
    configurable: true,
    get: () => ({ baseVal: { x: 0, y: 0, width: 800, height: 600 } }),
  });
});

/* -------------------------------------------------------------------------- */

describe('the route table', () => {
  it('round-trips every route through the hash', () => {
    for (const route of Object.values(ROUTES_BY_KIND).flat()) {
      expect(parseHash(toHash(route))).toEqual(route);
    }
  });

  it('gives every region a distinct, URL-safe slug', () => {
    const slugs = REGIONS.map(regionSlug);
    expect(new Set(slugs).size).toBe(REGIONS.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('canonicalises an unknown segment to the nearest ancestor, never to the index', () => {
    // Fails if canonicalisation is reverted to the old "anything unknown is the
    // library" rule, which left the address bar naming a screen that was never
    // rendered.
    expect(toHash(parseHash('#/play/not-a-real-exercise'))).toBe('#/play');
    expect(toHash(parseHash('#/make/not-a-real-tool'))).toBe('#/make');
    expect(toHash(parseHash('#/topic/not-a-real-subject'))).toBe('#/topic');
    expect(toHash(parseHash('#/place/not-a-real-region'))).toBe('#/place');
    expect(toHash(parseHash('#/read/not-a-real-slug/1'))).toBe('#/shelf');
    // A stray segment past a leaf is dropped rather than honoured.
    expect(toHash(parseHash(`#/play/${PLAY_EXERCISE_IDS[0]}/step-three`))).toBe(
      `#/play/${PLAY_EXERCISE_IDS[0]}`,
    );
    // Only a genuinely unknown top-level segment falls all the way back.
    expect(toHash(parseHash('#/nonsense'))).toBe('#/');
    expect(toHash(parseHash('#/read/%E0%A4%A/1'))).toBe('#/shelf');
  });

  it('clamps a story page to the pages that exist', () => {
    const story = STORIES[0];
    expect(parseHash(`#/read/${story.slug}/99999`)).toEqual({
      kind: 'reader',
      slug: story.slug,
      page: story.pages.length,
    });
    expect(parseHash(`#/read/${story.slug}/0`)).toEqual({
      kind: 'reader',
      slug: story.slug,
      page: 0,
    });
  });

  it('pushes on descent and replaces on lateral, for every pair of reps', () => {
    // The rule as a rule, not as a list: deeper within the same arm pushes,
    // everything else replaces.
    for (const from of REPS) {
      for (const to of REPS) {
        const here = ROUTE_SHAPES[from.kind];
        const there = ROUTE_SHAPES[to.kind];
        const deeper = there.depth > here.depth;
        const sameArm = here.branch === null || here.branch === there.branch;
        expect(isDescent(from, to)).toBe(deeper && sameArm);
      }
    }
    // Named consequences, so a change to the predicate reads as a behaviour change.
    expect(isDescent(PLAIN_ROUTES.index, PLAIN_ROUTES.map)).toBe(true);
    expect(isDescent(PLAIN_ROUTES.shelf, PLAIN_ROUTES.timeline)).toBe(false);
    expect(isDescent(PLAIN_ROUTES.map, { kind: 'reader', slug: STORIES[0].slug, page: 0 })).toBe(
      true,
    );
    expect(
      isDescent(
        { kind: 'reader', slug: STORIES[0].slug, page: 0 },
        { kind: 'reader', slug: STORIES[0].slug, page: 1 },
      ),
    ).toBe(false);
  });

  it('walks every route back to the index through parameterless rungs', () => {
    for (const route of REPS) {
      const trail = canonicalTrail(route);
      if (route.kind === 'index') {
        expect(trail).toEqual([]);
        continue;
      }
      expect(trail[0]).toEqual(PLAIN_ROUTES.index);
      for (const rung of trail) {
        // A rung must be reachable with no arguments, or a stale deep link
        // would have nowhere to land.
        expect(Object.keys(rung)).toEqual(['kind']);
      }
    }
  });
});

/* -------------------------------------------------------------------------- */

describe('back and forward, generated from the route table', () => {
  it.each(WALKABLE.map((route) => [toHash(route), route] as const))(
    'walks out of %s one level at a time and forward restores it',
    async (_hash, leaf) => {
      // Fails if any descent stops pushing (a hub that keeps its destination in
      // component state, or a control that scrolls instead of navigating):
      // Back would then skip a level or leave the section entirely.
      const user = userEvent.setup();
      mountAtIndex();

      const trail = canonicalTrail(leaf);
      const steps = [...trail.slice(1), leaf];

      const seen: string[] = [];
      for (const step of steps) {
        await user.click(findControl(step));
        expect(window.location.hash).toBe(toHash(step));
        seen.push(toHash(step));
      }

      const expectedBack = [...seen.slice(0, -1).reverse(), '#/'];
      const observedBack: string[] = [];
      for (let i = 0; i < steps.length; i += 1) {
        await traverse('back');
        observedBack.push(window.location.hash);
      }
      expect(observedBack).toEqual(expectedBack);

      // At the top again, the index itself is on screen — not merely the URL.
      expect(
        document.querySelectorAll('main a[href^="#/"]').length,
      ).toBeGreaterThanOrEqual(7);

      const observedForward: string[] = [];
      for (let i = 0; i < steps.length; i += 1) {
        await traverse('forward');
        observedForward.push(window.location.hash);
      }
      expect(observedForward).toEqual(seen);
    },
    30_000,
  );
});

/* -------------------------------------------------------------------------- */

describe('no destination lives in component state', () => {
  // Fast canary for the class of regression the route walk catches slowly: a
  // hub that reintroduces `const [activeId, setActiveId] = useState(null)`.
  it.each(['PlayHub', 'WorkshopHub', 'Library'])(
    '%s keeps no `set*Id` / `useState(null)` destination state',
    (name) => {
      const source = readFileSync(
        resolve(process.cwd(), 'src/components', `${name}.tsx`),
        'utf8',
      );
      expect(source).not.toMatch(/set[A-Za-z]*Id\b/);
      expect(source).not.toMatch(/useState<[^>]*>\(\s*null\s*\)/);
      expect(source).not.toMatch(/useState\(\s*null\s*\)/);
    },
  );
});

/* -------------------------------------------------------------------------- */

describe('the practice hub', () => {
  it('puts number before letters before people', async () => {
    // Fails if the old feelings-first order returns, which put the maths — the
    // stated need — below the fold.
    window.history.replaceState(null, '', '#/play');
    render(createElement(App));
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent ?? '');
    expect(headings.slice(0, 3)).toEqual([
      'Number & Quantity',
      'Letters, Shapes & Patterns',
      'People & What Happens Next',
    ]);
  });

  it('opens one exercise straight from its own address', () => {
    const id = PLAY_EXERCISE_IDS[0];
    window.history.replaceState(null, '', `#/play/${id}`);
    render(createElement(App));
    expect(document.querySelector('a[href="#/play"]')).not.toBeNull();
    expect(document.querySelector(`a[href="#/play/${id}"]`)).toBeNull();
  });
});

/* -------------------------------------------------------------------------- */

/**
 * The hierarchy as a person reviewed it, written out by hand exactly once.
 *
 * Everything else in this file derives its expectations from `ROUTE_SHAPES`,
 * which means a mistake *inside* that table moves the expectation with it: set
 * `reader.depth` to 2 and the pair-wise descent test still passes, because both
 * sides recompute from the same row. This literal is the one thing that does
 * not move. It is fourteen lines, reviewed once, and it is where a wrong parent
 * or a wrong depth is caught.
 */
const REVIEWED: Record<RouteKind, readonly [number, string | null, string | null]> = {
  /*                depth   arm       parent   */
  index: [0, null, null],
  shelf: [1, 'read', 'index'],
  timeline: [1, 'read', 'index'],
  map: [1, 'read', 'index'],
  topics: [1, 'read', 'index'],
  places: [1, 'read', 'index'],
  play: [1, 'play', 'index'],
  make: [1, 'make', 'index'],
  topic: [2, 'read', 'topics'],
  place: [2, 'read', 'places'],
  exercise: [2, 'play', 'play'],
  tool: [2, 'make', 'make'],
  // 3, not 2: a story is opened from a bare arrangement *and* from a facet, and
  // both have to push. At 2 it would be a sibling of `#/topic/numbers`, so
  // opening a story from a filtered list would replace, and Back would leave
  // the collection instead of returning to the list being browsed.
  reader: [3, 'read', 'shelf'],
};

describe('the reviewed hierarchy', () => {
  it('matches the table the app routes with — fails if a depth or a parent is retargeted', () => {
    for (const kind of Object.keys(REVIEWED) as RouteKind[]) {
      const shape = ROUTE_SHAPES[kind];
      expect([kind, shape.depth, shape.branch, shape.parent]).toEqual([
        kind,
        ...REVIEWED[kind],
      ]);
    }
    expect(Object.keys(ROUTE_SHAPES).sort()).toEqual(Object.keys(REVIEWED).sort());
  });

  it('keeps a story below every arrangement it can be opened from', () => {
    // The consequence of reader sitting at depth 3, asserted as behaviour so it
    // fails independently of the table above.
    const story: Route = { kind: 'reader', slug: STORIES[0].slug, page: 0 };
    const openableFrom: readonly Route[] = [
      PLAIN_ROUTES.shelf,
      PLAIN_ROUTES.timeline,
      PLAIN_ROUTES.map,
      PLAIN_ROUTES.topics,
      PLAIN_ROUTES.places,
      { kind: 'topic', domain: CATEGORY_ORDER[0] },
      { kind: 'place', region: REGIONS[0] },
    ];
    for (const from of openableFrom) {
      expect([toHash(from), isDescent(from, story)]).toEqual([toHash(from), true]);
    }
  });
});
