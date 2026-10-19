import type { AnyGame } from '../play/types';
import { willThisClayBoatFloat } from './games/will-this-clay-boat-float';

/**
 * The science world. Every game here is an `investigate` game: predict, Try,
 * see the before and after side by side, read why.
 *
 * To add a game: create src/science/games/<id>.tsx exporting one
 * InvestigateGame, import it here, and add it to the list.
 */

export const SCIENCE_GROUPS: ReadonlyArray<{ readonly id: string; readonly title: string; readonly line: string }> = [
  { id: 'motion', title: 'Push, Roll, Fall', line: 'Forces, friction, gravity, ramps and stored energy.' },
  { id: 'balance', title: 'Balance and Float', line: 'Levers, towers that tip, boats that float.' },
  { id: 'light', title: 'Light and Sound', line: 'Shadows, mirrors, and where sound comes from.' },
  { id: 'world', title: 'Our World', line: 'Magnets, ice and water, day and night, the moon, seeds, and how big things are.' },
];

export const SCIENCE_GAMES: readonly AnyGame[] = [willThisClayBoatFloat];

export function scienceGame(id: string): AnyGame | undefined {
  return SCIENCE_GAMES.find((g) => g.id === id);
}
