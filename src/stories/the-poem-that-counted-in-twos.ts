import type { Story } from '../types';

export const thePoemThatCountedInTwos: Story = {
  slug: 'the-poem-that-counted-in-twos',
  title: 'The Poem That Counted in Twos',
  subtitle: 'Long ago in India, a scholar named Pingala listened for short and long beats in Sanskrit poems.',
  domain: 'sound',
  collection: 'historical',
  repeatedPhrase: 'Short, long, listen along',
  readAloudMinutes: 9,
  learningTakeaway:
    'Sanskrit poems use just two beat lengths: a short syllable and a long one. By listing every way to arrange shorts and longs, Pingala studied patterns and counting. Later thinkers connected his careful lists to binary numbers and Fibonacci-like counting.',
  heartTakeaway:
    'Listening carefully and patiently helps you hear small differences, and helps a group find one shared rhythm without rushing.',
  grownUpFact:
    'Pingala was a real scholar in ancient India, usually dated around the 3rd–1st century BCE, though his exact dates are uncertain. His treatise, the Chandahshastra, organized Sanskrit poetic meter using only two syllable lengths: laghu (a short, light beat) and guru (a long, heavy beat). He described the prastara, a method for systematically listing every possible arrangement of shorts and longs for a line of a given length — effectively enumerating all two-symbol strings. Later Indian commentators extended this work with the meru-prastara, a triangular array of counts (analogous to what Europe later called Pascal’s triangle), and with maatraameru counts that follow a Fibonacci-like recurrence when a beat can be filled by either a short or a long. Modern scholars connect Pingala’s two-symbol system to binary numbers, but calling laghu and guru literal 0 and 1, or naming these sequences “binary” and “Fibonacci,” is a later, retrospective mapping rather than his own terminology.',
  pages: [
    {
      text: 'Long ago in India, people loved to say poems aloud. A thoughtful scholar named Pingala listened to how the words moved. Some sounds were short and quick. Some sounds stretched out long and slow. He wanted to understand the gentle beat inside every poem. "Short, long, listen along," he hummed to himself.',
      cue: 'Say a short quick sound, then a long slow sound. Can you hear how they feel different?',
      scene: {
        id: 'the-poem-that-counted-in-twos-p1',
        focus: 'the scholar Pingala listening to spoken poems in a calm columned hall',
        composition:
          'Foreground: Pingala seated at a low writing desk with two kinds of small beat cards; midground: young students reciting softly nearby; background: a quiet Indian hall of stone columns in warm golden light',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A gentle scholar sits at a low desk in a columned hall, listening to students recite a poem in warm light.',
    },
    {
      text: 'Pingala noticed something simple and clear. Every single beat was only one of two kinds. A short beat he named laghu, light and quick. A long beat he named guru, heavy and slow. Nothing in between, and nothing else at all. Just two sounds could build any poem in the world.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p2',
        focus: 'a short beat card beside a long beat card, showing the two lengths',
        composition:
          'Foreground: one small square card for a short clap and one long card for a stretched clap, side by side; midground: Pingala pointing to each in turn; background: a simplified Indian study hall at dusk',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'Two beat cards rest side by side, one small for a short clap and one long for a stretched clap.',
    },
    {
      text: 'He placed a short card, then a long one. Clap—claaap. He added another short card. Clap—claaap—clap. The students copied the sound softly, hands meeting in the quiet air. Pingala pointed left to right, and the row of cards held every beat in its place.',
      cue: 'Clap one short beat, then stretch one long beat, then clap short again.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p3',
        focus: 'a three-card short-long-short row guiding gentle claps',
        composition:
          'Foreground: a row of three cards in short-long-short order; midground: Pingala and students clapping the beat together; background: a calm Indian hall in dusk light',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A row of three beat cards in short-long-short order guides a group of students clapping gently.',
    },
    {
      text: 'Then Pingala changed the order: long, short, short. The very same cards made a brand new sound. "Short, long, listen along," he said again. One row rocked forward like a slow, steady step. The other seemed to wait first, then hurry. It was like two small feet skipping across the floor.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p4',
        focus: 'two rows using the same cards in different orders',
        composition:
          'Foreground: two card rows, one short-long-short and one long-short-short, using the same three cards; midground: Pingala comparing the two rhythms; background: a simplified Indian hall in gloaming light',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'Two rows of the same three cards sit in different orders, showing two different rhythm patterns.',
    },
    {
      text: 'Now Pingala wondered a bigger, braver thought. How many rhythms could two beats truly make? He decided to list them all, one by one, in order. He would never skip a single arrangement, and never repeat one. So he began with the shortest lines and worked slowly upward. His careful list would grow, row after patient row.',
      cue: 'For one beat, you can pick short or long. That is two choices. Can you clap both?',
      scene: {
        id: 'the-poem-that-counted-in-twos-p5',
        focus: 'Pingala beginning an orderly list of one-beat rows',
        composition:
          'Foreground: two single-beat rows on a mat, one short card and one long card, neatly labeled; midground: Pingala dipping a reed pen to record them; background: a quiet Indian study hall in lamplight',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A scholar records two single-beat rows, one short and one long, with a reed pen by warm lamplight.',
    },
    {
      text: 'For two beats together, he found four neat rows. Short-short, short-long, long-short, and long-long. He clapped each one and listened where the long beat rested. For three beats, the rows doubled again to eight. Each time he added one beat, the list grew twice as big. Two, four, eight: the pattern doubled like magic.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p6',
        focus: 'the four two-beat rows and the eight three-beat rows growing in a chart',
        composition:
          'Foreground: a tidy chart of four short-long rows above eight longer rows; midground: Pingala tracing the doubling with a fingertip; background: a warm Indian hall with shelves of palm-leaf manuscripts',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A tidy chart shows four two-beat rows above eight three-beat rows, doubling as the beats increase.',
    },
    {
      text: 'This orderly listing had a special name: the prastara. It meant spreading every pattern out, plainly, for all to see. Long after Pingala, other Indian scholars studied his lists. Some say his two beats work like the twos inside a counting machine. Grown-ups today call that idea binary, the language of computers.',
      cue: 'Two choices, then two more, then two more. Try counting: two, four, eight, sixteen!',
      scene: {
        id: 'the-poem-that-counted-in-twos-p7',
        focus: 'the full prastara spread out like a spreading fan of rows',
        composition:
          'Foreground: many rows of short and long beats fanning outward in growing groups; midground: Pingala and a young student admiring the spread; background: a calm Indian hall glowing in evening light',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'Many rows of short and long beats spread outward like a fan while a scholar and student admire them.',
    },
    {
      text: 'Then Pingala tried a different, curious question. What if every line had to last the same length of time? A short beat took one count, and a long beat took two. So a long beat filled the same time as two shorts together. How many ways could he fill a line of five counts? He began to count, gently and with care.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p8',
        focus: 'Pingala measuring beats by how long they last, not just their order',
        composition:
          'Foreground: a short card marked with one dot and a long card marked with two dots, matched to a time strip; midground: Pingala laying beats along a measured line; background: a quiet Indian hall at dusk',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A short card with one dot and a long card with two dots are matched along a measured time strip.',
    },
    {
      text: 'The answers made a wonderful little ladder of numbers. One way, then two, then three, then five, then eight. Each number was simply the two before it, added together. "Short, long, listen along," he whispered, delighted. Much later, thinkers far away found this very same ladder. Some now call it the Fibonacci pattern, hidden inside poems.',
      cue: 'Add the last two numbers: one and one make two, one and two make three. Keep going!',
      scene: {
        id: 'the-poem-that-counted-in-twos-p9',
        focus: 'the growing ladder of counts 1, 2, 3, 5, 8 climbing upward',
        composition:
          'Foreground: a gentle staircase of numbers 1, 2, 3, 5, 8 made of stacked beat cards; midground: Pingala pointing up the climbing steps; background: a warm Indian hall with a rising moon',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A staircase of stacked beat cards climbs upward showing the counts one, two, three, five, and eight.',
    },
    {
      text: 'Pingala arranged his counts into a tidy little mountain of rows. It told him how many patterns had one long, or two, or three. This triangle of numbers he tucked into his work with joy. Far to the west, long after, people drew the same triangle. They never knew a scholar in India had climbed it first.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p10',
        focus: 'the triangular meru-prastara of counts rising like a small mountain',
        composition:
          'Foreground: a neat triangle of numbers widening row by row, shaped like a gentle peak; midground: Pingala resting a hand at its base; background: a serene Indian hall with distant painted mountains',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A neat triangle of numbers widens row by row like a gentle mountain while the scholar rests a hand at its base.',
    },
    {
      text: 'From only two beats, so many rhythms and numbers could grow. Yet Pingala never lost the poem inside the counting. He matched a moon poem to the one rhythm he loved best. He let that gentle beat carry the words across the hall. The students smiled at the shared, steady, singing sound.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p11',
        focus: 'Pingala matching poem words to one chosen beat-card row',
        composition:
          'Foreground: one chosen row of beat cards with a small stack of unused cards beside it; midground: Pingala speaking a poem line as students listen; background: a warm Indian hall at moonrise',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'A scholar speaks a poem line beside one chosen row of beat cards and a small stack of unused cards.',
    },
    {
      text: 'Long after that quiet night, his idea traveled far and wide. Poets kept his beats, and counters kept his lists. Computers hum in twos, the way his two beats hummed. So listen the next time you hear a favorite song. Somewhere inside is a short, a long, a pattern waiting. "Short, long, listen along," and the counting sings on.',
      cue: 'Clap your favorite song. Which beats are short, and which stretch long? Listen and count together.',
      scene: {
        id: 'the-poem-that-counted-in-twos-p12',
        focus: 'the legacy of Pingala’s two beats echoing from ancient poems to today',
        composition:
          'Foreground: three beat cards in short-short-long order beside an open palm-leaf book; midground: a modern child clapping a rhythm, faintly imagined; background: an Indian hall dissolving into soft starlight and gentle glowing lines',
        palette: 'sandalwood, peacock blue, parchment cream, plum, and moon gold',
      },
      alt: 'Three beat cards rest beside an open palm-leaf book as a faintly imagined child claps a rhythm under soft starlight.',
    },
  ],
};
