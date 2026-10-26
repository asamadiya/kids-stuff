/**
 * The Feeling Rule — a ruled scale, not a quiz.
 *
 * A family of feelings is laid out along a brass rule in order of size, from the
 * small one to the big one. The marker slides; the painted portrait above it
 * changes as it passes each stop. Then real events are dealt onto the same rule
 * and he says how big each one was FOR HIM.
 *
 * Nothing here can be right or wrong. There is deliberately no field on a stop
 * or on an event card that could hold an expected answer: a placement is a
 * self-report, and a self-report cannot be checked. Every sentence this module
 * produces is a name or a difference, in the second person, with no comment.
 */
import { emotionLabel } from '../lib/emotions';

export const THE_FEELING_RULE_META = {
  id: 'the-feeling-rule',
  title: 'The Feeling Rule',
  eyebrow: 'Sizes of a feeling',
  note: 'He slides a marker along a family of feelings, then puts real events of his own on the same rule and sees which one is bigger.',
} as const;

/** Its two sentences, one read-aloud clip each. */
const AMBIGUITY_PARTS = [
  'Two people would put the same event at different stops.',
  'This rule is yours.',
] as const;

/** Shown at the start of a rule, until the first event goes on it. Read only when the child asks. */
export const AMBIGUITY_NOTE = AMBIGUITY_PARTS.join(' ');

/* Labels on the bench, read by its buttons exactly as they are shown. */
export const FAMILY_LABEL = 'Which family of feelings';
export const SIZE_HINT = 'small on the left, big on the right';
export const MARKER_LABEL = 'The marker — drag it on the rule, or nudge it';
export const EVENT_LABEL = 'This happened — tap it to put it where the marker is';

/* ------------------------------------------------------------------ rules -- */

export interface Stop {
  /** An emotion key from src/games/emotions.ts — the portrait is shared. */
  readonly key: string;
  readonly label: string;
  /** How big this word is inside its family: 1 small … 4 biggest. */
  readonly intensity: 1 | 2 | 3 | 4;
}

export interface FeelingRule {
  readonly id: string;
  readonly label: string;
  /** Ordered small to big. Position on the rule is the index, not the intensity. */
  readonly stops: readonly Stop[];
}

const stop = (key: string, intensity: 1 | 2 | 3 | 4): Stop => ({
  key,
  label: emotionLabel(key),
  intensity,
});

export const FEELING_RULES: readonly FeelingRule[] = [
  { id: 'anger', label: 'Anger', stops: [stop('annoyed', 1), stop('frustrated', 2), stop('angry', 3)] },
  {
    id: 'fear',
    label: 'Fear',
    stops: [stop('nervous', 1), stop('worried', 2), stop('scared', 3), stop('overwhelmed', 4)],
  },
  {
    id: 'sad',
    label: 'Sad',
    stops: [stop('bored', 1), stop('disappointed', 2), stop('sad', 3), stop('lonely', 3)],
  },
  { id: 'joy', label: 'Joy', stops: [stop('happy', 1), stop('excited', 2), stop('delighted', 3)] },
] as const;

const RULE_BY_ID: Record<string, FeelingRule> = Object.fromEntries(
  FEELING_RULES.map((r) => [r.id, r]),
);

export function ruleById(id: string): FeelingRule {
  return RULE_BY_ID[id] ?? FEELING_RULES[0];
}

/* ------------------------------------------------------------- event deck -- */

export interface EventCard {
  readonly id: string;
  /** Read aloud by a grown-up, and spoken. Lower case: it is dropped into sentences. */
  readonly label: string;
  /** What the painting actually shows. */
  readonly alt: string;
}

/** Existing painted scenes, reused. No new art. */
export const EVENT_DECK: readonly EventCard[] = [
  {
    id: 'lost-game',
    label: 'the game was lost',
    alt: 'Arjun at the end of a board game he did not win, his hands still on his pieces.',
  },
  {
    id: 'blocks-knocked',
    label: 'the build came down',
    alt: 'A tall block tower spread across the floor, Arjun kneeling beside the pieces.',
  },
  {
    id: 'sister-grabs',
    label: 'Mia took it out of your hands',
    alt: 'Mia, two years old, holding on to the toy truck her brother Arjun was playing with.',
  },
  {
    id: 'dog-barks',
    label: 'a dog barked, close',
    alt: 'A big dog barking right beside Arjun on a path, Arjun leaning back.',
  },
  {
    id: 'first-day',
    label: 'a room where you knew nobody',
    alt: 'Arjun standing at the edge of a busy classroom on the first day, bag still on.',
  },
  {
    id: 'surprise-gift',
    label: 'a parcel with your name on it',
    alt: 'Arjun opening a wrapped parcel at a table, the paper half off.',
  },
] as const;

