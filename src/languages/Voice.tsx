import { useEffect, useRef, useState } from 'react';
import type { Lang } from './types';
import { LANG_PARENT } from './types';
import { clipKey, getClip, isCurrent, onVoicesChange } from './voices';

/**
 * Play a parent's recording of one line. A child-facing control: play and
 * replay only (advisor q8 ruling E). With no recording, it says nothing to the
 * child and asks the grown-up to say the line together instead. A recording
 * made from different words (the line was rewritten since) is not played.
 */
export function Voice({ id, lang, script, label }: { readonly id: string; readonly lang: Lang; readonly script: string; readonly label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [who, setWho] = useState('');
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    let made: string | null = null;
    const load = () =>
      getClip(clipKey(id, lang))
        .then((c) => {
          if (!alive) return;
          if (made) URL.revokeObjectURL(made);
          made = c && isCurrent(c, script) ? URL.createObjectURL(c.blob) : null;
          setUrl(made);
          setWho(made ? (c?.who ?? '') : '');
        })
        .catch(() => alive && setUrl(null));
    load();
    const off = onVoicesChange(load);
    return () => {
      alive = false;
      off();
      if (made) URL.revokeObjectURL(made);
    };
  }, [id, lang, script]);

  if (!url) {
    return (
      <span className="voice voice--none" title={`No recording yet. ${LANG_PARENT[lang]} can record it under For grown-ups → Record voices.`}>
        <SpeakerGlyph off />
        <span className="voice__say">Say it together</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      className="voice"
      aria-label={`Play ${who || LANG_PARENT[lang]} saying ${label}`}
      onClick={() => {
        audio.current?.pause();
        audio.current = new Audio(url);
        void audio.current.play();
      }}
    >
      <SpeakerGlyph />
      <span className="voice__who">{who || LANG_PARENT[lang]}</span>
    </button>
  );
}

export function SpeakerGlyph({ off = false }: { readonly off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {off ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      )}
    </svg>
  );
}
