import type { Story } from '../types';

/**
 * Fourth pass, and the first one that answers the four questions a parent
 * actually asked of it: how does the screw move, how does the girl make it
 * move, what does the grandfather teach, and how does the stone move.
 *
 * Draft three answered the first and got the second wrong. It had her push the
 * bar on page 4 and fail, then push the bar on page 7 and succeed — but
 * pushing a bar sideways IS turning the screw. The story contradicted itself
 * at the exact point it was trying to explain. The obvious wrong idea, and the
 * one a child actually has, is to push the thing DOWN because you want it to
 * go down. That is her failure now.
 *
 * So there are two separate ideas, and draft three had them mashed into one:
 *
 *   - The THREAD turns going-round into going-down (page 7's diagram). This is
 *     why turning helps at all.
 *   - The BAR is a lever, so where you push it matters more than how hard
 *     (page 9's diagram). This is why SHE can turn it when her bare hands
 *     could not.
 *
 * The stone was never explained at all — "Grandfather pushed its handle, and
 * the stone rolled" is a sentence, not a mechanism. It has a diagram now
 * (page 3), and it carries the same lesson as the screw, which is what makes
 * the grandfather a teacher rather than a prop: you do not beat a heavy thing
 * with strength, you find the shape that does the work for you. He says the
 * same seven words at the stone, at the screw and at the bar, and she says
 * them back on the last page.
 *
 * Pages 3, 7, 9 and 11 are cutaways and comparisons — a hole inside a beam,
 * a path seen from above, two pushes at once, liquid moving inside a stack.
 * No painting can show any of them and the image model cannot draw a correct
 * mechanism, so those four carry hand-authored figures. The nine painted pages
 * are cut from ONE generated sheet, because `images/edits` returns
 * api_not_supported and nothing else holds a machine constant across renders.
 * See scripts/build-olive-book.py.
 */
