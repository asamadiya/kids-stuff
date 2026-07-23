import type { Story } from '../types';

export const theMusicInTheStrings: Story = {
  slug: 'the-music-in-the-strings',
  title: 'The Music in the Strings',
  subtitle: 'Long ago, people told of Pythagoras and the singing strings of Croton.',
  domain: 'sound',
  collection: 'historical',
  repeatedPhrase: 'Listen low, listen high',
  readAloudMinutes: 5,
  learningTakeaway:
    'Holding the same string at a shorter length makes its sound higher, and letting the whole string ring makes its sound lower.',
  heartTakeaway:
    'Patient listening helps us notice a small, quiet difference without rushing or forcing it.',
  grownUpFact:
    'Pythagoras of Samos lived around 570 to 495 BCE and moved to Croton in southern Italy about 530 to 520 BCE, where he gathered a community of thinkers. He left no writings, so the famous tales of him discovering music in a smithy or on a string are gentle legends told long after, not recorded events. The real physics holds true: for a stretched string under the same tension, a shorter vibrating length rings at a higher pitch, and halving the length raises it by one octave.',
  pages: [
    {
      text: 'Long ago in a seaside town called Croton, people told a story. Maybe it happened just so, and maybe not. It is an old tale, the gentle kind grown-ups still like to share. A thinker named Pythagoras had come from across the sea. He loved quiet sounds. One evening he sat beside a plain lyre with a single string across its warm wooden frame.',
      cue: 'Sit still like Pythagoras. Can you make your ears very quiet and ready to listen?',
      scene: {
        id: 'the-music-in-the-strings-p1',
        focus: 'Pythagoras sitting quietly beside a small single-string lyre in a Croton courtyard',
        composition:
          'foreground: small wooden lyre with one string on a woven mat; midground: Pythagoras seated calmly, one hand near the string; background: Croton courtyard wall and olive branches in golden light',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; golden light',
      },
      alt: 'Pythagoras sits quietly beside a small single-string lyre on a woven mat in a warm courtyard.',
    },
    {
      text: 'First he let the whole string ring free. Thrum, it sang, round and low. Then he rested a fingertip at the middle and plucked the shorter part. That sound seemed lighter and higher. He lifted his finger, and the low sound came back. "Listen low, listen high," he said softly to the evening air.',
      cue: 'Hold one hand out like a string, then touch its middle with one finger.',
      scene: {
        id: 'the-music-in-the-strings-p2',
        focus: 'Pythagoras pinching the middle of the lyre string to make a higher sound',
        composition:
          'foreground: one full string path with a marked middle touch point; midground: careful fingers on the string; background: quiet workbench and softening courtyard light',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; dusk light',
      },
      alt: 'Pythagoras pinches the middle of the lyre string with one finger while it sounds higher.',
    },
    {
      text: 'He tried it again to be sure. He kept the frame steady and heard the long part sing. Then he held the middle and heard the short part. Long sounded lower. Short sounded higher. Pythagoras placed a dark pebble beside the long sound and a pale shell beside the short one.',
      scene: {
        id: 'the-music-in-the-strings-p3',
        focus: 'A pebble and a shell marking the low sound and the high sound beside the lyre',
        composition:
          'foreground: dark pebble marker and pale shell marker; midground: lyre with long and short spans visible; background: courtyard doorway at dusk',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; dusk light',
      },
      alt: 'A dark pebble and a pale shell sit beside a lyre, marking the low sound and the high sound.',
    },
    {
      text: 'A breeze lifted the mat, and his finger slipped too near the frame. The little sound buzzed instead of ringing. His brow folded softly. He had wanted the two sounds to come easily. But Pythagoras did not rush or grumble. He smoothed the mat flat and waited for the string to rest.',
      scene: {
        id: 'the-music-in-the-strings-p4',
        focus: 'Pythagoras pausing calmly after a buzzy, unclear sound',
        composition:
          'foreground: lifted mat corner and lyre resting flat; midground: Pythagoras pausing, smoothing the mat; background: breeze-bent olive leaves and gloaming courtyard',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; gloaming light',
      },
      alt: 'Pythagoras pauses gently after a buzzy sound, smoothing the mat while the lyre rests flat.',
    },
    {
      text: 'He tied a loop of soft yarn to mark the true middle. Then he set one finger there and breathed out slowly. "Listen low, listen high," he said again. The two sounds returned, gentle and clear. He smiled, because he had not forced the string. He had only steadied his hand and listened once more.',
      cue: 'Which sound would you match with the shell, the lower one or the higher one?',
      scene: {
        id: 'the-music-in-the-strings-p5',
        focus: 'A yarn loop marks the string middle as Pythagoras listens again',
        composition:
          'foreground: soft yarn middle marker with shell and pebble; midground: Pythagoras holding one finger lightly on the string; background: first lamp glow and still olive branches',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; gloaming light',
      },
      alt: 'A soft yarn loop marks the string middle while Pythagoras rests one finger there and listens.',
    },
    {
      text: 'One last time, he heard the full string and then the shorter string. The order stayed the same: lower, then higher. Pythagoras set the lyre gently aside without shouting any grand rule. One careful change had made one clear sound. Patient ears had been enough to notice it in the quiet.',
      scene: {
        id: 'the-music-in-the-strings-p6',
        focus: 'Pythagoras setting the lyre safely aside after his patient listening',
        composition:
          'foreground: lyre shelf with paired shell and pebble; midground: Pythagoras lifting the lyre with both hands; background: moonrise over the courtyard and a closed workbench',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; moonrise light',
      },
      alt: 'Pythagoras lifts the lyre with both hands to set it safely aside, a shell and pebble nearby.',
    },
    {
      text: 'That night the lyre rested beneath a linen cloth. Pythagoras lay near an open window while olive leaves moved like slow hands. "Listen low, listen high," he murmured. Then even the courtyard grew still. The pale shell shone beside the dark pebble, and his breathing softened. All was quiet and warm. Goodnight.',
      scene: {
        id: 'the-music-in-the-strings-p7',
        focus: 'The covered lyre, shell, and pebble near a resting Pythagoras',
        composition:
          'foreground: covered lyre with pale shell beside dark pebble; midground: Pythagoras resting under a light blanket; background: open moonlit window and a still courtyard wall',
        palette: 'sea blue, olive green, warm clay, honey wood, and moon silver; deep-night light',
      },
      alt: 'A covered lyre with a shell and pebble sits near Pythagoras resting under a light blanket by a moonlit window.',
    },
  ],
};
