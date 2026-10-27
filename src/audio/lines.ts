/**
 * Exactly what each read-aloud button reads, in one place: the screens call
 * these to know what to play, and the clip builder calls the same functions
 * (through `allLines`) to know what to make. One source, so a button can never
 * ask for a line the build did not make.
 *
 * Each function returns the visible child-facing lines, in reading order, one
 * clip per entry. Adult notes, safety notes and sources are not read (advisor
 * a9 point 3): the grown-up reads those.
 */
import type { Book } from '../books/types';
import type { Activity } from '../make/types';
import type { PlayIdea } from '../together/types';

/** A book page: the paragraphs on it, and on page 1 the title first. */
export function pageReading(book: Book, page: number): string[] {
  const paras = book.pages[page].text.split(/\n\n+/);
  return page === 0 ? [book.title, ...paras] : paras;
}

/**
 * A Make & Do card's opening: what he is going to do, then the safety line
 * shown straight under it — the boundary he must hear too once he can listen
 * on his own (design review, round 4; advisor a9: "spoken activity
 * instructions must preserve adult-supervision boundaries").
 */
export function activityLead(a: Activity): string[] {
  return [a.title, a.hook, ...(a.note.safety ? ['Safety.', ...splitSentences(a.note.safety)] : [])];
}

/** One clip per sentence, so a long safety note is never a single over-long clip. */
function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z“"])/).map((x) => x.trim()).filter(Boolean);
}

/** One Make & Do step. */
export function activityStep(a: Activity, i: number): string[] {
  return [a.steps[i].text];
}

/**
 * A play-together idea's opening line. Its steps are not read: they are
 * written to the grown-up who plays ("Give him just enough resistance…"), not
 * to the child (design review, round 4).
 */
export function ideaLead(x: PlayIdea): string[] {
  return [x.title, x.hook];
}
