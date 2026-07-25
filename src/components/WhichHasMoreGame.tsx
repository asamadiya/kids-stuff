import { useState } from 'react';
import {
  COMPARE_ROUNDS,
  WHICH_HAS_MORE_META,
  getCompareFeedback,
  getCompareOptions,
  moreSide,
  sideCount,
  sideLabel,
  type Side,
} from '../games/which-has-more';

const EYEBROW = 'Counting fun';
const TITLE = WHICH_HAS_MORE_META.title;

export function WhichHasMoreGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<Side | null>(null);
  const [score, setScore] = useState(0);

  const round = COMPARE_ROUNDS[roundIndex];
  const answer = moreSide(round);
  const answered = chosen !== null;
  const options = getCompareOptions();

  function choose(side: Side) {
    if (answered) return;
    setChosen(side);
    setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % COMPARE_ROUNDS.length);
    setChosen(null);
  }

  const feedback = answered ? getCompareFeedback(round, chosen) : '';

  return (
    <section className="mini-game" aria-labelledby="which-has-more-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="which-has-more-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} found`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">found</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-label={`Left side has ${round.left}`}>
          {Array.from({ length: round.left }, (_, i) => (
            <span key={`l-${i}`} className="mini-game__emoji" aria-hidden="true">
              {round.emoji}
            </span>
          ))}
        </div>
        <div className="mini-game__seq" aria-label={`Right side has ${round.right}`}>
          {Array.from({ length: round.right }, (_, i) => (
            <span key={`r-${i}`} className="mini-game__emoji" aria-hidden="true">
              {round.emoji}
            </span>
          ))}
        </div>
      </div>

      <p className="mini-game__prompt">Which side has more?</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
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
            {sideLabel(o)} ({sideCount(round, o)})
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
        <p className="mini-game__hint">Count each row, then tap the side with the bigger pile.</p>
      )}
    </section>
  );
}

export default WhichHasMoreGame;
