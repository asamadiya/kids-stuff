import type { AnyGame } from '../play/types';

// Every file in ./games is a game. `_`-prefixed files are drafts. A game is
// found by its default export, or failing that by the one named export that
// looks like a game — the builders were asked for both and not all gave both.
const modules = import.meta.glob<Record<string, unknown>>(['./games/*.tsx', '!./games/_*.tsx'], { eager: true });
const isGame = (x: unknown): x is AnyGame =>
  !!x && typeof x === 'object' && 'kind' in x && 'id' in x && 'generate' in x && 'Board' in x;
// A builder writes a game in chunks, so a file can exist before its game
// object does; it is simply not on the shelf yet. games-contract.test.tsx
// lists any such file, so one cannot ship unnoticed.
export const INCOMPLETE: string[] = [];
const ALL: AnyGame[] = Object.entries(modules).flatMap(([path, m]) => {
  const found = isGame(m.default) ? m.default : Object.values(m).find(isGame);
  if (!found) INCOMPLETE.push(path);
  return found ? [found] : [];
});

/**
 * The maths world, in the order the hub shows it. Grouped by `group`; the
 * hub reads the group names from MATHS_GROUPS.
 *
 * To add a game: create src/maths/games/<id>.tsx with one SolveGame as its
 * default export. It is picked up automatically, and src/test/games-contract.test.tsx
 * checks it against every rule.
 */

export const MATHS_GROUPS: ReadonlyArray<{ readonly id: string; readonly title: string; readonly line: string }> = [
  { id: 'numbers', title: 'How Many?', line: 'Seeing amounts, place value, zero, the number line, estimating, numbers below zero.' },
  { id: 'together', title: 'Put Together, Take Apart', line: 'Parts and wholes, the equals sign as balance, adding and taking away.' },
  { id: 'groups', title: 'Groups and Shares', line: 'Equal groups, multiplying as arrays, sharing, fractions as equal parts.' },
  { id: 'shapes', title: 'Shapes and Space', line: 'Turning and fitting shapes, symmetry, maps and directions.' },
  { id: 'measure', title: 'Measure It', line: 'Length in equal units, clocks, and money.' },
  { id: 'rules', title: 'Rules and Chances', line: "Patterns and their rules, chance, and reading a chart." },
];



/** In group order, then by title, so the hub is stable whatever order the files load in. */
export const MATHS_GAMES: readonly AnyGame[] = [...ALL].sort(
  (a, b) =>
    MATHS_GROUPS.findIndex((g) => g.id === a.group) - MATHS_GROUPS.findIndex((g) => g.id === b.group) ||
    a.title.localeCompare(b.title),
);

export function mathsGame(id: string): AnyGame | undefined {
  return MATHS_GAMES.find((g) => g.id === id);
}
