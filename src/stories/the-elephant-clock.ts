import type { Story } from '../types';

export const theElephantClock: Story = {
  slug: 'the-elephant-clock',
  title: 'The Elephant Clock',
  subtitle: 'Long ago in Diyarbakir, a clever maker named al-Jazari built a marvelous water-powered elephant clock.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Drop, chirp, turn—time shows',
  readAloudMinutes: 9,
  learningTakeaway:
    'A clock can mark passing time by repeating the same visible and audible steps, over and over. Al-Jazari used sinking water to pull hidden cords and pulleys, so a ball dropped, a bird chirped, and figures turned in the same order every half hour, then reset to begin again.',
  heartTakeaway:
    'Wonder grows when you slow down, wait, and truly watch each small part of a bigger sequence unfold.',
  grownUpFact:
    'Ismail al-Jazari (c. 1136–1206) was chief engineer for the Artuqid rulers of Diyarbakir (Amid), in what is now southeastern Turkey. Around 1206 he finished his Book of Knowledge of Ingenious Mechanical Devices, describing about fifty machines. The elephant clock hid a bowl with a tiny hole floating in a water tank inside the elephant. Over about half an hour the bowl slowly filled and sank, pulling cords and pulleys so a ball dropped through a dragon, a bird chirped, a scribe’s pen moved, and a small figure turned. It cleverly gathered art from many lands: an Indian elephant, Chinese dragons, an Egyptian-and-Greek water idea, a Persian carpet, and an Arabic phoenix — a whole world in one wonderful machine.',
  pages: [
    {
      text: 'Long ago, in the walled city of Diyarbakir, lived a clever maker named al-Jazari. He built marvelous machines for the ruler’s court. He loved gears, water, cords, and wheels. His grandest work stood in a cool stone hall. It was a clock shaped like a great gray elephant. A little tower rose from its broad back. A bird perched at the top, and two dragons curved below. This is the tale of a curious child who came to watch it work.',
      cue: 'Look up at the tall elephant clock. Can you spot the little bird waiting at the very top?',
      scene: {
        id: 'the-elephant-clock-p1-hall',
        focus: 'a child beneath al-Jazari’s tall elephant water-clock in a stone hall',
        composition:
          'Foreground: the painted elephant clock base and a tray of bright balls; midground: a small child looking upward while al-Jazari stands beside the mechanism; background: an arched Diyarbakir hall with the bird-and-dragon tower rising above',
        palette: 'turquoise, brass, elephant gray, warm red and soft sandstone',
      },
      alt: 'A child and a maker stand beneath a tall elephant clock topped with a bird and two curving dragons.',
    },
    {
      text: 'Al-Jazari knelt beside the child and smiled warmly. “This clock holds a whole world,” he said. “The great elephant comes from faraway India. The two dragons curl the way Chinese dragons do. The soft carpet under our feet is Persian. The water idea is very old, from Egypt and Greece.” The child’s eyes went wide and round. So many far lands, gathered into one gray elephant! “How does it tell the time?” the child asked.',
      cue: 'Count the faraway places in the clock: India, China, Persia, Egypt, Greece. That is five whole lands!',
      scene: {
        id: 'the-elephant-clock-p1-many-lands',
        focus: 'al-Jazari pointing out the elephant, dragons, and carpet from many lands',
        composition:
          'Foreground: a patterned Persian carpet and the elephant’s painted feet; midground: al-Jazari gesturing from dragon to elephant while the child listens; background: the tower with the perched bird and a scribe figure below',
        palette: 'ruby carpet red, brass, jade dragon green and warm sandstone',
      },
      alt: 'A kneeling maker points to the elephant, dragons, and carpet while a wide-eyed child listens closely.',
    },
    {
      text: '“Come, I will show you the secret,” al-Jazari whispered. He pointed to the elephant’s round belly. “Inside is a deep tank full of water. A little bowl floats on top, and it has one tiny hole. Water sneaks in, drip by drip, very slowly.” He cupped his hands like a small bowl. “As the water fills it, the bowl grows heavy. Slowly, ever so slowly, it begins to sink.” The child pictured the bowl, sinking in the dark.',
      cue: 'Cup your hands like a little bowl. Pretend slow water is filling it, drip by tiny drip.',
      scene: {
        id: 'the-elephant-clock-p1-hidden-bowl',
        focus: 'al-Jazari showing how a holed bowl slowly fills and sinks inside the elephant',
        composition:
          'Foreground: al-Jazari’s cupped hands miming a bowl; midground: a cut-away hint of the water tank inside the elephant’s belly with a small floating bowl; background: the tower and the child leaning in to imagine it',
        palette: 'deep water blue, brass, elephant gray and soft candle gold',
      },
      alt: 'A maker cups his hands to show a small holed bowl filling with water inside the elephant’s belly.',
    },
    {
      text: 'Bright balls waited in a tray, high on the tower. The bird held its beak closed and quiet. A little scribe sat with a pen, ready to mark the time. A small figure faced away from a silver bell. “Watch, but do not touch,” al-Jazari said gently. “The clock must move by itself.” The child clasped both hands safely behind their back. Then they waited, and waited, and watched the still and silent tower.',
      cue: 'Hold very still for one slow breath. What tiny change can you notice while you patiently wait?',
      scene: {
        id: 'the-elephant-clock-p1-resting',
        focus: 'the balls, bird, scribe, and bell resting in their starting positions',
        composition:
          'Foreground: bright balls waiting in a brass tray; midground: the closed-beak bird, the seated scribe with a pen, and the figure turned from the bell; background: al-Jazari and the child watching, hands behind back',
        palette: 'brass, shadowed gray, muted turquoise and warm coral',
      },
      alt: 'Balls, a closed-beak bird, a scribe with a pen, and a figure by a bell all rest quietly on the tower.',
    },
    {
      text: 'Deep inside the elephant, the little bowl grew full at last. Down it sank, and a hidden cord pulled tight. The cord ran over a small wheel called a pulley. Up on the tower, everything woke at once. Clink! One ball rolled free and slid down a curving chute. It dropped straight into a dragon’s open mouth. The child gasped and squeezed their hands together. Something wonderful was finally, truly beginning to happen.',
      scene: {
        id: 'the-elephant-clock-p1-bowl-sinks',
        focus: 'the sinking bowl pulling a cord over a pulley to release the first ball',
        composition:
          'Foreground: a taut cord looping over a small pulley wheel; midground: a single ball rolling down a chute toward a dragon’s open mouth; background: the child gasping while al-Jazari smiles knowingly',
        palette: 'brass gold, deep blue, jade dragon green and warm coral',
      },
      alt: 'A cord over a pulley pulls tight as the first ball rolls down a chute toward a dragon’s open mouth.',
    },
    {
      text: 'The dragon tipped its head and swallowed the ball. Down its long neck the ball rolled, click-click-click. Chirrup! The wooden bird sang a small, bright note. The little scribe’s pen swung to mark the passing time. The last figure turned and struck the silver bell — ting! “Drop, chirp, turn—time shows!” al-Jazari said. The child laughed out loud with pure delight. Each part had moved in its own perfect turn.',
      scene: {
        id: 'the-elephant-clock-p1-sequence',
        focus: 'the ball rolling through the dragon while bird, scribe, and figure move in turn',
        composition:
          'Foreground: the ball sliding down the curving dragon neck; midground: the bird with an open beak, the scribe’s pen moving, the figure striking a bell; background: the child clapping once as al-Jazari smiles',
        palette: 'brass gold, lapis blue, jade green and glowing coral',
      },
      alt: 'A ball rolls through a dragon as the bird chirps, the scribe writes, and a figure rings a silver bell.',
    },
    {
      text: '“Why does it go in that same order?” the child wondered aloud. Al-Jazari traced the path with one finger. “The heavy bowl is the start of everything,” he said. “It pulls the cord, the cord lifts a lever, and the lever lets the ball go.” One small sinking bowl set off the whole parade. Drop led to chirp, and chirp led to turn. Like friends crossing a narrow bridge, they went one by one.',
      cue: 'Trace the order with a finger: bowl sinks, ball drops, bird chirps, figure turns. First to last!',
      scene: {
        id: 'the-elephant-clock-p1-order',
        focus: 'al-Jazari tracing how the sinking bowl, cord, and lever release the ball',
        composition:
          'Foreground: al-Jazari’s finger following a cord to a small tilting lever; midground: the child mirroring the path with their own finger; background: the reset tray and the waiting bird above',
        palette: 'sandstone, dark teal, brass and low coral',
      },
      alt: 'A maker traces a cord to a small lever while a child follows the same path with a pointing finger.',
    },
    {
      text: 'The child wanted the marvel again, right away. They whispered the words twice, then three eager times. Still the bird waited, and the dragon stayed quite still. “Please, can we shake it a little?” the child asked. Al-Jazari shook his head kindly and softly. “The water cannot be hurried, small one,” he said. “Deep inside, an empty bowl is floating up again. A good clock always keeps its own steady time.”',
      scene: {
        id: 'the-elephant-clock-p1-waiting',
        focus: 'the child asking to hurry the clock while the empty bowl resets',
        composition:
          'Foreground: the child’s eager folded hands and the empty ball slot; midground: al-Jazari raising a gentle, patient hand; background: a cut-away hint of the bowl floating back up inside the elephant',
        palette: 'muted brass, plum shadow, turquoise and quiet gray',
      },
      alt: 'A child asks to shake the clock while the maker gently signals to wait for the bowl to rise.',
    },
    {
      text: 'So the child sat on a soft cushion to wait. This time, they did not ask “when” at all. They simply watched the still tower and breathed slowly. The scribe’s pen had crept a little along its scale. Half an hour had quietly slipped away, unseen. Inside the elephant, water was dripping, drip by drip. The empty bowl floated high, then began once more to sink, lower and lower in the dark.',
      cue: 'Point to a clock in your room. Can its hands move so slowly you cannot even see them?',
      scene: {
        id: 'the-elephant-clock-p1-slow-time',
        focus: 'the child patiently watching the scribe’s pen creep along its scale',
        composition:
          'Foreground: the scribe figure with its pen nudged along a marked scale; midground: the child seated calm on a cushion; background: a high window with the light beginning to soften toward evening',
        palette: 'warm amber, dusk violet, brass and soft turquoise',
      },
      alt: 'A child sits calmly watching a scribe figure whose pen has crept a little way along a marked scale.',
    },
    {
      text: 'Clink went the ball. Click-click went the dragon. Chirrup went the bird, and the bell rang sweet. “Drop, chirp, turn—time shows!” the child called softly. This time the best part was not the surprise. It was knowing every step from the start to the end. Waiting had let them see the whole story unfold. Al-Jazari nodded. “Now you truly understand my machine.” Another half hour had gently, quietly passed away.',
      scene: {
        id: 'the-elephant-clock-p1-recognize',
        focus: 'the child recognizing the full repeating sequence with calm delight',
        composition:
          'Foreground: the ball resting at the end of its winding path; midground: the bird, dragon, and figure in their finished poses while the child smiles; background: a softly lit arch with al-Jazari beside the clock',
        palette: 'moon-silver, brass, turquoise and warm coral',
      },
      alt: 'The ball, dragon, bird, and figure finish their sequence while a calm, smiling child watches, understanding.',
    },
    {
      text: 'Al-Jazari drew a big book from a wooden shelf. “I wrote it all down, so it is never lost,” he said. Inside were careful pictures of pumps, fountains, and clocks. Fifty ingenious machines waited on the pages. “Anyone who reads this can build one too,” he smiled. Hundreds of years later, people still read his book. They still marvel at the clever elephant that told the time. His careful writing carried the wonder far across the years.',
      cue: 'Draw a machine you dream up. Someday, could someone read your picture and build it too?',
      scene: {
        id: 'the-elephant-clock-p1-book',
        focus: 'al-Jazari showing the child his illustrated book of ingenious machines',
        composition:
          'Foreground: an open book with drawn pumps, fountains, and the elephant clock; midground: al-Jazari and the child leaning over the pages together; background: a shelf of scrolls and the quiet elephant clock behind them',
        palette: 'parchment cream, ink brown, brass and warm lamp gold',
      },
      alt: 'A maker shows a child a book of drawn machines, including the elephant clock, beside a shelf of scrolls.',
    },
    {
      text: 'That evening, the hall grew calm and softly golden. The great elephant clock stood proud, holding its next moment inside. The child pressed a small hand to its broad painted side. “Goodnight, wonderful clock,” they whispered warmly. Somewhere deep within, water was still dripping, drip by drip. Soon a ball would drop, and a bird would chirp, and a bell would ring. The clock would keep its steady time, long after the child went home.',
      cue: 'Listen for a soft tick or drip near you. What quiet machine is keeping time right now?',
      scene: {
        id: 'the-elephant-clock-p1-farewell',
        focus: 'the child bidding the still, steady elephant clock a warm goodnight',
        composition:
          'Foreground: the child’s hand resting on the elephant’s painted side; midground: the calm tower with bird, dragons, and scribe at rest; background: a crescent moon glowing through the arched window over Diyarbakir',
        palette: 'deep indigo, elephant gray, muted brass and soft moon cream',
      },
      alt: 'A child rests a hand on the elephant clock and whispers goodnight as a crescent moon glows through the arch.',
    },
  ],
};
