import { useState } from 'react';
import {
  SKIP_COUNT_META,
  SKIP_COUNT_ROUNDS,
  getSkipCountOptions,
  getSkipCountFeedback,
} from '../games/skip-count';

const EYEBROW = 'Number Patterns';

export function SkipCountGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = SKIP_COUNT_ROUNDS[index % SKIP_COUNT_ROUNDS.length];
  const opts = getSkipCountOptions(index % SKIP_COUNT_ROUNDS.length);
  const answer = round.answer;
  const answered = chosen !== null;

  const question = `Counting by ${round.step}s — what number comes next?`;
  const hint = `Each jump adds ${round.step}. Look at how the numbers grow!`;
  const feedback = answered ? getSkipCountFeedback(round, chosen) : '';

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % SKIP_COUNT_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="skip-count-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="skip-count-title" className="mini-game__title">
            {SKIP_COUNT_META.title}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} solved`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">solved</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-label={`Sequence counting by ${round.step}s`}>
          {round.shown.map((n, i) => (
            <span key={`${n}-${i}`} className="mini-game__emoji">
              {n}
            </span>
          ))}
          <span className="mini-game__emoji" aria-hidden="true">
            {answered ? answer : '❓'}
          </span>
        </div>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${
              answered && o === answer ? ' is-correct' : ''
            }`}
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

export default SkipCountGame;
