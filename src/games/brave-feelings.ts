import type { ComicScenario, ComicMeta } from './comic';

export const BRAVE_FEELINGS_META: ComicMeta = {
  id: 'brave-feelings',
  title: 'Being Brave',
  icon: '🦁',
  color: 'leaf',
  tagline: 'Being afraid and going ahead — the two happen together.',
};

export const BRAVE_FEELINGS_SCENARIOS: readonly ComicScenario[] = [
  {
    id: 'big-slide',
    comic: 'brave-feelings-big-slide',
    kind: 'feel',
    prompt: 'Leo climbs to the top of the tall slide and looks down. How does he feel?',
    options: [
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'happy', label: 'Happy', face: 'happy' },
      { id: 'calm', label: 'Calm', face: 'calm' },
      { id: 'excited', label: 'Excited', face: 'excited' },
    ],
    answerId: 'scared',
    feedbackCorrect: 'Correct. the big slide looks scary from up high, and feeling scared is okay before you try.',
    feedbackOther: 'He might feel a little of that too, but way up high his tummy feels wobbly and scared first.',
  },
  {
    id: 'dark-room',
    comic: 'brave-feelings-dark-room',
    kind: 'do',
    prompt: 'It is bedtime and Leo’s room feels dark and scary. What is the brave thing to do?',
    options: [
      { id: 'a', label: 'Turn on his little night-light and take a slow breath' },
      { id: 'b', label: 'Pull the blanket over his head and cry all night' },
      { id: 'c', label: 'Run to the kitchen and stay up' },
    ],
    answerId: 'a',
    feedbackCorrect: 'Wonderful! A night-light and a slow breath help the scary feeling get smaller so Leo can be brave.',
    feedbackOther: 'That is one idea, but the bravest choice is a little night-light and a slow calming breath.',
  },
  {
    id: 'first-day',
    comic: 'brave-feelings-first-day',
    kind: 'feel',
    prompt: 'It is Leo’s first day at a brand-new class full of children he does not know. How does he feel?',
    options: [
      { id: 'shy', label: 'Shy', face: 'shy' },
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'angry', label: 'Angry', face: 'angry' },
      { id: 'happy', label: 'Happy', face: 'happy' },
    ],
    answerId: 'shy',
    feedbackCorrect: 'That is right, new places can feel shy and scary at first, and that feeling is okay.',
    feedbackOther: 'Maybe a little, but a whole new room of strangers usually makes Leo feel shy and quiet first.',
  },
  {
    id: 'brave-try',
    comic: 'brave-feelings-brave-try',
    kind: 'feel',
    prompt: 'Leo took a deep breath and zoomed down the big slide all by himself. How does he feel now?',
    options: [
      { id: 'proud', label: 'Proud', face: 'proud' },
      { id: 'scared', label: 'Scared', face: 'scared' },
      { id: 'sad', label: 'Sad', face: 'sad' },
      { id: 'shy', label: 'Shy', face: 'shy' },
    ],
    answerId: 'proud',
    feedbackCorrect: 'Correct. Leo felt scared, tried anyway, and now he feels proud and brave, that is what courage feels like.',
    feedbackOther: 'He felt that before he tried, but after being so brave on the slide Leo feels proud of himself.',
  },
];
