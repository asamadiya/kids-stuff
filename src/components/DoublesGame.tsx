import { useState } from 'react';
import {
  DOUBLES_META,
  DOUBLE_ROUNDS,
  getDoubleOptions,
  getDoublePrompt,
  getDoubleFeedback,
} from '../games/doubles';

const EYEBROW = 'Doubles Facts';
const TITLE = DOUBLES_META.title;

/** One equal group rendered as a column of dots inside an SVG. */
function Group({ count, x, hue }: { count: number; x: number; hue: string }) {
  const dots = [];
  for (let r = 0; r < count; r += 1) {
    dots.push(
      <circle key={r} cx={x} cy={16 + r * 22} r={8} fill={hue} stroke="#3b2a52" strokeWidth={2} />,
    );
  }
  return <g>{dots}</g>;
}

export function DoublesGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = DOUBLE_ROUNDS[index % DOUBLE_ROUNDS.length];
  const opts = getDoubleOptions(index);
  const answer = round.answer;
  const answered = chosen !== null;
  const question = getDoublePrompt(round);
  const hint = 'Two equal groups — count one, then count both.';
  const feedback = answered ? getDoubleFeedback(round, chosen) : '';

  const svgHeight = 16 + round.n * 22 + 12;

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % DOUBLE_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="doubles-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="doubles-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">{round.n} + {round.n}</span>
        <svg
          role="img"
          aria-label={`Two equal groups of ${round.n}`}
          viewBox={`0 0 140 ${svgHeight}`}
          width="140"
          height={svgHeight}
        >
          <Group count={round.n} x={40} hue="#b98cff" />
          <text x={70} y={svgHeight / 2} textAnchor="middle" fontSize={22} fill="#6b4fa0">+</text>
          <Group count={round.n} x={100} hue="#8cd6ff" />
        </svg>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
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

export default DoublesGame;
