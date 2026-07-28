/**
 * For the parent — the 22 maths exercises.
 *
 * Written for the adult sitting next to the child, not for the child and not
 * for a prospectus. Each note says what is on the screen, what is actually
 * being practised, one question to ask out loud, and what the exercise does
 * not do. The last field is the one that matters: an exercise that is capped
 * below a well-ahead five-year-old is named as capped, with the harder thing
 * to do instead.
 *
 * Every claim here was checked against the module and its component. Where a
 * note says a hint gives the answer away, or that a picture can be counted
 * instead of computed, that was read out of the source, not guessed at.
 *
 * Keyed by the exercise's `id` from its META.
 */

export interface ParentNote {
  readonly what: string;
  readonly practising: string;
  readonly ask: string;
  readonly honest: string;
}

export const NOTES: Record<string, ParentNote> = {
  'tens-and-ones': {
    what:
      'Tall blue rods of ten and loose yellow cubes sit on the table. He picks the '
      + 'total from four numbers. Fourteen rounds, every total between 11 and 99.',
    practising:
      'Reading a base-ten collection as a two-digit numeral: three rods and four cubes '
      + 'are 34. The wrong answers are the digit swap (43) and the off-by-ten (44), which '
      + 'are the two mistakes children actually make here.',
    ask: 'If I took one whole rod away, what number would be left?',
    honest:
      'The stage prints "3 tens + 4 ones" in text directly under the blocks, so a child '
      + 'who can read numerals never has to count a rod — he reads two digits and presses '
      + 'them. It also stops at 99; there are no hundred-flats. Build the Number is the '
      + 'same idea without the giveaway, and it runs to four digits.',
  },

  'count-by-tens': {
    what:
      'Three or four numbers ten apart — 23, 33, 43 — then a blank. He picks what comes '
      + 'next from three options.',
    practising:
      'Adding ten to a two-digit number: the ones digit is untouched, the tens digit goes '
      + 'up by one. Six rounds start off the decade (7, 17, 27) and two cross a hundred '
      + '(80, 90, 100, then 110), which is where the pattern is worth something.',
    ask: 'Now run that line backwards. What comes before 23?',
    honest:
      'Always forward, always plus ten. Once he notices the ones digit never changes, the '
      + 'round is a copy-and-increment, not arithmetic. Counting back in tens — the harder '
      + 'half, and the one that matters for subtraction — never appears anywhere on the '
      + 'site; you have to ask for it out loud.',
  },

  'skip-count': {
    what: '2, 4, 6, ? or 5, 10, 15, ? — the run so far, then the next term from four numbers.',
    practising:
      'Skip counting by 2 and by 5, which is the two-times and five-times table recited '
      + 'forwards before the multiplication notation is introduced.',
    ask: 'Say that whole line backwards, starting from the number you just picked.',
    honest:
      'Every one of the twelve sequences starts on a multiple of its own step, so they are '
      + 'all just the 2x or 5x table from the top; nothing starts at 7 and steps by 3. The '
      + 'option list is also sorted, which puts the answer on the second or third button in '
      + 'all twelve rounds and never on the first or last — a child who spots that has a '
      + 'one-in-two guess without counting. Threes and fours live in Multiplication instead.',
  },

  'build-the-number': {
    what:
      'Towers of thousands, hundreds, tens and ones, and either "Which number is 3 thousands, '
      + '4 hundreds and 6 ones?" or "3000 + 400 + 6 = ?". He picks the numeral from four.',
    practising:
      'Expanded form to four digits, including the zero-place cases — 507, 305, 160, 3406 — '
      + 'where a place with nothing in it still has to be written. The wrong answers are '
      + 'digit swaps and dropped zeros, so 507 is offered against 57 and 570.',
    ask: 'In 3406, which digit is doing the least work — and why can we not just leave it out?',
    honest:
      'Recognition only. He picks a printed numeral; he never writes one, says one, or runs '
      + 'the question the other way (given 3406, name the parts). That reverse direction is '
      + 'the harder and more useful half and it is not here — do it on paper. Fourteen rounds '
      + 'and it stops at thousands.',
  },

  'add-with-things': {
    what:
      'Two groups of objects side by side — four bananas and three more — and four possible '
      + 'totals. Every sum is 12 or less.',
    practising:
      'Counting on from a group. Not addition as a recalled fact: every object stays on the '
      + 'screen, so recounting from one always works and is the path of least resistance.',
    ask: 'Did you count them, or did you already know? If you counted, why did you need to?',
    honest:
      'This is beneath him. A five-year-old who has bonds to ten does not need single-digit '
      + 'sums with the objects still visible, and it will read as busywork. Skip it. Number '
      + 'Bonds, What’s Missing and Two-Digit Addition all ask for a fact rather than a count.',
  },

  'number-bonds': {
    what:
      'A ten-frame with some cells filled and "What goes with 6 to make 10?". Ten rounds to '
      + 'ten, then four to twenty across two frames.',
    practising:
      'The complements of ten, and four complements of twenty. These are the facts that '
      + 'later bridging (8 + 5 as 8 + 2 + 3) and mental subtraction are both built on.',
    ask: 'Now say that as a take-away: ten take away six is what?',
    honest:
      'He can count the empty cells rather than recall the bond, which is a different and '
      + 'easier task. The four options are the answer plus or minus one or two, so bracketing '
      + 'beats knowing. The ten bonds are probably already his; the four bonds-to-twenty '
      + 'rounds are the only ones with anything in them. Bonds to a hundred in tens — 30 and '
      + 'what makes 100 — is the next rung and is not on the site.',
  },

  'two-digit-add': {
    what:
      '23 + 14 set out as a column sum, and four possible answers. Twenty-two rounds; in '
      + 'eight of them the ones column passes ten and a ten has to move across.',
    practising:
      'Column addition with carrying. On the eight carry rounds the no-carry answer '
      + '(27 + 15 read as 32) is always offered as a choice, so picking it is diagnostic: '
      + 'it means he added the columns but did not move the ten.',
    ask: 'Which of those needed you to carry a ten, and which did not?',
    honest:
      'The hint under the board reads "Add the ones: 7 + 5 = 12. Add the tens: 30" — most of '
      + 'the working, on screen, before he chooses; all that is left is 30 + 12. The eight '
      + 'carrying rounds are the first eight, and the remaining fourteen are the old easy '
      + 'set, so the exercise gets easier as it goes and never gets hard again. Sums stop at '
      + '99 and it is still multiple choice. Write four of these out on paper for him.',
  },

  'take-away': {
    what:
      'A row of objects with the last few struck through in red and greyed out. He picks how '
      + 'many are left, from four numbers. Everything is within ten.',
    practising:
      'Subtraction within ten as take-away, with the removed items still on the screen.',
    ask: 'How many did I cross out, and how many were there before I did?',
    honest:
      'Beneath him, and not really subtraction: the crossed-out objects stay visible and '
      + 'countable, so the winning move is "count the ones without a cross". One round takes '
      + 'away nothing and one takes away everything. Two-Digit Subtraction and What’s '
      + 'Missing are where the arithmetic is.',
  },

  'two-digit-subtract': {
    what:
      '47 − 12 set out as a column, four possible answers. Twenty-two rounds; in eight of '
      + 'them the top ones digit is the smaller one, so a ten has to be broken.',
    practising:
      'Column subtraction with borrowing — taking a ten apart to pay the ones column. That '
      + 'is the step children get wrong and the reason this exercise is worth doing at all.',
    ask: 'You had 52 and took 27. Why did you have to break one of the tens open?',
    honest:
      'The eight borrowing rounds are the first eight; rounds nine to twenty-two are the old '
      + 'no-borrow set, so difficulty drops off a cliff and stays down. The exercise’s own '
      + 'hint and subtitle still say there is no borrowing here, which is now false for those '
      + 'first eight. Four options, so a wrong method can still land on the right button.',
  },

  'groups-of': {
    what:
      'Three baskets with four apples in each, all drawn, and "3 groups of 4 — how many in '
      + 'all?" from four numbers. Products stop at 30.',
    practising:
      'What multiplication means: equal groups counted together. The distractors include '
      + '3 + 4 = 7, so adding instead of multiplying is caught rather than hidden.',
    ask: 'Cover one basket with your hand. How many now?',
    honest:
      'Every item is drawn, so counting one by one beats multiplying and is faster for small '
      + 'products; the stage also prints "3 x 4" above the picture. This teaches the meaning '
      + 'of multiplication, which he may well already have — once he does, it is a counting '
      + 'drill. Multiplication is the one that makes him use a fact instead of a picture.',
  },

  'times-tables': {
    what:
      'A grid of dots — one row per group — with "4 x 5 = ?" and four answers. Twenty-three '
      + 'rounds interleaving the 2s, 3s, 4s, 5s and 10s so consecutive questions come from '
      + 'different tables.',
    practising:
      'Multiplication facts within those five tables, with the array as the model: a row is '
      + 'a group, the dots along it are the group size. Wrong answers are named mistakes — '
      + 'one group too many, one too few, added instead of multiplied.',
    ask: 'How many dots would there be with one more row? Do not count them again.',
    honest:
      'The dots are all there, so a patient child counts rather than recalls, and nothing '
      + 'times him or forces recall. The 6s, 7s, 8s and 9s — precisely the tables that need '
      + 'learning, since the rest can be reached by skip-counting on fingers — are absent, '
      + 'and so is the matching division fact (20 / 5 = 4). This is the strongest '
      + 'multiplication exercise here and it still stops short of the hard half.',
  },

  'share-fairly': {
    what:
      'Twelve seeds and four bowls drawn on the table, and "Share 12 seeds on 4 bowls. How '
      + 'many on each?" from four numbers.',
    practising:
      'Division as fair sharing — the partitive case, where you know how many groups and '
      + 'are looking for the size of each. This is the reading of division a child meets '
      + 'first and the one that matches dealing cards.',
    ask: 'If one bowl broke and you shared the same seeds onto three, would each bowl get more or fewer?',
    honest:
      'Every round divides exactly; a remainder never once appears. The four options are the '
      + 'answer plus or minus one or two, so estimating within one wins without dividing, and '
      + 'totals stop at 24. Nothing is actually shared out on screen — the bowls stay empty '
      + 'and the seeds stay in a row. How Many Groups? is the harder sibling: it has leftovers.',
  },

  'how-many-groups': {
    what:
      'A heap of seventeen stones and a "Fill a bucket" button that takes five at a time. He '
      + 'fills as many buckets as he can, then answers how many came out full, from four '
      + 'numbers. Eight of the sixteen rounds leave something over.',
    practising:
      'Division as measurement — the quotative case, where you know the group size and are '
      + 'looking for the number of groups. And the remainder: that the last few stones are '
      + 'real but do not make another bucket.',
    ask: 'Before you press Fill — how many buckets, and will anything be left over?',
    honest:
      'The Fill button lets him carry out the entire division by hand, so the round can be '
      + 'finished without dividing at all; it stops being mathematics the moment he stops '
      + 'predicting first, which is why the question above is the whole exercise. Totals stop '
      + 'at 20 and no bucket holds more than six. The remainder is only ever counted, never '
      + 'written — "3 remainder 2" does not appear, and neither does the fraction.',
  },

  'halves-and-wholes': {
    what:
      'A fraction at the top — one half, one quarter, three quarters — and three or four '
      + 'shapes cut up in different ways. He picks the one whose shaded part matches.',
    practising:
      'Reading a fraction as a share of the area, not as a count of pieces. Several answers '
      + 'are two of four, three of six, four of eight, so "cut in two with one shaded" is '
      + 'deliberately not a reliable rule; some distractors are cut unevenly.',
    ask: 'That one is cut into six and three are shaded. Why is that still a half?',
    honest:
      'Recognition among pictures. He never produces a fraction, compares two, or adds any. '
      + 'Denominators are only 1, 2, 3, 4, 6 and 8, and nine of the fourteen rounds ask for '
      + 'one half — a child who has learned only "half" will score well and learn little. '
      + 'Fractions as numbers, rather than as shaded pictures, are not on the site.',
  },

  'fraction-pizza': {
    what:
      'A chapati, apple or wheel of cheese on a plate with pieces genuinely missing — the '
      + 'bare plate shows through where they were. The question asks either what fraction is '
      + 'gone or what fraction is left; he picks a label like 2/3 or 3/4 from four.',
    practising:
      'Naming a proper fraction from a picture, and holding the pair: three quarters gone is '
      + 'one quarter left. Answering the other half of the question is always offered as a '
      + 'choice, so that specific slip shows up rather than passing as a random miss.',
    ask: 'You said three quarters are gone. So what fraction is still on the plate?',
    honest:
      'Denominators stop at four, so the whole exercise lives in halves, thirds and quarters. '
      + 'The options are filtered so no two are ever the same amount, which means he will '
      + 'never be shown 2/4 and 1/2 side by side — equivalence is deliberately excluded, and '
      + 'it is the next thing worth teaching. No comparing and no adding of fractions.',
  },

  'compare-numbers': {
    what:
      'Two two-digit numbers with base-ten blocks under each — 34 against 43 — and three '
      + 'buttons: the smaller number, the larger, and "They are equal".',
    practising:
      'Comparing by place value: tens first, ones only when the tens tie. Most pairs are '
      + 'digit reversals (71 and 17, 26 and 62), which is exactly the confusion worth '
      + 'attacking, and two rounds are genuinely equal so "pick one" is not always right.',
    ask: 'Which is bigger, 307 or 71 — and how did you decide?',
    honest:
      'The buttons are always ordered smaller, larger, equal, so the correct one is the '
      + 'middle button in twelve of the fourteen rounds and the third in the other two. A '
      + 'child who notices that stops comparing anything. Two digits only, never three; no '
      + 'less-than or greater-than notation; never more than two numbers to put in order.',
  },

  'number-line-jump': {
    what:
      'A number line from 0 to 20 with a marker at the starting number and a dashed arc '
      + 'showing the jump, forward or back. He picks the landing number from four.',
    practising:
      'Addition and subtraction as movement along a line rather than as objects gathered or '
      + 'removed — the model that later carries negative numbers, measurement and scale.',
    ask: 'What jump would take you straight back to where you started?',
    honest:
      'The arc is drawn all the way to the landing point before he answers, and every whole '
      + 'number has a tick, so he can count ticks along the arc and read the answer off the '
      + 'line instead of working it out. Only the label is hidden. The line stops at 20 and '
      + 'never goes below zero, so subtraction can never run out — which is the single most '
      + 'interesting thing a number line can show.',
  },

  'doubles': {
    what:
      'Two equal groups of dots side by side and "Double 6 = ?" from four numbers. Twelve '
      + 'rounds covering 1 through 10, with 7 and 9 asked twice.',
    practising:
      'The doubles facts to 10 + 10. These are anchor facts: a child who knows double 7 gets '
      + '7 + 8 for nothing, which is the point of learning them separately at all.',
    ask: 'So what is 7 + 8?',
    honest:
      'Ten facts, one of which is doubling 1, and the dots are drawn so he can count if he '
      + 'does not know. A well-ahead five probably has all ten already. Nothing here doubles '
      + 'a teen or a ten — double 14, double 60 — and halving, the inverse and the harder '
      + 'direction, never appears. Ask for those out loud; they are a minute’s work.',
  },

  'odd-even': {
    what:
      'A number, and that many objects already arranged in pairs, with any leftover object '
      + 'sitting alone inside a dashed box. Two buttons: Odd, Even.',
    practising:
      'Parity as pairing: whether a quantity splits into twos with nothing standing out.',
    ask: 'Is 154 odd or even? How did you know without drawing it?',
    honest:
      'The picture does the work. The pairs are formed for him and the leftover is boxed and '
      + 'dashed, so the answer is visible before the question has been read, and there are '
      + 'only two buttons. Numbers stop at 20, and the rule that makes parity useful — look '
      + 'at the last digit, so 3407 is odd — is never stated and never tested. One bit of '
      + 'information, illustrated.',
  },

  'money-coins': {
    what:
      'Dimes, nickels and pennies on a table at their true relative sizes, each carrying the '
      + 'words a real coin carries — ONE DIME, FIVE CENTS — and no numerals anywhere. "How '
      + 'much is this?", four totals in cents. A collapsed "Coin values" panel holds the key.',
    practising:
      'Identifying a coin by size, colour and legend rather than by a printed number, then '
      + 'adding a mixed handful — tens, fives and ones in one running total. The counting '
      + 'order that works, biggest first, is the one the coins are laid out in.',
    ask: 'Pay me 23 cents out of your pocket. Which coins, and why those?',
    honest:
      'Totals stop at 45 cents; there are no quarters and no dollars, so the most awkward US '
      + 'coin is missing. He never makes change, never pays, and never meets "you have fifty '
      + 'and this costs thirty-eight". This is the most practical exercise in the section and '
      + 'it is still only reading a total off a table. Real coins in a real hand do the rest.',
  },

  'ten-more-ten-less': {
    what:
      'A two-digit number with its base-ten blocks, and "What is 10 more than 34?" — four '
      + 'options. Fourteen rounds, half of them ten less.',
    practising:
      'Adding and subtracting ten mentally by moving the tens digit and leaving the ones '
      + 'digit alone. The wrong answers include the right size in the wrong direction and the '
      + 'starting number itself, so a guess in the wrong direction is caught.',
    ask: 'What is 100 more than 340? It is the same move, one place along.',
    honest:
      'One rule, applied fourteen times, with the rule printed under the board before he '
      + 'answers: "Add 1 to the tens digit — the ones digit stays the same." Nothing crosses '
      + '100 and nothing moves by 1 or by 100. He will have it in three rounds and then there '
      + 'is nothing left; the next rung, a hundred more than a three-digit number, is not here.',
  },

  'whats-missing': {
    what:
      'An equation with one box empty — 6 + ? = 10, ? + 3 = 8, 15 − ? = 8 — and four numbers '
      + 'to fill it. Sixteen rounds across all four positions and both operations.',
    practising:
      'Solving for an unknown wherever it sits in an addition or subtraction sentence: '
      + 'missing addend, missing start, missing subtrahend, missing total. This is the '
      + 'algebraic move — undoing an operation to find a part — about four years early, and '
      + 'it is the most valuable exercise in the maths section.',
    ask: 'How did you get that — did you add or did you take away? Why that one?',
    honest:
      'Everything stays within 20 and only ever one box is empty. The four options are the '
      + 'answer plus or minus one to three, so bracketing the equation beats solving it, and '
      + 'the correct button walks a fixed cycle — first, fourth, third, second, first — which '
      + 'a child working through the deck in order can simply read off. Write the same '
      + 'equations on paper with no options and it becomes genuinely hard.',
  },
};
