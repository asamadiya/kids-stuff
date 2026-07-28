/**
 * Before You Decide — a question rack.
 *
 * A situation is drawn with its meaning left open. Three wordless questions
 * can be spent to reveal facts; each fact shifts the reading. He may decide
 * at any moment, having spent none, one, two or three. Nothing about the
 * decision is judged, counted or corrected: the only number kept is how many
 * questions he asked before he decided, and afterwards the questions he did
 * not spend are turned face-up so he can see what was still available.
 *
 * Two of the five cases cannot be settled even after all three facts. That is
 * the point of them, not a gap in the writing.
 *
 * ONE CASE, ONE PICTURE.
 *
 * This module used to give every fact its own plate and caption them as the
 * same place — "The same carpet a few minutes earlier". They were not. The
 * tower case shipped three painted rooms: a blue/green/ochre checkerboard
 * carpet with untreated pale-wood blocks (setup), a grey-taupe flat-weave with
 * a coat rack, a glass garden door and blocks painted teal/terracotta/cream
 * (clock), and a mottled blue/brown carpet with a bookshelf (hand). Nothing in
 * the code connected the three files, so nothing could keep the claim true,
 * and a five-year-old comparing them learns that the words overrule the
 * picture.
 *
 * So `Fact` has no field that can hold a plate. The only plate id in the module
 * is `Case.setupPanelId`, it is a branded `PlateId` that only `plate()` makes,
 * and a test requires it to equal `<module>-<case>-setup`. "The same carpet" is
 * now true because there is exactly one carpet and the compiler will not let a
 * fact name a second one.
 *
 * The clock fact is a claim about TIME, which no second painting can carry, so
 * it is not a painting: the case owns a three-stop timeline and both the drawn
 * strip and the spoken sentence are derived from that one array.
 */

export const BEFORE_YOU_DECIDE_META = {
  id: 'before-you-decide',
  title: 'Before You Decide',
  eyebrow: 'The question rack',
  note: 'He spends questions to uncover facts, watches the picture change meaning, and decides whenever he likes.',
} as const;

/** The three questions on the rack, plus the mark used for a question left unspent. */
export type QuestionKind = 'eye' | 'clock' | 'hand';
export type ChipKind = QuestionKind | 'unasked';

/** What a fact does to the reading of the picture. Nothing here grades a decision. */
export type FactEffect = 'reverses' | 'unresolved' | 'supports';

/** The marks a decision can carry. Wordless, so the rack is operable without reading. */
export type GlyphId = 'point' | 'ask' | 'mend' | 'wait' | 'tell';

export interface Chip {
  readonly kind: ChipKind;
  /** Read aloud when the chip is tapped. */
  readonly label: string;
  /** A single stroked path, drawn in a 24 x 24 box. */
  readonly path: string;
}

/**
 * A plate id. Branded so that the only way to make one is `plate()`, and the
 * only field in this module typed as one is `Case.setupPanelId`. A fact cannot
 * name a picture because no fact has a field this type could go in.
 */
export type PlateId = string & { readonly __plate: unique symbol };

const plate = (id: string): PlateId => id as PlateId;

/**
 * A fact bought with a question.
 *
 * Deliberately has no plate, no alt and no image: a fact is a sentence about
 * the ONE picture the case already shows. The `clock` arm carries no sentence
 * at all — its text is derived from `Case.timeline`, which is also what the
 * timeline strip is drawn from, so the words and the drawing are one array.
 */
export type Fact =
  | {
    readonly kind: 'eye';
    /** The question in this case's own terms, read aloud before the fact. */
    readonly question: string;
    /** Stated flat, in the second person. No inference. */
    readonly fact: string;
    readonly effect: FactEffect;
  }
  | {
    readonly kind: 'hand';
    readonly question: string;
    readonly fact: string;
    readonly effect: FactEffect;
  }
  | {
    readonly kind: 'clock';
    readonly question: string;
    readonly effect: FactEffect;
  };

/** One stop on a case's timeline. Second person, past tense, no inference. */
export interface Stop {
  readonly says: string;
}

export interface Choice {
  readonly id: string;
  readonly glyph: GlyphId;
  /** For a grown-up to read aloud, and for the button's accessible name. */
  readonly label: string;
  /** World-state, past tense. Never a verdict. */
  readonly outcome: string;
}

