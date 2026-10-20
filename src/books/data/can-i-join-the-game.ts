import type { Book } from '../types';

/**
 * Can I Join the Game? — friends cast, park.
 *
 * Arc (RULINGS-4-slate): Arjun wants to join Zoe and Ben's park game, but his
 * dinosaur roar interrupts it, so he asks what they are playing and joins an
 * agreed role instead of taking over.
 *
 * The usable lines (RULINGS-0 §4, friendship ruling): "What are you playing?",
 * "Can I play? What can I be?", and waiting on a friend's "Not yet". Ben keeps
 * his trait (finish building before anyone joins), Zoe keeps hers (a new rule
 * halfway through), and the roar comes back at the end only because Zoe asks.
 */
export const book: Book = {
  slug: 'can-i-join-the-game',
  title: 'Can I Join the Game?',
  shelf: 'family',
  hook: 'Arjun’s dinosaur roar stops his friends’ train game.',
  cast: 'friends',
  setting:
    'A sunny Saturday morning in a California park: green lawn, a big old oak tree shading a sandpit with a low wooden edge, a wooden bench, and a leafy green hedge.',
  refrain: 'What can I be?',
  readMinutes: 4,
  pages: [
    {
      text: 'On Saturday morning, Arjun ran across the park. Zoe and Ben were busy in the sandpit under the big oak tree. They had sticks, two cardboard boxes and a plan. Arjun wanted to play too.',
      zone: 'top',
      art: 'Wide shot, low camera from the grass: Arjun runs across the lawn toward the right, arms swinging, eager open smile, eyes fixed on the sandpit. Far right, in the shade of a big oak tree, Zoe and Ben kneel in a sandpit beside two brown cardboard boxes set in a row and a small pile of sticks, heads bent together, busy, not yet seeing him. The oak canopy stays at the far right edge; the top third is open pale-blue morning sky, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun runs across the park toward Zoe and Ben, who are busy with sticks and two cardboard boxes in the sandpit under an oak.',
    },
    {
      text: '“ROAR!” Arjun shouted. “The T. rex is here!”',
      zone: 'top',
      big: true,
      art: 'Medium shot at child height, all three children in the lower half of the picture: Arjun leaps into the sandpit right beside Zoe and Ben, both arms raised and fingers curled like claws, mouth wide open in a huge roar aimed straight at them, eyes scrunched shut. Zoe and Ben, kneeling by the two cardboard boxes, whip their heads round toward him, startled, eyes wide. The top half is open bright sky with oak leaves only at the far edges, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun leaps into the sandpit roaring like a dinosaur, arms up like claws, while Zoe and Ben turn round startled.',
    },
    {
      text: 'Ben jumped and dropped his stick. Zoe put her hands over her ears. “Arjun!” she said. “You stopped our game.” Arjun’s cheeks went hot.',
      zone: 'bottom',
      art: 'Medium shot from slightly above: Ben jerks backwards in fright, his stick tumbling from his open hand onto the sand. Zoe kneels beside the two cardboard boxes with both hands pressed over her ears, frowning at Arjun. Arjun stands in the sand a step away from them, where he landed, with his arms dropped to his sides, cheeks flushed, embarrassed, his roar over. The bottom third is smooth plain sand, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Ben drops his stick and Zoe covers her ears and frowns, while Arjun stands still with hot cheeks.',
    },
    {
      text: 'Arjun stepped away to the bench. He wanted to roar again, louder, but he sat and watched. Ben laid sticks in two long lines. Zoe sat in the front box, steering with a paper plate.',
      zone: 'left',
      art: 'Wide shot, the wooden park bench in the right-hand foreground: Arjun sits on the bench, hands gripping the edge of the seat, lips pressed together, watching quietly. Beyond him in the sandpit, in the middle of the picture, Ben kneels laying sticks end to end in two long parallel lines across the sand, and Zoe sits inside the front cardboard box of the two, holding a white paper plate up like a steering wheel. Neither friend looks at Arjun. The left third is empty open lawn in soft sunlight, kept calm for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun sits on a park bench watching Ben lay two long lines of sticks while Zoe steers a cardboard box with a paper plate.',
    },
    {
      text: 'Arjun walked back to the sandpit. “Sorry I roared,” he said. “What are you playing?” “A train to the seaside,” said Zoe. “And I’m building the track,” said Ben.',
      zone: 'right',
      art: 'Medium shot at child height, the three children in the left two-thirds of the picture: Arjun stands at the low wooden edge of the sandpit, hands clasped in front of him, face apologetic and asking. Zoe sits in the front cardboard box holding the paper-plate wheel, answering him with a small nod. Ben kneels beside the two long lines of sticks, a stick in his hand, looking up at Arjun. The right third is soft, out-of-focus green lawn, kept calm for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun stands at the edge of the sandpit saying sorry and asking what the game is, while Zoe and Ben answer him.',
    },
    {
      text: '“Can I play?” asked Arjun. “What can I be?” “Not yet,” said Ben. “I’m still building the station.” Arjun put his hands behind his back and waited.',
      zone: 'top',
      art: 'Medium shot at child height, the three children in the lower two-thirds of the picture: Arjun stands with both hands clasped behind his back, lips pressed together, waiting patiently. In front of him Ben kneels and holds up one flat palm toward Arjun to say wait, while his other hand sets a stick into a small square of sticks at the end of the two long lines. Zoe watches from the front cardboard box. The top third is open pale sky, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Ben holds up a hand for wait while he builds a square station of sticks, and Arjun waits with his hands behind his back.',
    },
    {
      text: 'Ben laid the last stick and sat back. “Done,” he said. “Now you can play.” Arjun pointed at the front box. “Can I be the driver?” “No, I’m the driver,” said Zoe.',
      zone: 'bottom',
      art: 'Medium shot from above the sandpit: Ben sits back on his heels, satisfied, one hand just lifting off the last stick of the finished square stick station at the end of the two long lines of sticks. Arjun, now kneeling at the sandpit edge, points eagerly at the front cardboard box. Zoe sits in that front box and grips the paper-plate wheel with both hands, shaking her head firmly. The back cardboard box is empty. The bottom third is smooth plain sand, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Ben finishes his stick station, Arjun points at the front box to ask to drive, and Zoe holds the paper-plate wheel and shakes her head.',
    },
    {
      text: 'Arjun looked at the empty back box. He really wanted to drive. “Then what can I be?” he asked. “The guard,” said Ben. “The guard waves the flag.”',
      zone: 'top',
      art: 'Close shot at child height, the three children in the lower two-thirds of the picture: Arjun looks down at the empty back cardboard box with a thoughtful, slightly disappointed face, one hand on its rim. Ben holds out to him a straight stick with one big green leaf tied to its tip, like a small flag. Zoe looks back at them over her shoulder from the front box. The top third is soft, pale, out-of-focus sky, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun looks at the empty back box while Ben offers him a stick with a big green leaf tied on as a flag.',
    },
    {
      text: 'Arjun climbed into the back box and waved the leaf flag. “Off we go!” called Zoe. “Next stop, the seaside!” shouted Ben.',
      zone: 'right',
      art: 'Wide side view along the stick track: the two cardboard boxes sit in a row between the two long lines of sticks. Zoe sits in the front box, leaning forward and steering with the paper plate, grinning. Arjun sits in the back box waving the leaf flag above his head, proud and serious. Ben stands beside the square stick station with one hand cupped at his mouth, shouting. The right third is open green lawn and the low hedge, calm and uncluttered, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Zoe steers the front box, Arjun waves the leaf flag from the back box, and Ben shouts beside his station.',
    },
    {
      text: 'Halfway to the seaside, Zoe stood up. “New rule! The train goes through a jungle!” “In the jungle, what can I be?” asked Arjun. “A T. rex,” said Zoe. “Roar from behind the oak, not in my ears.”',
      zone: 'left',
      art: 'Medium shot, low camera: Zoe stands up inside the front cardboard box with one arm flung out to the right, toward the thick trunk of the big oak at the right edge of the sandpit, eyes bright with her new idea. Arjun leans out of the back box, holding the leaf flag, asking with raised eyebrows. Ben nods beside the stick track. The left third is plain sunlit lawn, empty and calm, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Zoe stands in the front box pointing at the oak with a new idea, while Arjun leans out of the back box to ask what he can be.',
    },
    {
      text: 'The train reached the oak. “ROAR!”',
      zone: 'right',
      big: true,
      art: 'Medium-wide shot at child height: the thick trunk of the big oak stands at the left edge of the picture, and Arjun leans out from behind it with both hands curled like claws and his mouth wide in a roar, a few steps from the cardboard train. In the middle of the picture, Zoe shrieks with laughter in the front cardboard box, both hands high off the paper-plate wheel; the leaf flag lies across the empty back box; Ben stands at the square stick station, laughing. The right third is open sunlit lawn and pale sky, empty and calm, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'Arjun roars from behind the oak trunk while Zoe and Ben laugh in the cardboard train.',
    },
    {
      text: '“Again!” said Ben. So the train went to the seaside again and again. Each time, Arjun waved the flag at the station. Each time, he roared once, from behind the oak.',
      zone: 'bottom',
      art: 'Wide shot from above, late morning: the whole game laid out in the sandpit, two long lines of sticks running to the square stick station, the two cardboard boxes on the track, and the thick trunk of the big oak at the far edge of the sandpit, where the jungle stop is. Zoe drives in the front box, Arjun rides in the back box waving the leaf flag as they leave the station, Ben stands at the station with both arms raised, calling. All three are smiling. The bottom third is plain sunlit sand at the near edge of the sandpit, kept clear for words.',
      characters: ['Arjun', 'Zoe', 'Ben'],
      alt: 'From above, the three friends play their train game together in the sandpit, Arjun waving the leaf flag from the back box.',
    },
  ],
  tryThis: {
    title: 'Join a game that has already started',
    steps: [
      'A grown-up starts a pretend game with two toys: a bus, a shop or a train.',
      'The child watches for a moment, then asks, “What are you playing?”',
      'The child asks, “Can I play? What can I be?”',
      'The grown-up offers a role, but not the one the child asked for. The child takes it, or says “No thanks” and finds something else.',
      'Swap places: the child runs the game and answers when the grown-up asks to join.',
    ],
  },
  note: {
    what: 'Arjun bursts into Zoe and Ben’s park game with a dinosaur roar and stops it. He steps back, watches, asks what they are playing, waits for Ben to finish building, and joins as the train’s guard, the part they offer, not the driver’s seat he wanted.',
    expect: 'He may side with the roar at first; it is a good roar. He may not notice that Arjun watched before he asked, or that he took a role he did not choose. The return of the roar on page 11 usually delights him; point out that Zoe asked for it, and chose where it happens.',
    practising: 'Entering play that is already running: watch first, ask “What are you playing?”, then “Can I play? What can I be?”, accept “not yet”, and take an agreed role instead of the one he wanted.',
    ask: 'On page 4, when Arjun sits on the bench: “What is he finding out by watching?”',
    next: 'At the next playground visit, before he runs into a game, have him tell you what the children are playing. Then he goes and asks, “Can I play? What can I be?”',
    honest: 'Knowing the words is not using them while excited and running. Expect a roar first and the question second for a while. Some groups will still say no, and that is their answer; the line does not guarantee a place.',
    easier: 'Practise only the first question, “What are you playing?”, with family members playing with toys.',
    harder: 'Talk about page 7: Arjun wanted to drive and Zoe said no. What else could he have asked for, or offered?',
  },
};
