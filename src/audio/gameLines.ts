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
/** The round tables cycle by index 8 (measured); 40 leaves room for longer tables. */
const INDEXES = 40;

/** The shell's own lines, as GameShell shows them (without trailing spaces). */
export const SHELL_LINES: readonly string[] = [
  'First choose what you think will happen.',
  'Here is how it works.',
  'Yes.',
  'Just as you said.',
  'Not what you said — look.',
  'Here is what happens.',
];

const STAGES = ['answering', 'hint', 'worked', 'solved'] as const;

/** A hint, sentence by sentence: one clip each, so a sentence with an unlisted number can be skipped. */
export function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z0-9“"])/).map((s) => s.trim()).filter(Boolean);
}

export function gameLines(g: AnyGame): string[] {
  const out = new Set<string>();
  for (const level of LEVELS) {
    for (let i = 0; i < INDEXES; i++) {
      const round = g.generate(level, i);
      out.add(g.prompt(round));
      if (g.board) for (const stage of STAGES) for (const line of g.board(round, level, stage)) out.add(line);
      if (g.kind === 'solve') {
        out.add(g.explain(round));
        if (g.hints) for (const h of g.hints(round)) for (const x of sentences(h)) out.add(x);
        try {
          const v = g.check(round, g.emptyAnswer(round));
          if (!v.ok && v.hint) for (const x of sentences(v.hint)) out.add(x);
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
