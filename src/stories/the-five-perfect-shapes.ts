import type { Story } from '../types';

export const theFivePerfectShapes: Story = {
  slug: 'the-five-perfect-shapes',
  title: 'The Five Perfect Shapes',
  subtitle: 'Theaetetus of Athens finds the only five blocks whose faces all match.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'Faces match, corners meet',
  readAloudMinutes: 5,
  learningTakeaway:
    'A block closes into a perfect shape only when every face is the same and the corners meet the same way. When you sort blocks by that pattern, just five kinds pass the test, with 4, 6, 8, 12, and 20 faces.',
  heartTakeaway:
    'Careful, patient sorting is calming. It is fine to set some pieces aside for another day, praised or blamed by no one.',
  grownUpFact:
    'Long ago in Athens, a real mathematician named Theaetetus (about 417–369 BCE) worked alongside Plato at his school, the Academy. Ancient notes credit him with studying all five regular solids and showing there are exactly five: the tetrahedron (4 faces), cube (6), octahedron (8), dodecahedron (12), and icosahedron (20). Plato later linked them to the elements in his book the Timaeus, around 360 BCE, which is why we call them the Platonic solids. About sixty years afterward, Euclid gave the full constructions in Book 13 of his Elements. This gentle tale imagines young Theaetetus first noticing the pattern with folded paper models.',
  pages: [
    {
      text: 'Long ago in Athens, a boy named Theaetetus loved shapes. This is a gentle tale about him. Under a cool stone stoa, he opened a basket of paper blocks. Some had triangle faces. Some had square faces. His teacher spread a cloth to sort them. "Faces match, corners meet," she said softly. Theaetetus picked the smallest block and turned it slowly in the golden evening light.',
      cue: 'Hold your hands like a tiny paper block. Can you turn it slowly, the way Theaetetus does?',
      scene: {
        id: 'the-five-perfect-shapes-p1-stoa-invitation',
        focus: 'young Theaetetus and his teacher sorting paper blocks beneath a quiet Athenian stoa',
        composition:
          'Foreground: a cloth with sorting circles and triangle-faced and square-faced paper blocks; midground: Theaetetus turning one model while his teacher holds the basket; background: pale stoa columns and a golden Athenian courtyard',
        palette: 'Attic red, parchment cream, olive green and lamp gold under warm golden light',
      },
      alt: 'A boy and his teacher sort triangle-faced and square-faced paper blocks on a cloth beneath a quiet Athenian stoa at golden hour.',
    },
    {
      text: 'Theaetetus traced each face with one fingertip. On the first block, every face had the very same outline. Its corners tucked together, and no flap stayed loose. Pat, pat went his finger around the edges. "Faces match, corners meet," he whispered. He set it in the circle for shapes that closed. Then he looked for the next block that matched the same neat pattern.',
      cue: 'Trace a triangle in the air. Now count its corners with me: one, two, three.',
      scene: {
        id: 'the-five-perfect-shapes-p2-tracing-close',
        focus: 'Theaetetus tracing the matching faces of one closed paper block',
        composition:
          'Foreground: a closed triangle-faced model in the "it closed" sorting circle; midground: Theaetetus tracing an edge while his teacher watches; background: a folded cloth edge and soft column shadows',
        palette: 'Attic red, parchment cream, olive green and lamp gold under soft dusk light',
      },
      alt: 'A boy traces the matching triangular faces of one closed paper block while his teacher watches under a stoa at dusk.',
    },
    {
      text: 'The next model had matching square faces and stood firm and steady. It closed with no gap at all. A mixed model looked hopeful from one side. But a triangle met a square at the top, and a flap sprang open. Theaetetus did not call it a bad block. He simply set it in the circle for pieces to try again another day.',
      scene: {
        id: 'the-five-perfect-shapes-p3-mixed-flap',
        focus: 'a closed square-faced model beside a mixed model with one open flap',
        composition:
          'Foreground: a firm closed cube-like block and a mixed model with an open paper flap; midground: Theaetetus gently moving the mixed model while his teacher nods; background: two sorting circles under a dusky stoa',
        palette: 'Attic red, parchment cream, olive green and lamp gold under soft dusk light',
      },
      alt: 'A closed square-faced paper block sits beside a mixed paper model whose flap has sprung open, on a sorting cloth at dusk.',
    },
    {
      text: 'Theaetetus hurried with a tall, many-sided model. He pushed two corners together, and another corner sprang apart. His tidy rows scattered across the cloth. For a moment the basket seemed full of impossible pieces. His teacher gathered only the rolling models and left his sorting choices alone. The little puzzle could wait. He took one slow, easy breath.',
      scene: {
        id: 'the-five-perfect-shapes-p4-scatter-pause',
        focus: 'a tall paper model springing open as Theaetetus pauses to breathe',
        composition:
          'Foreground: an opened many-sided model and scattered but undamaged paper blocks; midground: Theaetetus pausing while his teacher catches a rolling model; background: dim stoa columns and an empty patch of sorting cloth',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gloaming light',
      },
      alt: 'A tall paper model springs open and blocks scatter across a cloth as a boy pauses and his teacher catches a rolling piece.',
    },
    {
      text: 'Theaetetus rebuilt his rows by face shape. Then he tested one model at a time, slow and calm. "Faces match, corners meet." A matching set folded inward and closed. A mixed set still left a gap. The answer was right there in the paper, not hidden in a long speech. He began to see the pattern repeat, and his shoulders softened and relaxed.',
      cue: 'Look where the faces meet. Does the paper close snug, or does it leave a little gap?',
      scene: {
        id: 'the-five-perfect-shapes-p5-pattern-repeat',
        focus: 'Theaetetus comparing one closed model and one gapped model',
        composition:
          'Foreground: a neatly closed paper block beside a paper block with a visible gap; midground: Theaetetus comparing their corners while his teacher sits nearby; background: restored sorting rows and the first evening lamp',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gloaming light',
      },
      alt: 'A boy compares a snugly closed paper block with one that leaves a gap, his tidy sorting rows restored under a first lamp.',
    },
    {
      text: 'Soon a small family of closed blocks rested together on the cloth. He counted them gently: one, two, three, four, five. Each kept just one kind of face all the way around itself. No other model would close so cleanly. Theaetetus left the mixed attempts nearby for tomorrow. The pattern had shown him which folded shapes could truly meet.',
      scene: {
        id: 'the-five-perfect-shapes-p6-five-solids',
        focus: 'a calm row of five closed paper blocks with mixed attempts set aside',
        composition:
          'Foreground: a row of five closed regular models and a separate try-again tray; midground: Theaetetus straightening the cloth while his teacher closes the basket; background: a soft moonrise beyond the stoa and a quiet agora',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gentle moonrise light',
      },
      alt: 'Five closed paper blocks rest in a calm row while mixed attempts wait in a separate tray under a moonrise beyond the stoa.',
    },
    {
      text: 'At home, Theaetetus set one closed paper block beside his lamp. "Faces match, corners meet," he whispered once more. Its shadow made a quiet patchwork on the wall. The other models slept in their basket, neither praised nor blamed, only waiting. He folded his blanket into one soft, cozy corner. The five perfect shapes could dream until morning. Goodnight.',
      scene: {
        id: 'the-five-perfect-shapes-p7-lamp-goodnight',
        focus: 'one closed paper block casting a calm shadow beside sleeping Theaetetus',
        composition:
          'Foreground: a closed paper block and a dimmed clay lamp; midground: Theaetetus asleep under a folded blanket; background: gentle geometric shadow shapes on a deep-night wall',
        palette: 'Attic red, parchment cream, olive green and lamp gold under deep-night light',
      },
      alt: 'One closed paper block casts a calm shadow beside a sleeping boy tucked under a folded blanket in a deep-night room.',
    },
  ],
};
