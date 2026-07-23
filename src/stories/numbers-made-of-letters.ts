import type { Story } from '../types';

export const numbersMadeOfLetters: Story = {
  slug: 'numbers-made-of-letters',
  title: 'Numbers Made of Letters',
  subtitle: 'Long ago in Rome, shopkeepers counted with letter-numbers that had no sign for nothing.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'A mark for what is there',
  readAloudMinutes: 5,
  learningTakeaway:
    'The Romans counted with letters like I, V, and X, one for five, ten for X. These letter-numbers could count things you could see. But the old Roman way had no single sign that meant zero, or none.',
  heartTakeaway:
    'When a tool does not fit a problem, patience and honesty work better than pretending. It is fine to say a thing is simply empty.',
  grownUpFact:
    'This is a true tale about a real Roman custom, not one invented person. Roman numerals use letters such as I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). The system had no numeral for zero. Romans wrote the Latin word "nulla," meaning "nothing," in words, and on their counting boards an empty column simply held no pebbles. The number 3,888 is written MMMDCCCLXXXVIII, a string of fifteen letters.',
  pages: [
    {
      text: 'Long ago, in the busy city of Rome, shopkeepers counted with little letters. This really happened, in shops beside stone streets. They carved I, V, and X on small wooden cards. Each letter was a number: I meant one, V meant five, X meant ten. A child helped a shopkeeper lay the cards beside baskets of figs. "A mark for what is there," the child said, lining them up in the warm evening light.',
      cue: 'Hold up one finger for I. Now spread five fingers for V. Can you find those letters in the picture?',
      scene: {
        id: 'numbers-made-of-letters-p1-shop-dusk',
        focus: 'a Roman child laying carved letter-number cards beside market baskets in a small shop',
        composition:
          'Foreground: wooden I, V, and X cards and baskets of figs; midground: a shopkeeper and child at a low counting table; background: a Roman shop awning and quiet stone street under a soft dusk sky',
        palette: 'fig purple, warm wood brown, and gentle sunset gold',
      },
      alt: 'A Roman child lays carved I, V, and X cards beside baskets of figs in a small shop under a warm dusk sky.',
    },
    {
      text: 'The shopkeeper asked the child to count a tray of five little clay lamps. The child chose the V card and set it down. Clack. Then came a tray with one lamp, so the child chose I. Clack. The number cards were easy when something waited on the tray. The child counted each lamp slowly and gently, because careful counting kept the little shop fair and true.',
      cue: 'Count the lamps with the child. Which card fits the group of five, and which fits just one?',
      scene: {
        id: 'numbers-made-of-letters-p2-lamp-trays',
        focus: 'the child matching V and I cards to two trays of clay lamps',
        composition:
          'Foreground: a five-lamp tray and a one-lamp tray with wooden cards; midground: the child counting while the shopkeeper watches kindly; background: shelves of oil jars glowing in warm dusk',
        palette: 'amber lamplight, walnut wood, and soft muted red',
      },
      alt: 'A Roman child matches a V card to a tray of five lamps and an I card to a tray of one lamp while a shopkeeper watches.',
    },
    {
      text: 'Then the shopkeeper set down a tray with nothing on it at all. The child reached for a card, then stopped and thought. I meant one. V meant five. X meant ten. None of the letter-numbers meant none. "A mark for what is there," the child whispered softly, "but what shows an empty place?" The child looked twice through the whole card box and found no zero card, no letter for nothing.',
      scene: {
        id: 'numbers-made-of-letters-p3-empty-tray',
        focus: 'the child pausing over an empty tray while holding the three known cards',
        composition:
          'Foreground: an empty clay tray with a clear gap beside it; midground: the child searching an open card box; background: quiet shop shelves settling into dusk',
        palette: 'cool clay blue with small warm gold highlights',
      },
      alt: 'A Roman child pauses over an empty tray, holding I, V, and X cards, with an open card box that has no card for nothing.',
    },
    {
      text: 'A hurried customer came in wanting lamps. The child almost slid the empty tray aside and forgot it. But the child remembered the shop promise: every tray must be counted honestly. The child did not invent a fake new letter. Instead, the child laid a smooth blank pebble beside the empty tray, a quiet reminder to ask the shopkeeper what to do. Patience felt better than a hurried guess.',
      cue: 'What would you use to remember a basket is empty? A pebble, a turned cup, or something of your own?',
      scene: {
        id: 'numbers-made-of-letters-p4-blank-pebble',
        focus: 'the child placing a smooth blank pebble beside the empty tray instead of guessing',
        composition:
          'Foreground: a round blank pebble and the empty tray; midground: the child pausing calmly rather than rushing; background: a patient customer waiting under the shop awning',
        palette: 'gloaming blue, clay cream, and soft pebble gray',
      },
      alt: 'A Roman child sets a smooth blank pebble beside an empty tray while a customer waits calmly under the awning.',
    },
    {
      text: 'The shopkeeper smiled at the pebble. "Our letter-numbers have no card for none," the grown-up explained kindly. "So we use a word, or a blank space, or a small reminder like yours." The child wrote nothing on the tray and simply kept the pebble there. "A mark for what is there." The empty place was allowed to stay honestly empty, waiting for the lamps to come.',
      scene: {
        id: 'numbers-made-of-letters-p5-explaining',
        focus: 'the shopkeeper explaining the letter-numbers while the pebble guards the empty tray',
        composition:
          'Foreground: the blank pebble beside an unmarked tray; midground: the shopkeeper crouching beside the child; background: the first evening lamps glowing softly in the shop',
        palette: 'soft plum, warm honey, and pale limestone',
      },
      alt: 'A Roman shopkeeper crouches to explain the letter-numbers to the child while a blank pebble guards an empty tray.',
    },
    {
      text: 'Soon a cart brought a delivery of ten new lamps. The child counted every one carefully and set the X card beside the full tray. Then the child checked the empty tray again. Still empty, still no letter-card for zero. That was not a mistake. It was simply how the old Roman number cards worked. "A mark for what is there," the child said, giving a proud and satisfied nod.',
      scene: {
        id: 'numbers-made-of-letters-p6-ten-lamps',
        focus: 'the child setting the X card beside a tray holding ten lamps in two neat rows',
        composition:
          'Foreground: ten small clay lamps in two tidy rows of five; midground: the child placing the X card below them; background: a rising moon beyond the shop awning',
        palette: 'deep terracotta with calm moonlit blue',
      },
      alt: 'A Roman child sets an X card beside a tray of ten lamps arranged in two neat rows as the moon rises outside.',
    },
    {
      text: 'The shopkeeper closed the shutters as the city grew quiet. The cards rested in their box: I, V, and X, still as little sticks. The blank pebble rested beside them, useful in its own gentle way. Upstairs the child curled under a soft wool blanket, warm and snug. The child counted one slow, sleepy yawn, then no more at all. The shop grew still beneath the moon. Goodnight.',
      scene: {
        id: 'numbers-made-of-letters-p7-goodnight',
        focus: 'the child asleep above the closed shop with the cards and pebble put away',
        composition:
          'Foreground: a closed card box and the blank pebble at rest; midground: the child sleeping under a soft wool blanket; background: moonlit shutters and a quiet empty street',
        palette: 'deep indigo, soft wool gray, and low warm amber',
      },
      alt: 'A Roman child sleeps snug under a wool blanket above a closed shop, the letter-number cards and blank pebble resting quietly nearby.',
    },
  ],
};
