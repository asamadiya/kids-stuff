import { useState } from 'react';
import {
  TWO_DIGIT_ADD_META,
  TWO_DIGIT_ADD_ROUNDS,
  getAddFeedback,
  getAddHint,
  getAddPrompt,
} from '../games/two-digit-add';

const EYEBROW = 'Math · Place Value';
const TITLE = TWO_DIGIT_ADD_META.title;

export function TwoDigitAddGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const round = TWO_DIGIT_ADD_ROUNDS[index % TWO_DIGIT_ADD_ROUNDS.length];
  const opts = round.options;
  const question = getAddPrompt(round);
  const hint = getAddHint(round);
  const feedback = chosen === null ? '' : getAddFeedback(round, chosen);

  const label = (o: number): string => String(o);

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    setAnswered(true);
    if (o === round.answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % TWO_DIGIT_ADD_ROUNDS.length);
    setChosen(null);
    setAnswered(false);
  }

  return (
    <section className="mini-game" aria-labelledby="two-digit-add-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="two-digit-add-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji">{round.a}</span>
        <span className="mini-game__emoji" aria-hidden="true">➕</span>
        <span className="mini-game__emoji">{round.b}</span>
        <div className="mini-game__seq" aria-hidden="true">
          <svg viewBox="0 0 220 90" width="220" height="90" role="img" aria-label={`${round.a} plus ${round.b}`}>
            <text x="200" y="34" textAnchor="end" fontSize="30" fontFamily="monospace" fill="currentColor">{round.a}</text>
            <text x="110" y="64" textAnchor="start" fontSize="30" fontFamily="monospace" fill="currentColor">+</text>
            <text x="200" y="64" textAnchor="end" fontSize="30" fontFamily="monospace" fill="currentColor">{round.b}</text>
            <line x1="120" y1="74" x2="200" y2="74" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === round.answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {label(o)}
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

export default TwoDigitAddGame;
