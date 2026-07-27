import type { Story } from '../types';

export const theNineLittleRoomsOfNumber: Story = {
  slug: 'the-nine-little-rooms-of-number',
  title: 'The Nine Little Rooms of Number',
  subtitle: 'How reckoners in ninth-century India, and the Gwalior zero, gave each column its own room.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'A new room, a new amount',
  readAloudMinutes: 9,
  learningTakeaway:
    'Long ago in India, reckoners drew columns on a board so each place had its own room. The same small mark meant one when it sat in the ones room, and one whole bundle of ten when it moved to the next room. This is place value, the idea that lets ten little symbols, including zero, count any number at all.',
  heartTakeaway:
    'Giving each thing a clear place helps everyone read the count the same way, so no one has to guess.',
  grownUpFact:
    'The decimal place-value system with zero grew in India over centuries — it was a shared development, not one person’s invention. Brahmagupta wrote rules for calculating with zero in 628 CE in the Brahmasphutasiddhanta. Reckoners counted on dust boards and counting boards (pati ganita), sliding marks between ruled columns so each place, from ones to tens to hundreds, had its own “room.” One of the oldest firmly dated written zeros sits in the Gwalior temple inscription of 876 CE, squarely in the ninth century. A small circle for zero simply meant “this room is empty,” which is why the whole system needs it. Centuries later these numerals reached the Arab world and then Europe, where we still call them Hindu-Arabic numerals.',
  pages: [
    {
      text: 'Long ago in India, a market reckoner kept count on a wide wooden board. She ruled it into neat columns with one fingertip, dragging tiny ridges through fine dust. Each column was a little room. The first room, on the right, was for ones. The next room, just left of it, was for bundles of ten. She set a small pebble down and murmured, “A new room, a new amount.” This was pati ganita, the careful art of counting on a board, room by patient room.',
      cue: 'Trace three little rooms in the air with your finger, moving right to left like the reckoner.',
      scene: {
        id: 'the-nine-little-rooms-of-number-p1-dust-board',
        focus: 'a reckoner ruling columns into a dust counting board in a warm bazaar',
        composition:
          'Foreground: a wide dust board ruled into three columns with a pebble pouch beside it; midground: a calm reckoner drawing a ridge with one fingertip; background: an Indian bazaar awning and clay lamps at golden hour',
        palette: 'warm ochre, pale limestone, and late-sun gold',
      },
      alt: 'A reckoner rules a wide dust board into three columns beside a small pouch of counting pebbles.',
    },
    {
      text: 'A young helper crouched beside her, watching every ridge and pebble. “Why draw rooms at all?” he asked. “Why not one big pile?” The reckoner smiled. “A pile can be miscounted, and two counters may argue,” she said. “But a room never lies. Where a pebble sits tells us exactly how much it means.” She tapped the ones room, then the tens room. Same pebble, different room, different amount. The helper leaned closer, and the whole board seemed to wake up.',
      cue: 'Ask a grown-up: if you had ten toys, would a big pile or ten neat rooms be easier to count?',
      scene: {
        id: 'the-nine-little-rooms-of-number-p2-why-rooms',
        focus: 'a young helper asking the reckoner why the board is ruled into rooms',
        composition:
          'Foreground: two hands over the ruled board, one tapping the ones room, one tapping the tens room; midground: a curious young helper crouched close and listening; background: bustling market stalls and hanging cloth in warm light',
        palette: 'warm ochre, pale limestone, and honeyed brown',
      },
      alt: 'A young helper crouches beside a reckoner who taps two different columns on the ruled counting board.',
    },
    {
      text: 'A trader arrived with ten round nuts to sell. The reckoner gathered them gently into one small basket. Then a pebble in the ones room was lifted and slid fully into the tens room. It settled with a soft click against the ridge. The pebble had not changed its shape or its size at all. Yet now it stood for one whole bundle of ten, resting beside the basket. Its room told everyone its new amount, without a single word spoken.',
      cue: 'Move one pretend pebble from your left palm to your right palm. What could that jump mean?',
      scene: {
        id: 'the-nine-little-rooms-of-number-p3-move-pebble',
        focus: 'one pebble sliding from the ones room into the tens room beside a basket of ten',
        composition:
          'Foreground: a single pebble and a small basket holding ten nuts; midground: a hand sliding the pebble across one ruled ridge; background: the trader watching and stacked empty baskets',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'A hand slides one pebble across a ruled line toward a basket holding ten round nuts.',
    },
    {
      text: 'Now a second pebble was set in the ones room beside a single loose nut. Two pebbles, the very same size, sat in different rooms. One stood for one nut. One stood for a whole basket of ten. “A new room, a new amount,” the reckoner said softly. This is a big idea grown-ups call place value. The room a mark sits in changes how much that mark is worth. Anyone passing could read the count, and never once had to guess.',
      cue: 'Which pebble means one nut, and which means a whole basket of ten? Point to each.',
      scene: {
        id: 'the-nine-little-rooms-of-number-p4-compare-rooms',
        focus: 'two matching pebbles in separate columns beside one nut and one basket',
        composition:
          'Foreground: one nut and one basket of ten set apart; midground: two matching pebbles divided by a ruled ridge; background: the reckoner and trader comparing them calmly',
        palette: 'dusty rose, blue-grey, and fading amber',
      },
      alt: 'Two matching pebbles rest in separate columns, one beside a single nut and one beside a full basket.',
    },
    {
      text: 'All afternoon the counts grew larger, and the rooms did clever work. Ten pebbles crowding the ones room became one pebble in the tens room. Ten pebbles crowding the tens room became one pebble in the hundreds room. Each new room to the left meant ten times as much as the room before. So a small board could hold enormous numbers with just a few pebbles. “A new room, a new amount,” the helper whispered, beginning to feel the pattern in his fingers.',
      scene: {
        id: 'the-nine-little-rooms-of-number-p5-tenfold',
        focus: 'ten pebbles in one room being traded for a single pebble in the next room left',
        composition:
          'Foreground: a crowded ones room of ten pebbles beside a single pebble newly placed in the tens room; midground: the helper counting on his fingers; background: the reckoner watching with a knowing smile among market crates',
        palette: 'terracotta, soft slate, and warm wheat gold',
      },
      alt: 'Ten pebbles crowd one column while a single pebble sits in the next column to the left.',
    },
    {
      text: 'But a puzzle waited in the tens room that evening. It held no bundle at all, and it looked simply empty. The helper worried the empty room might be skipped when someone read the board aloud. Then the hundreds and the ones could squeeze together and be misread. A count of one hundred and three might sound like only thirteen. How could an empty room clearly say, right here, there is nothing to count?',
      scene: {
        id: 'the-nine-little-rooms-of-number-p6-empty-room',
        focus: 'an empty tens column between a filled hundreds room and a filled ones room',
        composition:
          'Foreground: a bare middle column with pebbles in the rooms on either side; midground: a young helper leaning close in thought; background: the reckoner pausing beside covered trays',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'A helper studies a counting board where the middle column sits empty between two filled columns.',
    },
    {
      text: 'The reckoner smiled and drew a tiny circle in the empty tens room. That little round mark meant, “This room holds nothing, but do not skip it.” It was the zero, a real idea that counters in India had shaped over many years. Zero was not nothing at all. It was a careful sign that a place was empty and waiting. “A new room, a new amount,” the helper repeated, reading each room in its proper order now.',
      cue: 'Draw a small circle in the air. Can a mark stand for “nothing here, but keep counting”?',
      scene: {
        id: 'the-nine-little-rooms-of-number-p7-zero-circle',
        focus: 'a small circle drawn in the empty tens room to mark zero',
        composition:
          'Foreground: a tiny drawn circle in the bare middle column, ridge lines clear; midground: the reckoner’s fingertip lifting away, the helper nodding; background: a warm market wall glowing at dusk',
        palette: 'plum shadow, muted teal, and ember gold',
      },
      alt: 'A small round zero is drawn in the empty middle column of the counting board.',
    },
    {
      text: '“Long before us, a wise reckoner named Brahmagupta wrote rules for this zero,” she said. “He taught how to add it, take it away, and treat it as a true number.” The helper blinked, amazed that nothing could have such careful rules. Zero let the board show the difference between three, thirty, and three hundred. Without it, those counts could blur into one another. With it, every number had a shape no one could mistake. The tiny circle was quietly holding the whole board together.',
      scene: {
        id: 'the-nine-little-rooms-of-number-p8-brahmagupta',
        focus: 'the reckoner explaining that Brahmagupta wrote early rules for zero',
        composition:
          'Foreground: the board showing three, thirty, and three hundred in three neat arrangements; midground: the reckoner gesturing warmly as she teaches; background: a faded palm-leaf manuscript hinting at old written rules',
        palette: 'aged parchment cream, ink brown, and lamp amber',
      },
      alt: 'A reckoner explains the counting board while a faded palm-leaf manuscript hints at old written rules for zero.',
    },
    {
      text: 'Before the market closed, they read the whole board together, room by room. Ones held their pebbles. Tens showed a bundle, or a little zero when none. Hundreds waited quietly beyond them. “A new room, a new amount.” Just ten small symbols, counting one through nine and the round zero, could now hold any number at all. A handful of nuts or a thousand sacks of grain, the same little marks kept every count neat and clear.',
      scene: {
        id: 'the-nine-little-rooms-of-number-p9-full-board',
        focus: 'a finished board read across ones, tens with a zero, and hundreds',
        composition:
          'Foreground: ordered pebbles and one drawn zero across three clear columns; midground: reckoner and helper pointing along the rooms in order; background: baskets of nuts being covered for the night',
        palette: 'indigo, silver-blue, and soft clay',
      },
      alt: 'A reckoner and helper read a clear board across three columns, one holding a small drawn zero.',
    },
    {
      text: 'The helper wanted to see if a written zero could last longer than dust. So he pressed a small round circle into soft clay to keep it. Far away, on a temple wall in a city called Gwalior, stone-carvers were doing something similar. They cut numbers into rock, including a tiny carved zero, in the year we call 876. That carved circle still rests on the wall today, one of the oldest firmly dated written zeros we know. Dust boards were wiped clean each night, but stone remembered.',
      cue: 'Press a coin into dough to leave a round mark. Could that mark still be here in a thousand years?',
      scene: {
        id: 'the-nine-little-rooms-of-number-p10-gwalior',
        focus: 'a carved zero on the Gwalior temple wall, echoing the helper’s clay circle',
        composition:
          'Foreground: a small round zero pressed into a clay tablet in young hands; midground: the reckoner’s board beside it; background: a sunlit temple wall at Gwalior with numerals and a carved circle chiseled into warm stone',
        palette: 'sandstone rose, carved-shadow grey, and warm daylight gold',
      },
      alt: 'A carved zero on a warm sandstone temple wall echoes a round zero pressed into a small clay tablet.',
    },
    {
      text: 'These clever numbers did not stay in one market or one land. Traders carried them along roads and across seas, room and zero and all. They traveled to the Arab world, where scholars learned and spread them widely. Later they reached Europe, gathered into books, and slowly spread everywhere. That is why today we call them Hindu-Arabic numerals. The very digits you count with began as pebbles in little dust rooms, so long ago and far away.',
      scene: {
        id: 'the-nine-little-rooms-of-number-p11-journey',
        focus: 'the numerals traveling by trade routes from India outward across the world',
        composition:
          'Foreground: a caravan and a sailing dhow carrying scrolls of numerals; midground: a soft map curving from India toward the Arab world and Europe; background: a warm sky with routes traced in gentle gold lines',
        palette: 'map-parchment tan, sea teal, and route-gold',
      },
      alt: 'A caravan and a sailing boat carry scrolls of numerals along glowing trade routes from India toward distant lands.',
    },
    {
      text: 'When the counting was finally done, the board was wiped smooth as a quiet clay hill. No room needed reading now. Beside a folded mat, one round pebble rested alone in a little crescent dish. The helper smiled, for he now saw rooms everywhere, in coins, in prices, in stars. “A new room, a new amount,” he whispered, half to himself. Tomorrow the columns would fill again with counting. Tonight the nine numbers and their patient zero could rest in their rooms.',
      cue: 'Look for hidden rooms tonight: on a clock, a price tag, a page number. Where does zero hide?',
      scene: {
        id: 'the-nine-little-rooms-of-number-p12-board-at-rest',
        focus: 'a wiped-smooth board and one pebble in a crescent dish at gentle night',
        composition:
          'Foreground: a crescent dish cradling one round pebble beside a smooth blank board; midground: a folded resting mat; background: covered trays and dim bazaar lamps under a deep, starry sky',
        palette: 'deep navy, moon silver, and quiet umber',
      },
      alt: 'One round pebble rests in a crescent dish beside a wiped-smooth counting board under dim night lamps and stars.',
    },
  ],
};
