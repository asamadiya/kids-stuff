import type { LangBook } from '../types';

/**
 * "Round Dosa, Round Moon": a Sunday-morning dosa book, told once in Telugu
 * (Nanna) and once in Tamil (Amma).
 *
 * Every word is copied from .redesign/v3/research/telugu-words.jsonl and
 * tamil-all.jsonl (Wiktionary and Telugu Wikipedia checked); the two moon
 * words come from the lullabies in rhymes.jsonl (చందమామ రావే, நிலா நிலா ஓடி வா).
 * The lines themselves are composed, so each carries a note asking for a
 * fluent speaker's check. Tamil is spoken Chennai Tamil; the written form is
 * in the note where it differs.
 */
const SIZE =
  "Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun's head about level with Mia's, sitting on his heels lower.";
const NO_WORDS = 'No writing, letters or numbers anywhere in the picture.';
const CHECK = 'Composed from checked words; have a fluent speaker confirm.';

export const BOOK: LangBook = {
  id: 'our-dosa',
  title: {
    id: 'our-dosa-title',
    te: {
      script: 'చందమామ దోశ',
      roman: 'Chandamaama dosa',
      means: 'Round Dosa, Round Moon',
      note: `${CHECK} Chandamaama = the moon (Uncle Moon, as in the lullaby Chandamaama raave); dosa = dosa. Literally "moon dosa".`,
    },
    ta: {
      script: 'நிலா தோசை',
      roman: 'Nilaa dosai',
      means: 'Round Dosa, Round Moon',
      note: `${CHECK} Nilaa = moon (as in the lullaby Nilaa nilaa odi vaa); dosai = dosa, often said "dose". The long final vowel is written aa throughout this part. Literally "moon dosa".`,
    },
  },
  hook: 'A Sunday morning of dosas: count them to five, find one as round as the moon, share with Mia.',
  pages: [
    {
      picture: `Nanna waves Arjun and Mia into the open kitchen of the Bay Area house on a sunny Sunday morning, a steel ladle in his other hand, while Amma, at the stove, smooths the first ladle of batter into a circle on the flat iron pan. Arjun runs in from the living room in pyjamas and Mia toddles after him, arms up. Steel plates and tumblers on the counter, an idli stand on the shelf, the backyard lemon tree through the window. ${SIZE} ${NO_WORDS}`,
      cast: ['Nanna', 'Arjun', 'Mia', 'Amma'],
      te: {
        script: 'రా, రా!',
        roman: 'Raa, raa!',
        means: 'Come, come!',
        note: `${CHECK} Raa = come, the familiar form used with a child; said twice it is an eager call. Nanna may add a name: "Raa, Arjun!"`,
      },
      ta: {
        script: 'வா, வா!',
        roman: 'Vaa, vaa!',
        means: 'Come, come!',
        note: `${CHECK} Vaa = come, the same in spoken and written Tamil; said twice it is an eager call. Amma may add "kanna" (dear).`,
      },
    },
    {
      picture: `Arjun pats his tummy with both hands and nods hard, standing at the kitchen table, while Mia beside him copies the pat on her own round tummy. Across the table Nanna and Amma bend towards them with raised eyebrows, asking; behind them a stack of steel plates and the dosa batter in a steel bowl on the counter, the stove far back against the wall. ${SIZE} ${NO_WORDS}`,
      cast: ['Arjun', 'Mia', 'Nanna', 'Amma'],
      te: {
        script: 'ఆకలి?',
        roman: 'Aakali?',
        means: 'Hungry?',
        note: `${CHECK} Aakali = hunger; asked with a rising voice it means "hungry?". The fuller question is "aakali ga undaa?" (are you hungry?).`,
      },
      ta: {
        script: 'பசி?',
        roman: 'Pasi?',
        means: 'Hungry?',
        note: `${CHECK} Pasi = hunger, the same in spoken and written Tamil; asked with a rising voice it means "hungry?".`,
      },
    },
    {
      picture: `Arjun counts out loud, mouth wide on each number, tapping the rim of each of three steel plates in a row on the kitchen table, one golden dosa on each, as Nanna sets the third plate down, the stove far back against the wall. Amma stands at the table's end with Mia, who pats the second plate's rim with her open palm. Morning light through the kitchen window, the lemon tree outside. ${SIZE} ${NO_WORDS}`,
      cast: ['Arjun', 'Nanna', 'Amma', 'Mia'],
      te: {
        script: 'ఒకటి, రెండు, మూడు!',
        roman: 'Okati, rendu, moodu!',
        means: 'One, two, three!',
        note: `${CHECK} Okati = one, rendu = two (retroflex nd), moodu = three (long oo). Before a noun one becomes oka: oka dosa.`,
      },
      ta: {
        script: 'ஒண்ணு, ரெண்டு, மூணு!',
        roman: 'Onnu, rendu, moonu!',
        means: 'One, two, three!',
        note: `${CHECK} Spoken Chennai forms: onnu = one, rendu = two, moonu = three. Written: ஒன்று (ondru), இரண்டு (irandu), மூன்று (moondru).`,
      },
    },
    {
      picture: `Mia claps both hands over her head and Arjun cheers with both arms up, both standing by the kitchen table, as Amma sets two more plates beside the three in the row, five steel plates now, one golden dosa on each, and Nanna, behind her, turns off the stove. ${SIZE} ${NO_WORDS}`,
      cast: ['Mia', 'Arjun', 'Amma', 'Nanna'],
      te: {
        script: 'నాలుగు, ఐదు!',
        roman: 'Naalugu, aidu!',
        means: 'Four, five!',
        note: `${CHECK} Naalugu = four; aidu = five (also written అయిదు, ayidu, said the same).`,
      },
      ta: {
        script: 'நாலு, அஞ்சு!',
        roman: 'Naalu, anju!',
        means: 'Four, five!',
        note: `${CHECK} Spoken Chennai forms: naalu = four, anju = five. Written: நான்கு (naangu), ஐந்து (aindhu).`,
      },
    },
    {
      picture: `Arjun lifts a steel plate high in both hands to show one big, perfectly round golden dosa, eyes wide, while Nanna sweeps a big circle in the air with his open hand and Amma laughs beside him; Mia, standing by Arjun at the kitchen table, reaches up for the plate. ${SIZE} ${NO_WORDS}`,
      cast: ['Arjun', 'Nanna', 'Amma', 'Mia'],
      te: {
        script: 'చూడు! చందమామ!',
        roman: 'Choodu! Chandamaama!',
        means: 'Look! The moon!',
        note: `${CHECK} Choodu = look (the familiar imperative); chandamaama = the moon, "Uncle Moon", the word from the lullaby Chandamaama raave.`,
      },
      ta: {
        script: 'பாரு! நிலா!',
        roman: 'Paaru! Nilaa!',
        means: 'Look! The moon!',
        note: `${CHECK} Paaru = look (spoken; written பார், paar); nilaa = moon, the everyday word from the lullaby Nilaa nilaa odi vaa.`,
      },
    },
    {
      picture: `Arjun tears his round dosa in half and holds one half out to Mia, who reaches for it with both hands, the two children sitting side by side at the patio table in the backyard, steel plates in front of them. Nanna and Amma, sitting across the table, lean in and nod him on. Lawn, raised vegetable beds and the lemon tree behind them in morning sun. ${SIZE} ${NO_WORDS}`,
      cast: ['Arjun', 'Mia', 'Nanna', 'Amma'],
      te: {
        script: 'మియాకి ఇవ్వు.',
        roman: 'Mia-ki ivvu.',
        means: 'Give some to Mia.',
        note: `${CHECK} Mia + -కి (-ki, to); ivvu = give (familiar imperative). Her name is the same word in Telugu, Tamil and English, so a grown-up talking about her uses it: written out in full the first two words are miyaaki ivvu. The word for little sister, చెల్లి (chelli), is in the picture words; this family says her name instead. The research spells no child's name, so have a fluent speaker check మియా.`,
      },
      ta: {
        script: 'மியாவுக்கு குடு.',
        roman: 'Mia-vukku kudu.',
        means: 'Give some to Mia.',
        note: `${CHECK} Mia + -வுக்கு (-vukku, to, the -ukku ending with the -v- a name ending in a vowel takes); kudu = give (spoken; written கொடு, kodu). Written out in full, miyaavukku kudu. தங்கச்சி (thangachi, little sister) is in the picture words; this family says her name. The research spells no child's name, so have a fluent speaker check மியா.`,
      },
    },
    {
      picture: `Mia, a half dosa in one hand, throws her other arm round Arjun's middle in a big hug, beaming up at him, both standing beside the patio table in the backyard; Arjun grins down at her with his arms out. Nanna and Amma, still seated at the table, smile at each other over their steel plates. The tulsi and curry-leaf pots on the patio behind. ${SIZE} ${NO_WORDS}`,
      cast: ['Mia', 'Arjun', 'Nanna', 'Amma'],
      te: {
        script: 'అన్నా!',
        roman: 'Anna!',
        means: 'Anna! (big brother)',
        note: `${CHECK} Anna = big brother; calling him, the last vowel stretches, అన్నా. Mia says "Arjun anna", or just "anna". Many Telugu families use the longer అన్నయ్య (annayya) instead; this family does not.`,
      },
      ta: {
        script: 'அண்ணா!',
        roman: 'Anna!',
        means: 'Anna! (big brother)',
        note: `${CHECK} Anna = big brother, the form used to call him; Mia says "Arjun anna", or just "anna". Talking about him, people also say annan (அண்ணன்).`,
      },
    },
    {
      picture: `Arjun points up at the full moon rising over the backyard fence at night, standing on the lawn beside Amma, while Nanna, holding Mia on his hip, looks up with her; Mia stretches one hand towards the moon. The patio table is cleared, the kitchen window glows behind them, the lemon tree is a dark shape by the fence. ${SIZE} ${NO_WORDS}`,
      cast: ['Arjun', 'Amma', 'Nanna', 'Mia'],
      te: {
        script: 'చందమామ, రా!',
        roman: 'Chandamaama, raa!',
        means: 'Moon, come!',
        note: `${CHECK} Chandamaama = the moon; raa = come. An echo of the lullaby Chandamaama raave (raave is the sung, affectionate form of raa), so the book can end in the song.`,
      },
      ta: {
        script: 'நிலா, வா!',
        roman: 'Nilaa, vaa!',
        means: 'Moon, come!',
        note: `${CHECK} Nilaa = moon; vaa = come. An echo of the lullaby Nilaa nilaa odi vaa (moon, moon, come running), so the book can end in the song.`,
      },
    },
  ],
  note: {
    what: 'A short picture book for Nanna to read in Telugu or Amma to read in Tamil: the family makes dosas on a Sunday morning, counts them to five, finds one as round as the moon, shares it with Mia, who calls her brother anna, and sees the real moon that night.',
    expect:
      'Arjun is likely to join the counting first, and may count in English or run past five; let him. Mia may call out on "Raa, raa!" or "Vaa, vaa!", point at the dosas, and clap on the numbers before she says any of them.',
    practising:
      'Counting one to five in Telugu or Tamil with real objects (dosas on a plate), and a handful of kitchen words around it: come, hungry, give, eat, look, moon.',
    ask: 'On the moon-dosa page, ask "what else is round like the moon?" and take any answer, in any language; say his answer back in Telugu or Tamil if you know the word.',
    next: 'Next time you make dosas, count them onto the plate together in the book\'s language and let Arjun carry one to Mia. After dinner, step into the backyard and look for the moon.',
    honest:
      'These lines were composed from checked words, not taken from a published book; have a fluent speaker read each line before you record it. Saying the numbers in order is not the same as counting: ask for "moodu" (or "moonu") dosas and see how many he hands you. The moon is not full, or even up, every evening.',
    easier: 'For Mia, read only the first page and the last, saying "Raa, raa!" or "Vaa, vaa!" and pointing at the moon.',
    harder:
      'Let Arjun take the grown-up\'s part: he counts the dosas, tells Nanna "Mia-ki ivvu" or Amma "Mia-vukku kudu", and finds the moon from the patio.',
    safety: 'Keep both children back from the hot pan; in the pictures they stand away from the stove while a grown-up cooks.',
  },
};
