/**
 * The words a game says aloud, for the clip builder: every prompt, hint,
 * explanation and "why" a game can show, found by walking each level's rounds
 * (the tables cycle well before index 400), plus the shell's own fixed lines.
 * GameShell reads the same strings, so a game's read buttons only ever ask for
 * a line made here.
 *
 * Hints that depend on what the child answered cannot be listed in advance; a
 * game's `check` is called with its empty answer and with every answer a test
 * can construct cheaply, which covers the hints that depend only on the round.
 * Any other hint simply has no clip and its button says so.
 */
import type { AnyGame, Level } from '../play/types';

const LEVELS: readonly Level[] = [1, 2, 3];
const INDEXES = 400;

/** The shell's own lines, as GameShell shows them (without trailing spaces). */
export const SHELL_LINES: readonly string[] = [
  'First choose what you think will happen.',
  'Here is how it works.',
  'Yes.',
  'Just as you said.',
  'Not what you said — look.',
  'Here is what happens.',
];

export function gameLines(g: AnyGame): string[] {
  const out = new Set<string>();
  for (const level of LEVELS) {
    for (let i = 0; i < INDEXES; i++) {
      const round = g.generate(level, i);
      out.add(g.prompt(round));
      if (g.kind === 'solve') {
        out.add(g.explain(round));
        try {
          const v = g.check(round, g.emptyAnswer(round));
          if (!v.ok && v.hint) out.add(v.hint);
        } catch {
          /* a check that needs a real answer: its hints are answer-dependent */
        }
      } else {
        out.add(g.why(round));
      }
    }
  }
  return [...out].filter(Boolean);
}
