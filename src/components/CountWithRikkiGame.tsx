import { useState } from 'react';
import {
  COUNT_ROUNDS,
  countLabel,
  getCountFeedback,
  getCountOptions,
} from '../games/count-with-rikki';

const EYEBROW = 'Numbers 1-10';
const TITLE = 'Count with Rikki';

export function CountWithRikkiGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = COUNT_ROUNDS[roundIndex % COUNT_ROUNDS.length];
  const options = getCountOptions(roundIndex);
  const answer = round.count;
  const answered = chosen !== null;
  const feedback = answered ? getCountFeedback(round, chosen) : '';

  function choose(n: number) {
    if (answered) return;
    setChosen(n);
    if (n === answer) setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % COUNT_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="count-with-rikki-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="count-with-rikki-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq">
          {Array.from({ length: round.count }, (_, i) => (
            <span key={i} className="mini-game__emoji" aria-hidden="true">
              {round.emoji}
            </span>
          ))}
        </div>
      </div>

      <p className="mini-game__prompt">How many do you see?</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            disabled={answered}
            onClick={() => choose(o)}
          >
            {countLabel(o)}
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
        <p className="mini-game__hint">Point to each one and count out loud with Rikki!</p>
      )}
    </section>
  );
}

export default CountWithRikkiGame;
