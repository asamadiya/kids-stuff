import type { Activity } from '../types';

/**
 * Count, Share and Measure, part two: seeing small numbers at a glance, fair
 * halves of a dosa, guessing from a known jar, and the calendar as a number line.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'quick-look-how-many',
    area: 'numbers',
    title: 'Quick Look: How Many?',
    hook: 'Lift the bowl, cover it again. How many did you see?',
    where: 'table',
    places: ['kitchen'],
    minutes: 15,
    need: [
      'five lemons, from the backyard tree or the shop, or five small oranges',
      'a cloth bag on the grown-up’s lap, to keep the lemons not in use out of sight',
      'a large steel mixing bowl that covers all five at once when turned upside down',
      'a big round steel plate or a tray to play on',
    ],
    steps: [
      {
        text: 'The grown-up secretly puts three lemons on the plate and covers them with the upturned bowl.',
        art: 'At the dining table, Nanna lowers a large upturned steel mixing bowl with both hands over three lemons sitting on a big round steel plate, while Arjun, across the table, covers his eyes with both hands and turns his face away so he cannot see.',
      },
      {
        text: 'Lift the bowl for a second or two, then cover again. How many did you see?',
        art: 'Nanna lifts the upturned steel bowl a hand’s height off the steel plate with one hand, showing three yellow lemons in a triangle for a moment, while Arjun leans forward on his elbows with his eyes fixed on the lemons.',
      },
      {
        text: 'Eyes shut. The grown-up hides four or five: three in a row, the rest below. Flash. How many? How did you see?',
        art: 'Nanna holds the steel bowl raised in one hand above five lemons on the steel plate, three in a row with two beneath them, while Arjun leans over the table pointing with one finger at the row of three, the other hand flat on the tabletop.',
      },
      {
        text: 'Eyes shut again. Five in a jumble, then five like the dots on a dice. Flash each. Which was quicker to see?',
        art: 'Nanna lifts the upturned steel bowl off a big round steel plate with both hands to show the lemons scattered untidily on it, not in rows: two lemons touching near the left rim, one lemon on its own in the middle, and two lemons touching near the right rim, one of them turned sideways; five lemons in all. Arjun leans in close with one pointing finger out, jabbing from lemon to lemon as he tries to count them before the bowl comes down, his other hand on the table edge.',
      },
      {
        text: 'Swap jobs: the grown-up shuts their eyes while you hide some lemons. Then you flash them.',
        art: 'Arjun lifts the upturned steel bowl off the steel plate with both hands, showing four lemons in a square, and watches Nanna’s face, while Nanna sits across the table with his hands flat on the tabletop, about to say how many.',
      },
      {
        text: 'Five lemons in all. Eyes shut while the grown-up hides some under the bowl and leaves two out. How many are hiding?',
        art: 'Arjun rests one hand on top of the upturned steel bowl on the steel plate, thinking, with two lemons sitting outside the bowl beside it, while Nanna holds his fingertips under the bowl’s rim, ready to lift it and check.',
      },
    ],
    notice: 'Two or three you can see at once, without counting. Four and five are easier to see as two small groups: two and two, or three and two.',
    ask: 'You did not have time to count. How did you know it was five?',
    pairsWith: 'how-many-do-you-see',
    trial: 'Lift and cover the bowl over five lemons a few times on your own and time the flash: a second or two, about as long as saying “one-and-two”, is long enough to see them and too short for him to count five one by one. Keep the lemons you are not using in the bag on your lap: if he can see that one is left over, he can work out four without looking. Check that the bowl covers all five in a dice pattern without pressing on any, and that the lemons do not roll off the plate.',
    sources: [
      { label: 'NRICH (University of Cambridge) Early Years: Hidden Jewels', url: 'https://nrich.maths.org/eyfs-activities/hidden-jewels' },
      { label: 'NRICH (University of Cambridge): Subitising, an article by Sue Gifford', url: 'https://nrich.maths.org/articles/subitising' },
      { label: 'Learning Trajectories (Clements and Sarama): Conceptual Subitizer to 5', url: 'https://www.learningtrajectories.org/math/subitizing/conceptual-subitizer-to-5' },
    ],
    tags: ['rainy day', 'no mess', 'quick', 'counting', 'seeing numbers', 'subitising', 'dice patterns'],
    note: {
      what: 'You hide up to five lemons under a big upturned bowl, lift it for a second or two and cover them again, and he says how many he saw and how he saw them. Then he hides them for you, and works out how many are under the bowl when some are left outside.',
      expect: 'Two and three he will usually see at once; at four and five he may try to count, run out of time and guess. A jumble of five is usually harder to see than three-and-two or the dice pattern, which is why the shapes change. In the last step he may want to lift the bowl and count, so let him check only after he has said a number.',
      practising: 'Subitising: seeing how many in a small group without counting one by one; at this age usually up to about four, and five in a familiar pattern such as the dots on a dice. Then seeing a larger number as smaller groups put together, such as five as three and two, which is the start of part-whole thinking. The last step asks for the missing part of five.',
      ask: 'After a flash of five: “How did you see them?” Take whatever he says, such as “three and two” or “a square and one in the middle”, and do not correct it.',
      next: 'At breakfast, ask how many idlis are on his plate before he has time to count them; Nanna can ask it in Telugu, “Enni?” (how many?), and an answer in English counts just the same. Look for the dot patterns on dice and dominoes, and play How Many Do You See? together.',
      honest: 'A right answer after a flash may be a lucky guess or a very quick count; asking how he saw them is how you tell. Seeing five as three and two here does not mean he knows that three and two make five everywhere. That takes many small games over months, not one afternoon.',
      easier: 'Use only one, two and three lemons, first in a row and then in a triangle.',
      harder: 'With the two-year-old asleep or in another room, use ten large buttons on a tray and flash up to eight as two groups, such as five and three. Count the buttons back into a lidded tin at the end.',
      safety: 'Lemons are too big for the two-year-old to put in her mouth whole; if she wants to join, give her one of her own to hold and watch that she does not bite it. Keep the bowl and plate in the middle of the table so nothing slides off onto feet. Use buttons or beans only when she is out of the room, counted out and back in.',
    },
  },
  {
    id: 'is-it-really-half',
    area: 'numbers',
    title: 'Is It Really Half?',
    hook: 'Two pieces of dosa. Are they halves, or just two pieces?',
    where: 'table',
    places: ['kitchen'],
    minutes: 20,
    need: [
      'two paper circles, traced round a side plate onto printer paper and cut out',
      'two soft dosas made that morning, cooked thick rather than crisp, cooled under a cloth',
      'kitchen scissors, for the grown-up only',
      'a big steel plate and four small steel plates, one for each of the family',
      'clean hands',
    ],
    steps: [
      {
        text: 'Fold a paper circle so the edges meet all the way round. Open it. Are those halves?',
        art: 'At the dining table, Arjun presses down on a white paper circle folded in half into a half-moon shape, its two curved edges lying exactly on top of each other, running both thumbs along the straight folded edge. Amma, sitting beside him, holds a second white paper circle, whole, round and unfolded with no lines on it, flat in both hands, watching his half-moon.',
      },
      {
        text: 'The grown-up folds the other circle off the middle, cuts it, and keeps the big piece. Fair?',
        art: 'Amma holds up the larger of two unequal pieces of a cut paper circle as if it is hers, the closed kitchen scissors by her elbow, out of his reach, while Arjun holds the much smaller piece in one hand and points at Amma’s piece with the other.',
      },
      {
        text: 'Lay one piece on top of the other. Does it cover it exactly, or does some stick out?',
        art: 'Arjun lays the small paper piece on top of the big one on the dining table and runs his finger along the strip of the big piece that sticks out beyond it, while Amma leans in on her elbows to look.',
      },
      {
        text: 'Fold a dosa in half, edge to edge. The grown-up cuts along the fold with kitchen scissors.',
        art: 'Amma snips along the fold of a cooled soft dosa with kitchen scissors, holding the dosa up above a big steel plate, while Arjun, who folded it, watches with both hands resting on the table edge, well clear of the blades.',
      },
      {
        text: 'Stack the two halves, fold them in half again, and the grown-up cuts once. How many pieces now?',
        art: 'Arjun folds two stacked dosa halves in half again on the big steel plate, pressing the curved edges together with his fingertips, while Amma waits with the closed kitchen scissors held low in her far hand, away from his fingers.',
      },
      {
        text: 'Share the quarters on four plates. Fold the second dosa in half: which is bigger, a half or a quarter?',
        art: 'Arjun lays one dosa quarter on top of a second dosa folded in half on the big steel plate, the quarter covering only part of the half, while Amma holds out an empty small steel plate for his quarter, three more small plates each holding a quarter in a row beside the big one.',
      },
    ],
    notice: 'Two pieces are halves only when they are the same size: one laid on the other covers it exactly. A quarter is smaller than a half, even though four is more than two.',
    ask: 'Two pieces of one dosa. How can you tell whether they are halves?',
    pairsWith: 'share-the-dosa',
    trial: 'Fold and cut one dosa yourself first. A crisp dosa cracks along the fold instead of bending, so make these soft and a little thick, the morning you play, and keep them covered as they cool. Check that your paper circles fold edge to edge; a circle cut out unevenly will not, and that will confuse the first step.',
    sources: [
      { label: 'NRICH (University of Cambridge) Early Years: Two Halves', url: 'https://nrich.maths.org/eyfs-activities/two-halves' },
      { label: 'Learning Trajectories (Clements and Sarama): Shape Equipartitioner', url: 'https://www.learningtrajectories.org/math/fractions/shapeequipartitioner' },
      { label: 'Erikson Institute Early Math Collaborative: Big Ideas of Operations (a whole splits into equal or unequal parts)', url: 'https://www.erikson.edu/early-math-collaborative/big-ideas/operations/' },
    ],
    tags: ['fractions', 'halves', 'quarters', 'fair shares', 'sharing', 'dosa', 'breakfast', 'food'],
    note: {
      what: 'He folds paper circles in half and checks your unfair “half” by laying one piece on the other. Then he folds a cooled soft dosa, you cut it into halves and then quarters with kitchen scissors, and the four of you share the quarters.',
      expect: 'To many five-year-olds, half means one of two pieces, so he may at first accept your big piece as a half. Laying one on the other usually settles it. He may also say a quarter is bigger than a half because four is more than two; let him lay a quarter on a half and look.',
      practising: 'Fractions as equal parts of one whole: a half is one of two equal parts, and two pieces are not halves unless they are the same size. Laying one piece on top of another is one way to check. The more equal parts a whole is cut into, the smaller each part.',
      ask: 'When you hold up your big piece of paper: “I kept one half and gave you the other half. Is that fair?”',
      next: 'At breakfast, ask him to share the last dosa fairly between himself and Mia and to show you how he knows it is fair. Then play Share the Dosa together.',
      honest: 'A dosa is never a perfect circle, so these halves are only nearly equal, and that is fine. Folding and matching with you does not show he understands fractions; the harder test is two halves that look different, such as a square cut corner to corner and a square cut straight across, which are still the same size.',
      easier: 'Use only the paper circles, and only halves: one fair fold, one unfair cut.',
      harder: 'You cut two same-size paper squares. Fold one corner to corner and the other edge to edge, and cut along the folds. Is a triangle half the same size as a rectangle half? To check, stand the triangle on one short edge and cut straight across halfway up: turn the small top piece round and it fills the gap, making the rectangle.',
      safety: 'Only the grown-up handles the kitchen scissors, and washes them after the paper and before the dosa; keep his fingers away from the blades and put the scissors out of reach the moment you finish. Use dosas that have fully cooled, and keep the dosa pan and the stove out of it. Wash hands before handling food. Tear the two-year-old’s quarter into small pieces before it reaches her.',
    },
  },
  {
    id: 'how-many-in-the-jar',
    area: 'numbers',
    title: 'How Many in the Jar? Guess, Then Count',
    hook: 'One jar holds exactly 20. How many in the other?',
    where: 'table',
    places: ['kitchen'],
    minutes: 25,
    need: [
      'two clear plastic jars the same size, tall and narrow, about 4 cm across and 150 ml, such as empty plastic spice jars',
      'a bag of large dried white chickpeas, the kind soaked for sundal; you will use about 100',
      'a tray or a big steel plate for counting on',
      'a notepad and a pencil',
      'a tin with a lid to pour the chickpeas back into',
    ],
    steps: [
      {
        text: 'Count exactly 20 chickpeas into one jar together. Look how high they come.',
        art: 'At the kitchen table, Arjun drops dried chickpeas one at a time into a clear plastic jar, counting under his breath, while Amma holds the open bag of chickpeas in one hand and, with a finger of the other, slides the next chickpea towards him from a small heap on a steel tray.',
      },
      {
        text: 'The grown-up tips a big handful into the other jar without counting, so nobody knows how many.',
        art: 'Amma pours a big handful of dried chickpeas from her cupped hand into a second clear plastic jar, while Arjun sits with both hands round the first jar, which holds a short column of the counted chickpeas, watching the second one fill.',
      },
      {
        text: 'Hold the jars side by side. How many twenties tall is it? Each of you says a guess.',
        art: 'Arjun holds the two clear plastic jars of chickpeas side by side at eye level, one in each hand, comparing the short column of chickpeas in one with the much taller column in the other, while Amma writes two pencilled guesses on a notepad.',
      },
      {
        text: 'Pour out about half onto the tray and count it. Do you want to change your guess?',
        art: 'Arjun tips about half of the second jar of chickpeas onto a steel tray and pushes them aside with one finger as he counts them, while Amma holds the notepad and pencil, ready to write a new guess.',
      },
      {
        text: 'Pour out the rest. Count everything into heaps of ten. Count the heaps: ten, twenty, thirty. Add the loose ones.',
        art: 'Arjun touches the small heaps of dried chickpeas lined up in neat rows on a rectangular steel tray, one heap at a time with the pointing finger of one hand, counting in tens, while his other hand pushes a few loose chickpeas to one side. Amma, sitting beside him, holds a small notepad closed against her chest in one hand, showing only its plain brown cardboard cover, and a pencil in the other hand, watching the heaps, ready to compare. Nothing is written anywhere in the picture.',
      },
      {
        text: 'Whose guess was closer? Then pour every chickpea back into the tin and put the lid on.',
        art: 'Arjun sweeps the heaps of chickpeas from the steel tray into a round steel tin with the side of his hand, while Amma holds the tin steady at the tray’s edge with one hand and holds its lid in the other.',
      },
    ],
    notice: 'The jar of 20 helps a wild guess become a sensible one: about twice as high is about forty. Counting half helps you guess closer still.',
    ask: 'How did the jar of 20 help you guess?',
    pairsWith: 'about-how-many',
    trial: 'Count 20 chickpeas into one of your jars first: they should make a clear layer at least 1 cm deep. If they only scatter across the bottom of a wide jar, the comparison is useless, so find one about 4 cm across. Then check that a handful of 40 to 80 fits in the other with room to spare.',
    sources: [
      { label: 'Erikson Institute Early Math Collaborative: Explore Estimation (the reference jar and revising after a partial count)', url: 'https://www.erikson.edu/early-math-collaborative/idea/a-whopper-of-a-tale-elementary-preschool-activity-books/' },
      { label: 'NRICH (University of Cambridge) Early Years: Estimation Station', url: 'https://nrich.maths.org/eyfs-activities/estimation-station' },
    ],
    tags: ['estimation', 'guessing', 'counting in tens', 'big numbers', 'rainy day', 'kitchen', 'chickpeas'],
    note: {
      what: 'He counts exactly 20 dried chickpeas into one clear jar, then guesses how many are in an identical jar you have filled without counting. He counts about half and may change his guess, then counts them all in heaps of ten.',
      expect: 'His first guess may be wild (“a hundred thousand”) or simply a number he likes. Holding the two jars side by side and asking how many twenties tall the full one is usually brings it closer. Chickpeas pack unevenly, so the heights only roughly match the counts. Changing his guess after counting half is the point, not cheating.',
      practising: 'Estimation: judging an unknown amount from a known one (a benchmark of 20) and improving the estimate with new information. Also counting a large collection by grouping it in tens and counting on the loose ones.',
      ask: 'Before he counts anything: “The jar of 20 comes up to here. How many of those would it take to reach the top of yours?”',
      next: 'Guess how many leaves are on one stalk of the curry-leaf plant on the patio, or how many grapes are in a bunch, and then check. Then play About How Many? together.',
      honest: 'A close guess on one jar can be luck, and a far one is not a failure. The skill shows when he reaches for the jar of 20 by himself and can say why his number makes sense. Counting in heaps of ten with your help does not yet mean he knows that six tens and three ones make 63.',
      easier: 'Use lemons or medium potatoes in two same-size steel bowls: exactly 5 in one, about 15 in the other. The two-year-old can watch this version.',
      harder: 'Fill a wider plastic jar to the same height as the jar of 20. Ask whether the same height still means about the same number, then count to find out.',
      safety: 'Dried chickpeas are a choking hazard for the two-year-old and small enough to push into a nose or an ear: do this while she sleeps or is in another room with another adult. Use plastic jars, not glass. Dried chickpeas are not for eating raw; none in mouths. At the end, pour every chickpea back into the lidded tin and check the floor and the chairs.',
    },
  },
  {
    id: 'how-many-sleeps',
    area: 'numbers',
    title: 'How Many Sleeps Until the Big Day?',
    hook: 'Ring today, draw the big day, and hop the squares between.',
    where: 'kitchen',
    places: ['table'],
    minutes: 15,
    span: 'A minute each morning',
    need: [
      'a paper wall calendar showing this month and next, or a month grid ruled on a large sheet of paper',
      'a chunky crayon',
      'masking tape, to hang the calendar at his eye level on the fridge or a wall',
      'a big day to count to: Deepavali, a birthday, the day Nanamma and Tatayya land',
    ],
    steps: [
      {
        text: 'Hang the calendar where you can reach it. Find today together and draw a ring round it.',
        art: 'In the kitchen, Arjun draws a crayon ring round one square of a paper calendar taped low on the side of the fridge, while Nanna crouches beside him, one finger on the top of the same column to show which day it is.',
      },
      {
        text: 'Find the big day. Draw a small picture in its square: a lamp for Deepavali, a plane for Nanamma and Tatayya.',
        art: 'Arjun draws a small clay lamp in yellow crayon inside a square further along the fridge calendar, while Nanna holds the calendar page flat against the fridge with one hand and points to the ringed square with the other.',
      },
      {
        text: 'Put a finger on today. Hop one square for each sleep, counting, until you land on the big day.',
        art: 'Arjun hops his pointing finger from square to square along a row of the fridge calendar, from the crayon ring towards the lamp drawing, counting aloud, while Nanna holds up his own fingers one by one to keep the count with him.',
      },
      {
        text: 'At the end of a row, the next day is at the start of the row below. Keep hopping.',
        art: 'Arjun’s pointing finger has reached the last square at the end of a row on the fridge calendar, and Nanna guides his hand down and back to the first square of the row below, both of them watching the finger.',
      },
      {
        text: 'Each morning, cross out yesterday with a big X. Count the sleeps again: one fewer.',
        art: 'In the morning, Arjun, still in pyjamas, draws a big crayon cross through the ringed square on the fridge calendar, while Nanna holds Arjun’s school bag in one hand and points to the next square with the other.',
      },
      {
        text: 'Say the days along the top in order. What day is the big day? What month?',
        art: 'Arjun, both feet on the kitchen floor, runs one pointing finger along the top band of a paper calendar taped low on the fridge door. The top band is a row of seven small plain coloured blocks, one for each day of the week, above a grid of plain blank squares; one square has a crayon ring round it, and a square further along has a small yellow crayon clay lamp in it. Nanna, standing beside him, lifts the bottom corner of the page with one hand to show a second page of plain blank squares underneath. The calendar has no letters and no numbers anywhere, only coloured blocks, empty squares, the ring and the lamp.',
      },
    ],
    notice: 'Every morning the number of sleeps goes down by one. The days come in the same order every week, and after the last one the first comes round again.',
    ask: 'Tomorrow morning, how many sleeps will it be?',
    pairsWith: 'where-does-that-number-go',
    trial: 'Count the sleeps yourself first by hopping square to square, so you know the answer and can spot a count that is one too many. Check whether your calendar’s weeks start on Sunday or Monday, and say the days in that order. If the big day is next month, put next month’s page or a hand-ruled grid beside this one so the hops can carry on. Hang it low enough that he never needs a chair to reach it.',
    sources: [
      { label: 'NRICH (University of Cambridge) Early Years: Calendar Muddle', url: 'https://nrich.maths.org/eyfs-activities/calendar-muddle' },
      { label: 'Wikipedia: Hindu calendar (lunisolar; used to set festival dates)', url: 'https://en.wikipedia.org/wiki/Hindu_calendar' },
    ],
    tags: ['Deepavali', 'Diwali', 'birthday', 'calendar', 'countdown', 'days of the week', 'months', 'time', 'grandparents visiting', 'no mess'],
    note: {
      what: 'He finds today and a big day on a paper calendar and counts the sleeps between them as hops from square to square. Each morning he crosses out the day just gone and counts again.',
      expect: 'A common slip is counting today’s square as well, which gives one too many; counting hops, not squares, fixes it. He may expect the count to run straight on and be puzzled when it jumps to the row below; that wrap is the hard part. He will forget some mornings; cross out the missed days together and count on.',
      practising: 'Time as an ordered sequence: the days of the week repeat in the same order, and the months follow one another. The calendar is a number line cut into rows of seven, and one fewer sleep each morning is counting back by one.',
      ask: 'On a morning when only a few sleeps are left: “Yesterday it was four sleeps. How many is it today?” Let him answer before he counts.',
      next: 'Say the days of the week at breakfast, and on Saturday ask what tomorrow is called. Look at next year’s calendar: Deepavali is set by the Hindu calendar, which follows the moon as well as the sun, so its date on a paper calendar moves from year to year, while Sankranti follows the sun and stays on 14 or 15 January. If the big day is the day Nanamma and Tatayya land, he can tell them on the next video call how many sleeps are left. Then play Where Does That Number Go? together.',
      honest: 'Counting sleeps on a calendar does not give him a feel for how long a week or a month is; two weeks can still seem endless. Saying the days in order is not the same as knowing what comes after Thursday without starting from Sunday; ask that to find out.',
      easier: 'Choose a big day no more than a week away, and draw seven squares in a row on a strip of paper instead of using the calendar.',
      harder: 'Each hop straight down a column is seven sleeps, a whole week. Hop down from today as far as you can without passing the big day, then hop along the rest. How many weeks, and how many days more? Or draw a second big day in the next month and count the sleeps between the two.',
      safety: 'Hang the calendar at his eye level so he never climbs a chair or stool to reach it. Felt-pen caps are a choking hazard for the two-year-old, so use a chunky crayon and put it away afterwards; she can draw her own cross with your hand round hers.',
    },
  },
];
