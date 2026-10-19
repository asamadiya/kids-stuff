import type { Book } from '../types';

/**
 * Friends book: a rule changed mid-round. Beanbag colours carry the score so
 * every picture can show it — Ben blue, Arjun green, Zoe yellow. Round one
 * ends Zoe 3, Arjun 2, Ben 2: the hoop then holds 3 yellow, 2 green, 2 blue,
 * with 1 blue and 1 green outside. Page 11 hands the refrain back to Arjun.
 */
export const book: Book = {
  slug: 'that-wasnt-the-rule',
  title: 'That Wasn’t the Rule!',
  shelf: 'family',
  hook: 'Zoe changes the rules halfway through Arjun’s turn.',
  cast: 'friends',
  setting:
    'A sunny California kindergarten playground at morning recess: flat grey blacktop, a chain-link fence, a big oak tree, low cream classroom buildings with blue doors, no signs or lettering anywhere.',
  refrain: 'This round first. Then your idea.',
  readMinutes: 4,
  pages: [
    {
      text: 'At morning recess, Arjun and Zoe laid a red hoop on the playground. Ben drew a chalk line a few big steps from the hoop. Each friend had three beanbags: Ben blue, Arjun green, Zoe yellow.',
      zone: 'top',
      art: 'Wide view from slightly above: Zoe and Arjun crouch and lay a red plastic hoop flat on the grey blacktop, while Ben kneels a few big steps away drawing a straight white chalk line with a stick of white chalk. Each child has exactly three beanbags of one colour on the ground right beside them: three green beside Arjun, three yellow beside Zoe, three blue beside Ben. All three children are smiling and busy. The top third is open pale morning sky above the low classroom roofs, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Zoe and Arjun lay a red hoop on the playground while Ben draws a chalk line beside a pile of blue, green and yellow beanbags.',
    },
    {
      text: '“Stand behind the line and throw underarm,” said Ben. “Three throws each is one round. One point for every beanbag in the hoop.” “Agreed,” said Zoe and Arjun. Ben threw first: two blue beanbags landed in, and one skidded out.',
      zone: 'right',
      art: 'Side view at child height: Ben stands with his toes just behind the white chalk line, his arm swung forward after an underarm throw, watching the hoop. Inside the red hoop lie two blue beanbags; one blue beanbag lies on the blacktop just past the hoop. Arjun holds three green beanbags and Zoe holds three yellow beanbags; they stand to one side, watching. The right third is a plain cream classroom wall with no windows or signs, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Ben throws underarm from behind the chalk line; two blue beanbags are in the hoop and one is outside it.',
    },
    {
      text: 'Then it was Arjun’s turn. His first green beanbag landed in the hoop. So did his second. One more would make three points, and three would beat Ben.',
      zone: 'top',
      art: 'From low behind the chalk line: Arjun, toes behind the white line, holds one green beanbag in his right hand and aims carefully, eyes fixed on the hoop, tongue at the corner of his mouth. In the red hoop lie two blue beanbags and two green beanbags; one blue beanbag lies outside it. Ben and Zoe stand behind Arjun, watching; Zoe holds three yellow beanbags. The top third is open pale blue sky, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun aims his last green beanbag at a hoop that already holds two green and two blue beanbags.',
    },
    {
      text: 'Arjun swung his arm back. “Wait!” shouted Zoe, and she jumped in front of the line. “New rule! Now we all throw backwards, over our heads!”',
      zone: 'left',
      art: 'Zoe has just jumped in front of the white chalk line, between Arjun and the red hoop, facing Arjun with her back to the hoop, beaming, one hand flung up and back over her head to show a backwards throw, her three yellow beanbags hugged under the other arm. Arjun is frozen with his arm swung back and one green beanbag in his hand, mouth open in surprise. Ben, behind them, raises his eyebrows. The hoop behind holds two blue and two green beanbags, with one blue beanbag just outside it. The left third is plain grey blacktop and a bare stretch of chain-link fence, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Zoe jumps in front of the chalk line, showing a backwards throw, just as Arjun swings his arm back to throw.',
    },
    {
      text: '“That wasn’t the rule!” said Arjun, and his face went hot. “I was about to throw my last one!” “But backwards is funnier,” said Zoe. “We said underarm,” said Ben.',
      zone: 'bottom',
      art: 'Close view from slightly above: Arjun scowls with flushed cheeks, clutching his one green beanbag to his chest with one hand and pointing hard at the white chalk line with the other. Zoe stands with her back to the red hoop, grinning, holding her three yellow beanbags over her head with both hands to show a backwards throw. Ben stands between them with his arms folded, frowning at Zoe. The chalk line runs across the picture at the children’s feet; below it, the bottom third is empty grey blacktop, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun scowls and points at the chalk line while Zoe shows a backwards throw and Ben folds his arms.',
    },
    {
      text: 'Arjun held his last green beanbag tight. He was angry enough to shout. He wanted to throw it anyway. Instead, he shut his eyes and took a big, slow breath.',
      zone: 'right',
      art: 'Close-up at Arjun’s height: Arjun stands still with his eyes shut and his chest lifted, drawing in a big slow breath, his brows still knotted, both hands squeezing one green beanbag tight against his chest. Behind him, a little out of focus, Zoe waits with three yellow beanbags in her arms and Ben watches. The right third is the plain cream wall of a classroom building with no windows or signs, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun shuts his eyes and takes a big breath, squeezing his last green beanbag.',
    },
    {
      text: '“This round first. Then your idea,” said Arjun.',
      zone: 'top',
      art: 'Low camera looking up at Arjun: he faces Zoe calmly and firmly, holding up one finger of his right hand, his one green beanbag in his left hand. Zoe, seen from the side at the edge of the picture, listens with her head tilted and three yellow beanbags in her arms. The top half is open pale blue sky with one branch of the big oak at the very edge, kept clear for large words.',
      characters: ['Arjun', 'Zoe'],
      alt: 'Arjun holds up one finger and speaks calmly to Zoe.',
      big: true,
    },
    {
      text: 'Zoe said, “Then my idea gets a whole round, not just one throw.” “Deal,” said Arjun, and they shook on it. Ben nodded.',
      zone: 'left',
      art: 'Medium view: Arjun and Zoe shake hands, both standing behind the white chalk line; Zoe holds three yellow beanbags in the crook of her other arm and Arjun holds one green beanbag in his other hand. Both are smiling a little. Ben stands beside them and nods. The red hoop lies on the blacktop in the distance. The left third is plain grey blacktop and a bare stretch of chain-link fence, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun and Zoe shake hands behind the chalk line while Ben nods.',
    },
    {
      text: 'Arjun threw underarm. His last green beanbag hit the edge of the hoop and bounced out. Then Zoe threw underarm, and all three yellow beanbags landed in. “I won with the old rule!” shouted Zoe.',
      zone: 'top',
      art: 'Wide view from behind the chalk line: Zoe cheers with both arms in the air; Arjun groans with both hands on his head, half laughing; Ben laughs. Inside the red hoop lie two blue, two green and three yellow beanbags. Just outside the hoop lie one blue beanbag and one green beanbag, both clearly outside the rim and not touching it. The top third is open pale blue sky above the low classroom roofs, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Zoe cheers beside a hoop holding three yellow, two green and two blue beanbags while Arjun groans and Ben laughs.',
    },
    {
      text: 'Next came Zoe’s backwards round. All three stood with their backs to the hoop and threw over their heads. One green beanbag hit the oak tree. One blue beanbag landed on Ben’s own head.',
      zone: 'bottom',
      art: 'Side view: Arjun, Zoe and Ben stand in a row behind the white chalk line, facing away from the red hoop, arms flung up and back after throwing over their heads, all laughing. The beanbags from the first round have been picked up. Beyond the hoop, one green beanbag strikes the trunk of the big oak tree, and one yellow beanbag lies on the blacktop near the hoop. One blue beanbag sits on top of Ben’s head while he grins up at it. The bottom third is empty grey blacktop, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'The three friends throw beanbags backwards over their heads; one hits the oak tree and one lands on Ben’s head.',
    },
    {
      text: '“New rule: now we throw standing on one foot!” shouted Arjun, laughing. Zoe grinned, held up one finger and said, “This round first. Then your idea.”',
      zone: 'right',
      art: 'Medium close view: Arjun, laughing, balances on one foot with his arms out wide, one green beanbag in his hand. Zoe stands in front of him grinning, holding up one finger, one yellow beanbag in her other hand. Ben, behind them, takes the blue beanbag off his own head and laughs. The right third is the plain cream wall of a classroom building with no windows or signs, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun balances on one foot announcing a new rule while Zoe grins and holds up one finger.',
    },
    {
      text: 'When the backwards round ended, Arjun’s one-foot round began. All three wobbled on one foot behind the chalk line. “Tomorrow my idea goes first: we throw sitting down,” said Ben. “Deal,” said Zoe and Arjun.',
      zone: 'top',
      art: 'Wide view at child height: Arjun, Zoe and Ben stand in a row behind the white chalk line, each balancing on one foot with arms out, wobbling and laughing; Arjun holds a green beanbag, Zoe a yellow beanbag and Ben a blue beanbag. Ben is mid-sentence, looking at the other two, and Zoe and Arjun nod at him. The red hoop lies on the blacktop ahead of them. The top third is open pale blue sky with the leafy edge of the big oak, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun, Zoe and Ben wobble on one foot behind the chalk line, laughing, while Ben suggests tomorrow’s idea.',
    },
  ],
  tryThis: {
    title: 'Change the rules at the right time',
    steps: [
      'Play a short game you both know, such as throwing rolled socks into a basket from a line.',
      'Halfway through his turn, you announce a new rule.',
      'He practises the line: “This round first. Then your idea.”',
      'Finish the round. Then play one full round with the new rule.',
      'Swap: he invents a rule mid-round, and you say the line to him.',
    ],
  },
  note: {
    what: 'Three friends play a beanbag game at school. Zoe changes the rules in the middle of Arjun’s turn; Arjun is angry, then proposes finishing the round before trying her idea, and Zoe negotiates a full round for it.',
    expect: 'He will probably feel Arjun’s anger strongly on page 5 and may enjoy Zoe winning under the old rules. He may miss that Zoe also bargains on page 8, and that the same line is turned back on Arjun on page 11.',
    practising: 'Negotiating rules: a change waits for a natural break (the end of a round), and a new idea gets a fair, full try. Also stopping to breathe before acting on anger.',
    ask: 'On a re-read, at page 11: “Why did Zoe say Arjun’s own words back to him?”',
    next: 'This week, when he changes a game’s rules mid-play, use the exact line with him: “This round first. Then your idea.” Then play his idea for a whole round.',
    honest: 'Saying the line in a calm story is easier than saying it while losing; expect to remind him in the moment, and expect him to change rules himself too. The line works with friends who then keep the deal; if one keeps breaking it, a grown-up steps in so he is not left negotiating alone.',
  },
};
