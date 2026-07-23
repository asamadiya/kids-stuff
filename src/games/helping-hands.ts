import type { ComicScenario, ComicMeta } from './comic';

export const HELPING_HANDS_META: ComicMeta = {
  id: 'helping-hands',
  title: 'Helping Hands',
  icon: '🧹',
  color: 'leaf',
  tagline: 'Little hands can do big kind things at home, especially for the people we love.',
};

export const HELPING_HANDS_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'spilled-blocks',
    comic: 'helping-hands-spilled-blocks',
    kind: 'do',
    prompt: 'Mia knocked over the whole block bin and blocks went everywhere. What is the kind thing Leo can do?',
    options: [
      { id: 'a', label: 'Kneel down and help Mia pick up the blocks together' },
      { id: 'b', label: 'Walk away and let Mia clean it all alone' },
      { id: 'c', label: 'Say "You made a mess!" and leave' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Helping clean up together makes a big mess feel small and shows Mia she is not alone.',
    feedbackOther: 'That is one idea. The kindest thing is to kneel down and help Mia pick up the blocks together.',
  },
  {
    id: 'proud-helper',
    comic: 'helping-hands-proud-helper',
    kind: 'feel',
    prompt: 'Leo set the whole table for dinner all by himself, and Mom smiled big. How does he feel?',
    options: [
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'scared', label: 'Scared', face: 'scared' },
    ],
    answerId: 'proud',
    feedbackCorrect: 'Yes! Doing a helping job all by himself fills Leo up with proud, happy feelings.',
    feedbackOther: 'He is actually feeling proud. Helping his family gave Leo a warm, proud glow inside.',
  },
  {
    id: 'mia-crying',
    comic: 'helping-hands-mia-crying',
    kind: 'do',
    prompt: 'Mia dropped her teddy bear and started to cry while Mom is busy in the kitchen. What can Leo do?',
    options: [
      { id: 'a', label: 'Turn up the TV so he cannot hear her' },
      { id: 'b', label: 'Pick up teddy and give it back with a gentle hug' },
      { id: 'c', label: 'Tell Mia to stop being a baby' },
    ],
    answerId: 'b',
    feedbackCorrect: 'Picking up teddy and giving Mia a hug is a caring helper move that dries her tears.',
    feedbackOther: 'That is a choice. The caring thing is to pick up teddy and give it back with a gentle hug.',
  },
  {
    id: 'tired-helper',
    comic: 'helping-hands-tired-helper',
    kind: 'feel',
    prompt: 'Leo carried his heavy laundry basket up the stairs all by himself, then flopped on his bed. How does he feel?',
    options: [
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'angry', label: 'Angry', face: 'angry' },
    ],
    answerId: 'proud',
    feedbackCorrect: 'Even tired arms feel proud! Leo did a hard helping job and finished it all himself.',
    feedbackOther: 'Mostly he feels proud. The job was tiring, but doing it made Leo feel strong and proud.',
  },
] as const;
