import { useState } from 'react';
import {
  COMPARE_NUMBERS_META,
  COMPARE_ROUNDS,
  getCompareAnswer,
  getCompareFeedback,
  getCompareHint,
  getCompareLabel,
  getCompareOptions,
  type CompareChoice,
} from '../games/compare-numbers';

const EYEBROW = 'Number Sense';
const TITLE = COMPARE_NUMBERS_META.title;

// Inline SVG tens-and-ones blocks for one number: columns of ten + loose ones.
function NumberBlocks({ value }: { value: number }): JSX.Element {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const cell = 9;
  const gap = 3;
  const colW = cell + gap;
  const cols = tens + (ones > 0 ? 1 : 0);
  const width = Math.max(cols * colW + gap, colW + gap);
  const height = 10 * (cell + gap) + gap;

  const rects: JSX.Element[] = [];
  for (let t = 0; t < tens; t += 1) {
    for (let r = 0; r < 10; r += 1) {
      rects.push(
        <rect
          key={`t-${t}-${r}`}
          x={gap + t * colW}
          y={gap + r * (cell + gap)}
          width={cell}
          height={cell}
          rx={2}
          fill="currentColor"
        />,
      );
    }
  }
  for (let o = 0; o < ones; o += 1) {
    rects.push(
      <rect
        key={`o-${o}`}
        x={gap + tens * colW}
        y={gap + o * (cell + gap)}
        width={cell}
        height={cell}
        rx={2}
        fill="currentColor"
        opacity={0.55}
      />,
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={Math.min(width, 90)}
      height={Math.min(height, 130)}
      role="img"
      aria-label={`${value} shown as ${tens} tens and ${ones} ones`}
    >
      {rects}
    </svg>
  );
}

export function CompareNumbersGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<CompareChoice | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const round = COMPARE_ROUNDS[index];
  const opts = getCompareOptions(round);
  const answer = getCompareAnswer(round);
  const question = 'Which number is bigger?';
  const hint = getCompareHint();
  const feedback = chosen === null ? '' : getCompareFeedback(round, chosen);

  function choose(o: CompareChoice): void {
    if (answered) return;
    setChosen(o);
    setAnswered(true);
    setScore((s) => s + 1);
  }

  function next(): void {
    setIndex((i) => (i + 1) % COMPARE_ROUNDS.length);
    setChosen(null);
    setAnswered(false);
  }

  return (
    <section className="mini-game" aria-labelledby="compare-numbers-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="compare-numbers-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} solved`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">solved</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq">
          <span className="mini-game__emoji">{round.a}</span>
          <NumberBlocks value={round.a} />
          <span className="mini-game__emoji" aria-hidden="true">vs</span>
          <NumberBlocks value={round.b} />
          <span className="mini-game__emoji">{round.b}</span>
        </div>
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
            {getCompareLabel(o)}
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

export default CompareNumbersGame;
