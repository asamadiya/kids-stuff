import type { Story } from '../types';

export const theBalancingPuzzle: Story = {
  slug: 'the-balancing-puzzle',
  title: 'The Balancing Puzzle',
  subtitle: 'Long ago in Baghdad, the scholar al-Khwarizmi kept both sides fair.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'What one side gets, the other side gets too',
  readAloudMinutes: 9,
  learningTakeaway:
    'A balance stays fair when both sides get the very same change. Take one date from a pan, and take one from the other pan too, and it stays level. That is how you solve for a hidden number.',
  heartTakeaway:
    'A puzzling problem grows easy and calm when you protect what is fair at every gentle step.',
  grownUpFact:
    'Muhammad ibn Musa al-Khwarizmi worked in the House of Wisdom (Bayt al-Hikma) in Baghdad around 820 CE, under the caliph al-Ma’mun. He wrote a famous book whose title gives us the word “algebra” (al-jabr). Al-jabr means “restoration” and al-muqabala means “balancing”: you keep an equation fair by doing the same thing to both sides. He also helped spread the Hindu-Arabic numerals and place-value counting we still use, and the word “algorithm” comes from the Latin form of his name. His books were translated into Latin centuries later and shaped mathematics in Europe. This tale imagines him with a simple two-pan balance and a few dates, leaving the real symbols and rules to grown-ups.',
  pages: [
    {
      text: 'Long ago, in the great city of Baghdad, a scholar named al-Khwarizmi loved number puzzles. He worked in a house of books called the House of Wisdom. Scholars came from far away to read and count and share ideas there. One warm evening, a friend set a brass balance on his table. On one pan sat a tied cloth bag and one date. On the other pan sat four dates. The beam rested perfectly level. This story is a gentle tale about him.',
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
      text: '“A puzzle for you,” his friend said with a grin. “How many dates hide inside the tied bag? You may not peek and you may not untie it.” Al-Khwarizmi leaned in and looked at the calm, level beam. The bag and one date, on the left, weighed the same as four dates on the right. Somewhere inside that little cloth was a hidden number. He would find it without ever looking inside.',
      cue: 'Guess with me: how many dates do you think are hiding in the bag?',
      scene: {
        id: 'the-balancing-puzzle-p2-the-challenge',
        focus: 'the friend pointing at the tied bag while the scholar studies the level beam',
        composition:
          'Foreground: the tied cloth bag and one date on the left pan facing four dates on the right, the beam level; midground: the friend gesturing playfully while al-Khwarizmi peers close; background: arched shelves of scrolls in the House of Wisdom',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'A friend points at a tied bag on a level balance while the scholar studies it, curious and thinking.',
    },
    {
      text: 'First, al-Khwarizmi tried a hasty idea. He lifted the single date from beside the bag. That pan rose, and the four-date pan sank down. The beam was no longer fair, and the clue was lost. He smiled and set the date back gently. “What one side gets, the other side gets too,” he said softly. Changing only one pan had broken the fairness that held the answer.',
      cue: 'Lower just one hand while the other stays high. See how it stops being even?',
      scene: {
        id: 'the-balancing-puzzle-p3-one-sided-tilt',
        focus: 'one date lifted from only one pan, making the beam tilt',
        composition:
          'Foreground: one date lifted from the left pan, the beam tilting so the right side dips low; midground: al-Khwarizmi with a thoughtful hand; background: an arched Baghdad library softening into evening',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar lifts one date from a single pan and the once level balance tilts to one side.',
    },
    {
      text: 'Then he tried a fairer idea, counting carefully. He took one date from the bag’s pan, and one date from the other pan too. “What one side gets, the other side gets too,” he said. The beam did not even wobble. It stayed calm and level. Now the tied bag alone balanced just three dates. He had made the puzzle simpler without breaking the fair pattern.',
      scene: {
        id: 'the-balancing-puzzle-p4-same-removal',
        focus: 'one date removed from each pan while the beam stays level',
        composition:
          'Foreground: one date removed from each pan, the beam still perfectly level, the tied bag now facing three dates; midground: al-Khwarizmi counting with a gentle finger; background: an arched Baghdad library at gloaming',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar removes one date from each pan, leaving a tied bag balanced against three counted dates.',
    },
    {
      text: 'That was the whole secret, and it was a simple one. A fair balance is like a rule you must never break. Do the very same thing to both pans, and it stays true. Take one away here, take one away there. Add one here, add one there, and it holds. The bag stayed a mystery, yet the beam quietly did the thinking for him.',
      scene: {
        id: 'the-balancing-puzzle-p5-the-rule',
        focus: 'the level beam shown as a fair rule, bag against three dates',
        composition:
          'Foreground: the calm level beam, the tied bag on one pan and three neat dates on the other; midground: al-Khwarizmi resting a hand on the table, understanding dawning; background: warm lamplight across the arched library',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'A calm level balance holds the tied bag against three dates as the scholar understands the fair rule.',
    },
    {
      text: 'He reached to untie the bag, then paused. Opening it would give the answer, but it would skip the puzzle. Al-Khwarizmi wanted to understand the balance, not merely peek inside. So he counted the three dates on the open pan again, one by one. The quiet, fair beam had already whispered what the hidden bag must match.',
      scene: {
        id: 'the-balancing-puzzle-p6-pause-before-peek',
        focus: 'the scholar pausing before untying the hidden bag',
        composition:
          'Foreground: a hand resting near the still-tied bag while three dates sit on the opposite pan; midground: al-Khwarizmi thinking calmly; background: an arched Baghdad library glowing softly',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar pauses with a hand near the tied bag while three dates rest on the opposite level pan.',
    },
    {
      text: 'To test his careful thought, he added one date to each pan. The bag and one date balanced four dates again, still level. “What one side gets, the other side gets too,” he said. Then he removed the matching dates, and the bag balanced three once more. Every equal change kept the same fair puzzle whole. The number inside had not changed at all.',
      cue: 'Why did the beam stay even when both pans got the very same date?',
      scene: {
        id: 'the-balancing-puzzle-p7-same-addition',
        focus: 'matching dates added to both pans of the level balance',
        composition:
          'Foreground: one date added to each pan, the brass beam remaining perfectly level; midground: al-Khwarizmi nodding as he checks his idea; background: an arched Baghdad library at moonrise',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar adds one date to each pan and the brass beam stays perfectly level.',
    },
    {
      text: 'At last his friend opened the little bag. Plip, plip, plip. Three dates rolled out onto the table. They matched the three dates on the other pan exactly. “What one side gets, the other side gets too,” al-Khwarizmi laughed warmly. The cloth had hidden the number, yet fairness had shown it another quiet way. He had solved for a hidden thing, and never once peeked.',
      scene: {
        id: 'the-balancing-puzzle-p8-hidden-revealed',
        focus: 'three dates rolling from the opened bag opposite three matching dates',
        composition:
          'Foreground: three dates rolling from the open cloth bag beside three matching dates on the other pan; midground: al-Khwarizmi and his friend smiling; background: an arched Baghdad library under a rising moon',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'Three dates roll from the opened cloth bag and match the three dates counted on the other pan.',
    },
    {
      text: 'Now here is a true and wonderful thing. Al-Khwarizmi wrote a whole book about balancing puzzles like this. He did not use bags and dates. He used careful words and clever counting rules instead. He called his method al-jabr, which means “restoring,” and al-muqabala, which means “balancing.” From that little word, al-jabr, we get our word today: algebra.',
      cue: 'Say the old word with me: al-jabr. Now say our word: algebra. They are cousins!',
      scene: {
        id: 'the-balancing-puzzle-p9-the-book',
        focus: 'the scholar writing his balancing rules onto parchment by lamplight',
        composition:
          'Foreground: an open parchment with flowing script and a reed pen, the brass balance resting beside it; midground: al-Khwarizmi writing thoughtfully; background: shelves of books in the lamplit House of Wisdom',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'The scholar writes flowing script on parchment beside a brass balance, composing his book of balancing rules.',
    },
    {
      text: 'Al-Khwarizmi shared other big ideas in that house of books. He helped teach the counting numbers we still use today. One, two, three, all the way up, each in its tidy place. People far away copied his books, word by word, for hundreds of years. Even our word “algorithm,” for a set of careful steps, comes from his own name. A quiet scholar and his dates left the whole world a gift.',
      scene: {
        id: 'the-balancing-puzzle-p10-legacy',
        focus: 'travelers carrying copies of the scholar’s books out into the wide world',
        composition:
          'Foreground: bound books and a page of numerals passing from hand to hand; midground: al-Khwarizmi offering a book with a gentle smile; background: an arched doorway opening onto a starlit Baghdad street and distant lands',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'People carry copies of the scholar’s books and numerals through an arched doorway into a wide, starlit world.',
    },
    {
      text: 'Balancing puzzles are hiding all around you, even now. A seesaw is a balance, and so are the scales at a market. When you share fairly, one for you and one for me, that is balancing too. So look for it tomorrow, out in the busy world. “What one side gets, the other side gets too,” you can whisper. You are thinking a little like al-Khwarizmi.',
      cue: 'Tomorrow, spot a balance: a seesaw, a scale, or sharing snacks fairly. What did you find?',
      scene: {
        id: 'the-balancing-puzzle-p11-find-it',
        focus: 'children on a seesaw and a market scale, echoing the brass balance',
        composition:
          'Foreground: two children balanced on a seesaw, a small market scale nearby holding equal fruit; midground: the same brass balance faintly imagined above them; background: a bright Baghdad marketplace under morning light',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'Two children balance on a seesaw beside a market scale, echoing the fair brass balance from the story.',
    },
    {
      text: 'That night, the brass pans hung empty and even in the House of Wisdom. A thread of moonlight rested on the quiet beam. Al-Khwarizmi tucked his books away and settled onto a soft cushion. Both sides were still now, with nothing to add and nothing to take. Tomorrow he would find a new number puzzle to solve. For now, the fair balance did not stir. Goodnight, and sleep snug.',
      scene: {
        id: 'the-balancing-puzzle-p12-moonlit-rest',
        focus: 'an empty level balance in a moonlit Baghdad library as the scholar rests',
        composition:
          'Foreground: an empty brass balance hanging perfectly level with a thread of moonlight on the beam; midground: al-Khwarizmi resting on a cushion with closed eyes; background: the arched House of Wisdom under a calm crescent moon',
        palette: 'indigo, brass, parchment, date brown, and moonlit teal',
      },
      alt: 'An empty brass balance hangs level under a crescent moon while the scholar rests snug on a cushion.',
    },
  ],
};
