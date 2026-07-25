import { useState } from 'react';
import {
  TEN_ROUNDS,
  TEN_MORE_TEN_LESS_META,
  getTenOptions,
  getTenFeedback,
  tenAnswer,
  tenPrompt,
  tenHint,
} from '../games/ten-more-ten-less';

const EYEBROW = 'Mental Math';
const TITLE = TEN_MORE_TEN_LESS_META.title;

/** Render a two-digit number as tens-rods + ones-cubes so "ten" is visible. */
function TensBlocks({ value }: { value: number }) {
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const rod = 26;
  const gap = 8;
  const cube = 10;
  const width = tens * (rod + gap) + Math.max(ones, 1) * (cube + 2) + 24;
  const rods = Array.from({ length: tens }, (_, t) => (
    <rect
      key={`t${t}`}
      x={12 + t * (rod + gap)}
      y={10}
      width={rod}
      height={56}
      rx={4}
      fill="currentColor"
      opacity={0.85}
    />
  ));
  const cubes = Array.from({ length: ones }, (_, o) => (
    <rect
      key={`o${o}`}
      x={12 + tens * (rod + gap) + o * (cube + 2)}
      y={10 + (o % 5) * (cube + 1)}
      width={cube}
      height={cube}
      rx={2}
      fill="currentColor"
      opacity={0.55}
    />
  ));
  return (
    <svg
      viewBox={`0 0 ${Math.max(width, 60)} 76`}
      width={Math.min(Math.max(width, 60), 260)}
      height={64}
      role="img"
      aria-label={`${tens} tens and ${ones} ones`}
    >
      {rods}
      {cubes}
    </svg>
  );
}

export function TenMoreTenLessGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = TEN_ROUNDS[index % TEN_ROUNDS.length];
  const answer = tenAnswer(round);
  const opts = getTenOptions(index);
  const answered = chosen !== null;
  const question = tenPrompt(round);
  const hint = tenHint(round);
  const feedback = answered ? getTenFeedback(round, chosen) : '';

  const arrow = round.direction === 'more' ? '⬆️' : '⬇️';

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % TEN_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="ten-more-ten-less-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="ten-more-ten-less-title" className="mini-game__title">
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
          {round.start} {arrow}
        </span>
        <div className="mini-game__seq" aria-hidden="true">
          <TensBlocks value={round.start} />
        </div>
      </div>

      <p className="mini-game__prompt">{question}</p>

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
        <p className="mini-game__hint">{hint}</p>
      )}
    </section>
  );
}

export default TenMoreTenLessGame;
