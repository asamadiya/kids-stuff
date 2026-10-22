import type { Activity } from '../types';

/**
 * Mix, Change and Grow: kitchen changes he can see and handle. Cream splits into butter, turmeric
 * shows what is in the water, cornflour will not stay sorted, and milk sets into curd.
 * Food made here is food only; the colour test is never tasted.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'shake-cream-into-butter',
    area: 'kitchen',
    title: 'Shake Cream into Butter',
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
      'a slice of toast or a warm plain dosa, and a pinch of salt if you like',
    ],
    steps: [
      {
        text: 'Pour the cream into the jar until it is a third full. The grown-up screws the lid on tight.',
        art: 'Standing on the kitchen floor at the low kitchen table, Arjun tips a plain white carton of thick cream into a clear plastic jar until it is about a third full, while Amma holds the jar steady with one hand and the screw lid in the other; a sieve and two bowls wait beside them, and the carton is plain white.',
      },
      {
        text: 'Take turns shaking hard: twenty shakes each. Draw a tally mark after every turn.',
        art: 'At the kitchen table, Arjun shakes the lidded plastic jar of cream up and down hard with both hands, cheeks puffed out, while Amma, sitting beside him, draws one more pencilled tally mark on a scrap of paper that already has a row of them.',
      },
      {
        text: 'When it goes quiet, stop and look inside. Is it thick, like whipped cream?',
        art: 'At the kitchen table, Amma has unscrewed the lid and tilts the clear plastic jar towards Arjun, showing smooth thick white whipped cream clinging to its sides; Arjun stands on the floor beside the table and peers in with his nose near the rim, holding the lid in one hand.',
      },
      {
        text: 'Lid back on. Keep shaking until it suddenly sloshes and a lump knocks inside.',
        art: 'Arjun sits on a wooden chair at the kitchen table and shakes, with both hands, a light, thin-walled clear plastic jar with soft rounded shoulders and a wide white plastic screw lid, eyes wide; through its sides one rough pale-yellow lump of butter swirls in thin, milky-white liquid, the lid screwed tight and the outside of the jar dry. Amma sits on a chair beside him with one hand cupped behind her ear, listening to the slosh.',
      },
      {
        text: 'Pour it through the sieve. The lump is butter; the thin liquid is buttermilk.',
        art: 'At the low kitchen table, Amma holds a small sieve over a bowl while Arjun, standing on the floor, tips the clear plastic jar into it with both hands; one pale-yellow lump of butter stays in the sieve as thin, bluish-white buttermilk runs into the bowl below.',
      },
      {
        text: 'Press the lump in cold water, changing the water until it stays clear. Spread a little on toast.',
        art: 'Arjun squeezes a pale yellow lump of butter between his clean fingers in a bowl of cold water that is clouding white, while Amma stands beside him at the counter holding a slice of warm toast on a steel plate, ready for the first taste.',
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
    tags: ['butter', 'vennai', 'venna', 'cream', 'buttermilk', 'Krishna', 'Gokulashtami', 'Krishnashtami', 'Janmashtami', 'rainy day', 'cooking', 'no oven'],
    noPair: 'None: butter coming out of cream has to be felt in the jar, not watched on a screen.',
    note: {
      what: 'He takes turns with you shaking cream in a sealed plastic jar, keeping count with tally marks, until it thickens to whipped cream and then splits into a lump of butter and a thin buttermilk. He rinses the butter and eats a little on toast.',
      expect: 'Expect 5 to 20 minutes of shaking, depending on the cream and how cold it is; cream straight from the fridge is slowest. His arms will tire before the butter comes, so share the turns. The whipped stage goes quiet and feels like the end; the butter arrives suddenly after it, with a slosh and a knock against the jar.',
      practising: 'A change in a material: shaking makes the tiny drops of fat in cream bump and stick together until they gather into a solid lump, and the watery part runs free. One mixture separates into two different things. Also keeping count of turns with tally marks.',
      ask: 'When the slosh comes back: “We only put cream in. Where did the butter come from?” Any answer is fine; the point is that he looks at what changed.',
      next: 'Tell him the story of little Krishna, Vennai Thirudan, the butter thief, who climbed with his friends to reach the butter pots hung out of his reach and was caught with butter on his face, and tell it again at Gokulashtami. On the next video call, ask Paati how butter was churned from curd with a wooden mathu, a churning stick, when she was small.',
      honest: 'This shows that shaking turned cream into two different things; it does not show that he understands fat drops, and “I shook it so it turned into butter” is a good place for him to stop. The liquid is sweet buttermilk, a cousin of mor, the sour buttermilk left when curd is churned, not the same thing.',
      easier: 'You do most of the shaking and he takes the last turns, when the lump arrives, then pours it through the sieve.',
      harder: 'Shake two small jars, one with cream straight from the fridge and one left out for half an hour. You each shake one jar, then swap every turn so both get the same shaking, and count the turns each one takes.',
      safety: 'Use a food-safe plastic jar, not glass, and check the lid before he shakes. Use pasteurised cream within its date; if it smells sour when you open it, throw it away untasted. Keep it out of the fridge for no more than two hours in all, and keep this jar and its bowls for food only, never for experiments. He washes his hands before he touches the butter. Refrigerate the butter in a covered dish at once and eat it within a day or two; keep the buttermilk in the fridge and drink it the same day, or throw it away. Check for a dairy allergy first; the two-year-old can taste a little butter on toast if she already has dairy.',
    },
  },
  {
    id: 'haldi-turns-red',
    area: 'kitchen',
    title: 'Turmeric Water That Turns Orange-Red',
    hook: 'It looks like plain water. Turmeric can tell it is not.',
    where: 'kitchen',
    places: ['table'],
    minutes: 20,
    need: [
      'a quarter teaspoon of ground turmeric',
      'a small jug with about 300 ml of water, and a spoon to stir',
      'baking-soda water the grown-up mixed and tested beforehand: half a level teaspoon of baking soda stirred into 150 ml water, in a plastic cup',
      '4 tablespoons of lemon juice (one or two lemons) in a small bowl',
      'three clear plastic cups, the same size',
      'a teaspoon for the lemon juice',
      'an old tray, a sheet of white paper, and old clothes (turmeric stains)',
    ],
    steps: [
      {
        text: 'Stir a quarter teaspoon of turmeric into the jug of water. Pour it into the three cups, a finger deep.',
        art: 'At the kitchen counter, on an old tray lined with white paper, Arjun pours bright yellow turmeric water from a small jug into the last of three clear plastic cups standing in a row, the other two already yellow, while Nanna holds the stirring spoon in one hand and steadies the row of cups with the other.',
      },
      {
        text: 'The grown-up’s clear water has something hidden in it. Guess: will it change the yellow?',
        art: 'Nanna holds up a plastic cup of clear baking-soda water at eye level, looking just like tap water, while Arjun leans over the paper-lined tray of three cups of yellow turmeric water, chin in one hand, deciding on his guess.',
      },
      {
        text: 'Pour the clear water into the first cup until it is twice as deep. Stir and watch.',
        art: 'Arjun holds a small clear plastic cup of clear, colourless water in both hands and pours it into the first of three same-size clear cups of yellow turmeric water on the paper-lined tray, while Nanna’s hand steadies that cup from below; orange-red swirls spread through the yellow as they both watch, and the other two cups stay yellow.',
      },
      {
        text: 'Spoon two teaspoons of lemon juice into the second cup. Leave the third cup plain, to compare.',
        art: 'Kneeling on the floor beside the white paper, Arjun tips a teaspoon of pale, almost colourless lemon juice into the middle cup of three clear plastic cups, the tip of the spoon right over that cup’s rim; his other hand holds a small steel bowl of lemon juice with half a cut lemon in it. The left cup is orange-red, and the middle and right cups are yellow. Nanna sits on the floor beside him with both hands resting on his knees and watches the middle cup.',
      },
      {
        text: 'Now add lemon juice to the red cup, one spoon at a time. Watch it fizz and change.',
        art: 'Arjun drips a teaspoon of lemon juice into a clear plastic cup of orange-red turmeric water on white paper; small bubbles fizz and the top of the water turns back to yellow while the bottom stays orange-red, and Nanna crouches beside the counter with his eyes level with the cup.',
      },
      {
        text: 'Line up all three cups on the white paper. Which ones match the plain cup now?',
        art: 'On the white paper in the tray on the kitchen table, Arjun, standing on the floor, runs one finger along three clear plastic cups of yellow turmeric water: a left cup, a middle cup and a right cup, with a hand’s width of white paper between each one. Nanna crouches beside the table with his eyes level with the cups and both hands resting on the table edge, and looks along the cups with him.',
      },
    ],
    notice: 'The baking-soda water turns the yellow turmeric orange-red within seconds. Lemon juice keeps it yellow, and a few spoons of lemon fizz and turn the red cup back to yellow.',
    ask: 'It looked like plain water. How did the turmeric know it wasn’t?',
    trial: 'Run all three cups alone first, against white paper. The baking-soda cup should go clearly orange-red within seconds; if it only looks a deeper yellow, make the jug paler with less turmeric, so the change shows against the white paper; more baking soda will not make it redder. Then count how many spoons of lemon turn it back and keep it yellow for five minutes, so you have enough juice.',
    sources: [
      { label: 'Wikipedia: Turmeric, the Indicator section', url: 'https://en.wikipedia.org/wiki/Turmeric' },
    ],
    tags: ['turmeric', 'pasupu', 'manjal', 'haldi', 'colour change', 'acid', 'baking soda', 'lemon', 'kitchen science', 'rainy day'],
    noPair: 'None: colour that changes with what you mix in is a real-materials idea; a picture of it would only be a picture.',
    note: {
      what: 'He stirs turmeric into water, then adds a clear baking-soda water you made and tested earlier to one cup and lemon juice to another, and keeps a third cup plain to compare. Lemon juice then turns the red cup back.',
      expect: 'Turmeric does not dissolve; it hangs in the water and slowly settles, so stir the jug before each pour. The baking-soda cup goes orange-red or red-brown in a few seconds rather than bright red; it shows best against white paper. Lemon in the second cup changes almost nothing, which can disappoint him; that is the result. Lemon in the red cup fizzes and usually takes two to four spoons before it turns yellow again. If some orange creeps back as the fizz dies down, add one more spoon.',
      practising: 'An indicator: something whose colour shows what you cannot see in the water. Turmeric stays yellow in plain water and in acids such as lemon juice, and turns orange-red in alkaline water such as baking-soda water; enough acid undoes it. Also using a test, not looks, to tell apart two things that seem the same.',
      ask: 'When the first cup turns: “It looked like plain water. How did the turmeric know?” Let him answer in his own words; “the turmeric can tell” is a fine answer. Nanna can ask it in Telugu: “Pasupuki ela telisindi?” (How did the turmeric know?)',
      next: 'Tell him that kumkuma, the red powder Nanamma wears as a dot on her forehead, was traditionally made by mixing turmeric with sunnam (slaked lime, not the fruit), which is alkaline like the baking soda. Sunnam burns skin and eyes, so that one stays a story, not an experiment. When there is lemon rice at lunch, ask him why its turmeric stays yellow with all that lemon in it.',
      honest: 'One set of cups shows that turmeric changes colour; it does not show he understands acids and alkalis, and the words can wait. The lemon cup staying yellow tells him less than it seems, because plain water keeps turmeric yellow too. The fizz is the lemon using up the baking soda, which is why the yellow comes back; he only needs to see that both happen together.',
      easier: 'Use only two cups: plain turmeric water and the baking-soda cup. Let him watch the colour come and then bring it back with lemon.',
      harder: 'Fill two cups of clear water yourself, stirring baking soda into one, and do not say which. He adds a spoon of turmeric water to each and finds out which is which.',
      safety: 'You make, test and keep the baking-soda water on your side of the tray. Use no soap, detergent or cleaner: they vary, and he should never learn to pour cleaners into a cup. Nothing from these cups is tasted, and the cups and spoons are washed before any food use. Lemon stings eyes and cuts, so no rubbing eyes and wash hands after. Turmeric stains clothes, skin and counters. Keep every cup out of the two-year-old’s reach, and pour it all away with plenty of water when you finish.',
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
        art: 'At the table on the back patio, with the lemon tree and the wooden fence behind them, Arjun, standing on the paving, stirs white cornflour with his bare hand in a wide steel bowl while Nanna pours a thin stream of water into it from a small steel jug; the bowl sits on a large steel baking tray lined with a sheet of plain brown paper.',
      },
      {
        text: 'Stop adding water when stirring fast feels stiff and stirring slowly feels runny.',
        art: 'Arjun drags a spoon fast through the thick white cornflour mixture and it cracks open and resists, his face screwed up with effort, while Nanna holds the half-empty water jug back at his side and watches across the patio table.',
      },
      {
        text: 'Push one finger in very slowly. Then tap the top fast with your fingertips. What changed?',
        art: 'Arjun’s pointing finger sinks slowly, knuckle-deep, into the smooth white cornflour mixture in the steel bowl, while Nanna leans across the patio table with his own hand raised, fingertips together, ready to show a quick tap.',
      },
      {
        text: 'Scoop up a handful and squeeze it hard into a ball. Now open your hand and watch.',
        art: 'Seen from across the patio table, Arjun stands on the paving on the far side of the table, the table top at his waist so only his upper body shows above it. He holds his open palm over the steel bowl on the baking tray, and the white ball of cornflour he has just squeezed melts into a runny drip between his fingers. Nanna sits on a chair beside him and cups both his hands under Arjun’s hand to catch the drips.',
      },
      {
        text: 'Decide together: is it a solid, a liquid, or something in between? Each give one reason.',
        art: 'Arjun, his hands white with cornflour, holds one hand up flat and stiff and wiggles the other like running water, while Nanna sits across the patio table with his chin on his fist, listening; the bowl of white mixture sits between them on the tray.',
      },
      {
        text: 'Leave the leftovers to dry. Scrape them into the bin, never down the sink.',
        art: 'Arjun scrapes a crumbly white crust of dried cornflour off the baking tray into a kitchen bin with a plastic spatula, while Nanna holds the bin steady with one hand and folds up the newspaper with the other.',
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
    noPair: 'None: whether it is a solid or a liquid is something only his hands can tell him.',
    note: {
      what: 'He mixes cornflour with water in a bowl on a tray, pushes a finger in slowly and then taps fast, squeezes a handful into a ball and opens his hand, then decides with you whether it is a solid or a liquid.',
      expect: 'Expect white hands and forearms, and some drips past the tray; dry cornflour brushes off. The squeezed ball melting through his fingers is usually the moment that holds him, and he will want to repeat it many times. Many children say “both”, or change their answer each time; ask for the reason rather than settling it.',
      practising: 'Sorting materials by how they behave: a solid keeps its own shape, a liquid flows and takes the shape of its container. This mixture does each, depending on how hard and fast it is pushed, so the line between the two groups is not sharp. Also backing a claim with a reason.',
      ask: 'After the ball melts: “Was that a solid or a liquid?” Whatever he says, the useful part is his reason, so let him give it in his own words. Nanna can ask it in Telugu: “Gattiga unda, neellala unda?” (Is it hard, or is it like water?)',
      next: 'Look round the kitchen for other in-between things: honey, curd, idli batter, ketchup. For each one, ask whether it keeps its shape or flows, and whether it changes if you push it hard.',
      honest: 'There is no single right answer for him to find: the mixture is usually described as a liquid that stiffens when it is pushed suddenly, and either answer with a reason is a good one. Why it stiffens, the grains crowding and locking together, is beyond what he can check; “it goes hard when you hit it” is what he saw.',
      easier: 'Skip the deciding. Let him do the slow finger and the fast tap, and tell you what each one felt like.',
      harder: 'Ask him to keep a ball hard by rolling it between his palms without stopping, then to tell you what happens the moment he stops, and what his hands were doing to keep it hard.',
      safety: 'Never pour it down the sink or toilet: it settles into a hard lump in the pipe. Let leftovers dry on the tray, scrape the crumbs into the bin, and rub dry flakes off hands over the bin before washing. Tap with fingertips, not slaps, so nothing splashes into eyes, and rinse with clean water if it does. Wipe floor spills at once, as wet cornflour is slippery. Cornflour is food, so if he wants his sister to join, she can have her own small bowl at the tray with a grown-up beside her the whole time; keep the water jug out of her reach.',
    },
  },

];
