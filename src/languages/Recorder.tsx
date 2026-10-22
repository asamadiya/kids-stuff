import { useEffect, useRef, useState } from 'react';
import type { Lang } from './types';
import { LANG_NAME } from './types';
import { clipKey, deleteClip, getClip, onVoicesChange, recordingType, saveClip, voicesChanged } from './voices';

/**
 * The grown-up's recorder for one line in one language (advisor q8 ruling E):
 * record, listen back, then Save explicitly. Saving over an existing
 * recording asks first, and the old one is kept until the new one is saved.
 * Only shown on the adult recording screen, never on a child screen.
 *
 * The microphone is released whenever this recorder goes away: leaving the
 * page, switching language (each line's recorder is keyed by language), the
 * page being hidden, a recorder error, or a permission prompt answered after
 * the grown-up has already left. Only one line records at a time; starting
 * another finishes this one.
 */

/** Finishes whichever recorder on the page is live. */
let stopActive: (() => void) | null = null;

export function Recorder({ id, lang, who, text }: { readonly id: string; readonly lang: Lang; readonly who: string; readonly text: string }) {
  const key = clipKey(id, lang);
  const [have, setHave] = useState(false);
  const [state, setState] = useState<'idle' | 'asking' | 'recording' | 'review' | 'error'>('idle');
  const [take, setTake] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState('');
  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  /** Bumped on every start and on teardown, so a late permission answer knows it is stale. */
  const attempt = useRef(0);
  const mounted = useRef(true);

  const release = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  };
  /** Finish the take normally: Stop pressed, or another line started. */
  const stopThis = () => {
    if (rec.current && rec.current.state !== 'inactive') rec.current.stop();
    else release();
  };
  /** Stop and drop the take: the recorder is going away. */
  const teardown = () => {
    attempt.current += 1;
    const r = rec.current;
    rec.current = null;
    if (r) {
      r.ondataavailable = null;
      r.onstop = null;
      r.onerror = null;
      if (r.state !== 'inactive') r.stop();
    }
    release();
    if (stopActive === stopThis) stopActive = null;
  };

  useEffect(() => {
    const refresh = () => {
      getClip(key)
        .then((c) => mounted.current && setHave(Boolean(c)))
        .catch(() => mounted.current && setHave(false));
    };
    refresh();
    return onVoicesChange(refresh);
  }, [key]);

  useEffect(() => {
    mounted.current = true;
    const hide = () => teardown();
    window.addEventListener('pagehide', hide);
    return () => {
      mounted.current = false;
      window.removeEventListener('pagehide', hide);
      teardown();
    };
    // teardown reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => (take ? URL.revokeObjectURL(take.url) : undefined), [take]);

  const start = async () => {
    if (state === 'asking' || state === 'recording') return;
    stopActive?.();
    setError('');
    setState('asking');
    const mine = ++attempt.current;
    let s: MediaStream;
    try {
      s = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      if (!mounted.current || mine !== attempt.current) return;
      setError(e instanceof Error && e.name === 'NotAllowedError' ? 'The microphone was not allowed. Allow it in the browser settings and try again.' : 'This browser could not record.');
      setState('error');
      return;
    }
    if (!mounted.current || mine !== attempt.current) {
      s.getTracks().forEach((t) => t.stop());
      return;
    }
    stream.current = s;
    try {
      const type = recordingType();
      const r = new MediaRecorder(s, type ? { mimeType: type } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      r.onstop = () => {
        release();
        rec.current = null;
        if (stopActive === stopThis) stopActive = null;
        if (!mounted.current) return;
        const blob = new Blob(chunks.current, { type: r.mimeType || type || 'audio/webm' });
        setTake({ blob, url: URL.createObjectURL(blob) });
        setState('review');
      };
      r.onerror = () => {
        teardown();
        if (!mounted.current) return;
        setError('The recording stopped because of a browser error. Try again.');
        setState('error');
      };
      rec.current = r;
      stopActive = stopThis;
      r.start();
      setState('recording');
    } catch {
      teardown();
      setError('This browser could not record.');
      setState('error');
    }
  };

  const save = async () => {
    if (!take) return;
    if (have && !window.confirm(`Replace the saved ${LANG_NAME[lang]} recording of “${text}”?`)) return;
    try {
      await saveClip({ key, blob: take.blob, type: take.blob.type, who: who.trim() || 'Grown-up', at: Date.now() });
    } catch {
      setError('The recording could not be saved. The browser may be out of space, or storage may be blocked. Your take is still here.');
      return;
    }
    setError('');
    setHave(true);
    setTake(null);
    setState('idle');
    voicesChanged();
  };

  const remove = async () => {
    if (!window.confirm(`Delete the ${LANG_NAME[lang]} recording of “${text}”?`)) return;
    try {
      await deleteClip(key);
    } catch {
      setError('The recording could not be deleted. Try again.');
      return;
    }
    setError('');
    setHave(false);
    voicesChanged();
  };

  return (
    <div className={`recorder recorder--${state}`}>
      {state === 'recording' ? (
        <button type="button" className="btn btn--rec" onClick={stopThis}>
          <span className="recorder__dot" aria-hidden="true" /> Stop
        </button>
      ) : state === 'asking' ? (
        <span className="recorder__status">Waiting for the microphone…</span>
      ) : state === 'review' && take ? (
        <>
          <audio src={take.url} controls className="recorder__preview" />
          <button type="button" className="btn btn--primary" onClick={() => void save()}>
            Save
          </button>
          <button type="button" className="btn" onClick={() => { setTake(null); setState('idle'); setError(''); }}>
            Discard
          </button>
        </>
      ) : (
        <>
          <button type="button" className="btn" onClick={() => void start()}>
            <span className="recorder__dot" aria-hidden="true" /> {have ? 'Record again' : 'Record'}
          </button>
          {have ? (
            <button type="button" className="btn btn--quiet" onClick={() => void remove()}>
              Delete
            </button>
          ) : null}
          <span className="recorder__status">{have ? 'Saved' : 'Not recorded yet'}</span>
        </>
      )}
      {error ? <p className="recorder__error" role="alert">{error}</p> : null}
    </div>
  );
}
