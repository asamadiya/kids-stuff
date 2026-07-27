/**
 * Five Cookies — dividing a thing that will not divide.
 *
 * Four boards. On each one there is less of something than the people around
 * it have asked for, and every claim is defensible on its own terms: one has
 * gone without, one did the work, one is the smallest, one was told. The child
 * lays the units out however he likes, serves it, and each person reacts to the
 * rule he actually used. Then he runs the same board a second way and both
 * allocations sit side by side on the paper.
 *
 * The arithmetic is deliberate. On every board the claims cannot all be met at
 * once — this is proved exhaustively in the tests, not asserted in prose — so
 * no allocation leaves every face content and the module never names one that
 * would. Nothing here scores anything. There is no correct field, and the
 * readouts count only what he has covered.
 *
 * Pure: no React, no DOM, no randomness, no time.
 */

export const FIVE_COOKIES_META = {
  id: 'five-cookies',
  title: 'Five Cookies',
  eyebrow: 'Who gets what',
  note: 'Put the cookies on the plates however you want, serve it, and watch what each person does. Then do the same table a second way.',
} as const;

/* ------------------------------------------------------------------ kinds -- */

/** What a person's claim rests on. None of these outranks another. */
export type ClaimKind = 'need' | 'work' | 'small' | 'promise' | 'own';

/** What happened to a person once the board was served. */
export type Outcome = 'met' | 'short' | 'none';

/** Portraits are the twenty-eight faces already drawn for the guide. */
export type FaceId =
  | 'angry' | 'annoyed' | 'bored' | 'calm' | 'confident' | 'confused' | 'curious'
  | 'delighted' | 'disappointed' | 'embarrassed' | 'excited' | 'frustrated'
  | 'grateful' | 'happy' | 'hopeful' | 'jealous' | 'lonely' | 'loved' | 'nervous'
  | 'overwhelmed' | 'proud' | 'sad' | 'scared' | 'shy' | 'silly' | 'surprised'
  | 'tired' | 'worried';

export interface Claimant {
  readonly id: string;
  readonly name: string;
  readonly kind: ClaimKind;
  /**
   * How many units the claim asks for. A `work` claim asks for no fixed
   * number — it asks to end up with more than anybody else — and carries 0.
   */
  readonly asks: number;
  /** Said once, plainly, when the board opens. Never ranked against the others. */
  readonly claim: string;
  readonly portrait: Readonly<Record<'waiting' | Outcome, FaceId>>;
  /** World-state, second person where he is in it. No praise, no gloss. */
  readonly reaction: Readonly<Record<Outcome, string>>;
  /** True for the one claimant who is Rikki himself. */
  readonly isYou?: boolean;
}

export interface Scenario {
  readonly id: string;
  /** games/sel/<plate>.png */
  readonly plate: string;
  readonly alt: string;
  /** How many indivisible things there are to hand out. */
  readonly units: number;
  readonly unit: string;
  readonly unitPlural: string;
  /** Spoken when the board opens, before any claim. */
  readonly setting: string;
  readonly claimants: readonly Claimant[];
}

