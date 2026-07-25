export const ODDONEOUT_META = {
  id: 'odd-one-out',
  title: 'Odd One Out',
  icon: '🔍',
  color: 'sun',
  tagline: 'Four things, one of which belongs to a different set.',
} as const;

export interface OddItem {
  readonly emoji: string;
  readonly name: string;
}

export interface OddRound {
  readonly id: string;
  /** The category that most items share. */
  readonly group: string;
  /** The three-or-more items that belong to the group. */
  readonly belong: readonly OddItem[];
  /** The single item that does NOT belong. */
  readonly odd: OddItem;
  /** What group the odd item actually belongs to. */
  readonly oddGroup: string;
  readonly prompt: string;
}

export const ODD_ROUNDS: readonly OddRound[] = [
  {
    id: 'fruit-dog',
    group: 'fruit',
    belong: [
      { emoji: '🍎', name: 'apple' },
      { emoji: '🍌', name: 'banana' },
      { emoji: '🍇', name: 'grapes' },
    ],
    odd: { emoji: '🐶', name: 'dog' },
    oddGroup: 'animals',
    prompt: 'Which one is not a fruit?',
  },
  {
    id: 'animals-car',
    group: 'animal',
    belong: [
      { emoji: '🐱', name: 'cat' },
      { emoji: '🐰', name: 'rabbit' },
      { emoji: '🐸', name: 'frog' },
    ],
    odd: { emoji: '🚗', name: 'car' },
    oddGroup: 'things that go',
    prompt: 'Which one is not an animal?',
  },
  {
    id: 'vehicles-cake',
    group: 'thing that goes',
    belong: [
      { emoji: '🚌', name: 'bus' },
      { emoji: '🚲', name: 'bike' },
      { emoji: '✈️', name: 'airplane' },
    ],
    odd: { emoji: '🎂', name: 'cake' },
    oddGroup: 'yummy treats',
    prompt: 'Which one does not go on a road or in the sky?',
  },
  {
    id: 'clothes-fish',
    group: 'clothes',
    belong: [
      { emoji: '👕', name: 'shirt' },
      { emoji: '👒', name: 'hat' },
      { emoji: '🧦', name: 'sock' },
    ],
    odd: { emoji: '🐟', name: 'fish' },
    oddGroup: 'animals',
    prompt: 'Which one is not something we wear?',
  },
  {
    id: 'sky-carrot',
    group: 'thing in the sky',
    belong: [
      { emoji: '☀️', name: 'sun' },
      { emoji: '☁️', name: 'cloud' },
      { emoji: '🌈', name: 'rainbow' },
    ],
    odd: { emoji: '🥕', name: 'carrot' },
    oddGroup: 'vegetables',
    prompt: 'Which one do we not see up in the sky?',
  },
  {
    id: 'veggies-star',
    group: 'vegetable',
    belong: [
      { emoji: '🥕', name: 'carrot' },
      { emoji: '🌽', name: 'corn' },
      { emoji: '🥦', name: 'broccoli' },
    ],
    odd: { emoji: '⭐', name: 'star' },
    oddGroup: 'things in the sky',
    prompt: 'Which one is not a vegetable?',
  },
  {
    id: 'bugs-shoe',
    group: 'little bug',
    belong: [
      { emoji: '🐝', name: 'bee' },
      { emoji: '🐜', name: 'ant' },
      { emoji: '🦋', name: 'butterfly' },
    ],
    odd: { emoji: '👟', name: 'shoe' },
    oddGroup: 'things we wear',
    prompt: 'Which one is not a little bug?',
  },
  {
    id: 'sea-truck',
    group: 'sea animal',
    belong: [
      { emoji: '🐙', name: 'octopus' },
      { emoji: '🐋', name: 'whale' },
      { emoji: '🦀', name: 'crab' },
    ],
    odd: { emoji: '🚚', name: 'truck' },
    oddGroup: 'things that go',
    prompt: 'Which one does not live in the sea?',
  },
  {
    id: 'toys-apple',
    group: 'toy',
    belong: [
      { emoji: '🧸', name: 'teddy bear' },
      { emoji: '⚽', name: 'ball' },
      { emoji: '🪁', name: 'kite' },
    ],
    odd: { emoji: '🍏', name: 'green apple' },
    oddGroup: 'fruit',
    prompt: 'Which one is not a toy?',
  },
  {
    id: 'drinks-hat',
    group: 'drink',
    belong: [
      { emoji: '🥛', name: 'milk' },
      { emoji: '🧃', name: 'juice' },
      { emoji: '🍵', name: 'tea' },
    ],
    odd: { emoji: '🧢', name: 'cap' },
    oddGroup: 'things we wear',
    prompt: 'Which one is not something we drink?',
  },
  {
    id: 'birds-frog',
    group: 'bird',
    belong: [
      { emoji: '🐔', name: 'chicken' },
      { emoji: '🦆', name: 'duck' },
      { emoji: '🦉', name: 'owl' },
    ],
    odd: { emoji: '🐢', name: 'turtle' },
    oddGroup: 'animals with shells',
    prompt: 'Which one is not a bird?',
  },
  {
    id: 'weather-book',
    group: 'kind of weather',
    belong: [
      { emoji: '❄️', name: 'snow' },
      { emoji: '🌧️', name: 'rain' },
      { emoji: '⛈️', name: 'storm' },
    ],
    odd: { emoji: '📚', name: 'books' },
    oddGroup: 'things we read',
    prompt: 'Which one is not weather?',
  },
];

/** Uppercase the first letter of a name for a friendly label. */
export function itemLabel(item: OddItem): string {
  return item.name.charAt(0).toUpperCase() + item.name.slice(1);
}

/**
 * All four options for a round: the belonging items plus the odd one,
 * arranged in a stable, deterministic order based on the round index so
 * the layout never jumps around on re-render.
 */
export function getOddOptions(round: OddRound, index: number): readonly OddItem[] {
  const items = [...round.belong, round.odd];
  const slot = index % items.length;
  // Rotate deterministically so the odd one is not always last.
  return items.slice(slot).concat(items.slice(0, slot));
}

/** Warm feedback for ANY choice: celebrate, name the group, reveal the odd one. */
export function getOddFeedback(round: OddRound, selected: OddItem): string {
  const oddLabel = itemLabel(round.odd);
  if (selected.emoji === round.odd.emoji) {
    return `Yes! ${oddLabel} ${round.odd.emoji} is the odd one out — the others are all ${round.group}. ${oddLabel} belongs with ${round.oddGroup}!`;
  }
  return `Nice looking! ${itemLabel(selected)} ${selected.emoji} is a lovely ${round.group}. The odd one is ${oddLabel} ${round.odd.emoji}, which belongs with ${round.oddGroup}.`;
}
