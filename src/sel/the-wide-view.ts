/**
 * The Wide View.
 *
 * One crowded picture, and no target in it. Every person in the room has
 * something going on, so there is nothing to find and nothing to get right —
 * the exercise is the looking. What he files as "this one needs something" is
 * his call, recorded and never checked.
 */

export const THE_WIDE_VIEW_META = {
  id: 'the-wide-view',
  title: 'The Wide View',
  eyebrow: 'Look around',
  note: 'One room, everybody in it doing something. Look at whoever you like, for as long as you like.',
} as const;

export interface Figure {
  readonly id: string;
  /** Where they are in the plate, as a fraction of its width and height. */
  readonly x: number;
  readonly y: number;
  /** One sentence, posture and position only — never a feeling word. */
  readonly moment: string;
}

export interface Room {
  readonly id: string;
  /** games/sel/<plate>.png */
  readonly plate: string;
  readonly place: string;
  readonly figures: readonly Figure[];
}

const f = (id: string, x: number, y: number, moment: string): Figure => ({ id, x, y, moment });

export const ROOMS: readonly Room[] = [
  {
    id: 'carpet', plate: 'the-wide-view-carpet', place: 'The classroom carpet, story time',
    figures: [
      f('a', 0.22, 0.55, 'He is sitting right at the front, closer than anyone else.'),
      f('b', 0.38, 0.62, 'She has turned round to look at the door.'),
      f('c', 0.52, 0.48, 'He has been holding his hand up for a while.'),
      f('d', 0.67, 0.60, 'She is sitting just outside the ring, with a gap either side of her.'),
      f('e', 0.80, 0.52, 'He is leaning back on his hands, looking up at the ceiling.'),
      f('g', 0.45, 0.30, 'The teacher is holding the book open, reading.'),
      f('h', 0.13, 0.72, 'His shoe is off and he is turning it over in his hands.'),
      f('i', 0.90, 0.68, 'She is closest to the shelf, and her elbow is near the pot on it.'),
    ],
  },
  {
    id: 'recess', plate: 'the-wide-view-recess', place: 'The playground at recess',
    figures: [
      f('a', 0.18, 0.62, 'He is standing by the fence, watching the ball game.'),
      f('b', 0.35, 0.45, 'She is halfway up the climbing frame, not moving.'),
      f('c', 0.50, 0.66, 'Two of them have hold of the same ball, one at each side.'),
      f('d', 0.63, 0.68, 'The other one has hold of it too and is leaning back.'),
      f('e', 0.76, 0.40, 'She is running, well ahead of everybody.'),
      f('g', 0.88, 0.58, 'The adult on the bench is looking at the far end of the yard.'),
      f('h', 0.28, 0.80, 'He is crouched down, doing something with the gravel.'),
    ],
  },
  {
    id: 'party', plate: 'the-wide-view-party', place: 'A birthday party',
    figures: [
      f('a', 0.20, 0.58, 'He is nearest the cake, and has been for a while.'),
      f('b', 0.34, 0.66, 'She is holding a present and looking at the one being opened.'),
      f('c', 0.48, 0.52, 'He is in the middle of everybody, talking.'),
      f('d', 0.62, 0.70, 'She has her coat still on.'),
      f('e', 0.78, 0.46, 'He is by the door, half in the hallway.'),
      f('g', 0.88, 0.34, 'Two grown-ups are talking to each other by the kitchen.'),
      f('h', 0.42, 0.82, 'The little one is under the table with the wrapping paper.'),
    ],
  },
  {
    id: 'playdate', plate: 'the-wide-view-playdate', place: 'A play date at their house',
    figures: [
      f('a', 0.24, 0.60, 'He has the whole box of pieces beside him.'),
      f('b', 0.40, 0.64, 'She is building with two pieces, watching the box.'),
      f('c', 0.56, 0.50, 'He is standing up, holding something above his head.'),
      f('d', 0.70, 0.62, 'She is turned away, doing her own thing at the shelf.'),
      f('e', 0.86, 0.30, 'A grown-up is in the kitchen doorway, looking at the sink.'),
      f('g', 0.33, 0.80, 'His hand is on the edge of the tower somebody else built.'),
    ],
  },
  {
    id: 'dinner', plate: 'the-wide-view-dinner', place: 'The dinner table',
    figures: [
      f('a', 0.26, 0.52, 'One parent is passing a dish across.'),
      f('b', 0.44, 0.46, 'The other parent is looking at the little one, not at their own plate.'),
      f('c', 0.60, 0.62, 'The little one has both hands in the bowl.'),
      f('d', 0.74, 0.54, 'He has eaten nothing yet and is holding his fork.'),
      f('e', 0.16, 0.74, 'The dog is under the table by the spilled crumbs.'),
      f('g', 0.88, 0.72, 'There is a chair pushed back with nobody in it.'),
    ],
  },
  {
    id: 'museum', plate: 'the-wide-view-museum', place: 'The museum hall',
    figures: [
      f('a', 0.22, 0.56, 'He is pointing up at the ribs, saying something.'),
      f('b', 0.36, 0.64, 'She has stopped walking and is looking at the floor.'),
      f('c', 0.52, 0.44, 'A grown-up is reading the label, not looking up.'),
      f('d', 0.66, 0.58, 'He is trailing a long way behind his family.'),
      f('e', 0.80, 0.50, 'The guard is standing by the rope, watching the hall.'),
      f('g', 0.92, 0.66, 'She is sitting on the bench with her shoes off.'),
    ],
  },
] as const;

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}

/** How much of a room he has looked at. Coverage, never a score. */
export function coverage(room: Room, lookedAt: readonly string[]): string {
  const seen = room.figures.filter((x) => lookedAt.includes(x.id)).length;
  return `You have looked at ${seen} of the ${room.figures.length} people here.`;
}

/** What he has filed, stated plainly and never checked against anything. */
export function filedLine(room: Room, filed: readonly string[]): string {
  if (filed.length === 0) return 'You have not marked anybody yet.';
  const n = filed.length;
  return `You marked ${n} ${n === 1 ? 'person' : 'people'} in ${room.place.toLowerCase()}.`;
}

export const TOTAL_FIGURES = ROOMS.reduce((n, r) => n + r.figures.length, 0);
