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
  it('cuts the language-book lettering instruction', () => {
    expect(altText('Amma and Arjun at the table. No written words, and the open book shows only a picture.')).toBe('Amma and Arjun at the table.');
    expect(altText('A hopscotch on the path. The chalk squares have no numbers or letters in them. There are no signs, labels, letters or numbers anywhere in the picture.')).toBe('A hopscotch on the path.');
  });

  it('cuts the size rule and the lettering instruction', () => {
    expect(altText('Arjun waves. Match the approved character lineup: Arjun 110 cm standing; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower. No words or letters anywhere in the picture.')).toBe('Arjun waves.');
  });

  it.each(PICTURES)('%s reads as a scene, not a prompt', (_, picture) => {
    const alt = altText(picture);
    expect(alt).not.toMatch(/\b(110|87) cm\b|character lineup|ACTION FIRST|heels (puts it )?lower|\bno (written )?(words|writing|letters|text|lettering|signs|labels)\b|shows only a picture/i);
    expect(alt.length).toBeGreaterThan(20);
    expect(alt.split(/\s+/).length, alt).toBeLessThanOrEqual(90);
  });

  it('keeps only the first sentence: who does what', () => {
    expect(altText('Arjun rolls the ball to Mia. Wooden fence and lemon tree behind, afternoon sun. The top third is plain sky.')).toBe('Arjun rolls the ball to Mia.');
  });
});
