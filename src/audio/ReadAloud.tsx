import { useEffect, useState } from 'react';
import type { ReadLang } from './readAloud';
import { READER_LABEL, play, stop, usePlaying, useReader } from './readAloud';

/**
 * The child's speaker button: press to hear the words, press again to stop.
 * It never starts on its own (advisor a9 point 2). If there is no clip, it
 * says so in words rather than going quiet (a9: "If audio is unavailable, say
 * so visibly — no silent browser fallback").
 *
 * `id` must be unique on the screen; `texts` are the exact visible lines, read
 * in order.
 */
export function ReadAloud({
  id,
  texts,
  lang = 'en',
  label = 'Read it to me',
  compact = false,
}: {
  readonly id: string;
  readonly texts: readonly string[];
  readonly lang?: ReadLang;
  readonly label?: string;
  /** Icon only, for a button beside a single short line (a step, an answer choice). */
  readonly compact?: boolean;
}) {
  const playing = usePlaying();
  const reader = useReader();
  const [problem, setProblem] = useState<'' | 'missing' | 'failed'>('');
  const on = playing?.id === id;
  const key = texts.join('');

  // A different line under the same button, or another reader: clear the old problem.
  useEffect(() => setProblem(''), [key, reader]);

  const press = async () => {
    if (on) {
      stop();
      return;
    }
    setProblem('');
    const r = await play(id, texts, lang);
    if (r === 'missing' || r === 'failed') setProblem(r);
  };

  const name = on ? 'Stop' : label;
  return (
    <span className={`readaloud${compact ? ' readaloud--compact' : ''}`}>
      <button
        type="button"
        className={`readaloud__btn${on ? ' is-on' : ''}`}
        onClick={() => void press()}
        aria-pressed={on}
        aria-label={compact ? `${name} (${READER_LABEL[reader]})` : undefined}
        title={`${name} · ${READER_LABEL[reader]}, a computer voice`}
      >
        <ReadGlyph on={on} />
        {compact ? null : <span className="readaloud__label">{name}</span>}
      </button>
      {problem ? (
        <span className="readaloud__problem" role="status">
          {problem === 'missing' ? 'No recording of this yet.' : 'This could not play. Check the sound and try again.'}
        </span>
      ) : null}
    </span>
  );
}

function ReadGlyph({ on }: { readonly on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {on ? (
        <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
      ) : (
        <>
          <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
          <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
