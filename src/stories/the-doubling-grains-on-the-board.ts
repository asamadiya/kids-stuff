import type { Story } from '../types';

export const theDoublingGrainsOnTheBoard: Story = {
  slug: 'the-doubling-grains-on-the-board',
  title: 'The Doubling Grains on the Board',
  subtitle: 'An old Indian tale of the sage Sessa and the chaturanga board.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Twice as many, then we stop',
  readAloudMinutes: 5,
  learningTakeaway:
    'To double a pile, make the next pile twice as large as the one before it. Starting from one, the piles count out one, then two, then four, then eight, growing bigger each step.',
  heartTakeaway:
    'Noticing a clever pattern is wonderful, and knowing when to pause a playful idea is wise too.',
  grownUpFact:
    'This is a teaching legend, not a recorded event. Old tales from India tell of a sage often named Sessa (or Sissa ibn Dahir) who is said to have shown a ruler the board game chaturanga, an early ancestor of chess that flourished in India by about the 7th century. In the story, Sessa asks only for grain, doubled on each of the 64 squares. The earliest written version we have was recorded much later, around 1256, by the writer Ibn Khallikan. Doubling this way is exponential growth: the full board would need 2^64 minus 1 grains, roughly 18 quintillion, far more than any kingdom holds. We keep the piles tiny here, only 1, 2, 4, and 8.',
  pages: [
    {
      text: 'Long ago in India, storytellers shared a tale under warm lamplight. This is a legend, not a record, the kind grandparents still love to tell. In the tale, a wise old sage named Sessa showed a ruler a board game called chaturanga. Each little square sat in a tidy row. The ruler was pleased and asked what gift Sessa would like. Sessa smiled and said something surprising. "Only grain, doubled on every square." A curious child listening whispered a small rule to remember. "Twice as many, then we stop."',
      cue: 'Look at the tidy little squares on the board. Can you count the first four in a row?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p1',
        focus: 'the sage Sessa presenting the chaturanga board to a listening ruler',
        composition:
          'Foreground: a square chaturanga board with four empty squares in a row and a small bowl of grain; midground: the kind old sage Sessa beside a seated ruler; background: a columned lamplit hall with quiet rolled manuscripts',
        palette: 'warm ochre, manuscript cream, and leaf green',
      },
      alt: 'An old sage shows a square board game to a seated ruler in a lamplit hall, with a small bowl of grain waiting beside four empty squares.',
    },
    {
      text: 'In the tale, one small grain was placed on the very first square. Then two grains were counted onto the next square. Pat, pat. The second little pile held two grains standing close together. The child watching pressed one fingertip down, then two, matching the growing count. Each new number was simply the pile before it, doubled. "Twice as many, then we stop," the child said softly.',
      cue: 'Touch one fingertip, then two fingertips. What number is twice as many as one?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p2',
        focus: 'a hand placing one grain, then two grains, on the first squares',
        composition:
          'Foreground: a pile of one grain and a pile of two grains on two squares; midground: a child pressing fingertips to count along; background: a low wooden desk and soft lamplit columns',
        palette: 'saffron cloth, clay brown, and indigo',
      },
      alt: 'A hand places one grain on the first square and two grains on the next, while a child counts along by pressing fingertips down.',
    },
    {
      text: 'On the third square, four grains were counted, one gentle touch at a time. On the fourth square, eight grains gathered into a slightly bigger pile. Now the board held four small steps of grain, sitting in a neat pattern. One, then two, then four, then eight. Each little pile was twice as many as its neighbor. The child looked at the tidy count and felt happy.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p3',
        focus: 'four grain piles counting one, two, four, and eight across the board',
        composition:
          'Foreground: four grain piles across four squares showing counts of one, two, four, and eight; midground: the child counting the pile of eight carefully; background: Sessa watching kindly in a calm hall',
        palette: 'muted gold, rose earth, and peacock blue',
      },
      alt: 'Four grain piles sit across four squares, counting one, two, four, and eight, while a child counts the pile of eight and a sage watches kindly.',
    },
    {
      text: 'In the legend, a helper lifted a full grain bowl and asked a big question. Should the doubling really continue across every single square? The child looked at the many empty squares still waiting ahead. Each next pile would grow so much bigger, so very quickly. The child felt a small worry that a fun game might waste precious food. A clever idea, they thought, still needs a careful pause.',
      cue: 'Look how each pile grows bigger. What do you think happens on the very next square?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p4',
        focus: 'a child looking across many empty squares beside a full grain bowl',
        composition:
          'Foreground: a large closed grain bowl; midground: the child gazing along many empty squares ahead; background: the long board fading toward tall columns',
        palette: 'dusky coral, plum, and lamp amber',
      },
      alt: 'A child looks along a board of many empty squares beside a large closed grain bowl, thinking carefully before adding any more grain.',
    },
    {
      text: 'So the storyteller offered small clay counters for any pretend piles beyond the first four. The child gathered the real food grains back into their jar. The pattern could still be seen using playful clay, not a mountain of supper. "Twice as many, then we stop," the child said, feeling proud. The tale of Sessa could show a surprising number idea without spilling any food.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p5',
        focus: 'a child returning food grains to a jar and choosing clay counters',
        composition:
          'Foreground: a grain jar and a small row of clay counters; midground: the child scooping grain back with a storyteller nearby; background: a rolled cloth edge and a soft moonrise doorway',
        palette: 'sandstone pink, deep indigo, and brass',
      },
      alt: 'A child pours food grains back into a jar and picks up small clay counters instead, keeping the number pattern without wasting any food.',
    },
    {
      text: 'The child pointed along the first four squares once more. One, two, four, eight. There was no need to fill the whole board to understand the number rule. Sessa nodded slowly, his eyes warm and kind. Knowing a pattern was clever, and knowing when to pause was wise. The quiet hall settled gently around the little board.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p6',
        focus: 'a child pointing along the four counted piles as Sessa nods',
        composition:
          'Foreground: four squares showing dot-like piles of one, two, four, and eight; midground: the child pointing along the row; background: the dim, peaceful sabha hall',
        palette: 'soft vermilion, night blue, and leaf green',
      },
      alt: 'A child points along four piles counting one, two, four, and eight while the old sage Sessa nods kindly in a dim, peaceful hall.',
    },
    {
      text: 'At last the board was rolled and the little jar was tied shut. Four tiny piles stayed only in the child’s memory, stepping softly from one to two to four to eight. The lamps dimmed low, and the old tale of Sessa drifted into a whisper. The child curled up close as the quiet hall breathed into night. Warm and snug, they let their eyes fall gently closed. Goodnight.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p7',
        focus: 'a child resting cozily as the lamps dim over the rolled board',
        composition:
          'Foreground: a rolled board, a tied grain jar, and a small row of clay counters at rest; midground: the child curled up snug beside a warm shawl; background: dark columns and one soft low lamp',
        palette: 'moonlit earth, quiet indigo, and one amber lamp',
      },
      alt: 'A child curls up snug beside a warm shawl as the lamps dim over a rolled board and a tied grain jar, drifting gently into a quiet night.',
    },
  ],
};
