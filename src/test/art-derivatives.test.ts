import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { COVER_WIDTH } from '../components/StoryImage';

/**
 * Every picture the site can reach must exist as a derivative.
 *
 * The failure this guards is not hypothetical: `scripts/verify-build.mjs` only
 * walked asset references out of `index.html`, so the entire art tree could
 * vanish and the build would still report green — and eight dinosaur stories
 * currently live only on the deploy branch because the deploy is an additive
 * copy that never deletes.
 */

const STORIES = 'src/stories';
const ART = 'public/art';

interface Need { slug: string; name: string }

const required = (): Need[] => {
  const out: Need[] = [];
  for (const f of readdirSync(STORIES).filter((x) => x.endsWith('.ts'))) {
    const text = readFileSync(join(STORIES, f), 'utf8');
    const slug = /slug:\s*'([a-z0-9-]+)'/.exec(text)?.[1];
    if (!slug) continue;
    const pages = text.match(/\btext:\s*'/g)?.length ?? 0;
    out.push({ slug, name: 'cover' });
    for (let i = 0; i < pages; i += 1) out.push({ slug, name: `page-${i + 1}` });
  }
  return out;
};

const derivative = (n: Need): string =>
  n.name === 'cover' ? `cover-${COVER_WIDTH}.webp` : `${n.name}.webp`;

describe('the art derivatives', () => {
  const needs = required();

  it('covers every image a story references', () => {
    const missing = needs
      .filter((n) => !existsSync(join(ART, n.slug, derivative(n))))
      .map((n) => `${n.slug}/${derivative(n)}`);
    expect(missing).toEqual([]);
  });

  it('checks a meaningful number of images', () => {
    expect(needs.length).toBeGreaterThan(2500);
  });

  it('keeps the component and the encoder agreed on the cover width', () => {
    const script = readFileSync('scripts/encode-art.py', 'utf8');
    const scriptWidth = Number(/^COVER_W\s*=\s*(\d+)/m.exec(script)?.[1]);
    // If these drift, every cover 404s and the tiles go blank — silently,
    // because an onError handler hides the broken image.
    expect(scriptWidth).toBe(COVER_WIDTH);
  });

  it('keeps a tile derivative far smaller than its master', () => {
    // The whole point. A cover that creeps back toward master size means the
    // encoder stopped running.
    const sample = required().filter((n) => n.name === 'cover').slice(0, 40);
    const big = sample
      .map((n) => ({ n, size: readFileSync(join(ART, n.slug, derivative(n))).length }))
      .filter((x) => x.size > 200 * 1024)
      .map((x) => `${x.n.slug}: ${Math.round(x.size / 1024)} KB`);
    expect(big).toEqual([]);
  });
});
