import type { ArchiveEntry } from './types';

export const ENTRIES: Readonly<Record<string, ArchiveEntry>> = {
  'archimedes-counting-the-sand': {
    kind: 'reconstructed',
    note: {
      what: 'Archimedes scoops up sand, decides it can be counted after all, and builds new number-names by treating a myriad myriads as one big group, then counting those groups, starting from how many grains fit in a poppy seed. The one idea is that a number too big to say becomes sayable once you group it and name the groups.',
      expect: '13 pages, about nine minutes. A five-year-old will follow cups into jars into baskets and the poppy-seed trick on page 6; myriads, finger-widths and Aristarchus (pages 3, 7 and 8) will mostly pass over him.',
      practising: 'Grouping to count: bundle small units into a bigger unit, give the bigger unit a name, then count the bundles, the same move as ones, tens and hundreds.',
      ask: 'On page 6, ask “If you know how many grains fit in one seed, how could that help you count a whole beach?”',
      next: 'Count the grains in a pinch of rice together, in heaps of ten, then guess how many pinches would fill a katori and do the multiplying aloud for him. Ten Loose, One Bundle in Maths practises the same bundling.',
      honest: 'The Sand Reckoner is real: Archimedes did take a myriad myriads as a new unit, start from a poppy seed, borrow Aristarchus’s sun-centred cosmos and address the work to King Gelon. The beach walk and the candlelight are imagined; he did not measure the earth (page 7) but took a deliberately generous size for it, and he did not count the sand but showed the number was smaller than one he could name (about 10 to the power 63).',
    },
  },
  'one-in-every-row': {
    kind: 'reconstructed',
    note: {
      what: 'Seki fills a three-by-three board with moon, flower and bird tiles so each appears once in every row and every column, finds a doubled moon in the bottom row, and mends the board with one swap. The idea is a Latin square: one of each in every line, checked across and down.',
      expect: '12 pages, about nine minutes. Most five-year-olds can spot a repeat in one row; checking a column at the same time (pages 4 and 8) is the hard part, so trace it with a finger. Magic squares and determinants on page 10 are for you.',
      practising: 'A two-way rule: each picture once in every row and once in every column, and using the repeated picture to find the one wrong spot.',
      ask: 'On page 4, ask “Look down the first column. Which picture is still missing from it?”',
      next: 'Draw a three-by-three grid and fill it with three spoons, three coins and three buttons so no row or column repeats; then make one mistake on purpose and let him find it.',
      honest: 'Seki Takakazu is real and did study magic squares and an early form of determinants, but the story itself says the evening may not have happened, and nothing records him working on Latin squares, so checking down the columns is not “the clever thing that made him famous” (page 4). The name Latin square comes from Euler’s use of Latin letters in the 1780s rather than a name he gave them (page 5), such squares were in use before him, and Sudoku (page 11) adds a third rule, one of each in every box.',
    },
  },
  'the-ball-that-spun-on-steam': {
    kind: 'reconstructed',
    note: {
      what: 'Heron heats water under a hollow ball with two bent tubes; steam rushes out one way and the ball spins the other. Later a paper wheel sticks, and he frees the bent blade instead of blowing harder. The idea is reaction: whatever is pushed out one way pushes back the other way.',
      expect: '12 pages, about nine minutes. A five-year-old gets “whoosh one way, spin the other” quickly, especially with the spinning-chair cue on page 5; the stuck wheel that needs mending rather than a harder puff is a second, easier lesson.',
      practising: 'Action and reaction: a jet leaving an object pushes the object the opposite way, the idea Newton later stated as his third law.',
      ask: 'On page 5, ask “The steam went out this way. Which way did the ball go?”',
      next: 'Thread a straw on a string tied across the room, tape a blown-up balloon under the straw with its neck pinched, and let go: the air rushes back and the balloon shoots forward.',
      honest: 'Heron and his steam ball (the aeolipile, in his Pneumatica) are real, as are his self-opening temple doors and singing-bird devices; the evening is invented, and so is the paper pinwheel, though he did describe a wind-wheel that worked an organ. A pinwheel is turned by air striking its blades, not by a jet leaving it, so it is a cousin of the steam ball rather than “the very same idea” (page 6), and strictly steam is invisible: the white cloud on page 3 is tiny water drops forming as the steam cools.',
    },
  },
  'the-bowl-that-sank-to-mark-time': {
    kind: 'reconstructed',
    note: {
      what: 'At Nalanda an older student floats a copper bowl with a pinhole; each time it fills and sinks she beats a drum and starts again, and a new boy learns that a fair count needs the same start every time. The idea is a unit of time made by repeating one equal event: sixty sinkings make a day and night.',
      expect: '13 pages, about nine minutes. A five-year-old will grasp that the bowl takes the same time to sink when it is set down the same way, and why the tipped bowl did not count; sixty units in a day and the Surya Siddhanta are for you.',
      practising: 'A repeatable unit of time: the same event, started the same way, takes the same time, so counting the repeats measures a long stretch.',
      ask: 'On page 5, ask “Why did the keeper lift the bowl out instead of counting that one?”',
      next: 'Press a small bowl out of kitchen foil, prick one pinhole in the bottom, float it in a basin and time how long it takes to sink, three times, on a phone stopwatch; then widen the hole and time it again.',
      honest: 'The sinking-bowl clock (one ghati, about 24 minutes, sixty to a day and night) is real, and the Chinese monk Yijing, who studied at Nalanda in the seventh century, described students there running one and beating a drum when it sank; the keeper, the boy and the leaf are invented, and a girl keeper is part of the invention, since the students on record were monks. Water clocks are older than Nalanda, but the Surya Siddhanta as we have it dates from around Nalanda’s founding in the fifth century, so “long before Nalanda” (page 10) fits older texts better than this one; page 6 also has a typo, “The boy shoulders” for “The boy’s shoulders”.',
    },
  },
  'the-circle-number-to-seven-places': {
    kind: 'reconstructed',
    note: {
      what: 'Zu Chongzhi and his young son lay bamboo rods inside a drawn circle, six edges, then twelve, then more, and watch the shape hug the circle closer each time, until the father writes pi to seven places and the fraction 355 over 113. The idea is that many short straight edges get closer and closer to a curve.',
      expect: '12 pages, about nine minutes. A five-year-old can see and feel that a twelve-sided shape is rounder than a six-sided one; the digits on page 9 and the fraction on page 10 are words to him, not quantities.',
      practising: 'Approximating a curve with straight lines: doubling the number of sides of a shape inside a circle shrinks the gaps, so its distance around creeps up towards the circle’s.',
      ask: 'On page 4, ask “Where did the gaps between the shape and the circle get smaller?”',
      next: 'Wrap a string once round a steel plate, mark it, and lay it straight across the plate again and again: it goes across three times and a little bit more, and that little bit is what Zu Chongzhi chased.',
      honest: 'Zu Chongzhi, his son Zu Gengzhi, the seven-place bounds (3.1415926 to 3.1415927), 355/113 and the Daming calendar are on record; the rod-laying evenings are imagined, and his own book is lost, so the polygon method is inferred from Liu Hui. The real work was calculation with counting rods, not laying rods round a drawn circle, which could never reach seven places; and in the page 7 cue a “bigger corner” means a sharper turn, since measured inside the shape the many-sided figure’s corners are actually wider.',
    },
  },
  'the-count-of-twenties': {
    kind: 'reconstructed',
    note: {
      what: 'At a Maya market a keeper teaches a girl to write numbers with beans for dots, bundled sticks for bars and a shell for zero, stacked in levels for ones and twenties. The idea is place value in base twenty, with a zero to hold an empty level.',
      expect: '11 pages, about nine minutes. Dot for one and bar for five, up to nineteen, is well within reach; the second level counting twenties (page 4) is hard for a child still learning tens, and the shell as a place-holder on page 5 is the key moment.',
      practising: 'Grouping and place value: five ones make a bar, twenty ones move up a level, and zero marks a level with nothing in it.',
      ask: 'On page 5, ask “If there is one dot on the top shelf and a shell on the bottom one, what number is that?”',
      next: 'Write numbers to nineteen the Maya way with rajma for dots and short pieces of drinking straw for bars, then play What Is Zero Doing There? in Maths, which does the same job with our tens instead of twenties.',
      honest: 'Dots, bars, a shell-like zero and stacked levels are well documented; the market, the keeper and the helper are imagined, and the written numbers that survive come from calendars, codices and carved monuments rather than market accounts. In those calendar counts the third level counted 360 days rather than 400, so the four-hundreds and eight-thousands on page 8 are the plain counting system, not how the carved dates on page 9 were written.',
    },
  },
  'the-eye-shaped-fractions': {
    kind: 'reconstructed',
    note: {
      what: 'The scribe Ahmes pictures a loaf to share among workers, folds it into halves, quarters and eighths, mends a crooked fold so the shares are fair, and builds three-eighths out of a quarter and an eighth. The idea is equal shares by halving, and the Egyptian habit of writing parts as sums of unit fractions.',
      expect: '13 pages, about nine minutes. Halves and quarters by folding are right at a five-year-old’s level, and the crooked fold on page 6 is the clearest lesson; adding a quarter and an eighth on page 8 will be beyond most, so let it go by.',
      practising: 'Equal parts: a half folded in half gives four equal quarters, a fair share needs equal pieces, and an amount can be made from several one-part pieces.',
      ask: 'On page 6, ask “Which piece is wider, and would that be fair to the worker who gets the thin one?”',
      next: 'Fold a roti, or a paper circle, in half and then in half again and check that the four pieces match edge to edge; then play Share the Roti in Maths.',
      honest: 'Ahmes, his copying from an older text, the bread-sharing problems, wages of bread and beer (page 2) and unit fractions are real; his evening and the eye frame are invented. Page 3 is wrong that one-half was written with the open-mouth sign: it had a sign of its own, and the mouth sign was used for parts like a quarter; and on page 10 the papyrus is usually named after Alexander Rhind, the Scot who bought it in 1858, though it is sometimes also called the Ahmes Papyrus. The halving series 1/2 to 1/64 was ancient, written with its own signs for grain measures; what is modern, and now rejected, is the idea that those signs are pieces of the Eye of Horus.',
    },
  },
  'the-girl-who-found-sea-dragons': {
    kind: 'documented',
    note: {
      what: 'Mary Anning of Lyme Regis hunts fossils in the cliffs, digs out the ichthyosaur whose skull her brother found, later finds a plesiosaur and a flying reptile, works out that some stones are fossil droppings, and runs a fossil shop while scientists leave her name out. The idea is what a fossil is and how bones in rock tell us about animals no one has seen alive.',
      expect: '12 pages, about nine minutes. A five-year-old will hold on to “a fossil is a plant or animal turned to stone” and the patient digging; deep time on page 7 and why she was left out of the science clubs on page 10 need you to say a sentence more.',
      practising: 'Evidence from fossils: bones, shapes and even droppings preserved in rock let us work out how long-gone animals looked, moved and ate.',
      ask: 'On page 9, ask “How could old droppings tell Mary what the sea dragon ate?”',
      next: 'Press a shell or a leaf into a flattened ball of atta dough, lift it off and let it dry: the print it leaves is how a mould fossil forms.',
      honest: 'This is close to the record: Joseph found the skull in 1811, Mary dug out the rest about a year later at around twelve, she found a near-complete plesiosaur in 1823 and a pterosaur in 1828, she opened her shop in 1826, and women were barred from the Geological Society. The conversation in which Joseph asks her to keep digging is imagined, the plesiosaur had been named from scraps two years before her skeleton, and William Buckland published the fossil-dung idea in 1829, drawing on what she had noticed.',
    },
  },
  'the-king-of-the-cretaceous': {
    kind: 'documented',
    note: {
      what: 'A tour of Tyrannosaurus rex in the Hell Creek swamps: its size, banana-sized teeth that kept growing back, tiny two-fingered arms, a long tail for balance, and how fossil bones, tracks and eggs let us know it at all, ending with birds as its living relatives. The idea is that we can know an animal no one has seen from the clues it left in rock.',
      expect: '11 pages, about nine minutes. A five-year-old will hold on to the tiny arms, the banana tooth and “the bones remember”; sixty-six million years means nothing yet, and that birds are dinosaurs (page 10) may need saying twice.',
      practising: 'Reasoning from evidence: bones, teeth and footprints are clues, and scientists fit them together like a puzzle to work out an animal’s size, shape and way of moving.',
      ask: 'On page 7, ask “Why does a big heavy head need a long tail behind it?”',
      next: 'Play A T. rex Beside a Bus in Science, then measure out twelve metres along a corridor or garden path, one tape length at a time, and count how many of his own lengths fit.',
      honest: 'The animal, Hell Creek, Sue, the replacing teeth, the two-fingered arms and birds as its living relatives are well established, and T. rex ate meat, which page 5’s “plant-eating and meat-eating world” blurs. Three claims are loose: big adults were 12 to 13 metres, about as long as a school bus, not longer (page 2); only a few single footprints have been tentatively put down to T. rex, so its two-legged walk is known from the skeleton rather than measured tracks (page 8); and no T. rex eggs have been found, though the story’s summary lists eggshells among the clues.',
    },
  },
  'the-little-sun-clock': {
    kind: 'reconstructed',
    note: {
      what: 'Anaximander pushes a rod into the ground at Miletus and marks the tip of its shadow with pebbles through one day: long in the morning, shortest and pointing north at noon, long again by evening; over the year he sees the noon shadow stretch in winter and shrink in summer. The idea is that a still rod’s shadow tells both the time of day and the season.',
      expect: '13 pages, about nine minutes. A five-year-old can follow the shadow shrinking to noon and growing again, more easily if you have tried it outside; the seasons, solstices and equinoxes on pages 8 and 9 are a step further, and the map and “the boundless” on page 10 are for you.',
      practising: 'A shadow points away from the light: as the sun climbs the shadow shortens, as it sinks the shadow lengthens, and the shortest shadow marks midday.',
      ask: 'On page 4, ask “The sun is climbing higher. Is the shadow getting longer or shorter?”',
      next: 'Do What Time Is It, Stick? in Make & Do, chalking a stick’s shadow once an hour on a sunny balcony; Where Will the Light Go? in Science explores shadows with a torch.',
      honest: 'Anaximander is real, and later ancient writers credit him with bringing the gnomon to the Greeks and marking the solstices with it, though Pliny gives the first Greek sundial to his pupil Anaximenes; the pebble day is imagined, and the Babylonian origin on page 2 follows Herodotus. Page 3 says the sun travels, which is how it looks and how he would have thought of it, but it is the Earth turning that moves the shadow; and the sea at Miletus (pages 1 and 13) was the Aegean, since Ionia was the region, while the Ionian Sea lies on the far side of Greece.',
    },
  },
  'the-music-in-the-strings': {
    kind: 'tale',
    note: {
      what: 'In an old tale from Croton, Pythagoras plucks one string, stops it at the middle to hear a higher note, finds that half the length sounds an octave above, and then tries two-thirds and three-quarters. The idea is that a shorter length of string sounds higher, and simple length ratios sound well together.',
      expect: '12 pages, about nine minutes. Many five-year-olds mix up high and low with loud and soft, so check what he means; the octave as “the same song sung twice” comes across if you hum it, and the two-of-three and three-of-four steps on page 7 are for you.',
      practising: 'Pitch depends on length: a shorter vibrating string sounds higher, half the length sounds an octave higher, and simple ratios (2:1, 3:2, 4:3) sound consonant.',
      ask: 'On page 3, ask “Which sang higher, the long part of the string or the short part?”',
      next: 'Hold a steel ruler flat on the table edge, twang it, then slide more of it onto the table and twang again: the shorter free end sounds higher. Where Does Sound Come From? in Science uses the same ruler.',
      honest: 'Pythagoras and his community at Croton are real, but he left no writings, and every story of him discovering these ratios, on a string or in a blacksmith’s shop, was written down centuries later, as page 1 admits. The physics on the pages is right for one string kept equally tight; pitch also rises with tightness and falls with thickness, and the ratios are on record among later Pythagoreans such as Philolaus and Archytas.',
    },
  },
  'the-plated-dinosaur': {
    kind: 'documented',
    note: {
      what: 'A tour of Stegosaurus in the Late Jurassic: a plant-eater with a low head, a row of tall bony plates, four tail spikes for defence and a small brain, and how palaeontologists dig its bones out of rock. The idea is that fossils tell us what an animal looked like, and that some questions, like what the plates were for, are still open.',
      expect: '11 pages, about nine minutes. A five-year-old will remember plates, spikes and the odd tail word; a hundred and fifty million years is just “very long ago”, and page 6’s “we do not know every answer” is worth stopping on.',
      practising: 'Telling what fossils show from what is still a guess: the plates and spikes are known, but what the plates were for is argued over.',
      ask: 'On page 6, ask “What do you think the plates were for, and how could a scientist check?”',
      next: 'Measure out seven metres along a corridor, about the length of an adult Stegosaurus, mark the ends with tape, and count his steps from one end to the other; How Long Is That Dinosaur? in Maths measures dinosaurs with blocks.',
      honest: 'The animal, its seventeen or so plates, four tail spikes, plant diet and western American fossils are well established, and page 6 is right that the plates’ purpose is still argued over. Three claims need correcting: a big adult was about 6.5 to 9 metres, nearer a short school bus than the big one on page 2; the walnut on page 8 is a popular comparison that undersells it, since its braincase was about the size of a dog’s and its brain is put at up to about 80 grams; and “thagomizer” (page 7) was coined by the cartoonist Gary Larson in 1982 and only later taken up by scientists.',
    },
  },
  'the-rope-stretchers-of-the-nile': {
    kind: 'reconstructed',
    note: {
      what: 'After the Nile flood washes away the field boundaries, rope stretchers pull a knotted cord between old marker stones, a girl called Isis counts the knots, a loop of twelve equal spaces is pegged into a 3-4-5 triangle for a square corner, and a cord bent round some reeds is straightened before the line is marked. The idea is that a fixed unit, counted the same way each time, gives everyone the same fair length.',
      expect: '12 pages, about nine minutes. Counting knots and seeing that a bent rope gives an unfair line (page 7) are well within reach; why three, four and five always make a square corner is a fact to accept at this age, not one to explain.',
      practising: 'Measuring with a repeated unit: equal spaces on a cord are a ruler you can carry, a straight line needs the cord pulled tight, and the same count means the same length.',
      ask: 'On page 7, ask “Why must they straighten the rope before they mark the line?”',
      next: 'Tie thirteen knots a hand-span apart along a string and pull it tight into a triangle with three people: one holds the first and last knots together, one the fourth knot, one the eighth. The corner at the fourth knot should match the corner of a book.',
      honest: 'Egyptian field surveyors with measuring cords are real (the Greeks called them rope stretchers), and the tomb of Menna, a scribe of the fields around 1400 BCE, shows a field being measured with a cord; the girl, the reeds and the speeches are invented, and the story’s scribe borrows the real Menna’s name. That the cords were knotted is a reasonable guess, but the twelve-space rope folded into a 3-4-5 corner (pages 5 and 6) is a modern guess with no Egyptian evidence, though the story tells it as fact, and Herodotus’s claim that geometry began here (page 10) is his view, not settled history.',
    },
  },
  'the-slanted-stones-of-the-pyramid': {
    kind: 'reconstructed',
    note: {
      what: 'Builders at Giza square the base of Khufu’s pyramid, a scribe chooses one slope, called the seked, and workers check every layer with a wooden guide cut to that slope, mending one stone that sits wrong so all four faces meet in a single point. The idea is that the same in-step for each step up keeps a slope even.',
      expect: '12 pages, about nine minutes. The stacked-books cue on page 7 makes the slope idea concrete, and “small step in, steep side; big step in, gentle side” on page 5 is the heart of it; the seked in palms per cubit is for you.',
      practising: 'Slope as a ratio: how far a side moves in for each unit it rises; keep that ratio the same on every layer and the face stays straight.',
      ask: 'On page 5, ask “If every layer steps in a long way, will the side be steep or gentle?”',
      next: 'Stack six books, sliding each one back one finger-width from the one below, then build a second stack sliding each back two finger-widths, and compare which side is steeper.',
      honest: 'Khufu’s pyramid, its square base, its seked of five and a half palms (about 52 degrees) and the seked problems in Ahmose’s papyrus are on record; the workers, the wooden guide and the misplaced stone are imagined, ramp designs are still argued over, and how the base was squared so precisely is not known, so the 3-4-5 rope on page 3 is a guess, not a record. Page 8 has the geometry backwards: a stone set too far in, leaving a gap at the top of the guide, makes that face lean back too much, so it is too gentle, not too steep, so page 9’s “set it back a touch” has to mean bringing it outward, since moving it further in would widen the gap.',
    },
  },
  'the-star-that-warned-the-farmers': {
    kind: 'reconstructed',
    note: {
      what: 'Maya sky-watchers near Chichen Itza mark each dawn the morning star appears, leave a box blank when mist hides it, and over years find that Venus returns every 584 days and that five of its rounds fit eight years. The idea is that patient, honest records reveal a cycle no single night can show.',
      expect: '12 pages, about nine minutes. A five-year-old will understand that the morning star is a planet and that you leave the box empty when you did not see it (pages 7 and 8); 584 days and five rounds in eight years are just very big numbers to him.',
      practising: 'Honest record-keeping and finding a cycle: mark only what you saw, leave a gap when you could not see, and a long run of marks shows the pattern repeating.',
      ask: 'On page 7, ask “The helper hoped the star was there. Why did he leave the box empty?”',
      next: 'Venus is hidden for weeks at a time, so check a sky app or almanac for whether it is a morning or an evening star this month, then go out together and put one tally mark on the calendar each time you spot it.',
      honest: 'The Maya Venus Table in the Dresden Codex, the 584-day cycle and the five-in-eight-years match are real; the watchers and the blank-box scene are imagined, the Table is a calculated almanac rather than a diary of dawn marks, it reads Venus mostly for omens, and a link to planting is speculative. Pages 4 and 5 get the sky wrong: when the morning star sinks into the dawn glow it passes behind the Sun, stays hidden for about fifty days (the Maya table counts ninety) and comes back as the evening star; the short gap of about eight days comes at the end of its evening-star months, when it passes between us and the Sun.',
    },
  },
  'the-sun-circle-of-cahokia': {
    kind: 'reconstructed',
    note: {
      what: 'At Cahokia people stand by the centre post of a great ring of cedar posts each dawn, note which post the sunrise meets, wait out a cloudy morning, and see the sun rise beside the equinox post; much later an archaeologist finds the post-holes and the posts go back up. The idea is that the sunrise point slides north and south through the year, so fixed markers turn it into a calendar.',
      expect: '12 pages, about nine minutes. A five-year-old will follow waiting for the sun to reach a special post, and the cloudy day; that the sunrise point moves along the horizon over months (pages 2 and 5) is new to most children and best shown from your own window.',
      practising: 'The sunrise point moves with the seasons, furthest north in summer and furthest south in winter, so a fixed sightline can mark a date.',
      ask: 'On page 2, ask “If the sun came up in the same place every day, could the posts tell us anything?”',
      next: 'Pick a window that faces east and, once a week, stick a small tape mark on the glass where the sun comes up behind a building or tree; over a month he will see the marks walk along.',
      honest: 'The post circles, the red cedar, the centre post and the solstice and equinox sunrise alignments are on record, and Warren Wittry did find the post-holes and name the site Woodhenge in the 1960s; the elder, the child and the notched stick are imagined. The full circle standing today was rebuilt in 1985 in a project led by William Iseminger; and using the equinox post to time planting (page 9) is a guess rather than a record, while beans seem to have reached the region only around Cahokia’s decline.',
    },
  },
  'the-thread-from-a-sleeping-worm': {
    kind: 'tale',
    note: {
      what: 'In the old Chinese tale a cocoon drops into the empress Leizu’s hot tea, the warm water loosens it, and she unwinds one fine thread far longer than she expected, slows down when it nearly snaps, and shares silk-making with others. The idea is that a cocoon is one continuous thread held by a gum that warm water softens.',
      expect: '12 pages, about nine minutes. A five-year-old will enjoy the thread that keeps coming and the near-snap on page 5; that the caterpillar is inside and does not wake as a moth when silk is reeled is not in the story, and he may ask.',
      practising: 'A cocoon is one long thread wound round and round, and warm water softens the gum so it can be unwound; one fine strand is weak but many twisted together are strong.',
      ask: 'On page 6, ask “How did all that long thread fit inside such a tiny cocoon?”',
      next: 'Wind a long piece of wool tightly into a small ball and then let him unwind it across the room to see how far one small ball reaches; then twist three single strands together and compare how hard each is to snap.',
      honest: 'Leizu is a legendary figure, and the teacup story is a tale, as page 1 says; silk-making in China is very old, with silk remains from several thousand years ago. The science is right, but the real process is harder than the tale: cocoons are usually heated with the pupa still inside, which kills it, so the honest answer to a question about the moth is that most do not hatch; the page 8 claim that silkworms eat only mulberry is broadly true of the farmed silkworm.',
    },
  },
  'the-triangle-of-growing-numbers': {
    kind: 'reconstructed',
    note: {
      what: 'Yang Hui writes a triangle of numbers by lamplight: ones down both edges and each inside number the sum of the two above, row by row to 1 4 6 4 1; he mends one mistake, notices the triangle counts choices, and credits Jia Xian, who used it before him. The idea is a rule that grows a pattern: two above make one below.',
      expect: '12 pages, about nine minutes. Adding one and one, and one and two, is within reach and the rows to 1 3 3 1 can be checked on fingers; three plus three on page 6 is a stretch for some, and choosing pairs (page 7) and roots (page 8) are for you.',
      practising: 'A recursive rule: each new number comes from the two above it, with ones at the edges, so the whole triangle grows from one simple step.',
      ask: 'On page 6, ask “Which two numbers above did Yang Hui add to make the six?”',
      next: 'Write the first five rows together on paper, with coins or beans for the numbers, then play What Comes Next? in Maths for more rule-following patterns.',
      honest: 'Yang Hui, his 1261 book, his credit to Jia Xian and the later name Pascal’s triangle are on record; the lamplit evening and the mended mistake are imagined. The four-friends example on page 7 checks out (six pairs), the same triangle was also known in India and Persia before Pascal, and the root-finding on page 8 was done with counting rods laid out on a board, not with beads.',
    },
  },
  'the-wave-with-little-waves': {
    kind: 'reconstructed',
    note: {
      what: 'Hokusai paints his great blue wave, notices the foam breaking into smaller and smaller curls of the same shape, puts Mount Fuji tiny in the background, and hands the drawing to a carver and printer who make thousands of prints. The idea is a shape that repeats inside itself at smaller sizes.',
      expect: '12 pages, about nine minutes. A five-year-old can find a big curl and smaller curls inside it if you show him the real print; page 7, where Hokusai learns that some water has no curls, is a good lesson in not inventing a pattern that is not there.',
      practising: 'Self-similarity: a part that looks like the whole at a smaller size, and checking that a pattern is really there before naming it.',
      ask: 'On page 8, ask “Can you find a big curl, then a smaller one, then a tiny one?”',
      next: 'Look at a fern frond, a cauliflower or a head of broccoli together and find a small piece that looks like the whole, then break a floret off and compare.',
      honest: 'Hokusai, the print, Prussian blue, Thirty-Six Views of Mount Fuji, the fishing boats and the many thousands of impressions are on record; the evening is imagined, and Hokusai drew the design rather than painting it in blue as page 2 suggests, since the colour was added by the printer’s blocks. In the early impressions the outlines were printed in blue, not black as page 9 has it, and page 11’s “Hokusai simply saw it first” overstates things: the fractal reading is a modern one, not something he said.',
    },
  },
  'the-year-of-three-hundred-sixty-five': {
    kind: 'reconstructed',
    note: {
      what: 'An elder teaches a young scribe, Ipi, the Egyptian year with twelve bundles of thirty days and five feast-day stones, ties the three seasons to the Nile and the new year to the star Sopdet, and explains that the year slowly slips because it is a quarter-day short. The idea is that 12 times 30 plus 5 makes 365.',
      expect: '12 pages, about nine minutes. Counting twelve bundles and five stones is easy, and thirty as three tens works with the page 2 cue; twelve thirties making 360 is beyond counting at this age, so say it, and the quarter-day drift on page 9 is for you.',
      practising: 'Building a big number from groups: three tens make thirty, twelve thirties make 360, and five more make 365; leftover days get a place of their own.',
      ask: 'On page 5, ask “The months make three hundred and sixty. How many more stones make the whole year?”',
      next: 'Find the twelve months on a wall calendar, count the days in each with him, and notice that ours are not all thirty; then show him where 29 February would go in a leap year.',
      honest: 'The 365-day civil calendar, its three seasons, ten-day weeks, five extra days, Sopdet (Sirius) and the slow drift are on record; Ipi, the elder and the stones are imagined, and the birth story of the five gods is a myth told most fully by the Greek writer Plutarch, in which the Horus born then is Horus the Elder, not the “young Horus” of page 6. The calendar’s starting date is not known, and page 11’s claim that every wall calendar echoes it is fair in outline, since the Julian calendar took the 365 days and added a leap day.',
    },
  },
};
