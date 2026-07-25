import type { ComicScenario, ComicMeta } from './comic';

export const EVERYONE_INCLUDED_META: ComicMeta = {
  id: 'everyone-included',
  title: 'Everyone Included',
  icon: '🌈',
  color: 'grape',
  tagline: 'Noticing who has been left out, and asking them in.',
};

export const EVERYONE_INCLUDED_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'lonely-bench',
    comic: 'everyone-included-lonely-bench',
    kind: 'feel',
    prompt: 'A new boy sits alone on the bench while everyone plays. How does he feel?',
    options: [
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'excited', label: 'Excited', face: 'excited' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'proud', label: 'Proud', face: 'proud' },
    ],
    answerId: 'sad',
    feedbackCorrect: 'Yes, he feels sad and lonely watching from the bench. Noticing that feeling is the first step to including him.',
    feedbackOther: 'It can be hard to tell from far away. Sitting alone while others play often feels sad and lonely, and now Leo can help.',
  },
  {
    id: 'open-the-circle',
    comic: 'everyone-included-open-the-circle',
    kind: 'do',
    prompt: 'Leo sees a girl standing outside the game circle, wanting to join. What is the kind thing to do?',
    options: [
      { id: 'a', label: 'Wave her over and make a spot in the circle' },
      { id: 'b', label: 'Keep playing and pretend not to see her' },
      { id: 'c', label: 'Tell her the game is only for his friends' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Waving her over makes the circle bigger. One kind invitation turns a bystander into a friend.',
    feedbackOther: 'That would leave her out in the cold. The kindest choice is to wave her over and make a spot, so everyone gets to play.',
  },
  {
    id: 'you-can-be-on-my-team',
    comic: 'everyone-included-you-can-be-on-my-team',
    kind: 'feel',
    prompt: 'Teams are picked and one boy is left with no team. Then Leo says, "You can be on my team!" How does the boy feel now?',
    options: [
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'angry', label: 'Angry', face: 'angry' },
    ],
    answerId: 'happy',
    feedbackCorrect: 'He feels happy and welcome! Being chosen for the team tells him he belongs.',
    feedbackOther: 'Look at his big smile once Leo picks him. Being welcomed onto the team makes him feel happy and included.',
  },
  {
    id: 'room-at-the-table',
    comic: 'everyone-included-room-at-the-table',
    kind: 'do',
    prompt: 'At lunch the table is full and a boy holding his tray has nowhere to sit. What should Leo do?',
    options: [
      { id: 'a', label: 'Scoot over and make room for him to sit' },
      { id: 'b', label: 'Put his backpack on the empty chair' },
      { id: 'c', label: 'Look away and hope someone else helps' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Scooting over makes room for one more. A little space at the table says, "You belong here with us."',
    feedbackOther: 'That leaves him standing alone with his tray. The caring choice is to scoot over and make room so he has a place to sit.',
  },
];
