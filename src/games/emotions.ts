/**
 * The full, nuanced feelings vocabulary (28 emotions) used by the "Big Feelings"
 * game and the picture-based Feeling Scenes. The 8 basics (happy..calm) keep the
 * same keys as ./feelings so their face images are shared. Each emotion belongs to
 * a family so distractor options are close-but-fair, not random.
 */
export type EmotionFamily = 'joy' | 'calm' | 'sad' | 'anger' | 'fear' | 'social' | 'surprise';

export interface EmotionInfo {
  readonly key: string;
  readonly label: string;
  readonly family: EmotionFamily;
  readonly support: string;
}

export const EMOTION_LIST: readonly EmotionInfo[] = [
  { key: 'happy', label: 'Happy', family: 'joy', support: 'Happy feels bright and light inside.' },
  { key: 'excited', label: 'Excited', family: 'joy', support: 'Excited is a fizzy, can’t-wait feeling.' },
  { key: 'proud', label: 'Proud', family: 'joy', support: 'Proud is noticing your own good try.' },
  { key: 'delighted', label: 'Delighted', family: 'joy', support: 'Delighted is a big sparkly kind of happy.' },
  { key: 'grateful', label: 'Grateful', family: 'joy', support: 'Grateful is a warm thank-you feeling in your heart.' },
  { key: 'loved', label: 'Loved', family: 'joy', support: 'Loved is feeling warm and safe with someone who cares.' },
  { key: 'hopeful', label: 'Hopeful', family: 'joy', support: 'Hopeful is looking forward to something good.' },
  { key: 'silly', label: 'Silly', family: 'joy', support: 'Silly is playful and giggly and goofy.' },
  { key: 'confident', label: 'Confident', family: 'joy', support: 'Confident is believing “I can do it.”' },
  { key: 'calm', label: 'Calm', family: 'calm', support: 'Calm feels quiet and cozy inside.' },
  { key: 'sad', label: 'Sad', family: 'sad', support: 'Sad is okay — it helps when someone cares.' },
  { key: 'disappointed', label: 'Disappointed', family: 'sad', support: 'Disappointed is when something you hoped for didn’t happen.' },
  { key: 'lonely', label: 'Lonely', family: 'sad', support: 'Lonely is wishing someone was with you.' },
  { key: 'bored', label: 'Bored', family: 'sad', support: 'Bored is when nothing feels fun to do right now.' },
  { key: 'tired', label: 'Tired', family: 'sad', support: 'Tired is when your body wants to rest.' },
  { key: 'angry', label: 'Angry', family: 'anger', support: 'Angry tells us something felt unfair.' },
  { key: 'frustrated', label: 'Frustrated', family: 'anger', support: 'Frustrated is when something is hard and won’t work yet.' },
  { key: 'annoyed', label: 'Annoyed', family: 'anger', support: 'Annoyed is a little bugged, like an itch.' },
  { key: 'jealous', label: 'Jealous', family: 'anger', support: 'Jealous is wishing you had what someone else has.' },
  { key: 'scared', label: 'Scared', family: 'fear', support: 'Scared helps us stay safe and ask for help.' },
  { key: 'worried', label: 'Worried', family: 'fear', support: 'Worried is when your mind keeps asking “what if?”' },
  { key: 'nervous', label: 'Nervous', family: 'fear', support: 'Nervous is fluttery, like butterflies in your tummy.' },
  { key: 'overwhelmed', label: 'Overwhelmed', family: 'fear', support: 'Overwhelmed is when everything feels like too much at once.' },
  { key: 'shy', label: 'Shy', family: 'social', support: 'Shy is okay — we can warm up slowly.' },
  { key: 'embarrassed', label: 'Embarrassed', family: 'social', support: 'Embarrassed is that warm-cheeks, oops feeling.' },
  { key: 'surprised', label: 'Surprised', family: 'surprise', support: 'Surprised is a quick “whoa, I didn’t expect that!”' },
  { key: 'curious', label: 'Curious', family: 'surprise', support: 'Curious is wanting to know more.' },
  { key: 'confused', label: 'Confused', family: 'surprise', support: 'Confused is when something doesn’t make sense yet.' },
] as const;

export const EMOTIONS = EMOTION_LIST.map((e) => e.key);
export type Emotion = string;

const BY_KEY: Record<string, EmotionInfo> = Object.fromEntries(EMOTION_LIST.map((e) => [e.key, e]));

export function emotionInfo(key: string): EmotionInfo {
  return BY_KEY[key] ?? { key, label: key, family: 'joy', support: '' };
}
export function emotionLabel(key: string): string {
  return emotionInfo(key).label;
}
export function emotionSupport(key: string): string {
  return emotionInfo(key).support;
}

