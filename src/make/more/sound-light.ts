import type { Activity } from '../types';

/**
 * Sound, Light and Shadow: what makes a note higher or lower, sound carried
 * through string, sunlight split into colours, and why a shadow grows. The
 * advisor's gap analysis (q7, ruling 15) found sound and light thin beside the
 * one shadow stick; these five each show a different idea.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'water-music',
    area: 'sound-light',
    title: 'Water Music, Inspired by Jal Tarang',
    hook: 'Five steel tumblers, a jug of water and a wooden spoon.',
    where: 'kitchen',
    places: ['table'],
    minutes: 20,
    need: [
      'five matching steel tumblers or steel katoris that ring when tapped',
      'a steel jug with about 1 litre of water, and a small steel cup for him to pour from',
      'a tablespoon, for adding or taking out water a little at a time',
      'a wooden spoon or a chopstick, for tapping',
      'a thin tea towel to stand the tumblers on',
      'a cloth for drips',
    ],
    steps: [
      {
        text: 'Stand the five empty tumblers in a row, not touching. Tap each rim gently with the wooden spoon.',
        art: 'At the kitchen table, Arjun holds a wooden spoon loosely by the end of its handle and taps the rim of the first of five empty steel tumblers standing in a spaced row on a tea towel, while Amma sits beside him with her head tilted towards the tumblers, listening.',
      },
      {
        text: 'Do they sound the same? The grown-up fills the last tumbler about three-quarters full.',
        art: 'At the kitchen table, in a close view of the tabletop, Amma sits at the right end of a row of opaque, shiny stainless-steel tumblers standing apart on a tea towel. She tilts a steel jug with both hands and pours water into the tumbler nearest her, at the right end of the row, filling it about three-quarters full. Arjun stands on the floor at the left end of the row, holding a wooden spoon in his right hand over the empty tumbler nearest him, his left hand resting on the table edge. Amma and Arjun are the only two people in the picture, one at each end of the row, with only the tumblers between them. The view is from slightly above, so the water shows only inside the open top of the tumbler being filled. The tumblers are solid metal with sides you cannot see through.',
      },
      {
        text: 'Tap the empty one, then the full one. Is the note higher, lower, or the same?',
        art: 'Arjun taps the rim of the steel tumbler at the right end of a row of opaque, shiny stainless-steel tumblers with a wooden spoon in his right hand, his left hand cupped behind his left ear to listen. That tumbler is filled high with water, and the surface glints just below the rim. Amma stretches one arm along the row and points with her index finger at the empty steel tumbler at the far left end. Her other hand rests in her lap. The view is from slightly above, so the water shows only inside the open tops. The sides cannot be seen through, and there is no glass.',
      },
      {
        text: 'Pour a little water into the second tumbler, more into the third, more again into the fourth. Tap along the row.',
        art: 'Arjun pours water from a small steel cup, held in both hands, into the tumbler second from the right end of a row of opaque, shiny stainless-steel tumblers on a tea towel, while Amma holds a steel jug in both hands beside him, ready to refill his cup. The view is from slightly above, looking down into the open tops: the tumbler at the left end is empty and dry inside, and each tumbler to its right holds a little more water than the one before, up to a nearly full one at the right end. The tumblers are solid metal with sides you cannot see through, and there is no glass.',
      },
      {
        text: 'Tap one tumbler very softly, then a little harder. Did the note change, or only how loud it is?',
        art: 'Arjun taps one water-filled steel tumbler softly with the wooden spoon, his face close to listen, while Amma sits across the table with her hands in her lap, waiting for him to tap the same tumbler again, a little harder.',
      },
      {
        text: 'Make up a tune. If a note sounds wrong, add a spoonful, or spoon a little back out.',
        art: 'Arjun taps along the row of five steel tumblers with the wooden spoon, from the empty one to the fullest one, a tablespoon resting in the jug beside them, while Amma sits across the table nodding along to his tune, a folded cloth in her hand ready for drips.',
      },
    ],
    notice: 'Changing the water changes the note. Tapping harder makes it louder, but the note stays about the same.',
    ask: 'Which tumbler sings lowest, and what is different about it?',
    pairsWith: 'where-does-sound-come-from',
    trial: 'Tap each tumbler before he sees them, empty and then about three-quarters full. Thin steel rings clearly and changes note; thick or heavy-based ones may only clunk, and a thick towel deadens them. Keep the five that ring longest and change most (three good ones will do if that is all you have); katoris often ring better than tall tumblers.',
    sources: [
      { label: 'Wikipedia: Jal tarang, the Indian instrument of water-tuned bowls', url: 'https://en.wikipedia.org/wiki/Jal_tarang' },
      { label: 'Arvind Gupta Toys: Musical Glass, a wine glass rubbed at the rim, where more water gives a lower note', url: 'http://www.arvindguptatoys.com/toys/musicalglass.html' },
      { label: 'Science Buddies: Musical Bottles, blowing across bottles of water (the harder version)', url: 'https://www.sciencebuddies.org/stem-activities/musical-bottles' },
    ],
    tags: ['music', 'sound', 'jal tarang', 'Indian classical music', 'steel tumblers', 'rainy day', 'kitchen'],
    note: {
      what: 'He taps a row of steel tumblers with a wooden spoon, pours a little more water into each one along the row, and finds out which way the note moves. It is inspired by the jal tarang, an old Indian instrument, heard in classical concerts, of porcelain or bronze bowls tuned with water and struck at the rim with light wooden beaters.',
      expect: 'He may bang at first; a light tap rings clearest. In most steel tumblers the note drops as water goes in, but the change is small until a tumbler is more than half full, and a tumbler touching its neighbour buzzes. He may guess the opposite: a bottle filling at the tap sounds higher and higher.',
      practising: 'Pitch: the tumbler’s steel wall shakes when it is struck, and the water inside moves with it and slows the shaking, so the note is lower. Also telling pitch (high or low) apart from loudness (a soft or a hard tap).',
      ask: 'Once the row is set like steps: “Which one will sing lowest? Tap it and see.”',
      next: 'Find a recording of a jal tarang player such as Anayampatti S. Ganesan or Seetha Doraiswamy and listen together; watch how lightly the beaters touch the bowls. When Paati and Thatha visit, ask them to tap along on the tumblers to a song they know. Then play Where Does Sound Come From?',
      honest: 'Putting the row in order shows he can hear a difference and link it to the water; it does not show he knows why. If your tumblers barely change note, that is the steel, not him. This is not a real jal tarang, which uses a set of porcelain or bronze bowls, as many as the melody needs, tuned and played by a trained musician.',
      easier: 'Use two tumblers only, one empty and one about three-quarters full, and ask which sounds lower.',
      harder: 'Blow across the neck of an empty 500 ml plastic bottle until it hoots, add a cup of water, and blow again. Here the air inside is what shakes, and less air gives a higher note, so the note goes up: the other way to the tumblers. Let him find the difference before you explain it.',
      safety: 'Steel only, no glass. Stay within arm’s reach of him the whole time water is out, keep the jug on your side, wipe drips at once, and empty the tumblers and the jug when you finish. Keep the two-year-old away from the water. Even the “harder” tap stays gentle: a hard blow can tip a tumbler or dent thin steel.',
    },
  },
  {
    id: 'make-a-straw-sing',
    area: 'sound-light',
    title: 'Make a Straw Sing',
    hook: 'Squash it, snip it, blow. Then make it shorter.',
    where: 'table',
    minutes: 15,
    need: [
      'three or four ordinary plastic drinking straws, not creased or bent (paper straws go soggy)',
      'a pair of sharp kitchen scissors (grown-up only)',
      'a small bowl to catch the snipped ends',
      'a felt-tip pen, to mark each person’s straw with a different coloured stripe',
    ],
    steps: [
      {
        text: 'Squash one end of your straw flat, about a thumb’s length along. Run a thumbnail over it so it stays flat.',
        art: 'At the dining table, Arjun holds a plastic drinking straw flat on the table with one hand and runs his thumbnail firmly along a thumb’s length of its squashed end, while Nanna sits beside him holding a second straw of his own, marked with a coloured stripe.',
      },
      {
        text: 'The grown-up snips the flat end into a point, like two small lips.',
        art: 'Nanna holds Arjun’s flattened straw in one hand and snips the corners off its flat end with kitchen scissors in the other, the two tiny pieces falling into a small bowl, while Arjun leans in to watch the pointed tip appear.',
      },
      {
        text: 'Put the pointed end in your mouth, just past your lips. Seal your lips round it and blow hard.',
        art: 'Arjun has the pointed end of the plastic straw just inside his closed lips, cheeks puffed, blowing hard, while Nanna sits across the table with his own pointed straw in his mouth, showing him how far in it goes.',
      },
      {
        text: 'No buzz? Squash the tip flat again, or push it a little further in, and try again.',
        art: 'Arjun takes the straw out of his mouth and pinches its pointed tip flat again between his finger and thumb, while Nanna holds up his own straw and squeezes its tip to show him the two thin lips pressed together.',
      },
      {
        text: 'Take the straw out. The grown-up snips a piece off the far end. Blow again: did the note go up or down?',
        art: 'Nanna snips a short piece off the plain round end of a thin, see-through plastic drinking straw with kitchen scissors in his right hand, his left hand steadying that end. The cut piece drops into an empty small white bowl on the dining table between them. Arjun holds the straw out level with both hands near its other end, which is squashed flat and cut into a tiny V-shaped beak pointing towards his own chest. The straw has one coloured stripe along it and is plastic, not a pencil and not wood.',
      },
    ],
    notice: 'The squashed tip buzzes when you blow. Each time the straw gets shorter, the note goes higher.',
    ask: 'The straw got shorter. Did the note go up or down?',
    pairsWith: 'where-does-sound-come-from',
    trial: 'Make one yourself first, to learn how hard to press and how far in it goes: most straws need firm lips and a strong breath before they buzz. Paper straws go soggy, and a bent or creased plastic straw will not sound, so use a straight one. Snip only with the straw out of his mouth.',
    sources: [
      { label: 'Exploratorium Science Snacks: Straw Oboe', url: 'https://www.exploratorium.edu/snacks/straw-oboe' },
    ],
    tags: ['music', 'sound', 'straw', 'nadaswaram', 'shehnai', 'no mess', 'rainy day', 'quick'],
    note: {
      what: 'He flattens the end of a plastic straw, you snip it into a point, and he blows until it buzzes like a little oboe. Then you snip the straw shorter, a piece at a time, and he blows again after each cut.',
      expect: 'It often takes several tries to get the first buzz, and the straw may squeak, buzz or stay silent; let him keep at it for a minute before you fix the tip. The note jumps up with each snip, and he may laugh at the sound. The buzz can make his lips feel funny.',
      practising: 'Sound comes from vibration. The two cut lips flap open and shut very fast and set the air in the straw shaking; a shorter tube of air shakes faster and gives a higher note. This is how a double-reed instrument such as the nadaswaram works.',
      ask: 'Before the first snip: “If I make it shorter, will the note go up or down?”',
      next: 'Listen to a recording of the nadaswaram, the double-reed pipe played at South Indian weddings and temples, by Sheik Chinna Moulana or T. N. Rajarathnam Pillai, and look for its reed. Then play Where Does Sound Come From?, where a shorter ruler also gives a higher note.',
      honest: 'Hearing the note rise shows him that length changes pitch; it does not show he understands the vibrating air. Some straws will not sound at all, whatever you do; that is the straw.',
      easier: 'Skip the snipping game. Once he gets a buzz, you make him a second straw half as long, and he blows each in turn to compare.',
      harder: 'Snip a small notch halfway along a long straw yourself, then let him cover and uncover it with a finger while he blows. Ask what the hole does to the note.',
      safety: 'Only the grown-up uses the scissors, and only with the straw out of his mouth. One straw each, marked with its own colour; never share a mouthpiece. Every snipped piece goes straight into the bowl and then the bin, because the small sharp bits are a choking hazard for the two-year-old. No running or walking about with a straw in his mouth.',
    },
  },
  {
    id: 'a-coat-hanger-bell',
    area: 'sound-light',
    title: 'A Coat Hanger That Rings Like a Bell',
    hook: 'A clank in the air. A temple bell through the string.',
    where: 'table',
    minutes: 15,
    need: [
      'one thin metal wire coat hanger, unpainted if you have one',
      'two pieces of kitchen string or thin cotton cord, each about as long as his arm (50 cm)',
      'a wooden dining chair, to bump the hanger against the edge of its seat',
      'a steel spoon and a steel fork',
      'a strip of sticky tape, to cover the twisted ends of the hook if they are sharp',
    ],
    steps: [
      {
        text: 'The grown-up ties one string to each bottom corner of the hanger.',
        art: 'Amma sits on a chair at the dining table and, with both hands, ties a piece of kitchen string round the right-hand end of the long straight bottom bar of a thin metal wire coat hanger that lies flat on the tabletop in front of her. The hanger is an ordinary triangle shape: its straight bar runs along the near edge of the table, closest to Amma, and its hook is at the top point, pointing away from her across the table. A second piece of string is already tied round the left-hand end of the same bar and hangs straight down over the near table edge. The two ends of the bar are the only places with string. Arjun stands on the floor on the far side of the table, facing Amma, his chest level with the tabletop, holding the hook still with both hands. The view is from slightly above, so the whole hanger and both knots show clearly.',
      },
      {
        text: 'Wrap the end of each string twice round your pointing fingers. Let the hanger hang.',
        art: 'Arjun stands by the table with the end of one string wound round each of his pointing fingers, his hands apart at chest height, the metal coat hanger hanging upside down below them, while Amma kneels beside him checking the wraps are snug.',
      },
      {
        text: 'Stand beside a wooden chair. Swing the hanger gently so it bumps the edge of the seat. Listen.',
        art: 'Arjun stands beside a wooden dining chair and swings the hanging metal coat hanger gently so it bumps the front edge of the seat, his string-wrapped hands held at chest height away from his head, while Amma kneels nearby with her head turned to listen to the thin clank.',
      },
      {
        text: 'Now press each fingertip on the little flap in front of your ear, not inside. Bump the seat again.',
        art: 'Arjun stands beside a wooden dining chair, leaning forward a little, with both hands raised to the sides of his head and a fingertip resting just in front of each ear. A string wound round each pointing finger runs straight down to the two bottom corners of a thin metal wire coat hanger, which hangs upside down below him, its long bar tapping the front edge of the chair seat. His hands do not touch the hanger, and his face shows surprise at a loud ringing sound. Amma kneels beside him with one fingertip resting just in front of her own ear, showing him where.',
      },
      {
        text: 'Take your fingers away and bump it once more. Which way sounds like a bell?',
        art: 'Two pictures side by side. Left: fingertips pressed to the flaps in front of the ears, the strings running down to a coat hanger that taps a chair edge, with big sound marks reaching the ear. Right: the same tap with the fingers held away from the ears, and only a small sound mark.',
        figure: 'hanger-5',
      },
      {
        text: 'Put your fingertips back on the flaps. The grown-up taps the hanger with a spoon, then a fork.',
        art: 'Amma kneels beside Arjun and taps a hanging thin metal wire coat hanger with a steel spoon in her right hand, holding a steel fork in her left hand. The hanger hangs upside down, hook pointing at the floor, below Arjun’s chin in front of his tummy, from two strings that run straight up from its bottom corners to his pointing fingers. Arjun stands with his eyes closed, the tip of each string-wrapped pointing finger pressed on the small flap just in front of each ear. Nothing covers his ears, and there are no other hangers in the picture.',
      },
    ],
    notice: 'Through the air the hanger only clanks. With the strings pressed to his ears it rings long and deep, like a temple bell.',
    ask: 'The hanger was the same. What carried the sound to your ears this time?',
    pairsWith: 'where-does-sound-come-from',
    trial: 'Try it on yourself first. A thin, unpainted wire hanger rings best; a thick painted or plastic-coated one may only thud. The strings must be pulled tight between hanger and fingers, and the hanger must hang free. With his fingers on his ears, the hanger should reach the edge of a chair seat; shorten the strings if it hangs too low. Check the twisted ends near the hook and tape them if they scratch.',
    sources: [
      { label: 'Exploratorium Science Snacks: Secret Bells', url: 'https://www.exploratorium.edu/snacks/secret-bells' },
    ],
    tags: ['sound', 'vibration', 'coat hanger', 'temple bell', 'no mess', 'rainy day', 'quiet'],
    note: {
      what: 'He hangs a metal coat hanger from two strings wrapped round his fingers and bumps it against the edge of a chair seat, first with his hands held out and then with his fingertips pressed on the flaps in front of his ears.',
      expect: 'The first bump sounds thin and dull. With his fingers on his ears the same bump becomes a long, deep ring, and he may laugh or look round to see where the bell is. If nothing changes, the strings are slack or his fingers have slipped off the flaps.',
      practising: 'Sound is a vibration, and it travels through solids such as string, fingers and the bones of his head more directly than through air, where much of it spreads out and is lost. The hanger, the strings and the bump are all the same both times; only the path to his ear changes.',
      ask: 'After the bell sound: “The hanger was the same. What carried the sound to you this time?”',
      next: 'At the temple, or when Nanna rings the small bell at the pooja shelf, ask him to listen to how long it keeps sounding. At home, put his ear flat on the table while you scratch the far end gently with a fingernail, then lift his head and listen again.',
      honest: 'He hears a big difference; that does not mean he understands that sound travels better through solids. Pressing his ears also shuts out other room noise, which is part of why the ring sounds so clear. This is a short surprise, not a long investigation.',
      easier: 'You hold the strings to his ears for him while he bumps the hanger on the table.',
      harder: 'Swap the hanger for a steel spoon, a fork and a steel ladle, one at a time, and ask him to guess beforehand which will sound deepest.',
      safety: 'Fingertips press on the outside flap of the ear only, never inside the ear. Swing gently and keep the hanger below his chin, away from his eyes. Cover any sharp twisted ends with tape. Strings never go round anyone’s neck. Keep the two-year-old away while the strings are out, and untie them and pack them away as soon as you finish.',
    },
  },
  {
    id: 'a-rainbow-on-the-wall',
    area: 'sound-light',
    title: 'A Rainbow on the Wall',
    hook: 'A box of water, a mirror and a patch of morning sun.',
    where: 'table',
    places: ['kitchen'],
    minutes: 15,
    need: [
      'a clear plastic food box at least 10 cm deep, so sunlight can come in through its side',
      'a jug of tap water, about 1 litre',
      'a small unbreakable mirror about as big as his palm: an acrylic mirror tile or a plastic toy mirror',
      'a sheet of white paper or card',
      'a sunny window with the sun low in the sky, in the morning or late afternoon',
      'an old towel to stand the box on',
    ],
    steps: [
      {
        text: 'Stand the box on the towel, just out of the sun. The grown-up pours in water, about two-thirds full.',
        art: 'On a low table by the sunny living-room window that looks out on the backyard, just outside the patch of morning sunlight, Nanna pours water from a jug into a clear plastic food box standing on an old towel, while Arjun kneels at the table holding a small plastic mirror in both hands, ready.',
      },
      {
        text: 'Lean the mirror inside, away from the window, its bottom half under water. The grown-up slides box and towel into the sun.',
        art: 'In the shade beside the patch of sunlight, Arjun leans a small plastic mirror against the inside of the clear water box on the side away from the window, its bottom half under the water, while Nanna holds two corners of the old towel, ready to slide the box into the sun.',
      },
      {
        text: 'Stand beside the box, out of the sunbeam. Hold the paper up facing the mirror. Look at the paper, not the mirror.',
        art: 'Arjun stands beside the water box, out of the sunbeam, holding a sheet of white paper upright in both hands above the near rim, facing the mirror, while Nanna tilts the plastic mirror in the water with two fingers until a small band of rainbow colours lands on the paper.',
      },
      {
        text: 'Name the colours, starting at the red end. Do they come in the same order each time?',
        art: 'Arjun holds the white paper still with a band of rainbow colours across it, red at one edge and violet at the other, and touches the red stripe with one finger, while Nanna keeps the plastic mirror steady in the water and watches the paper.',
      },
      {
        text: 'Take the paper away. Where does the rainbow land now? Look for it on the wall or ceiling.',
        art: 'Arjun lowers the white paper to his side and points up at a small striped band of rainbow colours on the pale living-room wall above the window, while Nanna keeps two fingers on the plastic mirror in the water box to hold it still.',
      },
      {
        text: 'Now the grown-up lifts the mirror out, keeping its bright patch on the paper. Is the rainbow still there?',
        art: 'Nanna lifts a small palm-sized plastic mirror, dripping water, up out of a clear plastic food box of water on a low living-room table by a sunny window. He holds the mirror by its edges in his right hand so the sunlight bouncing off it makes a plain bright white patch, with no colours in it, on a sheet of white paper. Arjun holds the paper upright in both hands and looks from the white patch to the water box, puzzled. There is no cardboard box and there are no paints.',
      },
    ],
    notice: 'Sunlight bounced off the mirror under water comes out as stripes of colour, always in the same order. With the mirror out of the water, the patch is plain white.',
    ask: 'The sunlight looked white. Where did the colours come from?',
    pairsWith: 'where-will-the-light-go',
    trial: 'Set it up alone on a sunny morning: find which window and mirror angle give a clear rainbow, and where on the wall or ceiling it lands. It moves as the sun moves, so note the time. Strong sun and a shady wall help. If the sun has gone, try a bright LED torch in a dark room: the rainbow is smaller and fainter.',
    sources: [
      { label: 'Met Office for Schools: I Can Make a Rainbow, a DIY activity with a mirror in water', url: 'https://weather.metoffice.gov.uk/learn-about/met-office-for-schools/other-content/make-a-rainbow-diy-activity' },
    ],
    tags: ['rainbow', 'light', 'colours', 'mirror', 'sunny day', 'vaanavillu', 'vaanavil', 'VIBGYOR'],
    note: {
      what: 'He leans a small plastic mirror in a box of water where the sun falls on it, and you tilt it until a little rainbow lands on white paper he holds. He names the colours, finds the rainbow on the wall, and then sees what happens with the mirror out of the water.',
      expect: 'Finding the angle takes a minute or two of slow tilting; the rainbow is often small and faint, and breaks up if the water wobbles. He will want to look into the mirror to see where it comes from, so keep his eyes on the paper or the wall. The red is always at one edge and the violet at the other.',
      practising: 'White sunlight is a mix of colours. When light passes from air into water and out again it bends, and each colour bends by a slightly different amount, so the colours fan out in a fixed order. The mirror only turns the light round; the water does the spreading, which is why the patch is white without it.',
      ask: 'When the patch turns white: “The sun and the mirror are the same. What did the water do?”',
      next: 'Next time you see a rainbow after a winter shower, stand with your backs to the sun and check the colours come in the same order. Nanna can call it a vaanavillu in Telugu and Amma a vaanavil in Tamil; both words end in the word for a bow. Many children in India learn the order as VIBGYOR.',
      honest: 'Seeing the colours and their fixed order is real; that the bending sorts them is a hard idea, and he does not need to explain it. He may see four or five colours, not seven: the bands blend into each other, and seven is a way of naming them. A sky rainbow forms in millions of raindrops, not in one box of water, so this is a model of the idea, not of the sky.',
      easier: 'Leave out the lifting test. Just find the rainbow and let him say which colours he can see.',
      harder: 'Move the paper close to the box and then far away, and ask whether the rainbow grows or shrinks. Then tap the water gently and watch it wobble.',
      safety: 'Never look at the sun, and never look into the mirror while the sun is on it; look only at the wall or paper. Put the mirror in while the box is still in the shade. Never point the bright patch at anyone’s eyes. A grown-up tilts the mirror. Use a plastic or acrylic mirror; if you only have glass, only the grown-up touches it. Stay within arm’s reach of the water the whole time, keep the two-year-old away from it, and empty the box when you finish.',
    },
  },
  {
    id: 'shadow-puppet-show',
    area: 'sound-light',
    title: 'A Shadow Puppet Show, Inspired by Tholu Bommalata',
    hook: 'A card Hanuman, a torch and a sheet. Make him grow.',
    where: 'table',
    minutes: 40,
    need: [
      'an empty cereal box, opened out flat',
      'a pencil and a black felt-tip pen',
      'kitchen scissors (grown-up only)',
      'two blunt wooden chopsticks, for handles',
      'sticky tape',
      'a lump of modelling clay, to poke holes against',
      'a pale, plain bedsheet and two dining chairs',
      'an LED torch, and a stack of books to rest it on',
    ],
    steps: [
      {
        text: 'Draw Hanuman, an elephant or anything you like on the card, about as big as your hand. The grown-up cuts it out.',
        art: 'At the dining table, Arjun draws the outline of Hanuman holding his mace on a flattened cereal box with a black felt-tip pen, while Amma sits beside him holding closed kitchen scissors, ready to cut the figure out when he finishes.',
      },
      {
        text: 'The grown-up pokes holes for an eye and a necklace. Tape a chopstick to the back as a handle.',
        art: 'Amma makes small decorative holes along the necklace of a flat cardboard puppet shape with a pencil point, pressing down into a lump of modelling clay underneath, while Arjun presses a strip of sticky tape over a wooden chopstick laid along the back of a second cardboard cut-out, an elephant.',
      },
      {
        text: 'Hang the sheet over two chair backs. Lay the torch on books behind it, shining at the sheet. Lights off.',
        art: 'In the dimmed living room, Amma drapes a pale plain bedsheet over the backs of two dining chairs that stand apart, while Arjun, a few steps behind the chairs, lays a small battery LED torch on its side on top of a stack of plain hardback books in solid colours with blank, unmarked spines and covers. The torch’s beam lights the sheet. There are no letters or writing on the books or anywhere else in the picture.',
      },
      {
        text: 'Hold the puppet close to the sheet. Is its shadow big or small? Can you see the holes?',
        art: 'Arjun kneels on the floor close to a lit pale bedsheet hung over the backs of two dining chairs. He holds a flat brown cardboard cut-out of Hanuman on a plain wooden chopstick a finger’s width in front of the sheet; one hand grips the bottom of the chopstick and his other hand rests on his knee. The cut-out is the monkey shape itself, with arms, legs and a curled tail; there is no rectangle of card around it and nothing is drawn on it, and it has one small round hole punched for an eye. The chopstick is taped behind it, so only the stick’s lower part shows below the monkey’s feet. Just beside the cut-out, its small, sharp, dark shadow falls on the sheet: the same monkey outline at the same size, with one tiny dot of light where the eye hole lets the light through. A little way behind him, a small battery LED torch, a short plain metal tube, lies on its side on a stack of plain solid-colour books, its beam aimed at the sheet. Amma kneels beside the torch and points with one finger at the dot of light in the shadow.',
      },
      {
        text: 'Now move it slowly back towards the torch. What happens to the shadow?',
        art: 'Seen from the side, with everything in one line from left to right: a small battery LED torch, a short plain metal tube, lies on its side on a low stack of plain solid-colour books on the floor, its lit lens facing right, and its white beam starts at the lens and spreads wider towards the right. A hand’s width to the right of the lens, Arjun kneels on the floor beside the beam and reaches one arm in to hold a flat brown cardboard cut-out of Hanuman upright in the beam on a wooden chopstick. The cut-out is the monkey shape itself, with arms, legs and a curled tail; there is no rectangle of card around it and nothing is drawn on it, and the chopstick is taped behind it, so only the stick’s lower part shows below the monkey’s feet. Far to the right, a pale bedsheet hangs over the backs of two dining chairs, and a huge, soft-edged, plain dark grey shadow with the same monkey outline and curled tail fills most of the sheet. Amma kneels behind Arjun with her hands on her knees, looking at the big shadow.',
      },
      {
        text: 'Put on a show. Hanuman grows huge for his leap to Lanka, then shrinks tiny to creep in.',
        art: 'Arjun kneels on the floor beside a small battery LED torch, a short plain metal tube lying on its side on a stack of plain solid-colour books, its lens facing a pale bedsheet hung over the backs of two dining chairs. He holds a flat brown cardboard cut-out of Hanuman on a wooden chopstick up in the torch’s white beam, a little in front of the lens, with its arms and legs spread as if leaping. The cut-out is the monkey shape itself, with a curled tail; there is no rectangle of card around it and nothing is drawn on it, and the chopstick is taped behind it. On the lit sheet, a giant flat shadow with exactly the cut-out’s leaping outline and curled tail fills most of the sheet. The shadow is solid, even dark grey all over, like a shape cut from grey paper. Amma kneels on the other side of the torch with her hands on her knees, smiling up at the shadow.',
      },
    ],
    notice: 'Near the sheet the shadow is small and sharp. Near the torch it is big and blurry. The holes show as bright dots.',
    ask: 'The card Hanuman stayed the same size. What made his shadow grow?',
    pairsWith: 'where-will-the-light-go',
    trial: 'Set up the sheet and torch once in the dark before he joins. Check that a hand near the sheet gives a sharp shadow and that the shadow grows as it moves back. A small, bright LED torch gives crisper edges than a wide lantern; a thick or patterned sheet hides the shadow, so try a thin pale one.',
    sources: [
      { label: 'Wikipedia: Tholu bommalata, the shadow puppet theatre of Andhra Pradesh', url: 'https://en.wikipedia.org/wiki/Tholu_bommalata' },
      { label: 'Wikipedia: Tholpavakoothu, the shadow puppet theatre of Kerala', url: 'https://en.wikipedia.org/wiki/Tholpavakoothu' },
      { label: 'Zero to Three: 5 Ways to Play with Sheets, including shadow play with a torch', url: 'https://www.zerotothree.org/resource/5-ways-to-play-with-sheets/' },
    ],
    tags: ['shadow', 'puppets', 'Ramayana', 'Hanuman', 'torch', 'evening', 'rainy day', 'Dasara', 'tholu bommalata', 'storytelling'],
    note: {
      what: 'He makes a card puppet on a chopstick, holds it between a torch and a hanging sheet, and finds that moving it towards the torch makes the shadow grow. Then he tells a short story with it. It is inspired by Tholu Bommalata, the Telugu shadow-puppet theatre of Andhra Pradesh (the name means the dance of leather puppets), and Tholpavakoothu of Kerala, where large leather puppets, cut with patterns of holes, play the Ramayana behind a white cloth screen lit from behind; in Kerala the light comes from 21 lamps in coconut halves or clay lamps.',
      expect: 'He may expect the shadow to grow as the puppet gets nearer the sheet; it does the opposite, and he may test it many times. Near the torch the edge also goes blurry. He will want to make shadows with his own hands too; let him, facing the sheet, not the torch. A dark room is exciting, so expect giggles and a burst of energy.',
      practising: 'Light travels in straight lines, so the puppet blocks a patch of it and leaves a shadow. Near the torch it blocks a wider part of the spreading beam, so the shadow is bigger; the holes let light straight through. Also telling a story in order, with a beginning, a middle and an end.',
      ask: 'When Hanuman is near the torch: “He is the same card. Why is his shadow so big now?”',
      next: 'Look together for a video of a Tholu Bommalata or Tholpavakoothu performance, or ask Tatayya on a video call whether he saw one as a boy, and look at whether the puppeteers keep the puppets pressed to the screen or bring them back towards the lamps. A full Tholpavakoothu Ramayana in a Kerala temple can take 21 days. Then play Where Will the Light Go?',
      honest: 'Making Hanuman grow does not mean he understands that light travels in straight lines; he may say the torch “pushes” the shadow. This is a home shadow game borrowed from a tradition, not Tholu Bommalata itself, which is a skilled art with jointed puppets, singing and drums.',
      easier: 'Skip making the puppet. Use a toy animal or his hands, and just find where the shadow is biggest and where it is smallest.',
      harder: 'Make a big card Ravana and a small Hanuman. Ask him to make the small Hanuman’s shadow look bigger than Ravana’s, and then to say how he did it.',
      safety: 'An LED or battery torch only: never a candle, an oil lamp or any flame, and not a hot halogen lamp. Check the torch’s battery cover is shut tight. Never shine the torch into anyone’s eyes. The grown-up does the cutting and the hole-poking. Stand the chairs so they will not tip when the sheet is tugged. Clear the floor before the lights go off, keep a door open to a lit hallway, and no running in the dark or with a chopstick. If the two-year-old watches, she sits on a second grown-up’s lap, away from the chairs, the sheet and the chopsticks.',
    },
  },
];
