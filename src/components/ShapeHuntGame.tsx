import { useState } from 'react';
import {
  SHAPE_HUNT_META,
  SHAPE_ROUNDS,
  figureDescription,
  getShapeFeedback,
  getShapeOptions,
  roundFigure,
  shapeAnswer,
  shapeLabel,
  svgPoints,
  type Figure,
  type ShapeName,
} from '../games/shape-hunt';
import { canSpeak, say } from '../workshop/say';

const EYEBROW = 'Plane figures';
const TITLE = SHAPE_HUNT_META.title;
const PROMPT = 'What is this figure?';
const HINT = 'More than one name can be true. Pick the most exact one.';

/**
 * The drawing comes out of the same record that names the figure. There is no
 * second copy of the geometry to fall out of step with the first, which is the
 * whole point: the previous version hand-typed a 72x72 rect in this file while
 * a string elsewhere called it a square, and the option list called it a
 * rectangle too.
 */
function FigureSvg({ figure }: { figure: Figure }) {
  const skin = {
    fill: 'var(--paper-sunken)',
    stroke: 'var(--ink)',
    strokeWidth: 2.5,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg
      viewBox="0 0 100 100"
      width="180"
      height="180"
      role="img"
      aria-label={figureDescription(figure)}
      data-testid="figure"
    >
      {figure.kind === 'ellipse' ? (
        <ellipse cx={figure.cx} cy={figure.cy} rx={figure.rx} ry={figure.ry} {...skin} />
      ) : (
        <polygon points={svgPoints(figure.points)} {...skin} />
      )}
    </svg>
  );
}

export function ShapeHuntGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<ShapeName | null>(null);
  const [score, setScore] = useState(0);

  const round = SHAPE_ROUNDS[roundIndex % SHAPE_ROUNDS.length];
  const figure = roundFigure(round);
  const answer = shapeAnswer(round);
  const options = getShapeOptions(roundIndex);
  const answered = chosen !== null;
  const feedback = answered ? getShapeFeedback(round, chosen) : '';

  function choose(option: ShapeName) {
    if (answered) return;
    setChosen(option);
    if (option === answer) setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % SHAPE_ROUNDS.length);
    setChosen(null);
  }

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

      <div className="mini-game__stage" data-testid="shape-stage">
        <FigureSvg figure={figure} />
      </div>

      <p className="mini-game__prompt">{PROMPT}</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            data-testid="option"
            data-name={o}
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
        <>
          <p className="mini-game__hint">{HINT}</p>
          {canSpeak() ? (
            <p className="mini-game__hint">
              <button
                type="button"
                className="mini-game__next"
                onClick={() => say(options.map((o) => shapeLabel(o)).join('. '))}
              >
                Read the names out
              </button>
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

export default ShapeHuntGame;
