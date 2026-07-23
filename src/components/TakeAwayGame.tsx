import { useState } from 'react';
import {
  TAKE_AWAY_META,
  TAKE_AWAY_ROUNDS,
  difference,
  getTakeAwayOptions,
  getTakeAwayFeedback,
  labelTakeAway,
} from '../games/take-away';

const EYEBROW = 'Subtraction';

export function TakeAwayGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = TAKE_AWAY_ROUNDS[index % TAKE_AWAY_ROUNDS.length];
  const answer = difference(round);
  const opts = getTakeAwayOptions(index);
  const answered = chosen !== null;

  const question = `How many ${round.noun} are left?`;
  const hint = `Count only the ${round.noun} that are NOT crossed out.`;
  const feedback = answered ? getTakeAwayFeedback(round, chosen) : '';

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % TAKE_AWAY_ROUNDS.length);
    setChosen(null);
  }

  const objects = Array.from({ length: round.total }, (_, i) => i);

  return (
    <section className="mini-game" aria-labelledby="take-away-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="take-away-title" className="mini-game__title">
            {TAKE_AWAY_META.title}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} solved`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-hidden="true">
          {objects.map((i) => {
            const takenAway = i >= round.total - round.takeAway;
            return (
              <span
                key={i}
                className="mini-game__emoji"
                style={{
                  position: 'relative',
                  opacity: takenAway ? 0.28 : 1,
                  filter: takenAway ? 'grayscale(1)' : 'none',
                }}
              >
                {round.emoji}
                {takenAway ? (
                  <svg
                    viewBox="0 0 100 100"
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <line x1="12" y1="12" x2="88" y2="88" stroke="#c81d64" strokeWidth="10" strokeLinecap="round" />
                    <line x1="88" y1="12" x2="12" y2="88" stroke="#c81d64" strokeWidth="10" strokeLinecap="round" />
                  </svg>
                ) : null}
              </span>
            );
          })}
        </div>
        <p className="mini-game__prompt" aria-hidden="true">
          {round.total} − {round.takeAway} = ?
        </p>
      </div>

      <p className="mini-game__prompt">{question}</p>

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
            {labelTakeAway(o)}
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

export default TakeAwayGame;
