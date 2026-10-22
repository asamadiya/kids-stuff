import type { PlayIdea } from '../types';

/**
 * Rough and Tumble: four contact games. The advisor (q7 ruling 9) made asking
 * first and a rehearsed "Freeze" mandatory, ruled out pinning, weight on him,
 * joint pulling and throwing, asked for a handicap said out loud rather than a
 * set winning ratio, and kept Mia outside the contact area (ruling 10).
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'can-you-move-my-cushion',
    group: 'rough',
    title: 'Can You Move My Cushion?',
    hook: 'You kneel behind a big cushion. He pushes until you topple.',
    where: 'indoors',
    energy: 'active',
    contact: true,
    minutes: 5,
    setup: 'Two minutes to clear a space',
    players: 'You and him; another grown-up with Mia',
    need: [
      'a big floor or sofa cushion (or a folded quilt)',
      'a rug, mattress or soft carpet to fall on',
    ],
    steps: [
      "Ask if he wants to play. Agree that 'Freeze' stops everything, for either of you, then practise once: he pushes, someone says Freeze, both go still.",
      'Kneel on the rug and hold the big cushion against your chest. He pushes it gently with both hands from a standstill, no run-ups; nothing goes near faces or necks.',
      'Give him just enough resistance that he has to work. Sometimes hold firm; sometimes topple over slowly with a loud groan and lie there, defeated.',
      "Say your handicap out loud: 'I'll use one hand,' or 'I'll kneel on one knee.' Change it when he is winning too easily or not at all.",
      'Keep rounds short and check he still wants more. After four or five, lie on your backs and take three slow breaths together.',
    ],
    hisWay:
      "He sets your handicap ('only your little finger'), says 'Ready, steady, push', and decides when the game ends. He can swap: he kneels holding the cushion with sofa cushions behind him, you push it with one finger from your knees, and he chooses when to topple.",
    mia: {
      way: 'apart',
      text: 'Mia is with Mummy or another grown-up, in another room or on the sofa outside the play area, so he has you to himself. She gets her own gentle push turn later, not in the middle of his.',
    },
    picture:
      'Arjun, barefoot, leans in with both hands flat against a big orange sofa cushion, pushing, while Papa kneels on the living-room rug behind it, holding it with one hand and tipping slowly backwards with an exaggerated groaning face; the coffee table is pushed back against the wall of the sunny California living room.',
    cast: ['Arjun', 'Papa'],
    sources: [
      {
        label: "Journal of Child and Family Studies (2018), StGeorge, Goodwin and Fletcher: Parents' Views of Father-Child Rough-and-Tumble Play (Newcastle University repository copy)",
        url: 'https://outputs.ncl.ac.uk/articles/journal_contribution/Parents_Views_of_Father_Child_Rough-and-Tumble_Play/34345194',
      },
      {
        label: 'Hand in Hand Parenting (Merali and Orson): 15 Playful Ways to Solve Sibling Rivalry (tip 11, the pushing game)',
        url: 'https://www.handinhandparenting.org/2016/08/15-playful-ways-handle-sibling-rivalry/',
      },
    ],
    tags: ['rainy day', 'rough play', 'pushing', 'cushion', 'five minutes', 'after school'],
    note: {
      what: "You kneel holding a big cushion and he pushes it, trying to tip you over. You set the resistance, change it as he goes, and stop the moment either of you says 'Freeze'.",
      expect: "He will probably push wildly at first, then may try pushing low or from one side; topple more readily when he tries something new, so the change pays off. Expect laughing, and 'one more' long after you planned to stop.",
      practising: 'Judging his own strength against a partner who responds to him, and stopping on a word in the middle of excitement.',
      ask: "After a round he wins, while he gets his breath back: 'Where did you push to make me fall?'",
      next: 'Later, ask him to push the full laundry basket across the floor to the washing machine for you, with the same low, steady push.',
      honest: 'This shows he enjoys testing his strength against you; it does not, on its own, make him stronger or teach self-control. If he wins every round, or never wins, the game stops working, and long rounds close to bedtime tip into overexcitement.',
      easier: 'Sit back on your heels and give way after a few seconds of steady pushing, so he feels his push work.',
      harder: 'Add a rule: he pushes with one hand only, or has to keep both knees on the rug too. Or ask him to find the angle that tips you fastest.',
      safety: "Rug or mattress on every side, and two big steps clear of furniture edges. You stay on your knees and never lean your weight onto him; hands go on the cushion only, never faces or necks. Stop on 'Freeze', on a grimace or if he pulls away, even if he is laughing. Not right before bed.",
    },
  },
  {
    id: 'sock-wrestle',
    group: 'rough',
    title: 'Sock Wrestle',
    hook: 'One sock each. Pull his off, keep yours on, all on your knees.',
    where: 'indoors',
    energy: 'active',
    contact: true,
    minutes: 5,
    setup: 'Two minutes to clear a space',
    players: 'You and him; another grown-up with Mia',
    need: [
      'one sock each, loose enough to pull off (old ones are best)',
      'a rug, mattress or futon, with sofa cushions round the edge',
    ],
    steps: [
      "Ask if he wants to wrestle. Agree 'Freeze' stops it for either of you, and practise once. Say the rules aloud: knees only, no hitting, kicking, biting, faces or necks.",
      'Each of you puts one sock on the same foot. Kneel facing each other in the middle of the rug.',
      "On 'Go', each tries to pull the other's sock off while keeping their own on. Tug the sock by its toe, never his foot or leg. Stay on your knees.",
      "Say your handicap before a round: 'I'll keep one hand behind my back.' Win some, lose some, and make him work for each.",
      'Play short rounds and check he still wants another. Finish with a handshake, a hug or a namaste, so the end of the game is clear.',
    ],
    hisWay:
      "He chooses the handicap for you, invents a new rule ('you have to keep your sock foot tucked under you'), or decides it is best of three. He can also call a sock swap so you wrestle for the other foot.",
    mia: {
      way: 'apart',
      text: 'Mia is with Papa or another grown-up in the kitchen or the garden while the two of you wrestle, outside the play area. If she wants a turn afterwards, she can pull a sock off that grown-up slowly on the sofa.',
    },
    picture:
      "On the living-room rug, Arjun and Mummy kneel upright facing each other, an arm’s length apart, about to start: each has one long red-and-white striped sock pulled up over one shin. Mummy holds up one flat open hand like a policeman’s stop sign and Arjun copies her, both shouting the stop word together and grinning. Cushions are piled round the edge of the rug and the coffee table is pushed back against the wall.",
    cast: ['Arjun', 'Mummy'],
    sources: [
      {
        label: 'The Conversation (Emily Freeman, University of Newcastle): Kids learn valuable life skills through rough-and-tumble play with their dads',
        url: 'https://theconversation.com/kids-learn-valuable-life-skills-through-rough-and-tumble-play-with-their-dads-119241',
      },
      {
        label: "The Conversation (Emily Freeman): 'That's getting a bit wild, kids!' Why children love to play-fight",
        url: 'https://theconversation.com/thats-getting-a-bit-wild-kids-why-children-love-to-play-fight-and-why-it-is-good-for-them-212967',
      },
      {
        label: "Children (MDPI, 2022), Freeman and Robinson: The Relationship between Father-Child Rough-and-Tumble Play and Children's Working Memory",
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9315721/',
      },
    ],
    tags: ['rainy day', 'rough play', 'wrestling', 'socks', 'five minutes', 'no equipment'],
    note: {
      what: "A short kneeling wrestle with one goal: pull his sock off and keep yours on. The rules are said aloud first, and 'Freeze' from either of you stops it at once.",
      expect: 'At first he will grab at your sock and forget to protect his own. After a few rounds he may tuck his sock foot under him or guard it with one hand, which is the game working. Expect protests when he loses a round.',
      practising: 'Playing hard inside agreed rules: using his strength while watching your face and body, and taking both winning and losing in a game that matters to him.',
      ask: "Between rounds, if he lost one: 'What could you try to keep your sock on next time?'",
      next: 'Pair the socks from the washing basket together afterwards, and see if he can find the two socks you wrestled with.',
      honest: "One play-fight does not build working memory or calm. The study cited here (Freeman and Robinson) saw 30 fathers and their children aged 4 to 7 at a single visit, and found an association, not an effect of any game. It also goes wrong if you win every round, or let him win every round without a struggle.",
      easier: 'Wear your sock pulled half off already, so a single tug from him wins it, and keep your own hands slow.',
      harder: 'Socks on both feet, and he must get both of yours before you get both of his. Or, for a round he asks for, you drop your one-hand handicap.',
      safety: "Everyone stays on their knees: no standing, no lifting, no lying on top of him, no pulling his leg or twisting his ankle; take the sock, not the foot. Clear the coffee table and hard edges first. Stop on 'Freeze', a grimace or pulling away, even mid-laugh. Mia stays outside the play area with another adult.",
    },
  },
  {
    id: 'tiger-and-the-cave',
    group: 'rough',
    title: 'The Slow Tiger and the Mango',
    hook: 'You are a sleepy tiger. He steals the mango and runs for his cave.',
    where: 'indoors',
    energy: 'active',
    contact: true,
    minutes: 15,
    setup: 'Two minutes to clear a space',
    players: 'You and him; another grown-up with Mia',
    need: [
      'a pair of socks rolled into a ball, for the mango (or a soft toy)',
      'a big floor cushion for the cave (or a folded blanket)',
      'a clear rug or carpet',
    ],
    steps: [
      "Ask if he wants to play. Agree 'Freeze' stops the game for either of you, and practise it once mid-creep. Put the cushion cave on the rug.",
      'Put the sock mango at the far side of the room. You are a slow, sleepy tiger on hands and knees, guarding it. Tigers may not enter the cave.',
      'He sneaks out, grabs the mango and runs for his cave. Crawl after him slowly, growling; sometimes pretend to doze so he can creep past.',
      'If you reach him before the cave, give a slow, loose hug from your knees and a soft growl. Open your arms the moment he wriggles; he always escapes.',
      'Swap after a few raids: he is the tiger and you sneak for the mango on your knees. Finish with a namaste and a glass of water.',
    ],
    hisWay:
      'He decides how fast the tiger may move (sleepy, slow, very slow), where the cave and the mango go, or adds a second mango. When he is the tiger, he decides what the tiger does when it reaches the thief: a roar, a sniff or a loose hug.',
    mia: {
      way: 'apart',
      text: 'Mia is with Papa or another grown-up, so he has you to himself. She can watch from a lap on the sofa and growl along with her own soft toy, well away from the floor where the chase happens. She never comes down into the play area and is never chased; if she wriggles to get down, the grown-up takes her off to play somewhere else.',
    },
    picture:
      'Arjun runs barefoot across the living-room rug towards a big orange floor cushion lying on the rug ahead of him on the left side of the picture, hugging a round yellow ball of rolled-up socks to his chest with both hands and grinning back over his shoulder. Behind him on the right, far from the cushion, Mummy crawls slowly on her hands and knees with a playful sleepy-tiger face, mouth open in a soft growl, one hand lifted off the rug like a paw. The furniture is pushed back against the walls of the sunny California living room. Mummy’s face is playful and smiling, a pretend-tiger grin, never cross or fierce.',
    cast: ['Arjun', 'Mummy'],
    sources: [
      {
        label: "The Conversation (Emily Freeman, University of Newcastle): 'That's getting a bit wild, kids!' Why children love to play-fight",
        url: 'https://theconversation.com/thats-getting-a-bit-wild-kids-why-children-love-to-play-fight-and-why-it-is-good-for-them-212967',
      },
      {
        label: 'Hand in Hand Parenting: Five Connection Tools That Will Transform Your Parenting (Playlistening: a chase where you are too bumbling to catch them)',
        url: 'https://www.handinhandparenting.org/2016/08/five-tools-that-can-transform-your-parenting/',
      },
    ],
    tags: ['rainy day', 'rough play', 'chase', 'pretend', 'tiger', 'mango', 'socks'],
    note: {
      what: 'A slow chase on the floor with a story. You are a sleepy tiger on hands and knees; he steals a rolled-sock mango and runs back to his cushion cave, where tigers cannot go. A catch is a loose hug he wriggles out of.',
      expect: 'He will probably tease the tiger, creeping close and squealing away, more than go straight for the mango. Many children want to be caught now and then, just to escape. If the growls are too fierce, the game turns scary quickly; start soft.',
      practising: 'Choosing his own small thrill: deciding when to dash, judging how close the tiger is, and coming back to a safe place he controls.',
      ask: "After an escape, if he stops to catch his breath: 'How did you know when to run?'",
      next: 'Tell him an Indian folk tale with a tiger in it, such as The Tiger, the Brahmin and the Jackal, and let him decide whether the tiger was clever or foolish.',
      honest: 'The research behind games like this is about rough-and-tumble play in general, not this game; it does not show that a slow chase builds courage. A tiger that is too fast or too frightening turns play into fear, and a wound-up child close to bedtime will not settle.',
      easier: 'Make the tiger very sleepy: it may only crawl while his back is turned, or must count to five before every move.',
      harder: 'Put two mangoes in different corners so he must choose which to go for, or give the tiger one quick pounce per raid.',
      safety: "Clear the coffee table and hard edges first, and put the cave on the rug away from walls. Barefoot, not socks, on smooth floors. You stay on hands and knees all game; no pinning, no lying on him, and let go the instant he wriggles. Keep the first raids short and check he still wants more. Stop on 'Freeze', a grimace or pulling away, even if he is laughing. Mia stays off the floor with another adult.",
    },
  },
  {
    id: 'kabaddi-on-one-breath',
    group: 'rough',
    title: 'Kabaddi on One Breath',
    hook: "He chants 'kabaddi' on one breath, tags you, and gets home in time.",
    where: 'either',
    energy: 'active',
    contact: true,
    minutes: 15,
    setup: 'Two minutes to mark a line',
    players: 'You and him; another grown-up with Mia',
    need: [
      'something flat to mark a line: a row of chappals on the grass, or masking tape on the carpet',
      'a cushion for your knees',
    ],
    steps: [
      "Ask if he wants to play. Agree 'Freeze' stops it for either of you, and practise once. Mark a line and kneel on your cushion just over it.",
      "He takes one ordinary breath, crosses the line chanting 'kabaddi, kabaddi' without stopping, and tries to touch your hand, arm or knee.",
      'He must get home before the chant breaks. Your handicap, said aloud: you stay kneeling and only tap his arm or back; never hold, grab, pull or tackle.',
      'If he breathes in on your side, or you tap him, he walks home; nobody is out. Swap: you raid on your knees, and he guards by tapping.',
    ],
    hisWay:
      "He chooses where the line goes, what counts as a touch (knee only, or both shoulders), and when to swap. He can set your raiding rule too: 'You have to raid with your hands on your head.'",
    mia: {
      way: 'apart',
      text: "Mia is with Mummy or another grown-up, so he has you to himself. She can watch from a lap on the back step (or the sofa, indoors), chanting 'kabaddi' and clapping along. She never crosses the line or comes into the play area; if she wriggles to get down, the grown-up takes her off to play somewhere else.",
    },
    picture:
      "In the sunny back garden of the California home, a straight row of chappals lies on the lawn between Arjun and Papa as a dividing line. Arjun, mouth open mid-chant, leans across the row of chappals from his own side and touches Papa’s forearm with one open hand, his back foot still on his own side and already turning for home. Papa kneels on a flat cushion on the grass just past the chappals and reaches one open hand round to tap Arjun lightly on the back; his other hand rests on his knee.",
    cast: ['Arjun', 'Papa'],
    tradition:
      "Kabaddi is played across India and at national level by boys and girls; it is also called Hu-tu-tu, Chedugudu (Andhra Pradesh), Sadugudu (Tamil Nadu) and Hadudu (Bengal). The real game is two teams of seven on a court: defenders he touches go out, and the defending team tries to hold the raider until his breath breaks. This is a two-person adaptation: one raider, one defender who stays on his knees and may only tap, never hold or tackle; nobody goes out, and you take turns. The one-breath chant is kept as it is.",
    sources: [
      {
        label: "D'Source, IDC IIT Bombay (Periwal and Poovaiah), Indian Games: Kabaddi",
        url: 'https://www.dsource.in/resource/indian-games/outdoor-games/kabaddi',
      },
      {
        label: 'Wikipedia: Kabaddi (the one-breath chant, the team game and regional names)',
        url: 'https://en.wikipedia.org/wiki/Kabaddi',
      },
    ],
    tags: ['garden', 'outdoors', 'Indian games', 'kabaddi', 'rough play', 'breath', 'chant'],
    note: {
      what: "A two-person, kneeling version of kabaddi. He crosses a line chanting 'kabaddi' on one breath, touches you and gets home before the breath runs out; you stay on your knees and may only tap him lightly, never hold him.",
      expect: 'He will probably forget the chant the moment he reaches you, or sneak a breath mid-word. Expect him to argue about whether he breathed; a quick start-again settles it better than a ruling. At five, one breath of chanting may last only a few seconds.',
      practising: 'Keeping one thing going (the chant) while planning another (a touch and a quick way home), against a time limit set by his own breath.',
      ask: "After a raid where the giggles broke his chant: 'What happens to the kabaddi when you start laughing?'",
      next: "Next time you speak to Dadi or Dada, ask them to tell him whether they played kabaddi as children, and what they called it.",
      honest: 'This is not kabaddi as it is played: there are no teams, no court, no outs and no tackling, so he has not played the sport yet. A short breath at five is normal and says nothing about fitness or lungs.',
      easier: "Drop the breath rule: he raids saying 'kabaddi' as many times as he likes, and you keep your hands on your knees instead of tapping.",
      harder: 'He must touch two places, such as your knee and your shoulder, on one breath. Or, out of curiosity, count together how many kabaddis fit into one of his breaths and one of yours.',
      safety: "Outdoors, play on grass, not a hard patio; check it for sticks and sprinkler heads, and play away from the pool, the drive and the street. Indoors, clear a long strip of floor away from furniture corners, barefoot on smooth floors. You stay on your knees all game and only tap his arm or back with a light open hand. Never hold his hand or arm, so nothing pulls on his joints when he twists away, and never grab, tackle or pull him down. One ordinary breath only: no big puffing breaths first, no silent breath-holding, and stop at any dizziness. Keep raids short and check he still wants to play. Stop on 'Freeze', even if he is laughing. Mia stays off the play area with another adult.",
    },
  },
];
