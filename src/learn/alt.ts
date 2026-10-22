/**
 * A picture's `picture`/`art` field is the generator's prompt, which also serves
 * as its description. The parts written only for the generator (the size rule,
 * "no words" instructions) are cut so a screen reader reads just the scene.
 */
const PROMPT_ONLY: readonly RegExp[] = [
  /\s*Match the approved character lineup[^]*?sitting on (?:his|her) heels lower\./g,
  /\s*No words or letters anywhere in the picture\./gi,
];

export function altText(picture: string): string {
  return PROMPT_ONLY.reduce((s, re) => s.replace(re, ''), picture).trim();
}
