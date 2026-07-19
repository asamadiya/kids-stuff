import { test, expect } from '@playwright/test';

/**
 * HTTP-level smoke tests. These use the `request` fixture (no browser launch),
 * so they stay fast and green even before a browser is provisioned. They assert
 * the built app is served under the production base path with its shell intact.
 * Full in-browser behaviour and visual coverage lives in `book.spec.ts`.
 */
test('serves the app shell with a 200 under the /kids-stuff/ base', async ({ request }) => {
  const response = await request.get('./');
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain('Moonlit Storybook');
  // The built script and favicon must reference the production base path.
  expect(body).toContain('/kids-stuff/');
});

test('serves the favicon asset without a 4xx', async ({ request }) => {
  const response = await request.get('favicon.svg');
  expect(response.status()).toBeLessThan(400);
});
