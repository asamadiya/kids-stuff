import type { GrownUpNote } from '../notes/types';
import type { Source } from '../learn/sources';

/**
 * The grown-ups guide for Telugu & Tamil (advisor q8 ruling E: "ship with the
 * first release"), written to Amma and Nanna from
 * .redesign/v3/research/heritage-research.md and games-and-community.jsonl,
 * with ruling E's corrections: no validated universal exposure threshold,
 * never pretend not to understand, never make speaking the price of
 * attention, "Who said it?" is not a language test, and the parents need not
 * police their own English.
 */
export interface GuideSection {
  readonly title: string;
  readonly body: readonly string[];
}

export const GUIDE: {
  readonly note: GrownUpNote;
  readonly sections: readonly GuideSection[];
  readonly sources: readonly Source[];
} = {
  note: {
    what: 'A guide for Amma and Nanna on keeping Telugu and Tamil going beside English: what the research does and does not say, who speaks what, what to do when Arjun answers in English, how Mia fits in, grandparents, books and screens, Bay Area classes, and your recordings.',
    expect: 'About a fifteen-minute read. The first section is the evidence, with its limits; the rest is practical. Nothing here is a rule you can fail, and you do not need to do all of it.',
    practising: 'Nothing for the children: this page is for you. The aim is more warm, ordinary conversation in Telugu and Tamil with Arjun and Mia, not a programme.',
    ask: 'Ask each other: over an ordinary week, when does each child get real back-and-forth talk in Telugu with Nanna, and in Tamil with Amma?',
    next: 'Pick one routine each this week, such as Nanna’s bath time or Amma’s bedtime song, and keep it in your own language.',
    easier: 'Read only “When he answers in English” today; it is a change that costs no extra time.',
    honest:
      'No study gives this family a formula: almost none looked at two heritage languages with English between the parents. Arjun’s and Mia’s Telugu and Tamil will grow unevenly, and how each turns out is not a verdict on you.',
  },
  sections: [
    {
      title: 'What the research actually says',
      body: [
        'Annick De Houwer’s survey of 1,899 families in Belgium (2007) found that every child spoke the majority language, but not every child spoke the home language, and that “one parent, one language” on its own was neither necessary nor sufficient. Children most often spoke the home language when both parents used it with them and at most one of them also spoke the majority language. Your home has a different shape: each language has one parent, so Nanna’s Telugu and Amma’s Tamil to the children are each that language’s main daily source. De Houwer’s families had one home language each, so her survey cannot predict a home with two. Taken one language at a time, though, the nearest pattern she found (one parent speaks the home language, and both parents also speak the majority language with the child) was the least likely to produce a child who spoke it. That is why the talk aimed at the children matters more than any label for how the family does it.',
        'How much a child hears a language goes with how much of it they learn (Barbara Pearson’s work, including a study of infants in Miami), and a child’s own talking builds his talking (Erika Hoff’s group). Exposure adds up over the years (Sharon Unsworth’s work on cumulative exposure); in a 2025 study by Pérez-Navarro and Lallier, which followed 71 Basque–Spanish children from four to six, the words children understood in the weaker language caught up by six once enough exposure had built up, while the words they could say still lagged behind. In Hoff’s US studies, time in the home language did not hold children’s English back; school supplied the English.',
        'A 2025 Montreal study by Sander-Montant, Bissonnette and Byers-Heinlein found that what each parent actually spoke predicted a child’s exposure far better than the family’s named strategy. Mothers’ language counted about twice as much as fathers’, which the authors put down to caregiving time, not to being the mother. For you: whichever of you spends more waking hours with the children will tend to pull that language ahead.',
        'Now the limits. Almost none of this research looked at a home like yours, with two heritage languages and English between the parents; most of it studied one home language beside one majority language, often Spanish beside English. You will see “20 per cent” or “a quarter of waking hours” quoted as a threshold, but there is no validated universal figure, and no count of minutes guarantees two heritage languages beside English. The plain finding is the useful one: more warm, two-way talk in a language, from more people, over more years, helps.',
      ],
    },
    {
      title: 'Who speaks what',
      body: [
        'The default that suits your home is simple: Nanna speaks Telugu to the children and Amma speaks Tamil. It is a default, not a law. Nothing breaks when Nanna reads an English library book at bedtime or Amma answers a question about school in English, and nobody needs to stop mid-sentence to keep a language pure.',
        'What helps most is your own language in the routines that already happen every day, because they add up without taking extra time. For example, Nanna might take bath time, the drive to school and watering the raised beds in Telugu; Amma breakfast, getting dressed and the bedtime song in Tamil. Choose the ones each of you actually does.',
        'Your English with each other is yours. You do not need to police it or engineer a ratio for your marriage; the children will hear plenty of English whatever you do. What matters more is the talk aimed at them, so when you notice you are speaking English to Arjun or Mia out of habit rather than need, that is the easy place to move a few sentences into Telugu or Tamil.',
        'Your ordinary everyday Telugu and Tamil, mixed words and all, is good input for them; it does not have to sound like a textbook. When Nanna speaks Telugu to Amma, the children see it is a real grown-up language and not only a children’s one. And if Amma tries a Telugu word back now and then, or Nanna a Tamil one, they see that trying each other’s language is fun.',
      ],
    },
    {
      title: 'When he answers in English',
      body: [
        'Arjun will often answer your Telugu or Tamil in English. That is expected at five: English is the language of school and friends, and he is reaching for his strongest words. It is not rudeness and it is not refusal. What makes a difference is your next turn.',
        'Elizabeth Lanza described the moves parents make at that moment. In a small study of six Spanish–English toddlers (Brooksbank, 2017), children came back in the home language far more often when the parent offered the words or repeated the meaning in that language than when the parent simply carried on in the home language without echoing what the child had said, and least of all when the parent switched to English. Six children is a very small sample, so read the order, not the exact numbers.',
        'So: respond to what he meant, say it back in your language, and keep going. He says “I want milk.” Nanna answers “పాలు కావాలా? (paalu kaavaalaa? You want milk?)” and pours it; Amma answers “பால் வேணுமா? (paal venumaa? You want milk?)” and does the same. Now and then offer him a short phrase to borrow, or a choice between two things in your language, and let him take it or leave it.',
        'Do not pretend not to understand him: he has heard both of you speak English all his life, and children who see through it can feel tricked. Do not hold back the milk, the help or your attention until he says it in Telugu or Tamil, and do not make him repeat after you. An English reply or a mixed sentence is not misbehaviour. If he is tired or cross, let it go and simply keep speaking your own language yourself.',
      ],
    },
    {
      title: 'Making time without making a chore',
      body: [
        'A practical starting point: one enjoyable stretch of ten to fifteen minutes a day for each of you, playing or reading in your own language, plus your language in a few routines you already do. That is somewhere to begin, not a dose that guarantees anything and not a ceiling. Some days it will be more and some days nothing; the weeks add up.',
        'Make it the fun part of the day, not a lesson. Build the Lego tower with Nanna in Telugu, garden by the lemon tree with Amma in Tamil, cook dosa together, look at a picture book and talk about what is happening. The moments in this part give you things to say; use them during the day rather than sitting him down to go through them.',
        'Songs are an easy way in. A bath song from Nanna and a bedtime song from Amma, the same ones night after night, give both children words, rhythm and something to join in with before either would say a whole sentence in that language.',
        'Leave out the quizzing (“What’s this in Tamil?”), the bribes and the guilt. Pushing and drilling tend to bring resistance, and praise from grandparents and relatives often counts for more than a parent’s urging. Keep your side steady: keep speaking your language warmly, and count the good evenings rather than the missed ones.',
      ],
    },
    {
      title: 'Mia, at two',
      body: [
        'Mia is learning in a different way from her brother. At two, she learns from songs with actions, from gestures, from being handed the thing you are naming, and from the same short routine done the same way every day: shoes on, bath, the goodnight song.',
        'Let her point before she talks, and let her act before she answers. If Nanna says “Get the ball” in Telugu and she toddles off to get it, she understood. Understanding comes first and can run well ahead of speaking for a long time; that is normal.',
        'She will hear more and more English from Arjun as school fills his days. That is normal and not worth fighting: brothers and sisters usually play in the school language. But in studies of other heritage languages, an older sibling’s English at home went with weaker home-language speaking in the younger child, so she needs her own time with each of you in your language. From about two and a half, children can also pick up words from talk not aimed at them, so your talk with Arjun counts for her too, though it is no substitute for talk with her.',
        'She can join in without matching him. When Arjun answers a question, Mia can point, clap the rhythm, or say one word; nobody needs to compare. Arjun can also be the big brother who shows Mia how the song goes, which gives him a reason to use the language: helping his sister, not passing a test.',
      ],
    },
    {
      title: 'Nanamma, Tatayya, Paati and Thatha',
      body: [
        'The grandparents are a second voice for each language, and different people saying it matters: in toddler studies, hearing a language from more speakers went with knowing more of it. When Nanamma and Tatayya or Paati and Thatha stay for a few weeks, the house fills with Telugu or Tamil in a way no plan could manage.',
        'Between visits, a live video call is real conversation: the grandparent can see Mia and answer what she does. In one study, two-year-olds learned new verbs over video chat but not from a recording of the same thing; in another, toddlers did not learn a word from a responsive screen alone, and the authors suggest a grown-up sitting beside them may be what makes the difference. So sit with Mia on calls, and keep them short and frequent rather than long and rare.',
        'Build the call around something to do together, not a performance. Arjun can show Tatayya the tomatoes in the raised bed; Paati can sing a song she sang to Amma; Mia can fetch her toy cow while Nanna says “ఆవు (aavu)!” or Amma says “மாடு (maadu)!”. Asking “Say something for Paati” over and over turns the call into a test.',
        'Grandparents, like anyone, can drift into English to be understood, especially when a child keeps answering in English. It is worth asking them plainly to keep speaking Telugu or Tamil to the children, whatever language comes back.',
      ],
    },
    {
      title: 'Books, songs and screens',
      body: [
        'Picture books in Telugu and Tamil help most when shared: you on the sofa with one child on each side, talking about the pictures, pausing to let them point. You do not have to read the printed words exactly; telling the story in your everyday speech is fine. The Santa Clara County and Alameda County libraries both keep Telugu and Tamil children’s books.',
        'Screens are not all alike. A live video call with someone who answers you is conversation. A recorded video is not: in one study, nine-month-old American babies who had twelve sessions with live Mandarin speakers kept telling apart Mandarin sounds, while the same speakers on a recording made no difference. Telugu or Tamil cartoons and rhyme videos teach Mia little on their own; watched with you, with you talking about them in your language, they become something to share, and for Arjun a source of songs and words he then uses with you.',
        'This part of the app is a set of prompts: things to say in daily moments, rhymes, two picture books, picture words drawn from those, and your own recorded voices. It can start a conversation, give a routine the same words each day, and help a child find a word again. It cannot teach Telugu or Tamil by itself, and Arjun does not need to read the script to use it.',
      ],
    },
    {
      title: 'Other speakers, and the Bay Area',
      body: [
        'A language lives longer when it belongs to more than two parents. Children who use a heritage language with friends tend to keep it better, and time with friends in that language is one of the things that tends to fall away as children grow. Other Telugu and Tamil families, aunties and uncles, cousins, a babysitter who speaks one of the languages: each one makes Telugu or Tamil a language for children, not only a parents’ project.',
        'On Nanna’s side: SiliconAndhra ManaBadi, based in Milpitas, runs a weekend Telugu school whose youngest class, BalaBadi I, is for ages four to six and is described as teaching through games, nursery rhymes and picture identification. TANA Paatasala runs Telugu classes at regional centres and is advertised by the Bay Area Telugu Association (BATA), whose Sankranti and Deepavali celebrations are family events. SiliconAndhra also holds an Ugadi celebration.',
        'On Amma’s side: the International Tamil Academy, formerly the California Tamil Academy, has Bay Area schools in Cupertino, Evergreen (San Jose), Fremont and Milpitas, with a track for ages five to ten and first-time learners. The Bay Area Tamil Manram holds Pongal and Chithirai (Tamil New Year) celebrations and children’s events.',
        'These details were collected in October 2026; check each organisation’s current classes, ages and places before you sign up. Judge a class by visiting: how much the children talk and play in the language, whether the teacher’s Telugu or Tamil sounds like the language your family speaks, whether it suits his age, and whether he comes out happy. Choose it for that, not for how many letters it promises; an alphabet drill on a Saturday morning can make a five-year-old dislike a language he enjoys at home.',
      ],
    },
    {
      title: 'What to expect',
      body: [
        'Understanding comes before speaking, often by a long way. Arjun may follow everything Nanna says in Telugu and answer in English for months; Mia may fetch, point and laugh at the right moments long before she says much. That understanding is real progress, and it is the base speaking grows from.',
        'Expect uneven strengths. At five, being strongest in English is normal for a child starting school in the US, even in homes full of the heritage language. Telugu and Tamil are unlikely to grow at the same pace either: the one he hears more, from whichever of you spends more time with him and from whichever grandparents visit more, will usually lead. Counted one language at a time, each may look smaller than a one-language child’s. In bilingual children the total across both languages is usually comparable to a one-language child’s, so with three, count across all three.',
        'Mixing is normal. A sentence that starts in Tamil and finishes in English, or a Telugu sentence with “dinosaur” in the middle, shows him using every word he has, not confusion (Byers-Heinlein and Lew-Williams, 2013, explain why). Around five he may also ask “Why do I have to speak Telugu? My friends speak English.” Answer with people and reasons (Nanamma and Tatayya, Paati and Thatha, cousins, your own childhood), not with rules.',
        'Growing up with three languages is possible. Equal fluency in all three, and reading and writing in Telugu and Tamil scripts, are not guaranteed, and they depend on years of ordinary use, not on getting the next month right. If an English-only phase comes, what he understood is a base to build on later; some young adults go on to ask their parents to speak the language with them again.',
      ],
    },
    {
      title: 'Recording your voices',
      body: [
        'The speaker buttons in this part play your recordings: Nanna’s Telugu and Amma’s Tamil, or a grandparent’s during a visit. They never play a computer voice. A child who taps a button hears someone they love saying the line, which is the whole point. With no recording, the speaker shows “Say it together” instead, as a reminder for you to say the line yourself.',
        'To record, open For Amma and Nanna, then Record voices, and hold the button for two seconds (so a child is unlikely to open it by accident). Choose Telugu or Tamil, type who is recording, then for each line press Record, speak, press Stop, listen back, and press Save. The first time you press Record, the browser asks to use the microphone. Saving over a line you recorded before asks first, and the old recording stays until the new one is saved. Start with the lines you actually say each day.',
        'Recognising Amma’s voice from Nanna’s is not understanding Tamil or Telugu, so the recordings are not there to test that. They let the children replay the words of a song or a routine, and they let the listening game ask for a word in your voice.',
        'Recordings stay on this device: nothing is uploaded or sent anywhere. Clearing this browser’s site data loses them, and they are not on any other device, so press “Save all to a file” now and then and keep that file somewhere safe and private, as you would family videos; “Load from a file” brings them back, and “Delete all” removes every recording from this device.',
      ],
    },
  ],
  sources: [
    {
      label: 'De Houwer (2007), Parental language input patterns and children’s bilingual use, Applied Psycholinguistics',
      url: 'https://www.cambridge.org/core/product/identifier/S0142716407070221/type/journal_article',
    },
    {
      label: 'Pearson, Fernández, Lewedeg & Oller (1997), The relation of input factors to lexical learning by bilingual infants, Applied Psycholinguistics',
      url: 'https://www.cambridge.org/core/product/identifier/S0142716400009863/type/journal_article',
    },
    {
      label: 'Sander-Montant, Bissonnette & Byers-Heinlein (2025), Like mother like child: differential impact of mothers’ and fathers’ individual language use on bilingual language exposure, Child Development',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11868683/',
    },
    {
      label: 'Pérez-Navarro & Lallier (2025), The contribution of the amount of linguistic exposure to bilingual language development: longitudinal evidence from preschool years, Child Development',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11693830/',
    },
    {
      label: 'Hoff (2018), Bilingual development in children of immigrant families, Child Development Perspectives',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5966288/',
    },
    {
      label: 'Ribot, Hoff & Burridge (2018), Language use contributes to expressive language growth: evidence from bilingual children, Child Development',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5573667/',
    },
    {
      label: 'Brooksbank (2017), Family language policy: parental discourse strategies and child responses (Lanza’s strategies), University of Ottawa',
      url: 'http://ruor.uottawa.ca/handle/10393/36128',
    },
    {
      label: 'De Houwer & Nakamura (2021), Developmental perspectives on parents’ use of discourse strategies with bilingual children',
      url: 'https://api.taylorfrancis.com/content/chapters/oa-edit/download?identifierName=doi&identifierValue=10.4324/9781003125815-4&type=chapterpdf',
    },
    {
      label: 'Welsh & Hoff (2021), Language exposure outside the home becomes more English-dominant from 30 to 60 months for children from Spanish-speaking homes in the United States, International Journal of Bilingualism',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10352523/',
    },
    {
      label: 'Troseth, Strouse, Verdine & Saylor (2018), Let’s chat: on-screen social responsiveness is not sufficient to support toddlers’ word learning from video, Frontiers in Psychology',
      url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2018.02195/pdf',
    },
    {
      label: 'Paradis (2023), Sources of individual differences in the dual language development of heritage bilinguals, Journal of Child Language',
      url: 'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/D86724666D8A5B3CB404566BF4706E4F/S0305000922000708a.pdf/div-class-title-sources-of-individual-differences-in-the-dual-language-development-of-heritage-bilinguals-div.pdf',
    },
    {
      label: 'SiliconAndhra ManaBadi: weekend Telugu school, Milpitas',
      url: 'https://manabadi.siliconandhra.org/',
    },
    {
      label: 'Bay Area Telugu Association (BATA)',
      url: 'https://www.bata.org/',
    },
    {
      label: 'International Tamil Academy (formerly California Tamil Academy)',
      url: 'https://www.catamilacademy.org/',
    },
    {
      label: 'Bay Area Tamil Manram',
      url: 'https://www.bayareatamilmanram.org/about',
    },
  ],
};
