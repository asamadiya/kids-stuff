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
 * A key is `${itemId}:${lang}`, e.g. `bath-time.g0:te`. Ids follow a line's
 * place in its moment, rhyme or book, so each clip also keeps the exact script
 * it was recorded from: when the words are rewritten, the old recording no
 * longer matches and is not played (design review, round 3 confirm).
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
  /** The script of the line when it was recorded. A clip without one predates this check. */
  readonly script?: string;
}

/** A clip may be played for a line only if it was recorded from the same words. */
export const isCurrent = (c: Pick<Clip, 'script'> | undefined, script: string): boolean => c?.script === script;

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
/** Every clip's key and the script it was recorded from. */
export const allScripts = () => allClips().then((cs) => new Map(cs.map((c) => [c.key, c.script ?? ''])));
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
    clips.map(async (c) => ({ key: c.key, type: c.type, who: c.who, at: c.at, script: c.script, data: await blobToBase64(c.blob) })),
  );
  return new Blob([JSON.stringify({ kind: 'rlc-voices', version: 1, clips: enc })], { type: 'application/json' });
}

/** A file made by `exportAll`, read and checked in full but not yet written. */
export interface PendingImport {
  readonly clips: readonly Clip[];
  /** Keys in the file that already have a recording on this device. */
  readonly replaces: readonly string[];
}

const KEY = /^[a-z0-9-]+(?:\.[a-z0-9-]+)*:(te|ta)$/;

/**
 * Read and check every entry of an exported file before anything is written,
 * so a bad entry anywhere rejects the whole file and nothing half-imports.
 */
export async function readImport(file: File): Promise<PendingImport> {
  const clips = parseImport(await file.text());
  const have = await allScripts();
  return { clips, replaces: clips.map((c) => c.key).filter((k) => have.has(k)) };
}

/** Check every entry of an export file's text; throws on the first bad one. */
export function parseImport(text: string): Clip[] {
  const bad = new Error('That file is not a saved set of recordings from this app.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw bad;
  }
  const p = parsed as { kind?: unknown; clips?: unknown };
  if (p.kind !== 'rlc-voices' || !Array.isArray(p.clips)) throw bad;
  const seen = new Set<string>();
  return p.clips.map((raw, i): Clip => {
    const c = raw as Record<string, unknown>;
    const ok =
      typeof c.key === 'string' && KEY.test(c.key) && !seen.has(c.key) &&
      typeof c.type === 'string' && c.type.startsWith('audio/') &&
      typeof c.who === 'string' && typeof c.at === 'number' && Number.isFinite(c.at) &&
      (c.script === undefined || typeof c.script === 'string') &&
      typeof c.data === 'string' && c.data.length > 0;
    if (!ok) throw new Error(`Recording ${i + 1} in that file is damaged, so nothing was loaded.`);
    seen.add(c.key as string);
    let blob: Blob;
    try {
      blob = base64ToBlob(c.data as string, c.type as string);
    } catch {
      throw new Error(`Recording ${i + 1} in that file is damaged, so nothing was loaded.`);
    }
    return { key: c.key as string, type: c.type as string, who: (c.who as string).slice(0, 40), at: c.at as number, blob, ...(typeof c.script === 'string' ? { script: c.script } : {}) };
  });
}

/** Write a checked import in one transaction: all of it, or none of it. */
export async function commitImport(pending: PendingImport): Promise<number> {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(STORE, 'readwrite');
    const s = t.objectStore(STORE);
    for (const c of pending.clips) s.put(c);
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error ?? new Error('The recordings could not be saved.'));
  });
  voicesChanged();
  return pending.clips.length;
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
