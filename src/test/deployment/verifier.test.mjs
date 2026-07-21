/**
 * Deployment tests for the pure metadata verifier.
 *
 * RED phase: tests that demonstrate verifyMetadata() must check EXACT tag attribute
 * values — not just whether a tag-name substring is present anywhere in the HTML.
 *
 * Tests that check correct behaviour pass in both RED and GREEN.
 * Tests that exercise exact-value validation fail in RED (weak substring checks)
 * and pass in GREEN (attribute-level regex parsing).
 */

import { afterEach, describe, test, expect } from 'vitest';
import {
  copyFileSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { verifyMetadata, EXPECTED } from '../../../scripts/verify-metadata.mjs';

const ROBOTS_DIRECTIVES = 'noindex, nofollow, noarchive, nosnippet';
const ROBOTS_TXT = 'User-agent: *\nDisallow: /\n';
const verifierRoot = resolve('.test-work/verify-build');

/** Build a complete valid HTML fixture, merging field overrides. */
function buildHtml(overrides = {}) {
  const v = { ...EXPECTED, ...overrides };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="description" content="${v.description}" />
  <meta name="theme-color" content="${v.themeColor}" />
  <meta name="robots" content="${v.robots ?? ROBOTS_DIRECTIVES}" />
  <meta name="googlebot" content="${v.googlebot ?? ROBOTS_DIRECTIVES}" />
  <meta name="bingbot" content="${v.bingbot ?? ROBOTS_DIRECTIVES}" />
  <link rel="icon" href="/kids-stuff/favicon.svg" />
  <link rel="canonical" href="${v.canonical}" />
  <meta property="og:type" content="${v.ogType}" />
  <meta property="og:title" content="${v.ogTitle}" />
  <meta property="og:description" content="${v.ogDescription}" />
  <meta property="og:url" content="${v.ogUrl}" />
  <meta property="og:image" content="${v.ogImage}" />
  <meta name="twitter:card" content="${v.twitterCard}" />
  <meta name="twitter:title" content="${v.twitterTitle}" />
  <meta name="twitter:description" content="${v.twitterDescription}" />
  <meta name="twitter:image" content="${v.twitterImage}" />
</head>
<body><div id="root"></div></body>
</html>`;
}

function runBuildVerifier(robotsTxt) {
  const scriptsDir = resolve(verifierRoot, 'scripts');
  const distDir = resolve(verifierRoot, 'dist');
  mkdirSync(scriptsDir, { recursive: true });
  mkdirSync(distDir, { recursive: true });
  copyFileSync(resolve('scripts/verify-build.mjs'), resolve(scriptsDir, 'verify-build.mjs'));
  copyFileSync(resolve('scripts/verify-metadata.mjs'), resolve(scriptsDir, 'verify-metadata.mjs'));
  writeFileSync(resolve(distDir, 'index.html'), buildHtml());
  writeFileSync(resolve(distDir, 'favicon.svg'), '<svg></svg>');
  writeFileSync(resolve(distDir, 'social-card.svg'), '<svg></svg>');
  if (robotsTxt !== undefined) {
    writeFileSync(resolve(distDir, 'robots.txt'), robotsTxt);
  }
  return spawnSync(process.execPath, [resolve(scriptsDir, 'verify-build.mjs')], {
    encoding: 'utf8',
  });
}

afterEach(() => {
  rmSync(verifierRoot, { recursive: true, force: true });
});

describe('verifyMetadata — baseline (passes in RED and GREEN)', () => {
  test('fully valid HTML produces zero failures', () => {
    expect(verifyMetadata(buildHtml())).toHaveLength(0);
  });
});

describe('verifyMetadata — exact crawler directives', () => {
  test('exports the single exact directive value used for every crawler', () => {
    expect(EXPECTED.robots).toBe(ROBOTS_DIRECTIVES);
    expect(EXPECTED.googlebot).toBe(ROBOTS_DIRECTIVES);
    expect(EXPECTED.bingbot).toBe(ROBOTS_DIRECTIVES);
  });

  test.each([
    ['robots', 'robots'],
    ['googlebot', 'googlebot'],
    ['bingbot', 'bingbot'],
  ])('rejects a wrong %s meta content value', (field, label) => {
    const failures = verifyMetadata(buildHtml({ [field]: 'noindex' }));
    expect(failures.some(f => f.includes(label))).toBe(true);
  });

  test.each(['robots', 'googlebot', 'bingbot'])(
    'rejects a missing %s meta tag',
    field => {
      const html = buildHtml().replace(
        new RegExp(`\\s*<meta name="${field}"[^>]*\\/>`),
        ''
      );
      const failures = verifyMetadata(html);
      expect(failures.some(f => f.includes(field))).toBe(true);
    }
  );
});

describe('verify-build — dist/robots.txt', () => {
  test('rejects a missing dist/robots.txt', () => {
    const result = runBuildVerifier();
    expect(`${result.stdout}\n${result.stderr}`).toContain(
      'dist/robots.txt does not exist'
    );
    expect(result.status).toBe(1);
  });

  test('rejects robots.txt with non-exact directives', () => {
    const result = runBuildVerifier('User-agent: *\nDisallow:\n');
    expect(`${result.stdout}\n${result.stderr}`).toContain(
      'dist/robots.txt content'
    );
    expect(result.status).toBe(1);
  });

  test('accepts the exact public crawler block', () => {
    const result = runBuildVerifier(ROBOTS_TXT);
    expect(result.status).toBe(0);
  });
});

describe('verifyMetadata — exact canonical check (fails in RED, passes in GREEN)', () => {
  test('canonical link pointing to wrong URL is rejected', () => {
    // EXPECTED.canonical still appears in og:url and og:image, so the weak
    // html.includes(EXPECTED.canonical) check passes — but should not, because
    // the actual <link rel="canonical"> has the wrong href.
    const html = buildHtml({ canonical: 'https://wrong.example.com/kids-stuff/' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /canonical/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact description check (fails in RED, passes in GREEN)', () => {
  test('missing <meta name="description"> is rejected', () => {
    // The weak verifier does not check description at all.
    const html = buildHtml().replace(
      /\s*<meta name="description"[^>]*\/>/,
      ''
    );
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /description/i.test(f))).toBe(true);
  });

  test('wrong description value is rejected', () => {
    const html = buildHtml({ description: 'Wrong description.' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /description/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact theme-color check (fails in RED, passes in GREEN)', () => {
  test('wrong theme-color value is rejected', () => {
    // html.includes('theme-color') is true even with the wrong value.
    const html = buildHtml({ themeColor: '#000000' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /theme.color/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact og:type check (fails in RED, passes in GREEN)', () => {
  test('wrong og:type value is rejected', () => {
    const html = buildHtml({ ogType: 'article' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /og:type/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact og:title check (fails in RED, passes in GREEN)', () => {
  test('wrong og:title value is rejected', () => {
    // html.includes('og:title') matches even with wrong content.
    const html = buildHtml({ ogTitle: 'Wrong Title' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /og:title/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact og:description check (fails in RED, passes in GREEN)', () => {
  test('wrong og:description value is rejected', () => {
    const html = buildHtml({ ogDescription: 'Wrong description.' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /og:description/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact og:url check (fails in RED, passes in GREEN)', () => {
  test('wrong og:url value is rejected', () => {
    const html = buildHtml({ ogUrl: 'https://wrong.example.com/' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /og:url/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact og:image check (fails in RED, passes in GREEN)', () => {
  test('wrong og:image URL is rejected', () => {
    const html = buildHtml({ ogImage: 'https://wrong.example.com/social-card.svg' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /og:image/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact twitter:card check (fails in RED, passes in GREEN)', () => {
  test('wrong twitter:card value is rejected', () => {
    const html = buildHtml({ twitterCard: 'summary' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /twitter:card/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact twitter:title check (fails in RED, passes in GREEN)', () => {
  test('wrong twitter:title value is rejected', () => {
    const html = buildHtml({ twitterTitle: 'Wrong Title' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /twitter:title/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact twitter:description check (fails in RED, passes in GREEN)', () => {
  test('wrong twitter:description value is rejected', () => {
    const html = buildHtml({ twitterDescription: 'Wrong.' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /twitter:description/i.test(f))).toBe(true);
  });
});

describe('verifyMetadata — exact twitter:image check (fails in RED, passes in GREEN)', () => {
  test('wrong twitter:image URL is rejected', () => {
    const html = buildHtml({ twitterImage: 'https://wrong.example.com/social-card.svg' });
    const failures = verifyMetadata(html);
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some(f => /twitter:image/i.test(f))).toBe(true);
  });
});
