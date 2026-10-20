import type { GrownUpNote } from '../../notes/types';

/**
 * What kind of thing an archive read-aloud is, said plainly on its card and in
 * its reader. The final review found one blanket "true stories" label over a
 * shelf that also held teaching legends and imagined scenes.
 *
 * - documented: the people, object or event are on record, and the story's
 *   claims about them can be sourced.
 * - reconstructed: the idea or object is real, but the scene, the dialogue or
 *   the named child is imagined around it.
 * - tale: a traditional story or legend, told as one.
 */
export type ArchiveKind = 'documented' | 'reconstructed' | 'tale';

export const ARCHIVE_KIND_LABEL: Record<ArchiveKind, string> = {
  documented: 'True story',
  reconstructed: 'Real idea, imagined scene',
  tale: 'Old tale',
};

export interface ArchiveEntry {
  readonly kind: ArchiveKind;
  /** The grown-ups panel for THIS story. */
  readonly note: GrownUpNote;
  /**
   * Set when the story must not be offered to the child, with the reason in one
   * sentence (e.g. it shows fish or meat as food, which this family does not
   * eat, and the history cannot be told honestly without it).
   */
  readonly withhold?: string;
}
