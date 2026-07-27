import type { Story } from '../types';

export const theStarBrightnessLadder: Story = {
  slug: 'the-star-brightness-ladder',
  title: 'The Star-Brightness Ladder',
  subtitle: 'Long ago on Rhodes, the astronomer Hipparchus sorted stars from bright to faint.',
  domain: 'sky',
  collection: 'historical',
  repeatedPhrase: 'Bright, soft, faint—find its place',
  readAloudMinutes: 9,
  learningTakeaway:
    'You can compare lights in the sky and sort them into steps from bright to faint. Hipparchus did this with patient eyes, and astronomers still use his word, magnitude, today.',
  heartTakeaway:
    'A careful idea, written down and shared, can travel across many lifetimes and help people you will never meet.',
  grownUpFact:
    'This is a warm retelling of real history. Hipparchus was a Greek astronomer who worked on the island of Rhodes around 130 BCE, in the Hellenistic age. He is remembered for one of the earliest star catalogs and for sorting the naked-eye stars by brightness into six classes, from first (brightest) to sixth (faintest). Some three centuries later Ptolemy preserved and extended this catalog of about a thousand stars in his Almagest, which is how much of Hipparchus’s work survives. In 1856 Norman Pogson turned the old six-step ladder into a precise number scale, defining a difference of five magnitudes as exactly a hundredfold change in brightness. Astronomers still say magnitude every night, though now they measure it with instruments rather than the unaided eye.',
  pages: [
    {
      text: 'Long, long ago, on the sunny island of Rhodes, a man named Hipparchus loved the night sky. He was a real astronomer, which means a star-watcher. Each evening he climbed to a quiet rooftop above the sea. He watched the sky turn slowly over the calm harbor. Some stars blazed like tiny lanterns. Some gave only a gentle glow. Others were pale, faraway pinpricks of light. “The stars are asking to be sorted,” he said softly.',
      cue: 'Look up with Hipparchus. Can you find one bright star and one faint star tonight?',
      scene: {
        id: 'the-star-brightness-ladder-p1-rooftop-invitation',
        focus: 'the astronomer Hipparchus watching the star-filled sky from a quiet rooftop on Rhodes',
        composition:
          'Foreground: a low stone rooftop wall with a wax tablet and a small lamp; midground: Hipparchus standing and gazing upward; background: the Rhodes harbor, a lighthouse, and a sky of bright and faint stars',
        palette: 'deep Aegean blue and soft starlight with warm lamp amber',
      },
      alt: 'A robed astronomer stands on a seaside rooftop, gazing up at a sky full of bright and faint stars over a calm harbor.',
    },
    {
      text: 'In those days, no one had a telescope or a photograph. There were no numbers written beside the stars at all. If Hipparchus wanted to remember a star, he had to hold it in his eyes and his mind. That felt like trying to catch the whole sky in two hands. So he chose a plan. He would not name every glow at once. Instead he would sort them, gently, into steps.',
      scene: {
        id: 'the-star-brightness-ladder-p2-no-tools',
        focus: 'Hipparchus realizing he must sort the stars using only his patient eyes and memory',
        composition:
          'Foreground: an empty wax tablet and a stylus in the astronomer’s hand; midground: Hipparchus looking up thoughtfully; background: a vast crowded star field with no labels, above the dark harbor',
        palette: 'inky blue-black with scattered white and gold star points',
      },
      alt: 'An astronomer holds a blank tablet beneath a huge unlabeled sky, thinking about how to sort so many stars.',
    },
    {
      text: 'First he imagined just three simple groups in his mind. Bright stars would sit at the top of a ladder. Soft, middle stars would rest in between. The faintest stars would wait at the very bottom. “Bright, soft, faint—find its place,” he whispered to the sky. Later he split those steps even finer, into six. The very brightest he called the first. The faintest his eyes could catch became the sixth.',
      scene: {
        id: 'the-star-brightness-ladder-p3-six-steps',
        focus: 'Hipparchus picturing a ladder of six brightness steps from first to sixth',
        composition:
          'Foreground: a wax tablet showing a stepped ladder of glowing dots, large and few at top, tiny and many below; midground: Hipparchus counting steps on his fingers; background: the darkening evening sky over the lighthouse',
        palette: 'warm ochre lamplight with white, gold, and lavender star glows',
      },
      alt: 'A tablet shows a ladder of star dots in six steps, brightest at the top and faintest at the bottom, beside the astronomer.',
    },
    {
      text: 'Now came the patient work of looking. He compared each star with the ones near it. One glowed more than a star below it, yet less than a star above. That star belonged in the middle, and there it went. Another barely glimmered, so it joined the quiet faint group. He did not hurry. He looked, and waited, and looked once more. His ladder grew slowly, one careful comparison at a time.',
      scene: {
        id: 'the-star-brightness-ladder-p4-comparing',
        focus: 'Hipparchus comparing one medium star against a brighter and a fainter neighbor',
        composition:
          'Foreground: three star glows of different sizes in a gentle row; midground: the astronomer marking a small dot on his tablet; background: the harbor growing dim below the rooftop',
        palette: 'muted amber, pearl, and dusky violet',
      },
      alt: 'The astronomer studies three stars of different brightness side by side and marks one into the middle step.',
    },
    {
      text: 'Then Hipparchus found two stars that looked almost exactly alike. He looked from one to the other, then back again. Which was a tiny bit brighter? It was truly hard to tell. “What if I choose the wrong step?” he wondered aloud. But he did not stay worried for long. Two close stars, he decided, were simply an invitation to look longer. So he took a slow, calm breath and kept watching.',
      cue: 'Find two lights that look nearly the same. Which one seems a little brighter to you?',
      scene: {
        id: 'the-star-brightness-ladder-p5-close-choice',
        focus: 'two nearly matching stars that puzzle the patient astronomer',
        composition:
          'Foreground: two star glows of almost equal size, one just slightly larger; midground: Hipparchus pausing thoughtfully with his tablet; background: an unfinished ladder of star dots and a violet sea',
        palette: 'lantern amber against plum and deep harbor blue',
      },
      alt: 'An astronomer pauses over two nearly matching stars, trying to see which one glows a little brighter.',
    },
    {
      text: 'He watched the two close stars for a long, quiet while. At last one seemed a whisper brighter than the other. Yet both were still much the same to his eyes. “Bright, soft, faint—find its place,” he said gently. He set both stars into the same step, side by side. A broad group did not need every star to match. His shoulders loosened, and a small, happy smile appeared.',
      scene: {
        id: 'the-star-brightness-ladder-p6-shared-group',
        focus: 'the two close stars resting together in the same brightness step',
        composition:
          'Foreground: two similar star glows drawn together within one gentle band; midground: Hipparchus relaxing, tablet in hand; background: the finished top and bottom steps and the first bright stars',
        palette: 'soft gold and lavender under a deep blue sky',
      },
      alt: 'Two similar stars rest together in one step as the astronomer relaxes with a small smile.',
    },
    {
      text: 'Night after night, the whole sky filled his tablet with steps. He did more than sort brightness, too. He wrote down where each star sat, like an address in the sky. Together these notes became a catalog, a careful list of the stars. It held close to a thousand of them, each in its place. No one had ever made such a full map of the night before. His patient looking had become a book of light.',
      scene: {
        id: 'the-star-brightness-ladder-p7-catalog',
        focus: 'Hipparchus building a written star catalog listing brightness and position',
        composition:
          'Foreground: a scroll and stacked wax tablets covered in neat rows of star marks and steps; midground: Hipparchus writing steadily by lamplight; background: the full turning sky mirrored above the lighthouse',
        palette: 'warm parchment amber with deep night blue and pale starlight',
      },
      alt: 'An astronomer writes rows of stars and their brightness steps onto tablets and a scroll by lamplight beneath the night sky.',
    },
    {
      text: 'But why did some stars look bright and others faint? Hipparchus could not fully know. Today we can share the secret with you. A few stars look faint only because they are very, very far away. Others glow softly because they truly are smaller, cooler suns. So brightness in the sky mixes two things: how far, and how mighty. Our own Sun is a star as well, just close enough to fill the whole day.',
      cue: 'Wonder together: is a faraway giant faint, or a nearby small star? Both can look the same!',
      scene: {
        id: 'the-star-brightness-ladder-p8-why-bright',
        focus: 'the idea that a star’s apparent brightness depends on both distance and true power',
        composition:
          'Foreground: two stars shown side by side, one large and far, one small and near, glowing alike; midground: a soft golden Sun low over the horizon; background: the wide star field of the deep sky',
        palette: 'golden sun-amber blending into cool star-blue and violet',
      },
      alt: 'A picture compares a big faraway star and a small nearby star that glow the same, with the Sun glowing near the horizon.',
    },
    {
      text: 'The years passed, and Hipparchus grew old. Yet his ladder did not fade away. Long after, an astronomer named Ptolemy found the catalog and treasured it. He copied it, added to it, and set it in a great book. Because Ptolemy kept those steps safe, they crossed the centuries to us. “Bright, soft, faint—find its place,” star-watchers still whispered, in new lands and new tongues, under the same turning sky.',
      scene: {
        id: 'the-star-brightness-ladder-p9-ptolemy',
        focus: 'Ptolemy preserving and extending Hipparchus’s star catalog centuries later',
        composition:
          'Foreground: an open bound book copying rows of star steps from an older worn scroll; midground: Ptolemy studying by lamplight; background: a different city skyline under the same familiar constellations',
        palette: 'aged-paper gold, ink brown, and quiet midnight blue',
      },
      alt: 'A later astronomer copies the old star list into a great book, carrying the brightness steps forward under the same stars.',
    },
    {
      text: 'Much, much later, another watcher wished the steps could be exact. His name was Norman Pogson, and he liked tidy numbers. He turned the old ladder into a rule anyone could use. Climb five steps up the ladder, he said, and a star grows a hundred times brighter. Now the word for a star’s brightness had a true measure. The old name stayed, though. Astronomers still call it the star’s magnitude.',
      scene: {
        id: 'the-star-brightness-ladder-p10-pogson',
        focus: 'Norman Pogson turning the six-step ladder into a precise number scale',
        composition:
          'Foreground: a neat ruled chart with a ladder of numbers beside matching star glows; midground: a scholar with a telescope and notebook; background: a starry observatory dome under a clear night',
        palette: 'lamp-gold, chalk-white, and deep telescope-blue',
      },
      alt: 'A scholar beside a telescope draws a numbered brightness ladder, matching each star glow to an exact magnitude.',
    },
    {
      text: 'So every clear night, you can play the very same game. Wait until your eyes settle softly into the dark. Pick two stars, then ask which one shines a little more. Name the bright one, the soft one, and the faint one you can barely see. “Bright, soft, faint—find its place,” you can whisper too. You are sorting light exactly as Hipparchus once did, long ago on Rhodes.',
      cue: 'Try it: point to a bright star, a soft star, and the faintest star you can find.',
      scene: {
        id: 'the-star-brightness-ladder-p11-you-try',
        focus: 'a child sorting real stars into bright, soft, and faint, echoing Hipparchus',
        composition:
          'Foreground: a child on a rooftop or hill pointing up at three stars of different brightness; midground: a grown-up beside them looking along the pointing arm; background: a wide, softly glowing night sky above rooftops',
        palette: 'warm nightlight amber against calm deep-blue sky and pearl stars',
      },
      alt: 'A child points up at a bright, a soft, and a faint star while a grown-up looks along, sorting the sky together.',
    },
    {
      text: 'And so one patient idea still shines, thousands of years on. The stars Hipparchus sorted are the very stars above you now. His careful steps grew into a rule the whole world shares. From two quiet eyes on Rhodes to telescopes everywhere, the ladder held. Tonight the sky turns gently, bright to faint, as it always has. Rest easy under it, little star-watcher. Its calm light has been waiting just for you.',
      scene: {
        id: 'the-star-brightness-ladder-p12-legacy-rest',
        focus: 'the enduring legacy of the brightness ladder over a peaceful present-day night',
        composition:
          'Foreground: a cozy windowsill or blanket edge framing the view outward; midground: the same bright-to-faint stars glowing softly; background: the wide turning night sky linking ancient Rhodes to now',
        palette: 'deep restful navy, low pearl starlight, and a soft warm glow',
      },
      alt: 'The same bright-to-faint stars glow softly over a calm night, linking ancient Rhodes to a quiet present-day sky.',
    },
  ],
};
