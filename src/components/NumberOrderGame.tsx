import { useState } from 'react';
import {
  NUMBER_ORDER_META,
  NUMBER_ROUNDS,
  getNumberFeedback,
  getNumberHint,
  getNumberOptions,
  numberLabel,
} from '../games/number-order';

const EYEBROW = 'Counting Fun';
const TITLE = NUMBER_ORDER_META.title;

export function NumberOrderGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const i = roundIndex % NUMBER_ROUNDS.length;
  const round = NUMBER_ROUNDS[i];
  const opts = getNumberOptions(i);
  const answer = round.answer;
  const answered = chosen !== null;
  const feedback = answered ? getNumberFeedback(round, chosen) : '';

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((r) => (r + 1) % NUMBER_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="number-order-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="number-order-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} found`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq">
          {round.shown.map((n, idx) => (
            <span key={`${round.id}-${idx}`} className="mini-game__emoji">
              {n}
            </span>
          ))}
          <span className="mini-game__emoji" aria-hidden="true">
            {answered ? answer : '❓'}
          </span>
        </div>
      </div>

      <p className="mini-game__prompt">What number comes next?</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${
              answered && o === answer ? ' is-correct' : ''
            }`}
            aria-pressed={chosen === o}
            disabled={answered}
            onClick={() => choose(o)}
          >
            {numberLabel(o)}
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
        <p className="mini-game__hint">{getNumberHint(round)}</p>
      )}
    </section>
  );
}

export default NumberOrderGame;
