import type { Story } from '../types';

export const theTenThousandLittleBlocks: Story = {
  slug: 'the-ten-thousand-little-blocks',
  title: 'The Ten Thousand Little Blocks',
  subtitle: 'Bao sorts reusable clay word blocks so the printer can find each one again.',
  domain: 'materials',
  collection: 'fiction',
  repeatedPhrase: 'Pick, press, put it back',
  readAloudMinutes: 5,
  learningTakeaway:
    'One clay block can make the same printed word again, then return to its own tray space for reuse.',
  heartTakeaway:
    'Bao’s careful sorting lets the whole workshop reuse the blocks instead of losing them in a jumble.',
  grownUpFact:
    'Shen Kuo’s 11th-century Dream Pool Essays describes Bi Sheng making movable type from baked clay around 1041–1048 CE, arranging individual characters for printing, and storing them for reuse. The account survives even though Bi Sheng’s original type does not.',
  pages: [
    {
      text: 'In a Song China printshop, Bao stood before a wide tray of small baked-clay blocks. Each block carried one carved word. Warm ink smelled earthy, and the courtyard beyond was quiet. Shelves held brushes, smooth stones, and bundles of fresh cream paper. Father Wen had arranged the tray in neat rows beside paper and a hand pad.',
      scene: {
        id: 'the-ten-thousand-little-blocks-p1',
        focus: 'Bao beside Wen at the print table',
        composition:
          'Foreground: movable-type composing tray, rows of clay blocks, paper and hand pad; midground: Bao beside Wen at the print table; background: Song printshop shelves, open courtyard.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Bao and Wen stand beside an orderly gridded tray of small clay printing blocks and paper.',
    },
    {
      text: 'Wen chose one block, inked it, and pressed it onto a scrap. Tap. The same raised shape left the same dark impression twice. “Pick, press, put it back,” Bao said. She returned the block to its own square space before choosing another.',
      cue: 'Pretend to pick up a tiny block, press it gently, and return it to one square.',
      scene: {
        id: 'the-ten-thousand-little-blocks-p2',
        focus: 'Bao returning the block after pressing',
        composition:
          'Foreground: one clay block, two matching abstract impressions, empty tray square; midground: Bao returning the block after pressing; background: Wen holding the ink pad, warm shelves.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Bao returns one clay block to its square beside two matching abstract printed shapes.',
    },
    {
      text: 'Bao made a short row of impressions. She reused the first block at the end, and its shape matched. “Pick, press, put it back.” Individual blocks could change places, print again, and wait for another page. The tray kept each one easy to find.',
      scene: {
        id: 'the-ten-thousand-little-blocks-p3',
        focus: 'Bao comparing matching shapes',
        composition:
          'Foreground: short impression row, first block reused at the end; midground: Bao comparing matching shapes; background: ordered tray, blue courtyard shade.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Bao points to matching abstract impressions at the beginning and end of a short printed row.',
    },
    {
      text: 'A sleeve caught the tray cloth. Several blocks slid into a jumble. Bao froze. One needed block looked like many neighbors from the side. If she guessed and pressed, the row might be wrong. She moved the paper away and began sorting before printing again.',
      scene: {
        id: 'the-ten-thousand-little-blocks-p4',
        focus: 'Bao moving the paper safely aside',
        composition:
          'Foreground: six jumbled clay blocks, wrinkled tray cloth; midground: Bao moving the paper safely aside; background: quiet printshop, violet doorway.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Six clay blocks lie jumbled beside six empty tray squares while Bao moves the paper aside.',
    },
    {
      text: 'Wen turned each block faceup while Bao matched its raised shape to the tray’s shape card. “Pick, press, put it back.” One by one, the blocks returned to separate squares. Bao found the needed block without rushing and pressed the next clear impression.',
      cue: 'Which makes a block easier to find later: a jumble or its own square space?',
      scene: {
        id: 'the-ten-thousand-little-blocks-p5',
        focus: 'Bao matching while Wen turns blocks faceup',
        composition:
          'Foreground: shape cards with abstract reliefs, blocks returning to squares; midground: Bao matching while Wen turns blocks faceup; background: covered ink pad, small lamp.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Bao matches abstract raised shapes and returns clay blocks to their own tray squares.',
    },
    {
      text: 'Bao reused the same block once more. Tap—the familiar impression returned. “Pick, press, put it back,” she said, sliding it home. Her tidy tray had solved the printshop problem. Reusable pieces were useful only when everyone could find them again.',
      scene: {
        id: 'the-ten-thousand-little-blocks-p6',
        focus: 'Bao smiling beside the restored tray',
        composition:
          'Foreground: reused block in home square, new matching impression; midground: Bao smiling beside the restored tray; background: Wen stacking paper, first stars.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Bao smiles beside the restored tray after the same block makes another matching impression.',
    },
    {
      text: 'At deep night, every clay block rested in its square. The ink pad was covered, and the clean paper lay flat. Wen closed the shutters and dimmed the lamp. Bao slept behind a folding screen while moonlight crossed the orderly tray like a silver path. Nothing was lost; nothing needed finding. Goodnight.',
      scene: {
        id: 'the-ten-thousand-little-blocks-p7',
        focus: 'Bao asleep behind a folding screen',
        composition:
          'Foreground: orderly type tray, covered ink pad, flat clean paper; midground: Bao asleep behind a folding screen; background: crescent moon, three square pools of light.',
        palette: 'ink blue, baked-clay orange, paper cream, celadon, and moon silver',
      },
      alt: 'Bao sleeps while every clay block rests in its square under a silver path of moonlight.',
    },
  ],
};
