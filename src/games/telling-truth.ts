import type { ComicScenario, ComicMeta } from './comic';

export const TELLING_TRUTH_META: ComicMeta = {
  id: 'telling-truth',
  title: 'Telling the Truth',
  icon: '🫖',
  color: 'sky',
  tagline: 'Telling the truth when a lie would be easier.',
};

export const TELLING_TRUTH_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'broken-teapot',
    comic: 'telling-truth-broken-teapot',
    kind: 'feel',
    prompt: 'Leo was playing ball inside and knocked over the little teapot. It broke. How does Leo feel right after it breaks?',
    options: [
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'excited', label: 'Excited', face: 'excited' },
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'proud', label: 'Proud', face: 'proud' },
    ],
    answerId: 'scared',
    feedbackCorrect: 'Correct. Leo feels scared about what will happen. Scary feelings are okay, and the truth can still come out.',
    feedbackOther: 'That is a kind guess. Right when something breaks, Leo mostly feels scared about what will happen next.',
  },
  {
    id: 'what-to-say',
    comic: 'telling-truth-what-to-say',
    kind: 'do',
    prompt: 'Mom comes in and asks who broke the teapot. What is the honest thing for Leo to do?',
    options: [
      { id: 'a', label: 'Say "I did it, I am sorry."' },
      { id: 'b', label: 'Say the cat did it.' },
      { id: 'c', label: 'Hide and stay very quiet.' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Telling the truth is brave. Saying "I did it" helps Mom trust Leo, even when it is hard.',
    feedbackOther: 'That feels safer for a moment, but the truth still helps most. Leo can say "I did it, I am sorry."',
  },
  {
    id: 'told-the-truth',
    comic: 'telling-truth-told-the-truth',
    kind: 'feel',
    prompt: 'Leo tells the truth, and Mom gives him a warm hug. How does Leo feel now?',
    options: [
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'shy', label: 'Shy', face: 'shy' },
    ],
    answerId: 'calm',
    feedbackCorrect: 'Correct. After the truth is out, Leo feels calm and light. Honesty gives our hearts a big relief.',
    feedbackOther: 'A gentle guess. Once the truth is told and Mom hugs him, Leo mostly feels calm and relieved.',
  },
  {
    id: 'friends-cookie',
    comic: 'telling-truth-friends-cookie',
    kind: 'do',
    prompt: 'Leo ate the last cookie that his friend Sam was saving. Sam asks what happened. What should Leo do?',
    options: [
      { id: 'a', label: 'Tell Sam the truth and share his snack.' },
      { id: 'b', label: 'Say he never saw the cookie.' },
      { id: 'c', label: 'Blame his little sister Mia.' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Kind and honest! Telling Sam the truth and sharing keeps their friendship strong.',
    feedbackOther: 'That might feel easier, but the true and caring thing is to tell Sam and share his own snack.',
  },
];
