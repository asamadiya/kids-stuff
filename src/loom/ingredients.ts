/** A "thing" the child drops into the Story Loom. */
export type ThingKind = 'animal' | 'person' | 'place' | 'nature' | 'object' | 'food';

export interface Thing {
  readonly label: string;
  readonly emoji: string;
  readonly kind: ThingKind;
}

export interface IngredientGroup {
  readonly kind: ThingKind;
  readonly title: string;
  readonly items: readonly Thing[];
}

const g = (kind: ThingKind, pairs: readonly [string, string][]): Thing[] =>
  pairs.map(([emoji, label]) => ({ emoji, label, kind }));

/** The tappable emoji palette, grouped by kind. */
export const INGREDIENTS: readonly IngredientGroup[] = [
  {
    kind: 'animal',
    title: 'Animals',
    items: g('animal', [
      ['🐭', 'mouse'], ['🦊', 'fox'], ['🐢', 'turtle'], ['🐉', 'dragon'],
      ['🦉', 'owl'], ['🐝', 'bee'], ['🐘', 'elephant'], ['🐬', 'dolphin'],
      ['🐱', 'cat'], ['🐰', 'rabbit'], ['🦋', 'butterfly'], ['🐧', 'penguin'],
    ]),
  },
  {
    kind: 'person',
    title: 'People',
    items: g('person', [
      ['👑', 'little queen'], ['🧙', 'kind wizard'], ['👧', 'girl'], ['👦', 'boy'],
      ['🧑‍🚀', 'astronaut'], ['🧑‍🍳', 'baker'], ['🧚', 'fairy'], ['👵', 'grandma'],
    ]),
  },
  {
    kind: 'place',
    title: 'Places',
    items: g('place', [
      ['🏰', 'castle'], ['🏝️', 'island'], ['🌳', 'forest'], ['⛰️', 'mountain'],
      ['🏖️', 'beach'], ['🏠', 'cozy house'], ['🏜️', 'desert'], ['🏔️', 'snowy peak'],
    ]),
  },
  {
    kind: 'nature',
    title: 'Sky & nature',
    items: g('nature', [
      ['🌙', 'moon'], ['⭐', 'star'], ['🌈', 'rainbow'], ['🌊', 'wave'],
      ['❄️', 'snowflake'], ['🌻', 'sunflower'], ['☁️', 'cloud'], ['🍃', 'breeze'],
    ]),
  },
  {
    kind: 'object',
    title: 'Things',
    items: g('object', [
      ['🥄', 'spoon'], ['🔔', 'little bell'], ['🪁', 'kite'], ['🧺', 'basket'],
      ['🚂', 'train'], ['🎈', 'balloon'], ['🕯️', 'candle'], ['🧵', 'ball of yarn'],
      ['📕', 'red book'], ['🥁', 'drum'], ['🔑', 'golden key'], ['⛵', 'little boat'],
    ]),
  },
  {
    kind: 'food',
    title: 'Yummy things',
    items: g('food', [
      ['🍯', 'honey'], ['🍎', 'apple'], ['🥕', 'carrot'], ['🍪', 'cookie'],
      ['🫐', 'blueberry'], ['🧀', 'cheese'], ['🍵', 'warm tea'], ['🍞', 'fresh bread'],
    ]),
  },
];

/** Every palette item flattened, for "surprise me". */
export const ALL_INGREDIENTS: readonly Thing[] = INGREDIENTS.flatMap((grp) => grp.items);

