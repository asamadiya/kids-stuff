import type { Story } from '../types';

export const theCountOfTwenties: Story = {
  slug: 'the-count-of-twenties',
  title: 'The Count of Twenties',
  subtitle: 'How the Classic Maya of the lowlands wrote numbers with dots and bars.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Dot by dot, bar by bar',
  readAloudMinutes: 5,
  learningTakeaway:
    'Long ago the Maya wrote numbers you could see: a small dot stood for one, and a straight bar stood for five. By stacking dots and bars, they could build any count and check it with their eyes.',
  heartTakeaway:
    'When you arrange small pieces neatly, a shared job becomes easier for everyone to follow and check.',
  grownUpFact:
    'The Maya of the Classic period (about AD 250 to 900) lived in the tropical lowlands of the Yucatan Peninsula, northern Guatemala, and Belize. Their numbers were vigesimal, or base-20. A dot meant one and a bar meant five, so six was one bar and one dot. They stacked these signs in vertical positions and even used a shell glyph for zero, making them among the earliest peoples to write a zero. This story does not name a single inventor, because Maya counting was a shared craft passed among many scribes and market keepers.',
  pages: [
    {
      text: 'Long ago, in the warm Maya lowlands, people counted with dots and bars. This is a gentle tale of that real craft. Before an evening market, a keeper laid out counting cards. Smooth beans stood for dots. Bundles of five thin sticks made bars. Everyone could see each number clearly. "Dot by dot, bar by bar," the keeper hummed.',
      cue: 'Look closely, like a Maya market helper. Can you spot a bean dot and a stick bar?',
      scene: {
        id: 'the-count-of-twenties-p1',
        focus: 'a Maya market keeper arranging bean dots and tied five-stick bars on a low table',
        composition:
          'Foreground: a bean-dot bowl and tied five-stick bundles; midground: a keeper arranging counting cards while a helper watches; background: a market shade frame and pale limestone steps',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under golden light',
      },
      alt: 'A Maya market keeper arranges bean dots and tied five-stick bars on a low table under golden light.',
    },
    {
      text: 'The Maya wrote numbers you could see. One small dot meant one. One straight bar meant five. For three baskets, the helper placed three beans. For five baskets, the helper laid one tied bar. She opened one hand and matched five fingers to the bar. The count was visible, with no long spoken guess.',
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
      text: 'Soon the card held one bar and two dots above it. That number was seven, plain to any eye. The keeper checked the pieces from left to right. "Dot by dot, bar by bar," the helper said. The card looked tidy, for the beans sat in an even row, and the stick bundle stayed straight beneath them.',
      scene: {
        id: 'the-count-of-twenties-p3',
        focus: 'a keeper and helper checking a card that shows one bar beneath two bean dots',
        composition:
          'Foreground: one bar and two bean dots stacked; midground: the keeper and helper checking the card together; background: stacked baskets against a warm wall',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under dusk light',
      },
      alt: 'A counting card shows two evenly spaced bean dots above one straight bar.',
    },
    {
      text: 'A customer arrived early, and the helper rushed. Two beans rolled tik-tik under a cloth. The new card no longer matched the basket row. Her face grew warm, but the keeper stayed calm and kind. He simply moved the baskets aside. He gave her quiet room to count the visible pieces once more.',
      scene: {
        id: 'the-count-of-twenties-p4',
        focus: 'a helper pausing while a keeper clears space near the baskets',
        composition:
          'Foreground: a rolled cloth edge with two displaced beans; midground: the helper pausing while the keeper clears space; background: a gloaming market with an early customer silhouette',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under gloaming light',
      },
      alt: 'Two beans roll beneath a cloth while a helper pauses beside the market baskets.',
    },
    {
      text: 'The helper found the beans and began again from the start. "Dot by dot, bar by bar." She grouped the sticks, lined up the beans, and left room around each sign. Then she invited the customer to point at the pieces with her. Both counts agreed. The little worry slipped quietly away.',
      cue: 'Which is easier to check: scattered pieces, or pieces lined up with space?',
      scene: {
        id: 'the-count-of-twenties-p5',
        focus: 'a helper and customer pointing together at an orderly bar-and-dot card',
        composition:
          'Foreground: an ordered card matched to a basket row; midground: the helper and customer pointing together; background: quiet stalls under the first evening stars',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under gloaming light',
      },
      alt: 'A helper and a customer point together at an orderly card of bars and dots.',
    },
    {
      text: 'As the sky darkened, the helper stacked the finished cards in order. Long ago, whole cities of Maya scribes counted this careful way. Neat rows did not make the market grander. They made the work easier to share and to check. She felt proud of every straight bar and patient dot. Tomorrow another helper could follow the same clear pattern.',
      scene: {
        id: 'the-count-of-twenties-p6',
        focus: 'a helper tying an ordered stack of cards as the keeper closes the baskets',
        composition:
          'Foreground: a stack of cards and a soft binding cord; midground: the helper tying the bundle while the keeper closes baskets; background: a violet market lane with a low pyramid silhouette',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under moonrise light',
      },
      alt: 'A helper ties a neat stack of finished counting cards as the market gently closes.',
    },
    {
      text: 'At bedtime, the helper set five smooth beans in a little bowl. She covered them softly with a folded cloth. "Dot by dot, bar by bar," she murmured, sleepy now. The market was quiet, the baskets were counted, and the moon rose low. Her open hands rested warm beside her. Goodnight.',
      scene: {
        id: 'the-count-of-twenties-p7',
        focus: 'a helper asleep with open hands beside a covered bowl of beans',
        composition:
          'Foreground: a covered bean bowl and a crescent blanket edge; midground: the helper asleep with open hands; background: a moonlit shelf and dark market roofs',
        palette: 'maize gold, limestone cream, lake green, cochineal red, and night blue under deep-night light',
      },
      alt: 'A helper sleeps with open hands beside a covered bowl holding five smooth beans.',
    },
  ],
};
