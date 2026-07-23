export const SCENES_META = {
  id: 'scenes',
  title: 'Feeling Scenes',
  icon: '🎬',
  color: 'berry',
  tagline: 'Real situations with friends and little sister — how does everyone feel?',
} as const;

import { FEELINGS } from './feelings';
import type { Feeling } from './feelings';

export interface Scene {
  readonly id: string;
  readonly who: string;
  readonly text: string;
  readonly feeling: Feeling;
}

export const SCENE_ROUNDS: readonly Scene[] = [
  { id: 'blocks-knocked', who: 'Leo', text: 'Leo built a tall block tower. A friend bumped into it and it all fell down.', feeling: 'sad' },
  { id: 'left-out', who: 'Leo', text: 'The other kids started a fun game and forgot to ask Leo to join.', feeling: 'sad' },
  { id: 'pushed', who: 'Leo', text: 'Another boy pushed past Leo to get to the slide first.', feeling: 'angry' },
  { id: 'new-friend', who: 'Leo', text: 'A new kid at the park smiled and asked Leo to play together.', feeling: 'happy' },
  { id: 'sister-grabs', who: 'Leo', text: 'Leo was playing when baby Mia grabbed his toy truck and would not let go.', feeling: 'angry' },
  { id: 'sister-cries', who: 'Mia', text: 'Baby Mia tripped and started to cry. Leo hurried over to help.', feeling: 'sad' },
  { id: 'share-snack', who: 'Leo', text: 'Leo broke his cookie in half and shared it with his friend.', feeling: 'happy' },
  { id: 'lost-game', who: 'Leo', text: 'Leo tried his best but did not win the board game.', feeling: 'sad' },
  { id: 'won-race', who: 'Leo', text: 'Leo ran as fast as he could and crossed the finish line first!', feeling: 'excited' },
  { id: 'big-slide', who: 'Leo', text: 'The slide at the new park looked very tall and steep.', feeling: 'scared' },
  { id: 'dog-barks', who: 'Leo', text: 'A big dog barked loudly right next to Leo.', feeling: 'scared' },
  { id: 'show-drawing', who: 'Leo', text: 'Leo drew a rocket ship and showed it to the whole class.', feeling: 'proud' },
  { id: 'first-day', who: 'Leo', text: 'It was Leo\'s very first day and he did not know anyone yet.', feeling: 'shy' },
  { id: 'teased', who: 'Leo', text: 'Some kids giggled at the silly hat Leo was wearing.', feeling: 'sad' },
  { id: 'waiting-turn', who: 'Leo', text: 'Leo took a deep breath and waited calmly for his turn on the swing.', feeling: 'calm' },
  { id: 'sister-scribble', who: 'Leo', text: 'Baby Mia scribbled with crayon all over the picture Leo made.', feeling: 'angry' },
  { id: 'help-mom', who: 'Leo', text: 'Leo helped carry the grocery bag and Mom said thank you.', feeling: 'proud' },
  { id: 'surprise-gift', who: 'Leo', text: 'Leo opened a present and it was exactly the toy he wanted!', feeling: 'excited' },
  { id: 'quiet-reading', who: 'Leo', text: 'Leo curled up with a cozy picture book before bedtime.', feeling: 'calm' },
  { id: 'new-party', who: 'Leo', text: 'Leo walked into a big birthday party full of kids he did not know.', feeling: 'shy' },
];

/** Four feeling-face options, always including the scene's answer. */
export function getSceneOptions(index: number): readonly Feeling[] {
  const round = SCENE_ROUNDS[index % SCENE_ROUNDS.length];
  const ai = FEELINGS.indexOf(round.feeling);
  const opts = [round.feeling, FEELINGS[(ai + 2) % FEELINGS.length], FEELINGS[(ai + 4) % FEELINGS.length], FEELINGS[(ai + 6) % FEELINGS.length]];
  const rot = index % opts.length;
  return [...opts.slice(rot), ...opts.slice(0, rot)];
}

const SUPPORT: Record<string, string> = {
  happy: 'Happy feels warm and light.', sad: 'Sad is okay — it helps when someone cares.',
  angry: 'Angry tells us something felt unfair. We can take a big breath.',
  scared: 'Scared helps us stay safe and ask for help.', excited: 'Excited is that fizzy, can\'t-wait feeling!',
  proud: 'Proud means we notice our own good try.', shy: 'Shy is okay — we can warm up slowly.',
  calm: 'Calm feels quiet and cozy inside.',
};

export function sceneLabel(f: Feeling): string { return f[0].toUpperCase() + f.slice(1); }

export function getSceneFeedback(round: Scene, sel: Feeling): string {
  if (sel === round.feeling) return `Yes — ${round.who} might feel ${round.feeling}. ${SUPPORT[round.feeling]}`;
  return `You noticed ${sceneLabel(sel)}. ${SUPPORT[sel]} ${round.who} might feel ${round.feeling} here too.`;
}
