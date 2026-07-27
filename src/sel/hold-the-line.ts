/**
 * Hold the Line — assertion and boundaries.
 *
 * Something is being taken, touched, teased or pressed. He builds a sentence
 * out of wordless chips in a three-part frame, says it out loud, and the other
 * person either stops or does not. Nothing here is scored: there is no correct
 * sentence, only a stronger and a softer one, and leaving is not weaker than
 * staying — it is a different road with its own consequence.
 *
 * Pure module. No React, no DOM.
 */

export const HOLDTHELINE_META = {
  id: 'hold-the-line',
  title: 'Hold the Line',
  eyebrow: 'Say the line',
  note: 'He builds a sentence out of pictures, says it out loud, and sees what the other person does next.',
} as const;

/* ------------------------------------------------------------------ chips -- */

export type SlotKind = 'name' | 'ask' | 'next';
export type NextKind = 'escalate' | 'exit' | 'stay';

export type ChipId =
  | 'n-mine' | 'n-unfinished' | 'n-my-turn' | 'n-true' | 'n-not-true' | 'n-dont-like'
  | 'a-put-down' | 'a-stop' | 'a-wait' | 'a-give-back' | 'a-talk-normal' | 'a-laugh-too'
  | 'x-get-adult' | 'x-say-again' | 'x-elsewhere' | 'x-done' | 'x-thats-all';

export type GlyphId =
  | 'hand-on-thing' | 'half-tower' | 'clock-wedge' | 'rule-dot' | 'rule-crossed' | 'flat-palm-figure'
  | 'palm-under' | 'stop-palm' | 'hourglass' | 'return-arrow' | 'voice-wave' | 'two-figures'
  | 'adult-and-child' | 'repeat-arrow' | 'doorway' | 'closed-door' | 'full-stop';

export interface Chip {
  readonly id: ChipId;
  readonly slot: SlotKind;
  /** How much of a push the chip carries. Never a mark out of anything. */
  readonly force: number;
  /** What the guide says when the chip lands. Scenarios may say it differently. */
  readonly words: string;
  readonly glyph: GlyphId;
  /** Only the third slot carries a kind: pushing on, leaving, or stopping there. */
  readonly next: NextKind | null;
}

export const CHIPS: readonly Chip[] = [
  { id: 'n-mine', slot: 'name', force: 2, words: 'That is mine.', glyph: 'hand-on-thing', next: null },
  { id: 'n-unfinished', slot: 'name', force: 2, words: 'It is not finished.', glyph: 'half-tower', next: null },
  { id: 'n-my-turn', slot: 'name', force: 2, words: 'It is my turn.', glyph: 'clock-wedge', next: null },
  { id: 'n-true', slot: 'name', force: 1, words: 'That is true.', glyph: 'rule-dot', next: null },
  { id: 'n-not-true', slot: 'name', force: 2, words: 'That is not true.', glyph: 'rule-crossed', next: null },
  { id: 'n-dont-like', slot: 'name', force: 2, words: 'I do not like that.', glyph: 'flat-palm-figure', next: null },

  { id: 'a-put-down', slot: 'ask', force: 1, words: 'Please put it down.', glyph: 'palm-under', next: null },
  { id: 'a-stop', slot: 'ask', force: 2, words: 'Please stop.', glyph: 'stop-palm', next: null },
  { id: 'a-wait', slot: 'ask', force: 1, words: 'Please wait.', glyph: 'hourglass', next: null },
  { id: 'a-give-back', slot: 'ask', force: 2, words: 'Please give it back.', glyph: 'return-arrow', next: null },
  { id: 'a-talk-normal', slot: 'ask', force: 2, words: 'Please talk to me the way you talk to everyone else.', glyph: 'voice-wave', next: null },
  { id: 'a-laugh-too', slot: 'ask', force: 2, words: 'You can laugh. I like it too.', glyph: 'two-figures', next: null },

  { id: 'x-get-adult', slot: 'next', force: 3, words: 'If you do not, I will get a grown-up.', glyph: 'adult-and-child', next: 'escalate' },
  { id: 'x-say-again', slot: 'next', force: 2, words: 'If you do not, I will say it again.', glyph: 'repeat-arrow', next: 'escalate' },
  { id: 'x-elsewhere', slot: 'next', force: 0, words: 'I will play over here instead.', glyph: 'doorway', next: 'exit' },
  { id: 'x-done', slot: 'next', force: 0, words: 'I am done talking about this.', glyph: 'closed-door', next: 'exit' },
  { id: 'x-thats-all', slot: 'next', force: 1, words: 'That is all I wanted to say.', glyph: 'full-stop', next: 'stay' },
];

