/**
 * A single shared AudioContext for the workshop. Sound is always incidental —
 * every tool must remain fully usable in silence, so nothing here throws and
 * nothing here is awaited.
 */
let ctx: AudioContext | null = null;
let failed = false;

function audio(): AudioContext | null {
  if (failed) return null;
  if (ctx) return ctx;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) { failed = true; return null; }
    ctx = new Ctor();
    return ctx;
  } catch {
    failed = true;
    return null;
  }
}

export function audioAvailable(): boolean {
  return audio() !== null;
}

/** A short plucked note. `freq` in hertz. */
export function pluck(freq: number, duration = 0.45, type: OscillatorType = 'triangle'): void {
  const a = audio();
  if (!a) return;
  try {
    if (a.state === 'suspended') void a.resume();
    const now = a.currentTime;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(a.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    /* silence is an acceptable outcome */
  }
}

/** A sustained tone. Returns a stop function; calling it twice is safe. */
export function drone(freq: number, type: OscillatorType = 'sine'): () => void {
  const a = audio();
  if (!a) return () => {};
  try {
    if (a.state === 'suspended') void a.resume();
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, a.currentTime);
    gain.gain.setValueAtTime(0.0001, a.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.14, a.currentTime + 0.08);
    osc.connect(gain).connect(a.destination);
    osc.start();
    let stopped = false;
    return () => {
      if (stopped) return;
      stopped = true;
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.08);
        osc.stop(a.currentTime + 0.12);
      } catch { /* already gone */ }
    };
  } catch {
    return () => {};
  }
}

/** Equal-tempered pitch for a scale step, A4 = 440Hz. */
export const step = (semitonesFromA4: number): number => 440 * 2 ** (semitonesFromA4 / 12);
