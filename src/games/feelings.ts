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

export const NAMETHEFEELING_META = {
  id: 'name-the-feeling',
  title: 'Name the Feeling',
  icon: '😊',
  color: 'berry',
  tagline: 'Reading a feeling from a face, a word, or a situation.',
} as const;

/** A big, friendly emoji face for each feeling, used by the picture-based modes. */
export const FEELING_FACES: Record<Feeling, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😠',
  scared: '😨',
  excited: '🤩',
  proud: '😊',
  shy: '😳',
  calm: '😌',
};

export function feelingFace(feeling: Feeling): string {
  return FEELING_FACES[feeling];
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

/* ------------------------------------------------------------------ */
/*  Multi-mode content: five playful ways to notice and name feelings  */
/* ------------------------------------------------------------------ */

export type FeelingMode = 'story' | 'faces' | 'letter' | 'find' | 'opposite';

export interface FeelingModeInfo {
  readonly id: FeelingMode;
  readonly label: string;
  readonly icon: string;
  readonly eyebrow: string;
  readonly hint: string;
}

export const FEELING_MODES: readonly FeelingModeInfo[] = [
  {
    id: 'story',
    label: 'Story',
    icon: '📖',
    eyebrow: 'Feelings · Story',
    hint: 'Read the little story, then pick the feeling that fits.',
  },
  {
    id: 'faces',
    label: 'Faces',
    icon: '😄',
    eyebrow: 'Feelings · Faces',
    hint: 'Look at the big face and pick the feeling it shows.',
  },
  {
    id: 'letter',
    label: 'First Letter',
    icon: '🔤',
    eyebrow: 'Feelings · First Letter',
    hint: 'Say the feeling out loud, then pick its first letter.',
  },
  {
    id: 'find',
    label: 'Find the Face',
    icon: '🔎',
    eyebrow: 'Feelings · Find the Face',
    hint: 'Read the feeling word, then pick the face that matches.',
  },
  {
    id: 'opposite',
    label: 'Opposite',
    icon: '🔁',
    eyebrow: 'Feelings · Opposite',
    hint: 'Pick a feeling that feels the other way. Feelings are friends, not truly opposite.',
  },
] as const;

export function feelingModeInfo(mode: FeelingMode): FeelingModeInfo {
  const found = FEELING_MODES.find((m) => m.id === mode);
  return found ?? FEELING_MODES[0];
}

/* ---- Mode 2: Faces (emoji face -> feeling) ---- */

export interface FaceRound {
  readonly id: string;
  readonly feeling: Feeling;
  readonly face: string;
}

export const FACE_ROUNDS: readonly FaceRound[] = FEELINGS.map((feeling) => ({
  id: `face-${feeling}`,
  feeling,
  face: FEELING_FACES[feeling],
}));

export function getFaceOptions(roundIndex: number): readonly Feeling[] {
  return getFeelingModeOptions(FACE_ROUNDS[roundIndex % FACE_ROUNDS.length].feeling, roundIndex);
}

export function getFaceFeedback(round: FaceRound, selected: Feeling): string {
  if (selected === round.feeling) {
    return `Correct. ${round.face} shows ${feelingLabel(round.feeling)}. ${SUPPORT[round.feeling]}`;
  }
  return `You saw ${feelingLabel(selected)}. That is a great guess! This face ${round.face} is showing ${feelingLabel(
    round.feeling,
  )}.`;
}

/* ---- Mode 3: First Letter (feeling -> uppercase first letter) ---- */

export interface LetterRound {
  readonly id: string;
  readonly feeling: Feeling;
  readonly letter: string;
  readonly face: string;
}

export const LETTER_ROUNDS: readonly LetterRound[] = FEELINGS.map((feeling) => ({
  id: `letter-${feeling}`,
  feeling,
  letter: feeling[0].toUpperCase(),
  face: FEELING_FACES[feeling],
}));

const LETTER_POOL = ['A', 'B', 'C', 'E', 'H', 'P', 'S'] as const;

export function getLetterOptions(roundIndex: number): readonly string[] {
  const round = LETTER_ROUNDS[roundIndex % LETTER_ROUNDS.length];
  const distractors = LETTER_POOL.filter((l) => l !== round.letter);
  const start = roundIndex % distractors.length;
  const picked = [
    distractors[start % distractors.length],
    distractors[(start + 2) % distractors.length],
  ];
  const unique: string[] = [];
  for (const l of picked) {
    if (!unique.includes(l)) unique.push(l);
  }
  let fill = 0;
  while (unique.length < 2) {
    const candidate = distractors[fill % distractors.length];
    if (!unique.includes(candidate)) unique.push(candidate);
    fill += 1;
  }
  const options = [round.letter, ...unique];
  const rotation = roundIndex % options.length;
  return [...options.slice(rotation), ...options.slice(0, rotation)];
}

export function getLetterFeedback(round: LetterRound, selected: string): string {
  if (selected === round.letter) {
    return `Right! ${feelingLabel(round.feeling)} starts with ${round.letter}. ${round.letter} for ${feelingLabel(
      round.feeling,
    )}!`;
  }
  return `Nice looking, you chose ${selected}. ${feelingLabel(round.feeling)} begins with the letter ${round.letter}.`;
}

/* ---- Mode 4: Find the Face (feeling word -> matching emoji face) ---- */

export interface FindRound {
  readonly id: string;
  readonly feeling: Feeling;
  readonly face: string;
}

export const FIND_ROUNDS: readonly FindRound[] = FEELINGS.map((feeling) => ({
  id: `find-${feeling}`,
  feeling,
  face: FEELING_FACES[feeling],
}));

export function getFindOptions(roundIndex: number): readonly string[] {
  const round = FIND_ROUNDS[roundIndex % FIND_ROUNDS.length];
  const feelings = getFeelingModeOptions(round.feeling, roundIndex).slice(0, 3);
  const withAnswer = feelings.includes(round.feeling)
    ? feelings
    : [round.feeling, feelings[1], feelings[2]];
  return withAnswer.map((f) => FEELING_FACES[f]);
}

export function getFindFeedback(round: FindRound, selectedFace: string): string {
  if (selectedFace === round.face) {
    return `You found it! ${round.face} is the ${feelingLabel(round.feeling)} face. ${SUPPORT[round.feeling]}`;
  }
  return `Good hunting! You picked ${selectedFace}. The ${feelingLabel(round.feeling)} face is ${round.face}.`;
}

/* ---- Mode 5: Opposite Feeling (feeling -> its gentle opposite) ---- */

export interface OppositeRound {
  readonly id: string;
  readonly feeling: Feeling;
  readonly opposite: Feeling;
}

export const OPPOSITE_ROUNDS: readonly OppositeRound[] = [
  { id: 'opp-happy', feeling: 'happy', opposite: 'sad' },
  { id: 'opp-sad', feeling: 'sad', opposite: 'happy' },
  { id: 'opp-calm', feeling: 'calm', opposite: 'scared' },
  { id: 'opp-scared', feeling: 'scared', opposite: 'calm' },
  { id: 'opp-proud', feeling: 'proud', opposite: 'shy' },
  { id: 'opp-shy', feeling: 'shy', opposite: 'proud' },
  { id: 'opp-excited', feeling: 'excited', opposite: 'calm' },
  { id: 'opp-angry', feeling: 'angry', opposite: 'calm' },
  { id: 'opp-calm-excited', feeling: 'calm', opposite: 'excited' },
  { id: 'opp-happy-angry', feeling: 'happy', opposite: 'angry' },
] as const;

export function getOppositeOptions(roundIndex: number): readonly Feeling[] {
  const round = OPPOSITE_ROUNDS[roundIndex % OPPOSITE_ROUNDS.length];
  const answerIndex = FEELINGS.indexOf(round.opposite);
  const distractors: Feeling[] = [];
  let step = 1;
  while (distractors.length < 2) {
    const candidate = FEELINGS[(answerIndex + step) % FEELINGS.length];
    if (candidate !== round.opposite && candidate !== round.feeling && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
    step += 1;
  }
  const options = [round.opposite, ...distractors];
  const rotation = roundIndex % options.length;
  return [...options.slice(rotation), ...options.slice(0, rotation)];
}

export function getOppositeFeedback(round: OppositeRound, selected: Feeling): string {
  if (selected === round.opposite) {
    return `Nice match! ${feelingLabel(round.feeling)} and ${feelingLabel(
      round.opposite,
    )} feel like the other way around.`;
  }
  return `You chose ${feelingLabel(selected)} — a fine feeling! The other-way feeling from ${feelingLabel(
    round.feeling,
  )} is ${feelingLabel(round.opposite)}.`;
}

/* ---- Shared helper for feeling-answer option lists (deterministic, includes answer) ---- */

export function getFeelingModeOptions(answer: Feeling, seed: number): readonly Feeling[] {
  const answerIndex = FEELINGS.indexOf(answer);
  const options = [
    answer,
    FEELINGS[(answerIndex + 3) % FEELINGS.length],
    FEELINGS[(answerIndex + 5) % FEELINGS.length],
    FEELINGS[(answerIndex + 6) % FEELINGS.length],
  ];
  const unique: Feeling[] = [];
  for (const f of options) {
    if (!unique.includes(f)) unique.push(f);
  }
  let extra = 1;
  while (unique.length < 4) {
    const candidate = FEELINGS[(answerIndex + 6 + extra) % FEELINGS.length];
    if (!unique.includes(candidate)) unique.push(candidate);
    extra += 1;
  }
  const four = unique.slice(0, 4);
  const rotation = seed % four.length;
  return [...four.slice(rotation), ...four.slice(0, rotation)];
}
