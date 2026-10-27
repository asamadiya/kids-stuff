import { useEffect, useId, useState } from 'react';
import type { Lang } from './types';
import { LANG_PARENT } from './types';
import { clipKey, getClip, isCurrent, onVoicesChange } from './voices';
import { ReadAloud } from '../audio/ReadAloud';
import { getPlaying, playUrl, stop, usePlaying } from '../audio/readAloud';

/**
 * Play a family recording of one line; without one, invite the grown-up to
 * say it together and offer a labelled computer voice (advisor a9 point 4).
 *
 * The family recording always comes first, so the computer voice is offered
 * only once the lookup has finished and found no recording made from these
 * exact words. While the lookup runs nothing is offered; if storage fails,
 * the line says so rather than passing it off as "not recorded".
 */
type Found =
  | { readonly key: string; readonly state: 'loading' }
  | { readonly key: string; readonly state: 'none' }
  | { readonly key: string; readonly state: 'failed' }
  | { readonly key: string; readonly state: 'own'; readonly url: string; readonly who: string };

export function Voice({
  id,
  lang,
  script,
  label,
  computerLabel = 'Computer voice',
}: {
  readonly id: string;
  readonly lang: Lang;
  readonly script: string;
  readonly label: string;
  /** The fallback button's words; on a rhyme "Computer voice: the words", because it speaks the rhyme, it does not sing it. */
  readonly computerLabel?: string;
}) {
  // What this control's state belongs to: a result for another line is never shown.
  const key = `${clipKey(id, lang)}|${script}`;
  const [found, setFound] = useState<Found>({ key, state: 'loading' });
  const [problem, setProblem] = useState('');
  const playing = usePlaying();
  // Unique per control, so two controls for the same line never both show Stop.
  const uid = useId();
  const own = `own/${uid}`;

  useEffect(() => {
    let alive = true;
    let made: string | null = null;
    setFound({ key, state: 'loading' });
    setProblem('');
    const load = () =>
      getClip(clipKey(id, lang))
        .then((c) => {
          if (!alive) return;
          if (made) URL.revokeObjectURL(made);
          made = c && isCurrent(c, script) ? URL.createObjectURL(c.blob) : null;
          setFound(made ? { key, state: 'own', url: made, who: c?.who ?? '' } : { key, state: 'none' });
        })
        .catch(() => alive && setFound({ key, state: 'failed' }));
    void load();
    const off = onVoicesChange(() => void load());
    return () => {
      alive = false;
      off();
      if (getPlaying()?.id === own) stop();
      if (made) URL.revokeObjectURL(made);
    };
  }, [id, lang, script, key, own]);

  const current: Found = found.key === key ? found : { key, state: 'loading' };

  if (current.state === 'loading') {
    return (
      <span className="voice voice--none voice--wait" aria-busy="true">
        …
      </span>
    );
  }
  if (current.state === 'none' || current.state === 'failed') {
    return (
      <span className="voice-pair">
        <span className="voice-invite" title={`${LANG_PARENT[lang]} can record it under For grown-ups → Record voices.`}>
          Say it together
        </span>
        <ReadAloud id={`pc/${uid}/${lang}`} texts={[script]} lang={lang} label={computerLabel} />
        {current.state === 'failed' ? (
          <span className="readaloud__problem" role="status">
            Family recordings could not be read on this device.
          </span>
        ) : null}
      </span>
    );
  }
  const on = playing?.id === own;
  const who = current.who || LANG_PARENT[lang];
  return (
    <span className="voice-pair">
      <button
        type="button"
        className={`voice${on ? ' is-on' : ''}`}
        aria-label={on ? `Stop ${who}’s recording` : `Play ${who} saying ${label}`}
        aria-pressed={on}
        onClick={async () => {
          if (on) return stop();
          setProblem('');
          const r = await playUrl(own, current.url);
          if (r === 'failed') setProblem('This recording could not play. Check the sound and try again.');
        }}
      >
        {on ? <StopGlyph /> : <SpeakerGlyph />}
        <span className="voice__who">{on ? 'Stop' : `${who}’s recording`}</span>
      </button>
      {problem ? (
        <span className="readaloud__problem" role="status">
          {problem}
        </span>
      ) : null}
    </span>
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

function StopGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}
