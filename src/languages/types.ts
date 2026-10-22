import type { GrownUpNote } from '../notes/types';
import type { Source } from '../learn/sources';

/**
 * Telugu & Tamil: a parent–child talking resource, not a vocabulary app.
 *
 * The household (the parent, 2026-10-22): Nanna speaks Telugu to the children,
 * Amma speaks Tamil; both speak English to each other most of the time and to
 * the children about 40% of the time. The advisor's q8 ruling E shapes it:
 * half routines and play phrases, a fifth songs and rhymes, a fifth shared
 * picture books, a tenth picture words with listening, and a grown-ups guide;
 * one language shown at a time; script beside the picture, romanisation and
 * meaning in an expandable adult aid; parents' own recorded voices, never
 * text-to-speech; spoken Tamil, not formal written Tamil.
 */

export type Lang = 'te' | 'ta';

export const LANG_NAME: Record<Lang, string> = { te: 'Telugu', ta: 'Tamil' };
/** Who speaks it to the children in this home. */
export const LANG_PARENT: Record<Lang, string> = { te: 'Nanna', ta: 'Amma' };

/** One line in one language: script, a plain romanisation, and its meaning. */
export interface Said {
  readonly script: string;
  readonly roman: string;
  /** English meaning, natural rather than word-for-word. */
  readonly means: string;
  /** Word-by-word or usage note for the grown-up, when it helps. */
  readonly note?: string;
}

/** The same thing in both languages. Recordings are keyed by `id` + language. */
export interface Pair {
  readonly id: string;
  readonly te: Said;
  readonly ta: Said;
  /**
   * Who says it, when it is not the child the page is written for. A moment's
   * `child` lines are Arjun's unless this names someone else: Mia has lines of
   * her own, and the page must not put her words under "He can say".
   */
  readonly by?: 'Mia';
}

/**
 * A routine or play moment (advisor: half of the launch): the things a parent
 * says, and the things HE can say back — invitations, jokes, requests,
 * questions, not mainly commands.
 */
export interface Moment {
  readonly id: string;
  readonly title: string;
  readonly hook: string;
  /** Where in the day: morning, meals, getting ready, play, outside, bedtime, with Mia, with grandparents. */
  readonly when: 'morning' | 'meals' | 'ready' | 'play' | 'outside' | 'bedtime' | 'mia' | 'grandparents';
  /** ACTION FIRST picture prompt and alt text: Arjun with Amma or Nanna (and Mia) in this house. */
  readonly picture: string;
  readonly cast: readonly ('Arjun' | 'Mia' | 'Amma' | 'Nanna' | 'Nanamma' | 'Tatayya' | 'Paati' | 'Thatha')[];
  /** What the grown-up says. */
  readonly grownUp: readonly Pair[];
  /** What he can say back: short, useful, often funny. */
  readonly child: readonly Pair[];
  readonly note: GrownUpNote;
  readonly sources: readonly Source[];
}

/** A traditional rhyme or song, in ONE language (they are different songs, not translations). */
export interface Rhyme {
  readonly id: string;
  readonly lang: Lang;
  readonly title: Said;
  readonly lines: readonly Said[];
  /** Hand actions or a game that goes with it. */
  readonly actions?: string;
  /** Origin, author if known, and why it is free to print. */
  readonly origin: string;
  readonly picture: string;
  readonly cast: readonly ('Arjun' | 'Mia' | 'Amma' | 'Nanna' | 'Nanamma' | 'Tatayya' | 'Paati' | 'Thatha')[];
  readonly note: GrownUpNote;
  readonly sources: readonly Source[];
}

/** A picture word, drawn from the moments and books (advisor: about 24 to start). */
export interface Word extends Pair {
  readonly theme: 'family' | 'food' | 'home' | 'body' | 'outside' | 'actions' | 'feelings';
  /** A short picture prompt: one object or action, plain background. */
  readonly picture: string;
}

/** A shared picture book, told once in a Telugu version and once in a Tamil version. */
export interface LangBookPage {
  readonly picture: string;
  readonly cast: readonly ('Arjun' | 'Mia' | 'Amma' | 'Nanna' | 'Nanamma' | 'Tatayya' | 'Paati' | 'Thatha')[];
  /** The page in each language; each version reads naturally on its own. */
  readonly te: Said;
  readonly ta: Said;
}
export interface LangBook {
  readonly id: string;
  readonly title: Pair;
  readonly hook: string;
  readonly pages: readonly LangBookPage[];
  readonly note: GrownUpNote;
}
