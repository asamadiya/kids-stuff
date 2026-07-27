/**
 * Borrowed Eyes — one second of the world, drawn twice.
 *
 * Each moment is rendered from two positions: the child's own, and the
 * position of the other person who was there. The two renders differ in what
 * is VISIBLE — eye height, what is occluded, what stands behind the first
 * camera — not merely in camera angle. Both renders are true at the same time.
 * There is no primary view, and the six intent chips have no key: the child
 * places one chip per position, the tool sets the two readings side by side,
 * and never reconciles them.
 *
 * Pure: no React, no DOM, no randomness, no storage.
 */

export const BORROWED_EYES_META = {
  id: 'borrowed-eyes',
  title: 'Borrowed Eyes',
  eyebrow: 'The same second',
  note: 'Turn the dial to see one moment from where the other person stood, and put a chip on each position.',
} as const;

/** The repository writes these concatenated; both names point at one object. */
export const BORROWEDEYES_META = BORROWED_EYES_META;

/* ------------------------------------------------------------------ chips -- */

export const CHIP_IDS = ['join', 'help', 'own', 'unseen', 'hurry', 'copy'] as const;
export type ChipId = (typeof CHIP_IDS)[number];

/**
 * A wordless chip. `word` exists only so a grown-up can read it aloud; the
 * chip is drawn, and the exercise is operable while ignoring every word here.
 * Both strings are fragments completed with the moment's other person:
 * `{self}` takes that person's reflexive pronoun.
 */
export interface Chip {
  readonly id: ChipId;
  readonly word: string;
  readonly clause: string;
}

export const CHIPS: readonly Chip[] = [
  { id: 'join', word: 'wanted to join', clause: 'wanted to join in' },
  { id: 'help', word: 'wanted to help', clause: 'wanted to help' },
  { id: 'own', word: 'wanted it for {self}', clause: 'wanted it for {self}' },
  { id: 'unseen', word: 'did not see', clause: 'did not see' },
  { id: 'hurry', word: 'was in a hurry', clause: 'was in a hurry' },
  { id: 'copy', word: 'was copying you', clause: 'was copying you' },
];

export function chipById(id: ChipId): Chip {
  const chip = CHIPS.find((c) => c.id === id);
  if (!chip) throw new Error(`no chip ${id}`);
  return chip;
}

/* ---------------------------------------------------------------- moments -- */

/** The other person in the moment. Pronouns are carried, never inferred. */
export interface Other {
  readonly name: string;
  readonly pronoun: string;
  readonly reflexive: string;
}

/** One position the moment can be seen from. */
export interface View {
  /** Stable within a moment; `yours` is the child's own position. */
  readonly id: string;
  /** Read aloud on the dial: whose position this is. */
  readonly whose: string;
  /** Opening of every sentence written from here. */
  readonly from: string;
  /** World-state seen from here, past tense, no gloss. */
  readonly said: string;
  /** Spoken when the dial lands here: what is visible from this position. */
  readonly sees: string;
  /** Eye height and body, so the re-render is legible as a position. */
  readonly eyeLine: string;
  /** games/sel/<imageId>.png */
  readonly imageId: string;
  readonly alt: string;
}

export interface Moment {
  readonly id: string;
  readonly title: string;
  readonly where: string;
  readonly other: Other;
  /** Two positions today; the shape takes three. Order is fixed and meaningful. */
  readonly views: readonly View[];
  /** True when the pair is drawn so that neither position settles it. */
  readonly unresolved: boolean;
}

