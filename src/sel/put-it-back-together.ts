/**
 * Put It Back Together — repair as a procedure, laid out as loose panels.
 *
 * Five panels of one small disaster lie loose on the paper. The child puts them
 * in whatever order he likes and runs the strip. The guide narrates the order he
 * built; it never checks it against a canonical one. Each scenario carries a
 * single HINGE — one pair of panels whose relative order changes what the other
 * person does next — so exactly half of the 120 possible orders end with the
 * other child playing again and half end with them turned away. Both endings are
 * drawn, both are narrated in the same flat voice, and neither is called right.
 *
 * The three panels outside the hinge may sit in any of the five slots without
 * changing anything at all: that ambiguity is deliberate and is asserted in the
 * test. Nothing here scores, tallies or praises.
 *
 * Pure: no React, no DOM, no randomness. The same order always runs the same way.
 */

export const PUT_IT_BACK_TOGETHER_META = {
  id: 'put-it-back-together',
  title: 'Put It Back Together',
  eyebrow: 'After it breaks',
  note: 'He puts five loose panels in an order, runs the strip, and watches how it ends.',
} as const;

/* ----------------------------------------------------------------- panels -- */

/** The five things a repair is made of. They are moves, not virtues. */
export const PANEL_ROLES = ['stop', 'notice', 'own', 'offer', 'check'] as const;
export type PanelRole = (typeof PANEL_ROLES)[number];

/** The word a grown-up sees under each loose panel. Never an instruction. */
export const ROLE_WORD: Readonly<Record<PanelRole, string>> = {
  stop: 'stopping',
  notice: 'looking',
  own: 'saying it',
  offer: 'fixing',
  check: 'asking',
};

export interface Panel {
  readonly role: PanelRole;
  /** File at public/games/sel/<image>.png */
  readonly image: string;
  readonly alt: string;
  /** Second person, past tense, world-state only. */
  readonly line: string;
}

export interface Frame {
  readonly kind: 'opening' | 'panel' | 'ending';
  readonly image: string;
  readonly alt: string;
  readonly line: string;
}

/** The pair whose relative order decides what the other person does next. */
export interface Hinge {
  readonly before: PanelRole;
  readonly after: PanelRole;
}

export interface Scenario {
  readonly id: string;
  readonly title: string;
  /** Where it happened, for the tray label. */
  readonly where: string;
  /** The fixed establishing frame: what has already gone wrong. */
  readonly opening: Frame;
  /** Exactly five, one per role. */
  readonly panels: readonly Panel[];
  readonly hinge: Hinge;
  /** Ends with the other person back in it. One frame. */
  readonly accepted: readonly Frame[];
  /** Ends with the other person turned away. One frame, sometimes a second the next day. */
  readonly turnedAway: readonly Frame[];
  /** What some people do. One of the sixty orders that satisfy the hinge. */
  readonly alternative: readonly PanelRole[];
}

const panel = (role: PanelRole, image: string, alt: string, line: string): Panel => ({ role, image, alt, line });
const frame = (kind: Frame['kind'], image: string, alt: string, line: string): Frame => ({ kind, image, alt, line });

/* -------------------------------------------------------------- scenarios -- */

const TOWER: Scenario = {
  id: 'tower',
  title: 'The tower on the carpet',
  where: 'the classroom carpet',
  opening: frame(
    'opening',
    'put-it-back-together-tower-opening',
    'A block tower spread across a classroom carpet, and a boy in a green t-shirt stopped mid-stride beside it.',
    'You ran past the carpet. Sam’s tower came apart on the floor.',
  ),
  panels: [
    panel('stop', 'put-it-back-together-tower-stop',
      'The boy standing still with both feet planted, arms down, the blocks around his shoes.',
      'You stopped. Your feet stopped moving.'),
    panel('notice', 'put-it-back-together-tower-notice',
      'The boy turned towards another child who is looking down at the fallen blocks.',
      'You looked at Sam. He was looking at the blocks.'),
    panel('own', 'put-it-back-together-tower-own',
      'The boy speaking to the other child, one hand open towards the spilled tower.',
      'You said it was you who knocked it over.'),
    panel('offer', 'put-it-back-together-tower-offer',
      'The boy kneeling with a block in each hand, starting to stack again.',
      'You put your hands on the blocks to build it again.'),
    panel('check', 'put-it-back-together-tower-check',
      'The boy crouched at the other child’s level, waiting, hands still.',
      'You asked him if he was all right, and waited.'),
  ],
  hinge: { before: 'own', after: 'check' },
  accepted: [
    frame('ending', 'put-it-back-together-tower-accepted',
      'Two boys kneeling on the carpet stacking blocks together, the tower half rebuilt.',
      'Sam put a block on top of yours. You built the rest of it together.'),
  ],
  turnedAway: [
    frame('ending', 'put-it-back-together-tower-turned',
      'The other child carrying an armful of blocks to the far side of the carpet, back turned.',
      'Sam carried two blocks to the other side of the carpet. He built there until the bell.'),
    frame('ending', 'put-it-back-together-tower-nextday',
      'The next morning: the other child building alone, moving his box of blocks a little as the boy sits down.',
      'The next morning Sam was building again. He moved his box a little when you sat down.'),
  ],
  alternative: ['stop', 'notice', 'own', 'offer', 'check'],
};

