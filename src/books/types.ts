import type { GrownUpNote } from '../notes/types';

/**
 * The new picture books.
 *
 * These replace the picture-left / paragraph-right reader for everything new.
 * Three failures of the old books shaped this type:
 *
 * - The picture did not show the text. So `art` is written per page, ACTION
 *   FIRST, and must name the objects and quantities the text names.
 * - A different child on every page. So cast books name a reference `cast`
 *   sheet, and every page is an edit of that one image.
 * - Words beside the picture instead of in it. So every page names the `zone`
 *   the art leaves calm, and the reader sets the words there.
 */

export type ShelfId = 'family' | 'tales' | 'festivals' | 'how' | 'people';
export type CastSheet = 'family' | 'grandparents' | 'friends';
export type CastName = 'Arjun' | 'Mia' | 'Mummy' | 'Papa' | 'Dadi' | 'Dada' | 'Zoe' | 'Ben';
export type TextZone = 'top' | 'bottom' | 'left' | 'right';

export interface BookPage {
  /** Read aloud by a grown-up: 15-35 words, 50 at most, 2-4 short sentences. */
  readonly text: string;
  /** The calm part of the picture the words sit on. */
  readonly zone: TextZone;
  /** ACTION FIRST: who does what, where, and every object or number the text names. */
  readonly art: string;
  /** Cast books: who is in THIS picture. Anyone not listed is told to stay out. */
  readonly characters?: readonly CastName[];
  /** One sentence for a screen reader. */
  readonly alt: string;
  /** A display page: eight words or fewer, set huge (a refrain, a sound, the turn). */
  readonly big?: boolean;
  /** A hand-authored diagram instead of a painting, for a mechanism no picture can show. */
  readonly figureId?: string;
}

export interface TryThis {
  readonly title: string;
  readonly steps: readonly string[];
  readonly safety?: string;
}

export interface Book {
  readonly slug: string;
  readonly title: string;
  readonly shelf: ShelfId;
  /** The card line: concrete, nine words at most. */
  readonly hook: string;
  /** Which reference sheet every page is edited from. Absent for tales and history. */
  readonly cast?: CastSheet;
  /** One line of place and time, repeated in every art prompt. */
  readonly setting: string;
  /** Non-cast books: the recurring characters, described identically on every page. */
  readonly characterLine?: string;
  /** An exact phrase the reader marks wherever it occurs. */
  readonly refrain?: string;
  readonly readMinutes: number;
  readonly pages: readonly BookPage[];
  readonly tryThis?: TryThis;
  readonly note: GrownUpNote;
  /** History and people books: what the facts rest on. */
  readonly sources?: readonly string[];
}

export interface Shelf {
  readonly id: ShelfId;
  readonly title: string;
  /** One line for a grown-up, shown under the shelf title. */
  readonly line: string;
  readonly note: GrownUpNote;
}
