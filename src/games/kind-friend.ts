import type { ComicScenario, ComicMeta } from './comic';

export const KIND_FRIEND_META: ComicMeta = {
  id: 'kind-friend',
  title: 'Being a Kind Friend',
  icon: '💛',
  color: 'sun',
  tagline: 'What kindness looks like when someone is having a hard time.',
};

export const KIND_FRIEND_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'fallen-tower',
    comic: 'kind-friend-fallen-tower',
    kind: 'feel',
    prompt: 'Leo’s friend built a tall block tower, and it just tumbled down. How does his friend feel?',
    options: [
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'excited', label: 'Excited', face: 'excited' },
    ],
    answerId: 'sad',
    feedbackCorrect: 'Correct. he feels sad that his tower fell. A kind friend notices sad feelings and helps.',
    feedbackOther: 'His tower crashed down, so he feels sad. When we see a friend is sad, we can help them feel better.',
  },
  {
    id: 'help-rebuild',
    comic: 'kind-friend-help-rebuild',
    kind: 'do',
    prompt: 'Leo’s friend is sad his tower fell. What is the kind thing Leo can do?',
    options: [
      { id: 'a', label: 'Sit down and help him build it again' },
      { id: 'b', label: 'Walk away and play by himself' },
      { id: 'c', label: 'Laugh at the fallen blocks' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Helping him rebuild is so kind! Doing a hard thing together makes it easier and more fun.',
    feedbackOther: 'That might make him feel more sad. The kindest choice is to sit down and help him build the tower again.',
  },
  {
    id: 'scraped-knee',
    comic: 'kind-friend-scraped-knee',
    kind: 'do',
    prompt: 'On the playground, Leo’s friend trips and scrapes her knee. What is the caring thing to do?',
    options: [
      { id: 'a', label: 'Ask if she’s okay and get a grown-up to help' },
      { id: 'b', label: 'Keep running to the swings' },
      { id: 'c', label: 'Tell her to stop crying' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Checking on her and finding a grown-up is exactly what a kind friend does. You take good care of people!',
    feedbackOther: 'She is hurt and needs comfort. The caring choice is to ask if she’s okay and get a grown-up to help.',
  },
  {
    id: 'shared-snack',
    comic: 'kind-friend-shared-snack',
    kind: 'feel',
    prompt: 'Leo shares half of his apple slices with a friend who forgot her snack. How does his friend feel now?',
    options: [
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'scared', label: 'Scared', face: 'scared' },
    ],
    answerId: 'happy',
    feedbackCorrect: 'She feels happy and thankful! Sharing what we have is a warm way to be a kind friend.',
    feedbackOther: 'When Leo shares his snack, his friend feels happy and cared for. Sharing spreads kindness.',
  },
];
