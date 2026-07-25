import type { ComicScenario, ComicMeta } from './comic';

export const MAKING_FRIENDS_META: ComicMeta = {
  id: 'making-friends',
  title: 'Making a New Friend',
  icon: '👋',
  color: 'coral',
  tagline: 'The moment before saying hello, and saying it anyway.',
};

export const MAKING_FRIENDS_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'new-park',
    comic: 'making-friends-new-park',
    kind: 'feel',
    prompt: 'A new boy is playing at the park. Leo wants to play too, but he tucks behind the slide. How does Leo feel?',
    options: [
      { id: 'shy', label: 'Shy', face: 'shy' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'angry', label: 'Angry', face: 'angry' },
    ],
    answerId: 'shy',
    feedbackCorrect: 'Correct. Leo feels shy. Feeling shy around someone new is okay, and it can get smaller when you take one small step.',
    feedbackOther: 'What a kind guess! Leo is peeking from behind the slide because he feels shy about someone new, and that feeling is okay.',
  },
  {
    id: 'say-hi',
    comic: 'making-friends-say-hi',
    kind: 'do',
    prompt: 'Leo really wants to play with the new boy. What is the brave, friendly thing to do?',
    options: [
      { id: 'a', label: 'Wave and say a little hi' },
      { id: 'b', label: 'Hide and play all alone' },
      { id: 'c', label: 'Walk away and go home' },
    ],
    answerId: 'a',
    feedbackCorrect: 'A little wave and a friendly hi is a brave, kind way to start. That is how new friends often begin.',
    feedbackOther: 'That is one idea. The bravest, kindest choice is to wave and say a little hi, so the new boy knows Leo wants to be friends.',
  },
  {
    id: 'first-hello',
    comic: 'making-friends-first-hello',
    kind: 'feel',
    prompt: 'Leo took a deep breath and said hi, and the new boy smiled back and waved. How does Leo feel now?',
    options: [
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'sad', label: 'Sad', face: 'sad' },
    ],
    answerId: 'proud',
    feedbackCorrect: 'Leo feels proud! He was brave and said hi, and being brave feels wonderful.',
    feedbackOther: 'Not quite. After his brave hello and that friendly smile, Leo feels proud that he tried.',
  },
  {
    id: 'join-in',
    comic: 'making-friends-join-in',
    kind: 'do',
    prompt: 'The new boy is building a sandcastle. Leo wants to join in. What is the kind thing to do?',
    options: [
      { id: 'a', label: 'Ask, "Can I build with you?"' },
      { id: 'b', label: 'Knock the castle over' },
      { id: 'c', label: 'Grab all the sand toys' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Asking "Can I build with you?" is a kind, friendly way to join in. Now they can play together!',
    feedbackOther: 'Hmm, let us think about how his new friend would feel. The kind way to join in is to ask, "Can I build with you?"',
  },
];
