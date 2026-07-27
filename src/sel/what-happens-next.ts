/**
 * What Happens Next — a branching consequence strip.
 *
 * The child taps one of two drawn actions and the strip extends: what followed,
 * then the same place later that day. Both roads are drawn with equal care and
 * both render in full. There is deliberately no field on any type here that
 * could hold a correct branch — the data cannot express one, so the tool cannot
 * grade one. Feedback is world-state only: second person, past tense, no praise
 * and no moral gloss. The moral load is carried entirely by the drawn
 * consequence.
 *
 * Pure: no React, no DOM, no randomness, no time.
 */

export const WHATHAPPENSNEXT_META = {
  id: 'what-happens-next',
  title: 'What Happens Next',
  eyebrow: 'Two roads',
  note: 'Tap one of the two things your hands could do, and the strip draws what followed, and then the same place later that day.',
} as const;

/* ------------------------------------------------------------------ types -- */

/** One drawn panel. `image` is the file at games/sel/<image>.png. */
export interface Panel {
  readonly image: string;
  readonly alt: string;
}

/** The two roads out of a setup. Nothing distinguishes them but what happened. */
export const ROAD_IDS = ['a', 'b'] as const;
export type RoadId = (typeof ROAD_IDS)[number];

/**
 * One road: the action, what happened straight after, and the same place later
 * that day. Exactly three panels — the shape is closed so a strip cannot grow
 * an extra beat, and there is no field for a verdict.
 */
export interface Road {
  readonly id: RoadId;
  readonly action: Panel;
  readonly after: Panel;
  readonly later: Panel;
  /** World-state after the action. Second person, past tense. */
  readonly afterWord: string;
  /** The same place later that day. Sometimes it undoes the outcome. */
  readonly laterWord: string;
}

/** One strip: a setup panel and exactly two roads. */
export interface Strip {
  readonly id: string;
  readonly place: string;
  readonly setup: Panel;
  /** The situation in one sentence. It names no feeling. */
  readonly setupWord: string;
  readonly roads: readonly [Road, Road];
}

const IMG = WHATHAPPENSNEXT_META.id;

const panel = (slug: string, alt: string): Panel => ({ image: `${IMG}-${slug}`, alt });

/* ---------------------------------------------------------------- content -- */

