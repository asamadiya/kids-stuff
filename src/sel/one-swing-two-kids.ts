/**
 * One Swing, Two Kids.
 *
 * One thing, two people who want it, and a clock that does not care. He slides
 * a divider along a ruled band to say how the thing splits, offers it, and the
 * other person answers: a face, and sometimes a counter-divider of their own.
 * Three offers, then the clock runs out by itself.
 *
 * Nothing here is marked. Any split executes — taking it all executes, giving
 * it all away executes — and what comes back is world-state: how long each of
 * them actually had the thing, and whether the other person asked about
 * tomorrow. Every counterparty runs a different, undisclosed rule, so the move
 * that worked yesterday is simply a move today.
 *
 * Pure module. No React, no DOM, no randomness, no clock of its own.
 */

export const ONE_SWING_TWO_KIDS_META = {
  id: 'one-swing-two-kids',
  title: 'One Swing, Two Kids',
  eyebrow: 'Two wanters',
  note: 'One thing, two people who want it, and a clock. Slide the divider to say how it splits, offer it, and see what the other person does.',
} as const;

/** Three offers is all the clock allows. */
export const MAX_OFFERS = 3;

/** The painted portraits already in the guide. No new faces are made for this. */
export const PORTRAITS: readonly string[] = [
  'angry', 'annoyed', 'bored', 'calm', 'confident', 'confused', 'curious', 'delighted',
  'disappointed', 'embarrassed', 'excited', 'frustrated', 'grateful', 'happy', 'hopeful',
  'jealous', 'lonely', 'loved', 'nervous', 'overwhelmed', 'proud', 'sad', 'scared', 'shy',
  'silly', 'surprised', 'tired', 'worried',
];

/* ------------------------------------------------------------------ shapes */

/**
 * The hidden rule the other person plays by. It is never shown, never named in
 * the room, and no two people in this exercise share one.
 */
export type CounterRule =
  | 'split-difference'
  | 'holds-out'
  | 'accepts-anything'
  | 'walks-away'
  | 'cannot-counter';

/** The rules that can answer with a counter-divider of their own. */
export const HAGGLES: readonly CounterRule[] = ['split-difference', 'holds-out', 'walks-away'];

/** The rules that take whatever they are handed, including nothing. */
export const TAKES_ANYTHING: readonly CounterRule[] = ['accepts-anything', 'cannot-counter'];

export interface Pronouns {
  readonly subj: string;
  readonly poss: string;
}

export interface Faces {
  /** Before the first offer. */
  readonly waiting: string;
  /** One face per round of haggling; the last is reused if the rounds run on. */
  readonly counter: readonly string[];
  readonly accepted: string;
  /** They ended up with the whole thing. */
  readonly plenty: string;
  /** They ended up with none of it. */
  readonly none: string;
  readonly ranOut: string;
  readonly left: string;
}

export interface Reactions {
  readonly nods: string;
  /** Only for the people who accept anything, since only they can accept nothing. */
  readonly nodsNone: string | null;
  /** `{a}` is what they want, `{b}` is what that leaves you. Only for the hagglers. */
  readonly counters: string | null;
  /** Only for the one who walks away. */
  readonly leaves: string | null;
}

export interface Aftermath {
  /** `{t}` is an amount with its unit, e.g. "6 minutes". */
  readonly you: string;
  readonly youNone: string;
  readonly them: string;
  readonly themNone: string;
  readonly closing: string;
  readonly ranOut: string;
  /** Only for the one who walks away. */
  readonly left: string | null;
  /** Null for the people who never ask about tomorrow. */
  readonly tomorrowYes: string | null;
  readonly tomorrowNo: string;
}

export interface Scenario {
  readonly id: string;
  readonly other: string;
  readonly pron: Pronouns;
  /** How much there is to divide, in whole units. */
  readonly total: number;
  readonly unit: string;
  readonly unitOne: string;
  readonly thing: string;
  /** The hard stop, said plainly. */
  readonly stop: string;
  readonly rule: CounterRule;
  /** What they hold out for. Never shown until they counter with it. */
  readonly wants: number;
  /** Below this they stop negotiating altogether. */
  readonly walkBelow: number | null;
  /** One sentence for a grown-up where the situation is not symmetric. */
  readonly guide: string | null;
  readonly setup: string;
  readonly setupAlt: string;
  readonly outcome: string;
  readonly outcomeAlt: string;
  /** Short enough to be the whole label of a picture button. */
  readonly short: string;
  readonly faces: Faces;
  readonly reactions: Reactions;
  readonly after: Aftermath;
}