export interface Case {
  readonly id: string;
  readonly title: string;
  /** The only picture in the case. Everything else is said or drawn over it. */
  readonly setupPanelId: PlateId;
  readonly setupAlt: string;
  /** Only what can be seen. */
  readonly setup: string;
  /** Exactly one fact per question kind. */
  readonly facts: readonly Fact[];
  /** Three stops in time order, earliest first. The clock fact reads these out. */
  readonly timeline: readonly [Stop, Stop, Stop];
  /** Which stop the picture is standing at. The strip marks this one. */
  readonly pictureAt: 0 | 1 | 2;
  readonly choices: readonly Choice[];
  /** Whether the three facts together say what happened. */
  readonly settles: boolean;
  /** Said after the unasked questions are turned over. */
  readonly closing: string;
}

export const QUESTION_KINDS: readonly QuestionKind[] = ['eye', 'clock', 'hand'];

export const CHIPS: readonly Chip[] = [
  {
    kind: 'eye',
    label: 'Did anyone see?',
    path: 'M2 12 C6 5 18 5 22 12 C18 19 6 19 2 12 Z M12 9 a3 3 0 1 0 0.01 0',
  },
  {
    kind: 'clock',
    label: 'When did it happen?',
    path: 'M12 3 a9 9 0 1 0 0.01 0 M12 7 L12 12 L16 14',
  },
  {
    kind: 'hand',
    label: 'What did the hands do?',
    path:
      'M8 21 L8 12 C8 10 10 10 10 12 L10 6 C10 4 12 4 12 6 L12 12 L12 7 C12 5 14 5 14 7 '
      + 'L14 12 L14 9 C14 7 16 7 16 9 L16 15 C16 19 14 21 12 21 Z',
  },
  {
    kind: 'unasked',
    label: 'A question you did not spend.',
    path: 'M5 3 h11 l3 3 v15 h-14 Z M16 3 v3 h3',
  },
];

export const GLYPHS: Readonly<Record<GlyphId, string>> = {
  point: 'M4 18 a3 3 0 1 0 0.01 0 M20 18 a3 3 0 1 0 0.01 0 M7 15 L17 15 M14 12 L17 15 L14 18',
  ask:
    'M5 18 a3 3 0 1 0 0.01 0 M19 18 a3 3 0 1 0 0.01 0 M6 13 C9 8 15 8 18 13 '
    + 'M6 13 L8.4 12.2 M6 13 L7 10.4 M18 13 L15.6 12.2 M18 13 L17 10.4',
  mend: 'M3 12 L9 12 M15 12 L21 12 M9 7 L9 17 M15 7 L15 17 M5 9 L8 12 L5 15 M19 9 L16 12 L19 15',
  wait: 'M7 3 h10 L12 12 L17 21 h-10 L12 12 Z',
  tell:
    'M6 21 v-6 a2.5 2.5 0 0 1 5 0 v6 M8.5 9 a2 2 0 1 0 0.01 0 '
    + 'M15 21 v-9 a3 3 0 0 1 6 0 v9 M18 5.5 a2.5 2.5 0 1 0 0.01 0',
};

const P = 'before-you-decide';

