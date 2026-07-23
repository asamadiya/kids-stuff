import type { Story } from '../types';

export const theCountOfTwenties: Story = {
  slug: 'the-count-of-twenties',
  title: 'The Count of Twenties',
  subtitle: 'How the Classic Maya of the lowlands wrote numbers with dots, bars, and a shell for zero.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Dot by dot, bar by bar',
  readAloudMinutes: 9,
  learningTakeaway:
    'The Maya wrote numbers you could see: a dot meant one, a bar meant five, and a shell meant zero. By stacking these signs in levels, they counted by ones, then twenties, then four-hundreds, building any number and checking it with their eyes.',
  heartTakeaway:
    'When you arrange small pieces neatly and count them step by step, a shared job becomes easier for everyone to follow and trust.',
  grownUpFact:
    'The Classic Maya (about AD 250 to 900) lived in the tropical lowlands of the Yucatan Peninsula, northern Guatemala, and Belize. Their number system was vigesimal, or base-20. A dot meant one and a bar meant five, so six was one bar with one dot above it, and nineteen was three bars with four dots. Numbers were stacked in vertical levels: the lowest level counted ones, the next counted twenties, the next counted four-hundreds, and so on. A shell-shaped glyph stood for zero, making the Maya among the earliest peoples in the world to write a symbol for zero and use it to hold an empty place. Scribes used these numbers in the Long Count calendar to record dates across thousands of years. This story names no single inventor, because Maya counting was a shared craft carried by many scribes, merchants, and market keepers.',
  pages: [
    {
      text: 'Long ago, in the warm Maya lowlands, people counted with dots and bars. This is a gentle tale of that real craft. Before an evening market opened, a keeper laid out counting cards on a low table. Smooth beans stood in for dots. Bundles of five thin sticks made bars. Every price and pile could be shown so anyone could see it. "Dot by dot, bar by bar," the keeper hummed, waking the table for the day.',
      cue: 'Look closely, like a Maya market helper. Can you spot one bean dot and one stick bar?',
      scene: {
        id: 'the-count-of-twenties-p1',
        focus: 'a Maya market keeper arranging bean dots and tied five-stick bars on a low table',
        composition:
          'Foreground: a bean-dot bowl and tied five-stick bundles; midground: a keeper arranging counting cards while a young helper watches; background: a market shade frame and pale limestone steps',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under golden light',
      },
      alt: 'A Maya market keeper arranges bean dots and tied five-stick bars on a low table under golden light.',
    },
    {
      text: 'The keeper began the helper’s lesson with the smallest sign of all. "One small dot means one," he said, setting a single bean down. "One straight bar means five." He laid a tied bundle flat beneath the dot. For three baskets, the helper placed three beans in a row. For five baskets, she laid one bar instead. She opened one hand and matched five fingers to that single bar. The count sat there in the open, plain to any eye.',
      cue: 'Open one hand. How many fingers could a single bar stand for?',
      scene: {
        id: 'the-count-of-twenties-p2',
        focus: 'a young helper comparing five fingers to one stick bar beside the counting cards',
        composition:
          'Foreground: an open five-finger hand and a single stick bar; midground: the helper comparing them while the keeper holds a blank card; background: dusk market baskets under a low awning',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under dusk light',
      },
      alt: 'A young helper matches an open five-finger hand to a horizontal bundle of five sticks.',
    },
    {
      text: 'Now the keeper showed how to build bigger numbers by stacking. He placed one bar, then rested two beans neatly above it. "That is five and two more," he said. "That makes seven." The helper checked the pieces from left to right and nodded. "Dot by dot, bar by bar," she said, pleased. Then he built nineteen the same careful way. Three bars stood in a stack, with four dots resting on the very top.',
      scene: {
        id: 'the-count-of-twenties-p3',
        focus: 'a keeper and helper reading a card that shows three stacked bars topped by four bean dots',
        composition:
          'Foreground: three stacked bars with four bean dots on top; midground: the keeper and helper counting the card together; background: stacked baskets against a warm limestone wall',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under dusk light',
      },
      alt: 'A counting card shows four bean dots resting above three straight stacked bars.',
    },
    {
      text: 'The helper wondered aloud. "What if we need more than nineteen?" The keeper smiled and drew a fresh card with two open levels. "The Maya count in twenties," he explained gently. "The bottom level counts ones. The level above it counts whole twenties." He set one dot in the upper level and none below. "That is one twenty," he said. "Twenty itself, written with places, like beads on two shelves." The helper stared at the two neat rows, delighted.',
      cue: 'Wonder together: if the top shelf counts twenties, what would two dots up there mean?',
      scene: {
        id: 'the-count-of-twenties-p4',
        focus: 'a keeper showing a two-level card with one dot on the upper twenties level',
        composition:
          'Foreground: a card split into two stacked levels, one dot on the top level; midground: the keeper pointing up while the helper leans in; background: warm market stalls under a deepening sky',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under dusk light',
      },
      alt: 'A two-level counting card shows a single bean dot on the upper level and an empty lower level.',
    },
    {
      text: 'But an empty level looked strange and a little worrying. "How do we show that the bottom shelf holds nothing?" she asked. The keeper reached into a small pouch and drew out a smooth shell. "This shell means zero," he said. "It marks a level that holds nothing at all." He placed the shell on the empty lower row. Now the card read clearly: one twenty, and zero ones. Long ago, the Maya were among the first people ever to write a zero.',
      scene: {
        id: 'the-count-of-twenties-p5',
        focus: 'a keeper placing a smooth shell for zero on the empty lower level of the card',
        composition:
          'Foreground: a shell resting on the empty lower level, one dot above it; midground: the keeper and helper studying the tidy card; background: quiet stalls under the first faint evening stars',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under gloaming light',
      },
      alt: 'A shell for zero sits on the empty lower level of a card while one dot marks the twenties level above.',
    },
    {
      text: 'A customer arrived early, and the helper rushed to keep up. Two beans rolled tik-tik under a cloth and vanished. The new card no longer matched the row of baskets. Her face grew warm, but the keeper stayed calm and kind. He simply slid the baskets aside to make room. "Take your time," he said softly. "The pieces will not lie to us." He gave her quiet space to count the visible signs once more.',
      scene: {
        id: 'the-count-of-twenties-p6',
        focus: 'a helper pausing while a keeper clears space near the baskets',
        composition:
          'Foreground: a rolled cloth edge with two displaced beans; midground: the helper pausing while the keeper clears space; background: a gloaming market with an early customer silhouette',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under gloaming light',
      },
      alt: 'Two beans roll beneath a cloth while a helper pauses beside the market baskets.',
    },
    {
      text: 'The helper found the beans and began again from the very start. "Dot by dot, bar by bar," she breathed. She grouped the sticks into bars and lined the beans in even rows. She left a little room around each sign, so none could hide. Then she invited the customer to point at the pieces with her. They read the levels together, twenties first, then ones. Both counts agreed, and the little worry slipped quietly away.',
      cue: 'Which is easier to check: scattered pieces, or pieces lined up with space around them?',
      scene: {
        id: 'the-count-of-twenties-p7',
        focus: 'a helper and customer pointing together at an orderly two-level card',
        composition:
          'Foreground: an ordered two-level card matched to a basket row; midground: the helper and customer pointing together; background: quiet stalls under the first evening stars',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under gloaming light',
      },
      alt: 'A helper and a customer point together at an orderly two-level card of bars, dots, and a shell.',
    },
    {
      text: 'The customer had one more question before she paid. "How high can these shelves go?" she asked kindly. "Higher than the market roof," the keeper laughed. "Above the twenties sits a level for four-hundreds. Above that, a level for eight-thousands." He tapped each imagined shelf climbing into the air. With only dots, bars, and a shell for zero, the Maya could write any number they wished. A whole city of counts could rest on a few small cards.',
      cue: 'Wonder together: with just dots, bars, and a shell, how big a number do you think you could write?',
      scene: {
        id: 'the-count-of-twenties-p8',
        focus: 'a keeper tapping upward through imagined higher counting levels for the customer',
        composition:
          'Foreground: a tall card with several stacked levels drawn in; midground: the keeper tapping upward while the customer follows his hand; background: a violet market lane with a low pyramid silhouette',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under moonrise light',
      },
      alt: 'A keeper points up a tall card of stacked counting levels while a customer watches with wonder.',
    },
    {
      text: 'The keeper shared why this careful counting truly mattered. Far away, Maya scribes wrote numbers just like these into stone. They carved them onto tall standing slabs to mark real dates. Using their count of twenties, they tracked the days across thousands of years. A shell for zero let them hold every empty place exactly right. So the same signs that priced baskets also kept whole calendars. Neat rows, the keeper said, could carry a city’s memory forward.',
      scene: {
        id: 'the-count-of-twenties-p9',
        focus: 'a keeper describing carved number-glyphs on a tall standing stone slab',
        composition:
          'Foreground: a counting card echoing carved dots, bars, and a shell; midground: the keeper gesturing toward a distant carved slab; background: a moonlit plaza with a stepped pyramid and standing stones',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under moonrise light',
      },
      alt: 'A keeper points from a counting card toward carved number-glyphs on a tall standing stone in a moonlit plaza.',
    },
    {
      text: 'As the sky darkened, the helper stacked the finished cards in order. Neat rows did not make the market grander or richer. They made the work easy to share, and easy to check. She felt proud of every straight bar and every patient dot. She was proud, too, of the little shell that held each zero. "Dot by dot, bar by bar," she whispered to the sleeping table. Tomorrow another helper could follow the same clear pattern.',
      scene: {
        id: 'the-count-of-twenties-p10',
        focus: 'a helper tying an ordered stack of cards as the keeper closes the baskets',
        composition:
          'Foreground: a stack of cards and a soft binding cord; midground: the helper tying the bundle while the keeper closes baskets; background: a violet market lane with a low pyramid silhouette',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under moonrise light',
      },
      alt: 'A helper ties a neat stack of finished counting cards as the market gently closes.',
    },
    {
      text: 'That night, the helper set five smooth beans and one small shell beside her mat. She covered them softly with a folded cloth. "Dot by dot, bar by bar," she murmured, sleepy and glad. Somewhere out in the dark, carved numbers still counted the years. Maybe tomorrow you can build a number too. Set out little stones for dots and sticks for bars. Leave a smooth shell for every zero, and count your own quiet twenties.',
      cue: 'Try it tomorrow: use pebbles for dots and a shell or button for zero, and count a small pile the Maya way.',
      scene: {
        id: 'the-count-of-twenties-p11',
        focus: 'a helper asleep beside a covered bowl of beans and one small shell',
        composition:
          'Foreground: a covered bowl of beans with a shell beside it and a crescent blanket edge; midground: the helper asleep with open, restful hands; background: a moonlit shelf and dark market roofs',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under deep-night light',
      },
      alt: 'A helper sleeps beside a covered bowl of beans and a small shell for zero under a low moon.',
    },
  ],
};
