import type { Book } from '../types';

/**
 * C. V. Raman and the colour of the sea. Documented spine:
 * - 1921: sailing home from England through the Mediterranean, Raman viewed
 *   the sea through a Nicol prism set to quench the skylight reflected from
 *   the surface; the sea stayed blue. Lord Rayleigh (1910) had held that the
 *   deep sea's blue is simply the sky seen by reflection. Raman reported the
 *   test in Nature 108, 367 (1921).
 * - Calcutta, Indian Association for the Cultivation of Science (Bowbazar
 *   Street): sunlight through dust-free water shows a blue track. Raman's 1922
 *   paper argued that molecular scattering in water makes the deep sea blue.
 * - 1928: Raman and K. S. Krishnan find that a tiny part of scattered light
 *   changes colour (the Raman effect; Nobel Prize in Physics 1930). It is a
 *   separate discovery and not the cause of the sea's colour.
 * - Pages 10-11 are today's explanation, labelled in the text and drawn as
 *   modern diagrams: absorption of red light by water, scattering back up.
 *   Page 12 adds reflection at the surface and returns to the 1921 ship.
 * No quotations are put in anyone's mouth.
 */
export const book: Book = {
  slug: 'raman-and-the-blue-sea',
  title: 'Raman and the Blue Sea',
  shelf: 'people',
  hook: 'Raman blocked the sky’s shine. The sea stayed blue.',
  setting:
    'First, 1921: the open wooden deck of a steamship on the deep blue Mediterranean Sea, white rails, three tall funnels, bright midday sun. Then, the 1920s: a physics laboratory in Calcutta with whitewashed walls, tall arched windows with green wooden shutters, wooden benches, brass stands and glass flasks.',
  characterLine:
    'C. V. Raman: a slim, clean-shaven Indian man with a round face and keen dark eyes, in a cream-white turban and a dark, high-collared buttoned coat; K. S. Krishnan: a slim, clean-shaven young Indian man with short black hair, in a white shirt; students: young Indian men in white shirts.',
  readMinutes: 5,
  pages: [
    {
      text: 'In 1921, C. V. Raman was sailing home to India from England. He was a scientist in Calcutta who studied light. On the Mediterranean Sea, he gazed down at the deep blue water.',
      zone: 'top',
      art: 'Wide view along the wooden deck of a steamship at sea in bright midday sun: Raman stands alone at the white rail, both hands on it, leaning forward and gazing down at the water with a serious, curious face. Below the ship the sea is a deep, rich blue all the way to the horizon, with small white wave crests. The ship’s three tall funnels rise behind him. The top third is open, pale, cloudless sky.',
      alt: 'C. V. Raman stands at the rail of a steamship, gazing down at the deep blue Mediterranean Sea.',
    },
    {
      text: 'Raman wondered why the sea was so blue. Lord Rayleigh, a famous English scientist, had explained the blue sky. Rayleigh had said the deep sea simply mirrored the sky. Raman wanted to check.',
      zone: 'right',
      art: 'Low camera on the deck, looking past Raman at the rail: he tips his head back to look up at the sky, one hand raised a little, as if weighing the sky against the sea. The sky above is a pale, washed-out blue; the sea below is a much deeper, darker blue. Near the ship, a bright silvery sheen of mirrored sky lies on the water. The right third is plain open sea and pale sky, calm and empty.',
      alt: 'Raman looks from the pale sky to the much deeper blue sea, with a shine of mirrored sky on the water.',
    },
    {
      text: 'Raman had brought a Nicol prism, a clear crystal in a little tube. He looked down at the sea through it. Slowly, he turned the tube, watching the shine of sky on the water.',
      zone: 'left',
      art: 'Close view from the side at the rail: Raman holds a short brass tube with a clear crystal in its end up to one eye and looks down at the water at a slant, his fingers turning the tube. Below him, a bright silvery sheen of mirrored sky lies across the deep blue water. The left third is plain open blue sea, calm and empty.',
      alt: 'Raman holds a small prism in a brass tube to his eye and looks down at the sea through it.',
    },
    {
      text: 'The shine faded. The sea stayed blue.',
      zone: 'top',
      big: true,
      art: 'Looking over Raman’s shoulder and through the end of his brass prism tube, down at a slant into the sea: no shine of sky lies on the water at all, only a deep, glowing, saturated blue going down and down, with a few small wave crests near the bottom. Raman’s turban and cheek show at the bottom corner. The top half is the same smooth, deep blue water, calm and even.',
      alt: 'Seen through the prism, the sea has no shine of sky on it and is still a deep blue.',
    },
    {
      text: 'So the mirrored sky could not be the whole answer. Raman reasoned that much of the blue came from the water itself. On board, he wrote a short letter to a science magazine called Nature.',
      zone: 'top',
      art: 'Medium view on the deck: Raman sits at a small folding table in the shade of a canvas awning, writing on a sheet of paper with a fountain pen, his brow drawn in thought; the brass prism tube lies on the table beside the paper. The writing is too small to read. Behind him, past the white rail, the deep blue sea stretches away. The top third is the plain, pale canvas of the awning.',
      alt: 'On the ship’s deck, Raman sits at a small table writing his letter to Nature, the prism beside him.',
    },
    {
      text: 'Back in Calcutta, Raman wanted to watch a sunbeam inside water. But ordinary water is full of tiny specks of dust. In a sunbeam, each speck sparkles. The sparkles would hide any faint glow from the water itself.',
      zone: 'left',
      art: 'The Calcutta laboratory, medium view: Raman stands at a wooden bench and holds up a round glass flask of ordinary water in a narrow beam of sunlight that slants in through a gap in the green shutters of a tall arched window. Inside the flask, the beam is crowded with bright sparkling specks of dust, like tiny stars. Two of his students lean in to look. The left third is a plain whitewashed wall in shadow.',
      alt: 'In his Calcutta laboratory, Raman holds a flask of water in a sunbeam and dust specks sparkle inside it.',
    },
    {
      text: 'So Raman used distilled water: water turned into steam, then cooled back into water. The dust stayed behind. In this clean water, the sunbeam made no sparkles. Its path glowed a soft, clear blue.',
      zone: 'right',
      art: 'The Calcutta laboratory with the green shutters closed, so the room is dim: one narrow beam of sunlight comes in through a small gap and passes through a round glass flask of perfectly clear water on a brass stand. Inside the flask the path of the beam glows a soft, clear blue, with no sparkling specks at all. Raman bends close and looks at the flask from the side, intent; a student beside him holds the shutter. Behind them on the bench stands a glass distilling set: a first flask over a small burner with a wisp of steam inside it and a faint grey film of dust left at its bottom, a long glass tube, and a second flask where clean water collects. The right third is a plain dim whitewashed wall.',
      alt: 'In a dim laboratory, a sunbeam passes through a flask of very clean water and its path glows soft blue.',
    },
    {
      text: 'Water is made of molecules, far too small to see. Raman argued that the molecules scatter light every which way, blue light most. He thought this was the main cause of the sea’s blue.',
      zone: 'bottom',
      art: 'Medium view at the laboratory bench: Raman stands beside the glass flask with its glowing soft blue beam, one hand pointing at the beam, explaining earnestly; two students listen closely, one with a notebook open. Pale blue light from the flask spreads gently outward on every side onto their faces and the bench. The notebook pages show only faint grey lines, nothing readable. The bottom third is the plain, smooth wooden top of the bench.',
      alt: 'Raman points at the blue beam in the flask of water and explains to two listening students.',
    },
    {
      text: 'In 1928, Raman and K. S. Krishnan found something new. When liquids scattered light, a tiny part of the light changed colour. This is the Raman effect. In 1930, Raman won the Nobel Prize in Physics for this work.',
      zone: 'right',
      art: 'The same Calcutta laboratory, a few years on: a large round lens on a brass stand focuses a sunbeam into a glass bulb of clear liquid. Krishnan crouches beside the bulb and holds a small square of yellow-green glass up to his eye, peering through it at the bulb; Raman leans over his shoulder, eyes wide, both of them intent and excited. A square of blue-violet glass stands in the path of the sunbeam before the bulb, so the beam’s path inside the bulb glows blue-violet; the one part of the path seen through Krishnan’s square of yellow-green glass shows a faint yellow-green glow. The right third is the plain whitewashed wall, calm and empty.',
      alt: 'Raman and K. S. Krishnan study light in a bulb of clear liquid through small squares of coloured glass.',
    },
    {
      text: 'The Raman effect is not why the sea is blue. Here is today’s explanation. Sunlight is a mix of colours. Water absorbs, or soaks up, red light first, then orange and yellow.',
      zone: 'left',
      art: 'A modern science diagram in clean flat colours, plainly a diagram and not a scene: a side cut-away of deep sea water, pale blue at the top shading to dark blue at the bottom, under a flat surface line. Five thin coloured rays, red, orange, yellow, green and blue, come straight down together from a small sun at the top right and enter the water in the right two-thirds of the picture. The red ray stops just under the surface, the orange a little deeper, the yellow deeper still, the green deeper again, and only the blue ray reaches far down. The left third holds only plain empty sky above the surface line and plain water below it, shading smoothly from pale to dark blue, with no rays in it.',
      alt: 'A modern diagram: red, orange, yellow, green and blue rays enter the sea; the red stops first and the blue goes deepest.',
    },
    {
      text: 'Deep down, mostly blue light is left. Water molecules scatter it every which way, as in Raman’s flask. Some of it travels back up, out of the sea, to our eyes.',
      zone: 'bottom',
      art: 'A modern science diagram in clean flat colours: a side cut-away of deep blue sea. A white sunbeam comes down into the water and turns blue as it goes deeper, fading out before the bottom third. In the middle depth of the water, a circle shows a magnified close-up of many tiny round water molecules, with short blue arrows bouncing off them in every direction; one long blue arrow travels back up, out through the surface, to the eye of a small person standing at the rail of a ship on the right. In the top left corner, a small rounded inset shows Raman’s round glass flask from page 7, its beam glowing the same soft blue. The bottom third is plain, even dark blue water with nothing in it.',
      alt: 'A modern diagram: blue light scatters off water molecules deep in the sea and travels back up to a person on a ship.',
    },
    {
      text: 'Mirrored sky gives the sea some of its blue. The rest comes from inside the water: red soaked up, blue scattered back. In 1921, Raman’s prism had taken away the mirrored sky. The blue that stayed was the water’s own.',
      zone: 'top',
      art: 'View from above and just behind Raman at the stern rail of the three-funnelled steamship, crossing the deep blue Mediterranean Sea in afternoon sun: he looks down into the water, the brass prism tube held clearly in one hand, and beyond him the ship leaves a long white wake. Near the ship a soft silvery shine of sky lies on the water; everywhere else the sea glows a deep, clear blue. The top third is open, pale, cloudless sky.',
      alt: 'Raman stands at the rail of the steamship as it crosses the deep blue Mediterranean Sea.',
    },
  ],
  tryThis: {
    title: 'Take the sky off the water',
    steps: [
      'On a sunny day, go with a grown-up to a pool, a pond or a big puddle.',
      'Wear polarised sunglasses and look at the shiny water a few steps away, not straight down.',
      'Tilt your head far to one side, then straighten it. Watch the sky’s shine come back, then fade.',
      'At home, a grown-up fills a white bathtub deep with water. Look straight down into it.',
      'Now look down into a glass of the same water. Which one looks a little blue-green?',
    ],
    safety:
      'A grown-up stays within arm’s reach at any water, even a bathtub, and empties the tub straight afterwards. Never look at the sun, with or without sunglasses.',
  },
  note: {
    what:
      'A true account of C. V. Raman’s 1921 test of the sea’s blue on the voyage home, and his Calcutta experiments with light in very clean water, followed by today’s explanation of sea colour. Pages 10 and 11 are modern diagrams and are drawn and worded as such.',
    expect:
      'Five-year-olds follow the prism trick well: the shine goes away and the blue stays. Many will mix up the Raman effect with the sea’s blue; page 10 says plainly that they are separate. “Soaks up red” stays abstract until he has looked into a deep white bathtub of water himself. The book does not explain how the prism removes the shine (polarisation); he takes it as a tool that does, which is enough at five.',
    practising:
      'Testing an explanation by removing one possible cause and seeing whether the effect remains. And the deep sea’s colour as three parts: skylight reflected at the surface, red light absorbed by the water, and blue light scattered back out.',
    ask: 'On page 4: “If the blue were only the mirrored sky, what would Raman have seen when the shine went away?”',
    next:
      'Do the sunglasses test at a pool or pond: polarised lenses cut the reflected glare much as Raman’s Nicol prism did. Then compare a deep white bathtub of water with a glass of the same water.',
    honest:
      'Documented: the 1921 voyage home, the Nicol prism test on board, the letter to Nature, the dust-free water experiments, and the 1928 discovery with Krishnan, for which Raman alone received the 1930 Nobel Prize. The students, the scenes on deck and in the laboratory, and who held what are illustrative; no one’s words are quoted. Raman’s 1922 paper gave molecular scattering the main role; today, absorption of red light by water is seen as the main reason the light is blue, with scattering returning it. Coastal seas also take colour from algae and silt. The Raman effect does not colour the sea.',
    easier:
      'Read pages 1 to 5 only, which tell the whole prism test, then do the sunglasses test.',
    harder:
      'Ask why a glass of water looks clear but a deep white bathtub looks blue-green (the light travels through much more water). Then ask why a muddy river or a green coastal sea is a different colour.',
    safety:
      'Water play only with a grown-up within arm’s reach. Never look at the sun, even through sunglasses or a filter.',
  },
  sources: [
    'Lord Rayleigh, “Colours of Sea and Sky”, Nature 83, 48–50 (1910)',
    'C. V. Raman, “The Colour of the Sea”, Nature 108, 367 (1921)',
    'C. V. Raman, “On the Molecular Scattering of Light in Water and the Colour of the Sea”, Proceedings of the Royal Society A 101, 64–80 (1922)',
    'C. V. Raman and K. S. Krishnan, “A New Type of Secondary Radiation”, Nature 121, 501–502 (1928)',
    'The Nobel Prize in Physics 1930, Sir Chandrasekhara Venkata Raman, nobelprize.org',
    'C. L. Braun and S. N. Smirnov, “Why Is Water Blue?”, Journal of Chemical Education 70, 612 (1993)',
  ],
};
