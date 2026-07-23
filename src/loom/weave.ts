import type { Thing, ThingKind } from './ingredients';

export interface WovenStory {
  readonly title: string;
  readonly paragraphs: readonly string[];
}

/* ------------------------------------------------------------------ rng -- */

/** Tiny deterministic PRNG so "tell it again" gives a new-but-reproducible tale. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashThings(things: readonly Thing[], salt: number): number {
  let h = 2166136261 ^ salt;
  for (const t of things) {
    for (let i = 0; i < t.label.length; i += 1) {
      h = Math.imul(h ^ t.label.charCodeAt(i), 16777619);
    }
    h = Math.imul(h ^ t.kind.charCodeAt(0), 16777619);
  }
  return h >>> 0;
}

/* --------------------------------------------------------------- phrasing -- */

const ADJ = ['little', 'kind', 'curious', 'gentle', 'brave', 'sleepy', 'cheerful', 'small', 'clever', 'soft'];
const TIMES = [
  'One quiet evening',
  'Long ago, just before bedtime',
  'On a soft and starry night',
  'When the sky turned pink and gold',
  'One cozy, cloud-tucked night',
];

const withEmoji = (t: Thing): string => `${t.label} ${t.emoji}`;

function listAnd(parts: readonly string[]): string {
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** A gentle little thing each kind can do to help. */
const HELP: Record<ThingKind, readonly string[]> = {
  animal: ['scampered happily ahead', 'kept everyone snug and warm', 'gave a soft, happy cheer', 'curled up close by'],
  person: ['shared a kind little idea', 'lent a helping hand', 'hummed a sweet tune', 'gave everyone a warm hug'],
  place: ['opened its doors wide', 'made a cozy, welcoming spot', 'wrapped everyone in quiet'],
  nature: ['lit a silver path', 'sprinkled a little sparkle', 'sang a whispery lullaby', 'glowed soft and calm'],
  object: ['was exactly the right helper', 'found its perfect place', 'gave a cheerful little clink'],
  food: ['smelled warm and sweet', 'was shared all around', 'made everyone smile'],
};

const WISHES = [
  {
    title: 'The Moonlight Picnic',
    want: 'have one last cozy picnic before bed',
    win: 'the softest picnic anyone had ever seen',
  },
  {
    title: 'The Sleepy Parade',
    want: 'lead a slow, giggly goodnight parade around the garden',
    win: 'the gentlest little parade in all the land',
  },
  {
    title: 'The Search for the Coziest Spot',
    want: 'find the very coziest place to watch the stars come out',
    win: 'the coziest, snuggliest spot of all',
  },
  {
    title: 'The Lost Lullaby',
    want: 'find the ending of a half-remembered lullaby',
    win: 'a lullaby so soft it made the whole world yawn',
  },
];

const CALM_ENDINGS = [
  'and one by one, they drifted off to sleep. Goodnight.',
  'and the whole world felt warm, and quiet, and calm. Goodnight.',
  'and everyone snuggled down, cozy as could be. Goodnight.',
  'and the stars kept watch while they dreamed. Goodnight.',
];

/* ------------------------------------------------------------------ weave -- */

/**
 * Weave the child's things into a short, warm bedtime tale. `variant` shifts
 * the random seed so the same things can be told a new way.
 */
export function weaveStory(things: readonly Thing[], variant = 0): WovenStory {
  const rng = mulberry32(hashThings(things, variant * 2654435761));
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];
  const adj = () => pick(ADJ);

  const characters = things.filter((t) => t.kind === 'animal' || t.kind === 'person');
  const places = things.filter((t) => t.kind === 'place');
  const others = things.filter((t) => !characters.includes(t) && !places.includes(t));

  // Hero: a character if we have one; else an object/food/nature brought to life;
  // else whatever came first. Setting: a place that isn't the hero (or a cozy
  // default). Everything else — companions + props — is always named, so no
  // thing is ever left out of the tale.
  const hero = characters[0] ?? others[0] ?? things[0];
  const setting = places.find((p) => p !== hero);
  const companions = characters.filter((t) => t !== hero);
  const props = things.filter(
    (t) => t !== hero && t !== setting && !companions.includes(t),
  );

  const wish = pick(WISHES);
  const paragraphs: string[] = [];

  // 1. Opening — hero + setting.
  const settingPhrase = setting
    ? `in a ${adj()} ${withEmoji(setting)}`
    : 'in a snug little house at the edge of a green, whispering wood';
  paragraphs.push(
    `${pick(TIMES)}, a ${adj()} ${withEmoji(hero)} lived ${settingPhrase}.`,
  );

  // 2. The friends gather — names every remaining thing at least once.
  const guests = [...companions, ...props];
  if (guests.length > 0) {
    paragraphs.push(
      `As the sky grew sleepy, some friends came to visit: ${listAnd(
        guests.map(withEmoji),
      )}. Everyone was glad to be together.`,
    );
  }

  // 3. The little wish.
  paragraphs.push(
    `“I have a cozy idea,” said the ${withEmoji(hero)}. “Let us ${wish.want}.” Everyone thought that was a wonderful plan.`,
  );

  // 4. Each thing helps, one gentle sentence at a time.
  const helpers = [...companions, ...props];
  if (helpers.length > 0) {
    const lines = helpers.map((t) => `The ${withEmoji(t)} ${pick(HELP[t.kind])}.`);
    // group into 1–2 sentences per paragraph so it reads gently
    for (let i = 0; i < lines.length; i += 2) {
      paragraphs.push(lines.slice(i, i + 2).join(' '));
    }
  }
  if (setting) {
    paragraphs.push(`Even the ${withEmoji(setting)} seemed to hush and hold them close.`);
  }

  // 5. Success + warm feeling.
  paragraphs.push(
    `${pick(['And so', 'Soon', 'Before long'])}, together, they made ${wish.win}. The ${withEmoji(
      hero,
    )} felt ${pick(['proud', 'happy', 'warm', 'calm'])} all the way down to its toes.`,
  );

  // 6. Calm goodnight — reprise a couple of things resting.
  const resters = listAnd([hero, ...guests].slice(0, 3).map(withEmoji));
  paragraphs.push(`${cap(resters)} yawned a great big yawn, ${pick(CALM_ENDINGS)}`);

  return { title: wish.title, paragraphs };
}

/** True when there are enough things to weave a good tale. */
export const MIN_THINGS = 3;
