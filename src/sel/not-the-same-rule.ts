/**
 * Not the Same Rule.
 *
 * A deck of rule cards from his own life is sorted into two columns of his
 * own making: the same for everyone, and different for a reason. There is no
 * key. Each card carries, on its reverse, the reason a grown-up gave and the
 * column that grown-up would have used — recorded as one person's placement
 * beside another's, never as an answer. Where his complaint about his little
 * sister is logically sound on his own premises, the reverse concedes it
 * first and only then explains.
 *
 * Nothing here scores him. The one number the exercise states is how many
 * cards the two people put in different columns, said once as a fact about
 * two people, then dropped.
 */

export const NOT_THE_SAME_RULE_META = {
  id: 'not-the-same-rule',
  title: 'Not the Same Rule',
  eyebrow: 'Same and fair',
  note: 'He sorts rule cards into two columns of his own, turns them over to read the reason a grown-up gave, then builds one rule for a place he cares about.',
} as const;

/* ------------------------------------------------------------- the columns */

export type ColumnId = 'everyone' | 'reasoned';

export interface Column {
  readonly id: ColumnId;
  /** Heading over the column. */
  readonly label: string;
  /** How the column is named inside a sentence. */
  readonly inline: string;
  /** Read aloud when the column is offered. */
  readonly note: string;
}

export const COLUMNS: readonly Column[] = [
  {
    id: 'everyone',
    label: 'The same for everyone',
    inline: 'the same for everyone',
    note: 'This one is the same for everyone.',
  },
  {
    id: 'reasoned',
    label: 'Different, for a reason',
    inline: 'different, for a reason',
    note: 'This one is different for somebody, and there is a reason.',
  },
] as const;

export const columnById = (id: ColumnId): Column =>
  COLUMNS.find((c) => c.id === id) ?? COLUMNS[0];

/* --------------------------------------------------------------- the cards */

export interface RuleCard {
  /** Also the image id: public/games/sel/<id>.png */
  readonly id: string;
  /** The rule, in the words it would be said in. Read aloud on pick-up. */
  readonly front: string;
  /** Two or three words for the printed key. */
  readonly short: string;
  /** A real description of the picture. */
  readonly alt: string;
  /** Which column a grown-up used. One person's placement, not a key. */
  readonly grownUpColumn: ColumnId;
  /** The reason a grown-up gave, printed on the reverse. */
  readonly reverse: string;
  /** True where the rule is genuinely arguable and the reverse says so. */
  readonly arguable: boolean;
  /** True where the reverse concedes his grievance before explaining it. */
  readonly concedes: boolean;
}

export const RULE_CARDS: readonly RuleCard[] = [
  {
    id: 'not-the-same-rule-mia-hands',
    front: 'Mia eats with her hands.',
    short: "Mia's hands",
    alt: 'A two-year-old in a high chair pushing pasta into her mouth with her fist while her brother sits beside her holding a fork.',
    grownUpColumn: 'reasoned',
    reverse:
      'You are right that this is not the same rule. Mia is two. Her fingers cannot hold a fork steady yet. When they can, she will be asked to use one, the way you were.',
    arguable: false,
    concedes: true,
  },
  {
    id: 'not-the-same-rule-mia-spill',
    front: 'Mia is not told off when she spills.',
    short: "Mia's spill",
    alt: 'A tipped beaker spreading milk across a kitchen table, the two-year-old watching it, her brother already reaching for the cloth.',
    grownUpColumn: 'reasoned',
    reverse:
      'You are right that you get asked to clean up and she does not. She is two and cannot see the cup coming before it goes. You could see it coming at three. That is the whole of the reason.',
    arguable: false,
    concedes: true,
  },
  {
    id: 'not-the-same-rule-tablet-longer',
    front: 'You get the tablet for longer than Mia.',
    short: 'Tablet time',
    alt: 'A boy on a sofa with a tablet on his knees and a kitchen timer beside him, his little sister watching from the rug.',
    grownUpColumn: 'reasoned',
    reverse:
      'You are right that this one is not the same either. This one runs your way. A grown-up decided that twenty minutes is a long time for a two-year-old and a short time for you. Some families set one timer for both.',
    arguable: true,
    concedes: true,
  },
  {
    id: 'not-the-same-rule-helmets',
    front: 'Everyone wears a helmet on a bike.',
    short: 'Helmets',
    alt: 'A father and his son at the end of a driveway, both fastening bicycle helmet straps under their chins.',
    grownUpColumn: 'everyone',
    reverse:
      'Every head on a bike is the same kind of head. Nobody in this family rides without one, grown-ups included.',
    arguable: false,
    concedes: false,
  },
  {
    id: 'not-the-same-rule-pool-running',
    front: 'Nobody runs by the pool.',
    short: 'By the pool',
    alt: 'Wet tiles at the edge of a swimming pool, children walking along them with careful flat feet, an attendant watching.',
    grownUpColumn: 'everyone',
    reverse:
      'Wet tile is slippery under every size of foot. Nobody runs here, at any age, on any day.',
    arguable: false,
    concedes: false,
  },
  {
    id: 'not-the-same-rule-shoes-off',
    front: 'Shoes come off inside this house.',
    short: 'Shoes off',
    alt: 'A row of small and large shoes lined up on a mat inside a front door, a boy in socks stepping past them.',
    grownUpColumn: 'reasoned',
    reverse:
      'This house keeps the floor clean for a baby who crawls on it. Some houses do this the other way and keep shoes on all the way through.',
    arguable: true,
    concedes: false,
  },
] as const;

