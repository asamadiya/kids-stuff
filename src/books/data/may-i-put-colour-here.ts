import type { Book } from '../types';

/**
 * Slate entry (RULINGS-4), recast for the Bay Area Telugu–Tamil family
 * (.redesign/v3/HOUSEHOLD.md; advisor a8 C: Holi is the community Holi at a
 * Bay Area park). Arjun wants every face in the family coloured, but Mia
 * refuses colour on her skin, so he respects her answer and they draw a chalk
 * garden on the park path while Amma and Nanna play with colours on the lawn.
 *
 * The refrain is asked three times: Amma asks Arjun (yes), Arjun asks Mia
 * about her cheek (no), Arjun asks Mia about her chalk flower (yes). Adults
 * keep the powder away from the toddler; Arjun is not made to give up Holi.
 */

/** HOUSEHOLD.md, advisor F: every picture with both children carries this. */
const SIZES =
  'Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.';

export const book: Book = {
  slug: 'may-i-put-colour-here',
  title: 'May I Put Colour Here?',
  shelf: 'festivals',
  hook: 'Arjun wants every face coloured. Mia says no.',
  cast: 'family',
  setting:
    'A neighbourhood Holi in a San Francisco Bay Area park on a sunny March morning: a wide green lawn with a few other families small and far off across the grass, throwing soft clouds of coloured powder; one big spreading coast live oak at the near edge of the lawn, with a wide, nearly level low limb at a grown-up’s shoulder height; the family’s blue cotton picnic mat in the oak’s shade, with a round steel tiffin and a canvas picnic bag on it; a wide pale-grey concrete path, marked into big squares, running along the edge of the lawn; low green spring hills beyond under a pale blue sky.',
  refrain: 'May I put colour here?',
  readMinutes: 4,
  pages: [
    {
      text: 'It was Holi, the spring festival of colours, and the park was full of families. Nanna had packed pulihora, tangy tamarind rice, in a steel tiffin. Arjun had one plan. Every face in the family would be bright with colour, even Mia’s.',
      zone: 'top',
      art: `Wide shot at child height at the edge of the oak’s shade. Nanna kneels on the blue cotton picnic mat, lifting the lid off a round steel tiffin of golden-brown pulihora, tamarind rice speckled with curry leaves and peanuts. Mia sits on the mat beside him eating small pieces of banana from a little steel katori bowl, cheeks clean. Arjun stands at the sunny edge of the mat with one foot on the grass, looking back over his shoulder at Mia’s clean round cheeks, grinning wide. Far off across the lawn, small distant families toss clouds of pink and green powder. The oak’s trunk and leaves stay at the left edge; the top third is open pale-blue sky, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Nanna'],
      alt: 'In the park, Nanna opens a steel tiffin of pulihora, Mia eats banana on the picnic mat, and Arjun grins back at her clean cheeks.',
    },
    {
      text: 'Nanna set out three bowls of gulal powder on the grass: pink, green and yellow. Amma dipped a finger in the green. “May I put colour here?” she asked, pointing at Arjun’s cheek. “Yes, both cheeks!” said Arjun.',
      zone: 'top',
      art: 'Medium shot on the sunny grass a few steps from the picnic mat. Exactly three steel bowls heaped with soft powder sit in a row on the grass: one pink, one green, one yellow. Nanna stoops low, just setting down the yellow bowl. Amma bends toward Arjun holding up one finger tipped with green powder, pointing it at his cheek without touching it, eyebrows raised in a question. Arjun tips his face up to her, grinning, pointing at both of his own cheeks with both index fingers. The top third is open pale-blue spring sky above the far green hills, kept clear for words.',
      characters: ['Arjun', 'Amma', 'Nanna'],
      alt: 'Amma holds up a green finger and asks Arjun before colouring him, and Arjun points to both his cheeks.',
    },
    {
      text: '“My turn!” said Nanna, and bent down low. Arjun patted pink powder all over Nanna’s beard. Amma held out her chin, and Nanna dotted it yellow. Only Mia’s face was still clean.',
      zone: 'top',
      art: `Medium shot on the grass beside the three steel bowls, looking along the edge of the lawn. Nanna is bent low, laughing with his eyes shut behind his glasses, while Arjun, one green stripe on each of his own cheeks, pats both pink-powdered palms into Nanna’s beard, which is thick with pink powder. Amma leans in from the right with her chin held out, and Nanna reaches one yellow fingertip to dot it. Further back at the left edge, in the oak’s shade, Mia sits on the blue picnic mat, watching, her face clean. The top third is open pale-blue sky, the oak’s leaves only at the far left edge, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma', 'Nanna'],
      alt: 'Arjun pats pink powder into Nanna’s beard while Nanna dots yellow on Amma’s chin, and clean-faced Mia watches from the picnic mat.',
    },
    {
      text: 'Mia toddled over from the shade to see. Arjun dipped his fingers in the yellow and knelt in front of her. “May I put colour here?” he asked, pointing at her round cheek.',
      zone: 'right',
      art: `Low camera on the grass. Mia has just toddled out of the oak’s shade and stands on the sunny grass, looking curiously at Arjun. Arjun kneels upright in front of her, his head level with hers, green stripes on his cheeks, three fingers of his right hand dusted bright yellow and held up in the air a hand’s width from her face; his left index finger points at her round cheek; his eyebrows are raised, asking. Neither is touching the other. Just behind Arjun the three steel bowls of pink, green and yellow powder sit on the grass, a finger-mark dug into the yellow. The right third is the broad, plain grey-brown trunk of the oak in soft shade, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun kneels with yellow fingers held up and asks Mia, who has just toddled over, if he may colour her cheek.',
    },
    {
      text: '“No!” Mia covered both cheeks.',
      zone: 'top',
      big: true,
      art: `Close shot at Mia’s height on the grass. Mia squeezes both palms flat over her own cheeks, eyes scrunched, chin tucked, turning her face away from Arjun’s raised yellow fingers. Only Arjun’s yellow-dusted hand shows, frozen in the air at the left edge of the picture, not touching her; the rest of him is out of the frame. Her cheeks under her hands are clean. The top half is plain pale-blue sky above her head, kept clear for big words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Mia covers both cheeks with her hands and turns her face away from Arjun’s yellow fingers.',
    },
    {
      text: 'Arjun’s yellow fingers stopped in the air. “But it’s Holi!” he said. “I wanted everyone coloured!” He felt hot and cross, but he put his hand down.',
      zone: 'left',
      art: `Close-up of Arjun in three-quarter view at eye level. He kneels on the grass, green stripes on his cheeks, lowering his yellow-dusted hand to his knee, cheeks flushed hot red under the green stripes, brows pulled down, lower lip pushed out, cross and disappointed. Mia stands a step away on the right with her hands still pressed to her clean cheeks, peeking at him. The left third is soft, plain green lawn rising to pale sky, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun kneels with a cross face and lowers his yellow hand, while Mia still holds her cheeks.',
    },
    {
      text: 'Amma moved the three bowls up onto a wide oak branch, out of Mia’s reach. Then she crouched beside Arjun. “You wanted everyone coloured, and Mia said no. That’s hard, kanna,” said Amma. “No colour on Mia, but you can still play Holi with us.”',
      zone: 'top',
      art: `Medium shot at the edge of the oak’s shade. Amma, a dot of yellow on her chin, crouches on one knee beside the kneeling Arjun and rests one hand on his shoulder, looking at him kindly and seriously. Arjun looks down, still cross, green stripes on his cheeks. Behind them, the wide, nearly level low limb of the oak reaches out at a grown-up’s shoulder height; on its broad flat part near the trunk sit exactly three steel bowls of powder, one pink, one green, one yellow, well out of Mia’s reach. Mia stands on the grass a few steps out from the limb, not beneath the bowls, looking up at them, her cheeks clean. The top third is open pale-blue sky past the end of the limb, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma'],
      alt: 'The three bowls of powder sit high on an oak branch out of Mia’s reach, and Amma crouches with a hand on Arjun’s shoulder.',
    },
    {
      text: 'Mia pointed up at the pink bowl and laughed. She liked colours, just not on her cheeks. Then Arjun had an idea. He ran to the picnic bag for the tub of fat chalks.',
      zone: 'right',
      art: `Wide shot from low down at the edge of the oak’s shade. On the left, Mia stands on the grass a few steps out from the wide low limb, not beneath it, one arm stretched up, pointing at the bowl of pink powder on top, laughing. In the middle, Arjun is running toward the blue picnic mat, where a big round plastic tub of thick chalk sticks pokes out of the canvas picnic bag. Nanna, his beard pink, stands close beside Mia. The right third is the broad, plain grey-brown trunk of the oak, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Nanna'],
      alt: 'Mia points up at the pink powder on the branch and laughs, and Arjun runs to fetch a tub of fat chalks.',
    },
    {
      text: 'Arjun drew a green stem on the grey path, with a pink lotus on top. Mia sat down beside him with a yellow chalk. She scribbled round and round and round.',
      zone: 'top',
      art: `Seen from directly above. Arjun and Mia sit cross-legged on the wide pale-grey concrete path at the edge of the lawn, the open tub of thick chalk sticks between them. Arjun, green stripes on his cheeks, finishes a large pink lotus flower on top of a long green stem drawn on one square of the path. Next to it, Mia grips one fat yellow chalk in her fist and scribbles a round yellow tangle on the next square, her face clean, concentrating hard. The top third is bare grey path with nothing drawn on it, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'From above, Arjun draws a pink lotus on a green stem on the park path while Mia scribbles a yellow tangle beside it.',
    },
    {
      text: '“That’s a marigold,” said Arjun, pointing at the scribble. “May I put colour here?” he asked, pointing at the middle. Mia nodded hard. Arjun drew a bright orange centre, and Mia clapped.',
      zone: 'bottom',
      art: `Close shot at ground level along the path. Arjun holds an orange chalk and colours a round orange centre into the middle of Mia’s yellow scribble, so it now looks like a marigold. Mia kneels beside him, clapping her chalk-dusty yellow hands, nodding and beaming, her cheeks clean. The pink lotus on its green stem shows at the edge of the picture. The bottom third is plain grey path close to the camera, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun adds an orange centre to Mia’s yellow scribble to make a marigold, and Mia claps.',
    },
    {
      text: 'On the lawn, Amma and Nanna threw pink and green powder at each other, laughing. Arjun ran over for more colour. “Anna, come!” called Mia, and he ran back to his chalks. The chalk garden grew: lotuses, marigolds and an oak tree.',
      zone: 'top',
      art: `Wide shot from the path looking out over the lawn. A few steps out on the green grass, Amma and Nanna toss handfuls of pink and green powder at each other, laughing, both streaked pink and green, a soft cloud of colour drifting away from the path; far beyond them, small distant families play with colour too. In the foreground on the grey path, Mia kneels among her drawings, looking up and calling, one chalky hand waving; the path is covered with a chalk garden of two pink lotuses, three yellow marigolds with orange centres, and a chalk oak tree with a wide brown trunk and green leaves. Arjun, now with a fresh pink smear on his forehead, runs back from the lawn toward her and the chalks. The top third is open pale-blue spring sky above the far hills, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma', 'Nanna'],
      alt: 'Amma and Nanna throw colour on the lawn while Mia calls Arjun back to the chalk garden on the path.',
    },
    {
      text: 'By lunchtime, Amma, Nanna and Arjun were pink, green and yellow from head to toe. Mia’s cheeks were still clean. Her hands were yellow with chalk, and the whole path was a garden.',
      zone: 'top',
      art: `Wide, slightly high shot of the path along the lawn at midday. Amma, Nanna and Arjun stand together at the edge of the path, streaked pink, green and yellow from hair to shoes, grinning. Mia sits in the middle of the chalk garden with clean cheeks, holding up both palms, which are yellow with chalk dust. All around her the grey squares of the path are covered with two pink lotuses on green stems, three yellow marigolds with orange centres and a chalk oak tree. Behind them, in the oak’s shade, the blue picnic mat waits with the round steel tiffin. The top third is open pale-blue sky above the far hills, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma', 'Nanna'],
      alt: 'Amma, Nanna and Arjun stand covered in colour beside Mia, who sits with clean cheeks in the chalk garden on the path.',
    },
  ],
  tryThis: {
    title: 'Ask before you colour',
    steps: [
      'Each of you holds a washable felt pen. Take turns asking, “May I put colour here?” and pointing at the back of the other’s hand.',
      'Answer yes sometimes and no sometimes. On a yes, the asker draws one small dot. On a no, the pen goes down and the asker says, “Okay.”',
      'After a no, the asker offers another place: “On the paper, then?” Then draw there together.',
      'Ask before adding to someone’s drawing, too: “May I put colour here?”',
    ],
    safety: 'Use washable, non-toxic pens, and keep pen caps away from a toddler.',
  },
  note: {
    what: 'At a neighbourhood Holi in a Bay Area park, Arjun wants every face in his family coloured. Mia, who is two, covers her cheeks and says no. Arjun stops; Amma puts the powder out of her reach and tells him he can still play Holi. The two children draw a chalk garden on the park path while Amma and Nanna (and Arjun, between drawings) play with gulal on the lawn.',
    expect: 'He may side with Arjun at first: Holi means colour, so Mia is “doing it wrong”. He may not notice that Amma asks Arjun first (page 2), or that Arjun asks again before colouring Mia’s drawing (page 10).',
    practising: 'Asking before putting anything on another person’s body, stopping on a no without coaxing, and finding another way for someone to join in. Also this family’s Holi: gulal powder, a steel tiffin of pulihora, and play on the park lawn alongside the neighbourhood.',
    ask: 'On a re-read, at page 6, before turning the page: “Mia said no to colour on her cheeks. What else could Arjun do with colours?”',
    next: 'Draw a chalk garden on the driveway or a park path this week. Before he adds to anyone else’s drawing, he asks, “May I put colour here?” Amma can ask it in Tamil too: “Inga colour podalaamaa?” (may I put colour here?).',
    honest: 'Reading this will not make him ask first in the rush of a real Holi crowd; expect to cue him (“Ask first”) with powder in his hand. Keeping powder away from a toddler is the adults’ job, not his. In this family Holi is a neighbourhood outing rather than a home festival; the book shows one family at a community Holi in a Bay Area park, not Holika Dahan or the many regional ways Holi is played.',
    safety: 'Use skin-safe gulal, keep it away from eyes, nose and mouth, and keep the bowls out of a two-year-old’s reach. Throw powder away from where a toddler is sitting. Watch that a toddler does not chew the chalk.',
  },
};
