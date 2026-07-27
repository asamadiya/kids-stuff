import type { Story } from '../types';

export const pulleyUponPulley: Story = {
  slug: 'pulley-upon-pulley',
  title: 'Pulley Upon Pulley',
  subtitle: 'Long ago in Syracuse, a clever man named Archimedes looped rope through wheels.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Round the wheels, easy pull',
  readAloudMinutes: 9,
  learningTakeaway:
    'A rope looped through several pulley wheels shares one heavy load across many rope sections. The more sections you thread, the lighter each part feels, so a small pull can raise a big weight.',
  heartTakeaway:
    'Careful thinking can be stronger than rushing or straining. Looking closely at a problem, and sharing the idea kindly, often helps more than pulling harder.',
  grownUpFact:
    'Archimedes lived in the Greek city of Syracuse, on the island of Sicily, from about 287 to 212 BCE, in the time of King Hieron the Second. Ancient writers such as Plutarch tell a famous tale that he moved a heavy, loaded ship almost by himself using a compound pulley: many grooved wheels and one long rope. The dramatic public staging is best shared as a gentle old story rather than eyewitness fact. But the physics is real. Looping one rope through several wheels shares a load across many rope sections, and the pulling force drops by roughly the number of sections. This trick of sharing a load is still used today in cranes, sailboats, window blinds, and flagpoles.',
  pages: [
    {
      text: 'Long ago, beside the bright blue sea, stood the city of Syracuse. It sat on a sunny island called Sicily. In that city lived a clever, kind man named Archimedes. He loved wheels, ropes, and gentle puzzles. King Hieron ruled the city and often asked him hard questions. On his workshop board, small circles spiraled around a ship. He hummed softly, "Round the wheels, easy pull."',
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
      text: 'One day the king had a puzzle. A great new ship rested by the dock, far too heavy to move. Many strong sailors had heaved and grunted in vain. "Can one person move it?" the king wondered aloud. Archimedes smiled and said he would try a clever way. He did not plan to pull harder. He planned to pull smarter, with wheels.',
      cue: 'Wonder together: how could just one person move a whole ship?',
      scene: {
        id: 'pulley-upon-pulley-p2-the-challenge',
        focus: 'King Hieron gesturing at a huge beached ship while Archimedes considers it',
        composition:
          'foreground: tired sailors resting near thick mooring ropes; midground: King Hieron pointing, Archimedes calm with a hand on his chin; background: an enormous wooden ship braced at the busy dock',
        palette: 'warm ochre, sea blue, and bright noon gold',
      },
      alt: 'King Hieron points at a huge beached ship while weary sailors rest and Archimedes thinks calmly about the challenge.',
    },
    {
      text: 'First Archimedes showed the king a tiny secret. He hung one small wheel and looped a rope over it. Pull down on one side, and the other side lifts up. "A wheel just turns the direction," he explained kindly. "But add more wheels, and each one shares the weight." The king leaned in close. A big idea was beginning to grow.',
      scene: {
        id: 'pulley-upon-pulley-p3-one-wheel',
        focus: 'Archimedes demonstrating a single pulley wheel lifting a small basket',
        composition:
          'foreground: a small basket rising on a rope over one grooved wheel; midground: Archimedes pointing, the king watching closely; background: sunlit workshop shelves of tools and coiled cord',
        palette: 'warm ochre, pale limestone, and honey gold',
      },
      alt: 'Archimedes lifts a small basket with a single pulley wheel while King Hieron leans in to watch the simple trick.',
      cue: 'Make a hook with one finger and loop your other hand over it, like a wheel.',
    },
    {
      text: 'Now for the big ship, Archimedes needed more wheels. He threaded one long rope down through a wheel, then up through another wheel. Down and up it went again, making long, smooth loops. Four grooved wheels waited in a neat, quiet stack. Each loop of rope would carry a little piece of the load. Together, four sections would do a giant job.',
      scene: {
        id: 'pulley-upon-pulley-p4-rope-path',
        focus: 'Archimedes threading one rope through stacked pulley wheels',
        composition:
          'foreground: rope tail and four grooved wheel rims; midground: Archimedes threading a single rope through the blocks; background: a great wooden ship braced by the dock',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'Archimedes threads a single rope through four grooved pulley wheels while a large ship rests braced at the dock.',
      cue: 'Draw a slow down-up-down-up path in the air with one finger.',
    },
    {
      text: 'When every knot was checked, Archimedes took the free rope. "Round the wheels, easy pull," he said softly. He leaned back, slow and calm. The rope whispered through the grooves. Then the huge ship began to slide, gentle as a cloud. Four rope sections shared the pull, so his one hand felt light. A mighty thing had started to move.',
      scene: {
        id: 'pulley-upon-pulley-p5-first-lift',
        focus: 'Archimedes pulling one-handed as the great ship begins to glide',
        composition:
          'foreground: the free rope tail curving toward his hand; midground: Archimedes leaning back with one hand; background: the ship easing forward beside the braced dock',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'Archimedes leans back and pulls the rope with one hand while the great ship glides gently forward.',
      cue: 'Hold one hand like a soft pulling hand, then let it relax.',
    },
    {
      text: 'The watching sailors gasped and cheered in wonder. "How can this be?" they whispered to each other. The secret was hidden in the counting, not the muscle. To move the ship a short way, the rope traveled far. Archimedes traded a long, gentle pull for a heavy, hard one. That fair trade is the quiet magic inside every pulley.',
      scene: {
        id: 'pulley-upon-pulley-p6-crowd-wonder',
        focus: 'sailors and townsfolk marveling as the ship inches along',
        composition:
          'foreground: a long tail of rope sliding steadily through the hands; midground: a crowd of sailors gasping and pointing; background: the great ship creeping forward past the sunlit quay',
        palette: 'amber, warm rose, and glinting sea silver',
      },
      alt: 'A crowd of sailors gasps and points as Archimedes trades a long gentle pull to slide the enormous ship along the quay.',
    },
    {
      text: 'Then the rope jerked and stopped short. One loop had crossed over another loop. Archimedes did not tug and did not fret. He stilled his hand at once and looked closely. His eyes moved from the smooth spiral on his board to the tangled wheels. Something in the rope path was no longer neat, and rushing would only make it worse.',
      scene: {
        id: 'pulley-upon-pulley-p7-crossed-rope',
        focus: 'a crossed rope stopped between two pulley blocks',
        composition:
          'foreground: slack rope tail resting still; midground: two crossed loops between the blocks, Archimedes pausing; background: the spiral board glowing softly behind him',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'Archimedes holds the rope still and studies a single crossed loop tangled between two pulley blocks.',
    },
    {
      text: 'Archimedes pointed gently to the crossing. "That loop went round the wrong wheel," he murmured. He loosened the slack and threaded it back the proper way. The ship stayed still and safe the whole time. He whispered his little tune again to steady himself. His careful eyes had helped far more than a hard yank could. Slow looking had solved the snag.',
      scene: {
        id: 'pulley-upon-pulley-p8-rethread',
        focus: 'Archimedes rethreading the corrected loop through the proper wheel',
        composition:
          'foreground: an open pulley block and a slack loop; midground: Archimedes pointing, then rethreading the rope; background: the motionless, braced ship',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'Archimedes points to the corrected path and threads the slack loop through the proper wheel while the ship rests still.',
      cue: 'When something gets stuck, try Archimedes way: stop, look, then fix it gently.',
    },
    {
      text: 'He checked the wheels once more, calm and sure. Then he leaned back with one hand, and the great ship glided smoothly again. The rope made a soft zzzip through four grooves. "Round the wheels, easy pull." Archimedes counted the loops, not his own strength. Working smart had made the huge ship feel willing and light.',
      scene: {
        id: 'pulley-upon-pulley-p9-easy-pull',
        focus: 'a smooth one-hand pull gliding the ship after the fix',
        composition:
          'foreground: four taut rope sections stretched clean and straight; midground: Archimedes pulling steadily, holding up four fingers; background: the ship easing forward under a moonrise sky',
        palette: 'indigo, silver-blue, and soft clay',
      },
      alt: 'Archimedes moves the great ship smoothly with one hand while holding up four fingers to count the rope loops.',
    },
    {
      text: 'The king clapped and asked how the trick could be used. Archimedes had many bright answers ready. Sailors could raise a heavy sail with the very same wheels. Builders could hoist great stones to the top of a wall. Wells could bring up cool water with one small tug. One good idea, shared kindly, could help a whole city.',
      scene: {
        id: 'pulley-upon-pulley-p10-uses',
        focus: 'imagined uses of pulleys floating around Archimedes and the king',
        composition:
          'foreground: Archimedes and the king talking warmly; midground: soft dreamlike images of a sail, a stone crane, and a water well; background: the harbor and city rooftops in evening light',
        palette: 'twilight violet, lamp gold, and dusky blue',
      },
      alt: 'Archimedes tells the king how the same pulleys could raise sails, hoist stones, and lift well water for the whole city.',
      cue: 'Look around your home for a pulley: window blinds, a flagpole, or a clothesline.',
    },
    {
      text: 'That is why people still tell this old tale today. The dramatic day may be part legend, gently grown over time. But the wheels are real, and the sharing of the load is true. Cranes, sailboats, and window blinds all use looped rope now. Every time a small pull raises something big, Archimedes idea is quietly at work. His thinking still lifts the world.',
      scene: {
        id: 'pulley-upon-pulley-p11-legacy',
        focus: 'a modern-feeling montage of pulleys echoing the ancient one',
        composition:
          'foreground: a coil of rope through grooved wheels; midground: gentle silhouettes of a crane, a sailboat, and a raised flag; background: the timeless Syracuse harbor under a wide sky',
        palette: 'warm gold, deep teal, and soft dusk rose',
      },
      alt: 'Grooved pulley wheels echo across a crane, a sailboat, and a raised flag, showing how Archimedes idea still lifts things today.',
    },
    {
      text: 'When the ship was tied safe for the night, Archimedes hung the pulley blocks on a low peg. He coiled the long rope into a soft, round nest. The workshop board went dark and quiet. Wheels, rope, ship, and busy hands were all resting now. "Round the wheels, easy pull," he yawned. The warm harbor breathed against the stones. Goodnight, clever Archimedes.',
      scene: {
        id: 'pulley-upon-pulley-p12-resting-blocks',
        focus: 'coiled rope and resting pulley blocks beneath a dark workshop board',
        composition:
          'foreground: a round coil of rope in soft shadow; midground: Archimedes seated calmly, two pulley blocks hanging on a peg; background: a dark radial board and the moonlit harbor edge',
        palette: 'deep navy, moon silver, and quiet umber',
      },
      alt: 'Archimedes sits beside a round coil of rope while two pulley blocks hang quietly on a peg under a moonlit harbor.',
    },
  ],
};
