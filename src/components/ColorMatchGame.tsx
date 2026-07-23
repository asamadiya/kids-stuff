import { useState } from 'react';
import {
  COLOR_MATCH_META,
  COLOR_ROUNDS,
  colorLabel,
  getColorFeedback,
  getColorOptions,
  type Color,
} from '../games/color-match';

const EYEBROW = 'Color Play';
const TITLE = COLOR_MATCH_META.title;

export function ColorMatchGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<Color | null>(null);
  const [score, setScore] = useState(0);

  const round = COLOR_ROUNDS[roundIndex % COLOR_ROUNDS.length];
  const options = getColorOptions(roundIndex);
  const answer = round.color;
  const answered = chosen !== null;
  const feedback = chosen ? getColorFeedback(round, chosen) : '';

  function choose(c: Color) {
    if (answered) return;
    setChosen(c);
    setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % COLOR_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="color-match-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="color-match-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} found`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <span
          className="mini-game__emoji"
          role="img"
          aria-label={`${colorLabel(round.color)} circle`}
          style={{
            backgroundColor: round.hex,
            borderRadius: '50%',
            width: '7rem',
            height: '7rem',
            display: 'inline-block',
            boxShadow: '0 0 0 6px rgba(255,255,255,0.6), 0 8px 24px rgba(0,0,0,0.18)',
          }}
        />
      </div>

      <p className="mini-game__prompt">What color is this?</p>

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
            {colorLabel(o)}
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
        <p className="mini-game__hint">Tap the name of the color you see.</p>
      )}
    </section>
  );
}

export default ColorMatchGame;
