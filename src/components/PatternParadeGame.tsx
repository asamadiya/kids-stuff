import { useState } from 'react';
import {
  PATTERN_PARADE_META,
  PATTERN_ROUNDS,
  getPatternOptions,
  getPatternFeedback,
} from '../games/pattern-parade';

const EYEBROW = 'Pattern play';
const TITLE = PATTERN_PARADE_META.title;

export function PatternParadeGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const round = PATTERN_ROUNDS[roundIndex % PATTERN_ROUNDS.length];
  const options = getPatternOptions(roundIndex);
  const answered = chosen !== null;
  const answer = round.answer;
  const feedback = answered ? getPatternFeedback(round, chosen) : '';

  function choose(option: string) {
    if (answered) return;
    setChosen(option);
    setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % PATTERN_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="pattern-parade-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="pattern-parade-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} found`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">found</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq">
          {round.sequence.map((item, i) => (
            <span key={`${round.id}-${i}`} className="mini-game__emoji">
              {item}
            </span>
          ))}
          <span className="mini-game__emoji" aria-hidden="true">
            ❓
          </span>
        </div>
      </div>

      <p className="mini-game__prompt">What comes next in the parade?</p>

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
        <p className="mini-game__hint">Look for the part that repeats, then guess what marches in next.</p>
      )}
    </section>
  );
}

export default PatternParadeGame;