export const theScrewThatSqueezedTheOlives: Story = {
  slug: 'the-screw-that-squeezed-the-olives',
  title: 'The Screw That Squeezed the Olives',
  subtitle: 'A Roman farm, a giant wooden screw, and the oil hiding inside a hard little fruit.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Let it do the work',
  readAloudMinutes: 7,
  learningTakeaway:
    'Two machines, one idea. The stone wheel is too heavy to lift, but it is round, so it rolls — and a post holds it rolling in a circle so its own weight crushes the olives. The screw has a ridge running through a matching groove in a beam that cannot move, so turning it forces it downward; and the long bar through its head is a lever, so a small push at the far end makes a turn no pair of hands could make close in. Neither machine needs a strong child. Each one needs a child who knows where to push.',
  heartTakeaway:
    'Being small is not the same as being helpless. She could not out-push a stone or a screw, and she never had to: her grandfather kept showing her the same thing in three different machines, and by the end she could say it herself.',
  grownUpFact:
    'Olives are too bitter to eat off the branch, but about a fifth of a ripe olive’s weight is oil. Ancient presses worked in three steps that have barely changed: crush, pack the paste into flat loosely-woven baskets (Latin fiscinae), stack them, and squeeze. The crusher here is the mola olearia, an edge-runner: a stone wheel on a horizontal arm turning about a central pillar in a stone basin, so the wheel rolls a circular track and its weight does the work. Rolling matters — a wheel that rolls meets far less resistance than the same stone dragged. The press screw runs through a threaded block in a fixed frame, so one full turn lowers it by exactly one thread pitch, perhaps five centimetres, while the far end of the bar has travelled several metres; that ratio is the mechanical advantage, and it is why one person can generate tonnes of force. The screw’s foot bears on a separate block so the stack is pressed, not ground. Hero of Alexandria described screw presses in his Mechanica in the first century CE, and Pliny the Elder wrote about press improvements in his Natural History around 77 CE. The oil floats above the watery part and is drawn off the top. It burned in lamps, dressed food, and was rubbed on skin, and it travelled by sea in tall clay jars called amphorae.',
  pages: [
    {
      text: 'Every autumn the olives came in.\n\nThey filled the baskets to the top, hard and green and bitter. Bite one and you would spit it straight out.\n\nBut there was oil hiding inside. Inside every single one.',
      cue: 'Squeeze your hand shut as hard as you can, then open it. What could come out of a squeezed olive?',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p1',
        focus: 'baskets heaped with olives on the floor of a stone press room',
        composition: 'PANEL 1',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl kneels beside baskets heaped with olives while her grandfather sets down another basket.',
    },
    {
      text: 'First they had to be crushed.\n\nIn the middle of a round stone basin stood a post. An arm reached out from it. On the end of the arm stood a great stone wheel, up on its edge.\n\nGrandfather leaned on the arm. The wheel rolled.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p2',
        focus: 'the stone wheel on its arm rolling round the basin, the centre post clearly visible',
        composition: 'PANEL 2',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A tall stone wheel stands on its edge in a round basin, joined by a wooden arm to a post in the middle, rolling over the olives.',
    },
    {
      text: 'That wheel was far too heavy to lift. Nobody could have lifted it.\n\nBut it did not need lifting. It was round, so it rolled. The post held the arm, so it rolled in a circle, over the olives, again and again.\n\nIts own weight did the crushing.\n\n“Let it do the work,” said Grandfather.',
      cue: 'Find something round and something square. Push each one across the floor. Which one wants to go?',
      figureId: 'olive-the-stone',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p3',
        focus: 'a cutaway and a view from above of the stone wheel turning about its post',
        composition: 'DIAGRAM — hand-authored, not generated art',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A diagram of the crushing mill from the side and from above: a stone wheel on its edge, joined by an arm to a post in the centre of the basin, so that pushing the arm rolls the wheel round a circle and its own weight crushes the olives underneath.',
    },
    {
      text: 'They packed the paste into flat round baskets, woven loose and open like a sun hat.\n\nOne basket on top of another, and another, until the stack came up to her knee.\n\nAbove the stack stood the screw. Wooden, and taller than Grandfather.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p4',
        focus: 'the stack of flat woven baskets built up under the great wooden screw',
        composition: 'PANEL 3',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A stack of flat loosely woven baskets full of grey-green paste sits under the pressing plate of a tall wooden screw.',
    },
    {
      text: 'The girl had waited a whole year for this.\n\nShe put both hands flat on the top basket of paste and pushed down. She pushed until her arms shook and one foot slid back on the stone.\n\nNothing moved. Not a hair.\n\n“I’m not strong enough,” she said.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p5',
        focus: 'the girl pressing down on the top basket of paste with both hands while nothing moves',
        composition: 'PANEL 4',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl leans her whole weight onto the top basket of paste, pushing down with both hands, while nothing moves and her grandfather watches with folded arms.',
    },
    {
      text: '“You are not meant to be,” said Grandfather. “Don’t push it down. Turn it. Let it do the work.”\n\nSo she looked closely. A ridge wound round the screw, round and round, all the way down.\n\nShe put her finger on it and followed it.\n\n“It’s a path,” she said. “It goes round and round instead of straight down.”',
      cue: 'Draw a spiral in the air with your finger, going downwards. That is the line she found.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p6',
        focus: 'the grandfather kneeling as the girl traces the spiral ridge down the screw',
        composition: 'PANEL 5',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A grandfather kneels beside a girl as she traces the spiral ridge winding down the wooden screw with one finger.',
    },
    {
      text: 'Why should turning it make it go down?\n\nLook at the top. The screw passes through a hole in the beam, and that hole has a groove cut to match the ridge.\n\nThe beam is bolted. It cannot move.\n\nSo the ridge must follow the groove — round, and down.\n\nIt is a jar lid, made huge.',
      cue: 'Fetch a jar with a screw lid. Turn the lid one whole way round and watch how far down it walks.',
      figureId: 'olive-screw-and-nut',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p7',
        focus: 'a cutaway of the screw passing through the threaded hole in the fixed beam',
        composition: 'DIAGRAM — hand-authored, not generated art',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A cutaway diagram showing the screw passing through a matching groove in a fixed beam, so that turning it round drives it down, exactly like a jar lid.',
    },
    {
      text: 'So she took hold of the bar and turned.\n\nIt hardly budged. Her hands were close in beside the screw, and the bar felt like a wall.\n\nGrandfather put his hands over hers and walked them out, all the way to the far end of the bar.\n\n“Now push,” he said.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p8',
        focus: 'the grandfather moving the girl’s hands out along the bar to its far end',
        composition: 'PANEL 6',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A grandfather puts his hands over a girl’s and slides them out along the press bar to its far end.',
    },
    {
      text: 'The bar is a long arm. Where you push it matters more than how hard you push.\n\nClose in beside the screw, you are fighting it.\n\nOut at the end, the bar fights it for you. The same small push comes out as a much bigger turn.',
      cue: 'Push a door open right at its edge. Now push it right beside the hinge. Same door, same push. Feel the difference.',
      figureId: 'olive-the-long-bar',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p9',
        focus: 'the bar seen from above, with a hard push close in and an easy push at the end',
        composition: 'DIAGRAM — hand-authored, not generated art',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A diagram of the bar seen from above: pushing close beside the screw needs a huge shove, while the same small push at the far end of the bar turns it easily — like opening a door at its edge instead of beside the hinge.',
    },
    {
      text: 'She pushed. It moved.\n\nSo she kept walking. Around the press. Around again.\n\nRound and down. Round and down. A whole walk round the room moved the screw the width of her thumb.\n\nThe plate came down, and the stack squashed flatter.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p10',
        focus: 'the girl walking the far end of the bar as the screw descends onto the squashed stack',
        composition: 'PANEL 7',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl walks the far end of the long bar around the press, turning the screw down onto a stack of baskets squashed flatter than before.',
    },
    {
      text: 'The foot of the screw pressed a heavy flat lid down onto the stack.\n\nThe paste had nowhere left to go. But those baskets were woven loose, full of little gaps.\n\nSo the oil was pushed out sideways, through the weave. The mush stayed behind.',
      cue: 'Soak a sponge, then squeeze it in your fist. Where does the water come out, and what stays in your hand?',
      figureId: 'olive-the-squeeze',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p11',
        focus: 'a cutaway of the stack before and after, with oil forced out through the weave',
        composition: 'DIAGRAM — hand-authored, not generated art',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A cutaway diagram of the stack before and after pressing: the mats squash thinner and the oil is forced out sideways through the gaps in the loose weave, while the pulp stays inside.',
    },
    {
      text: 'A fat green-gold drop crept out from between two baskets. It hung there. It fell.\n\nThen another. Then a bright thin thread of oil, running along the stone channel into the jar.\n\nHer arms ached. She kept walking.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p12',
        focus: 'the first drop of oil creeping from between two flattened baskets',
        composition: 'PANEL 8',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'Green-gold oil seeps from between two flattened baskets and a drop hangs above a stone channel.',
    },
    {
      text: 'That night they lit the lamp.\n\nThe little flame stood up straight and yellow, and the whole room went warm.\n\n“You pressed that,” said Grandfather.\n\nShe looked at her hands. They were not any bigger than yesterday.\n\n“I didn’t,” she said. “I let it do the work.”',
      cue: 'Next time something is too heavy or too stiff, ask him: where should we push?',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p13',
        focus: 'the lit clay lamp on the table at night and the girl looking at her own hands',
        composition: 'PANEL 9',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A clay lamp burns on a table at night while a girl sits looking down at her own open hands.',
    },
  ],
};

export default theScrewThatSqueezedTheOlives;
