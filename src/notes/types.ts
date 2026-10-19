/**
 * The note a grown-up reads beside every book, game, situation and activity.
 *
 * The parent asked for this on everything — "always has notes for parents on
 * what to expect from that" — and the advisor added what a note must carry to
 * be useful rather than flattering: what understanding looks like, an easier
 * and a harder version, and what the item does NOT establish.
 *
 * Every field is a plain sentence or two, written to the adult.
 */
export interface GrownUpNote {
  /** What this is and what the child does, in one or two sentences. */
  readonly what: string;
  /** What to expect to see: the likely first attempt, the likely confusion. */
  readonly expect: string;
  /** The idea or skill, named precisely. */
  readonly practising: string;
  /** One question to ask out loud, at the right moment. */
  readonly ask: string;
  /** A real-world follow-up, off the screen. */
  readonly next: string;
  /** The limit, stated without flattery: what finishing this does not prove. */
  readonly honest: string;
  readonly easier?: string;
  readonly harder?: string;
  readonly safety?: string;
}

/** The fields, in the order the panel shows them, with the adult-facing label. */
export const NOTE_FIELDS: ReadonlyArray<readonly [keyof GrownUpNote, string]> = [
  ['what', 'What this is'],
  ['expect', 'What to expect'],
  ['practising', 'What it practises'],
  ['ask', 'Ask'],
  ['next', 'Afterwards, off the screen'],
  ['easier', 'Easier'],
  ['harder', 'Harder'],
  ['safety', 'Safety'],
  ['honest', 'Honestly'],
];

export const REQUIRED_NOTE_FIELDS = ['what', 'expect', 'practising', 'ask', 'next', 'honest'] as const;
