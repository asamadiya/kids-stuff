import { useState, type CSSProperties } from 'react';
import {
  LETTER_LAND_META,
  LETTER_QUESTION,
  LETTER_ROUNDS,
  getLetterFeedback,
  getLetterOptions,
  letterOf,
  maskedTail,
  roundId,
  type Letter,
} from '../games/letter-land';
import { canSpeak, say } from '../workshop/say';

const EYEBROW = 'Letter sounds';
const TITLE = LETTER_LAND_META.title;

/**
 * The word is shown with its first letter missing, and spoken on request. The
 * question above it is a constant: the shipped version interpolated the
 * title-cased word into it, so "Which letter does Apple start with?" printed
 * the answer as its own first capital letter.
 */
const WORD: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  gap: '0.12em',
  margin: 0,
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(2.6rem, 2rem + 3vw, 4rem)',
  lineHeight: 1.1,
  color: 'var(--ink)',
};

const SLOT: CSSProperties = {
  display: 'inline-block',
  minWidth: '0.72em',
  minHeight: '1em',
  borderBottom: '4px solid var(--terracotta)',
  color: 'var(--terracotta)',
  textAlign: 'center',
};

export function LetterLandGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<Letter | null>(null);
  const [score, setScore] = useState(0);

  const round = LETTER_ROUNDS[roundIndex % LETTER_ROUNDS.length];
  const opts = getLetterOptions(roundIndex);
  const answer = letterOf(round);
  const tail = maskedTail(round);
  const answered = chosen !== null;
  const feedback = answered ? getLetterFeedback(round, chosen) : '';

  function choose(o: Letter) {
    if (answered) return;
    setChosen(o);
    if (o === answer) setScore((s) => s + 1);
  }

  function next() {
    const nextIndex = (roundIndex + 1) % LETTER_ROUNDS.length;
    setChosen(null);
    setRoundIndex(nextIndex);
    // Spoken on the child's own tap, which is both the polite moment and the
    // only one the browser will allow.
    say(LETTER_ROUNDS[nextIndex].word);
  }

  return (
    <section className="mini-game" aria-labelledby="letter-land-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="letter-land-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage" data-testid="stage">
        <p style={WORD} data-testid="masked-word">
          {answered ? (
            <span style={SLOT} data-testid="letter-slot">{answer}</span>
          ) : (
            <span style={SLOT} data-testid="letter-slot" role="img" aria-label="the missing first letter" />
          )}
          {tail.split('').map((ch, i) => (
            <span key={`${roundId(round)}-${i}`} data-testid="letter-tile">{ch}</span>
          ))}
        </p>

        {canSpeak() ? (
          <button
            type="button"
            className="mini-game__next"
            data-testid="hear-word"
            onClick={() => say(round.word)}
          >
            Hear the word
          </button>
        ) : null}
      </div>

      <p className="mini-game__prompt" data-testid="prompt">{LETTER_QUESTION}</p>

      <div className="mini-game__options" aria-label="Choose">
        {opts.map((o, i) => (
          <button
            key={`${roundId(round)}-${o}-${i}`}
            type="button"
            data-testid="option"
            data-letter={o}
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${answered && o === answer ? ' is-correct' : ''}`}
            aria-pressed={chosen === o}
            aria-disabled={answered}
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
        <p className="mini-game__hint">
          Say the word out loud. The sound at the very front is the one the letter writes.
        </p>
      )}
    </section>
  );
}

export default LetterLandGame;