const CHIP_INDEX: ReadonlyMap<ChipId, Chip> = new Map(CHIPS.map((c) => [c.id, c]));

export function chipById(id: ChipId): Chip | undefined {
  return CHIP_INDEX.get(id);
}

export const SLOT_LABELS: Readonly<Record<SlotKind, string>> = {
  name: 'Name the thing',
  ask: 'Ask for the change',
  next: 'What next',
};

/* ----------------------------------------------------------------- glyphs -- */

/** Wordless marks, drawn on a 32 by 32 field, stroked in ink. */
export const GLYPHS: Readonly<Record<GlyphId, readonly string[]>> = {
  'hand-on-thing': ['M7 20h18v6H7z', 'M11 20v-6', 'M15 20v-8', 'M19 20v-7', 'M9 20q7-5 14 0'],
  'half-tower': ['M8 26h16v-6H8z', 'M11 20h10v-6H11z', 'M14 10h7v4h-7z'],
  'clock-wedge': ['M16 5a11 11 0 1 0 .1 0', 'M16 16V9', 'M16 16h7'],
  'rule-dot': ['M6 21h20', 'M16 13a2 2 0 1 0 .1 0'],
  'rule-crossed': ['M6 21h20', 'M10 8l12 12', 'M22 8L10 20'],
  'flat-palm-figure': ['M12 9a3 3 0 1 0 .1 0', 'M12 12v10', 'M12 15h6', 'M20 11v9'],
  'palm-under': ['M11 6h10v6H11z', 'M16 14v5', 'M13.5 16.5l2.5 2.5 2.5-2.5', 'M9 22q7 5 14 0'],
  'stop-palm': ['M10 26v-8a2 2 0 0 1 4 0', 'M14 18V9a2 2 0 0 1 4 0', 'M18 18v-7a2 2 0 0 1 4 0', 'M22 18v3a6 6 0 0 1-12 0'],
  hourglass: ['M10 6h12', 'M10 26h12', 'M10 6l12 20', 'M22 6L10 26'],
  'return-arrow': ['M23 13a8 8 0 1 0-2 9', 'M23 8v5h-5', 'M8 24h12'],
  'voice-wave': ['M9 16q4-6 8 0', 'M20 10q4 6 0 12', 'M24 7q6 9 0 18'],
  'two-figures': ['M12 10a2.5 2.5 0 1 0 .1 0', 'M12 13v8', 'M9 25l3-4 3 4', 'M21 10a2.5 2.5 0 1 0 .1 0', 'M21 13v8', 'M18 25l3-4 3 4'],
  'adult-and-child': ['M11 8a3 3 0 1 0 .1 0', 'M11 11v10', 'M7 26l4-5 4 5', 'M22 15a2 2 0 1 0 .1 0', 'M22 17v5', 'M19 26l3-4 3 4', 'M15 17h4'],
  'repeat-arrow': ['M23 16a7 7 0 1 1-4-6.3', 'M19 6v4h-4'],
  doorway: ['M10 26V8h12v18', 'M13 17h9', 'M19 14l3 3-3 3'],
  'closed-door': ['M10 26V7h12v19', 'M19 17a1 1 0 1 0 .1 0', 'M7 26h18'],
  'full-stop': ['M6 18h13', 'M24 18a2 2 0 1 0 .1 0'],
};

/* -------------------------------------------------------------- scenarios -- */

export interface Panel {
  /** The picture file, at games/sel/<panel>.png */
  readonly panel: string;
  readonly alt: string;
  /** Read aloud. World-state in the second person, past tense. */
  readonly says: string;
}

export interface Scenario {
  readonly id: string;
  /** Where he is. Shown and spoken; never a category of behaviour. */
  readonly where: string;
  readonly setup: Panel;
  readonly names: readonly ChipId[];
  readonly asks: readonly ChipId[];
  readonly nexts: readonly ChipId[];
  /** How this place says a chip, when the plain words do not fit. */
  readonly lines?: Readonly<Partial<Record<ChipId, string>>>;
  /** How much a chip counts here. A tease is not moved by the same push a toy is. */
  readonly weights?: Readonly<Partial<Record<ChipId, number>>>;
  /** The push at which this person stops. Not a pass mark: some never stop. */
  readonly yieldsAt: number;
  readonly stops: Panel;
  readonly goesOn: Panel;
  readonly left: Panel;
}