/* -------------------------------------------------------------- the people */

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'swing',
    other: 'Sam',
    pron: { subj: 'he', poss: 'his' },
    total: 10,
    unit: 'minutes',
    unitOne: 'minute',
    thing: 'the swing',
    stop: 'Ten minutes until dinner, and one swing.',
    rule: 'split-difference',
    wants: 5,
    walkBelow: null,
    guide: null,
    setup: 'one-swing-two-kids-swing-setup',
    setupAlt: 'You and a boy your size standing either side of one empty swing in the evening park.',
    outcome: 'one-swing-two-kids-swing-outcome',
    outcomeAlt: 'The swing hanging still, the two of you walking off the grass as the light goes.',
    short: 'One swing, ten minutes',
    faces: {
      waiting: 'curious',
      counter: ['hopeful', 'annoyed', 'frustrated'],
      accepted: 'delighted',
      plenty: 'surprised',
      none: 'disappointed',
      ranOut: 'disappointed',
      left: 'annoyed',
    },
    reactions: {
      nods: 'Sam nodded and put his hands on the chains.',
      nodsNone: null,
      counters: 'Sam shook his head. He wants {a}, and that leaves {b} for you.',
      leaves: null,
    },
    after: {
      you: 'You swung for {t}.',
      youNone: 'You did not get on the swing.',
      them: 'Sam swung for {t}.',
      themNone: 'Sam did not get on the swing.',
      closing: 'Then your dad called from the gate and it was dinner.',
      ranOut: 'The ten minutes went by while you were still talking. Nobody swung.',
      left: null,
      tomorrowYes: 'Sam asked if you come to this park on Saturdays.',
      tomorrowNo: 'Sam picked up his scooter and went to the gate without looking back.',
    },
  },
  {
    id: 'console',
    other: 'Tomas',
    pron: { subj: 'he', poss: 'his' },
    total: 12,
    unit: 'minutes',
    unitOne: 'minute',
    thing: 'the one controller',
    stop: 'One controller, and the play date ends at four.',
    rule: 'holds-out',
    wants: 8,
    walkBelow: null,
    guide: null,
    setup: 'one-swing-two-kids-console-setup',
    setupAlt: 'A living room floor at another family, one controller on the rug between you and the boy who lives there.',
    outcome: 'one-swing-two-kids-console-outcome',
    outcomeAlt: 'The dark television and the controller back on the shelf while you pull on your shoes at the door.',
    short: 'One controller until four',
    faces: {
      waiting: 'calm',
      counter: ['confident', 'bored', 'annoyed'],
      accepted: 'happy',
      plenty: 'delighted',
      none: 'disappointed',
      ranOut: 'bored',
      left: 'annoyed',
    },
    reactions: {
      nods: 'Tomas nodded and handed you the controller to start.',
      nodsNone: null,
      counters: 'Tomas shook his head. He wants {a}, and that leaves {b} for you.',
      leaves: null,
    },
    after: {
      you: 'You played for {t}.',
      youNone: 'You did not get a turn on the console.',
      them: 'Tomas played for {t}.',
      themNone: 'Tomas did not get a turn on the console.',
      closing: 'Then the doorbell went at four and your mum was on the step.',
      ranOut: 'Four o’clock came while you were still deciding. The console stayed off.',
      left: null,
      tomorrowYes: 'Tomas asked when you are coming to his house again.',
      tomorrowNo: 'Tomas put the controller on the shelf and went to find his dog.',
    },
  },
  {
    id: 'snack',
    other: 'Ravi',
    pron: { subj: 'he', poss: 'his' },
    total: 6,
    unit: 'pieces',
    unitOne: 'piece',
    thing: 'the last of the crackers',
    stop: 'Six crackers left in the box, and no more in the cupboard.',
    rule: 'accepts-anything',
    wants: 0,
    walkBelow: null,
    guide: null,
    setup: 'one-swing-two-kids-snack-setup',
    setupAlt: 'You and another boy kneeling at a low table with an open cracker box between you at snack time.',
    outcome: 'one-swing-two-kids-snack-outcome',
    outcomeAlt: 'The empty box on its side on the table, crumbs on the wood, one chair pushed back.',
    short: 'Six crackers left',
    faces: {
      waiting: 'curious',
      counter: ['confused', 'calm', 'tired'],
      accepted: 'calm',
      plenty: 'delighted',
      none: 'disappointed',
      ranOut: 'confused',
      left: 'tired',
    },
    reactions: {
      nods: 'Ravi took {a} and said nothing at all.',
      nodsNone: 'Ravi looked into the empty box and said nothing at all.',
      counters: null,
      leaves: null,
    },
    after: {
      you: 'You ate {t}.',
      youNone: 'You ate none of them.',
      them: 'Ravi ate {t}.',
      themNone: 'Ravi ate none of them.',
      closing: 'Then the box was empty and you both wiped your hands on your shorts.',
      ranOut: 'Snack time ended with the box still sitting between you. Nobody ate them.',
      left: null,
      tomorrowYes: null,
      tomorrowNo: 'Ravi got up and went to the sandpit on his own.',
    },
  },
  {
    id: 'window',
    other: 'Nadia',
    pron: { subj: 'she', poss: 'her' },
    total: 8,
    unit: 'minutes',
    unitOne: 'minute',
    thing: 'the window seat',
    stop: 'One window seat, and the drive to the pool is eight minutes.',
    rule: 'walks-away',
    wants: 4,
    walkBelow: 3,
    guide: null,
    setup: 'one-swing-two-kids-window-setup',
    setupAlt: 'The back seat of a car, you and a girl your age both with a hand on the same window seatbelt.',
    outcome: 'one-swing-two-kids-window-outcome',
    outcomeAlt: 'The car stopped outside the pool with both doors open and the back seat empty.',
    short: 'One window seat',
    faces: {
      waiting: 'hopeful',
      counter: ['confident', 'annoyed', 'tired'],
      accepted: 'grateful',
      plenty: 'surprised',
      none: 'disappointed',
      ranOut: 'tired',
      left: 'sad',
    },
    reactions: {
      nods: 'Nadia nodded and shuffled along the seat.',
      nodsNone: null,
      counters: 'Nadia shook her head. She wants {a}, and that leaves {b} for you.',
      leaves: 'Nadia stopped talking, climbed into the middle seat and looked at her hands.',
    },
    after: {
      you: 'You sat by the window for {t}.',
      youNone: 'You sat in the middle seat the whole way.',
      them: 'Nadia sat by the window for {t}.',
      themNone: 'Nadia sat in the middle seat the whole way.',
      closing: 'Then the car stopped at the pool and you both climbed out.',
      ranOut: 'The car pulled in while you were still deciding. Neither of you moved.',
      left: 'Nadia stayed in the middle seat for the rest of the drive and said nothing.',
      tomorrowYes: 'Nadia asked if you are swimming again next week.',
      tomorrowNo: 'Nadia walked ahead of you to the changing rooms.',
    },
  },
  {
    id: 'tablet',
    other: 'Mia',
    pron: { subj: 'she', poss: 'her' },
    total: 5,
    unit: 'minutes',
    unitOne: 'minute',
    thing: 'the tablet',
    stop: 'Mia wants the tablet you are holding, and dinner is in five minutes.',
    rule: 'cannot-counter',
    wants: 0,
    walkBelow: null,
    guide: 'Mia is two. She cannot make an offer back, so whatever you slide is simply what happens.',
    setup: 'one-swing-two-kids-tablet-setup',
    setupAlt: 'You on the sofa holding the tablet while your two-year-old sister stands at your knee reaching for it.',
    outcome: 'one-swing-two-kids-tablet-outcome',
    outcomeAlt: 'The tablet dark on a high shelf and two places laid at the dinner table.',
    short: 'Mia and the tablet',
    faces: {
      waiting: 'curious',
      counter: ['confused', 'confused', 'confused'],
      accepted: 'delighted',
      plenty: 'delighted',
      none: 'sad',
      ranOut: 'confused',
      left: 'sad',
    },
    reactions: {
      nods: 'Mia took the tablet in both hands and sat down on the floor with it.',
      nodsNone: 'Mia stood at your elbow, reached twice, and started to cry.',
      counters: null,
      leaves: null,
    },
    after: {
      you: 'You watched for {t}.',
      youNone: 'You did not watch anything.',
      them: 'Mia held the tablet for {t}.',
      themNone: 'Mia did not get the tablet.',
      closing: 'Then dinner was on the table and the tablet went up on the shelf.',
      ranOut: 'The five minutes went by with the tablet in your hands. Neither of you watched anything.',
      left: null,
      tomorrowYes: null,
      tomorrowNo: 'Mia is two. She did not ask about tomorrow.',
    },
  },
];

