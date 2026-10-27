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
  /** How the column is named inside "in the … column". */
  readonly inline: string;
  /** The column as a plain sentence. Not shown on the bench, so never read aloud. */
  readonly note: string;
}

export const COLUMNS: readonly Column[] = [
  {
    id: 'everyone',
    label: 'The same for everyone',
    inline: 'same for everyone',
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
  /** The rule, in the words it would be said in. Shown under the picture in the rack; its speaker reads it. */
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
    front: 'Mia eats pasta with her hands.',
    short: "Mia's hands",
    alt: 'Mia, two, in her high chair at the kitchen table pushing pasta into her mouth with her fist while Arjun sits beside her holding a fork.',
    grownUpColumn: 'reasoned',
    reverse:
      'You are right that this is not the same rule. Mia is two. Her fingers cannot hold a fork steady yet. When they can, she will be asked to use one for pasta, the way you were. At this table everyone eats rice and sambar by hand, Amma and Nanna too.',
    arguable: false,
    concedes: true,
  },
  {
    id: 'not-the-same-rule-mia-spill',
    front: 'Mia is not told off when she spills.',
    short: "Mia's spill",
    alt: 'A tipped cup spreading milk across the kitchen table, Mia watching it from her high chair, Arjun already reaching for the cup, and Amma’s hand coming in with a cloth.',
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
    alt: 'Arjun cross-legged on the living-room sofa with a tablet on his knees and a kitchen timer beside him, Mia standing at the sofa with one hand on the cushion, watching.',
    grownUpColumn: 'reasoned',
    reverse:
      'You are right that this one is not the same either. This one runs your way. Amma and Nanna decided that twenty minutes is a long time for a two-year-old and a short time for you. Some families set one timer for both.',
    arguable: true,
    concedes: true,
  },
  {
    id: 'not-the-same-rule-helmets',
    front: 'Everyone wears a helmet on a bike.',
    short: 'Helmets',
    alt: 'Nanna kneeling beside Arjun at the end of the driveway, both fastening bicycle helmet straps under their chins, while Mia watches from the curb.',
    grownUpColumn: 'everyone',
    reverse:
      'Every head on a bike is the same kind of head. Nobody in this family rides without one, Amma and Nanna included.',
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
    alt: 'Seen from where Arjun sits on the mat inside the front door, pulling off a sneaker with both hands: small and large shoes lined up along the hallway wall, and Mia on her hands and knees on the clean floor at the far end.',
    grownUpColumn: 'reasoned',
    reverse:
      'This house leaves outside shoes at the door, the way Nanamma’s house and Paati’s house always have, so the floor stays clean for sitting and playing on. Some houses do this the other way and keep shoes on all the way through.',
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

export const REASON_SAYS = 'The reason on the back says:';
export const STANDS = 'Your column stands.';

/** His column, restated. Twelve values: six cards by two columns. */
export const youPut = (card: RuleCard, column: ColumnId): string =>
  `You put "${card.front}" in the ${columnById(column).inline} column.`;

/**
 * What a placed card shows when turned over, one sentence or lead-in per
 * part. His column is restated first, the reason follows, and the card stays
 * where he put it.
 */
export const reverseParts = (card: RuleCard, column: ColumnId): readonly string[] =>
  [youPut(card, column), REASON_SAYS, card.reverse, STANDS];

export const reverseLine = (card: RuleCard, column: ColumnId): string =>
  reverseParts(card, column).join(' ');

/* ------------------------------------------------------- the rule he builds */

export type SlotId = 'place' | 'who' | 'what' | 'when' | 'ifnot';

/** A geometric mark, drawn as a hairline glyph beside the chip. */
export type ChipMark = 'ring' | 'dot' | 'bar' | 'square' | 'cross' | 'chevron' | 'arc' | 'line';

export interface Slot {
  readonly id: SlotId;
  /** The tray label above the row of chips. */
  readonly label: string;
  /** The question beside the label. The row's speaker reads it, then the chips. */
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

/**
 * The rule in its two parts: the rule itself (81 ways) and what happens if
 * not (3 ways). Null until every slot holds a chip.
 */
export const ruleParts = (picks: Picks): readonly [string, string] | null => {
  if (!picksComplete(picks)) return null;
  const where = phrase(picks, 'place') as string;
  const who = phrase(picks, 'who') as string;
  const what = phrase(picks, 'what') as string;
  const when = phrase(picks, 'when') as string;
  const ifnot = phrase(picks, 'ifnot') as string;
  return [`At ${where}, ${who} ${what}, ${when}.`, `If not: ${ifnot}.`];
};

/** The rule as one sentence. Null until every slot holds a chip. */
export const ruleSentence = (picks: Picks): string | null =>
  ruleParts(picks)?.join(' ') ?? null;

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

/* ------------------------------------------------------------------ listen */

export const RACK_OPEN = 'Take a card, then drop it in a column. Drag it, or tap it and tap a column.';
export const RACK_DONE = 'Every card is in a column. Turn one over to read the reason on the back.';
export const WHERE_PROMPT = 'Where does this one go?';
export const BUILDER_HEAD = 'The last card is blank. Build a rule of your own.';

/** The label over the rack: how to sort while cards are left, how to turn them once none are. */
export const rackLabel = (placements: Placements): string =>
  rackCards(placements).length > 0 ? RACK_OPEN : RACK_DONE;

/** The notice shown once the rack empties: the divergence, then that his key stands. */
export const noticeParts = (placements: Placements): readonly string[] =>
  [divergenceLine(placements), KEY_STANDS];

/**
 * What each read-aloud button reads: the words on screen beside it, in screen
 * order. Nothing is spoken unless the child presses that button (advisor a9).
 * The component reads only through these, and `listenLines` enumerates them,
 * so a button cannot ask for a clip the build did not make. The note is for
 * the grown-up and is not read.
 */
export const LISTEN = {
  /** L1, beside the title. */
  head: (): readonly string[] => [NOT_THE_SAME_RULE_META.title],
  /** L2, beside the rack label. */
  rack: (placements: Placements): readonly string[] => [rackLabel(placements)],
  /** L3, beside each card in the rack: the rule written under its picture. */
  card: (card: RuleCard): readonly string[] => [card.front],
  /** L4, the tray that asks where a held card goes, and its two columns. */
  where: (): readonly string[] => [WHERE_PROMPT, ...COLUMNS.map((c) => c.label)],
  /** L5, the back of a turned card. */
  back: (card: RuleCard, column: ColumnId): readonly string[] => reverseParts(card, column),
  /** L6, the notice when the rack empties. */
  notice: (placements: Placements): readonly string[] => noticeParts(placements),
  /** L7, beside the builder heading. */
  builder: (): readonly string[] => [BUILDER_HEAD],
  /** L8, each slot row: its question, then its chips. */
  slot: (slot: Slot): readonly string[] => [slot.ask, ...chipsFor(slot.id).map((c) => c.label)],
  /** L9, beside the finished rule. */
  rule: (picks: Picks): readonly string[] => ruleParts(picks) ?? [],
} as const;

/** Every way the six cards can sit in the two columns, rack empty. */
const everySort = (): readonly Placements[] =>
  RULE_CARDS.reduce<Placements[]>(
    (acc, card) => acc.flatMap((p) => COLUMNS.map((col) => place(p, card.id, col.id))),
    [{}],
  );

/** Every finished set of picks: one chip in each of the five slots. */
const everyRule = (): readonly Picks[] =>
  SLOTS.reduce<Picks[]>(
    (acc, slot) => acc.flatMap((p) => chipsFor(slot.id).map((c) => ({ ...p, [slot.id]: c.id }))),
    [{}],
  );

/** Every line a read-aloud button in this exercise can play, for the clip builder. */
export function listenLines(): string[] {
  const sorts = everySort();
  const all = [
    ...LISTEN.head(),
    ...LISTEN.rack({}),
    ...LISTEN.rack(sorts[0]),
    ...RULE_CARDS.flatMap((card) => LISTEN.card(card)),
    ...LISTEN.where(),
    ...RULE_CARDS.flatMap((card) => COLUMNS.flatMap((col) => LISTEN.back(card, col.id))),
    ...sorts.flatMap((p) => LISTEN.notice(p)),
    ...LISTEN.builder(),
    ...SLOTS.flatMap((slot) => LISTEN.slot(slot)),
    ...everyRule().flatMap((p) => LISTEN.rule(p)),
  ];
  return [...new Set(all)];
}
