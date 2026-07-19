import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Host-agnostic browser bootstrap.
 *
 * Some hosts (e.g. Azure Linux) ship without the GTK/ATK system libraries the
 * Playwright-managed Chromium needs, and without any installed fonts (so text
 * would render with zero-metric glyphs). When a locally provisioned, gitignored
 * bootstrap exists next to this config (.superpowers/browser-libs), we scope its
 * lib directory onto LD_LIBRARY_PATH and point FONTCONFIG_FILE at its fonts. All
 * paths are computed relative to this file — never a committed absolute host
 * path — and the whole block is a no-op on CI (Ubuntu, `playwright install
 * --with-deps`), where the directory is absent and system libs/fonts are present.
 */
const configDir = dirname(fileURLToPath(import.meta.url));
const browserLibDir = resolve(configDir, '.superpowers/browser-libs/lib');
if (existsSync(browserLibDir)) {
  process.env.LD_LIBRARY_PATH = [browserLibDir, process.env.LD_LIBRARY_PATH]
    .filter(Boolean)
    .join(':');
}
const fontConfig = resolve(configDir, '.superpowers/browser-libs/fonts.conf');
if (!process.env.FONTCONFIG_FILE && existsSync(fontConfig)) {
  process.env.FONTCONFIG_FILE = fontConfig;
}

/**
 * Playwright end-to-end configuration.
 *
 * Real, in-browser Chromium tests run against the built app served by
 * `vite preview` under the production base path (/kids-stuff/). Three projects
 * pin the exact responsive breakpoints the design targets — a 390x844 phone, a
 * 768x1024 tablet, and a 1440x1000 desktop — so layout, overflow and clipping
 * are verified at each. Motion is allowed by default (`reducedMotion:
 * 'no-preference'`) so the opt-in motion path can be exercised; the
 * reduced-motion lockout is verified in a `reducedMotion: 'reduce'` describe.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173/kids-stuff/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
        contextOptions: { reducedMotion: 'no-preference' },
      },
    },
    {
      name: 'tablet',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        hasTouch: true,
        contextOptions: { reducedMotion: 'no-preference' },
      },
    },
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 },
        contextOptions: { reducedMotion: 'no-preference' },
      },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173/kids-stuff/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
