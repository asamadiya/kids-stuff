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
 * THE ACTION IS DRAWN, NOT PAINTED.
 *
 * The two action panels used to be paintings with hand-typed captions, and both
 * of the `last-truck` ones were wrong in ways nothing could catch. `p1b` was
 * captioned "You hold the truck out to him" over a plate in which the other boy
 * holds the truck out and the protagonist reaches to receive it — the transfer
 * runs the wrong way on the one panel where direction is the whole content.
 * `p1a` was a close portrait of a downturned, flushed face, which delivers the
 * verdict this module's own header promises never to give.
 *
 * So a road has no action plate. It has a `gesture` from a closed set and a
 * `thing` from a closed set, and BOTH the drawing (`DRAWINGS`) and the sentence
 * (`actionWordOf`) are switched on the gesture. The arrow in `give` points at
 * the other person because the gesture says so; there is no second authority to
 * disagree with. The sentence is never derived from `road.id`, which is only
 * 'a' | 'b' and means something different in every strip — `dinosaur-mia`'s
 * road a is a lift onto a shelf with no transfer in it at all.
 *
 * WHERE THE PLATE IS.
 *
 * Every remaining plate declares `at`, and `NoInfer` pins it to the strip's
 * `place`, so a panel painted somewhere else cannot be declared honestly and
 * kept. That is how `last-truck-p3b` left: it is a gravel yard with adults
 * standing about, against a strip set in a classroom. Its beat is now carried
 * by the old `p1b` plate, which shows exactly a later handover indoors.
 *
 * Stated plainly, because it matters: this token's resolution is "the setting
 * the strip names, or somewhere else". It catches a scene leaving the building.
 * It does not catch a plate being a different corner of the same kind of room,
 * because these plates were painted independently and do not hold that
 * continuity, and no amount of typing will put it back.
 *
 * Pure: no React, no DOM, no randomness, no time.
 */

export const WHATHAPPENSNEXT_META = {
  id: 'what-happens-next',
  title: 'What Happens Next',
  eyebrow: 'Two roads',
  note: 'Tap one of the two things your hands could do, and the strip draws what followed, and then the same place later that day.',
} as const;

/** Written out, not read off META, so the picture scan in sel-art.test.ts resolves it. */
const IMG = 'what-happens-next';

/* ----------------------------------------------------------------- places -- */

/** The settings a strip can be in. A plate declares one and must match its strip. */
export const PLACES = {
  classroom: 'the classroom',
  'home-rug': 'the rug at home',
  'friends-house': "your friend's house",
  playroom: 'the playroom',
  'front-room': 'the front room at home',
} as const;

export type PlaceId = keyof typeof PLACES;

export const placeSays = (id: PlaceId): string => PLACES[id];

/* ----------------------------------------------------------------- things -- */

/**
 * The objects hands can be doing something to. Drawn, so the action panel needs
 * no painting, and named once, so the sentence and the drawing use one string.
 */
export interface Thing {
  /** Slotted into the action sentence: "You hold on to **the truck**." */
  readonly the: string;
  /** Stroked paths on a 48 by 48 field, centred on (24, 24). */
  readonly glyph: readonly string[];
}

export const THINGS = {
  truck: {
    the: 'the truck',
    glyph: [
      'M6 30 h20 v-10 h-20 z',
      'M26 30 h12 l4-7 h-8 v-3 h-8 z',
      'M13 30 a3.5 3.5 0 1 0 0.1 0',
      'M32 30 a3.5 3.5 0 1 0 0.1 0',
      'M6 33.5 h32',
    ],
  },
  dinosaur: {
    the: 'the dinosaur',
    glyph: [
      'M4 30 C10 26 12 18 20 18 C28 18 32 22 34 16 C36 11 42 12 42 16',
      'M20 18 C14 20 12 26 14 33',
      'M28 21 C30 26 30 30 29 33',
      'M40 15 a1.2 1.2 0 1 0 0.1 0',
      'M8 33 h24',
    ],
  },
  lid: {
    the: 'the broken lid',
    glyph: [
      'M8 24 a16 8 0 0 0 32 0 a16 8 0 0 0 -32 0',
      'M24 16 L21 24 L27 26 L23 32',
      'M12 28 v4 a14 7 0 0 0 24 0 v-4',
    ],
  },
  counter: {
    the: 'the counter',
    glyph: [
      'M24 24 a10 10 0 1 0 0.1 0',
      'M24 24 a5 5 0 1 0 0.1 0',
      'M8 36 h32',
    ],
  },
  beads: {
    the: 'the beads',
    glyph: [
      'M6 30 C14 22 34 22 42 30',
      'M14 26.5 a3.4 3.4 0 1 0 0.1 0',
      'M24 24.5 a3.4 3.4 0 1 0 0.1 0',
      'M34 26.5 a3.4 3.4 0 1 0 0.1 0',
    ],
  },
  shoes: {
    the: 'your shoes',
    glyph: [
      'M5 32 v-7 h5 l5 4 h5 v3 z',
      'M25 32 v-7 h5 l5 4 h5 v3 z',
      'M5 35 h38',
    ],
  },
} as const;