export const scenarioById = (id: string): Scenario | null =>
  SCENARIOS.find((s) => s.id === id) ?? null;

/* --------------------------------------------------------------- the words */

const fill = (template: string, t: string): string => template.split('{t}').join(t);

const cap = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

export const amount = (s: Scenario, n: number): string =>
  `${n} ${n === 1 ? s.unitOne : s.unit}`;

/** Every whole split is legal, including both ends of the band. */
export const clampShare = (s: Scenario, n: number): number => {
  if (!Number.isFinite(n)) return 0;
  return Math.min(s.total, Math.max(0, Math.round(n)));
};

export const offerLine = (s: Scenario, mine: number): string => {
  const m = clampShare(s, mine);
  return `You offered ${amount(s, m)} for you and ${s.total - m} for ${s.other}.`;
};

/** The chip beside the band while he is still sliding. */
export const splitText = (s: Scenario, mine: number): string => {
  const m = clampShare(s, mine);
  return `${m} for you · ${s.total - m} for ${s.other}`;
};

export const spokenSplit = (s: Scenario, mine: number): string => {
  const m = clampShare(s, mine);
  return `${amount(s, m)} for you, ${s.total - m} for ${s.other}`;
};

/* ---------------------------------------------------------- the other side */

export interface Reaction {
  readonly kind: 'accepted' | 'counter' | 'left';
  /** What they end up with when they accept; what they are asking for when they counter. */
  readonly theirs: number;
  /** Their counter-divider, as their own share. Null unless they countered. */
  readonly ask: number | null;
  readonly face: string;
  readonly line: string;
}

