import type { Story } from '../types';

export const theBeadsThatFlyOnTheFrame: Story = {
  slug: 'the-beads-that-fly-on-the-frame',
  title: 'The Beads That Fly on the Frame',
  subtitle: 'Long ago in Han China, reckoners counted with little rods laid in columns.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'One column at a time',
  readAloudMinutes: 9,
  learningTakeaway:
    'On a Chinese counting board, small rods were laid in columns. The rightmost column meant ones, the next meant tens, and the next meant hundreds. The same little rod could mean one, or ten, or a hundred, depending on which column it rested in. That idea is called place value. An empty column with no rod at all simply meant zero of that amount, which is how the board quietly held the number nothing.',
  heartTakeaway:
    'Quick hands work best when you slow down just enough to check where each thing truly belongs.',
  grownUpFact:
    'This is a gentle telling of a real practice, not one named inventor. By around 150 BCE, in China’s Han dynasty, people calculated with counting rods (算筹, suan chou) made of bamboo, wood, bone, or ivory, laid on a board in place-value columns — ones, tens, hundreds — with an empty column standing for zero. To tell neighboring columns apart, rod numbers alternated between upright and sideways shapes by column. Later texts describe red rods for positive amounts and black rods for negatives, though how standard this was in Han times is debated. With rods, reckoners did real work: trade, taxes, calendars, and the mathematics in the classic Nine Chapters on the Mathematical Art. The bead abacus (suanpan) that many picture came much later, well documented only by Ming times (around 1592 CE), so the child here uses rods, not flying beads.',
  pages: [
    {
      text: 'Long ago in China, in the time called the Han, people counted with little rods. This is a gentle tale of that real craft. In a busy market town, a shopkeeper’s child watched a wooden counting board. Straight rods lay in tidy columns, made of smooth bamboo and pale bone. The rightmost column meant ones. The next meant tens. The next meant hundreds. A grandmother, once the town’s best reckoner, touched the board softly. “One column at a time,” she said.',
      cue: 'Hold up one finger. Can you point to where the ones, tens, and hundreds might live?',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p1',
        focus: 'a child beside a wooden Han-dynasty counting board with three rod columns',
        composition:
          'Foreground: a low wooden counting board with small bamboo and bone rods laid in three tidy columns; midground: a curious child and a kind grandmother leaning in together; background: a lively Han-era market lane under warm golden light',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'A child and a grandmother lean over a wooden counting board with small rods laid in three columns.',
    },
    {
      text: '“Why little sticks?” the child asked, turning one rod in the light. Grandmother smiled and spread the whole handful out. “These rods are our numbers,” she said gently. “Bamboo, wood, bone, even ivory, cut all the same size.” Merchants used them to count coins and grain. Officials used them for taxes and for the days of the year. “A good reckoner and a bag of rods,” she said, “can figure almost anything.”',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p2',
        focus: 'grandmother spreading a handful of identical counting rods before the curious child',
        composition:
          'Foreground: a spilled handful of identical small rods fanned across the board, some bamboo-gold and some pale bone; midground: grandmother gesturing warmly while the child inspects one rod; background: a market stall of grain sacks and coin strings',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'A grandmother fans out a handful of identical small rods while a child studies one closely.',
    },
    {
      text: 'The child laid three small rods in the ones column to count three. Then one rod went into the tens column, for one group of ten. The hundreds column stayed empty and still. Grandmother nodded. “Here is the secret,” she whispered. “A rod is not a number by itself.” The very same rod meant one here, or ten there, or a hundred farther left. Where it rested gave it its size. Grown-ups call this clever idea place value.',
      cue: 'Lay three fingers in one pretend column, then one finger in the next column over.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p3',
        focus: 'three rods in the ones column and one rod in the tens column, hundreds empty',
        composition:
          'Foreground: three small rods grouped in the ones column and a single rod in the tens column while the hundreds column rests empty; midground: the child with both hands raised like gentle gates; background: a soft market afternoon',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'Three rods rest in the ones column and one rod in the tens column, with the hundreds column left empty.',
    },
    {
      text: 'Grandmother set three loose pebbles beside one tied bundle of ten straws. The child matched the pebbles with three rods, and the bundle with one tens-rod. “One column at a time.” The rods looked alike, yet their columns gave them different jobs. Three ones and one ten meant thirteen, the child realized, grinning. The board could hold any number this way, big or small. It only needed the right rods in the right homes.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p4',
        focus: 'three pebbles and one tied bundle matched to rods in two columns',
        composition:
          'Foreground: three loose pebbles and one tied bundle of ten straws sitting beside matching rods in the ones and tens columns; midground: grandmother pointing gently while the child grins; background: a warm afternoon shop',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'Three pebbles and one tied bundle sit beside rods placed in the ones and tens columns.',
    },
    {
      text: 'Then Grandmother showed a puzzle. She laid rods for a one, then a bare gap, then a one. “Read it,” she said. The child looked hard at the empty middle column. “That column has no rods,” Grandmother said kindly. “The gap is not nothing forgotten. The gap means zero of the tens.” So the board showed one hundred and one, not eleven. An empty column, holding nothing, still did an important job.',
      cue: 'What number is one hundred, a zero, and one more? Say it out loud together.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p5',
        focus: 'rods in the hundreds and ones columns with a deliberately empty tens column between',
        composition:
          'Foreground: a single rod in the hundreds column and a single rod in the ones column, the tens column pointedly empty; midground: grandmother tapping the empty gap while the child studies it; background: a quiet shop interior',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'A rod sits in the hundreds column and one in the ones column, with the tens column left empty for zero.',
    },
    {
      text: 'Grandmother taught one more trick to keep columns clear. In one column the rods stood upright, like tiny soldiers. In the next column the same count lay sideways, resting flat. Upright, then sideways, then upright again, all along the board. That way, a busy reckoner never muddled one column with its neighbor. “The rods take turns standing and lying down,” she said. The child made a row of them, tall, flat, tall, and laughed.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p6',
        focus: 'alternating upright and sideways rod digits marching across the counting board',
        composition:
          'Foreground: one column of rods standing upright and the next lying flat, alternating tall and sideways across the board; midground: the child arranging them in a tidy marching row; background: warm lamplight on wooden shelves',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'Rods stand upright in one column and lie flat in the next, alternating across the counting board.',
    },
    {
      text: 'A merchant hurried in with a real question to solve. He needed to add two baskets of coins, quickly. Grandmother built the first count in rods, right to left. Then she added the second, column by careful column. When one column filled past nine, she traded ten of them upward. Ten small rods became one rod in the next column left. Her hands moved fast, but her eyes checked each home. The answer stood ready before the merchant finished his tea.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p7',
        focus: 'grandmother adding two coin counts on the board, carrying ten into the next column',
        composition:
          'Foreground: two rows of rods being combined, with ten rods in one column trading up to a single rod on the left; midground: grandmother’s quick sure hands and a waiting merchant with a teacup; background: a bustling shop doorway',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'A grandmother adds two counts of rods, trading ten rods in one column for one rod in the next.',
    },
    {
      text: 'The child wanted to be fast like Grandmother, so hands flew. A sleeve brushed one rod into the hundreds column by mistake. Now the board showed a number far larger than the real coins. The child paused and grew very still. Fast fingers could not undo a rod dropped in the wrong home. “Slow is smooth,” Grandmother said, “and smooth is truly fast.” Every rod went back to rest, and the count was built again with care.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p8',
        focus: 'one stray rod in the hundreds column beside the correct smaller count',
        composition:
          'Foreground: a single stray rod resting in the hundreds column beside the small real groups of rods; midground: the child pausing, hands still, calm and thoughtful; background: a soft shop interior',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'One stray rod sits in the hundreds column beside a small, correct group of rods.',
    },
    {
      text: 'Grandmother reached into a small pouch of darker rods. “Some reckoners keep two colors,” she said. “Bright rods for what you have, dark rods for what you owe.” A coin gained and a coin owed could sit on one board together. Later book-keepers wrote of red rods and black rods just so. The child pressed a bright rod and a dark rod side by side. Even having and owing found their proper columns. “One column at a time.”',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p9',
        focus: 'bright and dark rods on the board showing amounts owned and owed',
        composition:
          'Foreground: bright bamboo rods for coins owned and darker rods for coins owed, resting in matching columns; midground: grandmother opening a small pouch while the child compares two rods; background: a warm shelf of ledgers and jars',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'Bright rods and darker rods rest in matching columns, showing coins owned and coins owed.',
    },
    {
      text: 'Now try it yourself, the child thought, and cleared the whole board. Three pebbles in one hand, a bundle of ten in the other. Down went three rods in the ones, and one rod in the tens. The hundreds column, they left empty for zero. Right to left they read it, slow and sure: thirteen. Each rod had come home to its proper column. The pattern of rods matched the pile of real things exactly.',
      cue: 'Grab pebbles and a bundle. Build a number in pretend columns, then read it right to left.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p10',
        focus: 'the child independently building thirteen in rods with an empty hundreds column',
        composition:
          'Foreground: three rods in the ones column, one rod in the tens column, and an empty hundreds column standing for zero; midground: the child working alone and proud, grandmother watching; background: a gentle evening shop',
        palette: 'lacquer red, jade green, bamboo gold, ink blue, and moon white',
      },
      alt: 'The child builds three rods in the ones and one in the tens, with an empty hundreds column meaning zero.',
    },
    {
      text: 'From these little rods grew mighty things, Grandmother said. Reckoners measured fields and shared out grain with them. They planned canals, counted armies of workers, and set the calendar year. A great old book, the Nine Chapters, held their cleverest number tricks. Whole clever ideas lived in rows of humble sticks. The child looked at the plain bamboo rods with new respect. Such small tools, and such enormous work.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p11',
        focus: 'imagined visions of fields, canals, and calendars rising from the small rods',
        composition:
          'Foreground: the humble rods on the board catching lamplight; midground: soft dreamlike shapes of measured fields, a canal, and a calendar wheel rising above; background: rooftops of the Han town under a deepening sky',
        palette: 'twilight violet, warm lamp-gold, bamboo gold, and dusky blue',
      },
      alt: 'The small rods glow as dreamlike fields, a canal, and a calendar rise imagined above the counting board.',
    },
    {
      text: 'Grandmother told one last thing, and the child’s eyes went wide. “One day,” she said, “someone will string beads on a frame instead.” Beads that slide and click, and seem to fly along their rows. That counting frame, the suanpan, would come many years later. But the idea inside it would be this very same one. Ones, tens, and hundreds, each bead in its column. The flying beads would only borrow what the quiet rods already knew.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p12',
        focus: 'grandmother imagining a future bead-frame abacus beside the present rods',
        composition:
          'Foreground: the counting board of rods in the present; midground: a soft, dreamlike bead abacus glowing just behind it, beads mid-slide; background: a warm evening market fading into starlight',
        palette: 'twilight violet, lacquer red, bamboo gold, and soft starlit blue',
      },
      alt: 'Beside the present board of rods, a dreamlike bead abacus glows with beads sliding along a frame.',
    },
    {
      text: 'At closing time, every rod was gathered and tied in a soft cloth. “One column at a time,” the child whispered, sleepy and proud. Tomorrow they would count again, ones and tens and hundreds. Now the counting board rested quiet in the dark. The bright rods and dark rods lay still, their work all done. Outside, the last market lanterns dimmed to a warm glow. Goodnight, little reckoner.',
      scene: {
        id: 'the-beads-that-fly-on-the-frame-p13',
        focus: 'the sleepy child beside a tidy, cloth-wrapped counting board at rest',
        composition:
          'Foreground: a folded cloth over gathered rods and a still counting board; midground: the child snug and drowsy on a warm mat; background: a calm deep-night market with fading lanterns and a soft moon',
        palette: 'cool moonlit blues and silver with a soft warm nightlight glow',
      },
      alt: 'A child rests snug on a mat beside a cloth-wrapped counting board with all its rods tied and still.',
    },
  ],
};
