import type { Story } from '../types';

export const theFivePerfectShapes: Story = {
  slug: 'the-five-perfect-shapes',
  title: 'The Five Perfect Shapes',
  subtitle: 'Theaetetus of Athens finds the only five blocks whose faces all match.',
  domain: 'patterns',
  collection: 'historical',
  repeatedPhrase: 'Faces match, corners meet',
  readAloudMinutes: 9,
  learningTakeaway:
    'A block closes into a perfect shape only when every face is the same and every corner meets the same way. When you sort blocks by that pattern, exactly five kinds pass the test, with 4, 6, 8, 12, and 20 faces. Only those five leave no gap and no overlap when the faces fold together at a corner.',
  heartTakeaway:
    'Careful, patient sorting is calming, and a hard question can wait for another day. Setting a puzzle aside is not failing; it is trusting your future self to try again.',
  grownUpFact:
    'Long ago in Athens, a real mathematician named Theaetetus (about 417–369 BCE) worked alongside Plato at his school, the Academy. Ancient notes credit him with studying all five regular solids and being among the first to show there are exactly five: the tetrahedron (4 faces), cube (6), octahedron (8), dodecahedron (12), and icosahedron (20). The reason only five exist is a corner rule: identical regular faces can meet at a point only when their angles leave room to fold up, which happens in just five ways. Plato later linked the shapes to the elements in his book the Timaeus (around 360 BCE), which is why we call them the Platonic solids. About sixty years afterward, Euclid gave the full constructions in Book 13 of his Elements. This gentle tale imagines young Theaetetus first noticing the pattern with folded paper models; the step-by-step details are dramatized, not documented.',
  pages: [
    {
      text: 'Long ago in Athens, a boy named Theaetetus loved shapes. This is a gentle tale about him. Under a cool stone stoa, he opened a basket of paper blocks. Some faces were triangles. Some were squares. Some were little five-sided pentagons. His teacher spread a cloth and drew three sorting circles. "Faces match, corners meet," she said softly. She meant a true block wears one kind of face all the way around.',
      cue: 'Hold your hands like a tiny paper block. Can you turn it slowly, the way Theaetetus does?',
      scene: {
        id: 'the-five-perfect-shapes-p1-stoa-invitation',
        focus: 'young Theaetetus and his teacher opening a basket of paper blocks beneath a quiet Athenian stoa',
        composition:
          'Foreground: a cloth with three sorting circles and triangle-, square-, and pentagon-faced paper blocks; midground: Theaetetus lifting one model while his teacher steadies the basket; background: pale stoa columns and a golden Athenian courtyard',
        palette: 'Attic red, parchment cream, olive green and lamp gold under warm golden light',
      },
      alt: 'A boy and his teacher open a basket of triangle-, square-, and pentagon-faced paper blocks on a cloth beneath an Athenian stoa at golden hour.',
    },
    {
      text: 'Theaetetus traced the first block with one careful fingertip. Every face wore the very same triangle outline. Its corners tucked together, and no flap stayed loose. Pat, pat went his finger around each edge. "Faces match, corners meet," he whispered. He set it in the circle for blocks that truly closed. Then he hunted for the next block that followed the same neat pattern.',
      cue: 'Trace a triangle in the air. Now count its corners with me: one, two, three.',
      scene: {
        id: 'the-five-perfect-shapes-p2-tracing-close',
        focus: 'Theaetetus tracing the matching triangular faces of one closed paper block',
        composition:
          'Foreground: a closed triangle-faced model resting in the "it closed" sorting circle; midground: Theaetetus tracing an edge while his teacher watches; background: a folded cloth edge and soft column shadows',
        palette: 'Attic red, parchment cream, olive green and lamp gold under soft afternoon light',
      },
      alt: 'A boy traces the matching triangular faces of one closed paper block while his teacher watches under a stoa.',
    },
    {
      text: 'His teacher lifted the little block and named it kindly. "Four triangles, and we call it a tetrahedron," she said. "Tetra means four in our old word." Theaetetus turned it and saw the truth for himself. At every sharp corner, three triangles pressed together and folded up snug. There was room for the paper to bend and meet. That leftover room, she said, is exactly what lets a corner close.',
      scene: {
        id: 'the-five-perfect-shapes-p3-tetra-name',
        focus: 'the teacher naming the four-faced tetrahedron as Theaetetus studies its corner',
        composition:
          'Foreground: a small four-triangle tetrahedron held to the light, three faces meeting at one corner; midground: the teacher gesturing gently, Theaetetus leaning in; background: warm stoa columns and the drawn sorting circles',
        palette: 'Attic red, parchment cream, olive green and lamp gold under soft afternoon light',
      },
      alt: 'A teacher holds a small four-triangle tetrahedron to the light while a boy studies how three faces meet at one corner.',
    },
    {
      text: 'Next came a block with six matching square faces. It stood firm and steady and closed with no gap at all. "Six squares, a cube," the teacher smiled. At each corner, three squares met and just barely folded up. Then Theaetetus reached for a mixed model that only looked hopeful. A triangle met a square at the top, and a flap sprang open. He did not call it a bad block; he set it in the try-again circle.',
      cue: 'Look where the faces meet at a corner. Does the paper fold up snug, or leave a little gap?',
      scene: {
        id: 'the-five-perfect-shapes-p4-cube-mixed',
        focus: 'a firm six-square cube beside a mixed model with one open flap',
        composition:
          'Foreground: a closed cube and a mismatched model with an open paper flap; midground: Theaetetus moving the mixed model into the try-again circle while his teacher nods; background: two sorting circles under warm stoa light',
        palette: 'Attic red, parchment cream, olive green and lamp gold under soft dusk light',
      },
      alt: 'A firm six-square cube sits beside a mixed paper model whose flap has sprung open, being moved to a try-again circle.',
    },
    {
      text: 'Now the game grew clever, and Theaetetus felt it. He folded eight triangles, and four met at every corner. It closed into a spinning shape his teacher called an octahedron. "Octo means eight," she said, tapping each face. Twenty triangles, five at each corner, folded into a rounder ball. That one was the icosahedron, with faces too many to count fast. The same triangle, sorted different ways, kept making brand-new perfect blocks.',
      scene: {
        id: 'the-five-perfect-shapes-p5-octa-icosa',
        focus: 'Theaetetus folding an eight-faced octahedron and a twenty-faced icosahedron from triangles',
        composition:
          'Foreground: a closed octahedron and a rounder icosahedron side by side on the cloth; midground: Theaetetus pressing a last triangle flap while his teacher counts faces; background: the first evening lamp glowing on the stoa wall',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gloaming light',
      },
      alt: 'A boy sets a closed eight-faced octahedron beside a rounder twenty-faced icosahedron, both folded from matching triangles.',
    },
    {
      text: 'Then Theaetetus tried the little five-sided pentagons. Three of them met at a corner and, wonder of wonders, folded up. Twelve pentagons closed into a shape called a dodecahedron. "Dodeca means twelve," his teacher said, delighted. But when he added a fourth pentagon to one corner, it lay flat. Flat paper cannot fold into a block; it just stays on the cloth. So the corner rule quietly told him where to stop.',
      cue: 'Press three flat shapes together at one point. When is there room to fold up, and when is it just flat?',
      scene: {
        id: 'the-five-perfect-shapes-p6-dodeca-flat',
        focus: 'a twelve-faced dodecahedron beside four pentagons lying flat on the cloth',
        composition:
          'Foreground: a closed pentagon-faced dodecahedron next to four flat pentagons that will not fold; midground: Theaetetus tilting his head while his teacher points to the flat corner; background: soft lamp glow and tidy sorting rows',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gloaming light',
      },
      alt: 'A twelve-faced dodecahedron sits beside four flat pentagons that lie on the cloth because a fourth pentagon leaves no room to fold.',
    },
    {
      text: 'Theaetetus hurried to fold a tall block with many, many sides. He pushed the corners together, and the whole thing sprang apart. His tidy rows scattered across the cloth like fallen leaves. For a breath, the basket seemed full of impossible pieces. His teacher gathered only the rolling models and left his sorting choices alone. The little puzzle could wait. He took one slow, easy breath and let it out.',
      scene: {
        id: 'the-five-perfect-shapes-p7-scatter-pause',
        focus: 'a tall many-sided model springing apart as Theaetetus pauses to breathe',
        composition:
          'Foreground: an opened many-sided model and scattered but undamaged paper blocks; midground: Theaetetus pausing while his teacher catches a rolling model; background: dim stoa columns and an empty patch of sorting cloth',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gloaming light',
      },
      alt: 'A tall many-sided paper model springs apart and blocks scatter across a cloth as a boy pauses and his teacher catches a rolling piece.',
    },
    {
      text: 'When he was calm, Theaetetus rebuilt his rows by face shape. He tested one block at a time, slow and sure. "Faces match, corners meet," he said with each try. A matching set folded inward and closed; a mixed set left a gap. The answer was right there in the paper, not hidden in a long speech. He could feel the pattern begin to repeat, and his shoulders softened.',
      cue: 'Look where the faces meet. Does the paper close snug, or does it leave a little gap?',
      scene: {
        id: 'the-five-perfect-shapes-p8-pattern-repeat',
        focus: 'Theaetetus comparing one closed model and one gapped model, rows restored',
        composition:
          'Foreground: a neatly closed paper block beside one with a visible gap; midground: Theaetetus comparing their corners while his teacher sits near; background: restored sorting rows and a steady evening lamp',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gloaming light',
      },
      alt: 'A boy compares a snugly closed paper block with one that leaves a gap, his tidy sorting rows restored under an evening lamp.',
    },
    {
      text: 'Soon a small family of closed blocks rested together on the cloth. He counted them gently: one, two, three, four, five. Four faces, six, eight, twelve, and twenty, each one whole. Every block wore just one kind of face all the way around. No other model would ever close so cleanly. "Why only five?" he asked, and the corner rule answered him. Add one face too many, and the paper lies flat instead.',
      scene: {
        id: 'the-five-perfect-shapes-p9-five-solids',
        focus: 'a calm row of five closed paper blocks with mixed attempts set aside',
        composition:
          'Foreground: a row of five closed regular models, tetrahedron to icosahedron, and a separate try-again tray; midground: Theaetetus straightening the cloth while his teacher closes the basket; background: a soft moonrise beyond the stoa',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gentle moonrise light',
      },
      alt: 'Five closed paper blocks rest in a calm row from smallest to roundest while mixed attempts wait in a separate tray under a moonrise.',
    },
    {
      text: 'His teacher smiled as if he had found buried treasure. "Others feel there might be five," she said, "but you can show it." She meant a real thing about proving in mathematics. A guess says maybe; a reason says surely, and holds for everyone. Theaetetus had a reason now, made of paper and patience. Years later, grown-up thinkers would write his five shapes into famous books. Even so, the little folded blocks always told the truth first.',
      scene: {
        id: 'the-five-perfect-shapes-p10-proof-idea',
        focus: 'the teacher praising Theaetetus for showing, not just guessing, why five is the answer',
        composition:
          'Foreground: the five finished blocks lined up as Theaetetus rests a hand on the smallest; midground: the teacher speaking warmly, the try-again tray tidy behind; background: a scroll and stylus hinting at future books, under lamp glow',
        palette: 'Attic red, parchment cream, olive green and lamp gold under gentle lamp-and-moon light',
      },
      alt: 'A teacher warmly praises a boy who rests his hand on five finished paper blocks, a scroll and stylus behind them under lamp glow.',
    },
    {
      text: 'Grown-ups later gave the five shapes a grand nickname, the Platonic solids. A thinker named Plato imagined them as the pieces of the whole world. Fire, he guessed, was made of sharp little tetrahedrons, and earth of steady cubes. That was a poet’s dream, not a proven fact, and children may simply enjoy it. The shapes are true whatever we pretend they mean. Bees, crystals, and tiny sea creatures still build with these very same forms.',
      scene: {
        id: 'the-five-perfect-shapes-p11-platonic-world',
        focus: 'imagined links between the five solids and fire, earth, water, air, and the whole sky',
        composition:
          'Foreground: the five paper solids each haloed by a soft symbol—flame, soil, wave, breeze, and stars; midground: Theaetetus gazing up in wonder; background: a dreamlike Athenian night sky opening above the stoa',
        palette: 'Attic red, parchment cream, olive green and lamp gold under starlit indigo light',
      },
      alt: 'The five paper solids float haloed by soft symbols of fire, earth, water, air, and stars as a boy gazes upward in wonder.',
    },
    {
      text: 'At home, Theaetetus set one closed block beside his little lamp. "Faces match, corners meet," he whispered once more. Its shadow made a quiet patchwork on the wall. The five perfect shapes waited on their shelf, whole and calm. Tomorrow he might look for them out in the wide world. For now his eyes grew soft, and the room grew warm and still. Goodnight, small finder of the five, and dream of shapes that always meet.',
      cue: 'Before you sleep, wonder together: where might a triangle or a cube be hiding in your own home?',
      scene: {
        id: 'the-five-perfect-shapes-p12-lamp-goodnight',
        focus: 'one closed paper block casting a calm shadow beside sleepy Theaetetus',
        composition:
          'Foreground: a closed paper block and a dimmed clay lamp; midground: Theaetetus growing sleepy under a folded blanket; background: gentle geometric shadow shapes on a deep-night wall and the five blocks on a shelf',
        palette: 'Attic red, parchment cream, olive green and lamp gold under deep-night light',
      },
      alt: 'One closed paper block casts a calm shadow beside a sleepy boy under a folded blanket, five finished blocks resting on a shelf.',
    },
  ],
};
