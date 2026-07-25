import { useState } from 'react';
import {
  GROUPS_OF_META,
  GROUPS_ROUNDS,
  getGroupsOptions,
  getGroupsFeedback,
  getGroupsHint,
  productOf,
  questionOf,
} from '../games/groups-of';

const EYEBROW = 'Multiplication';
const TITLE = GROUPS_OF_META.title;

export function GroupsOfGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = GROUPS_ROUNDS[index % GROUPS_ROUNDS.length];
  const answer = productOf(round);
  const opts = getGroupsOptions(index);
  const answered = chosen !== null;
  const question = questionOf(round);
  const hint = getGroupsHint(round);
  const feedback = answered ? getGroupsFeedback(round, chosen) : '';

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    if (value === answer) setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % GROUPS_ROUNDS.length);
    setChosen(null);
  }

  const groupIdx = Array.from({ length: round.groups }, (_, i) => i);
  const itemIdx = Array.from({ length: round.per }, (_, i) => i);

  return (
    <section className="mini-game" aria-labelledby="groups-of-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="groups-of-title" className="mini-game__title">
            {TITLE}
          </h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <p className="mini-game__emoji" aria-hidden="true">
          {round.groups} ✖ {round.per}
        </p>
        {groupIdx.map((g) => (
          <div
            key={g}
            className="mini-game__seq"
            aria-label={`${round.unit} ${g + 1} with ${round.per} items`}
          >
            {itemIdx.map((it) => (
              <span key={it} className="mini-game__emoji" aria-hidden="true">
                {round.emoji}
              </span>
            ))}
          </div>
        ))}
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
        <p className="mini-game__hint">{hint}</p>
      )}
    </section>
  );
}

export default GroupsOfGame;
