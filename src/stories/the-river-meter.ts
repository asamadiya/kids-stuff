import type { Story } from '../types';

export const theRiverMeter: Story = {
  slug: 'the-river-meter',
  title: 'The River-Meter',
  subtitle: 'Long ago in Egypt, priests read the Nile’s rising marks on a nilometer.',
  domain: 'measurement',
  collection: 'historical',
  repeatedPhrase: 'Mark the rise, prepare with care',
  readAloudMinutes: 5,
  learningTakeaway:
    'Ancient Egyptians carved marks on a nilometer and read the river at the same spot each day. Reading the same marks over time let them count the rise and prepare fields for planting.',
  heartTakeaway:
    'Good preparation uses what we truly know, shares it clearly, and leaves gentle room for what we cannot be sure of yet.',
  grownUpFact:
    'A nilometer was a real structure used to measure the Nile’s flood level, calibrated in Egyptian cubits. Historians describe three main forms: a marked vertical column, a stairway of steps leading down to the river, and a deep well fed by a culvert. The stairway on Elephantine Island in Aswan had 52 steps. Priests watched the day-to-day level and announced the coming flood, and readings helped officials plan crops and set taxes. No single person invented them; they began in pharaonic times, appear on the First-Dynasty Palermo Stone, and were used until the Aswan Dam. No mark could promise the exact harvest.',
  pages: [
    {
      text: 'Long ago in ancient Egypt, people lived beside the great river Nile. Each summer the river rose and spread rich soil on the fields. To get ready, they measured the water. A priest stood on a safe stone landing above the river. Marks climbed the wall beside a flight of steps, and he read them each evening. “Mark the rise, prepare with care,” he would say as the water shone like copper.',
      cue: 'Look at the marks climbing the wall. Can you count them from the low mark up to the tall one?',
      scene: {
        id: 'the-river-meter-p01-landing',
        focus: 'a priest reading graduated river-height marks from a protected stone landing',
        composition:
          'Foreground: a stone wall with graduated measuring marks and a low safety rail; midground: a priest in a plain linen kilt standing above the water; background: the broad Nile and green fields in golden evening light',
        palette: 'river copper, papyrus green, and warm sandstone',
      },
      alt: 'A priest reads the tall measuring marks on a stone wall above the Nile as green fields glow in golden evening light.',
    },
    {
      text: 'The wall of marks was called a nilometer, a real thing built long ago. The priest never went down to the deep water. He read the wet mark and counted how tall the river had climbed. Fingers and cubits, the marks were named. Each measure told the people a little more. The steady marks let him measure the same spot, again and again, while he stayed safe on the stone.',
      scene: {
        id: 'the-river-meter-p02-nilometer',
        focus: 'the priest counting the wet measuring mark on the nilometer wall',
        composition:
          'Foreground: the marked nilometer wall with a wet line low on the steps; midground: the priest counting on his fingers behind the rail; background: river reeds and distant fields at early dusk',
        palette: 'blue glaze, warm clay, and fading gold',
      },
      alt: 'The priest counts the wet line low on a marked nilometer wall while river reeds sway in the early dusk.',
    },
    {
      text: 'Each dusk the priest read again. He looked at yesterday’s mark, then today’s taller one. Lap-lap went the water below the steps. “Mark the rise, prepare with care.” The growing marks showed that the river was higher than before. Sparkle alone could fool the eye. But the same marks, read the same way, helped everyone measure and compare with care.',
      cue: 'Which mark is taller, yesterday’s or today’s? Point to show which way the river climbs.',
      scene: {
        id: 'the-river-meter-p03-compare',
        focus: 'the priest comparing yesterday’s river level with today’s higher one',
        composition:
          'Foreground: the nilometer wall showing two wet lines, one higher than the other; midground: the priest comparing the two levels; background: the dusk Nile under long reeds',
        palette: 'indigo water, teal shadows, and dusty rose',
      },
      alt: 'The priest compares two wet lines on the nilometer wall, one higher than the other, under a dusk sky.',
    },
    {
      text: 'One evening the water reached a mark sooner than the priest expected. Some farmers worried that every seed sack must be opened at once. The priest shook his head kindly. One reading was useful, yet families still needed to watch and share the news. A river mark could guide a plan. It could not promise exactly how the whole season would go.',
      cue: 'What could the families get ready while they keep watching the next river mark?',
      scene: {
        id: 'the-river-meter-p04-unexpected',
        focus: 'the priest pausing at an unexpectedly high mark beside closed seed sacks',
        composition:
          'Foreground: a high wet mark on the wall and closed seed sacks; midground: the priest speaking gently to worried farmers; background: a gloaming river and a quiet village',
        palette: 'soft violet, muted blue, and grain gold',
      },
      alt: 'The priest pauses at a high mark on the wall beside closed seed sacks while farmers listen in the gloaming.',
    },
    {
      text: 'The priest carried his record to the village shade, not the heavy sacks. Families checked their tools, mended baskets, and kept the seed dry. He showed them the count of the marks and told only what the numbers showed. “Mark the rise, prepare with care.” Good preparation did not need a perfect guess. It just needed clear, honest measuring that everyone could trust.',
      scene: {
        id: 'the-river-meter-p05-share',
        focus: 'the priest sharing the river measurements with farming families',
        composition:
          'Foreground: a record board and covered seed baskets; midground: the priest pointing to numbers while families prepare; background: first lamps glowing near field shelters',
        palette: 'lamp amber, river blue, and woven tan',
      },
      alt: 'The priest points to river measurements on a record board as families mend baskets near lamp-lit shelters.',
    },
    {
      text: 'After more readings, the river settled near the useful marks the priest knew from earlier years. People planned their planting with the new water in mind. Together they counted, watched, and prepared. “Mark the rise, prepare with care.” The marks had not commanded the river. They had simply helped the people measure it, notice its changes, and get ready side by side.',
      scene: {
        id: 'the-river-meter-p06-settled',
        focus: 'the priest and families overlooking prepared fields as the river settles',
        composition:
          'Foreground: the nilometer wall with a level wet line; midground: the priest and farmers looking over rows of prepared fields; background: a soft moonrise over the calm Nile',
        palette: 'moon silver, field green, and warm sandstone',
      },
      alt: 'The priest and farmers look over prepared fields as a level wet line rests on the wall under a soft moonrise.',
    },
    {
      text: 'That night, the Nile moved softly beyond the sleeping village. The measuring marks rested quiet on their wall. Children lay snug, and their blankets fell in gentle steps from shoulder to toes. The people had watched carefully and stayed safe. Moonlight marked one still, quiet line across the floor. The river breathed low and slow. Goodnight.',
      scene: {
        id: 'the-river-meter-p07-sleep',
        focus: 'a child asleep in a quiet village as moonlight rests on the wall',
        composition:
          'Foreground: a soft step-folded blanket over a sleeping child; midground: a calm room with a low lamp fading; background: a moonlit wall with the quiet river beyond',
        palette: 'deep blue, sandstone cream, and gentle silver',
      },
      alt: 'A child sleeps snug under a step-folded blanket while moonlight rests in one quiet line and the river breathes beyond.',
    },
  ],
};
