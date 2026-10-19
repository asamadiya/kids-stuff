import type { GrownUpNote } from '../notes/types';

/**
 * Make & Do: things a grown-up and the child do together off the screen, in
 * the kitchen, at the table, in the garden or outdoors. The screen is only the
 * card: what you need, four to six picture steps, what to notice and one
 * question. These replace the Workshop instruments, which nobody could start.
 *
 * Step text is addressed to the pair doing it. The pictures show Arjun from
 * the family cast sheet with Mummy or Papa, never a character called Rikki.
 * Each `art` string leads with the action, because an edit-from-reference
 * prompt that does not copies the sheet's standing poses; it is also the
 * picture's alt text, so it shows exactly what the step says.
 *
 * Safety follows the advisor's charter, section 3: large materials, small parts
 * kept from the two-year-old, low drops, water supervised throughout, and no
 * loose powerful magnets, button batteries, flames, hot water or mains power.
 * Food is vegetarian; eggs are fine.
 */
export interface Activity {
  readonly id: string;
  readonly title: string;
  readonly hook: string;
  readonly where: 'kitchen' | 'garden' | 'outdoors' | 'table';
  readonly minutes: number;
  readonly need: readonly string[];
  readonly steps: readonly { readonly text: string; readonly art: string }[];
  readonly notice: string;
  readonly ask: string;
  readonly pairsWith?: string;
  readonly note: GrownUpNote;
}

