/**
 * For the parent: one note per workshop instrument.
 *
 * Written for the grown-up sitting next to the child, not for the child. Each
 * note says what is on the screen, what skill is actually being exercised, one
 * question worth asking out loud, and — always — the limitation. Several of
 * these instruments are named after real tools (a quadrat is an ecologist's
 * frame, a lathe is a machine, a monochord is an instrument), so the note names
 * the real thing before it says what the child does with it.
 *
 * Data only. Keyed by the tool's `id` as declared in its META, or, for the
 * Story Loom, by the id the bench registers it under.
 *
 * A standing caveat that is true of every tool here and is therefore not
 * repeated in every note: what he makes is kept in this browser's local
 * storage. It does not travel to another device, and clearing site data
 * destroys it. The printed sheet or the exported PNG is the durable copy.
 */

export interface ParentNote {
  readonly what: string;
  readonly practising: string;
  readonly ask: string;
  readonly honest: string;
  /**
   * How you actually play it: three to five steps, in order, each naming a
   * control that exists on screen by the word printed on it. The first step
   * takes a first-time user from a cold screen to something visibly happening.
   */
  readonly how: readonly string[];
  /** The named capabilities it builds. Checkable noun phrases, never virtues. */
  readonly skills: readonly string[];
}

export const NOTES: Record<string, ParentNote> = {
  'story-loom': {
    what:
      'He taps at least three picture-words from a palette — animals, people, places, weather, objects, food — or types one of his own, then presses Compose the story. A story comes back in short paragraphs with every thing he named worked into it as itself: a wave is a wave, not a toy wave. "Compose again" re-rolls the same set into a different telling.',
    practising:
      'Not composition — the machine composes. What is his is the constraint set and the audit: naming a list of things in advance, then reading a finished text back against that list to check every one is present and present as the real thing.',
    ask:
      'Point to where your wave is in the story. Is it a real wave, or did it turn into a bath toy?',
    honest:
      'The weakest instrument on the bench for a child of his level. Offline it is a template — the same skeleton (set off, travel, something happens, home safe) refilled with his nouns — so by the third telling the seams are obvious and he will spot them. The AI mode is a genuinely different and better text, but it needs a grown-up to paste a GitHub token in once, and it is still a model writing, not him. Its honest use is as a dictation prompt: let him retell it changed, and write his version down instead.',
    how: [
      'Tap three pictures from the lists below — Animals, Places, Things — and watch each one drop into the basket.',
      'Press Compose the story. It stays greyed out until three things are in the basket.',
      'Read the story out loud and make him point to each of his three things in the text.',
      'Press Compose again for a different telling of the same three things.',
      'Press Change the things, swap one thing out, and compose once more.',
    ],
    skills: [
      'auditing a text against a list stated in advance',
      'sorting objects into given categories',
      'oral retelling',
    ],
  },

  'number-mill': {
    what:
      'He bolts up to four operation blocks into a chain — add n, take away n, times n, halve, next even, next odd, add the digits, swap the digits — pours one number in, and cranks. A strip shows the number at every station. Below it, a panel shows where each of 1 to 20 lands under the whole chain, and a "return pipe" switch feeds the output back into the front so the chain iterates.',
    practising:
      'Composition of functions, and that composition does not commute: add one then double is not double then add one, and the two leave visibly different marks on the grid. With the return pipe on, fixed points and cycles — numbers the chain stops moving, and numbers it loops between.',
    ask:
      'Put those same two blocks in the other order. Before you crank — will the same number come out?',
    honest:
      'Four slots and a setting capped at nine, so the interesting space is exhausted before his patience is. The grid under "where it lands" has a hundred cells but only ever stains the landing places of 1 to 20, so most of it stays blank and reads like failure — say out loud that the blank cells were simply never asked about. Add-the-digits and swap-the-digits are notation tricks that depend on writing numbers in tens; they will not transfer to anything.',
    how: [
      'Tap add in the block tray. A block bolts onto the chain and the strip above redraws.',
      'Tap that bolted block to raise its counters — each tap adds one dot, up to nine.',
      'Tap a number under What goes in, then press Turn the crank.',
      'Bolt a second block on, crank again, and read the list under Every number at once.',
      'Take both blocks off with ×, bolt them back in the other order, and crank a third time.',
    ],
    skills: [
      'function composition',
      'noticing that order changes the answer',
      'predicting an output before running it',
      'reading an input-to-output table',
    ],
  },

  quadrat: {
    what:
      'A quadrat is the real instrument: a square frame an ecologist drops on the ground, counts what is inside, and returns to. Here he draws that square as a plan on a grid, marks its four corners, invents his own kinds — a colour and a shape, or a drawn mark, named if he wants — and on each visit records the date, the weather, and a five-bar-gate tally per kind. Each visit prints as a numbered field sheet; the sheets stack into a run chart. A kind can later be split in two, and the old line carries on across the seam as the sum of its children.',
    practising:
      'Inventing a classification and then having to live with it, which is the hard part of any survey. Tallying in fives, ranking by abundance, and reading a count as a share of the total rather than as a bare number.',
    ask:
      'Which kind did you have most of last time? Is it still the most this time, or did something overtake it?',
    honest:
      'Worth nothing in one sitting. The first sheet is a chart with a single dot; everything the instrument exists for needs four or five visits spread over weeks. If you are not going to walk him back to the same square on a schedule, do not start it — a half-abandoned series is worse than none. The split-a-kind machinery is the best idea in the tool and he will almost certainly not reach for it unprompted; you have to notice that "bug" has become two things and say so.',
    how: [
      'Press Corner, then tap four squares on the grid to mark the corners of the patch. A red dot lands on each.',
      'Press Tree, Pot or Path and tap squares to draw what is inside the patch, then press Keep this square.',
      'Pick today\'s weather, press Make a new kind, and choose a colour and a shape for the first thing he will count.',
      'Press Stamp one for every one he finds, then press Keep this sheet.',
      'Go back to the same square another day, press Count today, and afterwards press What changed.',
    ],
    skills: [
      'inventing a classification and holding to it',
      'tallying in fives',
      'reading a count as a share of the total',
      'comparing the same measure across dates',
    ],
  },

  'sorting-key': {
    what:
      'A dichotomous key is the branching "if X, go to 3" table naturalists use to identify a specimen. He takes a tray of six to twelve picture cards — story covers, regions, subjects, exercise plates, feeling faces, or small drawn things — splits the tray into two piles, chooses the drawn mark that names the difference, and splits again until every card stands alone. The bench sets the result as proper numbered couplets, 1a / 1b, and prints it.',
    practising:
      'Binary partition under a criterion he has to state, and recursion — the same move applied again to a smaller pile. Also that a key is a thing a person writes, with choices in it, rather than a fact to be looked up.',
    ask:
      'Which one of your questions would separate these two cards for someone who had never seen them before?',
    honest:
      'There is no right key and no score: the same twelve cards admit an enormous number of valid ones, so do not grade it. The more useful half is missing from the bench — the code can run a key against a card and point at the exact fork that failed to separate it, but no screen offers that, so on screen a bad split cannot be caught. Do it by hand: hold up a card, make him walk his own couplets aloud, and watch where it dead-ends.',
    how: [
      'Tap the cards that belong together. They light up as one pile; the ones left untapped are the other pile.',
      'Under "What tells the two sides apart?", choose the pair of words that names the difference.',
      'Press Split this pile.',
      'Do the same again on each pile the bench hands back, until the readout at the top says every card is told apart.',
      'Read the numbered couplets at the foot of the page aloud and check each one leads to the right card.',
    ],
    skills: [
      'binary partition under a stated criterion',
      'recursion — the same move on a smaller pile',
      'putting a difference into words',
    ],
  },

  'table-of-measures': {
    what:
      'He nominates units of his own — his foot, a spoon, a Lego brick, the cat — and measures real furniture by laying that thing end over end and tapping once per lay. Once per unit, and only once, he lays it against a printed centimetre ruler and taps out its length. From then on every reading he has ever taken can be read in every unit he owns. The table is things down the side, his units across the top, with cm and ft in grey at the right edge carrying no more authority than the cat.',
    practising:
      'That a measurement is a count of a repeated unit, and that one length is a single fact expressible in many units. Ratio, specifically: converting between two units is dividing by the unit length.',
    ask:
      'The sofa is four cats long. Roughly how many spoons is that? Say your guess first, then look.',
    honest:
      'The division is the machine\'s. He supplies the count and the one calibration; the conversion happens off-screen, so he can read the whole table fluently without ever performing the arithmetic that makes it true. If you want the mathematics rather than the display, cover a cell with your thumb and make him work it out before you lift it. Separately: laying a unit end over end accumulates error fast, and nothing here warns him that his forty-lay reading is far worse than his four-lay one.',
    how: [
      'Press a spoon, or my foot, under "Choose a thing to measure with". It appears in Your units marked "no length".',
      'Press How long is it?, lay the real spoon along the paper ruler, and tap One notch for every centimetre it covers.',
      'Press "That is how long a spoon is" to fix the calibration. It only has to be done once per unit.',
      'Press the sofa under "Measure a thing with a spoon", then tap Lay it down once each time he puts the spoon down.',
      'Press Keep this measurement, then read the sofa\'s row straight across in every unit he owns.',
    ],
    skills: [
      'measurement as a count of a repeated unit',
      'one-to-one correspondence between lays and taps',
      'converting between units by ratio',
      'estimating a quantity before checking it',
    ],
  },

  'dividing-string': {
    what:
      'A monochord — one string, two nails, one movable bridge — the instrument the Greek ratio experiments were run on and the ancestor of every stringed instrument. He drags the bridge along the string and hears the pitch rise as the sounding part shortens. At the simple fractions (1/2, 2/3, 3/4, 4/5) the two notes stop wobbling and lock. He pins a division as a stud; the studs become a peg rack, and the card he keeps gives the nail positions in millimetres for a 600 mm plank.',
    practising:
      'That pitch is the reciprocal of length — heard, not asserted. Fractions as positions on a real continuum rather than as pizza slices, and the audible difference between "about 5/9" and exactly 2/3.',
    ask:
      'Slide it until the wobbling stops. Now, without looking at the number: how much of the string is left?',
    honest:
      'It needs the sound on and a room quiet enough to hear beating; with sound off, the drawn wave is a much weaker substitute and he will guess from the picture. The tool decides what counts as locked — anything within about 1.5% of the string — so his ear is being confirmed rather than tested. And the real payoff, a plank with nails driven at his printed millimetre marks, is a woodworking afternoon somebody has to actually spend, or the card is only a card.',
    how: [
      'Press Sound the string. Nothing on this bench works until you do — it starts silent.',
      'Drag the bridge along the string, or nudge it with the arrow buttons, and listen for where the wobbling stops.',
      'Press Pin this division the moment the two notes lock. It lands on the peg rack with its fraction under it.',
      'Pin three or four places, then tap those studs in turn to write a phrase and press Play the phrase.',
      'Read the millimetre figure under each stud — that is where the nail goes on a 600 mm plank.',
    ],
    skills: [
      'hearing pitch as the reciprocal of length',
      'locating fractions on a continuous line',
      'telling a simple ratio from a near miss by ear',
    ],
  },

  'constellation-register': {
    what:
      'Every historical account in the library is one star, and where a star sits is read off its own record — its year, its era, its longitude, its subject — not chosen for looks. He taps stars to join them into a figure of his own, names the figure with an icon, and saves it. Then he changes how the sky is arranged (by time, by place, by subject) and the saved figures keep their stars but lose their shape.',
    practising:
      'That the objects are fixed and the arrangement is a choice: the same set looks like a different pattern under a different sort. Also reading a caption made only of measured claims — how many years wide, how many kilometres apart, which places at the ends.',
    ask:
      'Your figure was that shape a moment ago. Is it the same stars now? Then what changed?',
    honest:
      'One idea, delivered in about two minutes, and then it is spent. Once he has switched the arrangement and watched a figure bend there is nothing further to do but make more figures, and a figure is never scored, tested, or used for anything afterwards. Treat it as a demonstration you return to once, not as a workshop tool he will keep coming back to.',
    how: [
      'Tap three stars on the black sky. A line joins them as you go, and the name of each account prints along the bottom.',
      'Read the lines under "What this figure spans" — how many years wide it is, and how far apart the ends are.',
      'Press Close the figure, then choose a mark to name it.',
      'Press By place, then By subject, and watch the named figure keep its stars but lose its shape.',
      'Press Read it beside the figure to open the account of its first star.',
    ],
    skills: [
      'distinguishing a set from its arrangement',
      'reading a caption made only of measured quantities',
      'estimating spans in years and in kilometres',
    ],
  },

  'ornament-lathe': {
    what:
      'A lathe is the machine that turns a shape by spinning stock against a fixed cutter; this one turns a drawing. He lays out instruction cards — draw, turn left, turn right, lift the pen, put it down, grow, shrink — into a program of up to twenty-four cards, wraps stretches in REPEAT brackets which may sit inside other brackets, and a symmetry stamp then lays the whole path down two, three, four, six or eight times as a rosette, or as a border, or as a spiral. Saved plates reload onto the bench as the program, not just the picture, so a design can be reopened and changed.',
    practising:
      'Sequencing, and the loop as an abstraction: that "repeat this four times" and writing it four times produce the same drawing. Repeats inside repeats are the first honest taste of recursion. The turn setting is what decides whether a path closes on itself or wanders.',
    ask:
      'Change the outside repeat from six to three. Before you press it — what will change, and what will stay the same?',
    honest:
      'Programming without reading, which is the design, but it also means he can shuffle cards into a striking ornament while forming no prediction at all; the only defence is making him say what will happen first. Nesting is capped at four deep, and the symmetry stamp does the handsome part for him, so the ornament will consistently look cleverer than the program behind it. Judge the program, not the plate.',
    how: [
      'Tap 90° in the row of turns. An ornament is already on the board when you arrive, and it redraws as you press.',
      'Tap the repeat card in the program row to raise its count, and watch the path grow with every tap.',
      'Press Start again to empty the program, then tap draw, turn left, draw.',
      'Press repeat ⟨ twice, tap draw and turn right, then press ⟩ end twice. That is a repeat inside a repeat.',
      'Change the stamp from one to six-fold or a spiral, then press Keep this ornament.',
    ],
    skills: [
      'sequencing instructions',
      'the loop as shorthand for writing a thing out repeatedly',
      'nesting one repeat inside another',
      'predicting a drawing before running the program',
    ],
  },

  'field-log': {
    what:
      'Three kinds of entry in one notebook. A find: what he saw, where (on the ground, on a tree, on a wall, in water, in the air, under a stone), how many, and what it was doing. A watch: one tree or one pot of seeds, given a rung on the ladder — bare, in bud, in leaf, in flower, in fruit, in seed — and a height in millimetres, on every visit. A shadow: he stands a stick of measured height in the sun and records the shadow length at several times of day.',
    practising:
      'The shadow entry is the substantial one. The shortest shadow of the day marks local solar noon, which is not twelve o\'clock; the sun\'s height above the horizon is the arctangent of stick over shadow; and from that one angle plus the date, the latitude of your garden falls out. It is Eratosthenes\' method, and it works. The watch entry gives growth per day as an honest division: millimetres gained over days elapsed.',
    ask:
      'Which of your readings had the shortest shadow, and what time was it? Why was it not twelve?',
    honest:
      'The trigonometry is the tool\'s, not his. He measures two lengths and is handed a latitude he cannot check or derive, and at five he will not derive it for years — that is fine only if you say so out loud instead of letting him believe he calculated it. He can do the shadow-over-stick ratio on paper, so make him. And like the Quadrat it returns nothing in one sitting: the running tally, the growth rate and the ladder all require going back out.',
    how: [
      'Tap a name under "What did you find" — ant, snail, bee — or type one in the box, then press Keep this find.',
      'Press "A stick and its shadow" in the row at the top.',
      'Stand a stick in the sun, measure the part above the ground, and set that height with the +100 and +10 buttons.',
      'Measure the shadow, tap the hour it is now, and press Write it down.',
      'Come back out every hour and write it down again, then find the shortest reading of the day.',
    ],
    skills: [
      'recording an observation in fixed fields',
      'measuring lengths in millimetres',
      'finding the minimum in a run of readings',
      'rate as amount gained over days elapsed',
    ],
  },
};

export default NOTES;
