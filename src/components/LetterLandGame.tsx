import { useState } from 'react';
import {
  LETTER_LAND_META,
  LETTER_ROUNDS,
  getLetterOptions,
  getLetterFeedback,
  wordTitle,
  type Letter,
} from '../games/letter-land';

const EYEBROW = 'Letter sounds';
const TITLE = LETTER_LAND_META.title;

export function LetterLandGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<Letter | null>(null);
  const [score, setScore] = useState(0);

  const round = LETTER_ROUNDS[roundIndex % LETTER_ROUNDS.length];
  const opts = getLetterOptions(roundIndex);
  const answer = round.letter;
  const answered = chosen !== null;
  const question = `Which letter does ${wordTitle(round.word)} start with?`;
  const feedback = answered ? getLetterFeedback(round, chosen) : '';

  function choose(o: Letter) {
    if (answered) return;
    setChosen(o);
    setScore((s) => s + 1);
  }

  function next() {
    setChosen(null);
    setRoundIndex((i) => (i + 1) % LETTER_ROUNDS.length);
  }

  return (
    <section className="mini-game" aria-labelledby="letter-land-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="letter-land-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} found`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" role="img" aria-label={round.word}>{round.emoji}</span>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o, i) => (
          <button
            key={`${round.id}-${o}-${i}`}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
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
        <p className="mini-game__hint">Say the word out loud — what sound do you hear first?</p>
      )}
    </section>
  );
}

export default LetterLandGame;
