import type { GrownUpNote } from '../notes/types';
import type { Source } from '../learn/sources';

/**
 * Play with Dad & Mom: fifty ways for a parent to play with a five-year-old
 * with what is already in the house.
 *
 * Shaped by the advisor's rulings (q7, rulings 8-14): every idea must make
 * starting easy and keep the play the child's — a concrete title, a picture of
 * the central action, time and setup, who plays, materials with substitutes,
 * three to five steps, how HE can change the game, an easier and a harder
 * version, how his two-year-old sister fits in, and the usual grown-ups note.
 * `practising` stays modest and `ask` stays optional: this is play, not a quiz.
 */
export type PlayGroupId = 'rough' | 'chase' | 'throw' | 'pretend' | 'rules' | 'music' | 'outside' | 'quiet';

export const PLAY_GROUPS: ReadonlyArray<{ readonly id: PlayGroupId; readonly title: string; readonly line: string; readonly count: number }> = [
  { id: 'rough', title: 'Rough and Tumble', line: 'Pushing, pulling and play-fighting, with a stop word you both use.', count: 4 },
  { id: 'chase', title: 'Chase, Hide and Freeze', line: 'Running, hiding and stopping on a signal.', count: 6 },
  { id: 'throw', title: 'Throw, Kick and Catch', line: 'Soft balls, socks and targets, indoors or out.', count: 6 },
  { id: 'pretend', title: 'Build and Pretend', line: 'Dens, shops, rockets and stories he runs.', count: 9 },
  { id: 'rules', title: 'Games with Rules', line: 'Indian and family games: taking turns, winning and losing.', count: 8 },
  { id: 'music', title: 'Music and Moving', line: 'Rhythm, songs, dancing and moving like something else.', count: 5 },
  { id: 'outside', title: 'Outside and Nature', line: 'Trails, bugs, puddles, clouds and low things to climb.', count: 6 },
  { id: 'quiet', title: 'Quiet Together and Helping', line: 'Stories, drawing, word games and real jobs he can do.', count: 6 },
];

export type PlayWhere = 'indoors' | 'outdoors' | 'either';

/**
 * How Mia fits in (advisor ruling 10): she joins in a simple role, plays
 * alongside with her own things, or is with another adult so he gets his
 * one-to-one time. He is never made to give up his build, mind her, or restart
 * for her.
 */
export type MiaWay = 'joins' | 'alongside' | 'apart';

export type PlayCast = 'Arjun' | 'Mia' | 'Mummy' | 'Papa' | 'Dadi' | 'Dada';

export interface PlayIdea {
  readonly id: string;
  /** Concrete and plain: "Can You Move My Cushion?", "Sock-Ball Bowling". */
  readonly title: string;
  /** One short line for the card. */
  readonly hook: string;
  readonly group: PlayGroupId;
  readonly where: PlayWhere;
  readonly energy: 'quiet' | 'active';
  /** Body contact: wrestling, pushing, piggybacks. Filterable, and always with a stop word. */
  readonly contact: boolean;
  /** About how long a good round lasts. */
  readonly minutes: 5 | 15 | 30;
  /** "No setup", "Two minutes to clear the floor". */
  readonly setup: string;
  /** "You and him", "You, him and Mia", "Three or more". */
  readonly players: string;
  /** Household things, with a substitute where one helps. Empty means nothing is needed. */
  readonly need: readonly string[];
  /** Anything most homes do not have, and what to use instead. */
  readonly exception?: string;
  /** Three to five short steps, addressed to the grown-up. */
  readonly steps: readonly string[];
  /** How he can change the game or take over as leader. */
  readonly hisWay: string;
  readonly mia: { readonly way: MiaWay; readonly text: string };
  /**
   * ACTION FIRST picture prompt, which is also the alt text: who does what,
   * where, with which things. One moment, the central action, the named cast
   * only.
   */
  readonly picture: string;
  /** Exactly who is in the picture. */
  readonly cast: readonly PlayCast[];
  /** For traditional games: the name(s), the region, and exactly what this version changes. */
  readonly tradition?: string;
  readonly sources: readonly Source[];
  /** Search words a parent might type: "rainy day", "bedtime", "park". */
  readonly tags?: readonly string[];
  /** `easier` and `harder` are required here; `safety` whenever there is contact, running, water, heights or small parts. */
  readonly note: GrownUpNote;
}
