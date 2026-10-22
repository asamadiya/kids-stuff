import type { Word } from './types';

/**
 * Twenty-four picture words for the Telugu & Tamil door, taken from the
 * moments and books: family, food, the backyard, and three everyday actions.
 *
 * Script and romanisation are copied from .redesign/v3/research/telugu-words.jsonl
 * and tamil-all.jsonl (spoken Chennai Tamil, written form in the note where it
 * differs). Six Telugu words are not headwords there but appear in a checked
 * note or rhyme (nimmakaaya, puvvu, chandamaama, banti, cheppulu, snaanam);
 * three are in no research file and were checked against English Wiktionary
 * instead (Telugu chettu, Tamil seruppu and kuli). Each note says which.
 *
 * Pictures: one thing on a plain background, no written words, so the same
 * card serves both languages.
 */
export const WORDS: readonly Word[] = [
  {
    id: 'w-amma',
    theme: 'family',
    te: {
      script: 'అమ్మ',
      roman: 'amma',
      means: 'Mom (mother)',
      note: 'Same word in Telugu and Tamil, so both sides of the family share it.',
    },
    ta: {
      script: 'அம்மா',
      roman: 'amma',
      means: 'Mom (mother)',
      note: 'Same spoken and written. Formal words for mother (thaai, annai) are not used at home.',
    },
    picture:
      'a smiling Indian mother with a long black plait and small gold earrings, in a teal kurta, waist up, on a plain cream background',
  },
  {
    id: 'w-nanna',
    theme: 'family',
    te: {
      script: 'నాన్న',
      roman: 'naanna',
      means: 'Dad (father)',
      note: 'Long first vowel: NAA-nna; this family writes it Nanna. Calling him: "Naannaa!" Parents also call a little boy naanna as a pet name.',
    },
    ta: {
      script: 'அப்பா',
      roman: 'appa',
      means: 'Dad (father)',
      note: 'The Tamil word for father, same spoken and written. In this family the children call Dad Nanna; appa is the word they hear from Amma\'s side.',
    },
    picture:
      'a smiling Indian father with short black hair, a neat short beard and black-rimmed glasses, in a rust shirt, waist up, on a plain cream background',
  },
  {
    id: 'w-anna',
    theme: 'family',
    te: {
      script: 'అన్న',
      roman: 'anna',
      means: 'big brother',
      note: 'What Mia calls Arjun: "Arjun anna", or just "anna". Calling him, the last vowel stretches, అన్నా. Many Telugu families use the longer అన్నయ్య (annayya) instead; this family does not.',
    },
    ta: {
      script: 'அண்ணா',
      roman: 'anna',
      means: 'big brother',
      note: 'The form used to call him; Mia says "Arjun anna", or just "anna". Talking about him, people also say அண்ணன் (annan).',
    },
    picture:
      'a smiling five-year-old Indian boy with short tousled black hair, in a dark green T-shirt, waist up, on a plain cream background',
  },
  {
    id: 'w-little-sister',
    theme: 'family',
    te: {
      script: 'చెల్లి',
      roman: 'chelli',
      means: 'little sister',
      note: 'The everyday spoken form; the fuller written form is చెల్లెలు (chellelu). Parents say "nee chelli" (your little sister).',
    },
    ta: {
      script: 'தங்கச்சி',
      roman: 'thangachi',
      means: 'little sister',
      note: 'The spoken form Amma uses ("un thangachi" = your little sister). Written and in books: தங்கை (thangai).',
    },
    picture:
      'a smiling two-year-old Indian girl with round cheeks and a small top tuft of black hair held by a red clip, in a coral flowered frock, waist up, on a plain cream background',
  },
  {
    id: 'w-water',
    theme: 'food',
    te: {
      script: 'నీళ్ళు',
      roman: 'neellu',
      means: 'water',
      note: 'The everyday word is this plural form (also spelled నీళ్లు); the literary singular is నీరు (neeru). "Neellu taagu" = drink some water.',
    },
    ta: {
      script: 'தண்ணி',
      roman: 'thanni',
      means: 'water',
      note: 'Spoken form. Written: தண்ணீர் (thanneer).',
    },
    picture: 'a steel tumbler full of clear water, on a plain cream background',
  },
  {
    id: 'w-milk',
    theme: 'food',
    te: {
      script: 'పాలు',
      roman: 'paalu',
      means: 'milk',
      note: 'Grammatically plural. "Paalu taagu" = drink your milk.',
    },
    ta: {
      script: 'பாலு',
      roman: 'paalu',
      means: 'milk',
      note: 'Spoken form; written பால் (paal). "Paalu kudi" = drink your milk. Close to the Telugu word, but not the same in writing.',
    },
    picture: 'a steel tumbler of white milk, on a plain cream background',
  },
  {
    id: 'w-rice',
    theme: 'food',
    te: {
      script: 'అన్నం',
      roman: 'annam',
      means: 'rice (cooked); also a meal',
      note: 'Spoken form; written అన్నము (annamu). Uncooked rice is a different word, బియ్యం (biyyam).',
    },
    ta: {
      script: 'சாதம்',
      roman: 'saadham',
      means: 'rice (cooked)',
      note: 'What a Chennai family usually says at home. The other common word is சோறு (soru). Uncooked rice is அரிசி (arisi).',
    },
    picture: 'a small steel plate with a mound of white cooked rice, on a plain cream background',
  },
  {
    id: 'w-curd',
    theme: 'food',
    te: {
      script: 'పెరుగు',
      roman: 'perugu',
      means: 'curd (yogurt)',
      note: 'Same spoken and written. Curd rice is పెరుగన్నం (perugannam).',
    },
    ta: {
      script: 'தயிரு',
      roman: 'thayiru',
      means: 'curd (yogurt)',
      note: 'Spoken form; written தயிர் (thayir). Curd rice is தயிர் சாதம் (thayir saadham).',
    },
    picture: 'a small steel katori of thick white curd, on a plain cream background',
  },
  {
    id: 'w-idli',
    theme: 'food',
    te: {
      script: 'ఇడ్లీ',
      roman: 'idli',
      means: 'idli',
      note: 'The modern spoken word; older Telugu names ఇడ్డెనలు (iddenalu) are fading.',
    },
    ta: {
      script: 'இட்லி',
      roman: 'itli',
      means: 'idli',
      note: 'Said "itli"; many people write it "idli" in English.',
    },
    picture: 'three soft round white idlis on a steel plate, on a plain cream background',
  },
  {
    id: 'w-dosa',
    theme: 'food',
    te: {
      script: 'దోశ',
      roman: 'dosa',
      means: 'dosa',
      note: 'Spellings vary: దోశ, దోస and దోసె are all seen. The native Telugu word అట్టు (attu) lives on in pesarattu.',
    },
    ta: {
      script: 'தோசை',
      roman: 'dosai',
      means: 'dosa',
      note: 'The written form; in speech the end often sounds like "dose".',
    },
    picture: 'one golden round dosa, folded in half on a steel plate, on a plain cream background',
  },
  {
    id: 'w-banana',
    theme: 'food',
    te: {
      script: 'అరటిపండు',
      roman: 'arati pandu',
      means: 'banana',
      note: 'Written as one word, said as two. Pandu = ripe fruit; a raw plantain for curry is అరటికాయ (arati kaaya).',
    },
    ta: {
      script: 'வாழைப்பழம்',
      roman: 'vaazhaippazham',
      means: 'banana',
      note: 'Often said "vaazhapazham". Pazham = ripe fruit.',
    },
    picture: 'a single ripe yellow banana, on a plain cream background',
  },
  {
    id: 'w-mango',
    theme: 'food',
    te: {
      script: 'మామిడిపండు',
      roman: 'maamidi pandu',
      means: 'mango (ripe)',
      note: 'Written as one word, said as two. A raw green mango is మామిడికాయ (maamidi kaaya).',
    },
    ta: {
      script: 'மாம்பழம்',
      roman: 'maambazham',
      means: 'mango (ripe)',
      note: 'Same spoken and written. The zh is the Tamil ழ sound.',
    },
    picture: 'a single ripe yellow mango, on a plain cream background',
  },
  {
    id: 'w-lemon',
    theme: 'outside',
    te: {
      script: 'నిమ్మకాయ',
      roman: 'nimmakaaya',
      means: 'lemon',
      note: 'Not a separate entry in the checked word list: the spelling comes from its note on pulihora (nimmakaaya pulihora = lemon rice) and matches Wiktionary. Lemons take kaaya, not pandu.',
    },
    ta: {
      script: 'எலுமிச்சம்பழம்',
      roman: 'elumichampazham',
      means: 'lemon',
      note: 'The everyday word; the dictionary form is எலுமிச்சை (elumichai).',
    },
    picture: 'a single yellow lemon with one green leaf on its stalk, on a plain cream background',
  },
  {
    id: 'w-tree',
    theme: 'outside',
    te: {
      script: 'చెట్టు',
      roman: 'chettu',
      means: 'tree (or plant)',
      note: 'Not in the checked word list; spelling and meaning from Wiktionary, where it covers both a plant and a tree. Have a fluent speaker confirm.',
    },
    ta: {
      script: 'மரம்',
      roman: 'maram',
      means: 'tree',
      note: 'Same spoken and written. "Maram mela" = up the tree. Also means wood.',
    },
    picture: 'a small leafy green tree with a brown trunk, on a plain cream background',
  },
  {
    id: 'w-flower',
    theme: 'outside',
    te: {
      script: 'పువ్వు',
      roman: 'puvvu',
      means: 'flower',
      note: 'Not a separate entry in the checked word list: it appears in a Telugu picture-book title in the research (ఏడు రంగుల పువ్వు, the seven-coloured flower) and Wiktionary lists it as a form of పూవు (poovu). Several flowers: పూలు (poolu), as in the moon song.',
    },
    ta: {
      script: 'பூ',
      roman: 'poo',
      means: 'flower',
      note: 'Same spoken and written. "Poo vechukko" = wear a flower in your hair.',
    },
    picture: 'a single red hibiscus flower with one green leaf, on a plain cream background',
  },
  {
    id: 'w-bird',
    theme: 'outside',
    te: {
      script: 'పిట్ట',
      roman: 'pitta',
      means: 'bird (a small one)',
      note: 'The everyday word for a small bird. పక్షి (pakshi) is the general, more bookish word.',
    },
    ta: {
      script: 'பறவை',
      roman: 'parava',
      means: 'bird',
      note: 'Written paravai; in speech the end drops to -a or -e. At home small birds are often all called குருவி (kuruvi, sparrow): "andha kuruviya paaru" = look at that bird.',
    },
    picture: 'a small brown sparrow perched on a short twig, on a plain cream background',
  },
  {
    id: 'w-dog',
    theme: 'outside',
    te: {
      script: 'కుక్క',
      roman: 'kukka',
      means: 'dog',
      note: 'Same spoken and written. A puppy is కుక్కపిల్ల (kukka pilla).',
    },
    ta: {
      script: 'நாய்',
      roman: 'naay',
      means: 'dog',
      note: 'Often said "naayi". A puppy is நாய்க்குட்டி (naai kutti); toddlers say "bow-bow".',
    },
    picture: 'a friendly brown dog sitting and wagging its tail, on a plain cream background',
  },
  {
    id: 'w-cat',
    theme: 'outside',
    te: {
      script: 'పిల్లి',
      roman: 'pilli',
      means: 'cat',
      note: 'Same spoken and written. A kitten is పిల్లి పిల్ల (pilli pilla).',
    },
    ta: {
      script: 'பூனை',
      roman: 'poona',
      means: 'cat',
      note: 'Written poonai; in speech the end sounds like "poona" or "poone". A kitten is பூனைக்குட்டி (poona kutti); toddlers say "meow".',
    },
    picture: 'a grey striped cat sitting with its tail curled round its paws, on a plain cream background',
  },
  {
    id: 'w-moon',
    theme: 'outside',
    te: {
      script: 'చందమామ',
      roman: 'chandamaama',
      means: 'the moon',
      note: 'The children\'s word for the moon, from the song "Chandamaama raave". Also జాబిల్లి (jaabilli), an affectionate word for the moon.',
    },
    ta: {
      script: 'நிலா',
      roman: 'nilaa',
      means: 'the moon',
      note: 'The everyday word, from the song "Nilaa nilaa odi vaa" (moon, moon, come running). The research word list prints it nila; the same file\'s romanisation key doubles long vowels, and நிலா ends in a long aa, so this part writes nilaa everywhere. The formal word is சந்திரன் (chandhiran).',
    },
    picture: 'a round full moon, pale yellow, alone in a plain dark blue night sky',
  },
  {
    id: 'w-ball',
    theme: 'home',
    te: {
      script: 'బంతి',
      roman: 'banti',
      means: 'ball',
      note: 'From the checked note on colours: ఎర్ర బంతి (erra banti) = a red ball. The same word also names the marigold flower.',
    },
    ta: {
      script: 'பந்து',
      roman: 'pandhu',
      means: 'ball',
      note: 'Same spoken and written.',
    },
    picture: 'a single shiny red rubber ball, on a plain cream background',
  },
  {
    id: 'w-shoes',
    theme: 'home',
    te: {
      script: 'చెప్పులు',
      roman: 'cheppulu',
      means: 'shoes, sandals (footwear)',
      note: 'The native word for footwear, from the checked note on "shoes vesuko"; one is చెప్పు (cheppu). బూట్లు (bootlu) is shoes or boots, and many Bay Area families just say షూస్ (shoes): "shoes vesuko" = put on your shoes.',
    },
    ta: {
      script: 'செருப்பு',
      roman: 'seruppu',
      means: 'shoes, sandals (footwear)',
      note: 'Not in the checked word list; spelling and meaning (sandal, slipper, shoe) from Wiktionary. Many Chennai families also just say "shoe". Have a fluent speaker confirm what Amma says.',
    },
    picture: 'a pair of small children\'s sandals side by side, on a plain cream background',
  },
  {
    id: 'w-bath',
    theme: 'home',
    te: {
      script: 'స్నానం',
      roman: 'snaanam',
      means: 'bath',
      note: 'Written స్నానము (snaanamu). "Snaanam cheyyi" = have your bath; a hair-wash bath is "tala snaanam".',
    },
    ta: {
      script: 'குளி',
      roman: 'kuli',
      means: 'bath; also "have your bath!"',
      note: 'Not a separate entry in the checked word list: it appears there in "thala kuli" (hair-wash bath), and Wiktionary gives it as both the noun (bath) and the verb (bathe). The bookish noun is குளியல் (kuliyal). Have a fluent speaker confirm.',
    },
    picture: 'a small blue bathtub full of white bubbles with a yellow rubber duck, on a plain cream background',
  },
  {
    id: 'w-sleep',
    theme: 'actions',
    te: {
      script: 'పడుకో',
      roman: 'paduko',
      means: 'Sleep! / Lie down!',
      note: 'Often stretched to "padukoo". Polite: పడుకోండి (padukondi). Many parents say the baby word "bajjo" to a toddler.',
    },
    ta: {
      script: 'தூங்கு',
      roman: 'thoongu',
      means: 'Sleep!',
      note: 'Same spoken and written.',
    },
    picture: 'a small child fast asleep on a white pillow under a blue blanket, eyes closed, on a plain cream background',
  },
  {
    id: 'w-eat',
    theme: 'actions',
    te: {
      script: 'తిను',
      roman: 'tinu',
      means: 'Eat!',
      note: 'Often "annam tinu" (eat your food) or, coaxing, "tinu, tinu, inkokka mudda" (eat, one more mouthful). Polite: తినండి (tinandi).',
    },
    ta: {
      script: 'சாப்பிடு',
      roman: 'saappidu',
      means: 'Eat!',
      note: 'Often said "saapdu".',
    },
    picture: 'a small child\'s hand lifting a ball of rice from a steel plate, on a plain cream background',
  },
];
