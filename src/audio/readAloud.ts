/**
 * Read-aloud: pre-generated clips of the visible text, in a "Mom voice" or a
 * "Dad voice" (the parent, 2026-10-24: "Indian female mom voice and male dad
 * voice choices. Default mom.").
 *
 * Advisor a9 (quoted ruling): optional, pre-generated Indian-English narration,
 * Mom voice default, Dad voice the alternative, clearly identified as computer
 * readers; audio starts only by a deliberate press, stays interruptible, and
 * reads the visible child-facing words without embellishment. One clip at a
 * time; leaving the screen stops it. If a clip is missing, say so: there is no
 * silent fallback to the browser's own voice.
 *
 * Clips are made at build time by scripts/audio/make-clips.py and named by a
 * hash of (voice, exact words), so an edited line never plays its old audio:
 * the edit has a new name and simply has no clip until the next build. The
 * manifest maps each line's text key to that file name per voice.
 */
import { useSyncExternalStore } from 'react';

export type Reader = 'mom' | 'dad';
/** English, or the two family languages (generated fallback only: a parent's recording wins). */
export type ReadLang = 'en' | 'te' | 'ta';

export const READER_LABEL: Record<Reader, string> = { mom: 'Mom voice', dad: 'Dad voice' };

/** `text key -> file stem` per reader and language. */
export type Manifest = Partial<Record<Reader, Partial<Record<ReadLang, Record<string, string>>>>>;

const BASE = import.meta.env.BASE_URL;
const STORE = 'rlc/reader';

/** The same normalisation the build uses, so a key found at build time is found here. */
export function textKey(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------------------- reader --- */

let reader: Reader = (() => {
  try {
    return window.localStorage.getItem(STORE) === 'dad' ? 'dad' : 'mom';
  } catch {
    return 'mom';
  }
})();
const readerListeners = new Set<() => void>();

export function getReader(): Reader {
  return reader;
}
export function setReader(next: Reader): void {
  if (next === reader) return;
  reader = next;
  try {
    window.localStorage.setItem(STORE, next);
  } catch {
    /* not kept: private mode */
  }
  stop();
  readerListeners.forEach((f) => f());
}
export function useReader(): Reader {
  return useSyncExternalStore(
    (f) => {
      readerListeners.add(f);
      return () => readerListeners.delete(f);
    },
    getReader,
    getReader,
  );
}

/* ----------------------------------------------------------- manifest --- */

let manifest: Manifest | null = null;
let loading: Promise<Manifest> | null = null;

/** Fetched once, on the first press of any read button, so pages that never read aloud pay nothing. */
export function loadManifest(fetcher: typeof fetch = fetch): Promise<Manifest> {
  if (manifest) return Promise.resolve(manifest);
  loading ??= fetcher(`${BASE}audio/manifest.json`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<Manifest>;
    })
    .then((m) => (manifest = m))
    .catch((e: unknown) => {
      loading = null;
      throw e;
    });
  return loading;
}

/** For tests: start over. */
export function resetForTests(m: Manifest | null = null): void {
  stop();
  manifest = m;
  loading = null;
}

export function clipUrl(m: Manifest, who: Reader, lang: ReadLang, text: string): string | null {
  const stem = m[who]?.[lang]?.[textKey(text)];
  return stem ? `${BASE}audio/${who}/${stem}.mp3` : null;
}

/* ------------------------------------------------------------- player --- */

/**
 * What is playing: the id of the button that started it, so that button (and
 * only it) shows Stop. A sequence is several clips played back to back, for a
 * button that reads more than one line.
 */
export interface Playing {
  readonly id: string;
}

let playing: Playing | null = null;
let audio: HTMLAudioElement | null = null;
/** Settles the clip in progress when it is stopped, so an interrupted play() returns instead of waiting forever. */
let settle: ((ended: boolean) => void) | null = null;
let run = 0;
const playListeners = new Set<() => void>();
const emit = () => playListeners.forEach((f) => f());

export function getPlaying(): Playing | null {
  return playing;
}
export function usePlaying(): Playing | null {
  return useSyncExternalStore(
    (f) => {
      playListeners.add(f);
      return () => playListeners.delete(f);
    },
    getPlaying,
    getPlaying,
  );
}