export type ThingId = keyof typeof THINGS;

/* --------------------------------------------------------------- gestures -- */

/** What the hands do. Closed, because the drawing and the sentence both switch on it. */
export const GESTURES = [
  'hold', 'give', 'raise', 'point', 'still', 'move', 'release', 'go', 'work',
] as const;

export type Gesture = (typeof GESTURES)[number];

/** One hand, placed and turned on the 200 by 156 action field. 0 is fingers up. */
export interface Hand {
  readonly x: number;
  readonly y: number;
  readonly turn: number;
}

/** Which way the thing travels. `null` when it does not travel. */
export type Arrow = 'to-them' | 'to-thing' | 'up' | 'along' | 'away' | null;

/**
 * The action panel, as geometry the code owns. `theirs` is empty for every
 * gesture but `give`, so a handover cannot be drawn where the data says none
 * happened, and `give`'s arrow always runs from your hands to theirs.
 */
export interface Drawing {
  readonly thing: { readonly x: number; readonly y: number };
  readonly yours: readonly Hand[];
  readonly theirs: readonly Hand[];
  readonly arrow: Arrow;
}

/** The field the action is drawn on. Same box the painted panels used. */
export const ACTION_FIELD = { width: 200, height: 156 } as const;

/** An open palm, centred on (0, 0), fingers up. Rotated by `Hand.turn`. */
export const PALM =
  'M-8 10 V-2 a2 2 0 0 1 4 0 V-9 a2 2 0 0 1 4 0 V-11 a2 2 0 0 1 4 0 V-7 '
  + 'a2 2 0 0 1 4 0 V6 a7 7 0 0 1 -16 4 Z';

export const DRAWINGS: Readonly<Record<Gesture, Drawing>> = {
  // Both hands closed round it and pulled in against you. Nothing moves.
  hold: {
    thing: { x: 100, y: 88 },
    yours: [{ x: 74, y: 98, turn: 40 }, { x: 126, y: 98, turn: -40 }],
    theirs: [],
    arrow: null,
  },
  // The only gesture with a second pair of hands, and the arrow runs to them.
  give: {
    thing: { x: 100, y: 82 },
    yours: [{ x: 46, y: 90, turn: 90 }],
    theirs: [{ x: 154, y: 90, turn: -90 }],
    arrow: 'to-them',
  },
  raise: {
    thing: { x: 100, y: 36 },
    yours: [{ x: 78, y: 66, turn: 15 }, { x: 122, y: 66, turn: -15 }],
    theirs: [],
    arrow: 'up',
  },
  point: {
    thing: { x: 144, y: 92 },
    yours: [{ x: 50, y: 92, turn: 90 }],
    theirs: [],
    arrow: 'to-thing',
  },
  still: {
    thing: { x: 100, y: 124 },
    yours: [{ x: 76, y: 84, turn: 180 }, { x: 124, y: 84, turn: 180 }],
    theirs: [],
    arrow: null,
  },
  move: {
    thing: { x: 84, y: 90 },
    yours: [{ x: 46, y: 90, turn: 90 }],
    theirs: [],
    arrow: 'along',
  },
  release: {
    thing: { x: 100, y: 120 },
    yours: [{ x: 72, y: 54, turn: 180 }, { x: 128, y: 54, turn: 180 }],
    theirs: [],
    arrow: 'away',
  },
  go: {
    thing: { x: 70, y: 118 },
    yours: [{ x: 56, y: 88, turn: 165 }, { x: 88, y: 88, turn: 195 }],
    theirs: [],
    arrow: 'away',
  },
  work: {
    thing: { x: 100, y: 92 },
    yours: [{ x: 70, y: 84, turn: 55 }, { x: 130, y: 84, turn: -55 }],
    theirs: [],
    arrow: null,
  },
};

