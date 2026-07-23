import type { Story } from '../types';

export const theEyeShapedFractions: Story = {
  slug: 'the-eye-shaped-fractions',
  title: 'The Eye-Shaped Fractions',
  subtitle: 'The real scribe Ahmes copies fraction puzzles onto papyrus in ancient Egypt.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Half, then half again',
  readAloudMinutes: 5,
  learningTakeaway:
    'When you split one equal share in half, you make two smaller pieces that still match. Halving again makes even smaller equal pieces, and every piece stays the same size as its partner.',
  heartTakeaway:
    'Fair sharing grows from matching pieces carefully, noticing when something is uneven, and patiently trying again.',
  grownUpFact:
    'A real scribe named Ahmes (also written Ahmose) copied the Rhind Mathematical Papyrus around 1550 BCE, saying he copied it from an older text about 1850 BCE. It is a practical arithmetic manual full of unit fractions like 1/2, 1/4, and 1/8. The tidy Eye-of-Horus halving series (1/2, 1/4, 1/8, and on) is a later, modern teaching idea, not a documented ancient method, so this story frames the eye shape gently as a picture, not a real Egyptian lesson.',
  pages: [
    {
      text: 'Long ago in Egypt, a real scribe named Ahmes sat by a low table. Warm evening light fell across his rolls of papyrus. Ahmes copied number puzzles, one careful line at a time. Tonight he pictured a round loaf of bread to share. He drew a gentle eye-shaped frame around it, just for fun. The frame was only a picture. The real work was making equal pieces to count.',
      cue: 'Trace a round shape in the air with your finger, like the loaf Ahmes drew on his page.',
      scene: {
        id: 'the-eye-shaped-fractions-p01-scribe-evening',
        focus: 'the scribe Ahmes drawing a round bread loaf inside an eye-shaped frame on papyrus',
        composition:
          'Foreground: a papyrus sheet with a round bread drawing inside a soft eye-shaped frame and a reed pen; midground: Ahmes seated cross-legged, copying carefully; background: a Nile-side room glowing in golden evening light',
        palette: 'papyrus cream, lapis blue, and warm bread gold',
      },
      alt: 'A calm Egyptian scribe draws a round loaf inside an eye-shaped frame on papyrus in a warm evening room.',
    },
    {
      text: 'Ahmes folded his bread picture so one edge met the other. Fold-swish. When the page opened, one line made two matching pieces. He counted them softly, one and two. Neither piece was larger than the other. Equal edges had made equal shares. On his real papyrus, scribes wrote such shares as one-half, a friendly little number.',
      scene: {
        id: 'the-eye-shaped-fractions-p02-first-fold',
        focus: 'Ahmes opening a bread picture folded into two equal halves',
        composition:
          'Foreground: two matching bread halves with a single center fold line and two counting pebbles; midground: Ahmes checking that the edges line up; background: writing tools resting quietly beyond the table',
        palette: 'warm ochre, linen white, and soft blue',
      },
      alt: 'The scribe opens a bread picture folded into two matching halves, counting the equal pieces.',
    },
    {
      text: 'Ahmes wondered what four friends would need. He folded one half across the other. "Half, then half again," he whispered. Now the bread picture opened into four small matching parts. He counted them, one, two, three, four. The pieces were smaller now, yet the shares were still equal. Halving again had simply made more little pieces of the same size.',
      cue: 'Count to four with me, slow and gentle, one number for each little piece.',
      scene: {
        id: 'the-eye-shaped-fractions-p03-second-halving',
        focus: 'a bread picture opened into four equal folded parts',
        composition:
          'Foreground: a four-part bread circle with two crossing fold lines and four pebbles, one on each part; midground: Ahmes placing a pebble on each equal piece; background: long dusk shadows stretching across the table',
        palette: 'sand gold, coral, and deep evening blue',
      },
      alt: 'A bread picture is folded into four equal parts, with one pebble resting on each matching piece.',
    },
    {
      text: 'Then Ahmes folded a little too quickly. One edge missed the other, and the new pieces came out crooked. A pebble sat on a wide piece while another wobbled on a narrow one. "That does not look fair," Ahmes said quietly. He did not hide the uneven fold beneath the pretty frame. A good scribe tells the truth about the numbers on the page.',
      cue: 'Point to the wider piece, then the thinner piece. What should Ahmes fix before sharing?',
      scene: {
        id: 'the-eye-shaped-fractions-p04-uneven-fold',
        focus: 'Ahmes comparing one wide and one narrow folded piece',
        composition:
          'Foreground: a crooked off-center fold with one clearly wide region and one narrow region; midground: Ahmes frowning gently at the mismatch; background: a dim window and the still, dusky Nile',
        palette: 'soft violet, clay red, and quiet parchment',
      },
      alt: 'The scribe frowns gently at a crooked fold that made one wide piece and one narrow piece.',
    },
    {
      text: 'Ahmes smoothed the papyrus and began again. He matched the edges carefully before pressing each fold. Pat. "Half, then half again." Four equal parts returned to the page. He counted them once more, and every piece matched its partner. The pebbles rested neatly, one on each share. Patient hands had solved the puzzle, and each part was fair.',
      scene: {
        id: 'the-eye-shaped-fractions-p05-careful-repair',
        focus: 'Ahmes remaking four equal shares with carefully aligned folds',
        composition:
          'Foreground: a smoothed page with centered crossing folds and four evenly spaced pebbles; midground: Ahmes pressing a careful fold with steady hands; background: the first oil lamp glowing beside the table',
        palette: 'lamp amber, papyrus cream, and calm indigo',
      },
      alt: 'The scribe carefully remakes four equal shares, with a pebble resting evenly on each matching piece.',
    },
    {
      text: 'Ahmes fitted the four bread pieces back inside the eye-shaped frame. The frame looked whole, while the fold lines showed each equal part. "Half, then half again." He remembered that Egyptian scribes worked many sharing puzzles onto papyrus. His pretty frame was only a picture, drawn for the fun of counting. The real gift was the fair, matching numbers underneath.',
      scene: {
        id: 'the-eye-shaped-fractions-p06-whole-and-parts',
        focus: 'four equal bread pieces fitting inside the whole eye-shaped frame',
        composition:
          'Foreground: a complete eye-shaped frame holding four equal bread regions with soft fold lines; midground: Ahmes viewing the finished page with a gentle smile; background: a low moon rising over the quiet Nile',
        palette: 'moon silver, lapis, and wheat gold',
      },
      alt: 'Four equal bread pieces rest inside a whole eye-shaped frame while the scribe looks on gently.',
    },
    {
      text: 'At last Ahmes rolled his papyrus and set his reed pen down. He curled up on a linen mat nearby. Moonlight crossed the covered page in two soft lines, like folds that no longer needed opening. The fair shares were finished for the night. His breathing grew slow and even, and the warm room became still and quiet. Goodnight, gentle scribe.',
      scene: {
        id: 'the-eye-shaped-fractions-p07-sleepy-goodnight',
        focus: 'Ahmes asleep beside his rolled papyrus and resting reed pen',
        composition:
          'Foreground: a rolled papyrus and a quiet reed pen on the low table; midground: Ahmes sleeping softly on a linen mat; background: a moonlit Nile window with two gentle bands of light',
        palette: 'midnight blue, linen cream, and muted warm gold',
      },
      alt: 'The scribe sleeps snugly on a linen mat beside his rolled papyrus under soft, quiet moonlight.',
    },
  ],
};