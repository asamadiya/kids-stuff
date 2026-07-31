import type { Story } from '../types';

/**
 * Third pass. The first two are recorded in the git history and in
 * src/test/olive-story.test.ts; this note is about what the third fixed.
 *
 * The parent's verdict on draft two: "much better but still doesn't tell me
 * how the screw moves and how the olive paste gets squeezed." He was right,
 * and the gap was precise. The story said "round and down" four times and
 * never once said WHY round should produce down, or what the squeezing
 * actually does to the paste. It named the effect and skipped the cause —
 * twice, at the two moments the whole book exists to explain.
 *
 * The two missing causes, now pages 6 and 8:
 *
 *   6. The screw passes through a hole in the fixed beam, and that hole is
 *      threaded to match. The beam cannot move, so the ridge has no choice but
 *      to follow the groove, which runs round AND down. This is the jar lid a
 *      five-year-old has already turned a hundred times.
 *   8. The mats are woven loose. Squashing the paste leaves the oil nowhere to
 *      stay, so it is forced out sideways through the weave while the pulp
 *      stays behind. This is a squeezed sponge.
 *
 * Both are cutaways: a hole cut through a beam, and liquid moving inside a
 * stack. No painting can show either, and the image model cannot draw a
 * correct mechanism (established the hard way on the handbook diagrams). So
 * those two pages carry hand-authored figures instead of art, in the book's
 * own palette — the register of a cross-section book, which is exactly what a
 * curious five-year-old reads cover to cover.
 *
 * The eight painted pages are still cut from ONE generated sheet. The reason
 * is unchanged and worth restating: `images/edits` returns api_not_supported,
 * so every page is an independent draw and no prompt text holds geometry
 * across renders. Within one image the model draws the machine once. See
 * scripts/build-olive-book.py.
 */
