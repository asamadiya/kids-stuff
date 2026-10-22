import type { Activity } from '../types';

/**
 * Build It Strong: paper, newspaper and blocks, where the shape and the
 * arrangement of the same material decide what stands and what holds weight.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'how-many-coins-can-paper-hold',
    area: 'build',
    title: 'How Many Coins Can a Paper Bridge Hold?',
    hook: 'One flat sheet sags under a coin. Fold it, then count what it holds.',
    where: 'table',
    places: ['kitchen'],
    minutes: 25,
    need: [
      'three sheets of printer paper, all the same kind',
      'two equal piles of thick books, about 10 cm high',
      'a ruler',
      'a plastic jar with a screw lid holding about 100 pennies, or other coins all of one kind',
      'a pencil and a notepad',
    ],
    steps: [
      {
        text: 'Make two book piles the same height, 20 cm apart. Lay one flat sheet the long way across the gap.',
        art: 'At the kitchen table, Arjun lays a flat sheet of white printer paper the long way across the gap between two equal piles of thick books with plain, blank, unlettered spines, while Nanna holds a ruler along the gap with one hand and nudges the right-hand pile into place with the other.',
      },
      {
        text: 'Put one coin in the middle of the flat sheet. Watch what it does.',
        art: 'Arjun sets one copper penny in the middle of the flat paper bridge between two piles of books, and the sheet bends down into the gap under it, while Nanna crouches at table height holding the jar of pennies in one hand and its lid in the other.',
      },
      {
        text: 'Fold the second sheet back and forth into a zigzag, folds about 3 cm wide, running the long way.',
        art: 'A sheet of paper seen from above with its fold lines running the long way, from one short end to the other, and below it the end of the folded sheet seen side-on as a zigzag.',
        figure: 'bridge-3',
      },
      {
        text: 'Lay the zigzag across the gap. Guess first, then put coins on its middle one at a time, counting out loud.',
        art: 'The zigzag-folded sheet lying across the gap between two piles of books, with a stack of coins in the middle of it, and a circle showing the zigzag folds seen from the end.',
        figure: 'bridge-4',
      },
      {
        text: 'Stop when it folds into the gap or slides off. Write the number, then count every coin back into the jar.',
        art: 'Arjun drops copper pennies one at a time into the plastic jar from a heap of pennies lying in the middle of a long pleated paper strip, whose long creases run from one book pile to the other and which has buckled and sagged down into the gap between the two piles of books on the kitchen table; Nanna sits beside him pencilling tally marks on a notepad.',
      },
      {
        text: 'Shape the last sheet your way: roll up its long edges, or try your own idea. Test it the same way.',
        art: 'Arjun rolls the two long edges of a third sheet of printer paper inwards into tight tubes, making a paper channel, while Nanna holds the middle of the sheet flat on the kitchen table next to the two piles of books and the closed jar of pennies.',
      },
    ],
    notice: 'The flat sheet sags under one coin, but the same paper folded into a zigzag holds many.',
    ask: 'What did folding do to the paper?',
    trial: 'Fold and load a zigzag alone first with the same books and coins. If the folds spread flat at once, crease each one hard with a thumbnail and make them narrower, about 2 cm. If it holds every coin in the jar, that is an answer too: the jar ran out before the bridge did. Printer paper is only 28 to 30 cm long, so keep the gap at 20 cm, with the ends resting on the books.',
    sources: [
      { label: "Let's Talk Science: Build a Paper Bridge", url: 'https://letstalkscience.ca/educational-resources/hands-on-activities/build-a-paper-bridge' },
      { label: 'American Academy of Pediatrics, HealthyChildren.org: Choking Prevention', url: 'https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx' },
    ],
    tags: ['rainy day', 'paper', 'coins', 'bridges', 'engineering', 'counting', 'no mess', 'indoors'],
    noPair: 'None yet: no game here is about how a shape makes paper strong.',
    note: {
      what: 'He lays a flat sheet of paper across a gap between two piles of books and sees it sag under one coin. Then he folds the same kind of paper into a zigzag and counts how many coins it holds before it gives way.',
      expect: 'He will probably expect the flat sheet to hold a few coins; it usually bends into the gap under the first. The zigzag can hold dozens, but the count varies a lot with how sharp the folds are and where the coins sit. When it fails, the folds spread flat or one end slides off a pile, and both are worth looking at together.',
      practising: 'Shape changes stiffness: folding paper into ridges makes it much harder to bend along its length without adding any paper. Also counting a growing collection one at a time and comparing two totals.',
      ask: 'While the zigzag is loaded: “It is the same paper as the flat one. What did the folding change?” Then let him look along its edge.',
      next: 'Tear open the edge of an old cardboard box together and find the wavy layer hidden between the two flat ones. On your next walk or drive, look under a bridge or a freeway overpass for its ridges and beams.',
      honest: 'The zigzag beats the flat sheet by so much that one try is enough to show that shape matters. Two zigzags are another matter: a sharper crease or coins placed off-centre can change a count a lot, so one run of each does not show which fold is stronger. Holding coins does not mean he can say why a folded sheet resists bending.',
      easier: 'Skip the counting: put five coins on each bridge and just ask which one is still standing.',
      harder: 'Fold one zigzag with wide folds and one with narrow folds, and test each one twice before deciding which is stronger. Or move the piles 2 cm further apart and count again, as long as at least 2 cm of paper still rests on each pile.',
      safety: 'Coins are a choking hazard for the two-year-old: do this while she is with another adult or asleep, or at a table she truly cannot reach, even from a chair. Count the coins out of a closed jar and back in afterwards, and check the floor. Keep the book piles low and on the table so they cannot topple onto anyone.',
    },
  },
  {
    id: 'tallest-newspaper-tower',
    area: 'build',
    title: 'The Tallest Newspaper Tower That Stands',
    hook: 'Rolled tubes, triangles and a wide base. Then a book makes wind.',
    where: 'table',
    minutes: 40,
    need: [
      'about 30 pages of old newspaper',
      'a roll of masking tape, torn by hand, no scissors',
      'a pencil to roll the tubes round',
      'a big hardback book to make wind',
      'a clear patch of floor, about two big steps across',
    ],
    steps: [
      {
        text: 'Roll a newspaper page tightly from one corner round a pencil. Slide the pencil out and tape the end.',
        art: 'On the living-room rug, by the low bookshelf of picture books, Amma rolls a newspaper page tightly around a long yellow pencil, starting from one corner, both her hands turning the paper so the pencil sits inside the thin tube with its point and its eraser sticking out of the two ends; Arjun sits beside her holding the loose far corner of the page in both hands to keep the roll tight; a small pile of finished thin paper tubes, each with a band of masking tape, lies beside them.',
      },
      {
        text: 'Hold a flat page out sideways by one edge. Then hold a tube out by one end. Which one droops?',
        art: 'On the living-room rug, Arjun stands and holds a single flat sheet of newspaper out to his side by pinching one short edge between his finger and thumb, and the rest of the sheet flops straight down limply towards the rug; beside him Amma kneels and holds one thin rolled newspaper tube out sideways by its end in one hand, and the tube sticks out straight and level like a stick. The newspaper shows only soft grey columns, no readable words or pictures.',
      },
      {
        text: 'Tape three tubes into a triangle on the floor. Tape a tube upright at each corner, and a triangle round their tops.',
        art: 'On the living-room rug, three thin rolled newspaper tubes lie flat in a closed triangle, taped together at all three corners; a tube already stands upright at each of the two front corners, and Arjun holds a third tube upright at the back corner with both hands while Amma wraps masking tape round its foot.',
      },
      {
        text: 'Push new tubes into the tops to build higher. When it wobbles, tape a tube slanting across two legs.',
        art: 'Arjun pushes the thin end of a new newspaper tube into the top of one leg of a three-legged newspaper tower to make it taller, while Amma tapes a slanting tube across two other legs, making a triangle that stops the wobble.',
      },
      {
        text: 'Stand next to the tower. Is it as tall as your knee, your tummy, or your head?',
        art: 'Arjun stands straight on the living-room rug beside an open frame tower built from thin rolled newspaper tubes: three tube legs standing apart with empty space between them, joined by taped triangles of tubes and one slanting tube taped across two legs, its top level with Arjun’s tummy; Arjun presses one palm flat against his own tummy, while Amma kneels on the other side of the tower and holds her flat hand level just above the tower’s top, pointing it across towards his tummy.',
      },
      {
        text: 'Make wind: wave the big book beside the tower, gently first. Where does it bend? Tape it and try again.',
        art: 'Arjun holds a large hardback book in both hands and fans it beside an open frame tower of thin rolled newspaper tubes on the living-room rug, three tube legs with empty space between them and taped triangles of tubes, the frame leaning a little at one joint where two tubes meet; Amma kneels on the other side of the tower, pointing one finger at that bending joint and holding a strip of masking tape in her other hand.',
      },
    ],
    notice: 'A flat page droops, but the same page rolled into a tube stays almost straight. A slanting tube taped across two legs makes a triangle and stops the wobble.',
    ask: 'What made the tower stop wobbling?',
    pairsWith: 'keep-it-balanced',
    trial: 'Roll one tube alone first: rolled tightly from a corner and held out level by one end, it should stay almost straight. If your newspaper is thin and the tubes kink, roll two pages together. Check that the thin end of one tube pushes into the open end of another. Tear a few strips of tape ready so he is not waiting.',
    sources: [
      { label: 'PBS KIDS for Parents (Odd Squad): Build Newspaper Structures to Develop Spatial Sense', url: 'https://www.pbs.org/parents/crafts-and-experiments/oddsquad-build-newspaper-structures-to-develop-spatial-sense' },
      { label: "Let's Talk Science: Build a Paper Bridge (why rolled paper and triangles are strong)", url: 'https://letstalkscience.ca/educational-resources/hands-on-activities/build-a-paper-bridge' },
      { label: 'American Chemical Society, Inquiry in Action (Kindergarten): What Is Wind? (a paper building fanned with a magazine)', url: 'https://www.acs.org/education/resources/k-8/inquiryinaction/kindergarten/chapter-1/what-is-wind.html' },
    ],
    tags: ['rainy day', 'newspaper', 'recycling', 'tower', 'triangles', 'measuring', 'engineering', 'indoors'],
    note: {
      what: 'He rolls newspaper into tubes, finds that a tube stays straight where a flat page droops, and tapes tubes into triangles to build a tower as tall as he can. Then he measures it against himself and tests it with a wave of a book.',
      expect: 'The frame will sway sideways, because its sides are oblongs, until a slanting tube is taped across one; he may need to watch it lean before he sees why the brace helps. Joins where one tube pushes into another are where the book usually finds the weak spot. How tall it gets depends on how long your newspaper pages are and how well it is braced; any height that stands counts.',
      practising: 'A rolled tube is much stiffer than the same sheet flat, a triangle of tubes holds its shape where a square folds over, and a wider base is harder to tip. Also the position words a builder needs: on top, across, between, next to.',
      ask: 'When the tower wobbles: “Where is it bending?” Let him put his finger on the spot before you suggest anything.',
      next: 'Look at a playground climbing frame, a crane over a building site or an electricity pylon beside the freeway together and find the triangles. Keep the tubes in a bag for another build next weekend.',
      honest: 'The first time, much of the design will come from you, and that is fine; a tall tower does not show that he could plan one alone. Whether it survives the book depends on how hard the book is waved, so this is a play test, not a measurement.',
      easier: 'Build only the three-legged frame and see whether a soft toy can sit on top of it.',
      harder: 'Build two towers from the same number of tubes, one with the feet close together and one with them spread wide. Wave the book the same way, from the same spot, at each.',
      safety: 'Rolled tubes turn into swords quickly: no swinging them near faces, and the book is waved beside the tower, never at anyone. Newspaper ink rubs off, so wash hands afterwards. Keep the tape roll and torn bits away from the two-year-old’s mouth. If she wants to join, give her her own pages to scrunch and tear beside you, out of reach of his tower, and watch that no paper goes in her mouth.',
    },
  },
  {
    id: 'build-what-i-built',
    area: 'build',
    title: 'Build What I Built',
    hook: 'Five blocks behind a box. Can you copy it exactly?',
    where: 'table',
    minutes: 20,
    need: [
      'two matching sets of 8 blocks, the same shapes and colours in each set: Duplo or wooden blocks',
      'a cardboard box, about shoebox size, to stand up as a wall',
      'two trays or chopping boards to build on',
      'no blocks? two matching sets of 3 steel katoris, 2 steel tumblers and 2 paperbacks',
    ],
    steps: [
      {
        text: 'Sit side by side with the box standing between you. The grown-up builds five blocks behind it. No peeking.',
        art: 'At the kitchen table, Nanna and Arjun sit side by side, each in front of his own tray; a tall cardboard box stands upright on the table between the two trays like a wall, hiding Nanna’s tray from Arjun. On his own tray behind the box, Nanna places a red block on top of a small low model of big wooden blocks, two on the bottom and two on top of them, while Arjun, on his side of the box, sorts a small matching pile of big wooden blocks next to his own empty tray.',
      },
      {
        text: 'Lift the box away. Build the same model on your tray with your own blocks.',
        art: 'Nanna lifts the cardboard box off the table to show his small block model on a tray, while Arjun, holding a blue block in one hand and a red block in the other, looks from the model to his own empty tray beside it.',
      },
      {
        text: 'Check them together. Is every block in the same place, the same way up? Say where: on top, behind, next to.',
        art: 'Arjun touches the yellow block lying on top of his own small block model with one finger and the matching yellow block on Nanna’s model with the other, the two matching models side by side on two trays on the kitchen table, while Nanna leans in and points behind the red block.',
      },
      {
        text: 'Now the grown-up builds with seven or eight blocks, one lying on its side. Copy that too.',
        art: 'Arjun turns a green block onto its side in his hand to match the green block lying flat on Nanna’s bigger model on the next tray, while Nanna holds the cardboard box he has just lifted away and watches the block turn.',
      },
      {
        text: 'Swap: you build behind the box and the grown-up copies. Check it: the grown-up may get one block wrong.',
        art: 'Arjun points at a blue block standing upright in Nanna’s copy where the blue block in his own model lies flat, while Nanna, a spare red block in his hand, leans in to look; the cardboard box lies on the table beside Arjun’s tray.',
      },
    ],
    notice: 'Getting the colours and the number of blocks right is the easy part. Which way up each block sits, and what is behind what, are where copies go wrong.',
    ask: 'How do you know yours is the same as mine?',
    pairsWith: 'turn-it-does-it-fit',
    trial: 'Before you start, copy your first model yourself with the second set: check that the two sets really match in shape and colour, and that the model has at least one block on top and one behind, so there is something to talk about.',
    sources: [
      { label: 'NRICH (University of Cambridge), Early Years: Can You Build This?', url: 'https://nrich.maths.org/eyfs-activities/can-you-build' },
      { label: 'NRICH (University of Cambridge), Early Years: Barrier Games', url: 'https://nrich.maths.org/eyfs-activities/barrier-games' },
      { label: 'Verdine et al., Child Development (2014): Deconstructing Building Blocks: Preschoolers’ Spatial Assembly Performance Relates to Early Mathematics Skills', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3962809/' },
    ],
    tags: ['rainy day', 'blocks', 'Lego', 'Duplo', 'spatial', 'position words', 'taking turns', 'quiet', 'no mess', 'indoors'],
    note: {
      what: 'You build a small model of five to eight blocks out of his sight, then show it, and he copies it with a matching set. Then you swap: he builds, you copy, and he checks your copy.',
      expect: 'He will usually match the colours and the number of blocks first and miss how each one sits: lying or standing, in front or behind. Sitting side by side keeps left and right the same for you both; facing each other, his copy may come out back to front, which is worth looking at, not correcting. Catching your mistake, when he is the checker, is often the part children like best.',
      practising: 'Spatial assembly: matching each block’s position and which way up it sits to a model, and the words that describe it (on top, under, behind, in front of, next to, between). Also checking two things part by part.',
      ask: 'When his copy is done, before you check it: “How do you know yours is the same as mine?” Let him show you block by block. Nanna can ask it in Telugu: “Needi, naadi okelaa unnaayani neeku ela telusu?” (How do you know yours and mine are the same?)',
      next: 'Copy something real in blocks together: the steel tumblers and katoris stacked on the drying rack, or the raised beds and the patio table seen from the back window. Then play Turn It. Does It Fit? together.',
      honest: 'A matching copy shows he can compare part by part with the model in front of him; building from memory or from words alone is harder and comes later. The study linking block-copying with early maths found a link in three-year-olds; it does not show that this game will raise his maths.',
      easier: 'Use three blocks, all standing upright, and leave the model in view while he builds.',
      harder: 'Show the model for a slow count of ten, then cover it and he builds from memory. Or use words only: build behind the box and tell him how, one block at a time, then lift the box and compare.',
      safety: 'Small Lego, and anything that fits inside a toilet-roll tube, is a choking hazard for the two-year-old: use Duplo or big wooden blocks when she is near, keep small bricks for when she is away, and count them back into the box. Give her a pile of big blocks of her own alongside, so his model stays his.',
    },
  },
];