const DRAWING: Scenario = {
  id: 'drawing',
  title: 'The drawing that tore',
  where: 'the table by the window',
  opening: frame(
    'opening',
    'put-it-back-together-drawing-opening',
    'A crayon drawing torn across the middle on a classroom table, a boy in a green t-shirt still holding one edge.',
    'You pulled the paper towards you. Nina’s drawing tore across the middle.',
  ),
  panels: [
    panel('stop', 'put-it-back-together-drawing-stop',
      'The boy letting go of the paper, both hands lifting off the table.',
      'You let go of the paper.'),
    panel('notice', 'put-it-back-together-drawing-notice',
      'The boy looking at a girl who is holding the two halves of her drawing.',
      'You looked at Nina. She was holding the two halves.'),
    panel('own', 'put-it-back-together-drawing-own',
      'The boy speaking to the girl across the table, one hand resting near the tear.',
      'You said you pulled it and it tore.'),
    panel('offer', 'put-it-back-together-drawing-offer',
      'The boy at the supply shelf lifting down a roll of tape.',
      'You went and got the tape.'),
    panel('check', 'put-it-back-together-drawing-check',
      'The boy standing at the girl’s elbow, waiting for her to answer.',
      'You asked her if she still wanted it, and waited.'),
  ],
  hinge: { before: 'own', after: 'offer' },
  accepted: [
    frame('ending', 'put-it-back-together-drawing-accepted',
      'The girl holding the two halves together while the boy runs a strip of tape along the tear.',
      'Nina held the halves together while you ran the tape along the tear. She drew a line over the tape so it looked like a road.'),
  ],
  turnedAway: [
    frame('ending', 'put-it-back-together-drawing-turned',
      'The girl folding the torn halves into her tray and starting a fresh sheet with one arm curved around it.',
      'Nina folded the two halves into her tray. She started a new drawing with her arm around it.'),
  ],
  alternative: ['stop', 'own', 'notice', 'offer', 'check'],
};

const PLAYDATE: Scenario = {
  id: 'playdate',
  title: 'The bird at Oscar’s house',
  where: 'a play date at Oscar’s house',
  opening: frame(
    'opening',
    'put-it-back-together-playdate-opening',
    'A small clay bird in two pieces on a rug in an unfamiliar living room, a boy in a green t-shirt beside a low shelf.',
    'You were at Oscar’s house. The clay bird slid off the shelf and one wing broke off.',
  ),
  panels: [
    panel('stop', 'put-it-back-together-playdate-stop',
      'The boy standing very still by the shelf, hands down at his sides.',
      'You put your hands down at your sides.'),
    panel('notice', 'put-it-back-together-playdate-notice',
      'The boy looking at another child who is looking at the two pieces on the rug.',
      'You looked at Oscar. He was looking at the two pieces on the rug.'),
    panel('own', 'put-it-back-together-playdate-own',
      'The boy speaking to the other child, pointing back at the empty place on the shelf.',
      'You said you had taken it down to look at it.'),
    panel('offer', 'put-it-back-together-playdate-offer',
      'The boy kneeling on the rug gathering both clay pieces carefully into one palm.',
      'You knelt and gathered both pieces into your hand.'),
    panel('check', 'put-it-back-together-playdate-check',
      'The boy turned to the other child, waiting, the doorway to the kitchen behind them.',
      'You asked Oscar if he wanted his mum, and waited.'),
  ],
  hinge: { before: 'stop', after: 'offer' },
  accepted: [
    frame('ending', 'put-it-back-together-playdate-accepted',
      'A woman setting the bird and its wing into a bowl on a high shelf while the two boys pull out a marble run.',
      'Oscar’s mum put the bird and the wing in a bowl on the high shelf and said she would glue it after dinner. Oscar got out the marble run.'),
  ],
  turnedAway: [
    frame('ending', 'put-it-back-together-playdate-turned',
      'The other child carrying the two pieces into the kitchen alone; the boy waiting in the hallway by the coats.',
      'Oscar carried the two pieces to the kitchen by himself. You waited in the hall until your dad came.'),
    frame('ending', 'put-it-back-together-playdate-nextday',
      'A week later: the mended clay bird back on the shelf with a thin grey line across one wing, the other child showing it to the boy.',
      'A week later the bird was back on the shelf with a thin grey line across the wing. Oscar showed it to you before he showed you anything else.'),
  ],
  alternative: ['stop', 'notice', 'offer', 'own', 'check'],
};

