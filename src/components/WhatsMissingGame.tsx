import { useState } from 'react';
import {
  WHATS_MISSING_META,
  MISSING_ROUNDS,
  getMissingOptions,
  getMissingFeedback,
  equationParts,
} from '../games/whats-missing';

const EYEBROW = 'Number Detective';

export function WhatsMissingGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = MISSING_ROUNDS[index % MISSING_ROUNDS.length];
  const opts = getMissingOptions(index);
  const answer = round.answer;
  const answered = chosen !== null;
  const parts = equationParts(round, '?');

  const question = 'Which number fills the blank box?';
  const hint = 'Tip: think about how far the numbers are apart.';
  const feedback = answered ? getMissingFeedback(round, chosen) : '';

  const choose = (o: number) => {
    if (answered) return;
    setChosen(o);
    setScore((s) => s + 1);
  };

  const next = () => {
    setIndex((i) => (i + 1) % MISSING_ROUNDS.length);
    setChosen(null);
  };

  const box = (text: string, isBlank: boolean) => (
    <span
      className="mini-game__emoji"
      style={
        isBlank
          ? { border: '3px dashed currentColor', borderRadius: '0.4em', padding: '0 0.25em' }
          : undefined
      }
    >
      {text}
    </span>
  );

  return (
    <section className="mini-game" aria-labelledby="whats-missing-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="whats-missing-title" className="mini-game__title">
            {WHATS_MISSING_META.title}
          </h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} solved`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <div className="mini-game__seq" aria-label={`${parts.left} ${round.op} ${parts.right} equals ${parts.total}`}>
          {box(parts.left, round.blank === 'a')}
          <span className="mini-game__emoji" aria-hidden="true">{round.op}</span>
          {box(parts.right, round.blank === 'b')}
          <span className="mini-game__emoji" aria-hidden="true">=</span>
          {box(parts.total, round.blank === 'total')}
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
            {String(o)}
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

export default WhatsMissingGame;