/**
 * The sentence, from the same token the drawing comes from. `them` is the other
 * person in this strip, so `give` names whoever is actually there.
 */
const SENTENCES: Readonly<Record<Gesture, (the: string, them: string) => string>> = {
  hold: (the) => `You hold on to ${the}.`,
  give: (the, them) => `You hold ${the} out to ${them}.`,
  raise: (the) => `You lift ${the} up out of reach.`,
  point: (the) => `You point at ${the}.`,
  still: () => 'You put your hands in your lap and say nothing.',
  move: (the) => `You move ${the} to the end.`,
  release: (the) => `You take your hands off ${the}.`,
  go: (the) => `You put ${the} on and go.`,
  work: (the) => `You stay where you are and go on with ${the}.`,
};

/* ------------------------------------------------------------------ types -- */

/** One drawn panel. `image` is the file at games/sel/<image>.png. */
export interface Panel<P extends PlaceId = PlaceId> {
  readonly image: string;
  readonly alt: string;
  /** The setting this plate is painted in. Pinned to the strip's `place`. */
  readonly at: P;
}

/** The two roads out of a setup. Nothing distinguishes them but what happened. */
export const ROAD_IDS = ['a', 'b'] as const;
export type RoadId = (typeof ROAD_IDS)[number];

/** The other person in the strip. Their pronoun is carried, never inferred. */
export interface Other {
  readonly name: string;
  /** Object pronoun: "him", "her". Slotted into the `give` sentence. */
  readonly them: string;
}

/**
 * One road: what the hands do, what happened straight after, and the same place
 * later that day. There is no `action` plate and no `actionWord` — both are a
 * function of `gesture` and `thing`, so the picture and the words cannot fall
 * out of step. There is no field for a verdict either.
 */
export interface Road<P extends PlaceId = PlaceId> {
  readonly id: RoadId;
  readonly gesture: Gesture;
  readonly thing: ThingId;
  readonly after: Panel<P>;
  readonly later: Panel<P>;
  /** World-state after the action. Second person, past tense. */
  readonly afterWord: string;
  /** The same place later that day. Sometimes it undoes the outcome. */
  readonly laterWord: string;
}

/** One strip: a setup panel and exactly two roads. */
export interface Strip<P extends PlaceId = PlaceId> {
  readonly id: string;
  readonly place: P;
  readonly other: Other;
  readonly setup: Panel<P>;
  /** The situation in one sentence. It names no feeling. */
  readonly setupWord: string;
  readonly roads: readonly [Road<P>, Road<P>];
}

/**
 * Fixes the strip's place from `place` alone. `NoInfer` keeps every panel's
 * `at` out of inference, so a plate declared in another setting is a compile
 * error rather than a thing a test has to notice.
 */
const strip = <P extends PlaceId>(s: {
  readonly id: string;
  readonly place: P;
  readonly other: Other;
  readonly setup: Panel<NoInfer<P>>;
  readonly setupWord: string;
  readonly roads: readonly [Road<NoInfer<P>>, Road<NoInfer<P>>];
}): Strip<P> => s as Strip<P>;

/* ---------------------------------------------------------------- content -- */

