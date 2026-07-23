import type { Story } from '../types';

export const theRoomThatDrawsWithLight: Story = {
  slug: 'the-room-that-draws-with-light',
  title: 'The Room That Draws With Light',
  subtitle: 'Ibn al-Haytham watches a tiny hole paint an upside-down street.',
  domain: 'shadows',
  collection: 'historical',
  repeatedPhrase: 'Tiny hole, bright picture',
  readAloudMinutes: 5,
  learningTakeaway:
    'When light from a bright scene passes through one tiny hole into a dark room, it paints a picture of that scene on the far wall. The picture always appears upside down, because the straight rays of light cross as they pass through the small opening.',
  heartTakeaway:
    'A surprising result is an invitation to ask a careful question, choose one clear clue, and look again without hurrying.',
  grownUpFact:
    'A scholar named al-Hasan Ibn al-Haytham was born in Basra around 965 CE and studied light in Cairo. In his Book of Optics, finished around 1021 CE, he described how light passing through a small opening into a dark room forms an upside-down image on the opposite wall. This dark room is now called the camera obscura, Latin for dark room. Never look straight at the Sun; only watch the picture it makes on the wall.',
  pages: [
    {
      text: 'Long ago, a thoughtful man named Ibn al-Haytham loved to study light. He was born in Basra, and he liked quiet, careful work. One warm afternoon he sat inside a dark room with thick shutters. Click went the latch. One shutter held a tiny round hole. Outside, a bright street shone in the sun. He turned to watch the far wall, not the sky.',
      cue: 'Cup your hands into a tiny hole and peek through. What can you see on the other side?',
      scene: {
        id: 'the-room-that-draws-with-light-p1-dark-room',
        focus: 'one thin beam of light crossing a dark room toward a blank wall',
        composition:
          'Foreground: a dim room with one bright pinhole in the shutter; midground: Ibn al-Haytham seated and facing the opposite wall; background: a faint upside-down street beginning to appear as a bright cart passes outside the hole',
        palette: 'deep indigo interior, sun-gold beam, warm rust, and pale wall cream',
      },
      alt: 'A scholar sits facing a wall as one thin beam of light enters a dark room through a tiny shutter hole.',
    },
    {
      text: 'Slowly, soft colors gathered on the wall. There was the street, but its cart floated wheels above roof. A tall palm tree pointed down instead of up. He blinked and looked again, calm and curious. "Tiny hole, bright picture," he said softly to himself. The whole busy street had entered the room, yet every single shape had turned upside down.',
      cue: 'Turn your hands over, upside down. What is at the top now, and what is at the bottom?',
      scene: {
        id: 'the-room-that-draws-with-light-p2-inverted-street',
        focus: 'an upside-down cart and palm tree glowing on the wall',
        composition:
          'Foreground: the inverted cart image and a downward-pointing palm; midground: Ibn al-Haytham turning his hands over in wonder; background: the single pinhole glowing across the dark room',
        palette: 'soft projected gold and green on a blue-black room',
      },
      alt: 'An upside-down cart and palm tree glow on the wall while the scholar turns his hands over.',
    },
    {
      text: 'He looked at one small part at a time. The cart wheels appeared above the roof. Palm fronds hung below their trunk. A walking person had feet floating over their head. "Tiny hole, bright picture." Every familiar piece was truly there, only flipped. Naming each shape helped him watch the wall without feeling muddled or rushed.',
      scene: {
        id: 'the-room-that-draws-with-light-p3-naming-details',
        focus: 'four familiar street details appearing upside down on the wall',
        composition:
          'Foreground: cart wheels above their roof and palm fronds below their trunk; midground: Ibn al-Haytham pointing gently from one detail to the next; background: the single pinhole glowing across the dark room',
        palette: 'muted projected gold and green, deep blue, and warm rust',
      },
      alt: 'The scholar points to upside-down cart wheels, palm fronds, and a walking person in the wall picture.',
    },
    {
      text: 'Then a busy group crossed the street all at once. Wheels, baskets, feet, and awnings overlapped on the wall. He lost the little cart inside the jumble of shapes. "The picture looks tangled now," he whispered patiently. But the tiny hole had not changed at all. "It is still making a picture," he said. "Let me wait for one clear shape."',
      scene: {
        id: 'the-room-that-draws-with-light-p4-crowded-jumble',
        focus: 'many upside-down street shapes overlapping in one crowded picture',
        composition:
          'Foreground: overlapping wheels, baskets, feet, and awnings; midground: Ibn al-Haytham studying the jumble calmly; background: the unchanged tiny shutter hole',
        palette: 'projected amber, red, and green against muted indigo',
      },
      alt: 'Many upside-down street shapes overlap on the wall while the scholar studies them calmly.',
    },
    {
      text: 'A bright red canopy passed slowly by the tiny hole. On the wall, its red top appeared below, its poles pointing up. He followed that one clear color through the tangle of shapes. Soon the little cart rolled into view beside it. "Tiny hole, bright picture," he said, pleased. Choosing one clear clue had helped him find the whole busy street again.',
      cue: 'Point to the top and the bottom of an imaginary canopy. Where would each part land upside down?',
      scene: {
        id: 'the-room-that-draws-with-light-p5-one-clue',
        focus: 'one red canopy followed from the street to its upside-down wall picture',
        composition:
          'Foreground: the inverted red canopy with poles pointing upward; midground: Ibn al-Haytham following the red shape with a steady finger; background: the single pinhole beam and the rest of the projected street',
        palette: 'rich indigo, projected red, amber, leaf green, and cream',
      },
      alt: 'The scholar follows one red canopy into its upside-down wall picture while a small cart rolls beside it.',
    },
    {
      text: 'He rested against a cushion and watched the street picture drift across the wall. "Tiny hole, bright picture." He understood the room was not drawing from memory or magic. Light from the sunny street was carrying each shape through the one small hole. His careful question had become a gentle test he could repeat again and again, safely.',
      scene: {
        id: 'the-room-that-draws-with-light-p6-understanding',
        focus: 'Ibn al-Haytham calmly watching the whole upside-down street picture',
        composition:
          'Foreground: the full projected street glowing on the wall; midground: Ibn al-Haytham seated on a cushion; background: a single star-like pinhole and a closed door',
        palette: 'moonlit navy, soft projected gold, and warm rust accents',
      },
      alt: 'The scholar calmly watches the whole upside-down street picture on the wall of his dark room.',
    },
    {
      text: 'When evening settled, the bright street picture slowly faded away. He opened the door, and soft moonlight filled the quiet room. He would write down all he had seen for others to try. Now no beam crossed the wall, and no cart floated upside down. The dark room rested still and cozy. Goodnight, careful watcher of the light.',
      scene: {
        id: 'the-room-that-draws-with-light-p7-quiet-night',
        focus: 'the quiet dark room resting with the tiny hole now capped',
        composition:
          'Foreground: a small round cap over the shutter hole and a resting cushion; midground: Ibn al-Haytham setting down his writing, ready to rest; background: a blank wall and a crescent Moon beyond the opened upper lattice',
        palette: 'deep-night blue, moon cream, and a faint warm rust edge',
      },
      alt: 'The tiny shutter hole is capped and the scholar rests as soft moonlight fills the dark quiet room.',
    },
  ],
};