const P = 'hold-the-line';

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'dino',
    where: 'On the rug at home',
    setup: {
      panel: `${P}-dino-setup`,
      alt: 'Leo kneeling on a rug beside a half-built toy dinosaur, with Mia reaching one hand onto its tail.',
      says: 'Mia has her hand on the dinosaur you are still building.',
    },
    names: ['n-mine', 'n-unfinished', 'n-my-turn', 'n-dont-like'],
    asks: ['a-put-down', 'a-stop', 'a-wait', 'a-give-back'],
    nexts: ['x-get-adult', 'x-say-again', 'x-elsewhere', 'x-thats-all'],
    lines: {
      'n-my-turn': 'I am using it right now.',
      'a-give-back': 'Please give me that piece.',
      'x-get-adult': 'If you do not, I will get Dad.',
      'x-elsewhere': 'I will build over here instead.',
    },
    yieldsAt: 5,
    stops: {
      panel: `${P}-dino-stops`,
      alt: 'Mia sitting back on her heels with both hands in her lap while Leo holds a loose dinosaur piece.',
      says: 'She let go. One piece came off in her hand and you put it back on.',
    },
    goesOn: {
      panel: `${P}-dino-goes-on`,
      alt: 'Mia pulling at the toy dinosaur with both hands as two pieces fall onto the rug beside Leo.',
      says: 'She did not let go. She pulled, and two pieces came off onto the rug.',
    },
    left: {
      panel: `${P}-dino-left`,
      alt: 'Leo carrying a box of pieces to the low table while Mia stays on the rug holding part of the dinosaur.',
      says: 'You went to build at the table. Mia stayed on the rug and carried a piece of it away.',
    },
  },
  {
    id: 'controller',
    where: "At Sam's house",
    setup: {
      panel: `${P}-controller-setup`,
      alt: "Leo on a sofa with empty hands while another boy beside him holds the game controller and looks at the screen.",
      says: 'Sam has taken the controller while your turn is still going.',
    },
    names: ['n-mine', 'n-my-turn', 'n-unfinished', 'n-dont-like'],
    asks: ['a-give-back', 'a-stop', 'a-wait', 'a-put-down'],
    nexts: ['x-get-adult', 'x-say-again', 'x-elsewhere', 'x-done', 'x-thats-all'],
    lines: {
      'n-mine': 'That is my controller.',
      'n-unfinished': 'My turn is not finished.',
      'x-get-adult': 'If you do not, I will ask your mum.',
      'x-elsewhere': 'I will go and do something else.',
    },
    yieldsAt: 5,
    stops: {
      panel: `${P}-controller-stops`,
      alt: 'Sam holding out the controller to Leo with both hands, then sitting back with his arms folded.',
      says: 'He gave the controller back. He watched the rest of your turn without saying anything.',
    },
    goesOn: {
      panel: `${P}-controller-goes-on`,
      alt: 'Sam leaning forward playing the game while Leo sits beside him watching the screen with empty hands.',
      says: 'He kept playing. Your turn ended while he was holding it.',
    },
    left: {
      panel: `${P}-controller-left`,
      alt: 'Leo standing at a fish tank across the room with his back to the sofa where Sam is still playing.',
      says: 'You put your hands down and went to look at the fish tank. Sam played on.',
    },
  },
  {
    id: 'tease',
    where: 'At recess',
    setup: {
      panel: `${P}-tease-setup`,
      alt: 'Two children at a low outdoor table laughing and pointing at the dinosaur lunchbox in front of Leo.',
      says: 'Two children are laughing about your dinosaur lunchbox. It does have a dinosaur on it.',
    },
    names: ['n-true', 'n-not-true', 'n-mine', 'n-dont-like'],
    asks: ['a-stop', 'a-talk-normal', 'a-laugh-too', 'a-wait'],
    nexts: ['x-get-adult', 'x-say-again', 'x-elsewhere', 'x-done', 'x-thats-all'],
    lines: {
      'n-true': 'Yes, it does.',
      'n-not-true': 'It does not.',
      'n-mine': 'It is my lunchbox.',
      'a-talk-normal': 'Please say it to my face and not in that voice.',
      'a-laugh-too': 'You can laugh. I like the dinosaur too.',
      'a-wait': 'Please wait until I have eaten.',
      'x-elsewhere': 'I will eat over there instead.',
    },
    // Denial is the one move that feeds a tease, so here it carries nothing.
    weights: { 'n-true': 3, 'n-not-true': 0, 'n-mine': 1, 'n-dont-like': 1 },
    yieldsAt: 6,
    stops: {
      panel: `${P}-tease-stops`,
      alt: 'The two children turning back to their own food at the table while Leo opens his lunchbox.',
      says: 'They stopped. One of them said her lunchbox had a horse on it last year.',
    },
    goesOn: {
      panel: `${P}-tease-goes-on`,
      alt: 'The two children leaning towards each other laughing louder while Leo sits still with his lunchbox closed.',
      says: 'They said it again, louder, and one of them copied your voice.',
    },
    left: {
      panel: `${P}-tease-left`,
      alt: 'Leo walking away across the yard carrying his lunchbox towards the climbing frame.',
      says: 'You walked to the climbing frame. They laughed behind you for a while and then stopped.',
    },
  },
  {
    id: 'swap',
    where: 'On the classroom carpet',
    setup: {
      panel: `${P}-swap-setup`,
      alt: 'A boy kneeling on a classroom carpet holding out a card with an open hand towards Leo, who holds his own card.',
      says: 'Ben wants to swap. He is holding out his card with his hand open, waiting.',
    },
    names: ['n-mine', 'n-not-true', 'n-unfinished', 'n-dont-like'],
    asks: ['a-stop', 'a-wait', 'a-put-down', 'a-talk-normal'],
    nexts: ['x-get-adult', 'x-say-again', 'x-elsewhere', 'x-done', 'x-thats-all'],
    lines: {
      'n-not-true': 'No. Not this one.',
      'n-unfinished': 'I am still playing with it.',
      'n-dont-like': 'I do not want to swap.',
      'a-stop': 'Please stop asking.',
      'a-wait': 'Please ask someone else.',
      'a-put-down': 'Please put your card away.',
      'a-talk-normal': 'Please listen when I say no.',
      'x-elsewhere': 'I will play over in the reading corner.',
    },
    yieldsAt: 5,
    stops: {
      panel: `${P}-swap-stops`,
      alt: 'Ben putting his card into his pocket and turning to another child sitting further along the carpet.',
      says: 'He put his card in his pocket. He asked someone else instead, and they swapped.',
    },
    goesOn: {
      panel: `${P}-swap-goes-on`,
      alt: "Ben leaning closer with his hand out over Leo's card while Leo keeps one hand on it.",
      says: 'He asked four more times, and then picked your card up off the carpet to look at it.',
    },
    left: {
      panel: `${P}-swap-left`,
      alt: 'Leo sitting alone in the reading corner with his card on his knee while the carpet group carries on behind him.',
      says: 'You took your card to the reading corner. Ben swapped with someone else and they both laughed.',
    },
  },
  {
    id: 'baby-voice',
    where: 'At the market on Saturday',
    setup: {
      panel: `${P}-baby-voice-setup`,
      alt: 'A grown-up bending down close to Leo at a market stall, hands on knees, speaking to him while a parent stands behind.',
      says: 'A grown-up you have met twice is bending down and talking to you in a baby voice.',
    },
    names: ['n-dont-like', 'n-true', 'n-not-true'],
    asks: ['a-talk-normal', 'a-stop', 'a-wait'],
    nexts: ['x-get-adult', 'x-say-again', 'x-elsewhere', 'x-done', 'x-thats-all'],
    lines: {
      'n-true': 'I am five.',
      'n-not-true': 'I am not a baby.',
      'a-wait': 'Please wait until I have finished talking.',
      'x-get-adult': 'If you do not, I will ask my parent to tell you.',
      'x-elsewhere': 'I will go and stand by the apples.',
      'x-done': 'I am finished talking now.',
    },
    weights: { 'n-true': 2 },
    // Only the whole line moves a grown-up who has decided how old you are.
    yieldsAt: 7,
    stops: {
      panel: `${P}-baby-voice-stops`,
      alt: 'The grown-up standing up straight and speaking to Leo at normal height while the parent watches.',
      says: 'She stood up straight and asked about your morning in her ordinary voice.',
    },
    goesOn: {
      panel: `${P}-baby-voice-goes-on`,
      alt: 'The grown-up smiling past Leo at his parent and bending down towards him again.',
      says: 'She smiled at your parent over your head and did the voice again.',
    },
    left: {
      panel: `${P}-baby-voice-left`,
      alt: 'Leo standing close beside his parent at a crate of apples, looking at the fruit, the grown-up further off.',
      says: 'You went and stood by your parent and looked at the apples until she had gone.',
    },
  },
];

