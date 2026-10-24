import type { Reader } from './readAloud';
import { READER_LABEL, setReader, useReader } from './readAloud';

/**
 * Which computer voice reads aloud: Mom voice (the default) or Dad voice.
 * Remembered on this device. Named "computer reader" where the choice is made
 * (advisor a9 point 1), and never "Amma" or "Nanna": those are the parents'
 * own recordings, in the Telugu & Tamil part.
 */
export function ReaderSwitch() {
  const reader = useReader();
  return (
    <div className="readerswitch" role="radiogroup" aria-label="Computer reader">
      <span className="readerswitch__name" aria-hidden="true">
        Reader
      </span>
      {(['mom', 'dad'] as const satisfies readonly Reader[]).map((r) => (
        <button
          key={r}
          type="button"
          role="radio"
          aria-checked={reader === r}
          className={`readerswitch__btn${reader === r ? ' is-on' : ''}`}
          onClick={() => setReader(r)}
          title={`${READER_LABEL[r]}: a computer voice reads aloud`}
        >
          {r === 'mom' ? 'Mom' : 'Dad'}
        </button>
      ))}
    </div>
  );
}