const CARD_BY_ID: Record<string, EventCard> = Object.fromEntries(
  EVENT_DECK.map((c) => [c.id, c]),
);

export function cardById(id: string): EventCard {
  return CARD_BY_ID[id] ?? EVENT_DECK[0];
}

/** Where the pictures live. Portraits and scenes are both already painted. */
export const facePath = (s: Stop): string => `games/faces/${s.key}.png`;
export const scenePath = (c: EventCard): string => `games/scenes/${c.id}.png`;

/**
 * The order the deck is dealt in for a given rule. Deterministic: the same rule
 * always deals the same cards in the same order, so nothing reshuffles under him.
 */
export function dealOrder(ruleId: string): readonly EventCard[] {
  const i = FEELING_RULES.findIndex((r) => r.id === ruleId);
  const by = ((i < 0 ? 0 : i) * 2 + 1) % EVENT_DECK.length;
  return [...EVENT_DECK.slice(by), ...EVENT_DECK.slice(0, by)];
}

export function cardAt(ruleId: string, cursor: number): EventCard {
  const order = dealOrder(ruleId);
  const n = order.length;
  return order[((cursor % n) + n) % n];
}

/* ---------------------------------------------------------- the marker -- */

/** The marker runs from 0 to the last stop, continuously, so a drag is smooth. */
export function clampPos(rule: FeelingRule, value: number): number {
  const last = rule.stops.length - 1;
  if (!Number.isFinite(value)) return 0;
  return Math.min(last, Math.max(0, value));
}

export function nearestStop(rule: FeelingRule, value: number): number {
  return Math.round(clampPos(rule, value));
}

export function stopAt(rule: FeelingRule, index: number): Stop {
  const last = rule.stops.length - 1;
  return rule.stops[Math.min(last, Math.max(0, Math.round(index)))];
}

/** The word under the marker right now. Nothing else is claimed about it. */
export function markerWord(rule: FeelingRule, value: number): string {
  return stopAt(rule, nearestStop(rule, value)).label;
}

/**
 * How solid a portrait is drawn while the marker is at `value`. The face under
 * the finger is full strength and its neighbour fades up as the marker crosses,
 * so the picture morphs rather than switching.
 */
export function faceStrength(index: number, value: number): number {
  const d = Math.abs(index - value);
  if (d >= 1) return 0.16;
  return 0.16 + (1 - d) * 0.84;
}

/* ------------------------------------------------------------------ pins -- */

export interface Pin {
  readonly eventId: string;
  readonly stop: number;
}

export const MAX_PINS = 6;

/** Placing an event twice moves its pin; it never makes a second one. */
export function addPin(pins: readonly Pin[], pin: Pin): readonly Pin[] {
  const without = pins.filter((p) => p.eventId !== pin.eventId);
  return [...without, pin].slice(-MAX_PINS);
}

export function removePin(pins: readonly Pin[], eventId: string): readonly Pin[] {
  return pins.filter((p) => p.eventId !== eventId);
}

/* -------------------------------------------------------------- readings -- */

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six'] as const;

export function stopsWord(n: number): string {
  const k = Math.abs(Math.round(n));
  const word = NUMBER_WORDS[k] ?? String(k);
  return `${word} ${k === 1 ? 'stop' : 'stops'}`;
}

const capitalise = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** "The game was lost: annoyed. The build came down: angry." Names only. */
export function pinLines(rule: FeelingRule, pins: readonly Pin[]): readonly string[] {
  return pins.map(
    (p) => `${capitalise(cardById(p.eventId).label)}: ${stopAt(rule, p.stop).label.toLowerCase()}.`,
  );
}

/**
 * The measurement between the last two pins, and nothing else: the reading
 * just above it already names both, so the bench shows and reads only this.
 */
export function compareLine(pins: readonly Pin[]): string {
  if (pins.length < 2) return '';
  const a = pins[pins.length - 2];
  const b = pins[pins.length - 1];
  const gap = b.stop - a.stop;
  if (gap === 0) return 'They sit at the same stop for you.';
  const bigger = cardById(gap > 0 ? b.eventId : a.eventId).label;
  return `${capitalise(bigger)} is ${stopsWord(gap)} bigger for you.`;
}

/** The differential between the last two pins, restating both. For the plate. A measurement, never a comment. */
export function differenceLine(rule: FeelingRule, pins: readonly Pin[]): string {
  if (pins.length < 2) return '';
  const a = pins[pins.length - 2];
  const b = pins[pins.length - 1];
  const said = `You put ${cardById(a.eventId).label} at ${stopAt(rule, a.stop).label.toLowerCase()} and ${cardById(b.eventId).label} at ${stopAt(rule, b.stop).label.toLowerCase()}.`;
  return `${said} ${compareLine(pins)}`;
}

