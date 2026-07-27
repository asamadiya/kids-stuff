/**
 * Reading aloud. Rikki is five and does not read fluently yet, so every
 * workshop tool and exercise can speak its labels. Speech is a courtesy, never
 * a requirement: if the browser has no voices, these are no-ops.
 *
 * The first version of this module built a bare utterance and spoke it, which
 * meant the platform default voice answered. On Chromium/Linux that is usually
 * the eSpeak family — the robotic one. Three separate faults produced the
 * "robotic and weird" report, and fixing only the first would have appeared to
 * change nothing:
 *
 *   1. No voice was ever selected.
 *   2. `getVoices()` is populated asynchronously in Chrome and returns `[]`
 *      until `voiceschanged` fires, so a one-shot pick at module load silently
 *      gets an empty list and the default keeps speaking.
 *   3. `cancel()` immediately followed by `speak()` is a documented Chrome race
 *      that clips or drops the beginning of the utterance.
 */

/**
 * Ranked preference, as data. Tier 1 names voices that are known to be good and
 * are widely installed; below that we prefer network voices (`localService ===
 * false`), which are markedly better than the bundled ones, then anything
 * matching the page language. eSpeak-family names are ranked last so they are
 * only ever chosen when the machine has nothing else.
 */
const PREFERRED_NAMES: readonly string[] = [
  'Google UK English Female',
  'Google US English',
  'Microsoft Aria Online (Natural)',
  'Samantha',
  'Ava',
  'Serena',
  'Daniel',
];

/** Substrings identifying the synthetic-sounding fallbacks, matched case-insensitively. */
const LAST_RESORT = /espeak|festival|pico|flite|robosoft|mbrola/i;

/** Lower score sorts first. */
function rank(voice: SpeechSynthesisVoice, lang: string): number {
  const named = PREFERRED_NAMES.findIndex((n) => voice.name === n);
  if (named >= 0) return named;
  if (LAST_RESORT.test(voice.name)) return 900;
  const langMatch = voice.lang && voice.lang.toLowerCase().startsWith(lang);
  // Network voices beat local ones; a language match beats a mismatch.
  if (!voice.localService) return langMatch ? 100 : 150;
  if (langMatch) return 200;
  return 300;
}

let cached: SpeechSynthesisVoice | null = null;
let cachedFor: SpeechSynthesis | null = null;
let listening: SpeechSynthesis | null = null;

function pageLang(): string {
  try {
    return (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  } catch {
    return 'en';
  }
}

/**
 * Resolve lazily and cache. The cache is dropped on `voiceschanged` so a list
 * that arrives late — the common case in Chrome — is honoured on the next call
 * rather than being locked out by an early empty read.
 */
function pickVoice(): SpeechSynthesisVoice | null {
  try {
    const synth = window.speechSynthesis;
    // The cache belongs to one synthesiser. If we are looking at a different
    // one, the old answer is meaningless.
    if (cachedFor !== synth) {
      cached = null;
      cachedFor = synth;
    }
    if (cached) return cached;
    if (listening !== synth) {
      listening = synth;
      synth.addEventListener?.('voiceschanged', () => {
        cached = null;
      });
    }
    const voices = synth.getVoices();
    if (!voices || voices.length === 0) return null;
    const lang = pageLang();
    const best = [...voices].sort((a, b) => rank(a, lang) - rank(b, lang))[0];
    cached = best ?? null;
    return cached;
  } catch {
    return null;
  }
}

export function canSpeak(): boolean {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  } catch {
    return false;
  }
}

/** The voice that would speak now, or null while the list is still empty. Exported for tests. */
export function currentVoice(): SpeechSynthesisVoice | null {
  if (!canSpeak()) return null;
  return pickVoice();
}

export function say(text: string): void {
  if (!canSpeak() || !text.trim()) return;
  try {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) {
      u.voice = voice;
      if (voice.lang) u.lang = voice.lang;
    }
    // Slightly slower than the 0.95 default: read-aloud for a five-year-old who
    // is following the words on screen, not a notification.
    u.rate = 0.9;
    u.pitch = 1;
    synth.cancel();
    // cancel() and speak() in the same task clips the start of the utterance in
    // Chrome. Yielding once lets the queue actually drain first.
    setTimeout(() => {
      try {
        synth.speak(u);
      } catch {
        /* silence is fine */
      }
    }, 0);
  } catch {
    /* silence is fine */
  }
}

export function stopSpeaking(): void {
  if (!canSpeak()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* nothing to stop */
  }
}
