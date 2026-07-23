import type { Story } from '../types';

import { theTallestSunflower } from './the-tallest-sunflower';
import { pipsPatternParade } from './pips-pattern-parade';
import { theEchoInTheCanyon } from './the-echo-in-the-canyon';
import { nadiasKiteAndTheWind } from './nadias-kite-and-the-wind';
import { theLittleBeanSeed } from './the-little-bean-seed';
import { chasingMyShadow } from './chasing-my-shadow';
import { followingTheNorthStar } from './following-the-north-star';
import { theRampToTheTreehouse } from './the-ramp-to-the-treehouse';
import { theSneakyGoldenCrown } from './the-sneaky-golden-crown';
import { aPlaceToStand } from './a-place-to-stand';
import { countingAllTheSand } from './counting-all-the-sand';
import { theCircleNumberThatNeverEnds } from './the-circle-number-that-never-ends';
import { theDragonThatFeltTheEarthShake } from './the-dragon-that-felt-the-earth-shake';
import { theLadderOfSwingMarks } from './the-ladder-of-swing-marks';
import { theManWhoSpunTheWorld } from './the-man-who-spun-the-world';
import { theNumberThatWasNothing } from './the-number-that-was-nothing';
import { thePaperMadeFromRags } from './the-paper-made-from-rags';
import { theSpoonThatAlwaysPointsSouth } from './the-spoon-that-always-points-south';
import { theTenThousandLittleBlocks } from './the-ten-thousand-little-blocks';
import { theWaterScrewSong } from './the-water-screw-song';
import { archimedesCountingTheSand } from './archimedes-counting-the-sand';
import { archimedesPlaceToStand } from './archimedes-place-to-stand';
import { archimedesWaterScrew } from './archimedes-water-screw';
import { aryabhataCircleNumber } from './aryabhata-circle-number';
import { aryabhataNumberLadder } from './aryabhata-number-ladder';
import { aryabhataSpinningEarth } from './aryabhata-spinning-earth';
import { biShengBlocks } from './bi-sheng-blocks';
import { brahmaguptaNothing } from './brahmagupta-nothing';
import { caiLunPaper } from './cai-lun-paper';
import { theSouthPointingSpoon } from './the-south-pointing-spoon';
import { zhangHengEarthDragon } from './zhang-heng-earth-dragon';

export const STORIES: readonly Story[] = [
  theTallestSunflower,
  pipsPatternParade,
  theEchoInTheCanyon,
  nadiasKiteAndTheWind,
  theLittleBeanSeed,
  chasingMyShadow,
  followingTheNorthStar,
  theRampToTheTreehouse,
  theSneakyGoldenCrown,
  aPlaceToStand,
  countingAllTheSand,
  theCircleNumberThatNeverEnds,
  theDragonThatFeltTheEarthShake,
  theLadderOfSwingMarks,
  theManWhoSpunTheWorld,
  theNumberThatWasNothing,
  thePaperMadeFromRags,
  theSpoonThatAlwaysPointsSouth,
  theTenThousandLittleBlocks,
  theWaterScrewSong,
  archimedesCountingTheSand,
  archimedesPlaceToStand,
  archimedesWaterScrew,
  aryabhataCircleNumber,
  aryabhataNumberLadder,
  aryabhataSpinningEarth,
  biShengBlocks,
  brahmaguptaNothing,
  caiLunPaper,
  theSouthPointingSpoon,
  zhangHengEarthDragon,
];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((story) => story.slug === slug);
}
