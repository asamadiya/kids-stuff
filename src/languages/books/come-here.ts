import type { LangBook } from '../types';

/**
 * "Nanna Says Raa, Amma Says Vaa": one day at home, told once in Telugu and
 * once in Tamil.
 *
 * Every Telugu and Tamil word is copied from .redesign/v3/research/
 * telugu-words.jsonl or tamil-all.jsonl, mostly from phrases those files
 * already quote ("Choodu, choodu!", "paalu taagu", "paalu kudi", "nidra
 * vastondaa?"). Neither research file spells a child's name, so where a name
 * is needed (Mia, in the dosa book) it is transliterated and its note says so.
 * Lines joined from those words carry a note asking a fluent speaker to
 * confirm them.
 */
const SIZE =
  'Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun\'s head about level with Mia\'s, sitting on his heels lower.';

const C = 'Composed from checked words; have a fluent speaker confirm.';

export const BOOK: LangBook = {
  id: 'come-here',
  title: {
    id: 'come-here-title',
    te: {
      script: 'ఇటు రా!',
      roman: 'Itu raa!',
      means: 'Come here!',
      note: 'A phrase from the checked list: itu (this way) + raa (come), the familiar form used with children.',
    },
    ta: {
      script: 'வா, வா!',
      roman: 'Vaa, vaa!',
      means: 'Come here!',
      note: `${C} vaa = come, the familiar form used with children; said twice, it means "come here, come on". Same spoken and written.`,
    },
  },
  hook: 'Nanna Says Raa, Amma Says Vaa: all day long, Nanna calls "raa!", Amma calls "vaa!", and Arjun and Mia come running.',
  pages: [
    {
      picture: `Nanna and Amma lean over the bed to wake Arjun and Mia, Nanna pulling back the blanket and Amma holding out both hands, while Arjun sits up rubbing his eyes and Mia, already standing on the mattress, reaches for Amma; morning light through the bedroom window of the Bay Area house. ${SIZE} No written words.`,
      cast: ['Nanna', 'Amma', 'Arjun', 'Mia'],
      te: {
        script: 'రా, నాన్న! ఇటు రా!',
        roman: 'Raa, naanna! Itu raa!',
        means: 'Come on, sweetheart! Come here!',
        note: `${C} raa = come; naanna = here not "Dad" but the affectionate word Telugu parents use for a little boy ("raa naanna", come, dear); itu raa = come this way, come here.`,
      },
      ta: {
        script: 'எந்திரி, கண்ணு! வா, வா!',
        roman: 'Endhiri, kannu! Vaa, vaa!',
        means: 'Up you get, darling! Come, come!',
        note: `${C} endhiri = get up (spoken; written எழுந்திரு, ezhundhiru); kannu = darling (literally "eye", the spoken form of கண், kan); vaa = come.`,
      },
    },
    {
      picture: `Amma sets a steel plate of idli in front of Arjun at the kitchen table while Nanna holds out a steel tumbler of milk to Mia, who reaches for it with both hands from her booster seat; steel katoris and an idli stand on the shelf of the open kitchen behind them. ${SIZE} No written words.`,
      cast: ['Amma', 'Arjun', 'Nanna', 'Mia'],
      te: {
        script: 'ఇడ్లీ తిను, పాలు తాగు!',
        roman: 'Idli tinu, paalu taagu!',
        means: 'Eat your idli, drink your milk!',
        note: `${C} idli = idli; tinu = eat; paalu = milk (grammatically plural); taagu = drink. "Paalu taagu" is the everyday phrase.`,
      },
      ta: {
        script: 'இட்லி சாப்பிடு, பாலு குடி!',
        roman: 'Itli saappidu, paalu kudi!',
        means: 'Eat your idli, drink your milk!',
        note: `${C} itli = idli (many write "idli"); saappidu = eat (said "saapdu"); paalu = milk (spoken; written பால், paal); kudi = drink. "Paalu kudi" is the everyday phrase.`,
      },
    },
    {
      picture: `Nanna rolls a red ball across the backyard lawn towards Arjun and Mia, who run for it together past the raised vegetable beds, Arjun a step ahead and Mia toddling behind with her arms out, while Amma kneels by the patio table clapping; wooden fence and a lemon tree in the corner. ${SIZE} No written words.`,
      cast: ['Nanna', 'Arjun', 'Mia', 'Amma'],
      te: {
        script: 'ఎర్ర బంతి! రా, రా!',
        roman: 'Erra banti! Raa, raa!',
        means: 'The red ball! Come on, come on!',
        note: `${C} erra = red (the form used before a noun; the colour word itself is erupu); banti = ball; raa = come.`,
      },
      ta: {
        script: 'சிவப்பு பந்து! வா, வா!',
        roman: 'Sivappu pandhu! Vaa, vaa!',
        means: 'The red ball! Come on, come on!',
        note: `${C} sivappu = red (often said "sevappu"); pandhu = ball; vaa = come.`,
      },
    },
    {
      picture: `Amma lifts Mia up on her hip under the lemon tree in the backyard so she can see a small brown bird on a branch among the yellow lemons, while Arjun, standing on tiptoe beside them, points up at it; raised vegetable beds and the wooden fence behind. ${SIZE} No written words.`,
      cast: ['Amma', 'Mia', 'Arjun'],
      te: {
        script: 'చూడు, చూడు! పిట్ట!',
        roman: 'Choodu, choodu! Pitta!',
        means: 'Look, look! A little bird!',
        note: `${C} "Choodu, choodu!" (look, look!) is a phrase the checked list itself gives; pitta = a small bird, the everyday word (pakshi is the general, bookish one).`,
      },
      ta: {
        script: 'பாரு, பாரு! குருவி!',
        roman: 'Paaru, paaru! Kuruvi!',
        means: 'Look, look! A little bird!',
        note: `${C} paaru = look (spoken; written பார், paar); kuruvi = literally a sparrow, but at home any small bird is a kuruvi (parava is the general word).`,
      },
    },
    {
      picture: `Mia, standing on the patio by the potted curry-leaf plant, calls out with both arms stretched towards Arjun, who turns and runs back to her across the lawn, while Nanna, crouched by a raised vegetable bed with a watering can, looks up and smiles; late afternoon in the backyard. ${SIZE} No written words.`,
      cast: ['Mia', 'Arjun', 'Nanna'],
      te: {
        script: 'అన్నా! రా, రా!',
        roman: 'Anna! Raa, raa!',
        means: 'Anna! Come, come!',
        note: `${C} Mia speaking. anna = big brother; calling him, the last vowel stretches, అన్నా. She says "Arjun anna", or just "anna"; many Telugu families use the longer అన్నయ్య (annayya), and this one does not. raa = come.`,
      },
      ta: {
        script: 'அண்ணா! வா, வா!',
        roman: 'Anna! Vaa, vaa!',
        means: 'Anna! Come, come!',
        note: `${C} Mia speaking. anna = big brother, the form used to call him (annan when talking about him); she says "Arjun anna", or just "anna". vaa = come.`,
      },
    },
    {
      picture: `Amma, sleeves pushed up, swirls a hand in the warm water of the bathtub where a small toy fish floats, while Arjun runs in from the hallway in his towel and Mia, holding his hand, toddles beside him laughing. ${SIZE} No written words.`,
      cast: ['Amma', 'Arjun', 'Mia'],
      te: {
        script: 'స్నానం చెయ్యి! రా, రా!',
        roman: 'Snaanam cheyyi! Raa, raa!',
        means: 'Bath time! Come, come!',
        note: `${C} snaanam cheyyi = have your bath (literally "do bath"; cheyyi here is "do", not the word for hand); raa = come.`,
      },
      ta: {
        script: 'குளி! வா, வா!',
        roman: 'Kuli! Vaa, vaa!',
        means: 'Bath time! Come, come!',
        note: `${C} kuli = bathe, and also a bath; வா (vaa) = come. குளி is not a headword in the checked list, which has it inside "thala kuli" (a hair-wash bath), and Wiktionary gives both the noun and the verb; have Amma confirm it is her word before you record this page.`,
      },
    },
    {
      picture: `Nanna sits on the living-room sofa holding open a big picture book, Mia climbing onto his lap and Arjun sitting close against his side looking at the page, bookshelves of picture books and a rug behind them; evening lamp light. ${SIZE} No written words, and the open book shows only a picture.`,
      cast: ['Nanna', 'Mia', 'Arjun'],
      te: {
        script: 'కూచో! బొమ్మ చూడు!',
        roman: 'Koocho! Bomma choodu!',
        means: 'Sit down! Look at the picture!',
        note: `${C} koocho = sit down (the everyday spoken form; written కూర్చో, koorcho); bomma = picture (also toy, doll); choodu = look.`,
      },
      ta: {
        script: 'உட்காரு! புத்தகம் பாரு!',
        roman: 'Utkaaru! Puththagam paaru!',
        means: 'Sit down! Look at the book!',
        note: `${C} utkaaru = sit down (said "ukkaaru"; written உட்கார், utkaar); puththagam = book (in mixed speech often "bookku"); paaru = look.`,
      },
    },
    {
      picture: `Amma tucks a blanket around Mia in her bed while Nanna, sitting on the edge of Arjun's bed beside it, smooths his hair, both children yawning; the bedroom window shows a round moon over the backyard fence. ${SIZE} No written words.`,
      cast: ['Amma', 'Mia', 'Nanna', 'Arjun'],
      te: {
        script: 'నిద్ర వస్తోందా? పడుకో, నాన్న.',
        roman: 'Nidra vastondaa? Paduko, naanna.',
        means: 'Sleepy? Lie down now, sweetheart.',
        note: `${C} "Nidra vastondaa?" (are you sleepy?, literally "is sleep coming?") is a phrase the checked list gives; paduko = lie down, go to bed; naanna = the affectionate word for a little boy.`,
      },
      ta: {
        script: 'நிலா பாரு! தூங்கு, கண்ணு.',
        roman: 'Nilaa paaru! Thoongu, kannu.',
        means: 'Look at the moon! Now sleep, darling.',
        note: `${C} nilaa = moon (the everyday word, from "Nilaa nilaa odi vaa"; the long final vowel is written aa throughout this part); paaru = look; thoongu = sleep; kannu = darling (literally "eye").`,
      },
    },
  ],
  note: {
    what: '"Nanna Says Raa, Amma Says Vaa": eight pages of one ordinary day (waking up, breakfast, a ball in the backyard, a bird in the lemon tree, Mia calling her brother, bath, a book, bed). Each page has one short line, once in Telugu and once in Tamil; both say the same thing, and each makes sense alone.',
    expect:
      'Arjun is likely to hear that raa and vaa do the same job long before anyone says so, and may start calling "raa!" or "vaa!" himself in the backyard. Mia may say vaa or "anna" (she calls him "Arjun anna", or just "anna") and point at the bird or the moon. He may answer in English; that is fine.',
    practising:
      'Words this home already uses at those times of day: come (raa / vaa), look (choodu / paaru), eat and drink, sit, sleep, anna (what Mia calls her brother), and the pet words for a little one (naanna in Telugu, kannu in Tamil). Hearing them while looking at a familiar room is the point, not reading them.',
    ask: 'On the bird page, stop and ask in your own language what the bird is doing in the lemon tree, then take his answer in Telugu, Tamil or English and say it back in yours.',
    next: 'Use the same lines for real tomorrow: "Choodu, choodu!" or "Paaru, paaru!" at the next bird in the backyard, "Raa!" or "Vaa!" at bath time. A book line he has heard and then hears at the real moment is worth more than another read.',
    honest:
      'These lines were joined by an author from words checked in dictionaries, not recorded from this family, so have Nanna and Amma read them first and change anything that is not how they talk; your own wording wins. The lines are deliberately short. Two words want a fluent ear before anyone records them: the Tamil kuli (bath), which the checked list gives only inside "thala kuli", and endhiri (get up). Knowing raa and vaa from a book is not holding a conversation, and the book does not teach reading.',
    easier:
      'For Mia, read only the last word or two of each line (raa, vaa, pitta, kuruvi, anna) and point at the picture. Let her shout "anna!" on page five.',
    harder:
      'Read it twice in one sitting: Nanna reads the Telugu page, Amma reads the Tamil one, and Arjun says what is the same. Later, let him turn the page and say the line himself in either language before you read it.',
  },
};
