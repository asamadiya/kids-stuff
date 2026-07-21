import { test, expect, type Page, type Locator, type TestInfo } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { STORIES } from '../src/stories/index';

/**
 * Real, in-browser Chromium end-to-end coverage for Moonlit Storybook.
 *
 * The suite runs against the built app served by `vite preview` under the
 * production base path (/kids-stuff/) at three viewport projects — a 390x844
 * phone, a 768x1024 tablet and a 1440x1000 desktop — plus an emulated
 * reduced-motion context for the motion-lockout guarantees. It exercises
 * library render, story reading, keyboard paging, the motion opt-in/lockout
 * contract, skip-link route preservation, persistence across reloads,
 * malformed-storage resilience, deep links, the public base path, and every one
 * of the 9 stories x 7 pages (63 spreads) for clean SVG/text rendering with no
 * horizontal overflow or clipped controls. It also captures durable screenshots
 * for visual QA.
 */

const PROGRESS_STORAGE_KEY = 'moonlit-storybook/progress/v1';

const SCREENSHOT_DIR = resolve(
  process.cwd(),
  '.superpowers/sdd/screenshots/task-7',
);

function shot(name: string): string {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  return resolve(SCREENSHOT_DIR, name);
}

/** Only capture a single-viewport screenshot once, on the desktop project. */
function onlyDesktop(testInfo: TestInfo): boolean {
  return testInfo.project.name === 'desktop';
}

/** A relative deep link into a story page (1-based page number in the hash). */
function readLink(slug: string, page1: number): string {
  return `./#/read/${slug}/${page1}`;
}

interface Diagnostics {
  readonly consoleErrors: string[];
  readonly pageErrors: string[];
  readonly badResponses: string[];
}

/**
 * Attach listeners that record console errors, uncaught page errors, and any
 * HTTP response with a >= 400 status, so a test can assert the app renders with
 * a clean console and no missing assets.
 */
function watchDiagnostics(page: Page): Diagnostics {
  const diagnostics: Diagnostics = {
    consoleErrors: [],
    pageErrors: [],
    badResponses: [],
  };
  page.on('console', (message) => {
    if (message.type() === 'error') diagnostics.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => {
    diagnostics.pageErrors.push(String(error));
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      diagnostics.badResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  return diagnostics;
}

function expectClean(diagnostics: Diagnostics): void {
  expect(diagnostics.pageErrors, 'no uncaught page errors').toEqual([]);
  expect(diagnostics.consoleErrors, 'no console errors').toEqual([]);
  expect(diagnostics.badResponses, 'no 4xx/5xx responses').toEqual([]);
}

/** Assert the document has no horizontal overflow (a 1px rounding tolerance). */
async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow, 'no horizontal overflow').toBeLessThanOrEqual(1);
}

/** Assert a control is fully within the viewport bounds (never clipped). */
async function expectNotClipped(page: Page, locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box, 'control has a layout box').not.toBeNull();
  expect(viewport, 'viewport size is known').not.toBeNull();
  if (!box || !viewport) return;
  expect(box.x, 'not clipped on the left').toBeGreaterThanOrEqual(-1);
  expect(box.y, 'not clipped at the top').toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width, 'not clipped on the right').toBeLessThanOrEqual(
    viewport.width + 1,
  );
  expect(box.y + box.height, 'not clipped at the bottom').toBeLessThanOrEqual(
    viewport.height + 1,
  );
}

/**
 * A "Try together" participation cue must be reachable. After scrolling it into
 * view the way the platform would (respecting scroll-margin), the cue sits fully
 * inside the viewport and never intersects the sticky `.reader-controls` bar. On
 * the stacked (narrow) layout the read-aloud panel + cue run past the viewport,
 * so a cue page has to reserve clearance for the sticky controls or the cue is
 * left occluded behind the opaque bar.
 */