/** Coverage, never a ratio of right to wrong. */
export function coverageLine(rulesMarked: number, pinCount: number): string {
  const rules = `You have put marks on ${rulesMarked} of the ${FEELING_RULES.length} rules`;
  const pinned = `${pinCount} ${pinCount === 1 ? 'event' : 'events'} on this one`;
  return `${rules} · ${pinned}`;
}

export function plateLines(rule: FeelingRule, pins: readonly Pin[]): readonly string[] {
  const head = `${rule.label}: ${rule.stops.map((s) => s.label.toLowerCase()).join(' · ')}`;
  const body = pins.length ? pinLines(rule, pins) : ['Nothing pinned on this rule yet.'];
  const diff = differenceLine(rule, pins);
  return diff ? [head, ...body, diff] : [head, ...body];
}

/** The drawing's description, for someone who cannot see it. Not read aloud: a read button reads only what is on screen. */
export function ruleSummary(rule: FeelingRule, pins: readonly Pin[]): string {
  const stops = rule.stops.map((s) => s.label.toLowerCase()).join(', ');
  if (!pins.length) return `The ${rule.label.toLowerCase()} rule: ${stops}. Nothing pinned yet.`;
  return `The ${rule.label.toLowerCase()} rule: ${stops}. ${pinLines(rule, pins).join(' ')}`;
}

export function keptSummary(rule: FeelingRule, pins: readonly Pin[]): string {
  return `${rule.label} · ${pins.length} ${pins.length === 1 ? 'mark' : 'marks'}`;
}

/* ---------------------------------------------------------------- listen -- */

/**
 * What each read-aloud button reads: the words on screen beside it, one atom
 * per sentence or label, in screen order. Nothing is spoken unless the child
 * presses that button (advisor a9). The bench reads and shows only through
 * these, and `listenLines` enumerates them, so a button cannot ask for a clip
 * the build did not make.
 */
export const LISTEN = {
  /** L1, beside the title. The note is for the grown-up and is not read. */
  title: (): readonly string[] => [THE_FEELING_RULE_META.title],
  /** L2, in the family tray: its label, then each family in tray order. */
  families: (): readonly string[] => [FAMILY_LABEL, ...FEELING_RULES.map((r) => r.label)],
  /** L3, under the faces: the family, the size hint, then each stop small to big. */
  rule: (rule: FeelingRule): readonly string[] => [
    rule.label,
    SIZE_HINT,
    ...rule.stops.map((s) => s.label),
  ],
  /** L4, beside the marker: its label, then the word under it now. */
  marker: (rule: FeelingRule, value: number): readonly string[] => [MARKER_LABEL, markerWord(rule, value)],
  /** L5, beside the event card: its label, then the card's caption. */
  event: (card: EventCard): readonly string[] => [EVENT_LABEL, card.label],
  /** L6, beside the note shown until the first event goes on: its two sentences. */
  note: (): readonly string[] => AMBIGUITY_PARTS,
  /** L7, beside the reading: one line per event on the rule. */
  reading: (rule: FeelingRule, pins: readonly Pin[]): readonly string[] => pinLines(rule, pins),
  /** L8, beside the difference: empty until there are two events to compare. */
  difference: (pins: readonly Pin[]): readonly string[] => {
    const line = compareLine(pins);
    return line ? [line] : [];
  },
} as const;

/** Every line a read-aloud button in this exercise can play, for the clip builder. */
export function listenLines(): string[] {
  const all: string[] = [...LISTEN.title(), ...LISTEN.families(), ...LISTEN.note()];
  for (const card of EVENT_DECK) all.push(...LISTEN.event(card));
  for (const rule of FEELING_RULES) {
    all.push(...LISTEN.rule(rule));
    rule.stops.forEach((_, i) => all.push(...LISTEN.marker(rule, i)));
    // A reading is one atom per pin, and a difference depends only on the last
    // two pins, so every pin and every ordered pair of pins covers them all.
    for (const a of EVENT_DECK) {
      rule.stops.forEach((_, i) => {
        const first: Pin = { eventId: a.id, stop: i };
        all.push(...LISTEN.reading(rule, [first]));
        for (const b of EVENT_DECK) {
          if (b.id === a.id) continue;
          rule.stops.forEach((__, j) => all.push(...LISTEN.difference([first, { eventId: b.id, stop: j }])));
        }
      });
    }
  }
  return [...new Set(all)];
}

/* ------------------------------------------------------------- geometry -- */

/** x of a stop, in the drawing's own units. Pure so the test can hold it still. */
export function stopX(index: number, count: number, x0: number, x1: number): number {
  if (count <= 1) return x0;
  return x0 + (index / (count - 1)) * (x1 - x0);
}

/** The inverse: a fraction along the rule becomes a marker position. */
export function posFromFraction(rule: FeelingRule, fraction: number): number {
  return clampPos(rule, fraction * (rule.stops.length - 1));
}
