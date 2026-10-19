import type { AnyGame } from '../play/types';
import { makeBothSidesMatch } from './games/make-both-sides-match';

/**
 * The maths world, in the order the hub shows it. Grouped by `group`; the
 * hub reads the group names from MATHS_GROUPS.
 *
 * To add a game: create src/maths/games/<id>.tsx exporting one SolveGame,
 * import it here, and add it to the list. src/test/games-contract.test.tsx
 * checks it against every rule automatically.
 */

export const MATHS_GROUPS: ReadonlyArray<{ readonly id: string; readonly title: string; readonly line: string }> = [
  { id: 'numbers', title: 'How Many?', line: 'Seeing amounts, place value, zero, the number line, estimating, numbers below zero.' },
  { id: 'together', title: 'Put Together, Take Apart', line: 'Parts and wholes, the equals sign as balance, adding and taking away.' },
  { id: 'groups', title: 'Groups and Shares', line: 'Equal groups, multiplying as arrays, sharing, fractions as equal parts.' },
  { id: 'shapes', title: 'Shapes and Space', line: 'Turning and fitting shapes, symmetry, maps and directions.' },
  { id: 'measure', title: 'Measure It', line: 'Length in equal units, clocks, and money.' },
  { id: 'rules', title: 'Rules and Chances', line: "Patterns and their rules, chance, and reading a chart." },
];

export const MATHS_GAMES: readonly AnyGame[] = [makeBothSidesMatch];

export function mathsGame(id: string): AnyGame | undefined {
  return MATHS_GAMES.find((g) => g.id === id);
}
