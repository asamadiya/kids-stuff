import { useMemo, useState } from 'react';
import { comicFeedback, comicOptions } from '../games/comic';
import type { ComicMeta, ComicScenario } from '../games/comic';

const BASE = import.meta.env.BASE_URL;

export interface ComicSelGameProps {
  readonly meta: ComicMeta;
  readonly scenarios: readonly ComicScenario[];
  readonly eyebrow?: string;
}

export function ComicSelGame({ meta, scenarios, eyebrow = 'Friends & feelings' }: ComicSelGameProps) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const scn = scenarios[index % scenarios.length];
  const options = useMemo(() => comicOptions(scn, index), [scn, index]);
  const answered = chosen !== null;

  const choose = (id: string) => {
    if (answered) return;
    setChosen(id);
    setScore((s) => s + 1);
  };
  const next = () => {
    setIndex((i) => (i + 1) % scenarios.length);
    setChosen(null);
  };

  return (
    <section className="mini-game" aria-labelledby={`${meta.id}-title`}>
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">{eyebrow}</p>
          <h3 id={`${meta.id}-title`} className="mini-game__title">{meta.title}</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} done`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">done</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <img
          className="comic-image"
          src={`${BASE}games/comics/${scn.comic}.png`}
          alt={scn.prompt}
          loading="eager"
        />
      </div>
      <p className="mini-game__prompt">{scn.prompt}</p>

      <div
        className={`mini-game__options${scn.kind === 'feel' ? ' mini-game__options--faces' : ''}`}
        aria-label="Choose"
      >
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`mini-option${scn.kind === 'feel' ? ' mini-option--face' : ''}${
              chosen === o.id ? ' is-chosen' : ''
            }${answered && o.id === scn.answerId ? ' is-correct' : ''}`}
            aria-pressed={chosen === o.id}
            disabled={answered}
            onClick={() => choose(o.id)}
          >
            {o.face ? <img src={`${BASE}games/faces/${o.face}.png`} alt="" aria-hidden="true" /> : null}
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{comicFeedback(scn, chosen)}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">Look at the story pictures in order, then choose.</p>
      )}
    </section>
  );
}

export default ComicSelGame;
