import type { PlayIdea } from '../types';

/**
 * Music and moving: rhythm, songs, dancing and moving like something else. The
 * advisor ruled that Antakshari be played with songs he already knows and that
 * an adapted traditional game says exactly what it changes. Nobody is ever out,
 * and the loudest play stays away from Mia's ears.
 */
export const IDEAS: readonly PlayIdea[] = [
  {
    id: 'kitchen-band',
    group: 'music',
    title: 'The Kitchen Band',
    hook: 'Upturned pots, two lids, a wooden spoon each. Copy my beat.',
    where: 'indoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to fetch pots and spoons',
    players: 'You, him and Mia',
    need: [
      'two or three steel pots, or the idli pot without its stand, turned upside down (or a plastic bucket)',
      'two steel pan lids, not glass ones (or two steel plates)',
      'a wooden spoon each (or a plastic spatula)',
      'a few steel tumblers or katoris',
    ],
    steps: [
      'Sit on the kitchen floor with the pots upside down. Play a short beat, such as pot, pot, lid, and he plays it back.',
      'Keep it to five beats or fewer at first. Then play loud and soft, then fast and slow, and he copies those too.',
      'Say Carnatic rhythm syllables as you play, as a mridangam teacher does: ta ka dhi mi, one sound to each beat. He copies the words and the beat.',
      'Swap: he plays a beat and you copy it. Then he drums while everyone else marches round the room, to a slow beat first, then a fast one.',
    ],
    hisWay:
      'He becomes the bandleader: he picks who plays which pot, makes up beats for you to copy, and decides when the band plays soft. If he wants to play along to a song, he chooses it, a Telugu or Tamil film song, Chandamaama raave or a nursery rhyme, and you sing while he drums.',
    mia: {
      way: 'joins',
      text: 'Mia gets her own steel tumbler and wooden spoon and bangs along however she likes; nobody waits for her to copy the beat. Sit her across from him, not beside his ear.',
    },
    picture:
      'On the floor of the open kitchen of the Bay Area house, with steel tumblers and plates on the counter behind and the pressure cooker on the shelf, Arjun beats an upturned steel pot with a wooden spoon, while Nanna, cross-legged opposite, holds two steel pan lids ready to copy the beat, and Mia, sitting beside Nanna, taps an upturned steel tumbler with her own wooden spoon. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    sources: [
      { label: 'NAEYC for Families: Playing Music at Home', url: 'https://www.naeyc.org/our-work/families/playing-music-home' },
      { label: 'UNICEF Parenting: Screen-free activities (Family band)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
    ],
    tags: ['rainy day', 'rhythm', 'drums', 'pots and pans', 'kitchen', 'copying', 'loud'],
    note: {
      what: 'A band made from the kitchen cupboard. You play a short beat and he copies it, then he makes beats for you, and the band marches to his drum.',
      expect:
        'He will probably hit as hard and as fast as he can at first, and copy the number of beats before their pattern. Playing softly is usually harder for him than playing loudly, and slowing down harder than speeding up.',
      practising:
        'Listening to a short pattern of sounds and playing it back, and controlling how hard and how fast he hits. NAEYC suggests copying patterns of five beats or fewer before trying longer ones.',
      ask: 'After he has copied a soft beat well: "How did you make it so quiet?"',
      next: 'Tap along to the beat of a song he likes on the table after dinner. The next time a mridangam is played, at a temple concert or a cousin\'s dance recital, sit close together and watch the drummer\'s hands.',
      honest:
        'Copying four beats is not a measure of musical talent, and a child who misses the pattern may simply be enjoying the noise. It is loud; pick a time that suits the neighbours and Mia\'s nap.',
      easier: 'Play only two or three beats, all on one pot, and let him copy just loud or soft.',
      harder:
        'Make the beat longer, or put a rest in the middle: pot, pot, wait, lid. Or one of you keeps a steady beat while the other plays a pattern on top of it.',
      safety:
        'Play when nothing is cooking, with cold, clean pots and lids from the cupboard, never one that has just been on the stove. Steel lids, not glass ones; wooden spoons only, nothing sharp, and keep loud clashing at arm\'s length from everyone\'s ears, especially Mia\'s. For the march, clear toys off the floor and go barefoot on the kitchen floor rather than in socks.',
    },
  },
  {
    id: 'antakshari-for-two',
    group: 'music',
    title: 'Antakshari for Two',
    hook: 'Each new song starts where the one before it ended.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You and him',
    need: [],
    steps: [
      "Warm up with words. Say \"drum\" and stretch the last sound, mmm. He finds a word starting with it, like \"moon\". Now you need an n word.",
      'Sing a line of a song he knows: "Nilaa nilaa odi vaa". A Tamil or Telugu line passes on the consonant of its last syllable: "vaa" passes v.',
      'An English rhyme passes on the last sound he hears instead: "Baa, baa, black sheep", sung to the end, finishes "down the lane", which passes n, not e.',
      'You say which sound is passed on. He sings anything he knows starting with it: a nursery rhyme, a Telugu or Tamil film song, a bhajan. Then you sing.',
      'If he is stuck, count slowly to five. Then a made-up line starting with that sound counts, or you hum the start of a song that fits. Nobody is out.',
    ],
    hisWay:
      'He can change the rule: the next song starts with the first sound instead of the last, or only songs about animals count, or only songs in Tamil. He can also be the judge who decides whether a new song starts with the right sound.',
    mia: {
      way: 'alongside',
      text: 'Mia sits nearby with a rattle, or a steel katori and a spoon, and plays along to any song she likes. She does not take a turn, so his chain never has to start again for her.',
    },
    picture:
      'On the sunny patio of the Bay Area house, beside the potted curry-leaf plant, with the backyard lawn and the lemon tree behind, Arjun sits cross-legged on a cotton mat, singing with one hand raised to keep time, while Thatha, visiting, sits beside him on a low patio chair with his palms together in a soft clap, leaning in to catch the last sound of the song.',
    cast: ['Arjun', 'Thatha'],
    tradition:
      "Antakshari, from the Sanskrit antya (end) and akshara (letter), is a singing game played in India at family gatherings and on journeys, and made widely known by radio and television shows. In the usual game, two or more players or teams take turns with Hindi film songs or Hindustani classical songs, each starting with the last consonant of the song before; songs in other languages are allowed if everyone agrees first. No song may be repeated, and a side that cannot sing is out. This version has two players, accepts any song or rhyme he knows in Telugu, Tamil, English or Hindi, keeps the last-consonant rule for songs in Indian languages but matches English rhymes by the last sound heard rather than the spelling, allows repeats, accepts a made-up line or a hummed hint after a count of five, and has no winner and nobody out.",
    sources: [
      { label: 'Wikipedia: Antakshari', url: 'https://en.wikipedia.org/wiki/Antakshari' },
      {
        label: 'Hindustan Times: Annu Kapoor and Pallavi Joshi on the Antakshari TV show',
        url: 'https://www.hindustantimes.com/tv/antakshari-annu-kapoor-pallavi-joshi-share-memories-of-iconic-musical-show/story-JoOrFIY2UYIwhb6VhOIkEJ.html',
      },
      {
        label: 'Understood.org: Phonological awareness, what it is and how it works',
        url: 'https://www.understood.org/en/articles/phonological-awareness-what-it-is-and-how-it-works',
      },
    ],
    tags: ['songs', 'singing', 'car journey', 'no equipment', 'Telugu', 'Tamil', 'grandparents', 'Thatha', 'word game', 'sounds'],
    note: {
      what: 'A song chain: each new song or rhyme has to begin where the one before ended. A Telugu, Tamil or Hindi song passes on the consonant of its last syllable, as in the traditional game; an English rhyme passes on the last sound he hears. Two of you take turns, and any song he already knows counts.',
      expect:
        'Expect to name the passed-on letter or sound for him each time; finding a song that starts with it is his part. English lines that end on a vowel, such as "sky", are awkward to pass on, so stop at a line that ends on a clear consonant. He may sing the same three songs again and again; repeats are allowed in this version. Expect friendly arguments over close sounds, such as k and g, or t and d, which Tamil writes with the same letter.',
      practising:
        'Hearing the sound a word begins with and finding a song that starts with it; Understood.org says sound awareness, the groundwork for reading, starts with rhyming and beginning sounds. Also pulling songs out of memory when he needs them. Working out the last consonant of a Telugu or Tamil line is a rule of the grown-ups\' game: you call it, and he is not expected to.',
      ask: 'When he finds a song for a hard sound: "How did you think of that one?"',
      next: 'Play it on the next long drive while Paati and Thatha are visiting: their old Tamil film songs against his rhymes. On a video call, Nanamma and Tatayya can bring Telugu ones.',
      honest:
        'Finding a song for a sound shows he can hear how familiar words begin and recall a song to fit; it does not mean he is ready to read, and finding it hard does not mean he is behind. English spelling often hides the sound a word ends on ("lane" passes n, not e), so judge English rhymes by ear, and do not correct his singing.',
      easier: 'Play with single words only, no songs, and offer him a choice of two: "Does moon or sun start with mmm?"',
      harder:
        'Bring back one of the real rules: no song can be used twice, or each singer must manage a whole verse rather than two lines.',
      safety:
        'Nothing to watch indoors. In the car, whoever is driving sings without turning round to the car seats. On a walk, hold hands near the road and pause the game to cross.',
    },
  },
  {
    id: 'freeze-in-the-shape',
    group: 'music',
    title: 'Dance, Then Freeze in the Shape',
    hook: 'When the music stops, turn a card and freeze like the drawing.',
    where: 'indoors',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Five minutes to draw the cards and clear a space',
    players: 'You, him and Mia',
    need: [
      'music on a phone or speaker (or you sing and stop)',
      'six to eight scraps of card or paper',
      'a pencil or crayon',
    ],
    steps: [
      'Draw the pose cards together first: he draws stick figures, arms up, one foot up, a crouch, a star, a tree. Shuffle them face down.',
      'Play a song and everyone dances, fast or slow as you call it.',
      'Stop the music and flip a card. Everyone freezes in that shape while you count slowly to five together.',
      'Anyone who wobbles before five simply turns the next card. Nobody sits out. After a few rounds, hand him the phone: he runs the music.',
    ],
    hisWay:
      'He draws new cards whenever he likes, and his are the rules: a shape you have to do with a partner, an animal, a pose that is nearly impossible. As music boss he chooses the songs, when to stop, and how long the count lasts.',
    mia: {
      way: 'joins',
      text: 'Mia dances and freezes in any shape she likes; the cards are for him and you. Whatever she does when the music stops counts as her statue.',
    },
    picture:
      'Arjun stands frozen in a star shape on the rug of the cleared living room of the Bay Area house, the sofa pushed back against the bookshelves: both feet planted wide apart on the rug, both arms stretched up and out wide above his shoulders with open hands, grinning and holding still. On the rug in front of his feet lies a white paper card with a simple black stick figure drawn in the same star shape: a round head, both arms stretched up and out wide, both legs spread wide apart. Amma stands a few steps away, holding up a phone in her right hand with her other hand at her side, counting aloud. Mia stands on the rug a little way off with both hands on top of her head, frozen and smiling. No writing anywhere in the picture. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.',
    cast: ['Arjun', 'Amma', 'Mia'],
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 3- to 5-Year-Olds',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-3-to-5-year-olds.pdf',
      },
    ],
    tags: ['rainy day', 'dancing', 'musical statues', 'freeze dance', 'drawing', 'stop and go', 'self-control'],
    note: {
      what: 'Musical statues with a twist: when the music stops, a card he drew shows the shape everyone must freeze in, and you all hold it for a count of five.',
      expect:
        'He may freeze a beat after the music at first, and the card will slow him down while he works out which way round the drawing goes. One-foot shapes are the hardest to hold straight after dancing; some rounds he will make five and some he will not. He will soon want to draw harder cards than he can hold.',
      practising:
        "Stopping on a signal, then switching his attention from the dancing to a picture and turning it into a pose. Harvard's activity guides suggest freezing in particular positions as a harder version of freeze dance.",
      ask: 'When he holds a hard shape all the way to five: "What did you do to stay still?"',
      next: 'Pin his best cards to the fridge, and run musical statues at the next Deepavali get-together or birthday party with everyone in the room, played his way: a wobble means you turn the next card, and nobody is out.',
      honest:
        'Holding a pose for five counts shows he can do it in this game, with music he likes; it does not show how well he stops himself at school or in a temper. Balance at five varies a lot, so wobbling is not a problem to fix.',
      easier: 'Skip the cards and just freeze in any shape. Or call a shape out loud as the music stops: "Freeze like a tree!"',
      harder:
        'Turn two cards and freeze in a shape that is half of each, or count to ten. Or do the opposite of the card: if it shows arms up, freeze with arms down.',
      safety:
        'Push back the coffee table and anything with corners, and pick up toys first. Bare feet or grippy socks on hard floors, not ordinary socks. Do one-foot shapes beside a wall or the sofa.',
    },
  },
  {
    id: 'walk-like-the-animals',
    group: 'music',
    title: 'Walk Like the Animals',
    hook: 'Crab, bear, frog, elephant, peacock: move like each one, to a beat.',
    where: 'either',
    energy: 'active',
    contact: false,
    minutes: 15,
    setup: 'Two minutes to clear a stretch of floor or lawn',
    players: 'You, him and Mia',
    need: ['an upturned pot and a wooden spoon to drum on (or just clap)'],
    steps: [
      'Clear a long stretch of rug, hallway or backyard lawn. Call an animal and show its walk once: a crab goes sideways on hands and feet, tummy up.',
      'Drum on the upturned pot while he moves: quick light taps for the crab, a slow heavy beat for an elephant swinging one arm as its trunk.',
      'Try more: a bear on hands and feet with its bottom up, a frog squatting and jumping, a peacock strutting with hands fanned behind like a tail.',
      'Swap: he invents an animal walk and teaches it to you. You walk it exactly as he says, however odd, while he drums.',
    ],
    hisWay:
      'He calls the animals and makes up new ones: a snake sliding on its tummy, a camel with a slow sway, a kangaroo carrying something in its pouch. With the spoon in his hand he sets the beat, changes it halfway, and decides when every animal freezes.',
    mia: {
      way: 'joins',
      text: 'Mia stomps along as the elephant or a slow tortoise at her own pace, on the side away from the frog jumps. She does not have to copy his animal, and he does not wait for her.',
    },
    picture:
      'On the backyard lawn of the Bay Area house, by the wooden fence and the raised vegetable beds, Arjun stomps along on all fours with his bottom high in the air and his arms and legs straight, walking like a bear, grinning, while Nanna kneels on the grass beating an upturned steel cooking pot with a wooden spoon, and Mia waddles a few steps to the side of Arjun, flapping her arms like a duck. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun’s head about level with Mia’s, sitting on his heels lower.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    sources: [
      { label: 'Zero to Three: A Year of Play (walk and talk like an animal)', url: 'https://www.zerotothree.org/resource/a-year-of-play/' },
      { label: 'NAEYC for Families: Turn Any Walk into a Nature Walk', url: 'https://www.naeyc.org/our-work/families/turn-any-walk-nature-walk' },
      { label: 'UNICEF Parenting: Screen-free activities (Guess the animal)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
    ],
    tags: ['rainy day', 'backyard', 'garden', 'animals', 'moving', 'drum', 'beat', 'burn off energy', 'pretend'],
    note: {
      what: 'He moves like one animal after another while you drum a beat to match it, slow and heavy or quick and light. Then he invents an animal and you have to walk like it.',
      expect:
        'Crab and bear walks tire his arms quickly, so expect short bursts and plenty of collapsing on the rug. He will probably speed up whatever the beat does; keeping to a slow beat is the harder part. His invented animals are often the best moment.',
      practising:
        "Moving his body in unfamiliar ways, on hands and feet, and fitting his movement to a beat. Also thinking about how animals get about with bodies very different from ours, which NAEYC suggests asking about on a nature walk.",
      ask: 'After he invents an animal: "Why does your animal move like that?"',
      next: 'On your next walk, stop and watch how a real animal moves, a squirrel on the fence, a crow, a hummingbird or a line of ants, and try it when you get home. On a visit to Hyderabad, look for peacocks in a city park and watch how one walks.',
      honest:
        'Walking like a crab does not teach him much about crabs; the walks are a guess from pictures, which is fine for a game. Some children find the all-fours walks hard work and stop quickly, so let him keep to the standing animals if he prefers.',
      easier: 'Only standing animals: elephant, peacock, penguin, camel. Drop the drum and just call the animal.',
      harder:
        'Change the beat partway across and he changes speed without stopping. Or stop drumming without warning, and every animal freezes until the beat starts again.',
      safety:
        'Clear toys and furniture corners first. Frog jumps on grass or a rug that does not slide, never on bare tiles, near steps or by glass doors. Keep Mia out of the path of crab and bear walks, which move without looking where they go. Outdoors, check the lawn for sharp sticks and droppings before he puts his hands down.',
    },
  },
  {
    id: 'clap-it-back',
    group: 'music',
    title: 'Clap It Back',
    hook: 'I clap a pattern, you clap it back. Then a rhyme with crossed hands.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 5,
    setup: 'No setup',
    players: 'You and him; another grown-up with Mia',
    need: [],
    steps: [
      'Sit facing each other. Clap a short pattern, such as clap, clap, knees, and he claps it straight back.',
      'Add one clap or knee-pat each round. When it falls apart, laugh, go back to the last one that worked, and he makes the next pattern.',
      'Teach a crossed-hands pattern slowly: clap your own hands, right palm to right palm, own hands, left palm to left palm, then both palms together.',
      'Add a rhyme he knows, in Telugu, Tamil or English, one word to each clap. Say it three times, a little faster each time.',
    ],
    hisWay:
      'He makes the patterns for you to copy and chooses the rhyme. He can add stamps, knee-pats or a click of the tongue, or a rule such as "a clap on the knees means stand up". When you get his pattern wrong, he teaches it to you again.',
    mia: {
      way: 'apart',
      text: 'This goes best one to one, while Nanna has Mia at bath time or on a walk, so the two of you can build a pattern without interruptions. Later, if he wants to, he can show her how to clap her knees along with him.',
    },
    picture:
      'Arjun sits cross-legged facing Amma on the rug in the living room of the Bay Area house, by the bookshelves of picture books, both of them singing a clapping rhyme, his two palms pressed flat against her two palms in the middle of a clap.',
    cast: ['Arjun', 'Amma'],
    tradition:
      'The harder version uses January February, a two-player hand game that D\'Source (IIT Bombay) records among Indian children aged three to six: one player stacks their hands palm up on the other\'s, they take turns tapping a hand and naming the months, and on December the player being tapped must snatch a hand away. This version keeps those rules, uses only a light tap, drops the hit that wins the round, and adds a round in the Tamil months, Chithirai to Panguni, or the Telugu months, Chaitramu to Phalgunamu, with the last month as the snatch; the original does not use them, and D\'Source notes that children usually say the months only in English. The copying game and the crossed-hands rhyme are not adapted from a particular traditional game.',
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      { label: 'NAEYC for Families: Playing Music at Home', url: 'https://www.naeyc.org/our-work/families/playing-music-home' },
      { label: "D'Source, IIT Bombay, Indian Games: January February", url: 'https://www.dsource.in/resource/indian-games/indoor-games/january-february' },
      { label: 'Wikipedia: Hindu calendar (the Telugu month names and the Tamil solar months)', url: 'https://en.wikipedia.org/wiki/Hindu_calendar' },
    ],
    tags: ['clapping', 'rhythm', 'rhymes', 'no equipment', 'waiting', 'car journey', 'months', 'one to one'],
    note: {
      what: 'Copying games with claps: you clap a pattern and he claps it back, one clap longer each round. Then a clapping rhyme with crossed hands, right to right and left to left.',
      expect:
        'He will probably copy how many claps before he copies their order, and the crossed hands will tangle him at first: he may reach with the wrong hand because he is mirroring you. Speeding up is usually what breaks the pattern, and the muddle is often the funny part.',
      practising:
        "Holding a short sequence in mind long enough to play it back, and keeping his hands to a pattern while he says the words. Harvard's activity guide for ages 5 to 7 suggests complicated clapping rhythms as practice for working memory, self-control and flexible thinking; the copying rounds here are a simpler start, and a game is practice, not a measure of any of these.",
      ask: 'After he makes up a pattern that catches you out: "Can you teach me that one slowly?"',
      next: 'When Nanamma visits, ask her for Chemma chekka, the Telugu clapping song (it is under Sing in Telugu & Tamil), and learn it together. Then ask Paati what she clapped to as a girl.',
      honest:
        'Losing the pattern once it grows long is part of the game, not a measure of musical ability; NAEYC suggests starting with five beats or fewer before longer patterns. Clapping right palm to right palm does not show he knows left from right; he may simply be following your hand across.',
      easier: 'Copy only two or three claps, all on his own hands, with no crossing. Or clap a rhyme on your own knees side by side.',
      harder:
        'Play January February: he rests his hands palm up on yours, and you take turns tapping a hand and naming the next month. On December, the one being tapped snatches a hand away. Then try the Tamil months, with Panguni as the snatch: Chithirai, Vaikasi, Aani, Aadi, Aavani, Purattasi, Aippasi, Karthigai, Margazhi, Thai, Maasi, Panguni. Nanna can play it in the Telugu months, Chaitramu to Phalgunamu.',
      safety:
        'Gentle palms only: a clap meets, it does not slap, and small hands sting easily. In January February the tap is light. Outdoors, sit on flat ground rather than on steps, where leaning back after a missed clap means a fall.',
    },
  },
];
