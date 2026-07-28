import { NOTES as EARLY } from '../games/parent-notes-early';
import { NOTES as MATHS } from '../games/parent-notes-maths';

import { NOTES as SOCIAL } from '../sel/parent-notes';
import { NOTES as WORKSHOP } from '../workshop/parent-notes';

/**
 * The canonical note shape. It lives here rather than in one of the four
 * content files so that no single section owns the schema.
 *
 * `how` and `skills` are optional in the TYPE only, so the four content files
 * can be filled independently without breaking the build in between. Every
 * note is asserted to carry both, filled, in src/test/parent-notes.test.ts —
 * that is where the coverage is actually enforced, not here.
 */
export interface ParentNote {
  /** What is on the screen and what the child does. */
  readonly what: string;
  /** The skill, named precisely. */
  readonly practising: string;
  /** One question a grown-up can ask out loud. */
  readonly ask: string;
  /** The limitation, stated without flattery. */
  readonly honest: string;
  /** Three to five ordered steps, each naming a real control. */
  readonly how?: readonly string[];
  /** Two to four precise noun phrases. */
  readonly skills?: readonly string[];
}

/**
 * Every "For the parent" note, in one lookup.
 *
 * These exist because the person who commissioned this site opened it and
 * could not tell what several of the exercises were for — What Happens Next,
 * which shows a truck on a shelf and a hand near it, and the workshop
 * instruments. If he cannot tell, nobody can.
 *
 * The `honest` field on each note is deliberately unflattering: it names the
 * cap, says plainly when an exercise is beneath a child who is already ahead,
 * and points at the harder thing to do instead. A note that praised its own
 * exercise would be worth nothing to the adult sitting next to him.
 */
export const PARENT_NOTES: Record<string, ParentNote> = {
  ...MATHS,
  ...EARLY,
  ...SOCIAL,
  ...WORKSHOP,
};

export function parentNote(id: string): ParentNote | undefined {
  return PARENT_NOTES[id];
}
