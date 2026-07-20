import { render, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, it, expect } from 'vitest';
import { Scene } from '../illustrations/Scene';
import { STORIES } from '../stories';
import type { Story, StoryPage } from '../types';

afterEach(cleanup);

interface PageCase {
  readonly story: Story;
  readonly page: StoryPage;
  readonly index: number;
}

const allPages: PageCase[] = STORIES.flatMap((story) =>
  story.pages.map((page, index) => ({ story, page, index })),
);

const pageBySceneId = (sceneId: string): PageCase => {
  const found = allPages.find((p) => p.page.scene.id === sceneId);
  if (!found) throw new Error(`test setup error: no production page "${sceneId}"`);
  return found;
};

const renderSvg = (story: Story, page: StoryPage, motionEnabled = false): SVGSVGElement => {
  const { container } = render(
    <Scene story={story} page={page} motionEnabled={motionEnabled} />,
  );
  const svg = container.querySelector('svg');
  if (!svg) throw new Error('Scene did not render an <svg> root');
  return svg as unknown as SVGSVGElement;
};

const artOf = (svg: SVGSVGElement): Element => {
  const art = svg.querySelector('[data-scene-art]');
  if (!art) throw new Error('Scene has no [data-scene-art] group');
  return art;
};

const artBySceneId = (sceneId: string): Element => {
  const { story, page } = pageBySceneId(sceneId);
  return artOf(renderSvg(story, page));
};

const motifCount = (art: Element, motif: string): number =>
  art.querySelectorAll(`[data-motif="${motif}"]`).length;

const num = (el: Element | null, attr: string): number => Number(el?.getAttribute(attr));

/* -------------------------------------------------------------------------- */
/* Finding 1 — exhaustive story/world/page mapping; fail clearly on unknowns   */
/* -------------------------------------------------------------------------- */

describe('Scene mapping is exhaustive and fails clearly for unknown inputs (finding 1)', () => {
  it('resolves every one of the 63 production pages without throwing', () => {
    expect(allPages).toHaveLength(63);
    for (const { story, page } of allPages) {
      expect(
        () =>
          renderToStaticMarkup(
            <Scene story={story} page={page} motionEnabled={false} />,
          ),
        `${story.slug}/${page.scene.id} should resolve to a real scene`,
      ).not.toThrow();
    }
  });

  it('throws for an unknown story slug instead of drawing generic fallback art', () => {
    const base = allPages[0];
    const unknownStory = { ...base.story, slug: 'totally-unknown-story' } as Story;
    expect(() =>
      renderToStaticMarkup(
        <Scene story={unknownStory} page={base.page} motionEnabled={false} />,
      ),
    ).toThrow(/totally-unknown-story|slug|No illustration/i);
  });

  it('throws for a known story with an unregistered scene id instead of fallback art', () => {
    const base = allPages[0];
    const page = {
      ...base.page,
      scene: { ...base.page.scene, id: 'sunflower-99-does-not-exist' },
    } as StoryPage;
    expect(() =>
      renderToStaticMarkup(
        <Scene story={base.story} page={page} motionEnabled={false} />,
      ),
    ).toThrow(/sunflower-99-does-not-exist|scene id|No illustration/i);
  });

  it('throws a clear "No illustration" error for "constructor" as a story slug (prototype-key edge case)', () => {
    const base = allPages[0];
    const poisoned = { ...base.story, slug: 'constructor' } as Story;
    expect(() =>
      renderToStaticMarkup(
        <Scene story={poisoned} page={base.page} motionEnabled={false} />,
      ),
    ).toThrow(/No illustration/i);
  });

  it('throws a clear "No illustration" error for "constructor" as a scene id (prototype-key edge case)', () => {
    const base = allPages[0];
    const page = {
      ...base.page,
      scene: { ...base.page.scene, id: 'constructor' },
    } as StoryPage;
    expect(() =>
      renderToStaticMarkup(
        <Scene story={base.story} page={page} motionEnabled={false} />,
      ),
    ).toThrow(/No illustration/i);
  });
});

/* -------------------------------------------------------------------------- */
/* Finding 2 — behaviour-focused semantic motif assertions                     */
/* -------------------------------------------------------------------------- */

