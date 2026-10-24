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

/** A Make & Do card's opening line: what he is going to do. */
export function activityLead(a: Activity): string[] {
  return [a.title, a.hook];
}

/** One Make & Do step. */
export function activityStep(a: Activity, i: number): string[] {
  return [a.steps[i].text];
}

/** One step of a play-together idea. */
export function ideaStep(x: PlayIdea, i: number): string[] {
  return [x.steps[i]];
}

/** A play-together idea's opening line. */
export function ideaLead(x: PlayIdea): string[] {
  return [x.title, x.hook];
}
