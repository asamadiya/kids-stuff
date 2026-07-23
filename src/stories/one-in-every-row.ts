import type { Story } from '../types';

export const oneInEveryRow: Story = {
  slug: 'one-in-every-row',
  title: 'One in Every Row',
  subtitle: 'Seki Takakazu arranges a number board in Edo, Japan, so every line follows one rule.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'One of each, row by row',
  readAloudMinutes: 5,
  learningTakeaway:
    'A picture board can follow a rule where every row and every column holds one moon, one flower, and one bird. When you check line by line, a repeated picture shows you exactly where the pattern still needs fixing.',
  heartTakeaway:
    'Checking one line at a time turns a small mistake into a helpful clue, so a careful, patient mind can finish a puzzle that a quick glance would rush.',
  grownUpFact:
    'Seki Takakazu (1642–1708) was a real mathematician who lived in Edo, now Tokyo, Japan. Around 1683 he studied magic squares and other ways to arrange numbers so each line follows a rule. This story is a gentle tale that borrows his love of ordered grids; it uses only a simple preschool picture board. The tidy "one of each in every row and column" pattern is called a Latin square, a name given later by Leonhard Euler in the 1780s, so the story makes no claim that Seki invented it.',
  pages: [
    {
      text: 'Long ago in Edo, in old Japan, a quiet man named Seki loved to arrange numbers. Maybe it happened just this way, maybe not. It is a gentle tale to tell at night. One evening he set out a low wooden board with nine spaces. Beside it lay three moon tiles, three flower tiles, and three bird tiles. He would make every line hold one of each. "One of each, row by row," Seki said softly.',
      cue: 'Look at the nine empty spaces. Can you count them with me, one by one?',
      scene: {
        id: 'one-in-every-row-p1-invitation',
        focus: 'Seki placing moon, flower, and bird tiles across the top row of a nine-space board',
        composition:
          'Foreground: a low nine-space wooden board with three groups of picture tiles; midground: Seki kneeling and choosing tiles; background: a plain paper screen and quiet garden stones under a warm evening sky',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man in old Japan kneels at a nine-space board, placing a moon, a flower, and a bird tile across the top row.',
    },
    {
      text: 'For the middle row, Seki began with a flower, then a bird, then a moon. Tok, tok, tok went the wooden tiles. He pointed across the line and named the pattern: flower, bird, moon. No picture showed up twice there. The top two rows looked different, yet they followed the very same rule. Seki smiled, because a good pattern can repeat itself in many gentle ways.',
      cue: 'Point across three spaces with me and name one moon, one flower, one bird.',
      scene: {
        id: 'one-in-every-row-p2-try',
        focus: 'two completed rows on the board, each holding the three pictures in a shifted order',
        composition:
          'Foreground: the top and middle tile rows filled, three empty spaces waiting below; midground: Seki pointing across the middle row; background: a dusky paper screen and a tray of remaining tiles',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'Two filled rows sit on a board, each with a moon, flower, and bird in a different order, and three empty spaces below.',
    },
    {
      text: '"One of each, row by row." Seki looked down the columns too, not just across. The first column showed moon, then flower, then one empty space. The second showed flower, then bird, then one empty space. Each empty space gave him a quiet clue about what could come next. The pattern had to work looking down as well as looking across.',
      scene: {
        id: 'one-in-every-row-p3-observe',
        focus: 'two columns showing picture pairs stacked above two empty bottom spaces',
        composition:
          'Foreground: the first two columns of the board with the bottom cells still empty; midground: Seki looking downward along the columns; background: the remaining bird, moon, and flower tiles resting on a cloth',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man studies two columns of a board, each showing two stacked pictures above an empty bottom space.',
    },
    {
      text: 'Seki filled the bottom row with moon, moon, and flower. Then he stopped to check. That row had two moons and no bird at all. The first column now repeated the moon as well. He felt a small, gentle pinch of disappointment. Yet the repeated picture was truly a friend. It pointed straight at the one spot where the pattern had wandered off the rule.',
      scene: {
        id: 'one-in-every-row-p4-problem',
        focus: 'a bottom row holding two moon tiles and one flower, with no bird',
        composition:
          'Foreground: two moon tiles and a flower tile filling the bottom row; midground: Seki comparing the bottom row with the first column; background: an unused bird tile waiting quietly in the tray',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A bottom row on the board holds two moon tiles and one flower, while a lone bird tile waits unused nearby.',
    },
    {
      text: 'Seki asked himself a small question. "Which picture repeats, and which one is missing?" The moon repeated, and the bird was gone. So he lifted the first moon from the bottom row and set the waiting bird in its place. "One of each, row by row." Now the bottom line read bird, moon, flower. The first column read moon, flower, bird, calm and correct.',
      cue: 'Which tile should replace the extra moon: a moon, a flower, or a bird?',
      scene: {
        id: 'one-in-every-row-p5-help',
        focus: 'Seki swapping one moon tile out and setting the missing bird into its place',
        composition:
          'Foreground: a lifted moon tile and a bird tile settling into the empty space; midground: Seki making the careful swap; background: the corrected bottom row and a now-complete first column',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A hand lifts a moon tile out of the bottom row and lowers a bird tile into its place on the board.',
    },
    {
      text: 'Seki checked all six lines: three across and three down. Each one held one moon, one flower, and one bird. "One of each, row by row." The board was finished because the same simple rule worked from both directions. No tile was prettier or more important than another. Every picture just took its own fair turn, once in each line, the way a good pattern always should.',
      scene: {
        id: 'one-in-every-row-p6-understand',
        focus: 'the completed nine-tile board checked both across and down',
        composition:
          'Foreground: the full nine-tile board with all three picture types placed; midground: Seki tracing the rows and columns in the air with a fingertip; background: a rising moon beyond the paper screen',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A complete nine-tile board sits finished as a man traces its rows and columns in the air beneath a rising moon.',
    },
    {
      text: 'Before sleep, Seki returned the moons, flowers, and birds to three small cloth pouches. He left the empty board beside them, its nine spaces quiet under the moon. One crescent-shaped pouch cord curled like a sleepy smile in the lamplight. The busy little pattern was solved, and now it could rest. Seki closed his tired eyes and grew still and cozy. Goodnight, quiet board. Goodnight.',
      scene: {
        id: 'one-in-every-row-p7-sleep',
        focus: 'Seki resting beside three closed tile pouches and an empty nine-space board',
        composition:
          'Foreground: three closed cloth pouches and the empty nine-space board; midground: Seki settling to sleep beneath a soft quilt; background: a crescent pouch cord and a moonlit paper screen',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man rests under a soft quilt beside three closed pouches and an empty board, a crescent cord curling in the moonlight.',
    },
  ],
};