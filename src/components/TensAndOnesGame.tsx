import { useState } from 'react';
import {
  TENS_AND_ONES_META,
  TENS_ONES_ROUNDS,
  getTensOnesOptions,
  getTensOnesFeedback,
  getTensOnesPrompt,
  roundTotal,
} from '../games/tens-and-ones';

const EYEBROW = 'Place Value';

function TenRod({ index }: { index: number }): JSX.Element {
  // A tall rod of 10 stacked unit squares.
  const cells = Array.from({ length: 10 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 20 200"
      width="20"
      height="120"
      role="img"
      aria-label={`ten rod ${index + 1}`}
    >
      {cells.map((c) => (
        <rect
          key={c}
          x="1"
          y={c * 20 + 1}
          width="18"
          height="18"
          rx="3"
          fill="#4a90d9"
          stroke="#1f5c99"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function OneCube({ index }: { index: number }): JSX.Element {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      role="img"
      aria-label={`one ${index + 1}`}
    >
      <rect
        x="1"
        y="1"
        width="18"
        height="18"
        rx="3"
        fill="#f5c542"
        stroke="#c99a12"
        strokeWidth="1"
      />
    </svg>
  );
}

export function TensAndOnesGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = TENS_ONES_ROUNDS[index % TENS_ONES_ROUNDS.length];
  const answer = roundTotal(round);
  const opts = getTensOnesOptions(index);
  const answered = chosen !== null;
  const feedback = answered ? getTensOnesFeedback(round, chosen) : '';

  const tens = Array.from({ length: round.tens }, (_, i) => i);
  const ones = Array.from({ length: round.ones }, (_, i) => i);

  function choose(o: number): void {
    if (answered) return;
    setChosen(o);
    setScore((s) => s + 1);
  }

  function next(): void {
    setChosen(null);
    setIndex((i) => (i + 1) % TENS_ONES_ROUNDS.length);
  }

  return (
    <section className="mini-game" aria-labelledby="tens-and-ones-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="tens-and-ones-title" className="mini-game__title">
            {TENS_AND_ONES_META.title}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} solved`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-label={`${round.tens} tens`}>
          {tens.map((t) => (
            <TenRod key={`ten-${t}`} index={t} />
          ))}
        </div>
        <div className="mini-game__seq" aria-label={`${round.ones} ones`}>
          {ones.map((o) => (
            <OneCube key={`one-${o}`} index={o} />
          ))}
        </div>
        <span className="mini-game__emoji" aria-hidden="true">
          {round.tens} tens + {round.ones} ones
        </span>
      </div>

      <p className="mini-game__prompt">{getTensOnesPrompt()}</p>

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
          <p role="status">{feedback}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">Count the tall blue rods by tens, then add the yellow ones.</p>
      )}
    </section>
  );
}

export default TensAndOnesGame;
