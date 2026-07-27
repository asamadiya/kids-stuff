# Rikki's Learn & Play Center

A warm educational hub where children can read illustrated true stories, explore
history and the world, play gentle learning games, and make their own stories
with Rikki.

**Live:** https://asamadiya.github.io/kids-stuff/

## Local development

```bash
npm install
npm run dev        # dev server at http://localhost:5173/kids-stuff/
```

## Commands

| Command | Purpose |
|---|---|
| `npm run build` | Production build (outputs `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run verify:build` | Assert dist/ asset paths resolve under `/kids-stuff/` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E smoke tests (Playwright) |
| `npm run lint` | ESLint |

## Architecture

Single-page app (React + Vite). Routing is hash-based (`#/read/<slug>/<page>`) so deep links work on GitHub Pages without a 404 fallback. Reading progress and bookmarks are stored in `localStorage` with versioned keys. Motion (firefly drift, water ripple, kite tug) respects `prefers-reduced-motion` and can be toggled at runtime.

## Deployment

GitHub Pages serves the production build from the `gh-pages` branch. Before
publication, run lint, unit tests, `npm run build`, `npm run verify:build`, and
the Playwright suite against the generated site.
