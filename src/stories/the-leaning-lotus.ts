import type { Story } from '../types';

export const theLeaningLotus: Story = {
  slug: 'the-leaning-lotus',
  title: 'The Leaning Lotus',
  subtitle: 'The scholar Bhaskara and his daughter Lilavati measure a pond with a marked pole.',
  domain: 'measurement',
  collection: 'historical',
  repeatedPhrase: 'Down to the bottom, up to the mark',
  readAloudMinutes: 5,
  learningTakeaway:
    'A marked pole that touches the pond bottom shows the water depth at the wet mark. You do not have to guess how deep the water is. You can measure it, count the bands, and read exactly where wet meets dry.',
  heartTakeaway:
    'Quiet observation means keeping your body safe, your tool steady, and your patient eyes on what is truly there.',
  grownUpFact:
    'Long ago in India lived a real scholar named Bhaskara, sometimes called Bhaskaracharya. He was born in 1114 CE and led the famous astronomy observatory at Ujjain. Around 1150 CE he wrote a math book called the Lilavati, full of gentle verse puzzles, including one about a leaning lotus and the depth of a pond. A fond old legend says he named the book for his daughter, Lilavati, though we cannot prove she truly existed. This calm bedtime story keeps the marked-pole idea of measuring depth and sets aside the book’s original right-triangle calculation.',
  pages: [
    {
      text: 'Long ago in India, near the city of Ujjain, lived a real scholar named Bhaskara. He watched the stars and loved gentle number puzzles. A fond old tale says he taught his daughter, Lilavati, beside a quiet lotus pond. One flower leaned toward the water. “How deep is it there?” asked Lilavati. Bhaskara smiled and lifted a smooth pole painted with broad bands. “Down to the bottom, up to the mark,” he said.',
      cue: 'Look for the lotus leaning over the pond. Can you point to the marked pole in Bhaskara’s hand?',
      scene: {
        id: 'the-leaning-lotus-p1-invitation',
        focus: 'Bhaskara and Lilavati beside a leaning lotus with a marked measuring pole',
        composition:
          'Foreground: a smooth pole with broad painted bands held above a lotus pond; midground: the scholar Bhaskara kneeling beside young Lilavati at the pond edge; background: Ujjain rooftops in soft golden light',
        palette: 'lotus rose, pond green, robe cream, and deep evening blue',
      },
      alt: 'A scholar and his daughter kneel by a lotus pond holding a marked pole in warm golden light.',
    },
    {
      text: 'Lilavati stayed safely on the firm bank while Bhaskara held the pole with her. Together they lowered it into an open patch, away from roots and flowers. “Plip,” said the water. Lilavati moved one flat hand slowly downward, copying the pole’s careful path. “We do not guess,” said Bhaskara. “We measure.”',
      cue: 'Lower one flat hand slowly, pause at the pretend bottom, then lift it straight back up.',
      scene: {
        id: 'the-leaning-lotus-p2-try',
        focus: 'the marked pole lowering straight down through a clear patch of pond',
        composition:
          'Foreground: the tall marked pole descending vertically through calm water; midground: Bhaskara and Lilavati guiding it together from the safe bank; background: Ujjain at dusk, simplified and uncluttered',
        palette: 'lotus rose, pond green, robe cream, and deep evening blue',
      },
      alt: 'A marked pole lowers straight down through a clear patch of a calm lotus pond.',
    },
    {
      text: 'The pole touched the soft pond bottom and stopped. They lifted it straight up again. Water had darkened the lower bands, while the band above stayed dry. “Down to the bottom, up to the mark,” said Lilavati. She could count the wet bands and see how tall the water had climbed. The pole had measured the depth for them.',
      scene: {
        id: 'the-leaning-lotus-p3-observe',
        focus: 'an even wet edge across one broad band on the lifted pole',
        composition:
          'Foreground: the lifted pole showing dark wet bands below and a dry band above a level line; midground: Lilavati pointing while Bhaskara steadies the pole; background: dusk over Ujjain, calm and clear',
        palette: 'lotus rose, pond green, robe cream, and deep evening blue',
      },
      alt: 'A lifted pole shows dark wet bands below a level line and a dry band above it.',
    },
    {
      text: 'Lilavati tried once more, but the pole tilted and brushed a stone before reaching bottom. Its wet edge climbed too high on one slanted side. She did not read the crooked mark. Bhaskara wiped the pole and waited until the little ripples settled. “A good measure needs a steady tool,” he said softly.',
      scene: {
        id: 'the-leaning-lotus-p4-problem',
        focus: 'a tilted pole with an uneven, slanted wet edge near a stone',
        composition:
          'Foreground: the pole leaning at a slant with a crooked wet line and soft ripple rings; midground: Lilavati pausing while Bhaskara calmly wipes the pole; background: Ujjain in gloaming light, quiet and dim',
        palette: 'lotus rose, pond green, robe cream, and deep evening blue',
      },
      alt: 'A tilted pole shows a crooked slanted wet line beside a stone, with soft ripple rings around it.',
    },
    {
      text: 'This time they held the pole upright and lowered it into the same clear patch. “Down to the bottom, up to the mark.” The wet edge circled the pole evenly, all the way around. Lilavati pointed to the matching band and counted it aloud. An even mark was far easier to trust than the slanted one.',
      cue: 'Which mark looks easier to trust: the slanted wet edge or the even one all around?',
      scene: {
        id: 'the-leaning-lotus-p5-help',
        focus: 'the corrected upright pole showing one level wet band all around',
        composition:
          'Foreground: the pole standing perfectly upright with a single even wet ring; midground: Lilavati pointing to the matching band as Bhaskara nods; background: gloaming over Ujjain, still and soft',
        palette: 'lotus rose, pond green, robe cream, and deep evening blue',
      },
      alt: 'An upright pole shows one even wet ring all the way around a single band.',
    },
    {
      text: 'They laid the pole safely along the bank. Lilavati looked from the counted band to the water beside the leaning lotus. She had not solved a hidden puzzle in her head. She had touched the bottom with a marked tool, lifted it, and measured exactly where wet changed to dry. Bhaskara wrote her careful number down.',
      scene: {
        id: 'the-leaning-lotus-p6-understand',
        focus: 'the pole resting safely while Lilavati compares wet and dry bands',
        composition:
          'Foreground: the pole laid flat and secure with clear wet and dry bands; midground: Lilavati reading the mark as Bhaskara records the number on a leaf; background: moonrise over Ujjain, calm and glowing',
        palette: 'lotus rose, pond green, robe cream, and deep evening blue',
      },
      alt: 'A pole rests flat and secure while a girl reads its wet and dry bands and a scholar writes the number down.',
    },
    {
      text: 'Back home, the rinsed pole rested under the eaves. Lilavati’s blanket held a stitched lotus leaning over a blue pond. “Down to the bottom, up to the mark,” she whispered. The quiet pond, the real lotus, and every painted band were still beneath the moon. Bhaskara dimmed the lamp. Goodnight, little measurer. Sleep now, snug and warm.',
      scene: {
        id: 'the-leaning-lotus-p7-sleep',
        focus: 'sleeping Lilavati beneath a lotus blanket with the rinsed pole at rest',
        composition:
          'Foreground: the rinsed pole leaning quietly under the eaves; midground: Lilavati snuggled asleep under a stitched-lotus blanket; background: a still moonlit Ujjain courtyard under gentle deep-night stars',
        palette: 'cool moonlit blues and silver with a soft warm nightlight glow',
      },
      alt: 'A girl sleeps snug under a lotus blanket while the rinsed pole rests quietly under the eaves in gentle moonlight.',
    },
  ],
};