const MIA: Scenario = {
  id: 'mia',
  title: 'The blocks you said you would build',
  where: 'home, after your show',
  opening: frame(
    'opening',
    'put-it-back-together-mia-opening',
    'A toddler in a yellow romper sitting alone by a box of blocks in a living room, a bedroom door shut behind her.',
    'You told Mia you would build with her after your show. When it finished you went to your room and shut the door.',
  ),
  panels: [
    panel('stop', 'put-it-back-together-mia-stop',
      'The boy in his room setting down the toy he was holding on the bed.',
      'You put down what you were holding.'),
    panel('notice', 'put-it-back-together-mia-notice',
      'The boy in the doorway looking at his little sister, who sits with her back to him by the blocks.',
      'You looked at Mia. She was sitting by the blocks with her back to the door.'),
    panel('own', 'put-it-back-together-mia-own',
      'The boy crouched near his sister, talking to her at her height.',
      'You said you had told her you would come, and you had not come.'),
    panel('offer', 'put-it-back-together-mia-offer',
      'The boy carrying the box of blocks across the rug and sitting down on the floor with it.',
      'You carried the block box over and sat down on the floor.'),
    panel('check', 'put-it-back-together-mia-check',
      'The boy sitting cross-legged, hands in his lap, waiting for his sister to answer.',
      'You asked her if she still wanted to play, and waited.'),
  ],
  hinge: { before: 'stop', after: 'own' },
  accepted: [
    frame('ending', 'put-it-back-together-mia-accepted',
      'The boy and his little sister sitting together on the rug, her hand placing a block on his stack.',
      'Mia put a block on top of yours. You built until dinner.'),
  ],
  turnedAway: [
    frame('ending', 'put-it-back-together-mia-turned',
      'The little sister carrying two blocks to her father and climbing onto his knee, facing away.',
      'Mia took two blocks to your dad and played on his knee. She did not look over.'),
  ],
  alternative: ['notice', 'stop', 'own', 'check', 'offer'],
};

export const SCENARIOS: readonly Scenario[] = [TOWER, DRAWING, PLAYDATE, MIA];

export function scenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function panelOf(scenario: Scenario, role: PanelRole): Panel {
  const found = scenario.panels.find((p) => p.role === role);
  if (!found) throw new Error(`${scenario.id} has no ${role} panel`);
  return found;
}

/* ------------------------------------------------------------- the strip -- */

/** A strip in progress. Five slots, each holding a role or nothing. */
export type Slots = readonly (PanelRole | null)[];

export const EMPTY_SLOTS: Slots = [null, null, null, null, null];

export const looseRoles = (slots: Slots): readonly PanelRole[] =>
  PANEL_ROLES.filter((r) => !slots.includes(r));

export const isFull = (slots: Slots): boolean => slots.every((s) => s !== null);

/** The order in the slots, or null while any slot is still empty. */
export function orderOf(slots: Slots): readonly PanelRole[] | null {
  return isFull(slots) ? (slots as readonly PanelRole[]) : null;
}

/** Put a role in the first empty slot. Returns the slots unchanged if there is none. */
export function place(slots: Slots, role: PanelRole): Slots {
  if (slots.includes(role)) return slots;
  const i = slots.indexOf(null);
  if (i < 0) return slots;
  return slots.map((s, k) => (k === i ? role : s));
}

/** Put a role in a named slot, sending whatever was there back to the pile. */
export function placeAt(slots: Slots, index: number, role: PanelRole): Slots {
  if (index < 0 || index >= slots.length) return slots;
  return slots.map((s, k) => (k === index ? role : s === role ? null : s));
}