/** Stop whatever is playing. Called on every screen change and on a second press. */
export function stop(): void {
  run += 1;
  const s = settle;
  settle = null;
  s?.(false);
  if (audio) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.removeAttribute('src');
    audio.load?.();
  }
  audio = null;
  if (playing) {
    playing = null;
    emit();
  }
}

export type PlayResult = 'played' | 'stopped' | 'missing' | 'failed';

/** Play one clip on the shared element; true when it ends, false on any error. */
function one(url: string, make: () => HTMLAudioElement): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const a = make();
    audio = a;
    const end = (ok: boolean) => {
      if (settle === end) settle = null;
      resolve(ok);
    };
    settle = end;
    a.onended = () => end(true);
    a.onerror = () => end(false);
    a.src = url;
    a.play().catch(() => end(false));
  });
}

/**
 * Play `texts` in order with the chosen reader. Resolves when the sequence ends
 * or is interrupted. 'missing' means at least one line has no clip for this
 * reader (nothing is played, so the child never hears half a page).
 */
export async function play(
  id: string,
  texts: readonly string[],
  lang: ReadLang = 'en',
  make: () => HTMLAudioElement = () => new Audio(),
): Promise<PlayResult> {
  stop();
  const mine = run;
  playing = { id };
  emit();
  let m: Manifest;
  try {
    m = await loadManifest();
  } catch {
    if (mine === run) stop();
    return 'failed';
  }
  if (mine !== run) return 'stopped';
  const urls = texts.map((t) => clipUrl(m, reader, lang, t));
  if (!urls.length || urls.some((u) => u === null)) {
    stop();
    return 'missing';
  }
  for (const url of urls as string[]) {
    if (mine !== run) return 'stopped';
    const ok = await one(url, make);
    if (mine !== run) return 'stopped';
    if (!ok) {
      stop();
      return 'failed';
    }
  }
  stop();
  return 'played';
}

/** Does the chosen reader have every one of these lines? */
export function hasAll(m: Manifest, who: Reader, lang: ReadLang, texts: readonly string[]): boolean {
  return texts.every((t) => clipUrl(m, who, lang, t) !== null);
}

/**
 * The playback volume that brings a family recording to about the level of the
 * generated clips (loudness-normalised to -18 LUFS at build time): measured
 * once per recording from its RMS, never above 1 (the element cannot amplify),
 * so a loud phone recording is turned down and a quiet one is left as loud as
 * it can be. The stored recording is never changed.
 */
const GEN_RMS = 0.125; // RMS of -18 LUFS speech, about -18 dBFS
const volumes = new Map<string, number>();
async function volumeFor(url: string): Promise<number> {
  const known = volumes.get(url);
  if (known !== undefined) return known;
  let v = 1;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctor) {
      const ctx = new Ctor();
      const buf = await ctx.decodeAudioData(await (await fetch(url)).arrayBuffer());
      const d = buf.getChannelData(0);
      let sum = 0;
      let n = 0;
      for (let i = 0; i < d.length; i += 1) {
        if (Math.abs(d[i]) > 0.01) {
          sum += d[i] * d[i];
          n += 1;
        }
      }
      const rms = n ? Math.sqrt(sum / n) : GEN_RMS;
      // Turn a loud recording down; a quiet one cannot be raised by the element,
      // so the generated clips are the ones the family hears as the reference.
      v = Math.min(1, GEN_RMS / rms);
      void ctx.close();
    }
  } catch {
    v = 1;
  }
  volumes.set(url, v);
  return v;
}

/**
 * Play one URL through the same single player: a family recording in the
 * Telugu & Tamil part, so it and a computer clip can never sound at once.
 */
export async function playUrl(id: string, url: string, make: () => HTMLAudioElement = () => new Audio()): Promise<PlayResult> {
  stop();
  const mine = run;
  playing = { id };
  emit();
  const volume = typeof window !== 'undefined' && 'AudioContext' in window ? await volumeFor(url) : 1;
  if (mine !== run) return 'stopped';
  const ok = await one(url, () => {
    const a = make();
    a.volume = volume;
    return a;
  });
  if (mine !== run) return 'stopped';
  stop();
  return ok ? 'played' : 'failed';
}
