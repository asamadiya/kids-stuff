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

import { describe, test, expect } from 'vitest';
import { verifyMetadata, EXPECTED } from '../../../scripts/verify-metadata.mjs';

/** Build a complete valid HTML fixture, merging field overrides. */
function buildHtml(overrides = {}) {
  const v = { ...EXPECTED, ...overrides };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="description" content="${v.description}" />
  <meta name="theme-color" content="${v.themeColor}" />
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

describe('verifyMetadata — baseline (passes in RED and GREEN)', () => {
  test('fully valid HTML produces zero failures', () => {
    expect(verifyMetadata(buildHtml())).toHaveLength(0);
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
