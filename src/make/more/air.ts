import type { Activity } from '../types';

/**
 * Air and flight: air is real stuff that pushes. Each activity asks a distinct
 * question (advisor q7 ruling 16): wind turns the phirki, falling turns the
 * helicopter, a wide canopy slows the parachute, and a full "empty" bottle
 * pushes the paper ball back out.
 */
export const MORE: readonly Activity[] = [
  {
    id: 'which-way-does-the-phirki-turn',
    area: 'air',
    title: 'Which Way Does the Phirki Turn?',
    hook: 'Two phirkis, curled from different tips. Which way will each turn?',
    where: 'table',
    places: ['garden', 'outdoors'],
    minutes: 25,
    need: [
      'two squares of coloured paper, 15 cm a side, one orange and one green (origami paper works well)',
      'a pencil, a ruler and round-ended child scissors',
      'a black felt pen',
      'a lump of play dough or plasticine, to poke holes into',
      'two bendy plastic drinking straws; the grown-up winds a thick ring of sticky tape round each, just above the bend',
      'sticky tape',
      'a large hardback book, to fan with',
    ],
    steps: [
      {
        text: 'Draw lines corner to corner. The grown-up marks each line 3 cm from the middle. Cut from each corner to the mark.',
        art: 'At the kitchen table, Arjun cuts with round-ended child scissors along a pencilled diagonal line on a square of orange paper, from the corner towards the middle, while Mummy holds the opposite corner steady and points with a pencil to the mark where his cut must stop.',
      },
      {
        text: 'Dot every other point, 2 cm in: four dots. The grown-up pokes a pencil hole through each dot and the middle.',
        art: 'Mummy pushes the point of a sharpened pencil through the centre of the cut orange paper square into a lump of play dough underneath, four small holes already made near alternate tips, while Arjun holds two corners of the paper flat on the kitchen table.',
      },
      {
        text: 'From the back, push the straw’s short end through the middle hole. Curl each holed tip in gently and thread it on.',
        art: 'At the kitchen table, Mummy holds one bendy drinking straw upright in her fist, with its long end in her hand and its short end pointing straight up. An orange paper square is pushed onto the straw, so the short end pokes up through the middle of the paper, and she holds it level just above the tabletop. Her other hand rests flat on the table. The square has four deep cuts that run from its corners towards the middle, which make four triangle flaps. The tip of one flap is already curled over and slid onto the top of the straw. Arjun sits beside her and uses both hands to curl the tip of a second flap over towards the middle and push the small hole in that tip down onto the top of the same straw. The straw in Mummy’s fist is the only straw in the picture.',
      },
      {
        text: 'The grown-up tapes the straw’s tip. Dot one blade black. Blow on the front: which way did it go round?',
        art: 'At the kitchen table, Arjun holds a bendy drinking straw upright by its long lower end in one fist. A finished orange paper pinwheel sits on the straw’s top, its blades curled into a swirl at the centre and one blade marked with a big black felt-pen spot. A small tab of clear tape sticks out from the straw’s tip. With his lips pursed a hand’s length from the pinwheel, he blows a puff of air at its front, and the pinwheel turns. Mummy sits beside him at the table and holds a flat green paper square in both hands.',
      },
      {
        text: 'Make a green phirki the same way, but dot and thread the other four tips. Guess: which way will it turn?',
        art: 'At the kitchen table, Arjun curls one corner flap of a green paper square over towards its centre and slides it onto the short end of a bendy drinking straw poking up through the green paper’s middle. The square has deep cuts running from each corner towards the middle. Mummy holds the green paper steady with one hand. On the table beside them lies the finished orange pinwheel on its own bendy straw, its blades curled into a swirl at the centre like a fairground pinwheel.',
      },
      {
        text: 'Hold both up side by side. The grown-up fans them with a big book. Do they turn the same way?',
        art: 'On the sunny patio, Arjun holds the orange phirki on its straw in one hand and the green phirki in the other, side by side at chest height, while Mummy, an arm’s length in front, waves a large hardback book up and down like a fan and both paper wheels spin.',
      },
    ],
    notice: 'Both phirkis spin when air pushes on their curled blades, but the green one, with the other tips curled, turns the opposite way round.',
    ask: 'Apart from the colour, only the curled tips changed. Why did the green one turn the other way?',
    trial: 'Make one alone first; the straw axle is untested in your house until you do. Wind tape round the straw just above the bend until the ring is clearly fatter than a pencil hole, and push the pencil right through so each hole is a little wider than the straw. After threading, fold a short strip of tape round the straw’s tip so it sticks out like a flag. Blow from a hand’s length: if it sticks, twist the pencil in the holes to widen them and leave a few millimetres between the paper and each stopper. Then fan it with the book from an arm’s length; if it barely turns, stand closer or wait for a breeze outside.',
    sources: [
      { label: 'Howtoons (Nick, Saul and Joost), on Arvind Gupta Toys: Pinwheel comic (PDF)', url: 'http://www.arvindguptatoys.com/arvindgupta/pinwheel.pdf' },
      { label: 'American Chemical Society, Inquiry in Action (kindergarten): What Is Wind?', url: 'https://www.acs.org/education/resources/k-8/inquiryinaction/kindergarten/chapter-1/what-is-wind.html' },
    ],
    tags: ['phirki', 'pinwheel', 'wind', 'breezy day', 'paper craft', 'mela', 'mirror image'],
    pairsWith: 'the-kite-needs-some-wind',
    note: {
      what: 'He cuts and curls a paper phirki, a pinwheel, and spins it by blowing. Then he makes a second one with the other four tips curled in, guesses which way it will turn, and tests both side by side.',
      expect: 'The first phirki often sticks, because a hole grips the straw, the paper rubs on a tape stopper, or the tips were creased flat. He will probably guess the second one turns the same way, since it looks the same. Fanned from the front, the two turn opposite ways. Let him take a normal breath between blows: blowing hard again and again can leave him light-headed.',
      practising: 'Moving air pushes on a slanted surface and the pushes turn the wheel; which way the blades slant decides which way it turns. The green phirki is a mirror image of the orange one, so it turns the mirror-image way.',
      ask: 'With the green one finished, before any fanning: “You curled the other tips this time. Which way will it turn?” Let him answer by drawing a circle in the air.',
      next: 'On a breezy day outside, hold a phirki up and turn slowly on the spot until it spins fastest: now he is facing the wind. If you pass wind turbines on a drive, look at which way their blades go round, and look out for phirki sellers at the next mela.',
      honest: 'Getting the second phirki right does not mean he understands why slanted blades turn; he may simply have learnt “other tips, other way”. The Howtoons comic pins its pinwheel to a cork on a chopstick with a tack; the straw axle is our pin-free change, and a phirki that rubs on its straw may not turn at all, which is a build problem, not a wrong answer.',
      easier: 'Make just one phirki and compare a soft puff with a hard blow: which makes it spin faster?',
      harder: 'Hold the phirki still while he stands in front of it, and fan it from behind with the book. Ask him first which way it will turn now, then try it, and accept whatever it does as the answer.',
      safety: 'No pins anywhere: the axle is a straw. You poke the holes, pressing the pencil down into play dough, never into a hand held under the paper. Keep the scissors away from the two-year-old, and if she wants a phirki, stay beside her: the tape stopper can come off in her mouth. Use breath, a fanned book or a breeze, not an electric fan.',
    },
  },
  {
    id: 'why-does-the-helicopter-spin',
    area: 'air',
    title: 'Why Does the Paper Helicopter Spin?',
    hook: 'Nobody blows on it. It spins on the way down anyway.',
    where: 'table',
    places: ['kitchen'],
    minutes: 20,
    need: [
      'a strip of printer paper 5 cm wide and about 21 cm long, cut across the sheet',
      'scissors and a ruler, for the grown-up',
      'a felt pen',
      'one paper clip, plus a small closed tin to keep it in',
      'a clear patch of floor with nothing breakable nearby',
    ],
    steps: [
      {
        text: 'The grown-up cuts an 8 cm slit down from the top, then a 1.5 cm cut in from each side below it.',
        art: 'At the dining table, Papa cuts with scissors down the middle of the top of a long white strip of printer paper to make two flaps, while Arjun holds the bottom end of the strip flat on the table with both hands and watches the cut.',
      },
      {
        text: 'Fold both sides of the lower part in, one over the other. Fold the bottom up and slide on the paper clip.',
        art: 'Arjun slides a silver paper clip onto the folded-up bottom of a narrow paper stem, the two cut flaps still standing straight up at the top, while Papa holds the strip by its top and keeps a small closed tin beside them on the dining table.',
      },
      {
        text: 'Bend one blade towards you and the other away, like a T. Draw a dot on one blade.',
        art: 'Arjun stands on the floor beside the dining table and holds a black felt pen in one hand. He draws a round black dot on one of the two blades at the top of a white paper helicopter, and steadies that blade with the fingertips of his other hand. Papa sits at the table and holds the helicopter upright, at Arjun’s chest height, by the silver paper clip at the bottom of its stem. The helicopter is shaped like a letter Y: a narrow folded paper stem as long as a hand, with the paper clip on its bottom end, and at its top just two paper blades that spread apart, one bent towards Arjun and one bent away. Nothing hangs below the paper clip.',
      },
      {
        text: 'The grown-up stands on the floor, holds it high and lets go. Watch the dot: which way does it go round?',
        art: 'In the living room, Papa stands on the floor with one arm raised straight above his head, about to let go of a white paper helicopter. Between finger and thumb he holds its narrow folded paper stem, which has a silver paper clip on its bottom end and two paper blades bent apart in a T at its top. Arjun stands on the floor a step to one side, looks up and draws a circle in the air with one pointing finger.',
      },
      {
        text: 'Bend each blade the other way. Guess which way it will spin now. Then take turns letting go.',
        art: 'In the living room, Arjun stands on the floor with one arm stretched straight up and his fingers just opened. He is letting go of a white paper helicopter that hangs in the air a little above his hand. The helicopter is shaped like a letter Y: a narrow folded paper stem with a silver paper clip on its bottom end, and at its top just two paper blades that spread apart, one bent forward and one bent back. One of the two blades has a round black dot. Papa crouches on the floor a step away, with his hands on his knees, and looks up at the black dot.',
      },
      {
        text: 'Press both blades together so they point straight up. Drop it again. Does it still spin?',
        art: 'In the living room, Papa stands on the floor with one arm stretched straight up above his head. His thumb and first finger pinch the middle of the narrow folded paper stem of a white paper helicopter, with his fingertips directly on the paper. A silver paper clip is on the bottom end of the stem. The helicopter’s two paper blades are pressed flat against each other and point straight up, so the whole helicopter is one thin upright strip of white paper, a little longer than Papa’s hand, with nothing else attached to it. Arjun stands on the floor a step to Papa’s side, with his hands at his sides, and looks up at it.',
      },
    ],
    notice: 'Nobody blows, yet after a moment’s drop it spins on the way down. Bending the blades the other way makes it spin the other way, and with both blades pressed together it usually drops fast and hardly spins.',
    ask: 'Nobody blew on it. So what made it spin?',
    pairsWith: 'which-one-lands-first',
    trial: 'Make one alone first and drop it from your raised hand. If it falls without spinning, bend the blades further out, closer to level, and check the clip is on; if it tumbles, fold the stem tighter. Printer paper works; card is too heavy.',
    sources: [
      { label: 'Arvind Gupta Toys from Trash: Paper Helicopter (photo steps)', url: 'https://www.arvindguptatoys.com/toys/helicopter.html' },
      { label: 'Science Buddies: Flying Helicopters on Mars (paper helicopter activity)', url: 'https://www.sciencebuddies.org/stem-activities/paper-helicopter' },
      { label: 'NASA JPL Education: Make a Paper Mars Helicopter', url: 'https://www.jpl.nasa.gov/edu/resources/project/make-a-paper-mars-helicopter-2/' },
    ],
    tags: ['paper helicopter', 'spinner', 'rainy day', 'indoor', 'no mess', 'maple seeds', 'falling'],
    note: {
      what: 'You cut a strip of paper and he folds it into a helicopter with a paper clip at the bottom. You drop it from high up, standing on the floor; he watches it spin, then bends the blades the other way and predicts which way it will turn.',
      expect: 'He will probably say the wind or your hand made it spin; there is no wind indoors. Ask him to watch the dot from the side, because seen from underneath the turn looks the opposite way to how it looks from above. With both blades pressed together it usually slides or tumbles down quickly instead of turning.',
      practising: 'A falling thing pushes through air, and the air pushes back. On a slanted blade that push turns it. The phirki needs moving air; the helicopter moves through still air itself, and it is the same push. Which way the blades slant decides which way it turns.',
      ask: 'After the blades-together drop: “It only spins when the blades are bent. What are the bent blades doing?” Accept “the air pushes them” as a good answer.',
      next: 'In autumn, look under a maple tree for its winged seeds and drop one from your hand: it spins as it falls, like the paper one. Then play Which One Lands First?',
      honest: 'Getting the direction right after swapping the blades may just mean he has learnt “other bend, other way”. A short indoor drop is over in about a second, so two helicopters can look the same when they are not; watch the spin, not the landing. Science Buddies suggests a chair or a balcony for a longer drop; this version keeps everyone on the floor.',
      easier: 'Skip the swap. Just drop it with blades bent out and with blades pressed together straight up, and ask which one spun.',
      harder: 'Cut a second helicopter with blades half as long and count a second clip out of the tin. Ask him first which will land first, then let go of both together from the same height, three times, and go by what they do.',
      safety: 'You do all the cutting. Whoever drops it stands on the floor; nobody climbs on a chair, the sofa or the stairs to get higher. He watches from a step to the side, not lying underneath, so the paper clip cannot land on his face. A paper clip can choke the two-year-old: do this while she is elsewhere or with another grown-up, and count the clip out of its tin and back in when you finish.',
    },
  },
  {
    id: 'a-parachute-for-a-paper-clip',
    area: 'air',
    title: 'A Parachute for a Paper Clip',
    hook: 'A bare clip and a clip with a napkin. Let go together.',
    where: 'table',
    places: ['kitchen'],
    minutes: 25,
    need: [
      'a small paper napkin, about 25 cm square when opened out',
      'a large paper dinner napkin, about 40 cm square when opened out',
      'cotton sewing thread, cut by the grown-up into eight pieces about 30 cm long',
      'sticky tape',
      'three large paper clips, counted out of a small tin with a lid',
      'a clear patch of floor with nothing breakable nearby',
    ],
    steps: [
      {
        text: 'Open out the small napkin. Tape one thread firmly to each corner: four corners, four threads.',
        art: 'At the dining table, Arjun presses a strip of sticky tape over the end of a white cotton thread on one corner of an opened-out paper napkin, three more threads lying ready beside it, while Mummy holds the tape roll and tears off the next strip.',
      },
      {
        text: 'Twist the four loose ends together, fold the end into a loop and tape it. Hook a paper clip through.',
        art: 'At the dining table, Mummy holds a small white paper napkin up by the middle of its top so it hangs down like an upside-down bag. Four thin, floppy white cotton threads run down from its corners and are twisted together at the bottom into a small loop wrapped in clear tape. Arjun pushes a large silver paper clip through that loop with both hands. A small closed tin sits on the table beside them.',
      },
      {
        text: 'Stand on the floor, arms up high: parachute in one hand, a bare paper clip in the other. Let go together.',
        art: 'In the living room, Arjun stands on the floor with both arms stretched up high and wide apart, both hands just opening. His left hand pinches the top middle of a small white paper-napkin parachute, whose thin threads hang down to a silver paper clip dangling below it. His right hand, on the far side, pinches one bare silver paper clip with nothing attached. Mummy kneels on the rug a step away and looks down at the floor.',
      },
      {
        text: 'Which landed first? Now the grown-up, standing on the floor, lets go of both from higher up.',
        art: 'Mummy stands on the living-room floor with her arms raised high, having just let go of the small napkin parachute and a bare paper clip together; the napkin opens into a dome as it drifts down, while Arjun, a step to the side, points at the bare clip already on the floor.',
      },
      {
        text: 'Make a second parachute the same way from the big napkin. Guess: will it fall faster or slower?',
        art: 'Arjun tapes a cotton thread to the last corner of a large paper dinner napkin spread across the dining table, the small napkin parachute lying beside it for comparison, while Mummy holds a paper clip ready and waits for his guess.',
      },
      {
        text: 'One parachute in each hand, arms up high. Let go together. Which lands last? Then the grown-up lets go of both.',
        art: 'Arjun stands on the living-room floor with both arms up high, letting go of the small napkin parachute and the large napkin parachute at the same moment, while Mummy kneels beside him with her eyes on the floor, ready to see which lands last.',
      },
    ],
    notice: 'The bare clip hits the floor first. The napkin opens, catches the air and drifts down more slowly. The big napkin usually drifts down slower still, but not every time.',
    ask: 'The parachute is the clip plus a napkin, so it is heavier. Why did it land last?',
    pairsWith: 'which-one-lands-first',
    trial: 'Build one alone and let go of it from your raised hand, standing on the floor, holding the napkin by the middle of its top so the threads hang straight. If it falls as a crumpled streak, shorten the threads to about 20 cm or use a thinner napkin, which opens sooner. Tug each thread to check the tape holds. Race the big and small parachutes from your own height three times: if the big one does not usually land last in your room, keep the bare-clip race and treat the napkin race as a question with either answer.',
    sources: [
      { label: 'Exploratorium Science Snacks: Parachute Plummet', url: 'https://www.exploratorium.edu/snacks/parachute-plummet' },
      { label: 'Arvind Gupta Toys from Trash: Polythene Parachute (photo steps)', url: 'http://arvindguptatoys.com/toys/Polytheneparachute.html' },
    ],
    tags: ['parachute', 'rainy day', 'indoor', 'paper napkin', 'falling', 'air resistance', 'dandelion'],
    note: {
      what: 'He tapes four threads to a paper napkin and hooks a paper clip under it as a passenger. He lets go of the parachute and a bare clip together, then compares a small napkin with a big one.',
      expect: 'From his raised hands the drop is short, so the napkin may only half open; your higher drop gives it more time. He will probably expect the bigger, heavier parachute to fall faster. The bare clip nearly always lands first, and the big napkin usually lands last, though a gust or a twisted thread can spoil a single drop.',
      practising: 'Air is real stuff, and it pushes back on anything moving through it. A wide canopy pushes against more air, so it is slowed more, while the bare clip has almost nothing to push against. Also a fair comparison: let go together, from the same height.',
      ask: 'After the bare clip lands first: “The parachute carries the same clip and a napkin too. Why did it come down last?” Accept “the air held it up” as a good answer.',
      next: 'Next time you change his bed, shake the sheet up high together and let it settle: watch how slowly it comes down. In spring, blow a dandelion clock in the garden and watch the tiny parachutes float off.',
      honest: 'Seeing the parachute land last does not show that he understands air resistance; he may decide the napkin is simply “light”. A drop from standing height lasts about a second, so two parachutes can land almost together: let go of each pair three times and accept whichever lands last. Exploratorium launches from stairs or a balcony; this version keeps everyone on the floor and adds the bare-clip and big-napkin races.',
      easier: 'Skip the build. Let go of a flat paper napkin and a crumpled one together and ask which came down slower.',
      harder: 'Hang two clips under the small parachute instead of one, and ask him first whether it will fall faster or slower. Count the clips back into the tin afterwards.',
      safety: 'Everyone lets go standing on the floor: no stairs, chairs, beds, sofas or balconies, however much higher they would be. Paper clips can choke the two-year-old, so do this while she is elsewhere or with another grown-up, and count the three clips out of the tin and back in at the end. Thread can wrap round a toddler’s neck: put the spool and offcuts away as soon as the threads are cut, and keep the finished parachutes up high afterwards.',
    },
  },
  {
    id: 'can-you-blow-the-ball-in',
    area: 'air',
    title: 'Can You Blow the Ball In?',
    hook: 'A paper ball in the mouth of an empty bottle. Blow. Where does it go?',
    where: 'table',
    places: ['kitchen'],
    minutes: 10,
    need: [
      'an empty, dry, clear plastic water bottle, about 500 ml, cap off',
      'a scrap of paper napkin, about 5 cm square',
      'two drinking straws, one each',
    ],
    steps: [
      {
        text: 'Roll the napkin scrap into a tight little ball, a bit smaller than the bottle’s mouth.',
        art: 'At the dining table, Arjun rolls a scrap of white paper napkin between his palms into a small tight ball, while Papa holds an empty clear plastic water bottle with its cap off beside the ball so they can compare it with the bottle’s mouth.',
      },
      {
        text: 'Lay the bottle on its side on the table. Rest the ball just inside the mouth.',
        art: 'Arjun stands on the floor beside the dining table and leans in to place a small white paper ball just inside the open neck of an empty, dry, clear plastic water bottle. The bottle lies on its side on the tabletop with its mouth pointing towards him and its cap off. Papa sits at the table and holds the bottle still with one hand laid flat on its side. The bottle is completely see-through and empty.',
      },
      {
        text: 'Put your face a hand’s length away. Guess: if you blow hard, where will the ball go?',
        art: 'Arjun stands on the floor at the dining table and leans in so his chin is a hand’s length from the open mouth of an empty, dry, clear plastic water bottle. The bottle lies flat on its side on the tabletop with its mouth facing him, and a small white paper ball rests just inside its neck. He points one finger at the bottle’s mouth to show where he thinks the ball will go. Papa sits at the table and holds the bottle steady on the tabletop with both hands. Only Arjun and Papa are in the picture.',
      },
      {
        text: 'Blow one hard puff straight into the mouth. Where did the ball go? Try it three times.',
        art: 'Arjun, cheeks puffed, blows hard into the mouth of the clear plastic bottle lying on its side, and the small white paper ball flies out of the neck back towards him, while Papa keeps both hands on the bottle and watches the ball.',
      },
      {
        text: 'Last try: hold the straw outside the mouth, aimed right at the ball. One short puff. Does it go in?',
        art: 'Arjun stands on the floor at the dining table and bends down so his face is level with the tabletop. With one hand he holds a white plastic drinking straw to his lips, and its far end stops just outside the open mouth of an empty clear plastic water bottle lying on its side on the table. The straw is aimed at the small white paper ball in the bottle’s neck, and with a short puff the ball rolls inside the bottle. Papa sits at the table and bends down, hands on the tabletop, to look at the ball through the side of the bottle. A plain painted wall is behind them.',
      },
    ],
    notice: 'Blown into the mouth, the ball pops out at him, not in. A short puff through a straw, aimed right at the ball, can push it in.',
    ask: 'The bottle looked empty. So what pushed the ball out?',
    trial: 'Try it alone with the same bottle. The ball should sit loosely in the neck, about as big as a fingertip. If it goes in when you blow into the mouth, make it a little bigger, or you are blowing at the ball instead of into the whole mouth. Then check the straw step: a short puff from just outside the mouth, aimed at the ball, should send it in. If it will not with your bottle, leave that step out.',
    sources: [
      { label: 'UCAR Center for Science Education: Air on the Go (paper wad and bottle)', url: 'https://scied.ucar.edu/activity/air-go-magic-trick' },
    ],
    tags: ['air', 'rainy day', 'no mess', 'quick', 'plastic bottle', 'straw', 'trick'],
    noPair: 'None yet: no game here is about air taking up space.',
    note: {
      what: 'He rests a small paper ball just inside the mouth of an empty plastic bottle lying on its side and blows hard into the mouth: the ball pops out at him. Then he tries one short puff through a straw, aimed right at the ball.',
      expect: 'Nearly everyone, grown-ups included, expects the ball to shoot into the bottle, and he will want to try again and again. A short puff through the straw aimed right at the ball usually sends it in, but not every time.',
      practising: 'An “empty” bottle is full of air, and air takes up space. Blowing in squeezes extra air into the bottle; it has to come back out, and the only way out is the neck, so it pushes the ball out. A narrow puff aimed at the ball pushes on the ball itself and leaves room around it for air to get out.',
      ask: 'After the first puff: “The bottle looked empty. What pushed the ball out?” Accept “air” or “the bottle blew back” as a good start.',
      next: 'At bath time, with you beside the tub, push an empty plastic cup upside down straight into the water: the water cannot fill it, because the air inside is in the way. Then tip the cup and watch the air escape as a bubble. Empty the tub when you finish.',
      honest: 'The ball popping out shows that something comes back out of the bottle; it does not show that he understands air pressure. The straw step is our addition, not part of UCAR’s activity, and a ball that is soggy or the wrong size can spoil any of them.',
      easier: 'Do only the first part: blow into the mouth and watch the ball pop out. Then let him push the ball in with a finger to show where he thought it would go.',
      harder: 'Before the straw step, ask him how he could get the ball in without touching it, and test each of his ideas, tipping the bottle included. Or try UCAR’s own follow-up: on a second bottle, the grown-up pokes a hole in the bottom with a skewer, out of his reach; guess together whether the ball still pops out, and accept whatever it does.',
      safety: 'Use a plastic bottle, never glass. If you try the holed bottle, only you use the skewer, and you put it away at once. A paper ball this small can choke the two-year-old: do this while she is elsewhere or out of reach, and put the ball in the bin at the end. One straw each, no sharing. Take a normal breath between hard puffs and stop after a few: blowing hard over and over can make him dizzy.',
    },
  },
];
