import type { Moment } from '../types';

/**
 * Six everyday home moments: waking up, breakfast, getting dressed, bedtime,
 * being gentle with Mia, and comfort after a bump.
 *
 * Every word is copied from .redesign/v3/research/telugu-words.jsonl,
 * tamil-all.jsonl or the word check in heritage-research.md (section 16).
 * Lines longer than one checked word or phrase are composed from those
 * words plus a common ending (-ki / -kku "to", -aa "?"), and their notes say
 * so: a fluent speaker should confirm them before recording. Tamil is the
 * spoken Chennai form; the written form is in the note where it differs.
 *
 * Register, applied the same way in both languages and in every file here:
 * grown-ups use the familiar imperative to the children (raa, choodu, vaa,
 * paaru); the children use the same familiar form to Amma and Nanna, and the
 * respectful form to Nanamma, Tatayya, Paati and Thatha (randi, choodandi;
 * vaanga, paarunga). Many families use the respectful form with parents too;
 * each note says so, because this is a family choice, not a rule.
 */
export const MOMENTS: readonly Moment[] = [
  {
    id: 'up-sleepyhead',
    title: 'Up, Sleepyhead',
    hook: 'The curtains open, the sun is on the lemon tree, and the first words of the day can be Telugu or Tamil.',
    when: 'morning',
    picture:
      'Amma draws open the bedroom curtains onto the sunny backyard and the lemon tree, one arm held out, while Arjun sits up in bed, hair sticking up, stretching both arms towards her and yawning. Morning light, rumpled blanket, picture books on the shelf. No words or letters anywhere in the picture.',
    cast: ['Amma', 'Arjun'],
    grownUp: [
      {
        id: 'up-sleepyhead-g1',
        te: {
          script: 'రా, నాన్న',
          roman: 'Raa, naanna',
          means: 'Come here, sweetheart',
          note: 'Composed from checked words; have a fluent speaker confirm. రా (raa) = come (familiar, to a child); నాన్న (naanna) = literally "father", and also what Telugu parents call a little boy fondly. The research records "raa naanna" (come, dear) as an everyday softened form.',
        },
        ta: {
          script: 'வா, கண்ணு',
          roman: 'Vaa, kannu',
          means: 'Come here, sweetheart',
          note: 'Composed from checked words; have a fluent speaker confirm. வா (vaa) = come; கண்ணு (kannu) = literally "eye", the everyday endearment "my darling". Written form of kannu is கண் (kan).',
        },
      },
      {
        id: 'up-sleepyhead-g2',
        te: { script: 'చూడు!', roman: 'Choodu!', means: 'Look!', note: 'Point out of the window: the sun, the lemon tree, a bird on the fence.' },
        ta: {
          script: 'பாரு!',
          roman: 'Paaru!',
          means: 'Look!',
          note: 'Spoken form; written பார் (paar). Point out of the window: the sun, the lemon tree, a bird on the fence.',
        },
      },
      {
        id: 'up-sleepyhead-g3',
        te: {
          script: 'పాలు కావాలా?',
          roman: 'Paalu kaavaalaa?',
          means: 'Do you want some milk?',
          note: 'Composed from checked words; have a fluent speaker confirm. పాలు (paalu) = milk; కావాలా (kaavaalaa) = do you want? The research suggests this exact line as a warm reply when he asks in English.',
        },
        ta: {
          script: 'பால் வேணுமா?',
          roman: 'Paal venumaa?',
          means: 'Do you want some milk?',
          note: 'Composed from checked words; have a fluent speaker confirm. பால் (paal) = milk, often said paalu; வேணுமா (venumaa) = do you want?, spoken form of written வேண்டுமா (vendumaa). The research suggests this exact line as a warm reply when he asks in English.',
        },
      },
    ],
    child: [
      {
        id: 'up-sleepyhead-c1',
        te: {
          script: 'నాన్న, రా!',
          roman: 'Naanna, raa!',
          means: 'Nanna, come!',
          note: 'Composed from checked words; have a fluent speaker confirm. నాన్న (naanna) = Dad; రా (raa) = come, the familiar form, which this family keeps for Amma and Nanna; the respectful రండి (randi) is for Nanamma, Tatayya, Paati and Thatha. Many families use randi with parents as well: use what yours says. For the mornings he wakes up first and fetches Nanna.',
        },
        ta: {
          script: 'அம்மா, வா!',
          roman: 'Amma, vaa!',
          means: 'Amma, come!',
          note: 'Composed from checked words; have a fluent speaker confirm. அம்மா (amma) = Mom; வா (vaa) = come, the familiar form this family keeps for Amma and Nanna; to a grandparent he says வாங்க (vaanga). For the mornings he wakes up first and fetches Amma.',
        },
      },
      {
        id: 'up-sleepyhead-c2',
        te: { script: 'ఆకలి!', roman: 'Aakali!', means: "I'm hungry!", note: 'One word, said as a complaint. Fuller forms: naaku aakali, aakalestondi.' },
        ta: { script: 'பசி!', roman: 'Pasi!', means: "I'm hungry!", note: 'One word, said as a complaint. Same spoken and written.' },
      },
    ],
    note: {
      what: 'The first two minutes of the day. The grown-up calls him over, points out of the window, and offers milk; he can call a parent in, or announce that he is hungry.',
      expect:
        'Sleepy children answer in whatever comes first, which is often English. He may come when called and say nothing, and that already counts as understanding "raa" or "vaa". "Hungry!" is the line most likely to come back in Telugu or Tamil, because it gets breakfast.',
      practising:
        'Three short lines that come back every morning: come here, look, do you want milk. The same words turn up again at breakfast, getting ready and bedtime, so a week of mornings gives him many hearings of each.',
      ask: 'Before you open the curtains, ask him to guess what is outside today, sun or fog, and answer in your language whichever language he guesses in.',
      next: 'For a week, let the morning greeting be the same line from the same parent: "Raa, naanna" from Nanna or "Vaa, kannu" from Amma. Notice whether he starts to come before you finish the words.',
      honest:
        'A routine line heard every day is easy to recognise and easy to mistake for knowing the language. He can come at "vaa" from your tone and your open arms. It says little about whether he understands an unfamiliar sentence, and nothing about speaking.',
      easier: 'Just "Raa!" or "Vaa!" with open arms. Open arms carry the meaning.',
      harder: 'Swap roles on a weekend morning: Arjun wakes the grown-up with "Naanna, raa!" or "Amma, vaa!" and offers the milk himself: "Paalu kaavaalaa?" / "Paal venumaa?".',
    },
    sources: [
      { label: 'Wiktionary: రా (raa, come)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: నాన్న (naanna)', url: 'https://en.wiktionary.org/wiki/నాన్న' },
      { label: 'Wiktionary: చూడు (choodu, look)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: పాలు (paalu, milk)', url: 'https://en.wiktionary.org/wiki/పాలు' },
      { label: 'Wiktionary: ఆకలి (aakali, hunger)', url: 'https://en.wiktionary.org/wiki/ఆకలి' },
      { label: 'Wiktionary: வா (vaa, come)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%BE' },
      { label: 'Wiktionary: கண் (kan, eye; kannu, darling)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AE%A3%E0%AF%8D' },
      { label: 'Tamil Wiktionary: பாரு (paaru, look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
      { label: 'Wiktionary: பசி (pasi, hunger)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%9A%E0%AE%BF' },
      { label: 'DSAL: Tamil Lexicon (venum, spoken form of vendum)', url: 'https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py' },
    ],
  },
  {
    id: 'dosa-for-two',
    title: 'Who Wants Dosa?',
    hook: 'Hands washed, plates out, and the dosas get counted onto the plate one at a time.',
    when: 'meals',
    picture:
      'Arjun, kneeling up on a kitchen chair at the table, holds up two fingers and grins while Nanna, at the stove, lifts a crisp dosa off the flat pan with a spatula towards Arjun\'s steel plate. Open kitchen, a steel tumbler of water beside the plate, an idli stand on the shelf, morning light. No words or letters anywhere in the picture.',
    cast: ['Arjun', 'Nanna'],
    grownUp: [
      {
        id: 'dosa-for-two-g1',
        te: {
          script: 'చేతులు కడుక్కో',
          roman: 'Chetulu kadukko',
          means: 'Wash your hands',
          note: 'చేతులు (chetulu) = hands; కడుక్కో (kadukko) = wash (your own). The -kko ending means "for yourself", used for washing your own body.',
        },
        ta: {
          script: 'கை கழுவு',
          roman: 'Kai kazhuvu',
          means: 'Wash your hands',
          note: 'கை (kai) = hand; கழுவு (kazhuvu) = wash. Often said kai kaluvu.',
        },
      },
      {
        id: 'dosa-for-two-g2',
        te: {
          script: 'దోశ కావాలా?',
          roman: 'Dosa kaavaalaa?',
          means: 'Do you want a dosa?',
          note: 'Composed from checked words; have a fluent speaker confirm. దోశ (dosa) + కావాలా (kaavaalaa, do you want?). Spellings vary: Telugu Wikipedia\'s title is దోసె, its first line uses దోశ, and దోస is common too. The native word is attu (as in pesarattu).',
        },
        ta: {
          script: 'தோசை வேணுமா?',
          roman: 'Dosai venumaa?',
          means: 'Do you want a dosa?',
          note: 'Composed from checked words; have a fluent speaker confirm. தோசை (dosai) + வேணுமா (venumaa, do you want?). The last vowel softens in speech, so it sounds like "dose"; this guide romanises the script as dosai everywhere. Written form: தோசை வேண்டுமா? (dosai vendumaa?).',
        },
      },
      {
        id: 'dosa-for-two-g3',
        te: {
          script: 'ఒకటి, రెండు!',
          roman: 'Okati, rendu!',
          means: 'One, two!',
          note: 'Composed from checked words; have a fluent speaker confirm. ఒకటి (okati) = one; రెండు (rendu) = two. Count each dosa as it lands on the plate.',
        },
        ta: {
          script: 'ஒண்ணு, ரெண்டு!',
          roman: 'Onnu, rendu!',
          means: 'One, two!',
          note: 'Composed from checked words; have a fluent speaker confirm. ஒண்ணு (onnu) = one, written ஒன்று (ondru); ரெண்டு (rendu) = two, written இரண்டு (irandu). Count each dosa as it lands on the plate.',
        },
      },
      {
        id: 'dosa-for-two-g4',
        te: {
          script: 'నీళ్ళు తాగు',
          roman: 'Neellu taagu',
          means: 'Have some water',
          note: 'Composed from checked words; have a fluent speaker confirm. నీళ్ళు (neellu) = water, also spelled నీళ్లు; తాగు (taagu) = drink. The research word list gives "neellu taagu" as an everyday phrase.',
        },
        ta: {
          script: 'தண்ணி குடி',
          roman: 'Thanni kudi',
          means: 'Have some water',
          note: 'Composed from checked words; have a fluent speaker confirm. தண்ணி (thanni) = water, written தண்ணீர் (thanneer); குடி (kudi) = drink.',
        },
      },
    ],
    child: [
      {
        id: 'dosa-for-two-c1',
        te: {
          script: 'దోశ కావాలి!',
          roman: 'Dosa kaavaali!',
          means: 'I want a dosa!',
          note: 'Composed from checked words; have a fluent speaker confirm. దోశ (dosa) + కావాలి (kaavaali, is wanted). The answer to "Dosa kaavaalaa?" is the same words without the question ending.',
        },
        ta: {
          script: 'தோசை வேணும்!',
          roman: 'Dosai venum!',
          means: 'I want a dosa!',
          note: 'Composed from checked words; have a fluent speaker confirm. தோசை (dosai, said "dose") + வேணும் (venum, want), written வேண்டும் (vendum). The answer to "Dosai venumaa?" is the same words without the question ending.',
        },
      },
      {
        id: 'dosa-for-two-c2',
        te: {
          script: 'రెండు!',
          roman: 'Rendu!',
          means: 'Two!',
          note: 'Said holding up two fingers, asking for two dosas at once. He can bargain upwards: moodu (three), naalugu (four).',
        },
        ta: {
          script: 'ரெண்டு!',
          roman: 'Rendu!',
          means: 'Two!',
          note: 'Spoken form; written இரண்டு (irandu). Said holding up two fingers, asking for two dosas at once. He can bargain upwards: moonu (three), naalu (four).',
        },
      },
    ],
    note: {
      what: 'Breakfast at the table. The grown-up asks him to wash his hands, offers a dosa, counts dosas onto the plate and offers water; he asks for a dosa, or for two.',
      expect:
        'He is likely to answer "Dosa kaavaalaa?" with a nod or a plain "yes". The counting may stick first, because his fingers do half the work. Asking for two is a joke the first time and a bargaining game after that.',
      practising:
        'The want-question and its answer. In Telugu the question kaavaalaa? becomes the answer kaavaali; in Tamil venumaa? becomes venum. One food word goes in front, so the same frame works for milk, water or idli.',
      ask: 'When he asks for two in English, answer in your language and hold up the fingers: "Rendu? Okati, rendu!" Then put the second dosa down.',
      next: 'Use the same question at every meal for a week with a different food in front of it: idli, upma, toast, a banana. He hears one frame many times with many words in it.',
      honest:
        'Three of these lines are composed by this guide, not copied as whole phrases, and need a fluent speaker\'s ear before you record them. Counting to two at the table shows he knows the number words in that setting, not that he can count objects in Telugu or Tamil anywhere else.',
      easier: 'Just the offer and a nod: hold up the dosa, say "Dosa kaavaalaa?" or "Dosai venumaa?", and wait for the nod.',
      harder: 'Let him serve: he asks Nanna or Amma "Dosa kaavaalaa?" / "Dosai venumaa?" and counts the dosas onto their plate.',
      safety: 'A dosa straight off the pan is hot. Count it onto the plate and let it sit a moment before small hands reach for it.',
    },
    sources: [
      { label: 'Wiktionary: కడుగు (kadugu, wash)', url: 'https://en.wiktionary.org/wiki/కడుగు' },
      { label: 'Telugu Wikipedia: దోసె (dosa)', url: 'https://te.wikipedia.org/wiki/దోసె' },
      { label: 'Wiktionary: ఒకటి (okati, one; Telugu number table)', url: 'https://en.wiktionary.org/wiki/ఒకటి' },
      { label: 'Wiktionary: నీళ్లు (neellu, water)', url: 'https://en.wiktionary.org/wiki/నీళ్లు' },
      { label: 'Wiktionary: త్రాగు (taagu, drink)', url: 'https://en.wiktionary.org/wiki/త్రాగు' },
      { label: 'Wiktionary: கை (kai, hand)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AF%88' },
      { label: 'Wiktionary: தோசை (dosai)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AF%8B%E0%AE%9A%E0%AF%88' },
      { label: 'Wiktionary: ஒண்ணு (onnu, one)', url: 'https://en.wiktionary.org/wiki/%E0%AE%92%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AF%81' },
      { label: 'Wiktionary: ரெண்டு (rendu, two)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B0%E0%AF%86%E0%AE%A3%E0%AF%8D%E0%AE%9F%E0%AF%81' },
      { label: 'Wiktionary: தண்ணி (thanni, water)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AE%BF' },
      { label: 'Wiktionary: குடி (kudi, drink)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AF%81%E0%AE%9F%E0%AE%BF' },
      { label: 'DSAL: Tamil Lexicon (venum, spoken form of vendum)', url: 'https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py' },
    ],
  },
  {
    id: 'which-foot-first',
    title: 'Which Foot First?',
    hook: 'Sit down, arm in the sleeve, foot in the sneaker, and then he gets to show off.',
    when: 'ready',
    picture:
      'Arjun, sitting on the floor by the front door with one sneaker already on, sticks his other bare foot out towards Amma, who kneels in front of him holding the open sneaker; his jacket hangs half on, one sleeve empty. Backpacks, a scooter and a row of sneakers by the door, morning light from the window. No words or letters anywhere in the picture.',
    cast: ['Arjun', 'Amma'],
    grownUp: [
      {
        id: 'which-foot-first-g1',
        te: {
          script: 'కూర్చో',
          roman: 'Koorcho',
          means: 'Sit down',
          note: 'Most people say కూచో (koocho), a spoken variant Wiktionary lists. The respectful form కూర్చోండి (koorchondi) is what he would say to a grown-up.',
        },
        ta: {
          script: 'உட்காரு',
          roman: 'Utkaaru',
          means: 'Sit down',
          note: 'Spoken form, usually said ukkaaru. Written form: உட்கார் (utkaar).',
        },
      },
      {
        id: 'which-foot-first-g2',
        te: {
          script: 'చెయ్యి ఇవ్వు',
          roman: 'Cheyyi ivvu',
          means: 'Give me your arm',
          note: 'Composed from checked words; have a fluent speaker confirm. చెయ్యి (cheyyi) = hand, arm; ఇవ్వు (ivvu) = give. Said holding the jacket sleeve open.',
        },
        ta: {
          script: 'கை குடு',
          roman: 'Kai kudu',
          means: 'Give me your arm',
          note: 'Composed from checked words; have a fluent speaker confirm. கை (kai) = hand, arm; குடு (kudu) = give, written கொடு (kodu). Said holding the jacket sleeve open.',
        },
      },
      {
        id: 'which-foot-first-g3',
        te: {
          script: 'కాలు ఇవ్వు',
          roman: 'Kaalu ivvu',
          means: 'Give me your foot',
          note: 'Composed from checked words; have a fluent speaker confirm. కాలు (kaalu) = leg or foot; ఇవ్వు (ivvu) = give. Said holding the sneaker open. When he can do it himself: షూస్ వేసుకో (shoes vesuko), put your shoes on.',
        },
        ta: {
          script: 'காலு குடு',
          roman: 'Kaalu kudu',
          means: 'Give me your foot',
          note: 'Composed from checked words; have a fluent speaker confirm. காலு (kaalu) = leg or foot, written கால் (kaal); குடு (kudu) = give, written கொடு (kodu). Said holding the sneaker open.',
        },
      },
    ],
    child: [
      {
        id: 'which-foot-first-c1',
        te: {
          script: 'నాన్న, చూడు!',
          roman: 'Naanna, choodu!',
          means: 'Nanna, look!',
          note: 'Composed from checked words; have a fluent speaker confirm. నాన్న (naanna) = Dad; చూడు (choodu) = look, the familiar form this family keeps for Amma and Nanna; to Nanamma, Tatayya, Paati or Thatha he says చూడండి (choodandi). Many families use choodandi with parents too: use what yours says. For when both shoes are on and he did it himself.',
        },
        ta: {
          script: 'அம்மா, பாரு!',
          roman: 'Amma, paaru!',
          means: 'Amma, look!',
          note: 'Composed from checked words; have a fluent speaker confirm. அம்மா (amma) = Mom; பாரு (paaru) = look, written பார் (paar), the familiar form kept for Amma and Nanna; to a grandparent he says பாருங்க (paarunga). For when both shoes are on and he did it himself.',
        },
      },
      {
        id: 'which-foot-first-c2',
        te: {
          script: 'నాన్న కాలు!',
          roman: 'Naanna kaalu!',
          means: "Nanna's foot!",
          note: 'Composed from checked words; have a fluent speaker confirm. నాన్న (naanna) + కాలు (kaalu, foot). The joke: he tries to put his little sneaker on Nanna\'s big foot.',
        },
        ta: {
          script: 'அம்மா காலு!',
          roman: 'Amma kaalu!',
          means: "Amma's foot!",
          note: 'Composed from checked words; have a fluent speaker confirm. அம்மா (amma) + காலு (kaalu, foot), the two words side by side; ask a fluent speaker whether Amma would say it this way. The joke: he tries to put his little sneaker on Amma\'s big foot.',
        },
      },
    ],
    note: {
      what: 'Getting dressed and into shoes by the front door. The grown-up asks him to sit, to give an arm for the sleeve and a foot for the sneaker; he shows off the finished job, or tries his shoe on the grown-up\'s foot.',
      expect:
        'He will probably hold out a foot before you finish "kaalu", because the sneaker in your hand says it. Hand and foot may get mixed up at first, and offering the wrong one on purpose is likely to become the game.',
      practising:
        'Two body words, hand or arm and leg or foot, inside one frame: "give me your ...". The Telugu kaalu and the Tamil kaalu are the same sound for the same thing, which makes this the easy pair.',
      ask: 'Hold the sneaker out and ask in your language which foot goes first. Whichever foot he gives, name it as you put the shoe on.',
      next: 'Use the same two lines at bath time, with the towel, and at the park, with the coat. The body words move to a new place and stay the same.',
      honest:
        'Holding out a foot when you hold out a shoe does not show he understood "kaalu": the shoe tells him. To find out, say "cheyyi ivvu" or "kai kudu" while holding the shoe, and see what he gives you. Telugu and Tamil kaalu sound alike, but the next pair, cheyyi and kai, do not; do not expect one language to teach the other.',
      easier: 'Only "Kaalu ivvu" or "Kaalu kudu", and tap his foot as you say it.',
      harder: 'He dresses a teddy, and tells the teddy: "Kaalu ivvu" or "Kaalu kudu", "Cheyyi ivvu" or "Kai kudu".',
    },
    sources: [
      { label: 'Wiktionary: కూర్చొను (koorchonu, sit)', url: 'https://en.wiktionary.org/wiki/కూర్చొను' },
      { label: 'Wiktionary: చెయ్యి (cheyyi, hand)', url: 'https://en.wiktionary.org/wiki/చెయ్యి' },
      { label: 'Wiktionary: ఇచ్చు (ivvu, give)', url: 'https://en.wiktionary.org/wiki/ఇచ్చు' },
      { label: 'Wiktionary: కాలు (kaalu, leg, foot)', url: 'https://en.wiktionary.org/wiki/కాలు' },
      { label: 'Wiktionary: వేసుకొను (vesuko, put on)', url: 'https://en.wiktionary.org/wiki/వేసుకొను' },
      { label: 'Wiktionary: చూడు (choodu, look)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: உட்கார் (utkaar, sit)', url: 'https://en.wiktionary.org/wiki/%E0%AE%89%E0%AE%9F%E0%AF%8D%E0%AE%95%E0%AE%BE%E0%AE%B0%E0%AF%8D' },
      { label: 'Wiktionary: கை (kai, hand)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AF%88' },
      { label: 'Tamil Wiktionary: குடு (kudu, give)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%95%E0%AF%81%E0%AE%9F%E0%AF%81' },
      { label: 'Wiktionary: கால் (kaal, leg, foot)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AE%BE%E0%AE%B2%E0%AF%8D' },
      { label: 'Tamil Wiktionary: பாரு (paaru, look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
    ],
  },
  {
    id: 'one-story-then-sleep',
    title: 'One Story, Then Sleep',
    hook: 'The lamp is low, the moon is in the window, and he gets to choose: a story or a song.',
    when: 'bedtime',
    picture:
      'Nanna, sitting on the edge of Arjun\'s bed with a picture book closed on his knee, pulls the blanket up to Arjun\'s chin while Arjun, lying on his pillow, points past him at the moon in the dark window. Low bedside lamp, toys on the shelf, curtains half open. No words or letters anywhere in the picture.',
    cast: ['Nanna', 'Arjun'],
    grownUp: [
      {
        id: 'one-story-then-sleep-g1',
        te: {
          script: 'కథ కావాలా?',
          roman: 'Katha kaavaalaa?',
          means: 'Do you want a story?',
          note: 'Composed from checked words; have a fluent speaker confirm. కథ (katha) = story; కావాలా (kaavaalaa) = do you want?',
        },
        ta: {
          script: 'கதை வேணுமா?',
          roman: 'Kadhai venumaa?',
          means: 'Do you want a story?',
          note: 'Composed from checked words; have a fluent speaker confirm. கதை (kadhai) = story; வேணுமா (venumaa) = do you want?, written வேண்டுமா (vendumaa).',
        },
      },
      {
        id: 'one-story-then-sleep-g2',
        te: {
          script: 'చందమామ! చూడు!',
          roman: 'Chandamaama! Choodu!',
          means: 'The moon! Look!',
          note: 'Composed from checked words; have a fluent speaker confirm. చందమామ (chandamaama) = the moon, "Uncle Moon", as in the lullaby Chandamaama raave; చూడు (choodu) = look.',
        },
        ta: {
          script: 'நிலா! பாரு!',
          roman: 'Nilaa! Paaru!',
          means: 'The moon! Look!',
          note: 'Composed from checked words; have a fluent speaker confirm. நிலா (nilaa) = the moon, as in the lullaby Nilaa nilaa odi vaa; பாரு (paaru) = look, written பார் (paar).',
        },
      },
      {
        id: 'one-story-then-sleep-g3',
        te: {
          script: 'పడుకో, నాన్న',
          roman: 'Paduko, naanna',
          means: 'Lie down now, sweetheart',
          note: 'Composed from checked words; have a fluent speaker confirm. పడుకో (paduko, often lengthened padukoo) = lie down, go to sleep; నాన్న (naanna) = dear, said fondly to a little boy.',
        },
        ta: {
          script: 'தூங்கு, கண்ணு',
          roman: 'Thoongu, kannu',
          means: 'Go to sleep, sweetheart',
          note: 'Composed from checked words; have a fluent speaker confirm. தூங்கு (thoongu) = sleep; கண்ணு (kannu) = darling, literally "eye", written கண் (kan).',
        },
      },
    ],
    child: [
      {
        id: 'one-story-then-sleep-c1',
        te: {
          script: 'కథ కావాలి!',
          roman: 'Katha kaavaali!',
          means: 'I want a story!',
          note: 'Composed from checked words; have a fluent speaker confirm. కథ (katha) = story; కావాలి (kaavaali) = is wanted. The answer to "Katha kaavaalaa?".',
        },
        ta: {
          script: 'கதை வேணும்!',
          roman: 'Kadhai venum!',
          means: 'I want a story!',
          note: 'Composed from checked words; have a fluent speaker confirm. கதை (kadhai) = story; வேணும் (venum) = want, written வேண்டும் (vendum). The answer to "Kadhai venumaa?".',
        },
      },
      {
        id: 'one-story-then-sleep-c2',
        te: {
          script: 'పాట!',
          roman: 'Paata!',
          means: 'A song!',
          note: 'One word: he picks a song instead of a story. Nanna can sing Chandamaama raave.',
        },
        ta: {
          script: 'பாட்டு!',
          roman: 'Paattu!',
          means: 'A song!',
          note: 'One word: he picks a song instead of a story. Amma can sing Nilaa nilaa odi vaa.',
        },
      },
    ],
    note: {
      what: 'The last minutes before sleep. The grown-up offers a story, points out the moon, and says goodnight with "lie down"; he chooses a story or a song.',
      expect:
        'Choosing is the fun part, and he may choose in English: "Song!". Answer in your language and give him the song. Expect to be asked for "one more" in English; the frame "Katha kaavaali!" / "Kadhai venum!" is there for when he wants to ask in yours.',
      practising:
        'Making a choice in the want-frame from breakfast, now with katha or kadhai (story) and paata or paattu (song), and the moon word from the two lullabies.',
      ask: 'Before the story, ask him which story or song he wants tonight, in your language, and wait for his answer in either language.',
      next: 'Give the moon line a home: on a clear night, open the curtain, say "Chandamaama! Choodu!" or "Nilaa! Paaru!", and sing the lullaby that goes with it.',
      honest:
        'A child half asleep is a good listener and a poor speaker; do not ask him to repeat anything at bedtime. A story read from an English book is still an English story, even with Telugu or Tamil around it; telling it in your own words, in your language, is what makes it Telugu or Tamil time.',
      easier: 'Only the moon: point and say "Chandamaama!" or "Nilaa!", and let him point back.',
      harder: 'He tells the story: one picture book, he says what happens on each page, in any language, and you say it back in yours.',
    },
    sources: [
      { label: 'DSAL: C. P. Brown, Telugu-English Dictionary (katha, story; paata, song)', url: 'https://dsal.uchicago.edu/cgi-bin/app/brown_query.py' },
      { label: 'Telugu Wikipedia: Chandamama raave', url: 'https://te.wikipedia.org/wiki/చందమామ_రావే' },
      { label: 'Wiktionary: చూడు (choodu, look)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: పడుకొను (paduko, lie down)', url: 'https://en.wiktionary.org/wiki/పడుకొను' },
      { label: 'Wiktionary: నాన్న (naanna)', url: 'https://en.wiktionary.org/wiki/నాన్న' },
      { label: 'DSAL: Tamil Lexicon (kadhai, story; paattu, song; venum)', url: 'https://dsal.uchicago.edu/cgi-bin/app/tamil-lex_query.py' },
      { label: 'Wiktionary: நிலா (nilaa, moon)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A8%E0%AE%BF%E0%AE%B2%E0%AE%BE' },
      { label: 'Tamil Wiktionary: பாரு (paaru, look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
      { label: 'Wiktionary: தூங்கு (thoongu, sleep)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AF%82%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AF%81' },
      { label: 'Wiktionary: கண் (kan, eye; kannu, darling)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AE%A3%E0%AF%8D' },
    ],
  },
  {
    id: 'anna-roll-it-to-me',
    title: 'Anna, Roll It to Me!',
    hook: 'Mia calls him "anna", holds out her hands, and he rolls the ball slowly enough for her to catch.',
    when: 'mia',
    picture:
      'Arjun, kneeling upright on the backyard lawn, rolls a big soft ball slowly across the grass towards Mia, who stands with both hands out, mouth open mid-call, while Amma sits on the patio step behind Mia, smiling and leaning forward. Wooden fence, raised vegetable beds, the lemon tree, afternoon sun. Match the approved character lineup: Arjun 110 cm standing, Mia 87 cm standing (her crown at his upper chest); preserve their individual head, torso and limb proportions (Mia a toddler: large head, short legs; Arjun a five-year-old: longer legs); compare height only at equal depth; kneeling upright puts Arjun\'s head about level with Mia\'s, sitting on his heels lower. No words or letters anywhere in the picture.',
    cast: ['Arjun', 'Mia', 'Amma'],
    grownUp: [
      {
        id: 'anna-roll-it-to-me-g4',
        te: {
          script: 'మియాకి ఇవ్వు',
          roman: 'Mia-ki ivvu',
          means: 'Give it to Mia',
          note: 'Composed from checked words; have a fluent speaker confirm. మియా (Mia) + -కి (-ki, to); ఇవ్వు (ivvu) = give. Her name is the same word in all three languages, so a grown-up talking about her uses it; written out in full, miyaaki ivvu. The research word list gives the phrase with the word for little sister instead, "chelliki ivvu", and చెల్లి (chelli) is in the picture words, but this family says her name. Neither research file spells a child\'s name, so have a fluent speaker check మియా.',
        },
        ta: {
          script: 'மியாவுக்கு குடு',
          roman: 'Mia-vukku kudu',
          means: 'Give it to Mia',
          note: 'Composed from checked words; have a fluent speaker confirm. மியா (Mia) + -வுக்கு (-vukku, to: the -ukku ending with the -v- a name ending in a vowel takes); குடு (kudu) = give, written கொடு (kodu). Written out in full, miyaavukku kudu. தங்கச்சி (thangachi, little sister) is in the picture words; this family says her name. Have a fluent speaker check மியா.',
        },
      },
      {
        id: 'anna-roll-it-to-me-g3',
        te: {
          script: 'చూడు! బంతి!',
          roman: 'Choodu! Banti!',
          means: 'Look! The ball!',
          note: 'Composed from checked words; have a fluent speaker confirm. చూడు (choodu) = look; బంతి (banti) = ball. Said when the ball reaches Mia, or nearly does. Neither checked list gives a way to say "look at her" without the word for little sister in front, which sounds like calling to her instead, so this line names the ball both children are watching. Her name works in any language: "Mia! Choodu, Mia!"',
        },
        ta: {
          script: 'பாரு! பந்து!',
          roman: 'Paaru! Pandhu!',
          means: 'Look! The ball!',
          note: 'Composed from checked words; have a fluent speaker confirm. பாரு (paaru) = look, written பார் (paar); பந்து (pandhu) = ball. Said when the ball reaches Mia, or nearly does. Her name works in any language: "Mia! Paaru, Mia!"',
        },
      },
    ],
    child: [
      {
        id: 'anna-roll-it-to-me-c1',
        by: 'Mia',
        te: {
          script: 'అన్నా!',
          roman: 'Anna!',
          means: 'Anna! (big brother)',
          note: 'Mia\'s line, not Arjun\'s: what she calls him. అన్న (anna) = big brother; calling him, the last vowel stretches, అన్నా. She says "Arjun anna", or just "anna". Many Telugu families use the longer అన్నయ్య (annayya) instead; this family does not.',
        },
        ta: {
          script: 'அண்ணா!',
          roman: 'Anna!',
          means: 'Anna! (big brother)',
          note: 'Mia\'s line, not Arjun\'s: what she calls him. அண்ணா (anna) is the calling form; talking about him, people say அண்ணன் (annan). She says "Arjun anna", or just "anna".',
        },
      },
      {
        id: 'anna-roll-it-to-me-c3',
        by: 'Mia',
        te: {
          script: 'ఇవ్వు!',
          roman: 'Ivvu!',
          means: 'Give it to me!',
          note: 'Mia\'s line. ఇవ్వు (ivvu) = give, one word, with her open hands doing the rest; a two-year-old asks for the ball this way. Neither checked list has a word for rolling or for throwing, so the ask is simply "give". The respectful ఇవ్వండి (ivvandi) comes years later.',
        },
        ta: {
          script: 'குடு!',
          roman: 'Kudu!',
          means: 'Give it to me!',
          note: 'Mia\'s line. குடு (kudu) = give, written கொடு (kodu), one word, with her open hands doing the rest. Neither checked list has a word for rolling or for throwing, so the ask is simply "give".',
        },
      },
      {
        id: 'anna-roll-it-to-me-c4',
        te: {
          script: 'బంతి! రా!',
          roman: 'Banti! Raa!',
          means: 'The ball! Come on!',
          note: 'Composed from checked words; have a fluent speaker confirm. బంతి (banti) = ball; రా (raa) = come. Arjun\'s answer when Mia calls "Anna!". Say her name with it, "Mia, raa!": a name is the same word in Telugu, Tamil and English.',
        },
        ta: {
          script: 'பந்து! வா!',
          roman: 'Pandhu! Vaa!',
          means: 'The ball! Come on!',
          note: 'Composed from checked words; have a fluent speaker confirm. பந்து (pandhu) = ball; வா (vaa) = come. Arjun\'s answer when Mia calls "Anna!". Say her name with it, "Mia, vaa!": a name is the same word in Telugu, Tamil and English.',
        },
      },
    ],
    note: {
      what: 'Rolling a ball between brother and sister on the lawn. Mia calls him "anna" and asks for the ball; he calls her over with it; the grown-up asks him to give it to Mia, by name, and points out the ball when it arrives.',
      expect:
        'Mia may say "anna" or "annaa" long before any other word here, and may run off with the ball instead of rolling it back; that is her game, not a mistake. Arjun may roll too fast at first. He is likely to answer her in English, and that is fine between the two of them.',
      practising:
        'For Arjun, the ball word and the lines "come" and "give it to", both of them with Mia’s own name in them rather than the word for little sister. For Mia, two words she can use for real: calling her brother anna, and asking for the ball.',
      ask: 'When the ball reaches Mia, ask Arjun in your language what his sister did. Any answer, in any language, gets "Choodu! Banti!" or "Paaru! Pandhu!" and a cheer.',
      next: 'Give Arjun the job of teaching Mia one word a day, in Nanna\'s or Amma\'s language, at the same time, for example at the front door: "raa" or "vaa". Big-brother jobs are likely to keep him using the word.',
      honest:
        'Mia saying "anna" shows she has a name for her brother, not that she is learning Telugu or Tamil. Neither checked word list has a word for rolling, throwing or catching, so the game runs on "give it" and "come"; say the rest in your own words, however you say them. Between themselves the two of them will probably speak English most of the time; the research does not say this needs correcting. Each parent\'s own time with Mia, in their language, matters more.',
      easier: 'For Mia: sit facing her with legs apart, roll the ball into the space between her legs, and say "Anna!" each time Arjun rolls it.',
      harder: 'Arjun counts each roll aloud in your language, okati, rendu, moodu or onnu, rendu, moonu, and they try to reach ten without the ball leaving the lawn.',
      safety: 'Use a big, soft ball and roll it, never throw it at Mia\'s face. Keep the game on the grass, away from the raised beds\' edges.',
    },
    sources: [
      { label: 'Wiktionary: చెల్లి (chelli, little sister)', url: 'https://en.wiktionary.org/wiki/చెల్లి' },
      { label: 'Wiktionary: ఇచ్చు (ivvu, give)', url: 'https://en.wiktionary.org/wiki/ఇచ్చు' },
      { label: 'Wiktionary: చూడు (choodu, look)', url: 'https://en.wiktionary.org/wiki/చూడు' },
      { label: 'Wiktionary: ఎరుపు (erupu, red; erra banti, a red ball)', url: 'https://en.wiktionary.org/wiki/ఎరుపు' },
      { label: 'Wiktionary: అన్న (anna, elder brother)', url: 'https://en.wiktionary.org/wiki/అన్న' },
      { label: 'Wiktionary: రా (raa, come)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: தங்கச்சி (thangachi, little sister)', url: 'https://en.wiktionary.org/wiki/%E0%AE%A4%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%9A%E0%AF%8D%E0%AE%9A%E0%AE%BF' },
      { label: 'Wiktionary: பந்து (pandhu, ball)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AA%E0%AE%A8%E0%AF%8D%E0%AE%A4%E0%AF%81' },
      { label: 'Tamil Wiktionary: குடு (kudu, give)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%95%E0%AF%81%E0%AE%9F%E0%AF%81' },
      { label: 'Tamil Wiktionary: பாரு (paaru, look)', url: 'https://ta.wiktionary.org/wiki/%E0%AE%AA%E0%AE%BE%E0%AE%B0%E0%AF%81' },
      { label: 'Wiktionary: அண்ணா (anna, elder brother)', url: 'https://en.wiktionary.org/wiki/%E0%AE%85%E0%AE%A3%E0%AF%8D%E0%AE%A3%E0%AE%BE' },
      { label: 'Wiktionary: வா (vaa, come)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%BE' },
    ],
  },
  {
    id: 'bumped-knee',
    title: 'Ouch, My Knee!',
    hook: 'He falls off the scooter, comes running, and the grown-up has a few words ready along with the hug.',
    // The `when` union has no comfort slot. Bumps and tears happen mostly in
    // the middle of playing, and this one happens on the scooter in the
    // backyard, so 'play' is the honest fit; 'bedtime' or 'mia' would file
    // it under a part of the day it does not belong to.
    when: 'play',
    picture:
      'On the sunny backyard patio beside a small scooter, Nanna kneels and gives Arjun a warm hug, one hand patting his back, while Arjun, already smiling again, holds out his leg to show a small dinosaur sticking plaster on his knee.',
    cast: ['Nanna', 'Arjun'],
    grownUp: [
      {
        id: 'bumped-knee-g1',
        te: {
          script: 'రా, నాన్న',
          roman: 'Raa, naanna',
          means: 'Come here, sweetheart',
          note: 'Composed from checked words; have a fluent speaker confirm. రా (raa) = come; నాన్న (naanna) = dear, said fondly to a little boy. Arms open. The research also records a comfort line: భయం లేదు, నేనున్నాను (bhayam ledu, nenunnaanu), "don\'t be scared, I\'m here".',
        },
        ta: {
          script: 'வா, கண்ணு',
          roman: 'Vaa, kannu',
          means: 'Come here, sweetheart',
          note: 'Composed from checked words; have a fluent speaker confirm. வா (vaa) = come; கண்ணு (kannu) = darling, literally "eye", written கண் (kan). Arms open.',
        },
      },
      {
        id: 'bumped-knee-g2',
        te: {
          script: 'మోకాలు?',
          roman: 'Mookaalu?',
          means: 'Your knee?',
          note: 'Composed from checked words; have a fluent speaker confirm. మోకాలు (mookaalu) = knee, said as a question while you touch it gently. A fuller question from the research: "Mookaaliki debba tagilindaa?", did you hurt your knee?',
        },
        ta: {
          script: 'முட்டி?',
          roman: 'Mutti?',
          means: 'Your knee?',
          note: 'Composed from checked words; have a fluent speaker confirm. முட்டி (mutti) = knee, the everyday spoken word, said as a question while you touch it gently. Written: முழங்கால் (muzhangaal).',
        },
      },
      {
        id: 'bumped-knee-g3',
        te: {
          script: 'కోపం?',
          roman: 'Kopam?',
          means: 'Are you cross?',
          note: 'Composed from checked words; have a fluent speaker confirm. కోపం (kopam) = anger, said as a gentle question when the tears are more about the scooter than the knee. Fuller: "Kopam vachchindaa?", did you get angry?',
        },
        ta: {
          script: 'கோபம்?',
          roman: 'Kobam?',
          means: 'Are you cross?',
          note: 'Composed from checked words; have a fluent speaker confirm. கோபம் (kobam, often said kovam) = anger, said as a gentle question when the tears are more about the scooter than the knee.',
        },
      },
    ],
    child: [
      {
        id: 'bumped-knee-c1',
        te: {
          script: 'మోకాలు!',
          roman: 'Mookaalu!',
          means: 'My knee!',
          note: 'Composed from checked words; have a fluent speaker confirm. One word and a pointing finger tell the grown-up where it hurts.',
        },
        ta: {
          script: 'முட்டி!',
          roman: 'Mutti!',
          means: 'My knee!',
          note: 'Composed from checked words; have a fluent speaker confirm. One word and a pointing finger tell the grown-up where it hurts.',
        },
      },
      {
        id: 'bumped-knee-c2',
        te: {
          script: 'కోపం!',
          roman: 'Kopam!',
          means: "I'm cross!",
          note: 'Composed from checked words; have a fluent speaker confirm. Naming the feeling, said with a stamp: the scooter tipped over and it is not fair.',
        },
        ta: {
          script: 'கோபம்!',
          roman: 'Kobam!',
          means: "I'm cross!",
          note: 'Composed from checked words; have a fluent speaker confirm. Often said kovam. Naming the feeling, said with a stamp: the scooter tipped over and it is not fair.',
        },
      },
    ],
    note: {
      what: 'A bump in the backyard. The grown-up calls him in for a hug, asks about the knee, and asks whether he is cross; he can point and say "knee", or name the feeling.',
      expect:
        'A crying child reaches for the nearest words, and they will often be English. Answer the hurt first, in your language, with your arms. Afterwards, when he is calm, he may say "mookaalu" or "mutti" while showing the scrape to someone else.',
      practising:
        'Words for where it hurts and how he feels, heard at the moment they mean the most to him. Knee and cross are a start; the same frame works for kaalu (foot), cheyyi or kai (hand), and bhayam or bayam (scared).',
      ask: 'Once the tears stop, ask him in your language to show you where it hurt, and name the place as he points.',
      next: 'At a calm moment later, let him tell the other parent what happened. Nanna or Amma answers in their own language: "Mookaalu?" or "Mutti?".',
      honest:
        'Comfort comes first; the language comes second. If he is really hurt or very upset, say whatever comes, in any language, and do not ask him to say a word before he gets a hug. Hearing "mutti?" at the moment of a scrape is strong, real input, but it is one word at one moment, not a lesson.',
      easier: 'Only "Raa, naanna" or "Vaa, kannu" and open arms. That is the whole thing.',
      harder: 'With a teddy and a toy bandage, Arjun plays the grown-up: the teddy falls, and he asks "Mookaalu?" or "Mutti?" and "Kopam?" or "Kobam?".',
      safety:
        'Check the injury properly before any talk. Clean a scrape, and get medical help for a head bump with drowsiness or vomiting, a deep cut, or a limb he will not use.',
    },
    sources: [
      { label: 'Wiktionary: రా (raa, come)', url: 'https://en.wiktionary.org/wiki/రా' },
      { label: 'Wiktionary: నాన్న (naanna)', url: 'https://en.wiktionary.org/wiki/నాన్న' },
      { label: 'Wiktionary: భయము (bhayam, fear)', url: 'https://en.wiktionary.org/wiki/భయము' },
      { label: 'Wiktionary: మోకాలు (mookaalu, knee)', url: 'https://en.wiktionary.org/wiki/మోకాలు' },
      { label: 'Wiktionary: కోపము (kopam, anger)', url: 'https://en.wiktionary.org/wiki/కోపము' },
      { label: 'Wiktionary: வா (vaa, come)', url: 'https://en.wiktionary.org/wiki/%E0%AE%B5%E0%AE%BE' },
      { label: 'Wiktionary: கண் (kan, eye; kannu, darling)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AE%A3%E0%AF%8D' },
      { label: 'Wiktionary: முட்டி (mutti, knee)', url: 'https://en.wiktionary.org/wiki/%E0%AE%AE%E0%AF%81%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%BF' },
      { label: 'Wiktionary: கோபம் (kobam, anger)', url: 'https://en.wiktionary.org/wiki/%E0%AE%95%E0%AF%8B%E0%AE%AA%E0%AE%AE%E0%AF%8D' },
    ],
  },
];