describe('Every production page exposes at least one semantic motif hook (finding 2)', () => {
  for (const { story, page } of allPages) {
    it(`${page.scene.id} exposes at least one [data-motif] hook`, () => {
      const art = artOf(renderSvg(story, page));
      expect(art.querySelectorAll('[data-motif]').length).toBeGreaterThan(0);
    });
  }
});

/**
 * Each production page must show motifs that belong to its own story/scene — not
 * an arbitrary set of shapes. This map ties every scene id to the visible motif
 * hooks its page must expose. It is the primary anti-gaming guard; the
 * fingerprint/shape-count checks in Scene.test.tsx are only supplemental.
 */
const EXPECTED_MOTIFS: Record<string, readonly string[]> = {
  // The Tallest Sunflower — measuring with a knotted ribbon.
  'sunflower-01-dawn-window': ['sunflower-head'],
  'sunflower-02-hand-stack': ['sunflower-stem'],
  'sunflower-03-knot-ribbon': ['ribbon', 'knot'],
  'sunflower-04-windy-wobble': ['sunflower-head', 'ribbon'],
  'sunflower-05-teamwork-count': ['ribbon', 'knot'],
  'sunflower-06-fourteen-hands': ['ribbon', 'knot'],
  'sunflower-07-moonlit-sleep': ['sunflower-head', 'sleep-cue'],
  // Pip's Pattern Parade — buttons in patterns.
  'pattern-01-porch-buttons': ['button'],
  'pattern-02-red-blue-line': ['button'],
  'pattern-03-big-small-curve': ['button'],
  'pattern-04-breeze-bump': ['button'],
  'pattern-05-fix-together': ['button'],
  'pattern-06-finished-parade': ['button'],
  'pattern-07-jar-moonlight': ['button'],
  // The Echo in the Canyon — safe rim, voice arcs, camp.
  'echo-01-canyon-edge': ['rail'],
  'echo-02-first-hello': ['echo-arc', 'rail'],
  'echo-03-shy-breath': ['echo-arc', 'rail'],
  'echo-04-brave-call': ['echo-arc', 'rail'],
  'echo-05-echo-game': ['echo-arc', 'rail'],
  'echo-06-first-stars': ['echo-arc', 'rail'],
  'echo-07-tent-stars': ['echo-arc', 'tent', 'campfire'],
  // Nadia's Kite and the Wind — kite + one-direction wind clues.
  'wind-01-hilltop-kite': ['kite', 'wind'],
  'wind-02-flop-run': ['kite', 'wind'],
  'wind-03-reading-clues': ['wind'],
  'wind-04-first-lift': ['kite', 'wind'],
  'wind-05-dancing-high': ['kite', 'wind'],
  'wind-06-winding-in': ['kite'],
  'wind-07-resting-kite': ['kite'],
  // The Little Bean Seed — seed → root → sprout → leafed stem.
  'bean-01-seed-in-palm': ['bean'],
  'bean-02-planting-pot': ['bean'],
  'bean-03-sunny-sill': ['pot'],
  'bean-04-worried-wait': ['root'],
  'bean-05-first-sprout': ['sprout'],
  'bean-06-climbing-stem': ['stem'],
  'bean-07-moonlit-plant': ['stem'],
  // Chasing My Shadow — a shadow that changes across the day.
  'shadow-01-morning-meet': ['shadow'],
  'shadow-02-copycat-shapes': ['shadow'],
  'shadow-03-shadow-tag': ['shadow'],
  'shadow-04-tiny-noon': ['shadow'],
  'shadow-05-giant-evening': ['shadow'],
  'shadow-06-dusk-fade': ['shadow'],
  'shadow-07-nightlight-teddy': ['shadow'],
  // Following the North Star — path, star dome, pointer to Polaris.
  'navigation-01-dark-path': ['path'],
  'navigation-02-fork-breath': ['path'],
  'navigation-03-oak-landmark': ['path'],
  'navigation-04-star-field': ['star-dome'],
  'navigation-05-find-polaris': ['north-star', 'pointer-star'],
  'navigation-06-home-windows': ['north-star'],
  'navigation-07-window-star': ['north-star'],
  // The Ramp to the Treehouse — real simple machines.
  'machines-01-heavy-basket': ['basket'],
  'machines-02-together-fail': ['basket'],
  'machines-03-ramp-wagon': ['ramp', 'wagon'],
  'machines-04-look-up': ['pulley-wheel'],
  'machines-05-pulley-lift': ['pulley-wheel', 'rope', 'basket'],
  'machines-06-cozy-treehouse': ['basket'],
  'machines-07-bedtime-sleep': ['treehouse'],
  // The Sneaky Golden Crown — displacement told through crown, scale and bowls.
  'crown-01-workshop-dusk': ['crown'],
  'crown-02-balance-scale': ['crown', 'balance'],
  'crown-03-practice-bowl': ['bowl', 'waterline'],
  'crown-04-crown-test': ['crown', 'bowl'],
  'crown-05-displacement-compare': ['bowl', 'waterline'],
  'crown-06-honest-reveal': ['crown'],
  'crown-07-moonlit-quiet': ['moon', 'sleep-cue'],
};

