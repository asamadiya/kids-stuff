import { useState } from 'react';
import {
  TIMES_TABLES_META,
  TIMES_ROUNDS,
  dotArray,
  getTimesOptions,
  getTimesFeedback,
  timesProduct,
  timesQuestion,
  timesHint,
  timesSpoken,
} from '../games/times-tables';
import { canSpeak, say } from '../workshop/say';

const EYEBROW = 'Multiplication';

/**
 * This component deliberately holds no arithmetic and no wording of its own.
 * Every number it prints, every label it exposes and every circle it draws
 * comes back from `src/games/times-tables.ts` keyed on the round record, so the
 * picture and the four sentences about the picture cannot drift apart. The
 * previous version rebuilt the dot loop and the aria-label here by hand and
 * they disagreed with the hint in 14 of 15 rounds.
 */
export function TimesTablesGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = TIMES_ROUNDS[index % TIMES_ROUNDS.length];
  const answer = timesProduct(round);
  const opts = getTimesOptions(index);
  const answered = chosen !== null;
  const array = dotArray(round);

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    if (value === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % TIMES_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="times-tables-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="times-tables-title" className="mini-game__title">
            {TIMES_TABLES_META.title}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <svg
          data-testid="times-array"
          width={array.width}
          height={array.height}
          viewBox={`0 0 ${array.width} ${array.height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
          role="img"
          aria-label={array.label}
        >
          {array.dots.map((d) => (
            <circle key={`${d.row}-${d.col}`} cx={d.cx} cy={d.cy} r={d.r} fill="currentColor" />
          ))}
        </svg>
      </div>

      <p className="mini-game__prompt">{timesQuestion(round)}</p>

      {canSpeak() ? (
        <p className="mini-game__hint">
          <button
            type="button"
            className="mini-game__next mini-game__say"
            onClick={() => say(timesSpoken(round))}
          >
            Read this aloud
          </button>
        </p>
      ) : null}

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${
              answered && o === answer ? ' is-correct' : ''
            }`}
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
          <p role="status">{getTimesFeedback(round, chosen)}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">{timesHint(round)}</p>
      )}
    </section>
  );
}

export default TimesTablesGame;
