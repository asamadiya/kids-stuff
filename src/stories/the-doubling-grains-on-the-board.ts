import type { Story } from '../types';

export const theDoublingGrainsOnTheBoard: Story = {
  slug: 'the-doubling-grains-on-the-board',
  title: 'The Doubling Grains on the Board',
  subtitle: 'An old Indian tale of the sage Sessa and the chaturanga board.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'One more square, and twice as many',
  readAloudMinutes: 9,
  learningTakeaway:
    'To double a number, add it to itself, so the pile before it fits inside the next one twice. Starting from one, doubling counts out one, two, four, eight, sixteen, growing faster and faster. This runaway kind of growth is called exponential, and even tiny starts can become gigantic totals.',
  heartTakeaway:
    'Noticing a clever pattern is wonderful, and knowing when to pause a playful idea is wise too.',
  grownUpFact:
    'This is a teaching legend, not a recorded event. Old tales from India tell of a sage often named Sessa (or Sissa ibn Dahir) who is said to have shown a ruler the board game chaturanga, an early ancestor of chess that flourished in India by about the 7th century. In the story, Sessa asks only for grain, doubled on each of the 64 squares. One of the earliest written versions we have was recorded much later, around 1256, by the writer Ibn Khallikan. Doubling this way is exponential growth: the full board would need 2^64 minus 1 grains, roughly 18 quintillion (18,446,744,073,709,551,615), far more wheat than has ever been harvested. Mathematicians call the point where the numbers explode "the second half of the chessboard." We keep the piles tiny here, only 1, 2, 4, and 8, and picture the rest.',
  pages: [
    {
      text: 'Long ago in India, storytellers shared a tale under warm lamplight. This is a legend, not a record, the kind grandparents still love to tell. In the tale, a wise old sage named Sessa built a board game called chaturanga. It had sixty-four little squares in tidy rows, and small carved pieces. Long ago it grew popular across India, and it slowly traveled far. Over many years, in faraway lands, people changed it into the game we now call chess.',
      cue: 'Chaturanga grew up to become chess. Have you ever seen a checkered board like that?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p1',
        focus: 'the sage Sessa presenting the sixty-four-square chaturanga board to a curious ruler',
        composition:
          'Foreground: a square chaturanga board with rows of small squares and a few carved game pieces; midground: the kind old sage Sessa beside a seated ruler leaning in; background: a columned lamplit hall with quiet rolled manuscripts',
        palette: 'warm ochre, manuscript cream, and leaf green',
      },
      alt: 'An old sage shows a sixty-four-square board game with carved pieces to a seated ruler leaning in with interest, inside a lamplit hall.',
    },
    {
      text: 'The ruler loved the clever new game and wished to give a grand reward. He offered gold, or jewels, or land, whatever the sage might name. But Sessa only smiled and asked for something that sounded very small. "Just a little grain, great king, counted onto the board," he said. "One grain on the first square, and then a simple rule after that." A curious child sitting nearby leaned close to hear the surprising rule.',
      cue: 'If a king offered you gold or grain, which would you choose? Why?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p2',
        focus: 'the ruler offering treasures while Sessa gently asks only for grain',
        composition:
          'Foreground: an open chest of gold and jewels beside a plain bowl of grain; midground: Sessa bowing kindly as the ruler gestures generously; background: a curious child peeking from behind a column in the lamplit hall',
        palette: 'saffron gold, deep ruby, and soft cream',
      },
      alt: 'A ruler gestures toward a chest of gold and jewels while a smiling sage points instead to a plain bowl of grain, with a child peeking nearby.',
    },
    {
      text: 'Sessa explained his rule slowly, so everyone could picture it. "Put one grain on square one, then twice as many on the next." "Then twice as many again, all the way across the board." The king laughed, thinking this was a tiny, easy gift to give. He waved for grain to be brought, sure it would fill only a bowl. The child whispered the rule to remember it. "One more square, and twice as many."',
      scene: {
        id: 'the-doubling-grains-on-the-board-p3',
        focus: 'Sessa explaining the doubling rule as the king laughs and waves for grain',
        composition:
          'Foreground: the empty board and a single grain held between two fingers above square one; midground: Sessa explaining calmly as the king laughs and beckons; background: a servant carrying a light bowl of grain toward them',
        palette: 'warm ochre, clay brown, and indigo',
      },
      alt: 'A sage holds one grain above the first square of a board while a king laughs and waves for grain, and a servant brings a small bowl.',
    },
    {
      text: 'So the counting began, gentle and slow, one square at a time. One grain went on the first square, sitting all alone. Two grains went on the second square, standing close together. Pat, pat. Four grains gathered on the third square in a slightly bigger pile. The child pressed fingertips down to match the count, one, two, four. Each new pile was simply the pile before it, added to itself.',
      cue: 'Count with your fingers: one, then two, then four. Each number is the one before, twice.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p4',
        focus: 'a hand placing one, two, and four grains on the first three squares',
        composition:
          'Foreground: three squares holding piles of one, two, and four grains; midground: a child pressing fingertips to count along; background: a low wooden desk and soft lamplit columns',
        palette: 'saffron cloth, clay brown, and peacock blue',
      },
      alt: 'A hand places one grain, then two, then four across three squares while a child counts along by pressing fingertips down.',
    },
    {
      text: 'On the fourth square, eight grains made a small heap the size of a thumbnail. One, two, four, eight, the first four squares were done. The child looked proud, but Sessa gently pointed further along the board. "We have used only four squares," he said. "Sixty more are waiting." "One more square, and twice as many," the child repeated, counting on. Sixteen would come next, then thirty-two, then sixty-four, growing so fast.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p5',
        focus: 'four grain piles counting one, two, four, eight, with many empty squares waiting',
        composition:
          'Foreground: four grain piles across four squares showing one, two, four, and eight; midground: Sessa pointing along the long row of empty squares still to come; background: the child gazing at the many waiting squares in a calm hall',
        palette: 'muted gold, rose earth, and peacock blue',
      },
      alt: 'Four grain piles count one, two, four, and eight while a sage points along many empty squares still waiting on the long board.',
    },
    {
      text: 'At first the piles seemed small and easy, just a handful here and there. But doubling has a secret surprise hiding inside it. Every step does not add a little, it adds everything again. So the numbers start slow, then leap up, faster and faster. By the tenth square there are more than a thousand grains in one pile. Grown-ups have a name for this runaway growing. They call it exponential.',
      cue: 'Try it: start at 1 and keep doubling out loud. How fast do the numbers get big?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p6',
        focus: 'grain piles growing from tiny to towering as the doubling races ahead',
        composition:
          'Foreground: a row of squares where piles rise from a few grains into a small mound; midground: the child watching the piles climb with wide eyes; background: the board stretching away toward tall dim columns',
        palette: 'amber gold, dusky coral, and plum',
      },
      alt: 'A row of grain piles grows from tiny handfuls into a small mound as a wide-eyed child watches the doubling race ahead across the board.',
    },
    {
      text: 'The palace grain-keeper started counting bags, then baskets, then whole carts. Halfway across the board, the piles were already taller than the walls. But the second half of the board is where things truly explode. Each of those squares would need more grain than the whole kingdom held. The king had promised something no field on Earth could ever grow. His easy little gift had become impossibly, dizzyingly enormous.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p7',
        focus: 'grain-keepers hauling carts as piles rise past the palace walls',
        composition:
          'Foreground: overflowing baskets and a tipping cart of grain beside the board; midground: worried grain-keepers hauling more as piles rise past the walls; background: the king watching, his easy smile fading into surprise',
        palette: 'dusky coral, brass, and lamp amber',
      },
      alt: 'Grain-keepers haul overflowing carts and baskets as piles rise past palace walls, while a surprised king watches his easy gift grow huge.',
    },
    {
      text: 'The very last square alone would need a truly staggering number of grains. Written out, the whole board would ask for about eighteen quintillion grains. That is an eighteen followed by eighteen more digits, a number too long to say quickly. It is far more wheat than all the farmers on Earth have ever harvested. Piled up, it could bury great mountains under a mighty golden sea. From one tiny grain, doubling had grown into something almost unimaginable.',
      cue: 'Eighteen quintillion is a number with nineteen digits. Can you count to a hundred first?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p8',
        focus: 'an imagined golden sea of grain flowing over hills and rooftops',
        composition:
          'Foreground: the small real board with four modest piles for scale; midground: a dreamlike wave of golden grain rising behind it; background: hills and rooftops half-buried under an endless shimmer of grain',
        palette: 'glowing wheat gold, warm amber, and soft sky blue',
      },
      alt: 'Behind a small board with four modest grain piles, a dreamlike golden sea of grain rises over hills and rooftops in an endless shimmer.',
    },
    {
      text: 'The king rubbed his eyes, amazed that so small a rule could grow so wild. He saw that Sessa had taught him something cleverer than any pile of gold. A gentle pattern, followed patiently, can outgrow a whole kingdom. Some tellers say the king smiled and made the wise sage his royal adviser. It is only a tale, so its ending changes from teller to teller. But the number lesson inside it has stayed true for over a thousand years.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p9',
        focus: 'the king honoring Sessa, understanding the hidden lesson',
        composition:
          'Foreground: the modest four-pile board resting between them; midground: the king bowing slightly toward Sessa with new respect; background: the curious child grinning in the softly lamplit hall',
        palette: 'soft vermilion, brass, and leaf green',
      },
      alt: 'A king bows with new respect toward the sage Sessa across a small four-pile board while a grinning child watches in a lamplit hall.',
    },
    {
      text: 'This tale is very old, told in India long before it was ever written down. One of the first to write it lived far away and long ago, around eight hundred years back. His name was Ibn Khallikan, and he set the doubling story onto a page. That is why we call it a legend, a lesson dressed up as a story. The wise trick was never really done, but it teaches something wonderfully real. "One more square, and twice as many," the child whispered, remembering.',
      scene: {
        id: 'the-doubling-grains-on-the-board-p10',
        focus: 'a writer long ago recording the old doubling tale onto a page',
        composition:
          'Foreground: an open manuscript with a small drawn board and rows of dots; midground: a writer at a desk copying the tale by lamplight; background: shelves of rolled scrolls fading into warm shadow',
        palette: 'manuscript cream, sepia ink, and lamp amber',
      },
      alt: 'A writer at a lamplit desk copies the old doubling tale onto a manuscript that shows a small board and rows of dots, near shelves of scrolls.',
    },
    {
      text: 'Doubling is not just a story trick, it hides in the real world too. A single tiny water plant can double each day and cover a whole pond. Fold a paper in half again and again, and its thickness doubles every time. Inside computers, numbers double the very same way, one, two, four, eight. That is why one small idea can spread across the whole world so quickly. The same pattern from Sessa’s board is working all around us.',
      cue: 'Fold a sheet of paper in half, then again. Feel how fast it gets thick?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p11',
        focus: 'everyday doublings shown together: pond plants, folded paper, and computer dots',
        composition:
          'Foreground: a folded paper growing thicker in stacked halves; midground: a pond half-covered by doubling green leaves; background: a soft glowing pattern of one, two, four, eight dots like tiny lights',
        palette: 'leaf green, paper white, and gentle blue',
      },
      alt: 'A folded paper thickens in halves beside a pond covered by doubling leaves, with a glowing pattern of one, two, four, eight dots behind them.',
    },
    {
      text: 'So the next time you see a checkered board, remember Sessa and his grains. Every square holds a quiet secret about how fast numbers can grow. You do not need a whole kingdom of wheat to feel the wonder of it. Just start with one, then double, and watch where the pattern leads. From one small grain, a giant idea grew and traveled the whole world. And it all began with a simple, playful rule to remember.',
      cue: 'Look for doubling out in the world this week. What else grows twice as fast each step?',
      scene: {
        id: 'the-doubling-grains-on-the-board-p12',
        focus: 'a child looking out at the world, imagining doubling patterns everywhere',
        composition:
          'Foreground: a checkered board with four small grain piles and one bright grain on square one; midground: the child at a doorway looking outward, wondering; background: a wide bright world of fields, rooftops, and open sky',
        palette: 'warm gold, fresh green, and clear morning blue',
      },
      alt: 'A child stands at a bright doorway beside a checkered board with four grain piles, gazing at a wide world of fields and sky, imagining doubling.',
    },
  ],
};
