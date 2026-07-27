/**
 * Meant and Landed.
 *
 * One moment, two independent placements: a thought chip for what the person
 * meant, and a painted portrait for how it landed on the other one. The two
 * rails are not related in the data and are never checked against each other.
 * Every combination assembles into the same three-clause form, and the third
 * clause is always the same sentence.
 *
 * Nothing in this module scores, ranks, corrects or prefers anything.
 */

import type { Kept } from '../workshop/drawer';

export const MEANT_AND_LANDED_META = {
  id: 'meant-and-landed',
  title: 'Meant and Landed',
  eyebrow: 'Two true things',
  note: 'He sets what the person meant, then sets how it landed, and reads the two of them side by side.',
} as const;

/* ------------------------------------------------------------------- shape */

export type SideKey = 'front' | 'turned';

/** Who is speaking in a clause. `You` is Rikki; everyone else has a name. */
export interface Voice {
  readonly subject: string;
  readonly isYou: boolean;
}

/** One direction of a moment: someone acts, someone receives. */
export interface Side {
  readonly key: SideKey;
  /** Read aloud by a grown-up. Never a question with an answer. */
  readonly ask: string;
  /** The word on the button that turns the moment around. */
  readonly flip: string;
  readonly actor: Voice;
  readonly receiver: Voice;
}

export interface Moment {
  readonly id: string;
  readonly title: string;
  /** Path under `games/`, without the extension. */
  readonly picture: string;
  readonly alt: string;
  readonly caption: string;
  readonly sides: { readonly front: Side; readonly turned: Side };
}

export type ThoughtGlyph = 'joke' | 'help' | 'win' | 'back' | 'blank' | 'hidden';

/**
 * A thought-bubble chip. `phrase` is the tail of the clause; the templates
 * exist only so the sentence stays grammatical when the subject is "You" or
 * when the receiver is. `{them}` is filled with the receiver's name.
 */
export interface Thought {
  readonly id: string;
  readonly label: string;
  readonly glyph: ThoughtGlyph;
  readonly phrase: string;
  readonly whenActorIsYou?: string;
  readonly whenReceiverIsYou?: string;
}

/** A painted portrait on the lower rail. */
export interface Landing {
  readonly id: string;
  readonly word: string;
  readonly picture: string;
  readonly alt: string;
}

export interface MeantRecord extends Kept {
  readonly title: string;
  readonly lines: readonly string[];
}

/* ----------------------------------------------------------------- moments */

const you = (): Voice => ({ subject: 'You', isYou: true });
const other = (name: string): Voice => ({ subject: name, isYou: false });

