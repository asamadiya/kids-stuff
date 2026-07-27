/**
 * Reading aloud. Rikki is five and does not read fluently yet, so every
 * workshop tool can speak its labels. Speech is a courtesy, never a
 * requirement: if the browser has no voices, these are no-ops.
 */
export function canSpeak(): boolean {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  } catch {
    return false;
  }
}

export function say(text: string): void {
  if (!canSpeak() || !text.trim()) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
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
