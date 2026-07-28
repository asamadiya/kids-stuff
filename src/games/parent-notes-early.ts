/**
 * Parent notes for the eleven letters / shapes / patterns exercises — the ones
 * PlayHub files under `cat: 'early'`.
 *
 * One record per exercise, keyed by the `id` on that exercise's META. Four
 * fields: what is on the screen, the skill it actually trains, one question a
 * grown-up can ask out loud, and the limitation.
 *
 * `honest` is the load-bearing field and is never flattering. This shelf is the
 * one most likely to waste a well-ahead five-year-old's time, and nine of the
 * eleven notes below say so outright, with what to do instead. Two do not:
 * Shapes and Patterns are worth the sitting, and those notes say why in terms
 * of the specific thing being learned rather than in praise.
 *
 * Every claim here was read off the exercise source, not inferred from its
 * title. Two notes are coupled to implementation detail and must be revisited
 * if that detail changes: `memory-pairs` describes the fixed weave in
 * `buildDeck`, and `rhyme-time` counts the rounds whose rhyme shares its
 * spelling.
 *
 * Data only. No React, no DOM.
 */

export interface ParentNote {
  readonly what: string;
  readonly practising: string;
  readonly ask: string;
  readonly honest: string;
}

export const NOTES: Record<string, ParentNote> = {
  /* ------------------------------------------------------- counting & amount */

  'count-with-rikki': {
    what:
      'One to ten copies of a single picture laid out in one row — three cats, nine bees — and four '
      + 'number buttons underneath. He picks the count.',
    practising:
      'One-to-one correspondence: tagging each object exactly once with exactly one number word, and '
      + 'then treating the last word said as the size of the whole set rather than as the name of the '
      + 'last object. At the small end, subitising — seeing three without counting.',
    ask: 'Now how many if I take one away? Say it without counting them again.',
    honest:
      'Beneath him. Twelve rounds, counts of one to ten, and a child who counts to ten clears every '
      + 'one on sight. The objects sit in a single undifferentiated row, so there is no grouping to '
      + 'exploit and nothing to carry above ten. The only thing worth watching for is whether he tags '
      + 'each object once or double-counts under speed; if he does not, this has nothing left to give '
      + 'him and the place-value drills on the Number shelf are where he should be.',
  },

  'which-has-more': {
    what:
      'Two rows of the same picture, one above the other, and two buttons: Left and Right. Each button '
      + 'is printed with that side’s own count.',
    practising:
      'Comparing two set sizes — in principle by matching the rows one against one, or by counting both '
      + 'and comparing the totals.',
    ask: 'How many more does that side have? The screen never asks, and the answer is on no button.',
    honest:
      'Beneath him twice over. The counts run one to eight and differ by one to three, and, decisively, '
      + 'each button prints its own count — so the comparison has already been done for him and he is '
      + 'reading two numerals, not comparing two piles. Two buttons also means a pure guess is right half '
      + 'the time, which makes the score meaningless. The tagline promises "and by how many"; no part of '
      + 'the exercise asks for the difference or names it, not even in the feedback after he answers.',
  },

  'number-order': {
    what:
      'Three numbers in a row — 4, 5, 6 — then a gap, and three number buttons. He picks the one that '
      + 'continues the row.',
    practising:
      'Continuing a linear sequence by its common difference. Three rules only, over the range zero to '
      + 'ten: up by one, up by two, down by one.',
    ask: 'Say the rule out loud instead of the number. What is this row doing each time?',
    honest:
      'Mostly beneath him. Eight of the twelve rounds are up-by-one or down-by-one, which is counting '
      + 'with extra steps. The three choices are always the answer and its immediate neighbours, so at '
      + 'best this is a one-step check and never a search. There is no down-by-two, no step larger than '
      + 'two, no gap in the middle of a row rather than at its end, and no growing pattern. The version '
      + 'of this that would stretch him asks him to state the rule; nothing here does.',
  },

  /* ------------------------------------------------------ pattern & figure */

  'pattern-parade': {
    what:
      'A row of pictures that repeats — sun, moon, sun, moon — ending in a question mark, and three '
      + 'pictures to choose from. All three choices are items that appear inside the pattern.',
    practising:
      'Finding the repeating unit and its length, then continuing it. Five unit shapes: A-B, A-B-C, '
      + 'A-A-B, A-B-B and A-A-B-B. The four-long and the uneven units are the ones that carry the work — '
      + 'he has to decide where the unit ends before he can say what follows, which is the first honest '
      + 'form of period.',
    ask: 'Where does the part that repeats stop? Put your finger on the last one of it.',
    honest:
      'Worth the sitting, but shallow and short. Thirteen rounds is a single session; past that he is '
      + 'recalling rounds rather than reading patterns. Every pattern here repeats — none grows, none '
      + 'changes its step, and no round has a genuinely ambiguous unit boundary, which is where pattern '
      + 'work starts to be hard. The feedback also names the unit for him after every answer, right or '
      + 'wrong, so the naming is never his to do.',
  },

  'shape-hunt': {
    what:
      'One outlined figure drawn in the middle of the screen and three names. The prompt asks for the '
      + 'most exact name, and a line beneath it says outright that more than one name can be true.',
    practising:
      'Naming a plane figure from its properties, and the nesting of those names: a square is also a '
      + 'rectangle, also a quadrilateral. The feedback prints the wider true names after every answer, so '
      + 'the hierarchy is stated rather than implied. Trapezoid is used in the exclusive sense — exactly '
      + 'one pair of parallel sides — so trapezoid, rectangle and rhombus stay disjoint.',
    ask: 'You said square. Is it also a rectangle? Tell me why it is.',
    honest:
      'The strongest of the eleven, and the only one whose answer is computed from the drawing rather '
      + 'than typed beside it, so a child cannot be marked wrong for choosing a name that is also true. '
      + 'Its limit is the pictures: sixteen rounds share ten drawings, and each name is always drawn at '
      + 'the same size in the same orientation. The square is drawn flat and the rhombus stood on its '
      + 'point, so he can separate those two by which way up they are without ever checking a side or a '
      + 'corner. Turn the tablet forty-five degrees and ask him again.',
  },

  /* --------------------------------------------------------- letters & words */

  'letter-land': {
    what:
      'A word printed with its first letter missing — a coloured underscore, then "pple" — a button that '
      + 'reads the whole word aloud, and three letters to choose from. He picks the missing one.',
    practising:
      'Isolating the first sound of a spoken word and mapping it to the letter that writes it. The wrong '
      + 'answers are built for that job: one letter that really is in the word but not at the front, '
      + 'which is much the commonest mistake, then letters easy to confuse with the right one by shape or '
      + 'by sound.',
    ask: 'Say the word without its first sound. What is left over?',
    honest:
      'For a child who reads at all, this stops being a listening task. The rest of the word is printed, '
      + 'so he reads the tail, recognises the word and recalls its spelling; the first sound never has to '
      + 'be pulled off on its own. That is an easier and different skill from the one the exercise names. '
      + 'Two letters are missing entirely — no round starts with Q or X — and twenty-four rounds is one '
      + 'sitting. If phonics is the point, cover the printed tail with your hand and let him use only the '
      + 'read-aloud button.',
  },

  'rhyme-time': {
    what:
      'A picture and a word in capitals — CAT — and three written words below it. He picks the one that '
      + 'rhymes. Nothing is spoken aloud.',
    practising:
      'Rime matching: hearing that two words share everything from the vowel onward. Nominally an ear '
      + 'task, which is why the on-screen hint tells him to say each word out loud.',
    ask: 'Give me one more word that rhymes with cat. A made-up word is allowed.',
    honest:
      'In eleven of the twelve rounds the rhyming word ends in the same letters as the prompt — cat and '
      + 'hat, moon and spoon, snake and cake. Only bear and chair do not. The choices are printed and '
      + 'nothing on the screen reads them out, so a child who reads a little can take every round but one '
      + 'by matching the last two or three letters with his ears switched off. Cover the buttons, say the '
      + 'three words yourself, and see whether the answer survives. Rhyme production — asking him for a '
      + 'word rather than offering him three — is the harder skill and is not here at all.',
  },

  'opposites': {
    what:
      'A picture and a word in capitals — HOT — and three words to choose from. He picks the opposite.',
    practising:
      'Antonym retrieval within one dimension: recognising that hot and cold are the two ends of a single '
      + 'scale rather than two unrelated words.',
    ask: 'Name something halfway between hot and cold. Now try that with open and shut.',
    honest:
      'Beneath him. Big and small, hot and cold, up and down are vocabulary a bright five-year-old had at '
      + 'three. Worse, in most rounds neither wrong word sits on the prompt word’s scale at all — HOT is '
      + 'offered against wet and soft — so the round can be taken by asking which of the three is even '
      + 'the same kind of word, without knowing any opposite. The one idea on this shelf that would be '
      + 'new to him, that some pairs have a middle and some cannot, is never raised: the exercise treats '
      + 'hot/cold and open/shut as the same kind of pair, and they are not.',
  },

  'color-match': {
    what:
      'One flat circle of colour, about the size of a plum, and four colour names written as words. He '
      + 'picks the name.',
    practising:
      'Attaching the ten basic English colour names to samples. Nothing beyond that: no mixing, no '
      + 'lightness or saturation, no naming a colour against a background that changes it.',
    ask: 'If you were not allowed to say green, what would you call this one?',
    honest:
      'The most clearly beneath him of the eleven. He has had these ten words for years and fourteen '
      + 'rounds of naming a flat circle will not add an eleventh. Several swatches sit near a boundary — '
      + 'the frog green is a mint, the blueberry is closer to indigo — but only the ten basic names are '
      + 'ever offered, so a more precise answer is on no button and the near-boundary swatch just makes '
      + 'him hesitate for nothing. If colour is the interest, mixing two paints and predicting the result '
      + 'before you stir is the exercise; this is a vocabulary quiz he passed years ago.',
  },

  /* ------------------------------------------------------ sorting & memory */

  'odd-one-out': {
    what:
      'A question — "Which one is not a fruit?" — and four pictures as buttons. He taps the one that does '
      + 'not belong. There is no other picture on the stage; the four buttons are the whole board.',
    practising:
      'Category membership: holding a class in mind and testing four items against it one at a time.',
    ask: 'Now split these four a different way. Which two go together, and what is your rule?',
    honest:
      'Beneath him by a wide margin. The outsider is never a near miss — it is a dog among fruit, a car '
      + 'among animals, a truck among sea creatures — and sorting only becomes work when the outsider is '
      + 'close: a whale among fish, a tomato among vegetables, a bat among birds. No such round exists '
      + 'here. The category is also named in the question, so he is not finding the rule either, only '
      + 'applying one he has been handed. Twelve rounds, one category each. Use it as a warm-up or skip '
      + 'it.',
  },

  'memory-pairs': {
    what:
      'Eight cards face down in a grid, four matching pairs among them. He turns two at a time; a matched '
      + 'pair stays face up, a mismatch stays showing until he taps again.',
    practising:
      'Visuospatial working memory: holding a picture together with where it sat, and updating that store '
      + 'as more of the board is turned over.',
    ask: 'Before you turn it — point to where you think the other one is. Were you right?',
    honest:
      'Four pairs is under what a five-year-old can already hold; decks at this age usually run twelve to '
      + 'twenty cards, and eight is small enough to finish on luck. The deck is also not shuffled: it is '
      + 'woven by a fixed rule, so the pairs land in the same four positions in every round — the first '
      + 'card always matches the fourth, the second the third, and the same again across the second half. '
      + 'Twelve picture sets cycle and then repeat. Watch for the moment he stops remembering pictures '
      + 'and starts remembering the layout; when that happens the exercise is over, and replaying it will '
      + 'not make it harder.',
  },
};