export const STRIPS: readonly Strip[] = [
  {
    id: 'last-truck',
    place: 'the shelf in the classroom',
    setup: panel(
      'last-truck-p0',
      'The last wooden truck on the low shelf, your hands reaching for it, another boy reaching from the other side.',
    ),
    setupWord: 'There is one truck left on the shelf, and another boy has his hand near it.',
    roads: [
      {
        id: 'a',
        action: panel('last-truck-p1a', 'Your hands closing around the truck and pulling it in against your chest.'),
        after: panel('last-truck-p2a', 'You holding the truck on the carpet while the boy stands a little way off, watching.'),
        later: panel('last-truck-p3a', 'Tidy-up time: the truck still in your hands, the boy and a girl building together across the room.'),
        afterWord: 'You kept the truck. He watched for a while. Then he went to play with someone else.',
        laterWord: 'At tidy-up time you still had the truck. He was building with Ana. They did not look up.',
      },
      {
        id: 'b',
        action: panel('last-truck-p1b', 'Your hands holding the truck out flat towards the other boy.'),
        after: panel('last-truck-p2b', 'The boy walking off with the truck under his arm, your empty hands in the near frame.'),
        later: panel('last-truck-p3b', 'The boy handing you a small digger with a bent arm, the truck still tucked under his elbow.'),
        afterWord: 'You gave him the truck. He took it and turned away. You had nothing in your hands.',
        laterWord: 'Later he brought you a digger with a bent arm. The truck was still under his elbow.',
      },
    ],
  },
  {
    id: 'dinosaur-mia',
    place: 'the rug at home',
    setup: panel(
      'dinosaur-mia-p0',
      'A half-built toy dinosaur on the rug, your hands still on its back, your little sister’s hand already closed on its tail.',
    ),
    setupWord: 'Your dinosaur is half built, and Mia’s hand is already on its tail.',
    roads: [
      {
        id: 'a',
        action: panel('dinosaur-mia-p1a', 'Your hands lifting the half-built dinosaur high onto a shelf, out of your sister’s reach.'),
        after: panel('dinosaur-mia-p2a', 'Your sister sitting on the rug crying with her arms down, a grown-up standing in the doorway.'),
        later: panel('dinosaur-mia-p3a', 'Bedtime: the whole dinosaur on the shelf, your sister playing alone by the door with her back to you.'),
        afterWord: 'You lifted it onto the high shelf. Mia cried. Dad came in and stood in the doorway.',
        laterWord: 'The dinosaur was still whole at bedtime. Mia played by the door and did not come near you.',
      },
      {
        id: 'b',
        action: panel('dinosaur-mia-p1b', 'Your hands opening and letting the dinosaur go into your sister’s two hands.'),
        after: panel('dinosaur-mia-p2b', 'Your sister laughing with the dinosaur’s tail snapped off in her fist, the body tipped over on the rug.'),
        later: panel('dinosaur-mia-p3b', 'Bedtime: your sister sitting in your lap holding the body in one hand and the loose tail in the other.'),
        afterWord: 'You let her hold it. She pulled, and the tail came off in her hand. She laughed.',
        laterWord: 'At bedtime the tail was still off. Mia sat in your lap holding both pieces.',
      },
    ],
  },
  {
    id: 'broken-lid',
    place: 'the kitchen at your friend’s house',
    setup: panel(
      'broken-lid-p0',
      'A broken jar lid in pieces on the kitchen floor, your friend crouched over them with one finger to his lips, seen past your own shoulder.',
    ),
    setupWord: 'He knocked the lid off the jar, and he is asking you to say nothing.',
    roads: [
      {
        id: 'a',
        action: panel('broken-lid-p1a', 'Your hand pointing down at the broken pieces while a grown-up leans in to look.'),
        after: panel('broken-lid-p2a', 'The grown-up sweeping the pieces into a bin, your friend turned away with his chin down.'),
        later: panel('broken-lid-p3a', 'Home time at the door: your friend walking out beside another boy, not turning round.'),
        afterWord: 'You told his mum. He would not look at you. She swept the pieces into the bin.',
        laterWord: 'He is angry with you today. At home time he walked out with Ben and did not wave.',
      },
      {
        id: 'b',
        action: panel('broken-lid-p1b', 'Your hands folded in your lap and your mouth closed while the grown-up looks around the table.'),
        after: panel('broken-lid-p2b', 'A grown-up standing at the table asking the whole table a question, every child quiet, nobody with a raised hand.'),
        later: panel('broken-lid-p3b', 'Snack time: your friend sitting close beside you, the broken lid visible in the bin behind you both.'),
        afterWord: 'You said nothing. She asked everyone at the table who did it. Nobody answered.',
        laterWord: 'The lid stayed broken in the bin. He sat next to you at snack. You knew, and he knew.',
      },
    ],
  },
  {
    id: 'winning-game',
    place: 'the carpet at school',
    setup: panel(
      'winning-game-p0',
      'A board game on the carpet with your counters nearly home, your hand on a counter, the other boy sitting back with his hands off the board.',
    ),
    setupWord: 'You are two counters from winning, and he wants to stop the game.',
    roads: [
      {
        id: 'a',
        action: panel('winning-game-p1a', 'Your hand moving the last counter along the board to the end square.'),
        after: panel('winning-game-p2a', 'The finished board with your counters home, the boy with his hands under the table looking towards the door.'),
        later: panel('winning-game-p3a', 'After lunch: the boy playing a new game with another child, two heads bent over it, you at the edge of the frame.'),
        afterWord: 'You finished the game. You won. He put his hands under the table and looked at the door.',
        laterWord: 'After lunch he started a new game with Sam. They did not ask you.',
      },
      {
        id: 'b',
        action: panel('winning-game-p1b', 'Your hands lifting away from the board and resting flat on the carpet, the counters left where they are.'),
        after: panel('winning-game-p2b', 'The boy already standing up and walking off, the unfinished board still laid out on the carpet.'),
        later: panel('winning-game-p3b', 'Later: you standing by the unfinished board, the boy on the carpet reading a book with his back half turned.'),
        afterWord: 'You stopped the game. He got up straight away. The counters stayed where they were.',
        laterWord: 'Later you wanted to finish it. He was on the carpet with a book and said not now.',
      },
    ],
  },
  {
    id: 'promised-mia',
    place: 'the front room at home',
    setup: panel(
      'promised-mia-p0',
      'A bowl of beads and a thread on the low table with your sister waiting beside it, and a friend standing at the open front door behind you.',
    ),
    setupWord: 'You told Mia you would stay and thread beads, and your friend is at the door.',
    roads: [
      {
        id: 'a',
        action: panel('promised-mia-p1a', 'Your hands pushing your shoes on at the door while your friend waits on the step.'),
        after: panel('promised-mia-p2a', 'Seen back through the doorway: your sister still at the low table with the beads, alone.'),
        later: panel('promised-mia-p3a', 'Coming back in: the bead tin closed on the table, your sister asleep on the sofa under a blanket.'),
        afterWord: 'You went outside with him. Mia stayed at the table with the beads. She did not call after you.',
        laterWord: 'When you came in, the beads were away in the tin. Mia was asleep on the sofa.',
      },
      {
        id: 'b',
        action: panel('promised-mia-p1b', 'Your hands threading a bead onto a string at the low table beside your sister.'),
        after: panel('promised-mia-p2b', 'The bead tin tipped over across the table, your sister walking off towards a grown-up in the next room.'),
        later: panel('promised-mia-p3b', 'The empty front step through the open door, no shoes on the mat, the street beyond it quiet.'),
        afterWord: 'You stayed and threaded beads. Mia tipped the tin over after two minutes and went to find Dad.',
        laterWord: 'Your friend had gone home. His shoes were not by the door.',
      },
    ],
  },
];