export const MOMENTS: readonly Moment[] = [
  {
    id: 'crayon',
    title: 'The crayon on the drawing',
    where: 'the kitchen table, after lunch',
    other: { name: 'Mia', pronoun: 'she', reflexive: 'herself' },
    unresolved: false,
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you sat',
        said: 'a purple line came across your dinosaur',
        sees: 'From here you can see your own paper, your hand holding the green crayon, and a purple line coming across the dinosaur you drew.',
        eyeLine: 'sitting up at the table, looking straight down at your paper',
        imageId: 'borrowed-eyes-crayon-yours',
        alt: 'Seen from Leo’s own place at the table: his hand holding a green crayon over his dinosaur drawing, and a small hand reaching in from the left drawing a purple line across the page.',
      },
      {
        id: 'mia',
        whose: 'Mia’s eyes',
        from: 'From where Mia stood',
        said: 'she was drawing on the same page as her big brother',
        sees: 'From here the table edge is up by your chin, your brother is a long way above you, and the paper is the only thing you can reach.',
        eyeLine: 'standing on tiptoe, chin level with the table edge',
        imageId: 'borrowed-eyes-crayon-mia',
        alt: 'Seen from Mia’s height at the table edge: the tabletop nearly at eye level, her purple crayon on the big sheet of paper, and her brother’s shoulder and chin high above her.',
      },
    ],
  },
  {
    id: 'tower',
    title: 'The hand on the tower',
    where: 'the living room rug, late afternoon',
    other: { name: 'Mia', pronoun: 'she', reflexive: 'herself' },
    unresolved: false,
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you stood',
        said: 'her hand came down on the roof',
        sees: 'From here you can see the whole tower finished, the last block on top, and her hand coming down on the roof.',
        eyeLine: 'standing up, looking down on the finished tower',
        imageId: 'borrowed-eyes-tower-yours',
        alt: 'Seen from Leo’s standing height: a finished block tower on the rug with the last block on top, and Mia’s hand coming down onto the roof of it.',
      },
      {
        id: 'mia',
        whose: 'Mia’s eyes',
        from: 'From where Mia stood',
        said: 'she was putting a piece on',
        sees: 'From here the tower is taller than you are, your brother’s back is turned, and there is one loose block in your hand.',
        eyeLine: 'kneeling on the rug, the tower rising past your head',
        imageId: 'borrowed-eyes-tower-mia',
        alt: 'Seen from Mia’s kneeling height on the rug: the block tower rising far above her, a loose block held in her near hand, and her brother’s back turned to her beyond it.',
      },
    ],
  },
  {
    id: 'story',
    title: 'The middle of the story',
    where: 'the bedroom chair, bedtime',
    other: { name: 'Dad', pronoun: 'he', reflexive: 'himself' },
    unresolved: true,
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you sat',
        said: 'the book closed in the middle of the page',
        sees: 'From here you can see the page you were on, Dad’s thumb leaving the paper, and the doorway going empty.',
        eyeLine: 'sitting in the crook of the chair, the book across both your knees',
        imageId: 'borrowed-eyes-story-yours',
        alt: 'Seen from Leo’s place in the reading chair: an open picture book across his knees, his father’s hand lifting off the page, and the lit doorway beyond them.',
      },
      {
        id: 'dad',
        whose: 'Dad’s eyes',
        from: 'From where Dad stood',
        said: 'one child was crying in the next room',
        sees: 'From here you can see the boy still holding the book open, and past the door, the small one standing up in the dark, crying.',
        eyeLine: 'standing in the doorway, a head above the chair, turned two ways at once',
        imageId: 'borrowed-eyes-story-dad',
        alt: 'Seen from the father’s standing height in the doorway: Leo below him holding the open book, and through the door a dim room where Mia stands up in her cot, crying.',
      },
    ],
  },
  {
    id: 'circle',
    title: 'The one outside the circle',
    where: 'the school carpet, before lunch',
    other: { name: 'Nell', pronoun: 'she', reflexive: 'herself' },
    unresolved: true,
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you sat',
        said: 'she stood by the shelf and did not come over',
        sees: 'From here you can see four of you sitting close in the ring, the game between your knees, and one girl standing back by the shelf.',
        eyeLine: 'sitting cross-legged inside the ring, shoulder to shoulder',
        imageId: 'borrowed-eyes-circle-yours',
        alt: 'Seen from Leo’s place inside a ring of seated children on a classroom carpet: the game board between their knees, and a girl standing some steps away beside a shelf.',
      },
      {
        id: 'nell',
        whose: 'Nell’s eyes',
        from: 'From where Nell stood',
        said: 'the ring had no gap in it',
        sees: 'From here you can see a closed ring of backs, the game hidden behind them, and the carpet edge under your shoes.',
        eyeLine: 'standing a few steps back, looking at the backs of four heads',
        imageId: 'borrowed-eyes-circle-nell',
        alt: 'Seen from Nell’s standing height a few steps back: four children’s backs closing a ring on the carpet, the game hidden behind them, and the edge of the carpet at her shoes.',
      },
    ],
  },
  {
    id: 'queue',
    title: 'The cut in the queue',
    where: 'the steps of the slide, the park',
    other: { name: 'Sam', pronoun: 'he', reflexive: 'himself' },
    unresolved: true,
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you stood',
        said: 'he stepped in on the step in front of you',
        sees: 'From here you can see the ladder going up, your hand on the rail, and a boy coming in on the step above you.',
        eyeLine: 'standing second on the ladder, hand on the rail',
        imageId: 'borrowed-eyes-queue-yours',
        alt: 'Seen from Leo’s place on the slide ladder: his hand on the metal rail, the steps rising ahead of him, and a boy stepping in onto the step just above him.',
      },
      {
        id: 'sam',
        whose: 'Sam’s eyes',
        from: 'From where Sam stood',
        said: 'his little brother was already on the step and reaching back for him',
        sees: 'From here you can see a small boy already up on the step, both his arms out towards you, and the queue behind you out of sight.',
        eyeLine: 'stepping up sideways, looking at a smaller child above you',
        imageId: 'borrowed-eyes-queue-sam',
        alt: 'Seen from Sam’s height on the slide ladder: a much smaller boy already standing on the step above with both arms reaching back towards him, the rail in the near foreground.',
      },
    ],
  },
];

