import type { Book } from '../types';

/**
 * One Block Can Balance Two — how shelf, family cast sheet.
 *
 * Arc (RULINGS-4-slate): Arjun wants his toy loading beam level, but two blocks
 * tip one side, so he moves one matching block farther from the central pivot
 * on the other side until the beam balances.
 * Concept (charter, physics 5): lever balance depends on weight AND distance
 * from the pivot; the misconception challenged is "the side with more weight
 * always goes down".
 *
 * The physics is kept exact. The empty beam is shown level first (a fair
 * start); the three blocks are identical; the notches are evenly spaced out
 * from the pivot. Two blocks one notch out (2 x 1) tip one block one notch out
 * (1 x 1), lose to one block three notches out (1 x 3), and balance one block
 * two notches out (1 x 2). A balanced beam does not level itself, so on the
 * second-notch page Arjun holds it level and the next page lets go: the mirror
 * of the finger page, where letting go tipped it back. On every page after
 * that, no hand touches the beam.
 *
 * Orientation is fixed for the illustrator: Mia's end is always on the LEFT of
 * the picture, Arjun's end on the RIGHT.
 *
 * The household is the Bay Area Telugu–Tamil family (.redesign/v3/HOUSEHOLD.md):
 * a weekend at home, so Amma and Nanna. Nanna made the beam and asks the
 * refrain; Amma comes in from gardening in the backyard at the end; Mia calls
 * her brother "anna".
 */

const BEAM =
  'the loading beam: a long, flat, pale wooden beam with three evenly spaced notches cut along its top edge on each side of its middle, the gap from its middle to the first notch the same as the gap between notches, its middle resting on the top point of a small wooden triangle block';

/** HOUSEHOLD.md: every picture with both children carries this sentence. */
const SIZES =
  "Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun's head about level with Mia's, sitting on his heels lower.";