const KEYWORDS: Record<ThingKind, readonly string[]> = {
  animal: ['dog', 'cat', 'bird', 'fish', 'bear', 'lion', 'frog', 'horse', 'duck', 'pig', 'sheep', 'monkey', 'snake', 'whale', 'puppy', 'kitten', 'bug', 'ant', 'wolf', 'deer', 'goat', 'cow', 'crab', 'dinosaur', 'dragon', 'shark', 'whale', 'dolphin', 'unicorn', 'tiger', 'lizard', 'octopus'],
  person: ['mom', 'dad', 'baby', 'friend', 'king', 'queen', 'prince', 'princess', 'pirate', 'knight', 'doctor', 'teacher', 'sister', 'brother', 'grandpa', 'grandma', 'wizard', 'fairy', 'robot'],
  place: ['house', 'home', 'school', 'park', 'garden', 'castle', 'cave', 'city', 'town', 'river', 'lake', 'sea', 'ocean', 'forest', 'mountain', 'island', 'beach', 'desert', 'sky', 'bridge', 'zoo'],
  nature: ['moon', 'sun', 'star', 'rain', 'snow', 'wind', 'cloud', 'rainbow', 'flower', 'tree', 'leaf', 'wave', 'storm', 'thunder', 'lightning', 'puddle', 'tsunami', 'flood', 'tide', 'earthquake', 'quake', 'volcano', 'lava', 'hurricane', 'tornado', 'cyclone', 'blizzard', 'avalanche', 'hail', 'disaster', 'disasters', 'sandstorm', 'fire', 'fog'],
  food: ['apple', 'cookie', 'cake', 'bread', 'honey', 'milk', 'cheese', 'carrot', 'soup', 'candy', 'pie', 'ice cream', 'banana', 'berry', 'tea', 'jam'],
  object: ['car', 'boat', 'ship', 'train', 'rocket', 'plane', 'bus', 'bike', 'van', 'truck', 'canoe', 'kayak', 'ferry', 'jeep', 'tent', 'map', 'flashlight', 'backpack', 'rope', 'treasure', 'ball', 'kite', 'sword', 'shield', 'telescope', 'camera'],
};

/** A soft emoji when a grown-up types a custom thing. */
const KIND_EMOJI: Record<ThingKind, string> = {
  animal: '🐾',
  person: '🙂',
  place: '📍',
  nature: '✨',
  food: '🍽️',
  object: '🎒',
};

/** Nature words that are dynamic EVENTS (they happen), used by the weaver. */
export const EVENT_WORDS: readonly string[] = [
  'storm', 'thunder', 'lightning', 'rain', 'wind', 'wave', 'tsunami', 'flood', 'tide', 'surge',
  'snow', 'blizzard', 'ice', 'hail', 'avalanche', 'earthquake', 'quake', 'volcano', 'lava',
  'erupt', 'hurricane', 'tornado', 'cyclone', 'disaster', 'sandstorm', 'fire',
];

/** A fitting emoji for common custom words, so a typed thing looks right. */
const WORD_EMOJI: Record<string, string> = {
  tsunami: '🌊', wave: '🌊', flood: '🌊', tide: '🌊', storm: '⛈️', thunder: '⛈️', lightning: '⚡',
  rain: '🌧️', snow: '❄️', blizzard: '🌨️', hurricane: '🌀', tornado: '🌪️', cyclone: '🌀',
  volcano: '🌋', lava: '🌋', earthquake: '🫨', quake: '🫨', wind: '💨', fog: '🌫️', fire: '🔥',
  disaster: '🌀', disasters: '🌀', 'natural disasters': '🌀', 'natural disaster': '🌀', avalanche: '🏔️',
  car: '🚗', boat: '⛵', ship: '🚢', train: '🚂', rocket: '🚀', plane: '✈️', bus: '🚌', bike: '🚲',
  truck: '🚚', canoe: '🛶', kayak: '🛶', tent: '⛺', map: '🗺️', flashlight: '🔦', backpack: '🎒',
  treasure: '💎', kite: '🪁', ball: '⚽', sword: '⚔️', shield: '🛡️', telescope: '🔭', camera: '📷',
  dinosaur: '🦕', dragon: '🐉', shark: '🦈', whale: '🐳', dog: '🐶', cat: '🐱', horse: '🐴',
};

/** Turn a free-typed word into a Thing by guessing its kind. */
export function toThing(raw: string): Thing {
  const label = raw.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 24);
  const words = label.split(' ');
  let kind: ThingKind = 'object';
  for (const k of Object.keys(KEYWORDS) as ThingKind[]) {
    if (KEYWORDS[k].some((w) => label === w || words.includes(w))) {
      kind = k;
      break;
    }
  }
  const emoji = WORD_EMOJI[label] ?? WORD_EMOJI[words[words.length - 1]] ?? KIND_EMOJI[kind];
  return { label, emoji, kind };
}
