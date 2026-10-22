import type { PlayIdea } from '../types';

/**
 * Quiet Together and Helping: one-to-one time he leads, stories and word games, and real jobs he does for the family.
 * Advisor rulings 10-12: protected one-to-one time when he wants it, oral storytelling and wordplay, and playful practical work with a real contribution.
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'ten-minutes-youre-the-boss',
    group: 'quiet',
    title: "Ten Minutes Where You're the Boss",
    hook: 'A timer, your full attention, and he chooses what you both play.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You and him; Mia with another grown-up',
    need: [
      'a kitchen timer (or the oven timer, so your phone can stay put away)',
      'whatever he chooses: blocks, cars, steel pots, a cardboard box',
    ],
    steps: [
      "Tell him: \"It's Special Time. For ten minutes, you choose what we play.\" Set the timer where he can see or hear it.",
      'Put your phone away, out of sight. Get down to his level and do what he asks, the way he asks it.',
      'Say what you see, not what to do: "You put the red car on top of the bridge." No teaching, no fixing.',
      'If he chooses something unsafe, offer two safe choices. When the timer rings, thank him and stop on time.',
    ],
    hisWay:
      'He chooses the game, the rules and your part in it, and can change all three halfway. He may give you the weak role, the shopkeeper who keeps getting it wrong, or just want to talk. Go with it.',
    mia: {
      way: 'apart',
      text: 'Mia is with the other grown-up in another room, or asleep. This is his time alone with you. She can have a Special Time of her own another day, and the grown-ups can swap children.',
    },
    picture:
      'On the living-room carpet of the California home, Arjun points to the exact spot where the next block must go on his tall, wobbly tower, while Papa, sitting cross-legged beside him, holds out a wooden block on his open palm. A round kitchen timer sits on the carpet between them.',
    cast: ['Arjun', 'Papa'],
    sources: [
      { label: 'Hand in Hand Parenting: Five Tools That Can Transform Your Parenting (Special Time)', url: 'https://www.handinhandparenting.org/2016/08/five-tools-that-can-transform-your-parenting/' },
      { label: 'The Conversation (Whitington, University of South Australia): "Mum, can you play with me?" Let them make the rules', url: 'https://theconversation.com/mum-can-you-play-with-me-its-important-to-play-with-your-kids-but-let-them-make-the-rules-213748' },
      { label: 'Harvard Center on the Developing Child: Serve and Return, key concept', url: 'https://developingchild.harvard.edu/science/key-concepts/serve-and-return/' },
    ],
    tags: ['one-to-one', 'child-led', 'Special Time', 'after school', 'timer'],
    note: {
      what: 'A short, fixed stretch of one-to-one time in which he chooses the play and you follow with your full attention. The timer makes the start and the end clear to both of you.',
      expect:
        'The first few times he may test it: ask for something big, change his mind often, or protest when the timer rings. Some children choose games where they hold the power and you are the clumsy one; that is common and fine.',
      practising:
        'Leading: making choices and having a grown-up go along with them. For you, it is practice in following without steering.',
      ask: 'Only near the end, if it fits: "What shall we play next Special Time?" Then remember his answer.',
      next: 'Do it again soon, at about the same time of day, so he can count on it. A short time most days is easier to keep up than a long one now and then.',
      honest:
        'Ten minutes will not fix a hard week, and some days he will spend it on something that looks like nothing. It is easy to slip into teaching or tidying without noticing; if you catch yourself, just go back to following.',
      easier: 'Start with five minutes, or even three. A short time you keep is better than a long one you cut short.',
      harder:
        'The harder part is yours: twenty minutes with no instructions and no questions, only describing what he does. Or try it outdoors, where he chooses the route and you follow.',
      safety:
        'You stay with him the whole time. Outdoors, you pick the space (the garden, or a park well away from the road) and he chooses everything inside it. If he chooses something unsafe, offer two safe choices rather than a lecture. If he chooses rough play, agree "Freeze" as the stop word first, rehearse it once, and use the rough-and-tumble rules.',
    },
  },
  {
    id: 'one-sentence-each',
    group: 'quiet',
    title: 'One Sentence Each: A Family Story',
    hook: 'Everyone adds one line. You write it down and read it back at bedtime.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You, him and Mia',
    need: ['a notebook and a pencil'],
    steps: [
      'Sit together with the notebook. Start with one sentence: "One morning in Jaipur, a monkey found a red umbrella."',
      'He adds the next sentence, then you. If Mia is playing, she adds a word or a sound. Write each line down as it is said.',
      'Go round five or six times. Do not correct his plot; if the story wanders off, follow it.',
      'At bedtime, read the whole story back to him from the notebook. He can draw a picture for it the next day.',
    ],
    hisWay:
      'He can choose who starts, set a rule (every line must have an animal in it, or it all happens in Dadi\'s courtyard), switch to Hindi, or decide when the story ends.',
    mia: {
      way: 'joins',
      text: 'Ask him first whether Mia gets a turn. If so, she adds one word or a sound: a roar, a splash, "ball!". Whatever she says goes into the story, and he decides how it fits.',
    },
    picture:
      'Mummy writes in an open notebook resting on her knee, holding a pencil in her right hand and steadying the notebook with her left, on the sofa in the California living room in the evening. Arjun sits on one side of her and spreads both arms wide, hands open, as he tells the next line of the family story. Mia is tucked against Mummy’s other side, away from the notebook, with no pencil in her hands. She swings one straight arm out in front of her chest, pretending her arm is an elephant’s trunk, and her mouth is open in a loud trumpeting call. Her face is an ordinary toddler’s face.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    sources: [
      { label: 'Harvard Center on the Developing Child: Executive Function Activities for 3- to 5-year-olds (group stories)', url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-3-to-5-year-olds.pdf' },
      { label: 'UNICEF Parenting: Screen-free activities for children (Storytellers)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
    ],
    tags: ['bedtime', 'stories', 'storytelling', 'rainy day', 'car journey', 'Hindi', 'words'],
    note: {
      what: 'Each of you adds one sentence to a story that grows as it goes round. You write it down, and at bedtime you read the whole thing back to him.',
      expect:
        'His lines may ignore what came before, repeat the last one, or turn every story into a chase or a crash. Some turns will be very long. The stories often get silly, and that is fine.',
      practising:
        'Listening to the story so far and adding something that follows on from it, and telling events in order. Hearing his own words read back from the page.',
      ask: 'When you read it back, only if he is listening closely: "Which bit was yours?"',
      next: 'Read it to Dadi and Dada on the next video call, or ask them to add a line. Keep the notebook: a few of these make a small family book.',
      honest:
        'A wandering story is not a sign of a problem; five-year-olds often add their own idea rather than build on yours. Writing his words down shows him they matter, but it does not teach reading on its own.',
      easier: 'Open a picture book at any page and start the story from what you both see. Or let him add two words instead of a whole sentence.',
      harder:
        'Add a rule: every line must start with "And then" or "But", or the story must end back where it began. Or tell a whole story in Hindi.',
    },
  },
  {
    id: 'back-to-back-drawing',
    group: 'quiet',
    title: 'Back to Back: Draw What I Say',
    hook: 'One describes a picture, one draws it unseen. Then turn and compare.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You and him',
    need: [
      'four sheets of paper',
      'two crayons or pencils',
      'two hardback books to lean on (or clipboards)',
    ],
    steps: [
      'Sit back to back on the floor, each with paper on a book. Each of you draws a simple picture without letting the other see.',
      'Describe yours a piece at a time: "A big circle in the middle. A short line under it. Two dots inside the circle."',
      'He draws from your words and may ask questions. Answer in words; no peeking and no pointing.',
      'Turn round and lay the two drawings side by side. Then swap: he describes, you draw.',
    ],
    hisWay:
      'When he describes, he chooses the picture and how hard it is. He can set rules for you, such as no questions allowed, or make his own picture tricky on purpose.',
    mia: {
      way: 'alongside',
      text: 'Mia sits at the low table nearby with her own chunky crayon and a big sheet of paper, drawing whatever she likes. Her paper is hers; his drawing stays out of her reach.',
    },
    picture:
      'Arjun and Papa sit on the living-room rug of the California home with their backs pressed together, facing opposite ways: Arjun faces the left edge of the picture and Papa faces the right edge, so neither can see the other’s paper. Each has a sheet of paper on a hardback book on his lap and a pencil in his right hand. Papa looks up as he describes his picture aloud. Arjun looks down at his own paper and draws a big circle with a short straight flat line underneath it, the line not touching the circle.',
    cast: ['Arjun', 'Papa'],
    sources: [
      { label: 'PBS KIDS for Parents: Can You Draw What I Describe? A Partner Drawing Game', url: 'https://www.pbs.org/parents/crafts-and-experiments/can-you-draw-what-i-describe-a-partner-drawing-game' },
      { label: 'NRICH Early Years (University of Cambridge): Barrier Games', url: 'https://nrich.maths.org/eyfs-activities/barrier-games' },
      { label: 'NRICH (University of Cambridge), Sue Gifford: The Importance of Shape and Space in the Early Years', url: 'https://nrich.maths.org/articles/importance-shape-and-space-early-years' },
    ],
    tags: ['drawing', 'rainy day', 'shapes', 'position words', 'paper', 'listening'],
    note: {
      what: 'One of you describes a simple drawing in shapes and places, and the other draws it from the words alone, back to back. Then you compare and swap.',
      expect:
        'When he describes, he will probably say "draw this" or "like that" and forget you cannot see; expect a few laughs at the results. When he draws, "next to" and "under" may come out in odd places.',
      practising:
        'Shape words (circle, square, triangle) and position words (on top, under, next to, inside), used to give and follow exact instructions. Noticing that the listener only knows what you say.',
      ask: 'When you turn round, once: "Which part came out different? What could I have said?"',
      next: 'On a walk, describe a house or a car using only shapes and see whether he can spot which one you mean.',
      honest:
        'The drawings will not match closely, and that says little about how well he listens. The part worth watching is whether his own descriptions grow clearer after a few rounds.',
      easier: 'Use only two or three shapes, and allow one sneak peek halfway so he can see how it is going. Or face each other with a book standing up between you so you can still see each other\'s faces.',
      harder:
        'Add sizes and counts ("three small squares in a row, under the big circle"), or describe a real object in the room without naming it until the end.',
    },
  },
  {
    id: 'packing-for-jaipur',
    group: 'quiet',
    title: 'Packing for Jaipur',
    hook: '"I\'m packing my bag for Jaipur and I\'m taking..." Each adds one.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to gather a bag and some things',
    players: 'You and him',
    need: [
      'a small bag or backpack',
      'six to ten everyday things, none small enough to fit inside a toilet-roll tube: a shawl, a toothbrush, a sock, a book, a cap, a steel tumbler',
    ],
    steps: [
      'Lay the things out on the floor and name each one together. Say: "We are going to Jaipur to see Dadi and Dada."',
      'Start: "I\'m packing my bag for Jaipur and I\'m taking a shawl." Put the shawl in the bag.',
      'He says the whole list so far, then adds one thing and packs it. Take turns, the list growing each time.',
      'Once he knows the game, put the leftover things out of sight and pack only from memory and imagination.',
      'If anyone gets stuck, open the bag and peek together, then carry on. Nobody is out.',
    ],
    hisWay:
      'He can pack silly things ("an elephant", "a camel from the desert"), make a rule that everything must be red or soft, choose the place (the beach, the moon, Dadi\'s rooftop), or play the one who checks the list.',
    mia: {
      way: 'alongside',
      text: 'Mia has her own bag and a few soft things, a teddy and a sunhat, to pack and unpack beside you. Her bag is separate from the game, and his bag stays on his side, away from her.',
    },
    picture:
      'On the bedroom floor of the California home, Arjun drops a folded red shawl into an open blue backpack, looking up at the ceiling as he tries to remember what is already inside; Mummy, kneeling opposite him, waits her turn beside a row of everyday things: a toothbrush, a cap, a book and a steel tumbler.',
    cast: ['Arjun', 'Mummy'],
    sources: [
      { label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-year-olds (Packing a Suitcase for Grandma)', url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf' },
      { label: 'Harvard Center on the Developing Child: Enhancing and Practicing Executive Function Skills, activities guide', url: 'https://developingchild.harvard.edu/resources/activities-guide-enhancing-and-practicing-executive-function-skills-with-children-from-infancy-to-adolescence/' },
      { label: 'Nemours KidsHealth: Choosing Safe Toys for Toddlers and Preschoolers (the toilet-roll tube test)', url: 'https://kidshealth.org/en/parents/safetoys-young.html' },
    ],
    tags: ['memory game', 'Jaipur', 'Dadi and Dada', 'travel', 'car journey', 'rainy day'],
    note: {
      what: 'A memory game in which each turn repeats the whole packing list and adds one more thing. Real objects and a real bag come first; later the list lives only in your heads.',
      expect:
        'With the things in sight, he will often look at them rather than remember; that is the easy start. Without them, the list usually comes apart after a handful of things, often with one missed from the middle. Silly items tend to stick better.',
      practising:
        'Holding a growing list in mind and saying it back in order, which is working memory. Waiting for his turn while still keeping track.',
      ask: 'Only if he gets stuck: "What did we pack first?" Starting from the beginning often brings the rest back.',
      next: 'Before a real trip, or a visit to the park, let him pack one bag himself from a list he says out loud.',
      honest:
        'How long the list gets depends on the day, how tired he is, and how silly the items are. A short list is not a sign of a poor memory, and there is no need to keep a record to beat.',
      easier: 'Keep all the things in sight the whole time, and stop at five. Or let him point to each thing as he says it.',
      harder:
        'Pack in alphabet order (an apple, a book, a cap...), or say the list backwards before adding. Or play it in Hindi, and try it with Dadi and Dada on a video call.',
      safety:
        'Choose only things too big to fit inside a toilet-roll tube, so nothing small enough for Mia to choke on is lying about: no coins, beads, hair clips or small toys. No plastic bags in the game; use a cloth bag or a backpack.',
    },
  },
  {
    id: 'make-the-fruit-chaat',
    group: 'quiet',
    title: 'Make the Fruit Chaat',
    hook: 'He slices the banana, shares it out fairly and adds the masala.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Five minutes to wash hands and set out fruit and bowls',
    players: 'You, him and Mia',
    need: [
      'two or three kinds of fruit: a banana, an apple, grapes, orange segments (or whatever is in the fruit bowl)',
      'a butter knife for him, and a sharp knife that only you use',
      'a chopping board, a big bowl and one small bowl for each person',
      'chaat masala (or a pinch of salt and roasted cumin) and half a lemon',
    ],
    steps: [
      'Wash hands together. He rinses the fruit in a bowl of cold water; then you cut the apple and peel the orange.',
      'He peels the banana and slices it into rounds with the butter knife on the board. You quarter the grapes lengthwise.',
      'He shares the fruit into the family\'s bowls, one piece at a time: one for Papa, one for Mummy, one for me, and round again.',
      'He counts each bowl to check it is fair, then sprinkles a pinch of chaat masala over each. You squeeze the lemon.',
    ],
    hisWay:
      'He decides which fruits go in, who gets which bowl, and whether the share is fair. He can invent a family recipe of his own (no apple, extra banana) and take an order from each person.',
    mia: {
      way: 'joins',
      text: 'Mia sits in her high chair beside the table with her own bowl and drops in the quartered grapes you pass her, one at a time. She can eat as they land, while he deals out the other bowls himself.',
    },
    picture:
      'At the kitchen table, Arjun peels a ripe banana with both hands and drops pieces he has broken off with his fingers into a steel bowl, while Mummy, beside him, holds a small steel bowl of washed grapes and smiles; Mia sits on Mummy’s other side holding a spoon. There is no knife anywhere in the picture.',
    cast: ['Arjun', 'Mummy', 'Mia'],
    sources: [
      { label: 'Stanford DREME Family Math: Math Talk While Cooking Together', url: 'https://familymath.stanford.edu/activity/tips-for-cooking-with-math-2/' },
      { label: 'Harvard Center on the Developing Child: Executive Function Activities for 3- to 5-year-olds (cooking)', url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-3-to-5-year-olds.pdf' },
      { label: 'AAP HealthyChildren.org: Choking Prevention', url: 'https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx' },
    ],
    tags: ['kitchen', 'snack', 'helping', 'cooking', 'fair sharing', 'counting', 'no cook', 'fruit'],
    note: {
      what: 'He makes the family snack: washing fruit, slicing a banana with a butter knife, sharing pieces fairly into everyone\'s bowl, and adding chaat masala. You do the hard cutting.',
      expect:
        'Banana slices will be uneven and some will be squashed. When sharing, he may give one bowl a handful at once, or lose count and need to start that bowl again. He will probably eat a few pieces on the way.',
      practising:
        'Fair sharing by dealing out one at a time, and counting to check two groups are the same. Using a knife with care, on soft fruit.',
      ask: 'Once the bowls look full, if it fits: "How could we check that everyone has the same?"',
      next: 'Let him set the table for dinner: one plate, one spoon and one cup for each person, counted out to match.',
      honest:
        'Dealing out one at a time makes the counts equal, not the amounts: his banana rounds will vary, so a bowl with bigger pieces may really hold more. If he spots that, it is worth talking about. Fair dealing does not mean he understands division.',
      easier: 'Use only bananas and orange segments, which need no knife, and share into two bowls instead of four.',
      harder:
        'Share twelve pieces between four bowls and ask how many each person got, or make it uneven on purpose and let him fix it. He can also measure the chaat masala in pinches: one each.',
      safety:
        'No heat anywhere in this. He uses only a butter knife on soft fruit; the sharp knife stays with you and goes into the sink straight after. Tip out the washing water as soon as the fruit is rinsed. Cut grapes into quarters lengthwise, and give Mia only soft banana and quartered grapes; apple chunks, whole grapes and pomegranate seeds stay out of her reach, as all are choking risks for a two-year-old.',
    },
  },
  {
    id: 'sort-the-laundry',
    group: 'quiet',
    title: 'Sort the Laundry, Match the Lids',
    hook: 'Pair the socks, sort by person, fit every lid. He picks the rule.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You, him and Mia',
    need: [
      'a basket of clean, dry washing with plenty of socks',
      'five or six plastic tubs and their lids (from the kitchen cupboard)',
    ],
    steps: [
      'Tip the clean washing onto the bed. He finds every sock and pairs them; the odd ones go in their own pile.',
      'Ask him how to sort the rest: by person, by colour, or big and small. Use his rule, then ask him for a different one.',
      'Fold the small towels together: in half, then in half again. He carries each person\'s pile to their room.',
      'Later, tip the plastic tubs and lids onto the kitchen floor. He fits every lid to its tub and stacks them back in the cupboard.',
    ],
    hisWay:
      'He decides the sorting rule and when to change it: whose clothes, stripes and spots, things with pockets. He can be the one who checks your pairs, and he says when the job is done.',
    mia: {
      way: 'joins',
      text: 'Mia sits beside you on the bed and hands him socks from the pile, one at a time, then carries a folded pair to a room holding your hand. She has her own two tubs to stack while he matches the lids.',
    },
    picture:
      'On the big bed in the California home, Arjun lays a pair of matching blue socks on Papa\'s pile, while Papa folds a small towel in half beside him and Mia, sitting among the clean washing, holds out a striped sock to Arjun.',
    cast: ['Arjun', 'Papa', 'Mia'],
    sources: [
      { label: 'Harvard Center on the Developing Child: Executive Function Activities for 3- to 5-year-olds (sort by one rule, then switch)', url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-3-to-5-year-olds.pdf' },
      { label: 'CDC Learn the Signs. Act Early: Milestones by 5 Years', url: 'https://www.cdc.gov/act-early/milestones/5-years.html' },
      { label: 'Zero to Three: 5 Ways to Play with Empty Plastic Containers', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-empty-plastic-containers/' },
    ],
    tags: ['helping', 'chores', 'laundry', 'socks', 'sorting', 'rainy day', 'kitchen'],
    note: {
      what: 'Real jobs done as a game: he pairs the socks, sorts the clean washing by a rule he chooses, and fits the kitchen tubs to their lids. The washing really does get put away.',
      expect:
        'He will pair socks by colour and may put two that nearly match together; that is a fair first try. When you ask for a new rule he may keep sorting by the old one for a while. Some lids will need several tries.',
      practising:
        'Sorting by one rule, then switching to another, which is a form of flexible thinking. Matching by size and shape. Doing a job that helps the family.',
      ask: 'Once, when he snaps a lid on: "How did you know that one would fit?"',
      next: 'Give him one small job of his own each week, such as pairing the socks or setting out the shoes, and let him do it his way.',
      honest:
        'It will take longer than doing it yourself, and some pairs will be wrong. The real gain is that he did a useful job for the family; it does not prove much about his thinking.',
      easier: 'Sort only socks, into two piles: his and everyone else\'s. Use three tubs with very different sizes of lid.',
      harder:
        'Add a second rule at once ("Papa\'s socks that are dark"), or match lids with his eyes closed by feel, or fold a T-shirt: sides in, then in half.',
      safety:
        'The iron stays off and away. Keep plastic bags and dry-cleaning covers out of the room, as they are a suffocation risk for Mia, and keep detergent, especially pods, shut away. Plastic tubs only, no glass jars. Keep the lid game on the floor, not on the counter.',
    },
  },
];