/* ---------------------------------------------------------------- the line -- */

export interface Pick {
  readonly name: ChipId | null;
  readonly ask: ChipId | null;
  readonly next: ChipId | null;
}

export const EMPTY_PICK: Pick = { name: null, ask: null, next: null };

export type Outcome = 'stops' | 'goes-on' | 'left';

export function scenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function chipsFor(scenario: Scenario, slot: SlotKind): readonly Chip[] {
  const ids = slot === 'name' ? scenario.names : slot === 'ask' ? scenario.asks : scenario.nexts;
  const out: Chip[] = [];
  for (const id of ids) {
    const chip = chipById(id);
    if (chip) out.push(chip);
  }
  return out;
}

/** What this chip says in this place. */
export function wordsFor(scenario: Scenario, id: ChipId): string {
  return scenario.lines?.[id] ?? chipById(id)?.words ?? '';
}

/** What this chip carries in this place. */
export function forceOf(scenario: Scenario, id: ChipId): number {
  const override = scenario.weights?.[id];
  return override ?? chipById(id)?.force ?? 0;
}

export function isComplete(pick: Pick): boolean {
  return pick.name !== null && pick.ask !== null && pick.next !== null;
}

export function lineOf(scenario: Scenario, pick: Pick): string {
  return [pick.name, pick.ask, pick.next]
    .map((id) => (id ? wordsFor(scenario, id) : ''))
    .filter((w) => w.length > 0)
    .join(' ');
}

