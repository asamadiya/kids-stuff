import type { Story } from '../types';

export const oneInEveryRow: Story = {
  slug: 'one-in-every-row',
  title: 'One in Every Row',
  subtitle: 'Seki Takakazu, a real math master in Edo, Japan, arranges a picture board so every line follows one rule.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'One of each, row by row',
  readAloudMinutes: 9,
  learningTakeaway:
    'A picture board can follow a rule where every row and every column holds one moon, one flower, and one bird. When you check line by line, a repeated picture shows you exactly where the pattern still needs fixing. This tidy "one of each in every line" idea is later called a Latin square, and it hides inside puzzles like Sudoku today.',
  heartTakeaway:
    'Checking one line at a time turns a small mistake into a helpful clue, so a careful, patient mind can finish a puzzle that a quick glance would rush.',
  grownUpFact:
    'Seki Takakazu (1642–1708) was a real and famous mathematician who lived in Edo, now Tokyo, Japan, during the Edo period. He worked in the tradition of Japanese mathematics called wasan and is sometimes nicknamed "Japan’s Newton." Around 1683 he studied magic squares and magic circles, arrangements of numbers where every line follows a strict rule, and he developed an early theory of determinants for solving systems of equations. This story is a gentle, invented bedtime tale that borrows his real love of ordered grids; the simple three-by-three picture board is a preschool prop, not a claim about a specific puzzle he solved. The tidy "one of each in every row and column" pattern is called a Latin square, a name given later by Leonhard Euler in the 1780s, and the same rule lives on today in Sudoku. So the story makes no claim that Seki invented the Latin square.',
  pages: [
    {
      text: 'Long ago in Edo, in old Japan, a real math master named Seki loved to arrange numbers. People later called him "Japan’s Newton," because his careful mind saw hidden order everywhere. Maybe this quiet evening happened just so, maybe not. It is a gentle tale to tell at night. Seki set out a low wooden board with nine empty spaces. Beside it lay three moon tiles, three flower tiles, and three bird tiles. "One of each, row by row," he said softly, and began.',
      cue: 'Look at the nine empty spaces. Can you count them with me, one by one?',
      scene: {
        id: 'one-in-every-row-p1-invitation',
        focus: 'Seki kneeling before a nine-space wooden board with three groups of picture tiles ready beside it',
        composition:
          'Foreground: a low nine-space wooden board with three neat groups of moon, flower, and bird tiles; midground: Seki kneeling in a simple robe, choosing his first tile; background: a plain paper screen and quiet garden stones under a warm evening sky',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man in old Japan kneels at a nine-space board, with groups of moon, flower, and bird tiles waiting beside him.',
    },
    {
      text: 'Seki laid the top row first: a moon, then a flower, then a bird. Tok, tok, tok went the smooth wooden tiles. He liked a rule that was simple to say and simple to see. Each line should hold one moon, one flower, and one bird, and never the same picture twice. In his real work, Seki studied number squares much harder than this. But every big idea starts with a small, tidy example you can hold.',
      cue: 'Point across the top row with me. Can you name a moon, a flower, and a bird?',
      scene: {
        id: 'one-in-every-row-p2-top-row',
        focus: 'the top row of the board filled with a moon, a flower, and a bird tile in order',
        composition:
          'Foreground: the top row complete with three different picture tiles; midground: Seki lowering the third tile with careful fingers; background: a dusky paper screen and a tray of the remaining tiles',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'The top row of a board holds a moon, a flower, and a bird tile placed neatly in a line.',
    },
    {
      text: 'For the middle row, Seki began with a flower, then a bird, then a moon. He shifted the order on purpose, like sliding a song up a note. "One of each, row by row," he whispered, checking the line. No picture showed up twice, so the middle row obeyed the rule. The top two rows looked different, yet both followed the very same idea. A good pattern, Seki knew, can repeat itself in many gentle ways.',
      scene: {
        id: 'one-in-every-row-p3-shift',
        focus: 'two completed rows, the middle one shifted so each picture sits under a different neighbor',
        composition:
          'Foreground: the top and middle tile rows filled, three empty spaces waiting below; midground: Seki pointing across the middle row as he counts; background: a soft lantern glow and the remaining tiles resting on cloth',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'Two filled rows sit on a board, each with a moon, flower, and bird in a different order, and three empty spaces below.',
    },
    {
      text: 'Now Seki did the clever thing that made him famous. He did not just look across the rows; he looked down the columns too. The first column showed moon, then flower, then one empty space. The second showed flower, then bird, then one empty space. The rule had to work both ways at once, down as well as across. That is exactly the kind of double-checking Seki loved in his real number squares.',
      cue: 'Trace one column downward with your finger. What two pictures are already there?',
      scene: {
        id: 'one-in-every-row-p4-columns',
        focus: 'two columns of the board showing stacked picture pairs above two empty bottom spaces',
        composition:
          'Foreground: the first two columns filled at top with the bottom cells still empty; midground: Seki looking downward, tracing a column with a fingertip; background: the last bird, moon, and flower tiles resting on a cloth',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man studies two columns of a board, each showing two stacked pictures above an empty bottom space.',
    },
    {
      text: 'Did you know a board like this has a special name? Long after Seki lived, a mathematician named Euler called it a Latin square. In a Latin square, every symbol appears exactly once in each row and each column. It sounds fancy, but you already understand it. One moon, one flower, one bird, in every single line, looking any which way. Seki never used that name, yet he adored the same neat kind of order.',
      scene: {
        id: 'one-in-every-row-p5-latin-square',
        focus: 'the half-finished board glowing as an example of the row-and-column rule',
        composition:
          'Foreground: the board with two full rows and two full columns, bottom row still open; midground: Seki resting a hand near the board, thinking; background: a scroll of brushed number-grids faintly visible on the wall',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A half-finished picture board sits glowing while faint number-grid scrolls hang softly in the background.',
    },
    {
      text: 'Seki filled the bottom row quickly: moon, moon, and flower. Then he stopped to check, the way he always did. That row held two moons and no bird at all. The first column now repeated the moon as well. He felt a small, gentle pinch of disappointment. Yet the repeated picture was truly a friend. A doubled tile pointed straight at the one spot where the pattern had wandered off the rule.',
      scene: {
        id: 'one-in-every-row-p6-problem',
        focus: 'a bottom row holding two moon tiles and one flower, with no bird anywhere',
        composition:
          'Foreground: two moon tiles and a flower tile filling the bottom row; midground: Seki comparing the bottom row with the first column, brow gently furrowed; background: an unused bird tile waiting quietly in the tray',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A bottom row on the board holds two moon tiles and one flower, while a lone bird tile waits unused nearby.',
    },
    {
      text: 'Seki asked himself a small, careful question. "Which picture repeats, and which one is missing?" The moon repeated, and the bird was gone. This is how a good checker thinks, one line at a time, never in a hurry. He did not sweep the whole board away and start over. Fixing one wrong spot is gentler than beginning again. A patient mind trusts the clue that the mistake gives it.',
      cue: 'Which tile should replace the extra moon: a moon, a flower, or a bird?',
      scene: {
        id: 'one-in-every-row-p7-question',
        focus: 'Seki holding the waiting bird tile, studying the doubled moon in the bottom row',
        composition:
          'Foreground: Seki’s hand cupping the bird tile above the two moons; midground: his calm, thinking face lit by the lantern; background: the tidy top rows reminding him of the rule',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man holds a bird tile above a row with two moons, quietly working out which one to replace.',
    },
    {
      text: 'So Seki lifted the first moon from the bottom row. Gently, he set the waiting bird down in its place. "One of each, row by row," he said, pleased. Now the bottom line read bird, moon, flower, all different. The first column read moon, flower, bird, calm and correct. One small swap had healed the whole board. The clue had done its quiet, helpful work, exactly as he trusted it would.',
      scene: {
        id: 'one-in-every-row-p8-fix',
        focus: 'Seki swapping one moon tile out and settling the missing bird into its place',
        composition:
          'Foreground: a lifted moon tile and a bird tile settling into the open space; midground: Seki making the careful swap with steady hands; background: the corrected bottom row and a now-complete first column',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A hand lifts a moon tile out of the bottom row and lowers a bird tile into its place on the board.',
    },
    {
      text: 'Seki checked all six lines: three across and three down. Each one held one moon, one flower, and one bird. "One of each, row by row." The board was finished because the same simple rule worked from both directions. No tile was prettier or more important than another. Every picture took its own fair turn, once in each line, the way a good pattern always should. Seki traced the rows and columns once more, just to be sure.',
      scene: {
        id: 'one-in-every-row-p9-complete',
        focus: 'the completed nine-tile board checked both across and down',
        composition:
          'Foreground: the full nine-tile board with all three picture types placed; midground: Seki tracing the rows and columns in the air with a fingertip; background: a rising moon beyond the paper screen',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A complete nine-tile board sits finished as a man traces its rows and columns in the air beneath a rising moon.',
    },
    {
      text: 'Seki’s real puzzles grew far bigger than nine little spaces. He studied magic squares, where every row, column, and slanting line adds to the same number. He even invented clever ways to untangle rows of numbers that later mathematicians would call determinants. His work in Japanese wasan filled scrolls and taught many eager students. Yet it all began with the same joy he felt tonight: finding a rule and making every line obey it.',
      scene: {
        id: 'one-in-every-row-p10-legacy',
        focus: 'Seki beside brushed scrolls of larger number-squares, the little board still glowing nearby',
        composition:
          'Foreground: the finished picture board; midground: Seki unrolling a scroll of a larger magic-square grid; background: shelves of tied scrolls and a warm study lantern',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man sits beside his little finished board while unrolling a scroll covered with a larger grid of numbers.',
    },
    {
      text: 'Did you know the very same rule is hiding in a puzzle people love today? It is called Sudoku, and it fills a bigger board with numbers. In Sudoku, each number must appear once in every row and every column, just like Seki’s moons and flowers and birds. Grown-ups all over the world puzzle over it on trains and at kitchen tables. The old idea of "one of each in every line" never grew tired. It simply found new players.',
      cue: 'Look for a Sudoku grid in a newspaper or on a screen. Can you spot the rows and columns?',
      scene: {
        id: 'one-in-every-row-p11-sudoku',
        focus: 'a modern Sudoku grid imagined gently above Seki’s three-picture board, sharing the same rule',
        composition:
          'Foreground: Seki’s finished nine-tile picture board; midground: a soft, dreamlike Sudoku number grid floating above it; background: the quiet study fading into a wide starry night',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'Above a small picture board floats a dreamlike Sudoku number grid, sharing the same one-of-each rule.',
    },
    {
      text: 'Before sleep, Seki returned the moons, flowers, and birds to three small cloth pouches. He left the empty board beside them, its nine spaces quiet under the moon. "One of each, row by row," he murmured, half dreaming already. Tomorrow he would puzzle over larger grids, but tonight the little pattern could rest. Somewhere in the world, right now, someone is still checking a line and smiling. Goodnight, quiet board. Goodnight, careful clue.',
      scene: {
        id: 'one-in-every-row-p12-sleep',
        focus: 'Seki resting beside three closed tile pouches and an empty nine-space board',
        composition:
          'Foreground: three closed cloth pouches and the empty nine-space board; midground: Seki settling to sleep beneath a soft quilt; background: a crescent pouch cord and a moonlit paper screen',
        palette: 'ink blue, muted jade, coral, and moon silver',
      },
      alt: 'A man rests under a soft quilt beside three closed pouches and an empty board, a crescent cord curling in the moonlight.',
    },
  ],
};
