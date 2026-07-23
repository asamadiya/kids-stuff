import type { ComicScenario, ComicMeta } from './comic';

export const SHARING_TURNS_META: ComicMeta = {
  id: 'sharing-turns',
  title: 'Sharing & Taking Turns',
  icon: '🤝',
  color: 'aqua',
  tagline: 'Sharing toys and waiting for your turn helps everyone play together and feel happy.',
};

export const SHARING_TURNS_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'swing-wait',
    comic: 'sharing-turns-swing-wait',
    kind: 'feel',
    prompt: 'Leo waits a long time for his turn on the swing. How does he feel?',
    options: [
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'excited', label: 'Excited', face: 'excited' },
    ],
    answerId: 'sad',
    feedbackCorrect: 'Yes, waiting can feel sad and hard, and taking a slow breath helps the wait pass.',
    feedbackOther: 'That could happen too. But waiting so long feels sad for Leo, and that is okay to feel.',
  },
  {
    id: 'one-truck',
    comic: 'sharing-turns-one-truck',
    kind: 'do',
    prompt: 'Leo has one truck and his friend wants to play too. What is the kind thing to do?',
    options: [
      { id: 'a', label: 'Take turns rolling the truck together' },
      { id: 'b', label: 'Hide the truck behind his back' },
      { id: 'c', label: 'Roll it far away so nobody plays' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Sharing turns means the truck is fun for two, and playing together feels even better.',
    feedbackOther: 'I see why you picked that. But taking turns lets both friends play, and that is the kindest choice.',
  },
  {
    id: 'mia-blocks',
    comic: 'sharing-turns-mia-blocks',
    kind: 'do',
    prompt: 'Little sister Mia reaches for Leo’s blocks. What is the kind thing to do?',
    options: [
      { id: 'a', label: 'Build a tower with Mia and share the blocks' },
      { id: 'b', label: 'Pull every block away from her' },
      { id: 'c', label: 'Turn around and ignore Mia' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Sharing with Mia turns one builder into two, and building together is more fun.',
    feedbackOther: 'That is one idea. But sharing the blocks so Mia can build too is the caring thing to do.',
  },
  {
    id: 'my-turn-now',
    comic: 'sharing-turns-my-turn-now',
    kind: 'feel',
    prompt: 'Leo waited nicely and now it is finally his turn on the slide. How does he feel?',
    options: [
      { id: 'excited', label: 'Excited', face: 'excited' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'shy', label: 'Shy', face: 'shy' },
      { id: 'proud', label: 'Proud', face: 'proud' },
    ],
    answerId: 'excited',
    feedbackCorrect: 'Yes! Waiting for your turn feels so exciting when it is finally your go.',
    feedbackOther: 'Good thinking. Leo is proud he waited, and mostly he feels excited that his turn is here.',
  },
];
