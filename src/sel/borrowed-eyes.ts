/**
 * Borrowed Eyes — one second of the world, from two positions.
 *
 * Each moment is one painting and one PLAN. The painting is the room; the plan
 * is the same room from above, with every figure at a known position, a known
 * width and a known height, and two eye-points in it. What each position can
 * see is COMPUTED — a ray from the eye to each figure, and a figure standing in
 * the way hides it when its apparent top is higher. Both readings are true at
 * the same time. There is no primary view, and the six intent chips have no
 * key: the child places one chip per position, the tool sets the two readings
 * side by side, and never reconciles them.
 *
 * WHY THE SECOND PAINTING WENT.
 *
 * "The same second, drawn twice" was two unrelated paintings. The `circle`
 * moment shipped a bright room with a patterned kilim, a bookshelf and a
 * wooden-framed grid board against a plain floor with a rust rectangular rug, a
 * table leg and small cards: different room, rug, floor, wall, furniture and
 * game. The captions did not survive their own plates either — "four children's
 * backs closing a ring" over five children of whom three face the camera.
 *
 * So `imageId` lives on the MOMENT, not the view. A second unrelated painting
 * is unrepresentable: there is no field to put it in.
 *
 * Two crops of one plate were rejected as the replacement, and rightly: two
 * crops are the same viewpoint, parallax is not a crop, and this module's whole
 * premise is that the two positions differ in eye height and in what stands in
 * the way. Eye height and occlusion are geometry, so geometry owns them. `sees`
 * and `eyeLine` are generated from the plan and cannot be typed by hand.
 *
 * And no count is written anywhere in the prose. Every number this exercise
 * utters is counted off the plan at the moment of speaking, so "four children"
 * over five children is not a thing the data can say.
 *
 * Pure: no React, no DOM, no randomness, no storage.
 */

