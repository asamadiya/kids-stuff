import { useState } from 'react';
import {
  GROUP_ROUNDS,
  getGroupOptions,
  getGroupFeedback,
  groupAnswer,
  groupOptionLabel,
  HOW_MANY_GROUPS_META,
} from '../games/how-many-groups';

const EYEBROW = 'Division · make equal groups';
const TITLE = HOW_MANY_GROUPS_META.title;

export function HowManyGroupsGame() {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const round = GROUP_ROUNDS[index % GROUP_ROUNDS.length];
  const answer = groupAnswer(round);
  const opts = getGroupOptions(index);
  const answered = chosen !== null;
  const feedback = answered ? getGroupFeedback(round, chosen) : '';

  const items = Array.from({ length: round.total }, (_, i) => i);

  function choose(value: number) {
    if (answered) return;
    setChosen(value);
    setScore((s) => s + 1);
  }

  function next() {
    setIndex((i) => (i + 1) % GROUP_ROUNDS.length);
    setChosen(null);
  }

  return (
    <section className="mini-game" aria-labelledby="how-many-groups-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{EYEBROW}</p>
          <h3 id="how-many-groups-title" className="mini-game__title">{TITLE}</h3>
        </div>
        <div className="mini-game__streak" aria-label={`${score} solved`}>
          <span aria-hidden="true">{'★'.repeat(Math.min(score, 5)) || '☆'}</span> {score}
        </div>
      </div>

      <div className="mini-game__stage">
        <span className="mini-game__emoji" aria-hidden="true">{round.total}</span>
        <div className="mini-game__seq" aria-hidden="true">
          {items.map((i) => (
            <span
              key={i}
              className="mini-game__emoji"
              style={i > 0 && i % round.per === 0 ? { marginLeft: '0.9rem' } : undefined}
            >
              {round.item}
            </span>
          ))}
        </div>
      </div>

      <p className="mini-game__prompt">{round.prompt}</p>

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
            {groupOptionLabel(o)}
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
        <p className="mini-game__hint">Make equal groups of {round.per}, then count the {round.groupWordPlural}.</p>
      )}
    </section>
  );
}

export default HowManyGroupsGame;
