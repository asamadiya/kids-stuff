import type { Story } from '../types';

export const theRabbitsAndTheNumberLadder: Story = {
  slug: 'the-rabbits-and-the-number-ladder',
  title: 'The Rabbits and the Number Ladder',
  subtitle: 'Leonardo of Pisa, called Fibonacci, shares a rabbit riddle from his old book.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'the next row waits for two',
  readAloudMinutes: 9,
  learningTakeaway:
    'In one old counting puzzle, each new number in the ladder is made by joining the two numbers just before it: one, one, two, three, five, eight, thirteen. This is now called the Fibonacci sequence.',
  heartTakeaway:
    'Slow counting and looking back at what you already know can turn a hard puzzle into a gentle, tidy pattern you can find all over the world.',
  grownUpFact:
    'Leonardo of Pisa (c.1170–c.1250), later nicknamed Fibonacci, wrote Liber Abaci in Pisa, Italy, in 1202 CE. As a boy he lived for a time in Bugia in North Africa, where his merchant father worked, and there he learned Hindu-Arabic numerals from Arab mathematicians. His book helped bring the digits 0–9 and place value to Europe, slowly replacing Roman numerals in trade and arithmetic. It also posed a puzzle about breeding rabbits whose answer follows the pattern 1, 1, 2, 3, 5, 8, 13 — today called the Fibonacci sequence. The same sequence turns up often in plants: many flowers have petal counts like 3, 5, 8, 13, and the spirals of pinecones and sunflower seed heads commonly follow neighboring Fibonacci numbers. This story frames that famous rabbit riddle as a warm tale of noticing a pattern.',
  pages: [
    {
      text: 'Long ago, in the busy port of Pisa in Italy, lived a man named Leonardo. As a boy he sailed far with his merchant father to Bugia across the sea. In the noisy markets there, traders wrote numbers a wonderful new way. They used ten little signs: zero, one, two, all the way to nine. Back home, most people still scratched clumsy Roman letters for numbers. Leonardo thought the new way was faster and far more clever.',
      cue: 'Count with me on your fingers, zero to nine. Which way seems easier to you?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p1',
        focus: 'young Leonardo watching Bugia market traders write with new numeral signs',
        composition:
          'Foreground: a market table with a sand board showing the digits zero to nine; midground: young Leonardo leaning in, wide-eyed, beside a kind Arab trader; background: sunlit North African market stalls, striped awnings, and a bright blue harbor',
        palette: 'terracotta orange, saffron gold, indigo cloth, and warm desert sand',
      },
      alt: 'A curious boy leans over a market sand board showing digits zero to nine as a kind trader writes, under sunlit striped awnings by a bright harbor.',
    },
    {
      text: 'Years later, Leonardo grew into a thoughtful young scholar. He filled a great book with all he had learned about counting. He called it Liber Abaci, the Book of Counting, in the year 1202. In it he taught Europe to write with those handy new digits. He also tucked in playful riddles for readers to puzzle over. One little riddle was all about rabbits and rows.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p2',
        focus: 'Leonardo at a candlelit desk writing his great counting book',
        composition:
          'Foreground: Leonardo at a wooden desk, quill in hand, the open Liber Abaci showing neat rows of digits; midground: a basket of soft cloth rabbits beside a counting board; background: warm Pisa rooftops and a calm harbor under a golden evening sky',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A gentle scholar writes at a candlelit desk beside an open book of numbers, a basket of cloth rabbits nearby, under warm Pisan rooftops at dusk.',
    },
    {
      text: 'In the riddle, Leonardo imagined a ladder of rows on his parchment. Each row would stand for one passing month of the year. He set one small rabbit in the very first row. He set one small rabbit in the second row too. "The next row waits for two," he said softly, curious. He wondered how quickly a family of rabbits might grow.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p3',
        focus: 'a ladder of rows begins with one rabbit, then one rabbit, drawn on parchment',
        composition:
          'Foreground: parchment showing a rising ladder of rows, the first two rows each holding one soft rabbit; midground: Leonardo pointing gently at the rows; background: a quiet Pisa study, simplified and uncluttered, at dusk',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A parchment shows a ladder of rows, the first two rows each holding a single rabbit, as a scholar points at them.',
    },
    {
      text: 'Leonardo looked at the last two rows: one rabbit and one rabbit. He slid the two little groups gently together and counted them. One and one made two. So the third row of his ladder held two rabbits. The tiny staircase now read one, one, two. Each step was built from the steps behind it.',
      cue: 'Hold up one finger on each hand. How many fingers do they make together?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p4',
        focus: 'one rabbit and one rabbit join to make a third row of two rabbits',
        composition:
          'Foreground: two single-rabbit rows joining into a new row of two rabbits on the parchment ladder; midground: Leonardo counting on his fingers; background: candlelit desk, simplified and uncluttered, at dusk',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'Two rows of one rabbit each join to form a third row of two rabbits on a parchment ladder beside a counting scholar.',
    },
    {
      text: 'Leonardo kept the very same gentle rule going. He looked at the last two rows again: one and two. He joined those groups and counted three, slow and sure. So the fourth row of the ladder held three rabbits. Each new row was simply the two rows just behind it, added. You never had to guess; you only had to look back.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p5',
        focus: 'groups of one and two rabbits join to make a row of three',
        composition:
          'Foreground: a row of one rabbit and a row of two rabbits sliding together into a row of three; midground: Leonardo tracing the ladder with his finger; background: a warm study at gloaming, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A row of one rabbit and a row of two rabbits combine into a row of three on the ladder, traced by a gentle scholar.',
    },
    {
      text: 'A young helper watched and guessed the next row was six. Leonardo smiled warmly and did not scold her guess. "The next row waits for two," he reminded her kindly. Together they counted the last two rows, three and two, slowly. Three and two made five, not six at all. A guess had shown them exactly where to look back.',
      cue: 'What do you notice when a group of three and a group of two sit together?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p6',
        focus: 'a child counts three rabbits and two rabbits together to make five',
        composition:
          'Foreground: a child slowly counting a group of three rabbits and a group of two rabbits into five; midground: Leonardo watching warmly and nodding; background: a cozy Pisa study at gloaming, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A child counts three rabbits and two rabbits into a row of five while a kind scholar watches and nods.',
    },
    {
      text: 'On they climbed, adding the last two rows each time. Five and three joined to make a row of eight. Then eight and five joined to make thirteen rabbits. The numbers grew faster and faster the higher they went. One, one, two, three, five, eight, thirteen: the ladder soared up. A small, quiet rule was making a very lively family.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p7',
        focus: 'the rabbit rows climb to eight, then thirteen, on tall parchment',
        composition:
          'Foreground: rows of five, eight, and thirteen soft rabbits rising up the parchment ladder; midground: Leonardo and the child looking up at the growing count; background: candlelit shelves and a tall window, simplified, at deep dusk',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'Rows of five, eight, and thirteen rabbits climb a tall parchment ladder as a scholar and child gaze up at the growing count.',
    },
    {
      text: 'The helper asked why anyone should care about a rabbit riddle. Leonardo said the pattern was the real treasure, not the rabbits. Any counter, anywhere, could build it with just adding. "The next row waits for two," he said, and she finally smiled. She saw that a huge, hard count could hide a tiny, tidy rule. That, he told her, was the quiet magic of numbers.',
      cue: 'Try adding the two before: after thirteen comes twenty-one. Can you find the next one?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p8',
        focus: 'Leonardo explaining the pattern warmly to the young helper',
        composition:
          'Foreground: Leonardo gesturing at the tidy ladder while the child leans in, understanding dawning; midground: the counting board with a fresh sum, twenty-one; background: a snug moonlit Pisa study, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A kind scholar points at a tidy number ladder as a young helper leans in, understanding, beside a counting board in a moonlit study.',
    },
    {
      text: 'Leonardo wrote the whole ladder carefully into his great book. He wanted counters far away and long after him to learn it. His book slowly taught Europe the easy new way to count. Merchants and builders traded the clumsy Roman letters for digits. Long after, people gave the rabbit pattern his nickname, Fibonacci. But that night it was simply a quiet game of rows.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p9',
        focus: 'Leonardo writing the finished number ladder into his open book',
        composition:
          'Foreground: the open book showing one, one, two, three, five, eight, thirteen in neat digits; midground: Leonardo writing steadily by candlelight; background: a still study at moonrise, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A scholar writes the count one, one, two, three, five, eight, thirteen into his open book by candlelight in a still moonlit study.',
    },
    {
      text: 'Here is the wondrous part Leonardo could hardly have guessed. That same ladder of numbers hides all over the living world. Count the petals on many flowers: often three, or five, or eight. Look at a pinecone and follow its little spiraling rows. Look at the swirling seeds packed in a sunflower head. Again and again, those tidy Fibonacci numbers quietly appear.',
      cue: 'Next time you hold a flower, gently count its petals. Do you get a ladder number?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p10',
        focus: 'flowers, a pinecone, and a sunflower showing spiral Fibonacci counts',
        composition:
          'Foreground: a five-petal flower, a pinecone with spiral rows, and a sunflower head with swirling seeds; midground: a child gently counting petals; background: a soft garden at golden hour, simplified and uncluttered',
        palette: 'sunflower gold, petal cream, leaf green, and warm evening amber',
      },
      alt: 'A five-petal flower, a spiraled pinecone, and a swirling sunflower head as a child gently counts petals in a golden garden.',
    },
    {
      text: 'Leonardo tucked the cloth rabbits back into their soft basket. He set his finished book beside the quiet counting board. He thought of gardens where the very same pattern was growing. A small rule of looking back had opened a whole world. The next time you count, you can play his gentle game. Just remember: the next row waits for two.',
      cue: 'Start your own ladder: one, one, two. Say the next numbers with me tonight.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p11',
        focus: 'Leonardo resting content beside his book as the pattern lingers in mind',
        composition:
          'Foreground: the closed basket of cloth rabbits and the finished book on the desk; midground: Leonardo sitting back peacefully, a small satisfied smile; background: quiet moonlit Pisa rooftops with open negative space, at deep night',
        palette: 'Pisan brick red, parchment cream, sage green, and moonlit blue',
      },
      alt: 'A content scholar sits back beside his finished book and a basket of cloth rabbits under quiet moonlit Pisan rooftops at deep night.',
    },
  ],
};