export const BORROWED_EYES_META = {
  id: 'borrowed-eyes',
  title: 'Borrowed Eyes',
  eyebrow: 'The same second',
  note: 'Turn the dial to stand where the other person stood, see what that position can and cannot see, and put a chip on each.',
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

/* ------------------------------------------------------------------- plan -- */

/** What a figure is. Only these four, because a plan cannot see anything else. */
export type Kind = 'child' | 'grown-up' | 'small one' | 'thing';

/** How a body is held. Spoken, and paired with a measured eye height. */
export type Stance = 'sitting' | 'kneeling' | 'standing' | 'up on tiptoe';

/**
 * One thing standing in the room, in plan. Everything is in centimetres from
 * the near-left corner of the plan; `y` grows towards the near edge.
 */
export interface Figure {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  /** Half the width of its footprint. The near face is what occludes. */
  readonly across: number;
  /** How far its top stands above the floor. */
  readonly top: number;
  readonly kind: Kind;
  /** Named, never described, and never counted. */
  readonly label: string;
}

/** One position the moment can be seen from. */
export interface Eye {
  /** The view this eye belongs to. */
  readonly viewId: string;
  /** The figure that IS the viewer, so nobody is told they can see themselves. */
  readonly self: string;
  readonly x: number;
  readonly y: number;
  /** Eye height above the floor. This is the parallax. */
  readonly height: number;
  readonly stance: Stance;
  /** Where the face points, in degrees; 0 runs along +x. */
  readonly facing: number;
  /** Half the width of the cone of attention, in degrees. */
  readonly halfAngle: number;
}

export interface Plan {
  /** Plan extent, centimetres. */
  readonly across: number;
  readonly deep: number;
  readonly figures: readonly Figure[];
  readonly eyes: readonly [Eye, Eye];
}

/* --------------------------------------------------------------- geometry -- */

const rad = (deg: number): number => (deg * Math.PI) / 180;

/** Signed difference between two bearings, folded into -180..180. */
export const turnBetween = (from: number, to: number): number => {
  let d = (to - from) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
};

export const bearingTo = (eye: Eye, f: { x: number; y: number }): number =>
  (Math.atan2(f.y - eye.y, f.x - eye.x) * 180) / Math.PI;

export const distanceTo = (eye: Eye, f: { x: number; y: number }): number =>
  Math.hypot(f.x - eye.x, f.y - eye.y);

/**
 * How high something appears to stand from this eye: the near face of an
 * extended thing is what you see over, so the drop of `across` is taken off the
 * distance before the slope is worked out.
 */
const rise = (eye: Eye, f: Figure): number => {
  const near = Math.max(1, distanceTo(eye, f) - f.across);
  return (f.top - eye.height) / near;
};

/** What one position makes of one figure. Every field is computed. */
export interface Sight {
  readonly figure: Figure;
  /** Floor distance, centimetres, whole. */
  readonly away: number;
  /** Inside the cone of attention. */
  readonly inFront: boolean;
  /** The nearest figure standing in the way, or null when nothing does. */
  readonly behind: Figure | null;
}

/**
 * Cast a ray from the eye to every figure. A figure blocks when the ray passes
 * through its footprint on the way, and when its top rises higher from here
 * than the target's does. That is the whole of the occlusion model, and it is
 * why a standing position and a sitting one disagree about a game on the floor.
 */
export const sightFrom = (plan: Plan, eye: Eye): readonly Sight[] => {
  const targets = plan.figures.filter((f) => f.id !== eye.self);
  return targets.map((target) => {
    const away = distanceTo(eye, target);
    const inFront = Math.abs(turnBetween(eye.facing, bearingTo(eye, target))) <= eye.halfAngle;
    const ux = (target.x - eye.x) / away;
    const uy = (target.y - eye.y) / away;
    const targetRise = rise(eye, target);
    let behind: Figure | null = null;
    let nearest = Infinity;
    for (const b of plan.figures) {
      if (b.id === target.id || b.id === eye.self) continue;
      const bx = b.x - eye.x;
      const by = b.y - eye.y;
      const along = bx * ux + by * uy;
      if (along <= 0 || along >= away) continue;
      const off = Math.hypot(bx - along * ux, by - along * uy);
      if (off >= b.across) continue;
      if (rise(eye, b) < targetRise) continue;
      if (along < nearest) {
        nearest = along;
        behind = b;
      }
    }
    return { figure: target, away: Math.round(away), inFront, behind };
  });
};

export const eyeFor = (plan: Plan, viewId: string): Eye => {
  const eye = plan.eyes.find((e) => e.viewId === viewId);
  if (!eye) throw new Error(`no eye for ${viewId}`);
  return eye;
};

/** In the cone and with nothing in the way, nearest first. */
export const visibleFrom = (plan: Plan, eye: Eye): readonly Sight[] =>
  sightFrom(plan, eye).filter((s) => s.inFront && !s.behind).sort((a, b) => a.away - b.away);

/** In the cone but with something standing in the way, nearest first. */
export const hiddenFrom = (plan: Plan, eye: Eye): readonly Sight[] =>
  sightFrom(plan, eye).filter((s) => s.inFront && s.behind).sort((a, b) => a.away - b.away);

/** Outside the cone of attention: there, but not where the face is pointing. */
export const asideFrom = (plan: Plan, eye: Eye): readonly Sight[] =>
  sightFrom(plan, eye).filter((s) => !s.inFront).sort((a, b) => a.away - b.away);

/* -------------------------------------------------------------- sentences -- */

/** "a, b and c". The only place a list is joined, so the commas stay put. */
export const listOf = (parts: readonly string[]): string => {
  if (parts.length === 0) return 'nothing';
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
};

/**
 * What this position can see, generated. Every noun in it came out of the plan,
 * and so did every number, so the sentence cannot outrun the room.
 */
export const seesFrom = (plan: Plan, eye: Eye): string => {
  const visible = visibleFrom(plan, eye);
  const hidden = hiddenFrom(plan, eye);
  const aside = asideFrom(plan, eye);
  const parts: string[] = [
    `From here you can see ${listOf(visible.map((s) => s.figure.label))}.`,
  ];
  // Grouped by what stands in the way, so one body does not produce one
  // sentence per thing it covers.
  const byBlocker = new Map<string, string[]>();
  for (const s of hidden) {
    const key = s.behind?.label ?? '';
    byBlocker.set(key, [...(byBlocker.get(key) ?? []), s.figure.label]);
  }
  for (const [blocker, covered] of byBlocker) {
    parts.push(`${capital(listOf(covered))} ${covered.length === 1 ? 'is' : 'are'} behind ${blocker}.`);
  }
  if (aside.length > 0) {
    parts.push(`${capital(listOf(aside.map((s) => s.figure.label)))} ${aside.length === 1 ? 'is' : 'are'} not in front of you.`);
  }
  return parts.join(' ');
};

const capital = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * How the body is and how high the eyes are, generated. The count of things
 * standing taller is measured off the plan every time it is said.
 */
export const eyeLineOf = (plan: Plan, eye: Eye): string => {
  const others = plan.figures.filter((f) => f.id !== eye.self);
  const taller = others.filter((f) => f.top > eye.height).length;
  return `${capital(eye.stance)}, your eyes ${Math.round(eye.height)} centimetres above the floor. `
    + `${taller} of the ${others.length} things in this room stand taller than that.`;
};

/* ---------------------------------------------------------------- moments -- */

/** The other person in the moment. Pronouns are carried, never inferred. */
export interface Other {
  readonly name: string;
  readonly pronoun: string;
  readonly reflexive: string;
}

/**
 * One position. It has no picture and no picture description: the moment has
 * one painting, and what this position sees is computed from the plan.
 */
export interface View {
  /** Stable within a moment; `yours` is the child's own position. */
  readonly id: string;
  /** Read aloud on the dial: whose position this is. */
  readonly whose: string;
  /** Opening of every sentence written from here. */
  readonly from: string;
  /** World-state seen from here, past tense, no gloss and no count. */
  readonly said: string;
}

export interface Moment {
  readonly id: string;
  readonly title: string;
  readonly where: string;
  readonly other: Other;
  /** games/sel/<imageId>.png — one painting for the whole moment. */
  readonly imageId: string;
  readonly alt: string;
  /** The room, measured. Both positions are points in this one plan. */
  readonly plan: Plan;
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
    imageId: 'borrowed-eyes-crayon-yours',
    alt: 'Seen from Leo’s own place at the kitchen table: his hand holding a crayon over the dinosaur he has drawn, a small hand reaching in from the side with a crayon of its own, a pot of crayons and a plate of bread beyond the paper.',
    plan: {
      across: 200,
      deep: 170,
      figures: [
        { id: 'table', x: 100, y: 80, across: 34, top: 72, kind: 'thing', label: 'the table' },
        { id: 'paper', x: 100, y: 66, across: 22, top: 73, kind: 'thing', label: 'the paper' },
        { id: 'bread', x: 62, y: 44, across: 11, top: 76, kind: 'thing', label: 'the plate of bread' },
        { id: 'crayons', x: 150, y: 44, across: 6, top: 82, kind: 'thing', label: 'the pot of crayons' },
        { id: 'leo', x: 100, y: 142, across: 17, top: 122, kind: 'child', label: 'your brother' },
        { id: 'mia', x: 34, y: 92, across: 13, top: 92, kind: 'small one', label: 'Mia' },
      ],
      eyes: [
        { viewId: 'yours', self: 'leo', x: 100, y: 142, height: 106, stance: 'sitting', facing: -90, halfAngle: 58 },
        { viewId: 'mia', self: 'mia', x: 34, y: 92, height: 76, stance: 'up on tiptoe', facing: -21, halfAngle: 58 },
      ],
    },
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you sat',
        said: 'a crayon came onto your paper from the side',
      },
      {
        id: 'mia',
        whose: 'Mia’s eyes',
        from: 'From where Mia stood',
        said: 'she was drawing on the same big sheet as her brother',
      },
    ],
  },
  {
    id: 'tower',
    title: 'The hand on the tower',
    where: 'the living room rug, late afternoon',
    other: { name: 'Mia', pronoun: 'she', reflexive: 'herself' },
    unresolved: false,
    imageId: 'borrowed-eyes-tower-yours',
    alt: 'Seen from Leo’s standing height on the rug: a block tower with the last block laid on top, a hand coming down onto it from the side, his own socked feet at the bottom of the frame, and a basket of blocks beyond.',
    plan: {
      across: 220,
      deep: 200,
      figures: [
        { id: 'tower', x: 110, y: 110, across: 12, top: 78, kind: 'thing', label: 'the tower' },
        { id: 'sofa', x: 50, y: 95, across: 40, top: 45, kind: 'thing', label: 'the sofa' },
        { id: 'basket', x: 192, y: 34, across: 18, top: 26, kind: 'thing', label: 'the basket of blocks' },
        { id: 'loose', x: 150, y: 62, across: 6, top: 6, kind: 'thing', label: 'the blocks on the rug' },
        { id: 'leo', x: 110, y: 180, across: 17, top: 118, kind: 'child', label: 'your brother' },
        { id: 'mia', x: 150, y: 120, across: 14, top: 92, kind: 'small one', label: 'Mia' },
      ],
      eyes: [
        { viewId: 'yours', self: 'leo', x: 110, y: 180, height: 112, stance: 'standing', facing: -90, halfAngle: 58 },
        { viewId: 'mia', self: 'mia', x: 150, y: 120, height: 66, stance: 'kneeling', facing: -140, halfAngle: 70 },
      ],
    },
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you stood',
        said: 'her hand came down on the roof',
      },
      {
        id: 'mia',
        whose: 'Mia’s eyes',
        from: 'From where Mia knelt',
        said: 'she was putting a piece on',
      },
    ],
  },
  {
    id: 'story',
    title: 'The middle of the story',
    where: 'the bedroom chair, bedtime',
    other: { name: 'Dad', pronoun: 'he', reflexive: 'himself' },
    unresolved: true,
    imageId: 'borrowed-eyes-story-yours',
    alt: 'Seen from Leo’s place in the reading chair: an open book across his knees, his own hand flat on the page, his father’s hand lifting off the other page, and the lit doorway beyond them.',
    plan: {
      across: 260,
      deep: 220,
      figures: [
        { id: 'chair', x: 90, y: 150, across: 40, top: 72, kind: 'thing', label: 'the chair' },
        { id: 'book', x: 90, y: 120, across: 22, top: 62, kind: 'thing', label: 'the book' },
        { id: 'lamp', x: 200, y: 90, across: 10, top: 130, kind: 'thing', label: 'the lamp' },
        { id: 'doorway', x: 30, y: 40, across: 22, top: 5, kind: 'thing', label: 'the doorway' },
        { id: 'leo', x: 90, y: 148, across: 16, top: 108, kind: 'child', label: 'the boy in the chair' },
        { id: 'dad', x: 60, y: 86, across: 20, top: 178, kind: 'grown-up', label: 'Dad' },
        { id: 'mia', x: 16, y: 14, across: 16, top: 120, kind: 'small one', label: 'Mia in her cot' },
      ],
      eyes: [
        { viewId: 'yours', self: 'leo', x: 90, y: 148, height: 96, stance: 'sitting', facing: -90, halfAngle: 58 },
        { viewId: 'dad', self: 'dad', x: 60, y: 86, height: 168, stance: 'standing', facing: -121, halfAngle: 74 },
      ],
    },
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you sat',
        said: 'the book closed in the middle of the page',
      },
      {
        id: 'dad',
        whose: 'Dad’s eyes',
        from: 'From where Dad stood',
        said: 'Mia was crying in the next room',
      },
    ],
  },
  {
    id: 'circle',
    title: 'The one outside the circle',
    where: 'the school carpet, before lunch',
    other: { name: 'Nell', pronoun: 'she', reflexive: 'herself' },
    unresolved: true,
    imageId: 'borrowed-eyes-circle-yours',
    alt: 'Seen across the classroom carpet: a ring of children sitting round a wooden grid board with dark pieces on it, a girl standing back beside the bookshelf, and tall windows behind them.',
    plan: {
      across: 400,
      deep: 340,
      figures: [
        { id: 'game', x: 200, y: 180, across: 26, top: 6, kind: 'thing', label: 'the game' },
        { id: 'leo', x: 140, y: 250, across: 20, top: 90, kind: 'child', label: 'a boy sitting in the ring' },
        { id: 'kid-a', x: 120, y: 150, across: 20, top: 92, kind: 'child', label: 'a child in the ring' },
        { id: 'kid-b', x: 200, y: 100, across: 20, top: 92, kind: 'child', label: 'a child with her back to you' },
        { id: 'kid-c', x: 275, y: 140, across: 20, top: 92, kind: 'child', label: 'a child across the ring' },
        { id: 'kid-d', x: 265, y: 245, across: 20, top: 92, kind: 'child', label: 'a child beside you' },
        { id: 'nell', x: 215, y: 15, across: 18, top: 118, kind: 'child', label: 'Nell' },
        { id: 'shelf', x: 300, y: 30, across: 40, top: 110, kind: 'thing', label: 'the bookshelf' },
        { id: 'window', x: 40, y: 20, across: 45, top: 180, kind: 'thing', label: 'the window' },
      ],
      eyes: [
        { viewId: 'yours', self: 'leo', x: 140, y: 250, height: 78, stance: 'sitting', facing: -49, halfAngle: 62 },
        { viewId: 'nell', self: 'nell', x: 215, y: 15, height: 118, stance: 'standing', facing: 95, halfAngle: 62 },
      ],
    },
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you sat',
        said: 'she stood by the shelf and did not come over',
      },
      {
        id: 'nell',
        whose: 'Nell’s eyes',
        from: 'From where Nell stood',
        said: 'the ring had no gap in it',
      },
    ],
  },
  {
    id: 'queue',
    title: 'The cut in the queue',
    where: 'the steps of the slide, the park',
    other: { name: 'Sam', pronoun: 'he', reflexive: 'himself' },
    unresolved: true,
    imageId: 'borrowed-eyes-queue-yours',
    alt: 'Seen from the foot of the slide ladder: your own hands gripping the rail across the near frame, a boy standing just beyond it facing you, and a smaller child climbing near the top of the steps.',
    plan: {
      across: 200,
      deep: 320,
      figures: [
        { id: 'rail', x: 100, y: 246, across: 9, top: 96, kind: 'thing', label: 'the rail' },
        { id: 'ladder', x: 96, y: 118, across: 7, top: 240, kind: 'thing', label: 'the ladder' },
        { id: 'trees', x: 30, y: 20, across: 40, top: 400, kind: 'thing', label: 'the trees' },
        { id: 'leo', x: 100, y: 285, across: 17, top: 118, kind: 'child', label: 'a boy at the foot of the ladder' },
        { id: 'sam', x: 128, y: 228, across: 17, top: 112, kind: 'child', label: 'Sam' },
        { id: 'small', x: 104, y: 120, across: 12, top: 200, kind: 'small one', label: 'a smaller boy up the steps' },
      ],
      eyes: [
        { viewId: 'yours', self: 'leo', x: 100, y: 285, height: 112, stance: 'standing', facing: -90, halfAngle: 58 },
        { viewId: 'sam', self: 'sam', x: 128, y: 228, height: 106, stance: 'standing', facing: -105, halfAngle: 58 },
      ],
    },
    views: [
      {
        id: 'yours',
        whose: 'Your eyes',
        from: 'From where you stood',
        said: 'he came round in front of you at the foot of the ladder',
      },
      {
        id: 'sam',
        whose: 'Sam’s eyes',
        from: 'From where Sam stood',
        said: 'his little brother was already high up on the steps',
      },
    ],
  },
];

