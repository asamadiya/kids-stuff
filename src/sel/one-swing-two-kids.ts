/**
 * One Swing, Two Kids.
 *
 * One thing, and two children who both want it. He picks one of three drawn
 * plans — you first, them first, or take turns — or asks a grown-up to help,
 * and reads what the other child did. If they did not go along with it, he
 * picks again. The grown-up is always there, and always ends it.
 *
 * This replaced a bargaining version: a divider slid along a ten-minute band,
 * three offers against an undisclosed rule, and a clock that could end with
 * every minute gone and nobody on the swing. That was far harder than the rest
 * of the guide and taught the counterparty's arithmetic rather than the
 * person. Here there is no clock, no count of tries and nothing hidden: every
 * answer is a sentence he can read, and the same plan meets different people
 * differently because they are different people.
 *
 * Nothing here is marked. A plan the other child does not take is simply what
 * happened, stated as world-state; a plan they take can still cost something.
 *
 * Pure module. No React, no DOM, no randomness, no clock.
 */

export const ONE_SWING_TWO_KIDS_META = {
  id: 'one-swing-two-kids',
  title: 'One Swing, Two Kids',
  eyebrow: 'Taking turns',
  note: 'One thing, and two children who both want it. Pick a plan, see what the other child does, and ask a grown-up to help whenever you like.',
} as const;

/* ------------------------------------------------------------------ shapes */

/** The three plans he can say out loud. */
export type PlanId = 'you-first' | 'them-first' | 'turns';

/** Everything he can choose: a plan, or a grown-up. */
export type ChoiceId = PlanId | 'grown-up';

export const PLANS: readonly PlanId[] = ['you-first', 'them-first', 'turns'];

/** The grown-up is always the last choice and is always offered. */
export const CHOICES: readonly ChoiceId[] = [...PLANS, 'grown-up'];

export const GROWN_UP_LABEL = 'Ask a grown-up to help';

export type Thing = 'swing' | 'controller' | 'crackers' | 'seat' | 'tablet';

export interface Reply {
  /** What the other child did, in the second person and the past tense. */
  readonly says: string;
  /**
   * True when something now happened with the thing; false when they did not
   * go along with it and he can choose again. Never a mark of the plan.
   */
  readonly settled: boolean;
  /** Whether the scene's painted ending fits this reply. Null where it does not. */
  readonly picture: 'outcome' | null;
}

export interface Scenario {
  readonly id: string;
  /** The other child's name. */
  readonly other: string;
  /** Who the other child is, in words, since there is no portrait. */
  readonly about: string;
  /** Drawn smaller in the plans, because they are two. */
  readonly little: boolean;
  /** What the plans draw between the two of them. */
  readonly thing: Thing;
  /** What a turn is here, for the take-turns plan: "10 pushes each". */
  readonly turn: string;
  /** How many marks one turn is drawn as under each frame. */
  readonly turnTicks: number;
  /** Who comes when he asks: "Nanna". */
  readonly grownUp: string;
  /** The situation, said plainly. */
  readonly where: string;
  /** One sentence for a grown-up where the situation is not between equals. */
  readonly guide: string | null;
  readonly setup: string;
  readonly setupAlt: string;
  readonly outcome: string;
  readonly outcomeAlt: string;
  /** Short enough to be the whole label of a picture button. */
  readonly short: string;
  readonly replies: Readonly<Record<ChoiceId, Reply>>;
}