async function expectCueClearsControls(page: Page): Promise<void> {
  const cue = page.locator('.reader__cue');
  const controls = page.locator('.reader-controls');
  await expect(cue).toBeVisible();
  // Bring the actionable cue to the reading position (respects scroll-margin).
  await cue.evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await page.waitForTimeout(50);

  const cueBox = await cue.boundingBox();
  const controlsBox = await controls.boundingBox();
  const viewport = page.viewportSize();
  expect(cueBox, 'cue has a layout box').not.toBeNull();
  expect(controlsBox, 'controls have a layout box').not.toBeNull();
  expect(viewport, 'viewport size is known').not.toBeNull();
  if (!cueBox || !controlsBox || !viewport) return;

  // The cue is fully within the viewport (not clipped, not hidden below the fold).
  expect(cueBox.y, 'cue not clipped at the top').toBeGreaterThanOrEqual(-1);
  expect(
    cueBox.y + cueBox.height,
    'cue fully within the viewport',
  ).toBeLessThanOrEqual(viewport.height + 1);

  // The cue does not intersect the sticky controls bar (negative == a clear gap).
  const overlap =
    Math.min(cueBox.y + cueBox.height, controlsBox.y + controlsBox.height) -
    Math.max(cueBox.y, controlsBox.y);
  expect(
    overlap,
    'cue can be scrolled fully clear of the sticky controls',
  ).toBeLessThanOrEqual(1);
}

/** Assert the current scene SVG is well-formed: viewBox + real child geometry. */
async function expectWellFormedScene(scene: Locator): Promise<void> {
  await expect(scene).toBeVisible();
  await expect(scene).toHaveAttribute('viewBox', /^0 0 \d+ \d+$/);
  const childCount = await scene.evaluate((node) => node.childElementCount);
  expect(childCount, 'scene SVG is not empty').toBeGreaterThan(3);
  const title = await scene.evaluate(
    (node) => node.querySelector('title')?.textContent ?? '',
  );
  expect(title.trim().length, 'scene has a non-empty accessible title').toBeGreaterThan(0);
}

async function animationName(locator: Locator): Promise<string> {
  return locator.evaluate((node) => getComputedStyle(node).animationName);
}

// --------------------------------------------------------------------------
// Library
// --------------------------------------------------------------------------