const counterFace = (s: Scenario, round: number): string =>
  s.faces.counter[Math.min(round, s.faces.counter.length - 1)] ?? s.faces.waiting;

const acceptFace = (s: Scenario, theirs: number): string => {
  if (theirs <= 0) return s.faces.none;
  if (theirs >= s.total) return s.faces.plenty;
  return s.faces.accepted;
};

const acceptLine = (s: Scenario, theirs: number): string => {
  const text = theirs <= 0 ? s.reactions.nodsNone ?? s.reactions.nods : s.reactions.nods;
  return text.split('{a}').join(amount(s, theirs));
};

const counterLine = (s: Scenario, ask: number): string =>
  (s.reactions.counters ?? `${cap(s.pron.subj)} wants {a}, and that leaves {b} for you.`)
    .split('{a}').join(amount(s, ask))
    .split('{b}').join(String(s.total - ask));

/** Where they start from, before he has offered anything. Never shown. */
const openingAsk = (s: Scenario): number => s.wants;

/**
 * How far they move after an offer they will not take. The one who splits the
 * difference walks half the remaining gap towards him; the one who holds out
 * does not move at all; the one who walks away has already gone if it comes to
 * that. Rounding goes towards him, so the gap really closes.
 */
const nextAsk = (s: Scenario, theirs: number, ask: number): number =>
  s.rule === 'split-difference' ? Math.floor((theirs + ask) / 2) : ask;

/**
 * Their answer to the last offer in `offers`, where each entry is the amount
 * he proposed for THEM, oldest first. Deterministic: the whole history goes in,
 * so the same offers always produce the same answer.
 */
export function reactTo(s: Scenario, offers: readonly number[]): Reaction | null {
  if (offers.length === 0) return null;
  let ask = openingAsk(s);
  for (let k = 0; k < offers.length; k += 1) {
    const theirs = clampShare(s, offers[k]);
    const last = k === offers.length - 1;

    if (TAKES_ANYTHING.includes(s.rule)) {
      if (!last) continue;
      return { kind: 'accepted', theirs, ask: null, face: acceptFace(s, theirs), line: acceptLine(s, theirs) };
    }
    if (s.walkBelow !== null && theirs < s.walkBelow) {
      if (!last) continue;
      return {
        kind: 'left',
        theirs: 0,
        ask: null,
        face: s.faces.left,
        line: s.reactions.leaves ?? `${s.other} turned away.`,
      };
    }
    if (theirs >= ask) {
      if (!last) continue;
      return { kind: 'accepted', theirs, ask: null, face: acceptFace(s, theirs), line: acceptLine(s, theirs) };
    }
    const moved = nextAsk(s, theirs, ask);
    /* Nothing left to split: they take what is on the table rather than haggle over a crumb. */
    if (moved <= theirs) {
      if (!last) continue;
      return { kind: 'accepted', theirs, ask: null, face: acceptFace(s, theirs), line: acceptLine(s, theirs) };
    }
    if (last) {
      return { kind: 'counter', theirs: moved, ask: moved, face: counterFace(s, k), line: counterLine(s, moved) };
    }
    ask = moved;
  }
  return null;
}