/* -------------------------------------------------------------- the people */

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'swing',
    other: 'Sam',
    about: 'Sam is your size. He has one hand on the chain of the swing and is looking at you.',
    little: false,
    thing: 'swing',
    turn: '10 pushes each',
    turnTicks: 10,
    grownUp: 'Nanna',
    where: 'One swing in the park, and you and Sam got to it at the same moment.',
    guide: null,
    setup: 'one-swing-two-kids-swing-setup',
    setupAlt: 'You and a boy your size standing either side of one empty swing in the neighbourhood park in the evening, Nanna waiting by the park gate behind.',
    outcome: 'one-swing-two-kids-swing-outcome',
    outcomeAlt: 'The swing hanging still, the two of you walking off the grass as the light goes, and Nanna holding the park gate open.',
    short: 'One swing in the park',
    replies: {
      'you-first': {
        says: 'Sam kept his hand on the chain. “I got here at the same time,” he said. Nobody got on the swing.',
        settled: false,
        picture: null,
      },
      'them-first': {
        says: 'Sam got on and swung for a long time. When he got off you had a short go, and then Nanna said it was time to walk home.',
        settled: true,
        picture: 'outcome',
      },
      turns: {
        says: 'Sam said, “Okay, I will count yours.” He counted your ten pushes out loud, then you counted his, round and round until Nanna called you home.',
        settled: true,
        picture: 'outcome',
      },
      'grown-up': {
        says: 'Nanna came over from the gate and counted ten pushes each out loud, Sam and then you, until it was time to go home.',
        settled: true,
        picture: 'outcome',
      },
    },
  },
  {
    id: 'console',
    other: 'Tomas',
    about: 'Tomas lives here. It is his game, and you are visiting for the afternoon.',
    little: false,
    thing: 'controller',
    turn: 'one race each',
    turnTicks: 1,
    grownUp: 'Tomas’s mom',
    where: 'One controller on the rug at Tomas’s house, and you both want to play.',
    guide: null,
    setup: 'one-swing-two-kids-console-setup',
    setupAlt: 'A living room floor at another family, one controller on the rug between you and the boy who lives there.',
    outcome: 'one-swing-two-kids-console-outcome',
    outcomeAlt: 'The dark television and the controller back on the shelf while you pull on your shoes at the door, and Amma’s face at the glass.',
    short: 'One controller at Tomas’s',
    replies: {
      'you-first': {
        says: 'Tomas handed you the controller. “You are the guest,” he said, and watched your race from the sofa. Then it was his go.',
        settled: true,
        picture: null,
      },
      'them-first': {
        says: 'Tomas played one race, then another, then another. When you asked for your go, Amma was at the door to take you home.',
        settled: true,
        picture: 'outcome',
      },
      turns: {
        says: 'Tomas said, “One race each. You start.” You passed the controller back and forth after every race until it was time to go home.',
        settled: true,
        picture: 'outcome',
      },
      'grown-up': {
        says: 'Tomas’s mom came in, said one race each with the guest first, and sat on the sofa to watch.',
        settled: true,
        picture: null,
      },
    },
  },
  {
    id: 'snack',
    other: 'Ravi',
    about: 'Ravi has come over to play. He is quiet and does not say much.',
    little: false,
    thing: 'crackers',
    turn: 'one cracker each',
    turnTicks: 1,
    grownUp: 'Amma',
    where: 'Six crackers left in the box, and you and Ravi both reached for it.',
    guide: null,
    setup: 'one-swing-two-kids-snack-setup',
    setupAlt: 'You and Ravi kneeling at the low table in the living room with an open cracker box between you at snack time, Mia watching from the end of the table.',
    outcome: 'one-swing-two-kids-snack-outcome',
    outcomeAlt: 'The empty box on its side on the table, crumbs on the wood, one chair pushed back.',
    short: 'Six crackers left',
    replies: {
      'you-first': {
        says: 'You took a handful first. When Ravi reached into the box there were two left. He ate them and went out to the sandbox in the backyard on his own.',
        settled: true,
        picture: 'outcome',
      },
      'them-first': {
        says: 'Ravi took three and pushed the box across the table to you. There were three left for you.',
        settled: true,
        picture: null,
      },
      turns: {
        says: 'You took one, then Ravi took one, until the box was empty. Three each.',
        settled: true,
        picture: null,
      },
      'grown-up': {
        says: 'Amma tipped the crackers onto a steel plate in two rows of three, one row for each of you.',
        settled: true,
        picture: null,
      },
    },
  },
  {
    id: 'window',
    other: 'Nadia',
    about: 'Nadia is your age. Her mom is driving you both to the swimming pool.',
    little: false,
    thing: 'seat',
    turn: 'swap halfway',
    turnTicks: 1,
    grownUp: 'Nadia’s mom',
    where: 'One window seat in the back of the car, and you and Nadia both climbed in for it.',
    guide: null,
    setup: 'one-swing-two-kids-window-setup',
    setupAlt: 'The back seat of a car, you and a girl your age both with a hand on the same window seatbelt.',
    outcome: 'one-swing-two-kids-window-outcome',
    outcomeAlt: 'The car stopped outside the pool with both doors open and the back seat empty.',
    short: 'One window seat',
    replies: {
      'you-first': {
        says: 'Nadia said, “Then I have it on the way home.” She sat in the middle, and you looked out of the window all the way to the pool.',
        settled: true,
        picture: 'outcome',
      },
      'them-first': {
        says: 'Nadia sat by the window and looked out all the way to the pool. On the way home the window was yours.',
        settled: true,
        picture: 'outcome',
      },
      turns: {
        says: 'Nadia’s mom said nobody unbuckles while the car is moving, so you could not swap halfway. You were both still holding the seatbelt.',
        settled: false,
        picture: null,
      },
      'grown-up': {
        says: 'Nadia’s mom said Nadia by the window on the way there and you on the way home, and buckled you both in.',
        settled: true,
        picture: 'outcome',
      },
    },
  },
  {
    id: 'tablet',
    other: 'Mia',
    about: 'Mia is your little sister. She is two, and she is reaching for the tablet with both hands.',
    little: true,
    thing: 'tablet',
    turn: 'one song each',
    turnTicks: 1,
    grownUp: 'Amma',
    where: 'You are watching the tablet, and Mia wants it too.',
    guide: 'Mia is two. Waiting for a turn is very hard at two, so a plan that works with a friend may not work with her yet.',
    setup: 'one-swing-two-kids-tablet-setup',
    setupAlt: 'You on the living-room sofa holding the tablet while Mia, two, stands at your knee reaching for it, and Amma carries a pan to the dinner table behind.',
    outcome: 'one-swing-two-kids-tablet-outcome',
    outcomeAlt: 'The tablet dark on a high kitchen shelf, you climbing onto your chair, Amma settling Mia into her high chair, and two bowls of rasam steaming on the dinner table.',
    short: 'Mia and the tablet',
    replies: {
      'you-first': {
        says: 'Mia reached for the tablet twice, said, “Anna, anna,” and then started to cry. Waiting for “then” is very hard when you are two.',
        settled: false,
        picture: null,
      },
      'them-first': {
        says: 'Mia took the tablet in both hands and sat down on the floor with it. She pressed the screen with her whole hand and did not give it back.',
        settled: false,
        picture: null,
      },
      turns: {
        says: 'You watched your song while Mia waited at your knee. On her song she clapped, and when it was your turn again she held on to the tablet and cried.',
        settled: false,
        picture: null,
      },
      'grown-up': {
        says: 'Amma said it was nearly dinner. She put the tablet up on the high shelf and lifted Mia into her high chair.',
        settled: true,
        picture: 'outcome',
      },
    },
  },
];

