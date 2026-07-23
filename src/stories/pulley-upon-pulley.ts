import type { Story } from '../types';

export const pulleyUponPulley: Story = {
  slug: 'pulley-upon-pulley',
  title: 'Pulley Upon Pulley',
  subtitle: 'Long ago in Syracuse, a clever man named Archimedes looped rope through wheels.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Round the wheels, easy pull',
  readAloudMinutes: 5,
  learningTakeaway:
    'A rope looped through several pulley wheels can make a heavy load easier to move. Each wheel shares the work, so one gentle pull can lift what feels far too big.',
  heartTakeaway:
    'Careful thinking can be stronger than rushing or straining. Looking closely at a problem often helps more than pulling harder.',
  grownUpFact:
    'Archimedes lived in the Greek city of Syracuse, on the island of Sicily, from about 287 to 212 BCE. Ancient writers like Plutarch tell a famous tale that he moved a heavy ship almost by himself using a compound pulley, a set of wheels and rope. It is best shared as a gentle old story rather than an eyewitness fact. The real idea is true: looping one rope through several grooved wheels shares a load across many rope sections, so a small pull can raise a big weight.',
  pages: [
    {
      text: 'Long ago, beside the bright blue sea, stood the city of Syracuse. It sat on a sunny island called Sicily. In that city lived a clever, kind man named Archimedes. He loved wheels, ropes, and gentle puzzles. On his workshop board, small circles spiraled around a ship. He hummed softly to himself, "Round the wheels, easy pull."',
      cue: 'Trace a slow spiral in the air with one finger, round and round.',
      scene: {
        id: 'pulley-upon-pulley-p1-workshop-board',
        focus: 'Archimedes seated before a radial workshop board with two pulley blocks',
        composition:
          'foreground: two grooved pulley blocks and coiled rope; midground: Archimedes centered, a spiral-and-ship workshop board; background: Syracuse rooftops and a calm harbor at golden hour',
        palette: 'warm ochre, pale limestone, and late-sun gold',
      },
      alt: 'Archimedes studies two grooved pulley blocks beneath a spiral workshop board while the calm Syracuse harbor waits outside.',
    },
    {
      text: 'People said a great ship rested by the dock, far too heavy to move. Archimedes did not pull harder. Instead he threaded one long rope down through a wheel, then up through another wheel. Down and up it went again, making long, smooth loops. Four grooved wheels waited in a neat, quiet stack.',
      scene: {
        id: 'pulley-upon-pulley-p2-rope-path',
        focus: 'Archimedes threading one rope through stacked pulley wheels',
        composition:
          'foreground: rope tail and four grooved wheel rims; midground: Archimedes threading a single rope through the blocks; background: a great wooden ship braced by the dock',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'Archimedes threads a single rope through four grooved pulley wheels while a large ship rests braced at the dock.',
      cue: 'Draw a slow down-up-down-up path in the air with one finger.',
    },
    {
      text: 'When every knot was checked, Archimedes took the free rope in one hand. "Round the wheels, easy pull," he said softly. He leaned back, slow and calm. The rope whispered through the grooves. Then the huge ship began to slide, gentle as a cloud. One kind hand had started to move a mighty thing.',
      scene: {
        id: 'pulley-upon-pulley-p3-first-lift',
        focus: 'Archimedes pulling one-handed as the great ship begins to glide',
        composition:
          'foreground: the free rope tail curving toward his hand; midground: Archimedes leaning back with one hand; background: the ship easing forward beside the braced dock',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'Archimedes leans back and pulls the rope with one hand while the great ship glides gently forward.',
      cue: 'Hold one hand like a soft pulling hand, then let it relax.',
    },
    {
      text: 'Then the rope jerked and stopped short. One loop had crossed over another loop. Archimedes did not tug and did not fret. He stilled his hand at once and looked closely. His eyes moved from the smooth spiral on his board to the tangled wheels. Something in the rope path was no longer neat.',
      scene: {
        id: 'pulley-upon-pulley-p4-crossed-rope',
        focus: 'a crossed rope stopped between two pulley blocks',
        composition:
          'foreground: slack rope tail resting still; midground: two crossed loops between the blocks, Archimedes pausing; background: the spiral board glowing softly behind him',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'Archimedes holds the rope still and studies a single crossed loop tangled between two pulley blocks.',
    },
    {
      text: 'Archimedes pointed gently to the crossing. "That loop went round the wrong wheel," he murmured. He loosened the slack and threaded it back the proper way. The ship stayed still and safe the whole time. "Round the wheels, easy pull," he reminded himself. His careful eyes had helped far more than a hard yank could.',
      scene: {
        id: 'pulley-upon-pulley-p5-rethread',
        focus: 'Archimedes rethreading the corrected loop through the proper wheel',
        composition:
          'foreground: an open pulley block and a slack loop; midground: Archimedes pointing, then rethreading the rope; background: the motionless, braced ship',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'Archimedes points to the corrected path and threads the slack loop through the proper wheel while the ship rests still.',
    },
    {
      text: 'He checked the wheels once more, calm and sure. Then he leaned back with one hand, and the great ship glided smoothly again. The rope made a soft zzzip through four grooves. "Round the wheels, easy pull." Archimedes counted the loops, not his own strength. Working smart had made the huge ship feel willing and light.',
      scene: {
        id: 'pulley-upon-pulley-p6-easy-pull',
        focus: 'a smooth one-hand pull gliding the ship after the fix',
        composition:
          'foreground: four taut rope sections stretched clean and straight; midground: Archimedes pulling steadily, holding up four fingers; background: the ship easing forward under a moonrise sky',
        palette: 'indigo, silver-blue, and soft clay',
      },
      alt: 'Archimedes moves the great ship smoothly with one hand while holding up four fingers to count the rope loops.',
    },
    {
      text: 'When the ship was tied safe for the night, Archimedes hung the pulley blocks on a low peg. He coiled the long rope into a soft, round nest. The workshop board went dark and quiet. Wheels, rope, ship, and busy hands were all resting now. The warm harbor breathed against the stones. Goodnight, clever Archimedes.',
      scene: {
        id: 'pulley-upon-pulley-p7-resting-blocks',
        focus: 'coiled rope and resting pulley blocks beneath a dark workshop board',
        composition:
          'foreground: a round coil of rope in soft shadow; midground: Archimedes seated calmly, two pulley blocks hanging on a peg; background: a dark radial board and the moonlit harbor edge',
        palette: 'deep navy, moon silver, and quiet umber',
      },
      alt: 'Archimedes sits beside a round coil of rope while two pulley blocks hang quietly on a peg under a moonlit harbor.',
    },
  ],
};
