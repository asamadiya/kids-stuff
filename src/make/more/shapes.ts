import type { Activity } from '../types';

/**
 * Shapes and Patterns: a closed line round a grid of dots, a stamped repeat
 * set beside real Jaipur block printing, one square cut into seven pieces, and
 * a room drawn from above. Each is a different idea, not another symmetry
 * craft beside the rangoli in the first twelve.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'kolam-around-the-dots',
    area: 'shapes',
    title: 'Draw a Kolam Around the Dots',
    hook: 'Nine dots, one line, and back to where you started.',
    where: 'outdoors',
    places: ['table'],
    minutes: 20,
    need: [
      'a stick of thick white chalk, and a second colour for him',
      'a swept patch of patio or driveway about a metre square, away from cars',
      'or, at the table: a pencil, an eraser and a sheet of A4 paper',
      'a damp cloth for rubbing out chalk',
      'a small steel bowl of rice flour, if the grown-up wants to try the traditional way',
    ],
    steps: [
      {
        text: 'Make three rows of three dots, a hand apart. Count them together: nine.',
        art: 'Nine white chalk dots on dark grey paving, in three rows of three, each a hand apart. Nothing joins them.',
        figure: 'kolam-1',
      },
      {
        text: 'Warm up beside the square: one dot, one ring round it. Then two dots, one line making an 8.',
        art: 'A warm-up drawn in chalk: one dot with a single ring round it, and beside it two dots with one line making a figure of eight, a loop round each dot.',
        figure: 'kolam-2',
      },
      {
        text: 'Three in a row: above the first dot, cross, below the second, cross, above the third. Round the end, weave home.',
        art: 'Three chalk dots in a row with one unbroken line weaving above the first, crossing, below the second, crossing, above the third, round the end, and back the other way, so each dot sits in its own loop.',
        figure: 'kolam-3',
      },
      {
        text: 'Treat all nine as one bendy row: along the top, back along the middle, along the bottom. Round the end, weave home.',
        art: 'The nine dots in a square with one unbroken chalk line woven along the top row, round and back along the middle row, round and along the bottom row, and home again, each dot in its own loop.',
        figure: 'kolam-4',
      },
      {
        text: 'Check it together: run a finger along the whole line. Did it go round every dot? Any loose ends?',
        art: 'The finished nine-dot kolam with a gold line traced along the whole of the chalk line from a gold starting dot, checking that it goes round every dot and has no loose ends.',
        figure: 'kolam-5',
      },
      {
        text: 'The grown-up tries the old way: rice flour trickled from a pinch, round a short row of dots.',
        art: 'Mummy, kneeling on the sunny back patio, holds a small steel bowl of white rice flour in one hand and, with the pinched fingers of her other hand, trickles a thin wavy white line of flour that loops over one dot and under the next along a short straight row of three white chalk dots; Arjun kneels close beside her holding his blue chalk lowered in his lap, watching the flour line form.',
      },
    ],
    notice: 'When the line weaves between each dot and its neighbours and comes back to its start, every dot ends up in its own little space. If the line closes too soon, some dots are left outside it.',
    ask: 'Can you go round all nine dots and come home without lifting the chalk?',
    trial: 'Draw the nine-dot kolam on paper yourself first. Weave as if the nine dots were one long row bending back and forth, crossing between each dot and the next along that row, round the last dot, and back along the other side; check it comes home round all nine. If you cross the line in every gap of the square instead, it closes into three separate loops: know that before he finds it.',
    sources: [
      { label: 'Wikipedia: Kolam', url: 'https://en.wikipedia.org/wiki/Kolam' },
      {
        label: 'American Scientist (archived): The Kolam Tradition, Marcia Ascher, 2002',
        url: 'https://web.archive.org/web/20150930060208/http://www.americanscientist.org/issues/feature/the-kolam-tradition',
      },
    ],
    tags: ['chalk', 'kolam', 'Pongal', 'Tamil Nadu', 'rangoli', 'dot grid', 'driveway', 'no mess'],
    note: {
      what: 'He draws a kolam, the South Indian line drawing made around a grid of dots: one line that goes round every dot without touching it and comes back to where it began. You warm up on one, two and three dots, then try a square of nine.',
      expect: 'His first nine-dot line will probably wander, touch a dot, or close up early with some dots left outside. That is the puzzle, not a failure: rub out with the damp cloth and go again. What works is treating the nine dots as one long row that snakes back and forth, weaving between each dot and the next, as in the row of three.',
      practising: 'A closed curve: a line with no ends, which here must pass between every pair of neighbouring dots so each sits in its own space. Also seeing nine as three rows of three, and planning a path a few moves ahead.',
      ask: 'When the line is nearly done: “Which dots has it not gone round yet?” Let him find them before he draws on.',
      next: 'Tell him where kolams come from: in Tamil Nadu, Andhra Pradesh and Telangana, women, and some men and boys, draw one at the front door at dawn, in rice flour on ground swept and sprinkled with water, and a fresh one each morning. On a call, ask Dadi to describe mandana, the floor and wall drawings of Rajasthan. The library story The Loop You Draw Without Lifting is about a kolam too.',
      honest: 'This is a first taste of a skilled daily craft, not the craft itself: large kolams use knotted crossings and turn-backs that girls traditionally learn from their mothers and other women in the family. The mathematician Marcia Ascher showed how kolams express mathematical ideas, and computer scientists have written picture languages to describe whole families of them; one line round nine dots with your help is not that mathematics, and does not show he can plan a path alone.',
      easier: 'Stay with one row of three or four dots, and draw the first turns together with his hand under yours.',
      harder: 'Grow the grid to four rows of four. Before he starts, ask how many dots there are and how he could count them quickly without touching each one.',
      safety: 'Choose paving away from the road and from any car that might move, and check it is not hot underfoot at midday. Keep the rice flour out of the two-year-old’s reach and sweep it up after: raw flour is not for eating. If she wants to draw, give her a thick chalk of her own on a separate patch, so his line stays his.',
    },
  },
  {
    id: 'okra-prints',
    area: 'shapes',
    title: 'Okra Prints',
    hook: 'A star hides inside every okra. Stamp it in rows.',
    where: 'table',
    places: ['kitchen'],
    minutes: 30,
    need: [
      'three fresh, firm okra (bhindi), each cut across by the grown-up into a stubby piece about 3 cm long',
      'half a potato, its flat face trimmed by the grown-up so a square about 3 cm across stands up from it',
      'washable poster paint in two colours, a spoonful of each spread thin on two flat saucers',
      'a long strip of paper, about 60 cm by 21 cm (two A4 sheets taped end to end)',
      'old newspaper over the table, and an apron or an old T-shirt',
      'a damp cloth for fingers',
      'a wooden ruler, to keep the second row straight',
      'a hand block-printed bedsheet, dupatta, kurta or tablecloth; if there is none at home, ask Dadi to show one on a video call',
    ],
    steps: [
      {
        text: 'Look at the cut end of an okra. Count the points of the star inside.',
        art: 'Papa holds out a short stubby piece of okra with its cut end facing Arjun, showing the pale green star in its middle, while Arjun leans in and touches one point of the star with one fingertip, his other hand flat on the table. The dining table is covered with plain grey sheets of old newspaper with only faint grey speckles, no headlines, no letters and no photographs; a wooden chopping board beside Papa holds a halved potato and two more short okra pieces.',
      },
      {
        text: 'Dip the okra lightly in paint, dab it once on newspaper, then press it on the paper. Lift straight up.',
        art: 'Arjun lifts a short stubby piece of okra straight up off a long strip of white paper, its painted cut end facing down, leaving one crisp red star print with sharp clean points and no smudge; a saucer holding a thin film of red paint sits by his other hand, and no paint drips from the okra. Papa holds the far end of the paper strip flat with both palms.',
      },
      {
        text: 'Make a row: okra star, potato square, star, square. Say the rule out loud as you stamp.',
        art: 'Arjun presses the raised square of a cut potato half onto the paper strip in blue, next to a red okra star, a row of alternating red stars and blue squares running behind it, while Papa points along the row towards the empty space ahead.',
      },
      {
        text: 'Stop before the next stamp. What comes next? Guess first, then stamp it.',
        art: 'Arjun holds a short okra piece with a red-painted tip in his left hand and, held well apart in his right hand, a cut potato half with its raised blue-painted square facing down, hovering both above the empty end of one single row of prints on a paper strip that goes red star, blue square, red star, blue square; Papa sits beside him with his hands resting in his lap, watching.',
      },
      {
        text: 'Start a second row right under the first, each star under a star, like a block printer lining up.',
        art: 'Arjun lowers the okra carefully to print a red star exactly below a red star in the top row, while Papa lays a wooden ruler along the paper under the first row to help him keep the second row straight.',
      },
      {
        text: 'Lay a block-printed cloth beside your strip. Find the shape that repeats. Can you see where one block print meets the next?',
        art: 'Arjun stands at the table and runs one finger along a row of small printed red flowers on a white block-printed cotton bedsheet spread over one half of the table; right beside the sheet, on the other half, lies his own paper strip with a row of red okra stars and blue potato squares. Papa points with one finger to a matching red flower further along the same row of the bedsheet. The bedsheet pattern is only rows of small red flowers, and nothing else is lying on it.',
      },
    ],
    notice: 'The same okra piece prints the same star shape each time, so the row repeats. Once you know the rule, you can say what comes next before you stamp it.',
    ask: 'Can you say the next three stamps before you make them?',
    pairsWith: 'what-comes-next',
    trial: 'Cut one okra and stamp it on scrap paper. A thick dip fills the star into a blob, so dab once on newspaper first; an old, stringy okra prints a ragged star, so choose firm, fresh pods. Let the cut potato rest face down on kitchen paper for a few minutes, or its wet face will smear.',
    sources: [
      { label: 'NRICH (University of Cambridge) Early Years: Pattern Making', url: 'https://nrich.maths.org/eyfs-activities/pattern-making' },
      { label: 'Wikipedia: Woodblock printing on textiles', url: 'https://en.wikipedia.org/wiki/Woodblock_printing_on_textiles' },
      { label: 'Wikipedia: Sanganer, the Jaipur block-printing town', url: 'https://en.wikipedia.org/wiki/Sanganer' },
    ],
    tags: ['painting', 'printing', 'patterns', 'Jaipur', 'block print', 'bhindi', 'okra', 'rainy day', 'messy play'],
    note: {
      what: 'He stamps the cut end of an okra, which prints a star, and a potato cut into a raised square, in a row that repeats: star, square, star, square. Then he compares his paper with a real hand block-printed cloth from Jaipur.',
      expect: 'The first prints will be blobs or half-stars until he dabs off the extra paint and lifts straight up. Most five-year-olds can keep star, square going; when you stop and ask what comes next, some will name the last thing they stamped instead of the next one. The number of points varies from pod to pod, often five but sometimes more, so let him count rather than telling him.',
      practising: 'A repeating pattern: one unit, here star then square, copied again and again by a rule, so the next piece can be predicted. Also lining up a second row under the first, which is what turns a row into an all-over pattern.',
      ask: 'When the first row is long: “What is the part that keeps repeating?” Let him put a finger round one unit.',
      next: 'Look for printed cloth in the cupboards: Sanganer, near Jaipur, is known for bright patterns on white, and nearby Bagru also prints by hand. On the next Jaipur visit, ask Dadi and Dada to take him to watch a printer at work. Each colour needs its own carved block, cut by a carver; his okra carried the red and his potato the blue.',
      honest: 'Okra printing is vegetable stamping, not block printing. A Jaipur printer presses a carved wooden block, coated in dye, onto cloth, lining each print up with the last so closely that the join is hard to find; on hand-printed cloth you may still spot a slight overlap, and either is fine to find. Continuing star, square with you beside him does not show he can find the rule in a pattern he did not make.',
      easier: 'Use only the okra and two colours of paint: red star, blue star, red star.',
      harder: 'Change the rule to star, star, square, stamp half a row, and ask him to carry it on. Then he makes up a rule and you have to guess it.',
      safety: 'The grown-up does all the cutting and puts the knife away before he sits down. Use washable, non-toxic paint; raw potato and okra are not for eating once they have been in paint. If the two-year-old wants to join, give her a potato half and her own sheet at the far end of the table; keep the okra pieces and the paint saucers out of her reach, as a stubby okra piece is a choking risk.',
    },
  },
  {
    id: 'seven-pieces-one-square',
    area: 'shapes',
    title: 'Seven Pieces from One Square',
    hook: 'Cut one square into seven. Can you put it back?',
    where: 'table',
    minutes: 30,
    need: [
      'a 20 cm square of thick coloured paper, or cut from a manila folder (it must fold cleanly)',
      'sharp scissors for the grown-up',
      'round-tipped children’s scissors for him, if he wants to make the first cut',
      'a pencil',
      'two sheets of paper for the outlines: A4 for the house, and A3 or two A4 sheets taped together for the boat',
    ],
    steps: [
      {
        text: 'Fold the square corner to corner and crease it hard. Cut along the fold: this first cut can be yours.',
        art: 'Arjun, at the dining table, presses a hard crease with both thumbs along the folded edge of a square of blue card folded corner to corner into one big triangle, while Mummy holds out a small pair of children’s scissors with rounded plastic tips, gripping them by the closed blades so the handles point towards Arjun and the tips point back at her.',
      },
      {
        text: 'Watch the grown-up fold and cut the rest. Count the pieces: five triangles, a square and one slanted piece.',
        art: 'The seven card pieces pulled a little apart from the square they were cut from: two big triangles, one middle triangle, two small triangles, one small square and one slanted piece in yellow.',
        figure: 'tangram-2',
      },
      {
        text: 'Put the two small triangles together. Do they make the square? Do they make the middle triangle?',
        art: 'Two small blue triangles laid together exactly cover the outline of the small square; beside it, the same two small triangles exactly cover the outline of the middle triangle.',
        figure: 'tangram-3',
      },
      {
        text: 'Put all seven back into one big square. Start with the two big triangles.',
        art: 'All seven pieces fitted back together into one big square, the two big triangles along the top and the left side.',
        figure: 'tangram-4',
      },
      {
        text: 'Fill the house outline with three pieces. Turn the roof piece round until its long side sits on the walls.',
        art: 'A house: the two big triangles fill the square walls, joined along their long sides, and the middle triangle sits on top as the roof, its long side resting on the walls.',
        figure: 'tangram-5',
      },
      {
        text: 'Fill the boat with all seven. The slanted piece will not fit? Flip it over, like a chapati.',
        art: 'A sailboat of all seven pieces: the two big triangles are the sails, and the hull is a small triangle, the square, the other small triangle, the middle triangle upside down and the yellow slanted piece at the back.',
        figure: 'tangram-6',
      },
    ],
    notice: 'Two small triangles cover the square piece, and they also cover the middle triangle. A piece that does not fit one way often fits once it is turned or flipped.',
    ask: 'Can you cover one big triangle using only smaller pieces?',
    pairsWith: 'turn-it-does-it-fit',
    trial: 'Make one set first from a 20 cm square of scrap paper. Cut the square corner to corner; halve one half into two big triangles; fold the other half’s square corner down to the middle of its long side and cut off the middle triangle. Cut the strip left over across its middle into two equal halves. Cut one half straight down where its top edge ends, giving a square and a small triangle; cut the other from the square-cornered end of its top edge slantwise to the middle of its bottom edge, giving a small triangle and the slanted piece. Check all seven fit back into the square. Then lay the two big triangles as square walls with the middle triangle as a roof, and trace round the outside; lay all seven as a boat with the slanted piece face down, and trace round each piece, so the lines inside show where every piece goes.',
    sources: [
      {
        label: 'Erikson Institute Early Math Collaborative: Build Tangram Shapes with Do-It-Yourself Puzzles',
        url: 'https://www.erikson.edu/early-math-collaborative/idea/build-tangram-shapes-with-do-it-yourself-puzzles/',
      },
      {
        label: 'Erikson Institute Early Math Collaborative: Tangram Puzzles, Make One for Your Kids',
        url: 'https://www.erikson.edu/early-math-collaborative/idea/tangram-puzzles-make-one-for-your-kids/',
      },
      {
        label: 'NRICH (University of Cambridge): The Importance of Shape and Space in the Early Years, Sue Gifford',
        url: 'https://nrich.maths.org/articles/importance-shape-and-space-early-years',
      },
    ],
    tags: ['tangram', 'puzzle', 'paper', 'shapes', 'triangles', 'rainy day', 'quiet', 'no mess', 'travel'],
    note: {
      what: 'You fold and cut a paper square into the seven pieces of a tangram, the old Chinese puzzle. He finds which pieces make which, puts the square back together, then fills a house and a boat outline you traced round the pieces.',
      expect: 'Putting all seven back into the square is hard at five, and hard for plenty of adults: place the two big triangles first and expect to give several hints; finishing it with you is fine. He will push pieces about without turning them at first, and the slanted piece is the usual sticking point, because some outlines need it flipped over, not turned.',
      practising: 'Composing and decomposing shapes: two small triangles make the same shape as the square piece, and the same as the middle triangle. Also turning (rotating) and flipping (reflecting) a piece to fit a space, and the names triangle, square and parallelogram.',
      ask: 'When a piece will not go in: “Is it the wrong piece, or the right piece the wrong way round?”',
      next: 'Borrow Grandfather Tang’s Story by Ann Tompert from the library, a story told with tangram animals, and make one of them together. Keep the pieces in an envelope for car journeys and waiting rooms. Then play Turn It. Does It Fit?',
      honest: 'Rebuilding the square with your hints does not show he can picture a turn in his head; the sign of that is saying which piece will fit, and which way round, before he tries it. Research cited by NRICH found that five-year-olds who were good at picturing which shape two pieces would make tended to do better at maths later; that is a pattern across many children, not a promise that this puzzle will raise his.',
      easier: 'Draw the outline of every piece inside the house, so he matches each piece to its own shape. Or give him only the two big triangles and ask for a square.',
      harder: 'Trace only the outer edge of a cat or a boat that uses all seven pieces, with no lines inside, and keep the puzzle’s rules: every piece used, all touching, none on top of another. Then he makes a figure of his own, you trace round it, and you have to solve his.',
      safety: 'Only the grown-up uses sharp scissors, and puts them away straight after. If he makes the first cut, he uses round-tipped children’s scissors, sitting at the table, along the fold only. The smallest piece is about 7 cm across, too big to swallow whole, but the two-year-old will chew and tear card, and soggy bits can choke: if she joins, give her two big card triangles of her own, stay beside her, and take back any piece that goes in her mouth.',
    },
  },
  {
    id: 'draw-a-map-hide-the-treasure',
    area: 'shapes',
    title: 'Draw a Map, Hide the Treasure',
    hook: 'Your room from the ceiling, a hidden toy, and an X.',
    where: 'table',
    places: ['garden'],
    minutes: 25,
    need: [
      'a large sheet of paper, A3 or two A4 sheets taped together',
      'a pencil, an eraser and two crayons',
      'a clipboard or a big hardback book to lean on',
      'a soft toy about the size of his hand, too big for the two-year-old to put in her mouth',
      'a toy car or a small box',
      'his bedroom, or any room with a few big pieces of furniture',
    ],
    steps: [
      {
        text: 'Stand in the doorway together. Name the big things: bed, cupboard, window, door.',
        art: 'In the doorway of a child’s bedroom, Papa holds a clipboard with a blank sheet of paper against his chest with one hand and points across the room at the bed with the other, while Arjun stands beside him and points at a wooden cupboard against the far wall; a window and a rug are beyond. Papa and Arjun are the only people in the picture, and the room beyond them is empty.',
      },
      {
        text: 'Stand over a toy car and look straight down. From above, it looks like a box. A map shows things that way.',
        art: 'Arjun stands on the bedroom rug with his head bent right over a red toy car on the floor between his feet, looking straight down at its roof, while Papa crouches beside him and traces a rectangle in the air above the car with one finger.',
      },
      {
        text: 'Draw the room from above: walls as a big box, the bed a long box, a gap for the door.',
        art: 'Sitting cross-legged on the bedroom floor with a clipboard across his knees, Papa pencils a big flat rectangle on the clipboard’s blank sheet for the room’s walls, leaving a gap in one side for the door, while Arjun leans over the same clipboard and pencils a long flat rectangle inside it against one wall, glancing up at his real bed. The drawing is only flat pencil lines on the paper.',
      },
      {
        text: 'Wait outside. The grown-up hides the soft toy low down and marks the spot on the map with an X.',
        art: 'Papa kneels and tucks a small brown soft-toy elephant out of sight behind the leg of a low bedside table, only one ear peeking out, holding the clipboard map in his other hand; the map is a simple flat room plan of pencilled rectangles with one big pencilled X beside the small rectangle for the table. Arjun stands in the hallway outside the half-open bedroom door with his back turned.',
      },
      {
        text: 'Find it using only the map. Say where you are going: next to the bed, under the window.',
        art: 'Arjun holds the clipboard map flat in both hands and turns it to line up with the room, looking down at a big pencilled X on a simple room plan of flat rectangles for the bed, the cupboard and the bedside table; then he looks over at the real low bedside table. Papa stands back by the door with his hands in his pockets, saying nothing.',
      },
      {
        text: 'Swap. You hide the toy and draw the X. Can the grown-up find it from your map?',
        art: 'Arjun kneels beside a laundry basket in the corner of the bedroom and pencils a big X onto the map on the clipboard resting on his knee; a small brown soft-toy elephant, no bigger than his hand, is hidden on the floor behind the basket with only the tip of its trunk peeking out past one side. Papa waits in the hallway outside the half-open door with both hands over his eyes.',
      },
    ],
    notice: 'On a map, everything is drawn as if you were looking down from the ceiling, so the bed becomes a box. The X sits next to the same things on the map as the toy does in the room.',
    ask: 'How did the map tell you where to look?',
    trial: 'Draw a quick map of the room yourself first and check that each big thing sits in the right place against the walls and the door: a wrong first map is a confusing one. Then walk the room at his height and pick three hiding places that are low, within reach, and need no climbing.',
    sources: [
      { label: 'NRICH (University of Cambridge) Early Years: Mapping', url: 'https://nrich.maths.org/eyfs-activities/mapping' },
      {
        label: 'The Conversation: Five easy ways to boost children’s spatial skills',
        url: 'https://theconversation.com/five-easy-ways-to-boost-childrens-spatial-skills-101029',
      },
      {
        label: 'Erikson Institute Early Math Collaborative: Big Ideas of Spatial Relationships',
        url: 'https://www.erikson.edu/early-math-collaborative/big-ideas/spatial-relationships/',
      },
    ],
    tags: ['map', 'treasure hunt', 'hide and seek', 'position words', 'bedroom', 'drawing', 'rainy day', 'indoors', 'no mess'],
    note: {
      what: 'You draw his bedroom together as it looks from the ceiling, with boxes for the bed and the cupboard. You hide a soft toy and mark it with an X; he finds it using the map. Then he hides it and draws the X for you.',
      expect: 'He will probably draw the bed and cupboard from the front, with legs and doors, because that is how he sees them; the toy car seen from above helps. He may hold the map at an angle that does not match the room, or run to his favourite hiding place and ignore the map. His own map will likely have an X and few other clues, which you will find out together when you search.',
      practising: 'Representing space: a map is a drawing from one point of view, from above, where a place on the paper stands for a place in the room. Also position words such as next to, between, behind and opposite, and turning the map so it matches the room.',
      ask: 'When he picks up the map: “Which way round should it go, so the door on the paper is by the real door?”',
      next: 'Map the garden, or the walk to the park, with signs you agree on together: a circle for a tree, a square for the swing. When Dadi and Dada next visit, he can hide something for them and draw the map.',
      honest: 'Finding the toy does not show he read the map: he may know the room well enough to guess, or follow your eyes. The test is a hiding place he would not think of, found while you say nothing. Reading maps of places he does not know, and using left and right on them, comes later.',
      easier: 'Draw only three things, the bed, the door and the window, and hide the toy right beside one of them.',
      harder: 'Map the living room, which he knows less well, hide two things marked in two colours, and answer only yes or no to his questions while he searches.',
      safety: 'Hide things only between the floor and his shoulder height: never on top of a wardrobe or shelf, nowhere he would need to climb, and nowhere near sockets, cords or blind strings. If he is happy for the two-year-old to join, she can help you hide the toy, then watch him search; on his turn to hide, keep her outside with you so his hiding place stays his.',
    },
  },
];
