import type { Story } from '../types';

export const pointsLinesAndBedtime: Story = {
  slug: 'points-lines-and-bedtime',
  title: 'Points, Lines, and Bedtime',
  subtitle: 'Euclid of Alexandria builds a perfect triangle one careful rule at a time.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'One careful line, then another',
  readAloudMinutes: 9,
  learningTakeaway:
    'Long ago in Alexandria, a teacher named Euclid built shapes from a few simple rules. He drew with only a straightedge and a rounded compass, adding one careful line at a time. From tiny, checkable steps, a perfect triangle could grow, and after it a whole book of shapes anyone could repeat.',
  heartTakeaway:
    'Working slowly and checking each step leaves room to notice a tiny mistake and fix it calmly, without any worry or shame.',
  grownUpFact:
    'Euclid worked in Alexandria, Egypt around 300 BCE, during the reign of Ptolemy I. His book, the Elements, gathered geometry into 13 books built from a handful of definitions, five postulates, and a few common notions. The very first proposition builds an equilateral triangle on a line using two circles drawn with a compass, then a straightedge. Greek geometers used only an unmarked straightedge and a compass, chaining allowed steps to construct complex figures. The Elements stayed a standard geometry textbook for more than two thousand years. Little is known for certain about Euclid’s life.',
  pages: [
    {
      text: 'Long ago, in a bright city called Alexandria, a teacher named Euclid loved to draw. His city sat by the sea, with a tall stone lighthouse and a great library full of scrolls. Euclid had a flat wax tablet, a smooth straightedge, and a little rounded compass. A curious child sat close to watch. "Tonight," Euclid whispered, "we will build a perfect shape from almost nothing."',
      cue: 'Look around your room. Can you spot something with a perfectly straight edge, like Euclid’s?',
      scene: {
        id: 'points-lines-and-bedtime-p1',
        focus: 'Euclid with a blank wax tablet, straightedge, and compass, a curious child leaning close',
        composition:
          'Foreground: a wide empty wax tablet with a straightedge and a small compass resting on it; midground: Euclid seated beside a child who leans in to watch; background: a colonnaded hall, a tall lighthouse, and the harbor in warm golden light',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under golden light',
      },
      alt: 'A teacher sits with a child beside a blank wax tablet, a straightedge, and a compass in a sunlit hall near a harbor.',
    },
    {
      text: 'First, Euclid pressed one small dot near the middle. Then he laid down the straightedge and pulled a short, straight line beside the dot. "One careful line, then another," he said softly. "That is how everything grows." He showed the child his few simple rules. A straight line may be drawn between two dots. A circle may be drawn from a center. These few rules were all he would use.',
      scene: {
        id: 'points-lines-and-bedtime-p2',
        focus: 'A single dot and one straight base line on the wax tablet',
        composition:
          'Foreground: a wax tablet holding one dot and one short straight line; midground: Euclid resting the straightedge as the child studies the marks; background: a shelf of rolled scrolls and a harbor window in warm afternoon light',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under afternoon light',
      },
      alt: 'A wax tablet shows one dot and one short straight line, with a teacher and child studying it in soft light.',
    },
    {
      text: 'Now Euclid opened his little compass wide. He set its point on one end of the line and swung it all the way around. Snick, a smooth round circle appeared in the soft wax. "A compass makes a perfect circle every time," he said. "Every point on it sits the same distance from the center." The circle passed right through the other end of the line. That was no accident. It was the plan.',
      cue: 'Trace a big slow circle in the air with one finger. Try to end right where you began.',
      scene: {
        id: 'points-lines-and-bedtime-p3',
        focus: 'A compass sweeping one round circle from the end of the base line',
        composition:
          'Foreground: a compass point pinned to one line end while it draws a full circle; midground: Euclid guiding the sweep as the child watches the arc close; background: a quiet dusk colonnade and rolled blank tablets',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under dusk light',
      },
      alt: 'A compass draws a full round circle from one end of a line while a teacher guides it at dusk.',
    },
    {
      text: 'Then Euclid moved the compass to the other end of the line. "One careful line, then another," he whispered, and swung a second circle the very same size. The two circles crossed, making a bright little point up above the line. The child gasped and pointed at it. "There," said Euclid gently. "That crossing is exactly where we need to go next." The wax now held a shape like two overlapping bubbles.',
      scene: {
        id: 'points-lines-and-bedtime-p4',
        focus: 'Two equal circles overlapping, meeting at a crossing point above the base line',
        composition:
          'Foreground: two overlapping circles with a clear crossing point above the line; midground: Euclid lifting the compass while the child points at the crossing; background: a gloaming hall and the still harbor beyond',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under gloaming light',
      },
      alt: 'Two equal overlapping circles cross at a point above a line, and a child points at the crossing.',
    },
    {
      text: 'Euclid picked up the straightedge again. He drew one line from the first dot up to the crossing point. Then he drew a second line from the other end up to the same point. Two slanting sides now rose from the base and met at the top. Together with the base, they made a neat, closed triangle. "There it is," he breathed. "A triangle, built from only lines and circles."',
      cue: 'Hold up three fingers to make a triangle shape. How many straight sides can you count?',
      scene: {
        id: 'points-lines-and-bedtime-p5',
        focus: 'Two straightedge lines rising from the base ends to the crossing, closing a triangle',
        composition:
          'Foreground: a closed triangle drawn over the two faint circles; midground: Euclid setting down the straightedge as the child traces the three sides; background: the first warm glow of a lamp and an orderly shelf of tablets',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under gloaming light',
      },
      alt: 'A closed triangle is drawn over two faint circles as a teacher lowers a straightedge and a child traces the sides.',
    },
    {
      text: 'The child looked closely and asked, "Is it a fair triangle? Are the sides truly the same?" Euclid smiled at the good question. "The circles promise it," he said. "Each side reaches from a center out to the crossing." Because both circles were the very same size, all three sides matched exactly. A triangle with three equal sides has a special name. Grown-ups call it equilateral, which simply means equal-sided.',
      scene: {
        id: 'points-lines-and-bedtime-p6',
        focus: 'Euclid showing that all three triangle sides are equal, using the circles as proof',
        composition:
          'Foreground: the finished triangle with its three matching sides gently highlighted; midground: Euclid pointing along each side as the child checks them; background: a lamplit alcove and a window holding the last dusk color',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under lamplit dusk',
      },
      alt: 'A teacher points along the three equal sides of a triangle while a child checks each one by lamplight.',
    },
    {
      text: 'Then Euclid turned the straightedge a little too soon. His next practice line missed the crossing by a seed’s width. The picture looked almost right, which made the tiny slip hard to see. The child felt a worried breath. But Euclid only smiled and touched the small gap. "The rule tells us exactly where this line should reach," he said. "Let us look again, and mend it."',
      scene: {
        id: 'points-lines-and-bedtime-p7',
        focus: 'A tiny visible gap between a misplaced line and the crossing point',
        composition:
          'Foreground: a stray line stopping a seed-width short of the crossing point; midground: Euclid pointing gently at the gap while the child leans close; background: a gloaming hall and a calm harbor beyond the window',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under gloaming light',
      },
      alt: 'A stray line stops just short of a crossing point as a teacher gently points at the small gap.',
    },
    {
      text: 'Euclid smoothed the stray line away with the flat end of the stylus. He set the straightedge true and drew once more. "One careful line, then another." This time the end met the crossing exactly. The child learned that a small mistake is easy to fix when you check each step. Nothing was spoiled, and no one felt cross. Slow and careful still won the day.',
      cue: 'Where would you look first to check whether a new line reaches the right spot?',
      scene: {
        id: 'points-lines-and-bedtime-p8',
        focus: 'Euclid redrawing the line so it meets the crossing point exactly',
        composition:
          'Foreground: a smoothed wax patch and a corrected line touching the crossing; midground: Euclid aligning the straightedge while the child smiles; background: steady lamplight and an orderly tablet shelf',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under lamplight',
      },
      alt: 'A teacher redraws a line so it meets a crossing point exactly, and a child smiles by lamplight.',
    },
    {
      text: 'Euclid tapped the finished triangle and grinned. "Watch what this small shape can do next," he said. On the triangle he built another line, then a square, then a six-pointed star. Each new figure followed from the last by the same tidy rules. A pattern was forming, step growing out of step. "This is how a whole book of shapes can grow," he said, "each one earned, each one sure."',
      scene: {
        id: 'points-lines-and-bedtime-p9',
        focus: 'The first triangle branching into a square and a star built by the same rules',
        composition:
          'Foreground: the original triangle joined by a faint square and a six-pointed star; midground: Euclid tracing the order of construction as the child follows; background: a moonrise beginning over the harbor and a dim colonnade',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under early moonrise',
      },
      alt: 'A triangle branches into a square and a six-pointed star, all built by the same rules under a rising moon.',
    },
    {
      text: 'Euclid told the child a wonderful thing about these rules. Long after tonight, he would gather them into a book called the Elements. It began with a few dots, lines, and circles, just like theirs. From those small starts, page after page of shapes were built. Children far in the future would learn from it too. The very same triangle they drew would be its very first proof.',
      scene: {
        id: 'points-lines-and-bedtime-p10',
        focus: 'Euclid gesturing toward a great stack of scrolls, the Elements taking shape',
        composition:
          'Foreground: the little triangle tablet beside a growing stack of neat scrolls; midground: Euclid gesturing toward the scrolls as the child imagines them; background: the vast Library of Alexandria in soft moonlit gold',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under moonlit gold',
      },
      alt: 'A teacher gestures toward a growing stack of scrolls beside a small triangle tablet inside a moonlit library.',
    },
    {
      text: 'Now it was the child’s turn to try. They set the compass point down and swung one careful circle. Then, from the other end, they swung a second circle just the same. The two arcs crossed, right where they should. "One careful line, then another," the child whispered, drawing the sides. A small, fair triangle appeared, all their own. Euclid nodded, proud of the steady, thoughtful hands.',
      cue: 'With a grown-up, draw two dots close together. Can you make a triangle stand between them?',
      scene: {
        id: 'points-lines-and-bedtime-p11',
        focus: 'The child drawing their own triangle with the compass and straightedge',
        composition:
          'Foreground: a small fresh triangle on a child’s wax scrap with two faint arcs; midground: the child working carefully while Euclid watches with pride; background: a quiet window full of moonlight and drowsy harbor lamps',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under deep moonlight',
      },
      alt: 'A child draws a small triangle with a compass and straightedge while a teacher watches proudly under moonlight.',
    },
    {
      text: 'Outside, the harbor lamps became quiet points of soft light. The straightedge lay flat, and the little compass rested closed. The child yawned and set their tablet down beside the couch. "Tomorrow," they whispered, "what shape shall we build next?" Euclid smiled and pulled the warm blanket snug. Somewhere in the world, thousands of years from now, someone would draw this same triangle. Goodnight, small builder of careful lines.',
      scene: {
        id: 'points-lines-and-bedtime-p12',
        focus: 'A finished little triangle beside a sleepy child as the compass rests closed',
        composition:
          'Foreground: a resting straightedge and closed compass beside a wax scrap holding a small triangle; midground: the child settling under a warm blanket on a low couch; background: harbor lamps like quiet points and a deep-night window with a round moon',
        palette: 'papyrus cream, harbor blue, sandstone, fig green and lamp amber under deep-night light',
      },
      alt: 'A small triangle on a wax scrap rests beside a sleepy child under a warm blanket, harbor lamps glowing in the night.',
    },
  ],
};
