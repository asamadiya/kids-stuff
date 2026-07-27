import type { Story } from '../types';

export const numbersMadeOfLetters: Story = {
  slug: 'numbers-made-of-letters',
  title: 'Numbers Made of Letters',
  subtitle: 'Long ago in Rome, shopkeepers counted with letter-numbers that had no sign for nothing.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'A mark for what is there',
  readAloudMinutes: 9,
  learningTakeaway:
    'The Romans counted with letters: I meant one, V meant five, X meant ten. They grouped small marks into fives and tens to count fast. To reckon big sums they slid little stones along the grooves of a counting board. Yet their letter-numbers had no single sign for zero, or none.',
  heartTakeaway:
    'When a tool does not fit a problem, patience and honesty work better than pretending. It is fine to say a thing is simply empty, and to keep wondering.',
  grownUpFact:
    'This is a true tale about a real Roman custom, not one invented person. Roman numerals use letters: I (1), V (5), X (10), L (50), C (100), D (500), M (1000). They grew from tally notches, and standard forms use subtraction, so IV means four and IX means nine. To calculate, Romans slid pebbles called "calculi" along the grooves of a counting board — the root of our word "calculate." The system had no numeral for zero; Romans wrote the Latin word "nulla" ("nothing") in words, and an empty groove simply held no pebble. The number 3,888 is MMMDCCCLXXXVIII, fifteen letters long.',
  pages: [
    {
      text: 'Long ago, in the busy city of Rome, shopkeepers counted with little letters. This really happened, in shops beside stone streets. They carved I, V, and X on small wooden cards. Each letter was a number. I meant one, V meant five, X meant ten. A child helped a shopkeeper lay the cards beside baskets of figs. "A mark for what is there," the child said in the warm evening light.',
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
      text: 'The shopkeeper showed the child a secret about the letters. Long ago, people cut little notches on a stick to count sheep. One notch, two notches, three. But a big row of notches was hard to read. So every fifth notch was cut as a slanted V, and every tenth as a crossed X. "That way you count faster," the shopkeeper said. The Roman letters grew from those old counting sticks.',
      cue: 'Try it! Draw four little lines, then a V, then more. Is a V faster to read than five lines?',
      scene: {
        id: 'numbers-made-of-letters-p2-tally-stick',
        focus: 'the shopkeeper showing a notched tally stick beside the carved letter cards',
        composition:
          'Foreground: a worn wooden tally stick with notches, a slanted V cut, and a crossed X; midground: the child tracing the notches while the shopkeeper points; background: shelves of jars in soft lamplight',
        palette: 'weathered driftwood gray, warm amber, and honey brown',
      },
      alt: 'A shopkeeper shows a Roman child a notched tally stick with a slanted V and a crossed X beside carved letter-number cards.',
    },
    {
      text: 'Next the child learned a clever trick the Romans used. To write four, you did not carve four lines in a row. You put a small I just before the V, which meant "one less than five." So IV means four, and IX means nine. Little marks stood beside big ones to save space. The child practiced, laying tiny I cards to the left of V and X. Counting felt like a tidy, careful game.',
      scene: {
        id: 'numbers-made-of-letters-p3-subtractive',
        focus: 'the child arranging an I card before V and X to make four and nine',
        composition:
          'Foreground: cards spelling IV and IX with a small I to the left of larger letters; midground: the child concentrating, tongue between teeth; background: the shopkeeper nodding beside stacked oil jars',
        palette: 'clay cream, ink brown, and soft evening rose',
      },
      alt: 'A Roman child arranges a small I card before V and X cards to spell four and nine while the shopkeeper watches.',
    },
    {
      text: 'For bigger sums, the shopkeeper brought out a smooth counting board. It had long grooves, and a little pile of pebbles waited beside it. Each groove was a place: ones, tens, hundreds, more. Slide a pebble into a groove, and the number grew. The Romans called these pebbles "calculi," which is where our word "calculate" comes from! The child slid three pebbles, then five, counting each soft click. "A mark for what is there."',
      scene: {
        id: 'numbers-made-of-letters-p4-counting-board',
        focus: 'the child sliding pebbles into the grooves of a Roman counting board',
        composition:
          'Foreground: a grooved counting board with small round pebbles in the ones and tens columns; midground: the child sliding a pebble while the shopkeeper counts along; background: a warm shop interior glowing at dusk',
        palette: 'stone gray, pebble tan, and low lamplight gold',
      },
      alt: 'A Roman child slides small pebbles into the grooves of a counting board while the shopkeeper counts along in warm lamplight.',
    },
    {
      text: 'The shopkeeper set a big order on the counting board to test the child. First the hundreds groove, then the tens, then the ones. Pebble by pebble, the number climbed high. The child read it back as letters, slow and sure. It was a long string of I, V, X, and more, marching in a tidy row. Big Roman numbers could grow very long indeed. The child grinned at the busy little army of letters.',
      scene: {
        id: 'numbers-made-of-letters-p5-big-number',
        focus: 'the child reading a long line of Roman-numeral cards from the loaded counting board',
        composition:
          'Foreground: a long row of letter cards spelling a big number below the grooved board; midground: the child pointing along the row, the shopkeeper smiling; background: shelves and hanging herbs in the quiet shop',
        palette: 'terracotta orange, parchment cream, and dusky plum',
      },
      alt: 'A Roman child reads a long row of letter-number cards spelling a big number below a loaded counting board.',
    },
    {
      text: 'Then the shopkeeper set down a tray with nothing on it at all. The child reached for a card, then stopped and thought. I meant one. V meant five. X meant ten. None of the letter-numbers meant none. "A mark for what is there," the child whispered, "but what shows an empty place?" The child looked twice through the whole card box and found no zero card, no letter for nothing at all.',
      scene: {
        id: 'numbers-made-of-letters-p6-empty-tray',
        focus: 'the child pausing over an empty tray while holding the known cards',
        composition:
          'Foreground: an empty clay tray with a clear gap beside it; midground: the child searching an open card box; background: quiet shop shelves settling into dusk',
        palette: 'cool clay blue with small warm gold highlights',
      },
      alt: 'A Roman child pauses over an empty tray, holding I, V, and X cards, with an open card box that has no card for nothing.',
    },
    {
      text: 'The child checked the counting board too, puzzled. On the board, an empty groove was easy. You just left it with no pebble at all. But the letter-cards had no such quiet gap to show. "How do I write down a place that holds none?" the child asked. The shopkeeper crouched close and smiled a gentle smile. "That is a very good question," the grown-up said. "Even clever Rome never made a letter for nothing."',
      cue: 'Look at the empty groove. How would you show "none" if you had only letters? Talk about it together.',
      scene: {
        id: 'numbers-made-of-letters-p7-empty-groove',
        focus: 'the child pointing at an empty groove on the counting board while the shopkeeper crouches close',
        composition:
          'Foreground: the grooved board with one clearly empty column and pebbles in others; midground: the child pointing, the shopkeeper crouched and listening; background: soft evening light through a shutter',
        palette: 'muted slate blue, warm honey, and pale limestone',
      },
      alt: 'A Roman child points at an empty groove on a counting board while the shopkeeper crouches close and listens kindly.',
    },
    {
      text: 'A hurried customer came in wanting lamps. The child almost slid the empty tray aside and forgot it. But the child remembered the shop promise. Every tray must be counted honestly and fairly. The child did not invent a fake new letter to fake a number. Instead, the child laid a smooth blank pebble beside the empty tray. It was a quiet reminder to ask what to do. Patience felt far better than a hurried guess.',
      cue: 'What would you use to remember a basket is empty? A pebble, a turned-over cup, or something of your own?',
      scene: {
        id: 'numbers-made-of-letters-p8-blank-pebble',
        focus: 'the child placing a smooth blank pebble beside the empty tray instead of guessing',
        composition:
          'Foreground: a round blank pebble and the empty tray; midground: the child pausing calmly rather than rushing; background: a patient customer waiting under the shop awning',
        palette: 'gloaming blue, clay cream, and soft pebble gray',
      },
      alt: 'A Roman child sets a smooth blank pebble beside an empty tray while a customer waits calmly under the awning.',
    },
    {
      text: 'The shopkeeper smiled at the pebble and told the child a Roman secret. "When we mean nothing, we write a word: nulla," the grown-up said. "It is Latin for none. But nulla is a word, not a number-letter." So the Romans spoke of nothing, yet had no sign to place in a sum. The child kept the pebble by the tray as a friendly marker. The empty place was allowed to stay honestly empty.',
      scene: {
        id: 'numbers-made-of-letters-p9-nulla',
        focus: 'the shopkeeper writing the word nulla on a wax tablet beside the empty tray',
        composition:
          'Foreground: a wax tablet with the word "nulla" and the blank pebble on the empty tray; midground: the shopkeeper writing while the child watches; background: the first evening lamps glowing softly',
        palette: 'soft plum, warm wax gold, and pale stone',
      },
      alt: 'A Roman shopkeeper writes the Latin word nulla on a wax tablet beside a blank pebble on an empty tray as the child watches.',
    },
    {
      text: 'Soon a cart brought a delivery of ten new lamps. The child counted every one carefully and set the X card beside the full tray. Then the child checked the empty tray again. Still empty, still no letter-card for zero. That was not a mistake at all. It was simply how the old Roman number cards worked. "A mark for what is there," the child said, with a proud and satisfied nod.',
      scene: {
        id: 'numbers-made-of-letters-p10-ten-lamps',
        focus: 'the child setting the X card beside a tray holding ten lamps in two neat rows',
        composition:
          'Foreground: ten small clay lamps in two tidy rows of five; midground: the child placing the X card below them; background: a rising moon beyond the shop awning',
        palette: 'deep terracotta with calm moonlit blue',
      },
      alt: 'A Roman child sets an X card beside a tray of ten lamps arranged in two neat rows as the moon rises outside.',
    },
    {
      text: 'The shopkeeper told one last, wonderful thing before the shutters closed. Far away, in lands to the east, other counters had begun a new idea. They were making a little round sign that meant "none" — a zero. One day that round zero would travel the whole wide world. It would sit in sums right where an empty groove used to be. "Someday you may write it too," the shopkeeper said. The child pictured a small, perfect circle.',
      cue: 'Draw a zero in the air — one round circle. It means "none is here." Where might you spot a zero tomorrow?',
      scene: {
        id: 'numbers-made-of-letters-p11-round-zero',
        focus: 'the child imagining a glowing round zero above the counting board',
        composition:
          'Foreground: the grooved board with the empty column; midground: the child drawing a circle in the air, a soft glowing zero shape above; background: a star-flecked window over the dim shop',
        palette: 'ink indigo, warm candle gold, and soft starlit silver',
      },
      alt: 'A Roman child draws a glowing round zero in the air above a counting board with one empty column under a starry window.',
    },
    {
      text: 'The shopkeeper closed the shutters as the city grew quiet. The cards rested in their box: I, V, and X, still as little sticks. The blank pebble rested beside them, useful in its own gentle way. Upstairs the child curled under a soft wool blanket, warm and snug. The child thought of letters, and pebbles, and a round zero yet to come. One slow, sleepy yawn, and then no more. Goodnight.',
      scene: {
        id: 'numbers-made-of-letters-p12-goodnight',
        focus: 'the child asleep above the closed shop with the cards, board, and pebble put away',
        composition:
          'Foreground: a closed card box, the grooved board, and the blank pebble at rest; midground: the child sleeping under a soft wool blanket; background: moonlit shutters and a quiet empty street',
        palette: 'deep indigo, soft wool gray, and low warm amber',
      },
      alt: 'A Roman child sleeps snug under a wool blanket above a closed shop, the letter-number cards, counting board, and blank pebble resting nearby.',
    },
  ],
};
