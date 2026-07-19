import type { Story } from '../types';
import { theTallestSunflower } from './the-tallest-sunflower';
import { pipsPatternParade } from './pips-pattern-parade';
import { theEchoInTheCanyon } from './the-echo-in-the-canyon';
import { nadiasKiteAndTheWind } from './nadias-kite-and-the-wind';
import { theLittleBeanSeed } from './the-little-bean-seed';
import { chasingMyShadow } from './chasing-my-shadow';
import { followingTheNorthStar } from './following-the-north-star';
import { theRampToTheTreehouse } from './the-ramp-to-the-treehouse';

export const STORIES: readonly Story[] = [
  theTallestSunflower,
  pipsPatternParade,
  theEchoInTheCanyon,
  nadiasKiteAndTheWind,
  theLittleBeanSeed,
  chasingMyShadow,
  followingTheNorthStar,
  theRampToTheTreehouse,
];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((story) => story.slug === slug);
}
