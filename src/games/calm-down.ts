import type { ComicScenario, ComicMeta } from './comic';

export const CALM_DOWN_META: ComicMeta = {
  id: 'calm-down',
  title: 'Strong Feelings',
  icon: '🌬️',
  color: 'sky',
  tagline: 'Noticing anger before it arrives, and what steadies it.',
};

export const CALM_DOWN_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'tower',
    comic: 'calm-down-tower',
    kind: 'feel',
    prompt: 'How does Leo feel when his block tower crashes down?',
    options: [
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'proud', label: 'Proud', face: 'proud' },
    ],
    answerId: 'angry',
    feedbackCorrect: 'Yes, his tower fell and he feels angry. Feeling angry is okay, and we can notice it.',
    feedbackOther: 'A crash can feel like lots of things! Leo feels angry that his tall tower fell, and noticing that is the first step to feeling better.',
  },
  {
    id: 'breathe',
    comic: 'calm-down-breathe',
    kind: 'do',
    prompt: 'Leo feels angry and hot inside. What is a calm thing to do?',
    options: [
      { id: 'a', label: 'Take a slow, deep breath' },
      { id: 'b', label: 'Throw the blocks hard' },
      { id: 'c', label: 'Stomp and yell' },
    ],
    answerId: 'a',
    feedbackCorrect: 'A slow, deep breath helps a big feeling get smaller. Breathe in like you smell a flower, out like you blow a bubble.',
    feedbackOther: 'When we feel big, our body wants to move fast. But a slow, deep breath is the calmest choice, and it helps the angry feeling float away.',
  },
  {
    id: 'count',
    comic: 'calm-down-count',
    kind: 'do',
    prompt: 'Mia knocked over Leo’s puzzle. What can Leo do to stay calm?',
    options: [
      { id: 'a', label: 'Count slowly to five' },
      { id: 'b', label: 'Grab the puzzle away' },
      { id: 'c', label: 'Shout at Mia' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Counting slowly to five gives the angry feeling time to calm down before Leo talks.',
    feedbackOther: 'Mia is little and still learning. Counting slowly to five helps Leo feel calm again, so he can be gentle with his sister.',
  },
  {
    id: 'help',
    comic: 'calm-down-help',
    kind: 'feel',
    prompt: 'Leo took three breaths and asked Dad for a hug. How does he feel now?',
    options: [
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'scared', label: 'Scared', face: 'scared' },
    ],
    answerId: 'calm',
    feedbackCorrect: 'Breaths and a helping hug from Dad made the big feeling smaller. Now Leo feels calm and cozy.',
    feedbackOther: 'When feelings get too big, asking a grown-up for help is brave. Dad’s hug helped Leo feel calm again.',
  },
];
