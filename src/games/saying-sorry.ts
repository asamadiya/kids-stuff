import type { ComicScenario, ComicMeta } from './comic';

export const SAYING_SORRY_META: ComicMeta = {
  id: 'saying-sorry',
  title: 'Saying Sorry',
  icon: '🩹',
  color: 'berry',
  tagline: 'Everyone makes mistakes, and a kind sorry helps put hearts back together.',
};

export const SAYING_SORRY_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'knocked-tower',
    comic: 'saying-sorry-knocked-tower',
    kind: 'feel',
    prompt: 'Leo runs by and knocks over the block tower his friend built. How does his friend feel?',
    options: [
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'excited', label: 'Excited', face: 'excited' },
      { id: 'proud', label: 'Proud', face: 'proud' },
    ],
    answerId: 'sad',
    feedbackCorrect: 'Yes, his friend feels sad. When we knock something down, it can hurt a friend’s heart.',
    feedbackOther: 'Such a caring guess! His friend really feels sad that the tower fell, and Leo can help by saying sorry.',
  },
  {
    id: 'own-the-mistake',
    comic: 'saying-sorry-own-the-mistake',
    kind: 'do',
    prompt: 'Leo sees the tower is knocked down and his friend is upset. What is the kind thing to do?',
    options: [
      { id: 'a', label: 'Say "I’m sorry, I knocked it over"' },
      { id: 'b', label: 'Run away and hide' },
      { id: 'c', label: 'Say "It wasn’t me!"' },
    ],
    answerId: 'a',
    feedbackCorrect: 'A brave, kind sorry! Owning our mistake shows a friend we care about their feelings.',
    feedbackOther: 'I understand wanting to do that. The kindest choice is to say "I’m sorry, I knocked it over," so his friend knows Leo cares.',
  },
  {
    id: 'make-it-right',
    comic: 'saying-sorry-make-it-right',
    kind: 'do',
    prompt: 'Leo said sorry. Now what is a kind way to make it right?',
    options: [
      { id: 'a', label: 'Help rebuild the tower together' },
      { id: 'b', label: 'Walk away to play alone' },
      { id: 'c', label: 'Knock down another tower' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Wonderful! Saying sorry and then helping fix things makes a friendship strong again.',
    feedbackOther: 'That’s a thoughtful idea. The kindest way to make it right is to help rebuild the tower together, side by side.',
  },
  {
    id: 'forgiven-friends',
    comic: 'saying-sorry-forgiven-friends',
    kind: 'feel',
    prompt: 'Leo said sorry and helped rebuild the tower. Now the two friends are playing again. How does Leo feel?',
    options: [
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'sad', label: 'Sad', face: 'sad' },
    ],
    answerId: 'happy',
    feedbackCorrect: 'Yes, Leo feels happy! Making things right fills our hearts up with warm, good feelings.',
    feedbackOther: 'Sweet guess! After saying sorry and helping, Leo feels happy and light because his friend forgave him.',
  },
];
