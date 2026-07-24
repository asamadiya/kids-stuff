import type { Thing } from './ingredients';
import { EVENT_WORDS } from './ingredients';

export interface WovenStory {
  readonly title: string;
  readonly paragraphs: readonly string[];
}

/** Enough things to weave a good adventure. */
export const MIN_THINGS = 3;

/* ------------------------------------------------------------------ rng -- */
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
    for (let i = 0; i < t.label.length; i += 1) h = Math.imul(h ^ t.label.charCodeAt(i), 16777619);
    h = Math.imul(h ^ t.kind.charCodeAt(0), 16777619);
  }
  return h >>> 0;
}

/* -------------------------------------------------------------- phrasing -- */
const name = (t: Thing): string => (t.emoji ? `${t.label} ${t.emoji}` : t.label);
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
function listAnd(parts: readonly string[]): string {
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

const isEvent = (t: Thing): boolean =>
  t.kind === 'nature' && EVENT_WORDS.some((w) => t.label.includes(w));

type EventKind = 'water' | 'storm' | 'snow' | 'ground';
function eventKind(label: string): EventKind {
  if (/tsunami|wave|flood|tide|surge/.test(label)) return 'water';
  if (/snow|blizzard|ice|frost|avalanche|hail/.test(label)) return 'snow';
  if (/earthquake|quake|volcano|lava|erupt/.test(label)) return 'ground';
  return 'storm';
}
const VEHICLE = /car|boat|ship|train|rocket|plane|bus|bike|van|truck|canoe|kayak|sailboat|ferry|jeep/;

/* ------------------------------------------------------------------ weave -- */
/**
 * Weave the child's things into a FUN, varied adventure — a trip, an excursion,
 * a day out where something exciting happens and everyone is safe and happy.
 * Each thing is woven in AS ITSELF (a tsunami is a giant wave, a dog is a dog).
 * `variant` reshuffles so "tell it another way" gives a fresh tale.
 */
export function weaveStory(things: readonly Thing[], variant = 0): WovenStory {
  const rng = mulberry32(hashThings(things, variant * 2654435761));
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

  const people = things.filter((t) => t.kind === 'person');
  const animals = things.filter((t) => t.kind === 'animal');
  const places = things.filter((t) => t.kind === 'place');
  const events = things.filter(isEvent);
  const ambiance = things.filter((t) => t.kind === 'nature' && !isEvent(t));
  const food = things.filter((t) => t.kind === 'food');
  const objects = things.filter((t) => t.kind === 'object');
  const vehicles = objects.filter((t) => VEHICLE.test(t.label));
  const props = objects.filter((t) => !VEHICLE.test(t.label));

  const named = new Set<string>();
  const mark = (t: Thing): string => {
    named.add(t.label);
    return name(t);
  };

  const crewNames = [...people, ...animals].map(mark);
  const crew =
    crewNames.length > 0
      ? listAnd(crewNames)
      : pick(['your two best friends', 'your whole family', 'your best friend and your cousin', 'Mom, Dad, and your little sister']);

  const waterEvent = events.some((e) => eventKind(e.label) === 'water');
  const snowEvent = events.some((e) => eventKind(e.label) === 'snow');
  const place = places[0];
  if (place) mark(place);

  const trip = place
    ? `a trip to the ${name(place)}`
    : waterEvent
    ? pick(['a day at the beach', 'a boat ride out on the bay', 'a splashy day at the lake'])
    : snowEvent
    ? pick(['a snowy day up in the mountains', 'a trip to the big sledding hill'])
    : pick([
        'a hike deep into the forest',
        'a big picnic in the park',
        'a camping trip in the green hills',
        'a climb up the tall mountain',
        'a wander through the wild woods',
        'an excursion with your whole class',
      ]);

  const paras: string[] = [];
  const leader = people[0] ? name(people[0]) : 'someone';

  // 1. Setup + travel.
  let p1 = `${pick([
    'One bright, sunny morning',
    'One breezy Saturday',
    'Early one warm morning',
    'One golden afternoon',
    'One fine, adventurous day',
  ])}, you and ${crew} set off for ${trip}.`;
  p1 += vehicles.length
    ? ` You all piled into the ${vehicles.map(mark).join(' and ')} and off you zoomed!`
    : ' ' + pick(['You could hardly wait!', 'What a day it was going to be!', 'Off you went, full of giggles.']);
  paras.push(p1);

  // 2. Arrive + gear + snacks + scenery.
  const bits: string[] = [
    pick(['When you got there, everything looked amazing.', 'The moment you arrived, your eyes went wide.', 'It was even better than you had imagined.']),
  ];
  if (props.length) bits.push(`You had packed ${listAnd(props.map(mark))}, ready for anything.`);
  if (food.length) bits.push(`For snacks there was ${listAnd(food.map(mark))} — yum!`);
  if (ambiance.length) bits.push(`Above you, ${listAnd(ambiance.map(mark))} made everything sparkle.`);
  paras.push(bits.join(' '));

  // 3–4. The exciting thing that happens.
  if (events.length) {
    const ev = events[0];
    mark(ev);
    const rest = events.slice(1).map(mark);
    const extra = rest.length ? ` (and ${listAnd(rest)} too!)` : '';
    const k = eventKind(ev.label);
    if (k === 'water') {
      paras.push(`Then something HUGE happened. The sea went very still, and the water pulled far, far back from the shore. Out on the horizon, a giant ${name(ev)}${extra} began to rise!`);
      paras.push(`“Everyone — up to the high lookout!” ${cap(leader)} called. Hearts pounding, you all raced up the hill hand in hand. From way up high and safe, you watched the great wave roll in below — roaring, foaming, glittering — and then, slowly, the sea grew calm and blue again.`);
    } else if (k === 'storm') {
      paras.push(`Then the sky turned dark and grumbly. CRACK — BOOM! A wild ${name(ev)}${extra} came whooshing in, with racing wind and rushing rain.`);
      paras.push(`“Quick — this way!” you all dashed together into a snug shelter and peeked out. The storm flashed and danced and drummed. Little by little it blew itself out — and out popped the sun, with a big rainbow to say hello.`);
    } else if (k === 'snow') {
      paras.push(`Then the sky filled with tumbling white. A big ${name(ev)}${extra} swept in, and the whole world went soft and sparkling.`);
      paras.push(`You bundled up tight and stomped through the deep, squeaky snow, building the coziest little fort. When your cheeks were pink and your mittens were snowy, you all huddled close and warmed right up with a laugh.`);
    } else {
      paras.push(`Then the ground gave a great big rumble and a shake — a real ${name(ev)}${extra}!`);
      paras.push(`“Hold on to each other!” Everyone grabbed hands and stood together out in the open, away from anything tall. In a moment it settled and all was still and safe. You looked around with wide eyes — what a mighty thing to feel, and what a story to tell!`);
    }
  } else {
    const found = props[0] ?? ambiance[0] ?? animals[0] ?? things[0];
    paras.push(`You were exploring when — wait, what was THAT? Tucked away where no one had looked, you discovered something wonderful: ${mark(found)}!`);
    paras.push(`${crewNames.length ? cap(listAnd(crewNames)) : 'Everyone'} cheered, and together you set off on a happy, giggly little adventure — helping each other over every log and around every corner.`);
  }

  // 5. Animals shine.
  if (animals.length) {
    paras.push(`All along, ${listAnd(animals.map(name))} stayed right by your side — brave and clever and never far away.`);
    animals.forEach((a) => named.add(a.label));
  }

  // Name anything not woven yet.
  const leftover = things.filter((t) => !named.has(t.label));
  if (leftover.length) {
    paras.push(`And can you believe it? ${cap(listAnd(leftover.map(name)))} ${leftover.length === 1 ? 'was' : 'were'} part of the fun too.`);
  }

  // 6. A varied, happy ending — not always bedtime.
  paras.push(
    pick([
      'What an adventure! All the way home you couldn’t stop talking about it.',
      'It was, everyone agreed, the very best day.',
      'You were tired and happy — and just a little bit muddy — and you smiled the whole way home.',
      'Some days you remember forever. This was one of them.',
      'That night, snuggled up warm, you grinned as you remembered the whole wild, wonderful day.',
    ]),
  );

  const bigThing = events[0] ?? place ?? animals[0] ?? props[0] ?? things[0];
  const title = events.length
    ? pick([`The Day the Great ${cap(events[0].label)} Came`, 'Adventure in the Wild Weather', `The Big ${cap(events[0].label)} Day`])
    : place
    ? pick([`Adventure at the ${cap(place.label)}`, `The ${cap(place.label)} Trip`, `A Wild Day at the ${cap(place.label)}`])
    : pick([`The Great ${cap(bigThing.label)} Adventure`, 'The Best Day Ever', 'Off on an Adventure!']);

  return { title, paragraphs: paras };
}
