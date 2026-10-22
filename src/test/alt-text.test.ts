import { describe, expect, it } from 'vitest';
import { altText } from '../learn/alt';
import { IDEAS } from '../together';
import { ACTIVITIES } from '../make/activities';
import { LANG_BOOKS, MOMENTS, RHYMES } from '../languages';

/**
 * Play, Make & Do and language pictures use their generator prompt as alt text.
 * The size rule and "no words" instructions are for the generator only; a screen
 * reader must hear the scene and nothing about centimetres.
 */
const PICTURES: readonly [string, string][] = [
  ...IDEAS.map((x) => [`together/${x.id}`, x.picture] as [string, string]),
  ...ACTIVITIES.flatMap((a) => a.steps.flatMap((s, i) => (s.art ? [[`make/${a.id}/${i + 1}`, s.art] as [string, string]] : []))),
  ...MOMENTS.map((m) => [`langs/${m.id}`, m.picture] as [string, string]),
  ...RHYMES.map((r) => [`langs/${r.id}`, r.picture] as [string, string]),
  ...LANG_BOOKS.flatMap((b) => b.pages.map((p, i) => [`langs/${b.id}/${i + 1}`, p.picture] as [string, string])),
];

describe('alt text', () => {
  it('cuts the size rule and the lettering instruction', () => {
    expect(altText('Arjun waves. Match the approved character lineup: Arjun 110 cm standing; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower. No words or letters anywhere in the picture.')).toBe('Arjun waves.');
  });

  it.each(PICTURES)('%s reads as a scene, not a prompt', (_, picture) => {
    const alt = altText(picture);
    expect(alt).not.toMatch(/\b(110|87) cm\b|character lineup|No words or letters|ACTION FIRST|sitting on (his|her) heels lower/i);
    expect(alt.length).toBeGreaterThan(20);
  });
});