test.describe('Library', () => {
  test('renders the masthead and all nine covers, clean and unclipped', async ({
    page,
  }, testInfo) => {
    const diagnostics = watchDiagnostics(page);
    await page.goto('./');

    await expect(
      page.getByRole('heading', { name: 'Moonlit Storybook', level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole('main', { name: 'Story library' })).toBeVisible();

    const cards = page.locator('.story-card');
    await expect(cards).toHaveCount(STORIES.length);

    // Every cover loads the committed cinematic SVG through the Pages base path.
    const covers = page.locator('.story-card .story-card__cover-image');
    await expect(covers).toHaveCount(STORIES.length);
    for (let i = 0; i < STORIES.length; i += 1) {
      const cover = covers.nth(i);
      await expect(cover).toBeVisible();
      await expect(cover).toHaveAttribute(
        'src',
        `/kids-stuff/covers/${STORIES[i].slug}.svg`,
      );
      const loaded = await cover.evaluate(
        (node) =>
          node instanceof HTMLImageElement &&
          node.complete &&
          node.naturalWidth > 0 &&
          node.naturalHeight > 0,
      );
      expect(loaded, `${STORIES[i].slug} cinematic cover loaded`).toBe(true);
    }

    await expectNoHorizontalOverflow(page);
    expectClean(diagnostics);

    await page.screenshot({
      path: shot(`library-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });

  test('every "Read" call to action is reachable and labelled per story', async ({
    page,
  }) => {
    await page.goto('./');
    for (const story of STORIES) {
      await expect(
        page.getByRole('button', { name: `Read ${story.title}`, exact: true }),
      ).toBeVisible();
    }
  });

  test("the Tonight's pick cover fills its panel with no dark void beneath", async ({
    page,
  }) => {
    await page.goto('./');
    const cover = page.locator('.story-card--featured .story-card__cover');
    const image = cover.locator('.story-card__cover-image');
    await expect(image).toBeVisible();

    const coverBox = await cover.boundingBox();
    const imageBox = await image.boundingBox();
    expect(coverBox, 'featured cover has a layout box').not.toBeNull();
    expect(imageBox, 'featured cover image has a layout box').not.toBeNull();
    if (!coverBox || !imageBox) return;

    // The illustration must fill the cover panel — a shorter scene leaves an
    // awkward dark rectangle beneath it (worst on the tablet portrait column).
    expect(
      imageBox.height,
      'featured illustration fills the cover panel height',
    ).toBeGreaterThanOrEqual(coverBox.height - 2);
  });
});

// --------------------------------------------------------------------------
// Reading: selection, buttons, completion
// --------------------------------------------------------------------------

test.describe('Reading a story', () => {
  const story = STORIES[0]; // The Tallest Sunflower

  test('opens from its cover at page one with art and text', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: `Read ${story.title}`, exact: true }).click();

    const reader = page.getByRole('main', { name: `Reading: ${story.title}` });
    await expect(reader).toBeVisible();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 1 of ${story.pages.length}`,
    );
    await expectWellFormedScene(page.locator('.reader__figure .scene'));
    await expect(page.locator('.reader__text')).not.toBeEmpty();
    expect(page.url()).toContain(`#/read/${story.slug}/1`);
  });

  test('Next and Previous turn pages, with Previous disabled at the start', async ({
    page,
  }) => {
    await page.goto(readLink(story.slug, 1));
    const next = page.getByRole('button', { name: 'Next page', exact: true });
    const previous = page.getByRole('button', { name: 'Previous page', exact: true });

    await expect(previous).toBeDisabled();
    await expectNotClipped(page, next);
    await next.click();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 2 of ${story.pages.length}`,
    );
    await expect(previous).toBeEnabled();
    await previous.click();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 1 of ${story.pages.length}`,
    );
  });

  test('Finish reaches completion and Start over returns to page one', async ({
    page,
  }, testInfo) => {
    await page.goto(readLink(story.slug, story.pages.length)); // last story page
    const finish = page.getByRole('button', { name: 'Finish story', exact: true });
    await expect(finish).toBeVisible();
    await finish.click();

    await expect(page.getByRole('heading', { name: 'The End' })).toBeVisible();
    await expect(
      page.getByRole('region', { name: `You finished ${story.title}` }),
    ).toBeVisible();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      'The story is finished',
    );

    if (onlyDesktop(testInfo)) {
      await page.screenshot({ path: shot('completion-desktop.png'), fullPage: true });
    }

    await page.getByRole('button', { name: 'Start over', exact: true }).click();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 1 of ${story.pages.length}`,
    );
  });

  test('Back to library returns to the shelf', async ({ page }) => {
    await page.goto(readLink(story.slug, 2));
    await page.getByRole('button', { name: 'Back to library', exact: true }).click();
    await expect(page.getByRole('main', { name: 'Story library' })).toBeVisible();
    await expect(page).toHaveURL(/#\/?$/);
  });
});

// --------------------------------------------------------------------------
// Keyboard navigation & selection safety
// --------------------------------------------------------------------------

test.describe('Keyboard navigation', () => {
  const story = STORIES[2]; // The Echo in the Canyon

  test('Arrow keys turn pages from anywhere on the page', async ({ page }) => {
    await page.goto(readLink(story.slug, 1));
    await page.locator('body').click({ position: { x: 5, y: 5 } });

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 2 of ${story.pages.length}`,
    );
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 1 of ${story.pages.length}`,
    );
  });

  test('an active text selection suspends paging, and clearing it restores paging', async ({
    page,
  }) => {
    await page.goto(readLink(story.slug, 1));

    // Select the read-aloud prose, mimicking a reader dragging over the text.
    await page.evaluate(() => {
      const node = document.querySelector('.reader__text');
      if (!node) throw new Error('reader text not found');
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
    await page.keyboard.press('ArrowRight');
    // With a live selection, paging is suspended so the drag is never hijacked.
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 1 of ${story.pages.length}`,
    );

    // Clearing the selection must restore paging — the reader is never trapped.
    await page.evaluate(() => window.getSelection()?.removeAllRanges());
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 2 of ${story.pages.length}`,
    );
  });
});

// --------------------------------------------------------------------------
// Read-aloud cue reachability (regression: mobile/tablet sticky-control overlap)
// --------------------------------------------------------------------------

test.describe('Read-aloud cue clears the sticky controls', () => {
  test('a cue can be scrolled fully clear of the controls', async ({ page }) => {
    // Pip's Pattern Parade page 3 carries both long read-aloud text and a cue,
    // so on the stacked layout the spread runs past the viewport.
    await page.goto(readLink('pips-pattern-parade', 3));
    await expect(page.locator('.reader__figure .scene')).toBeVisible();
    await expect(page.locator('.reader__cue')).toBeVisible();

    await expectCueClearsControls(page);
  });
});

// --------------------------------------------------------------------------
// Motion opt-in (device allows motion)
// --------------------------------------------------------------------------

test.describe('Motion opt-in', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });
  const story = STORIES[6]; // Following the North Star — starfield on every page

  test('is off by default with no running animation', async ({ page }) => {
    await page.goto(readLink(story.slug, 1));
    const toggle = page.getByRole('button', { name: 'Make it move', exact: true });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.reader')).toHaveAttribute('data-motion', 'off');

    expect(await animationName(page.locator('.reader__spread'))).toBe('none');
    expect(await animationName(page.locator('.reader .scene-starfield').first())).toBe(
      'none',
    );
  });

  test('pressing "Make it move" sets aria-pressed and starts real animation', async ({
    page,
  }, testInfo) => {
    await page.goto(readLink(story.slug, 1));
    await page.getByRole('button', { name: 'Make it move', exact: true }).click();

    await expect(
      page.getByRole('button', { name: 'Stop the gentle motion', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.reader')).toHaveAttribute('data-motion', 'on');

    // The page-turn animation and the ambient starfield twinkle both run.
    expect(await animationName(page.locator('.reader__spread'))).not.toBe('none');
    const starfield = page.locator('.reader .scene-starfield').first();
    expect(await animationName(starfield)).not.toBe('none');

    if (onlyDesktop(testInfo)) {
      await page.screenshot({ path: shot('motion-enabled-desktop.png'), fullPage: true });
    }
  });
});

// --------------------------------------------------------------------------
// Reduced motion (device requests reduce) — hard lockout, never weakened
// --------------------------------------------------------------------------

test.describe('Reduced motion lockout', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  const story = STORIES[6];

  test('locks the control and keeps every scene still', async ({ page }, testInfo) => {
    await page.goto(readLink(story.slug, 1));

    // The toggle is replaced by a status message; motion can never be switched on.
    await expect(page.getByRole('status')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /make it move|stop the gentle motion/i }),
    ).toHaveCount(0);

    // Nothing animates: neither the page-turn nor any ambient scene motion.
    expect(await animationName(page.locator('.reader__spread'))).toBe('none');
    expect(await animationName(page.locator('.reader .scene-starfield').first())).toBe(
      'none',
    );

    if (onlyDesktop(testInfo)) {
      await page.screenshot({ path: shot('reduced-motion-desktop.png'), fullPage: true });
    }
  });
});

// --------------------------------------------------------------------------
// Skip link
// --------------------------------------------------------------------------

test.describe('Skip link', () => {
  test('moves focus to main content while preserving the reader route', async ({
    page,
  }) => {
    const story = STORIES[3];
    await page.goto(readLink(story.slug, 3));

    const skip = page.getByRole('link', { name: 'Skip to the story' });
    await skip.focus();
    await expect(skip).toBeFocused();
    await skip.press('Enter');

    // Focus lands on the reader's <main>, and the deep-link route is untouched
    // (activating the skip link must not rewrite the hash to #main-content).
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('main-content');
    expect(page.url()).toContain(`#/read/${story.slug}/3`);
  });

  test('focuses the library main content from the shelf', async ({ page }) => {
    await page.goto('./');
    const skip = page.getByRole('link', { name: 'Skip to the story' });
    await skip.focus();
    await skip.press('Enter');
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('main-content');
  });
});