/**
 * Deterministic option list: the answer plus (count-1) distractors, preferring
 * emotions from the SAME family (a real, fair discrimination), then filling from
 * other families. Stable per seed so a round never reshuffles under the child.
 */
export function emotionOptions(answer: string, seed: number, count = 4): readonly string[] {
  const fam = emotionInfo(answer).family;
  const sameFam = EMOTION_LIST.filter((e) => e.family === fam && e.key !== answer).map((e) => e.key);
  const other = EMOTION_LIST.filter((e) => e.family !== fam).map((e) => e.key);
  const rot = <T,>(arr: readonly T[], by: number): T[] => {
    if (arr.length === 0) return [];
    const k = ((by % arr.length) + arr.length) % arr.length;
    return [...arr.slice(k), ...arr.slice(0, k)];
  };
  const pool = [...rot(sameFam, seed), ...rot(other, seed * 3 + 1)];
  const distractors = pool.slice(0, Math.max(0, count - 1));
  const opts = [answer, ...distractors];
  return rot(opts, seed % opts.length);
}

/** Face-mode rounds: one per emotion (show the face -> name it). */
export interface EmotionFaceRound { readonly id: string; readonly emotion: string; }
export const EMOTION_FACE_ROUNDS: readonly EmotionFaceRound[] = EMOTION_LIST.map((e) => ({
  id: `face-${e.key}`,
  emotion: e.key,
}));

/** Story-mode rounds: a short situation -> pick the nuanced feeling. */
export interface EmotionStoryRound { readonly id: string; readonly text: string; readonly emotion: string; }
export const EMOTION_STORY_ROUNDS: readonly EmotionStoryRound[] = [
  { id: 'new-bike', text: "Leo's friend got a shiny new bike, and Leo really wanted one too.", emotion: 'jealous' },
  { id: 'mystery-box', text: 'A mysterious box sat on the table and Leo wondered what was inside.', emotion: 'curious' },
  { id: 'tricky-rules', text: 'The new game had tricky rules Leo just could not figure out.', emotion: 'confused' },
  { id: 'loud-party', text: 'The party was SO loud, with so many kids all at once.', emotion: 'overwhelmed' },
  { id: 'cozy-scarf', text: 'Grandma knitted Leo a cozy warm scarf just for him.', emotion: 'grateful' },
  { id: 'planted-seed', text: "Leo planted a little seed and can't wait to watch it grow.", emotion: 'hopeful' },
  { id: 'funny-face', text: 'Leo made the silliest face and everyone burst out giggling.', emotion: 'silly' },
  { id: 'long-ride', text: 'The car ride went on and on, and there was nothing to do.', emotion: 'bored' },
  { id: 'big-day', text: 'After a huge day at the park, Leo could barely keep his eyes open.', emotion: 'tired' },
  { id: 'surprise-party', text: 'Leo opened the door and everyone shouted, "SURPRISE!"', emotion: 'surprised' },
  { id: 'goodnight-hug', text: 'Mom wrapped Leo in a big, warm goodnight hug.', emotion: 'loved' },
  { id: 'zoo-rain', text: 'The trip to the zoo was called off because of rain.', emotion: 'disappointed' },
  { id: 'untied-shoe', text: "Leo's shoelace came untied for the fifth time in a row.", emotion: 'annoyed' },
  { id: 'trip-class', text: 'Leo tripped right in front of the whole class.', emotion: 'embarrassed' },
  { id: 'rode-bike', text: 'Leo practiced and practiced, and now he can ride his bike!', emotion: 'confident' },
  { id: 'friend-moved', text: 'Leo’s best friend moved far away, and the house felt quiet.', emotion: 'lonely' },
  { id: 'tower-fell', text: 'Leo’s block tower toppled right when it was almost done.', emotion: 'frustrated' },
  { id: 'first-day', text: "It was the first day, and Leo didn't know anybody yet.", emotion: 'nervous' },
  { id: 'winning-goal', text: 'Leo’s team scored the winning goal at the very last second!', emotion: 'delighted' },
  { id: 'strange-noise', text: 'Leo heard a strange noise and wasn’t sure what it was.', emotion: 'worried' },
  { id: 'finished-puzzle', text: 'Leo finished a giant puzzle all by himself.', emotion: 'proud' },
  { id: 'warm-blanket', text: 'Leo curled up cozy and safe under his warm blanket.', emotion: 'calm' },
  { id: 'movie-night', text: 'Leo got to stay up late for a special movie night!', emotion: 'excited' },
  { id: 'lost-toy', text: 'Leo looked everywhere but could not find his favorite toy.', emotion: 'sad' },
] as const;

export const BIG_FEELINGS_META = {
  id: 'big-feelings',
  title: 'Big Feelings',
  icon: '🎭',
  color: 'grape',
  tagline: 'Grow your feelings words — 28 feelings, from calm to curious to grateful.',
} as const;
