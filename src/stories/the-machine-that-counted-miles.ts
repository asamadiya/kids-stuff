import type { Story } from '../types';

export const theMachineThatCountedMiles: Story = {
  slug: 'the-machine-that-counted-miles',
  title: 'The Machine That Counted Miles',
  subtitle: 'Long ago, the Roman writer Vitruvius described a cart that dropped a pebble for every mile.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Turn, click, pebble, count',
  readAloudMinutes: 5,
  learningTakeaway:
    'A wheel can repeat the very same turn again and again. When each full turn drops one pebble, you can count the pebbles to count how far a cart has rolled.',
  heartTakeaway:
    'When a count looks wrong, do not blame it in a hurry. Setting things straight and trying again, slowly, can make the true answer clear.',
  grownUpFact:
    'Vitruvius was a Roman architect and engineer who lived in the first century BCE and wrote a ten-book work, De architectura (On Architecture), around the 20s BCE. In Book 10 he described a carriage odometer: as the wheel turned, linked toothed discs advanced until, after enough turns to equal one Roman mile, a small stone dropped through a hole into a bronze box below. Travelers counted the fallen stones to count the miles. A Roman mile (mille passus, a thousand paces) was about 1,480 meters. The design here is imagined gently for young listeners; the real device used geared discs, not a hand-set wheel and tray.',
  pages: [
    {
      text: 'Long ago in the lands of Rome lived a careful builder named Vitruvius. He wrote his ideas in ten quiet books by lamplight. In one book he pictured a clever little cart. It had one wooden wheel and a small covered box. This tale imagines that cart, warm and slow, the way he might have told it.',
      cue: 'Picture a builder writing by a soft lamp. Can you turn one hand slowly, like a little wheel?',
      scene: {
        id: 'the-machine-that-counted-miles-p1-intro',
        focus: 'the builder Vitruvius beside an imagined one-wheeled counting cart',
        composition:
          'Foreground: a red wooden wheel and a small covered box; midground: Vitruvius kneeling with a wax tablet and a bowl of smooth pebbles; background: a calm Roman courtyard with columns and the first evening lamps',
        palette: 'sunset ochre, sea green, wax gold, and terracotta',
      },
      alt: 'The Roman builder Vitruvius kneels beside a small one-wheeled counting cart with a bowl of pebbles.',
    },
    {
      text: 'He rolled the cart along one pale stone tile. The wheel went all the way around, one full turn. Click! One smooth pebble dropped into the box. "Turn, click, pebble, count," he said softly to himself. He lifted the lid and found exactly one pebble waiting inside.',
      cue: 'Trace one slow circle in the air. Can you make one soft click when your finger comes home?',
      scene: {
        id: 'the-machine-that-counted-miles-p2-oneturn',
        focus: 'one pebble dropping as the wheel completes a single turn',
        composition:
          'Foreground: the red wheel at its starting mark and a single falling pebble; midground: Vitruvius guiding the cart slowly across one tile; background: ruled courtyard pavement and quiet closed doors',
        palette: 'warm clay, cartwheel red, pebble gray, and dusk blue',
      },
      alt: 'One pebble drops into a small box as a red wheel finishes one full turn.',
    },
    {
      text: 'Next he rolled the little cart across two tiles. The red mark on the wheel came home, then came home again. Click, click. Two pebbles rested below. He touched each pebble once and pressed two marks into the wax. The wheel had remembered both turns, one by one.',
      scene: {
        id: 'the-machine-that-counted-miles-p3-twoturns',
        focus: 'two pebbles beside two marks pressed into wax',
        composition:
          'Foreground: two smooth pebbles and two wax tally marks; midground: Vitruvius touching each pebble once as the cart rests; background: two pale pavement tiles under a violet evening sky',
        palette: 'honey gold, walnut brown, limestone cream, and violet dusk',
      },
      alt: 'Two pebbles sit beside two marks pressed into a wax tablet.',
    },
    {
      text: 'On the third try, the box leaned against a chipped tile. The wheel turned, yet no pebble fell. Vitruvius looked at the empty tray and paused. He did not scold the little cart. He lifted it, set its box level again, and returned the wheel mark to the start.',
      scene: {
        id: 'the-machine-that-counted-miles-p4-reset',
        focus: 'the tilted counting box being set level again on smooth stone',
        composition:
          'Foreground: an empty pebble tray and the chipped edge of one tile; midground: Vitruvius leveling the cart with steady hands; background: a quiet doorway and one soft amber lamp',
        palette: 'muted rust, cool stone, soft gray, and lamp amber',
      },
      alt: 'A tilted counting box is gently set level again on smooth pavement.',
    },
    {
      text: 'He tried once more, slower this time. The red mark traveled down, around, and home. Click! A pebble landed. Another turn brought another pebble. "Turn, click, pebble, count," he whispered. He checked the wheel, then the box, then the pebbles, in the same gentle order.',
      cue: 'Tap four fingertips slowly. How many taps did you hear when each tap happened only once?',
      scene: {
        id: 'the-machine-that-counted-miles-p5-retry',
        focus: 'the builder checking wheel, box, and pebbles in a calm sequence',
        composition:
          'Foreground: the level counting box and two newly dropped pebbles; midground: Vitruvius following the red wheel mark with one finger; background: the wax tablet on a low bench and a rising moon',
        palette: 'deep teal, wax-tablet gold, pebble silver, and moon cream',
      },
      alt: 'The builder calmly checks the wheel, the box, and the pebbles in order.',
    },
    {
      text: 'Across the last row of tiles, the little cart clicked four times. Four pebbles chimed softly in the box. He drew four marks and compared the two neat rows. The wheel had turned the same way again and again. Its repeating journey had become a count he could hold and see.',
      scene: {
        id: 'the-machine-that-counted-miles-p6-count',
        focus: 'four pebbles aligned beside four wax marks',
        composition:
          'Foreground: four pebbles in a neat row and four marks on the wax tablet; midground: Vitruvius comparing both rows and parking the cart; background: a long straight band of tiles and a quiet moonlit colonnade',
        palette: 'indigo, walnut, pale limestone, and quiet amber',
      },
      alt: 'Four pebbles line up beside four wax marks in matching rows.',
    },
    {
      text: 'At last he tipped the pebbles back into their bowl and covered the cart with cloth. He set his lamp low and rested near the doorway. The wheel stood still with its red mark at the top. No click sounded now. Moonlight crossed the quiet wax tablet as his counting thoughts grew soft. Goodnight.',
      scene: {
        id: 'the-machine-that-counted-miles-p7-rest',
        focus: 'the covered counting cart beside the resting builder under the moon',
        composition:
          'Foreground: the cloth-covered cart and a bowl of resting pebbles; midground: Vitruvius resting near the doorway with the wax tablet beside his folded hands; background: moonlit columns and closed courtyard doors',
        palette: 'deep navy, muted terracotta, moon silver, and blanket cream',
      },
      alt: 'The covered counting cart rests beside the sleeping builder under a quiet moon.',
    },
  ],
};
