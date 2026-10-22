import type { Moment } from '../types';

/**
 * Doing things together: bath, a ball game, the backyard, cooking, the two
 * grandparent video calls, and praise.
 *
 * Every Telugu word is copied from .redesign/v3/research/telugu-words.jsonl
 * and every Tamil word from .redesign/v3/research/tamil-all.jsonl (a headword
 * or a form quoted in its note). Lines of more than one word are composed
 * from those words and say so in their note. The checked lists have no words
 * for "turn", "again", "won", "stir", "hot", "careful" or "thank you", so this
 * file does not print them; the notes ask Nanna and Amma to add their own.
 */
export const MOMENTS: readonly Moment[] = [
  {
    id: 'bath',
    title: 'Bath Time: Nose, Head, Feet',
    hook: 'Name each part as it gets washed, and let him find yours.',
    // An evening bath before bed; 'bedtime' is the closest of the allowed times.
    when: 'bedtime',
    picture:
      'Nanna, kneeling beside the bathtub with his sleeves rolled up, pours a cup of warm water over a yellow rubber duck while Arjun, in the tub with bubbles up to his shoulders, reaches out and points at Nanna\'s nose, both laughing; folded towels on the closed lid of the laundry basket.',
    cast: ['Nanna', 'Arjun'],
    grownUp: [
      {
        id: 'bath-g1',
        te: { script: 'రా', roman: 'Raa!', means: 'Come!', note: 'Said to a child; to an elder it is రండి (randi).' },
        ta: { script: 'வா', roman: 'Vaa!', means: 'Come!' },
      },
      {
        id: 'bath-g2',
        te: { script: 'పొట్ట', roman: 'Potta', means: 'Tummy', note: 'The informal word you use with a child; kadupu is the general word for stomach.' },
        ta: { script: 'வயிறு', roman: 'Vayiru', means: 'Tummy', note: 'Same spoken and written.' },
      },
      {
        id: 'bath-g3',
        te: { script: 'తల', roman: 'Tala', means: 'Head', note: 'Tala snaanam is a hair-wash bath.' },
        ta: { script: 'தல', roman: 'Thala', means: 'Head', note: 'Spoken form; written தலை (thalai). Thala kuli is a hair-wash bath.' },
      },
      {
        id: 'bath-g4',
        te: { script: 'కాలు', roman: 'Kaalu', means: 'Leg, foot', note: 'One word for both. Two of them: కాళ్ళు (kaallu).' },
        ta: { script: 'காலு', roman: 'Kaalu', means: 'Leg, foot', note: 'Spoken form; written கால் (kaal). One word for both.' },
      },
    ],
    child: [
      {
        id: 'bath-c1',
        te: { script: 'ముక్కు', roman: 'Mukku!', means: 'Nose!', note: 'Also a bird\'s beak.' },
        ta: { script: 'மூக்கு', roman: 'Mookku!', means: 'Nose!' },
      },
      {
        id: 'bath-c2',
        te: { script: 'నీళ్ళు', roman: 'Neellu!', means: 'Water!', note: 'The everyday word, grammatically plural; also printed నీళ్లు.' },
        ta: { script: 'தண்ணி', roman: 'Thanni!', means: 'Water!', note: 'Spoken form; written தண்ணீர் (thanneer).' },
      },
    ],
    note: {
      what: 'Bath words: come, then the parts of the body as they get washed. He names a part, or points at yours when he hears its name.',
      expect:
        'He will likely point at the right part before he says any word, and may answer in English ("nose!"). Pointing at Nanna\'s nose instead of his own is the joke that keeps it going.',
      practising:
        'Hearing and saying five body and bath words in the same order every night: head, tummy, leg, nose, water. The repetition is the point.',
      ask: 'Touch your own nose and ask him which word Nanna (or Amma) uses for it; whatever language he answers in, say the word back and wash his nose.',
      next: 'At the doctor or while getting dressed, name one body part in Telugu or Tamil and let him touch it.',
      honest:
        'Naming body parts is vocabulary, not conversation. Nanna can add snaanam cheyyi (have your bath), which is in the checked Telugu list; the checked Tamil list has no single word for a bath, so ask Amma to record her own bath words.',
      easier: 'For Mia, do only "mukku" or "mookku" and touch her nose each time; she will touch yours back.',
      harder: 'Let Arjun be the one who calls out the next part, in Telugu or Tamil, and you wash it.',
      safety: 'Stay within arm\'s reach for the whole bath, and test the water with your wrist before he gets in.',
    },
    sources: [
      { label: 'Wiktionary: రా (Telugu, come)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: స్నానం (Telugu, bath)', url: 'https://en.wiktionary.org/wiki/స్నానం' },
      { label: 'Wiktionary: పొట్ట (Telugu, tummy)', url: 'https://en.wiktionary.org/wiki/పొట్ట' },
      { label: 'Wiktionary: తల (Telugu, head)', url: 'https://en.wiktionary.org/wiki/తల' },
      { label: 'Wiktionary: కాలు (Telugu, leg)', url: 'https://en.wiktionary.org/wiki/కాలు' },
      { label: 'Wiktionary: ముక్కు (Telugu, nose)', url: 'https://en.wiktionary.org/wiki/ముక్కు' },
      { label: 'Wiktionary: నీళ్లు (Telugu, water)', url: 'https://en.wiktionary.org/wiki/నీళ్లు' },
      { label: 'Wiktionary: வா (Tamil, come)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%BE' },
      { label: 'Wiktionary: வயிறு (Tamil, tummy)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%AF%E0%AE%BF%E0%AE%B1%E0%AF%81' },
      { label: 'Wiktionary: தலை (Tamil, head)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%B2%E0%AF%88' },
      { label: 'Wiktionary: கால் (Tamil, leg)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AE%BE%E0%AE%B2%E0%AF%8D' },
      { label: 'Wiktionary: மூக்கு (Tamil, nose)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AE%E0%AF%82%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%81' },
      { label: 'Wiktionary: தண்ணி (Tamil, water)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AE%BF' },
    ],
  },
  {
    id: 'play',
    title: 'One, Two, Three, Throw!',
    hook: 'A ball game in the backyard: count, throw, and ask for it back.',
    when: 'play',
    picture:
      'Arjun throws a red ball underarm across the backyard lawn towards Amma, who crouches on the grass with both hands out to catch it, while Mia, standing beside Amma, claps and laughs; raised vegetable beds and the wooden fence behind them. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun\'s head about level with Mia\'s, sitting on his heels lower.',
    cast: ['Arjun', 'Amma', 'Mia'],
    grownUp: [
      {
        id: 'play-g1',
        te: {
          script: 'ఒకటి, రెండు, మూడు!',
          roman: 'Okati, rendu, moodu!',
          means: 'One, two, three!',
          note: 'Composed from checked words; have a fluent speaker confirm. okati (one), rendu (two), moodu (three): the counting forms.',
        },
        ta: {
          script: 'ஒண்ணு, ரெண்டு, மூணு!',
          roman: 'Onnu, rendu, moonu!',
          means: 'One, two, three!',
          note: 'Composed from checked words; have a fluent speaker confirm. onnu (one), rendu (two), moonu (three), all spoken forms; written ஒன்று, இரண்டு, மூன்று (ondru, irandu, moondru).',
        },
      },
      {
        id: 'play-g2',
        te: {
          script: 'ఎర్ర బంతి',
          roman: 'Erra banti',
          means: 'The red ball',
          note: 'Composed from checked words; have a fluent speaker confirm. erra (red, the form used before a noun) + banti (ball). The research quotes this phrase as an example.',
        },
        ta: {
          script: 'சிவப்பு பந்து',
          roman: 'Sivappu pandhu',
          means: 'The red ball',
          note: 'Composed from checked words; have a fluent speaker confirm. sivappu (red; spoken often "sevappu") + pandhu (ball).',
        },
      },
      {
        id: 'play-g3',
        te: { script: 'చూడు', roman: 'Choodu!', means: 'Look!', note: 'Doubled for excitement: "Choodu, choodu!"' },
        ta: { script: 'பாரு', roman: 'Paaru!', means: 'Look!', note: 'Spoken form; written பார் (paar).' },
      },
    ],
    child: [
      {
        id: 'play-c1',
        te: { script: 'ఇవ్వు', roman: 'Ivvu!', means: 'Give it!', note: 'Colloquially also ఇయ్యి (iyyi). Polite: ivvandi.' },
        ta: { script: 'குடு', roman: 'Kudu!', means: 'Give it!', note: 'Spoken form; written கொடு (kodu).' },
      },
      {
        id: 'play-c2',
        te: { script: 'రా', roman: 'Raa!', means: 'Come (and play)!' },
        ta: { script: 'வா', roman: 'Vaa!', means: 'Come (and play)!' },
      },
    ],
    note: {
      what: 'A throwing game with a few fixed words: count to three, name the ball, throw, and ask for it back. Arjun can call a parent over and demand the ball in Telugu or Tamil.',
      expect:
        'He will probably count along before he says anything else, and may count in English the first few times. "Give it!" is the line most likely to come out on its own, because he wants the ball.',
      practising:
        'Counting one to three aloud and making a real request ("give it!") that gets an immediate result.',
      ask: 'Hold the ball behind your back and ask which colour it is; take his answer in either language and give the other back.',
      next: 'Count three steps on the stairs, three idlis on a plate or three oranges in the bag, in the same words.',
      honest:
        'The checked word lists have no words yet for "your turn", "my turn", "again" or "I won", so this card does not print them. Those are exactly the words a game needs: Nanna and Amma, record the ones you actually say and add them. Counting to three is not counting to ten.',
      easier: 'For Mia, roll the ball along the grass and say only "Raa!" or "Vaa!" when it reaches her.',
      harder: 'Count to five before each throw (aidu in Telugu, anju in Tamil), or let Arjun do the counting and you do the throwing.',
    },
    sources: [
      { label: 'Wiktionary: ఒకటి (Telugu numbers)', url: 'https://en.wiktionary.org/wiki/ఒకటి' },
      { label: 'Wiktionary: ఎరుపు (Telugu, red)', url: 'https://en.wiktionary.org/wiki/ఎరుపు' },
      { label: 'Wiktionary: చూడు (Telugu, look)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: ఇచ్చు (Telugu, give)', url: 'https://en.wiktionary.org/wiki/ఇచ్చు' },
      { label: 'Wiktionary: ஒண்ணு (Tamil, one)', url: 'https://en.wiktionary.org/wiki/%E0%AE%92%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AF%81' },
      { label: 'Wiktionary: ரெண்டு (Tamil, two)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B0%E0%AF%86%E0%AE%A3%E0%AF%8D%E0%AE%9F%E0%AF%81' },
      { label: 'Wiktionary: மூணு (Tamil, three)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AE%E0%AF%82%E0%AE%A3%E0%AF%81' },
      { label: 'Wiktionary: சிவப்பு (Tamil, red)', url: 'https://en.wiktionary.org/wiki/%E0%AE%9A%E0%AE%BF%E0%AE%B5%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AF%81' },
      { label: 'Wiktionary: பந்து (Tamil, ball)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%A8%E0%AF%8D%E0%AE%A4%E0%AF%81' },
      { label: 'Tamil Wiktionary: பாரு (look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
      { label: 'Tamil Wiktionary: குடு (give)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%95%E0%AF%81%E0%AE%9F%E0%AF%81' },
    ],
  },
  {
    id: 'outside',
    title: 'Look, a Bird in the Lemon Tree!',
    hook: 'Water the beds, check the lemons, and stop everything for a bird.',
    when: 'outside',
    picture:
      'Arjun points up into the lemon tree at a small brown bird on a branch, while Nanna, holding a green watering can over the raised vegetable beds, turns to look where he points, and Mia, beside Arjun on the backyard lawn, holds a small yellow lemon in both hands; wooden fence behind. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun\'s head about level with Mia\'s, sitting on his heels lower.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    grownUp: [
      {
        id: 'outside-g1',
        te: {
          script: 'రా, చూడు!',
          roman: 'Raa, choodu!',
          means: 'Come and look!',
          note: 'Composed from checked words; have a fluent speaker confirm. raa (come) + choodu (look).',
        },
        ta: {
          script: 'வா, பாரு!',
          roman: 'Vaa, paaru!',
          means: 'Come and look!',
          note: 'Composed from checked words; have a fluent speaker confirm. vaa (come) + paaru (look; spoken form of written பார், paar).',
        },
      },
      {
        id: 'outside-g2',
        te: { script: 'నీళ్ళు', roman: 'Neellu', means: 'Water (for the plants)', note: 'The everyday word, grammatically plural; also printed నీళ్లు.' },
        ta: { script: 'தண்ணி', roman: 'Thanni', means: 'Water (for the plants)', note: 'Spoken form; written தண்ணீர் (thanneer).' },
      },
      {
        id: 'outside-g3',
        te: {
          script: 'నిమ్మకాయ',
          roman: 'Nimmakaaya',
          means: 'A lemon',
          note: 'Checked as part of నిమ్మకాయ పులిహోర (nimmakaaya pulihora, lemon rice). Kaaya is the word for a fruit that is eaten unripe or sour.',
        },
        ta: {
          script: 'எலுமிச்சம்பழம்',
          roman: 'Elumichampazham',
          means: 'A lemon',
          note: 'The everyday word; the dictionary headword is எலுமிச்சை (elumichai).',
        },
      },
    ],
    child: [
      {
        id: 'outside-c1',
        te: {
          script: 'చూడు! పిట్ట!',
          roman: 'Choodu! Pitta!',
          means: 'Look! A bird!',
          note: 'Composed from checked words; have a fluent speaker confirm. choodu (look) + pitta (small bird, the everyday word; pakshi is the general written word).',
        },
        ta: {
          script: 'பாரு! குருவி!',
          roman: 'Paaru! Kuruvi!',
          means: 'Look! A bird!',
          note: 'Composed from checked words; have a fluent speaker confirm. paaru (look) + kuruvi (literally a sparrow; at home small birds are often all called kuruvi). The general word is பறவை (parava; written paravai).',
        },
      },
    ],
    note: {
      what: 'A backyard round: water the raised beds, check the lemon tree, and call everyone over when a bird lands. He gets the best line: "Look! A bird!"',
      expect:
        'He is likely to shout "look!" in English first and the bird will be gone by the time he finishes. Mia will point and may say "pitta" or "kuruvi" as one of her first words if she hears it every time.',
      practising:
        'Calling someone over to share something he has noticed, which is the reason a child talks at all, with four outdoor words: come, look, water, lemon.',
      ask: 'When a bird lands, whisper the question "where?" with your hands, and let him point and tell you, in either language.',
      next: 'Count the lemons on the tree together, or pick one and squeeze it into the rice at lunch.',
      honest:
        'Neither checked list has a verb for watering, and the Telugu list has no word for tree (the Tamil one has மரம், maram), so the lines stop at water and lemon. Pointing at a bird and saying "pitta" does not mean he can talk about birds.',
      easier: 'For Mia, hand her the lemon each time and say only "Nimmakaaya" or "Elumichampazham"; she can hand it back.',
      harder: 'Let Arjun take the watering can and tell Mia "Raa!" or "Vaa!" when it is her turn to hold the lemon.',
      safety: 'Keep the watering can light enough for him, and pick lemons from low branches only.',
    },
    sources: [
      { label: 'Wiktionary: రా (Telugu, come)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: చూడు (Telugu, look)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: నీళ్లు (Telugu, water)', url: 'https://en.wiktionary.org/wiki/నీళ్లు' },
      { label: 'Telugu Wikipedia: Pulihora (nimmakaaya, lemon)', url: 'https://te.wikipedia.org/wiki/పులిహోర' },
      { label: 'Wiktionary: పక్షి (Telugu, bird; pitta)', url: 'https://en.wiktionary.org/wiki/పక్షి' },
      { label: 'Wiktionary: வா (Tamil, come)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%BE' },
      { label: 'Tamil Wiktionary: பாரு (look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
      { label: 'Wiktionary: தண்ணி (Tamil, water)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AE%BF' },
      { label: 'Wiktionary: எலுமிச்சை (Tamil, lemon)', url: 'https://en.wiktionary.org/wiki/%E0%AE%8E%E0%AE%B2%E0%AF%81%E0%AE%AE%E0%AE%BF%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AF%88' },
      { label: 'Wiktionary: பறவை (Tamil, bird; kuruvi)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%B1%E0%AE%B5%E0%AF%88' },
    ],
  },
  {
    id: 'meals-b',
    title: 'Helping Make Curd Rice',
    hook: 'Wash hands, climb on the stool, and mix the curd into the rice.',
    when: 'meals',
    picture:
      'Arjun, standing on a sturdy step stool at the kitchen counter, mixes curd into cooled rice in a big steel bowl with a large spoon, while Amma, beside him, tips in a little more curd from a small steel katori; a pressure cooker sits at the far back of the stove, away from them.',
    cast: ['Arjun', 'Amma'],
    grownUp: [
      {
        id: 'meals-b-g1',
        te: {
          script: 'చేతులు కడుక్కో',
          roman: 'Chetulu kadukko',
          means: 'Wash your hands',
          note: 'chetulu (hands) + kadukko (wash, for yourself). The fixed phrase the research records; feet would be kaallu kadukko.',
        },
        ta: {
          script: 'கை கழுவு',
          roman: 'Kai kazhuvu',
          means: 'Wash your hands',
          note: 'kai (hand) + kazhuvu (wash). The fixed phrase the research records; spoken often "kai kaluvu".',
        },
      },
      {
        id: 'meals-b-g2',
        te: {
          script: 'కూర్చో',
          roman: 'Koorcho',
          means: 'Sit down (and wait)',
          note: 'Most people say కూచో (koocho). Polite: koorchondi.',
        },
        ta: {
          script: 'உட்காரு',
          roman: 'Utkaaru',
          means: 'Sit down (and wait)',
          note: 'Spoken often "ukkaaru"; written உட்கார் (utkaar).',
        },
      },
      {
        id: 'meals-b-g3',
        te: {
          script: 'పెరుగన్నం',
          roman: 'Perugannam',
          means: 'Curd rice',
          note: 'perugu (curd) + annam (rice), written as one word.',
        },
        ta: {
          script: 'தயிர் சாதம்',
          roman: 'Thayir saadham',
          means: 'Curd rice',
          note: 'thayir (curd) + saadham (cooked rice). On its own, curd is spoken தயிரு (thayiru).',
        },
      },
    ],
    child: [
      {
        id: 'meals-b-c1',
        te: { script: 'ఆకలి', roman: 'Aakali!', means: 'Hungry!', note: 'A whole sentence would be naaku aakali (I am hungry).' },
        ta: { script: 'பசி', roman: 'Pasi!', means: 'Hungry!' },
      },
      {
        id: 'meals-b-c2',
        te: {
          script: 'నాన్న, చూడు!',
          roman: 'Naanna, choodu!',
          means: 'Look, Nanna!',
          note: 'Composed from checked words; have a fluent speaker confirm. naanna (Dad; calling him, often stretched to "Naannaa!") + choodu (look). In Telugu he is talking to Nanna.',
        },
        ta: {
          script: 'அம்மா, பாரு!',
          roman: 'Amma, paaru!',
          means: 'Look, Amma!',
          note: 'Composed from checked words; have a fluent speaker confirm. amma (Mom) + paaru (look; written பார், paar). In Tamil he is talking to Amma.',
        },
      },
    ],
    note: {
      what: 'Arjun helps make curd rice: he washes his hands, waits on the stool, and mixes curd into rice that has already cooled. He says he is hungry and calls a parent to look at what he made.',
      expect:
        'He will likely want to do all the mixing himself and spill a little. "Look!" comes out first, because he wants you to see; "hungry" comes when he tastes it.',
      practising:
        'Following two short instructions he hears every day (wash, sit) and naming the dish he made, so the word is attached to his own work.',
      ask: 'Before you serve, ask him who should get the first bowl, and take the answer in Telugu, Tamil or English.',
      next: 'At dinner, let him tell the other parent what he made: perugannam to Nanna, thayir saadham to Amma.',
      honest:
        'The checked word lists have no words for "stir", "hot" or "careful", so this card does not print them; Nanna and Amma, record the ones you really say. Learning the name of a dish is not learning to talk about cooking.',
      easier: 'For Mia, give her a small bowl and a spoon of her own to mix, and say only "Perugannam" or "Thayir saadham" as she mixes.',
      harder: 'Let Arjun tell Mia "Chetulu kadukko!" or "Kai kazhuvu!" before she gets her spoon.',
      safety:
        'He mixes cooled food only. Keep him and the stool away from the stove, the pressure cooker and its steam, and hot oil; a grown-up does every hot step.',
    },
    sources: [
      { label: 'Wiktionary: కడుగు (Telugu, wash)', url: 'https://en.wiktionary.org/wiki/కడుగు' },
      { label: 'Wiktionary: కూర్చొను (Telugu, sit)', url: 'https://en.wiktionary.org/wiki/కూర్చొను' },
      { label: 'Wiktionary: పెరుగు (Telugu, curd)', url: 'https://en.wiktionary.org/wiki/పెరుగు' },
      { label: 'Wiktionary: అన్నము (Telugu, rice)', url: 'https://en.wiktionary.org/wiki/అన్నము' },
      { label: 'Wiktionary: ఆకలి (Telugu, hunger)', url: 'https://en.wiktionary.org/wiki/ఆకలి' },
      { label: 'Wiktionary: నాన్న (Telugu, father)', url: 'https://en.wiktionary.org/wiki/నాన్న' },
      { label: 'Wiktionary: கை (Tamil, hand)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AF%88' },
      { label: 'Wiktionary: உட்கார் (Tamil, sit)', url: 'https://en.wiktionary.org/wiki/%E0%AE%89%E0%AE%9F%E0%AF%8D%E0%AE%95%E0%AE%BE%E0%AE%B0%E0%AF%8D' },
      { label: 'Wiktionary: தயிர் (Tamil, curd)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%AF%E0%AE%BF%E0%AE%B0%E0%AF%8D' },
      { label: 'Wiktionary: சாதம் (Tamil, cooked rice)', url: 'https://en.wiktionary.org/wiki/%E0%AE%9A%E0%AE%BE%E0%AE%A4%E0%AE%AE%E0%AF%8D' },
      { label: 'Wiktionary: பசி (Tamil, hunger)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%9A%E0%AE%BF' },
      { label: 'Wiktionary: அம்மா (Tamil, mother)', url: 'https://en.wiktionary.org/wiki/%E0%AE%85%E0%AE%AE%E0%AF%8D%E0%AE%AE%E0%AE%BE' },
    ],
  },
  {
    id: 'grandparents-te',
    title: 'Video Call: Hello, Nanamma and Tatayya',
    hook: 'Show them something real, the red ball, and call them by name.',
    when: 'grandparents',
    picture:
      'Arjun, sitting on the patio step, holds a tablet in both hands and laughs at his smiling Telugu grandparents on the tablet screen, while Nanna, sitting beside him, holds a red ball up to the camera for them to see; lemon tree and wooden fence behind them in the backyard.',
    cast: ['Arjun', 'Nanna'],
    grownUp: [
      {
        id: 'grandparents-te-g1',
        te: {
          script: 'నాన్నమ్మ',
          roman: 'Naannamma',
          means: 'Grandma (Nanna\'s mother)',
          note: 'Literally father\'s mother. Many families say నాయనమ్మ (naayanamma) or బామ్మ (baamma); use what Nanna\'s family says.',
        },
        ta: {
          script: 'பாட்டி',
          roman: 'Paati',
          means: 'Grandma',
          note: 'The everyday Tamil word for a grandmother. In this family the children say Paati to Amma\'s mother; Nanna\'s mother stays Nanamma in any language.',
        },
      },
      {
        id: 'grandparents-te-g2',
        te: { script: 'తాతయ్య', roman: 'Taatayya', means: 'Grandpa', note: 'The respectful, affectionate form of తాత (taata). The same word serves for both grandfathers.' },
        ta: { script: 'தாத்தா', roman: 'Thatha', means: 'Grandpa', note: 'Same spoken and written.' },
      },
      {
        id: 'grandparents-te-g3',
        te: { script: 'విను', roman: 'Vinu!', means: 'Listen!', note: 'For when a grandparent starts a song or a story. Polite: వినండి (vinandi).' },
        ta: { script: 'கேளு', roman: 'Kelu!', means: 'Listen!', note: 'Spoken form; written கேள் (kel).' },
      },
    ],
    child: [
      {
        id: 'grandparents-te-c1',
        te: {
          script: 'నాన్నమ్మ, చూడండి! ఎర్ర బంతి!',
          roman: 'Naannamma, choodandi! Erra banti!',
          means: 'Look, Grandma! A red ball!',
          note: 'Composed from checked words; have a fluent speaker confirm. naannamma (Grandma) + choodandi (look, the polite form used to elders) + erra (red) + banti (ball).',
        },
        ta: {
          script: 'பாட்டி, பாரு! சிவப்பு பந்து!',
          roman: 'Paati, paaru! Sivappu pandhu!',
          means: 'Look, Grandma! A red ball!',
          note: 'Composed from checked words; have a fluent speaker confirm. paati (Grandma) + paaru (look) + sivappu (red) + pandhu (ball). Many families add the respectful -unga ending when a child speaks to a grandparent (paarunga); that form is not in the checked list, so ask Amma.',
        },
      },
      {
        id: 'grandparents-te-c2',
        te: {
          script: 'తాతయ్య, రండి!',
          roman: 'Taatayya, randi!',
          means: 'Come, Grandpa! (come and visit)',
          note: 'Composed from checked words; have a fluent speaker confirm. taatayya (Grandpa) + randi (come, the polite form a child uses to an elder).',
        },
        ta: {
          script: 'தாத்தா, வா!',
          roman: 'Thatha, vaa!',
          means: 'Come, Grandpa! (come and visit)',
          note: 'Composed from checked words; have a fluent speaker confirm. thatha (Grandpa) + vaa (come). The respectful form (vaanga) is not in the checked list; ask Amma which her family uses.',
        },
      },
    ],
    note: {
      what: 'A video call with Nanna\'s parents, built around something to show (the red ball) rather than "say something to Nanamma". Nanna sits in, names the grandparents and helps Arjun show and ask.',
      expect:
        'He may freeze or clown for the camera, and answer in English. Holding up the ball usually gets him talking; Nanamma and Tatayya asking about it in Telugu keeps it going.',
      practising:
        'Calling a grandparent by the family word and using the polite verb form (choodandi, randi) that a child uses to elders, inside a real reason to talk.',
      ask: 'After the call, ask him what Tatayya said about the ball, and let him tell you in any language.',
      next: 'Before the next call, let him choose one thing to show: a lemon from the tree, a drawing, a new book. Tell the grandparents in advance so they can ask about it in Telugu.',
      honest:
        'A call is good for the relationship and for hearing Telugu from new voices; it is not a lesson. Studies disagree on whether toddlers learn words from video at all (Roseberry 2014 found they can; Troseth 2018 found they did not), so Nanna being there and talking about the screen matters most.',
      easier: 'For Mia, sit her on Nanna\'s lap so she can see the screen, and let her wave and hold up a toy; that is her whole part.',
      harder: 'Ask Arjun to tell Nanamma one thing that happened today, and let Nanna supply the Telugu words he is missing.',
    },
    sources: [
      { label: 'Wiktionary: నాన్నమ్మ (Telugu, paternal grandmother)', url: 'https://en.wiktionary.org/wiki/నాన్నమ్మ' },
      { label: 'Wiktionary: తాత (Telugu, grandfather)', url: 'https://en.wiktionary.org/wiki/తాత' },
      { label: 'Telugu Wiktionary: తాతయ్య', url: 'https://te.wiktionary.org/wiki/తాతయ్య' },
      { label: 'Wiktionary: విను (Telugu, listen)', url: 'https://en.wiktionary.org/wiki/విను' },
      { label: 'Wiktionary: చూడు (Telugu, look; choodandi)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: రా (Telugu, come; randi)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: ఎరుపు (Telugu, red)', url: 'https://en.wiktionary.org/wiki/ఎరుపు' },
      { label: 'Wiktionary: பாட்டி (Tamil, grandmother)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%BF' },
      { label: 'Wiktionary: தாத்தா (Tamil, grandfather)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%BE%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%BE' },
      { label: 'Wiktionary: கேள் (Tamil, listen)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AF%87%E0%AE%B3%E0%AF%8D' },
      { label: 'Troseth et al. (2018), Let\'s chat: on-screen responsiveness and toddlers\' word learning', url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2018.02195/pdf' },
    ],
  },
  {
    id: 'grandparents-ta',
    title: 'Video Call: Hello, Paati and Thatha',
    hook: 'Show them a lemon from the tree and count it together.',
    when: 'grandparents',
    picture:
      'Arjun, standing at the kitchen counter, holds a tablet in both hands and grins at his smiling Tamil grandparents on the tablet screen, while Amma, beside him with a small string of jasmine in her plait, holds a yellow lemon up to the camera for them to see.',
    cast: ['Arjun', 'Amma'],
    grownUp: [
      {
        id: 'grandparents-ta-g1',
        te: {
          script: 'అమ్మమ్మ',
          roman: 'Ammamma',
          means: 'Grandma (Amma\'s mother)',
          note: 'Literally mother\'s mother. In this family the children may say Paati to her even in Telugu; follow what she likes.',
        },
        ta: {
          script: 'பாட்டி',
          roman: 'Paati',
          means: 'Grandma',
          note: 'Same spoken and written. Some Tamil families say ammachi or aaya; use what Amma\'s family says.',
        },
      },
      {
        id: 'grandparents-ta-g2',
        te: { script: 'తాతయ్య', roman: 'Taatayya', means: 'Grandpa', note: 'Telugu uses the same word for both grandfathers.' },
        ta: { script: 'தாத்தா', roman: 'Thatha', means: 'Grandpa', note: 'Same spoken and written; also a respectful way to address any elderly man.' },
      },
      {
        id: 'grandparents-ta-g3',
        te: { script: 'చూడు', roman: 'Choodu!', means: 'Look!', note: 'Point at the screen as you say it.' },
        ta: { script: 'பாரு', roman: 'Paaru!', means: 'Look!', note: 'Spoken form; written பார் (paar). Point at the screen as you say it.' },
      },
    ],
    child: [
      {
        id: 'grandparents-ta-c1',
        te: {
          script: 'అమ్మమ్మ, చూడండి! నిమ్మకాయ!',
          roman: 'Ammamma, choodandi! Nimmakaaya!',
          means: 'Look, Grandma! A lemon!',
          note: 'Composed from checked words; have a fluent speaker confirm. ammamma (Grandma) + choodandi (look, the polite form used to elders) + nimmakaaya (lemon).',
        },
        ta: {
          script: 'பாட்டி, பாரு! எலுமிச்சம்பழம்!',
          roman: 'Paati, paaru! Elumichampazham!',
          means: 'Look, Grandma! A lemon!',
          note: 'Composed from checked words; have a fluent speaker confirm. paati (Grandma) + paaru (look) + elumichampazham (lemon). The respectful paarunga is not in the checked list; ask Amma.',
        },
      },
      {
        id: 'grandparents-ta-c2',
        te: {
          script: 'ఒకటి, రెండు, మూడు!',
          roman: 'Okati, rendu, moodu!',
          means: 'One, two, three!',
          note: 'Composed from checked words; have a fluent speaker confirm. okati (one), rendu (two), moodu (three).',
        },
        ta: {
          script: 'ஒண்ணு, ரெண்டு, மூணு!',
          roman: 'Onnu, rendu, moonu!',
          means: 'One, two, three!',
          note: 'Composed from checked words; have a fluent speaker confirm. onnu (one), rendu (two), moonu (three), all spoken forms; written ஒன்று, இரண்டு, மூன்று (ondru, irandu, moondru).',
        },
      },
    ],
    note: {
      what: 'A video call with Amma\'s parents around a shared job: Arjun shows them lemons from the backyard tree and counts them with Thatha. Amma sits in, names the grandparents and helps him show and count.',
      expect:
        'Counting is the easiest way in: he may count along with Thatha before he says anything else. He may lose interest after a minute; a short, happy call beats a long one.',
      practising:
        'Calling a grandparent by the family word, showing and naming a real object, and counting it out loud with someone who is not a parent.',
      ask: 'After the call, ask him how many lemons Thatha counted, and let him tell you in any language.',
      next: 'Ask Paati to show something from her side next time (a plant, a kolam at her door, a dish she made) so he gets to ask a question too.',
      honest:
        'The heritage research suggests praise and attention from relatives can motivate a child more than a parent\'s pushing; that is a reason to make the calls warm and short, not a guarantee. Counting to three with Thatha does not mean he can hold a Tamil conversation.',
      easier: 'For Mia, let her hold the lemon up to the screen and wave; Paati can say "elumichampazham" back to her.',
      harder: 'Let Arjun ask Thatha to count something on his side, and count it with him in Tamil.',
    },
    sources: [
      { label: 'Wiktionary: பாட்டி (Tamil, grandmother)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%BF' },
      { label: 'Wiktionary: தாத்தா (Tamil, grandfather)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%BE%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%BE' },
      { label: 'Tamil Wiktionary: பாரு (look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
      { label: 'Wiktionary: எலுமிச்சை (Tamil, lemon)', url: 'https://en.wiktionary.org/wiki/%E0%AE%8E%E0%AE%B2%E0%AF%81%E0%AE%AE%E0%AE%BF%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AF%88' },
      { label: 'Wiktionary: ஒண்ணு (Tamil, one)', url: 'https://en.wiktionary.org/wiki/%E0%AE%92%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AF%81' },
      { label: 'Wiktionary: ரெண்டு (Tamil, two)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B0%E0%AF%86%E0%AE%A3%E0%AF%8D%E0%AE%9F%E0%AF%81' },
      { label: 'Wiktionary: மூணு (Tamil, three)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AE%E0%AF%82%E0%AE%A3%E0%AF%81' },
      { label: 'Wiktionary: అమ్మమ్మ (Telugu, maternal grandmother)', url: 'https://en.wiktionary.org/wiki/అమ్మమ్మ' },
      { label: 'Wiktionary: తాత (Telugu, grandfather)', url: 'https://en.wiktionary.org/wiki/తాత' },
      { label: 'Wiktionary: చూడు (Telugu, look; choodandi)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: ఒకటి (Telugu numbers)', url: 'https://en.wiktionary.org/wiki/ఒకటి' },
      { label: 'Telugu Wikipedia: Pulihora (nimmakaaya, lemon)', url: 'https://te.wikipedia.org/wiki/పులిహోర' },
      { label: 'Wang, Williams Tetteh & Dube (2023), parental emotion in heritage language maintenance', url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2023.1076418/full' },
    ],
  },
  {
    id: 'praise',
    title: 'You Gave It to Mia!',
    hook: 'When he shares, say how glad you are, and call him in for a hug.',
    when: 'play',
    picture:
      'Arjun hands a red ball to Mia on the living-room rug, and Mia grabs it with both hands, beaming, while Nanna, kneeling upright behind them, opens his arms wide for a hug; bookshelves with picture books and a basket of toys behind. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun\'s head about level with Mia\'s, sitting on his heels lower.',
    cast: ['Arjun', 'Mia', 'Nanna'],
    grownUp: [
      {
        id: 'praise-g1',
        te: {
          script: 'చెల్లికి ఇవ్వు',
          roman: 'Chelliki ivvu',
          means: 'Give it to your little sister',
          note: 'Composed from checked words; have a fluent speaker confirm. chelli (little sister) + -ki (to) + ivvu (give). The research quotes this phrase as an example.',
        },
        ta: {
          script: 'தங்கச்சிக்கு குடு',
          roman: 'Thangachikku kudu',
          means: 'Give it to your little sister',
          note: 'Composed from checked words; have a fluent speaker confirm. thangachi (little sister, spoken; written தங்கை, thangai) + -kku (to) + kudu (give; written கொடு, kodu).',
        },
      },
      {
        id: 'praise-g2',
        te: {
          script: 'సంతోషం!',
          roman: 'Santosham!',
          means: 'I\'m so glad!',
          note: 'Composed from checked words; have a fluent speaker confirm. santosham (happiness, gladness). Said to show pleasure or thanks; the fuller form the research records is "chaala santosham" (I\'m very glad).',
        },
        ta: {
          script: 'சந்தோஷம்!',
          roman: 'Santhosham!',
          means: 'I\'m so glad!',
          note: 'Composed from checked words; have a fluent speaker confirm. santhosham (happiness, gladness), used here as an exclamation.',
        },
      },
      {
        id: 'praise-g3',
        te: {
          script: 'రా, నాన్న!',
          roman: 'Raa, naanna!',
          means: 'Come here, dear! (for a hug)',
          note: 'Composed from checked words; have a fluent speaker confirm. raa (come) + naanna, which Telugu parents also use as a fond name for a little boy. The research records "raa naanna" as a softened "come, dear".',
        },
        ta: {
          script: 'வா, என் கண்ணு!',
          roman: 'Vaa, en kannu!',
          means: 'Come here, my darling! (for a hug)',
          note: 'Composed from checked words; have a fluent speaker confirm. vaa (come) + en (my) + kannu (literally "eye"; "en kannu" is an endearment, my darling).',
        },
      },
    ],
    child: [
      {
        id: 'praise-c1',
        te: {
          script: 'చెల్లి, రా!',
          roman: 'Chelli, raa!',
          means: 'Come on, little sister! (come and play)',
          note: 'Composed from checked words; have a fluent speaker confirm. chelli (little sister) + raa (come). He may well just say "Mia, raa!", which is fine.',
        },
        ta: {
          script: 'தங்கச்சி, வா!',
          roman: 'Thangachi, vaa!',
          means: 'Come on, little sister! (come and play)',
          note: 'Composed from checked words; have a fluent speaker confirm. thangachi (little sister) + vaa (come). "Mia, vaa!" works as well.',
        },
      },
      {
        id: 'praise-c2',
        te: { script: 'సంతోషం', roman: 'Santosham!', means: 'Happy!', note: 'He can say it back about himself, or about Mia.' },
        ta: { script: 'சந்தோஷம்', roman: 'Santhosham!', means: 'Happy!', note: 'He can say it back about himself, or about Mia.' },
      },
    ],
    note: {
      what: 'Praise for something he did, not for speaking: he shares the ball with Mia, the parent says how glad they are and calls him in for a hug, and he invites Mia to play.',
      expect:
        'He will likely respond to the hug and the tone long before the words. Mia may hold on to the ball; that is part of sharing with a two-year-old, and his patience is the thing worth praising.',
      practising:
        'Hearing warmth in Telugu and Tamil tied to a real moment, and an invitation of his own ("come on, little sister!") that he can use with Mia every day.',
      ask: 'After the hug, ask him how Mia felt when she got the ball, in Telugu or Tamil, and take his answer in any language.',
      next: 'Notice the next time he shares or helps without being asked, and say the same words then; praise that names a real act means more than praise on a screen.',
      honest:
        'Neither checked word list has a word for "thank you", "well done" or "good job", so this card prints only the checked ones; Nanna and Amma, record the praise and thanks you really say. The research notes that Telugu parents rarely say "I love you" literally and show affection with fond names such as naa bangaaram (my gold) and naa kanna (my dear); those appear here only in romanisation because their script was not checked. Never make praise, or your attention, the price of speaking Telugu or Tamil.',
      easier: 'For Mia, clap and say "Santosham!" or "Santhosham!" when she gives the ball back; she will clap too.',
      harder: 'Let Arjun be the one who says "Santosham!" or "Santhosham!" when Mia shares with him.',
    },
    sources: [
      { label: 'Wiktionary: చెల్లి (Telugu, younger sister)', url: 'https://en.wiktionary.org/wiki/చెల్లి' },
      { label: 'Wiktionary: ఇచ్చు (Telugu, give)', url: 'https://en.wiktionary.org/wiki/ఇచ్చు' },
      { label: 'Wiktionary: సంతోషము (Telugu, happiness)', url: 'https://en.wiktionary.org/wiki/సంతోషము' },
      { label: 'Wiktionary: రా (Telugu, come)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: నాన్న (Telugu, father; also a fond name for a boy)', url: 'https://en.wiktionary.org/wiki/నాన్న' },
      { label: 'Wiktionary: ప్రేమ (Telugu, love)', url: 'https://en.wiktionary.org/wiki/ప్రేమ' },
      { label: 'Wiktionary: தங்கச்சி (Tamil, younger sister)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AE%BF' },
      { label: 'Tamil Wiktionary: குடு (give)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%95%E0%AF%81%E0%AE%9F%E0%AF%81' },
      { label: 'Wiktionary: சந்தோஷம் (Tamil, happiness)', url: 'https://en.wiktionary.org/wiki/%E0%AE%9A%E0%AE%A8%E0%AF%8D%E0%AE%A4%E0%AF%8B%E0%AE%B7%E0%AE%AE%E0%AF%8D' },
      { label: 'Wiktionary: வா (Tamil, come)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%BE' },
      { label: 'Wiktionary: கண் (Tamil, eye; en kannu, my darling)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AE%A3%E0%AF%8D' },
      { label: 'Tamil Wikisource: Azha. Valliappa, Chinnanjiru paadalgal (en, my)', url: 'https://ta.wikisource.org/wiki/சின்னஞ்சிறு_பாடல்கள்' },
      { label: 'Wang, Williams Tetteh & Dube (2023), parental emotion in heritage language maintenance', url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2023.1076418/full' },
    ],
  },
];