export const MOMENTS: readonly Moment[] = [
  {
    id: 'teased',
    title: 'The laugh at the table',
    picture: 'scenes/teased',
    alt: 'Two children at a low classroom table. One leans back laughing with his hand on the table; the other holds up a painting and looks down at it.',
    caption: 'Ben laughed while you were holding up your painting.',
    sides: {
      front: {
        key: 'front',
        ask: 'Ben laughed. Set what Ben meant, and set how it landed on you.',
        flip: 'and if you had done it?',
        actor: other('Ben'),
        receiver: you(),
      },
      turned: {
        key: 'turned',
        ask: 'Now you are the one laughing, and Ben is holding the painting.',
        flip: 'back to how it happened',
        actor: you(),
        receiver: other('Ben'),
      },
    },
  },
  {
    id: 'blocks-knocked',
    title: 'The tower on the carpet',
    picture: 'scenes/blocks-knocked',
    alt: 'A tall block tower falling on a classroom carpet. One child pulls his arm back; another kneels with both hands still raised where the tower stood.',
    caption: "Sam's arm went through the tower you had been building.",
    sides: {
      front: {
        key: 'front',
        ask: 'The tower came down. Set what Sam meant, and set how it landed on you.',
        flip: 'and if you had done it?',
        actor: other('Sam'),
        receiver: you(),
      },
      turned: {
        key: 'turned',
        ask: 'Now it is your arm through the tower, and Sam was the one building.',
        flip: 'back to how it happened',
        actor: you(),
        receiver: other('Sam'),
      },
    },
  },
  {
    id: 'nickname',
    title: 'The new name at lunch',
    picture: 'sel/meant-and-landed-nickname',
    alt: 'Children at a long lunch table. One girl leans toward the others with her mouth open mid-word while a boy across from her stops with his sandwich halfway up.',
    caption: 'Ava called you a new name at the lunch table, and the others said it too.',
    sides: {
      front: {
        key: 'front',
        ask: 'Ava made up the name. Set what Ava meant, and set how it landed on you.',
        flip: 'and if you had done it?',
        actor: other('Ava'),
        receiver: you(),
      },
      turned: {
        key: 'turned',
        ask: 'Now you are the one who made up the name for Ava.',
        flip: 'back to how it happened',
        actor: you(),
        receiver: other('Ava'),
      },
    },
  },
  {
    id: 'copied-drawing',
    title: 'The same dinosaur',
    picture: 'sel/meant-and-landed-copied-drawing',
    alt: 'A view across a table from behind a drawing in progress. Two hands hold the near paper steady; across the table a girl draws the same dinosaur on her own sheet.',
    caption: 'Noor looked at your dinosaur and drew the same one on her own paper.',
    sides: {
      front: {
        key: 'front',
        ask: 'Noor drew the same dinosaur. Set what Noor meant, and set how it landed on you.',
        flip: 'and if you had done it?',
        actor: other('Noor'),
        receiver: you(),
      },
      turned: {
        key: 'turned',
        ask: 'Now the dinosaur on the other paper is the one you copied from Noor.',
        flip: 'back to how it happened',
        actor: you(),
        receiver: other('Noor'),
      },
    },
  },
  {
    id: 'tidy-up',
    title: 'The cleared table',
    picture: 'sel/meant-and-landed-tidy-up',
    alt: 'A kitchen table being cleared before dinner. An adult lifts a stack of loose paper toward a paper box while a boy stands at the table edge with one hand out.',
    caption: 'Dad cleared the table before dinner, and your half-made drawing went into the paper box.',
    sides: {
      front: {
        key: 'front',
        ask: 'The table got cleared. Set what Dad meant, and set how it landed on you.',
        flip: 'and if you had done it?',
        actor: other('Dad'),
        receiver: you(),
      },
      turned: {
        key: 'turned',
        ask: 'Now you are the one clearing the table, and the drawing in the box is Dad’s.',
        flip: 'back to how it happened',
        actor: you(),
        receiver: other('Dad'),
      },
    },
  },
  {
    id: 'shout-behind',
    title: 'The shout from behind',
    picture: 'sel/meant-and-landed-shout-behind',
    alt: 'A hallway at home. A small girl runs up close behind a boy with her arms up and her mouth wide open; the boy has stopped mid-step with his shoulders drawn in.',
    caption: 'Mia ran up behind you in the hallway and shouted as loud as she could.',
    sides: {
      front: {
        key: 'front',
        ask: 'Mia shouted. Set what Mia meant, and set how it landed on you.',
        flip: 'and if you had done it?',
        actor: other('Mia'),
        receiver: you(),
      },
      turned: {
        key: 'turned',
        ask: 'Now you are the one behind Mia, shouting as loud as you can.',
        flip: 'back to how it happened',
        actor: you(),
        receiver: other('Mia'),
      },
    },
  },
];

/* ---------------------------------------------------------------- the rail */

export const THOUGHTS: readonly Thought[] = [
  { id: 'joke', label: 'meant it as a joke', glyph: 'joke', phrase: 'meant it as a joke' },
  { id: 'help', label: 'meant to help', glyph: 'help', phrase: 'meant to help' },
  { id: 'win', label: 'meant to win', glyph: 'win', phrase: 'meant to win' },
  { id: 'back', label: 'wanted it back', glyph: 'back', phrase: 'wanted it back' },
  {
    id: 'unthinking',
    label: 'was not thinking',
    glyph: 'blank',
    phrase: 'was not thinking',
    whenActorIsYou: 'were not thinking',
  },
  {
    id: 'unseen',
    label: 'did not know they were there',
    glyph: 'hidden',
    phrase: 'did not know {them} was there',
    whenReceiverIsYou: 'did not know you were there',
  },
];

