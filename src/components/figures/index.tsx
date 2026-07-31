import type { ReactElement } from 'react';
import { OliveTheStone } from './OliveTheStone';
import { OliveScrewAndNut } from './OliveScrewAndNut';
import { OliveTheLongBar } from './OliveTheLongBar';
import { OliveTheSqueeze } from './OliveTheSqueeze';

/**
 * Hand-authored diagrams, keyed by `StoryPage.figureId`.
 *
 * A story page reaches a figure the same way it reaches its art: by id, with
 * no import of its own. Keeping the registry here means a page can never name
 * a diagram that does not exist — `src/test/story-figures.test.ts` walks every
 * `figureId` in the library against these keys.
 */
export interface StoryFigureSpec {
  readonly id: string;
  /** The line a grown-up reads out under the diagram. */
  readonly caption: string;
  readonly render: () => ReactElement;
}

const specs: readonly StoryFigureSpec[] = [
  {
    id: 'olive-the-stone',
    caption: 'Nobody lifts the stone. It is round, so it rolls; the post keeps it rolling over the same olives; and its own weight does the crushing.',
    render: () => <OliveTheStone />,
  },
  {
    id: 'olive-screw-and-nut',
    caption: 'Cut the beam open and you can see it: the ridge is sitting in a groove that fits it exactly, and that groove runs round and down.',
    render: () => <OliveScrewAndNut />,
  },
  {
    id: 'olive-the-long-bar',
    caption: 'Both arrows turn the screw the same amount. The fat one is what her hands could not manage; the thin one is what she did instead.',
    render: () => <OliveTheLongBar />,
  },
  {
    id: 'olive-the-squeeze',
    caption: 'Watch the gold. Before, it is locked inside the paste. After, it has been pushed out through the weave — and the paste is still there.',
    render: () => <OliveTheSqueeze />,
  },
];

export const STORY_FIGURES: ReadonlyMap<string, StoryFigureSpec> = new Map(
  specs.map((s) => [s.id, s]),
);

export const storyFigure = (id: string): StoryFigureSpec | undefined =>
  STORY_FIGURES.get(id);
