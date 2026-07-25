import { useMemo, useState } from 'react';
import {
  SCENE_ROUNDS,
  getSceneFeedback,
  getSceneOptions,
  sceneLabel,
} from '../games/scenes';

const BASE = import.meta.env.BASE_URL;

export function ScenesGame() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const round = SCENE_ROUNDS[index % SCENE_ROUNDS.length];
  const options = useMemo(() => getSceneOptions(index), [index]);
  const answered = selected !== null;

  const choose = (feeling: string) => {
    if (answered) return;
    setSelected(feeling);
    if (feeling === round.feeling) setScore((s) => s + 1);
  };
  const next = () => {
    setIndex((i) => (i + 1) % SCENE_ROUNDS.length);
    setSelected(null);
  };

  return (
    <section className="mini-game" aria-labelledby="scenes-title">
      <div className="mini-game__head">
        <div>
          <p className="mini-game__eyebrow">Friends &amp; feelings</p>
          <h3 id="scenes-title" className="mini-game__title">Feeling Scenes</h3>
        </div>
        <div className="mini-game__tally" aria-label={`${score} correct`}>
          <span className="mini-game__tally-count">{score}</span>
          <span className="mini-game__tally-label">correct</span>
        </div>
      </div>

      <div className="mini-game__stage">
        <img
          className="scene-image"
          src={`${BASE}games/scenes/${round.id}.png`}
          alt={round.text}
          loading="eager"
        />
      </div>
      <p className="mini-game__prompt">
        {round.text} How does {round.who} feel?
      </p>

      <div className="mini-game__options mini-game__options--faces" aria-label="Choose a feeling">
        {options.map((feeling) => (
          <button
            key={feeling}
            type="button"
            className={`mini-option mini-option--face${selected === feeling ? ' is-chosen' : ''}${
              answered && feeling === round.feeling ? ' is-correct' : ''
            }`}
            aria-pressed={selected === feeling}
            disabled={answered}
            onClick={() => choose(feeling)}
          >
            <img src={`${BASE}games/faces/${feeling}.png`} alt="" aria-hidden="true" />
            <span>{sceneLabel(feeling)}</span>
          </button>
        ))}
      </div>

      {answered ? (
        <div className="mini-game__feedback">
          <p role="status">{getSceneFeedback(round, selected)}</p>
          <button type="button" className="mini-game__next" onClick={next}>
            Next <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      ) : (
        <p className="mini-game__hint">Look at the picture. There can be more than one good answer.</p>
      )}
    </section>
  );
}

export default ScenesGame;
