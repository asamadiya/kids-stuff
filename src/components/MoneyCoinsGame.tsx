import { useState } from 'react';
import {
  MONEY_COINS_META,
  MONEY_PROMPT,
  MONEY_ROUNDS,
  COIN_EDGE,
  COIN_FACE,
  COIN_KINDS,
  COIN_LABEL,
  COIN_LEGEND,
  COIN_MM,
  COIN_PX_PER_MM,
  COIN_VALUE,
  centsLabel,
  coinsOf,
  getMoneyOptions,
  getMoneyFeedback,
  roundTotal,
  type MoneyRound,
  type CoinKind,
} from '../games/money-coins';

const EYEBROW = 'Money Math';
const TITLE = MONEY_COINS_META.title;

/**
 * A coin at its real size relative to the others — a dime is smaller than a
 * nickel, 17.91 mm to 21.21 mm — carrying the legend the real coin carries.
 * Nothing on the face is a numeral, because nothing on the real face is either;
 * telling the coins apart, and knowing what each is worth, is the exercise.
 *
 * `data-kind` is the handle the tests use to add up what is actually drawn.
 */
function Coin({ kind }: { kind: CoinKind }): JSX.Element {
  const face = COIN_FACE[kind];
  const diameter = COIN_MM[kind] * COIN_PX_PER_MM;
  const box = Math.round(diameter) + 4;
  const centre = box / 2;
  const words = COIN_LEGEND[kind].split(' ');
  const size = diameter * 0.17;

  return (
    <svg
      data-kind={kind}
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      role="img"
      aria-label={COIN_LABEL[kind]}
    >
      <circle cx={centre} cy={centre} r={diameter / 2} fill={face.fill} stroke={face.line} strokeWidth={1.5} />
      <circle cx={centre} cy={centre} r={diameter / 2 - 3} fill="none" stroke={face.line} strokeWidth={0.75} />
      {words.map((word, i) => (
        <text
          key={word}
          x={centre}
          y={centre + (i - (words.length - 1) / 2) * size * 1.3}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size}
          fontWeight={600}
          letterSpacing={0.4}
          fill={face.ink}
        >
          {word}
        </text>
      ))}
    </svg>
  );
}

function CoinRow({ round }: { round: MoneyRound }): JSX.Element {
  return (
    <div className="mini-game__seq" role="group" aria-label="Coins on the table">
      {coinsOf(round).map((kind, i) => (
        <Coin key={`${kind}-${i}`} kind={kind} />
      ))}
    </div>
  );
}

/** The reference, on demand: what each coin is called, says, is worth and measures. */
function ValueKey(): JSX.Element {
  return (
    <details className="mini-game__key">
      <summary>Coin values</summary>
      <ul className="mini-game__hint">
        {COIN_KINDS.map((kind) => (
          <li key={kind}>
            {COIN_LABEL[kind]} — reads {COIN_LEGEND[kind]} — worth {centsLabel(COIN_VALUE[kind])} —{' '}
            {COIN_MM[kind]} mm across, {COIN_EDGE[kind]} edge
          </li>
        ))}
      </ul>
      <p className="mini-game__hint">
        None of these coins prints a number. Each one spells its value in words.
      </p>
    </details>
  );
}

export function MoneyCoinsGame(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const round = MONEY_ROUNDS[index % MONEY_ROUNDS.length];
  const answer = roundTotal(round);
  const opts = getMoneyOptions(index);
  const hint = 'Each coin is worth a different number of cents. Add them up.';
  const feedback = chosen === null ? '' : getMoneyFeedback(index, chosen);

  function choose(o: number): void {
    if (answered) return;
    setChosen(o);
    setAnswered(true);
    if (o === answer) setScore((s) => s + 1);
  }

  function next(): void {
    setIndex((i) => (i + 1) % MONEY_ROUNDS.length);
    setChosen(null);
    setAnswered(false);
  }

  return (
    <section className="mini-game" aria-labelledby="money-coins-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="money-coins-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <CoinRow round={round} />
      </div>

      <p className="mini-game__prompt">{MONEY_PROMPT}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o) => (
          <button
            key={String(o)}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${
              answered && o === answer ? ' is-correct' : ''
            }`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {centsLabel(o)}
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

      <ValueKey />
    </section>
  );
}

export default MoneyCoinsGame;
