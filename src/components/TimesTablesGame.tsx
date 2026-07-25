import { useState } from 'react';
import {
  TIMES_TABLES_META,
  TIMES_ROUNDS,
  getTimesOptions,
  getTimesFeedback,
  timesProduct,
  timesQuestion,
  timesHint,
} from '../games/times-tables';

const EYEBROW = 'Multiplication';

export function TimesTablesGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = TIMES_ROUNDS[index % TIMES_ROUNDS.length];
  const answer = timesProduct(round);
  const opts = getTimesOptions(index);
  const answered = chosen !== null;

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    if (value === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % TIMES_ROUNDS.length);
    setChosen(null);
  }

  // Build an a-by-b dot array as inline SVG (rows = round.a, cols = round.b).
  const cell = 22;
  const pad = 8;
  const svgW = pad * 2 + round.b * cell;
  const svgH = pad * 2 + round.a * cell;
  const dots: JSX.Element[] = [];
  for (let r = 0; r < round.a; r += 1) {
    for (let c = 0; c < round.b; c += 1) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={pad + c * cell + cell / 2}
          cy={pad + r * cell + cell / 2}
          r={cell / 2 - 3}
          fill="currentColor"
        />,
      );
    }
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
        <span className="mini-game__emoji">
          {round.a} × {round.b}
        </span>
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          role="img"
          aria-label={`${round.a} rows of ${round.b} dots`}
        >
          {dots}
        </svg>
      </div>

      <p className="mini-game__prompt">{timesQuestion(round)}</p>

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
