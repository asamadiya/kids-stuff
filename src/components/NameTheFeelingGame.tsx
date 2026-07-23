import { useMemo, useState } from 'react';
import {
  FEELING_ROUNDS,
  feelingLabel,
  getFeelingFeedback,
  getFeelingOptions,
} from '../games/feelings';
import type { Feeling } from '../games/feelings';

export function NameTheFeelingGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<Feeling | null>(null);
  const [namedCount, setNamedCount] = useState(0);
  const round = FEELING_ROUNDS[roundIndex];
  const options = useMemo(() => getFeelingOptions(roundIndex), [roundIndex]);

  const chooseFeeling = (feeling: Feeling) => {
    if (selected) return;
    setSelected(feeling);
    setNamedCount((count) => count + 1);
  };

  const nextRound = () => {
    setRoundIndex((index) => (index + 1) % FEELING_ROUNDS.length);
    setSelected(null);
  };

  return (
    <section className="feeling-game" aria-labelledby="feeling-game-title">
      <div className="feeling-game__head">
        <div>
          <p className="feeling-game__eyebrow">Feelings detective</p>
          <h2 id="feeling-game-title" className="feeling-game__title">
            Name the Feeling
          </h2>
        </div>
        <div className="feeling-game__streak" aria-label={`${namedCount} feelings named`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(namedCount, 5)) || '☆'}</span>
          {namedCount} {namedCount === 1 ? 'feeling' : 'feelings'} named
        </div>
      </div>

      <div className="feeling-game__round">
        {round.face ? (
          <div className="feeling-game__face" role="img" aria-label={`${round.feeling} face`}>
            {round.face}
          </div>
        ) : (
          <div className="feeling-game__scene" aria-hidden="true">
            <span>R</span>
            <span>?</span>
          </div>
        )}
        <p className="feeling-game__prompt">{round.prompt}</p>

        <div className="feeling-game__options" aria-label="Choose a feeling">
          {options.map((feeling) => (
            <button
              key={feeling}
              type="button"
              className={`feeling-option${selected === feeling ? ' is-selected' : ''}`}
              aria-pressed={selected === feeling}
              disabled={selected !== null}
              onClick={() => chooseFeeling(feeling)}
            >
              {feelingLabel(feeling)}
            </button>
          ))}
        </div>

        {selected ? (
          <div className="feeling-game__feedback">
            <p role="status">{getFeelingFeedback(round, selected)}</p>
            <button type="button" className="feeling-game__next" onClick={nextRound}>
              Next feeling <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : (
          <p className="feeling-game__hint">
            There can be more than one thoughtful answer. Choose what you notice.
          </p>
        )}
      </div>
    </section>
  );
}

export default NameTheFeelingGame;
