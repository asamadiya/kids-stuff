import type { Book } from '../types';

/**
 * Aryabhata and the Powers of Ten — people shelf, no cast sheet.
 *
 * Arc (RULINGS-4-slate): Aryabhata explains number places in the Aryabhatiya,
 * but their increasing values are hard for young readers to picture, so
 * clearly labelled modern diagrams translate his documented tenfold rule into
 * visible bundles of ones, tens and hundreds.
 *
 * Narration keeps to what the Aryabhatiya states: Kusumapura (Ganitapada 1),
 * his age of twenty-three in 499 CE (Kalakriyapada 10), and the ten place
 * names with "each place is ten times the one before" (Ganitapada 2). No
 * words are put in his mouth; the refrain is the book's plain-words gloss, and
 * page 4 says so. Pages 5-11 are modern diagrams in a red border and the text
 * says they are modern and not his. The digits 234 are named as modern. Zero
 * is never credited to him (RULINGS-1); its placeholder role is left to the
 * grown-up note, in modern notation, with Brahmagupta's dated rules.
 */
export const book: Book = {
  slug: 'aryabhata-and-the-powers-of-ten',
  title: 'Aryabhata and the Powers of Ten',
  shelf: 'people',
  hook: 'Aryabhata’s tenfold rule, tied up in bundles of sticks.',
  setting:
    'Kusumapura (Pataliputra, now Patna) on the south bank of the wide brown Ganga, about 499 CE, late in the Gupta age: low brick houses with flat roofs and wooden balconies, shaded brick courtyards, palm and mango trees. Pages called a MODERN DIAGRAM ignore this setting: they are flat, clean modern diagrams on plain cream paper inside a thin dark-red border.',
  characterLine:
    'Aryabhata: a slim young Indian man of twenty-three with warm brown skin and a keen, calm face, clean-shaven, black hair tied in a knot at the back of his head, a white cotton dhoti and an undyed cream shawl over his left shoulder; his three students: teenage boys in plain white dhotis, hair tied back.',
  refrain: 'Ten of these make one of those.',
  readMinutes: 5,
  pages: [
    {
      text: 'About fifteen hundred years ago, Aryabhata wrote a book about numbers and the sky. He says it teaches the knowledge honoured in the city of Kusumapura. Kusumapura was most likely beside the Ganga, where Patna is today.',
      zone: 'top',
      art: 'Wide view at morning from out on the river: the broad brown Ganga fills the foreground; on the far bank stands Kusumapura, low brick houses with flat roofs and wooden balconies, brick steps going down to the water, palm and mango trees between them. On one flat rooftop near the river, small in the scene, Aryabhata sits cross-legged on a reed mat, writing with a reed pen on a long palm leaf held on his knee, a small clay inkpot beside him, too far away for any marks to show; a stack of palm leaves tied with cord lies beside him. A wooden boat with a square cloth sail drifts past. Every roof, tree and sail stays below the top third, which is open, pale morning sky with no birds.',
      alt: 'The old city of Kusumapura beside the Ganga, with a young Aryabhata writing on a palm leaf on a rooftop.',
    },
    {
      text: 'Aryabhata’s book is called the Aryabhatiya. He wrote it in short Sanskrit verses. In it he says he was twenty-three in the year we call 499.',
      zone: 'left',
      art: 'Medium view in a sunlit brick courtyard in the late afternoon: Aryabhata, plainly a young man, sits cross-legged on a reed mat in the right two-thirds of the picture, reciting aloud from a long palm-leaf manuscript held open in both hands, lips parted mid-verse, the leaves seen edge-on so no writing shows; his face is keen and calm. A stack of palm leaves tied with cord lies on the mat beside him. The left third is a plain, sunlit ochre plaster wall, empty.',
      alt: 'The young Aryabhata reads aloud from his palm-leaf book in a sunlit courtyard.',
    },
    {
      text: 'One verse names the number places in order. Eka is one, dasha ten, shata a hundred, sahasra a thousand. The list runs on to ten places.',
      zone: 'right',
      art: 'ACTION FIRST: Close view at chest height, Aryabhata in the left half of the picture, sitting cross-legged on a reed mat, reciting with lips parted and eyes focused. In front of him on the mat lies a straight row of ten small smooth river pebbles, evenly spaced; his right hand rests flat beside the fourth pebble, and the first four pebbles, the places he has already named, are pushed slightly forward out of the line. His left hand lies open on his knee. Behind him, a little out of focus, his three students lean in, each with his own row of ten pebbles, touching them one by one; they stay in the centre of the picture. The right third is a plain, shaded ochre wall, empty.',
      alt: 'Aryabhata names the number places along a row of ten pebbles, four already pushed forward, while his students touch their own rows.',
    },
    {
      text: 'Then the verse gives a rule: each place is ten times the place before it. In plain words, ten of these make one of those.',
      zone: 'top',
      art: 'Wide view of the brick courtyard in the afternoon: Aryabhata sits on the reed mat holding up both open hands, all ten fingers spread wide; facing him, one student sits with his eyes shut, reciting the verse back from memory, hands resting on his knees, while the other two students watch Aryabhata’s ten fingers closely. All four figures sit in the lower two-thirds of the picture. The top third is the plain upper courtyard wall and a strip of empty pale sky.',
      alt: 'Aryabhata holds up all ten fingers while one student recites the verse back with his eyes shut.',
    },
    {
      text: 'Ten times, then ten times again: the places grow fast. Big numbers are like this heap of sticks: hard to count at a glance. Pictures in a red frame are modern diagrams, made today, not by Aryabhata.',
      zone: 'top',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: a big untidy heap of exactly two hundred and thirty-four thin, straight, identical pale wooden sticks, crossing every which way so they cannot be counted, spills across the lower half of the sheet. Beside the heap lies a small neat coil of red thread, not yet used. No people. The top third is empty cream paper.',
      alt: 'A modern diagram: a big untidy heap of loose sticks, too many to count at a glance, with a coil of red thread beside it.',
    },
    {
      text: 'Start with loose sticks. Each loose stick is one: eka, the first place in Aryabhata’s list. Add them one at a time, up to nine. Nine loose sticks are still nine ones.',
      zone: 'bottom',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: exactly nine thin, straight, identical pale wooden sticks lie upright side by side in one neat row across the upper half of the sheet, evenly spaced with a small gap between each, none touching. Nothing is tied. No people. The bottom third is empty cream paper.',
      alt: 'A modern diagram: nine loose sticks in a neat row, each one standing for one.',
    },
    {
      text: 'Add one more stick, and there are ten. Tie the ten together with red thread. Now they are one bundle, one ten: dasha. Ten of these make one of those.',
      zone: 'top',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: everything sits in the lower two-thirds of the sheet. On the left, exactly ten thin, straight, identical pale wooden sticks lie upright side by side in a row, the tenth stick at the right end set a little apart from the other nine, just added; a plain dark arrow points right from them to one bundle of the same ten sticks, pressed into a tight round bundle about three sticks wide and tied round the middle with a bow of red thread; the bundle is exactly as long as one stick. No people. The top third is empty cream paper.',
      alt: 'A modern diagram: ten loose sticks, an arrow, and the same ten sticks tied into one bundle with red thread.',
    },
    {
      text: 'Make ten bundles of ten. Tie the ten bundles together with a thicker cord. That big bundle is one hundred: shata. Ten of these make one of those.',
      zone: 'bottom',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: across the top third, exactly ten small bundles of sticks lie side by side in a row, each tied round the middle with thin red thread; a plain dark arrow points down from the row to one big round bundle in the middle third made of those same ten small bundles, about three times as wide as one small bundle and exactly as long, bound round the middle with a thicker dark-red cord. No people. The bottom third is empty cream paper.',
      alt: 'A modern diagram: ten small bundles in a row, an arrow, and one big hundred-bundle tied with a thick cord.',
    },
    {
      text: 'Sort the big heap the same way. Every ten loose sticks become one bundle. Every ten bundles become one hundred. Four sticks are left over, too few to tie.',
      zone: 'top',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: the big heap from before is now sorted into three neat groups across the lower half of the sheet: on the left, exactly two big hundred-bundles, each bound with a thick dark-red cord; in the middle, exactly three small ten-bundles, each tied with thin red thread; on the right, exactly four loose sticks lying side by side. All sticks are the same length. No people. The top third is empty cream paper.',
      alt: 'A modern diagram: the heap sorted into two hundred-bundles, three ten-bundles and four loose sticks.',
    },
    {
      text: 'Now the heap is easy to count: two hundreds, three tens, four ones. Today we write that number as 234. Those number shapes came long after Aryabhata. In his verses he wrote big numbers as Sanskrit syllables.',
      zone: 'bottom',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: the upper two thirds of the sheet are divided by two thin straight dark lines into three equal side-by-side columns; the left column holds exactly two big hundred-bundles bound with thick dark-red cord, the middle column exactly three small ten-bundles tied with thin red thread, the right column exactly four loose sticks. No digits, letters or labels anywhere. No people. The bottom third is empty cream paper.',
      alt: 'A modern diagram: three columns holding two hundred-bundles, three ten-bundles and four loose sticks.',
    },
    {
      text: 'The rule does not stop at a hundred. Ten hundred-bundles make one thousand: sahasra, the fourth place. Each place after that is ten times bigger again.',
      zone: 'top',
      art: 'MODERN DIAGRAM, flat and clean, seen from straight above on plain cream paper inside a thin dark-red border: across the middle of the sheet, exactly ten big hundred-bundles lie side by side in a row, each bound with thick dark-red cord; a plain dark arrow points down from the row to one huge round bundle in the bottom third, made of those ten, about three times as wide as one hundred-bundle and exactly as long, bound round the middle with a heavy rope. No people. The top third is empty cream paper.',
      alt: 'A modern diagram: ten hundred-bundles in a row, an arrow, and one huge thousand-bundle tied with rope.',
    },
    {
      text: 'Aryabhata’s list ends at vrnda, the tenth place: a hundred crore. That is more than all the stars you can see. But place after place, the rule holds: ten of these make one of those.',
      zone: 'top',
      art: 'Back in Kusumapura at night, low camera on a flat brick rooftop: Aryabhata stands at the parapet with his palm-leaf book tied with cord under one arm, head tilted back, looking up at a clear sky full of stars; below him the dark Ganga reflects a few lamps from the houses on its bank. His face is calm and absorbed. Stars crowd the sky from the horizon up to the middle of the picture; the top third is smooth deep blue night sky with only a few tiny, faint stars, calm enough for words, and no moon.',
      alt: 'At night in Kusumapura, Aryabhata stands on a rooftop looking up at a sky full of stars.',
    },
  ],
  tryThis: {
    title: 'Bundle your own hundred',
    steps: [
      'Tip out a pile of craft sticks or straws, about a hundred and fifty, without counting them.',
      'He counts out ten loose sticks, checks with you, and ties them with a hair band: one ten.',
      'He keeps bundling until fewer than ten sticks are left, then ties ten tens into one hundred.',
      'Lay them out as hundreds, tens and ones, and say the number together.',
      'Undo one ten-bundle and ask whether there are still the same number of sticks.',
    ],
    safety:
      'Hair bands and small rubber bands are a choking hazard for his two-year-old sister: keep them in a closed tin and count them back in afterwards.',
  },
  note: {
    what:
      'A true book about Aryabhata, who in 499 CE wrote the Aryabhatiya at the age of twenty-three. One verse (Ganitapada 2) names ten number places, from eka (one) to vrnda (a hundred crore), and states that each place is ten times the one before. Pages 5 to 11 are modern stick-bundle diagrams in a red frame that make that rule visible; they are not his.',
    expect:
      'Most five-year-olds enjoy the heap turning into neat bundles and can say “two hundreds, three tens, four ones” with the picture in front of them. He will likely count every stick inside a bundle at first; that is normal. The jump from bundles to the written 234, and anything past a thousand, may not stick yet.',
    practising:
      'Decimal place value: ten units regrouped into one unit of the next place, and a written digit’s value set by its place. Also telling a historical source from a modern picture that explains it.',
    ask: 'On page 8, before you turn the page: “How many loose sticks are hiding inside this one big bundle?”',
    next:
      'Bundle craft sticks or straws this week with the activity below. Then open a book at a page between 100 and 150, build that page number in bundles, and ask which digit tells how many hundred-bundles.',
    easier:
      'Stop at tens. Bundle thirty-odd sticks and read only pages 6 and 7 together.',
    harder:
      'Show him 204 in modern digits: two hundred-bundles, no ten-bundles, four sticks. The 0 keeps the tens place open even when it is empty. Ask why 204 and 24 are different numbers. The eighth place on his list, koti, is where the Hindi word crore comes from.',
    honest:
      'Documented in his own verses: that the book teaches knowledge honoured at Kusumapura (usually identified with Pataliputra, now Patna), his age in 499 CE, the ten place names and the tenfold rule. The stick bundles, the digits 234 and the pictures of him and his city are modern, and no portrait of him survives; his own verses wrote big numbers as Sanskrit syllables, and his life outside the book is barely recorded. He did not invent zero, and no single person did; the earliest dated rules for calculating with zero are Brahmagupta’s, from 628 CE. Reading this once does not teach place value; bundling real objects, many times, does.',
  },
  sources: [
    'Aryabhatiya, Ganitapada 1 (knowledge honoured at Kusumapura) and Ganitapada 2 (the ten places, eka to vrnda; each place ten times the one before), 499 CE.',
    'Aryabhatiya, Kalakriyapada 10 (he was twenty-three when 3,600 years of the Kali age had passed, i.e. 499 CE).',
    'Aryabhatiya, Gitikapada 2 (his notation for numbers in Sanskrit syllables).',
    'Walter Eugene Clark, trans., The Aryabhatiya of Aryabhata (University of Chicago Press, 1930).',
    'K. S. Shukla and K. V. Sarma, eds. and trans., Aryabhatiya of Aryabhata (Indian National Science Academy, New Delhi, 1976).',
    'Kim Plofker, Mathematics in India (Princeton University Press, 2009).',
    'Brahmagupta, Brahmasphutasiddhanta, chapter 18 (rules for calculating with zero), 628 CE.',
  ],
};
