import { NOTES as EARLY } from '../games/parent-notes-early';
import { NOTES as MATHS } from '../games/parent-notes-maths';
import type { ParentNote } from '../games/parent-notes-maths';
import { NOTES as SOCIAL } from '../sel/parent-notes';
import { NOTES as WORKSHOP } from '../workshop/parent-notes';

export type { ParentNote };

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
