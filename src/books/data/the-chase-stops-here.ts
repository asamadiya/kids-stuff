import type { Book } from '../types';

/**
 * Slate entry (RULINGS-4): Arjun wants another dinosaur chase, but Ben says
 * stop even while laughing, so Arjun stops immediately and gives him space,
 * then chooses a different game with Zoe.
 *
 * Friendship ruling: agree the space and the stop signal first; "stop" means
 * stop even if the person laughs; say "I wanted another turn", do not ask
 * again, choose something else. Page 10 shows Arjun's own stop respected.
 */
export const book: Book = {
  slug: 'the-chase-stops-here',
  title: 'The Chase Stops Here',
  shelf: 'family',
  hook: 'Ben is laughing, but he said stop.',
  cast: 'friends',
  setting:
    'A sunny California park on a Saturday morning: a big oak tree with wide knobbly roots, open green grass, and a sandpit with a low wooden edge.',
  refrain: 'You said stop. I stopped.',
  readMinutes: 4,
  pages: [
    {
      text: 'On Saturday at the park, Arjun was a T. rex. “Want to play dinosaur chase?” Arjun asked Ben. “Yes!” said Ben. “Only on the grass. And if anyone says stop, we stop.”',
      zone: 'top',
      art: 'Wide shot from low on the grass. Arjun stands with both hands curled into small T. rex claws, grinning and asking; Ben faces him, nodding, holding up one flat palm as he says the stop rule. Open green grass all around; the big oak stands small and far off on the right, its crown well below the sky line. The top third is open pale blue morning sky with no branches in it, kept clear for words.',
      characters: ['Arjun', 'Ben'],
      alt: 'Arjun makes T. rex claws and asks Ben to play chase, and Ben holds up a palm as he agrees.',
    },
    {
      text: 'Arjun stomped and roared, claws up. Ben ran in big circles around the oak, laughing. Round and round they went, again and again. In the sandpit, Zoe was digging with a big spoon.',
      zone: 'bottom',
      art: 'Low, wide camera across the grass. Ben runs around the trunk of the big oak, looking back over his shoulder, mouth open laughing; Arjun stomps after him with knees high, claw-hands up and mouth wide in a roar. In the background at the left, smaller but clearly drawn, Zoe kneels in the sandpit digging with a big wooden spoon, the spoon plainly visible in her hand. The bottom third is plain, empty short grass in the near foreground, kept clear for words.',
      characters: ['Arjun', 'Ben', 'Zoe'],
      alt: 'Arjun roars and chases Ben around the big oak while Zoe digs in the sandpit far behind.',
    },
    {
      text: 'Ben flopped against the oak, out of breath. “One more!” roared Arjun, and he crouched to charge. Ben was laughing so hard he could barely breathe. “Stop!” Ben gasped. “Arjun, stop!”',
      zone: 'right',
      art: 'Medium shot from just behind Arjun’s shoulder. At the left edge, seen from behind, Arjun crouches low, ready to charge, claw-hands up. In the centre, facing the camera, Ben leans with his back flat against the oak trunk, eyes squeezed, mouth wide open laughing, both palms pushed out toward Arjun; the oak’s leafy crown is out of frame above. The right third is empty sunlit grass sloping away to a distant hedge, kept calm for words.',
      characters: ['Arjun', 'Ben'],
      alt: 'Ben leans on the oak, laughing hard, with both palms out toward Arjun, who is crouched to charge.',
    },
    {
      text: 'Arjun stopped right there, one foot still in the air. Ben was still laughing. Arjun thought, “Laughing means fun, doesn’t it?” But Ben had said stop, and his hands were up like a wall.',
      zone: 'bottom',
      art: 'Low side view, close. On the left, Arjun faces right, frozen in mid-step with one sneaker lifted off the grass, his claw-hands dropping open, eyebrows pulled together as he wonders. On the right, a few steps away, Ben leans on the oak trunk facing Arjun, still laughing, both palms pushed out toward him like a wall. The bottom third is plain green grass close to the camera, kept clear for words.',
      characters: ['Arjun', 'Ben'],
      alt: 'Arjun freezes in mid-step with one foot raised, facing Ben, who is laughing but holding up both hands.',
    },
    {
      text: '“You said stop. I stopped,” said Arjun.',
      zone: 'top',
      big: true,
      art: 'Side view, camera low and set back so both boys fill the lower half. Arjun stands completely still a few steps from Ben, arms down by his sides, palms open, face calm and serious. Ben leans on the oak trunk at the far right edge, his laugh fading into a breathless smile, looking at Arjun; the trunk is a narrow strip and the leafy crown is out of frame. The top half, from the left edge to the trunk, is open pale sky with no branches, kept clear for big words.',
      characters: ['Arjun', 'Ben'],
      alt: 'Arjun stands still with his arms down, a few steps from Ben, who is catching his breath against the oak.',
    },
    {
      text: 'Arjun took two big steps back, away from the oak. Ben slid down and sat on a root, holding his tummy. “No more chase,” Ben puffed. “I need a rest.”',
      zone: 'left',
      art: 'Wide shot from slightly above. In the centre, Arjun stands two big steps back from the oak, one heel still lifted from stepping backwards, arms loose at his sides, a clear gap of open grass between him and Ben. Ben sits on a knobbly oak root at the right, one hand on his tummy, cheeks pink, puffing; only the trunk and roots of the oak are in frame. The left third is open sunlit grass with nothing in it, kept calm for words.',
      characters: ['Arjun', 'Ben'],
      alt: 'Arjun steps back from the oak while Ben sits on a root, holding his tummy and resting.',
    },
    {
      text: '“I wanted another turn,” said Arjun. Ben nodded, still puffing, and stayed on his root. Arjun did not ask again. But his roar was still stuck inside him.',
      zone: 'right',
      art: 'Close-up of Arjun in three-quarter view, camera at his eye level; he fills the left and centre of the picture. Arjun stands with his shoulders slumped and his lips pressed together, disappointed, hands hanging down, staying where he is. Behind him at the far left, small and soft-focus, Ben sits on the oak root and nods. The right third is pale out-of-focus grass and sky, kept calm for words.',
      characters: ['Arjun', 'Ben'],
      alt: 'Arjun looks disappointed but stays where he is, while Ben nods from his seat on the oak root.',
    },
    {
      text: 'Arjun walked over to the sandpit. Zoe was digging up sticks with her big spoon. “Can I play? What can I be?” Arjun asked. “A fossil hunter!” said Zoe. “These are dinosaur bones.”',
      zone: 'top',
      art: 'Wide shot at the sandpit with its low wooden edge. Arjun stands at the edge, leaning in to ask, hands on his knees. Zoe kneels in the sand, holding up a big wooden spoon in one hand and a sandy stick in the other, grinning. Two more sticks lie half-dug in the sand beside her. The top third is open blue sky above the park, kept clear for words.',
      characters: ['Arjun', 'Zoe'],
      alt: 'Arjun leans over the sandpit edge to ask Zoe if he can play, and Zoe holds up a stick and a spoon.',
    },
    {
      text: '“Real dinosaur bones slowly turned to stone,” said Arjun. “These are pretend.” Zoe laid out a pinecone skull and three stick bones for the back. There was no tail yet.',
      zone: 'bottom',
      art: 'Seen from directly above. Arjun and Zoe kneel on either side of a pretend dinosaur laid out on smooth sand: one brown pinecone as the skull, then three straight sticks in a row as the back, and empty sand where a tail should be. Arjun points at the empty space; Zoe places the third stick. The children and the dinosaur fill the top two-thirds. The bottom third is smooth, empty, raked sand, kept calm for words.',
      characters: ['Arjun', 'Zoe'],
      alt: 'From above, Arjun and Zoe kneel beside a pinecone skull and three sticks laid out in the sand, with no tail.',
    },
    {
      text: 'Then Zoe made up a new rule. “Now we bury the fossil hunter!” She tipped a spoonful of sand onto Arjun’s sneaker. “Stop, Zoe,” said Arjun. “Not on me.”',
      zone: 'top',
      art: 'Close shot at sand level. Zoe, grinning, tips a big wooden spoon so a small heap of sand lands on the toe of Arjun’s white sneaker. Arjun pulls his foot back and holds up one flat palm toward her, face firm but not angry. The pinecone and three sticks lie in the sand between them. The top third is open blue sky and the far green grass, kept clear for words.',
      characters: ['Arjun', 'Zoe'],
      alt: 'Zoe tips sand from her spoon onto Arjun’s sneaker, and Arjun holds up a palm and tells her to stop.',
    },
    {
      text: 'Zoe put her spoon down at once. “You said stop. I stopped,” said Zoe. Arjun tipped the sand out of his sneaker. Their dinosaur still needed a tail.',
      zone: 'left',
      art: 'Medium shot from the side. In the centre, Zoe kneels in the sand with her wooden spoon laid flat beside her, both hands empty in her lap, looking at Arjun. At the right, Arjun sits on the low wooden edge of the sandpit, holding one white sneaker upside down so a trickle of sand pours out, smiling at her. Between them lie the pinecone skull and three sticks, with bare sand where a tail should be. The left third is plain, empty sand and the wooden edge, kept calm for words.',
      characters: ['Arjun', 'Zoe'],
      alt: 'Zoe has laid her spoon down, and Arjun tips sand out of his sneaker beside their tail-less stick dinosaur.',
    },
    {
      text: 'Ben came over with a long bendy stick. “Can I play?” Ben asked. “I found a tail.” “Yes!” said Zoe and Arjun. Then Arjun roared his biggest roar, and nobody had to run.',
      zone: 'top',
      art: 'Wide shot at the sandpit, camera low behind the sand. The finished pretend dinosaur lies in the sand: one pinecone skull, three straight sticks in a row for the back, and one long, bendy, curved stick for the tail, which Ben has just walked over and laid down. Arjun kneels at the skull end with his head tipped back, mouth wide in a roar at the sky and claw-hands up. Ben and Zoe kneel beside the tail, laughing. The big oak stands small and far off, its crown below the sky line. The top third is open blue sky, kept clear for words.',
      characters: ['Arjun', 'Ben', 'Zoe'],
      alt: 'Ben has added a stick tail to the sand dinosaur, and Arjun roars at the sky while Ben and Zoe laugh.',
    },
  ],
  tryThis: {
    title: 'Practise a chase that stops',
    steps: [
      'Before you start, agree where to run and the rule: “If anyone says stop, we stop.”',
      'The grown-up chases. The child laughs and shouts “Stop!” The grown-up stops dead and says, “You said stop. I stopped.”',
      'Swap. The child chases, and the grown-up says “Stop” while laughing. The child stops and says the same line.',
      'Practise the next move: “I wanted another turn.” Then choose a different game together.',
    ],
    safety: 'Chase on grass or a clear floor, away from steps, sharp furniture edges and the road. Keep a toddler out of the chase.',
  },
  note: {
    what: 'Arjun wants one more dinosaur chase, but Ben says stop while laughing hard. Arjun stops at once, steps back and joins Zoe’s fossil game; later Zoe stops when Arjun says stop, and Ben rejoins by asking.',
    expect: 'Many five-year-olds read laughter as a yes, so he may take Arjun’s side (“But Ben was having fun”). Page 4 says that thought out loud on purpose. He may not notice that Arjun asked first and agreed a stop rule on page 1.',
    practising: 'Stopping on the first clear “stop”, even when the other child laughs; agreeing the space and stop signal before a chase; saying “I wanted another turn” and choosing another game instead of asking again; and having his own “stop” respected.',
    ask: 'On a re-read, at page 4: “Ben is laughing. Why did Arjun stop anyway?”',
    next: 'Before the next chase at the park this week, agree out loud where you will run and that “stop” ends it. When he stops on the first “stop”, name it: “You stopped when he asked.”',
    honest: 'Reading this does not give him the control to stop at full speed; expect to need the short cue “He said stop. Step back.” many times. If a friend keeps going after his own “stop”, an adult steps in; he should not have to keep negotiating.',
    safety: 'Chase games need open ground away from roads, steps and hard edges, and an adult close enough to call a stop.',
  },
};
