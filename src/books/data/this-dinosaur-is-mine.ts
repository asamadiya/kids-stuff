import type { Book } from '../types';

/**
 * This Dinosaur Is Mine — family shelf, family cast sheet.
 *
 * Arc (RULINGS-4-slate): Arjun wants to keep his special dinosaur with him,
 * but Mia grabs it, so he states his boundary and asks Amma for help,
 * keeping his dinosaur while Mia chooses another toy.
 * Value: personal possessions; sharing is not compulsory surrender.
 * Sibling sequence (RULINGS-0 §4): conflict → feeling → boundary → action → adult support.
 *
 * The household is the Bay Area Telugu–Tamil family (.redesign/v3/HOUSEHOLD.md):
 * a Saturday at home, with Amma at the stove making dosas. Tatayya carved the
 * Triceratops on the back patio when he and Nanamma visited; he is named, not
 * drawn. Amma speaks to Arjun as "kanna" and, turning to Mia, calls the toy
 * "Arjun anna's"; Mia calls him "anna" when she brings her elephant over.
 */

/** HOUSEHOLD.md: every picture with both children carries this sentence. */
const SIZES =
  "Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun's head about level with Mia's, sitting on his heels lower.";

export const book: Book = {
  slug: 'this-dinosaur-is-mine',
  title: 'This Dinosaur Is Mine',
  shelf: 'family',
  hook: 'Mia grabs Arjun’s wooden Triceratops. Arjun wants it back.',
  cast: 'family',
  setting:
    'The living room of the family’s Bay Area house on a sunny Saturday morning: honey-coloured wooden floor, a woven rug, a wicker toy basket, a low shelf of picture books, cream walls, and a wide doorway into the open kitchen, with steel tumblers on the counter.',
  refrain: 'This one stays with me.',
  readMinutes: 4,
  pages: [
    {
      text: 'Arjun had one special dinosaur. Tatayya carved it from walnut wood on the back patio when he visited last summer. It was a Triceratops, with three horns and a wide bony frill.',
      zone: 'top',
      art: 'Arjun sits cross-legged on the honey-coloured wooden floor, holding a small hand-carved dark-brown walnut-wood Triceratops up at eye level in both hands and studying it with a serious, delighted face. The wood shows fine grain and small knife-cut facets. The Triceratops clearly shows exactly three horns, two long horns above the eyes and one short horn on the nose, and a wide rounded bony frill behind its head. Medium shot at his eye level, framed so his head sits below the top third. The top third of the picture is a plain warm cream wall, empty and calm.',
      characters: ['Arjun'],
      alt: 'Arjun sits on the floor holding up the wooden Triceratops Tatayya carved, with its three horns and wide frill.',
    },
    {
      text: 'On Saturday morning, Arjun built his Triceratops a forest on the rug. Real Triceratops ate plants, so he set green blocks upright as ferns. Mia sat by the toy basket, tipping everything out.',
      zone: 'top',
      art: `Seen from above: Arjun lies on his tummy on a woven rug, standing the wooden Triceratops among six green blocks set upright like ferns. A few steps away, Mia sits beside a wicker basket she has tipped over; a grey cloth elephant, a red wooden truck, a soft ball and some wooden blocks spill across the floor. Morning sun falls across the rug. The top third of the picture is bare honey-coloured floorboards, empty. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun stands his Triceratops among upright green blocks on the rug while Mia tips out the toy basket nearby.',
    },
    {
      text: 'Mia looked up. She saw the Triceratops by the ferns and toddled straight over. She grabbed it by the frill and lifted it off the rug.',
      zone: 'right',
      art: `Mia bends forward with both small hands gripping the wooden Triceratops by its wide frill, lifting it off the rug, her eyes fixed on it. Arjun, still on his tummy beside the upright green block ferns, looks up startled, mouth open, one hand reaching too late. Low camera at rug level; both children are in the left two-thirds. The right third of the picture is a plain cream wall above empty floor, calm. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Mia grabs the wooden Triceratops by its frill and lifts it away from a startled Arjun.',
    },
    {
      text: '“Mine!” said Mia, hugging it tight.',
      zone: 'bottom',
      big: true,
      art: 'Close shot from slightly above, at a kneeling five-year-old’s eye height: Mia stands with her chin up and a fierce, pleased face, hugging the wooden Triceratops tight against her chest with both arms, its three horns poking out over her forearm. She fills the upper two-thirds of the picture. The bottom third is plain honey-coloured wooden floor in front of her bare feet, empty.',
      characters: ['Mia'],
      alt: 'Mia hugs the wooden Triceratops tight to her chest with a fierce little face.',
    },
    {
      text: 'Arjun’s face went hot. His hands wanted to pull the Triceratops back. But a hard tug could snap a horn, or hurt Mia. He kept his hands still.',
      zone: 'left',
      art: `Arjun kneels up on the rug facing Mia, his cheeks flushed dark red and his brows pulled down in a hard frown, both arms held straight down at his sides with fists clenched and still; he is not reaching or pulling. Mia stands in front of him clutching the wooden Triceratops. Close side view at the children’s height; both children are in the right two-thirds. The left third of the picture is a plain cream wall, calm and empty. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun kneels with a hot, angry face and his clenched fists held still at his sides while Mia clutches the Triceratops.',
    },
    {
      text: '“Stop, Mia. I’m using that,” said Arjun in a big, clear voice. “This one stays with me.” Mia shook her head and held on tighter.',
      zone: 'top',
      art: `Arjun, still kneeling up on the rug, holds one open palm up flat between himself and Mia in a clear stop sign and speaks in a firm, loud voice. Mia shakes her head hard, holding the wooden Triceratops tighter against her chest. Medium-wide shot, straight-on view, with the children’s heads below the top third. The top third of the picture is a plain cream wall above them, empty. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun holds up a flat hand and says stop, while Mia shakes her head and holds the Triceratops tighter.',
    },
    {
      text: 'Arjun did not tug. He turned toward the kitchen, where Amma was making dosas. “Amma, Mia has my Triceratops. I need help!”',
      zone: 'left',
      art: `Arjun kneels on the rug in the middle of the picture, his head turned right toward the wide doorway into the open kitchen, calling out with one hand cupped beside his mouth and the other hand resting on his knee, not reaching for the toy. Mia stands close beside him, clutching the wooden Triceratops. The doorway fills the right side of the picture; through it, small in the background, Amma stands at the stove with a steel ladle, spreading a round of dosa batter on a flat black iron pan, two steel tumblers and a stack of steel plates on the counter beside her, looking up; the kitchen window behind her shows a sunny backyard lawn, a wooden fence and a small lemon tree. Wide shot. The left third of the picture is a plain cream wall above empty floorboards, calm. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma'],
      alt: 'Arjun calls toward the kitchen, where Amma is making dosas, while Mia clutches his Triceratops.',
    },
    {
      text: 'Amma switched off the stove and knelt between Arjun and Mia. “You look angry, kanna,” she said. “I am angry,” said Arjun. “Tatayya made it for me.”',
      zone: 'top',
      art: `Amma kneels on the rug between the two children, a cotton kitchen towel over one shoulder, turned toward Arjun and looking at his face with steady attention. Arjun stands frowning, arms folded, speaking to her. Mia stands on Amma’s other side, still holding the wooden Triceratops against her chest. Medium-wide shot at the children’s eye level, with all three heads below the top third. The top third of the picture is a plain cream wall, empty and calm. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma'],
      alt: 'Amma kneels between the children and listens as Arjun, arms folded, says he is angry.',
    },
    {
      text: '“Mia is two,” said Amma. “She sees a good toy and grabs it. I will help you keep it, Arjun.” Then she told Mia, “The basket toys are for everyone. This Triceratops is Arjun anna’s.”',
      zone: 'right',
      art: `Amma, still kneeling, points with her left hand to the tipped-over wicker basket on the left of the picture and the spilled toys beside it, a grey cloth elephant, a red wooden truck, a soft ball and some wooden blocks, and rests her other open hand gently under the wooden Triceratops that Mia is holding, her face turned to Mia. Arjun stands close beside Amma, watching the Triceratops. Mia looks toward the basket. Medium-wide shot from slightly above; the basket and all three people are in the left two-thirds. The right third of the picture is a plain cream wall above empty floorboards, calm. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma'],
      alt: 'Amma points Mia to the basket toys with one hand and holds her other hand under the Triceratops in Mia’s arms.',
    },
    {
      text: 'Amma held out the red truck and the grey cloth elephant. “Mia, truck or elephant?” Mia chose the elephant. She let go of the Triceratops, and Amma passed it back to Arjun.',
      zone: 'top',
      art: `Amma kneels holding the red wooden truck in one hand and, with her other hand, passes the wooden Triceratops into Arjun’s two open hands. Mia has just chosen the grey cloth elephant and hugs it to her chest with both arms, looking at it, no longer holding the Triceratops. Seen from a high angle, looking down at the three of them on the rug, their heads in the middle of the picture. The top third of the picture is empty honey-coloured floorboards behind them, calm. ${SIZES}`,
      characters: ['Arjun', 'Mia', 'Amma'],
      alt: 'Mia hugs the grey cloth elephant she chose while Amma, holding the red truck, passes the Triceratops back to Arjun.',
    },
    {
      text: '“This one stays with me,” said Arjun.',
      zone: 'bottom',
      big: true,
      art: 'Close shot from slightly above: Arjun kneels on the rug holding the wooden Triceratops in both hands against his chest, his face calm and relieved, his shoulders down. Amma kneels just behind him with one hand resting on his shoulder. The three horns and the wide frill of the Triceratops are clearly visible over his fingers. The two of them fill the upper two-thirds of the picture; the bottom third is plain woven rug in front of his knees, empty and calm.',
      characters: ['Arjun', 'Amma'],
      alt: 'Arjun holds his wooden Triceratops close to his chest, calm again, with Amma’s hand on his shoulder.',
    },
    {
      text: 'Arjun stood the Triceratops back among the ferns, right beside him. Mia walked her elephant over to the forest. “Anna! Elephant!” she said. Arjun pushed one green fern block over to the elephant. “Elephants eat plants too,” he said.',
      zone: 'top',
      art: `Seen from above: Arjun lies on his tummy on the woven rug with the wooden Triceratops standing among the upright green block ferns right beside his elbow. Mia sits on the rug facing him with the grey cloth elephant, holding its trunk down to one green block that Arjun is pushing across the rug toward it with one finger. Both children look pleased. The top third of the picture is bare honey-coloured floorboards, empty. ${SIZES}`,
      characters: ['Arjun', 'Mia'],
      alt: 'Arjun’s Triceratops stands in its block forest beside him while he pushes one green block over to Mia’s cloth elephant.',
    },
  ],
  tryThis: {
    title: 'Try a situation: “This one stays with me”',
    steps: [
      'The child holds one special toy. A grown-up makes a soft toy play the little sister and take it gently from his hands.',
      'The child keeps his hands still and says, “Stop. I’m using that. This one stays with me.”',
      'The child says, “I need help.” The grown-up offers the soft-toy sister two other toys and hands the special one back to the child.',
      'Swap roles: the child plays the grabbing sister, and the grown-up uses the same words and asks for help.',
    ],
  },
  note: {
    what: 'Mia grabs the wooden Triceratops that Tatayya carved for Arjun when he last visited. Arjun feels angry, keeps his hands still, says “Stop. I’m using that. This one stays with me,” and calls Amma from the kitchen. She tells Mia the Triceratops is “Arjun anna’s”, returns it to him and lets Mia choose between two basket toys.',
    expect: 'Most five-year-olds side hard with Arjun and enjoy the page where he gets it back. He may ask why Arjun did not just pull it back; the book’s answer is page 5 — a tug can break the toy or hurt Mia. He may not notice that Amma never asks Arjun to give anything up.',
    practising: 'Telling a personal possession from a shared resource; holding a boundary in words (“Stop. I’m using that.”) instead of tugging; asking an adult for help. Sharing is something he can choose — offering a spare — not a surrender demanded of him.',
    ask: 'On page 9: “Which toys are for everyone, and which one is only Arjun’s?”',
    next: 'This week, let him choose one or two special things that are his alone, such as a present from Nanamma and Tatayya or Paati and Thatha, and give them a high shelf Mia cannot reach. When she grabs one, come when he calls, offer her a choice of two shared toys as Amma does, and put his thing back in his hands. Do not ask him to wait for a turn with it. Amma can tell Mia in Tamil, “Idhu annavoda bommai” (this is anna’s toy).',
    honest: 'Hearing the words once will not stop him grabbing back in the moment; expect to prompt the line many times. The book also does not teach Mia anything — at two, she needs a grown-up to redirect her every time.',
  },
};