/* ----------------------------------------------------------------- boards -- */

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'cookies',
    plate: 'five-cookies-cookies-p0',
    alt: 'Five cookies on a plate in the middle of a kitchen table, with three children sitting around it.',
    units: 5,
    unit: 'cookie',
    unitPlural: 'cookies',
    setting: 'Five cookies on the table. Three people want them.',
    claimants: [
      {
        id: 'sam',
        name: 'Sam',
        kind: 'need',
        asks: 3,
        claim: 'Sam did not eat his lunch today. He says he is hungry.',
        portrait: { waiting: 'hopeful', met: 'happy', short: 'disappointed', none: 'sad' },
        reaction: {
          met: 'Sam got three. He ate them quickly and sat back in his chair.',
          short: 'Sam got fewer than he asked for. He kept looking at the plate.',
          none: 'Sam got none. He stayed at the table with his hands in his lap.',
        },
      },
      {
        id: 'nina',
        name: 'Nina',
        kind: 'work',
        asks: 0,
        claim: 'Nina stirred the dough and put every cookie on the tray.',
        portrait: { waiting: 'proud', met: 'delighted', short: 'annoyed', none: 'frustrated' },
        reaction: {
          met: 'Nina ended up with more than anybody. She said she was glad she made them.',
          short: 'Nina made them and got the same as everyone. She is annoyed.',
          none: 'Nina made them and got none. She left the table.',
        },
      },
      {
        id: 'bo',
        name: 'Bo',
        kind: 'small',
        asks: 1,
        claim: 'Bo is the smallest one at the table.',
        portrait: { waiting: 'curious', met: 'delighted', short: 'disappointed', none: 'lonely' },
        reaction: {
          met: 'Bo got some and held them in both hands.',
          short: 'Bo got less than one whole cookie.',
          none: 'Bo got none. He watched the others eat and then went to find his shoes.',
        },
      },
    ],
  },
  {
    id: 'console',
    plate: 'five-cookies-console-p0',
    alt: 'Four children sitting on a rug in front of a television with one game controller between them.',
    units: 3,
    unit: 'turn',
    unitPlural: 'turns',
    setting: 'There is time for three turns on the game. Four people want one.',
    claimants: [
      {
        id: 'ravi',
        name: 'Ravi',
        kind: 'work',
        asks: 0,
        claim: 'Ravi carried the console down the stairs and plugged it all in.',
        portrait: { waiting: 'confident', met: 'proud', short: 'annoyed', none: 'disappointed' },
        reaction: {
          met: 'Ravi ended up with more turns than anybody. He set the next game up as well.',
          short: 'Ravi set it all up and got the same as everyone. He stopped setting things up.',
          none: 'Ravi got no turns. He went and sat by the window.',
        },
      },
      {
        id: 'jo',
        name: 'Jo',
        kind: 'promise',
        asks: 2,
        claim: 'This morning you told Jo she could have two turns.',
        portrait: { waiting: 'hopeful', met: 'calm', short: 'confused', none: 'frustrated' },
        reaction: {
          met: 'Jo got the two turns you said. She played them and passed the controller on.',
          short: 'Jo got fewer turns than you said she would. She reminded you twice.',
          none: 'Jo got no turns. She said that you told her she could.',
        },
      },
      {
        id: 'milo',
        name: 'Milo',
        kind: 'need',
        asks: 2,
        claim: 'Milo has not had a turn on it all week.',
        portrait: { waiting: 'nervous', met: 'excited', short: 'hopeful', none: 'lonely' },
        reaction: {
          met: 'Milo got two turns. He was still talking about them at the door.',
          short: 'Milo got one turn and watched the rest. He asked how long was left.',
          none: 'Milo got no turns. He watched the whole time and did not ask again.',
        },
      },
      {
        id: 'mia',
        name: 'Mia',
        kind: 'small',
        asks: 1,
        claim: 'Mia is two. She cannot do the hard parts on her own.',
        portrait: { waiting: 'curious', met: 'silly', short: 'confused', none: 'overwhelmed' },
        reaction: {
          met: 'Mia got a turn. She held the controller upside down and laughed.',
          short: 'Mia got less than one whole turn.',
          none: 'Mia got no turns. She pulled at your sleeve until somebody picked her up.',
        },
      },
    ],
  },
  {
    id: 'car-seats',
    plate: 'five-cookies-car-seats-p0',
    alt: 'Three children standing beside an open car door with only two empty seats left inside.',
    units: 2,
    unit: 'seat',
    unitPlural: 'seats',
    setting: 'Two seats left in the car. Three people are standing by the door.',
    claimants: [
      {
        id: 'tom',
        name: 'Tom',
        kind: 'work',
        asks: 0,
        claim: 'Tom carried all the bags down and packed them in the boot.',
        portrait: { waiting: 'confident', met: 'calm', short: 'annoyed', none: 'disappointed' },
        reaction: {
          met: 'Tom ended up with more than anybody. He looked out of the window the whole way.',
          short: 'Tom carried the bags and got the same as everyone. He did not carry them back.',
          none: 'Tom got no seat. He waited on the step for the second trip.',
        },
      },
      {
        id: 'ada',
        name: 'Ada',
        kind: 'need',
        asks: 1,
        claim: 'Ada is sick in the car unless she is sitting down properly.',
        portrait: { waiting: 'worried', met: 'calm', short: 'worried', none: 'sad' },
        reaction: {
          met: 'Ada got a seat. She was quiet the whole way there.',
          short: 'Ada got less than one whole seat.',
          none: 'Ada got no seat. She waited on the step with a hand on her stomach.',
        },
      },
      {
        id: 'mia',
        name: 'Mia',
        kind: 'small',
        asks: 1,
        claim: 'Mia is two. Her little car seat is already strapped in the back.',
        portrait: { waiting: 'tired', met: 'calm', short: 'confused', none: 'worried' },
        reaction: {
          met: 'Mia got a seat and was asleep before the end of the road.',
          short: 'Mia got less than one whole seat.',
          none: 'Mia got no seat. Somebody had to stay behind at the house with her.',
        },
      },
    ],
  },
  {
    id: 'dinosaurs',
    plate: 'five-cookies-dinosaurs-p0',
    alt: 'A bag of small dinosaur figures tipped out on a bedroom floor, with a boy, a toddler and another child kneeling around them.',
    units: 7,
    unit: 'dinosaur',
    unitPlural: 'dinosaurs',
    setting: 'Seven dinosaurs on the floor. You, Mia and Priya are all kneeling round them.',
    claimants: [
      {
        id: 'you',
        name: 'You',
        kind: 'own',
        asks: 5,
        isYou: true,
        claim: 'They are your dinosaurs. You want to keep five of them.',
        portrait: { waiting: 'calm', met: 'happy', short: 'disappointed', none: 'annoyed' },
        reaction: {
          met: 'You kept five. Priya played with what was left for a while and then asked to go home.',
          short: 'You kept fewer than you wanted. You watched the ones you like best being flown round the room.',
          none: 'You kept none of them. You sat and watched other people play with your dinosaurs.',
        },
      },
      {
        id: 'mia',
        name: 'Mia',
        kind: 'small',
        asks: 1,
        claim: 'Mia is two. She has hold of the big one and will not let go.',
        portrait: { waiting: 'curious', met: 'delighted', short: 'confused', none: 'frustrated' },
        reaction: {
          met: 'Mia got one and carried it round the room by the tail.',
          short: 'Mia got less than one whole dinosaur.',
          none: 'Mia got none. She took one anyway and you took it back.',
        },
      },
      {
        id: 'priya',
        name: 'Priya',
        kind: 'promise',
        asks: 3,
        claim: 'You told Priya on the phone that she could have three.',
        portrait: { waiting: 'hopeful', met: 'happy', short: 'confused', none: 'bored' },
        reaction: {
          met: 'Priya got the three you said. She lined them up along the windowsill.',
          short: 'Priya got fewer than you said. She said that was not what you told her.',
          none: 'Priya got none. She played with something else and did not ask again.',
        },
      },
    ],
  },
];