export const CASES: readonly Case[] = [
  {
    id: 'tower',
    title: 'The tower down',
    setupPanelId: plate(`${P}-tower-setup`),
    setupAlt: 'Your block tower lying knocked over on the classroom carpet, with a boy standing beside it holding one block.',
    setup: 'Your tower is down. A boy is standing next to it, holding one of your blocks.',
    timeline: [
      { says: 'You were over at the sink.' },
      { says: 'The tower came down.' },
      { says: 'He came in from the yard.' },
    ],
    pictureAt: 2,
    facts: [
      {
        kind: 'eye',
        question: 'Did anyone see the tower go down?',
        fact: 'The girl at the table was reading. She says she did not look up.',
        effect: 'unresolved',
      },
      {
        kind: 'clock',
        question: 'When did the tower come down?',
        effect: 'reverses',
      },
      {
        kind: 'hand',
        question: 'What did his hands do?',
        fact: 'He picked that block up off the floor. He was setting it back on the pile.',
        effect: 'supports',
      },
    ],
    choices: [
      {
        id: 'tower-point',
        glyph: 'point',
        label: 'You say he knocked it down.',
        outcome:
          'You said he knocked it down. He said he did not. He went to the other side of the carpet and built on his own for the rest of the morning.',
      },
      {
        id: 'tower-ask',
        glyph: 'ask',
        label: 'You ask him what happened.',
        outcome:
          'You asked him. He said he found the block by the door. He stayed and passed you the bottom row while you started again.',
      },
      {
        id: 'tower-mend',
        glyph: 'mend',
        label: 'You start building it again.',
        outcome:
          'You started stacking. He knelt down and handed you blocks without being asked. Neither of you said anything about the tower.',
      },
    ],
    settles: true,
    closing: 'The tower came down before he walked in, and his hands were putting a block back.',
  },
  {
    id: 'snack',
    title: 'The missing snack',
    setupPanelId: plate(`${P}-snack-setup`),
    setupAlt: 'Your own hands holding your school bag open at the peg rail, with other bags hanging along the rail behind it and boots under the bench.',
    setup: 'Your snack is not in your bag. Your bag is open.',
    timeline: [
      { says: 'At home your snack went into the bag.' },
      { says: 'You do not remember shutting it.' },
      { says: 'You got here and the bag was open.' },
    ],
    pictureAt: 2,
    facts: [
      {
        kind: 'eye',
        question: 'Did anyone see your bag?',
        fact: 'Two children were at the pegs before you. Neither of them was facing your bag.',
        effect: 'unresolved',
      },
      {
        kind: 'clock',
        question: 'When was your bag last shut?',
        effect: 'unresolved',
      },
      {
        kind: 'hand',
        question: 'What did the hands leave behind?',
        fact: 'There are crumbs under the shelf. They are not from your snack.',
        effect: 'reverses',
      },
    ],
    choices: [
      {
        id: 'snack-ask',
        glyph: 'ask',
        label: 'You ask the two children at the pegs.',
        outcome:
          'You asked them. One said he did not see. The other asked why you were asking him, and moved away. At lunch he sat at another table.',
      },
      {
        id: 'snack-tell',
        glyph: 'tell',
        label: 'You tell the teacher.',
        outcome:
          'You told the teacher. She wrote it on a card and said she would watch the pegs. Nothing else happened. You were hungry until home time.',
      },
      {
        id: 'snack-wait',
        glyph: 'wait',
        label: 'You say nothing and wait.',
        outcome:
          'You said nothing. Nobody mentioned it. The next day your bag was where you left it, with your snack still inside.',
      },
    ],
    settles: false,
    closing: 'The crumbs are not yours and nobody was facing your bag. You do not know where your snack went, and today you will not find out.',
  },
  {
    id: 'mia',
    title: 'Mia by your things',
    setupPanelId: plate(`${P}-mia-setup`),
    setupAlt: 'Seen from the doorway: Mia sitting on the rug crying with one arm out, beside your open box of small cars, with a car on the floor near her.',
    setup: 'Mia is crying. She is sitting beside your box of cars, and one car is on the floor.',
    timeline: [
      { says: 'Mia was standing by the low table.' },
      { says: 'She caught her knee and started crying.' },
      { says: 'She sat down beside your box of cars.' },
    ],
    pictureAt: 2,
    facts: [
      {
        kind: 'eye',
        question: 'Did anyone see her?',
        fact: 'Dad was at the sink. He heard a bump and then crying. He did not see it.',
        effect: 'unresolved',
      },
      {
        kind: 'clock',
        question: 'When did she start crying?',
        effect: 'reverses',
      },
      {
        kind: 'hand',
        question: 'What did her hands do?',
        fact: 'Her hands are empty. There is a red mark on her knee.',
        effect: 'supports',
      },
    ],
    choices: [
      {
        id: 'mia-ask',
        glyph: 'ask',
        label: 'You go over to her.',
        outcome:
          'You went to her. She held her arms up. You put the car back in the box and sat next to her, and after a while she stopped.',
      },
      {
        id: 'mia-point',
        glyph: 'point',
        label: 'You tell Dad she was in your things.',
        outcome:
          'You told Dad she was in your box. He looked at her knee, then at the box, and carried her to the sofa. Your cars stayed where they were.',
      },
      {
        id: 'mia-wait',
        glyph: 'wait',
        label: 'You keep doing what you were doing.',
        outcome:
          'You kept building. Dad came in and picked her up. Later the box was still closed and nobody said anything about it.',
      },
    ],
    settles: true,
    closing: 'She was already crying before she reached your things, and her knee is red where the table is.',
  },
  {
    id: 'hello',
    title: 'The friend at the gate',
    setupPanelId: plate(`${P}-hello-setup`),
    setupAlt: 'At the school gate, seen from behind two boys standing close together, one with a satchel and one with a bag over his shoulder, and families and children in the yard through the open gate.',
    setup: 'Your friend walked past you at the gate. He did not say hello.',
    timeline: [
      { says: 'He was away all last week.' },
      { says: 'This morning he came in late.' },
      { says: 'He walked past you at the gate.' },
    ],
    pictureAt: 2,
    facts: [
      {
        kind: 'eye',
        question: 'Did he look your way?',
        fact: 'His mum was walking fast and holding his hand. His head was turned to keep up with her.',
        effect: 'reverses',
      },
      {
        kind: 'clock',
        question: 'When did he arrive?',
        effect: 'unresolved',
      },
      {
        kind: 'hand',
        question: 'What were his hands doing?',
        fact: 'Both his arms were around a big box. His chin was on top of it.',
        effect: 'reverses',
      },
    ],
    choices: [
      {
        id: 'hello-ask',
        glyph: 'ask',
        label: 'You go after him and ask.',
        outcome:
          'You went after him. He said "not now" and kept walking with his mum. You stood at the gate and watched them go in.',
      },
      {
        id: 'hello-wait',
        glyph: 'wait',
        label: 'You go into class.',
        outcome:
          'You went in. At the carpet he sat down next to you and asked whether you had seen his box. He said nothing about the gate.',
      },
      {
        id: 'hello-tell',
        glyph: 'tell',
        label: 'You tell your teacher he walked past you.',
        outcome:
          'You told your teacher. She said she would keep an eye out. At playtime he came over and asked you why she had spoken to him.',
      },
    ],
    settles: false,
    closing: 'His arms were full and his mum was pulling him along. He may not have seen you. He may have seen you. You cannot tell from here.',
  },
  {
    id: 'broken',
    title: 'The broken thing at the play date',
    setupPanelId: plate(`${P}-broken-setup`),
    setupAlt: 'Seen from the doorway with your own hand on the door: a wooden aeroplane lying in two pieces on a bedroom floor, another boy standing beyond it looking at you, and a girl at the edge of the frame.',
    setup: 'A wooden aeroplane is on the floor in two pieces. The other boy is looking at you.',
    timeline: [
      { says: 'The aeroplane came off the loose shelf.' },
      { says: 'The two pieces were on the floor.' },
      { says: 'You came up the stairs.' },
    ],
    pictureAt: 2,
    facts: [
      {
        kind: 'eye',
        question: 'Did anyone see it fall?',
        fact: 'His big sister says the shelf is loose. Things have slid off it before.',
        effect: 'reverses',
      },
      {
        kind: 'clock',
        question: 'When did it break?',
        effect: 'reverses',
      },
      {
        kind: 'hand',
        question: 'What are his hands doing?',
        fact: 'His hands are behind his back. You cannot see them.',
        effect: 'unresolved',
      },
    ],
    choices: [
      {
        id: 'broken-point',
        glyph: 'point',
        label: 'You say he broke it.',
        outcome:
          'You said he broke it. He said you did. His mum came in, looked at the shelf, and put the pieces on the table. You played in separate rooms after that.',
      },
      {
        id: 'broken-ask',
        glyph: 'ask',
        label: 'You ask him what happened.',
        outcome:
          'You asked. He said it was like that when he came in. You both looked up at the shelf, and then his mum called you down for juice.',
      },
      {
        id: 'broken-mend',
        glyph: 'mend',
        label: 'You pick up the two pieces.',
        outcome:
          'You picked up both pieces and put them on the table. His mum said thank you and put them in a drawer. Nobody said how it broke.',
      },
    ],
    settles: true,
    closing: 'The pieces were already on the floor when you came up, and the shelf above them is loose.',
  },
];

