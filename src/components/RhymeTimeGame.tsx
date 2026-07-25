import { useState } from 'react';
import {
  RHYME_ROUNDS,
  RHYME_TIME_META,
  getRhymeOptions,
  getRhymePrompt,
  getRhymeFeedback,
  rhymeLabel,
} from '../games/rhyme-time';

const EYEBROW = 'Listen for the Sound';
const TITLE = RHYME_TIME_META.title;

export function RhymeTimeGame() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const round = RHYME_ROUNDS[roundIndex % RHYME_ROUNDS.length];
  const options = getRhymeOptions(roundIndex);
  const answer = round.rhyme;
  const answered = chosen !== null;
  const question = getRhymePrompt(round);

  function choose(option: string) {
    if (answered) return;
    setChosen(option);
    setScore((s) => s + 1);
  }

  function next() {
    setRoundIndex((i) => (i + 1) % RHYME_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="rhyme-time-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="rhyme-time-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} found`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">found</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">
          {round.emoji}
        </span>
        <span className="mini-game__seq" aria-label={`The word is ${rhymeLabel(round.target)}`}>
          {rhymeLabel(round.target)}
        </span>
      </div>

      <p className="mini-game__prompt">{question}</p>

      <div className="mini-game__options" aria-label="Choose">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`mini-option${chosen === o ? ' is-chosen' : ''}${
              answered && o === answer ? ' is-correct' : ''
            }`}
            aria-pressed={chosen === o}
            disabled={answered}
            onClick={() => choose(o)}
          >
            {rhymeLabel(o)}
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{getRhymeFeedback(round, chosen)}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">Say each word out loud — which one ends the same way?</p>
      )}
    </section>
  );
}

export default RhymeTimeGame;
