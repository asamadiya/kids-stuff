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
 * The science world. Every game here is an `investigate` game: predict, Try,
 * see the before and after side by side, read why.
 *
 * To add a game: create src/science/games/<id>.tsx with one InvestigateGame as
 * its default export. It is picked up automatically.
 */

export const SCIENCE_GROUPS: ReadonlyArray<{ readonly id: string; readonly title: string; readonly line: string }> = [
  { id: 'motion', title: 'Push, Roll, Fall', line: 'Forces, friction, gravity, ramps and stored energy.' },
  { id: 'balance', title: 'Balance and Float', line: 'Levers, towers that tip, boats that float.' },
  { id: 'light', title: 'Light and Sound', line: 'Shadows, mirrors, and where sound comes from.' },
  { id: 'world', title: 'Our World', line: 'Magnets, ice and water, day and night, the moon, seeds, and how big things are.' },
];



/** In group order, then by title, so the hub is stable whatever order the files load in. */
export const SCIENCE_GAMES: readonly AnyGame[] = [...ALL].sort(
  (a, b) =>
    SCIENCE_GROUPS.findIndex((g) => g.id === a.group) - SCIENCE_GROUPS.findIndex((g) => g.id === b.group) ||
    a.title.localeCompare(b.title),
);

export function scienceGame(id: string): AnyGame | undefined {
  return SCIENCE_GAMES.find((g) => g.id === id);
}
