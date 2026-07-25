import { useState } from 'react';
import {
  ADD_ROUNDS,
  ADD_WITH_THINGS_META,
  getAddFeedback,
  getAddHint,
  getAddOptions,
  sumOf,
} from '../games/add-with-things';

const EYEBROW = 'Count & Add';

export function AddWithThingsGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = ADD_ROUNDS[index % ADD_ROUNDS.length];
  const answer = sumOf(round);
  const opts = getAddOptions(index);
  const answered = chosen !== null;

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % ADD_ROUNDS.length);
    setChosen(null);
  }

  const feedback = answered ? getAddFeedback(round, chosen) : '';
  const hint = getAddHint(round);

  const leftGroup = Array.from({ length: round.left }, (_, k) => k);
  const rightGroup = Array.from({ length: round.right }, (_, k) => k);

  return (
    <section className="mini-game" aria-labelledby="add-with-things-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="add-with-things-title" className="mini-game__title">
            {ADD_WITH_THINGS_META.title}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-label={`${round.left} ${round.name}`}>
          {leftGroup.map((k) => (
            <span key={`l-${k}`} className="mini-game__emoji" aria-hidden="true">
              {round.emoji}
            </span>
          ))}
        </div>
        <span className="mini-game__emoji" aria-hidden="true">
          {'➕'}
        </span>
        <div className="mini-game__seq" aria-label={`${round.right} more ${round.name}`}>
          {rightGroup.map((k) => (
            <span key={`r-${k}`} className="mini-game__emoji" aria-hidden="true">
              {round.emoji}
            </span>
          ))}
        </div>
      </div>

      <p className="mini-game__prompt">
        How many {round.name} altogether?
      </p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            disabled={answered}
            onClick={() => choose(o)}
          >
            {o}
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
        <p className="mini-game__hint">{hint}</p>
      )}
    </section>
  );
}

export default AddWithThingsGame;