export function strengthOf(scenario: Scenario, pick: Pick): number {
  return [pick.name, pick.ask, pick.next]
    .reduce((sum, id) => sum + (id ? forceOf(scenario, id) : 0), 0);
}

export function nextKindOf(pick: Pick): NextKind | null {
  return pick.next ? chipById(pick.next)?.next ?? null : null;
}

/**
 * Leaving is its own road: it ends the scene whatever else was said, and it is
 * never measured against the pushing road.
 */
export function outcomeOf(scenario: Scenario, pick: Pick): Outcome | null {
  if (!isComplete(pick)) return null;
  if (nextKindOf(pick) === 'exit') return 'left';
  return strengthOf(scenario, pick) >= scenario.yieldsAt ? 'stops' : 'goes-on';
}

export function panelFor(scenario: Scenario, outcome: Outcome): Panel {
  return outcome === 'stops' ? scenario.stops : outcome === 'goes-on' ? scenario.goesOn : scenario.left;
}

/** Every line this place allows. Used to check a place has real room in it. */
export function allPicks(scenario: Scenario): readonly Pick[] {
  const out: Pick[] = [];
  for (const name of scenario.names) {
    for (const ask of scenario.asks) {
      for (const next of scenario.nexts) out.push({ name, ask, next });
    }
  }
  return out;
}

export function maxStrength(scenario: Scenario): number {
  return allPicks(scenario).reduce((best, p) => Math.max(best, strengthOf(scenario, p)), 0);
}

/** The strongest line this place allows. Ties keep the first found, so it is fixed. */
export function strongestPick(scenario: Scenario): Pick {
  let best = allPicks(scenario)[0];
  let bestForce = strengthOf(scenario, best);
  for (const p of allPicks(scenario)) {
    const f = strengthOf(scenario, p);
    if (f > bestForce) { best = p; bestForce = f; }
  }
  return best;
}

/* -------------------------------------------------------- paper and plates -- */

/** Break a sentence into lines of at most `perLine` characters, keeping word order. */
export function wrapText(text: string, perLine: number): readonly string[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line.length === 0) line = w;
    else if (line.length + 1 + w.length <= perLine) line = `${line} ${w}`;
    else { lines.push(line); line = w; }
  }
  if (line.length > 0) lines.push(line);
  return lines;
}

export function heldLabel(heldMs: number): string {
  return `held for ${(Math.max(0, heldMs) / 1000).toFixed(1)} seconds`;
}

/** How much of the guide he has walked. A count of places, never of answers. */
export function coverage(spoken: readonly string[]): { readonly done: number; readonly total: number } {
  const ids = new Set(SCENARIOS.map((s) => s.id));
  const seen = new Set(spoken.filter((id) => ids.has(id)));
  return { done: seen.size, total: SCENARIOS.length };
}

export function readout(spoken: readonly string[]): string {
  const { done, total } = coverage(spoken);
  return `you have said your line out loud in ${done} of ${total} places`;
}

export function plateLines(
  scenario: Scenario,
  pick: Pick,
  outcome: Outcome,
  heldMs: number,
): readonly string[] {
  return [
    `${scenario.where}. ${scenario.setup.says}`,
    `You said: ${lineOf(scenario, pick)}`,
    panelFor(scenario, outcome).says,
    heldLabel(heldMs),
  ];
}

/** The title on a kept plate. */
export function plateTitle(scenario: Scenario): string {
  return `${HOLDTHELINE_META.title} — ${scenario.where}`;
}