// --------------------------------------------------------------------------
// Persistence & reload
// --------------------------------------------------------------------------

test.describe('Persistence across reload', () => {
  const story = STORIES[4]; // The Little Bean Seed

  test('resumes a bookmarked mid-story page after a reload', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: `Read ${story.title}`, exact: true }).click();

    // Advance to page 3 (index 2), which the app bookmarks.
    await page.getByRole('button', { name: 'Next page', exact: true }).click();
    await page.getByRole('button', { name: 'Next page', exact: true }).click();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 3 of ${story.pages.length}`,
    );

    // Return to the library, reload, and reopen — the bookmark resumes page 3.
    await page.getByRole('button', { name: 'Back to library', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: `Read ${story.title}`, exact: true }).click();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 3 of ${story.pages.length}`,
    );
  });

  test('marks a finished story complete and keeps it complete after reload', async ({
    page,
  }) => {
    await page.goto(readLink(story.slug, story.pages.length));
    await page.getByRole('button', { name: 'Finish story', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'The End' })).toBeVisible();

    await page.getByRole('button', { name: 'Back to library', exact: true }).click();
    const card = page.locator('.story-card', {
      has: page.getByRole('button', { name: new RegExp(`Read ${story.title}`) }),
    });
    await expect(card).toHaveAttribute('data-completed', 'true');
    await expect(card.getByText(/You.ve read this/)).toBeVisible();

    await page.reload();
    const cardAfter = page.locator('.story-card', {
      has: page.getByRole('button', { name: new RegExp(`Read ${story.title}`) }),
    });
    await expect(cardAfter).toHaveAttribute('data-completed', 'true');
  });
});