export const theScrewThatSqueezedTheOlives: Story = {
  slug: 'the-screw-that-squeezed-the-olives',
  title: 'The Screw That Squeezed the Olives',
  subtitle: 'A Roman farm, a giant wooden screw, and the oil hiding inside a hard little fruit.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Round and down',
  readAloudMinutes: 6,
  learningTakeaway:
    'A screw turns going round into going down. Its ridge runs through a matching groove cut in a beam that cannot move, so the ridge has to follow the groove — a long way round for a little way down, and that trade turns a child’s push into a crushing weight. The weight squashes stacked mats of crushed olive, and because the mats are woven loose, the oil is forced out through the gaps while the pulp stays inside.',
  heartTakeaway:
    'Being small is not the same as being helpless. She could not shove the screw, but once she saw how it worked she could walk it round, and the machine did the rest.',
  grownUpFact:
    'Olives are too bitter to eat off the branch, but about a fifth of a ripe olive’s weight is oil. Ancient presses worked in three steps that have barely changed: crush the fruit, pack the paste into flat loosely-woven baskets (Latin fiscinae), stack them, and squeeze. The screw runs through a threaded block in a fixed frame, so one full turn lowers it by exactly one thread pitch — perhaps five centimetres, while the far end of the bar has travelled several metres. That ratio is the mechanical advantage, and it is why one person can generate tonnes of force. Greek farms pulled a long wooden beam down onto the stack; Roman farms increasingly used a screw, either to haul that beam down or, as here, pressing straight onto the stack. Hero of Alexandria described screw presses in his Mechanica in the first century CE, and Pliny the Elder wrote about press improvements in his Natural History around 77 CE. The oil floats above the watery part and is drawn off the top. It burned in lamps, dressed food, and was rubbed on skin, and it travelled by sea in tall clay jars called amphorae.',
  pages: [
    {
      text: 'Every autumn the olives came in.\n\nThey filled the baskets to the top, hard and green and bitter. Bite one and you would spit it straight out.\n\nBut there was oil hiding inside. Inside every single one.',
      cue: 'Squeeze your hand shut as hard as you can, then open it. What could come out of a squeezed olive?',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p1',
        focus: 'baskets heaped with olives on the floor of a stone press room',
        composition: 'Two wide baskets heaped with hard green-black olives stand on a stone floor. A girl of about six kneels with a handful of them, and her grandfather sets down another basket behind her. Warm afternoon light from a doorway',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl kneels beside baskets heaped with olives while her grandfather sets down another basket.',
    },
    {
      text: 'First they had to be crushed.\n\nA great round stone stood on its edge in a bowl. Grandfather pushed its handle, and the stone rolled, and the olives went to wet grey paste.\n\nThe girl pushed too. She was strong enough for this part.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p2',
        focus: 'the girl and her grandfather pushing the round crushing stone through olives',
        composition: 'A tall round stone stands on its edge in a circular stone basin, crushing olives to grey-green paste. The girl and her grandfather both lean on the wooden handle, walking it round. A stone press room',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl and her grandfather push a tall round stone through olives in a stone basin.',
    },
    {
      text: 'They packed the paste into flat round baskets, woven loose and open like a sun hat.\n\nOne basket on top of another, and another, until the stack came up to her knee.\n\nAbove the stack stood the screw. Wooden, and taller than Grandfather.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p3',
        focus: 'the stack of flat woven baskets of paste built up under the great wooden screw',
        composition: 'PANEL 3',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A stack of flat loosely woven baskets full of grey-green paste sits under the pressing plate of a tall wooden screw.',
    },
    {
      text: 'The girl had waited a whole year for this.\n\nShe reached up, put both hands on the long bar, and pushed.\n\nNothing happened. She pushed with everything she had.\n\nThe screw did not move. Not even a little.\n\nHer face went hot. “I’m not strong enough,” she said.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p4',
        focus: 'the girl pushing hard at the bar while the screw stays still',
        composition: 'PANEL 4',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl pushes hard at the press bar with both hands while the screw stays still and her grandfather watches.',
    },
    {
      text: '“Look at it closely,” said Grandfather.\n\nSo she did. A ridge wound round the screw, round and round, all the way down.\n\nShe put her finger on it and followed it.\n\n“It’s a path,” she said. “It goes round and round instead of straight down.”',
      cue: 'Draw a spiral in the air with your finger, going downwards. That is the line she found.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p5',
        focus: 'the grandfather kneeling as the girl traces the spiral ridge down the screw',
        composition: 'PANEL 5',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A grandfather kneels while a girl traces the spiral ridge winding down the wooden screw with one finger.',
    },
    {
      text: 'But why should turning it make it go down?\n\nLook at the top. The screw passes through a hole in the beam, and that hole has a groove cut to match the ridge.\n\nThe beam is fixed. It cannot move.\n\nSo the ridge has to follow the groove — round, and down.\n\nIt is a jar lid, made huge.',
      cue: 'Fetch a jar with a screw lid. Turn the lid one whole way round and watch how far down it walks.',
      figureId: 'olive-screw-and-nut',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p6',
        focus: 'a cutaway of the screw passing through the threaded hole in the fixed beam',
        composition: 'DIAGRAM — hand-authored, not generated art',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A cutaway diagram showing the screw passing through a matching groove in a fixed beam, so that turning it round drives it down, exactly like a jar lid.',
    },
    {
      text: '“Then I can’t push it,” she said. “I have to walk it.”\n\nShe took the end of the bar and walked. Around the press. Around again.\n\nThe screw turned. Round and down. Round and down.\n\nA whole walk round the room moved it down the width of her thumb. Going the long way made her small push enormous.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p7',
        focus: 'the girl walking the end of the bar around the press as the screw descends',
        composition: 'PANEL 7',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl walks the end of the long bar around the press, turning the screw down onto the stack of baskets.',
    },
    {
      text: 'The foot of the screw pressed a heavy flat lid onto the stack.\n\nDown came the lid. The baskets squashed thinner and thinner.\n\nThe paste had nowhere left to go. But those baskets were woven loose, full of little gaps.\n\nSo the oil was pushed out sideways, through the weave. The mush stayed behind.',
      cue: 'Soak a sponge, then squeeze it in your fist. Where does the water come out, and what stays in your hand?',
      figureId: 'olive-the-squeeze',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p8',
        focus: 'a cutaway of the stack before and after, with oil forced out through the weave',
        composition: 'DIAGRAM — hand-authored, not generated art',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A cutaway diagram of the stack before and after pressing: the mats squash thinner and the oil is forced out sideways through the gaps in the weave, while the pulp stays inside.',
    },
    {
      text: 'Round and down. Round and down.\n\nA fat green-gold drop crept out from between two baskets. It hung there. It fell.\n\nThen another. Then a bright thin thread of oil, running along the stone channel into the jar.\n\nHer arms ached. She kept walking.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p9',
        focus: 'the first drop of oil creeping from between two flattened baskets',
        composition: 'PANEL 9',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'Green-gold oil seeps from between two flattened baskets and a drop hangs above a stone channel.',
    },
    {
      text: 'That night they lit the lamp.\n\nThe little flame stood up straight and yellow, and the whole room went warm.\n\n“You pressed that,” said Grandfather.\n\nThe girl looked at her hands. They were not any bigger than yesterday.\n\n“Can I do it again tomorrow?” she said.',
      cue: 'Next time something is too heavy or too stiff, ask him: is there a way to go the long way round?',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p10',
        focus: 'the lit clay lamp on the table at night and the girl looking at her own hands',
        composition: 'PANEL 10',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A clay lamp burns on a table at night while a girl sits looking down at her own open hands.',
    },
  ],
};

export default theScrewThatSqueezedTheOlives;
