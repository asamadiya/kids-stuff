import { useState } from 'react';
import {
  FRACTIONPIZZA_META,
  FRACTION_ROUNDS,
  fractionInfo,
  getFractionOptions,
  getFractionFeedback,
  type FractionValue,
  type PizzaRound,
} from '../games/fraction-pizza';

const EYEBROW = 'Math · Fractions';
const TITLE = FRACTIONPIZZA_META.title;

// Inline-SVG pizza cut into `denom` equal wedges; `shaded` wedges get topping.
function Pizza({ denom, shaded }: { denom: number; shaded: number }): JSX.Element {
  const cx = 60;
  const cy = 60;
  const r = 52;
  const wedges = Array.from({ length: denom }, (_, i) => {
    const a0 = (i / denom) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / denom) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
    const filled = i < shaded;
    return (
      <path
        key={i}
        d={d}
        fill={filled ? '#e8632c' : '#ffe6a8'}
        stroke="#c9932e"
        strokeWidth={2}
      />
    );
  });
  return (
    <svg
      viewBox="0 0 120 120"
      width={150}
      height={150}
      role="img"
      aria-label={`Pizza cut into ${denom} equal slices with ${shaded} shaded`}
    >
      <circle cx={cx} cy={cy} r={r + 3} fill="#f2c777" />
      {wedges}
    </svg>
  );
}

export function FractionPizzaGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<FractionValue | null>(null);
  const [score, setScore] = useState(0);

  const round: PizzaRound = FRACTION_ROUNDS[index % FRACTION_ROUNDS.length];
  const opts = getFractionOptions(index);
  const answer = round.answer;
  const answered = chosen !== null;

  const question = round.prompt;
  const hint = 'Count the equal slices, then name one slice as a fraction.';
  const feedback = answered ? getFractionFeedback(round, chosen) : '';

  function label(o: FractionValue): string {
    return `${o} (${fractionInfo(o).word})`;
  }

  function choose(o: FractionValue): void {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  }

  function next(): void {
    setChosen(null);
    setIndex((i) => (i + 1) % FRACTION_ROUNDS.length);
  }

  return (
    <section className="mini-game" aria-labelledby="fraction-pizza-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="fraction-pizza-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">
          🍕
        </span>
        <Pizza denom={round.denom} shaded={round.shaded} />
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

export default FractionPizzaGame;