export const book: Book = {
  slug: 'one-block-can-balance-two',
  title: 'One Block Can Balance Two',
  shelf: 'how',
  hook: 'Two blocks tip the beam. Arjun has only one.',
  cast: 'family',
  setting:
    'The family’s Bay Area single-family house on a sunny Sunday afternoon: a living room with a honey-coloured wooden floor, a plain sand-coloured rug, a long grey sofa, the open kitchen to one side with steel tumblers on its counter, and a sliding glass door onto the backyard lawn, wooden fence and lemon tree.',
  refrain: 'How far from the middle?',
  readMinutes: 4,
  pages: [
    {
      text: 'Nanna had made Arjun a loading beam, like a little seesaw. It had three notches on each side, the same distance apart. Its middle rested on the point of a wooden triangle. “Choodu, Arjun, that point is the pivot,” said Nanna.',
      zone: 'top',
      art: `Nanna kneels on the rug, bending forward, beside ${BEAM}, which he has just set down and which now lies level on its own, nobody touching it. With one finger of his right hand he points at the top point of the triangle where the beam rests; his left hand rests on his knee. Arjun kneels opposite him, bent low so his eyes are level with the triangle, studying it closely, eyebrows drawn together in concentration. Wide shot at child height, afternoon sun across the floor; both heads stay below the top third. The top third is a plain cream wall, kept clear for words.`,
      characters: ['Nanna', 'Arjun'],
      alt: 'Nanna points at the wooden triangle under a long notched beam while Arjun kneels low to study it.',
    },
    {
      text: 'The empty beam lay level on its pivot. Arjun’s cargo was three red blocks, exactly alike. His harbour rule was strict: all three blocks on the beam, and the beam level. Only then could he load the ship.',
      zone: 'left',
      art: `Low shot at rug level, straight from the side: ${BEAM}, completely empty and lying perfectly level, neither end touching the rug. Arjun lies on his tummy on the right, chin on his hands, one eye squeezed shut, checking along the beam that it is level. In front of him on the rug sit three identical red wooden cube blocks in a row, and a wooden toy cargo ship with a blue hull and a flat empty deck. In the background Nanna sits at the right-hand end of the grey sofa, reading a book. Everything sits in the middle and right of the picture, the beam's left end just left of centre; the left third is plain cream wall above bare honey-coloured floorboards, kept clear for words.`,
      characters: ['Arjun', 'Nanna'],
      alt: 'The empty beam lies level on its triangle while Arjun checks it, with three red blocks and a toy ship beside him.',
    },
    {
      text: 'Mia toddled over and stacked two red blocks in the first notch on her side. Thunk! Her end went down onto the rug. “Mine!” said Mia, patting her blocks.',
      zone: 'top',
      art: `Mia crouches on the left side of ${BEAM}, just left of its middle, patting the top of two red wooden cube blocks that she has stacked one on top of the other in the first notch to the left of the middle, beaming proudly. The beam now tilts: its left end rests down on the rug and its right end is up in the air, empty. Arjun kneels at the right end, the one remaining red block in his hand, eyebrows raised in surprise. Medium shot from the front at child height. The top third is a plain cream wall, kept clear for words. ${SIZES}`,
      characters: ['Mia', 'Arjun'],
      alt: 'Mia pats two red blocks stacked near the middle on her side of the beam, which has tipped down to the rug.',
    },
    {
      text: 'Arjun wanted the beam level, but Mia was guarding her two blocks. He had one red block left. He set it in his first notch, as far out as hers. Nothing moved.',
      zone: 'bottom',
      art: `Side view at child height: Arjun’s fingers have just let go of a single red wooden cube block sitting in the first notch to the right of the middle of ${BEAM}. Two stacked red blocks sit in the first notch to the left of the middle, the same distance out. The beam still tilts: the left end rests on the rug, the right end with Arjun’s block is still up in the air. Arjun kneels behind it, looking hard at the beam, lips pushed out, not beaten yet. Mia sits on the rug on the left side of the beam, close beside her two stacked blocks, leaning over them with a fierce frown, guarding them without touching them. The beam is in the middle distance; the bottom third is bare honey-coloured floorboards in the foreground, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Mia guards her two blocks while Arjun looks hard at the beam, still tipped down on her side, his one block up in the air.',
    },
    {
      text: 'Arjun pressed his end down with one finger. Now the beam lay level. But when he let go, up went his end again. “A finger is not cargo,” said Nanna, from the sofa.',
      zone: 'top',
      art: `Arjun kneels at the right end of ${BEAM} and presses that end down with one straight index finger, so for now the beam lies level; his face is hopeful, mouth tight. Two stacked red wooden cube blocks sit in the first notch left of the middle, and one red block sits in the first notch right of the middle. Mia sits by the left end, watching his finger. Behind them Nanna sits low on the grey sofa, lowering his book, one eyebrow raised, amused; his head stays below the top third. Medium shot from the front at child height. The top third is the plain cream wall above the sofa, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Nanna'],
      alt: 'Arjun holds his end of the beam level with one finger while Nanna watches from the sofa, amused.',
    },
    {
      text: '“Two blocks will always beat one,” Arjun grumbled. Nanna knelt beside him and tapped Arjun’s red block. “Look where it sits,” said Nanna. “How far from the middle?”',
      zone: 'top',
      art: `Nanna kneels low on the rug beside Arjun at the right end of ${BEAM}, bent over it, tapping the single red wooden cube block in the first notch right of the middle with one fingertip, his face calm and curious. Arjun sits back on his heels with his arms folded and his lower lip pushed out, grumbling, but his eyes have followed Nanna’s finger to the block. The beam still tilts down on the left, where two stacked red blocks sit in the first notch left of the middle. Mia sits by the left end. Medium shot from the front at child height; Nanna's head stays below the top third. The top third is a plain cream wall, kept clear for words. ${SIZES}`,
      characters: ['Nanna', 'Arjun', 'Mia'],
      alt: 'Nanna taps Arjun’s one red block on the beam while Arjun sits with folded arms, looking at it.',
    },
    {
      text: 'Arjun counted the notches on his side with one finger. His block sat in the first, close to the middle. Two more notches ran on past it, all the way to the end.',
      zone: 'bottom',
      art: `Close shot from above, looking down on the right half of ${BEAM}: Arjun’s index finger touches the third notch near the right end of the beam, having counted along. One red wooden cube block sits in the first notch, right beside the middle of the beam; the second and third notches beyond it are empty. Arjun’s face leans in at the top of the picture, eyes narrowed, lips moving as he counts. The bottom third is the plain sand-coloured rug below the beam, empty, kept clear for words.`,
      characters: ['Arjun'],
      alt: 'From above, Arjun’s finger counts out along the empty notches past his one red block.',
    },
    {
      text: 'Arjun moved his block out to the very last notch. Thunk! Now his end went down, and Mia’s end flew up. One block had beaten two.',
      zone: 'top',
      art: `Wide side view of ${BEAM}, now tipped the other way: its right end rests down on the rug, with one red wooden cube block sitting in the third notch, the very last notch near the end. The left end is high in the air, with two stacked red blocks still sitting in the first notch left of the middle. Mia sits at the left, both arms flung up but below the top third, laughing with delight. Arjun kneels at the right, his hand just lifted from his block, mouth open in astonishment. Nanna kneels low behind them, smiling, his head below the top third. The top third is a plain cream wall, kept clear for words. ${SIZES}`,
      characters: ['Mia', 'Arjun', 'Nanna'],
      alt: 'With one block at the far end, Arjun’s end of the beam goes down and Mia’s end with two blocks flies up.',
    },
    {
      text: 'But Arjun wanted the beam level, not tipped. “How far from the middle?” he whispered. Not the first notch, and not the last. He slid his block back to the second notch and held the beam level.',
      zone: 'top',
      art: `Close side view of ${BEAM}: the single red wooden cube block now sits in the second notch right of the middle, and the third notch beyond it is empty. Arjun holds the right end of the beam level with the fingertips of one hand, very lightly. Two stacked red blocks sit in the first notch left of the middle. Arjun crouches low behind the beam, his head just above it, lips pressed together, eyes narrowed in careful concentration. The top third is a plain cream wall, kept clear for words.`,
      characters: ['Arjun'],
      alt: 'Arjun’s one red block now sits in the second notch, and he holds the beam level with his fingertips.',
    },
    {
      text: 'Arjun let go. The beam stayed level.',
      zone: 'bottom',
      big: true,
      art: `Close, low side view at rug level: ${BEAM} lies perfectly level, both ends in the air and neither touching the rug. Two stacked red wooden cube blocks sit in the first notch left of the middle; one red block sits alone in the second notch right of the middle. Nobody touches the beam: Arjun kneels behind it with both open hands lifted clear in the air, holding his breath, eyes wide. Mia peeks over the left end, very still. The bottom third is bare honey-coloured floorboards in the foreground, kept clear for words. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'The beam lies level with two blocks near the middle on one side and one block farther out on the other.',
    },
    {
      text: 'Amma came in from the backyard and saw the level beam. “Two blocks against one?” she asked. Arjun pointed along the notches. “Mia’s two are one notch out, and my one is two notches out.”',
      zone: 'right',
      art: `Amma stands at the left of the picture, just in through the open sliding glass door from the backyard (the green lawn and lemon tree outside behind her), garden gloves still on, bending forward with her hands on her knees, looking at ${BEAM}, which lies level with two stacked red wooden cube blocks in the first notch left of the middle and one red block in the second notch right of the middle. Arjun kneels behind the beam, pointing proudly along the notches with one finger, explaining. Mia sits by the left end with her hands in her lap. Nanna sits back on his heels behind them, smiling, saying nothing. Medium shot from the front at child height; everyone and the whole beam sit in the left two-thirds of the picture. The right third is a plain cream wall, kept clear for words. ${SIZES}`,
      characters: ['Amma', 'Arjun', 'Mia', 'Nanna'],
      alt: 'Arjun points along the notches of the level beam to show Amma, while Mia and Nanna watch.',
    },
    {
      text: 'The beam lay level, so Arjun could load the ship. “Ship, anna!” said Mia, and handed him her two blocks. He added his one. Then Mia pushed, Arjun steered, and the cargo sailed across the rug.',
      zone: 'top',
      art: `Wide shot at child height across the rug: a wooden toy cargo ship with a blue hull carries three identical red wooden cube blocks on its flat deck. Mia crawls behind it on hands and knees, pushing its stern with both palms, grinning. Arjun crawls ahead of it, one hand on its bow, steering it toward the grey sofa, intent and pleased. Behind them the notched wooden beam lies empty and level on its small wooden triangle. Amma and Nanna sit side by side on the grey sofa in the background, watching; their heads stay below the top third. The top third is a plain cream wall above the sofa, kept clear for words. ${SIZES}`,
      characters: ['Mia', 'Arjun', 'Amma', 'Nanna'],
      alt: 'Mia pushes and Arjun steers a toy ship carrying three red blocks across the rug while Amma and Nanna watch.',
    },
  ],
  tryThis: {
    title: 'Balance two with one',
    steps: [
      'Lay a flat 30 cm ruler across a pencil at its 15 cm mark, so it rests level.',
      'Put two identical coins on the 12 cm mark. Watch that end go down.',
      'Before placing a third coin, ask him where it must go on the other side. Try his place first.',
      'Slide that one coin along the other side until the ruler rests level. Read the mark: about 21 cm.',
      'Count centimetres from the middle on each side: 3 for the two coins, 6 for the one. Then try three coins against one.',
    ],
    safety: 'Coins are a choking hazard: keep them out of reach of the two-year-old, and count them back in at the end.',
  },
  note: {
    what: 'A how-it-works story about levers. Two blocks near the middle tip Arjun’s toy beam, and his one matching block cannot level it from the same notch. He moves it out to the end, overshoots, and comes back one notch, where one block balances two.',
    expect: 'Most five-year-olds expect two blocks to win wherever they sit; page 6 is Arjun saying exactly that aloud. Page 8, where one block lifts two, often gets a gasp. He may decide “farther always wins” and miss why the second notch is exactly right; that half comes later.',
    practising: 'The lever rule: a beam on a pivot balances when weight times distance from the pivot is the same on both sides. Here 2 blocks × 1 notch = 1 block × 2 notches. The empty beam lying level on page 2 is the fair start: the beam itself favours neither side, the blocks are identical, and the notches are equal steps.',
    ask: 'On page 8, before you turn: Arjun’s block was too close at the first notch and too far at the last. Where should he put it now? Nanna can also ask the refrain in Telugu: “Madhya nunchi entha dooram?” (how far from the middle?).',
    next: 'At a playground seesaw this week, sit him on the end seat. Sit yourself on the plank on the other side, close to the middle, and let him tell you to shuffle out or in until the seesaw balances.',
    honest: 'The story shows one case, two against one. It does not teach the multiplication behind it, and getting the gasp is not the same as predicting. Check that with the ruler and coins: can he say where the coin goes before he puts it there?',
    easier: 'Use only the first two moves: one coin against one coin at equal distances, then move one coin outward and watch it win.',
    harder: 'Stack three coins 3 cm from the middle. Ask where one coin must go (9 cm out), and then where two stacked coins must go (4.5 cm out).',
    safety: 'Keep the coins out of reach of the two-year-old. On a real seesaw, a grown-up steadies it before anyone climbs off, so nobody drops with a bump.',
  },
};