export const scenarioById = (id: string): Scenario | null =>
  SCENARIOS.find((s) => s.id === id) ?? null;

/* --------------------------------------------------------------- the words */

/** The words under a plan's drawing. The drawing reads the same order from `framesOf`. */
export function choiceLabel(s: Scenario, c: ChoiceId): string {
  switch (c) {
    case 'you-first':
      return `You first, then ${s.other}`;
    case 'them-first':
      return `${s.other} first, then you`;
    case 'turns':
      return `Take turns: ${s.turn}`;
    case 'grown-up':
      return GROWN_UP_LABEL;
  }
}

/** What he said or did, as it is read back. */
export function saidLine(s: Scenario, c: ChoiceId): string {
  return c === 'grown-up' ? `You asked ${s.grownUp} to help.` : `You said, “${choiceLabel(s, c)}.”`;
}

export const replyOf = (s: Scenario, c: ChoiceId): Reply => s.replies[c];

/** The painted plate that goes with a reply, or null where none fits. */
export function pictureOf(s: Scenario, c: ChoiceId): { readonly src: string; readonly alt: string } | null {
  return replyOf(s, c).picture === 'outcome' ? { src: s.outcome, alt: s.outcomeAlt } : null;
}

/* ------------------------------------------------------------- the drawings */

export type Who = 'you' | 'them';

export interface PlanDrawing {
  /** Who has the thing in each frame, left to right. */
  readonly frames: readonly Who[];
  /** True when the plan goes back round to the first frame. */
  readonly loops: boolean;
  /** Marks under each frame, one per unit of a turn. Zero where a turn has no size. */
  readonly ticks: number;
}

/**
 * The drawn plan, read off the same choice the label is built from, so "You
 * first" cannot be printed under a drawing of the other child on the swing.
 */
export function framesOf(s: Scenario, plan: PlanId): PlanDrawing {
  if (plan === 'you-first') return { frames: ['you', 'them'], loops: false, ticks: 0 };
  if (plan === 'them-first') return { frames: ['them', 'you'], loops: false, ticks: 0 };
  return { frames: ['you', 'them'], loops: true, ticks: s.turnTicks };
}

/* ------------------------------------------------------------ choosing a plan */

/** True once the last thing he chose went ahead. */
export function isSettled(s: Scenario, tried: readonly ChoiceId[]): boolean {
  const last = tried[tried.length - 1];
  return last !== undefined && replyOf(s, last).settled;
}

/**
 * Add a choice. Nothing can be chosen after the scene has settled, and a plan
 * already tried is not tried twice: the same plan meets the same answer.
 */
