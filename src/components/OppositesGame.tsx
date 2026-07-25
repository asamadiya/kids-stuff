import { useState } from 'react';
import {
  OPPOSITES_META,
  OPPOSITE_ROUNDS,
  getOppositeOptions,
  getOppositeFeedback,
  oppositeLabel,
} from '../games/opposites';

const EYEBROW = 'Opposite Day';
const TITLE = OPPOSITES_META.title;

export function OppositesGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const round = OPPOSITE_ROUNDS[roundIndex % OPPOSITE_ROUNDS.length];
  const options = getOppositeOptions(roundIndex);
  const answer = round.opposite;
  const answered = chosen !== null;
  const feedback = answered ? getOppositeFeedback(round, chosen) : '';

  function choose(option: string) {
    if (answered) return;
    setChosen(option);
    if (option === answer) setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % OPPOSITE_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="opposites-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="opposites-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji">{round.emoji}</span>
        <div className="mini-game__seq" aria-hidden="true">
          {round.word}
        </div>
      </div>

      <p className="mini-game__prompt">What is the opposite of {round.word}?</p>

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
            {oppositeLabel(o)}
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
        <p className="mini-game__hint">Which word means the very opposite? Tap your best guess!</p>
      )}
    </section>
  );
}

export default OppositesGame;