/* ---------------------------------------------------------------- helpers -- */

/** The stable key for one road, used to count what has been walked. */
export const roadKey = (stripId: string, roadId: RoadId): string => `${stripId}:${roadId}`;

export const otherRoad = (id: RoadId): RoadId => (id === 'a' ? 'b' : 'a');

export const stripById = (id: string): Strip | undefined => STRIPS.find((s) => s.id === id);

export const roadOf = (strip: Strip, id: RoadId): Road =>
  strip.roads[0].id === id ? strip.roads[0] : strip.roads[1];

/** Every road in the section. Coverage counts these, never answers. */
export const totalRoads = (): number => STRIPS.length * ROAD_IDS.length;

const known = (keys: readonly string[]): Set<string> => {
  const all = new Set<string>();
  for (const s of STRIPS) for (const r of s.roads) all.add(roadKey(s.id, r.id));
  return new Set(keys.filter((k) => all.has(k)));
};

/** How many distinct roads have been walked. Unknown keys are ignored. */
export const walkedCount = (keys: readonly string[]): number => known(keys).size;

/** Coverage, never a score: no ratio of right to wrong appears anywhere. */
export const coverageLine = (keys: readonly string[]): string =>
  `You have walked ${walkedCount(keys)} of the ${totalRoads()} roads.`;

export const roadsWalkedIn = (keys: readonly string[], strip: Strip): number => {
  const set = known(keys);
  return strip.roads.filter((r) => set.has(roadKey(strip.id, r.id))).length;
};

export const bothWalked = (keys: readonly string[], strip: Strip): boolean =>
  roadsWalkedIn(keys, strip) === strip.roads.length;

/** The line above the strip: doors opened here, not points. */
export const stripLine = (keys: readonly string[], strip: Strip): string =>
  `You have opened ${roadsWalkedIn(keys, strip)} of the ${strip.roads.length} roads in this strip.`;

/** Every panel in a strip, in drawn order. Always seven. */
export const panelsOf = (strip: Strip): readonly Panel[] => [
  strip.setup,
  ...strip.roads.flatMap((r) => [r.action, r.after, r.later]),
];

export const allPanels = (): readonly Panel[] => STRIPS.flatMap(panelsOf);

/** The two-road plate: the setup at the top and both roads written under it. */
export const plateLines = (strip: Strip): readonly string[] => [
  strip.setupWord,
  `One road: ${strip.roads[0].afterWord} ${strip.roads[0].laterWord}`,
  `The other road: ${strip.roads[1].afterWord} ${strip.roads[1].laterWord}`,
];

export const plateFilename = (strip: Strip): string => `${WHATHAPPENSNEXT_META.id}-${strip.id}.png`;

/** Deterministic cycle through the strips; no randomness anywhere in this tool. */
export const nextStripId = (id: string): string => {
  const i = STRIPS.findIndex((s) => s.id === id);
  return STRIPS[(i + 1 + STRIPS.length) % STRIPS.length].id;
};
