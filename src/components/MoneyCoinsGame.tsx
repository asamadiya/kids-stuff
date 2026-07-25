import { useState } from 'react';
import {
  MONEY_COINS_META,
  MONEY_ROUNDS,
  COIN_VALUE,
  COIN_LABEL,
  getMoneyOptions,
  getMoneyFeedback,
  roundTotal,
  roundExpression,
  centsLabel,
  type MoneyRound,
  type CoinKind,
} from '../games/money-coins';

const EYEBROW = 'Money Math';
const TITLE = MONEY_COINS_META.title;

const COIN_FILL: Record<CoinKind, string> = {
  dime: '#b8c4cc',
  nickel: '#c9cfd4',
  penny: '#c98a4b',
};
const COIN_STROKE: Record<CoinKind, string> = {
  dime: '#6c7a83',
  nickel: '#7d858b',
  penny: '#8a5a2b',
};

function Coin({ kind, keyId }: { kind: CoinKind; keyId: string }) {
  const value = COIN_VALUE[kind];
  const label = `${COIN_LABEL[kind]} worth ${value} cents`;
  return (
    <svg
      key={keyId}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      role="img"
      aria-label={label}
      style={{ display: 'inline-block', margin: '4px' }}
    >
      <circle
        cx="28"
        cy="28"
        r="24"
        fill={COIN_FILL[kind]}
        stroke={COIN_STROKE[kind]}
        strokeWidth="3"
      />
      <circle cx="28" cy="28" r="19" fill="none" stroke={COIN_STROKE[kind]} strokeWidth="1" opacity="0.5" />
      <text
        x="28"
        y="30"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fontWeight="700"
        fill={COIN_STROKE[kind]}
      >
        {value}c
      </text>
    </svg>
  );
}

function CoinRow({ round }: { round: MoneyRound }) {
  const coins: { kind: CoinKind; id: string }[] = [];
  for (const c of round.coins) {
    for (let i = 0; i < c.count; i += 1) {
      coins.push({ kind: c.kind, id: `${c.kind}-${i}` });
    }
  }
  return (
    <div className="mini-game__seq" aria-hidden="true">
      {coins.map((c) => (
        <Coin key={c.id} kind={c.kind} keyId={c.id} />
      ))}
    </div>
  );
}

export function MoneyCoinsGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const round = MONEY_ROUNDS[index % MONEY_ROUNDS.length];
  const answer = roundTotal(round);
  const opts = getMoneyOptions(index);
  const question = `${roundExpression(round)} = how many cents?`;
  const hint = 'Dimes are 10c, nickels 5c, pennies 1c. Add them all up!';
  const feedback = chosen === null ? '' : getMoneyFeedback(index, chosen);

  function choose(o: number) {
    if (answered) return;
    setChosen(o);
    setAnswered(true);
    if (o === answer) setScore((s) => s + 1);
  }

  function next() {
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
        <span className="mini-game__emoji" aria-hidden="true">
          🪙 = ?c
        </span>
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
    </section>
  );
}

export default MoneyCoinsGame;
