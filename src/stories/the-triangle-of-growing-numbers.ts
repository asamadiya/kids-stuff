import type { Story } from '../types';

export const theTriangleOfGrowingNumbers: Story = {
  slug: 'the-triangle-of-growing-numbers',
  title: 'The Triangle of Growing Numbers',
  subtitle: 'How the mathematician Yang Hui shared a triangle of numbers in China long ago.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Two above help one below',
  readAloudMinutes: 9,
  learningTakeaway:
    'In a triangle of numbers, each middle number is made by adding the two numbers just above it. The edges stay as ones, and the pattern grows one careful row at a time. The same triangle also helps count choices and find the sides of squares and cubes.',
  heartTakeaway:
    'Sharing what you learn, and giving thanks to the people who taught you first, is a kind and honest thing to do.',
  grownUpFact:
    'Yang Hui was a real mathematician who lived in China during the Southern Song dynasty, around 1238 to 1298. In 1261 CE he published a book, often called the Detailed Analysis of the Nine Chapters, explaining older counting methods, and in it he printed a triangle of numbers. Yang Hui honestly credited an earlier mathematician named Jia Xian, who lived in the eleventh century, about two hundred years before him. In this triangle the edges are ones, and every inside number is the sum of the two numbers just above it. Each row also lists the coefficients you get when a sum like (a plus b) is multiplied by itself again and again, and Chinese scholars used these rows as a tool for extracting square and cube roots. In Europe the same triangle later became known as Pascal’s triangle, after Blaise Pascal wrote about it in 1653, but Chinese scholars had written it down centuries earlier.',
  pages: [
    {
      text: 'Long ago in China, in the time of the Southern Song, there lived a real mathematician named Yang Hui. He loved numbers and careful counting more than almost anything. In those days there were no calculators and no printed math books for children. Wise people wrote sums by hand and taught them out loud. One quiet evening, by the warm light of a lamp, Yang Hui smoothed a fresh sheet of paper. He wanted to draw a pattern so simple that anyone could learn it.',
      cue: 'Hold up one finger. Can you find one thing in your room, just one, like Yang Hui’s first number?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p1-lamplit-desk',
        focus: 'Yang Hui at a low desk smoothing a fresh sheet of paper by warm lamplight',
        composition:
          'Foreground: a low desk with a blank sheet of paper, an inkstone, and a resting brush; midground: Yang Hui in a scholar’s robe leaning in with quiet excitement; background: a calm Southern Song study with shelves of scrolls under warm lamplight',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A Chinese scholar smooths a fresh sheet of paper at a low desk by warm lamplight, ready to begin.',
    },
    {
      text: 'At the very top of the page he brushed a single number: one. Just one, all alone, like a tiny seed at the peak of a hill. Under it he wrote two more ones, side by side, to hold the two edges. Every row he built would keep a one on each end, like two gateposts. "The edges are always ones," he told himself. Then he looked at the little gap waiting between the two ones below.',
      cue: 'Draw a dot at the top, then two dots below it. Point to the gap in the middle where a new number will go.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p2-seed-one',
        focus: 'a single number one at the top with two ones beneath holding the edges',
        composition:
          'Foreground: a paper showing one number at the peak and two ones below it, with a soft gap between them; midground: Yang Hui’s hand hovering over the empty middle; background: the calm study softening into dusk',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A paper triangle begins with one number at the top and two ones below it, a gap waiting in the middle.',
    },
    {
      text: '"Two above help one below," Yang Hui said softly. He added the two ones together, one and one, and wrote their answer in the middle: two. That was the whole secret, small enough to fit in a whisper. Look up at the two numbers above a gap, add them, and write what they make below. The edges stayed as ones, and the middle number grew from its two helpers. A pattern had begun, one careful step at a time.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p3-first-sum',
        focus: 'two ones on the edges joining to make a two written in the middle below them',
        composition:
          'Foreground: a paper row reading one, two, one, with a soft arc joining the two ones above; midground: Yang Hui’s hand resting near the fresh middle number; background: the calm study deepening into dusk',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A row reads one, two, one, with the middle two made by joining the two ones just above it.',
    },
    {
      text: 'On the next row, two numbers waited above a new gap: a one and a two. "Two above help one below." Yang Hui counted them together, one and two, and quietly wrote three in the pocket between them. Then he found the next gap, with a two and a one above, and wrote three again. The edges stayed as ones, so the whole row read one, three, three, one. The triangle grew wider, yet kept its steady, tidy shape.',
      cue: 'Add one and two on your fingers. Do you get the same three that Yang Hui wrote?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p4-third-row',
        focus: 'a one and a two above joining to make three across a widening row',
        composition:
          'Foreground: a paper row reading one, three, three, one, with soft arcs showing which pairs above were added; midground: Yang Hui counting on his fingers; background: the study in a deeper dusk glow',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A row reads one, three, three, one, each middle number made by adding the pair above it.',
    },
    {
      text: 'For a moment, Yang Hui paused. One middle number looked a little wrong, as if he had rushed it. He did not guess, and he did not scribble over the whole page. Instead he looked back at just the two numbers directly above that one gap. He added them again, slowly and honestly, and mended the number with a calm hand. Checking his work was not a scary thing to him. It was simply part of counting well.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p5-careful-check',
        focus: 'Yang Hui checking the two numbers just above one uncertain middle number',
        composition:
          'Foreground: a paper row with one number gently circled for checking and two helpers highlighted above it; midground: Yang Hui pointing to the pair above with a thoughtful look; background: the quiet study in gloaming light',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A scholar checks the two numbers directly above one uncertain middle number to mend the row.',
    },
    {
      text: 'The next row was wider still, and Yang Hui filled each gap the same way. One and three made four. Three and three made six. Three and one made four. The row read one, four, six, four, one, tidy as beads on a string. The rule never changed, no matter how big the triangle grew. He did not need a grand new trick for each row. He only needed to look at the two numbers right above each pocket.',
      cue: 'Which two numbers did Yang Hui add to make the six? Look just above it and try.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p6-add-neighbors',
        focus: 'a three and a three above joining to make six in a wider row',
        composition:
          'Foreground: a paper row reading one, four, six, four, one, with arcs pointing up to each pair that made a number; midground: Yang Hui tracing two helpers with a finger; background: the study in soft gloaming',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A row reads one, four, six, four, one, with the middle six made from the two threes above it.',
    },
    {
      text: 'Then Yang Hui saw something wonderful hidden in the rows. Suppose you had four friends and could invite only two to tea. How many different pairs could you pick? The answer was already sitting there: six, the middle of that very row. The triangle did not only grow numbers. It quietly counted choices, all the little ways things can be gathered. A simple pattern of adding had a surprise folded neatly inside it.',
      cue: 'Imagine three toys and you may carry two. Can you name every different pair you could choose?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p7-counting-choices',
        focus: 'the number six in the triangle glowing beside four small friends choosing pairs for tea',
        composition:
          'Foreground: the row one, four, six, four, one with the six softly aglow; midground: four tiny friends at a low table forming pairs, with faint arcs linking them; background: the warm study with a steaming teapot',
        palette: 'paper cream, ink black, warm tea amber, and quiet evening blue',
      },
      alt: 'The number six in the triangle glows beside four small friends pairing up for tea, showing hidden choices.',
    },
    {
      text: 'The triangle held one more helpful gift. Long ago, before easy machines, people used these rows to find the side of a square or a cube. If you knew the space inside a square garden, the numbers guided you to the length of its edge. It was slow, patient work, done bead by bead on a counting board. Yang Hui gathered these old, clever methods so they would not be forgotten. A pattern of adding could help build and measure real things.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p8-roots-and-squares',
        focus: 'the number rows beside a small square garden as Yang Hui works a counting board',
        composition:
          'Foreground: rows of the triangle drawn near a neat square garden plot; midground: Yang Hui sliding beads on a wooden counting board; background: the study window opening to a moonlit courtyard garden',
        palette: 'paper cream, ink black, garden green, and quiet moon silver',
      },
      alt: 'Rows of the number triangle sit beside a small square garden as a scholar counts with a bead board.',
    },
    {
      text: 'Yang Hui finished only the few rows his small page could hold. Then he did a truly kind thing. He wrote down the name of Jia Xian, an older mathematician who had counted this way about two hundred years before. Yang Hui did not pretend the idea was all his own. "Two above help one below," he wrote, giving honest thanks to the one who came first. Then he set the pattern down in his book so others could learn it too.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p9-credit-teacher',
        focus: 'a completed small triangle beside a written note honoring the earlier mathematician',
        composition:
          'Foreground: a finished number triangle with a small brushed note of thanks beside it; midground: Yang Hui setting his brush down with a peaceful smile; background: the study lit by a rising moon',
        palette: 'paper cream, ink black, lamp amber, and quiet moon silver',
      },
      alt: 'A finished triangle of numbers rests beside a written note honoring the earlier mathematician Jia Xian.',
    },
    {
      text: 'His book traveled far and lasted a very long time. Hundreds of years later, in a faraway land, a young thinker named Blaise Pascal studied the same triangle. In Europe people began to call it Pascal’s triangle, after him. But the rows had been brushed onto Chinese paper long, long before. Good ideas do not belong to only one person or one place. They pass from hand to hand, like a lantern shared down a dark hallway.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p10-travels-far',
        focus: 'the same triangle appearing on two pages, one Chinese and one European, joined by a soft path of light',
        composition:
          'Foreground: two open books showing the identical number triangle, one brushed in ink, one printed in a distant land; midground: a gentle ribbon of light linking them across the page; background: a wide starlit sky bridging two rooftops far apart',
        palette: 'paper cream, ink black, starlit indigo, and warm lantern gold',
      },
      alt: 'The same number triangle appears in two books far apart, linked by a soft ribbon of light under a starlit sky.',
    },
    {
      text: 'You can grow this triangle yourself, right now. Start with one at the top, then two ones below. In every new row, keep a one at each end. For each gap, look at the two numbers above and add them. "Two above help one below." Soon your own page fills with one, two, one, then one, three, three, one, then more. The same pattern Yang Hui brushed by lamplight can bloom under your hand.',
      cue: 'Write one at the top and two ones below. Can you add your way to the next row together?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p11-you-try-it',
        focus: 'a child’s hand adding numbers to build a fresh triangle on paper',
        composition:
          'Foreground: a bright sheet with a growing number triangle and a child’s hand writing the newest number; midground: a grown-up pointing to the two helpers above; background: a cozy room with a small lamp echoing Yang Hui’s',
        palette: 'paper cream, ink black, cheerful lamp amber, and soft evening blue',
      },
      alt: 'A child’s hand adds a number to a growing triangle while a grown-up points to the two helpers above it.',
    },
    {
      text: 'At last Yang Hui rinsed his brush and let the fresh ink dry. He rolled the paper triangle gently and set it on the shelf with his other scrolls. The lamp burned low and soft. "Two above help one below," he whispered, as the round moon rose over the quiet town. Somewhere far ahead in time, a child would draw this very triangle and smile. The numbers rested, the study grew still, and the good idea slept, ready to grow again tomorrow.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p12-moonlit-rest',
        focus: 'the rolled paper triangle resting on a shelf as the lamp dims under a round moon',
        composition:
          'Foreground: a rolled scroll of the number triangle settled on a shelf; midground: Yang Hui putting away his brush and lowering the lamp; background: a still Southern Song town under a round, calm moon',
        palette: 'quiet moon silver, deep night blue, and a soft warm lamp glow',
      },
      alt: 'A rolled paper triangle rests on a shelf as a scholar dims his lamp under a round, calm moon.',
    },
  ],
};
