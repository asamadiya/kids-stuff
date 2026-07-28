import { useState } from 'react';
import {
  TWO_DIGIT_SUBTRACT_META,
  SUBTRACT_ROUNDS,
  getSubtractOptions,
  getSubtractFeedback,
} from '../games/two-digit-subtract';

const EYEBROW = 'Place-Value Power';
const TITLE = TWO_DIGIT_SUBTRACT_META.title;

export function TwoDigitSubtractGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = SUBTRACT_ROUNDS[index % SUBTRACT_ROUNDS.length];
  const opts = getSubtractOptions(index);
  const answer = round.answer;
  const answered = chosen !== null;

  const question = `What is ${round.top} − ${round.bottom}?`;
  const hint = 'Subtract the ones, then subtract the tens. When the top digit is smaller, take a ten from the column on its left.';
  const feedback = answered ? getSubtractFeedback(round, chosen) : '';

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % SUBTRACT_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="two-digit-subtract-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="two-digit-subtract-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji">{round.top}</span>
        <div className="mini-game__seq" aria-hidden="true">
          <svg viewBox="0 0 120 90" width="120" height="90" role="img" aria-label={`${round.top} minus ${round.bottom}`}>
            <text x="110" y="34" textAnchor="end" fontSize="30" fontWeight="700" fill="currentColor">{round.top}</text>
            <text x="14" y="66" textAnchor="start" fontSize="30" fontWeight="700" fill="currentColor">−</text>
            <text x="110" y="66" textAnchor="end" fontSize="30" fontWeight="700" fill="currentColor">{round.bottom}</text>
            <line x1="10" y1="76" x2="114" y2="76" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="mini-game__emoji">{round.bottom}</span>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {o}
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{feedback}</p>
          <button type="button" className="mini-game__next" onClick={next}>Next <span aria-hidden="true">→</span></button>
        </div>
      ) : (
        <p className="mini-game__hint">{hint}</p>
      )}
    </section>
  );
}

export default TwoDigitSubtractGame;