export const scenarioById = (id: string): Scenario =>
  SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];

/* ------------------------------------------------------------- allocation -- */

/** A share for every claimant, in board order. */
export type Shares = readonly number[];

export const emptyShares = (s: Scenario): number[] => s.claimants.map(() => 0);

export const placed = (shares: Shares): number => shares.reduce((a, b) => a + b, 0);

export const remaining = (s: Scenario, shares: Shares): number => s.units - placed(shares);

/** Never below zero, never more than there is left to hand out. */
export function adjust(s: Scenario, shares: Shares, index: number, delta: number): number[] {
  const next = [...shares];
  const at = next[index] ?? 0;
  const want = at + delta;
  const capped = Math.max(0, Math.min(want, at + remaining(s, shares)));
  next[index] = capped;
  return next;
}

export const isComplete = (s: Scenario, shares: Shares): boolean => remaining(s, shares) === 0;

/**
 * What one person got, measured against the claim they made. A `work` claim is
 * met only by ending up with strictly more than anybody else; every other claim
 * is met by reaching the number it asked for. Nothing here is a mark.
 */
export function outcomeFor(s: Scenario, shares: Shares, index: number): Outcome {
  const claimant = s.claimants[index];
  const share = shares[index] ?? 0;
  if (share === 0) return 'none';
  if (claimant.kind === 'work') {
    const best = Math.max(...shares.filter((_, i) => i !== index));
    return share > best ? 'met' : 'short';
  }
  return share >= claimant.asks ? 'met' : 'short';
}

