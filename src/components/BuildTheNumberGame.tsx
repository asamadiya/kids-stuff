import { useState } from 'react';
import {
  BUILD_THE_NUMBER_META,
  BUILD_THE_NUMBER_ROUNDS,
  getBuildFeedback,
  getBuildHint,
  getBuildOptions,
  getBuildPrompt,
  buildLabel,
  partValue,
  unitName,
  type BuildRound,
  type NumberPart,
} from '../games/build-the-number';

const EYEBROW = 'Place Value';
const TITLE = BUILD_THE_NUMBER_META.title;

// Colors for each place, high-to-low, so tens-blocks read consistently.
const PLACE_FILL: Record<NumberPart['unit'], string> = {
  1000: '#f4a259',
  100: '#5b8e7d',
  10: '#4f8fc0',
  1: '#c05b7d',
};

/** Inline-SVG tower of unit blocks for one place-value part. */
function PartTower({ part }: { part: NumberPart }): JSX.Element {
  const cells = Array.from({ length: part.count });
  const fill = PLACE_FILL[part.unit];
  return (
    <div className="mini-game__emoji" role="img" aria-label={`${part.count} ${unitName(part.unit, part.count)} equals ${partValue(part)}`}>
      <svg viewBox="0 0 44 120" width="56" height="140" aria-hidden="true">
        {cells.map((_, idx) => (
          <rect
            key={idx}
            x={6}
            y={108 - idx * 11}
            width={32}
            height={9}
            rx={2}
            fill={fill}
            stroke="#2f2a24"
            strokeWidth={1}
          />
        ))}
        {part.count === 0 ? (
          <rect x={6} y={99} width={32} height={9} rx={2} fill="none" stroke="#b9b2a6" strokeWidth={1} strokeDasharray="3 2" />
        ) : null}
      </svg>
      <span aria-hidden="true">
        {part.count} × {part.unit} = {partValue(part)}
      </span>
    </div>
  );
}

function Stage({ round }: { round: BuildRound }): JSX.Element {
  return (
    <div className="mini-game__stage">
      <div className="mini-game__seq" aria-hidden="true">
        {round.parts.map((part, idx) => (
          <span key={`${part.unit}-${idx}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
            <PartTower part={part} />
            <strong style={{ fontSize: '0.8rem' }}>{unitName(part.unit, part.count)}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BuildTheNumberGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = BUILD_THE_NUMBER_ROUNDS[index];
  const answer = round.answer;
  const opts = getBuildOptions(round);
  const answered = chosen !== null;
  const question = getBuildPrompt(round);
  const hint = getBuildHint(round);
  const feedback = answered ? getBuildFeedback(round, chosen) : '';

  function choose(value: number): void {
    if (answered) return;
    setChosen(value);
    if (value === answer) setScore((s) => s + 1);
  }

  function next(): void {
    setChosen(null);
    setIndex((i) => (i + 1) % BUILD_THE_NUMBER_ROUNDS.length);
  }

  return (
    <section className="mini-game" aria-labelledby="build-the-number-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="build-the-number-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <Stage round={round} />

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
            {buildLabel(o)}
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

export default BuildTheNumberGame;
