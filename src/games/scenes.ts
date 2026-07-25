import { emotionLabel, emotionOptions, emotionSupport } from './emotions';

export const SCENES_META = {
  id: 'scenes',
  title: 'Feeling Scenes',
  icon: '🎬',
  color: 'berry',
  tagline: 'Ordinary situations with friends and a small sister. What is each person feeling?',
} as const;

export interface Scene {
  readonly id: string;
  readonly who: string;
  readonly text: string;
  /** A nuanced emotion key (see ./emotions). */
  readonly feeling: string;
}

/** Scenes reuse the existing illustrated situations, now with nuanced feelings. */
export const SCENE_ROUNDS: readonly Scene[] = [
  { id: 'blocks-knocked', who: 'Leo', text: 'Leo built a tall block tower. A friend bumped into it and it all fell down.', feeling: 'frustrated' },
  { id: 'left-out', who: 'Leo', text: 'The other kids started a fun game and forgot to ask Leo to join.', feeling: 'lonely' },
  { id: 'pushed', who: 'Leo', text: 'Another boy pushed past Leo to get to the slide first.', feeling: 'angry' },
  { id: 'new-friend', who: 'Leo', text: 'A new kid at the park smiled and asked Leo to play together.', feeling: 'happy' },
  { id: 'sister-grabs', who: 'Leo', text: 'Leo was playing when baby Mia grabbed his toy truck and would not let go.', feeling: 'frustrated' },
  { id: 'sister-cries', who: 'Mia', text: 'Baby Mia tripped and started to cry. Leo hurried over to help.', feeling: 'sad' },
  { id: 'share-snack', who: 'Leo', text: 'Leo broke his cookie in half and shared it with his friend.', feeling: 'happy' },
  { id: 'lost-game', who: 'Leo', text: 'Leo tried his best but did not win the board game.', feeling: 'disappointed' },
  { id: 'won-race', who: 'Leo', text: 'Leo ran as fast as he could and crossed the finish line first!', feeling: 'excited' },
  { id: 'big-slide', who: 'Leo', text: 'The slide at the new park looked very tall and steep.', feeling: 'nervous' },
  { id: 'dog-barks', who: 'Leo', text: 'A big dog barked loudly right next to Leo.', feeling: 'scared' },
  { id: 'show-drawing', who: 'Leo', text: 'Leo drew a rocket ship and showed it to the whole class.', feeling: 'proud' },
  { id: 'first-day', who: 'Leo', text: 'It was Leo’s very first day and he did not know anyone yet.', feeling: 'nervous' },
  { id: 'teased', who: 'Leo', text: 'Some kids giggled at the silly hat Leo was wearing.', feeling: 'embarrassed' },
  { id: 'waiting-turn', who: 'Leo', text: 'Leo took a deep breath and waited calmly for his turn on the swing.', feeling: 'calm' },
  { id: 'sister-scribble', who: 'Leo', text: 'Baby Mia scribbled with crayon all over the picture Leo made.', feeling: 'annoyed' },
  { id: 'help-mom', who: 'Leo', text: 'Leo helped carry the grocery bag and Mom said thank you.', feeling: 'proud' },
  { id: 'surprise-gift', who: 'Leo', text: 'Leo opened a present and it was exactly the toy he wanted!', feeling: 'delighted' },
  { id: 'quiet-reading', who: 'Leo', text: 'Leo curled up with a cozy picture book before bedtime.', feeling: 'calm' },
  { id: 'new-party', who: 'Leo', text: 'Leo walked into a big birthday party full of kids he did not know.', feeling: 'shy' },
] as const;

/** Four feeling options, nuanced (same-family distractors), always including the answer. */
export function getSceneOptions(index: number): readonly string[] {
  const round = SCENE_ROUNDS[index % SCENE_ROUNDS.length];
  return emotionOptions(round.feeling, index, 4);
}

export function sceneLabel(feeling: string): string {
  return emotionLabel(feeling);
}

export function getSceneFeedback(round: Scene, sel: string): string {
  if (sel === round.feeling) return `Yes — ${round.who} might feel ${emotionLabel(round.feeling).toLowerCase()}. ${emotionSupport(round.feeling)}`;
  return `You noticed ${emotionLabel(sel)}. ${emotionSupport(sel)} ${round.who} might feel ${emotionLabel(round.feeling).toLowerCase()} here too.`;
}
