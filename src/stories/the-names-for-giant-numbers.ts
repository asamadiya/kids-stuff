import type { Story } from '../types';

export const theNamesForGiantNumbers: Story = {
  slug: 'the-names-for-giant-numbers',
  title: 'The Names for Giant Numbers',
  subtitle:
    'Long ago in ancient India, Sanskrit teachers and children named huge numbers by grouping tens.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Ten small groups make one bigger group',
  readAloudMinutes: 5,
  learningTakeaway:
    'Making groups of ten lets many small things become one larger group with its own name. Ten ones make a ten, ten tens make a hundred, and the counting keeps climbing.',
  heartTakeaway:
    'Big ideas grow calmest one careful step at a time. Patience keeps each next group honest, and it is fine to stop when your hands and eyes have had enough.',
  grownUpFact:
    'This is a real cultural practice, not one invented person. Ancient India used Sanskrit names for powers of ten: eka (1), dasha (10), shata (100), sahasra (1,000). Old texts like the Valmiki Ramayana list single names for numbers up to 10^62. The whole idea rests on grouping by ten: ten of one named amount makes the next.',
  pages: [
    {
      text: 'Long ago, in a courtyard in ancient India, children learned to count with their teachers. They said the words softly together. Eka meant one. Dasha meant ten. A grandmother set down cups and a basket of tiny red seeds. "Ten small groups make one bigger group," she said. The children leaned in to look.',
      cue: 'Say it slowly with them. Can you whisper "one" and then "ten"?',
      scene: {
        id: 'the-names-for-giant-numbers-p1-courtyard',
        focus: 'children in ancient India learning number names beside a basket of seeds',
        composition:
          'Foreground: loose red seeds and ten small clay cups on a woven mat; midground: a grandmother teacher and two children counting; background: an ancient Indian courtyard in warm golden evening light',
        palette: 'madder red, mango gold, and deep indigo',
      },
      alt: 'Children and a grandmother teacher count red seeds into small clay cups on a mat in a golden ancient Indian courtyard.',
    },
    {
      text: 'A boy counted ten seeds into the first cup, then ten into the next. Rustle, tap. He stopped after each cup to check the number. Soon ten small cups stood in a row. The work felt lighter, because his eyes could see the little piles instead of chasing every rolling seed.',
      cue: 'Tap your fingers slowly from one to ten. Can you stop and rest at ten?',
      scene: {
        id: 'the-names-for-giant-numbers-p2-ten-cups',
        focus: 'a boy filling ten cups with equal small groups of seeds',
        composition:
          'Foreground: ten filled cups in a straight row; midground: the boy counting while the grandmother nods; background: a mud-brick courtyard wall and the fading sun',
        palette: 'seed red, clay tan, and leaf green',
      },
      alt: 'A boy fills ten small cups with equal groups of seeds in a straight row as a teacher nods nearby.',
    },
    {
      text: 'The grandmother poured all ten cups into one cloth pouch. "Ten small groups make one bigger group," she said. "Ten ones make dasha. Ten tens make shata, a hundred." The boy held the full pouch. It had its own big name now. He imagined more pouches, yet he kept only the piles he could truly see.',
      scene: {
        id: 'the-names-for-giant-numbers-p3-one-pouch',
        focus: 'ten cupfuls of seeds gathered into one cloth pouch',
        composition:
          'Foreground: ten empty cups and one full cloth pouch; midground: the boy holding the pouch as the grandmother names it; background: dusk deepening around the quiet courtyard',
        palette: 'plum, clay orange, and muted turquoise',
      },
      alt: 'A grandmother pours ten cups of seeds into one cloth pouch while a boy holds it in the deepening dusk.',
    },
    {
      text: 'A soft breeze lifted one corner of the cloth. Three cups tipped, and seeds skittered across the mat. The boy sighed. The huge count in his mind felt lost. The grandmother did not count for him. Together they rolled a low cloth rim, so the loose seeds would stay gently nearby.',
      cue: 'Cup your hand like a little bowl. How would you keep tiny seeds from rolling away?',
      scene: {
        id: 'the-names-for-giant-numbers-p4-spill',
        focus: 'seeds scattering as one corner of the mat lifts in the breeze',
        composition:
          'Foreground: three tipped cups and a rolled cloth rim; midground: the boy reaching gently while the grandmother steadies the mat; background: courtyard trees in the soft gloaming',
        palette: 'violet dusk, red seeds, and cream cloth',
      },
      alt: 'Seeds scatter from three tipped cups as a breeze lifts the mat, while a boy and grandmother gently steady the cloth.',
    },
    {
      text: 'The boy gathered the scattered seeds one by one. He refilled each cup, checked the row, and made the pouch again. This time the cloth stayed flat and calm. "Ten small groups make one bigger group." He did not rush toward an invisible giant number. He built only the next clear group.',
      scene: {
        id: 'the-names-for-giant-numbers-p5-rebuild',
        focus: 'the boy rebuilding the ten cups inside a soft fabric rim',
        composition:
          'Foreground: upright cups inside a rolled cloth border; midground: the boy refilling while the grandmother watches kindly; background: the first stars over the courtyard',
        palette: 'deep berry, starlight cream, and earthen brown',
      },
      alt: 'A boy carefully refills ten upright cups inside a rolled cloth border as the first stars appear.',
    },
    {
      text: 'Before supper, three full pouches rested on the mat. The grandmother told a gentle tale of old teachers who had names for numbers far beyond the courtyard. Some names climbed higher than the stars could hold. For tonight, the boy’s three visible pouches were enough. His count was small, careful, and true.',
      scene: {
        id: 'the-names-for-giant-numbers-p6-three-pouches',
        focus: 'three full seed pouches resting together on the counting mat',
        composition:
          'Foreground: three tied pouches on the woven mat; midground: the grandmother telling a soft tale to the boy; background: moonrise above the courtyard rooftops',
        palette: 'moon blue, seed red, and warm ochre',
      },
      alt: 'Three full seed pouches rest on a mat as a grandmother tells a quiet tale to a boy under a rising moon.',
    },
    {
      text: 'The grandmother tied the pouches closed. The boy tucked one tiny seed into a keepsake cup, not for counting, only for remembering. The soft cloth folded into a little pillow beside him. Giant numbers could wait beyond the stars. His hands were still, his thoughts were quiet, and the night was warm. Goodnight.',
      scene: {
        id: 'the-names-for-giant-numbers-p7-sleep',
        focus: 'the boy resting beside tied seed pouches and a folded cloth',
        composition:
          'Foreground: one keepsake cup and closed pouches; midground: the boy nestled on the folded counting cloth; background: a deep, calm night sky filled with small stars',
        palette: 'navy, rust red, and pillow-soft gold',
      },
      alt: 'A boy rests beside tied seed pouches and a folded cloth under a calm night sky full of small stars.',
    },
  ],
};
