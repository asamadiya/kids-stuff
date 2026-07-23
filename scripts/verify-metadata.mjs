/**
 * Pure metadata verifier for dist/index.html.
 * Exported so vitest deployment tests can exercise it directly.
 */

export const EXPECTED = {
  canonical: 'https://asamadiya.github.io/kids-stuff/',
  description:
    'Read true stories, explore time and the world, play learning games, and make your own stories with Rikki.',
  themeColor: '#fffaf1',
  robots: 'noindex, nofollow, noarchive, nosnippet',
  googlebot: 'noindex, nofollow, noarchive, nosnippet',
  bingbot: 'noindex, nofollow, noarchive, nosnippet',
  ogType: 'website',
  ogTitle: "Rikki's Learn & Play Center",
  ogDescription:
    'Read true stories, explore time and the world, play learning games, and make your own stories with Rikki.',
  ogUrl: 'https://asamadiya.github.io/kids-stuff/',
  ogImage: 'https://asamadiya.github.io/kids-stuff/social-card.svg',
  twitterCard: 'summary_large_image',
  twitterTitle: "Rikki's Learn & Play Center",
  twitterDescription:
    'Stories, learning games, world exploration, and creative play with Rikki.',
  twitterImage: 'https://asamadiya.github.io/kids-stuff/social-card.svg',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Escape a string so it can be used as a regex literal. */
function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract the `content` attribute value from a `<meta>` tag identified by a
 * selector attribute (e.g. `name="theme-color"` or `property="og:title"`).
 * Handles both attribute orderings within a single tag.
 * Returns null when no matching tag is found.
 */
function metaContent(html, selectorAttr, selectorVal) {
  const sel = `${escRe(selectorAttr)}="${escRe(selectorVal)}"`;
  // Two patterns to handle the two possible attribute orderings.
  const patterns = [
    new RegExp(`<meta[^>]+${sel}[^>]+content="([^"]*)"`, 'i'),
    new RegExp(`<meta[^>]+content="([^"]*)"[^>]+${sel}`, 'i'),
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m) return m[1];
  }
  return null;
}

/**
 * Extract the `href` attribute value from a `<link>` tag identified by
 * `rel="<relVal>"`. Handles both attribute orderings. Returns null if missing.
 */
function linkHref(html, relVal) {
  const sel = `rel="${escRe(relVal)}"`;
  const patterns = [
    new RegExp(`<link[^>]+${sel}[^>]+href="([^"]*)"`, 'i'),
    new RegExp(`<link[^>]+href="([^"]*)"[^>]+${sel}`, 'i'),
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m) return m[1];
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public verifier
// ---------------------------------------------------------------------------

/**
 * Verify HTML metadata tags against the expected canonical values.
 * Returns an array of failure messages; an empty array means all checks passed.
 *
 * Each check extracts the actual tag attribute value and compares it exactly
 * against the expected value — generic substring presence is not sufficient.
 */
export function verifyMetadata(html) {
  const failures = [];

  function check(label, actual, expected) {
    if (actual !== expected) {
      failures.push(`${label}: expected "${expected}", got "${actual}"`);
    }
  }

  check('canonical href', linkHref(html, 'canonical'), EXPECTED.canonical);
  check('description content', metaContent(html, 'name', 'description'), EXPECTED.description);
  check('theme-color content', metaContent(html, 'name', 'theme-color'), EXPECTED.themeColor);
  check('robots content', metaContent(html, 'name', 'robots'), EXPECTED.robots);
  check('googlebot content', metaContent(html, 'name', 'googlebot'), EXPECTED.googlebot);
  check('bingbot content', metaContent(html, 'name', 'bingbot'), EXPECTED.bingbot);
  check('og:type content', metaContent(html, 'property', 'og:type'), EXPECTED.ogType);
  check('og:title content', metaContent(html, 'property', 'og:title'), EXPECTED.ogTitle);
  check('og:description content', metaContent(html, 'property', 'og:description'), EXPECTED.ogDescription);
  check('og:url content', metaContent(html, 'property', 'og:url'), EXPECTED.ogUrl);
  check('og:image content', metaContent(html, 'property', 'og:image'), EXPECTED.ogImage);
  check('twitter:card content', metaContent(html, 'name', 'twitter:card'), EXPECTED.twitterCard);
  check('twitter:title content', metaContent(html, 'name', 'twitter:title'), EXPECTED.twitterTitle);
  check('twitter:description content', metaContent(html, 'name', 'twitter:description'), EXPECTED.twitterDescription);
  check('twitter:image content', metaContent(html, 'name', 'twitter:image'), EXPECTED.twitterImage);

  return failures;
}
