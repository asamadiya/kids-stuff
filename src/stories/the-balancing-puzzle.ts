import type { Story } from '../types';

export const theBalancingPuzzle: Story = {
  slug: 'the-balancing-puzzle',
  title: 'The Balancing Puzzle',
  subtitle: 'Long ago in Baghdad, the scholar al-Khwarizmi kept both sides fair.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'What one side gets, the other side gets too',
  readAloudMinutes: 5,
  learningTakeaway:
    'A balance stays fair when both sides get the very same change. If you take one date from a pan, take one from the other pan too, and it stays level.',
  heartTakeaway:
    'A puzzling problem grows easy and calm when you protect what is fair at every gentle step.',
  grownUpFact:
    'Muhammad ibn Musa al-Khwarizmi worked in the House of Wisdom (Bayt al-Hikma) in Baghdad around 820 CE, under the caliph al-Ma’mun. He wrote a famous book whose title gives us the word “algebra” (al-jabr). Al-jabr means “restoration” and al-muqabala means “balancing”: you keep an equation fair by doing the same thing to both sides. This bedtime tale imagines him with a simple two-pan balance and a few dates, leaving the real symbols and rules to grown-ups.',
  pages: [
    {
      text: 'Long ago, in the great city of Baghdad, a scholar named al-Khwarizmi loved number puzzles. He worked in a house of books called the House of Wisdom. One warm evening, a friend set a brass balance on his table. One pan held a tied cloth bag and one date. The other pan held four dates. The beam rested perfectly level. This story is a gentle tale about him.',
      cue: 'Hold both hands out flat and level, like a fair balance. Can you keep them even?',
      scene: {
        id: 'the-balancing-puzzle-p1-house-of-wisdom',
        focus: 'a scholar at a brass balance holding a tied bag and dates in an arched Baghdad library',
        composition:
          'Foreground: a brass balance with a tied cloth bag and one date on the left pan, four dates on the right, resting level; midground: al-Khwarizmi seated with a kind friend; background: the arched House of Wisdom in Baghdad under a warm dusk sky',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'A robed scholar studies a level brass balance holding a tied bag and dates in an arched Baghdad library at dusk.',
    },
    {
      text: 'First, al-Khwarizmi lifted the single date from beside the bag. That pan rose, and the four-date pan sank down. The beam was no longer fair. He smiled and set the date back gently. “What one side gets, the other side gets too,” he said softly. Changing only one pan lost the fairness that held the hidden clue.',
      cue: 'Lower just one hand while the other stays high. See how it stops being even?',
      scene: {
        id: 'the-balancing-puzzle-p2-one-sided-tilt',
        focus: 'one date lifted from only one pan, making the beam tilt',
        composition:
          'Foreground: one date lifted from the left pan, the beam tilting so the right side dips low; midground: al-Khwarizmi with a thoughtful hand; background: an arched Baghdad library softening into evening',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar lifts one date from a single pan and the once level balance tilts to one side.',
    },
    {
      text: 'Then he tried a fairer idea, counting carefully. He took one date from the bag’s pan and one date from the other pan. “What one side gets, the other side gets too,” he said. The beam stayed calm and level. Now the tied bag balanced just three dates. He had made the number puzzle simpler without breaking the fair pattern.',
      scene: {
        id: 'the-balancing-puzzle-p3-same-removal',
        focus: 'one date removed from each pan while the beam stays level',
        composition:
          'Foreground: one date removed from each pan, the beam still perfectly level, the tied bag now facing three dates; midground: al-Khwarizmi counting with a gentle finger; background: an arched Baghdad library at gloaming',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar removes one date from each pan, leaving a tied bag balanced against three counted dates.',
    },
    {
      text: 'He reached to untie the bag, then paused. Opening it would give the answer, but it would skip the puzzle. Al-Khwarizmi wanted to understand the balance, not merely peek inside. So he counted the three dates on the open pan again. The quiet, fair beam had already told him what the hidden bag must match.',
      scene: {
        id: 'the-balancing-puzzle-p4-pause-before-peek',
        focus: 'the scholar pausing before untying the hidden bag',
        composition:
          'Foreground: a hand resting near the still-tied bag while three dates sit on the opposite pan; midground: al-Khwarizmi thinking calmly; background: an arched Baghdad library glowing softly',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar pauses with a hand near the tied bag while three dates rest on the opposite level pan.',
    },
    {
      text: 'To test his careful thought, he added one date to each pan. The bag and one date balanced four dates again, still level. “What one side gets, the other side gets too,” he said. Then he removed the matching dates, and the bag balanced three once more. Every equal change kept the same fair number puzzle whole.',
      cue: 'Why did the beam stay even when both pans got the very same date?',
      scene: {
        id: 'the-balancing-puzzle-p5-same-addition',
        focus: 'matching dates added to both pans of the level balance',
        composition:
          'Foreground: one date added to each pan, the brass beam remaining perfectly level; midground: al-Khwarizmi nodding as he checks his idea; background: an arched Baghdad library at moonrise',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar adds one date to each pan and the brass beam stays perfectly level.',
    },
    {
      text: 'At last his friend opened the little bag. Plip, plip, plip. Three dates rolled out onto the table. They matched the three dates on the other pan exactly. “What one side gets, the other side gets too,” al-Khwarizmi laughed warmly. The cloth had hidden the number, yet fairness had shown it in another quiet way.',
      scene: {
        id: 'the-balancing-puzzle-p6-hidden-revealed',
        focus: 'three dates rolling from the opened bag opposite three matching dates',
        composition:
          'Foreground: three dates rolling from the open cloth bag beside three matching dates on the other pan; midground: al-Khwarizmi and his friend smiling; background: an arched Baghdad library under a rising moon',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'Three dates roll from the opened cloth bag and match the three dates counted on the other pan.',
    },
    {
      text: 'That night, the brass pans hung empty and even in the House of Wisdom. A thread of moonlight rested on the quiet beam. Al-Khwarizmi tucked his books away and settled onto a soft cushion. Both sides were still now, with nothing to add and nothing to take. The fair balance did not stir. Goodnight, and sleep snug.',
      scene: {
        id: 'the-balancing-puzzle-p7-moonlit-rest',
        focus: 'an empty level balance in a moonlit Baghdad library as the scholar rests',
        composition:
          'Foreground: an empty brass balance hanging perfectly level with a thread of moonlight on the beam; midground: al-Khwarizmi resting on a cushion with closed eyes; background: the arched House of Wisdom under a calm crescent moon',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'An empty brass balance hangs level under a crescent moon while the scholar rests snug on a cushion.',
    },
  ],
};