export const ACTIVITIES: readonly Activity[] = [
  {
    id: 'how-many-pennies-sink-a-boat',
    title: 'How Many Pennies Sink a Paper Boat?',
    hook: 'Same paper, two shapes, a pile of pennies.',
    where: 'garden',
    minutes: 25,
    need: [
      'two half-sheets of printer paper, the same size',
      'a washing-up tub, half full of water',
      'a jar of pennies (about 100), or other coins all of one kind',
      'an old towel',
      'a pencil and a notepad',
    ],
    steps: [
      {
        text: 'The grown-up folds a pointed paper boat. You fold the other sheet into a flat tray.',
        art: 'At the patio table, Mummy presses the last crease of a pointed paper boat with her thumbs, while Arjun folds up the four edges of a second sheet of the same size and pinches the corners into a flat paper tray.',
      },
      {
        text: 'Float the boat in the tub. Put in pennies one at a time.',
        art: 'Arjun kneels beside a washing-up tub of water on the patio and lowers one copper penny into the floating paper boat, a few more pennies in his other palm, while Mummy kneels across the tub watching the boat sit lower.',
      },
      {
        text: 'Count each penny out loud. Stop when water comes over the side.',
        art: 'Water trickles over one side of the paper boat, which sits very low with a heap of pennies inside, while Arjun counts on his fingers and Mummy writes the number on a notepad.',
      },
      {
        text: 'Guess first: will the flat tray carry more pennies, or fewer?',
        art: 'Arjun holds the dry flat paper tray up in one hand and taps his chin with the other, thinking, while Mummy lifts the soggy paper boat dripping out of the tub and waits for his guess.',
      },
      {
        text: 'Float the tray and load it the same way, spreading the pennies out.',
        art: 'Arjun lays pennies one by one in neat rows across the bottom of the flat paper tray floating in the tub, while Mummy steadies the tub with both hands; the tray sits low and level, its rim still above the water.',
      },
    ],
    notice: 'Each penny pushes the boat a little lower, and the wide flat tray sinks much more slowly than the pointed boat.',
    ask: 'It was the same paper. Why did the flat tray carry more pennies?',
    pairsWith: 'will-this-clay-boat-float',
    note: {
      what: 'He folds the same size of paper into a flat tray while you fold a pointed boat. Each floats in a tub and is loaded one penny at a time until water comes over the edge.',
      expect: 'He will probably back the pointed boat because it looks like a real boat. The flat tray usually carries several times as many pennies; if the jar runs out first, that is an answer too. Paper soaks through within a few minutes, so load steadily and use fresh paper for any repeat.',
      practising: 'Buoyancy: a floating thing settles until it has pushed aside water as heavy as itself and its load, and a wider hull pushes aside more water before its rim reaches the surface. Also counting a growing collection one by one and recording the total.',
      ask: 'Before the first penny goes into the tray: “The boat held this many. Will the tray hold more, fewer or the same?” Write his guess where he can see it.',
      next: 'Repeat with two equal squares of kitchen foil, which do not go soggy, one shaped narrow and one wide. Then read Will This Clay Boat Float? together.',
      honest: 'One run of each boat is not a fair test: soggy paper, pennies piled at one end or a looser fold can change the count a lot. The tray winning shows that shape matters; it does not show that he understands displaced water.',
      easier: 'Put exactly ten pennies in each and compare how low each one sits in the water.',
      harder: 'Pile every penny at one end of a fresh tray, compare the count with the spread-out load, and ask him why it changed.',
      safety: 'Stay beside the tub the whole time and empty it as soon as you finish; a toddler can drown in a few centimetres of water. Pennies are a choking hazard for the two-year-old, so count them back into a closed jar.',
    },
  },
  {
    id: 'what-time-is-it-stick',
    title: 'What Time Is It, Stick?',
    hook: 'Chalk the shadow every hour and watch it turn.',
    where: 'outdoors',
    minutes: 30,
    need: [
      'a straight stick about as long as a ruler, with a blunt top',
      'a lump of modelling clay as big as an orange',
      'thick chalk',
      'a sunny balcony or patio floor that gets sun all day',
      'a clock or watch',
    ],
    steps: [
      {
        text: 'Push the stick upright into the lump of clay, in a sunny spot.',
        art: 'Arjun pushes a straight wooden stick, about as long as a ruler, upright into a lump of grey modelling clay that Papa holds pressed onto the sunny stone paving of the back patio; the stick throws a long thin shadow across the stone.',
      },
      {
        text: 'Draw a chalk circle round the clay, so the stick can go back exactly.',
        art: 'Arjun crouches and draws a white chalk circle around the lump of clay at the foot of the upright stick, while Papa kneels beside him and points to where the circle still needs to join up.',
      },
      {
        text: 'At 9 o’clock, draw a chalk line along the shadow. Write 9 at its tip.',
        art: 'Arjun kneels and draws a chalk line along the stick’s long morning shadow on the patio paving, while Papa crouches beside him holding up a wristwatch that shows nine o’clock; a chalk 9 is written at the shadow’s tip.',
      },
      {
        text: 'Every hour, draw the new shadow and write the hour beside it.',
        art: 'Arjun, wearing a sun hat, chalks a much shorter shadow line near the stick, with older chalk lines marked 9, 10 and 11 fanning out beside it, while Papa stands holding the watch and reads out the hour.',
      },
      {
        text: 'After the last mark, look: which line is shortest? Which way did they turn?',
        art: 'Arjun stands over a fan of chalk shadow lines around the stick, each labelled with an hour from 9 to 4, tracing the curve of their tips with his pointing finger, while Papa crouches beside him and touches the shortest line.',
      },
      {
        text: 'Tomorrow at 9, put the stick back. Does its shadow land on the 9?',
        art: 'The next morning Arjun sets the clay and stick back inside the chalk circle while Papa, holding the watch, points at the stick’s shadow, which lies along yesterday’s chalk line marked 9.',
      },
    ],
    notice: 'The shadow is long in the morning, shortest around the middle of the day, and long again in the afternoon, pointing the other way.',
    ask: 'The shadow moved, but the stick did not. What moved?',
    pairsWith: 'a-tiny-dinosaur-a-huge-shadow',
    note: {
      what: 'He stands a stick upright on a sunny balcony or patio and, once an hour through the day, draws its shadow in chalk and writes the hour at the tip.',
      expect: 'He may expect the shadow to stay put, or to grow all day. It is long in the morning, shortest around the middle of the day and long again in the afternoon, and its tip swings round the stick the same way clock hands turn. While the clocks are on daylight saving time, the shortest shadow comes nearer 1 pm than noon.',
      practising: 'The sun’s position in the sky changes through the day, and a shadow always points away from the light. Also reading the hour on a clock and recording an observation at regular intervals.',
      ask: 'At the shortest mark: “This is the shortest shadow so far. Where is the sun now?” Let him point towards it without looking at it.',
      next: 'On the next sunny morning, check whether the 9 o’clock shadow falls on yesterday’s line. On a visit to Jaipur, see the Samrat Yantra at the Jantar Mantar, a giant sundial built for Maharaja Sawai Jai Singh II and completed in the 1730s.',
      honest: 'The marks hold for a few days and then drift as the seasons change, so this is a record of one day’s shadows, not a working clock. Seeing the shadow move does not mean he understands that the Earth’s turning causes it; that comes much later.',
      easier: 'Make only three marks: after breakfast, at lunch and before dinner.',
      harder: 'Measure each shadow with a ruler, write the lengths in a row, and ask him at which hour the shortest one came.',
      safety: 'Never look straight at the sun, even for a moment, and never through glasses or a tube. Use a sun hat and sunscreen for the midday marks. Keep the clay and chalk away from the two-year-old’s mouth.',
    },
  },
  {
    id: 'moong-in-the-cupboard',
    title: 'Does Moong Need the Light to Sprout?',
    hook: 'Two jars of moong. One goes in the dark.',
    where: 'kitchen',
    minutes: 15,
    need: [
      'a cup of whole green moong',
      'two clean glass jars, the same size',
      'two squares of wet cotton cloth or kitchen paper',
      'a dark kitchen cupboard, and a bright windowsill out of strong direct sun',
      'a pencil and a sheet of paper for drawing',
    ],
    steps: [
      {
        text: 'Soak two equal handfuls of moong in water overnight.',
        art: 'In the kitchen, Arjun tips a heaped handful of small green moong beans into one of two steel bowls of water on the counter, while Mummy pours a second, equal handful into the other bowl.',
      },
      {
        text: 'In the morning, drain them. Line both jars with wet cloth and add the moong.',
        art: 'Mummy holds a sieve of swollen green moong over the sink while Arjun spoons the wet beans into a glass jar lined with a damp white cotton cloth; a second lined jar of moong already stands on the counter.',
      },
      {
        text: 'Put one jar in a dark cupboard and one on a bright windowsill.',
        art: 'Arjun sets one glass jar of moong inside an open, dark kitchen cupboard while Mummy places the other jar on a sunny kitchen windowsill, looking back at him over her shoulder.',
      },
      {
        text: 'Morning and evening, sprinkle both cloths with the same spoonful of water.',
        art: 'Arjun sprinkles one tablespoon of water over the damp cloth in a glass jar of moong, while Mummy holds the second jar and the measuring spoon ready for him to do the same.',
      },
      {
        text: 'Each day, draw both jars side by side. What changed?',
        art: 'At the kitchen table Arjun draws two jars side by side with a pencil on a sheet of paper, the two real jars of sprouting moong standing in front of him, while Mummy points at the tiny white root tips in one of them.',
      },
      {
        text: 'On day five, tip both jars out and lay the sprouts side by side.',
        art: 'On a white plate on the kitchen table, Arjun lays two little heaps of moong sprouts side by side: one with pale yellow stalks, one with green-topped stalks; Mummy leans in with him to compare the colours.',
      },
    ],
    notice: 'Both jars sprout, but the sprouts from the dark grow pale yellow and long, while the ones in the light turn green at the top.',
    ask: 'Both jars sprouted. So what is the light for?',
    pairsWith: 'what-does-this-seed-need',
    note: {
      what: 'He soaks two equal handfuls of moong, sets one jar in a dark cupboard and one on a bright windowsill, waters both the same twice a day, and draws them side by side for about five days.',
      expect: 'He will probably predict that the dark jar will not sprout at all. Both usually sprout within a day or two, because a seed carries its own food. Over the next days the dark sprouts grow pale yellow and lanky while the light ones open small green leaves. If either jar smells sour or grows fuzz, rinse the moong and start again.',
      practising: 'Seeds need water, air and warmth to sprout; light is not needed for sprouting but is needed for a seedling to make its own food and turn green. Also a fair test: same seeds, same water, one change only.',
      ask: 'On the day both jars have roots: “The dark jar sprouted too. Did it need the light?” Then, a few days later: “So what is the light for?”',
      next: 'Rinse the sprouts, cook them lightly, and put them in a moong chilla or a sprouts sabzi so he eats what he grew. Then read The Bean in the Dark together.',
      honest: 'Five days shows the change in colour; it does not show why it happens. One pair of jars is a single trial, and a warmer windowsill can speed up the light jar for reasons that have nothing to do with light. Chlorophyll and photosynthesis are names for later.',
      easier: 'Look only on day one and day five, and ask which jar looks different.',
      harder: 'Add a third jar that gets no water at all, and ask him beforehand which jars will sprout.',
      safety: 'Wash the jars well before you start. Keep the dry and soaked beans out of the two-year-old’s reach, since whole moong is a choking hazard for her. Cook the sprouts before anyone eats them; raw sprouts can carry bacteria that young children handle badly.',
    },
  },
  {
    id: 'ramp-race-two-heights',
    title: 'Does the Car Go Farther From Higher Up?',
    hook: 'One car, one board, two piles of books.',
    where: 'kitchen',
    minutes: 20,
    need: [
      'a stiff board, tray or large hardback book to use as a ramp',
      'a stack of six thick books',
      'one toy car that rolls freely',
      'a strip of masking tape and a marker',
      'a clear run of smooth kitchen floor',
    ],
    steps: [
      {
        text: 'Rest one end of the board on two books. Mark a start line near its top.',
        art: 'On the smooth kitchen floor, Papa props one end of a long flat board on a stack of two thick books, while Arjun presses a strip of masking tape across the top of the board as a start line.',
      },
      {
        text: 'Set the car on the start line. Let go. Do not push.',
        art: 'Arjun crouches at the top of the low ramp with one finger just lifting off the back of a small red toy car resting on the tape start line, while Papa lies on his stomach at the bottom of the ramp, watching.',
      },
      {
        text: 'Where the car stops, stick a piece of tape and write 2.',
        art: 'Arjun kneels on the floor and presses a short piece of masking tape marked with a big 2 beside the stopped red toy car, while Papa stands with the roll of tape and marker, looking back along the floor to the ramp.',
      },
      {
        text: 'Now guess: from four books, will it stop nearer, farther, or the same?',
        art: 'Arjun points down the floor past the tape marked 2, guessing, while Papa slides two more thick books under the end of the board to make a stack of four.',
      },
      {
        text: 'Let go from the same start line. Mark where it stops with 4.',
        art: 'Arjun lets go of the red toy car at the tape start line on the steeper ramp resting on four books, his hand open and back, while Papa crouches far down the floor beside a new piece of tape marked 4.',
      },
      {
        text: 'Run each height three times. Do the stops land close together?',
        art: 'Arjun sits on the floor beside two small clusters of masking-tape marks, three marked 2 and three marked 4 farther along, pointing from one cluster to the other, while Papa sits beside the ramp holding the car.',
      },
    ],
    notice: 'From the higher start the car is going faster at the bottom and rolls farther along the floor, though no one pushed it harder.',
    ask: 'Nobody pushed harder. Where did the extra roll come from?',
    pairsWith: 'start-higher-roll-farther',
    note: {
      what: 'He lets the same car go, without pushing, from the same start line on a ramp propped on two books and then on four, and marks where it stops on the floor with tape.',
      expect: 'He will probably want to push the car, and a push spoils the comparison, so say “let go, no push” before every run. The stops will scatter a little from run to run; three runs at each height show a pattern that one run cannot. Very steep ramps make the car bounce off the end, so stop at four or five books.',
      practising: 'Height stores energy: a car lifted higher gains more speed as it rolls down and travels farther before friction stops it. Also a fair test, changing only the height, and repeating a measurement because single runs vary.',
      ask: 'After the first run from four books: “You didn’t push it. So why did it go farther?” Accept a gesture up the ramp as an answer.',
      next: 'Roll the car off the same ramp onto a towel instead of the bare floor and compare the stops; that is friction. Then play Start Higher, Roll Farther.',
      honest: 'Farther from higher up is the pattern; it does not show that he understands stored energy, and a wheel that rubs or a wobbly board can muddy it. A swerving car may stop short because it hit something, not because the ramp was lower.',
      easier: 'Do one run at each height and compare only which mark is farther.',
      harder: 'Add a run from three books and ask him, before he lets go, where between the 2 marks and the 4 marks it will stop.',
      safety: 'Keep the book stack low and on the floor, not the table, so nothing heavy falls. Toy cars with small parts stay out of the two-year-old’s reach.',
    },
  },
  {
    id: 'why-is-a-ruler-called-a-foot',
    title: 'Why Is a Ruler Called a Foot?',
    hook: 'Your feet say one number. Papa’s say another.',
    where: 'table',
    minutes: 20,
    need: [
      'the dining table, or any long table',
      'a 12-inch (one-foot) ruler',
      'bare or socked feet: yours and the grown-up’s',
      'a pencil and a sheet of paper',
    ],
    steps: [
      {
        text: 'Walk heel to toe along the table. Count each foot out loud.',
        art: 'Arjun walks heel to toe along the side of the dining table in his socks, his front heel pressed against his back toe and his arms out for balance, counting aloud, while Papa walks slowly beside him counting on his fingers.',
      },
      {
        text: 'Now the grown-up walks heel to toe along the same side. Count again.',
        art: 'Papa sets one big socked foot heel to toe in front of the other along the same side of the dining table, wobbling a little, while Arjun crouches beside Papa’s feet and counts them with his pointing finger.',
      },
      {
        text: 'Write both numbers down. Same table, two answers. Put your feet side by side.',
        art: 'At the end of the dining table, Arjun and Papa sit on the floor with their bare feet side by side, heels on the same floor-tile line, Arjun’s foot clearly shorter; a sheet of paper with two numbers on it lies between them.',
      },
      {
        text: 'Put the ruler’s end at the table’s edge. Hold a finger at its far end.',
        art: 'Arjun lines up the end of a wooden 12-inch ruler exactly with the edge of the dining table and presses his finger on the tabletop at the ruler’s far end, while Papa leans in and points at the two lined-up edges.',
      },
      {
        text: 'Slide the ruler up to your finger, with no gap. Count each ruler.',
        art: 'Arjun slides the ruler forward along the tabletop until its end touches his fingertip, mouthing the count, while Papa writes a row of tally marks on the sheet of paper at the end of the table.',
      },
      {
        text: 'The grown-up measures with the ruler too. Do you get the same number?',
        art: 'Papa lays the same ruler along the dining table and moves it end to end while Arjun walks beside him holding up the paper with his own ruler count written on it, checking Papa’s count against it.',
      },
    ],
    notice: 'Your feet give a bigger number than Papa’s because each of your feet is shorter, but the ruler gives you both the same number.',
    ask: 'Why did the ruler give you and Papa the same number?',
    pairsWith: 'how-long-is-that-dinosaur',
    note: {
      what: 'He measures the length of the table in his own feet, then in yours, then in 12-inch rulers laid end to end, and compares the three counts.',
      expect: 'Expect gaps between steps and overlaps between rulers; both make the count wrong. He may at first say the table is longer for him because his number is bigger. The surprise is that the bigger number comes from the smaller foot. The table will rarely be a whole number of rulers; “six and a bit” is a correct answer.',
      practising: 'Measurement as a count of equal units laid end to end with no gaps or overlaps, and why everyone must use the same unit. A smaller unit gives a bigger count for the same length.',
      ask: 'When the two foot counts are written down: “Your number is bigger. Is the table longer when you measure it?”',
      next: 'Measure his bed, the door and the sofa in rulers and order them from shortest to longest. Then tell him that old units such as the foot and the hand began with body parts and differed from place to place; since 1959 the foot has been fixed at exactly 30.48 centimetres wherever it is used.',
      honest: 'Counting rulers along one table does not mean he understands measurement. The test is whether he can say why a gap or an overlap changes the answer, and whether he can measure something you did not choose.',
      easier: 'Measure only in his feet and yours, and ask which of you got the bigger number.',
      harder: 'Ask him to guess the next item’s length in rulers before measuring, and to say how many of his feet make one ruler.',
      safety: 'Walk heel to toe on a clear floor, away from chair legs, and keep a hand near him for balance. The ruler is not a sword; keep it below shoulder height near the two-year-old.',
    },
  },
  {
    id: 'can-an-egg-survive-the-chair',
    title: 'Can a Boiled Egg Survive the Drop?',
    hook: 'One bare egg, one packed egg, same drop.',
    where: 'kitchen',
    minutes: 20,
    need: [
      'two eggs, hard-boiled and cooled by a grown-up beforehand',
      'a small cardboard box with a lid, such as a shoebox',
      'newspaper, old socks or cotton wool for packing',
      'a metal baking tray',
      'a kitchen chair, as a height marker',
    ],
    steps: [
      {
        text: 'Pack the box with crumpled paper or socks. Press a nest into the middle.',
        art: 'Arjun stuffs crumpled newspaper and a pair of rolled socks into a cardboard shoebox on the kitchen floor and presses a hollow into the middle with his fist, while Mummy, sitting cross-legged beside him, holds out another sheet of newspaper.',
      },
      {
        text: 'The grown-up drops a bare boiled egg onto the tray from chair-back height.',
        art: 'Mummy, standing on the floor beside a kitchen chair, lets go of a white boiled egg in its shell from level with the top of the chair back, over a metal baking tray on the floor, while Arjun crouches at the tray’s edge watching the egg fall.',
      },
      {
        text: 'Look at the shell closely. Find every crack.',
        art: 'Arjun crouches over the baking tray and points at a web of cracks and a flattened spot on the bare boiled egg lying on it, while Mummy kneels across the tray and turns the egg gently so he can see the other side.',
      },
      {
        text: 'The grown-up sets the second egg in your nest. Close the lid.',
        art: 'Mummy lowers the second white boiled egg into the hollow in the crumpled newspaper inside the shoebox, while Arjun holds the shoebox lid ready in both hands to close it.',
      },
      {
        text: 'Guess: cracked or whole? Then the grown-up drops the box from the same height.',
        art: 'Mummy holds the closed shoebox level with the top of the chair back above the baking tray, about to let go, while Arjun crouches beside the tray holding a card on which he has drawn an egg with no cracks.',
      },
      {
        text: 'Open the box and check every side of the egg. Then peel both and eat them.',
        art: 'At the kitchen table, Arjun turns the whole, uncracked boiled egg slowly in his fingers, checking every side, while Mummy peels the cracked egg onto a small steel plate beside him.',
      },
    ],
    notice: 'The bare egg cracks on the tray, and the packed egg falling from the same height usually comes out whole.',
    ask: 'Both eggs fell from the same height. What did the packing do?',
    note: {
      what: 'He packs a shoebox with crumpled paper or socks. You drop one bare boiled egg onto a tray, then drop a second egg packed in his box from the same height, and he checks both shells.',
      expect: 'He may expect both to crack, or think the box works because it is heavier. Packing that is too thin, or an egg that touches the side of the box, can still crack, which is useful: ask him where the egg hit. He will want to drop it again; let him repack and try.',
      practising: 'A soft cushion stops a falling thing over a longer distance and a longer time, so the push on it at any moment is smaller. Helmets, shoe soles and car airbags work the same way. Also a fair test: same height, same kind of egg, one change.',
      ask: 'When he opens the box and the egg is whole: “Both eggs fell from the same height. What did the paper do to the egg when it landed?”',
      next: 'Feel the foam inside his bicycle helmet and talk about what it is for. Next time, use half the packing and see whether the egg still survives.',
      honest: 'A whole egg shows that packing helped once. It does not show why, and a lucky landing can save a bare egg or crack a packed one. Two eggs are one comparison, not a result.',
      easier: 'Skip the guess and just compare the two shells side by side.',
      harder: 'Pack two boxes, one with paper and one with socks, and ask him beforehand which egg will do better and why.',
      safety: 'Boil the eggs and let them cool completely before he joins in; he never goes near the pan or the hot water. Only the grown-up drops, standing on the floor; nobody climbs on the chair. Sweep up shell straight away and keep the two-year-old clear of the tray. Skip this if anyone in the house is allergic to egg.',
    },
  },
  {
    id: 'coat-hanger-balance',
    title: 'Can a Coat Hanger Do Sums?',
    hook: 'Two cups, one hanger. Make it hang level.',
    where: 'table',
    minutes: 25,
    need: [
      'a plastic coat hanger with two notches or hooks at its ends',
      'two paper cups, the same size',
      'string and sticky tape',
      'a jar of pennies, about 30',
      'a broom handle laid across the backs of two chairs',
    ],
    steps: [
      {
        text: 'The grown-up tapes a string loop to each cup and hangs one cup at each end.',
        art: 'Papa tapes a loop of string across the mouth of a paper cup while Arjun hooks a second cup by its string loop into the notch at one end of a plastic coat hanger hanging from a broom handle laid across the backs of two dining chairs.',
      },
      {
        text: 'Hang the hanger on the broom handle. Do the empty cups hang level?',
        art: 'Arjun crouches so his eyes are level with the plastic coat hanger hanging from the broom handle between two chair backs, a paper cup dangling from each end, while Papa holds a hand flat beside the hanger’s bar to show it is level.',
      },
      {
        text: 'Drop three pennies in one cup. Which way does the hanger tip?',
        art: 'Arjun drops a third penny into the left paper cup and the left end of the coat hanger dips lower, while Papa points at the empty right cup, now hanging higher.',
      },
      {
        text: 'Guess how many pennies the other cup needs. Then add them, one at a time.',
        art: 'Arjun holds up three fingers on one hand and drops a penny into the right paper cup with the other, while Papa watches the hanger bar starting to level out.',
      },
      {
        text: 'Now put five in one cup. Make the other side match.',
        art: 'Arjun counts pennies from his palm into the right-hand paper cup while the left cup, already holding five, hangs lower; Papa holds up five fingers as a reminder.',
      },
      {
        text: 'Try two pennies plus three in one cup, and four plus one in the other.',
        art: 'Arjun drops the last penny into the right paper cup and steps back to see the coat hanger hanging level, while Papa writes 2 + 3 = 4 + 1 on a sheet of paper lying on a chair seat below the hanger.',
      },
    ],
    notice: 'The hanger hangs level only when both cups hold the same number of pennies, however you split them up.',
    ask: 'Two and three on one side, four and one on the other. Why is it level?',
    pairsWith: 'make-both-sides-match',
    note: {
      what: 'He hangs a paper cup from each end of a coat hanger and adds pennies until the hanger hangs level, then makes level sides from different splits, such as 2 and 3 against 4 and 1.',
      expect: 'The empty hanger may not hang level; a strip of tape on the high end can fix that before you start. He will probably add pennies to the low side at first. When 2 + 3 balances 4 + 1, he may expect the side with more handfuls to win.',
      practising: 'Equality as a relationship: the equals sign means both sides have the same value, not “the answer comes next”. A balance is a physical picture of that, before the symbols.',
      ask: 'When 2 + 3 and 4 + 1 hang level: “Different numbers went in. Why is it level?”',
      next: 'Write 3 + 4 = ☐ + 2 on paper and let him check his answer on the hanger. Then play Make Both Sides Match.',
      honest: 'Balancing pennies does not show that he reads the equals sign as “same value”. The test is a written sentence like 5 = 2 + ☐ with no hanger in sight. A stiff hook can stick, so a one-penny difference may barely show; tap the hanger gently before reading it.',
      easier: 'Use only the same small numbers, 1 to 5, on each side, and no splits.',
      harder: 'Put 6 in one cup and ask him for three different ways to fill the other cup with two handfuls.',
      safety: 'Keep the hanger at his chest height or lower, so nothing swings at his face. Count the pennies back into a closed jar afterwards; they are a choking hazard for the two-year-old.',
    },
  },
  {
    id: 'does-the-magnet-want-it',
    title: 'Does the Fridge Magnet Want It?',
    hook: 'Sort the kitchen into two piles: sticks, or not.',
    where: 'kitchen',
    minutes: 15,
    need: [
      'a large fridge magnet, too big to swallow',
      'a steel spoon, a steel bowl and a steel lid',
      'a wooden spoon, a plastic cup and a ceramic mug',
      'a roll of kitchen foil and a clean, empty food tin',
      'two trays labelled with a drawn magnet and a crossed-out magnet',
    ],
    steps: [
      {
        text: 'Lay everything on the counter. Guess for each one: will the magnet hold it?',
        art: 'Arjun sets a wooden spoon, a steel spoon, a plastic cup, a ceramic mug, a steel bowl, a ball of kitchen foil and an empty food tin in a row on the kitchen counter, while Mummy holds a large fridge magnet ready.',
      },
      {
        text: 'Touch the magnet to each thing. Does it hold on?',
        art: 'Arjun presses a large fridge magnet against the side of an empty food tin and lets go of the magnet, which stays stuck to the tin, while Mummy holds the tin steady and watches.',
      },
      {
        text: 'Put things the magnet holds on one tray. Put the others on the second tray.',
        art: 'Arjun places a steel spoon on a tray marked with a drawn magnet, beside the tin, while Mummy points at the other tray, marked with a crossed-out magnet, which holds the wooden spoon and the plastic cup.',
      },
      {
        text: 'Try the kitchen foil. It is metal. Does the magnet want it?',
        art: 'Arjun holds a crumpled ball of shiny kitchen foil against the fridge magnet in Mummy’s hand, and the foil falls away; his eyebrows go up in surprise.',
      },
      {
        text: 'Try steel things from all over the kitchen. Do all of them stick?',
        art: 'Arjun holds the fridge magnet against the side of the steel kitchen sink and it slides straight off into his other hand, while Mummy leans on the counter beside him, pointing at a steel spoon on the magnet tray for comparison.',
      },
    ],
    notice: 'The magnet holds the tin and some steel things, but not the foil, the wood, the plastic or the mug, and not every steel thing either.',
    ask: 'The foil is metal too. Why did the magnet not want it?',
    pairsWith: 'will-the-magnet-pick-it-up',
    note: {
      what: 'He guesses whether a fridge magnet will hold each kitchen object, tests it, and sorts everything onto two trays: held, or not held.',
      expect: 'Most children think a magnet holds all metal. Foil (aluminium) does not stick, and many stainless-steel sinks, pans and spoons do not either, while a food tin and a painted fridge door usually do. The surprises are the point; do not explain them away before he tests.',
      practising: 'Magnetism: magnets attract iron and some kinds of steel, not all metals. Also sorting by a tested property rather than by appearance, and comparing a prediction with a result.',
      ask: 'After the foil falls away: “It is shiny and it is metal. Why didn’t the magnet hold it?” Accept “some metals are different” as a good answer.',
      next: 'Walk round the house with the magnet and find three more things it holds. Then play Will the Magnet Pick It Up?',
      honest: 'Sorting a dozen kitchen objects does not mean he can predict new ones; the test is a fresh object he has not tried. Iron and steel are names for later; “some metals” is enough for now.',
      easier: 'Use only five things: the tin, a steel spoon, a wooden spoon, a plastic cup and the foil.',
      harder: 'Ask him to find something the magnet holds through a sheet of paper, and something it does not.',
      safety: 'Use one large fridge magnet only. Never use small or loose powerful magnets such as neodymium buttons or magnetic toy balls; if a child swallows two, they can pinch the gut together and need surgery. Keep the magnet and small objects away from the two-year-old, and check the tin rim is smooth.',
    },
  },
  {
    id: 'does-a-towel-keep-ice-cold',
    title: 'Does a Towel Keep Ice Cold?',
    hook: 'Two ice cubes. One gets a blanket.',
    where: 'kitchen',
    minutes: 40,
    need: [
      'two ice cubes the same size, from the same tray',
      'two small steel bowls or saucers, the same',
      'a thick hand towel',
      'a kitchen timer or clock',
    ],
    steps: [
      {
        text: 'Put one ice cube in each bowl. Check they look the same size.',
        art: 'Arjun drops one ice cube into each of two small steel bowls on the kitchen counter, while Mummy holds the ice tray and bends down to compare the two cubes at eye level.',
      },
      {
        text: 'Wrap one bowl up tightly in the thick towel. Leave the other bare.',
        art: 'Arjun folds a thick striped hand towel over and around one small steel bowl on the counter, tucking the ends under, while the second bowl with its ice cube stands uncovered beside it and Mummy sets the kitchen timer.',
      },
      {
        text: 'Guess: will the wrapped cube melt faster, slower, or the same?',
        art: 'Arjun points from the towel bundle to the bare steel bowl, deciding, while Mummy holds a pencil over a card with a drawn towel and a drawn bare bowl, ready to circle his guess.',
      },
      {
        text: 'After half an hour, unwrap the towel. Put the bowls side by side.',
        art: 'Arjun peels back the towel and finds a still-solid ice cube in the first bowl, while beside it Mummy tilts the bare bowl to show a much smaller cube sitting in a pool of water.',
      },
      {
        text: 'Feel the towel’s inside. Is it warm, or cool?',
        art: 'Arjun presses his palm flat against the inside of the unwrapped thick towel, his face puzzled, while Mummy holds the towel open for him and waits for his answer.',
      },
    ],
    notice: 'The wrapped ice cube melts more slowly, and the inside of the towel feels cool, not warm.',
    ask: 'We wrap up to stay warm. So why did the towel keep the ice cold?',
    pairsWith: 'where-did-the-ice-go',
    note: {
      what: 'He puts two equal ice cubes in two matching bowls, wraps one bowl in a thick towel, and after half an hour compares how much of each cube is left.',
      expect: 'Most children expect the towel to melt the ice faster, because blankets “make you warm”. The wrapped cube usually lasts much longer. He may then decide the towel is “cold”, so ask him to feel it.',
      practising: 'Insulation slows heat moving from one place to another. A blanket keeps you warm by holding in your own body’s heat; it makes no heat itself, so around ice it slows the room’s heat getting in. Also a fair test with one change.',
      ask: 'After unwrapping: “We wrap up in a blanket to stay warm. Why did the towel keep the ice cold?”',
      next: 'Pack his lunch with a cold pack in an insulated bag and check at lunchtime whether it is still cold. Then play Where Did the Ice Go?',
      honest: 'One pair of ice cubes shows that the towel slowed melting. It does not show that he understands heat transfer, and a sunny spot or unequal cubes can change the result. “The towel makes cold” is a common next idea; it is wrong, and it is worth a second try.',
      easier: 'Check after ten minutes and just ask which cube is bigger.',
      harder: 'Wrap a third cube in kitchen foil only, and ask him beforehand to put the three in order of which will melt first.',
      safety: 'Use ice cubes the size of a large grape or bigger, and keep them away from the two-year-old, who can choke on ice. Wipe up the melt water so nobody slips.',
    },
  },
  {
    id: 'rangoli-other-half',
    title: 'Finish the Other Half of the Rangoli',
    hook: 'The grown-up makes one half. You make the other.',
    where: 'table',
    minutes: 25,
    need: [
      'a large steel thali or a big round tray',
      'a cupful of raw rice',
      'a small bowl each of toor dal, green moong and masoor dal',
      'a wooden ruler or a strip of card',
    ],
    steps: [
      {
        text: 'Lay the ruler across the middle of the thali. That is the mirror line.',
        art: 'Arjun lays a wooden ruler straight across the middle of a large steel thali on the dining table, while Mummy places small steel bowls of white rice, yellow toor dal, green moong and orange masoor dal beside the thali.',
      },
      {
        text: 'The grown-up makes a pattern on one side only, starting at the ruler.',
        art: 'Mummy pinches a thin line of white rice into a petal shape on one half of the thali, starting at the ruler, while Arjun watches closely with a pinch of yellow toor dal ready in his fingers.',
      },
      {
        text: 'Copy each shape on your side, the same distance from the ruler.',
        art: 'Arjun sprinkles yellow toor dal into a petal shape on his half of the thali, opposite Mummy’s yellow petal, measuring the gap to the ruler with two fingers, while Mummy holds the bowl steady.',
      },
      {
        text: 'Check: a shape close to the ruler stays close. A far one stays far.',
        art: 'Mummy points to a green moong dot right beside the ruler on her side, and Arjun points to his matching green dot at the same place on his side, both faces close to the thali.',
      },
      {
        text: 'Lift the ruler away carefully. Does one half match the other?',
        art: 'Arjun lifts the ruler straight up from the middle of a finished rice-and-dal rangoli on the steel thali, while Mummy leans in to look along the middle line where the two halves meet.',
      },
    ],
    notice: 'Each shape on your side is the same size and the same distance from the line as its partner, but it faces the other way.',
    ask: 'Your petal points the other way. Is it still the same petal?',
    pairsWith: 'make-the-other-half',
    note: {
      what: 'You lay rice and dal in a pattern on one half of a thali, on one side of a ruler, and he copies each shape onto the other half, flipped as in a mirror.',
      expect: 'His first copy will probably repeat your shape facing the same way, slid across instead of flipped, or drift away from the line. Point to the ruler and ask how far your shape is from it. Mirror reversal of a curved petal is the hardest part.',
      practising: 'Line symmetry: a reflection keeps each shape’s size and its distance from the mirror line but reverses which way it faces. Also fine finger control and careful copying.',
      ask: 'When he has copied one petal: “My petal is two fingers from the ruler. How far is yours?”',
      next: 'Find a symmetric rangoli at a doorstep or in a temple at Diwali, and ask him where its mirror line is. Then play Make the Other Half.',
      honest: 'Copying a half with your help does not show he can see symmetry on his own. The test is whether he can find a mirror line in a new picture, or spot a deliberate mistake in one half. Many rangolis also have turning symmetry, which is a different idea.',
      easier: 'Use only straight lines and dots, close to the ruler.',
      harder: 'Draw two mirror lines in a plus sign and ask him to complete all four quarters from your one.',
      safety: 'Raw dal and rice are choking hazards for the two-year-old; keep the thali well out of her reach, and sweep up spills.',
    },
  },
  {
    id: 'what-did-everyone-eat-for-breakfast',
    title: 'Who Ate What for Breakfast?',
    hook: 'Ask the family. Draw the answers in columns.',
    where: 'table',
    minutes: 20,
    need: [
      'a large sheet of paper and a ruler',
      'crayons or felt pens',
      'small squares of paper, all the same size, about 20',
      'glue stick',
      'the family, at or after breakfast',
    ],
    steps: [
      {
        text: 'Draw four columns. At the bottom, draw eggs, fruit, poha and paratha.',
        art: 'Arjun draws a small round paratha at the bottom of the fourth of four ruled columns on a large sheet of paper at the dining table, below drawings of a boiled egg, a banana and a plate of poha, while Papa holds the ruler steady along the paper.',
      },
      {
        text: 'Ask each person what they ate. Make a tally mark under their answer.',
        art: 'Arjun stands beside Mummy’s chair at the breakfast table holding a pencil and a sheet of paper with four food pictures, a tally mark under the paratha, while she points to the half-eaten paratha on her steel plate and Papa sits across the table waiting for his turn.',
      },
      {
        text: 'Draw one square for each tally mark. Glue it in that food’s column, from the bottom.',
        art: 'Arjun presses a small paper square with a drawn egg onto the egg column, just above the bottom picture, while Papa holds out the next square, already drawn with a paratha.',
      },
      {
        text: 'Keep the squares the same size and touching, with no gaps.',
        art: 'Arjun lines up the edge of a new paper square against the one below it in the poha column, pressing it flat with his thumb, while Papa points at a small gap in the fruit column for him to close up.',
      },
      {
        text: 'Which column is tallest? Which is shortest? Count each one.',
        art: 'Arjun runs his finger up the tallest column of paper squares on the finished breakfast pictograph, counting, while Papa holds the chart up against the kitchen wall and points at the shortest column.',
      },
    ],
    notice: 'The tallest column is the food the most people ate, and you can see it at a glance without counting.',
    ask: 'If Dadi and Dada came and both ate paratha, what would change?',
    pairsWith: 'what-did-our-class-choose',
    note: {
      what: 'He asks each person in the family what they ate for breakfast — eggs, fruit, poha or paratha — keeps a tally, and builds a pictograph with one paper square per person, stacked in columns.',
      expect: 'Unequal square sizes and gaps between squares are the usual mistakes, and they make a short column look tall. Someone will have eaten two things; decide together whether they get one square or two, and stick to it. With only four or five family members the columns will be short; ask visiting grandparents or count a whole week.',
      practising: 'Data handling: collecting answers to one question, sorting them into categories and showing each answer as one equal unit, so the heights of the columns can be compared. Also counting and comparing small numbers.',
      ask: 'When the chart is done: “How many more people ate paratha than eggs?” Let him count up the difference on the chart.',
      next: 'Repeat every morning for a week on the same chart, adding a new square each day, and on Sunday ask which breakfast the family eats most. Then play What Did Our Class Choose?',
      honest: 'A chart of five people does not show that he can read graphs in general. The test is a chart someone else made: can he say which is most, least and how many more? A family chart also tells you nothing about anyone outside the family.',
      easier: 'Use only two foods, such as eggs and paratha, and two or three people.',
      harder: 'Ask each person what they would like tomorrow, make a second chart, and ask him what changed and why.',
      safety: 'Keep the glue stick and paper squares from the two-year-old; she can join by pointing to her own breakfast.',
    },
  },
  {
    id: 'bundle-the-leaves-in-tens',
    title: 'How Many Leaves Did We Pick Up?',
    hook: 'Too many leaves to count? Bundle them in tens.',
    where: 'outdoors',
    minutes: 30,
    need: [
      'a cloth bag or basket',
      'a handful of large rubber bands or short pieces of string',
      'a park, garden or tree-lined street with fallen leaves',
      'a large sheet of paper and a pencil',
    ],
    steps: [
      {
        text: 'Walk slowly and pick up fallen leaves. Only ones already on the ground.',
        art: 'Arjun bends to pick up a large fallen leaf from the grass under a tree in a park, a cloth bag over his arm half full of leaves, while Papa walks beside him holding another fallen leaf up for him to see.',
      },
      {
        text: 'Sit down. Guess how many leaves are in the bag. Write the guess.',
        art: 'Arjun sits on a park bench with the cloth bag of leaves on his lap, frowning as he guesses, while Papa writes Arjun’s guess at the top of a large sheet of paper on a clipboard.',
      },
      {
        text: 'Count out ten leaves. Stack them and loop a rubber band round them.',
        art: 'Arjun holds a neat stack of ten fallen leaves together by their stems while Papa stretches a rubber band round the stems; a spread-out row of leaves waits on the bench beside them.',
      },
      {
        text: 'Make more bundles of ten until fewer than ten are left loose.',
        art: 'Arjun lays a third rubber-banded bundle of ten leaves beside two others on the park bench, with a few loose leaves left over, while Papa points from the bundles to the loose leaves.',
      },
      {
        text: 'Count the bundles in tens: ten, twenty, thirty. Then add the loose ones.',
        art: 'Arjun touches each bundle of leaves in turn, counting “ten, twenty, thirty” out loud, then points at the four loose leaves, while Papa writes the number 34 on the sheet of paper below the guess.',
      },
      {
        text: 'Undo one bundle. Are there more leaves now, fewer, or the same?',
        art: 'Arjun pulls the rubber band off one bundle and spreads its ten leaves out across the bench, while Papa sits beside him with eyebrows raised, waiting for his answer.',
      },
    ],
    notice: 'Counting the bundles in tens and then the loose ones is quicker than counting every leaf, and gives the same number.',
    ask: 'Undoing a bundle spreads the leaves out. Are there more leaves now?',
    pairsWith: 'ten-loose-one-bundle',
    note: {
      what: 'He collects fallen leaves on a walk, guesses how many he has, bundles them in tens with rubber bands, and counts the bundles in tens and then the loose leaves.',
      expect: 'He may count a bundle as “one” and forget that it stands for ten, or count every leaf again from one. Expect a miscount inside a bundle; recount it together rather than correcting him. Undoing a bundle often makes young children think there are now more leaves because they cover more ground.',
      practising: 'Place value and unitising: ten ones can be treated as one ten, and the number 34 means three tens and four ones. Also conservation of number when a bundle is undone, and comparing a guess with a count.',
      ask: 'When he undoes a bundle: “Are there more leaves now, fewer, or the same?” Then: “How do you know?”',
      next: 'At home, bundle ice-cream sticks or straws in tens and make the number of family members’ ages. Then play Ten Loose, One Bundle.',
      honest: 'Bundling leaves with your help does not show that he understands place value. The test is whether he can tell you, without counting, how many leaves are in 3 bundles and 4 loose, and what the 3 in 34 stands for.',
      easier: 'Stop at 20, with two bundles and a few loose leaves.',
      harder: 'Once he has 10 bundles, tie them into one bundle of a hundred and ask how to write the number.',
      safety: 'Pick only leaves already on the ground; leave berries, mushrooms and seed pods where they are, and wash hands afterwards. Learn poison oak (leaflets in threes) and leave it alone. Keep the rubber bands from the two-year-old, and hold hands near roads.',
    },
  },
];

export function getActivity(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