export const STRIPS: readonly Strip[] = [
  strip({
    id: 'last-truck',
    place: 'classroom',
    other: { name: 'the other boy', them: 'him' },
    setup: {
      image: `${IMG}-last-truck-p0`,
      alt: 'The last wooden truck on the low cubby shelf, your own two hands raised towards it from the near side, and another boy on the far side with his hand already on it.',
      at: 'classroom',
    },
    setupWord: 'There is one truck left on the shelf, and another boy has his hand near it.',
    roads: [
      {
        id: 'a',
        gesture: 'hold',
        thing: 'truck',
        after: {
          image: `${IMG}-last-truck-p2a`,
          alt: 'The truck held in the near frame while the other boy stands a little way off across the rug, a small child sitting behind him.',
          at: 'classroom',
        },
        later: {
          image: `${IMG}-last-truck-p3a`,
          alt: 'Your hands still holding the wooden truck, with other children building at the block shelves across the room.',
          at: 'classroom',
        },
        afterWord: 'You kept the truck. He watched for a while. Then he went to play with someone else.',
        laterWord: 'At tidy-up time you still had the truck. He was building with Ana. They did not look up.',
      },
      {
        id: 'b',
        gesture: 'give',
        thing: 'truck',
        after: {
          image: `${IMG}-last-truck-p2b`,
          alt: 'The other boy walking off across the room with a truck under his arm, your own empty open hands in the near frame.',
          at: 'classroom',
        },
        // This plate used to be the action panel, where it drew the transfer
        // backwards. As a later beat it draws exactly what happens: he brings it
        // back. The outdoor plate that used to sit here has been dropped.
        later: {
          image: `${IMG}-last-truck-p1b`,
          alt: 'The other boy holding the wooden truck out to you with both hands, a small child watching beside him and a shelf of baskets behind them.',
          at: 'classroom',
        },
        afterWord: 'You gave him the truck. He took it and turned away. You had nothing in your hands.',
        laterWord: 'Later he came and held the truck out to you. You had not asked him for it.',
      },
    ],
  }),
  strip({
    id: 'dinosaur-mia',
    place: 'home-rug',
    other: { name: 'Mia', them: 'her' },
    setup: {
      image: `${IMG}-dinosaur-mia-p0`,
      alt: 'A half-built toy dinosaur on the rug, your hands still on its back, your little sister’s hand already closed on its tail.',
      at: 'home-rug',
    },
    setupWord: 'Your dinosaur is half built, and Mia’s hand is already on its tail.',
    roads: [
      {
        id: 'a',
        gesture: 'raise',
        thing: 'dinosaur',
        after: {
          image: `${IMG}-dinosaur-mia-p2a`,
          alt: 'Your sister sitting on the patterned rug crying with her arms down, and a grown-up standing in the open doorway behind her.',
          at: 'home-rug',
        },
        later: {
          image: `${IMG}-dinosaur-mia-p3a`,
          alt: 'The whole dinosaur standing on a high shelf while your sister sits on the floor by the door with a pile of small blocks.',
          at: 'home-rug',
        },
        afterWord: 'You lifted it onto the high shelf. Mia cried. Dad came in and stood in the doorway.',
        laterWord: 'The dinosaur was still whole at bedtime. Mia played by the door and did not come near you.',
      },
      {
        id: 'b',
        gesture: 'give',
        thing: 'dinosaur',
        after: {
          image: `${IMG}-dinosaur-mia-p2b`,
          alt: 'Your sister sitting on the mat laughing with the dinosaur’s tail in her fist and the body tipped over beside her.',
          at: 'home-rug',
        },
        later: {
          image: `${IMG}-dinosaur-mia-p3b`,
          alt: 'Bedtime: your sister sitting in your lap holding the body in one hand and the loose tail in the other.',
          at: 'home-rug',
        },
        afterWord: 'You let her hold it. She pulled, and the tail came off in her hand. She laughed.',
        laterWord: 'At bedtime the tail was still off. Mia sat in your lap holding both pieces.',
      },
    ],
  }),
  strip({
    id: 'broken-lid',
    place: 'friends-house',
    other: { name: 'your friend', them: 'him' },
    setup: {
      image: `${IMG}-broken-lid-p0`,
      alt: 'A broken jar lid in pieces on the kitchen floor, your friend crouched over them with one finger to his lips, seen past your own shoulder.',
      at: 'friends-house',
    },
    setupWord: 'He knocked the lid off the jar, and he is asking you to say nothing.',
    roads: [
      {
        id: 'a',
        gesture: 'point',
        thing: 'lid',
        after: {
          image: `${IMG}-broken-lid-p2a`,
          alt: 'A grown-up crouching to sweep the broken pieces into a dustpan on the kitchen floor, your friend standing beside her with his hands clasped.',
          at: 'friends-house',
        },
        later: {
          image: `${IMG}-broken-lid-p3a`,
          alt: 'Seen from inside the hall: your friend walking out through the open front door beside another boy, neither of them turning round.',
          at: 'friends-house',
        },
        afterWord: 'You told his mum. He would not look at you. She swept the pieces into the bin.',
        laterWord: 'He is angry with you today. At home time he walked out with Ben and did not wave.',
      },
      {
        id: 'b',
        gesture: 'still',
        thing: 'lid',
        after: {
          image: `${IMG}-broken-lid-p2b`,
          alt: 'A grown-up standing at the kitchen table asking a question of every child sitting round it, all of them quiet, nobody with a hand up.',
          at: 'friends-house',
        },
        later: {
          image: `${IMG}-broken-lid-p3b`,
          alt: 'Snack time at the kitchen table: your friend sitting close beside you over mugs and cut apple, the broken lid lying on the table beside them.',
          at: 'friends-house',
        },
        afterWord: 'You said nothing. She asked everyone at the table who did it. Nobody answered.',
        laterWord: 'The broken lid was still on the table at snack. He sat next to you. You knew, and he knew.',
      },
    ],
  }),
  strip({
    id: 'winning-game',
    // The four plates are indoor rooms with children playing; none of them shows
    // a school. The strip used to claim "the carpet at school" against them.
    place: 'playroom',
    other: { name: 'the other boy', them: 'him' },
    setup: {
      image: `${IMG}-winning-game-p0`,
      alt: 'A board game on the carpet with your counters nearly home, your hand on a counter, the other boy sitting back with his hands off the board.',
      at: 'playroom',
    },
    setupWord: 'You are two counters from winning, and he wants to stop the game.',
    roads: [
      {
        id: 'a',
        gesture: 'move',
        thing: 'counter',
        after: {
          image: `${IMG}-winning-game-p2a`,
          alt: 'The finished board on the table with your counters home, the other boy sitting opposite with his hands flat and his eyes on the open door.',
          at: 'playroom',
        },
        later: {
          image: `${IMG}-winning-game-p3a`,
          alt: 'A different game laid out on the rug with the other boy and another child bent over it, and you at the edge of the frame watching.',
          at: 'playroom',
        },
        afterWord: 'You finished the game. You won. He put his hands flat and looked at the door.',
        laterWord: 'After lunch he started a new game with Sam. They did not ask you.',
      },
      {
        id: 'b',
        gesture: 'release',
        thing: 'counter',
        after: {
          image: `${IMG}-winning-game-p2b`,
          alt: 'The other boy already standing and turned away by the window, the unfinished board still laid out on the rug between you.',
          at: 'playroom',
        },
        later: {
          image: `${IMG}-winning-game-p3b`,
          alt: 'The unfinished board still on the rug under your hands, and the other boy sitting against the sofa across the room with an open book.',
          at: 'playroom',
        },
        afterWord: 'You stopped the game. He got up straight away. The counters stayed where they were.',
        laterWord: 'Later you wanted to finish it. He was on the carpet with a book and said not now.',
      },
    ],
  }),
  strip({
    id: 'promised-mia',
    place: 'front-room',
    other: { name: 'Mia', them: 'her' },
    setup: {
      image: `${IMG}-promised-mia-p0`,
      alt: 'A bowl of beads and a thread on the low table with your sister waiting beside it, and a friend standing at the open front door behind you.',
      at: 'front-room',
    },
    setupWord: 'You told Mia you would stay and thread beads, and your friend is at the door.',
    roads: [
      {
        id: 'a',
        gesture: 'go',
        thing: 'shoes',
        after: {
          image: `${IMG}-promised-mia-p2a`,
          alt: 'Seen back through the doorway: your sister still at the low table with the beads, alone.',
          at: 'front-room',
        },
        later: {
          image: `${IMG}-promised-mia-p3a`,
          alt: 'Coming back in: the bead tin closed on the table, your sister asleep on the sofa under a blanket.',
          at: 'front-room',
        },
        afterWord: 'You went outside with him. Mia stayed at the table with the beads. She did not call after you.',
        laterWord: 'When you came in, the beads were away in the tin. Mia was asleep on the sofa.',
      },
      {
        id: 'b',
        gesture: 'work',
        thing: 'beads',
        after: {
          image: `${IMG}-promised-mia-p2b`,
          alt: 'The bead tin tipped over across the table, your sister walking off towards a grown-up in the next room.',
          at: 'front-room',
        },
        later: {
          image: `${IMG}-promised-mia-p3b`,
          alt: 'The empty front step through the open door, no shoes on the mat, the street beyond it quiet.',
          at: 'front-room',
        },
        afterWord: 'You stayed and threaded beads. Mia tipped the tin over after two minutes and went to find Dad.',
        laterWord: 'Your friend had gone home. His shoes were not by the door.',
      },
    ],
  }),
];

