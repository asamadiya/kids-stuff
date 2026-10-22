import type { PlayIdea } from '../types';

/**
 * Chase, hide and freeze: running, hiding and stopping on a signal. The advisor
 * made "Freeze—and Change the Rule" a must-include, and ruled out blindfolded
 * running and elimination that leaves him sitting out. Hiding places that latch are out by house rule.
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'red-light-green-light-swap',
    group: 'chase',
    title: 'Freeze — and Change the Rule',
    hook: 'Green means go, red means freeze. Then green means freeze.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Five minutes to colour a plate and clear a space',
    players: 'You, him and Mia',
    need: ['a paper plate and red and green crayons (or just call out the colours)'],
    steps: [
      "Colour one side of the plate green, the other red. Stand at one end; he and Mia start at the other. Green means walk towards you, red means freeze.",
      'Play a few rounds the ordinary way. Turn the plate and call the colour. Anyone moving on red takes one step back.',
      "Then switch one rule: \"Now green means freeze and red means go.\" Say it twice and play slowly. Mia keeps the ordinary rule.",
      'When he reaches you, hand him the plate. He is the caller now, and he invents the next switch.',
    ],
    hisWay:
      "He becomes the caller as soon as he touches you, and he decides the switch: yellow means hop, red means tiptoe, or the colours swap back halfway. Follow his rule even when it trips you up; your mistakes are half the point for him.",
    mia: {
      way: 'joins',
      text: 'Mia freezes too, on the ordinary rule only; nobody switches it on her or sends her back. Her freeze will be a wobble, and that counts.',
    },
    picture:
      'Arjun stands at the far end of the back lawn holding up a paper plate with its red side showing, calling out, while Mummy freezes mid-step on one leg with her arms out and Mia stands stock-still beside her with both arms in the air, on the grass of their California back garden.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds (Red Light, Green Light)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      { label: 'Zero to Three: A Year of Play (the paper-plate stop-and-go game, for toddlers)', url: 'https://www.zerotothree.org/resource/a-year-of-play/' },
    ],
    tags: ['stop and go', 'traffic lights', 'rainy day', 'garden', 'self-control'],
    note: {
      what: 'A stop-and-go game: he walks on one colour and freezes on the other, then you swap what one colour means. Before long he takes over as the caller.',
      expect:
        'The plain version is easy at five. After the switch he will probably walk on green out of habit at least once, then laugh at himself. Some children love calling the switch and will flip it every round.',
      practising:
        "Holding back a movement on a signal and, after the switch, dropping a rule he has just been following for its opposite. Harvard's activity guide for ages 5 to 7 lists Red Light, Green Light among games that practise attention and holding back a response.",
      ask: 'Just after he walks on green by mistake, if he is laughing: "What did your feet want to do?"',
      next: 'On the next walk, stop at a real crossing and read the signals together: what the light for the cars shows, and what the walking sign shows. Then hold hands across, as always.',
      honest:
        'Freezing well in a game does not mean he will stop at a real kerb, and the swapped round is a game rule only: on a real road red always means stop. Keep holding hands at crossings. One good round says little about self-control in general.',
      easier: 'Skip the switch. Call the colours with your voice only, make the stops long and obvious, and add a slow-motion yellow.',
      harder: 'Switch two rules at once, or switch back without warning halfway through a round. Or he calls with his back turned, then spins round to catch anyone still moving.',
      safety:
        'Walk on hard floors; save running for grass or carpet with a clear path. Clear toys first, and keep the line away from glass doors and table corners. Outside, play in the garden or a park, never beside the road.',
    },
  },
  {
    id: 'whats-the-time-mr-wolf',
    group: 'chase',
    title: "What's the Time, Mr Wolf?",
    hook: 'Creep up on Wolf an hour at a time. At dinner time, run home!',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You, him and Mia',
    need: ['a shoe or a jumper to mark the start line'],
    steps: [
      'Mark a start line with a shoe, two big steps in from the end of the garden or hallway. You are Wolf, at the far end, with your back turned.',
      "He calls, \"What's the time, Mr Wolf?\" You answer an hour, \"Three o'clock!\", and he takes exactly three steps, counting them out loud.",
      'Turn round whenever you like. Anyone still moving goes back to the start line, never out of the game.',
      'When he is close, roar "Dinner time!" and chase him back to the start, slowly enough that he usually gets home.',
      'Caught or not, swap after a round or two. He is Wolf: he chooses the hours, and when to roar.',
    ],
    hisWay:
      'As Wolf he picks the hours and the kind of step: giant steps, ant steps, hops or tiptoes. He decides when to roar, and he can add a rule of his own, such as "nobody moves unless Wolf says please".',
    mia: {
      way: 'joins',
      text: 'Mia is always the Wolf\'s helper: she stands beside whoever is Wolf and echoes "Dinner time!" after the Wolf roars, but does not chase. The runners run away from her end, never towards it.',
    },
    picture:
      'Side view across the back lawn of the California home: Arjun, on the left, takes one giant step to the right, front leg stretched far forward and arms out for balance, mouth open counting out loud, moving towards Papa. On the far right, Papa stands facing away to the right with his back turned to Arjun and both hands on his hips. Mia stands beside Papa, turned round to look back at Arjun with one finger on her lips. On the far left, behind Arjun, a single shoe lies on the grass marking the start line.',
    cast: ['Arjun', 'Papa', 'Mia'],
    tradition:
      "A tag game from English-speaking playgrounds, also called What Time Is It, Mr. Fox?, the name in Harvard's guide. In the usual game Wolf only calls hours or \"Dinner time!\", then turns and chases, and whoever is tagged is the next Wolf. This version adds a turn-round rule, as in Red Light, Green Light, sends anyone caught moving back to the start (never out), keeps the grown-up's chase slow, and swaps Wolf by turns rather than by who is tagged.",
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      { label: "Wikipedia: Tag (game), the What's the Time, Mr. Wolf? section", url: 'https://en.wikipedia.org/wiki/Tag_(game)' },
    ],
    tags: ['counting', 'garden', 'park', 'hallway', 'chase'],
    note: {
      what: 'A creeping game: he steps towards you one counted step at a time as you call the hours, freezes whenever you turn, and runs for home when you roar "Dinner time!".',
      expect:
        'He will take giant steps for big hours and argue about what counts as one step; let him settle it. Expect him to start running at six o\'clock just in case, and to ask to be Wolf almost at once.',
      practising:
        "Matching one step to each number he says, keeping still while excited, and, as Wolf, keeping track of where everyone is. Harvard's activity guide for ages 5 to 7 lists it, as What Time Is It, Mr. Fox?, among games where whoever is It must keep track of everyone's moves.",
      ask: 'When he is about halfway: "How many more steps do you think you need to reach me?"',
      next: 'On the walk to the park gate or the letterbox, guess how many steps it will take, then count them together.',
      honest:
        'Counting steps shows he can match one number to one movement; it does not show he can add the steps up. A slow chase can still end in a fall if the path is not clear.',
      easier: 'Call only small hours, one to five, count the steps with him, and roar only when he is nearly at you.',
      harder: 'Call "half past three" and he takes three steps and a half step. Or add the please rule: he may move only when Wolf says "please".',
      safety:
        'Run only on grass or a clear carpet; in a hallway the dash home is a fast walk. Clear toys first, keep the run away from glass doors and furniture corners, and never run towards a wall. Nobody runs towards Mia.',
    },
  },
  {
    id: 'hide-and-seek-count-to-twenty',
    group: 'chase',
    title: 'Hide and Seek: Count to Twenty First',
    hook: 'Eyes shut, count out loud to twenty, then: ready or not.',
    where: 'indoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to agree the rooms',
    players: 'You and him; another grown-up with Mia',
    need: [],
    steps: [
      'Agree the hiding rooms together, and the places that are out: inside appliances, anything that latches or locks, chests, curtains with cords, the car, the stairs, and outdoors.',
      'You seek first. Cover your eyes and count to twenty out loud, slowly enough that he hears every number.',
      'Shout "Ready or not, here I come!" Search out loud, "Is he behind the door? No...", so he can hear you coming closer.',
      'Swap. He counts to twenty, or in tens to a hundred if he can, while you hide somewhere he can find.',
    ],
    hisWay:
      'He chooses the count (to twenty, back from twenty, or in tens to a hundred) and adds rules: only the living room this round, or the seeker has to hop. He also chooses where you hide next.',
    mia: {
      way: 'apart',
      text: 'Best while Papa or another grown-up has Mia, so the hiding places and the counting stay his. If she is around, she hides with a grown-up, never on her own.',
    },
    picture:
      'Arjun crouches behind the arm of the living-room sofa with both hands over his mouth to keep in a giggle, while Mummy stands facing the hallway wall with her hands over her eyes, counting out loud, in their California living room.',
    cast: ['Arjun', 'Mummy'],
    sources: [
      { label: 'UNICEF Parenting: Screen-free activities for children (hide and seek, ages 5 to 8)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
      { label: 'UNICEF Parenting: The science of play (hiding and finding objects)', url: 'https://www.unicef.org/parenting/child-care/science-of-play' },
    ],
    tags: ['counting', 'rainy day', 'indoors', 'no equipment'],
    note: {
      what: 'Hide and seek with two family rules: the seeker counts to twenty out loud before looking, and everyone hides only in agreed places.',
      expect:
        'At five he will probably hide in the same place twice, or with his feet showing, and may giggle or call out to be found. He may count fast and skip some numbers in the teens; let it go during the game.',
      practising:
        'Saying the counting sequence out loud while waiting, and keeping still and quiet while hidden. UNICEF lists hide and seek among screen-free games for ages five to eight.',
      ask: 'After he finds you: "What made you look there?"',
      next: 'Hide one spoon in the kitchen and give him clues with "under", "behind" and "next to" until he finds it.',
      honest:
        'Hiding in the same spot or giving himself away is normal at five and says nothing about how clever he is. Counting to twenty quickly is saying the words; it does not show he knows how many twenty is.',
      easier: 'Count to ten, hide only in one room, and hum while you seek so he can follow where you are.',
      harder: 'Count back from twenty to zero. Or the hider moves once, quietly, while the seeker is in another room.',
      safety:
        'Out of bounds every time: the washing machine and dryer, the fridge, chests and toy boxes with lids, any cupboard or room that latches or locks, behind curtains with blind or curtain cords, the car, the stairs and outdoors. Agree that "Game over!" means everyone comes out or answers at once. If he does not, stop the game and look for him straight away. Walk, do not run, between rooms.',
    },
  },
  {
    id: 'oonch-neech',
    group: 'chase',
    title: 'Oonch Neech: High Ground or Low Ground?',
    hook: "Oonch or neech? Stand where the catcher can't get you.",
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to set out the high places',
    players: 'You, him and Mia',
    need: [
      'two or three low, steady things to stand on: a doormat, a big floor cushion, the bottom step of the porch',
      'one more mat or folded towel, for Mia',
    ],
    steps: [
      'Set out the oonch (high) places together and name them. Everything else is neech (low) ground.',
      'You catch first. He chants, "Oonch neech ka papda, oonch maangi neech?" Answer "Neech!": you catch on the low ground, so he is safe up high.',
      'He may stay on a high place for a count of five, then must move to another. Tag gently on the arm; whoever is tagged catches next.',
      'Once he has it, play the real choice: the catcher may answer "Oonch!", and then the high places are where you get caught.',
    ],
    hisWay:
      'As catcher he chooses oonch or neech each round and can change the count of five. He can also add a third word, "Beech!" for a middle place such as a folded towel, and say what it means.',
    mia: {
      way: 'joins',
      text: 'Mia stands on her own mat, which is always safe for her whatever the catcher calls, and shouts the chant with him. Nobody tags her, and nobody runs across her mat.',
    },
    picture:
      'Arjun, barefoot, steps up onto a big flat floor cushion on the living-room carpet and stands on it with both arms raised in triumph, laughing, safe. Papa, down on both knees a step away, stretches one open hand towards Arjun but stops short, his fingers clearly not touching Arjun, his other hand resting on his own knee, with a comic disappointed face. Nobody holds hands. Mia stands on a small mat of her own a little way off to the side, chanting with both fists raised. California living room.',
    cast: ['Arjun', 'Papa', 'Mia'],
    tradition:
      "Oonch Neech ka Papda is an Indian tag game for young children; D'Source (IIT Bombay) records it for ages three to eight, and gives other regional names: Kumir Daanga in West Bengal, Nela Banda in Andhra Pradesh. The real game is played on uneven open ground, in a group, and the catcher chooses oonch or neech every round. This version starts with high ground always safe, uses only mats, cushions and one low step, sets the real game's time limit at a count of five, and gives Mia a mat that is always safe.",
    sources: [
      { label: "D'Source, IDC IIT Bombay, Indian Games: Oonch Neech ka Papda", url: 'https://www.dsource.in/resource/indian-games/outdoor-games/oonch-neech-ka-papda' },
      { label: 'Wikipedia: Tag (game), including the Indian variant Nadi-Parvat', url: 'https://en.wikipedia.org/wiki/Tag_(game)' },
    ],
    tags: ['Indian game', 'Hindi', 'high and low', 'opposites', 'rainy day', 'chase'],
    note: {
      what: 'An Indian tag game. The catcher chooses high or low ground, and anyone standing on that kind of ground can be caught, so everyone hurries to the other kind.',
      expect:
        'The first few rounds he will run to the wrong ground or forget which word was called; slow the chase right down until the rule clicks. Then he will want to call it himself and change it every round.',
      practising:
        'Acting on a called word: working out which ground is now dangerous and getting to the other kind before the catcher arrives. Also the Hindi words oonch (high) and neech (low).',
      ask: 'When he is catcher and has just chosen his word: "Why that one?"',
      next: 'On a video call, ask Dadi or Dada whether they played Oonch Neech as children in Jaipur, and what counted as high ground.',
      honest:
        'It is a running game first; it does not teach high and low as ideas, which he already knows. A cushion can slide out from under a foot on a smooth floor, which is why cushions stay on carpet.',
      easier: 'Play at walking pace, catch on your knees, and keep to one high place and the one word, "Neech!", until he wants more.',
      harder: 'Add "Beech!" for a middle place, or call the word while you are already chasing so he must change direction.',
      safety:
        'High places are ankle or shin height and do not slide or tip: a doormat, a flat floor cushion on carpet (not on a smooth floor), the bottom step of the porch outside. Never chairs, sofas, tables, beds, walls or indoor stairs. Step up onto the high places; no jumping on or off. Clear the floor first, tag with an open hand, and keep the chasing away from Mia\'s mat. If she steps off it into the chase, everyone freezes until she is back on it or in your arms.',
    },
  },
  {
    id: 'vish-amrit',
    group: 'chase',
    title: 'Vish Amrit: Poison and Nectar',
    hook: '"Vish!" and you freeze. "Amrit!" and you are free again.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to clear a space',
    players: 'You, him and Mia',
    need: [],
    steps: [
      'You chase first. Touch him lightly on the arm and say "Vish!" (poison). He freezes like a statue where he stands.',
      'Mia is the helper. She walks over, touches him and says "Amrit!" (nectar), and he is free to run again.',
      'Swap: he chases and freezes you, and now Mia comes to free you. He has to plan round her.',
      'If Mia is not playing, the chaser gives amrit too: freeze, count to ten together in Hindi (ek, do, teen...), then "Amrit!" and chase again.',
    ],
    hisWay:
      'As the chaser he decides how a frozen player must stand (one leg, arms up, like a tree) and can make a new rule, such as the helper having to say "Amrit" three times. He also calls the swap whenever he wants to be the chaser again.',
    mia: {
      way: 'joins',
      text: 'Mia is always the Amrit-giver and is never frozen or chased. She walks to whoever is frozen, touches them and shouts "Amrit!"; that is her whole game, and she will want to do it a lot.',
    },
    picture:
      'Arjun stands frozen like a statue on the back lawn, arms stretched out and one foot lifted, while Mia toddles up and pats his knee, shouting, and Mummy steps away across the grass looking back over her shoulder, ready to chase again, in their California back garden.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    tradition:
      "Vish Amrit is a freeze-tag game played in many parts of India, also called Lock and Key in cities; vish means poison and amrit nectar. D'Source (IIT Bombay) records it for ages three to twelve, played in a large group: one chaser, and teammates who unfreeze the frozen until no one is left free. With three of you the touch-and-word rules are the real ones, but Mia is a helper who is never frozen, so a round never ends on its own. With two, the chaser also gives amrit after a count of ten.",
    sources: [
      { label: "D'Source, IDC IIT Bombay, Indian Games: Vish Amrit", url: 'https://www.dsource.in/resource/indian-games/outdoor-games/vish-amrit' },
      {
        label: "Hindustan Times (2022): 'Gilli danda' among 75 'Bharatiya sports' set to be introduced in schools, Vish Amrit among them",
        url: 'https://www.hindustantimes.com/india-news/gilli-danda-among-sports-set-to-be-introduced-101659205191117.html',
      },
      { label: 'Wikipedia: Samudra Manthana, the churning of the ocean', url: 'https://en.wikipedia.org/wiki/Samudra_Manthana' },
    ],
    tags: ['Indian game', 'Hindi', 'freeze tag', 'Mia can join', 'garden', 'chase'],
    note: {
      what: 'An Indian freeze-tag game. A touch and the word "Vish" (poison) freeze a player; a touch from a free player and the word "Amrit" (nectar) set them free.',
      expect:
        'He will probably wriggle while frozen and argue about whether you really touched him. As the chaser he may forget about Mia until she frees you, then work out that he has to watch her too.',
      practising:
        'Staying frozen until someone frees him, and, as the chaser, keeping track of two people at once. In the Hindustan Times piece, Sangeeta Goswami, an expert on the schools\' list of Indian games, singles it out for teammates coming to free each other.',
      ask: 'Between rounds, if Mia keeps freeing you: "What could a chaser do about Mia?"',
      next: 'At bedtime, tell the story of the churning of the ocean, samudra manthan, where a terrible poison came up out of the ocean, and the pot of nectar came out last of all.',
      honest:
        'Holding still in a game is not the same as stopping when asked in daily life. With one runner and a helper who can never be frozen, nobody wins a round; it ends when someone wants to swap, and that is fine.',
      easier: 'Freeze him for just a count of three, and chase on your knees indoors.',
      harder: 'The frozen player must hold the exact shape they were caught in. Or, when he chases, he may not stand guard over a frozen player: he must walk on and come back later.',
      safety:
        'Tag with a light open hand on the arm or back, never a push. Run on grass or a clear carpet, away from glass doors and furniture corners. Nobody runs towards Mia: when she walks in to give amrit, the chaser slows to a walk, and the freed player walks two steps away from her before running.',
    },
  },
  {
    id: 'catch-me-im-very-slow',
    group: 'chase',
    title: 'Catch Me If You Can (I Am Very Slow)',
    hook: 'The fiercest catcher in the house trips over nothing, every time.',
    where: 'either',
    energy: 'active',
    contact: true,
    minutes: 5,
    setup: 'Two minutes to clear a space',
    players: 'You and him; Mia with another grown-up',
    need: [],
    steps: [
      'Ask if he wants a chase. Agree "Freeze!" as the stop word: either of you says it and the game stops at once. Try it once now, mid-chase.',
      'Announce in a big voice, "Nobody can escape me!" Then chase slowly on your knees, and miss him every time.',
      'Trip over nothing, grab the air, and look baffled when he slips past. Follow his laughter, not a plan.',
      'When he catches or pushes you, topple slowly over, away from him, loudly shocked. Then swap: he chases, and you cannot get away.',
    ],
    hisWay:
      'He decides who you are (a monster, a robot with a flat battery, a very tired elephant) and makes the rules, such as "you can only catch me if I am touching the sofa". He chooses when to swap and when to stop.',
    mia: {
      way: 'apart',
      text: 'Best while Mummy or another grown-up has Mia in another room, so this short chase is his alone. If she wants a turn, give her a slow chase of her own afterwards.',
    },
    picture:
      'Papa, on his knees on the right side of the living-room rug, has just made a big comic grab and caught only a floor cushion. He hugs the cushion to his chest with both arms and looks down at it, eyebrows high and mouth open in a baffled, comic face. Arjun, laughing, runs away on the far left side of the rug, a long way from Papa with a wide stretch of empty rug between them. He looks back over his shoulder at Papa, and both his hands are empty and swinging free. Nobody touches anybody. The furniture is pushed back in the sunny California living room.',
    cast: ['Arjun', 'Papa'],
    sources: [
      {
        label: 'Hand in Hand Parenting: Five Connection Tools That Will Transform Your Parenting (Playlistening)',
        url: 'https://www.handinhandparenting.org/2016/08/five-tools-that-can-transform-your-parenting/',
      },
      {
        label: "The Conversation (Emily Freeman, University of Newcastle): 'That's getting a bit wild, kids!' Why children love to play-fight",
        url: 'https://theconversation.com/thats-getting-a-bit-wild-kids-why-children-love-to-play-fight-and-why-it-is-good-for-them-212967',
      },
    ],
    tags: ['laughing', 'after school', 'bad day', 'one-to-one', 'chase'],
    note: {
      what: 'A chase where you play the hopeless catcher: big threats, slow feet, and misses every time. Hand in Hand Parenting calls this playlistening: the grown-up takes the weaker role and follows the laughter.',
      expect:
        'Most children laugh hard and want it again and again, often for longer than you expected. Watch whether he keeps leaning in or starts pulling away; that tells you more than the laughing does. If he gets wild or starts hitting, slow down or say "Freeze" and sit together.',
      practising:
        'Being the strong one for a while, with you as the one who cannot win. Hand in Hand Parenting describes laughter in this kind of play as an antidote to stress.',
      ask: 'Only once he has stopped running: "Who should I be next time?"',
      next: 'Next time he is cross about something, try a minute of this before talking it through, and see whether it helps.',
      honest:
        'It does not fix a hard day by itself, and the laughter claim comes from one parenting organisation, not from trials. If the laughing turns to tears, stop and hold him; that is not the game failing.',
      easier: 'Crawl instead of knee-walking, play in one small cleared space, and keep each round to under a minute.',
      harder: 'Speed up a little, so he has to dodge for real, and still miss at the last moment. Or he sets a rule you must keep, such as you may only move while he is singing.',
      safety:
        'Agree "Freeze" first; either of you can stop at any moment, and laughing does not mean carry on if he has said stop. Clear the floor and stay on carpet or grass, away from table corners and stairs. When he catches you, he tags you or pushes you over; you never fall on him, hold him or put your weight on him. The laughs come from the chase alone, never from fingers in his ribs. Mia stays out of the space.',
    },
  },
];