export function choose(s: Scenario, tried: readonly ChoiceId[], c: ChoiceId): readonly ChoiceId[] {
  if (isSettled(s, tried) || tried.includes(c)) return tried;
  return [...tried, c];
}

/** One story line as its two sentences: what he said or did, then what the other child did. */
export function storyParts(s: Scenario, c: ChoiceId): readonly [string, string] {
  return [saidLine(s, c), replyOf(s, c).says];
}

/** One story line, as it is shown under the pictures. */
export const storyLine = (s: Scenario, c: ChoiceId): string => storyParts(s, c).join(' ');

/** Each thing he chose, followed by what came of it. */
export function storyLines(s: Scenario, tried: readonly ChoiceId[]): readonly string[] {
  return tried.map((c) => storyLine(s, c));
}

/** The plan tray's label before anything is chosen. */
export const TRAY_PICK = 'What will you say? Pick a plan.';
/** The plan tray's label once a plan has gone ahead. */
export const TRAY_SETTLED = 'That is what happened.';
/** The plan tray's label after a plan the other child did not take. */
export const trayRefused = (s: Scenario): string =>
  `${s.other} did not go along with it. Pick another plan, or ask a grown-up.`;

/** The line above the plans, for where he is in the scene. */
export function trayLine(s: Scenario, tried: readonly ChoiceId[]): string {
  if (tried.length === 0) return TRAY_PICK;
  return isSettled(s, tried) ? TRAY_SETTLED : trayRefused(s);
}

/**
 * Every path he can take in one place: plans in any order, each at most once,
 * until one goes ahead. The empty path is the scene before he chooses.
 */
export function reachablePaths(s: Scenario): (readonly ChoiceId[])[] {
  const out: (readonly ChoiceId[])[] = [];
  const walk = (tried: readonly ChoiceId[]): void => {
    out.push(tried);
    if (isSettled(s, tried)) return;
    for (const c of CHOICES) {
      const next = choose(s, tried, c);
      if (next !== tried) walk(next);
    }
  };
  walk([]);
  return out;
}

/** The lines that go on the plate. */
export function plateLines(s: Scenario, tried: readonly ChoiceId[]): readonly string[] {
  return [s.where, ...storyLines(s, tried)];
}

/** The path, short, for a card on the shelf. */
export function pathText(s: Scenario, tried: readonly ChoiceId[]): string {
  return tried.map((c) => choiceLabel(s, c)).join(' · ');
}

/* ------------------------------------------------------------- how much of it */

/** Coverage, never a tally of anything he got right. */
export function coverageText(played: readonly string[]): string {
  const seen = new Set(played.filter((id) => scenarioById(id) !== null)).size;
  return `You have played ${seen} of the ${SCENARIOS.length} situations.`;
}

export function addPlayed(played: readonly string[], id: string): readonly string[] {
  return played.includes(id) ? played : [...played, id];
}

/* ---------------------------------------------------------------- read aloud */

/**
 * What each read-aloud button reads: the words on screen beside it, one atom
 * per sentence or label, in screen order. Nothing is spoken unless he presses
 * that button (advisor a9). Not read: the grown-up's `guide`, the "Later"
 * picture label, the plate, the drawer, the coverage line and the situation
 * pictures (a grown-up usually picks the situation). The component reads only
 * through these, and `listenLines` enumerates them, so a button cannot ask for
 * a clip the build did not make.
 */
export const LISTEN = {
  /** L1, under the note. */
  head: (): readonly string[] => [ONE_SWING_TWO_KIDS_META.title, ONE_SWING_TWO_KIDS_META.note],
  /** L2, under the situation picture: its caption, then who the other child is. */
  setup: (s: Scenario): readonly string[] => [s.where, s.about],
  /** L3, in the plan tray: its line, then the four choices in the order they are drawn. */
  plans: (s: Scenario, tried: readonly ChoiceId[]): readonly string[] =>
    [trayLine(s, tried), ...CHOICES.map((c) => choiceLabel(s, c))],
  /** L4, beside each story line. */
  story: (s: Scenario, c: ChoiceId): readonly string[] => storyParts(s, c),
} as const;

/** Every line a read-aloud button in this exercise can play, for the clip builder. */
export function listenLines(): string[] {
  const all = [
    ...LISTEN.head(),
    ...SCENARIOS.flatMap((s) => [
      ...LISTEN.setup(s),
      ...reachablePaths(s).flatMap((tried) => [
        ...LISTEN.plans(s, tried),
        ...tried.flatMap((c) => LISTEN.story(s, c)),
      ]),
    ]),
  ];
  return [...new Set(all)];
}