/* ------------------------------------------------------------- helpers -- */

export const chipFor = (kind: ChipKind): Chip => {
  const chip = CHIPS.find((c) => c.kind === kind);
  if (!chip) throw new Error(`no chip for ${kind}`);
  return chip;
};

export const caseAt = (index: number): Case => CASES[((index % CASES.length) + CASES.length) % CASES.length];

export const caseById = (id: string): Case | undefined => CASES.find((c) => c.id === id);

export const factFor = (subject: Case, kind: QuestionKind): Fact => {
  const fact = subject.facts.find((f) => f.kind === kind);
  if (!fact) throw new Error(`${subject.id} has no ${kind} fact`);
  return fact;
};

/* ------------------------------------------------------------ the timeline -- */

/**
 * What the clock question buys, read aloud. Derived from `Case.timeline`, which
 * is the same array `timelineMarks` draws, so the sentence and the strip cannot
 * come apart. There is no stored clock sentence to disagree with.
 */
export const clockLine = (subject: Case): string =>
  subject.timeline
    .map((stop, i) => (i === subject.pictureAt ? `${stop.says} That is what the picture shows.` : stop.says))
    .join(' ');

/** The sentence a fact says. Only the clock arm is derived; the rest are stated. */
export const factText = (subject: Case, fact: Fact): string =>
  fact.kind === 'clock' ? clockLine(subject) : fact.fact;

