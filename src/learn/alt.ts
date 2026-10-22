/**
 * A picture's `picture`/`art` field is the generator's prompt, which also serves
 * as its description. The parts written only for the generator — the size rule
 * and the "no lettering" instructions — are cut first, so a screen reader hears
 * the scene and nothing addressed to an image model.
 */
const PROMPT_ONLY: readonly RegExp[] = [
  /\s*Match the approved character lineup[^]*?sitting (?:back )?on (?:his|her) heels(?: puts it)? lower\./g,
  // "No written words." / "No words or letters anywhere in the picture." / "There are no signs, labels, letters or numbers ..."
  /\s*(?:There (?:are|is) )?[Nn]o (?:written )?(?:words|writing|letters|text|lettering|signs|labels)\b[^.]*\./g,
  /\s*The (?:chalk squares|board) ha(?:s|ve) no (?:numbers|letters|writing)[^.]*\./g,
  /,? and the open book shows only a picture/g,
];

/**
 * The description for a screen reader: the prompt's first sentence, which by
 * the house rule (ACTION FIRST) says who does what; the rest is setting and
 * composition for the generator (design review, round 3: concise, not the
 * whole prompt).
 */
export function altText(picture: string): string {
  const clean = PROMPT_ONLY.reduce((s, re) => s.replace(re, ''), picture).replace(/\s{2,}/g, ' ').trim();
  return clean.split(/(?<=[.!?])\s+(?=[A-Z“"])/)[0] ?? clean;
}
