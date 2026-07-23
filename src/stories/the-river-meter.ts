import type { Story } from '../types';

export const theRiverMeter: Story = {
  slug: 'the-river-meter',
  title: 'The River-Meter',
  subtitle: 'Long ago in Egypt, priests read the Nile’s rising flood on a nilometer.',
  domain: 'measurement',
  collection: 'historical',
  repeatedPhrase: 'Mark the rise, prepare with care',
  readAloudMinutes: 9,
  learningTakeaway:
    'Ancient Egyptians carved steady marks on a nilometer and read the Nile at the very same spot each day. By comparing the same marks over many days and years, they could measure the flood, predict it, and prepare their fields for planting.',
  heartTakeaway:
    'Good preparation uses what we truly know, shares it clearly and kindly, and leaves gentle room for what we cannot be sure of yet.',
  grownUpFact:
    'A nilometer was a real structure for measuring the Nile’s annual flood, calibrated in Egyptian cubits and smaller fingers. Historians describe three main forms: a marked vertical column, a stairway of steps down to the river, and a deep well fed by a culvert. The stairway on Elephantine Island at Aswan had 52 steps, and a later, famous octagonal-column nilometer still stands on Roda Island in Cairo. A flood near sixteen cubits was celebrated as ideal; too low meant hunger, too high meant damage. No single person invented them; they begin in pharaonic times, appear on the First-Dynasty Palermo Stone, and were used until the Aswan Dam ended the yearly flood. No mark could promise the exact harvest.',
  pages: [
    {
      text: 'Long ago in ancient Egypt, families lived beside the great river Nile. All around them stretched dry, golden desert. But each summer a wonder happened. Far away, rains fell on distant mountains. Slowly the water swelled and rolled north for many days. The Nile crept up its banks and spread across the fields. It left behind dark, rich mud that made seeds grow. The people called it the flood, and they waited for it every year.',
      cue: 'The flood came the same time each summer. Can you name one thing that always comes back every year for you?',
      scene: {
        id: 'the-river-meter-p01-flood',
        focus: 'the wide Nile beginning to rise and spread rich dark mud across dry fields',
        composition:
          'Foreground: cracked golden earth meeting a slow sheet of rising river water carrying dark silt; midground: village children watching the water creep toward the fields; background: the broad Nile and distant palms under a hot summer sky',
        palette: 'river copper, papyrus green, and warm desert gold',
      },
      alt: 'The Nile rises and spreads dark rich mud across dry golden fields while children watch the water creep closer under a hot sky.',
    },
    {
      text: 'The flood was a gift, but it was tricky too. A small flood left the fields thirsty and the baskets empty. A giant flood could wash away homes and paths. The people needed the water to rise just right. So they learned to measure it. If they could tell how high the river would climb, they could get ready in time. A priest was given this careful, quiet job beside the water.',
      scene: {
        id: 'the-river-meter-p02-priest',
        focus: 'a priest studying the river, given the task of measuring the yearly flood',
        composition:
          'Foreground: a stone landing above the water with a thoughtful priest in a plain linen kilt; midground: farmers glancing anxiously at the rising river; background: mud-brick homes and green fields near the wide Nile',
        palette: 'warm sandstone, linen white, and river blue',
      },
      alt: 'A priest in a plain linen kilt studies the rising river from a stone landing while worried farmers glance at the water.',
    },
    {
      text: 'Along the river stood a clever thing called a nilometer. It was real, and it was built long, long ago. Some were tall columns marked from bottom to top. Some were deep wells that quietly filled as the river rose. This one was a stairway of stone steps leading down to the water. Marks climbed the wall beside the steps like the rungs of a ladder. Each mark meant a certain height of water, waiting to be read.',
      cue: 'A nilometer measured water, like a ruler measures you. Where might you stand tall against a wall to be measured?',
      scene: {
        id: 'the-river-meter-p03-nilometer',
        focus: 'the stone stairway nilometer with graduated height marks climbing the wall',
        composition:
          'Foreground: worn stone steps descending into the river with numbered marks up the wall beside them; midground: the priest resting a hand near the marks; background: reeds and the shining Nile at midday',
        palette: 'blue glaze, warm clay, and pale limestone',
      },
      alt: 'A stone stairway leads down into the Nile with graduated height marks climbing the wall beside it and reeds nearby.',
    },
    {
      text: 'The priest read the wall the way you might read a giant ruler. The marks had names the people knew well. A wide hand-span was a cubit, and a small mark was a finger. Many fingers made a cubit, and many cubits made the whole tall wall. He never climbed down into the deep, moving water. He stayed safe on the stone and simply looked. “Mark the rise, prepare with care,” he said as the water shone like copper.',
      scene: {
        id: 'the-river-meter-p04-cubits',
        focus: 'the priest reading the wet mark and counting cubits and fingers safely from the landing',
        composition:
          'Foreground: the marked wall with a clear wet line and labels for cubits and fingers; midground: the priest counting on his fingers behind a low rail; background: the river and green banks in golden light',
        palette: 'river copper, warm sandstone, and soft gold',
      },
      alt: 'The priest safely counts cubits and fingers on the marked wall, reading the wet line while the river shines like copper.',
    },
    {
      text: 'Every single evening the priest returned to the same spot. That was the real secret of good measuring. He looked at yesterday’s mark, then at today’s taller one. Lap-lap went the water against the worn stone steps. The higher wet line showed the river had climbed a little more. A sparkle alone could fool the eye and trick you. But the same marks, read the same way, told the honest truth.',
      cue: 'Which mark is taller, yesterday’s or today’s? Point your finger to show which way the river is climbing.',
      scene: {
        id: 'the-river-meter-p05-compare',
        focus: 'the priest comparing yesterday’s river level with today’s higher mark',
        composition:
          'Foreground: the wall showing two wet lines, one clearly higher than the other; midground: the priest comparing them thoughtfully; background: the dusk Nile beneath long swaying reeds',
        palette: 'indigo water, teal shadows, and dusty rose',
      },
      alt: 'The priest compares two wet lines on the wall, one higher than the other, as reeds sway over the dusk Nile.',
    },
    {
      text: 'The priest kept his counts on a record, day after day, year after year. Old marks from long-ago floods were remembered too. He compared this year’s rise with the years he had seen before. Near sixteen cubits, the elders said, was a wonderful flood. That much water would feed the fields without harming the homes. Too little, and seeds would go thirsty. Too much, and the water would push too far. The marks helped him tell the difference.',
      scene: {
        id: 'the-river-meter-p06-record',
        focus: 'the priest comparing this year’s marks against records of past floods',
        composition:
          'Foreground: a papyrus record and tally boards showing past flood heights; midground: the priest matching today’s mark to remembered levels; background: field shelters glowing as evening settles',
        palette: 'papyrus tan, lamp amber, and river blue',
      },
      alt: 'The priest matches today’s mark to past flood records on papyrus and tally boards as evening settles over the shelters.',
    },
    {
      text: 'One evening the water touched a mark sooner than he expected. Some farmers worried and wanted to open every seed sack at once. The priest shook his head kindly and asked them to wait. One reading was truly useful, but it was only one. The river might climb fast, then slow, then rest. “Mark the rise, prepare with care,” he reminded them. A single mark could guide a plan, not promise the whole season.',
      cue: 'What could the families get ready first while they keep watching the next river mark?',
      scene: {
        id: 'the-river-meter-p07-unexpected',
        focus: 'the priest calming worried farmers at an unexpectedly high mark',
        composition:
          'Foreground: a high wet mark on the wall beside closed seed sacks; midground: the priest speaking gently to anxious farmers; background: a gloaming river and a hushed village',
        palette: 'soft violet, muted blue, and grain gold',
      },
      alt: 'The priest gently calms worried farmers beside a high wet mark and closed seed sacks in the gloaming.',
    },
    {
      text: 'So the priest carried his record to the shady village square. He did not carry heavy sacks; he carried honest numbers. He showed the families how many cubits the river had risen. Together they mended baskets, checked their digging tools, and kept the seed dry. He told them only what the marks truly showed, no more. “Mark the rise, prepare with care.” Clear, shared measuring was something everyone could trust.',
      cue: 'Try measuring together: use hand-spans to see how many it takes to cross a table or a rug.',
      scene: {
        id: 'the-river-meter-p08-share',
        focus: 'the priest sharing the flood measurements with farming families in the square',
        composition:
          'Foreground: a record board and covered seed baskets; midground: the priest pointing to numbers as families ready their tools; background: first lamps glowing beside mud-brick homes',
        palette: 'lamp amber, river blue, and woven tan',
      },
      alt: 'The priest points to flood numbers on a record board as families mend baskets and ready tools by lamp-lit homes.',
    },
    {
      text: 'After many more evenings, the river settled near the marks he knew. It was a fair and friendly flood, close to the good height. The people planted their seeds into the dark, rich mud. Green shoots would rise where the water had rested. Together they had counted, watched, compared, and prepared. “Mark the rise, prepare with care.” The marks had not commanded the river; they had helped the people understand it.',
      scene: {
        id: 'the-river-meter-p09-plant',
        focus: 'families planting seeds in fresh flood mud as the river settles to a fair level',
        composition:
          'Foreground: hands pressing seeds into dark, glistening flood mud; midground: the priest and farmers looking over the fed fields; background: the calm Nile with a level wet line on the distant wall',
        palette: 'field green, silt brown, and warm sandstone',
      },
      alt: 'Families press seeds into fresh dark flood mud while the priest and farmers watch the fed fields and the calm Nile.',
    },
    {
      text: 'The rulers cared about the marks too, for a big reason. A high flood meant full fields and plenty to store away. Officials used the readings to plan the food and set the taxes. So the priest’s quiet counting shaped the whole land’s year. Some nilometers even had special water rites to greet the rising river. The wall of marks was small, yet its numbers reached far and wide.',
      scene: {
        id: 'the-river-meter-p10-officials',
        focus: 'officials using the priest’s flood readings to plan food stores and taxes',
        composition:
          'Foreground: scribes with tallies beside baskets of grain; midground: officials listening to the priest’s report of the flood height; background: granaries and the wide river beyond',
        palette: 'grain gold, ink black, and river blue',
      },
      alt: 'Scribes and officials plan grain stores and taxes as the priest reports the flood height beside full granaries and the river.',
    },
    {
      text: 'These river-meters were used for a very, very long time. Some counts were carved on an old stone tablet from Egypt’s earliest kings. Kingdom after kingdom, people read the same steady marks. A grand column nilometer still stands on an island in Cairo today. Only when a great dam was built did the yearly flood finally stop. For thousands of years, the marks quietly guided the people of the Nile.',
      scene: {
        id: 'the-river-meter-p11-legacy',
        focus: 'the enduring nilometer standing through many ages of Egyptian history',
        composition:
          'Foreground: a weathered marked column inside a stone well chamber; midground: figures from different ages reading the same marks; background: a timeless river valley stretching far into haze',
        palette: 'ancient stone gray, warm ochre, and deep river teal',
      },
      alt: 'A weathered marked column stands in a stone chamber as figures from many ages read the same nilometer marks by the timeless river.',
    },
    {
      text: 'You can be a river-watcher too, right where you live. Set a stick or a stone at the edge of a puddle after rain. Come back and look at the very same spot the next day. Did the water climb up, or sink down low? Mark it, and check again, and you are measuring like a priest. Reading the same spot, again and again, is how careful people learn the world.',
      cue: 'After the next rain, mark a puddle’s edge with a pebble. Check the same spot tomorrow. Did it rise or fall?',
      scene: {
        id: 'the-river-meter-p12-tryit',
        focus: 'a modern child measuring a puddle at the same spot to mimic the nilometer',
        composition:
          'Foreground: a small pebble set at a puddle’s edge with a low water line; midground: a curious child crouching to look closely; background: a garden path with fresh rain drops and soft daylight',
        palette: 'fresh rain silver, leaf green, and warm earth brown',
      },
      alt: 'A curious child crouches to mark a puddle’s edge with a pebble, measuring the water the way a priest read the nilometer.',
    },
    {
      text: 'So next time you measure anything at all, remember the Nile. Remember the steady marks that watched a river for thousands of years. Little marks on a wall helped a whole people grow their food. They counted with care, shared with honesty, and prepared side by side. “Mark the rise, prepare with care.” That is the quiet, wonderful power of measuring the world.',
      scene: {
        id: 'the-river-meter-p13-wonder',
        focus: 'the enduring wonder of measurement connecting past and present',
        composition:
          'Foreground: the marked nilometer wall glowing warmly; midground: the priest and a modern child measuring, side by side across time; background: the eternal Nile under a soft, hopeful sky',
        palette: 'golden legacy amber, river blue, and gentle rose',
      },
      alt: 'The glowing nilometer wall joins a priest and a modern child measuring side by side across time beside the eternal Nile.',
    },
  ],
};
