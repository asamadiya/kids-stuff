import type { Story } from '../types';

export const theRabbitsAndTheNumberLadder: Story = {
  slug: 'the-rabbits-and-the-number-ladder',
  title: 'The Rabbits and the Number Ladder',
  subtitle: 'Leonardo of Pisa, called Fibonacci, shares a rabbit riddle from his old book.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'the next row waits for two',
  readAloudMinutes: 5,
  learningTakeaway:
    'In one old counting puzzle, each new number in the ladder is made by joining the two numbers just before it: one, one, two, three, five, eight.',
  heartTakeaway:
    'Slow counting and looking back at what you already know can turn a hard puzzle into a gentle, tidy pattern.',
  grownUpFact:
    'Leonardo of Pisa (c.1170–c.1250), later nicknamed Fibonacci, wrote Liber Abaci in Pisa, Italy, in 1202 CE. As a boy he lived for a time in Bugia in North Africa, where his merchant father worked, and there he learned Hindu-Arabic numerals from Arab mathematicians. His book helped bring those numerals to Europe. It also posed a puzzle about breeding rabbits whose answer follows the pattern 1, 1, 2, 3, 5, 8 — today called the Fibonacci sequence. This story frames that famous rabbit riddle gently, as a bedtime tale.',
  pages: [
    {
      text: 'Long ago, in the busy port of Pisa in Italy, lived a man named Leonardo. People later called him Fibonacci. As a boy he had traveled far with his merchant father to Bugia across the sea. There, kind teachers showed him a new way to write every number. He loved counting so much that he wrote a big book about it in the year 1202.',
      cue: 'Say his name softly with me: Fi-bo-nach-chi. Can you count to five on your fingers?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p1',
        focus: 'Leonardo of Pisa sits at a wooden desk with his great counting book open by candlelight',
        composition:
          'Foreground: Leonardo at a wooden desk with an open book and neat rows of numbers; midground: a basket of soft cloth rabbits beside a counting board; background: warm Pisa rooftops and a calm harbor under a golden evening sky',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A gentle scholar sits at a desk with an open counting book, a basket of cloth rabbits nearby, under warm Pisan rooftops at dusk.',
    },
    {
      text: 'In his book, Leonardo wrote a little riddle about rabbits. He drew them as a ladder of rows, one row for each month. He set one small rabbit in the first row. He set one small rabbit in the second row too. "The next row waits for two," he said softly, curious what the ladder would do.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p2',
        focus: 'a ladder of rows begins with one rabbit, then one rabbit, drawn on parchment',
        composition:
          'Foreground: parchment showing a rising ladder of rows, the first two rows each holding one soft rabbit; midground: Leonardo pointing gently at the rows; background: a quiet Pisa study, simplified and uncluttered, at dusk',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A parchment shows a ladder of rows, the first two rows each holding a single rabbit, as a scholar points at them.',
    },
    {
      text: 'Leonardo looked at the last two rows: one rabbit and one rabbit. He slid the two groups together and counted them. One and one made two. So the third row of his ladder held two rabbits. The little staircase now read one, one, two. This was the pattern he wanted to share.',
      cue: 'Hold up one finger on each hand. How many fingers do they make together?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p3',
        focus: 'one rabbit and one rabbit join to make a third row of two rabbits',
        composition:
          'Foreground: two single-rabbit rows joining into a new row of two rabbits on the parchment ladder; midground: Leonardo counting on his fingers; background: candlelit desk, simplified and uncluttered, at dusk',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'Two rows of one rabbit each join to form a third row of two rabbits on a parchment ladder beside a counting scholar.',
    },
    {
      text: 'Leonardo kept the same gentle rule. He looked at the last two rows again: one and two. He joined those groups and counted three. So the fourth row held three rabbits, and the fifth would need a look back too. Each new row was simply the two rows just behind it, added together.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p4',
        focus: 'groups of one and two rabbits join to make a row of three',
        composition:
          'Foreground: a row of one rabbit and a row of two rabbits sliding together into a row of three; midground: Leonardo tracing the ladder with his finger; background: a warm study at gloaming, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A row of one rabbit and a row of two rabbits combine into a row of three on the ladder, traced by a gentle scholar.',
    },
    {
      text: 'A young helper watched and guessed the next row was six. Leonardo smiled and did not scold the guess. "The next row waits for two," he reminded her kindly. Together they counted the last two rows, three and two, slowly. Three and two made five, not six. A guess had shown them just where to look back.',
      cue: 'What do you notice when groups of three and two sit together?',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p5',
        focus: 'a child counts three rabbits and two rabbits together to make five',
        composition:
          'Foreground: a child slowly counting a group of three rabbits and a group of two rabbits into five; midground: Leonardo watching warmly and nodding; background: a cozy Pisa study at gloaming, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A child counts three rabbits and two rabbits into a row of five while a kind scholar watches and nods.',
    },
    {
      text: 'Leonardo read the whole ladder from the very beginning. One, one, two, three, five: the numbers climbed like tidy stairs. He wrote them into his great book so others could learn the count. Long after, people gave the pattern his nickname, Fibonacci. But that night it was simply a quiet game of rabbits and rows.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p6',
        focus: 'five tidy rabbit rows form the count one, one, two, three, five on parchment',
        composition:
          'Foreground: five neat rabbit rows spelling one, one, two, three, five; midground: Leonardo writing the numbers into his open book; background: a still study at moonrise, simplified and uncluttered',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'Five tidy rows of rabbits form the count one, one, two, three, five as a scholar writes the numbers into his book.',
    },
    {
      text: 'Before bed, Leonardo tucked the cloth rabbits back into their basket. He folded a soft cloth over the little ladder of rows. The counting board rested nearby, blank and quiet. He pictured each new row waiting kindly for the two before it. Then he closed his tired eyes beneath the warm roof of Pisa. Goodnight.',
      scene: {
        id: 'the-rabbits-and-the-number-ladder-p7',
        focus: 'the cloth rabbit rows rest beneath a cover while Leonardo sleeps',
        composition:
          'Foreground: a folded cloth over the settled rabbit rows and a closed basket; midground: Leonardo resting peacefully at his desk; background: quiet moonlit Pisa rooftops, simplified with open negative space, at deep night',
        palette: 'Pisan brick red, parchment cream, sage green, and candle gold',
      },
      alt: 'A folded cloth covers the settled rows of rabbits beside a closed basket as a gentle scholar rests under quiet moonlit rooftops.',
    },
  ],
};