/** Take the panel out of a slot and back onto the paper. */
export function lift(slots: Slots, index: number): Slots {
  if (index < 0 || index >= slots.length) return slots;
  return slots.map((s, k) => (k === index ? null : s));
}

/** Swap a filled slot with its neighbour: the keyboard way to reorder. */
export function shift(slots: Slots, index: number, direction: -1 | 1): Slots {
  const to = index + direction;
  if (index < 0 || index >= slots.length || to < 0 || to >= slots.length) return slots;
  return slots.map((s, k) => (k === index ? slots[to] : k === to ? slots[index] : s));
}

/* --------------------------------------------------------------- running -- */

/**
 * Does this order end with the other person back in it? Decided only by the
 * scenario's hinge, so sixty of the hundred and twenty orders do and sixty do
 * not. Nothing about this is a score: it selects which drawing comes last.
 */
export function isAccepted(scenario: Scenario, order: readonly PanelRole[]): boolean {
  const before = order.indexOf(scenario.hinge.before);
  const after = order.indexOf(scenario.hinge.after);
  if (before < 0 || after < 0) return false;
  return before < after;
}

/** The frames the strip plays: his five panels in his order, then the ending. */
export function runOf(scenario: Scenario, order: readonly PanelRole[]): readonly Frame[] {
  const panels = order.map((role) => {
    const p = panelOf(scenario, role);
    return frame('panel', p.image, p.alt, p.line);
  });
  const ending = isAccepted(scenario, order) ? scenario.accepted : scenario.turnedAway;
  return [...panels, ...ending];
}

/** The read-aloud of the order he made, and nothing else. */
export function narrate(scenario: Scenario, order: readonly PanelRole[]): string {
  return runOf(scenario, order).map((f) => f.line).join(' ');
}

/** The last thing that happened in this run: the world after the strip. */
export function lastLineOf(scenario: Scenario, order: readonly PanelRole[]): string {
  const frames = runOf(scenario, order);
  return frames.length > 0 ? frames[frames.length - 1].line : '';
}

/** The faded strip below his: what some people do. */
export const alternativeFrames = (scenario: Scenario): readonly Frame[] =>
  scenario.alternative.map((role) => {
    const p = panelOf(scenario, role);
    return frame('panel', p.image, p.alt, p.line);
  });

/* -------------------------------------------------------------- coverage -- */

/** Which drawn ending a run arrived at. Two exist per scenario. */
export const endingKey = (scenarioId: string, accepted: boolean): string =>
  `${scenarioId}:${accepted ? 'again' : 'away'}`;

export const TOTAL_ENDINGS = SCENARIOS.length * 2;

export interface Coverage {
  readonly seen: number;
  readonly total: number;
  readonly line: string;
}

/** A measure of how much of the section he has walked through. Never a ratio of right to wrong. */
export function coverageOf(keys: readonly string[]): Coverage {
  const known = new Set<string>();
  for (const s of SCENARIOS) {
    known.add(endingKey(s.id, true));
    known.add(endingKey(s.id, false));
  }
  const seen = new Set(keys.filter((k) => known.has(k))).size;
  return { seen, total: TOTAL_ENDINGS, line: `You have seen ${seen} of the ${TOTAL_ENDINGS} endings.` };
}

/* --------------------------------------------------------------- scatter -- */

export interface Scatter {
  readonly dx: number;
  readonly dy: number;
  readonly rot: number;
}

/** A stable hash, so the loose panels lie the same way every time he comes back. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** Where a loose panel lies on the paper before he picks it up. Deterministic. */
export function scatterOf(scenarioId: string, role: PanelRole): Scatter {
  const h = hash(`${scenarioId}/${role}`);
  return {
    dx: ((h >>> 3) % 13) - 6,
    dy: ((h >>> 9) % 11) - 5,
    rot: (((h >>> 15) % 9) - 4) * 0.7,
  };
}

/* ---------------------------------------------------------------- plates -- */

/** The lines printed under a kept strip. Measured and flat. */
export function plateLines(scenario: Scenario, order: readonly PanelRole[]): readonly string[] {
  const words = order.map((r) => ROLE_WORD[r]).join(', ');
  return [`${scenario.where}: ${words}`, lastLineOf(scenario, order)];
}

export const plateTitle = (scenario: Scenario): string => `${PUT_IT_BACK_TOGETHER_META.title} — ${scenario.title}`;
