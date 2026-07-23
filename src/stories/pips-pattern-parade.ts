import type { Story } from '../types';

export const pipsPatternParade: Story = {
  slug: 'pips-pattern-parade',
  title: "Pip's Pattern Parade",
  subtitle: 'Pip and Ada line up a button parade that keeps repeating.',
  domain: 'patterns',
  collection: 'fiction',
  repeatedPhrase: 'Find the part that repeats, and you know what comes next',
  readAloudMinutes: 6,
  learningTakeaway:
    'A pattern is something that repeats. Once you spot the part that repeats, you can guess what comes next.',
  heartTakeaway:
    'Taking turns means everyone gets to add to the fun, and the parade is better with more friends in it.',
  grownUpFact:
    'Spotting and extending patterns is early math. Noticing the part that repeats is the same thinking a child later uses to count by twos and fives, and to predict what comes next. Patterns are all around us, in tiles, music, and the days of the week.',
  pages: [
    {
      text: 'On the back porch, the evening was turning soft and gold. Grandpa hummed in his chair while Pip tipped out the big button jar. Buttons rolled everywhere. Red ones, blue ones, shiny and dull. "Let us make a parade," said Pip. Ada scooted closer. "A button parade! Can I help?" "Yes," said Pip. "We can take turns." The porch light buzzed on, soft and warm. A moth bumped it, once, twice. Grandpa\'s chair went creak, creak, creak.',
      scene: {
        id: 'pattern-01-porch-buttons',
        focus: 'Pip tipping a jar of buttons across the porch floor',
        composition:
          'Warm overhead view of two children kneeling around a spill of colorful buttons; Grandpa rocks softly in the background',
        palette: 'golden-hour ambers with scattered button reds and blues',
      },
      alt: 'Two children kneel on a porch around a spilled jar of colorful buttons at sunset while a grandparent rocks nearby.',
    },
    {
      text: 'Pip placed a red button first. Then a blue one. "Red, blue," said Pip. Ada placed a red. Then a blue. "Red, blue," said Ada. The buttons marched in a tidy line across the boards. "It is a pattern," said Pip. "Find the part that repeats, and you know what comes next." "Red, blue!" laughed Ada. "I know what comes next!" The buttons shone in the fading light, red like berries, blue like the evening sky. Pip lined them up so straight and even.',
      cue: 'Say it with the parade: red, blue, red, blue. What color do you think comes next?',
      scene: {
        id: 'pattern-02-red-blue-line',
        focus: 'a neat line of alternating red and blue buttons',
        composition:
          'Close side view along the button line, buttons stretching toward the horizon of the porch edge; small hands adding to the end',
        palette: 'crisp reds and blues on warm wooden brown',
      },
      alt: 'A line of buttons alternates red, blue, red, blue across the porch boards as two hands add more.',
    },
    {
      text: 'The parade grew longer. Ada made a new rule. "Big, small, small," she said. Big button. Small button. Small button. Big, small, small. Pip clapped. "A new pattern!" They took turns adding buttons, one each. The line curved past the flowerpot and around the leg of Grandpa\'s chair. It grew longer than Pip\'s arm. It grew longer than Ada\'s leg. Big, small, small, all the way.',
      cue: 'Clap the rule with Ada: big, small, small. Big, small, small. Can you keep the beat?',
      scene: {
        id: 'pattern-03-big-small-curve',
        focus: 'the button line curving around the porch',
        composition:
          'Playful curve of buttons winding past a flowerpot and a chair leg; sizes alternating big and small; children reaching around the bend',
        palette: 'soft dusk oranges with earthy pot terracotta',
      },
      alt: 'The button parade curves around a flowerpot and a chair leg, alternating big and small buttons.',
    },
    {
      text: 'Then a breeze wandered across the porch. It nudged one small button out of the line. Now the parade went big, small, BIG, big, small. "Uh oh," said Ada. "Something does not fit." Pip leaned close and looked hard. Pip whispered the secret again. "Find the part that repeats, and you know what comes next." So they read the parade, one button at a time, hunting for the bump. They leaned in close, nose to nose over the buttons.',
      scene: {
        id: 'pattern-04-breeze-bump',
        focus: 'a broken spot in the button pattern',
        composition:
          'Tension close-up on the gap where two big buttons sit side by side; a stray button rolling away; children peering intently',
        palette: 'cooling blue-grey shadows creeping over warm boards',
      },
      alt: 'Two big buttons sit side by side where the pattern broke, and a small button has rolled away.',
    },
    {
      text: 'There it was. Two big buttons together, where only one belonged. "Big, small, small," said Pip. "This big one does not fit here." Ada found the runaway small button under the chair. She set it gently back in its place. Big, small, small. Big, small, small. The parade was smooth again. "We fixed it together," said Ada. Pip nodded. Fixing it felt just as good as building it.',
      cue: 'Point to the button that does not fit. Then help put the parade back in order!',
      scene: {
        id: 'pattern-05-fix-together',
        focus: 'Ada placing the runaway button back into the line',
        composition:
          'Two pairs of hands meeting over the repaired spot; the line flowing evenly again in both directions',
        palette: 'reassuring warm ambers returning to the boards',
      },
      alt: 'A child gently sets a small button back into its place, and the pattern flows evenly again.',
    },
    {
      text: 'The button parade wound all the way to the door. Red, blue. Big, small, small. Grandpa peeked over his newspaper and smiled. "That is the finest parade I ever saw," he said. Pip and Ada took a slow bow. Every button was exactly where it belonged, and they had put it there together, one turn at a time. A firefly blinked above the parade, like a tiny moving light. Pip counted its blinks. On, off. On, off. Another little pattern in the night.',
      scene: {
        id: 'pattern-06-finished-parade',
        focus: 'the full, finished button parade admired by all',
        composition:
          'Wide celebratory view of the whole winding parade from porch to door; Grandpa peeking over a paper; children bowing',
        palette: 'rich sunset golds with a long line of jewel colors',
      },
      alt: 'The finished button parade winds from the porch to the door while a grandparent smiles over his newspaper.',
    },
    {
      text: 'Inside, Pip lay tucked in bed. The buttons were back in their jar, resting in a sleepy heap. Pip thought of the parade, red then blue, big then small. Patterns were everywhere, even in the night. Red then blue. Big then small. On then off, like the firefly and the stars. Blink, and blink, and blink went Pip\'s heavy eyes. Somewhere a cricket chirped a slow, repeating song. Pip listened to it, warm and calm, and drifted softly off to sleep.',
      scene: {
        id: 'pattern-07-jar-moonlight',
        focus: 'Pip asleep with the button jar glinting in moonlight',
        composition:
          'Quiet bedroom scene: Pip tucked under a quilt, the full button jar on the sill catching a sliver of moon',
        palette: 'deep blue night with a gentle glint of glass',
      },
      alt: 'A child sleeps under a quilt while the jar of buttons rests on the windowsill in the moonlight.',
    },
  ],
};
