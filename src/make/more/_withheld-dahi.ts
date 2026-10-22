import type { Activity } from '../types';

/**
 * Withheld (round 2 final review, finding 1, BLOCKER): home fermentation
 * needs a temperature held for hours, and a warm cupboard or an oven light
 * cannot be shown to hold one. Until a food-safety-tested recipe replaces the
 * incubation step, this activity is not published. The leading underscore
 * keeps it out of src/make/activities.ts (see the glob there).
 */
export const MORE: readonly Activity[] = [
  {
    id: 'set-dahi-overnight',
    area: 'kitchen',
    title: 'Warm or Cold: Which Milk Sets into Curd?',
    hook: 'A spoon of curd, two katoris of milk, and one warm corner.',
    where: 'kitchen',
    places: ['table'],
    minutes: 15,
    span: 'Afternoon set, morning check',
    need: [
      'a kitchen thermometer: without one, do not do this activity, because a wrist or finger cannot tell you the milk is at 40 to 45 °C',
      '400 ml pasteurised whole milk, brought to the boil by the grown-up and cooled until the thermometer reads 40 to 45 °C',
      '3 teaspoons of starter, kept in the fridge until needed: plain shop-bought live yoghurt or curd (the label says live cultures) within its date, or curd you set this same way in the last 3 days',
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
        art: 'Amma holds a slim steel kitchen thermometer upright in a small steel pan of milk cooling on the kitchen counter, beside a row of steel tumblers and well away from the switched-off stove, and watches it closely, while Arjun sits on a chair across the room at the kitchen table, waiting, with two empty steel katoris and a teaspoon in front of him.',
      },
      {
        text: 'The grown-up pours the cooled milk into the two katoris. Add one teaspoon of starter to each.',
        art: 'Arjun tips a heaped teaspoon of thick white curd from a small steel katori into the second of two larger steel katoris of milk on the kitchen table, the first already holding its spoonful, while Amma stands beside him holding the small steel jug she has just poured the milk from.',
      },
      {
        text: 'Stir each katori gently, ten times round. Put the lids on.',
        art: 'Arjun stirs a steel katori of milk slowly round with a teaspoon, his other hand holding the katori still on the kitchen table, while Amma presses a steel lid onto the second katori beside it.',
      },
      {
        text: 'Guess which will set. One goes to the warm spot for 6 to 8 hours, the other straight into the fridge.',
        art: 'Arjun holds a lidded steel katori out towards an open fridge shelf, while Amma, beside him, holds the second katori bundled in a thick folded kitchen towel against her chest; they look at each other, each making a guess.',
      },
      {
        text: 'In the morning, take both katoris out of the fridge. Lids off, tilt each slowly. Which one stays put?',
        art: 'At the kitchen table in the morning, Arjun holds one steel katori tipped right over on its side towards the viewer: the thick white curd inside has set firm with a smooth flat top and does not slide at all, and a steel spoon stands upright in it. Beside him Amma holds the second steel katori, from the fridge, tilted a little: it holds thin runny milk that slides to the rim. Both of them stand on the floor.',
      },
      {
        text: 'If it set in time, hold a spoon of starter beside a spoon of new curd. Look, then taste: are they alike?',
        art: 'Arjun holds up a teaspoon of thick white new curd beside a teaspoon of starter curd that Amma holds out, the two spoons side by side as he looks closely from one to the other at the kitchen table, with the set steel katori of new curd and a small steel katori of starter between them.',
      },
    ],
    notice: 'The katori that spent 6 to 8 hours somewhere warm has set into thick, slightly sour curd that holds when tilted. The katori that went straight into the fridge is still runny milk.',
    ask: 'Same milk, same spoon of starter. What did the warm one have that the cold one didn’t?',
    pairsWith: 'what-does-this-seed-need',
    trial: 'First test the warm spot: fill a katori with water at 45 °C, wrap it as you will wrap the curd, and leave it there for an hour. If the thermometer then reads below 35 °C or above 45 °C, use the other spot; if neither holds, do not do this activity. Then set one katori alone the same way, check it from 6 hours, and chill it the moment it holds when tilted. If it has not set by 10 hours, bin it: the spot is too cool or too hot, or the starter has no live cultures. Try the other warm spot or a fresh tub on another day, and do it with him only after a trial has set in time.',
    sources: [
      { label: 'Wikipedia: Dahi (curd)', url: 'https://en.wikipedia.org/wiki/Dahi_(curd)' },
      { label: 'Wikipedia: Yogurt, how it is made', url: 'https://en.wikipedia.org/wiki/Yogurt' },
    ],
    tags: ['curd', 'thayir', 'perugu', 'dahi', 'yogurt', 'yoghurt', 'bacteria', 'overnight', 'thermometer', 'Indian kitchen', 'warm and cold', 'fair test'],
    note: {
      what: 'You bring milk to the boil and cool it until a thermometer reads 40 to 45 °C, then pour it into two katoris. He adds a teaspoon of starter to each and stirs. One katori sits wrapped up somewhere warm for 6 to 8 hours and then goes into the fridge; the other goes straight into the fridge. In the morning he tilts both to see which has set, and compares the new curd with a spoon of the starter.',
      expect: 'Boiled milk can take half an hour or more to cool to 45 °C in the pan; standing the pan in a bowl of cold water and stirring makes it much quicker, so bring him to the table for the last few minutes. Stir before you read the thermometer, and if it drops below 40 °C, warm it gently and check again. Start in the early afternoon, so that even the 10-hour limit ends before your own bedtime: you, not he, check the warm katori from 6 hours. Once it holds together when tilted, usually by 8 hours, it goes straight into the fridge; a thin layer of yellowish whey on top is normal. If it has not set by 10 hours after the starter went in, it goes in the bin, however close it looks. In the morning the fridge katori is still runny milk. He may expect the cold one to be thicker, because cold butter and ice are hard. The new curd is a little sour, much like the starter; a shop starter can give a softer or sharper curd than Paati’s.',
      practising: 'Living things at work: bacteria from the spoon of starter feed on the sugar in the milk and turn it into acid, and the acid thickens the milk into curd. Warmth lets them multiply and work; the fridge slows them almost to a stop. Also a fair test: same milk, same starter, one change.',
      ask: 'When he tilts the fridge katori: “Same milk, same starter. What did the warm one have that this one didn’t?”',
      next: 'Keep a spoonful of the new curd in the fridge to start the next batch, made the same way with the thermometer, within 3 days; after that, start again from a fresh shop tub. Stir the rest of a batch that set in time into rice with a pinch of salt for curd rice at dinner. On the next video call, ask Paati how she sets her thayir, as she calls curd in Tamil, and where her warm spot is; let him tell her where his was.',
      honest: 'He sees that warmth matters; he cannot see the bacteria, so “tiny living things did it” is something he takes on trust, not something this shows him. One pair of katoris is one trial. An old starter, or a tub without live cultures, may set neither; then both go in the bin, and the result tells you about the starter, not about warmth.',
      easier: 'Skip the fridge katori: set one katori in the warm spot, and in the morning let him tilt it and compare it with a spoon of the starter.',
      harder: 'Boil 600 ml of milk instead, and stand a third lidded katori of the same cooled milk with no starter beside the warm one, and ask him beforehand which will set. It goes into the fridge with the warm one at your check. In the morning it is usually still runny; whatever it looks like, you pour it away without anyone tasting it and wash the katori in hot soapy water.',
      safety: 'If you have no kitchen thermometer, do not do this activity: a wrist or finger cannot tell you the milk is between 40 and 45 °C, milk that is too hot kills the starter, and milk that is too cool sets slowly, which gives unwanted bacteria time to grow. Only the grown-up brings the milk to the boil, cools it and pours it; he waits at the table, away from the stove, and never handles the hot pan or jug. Keep the pan, the jug and the stove away from the two-year-old too. Use pasteurised milk, and a starter of plain shop-bought live yoghurt or curd, or your own curd set this way in the last 3 days. Wash the katoris, lids, spoons and thermometer in hot soapy water and dry them first; he washes his hands before he touches the starter, and the rest of the starter goes back in the fridge as soon as both katoris have theirs. The warm katori stays somewhere warm and steady; you check it from 6 hours, and the moment it holds when tilted, usually by 8 hours, it goes straight into the fridge. If it has not set by 10 hours after the starter went in, or it smells off, or looks pink, slimy or fuzzy, the whole katori goes in the bin: no more time somewhere warm, no rescue, and nobody tastes a doubtful batch to check. Smell and looks can only send a batch to the bin; they never clear it to eat. Eat only a batch that set within the time and was then chilled, and finish it within 3 days. Pour away the fridge katori once he has tilted it. If the oven is the warm spot, it stays switched off with only its light on, the towel stays out of it, and tell everyone in the house so nobody turns it on. Check for a dairy allergy first.',
    },
  },
];