const LANDING_WORDS: readonly string[] = [
  'angry',
  'annoyed',
  'bored',
  'calm',
  'confident',
  'confused',
  'curious',
  'delighted',
  'disappointed',
  'embarrassed',
  'excited',
  'frustrated',
  'grateful',
  'happy',
  'hopeful',
  'jealous',
  'lonely',
  'loved',
  'nervous',
  'overwhelmed',
  'proud',
  'sad',
  'scared',
  'shy',
  'silly',
  'surprised',
  'tired',
  'worried',
];

export const LANDINGS: readonly Landing[] = LANDING_WORDS.map((word) => ({
  id: word,
  word,
  picture: `faces/${word}`,
  alt: `A painted portrait of a child whose face and shoulders look ${word}.`,
}));

/* --------------------------------------------------------------- sentences */

/** The clause that never changes, whatever the two rails hold. */
export const THIRD_CLAUSE = 'Both of those are true.';

export const SIDE_KEYS: readonly SideKey[] = ['front', 'turned'];

export const SIDE_LABEL: Readonly<Record<SideKey, string>> = {
  front: 'As it happened',
  turned: 'Turned around',
};

export const sideId = (momentId: string, key: SideKey): string => `${momentId}:${key}`;

export const sideOf = (moment: Moment, key: SideKey): Side => moment.sides[key];

export const thoughtById = (id: string | null): Thought | null =>
  THOUGHTS.find((t) => t.id === id) ?? null;

export const landingById = (id: string | null): Landing | null =>
  LANDINGS.find((l) => l.id === id) ?? null;

export const momentById = (id: string): Moment | null => MOMENTS.find((m) => m.id === id) ?? null;

/** "Ben meant it as a joke." — built from the actor only. */
export function meantClause(side: Side, thought: Thought): string {
  const template =
    (side.receiver.isYou ? thought.whenReceiverIsYou : undefined) ??
    (side.actor.isYou ? thought.whenActorIsYou : undefined) ??
    thought.phrase;
  return `${side.actor.subject} ${template.replace('{them}', side.receiver.subject)}.`;
}

/** "You felt embarrassed." — built from the receiver only. */
export function landedClause(side: Side, landing: Landing): string {
  return `${side.receiver.subject} felt ${landing.word}.`;
}

/**
 * The whole form. Both halves are supplied independently and no combination is
 * refused, reordered or commented on.
 */
export function assemble(
  side: Side,
  thought: Thought,
  landing: Landing,
): readonly [string, string, string] {
  return [meantClause(side, thought), landedClause(side, landing), THIRD_CLAUSE];
}

export const sentenceText = (clauses: readonly string[]): string => clauses.join(' ');

/* ---------------------------------------------------------------- coverage */

/** What he has set so far, for one side of one moment. */
export interface Pick {
  readonly thought: string | null;
  readonly landing: string | null;
}

export const EMPTY_PICK: Pick = { thought: null, landing: null };

export const TOTAL_SIDES = MOMENTS.length * SIDE_KEYS.length;

export const pickOf = (picks: Readonly<Record<string, Pick>>, key: string): Pick =>
  picks[key] ?? EMPTY_PICK;

export const isJoined = (pick: Pick): boolean => pick.thought !== null && pick.landing !== null;

/** How much of the paper he has walked over. Not a ratio of right to wrong. */
export function coverage(picks: Readonly<Record<string, Pick>>): { done: number; total: number } {
  let done = 0;
  for (const moment of MOMENTS) {
    for (const key of SIDE_KEYS) {
      if (isJoined(pickOf(picks, sideId(moment.id, key)))) done += 1;
    }
  }
  return { done, total: TOTAL_SIDES };
}

export const coverageReadout = (picks: Readonly<Record<string, Pick>>): string => {
  const { done, total } = coverage(picks);
  return `You have looked at ${done} of the ${total} sides.`;
};

/* ------------------------------------------------------------------- plate */

/** The lines under a kept plate: whichever sides have both rails set. */
export function plateLines(front: string | null, turned: string | null): readonly string[] {
  const lines: string[] = [];
  if (front) lines.push(`${SIDE_LABEL.front}: ${front}`);
  if (turned) lines.push(`${SIDE_LABEL.turned}: ${turned}`);
  return lines;
}

export const plateFilename = (moment: Moment): string => `${MEANT_AND_LANDED_META.id}-${moment.id}`;
