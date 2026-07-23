export const FEELINGS = [
  'happy',
  'sad',
  'angry',
  'scared',
  'excited',
  'proud',
  'shy',
  'calm',
] as const;

export type Feeling = (typeof FEELINGS)[number];

export interface FeelingRound {
  readonly id: string;
  readonly prompt: string;
  readonly feeling: Feeling;
  readonly face?: string;
}

export const FEELING_ROUNDS: readonly FeelingRound[] = [
  {
    id: 'sandy-ice-cream',
    prompt: "Maya's ice cream fell in the sand. How might she feel?",
    feeling: 'sad',
  },
  {
    id: 'painting-applause',
    prompt: "Leo's class clapped for his painting. How might he feel?",
    feeling: 'proud',
  },
  {
    id: 'bedtime-thunder',
    prompt: 'A loud clap of thunder boomed at bedtime. How might Noor feel?',
    feeling: 'scared',
  },
  {
    id: 'museum-tomorrow',
    prompt: 'Ava is visiting the space museum tomorrow. How might she feel?',
    feeling: 'excited',
  },
  {
    id: 'quiet-puzzle',
    prompt: 'Sam is finishing a puzzle in a cozy, quiet room. How might Sam feel?',
    feeling: 'calm',
  },
  {
    id: 'tumbled-tower',
    prompt: "Eli's block tower was knocked over before it was finished. How might he feel?",
    feeling: 'angry',
  },
  {
    id: 'new-class',
    prompt: 'Inez is introducing herself to a brand-new class. How might she feel?',
    feeling: 'shy',
  },
  {
    id: 'friend-arrives',
    prompt: "Kai's best friend arrived for a surprise visit. How might Kai feel?",
    feeling: 'happy',
  },
  { id: 'happy-face', prompt: 'What feeling does this face show?', feeling: 'happy', face: '😄' },
  { id: 'sad-face', prompt: 'What feeling does this face show?', feeling: 'sad', face: '😢' },
  { id: 'angry-face', prompt: 'What feeling does this face show?', feeling: 'angry', face: '😠' },
  { id: 'scared-face', prompt: 'What feeling does this face show?', feeling: 'scared', face: '😨' },
  { id: 'calm-face', prompt: 'What feeling does this face show?', feeling: 'calm', face: '😌' },
  { id: 'excited-face', prompt: 'What feeling does this face show?', feeling: 'excited', face: '🤩' },
] as const;

const SUPPORT: Record<Feeling, string> = {
  happy: 'Happy feelings can feel bright and bouncy.',
  sad: 'Sad is okay. Everyone feels sad sometimes.',
  angry: 'Angry feelings can tell us that something matters to us.',
  scared: 'Scared feelings help our bodies look for safety and support.',
  excited: 'Excited feelings can fill our bodies with extra energy.',
  proud: 'Feeling proud helps us notice our effort and growth.',
  shy: 'Shy feelings are okay. We can take our time warming up.',
  calm: 'Calm feelings can help our bodies rest and notice the world.',
};

export function feelingLabel(feeling: Feeling): string {
  return feeling[0].toUpperCase() + feeling.slice(1);
}

/** Deterministic options keep each round stable while always including its intended feeling. */
export function getFeelingOptions(roundIndex: number): readonly Feeling[] {
  const round = FEELING_ROUNDS[roundIndex % FEELING_ROUNDS.length];
  const answerIndex = FEELINGS.indexOf(round.feeling);
  const options = [
    round.feeling,
    FEELINGS[(answerIndex + 2) % FEELINGS.length],
    FEELINGS[(answerIndex + 4) % FEELINGS.length],
    FEELINGS[(answerIndex + 6) % FEELINGS.length],
  ];
  const rotation = roundIndex % options.length;
  return [...options.slice(rotation), ...options.slice(0, rotation)];
}

export function getFeelingFeedback(round: FeelingRound, selected: Feeling): string {
  if (selected === round.feeling) {
    return `${SUPPORT[selected]} That feeling fits this moment.`;
  }
  return `You noticed ${feelingLabel(selected)}. ${SUPPORT[selected]} ${feelingLabel(
    round.feeling,
  )} could fit this moment too.`;
}
