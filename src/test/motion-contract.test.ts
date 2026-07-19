import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Static CSS contract for the motion-off default.
 *
 * Every animating declaration (a `transition`, a movement `transform`, or an
 * `animation`) in the library and reader stylesheets MUST be gated behind BOTH
 * `[data-motion="on"]` on its selector AND an enclosing
 * `@media (prefers-reduced-motion: no-preference)`. With motion off (the default
 * everywhere in this task) nothing may animate; instant colour/border/shadow
 * states are allowed because they are not transitions or transforms.
 */

const MOTION_FILES = ['../styles/library.css', '../styles/reader.css'] as const;

function readCss(rel: string): string {
  return readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  );
}

interface Rule {
  readonly selector: string;
  readonly body: string;
  readonly media: string;
}

/** Split a stylesheet fragment into its top-level `{ prelude { ... } }` blocks. */
function topBlocks(css: string): Array<{ prelude: string; body: string }> {
  const blocks: Array<{ prelude: string; body: string }> = [];
  let start = 0;
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] !== '{') continue;
    const prelude = css.slice(start, i).trim();
    let depth = 1;
    let j = i + 1;
    for (; j < css.length && depth > 0; j += 1) {
      if (css[j] === '{') depth += 1;
      else if (css[j] === '}') depth -= 1;
      if (depth === 0) break;
    }
    blocks.push({ prelude, body: css.slice(i + 1, j) });
    i = j;
    start = j + 1;
  }
  return blocks;
}

/** Flatten to leaf declaration rules, carrying any enclosing @media context. */
function collectRules(css: string, media = ''): Rule[] {
  const rules: Rule[] = [];
  for (const { prelude, body } of topBlocks(css)) {
    if (prelude.startsWith('@keyframes')) continue; // the animation body itself
    if (prelude.startsWith('@media') || prelude.startsWith('@supports')) {
      const nextMedia = prelude.startsWith('@media')
        ? `${media} ${prelude}`.trim()
        : media;
      rules.push(...collectRules(body, nextMedia));
    } else {
      rules.push({ selector: prelude, body, media });
    }
  }
  return rules;
}

const TRANSITION = /\btransition\b\s*:|\btransition-(property|duration|timing-function|delay)\s*:/i;
const ANIMATION = /\banimation\b\s*:|\banimation-(name|duration|delay)\s*:/i;
const MOVE_TRANSFORM =
  /\btransform\s*:\s*(?!\s*none\b)[^;}]*\b(translate3d|translate|scale|rotate|perspective|matrix|skew)/i;

function animates(body: string): boolean {
  return TRANSITION.test(body) || ANIMATION.test(body) || MOVE_TRANSFORM.test(body);
}

function isGated(rule: Rule): boolean {
  const inNoPreference = /prefers-reduced-motion\s*:\s*no-preference/.test(rule.media);
  const everyPartGated = rule.selector
    .split(',')
    .every((part) => /\[data-motion=['"]on['"]\]/.test(part));
  return inNoPreference && everyPartGated;
}

describe('motion-off CSS contract', () => {
  it('gates every transition/transform/animation behind data-motion=on + no-preference', () => {
    for (const file of MOTION_FILES) {
      for (const rule of collectRules(readCss(file))) {
        if (!animates(rule.body)) continue;
        expect(
          isGated(rule),
          `Ungated motion in ${file}: selector "${rule.selector}" @media "${rule.media || '(none)'}"`,
        ).toBe(true);
      }
    }
  });

  it('keeps the card hover-lift available only when motion is on', () => {
    const rules = collectRules(readCss('../styles/library.css'));
    const lift = rules.find(
      (rule) =>
        /\.story-card\[data-motion=['"]on['"]\]/.test(rule.selector) &&
        MOVE_TRANSFORM.test(rule.body),
    );
    expect(lift, 'expected a gated .story-card hover-lift transform').toBeDefined();
    expect(isGated(lift!)).toBe(true);
  });

  it('keeps the reader-control hover-lift available only when motion is on', () => {
    const rules = collectRules(readCss('../styles/reader.css'));
    const lift = rules.find(
      (rule) =>
        /\.reader-controls\[data-motion=['"]on['"]\]/.test(rule.selector) &&
        MOVE_TRANSFORM.test(rule.body),
    );
    expect(lift, 'expected a gated .reader-controls hover-lift transform').toBeDefined();
    expect(isGated(lift!)).toBe(true);
  });
});
