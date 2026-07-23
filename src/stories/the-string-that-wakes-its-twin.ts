import type { Story } from '../types';

export const theStringThatWakesItsTwin: Story = {
  slug: 'the-string-that-wakes-its-twin',
  title: 'The String That Wakes Its Twin',
  subtitle:
    'Long ago in India, the sage Bharata’s Natyasastra tells of two matching vinas.',
  domain: 'sound',
  collection: 'historical',
  repeatedPhrase: 'Listen, the quiet string is singing',
  readAloudMinutes: 5,
  learningTakeaway:
    'Pluck one string, and a matching string tuned to the very same note nearby can begin to hum on its own. The sound travels through the air and gently sets the twin string moving.',
  heartTakeaway:
    'Listening closely and patiently can reveal a soft answer that a hurried ear would miss.',
  grownUpFact:
    'This is a gentle retelling of a real idea from the Natyasastra, an ancient Indian treatise on music and drama attributed to the sage Bharata and dated to roughly 200 BCE–200 CE. It describes a test with two vinas (early Indian string instruments) tuned exactly alike: one fixed (dhruva) and one movable (chala). Pluck a string on one, and the matching string on the other answers by itself. This is sympathetic resonance: a string vibrating at a note, such as 220 Hz, can wake another string tuned to the same note through the air. Much later, North Indian instruments like the sitar and sarangi added whole banks of these sympathetic strings.',
  pages: [
    {
      text: 'Long, long ago in India, a wise teacher named Bharata studied music. People say he gathered what he knew into a great book, the Natyasastra. In it he told of two matching vinas, resting side by side. A vina is a gentle string instrument. Both were tuned to sing the very same note. Bharata pointed to the second, still vina. "Listen, the quiet string is singing," he said softly. It is an old tale, warm and true.',
      cue: 'Point to the quiet vina, like Bharata. Can you find the string that has not been touched?',
      scene: {
        id: 'the-string-that-wakes-its-twin-p1-two-vinas',
        focus: 'two matching vinas resting side by side, tuned to the same note',
        composition:
          'Foreground: two long-necked vinas laid on a woven mat, their strings level and matching; midground: the calm sage Bharata kneeling and pointing gently; background: a warm classical Indian hall with soft lamplight and pillars',
        palette: 'marigold gold, teak brown, leaf green, and warm evening amber',
      },
      alt: 'Two matching vinas rest side by side on a mat while a calm teacher points to the quiet one in a warm hall.',
    },
    {
      text: 'Bharata plucked one string on the first vina. Twang. The sound floated softly through the still air. He rested his hand and did not touch the second vina at all. Yet its matching string began to tremble on its own. A faint hum answered underneath the first note. He leaned close and listened, keeping his hands very still.',
      cue: 'Pluck an imaginary string, then freeze. What tiny sound might answer back?',
      scene: {
        id: 'the-string-that-wakes-its-twin-p2-first-answer',
        focus: 'one plucked string sending its sound to the untouched matching string',
        composition:
          'Foreground: the vibrating first string blurring softly; midground: Bharata with a still hand, the untouched second string beginning to shimmer; background: a quiet lamplit room',
        palette: 'sunny gold, pale green, teak brown, and soft coral',
      },
      alt: 'A teacher plucks one vina string and the matching string on the second vina trembles on its own.',
    },
    {
      text: 'He tried once more. Twang, and then the gentlest humming reply came. "Listen, the quiet string is singing," Bharata whispered. The second string moved by itself, though no finger had pulled it. The sound of the first string had crossed the air to wake it. Its answer was smaller, yet it was real enough for patient ears to find.',
      scene: {
        id: 'the-string-that-wakes-its-twin-p3-humming-reply',
        focus: 'the untouched vina string shimmering with a tiny visible vibration',
        composition:
          'Foreground: a subtle blur along the second vina’s matching string; midground: Bharata listening with one hand cupped near his ear; background: the first vina settling into stillness',
        palette: 'soft yellow, garden green, copper, and clear blue',
      },
      alt: 'An untouched vina string trembles softly while a teacher listens with one hand cupped to his ear.',
    },
    {
      text: 'Then a small peg on the second vina slipped loose. Now that string sang a lower note when Bharata tested it. He plucked the first string again, but the neighbour stayed silent. He listened and listened. Nothing answered back. For a moment it seemed the earlier hum had only been a wish.',
      scene: {
        id: 'the-string-that-wakes-its-twin-p4-loose-peg',
        focus: 'one slightly loosened tuning peg and a silent second string',
        composition:
          'Foreground: a tilted wooden tuning peg on the second vina; midground: a thoughtful Bharata plucking the first string; background: the two vinas no longer matching',
        palette: 'muted green, dusty gold, brown, and cloud blue',
      },
      alt: 'A teacher looks thoughtful beside a loosened peg while the untouched string no longer answers.',
    },
    {
      text: 'Bharata turned the loose peg until both vinas matched their note again. He plucked only the first string. A small hum returned from the second, all by itself. "Listen, the quiet string is singing," he said with a smile. He did not shout his joy aloud. A soft answer deserved a soft and gentle room.',
      cue: 'What changed in the quiet string once both vinas matched their note again?',
      scene: {
        id: 'the-string-that-wakes-its-twin-p5-match-restored',
        focus: 'the second string answering again after the peg is retuned',
        composition:
          'Foreground: a level, retuned peg; midground: two gently shimmering matching strings; background: Bharata smiling calmly in the lamplight',
        palette: 'calm green, honey gold, warm brown, and lavender dusk',
      },
      alt: 'Two matching vina strings shimmer gently while a teacher listens with a calm smile.',
    },
    {
      text: 'Bharata understood why hurry could hide such wonder. The first note was easy to hear. The soft hum waited quietly underneath it. He had to still his hands, settle his breath, and truly listen. Only then did one string’s song seem to wake the same song sleeping inside its quiet twin.',
      scene: {
        id: 'the-string-that-wakes-its-twin-p6-quiet-listening',
        focus: 'Bharata sitting still between the two resting vinas',
        composition:
          'Foreground: the vina strings fading into stillness; midground: Bharata breathing slowly, eyes soft; background: evening flowers and warm lamplight',
        palette: 'dusk violet, sage green, amber, and soft cream',
      },
      alt: 'A teacher sits very still and listens between two matching vinas as their sounds fade away.',
    },
    {
      text: 'At moonrise, Bharata laid a soft cloth over both vinas to keep away the night dew. He rested nearby beneath a light blanket. "Listen, the quiet string is singing," he murmured, though now both strings were still. In his memory, one clear note and one gentle answer floated together. Slowly he drifted into a warm and cozy sleep. Goodnight.',
      scene: {
        id: 'the-string-that-wakes-its-twin-p7-covered-vinas',
        focus: 'the two vinas covered by cloth beside the resting teacher in moonlight',
        composition:
          'Foreground: cloth-draped vinas at rest; midground: Bharata sleeping peacefully under a light blanket; background: a moonlit hall and quiet flowers',
        palette: 'moon blue, sage, pale gold, and warm linen',
      },
      alt: 'Two vinas rest under a cloth while the teacher sleeps nearby in gentle moonlight.',
    },
  ],
};
