import { useState } from 'react';
import {
  FRACTIONPIZZA_META,
  FRACTION_ROUNDS,
  PLATE,
  foodOf,
  fractionInfo,
  getFractionOptions,
  getFractionFeedback,
  plateWedges,
  roundAnswer,
  roundHint,
  roundLabel,
  roundPrompt,
  roundSpoken,
  type FractionValue,
  type PlateRound,
} from '../games/fraction-pizza';
import { canSpeak, say } from '../workshop/say';

const EYEBROW = 'Fractions';

/** Sampled from tokens.css: --paper-sunken and --rule-strong. */
const PLATE_FILL = '#eae4d5';
const PLATE_EDGE = '#b9b09a';

/**
 * One whole on a plate, with the pieces that are gone drawn as gone.
 *
 * The wedge paths and their absent flags arrive together from `plateWedges`,
 * so this component cannot draw one set of pieces and mark a different set
 * missing. The version this replaced had no absent state at all: it filled
 * wedges with topping and asked how much had been eaten.
 */
function Plate({ round }: { round: PlateRound }): JSX.Element {
  const food = foodOf(round.food);
  return (
    <svg
      data-testid="fraction-plate"
      viewBox={`0 0 ${PLATE.size} ${PLATE.size}`}
      width={158}
      height={158}
      role="img"
      aria-label={roundLabel(round)}
    >
      <circle cx={PLATE.cx} cy={PLATE.cy} r={PLATE.plate} fill={PLATE_FILL} stroke={PLATE_EDGE} strokeWidth={1} />
      {plateWedges(round).map((w) =>
        w.absent ? (
          <path
            key={w.index}
            data-wedge="absent"
            d={w.d}
            fill="none"
            stroke={PLATE_EDGE}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ) : (
          <path
            key={w.index}
            data-wedge="present"
            d={w.d}
            fill={food.fill}
            stroke={food.rim}
            strokeWidth={1.5}
          />
        ),
      )}
    </svg>
  );
}

export function FractionPizzaGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<FractionValue | null>(null);
  const [score, setScore] = useState(0);

  const round = FRACTION_ROUNDS[index % FRACTION_ROUNDS.length];
  const opts = getFractionOptions(index);
  const answer = roundAnswer(round).value;
  const answered = chosen !== null;

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
            {FRACTIONPIZZA_META.title}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <Plate round={round} />
      </div>

      <p className="mini-game__prompt">{roundPrompt(round)}</p>

      {canSpeak() ? (
        <p className="mini-game__hint">
          <button
            type="button"
            className="mini-game__next mini-game__say"
            onClick={() => say(roundSpoken(round))}
          >
            Read this aloud
          </button>
        </p>
      ) : null}

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {o} ({fractionInfo(o).word})
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{getFractionFeedback(round, chosen)}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">{roundHint()}</p>
      )}
    </section>
  );
}

export default FractionPizzaGame;
