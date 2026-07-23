import type { Story } from '../types';

export const aPlaceToStand: Story = {
  slug: 'a-place-to-stand',
  title: 'A Place to Stand',
  subtitle: 'Piko finds where one tiny push can lift a clay stone.',
  domain: 'simple-machines',
  collection: 'fiction',
  repeatedPhrase: 'Far from the middle, gentle and little',
  readAloudMinutes: 5,
  learningTakeaway:
    'A gentle push near the long end of a board can lift a clay stone resting near the pivot.',
  heartTakeaway:
    'Trying one careful place at a time helps Piko find the answer without forcing it.',
  grownUpFact:
    'For an ideal lever, a 4-to-1 effort-arm ratio gives about 4 times the lifting force. Archimedes (c.287–212 BCE) is traditionally associated with the saying about a place to stand, but the story here is fictional.',
  pages: [
    {
      text: 'In a Syracuse workshop, Piko the little mouse watched Doras work. She was building a safe clay model of a stone doorway. One clay block would not budge into place. A long board rested over a smooth wooden pivot. Piko offered both tiny paws, eager to help. Sunlight striped the table. The workshop smelled of dry clay and olive wood. Piko wanted to lift the stubborn block.',
      cue: 'Look around your room. Can you find something long and flat, like Piko’s board?',
      scene: {
        id: 'a-place-to-stand-p1',
        focus: 'Piko beside Doras at a low worktable',
        composition:
          'Foreground: long board over a round wooden pivot, clay doorway blocks; midground: Piko beside Doras at a low worktable; background: Syracuse workshop, allocated water-screw in a tilted tube.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'Piko and Doras stand at a low table with a lever model while a tilted water-screw rests in the workshop.',
    },
    {
      text: 'Piko pressed close to the middle of the board. Nothing happened. Tok went the board against the table. The clay block stayed exactly where it was. Doras moved the block near the short end. She pointed toward the long end instead. “Far from the middle, gentle and little,” she said kindly. Piko scampered outward along the board.',
      cue: 'Hold one arm out like a long board. Where is the middle?',
      scene: {
        id: 'a-place-to-stand-p2',
        focus: 'Doras pointing toward the far end',
        composition:
          'Foreground: Piko pressing beside the pivot, clay block on short end; midground: Doras pointing toward the far end; background: workbench jars, sunlit wall.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'Piko presses a board near its pivot while Doras points toward the far end and the clay block stays down.',
    },
    {
      text: 'At the far end, Piko leaned with one paw. The board tipped. The clay block rose a whisker. “Far from the middle, gentle and little,” Piko squeaked. He did not shove any harder. He checked that the pivot stayed still. Then he tried the same careful spot again. A tiny push, far out, could lift the stone.',
      scene: {
        id: 'a-place-to-stand-p3',
        focus: 'Doras watching the level change',
        composition:
          'Foreground: Piko at the far board end, clay block slightly raised; midground: Doras watching the level change; background: open workshop door, olive trees.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'Piko presses the far end of a board and a clay block rises slightly near the pivot.',
    },
    {
      text: 'A loose seed rolled beneath the pivot. The board wobbled. Creak. The clay block settled back down again. Piko’s tail drooped a little. For a moment he wanted to push everywhere at once. Instead, he paused and took a slow breath. He looked for the one small thing that had changed.',
      cue: 'When something goes wrong, can you take a slow breath with Piko?',
      scene: {
        id: 'a-place-to-stand-p4',
        focus: 'Piko pausing with lowered paws',
        composition:
          'Foreground: seed beneath the tilted pivot, board resting unevenly; midground: Piko pausing with lowered paws; background: violet workshop shadows, hanging cloth.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'A seed under the pivot makes the board wobble while Piko pauses to look.',
    },
    {
      text: 'Doras held the board while Piko nudged the seed away. He set the pivot on a flat tile. Now it did not rock at all. “Far from the middle, gentle and little.” One soft press lifted the clay block again. It rose high enough for Doras to slide a little support beneath it.',
      cue: 'Which pressing spot is farther from the pivot: the near spot or the end spot?',
      scene: {
        id: 'a-place-to-stand-p5',
        focus: 'Piko pressing far out while Doras steadies the board',
        composition:
          'Foreground: flat tile under the pivot, small support ready; midground: Piko pressing far out while Doras steadies the board; background: lamp-lit bench, finished model pieces.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'Piko presses the far end of the board as Doras steadies it over a flat tile.',
    },
    {
      text: 'Piko tried once more, to be sure. He used the same far place and the same small push. Up rose the model block again. “Far from the middle, gentle and little,” he said proudly. Patience had helped him find the useful spot. Strength alone had not solved the workshop puzzle. The gentle lever had done the work.',
      scene: {
        id: 'a-place-to-stand-p6',
        focus: 'Piko smiling beside the completed lever action',
        composition:
          'Foreground: raised clay block, support slid beneath; midground: Piko smiling beside the completed lever action; background: finished clay doorway, first stars.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'A raised clay block rests on a small support while Piko smiles beside the lever.',
    },
    {
      text: 'By moonrise, the clay doorway stood finished. Piko curled in a basket of soft wool. It sat beside the quiet board and round pivot. One star shone through the little model opening. Doras lowered the lamp until only a warm oval remained. His paws relaxed, and his tail tucked close. The workshop became still and cozy. Goodnight, Piko. Rest well.',
      scene: {
        id: 'a-place-to-stand-p7',
        focus: 'Piko curled asleep',
        composition:
          'Foreground: quiet board and round pivot, wool basket; midground: Piko curled asleep; background: model doorway framing one star, crescent moon.',
        palette: 'sun-warmed limestone, olive green, muted coral, and deepening indigo',
      },
      alt: 'Piko sleeps in a wool basket beside the resting board while one star shows through the clay doorway.',
    },
  ],
};
