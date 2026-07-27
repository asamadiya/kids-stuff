import type { Story } from '../types';

export const aryabhataCircleNumber: Story = {
  slug: 'aryabhata-circle-number',
  title: 'The Circle Number That Comes Close',
  subtitle: 'The young scholar Aryabhata measures a circle and finds a number that comes close.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Around is a little past three across',
  readAloudMinutes: 9,
  learningTakeaway:
    'The distance all the way around any circle is a little more than three times the distance straight across it. That number is close to three and a bit, and it never lands on a simple, exact answer.',
  heartTakeaway:
    'A careful, honest answer that comes close is far better than a proud answer that only looks perfect. It is fine for a true number to keep a tiny secret.',
  grownUpFact:
    'Aryabhata (born 476 CE) lived at Kusumapura, traditionally linked with Pataliputra near modern Patna. In his Aryabhatiya, written in 499 CE at age 23, he gave the ratio of a circle’s circumference to its diameter as about 3.1416, from the computation 62832 ÷ 20000, and called it “asanna” — approaching, or approximate — showing he understood it was not exact. His verse gives the recipe as (100 + 4) × 8 + 62000, over a diameter of 20000. Centuries later, mathematicians proved this number, now written with the Greek letter pi, truly has no exact simple value.',
  pages: [
    {
      text:
        'Long ago in India, a young scholar named Aryabhata lived in a busy river town. People called the town Kusumapura, and it sat near the great city of Pataliputra. Aryabhata was clever and calm, with quick, curious eyes. By day he watched the wide sky and counted the slowly turning stars. By night he studied by the soft glow of an oil lamp. Everywhere he looked, he saw round things and quietly wondered about them. Pots and wheels and the moon all shared one lovely shape.',
      cue: 'Look around your room. Can you point to something round, just like Aryabhata did?',
      scene: {
        id: 'aryabhata-circle-number-p1',
        focus: 'young Aryabhata gazing thoughtfully at the evening sky from his courtyard',
        composition:
          'Foreground: a low oil lamp and an open palm-leaf book on packed earth; midground: Aryabhata seated cross-legged, looking upward; background: a modest Kusumapura courtyard with a river and turning stars beyond',
        palette: 'warm lamp-gold and deep indigo evening with soft star silver',
      },
      alt: 'A calm young scholar sits cross-legged in a lamplit courtyard, looking up at a starry evening sky above a quiet river town.',
    },
    {
      text:
        'One warm evening, Aryabhata knelt down in the courtyard’s cool, packed dust. He pushed a little wooden peg into the ground to mark the middle. Then he tied a length of cord to the peg and pulled it tight. Round and round the cord swept, smooth and even as the rising moon. When it came back to the start, a wide circle lay drawn in the earth. “How far is it all the way around?” he wondered aloud. “And how far is it straight across the very middle?”',
      scene: {
        id: 'aryabhata-circle-number-p2',
        focus: 'Aryabhata drawing a wide circle in the dust with a peg and cord',
        composition:
          'Foreground: a wooden peg at the center and a taut cord sweeping a circle in the earth; midground: Aryabhata kneeling, one hand guiding the cord; background: a low mud-brick wall and a soft rising moon',
        palette: 'earthy ochre and dust brown under a gentle moonlit blue',
      },
      alt: 'A kneeling young scholar draws a wide circle in the dust using a wooden peg at the center and a taut cord.',
    },
    {
      text:
        'First he measured straight across, from one edge to the other edge. That distance passes right through the middle, and it is called the width. Aryabhata pinched the cord to save exactly that one width. Then he laid the saved cord all the way around the round outside. He counted how many widths would fit around the edge. One width. Two widths. Three whole widths. And then a small, stubborn bit was still left over at the end.',
      cue: 'Count along with Aryabhata: one, two, three… and a little bit more!',
      scene: {
        id: 'aryabhata-circle-number-p3',
        focus: 'the cord laid straight, showing three widths and a small leftover piece',
        composition:
          'Foreground: a straight cord along three equal width-marks with a small extra tail at the end; midground: Aryabhata pointing at the little leftover, smiling; background: the drawn circle and a warm lamp on the ground',
        palette: 'warm honey lamplight over soft dust and shadowed blue',
      },
      alt: 'A cord lies straight beside three equal width marks with a small leftover piece, as the smiling scholar points to it.',
    },
    {
      text:
        'That little extra piece simply would not sit still or behave. It was not a tidy half, and it was not a neat, round number. So he wiped the dust smooth and drew a brand new circle. He measured it again, careful and slow and patient. Three whole widths fit around, and then the same small bit was left. Around is a little past three across, he whispered, half puzzled and half delighted. The circle seemed to be keeping a gentle little secret from him.',
      scene: {
        id: 'aryabhata-circle-number-p4',
        focus: 'Aryabhata redrawing a circle and finding the same leftover appear again',
        composition:
          'Foreground: a freshly smoothed patch of dust with a new circle and one small leftover mark; midground: Aryabhata leaning close, eyebrows raised in wonder; background: the old circle fading and a steady lamp flame',
        palette: 'deepening dusk violet with warm amber lamp highlights',
      },
      alt: 'A young scholar redraws a circle in the dust and finds the very same small leftover piece appear once more.',
    },
    {
      text:
        'Then Aryabhata tried a small circle, no wider than his open hand. He tried a huge circle that filled the whole courtyard floor. He drew a lopsided one and a perfectly round one too. Each time he counted the widths, the answer never changed at all. Three widths fit around, and always that same small bit was left. Around is a little past three across, every single time he checked. Big or small, near or far, the circle kept its steady promise.',
      cue: 'Wonder together: do you think a giant circle and a tiny circle share the same secret number?',
      scene: {
        id: 'aryabhata-circle-number-p5',
        focus: 'Aryabhata comparing a tiny circle and a huge circle, both showing the same leftover',
        composition:
          'Foreground: a hand-sized circle and a courtyard-wide circle side by side, each with a matching little leftover mark; midground: Aryabhata glancing between them with wonder; background: soft courtyard shadows and a steady lamp',
        palette: 'soft twilight blue with warm amber lamp highlights',
      },
      alt: 'A young scholar looks between a tiny circle and a huge circle drawn in the dust, each showing the same small leftover.',
    },
    {
      text:
        'This was the wonderful thing, the same for every circle in the world. The way around always beats the way across by a little more than three. A cartwheel obeys it, a clay pot obeys it, and the round full moon obeys it too. Aryabhata wanted to catch that little leftover as exactly as he could. Cord and dust could only measure so close before the marks grew fuzzy. So he set his cord aside and reached instead for numbers.',
      scene: {
        id: 'aryabhata-circle-number-p6',
        focus: 'Aryabhata glancing from a cartwheel and clay pot toward his palm-leaf and stylus',
        composition:
          'Foreground: a coiled measuring cord set down beside a palm-leaf page and a slim stylus; midground: Aryabhata turning from the drawn circle toward his writing; background: a leaning cartwheel, a round clay pot, and the low lamp',
        palette: 'warm ochre and lamp-gold against a calm dusk indigo',
      },
      alt: 'A young scholar sets his cord aside and turns toward a palm-leaf page, a cartwheel and round pot resting behind him.',
    },
    {
      text:
        'On his palm-leaf, Aryabhata built a careful recipe out of plain whole numbers. He took one hundred, and to it he gently added four. He multiplied that sum by eight, standing tall and even. Then he added sixty-two thousand more to the growing total. All of that he shared out over twice ten thousand. Out came a number very, very close to the true leftover. It was three, and then a small, trailing tail of more.',
      scene: {
        id: 'aryabhata-circle-number-p7',
        focus: 'Aryabhata writing his calculation on a palm-leaf by lamplight',
        composition:
          'Foreground: a palm-leaf page and a slim stylus with faint counting marks; midground: Aryabhata leaning in, brow gently focused; background: the drawn circle glowing softly at the edge of the lamplight',
        palette: 'rich lamp-gold pages against a quiet nighttime indigo',
      },
      alt: 'The young scholar leans over a palm-leaf page, working out a careful calculation by warm lamplight.',
    },
    {
      text:
        'His number came out as three, and then a whisper more beside it. Written our way today, it is close to three point one four one six. Around is a little past three across, and now he knew it more sharply than before. Yet even this fine answer did not stop at a clean, tidy end. The tiny tail kept going, quiet and shy, past where his cord could ever reach. Aryabhata smiled, for he had guessed that all along.',
      scene: {
        id: 'aryabhata-circle-number-p8',
        focus: 'the calculated number glowing on the palm-leaf as Aryabhata studies its endless tail',
        composition:
          'Foreground: a palm-leaf showing a value beginning three and a trailing row of tiny marks; midground: Aryabhata resting his chin on his hand, studying it; background: the softly glowing circle and the steady lamp',
        palette: 'honey-gold page light within a deep, quiet indigo',
      },
      alt: 'A young scholar studies a number on his palm-leaf that begins with three and trails off into an endless tail.',
    },
    {
      text:
        'He gave that careful idea a soft and honest name in his old language. He called his answer asanna, a word that means “coming close.” It was not a proud, perfect answer, but a true and gentle one instead. The circle keeps one tiny secret it will never fully tell. And that, Aryabhata decided, is perfectly fine and good. An honest number that comes close is still a fine and useful thing. A close answer you can trust beats a perfect answer you cannot.',
      scene: {
        id: 'aryabhata-circle-number-p9',
        focus: 'Aryabhata resting a gentle hand near the drawn circle, content and calm',
        composition:
          'Foreground: the completed circle with its center peg and coiled cord; midground: Aryabhata seated peacefully, one hand resting near the circle; background: a warm wall and the low, steady lamp',
        palette: 'soft rosy amber and calm dusk blue',
      },
      alt: 'A content young scholar rests a gentle hand near his drawn circle, its center peg and coiled cord beside him.',
    },
    {
      text:
        'Aryabhata gathered his findings into a great book, all written in short verses. He was only twenty-three years old when he finished writing it down. The book taught how to count, how to measure, and how the sky turns. His verse for the circle number traveled far beyond his river town. Scholars in distant lands read it, tried it, and marveled at how close it came. A young person, sitting in the dust with a cord, had reached something lasting.',
      scene: {
        id: 'aryabhata-circle-number-p10',
        focus: 'Aryabhata binding his palm-leaf verses into a book as its ideas travel outward',
        composition:
          'Foreground: a neat stack of inscribed palm-leaves tied with cord; midground: young Aryabhata holding the finished book with quiet pride; background: faint suggestions of distant readers and far horizons under a starlit sky',
        palette: 'warm gold manuscript light fading into a wide starry indigo',
      },
      alt: 'A young scholar ties his inscribed palm-leaves into a book while faint distant readers and far horizons glow behind him.',
    },
    {
      text:
        'Long after Aryabhata, other thinkers kept chasing that shy little tail of numbers. They found more and more of it, yet it truly never, ever ends. Today we mark this special circle number with one small Greek letter, called pi. Every wheel that rolls and every pizza that is shared still hides pi inside. Around is a little past three across, in every circle you will ever meet. Aryabhata had gently touched a number that belongs to the whole wide world.',
      cue: 'Try it together: wrap string around a round lid, then check how many widths fit across it.',
      scene: {
        id: 'aryabhata-circle-number-p11',
        focus: 'everyday round objects revealing the same hidden circle number',
        composition:
          'Foreground: a child’s hand wrapping string around a round jar lid on a table; midground: a rolling wheel and a shared round pizza nearby; background: a soft ring of stars echoing the circle shape',
        palette: 'warm amber tabletop glow under a gentle starlit blue',
      },
      alt: 'A child wraps string around a round lid on a table, with a rolling wheel and a shared round pizza nearby beneath soft stars.',
    },
    {
      text:
        'That night the oil lamp burned low, and the courtyard grew soft and still. Aryabhata slowly rolled up his cord and looked at his quiet circle in the dust. High above him the big round moon rose, calm and clear and near. He thought of all the circles he had ever measured and all he never would. Wheels, and pots, and the moon, and ripples widening across the river. He gave a sleepy yawn and felt content down to his toes.',
      scene: {
        id: 'aryabhata-circle-number-p12',
        focus: 'Aryabhata coiling his cord as the round moon rises over the still courtyard',
        composition:
          'Foreground: the coiled cord beside the softly fading circle in the dust; midground: Aryabhata rising to stretch, gazing up at the moon; background: a large round moon over still rooftops and a calm river',
        palette: 'cool moonlit blues and silver with a fading warm lamp glow',
      },
      alt: 'The young scholar coils his cord beside a fading circle in the dust as a large round moon rises over the still courtyard.',
    },
    {
      text:
        'Then Aryabhata lay down on his simple mat, warm and drowsy and glad. The whole town hushed, and the river murmured its own soft, endless song. In his sleepy mind, gentle circles turned and turned like slow and friendly wheels. Around is a little past three across, they seemed to hum as he drifted off. He smiled at the kind little secret every circle would always keep. Goodnight, wondering scholar. Goodnight, quiet moon. Goodnight, little circle in the dust.',
      scene: {
        id: 'aryabhata-circle-number-p13',
        focus: 'Aryabhata drifting to sleep as gentle circles turn softly in his dreams',
        composition:
          'Foreground: Aryabhata resting on a simple mat, eyes closed and peaceful; midground: faint dreamlike rings and turning wheels floating above him; background: a large round moon over hushed rooftops and a calm, murmuring river',
        palette: 'deep moonlit indigo and soft silver with a last warm ember of lamplight',
      },
      alt: 'The young scholar sleeps peacefully on a simple mat as gentle dreamlike circles and wheels turn above him under a round moon.',
    },
  ],
};
