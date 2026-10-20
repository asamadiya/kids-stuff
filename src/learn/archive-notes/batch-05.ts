import type { ArchiveEntry } from './types';

export const ENTRIES: Readonly<Record<string, ArchiveEntry>> = {
  'aryabhata-number-ladder': {
    kind: 'reconstructed',
    note: {
      what: 'Aryabhata, a real astronomer of about 500 CE, builds a table of 24 half-chord numbers so he never has to work the same sum twice, then keeps only the small steps between rungs so anyone can rebuild the table by adding. Later pages add his place-value counting, his idea that the Earth turns, and his value for the circle number.',
      expect: '12 pages, about 9 minutes. He can follow “work it out once, write it down, look it up” and the adding game on page 5; half-chords, and the circle number on page 10, will mostly pass over his head.',
      practising: 'Storing only the differences between numbers and adding them back to rebuild the list, which is a running total; and the boat-and-riverbank picture for why the sky seems to turn while the Earth spins.',
      ask: 'On page 5: “If I give you only the steps, start at 1, add 2, add 3, add 4, which rung do we reach?”',
      next: 'Write a ladder of steps on a strip of paper, such as 2, 3, 1, 4, and have him build each rung by adding its step to the rung below, checking with a stack of blocks. The science game ‘Who’s in the Sunlight?’ shows the turning Earth from page 9.',
      honest: 'The Aryabhatiya (about 499 CE), the 24-step table stored as differences with 225 as its first entry, his use of place value and the boat image for a turning Earth are on record; the rooftop, the lamp, the visiting astronomer and the sliding marks on page 6 are invented, and he actually wrote numbers in a syllable code with no zero sign. Page 10’s “about three and one seventh and more” reads as more than 3 1/7, which is wrong: his value, 62,832 divided by 20,000, is 3.1416, a little less than three and one seventh (about 3.1429), and he himself called it approximate.',
    },
  },
  'sailing-by-a-steady-star': {
    kind: 'reconstructed',
    note: {
      what: 'Pytheas of Massalia sails north, holding his heading by keeping a mark on his mast lined up with the patch of northern stars that barely moves, and by day watches the noon shadow of a stick grow longer the farther north he goes. When a cloud hides the stars he slows down and waits until they return.',
      expect: '12 pages, about 9 minutes. The turning idea, that the mark sliding off the stars means the ship has turned, usually lands with the head-turning cue on page 5; the shadow-stick and Thule pages are harder to hold on to.',
      practising: 'A fixed reference tells you that you have turned: when the landmark slides sideways, you moved, not it. Also that the noon sun sits lower, and shadows are longer, the farther north you go.',
      ask: 'On page 5: “When the mark slid away from the stars, which had moved, the stars or the ship?”',
      next: 'Sit him on a swivel chair facing a lamp, turn him slowly, and have him say when the lamp has slid off his nose. The Make & Do activity ‘What Time Is It, Stick?’ follows a shadow through a day.',
      honest: 'Pytheas, the voyage around 325 BCE, Thule, the “sea lung” often read as slush ice, his remark that the pole was an empty spot beside a few stars, and a shadow-stick reading at Massalia come from later writers quoting his lost book, some of whom called him a liar; the mast mark and the cloud are invented, and how he took his northern readings is not known. Page 4 is wrong to put the northern stars near the very top of the sky: at Marseille the pole is about 43 degrees up, a little under halfway to overhead, and it climbs higher the farther north you sail; today Polaris sits within a degree of the pole, but in his time the nearest bright stars were several degrees away.',
    },
  },
  'the-blue-that-comes-from-leaves': {
    kind: 'reconstructed',
    note: {
      what: 'A Khatri elder in Kutch lifts cloth from an indigo vat while a child watches: it comes out yellow-green and turns blue in the open air, a folded patch stays pale until it is opened out, and each extra dip makes the blue darker.',
      expect: '12 pages, about 9 minutes. The colour change is easy to picture and the folded-patch puzzle on pages 7 and 8 usually lands; “oxygen” on page 6 is a word to hear, not yet to understand.',
      practising: 'A change caused by air, which can only happen where the air reaches; and building a colour up in layers, one dip at a time.',
      ask: 'On page 7: “Why did the folded part stay pale when the rest of the cloth turned blue?”',
      next: 'Cut an apple in half, wrap one half tightly in cling film and leave the other open; after half an hour, compare the two cut faces and talk about where the air could reach.',
      honest: 'The Khatri dyers of Kutch, Ajrakh printing and the vat chemistry are real, and the colour change is told correctly; the elder and the child are invented. Page 6 is not quite right that bits of air join the colour: oxygen takes hydrogen away from the dissolved yellow-green form, leaving blue indigo that no longer dissolves and stays in the fibre; and the cue on page 12 usually has the answer no, because most indigo in jeans today is made in factories.',
    },
  },
  'the-bright-dot-by-the-sunrise-gate': {
    kind: 'reconstructed',
    note: {
      what: 'Nilakantha Somayaji, a Kerala astronomer, watches from a gate facing sunrise and another facing sunset and finds that the two bright planets we call Venus and Mercury are only ever seen low near the Sun, never high in the middle of the night.',
      expect: '12 pages, about 9 minutes, ending in a goodnight. He can hold “they stay near the Sun”; pages 3 and 11 can blur together, since the dawn dot and the dusk dot on page 3 may be one planet while Venus and Mercury on page 11 are two, and either can appear at dawn or at dusk.',
      practising: 'Watching the same spot again and again, using a tree or a roof to fix where; and the pattern that the planets inside Earth’s path are only seen in the evening or before dawn, never at midnight.',
      ask: 'On page 6: “If the bright dot always stays close to the Sun, could we ever see it at midnight?”',
      next: 'In a month when Venus is an evening star (any planet calendar will say), look from the same window just after sunset on three evenings and mark where it sits against a roof or a tree.',
      honest: 'Nilakantha (about 1444 to 1544) and his Sanskrit Tantrasangraha of 1501, with its revised account of Mercury and Venus, are real; the gates, the helper and the cloudy night are invented, although page 1 says “this really happened”, and “closer than we do” on page 6 is the modern picture, since in his model the two planets circle the Sun while the Sun circles the Earth at the centre. Page 11 is wrong that the planets were named long after him: he knew them as Shukra and Budha, and the Roman names Venus and Mercury are older still.',
    },
  },
  'the-clay-tokens-in-the-jar': {
    kind: 'reconstructed',
    note: {
      what: 'A young scribe in Uruk drops one clay token in a jar for each sheep that passes the gate, seals the tokens in a hollow clay ball and presses each one on the outside so the count can be read without breaking it. One mark too many sends her looking, and she finds a lamb asleep by its mother.',
      expect: '12 pages, about 9 minutes. The one-token-per-sheep rule and the missing-lamb check on pages 7 and 8 are well within reach; the leap from marks on a ball to writing on page 10 is a big idea he may only half follow.',
      practising: 'One mark for one thing (one-to-one correspondence, the idea under a tally), and checking a record against the things it stands for instead of changing the record to fit.',
      ask: 'On page 7: “There is one more mark than sheep. Should she rub one mark out, or go and look? Why?”',
      next: 'Hollow out a ball of play dough, drop in one button for each toy car he parks, then press each button on the outside before closing it; the next day, count the dents and check against the cars. The maths game ‘What Did Our Class Choose?’ turns tallies into a chart.',
      honest: 'Clay tokens, the hollow clay balls with token marks pressed on the outside, and Denise Schmandt-Besserat’s work are real; Amat, the jar at the gate and the lamb are invented, though pages 1 and 11 call this a true tale. Her account of tokens leading to writing is widely taught but debated in its details, and on the earliest tablets the number signs were pressed in while most word signs were drawn; the sheep token she identified was a disc marked with a cross rather than a plain disc.',
    },
  },
  'the-dinosaurs-that-grew-feathers': {
    kind: 'documented',
    note: {
      what: 'A tour of the fossil evidence that birds are living dinosaurs: Archaeopteryx with feathers and teeth, fuzzy Sinosauropteryx and four-winged Microraptor from China, hollow bones, dinosaurs sitting on their nests, and three-toed footprints, ending with the sparrow outside the window.',
      expect: '11 pages, about 9 minutes, with no characters, only clues. Children usually grasp “feathers first kept them warm” and love the sparrow ending; that birds ARE dinosaurs, not just descended from them, is the hard part, so expect “but a bird is a bird”.',
      practising: 'Building one conclusion from several separate kinds of evidence (feathers, bones, nests, footprints), and that a feature can begin for one job (warmth) and later serve another (flight).',
      ask: 'On page 9: “Which clue convinces you most that a bird is a dinosaur, the feathers, the bones, the nests or the footprints?”',
      next: 'On a walk, look at a fallen feather without picking it up and find the fluffy down at its base, something like the simple fuzz Sinosauropteryx had; afterwards, the science game ‘A T. rex Beside a Bus’ shows how big the large meat-eating relatives were.',
      honest: 'The fossils, dates and places are right, and birds being a living branch of the dinosaurs is the scientific consensus; feathers are certain in the meat-eating line that birds belong to and debated for a few plant-eaters, the big long-necked dinosaurs of page 1 show scaly skin, and warmth is the leading idea for why feathers began, with display another. Page 6 is wrong that the bones feel light: fossil bones have turned to stone and are heavy, and the hollows are seen in broken or scanned bones.',
    },
  },
  'the-fish-fence-in-the-tide': {
    kind: 'reconstructed',
    note: {
      what: 'A grandmother on the Pacific Northwest coast teaches children to wait while a low curved stone wall does its work: fish swim over it at high tide and are held in the shrinking pool behind it as the tide falls. The people then wade in to gather fish, tend a clam garden and mend the wall.',
      expect: '12 pages, about 9 minutes. The rise and fall of the tide is easy to picture, and the waiting on page 7 is the heart of it; why the wall must sit at just the right height on page 3 is the harder part.',
      practising: 'Working with a regular rhythm instead of against it: the tide rises and falls about twice a day, so a wall at the right height holds water, and whatever is in it, behind it as the sea leaves.',
      ask: 'On page 3: “Why would a wall that is too high, or too low, not work?”',
      next: 'In a baking tray, build a curved wall of Lego bricks near one end, pour in water to cover it, drop a few dried peas over the wall, then tilt the tray slowly so the water drains away and see what stays behind.',
      honest: 'Stone tidal fish traps and clam gardens built by many Coastal First Nations are real, often very old, and still cared for by the descendant nations; the grandmother, the children and the dialogue are invented, and stone walls are hard to date, so the age of any one trap is usually uncertain. Page 1 is wrong that the tide climbs high each morning: there are about two high tides a day, and each comes roughly 50 minutes later than the day before, so high water moves round the clock through the month.',
    },
    withhold: 'The story’s subject is a trap for catching fish, which the people wade in to gather for their families on page 9 (“the fence and the clam garden fed the people”), so fish and shellfish as human food are central to it.',
  },
  'the-great-ship-that-floated': {
    kind: 'reconstructed',
    note: {
      what: 'King Hieron of Syracuse wants the largest ship ever built, and Archimedes works out why a wide hollow hull floats under a heavy load: it pushes water aside, and the water pushes back up. The finished Syracusia carries gardens, a temple and a library, keeps its hull dry with a screw pump, and is given to the king of Egypt.',
      expect: '12 pages, about 9 minutes. The bowl-and-stones test on page 3 and the hand-on-water cue on page 2 make the push-back idea concrete; the screw pump on page 8 is hard to picture from words alone.',
      practising: 'Floating: a boat sinks until the water it has pushed aside weighs as much as the boat, so a wide hollow shape can carry far more than a solid lump of the same material.',
      ask: 'On page 3: “The bowl sank lower with every stone. What would happen if you kept adding stones?”',
      next: 'The Make & Do activity ‘How Many Pennies Sink a Paper Boat?’ loads a pointed paper boat and a wide flat tray made from the same paper; the science game ‘Will This Clay Boat Float?’ follows it on screen.',
      honest: 'The Syracusia, its gardens, temple and library, the screw pump and the gift to Egypt come from one account, Athenaeus quoting Moschion, which names Archias of Corinth as the architect and credits Archimedes with launching the hull and with the screw, so how much of the design was his is uncertain; the bowl test and the dialogue are invented. The grown-ups fact is wrong to call the fish tank freshwater: Athenaeus says it was filled with sea water, with the freshwater cistern beside it.',
    },
  },
  'the-letters-shaped-like-the-mouth': {
    kind: 'reconstructed',
    note: {
      what: 'King Sejong of Korea, wanting reading to belong to everyone, makes letters that picture the mouth: ㄱ shows the back of the tongue raised, ㄴ the tongue tip behind the teeth, ㅁ the closed lips, and three marks for sky, earth and a person make the vowels. A child tries them in a sand tray with a mirror.',
      expect: '12 pages, about 9 minutes. Saying “guh”, “nnn” and “mmm” in front of a mirror is what makes it work, so do the cues on pages 4, 5 and 7; the Korean letters themselves will be new shapes, and the vowel marks on page 8 go by quickly.',
      practising: 'That letters can be designed on purpose so that their shape matches how a sound is made, and the link between a sound, the mouth that makes it and the mark that writes it.',
      ask: 'On page 7: “Close your lips and say ‘mmm’. What shape do your lips make, and which letter looks like that?”',
      next: 'In front of a mirror, say “mmm”, “nnn” and “guh” together, then draw ㅁ, ㄴ and ㄱ with a finger in a tray of salt or rice flour; ask which English letters, if any, look like the mouth that says them.',
      honest: 'The alphabet, made in 1443 and proclaimed in 1446 with the book Hunminjeongeum, and the mouth shapes of its basic letters are on record; the child, the sand tray and the mirror are invented, and the grown-ups fact wrongly says it was proclaimed in 1443. Three things on the pages are wrong or too strong: Sejong called the letters Hunminjeongeum, and the name Hangul dates from the early 1900s (page 2); Chinese and Indian scholars had long sorted sounds by where the mouth makes them, so what was new was drawing the letters from it (page 2); and court scholars opposed the letters and Chinese characters stayed the official script until 1894, so reading spread over centuries, not soon (page 10).',
    },
  },
  'the-loop-you-draw-without-lifting': {
    kind: 'reconstructed',
    note: {
      what: 'A Tamil grandmother taps a grid of rice-flour dots on the doorstep at dawn and guides a child’s finger round them to make a sikku kolam, one line that loops around every dot and comes back to where it began without the hand lifting. An ant eats some flour, a slip leaves a gap that is mended, and the loop closes.',
      expect: '12 pages, about 9 minutes, ending in a goodnight. One line with no loose end is easy to follow with a finger in the air; how the line actually turns round the dots is hard to see from words, so draw a small one beside him as you read.',
      practising: 'A closed path: one continuous line that ends where it began, made by repeating the same turning rule round each dot so the next turn can be predicted.',
      ask: 'On page 8: “Where did the line finish, and how can you tell there is no loose end?”',
      next: 'In a tray of semolina or with chalk on the step, make two dots and draw one figure-of-eight round them, then one line round a row of three, then two rows of three. Drawn the usual weaving way, a square of 2 by 2 dots comes out as two separate loops, which shows why single-line designs take skill; the Make & Do activity ‘Finish the Other Half of the Rangoli’ uses rangoli, a related doorstep art, for mirror symmetry.',
      honest: 'Kolam is a living Tamil tradition, sikku kolam and pulli are the right names, and flour as food for ants is a reason families give, though many now use white stone powder; the grandmother and child are invented. Page 4 is wrong that the line never touches itself: in a sikku kolam the line crosses over itself between the dots again and again, and what it never does is stop or leave an end; not every grid closes into a single loop either, and page 10 is too strong in saying a festival rangoli hides one long thread.',
    },
  },
  'the-oars-that-moved-as-one': {
    kind: 'reconstructed',
    note: {
      what: 'An Athenian trireme with about 170 rowers in three stacked rows moves only when the rowing master and a piper give a beat that every rower can hear. A gust swallows a note, the stroke goes ragged, and the crew rests and finds the beat again.',
      expect: '12 pages, about 9 minutes. The clapping and pushing cues make the shared beat concrete; this is a warship, and the bronze ram on page 6 and the battle on page 9 are mentioned gently, so be ready for a question about what the ram was for.',
      practising: 'Coordination: many small efforts made at the same moment act as one, and a signal everyone can hear keeps a crowd in time when they cannot see each other.',
      ask: 'On page 7: “When the oars went in at different times, what went wrong, and how did they put it right?”',
      next: 'Load a laundry basket with books until a one-handed push from either of you will not slide it on the carpet. Push one after the other and it stays put; push together on “one, two, push” and it moves.',
      honest: 'Triremes, the three rows of about 170 rowers, the rowing master (keleustes), the piper with his aulos and the bronze ram are on record; the crew and the gust are invented. Page 5 simplifies: an out-of-time stroke still pushes the ship, but the oars were packed so close that a ragged stroke made blades strike each other and wasted effort. Page 9’s quick Greek ships darting round a bigger fleet is not how Herodotus tells Salamis: he has Themistocles call the Greek ships heavier and fewer, and the narrow strait helped them because the bigger fleet could not use its numbers.',
    },
  },
  'the-rain-bowl-of-the-king': {
    kind: 'reconstructed',
    note: {
      what: 'King Sejong wants rain reports that mean the same thing in every village, so Jang Yeong-sil makes identical bronze rain vessels with a scale, and a higher water line in one of them means more rain fell there. A vessel tilted on a pebble gives a crooked reading until it is set level.',
      expect: '13 pages, about 9 minutes, ending in a goodnight. The fairness idea, that a comparison only means something if everyone uses the same tool, lands well with the cup cues; the units cheok and chon on page 4 are only names to him.',
      practising: 'A standard measure: a comparison is fair only when everyone uses the same tool, set up the same way and read the same way.',
      ask: 'On page 8: “Why can’t they trust the bowl that was leaning on a pebble?”',
      next: 'The Make & Do activity ‘Why Is a Ruler Called a Foot?’ shows why a shared unit matters. Before a heavy rain, stand a tall straight-sided glass and a wide straight-sided tub outside side by side, then measure the water in each with a ruler: it comes to about the same depth in both.',
      honest: 'The cheugugi of 1441, its fixed size and its issue to local offices, the first known government network for measuring rain, are on record; the fields, the helper and the dialogue are invented, and the court annals credit the idea to the crown prince, later King Munjong, so Jang Yeong-sil’s part is less certain. The story’s reason for matching bowls (pages 2 and 5) is wrong for straight-sided vessels, since a wide one and a narrow one in the same rain fill to the same depth; the standard fixed the vessel, its stand and the reading, which was taken with a separate standard ruler about 21 cm to the cheok (not the 30 cm the grown-ups fact gives), not with marks inside the vessel as on page 4.',
    },
  },
  'the-shadow-that-measured-a-giant': {
    kind: 'tale',
    note: {
      what: 'Thales, a Greek thinker visiting Egypt, is asked how tall a pyramid is and waits until a stick’s shadow is exactly as long as the stick, because at that moment the pyramid’s shadow is as long as the pyramid is tall. A later page gives the general rule: if the stick’s shadow is twice the stick, the pyramid’s shadow is twice the pyramid.',
      expect: '12 pages, about 9 minutes. He can grasp “wait until your shadow is as long as you are tall” and try it outside; the twice-as-long rule on page 8 and the words “similar triangles” on page 6 are for later.',
      practising: 'Proportion: when the sun makes one upright thing’s shadow equal to its height, every upright thing’s shadow equals its height at that moment, so a shadow on the ground can stand in for a height you cannot reach.',
      ask: 'On page 7: “The tip of the pyramid is above its middle. Should Thales count his steps from the edge of the pyramid or from the middle?”',
      next: 'On a sunny day, cut a string as long as he is tall and check his shadow against it; when they match (in the warmer months this happens mid-morning and mid-afternoon), pace out a tree’s shadow, and that is the tree’s height. The Make & Do activity ‘What Time Is It, Stick?’ watches a shadow shrink and grow.',
      honest: 'Thales was real, though page 1 puts Miletus in Greece when it was a Greek city on what is now the coast of Turkey; the pyramid measurement is a legend written down centuries after him, as the story itself says, so the priests and the scene are invented, though the method is sound. Page 7 leaves out the step that makes it work: the shadow must be measured from the point under the tip, in the middle of the pyramid, so half the base has to be added to the part that sticks out, and for the Great Pyramid that missing half is about 115 of its roughly 146 metres.',
    },
  },
  'the-spiral-that-never-hurried': {
    kind: 'reconstructed',
    note: {
      what: 'Archimedes, watching a water screw turn, tries to draw an even spiral; his quick swirl comes out lumpy, so he lays seeds at equal steps outward, makes each turn one step wider than the last and checks the gaps with a knotted cord. He later writes a book about the curve, now called the Archimedean spiral.',
      expect: '12 pages, about 9 minutes, ending in a goodnight. Tracing a curl in the air and “the same step every time” are within reach; that the spiral is one single line, not a stack of rings (page 8), is the surprising part and worth drawing for him.',
      practising: 'A repeated rule makes an even pattern: the same step outward on every turn keeps the gaps between the loops equal, and a fixed unit, the seeds or the knotted cord, is how you check it.',
      ask: 'On page 4: “Why did the row of seeds make the spiral come out even when the quick swirl did not?”',
      next: 'Roll a long strip of paper tightly round a pencil, slide the pencil out and look at the end: each layer adds one thickness of paper, so the gaps stay even all the way out. Then draw a spiral together, with dots a finger-width apart along a line from the centre standing in for the seeds.',
      honest: 'Archimedes of Syracuse and his book On Spirals are real; the slate, the seeds, the cord and the breeze are invented, and the water screw is credited to him by ancient writers but may be older. Page 9 mixes two curves: the water screw and a spring that pushes back when squeezed are helixes, coils of one width running along a line, not the flat spiral that grows outward, and the snail shell and sunflower on pages 5 and 11 follow other spirals whose gaps widen as they grow.',
    },
  },
  'the-stone-row-that-calmed-the-lagoon': {
    kind: 'reconstructed',
    note: {
      what: 'An elder on Pohnpei tells a child how Nan Madol, a city of dark basalt on the reef, was built: natural six-sided columns floated across from the far side of the island and stacked crisscross like a log cabin. Then they watch a small row of reef stones, where waves splash on the outside and only ripples reach the calm water behind.',
      expect: '12 pages, about 9 minutes, ending in a goodnight. The splash-and-hush contrast and the floating leaf on page 7 are easy to picture; how the stones were moved and stacked is a lot of building detail before the main idea arrives on page 6.',
      practising: 'A barrier changes the water behind it: a wall or a row of stones takes the force out of waves, so the far side stays calm. Also judging by watching for a while, not by one big splash (page 8).',
      ask: 'On page 7: “The same leaf bobbed fast outside the stones and drifted slowly inside. What made the difference?”',
      next: 'Half fill a baking tray with water, lay a row of pebbles or Lego bricks across the middle so a little water still passes, float a bottle cap on each side, and make waves at one end with your hand.',
      honest: 'Nan Madol, its basalt columns, the crisscross stacking, the outer seawalls and the legend of the twin sorcerers on page 10 are real; the elder and the child are invented, and how the columns were moved is not known, rafts on the tide being one suggestion. Page 6 gives the wrong reason, as does the learning takeaway’s “by displacement”: a row of stones calms the water because it stands in the waves’ path, sending part of each wave back and making the rest break and churn through the gaps, which uses up its energy.',
    },
  },
  'the-talking-knots': {
    kind: 'reconstructed',
    note: {
      what: 'An Inca knot-keeper in the Andes shows a child how a khipu holds numbers: knots near the bottom of a hanging cord count ones, knots in the middle count tens, knots near the top count hundreds, and an empty space means zero. The child ties a count, and the keeper reads it back to check it.',
      expect: '12 pages, about 9 minutes. The pointing cue on page 4 (low for ones, higher for tens) makes the rule concrete, and tying a real string afterwards is what makes it stick; the different knot types on page 5 are a step too far for most five-year-olds.',
      practising: 'Place value: where a mark sits decides what it is worth, so one knot can mean 1, 10 or 100; and zero as an empty place that keeps the other places in line.',
      ask: 'On page 6: “If the tens place has no knots at all, what does the empty space tell you?”',
      next: 'Tie knots on a piece of wool: 2 high and 3 low makes 23, then 2 high and none low makes 20. The maths game ‘What Is Zero Doing There?’ works the empty-place idea on a place-value mat.',
      honest: 'The khipukamayuq, the base-ten knot positions, the knot types and zero as an empty space are documented; the keeper and the child are invented. Colour did carry meaning, but which colour meant what is mostly unknown, so the gold for corn, brown for llamas and red for people on page 7 are the story’s examples, and what else khipu recorded besides numbers is still being worked out.',
    },
  },
  'the-tiniest-bits-of-everything': {
    kind: 'reconstructed',
    note: {
      what: 'A boy named Democritus breaks a crust of bread into smaller and smaller pieces until his eyes cannot tell one speck from the next, and guesses that everything is made of pieces too small to cut, which he calls atomos. Grown up, he and his teacher Leucippus picture atoms of different shapes moving through empty space, an idea confirmed more than two thousand years later.',
      expect: '12 pages, about 9 minutes. The crumb game is easy to copy at the table; the line between what he saw and what he guessed (pages 5 and 6) is the most important idea and the hardest one.',
      practising: 'The difference between what you can see and what you reason must be there: stop where the evidence stops, then make a guess and say it is a guess.',
      ask: 'On page 6: “Democritus said ‘my eyes stop here, but maybe the bread does not’. What did he mean?”',
      next: 'Stir a spoon of sugar into a clear glass of water until you cannot see it any more, then let him taste a sip: the sugar is still there in bits too small to see.',
      honest: 'Democritus of Abdera, Leucippus, atomos, atoms moving in empty space and the round-sweet, jagged-sharp tastes on page 9 come from what later writers report of him; the boyhood bread scene is invented, as the grown-ups fact says. Page 11’s “nearly two thousand years” is too short: from about 400 BCE to Dalton’s chemical atoms of 1808 is about 2,200 years, and to the experiments that settled it around 1908 about 2,300; the atoms scientists found can also be split into smaller particles, and even the faintest speck of bread is still a vast number of atoms.',
    },
  },
  'the-warm-floor': {
    kind: 'reconstructed',
    note: {
      what: 'A Roman bathhouse floor is warm with no fire in the room, because a furnace at one end sends hot air under a floor raised on little brick stacks and up hollow tiles inside the walls, where the smoke leaves through vents. The story also names the enslaved workers who fed the furnace.',
      expect: '12 pages, about 9 minutes. The hidden space under the floor is easy to picture with the palm-on-the-floor cue on page 1; page 10 on enslaved workers may need a sentence from you about what that means.',
      practising: 'Heat moves: hot air from one fire travels under the floor and up the walls, the tiles take up its heat, and brick and stone hold heat for a long time after the fire dies down.',
      ask: 'On page 6: “Where did the smoke go, and why did it not come into the room?”',
      next: 'After a sunny day, put your hands on a stone step or a brick wall in the evening; it stays warm after the sun has gone, as the tiles did on page 11. The Make & Do activity ‘Does a Towel Keep Ice Cold?’ looks at heat moving from the other side.',
      honest: 'The hypocaust and its parts, its spread to Britain, the enslaved furnace workers and Pliny’s mention of Sergius Orata’s “hanging” baths around 95 BCE are on record, though whether Orata’s baths had heated floors is debated; the scenes are a typical bathhouse, not a particular one. Page 2’s “as tall as your knee” is too short, since Vitruvius gives the brick stacks two Roman feet, about 60 cm, nearer a five-year-old’s waist; and the hottest rooms could be too hot for bare feet, so bathers often wore thick-soled sandals there.',
    },
  },
  'the-wheel-you-walk-inside': {
    kind: 'reconstructed',
    note: {
      what: 'At a Roman building site, a crew walks inside a great wheel whose turning axle winds a rope through a five-pulley block, and a carved stone too heavy for a crowd to carry rises slowly onto a wall. A rubbing rope stops the lift until it is set straight.',
      expect: '12 pages, about 9 minutes, ending in a goodnight. The wheel as a winder (page 3) and the many-steps-for-a-small-lift trade (page 6) are within reach with the cues; why five pulleys make the load lighter (page 4) is the hard part and needs a real string to see.',
      practising: 'A machine trades distance for force: the walkers take many steps and the stone rises only a little, and a big wheel and a set of pulleys each make the same lift take less force.',
      ask: 'On page 6: “The walkers took many, many steps and the stone rose only a little. Why was that a good trade?”',
      next: 'Push a door open with one finger near the hinge, then near the handle: near the handle your finger travels much farther but the push is far easier, the same trade as the big wheel. The science game ‘Keep It Balanced’ shows the lever version.',
      honest: 'Vitruvius’s pulley cranes (trispastos, pentaspastos, polyspastos), the treadwheel and the relief from the tomb of the Haterii showing one are real, so page 1’s “a true tale” holds for the machine; the crew and the scene are invented. Roman building crews were almost all men, free and enslaved, so the women who run the crane here are the story’s choice.',
    },
  },
};
