import type { PlayIdea } from '../types';

/**
 * Games with rules: Indian and family games for taking turns, winning and losing.
 * The advisor made Chidiya Udd and Stapu Together (id kept; titled Tokkudu Billa,
 * Nanna's side's name for hopscotch, Paandi on Amma's) must-includes, asked for
 * short Snakes and Ladders variants, and ruled that adaptations are labelled honestly:
 * traditional Raja-Mantri needs four players, so the three-player game says so.
 * Round 3 (a8 ruling D): Telugu and Tamil names only where the rules match;
 * Chidiya Udd keeps its Hindi calls, with its origin stated.
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'chidiya-udd',
    group: 'rules',
    title: 'Chidiya Udd: Does It Fly?',
    hook: 'Lift a finger only if it really flies. The leader’s finger is a trap.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 5,
    setup: 'No setup',
    players: 'You and him, or more',
    need: [],
    steps: [
      'Sit facing him, both index fingers on the floor between you. Start easy: “Tota udd!” (parrot), and you both lift. “Haathi udd!” (elephant), and you both stay down.',
      'As leader, flick your own finger up on every name, even “Kursi udd!” (chair). He lifts only for things that really fly, so your finger is the trap.',
      'Once he is steady, slip in tricky ones: chamgadar (bat), shuturmurg (ostrich), patang (kite), hawai jahaz (aeroplane), mor (peacock). Stop and argue each one.',
      'Nobody is out. A wrong lift gets a cheerful “Pakda!” (caught) and the next name comes straight away. After ten names, he leads and tries to catch you.',
    ],
    hisWay:
      'He takes over as leader, picks the names and rules on the tricky ones: he may decide a kite counts only on a windy day. He can change the action too, to “Mendak kood!” for things that jump.',
    mia: {
      way: 'alongside',
      text: 'Mia sits close with a toy bird of her own and makes it fly whenever she likes. Her lifts do not count and nobody corrects her, so his game keeps its speed.',
    },
    picture:
      'On the patio of the Bay Area house, Arjun and Tatayya sit cross-legged facing each other on a cotton mat. Tatayya flicks his index finger high in the air as he calls out a name, while Arjun keeps his own index finger pressed firmly to the mat between them and grins; two mourning doves sit on the wooden backyard fence behind them, beside the lemon tree.',
    cast: ['Arjun', 'Tatayya'],
    tradition:
      'Chidiya Udd (“fly away, bird”), a quick Indian finger game for any number of children, played with Hindi calls, which this version keeps. In the version D’Source records, a wrong lift or a missed one puts a player out until nobody is left. This version keeps everyone in, starts with easy names before tricky ones, and stops to argue the tricky ones.',
    sources: [
      { label: 'D’Source (IDC, IIT Bombay), Indian Games: Chidiya Udd', url: 'https://www.dsource.in/resource/indian-games/indoor-games/chidiya-udd' },
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds (waiting for the right word before acting)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
    ],
    tags: ['no equipment', 'waiting', 'grandparents', 'Tatayya', 'birds', 'Hindi words', 'self-control'],
    note: {
      what: 'A finger game. You call a name with “udd” and flick your finger up every time; he lifts his only if the thing really flies. Then he leads.',
      expect:
        'At first he will copy your finger, because a moving finger is faster than a word. The tricky names start real arguments: a bat flies but is not a bird, an ostrich is a bird that cannot fly, an aeroplane flies but is not alive.',
      practising:
        'Holding back a movement his hand is pulled into making, and checking a fact before acting. Sorting by one property, flying, while others (is it a bird? is it alive?) get in the way.',
      ask: 'After a tricky one, if he wants to argue: “Does a kite fly by itself, or does something make it fly?”',
      next: 'Next time a crow, a bee or a plane goes over, ask him whether it would be a lift in Chidiya Udd, and let him ask you one back.',
      honest:
        'Catching you out a few times is practice at this game; it does not show his self-control with Mia or in class. The real game puts players out one by one until nobody is left, which suits a big group of older children, not a five-year-old and one grown-up.',
      easier: 'Use only obvious names, go slowly, and keep your own finger still so the only signal is the word.',
      harder: 'Speed up and mix in people and things from the house: “Tatayya udd!” (only on the plane home to Hyderabad, he may argue), “Chappal udd!”, “Titli udd!”.',
      safety:
        'Sitting down there is nothing to watch for. If it turns into a standing game where everyone jumps for flyers, clear the space and keep it to small jumps on the spot.',
    },
  },
  {
    id: 'stapu-together',
    group: 'rules',
    title: 'Tokkudu Billa Together',
    hook: 'A short chalk grid, a bean bag, and a route he gets to redraw.',
    where: 'outdoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Five minutes to chalk a grid',
    players: 'You, him and Mia',
    need: [
      'chalk (or masking tape on a carpet indoors)',
      'a bean bag (or a pair of rolled-up socks) as the marker',
    ],
    steps: [
      'Chalk six boxes, each about 45 cm (18 in) across: 1, 2, 3 in a line, then 4 and 5 side by side, then 6. Number them big.',
      'He tosses the bean bag into box 1 and steps through the grid, skipping that box. Walking is fine; hop only when he wants to.',
      'Say each number as he lands, in English and Telugu (“four, naalugu”) or Tamil (“four, naalu”). At 6 he turns, picking up the bean bag on the way back.',
      'Next turn the bean bag goes into box 2, then 3. A wobble or a line touch just means try that box again; nobody sits out.',
      'Hand him the chalk. He adds boxes, a curve, or a rest square, and you follow his route.',
    ],
    hisWay:
      'He owns the grid: he can add a “house” square where both feet go down, draw a snail spiral, number backwards from 10, or set a move for each box. He can also set your rule, such as hopping on your other foot.',
    mia: {
      way: 'joins',
      text: 'Mia walks the grid holding your hand, two feet in every box, while he waits his turn. When you say “Give it to Arjun anna”, she can hand him the bean bag before his turn; she does not take his turn or his box.',
    },
    picture:
      'On the concrete path beside the backyard lawn of the Bay Area house, with raised vegetable beds and the wooden fence behind, Arjun hops on one foot along a short chalk hopscotch grid of plain squares, with his arms out for balance. A small red bean bag lies inside one of the chalk squares behind him. At the start of the grid, Amma stands holding Mia’s hand, and Mia stands with both feet together, waiting for her turn. The chalk squares have no numbers or letters in them. There are no boxes or crates on the path. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.',
    cast: ['Arjun', 'Amma', 'Mia'],
    tradition:
      'Tokkudu Billa in Andhra Pradesh and Telangana, Paandi in Tamil Nadu, Kunte Bille in Karnataka, Ekhaat-Duhaat in Bengal, and Stapu, Kith-Kith or Langdi in Hindi: hopscotch as played across India, with a flat stone as the marker. Nanna’s family and Amma’s family each have a name for it. This version uses a shorter grid, a bean bag instead of a stone, lets him step before he hops, and does not end his turn on a wobble.',
    sources: [
      { label: 'D’Source (IDC, IIT Bombay), Indian Games: Stapoo', url: 'https://www.dsource.in/resource/indian-games/outdoor-games/stapoo' },
      { label: 'Wikipedia: Hopscotch (Indian names and versions)', url: 'https://en.wikipedia.org/wiki/Hopscotch' },
      { label: 'CDC: Important Milestones, Your Child by Five Years', url: 'https://www.cdc.gov/act-early/milestones/5-years.html' },
    ],
    tags: ['chalk', 'hopping', 'path', 'Tokkudu Billa', 'Paandi', 'Stapu', 'hopscotch', 'Telugu numbers', 'Tamil numbers', 'balance', 'backyard', 'garden'],
    note: {
      what: 'Indian hopscotch on a short chalk grid. He tosses a bean bag into a box, goes up and back skipping that box, and picks the bean bag up on the way home.',
      expect:
        'He will probably walk the first rounds and start hopping on his own once the route feels easy. Picking up the bean bag while balanced on one foot is the hard part; a hand or a foot going down is fine.',
      practising:
        'Balance on one foot, and holding a short sequence in mind: which box to skip, where to turn, when to stop and pick up. Saying the numbers in order in two languages.',
      ask: 'When he redesigns the grid: “Which box will be the hardest one to land in?”',
      next: 'On a video call, hold the phone over the grid and ask Nanamma what she called the game as a girl; on the next, ask Paati. Their rules may differ, and he can try both.',
      honest:
        'Hopping well on this grid is a balance skill and says little about his maths. Some five-year-olds are not steady on one foot yet; that is normal, and stepping through is the same game.',
      easier: 'Walk the grid, two feet in every box, and leave the bean bag out until the route is easy.',
      harder: 'Toss from behind a line, hop the whole way on one foot, or play the regional version where a finished player claims a box as their house.',
      safety:
        'Draw on flat ground in the backyard or on a quiet path, away from the street, the driveway in use and parked cars. Shoes on, and sweep away grit. Use a bean bag, not a stone, while Mia is near.',
    },
  },
  {
    id: 'snakes-and-ladders-moksha-patam',
    group: 'rules',
    title: 'Snakes and Ladders, the Moksha Patam Way',
    hook: 'A 30-square board you draw: good deeds climb, bad ones slide.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Ten minutes to draw the board together',
    players: 'You and him, or more; Mia asleep or with another grown-up',
    need: [
      'a big sheet of paper (A4 or larger) and a pen (or a bought Snakes and Ladders board)',
      'one die (or six paper slips numbered 1 to 6, drawn from a cup)',
      'a counter each (a small toy, or a bottle top)',
    ],
    steps: [
      'Draw 30 squares in three rows of ten, winding back and forth like the real board, and number them together.',
      'Add three ladders and three snakes. Ask him for good deeds for the ladders (helping, sharing, telling the truth) and bad ones for the snakes (grabbing, lying).',
      'Roll and count on aloud from the square you are on, touching each square: on 12 with a 3, say “13, 14, 15”, not “1, 2, 3”.',
      'On a ladder, say its good deed and climb; on a snake, say its bad one and slide. First to 30 reaches moksha, and you play again.',
    ],
    hisWay:
      'He draws the next board: where the snakes and ladders go, how long they are and what each one stands for. He can add his own squares, such as “fly back to Paati’s house in Chennai” or “roll again”, and decide whether you need the exact number to finish.',
    mia: {
      way: 'apart',
      text: 'The die and counters are small enough for Mia to choke on, so play while she naps or is with another grown-up. It also gives him one game with you all to himself.',
    },
    picture:
      'At the low coffee table in the living room of the Bay Area house, Arjun kneels on the rug and slides a flat red bottle top, his counter, along a hand-drawn paper Snakes and Ladders board, touching the squares one by one with it as he counts aloud. The board is a short track of three rows of big squares, with a pencil-drawn ladder just ahead of his bottle top and a pencil-drawn wavy snake further along. Paati sits on the rug beside him, holding the only die in her open palm and watching his bottle top. The board has no numbers or writing on it.',
    cast: ['Arjun', 'Paati'],
    tradition:
      'Moksha Patam, or Gyan Chaupar (Paramapadam in Tamil, Vaikunthapali in Telugu): the Indian board game that became Snakes and Ladders, where ladders stood for virtues and snakes for vices on the way to moksha. The old boards had anything from 72 to 300 squares; on one, cell 24, kusangati (bad company), drops you to cell 8, mithya (falsehood). This version uses a short 30-square board and deeds in his own words.',
    sources: [
      { label: 'D’Source (IDC, IIT Bombay), Indian Games: Moksha Patam', url: 'https://www.dsource.in/resource/indian-games/board-games/moksha-patam' },
      {
        label: 'The Hindu: From board to phone, India’s ancient games are being reinvented as apps (Gyan Chaupar)',
        url: 'https://www.thehindu.com/society/from-board-to-phone-indias-ancient-games-are-being-reinvented-as-apps/article23528910.ece',
      },
      {
        label: 'Siegler and Ramani (2008), Developmental Science: Playing linear numerical board games promotes low-income children’s numerical development',
        url: 'https://doi.org/10.1111/j.1467-7687.2008.00714.x',
      },
    ],
    tags: ['board game', 'dice', 'counting', 'grandparents', 'Paati', 'Paramapadam', 'Vaikunthapali', 'rainy day', 'Indian games'],
    note: {
      what: 'A short Snakes and Ladders on a board you draw together, with good deeds at the feet of the ladders and bad ones at the heads of the snakes, as on the old Moksha Patam boards. Every move is counted aloud from the square you are on.',
      expect:
        'He will probably count the square he is standing on as “one” and land one short; touching each square sorts most of that out. A long snake near the top can bring tears in the first games. It is pure luck, and saying so plainly helps.',
      practising:
        'Counting on from a number instead of from one, and reading the numbers to 30 in order along a track. Also losing to bad luck when nobody is to blame.',
      ask: 'When he is a few squares below a ladder: “Which number would take you onto it?”',
      next: 'On real stairs, count on from the step he is standing on: “We are on 6. Three more: 7, 8, 9.” Ask Paati whether her family played Paramapadam late into the night of Vaikunta Ekadasi, to stay awake.',
      honest:
        'The research that found number gains (Siegler and Ramani, with preschoolers) used a straight 1-to-10 board, four 15-minute sessions, numbers named on every move; a winding board with snakes is not quite the same game. The deeds are labels: the die decides, not how good anyone is.',
      easier: 'Use 20 squares, and cover the 4, 5 and 6 on the die with tape marked 1, 2 and 3. Leave the snakes out at first.',
      harder: 'Play the bought 100-square board, or roll two dice and add them before you move. He can guess his landing square before he counts.',
      safety:
        'The die and counters are small enough to choke Mia. Play at the table while she is with another grown-up, and count the pieces back into the box.',
    },
  },
  {
    id: 'snap-then-crazy-eights',
    group: 'rules',
    title: 'Snap, Then Crazy Eights',
    hook: 'One pack of cards: a fast game for stopping, a slow one for switching.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You and him, or more',
    need: ['a pack of ordinary playing cards'],
    steps: [
      'Snap: split the pack between you, face down. Take turns turning your top card onto one middle pile.',
      'When two cards in a row match in number, the first to say “Snap!” with a flat hand on the pile takes it. A wrong Snap gives away one card.',
      'Crazy Eights: deal five each and turn one card up. On your turn, put down a card with the same number or the same suit, or pick one up.',
      'Say how you matched: “same number” or “same suit”. An 8 goes on anything, and its player names the next suit. First to empty their hand wins.',
      'After a few games, he deals, calls the rules and settles arguments. If you cannot agree, each turn over a card: the higher card decides.',
    ],
    hisWay:
      'He chooses the game and changes it: Snap on same colour instead of same number, or a new wild card, such as “a 2 means the other player picks up two”. Once he knows the rules, step back and let him run the game; ask him when you are unsure.',
    mia: {
      way: 'alongside',
      text: 'Give Mia a handful of cards from an old pack (or old greeting cards) to spread out, stack and post into an empty tissue box beside you. Hers stay out of the game, and she can “Snap” her own pile whenever she likes.',
    },
    picture:
      'On the living-room rug of the Bay Area house, Arjun slaps one flat open hand down on top of a single neat pile of face-up playing cards between them, with his mouth open mid-shout. Nanna sits cross-legged opposite, holding a fan of cards in one hand. He freezes with his other palm open just above the back of Arjun’s hand, and laughs. All the middle cards are in one small stack under Arjun’s hand.',
    cast: ['Arjun', 'Nanna'],
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds (card games)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      { label: 'DREME Family Math (Stanford): Line Them Up, a card game for number order', url: 'https://familymath.stanford.edu/activity/line-them-up/' },
    ],
    tags: ['cards', 'rainy day', 'travel', 'waiting', 'numbers', 'taking turns'],
    note: {
      what: 'Two games with one pack of cards. In Snap you both watch a pile and pounce on a pair; in Crazy Eights you match the card on top by its number or by its suit.',
      expect:
        'In Snap he will slap on nearly-matches (a 6 on a 9) and argue about who was first; agree before you start what happens on a tie. In Crazy Eights he will match by number and forget suits for a while, then discover that the 8 is the best card in the pack.',
      practising:
        'Snap: watching closely and holding back a reach until the pair is really there. Crazy Eights: switching between two ways of matching the same card. Harvard’s activity guide for ages 5 to 7 names both games for these skills.',
      ask: 'In Crazy Eights, when he is stuck: “Is there a card that matches the other way?”',
      next: 'In a queue or on a long drive, play Snap with things you can see: say “Snap” when two red cars go past in a row.',
      honest:
        'Being quick at Snap shows he is quick at Snap; it does not show he can wait his turn elsewhere. Crazy Eights is mostly luck at this age, and he will lose some games, which is part of the point. Expect a few sulks.',
      easier: 'Take out the picture cards. In Crazy Eights, play with your hand face up so he can see how you choose. Or start with DREME’s Line Them Up: take turns laying cards 1 to 10 in order.',
      harder: 'Play Crazy Eights with three players, or add his own rule card. In Snap, also call Snap on a pair of the same suit.',
      safety: 'Agree on flat hands on the pile, not slapping on each other’s fingers; an open palm is fast enough. Move hot drinks, such as coffee in a steel tumbler, off the rug before a round of Snap.',
    },
  },
  {
    id: 'raja-mantri-chor-sipahi',
    group: 'rules',
    title: 'Raja, Mantri, Chor, Sipahi — the Family Version',
    hook: 'Folded chits, one secret each. Can the Mantri spot the Chor?',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to draw the chits',
    players: 'Three or four',
    need: ['a sheet of paper torn into four small chits', 'a pencil', 'a bowl (or a cap)'],
    steps: [
      'Draw one picture on each chit: a scroll for the Mantri, a stick for the Sipahi, a bag for the Chor. With four players, add a crown for the Raja.',
      'Fold the chits, shake them in the bowl, and each take one. Look in secret and keep it in your fist.',
      'Everyone asks, “Who is the Mantri?” (with four, the Raja asks “Who is my Mantri?”). The Mantri says “Me!” and points at whoever he thinks is the Chor.',
      'Everyone opens their chit to see if the Mantri found the Chor. Right or wrong, talk about what gave the Chor away, or what fooled the Mantri.',
      'Fold the chits, shake them back into the bowl and pick again, so everyone has a new secret. Nobody counts points; play until he has had enough.',
    ],
    hisWay:
      'He draws the chits and can add characters, such as a Rani or a villager, and decide which one the guesser has to find. He can also switch to the way some families play, where the Sipahi does the guessing.',
    mia: {
      way: 'alongside',
      text: 'Mia gets her own bowl of big folded half-sheets of paper with scribbles on them to open, shut and share out to anyone she likes. Hers stay out of the real bowl.',
    },
    picture:
      'At the dining table of the Bay Area house, Arjun sits on a dining chair and points one finger across at Tatayya with narrowed, suspicious eyes, with his own opened paper chit lying on the table in front of him. Tatayya keeps a perfectly straight face, both hands pressing his folded chit flat against his chest. Nanamma, beside them, hides her chit inside one closed fist and watches. A pencil, a sheet of paper and an empty steel bowl sit on the table by Nanamma’s elbow.',
    cast: ['Arjun', 'Nanamma', 'Tatayya'],
    tradition:
      'Raja, Mantri, Chor, Sipahi (King, Minister, Thief, Soldier), a chit game played across India by four players. Traditionally it is scored: in D’Source’s version the chits are worth Raja 1000, Mantri 500, Sipahi 300 and Chor 0, a Mantri who guesses wrong hands his points to the Chor, and after several rounds the highest total wins. Wikipedia records other points and a version where the Sipahi guesses. This family version keeps D’Source’s guessing but leaves the points out altogether, and with three players it drops the Raja chit, so everyone asks the question together.',
    sources: [
      {
        label: 'D’Source (IDC, IIT Bombay), Indian Games: Raja, Mantri, Chor, Sipahi',
        url: 'https://www.dsource.in/resource/indian-games/indoor-games/raja-mantri-chor-sipahi',
      },
      { label: 'Wikipedia: Raja Mantri Chor Sipahi (rules and family variations)', url: 'https://en.wikipedia.org/wiki/Raja_Mantri_Chor_Sipahi' },
    ],
    tags: ['grandparents', 'Nanamma and Tatayya', 'paper', 'secrets', 'guessing', 'Indian games', 'rainy day'],
    note: {
      what: 'A guessing game with folded chits. Each player secretly becomes the Mantri, the Sipahi or the Chor (and the Raja, with four); the Mantri owns up and has to point out the Chor by watching faces.',
      expect:
        'When he is the Chor he will probably give himself away: a giggle, a hand over his mouth, or simply telling you. As Mantri he may point at random at first, then start studying faces. Guessing wrong while a grown-up grins at him can sting.',
      practising:
        'Keeping a secret and a straight face, and looking at faces for a clue. As the Sipahi, working out who the Chor must be once the Mantri has owned up.',
      ask: 'After a round where he guessed right as Mantri: “What gave the Chor away?”',
      next: 'Ask Nanamma and Tatayya what they called it as children (was it Raju, Mantri, Donga, Police?) and who did the guessing. Families differ, and he may like theirs better.',
      honest:
        'In the main game, with three or four players, the Mantri always chooses between only two people, so half of all guesses would be right by chance; it is not a test of how well he reads faces. D’Source places the game at 6 to 12, so expect to remind him who asks and who points for the first few rounds.',
      easier: 'Play one practice round with the chits open, so he sees who asks, who answers and who points, then fold them for real. Help him read his chit quietly if the picture is not clear to him.',
      harder: 'With four players, use a Rani chit instead of the Raja. The Rani stays hidden like the Chor and everyone asks the question together, so the Mantri chooses from three faces, not two. Or, when he is the Chor, he tries to keep a straight face while the Mantri stares at him for a slow count of ten.',
      safety: 'Paper and a pencil only. If Mia is near, keep the pencil out of her reach and the chits out of her mouth.',
    },
  },
  {
    id: 'pallanguzhi-in-an-egg-box',
    group: 'rules',
    title: 'Pallanguzhi in an Egg Box',
    hook: 'Sow seeds one by one round the cups; a cup of four is yours.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to count out the seeds',
    players: 'You and him; Mia asleep or with another grown-up',
    need: [
      'a 12-cup egg box (or two 6-cup boxes side by side, or a 12-cup bun tray)',
      '36 tamarind seeds (or large dried beans such as rajma)',
      'two small bowls, one for each player’s seeds',
      'a jar with a lid to keep the seeds in',
    ],
    exception: 'Tamarind seeds and cowrie shells are the traditional counters. If the block of tamarind kept for rasam has seeds in it, save them; otherwise rajma or other large dried beans do the same job.',
    steps: [
      'Set the box between you, long side facing each of you: your row of six is yours, his row is his. Count three seeds into every cup together.',
      'He scoops every seed from one of his cups and drops one into each following cup, anticlockwise, round onto your side when his row runs out.',
      'If the last seed makes a cup hold exactly four, he takes those four into his bowl. Then it is your turn.',
      'Before each scoop, point to where you think the last seed will land, then count to check.',
      'Stop when a row runs empty or he has had enough. Tip each row’s leftover seeds into its owner’s bowl, then count both bowls in tens: who has more?',
    ],
    hisWay:
      'He can change the capture number (three, or five), choose which way round to sow, or start with a different number of seeds in each cup. Once he knows the rules, let him explain them to you and settle any argument.',
    mia: {
      way: 'apart',
      text: 'Tamarind seeds and beans are just the size Mia could choke on, so this is a game for when she is asleep or out of the room with another grown-up. That makes it his own quiet game with you.',
    },
    picture:
      'At the low coffee table in the living room of the Bay Area house, Arjun drops a single brown tamarind seed into a cup of a cardboard egg box, his lips moving as he counts, while Paati, sitting on the rug across from him, holds a steel katori of captured seeds and leans in to watch where his last seed will land.',
    cast: ['Arjun', 'Paati'],
    tradition:
      'Pallanguzhi (also Pallankuzhi), a mancala game from Tamil Nadu and Kerala, played on a board of fourteen pits in two rows of seven with tamarind seeds, cowries or pebbles; it is called Alaguli Mane in Kannada and Vamana Guntalu in Telugu. This version uses twelve cups, three seeds in each, and a narrower form of one of D’Source’s capture rules: in D’Source any pit that reaches four as you sow is captured, while here only the cup where the last seed lands counts. In the real game a turn carries on from the next pit; here each turn ends after one sowing.',
    sources: [
      { label: 'D’Source (IDC, IIT Bombay), Indian Games: Pallankuzi', url: 'https://www.dsource.in/resource/indian-games/board-games/pallankuzi' },
      { label: 'Wikipedia: Pallanguzhi', url: 'https://en.wikipedia.org/wiki/Pallanguzhi' },
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds (mancala and board games)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
    ],
    tags: ['counting', 'seeds', 'grandparents', 'Paati', 'Vamana Guntalu', 'board game', 'Indian games', 'Tamil Nadu', 'mancala'],
    note: {
      what: 'A home-made Pallanguzhi. You each own a row of cups, sow seeds one by one round the box, and capture a cup when your last seed makes it exactly four.',
      expect:
        'He will drop two seeds in one cup, or skip one, when he hurries; slowing down and saying the count fixes most of it. At first he will choose cups at random. After a few games he may start counting ahead to find a cup that will end on four.',
      practising:
        'One seed for each cup, counted in order, and keeping track of where the count ends. Later, looking a few cups ahead before choosing, and comparing two heaps by counting them in tens.',
      ask: 'Before he scoops a big cup: “Where do you think your last seed will land?”',
      next: 'Ask Paati whether she played Pallanguzhi as a girl and how her board looked, then ask Nanamma whether she knows it as Vamana Guntalu. Amma can count the sowing in Tamil: “onnu, rendu, moonu” (one, two, three).',
      honest:
        'This is a simplified family version, not the full game, which has its own scoring, more seeds and longer chains of sowing. Most of his early wins will be luck; planning ahead comes slowly and may not show for many games.',
      easier: 'Use two seeds a cup and capture on three. Sow together, his hand in yours, saying the count aloud.',
      harder: 'Lay out two rows of seven katoris with six seeds in each (84 in all), as D’Source describes the real board. Or add D’Source’s other capture: a last seed that falls just before an empty cup captures the cup beyond it.',
      safety:
        'Seeds and beans are a choking hazard for the two-year-old. Play only when Mia is out of the room, count the seeds out of the lidded jar and back in afterwards, and check the floor before she comes back.',
    },
  },
  {
    id: 'simon-says-then-switch',
    group: 'rules',
    title: 'Simon Says, Then Switch the Rule',
    hook: 'Three rounds, three rules. Then he leads and tries to catch you.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You, him and Mia',
    need: [],
    steps: [
      'Plain Simon Says for a few minutes: move only when the order starts with “Simon says”. Anyone caught just says “Oops” and carries on; nobody is out.',
      'Round two, Do This, Do That: copy your move when you say “Do this”, stay still when you say “Do that”.',
      'Round three, Do As I Say, Not As I Do: say “touch your nose” while you touch your ear. He follows the words, not your hand.',
      'Swap. He is Simon, picks the rule for each round and tries to catch you out. Get caught now and then without making a show of it.',
    ],
    hisWay:
      'As leader he chooses the round and invents the orders, and he can make his own switch: “Nanna says” instead of “Simon says”, or a round where he says the opposite of what he means. He can also give the orders in Telugu when Nanna plays, or in Tamil when Amma plays.',
    mia: {
      way: 'joins',
      text: 'Mia joins in by copying every move, whether Simon says or not and whatever the round; nobody catches her, and he plays to the real rule.',
    },
    picture:
      'In the living room of the Bay Area house, Arjun stands with the tip of one finger touching the tip of his nose, his mouth clear and smiling, and his eyes fixed on Nanna. Nanna stands opposite, touching his own ear with one hand and holding the other hand open, palm up, as he calls out an order with a sly smile. Mia, beside Arjun, copies Nanna and holds her ears with both hands. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds (Simon Says and its variants)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      { label: 'CDC: Important Milestones, Your Child by Five Years (games such as Simon Says)', url: 'https://www.cdc.gov/act-early/milestones/5-years.html' },
    ],
    tags: ['no equipment', 'rainy day', 'waiting', 'self-control', 'Mia can join', 'leader'],
    note: {
      what: 'Simon Says in three rounds, each with a different rule: move only on “Simon says”, copy only on “Do this”, then follow your words and ignore your hands. Then he leads.',
      expect:
        'The plain round is usually the easy one. In the third round he will probably copy your hand more often than he follows your words; a hand is hard to ignore. As leader he will make his orders very fast and very silly, and may forget to say “Simon says” himself.',
      practising:
        'Holding back a move until the right signal, and changing which signal counts when the rule changes. Harvard’s activity guide for ages 5 to 7 lists Simon Says, Do This, Do That and Do As I Say as practice in attention, holding back and switching rules.',
      ask: 'After the third round, if he wants to talk about it: “Which was harder to ignore, my words or my hands?”',
      next: 'On the next walk, play a quiet version: he moves only when you say “Simon says”, and you take turns being Simon.',
      honest:
        'Doing well at Simon Says is practice at Simon Says. It does not mean he will now stop when you ask him to at the park. The catching is the fun; if he is caught a lot and starts to get upset, slow down or let him lead.',
      easier: 'Slow down, use big obvious moves, and stay on the first round. Say “Simon says” a little louder than the rest.',
      harder: 'Switch rounds without warning: “Now it’s Do As I Say!” Or he leads two people at once, you and a cuddly toy he moves himself.',
      safety:
        'Clear the floor of toys and keep orders to things done on the spot: no jumping off furniture, no fast spinning, no running in the house. Keep everyone an arm’s length apart so Mia does not get knocked.',
    },
  },
  {
    id: 'guess-my-rule',
    group: 'rules',
    title: 'Guess My Sorting Rule',
    hook: 'Two bowls, a pile of odds and ends, and a rule only you know.',
    where: 'indoors',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to gather a pile',
    players: 'You and him',
    need: [
      'about 15 mixed household things, none small enough to fit inside a toilet-roll tube: steel spoons, socks, a wooden block, a big toy car, a large jar lid, a metal or plastic bangle, a plastic cup',
      'two bowls (or two cushions to make two piles)',
    ],
    steps: [
      'Secretly pick a rule, such as “things made of metal” or “things longer than my hand”. Put one thing in the Yes bowl and one in the No bowl.',
      'He picks something from the pile and says which bowl he thinks it belongs in. You say yes or no, and it goes in the right bowl.',
      'When he thinks he knows, he says the rule. If it is not quite right, carry on until he finds it.',
      'Swap: he makes a secret rule and you guess. Say your guesses out loud, wrong ones too.',
      'Then the switch: tip both bowls back and sort the same pile a new way. Same things, new rule.',
    ],
    hisWay:
      'He makes the rules, and his are often the best ones: “things Mia has put in her mouth”, “things that live in the kitchen”, “things Nanna uses”. Let his rule stand even when it is one only he could know, and ask him to tell you at the end.',
    mia: {
      way: 'alongside',
      text: 'Give Mia her own basket of big, safe things (a spoon, a sock, a plastic cup) to take out and put back in beside you. She may hand him things for his pile; he decides whether they go in.',
    },
    picture:
      'At the kitchen table of the Bay Area house, Arjun holds a steel spoon in the air between two clear plastic bowls. In the left bowl lie only a round metal jar lid and one bangle. In the right bowl lie only a rolled-up striped sock and a small wooden block. There is no food anywhere on the table. Arjun looks up at Amma, who sits across from him with one hand over her mouth, keeping her secret rule.',
    cast: ['Arjun', 'Amma'],
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds (Guess My Rule)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 3- to 5-Year-Olds (sort by one rule, then switch)',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-3-to-5-year-olds.pdf',
      },
    ],
    tags: ['sorting', 'rainy day', 'kitchen', 'guessing', 'household things', 'tidying'],
    note: {
      what: 'You sort a pile of household things into two bowls by a secret rule; he works out the rule by testing one thing at a time. Then he makes a rule for you, and you both sort the same pile a new way.',
      expect:
        'His first guesses will be about the last thing that went in (“things that are spoons”). He may stick with a theory after it has been proved wrong. His own rules will often change halfway through, or be things only he knows; that is normal.',
      practising:
        'Testing an idea against what he sees and dropping it when it fails. Seeing that the same things can be sorted more than one way.',
      ask: 'When he is stuck: “What is the same about everything in the Yes bowl?”',
      next: 'At tidy-up time, sort the toys by a rule he chooses (things with wheels, soft things, things that are Mia’s), then put them away by that rule.',
      honest:
        'Guessing the rule once or twice does not show he can reason like a scientist; a lot of it will be luck and reading your face. If he feels stuck, the game stops being play, so give a clue early.',
      easier: 'Use rules he can see at once, like colour or “spoons and not spoons”. Start with only six things.',
      harder: 'Use rules with two parts, such as “metal and longer than my hand”, or a rule about what things are for. Change the rule halfway through, and tell him only that it changed.',
      safety: 'If Mia is near, keep coins, buttons, marbles and batteries out of the pile; anything that fits through a toilet-roll tube stays out.',
    },
  },
];
