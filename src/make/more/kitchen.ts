import type { Activity } from '../types';

/**
 * Mix, Change and Grow: kitchen changes he can see and handle. Cream splits into butter, haldi
 * shows what is in the water, cornflour will not stay sorted, and milk sets into dahi.
 * Food made here is food only; the colour test is never tasted.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'shake-cream-into-butter',
    area: 'kitchen',
    title: 'Shake Cream into Makkhan',
    hook: 'One jar of cream, a lot of shaking, and two new things.',
    where: 'kitchen',
    places: ['table'],
    minutes: 25,
    need: [
      'a clean food-safe plastic jar with a tight screw lid, about 500 ml',
      '150 ml pasteurised heavy (whipping) cream, out of the fridge for half an hour',
      'a small sieve and two bowls',
      'a bowl of very cold water, and a jug of more cold water to change it, for rinsing the butter',
      'a pencil and a scrap of paper for tally marks',
      'a roti or a slice of toast, and a pinch of salt if you like',
    ],
    steps: [
      {
        text: 'Pour the cream into the jar until it is a third full. The grown-up screws the lid on tight.',
        art: 'Standing on the kitchen floor at the low kitchen table, Arjun tips a plain white carton of thick cream into a clear plastic jar until it is about a third full, while Mummy holds the jar steady with one hand and the screw lid in the other; a sieve and two bowls wait beside them, and the carton is plain white.',
      },
      {
        text: 'Take turns shaking hard: twenty shakes each. Draw a tally mark after every turn.',
        art: 'At the kitchen table, Arjun shakes the lidded plastic jar of cream up and down hard with both hands, cheeks puffed out, while Mummy, sitting beside him, draws one more pencilled tally mark on a scrap of paper that already has a row of them.',
      },
      {
        text: 'When it goes quiet, stop and look inside. Is it thick, like whipped cream?',
        art: 'At the kitchen table, Mummy has unscrewed the lid and tilts the clear plastic jar towards Arjun, showing smooth thick white whipped cream clinging to its sides; Arjun stands on the floor beside the table and peers in with his nose near the rim, holding the lid in one hand.',
      },
      {
        text: 'Lid back on. Keep shaking until it suddenly sloshes and a lump knocks inside.',
        art: 'Arjun sits on a chair at the kitchen table and shakes the clear plastic jar hard with both hands, eyes wide, and through its sides one rough pale-yellow lump of butter swirls in thin watery liquid, while Mummy sits beside him with one hand cupped behind her ear, listening to the slosh.',
      },
      {
        text: 'Pour it through the sieve. The lump is makkhan; the thin liquid is buttermilk.',
        art: 'At the low kitchen table, Mummy holds a small sieve over a bowl while Arjun, standing on the floor, tips the clear plastic jar into it with both hands; one pale-yellow lump of butter stays in the sieve as thin, bluish-white buttermilk runs into the bowl below.',
      },
      {
        text: 'Press the lump in cold water, changing the water until it stays clear. Spread a little on roti.',
        art: 'Arjun squeezes a pale yellow lump of butter between his clean fingers in a bowl of cold water that is clouding white, while Mummy stands beside him at the counter holding a warm roti on a steel plate, ready for the first taste.',
      },
    ],
    notice: 'The cream goes thick and quiet first. Then it suddenly sloshes again: a yellow lump of butter has split away from a thin, watery liquid.',
    ask: 'We only put cream in the jar. Where did the butter come from?',
    trial: 'Shake a jar of the same cream alone first and count your turns: one carton can split in five minutes and another sit at the whipped stage for twenty. Turn the closed jar upside down over the sink and check the lid does not weep before he shakes it.',
    sources: [
      { label: 'Science Buddies: Scrumptious Science, Shaking for Butter', url: 'https://www.sciencebuddies.org/stem-activities/scrumptious-science-shaking-for-butter' },
      { label: 'WebExhibits: Butter, Ways of Churning Butter', url: 'http://webexhibits.org/butter/kitchen.html' },
      { label: 'Wikipedia: Krishna, the childhood Makhan Chor (butter thief) stories', url: 'https://en.wikipedia.org/wiki/Makhan_Chor' },
    ],
    tags: ['butter', 'makkhan', 'cream', 'buttermilk', 'Krishna', 'Janmashtami', 'rainy day', 'cooking', 'no oven'],
    note: {
      what: 'He takes turns with you shaking cream in a sealed plastic jar, keeping count with tally marks, until it thickens to whipped cream and then splits into a lump of butter and a thin buttermilk. He rinses the butter and eats a little on roti.',
      expect: 'Expect 5 to 20 minutes of shaking, depending on the cream and how cold it is; cream straight from the fridge is slowest. His arms will tire before the butter comes, so share the turns. The whipped stage goes quiet and feels like the end; the butter arrives suddenly after it, with a slosh and a knock against the jar.',
      practising: 'A change in a material: shaking makes the tiny drops of fat in cream bump and stick together until they gather into a solid lump, and the watery part runs free. One mixture separates into two different things. Also keeping count of turns with tally marks.',
      ask: 'When the slosh comes back: “We only put cream in. Where did the butter come from?” Any answer is fine; the point is that he looks at what changed.',
      next: 'Tell him the story of little Krishna, the makhan chor, who climbed with his friends to reach the butter pots hung out of his reach and was caught with butter on his face. On the next call, ask Dadi how butter was churned from dahi with a wooden madhani when she was small.',
      honest: 'This shows that shaking turned cream into two different things; it does not show that he understands fat drops, and “I shook it so it turned into butter” is a good place for him to stop. The liquid is sweet buttermilk, a cousin of the sour chaas left after churning dahi, not the same thing.',
      easier: 'You do most of the shaking and he takes the last turns, when the lump arrives, then pours it through the sieve.',
      harder: 'Shake two small jars, one with cream straight from the fridge and one left out for half an hour. You each shake one jar, then swap every turn so both get the same shaking, and count the turns each one takes.',
      safety: 'Use a food-safe plastic jar, not glass, and check the lid before he shakes. Use pasteurised cream, keep it out of the fridge for no more than two hours in all, and keep this jar and its bowls for food only, never for experiments. He washes his hands before he touches the butter. Refrigerate the butter in a covered dish and eat it within a day or two; drink or throw away the buttermilk the same day. Check for a dairy allergy first; the two-year-old can taste a little butter on roti if she already has dairy.',
    },
  },
  {
    id: 'haldi-turns-red',
    area: 'kitchen',
    title: 'Haldi Water That Turns Orange-Red',
    hook: 'It looks like plain water. Haldi can tell it is not.',
    where: 'kitchen',
    places: ['table'],
    minutes: 20,
    need: [
      'a quarter teaspoon of haldi (ground turmeric)',
      'a small jug with about 300 ml of water, and a spoon to stir',
      'baking-soda water the grown-up mixed and tested beforehand: half a level teaspoon of baking soda stirred into 150 ml water, in a plastic cup',
      '4 tablespoons of lemon juice (one or two lemons) in a small bowl',
      'three clear plastic cups, the same size',
      'a teaspoon for the lemon juice',
      'an old tray, a sheet of white paper, and old clothes (haldi stains)',
    ],
    steps: [
      {
        text: 'Stir a quarter teaspoon of haldi into the jug of water. Pour it into the three cups, a finger deep.',
        art: 'At the kitchen counter, on an old tray lined with white paper, Arjun pours bright yellow haldi water from a small jug into the last of three clear plastic cups standing in a row, the other two already yellow, while Papa holds the stirring spoon in one hand and steadies the row of cups with the other.',
      },
      {
        text: 'The grown-up’s clear water has something hidden in it. Guess: will it change the yellow?',
        art: 'Papa holds up a plastic cup of clear baking-soda water at eye level, looking just like tap water, while Arjun leans over the paper-lined tray of three cups of yellow haldi water, chin in one hand, deciding on his guess.',
      },
      {
        text: 'Pour the clear water into the first cup until it is twice as deep. Stir and watch.',
        art: 'Arjun holds a small clear plastic cup of clear, colourless water in both hands and pours it into the first of three same-size clear cups of yellow haldi water on the paper-lined tray, while Papa’s hand steadies that cup from below; orange-red swirls spread through the yellow as they both watch, and the other two cups stay yellow.',
      },
      {
        text: 'Spoon two teaspoons of lemon juice into the second cup. Leave the third cup plain, to compare.',
        art: 'Arjun spoons pale lemon juice from a small bowl into the middle one of three clear cups of haldi water on white paper; that cup stays yellow, the cup on its left glows orange-red, and the cup on its right is plain yellow, while Papa points from the orange-red cup to the yellow one.',
      },
      {
        text: 'Now add lemon juice to the red cup, one spoon at a time. Watch it fizz and change.',
        art: 'Arjun drips a teaspoon of lemon juice into a clear plastic cup of orange-red haldi water on white paper; small bubbles fizz and the top of the water turns back to yellow while the bottom stays orange-red, and Papa crouches beside the counter with his eyes level with the cup.',
      },
      {
        text: 'Line up all three cups on the white paper. Which ones match the plain cup now?',
        art: 'On the tray, Arjun slides three clear cups of yellow haldi water into a neat row against the white paper and runs his finger along them, while Papa bends down beside him, his eyes level with the cups, and looks along the row with him.',
      },
    ],
    notice: 'The baking-soda water turns the yellow haldi orange-red within seconds. Lemon juice keeps it yellow, and a few spoons of lemon fizz and turn the red cup back to yellow.',
    ask: 'It looked like plain water. How did the haldi know it wasn’t?',
    trial: 'Run all three cups alone first, against white paper. The baking-soda cup should go clearly orange-red within seconds; if it only looks a deeper yellow, make the jug paler with less haldi, so the change shows against the white paper; more baking soda will not make it redder. Then count how many spoons of lemon turn it back and keep it yellow for five minutes, so you have enough juice.',
    sources: [
      { label: 'Wikipedia: Turmeric, the Indicator section', url: 'https://en.wikipedia.org/wiki/Turmeric' },
    ],
    tags: ['haldi', 'turmeric', 'colour change', 'acid', 'baking soda', 'lemon', 'kitchen science', 'rainy day'],
    note: {
      what: 'He stirs haldi into water, then adds a clear baking-soda water you made and tested earlier to one cup and lemon juice to another, and keeps a third cup plain to compare. Lemon juice then turns the red cup back.',
      expect: 'Haldi does not dissolve; it hangs in the water and slowly settles, so stir the jug before each pour. The baking-soda cup goes orange-red or red-brown in a few seconds rather than bright red; it shows best against white paper. Lemon in the second cup changes almost nothing, which can disappoint him; that is the result. Lemon in the red cup fizzes and usually takes two to four spoons before it turns yellow again. If some orange creeps back as the fizz dies down, add one more spoon.',
      practising: 'An indicator: something whose colour shows what you cannot see in the water. Haldi stays yellow in plain water and in acids such as lemon juice, and turns orange-red in alkaline water such as baking-soda water; enough acid undoes it. Also using a test, not looks, to tell apart two things that seem the same.',
      ask: 'When the first cup turns: “It looked like plain water. How did the haldi know?” Let him answer in his own words; “the haldi can tell” is a fine answer.',
      next: 'Tell him that kumkum, the red powder for a tilak, was traditionally made by mixing turmeric with chuna (slaked lime, not the fruit), which is alkaline like the baking soda. Chuna burns skin and eyes, so that one stays a story, not an experiment. When the dal gets a squeeze of lemon at dinner, ask him whether its haldi will change colour, and why not.',
      honest: 'One set of cups shows that haldi changes colour; it does not show he understands acids and alkalis, and the words can wait. The lemon cup staying yellow tells him less than it seems, because plain water keeps haldi yellow too. The fizz is the lemon using up the baking soda, which is why the yellow comes back; he only needs to see that both happen together.',
      easier: 'Use only two cups: plain haldi water and the baking-soda cup. Let him watch the colour come and then bring it back with lemon.',
      harder: 'Fill two cups of clear water yourself, stirring baking soda into one, and do not say which. He adds a spoon of haldi water to each and finds out which is which.',
      safety: 'You make, test and keep the baking-soda water on your side of the tray. Use no soap, detergent or cleaner: they vary, and he should never learn to pour cleaners into a cup. Nothing from these cups is tasted, and the cups and spoons are washed before any food use. Lemon stings eyes and cuts, so no rubbing eyes and wash hands after. Haldi stains clothes, skin and counters. Keep every cup out of the two-year-old’s reach, and pour it all away with plenty of water when you finish.',
    },
  },
  {
    id: 'solid-or-liquid',
    area: 'kitchen',
    title: 'Is It a Solid or a Liquid?',
    hook: 'Squeeze it and it goes hard. Let go and it runs away.',
    where: 'table',
    places: ['garden', 'kitchen'],
    minutes: 25,
    need: [
      '1 cup of cornflour (cornstarch), about 130 g',
      'about half a cup (120 ml) of tap water, in a small jug',
      'a wide plastic or steel mixing bowl',
      'a large baking tray to stand the bowl on, with newspaper spread under it',
      'a spoon, and a plastic spatula for clearing up',
      'an old T-shirt, and a damp cloth',
    ],
    steps: [
      {
        text: 'Put the cornflour in the bowl. Add the water slowly while you stir with your hand.',
        art: 'At the patio table, Arjun stirs white cornflour with his bare hand in a wide steel bowl while Papa pours a thin stream of water into it from a small jug; the bowl sits on a large baking tray over spread newspaper printed only with blurred grey lines.',
      },
      {
        text: 'Stop adding water when stirring fast feels stiff and stirring slowly feels runny.',
        art: 'Arjun drags a spoon fast through the thick white cornflour mixture and it cracks open and resists, his face screwed up with effort, while Papa holds the half-empty water jug back at his side and watches across the patio table.',
      },
      {
        text: 'Push one finger in very slowly. Then tap the top fast with your fingertips. What changed?',
        art: 'Arjun’s pointing finger sinks slowly, knuckle-deep, into the smooth white cornflour mixture in the steel bowl, while Papa leans across the patio table with his own hand raised, fingertips together, ready to show a quick tap.',
      },
      {
        text: 'Scoop up a handful and squeeze it hard into a ball. Now open your hand and watch.',
        art: 'At the patio table, Arjun stands on the ground and holds his open palm over the steel bowl, and the white ball of cornflour he just squeezed melts into a runny drip between his fingers, while Papa cups his own hands under Arjun’s to catch the drips.',
      },
      {
        text: 'Decide together: is it a solid, a liquid, or something in between? Each give one reason.',
        art: 'Arjun, his hands white with cornflour, holds one hand up flat and stiff and wiggles the other like running water, while Papa sits across the patio table with his chin on his fist, listening; the bowl of white mixture sits between them on the tray.',
      },
      {
        text: 'Leave the leftovers to dry. Scrape them into the bin, never down the sink.',
        art: 'Arjun scrapes a crumbly white crust of dried cornflour off the baking tray into a kitchen bin with a plastic spatula, while Papa holds the bin steady with one hand and folds up the newspaper with the other.',
      },
    ],
    notice: 'A slow finger slides in as if into a liquid, but a quick tap meets a firm surface. A squeezed ball holds its shape, then melts and drips the moment the squeezing stops.',
    ask: 'It ran away, and then it held its shape. Is it a solid or a liquid?',
    trial: 'Mix a batch alone first and add the last of the water a spoonful at a time: the right mix cracks when you stir it fast and drips off the spoon when you stop. Cornflours differ, so note how much water yours took; if it is too runny, add cornflour by the spoonful.',
    sources: [
      { label: 'Arvind Gupta Toys: Solid Liquid', url: 'http://arvindguptatoys.com/toys/Solidliquid.html' },
      { label: 'Arvind Gupta Toys: Solid Liquid, how-to sheet (PDF)', url: 'http://www.arvindguptatoys.com/arvindgupta/toys/pdf/Solidliquiddoit.pdf' },
      { label: 'American Chemical Society, Adventures in Chemistry: State Debate', url: 'https://www.acs.org/education/whatischemistry/adventures-in-chemistry/experiments/state-debate.html' },
    ],
    tags: ['cornflour', 'cornstarch', 'oobleck', 'messy play', 'solid', 'liquid', 'rainy day', 'sensory play'],
    note: {
      what: 'He mixes cornflour with water in a bowl on a tray, pushes a finger in slowly and then taps fast, squeezes a handful into a ball and opens his hand, then decides with you whether it is a solid or a liquid.',
      expect: 'Expect white hands and forearms, and some drips past the tray; dry cornflour brushes off. The squeezed ball melting through his fingers is usually the moment that holds him, and he will want to repeat it many times. Many children say “both”, or change their answer each time; ask for the reason rather than settling it.',
      practising: 'Sorting materials by how they behave: a solid keeps its own shape, a liquid flows and takes the shape of its container. This mixture does each, depending on how hard and fast it is pushed, so the line between the two groups is not sharp. Also backing a claim with a reason.',
      ask: 'After the ball melts: “Was that a solid or a liquid?” Whatever he says, the useful part is his reason, so let him give it in his own words.',
      next: 'Look round the kitchen for other in-between things: honey, dahi, atta dough, ketchup. For each one, ask whether it keeps its shape or flows, and whether it changes if you push it hard.',
      honest: 'There is no single right answer for him to find: the mixture is usually described as a liquid that stiffens when it is pushed suddenly, and either answer with a reason is a good one. Why it stiffens, the grains crowding and locking together, is beyond what he can check; “it goes hard when you hit it” is what he saw.',
      easier: 'Skip the deciding. Let him do the slow finger and the fast tap, and tell you what each one felt like.',
      harder: 'Ask him to keep a ball hard by rolling it between his palms without stopping, then to tell you what happens the moment he stops, and what his hands were doing to keep it hard.',
      safety: 'Never pour it down the sink or toilet: it settles into a hard lump in the pipe. Let leftovers dry on the tray, scrape the crumbs into the bin, and rub dry flakes off hands over the bin before washing. Tap with fingertips, not slaps, so nothing splashes into eyes, and rinse with clean water if it does. Wipe floor spills at once, as wet cornflour is slippery. Cornflour is food, so if he wants his sister to join, she can have her own small bowl at the tray with a grown-up beside her the whole time; keep the water jug out of her reach.',
    },
  },
  {
    id: 'set-dahi-overnight',
    area: 'kitchen',
    title: 'Set Dahi Overnight',
    hook: 'A spoon of dahi, two bowls of milk, one warm night.',
    where: 'kitchen',
    places: ['table'],
    minutes: 15,
    span: 'Evening set, morning check',
    need: [
      '400 ml pasteurised whole milk, warmed by the grown-up to just lukewarm',
      '2 teaspoons of plain dahi with live cultures: from the last batch, or a shop tub whose label says live cultures',
      'a small steel jug, for carrying the lukewarm milk to the table',
      'two steel katoris or bowls with lids, the same size, each holding at least 250 ml',
      'a teaspoon',
      'a thick kitchen towel',
      'a warm spot: a closed cupboard on a warm night, or a switched-off oven with only its light on (no towel inside it)',
      'space on a fridge shelf',
    ],
    steps: [
      {
        text: 'The grown-up warms the milk and checks a drop on the wrist: warm, not hot. You wait at the table.',
        art: 'Beside the switched-off stove, Mummy holds a small steel pan of milk and tests its warmth against the inside of her forearm, while Arjun sits waiting across the room at the kitchen table with two empty steel katoris and a teaspoon in front of him.',
      },
      {
        text: 'Put one teaspoon of dahi into each katori. The grown-up brings the lukewarm milk in a jug and pours.',
        art: 'Arjun tips a heaped teaspoon of thick white dahi into the second of two steel katoris on the kitchen table, the first already holding its spoonful, while Mummy stands beside him holding a small steel jug of lukewarm milk ready to pour.',
      },
      {
        text: 'Stir each katori gently, ten times round. Put the lids on.',
        art: 'Arjun stirs a steel katori of milk slowly round with a teaspoon, his other hand holding the katori still on the kitchen table, while Mummy presses a steel lid onto the second katori beside it.',
      },
      {
        text: 'Guess which will set. Then put one katori somewhere warm, wrapped in the towel, and the other in the fridge.',
        art: 'Arjun holds a lidded steel katori out towards an open fridge shelf, while Mummy, beside him, holds the second katori bundled in a thick folded kitchen towel against her chest; they look at each other, each making a guess.',
      },
      {
        text: 'In the morning, take off the lids. Tilt each katori slowly. Which one stays put?',
        art: 'In the morning light at the kitchen table, Arjun tilts an uncovered steel katori and the white dahi inside holds firm in one piece, while Mummy tilts the second katori beside it and thin milk runs to its rim.',
      },
      {
        text: 'Smell the set dahi, then taste one spoonful. Is it a little sour? Then it goes in the fridge.',
        art: 'Arjun holds a teaspoon of thick, set white dahi up near his nose to sniff it before tasting, his eyes on Mummy, who holds the steel katori it came from and its lid in her two hands at the kitchen table.',
      },
    ],
    notice: 'By morning the warm katori has usually turned from runny milk into thick, slightly sour dahi. The fridge katori is still milk.',
    ask: 'Same milk, same spoon of dahi. What did the warm one have that the cold one didn’t?',
    pairsWith: 'what-does-this-seed-need',
    trial: 'Set one katori alone first, in the warm spot you plan to use, and check it after 6 hours and again in the morning. If it has not set by morning, the spot is too cool or the starter has no live cultures: try a warmer spot or a fresh tub before doing it with him.',
    sources: [
      { label: 'Wikipedia: Dahi (curd)', url: 'https://en.wikipedia.org/wiki/Dahi_(curd)' },
      { label: 'Wikipedia: Yogurt, how it is made', url: 'https://en.wikipedia.org/wiki/Yogurt' },
    ],
    tags: ['dahi', 'curd', 'yogurt', 'bacteria', 'overnight', 'Indian kitchen', 'warm and cold', 'fair test'],
    note: {
      what: 'He spoons a little dahi into two katoris of milk that you have warmed and checked are only lukewarm, stirs, and leaves one wrapped up somewhere warm and one in the fridge overnight. In the morning he tilts both to see which has set.',
      expect: 'The warm katori is usually set in 6 to 10 hours; overnight is fine, it is just a little more sour. It holds together when tilted, often with a thin layer of yellowish whey on top, which is normal. The fridge katori is still runny milk. He may expect the cold one to be thicker, because cold butter and ice are hard. A cool night or a weak starter can leave even the warm one half-set; give it a few more hours somewhere warm. Shop milk that is only warmed sets a little softer than milk the grown-up has boiled and cooled first, as many Indian kitchens do; both make dahi.',
      practising: 'Living things at work: tiny bacteria in the spoon of dahi feed on the milk, multiply in the warmth and make it sour, and the sourness thickens the milk. Warmth lets them work; cold slows them almost to a stop. Also a fair test: same milk, same starter, one change.',
      ask: 'When he tilts the fridge katori: “Same milk, same dahi. What did the warm one have that this one didn’t?”',
      next: 'Take the fridge katori out and leave it in the warm spot the next night; it often sets too, which points to the cold having stopped it, but a long night in the fridge can leave it half-set or not set at all, so taste it only if it smells and looks like the first batch. Keep a spoonful of the new dahi to start the next batch, and ask Dadi on the next call how she sets hers and where her warm spot is.',
      honest: 'He sees that warmth matters; he cannot see the bacteria, so “tiny living things did it” is something he takes on trust, not something this shows him. One pair of katoris is one trial, and an old starter, or a tub without live cultures, may set neither.',
      easier: 'Set just one katori in the warm spot, and let him tilt it and taste it in the morning.',
      harder: 'Stand a third katori of lukewarm milk with no dahi beside the warm one, and ask him beforehand which will set. In the morning it is usually still runny, or lumpy and sour-smelling; either way, pour it away without tasting it.',
      safety: 'Only the grown-up heats the milk; he waits at the table, away from the stove, and you bring the milk to him in a jug only after it feels lukewarm on the inside of your wrist. Keep the pan and the stove away from him and the two-year-old. Use pasteurised milk and plain dahi with live cultures. If the oven is the warm spot, it stays switched off with only its light on, the towel stays out of it, and tell everyone in the house so nobody turns it on. Once set, keep the dahi in the fridge and eat it within two or three days. If any katori smells bad, or shows pink, orange or fuzzy spots, throw the whole batch away without tasting. Check for a dairy allergy first.',
    },
  },
];
