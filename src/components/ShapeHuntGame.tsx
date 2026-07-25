import { useState } from 'react';
import {
  SHAPE_HUNT_META,
  SHAPE_ROUNDS,
  getShapeOptions,
  getShapeFeedback,
  shapeLabel,
  type Shape,
} from '../games/shape-hunt';

const EYEBROW = 'Shapes';
const TITLE = SHAPE_HUNT_META.title;

function ShapeSvg({ shape }: { shape: Shape }) {
  const stroke = '#1f4e79';
  const fill = '#7ec8ff';
  const common = { fill, stroke, strokeWidth: 4, strokeLinejoin: 'round' as const };
  switch (shape) {
    case 'circle':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <circle cx="50" cy="50" r="42" {...common} />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <rect x="14" y="14" width="72" height="72" {...common} />
        </svg>
      );
    case 'triangle':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <polygon points="50,12 88,86 12,86" {...common} />
        </svg>
      );
    case 'rectangle':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <rect x="10" y="28" width="80" height="44" {...common} />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <polygon
            points="50,8 61,38 93,38 67,58 77,89 50,70 23,89 33,58 7,38 39,38"
            {...common}
          />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <path
            d="M50 84 C 20 60, 8 40, 24 26 C 36 15, 50 26, 50 36 C 50 26, 64 15, 76 26 C 92 40, 80 60, 50 84 Z"
            {...common}
          />
        </svg>
      );
    case 'oval':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <ellipse cx="50" cy="50" rx="44" ry="30" {...common} />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 100 100" width="100" height="100" role="img" aria-label="a shape">
          <polygon points="50,10 88,50 50,90 12,50" {...common} />
        </svg>
      );
  }
}

export function ShapeHuntGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<Shape | null>(null);
  const [score, setScore] = useState(0);

  const round = SHAPE_ROUNDS[roundIndex % SHAPE_ROUNDS.length];
  const answer = round.shape;
  const options = getShapeOptions(roundIndex);
  const answered = chosen !== null;

  function choose(option: Shape) {
    if (answered) return;
    setChosen(option);
    if (option === answer) setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % SHAPE_ROUNDS.length);
    setChosen(null);
  }

  const feedback = answered ? getShapeFeedback(round, chosen) : '';

  return (
    <section className="mini-game" aria-labelledby="shape-hunt-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="shape-hunt-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji">
          <ShapeSvg shape={answer} />
        </span>
      </div>

      <p className="mini-game__prompt">What shape is this?</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${
              answered && o === answer ? ' is-correct' : ''
            }`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {shapeLabel(o)}
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
        <p className="mini-game__hint">Look at the sides and corners, then tap the name.</p>
      )}
    </section>
  );
}

export default ShapeHuntGame;
