import type { Rhyme } from '../types';

/**
 * Four traditional Telugu rhymes for Nanna to sing with Arjun and Mia.
 *
 * Script and romanisation are copied from .redesign/v3/research/rhymes.jsonl,
 * which checked each text against Telugu Wikisource or Wikipedia. Only the
 * verified lines are printed; where the research summarised later verses
 * without a checked text, the note says so instead of printing them.
 */
export const RHYMES: readonly Rhyme[] = [
  {
    id: 'te-chandamama-raave',
    lang: 'te',
    title: {
      script: 'చందమామ రావే, జాబిల్లి రావే',
      roman: 'Chandamaama raave, jaabilli raave',
      means: 'Come, Uncle Moon; come, little moon',
      note: 'Jaabilli is an affectionate word for the moon.',
    },
    lines: [
      {
        script: 'చందమామ రావే, జాబిల్లి రావే',
        roman: 'Chandamaama raave, jaabilli raave',
        means: 'Come, Uncle Moon; come, little moon',
        note: 'Also printed రావె; sung raave, with a long final e.',
      },
      {
        script: 'కొండెక్కి రావే, గోగుపూలు తేవే',
        roman: 'Kondekki raave, gogu poolu theve',
        means: 'Climb over the hill and come; bring gogu flowers',
        note: 'Gogu is roselle or kenaf. The folk text says gogu; the 1986 film song\'s title is listed with gogi.',
      },
      {
        script: 'బండెక్కి రావే, బంతిపూలు తేవే',
        roman: 'Bandekki raave, banthi poolu theve',
        means: 'Ride in on a cart; bring marigolds',
      },
      {
        script: 'పల్లకిలో రావే, పారిజాతం తేవే',
        roman: 'Pallakilo raave, paarijaatham theve',
        means: 'Come in a palanquin; bring night-jasmine flowers',
        note: 'Paarijaatham is night-flowering jasmine.',
      },
    ],
    actions:
      'No set hand actions. The old way: point at the moon while feeding small rice balls by hand. Mia points and opens her mouth for each ball; Arjun points on every "raave" and holds up a pretend flower on every "theve".',
    origin:
      'Traditional Telugu lullaby and feeding song, no known author. Arudra (1989) credits the popular song to Annamacharya (1408-1503); this nursery form with "raave" is anonymous folk. Public domain. Well-known recordings include copyrighted film songs (Siri Vennela, 1986, and others), so sing it yourself rather than playing those.',
    picture:
      'Nanna points at the full moon rising over the backyard fence at dusk, sitting on the patio step with Mia on his lap, open-mouthed for the small ball of curd rice in his other hand, while Arjun stands beside them pointing at the moon too.',
    cast: ['Nanna', 'Mia', 'Arjun'],
    note: {
      what: 'A Telugu lullaby and feeding song. Nanna calls the moon to come over the hill, by cart, by palanquin, bringing flowers, and the children look up and point.',
      expect:
        'Mia may point at the moon, and may join on "raave" long before any other word. Arjun may ask why the moon never comes, or what gogu flowers are; both are good questions to answer in Telugu or English.',
      practising:
        'Listening to a repeating Telugu pattern: "come by ..., bring ...". The song word raave (come) comes five times and theve (bring) three times, always at the end of a half-line.',
      ask: 'Ask Arjun what he would like the moon to bring, then sing his answer in place of the flowers, even if he says it in English.',
      next: 'On the next clear evening, step into the backyard after dinner and look for the moon together. Some evenings it is not up yet; noticing that is part of the game.',
      honest:
        'Singing it at meals is warm Telugu listening, but singing the words is not understanding them: he can sing "gogu poolu theve" without knowing it means "bring gogu flowers". Now and then, talk with him about what one line says.',
      easier: 'For Mia, sing only the first line, over and over, pointing at the moon, and pause before "raave" for her to say it or point.',
      harder:
        'Let Arjun lead: Nanna sings the first half of each line ("Kondekki ...") and Arjun sings the rest. Telugu Wikipedia records more lines (hot rice in a silver bowl, milk-rice in a golden bowl) for when he knows these four.',
    },
    sources: [
      { label: 'Telugu Wikisource: Chandamaama raave jaabilli raave (folk text)', url: 'https://te.wikisource.org/wiki/చందమామ_రావే_జాబిల్లి_రావే' },
      { label: 'Telugu Wikipedia: Jola paatalu (Telugu lullabies)', url: 'https://te.wikipedia.org/wiki/జోల_పాటలు' },
      { label: 'Telugu Wikisource: Chandamaama raavo (Annamacharya)', url: 'https://te.wikisource.org/wiki/చందమామ_రావో' },
      { label: 'Telugu Wikisource: Arudra, Samagra Andhra Sahityam vol. 4, Annamayya', url: 'https://te.wikisource.org/wiki/సమగ్ర_ఆంధ్రసాహిత్యం_(4)/అన్నమయ్య' },
      { label: 'Telugu Wikipedia: Chandamama raave', url: 'https://te.wikipedia.org/wiki/చందమామ_రావే' },
    ],
  },
  {
    id: 'te-chitti-chilakamma',
    lang: 'te',
    title: {
      script: 'చిట్టి చిలకమ్మా',
      roman: 'Chitti chilakammaa',
      means: 'Little parrot',
      note: 'Chilaka (also written chiluka) is a parrot; -amma is an affectionate ending.',
    },
    lines: [
      {
        script: 'చిట్టి చిలకమ్మా, అమ్మ కొట్టిందా?',
        roman: 'Chitti chilakammaa, amma kottindaa?',
        means: 'Little parrot, did Mother smack you?',
      },
      {
        script: 'తోటకెళ్ళావా? పండు తెచ్చావా?',
        roman: 'Thotakellaavaa? Pandu thechchaavaa?',
        means: 'Did you go to the garden? Did you bring a fruit?',
      },
      {
        script: 'గూట్లో పెట్టావా? గుటుక్కున మింగావా?',
        roman: 'Gootlo pettaavaa? Gutukkuna mingaavaa?',
        means: 'Did you put it in the nest? Did you gulp it down?',
        note: 'Gootlo: in the nest, or in a wall niche. The last words are also printed గుటుక్కు మింగావా; the spoken form is usually gutukkuna.',
      },
    ],
    actions:
      'Question and answer. Nanna asks each question; the "parrot" answers "avunu!" (yes) and acts it out: flies to the garden, picks a fruit, tucks it away. On "gutukkuna mingaavaa" Nanna does a big pretend gulp, or tickles the parrot\'s tummy. Gestures vary by family; there is no fixed set.',
    origin:
      'Traditional Telugu nursery rhyme from oral tradition, no known author; Telugu Wikipedia lists it among folk children\'s songs. Public domain. A film song with the same name (Leelamahal Center) is a separate, copyrighted work.',
    picture:
      'Arjun runs back across the backyard lawn from the lemon tree, flapping one arm like a parrot\'s wing and holding up a lemon in the other hand, while Nanna, sitting on the patio step with Mia beside him, opens his mouth wide for a pretend gulp.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    note: {
      what: 'A Telugu question-and-answer rhyme. Nanna asks a little parrot where it went and what it did with the fruit; the child is the parrot and answers each question.',
      expect:
        'Arjun is likely to enjoy being the parrot and may soon know the order of the questions. Mia may laugh at the gulp and the tickle long before she follows any words, and may nod for "avunu".',
      practising:
        'Telugu yes-no questions. Four of the five questions end in -aavaa ("did you ...?") and the first in -indaa ("did she ...?"), so he hears one question shape again and again and can answer each with one word, avunu.',
      ask: 'After "pandu thechchaavaa?", ask Arjun which fruit the parrot brought, and let him answer in Telugu or English.',
      next: 'In the garden or at the shops, ask Arjun "pandu thechchaavaa?" when he brings you a lemon or a banana. "Avunu" or "yes", either answer keeps the game going.',
      honest:
        'The first line asks "did Mother smack you?". That is the traditional wording. For a toddler you may prefer to sing "amma pilichindaa?" (did Mother call you?); that change is this guide\'s suggestion, not a recorded folk version. Answering "avunu" in the game does not show that he understands the questions.',
      easier: 'For Mia, sing only the last line and do the gulp and the tummy tickle. She joins by laughing or opening her mouth.',
      harder:
        'Swap roles: Arjun asks the questions and Nanna is the parrot. Then the parrot sometimes says "ledu!" (no) and Arjun has to ask something else.',
    },
    sources: [
      { label: 'Telugu Wikipedia: Pillala paatalu (children\'s songs)', url: 'https://te.wikipedia.org/wiki/పిల్లల_పాటలు' },
      { label: 'Telugu Wikipedia: Baalala geyaalu (children\'s verses)', url: 'https://te.wikipedia.org/wiki/బాలల_గేయాలు' },
    ],
  },
  {
    id: 'te-bujji-meka',
    lang: 'te',
    title: {
      script: 'బుజ్జి మేక, బుజ్జి మేక',
      roman: 'Bujji meka, bujji meka',
      means: 'Little goat, little goat',
      note: 'Meka is a goat; bujji means little, cute.',
    },
    lines: [
      {
        script: 'బుజ్జి మేక బుజ్జి మేక ఏడికెలితివి?',
        roman: 'Bujji meka, bujji meka, edikelithivi?',
        means: 'Little goat, little goat, where did you go?',
        note: 'Colloquial (Telangana, Rayalaseema). The standard question is ఎక్కడికి వెళ్ళావు (ekkadiki vellaavu). Sung edikellithivi.',
      },
      {
        script: 'రాజుగారి తోటలోన మేతకెల్తిని',
        roman: 'Raajugaari thotalona methakelthini',
        means: 'I went to graze in the king\'s garden',
      },
      {
        script: 'రాజుగారి తోటలోన ఏమి చూస్తివి?',
        roman: 'Raajugaari thotalona emi choosthivi?',
        means: 'What did you see in the king\'s garden?',
      },
      {
        script: 'రాణిగారి పూలచెట్ల సొగసు చూస్తిని',
        roman: 'Raanigaari poolachetla sogasu choosthini',
        means: 'I saw the beauty of the queen\'s flower plants',
      },
    ],
    actions:
      'A sung conversation: one side asks, the goat answers. Nanna asks, with Mia joining on "bujji meka"; Arjun is the goat, trotting round the garden and answering. In the longer song the goat admits it ate the flowers, the gardener comes after it and it zips away, so the goat can end by running off with a squeal. No set clapping pattern.',
    origin:
      'Traditional Telugu folk and school rhyme from oral tradition, no known author; Telugu Wikipedia lists it among children\'s songs. Public domain. Do not use the song "Bujji meka" from the 2024 film Pottel: it is copyrighted, and its lyric was not compared with this folk text.',
    picture:
      'In the backyard, Arjun crawls on hands and knees between the raised vegetable beds pretending to be a little goat, smiling up at Nanna, who stands on the lawn holding Mia’s hand and laughing as he sings the question to the goat.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    note: {
      what: 'A Telugu sung conversation between children and a little goat. They ask where it went and what it saw; the goat says it went to graze in the king\'s garden and saw the queen\'s flowers.',
      expect:
        'Arjun may want to be the goat, and the goat\'s lines are the harder ones; he may sing the tune with half the words at first. Mia may copy "bujji meka" and the trotting long before she follows the story.',
      practising:
        'Two Telugu questions, "where did you go?" and "what did you see?", each followed by the goat\'s answer. The verb comes back with a new ending: choosthivi (you saw) in the question, choosthini (I saw) in the answer; edikelithivi and methakelthini pair the same way.',
      ask: 'When the goat comes back, ask Arjun in Telugu what else the goat saw in the garden, and let him invent it, in Telugu or English.',
      next: 'At a petting farm, or next time you see goats on a hillside, sing the first line to Arjun and see whether he answers as the goat.',
      honest:
        'The rhyme uses colloquial Telangana and Rayalaseema forms (ఏడికి, edi-ki, "where to", and the -ithivi / -ithini endings), not the standard Telugu of a storybook. Only these four lines are printed because only these were transcribed and checked; the later verses (the goat admits it ate the flowers, the gardener comes, it zips away) are known here from a summary only.',
      easier: 'For Mia, sing only "Bujji meka, bujji meka" and let her be the goat, crawling to you on the last word.',
      harder:
        'Swap: Arjun asks and Nanna is the goat, then the goat gives a wrong answer ("I saw a dinosaur!") and Arjun has to ask again.',
    },
    sources: [
      { label: 'Telugu Wikipedia: Pillala paatalu (children\'s songs)', url: 'https://te.wikipedia.org/wiki/పిల్లల_పాటలు' },
      { label: 'Telugu Wikipedia: Pottel (2024 film; its "Bujji meka" song is copyrighted)', url: 'https://te.wikipedia.org/wiki/పొట్టేల్' },
    ],
  },
  {
    id: 'te-chemma-chekka',
    lang: 'te',
    title: {
      script: 'చెమ్మ చెక్క',
      roman: 'Chemma chekka',
      means: 'Chemma chekka (a clapping game)',
      note: 'None of the sources checked explains the words chemma chekka; treat them as the name of the game.',
    },
    lines: [
      {
        script: 'చెమ్మ చెక్క చారెడేసి మొగ్గ',
        roman: 'Chemma chekka chaaredesi mogga',
        means: 'Chemma chekka, a palmful of buds each',
        note: 'Also printed చారడేసి; sung chaaredesi.',
      },
      {
        script: 'అట్లు పొయ్యంగ ఆరగించంగ',
        roman: 'Atlu poyyanga aaraginchanga',
        means: 'Pouring dosas, eating them up',
        note: 'Attu is a dosa; atlu is the plural.',
      },
      {
        script: 'ముత్యాల చెమ్మ చెక్క ముగ్గులెయ్యంగ',
        roman: 'Muthyaala chemma chekka muggu leyyanga',
        means: 'Pearl chemma chekka, drawing a muggu',
        note: 'A muggu is the pattern drawn on the ground at the front door (kolam in Tamil).',
      },
      {
        script: 'రత్నాల చెమ్మ చెక్క రంగులెయ్యంగ',
        roman: 'Rathnaala chemma chekka rangu leyyanga',
        means: 'Jewel chemma chekka, filling in the colours',
      },
    ],
    actions:
      'Two players face each other, sitting or standing, and clap to the beat: own hands together, then both palms against the partner\'s palms, and again. It often ends with both standing, holding hands and spinning round. Arjun claps with Nanna at full speed; Mia does a slow pat-a-cake on Nanna\'s palms.',
    origin:
      'Traditional Telugu clapping-game song from oral tradition, no known author; Telugu Wikisource files it under children\'s songs. Public domain.',
    picture:
      'Arjun and Nanna sit cross-legged facing each other on the rug in the living room, palms meeting mid-clap, both laughing, while Mia, sitting beside them, pats her own hands together a beat behind.',
    cast: ['Arjun', 'Nanna', 'Mia'],
    note: {
      what: 'A Telugu clapping game for two. The song runs through buds, pouring dosas, drawing a muggu and filling in colours while the players clap their own hands and each other\'s to the beat.',
      expect:
        'The clapping is likely to fall apart before the words do: Arjun may miss Nanna\'s palms or clap twice on one beat, and that is the fun. Mia may clap on her own, off the beat, and want a turn.',
      practising:
        'Keeping a steady beat with a partner while singing Telugu, and the long rhythmic words of the song (aaraginchanga, muggu leyyanga) that a clapping beat breaks into syllables.',
      ask: 'Ask Arjun which line is his favourite: the dosas, the muggu or the colours. Then sing that one twice as fast.',
      next: 'On a festival morning when someone draws a muggu or kolam at the front door, sing the muggu line while Arjun helps fill in the colours.',
      honest:
        'Only these four lines are printed because only these were transcribed and checked; later verses (coral chemma chekka setting up a wedding pandal, going to see Subbarayudu\'s wedding) are sung but known here from a summary only. It is traditionally a girls\' game; nothing in it is only for girls. Clapping in time does not mean he can say the lines without the beat.',
      easier: 'For Mia, sing only the first line slowly and pat her palms with yours on each beat, and leave out the spin.',
      harder:
        'Speed up a little each round. Or let Arjun lead: he sings, sets the pace and starts the spin, and Nanna follows. When Nanamma and Tatayya visit, he can play it with them.',
    },
    sources: [
      { label: 'Telugu Wikisource: Chemma chekka paata', url: 'https://te.wikisource.org/wiki/చెమ్మ_చెక్క_పాట' },
      { label: 'Telugu Wikipedia: Aatala paatalu (game songs)', url: 'https://te.wikipedia.org/wiki/ఆటలపాటలు' },
      { label: 'Telugu Wikipedia: Pillala paatalu (children\'s songs)', url: 'https://te.wikipedia.org/wiki/పిల్లల_పాటలు' },
    ],
  },
];
