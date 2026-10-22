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
      'two or three steel pots or a kadhai, turned upside down (or a plastic bucket)',
      'two steel pan lids, not glass ones (or two steel plates)',
      'a wooden spoon each (or a plastic spatula)',
      'a few steel tumblers or katoris',
    ],
    steps: [
      'Sit on the kitchen floor with the pots upside down. Play a short beat, such as pot, pot, lid, and he plays it back.',
      'Keep it to five beats or fewer at first. Then play loud and soft, then fast and slow, and he copies those too.',
      'Say the start of teentaal, a common tabla rhythm, as you play: dha dhin dhin dha, one sound to each beat. He copies the words and the beat.',
      'Swap: he plays a beat and you copy it. Then he drums while everyone else marches round the room, to a slow beat first, then a fast one.',
    ],
    hisWay:
      'He becomes the bandleader: he picks who plays which pot, makes up beats for you to copy, and decides when the band plays soft. If he wants to play along to a song, he chooses it, a film song, a bhajan or a nursery rhyme, and you sing while he drums.',
    mia: {
      way: 'joins',
      text: 'Mia gets her own steel tumbler and wooden spoon and bangs along however she likes; nobody waits for her to copy the beat. Sit her across from him, not beside his ear.',
    },
    picture:
      'Arjun beats an upturned steel pot with a wooden spoon on the kitchen floor of the California home, while Papa, cross-legged opposite, holds two steel pan lids ready to copy the beat, and Mia, sitting beside Papa, taps an upturned steel tumbler with her own wooden spoon.',
    cast: ['Arjun', 'Papa', 'Mia'],
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
      next: 'Tap along to the beat of a song he likes on the table after dinner. The next time a dholak or tabla is played at a family gathering, sit close together and watch the drummer\'s hands.',
      honest:
        'Copying four beats is not a measure of musical talent, and a child who misses the pattern may simply be enjoying the noise. It is loud; pick a time that suits the neighbours and Mia\'s nap.',
      easier: 'Play only two or three beats, all on one pot, and let him copy just loud or soft.',
      harder:
        'Make the beat longer, or put a rest in the middle: pot, pot, wait, lid. Or one of you keeps a steady beat while the other plays a pattern on top of it.',
      safety:
        'Play when nothing is cooking, with cold, clean pots and lids from the cupboard, never one that has just been on the hob. Steel lids, not glass ones; wooden spoons only, nothing sharp, and keep loud clashing at arm\'s length from everyone\'s ears, especially Mia\'s. For the march, clear toys off the floor and go barefoot on tiles rather than in socks.',
    },
  },
  {
    id: 'antakshari-for-two',
    group: 'music',
    title: 'Antakshari for Two',
    hook: 'The next song starts with the last sound of the one before.',
    where: 'either',
    energy: 'quiet',
    contact: false,
    minutes: 15,
    setup: 'No setup',
    players: 'You and him',
    need: [],
    steps: [
      "Warm up with words. Say \"aam\" and stretch the last sound, mmm. He finds a word starting with it, like \"mor\". Now you need an r word.",
      'Sing two lines of a song that starts with m, the usual opening sound, such as "Machhli jal ki rani hai". Stop, and say its last sound together: h.',
      'He sings anything he knows that starts with that sound: a nursery rhyme, a film song, a bhajan. Then it is your turn with his last sound.',
      'If he is stuck, count slowly to five. Then a made-up line starting with that sound counts, or you hum the start of a song that fits. Nobody is out.',
    ],
    hisWay:
      'He can change the rule: the next song starts with the first sound instead of the last, or only songs about animals count, or only songs in Hindi. He can also be the judge who says the last sound out loud and decides whether a song fits.',
    mia: {
      way: 'alongside',
      text: 'Mia sits nearby with a rattle, or a steel katori and a spoon, and plays along to any song she likes. She does not take a turn, so his chain never has to start again for her.',
    },
    picture:
      'Arjun sits cross-legged on a charpai in the sunlit Jaipur courtyard, singing with one hand raised to keep time, while Dadi sits beside him with her palms together in a soft clap, leaning in to catch the last sound of his song.',
    cast: ['Arjun', 'Dadi'],
    tradition:
      "Antakshari, from the Sanskrit antya (end) and akshara (letter), is a singing game played in India at family gatherings and on journeys, and made widely known by radio and television shows. In the usual game, two or more players or teams take turns with Hindi film songs or Hindustani classical songs, each starting with the last consonant of the song before; no song may be repeated, and a side that cannot sing is out. This version has two players, accepts any song or rhyme he knows in any language, matches English songs by the sound heard rather than the spelling, allows repeats, accepts a made-up line or a hummed hint after a count of five, and has no winner and nobody out.",
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
    tags: ['songs', 'singing', 'car journey', 'no equipment', 'Hindi', 'grandparents', 'word game', 'sounds'],
    note: {
      what: 'A song chain: each new song or rhyme has to begin with the last sound of the one before. Two of you take turns, and any song he already knows counts.',
      expect:
        'He will probably hear the last sound easily in short words and lose it at the end of a long line. He may sing the same three songs again and again; repeats are allowed in this version. Expect friendly arguments over close sounds, such as k and kh, or b and bh.',
      practising:
        'Hearing the last sound of a word and finding another word that begins with it, which is part of the sound awareness that comes before reading. Also pulling songs out of memory when he needs them.',
      ask: 'When he finds a song for a hard sound: "How did you think of that one?"',
      next: 'Play it on the next long car journey, or on a video call to Jaipur: Dadi and Dada\'s old film songs against his rhymes.',
      honest:
        'Doing well shows he can hear end sounds in songs he knows; it does not mean he is ready to read, and finding it hard does not mean he is behind. English spelling often hides the sound a word ends on, so judge by ear, and do not correct his singing.',
      easier: 'Play with single words only, no songs, and offer him a choice of two: "Does mor or kela start with mmm?"',
      harder:
        'Bring back one of the real rules: no song can be used twice, or each singer must manage a whole verse rather than two lines.',
      safety:
        'Nothing to watch indoors. In the car, whoever is driving sings without turning round. On a walk, hold hands near the road and pause the game to cross.',
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
      'Arjun balances on his left foot beside the sofa in the cleared California living room. His right foot is lifted with its sole pressed against his left knee, and both arms are stretched straight up above his head with his palms pressed together like a tree. On the rug in front of his feet lies a white paper card with a simple black stick figure drawn in the same tree pose: standing on one leg, the other leg bent, both arms straight up. Mummy stands a few steps away holding up a phone in her right hand, her other hand at her side, counting aloud. Mia stands on the rug with both arms stretched out wide to the sides, frozen and smiling.',
    cast: ['Arjun', 'Mummy', 'Mia'],
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
      next: 'Pin his best cards to the fridge, and run musical statues at the next family gathering with everyone in the room, played his way: a wobble means you turn the next card, and nobody is out.',
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
      'Clear a long stretch of rug, hallway or lawn. Call an animal and show its walk once: a crab goes sideways on hands and feet, tummy up.',
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
      'Arjun crab-walks sideways across the back lawn of the California home. His tummy faces the sky, his two hands are flat on the grass behind his shoulders, his two feet are flat on the grass in front, and his bottom is lifted clear off the ground. Papa kneels on the grass nearby and drums on the flat bottom of a steel pot turned upside down on the lawn, striking it from above with a wooden spoon in his right hand, his left hand resting on his knee. Mia stomps along a few steps behind Papa, bending forward with one straight arm hanging down in front of her chest and swinging like an elephant’s trunk, her other arm at her side.',
    cast: ['Arjun', 'Papa', 'Mia'],
    sources: [
      { label: 'Zero to Three: A Year of Play (walk and talk like an animal)', url: 'https://www.zerotothree.org/resource/a-year-of-play/' },
      { label: 'NAEYC for Families: Turn Any Walk into a Nature Walk', url: 'https://www.naeyc.org/our-work/families/turn-any-walk-nature-walk' },
      { label: 'UNICEF Parenting: Screen-free activities (Guess the animal)', url: 'https://www.unicef.org/parenting/child-care/screen-free-activities' },
    ],
    tags: ['rainy day', 'garden', 'animals', 'moving', 'drum', 'beat', 'burn off energy', 'pretend'],
    note: {
      what: 'He moves like one animal after another while you drum a beat to match it, slow and heavy or quick and light. Then he invents an animal and you have to walk like it.',
      expect:
        'Crab and bear walks tire his arms quickly, so expect short bursts and plenty of collapsing on the rug. He will probably speed up whatever the beat does; keeping to a slow beat is the harder part. His invented animals are often the best moment.',
      practising:
        "Moving his body in unfamiliar ways, on hands and feet, and fitting his movement to a beat. Also thinking about how animals get about with bodies very different from ours, which NAEYC suggests asking about on a nature walk.",
      ask: 'After he invents an animal: "Why does your animal move like that?"',
      next: 'On your next walk, stop and watch how a real animal moves, a squirrel, a pigeon or a line of ants, and try it when you get home. On a visit to Jaipur, watch how a peacock walks.',
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
    players: 'You and him',
    need: [],
    steps: [
      'Sit facing each other. Clap a short pattern, such as clap, clap, knees, and he claps it straight back.',
      'Add one clap or knee-pat each round. When it falls apart, laugh, go back to the last one that worked, and he makes the next pattern.',
      'Teach a crossed-hands pattern slowly: clap your own hands, right palm to right palm, own hands, left palm to left palm, then both palms together.',
      'Add a rhyme he knows, Hindi or English, one word to each clap. Say it three times, a little faster each time.',
    ],
    hisWay:
      'He makes the patterns for you to copy and chooses the rhyme. He can add stamps, knee-pats or a click of the tongue, or a rule such as "a clap on the knees means stand up". When you get his pattern wrong, he teaches it to you again.',
    mia: {
      way: 'apart',
      text: 'This goes best one to one, while Papa has Mia at bath time or on a walk, so the two of you can build a pattern without interruptions. Later, if he wants to, he can show her how to clap her knees along with him.',
    },
    picture:
      'Arjun sits cross-legged facing Mummy on the living-room rug of the California home, both of them singing a clapping rhyme, his two palms pressed flat against her two palms in the middle of a clap.',
    cast: ['Arjun', 'Mummy'],
    tradition:
      'The harder version uses January February, a two-player hand game that D\'Source (IIT Bombay) records among Indian children aged three to six: one player stacks their hands palm up on the other\'s, they take turns tapping a hand and naming the months, and on December the player being tapped must snatch a hand away. This version keeps those rules, uses only a light tap, drops the hit that wins the round, and adds a round in the Hindu calendar months, Chaitra to Phalgun, with Phalgun as the snatch; the original does not use them, and D\'Source notes that children usually say the months only in English. The copying game and the crossed-hands rhyme are not adapted from a particular traditional game.',
    sources: [
      {
        label: 'Harvard Center on the Developing Child: Executive Function Activities for 5- to 7-Year-Olds',
        url: 'https://developingchild.harvard.edu/wp-content/uploads/2024/10/Executive-Function-Activities-for-5-to-7-year-olds.pdf',
      },
      { label: "D'Source, IIT Bombay, Indian Games: January February", url: 'https://www.dsource.in/resource/indian-games/indoor-games/january-february' },
      { label: 'Wikipedia: Hindu calendar (the lunar months)', url: 'https://en.wikipedia.org/wiki/Hindu_calendar' },
    ],
    tags: ['clapping', 'rhythm', 'rhymes', 'no equipment', 'waiting', 'car journey', 'months', 'one to one'],
    note: {
      what: 'Copying games with claps: you clap a pattern and he claps it back, one clap longer each round. Then a clapping rhyme with crossed hands, right to right and left to left.',
      expect:
        'He will probably copy how many claps before he copies their order, and the crossed hands will tangle him at first: he may reach with the wrong hand because he is mirroring you. Speeding up breaks the pattern long before he loses interest.',
      practising:
        "Holding a short sequence in mind long enough to play it back, and keeping his hands to a pattern while he says the words. Harvard's guide for ages 5 to 7 lists clapping rhythms as practice for memory and self-control.",
      ask: 'After he makes up a pattern that catches you out: "Can you teach me that one slowly?"',
      next: 'On a video call, ask Dadi or Dada for a clapping rhyme from their own childhood and learn it together, or he teaches them his.',
      honest:
        'Losing a pattern longer than about five claps is common at this age and says nothing about musical ability. Clapping right palm to right palm does not show he knows left from right; he may simply be following your hand across.',
      easier: 'Copy only two or three claps, all on his own hands, with no crossing. Or clap a rhyme on your own knees side by side.',
      harder:
        'Play January February: he rests his hands palm up on yours, and you take turns tapping a hand and naming the next month. On December, the one being tapped snatches a hand away. Then try the Hindu months, with Phalgun as the snatch: Chaitra, Vaishakh, Jyeshtha, Ashadh, Shravan, Bhadrapad, Ashwin, Kartik, Margashirsha, Paush, Magh, Phalgun.',
      safety:
        'Gentle palms only: a clap meets, it does not slap, and small hands sting easily. In January February the tap is light. Outdoors, sit on flat ground rather than on steps, where leaning back after a missed clap means a fall.',
    },
  },
];
