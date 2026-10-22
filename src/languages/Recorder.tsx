import { useEffect, useRef, useState } from 'react';
import type { Lang } from './types';
import { LANG_NAME } from './types';
import { clipKey, deleteClip, getClip, recordingType, saveClip, voicesChanged } from './voices';

/**
 * The grown-up's recorder for one line in one language (advisor q8 ruling E):
 * record, listen back, then Save explicitly. Saving over an existing
 * recording asks first, and the old one is kept until the new one is saved.
 * Only shown on the adult recording screen, never on a child screen.
 */
export function Recorder({ id, lang, who, text }: { readonly id: string; readonly lang: Lang; readonly who: string; readonly text: string }) {
  const key = clipKey(id, lang);
  const [have, setHave] = useState(false);
  const [state, setState] = useState<'idle' | 'recording' | 'review' | 'error'>('idle');
  const [take, setTake] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState('');
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    getClip(key).then((c) => setHave(Boolean(c))).catch(() => setHave(false));
  }, [key]);
  useEffect(() => () => (take ? URL.revokeObjectURL(take.url) : undefined), [take]);

  const start = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = recordingType();
      const r = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: r.mimeType || type || 'audio/webm' });
        setTake({ blob, url: URL.createObjectURL(blob) });
        setState('review');
      };
      rec.current = r;
      r.start();
      setState('recording');
    } catch (e) {
      setError(e instanceof Error && e.name === 'NotAllowedError' ? 'The microphone was not allowed. Allow it in the browser settings and try again.' : 'This browser could not record.');
      setState('error');
    }
  };

  const save = async () => {
    if (!take) return;
    if (have && !window.confirm(`Replace the saved ${LANG_NAME[lang]} recording of “${text}”?`)) return;
    await saveClip({ key, blob: take.blob, type: take.blob.type, who: who.trim() || 'Grown-up', at: Date.now() });
    setHave(true);
    setTake(null);
    setState('idle');
    voicesChanged();
  };

  const remove = async () => {
    if (!window.confirm(`Delete the ${LANG_NAME[lang]} recording of “${text}”?`)) return;
    await deleteClip(key);
    setHave(false);
    voicesChanged();
  };

  return (
    <div className={`recorder recorder--${state}`}>
      {state === 'recording' ? (
        <button type="button" className="btn btn--rec" onClick={() => rec.current?.stop()}>
          <span className="recorder__dot" aria-hidden="true" /> Stop
        </button>
      ) : state === 'review' && take ? (
        <>
          <audio src={take.url} controls className="recorder__preview" />
          <button type="button" className="btn btn--primary" onClick={() => void save()}>
            Save
          </button>
          <button type="button" className="btn" onClick={() => { setTake(null); setState('idle'); }}>
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
      {error ? <p className="recorder__error">{error}</p> : null}
    </div>
  );
}
