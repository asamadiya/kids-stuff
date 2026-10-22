import type { GrownUpNote } from '../notes/types';
import type { Source } from '../learn/sources';

export type Place = 'kitchen' | 'garden' | 'outdoors' | 'table';

/**
 * The idea an activity is for. Make & Do is grouped by idea, not by room:
 * the advisor's gap analysis (q7, ruling 15) found the first twelve heavy on
 * counting, balance and floating and thin on sound, air, light, materials,
 * structures and weather, and grouping by idea keeps that visible.
 */
export type MakeArea = 'numbers' | 'shapes' | 'forces' | 'build' | 'air' | 'sound-light' | 'water' | 'kitchen';

export const MAKE_AREAS: ReadonlyArray<{ readonly id: MakeArea; readonly title: string; readonly line: string }> = [
  { id: 'numbers', title: 'Count, Share and Measure', line: 'Tens and ones, fair shares, measuring, time and charts.' },
  { id: 'shapes', title: 'Shapes and Patterns', line: 'Symmetry, dot grids, prints and building from a plan.' },
  { id: 'forces', title: 'Push, Fall and Balance', line: 'Ramps, drops, levers, swings and magnets.' },
  { id: 'build', title: 'Build It Strong', line: 'Bridges, towers and what makes a shape hold weight.' },
  { id: 'air', title: 'Air and Flight', line: 'Spinners, parachutes and pinwheels: air pushes back.' },
  { id: 'sound-light', title: 'Sound, Light and Shadow', line: 'Vibrations, pitch, mirrors, colour and shadows.' },
  { id: 'water', title: 'Water and Weather', line: 'Floating, rain, evaporation, and the same water in a new shape.' },
  { id: 'kitchen', title: 'Mix, Change and Grow', line: 'Butter from cream, colour changes, dissolving and sprouting.' },
];

/**
 * Make & Do: things a grown-up and the child do together off the screen, in
 * the kitchen, at the table, in the garden or outdoors. The screen is only the
 * card: what you need, four to six picture steps, what to notice and one
 * question.
 *
 * Step text is addressed to the pair doing it. The pictures show Arjun from
 * the family cast sheet with Mummy or Papa, never a character called Rikki.
 * Each `art` string leads with the action, because an edit-from-reference
 * prompt that does not copies the sheet's standing poses; it is also the
 * picture's alt text, so it shows exactly what the step says.
 */
export interface Activity {
  readonly id: string;
  readonly title: string;
  readonly hook: string;
  /** The main place; `places` adds the others it works in. */
  readonly where: Place;
  readonly places?: readonly Place[];
  readonly area: MakeArea;
  /** Hands-on minutes: the whole activity in one sitting, or its setup when `span` is set. */
  readonly minutes: number;
  /**
   * For an activity that is not done in one sitting, the whole commitment as a
   * short phrase shown instead of the minutes on the card and the page: a
   * five-day experiment is not a fifteen-minute one. Keep it to a few words; it
   * sits in a pill on a quarter-width card. The note's `expect` spells out each
   * sitting. Absent when the whole thing is done in one sitting.
   */
  readonly span?: string;
  readonly need: readonly string[];
  /**
   * `figure` names a drawn diagram (src/make/figures.tsx) shown instead of a
   * painting, for a step whose point is exact geometry — nine dots in a
   * square, the seven tangram pieces — which an image model cannot be trusted
   * to count or fit. `art` is then the diagram's alt text.
   */
  readonly steps: readonly { readonly text: string; readonly art: string; readonly figure?: string }[];
  readonly notice: string;
  readonly ask: string;
  /** A maths or science game, or a picture book, about the same idea. */
  readonly pairsWith?: string;
  /**
   * What the grown-up should try alone first, and what to look for: household
   * materials vary (steel tumblers that barely ring, cream that will not
   * thicken), and the advisor ruled that every activity needs an adult trial.
   */
  readonly trial?: string;
  /** Where the activity was adapted from; linked, not reproduced. */
  readonly sources?: readonly Source[];
  /** Extra search words a parent might type: "rainy day", "monsoon", "Diwali". */
  readonly tags?: readonly string[];
  readonly note: GrownUpNote;
}
