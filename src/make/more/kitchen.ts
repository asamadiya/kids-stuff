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
        art: 'Arjun sits on a wooden chair at the kitchen table and shakes, with both hands, a light, thin-walled clear plastic jar with soft rounded shoulders and a wide white plastic screw lid, eyes wide; through its sides one rough pale-yellow lump of butter swirls in thin, milky-white liquid, the lid screwed tight and the outside of the jar dry. Mummy sits on a chair beside him with one hand cupped behind her ear, listening to the slosh.',
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
      safety: 'Use a food-safe plastic jar, not glass, and check the lid before he shakes. Use pasteurised cream within its date; if it smells sour when you open it, throw it away untasted. Keep it out of the fridge for no more than two hours in all, and keep this jar and its bowls for food only, never for experiments. He washes his hands before he touches the butter. Refrigerate the butter in a covered dish at once and eat it within a day or two; keep the buttermilk in the fridge and drink it the same day, or throw it away. Check for a dairy allergy first; the two-year-old can taste a little butter on roti if she already has dairy.',
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
        art: 'Kneeling on the floor beside the white paper, Arjun tips a teaspoon of pale, almost colourless lemon juice into the middle cup of three clear plastic cups, the tip of the spoon right over that cup’s rim; his other hand holds a small steel bowl of lemon juice with half a cut lemon in it. The left cup is orange-red, and the middle and right cups are yellow. Papa sits on the floor beside him with both hands resting on his knees and watches the middle cup.',
      },
      {
        text: 'Now add lemon juice to the red cup, one spoon at a time. Watch it fizz and change.',
        art: 'Arjun drips a teaspoon of lemon juice into a clear plastic cup of orange-red haldi water on white paper; small bubbles fizz and the top of the water turns back to yellow while the bottom stays orange-red, and Papa crouches beside the counter with his eyes level with the cup.',
      },
      {
        text: 'Line up all three cups on the white paper. Which ones match the plain cup now?',
        art: 'On the white paper in the tray on the kitchen table, Arjun, standing on the floor, runs one finger along three clear plastic cups of yellow haldi water: a left cup, a middle cup and a right cup, with a hand’s width of white paper between each one. Papa crouches beside the table with his eyes level with the cups and both hands resting on the table edge, and looks along the cups with him.',
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
        art: 'At the patio table, Arjun, standing on the paving, stirs white cornflour with his bare hand in a wide steel bowl while Papa pours a thin stream of water into it from a small steel jug; the bowl sits on a large steel baking tray lined with a sheet of plain brown paper.',
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
        art: 'Seen from across the patio table, Arjun stands on the paving on the far side of the table, the table top at his waist so only his upper body shows above it. He holds his open palm over the steel bowl on the baking tray, and the white ball of cornflour he has just squeezed melts into a runny drip between his fingers. Papa sits on a chair beside him and cups both his hands under Arjun’s hand to catch the drips.',
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
    title: 'Warm or Cold: Which Milk Sets into Dahi?',
    hook: 'A spoon of dahi, two katoris of milk, and one warm corner.',
    where: 'kitchen',
    places: ['table'],
    minutes: 15,
    span: 'Afternoon set, morning check',
    need: [
      'a kitchen thermometer: without one, do not do this activity, because a wrist or finger cannot tell you the milk is at 40 to 45 °C',
      '400 ml pasteurised whole milk, brought to the boil by the grown-up and cooled until the thermometer reads 40 to 45 °C',
      '3 teaspoons of starter, kept in the fridge until needed: plain shop-bought live yoghurt or dahi (the label says live cultures) within its date, or dahi you set this same way in the last 3 days',
      'a small steel pan to boil the milk in and a small steel jug to pour it from, both for the grown-up only',
      'two steel katoris with lids, the same size, each holding at least 250 ml, and a small steel katori for the starter',
      'two teaspoons',
      'a thick kitchen towel',
      'a warm, steady spot for 6 to 8 hours: an oven switched off with only its light on (no towel inside it), or a cupboard, with the katori wrapped in the towel',
      'space on a fridge shelf',
    ],
    steps: [
      {
        text: 'The grown-up boils the milk and cools it until the thermometer reads 40 to 45 °C. You wait at the table.',
        art: 'Mummy holds a slim steel kitchen thermometer upright in a small steel pan of milk cooling on the counter, well away from the switched-off stove, and watches it closely, while Arjun sits on a chair across the room at the kitchen table, waiting, with two empty steel katoris and a teaspoon in front of him.',
      },
      {
        text: 'The grown-up pours the cooled milk into the two katoris. Add one teaspoon of starter to each.',
        art: 'Arjun tips a heaped teaspoon of thick white dahi from a small steel katori into the second of two larger steel katoris of milk on the kitchen table, the first already holding its spoonful, while Mummy stands beside him holding the small steel jug she has just poured the milk from.',
      },
      {
        text: 'Stir each katori gently, ten times round. Put the lids on.',
        art: 'Arjun stirs a steel katori of milk slowly round with a teaspoon, his other hand holding the katori still on the kitchen table, while Mummy presses a steel lid onto the second katori beside it.',
      },
      {
        text: 'Guess which will set. One goes to the warm spot for 6 to 8 hours, the other straight into the fridge.',
        art: 'Arjun holds a lidded steel katori out towards an open fridge shelf, while Mummy, beside him, holds the second katori bundled in a thick folded kitchen towel against her chest; they look at each other, each making a guess.',
      },
      {
        text: 'In the morning, take both katoris out of the fridge. Lids off, tilt each slowly. Which one stays put?',
        art: 'At the kitchen table in the morning, Arjun holds one steel katori tipped right over on its side towards the viewer: the thick white dahi inside has set firm with a smooth flat top and does not slide at all, and a steel spoon stands upright in it. Beside him Mummy holds the second steel katori, from the fridge, tilted a little: it holds thin runny milk that slides to the rim. Both of them stand on the floor.',
      },
      {
        text: 'If it set in time, hold a spoon of starter beside a spoon of new dahi. Look, then taste: are they alike?',
        art: 'Arjun holds up a teaspoon of thick white new dahi beside a teaspoon of starter dahi that Mummy holds out, the two spoons side by side as he looks closely from one to the other at the kitchen table, with the set steel katori of new dahi and a small steel katori of starter between them.',
      },
    ],
    notice: 'The katori that spent 6 to 8 hours somewhere warm has set into thick, slightly sour dahi that holds when tilted. The katori that went straight into the fridge is still runny milk.',
    ask: 'Same milk, same spoon of starter. What did the warm one have that the cold one didn’t?',
    pairsWith: 'what-does-this-seed-need',
    trial: 'First test the warm spot: fill a katori with water at 45 °C, wrap it as you will wrap the dahi, and leave it there for an hour. If the thermometer then reads below 35 °C or above 45 °C, use the other spot; if neither holds, do not do this activity. Then set one katori alone the same way, check it from 6 hours, and chill it the moment it holds when tilted. If it has not set by 10 hours, bin it: the spot is too cool or too hot, or the starter has no live cultures. Try the other warm spot or a fresh tub on another day, and do it with him only after a trial has set in time.',
    sources: [
      { label: 'Wikipedia: Dahi (curd)', url: 'https://en.wikipedia.org/wiki/Dahi_(curd)' },
      { label: 'Wikipedia: Yogurt, how it is made', url: 'https://en.wikipedia.org/wiki/Yogurt' },
    ],
    tags: ['dahi', 'curd', 'yogurt', 'yoghurt', 'bacteria', 'overnight', 'thermometer', 'Indian kitchen', 'warm and cold', 'fair test'],
    note: {
      what: 'You bring milk to the boil and cool it until a thermometer reads 40 to 45 °C, then pour it into two katoris. He adds a teaspoon of starter to each and stirs. One katori sits wrapped up somewhere warm for 6 to 8 hours and then goes into the fridge; the other goes straight into the fridge. In the morning he tilts both to see which has set, and compares the new dahi with a spoon of the starter.',
      expect: 'Boiled milk can take half an hour or more to cool to 45 °C in the pan; standing the pan in a bowl of cold water and stirring makes it much quicker, so bring him to the table for the last few minutes. Stir before you read the thermometer, and if it drops below 40 °C, warm it gently and check again. Start in the early afternoon, so that even the 10-hour limit ends before your own bedtime: you, not he, check the warm katori from 6 hours. Once it holds together when tilted, usually by 8 hours, it goes straight into the fridge; a thin layer of yellowish whey on top is normal. If it has not set by 10 hours after the starter went in, it goes in the bin, however close it looks. In the morning the fridge katori is still runny milk. He may expect the cold one to be thicker, because cold butter and ice are hard. The new dahi is a little sour, much like the starter; a shop starter can give a softer or sharper dahi than Dadi’s.',
      practising: 'Living things at work: bacteria from the spoon of starter feed on the sugar in the milk and turn it into acid, and the acid thickens the milk into dahi. Warmth lets them multiply and work; the fridge slows them almost to a stop. Also a fair test: same milk, same starter, one change.',
      ask: 'When he tilts the fridge katori: “Same milk, same starter. What did the warm one have that this one didn’t?”',
      next: 'Keep a spoonful of the new dahi in the fridge to start the next batch, made the same way with the thermometer, within 3 days; after that, start again from a fresh shop tub. On the next call, ask Dadi how she sets hers and where her warm spot is.',
      honest: 'He sees that warmth matters; he cannot see the bacteria, so “tiny living things did it” is something he takes on trust, not something this shows him. One pair of katoris is one trial. An old starter, or a tub without live cultures, may set neither; then both go in the bin, and the result tells you about the starter, not about warmth.',
      easier: 'Skip the fridge katori: set one katori in the warm spot, and in the morning let him tilt it and compare it with a spoon of the starter.',
      harder: 'Boil 600 ml of milk instead, and stand a third lidded katori of the same cooled milk with no starter beside the warm one, and ask him beforehand which will set. It goes into the fridge with the warm one at your check. In the morning it is usually still runny; whatever it looks like, you pour it away without anyone tasting it and wash the katori in hot soapy water.',
      safety: 'If you have no kitchen thermometer, do not do this activity: a wrist or finger cannot tell you the milk is between 40 and 45 °C, milk that is too hot kills the starter, and milk that is too cool sets slowly, which gives unwanted bacteria time to grow. Only the grown-up brings the milk to the boil, cools it and pours it; he waits at the table, away from the stove, and never handles the hot pan or jug. Keep the pan, the jug and the stove away from the two-year-old too. Use pasteurised milk, and a starter of plain shop-bought live yoghurt or dahi, or your own dahi set this way in the last 3 days. Wash the katoris, lids, spoons and thermometer in hot soapy water and dry them first; he washes his hands before he touches the starter, and the rest of the starter goes back in the fridge as soon as both katoris have theirs. The warm katori stays somewhere warm and steady; you check it from 6 hours, and the moment it holds when tilted, usually by 8 hours, it goes straight into the fridge. If it has not set by 10 hours after the starter went in, or it smells off, or looks pink, slimy or fuzzy, the whole katori goes in the bin: no more time somewhere warm, no rescue, and nobody tastes a doubtful batch to check. Smell and looks can only send a batch to the bin; they never clear it to eat. Eat only a batch that set within the time and was then chilled, and finish it within 3 days. Pour away the fridge katori once he has tilted it. If the oven is the warm spot, it stays switched off with only its light on, the towel stays out of it, and tell everyone in the house so nobody turns it on. Check for a dairy allergy first.',
    },
  },
];
