import type { Book } from '../types';

const SIZES =
  'Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.';

/**
 * Deepavali in the family's Bay Area backyard while Nanna's parents, Nanamma
 * and Tatayya, are visiting from Hyderabad. Arjun wants the lamps lit at once;
 * the patio has to be cleared and swept first (dry leaves catch fire), and he
 * learns the wet sweep from Nanamma. Tatayya alone handles oil, matches and
 * flame; Arjun keeps a real decision, the pattern of the twelve diyas.
 */
export const book: Book = {
  slug: 'first-the-dust-then-the-diyas',
  title: 'First the Dust, Then the Diyas',
  shelf: 'festivals',
  hook: 'Twelve new diyas, and a patio full of dust.',
  cast: 'telugu-grandparents',
  setting:
    'The family’s San Francisco Bay Area house on Deepavali in autumn, while Nanamma and Tatayya are visiting from Hyderabad: a back patio of big square grey paving stones beside the plain cream stucco back wall of the house, a glass kitchen door with one low step down to the patio, a long wooden bench against the house wall, a curry-leaf plant and a tulsi plant in pots by the door, a green lawn beyond with a raised vegetable bed and a lemon tree by the wooden fence, the low branches of the neighbour’s big sycamore tree hanging over the side fence and dropping dry brown leaves, and on the other side of the patio a tall cream stucco garden wall whose flat concrete top is at the height of Tatayya’s head, far above a child’s reach',
  refrain: 'First the dust, then the diyas.',
  readMinutes: 5,
  pages: [
    {
      text: 'It was Deepavali morning, and Nanamma and Tatayya were visiting from Hyderabad. Tatayya came back from the Indian store with a basket of new clay diyas. Mia peeped into the basket. “Tonight I want the whole backyard glowing,” said Arjun.',
      zone: 'top',
      art: `Wide shot at child height in the backyard, morning. Tatayya steps in through the wooden side gate in the fence holding a shallow cane basket of twelve small plain unlit terracotta diyas in both hands, bending to tilt it low. Mia stands on tiptoe beside him, peeping into the tilted basket. Arjun stands in the middle of the patio with both arms flung wide, grinning around at the whole dusty backyard. Dry brown sycamore leaves and grey dust lie across the grey paving stones; at the right edge a few low branches of the neighbour’s big sycamore reach over the fence, its crown out of frame. Beyond the patio are the green lawn, a raised vegetable bed and the lemon tree by the fence. The top third is plain pale morning sky above the fence, with no branches in it, kept clear for words. ${SIZES}`,
      characters: ['Tatayya', 'Mia', 'Arjun'],
      alt: 'Tatayya comes into the dusty backyard with a basket of new clay diyas while Mia peeps in and Arjun flings his arms wide.',
    },
    {
      text: 'Arjun ran to set down the first diya. But dry leaves and grey dust covered the patio. Tatayya’s empty plant pots, Arjun’s dinosaurs and Mia’s blocks lay everywhere. “First the dust, then the diyas,” said Nanamma.',
      zone: 'right',
      art: 'Low, close view on the patio, with Arjun and Nanamma in the left two-thirds of the picture. Arjun hurries forward with one small unlit clay diya cupped in both hands, bending to set it on the ground; Nanamma steps in front of him with one palm raised to say wait, her face firm but kind. Around their feet the grey paving stones are covered with dry brown leaves and grey dust, a toppled stack of small empty black plastic plant pots, three toy dinosaurs and scattered wooden toy blocks. The cane basket of diyas sits on the low kitchen step behind them. The right third is the plain cream stucco wall of the house over flat, dusty paving with nothing lying on it, kept clear for words.',
      characters: ['Arjun', 'Nanamma'],
      alt: 'Nanamma raises a hand to stop Arjun, who holds a diya over a patio of leaves, dust, plant pots, dinosaurs and blocks.',
    },
    {
      text: '“Why first the dust?” asked Arjun. Nanamma crumbled a dry leaf in her fingers. “Dry leaves catch fire,” she said. “And in our family, we clean the whole home to welcome Lakshmi Devi.”',
      zone: 'left',
      art: 'Medium close-up on the patio, with Nanamma and Arjun in the right two-thirds of the picture. Nanamma crumbles a dry brown sycamore leaf between her fingers, the brittle pieces falling toward the ground, while Arjun leans in close to watch, curious and serious. Behind them are the leafy, dusty patio and, beyond it, the green lawn and the wooden fence. The left third is the plain shaded cream stucco wall of the house, kept clear for words.',
      characters: ['Nanamma', 'Arjun'],
      alt: 'Nanamma crumbles a dry leaf in her fingers while Arjun leans in to watch.',
    },
    {
      text: 'Tatayya lowered the new diyas into a bucket of water. “New clay drinks oil,” said Tatayya. “Soaked diyas drink less, so the oil lasts longer.” Arjun counted all twelve going in.',
      zone: 'bottom',
      art: 'Close view from slightly above. Tatayya sits on the low kitchen step, lowering small terracotta diyas one at a time into a steel bucket of clear water: eleven diyas already rest under the water with tiny bubbles rising from the clay, and the twelfth is in Tatayya’s fingers. Arjun crouches at the edge of the bucket, lips moving as he counts, one finger pointing at the diyas. The empty cane basket sits beside the bucket. The bottom third is plain grey paving stones under a thin, even film of dust, with no leaves or objects on them, kept clear for words.',
      characters: ['Tatayya', 'Arjun'],
      alt: 'Tatayya lowers the last of twelve clay diyas into a bucket of water while Arjun counts them.',
    },
    {
      text: 'Arjun stacked Tatayya’s plant pots by the bench. He put his dinosaurs and Mia’s blocks into a basket. Mia took one block back out. So Tatayya gave Mia a cloth. “Help Arjun anna, Mia. You wipe the step.”',
      zone: 'left',
      art: `Medium shot at child height on the patio. In front, Mia squats by a round cane toy basket that holds three toy dinosaurs and a heap of wooden blocks; she grins and pulls one wooden block back out of it. Tatayya, seated on the low kitchen step, leans forward and holds a folded cotton cloth out to her, amused. Behind them Arjun sets a neat stack of small empty black plastic plant pots beside the long wooden bench. Leaves and dust still lie on the paving. All three are in the right two-thirds of the picture. The left third is the plain cream stucco wall of the house, kept clear for words. ${SIZES}`,
      characters: ['Mia', 'Tatayya', 'Arjun'],
      alt: 'Mia pulls a block back out of the toy basket while Tatayya offers her a cloth and Arjun stacks plant pots by the bench.',
    },
    {
      text: 'Nanamma gave Arjun a short broom of dry grass, a cheepuru. Arjun swept fast and hard. A grey cloud of dust rose up and drifted onto Tatayya. Tatayya sneezed into his moustache.',
      zone: 'top',
      art: 'Wide shot on the patio, a funny moment. Arjun sweeps wildly with a short broom of dry grass, both hands on it, leaves flying, and a big soft grey cloud of dust billows from his broom across to the long wooden bench against the house wall. Tatayya sits on the bench inside the dust cloud, eyes squeezed shut, mid-sneeze, one hand at his white moustache. Nanamma stands to one side holding her own grass broom, eyebrows raised, trying not to laugh. The dust cloud stays low, in the bottom half of the picture, and the sycamore is out of frame. The top third is the plain cream stucco wall of the house above the bench, with no window in it, kept clear for words.',
      characters: ['Arjun', 'Tatayya', 'Nanamma'],
      alt: 'Arjun sweeps so hard that a cloud of dust drifts over Tatayya, who sneezes on the bench while Nanamma raises her eyebrows.',
    },
    {
      text: 'Nanamma sprinkled water from a little brass chembu, and the dust lay still. “Now short strokes, into one pile,” said Nanamma. Arjun swept slowly. Swish, swish, and no dust flew.',
      zone: 'right',
      art: 'Low camera at ground level on the patio. Nanamma, bending, flicks water with her fingers from a small round brass water pot, and dark wet spots speckle the grey paving stones. Beside her Arjun sweeps carefully with short strokes of his short grass broom, pushing damp dust and leaves into one small pile; a flat metal dustpan lies beside the pile. No dust rises now; the air is clear. Both of them and the pile are in the left two-thirds of the picture. The right third is the plain cream stucco wall of the house over bare wet paving, kept clear for words.',
      characters: ['Nanamma', 'Arjun'],
      alt: 'Nanamma sprinkles water from a brass pot while Arjun sweeps damp dust into one pile with short, slow strokes.',
    },
    {
      text: 'Half the patio shone, and Arjun’s arms ached. He wanted to start on the diyas now. But dry leaves still lay heaped under the big tree by the fence. “First the dust, then the diyas,” said Arjun, and swept on.',
      zone: 'left',
      art: 'Wide shot from a raised corner of the patio. The near half of the patio is swept clean, damp and gleaming; the far half, by the wooden side fence where the neighbour’s big sycamore leans over, still has a heap of dry brown leaves. Arjun stands at the edge of the leaf heap, rubbing one aching arm, his short grass broom in his other hand, jaw set and determined, about to sweep the leaves away from the fence. On the paving near him stands the steel bucket with the diyas soaking in it. Arjun, the bucket, the fence and the leaves are all in the right two-thirds of the picture. The left third is the plain sunlit cream stucco wall of the house rising from clean wet paving, kept clear for words.',
      characters: ['Arjun'],
      alt: 'Arjun, tired but determined, starts sweeping the last heap of dry leaves away from the fence under the big tree.',
    },
    {
      text: 'First the dust, then the diyas. The dust was done. After a lunch of pulihora, Nanamma showed Arjun how to roll cotton wicks between his palms. Arjun rolled twelve, one for every diya.',
      zone: 'top',
      art: 'Close view, afternoon light. Nanamma and Arjun sit side by side on the long wooden bench against the house wall; each rubs a tuft of white cotton wool between flat palms to roll a thin wick, and Arjun watches Nanamma’s hands to copy her. On a small steel plate between them lie eleven finished white cotton wicks in a row; Arjun is rolling the twelfth. In the foreground the whole patio is swept clean and bare, with not one leaf, and twelve soaked terracotta diyas lie upside down on a cloth in the sun to dry. The top third is the plain sunlit cream stucco wall of the house, kept clear for words.',
      characters: ['Nanamma', 'Arjun'],
      alt: 'With the patio swept clean in front of them, Arjun and Nanamma roll cotton wicks on the bench.',
    },
    {
      text: 'At dusk, Tatayya poured sesame oil into every diya. Arjun reached for the matchbox, but Tatayya’s hand closed over it first. “Flames are my job,” said Tatayya. “You choose the pattern on the high wall.”',
      zone: 'bottom',
      art: 'Close view at dusk, warm last light. Tatayya, seated on the low kitchen step, holds a small plain matchbox, with no printing, closed inside his hand and keeps it near his chest; he looks at Arjun steadily and kindly and tips his head towards the tall garden wall. Arjun stands with one hand still half-raised towards the matchbox, his face disappointed but listening. On the step beside Tatayya sits a brass plate of twelve unlit terracotta diyas, each filled with golden sesame oil, a white cotton wick in each, and beside the plate a small steel oil pot. In the background, across the patio, the empty flat concrete top of the tall cream stucco garden wall runs at the height of Tatayya’s head when he stands. Everything is in the top two-thirds of the picture. The bottom third is the plain swept grey paving, kept clear for words.',
      characters: ['Tatayya', 'Arjun'],
      alt: 'Tatayya keeps the matchbox in his hand while Arjun, disappointed, looks at twelve unlit oil diyas on a brass plate.',
    },
    {
      text: 'Arjun chose the pattern: four, a gap, four, a gap, four. Tatayya set the diyas along the high wall, just as Arjun said. Arjun sat beside Nanamma and Mia on the bench. Then Tatayya struck a match.',
      zone: 'top',
      art: `Wide side view across the patio at dusk. On the left, Tatayya stands at the tall cream stucco garden wall and holds a freshly struck match to the wick of the first diya on its flat concrete top, at his head height. Twelve unlit terracotta diyas sit along the top of the wall in three groups of four with a clear gap between each group. On the right, well away from the wall across the clean swept paving, Nanamma sits on the long wooden bench with Mia on her lap, and Arjun sits right beside them, hands on his knees, all three turned towards the wall, watching the match. The top third is the deep blue evening sky above the wall and the fence, with no branches in it, kept clear for words. ${SIZES}`,
      characters: ['Tatayya', 'Nanamma', 'Mia', 'Arjun'],
      alt: 'Tatayya strikes a match at twelve diyas set in three groups of four on a high wall while Arjun, Nanamma and Mia watch from the bench.',
    },
    {
      text: 'Twelve small flames shone along the high wall. Gold light lay across the clean patio, and not one dry leaf was left. “Anna, look!” laughed Mia, pointing up. “The whole backyard is glowing,” said Arjun.',
      zone: 'bottom',
      art: `Low wide view across the patio after dark. Twelve small steady flames burn in terracotta diyas in three groups of four, with a gap between each group, along the flat top of the tall cream stucco garden wall, and their warm gold light reflects on the clean, bare, swept grey paving; there are no leaves anywhere, and the sycamore over the fence stands dark against the night sky. Nanamma sits on the long wooden bench with Mia on her lap; Mia points up at the flames, laughing, turned to call to Arjun. Arjun leans against Nanamma’s side, looking up at the lamps, proud and tired, speaking. Tatayya stands back from the wall, watching the lamps. The bottom third is the empty, gleaming swept paving, kept clear for words. ${SIZES}`,
      characters: ['Nanamma', 'Mia', 'Arjun', 'Tatayya'],
      alt: 'Twelve diyas glow on the high garden wall over the clean patio while Mia points up from Nanamma’s lap and Arjun leans beside them.',
    },
  ],
  tryThis: {
    title: 'Get one space ready, then the lamps',
    steps: [
      'Pick one small space, like a doorstep or a patio. Clear it together first: things back in their places.',
      'Sprinkle a few drops of water. Your child sweeps with short strokes into a dustpan.',
      'Your child chooses a pattern for the unlit diyas. You set them somewhere high.',
      'Your child sits in an agreed spot. You say Tatayya’s line, “Flames are my job,” and light them.',
    ],
    safety:
      'Only a grown-up handles matches, lighters and lit diyas. Put lit diyas on a high, stable, non-flammable surface, away from curtains, clothes and dry leaves, and well out of the two-year-old’s reach. Never leave them burning unattended.',
  },
  note: {
    what: 'Arjun wants the backyard glowing for Deepavali while Nanamma and Tatayya are visiting, so first he helps Nanamma clear and sweep the patio and roll wicks. Tatayya soaks, fills, places and lights all twelve diyas himself, while the children watch from the bench.',
    expect: 'The sneeze on page 6 usually gets the laugh, and the matchbox on page 10 usually gets the protest: he may side with Arjun. He may not know why new clay diyas are soaked; unglazed clay soaks up oil, so a soaked lamp wastes less of it.',
    practising: 'Doing jobs in order (clearing, then sweeping, then lamps), shared housework alongside grandparents, and a firm line that adults alone handle fire, while the child keeps a real decision: the pattern the diyas make.',
    ask: 'On a re-read, at page 7: “Why did the dust stop flying once Nanamma sprinkled water?”',
    next: 'This week, give him one real cleaning job with a broom and dustpan, sprinkling water first, and let him finish it himself. As they work, Nanna can say the refrain in Telugu: “Mundu dummu, tarvaata deepaalu” (first the dust, then the lamps). If you light diyas, let him choose the pattern for the unlit ones.',
    honest: 'Hearing Tatayya say “Flames are my job” does not make a five-year-old safe near fire; matches and lamps still need adult control every time. This is one family’s Deepavali (Diwali), kept the way Nanna’s Telugu parents keep it, in a Bay Area backyard; cleaning, lamps and Lakshmi puja are widespread, but customs differ by region and family.',
    safety: 'Keep matches and lighters out of reach. Lit diyas go high and away from anything that can catch, never near a toddler, and are never left burning unattended.',
  },
};
