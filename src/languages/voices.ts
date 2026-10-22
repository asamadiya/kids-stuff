/**
 * The parents' own recorded voices, kept on this device only.
 *
 * Advisor q8 ruling E: no text-to-speech; Nanna records the Telugu and Amma
 * the Tamil (or a grandparent); child screens only play; recording happens on
 * an adult screen with a preview and an explicit Save, and the old recording
 * stays until its replacement is saved. Stored in IndexedDB, never uploaded,
 * with export, import and delete. Clearing site data or changing device
 * loses them, and the grown-ups screen says so.
 *
 * A key is `${itemId}:${lang}`, e.g. `bath-time.g0:te`.
 */
import type { Lang } from './types';

const DB = 'rlc-voices';
const STORE = 'clips';

export interface Clip {
  readonly key: string;
  readonly blob: Blob;
  readonly type: string;
  /** Who recorded it, as the grown-up typed it ("Nanna", "Paati"). */
  readonly who: string;
  readonly at: number;
}

export const clipKey = (id: string, lang: Lang) => `${id}:${lang}`;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('This browser cannot keep recordings.'));
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'key' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const r = run(t.objectStore(STORE));
        t.oncomplete = () => resolve(r.result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

export const getClip = (key: string) => tx<Clip | undefined>('readonly', (s) => s.get(key) as IDBRequest<Clip | undefined>);
export const allKeys = () => tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys()).then((ks) => new Set(ks.map(String)));
export const saveClip = (c: Clip) => tx<IDBValidKey>('readwrite', (s) => s.put(c));
export const deleteClip = (key: string) => tx<undefined>('readwrite', (s) => s.delete(key));
export const allClips = () => tx<Clip[]>('readonly', (s) => s.getAll() as IDBRequest<Clip[]>);
export const clearAll = () => tx<undefined>('readwrite', (s) => s.clear());

/** Listeners refresh when a clip is saved or deleted elsewhere on the page. */
const listeners = new Set<() => void>();
export const onVoicesChange = (f: () => void): (() => void) => {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
};
export const voicesChanged = () => listeners.forEach((f) => f());

/** One file holding every recording, for the grown-up to keep a copy. */
export async function exportAll(): Promise<Blob> {
  const clips = await allClips();
  const enc = await Promise.all(
    clips.map(async (c) => ({ key: c.key, type: c.type, who: c.who, at: c.at, data: await blobToBase64(c.blob) })),
  );
  return new Blob([JSON.stringify({ kind: 'rlc-voices', version: 1, clips: enc })], { type: 'application/json' });
}

/** Read a file made by `exportAll`. Returns how many recordings were added or replaced. */
export async function importAll(file: File): Promise<number> {
  const parsed = JSON.parse(await file.text()) as { kind?: string; clips?: Array<{ key: string; type: string; who: string; at: number; data: string }> };
  if (parsed.kind !== 'rlc-voices' || !Array.isArray(parsed.clips)) throw new Error('That file is not a saved set of recordings.');
  for (const c of parsed.clips) await saveClip({ key: c.key, type: c.type, who: c.who, at: c.at, blob: base64ToBlob(c.data, c.type) });
  voicesChanged();
  return parsed.clips.length;
}

function blobToBase64(b: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(b);
  });
}

function base64ToBlob(b64: string, type: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type });
}

/** The best audio format this browser can record. */
export function recordingType(): string {
  const options = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'];
  return typeof MediaRecorder !== 'undefined' ? options.find((t) => MediaRecorder.isTypeSupported?.(t)) ?? '' : '';
}
