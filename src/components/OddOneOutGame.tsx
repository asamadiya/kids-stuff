import { useState } from 'react';
import {
  ODDONEOUT_META,
  ODD_ROUNDS,
  getOddOptions,
  getOddFeedback,
  itemLabel,
  type OddItem,
} from '../games/odd-one-out';

const EYEBROW = 'Look & think';
const TITLE = ODDONEOUT_META.title;

export function OddOneOutGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<OddItem | null>(null);
  const [score, setScore] = useState(0);

  const round = ODD_ROUNDS[roundIndex];
  const options = getOddOptions(round, roundIndex);
  const answer = round.odd;
  const answered = chosen !== null;
  const feedback = chosen ? getOddFeedback(round, chosen) : '';

  function choose(item: OddItem) {
    if (answered) return;
    setChosen(item);
    if (item.emoji === answer.emoji) setScore((s) => s + 1);
  }

  function next() {
    setChosen(null);
    setRoundIndex((i) => (i + 1) % ODD_ROUNDS.length);
  }

  return (
    <section className="mini-game" aria-labelledby="odd-one-out-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="odd-one-out-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">
          {ODDONEOUT_META.icon}
        </span>
      </div>

      <p className="mini-game__prompt">{round.prompt}</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
          <button
            key={`${o.emoji}-${o.name}`}
            type="button"
            className={`mini-option${chosen?.emoji === o.emoji ? ' is-chosen' : ''}${
              answered && o.emoji === answer.emoji ? ' is-correct' : ''
            }`}
            aria-pressed={chosen?.emoji === o.emoji}
            aria-label={itemLabel(o)}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            <span aria-hidden="true">{o.emoji}</span>
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{feedback}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">Tap the one that is different from the rest.</p>
      )}
    </section>
  );
}

export default OddOneOutGame;
