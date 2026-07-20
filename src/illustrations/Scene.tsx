import { useId } from 'react';
import type { Story, StoryPage } from '../types';
import { VIEW_H, VIEW_W, hashString, type SceneWorld } from './shared';
import { sunflowerWorld } from './scenes/the-tallest-sunflower';
import { patternWorld } from './scenes/pips-pattern-parade';
import { echoWorld } from './scenes/the-echo-in-the-canyon';
import { windWorld } from './scenes/nadias-kite-and-the-wind';
import { beanWorld } from './scenes/the-little-bean-seed';
import { shadowWorld } from './scenes/chasing-my-shadow';
import { starWorld } from './scenes/following-the-north-star';
import { machinesWorld } from './scenes/the-ramp-to-the-treehouse';
import { crownWorld } from './scenes/the-sneaky-golden-crown';
import '../styles/illustrations.css';

/** Each story slug draws its own bespoke visual world. */
const WORLDS: Record<string, SceneWorld> = {
  'the-tallest-sunflower': sunflowerWorld,
  'pips-pattern-parade': patternWorld,
  'the-echo-in-the-canyon': echoWorld,
  'nadias-kite-and-the-wind': windWorld,
  'the-little-bean-seed': beanWorld,
  'chasing-my-shadow': shadowWorld,
  'following-the-north-star': starWorld,
  'the-ramp-to-the-treehouse': machinesWorld,
  'the-sneaky-golden-crown': crownWorld,
};

export interface SceneProps {
  readonly story: Story;
  readonly page: StoryPage;
  /**
   * Reserved for Task 5. It is exposed as a stable `data-motion` hook only;
   * no animation runs in this task and the artwork is identical either way.
   */
  readonly motionEnabled: boolean;
}

const sentence = (value: string): string =>
  value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;

/**
 * Renders one story page as an original, inline SVG illustration.
 *
 * Every instance mints its own id namespace via {@link useId}, so any number of
 * scenes can render at once (a library grid, a spread) without their gradient,
 * title or description ids ever colliding.
 */
export function Scene({ story, page, motionEnabled }: SceneProps) {
  const raw = useId();
  const uid = `sc${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
  const id = (name: string): string => `${uid}-${name}`;
  const paint = (name: string): string => `url(#${id(name)})`;
  const seed = hashString(page.scene.id);

  const titleId = id('title');
  const descId = id('desc');
  const description = `${sentence(page.scene.focus)}. ${sentence(page.scene.palette)}.`;

  const World: SceneWorld | undefined = Object.prototype.hasOwnProperty.call(WORLDS, story.slug)
    ? WORLDS[story.slug]
    : undefined;
  if (typeof World !== 'function') {
    throw new Error(
      `No illustration world registered for story slug "${story.slug}".`,
    );
  }

  return (
    <svg
      className={`scene scene--${story.domain}`}
      data-motion={motionEnabled ? 'on' : 'off'}
      data-scene-id={page.scene.id}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{page.alt}</title>
      <desc id={descId}>{description}</desc>
      <World
        story={story}
        page={page}
        motionEnabled={motionEnabled}
        id={id}
        paint={paint}
        seed={seed}
      />
    </svg>
  );
}

export default Scene;