export const outcomes = (s: Scenario, shares: Shares): Outcome[] =>
  s.claimants.map((_, i) => outcomeFor(s, shares, i));

export const metCount = (s: Scenario, shares: Shares): number =>
  outcomes(s, shares).filter((o) => o === 'met').length;

/** True only if every claim on the board was met at once. */
export const everyoneMet = (s: Scenario, shares: Shares): boolean =>
  metCount(s, shares) === s.claimants.length;

/** Every way of handing out `units` among `parts`. Used to check the boards. */
export function allAllocations(units: number, parts: number): number[][] {
  if (parts <= 0) return units === 0 ? [[]] : [];
  if (parts === 1) return [[units]];
  const out: number[][] = [];
  for (let head = 0; head <= units; head += 1) {
    for (const tail of allAllocations(units - head, parts - 1)) out.push([head, ...tail]);
  }
  return out;
}

/* ------------------------------------------------------------------ words -- */

const WORDS = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export const word = (n: number): string => WORDS[n] ?? String(n);

const capitalise = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

export const people = (n: number): string =>
  n === 0 ? 'nobody' : n === 1 ? 'one person' : `${word(n)} people`;

/** "Two, two, one." — the split, in board order, and nothing else. */
export const splitLine = (shares: Shares): string =>
  `${capitalise(shares.map((n) => word(n)).join(', '))}.`;

/** The spoken opener: the board, then each claim once, unranked. */
export const claimLines = (s: Scenario): string[] => [s.setting, ...s.claimants.map((c) => c.claim)];

/** What the board looks like after it was served. World-state only. */
export function servedLines(s: Scenario, shares: Shares): string[] {
  const o = outcomes(s, shares);
  return [splitLine(shares), ...s.claimants.map((c, i) => c.reaction[o[i]])];
}

/** How the units sat, without saying whether that was a good way to sit. */
export function describeSpread(shares: Shares): string {
  const high = Math.max(...shares);
  const low = Math.min(...shares);
  if (high === low) return 'gave everyone the same';
  if (low === 0 && shares.filter((n) => n > 0).length === 1) return 'gave it all to one person';
  if (high - low === 1) return 'gave nearly the same to everyone';
  return 'gave a lot to some and a little to others';
}

/** Two allocations on the paper: what changed, and who changed with it. */
export function compareLines(s: Scenario, first: Shares, second: Shares): string[] {
  const n = s.claimants.length;
  const a = metCount(s, first);
  const b = metCount(s, second);
  const lines = [
    `First way: ${splitLine(first)} Second way: ${splitLine(second)}`,
    `Your first way ${describeSpread(first)}. Your second way ${describeSpread(second)}.`,
    `The first way, ${people(a)} got what they asked for and ${people(n - a)} did not. The second way, ${people(b)} did and ${people(n - b)} did not.`,
  ];
  const moved = s.claimants
    .map((c, i) => ({ c, from: first[i] ?? 0, to: second[i] ?? 0 }))
    .filter((m) => m.from !== m.to);
  if (moved.length === 0) {
    lines.push('Nothing moved. The same people ended up with the same things.');
  } else {
    for (const m of moved) {
      lines.push(`${m.c.name} had ${word(m.from)} and then ${word(m.to)}.`);
    }
  }
  return lines;
}

/** The caption block under the kept plate. */
export function plateLines(s: Scenario, first: Shares, second: Shares | null): string[] {
  const lines = [`${capitalise(s.unitPlural)}: ${word(s.units)}.`, `First way: ${splitLine(first)}`];
  if (second) lines.push(`Second way: ${splitLine(second)}`);
  lines.push(s.claimants.map((c) => `${c.name} ${c.kind === 'work' ? 'did the work' : c.kind === 'small' ? 'is the smallest' : c.kind === 'promise' ? 'was told' : c.kind === 'own' ? 'owns them' : 'went without'}`).join('; '));
  return lines;
}

export const plateTitle = (s: Scenario): string =>
  `${capitalise(word(s.units))} ${s.units === 1 ? s.unit : s.unitPlural}`;