// --------------------------------------------------------------------------
// Malformed storage resilience
// --------------------------------------------------------------------------

test.describe('Malformed storage resilience', () => {
  test('still renders the library when saved progress is corrupt', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));

    await page.addInitScript((key) => {
      try {
        window.localStorage.setItem(key, '{ this is not valid json ]]');
      } catch {
        /* storage may be unavailable; the app tolerates that too */
      }
    }, PROGRESS_STORAGE_KEY);

    await page.goto('./');
    await expect(
      page.getByRole('heading', { name: 'Moonlit Storybook', level: 1 }),
    ).toBeVisible();
    // A corrupt store must degrade gracefully — no uncaught error, app usable.
    expect(pageErrors).toEqual([]);
    await expect(page.locator('.story-card')).toHaveCount(STORIES.length);
  });

  test('ignores a structurally wrong payload and still opens a story', async ({ page }) => {
    await page.addInitScript((key) => {
      try {
        window.localStorage.setItem(
          key,
          JSON.stringify({ bookmarks: [1, 2, 3], completed: 'nope' }),
        );
      } catch {
        /* tolerated */
      }
    }, PROGRESS_STORAGE_KEY);

    await page.goto('./');
    const story = STORIES[0];
    await page.getByRole('button', { name: `Read ${story.title}`, exact: true }).click();
    await expect(page.getByRole('main', { name: `Reading: ${story.title}` })).toBeVisible();
  });
});

// --------------------------------------------------------------------------
// Deep links & routing
// --------------------------------------------------------------------------

test.describe('Deep links and routing', () => {
  const story = STORIES[5]; // Chasing My Shadow

  test('opens a deep link at the exact page', async ({ page }) => {
    await page.goto(readLink(story.slug, 4));
    await expect(page.getByRole('main', { name: `Reading: ${story.title}` })).toBeVisible();
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 4 of ${story.pages.length}`,
    );
  });

  test('canonicalises an unknown slug to the library', async ({ page }) => {
    await page.goto('./#/read/not-a-real-story/2');
    await expect(page.getByRole('main', { name: 'Story library' })).toBeVisible();
  });

  test('canonicalises a malformed percent-encoded slug to the library', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(String(error)));
    await page.goto('./#/read/%E0%A4%A/2');
    await expect(page.getByRole('main', { name: 'Story library' })).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test('a zero page falls back to page one', async ({ page }) => {
    await page.goto(`./#/read/${story.slug}/0`);
    await expect(page.locator('.reader-controls__progress')).toHaveText(
      `Page 1 of ${story.pages.length}`,
    );
  });

  test('an out-of-range page clamps to the completion view', async ({ page }) => {
    await page.goto(`./#/read/${story.slug}/999`);
    await expect(page.getByRole('heading', { name: 'The End' })).toBeVisible();
  });
});

// --------------------------------------------------------------------------
// Public base path & assets
// --------------------------------------------------------------------------