export function momentById(id: string): Moment {
  const moment = MOMENTS.find((m) => m.id === id);
  if (!moment) throw new Error(`no moment ${id}`);
  return moment;
}

/** What this position can see in this moment. Generated, never stored. */
export const seesIn = (moment: Moment, view: View): string =>
  seesFrom(moment.plan, eyeFor(moment.plan, view.id));

/** How the body is and how high the eyes are. Generated, never stored. */
export const eyeLineIn = (moment: Moment, view: View): string =>
  eyeLineOf(moment.plan, eyeFor(moment.plan, view.id));

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

/* ------------------------------------------------- drawing the plan itself -- */

/** Where a figure lands when the plan is drawn in a box `w` by `h`. */
export interface Spot {
  readonly figure: Figure;
  readonly x: number;
  readonly y: number;
  /** Footprint radius in the same drawn units. */
  readonly r: number;
}

/** The plan, scaled into a drawing box. One scale for both axes, so it is a map. */
export const spotsIn = (plan: Plan, w: number, h: number): readonly Spot[] => {
  const k = Math.min(w / plan.across, h / plan.deep);
  return plan.figures.map((f) => ({
    figure: f,
    x: f.x * k,
    y: f.y * k,
    r: Math.max(3, f.across * k),
  }));
};

/** The two edges of an eye's cone of attention, as points on the drawing box. */
export const coneIn = (
  plan: Plan,
  eye: Eye,
  w: number,
  h: number,
): { readonly x: number; readonly y: number; readonly left: readonly [number, number]; readonly right: readonly [number, number] } => {
  const k = Math.min(w / plan.across, h / plan.deep);
  const reach = Math.hypot(plan.across, plan.deep) * k;
  const at = (deg: number): [number, number] => [
    eye.x * k + Math.cos(rad(deg)) * reach,
    eye.y * k + Math.sin(rad(deg)) * reach,
  ];
  return {
    x: eye.x * k,
    y: eye.y * k,
    left: at(eye.facing - eye.halfAngle),
    right: at(eye.facing + eye.halfAngle),
  };
};

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