describe('Each page shows motifs tied to its story/scene metadata (finding 2)', () => {
  it('has an expectation for every production scene id', () => {
    expect(Object.keys(EXPECTED_MOTIFS).sort()).toEqual(
      allPages.map((p) => p.page.scene.id).sort(),
    );
  });

  for (const [sceneId, motifs] of Object.entries(EXPECTED_MOTIFS)) {
    it(`${sceneId} renders its expected motifs: ${motifs.join(', ')}`, () => {
      const art = artBySceneId(sceneId);
      for (const motif of motifs) {
        expect(
          motifCount(art, motif),
          `${sceneId} is missing visible motif "${motif}"`,
        ).toBeGreaterThan(0);
      }
    });
  }
});

describe('Page-specific motif relationships (finding 2)', () => {
  it('flies the kite downwind of the flyer with a wind clue, on lift pages', () => {
    for (const sceneId of [
      'wind-01-hilltop-kite',
      'wind-04-first-lift',
      'wind-05-dancing-high',
    ]) {
      const art = artBySceneId(sceneId);
      const kite = art.querySelector('[data-motif="kite"]');
      const flyer = art.querySelector('[data-motif="flyer"]');
      const wind = art.querySelector('[data-motif="wind"]');
      expect(kite, `${sceneId} kite`).not.toBeNull();
      expect(flyer, `${sceneId} flyer`).not.toBeNull();
      expect(wind, `${sceneId} wind clue`).not.toBeNull();
      expect(wind!.getAttribute('data-wind-dir')).toBe('right');
      // Wind blows to the right: the kite streams downwind of and above the flyer.
      expect(num(kite, 'data-cx')).toBeGreaterThan(num(flyer, 'data-cx'));
      expect(num(kite, 'data-cy')).toBeLessThan(num(flyer, 'data-cy'));
    }
  });

  it('draws echo call-and-return arcs only once a call is made', () => {
    expect(motifCount(artBySceneId('echo-01-canyon-edge'), 'echo-arc')).toBe(0);
    for (const sceneId of [
      'echo-02-first-hello',
      'echo-04-brave-call',
      'echo-05-echo-game',
    ]) {
      expect(
        motifCount(artBySceneId(sceneId), 'echo-arc'),
        `${sceneId} should show a call and a returning echo`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it('grows the bean seed -> root -> sprout -> leafed stem in order', () => {
    expect(artBySceneId('bean-01-seed-in-palm').querySelector('[data-motif="bean"]')).not.toBeNull();
    expect(artBySceneId('bean-02-planting-pot').querySelector('[data-motif="bean"]')).not.toBeNull();
    expect(artBySceneId('bean-04-worried-wait').querySelector('[data-motif="root"]')).not.toBeNull();
    expect(artBySceneId('bean-05-first-sprout').querySelector('[data-motif="sprout"]')).not.toBeNull();
    expect(artBySceneId('bean-06-climbing-stem').querySelector('[data-motif="stem"]')).not.toBeNull();
    // Nothing has sprouted while the seed is still a seed or waiting underground.
    expect(artBySceneId('bean-01-seed-in-palm').querySelector('[data-motif="sprout"]')).toBeNull();
    expect(artBySceneId('bean-04-worried-wait').querySelector('[data-motif="sprout"]')).toBeNull();
  });

  it('changes the cast-shadow geometry across the day (long at ends, small at noon)', () => {
    const elong = (sceneId: string): number =>
      num(artBySceneId(sceneId).querySelector('[data-motif="shadow"]'), 'data-shadow-elongation');
    const morning = elong('shadow-01-morning-meet');
    const noon = elong('shadow-04-tiny-noon');
    const evening = elong('shadow-05-giant-evening');
    expect(morning).toBeGreaterThan(noon);
    expect(evening).toBeGreaterThan(noon);
    expect(noon).toBeLessThan(4);
    expect(morning).toBeGreaterThan(8);
    expect(evening).toBeGreaterThan(8);
  });

  it('points two pointer stars up toward a steady North Star on the find-polaris page', () => {
    const art = artBySceneId('navigation-05-find-polaris');
    const north = art.querySelector('[data-motif="north-star"]');
    expect(north).not.toBeNull();
    const pointers = Array.from(art.querySelectorAll('[data-motif="pointer-star"]'));
    expect(pointers).toHaveLength(2);
    const line = art.querySelector('[data-motif="pointer-line"]');
    expect(line).not.toBeNull();
    expect((line!.getAttribute('stroke-dasharray') ?? '').trim().length).toBeGreaterThan(0);
    // Pointer stars and Polaris ascend together: x increases, y decreases.
    const pts = [
      ...pointers.map((p) => ({ x: num(p, 'data-cx'), y: num(p, 'data-cy') })),
      { x: num(north, 'data-cx'), y: num(north, 'data-cy') },
    ].sort((a, b) => a.x - b.x);
    for (let i = 1; i < pts.length; i += 1) {
      expect(pts[i].x).toBeGreaterThan(pts[i - 1].x);
      expect(pts[i].y).toBeLessThan(pts[i - 1].y);
    }
  });

  it('shows a plank ramp with a real-wheeled wagon on the ramp page', () => {
    const art = artBySceneId('machines-03-ramp-wagon');
    expect(art.querySelector('[data-motif="ramp"]')).not.toBeNull();
    expect(art.querySelector('[data-motif="wagon"]')).not.toBeNull();
    expect(motifCount(art, 'wheel')).toBeGreaterThanOrEqual(2);
  });

  it('runs a rope over a real grooved pulley wheel that lifts the basket', () => {
    const art = artBySceneId('machines-05-pulley-lift');
    const pulley = art.querySelector('[data-motif="pulley-wheel"]');
    expect(pulley).not.toBeNull();
    expect(pulley!.getAttribute('data-grooved')).toBe('true');
    expect(motifCount(art, 'rope')).toBeGreaterThanOrEqual(1);
    expect(art.querySelector('[data-motif="basket"]')).not.toBeNull();
  });

  it('ties exactly fourteen ribbon knots to the fourteen-hands measurement (7 -> 11 -> 14)', () => {
    const knots = (sceneId: string): number => motifCount(artBySceneId(sceneId), 'knot');
    expect(knots('sunflower-03-knot-ribbon')).toBe(7);
    expect(knots('sunflower-05-teamwork-count')).toBe(11);
    expect(knots('sunflower-06-fourteen-hands')).toBe(14);
  });

  it('alternates red/blue buttons and mixes big/small on the pattern pages', () => {
    const buttons = (sceneId: string) =>
      Array.from(artBySceneId(sceneId).querySelectorAll('[data-motif="button"]'))
        .map((b) => ({
          x: num(b, 'data-x'),
          fill: b.getAttribute('data-fill'),
          r: num(b, 'data-r'),
        }))
        .sort((a, b) => a.x - b.x);

    const redBlue = buttons('pattern-02-red-blue-line');
    expect(redBlue.length).toBeGreaterThanOrEqual(6);
    const firstSix = redBlue.slice(0, 6);
    expect(new Set(firstSix.map((b) => b.fill)).size).toBe(2);
    for (let i = 1; i < firstSix.length; i += 1) {
      expect(firstSix[i].fill).not.toBe(firstSix[i - 1].fill);
    }

    const bigSmall = buttons('pattern-03-big-small-curve');
    expect(new Set(bigSmall.map((b) => b.r)).size).toBeGreaterThanOrEqual(2);
  });
});

/* -------------------------------------------------------------------------- */
/* The Sneaky Golden Crown — displacement motif relationships                  */
/* -------------------------------------------------------------------------- */

describe('The Sneaky Golden Crown shows displacement through its motifs', () => {
  it('balances the scale level (tilt 0) for the equal-weight crown and gold lump', () => {
    const art = artBySceneId('crown-02-balance-scale');
    const balance = art.querySelector('[data-motif="balance"]');
    expect(balance, 'the scale beam must be a balance motif').not.toBeNull();
    // Equal weights read as a perfectly level beam.
    expect(balance!.getAttribute('data-tilt')).toBe('0');
    expect(art.querySelector('[data-motif="crown"]')).not.toBeNull();
  });

  it('marks a risen waterline in the practice bowl', () => {
    const art = artBySceneId('crown-03-practice-bowl');
    expect(art.querySelector('[data-motif="bowl"]')).not.toBeNull();
    const line = art.querySelector('[data-motif="waterline"]');
    expect(line, 'the practice bowl must show a marked waterline').not.toBeNull();
    expect(Number(line!.getAttribute('data-level'))).toBeGreaterThan(0);
  });

  it('raises the crown\u2019s waterline above the equal-weight gold\u2019s on the compare page', () => {
    const art = artBySceneId('crown-05-displacement-compare');
    expect(motifCount(art, 'bowl')).toBeGreaterThanOrEqual(2);
    const gold = art.querySelector('[data-motif="waterline"][data-side="gold"]');
    const crown = art.querySelector('[data-motif="waterline"][data-side="crown"]');
    expect(gold, 'a gold-side waterline').not.toBeNull();
    expect(crown, 'a crown-side waterline').not.toBeNull();
    // Smaller y is higher on screen: the crown displaces more, so its water is higher.
    expect(num(crown, 'data-level')).toBeLessThan(num(gold, 'data-level'));
  });

  it('settles on a quiet moonlit ending with a non-letter sleep cue and no crown', () => {
    const art = artBySceneId('crown-07-moonlit-quiet');
    expect(art.querySelector('[data-motif="moon"]')).not.toBeNull();
    const cue = art.querySelector('[data-motif="sleep-cue"]');
    expect(cue, 'the calm ending must show a soft sleep cue').not.toBeNull();
    expect(cue!.querySelectorAll('circle, ellipse').length).toBeGreaterThan(0);
    expect(cue!.querySelector('path')).toBeNull();
    expect(cue!.querySelector('text')).toBeNull();
    // The crown puzzle is behind us; the landing page carries no crown.
    expect(art.querySelector('[data-motif="crown"]')).toBeNull();
  });
});

/* -------------------------------------------------------------------------- */
/* Finding 3 — non-letter sleep cues                                           */
/* -------------------------------------------------------------------------- */

describe('Sleep cues use non-letter visuals, not readable Z glyphs (finding 3)', () => {
  // Matches a path-drawn capital "Z": a horizontal, a down-left diagonal, then a
  // horizontal (e.g. "h18 l-18,20 h18").
  const Z_GLYPH = /h ?-?\d[\d.]* l ?-\d[\d.]*,\d[\d.]* h/i;

  it('never draws a readable path-drawn Z sleep glyph on any page', () => {
    for (const { story, page } of allPages) {
      const svg = renderSvg(story, page);
      for (const path of Array.from(svg.querySelectorAll('path'))) {
        const d = path.getAttribute('d') ?? '';
        expect(
          Z_GLYPH.test(d),
          `${page.scene.id} draws a letter-Z sleep glyph: ${d}`,
        ).toBe(false);
      }
      cleanup();
    }
  });

  it('shows a non-letter sleep cue (soft motes) on the sunflower bedtime page', () => {
    const cue = artBySceneId('sunflower-07-moonlit-sleep').querySelector(
      '[data-motif="sleep-cue"]',
    );
    expect(cue).not.toBeNull();
    expect(cue!.querySelectorAll('circle, ellipse').length).toBeGreaterThan(0);
    // The cue must not be built from letter strokes.
    expect(cue!.querySelector('path')).toBeNull();
    expect(cue!.querySelector('text')).toBeNull();
  });
});
