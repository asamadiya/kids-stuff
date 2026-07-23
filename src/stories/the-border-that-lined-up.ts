import type { Story } from '../types';

export const theBorderThatLinedUp: Story = {
  slug: 'the-border-that-lined-up',
  title: 'The Border That Lined Up',
  subtitle: 'In Phidias’s Athens workshop, real carvers repeat a leaf-and-lotus border.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'Leaf, space, leaf, space',
  readAloudMinutes: 5,
  learningTakeaway:
    'A border looks calm and steady when matching shapes repeat with the same spaces between them. If one gap grows too wide or too narrow, the eye notices right away that the pattern has broken.',
  heartTakeaway:
    'Patient noticing can reveal one small place that needs care, and going back to fix it gently makes the whole thing feel right again.',
  grownUpFact:
    'This gentle tale is set c.440 BCE in Athens, while the Parthenon was being built (447–432 BCE) under the master sculptor Phidias. The repeating leaf-and-lotus border is a real Greek ornament called the anthemion or palmette: stylized leaf shapes spaced evenly along a band. Many unnamed craftspeople carved such patterns onto temples and pottery. The story keeps the real craft and era, and invents no single named child, since this repeating border was a shared technique rather than one person’s idea.',
  pages: [
    {
      text: 'Long ago in Athens, a great temple was rising on the hill. The master sculptor Phidias guided many carvers. In his busy workshop, real craftspeople practiced a leaf border for the stone. A young helper set down one carved leaf tile, left a little space, and set down the next. “Leaf, space, leaf, space,” she hummed softly.',
      cue: 'Say the pattern with a soft voice: leaf, space, leaf, space.',
      scene: {
        id: 'the-border-that-lined-up-p1-model-border',
        focus: 'A young Athenian helper laying an even leaf-tile border on a practice band in Phidias’s workshop',
        composition:
          'Foreground: loose carved leaf tiles and a shallow clay tray; midground: the young helper and a temple practice model; background: open workshop columns and the sunlit Athens hillside',
        palette: 'warm ochre, pale limestone, and late-sun gold',
      },
      alt: 'A young helper places carved leaf tiles evenly along a practice border in an ancient Athens workshop.',
    },
    {
      text: 'She used one fingertip as a gentle spacer. Tap, tap went each tile onto the damp clay. A leaf, one fingertip of empty room, then the next leaf. This was how the old carvers made a pattern repeat. Around the first side, every shape had space to breathe. She smiled and moved to the corner without hurrying.',
      cue: 'Hold up one fingertip and make three gentle spaces in the air.',
      scene: {
        id: 'the-border-that-lined-up-p2-finger-gap',
        focus: 'The helper using one fingertip to keep every gap the same',
        composition:
          'Foreground: two leaf tiles with one fingertip gap between them; midground: the helper leaning close to the practice band; background: orderly trays and a hanging work cloth',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'A young helper holds one fingertip between two leaf tiles to keep the spacing even.',
    },
    {
      text: 'Two sides soon carried the same calm rhythm. “Leaf, space, leaf, space.” She pointed from one green tip to the next, then from one empty gap to the next. The shapes matched. The quiet spaces matched. This was the real anthemion border that carvers loved, and it looked steady and true.',
      cue: 'Say what repeats first: the leaf shape, the empty space, or both?',
      scene: {
        id: 'the-border-that-lined-up-p3-two-sides',
        focus: 'Two finished sides showing matching leaves and matching gaps',
        composition:
          'Foreground: a practice corner enlarged with paired leaf tips; midground: the helper’s pointing hand following the border; background: an older carver smoothing a separate stone block',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'A young helper points along two edges where carved leaves and empty spaces repeat evenly.',
    },
    {
      text: 'But on the third side, one leaf leaned too close to its neighbor. The next gap grew wide, and the last tile would not fit before the corner. She tried to nudge everything tighter. The border looked pinched. She gave a small sigh. One crowded place had broken the whole gentle repeat.',
      scene: {
        id: 'the-border-that-lined-up-p4-crowded-corner',
        focus: 'One crowded pair of leaves beside one overly wide gap',
        composition:
          'Foreground: an unused final tile and a wide corner gap; midground: the helper frowning at the crowded pair; background: two finished borders still even and calm',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'A young helper studies an edge with two crowded leaves and one wide empty gap.',
    },
    {
      text: 'A kind older carver did not move the tiles for her. He simply asked, “Where did the spaces stop matching?” She looked back to the first crowded pair. She lifted those leaves, smoothed the clay, and began that side again. “Leaf, space, leaf, space,” she whispered, using her patient fingertip once more.',
      cue: 'Point to where the pattern first went wrong, then start again slowly.',
      scene: {
        id: 'the-border-that-lined-up-p5-reset-row',
        focus: 'The helper lifting the crowded pair and resetting the row',
        composition:
          'Foreground: two lifted leaf tiles and a smoothed clay strip; midground: the helper resetting the first gap while the older carver waits; background: the remaining practice sides intact',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'A young helper removes two crowded tiles while an older carver watches from beside the table.',
    },
    {
      text: 'This time the final leaf settled before the corner with room on both sides. She traced the whole little border without touching it. No place pinched; no place yawned. “Leaf, space, leaf, space.” The older carver nodded, but her own careful eyes had already told her the pattern was finished.',
      scene: {
        id: 'the-border-that-lined-up-p6-complete-frieze',
        focus: 'The helper tracing the complete evenly spaced border in the air',
        composition:
          'Foreground: the last leaf seated neatly before the corner; midground: the helper’s hovering hand circling the practice band; background: the older carver nodding as the first evening star appears',
        palette: 'indigo, silver-blue, and soft clay',
      },
      alt: 'A young helper’s hand follows a complete carved leaf border around all four sides of the practice band.',
    },
    {
      text: 'They covered the practice band with a soft cloth so the clay could rest until morning. The young helper washed her hands and curled on a woven mat nearby. Beneath the cloth, the little leaves kept their quiet places. One loose leaf tile rested in a crescent dish, smooth and still. Good work could sleep too. Goodnight.',
      scene: {
        id: 'the-border-that-lined-up-p7-covered-model',
        focus: 'The helper resting beside the cloth-covered practice band and a crescent dish',
        composition:
          'Foreground: a crescent dish holding one leaf tile beside a folded work cloth; midground: the sleepy helper on a woven mat; background: the covered practice band and moonlit workshop columns',
        palette: 'deep navy, moon silver, and quiet umber',
      },
      alt: 'A young helper lies on a woven mat beside the covered practice band and one leaf tile in a crescent dish under the moon.',
    },
  ],
};
