import { useState } from 'react';
import {
  COUNT_BY_TENS_META,
  COUNT_BY_TENS_ROUNDS,
  getCountByTensFeedback,
} from '../games/count-by-tens';

const EYEBROW = 'Skip Counting';

export function CountByTensGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const round = COUNT_BY_TENS_ROUNDS[index % COUNT_BY_TENS_ROUNDS.length];
  const { answer, options, sequence } = round;

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    setAnswered(true);
    if (value === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % COUNT_BY_TENS_ROUNDS.length);
    setChosen(null);
    setAnswered(false);
  }

  const question = 'What comes next?';
  const hint = 'Each number is 10 bigger than the one before it.';
  const feedback = chosen === null ? '' : getCountByTensFeedback(round, chosen);

  return (
    <section className="mini-game" aria-labelledby="count-by-tens-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="count-by-tens-title" className="mini-game__title">
            {COUNT_BY_TENS_META.title}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-label={`Sequence: ${sequence.join(', ')}, then what comes next`}>
          {sequence.map((n, i) => (
            <span key={i} className="mini-game__emoji">
              {n}
            </span>
          ))}
          <span className="mini-game__emoji" aria-hidden="true">
            {'❓'}
          </span>
        </div>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
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
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">{'→'}</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">{hint}</p>
      )}
    </section>
  );
}

export default CountByTensGame;
