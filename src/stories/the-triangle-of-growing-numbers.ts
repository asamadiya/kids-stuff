import type { Story } from '../types';

export const theTriangleOfGrowingNumbers: Story = {
  slug: 'the-triangle-of-growing-numbers',
  title: 'The Triangle of Growing Numbers',
  subtitle: 'How the mathematician Yang Hui shared a triangle of numbers in China long ago.',
  domain: 'numbers',
  collection: 'historical',
  repeatedPhrase: 'Two above help one below',
  readAloudMinutes: 5,
  learningTakeaway:
    'In a triangle of numbers, each number in the middle is made by adding the two numbers just above it. The edges stay as ones, and the pattern grows one careful row at a time.',
  heartTakeaway:
    'Sharing what you learn, and giving thanks to the people who taught you first, is a kind and honest thing to do.',
  grownUpFact:
    'Yang Hui was a real mathematician who lived in China during the Southern Song dynasty, around 1238 to 1298. In 1261 CE he published a book explaining older counting methods, and in it he printed a triangle of numbers. Yang Hui honestly credited an earlier mathematician named Jia Xian, who lived about two hundred years before him. In this triangle the edges are ones, and every inside number is the sum of the two numbers just above it. In Europe the same triangle later became known as Pascal’s triangle, but Chinese scholars had written it down centuries earlier.',
  pages: [
    {
      text: 'Long ago in China, in the time of the Southern Song, there lived a real mathematician named Yang Hui. He loved numbers and careful counting. One quiet evening, by the warm light of a lamp, he smoothed a fresh sheet of paper. At the very top he brushed a single number: one. Then he began to build a small triangle of numbers below it, one gentle row at a time.',
      cue: 'Hold up one finger, like the single number at the top. Can you count to one with Yang Hui?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p1-lamplit-desk',
        focus: 'Yang Hui at a low desk brushing a single number one at the top of a paper triangle',
        composition:
          'Foreground: a low desk with a paper triangle and a single brushed number at its peak; midground: Yang Hui in a scholar’s robe leaning in with a brush; background: a calm Southern Song study with shelves of scrolls under warm lamplight',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A Chinese scholar brushes a single number at the top of a paper triangle by warm lamplight.',
    },
    {
      text: 'Under the top number, Yang Hui wrote two ones, side by side, holding the edges of the triangle. Then he looked at the little gap between them. "Two above help one below," he said softly. He added the two ones together, one and one, and wrote their answer in the middle: two. The edges stayed as ones, and the middle number grew from its two helpers above.',
      cue: 'Touch one finger on each hand, then bring them together. How many do the two ones make below?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p2-first-row',
        focus: 'two ones on the edges and a two written in the middle just below them',
        composition:
          'Foreground: a paper row showing one, then two, then one, with a soft arc joining the two ones above; midground: Yang Hui’s hand resting near the fresh middle number; background: the calm study softening into dusk',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A row of numbers reads one, two, one, with the middle two made by joining the two ones above.',
    },
    {
      text: 'On the next row, two numbers waited above a new gap: a one and a two. "Two above help one below." Yang Hui counted them together, one and two, and quietly wrote three in the pocket between them. The edges stayed as ones, so the row read one, three, three, one. The triangle grew a little wider, yet kept its steady, tidy shape.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p3-third-row',
        focus: 'a one and a two above joining to make three in the row below',
        composition:
          'Foreground: a paper row reading one, three, three, one, with soft arcs showing which pairs above were added; midground: Yang Hui counting on his fingers; background: the study in a deeper dusk glow',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A row of numbers reads one, three, three, one, each middle number made by adding the pair above it.',
    },
    {
      text: 'For a moment, Yang Hui paused. One middle number looked a little wrong, as if he had rushed it. He did not guess, and he did not scribble over the whole page. Instead he looked back at just the two numbers directly above the gap. He added them again, slowly and honestly, and mended the row with a calm, careful hand.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p4-careful-check',
        focus: 'Yang Hui checking the two numbers just above one uncertain middle number',
        composition:
          'Foreground: a paper row with one number gently circled for checking and two helpers highlighted above it; midground: Yang Hui pointing to the pair above with a thoughtful look; background: the quiet study in gloaming light',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A scholar checks the two numbers directly above one uncertain middle number to mend the row.',
    },
    {
      text: 'The next gap had a one and a three waiting above it. "Two above help one below." Yang Hui joined them, one and three, and wrote four below. The pattern was clear now: every inside number was simply its two neighbors, added. He did not need a grand new rule. He only needed to look at the two numbers right above each pocket.',
      cue: 'Which two numbers does Yang Hui look at before he writes the one below?',
      scene: {
        id: 'the-triangle-of-growing-numbers-p5-add-neighbors',
        focus: 'a one and a three above joining to make four in the row below',
        composition:
          'Foreground: a paper row with a four freshly brushed, arcs pointing up to the one and three that made it; midground: Yang Hui tracing the two helpers with a finger; background: the study in soft gloaming',
        palette: 'paper cream, ink black, lamp amber, and quiet evening blue',
      },
      alt: 'A one and a three above are joined to make four in the row below the growing triangle.',
    },
    {
      text: 'Yang Hui finished only the few rows his small page could hold. Then he did a kind thing. He wrote down the name of Jia Xian, an older mathematician who had counted this way long before him. Yang Hui shared the pattern in his book so others could learn it too. "Two above help one below," he wrote, for every child yet to come.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p6-credit-teacher',
        focus: 'a completed small triangle beside a written note honoring the earlier mathematician',
        composition:
          'Foreground: a finished number triangle with a small brushed note of thanks beside it; midground: Yang Hui setting his brush down with a peaceful smile; background: the study lit by a rising moon',
        palette: 'paper cream, ink black, lamp amber, and quiet moon silver',
      },
      alt: 'A finished triangle of numbers rests beside a written note honoring the earlier mathematician.',
    },
    {
      text: 'At last Yang Hui rinsed his brush and let the fresh ink dry. He rolled the paper triangle gently and set it on the shelf with his other scrolls. The lamp burned low and soft. "Two above help one below," he whispered, as the round moon rose over the quiet town. The numbers rested, the study grew still, and everything was calm. Goodnight.',
      scene: {
        id: 'the-triangle-of-growing-numbers-p7-moonlit-rest',
        focus: 'the rolled paper triangle resting on a shelf as the lamp dims under a round moon',
        composition:
          'Foreground: a rolled scroll of the number triangle settled on a shelf; midground: Yang Hui putting away his brush and lowering the lamp; background: a still Southern Song town under a round, calm moon',
        palette: 'quiet moon silver, deep night blue, and a soft warm lamp glow',
      },
      alt: 'A rolled paper triangle rests on a shelf as a scholar dims his lamp under a round, calm moon.',
    },
  ],
};