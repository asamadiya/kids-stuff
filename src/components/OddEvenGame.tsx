import { useState } from 'react';
import {
  ODD_EVEN_ROUNDS,
  ODD_EVEN_META,
  getOddEvenOptions,
  getOddEvenFeedback,
  parityLabel,
  pairInfo,
  type Parity,
} from '../games/odd-even';

const EYEBROW = 'Number Sense';

export function OddEvenGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<Parity | null>(null);
  const [score, setScore] = useState(0);

  const round = ODD_EVEN_ROUNDS[index];
  const opts = getOddEvenOptions(index);
  const answered = chosen !== null;
  const answer: Parity = round.answer;
  const { pairs, leftover } = pairInfo(round.n);

  const choose = (o: Parity) => {
    if (answered) return;
    setChosen(o);
    setScore((s) => s + 1);
  };

  const next = () => {
    setChosen(null);
    setIndex((i) => (i + 1) % ODD_EVEN_ROUNDS.length);
  };

  const question = `Is ${round.n} odd or even?`;
  const hint = 'Pair them up two-by-two. Any leftover means odd!';
  const feedback = answered ? getOddEvenFeedback(round, chosen) : '';

  // Render N objects as inline pairs (2 per column), leftover on its own.
  const cells = Array.from({ length: round.n }, (_, k) => k);

  return (
    <section className="mini-game" aria-labelledby="odd-even-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="odd-even-title" className="mini-game__title">{ODD_EVEN_META.title}</h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} solved`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">{round.n}</span>
        <div
          className="mini-game__seq"
          role="img"
          aria-label={`${round.n} ${round.noun} shown as ${pairs} ${pairs === 1 ? 'pair' : 'pairs'}${leftover ? ' with one left over' : ''}`}
        >
          <svg viewBox={`0 0 ${Math.max(1, Math.ceil(round.n / 2)) * 44 + 8} 96`} width="100%" height="96" xmlns="http://www.w3.org/2000/svg">
            {cells.map((k) => {
              const col = Math.floor(k / 2);
              const rowInPair = k % 2;
              const isLeftover = leftover === 1 && k === round.n - 1;
              const x = 4 + col * 44;
              const y = isLeftover ? 44 : rowInPair === 0 ? 6 : 50;
              return (
                <g key={k}>
                  {rowInPair === 0 && !isLeftover ? (
                    <rect x={x} y={4} width={40} height={88} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={2} />
                  ) : null}
                  {isLeftover ? (
                    <rect x={x} y={40} width={40} height={44} rx={10} fill="none" stroke="currentColor" strokeDasharray="4 4" strokeOpacity={0.6} strokeWidth={2} />
                  ) : null}
                  <text x={x + 20} y={y + 30} fontSize={30} textAnchor="middle">{round.emoji}</text>
                </g>
              );
            })}
          </svg>
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
            {parityLabel(o)}
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

export default OddEvenGame;
