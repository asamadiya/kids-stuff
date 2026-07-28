/**
 * Parent notes for the twelve social exercises in src/sel/.
 *
 * One record per exercise, keyed by the `id` on that exercise's META. Four
 * fields: what is on the screen, the skill it actually trains, one question to
 * ask out loud, and the limitation.
 *
 * `honest` is the load-bearing field and is never flattering. None of these
 * twelve scores anything — several have no field in their data that could hold
 * a right answer — so every note says so outright, because a parent who goes
 * looking for a score will conclude the exercise is broken.
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
  /* ------------------------------------------- seeing, sampling, attributing */

  'borrowed-eyes': {
    what:
      'One painting of one second, and a dial that turns between two positions in that room. Each is read out: '
      + 'what it sees, what is hidden behind something, what is outside where its face points. He puts one intent '
      + 'chip on each.',
    practising:
      'Perspective-taking, in two halves. The geometric half is computed off a measured plan — eyes 66 centimetres '
      + 'up do not see what eyes 112 up see, and the sofa blocks only one of them. The chip is the other half, and '
      + 'a guess.',
    ask: 'Turn the dial to the other person. What is standing in their way that is not in yours?',
    honest:
      'No score: the chips have no key, the two readings are never reconciled, and three of the five moments stay '
      + 'unresolved by design. The geometry is real and is the strong half; the chip rack is coarse. He will notice '
      + 'that "did not see" is often the one the geometry already proved, which makes it the cheap pick.',
  },

  'the-wide-view': {
    what:
      'One wide painting of a real room, thirteen people in it. He looks for as long as he likes. Then crops cut '
      + 'out of that same plate are dealt and he says who stayed with him. Both accounts print: kept, and not kept.',
    practising:
      'Sampling attention. The room holds more than anyone can carry, so his account is a subset he chose without '
      + 'noticing he chose. The closing line names the shape of that subset: edges or middle, near or far, alone or '
      + 'crowded, grown-ups or children.',
    ask: 'Read me two of the people you did not keep. Was anything going on over there?',
    honest:
      'No score, and the counter was cut on purpose — "five of thirteen" turns looking into a collection to '
      + 'complete. The shape line stays silent unless the gap clears two and a half standard errors, so it usually '
      + 'reports no pattern: correct, and still a dead end. The census sentences repeat their own grammar and go '
      + 'dull by the fourth card.',
  },

  'meant-and-landed': {
    what:
      'One painted moment: Ben laughing while he holds up his painting. He sets a chip for what Ben meant and a '
      + 'face for how it landed, and the two assemble into three clauses. A button turns it round so he is the one '
      + 'laughing.',
    practising:
      'Holding intent and impact as two separate facts and refusing to rank them — the third clause is always '
      + '"Both of those are true." The turn-around is the work: running the same pair with himself as the actor.',
    ask: 'When you turned it round and it was you who laughed, did you still pick the same thought chip?',
    honest:
      'No score, and nothing is refused: every one of the one hundred and sixty-eight pairings assembles, '
      + 'incoherent ones included, because the two rails are unrelated in the data by design. The third clause '
      + 'never varies, so after two moments he sees the template and fills slots. Better read aloud against '
      + 'something that actually happened this week.',
  },

  'before-you-decide': {
    what:
      'His tower is down and a boy stands beside it holding one of his blocks. Three wordless questions on a rack '
      + '— did anyone see, when did it happen, what did the hands do. Spending one uncovers a fact. He may decide '
      + 'at any point.',
    practising:
      'Withholding attribution until evidence is in, and noticing which facts reverse a reading rather than '
      + 'support it. Here the clock is the one that reverses it: the tower came down before the boy walked in.',
    ask: 'You decided after one question. Turn the other two over — would either have changed it?',
    honest:
      'No score: the decision is never judged or corrected, and the only number kept is how many questions were '
      + 'spent. Two of the five cases do not settle even with all three facts, and a child expecting an answer '
      + 'reads those as broken. Asking all three costs nothing, so he learns "ask everything" in one sitting. '
      + 'What matters is the case that stays unknown.',
  },

  /* -------------------------------------- acting: consequence, line, bargain */

  'what-happens-next': {
    what:
      "The last truck on the shelf, and another boy's hand already on it. Two things his hands could do. He picks "
      + 'one and the strip draws what followed — and then the same room later that day. The other road stays open.',
    practising:
      'Consequence horizon: following an action past its immediate result to a later state that often contradicts '
      + 'it. Hand the truck over and his hands are empty; that afternoon the boy brings it back unasked. Keep it, '
      + 'and by tidy-up the boy is building with Ana.',
    ask: 'Walk me through the road you took. What was different by later that day?',
    honest:
      'No score, and no correct road: the data has no field that could hold one, so both draw in full. Five strips '
      + 'is ten roads and then it is finished; taking the second at once is the intended use. The real limit: each '
      + 'later panel is one authored outcome standing in for a distribution. The world does not reliably hand the '
      + 'truck back.',
  },

  'hold-the-line': {
    what:
      'Sam has taken the controller mid-turn. He builds a sentence from three wordless chips — name the thing, ask '
      + 'for the change, say what comes next — says it out loud, and the drawn panel shows what Sam did.',
    practising:
      'Boundary-setting as a constructed sentence rather than a mood: a flat statement of fact, a specific '
      + 'request, a stated consequence. And that walking off is a third road with its own outcome, never measured '
      + 'against the pushing one.',
    ask: 'Say your line out loud again, the way you said it to Sam. What did he do after it?',
    honest:
      'No score, but there is hidden arithmetic: each chip carries a force value, each scenario a threshold, and '
      + 'whether the other person stops is that comparison — so a systematic child finds the heavy chips. Denial '
      + 'in the teasing scenario is weighted at zero on purpose. This one pays off through repetition, not '
      + 'coverage: read silently it gives almost nothing.',
  },

  'one-swing-two-kids': {
    what:
      'Ten minutes and one swing. He slides a divider to say how it splits, offers it, and the other person '
      + 'answers with a face and sometimes a counter-offer. Three offers, then the clock takes it away from both '
      + 'of them.',
    practising:
      'Bargaining against an undisclosed rule. Sam splits the difference. Tomas does not move. Ravi takes whatever '
      + 'he is handed. Nadia goes quiet below three minutes. Mia is two and cannot make an offer back.',
    ask: 'You offered the same split to two different people. Did they both do the same thing with it?',
    honest:
      'No score: every split executes, taking all ten minutes included, and what comes back is only how long each '
      + 'held it and whether the other asked about tomorrow. The five rules are fixed, so he will map them in two '
      + 'or three passes and then play the rule instead of the person. The tablet board resists that: Mia cannot '
      + 'answer, so whatever he slides simply happens.',
  },

  /* --------------------------------------- fairness, rules, repair, the body */

  'five-cookies': {
    what:
      'Five cookies, three people, each with a reason: one went without, one did the work, one is the smallest. '
      + 'He lays them out, serves it, and every face reacts to the rule he used. Then the same table a second way.',
    practising:
      'Dividing under claims that do not convert into one another. Need, desert, size, promise and ownership have '
      + 'no common currency: the split cannot be computed, only chosen. On the dinosaur board one of the claimants '
      + 'is him.',
    ask: 'You served that board two ways. Which one would you defend to Nina, with her sitting there?',
    honest:
      'No score, and no correct split: the boards are built so the claims cannot all be met at once, proved '
      + 'exhaustively in the test. Every run ends with somebody short, so he never feels finished. The arithmetic '
      + 'is trivial for him: five among three is not the difficulty. Naming the principle he used is, and that '
      + 'stays invisible unless a grown-up makes him say it.',
  },

  'not-the-same-rule': {
    what:
      'Six rule cards out of his own life — Mia eats with her hands, he gets the tablet longer than Mia — sorted '
      + 'into two columns of his own: same for everyone, different for a reason. Each reverse carries the '
      + "grown-up's reason. Then he writes a rule of his own.",
    practising:
      'Separating equal treatment from fair treatment, and catching the case where the asymmetry runs in his own '
      + 'favour. The tablet card is that case, and its reverse concedes it before explaining.',
    ask: 'Which card did you put in a different column from the grown-up? Read me the back of that one.',
    honest:
      'No score: the card stays where he put it, and the reverse is one adult\'s placement beside his. Six cards '
      + 'is thin, the sort takes him a minute, and four concern a two-year-old, so the deck reads as a defence of '
      + 'this household more than a tool for examining rules. The rule-builder is the better half and gets less '
      + 'time.',
  },

  'put-it-back-together': {
    what:
      "He ran past the carpet and Sam's tower came apart. Five loose panels — stopping, looking, saying it, "
      + 'fixing, asking — go into any order he likes, and the strip runs. Sixty orders end with Sam building '
      + 'alongside him; sixty with Sam moving away.',
    practising:
      'Repair as an ordered procedure rather than one apology word, and the finding that the order matters at '
      + 'exactly one joint: here, saying it before asking.',
    ask: 'Run it again with those two panels the other way round. What did Sam do differently?',
    honest:
      'No score: the guide narrates the order he built and never checks it against a canonical one, and both '
      + 'endings are read in the same flat voice. The hinge is a single binary and the other three panels can sit '
      + 'anywhere, so he will find it in a few runs and be done. It also models repair as clean: the other child '
      + 'rebuilds or moves off quietly, nobody is cruel. Real repair often gets neither answer.',
  },

  'the-feeling-rule': {
    what:
      'A family of feelings laid along a brass rule, small to big — annoyed, frustrated, angry — with a sliding '
      + 'marker and a face that changes at each stop. Then real events are pinned on the same rule, and the gap '
      + 'between his last two is read back in stops.',
    practising:
      'Graded emotional vocabulary: "angry" is one word in a family of three or four, and events sit at '
      + 'different places on it. The differential is the output, not the pins.',
    ask: 'Two of your pins are further apart than the rest. Tell me what makes the higher one bigger.',
    honest:
      'No score, and none is possible: no field can hold an expected answer, because a placement is a self-report. '
      + 'Four rules and six events is thin; if he already holds these words the sliding is all that is left — '
      + 'only interesting when someone asks about the gap. One judgement is buried in it: the sad rule puts lonely '
      + 'and sad at the same size, a choice and not a measurement.',
  },

  'body-check': {
    what:
      'He taps where the feeling sits — hot in the face, tight in the throat — and marks what is ordinarily true '
      + 'around him: not eaten, slept late, loud in here. Then he runs one thing that must be genuinely executed, '
      + 'and reads his body again.',
    practising:
      'Interoception: locating a state as a physical signal in a named place, apart from its ordinary causes. '
      + 'The second reading is the measurement; the first alone is a description.',
    ask: 'Read me your first marks and then your second ones. Did what you ran move any of them?',
    honest:
      'No score, and nothing can be answered wrongly: every input is read off his own body. The remedy is '
      + 'allowed to fail — when the second reading matches the first the guide says so, not that it worked. That '
      + 'is the best thing in it. It is also near useless opened cold: its value depends on a grown-up reaching '
      + 'for it when something is already loud, which is when nobody does.',
  },
};
