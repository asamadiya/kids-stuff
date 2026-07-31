import type { Story } from '../types';

/**
 * Rewritten from the ground up. The first version had three faults, all of
 * which a parent hit within a page or two:
 *
 * 1. The title promised a screw and nine of twelve pages described a lever —
 *    a Greek beam press, with the screw appended as a coda. Someone opening
 *    "The Screw That Squeezed the Olives" got a windlass.
 * 2. It averaged 72 words a page, 870 in all, in sentences like "Pushing far
 *    out at the rope end took only a light, steady effort." Page 11 dated Hero
 *    of Alexandria as "about sixty years after a very old calendar's start",
 *    which is not a fact a five-year-old can hold, or anyone.
 * 3. Eight of the twelve pictures did not show their page. Page 6 read "a
 *    shining drop gathered at the wooden spout" over a night scene of a
 *    sleeping child under a moon.
 *
 * So: the screw is the subject from page one, the machine is drawn on every
 * page it is named on, and the text runs about 35 words a page in short
 * sentences. The two figures are fixed — a girl and her grandfather — and
 * described identically in every art prompt, because the cast wandering
 * between panels was half of why the pictures read as unrelated.
 */
/**
 * Eight pages, and the four that show the press are cut from ONE generated
 * sheet.
 *
 * Three drafts failed on the same thing: the press was a different machine on
 * every page. The cause is that the image endpoint is text-to-image only
 * (`images/edits` returns api_not_supported), so every page was an independent
 * draw and no amount of prompt text held the geometry. Two reviewers measured
 * the drift independently — thread counts of 7, 9, 10 and 11 against a stated
 * eight, four different screw heads, and a grandfather who gained and lost a
 * beard between pages.
 *
 * Within a single image the model is perfectly consistent, because it draws the
 * machine once. So pages 3 to 6 — the pages where the press is the subject —
 * are four panels of one 2x2 sheet, sliced apart. Pages 1, 2, 7 and 8 do not
 * feature the press and are rendered individually at full size.
 *
 * `scripts/build-olive-sheet.py` generates and slices; `scripts/verify-olive.py`
 * builds the contact sheet and records that a human looked at it.
 */
export const theScrewThatSqueezedTheOlives: Story = {
  slug: 'the-screw-that-squeezed-the-olives',
  title: 'The Screw That Squeezed the Olives',
  subtitle: 'A Roman farm, a giant wooden screw, and the oil hiding inside a hard little fruit.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Round and down',
  readAloudMinutes: 5,
  learningTakeaway:
    'A screw is a ramp wrapped around a pole. Turning it a long way round moves it a short way down, and that trade turns a small push into a very big squeeze. Roman farms used a giant wooden screw to press oil out of crushed olives.',
  heartTakeaway:
    'Being small is not the same as being helpless. She could not shove the screw, but she could walk it round, and the machine did the rest.',
  grownUpFact:
    'Olives are too bitter to eat off the branch, but about a fifth of a ripe olive’s weight is oil. Ancient presses worked in three steps that have barely changed: crush the fruit, pack the paste into flat loosely-woven baskets, stack them, and squeeze. Greek farms pulled a long wooden beam down onto the stack. Roman farms increasingly used a screw — either to haul that beam down or, as here, pressing straight down on the stack itself. Hero of Alexandria described screw presses in his Mechanica in the first century CE, and Pliny the Elder wrote about press improvements in his Natural History around 77 CE. The oil separates and floats above the watery part, so it is drawn off the top. It burned in lamps, dressed food, and was rubbed on skin, and it travelled by sea in tall clay jars called amphorae.',
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
      text: 'They packed the paste into flat baskets and stacked them up under the press.\n\nAbove the stack stood the screw. Wooden, and taller than Grandfather.\n\nThe girl had waited a whole year for this. She reached up as high as she could and put both hands on the bar.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p3',
        focus: 'the girl reaching up to the bar of the great wooden screw press for the first time',
        composition: 'PANEL A',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl stands small at the foot of a great wooden screw press, reaching up with both hands to its long bar.',
    },
    {
      text: 'She pushed.\n\nNothing happened. She pushed with everything she had, feet sliding on the stone.\n\nThe screw did not move. Not even a little.\n\nHer face went hot. “I’m not strong enough,” she said.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p4',
        focus: 'the girl pushing hard at the bar while the screw stays still',
        composition: 'PANEL B',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl pushes hard at the press bar with both hands while the screw stays still and her grandfather watches.',
    },
    {
      text: '“Look at it closely,” said Grandfather.\n\nSo she did. There was a line on the screw, winding round and round, all the way down. She put her finger on the line and followed it.\n\n“It’s a path,” she said. “It goes round and round instead of straight down.”',
      cue: 'Draw a spiral in the air with your finger, going downwards. That is the line she found.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p5',
        focus: 'the grandfather kneeling as the girl traces the spiral line down the screw',
        composition: 'PANEL C',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A grandfather kneels while a girl traces the spiral line winding down the wooden screw with one finger.',
    },
    {
      text: '“Then I can’t push it,” she said. “I have to walk it.”\n\nShe took the end of the bar and walked. Around the press. Around again.\n\nAnd the screw turned. Round and down. Round and down. A long way round, to go a little way down.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p6',
        focus: 'the girl walking the end of the bar around the press as the plate comes down',
        composition: 'PANEL D',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A girl walks the end of the long bar around the press, turning the screw down onto the stack of baskets.',
    },
    {
      text: 'Round and down. Round and down.\n\nThe stack squashed flatter and flatter. Her arms ached. She kept walking.\n\nThen a fat green-gold drop crept out from between two baskets. It hung there. It fell.\n\nThen another. Then a bright thin thread of oil, running down the stone channel.',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p7',
        focus: 'the first drop of oil creeping from between two flattened baskets',
        composition: 'A close low view of the bottom of a squashed stack of flat woven baskets. Green-gold oil seeps from the seam between two of them and one fat drop hangs above a shallow carved stone channel. The girl kneels on the stone floor nearby and looks at the drop',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'Green-gold oil seeps from between two flattened baskets and a drop hangs above a stone channel.',
    },
    {
      text: 'That night they lit the lamp.\n\nThe little flame stood up straight and yellow, and the whole room went warm.\n\n“You pressed that,” said Grandfather.\n\nThe girl looked at her hands. They were not any bigger than yesterday.\n\n“Can I do it again tomorrow?” she said.',
      cue: 'Next time something is too heavy or too stiff, ask him: is there a way to go the long way round?',
      scene: {
        id: 'the-screw-that-squeezed-the-olives-p8',
        focus: 'the lit clay lamp on the table at night and the girl looking at her own hands',
        composition: 'Evening. A small clay oil lamp burns with a steady yellow flame on a low wooden table, casting warm amber light across the girl\'s face and the wall behind. The girl sits looking down at her own open hands in her lap. Her grandfather sits across from her',
        palette: 'olive green, honey wood, terracotta, warm stone grey, and lamplight gold',
      },
      alt: 'A clay lamp burns on a table at night while a girl sits looking down at her own open hands.',
    },
  ],
};

export default theScrewThatSqueezedTheOlives;