export function momentById(id: string): Moment {
  const moment = MOMENTS.find((m) => m.id === id);
  if (!moment) throw new Error(`no moment ${id}`);
  return moment;
}

/* --------------------------------------------------------------- readings -- */

/** The world-state sentence for a position. Nothing here judges. */
export function sentenceFor(view: View): string {
  return `${view.from}, ${view.said}.`;
}

/** Both sentences, always in the order the moment carries them. */
export function bothSentences(moment: Moment): string[] {
  return moment.views.map(sentenceFor);
}

/** `she wanted it for herself`, `he was in a hurry`. */
export function chipClause(chip: Chip, other: Other): string {
  return `${other.pronoun} ${chip.clause.replace('{self}', other.reflexive)}`;
}

/** The tray label for a chip in this moment: `wanted it for herself`. */
export function chipWord(chip: Chip, other: Other): string {
  return chip.word.replace('{self}', other.reflexive);
}

/** The chip reading for one position. No chip is ever the real reason. */
export function readingFor(moment: Moment, view: View, chip: Chip): string {
  return `${view.from}, ${chipClause(chip, moment.other)}.`;
}

/* --------------------------------------------------------------- coverage -- */

/** Where a chip is placed: one slot per position, across every moment. */
export type Placed = Readonly<Record<string, ChipId>>;

export const slotKey = (momentId: string, viewId: string): string => `${momentId}/${viewId}`;

/** Every position in the section, in order. */
export function allSlots(moments: readonly Moment[] = MOMENTS): string[] {
  return moments.flatMap((m) => m.views.map((v) => slotKey(m.id, v.id)));
}

/** How many of the positions have been stood in. Never a ratio of right to wrong. */
export function coveredCount(placed: Placed, moments: readonly Moment[] = MOMENTS): number {
  return allSlots(moments).filter((s) => placed[s] !== undefined).length;
}

export function chipAt(placed: Placed, momentId: string, viewId: string): ChipId | null {
  return placed[slotKey(momentId, viewId)] ?? null;
}

export function momentComplete(moment: Moment, placed: Placed): boolean {
  return moment.views.every((v) => chipAt(placed, moment.id, v.id) !== null);
}

/** The coverage readout. Plain counting, no score. */
export function coverageLine(placed: Placed, moments: readonly Moment[] = MOMENTS): string {
  const total = allSlots(moments).length;
  return `you have stood in ${coveredCount(placed, moments)} of the ${total} positions`;
}

/* ----------------------------------------------------------------- plates -- */

/** A two-view plate, as kept in the drawer. */
export interface PlateChip {
  readonly viewId: string;
  readonly chip: ChipId;
}

/** Caption lines for the exported plate: both sentences, then both chips. */
export function plateLines(moment: Moment, placed: Placed): string[] {
  const lines = bothSentences(moment);
  for (const view of moment.views) {
    const id = chipAt(placed, moment.id, view.id);
    if (id) lines.push(readingFor(moment, view, chipById(id)));
  }
  return lines;
}

/** The chips of a moment, in view order, for keeping. */
export function plateChips(moment: Moment, placed: Placed): PlateChip[] {
  const out: PlateChip[] = [];
  for (const view of moment.views) {
    const id = chipAt(placed, moment.id, view.id);
    if (id) out.push({ viewId: view.id, chip: id });
  }
  return out;
}

/** The chip kept for a position on an earlier run, if there was one. */
export function earlierChip(chips: readonly PlateChip[], viewId: string): ChipId | null {
  return chips.find((c) => c.viewId === viewId)?.chip ?? null;
}

/* ------------------------------------------------------------------- dial -- */

/** Turning the dial wraps, so the moment can be crossed back and forth. */
export function nextNotch(notch: number, count: number): number {
  return count <= 0 ? 0 : (notch + 1) % count;
}

/** The angle of the dial pointer for a notch, in degrees, symmetric about 0. */
export function notchAngle(notch: number, count: number): number {
  if (count <= 1) return 0;
  const span = 96;
  return -span / 2 + (span * notch) / (count - 1);
}

/* ------------------------------------------------------------- typography -- */

/** Break a sentence into lines of at most `max` characters, for the plate. */
export function wrapWords(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = word;
    else if (line.length + 1 + word.length <= max) line = `${line} ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