export const cardById = (id: string): RuleCard | undefined =>
  RULE_CARDS.find((c) => c.id === id);

/* ------------------------------------------------------------- the sorting */

/** cardId -> the column he put it in. Absent means still in the rack. */
export type Placements = Readonly<Record<string, ColumnId>>;

export const place = (placements: Placements, cardId: string, column: ColumnId): Placements =>
  cardById(cardId) ? { ...placements, [cardId]: column } : placements;

export const unplace = (placements: Placements, cardId: string): Placements => {
  const next = { ...placements };
  delete next[cardId];
  return next;
};

/** Cards still face up in the rack, in deck order. */
export const rackCards = (placements: Placements): readonly RuleCard[] =>
  RULE_CARDS.filter((c) => !(c.id in placements));

/** Cards he put in one column, in deck order. */
export const cardsIn = (placements: Placements, column: ColumnId): readonly RuleCard[] =>
  RULE_CARDS.filter((c) => placements[c.id] === column);

export const sortedCount = (placements: Placements): number =>
  RULE_CARDS.filter((c) => c.id in placements).length;

export const rackEmpty = (placements: Placements): boolean =>
  sortedCount(placements) === RULE_CARDS.length;

/**
 * How many cards the two people put in different columns. A count of
 * divergence between two keys, not a count of mistakes in one of them.
 */
export const divergences = (placements: Placements): number =>
  RULE_CARDS.filter((c) => c.id in placements && placements[c.id] !== c.grownUpColumn).length;

const WORDS = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'] as const;

const word = (n: number): string => WORDS[n] ?? String(n);

/** Said once when the rack empties, then dropped. */
export const divergenceLine = (placements: Placements): string => {
  const n = divergences(placements);
  if (n === 0) return 'You put every card in the same column the grown-up did.';
  if (n === 1) return 'One of these you put in a different column than the grown-up did.';
  return `${word(n)} of these you put in a different column than the grown-up did.`;
};

export const KEY_STANDS = 'Your key is your key.';

/**
 * What is said when a placed card is turned over. His column is restated
 * first, the reason follows, and the card stays where he put it.
 */
export const reverseLine = (card: RuleCard, column: ColumnId): string =>
  `You put "${card.front}" in the ${columnById(column).inline} column. The reason on the back says: ${card.reverse} Your column stands.`;

/* ------------------------------------------------------- the rule he builds */

export type SlotId = 'place' | 'who' | 'what' | 'when' | 'ifnot';

/** A geometric mark, drawn as a hairline glyph beside the chip. */
export type ChipMark = 'ring' | 'dot' | 'bar' | 'square' | 'cross' | 'chevron' | 'arc' | 'line';

export interface Slot {
  readonly id: SlotId;
  /** The tray label above the row of chips. */
  readonly label: string;
  /** Read aloud when the row is reached. */
  readonly ask: string;
}

export const SLOTS: readonly Slot[] = [
  { id: 'place', label: 'Where', ask: 'Where is this rule for?' },
  { id: 'who', label: 'Who', ask: 'Who does it hold for?' },
  { id: 'what', label: 'What', ask: 'What must happen?' },
  { id: 'when', label: 'When', ask: 'When does it hold?' },
  { id: 'ifnot', label: 'What happens if', ask: 'What happens if it does not?' },
] as const;

export interface Chip {
  readonly id: string;
  readonly slot: SlotId;
  /** Short text on the chip. */
  readonly label: string;
  /** How it reads inside the rule. */
  readonly phrase: string;
  readonly mark: ChipMark;
}