export interface Mark {
  readonly says: string;
  /** Along the strip, 0 at the left end and 1 at the right. */
  readonly at: number;
  /** True for the stop the picture is standing at. */
  readonly isPicture: boolean;
}

/** Geometry for the drawn timeline. Pure, so the strip is tested, not eyeballed. */
export const timelineMarks = (subject: Case): readonly Mark[] =>
  subject.timeline.map((stop, i) => ({
    says: stop.says,
    at: i / (subject.timeline.length - 1),
    isPicture: i === subject.pictureAt,
  }));

/** The facts already paid for, in the order the questions were spent. */
export const askedFacts = (subject: Case, asked: readonly QuestionKind[]): readonly Fact[] =>
  asked.map((kind) => factFor(subject, kind));

/** The questions still on the rack, always in rack order. */
export const unaskedKinds = (asked: readonly QuestionKind[]): readonly QuestionKind[] =>
  QUESTION_KINDS.filter((kind) => !asked.includes(kind));

/** The facts turned face-up after a decision. Shown as still available, never as a rebuke. */
export const unaskedFacts = (subject: Case, asked: readonly QuestionKind[]): readonly Fact[] =>
  unaskedKinds(asked).map((kind) => factFor(subject, kind));

const NOT_ASKED: Readonly<Record<QuestionKind, string>> = {
  eye: 'You did not ask whether anyone saw.',
  clock: 'You did not ask when it happened.',
  hand: 'You did not ask what the hands did.',
};

export const unaskedLine = (kind: QuestionKind): string => NOT_ASKED[kind];

export interface Standing {
  /** Questions spent in the case now open. */
  readonly asked: number;
  /** Whether the case now open has been decided. */
  readonly decided: boolean;
  /** How many of the cases have been decided at least once. */
  readonly cases: number;
}

/**
 * A measurement, never a ratio of right to wrong: how many questions were
 * spent, and how much of the rack has been walked.
 */
export const readout = (standing: Standing): string => {
  const spent = standing.decided
    ? `You asked ${standing.asked} of ${QUESTION_KINDS.length} before you decided.`
    : `You have asked ${standing.asked} of ${QUESTION_KINDS.length}.`;
  return `${spent} ${standing.cases} of ${CASES.length} cases decided.`;
};

/** What the guide says once the unasked questions are face-up. */
export const closingLine = (subject: Case): string =>
  subject.settles ? subject.closing : `${subject.closing} You still do not know.`;

export interface Decided {
  readonly caseId: string;
  readonly caseTitle: string;
  readonly asked: readonly QuestionKind[];
  readonly choiceId: string;
  readonly choiceLabel: string;
  readonly glyph: GlyphId;
}

/** Distinct cases decided, so a second run over the same case does not inflate coverage. */
export const casesDecided = (records: readonly Decided[]): number =>
  new Set(records.map((r) => r.caseId)).size;

export const totalAsked = (records: readonly Decided[]): number =>
  records.reduce((sum, r) => sum + r.asked.length, 0);

/** Caption lines for the plate. Counts of questions, and what was done. Nothing scored. */
export const plateLines = (records: readonly Decided[]): readonly string[] => {
  if (records.length === 0) return ['No cases decided yet.'];
  const rows = records.slice(-8).map(
    (r) => `${r.caseTitle}: asked ${r.asked.length} of ${QUESTION_KINDS.length}. ${r.choiceLabel}`,
  );
  const possible = records.length * QUESTION_KINDS.length;
  return [
    ...rows,
    `${records.length} decisions. ${totalAsked(records)} questions asked of ${possible} on the rack.`,
  ];
};

export interface SheetRow {
  readonly title: string;
  readonly marks: readonly boolean[];
  readonly glyph: GlyphId;
  readonly y: number;
}

export const SHEET = { width: 640, top: 58, rowHeight: 42, foot: 34 } as const;

/** Geometry for the summary drawing that becomes the plate. Pure, so it can be tested. */
export const sheetRows = (records: readonly Decided[]): readonly SheetRow[] =>
  records.slice(-8).map((r, i) => ({
    title: r.caseTitle,
    marks: QUESTION_KINDS.map((kind) => r.asked.includes(kind)),
    glyph: r.glyph,
    y: SHEET.top + i * SHEET.rowHeight,
  }));

export const sheetHeight = (records: readonly Decided[]): number =>
  SHEET.top + Math.max(1, Math.min(records.length, 8)) * SHEET.rowHeight + SHEET.foot;
