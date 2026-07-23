import type { Story } from '../types';

export const theBookPrintedWithMetal: Story = {
  slug: 'the-book-printed-with-metal',
  title: 'The Book Printed With Metal',
  subtitle:
    'Monks at Heungdeok Temple print the Jikji with tiny reusable metal letters.',
  domain: 'materials',
  collection: 'historical',
  repeatedPhrase: 'One little block, one little place',
  readAloudMinutes: 5,
  learningTakeaway:
    'Each metal letter is its own small block. The blocks can be set in rows, inked, and pressed to print a whole page. Afterward the same blocks are cleaned and used again for a different page.',
  heartTakeaway:
    'Doing careful work one small piece at a time, and checking each piece gently, makes something lasting and shared.',
  grownUpFact:
    'The Jikji was printed at Heungdeok Temple in Cheongju, Korea, in 1377 CE, using cast metal movable type. It gathers Buddhist teachings compiled by the monk Baegun (Baegun Gyeonghan). The surviving lower volume is held at the Bibliotheque nationale de France in Paris, and it is the oldest known book printed with movable metal type, an extant-object claim rather than a claim about who first invented the method.',
  pages: [
    {
      text: 'Long ago, in the town of Cheongju in Korea, monks worked in a quiet temple room. It was the year 1377. They wanted to make a book of gentle teachings gathered by a kind old monk named Baegun. On a low wooden tray lay many tiny metal letters, one word at a time. "One little block, one little place."',
      cue: 'Wiggle your fingers like you are picking up one tiny metal letter at a time.',
      scene: {
        id: 'the-book-printed-with-metal-p1',
        focus: 'monks beside a wooden tray of tiny metal type letters in a temple print room',
        composition:
          'Foreground: a low tray of cool metal type blocks and a rectangular wooden frame; midground: two calm monks in grey robes leaning over the tray; background: dancheong-painted temple eaves and shelves of pale paper',
        palette: 'jade green, warm sand and soft cream in gentle evening light',
      },
      alt: 'Monks in grey robes lean over a wooden tray of tiny metal letters beside a printing frame in a painted temple room.',
    },
    {
      text: 'Each little letter was its own small block of metal. The monks sorted the cool blocks into rows inside the frame. Tap, tap went metal on wood. They set each word snug beside the next, yet every block stayed separate. That was the clever part. A separate block could be lifted out later and used again.',
      cue: 'Line up three fingertips in a neat little row, snug but still apart.',
      scene: {
        id: 'the-book-printed-with-metal-p2',
        focus: 'a monk setting separate metal blocks into a frame while another sorts the tray',
        composition:
          'Foreground: wooden compartments of plain metal blocks standing in straight rows; midground: one monk placing a block, one monk sorting; background: a low print table and a jade-painted beam',
        palette: 'bronze, clay gold and soft blue',
      },
      alt: 'A monk sets a small metal block into a frame of neat rows while another monk sorts more blocks in wooden compartments.',
    },
    {
      text: 'When the rows were full, a monk brushed dark ink across the raised metal faces. He laid a clean sheet of paper over the frame and pressed it softly down. Whuff. When he lifted the paper, a whole page of words had appeared at once. Many little blocks had shared their marks with one quiet sheet.',
      scene: {
        id: 'the-book-printed-with-metal-p3',
        focus: 'a monk pressing paper onto the inked metal frame to make a printed page',
        composition:
          'Foreground: an ink pad and a fresh sheet of paper; midground: a monk pressing the paper down over the frame; background: the rectangular frame centered below the sheet',
        palette: 'muted teal, warm ochre and soft stone grey',
      },
      alt: 'A monk presses a clean sheet of paper over an inked metal frame, and a full printed page appears at once.',
    },
    {
      text: 'On the next printed sheet, one row had a pale little gap. A word was missing. The monks did not hurry or fuss. They looked at the frame and looked at the sorting tray, side by side. One small metal block had slipped into the wrong spot, and one place in the frame sat empty, waiting.',
      cue: 'What could the monks check before they print another page?',
      scene: {
        id: 'the-book-printed-with-metal-p4',
        focus: 'monks comparing the frame with the tray to find one missing block',
        composition:
          'Foreground: a pale blank gap in one printed row of words; midground: two monks calmly comparing the frame and the tray; background: a dim, cozy print room at gloaming',
        palette: 'dusty rose, soft violet and warm brown',
      },
      alt: 'Two monks calmly compare a printing frame with a sorting tray to find a single missing metal letter block.',
    },
    {
      text: 'A young monk pointed to the empty place in the frame. His elder nodded kindly and returned the misplaced block to its spot. "One little block, one little place." They inked the frame and pressed once more. This time the row was whole. One careful look had fixed the page and saved good paper too.',
      scene: {
        id: 'the-book-printed-with-metal-p5',
        focus: 'an elder monk returning the missing block to the empty frame slot',
        composition:
          'Foreground: the single misplaced cool metal block; midground: an elder monk settling it into the empty frame slot; background: a young monk pointing gently from nearby',
        palette: 'deep jade, moon blue and warm brass',
      },
      alt: 'An elder monk gently returns a small metal block to an empty slot in the frame while a young monk points helpfully.',
    },
    {
      text: 'When the printing was done, the monks wiped the metal blocks clean and dry. The same little blocks would join new rows tomorrow for a different page. They did not have to carve one whole page forever. Sorted and saved, the metal letters were ready to be used again and again.',
      cue: 'Pretend to tuck the tidy little blocks back into their tray, one by one.',
      scene: {
        id: 'the-book-printed-with-metal-p6',
        focus: 'monks cleaning and sorting the metal blocks back into trays for reuse',
        composition:
          'Foreground: clean dry metal blocks; midground: monks sorting the pieces into wooden trays; background: finished pages resting under a soft cloth beneath moonrise eaves',
        palette: 'silver sand, deep indigo and one warm lamp',
      },
      alt: 'Monks wipe the metal letter blocks clean and sort them back into wooden trays while finished pages rest under a cloth.',
    },
    {
      text: 'At last the frame stood empty. The metal letters rested in tidy trays, and the fresh pages lay beneath a clean cloth. Soft rain ticked under the painted eaves. Every little block had found its resting place. Long after, this book, the Jikji, would still be treasured. The quiet temple slept. Goodnight.',
      scene: {
        id: 'the-book-printed-with-metal-p7',
        focus: 'the empty frame and tidy trays as the temple settles into a calm rainy night',
        composition:
          'Foreground: a folded cloth over finished pages and tidy trays of metal letters; midground: the empty printing frame at rest; background: rain-dark temple eaves under a gentle night sky',
        palette: 'charcoal blue, pale stone and quiet amber lamplight',
      },
      alt: 'An empty printing frame and tidy trays of metal letters rest under soft rain as the quiet temple settles into night.',
    },
  ],
};
