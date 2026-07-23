import type { ComicScenario, ComicMeta } from './comic';

export const WIN_OR_LOSE_META: ComicMeta = {
  id: 'win-or-lose',
  title: 'Win or Lose',
  icon: '🏅',
  color: 'plum',
  tagline: 'Winning is fun, but being kind and cheering others on makes everyone a champion.',
};

export const WIN_OR_LOSE_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'lost-the-race',
    comic: 'win-or-lose-lost-the-race',
    kind: 'feel',
    prompt: 'Leo ran his hardest but his friend crossed the line first. How does he feel?',
    options: [
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'excited', label: 'Excited', face: 'excited' },
    ],
    answerId: 'sad',
    feedbackCorrect: 'Yes, Leo feels sad that he did not win, and it is okay to feel sad for a little while.',
    feedbackOther: 'Losing can bring big feelings. Leo feels sad he did not win, and that feeling will get smaller soon.',
  },
  {
    id: 'shake-hands',
    comic: 'win-or-lose-shake-hands',
    kind: 'do',
    prompt: 'Leo lost the race. What is the good-sport thing to do?',
    options: [
      { id: 'a', label: 'Say "Good running!" and shake his hand' },
      { id: 'b', label: 'Say the race was not fair' },
      { id: 'c', label: 'Walk away without looking' },
    ],
    answerId: 'a',
    feedbackCorrect: 'That is being a good sport! Saying "Good running!" shows Leo can be happy for his friend even when he loses.',
    feedbackOther: 'A tricky moment. The kindest choice is to shake hands and say "Good running!" so both friends still feel good.',
  },
  {
    id: 'cheer-mia',
    comic: 'win-or-lose-cheer-mia',
    kind: 'feel',
    prompt: 'Little sister Mia stacked her very first tall tower and Leo clapped for her. How does Leo feel?',
    options: [
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'shy', label: 'Shy', face: 'shy' },
    ],
    answerId: 'proud',
    feedbackCorrect: 'Leo feels proud cheering for Mia! Being happy for someone else is its own kind of winning.',
    feedbackOther: 'Look at Leo clapping and smiling. He feels proud of Mia, because cheering others on feels wonderful.',
  },
  {
    id: 'board-game-win',
    comic: 'win-or-lose-board-game-win',
    kind: 'do',
    prompt: 'Leo just won the board game and his friend looks sad. What is the kind thing to do?',
    options: [
      { id: 'a', label: 'Say "You played great! Want to play again?"' },
      { id: 'b', label: 'Cheer loudly "I won, I won!"' },
      { id: 'c', label: 'Tell his friend he is not good at games' },
    ],
    answerId: 'a',
    feedbackCorrect: 'That is a gentle winner! Leo can be happy he won and still be kind, so his friend smiles too.',
    feedbackOther: 'When we win, kind words help most. Leo says "You played great! Want to play again?" and his friend feels better.',
  },
];
