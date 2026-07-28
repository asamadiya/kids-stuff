import { useState } from 'react';
import {
  HALVES_AND_WHOLES_META,
  HALVES_PALETTE,
  HALVES_ROUNDS,
  SHAPE_GEOMETRY,
  describeParts,
  getHalvesFeedback,
  getHalvesRound,
  isCorrect,
  shapeRegions,
  type Fraction,
  type FractionShape,
} from '../games/halves-and-wholes';

const EYEBROW = 'Fractions';
const TITLE = HALVES_AND_WHOLES_META.title;

/**
 * The vulgar-fraction glyph for the target, when one exists. Unknown fractions
 * fall back to `num/den`, so this table can be incomplete but never wrong.
 */
const TARGET_GLYPH: Record<string, string> = {
  '1/1': '1', '1/2': '½', '1/3': '⅓', '2/3': '⅔',
  '1/4': '¼', '3/4': '¾', '1/6': '⅙', '1/8': '⅛',
};

function glyph(f: Fraction): string {
  return TARGET_GLYPH[`${f.num}/${f.den}`] ?? `${f.num}/${f.den}`;
}

/**
 * Painted straight off `shapeRegions`. Every filled area on screen is one
 * record in that array, and the score is the sum of the same records' shares,
 * so what the child sees and what the game marks are one thing.
 */
function Shape({ shape }: { shape: FractionShape }): JSX.Element {
  const { box, rect, circle } = SHAPE_GEOMETRY;
  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      width={box}
      height={box}
      aria-hidden="true"
      focusable="false"
      style={{ margin: '0 auto' }}
    >
      {shapeRegions(shape).map((r) => (
        <path
          key={r.key}
          d={r.d}
          data-share={`${r.share.num}/${r.share.den}`}
          data-shaded={String(r.shaded)}
          fill={r.shaded ? HALVES_PALETTE.shade : HALVES_PALETTE.blank}
          stroke={HALVES_PALETTE.line}
          strokeWidth={1}
        />
      ))}
      {shape.kind === 'rect' ? (
        <rect
          x={rect.x}
          y={rect.y}
          width={rect.w}
          height={rect.h}
          fill="none"
          stroke={HALVES_PALETTE.line}
          strokeWidth={2.5}
        />
      ) : (
        <circle
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill="none"
          stroke={HALVES_PALETTE.line}
          strokeWidth={2.5}
        />
      )}
    </svg>
  );
}

export function HalvesAndWholesGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const round = getHalvesRound(index);
  const answered = chosen !== null;

  function choose(id: string): void {
    if (answered) return;
    setChosen(id);
    if (isCorrect(round, id)) setScore((s) => s + 1);
  }

  function next(): void {
    setChosen(null);
    setIndex((i) => (i + 1) % HALVES_ROUNDS.length);
  }

  const feedback = answered ? getHalvesFeedback(round, chosen) : '';
  const hint = 'Compare the shaded area with the whole shape, not the number of pieces.';

  return (
    <section className="mini-game" aria-labelledby="halves-and-wholes-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="halves-and-wholes-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">{glyph(round.target)}</span>
      </div>

      <p className="mini-game__prompt">{round.prompt}</p>

      <div className="mini-game__options" aria-label="Choose">
        {round.options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={`mini-option${chosen === o.id ? ' is-chosen' : ''}${
              answered && isCorrect(round, o.id) ? ' is-correct' : ''
            }`}
            aria-pressed={chosen === o.id}
            aria-label={`Shape ${i + 1}: ${describeParts(o)}`}
            aria-disabled={answered}
            onClick={() => choose(o.id)}
          >
            <Shape shape={o} />
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

export default HalvesAndWholesGame;
