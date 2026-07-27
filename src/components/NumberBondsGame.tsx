import { useState } from 'react';
import {
  NUMBER_BONDS_META,
  BOND_ROUNDS,
  bondAnswer,
  getBondOptions,
  getBondPrompt,
  getBondHint,
  getBondFeedback,
} from '../games/number-bonds';

const EYEBROW = 'Number Bonds';

interface TenFrameProps {
  readonly filled: number;
  readonly whole: number;
}

/** Inline-SVG ten-frame(s): filled cells in aqua, empty cells outlined. */
function TenFrame({ filled, whole }: TenFrameProps): JSX.Element {
  const cell = 34;
  const gap = 6;
  const cols = 5;
  const frames = whole === 20 ? 2 : 1;
  const rowsPerFrame = 2;
  const frameW = cols * cell + (cols - 1) * gap;
  const frameGap = 18;
  const totalW = frames * frameW + (frames - 1) * frameGap;
  const totalH = rowsPerFrame * cell + (rowsPerFrame - 1) * gap;

  const cells: JSX.Element[] = [];
  for (let f = 0; f < frames; f += 1) {
    const frameX = f * (frameW + frameGap);
    for (let r = 0; r < rowsPerFrame; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const cellIndex = f * (cols * rowsPerFrame) + r * cols + c;
        const isFilled = cellIndex < filled;
        const x = frameX + c * (cell + gap);
        const y = r * (cell + gap);
        cells.push(
          <rect
            key={cellIndex}
            x={x}
            y={y}
            width={cell}
            height={cell}
            rx={7}
            fill={isFilled ? 'currentColor' : 'transparent'}
            stroke="currentColor"
            strokeWidth={2}
            opacity={isFilled ? 1 : 0.35}
          />,
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      height="120"
      role="img"
      aria-label={`Ten-frame showing ${filled} filled out of ${whole}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {cells}
    </svg>
  );
}

export function NumberBondsGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = BOND_ROUNDS[index % BOND_ROUNDS.length];
  const answer = bondAnswer(round);
  const opts = getBondOptions(index);
  const answered = chosen !== null;
  const question = getBondPrompt(round);
  const hint = getBondHint(round);
  const feedback = answered ? getBondFeedback(round, chosen as number) : '';

  const label = (o: number): string => String(o);

  const choose = (o: number): void => {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  };

  const next = (): void => {
    setChosen(null);
    setIndex((i) => (i + 1) % BOND_ROUNDS.length);
  };

  return (
    <section className="mini-game" aria-labelledby="number-bonds-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="number-bonds-title" className="mini-game__title">
            {NUMBER_BONDS_META.title}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">
          {round.part} + ? = {round.whole}
        </span>
        <TenFrame filled={round.part} whole={round.whole} />
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

export default NumberBondsGame;