/* ---------------------------------------------------------------- helpers -- */

/** The stable key for one road, used to count what has been walked. */
export const roadKey = (stripId: string, roadId: RoadId): string => `${stripId}:${roadId}`;

export const otherRoad = (id: RoadId): RoadId => (id === 'a' ? 'b' : 'a');

export const stripById = (id: string): Strip | undefined => STRIPS.find((s) => s.id === id);

export const roadOf = (strip_: Strip, id: RoadId): Road =>
  strip_.roads[0].id === id ? strip_.roads[0] : strip_.roads[1];

export const thingOf = (road: Road): Thing => THINGS[road.thing];

/** The geometry of the action panel. A function of the gesture and nothing else. */
export const drawingOf = (road: Road): Drawing => DRAWINGS[road.gesture];

/** A drawn arrow, in the action field's coordinates. */
export interface ArrowLine {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

const CLEAR = 26;

/**
 * Where the arrow runs, derived from the drawing. `to-them` ends at the other
 * person's hand, so the direction of a handover is computed from the same
 * record that places those hands — it can never be drawn the other way round.
 */
export const arrowOf = (d: Drawing): ArrowLine | null => {
  const { thing, yours, theirs, arrow } = d;
  switch (arrow) {
    case 'to-them': {
      const target = theirs[0];
      if (!target) return null;
      return { x1: thing.x + CLEAR, y1: thing.y, x2: target.x - CLEAR, y2: target.y };
    }
    case 'to-thing': {
      const from = yours[0];
      if (!from) return null;
      return { x1: from.x + CLEAR, y1: from.y, x2: thing.x - CLEAR, y2: thing.y };
    }
    case 'up':
      return { x1: thing.x, y1: thing.y + CLEAR + 18, x2: thing.x, y2: thing.y + CLEAR };
    case 'along':
      return { x1: thing.x + CLEAR, y1: thing.y, x2: thing.x + CLEAR + 44, y2: thing.y };
    case 'away':
      return { x1: thing.x, y1: thing.y - CLEAR, x2: thing.x + 44, y2: thing.y - CLEAR - 30 };
    case null:
      return null;
  }
};

/**
 * The short label under the action panel. Derived from (gesture, thing) and the
 * strip's other person, so the words cannot say "out to him" over a drawing with
 * one pair of hands in it.
 */
export const actionWordOf = (strip_: Strip, road: Road): string =>
  SENTENCES[road.gesture](THINGS[road.thing].the, strip_.other.them);

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

export const roadsWalkedIn = (keys: readonly string[], strip_: Strip): number => {
  const set = known(keys);
  return strip_.roads.filter((r) => set.has(roadKey(strip_.id, r.id))).length;
};

export const bothWalked = (keys: readonly string[], strip_: Strip): boolean =>
  roadsWalkedIn(keys, strip_) === strip_.roads.length;

/** The line above the strip: doors opened here, not points. */
export const stripLine = (keys: readonly string[], strip_: Strip): string =>
  `You have opened ${roadsWalkedIn(keys, strip_)} of the ${strip_.roads.length} roads in this strip.`;

/** Every painted panel in a strip, in drawn order. Always five: the action is drawn. */
export const panelsOf = (strip_: Strip): readonly Panel[] => [
  strip_.setup,
  ...strip_.roads.flatMap((r) => [r.after, r.later]),
];

export const allPanels = (): readonly Panel[] => STRIPS.flatMap(panelsOf);

/** The two-road plate: the setup at the top and both roads written under it. */
export const plateLines = (strip_: Strip): readonly string[] => [
  strip_.setupWord,
  `One road: ${actionWordOf(strip_, strip_.roads[0])} ${strip_.roads[0].afterWord} ${strip_.roads[0].laterWord}`,
  `The other road: ${actionWordOf(strip_, strip_.roads[1])} ${strip_.roads[1].afterWord} ${strip_.roads[1].laterWord}`,
];

export const plateFilename = (strip_: Strip): string => `${WHATHAPPENSNEXT_META.id}-${strip_.id}.png`;

/** Deterministic cycle through the strips; no randomness anywhere in this tool. */
export const nextStripId = (id: string): string => {
  const i = STRIPS.findIndex((s) => s.id === id);
  return STRIPS[(i + 1 + STRIPS.length) % STRIPS.length].id;
};