export const CHIPS: readonly Chip[] = [
  { id: 'place-blocks', slot: 'place', label: 'The block corner', phrase: 'the block corner', mark: 'square' },
  { id: 'place-tablet', slot: 'place', label: 'The tablet', phrase: 'the tablet', mark: 'bar' },
  { id: 'place-door', slot: 'place', label: 'My bedroom door', phrase: 'my bedroom door', mark: 'line' },

  { id: 'who-everyone', slot: 'who', label: 'Everyone', phrase: 'everyone', mark: 'ring' },
  { id: 'who-grownups', slot: 'who', label: 'Grown-ups too', phrase: 'everyone, grown-ups too,', mark: 'dot' },
  { id: 'who-not-mia', slot: 'who', label: 'Everyone except Mia', phrase: 'everyone except Mia', mark: 'arc' },

  { id: 'what-ask', slot: 'what', label: 'Must ask first', phrase: 'must ask me first', mark: 'chevron' },
  { id: 'what-keep', slot: 'what', label: 'May not move a build', phrase: 'may not move a finished build', mark: 'cross' },
  { id: 'what-turn', slot: 'what', label: 'Takes a turn, then passes', phrase: 'takes a turn and passes it on', mark: 'ring' },

  { id: 'when-any', slot: 'when', label: 'At any time', phrase: 'at any time', mark: 'line' },
  { id: 'when-timer', slot: 'when', label: 'After the timer', phrase: 'after the timer goes', mark: 'arc' },
  { id: 'when-done', slot: 'when', label: 'Until I say it is done', phrase: 'until I say it is done', mark: 'bar' },

  { id: 'ifnot-back', slot: 'ifnot', label: 'We put it back', phrase: 'we put it back the way it was', mark: 'square' },
  { id: 'ifnot-stop', slot: 'ifnot', label: 'It stops for the day', phrase: 'it stops for the day', mark: 'cross' },
  { id: 'ifnot-say', slot: 'ifnot', label: 'We say what happened', phrase: 'we say out loud what happened', mark: 'dot' },
] as const;

export const chipsFor = (slot: SlotId): readonly Chip[] => CHIPS.filter((c) => c.slot === slot);

export const chipById = (id: string): Chip | undefined => CHIPS.find((c) => c.id === id);

/** slotId -> chosen chip id. */
export type Picks = Readonly<Partial<Record<SlotId, string>>>;

export const pickChip = (picks: Picks, chipId: string): Picks => {
  const chip = chipById(chipId);
  if (!chip) return picks;
  if (picks[chip.slot] === chipId) {
    const next = { ...picks };
    delete next[chip.slot];
    return next;
  }
  return { ...picks, [chip.slot]: chipId };
};

export const picksComplete = (picks: Picks): boolean =>
  SLOTS.every((s) => Boolean(picks[s.id] && chipById(picks[s.id] as string)));

export const picksSet = (picks: Picks): number =>
  SLOTS.filter((s) => Boolean(picks[s.id] && chipById(picks[s.id] as string))).length;

const phrase = (picks: Picks, slot: SlotId): string | null => {
  const id = picks[slot];
  const chip = id ? chipById(id) : undefined;
  return chip ? chip.phrase : null;
};

/** The rule as one sentence. Null until every slot holds a chip. */
export const ruleSentence = (picks: Picks): string | null => {
  if (!picksComplete(picks)) return null;
  const where = phrase(picks, 'place') as string;
  const who = phrase(picks, 'who') as string;
  const what = phrase(picks, 'what') as string;
  const when = phrase(picks, 'when') as string;
  const ifnot = phrase(picks, 'ifnot') as string;
  return `At ${where}, ${who} ${what}, ${when}. If not: ${ifnot}.`;
};

/* --------------------------------------------------------- the printed key */

/** Break a line at word boundaries. Deterministic; long words are not cut. */
export const wrapLines = (text: string, max: number): readonly string[] => {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = w;
    else if (line.length + 1 + w.length <= max) line = `${line} ${w}`;
    else {
      out.push(line);
      line = w;
    }
  }
  if (line) out.push(line);
  return out;
};

/** Coverage, stated as coverage. Never a ratio of right to wrong. */
export const coverage = (placements: Placements, rulesKept: number): string => {
  const sorted = sortedCount(placements);
  const rules = rulesKept === 1 ? '1 rule written' : `${rulesKept} rules written`;
  return `${sorted} of ${RULE_CARDS.length} cards sorted · ${rules}`;
};

/** The lines printed under the plate. Facts about what is on it. */
export const plateLines = (placements: Placements, sentence: string | null): readonly string[] => {
  const lines = [
    `${cardsIn(placements, 'everyone').length} cards in the same-for-everyone column, ${cardsIn(placements, 'reasoned').length} in different-for-a-reason.`,
  ];
  if (sentence) lines.push(sentence);
  else lines.push('No rule written yet.');
  return lines;
};

/** A description of the key for a screen reader, and for the exported plate. */
export const describeKey = (placements: Placements, sentence: string | null): string => {
  const same = cardsIn(placements, 'everyone').map((c) => c.short).join(', ') || 'nothing yet';
  const diff = cardsIn(placements, 'reasoned').map((c) => c.short).join(', ') || 'nothing yet';
  const rule = sentence ? ` His own rule: ${sentence}` : '';
  return `A rule key on ruled paper. The same for everyone: ${same}. Different, for a reason: ${diff}.${rule}`;
};
