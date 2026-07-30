import type { Story } from '../types';

/**
 * Rewritten from the ground up. The first version had three faults, all of
 * which a parent hit within a page or two:
 *
 * 1. The title promised a screw and nine of twelve pages described a lever —
 *    a Greek beam press, with the screw appended as a coda. Someone opening
 *    "The Screw That Squeezed the Olives" got a windlass.
 * 2. It averaged 72 words a page, 870 in all, in sentences like "Pushing far
 *    out at the rope end took only a light, steady effort." Page 11 dated Hero
 *    of Alexandria as "about sixty years after a very old calendar's start",
 *    which is not a fact a five-year-old can hold, or anyone.
 * 3. Eight of the twelve pictures did not show their page. Page 6 read "a
 *    shining drop gathered at the wooden spout" over a night scene of a
 *    sleeping child under a moon.
 *
 * So: the screw is the subject from page one, the machine is drawn on every
 * page it is named on, and the text runs about 35 words a page in short
 * sentences. The two figures are fixed — a girl and her grandfather — and
 * described identically in every art prompt, because the cast wandering
 * between panels was half of why the pictures read as unrelated.
 */
export const theScrewThatSqueezedTheOlives: Story = {
  slug: 'the-screw-that-squeezed-the-olives',
  title: 'The Screw That Squeezed the Olives',
  subtitle: 'A Roman farm, a giant wooden screw, and the oil hiding inside a hard little fruit.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Round and down',
  readAloudMinutes: 5,
  learningTakeaway:
    'A screw is a ramp wrapped around a pole. Turning it a long way round moves it a short way down, and that trade turns a small push into a very big squeeze. Roman farms used a giant wooden screw to press oil out of crushed olives.',
  heartTakeaway:
    'Some things only come out slowly. The press does not hurry, and the oil comes anyway.',
  grownUpFact:
    'Olives are too bitter to eat off the branch, but about a fifth of a ripe olive’s weight is oil. Ancient presses worked in three steps that have barely changed: crush the fruit, pack the paste into flat loosely-woven baskets, stack them, and squeeze. Greek farms pulled a long wooden beam down onto the stack. Roman farms increasingly used a screw — either to haul that beam down or, as here, pressing straight down on the stack itself. Hero of Alexandria described screw presses in his Mechanica in the first century CE, and Pliny the Elder wrote about press improvements in his Natural History around 77 CE. The oil separates and floats above the watery part, so it is drawn off the top. It burned in lamps, dressed food, and was rubbed on skin, and it travelled by sea in tall clay jars called amphorae.',
  pages: [
    {
      text: 'The olives are picked. They fill the baskets to the top.\n\nBite one and you would spit it out. Olives are bitter.\n\nBut there is oil hiding inside. Every single one.',
      cue: 'Squeeze your hand shut, hard. Now open it. What could come out of a squeezed olive?',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p1-baskets',
        focus: 'baskets heaped with dark olives on the floor of a stone press room',
        composition:
          'Foreground: two wide baskets heaped with dark purple-black olives; midground: a girl of six kneeling with a handful, her grandfather beside her; background: the stone doorway of the press room with olive trees outside',
        palette: 'olive green, deep purple-black, warm stone, and afternoon gold',
      },
      alt: 'A girl kneels beside baskets heaped with dark olives in a stone press room, her grandfather standing next to her.',
    },
    {
      text: 'First the olives must be crushed.\n\nA big round stone rolls over them. Round and round it goes.\n\nNow the olives are a wet grey paste. It smells green.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p2-crushing',
        focus: 'a large round crushing stone rolling through olives in a stone basin',
        composition:
          'Foreground: a tall round stone wheel set on its edge in a circular stone basin, olives crushing to grey-green paste beneath it; midground: the girl pushing the wooden handle, her grandfather steadying it; background: the press room wall',
        palette: 'grey stone, olive green, wet paste, and warm shadow',
      },
      alt: 'A tall round stone rolls through olives in a stone basin, crushing them to paste, while a girl pushes the handle.',
    },
    {
      text: 'The paste goes into flat baskets. One scoop, then another.\n\nThe baskets are stacked up in a tower.\n\nThe tower is soft and heavy and full of oil.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p3-stack',
        focus: 'flat woven baskets of olive paste stacked into a short tower',
        composition:
          'Foreground: a stack of six flat round woven baskets, olive paste showing at the edges; midground: the girl setting one more basket on top, the grandfather holding the stack steady; background: the press frame rising behind them',
        palette: 'straw, olive paste grey-green, wood brown, and stone',
      },
      alt: 'A girl sets a flat basket of olive paste on top of a stack of them, beside a wooden press frame.',
    },
    {
      text: 'Above the tower stands the screw.\n\nIt is made of wood. It is taller than Grandfather.\n\nA long bar goes through the top, for pushing.',
      cue: 'Hold up one finger. Now wind it round and round, going down. That is a screw.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p4-screw',
        focus: 'a giant wooden screw standing in its frame above the basket stack',
        composition:
          'Foreground: the stack of paste baskets; midground: a huge wooden screw with deep spiral threads running down into a heavy timber frame, a long wooden bar through the head of it; background: the girl looking up at it, small beside the frame',
        palette: 'honey wood, deep shadow in the threads, straw, and stone',
      },
      alt: 'A giant wooden screw with deep spiral threads stands in a timber frame above a stack of baskets, a long bar through its top.',
    },
    {
      text: 'Look at the screw closely.\n\nThe line winds round it like a path up a hill.\n\nA screw is a ramp, wrapped around a pole. That is all it is.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p5-thread',
        focus: 'a close view of the spiral thread winding down the wooden screw',
        composition:
          'Foreground: a close view of the wooden screw filling the frame, one continuous spiral thread winding down it, the girl tracing the thread with one finger; background: soft blur of the press room',
        palette: 'honey wood, deep carved shadow, and warm light',
      },
      alt: 'A close view of the spiral thread winding down a wooden screw, a child tracing it with one finger.',
    },
    {
      text: 'They lean on the bar and push.\n\nThe screw turns. Round and down. Round and down.\n\nIt goes a long way round to go a little way down.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p6-turning',
        focus: 'the girl and her grandfather pushing the long bar to turn the screw',
        composition:
          'Foreground: the long wooden bar sweeping toward the viewer; midground: the girl and her grandfather leaning into it with both hands, walking it round; background: the screw turning down into its frame above the baskets',
        palette: 'warm wood, dust in the light, and stone grey',
      },
      alt: 'A girl and her grandfather lean on a long wooden bar with both hands, walking it round to turn the screw.',
    },
    {
      text: 'The screw presses down on the tower of baskets.\n\nThe tower squashes. It gets shorter and shorter.\n\nAnd the oil comes out.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p7-pressing',
        focus: 'the basket stack squashed flat under the screw, oil running from its edges',
        composition:
          'Foreground: oil running out from between the squashed baskets into a shallow stone channel; midground: the flattened stack pressed under the foot of the screw; background: the girl watching closely, her hands on her knees',
        palette: 'green-gold oil, wet stone, straw, and shadow',
      },
      alt: 'Oil runs from between squashed baskets into a stone channel under the foot of a wooden screw.',
    },
    {
      text: 'The oil runs down the stone channel. It goes into a big clay jar.\n\nThere is water in there too, from the fruit.\n\nBut oil floats. It sits on top, all by itself.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p8-floating',
        focus: 'a clay jar with green-gold oil floating in a clear layer above darker water',
        composition:
          'Foreground: a wide clay jar seen from above the rim, a bright green-gold layer of oil floating clearly above a darker watery layer; midground: the girl leaning over the rim to look in; background: the stone channel running back to the press',
        palette: 'green-gold, dark water, terracotta, and stone',
      },
      alt: 'A girl leans over a clay jar where a bright layer of oil floats above a darker watery layer.',
    },
    {
      text: 'Why use a screw? Why not just push down hard?\n\nBecause hands are not strong enough. Not nearly.\n\nThe screw turns a small push into a huge squeeze.',
      cue: 'Push down on the table as hard as you can. Now imagine squeezing a hundred times harder.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p9-why',
        focus: 'the girl pushing the bar with both hands while the great screw bears down',
        composition:
          'Foreground: the girl pushing the long bar with two hands, her whole weight in it; midground: the screw pressing down hard on the flattened stack, oil running fast; background: the heavy timber frame taking the strain',
        palette: 'warm wood, green-gold oil, and dusty light',
      },
      alt: 'A girl pushes the long bar with her whole weight while the screw presses down and oil runs fast.',
    },
    {
      text: 'The jar is full. Grandfather carries it with both arms.\n\nThis oil will burn in their lamp all winter.\n\nIt will go on bread. It will go on dry hands.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p10-uses',
        focus: 'a lit clay lamp, bread, and the full jar of oil on a wooden table',
        composition:
          'Foreground: a small clay oil lamp with a live flame, a torn loaf of bread beside it; midground: the full jar of green-gold oil, the grandfather setting it down; background: the girl watching, evening light through a doorway',
        palette: 'lamp flame gold, bread crust, terracotta, and dusk blue',
      },
      alt: 'A lit clay lamp and bread sit on a table beside a full jar of oil, a girl watching in the evening light.',
    },
    {
      text: 'Some jars do not stay home. They are tall and sealed with clay.\n\nThey go down to the boats.\n\nThe oil sails away across the sea.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p11-amphorae',
        focus: 'tall sealed clay amphorae being carried aboard a boat at a stone quay',
        composition:
          'Foreground: three tall pointed clay amphorae sealed at the neck, resting on a stone quay; midground: a man carrying one up a plank onto a wooden boat; background: a calm sea and a low headland in morning light',
        palette: 'terracotta, sea blue-green, pale stone, and morning gold',
      },
      alt: 'Tall sealed clay jars stand on a stone quay while a man carries one up a plank onto a boat.',
    },
    {
      text: 'That was a long time ago.\n\nBut look in your kitchen. There is a bottle of olive oil.\n\nSame hard little fruit. Same squeeze. Round and down.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p12-today',
        focus: 'a modern bottle of olive oil on a kitchen counter',
        composition:
          'Foreground: a plain glass bottle of green-gold olive oil on a wooden kitchen counter, a few olives beside it; midground: a child’s hand reaching toward it; background: a bright modern kitchen window',
        palette: 'green-gold, clear glass, pale wood, and daylight',
      },
      alt: 'A glass bottle of green-gold olive oil stands on a kitchen counter, a child reaching toward it.',
    },
  ],
};

export default theScrewThatSqueezedTheOlives;