/** True once the clock has taken the decision out of his hands. */
export const clockRanOut = (offers: readonly number[], reaction: Reaction | null): boolean =>
  offers.length >= MAX_OFFERS && reaction !== null && reaction.kind === 'counter';

/* ------------------------------------------------------------ what happened */

export type EndingKind = 'accepted' | 'took' | 'left' | 'ranOut';

export interface Outcome {
  readonly kind: 'settled' | 'left' | 'ranOut';
  readonly mine: number;
  readonly theirs: number;
  readonly offers: number;
  /** Whether they asked about tomorrow. World-state, not a mark. */
  readonly asked: boolean;
  readonly face: string;
  readonly lines: readonly string[];
}

/**
 * Whether the other person asked about tomorrow. Each one has their own reason,
 * and none of them is a verdict on him: the boy who takes anything never asks,
 * whatever he is given, and the girl who walks away only asks when there was
 * nothing to haggle over.
 */
function didAsk(s: Scenario, kind: Outcome['kind'], offers: readonly number[]): boolean {
  if (kind !== 'settled') return false;
  if (s.after.tomorrowYes === null) return false;
  if (s.rule === 'walks-away') return offers.length === 1;
  return true;
}

function settledLines(s: Scenario, mine: number, theirs: number, asked: boolean): readonly string[] {
  return [
    mine > 0 ? fill(s.after.you, amount(s, mine)) : s.after.youNone,
    theirs > 0 ? fill(s.after.them, amount(s, theirs)) : s.after.themNone,
    s.after.closing,
    asked && s.after.tomorrowYes !== null ? s.after.tomorrowYes : s.after.tomorrowNo,
  ];
}

/**
 * What the two of them actually did with the thing. `ending` says how the
 * haggling stopped; everything else is read back out of the offers, so the same
 * play always settles the same way.
 */
export function settle(s: Scenario, offers: readonly number[], ending: EndingKind): Outcome {
  const made = offers.length;
  if (ending === 'left') {
    return {
      kind: 'left',
      mine: s.total,
      theirs: 0,
      offers: made,
      asked: false,
      face: s.faces.left,
      lines: [
        s.after.left ?? s.after.ranOut,
        fill(s.after.you, amount(s, s.total)),
        s.after.tomorrowNo,
      ],
    };
  }
  if (ending === 'ranOut') {
    return {
      kind: 'ranOut',
      mine: 0,
      theirs: 0,
      offers: made,
      asked: false,
      face: s.faces.ranOut,
      lines: [s.after.ranOut, s.after.tomorrowNo],
    };
  }
  const answer = reactTo(s, offers);
  const theirs =
    ending === 'took' && answer !== null && answer.ask !== null
      ? answer.ask
      : clampShare(s, offers[made - 1] ?? 0);
  const mine = s.total - theirs;
  const asked = didAsk(s, 'settled', offers);
  return {
    kind: 'settled',
    mine,
    theirs,
    offers: made,
    asked,
    face: acceptFace(s, theirs),
    lines: settledLines(s, mine, theirs, asked),
  };
}

/** Numbers, and only numbers. */
export function endingText(s: Scenario, o: Outcome): string {
  const made = `You made ${o.offers} ${o.offers === 1 ? 'offer' : 'offers'}.`;
  if (o.kind === 'ranOut') return `${made} The ${s.unit} ran out at ${o.mine} and ${o.theirs}.`;
  return `${made} You ended at ${o.mine} and ${o.theirs}.`;
}

/** The lines that go on the plate, and onto the shelf card. */
export function plateLines(s: Scenario, o: Outcome): readonly string[] {
  return [
    `${s.thing}, ${amount(s, s.total)} to divide.`,
    `You ${o.mine}. ${s.other} ${o.theirs}.`,
    endingText(s, o),
    ...o.lines,
  ];
}

/* ------------------------------------------------------------- how much of it */

/** Coverage, never a tally of anything he got tolerable or otherwise. */
export function coverageText(played: readonly string[]): string {
  const seen = new Set(played.filter((id) => scenarioById(id) !== null)).size;
  return `You have played ${seen} of the ${SCENARIOS.length} situations.`;
}

export function addPlayed(played: readonly string[], id: string): readonly string[] {
  return played.includes(id) ? played : [...played, id];
}
