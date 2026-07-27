import { counted } from '../games/nouns';
import { useState } from 'react';
import {
  SHARE_FAIRLY_META,
  SHARE_ROUNDS,
  getShareOptions,
  getShareFeedback,
  getShareHint,
  shareAnswer,
} from '../games/share-fairly';

const EYEBROW = 'Division • Fair Sharing';
const TITLE = SHARE_FAIRLY_META.title;

export function ShareFairlyGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = SHARE_ROUNDS[index % SHARE_ROUNDS.length];
  const answer = shareAnswer(round);
  const opts = getShareOptions(index);
  const answered = chosen !== null;

  const question = `Share ${counted(round.total, round.item)} on ${counted(round.plates, round.vessel)}. How many on each?`;
  const hint = getShareHint(round);
  const feedback = answered ? getShareFeedback(round, chosen) : '';

  const items = Array.from({ length: round.total }, (_, i) => i);
  const plates = Array.from({ length: round.plates }, (_, i) => i);

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    if (value === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % SHARE_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="share-fairly-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="share-fairly-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <p>
          <span className="mini-game__emoji">{round.total}</span>
          <span aria-hidden="true"> {round.item.glyph} </span>
          <span className="mini-game__emoji"> ÷ </span>
          <span className="mini-game__emoji">{round.plates}</span>
          <span aria-hidden="true"> {round.vessel.glyph}</span>
        </p>
        <div className="mini-game__seq" aria-label={counted(round.total, round.item)}>
          {items.map((i) => (
            <span key={`item-${i}`} className="mini-game__emoji" aria-hidden="true">{round.item.glyph}</span>
          ))}
        </div>
        <div className="mini-game__seq" aria-label={`${counted(round.plates, round.vessel)} to share onto`}>
          {plates.map((i) => (
            <span key={`plate-${i}`} className="mini-game__emoji" aria-hidden="true">{round.vessel.glyph}</span>
          ))}
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
            aria-disabled={answered}
            onClick={() => choose(o)}
          >
            {o} each
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

export default ShareFairlyGame;
