import type { Activity } from '../types';

/**
 * Push, Fall and Balance: where a thing's balancing point sits, what sets the
 * rhythm of a swing, and where a lever's pivot goes. Each one ends in a mark or
 * a count he can see, not an explanation he has to take on trust.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'find-the-balance-point',
    area: 'forces',
    title: 'Find the Balancing Point with Two Fingers',
    hook: 'Slide two fingers under a ruler. Where will they meet?',
    where: 'table',
    minutes: 15,
    need: [
      'a 30 cm ruler, wooden or stiff plastic, with square edges',
      'a lump of play-dough about the size of a walnut',
      'a long-handled indoor broom, with its head on',
      'a roll of masking tape',
    ],
    steps: [
      {
        text: 'Hold your arms out. Rest the ruler across your two pointing fingers, one near each end.',
        art: 'Beside the dining table, Arjun stands with both arms stretched straight out in front of him at chest height, each hand curled with only the pointing finger stretched out flat and level, and a 30 cm wooden ruler lies flat on top of those two pointing fingers, his left finger under the ruler’s left end and his right finger under its right end; Papa kneels beside him holding a roll of masking tape in both hands, watching the level ruler.',
      },
      {
        text: 'Slide your fingers slowly towards each other. Watch which finger moves, then which.',
        art: 'Arjun slides his two pointing fingers inwards under the wooden ruler, seen close at his chest height: his left finger stays still while his right finger glides in towards it, and Papa leans in on one knee with his chin on his hand, watching the fingers take turns.',
      },
      {
        text: 'When your fingers meet, the ruler balances just above them. The grown-up tapes that spot. Can one finger hold it there?',
        art: 'Arjun holds the wooden ruler balanced on one pointing finger placed under its middle, his other hand open beside it, while Papa presses a short strip of masking tape across the top of the ruler just above that finger.',
      },
      {
        text: 'The grown-up presses play-dough on one end. Stick a strip of tape where you think your fingers will meet.',
        art: 'At the dining table, a 30 cm wooden ruler lies flat with one strip of masking tape across its middle; Papa, with both hands, squeezes a single walnut-sized lump of red play-dough onto the right-hand end of the ruler, while Arjun presses a second strip of masking tape onto the ruler with his thumb, halfway between the middle strip and the play-dough. There is only one lump of play-dough in the picture.',
      },
      {
        text: 'Slide your fingers in again. Did they meet at your tape, or somewhere else?',
        art: 'Arjun holds a 30 cm wooden ruler level on his two pointing fingers, which touch side by side under the ruler about a quarter of its length in from the end that has a lump of red play-dough stuck on it, so the long bare end sticks far out on the other side; a strip of masking tape marks the ruler’s middle, and Papa’s pointing finger runs along the ruler from that middle strip towards where Arjun’s fingers have met, nearer the play-dough.',
      },
      {
        text: 'Now the broom. One finger just above its head, the other far up the handle. Guess, then slide.',
        art: 'In a clear patch of the living-room floor, Arjun stands holding a long-handled broom level at his waist, the broom resting only on top of his two stretched-out pointing fingers, his other fingers curled into his palms and not gripping: one finger under the handle just above the bristly head, the other under the handle far up towards its end; Papa kneels beside him with one open palm held a little below the middle of the handle, ready to catch it.',
      },
    ],
    notice: 'The fingers take turns sliding and always meet under the spot where the ruler balances. Play-dough on one end moves that spot towards the play-dough, and the broom balances near its heavy head.',
    ask: 'Your fingers met in the middle last time. Why did they meet nearer the play-dough now?',
    pairsWith: 'keep-it-balanced',
    trial: 'Slide your own fingers under the ruler and the broom first. A round, varnished handle can roll, and a sticky finger grabs instead of sliding, so dry hands and a square-edged ruler work best. Check the play-dough stays on when the ruler tilts. If your broom balances inside its head rather than on the handle, use a bare broom handle with a fist-sized lump of play-dough taped near one end instead.',
    sources: [
      { label: 'Exploratorium Science Snacks: Center of Gravity, two fingers sliding under a long stick with clay on it (here a ruler, then a broom)', url: 'https://www.exploratorium.edu/snacks/center-gravity' },
      { label: 'Exploratorium Science Snacks: Balancing Stick, a dowel balanced upright with clay at the top or bottom (the follow-up here)', url: 'https://www.exploratorium.edu/snacks/balancing-stick' },
    ],
    tags: ['rainy day', 'no mess', 'quick', 'balance', 'centre of gravity', 'broom', 'ruler'],
    note: {
      what: 'He rests a ruler across his two pointing fingers and slides them together; they meet under the balancing point. A lump of play-dough on one end moves that point, a broom with its heavy head shows the same thing, and he marks his guess with tape before each try.',
      expect: 'The fingers rarely move together: one slides, stops, and the other takes over. That is the part worth watching. He may slide only one finger or push the ruler along, so ask for both, slowly. With the play-dough on, he may still guess the middle, or right under the lump.',
      practising: 'The centre of gravity, or balancing point: the one place where a thing can rest on a single support without tipping. Adding weight to one end moves that point towards it. Also making a guess, marking it, and checking it.',
      ask: 'After the play-dough run, pointing first at the middle strip of tape and then at where his fingers met: “Last time your fingers met here. Why did they meet over here now?”',
      next: 'Press a fist-sized lump of play-dough round an empty wrapping-paper tube, a hand’s length from one end, and tape over it. Let him balance the tube upright on his flat palm, lump at the top and then at the bottom, and ask which way stays up longer. Lump at the top usually wins: it tips more slowly, so his hand has time to catch up. Then play Keep It Balanced.',
      honest: 'The fingers find the balancing point; he does not. Meeting under it every time does not show he could point to it on a new object. Why the fingers take turns (the finger nearer the balancing point carries more of the weight, so it grips while the other slides) is more than he needs now. A sticky finger or a rolling handle can spoil a run; just try again.',
      easier: 'Use only the bare ruler, and start his fingers in different places each time, so he sees they still meet in the middle.',
      harder: 'Press a second, smaller lump on the other end and ask him to tape his guess before he slides. Or let him move the lump himself and tell you where the fingers will meet.',
      safety: 'Hold the broom level and low, in clear floor space away from lamps, glass and faces, and keep the two-year-old out of reach of its ends. Keep play-dough out of her mouth; home-made dough is very salty. For the upright tube, clear a space around him and let it fall rather than grab at it.',
    },
  },
  {
    id: 'long-swing-short-swing',
    area: 'forces',
    title: 'Which Swings Faster, Long or Short?',
    hook: 'Two rice socks on two strings. Count the swings in ten seconds.',
    where: 'table',
    places: ['garden'],
    minutes: 20,
    need: [
      'two dining chairs set back to back, about 90 cm apart, and a long-handled broom to lay across them',
      'masking tape',
      'about 2 m of string or garden twine, and a tape measure',
      'two old socks',
      'three small zip-lock bags, each holding about half a cup of rice (100 g), sealed and taped shut',
      'a phone stopwatch, or a clock with a second hand',
      'a pencil and a notepad',
    ],
    steps: [
      {
        text: 'The grown-up tapes the broom across two chair backs and ties on two strings. You push a rice bag into each sock.',
        art: 'Mummy knots a long string around a broom handle taped across the backs of two dining chairs, a shorter string already hanging beside it, while Arjun kneels on the floor below, pushing a small zip-lock bag of rice down into the toe of an old striped sock.',
      },
      {
        text: 'The grown-up hangs the socks, rice 70 cm and 25 cm below. Pull both back a hand’s width; let go together.',
        art: 'Under a broom handle taped across the backs of two dining chairs hang two old socks filled with rice, one on a long string and one on a much shorter string, both strings tied to the handle; Arjun holds the long-string sock in one hand and Mummy holds the short-string sock in one hand, each pulling their sock a little to the side so both strings slant, both just opening their fingers to let go together.',
      },
      {
        text: 'Swing only the long sock. The grown-up times ten seconds; count each time it comes back to you.',
        art: 'Arjun sits cross-legged on the floor a step back from two dining chairs and counts out loud, both hands resting on his knees, as an old sock filled with rice on a long string swings towards him from a broom handle taped across the chair backs; beside it a second rice sock on a much shorter string, about a third as long, hangs still; Mummy kneels next to Arjun holding a phone in one hand, looking at its stopwatch.',
      },
      {
        text: 'Now swing only the short sock and count the same way. Which one made more swings?',
        art: 'Arjun sits on the floor a step back from two dining chairs and counts out loud, watching an old sock filled with rice on a short string swing quickly back and forth under a broom handle taped across the chair backs, while a second rice sock on a much longer string hangs still beside it; Mummy kneels next to him, holding a phone stopwatch in one hand and pencilling tally marks on a notepad on her knee with the other.',
      },
      {
        text: 'Guess: will a heavier sock swing faster? Add a second rice bag; the grown-up rehangs it at 70 cm. Count again.',
        art: 'Mummy kneels under a broom handle taped across two dining chairs, holding open the top of an ordinary old sock with both hands, its string untied and dangling from the handle above; one small zip-lock bag of rice already sits in the toe of the sock, and Arjun pushes a second small zip-lock bag of rice down into it with one hand; a second sock of the same size hangs still on a short string beside them.',
      },
      {
        text: 'Compare the counts. Then the grown-up unties both strings and puts the string, socks and bags away.',
        art: 'Mummy unties a string from the broom handle across the two chair backs and winds it into a loop around her fingers, while Arjun drops the two rice socks into a cloth shopping bag hanging from one chair’s back.',
      },
    ],
    notice: 'The short string swings faster: more swings in the same ten seconds. With a second bag of rice inside, the long sock makes about the same number of swings as before.',
    ask: 'Which made the bigger difference: a shorter string or more rice?',
    pairsWith: 'which-one-lands-first',
    trial: 'Set it up and count both strings alone first. With the middle of the rice about 70 cm below the handle on the long string and about 25 cm on the short one, expect roughly six and ten swings in ten seconds. If your two counts are close, shorten the short string. Tie the string round each sock just above the rice, with a bow, so you can open it for the second bag and rehang it with the middle of the rice back at 70 cm. Check the broom cannot roll and both socks clear the floor and the chair legs.',
    sources: [
      { label: 'Science Buddies: Swing Low, timing a 70 cm and a 35 cm pendulum hung across two chairs (here rice socks, swings counted)', url: 'https://www.sciencebuddies.org/stem-activities/swing-low-investigate-the-motion-of-a-pendulum' },
      { label: 'Exploratorium Science Snacks: Resonant Pendulum, noting that every pendulum, a playground swing too, has its own natural rhythm', url: 'https://www.exploratorium.edu/snacks/resonant-pendulum' },
    ],
    tags: ['rainy day', 'pendulum', 'swing', 'counting', 'timing', 'indoors', 'fair test'],
    note: {
      what: 'You hang two rice-filled socks from a broom handle, one on a long string and one on a short one. He counts how many times each swings in ten seconds, then counts the long one again with a second bag of rice inside.',
      expect: 'With the middle of the rice about 70 cm and 25 cm below the handle, expect roughly six and ten swings. His counts may be off by one or two; the gap still shows. He may expect the heavier sock to swing faster, or slower. It hardly changes, and he may want to try it twice before he believes it.',
      practising: 'The period of a pendulum: the time one swing takes depends on the length of the string and hardly at all on the weight at the end, as long as the swing is small. Also counting at a steady pace against a fixed time, and a fair test with one change.',
      ask: 'Before the second rice bag goes in: “This will make it heavier. Will it swing faster, slower or the same?” Write his guess on the notepad beside the tallies.',
      next: 'At the park, give him one gentle push on a swing, let him sit still, and count his swings in ten seconds together. Ask whether a swing with longer chains would go faster or slower. Then play Which One Lands First?, where a heavy ball and a light one land together.',
      honest: 'Two counts on one afternoon show that length matters; they do not show he knows why, and nobody expects him to. Ten-second counts are rough: a difference of one swing is within counting error, not a sign that weight matters. That is also why the heavy sock is rehung at the same 70 cm; a sock hanging lower swings more slowly, and he would read that as weight. A big swing, a push instead of a let-go, or a twisting sock can spoil a count, so repeat any surprise.',
      easier: 'Skip the counting. Let both socks go together three times and just watch which one gets ahead.',
      harder: 'Ask him to choose a string length he thinks will make about eight swings in ten seconds. You tie it at his length; he tests it.',
      safety: 'Tape the broom handle to both chair backs so it cannot roll, and nobody leans on or climbs the chairs. The rice socks are soft, but have him sit or stand a step back from where they swing. Keep the two-year-old out of the room or with another adult while it is set up: string is a strangling risk and zip-lock bags a suffocation risk for her. Untie both strings and put away the string, socks and bags as soon as you finish; never leave it standing.',
    },
  },
  {
    id: 'lift-it-with-a-ruler',
    area: 'forces',
    title: 'Lift It with a Ruler',
    hook: 'Same soap, same ruler. Move the pencil and count the pennies again.',
    where: 'table',
    places: ['kitchen'],
    minutes: 25,
    need: [
      'a stiff 30 cm wooden ruler',
      'a pencil with flat sides, and masking tape',
      'a bar of soap still in its wrapper, about 100 g',
      'the plastic lid of a dahi or yoghurt tub, about 10 cm across',
      'about 60 pennies in a plastic screw-top jar',
      'a small steel bowl',
      'a second pencil and a notepad, for tallies',
    ],
    steps: [
      {
        text: 'Count sixty pennies from the jar into the bowl. The grown-up tapes the soap and the tub lid to the ruler’s ends.',
        art: 'At the kitchen table, Papa presses a strip of masking tape over a wrapped bar of soap lying right at one end of a 30 cm wooden ruler; at the ruler’s other end a flat round plastic tub lid is already taped on rim-side up, like a shallow dish; Arjun holds a plastic jar of pennies in one hand and drops pennies one at a time into a small steel bowl with the other.',
      },
      {
        text: 'Tape a pencil flat on the table. Lay the ruler across it, with the pencil under the middle.',
        art: 'Arjun lays a 30 cm wooden ruler, with a wrapped bar of soap taped on one end and a flat round tub lid taped rim-up on the other end, on top of a pencil that is taped flat to the kitchen table, so the pencil lies under the middle of the ruler like the pivot of a see-saw; the soap end rests down on the table and the lid end tilts up just off the table, while Papa smooths a strip of masking tape over one end of the pencil with his thumb.',
      },
      {
        text: 'Put pennies in the lid one at a time, counting out loud. Stop when the lid end tips down.',
        art: 'Arjun drops one more copper penny into a flat round tub lid taped to one end of a wooden ruler; the lid holds a big heap of pennies and its end of the ruler has tipped down onto the kitchen table, while the wrapped bar of soap taped on the other end has lifted just off the table, the ruler resting across a pencil taped flat under its middle; Papa sits beside him making pencil tally marks on a notepad. The soap wrapper is plain white with no writing.',
      },
      {
        text: 'Tip the pennies back. Slide the ruler till the pencil sits close to the soap. More pennies now, or fewer?',
        art: 'Arjun slides a wooden ruler along over a pencil taped flat to the kitchen table until the pencil lies under the ruler right next to the wrapped bar of soap taped on its near end; the empty flat round tub lid taped on the ruler’s far end now reaches a long way out, while Papa sets down a small steel bowl heaped with pennies beside them.',
      },
      {
        text: 'Count pennies into the lid again until it tips down. Which time needed fewer?',
        art: 'Arjun drops a few copper pennies into a flat round tub lid taped to the far end of a long wooden ruler, and that long lid end has tipped down to the kitchen table, lifting the wrapped bar of soap taped on the short near end a little off the table; a pencil taped flat to the table lies under the ruler right beside the soap; Arjun’s other hand rests on the table, not touching the ruler; Papa holds up a notepad beside him showing a long row of tally marks above a much shorter row.',
      },
      {
        text: 'Count every penny back into the jar. Are all sixty there? Then screw the lid on.',
        art: 'Arjun counts pennies one at a time from the small steel bowl back into the plastic screw-top jar on the kitchen table, while Papa holds the jar’s lid ready in one hand and peels the masking tape off the ruler with the other.',
      },
    ],
    notice: 'With the pencil under the middle, it takes a big pile of pennies to lift the soap. With the pencil close to the soap, only a few pennies lift it.',
    ask: 'Same soap, same ruler. Why did fewer pennies lift it this time?',
    pairsWith: 'keep-it-balanced',
    trial: 'Count both positions alone first with your own soap and ruler. If the middle position needs more pennies than you have, start with the pencil a little nearer the soap. If the lid end drops near the soap with no pennies at all, slide the ruler back a little towards the middle. Tape the soap firmly so it cannot slide off as it lifts, and use a stiff ruler: a bendy plastic one sags instead of tipping.',
    sources: [
      { label: 'Science Buddies: Give It a Lift with a Lever, pennies in a bag over the table edge lift a bar of soap (here a lid on the table)', url: 'https://www.sciencebuddies.org/stem-activities/give-it-a-lift-with-a-lever' },
    ],
    tags: ['rainy day', 'lever', 'see-saw', 'counting', 'pennies', 'fair test', 'simple machines'],
    note: {
      what: 'A ruler rests on a pencil like a see-saw, with a bar of soap taped to one end and a tub lid on the other. He counts pennies into the lid until the soap lifts, then slides the ruler so the pencil sits close to the soap and counts again.',
      expect: 'With a 100 g bar the middle position may take around forty pennies and the near position fewer than ten; yours will differ. He may expect the same count, because it is the same soap. He may drop pennies on the ruler instead of in the lid; those count for less, so gather them into the lid.',
      practising: 'A lever: a stiff bar turning on a pivot. The nearer the pivot sits to the load, the farther the other end reaches, and the less weight it takes there to lift the load. Unlike the coat-hanger balance, where both sides sit the same distance from the middle, here the pivot moves. Also counting to a few dozen and comparing two counts.',
      ask: 'Before he counts the second time, with the pencil close to the soap: “More pennies this time, fewer, or the same?” Write his guess beside the first tally.',
      next: 'At a park see-saw, he sits on one seat and you sit on the beam as close to the middle as it allows, feet on the ground: can he lift you? Use your feet to keep every move slow, and never get off while his end is up. Then play Keep It Balanced.',
      honest: 'Two counts show that where the pivot sits matters. They do not show he could predict a third position, and the rule behind it (weight times distance) is years away. Moving the pencil changes three things at once: the soap gets nearer it, the lid gets farther, and more of the ruler’s own weight ends up on the lid side. So the count always drops as the pencil moves towards the soap, but not in any neat proportion.',
      easier: 'Do the near position first, where a handful of pennies works, then put the pencil under the middle and let him see how big the pile has to get.',
      harder: 'Try a third place, halfway between the two, and ask him to guess the count before he starts: will it fall between the other two?',
      safety: 'Pennies are a choking hazard for the two-year-old: do this while she is with another adult or in another room, count them out of a closed plastic jar and back in, and check the floor and chairs afterwards. Keep the soap in its wrapper, and wash hands after handling coins.',
    },
  },
];
