import type { Rhyme } from '../types';

/**
 * Four Tamil rhymes for Amma (or Paati, visiting) to sing with Arjun and Mia.
 *
 * Script and romanisation are copied from .redesign/v3/research/rhymes.jsonl,
 * which checked each text against Tamil Wikisource or Wikipedia. Where that
 * file quotes only part of a poem (Thosai nalla thosai, Maambazhamaam), the
 * remaining lines are copied from the same Wikisource page and checked
 * against its page scan. Two OCR slips there (கிறைய, தங்தாள்) are printed as
 * the scan shows them (நிறைய, தந்தாள்); the transcription's ஒடி is printed
 * ஓடி, as the research file corrected it. Words the book splits across a
 * space for the metre (ஆசை யாக, வட்ட மான, கேட்க வில்லை, வைக்க வில்லை) are
 * joined, as the research file did for the first two, and line-end
 * punctuation is dropped except ? and !. Texts the research
 * could not match to a printed source (the folk "Thosai amma thosai"; "Aanai
 * aanai azhagar aanai", of which only the first line is attested) are left
 * out, and the dosa song's note says so.
 */
export const RHYMES: readonly Rhyme[] = [
  {
    id: 'ta-nila-nila-odi-vaa',
    lang: 'ta',
    title: {
      script: 'நிலா நிலா ஓடி வா',
      roman: 'Nilaa nilaa odi vaa',
      means: 'Moon, moon, come running',
      note: 'Nilaa is the everyday word for the moon.',
    },
    lines: [
      {
        script: 'நிலா நிலா ஓடி வா',
        roman: 'Nilaa nilaa odi vaa',
        means: 'Moon, moon, come running',
        note: 'Two printed sources begin நிலா நிலா வா வா (nilaa nilaa vaa vaa); most parents sing "odi vaa", as here.',
      },
      {
        script: 'நில்லாமல் ஓடி வா',
        roman: 'Nillaamal odi vaa',
        means: 'Come running without stopping',
      },
      {
        script: 'மலை மேலே ஏறி வா',
        roman: 'Malai mele eri vaa',
        means: 'Climb over the mountain and come',
        note: 'One printed source has மலை மீது (malai meedhu); both mean "on the mountain".',
      },
      {
        script: 'மல்லிகைப் பூ கொண்டு வா',
        roman: 'Malligai poo kondu vaa',
        means: 'Bring jasmine flowers',
        note: 'Kondu vaa, literally "take and come", is how Tamil says "bring".',
      },
    ],
    actions:
      'No set hand actions. The old way: hold the little one, point at the moon and beckon on every "vaa", often while feeding. Mia beckons with Amma; Arjun beckons too, and on "malligai poo kondu vaa" holds out both hands for the flowers.',
    origin:
      'Anonymous Tamil folk children\'s song (kuzhandhai paadal), no known author. N. Subbu Reddiar\'s Ambulip payanam quotes it, with no author, as a children\'s song mothers sing; Periyasami Thooran\'s Kaatril vandha kavidhai quotes it among Tamil folk children\'s songs. Public domain. A 2018 Tamil web series with the same name is a separate, copyrighted work.',
    picture:
      'Amma, a small string of jasmine in her plait, stands on the backyard lawn at dusk with Mia on her hip, both beckoning with one hand towards a big round moon rising over the wooden fence, while Arjun runs ahead across the grass waving the moon on.',
    cast: ['Amma', 'Mia', 'Arjun'],
    note: {
      what: 'A Tamil moon song, sung at dusk or while feeding. Amma calls the moon to come running, without stopping, over the mountain, bringing jasmine. It is the Tamil cousin of Nanna\'s Telugu "Chandamaama raave".',
      expect:
        'Mia is likely to beckon and say "vaa" (come) long before the other words, and it is a word she can use for real. Arjun may notice that the Telugu moon also climbs a hill and brings flowers.',
      practising:
        'The Tamil word vaa (come), which ends every line, each time after a different way of coming: odi vaa (come running), eri vaa (climb up and come), kondu vaa (bring).',
      ask: 'Ask Arjun what the moon should bring this time instead of jasmine, and sing his answer before "kondu vaa", even if he says it in English.',
      next: 'On the next clear evening, step into the backyard after dinner and look for the moon together. If it is not up yet, sing the first line to call it.',
      honest:
        'Only four lines are printed because only these were checked against print; some versions go on (a Hong Kong Tamil class\'s annual souvenir quotes a later line, "nadu veettil vaiththu vaa", which mentions the middle of the house), but no full text was verified. Beckoning on "vaa" does not show he knows what "odi vaa" means; ask him now and then.',
      easier: 'For Mia, sing only the first line and beckon, and pause before the last "vaa" for her to say it or beckon.',
      harder:
        'Sing the two moon songs one after the other, Nanna\'s Telugu and Amma\'s Tamil, and ask Arjun what each moon brings: gogu flowers, marigolds and night-jasmine in Telugu, jasmine in Tamil.',
    },
    sources: [
      { label: 'Tamil Wikisource: N. Subbu Reddiar, Ambulip payanam, "Amudhalikkum ambuli"', url: 'https://ta.wikisource.org/wiki/அம்புலிப்_பயணம்/அமுதளிக்கும்_அம்புலி' },
      { label: 'Tamil Wikisource: Periyasami Thooran, Kaatril vandha kavidhai, "Kundu vayiran"', url: 'https://ta.wikisource.org/wiki/காற்றில்_வந்த_கவிதை/குண்டு_வயிறன்' },
      { label: 'Tamil Wikisource: Hong Kong Tamil class, annual function souvenir', url: 'https://ta.wikisource.org/wiki/ஒங்கொங்_தமிழ்_வகுப்பு_ஆண்டு_விழா_மலர்' },
      { label: 'Tamil Wikipedia: Tamil siruvar ilakkiyam (Tamil children\'s literature)', url: 'https://ta.wikipedia.org/wiki/தமிழ்_சிறுவர்_இலக்கியம்' },
      { label: 'Tamil Wikipedia: Nila Nila Odi Vaa (the 2018 web series, a different work)', url: 'https://ta.wikipedia.org/wiki/நிலா_நிலா_ஓடி_வா' },
    ],
  },
  {
    id: 'ta-kai-veesamma',
    lang: 'ta',
    title: {
      script: 'கை வீசம்மா கை வீசு',
      roman: 'Kai veesamma kai veesu',
      means: 'Swing your arms, little one, swing your arms',
      note: 'Kai is hand or arm; veesu is swing. The -amma is a loving ending for a little one, not "mother".',
    },
    lines: [
      {
        script: 'கைவீசம்மா கைவீசு',
        roman: 'Kai veesamma kai veesu',
        means: 'Swing your arms, little one, swing your arms',
      },
      {
        script: 'கடலை வாங்கலாம் கைவீசு',
        roman: 'Kadalai vaangalaam kai veesu',
        means: 'We can buy peanuts, swing your arms',
        note: 'Kadalai is a roasted snack: peanuts, or chickpeas.',
      },
      {
        script: 'நெய் உருண்டை கைவீசு',
        roman: 'Nei urundai kai veesu',
        means: 'Ghee sweet balls, swing your arms',
        note: 'Nei is ghee; urundai is a ball. A nei urundai is a sweet laddu.',
      },
      {
        script: 'நிறைய வாங்கலாம் கைவீசு',
        roman: 'Niraiya vaangalaam kai veesu',
        means: 'We can buy lots, swing your arms',
      },
      {
        script: 'பொய்யா சொல்வேன் கைவீசு',
        roman: 'Poyyaa solven kai veesu',
        means: 'Would I tell a fib? Swing your arms',
      },
      {
        script: 'போளி வாங்கலாம் கைவீசு',
        roman: 'Poli vaangalaam kai veesu',
        means: 'We can buy poli, swing your arms',
        note: 'Poli is a sweet stuffed flatbread.',
      },
      {
        script: 'வெய்யில் போகும் கைவீசு',
        roman: 'Veyyil pogum kai veesu',
        means: 'The hot sun will go, swing your arms',
        note: 'Veyyil is sunshine or the day\'s heat; the dictionary spelling is வெயில் (veyil).',
      },
      {
        script: 'வெளியில் போகலாம் கைவீசு',
        roman: 'Veliyil pogalaam kai veesu',
        means: 'Then we can go out, swing your arms',
      },
    ],
    actions:
      'The action is the song: on every "kai veesu", swing both arms forward and back as if marching off to the market. Mia marches holding Amma\'s hand, or swings her arms standing still; Arjun marches in front as the leader and turns round on the last line.',
    origin:
      'The refrain "kai veesamma kai veesu" is a traditional Tamil play song (Tamil Wikipedia, Vilaiyaattu paadal). These eight lines are the poet Bharathidasan\'s setting of it, in Ilaignar ilakkiyam. His works were nationalised by the Tamil Nadu government in 1991 and are free to use. Do not play songs from the 1989 film of this name or the song of this name in Engitta Modhaadhe; both are copyrighted.',
    picture:
      'Amma and Mia march hand in hand across the backyard lawn, both swinging their free arms high, Mia\'s little legs stamping, while Arjun marches ahead of them past the lemon tree, swinging both arms and looking back over his shoulder to check they are following.',
    cast: ['Amma', 'Mia', 'Arjun'],
    note: {
      what: 'A Tamil marching song for a toddler. Amma promises all the treats they can buy, peanuts, ghee sweets and poli, once the hot sun goes and they can go out, and the children swing their arms on every "kai veesu".',
      expect:
        'This is Mia\'s song: she is likely to swing her arms on "kai veesu" early on, and may sing "veesu" before anything else. Arjun may enjoy leading the march and start asking for the snacks.',
      practising:
        'The Tamil ending -laam, "we can" or "let\'s": vaangalaam (we can buy) three times and pogalaam (we can go) once, each followed by the refrain, kai veesu.',
      ask: 'Halfway through the march, stop and ask Arjun, in Tamil or English, what else they should buy, and sing "... vaangalaam kai veesu" with his answer.',
      next: 'On a walk to the park or the shops, sing it as you go. "Kai veesu" works as a real request when Mia drags her feet.',
      honest:
        'Families also sing other middle lines; none of those could be checked against print, so only Bharathidasan\'s printed text is given here. Swinging her arms on the beat shows Mia knows the game, not that she knows the word for arm.',
      easier: 'For Mia, sing only the refrain, "kai veesamma kai veesu", over and over, swinging her arms with yours.',
      harder:
        'Let Arjun lead the march and choose each treat; Amma sings the line back to him. Or march fast for "vaangalaam" lines and slow for the last two.',
      safety: 'Whole peanuts are a choking risk for children under four. In the song the buying is pretend; if it turns into a real snack, give Mia something soft instead of whole kadalai.',
    },
    sources: [
      { label: 'Tamil Wikisource: Bharathidasan, Ilaignar ilakkiyam, "Thaalaattum thuyilezhuppum"', url: 'https://ta.wikisource.org/wiki/இளைஞர்_இலக்கியம்/தாலாட்டும்_துயிலெழுப்பும்' },
      { label: 'Tamil Wikipedia: Vilaiyaattu paadal (Tamil play songs)', url: 'https://ta.wikipedia.org/wiki/விளையாட்டுப்_பாடல்' },
      { label: 'Tamil Wikipedia: Tamil siruvar ilakkiyam (Tamil children\'s literature)', url: 'https://ta.wikipedia.org/wiki/தமிழ்_சிறுவர்_இலக்கியம்' },
      { label: 'Wikipedia: Bharathidasan (works nationalised 1991)', url: 'https://en.wikipedia.org/wiki/Bharathidasan' },
      { label: 'Tamil Wikipedia: Engitta Modhaadhe (its song of this name is a different work)', url: 'https://ta.wikipedia.org/wiki/எங்கிட்ட_மோதாதே' },
    ],
  },
  {
    id: 'ta-thosai-nalla-thosai',
    lang: 'ta',
    title: {
      script: 'தோசை நல்ல தோசை',
      roman: 'Thosai nalla thosai',
      means: 'Dosa, good dosa',
      note: 'Thosai is the written spelling; in speech it is often "dosai", and in English "dosa".',
    },
    lines: [
      {
        script: 'தோசை நல்ல தோசை—அம்மா சுட்டுத் தந்த தோசை',
        roman: 'Thosai nalla thosai, amma suttu thandha thosai',
        means: 'Dosa, good dosa, the dosa Amma made for me',
        note: 'Suttu thandha: cooked (on the pan) and gave.',
      },
      {
        script: 'ஆசையாக எனக்கே—என் அம்மா தந்த தோசை',
        roman: 'Aasaiyaaga enakke, en amma thandha thosai',
        means: 'Lovingly, just for me, the dosa my Amma gave me',
      },
      {
        script: 'வட்டமான தோசை—அது மாவில் சுட்ட தோசை',
        roman: 'Vattamaana thosai, adhu maavil sutta thosai',
        means: 'A round dosa, a dosa made from batter',
      },
      {
        script: 'தட்டு நிறைய நிறைய—அம்மா சுட்டுத் தந்த தோசை',
        roman: 'Thattu niraiya niraiya, amma suttu thandha thosai',
        means: 'A plateful, a plateful of dosa Amma made for me',
        note: 'Thattu is a plate.',
      },
      {
        script: 'காசு கேட்கவில்லை—என்னைக் காக்க வைக்கவில்லை',
        roman: 'Kaasu ketkavillai, ennai kaakka vaikkavillai',
        means: 'She asked for no money; she did not keep me waiting',
      },
      {
        script: 'தோசை வேணும் என்றேன்—அம்மா சுட்டுச் சுட்டுத் தந்தாள்',
        roman: 'Thosai venum endren, amma suttu suttu thandhaal',
        means: 'I said "I want dosa", and Amma made one after another',
        note: 'Venum (want) is the spoken form of vendum; the book prints the spoken form here.',
      },
      {
        script: 'ஒன்று, இரண்டு, மூன்று—என்றே உள்ளே பிய்த்துப் போட்டேன்',
        roman: 'Ondru, irandu, moondru, endre ulle piyththu potten',
        means: 'One, two, three, I counted, tearing off pieces and popping them in',
        note: 'Ondru, irandu, moondru are the written numbers. In everyday speech they are onnu, rendu, moonu.',
      },
      {
        script: 'இன்னும் ஒன்று, ஒன்று—என்றே எடுத்து, எடுத்து வைத்தாள்',
        roman: 'Innum ondru, ondru, endre eduththu, eduththu vaiththaal',
        means: '"One more, one more," she said, and kept putting them on my plate',
      },
      {
        script: 'தின்றேன் நிறையத் தோசை—மேலும் தின்னத் தானே ஆசை',
        roman: 'Thindren niraiya thosai, melum thinna thaane aasai',
        means: 'I ate lots of dosa, and still I wanted more',
      },
      {
        script: 'என்ன செய்வேன்? வயிற்றில்—துளி இடமும் இல்லை, இல்லை!',
        roman: 'Enna seiven? Vayitril thuli idamum illai, illai!',
        means: 'What can I do? There is not a drop of room left in my tummy, none!',
      },
    ],
    actions:
      'No traditional actions; these suit the words. Draw a big circle in the air on "vattamaana thosai". On "ondru, irandu, moondru", tear three pretend pieces off a pretend dosa and pop each into your mouth. On "innum ondru", hold out your hands like a plate. On the last line, pat a full tummy and shake your head. Mia pats her tummy with Amma; Arjun does the tearing and counting.',
    origin:
      'Written by Azha. Valliappa (1922-1989), the "kuzhandhai kavignar" (children\'s poet), in his book Chinnanchiru paadalgal (6th edition 1992, Kuzhandhai Puthaga Nilayam, Madras). His works are nationalised by the Tamil Nadu government, and the Tamil Wikisource scan of the book carries a CC0 public-domain dedication, so it is free to print and sing. Do not play the 2006 film song "Aasai dosai", which is copyrighted.',
    picture:
      'Amma, holding a steel plate stacked with round golden dosas, lays one more on Arjun\'s steel plate at the kitchen table as he holds it up with both hands, already chewing, while Mia, in her high chair beside him, tears a small piece off her own dosa and holds it up to show Amma.',
    cast: ['Amma', 'Arjun', 'Mia'],
    note: {
      what: 'A Tamil song about Amma\'s dosas by the children\'s poet Azha. Valliappa. The child sings it: Amma made round dosas, a plateful, without making me wait; I counted, tore and ate them; she kept saying "one more" until there was no room left in my tummy.',
      expect:
        'Arjun is likely to enjoy the counting verse and the full-tummy ending, and may start saying "innum ondru" at real meals. Mia may join on "thosai" and the tummy pat long before any other word.',
      practising:
        'Two things he can say at the table for real: "thosai venum" (I want dosa) and "innum ondru" (one more), which in everyday speech is "innum onnu". And counting to three in written Tamil: ondru, irandu, moondru.',
      ask: 'At the counting verse, stop and ask Arjun how many dosas he could eat, then count up to his number together, in Tamil or English.',
      next: 'On the next dosa morning, sing the first verse while the batter goes on the pan, and let Arjun ask for his with "thosai venum". Give it to him whether he says it in Tamil or English.',
      honest:
        'This is Valliappa\'s poem, not the folk counting rhyme "Thosai amma thosai" that many families sing; no printed text of that one could be found to check it against, so it is not printed here. Valliappa\'s Tamil is closer to written Tamil than to the way Amma talks (ondru, irandu, moondru rather than onnu, rendu, moonu). Singing the counting verse does not show that Arjun can count in Tamil away from the song.',
      easier: 'For Mia, sing only the first line, "thosai nalla thosai", over and over, and pat both your tummies at the end.',
      harder:
        'Swap roles: Arjun is Amma, serving pretend dosas and singing "innum ondru, ondru", and Amma eats until her tummy is full and she has to sing the last line.',
    },
    sources: [
      { label: 'Tamil Wikisource: Azha. Valliappa, Chinnanchiru paadalgal (page scan, CC0; "Thosai nalla thosai", pp. 25-26)', url: 'https://ta.wikisource.org/wiki/சின்னஞ்சிறு_பாடல்கள்' },
      { label: 'Tamil Wikipedia: Azha. Valliappa', url: 'https://ta.wikipedia.org/wiki/அழ._வள்ளியப்பா' },
      { label: 'Tamil Wiktionary: thosai (dosa)', url: 'https://ta.wiktionary.org/wiki/தோசை' },
      { label: 'Tamil Wikipedia: Paramasivan (2006 film; its song "Aasai dosai" is copyrighted)', url: 'https://ta.wikipedia.org/wiki/பரமசிவன்_(திரைப்படம்)' },
    ],
  },
  {
    id: 'ta-maambazhamaam',
    lang: 'ta',
    title: {
      script: 'மாம்பழமாம் மாம்பழம்',
      roman: 'Maambazhamaam maambazham',
      means: 'A mango, a mango',
      note: 'Maambazham is a mango (maa, mango tree, and pazham, ripe fruit). The zh is the Tamil letter ழ.',
    },
    lines: [
      {
        script: 'மாம்பழமாம் மாம்பழம்',
        roman: 'Maambazhamaam maambazham',
        means: 'A mango, they say, a mango',
        note: 'The -aam on the first word is a sing-song "so they say".',
      },
      {
        script: 'மல்கோவா மாம்பழம்',
        roman: 'Malgova maambazham',
        means: 'A Malgova mango',
        note: 'Malgova is the name of a mango variety.',
      },
      {
        script: 'சேலத்து மாம்பழம்',
        roman: 'Selaththu maambazham',
        means: 'A mango from Salem',
        note: 'Selaththu: from Salem, a city in Tamil Nadu.',
      },
      {
        script: 'தித்திக்கும் மாம்பழம்',
        roman: 'Thiththikkum maambazham',
        means: 'A sweet, sweet mango',
      },
      {
        script: 'அழகான மாம்பழம்',
        roman: 'Azhagaana maambazham',
        means: 'A beautiful mango',
      },
      {
        script: 'அல்வாபோல் மாம்பழம்',
        roman: 'Alvaapol maambazham',
        means: 'A mango as sweet as halwa',
        note: 'Alvaa is halwa, the soft sweet; pol means "like".',
      },
      {
        script: 'தங்க நிற மாம்பழம்',
        roman: 'Thanga nira maambazham',
        means: 'A golden mango',
        note: 'Thanga nira: the colour of gold.',
      },
      {
        script: 'உங்களுக்கும் வேண்டுமா?',
        roman: 'Ungalukkum vendumaa?',
        means: 'Do you want some too?',
      },
      {
        script: 'இங்கே ஓடி வாருங்கள்',
        roman: 'Inge odi vaarungal',
        means: 'Come running here',
        note: 'Vaarungal is "come" said to several people, or politely.',
      },
      {
        script: 'பங்கு போட்டுத் தின்னலாம்',
        roman: 'Pangu pottu thinnalaam',
        means: 'Let\'s share it out and eat',
        note: 'Pangu pottu: dividing into shares.',
      },
    ],
    actions:
      'No traditional actions; these suit the words. Cup both hands round a pretend mango, rub your tummy on "thiththikkum", trace a big round shape on "azhagaana", beckon on "inge odi vaarungal", and on the last line break the pretend mango and hand out the pieces. Mia runs in on "odi vaarungal"; Arjun does the sharing out.',
    origin:
      'Written by Azha. Valliappa (1922-1989), the "kuzhandhai kavignar" (children\'s poet), in his books Chinnanchiru paadalgal (6th edition 1992, Kuzhandhai Puthaga Nilayam, Madras) and Paattu paaduvom. It is not a folk rhyme and not by Bharathidasan. His works are nationalised by the Tamil Nadu government, and the Tamil Wikisource scan of Chinnanchiru paadalgal carries a CC0 public-domain dedication, so it is free to print and sing.',
    picture:
      'Paati, visiting from Chennai, sits at the backyard patio table holding up a big golden mango in both hands, a steel plate of cut mango pieces in front of her, while Arjun runs to her across the lawn and Mia, standing at the table, holds a piece of mango out to Arjun to share.',
    cast: ['Paati', 'Arjun', 'Mia'],
    note: {
      what: 'A Tamil mango song by the children\'s poet Azha. Valliappa. It praises a mango line by line, sweet, beautiful, golden, as sweet as halwa, then asks "do you want some too?" and calls everyone to come running and share it.',
      expect:
        'Mia may join on "maambazham" and come running on "odi vaarungal". Arjun may like the sharing ending best and want to be the one who hands out the pieces, which is the point of the song.',
      practising:
        'Describing words before one repeating noun: Malgova, Selaththu (from Salem), thiththikkum (sweet), azhagaana (beautiful), alvaapol (like halwa), thanga nira (gold-coloured), each followed by maambazham. Then a real question he can use when sharing: "ungalukkum vendumaa?" (do you want some too?), in everyday speech "ungalukkum venumaa?".',
      ask: 'Before the last three lines, ask Arjun what else the mango is like, and sing his answer before "maambazham", even if he says it in English.',
      next: 'When there are mangoes in the shops, sing it while a grown-up cuts one, and let Arjun ask "ungalukkum venumaa?" as he shares the pieces out.',
      honest:
        'This is a poem with a fixed text, not a folk song; whether popular recordings add verses was not checked, so only the book\'s ten lines are printed. Its Tamil is the poet\'s written Tamil: at home Amma is more likely to say "odi vaanga" than "odi vaarungal", and "venumaa" than "vendumaa". Singing "Malgova" and "Selaththu" does not teach him what those mangoes are.',
      easier: 'For Mia, sing only "maambazhamaam maambazham" and "inge odi vaarungal", and let her run to you for a piece of mango.',
      harder:
        'Let Arjun make up a new describing line each time, "manjal maambazham" (a yellow mango) or "pachai maambazham" (a green mango), and sing it in the middle of the song.',
      safety: 'A grown-up cuts the mango. For Mia, cut it into small, soft pieces without the skin, and keep the stone away from her.',
    },
    sources: [
      { label: 'Tamil Wikisource: Azha. Valliappa, Chinnanchiru paadalgal (page scan, CC0; "Maambazham", p. 2)', url: 'https://ta.wikisource.org/wiki/சின்னஞ்சிறு_பாடல்கள்' },
      { label: 'Tamil Wikisource: Azha. Valliappa, Paattu paaduvom', url: 'https://ta.wikisource.org/wiki/பாட்டுப்_பாடுவோம்' },
      { label: 'Tamil Wikipedia: Azha. Valliappa', url: 'https://ta.wikipedia.org/wiki/அழ._வள்ளியப்பா' },
    ],
  },
];
