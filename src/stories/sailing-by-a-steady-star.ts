import type { Story } from '../types';

export const sailingByASteadyStar: Story = {
  slug: 'sailing-by-a-steady-star',
  title: 'Sailing by a Steady Star',
  subtitle: 'Pytheas of Massalia watched the northern stars to keep his ship facing one way.',
  domain: 'navigation',
  collection: 'historical',
  repeatedPhrase: 'Find the steady light',
  readAloudMinutes: 5,
  learningTakeaway:
    'Long ago, sailors watched the northern stars near the top of the sky to know which way was north. When a boat turned, those stars seemed to slide, and that told the sailors they had changed the way they were facing.',
  heartTakeaway:
    'Courage can begin with a calm breath and one familiar thing to look for in a big, new place.',
  grownUpFact:
    'Pytheas was a real Greek explorer from Massalia (modern Marseille) who sailed north around 325 BCE and wrote about far seas and long summer days. In his time there was no single bright pole star: Polaris sat farther from the exact north point than it does now. So ancient sailors watched the whole cluster of northern stars near the Little Bear, not one lone star, to hold their heading.',
  pages: [
    {
      text: 'Long ago, a sailor named Pytheas lived in the sunny harbour city of Massalia. He loved the sea and the wide night sky. He wanted to sail far north, past cold grey waters no Greek had mapped. On his last calm night in port, he looked up. "Find the steady light," he whispered to himself.',
      cue: 'Look up with Pytheas. Can you find one steady point of light in your room?',
      scene: {
        id: 'sailing-by-a-steady-star-p1-harbour-dream',
        focus: 'Pytheas standing by his moored ship in Massalia, gazing up at the northern sky',
        composition:
          'Foreground: a coiled rope and wooden rail on the deck; midground: Pytheas looking up with a calm face; background: Massalia harbour lamps, a tall mast, and one bright northern point of light',
        palette: 'deep Aegean blue, lantern amber, weathered wood, and soft silver',
      },
      alt: 'A Greek sailor stands on his ship in a harbour and points up toward one bright light in the northern sky.',
    },
    {
      text: 'The northern stars sat high, near the very top of the sky. Pytheas knew a small trick that old sailors shared. He scratched a tiny mark on his mast, just below those stars. He lined up his eye, the mark, and the glow. That patch of sky pointed the way that sailors called north.',
      scene: {
        id: 'sailing-by-a-steady-star-p2-mast-mark',
        focus: 'Pytheas lining up his eye with a small mast mark and the northern stars',
        composition:
          'Foreground: a raised hand near a scratched mast mark; midground: Pytheas sighting carefully; background: the calm harbour and a small cluster of northern stars',
        palette: 'ink blue, soft cedar, pearl white, and muted gold',
      },
      alt: 'A sailor lines up his eye, a small mark on the mast, and a cluster of steady northern stars.',
    },
    {
      text: 'Away sailed the ship into the open sea. Swish. A gentle wave nudged the bow sideways. The mast mark slipped away from the northern glow. "Find the steady light," Pytheas said softly. He eased the ship back around, until the mark and the stars rested together once more.',
      cue: 'Turn your head slowly. Watch how the steady light seems to move to one side.',
      scene: {
        id: 'sailing-by-a-steady-star-p3-notice-turn',
        focus: 'the mast mark sliding away from the northern stars as the ship turns',
        composition:
          'Foreground: the safe wooden rail; midground: Pytheas watching the mast closely; background: an angled sea horizon and the steady northern point',
        palette: 'sea blue, moon silver, dark plum, and warm brown',
      },
      alt: 'A sailor notices a mast mark no longer lines up with the northern stars after his ship turns.',
    },
    {
      text: 'Then a thin cloud crept across the northern sky. The steady glow vanished. All around, the dark water looked the very same. Pytheas felt his heart beat faster. But he did not rush. He shortened the sail, breathed slowly, and waited. "A hidden light is not a lost light," he said.',
      scene: {
        id: 'sailing-by-a-steady-star-p4-cloud-pause',
        focus: 'a thin cloud hiding the northern stars while Pytheas calmly waits',
        composition:
          'Foreground: a folded sail edge; midground: Pytheas resting a steady hand on the mast; background: a soft cloud veil over the northern sky',
        palette: 'mist grey, midnight blue, soft amber, and muted teal',
      },
      alt: 'A thin cloud hides the northern stars while a sailor keeps calm and waits by his mast.',
    },
    {
      text: 'The cloud drifted on. The northern glow returned beside the mast mark. "Find the steady light," Pytheas said, braver now. He checked the mark, then guided his ship gently onward toward the cold northern seas. He breathed out. The wide dark ocean no longer felt so strange.',
      cue: 'What changed for Pytheas when the mark and the star lined up again?',
      scene: {
        id: 'sailing-by-a-steady-star-p5-light-returns',
        focus: 'the northern glow returning beside the mast mark after the cloud passes',
        composition:
          'Foreground: Pytheas pointing gently upward; midground: the mast and its small mark; background: an opening cloud and a calm northern sea',
        palette: 'clearing indigo, moon white, gentle gold, and dark turquoise',
      },
      alt: 'A sailor smiles as the northern stars return beside the mast mark through an opening cloud.',
    },
    {
      text: 'For many nights Pytheas sailed by that patch of northern sky. He learned what it had shown him: not every turn had to feel confusing. One careful look from mark to star could tell him when his ship had changed the way it faced. He wrote it all down for other sailors to read.',
      scene: {
        id: 'sailing-by-a-steady-star-p6-northern-voyage',
        focus: 'Pytheas checking the mast mark and northern stars far out at sea',
        composition:
          'Foreground: still water beside the hull; midground: Pytheas at the mast with a small scroll; background: distant northern shores under a starry sky',
        palette: 'harbour amber, deep blue, copper, and soft cream',
      },
      alt: 'A sailor calmly checks the northern stars and mast mark far out at sea, holding a small scroll.',
    },
    {
      text: 'At last Pytheas came home to Massalia, safe and glad. That night he lay in his own snug bed while his ship rocked gently at its rope. Through his window, the northern glow rested above the quiet roofs. "Find the steady light," he murmured. His breath softened, and the whole starry night grew still. Goodnight.',
      scene: {
        id: 'sailing-by-a-steady-star-p7-window-glow',
        focus: 'Pytheas asleep beneath a window framing the northern stars',
        composition:
          'Foreground: a folded blanket; midground: sleeping Pytheas; background: Massalia rooftops, a moored ship, and one steady northern glow',
        palette: 'velvet blue, lavender, warm linen, and one silver-white light',
      },
      alt: 'A sailor sleeps beneath a window while the northern stars shine above quiet roofs and a moored ship.',
    },
  ],
};