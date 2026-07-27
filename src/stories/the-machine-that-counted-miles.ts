import type { Story } from '../types';

export const theMachineThatCountedMiles: Story = {
  slug: 'the-machine-that-counted-miles',
  title: 'The Machine That Counted Miles',
  subtitle: 'Long ago, the Roman engineer Vitruvius described a cart that dropped a pebble for every mile.',
  domain: 'simple-machines',
  collection: 'historical',
  repeatedPhrase: 'Turn, click, pebble, count',
  readAloudMinutes: 9,
  learningTakeaway:
    'A wheel makes the very same turn again and again. If gears count those turns and drop one pebble every mile, you can count the pebbles to know how far a cart has rolled. This is how the very first odometers worked.',
  heartTakeaway:
    'A hard question does not need a hurried guess. Watch closely, set things straight, and try again slowly. A patient count can turn a puzzle into a clear, true answer.',
  grownUpFact:
    'Vitruvius was a Roman architect and engineer of the first century BCE who wrote a ten-book work, De architectura (On Architecture), around the 20s BCE. In Book 10 he described a carriage odometer, or hodometer. A road wheel about four Roman feet across turned roughly four hundred times in one Roman mile. Linked toothed discs (gears) counted those turns; each full wheel-turn advanced a disc one notch. After enough turns for one mile, a hole lined up and a single small stone dropped through it into a bronze box below. Travelers simply counted the fallen stones to count the miles. A Roman mile (mille passus, a thousand paces) was about 1,480 meters. The engineer Hero of Alexandria described a similar geared counter, and the same idea lives on in the odometer inside every car today. The cart in this tale is imagined gently for young listeners, but the real machine truly used geared discs and dropping stones.',
  pages: [
    {
      text: 'Long ago in the lands of Rome lived a careful engineer named Vitruvius. By lamplight he wrote ten quiet books about how the world is built. Roads, bridges, water pipes, and machines filled his pages. In one book he pictured something wonderful: a cart that could count. This warm tale imagines that clever cart, slow and true.',
      cue: 'Picture an engineer writing by a soft lamp. Can you turn one hand slowly, like a little wheel?',
      scene: {
        id: 'the-machine-that-counted-miles-p1-intro',
        focus: 'the Roman engineer Vitruvius beside an imagined counting cart',
        composition:
          'Foreground: a red wooden wheel and a small covered bronze box; midground: Vitruvius kneeling with a wax tablet and a bowl of smooth pebbles; background: a calm Roman courtyard with columns and the first evening lamps',
        palette: 'sunset ochre, sea green, wax gold, and terracotta',
      },
      alt: 'The Roman engineer Vitruvius kneels beside a small counting cart with a bowl of pebbles.',
    },
    {
      text: 'People had always wanted to know one simple thing. How far did we walk today? How far to the next town? Counting steps was tiring, and everyone lost their place. Vitruvius tapped his chin and smiled a slow smile. What if a machine could remember the road, so no one had to?',
      cue: 'Try counting your steps across the room. Was it easy to remember, or did the number slip away?',
      scene: {
        id: 'the-machine-that-counted-miles-p2-question',
        focus: 'the big question of measuring a long road',
        composition:
          'Foreground: sandaled feet on a long paved Roman road with milestones; midground: Vitruvius thinking, one hand on his chin; background: distant hills, olive trees, and a soft golden sky',
        palette: 'dusty gold, road gray, olive green, and warm amber',
      },
      alt: 'A long Roman road with milestones stretches into hills as Vitruvius thinks about measuring it.',
    },
    {
      text: 'His answer was the wheel. A wheel is a magical, patient thing. It makes the very same turn, again and again, without ever growing tired. Roll a wheel once, and its red mark goes down, around, and home. Every turn is exactly as long as the one before. A wheel never forgets its shape.',
      scene: {
        id: 'the-machine-that-counted-miles-p3-wheel',
        focus: 'the red mark on the wheel tracing one identical turn',
        composition:
          'Foreground: the red wheel with a bright starting mark and a dotted arc showing its path; midground: Vitruvius rolling it slowly along a tile; background: ruled courtyard pavement and quiet closed doors',
        palette: 'warm clay, cartwheel red, pebble gray, and dusk blue',
      },
      alt: 'A red wheel rolls one full turn as a dotted arc shows its identical, repeating path.',
    },
    {
      text: 'He rolled the cart along one pale stone tile. The wheel went all the way around, one full turn. Click! One smooth pebble dropped into the box. "Turn, click, pebble, count," he said softly to himself. He lifted the lid and found exactly one pebble waiting inside.',
      cue: 'Trace one slow circle in the air. Can you make one soft click when your finger comes home?',
      scene: {
        id: 'the-machine-that-counted-miles-p4-oneturn',
        focus: 'one pebble dropping as the wheel completes a single turn',
        composition:
          'Foreground: the red wheel at its starting mark and a single falling pebble; midground: Vitruvius guiding the cart slowly across one tile; background: ruled courtyard pavement and quiet closed doors',
        palette: 'warm clay, cartwheel red, pebble gray, and dusk blue',
      },
      alt: 'One pebble drops into a small box as a red wheel finishes one full turn.',
    },
    {
      text: 'But how did one turn drop just one pebble? Inside the cart hid a secret helper: a little wheel with teeth, called a gear. Each time the big wheel turned once, a single tooth nudged the gear one notch onward. The gear counted quietly in the dark, tooth by tooth, turn by turn.',
      cue: 'Hook your two hands together and turn them. Can you feel how one turn pushes the next along?',
      scene: {
        id: 'the-machine-that-counted-miles-p5-gears',
        focus: 'a cutaway of the hidden toothed gears counting each wheel turn',
        composition:
          'Foreground: a bronze toothed gear with one tooth catching, next to a larger notched disc; midground: the big road wheel connected by a peg; background: soft lamp glow inside the wooden cart',
        palette: 'bronze gold, walnut brown, shadow umber, and lamp amber',
      },
      alt: 'A cutaway shows a small toothed gear advancing a larger notched disc inside the cart.',
    },
    {
      text: 'When the gear had counted enough turns for one whole mile, something clever happened. A little hole in the top disc lined up with a hole below it. Down through both holes rolled a single stone into the bronze box. One dropped stone meant one full mile traveled. The machine had turned distance into a sound.',
      scene: {
        id: 'the-machine-that-counted-miles-p6-drop',
        focus: 'two holes aligning so a single stone drops for one mile',
        composition:
          'Foreground: two round discs with holes lining up as one stone falls through; midground: the open bronze box catching the stone; background: the cart wheel mid-turn on a long road tile',
        palette: 'honey gold, cool bronze, limestone cream, and evening violet',
      },
      alt: 'Two holes in stacked discs line up and a single stone drops into a bronze box for one mile.',
    },
    {
      text: 'Vitruvius knew the true count for one Roman mile. His road wheel had to turn about four hundred times. Four hundred turns, then one small pebble, patient and sure. That is a great many turns for a single click. The cart counted them all so the tired traveler never had to.',
      cue: 'Can you count to ten, then imagine counting to four hundred? That is one pebble, one mile!',
      scene: {
        id: 'the-machine-that-counted-miles-p7-fourhundred',
        focus: 'the idea of four hundred wheel turns making one mile',
        composition:
          'Foreground: many faint arrows circling the wheel to suggest four hundred turns; midground: one lone pebble poised above the box; background: a milestone carved with a Roman numeral by the road',
        palette: 'warm ochre, faded rose, stone gray, and golden dusk',
      },
      alt: 'Many circling arrows around the wheel suggest four hundred turns before one pebble drops.',
    },
    {
      text: 'One evening the box leaned against a chipped tile. The wheel turned, yet no pebble fell. Vitruvius looked at the empty tray and paused. He did not scold the little cart. He lifted it, set its box level again, and returned the red wheel mark to the start.',
      scene: {
        id: 'the-machine-that-counted-miles-p8-reset',
        focus: 'the tilted counting box being set level again on smooth stone',
        composition:
          'Foreground: an empty pebble tray and the chipped edge of one tile; midground: Vitruvius leveling the cart with steady hands; background: a quiet doorway and one soft amber lamp',
        palette: 'muted rust, cool stone, soft gray, and lamp amber',
      },
      alt: 'A tilted counting box is gently set level again on smooth pavement.',
    },
    {
      text: 'He tried once more, slower this time. The red mark traveled down, around, and home. Click! A pebble landed. Another turn brought another pebble. "Turn, click, pebble, count," he whispered. He checked the wheel, then the gear, then the box, in the same gentle order.',
      cue: 'Tap four fingertips slowly. How many taps did you hear when each tap happened only once?',
      scene: {
        id: 'the-machine-that-counted-miles-p9-retry',
        focus: 'the builder checking wheel, gear, and box in a calm sequence',
        composition:
          'Foreground: the level counting box and two newly dropped pebbles; midground: Vitruvius following the red wheel mark with one finger; background: the wax tablet on a low bench and a rising moon',
        palette: 'deep teal, wax-tablet gold, pebble silver, and moon cream',
      },
      alt: 'The builder calmly checks the wheel, the gear, and the box in order.',
    },
    {
      text: 'Across the long road, the little cart clicked again and again. Pebbles chimed softly, one for every mile behind them. At day\'s end he poured them out and counted the neat pile. Each stone was a mile his own feet never had to remember. The wheel had turned the same way, over and over, into a count he could hold.',
      scene: {
        id: 'the-machine-that-counted-miles-p10-count',
        focus: 'a pile of pebbles counted at the end of a journey',
        composition:
          'Foreground: a neat pile of counted pebbles beside tally marks on wax; midground: Vitruvius comparing pebbles to marks and parking the cart; background: a long straight band of road tiles and a quiet moonlit colonnade',
        palette: 'indigo, walnut, pale limestone, and quiet amber',
      },
      alt: 'A pile of counted pebbles sits beside matching tally marks after a long journey.',
    },
    {
      text: 'Vitruvius was not the only mind to dream of counting wheels. Far away, a thinker named Hero built a geared counter of his own. Their idea rolled on for hundreds and hundreds of years. It never truly stopped turning, from that day all the way to now.',
      scene: {
        id: 'the-machine-that-counted-miles-p11-legacy',
        focus: 'the counting idea traveling forward through time',
        composition:
          'Foreground: the Roman counting cart on the left; midground: faint sketches of later measuring wheels and gears; background: a warm timeline glow arcing across the sky',
        palette: 'aged parchment, bronze gold, twilight blue, and soft amber',
      },
      alt: 'The Roman cart sits beside faint sketches of later gears and measuring wheels along a glowing arc.',
    },
    {
      text: 'You can find that very idea riding inside cars today. A little dial or a bright number counts every mile the wheels roll by. It is Vitruvius\'s dream, still turning, still counting, still true. So next time a wheel goes round, whisper the old builder\'s song. "Turn, click, pebble, count," and picture every mile clicking home.',
      cue: 'Find a wheel near you and roll it once. Where might that turn be secretly counted?',
      scene: {
        id: 'the-machine-that-counted-miles-p12-today',
        focus: 'the ancient counting idea alive in a modern car odometer',
        composition:
          'Foreground: a glowing car odometer showing rolling numbers; midground: a child watching a wheel spin, wondering; background: a soft blend of Roman columns fading into a modern road at dusk',
        palette: 'dashboard glow, night blue, warm ochre, and gentle amber',
      },
      alt: 'A car odometer counts miles while a wondering child watches a wheel spin, Roman columns fading behind.',
    },
  ],
};