test.describe('Public base path', () => {
  test('serves under /kids-stuff/ and loads hashed assets and favicon cleanly', async ({
    page,
  }) => {
    const okAssets: string[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/kids-stuff/assets/') && response.ok()) {
        okAssets.push(response.url());
      }
    });
    const diagnostics = watchDiagnostics(page);

    await page.goto('./');
    await expect(
      page.getByRole('heading', { name: 'Moonlit Storybook', level: 1 }),
    ).toBeVisible();

    expect(page.url()).toContain('/kids-stuff/');
    // Vite emits hashed JS/CSS under /kids-stuff/assets/ — at least one loaded OK.
    expect(okAssets.length, 'hashed assets served from the base path').toBeGreaterThan(0);

    const favicon = await page.request.get('favicon.svg');
    expect(favicon.status()).toBeLessThan(400);

    expectClean(diagnostics);
  });
});

// --------------------------------------------------------------------------
// Full matrix — all 9 stories x 7 pages (63 spreads)
// --------------------------------------------------------------------------

test.describe('Every story renders every spread cleanly', () => {
  for (const story of STORIES) {
    test(`${story.slug}: all ${story.pages.length} spreads render without overflow or clipping`, async ({
      page,
    }) => {
      const diagnostics = watchDiagnostics(page);
      await page.goto(readLink(story.slug, 1));
      await expect(page.getByRole('main', { name: `Reading: ${story.title}` })).toBeVisible();

      const scene = page.locator('.reader__figure .scene');
      const next = page.getByRole('button', { name: /Next page|Finish story/ });

      for (let index = 0; index < story.pages.length; index += 1) {
        await expect(page.locator('.reader-controls__progress')).toHaveText(
          `Page ${index + 1} of ${story.pages.length}`,
        );
        // A distinct, well-formed, non-empty SVG world for this page.
        await expectWellFormedScene(scene);
        await expect(scene).toHaveAttribute(
          'data-scene-id',
          story.pages[index].scene.id,
        );
        // Real read-aloud text is present.
        await expect(page.locator('.reader__text')).not.toBeEmpty();
        // Primary controls stay on-screen and unclipped at this viewport.
        await expectNotClipped(page, next);
        await expectNoHorizontalOverflow(page);

        // A participation cue, when present, must be reachable fully clear of the
        // sticky controls at this viewport (regression: it was occluded on the
        // stacked mobile/tablet layout). Reset scroll so the next page starts clean.
        if (story.pages[index].cue) {
          await expectCueClearsControls(page);
          await page.evaluate(() => window.scrollTo(0, 0));
        }

        if (index < story.pages.length - 1) {
          await page.keyboard.press('ArrowRight');
        }
      }

      expectClean(diagnostics);
    });
  }
});

// --------------------------------------------------------------------------
// Visual capture — distinct spreads for manual QA (once, desktop + one mobile)
// --------------------------------------------------------------------------

test.describe('Visual spread captures', () => {
  test('captures three distinct story spreads on desktop', async ({ page }, testInfo) => {
    test.skip(!onlyDesktop(testInfo), 'captured once on the desktop project');

    const picks: Array<{ slug: string; page1: number; name: string }> = [
      { slug: 'the-tallest-sunflower', page1: 1, name: 'spread-sunflower-p1-desktop.png' },
      { slug: 'the-echo-in-the-canyon', page1: 4, name: 'spread-echo-p4-desktop.png' },
      { slug: 'following-the-north-star', page1: 6, name: 'spread-northstar-p6-desktop.png' },
    ];
    for (const pick of picks) {
      await page.goto(readLink(pick.slug, pick.page1));
      await expect(page.locator('.reader__figure .scene')).toBeVisible();
      await page.screenshot({ path: shot(pick.name), fullPage: true });
    }
  });

  test('captures a story spread on mobile', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'captured once on the mobile project');
    await page.goto(readLink('pips-pattern-parade', 3));
    await expect(page.locator('.reader__figure .scene')).toBeVisible();
    // Bring the "Try together" cue to the reading position, then capture what the
    // reader sees: the cue must sit clear of the sticky controls. A fullPage
    // capture is avoided here — it freezes the position:sticky bar at its
    // scroll-0 stuck position over the below-the-fold cue, misrepresenting it.
    await page
      .locator('.reader__cue')
      .evaluate((el) => el.scrollIntoView({ block: 'end' }));
    await page.waitForTimeout(50);
    await page.screenshot({ path: shot('spread-pattern-p3-mobile.png') });
  });
});
